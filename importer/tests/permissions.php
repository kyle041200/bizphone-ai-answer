<?php
// Execute only in the disposable staging site: wp eval-file /path/permissions.php.
$editor=wp_insert_user(['user_login'=>'kghq-editor-qa-'.time(),'user_pass'=>wp_generate_password(32,true),'role'=>'editor']);
if(is_wp_error($editor))throw new RuntimeException('Could not create permission fixture.');
$results=[];
foreach(['administrator'=>1,'editor'=>$editor,'anonymous'=>0] as $role=>$id){wp_set_current_user($id);$response=rest_do_request(new WP_REST_Request('POST','/kghq-importer/v1/import'));$results[$role]=$response->get_status();}
wp_set_current_user(1);require_once ABSPATH.'wp-admin/includes/user.php';wp_delete_user($editor);
if($results!==['administrator'=>400,'editor'=>403,'anonymous'=>401])throw new RuntimeException('Permission gate mismatch.');
echo wp_json_encode($results);
