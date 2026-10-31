<?php
/**
 * Plugin Name: KGHQ Lovable Importer
 * Description: PHP-only published HTML importer. Experimental; review the conversion report before publishing.
 * Version: 0.6.0-alpha1
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * License: GPL-2.0-or-later
 *
 * @package KGHQ_Lovable_Importer
 */

namespace KGHQ\Published;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
require_once __DIR__ . '/includes/class-published-document.php';
require_once __DIR__ . '/includes/class-source.php';
require_once __DIR__ . '/includes/class-converter.php';
require_once __DIR__ . '/styles.php';

require_once __DIR__ . '/includes/class-plugin.php';
Plugin::boot();
