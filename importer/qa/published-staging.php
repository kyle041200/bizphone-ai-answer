<?php
/** One-time initialization for the dedicated disposable PHP-preview site. */
define( 'WP_INSTALLING', true );
require '/var/www/html/wp-load.php';
if ( 'http://localhost:8089' !== WP_HOME || 'kghq_php_' !== $table_prefix ) {
	throw new RuntimeException( 'Refusing to initialize a different site.' );
}
require_once ABSPATH . 'wp-admin/includes/upgrade.php';
if ( ! is_blog_installed() ) {
	wp_install( 'KGHQ PHP Preview Staging', 'kghq-admin', 'staging@example.invalid', true, '', 'automation-staging-admin-only' );
}
switch_theme( 'twentyseventeen' );
echo 'Disposable staging initialized; no worker configuration used.' . PHP_EOL;
