<?php
/**
 * Published importer settings, queue and draft ownership controls.
 *
 * @package KGHQ_Lovable_Importer
 */

namespace KGHQ\Published;

/** A browser-driven queue: one bounded page per authenticated AJAX request. */
final class Plugin {
	/**
	 * Prevent save hooks from treating imports as user edits.
	 *
	 * @var bool
	 */
	private static $importing = false;

	/**
	 * Fingerprint editable page content and identity, not volatile timestamps.
	 *
	 * @param \WP_Post $post Saved imported page.
	 * @return string
	 */
	private static function fingerprint( $post ) {
		return hash( 'sha256', wp_json_encode( array( $post->post_content, $post->post_title, $post->post_name, $post->post_excerpt, (int) get_post_thumbnail_id( $post->ID ) ) ) );
	}

	/**
	 * Register WordPress hooks.
	 *
	 * @return void
	 */
	public static function boot() {
		add_action(
			'admin_menu',
			function () {
				add_options_page( 'KGHQ Lovable Importer', 'KGHQ Lovable Importer', 'manage_options', 'kghq-published', array( self::class, 'screen' ) );
			}
		);
		add_action(
			'admin_init',
			function () {
				register_setting(
					'kghq_published',
					'kghq_published_settings',
					array(
						'type'              => 'array',
						'sanitize_callback' => array( self::class, 'settings' ),
						'show_in_rest'      => false,
					)
				);
			}
		);
		add_action( 'wp_ajax_kghq_published', array( self::class, 'ajax' ) );
		add_action(
			'admin_enqueue_scripts',
			function ( $hook ) {
				if ( 'settings_page_kghq-published' !== $hook ) {
					return;
				}
				wp_enqueue_script( 'kghq-published', plugins_url( 'admin.js', dirname( __DIR__ ) . '/kghq-lovable-importer.php' ), array(), '0.6.0-alpha1', true );
				wp_localize_script(
					'kghq-published',
					'KGHQPublished',
					array(
						'url'   => admin_url( 'admin-ajax.php' ),
						'nonce' => wp_create_nonce( 'kghq_published' ),
					)
				);
			}
		);
		add_action(
			'add_meta_boxes_page',
			function ( $post ) {
				if ( get_post_meta( $post->ID, '_kghq_published_source', true ) ) {
					add_meta_box( 'kghq-published-protection', 'KGHQ import protection', array( self::class, 'protection' ), 'page', 'side' );
				}
			}
		);
		add_action( 'save_post_page', array( self::class, 'save_protection' ), 20, 2 );
	}

	/**
	 * Sanitize saved source settings without returning tokens to the browser.
	 *
	 * @param array $input Submitted settings.
	 * @return array
	 */
	public static function settings( $input ) {
		$old    = get_option( 'kghq_published_settings', array() );
		$result = array(
			'site'       => esc_url_raw( $input['site'] ?? '' ),
			'repository' => esc_url_raw( $input['repository'] ?? '' ),
			'branch'     => sanitize_text_field( $input['branch'] ?? 'main' ),
			'token'      => $old['token'] ?? '',
		);
		if ( ! empty( $input['token'] ) ) {
			$result['token'] = sanitize_text_field( $input['token'] );
		}
		if ( ! empty( $input['clear_token'] ) ) {
			$result['token'] = '';
		}
		return $result;
	}

	/**
	 * Render the settings and import progress screen.
	 *
	 * @return void
	 */
	public static function screen() {
		$settings = get_option( 'kghq_published_settings', array() );
		?>
		<div class="wrap"><h1>KGHQ Lovable Importer — published HTML preview</h1>
		<p>Imports server-rendered main content as editable drafts. JavaScript-only pages are unsupported. This preview does not yet reproduce source styles, fonts or responsive layouts.</p>
		<form id="kghq-source-settings" action="options.php" method="post">
		<?php settings_fields( 'kghq_published' ); ?>
		<table class="form-table">
		<?php
		foreach ( array(
			'site'       => 'Published site URL',
			'repository' => 'Repository URL (optional)',
			'branch'     => 'Branch (optional)',
		) as $key => $label ) :
			?>
		<tr><th><label for="kghq-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></label></th><td><input class="regular-text" id="kghq-<?php echo esc_attr( $key ); ?>" name="kghq_published_settings[<?php echo esc_attr( $key ); ?>]" value="<?php echo esc_attr( $settings[ $key ] ?? ( 'branch' === $key ? 'main' : '' ) ); ?>" <?php echo 'site' === $key ? 'required type="url"' : 'type="text"'; ?>></td></tr>
		<?php endforeach; ?>
		<tr><th><label for="kghq-token">Access token (optional)</label></th><td><input id="kghq-token" type="password" name="kghq_published_settings[token]" value="" autocomplete="new-password" placeholder="<?php echo empty( $settings['token'] ) ? 'Not saved' : 'Saved — leave blank to keep'; ?>"><p><label><input type="checkbox" name="kghq_published_settings[clear_token]" value="1"> Remove saved token</label></p><p>Stored in the WordPress options database, not encrypted. Restrict administrator and backup access. Repository route discovery is not implemented in this preview; the token is not sent anywhere.</p></td></tr>
		</table>
		<?php submit_button( 'Save settings only', 'secondary' ); ?></form>
		<button class="button button-primary" id="kghq-start" disabled>Import published pages as drafts</button>
		<noscript><p>Enable browser JavaScript to start the import and show progress. Conversion itself runs in PHP.</p></noscript>
		<p>Paste the published URL and click Import. Settings save automatically. Keep this tab open. Up to 50 pages are crawled; existing unrelated pages and manually edited imports are preserved.</p>
		<progress id="kghq-progress" value="0" max="50" aria-label="Imported pages"></progress><p id="kghq-status" role="status"></p><ol id="kghq-results"></ol>
		<p>Safe removal: drafts and Media Library files remain. Keep KGHQ Published Styles active to retain the imported canvas and base styling. Source design CSS and fonts are not exported by this alpha.</p>
		<p><a href="<?php echo esc_url( plugins_url( 'STYLING-GUIDE.md', dirname( __DIR__ ) . '/kghq-lovable-importer.php' ) ); ?>">Read the styling guide</a></p>
		</div>
		<?php
	}

	/**
	 * Render protection controls and the saved report.
	 *
	 * @param \WP_Post $post Current imported page.
	 * @return void
	 */
	public static function protection( $post ) {
		wp_nonce_field( 'kghq_protection', 'kghq_protection_nonce' );
		if ( get_post_meta( $post->ID, '_kghq_edited_manually', true ) ) {
			echo '<input type="hidden" name="kghq_protection_previously_enabled" value="1">';
		}
		echo '<label><input type="checkbox" name="kghq_edited_manually" value="1" ' . checked( (bool) get_post_meta( $post->ID, '_kghq_edited_manually', true ), true, false ) . '> Edited manually — skip reimport</label><p>Saving changed content automatically enables protection. Clear it only when you want the next import to replace your edits.</p>';
		$warnings = get_post_meta( $post->ID, '_kghq_published_report', true );
		if ( is_array( $warnings ) && $warnings ) {
			echo '<details><summary>Conversion report</summary><ul>';
			foreach ( $warnings as $warning ) {
				echo '<li>' . esc_html( $warning ) . '</li>';
			}
			echo '</ul></details>';
		}
	}

	/**
	 * Protect content edits and honor an explicit protection reset.
	 *
	 * @param int      $id Page ID.
	 * @param \WP_Post $post Saved page.
	 * @return void
	 */
	public static function save_protection( $id, $post ) {
		if ( self::$importing || wp_is_post_revision( $id ) || wp_is_post_autosave( $id ) || ! current_user_can( 'edit_post', $id ) || ! get_post_meta( $id, '_kghq_published_source', true ) ) {
			return;
		}
		$baseline   = get_post_meta( $id, '_kghq_published_hash', true );
		$was_manual = (bool) get_post_meta( $id, '_kghq_edited_manually', true );
		if ( $baseline && ! hash_equals( $baseline, self::fingerprint( $post ) ) ) {
			update_post_meta( $id, '_kghq_edited_manually', 1 );
		}
		if ( isset( $_POST['kghq_protection_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['kghq_protection_nonce'] ) ), 'kghq_protection' ) ) {
			if ( isset( $_POST['kghq_edited_manually'] ) ) {
				update_post_meta( $id, '_kghq_edited_manually', 1 );
			} elseif ( $was_manual && isset( $_POST['kghq_protection_previously_enabled'] ) && '1' === $_POST['kghq_protection_previously_enabled'] ) {
				// Clearing an already enabled checkbox explicitly approves future replacement.
				update_post_meta( $id, '_kghq_edited_manually', 0 );
				update_post_meta( $id, '_kghq_published_hash', self::fingerprint( $post ) );
			}
		}
	}

	/**
	 * Authorize and process one import request.
	 *
	 * @return void
	 */
	public static function ajax() {
		check_ajax_referer( 'kghq_published', 'nonce' );
		if ( ! current_user_can( 'manage_options' ) || ! current_user_can( 'edit_pages' ) || ! current_user_can( 'upload_files' ) ) {
			wp_send_json_error( array( 'message' => 'Administrator permission is required.' ), 403 );
		}
		if ( ! class_exists( '\DOMDocument' ) ) {
			wp_send_json_error( array( 'message' => 'Your host must enable the PHP DOM extension.' ), 400 );
		}
		$operation = sanitize_key( wp_unslash( $_POST['operation'] ?? '' ) );
		$key       = 'kghq_published_job_' . get_current_user_id();
		$lock      = $key . '_lock';
		if ( ! add_option( $lock, time(), '', false ) ) {
			// Never steal an active lock. A previous crashed request expires after 10 minutes.
			if ( (int) get_option( $lock ) < time() - 600 ) {
				delete_option( $lock );
			}
			wp_send_json_error( array( 'message' => 'An import request is running. Wait and try again.' ), 409 );
		}
		$result = null;
		try {
			if ( 'start' === $operation ) {
				$settings = get_option( 'kghq_published_settings', array() );
				$url      = Source::page_url( $settings['site'] ?? '', $settings['site'] ?? '' );
				if ( ! $url || ! wp_http_validate_url( $url ) ) {
					$result = new \WP_Error( 'source', 'Save a valid public Published site URL first.' );
				} else {
					$sitemap = Source::sitemap( $url );
					set_transient(
						$key,
						array(
							'queue'  => array_slice( array_values( array_unique( array_merge( array( $url ), $sitemap['pages'] ) ) ), 0, 50 ),
							'seen'   => array(),
							'source' => $url,
						),
						HOUR_IN_SECONDS
					);
					$result = array(
						'done'    => false,
						'message' => 'Import started. ' . $sitemap['warning'],
						'count'   => 0,
					);
				}
			} else {
				$job    = get_transient( $key );
				$result = $job ? self::step( $job ) : new \WP_Error( 'expired', 'Import expired. Start again; existing drafts are protected.' );
				if ( ! is_wp_error( $result ) ) {
					set_transient( $key, $job, HOUR_IN_SECONDS );
				}
			}
		} catch ( \Throwable $error ) {
			$result = new \WP_Error( 'failed', 'Import interrupted by a server error. Check the hosting PHP log; retry after resolving it.' );
		} finally {
			delete_option( $lock );
		}
		if ( is_wp_error( $result ) ) {
			wp_send_json_error( array( 'message' => $result->get_error_message() ), 400 );
		}
		wp_send_json_success( $result );
	}

	/**
	 * Process one queued source URL.
	 *
	 * @param array $job Mutable crawl state.
	 * @return array
	 */
	public static function step( &$job ) {
		if ( ! $job['queue'] || count( $job['seen'] ) >= 50 ) {
			return array(
				'done'    => true,
				'count'   => count( $job['seen'] ),
				'message' => $job['queue'] ? 'Stopped at the 50-page safety limit; some pages remain undiscovered.' : 'Crawl finished. Review each conversion report before publishing.',
			);
		}
		$url           = array_shift( $job['queue'] );
		$job['seen'][] = $url;
		$html          = Source::get( $url );
		$result        = array(
			'url'   => $url,
			'count' => count( $job['seen'] ),
			'done'  => false,
		);
		if ( is_wp_error( $html ) ) {
			return array_merge(
				$result,
				array(
					'message'  => $html->get_error_message(),
					'warnings' => array(),
				)
			);
		}
		$links        = Source::links( $html, $url );
		$job['queue'] = array_slice( array_values( array_diff( array_unique( array_merge( $job['queue'], $links ) ), $job['seen'] ) ), 0, 50 - count( $job['seen'] ) );
		$document     = Published_Document::inspect( $html );
		if ( 'html-available' !== $document['status'] ) {
			return array_merge(
				$result,
				array(
					'message'  => $document['reason'],
					'warnings' => $document['warnings'],
				)
			);
		}
		$import = self::import_document( $url, $document );
		return array_merge( $result, is_wp_error( $import ) ? array( 'message' => $import->get_error_message() ) : $import );
	}

	/**
	 * Lock a page slug before checking ownership and writing.
	 *
	 * @param string $url Canonical source URL.
	 * @param array  $document Preflight HTML result.
	 * @return array|\WP_Error
	 */
	public static function import_document( $url, $document ) {
		$path = trim( wp_parse_url( $url, PHP_URL_PATH ), '/' );
		$slug = sanitize_title( $path ? str_replace( '/', '-', $path ) : 'home' );
		$lock = 'kghq_published_slug_' . hash( 'sha256', $slug );
		if ( ! add_option( $lock, time(), '', false ) ) {
			if ( (int) get_option( $lock ) < time() - 600 ) {
				delete_option( $lock );
			}
			return new \WP_Error( 'busy', 'Another import is processing this page slug. Retry later.' );
		}
		try {
			return self::write_document( $url, $document );
		} finally {
			delete_option( $lock );
		}
	}

	/**
	 * Create or update an unedited source-owned draft.
	 *
	 * @param string $url Canonical source URL.
	 * @param array  $document Preflight HTML result.
	 * @return array|\WP_Error
	 */
	private static function write_document( $url, $document ) {
		$path  = trim( wp_parse_url( $url, PHP_URL_PATH ), '/' );
		$slug  = sanitize_title( $path ? str_replace( '/', '-', $path ) : 'home' );
		$owned = get_posts(
			array(
				'post_type'   => 'page',
				'post_status' => array( 'draft', 'publish', 'pending', 'private', 'future', 'trash' ),
				'meta_key'    => '_kghq_published_source',
				'meta_value'  => $url,
				'numberposts' => 2,
			)
		);
		if ( count( $owned ) > 1 ) {
			return new \WP_Error( 'duplicate', 'Multiple imported pages match this URL. Resolve them before reimporting.' );
		}
		$post = $owned ? $owned[0] : get_page_by_path( $slug, OBJECT, 'page' );
		if ( $post ) {
			if ( ! $owned || get_post_meta( $post->ID, '_kghq_edited_manually', true ) || 'draft' !== $post->post_status || ! current_user_can( 'edit_post', $post->ID ) ) {
				return new \WP_Error( 'protected', 'Existing page preserved. Only unprotected imported drafts can be updated.' );
			}
			$baseline = get_post_meta( $post->ID, '_kghq_published_hash', true );
			if ( ! $baseline || ! hash_equals( $baseline, self::fingerprint( $post ) ) ) {
				update_post_meta( $post->ID, '_kghq_edited_manually', 1 );
				return new \WP_Error( 'edited', 'Page edits detected. Page preserved and marked Edited manually.' );
			}
		}
		$scope     = 'kghq-site-' . str_replace( '.', '--', strtolower( wp_parse_url( $url, PHP_URL_HOST ) ) );
		$converter = new Converter( $url );
		$content   = $converter->convert( $document['html'], $scope );
		if ( is_wp_error( $content ) ) {
			return $content;
		}
		self::$importing = true;
		try {
			$id = wp_insert_post(
				wp_slash(
					array(
						'ID'           => $post ? $post->ID : 0,
						'post_type'    => 'page',
						'post_status'  => 'draft',
						'post_title'   => $document['title'] ? $document['title'] : ucwords( str_replace( '-', ' ', $slug ) ),
						'post_name'    => $slug,
						'post_content' => $content,
					)
				),
				true
			);
		} finally {
			self::$importing = false;
		}
		if ( is_wp_error( $id ) ) {
			return $id;
		}
		update_post_meta( $id, '_kghq_published_source', $url );
		update_post_meta( $id, '_kghq_published_scope', $scope );
		$warnings = array_values( array_unique( array_merge( $document['warnings'], $converter->warnings, array( 'Preview limitation: source CSS, fonts, responsive layouts, sitemap indexes and repository route discovery are not yet implemented.' ) ) ) );
		update_post_meta( $id, '_kghq_published_report', $warnings );
		if ( $converter->images && ! has_post_thumbnail( $id ) ) {
			set_post_thumbnail( $id, $converter->images[0] );
		}
		update_post_meta( $id, '_kghq_published_hash', self::fingerprint( get_post( $id ) ) );
		return array(
			'message'  => $post ? 'Imported draft updated.' : 'Editable draft created.',
			'edit'     => get_edit_post_link( $id, 'raw' ),
			'view'     => get_preview_post_link( $id ),
			'id'       => $id,
			'warnings' => $warnings,
		);
	}
}
