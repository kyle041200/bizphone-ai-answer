<?php
if(!defined('ABSPATH'))exit;
$layout=get_post_meta(get_queried_object_id(),'_kghq_layout',true)?:[];
if(!empty($layout['header'])){get_header();}else{?><!doctype html><html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head><body <?php body_class('kghq-import-canvas'); ?>><?php wp_body_open();}
$width=max(320,min(2560,absint($layout['width']??1200)));
?>
<main id="kghq-imported-content" style="width:100%;max-width:<?php echo !empty($layout['full'])?'none':esc_attr($width.'px'); ?>;margin-inline:auto"><?php while(have_posts()){the_post();the_content();} ?></main>
<?php if(!empty($layout['footer'])){get_footer();}else{wp_footer();?></body></html><?php }
