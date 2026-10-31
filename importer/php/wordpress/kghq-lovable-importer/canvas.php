<?php
/**
 * Imported-page canvas: retains classic theme header/footer without its page wrapper.
 *
 * @package KGHQ_Lovable_Importer
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<main id="kghq-published-content" class="kghq-published-canvas">
	<?php
	while ( have_posts() ) {
		the_post();
		the_content();
	}
	?>
</main>
<?php
get_footer();
