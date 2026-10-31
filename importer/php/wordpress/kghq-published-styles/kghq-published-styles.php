<?php
/**
 * Plugin Name: KGHQ Published Styles
 * Description: Keeps the PHP published importer’s scoped base stylesheet available after importer removal. Does not reproduce source-site design styles.
 * Version: 0.6.0-alpha1
 * Requires PHP: 8.1
 * License: GPL-2.0-or-later
 *
 * @package KGHQ_Lovable_Importer
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
require_once __DIR__ . '/styles.php';
