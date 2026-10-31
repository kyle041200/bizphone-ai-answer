<?php
/** Repair duplicate debug declarations only in this disposable QA container. */
$file = '/var/www/html/wp-config.php';
$config = file_get_contents( $file );
if ( ! str_contains( $config, 'getenv_docker' ) || 'kghq-php-wp' !== ( $argv[1] ?? '' ) ) {
	throw new RuntimeException( 'Unexpected QA configuration.' );
}
$config = str_replace( "define( 'WP_DEBUG', !!getenv_docker('WORDPRESS_DEBUG', '') );", "define( 'WP_DEBUG', true );", $config );
$config = str_replace( 'eval($configExtra);', 'eval(str_replace(\'define("WP_DEBUG", true);\', \'\', $configExtra));', $config );
file_put_contents( $file, $config );
echo 'Disposable QA debug initialization corrected; no configuration values printed.' . PHP_EOL;
