<?php
/** Scoped base styling, shared by the importer and optional persistent companion.
 *
 * @package KGHQ_Lovable_Importer
 */

namespace KGHQ\Published;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( ! function_exists( __NAMESPACE__ . '\published_styles_boot' ) ) {
	/**
	 * Load scoped base styles on imported front-end and editor pages.
	 *
	 * @return void
	 */
	function published_styles_boot() {
		add_filter(
			'body_class',
			function ( $classes ) {
				if ( is_singular( 'page' ) && get_post_meta( get_queried_object_id(), '_kghq_published_source', true ) ) {
					$classes[] = 'kghq-published-page';
				}
				return $classes;
			}
		);
		add_filter(
			'template_include',
			function ( $template ) {
				$id = get_queried_object_id();
				if ( is_singular( 'page' ) && get_post_meta( $id, '_kghq_published_source', true ) && 'theme' !== get_post_meta( $id, '_kghq_published_template', true ) ) {
					return __DIR__ . '/canvas.php';
				}
				return $template;
			},
			99
		);
		add_action(
			'after_setup_theme',
			function () {
				add_theme_support( 'editor-styles' );
				add_theme_support( 'align-wide' );
			},
			20
		);
		add_action(
			'enqueue_block_assets',
			function () {
				$id = get_queried_object_id();
				if ( is_admin() ) {
					$id = get_the_ID();
				}
				if ( ! $id || ! get_post_meta( $id, '_kghq_published_source', true ) ) {
					return;
				}
				wp_enqueue_style( 'kghq-published-base', plugins_url( 'published.css', __FILE__ ), array(), '0.6.0-alpha1' );
				// Keep Additional CSS identical to the front end for imported editor pages.
				if ( is_admin() && function_exists( 'wp_get_custom_css' ) ) {
					$css = wp_get_custom_css();
					if ( $css ) {
						wp_add_inline_style( 'kghq-published-base', $css );
					}
				}
			}
		);
	}
	published_styles_boot();
}
