<?php
/** Remove only the disposable URL-change fixture created during harness diagnosis. */
require '/var/www/html/wp-load.php';
if ( 'http://localhost:8089' !== home_url() || 'kghq_php_' !== $table_prefix ) {
	throw new RuntimeException( 'Disposable PHP staging only.' );
}
$url = 'https://93.184.216.34/unconfigured';
$removed = 0;
foreach ( get_posts( array( 'post_type' => 'page', 'post_status' => 'draft', 'meta_key' => '_kghq_published_source', 'meta_value' => $url, 'numberposts' => 2 ) ) as $post ) {
	if ( 'unconfigured' === $post->post_name && 'Landing preview' === $post->post_title && ! get_post_meta( $post->ID, '_kghq_edited_manually', true ) ) {
		wp_delete_post( $post->ID, true );
		++$removed;
	}
}
echo wp_json_encode( array( 'syntheticHarnessPagesRemoved' => $removed, 'productionChanges' => 0 ) ) . PHP_EOL;
