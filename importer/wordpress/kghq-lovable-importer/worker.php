<?php
namespace KGHQ\Importer;
if (!defined('ABSPATH')) { exit; }
/** Server-to-server worker bridge. Secrets are configuration-only, never REST/browser data. */
final class Worker {
 static function boot() {
  add_action('rest_api_init',function(){foreach(['scan'=>'scan','convert'=>'convert','worker-status'=>'status'] as $route=>$method)register_rest_route('kghq-importer/v1','/'.$route,['methods'=>'POST','permission_callback'=>[Plugin::class,'permission'],'callback'=>[self::class,$method]]);});
 }
 static function configured(){return defined('KGHQ_WORKER_URL')&&defined('KGHQ_WORKER_TOKEN')&&strlen(KGHQ_WORKER_TOKEN)>=32;}
 static function remote($method,$path,$data=null,$idempotency=null){
  if(!self::configured())return Plugin::error('The site operator must configure KGHQ_WORKER_URL and KGHQ_WORKER_TOKEN on the server.',503);
  $base=rtrim(KGHQ_WORKER_URL,'/');$parts=wp_parse_url($base);
  if(!$parts||!empty($parts['user'])||!empty($parts['pass'])||!empty($parts['query'])||!empty($parts['fragment'])||(($parts['scheme']??'')!=='https'&&!(defined('KGHQ_WORKER_ALLOW_HTTP')&&KGHQ_WORKER_ALLOW_HTTP&&($parts['scheme']??'')==='http')))return Plugin::error('Worker requires HTTPS. Plain HTTP must be explicitly enabled only on a trusted staging/private network.',503);
  $options=['method'=>$method,'headers'=>['Authorization'=>'Bearer '.KGHQ_WORKER_TOKEN,'Content-Type'=>'application/json'],'timeout'=>25,'redirection'=>0,'limit_response_size'=>49*1024*1024,'sslverify'=>true];
  if($data!==null)$options['body']=wp_json_encode($data);if($idempotency)$options['headers']['Idempotency-Key']=$idempotency;
  // URL comes solely from trusted server configuration. Redirects are never followed with credentials.
  $response=wp_remote_request($base.$path,$options);
  if(is_wp_error($response))return Plugin::error('Worker connection failed. Ask the site operator to check TLS, connectivity and worker availability.',502);
  $code=wp_remote_retrieve_response_code($response);$body=json_decode(wp_remote_retrieve_body($response),true);
  if($code<200||$code>=300)return Plugin::error('Worker rejected the request: '.sanitize_text_field($body['message']??('HTTP '.$code)),502);
  if(!is_array($body))return Plugin::error('Worker returned invalid JSON.',502);
  return $body;
 }
 static function key($id){return 'kghq_remote_'.get_current_user_id().'_'.$id;}
 static function create($payload,$binding,$request){
  $key=$request->get_param('request');if(!is_string($key)||!preg_match('/^[a-f0-9]{32}$/',$key))return Plugin::error('Invalid request identifier. Reload the dashboard.');
  // Bind idempotency to this WordPress administrator, even on a shared worker.
  $key=substr(hash_hmac('sha256',get_current_user_id().':'.$key,wp_salt('nonce')),0,32);
  $remote=self::remote('POST','/v1/jobs',$payload,$key);if(is_wp_error($remote))return $remote;
  $id=$remote['id']??'';if(!is_string($id)||!preg_match('/^[a-f0-9]{32}$/',$id))return Plugin::error('Worker returned an invalid job identifier.',502);
  set_transient(self::key($id),$binding,HOUR_IN_SECONDS);
  return ['job'=>$id,'status'=>$remote['status']??'queued','phase'=>$remote['phase']??'queued'];
 }
 static function scan($request){
  $repository=$request->get_param('repository');if(!is_string($repository))return Plugin::error('Enter a GitHub repository.');$repository=trim($repository);
  if(str_starts_with($repository,'https://')){$url=wp_parse_url($repository);if(!$url||($url['host']??'')!=='github.com'||!empty($url['port'])||!empty($url['user'])||!empty($url['pass'])||!empty($url['query'])||!empty($url['fragment']))return Plugin::error('Use a github.com repository URL without credentials or query.');$repository=trim($url['path']??'','/');}
  $repository=preg_replace('/\.git$/','',$repository);if(!preg_match('~^[A-Za-z0-9][A-Za-z0-9_-]*/[A-Za-z0-9][A-Za-z0-9_.-]*$~',$repository))return Plugin::error('Use a GitHub repository URL or owner/repository.');
  return self::create(['kind'=>'scan','repository'=>$repository],['kind'=>'scan','repository'=>$repository],$request);
 }
 static function convert($request){
  if(!function_exists('kghq_import_styles_version'))return Plugin::error('Activate the independent KGHQ Import Styles companion first.');
  $scan=$request->get_param('scan');if(!is_string($scan)||!preg_match('/^[a-f0-9]{32}$/',$scan))return Plugin::error('Scan the repository first.');
  $binding=get_transient(self::key($scan));if(!$binding||$binding['kind']!=='scan'||empty($binding['pages']))return Plugin::error('Scan expired or unavailable. Scan again.');
  $routes=$request->get_param('routes');
  if(!is_array($routes)||!count($routes)||count($routes)>20)return Plugin::error('Select 1–20 pages.');
  foreach($routes as $route)if(!is_string($route)||!in_array($route,$binding['pages'],true))return Plugin::error('Selected route was not in your scan.');
  if(count(array_unique($routes))!==count($routes))return Plugin::error('Duplicate routes are not allowed.');
  return self::create(['kind'=>'convert','scan'=>$scan,'routes'=>$routes,'acceptInteractionLoss'=>$request->get_param('acceptInteractionLoss')===true,'allowMissingAssets'=>$request->get_param('allowMissingAssets')===true,'allowMissingImages'=>$request->get_param('allowMissingImages')===true],['kind'=>'convert','repository'=>$binding['repository'],'commit'=>$binding['commit'],'routes'=>$routes],$request);
 }
 static function status($request){
  $id=$request->get_param('job');if(!is_string($id)||!preg_match('/^[a-f0-9]{32}$/',$id))return Plugin::error('Invalid conversion job.');
  $binding=get_transient(self::key($id));if(!$binding)return Plugin::error('Job expired or belongs to another administrator.',404);
  if(!empty($binding['staged']))return $binding['staged'];
  $remote=self::remote('GET','/v1/jobs/'.$id);if(is_wp_error($remote))return $remote;
  $result=['job'=>$id,'status'=>$remote['status']??'failed','phase'=>$remote['phase']??'failed','warnings'=>$remote['warnings']??[],'progress'=>absint($remote['progress']??0)];
  if($result['status']==='failed'){$result['error']=sanitize_text_field($remote['error']??'Conversion failed. No pages were changed.');return $result;}
  if($result['status']!=='ready')return $result;
  if($binding['kind']==='scan'){
   if(($remote['repository']??null)!==$binding['repository']||!is_string($remote['commit']??null)||!preg_match('/^[a-f0-9]{40}$/',$remote['commit']))return Plugin::error('Scan source identity mismatch.',502);
   $pages=$remote['pages']??null;if(!is_array($pages)||count($pages)>500)return Plugin::error('Invalid or excessive scan results.',502);
   foreach($pages as &$p){if(!is_array($p)||!is_string($p['path']??null)||!preg_match('~^/(?!/)[A-Za-z0-9/_-]*$~',$p['path']))return Plugin::error('Invalid scanned route.',502);$p['title']=sanitize_text_field($p['title']??$p['path']);$p['existing']=Plugin::existing($binding['repository'],$p['path']);$p['existingContent']=(bool)get_page_by_path(trim($p['path'],'/'));}unset($p);
   $binding['pages']=array_column($pages,'path');$binding['commit']=$remote['commit'];
   set_transient(self::key($id),$binding,HOUR_IN_SECONDS);$result['pages']=$pages;$result['commit']=$remote['commit'];$result['ref']=sanitize_text_field($remote['ref']??'');$result['compatibility']=$remote['compatibility']??[];return $result;
  }
  $bundle=self::remote('GET','/v1/jobs/'.$id.'/bundle');if(is_wp_error($bundle))return $bundle;
  $valid=Plugin::validate_bundle($bundle);if(is_wp_error($valid))return $valid;
  $actual=array_column($bundle['pages'],'route');$expected=$binding['routes'];sort($actual);sort($expected);
  if($actual!==$expected||$bundle['repository']!==$binding['repository']||($bundle['sourceCommit']??null)!==$binding['commit'])return Plugin::error('Worker bundle did not match your selected routes and scanned commit.',502);
  $staged=Plugin::store_bundle($bundle);$result=array_merge($result,$staged);$binding['staged']=$result;
  set_transient(self::key($id),$binding,HOUR_IN_SECONDS);return $result;
 }
}
Worker::boot();
