=== KGHQ Lovable Importer ===
Contributors: kghq
Requires at least: 6.6
Tested up to: 7.1
Requires PHP: 8.1
Stable tag: 0.1.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Import selected rendered Lovable pages as editable native Gutenberg drafts.

== Installation ==
Install and activate the separate KGHQ Import Styles companion first, then this plugin.
Open Tools > KGHQ Lovable Importer. Scan a GitHub repository, convert selected routes with the independent Node CLI, upload bundle.json, select pages, and import as drafts.
A server-side KGHQ_GITHUB_TOKEN constant can enable private GitHub tree scanning. Never put credentials into browser code.
Use the supplied bundle for the initial BizPhone/BizSite MVP. See the converter package README and test report for complete instructions and limitations.

== Scope ==
Classic-theme architecture; not universal theme certification. Native text/images/buttons/groups/columns/lists/details. No embedded React app, iframe page, or full-page Custom HTML conversion. Unsupported React behavior is reported for a separate integration.
Existing pages and edits require explicit replacement approval. New and replaced pages are drafts. Existing navigation and theme files are not changed.

== Safe removal ==
Deleting this importer retains all imported pages, Media Library assets, and page metadata. Keep KGHQ Import Styles active for CSS, classic Group compatibility, and canvas templates. Removing the companion retains native content but changes appearance.
