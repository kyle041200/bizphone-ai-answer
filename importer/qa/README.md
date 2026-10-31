# Repeatable isolated acceptance tests

Use a disposable WordPress container named `kghq-visual-wp` on host port 8086, admin `kghq-admin` (set `KGHQ_STAGING_PASSWORD`), and both development plugins. Scripts are intentionally staging-only and never accept production URLs by default. The hardcoded fallback password is synthetic disposable QA data, not a service credential. Keep database/wp-config/worker tokens outside distributable evidence.

Run the original repository on 5173 and an independently checked-out public Lovable source on 5175. Install Playwright/Chromium, Node locked engine dependencies, Python Pillow/numpy, Docker, and a classic theme. Do not run untrusted repository build scripts on WordPress or on a production host.

1. `node --test importer/engine/test.mjs importer/engine/analysis.test.mjs`
2. Generate a reviewed bundle with CLI, including explicit unsupported-interaction/missing-asset flags only when accepted. Assign unique QA-only routes and preserve original route as `sourceRoute`.
3. `node importer/qa/stage.mjs PATH-TO-BUNDLE LABEL` refuses source-key replacements and verifies pre-existing content/style hashes.
4. `node importer/qa/capture.mjs LABEL` (for another source set `KGHQ_SOURCE_URL=http://127.0.0.1:5175`). Local-only browser requests deliberately make unavailable remote fonts an explicit limitation. Wait for completion before generating reports.
5. `python3 importer/qa/report.py importer/work/visual/LABEL` creates full/section screenshots, diffs, overlays, geometry/style diagnostics, JSON, and an HTML gallery.
6. `node importer/qa/editor.mjs LABEL` **mutates only the first QA draft**, replacing text/image/styles and saving it. Use a separate draft from visual comparison pages. It checks actual RichText typing and native Media Library selection plus standard store-based style/layout changes, section operations, save/reopen, and frontend persistence. It independently reports failures; visual similarity does not override editing failures.
7. `node importer/qa/lifecycle.mjs` temporarily removes/restores importer files on this staging container, verifies page/CSS hashes and companion/media persistence.

`themes/kghq-classic-stress` is an opt-in QA child of Twenty Seventeen with conflicting styles. Never install it on a user site. Record active theme and run both capture and independent editor suites. Fixture `fixtures/server.mjs` offers synthetic styles/fonts/layout cases; it is not a second real Lovable repository.

Evidence from failed/intermediate iterations is diagnostic, not a passing acceptance result. The original published site could not be fetched under current network policy; local source screenshots do not certify live font/asset parity.


## Current acceptance evidence

See `docs/FINAL-ACCEPTANCE.md`. The normal product test is `automation.mjs`: it uses
actual dashboard scan/checkbox/import controls and never stages JSON. Set
`KGHQ_WP_URL` and `KGHQ_WP_CONTAINER` for a disposable loopback WordPress instance.
Use `KGHQ_TEST_REPOSITORY`, comma-separated `KGHQ_TEST_ROUTES`, and a unique
`KGHQ_TEST_LABEL`. Existing pages are preserved by default. A clean test must
expect `created`; a reimport-preservation run must explicitly expect `preserved`.
Only controlled QA-created fixture regeneration may enable `KGHQ_TEST_REPLACE=1`.

`install-plugins.mjs` installs actual ZIPs through WordPress UI. Current companion
is rc3. Fresh WordPress container startup must finish copying `wp-load.php` and
`wp-config.php` before installation helpers run. A first-start race is not an
application acceptance pass. Use separate database prefixes/containers; never reset
or remove a user's existing site to obtain a clean test.

`source-renderer/prepare.mjs` builds source fixtures from regular bounded files.
Use a clean export of source main, not this development branch's large downloads
folder. Source npm/Bun installation ignores scripts; untrusted build execution is
network-disabled. Runtime source servers use a private internal Docker network and
bounded containers. `source-renderer/forward.py` forwards only those explicitly
named containers to loopback for the browser; it never forwards internet targets.
`staging-network.php` is a QA-only MU helper for loopback sites: it suppresses
external WordPress update requests and routes only the private worker directly.
Never install it on a customer website.

`compare-components.py` performs a controlled before/after comparison on the old
QA site, changing only the companion version and preserving page content.
`verify-final.py` exercises actual automatic worker output on the final site.
`report.py` computes pixels, local SSIM, section/element geometry and visible text
mutations. `gallery.py` creates a full-page/section side-by-side viewer without
changing the measurements. Original-formatting and source-tag adapters are recorded
explicitly; pixel differences are never masked or normalized away.

Run `unit-checks.py` for named Node assertions, `editor-parity.mjs` before editing,
`editor.mjs` separately for actual RichText/Media Library plus native store-driven
controls, `theme-conflicts.mjs` for parent/stress-child comparison, and
`frontend-integrity.mjs` for scope isolation, native Details and saved links.
`acceptance-php.php` and `preservation-globals.php` are CLI-only staging probes.
`removal.mjs` actually deletes only the importer through WordPress UI and verifies
hashes/media/editor persistence. Keep the independent companion active.

All private config, cookies, raw worker job state and dependency trees stay outside
public deliverables. `package-final.py` curates only completed valid-reference
evidence and checks ZIP readability plus absence of the known synthetic staging
bearer. It is not an exhaustive credential or vulnerability audit.
