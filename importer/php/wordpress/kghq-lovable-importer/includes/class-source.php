<?php
/** Safe, bounded published-document transport.
 *
 * @package KGHQ_Lovable_Importer
 */

namespace KGHQ\Published;

// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- DOM API property names are fixed camelCase.

/** Fetch only public HTTP documents; never send repository credentials here. */
final class Source {
	/**
	 * Normalize a same-origin page link.
	 *
	 * @param string $href Source link value.
	 * @param string $base Current source page URL.
	 * @return string|false
	 */
	public static function page_url( $href, $base ) {
		$href = html_entity_decode( trim( $href ), ENT_QUOTES, 'UTF-8' );
		if ( '' === $href || preg_match( '~^(?:#|\?|mailto:|tel:|javascript:|data:)~i', $href ) ) {
			return false;
		}
		$url   = \WP_Http::make_absolute_url( $href, $base );
		$parts = wp_parse_url( $url );
		$home  = wp_parse_url( $base );
		if ( ! $parts || ! $home || ! in_array( $parts['scheme'] ?? '', array( 'https', 'http' ), true ) || strtolower( $parts['host'] ?? '' ) !== strtolower( $home['host'] ?? '' ) || ( $parts['scheme'] ?? '' ) !== ( $home['scheme'] ?? '' ) || ( $parts['port'] ?? null ) !== ( $home['port'] ?? null ) || isset( $parts['user'] ) || isset( $parts['pass'] ) ) {
			return false;
		}
		$path = $parts['path'] ?? '/';
		if ( preg_match( '~\.(?:png|jpe?g|gif|webp|svg|ico|css|js|mjs|map|woff2?|ttf|mp[34]|pdf|zip|xml)$~i', $path ) ) {
			return false;
		}
		return $home['scheme'] . '://' . $home['host'] . ( isset( $home['port'] ) ? ':' . $home['port'] : '' ) . ( '/' === $path ? '/' : untrailingslashit( $path ) );
	}

	/**
	 * Fetch a bounded public HTML or XML response.
	 *
	 * @param string $url Public source URL.
	 * @param string $kind Expected response kind, html or xml.
	 * @return string|\WP_Error
	 */
	public static function get( $url, $kind = 'html' ) {
		if ( ! wp_http_validate_url( $url ) ) {
			return new \WP_Error( 'kghq_source', 'Use a public HTTP or HTTPS site URL. Private network addresses are not allowed.' );
		}
		$origin = wp_parse_url( $url );
		for ( $redirect = 0; $redirect <= 3; ++$redirect ) {
			$response = wp_safe_remote_get(
				$url,
				array(
					'timeout'             => 15,
					'redirection'         => 0,
					'limit_response_size' => 4 * MB_IN_BYTES + 1,
					'headers'             => array( 'Accept' => 'xml' === $kind ? 'application/xml,text/xml' : 'text/html' ),
				)
			);
			if ( is_wp_error( $response ) || ! in_array( wp_remote_retrieve_response_code( $response ), array( 301, 302, 303, 307, 308 ), true ) ) {
				break;
			}
			$next  = \WP_Http::make_absolute_url( wp_remote_retrieve_header( $response, 'location' ), $url );
			$parts = wp_parse_url( $next );
			if ( ! $parts || ( $parts['host'] ?? '' ) !== $origin['host'] || ( $parts['scheme'] ?? '' ) !== $origin['scheme'] || ( $parts['port'] ?? null ) !== ( $origin['port'] ?? null ) || ! wp_http_validate_url( $next ) ) {
				return new \WP_Error( 'kghq_source', 'Page redirects outside the source origin. Use the final published site URL instead.' );
			}
			$url = $next;
		}
		if ( is_wp_error( $response ) ) {
			return new \WP_Error( 'kghq_source', 'Site not reachable. Check the URL and your hosting provider’s outbound HTTP access.' );
		}
		$status = wp_remote_retrieve_response_code( $response );
		if ( 200 !== $status ) {
			return new \WP_Error( 'kghq_source', 'Page returned HTTP ' . $status . '.' );
		}
		$body = wp_remote_retrieve_body( $response );
		if ( strlen( $body ) > 4 * MB_IN_BYTES ) {
			return new \WP_Error( 'kghq_source', 'Page exceeds the 4 MB safety limit.' );
		}
		$type = strtolower( wp_remote_retrieve_header( $response, 'content-type' ) );
		if ( 'html' === $kind && ! str_contains( $type, 'text/html' ) && ! str_contains( $type, 'application/xhtml+xml' ) ) {
			return new \WP_Error( 'kghq_source', 'The URL did not return an HTML page.' );
		}
		return $body;
	}

	/**
	 * Extract canonical same-origin page links.
	 *
	 * @param string $html Source HTML.
	 * @param string $url Source page URL.
	 * @return array
	 */
	public static function links( $html, $url ) {
		$document = new \DOMDocument();
		$previous = libxml_use_internal_errors( true );
		$document->loadHTML( '<?xml encoding="UTF-8">' . $html, LIBXML_NONET );
		libxml_clear_errors();
		libxml_use_internal_errors( $previous );
		$links = array();
		foreach ( $document->getElementsByTagName( 'a' ) as $anchor ) {
			$target = self::page_url( $anchor->getAttribute( 'href' ), $url );
			if ( $target ) {
				$links[] = $target;
			}
		}
		return array_values( array_unique( $links ) );
	}

	/**
	 * Read a standard sitemap URL list.
	 *
	 * @param string $site Source site URL.
	 * @return array
	 */
	public static function sitemap( $site ) {
		$parts = wp_parse_url( $site );
		$root  = $parts['scheme'] . '://' . $parts['host'] . ( isset( $parts['port'] ) ? ':' . $parts['port'] : '' );
		$body  = self::get( $root . '/sitemap.xml', 'xml' );
		if ( is_wp_error( $body ) ) {
			return array(
				'pages'   => array(),
				'warning' => 'Sitemap unavailable; following internal page links instead.',
			);
		}
		if ( '' === trim( $body ) ) {
			return array(
				'pages'   => array(),
				'warning' => 'Sitemap is empty; following internal links instead.',
			);
		}
		if ( preg_match( '/<!DOCTYPE|<!ENTITY/i', $body ) ) {
			return array(
				'pages'   => array(),
				'warning' => 'Sitemap with entity declarations rejected. Following internal links.',
			);
		}
		$document = new \DOMDocument();
		$previous = libxml_use_internal_errors( true );
		$loaded   = $document->loadXML( $body, LIBXML_NONET );
		libxml_clear_errors();
		libxml_use_internal_errors( $previous );
		if ( ! $loaded || 'urlset' !== $document->documentElement->localName ) {
			return array(
				'pages'   => array(),
				'warning' => 'Sitemap is invalid or is an index (not yet supported). Following internal links.',
			);
		}
		$pages = array();
		$xpath = new \DOMXPath( $document );
		foreach ( $xpath->query( '/*[local-name()="urlset"]/*[local-name()="url"]/*[local-name()="loc"]' ) as $location ) {
			$url = self::page_url( trim( $location->textContent ), $site );
			if ( $url ) {
				$pages[] = $url;
			}
			if ( count( $pages ) >= 50 ) {
				break;
			}
		}
		return array(
			'pages'   => array_values( array_unique( $pages ) ),
			'warning' => 'A maximum of 50 pages is processed. Review sitemap completeness for larger sites.',
		);
	}
}
