<?php
/**
 * Published HTML preflight for the PHP importer.
 *
 * Does not execute JavaScript or treat hydration data as rendered content.
 *
 * @package KGHQ_Lovable_Importer
 */

namespace KGHQ\Published;

/** Inspect a document before creating any WordPress content. */
final class Published_Document {

	/**
	 * Extract candidate main content and identify unsupported source documents.
	 *
	 * A supported result establishes HTML availability only, not complete visual
	 * fidelity or the absence of content subsequently inserted by JavaScript.
	 *
	 * @param string $html Original HTTP response body.
	 * @return array
	 */
	public static function inspect( $html ) {
		$result = array(
			'status'   => 'unsupported',
			'reason'   => '',
			'html'     => '',
			'title'    => '',
			'warnings' => array(),
		);
		if ( ! class_exists( '\DOMDocument' ) ) {
			$result['reason'] = 'The PHP DOM extension is required to read published pages.';
			return $result;
		}
		if ( strlen( $html ) > 4 * 1024 * 1024 ) {
			$result['reason'] = 'Page HTML exceeds the 4 MB safety limit.';
			return $result;
		}
		if ( '' === trim( $html ) ) {
			$result['reason'] = 'The site returned an empty page.';
			return $result;
		}
		$document = new \DOMDocument();
		$previous = libxml_use_internal_errors( true );
		$loaded   = $document->loadHTML( '<?xml encoding="UTF-8">' . $html, LIBXML_NONET );
		libxml_clear_errors();
		libxml_use_internal_errors( $previous );
		if ( ! $loaded ) {
			$result['reason'] = 'The page did not contain readable HTML.';
			return $result;
		}
		$xpath  = new \DOMXPath( $document );
		$titles = $xpath->query( '//title' );
		if ( $titles->length ) {
			$result['title'] = trim( $titles->item( 0 )->textContent );
		}
		// Remove executable data and site chrome before checking real content.
		$remove = $xpath->query(
			'//script | //style | //noscript | //template | //nav | //footer | '
			. '//header[not(ancestor::main) and not(ancestor::*[@role="main"])] | '
			. '//*[@id="lovable-badge"] | //a[contains(@href,"lovable.dev/projects/")]'
		);
		foreach ( iterator_to_array( $remove ) as $node ) {
			if ( $node->parentNode ) {
				$node->parentNode->removeChild( $node );
			}
		}
		$main = $xpath->query( '//main | //*[@role="main"]' );
		if ( 1 !== $main->length ) {
			$result['reason'] = $main->length
				? 'Multiple main content regions were found; automatic extraction needs review.'
				: 'No main content region was served in the HTML. The site may require JavaScript; PHP cannot render it.';
			return $result;
		}
		$root    = $main->item( 0 );
		$content = $xpath->query( './/h1 | .//h2 | .//h3 | .//h4 | .//h5 | .//h6 | .//p | .//li | .//img | .//table | .//video', $root );
		$usable  = false;
		foreach ( $content as $node ) {
			if ( '' !== trim( $node->textContent ) || in_array( $node->nodeName, array( 'img', 'video' ), true ) ) {
				$usable = true;
				break;
			}
		}
		if ( ! $usable ) {
			$result['reason'] = 'The main region contains no supported rendered content. JavaScript-only pages cannot be imported by PHP.';
			return $result;
		}
		foreach ( $xpath->query( './/form | .//iframe | .//canvas | .//button | .//*[@onclick]', $root ) as $node ) {
			$result['warnings'][] = $node->nodeName . ': interactive behavior requires review and is not reproduced by fetching HTML.';
		}
		$result['status']     = 'html-available';
		$result['html']       = $document->saveHTML( $root );
		$result['warnings'][] = 'HTML availability does not prove completeness: content loaded later by JavaScript cannot be detected reliably from this response.';
		return $result;
	}
}
