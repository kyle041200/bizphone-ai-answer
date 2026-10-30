<?php
if(PHP_SAPI!=='cli')exit(1);require '/var/www/html/wp-load.php';
if(!in_array(parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true))exit(2);
$phrase='It\'s a "quoted" test -- source punctuation...';$normal=html_entity_decode(wptexturize($phrase),ENT_QUOTES|ENT_HTML5,'UTF-8');$paragraph='<!-- wp:paragraph {"anchor":"qa-punctuation"} --><p id="qa-punctuation">'.htmlspecialchars($phrase,ENT_NOQUOTES,'UTF-8').'</p><!-- /wp:paragraph -->';
$plain=wp_insert_post(['post_type'=>'page','post_status'=>'publish','post_title'=>'QA ordinary WordPress typography','post_content'=>wp_slash($paragraph)],true);
$scope='kghq-page-112233aabbcc';$marked=wp_insert_post(['post_type'=>'page','post_status'=>'draft','post_title'=>'QA source typography preservation','post_content'=>wp_slash('<!-- wp:group {"className":"'.$scope.' kghq-import-root"} --><div class="wp-block-group '.$scope.' kghq-import-root">'.$paragraph.'</div><!-- /wp:group -->')],true);
if(is_wp_error($plain)||is_wp_error($marked))exit(3);
foreach(['_kghq_source_key'=>hash('sha256','qa/format|/punctuation'),'_kghq_repository'=>'qa/format','_kghq_route'=>'/punctuation','_kghq_scope'=>$scope,'_kghq_css'=>'.'.$scope.'{color:rgb(0,0,0)}','_wp_page_template'=>'kghq-canvas.php']as$key=>$value)update_post_meta($marked,$key,$value);
echo wp_json_encode(['ordinaryId'=>$plain,'markedId'=>$marked,'original'=>$phrase,'normalWordPressExpected'=>$normal,'companionVersion'=>kghq_import_styles_version(),'importerClassPresent'=>class_exists(implode(chr(92),['KGHQ','Importer','Plugin']))],JSON_PRETTY_PRINT);
