<?php
/** Disposable WordPress tests. Refuses to run against a non-loopback site. */
require '/var/www/html/wp-load.php';
if ( ! in_array( wp_parse_url( home_url(), PHP_URL_HOST ), array( 'localhost', '127.0.0.1' ), true ) ) {
	throw new RuntimeException( 'Isolated loopback staging only.' );
}
require dirname( __DIR__ ) . '/php/wordpress/kghq-lovable-importer/kghq-lovable-importer.php';
wp_set_current_user( get_user_by( 'login', 'kghq-admin' )->ID );
$results = array();
$check = function ( $name, $condition ) use ( &$results ) {
	$results[] = array( 'name' => $name, 'status' => $condition ? 'PASS' : 'FAIL' );
	if ( ! $condition ) {
		throw new RuntimeException( $name );
	}
};
$protected = array();
foreach ( array( 'bizphone', 'bizsite' ) as $slug ) {
	$post = get_page_by_path( $slug );
	$protected[ $slug ] = $post ? hash( 'sha256', $post->post_content ) : null;
}
$fixture = '<html><title>PHP staging fixture</title><body><header><p>Global header</p></header><main><section class="hero" style="background-color:#ffffff;padding-top:32px;padding-bottom:32px"><h1 class="hero-title" style="color:#123456;font-size:48px;line-height:1.2">Editable heading</h1><p style="margin-top:12px">Editable <strong>paragraph</strong> with <a href="/contact">link</a>.</p><a class="button" href="/contact">Contact us</a><ul><li>One</li><li>Two<ul><li>Nested</li></ul></li></ul><img src="https://93.184.216.34/kghq-test.gif" alt="QA image"><form><input></form></section><a href="/kghq-php-qa-second">Next page</a></main><footer>Global footer</footer></body></html>';
$sitemap_override = null;
add_filter( 'pre_http_request', function ( $pre, $args, $url ) use ( &$fixture, &$sitemap_override ) {
	if ( str_starts_with( $url, 'https://93.184.216.34/' ) ) {
		if ( str_ends_with( $url, '/redirect' ) ) {
			return array( 'headers' => array( 'location' => 'https://elsewhere.example/outside' ), 'body' => '', 'response' => array( 'code' => 301 ), 'cookies' => array() );
		}
		$type = 'text/html';
		$body = $fixture;
		if ( str_ends_with( $url, '.gif' ) ) {
			$type = 'image/gif';
			$body = base64_decode( 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' );
		} elseif ( str_ends_with( $url, '/sitemap.xml' ) ) {
			$type = 'application/xml';
			$body = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://93.184.216.34/kghq-php-qa-second</loc></url><url><loc>https://elsewhere.example/no</loc></url></urlset>';
			if ( null !== $sitemap_override ) {
				$body = $sitemap_override;
			}
		}
		return array( 'headers' => array( 'content-type' => $type ), 'body' => $body, 'response' => array( 'code' => 200, 'message' => 'OK' ), 'cookies' => array() );
	}
	return $pre;
}, PHP_INT_MAX, 3 );
$url = 'https://93.184.216.34/kghq-php-qa-main';
$fixture = str_replace( '</section>', '<hr><blockquote><p>A quote</p></blockquote><details><summary>More information</summary><p>Editable details</p></details><table><thead><tr><th>Service</th></tr></thead><tbody><tr><td>Support</td></tr></tbody></table></section>', $fixture );
$check( 'Same-origin normalization drops query and fragment', \KGHQ\Published\Source::page_url( '/about?track=1#team', $url ) === 'https://93.184.216.34/about' );
$check( 'Foreign links rejected', false === \KGHQ\Published\Source::page_url( 'https://elsewhere.example/about', $url ) );
$check( 'Asset links rejected', false === \KGHQ\Published\Source::page_url( '/photo.png', $url ) );
$check( 'Query-only links rejected', false === \KGHQ\Published\Source::page_url( '?track=2', $url ) );
$check( 'Private source URL rejected', is_wp_error( \KGHQ\Published\Source::get( 'http://127.0.0.1/secret' ) ) );
$check( 'Cross-origin redirect rejected before following', is_wp_error( \KGHQ\Published\Source::get( 'https://93.184.216.34/redirect' ) ) );
$sitemap = \KGHQ\Published\Source::sitemap( $url );
if ( $sitemap['pages'] !== array( 'https://93.184.216.34/kghq-php-qa-second' ) ) {
	echo wp_json_encode( array( 'sitemapDiagnostic' => $sitemap, 'publicUrlValid' => (bool) wp_http_validate_url( $url ) ) ) . PHP_EOL;
}
$check( 'Sitemap discovers only same-origin pages', $sitemap['pages'] === array( 'https://93.184.216.34/kghq-php-qa-second' ) );
$sitemap_override = '';
$empty_sitemap = \KGHQ\Published\Source::sitemap( $url );
$check( 'Empty sitemap falls back without a PHP XML exception', empty( $empty_sitemap['pages'] ) && str_contains( $empty_sitemap['warning'], 'empty' ) );
$sitemap_override = null;
$html = \KGHQ\Published\Source::get( $url );
$check( 'Safe source fetch reads HTML fixture', is_string( $html ) && str_contains( $html, 'Editable heading' ) );
$document = \KGHQ\Published\Published_Document::inspect( $html );
$check( 'Rendered document supported', 'html-available' === $document['status'] );
$existing = get_page_by_path( 'kghq-php-qa-main' );
if ( $existing ) {
	if ( get_post_meta( $existing->ID, '_kghq_published_source', true ) !== $url ) {
		throw new RuntimeException( 'Existing QA slug is not owned by this test.' );
	}
	wp_delete_post( $existing->ID, true );
}
$existing_second = get_page_by_path( 'kghq-php-qa-second' );
if ( $existing_second ) {
	if ( get_post_meta( $existing_second->ID, '_kghq_published_source', true ) !== 'https://93.184.216.34/kghq-php-qa-second' ) {
		throw new RuntimeException( 'Second QA slug is not owned by this test.' );
	}
	wp_delete_post( $existing_second->ID, true );
}
$first = \KGHQ\Published\Plugin::import_document( $url, $document );
if ( is_wp_error( $first ) ) {
	throw new RuntimeException( $first->get_error_message() );
}
$id = $first['id'];
$post = get_post( $id );
$check( 'Imported as draft', 'draft' === $post->post_status );
$check( 'No HTML, custom block or executable substitutes', ! preg_match( '~wp:html|wp:kghq/|<script|<iframe~', $post->post_content ) );
$check( 'Unsupported form reported', (bool) array_filter( $first['warnings'], fn( $warning ) => str_contains( $warning, 'form:' ) ) );
$check( 'Media sideloaded into attachment', has_post_thumbnail( $id ) && file_exists( get_attached_file( get_post_thumbnail_id( $id ) ) ) );
$check( 'Media has source alt text', 'QA image' === get_post_meta( get_post_thumbnail_id( $id ), '_wp_attachment_image_alt', true ) );
$check( 'No hotlinked image remains', ! str_contains( $post->post_content, 'src="https://93.184.216.34/' ) );
$blocks = parse_blocks( $post->post_content );
$check( 'Root is native full-width Group', 'core/group' === $blocks[0]['blockName'] && 'full' === $blocks[0]['attrs']['align'] );
$section = $blocks[0]['innerBlocks'][0];
$check( 'Exact source padding uses editable native attribute', '32px' === $section['attrs']['style']['spacing']['padding']['top'] );
$check( 'Exact source color uses editable native attribute', '#123456' === $section['innerBlocks'][0]['attrs']['style']['color']['text'] );
$again = \KGHQ\Published\Plugin::import_document( $url, $document );
$check( 'Reimport updates same draft ID', ! is_wp_error( $again ) && $again['id'] === $id );
wp_update_post( array( 'ID' => $id, 'post_content' => get_post_field( 'post_content', $id ) . "\n<!-- A manual QA edit -->" ) );
$check( 'WordPress save marks manual edit', (bool) get_post_meta( $id, '_kghq_edited_manually', true ) );
// Gutenberg can save REST content before submitting a previously unchecked legacy metabox.
$_POST['kghq_protection_nonce'] = wp_create_nonce( 'kghq_protection' );
\KGHQ\Published\Plugin::save_protection( $id, get_post( $id ) );
$check( 'Stale unchecked Gutenberg metabox cannot clear new protection', (bool) get_post_meta( $id, '_kghq_edited_manually', true ) );
unset( $_POST['kghq_protection_nonce'] );
$edited = get_post_field( 'post_content', $id );
$skip = \KGHQ\Published\Plugin::import_document( $url, $document );
$check( 'Reimport preserves manual edit', is_wp_error( $skip ) && $edited === get_post_field( 'post_content', $id ) );
$canary = wp_insert_post( array( 'post_type' => 'page', 'post_status' => 'draft', 'post_name' => 'kghq-php-qa-protected', 'post_title' => 'PHP QA protection canary', 'post_content' => 'Keep this existing content' ) );
$skip = \KGHQ\Published\Plugin::import_document( 'https://93.184.216.34/kghq-php-qa-protected', $document );
$check( 'Unrelated existing slug preserved', is_wp_error( $skip ) && 'Keep this existing content' === get_post_field( 'post_content', $canary ) );
wp_delete_post( $canary, true );
$job = array( 'queue' => array( 'https://93.184.216.34/kghq-php-qa-second' ), 'seen' => array(), 'source' => $url );
$second = \KGHQ\Published\Plugin::step( $job );
$check( 'Queue imports a second page without conversion CLI', ! empty( $second['id'] ) && 'draft' === get_post_status( $second['id'] ) );
wp_update_post( array( 'ID' => $second['id'], 'post_title' => 'Manually edited title only' ) );
$title_skip = \KGHQ\Published\Plugin::import_document( 'https://93.184.216.34/kghq-php-qa-second', $document );
$check( 'Title-only edits are preserved', is_wp_error( $title_skip ) && 'Manually edited title only' === get_post_field( 'post_title', $second['id'] ) );
foreach ( $protected as $slug => $hash ) {
	$post = get_page_by_path( $slug );
	$check( 'Existing ' . $slug . ' content unchanged', $hash === ( $post ? hash( 'sha256', $post->post_content ) : null ) );
}
// Save clean serialized content for independent official JS parser validation.
$clean = new \KGHQ\Published\Converter( $url );
$content = $clean->convert( $document['html'], 'kghq-site-example--com' );
file_put_contents( '/tmp/kghq-published-blocks.html', $content );
echo wp_json_encode( array( 'results' => $results, 'count' => count( $results ), 'pageIds' => array( $id, $second['id'] ), 'wordpress' => get_bloginfo( 'version' ), 'php' => PHP_VERSION, 'limitations' => 'Mocked source HTTP and existing isolated staging; not clean-install UI or published-site acceptance.' ), JSON_PRETTY_PRINT ) . PHP_EOL;
