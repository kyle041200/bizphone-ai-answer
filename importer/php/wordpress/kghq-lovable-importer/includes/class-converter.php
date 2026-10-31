<?php
/** Native block conversion for server-rendered HTML.
 *
 * @package KGHQ_Lovable_Importer
 */

namespace KGHQ\Published;

// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase -- DOM API property names are fixed camelCase.

/** Convert semantic content without executing or embedding source JavaScript. */
final class Converter {
	/**
	 * Conversion warnings.
	 *
	 * @var array
	 */
	public $warnings = array();
	/**
	 * Source page URL.
	 *
	 * @var string
	 */
	private $base;
	/**
	 * Current nesting depth.
	 *
	 * @var int
	 */
	private $depth = 0;
	/**
	 * Images processed in this page.
	 *
	 * @var int
	 */
	private $image_count = 0;
	/**
	 * Imported attachment IDs.
	 *
	 * @var array
	 */
	public $images = array();

	/**
	 * Set the base URL for relative content links.
	 *
	 * @param string $base Source page URL.
	 * @return void
	 */
	public function __construct( $base ) {
		$this->base = $base;
	}

	/**
	 * Serialize safe native block markup.
	 *
	 * @param string $name Core block short name.
	 * @param array  $attributes Native attributes.
	 * @param string $html Safe saved markup.
	 * @return string
	 */
	private function block( $name, $attributes, $html ) {
		return get_comment_delimited_block_content( 'core/' . $name, $attributes, $html );
	}

	/**
	 * Preserve readable source classes.
	 *
	 * @param \DOMElement $node Source element.
	 * @return string
	 */
	private function classes( $node ) {
		$classes = array();
		foreach ( preg_split( '/\s+/', $node->getAttribute( 'class' ) ) as $class_names ) {
			if ( preg_match( '/^[a-z][a-z0-9-]{0,48}$/i', $class_names ) && ! preg_match( '/[a-f0-9]{8,}/i', $class_names ) ) {
				$classes[] = $class_names;
			}
		}
		return implode( ' ', array_unique( $classes ) );
	}

	/**
	 * Map exact supported inline values into native block attributes.
	 *
	 * @param \DOMElement $node Source element.
	 * @param array       $attrs Native attributes to update.
	 * @param string      $class_names Saved CSS classes to update.
	 * @return string
	 */
	private function presentation( $node, &$attrs, &$class_names ) {
		$values = array();
		foreach ( explode( ';', $node->getAttribute( 'style' ) ) as $declaration ) {
			$pair = explode( ':', $declaration, 2 );
			if ( 2 === count( $pair ) ) {
				$values[ strtolower( trim( $pair[0] ) ) ] = trim( $pair[1] );
			}
		}
		$style = array();
		$css   = array();
		foreach ( array(
			'color'            => 'text',
			'background-color' => 'background',
		) as $property => $key ) {
			if ( isset( $values[ $property ] ) && preg_match( '/^#[a-f0-9]{3,8}$/i', $values[ $property ] ) ) {
				$style['color'][ $key ] = $values[ $property ];
				$css[]                  = $property . ':' . $values[ $property ];
				$class_names           .= ' ' . ( 'text' === $key ? 'has-text-color' : 'has-background' );
				unset( $values[ $property ] );
			}
		}
		foreach ( array( 'margin', 'padding' ) as $property ) {
			foreach ( array( 'top', 'right', 'bottom', 'left' ) as $side ) {
				$key = $property . '-' . $side;
				if ( isset( $values[ $key ] ) && preg_match( '/^(?:0|[0-9]+(?:\.[0-9]+)?(?:px|rem|em|%|vh|vw))$/', $values[ $key ] ) ) {
					$style['spacing'][ $property ][ $side ] = $values[ $key ];
					$css[]                                  = $key . ':' . $values[ $key ];
					unset( $values[ $key ] );
				}
			}
		}
		foreach ( array(
			'font-size'   => 'fontSize',
			'line-height' => 'lineHeight',
		) as $property => $key ) {
			if ( isset( $values[ $property ] ) && preg_match( '/^(?:0|[0-9]+(?:\.[0-9]+)?(?:px|rem|em|%)?)$/', $values[ $property ] ) ) {
				$style['typography'][ $key ] = $values[ $property ];
				$css[]                       = $property . ':' . $values[ $property ];
				unset( $values[ $property ] );
			}
		}
		if ( $style ) {
			$attrs['style'] = $style;
		}
		if ( $values ) {
			$this->warnings[] = $node->tagName . ': inline properties not yet mapped: ' . implode( ', ', array_keys( $values ) ) . '.';
		}
		return $css ? ' style="' . esc_attr( implode( ';', $css ) ) . '"' : '';
	}

	/**
	 * Convert inline content to safe editable rich text.
	 *
	 * @param \DOMNode $node Source text container.
	 * @return string
	 */
	private function rich( $node ) {
		$html = '';
		foreach ( $node->childNodes as $child ) {
			if ( XML_TEXT_NODE === $child->nodeType ) {
				$html .= esc_html( $child->nodeValue );
				continue;
			}
			if ( ! $child instanceof \DOMElement ) {
				continue;
			}
			$tag = strtolower( $child->tagName );
			if ( in_array( $tag, array( 'script', 'style', 'iframe', 'object', 'embed', 'svg', 'canvas', 'form', 'input', 'button', 'video', 'audio', 'img' ), true ) ) {
				$this->warnings[] = $tag . ': unsupported inline content omitted; review the source section.';
				continue;
			}
			if ( $child->hasAttribute( 'style' ) ) {
				$this->warnings[] = $tag . ': inline rich-text styling is not yet preserved.';
			}
			if ( 'br' === $tag ) {
				$html .= '<br>';
			} elseif ( 'a' === $tag ) {
				$url   = esc_url( \WP_Http::make_absolute_url( $child->getAttribute( 'href' ), $this->base ) );
				$html .= '<a href="' . $url . '">' . $this->rich( $child ) . '</a>';
			} elseif ( in_array( $tag, array( 'strong', 'em', 's', 'code', 'sup', 'sub', 'mark' ), true ) ) {
				$html .= '<' . $tag . '>' . $this->rich( $child ) . '</' . $tag . '>';
			} else {
				$html .= $this->rich( $child );
			}
		}
		return $html;
	}

	/**
	 * Convert rendered main content into a native root Group.
	 *
	 * @param string $html Extracted main HTML.
	 * @param string $scope Readable project class.
	 * @return string|\WP_Error
	 */
	public function convert( $html, $scope ) {
		$document = new \DOMDocument();
		$previous = libxml_use_internal_errors( true );
		$document->loadHTML( '<?xml encoding="UTF-8">' . $html, LIBXML_NONET );
		libxml_clear_errors();
		libxml_use_internal_errors( $previous );
		$xpath = new \DOMXPath( $document );
		$main  = $xpath->query( '//main | //*[@role="main"]' )->item( 0 );
		if ( ! $main ) {
			return new \WP_Error( 'kghq_content', 'Main content is missing.' );
		}
		$inner = $this->children( $main );
		if ( '' === trim( $inner ) ) {
			return new \WP_Error( 'kghq_content', 'No supported blocks could be converted. No page was created.' );
		}
		$class_names = 'kghq-published ' . sanitize_html_class( $scope );
		return $this->block(
			'group',
			array(
				'className' => $class_names,
				'align'     => 'full',
				'layout'    => array( 'type' => 'default' ),
			),
			'<div class="wp-block-group alignfull ' . esc_attr( $class_names ) . '">' . $inner . '</div>'
		);
	}

	/**
	 * Convert child nodes with a nesting limit.
	 *
	 * @param \DOMNode $node Source container.
	 * @return string
	 */
	private function children( $node ) {
		if ( ++$this->depth > 30 ) {
			--$this->depth;
			$this->warnings[] = 'A section exceeds the 30-level nesting limit and was omitted.';
			return '';
		}
		$result = '';
		foreach ( $node->childNodes as $child ) {
			$result .= $this->node( $child );
		}
		--$this->depth;
		return $result;
	}

	/**
	 * Select a supported native block for a source node.
	 *
	 * @param \DOMNode $node Source node.
	 * @return string
	 */
	private function node( $node ) {
		if ( XML_TEXT_NODE === $node->nodeType ) {
			return trim( $node->nodeValue ) ? $this->block( 'paragraph', array(), '<p>' . esc_html( trim( $node->nodeValue ) ) . '</p>' ) : '';
		}
		if ( ! $node instanceof \DOMElement ) {
			return '';
		}
		$tag          = strtolower( $node->tagName );
		$class_names  = $this->classes( $node );
		$attrs        = $class_names ? array( 'className' => $class_names ) : array();
		$extra        = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';
		$native_class = $class_names;
		$native_style = '';
		if ( preg_match( '/^h[1-6]$/', $tag ) || in_array( $tag, array( 'p', 'div', 'section', 'article', 'header', 'aside' ), true ) ) {
			$native_style = $this->presentation( $node, $attrs, $native_class );
		} elseif ( $node->hasAttribute( 'style' ) ) {
			$this->warnings[] = $tag . ': inline styling is not yet mapped for this block type.';
		}
		if ( preg_match( '/^h([1-6])$/', $tag, $match ) ) {
			$attrs['level'] = (int) $match[1];
			return $this->block( 'heading', $attrs, '<' . $tag . ' class="wp-block-heading' . ( trim( $native_class ) ? ' ' . esc_attr( trim( $native_class ) ) : '' ) . '"' . $native_style . '>' . $this->rich( $node ) . '</' . $tag . '>' );
		}
		if ( 'p' === $tag ) {
			return $this->block( 'paragraph', $attrs, '<p' . ( trim( $native_class ) ? ' class="' . esc_attr( trim( $native_class ) ) . '"' : '' ) . $native_style . '>' . $this->rich( $node ) . '</p>' );
		}
		if ( 'hr' === $tag ) {
			return $this->block( 'separator', $attrs, '<hr class="wp-block-separator has-alpha-channel-opacity' . ( $class_names ? ' ' . esc_attr( $class_names ) : '' ) . '"/>' );
		}
		if ( 'blockquote' === $tag ) {
			return $this->block( 'quote', $attrs, '<blockquote class="wp-block-quote' . ( $class_names ? ' ' . esc_attr( $class_names ) : '' ) . '">' . $this->children( $node ) . '</blockquote>' );
		}
		if ( 'details' === $tag ) {
			$copy    = $node->cloneNode( true );
			$summary = '';
			foreach ( iterator_to_array( $copy->childNodes ) as $part ) {
				if ( $part instanceof \DOMElement && 'summary' === $part->tagName ) {
					$summary = $this->rich( $part );
					$copy->removeChild( $part );
					break;
				}
			}
			if ( $node->hasAttribute( 'open' ) ) {
				$this->warnings[] = 'details: initial open state was not preserved.';
			}
			return $this->block( 'details', $attrs, '<details class="wp-block-details' . ( $class_names ? ' ' . esc_attr( $class_names ) : '' ) . '"><summary>' . $summary . '</summary>' . $this->children( $copy ) . '</details>' );
		}
		if ( 'table' === $tag ) {
			$body  = '';
			$xpath = new \DOMXPath( $node->ownerDocument );
			foreach ( array( 'thead', 'tbody', 'tfoot' ) as $section ) {
				$rows   = 'tbody' === $section ? $xpath->query( './tbody/tr | ./tr', $node ) : $xpath->query( './' . $section . '/tr', $node );
				$markup = '';
				foreach ( $rows as $row ) {
					$cells = '';
					foreach ( $row->childNodes as $cell ) {
						if ( $cell instanceof \DOMElement && in_array( $cell->tagName, array( 'td', 'th' ), true ) ) {
							if ( $cell->hasAttribute( 'colspan' ) || $cell->hasAttribute( 'rowspan' ) ) {
								$this->warnings[] = 'table: merged cell spans are not yet preserved.';
							}
							$cells .= '<' . $cell->tagName . '>' . $this->rich( $cell ) . '</' . $cell->tagName . '>';
						}
					}
					$markup .= '<tr>' . $cells . '</tr>';
				}
				if ( $markup ) {
					$body .= '<' . $section . '>' . $markup . '</' . $section . '>';
				}
			}
			return $this->block( 'table', $attrs, '<figure class="wp-block-table' . ( $class_names ? ' ' . esc_attr( $class_names ) : '' ) . '"><table class="has-fixed-layout">' . $body . '</table></figure>' );
		}
		if ( 'a' === $tag && ( str_contains( $class_names, 'button' ) || str_contains( $class_names, 'btn' ) || 'button' === $node->getAttribute( 'role' ) ) ) {
			$url    = esc_url( \WP_Http::make_absolute_url( $node->getAttribute( 'href' ), $this->base ) );
			$button = $this->block( 'button', $attrs, '<div class="wp-block-button' . ( $class_names ? ' ' . esc_attr( $class_names ) : '' ) . '"><a class="wp-block-button__link wp-element-button" href="' . $url . '">' . $this->rich( $node ) . '</a></div>' );
			return $this->block( 'buttons', array(), '<div class="wp-block-buttons">' . $button . '</div>' );
		}
		if ( in_array( $tag, array( 'a', 'span', 'strong', 'em' ), true ) ) {
			$parent = $node->ownerDocument->createElement( 'p' );
			$parent->appendChild( $node->cloneNode( true ) );
			return $this->block( 'paragraph', array(), '<p>' . $this->rich( $parent ) . '</p>' );
		}
		if ( in_array( $tag, array( 'ul', 'ol' ), true ) ) {
			$items = '';
			foreach ( $node->childNodes as $li ) {
				if ( $li instanceof \DOMElement && 'li' === $li->tagName ) {
					$nested = '';
					$copy   = $li->cloneNode( true );
					foreach ( iterator_to_array( $copy->childNodes ) as $part ) {
						if ( $part instanceof \DOMElement && in_array( $part->tagName, array( 'ul', 'ol' ), true ) ) {
							$nested .= $this->node( $part );
							$copy->removeChild( $part );
						}
					}
					$items .= $this->block( 'list-item', array(), '<li>' . $this->rich( $copy ) . $nested . '</li>' );
				}
			}
			$attrs['ordered'] = 'ol' === $tag;
			return $this->block( 'list', $attrs, '<' . $tag . ' class="wp-block-list' . ( $class_names ? ' ' . esc_attr( $class_names ) : '' ) . '">' . $items . '</' . $tag . '>' );
		}
		if ( 'img' === $tag ) {
			if ( ++$this->image_count > 30 ) {
				$this->warnings[] = 'Image limit reached (30 per page); remaining images omitted.';
				return '';
			}
			$url = \WP_Http::make_absolute_url( $node->getAttribute( 'src' ), $this->base );
			$id  = $this->image( $url, $node->getAttribute( 'alt' ) );
			if ( is_wp_error( $id ) ) {
				$this->warnings[] = 'Image not imported: ' . $url . '. ' . $id->get_error_message();
				return '';
			}
			$this->images[] = $id;
			$src            = wp_get_attachment_url( $id );
			$attrs          = array_merge(
				$attrs,
				array(
					'id'              => $id,
					'sizeSlug'        => 'full',
					'linkDestination' => 'none',
				)
			);
			return $this->block( 'image', $attrs, '<figure class="wp-block-image size-full' . ( $class_names ? ' ' . esc_attr( $class_names ) : '' ) . '"><img src="' . esc_url( $src ) . '" alt="' . esc_attr( $node->getAttribute( 'alt' ) ) . '" class="wp-image-' . $id . '"/></figure>' );
		}
		if ( in_array( $tag, array( 'script', 'style', 'noscript', 'nav', 'footer' ), true ) ) {
			return '';
		}
		if ( in_array( $tag, array( 'form', 'input', 'button', 'iframe', 'svg', 'canvas', 'video', 'audio', 'object', 'embed' ), true ) ) {
			$this->warnings[] = $tag . ': not converted; requires a supported WordPress integration or a future conversion rule.';
			return '';
		}
		$inner = $this->children( $node );
		if ( '' === trim( $inner ) ) {
			return '';
		}
		$attrs['layout'] = array( 'type' => 'default' );
		return $this->block( 'group', $attrs, '<div class="wp-block-group' . ( trim( $native_class ) ? ' ' . esc_attr( trim( $native_class ) ) : '' ) . '"' . $native_style . '>' . $inner . '</div>' );
	}

	/**
	 * Sideload a validated raster image into the Media Library.
	 *
	 * @param string $url Public image URL.
	 * @param string $alt Source alternative text.
	 * @return int|\WP_Error
	 */
	private function image( $url, $alt ) {
		$old = get_posts(
			array(
				'post_type'   => 'attachment',
				'post_status' => 'inherit',
				'meta_key'    => '_kghq_published_asset',
				'meta_value'  => $url,
				'fields'      => 'ids',
				'numberposts' => 1,
			)
		);
		if ( $old ) {
			return (int) $old[0];
		}
		$response = wp_safe_remote_get(
			$url,
			array(
				'timeout'             => 15,
				'redirection'         => 3,
				'limit_response_size' => 8 * MB_IN_BYTES + 1,
			)
		);
		if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
			return new \WP_Error( 'image', 'Image could not be downloaded.' );
		}
		$data = wp_remote_retrieve_body( $response );
		if ( strlen( $data ) > 8 * MB_IN_BYTES ) {
			return new \WP_Error( 'image', 'Image exceeds 8 MB.' );
		}
		require_once ABSPATH . 'wp-admin/includes/file.php';
		$file = wp_tempnam( 'kghq-image' );
		// phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_file_put_contents -- Writes only a WordPress-generated temporary file.
		if ( ! $file || false === file_put_contents( $file, $data ) ) {
			return new \WP_Error( 'image', 'Hosting storage is not writable.' );
		}
		$type = wp_get_image_mime( $file );
		$ext  = array(
			'image/jpeg' => 'jpg',
			'image/png'  => 'png',
			'image/gif'  => 'gif',
			'image/webp' => 'webp',
		);
		if ( ! isset( $ext[ $type ] ) ) {
			wp_delete_file( $file );
			return new \WP_Error( 'image', 'Only verified PNG, JPEG, GIF and WebP images are supported.' );
		}
		$size = wp_getimagesize( $file );
		if ( ! $size || $size[0] * $size[1] > 32000000 ) {
			wp_delete_file( $file );
			return new \WP_Error( 'image', 'Image dimensions exceed the safety limit.' );
		}
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
		$name = sanitize_file_name( pathinfo( wp_parse_url( $url, PHP_URL_PATH ), PATHINFO_FILENAME ) );
		$id   = media_handle_sideload(
			array(
				'name'     => ( $name ? $name : 'imported-image' ) . '.' . $ext[ $type ],
				'tmp_name' => $file,
			),
			0
		);
		if ( is_wp_error( $id ) ) {
			wp_delete_file( $file );
			return $id;
		}
		update_post_meta( $id, '_kghq_published_asset', $url );
		update_post_meta( $id, '_wp_attachment_image_alt', sanitize_text_field( $alt ) );
		return $id;
	}
}
