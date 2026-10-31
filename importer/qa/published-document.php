<?php
/** Standalone PHP assertions; no WordPress, network or database writes. */
require dirname( __DIR__ ) . '/php/wordpress/kghq-lovable-importer/includes/class-published-document.php';

$cases = array(
	'empty response' => array( '', 'unsupported' ),
	'React shell' => array( '<html><body><div id="root"></div><script>document.write("Hello")</script></body></html>', 'unsupported' ),
	'hydration data is not content' => array( '<main></main><script type="application/json">{"heading":"Hello"}</script>', 'unsupported' ),
	'rendered main' => array( '<title>Example</title><main><h1>Welcome</h1><p>Actual HTML</p></main>', 'html-available' ),
	'ARIA main' => array( '<div role="main"><p>Actual HTML</p></div>', 'html-available' ),
	'ambiguous main' => array( '<main><p>One</p></main><main><p>Two</p></main>', 'unsupported' ),
	'chrome alone' => array( '<header><h1>Site</h1></header><nav><p>Menu</p></nav><main></main><footer><p>Copyright</p></footer>', 'unsupported' ),
	'empty main' => array( '<main><div id="root"></div></main>', 'unsupported' ),
);
$count = 0;
foreach ( $cases as $name => $case ) {
	$result = \KGHQ\Published\Published_Document::inspect( $case[0] );
	if ( $case[1] !== $result['status'] ) {
		throw new RuntimeException( $name . ': unexpected status ' . $result['status'] );
	}
	++$count;
}
$result = \KGHQ\Published\Published_Document::inspect( '<main><header><h1>Page title</h1></header><p>Text</p><script>alert(1)</script><nav>Menu</nav><footer>Footer</footer><form><input></form></main>' );
if ( false !== strpos( $result['html'], '<script' ) || false !== strpos( $result['html'], '<nav' ) || false !== strpos( $result['html'], '<footer' ) || false === strpos( $result['html'], 'Page title' ) || count( $result['warnings'] ) < 2 ) {
	throw new RuntimeException( 'Chrome removal, section header preservation or interaction reporting failed.' );
}
++ $count;
$nested = \KGHQ\Published\Published_Document::inspect( '<main><header><p>Global logo</p><nav>Global menu</nav></header><section><header><h1>Keep section heading</h1></header><p>Content</p></section></main>' );
if ( str_contains( $nested['html'], 'Global logo' ) || ! str_contains( $nested['html'], 'Keep section heading' ) ) {
	throw new RuntimeException( 'Global header inside main was not removed, or section heading was removed.' );
}
++ $count;
$banner = \KGHQ\Published\Published_Document::inspect( '<main><header role="banner"><p>Global banner</p></header><p>Main content</p></main>' );
if ( str_contains( $banner['html'], 'Global banner' ) ) {
	throw new RuntimeException( 'ARIA banner inside main was not removed.' );
}
++ $count;
echo json_encode( array( 'passed' => $count, 'failed' => 0, 'scope' => 'Published HTML availability only; not importer acceptance' ), JSON_PRETTY_PRINT ) . PHP_EOL;
