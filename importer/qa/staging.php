<?php
// CLI-only staging adapter. Never install this helper in wp-content or expose it by HTTP.
if(PHP_SAPI!=='cli')exit(1);
$_SERVER['HTTP_HOST']='localhost:8086';
require '/var/www/html/wp-load.php';
$admins=get_users(['role'=>'administrator','number'=>1]);wp_set_current_user($admins[0]->ID);
$action=$argv[1]??'snapshot';
function snapshot(){ $data=[];foreach(get_posts(['post_type'=>'page','post_status'=>'any','numberposts'=>-1]) as $p)$data[$p->ID]=hash('sha256',$p->post_content.get_post_meta($p->ID,'_kghq_css',true));return $data; }
if($action==='snapshot'){echo wp_json_encode(snapshot());exit;}
if($action==='theme'){switch_theme($argv[2]);echo wp_get_theme()->get('Name');exit;}
if($action==='import'){
 $before=snapshot();$bundle=json_decode(file_get_contents($argv[2]),true);
 $valid=\KGHQ\Importer\Plugin::validate_bundle($bundle);if(is_wp_error($valid)){fwrite(STDERR,$valid->get_error_message());exit(1);}
 foreach($bundle['pages'] as $p)if(\KGHQ\Importer\Plugin::existing($bundle['repository'],$p['route'])){fwrite(STDERR,'Refusing to overwrite a pre-existing staging page: '.$p['route']);exit(1);}
 $job=wp_generate_password(32,false,false);set_transient('kghq_job_'.get_current_user_id().'_'.$job,$bundle,HOUR_IN_SECONDS);$results=[];
 foreach($bundle['pages'] as $p){$r=new WP_REST_Request('POST');$r->set_param('job',$job);$r->set_param('route',$p['route']);$r->set_param('replace',false);$r->set_param('settings',['width'=>1440,'canvas'=>true,'full'=>true,'header'=>false,'footer'=>false]);$result=\KGHQ\Importer\Plugin::import($r);if(is_wp_error($result)){fwrite(STDERR,$result->get_error_message());exit(1);} $result['route']=$p['route'];$results[]=$result;}
 $after=snapshot();foreach($before as $id=>$hash)if(($after[$id]??null)!==$hash){fwrite(STDERR,'Pre-existing page was modified');exit(1);}
 echo wp_json_encode(['results'=>$results,'preexistingPagesUnchanged'=>true]);exit;
}
if($action==='content'){echo get_post((int)$argv[2])->post_content;exit;}
exit(1);
