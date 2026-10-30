<?php
/**
 * Plugin Name: KGHQ Import Styles
 * Description: Independent persistent styling and optional canvas template for KGHQ native-block imports. Keep active after deleting the importer.
 * Version: 0.5.0-rc2
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * Author: KGHQ
 * License: GPL-2.0-or-later
 */
if(!defined('ABSPATH'))exit;
function kghq_import_styles_version(){return '0.5.0-rc2';}
function kghq_import_styles_css($id){$css=get_post_meta($id,'_kghq_css',true);return is_string($css)&&!preg_match('~</?style~i',$css)?$css:'';}
add_action('wp_enqueue_scripts',function(){if(!is_singular('page'))return;$id=get_queried_object_id();$css=kghq_import_styles_css($id);if(!$css)return;wp_enqueue_style('wp-block-library');wp_register_style('kghq-durable-styles',false,[],'0.5.0-rc2');wp_enqueue_style('kghq-durable-styles');wp_add_inline_style('kghq-durable-styles',$css);},100);
// Block editor iframe receives the same scoped CSS; native block controls remain available.
add_action('enqueue_block_assets',function(){if(!is_admin())return;$id=isset($_GET['post'])?absint($_GET['post']):0;if(!$id||!current_user_can('edit_post',$id))return;$css=kghq_import_styles_css($id);if(!$css)return;wp_register_style('kghq-editor-styles',false,[],'0.5.0-rc2');wp_enqueue_style('kghq-editor-styles');wp_add_inline_style('kghq-editor-styles',$css);});
add_filter('theme_page_templates',function($templates){$templates['kghq-canvas.php']='KGHQ imported canvas (companion)';return $templates;});
add_filter('template_include',function($template){if(is_singular('page')&&get_page_template_slug()==='kghq-canvas.php'&&get_post_meta(get_queried_object_id(),'_kghq_source_key',true))return __DIR__.'/canvas.php';return $template;},99);
// Classic themes without theme.json receive an extra core Group inner wrapper.
// Unwrap only converter-marked Groups after core's compatibility filter. Saved blocks remain canonical.
add_filter('render_block_core/group',function($html,$block){
 $classes=$block['attrs']['className']??'';
 if(!preg_match('/(?:^|\s)kghq-(?:n[0-9]+|import-root)(?:\s|$)/',$classes))return $html;
 return preg_replace_callback('~^(\s*<(div|section|main|header|footer|article|aside|nav|figure|figcaption|blockquote)\b[^>]*>)\s*(<div\b[^>]*class="[^"]*\bwp-block-group__inner-container\b[^"]*"[^>]*>)([\s\S]*)</div>(\s*</\2>\s*)$~',function($m){
  $inner=new WP_HTML_Tag_Processor($m[3]);$outer=new WP_HTML_Tag_Processor($m[1]);
  if($inner->next_tag()&&$outer->next_tag())foreach($inner->class_list() as $class)if($class!=='wp-block-group__inner-container')$outer->add_class($class);
  return $outer->get_updated_html().$m[4].$m[5];
 },$html)??$html;
},11,2);
// Source element identity belongs on the actual image/button, not WordPress's
// extra figure/div skin. Saved content remains canonical, editable core blocks.
function kghq_source_leaf($html,$block){
 $classes=$block['attrs']['className']??'';
 if(!preg_match('/(?:^|\s)kghq-n[0-9]+(?:\s|$)/',$classes))return $html;
 if(!preg_match('~^\s*<(div|figure)\b[^>]*>([\s\S]*)</\1>\s*$~',$html,$m))return $html;
 $outer=new WP_HTML_Tag_Processor($html);$leaf=new WP_HTML_Tag_Processor($m[2]);
 if(!$outer->next_tag()||!$leaf->next_tag())return $html;
 if(!in_array(strtolower($leaf->get_tag()),['a','button','img'],true))return $html;
 foreach(preg_split('/\s+/',trim($classes)) as $class)if($class!=='')$leaf->add_class($class);
 $id=$outer->get_attribute('id');if($id)$leaf->set_attribute('id',$id);
 $style=trim((string)$outer->get_attribute('style'));if($style)$leaf->set_attribute('style',$style.';'.(string)$leaf->get_attribute('style'));
 return $leaf->get_updated_html();
}
add_filter('render_block_core/button','kghq_source_leaf',20,2);
add_filter('render_block_core/image','kghq_source_leaf',20,2);
add_filter('render_block_core/buttons',function($html,$block){
 if(!str_contains($block['attrs']['className']??'','kghq-button-host'))return $html;
 return preg_replace('~^\s*<div\b[^>]*>([\s\S]*)</div>\s*$~','$1',$html)??$html;
},20,2);
// Preserve real native editing: explicit block controls override the source
// cascade through per-element inline styles; defaults stay in responsive CSS.
add_filter('render_block',function($html,$block){
 $classes=$block['attrs']['className']??'';
 if(!str_contains($classes,'kghq-source-node'))return $html;
 $attrs=$block['attrs'];$style=$attrs['style']??[];$rules=[];
 $palette=static fn($slug,$kind)=>preg_match('/^[a-z0-9-]+$/',(string)$slug)?'var(--wp--preset--'.$kind.'--'.$slug.')':null;
 foreach(['textColor'=>'color','backgroundColor'=>'background-color','borderColor'=>'border-color'] as $attr=>$css)if(!empty($attrs[$attr])&&($v=$palette($attrs[$attr],'color')))$rules[$css]=$v;
 if(!empty($attrs['fontFamily'])&&($v=$palette($attrs['fontFamily'],'font-family')))$rules['font-family']=$v;
 if(!empty($attrs['fontSize'])&&($v=$palette($attrs['fontSize'],'font-size')))$rules['font-size']=$v;
 if(!empty($attrs['align'])&&in_array($attrs['align'],['left','center','right','justify'],true))$rules['text-align']=$attrs['align'];
 $gap=$style['spacing']['blockGap']??null;
 if(is_string($gap))$rules['gap']=$gap;
 elseif(is_array($gap)){if(isset($gap['top']))$rules['row-gap']=$gap['top'];if(isset($gap['left']))$rules['column-gap']=$gap['left'];}
 $layout=$attrs['layout']??[];
 if(($layout['type']??'')==='flex'){
  $rules['display']='flex';$rules['flex-direction']=($layout['orientation']??'horizontal')==='vertical'?'column':'row';
  $rules['flex-wrap']=($layout['flexWrap']??'wrap')==='nowrap'?'nowrap':'wrap';
  $justify=['left'=>'flex-start','right'=>'flex-end','center'=>'center','space-between'=>'space-between'];if(isset($justify[$layout['justifyContent']??'']))$rules['justify-content']=$justify[$layout['justifyContent']];
  $vertical=['top'=>'flex-start','bottom'=>'flex-end','center'=>'center','stretch'=>'stretch'];if(isset($vertical[$layout['verticalAlignment']??'']))$rules['align-items']=$vertical[$layout['verticalAlignment']];
 }
 if(($layout['type']??'')==='grid'){
  $rules['display']='grid';if(!empty($layout['columnCount']))$rules['grid-template-columns']='repeat('.max(1,min(12,(int)$layout['columnCount'])).',minmax(0,1fr))';
 }
 if(($block['blockName']??'')==='core/button'&&!empty($attrs['width']))$rules['width']=max(1,min(100,(int)$attrs['width'])).'%';
 if(!$rules)return $html;
 $processor=new WP_HTML_Tag_Processor($html);if(!$processor->next_tag())return $html;
 $css=(string)$processor->get_attribute('style');foreach($rules as $key=>$value)$css.=';'.$key.':'.preg_replace('/^var:preset\|([a-z-]+)\|([a-z0-9-]+)$/','var(--wp--preset--$1--$2)',$value);
 $processor->set_attribute('style',safecss_filter_attr($css));return $processor->get_updated_html();
},25,2);
add_action('enqueue_block_assets',function(){
 if(!is_admin())return;
 $id=isset($_GET['post'])?absint($_GET['post']):0;if(!$id||!get_post_meta($id,'_kghq_source_key',true))return;
 wp_register_style('kghq-editor-bridge',plugins_url('editor.css',__FILE__),[],'0.5.0-rc2');wp_enqueue_style('kghq-editor-bridge');
});
// Persistent, static custom block for linked cards that core Group cannot model.
// Native child blocks remain editable; no React application is embedded on the front end.
add_action('init',function(){
 wp_register_script('kghq-link-group-editor',plugins_url('blocks/link-group/editor.js',__FILE__),['wp-blocks','wp-element','wp-block-editor','wp-components'],'0.5.0-rc2',true);
 register_block_type(__DIR__.'/blocks/link-group');
});
add_action('enqueue_block_editor_assets',function(){
 $id=isset($_GET['post'])?absint($_GET['post']):0;
 if($id&&get_post_meta($id,'_kghq_source_key',true))wp_enqueue_script('kghq-native-editor-bridge',plugins_url('editor.js',__FILE__),['wp-data','wp-block-editor'],'0.5.0-rc2',true);
});
// Core Details stores its summary as RichText. Promote the source summary
// classes to the semantic <summary>, avoiding an extra list-item line box.
add_filter('render_block_core/details',function($html,$block){
 if(!preg_match('/(?:^|\s)kghq-n[0-9]+(?:\s|$)/',$block['attrs']['className']??''))return $html;
 return preg_replace_callback('~(<summary\b[^>]*>)\s*(<span\b[^>]*>)([\s\S]*)</span>\s*</summary>~',function($m){
  $summary=new WP_HTML_Tag_Processor($m[1]);$span=new WP_HTML_Tag_Processor($m[2]);
  if(!$summary->next_tag()||!$span->next_tag())return $m[0];
  foreach($span->class_list() as $class)$summary->add_class($class);
  $style=$span->get_attribute('style');if($style)$summary->set_attribute('style',(string)$summary->get_attribute('style').';'.$style);
  return $summary->get_updated_html().$m[3].'</summary>';
 },$html)??$html;
},20,2);

// Preserve the source image strategy only for converter-marked images.
add_filter('wp_content_img_tag',function($html){
 $tag=new WP_HTML_Tag_Processor($html);if(!$tag->next_tag('IMG')||!$tag->has_class('kghq-source-node'))return $html;
 if(!$tag->has_class('kghq-authored-srcset')){$tag->remove_attribute('srcset');$tag->remove_attribute('sizes');}
 if($tag->has_class('kghq-loading-lazy'))$tag->set_attribute('loading','lazy');else $tag->set_attribute('loading','eager');
 return $tag->get_updated_html();
},20);

// Preserve the source's actual typography in imported content. WordPress's
// automatic smart quotes/dashes otherwise change glyphs and text widths after
// native blocks render. Other content and other pages retain their normal filter.
function kghq_source_texturize($content){
 $id=get_the_ID();
 if(is_string($content)&&str_contains($content,'kghq-import-root')&&get_post_meta($id,'_kghq_source_key',true)&&apply_filters('kghq_preserve_source_punctuation',true,$id))return $content;
 return wptexturize($content);
}
add_action('wp',function(){
 if(!is_singular('page')||!get_post_meta(get_queried_object_id(),'_kghq_source_key',true))return;
 $priority=has_filter('the_content','wptexturize');
 // Respect another plugin/site that deliberately removed the default formatter.
 if($priority===false)return;
 remove_filter('the_content','wptexturize',$priority);
 add_filter('the_content','kghq_source_texturize',$priority);
});
