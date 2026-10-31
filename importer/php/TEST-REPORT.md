# PHP-only preview test report

Version: 0.6.0-alpha1. Date: 2026-10-31 (Asia/Singapore).

**Overall acceptance: INCOMPLETE / not production-ready.** Published-site visual
fidelity remains unverified. The new PHP packages do not need external conversion
infrastructure, Node, Docker, command execution or configuration constants.

| Area | Result | Actual observation |
| --- | --- | --- |
| HTML preflight | PASS | 11 standalone PHP cases covering rendered HTML, empty React shells, hydration data, chrome and interaction reporting. |
| PHP import integration | PASS | 28 assertions on isolated WordPress 7.1.4 / PHP 8.3.36, with intercepted synthetic public HTTP. |
| Native block markup | PASS | 19 native blocks validated with the official Gutenberg parser and after serialization/reopening. |
| Dashboard installation/import | PASS, synthetic source | WordPress upload UI installed both ZIPs. Settings page imported two synthetic pages as drafts without JSON, CLI conversion or external processing. |
| Direct Gutenberg editing | PARTIAL | Both page headings edited directly and saved/reopened with valid blocks. Not every image/button/layout/color control has an independent browser test. |
| Settings auto-save on Import | PASS, synthetic source | 7 follow-up browser checks: newly typed URL saved by Import, both edited drafts preserved, HTTP 403 without nonce, front-end/editor canvas width and shared stylesheet verified. |
| Reimport and preservation | PASS | Same draft IDs on reimport; content and title-only edits protected; unrelated slug preserved; staging BizPhone/BizSite canary content hashes unchanged. |
| Gutenberg save ordering | PASS | Regression covers REST content save followed by a stale unchecked legacy metabox, which previously cleared protection. Browser reproduction now preserves both edited drafts. |
| Native editable attributes | PARTIAL | Exact literal inline colors, font sizes, line heights and explicit side spacing mapped on supported elements. Source stylesheet-derived properties unfinished. |
| Source discovery | PARTIAL | Standard sitemap URL lists and same-origin crawling; query/fragment duplicates, assets and foreign links skipped. Empty sitemap fallback tested. Sitemap indexes and repository routes unfinished. |
| Source transport boundaries | PARTIAL | Private source addresses and cross-origin redirects rejected in assertions; missing AJAX nonce returns HTTP 403. Broader adversarial and non-admin tests remain. |
| Raster media | PASS, synthetic GIF | Attachment created, file retained, alt text saved, first featured image assigned, source image hotlink removed. Other accepted formats/cropping not exhaustively tested. |
| Classic-theme/editor canvas | PASS on synthetic Twenty Seventeen pages | Full-width front-end roots at 1440/768/390px; editor root 1160px inside a 1160px iframe. Not source design-width inference. |
| Independent styling/removal | PASS for scoped base | UI deletion tested. Draft content hashes, protection flags and attachment file survive. Companion retains base stylesheet; final canvas retention check recorded separately. |
| Source project styling/fonts | NOT IMPLEMENTED | No full CSS/Tailwind/responsive/token extraction or self-hosted source-font export. Matching theme font-family declarations do not prove source font loading. |
| Published Lovable URL | BLOCKED | Enforced cloud network policy denies the host. Synthetic fixtures are not proof of compatibility with the published site. |
| Two different Lovable projects | NOT TESTED | The PHP rewrite has synthetic fixture coverage, not real cross-project acceptance. |
| GeneratePress/child, Neve, Astra | NOT TESTED | No certification of these themes for the PHP rewrite. |
| PHPCS / WordPress standards | PARTIAL | PHP_CodeSniffer 3.13.4 + WordPress Coding Standards 3.2.0: 0 errors, 4 warnings, exit 1. Warnings flag source/asset postmeta lookup performance. |
| WP_DEBUG warning-free run | NOT PASSED | Logs contain blocked WordPress.org update warnings and old classic-theme IE-style deprecations. A duplicate QA WP_DEBUG declaration was corrected. PHP integration output is clean; a wholly warning-free environment is not certified. |
| Private repositories | NOT IMPLEMENTED | Optional Settings API fields masked; route/API integration absent. Tokens are not transmitted and are stored unencrypted in options. |

## Separate grades

- **Visual fidelity: PARTIAL / unverified against Lovable.** Canvas sizing and
  selected exact inline styles improved. No source visual similarity score exists.
- **Gutenberg editability: PARTIAL.** Native blocks, direct heading edits and
  save/reopen passed. The complete requested control matrix remains untested.
- **Functional integrity: PARTIAL.** PHP draft import, media and preservation pass
  synthetic tests. Private route discovery, interactions, retries and complete
  real-project acceptance remain unfinished.

## Screenshots and measurements

Evidence is published under `kghq-downloads/php-published-preview/evidence` on the
same development branch. It includes dashboard progress/results, direct editor
before/after screenshots, 1440/768/390 front-end captures and width comparisons.

The measured root constraint changed from 524.3125/389.75/300px to 1440/768/390px
on two same-content synthetic pages. A controlled same-page stylesheet regression reproduced an editor root change from 616px to 1160px
in its 1160px iframe. A custom imported-page canvas retains the theme header/footer
and removes its page wrapper. Scoped editor rules remove the theme's 580px body
maximum and root alignment wrapper margins only for imported pages.

`published-width-report.py` pairs raw before/after captures and writes absolute RGB
difference images, padding the smaller image with white, without scaling or image
registration. Theme wrapper/title changes are included. These compare the canvas
fix, not the original Lovable design; they are not a 95% fidelity measurement.

`integration.json`, `browser.json`, `blocks-result.json`, `upgrade.json`,
`retention-browser.json`, `retention-before.json`, `retention-after.json`,
`width-report.json` and `phpcs.json` provide machine-readable evidence.

## Test boundaries and corrections

The 28 PHP assertions use a synthetic public IP intercepted inside WordPress's
HTTP test filter. No request reaches that IP. The earlier existing loopback QA
site runs PHP assertions only. A separate new WordPress prefix/site runs actual
ZIP upload, dashboard and editor browser tests with a QA-only source fixture.
The fixture, synthetic admin credentials and developer QA infrastructure are not
required by the installed product and are not included in either plugin ZIP.

The first fresh browser run included an explicit Settings save. A successful 7-check follow-up test
verifies the final automatic-save-on-Import workflow, including the stored URL after reload. Test scripts use browser UI
for plugin installation and content editing; Gutenberg's save action is invoked
through its editor store. Server initialization and synthetic HTTP fixture setup
are developer test preparation, not user conversion steps.

Browser testing caught a stale progress message, the Gutenberg metabox save
race, and the Settings API hidden action field shadowing the form target in
JavaScript; all were fixed before final packaging. The harness also needed to wait for
WordPress login focus, settings-save navigation, editor frame creation and eager
image loading. UI plugin deletion supports both AJAX and fallback confirmation.
Earlier failed attempts are not counted as passes; the final JSON files record
observed successful assertions. Broader staging logs still have the warnings above.

Node is used only by developer Playwright/Gutenberg parser checks. Those scripts
use the existing development checkout's engine test dependencies; they are not
shipped inside the installable plugin. Product conversion is PHP only. Source ZIP
QA scripts require those developer dependencies when run from a full checkout.

## Unresolved priorities

1. **Critical:** source CSS/design-token/font extraction and responsive flex/grid
   mapping; compare real published pages and Gutenberg at all three widths.
2. **High:** real cross-project/theme acceptance, full visual editing control matrix,
   private repository routes, sitemap indexes and remaining core block mappings.
3. **High:** source interactions/integrations, internal link remapping (body links
   currently retain source destinations), retry/resume UX and shared-host timeout
   testing with many/large images. Per-page image downloads can exceed host limits.
4. **Medium:** optimize metadata lookups; eliminate remaining standards warnings;
   source image cropping/dimensions, stable section references in reports and fewer
   unnecessary wrapper Groups. Source main-container styling still needs translation.

Client-only React pages cannot be rendered by PHP HTTP requests. Do not advertise
universal Lovable compatibility or reuse previous architecture results as proof.

The preservation fingerprint includes content, title, slug, excerpt and featured image. Older preview fingerprints are conservatively treated as changed; explicitly clear protection only to approve replacement. The title-only regression passed.
