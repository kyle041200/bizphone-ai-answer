<?php
add_action('wp_enqueue_scripts',function(){wp_enqueue_style('kghq-stress-parent',get_template_directory_uri().'/style.css');wp_enqueue_style('kghq-stress-test',get_stylesheet_uri(),['kghq-stress-parent']);});
add_action('after_setup_theme',function(){add_theme_support('editor-styles');add_editor_style('style.css');});
