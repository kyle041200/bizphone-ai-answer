# Final acceptance report — 2026-10-31 (Asia/Singapore)

**Overall acceptance: FAIL — not production-ready.** A working static-page import
workflow is proven on isolated staging. All project requirements are not satisfied.
No production WordPress website was deployed or modified.

## Separate grades

- **Visual fidelity: PARTIAL.** All nine local-reference numerical gates pass;
  original remote fonts, one source logo and the live published reference remain unresolved.
- **Gutenberg editability: PARTIAL.** Selected native editing actions, save/reopen
  and default computed-style parity pass. Complete inspector/usability coverage is not certified.
- **Functional integrity: PARTIAL.** Two-step automatic static imports, preservation,
  native Details and removal pass. Source app integrations and link remapping remain incomplete.

## Reproducible scope and provenance

The old workspace became unavailable. The pushed checkpoint `9689f4c` was recovered
before development continued. Earlier unpushed acceptance evidence is not relied on.
All results below were generated again in the replacement environment.

Sources: `kyle041200/bizphone-ai-answer` at
`4a66da501bbda92dd9fc318864decb215e8b3089` (TanStack Start/Vite/Bun), and
`GuidoPenta/TrackZilla` at `d8099fdb253f0d21eaece84a2895d9d0671c8aa7`
(React Router/Vite/npm). Real pages: Business Support (services/cards), Marketing
(long multi-section page), and TrackZilla home (marketing landing).
BizPhone and BizSite were never selected. Existing pages with those names in the
QA databases are synthetic preservation fixtures, not the user's production pages.

Final package set: importer **0.5.0-rc1**, independent companion **0.5.0-rc3**,
converter/runner **0.5.0-rc1**. Worker host source additionally contains owner-policy,
CSS containment and bounded dependency-retry modules. Tests use WordPress 7.1.4,
PHP 8.3.36, classic Twenty Seventeen 1.0 and its QA stress child. This older source
checkout is not certification of the latest official theme releases.

The final clean ZIP installation and two-page automatic import have separate
screenshots/results. Earlier three-page and cross-project tests ran on another
fresh database prefix. QA-native canary pages test preservation/formatting only;
they are not counted as extra Lovable repositories. No production endpoints were used.

## Visual method and actual measurements

Both reference and WordPress screenshots use the same Chromium rendering context,
1440/768/390 × 1000 viewports, device scale 1, en-US, UTC, light mode, reduced motion,
fonts/images/layout waits, decoded images, disabled animations/transitions/caret,
and hidden WordPress admin chrome. Remote requests are blocked consistently.
No application-content masks, scaling or image registration are used.

A changed pixel has any RGB-channel difference **greater than 25/255**. The report
also records mean absolute RGB error and local 16-pixel luminance SSIM. The internal
gate requires at most 5% changed pixels, SSIM at least 0.95, section geometry within
2 px, no unmatched source elements, no visible leaf-text mutations, and matching
full-page height/scroll width within 2 px. Native tag adapters, structural whitespace
and the documented invisible RichText marker are handled only in DOM pairing;
actual pixel differences are never erased. Smart punctuation is normalized for
pairing but separately reported as a real visible text mutation.

These are **changed-pixel measurements, not invented visual-similarity scores**.
A passing local gate does not certify the missing original fonts/assets or behaviors.

| Automatic worker draft | Width | Changed pixels | Local SSIM | Height delta | Local gate |
| --- | ---: | ---: | ---: | ---: | --- |
| `/business-support` | 1440 | 0.042% | 0.99879 | 0 px | PASS |
| `/business-support` | 768 | 0.062% | 0.99895 | 0 px | PASS |
| `/business-support` | 390 | 0.028% | 0.99965 | 0 px | PASS |
| `/marketing` | 1440 | 0.123% | 0.99646 | 0 px | PASS |
| `/marketing` | 768 | 0.173% | 0.99612 | 0 px | PASS |
| `/marketing` | 390 | 0.152% | 0.99625 | 0 px | PASS |
| `/` | 1440 | 0.011% | 0.99981 | 0 px | PASS |
| `/` | 768 | 0.027% | 0.99932 | 0 px | PASS |
| `/` | 390 | 0.035% | 0.99802 | 0 px | PASS |

Full-page/section originals, imports, diffs, overlays, computed-style/geometry
findings and an HTML side-by-side gallery are in the visual evidence ZIPs.
Each section retains its own findings; unresolved assets/functions remain blockers.

## Before/after and fixes

Controlled comparisons use the same source commits and capture conditions.
Before: published engine `9689f4c` plus companion rc1. After: current engine plus
companion rc2; rc3 adds only editor prompt styling and does not change frontend rendering.
These comparison fixtures are developer QA fixtures on a separate site, not manual
steps in the customer import flow. The primary table above uses actual automatic
worker output, not those fixture IDs.

| Source route | Width | Before changed pixels | After changed pixels | Visible leaf-text mutations |
| --- | ---: | ---: | ---: | ---: |
| `/business-support` | 1440 | 0.048% | 0.042% | 1 → 0 |
| `/business-support` | 768 | 0.069% | 0.062% | 1 → 0 |
| `/business-support` | 390 | 0.038% | 0.028% | 1 → 0 |
| `/marketing` | 1440 | 0.123% | 0.123% | 0 → 0 |
| `/marketing` | 768 | 0.173% | 0.173% | 0 → 0 |
| `/marketing` | 390 | 0.152% | 0.152% | 0 → 0 |
| `/` | 1440 | 0.177% | 0.005% | 2 → 0 |
| `/` | 768 | 0.173% | 0.024% | 2 → 0 |
| `/` | 390 | 0.127% | 0.033% | 2 → 0 |

The earlier published engine already preserved most section geometry in these
projects. No broad frontend layout improvement is invented for this comparison.
The newly traced frontend defect was WordPress smart quotes/dashes changing source
glyphs; the companion now bypasses that formatter only for imported content and
retains ordinary WordPress formatting elsewhere. A dedicated test passes after
importer deletion. Another concrete editor defect was four layout-choice prompts
inside decorative native Groups; the scoped editor fix hides the prompts while
retaining native Group blocks. Other generic improvements restore source image
loading behavior, semantic button selector aliases, source button paint defaults,
stronger scoped cascade protection, frozen Bun support, safe source transfer,
host-side CSS containment and bounded transport retries. No page-specific CSS patch
or source-site component template was introduced.

Small residual marketing case-study image/SVG differences remain in section reports
(up to about 1.95% changed pixels in that section). Section geometry matches; image
sampling/rasterization is a plausible contributor, not a proven diagnosis. Review
those diffs. The unavailable logo/font assets are not counted as successfully restored.

## Requirement scorecard

Evidence names below refer to the `evidence` folder or matching visual archives in
`kghq-downloads/acceptance-recovery`. Each row explicitly separates observed results
from remaining work or human setup/review.

| Requirement | Status | Observed result | Evidence | Human steps / remaining work |
| --- | --- | --- | --- | --- |
| Clean ZIP installation | PASS | Final importer rc1 and independent companion rc3 installed through WordPress Upload Plugin UI. | clean-install-results.json; clean-install screenshots | One-time operator setup only. |
| Two-step user flow | PASS | Paste repository URL, scan, checkbox-select exactly two pages, automatically invoke worker and create drafts. No bundle/CLI user step. | clean-final-two-page-automation.json; selection/result screenshots | None per import after worker setup. |
| Route/default-branch discovery | PASS | 12 supported concrete TanStack routes; 1 supported React Router route; default main and source commits recorded. | project-analysis reports; automation JSON | Dynamic route expansion unsupported. |
| Exact selection / drafts | PASS | Only selected routes imported in the clean test; both statuses created, native drafts. BizPhone/BizSite excluded. | clean-final-two-page-automation.json; current PHP preservation inventory | Review drafts before manually publishing. |
| Different projects / routing | PASS | Actual kyle041200/bizphone-ai-answer and GuidoPenta/TrackZilla; independent analysis, distinct styles and component structures. | project-analysis JSON; cross-project automation and screenshot archives | Only supported React/Vite configurations certified by these runs. |
| Full-page / section visual tests | PASS | Nine local-source comparisons at 1440/768/390; unmasked application pixels, section/element diagnostics and diffs. | verified-two-page and verified-project-b visual archives | This is a conditional local-source result, not live-site fidelity certification. |
| Published Lovable comparison | NOT TESTED | Published URL CONNECT request rejected with proxy 403. Local Git source used instead. | reference-availability.json | Environment access and a new comparison required. |
| Original font preservation | FAIL | Remote Google Fonts were unavailable and not vendored into Media Library. Matching fallback fonts do not prove original typography. | bundle warnings; project-analysis; visual capture font records | Automatic trusted font prefetch/vendoring remains required. |
| Available media preservation | PASS | 104 attachment originals retained; native Media Library replacement tested. SVG graphics rasterized to PNG. | final-rc3-removal.json; editor results | Vector editing/animated SVG states are limited. |
| Missing source graphics | PARTIAL | KGHQ light logo URL is absent from the checkout. Explicitly approved transparent placeholder, not a silent replacement. | two-page bundle warnings; visual missing-image records | Restore the real source asset before publication. |
| Native Gutenberg content | PASS | Headings, paragraphs, images, buttons, Groups, lists and Details; no page-sized HTML blocks, iframe or embedded React app. | native block inventory; editor results | Linked Layout is the documented custom-block dependency. |
| Gutenberg editing actions | PASS | 30 selected actions across three pages, 10 under the stress child, 10 final-companion regression actions, and 20 actions on the final clean installation; save/reopen valid. | parent/child/rc3 editor results and screenshots | Some color/layout/link operations use the native block store, not every inspector widget. |
| Complete nontechnical editing UX | PARTIAL | Real RichText and Media Library UI tested; not every inspector, drag gesture, breakpoint or source component certified. CSS-managed layouts do not always prefill native inspector values. | editor scripts/results; editor parity | Human usability review remains necessary. |
| Editor design representation | PARTIAL | Sampled heading/paragraph/button computed styles match front end; four decorative layout prompts removed without replacing native Groups. | editor-parity JSON; editor-decoration-results.json | Full editor-canvas pixel parity is not claimed. |
| Supported interactions | PASS | Native Details mouse/keyboard behavior and saved native button href verified after importer removal. | frontend-integrity.json | Only these supported behaviors passed. |
| React integrations / app behavior | PARTIAL | Auth, forms, application state, JS menus/buttons and external integrations are not automatically migrated. Acknowledgment required. | compatibility reports and bundle warnings | WordPress integrations/custom blocks required before publication. |
| Internal navigation destinations | PARTIAL | Original paths retained; WordPress draft slugs are prefixed. Automatic destination remapping is not implemented. | bundle link warnings; generated content | Review/fix links in Gutenberg before publication. |
| Classic parent + stress child | PASS | Twenty Seventeen 1.0 and QA stress child tested; all sampled computed styles identical at three widths; child editing passed. | theme-conflicts.json; child-editor-results.json | Opt-in canvas/full-width mode tested. |
| GeneratePress + GeneratePress child | NOT TESTED | Official theme download blocked by network policy. Stress child is not GeneratePress. | reference-availability.json | Mandatory named-theme matrix still outstanding. |
| Neve | NOT TESTED | Official theme release download blocked. No compatibility certification. | reference-availability.json | Test official release. |
| Astra | NOT TESTED | Official theme release download blocked. No compatibility certification. | reference-availability.json | Test official release. |
| Theme/global navigation preservation | PASS | Nonempty QA menu and theme settings hash unchanged through native draft import. Existing protected pages unchanged. | global-navigation-preservation.json; preservation results | Other theme/template modes not certified. |
| Existing edits / duplicate prevention | PASS | Unapproved reimport preserved IDs, content and style hashes; dashboard and PHP tests. Explicit regeneration confined to QA-created drafts. | final-preserve-two-page-automation.json; current preservation inventory | Replacement remains explicit. |
| Cross-project CSS isolation | PASS | Each of three real source pages loaded only its own expected namespace; second project did not alter existing page/style hashes. | frontend-integrity.json; automation preservation booleans | Cross-page copying of styled sections is not a styling migration feature. |
| Deactivate/delete importer | PASS | Actual WordPress UI deactivation and deletion; page/style hashes and 104 original media files unchanged; editor valid afterwards. | final-rc3-removal.json; removal screenshots | Keep independent companion active. |
| Persistent styling / dependencies | PASS | WordPress post-meta CSS and media remain independently available through companion rc3. Native content persists. | removal and punctuation results | Removing the companion too loses its styling/template/custom editor registration. |
| WordPress authorization / unsafe output | PASS | Anonymous/editor rejected; canonical bundle accepted; script, HTML block and external CSS asset attacks rejected. | current security-preservation JSON; named security tests | Not a complete penetration test. |
| Worker authentication / isolation | PASS | Authenticated API/idempotency tests; actual runner nonroot/read-only/cap-drop/no credentials/network disconnected; filesystem probe passed. | actual-runner-security.json; unit-results.json | Kernel escapes and host clone quota not certified. |
| Async progress / safe error handling | PASS | Actual job phases and automatic imports; registry outage failed safely with existing pages unchanged; retry protections unit tested. | automation logs; registry-failure evidence; named retry tests | Single-host queue, 20 selected routes per job. |
| Private credentials / production TLS | NOT TESTED | Public repositories used. Fine-grained server-side credential support exists; real private tokens and deployed TLS were not tested. | worker setup and configuration | Operator-managed credentials/TLS required; OAuth setup UI absent. |
| External worker deployment | PARTIAL | Actually running outside WordPress and used over private staging network. No durable customer-facing HTTPS service deployed. | automatic workflow logs; worker source/deploy examples | One-time operator hosting/configuration required. |
| Host clone resource quotas | NOT TESTED | Runner state bounded; Git checkout precedes 150 MB inventory validation. Dedicated byte/inode quotas are a deployment requirement. | worker architecture/deployment documentation | Enforce and test before production. |
| Automatic post-import visual gating | FAIL | Repeatable QA exists but is not a per-import WordPress dashboard gate. | qa scripts; worker documentation | Implementation remains outstanding. |

## Prioritized unresolved work

**P1 release blockers**

1. Automatically vendor/prefetch remote fonts and permitted source assets securely.
   Google Fonts were not imported. The worker deliberately disables networking before
   untrusted rendering; simply opening a cloud domain does not implement a safe font
   prefetch pipeline. The missing KGHQ logo also needs its real asset restored.
2. Integrate or explicitly implement source interactions (including JS navigation,
   forms/auth/application state) and map imported internal links to WordPress destinations.
   Existing static-content acknowledgments are not equivalent to functional migration.
3. Complete GeneratePress + child, Neve and Astra testing, and the live/font reference
   comparison. Current network policy rejected those downloads/references with 403.
4. Enforce/test host clone byte/inode quotas, real private credentials and durable TLS
   worker hosting. No public/customer worker endpoint was deployed by this task.
5. Integrate per-import post-save visual/editability reporting and quality gating.
   The current reports are repeatable QA artifacts, not a dashboard automation feature.

**P2 limitations**

- Dynamic route expansion, non-Vite frameworks and package managers beyond locked npm
  and Bun text locks are unsupported; job size is limited to 20 selected routes.
- Responsive picture/srcset art direction, SVG/vector editing and animated/icon states
  need further coverage. Current accepted media types are PNG/JPEG/GIF/WebP/WOFF/WOFF2.
- Full visual inspector/drag-and-drop usability and full editor-canvas layout parity
  require human review; store-driven tests do not prove every control widget.
- Only opt-in canvas/full-width rendering was used for fidelity comparisons. Standard
  theme templates, important third-party overrides, other browsers and older WP/PHP
  versions are not certified by this matrix.
- Some advanced CSS is intentionally rejected by output-containment checks instead of
  being allowed to affect unrelated content. More compatibility fixtures are needed.

## Installation, removal and delivery

See `INSTALLATION.md` in the downloads folder and `worker/README.md`. Hosting and
server-side authentication are one-time operator tasks. Normal imports use only
Connect Repository → Select Pages & Import; bundle ZIPs/CLI are developer backups.
Drafts require human review and manual publication. Keep the independent companion
active after deleting the importer, especially for canvas styling and Linked Layout
editor registration. Removing both plugins is not a durable-styling solution.

Earlier working branches/downloads are preserved. New deliverables belong only to
`kghq-importer-acceptance-qa`. Package checksums and ZIP validation are included.
Temporary registry/GitHub proxy 503 failures were recorded separately and later
recovered; failed conversions preserved existing WordPress content. Intermediate
invalid reference captures and failed harness iterations are not passing evidence.
