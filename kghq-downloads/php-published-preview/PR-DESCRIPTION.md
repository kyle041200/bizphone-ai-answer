# Add a PHP-only published HTML importer preview and scoped editor canvas

The previous import path required separate conversion infrastructure. This adds an
experimental PHP-only package under `importer/php/wordpress`: enter a published URL
and click Import. Settings save automatically through the Settings API, and
authenticated browser requests process a bounded sitemap/link crawl into drafts.
Only server-rendered HTML is supported; PHP does not execute React JavaScript.

Core Gutenberg blocks preserve editable content, selected literal inline values
and verified raster media. Source ownership, slug locks and protection fingerprints
preserve unrelated pages and detect subsequent content/title/slug/excerpt/featured
image edits. An independent companion retains the scoped base stylesheet and
classic-theme canvas after importer removal. A styling guide documents implemented
behavior, width rules and remaining design-system work.

The previous release and its packages remain unchanged on their existing branches.
Legacy source also remains elsewhere in this checkout until replacement acceptance
is complete; it is excluded from the new plugin ZIPs. No production deployment.

## Actual validation

- 11 PHP HTML preflight cases; 28 WordPress PHP integration assertions.
- 19 native blocks pass canonical Gutenberg validation and serialization/reopen.
- Fresh isolated WordPress UI installation/import/edit checks on synthetic pages;
  7 follow-up checks verify automatic settings save, edit preservation, nonce
  rejection, shared styles and current canvas widths.
- Same-page editor stylesheet regression: 616px root becomes 1160px in a 1160px
  iframe. Synthetic front-end roots change from 524.3125/389.75/300px to
  1440/768/390px. These are geometry measurements, not Lovable similarity scores.
- UI importer deletion leaves both draft content hashes and Media Library image
  intact. Companion styling, canvas and native editor continue working.
- PHPCS 3.13.4 / WPCS 3.2.0: **0 errors, 4 metadata-query performance warnings**;
  not an unconditional standards pass. Staging logs include blocked WordPress.org
  update warnings and legacy-theme deprecations; warning-free acceptance is unmet.

## Remaining critical limitations

**Not production-ready.** Source CSS/Tailwind/responsive layout/font extraction,
self-hosted font export and real published-site visual acceptance are incomplete.
The cloud network policy still blocks the target published Lovable host. Synthetic
test success does not establish that site's fidelity. Neve, GeneratePress/child and
Astra are not tested for this rewrite. Private repository routes, sitemap indexes,
several core block mappings, interactions, link remapping and host-scale retries
remain unfinished. Complete Gutenberg editing control coverage is also pending.

Installable alpha ZIPs, source, guide, machine-readable reports and screenshots:
[deliverables](https://github.com/kyle041200/bizphone-ai-answer/tree/kghq-importer-php-published-sites/kghq-downloads/php-published-preview).

[Detailed scorecard](https://github.com/kyle041200/bizphone-ai-answer/blob/kghq-importer-php-published-sites/importer/php/TEST-REPORT.md).
