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
