<?php
if(PHP_SAPI!=='cli')exit(1);
require '/var/www/html/wp-load.php';
if(!in_array(parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true))exit(2);
wp_set_current_user(get_users(['role'=>'administrator','number'=>1])[0]->ID);
$menu=wp_create_nav_menu('KGHQ existing navigation fixture');if(is_wp_error($menu))throw new RuntimeException('Fixture already exists; do not rerun blindly.');
$page=get_page_by_path('bizphone');wp_update_nav_menu_item($menu,0,['menu-item-title'=>'Existing BizPhone fixture','menu-item-object'=>'page','menu-item-object-id'=>$page->ID,'menu-item-type'=>'post_type','menu-item-status'=>'publish']);
$locations=get_theme_mod('nav_menu_locations',[]);$locations['top']=$menu;set_theme_mod('nav_menu_locations',$locations);
$snapshot=static function()use($menu){return hash('sha256',wp_json_encode(['name'=>get_option('blogname'),'mods'=>get_theme_mods(),'locations'=>get_theme_mod('nav_menu_locations'),'items'=>wp_get_nav_menu_items($menu)]));};
$before=$snapshot();$scope='kghq-page-abcdef123456';$route='/qa-global-preservation';$bundle=['repository'=>'qa/integrity','assets'=>[]];$p=['route'=>$route,'title'=>'QA global preservation canary','scope'=>$scope,'content'=>'<!-- wp:group {"className":"'.$scope.'"} --><div class="wp-block-group '.$scope.'"><!-- wp:paragraph --><p>Disposable preservation canary.</p><!-- /wp:paragraph --></div><!-- /wp:group -->','css'=>'.'.$scope.'{color:rgb(1,2,3)}','warnings'=>[]];
$r=\KGHQ\Importer\Plugin::import_page($bundle,$p,false,['canvas'=>true,'full'=>true,'header'=>false,'footer'=>false],1440);if(is_wp_error($r))throw new RuntimeException($r->get_error_message());
$after=$snapshot();echo wp_json_encode(['status'=>$before===$after?'PASS':'FAIL','menuId'=>$menu,'canaryDraftId'=>$r['id'],'globalSettingsAndExistingMenuHashBefore'=>$before,'globalSettingsAndExistingMenuHashAfter'=>$after,'fixtureScope'=>'QA-only native import canary, not counted as a third Lovable repository or source-page automation test.'],JSON_PRETTY_PRINT);
