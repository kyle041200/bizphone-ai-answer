<?php
/** Read-only retention evidence for the isolated PHP staging site. */
require '/var/www/html/wp-load.php';
if ( 'http://localhost:8089' !== home_url() ) {
	throw new RuntimeException( 'Loopback PHP staging only.' );
}
$records = array();
foreach ( get_posts( array( 'post_type' => 'page', 'post_status' => 'draft', 'meta_key' => '_kghq_published_source', 'numberposts' => -1 ) ) as $post ) {
	$records[] = array( 'id' => $post->ID, 'source' => get_post_meta( $post->ID, '_kghq_published_source', true ), 'contentHash' => hash( 'sha256', $post->post_content ), 'manualProtection' => (bool) get_post_meta( $post->ID, '_kghq_edited_manually', true ), 'status' => $post->post_status );
}
$media = array();
foreach ( get_posts( array( 'post_type' => 'attachment', 'post_status' => 'inherit', 'numberposts' => -1 ) ) as $image ) {
	$media[] = array( 'id' => $image->ID, 'exists' => file_exists( get_attached_file( $image->ID ) ) );
}
echo wp_json_encode( array( 'pages' => $records, 'media' => $media ), JSON_PRETTY_PRINT ) . PHP_EOL;
