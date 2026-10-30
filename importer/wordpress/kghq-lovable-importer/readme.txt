=== KGHQ Lovable Importer ===
Contributors: kghq
Requires at least: 6.6
Tested up to: 7.1
Requires PHP: 8.1
Stable tag: 0.5.0-rc1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Scan a Lovable GitHub project and automatically import selected native Gutenberg drafts.

== Installation ==
Development candidate; install on isolated staging only.
Install and activate the independent KGHQ Import Styles companion first.
A server operator must provision the authenticated external conversion worker and
configure KGHQ_WORKER_URL and KGHQ_WORKER_TOKEN in server-side wp-config.php.
See the distributed worker/README.md for Docker, TLS, repository access and quotas.

Open Tools > KGHQ Lovable Importer:
1. Paste a full GitHub repository URL or owner/repository, then Scan Website.
2. Select exact pages, review compatibility warnings, and Convert & Import Selected Pages.

The worker automatically detects the default branch and converts selected pages.
No CLI execution or JSON upload is required in the regular import flow.
Pages are drafts. Existing pages and edits are preserved unless the separate
replacement approval is checked. Theme navigation/global settings are not changed.
Manual bundle staging is hidden unless the operator enables developer mode.

Private GitHub access requires a restricted read-only worker-side credential.
Never expose access tokens in browser code. There is no automatic OAuth setup UI.

== Removal and dependencies ==
Deleting this importer retains pages and Media Library attachments.
Keep KGHQ Import Styles active for scoped project styling, canvas templates and
Linked Layout editor controls. Deleting both plugins does not retain that styling.
Source React interactions/integrations are reported, not automatically migrated.

== Acceptance status ==
See the dated acceptance evidence, PASS/PARTIAL/NOT TESTED scorecard and limitations
in the full project downloads. Classic-theme compatibility is not universally certified.
No production WordPress site was deployed by this project.
