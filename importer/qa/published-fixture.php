<?php
/** QA-only HTTP fixtures. Never package with or install on customer sites. */
if ( ! defined( 'ABSPATH' ) || ! defined( 'WP_HOME' ) || 'http://localhost:8089' !== WP_HOME ) {
	return;
}
add_filter( 'pre_http_request', function ( $pre, $args, $url ) {
	if ( str_starts_with( $url, 'https://93.184.216.34/' ) ) {
		$path = wp_parse_url( $url, PHP_URL_PATH );
		$type = 'text/html';
		$body = '';
		if ( '/sitemap.xml' === $path ) {
			$type = 'application/xml';
			$body = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://93.184.216.34/</loc></url><url><loc>https://93.184.216.34/services</loc></url></urlset>';
		} elseif ( '/image.gif' === $path ) {
			$type = 'image/gif';
			$body = base64_decode( 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' );
		} else {
			$title = '/services' === $path ? 'Services preview' : 'Landing preview';
			$body = '<!doctype html><html><head><title>' . $title . '</title></head><body><header>Do not import the navigation</header><main><section class="hero" style="padding-top:32px;padding-bottom:32px;background-color:#eeeeff"><h1 style="font-size:48px;color:#35206b">' . $title . '</h1><p>This is synthetic server-rendered HTML for isolated workflow testing.</p><a class="button" href="/services">See services</a><img src="https://93.184.216.34/image.gif" alt="Synthetic QA image"></section><section class="cards"><h2>Our services</h2><p>Editable service text.</p><ul><li>Design</li><li>Support</li></ul></section></main><footer>Do not import footer</footer></body></html>';
		}
		return array( 'headers' => array( 'content-type' => $type ), 'body' => $body, 'response' => array( 'code' => 200, 'message' => 'OK' ), 'cookies' => array() );
	}
	return new WP_Error( 'qa_no_network', 'External requests disabled on disposable QA.' );
}, PHP_INT_MAX, 3 );
