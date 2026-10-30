=== KGHQ Import Styles ===
Contributors: kghq
Requires at least: 6.6
Tested up to: 7.1
Requires PHP: 8.1
Stable tag: 0.5.0-rc3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Independent durable styling and optional canvas template for KGHQ imported pages.

== Description ==
CSS and layout settings live in WordPress post metadata. Media and fonts live in the WordPress uploads/Media Library. This companion reads them without depending on the importer plugin. It serves page-scoped CSS in the front end and editor and normalizes core-added classic Group wrappers only on importer-marked blocks.

Keep this plugin active after removing KGHQ Lovable Importer. Its removal does not delete content or media, but styling and canvas behavior stop. No theme files, global menus, or front-page settings are modified.
