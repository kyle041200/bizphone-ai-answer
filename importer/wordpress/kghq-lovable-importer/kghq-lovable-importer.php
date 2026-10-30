<?php
/**
 * Plugin Name: KGHQ Lovable Importer
 * Description: Imports selected converter bundles into editable native Gutenberg draft pages. Requires the independent KGHQ Import Styles companion for styling.
 * Version: 0.5.0-rc1
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * Author: KGHQ
 * License: GPL-2.0-or-later
 */
namespace KGHQ\Importer;
if (!defined('ABSPATH')) { exit; }
final class Plugin {
 const META = '_kghq_source_key';
 const ALLOWED = ['core/group','core/heading','core/paragraph','core/image','core/buttons','core/button','core/columns','core/column','core/list','core/list-item','core/separator','core/details','kghq/link-group'];
 static function boot() {
  add_action('admin_menu', fn()=>add_management_page('KGHQ Lovable Importer','KGHQ Lovable Importer','manage_options','kghq-importer',[self::class,'screen']));
  add_action('admin_enqueue_scripts',function($hook){if($hook!=='tools_page_kghq-importer')return; wp_enqueue_style('kghq-import-admin',plugins_url('admin.css',__FILE__),[], '0.5.0-rc1');wp_enqueue_script('kghq-import-admin',plugins_url('admin.js',__FILE__),[], '0.5.0-rc1',true);wp_localize_script('kghq-import-admin','KGHQ_IMPORT',['api'=>rest_url('kghq-importer/v1/'),'nonce'=>wp_create_nonce('wp_rest')]);});
  add_action('rest_api_init',function(){foreach(['stage','import'] as $action)register_rest_route('kghq-importer/v1','/'.$action,['methods'=>'POST','permission_callback'=>[self::class,'permission'],'callback'=>[self::class,$action]]);});
 }
 static function permission(){return current_user_can('manage_options')&&current_user_can('edit_pages')&&current_user_can('upload_files')&&current_user_can('unfiltered_html');}
 static function error($message,$status=400){return new \WP_Error('kghq_import',$message,['status'=>$status]);}
 static function github($path){
  $headers=['Accept'=>'application/vnd.github+json','X-GitHub-Api-Version'=>'2022-11-28'];
  // A server configuration secret; never accepted in browser requests or returned to the client.
  if(defined('KGHQ_GITHUB_TOKEN')&&KGHQ_GITHUB_TOKEN)$headers['Authorization']='Bearer '.KGHQ_GITHUB_TOKEN;
  $response=wp_remote_get('https://api.github.com/'.$path,['headers'=>$headers,'timeout'=>25,'redirection'=>0,'limit_response_size'=>8*1024*1024]);
  if(is_wp_error($response))return self::error('GitHub request failed. Check server connectivity.');
  if(wp_remote_retrieve_response_code($response)!==200)return self::error('GitHub denied the request or the repository/ref was not found. Verify server-side access and API rate limits.');
  return json_decode(wp_remote_retrieve_body($response),true);
 }
 static function scan($request){
  $repository=trim((string)$request->get_param('repository'));$ref=trim((string)($request->get_param('ref')?:'main'));
  if(!preg_match('~^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$~',$repository)||strlen($ref)>200)return self::error('Use owner/repository and a valid ref.');
  $tree=self::github('repos/'.$repository.'/git/trees/'.rawurlencode($ref).'?recursive=1');if(is_wp_error($tree))return $tree;
  if(!is_array($tree)||!empty($tree['truncated']))return self::error('Repository tree is unavailable or truncated. Use the local CLI scanner.');
  $pages=[];$warnings=[];foreach($tree['tree']??[] as $file){$p=$file['path'];if(!preg_match('~(?:^|/)src/routes/(.+)\.[jt]sx?$~',$p,$m)||str_contains($p,'node_modules/'))continue;
   $name=$m[1];if(str_starts_with($name,'__'))continue;
   if(str_contains($name,'$')){$warnings[]=$p.': dynamic route needs concrete URLs in CLI conversion.';continue;}
   $name=preg_replace('~_$~','',$name);$route=$name==='index'?'/':'/'.str_replace('.','/',$name);
   $pages[]=['path'=>$route,'title'=>$name==='index'?'Home':ucwords(str_replace('-',' ',$name)),'file'=>$p];
  }
  return ['repository'=>$repository,'ref'=>$ref,'pages'=>$pages,'warnings'=>array_merge($warnings,['GitHub scan is a TanStack file-route preview. CLI AST scan and bundle routes are authoritative. React Router configurations need explicit CLI routes.'])];
 }
 static function validate_bundle($bundle){
  if(!is_array($bundle)||($bundle['schemaVersion']??null)!==1||!is_string($bundle['repository']??null)||!preg_match('~^[\w.-]+/[\w.-]+$~',$bundle['repository']??''))return self::error('Invalid converter bundle schema/repository.');
  if(isset($bundle['sourceCommit'])&&(!is_string($bundle['sourceCommit'])||!preg_match('/^[a-f0-9]{40}$/',$bundle['sourceCommit'])))return self::error('Malformed source commit.');
  if(!is_array($bundle['pages']??null)||!is_array($bundle['assets']??null))return self::error('Pages and assets must be arrays.');
  if(empty($bundle['pages'])||count($bundle['pages'])>50||count($bundle['assets']??[])>1000)return self::error('Bundle must have 1–50 pages and at most 1000 assets.');
  $ids=[];$bytes=0;foreach($bundle['assets']??[] as $asset){
   if(!is_array($asset)||!is_string($asset['id']??null)||!is_string($asset['data']??null)||!is_string($asset['filename']??null))return self::error('Malformed asset fields.');
   if(!preg_match('/^[a-f0-9]{64}$/',$asset['id']??'')||isset($ids[$asset['id']]))return self::error('Invalid or duplicate asset ID.');
   $data=base64_decode($asset['data']??'',true);if($data===false||hash('sha256',$data)!==$asset['id'])return self::error('Asset integrity check failed.');
   $bytes+=strlen($data);if($bytes>35*1024*1024)return self::error('Decoded assets exceed 35 MB. Convert fewer pages.');
   if(!self::asset_type($data))return self::error('Unsupported asset; only PNG, JPEG, GIF, WebP, WOFF/WOFF2 are accepted. Rasterize SVG first.');$ids[$asset['id']]=true;
  }
  $routes=[];foreach($bundle['pages'] as $page){
   if(!is_array($page))return self::error('Malformed page.');foreach(['route','title','scope','content','css'] as $field)if(!is_string($page[$field]??null))return self::error('Malformed page field: '.$field);
   if(isset($page['warnings'])&&(!is_array($page['warnings'])||array_filter($page['warnings'],static fn($warning)=>!is_string($warning))))return self::error('Warnings must be strings.');
   if(!preg_match('~^/(?!/)[A-Za-z0-9/_-]*$~',$page['route']??'')||isset($routes[$page['route']]))return self::error('Invalid or duplicate route.');$routes[$page['route']]=true;
   if(!preg_match('/^kghq-page-[a-f0-9]{12}$/',$page['scope']??'')||strlen($page['content']??'')>2*1024*1024||strlen($page['css']??'')>3*1024*1024)return self::error('Invalid scope or excessive page size.');
   if(!str_contains($page['content'],$page['scope'])||!str_contains($page['css'],$page['scope']))return self::error('Missing page CSS scope.');
   if(preg_match('~</?style|@import|expression\s*\(|javascript:|behavior\s*:|-moz-binding~i',$page['css']))return self::error('Unsafe or external stylesheet construct.');
   preg_match_all('~url\(\s*["\']?([^\s"\')]+)~i',$page['css'],$css_urls);foreach($css_urls[1] as $url)if(!preg_match('~^https://kghq\.invalid/asset/[a-f0-9]{64}$~',$url)&&$url!=='data:,')return self::error('All CSS assets must be embedded in the bundle.');
   if(preg_replace('~\s*/>~','/>',wp_kses_post($page['content']))!==preg_replace('~\s*/>~','/>',$page['content']))return self::error('Page contains unsafe HTML; import refused rather than silently changing saved block markup.');
   $valid=self::validate_blocks(parse_blocks($page['content']));if(is_wp_error($valid))return $valid;
   preg_match_all('~https://kghq\.invalid/asset/([a-f0-9]{64})~',$page['content'].$page['css'],$matches);foreach($matches[1] as $id)if(!isset($ids[$id]))return self::error('Missing referenced asset.');
  }return true;
 }
 static function validate_blocks($blocks,$depth=0){if($depth>40||count($blocks)>2000)return self::error('Block tree is too deep or large.');foreach($blocks as $b){if(!$b['blockName']){if(trim($b['innerHTML']))return self::error('Freeform HTML is not supported.');continue;}if(!in_array($b['blockName'],self::ALLOWED,true))return self::error('Unsupported block: '.$b['blockName']);$r=self::validate_blocks($b['innerBlocks'],$depth+1);if(is_wp_error($r))return $r;}return true;}
 static function asset_type($data){
  $image=@getimagesizefromstring($data);
  if($image&&$image[0]>0&&$image[1]>0&&$image[0]*$image[1]<=32*1024*1024){$types=['image/png'=>'png','image/jpeg'=>'jpg','image/gif'=>'gif','image/webp'=>'webp'];if(isset($types[$image['mime']]))return [$types[$image['mime']],$image['mime']];}
  if(strlen($data)>=48&&str_starts_with($data,'wOF2'))return ['woff2','font/woff2'];if(strlen($data)>=44&&str_starts_with($data,'wOFF'))return ['woff','font/woff'];return false;
 }

 static function stage($request){
  $files=$request->get_file_params();$file=$files['bundle']??null;if(!$file||$file['error']||$file['size']>48*1024*1024)return self::error('Upload a JSON bundle under 48 MB (also subject to server upload limits).');
  $bundle=json_decode(file_get_contents($file['tmp_name']),true);$valid=self::validate_bundle($bundle);if(is_wp_error($valid))return $valid;return self::store_bundle($bundle);
 }
 static function store_bundle($bundle){
  $job=wp_generate_password(32,false,false);set_transient('kghq_job_'.get_current_user_id().'_'.$job,$bundle,HOUR_IN_SECONDS);
  return ['job'=>$job,'repository'=>$bundle['repository'],'pages'=>array_map(fn($p)=>['path'=>$p['route'],'title'=>$p['title'],'warnings'=>$p['warnings']??[],'existing'=>self::existing($bundle['repository'],$p['route'])],$bundle['pages'])];
 }
 static function key($repository,$route){return hash('sha256',strtolower($repository).'|'.$route);}
 static function existing($repository,$route){$ids=get_posts(['post_type'=>'page','post_status'=>['publish','draft','pending','private','future','trash'],'meta_key'=>self::META,'meta_value'=>self::key($repository,$route),'fields'=>'ids','numberposts'=>2]);return count($ids)>1?-1:($ids[0]??0);}
 static function import($request){
  if(!function_exists('kghq_import_styles_version'))return self::error('Activate the independent KGHQ Import Styles companion before import.');
  $job=(string)$request->get_param('job');if(!preg_match('/^[A-Za-z0-9]{32}$/',$job))return self::error('Invalid job.');$bundle=get_transient('kghq_job_'.get_current_user_id().'_'.$job);if(!$bundle)return self::error('Conversion expired. Scan and convert again.');
  $route=(string)$request->get_param('route');$page=null;foreach($bundle['pages'] as $p)if($p['route']===$route)$page=$p;if(!$page)return self::error('Route was not in this bundle.');
  $settings=$request->get_param('settings')?:[];if(!is_array($settings))return self::error('Settings must be an object.');$width=absint($settings['width']??1200);if($width<320||$width>2560)return self::error('Content width must be 320–2560 pixels.');
  $key=self::key($bundle['repository'],$route);$lock='kghq_lock_'.$key;
  if(!add_option($lock,time(),'','no'))return self::error('This page is being imported. If interrupted, clear the stale lock with WP-CLI after checking no import is running.',409);
  try{return self::import_page($bundle,$page,$request->get_param('replace')===true,$settings,$width);}finally{delete_option($lock);}
 }
 static function import_page($bundle,$page,$replace,$settings,$width){
  $existing=self::existing($bundle['repository'],$page['route']);if($existing===-1)return self::error('Multiple existing source pages found. Resolve manually.',409);
  if($existing&&!current_user_can('edit_post',$existing))return self::error('Cannot edit the existing page.',403);
  if($existing&&get_post_status($existing)==='trash')return self::error('Existing imported page is in Trash. Restore it before reimport.',409);
  if($existing&&!$replace)return ['id'=>$existing,'status'=>'preserved','message'=>'Existing page and edits preserved; explicit replacement was not approved.','preview'=>get_preview_post_link($existing),'edit'=>get_edit_post_link($existing,'raw')];
  require_once ABSPATH.'wp-admin/includes/file.php';require_once ABSPATH.'wp-admin/includes/image.php';
  add_filter('upload_mimes',static fn($types)=>array_merge($types,['woff'=>'font/woff','woff2'=>'font/woff2']));
  $map=[];$media_ids=[];$new=[];$needed=[];preg_match_all('~https://kghq\.invalid/asset/([a-f0-9]{64})~',$page['content'].$page['css'],$matches);$needed=array_flip($matches[1]);
  try {
   foreach($bundle['assets'] as $asset){if(!isset($needed[$asset['id']]))continue;
    $ids=get_posts(['post_type'=>'attachment','post_status'=>'inherit','meta_key'=>'_kghq_asset_hash','meta_value'=>$asset['id'],'fields'=>'ids','numberposts'=>1]);$id=$ids[0]??0;
    if(!$id){$data=base64_decode($asset['data'],true);[$ext,$mime]=self::asset_type($data);$upload=wp_upload_bits('kghq-'.substr($asset['id'],0,24).'.'.$ext,null,$data);if($upload['error'])throw new \RuntimeException('Media write failed.');
     $id=wp_insert_attachment(['post_title'=>sanitize_text_field(pathinfo($asset['filename'],PATHINFO_FILENAME)),'post_mime_type'=>$mime,'post_status'=>'inherit'],$upload['file'],0,true);if(is_wp_error($id)){wp_delete_file($upload['file']);throw new \RuntimeException('Attachment creation failed.');}
     $new[]=$id;update_post_meta($id,'_kghq_asset_hash',$asset['id']);if(str_starts_with($mime,'image/'))wp_update_attachment_metadata($id,wp_generate_attachment_metadata($id,$upload['file']));
    }
    $url=wp_get_attachment_url($id);if(!$url)throw new \RuntimeException('Attachment URL unavailable.');$map['https://kghq.invalid/asset/'.$asset['id']]=$url;$media_ids[$url]=$id;
   }
   $content=serialize_blocks(self::media_blocks(parse_blocks(strtr($page['content'],$map)),$media_ids));$css=strtr($page['css'],$map);
   $post=['post_type'=>'page','post_status'=>'draft','post_title'=>sanitize_text_field($page['title']),'post_content'=>$content];
   if($existing){wp_save_post_revision($existing);$post['ID']=$existing;}else{$post['post_name']='kghq-'.trim(str_replace('/','-',$page['route']),'-');if($page['route']==='/')$post['post_name']='kghq-home';}
   // Slug collisions with unrelated pages are handled by WordPress, never by updating them.
   $id=wp_insert_post(wp_slash($post),true);if(is_wp_error($id))throw new \RuntimeException('Could not save the draft page.');
   update_post_meta($id,self::META,self::key($bundle['repository'],$page['route']));update_post_meta($id,'_kghq_repository',$bundle['repository']);update_post_meta($id,'_kghq_route',$page['route']);update_post_meta($id,'_kghq_source_commit',preg_match('/^[a-f0-9]{40}$/',$bundle['sourceCommit']??'')?$bundle['sourceCommit']:'');update_post_meta($id,'_kghq_css',wp_slash($css));update_post_meta($id,'_kghq_scope',$page['scope']);update_post_meta($id,'_kghq_content_hash',hash('sha256',$content));update_post_meta($id,'_kghq_warnings',$page['warnings']??[]);
   update_post_meta($id,'_kghq_layout',['width'=>$width,'full'=>!empty($settings['full']),'header'=>!empty($settings['header']),'footer'=>!empty($settings['footer'])]);
   if(!empty($settings['canvas']))update_post_meta($id,'_wp_page_template','kghq-canvas.php');
   return ['id'=>$id,'status'=>$existing?'updated':'created','message'=>'Draft saved with native blocks. Styling requires the separate companion plugin.','preview'=>get_preview_post_link($id),'edit'=>get_edit_post_link($id,'raw'),'warnings'=>$page['warnings']??[]];
  }catch(\Throwable $error){foreach($new as $attachment)wp_delete_attachment($attachment,true);return self::error($error->getMessage(),500);}
 }
 static function media_blocks($blocks,$ids){
  foreach($blocks as &$block){
   $url=$block['attrs']['url']??'';
   if($block['blockName']==='core/image'&&!$url){$image=new \WP_HTML_Tag_Processor($block['innerHTML']);if($image->next_tag('IMG'))$url=$image->get_attribute('src');}
   if($block['blockName']==='core/image'&&$url&&isset($ids[$url])){
    $id=$ids[$url];$block['attrs']['id']=$id;
    $add=static function($html)use($id){$p=new \WP_HTML_Tag_Processor($html);if($p->next_tag('IMG'))$p->add_class('wp-image-'.$id);return $p->get_updated_html();};
    $block['innerHTML']=$add($block['innerHTML']);foreach($block['innerContent'] as &$piece)if(is_string($piece)&&str_contains($piece,'<img'))$piece=$add($piece);unset($piece);
   }
   if($block['innerBlocks'])$block['innerBlocks']=self::media_blocks($block['innerBlocks'],$ids);
  }unset($block);return $blocks;
 }
 static function screen(){
  $theme=wp_get_theme();$parent=$theme->parent();$known=in_array(strtolower($theme->get_template()),['generatepress','neve','astra','kadence','oceanwp'],true);
  ?>
  <div class="wrap kghq-admin"><div class="kghq-hero"><span class="kghq-badge">KGHQ / LOVABLE IMPORTER</span><h1>Repository to editable WordPress drafts</h1><p>Connect a project, choose pages, and review the resulting drafts.</p></div>
  <?php if(!Worker::configured()): ?><div class="notice notice-warning inline"><p>The site operator must connect a secure conversion worker before importing. No hosted worker is included automatically. See the worker setup instructions.</p></div><?php endif; ?>
  <section class="kghq-card"><h2>1. Enter Lovable GitHub repository</h2><label>GitHub repository URL or owner/repository <input id="kghq-repository" placeholder="https://github.com/owner/repository" autocomplete="off"></label><button class="button button-primary" id="kghq-scan">Scan Website</button><p>The default branch is detected automatically. Public and authorized private repositories use the worker’s server-side GitHub connection; no access token is entered here.</p><p id="kghq-job-info" aria-live="polite"></p></section>
  <section class="kghq-card"><div class="kghq-row"><h2>2. Select pages and import</h2><button class="button" id="kghq-all">Select All</button><button class="button" id="kghq-none">Deselect All</button></div><div id="kghq-pages"><p>Scan a repository to discover its pages.</p></div>
  <details><summary>Compatibility report and import options</summary><pre id="kghq-compatibility" style="white-space:pre-wrap;max-height:360px;overflow:auto">No scan yet.</pre>
  <p>Active theme: <strong><?php echo esc_html($theme->get('Name')); ?></strong><?php echo $parent?' · child of '.esc_html($parent->get('Name')):''; ?>. Theme detection is not a compatibility certification.</p><p>Independent styling companion: <strong><?php echo function_exists('kghq_import_styles_version')?'active':'required — activate KGHQ Import Styles'; ?></strong></p>
  <label>Content width (px) <input id="kghq-width" type="number" min="320" max="2560" value="1200"></label><label><input id="kghq-canvas" type="checkbox"> Use independent canvas template for imported pages</label><label><input id="kghq-full" type="checkbox"> Full viewport width (canvas)</label><label><input id="kghq-header" type="checkbox" checked> Include existing theme header (canvas)</label><label><input id="kghq-footer" type="checkbox" checked> Include existing theme footer (canvas)</label><p>These options affect imported pages only; existing navigation and global theme settings stay intact.</p>
  <label class="kghq-warning"><input id="kghq-replace" type="checkbox"> I explicitly approve replacing selected previously imported pages and their edits, returning them to drafts.</label>
  <label class="kghq-warning"><input id="kghq-missing-assets" type="checkbox"> Allow reported missing fonts/CSS assets; fidelity will require review.</label><label class="kghq-warning"><input id="kghq-missing-images" type="checkbox"> Allow reported missing images as explicit placeholders.</label></details>
  <label class="kghq-warning" id="kghq-interaction-warning" hidden><input id="kghq-interactions" type="checkbox"> I have reviewed unsupported interactions and integrations. Import static editable content; these features will require WordPress integrations before publishing.</label>
  <button class="button button-primary button-hero" id="kghq-import" disabled>Convert &amp; Import Selected Pages</button><progress id="kghq-progress" max="100" value="0"></progress><div id="kghq-log" role="status" aria-live="polite"></div></section>
  <?php if(defined('KGHQ_IMPORTER_DEVELOPER_MODE')&&KGHQ_IMPORTER_DEVELOPER_MODE): ?><details class="kghq-card"><summary>Developer troubleshooting only</summary><label>Load a reviewed conversion bundle <input type="file" id="kghq-bundle" accept="application/json,.json"></label></details><?php endif; ?>
  <p>Imported pages are drafts. Removing the importer preserves pages and media; keep KGHQ Import Styles active for project styling, canvas templates, and Linked Layout editor controls. Review unsupported features, internal links, preview appearance, and editor validation before publishing.</p></div>
  <?php
 }
}
Plugin::boot();
require_once __DIR__.'/worker.php';
