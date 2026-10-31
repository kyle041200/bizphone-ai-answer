# KGHQ Lovable Importer — acceptance development branch

Fresh automatic dashboard imports have passed on isolated staging using two
structurally different Lovable repositories. The recovered worker supports
frozen npm/Bun installs, isolated source execution and host-side CSS containment.
Native Gutenberg editing is tested separately from front-end rendering.

Read the [final acceptance scorecard](docs/FINAL-ACCEPTANCE.md), then [worker setup](worker/README.md) and [recovery status](docs/RECOVERY-STATUS.md).
Current evidence and development packages are published separately under
`kghq-downloads/acceptance-recovery/`. This is not a production-ready certification;
the classic-theme matrix, live fonts/reference access and other limitations must
be assessed in the acceptance report. Older checkpoint documentation below is
historical and its manual bundle workflow is not the normal dashboard workflow.

---

# Phase 2 development checkpoint — 0.3.0

Read [Phase 2 results](docs/PHASE-2.md) first. This checkpoint improves conversion fidelity and independent editing tests. It **does not yet implement the requested automatic worker/dashboard workflow**. The two-step workflow is the next implementation pass on this development branch; this checkpoint is not its completion.

Install the two 0.3.0 plugin ZIPs on isolated staging only. Keep the independent styling companion active after removing the importer. `kghq/link-group` additionally depends on its editor registration. Test bundles exclude BizPhone and BizSite and contain native blocks with acknowledged unsupported interactions and source asset omissions. Never replace existing pages unless you explicitly approve replacement.

CLI conversions now generate `compatibility.json` automatically. `--report-only` analyzes without source execution. Projects with interactions require review and `--accept-interaction-loss`. Missing images and CSS/font assets fail by default; explicitly reviewed omissions require `--allow-missing-images` and `--allow-missing-assets`. These are operator/developer tools, not the final end-user workflow.

The older MVP documentation below describes the baseline and its manual flow; artifact names and current limitations above take precedence.

---

# KGHQ Lovable Importer — Classic Theme MVP

This is a working **review-first MVP**, not a universal React compiler or a certification of every classic theme. It exports a running Lovable page into native WordPress blocks, imports selected pages as drafts, and retains styling through an independent companion. No theme files are changed. Nothing deploys to production.

## Deliverables

- `dist/kghq-lovable-importer-0.1.0.zip` — installable importer.
- `dist/kghq-import-styles-0.1.0.zip` — independent persistent styling/canvas companion.
- `dist/kghq-converter-0.1.0.zip` — Node CLI, locked dependencies, schema, tests, and documentation.
- `dist/kghq-example-bundle.json` — actual `/bizphone` and `/bizsite` conversion, including media.
- `docs/TEST-REPORT.md` and `dist/kghq-qa-evidence.zip` — tested scope, screenshots, differences, and limitations.

## Install on staging

1. Back up the staging WordPress database and uploads. Use WordPress 6.6+ / PHP 8.1+; the tested version is recorded in the test report. The importing account needs `manage_options`, `edit_pages`, `upload_files`, and `unfiltered_html` (on multisite this normally means a super administrator).
2. Install and activate **KGHQ Import Styles**, then **KGHQ Lovable Importer**, using Plugins → Add New → Upload Plugin.
3. Open Tools → KGHQ Lovable Importer. Enter `owner/repository` and the desired branch/tag/ref, then **Scan website**. The dashboard uses GitHub's server-side tree API to preview TanStack routes; the CLI AST scan and the loaded bundle are authoritative. Scanning does not execute source code.
4. For the supplied MVP, upload `kghq-example-bundle.json`. For a new conversion, follow the CLI workflow below. There is no hosted conversion service or automatic source build in this release.
5. Select pages. Defaults preserve the active theme template, header, footer, navigation, and existing content. For a source-like standalone layout, explicitly select **canvas**, **full width**, and disable the theme header/footer. The imported source already includes its own navigation and footer. Theme header/footer and content width controls apply to the canvas template only.
6. Import. Every new or explicitly replaced page is saved as a **draft**. Review the preview, native block editor, warnings, links, and all responsive breakpoints before publishing manually.

The example bundle is approximately 6 MB. Server limits must accommodate its size. Suggested staging PHP settings: `upload_max_filesize=48M`, `post_max_size=52M`, `memory_limit=256M`. The plugin additionally limits JSON to 48 MB, decoded media to 35 MB, individual images to 32 megapixels, pages to 50, and assets to 1000. Convert smaller batches on constrained hosting.

## Source conversion CLI

Requirements: Node 24 (tested), npm, a Chromium browser, a trusted local source checkout, and a running source development/preview server. WordPress never runs npm, PHP never evaluates TSX, and the CLI does not automatically install or execute repository scripts. Build/run only repositories you trust. Use the existing isolated checkout; do not create a Git worktree unless explicitly requested.

From this repository:

```sh
npm ci --prefix importer/engine
node importer/engine/cli.mjs --repo .
```

Start the source using its documented development command. In this prepared environment, run `npm run dev -- --host 0.0.0.0 --port 5173` from `/workspace/bizphone-ai-answer`. Then:

```sh
node importer/engine/cli.mjs \
  --repo . \
  --repository kyle041200/bizphone-ai-answer \
  --url http://localhost:5173 \
  --routes /bizphone,/bizsite \
  --chromium /usr/bin/chromium \
  --out importer/work/export
```

Omit `--chromium` to use Playwright's installed browser (`npx playwright install chromium` from `importer/engine`), or set `KGHQ_CHROMIUM`. Omit `--routes` to attempt all detected routes; missing assets/HTTP errors stop the export instead of silently producing a complete-looking broken site. The current repository's article pages contain an unavailable source logo; see the report before attempting an entire-site export. Specify concrete parameterized URLs with comma-separated `--routes` values. Query-string/fragment routes are not supported in this MVP.

Only consume an export after a successful CLI exit; an older bundle in a reused output folder is not evidence that a failed rerun succeeded. Output: `bundle.json`, original full-page screenshots at 1440/768/390 pixels, conversion warnings, source commit (when available), typography information, and a route manifest. Verify that the running source URL corresponds to the checkout/ref: the CLI records the checkout commit but cannot prove a separately running server serves it. The bundle contains page content and media; store unpublished exports appropriately.

### GitHub and private repositories

The CLI can clone and scan a GitHub repository without running its code:

```sh
node importer/engine/cli.mjs --github kyle041200/bizphone-ai-answer --ref main
```

`--github` also works with `--url`, `--routes`, and `--out` for conversion against an independently running instance of that source. `--ref` currently accepts branch/tag names; use a local checkout at an exact commit for detached-SHA conversion. Existing Git HTTPS/platform authentication is used first. If needed, supply `KGHQ_GITHUB_TOKEN` through a secure process environment. An ephemeral askpass helper reads it at runtime: credentials are not placed in URLs, command arguments, saved files, bundles, or browser JavaScript. Temporary GitHub checkouts are removed after successful scans/conversions. Use a fine-grained read-only repository contents token.

For the **WordPress dashboard's GitHub scan**, define this in server configuration (for example `wp-config.php`, before WordPress loads):

```php
define('KGHQ_GITHUB_TOKEN', getenv('KGHQ_GITHUB_TOKEN') ?: '');
```

Supply the actual value through your host's secret manager. Do not paste a token into the dashboard, page content, a public URL, or source control. The WordPress host needs HTTPS access to `api.github.com`. The dashboard never returns the token. Git CLI and GitHub API permissions are separate; successful Git checkout does not prove API access. Real private-repository access was not available for QA and is not claimed as tested.

## Reimport and existing content

Source identity is SHA-256 of normalized `owner/repository` plus the original route, independent of the WordPress slug. An imported route updates the same page only when **explicit replacement** is checked. Without it, the page and all edits remain untouched, even when source content changed. Approval replaces the selected imported pages' content/styles and returns them to drafts; take a backup first. WordPress revisions are requested before replacement, but revisions may be disabled by site policy. Styling metadata is not covered by core content revisions.

Unrelated pages are never matched by title or slug. New slugs are prefixed (`kghq-bizphone`); WordPress handles collisions by suffixing. Trashed source pages require restoration; ambiguous duplicate source metadata blocks the update. Per-route option locks prevent concurrent imports from creating duplicate pages. If a worker dies, check no import is running, list `kghq_lock_*` options with WP-CLI, and delete only the confirmed stale lock. Bundle jobs are scoped to the uploading user and expire after one hour; reload a bundle to continue.

**Internal links retain source paths.** Review/rewrite links after choosing final WordPress slugs. This avoids silently redirecting existing site navigation. No front-page assignment, menu, theme mod, theme file, or global navigation setting is changed.

## Native editing, styling, and removal

The converter uses WordPress's canonical block registration, serializer, parser, and validation APIs. Supported output includes Heading, Paragraph, Image, Button/Buttons, Group, Columns/Column, List/List Item, Separator, and Details. Standard content is individually editable. Original utility classes and responsive CSS retain the source appearance; editor controls can add native color, typography, spacing, and layout overrides. Class-derived values are not reverse-populated into every Gutenberg control. After major structural changes, review CSS-dependent layout and responsive behavior.

Source SVG icons are rasterized into transparent PNG graphics, including icons inside native rich text. Photographs retain their original bytes. Core Image blocks can be replaced in the Media Library; inline icons use native rich text images. No full-page screenshots, iframe pages, Custom HTML pages, React runtimes, or custom blocks are imported.

CSS is saved independently in WordPress page metadata, with asset URLs rewritten to Media Library URLs. The companion serves it only on imported pages and in their editors. Selectors, custom properties, keyframes, and declared font-face families are namespaced; compiled Tailwind layers are flattened to avoid losing to unlayered theme CSS. For classic themes, the companion removes only core-added inner wrappers on converter-marked Groups. Saved block markup stays canonical.

- **Deactivate/delete the importer:** pages, media, native blocks, CSS metadata, and canvas settings stay in WordPress. Keep **KGHQ Import Styles** active.
- **Deactivate/delete the companion:** native content/media remain, but custom CSS, classic Group normalization, and canvas template behavior stop. Theme rendering resumes. Do not expect pixel fidelity after removing both plugins.
- There is no deletion hook that removes imported content. CSS is stored in the WordPress database, not in importer plugin files. Include post metadata and uploads in backups/migrations.

## Conversion limits and extension path

Read `docs/SOURCE-ANALYSIS.md`, `docs/ARCHITECTURE.md`, and `docs/TEST-REPORT.md`. This is a rendered-DOM converter with a TanStack route scanner and a specific adapter for the KGHQ article catalog. It is not a static compiler for arbitrary React or an automatic replacement for application behavior.

React forms, calculators, filters, portals, video/canvas/iframes, stateful mobile menus, and other unsupported controls are reported for review. Native Details toggles are retained without JavaScript. For advanced components, implement a **separate persistent Gutenberg block plugin** with visual controls (for example form fields/labels/provider settings, calculator inputs/formula, or collection/filter fields). Keep that plugin installed for those blocks; never hide a React application in a Custom HTML block. No custom component runtime is included in this MVP.

Responsive CSS is retained, but React trees conditionally rendered at different viewport sizes, interactive states, responsive `srcset` art direction, pseudo-element-dependent semantics, inaccessible cross-origin stylesheets, and all router conventions need further adapters. Missing fonts/assets must be supplied or corrected at the source. URL-only dynamic routes, route parameters, external CSS imports, and missing assets are not silently considered successful conversions.

## Development checks

```sh
npm --prefix importer/engine test
node --check importer/wordpress/kghq-lovable-importer/admin.js
```

Run PHP lint against all PHP files and use the isolated WordPress staging tests in `importer/tests`. Those integration scripts are deliberately hard-coded to a local disposable staging instance and local-only credentials; do not point them at production. They exercise real REST endpoints, drafts, replacement, native editor validation, screenshots, and the deletion lifecycle. The existing Lovable application files and root dependency manifests are unchanged.
