from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
work=ROOT/'work'
metrics=json.loads((work/'pixel-comparison.json').read_text())
state=json.loads((work/'staging-result.json').read_text())
life=json.loads((work/'lifecycle-result.json').read_text())
font=json.loads((work/'font-result.json').read_text())
assert len(state['extended'])==12 and all(t['status']=='passed' for t in state['extended'])
assert len(life['results'])==7 and all(t['status']=='passed' for t in life['results'])
assert font['status']=='passed'
rows='\n'.join(f"| /{m['page']} | {m['width']} | {m['pixelsAnyRGBDeltaAbove25Percent']:.2f}% | {m['sourceFullHeight']} | {m['importedFullHeight']} | {m['importedFullHeight']-m['sourceFullHeight']:+} |" for m in metrics)
report=f'''# KGHQ Lovable Importer — MVP test report

Date: **2026-10-29 (Asia/Singapore)**. All WordPress work was confined to a disposable local staging installation. No production deployment, publication, theme-file modification, menu replacement, or front-page reassignment was performed.

## Tested implementation and environment

- Source repository: `kyle041200/bizphone-ai-answer`, commit `4a66da501bbda92dd9fc318864decb215e8b3089`.
- Detected: **12 static routes + 9 concrete catalog article URLs**. GitHub HTTPS checkout and CLI AST scan worked with existing platform authentication.
- Converted and imported: **`/bizphone` and `/bizsite`**, as native Gutenberg draft pages, with **65 deduplicated assets** (seven original raster images and 58 transparent PNG icon graphics).
- WordPress **7.1.3**, PHP **8.3.36**, MariaDB **11.4**, Node **24.19.0**, Chromium **154.0.8037.57**.
- Classic parent theme: official WordPress `Twenty Seventeen` GitHub checkout, style header **1.0**, commit `fa09211f54799dd03e8acda9d19108aafb1a8c77`. This is the tested development checkout, not a claim about every later release.
- Child theme: a minimal WP-CLI-generated child of that parent. The plugin did not modify parent or existing theme files.
- Canonical serialization: `@wordpress/blocks` **17.0.0**, `@wordpress/block-library` **12.0.0**.

## Executed checks

| Suite / check | Result |
| --- | --- |
| Converter unit tests | **9 passed**, 0 failed, 0 skipped in this repository. Includes AST/catalog scan, CSS scope/layer/keyframe/variable behavior, escaped selectors, font names, secure Git arguments, native serialization, Details, and decorative inline spans. |
| Initial staging workflow | **6 passed**: unauthenticated/missing-nonce denial, valid bundle staging, unknown-route rejection, importing a selected route, and duplicate preservation. |
| Extended REST/editor integration | **12 passed** on actual ZIP-installed plugin code; detailed cases below. |
| Administrator/editor/anonymous capability gate | Passed through WordPress REST dispatch. Invalid administrator request reached validation (400), editor was denied (403), anonymous user was denied (401). |
| WOFF2 media/font fixture | Passed: valid WordPress-core Dashicons WOFF2 uploaded to Media Library, bytes matched SHA-256, and browser FontFace loaded. This is an independent fixture, not a source-site font. |
| ZIP install / child / removal lifecycle | **7 passed**: actual ZIP activation; child-theme rendering; importer deactivation; importer deletion; no styles on an unrelated page; native content retained with companion off; styling restored with companion on and importer absent. |
| PHP syntax | All three plugin PHP files passed lint. |
| JavaScript syntax / formatting | Checked; new JS/MJS and JSON formatted without changing the existing application source. |

The extended cases exercised invalid nonces; tampered asset hashes; injected scripts and disallowed Custom HTML blocks; external CSS asset URLs; wrong JSON field types (including repository, pages, and source commit); valid revised jobs; manual content edits retained without approval; explicit replacement updating the same page ID and retaining draft status; unrelated-page preservation despite slug collisions; functional native FAQ toggles; no invalid Gutenberg blocks or recovery prompts; and independently mutable heading/image/spacing attributes. All imported images loaded at the three tested viewport widths without horizontal overflow.

Selection is per route: the dashboard sends only checked routes, and the server imports one validated job route per request. An unselected route is not implicitly imported. Later tests explicitly imported/refreshed the second page. Reimport without approval returned `preserved`; an approved replacement returned `updated` with the same ID.

Deletion tests compared native-content/CSS hashes, page identities, media counts, front-page setting, and navigation-location settings before/after. The independent companion retained the same CSS hash and loaded media with the importer actually deleted. Turning off the companion retained content/media but removed styling, as documented. The importer was then reinstalled from its ZIP so staging remains usable for review.

## Screenshot comparison

Both pages were captured from the source and WordPress at **1440**, **768**, and **390** pixels wide. `kghq-qa-evidence.zip` contains a local `visual-comparison.html` gallery, original/imported full-page images, side-by-side top-of-page images, and difference images. The gallery opens from disk after extraction; it is not a hosted preview.

The pixel column measures the **first 1,000 vertical pixels only**: percentage of pixels with any RGB channel differing by more than 25 on the 0–255 scale. It is a diagnostic, not a universal visual pass threshold. Full-page heights expose remaining cumulative layout differences.

| Page | Width | Top-1000px difference | Source height | Imported height | Height change |
| --- | ---: | ---: | ---: | ---: | ---: |
{rows}

The initial screenshots exposed several real defects, which were fixed before the final export: CSS backslashes lost in WordPress metadata, a Tailwind/WordPress `size-full` collision, unlayered theme CSS overriding layered utilities, classic-theme Group inner wrappers, native Button default widths, source typography defaults, and SVG handling. Native Details retains FAQ behavior without a JavaScript dependency. Decorative inline spans are retained with invisible text so native RichText can round-trip their markup.

**Remaining visual differences:** full-page spacing and some lower grid/card geometry still differ, even when the hero closely matches. SVG icons are raster graphics rather than editable vectors. Some intrinsic SVG sizing, pseudo-element styling, complex nested selectors, and editor-wrapper layouts require manual review. Native layout semantics and theme defaults can affect the result. Do not infer full-page pixel equality from the top-of-page measurements. Screenshots for the five named commercial/free theme families have not been produced.

## Typography, media, and style editing

All referenced assets in the successful bundle passed content-hash and format validation and were rewritten to WordPress uploads URLs. The two tested source routes did not expose downloadable browser FontFace registrations; their actual rendered fallback family lists and sizes were retained. Real WOFF2 upload/loading is covered separately by the core-font fixture. A complete end-to-end conversion with an original Sora/Manrope webfont binary is **unrun**, because those source binaries were not present in the tested pages.

Standard content is native and editable: text, headings, buttons/links, images, Groups, Columns, Lists, and Details. Original visual rules remain in scoped CSS. **Class-derived styles are not fully reverse-mapped into Gutenberg design controls.** Controls can add native overrides, but removing an original CSS gradient/background or changing some preset typography may require removing its source class in Advanced or adjusting exported CSS. This MVP is not a complete visual design-system migration. Review after structural/style edits.

## Scope limits and unrun checks

- **GeneratePress, Neve, Astra, Kadence, and OceanWP are architecturally targeted, not tested/certified.** Parent/child detection, per-page canvas, scoped CSS, and no theme-file writes are implemented. Only the parent/child theme above was exercised.
- WordPress.org theme download access was denied by this environment's network policy. The tested classic theme came from its official accessible GitHub source. No TLS/integrity checks were bypassed.
- An attempted article-page conversion stopped on a source logo URL returning HTTP 404 locally. **Whole-site conversion did not pass and is not claimed.** Missing source assets must be supplied before attempting it.
- Dynamic React forms, filtering, calculators, stateful menus, authentication, portals, and other application behavior are not automatically recreated. The converter reports limitations and preserves static native content where possible. Advanced behavior requires a separate persistent custom Gutenberg block or established WordPress integration with visual controls; none is silently embedded.
- Internal source links retain original paths; imported WordPress slugs are prefixed to protect existing pages. Review link destinations before publishing.
- Real private GitHub authentication, live WordPress-to-GitHub API scanning from this restricted staging network, multisite, older WordPress/PHP versions, other routers, React viewport-conditional trees, external CSS imports, and art-directed `srcset` media are **unrun** or require adapters.
- PHP declares a minimum of 8.1 and WordPress a minimum of 6.6; those older versions are **not certified by this test run**.
- Per-page imports are not a whole-site transaction. A later failure leaves earlier successful drafts intact. Interrupted worker locks need deliberate stale-lock cleanup. Core content revisions do not back up CSS metadata; back up post metadata/uploads separately.
- The example bundle should be reviewed on the target staging theme before use. This is an MVP, not a production-readiness or universal-compatibility claim.

## Reproduction and removal

Follow `README.md` and `ARCHITECTURE.md`. Install the independent styling companion first, load a validated converter bundle, select pages, and review drafts. The importer can then be removed. Keep the companion for CSS/font delivery, imported Group normalization, and canvas templates. Removing both packages keeps native content/media but changes appearance.

Original application source, tests, root dependency declarations, and root lockfile remained unchanged. Implementation, tests, packaging, documentation, and local evidence are confined to `importer/` and disposable staging resources.
'''
(ROOT/'docs/TEST-REPORT.md').write_text(report)
print('Wrote',ROOT/'docs/TEST-REPORT.md')
