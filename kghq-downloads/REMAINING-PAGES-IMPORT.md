# Import the remaining KGHQ Lovable pages

Generated from `kyle041200/bizphone-ai-answer` at commit `4a66da501bbda92dd9fc318864decb215e8b3089`.
Bundle schema: 1, compatible with KGHQ Lovable Importer 0.1.0. Contains **19 pages** and **333 deduplicated media assets**. BizPhone (`/bizphone`) and BizSite (`/bizsite`) are excluded.

## Download and import

1. Download `KGHQ-Remaining-Pages-Import-Bundle.zip` using GitHub's **Download raw file** arrow, then extract it on your computer. Alternatively download `bundle.json` directly and save it with that filename.
2. Activate the independent **KGHQ Import Styles** companion plugin. Its existing ZIP is already in this folder; no new importer or companion version is required for this bundle.
3. Open WordPress **Tools → KGHQ Lovable Importer**. Use the **Load converted pages** JSON upload (or optional offline bundle import on newer versions). Choose the extracted **bundle.json**, not the ZIP.
4. Select exactly the pages you want with the checkboxes. Leave **I approve replacing selected existing imported pages** unchecked. Existing imported pages and edits will be preserved; unrelated pages are never matched by title or slug.
5. Select layout settings. For the closest source layout on a classic theme, use the companion canvas template and full width; include the theme header/footer only if wanted on the imported draft. These settings apply to imported pages, not global theme settings.
6. Click **Import selected pages as drafts**. Preview each draft and open **Edit blocks** to edit native headings, text, images, buttons and layout blocks. Do not publish until you have reviewed the warnings, mobile layout and destination links.

The JSON is 21,615,781 bytes (~20.6 MiB). Your server's upload and POST limits must be higher than this; 64 MB for each is a practical setting. If WordPress rejects the upload before validation, ask your host to adjust `upload_max_filesize` and `post_max_size`. Do not edit the JSON to work around upload limits.

## Media and persistent styling

All available imported images, rasterized SVG icons and CSS asset files are embedded in this JSON. The importer creates/reuses Media Library attachments automatically; there is no separate media upload. Page-scoped colors, gradients, layout utilities, spacing and responsive CSS are embedded in the bundle and saved as independent page metadata.

You can remove the importer after successful conversion. **Keep KGHQ Import Styles active** to serve that saved CSS and any canvas templates. Removing the companion retains native content and media but removes its styling/template support. The JSON does not install React or custom interactive blocks.

## Known source limitations requiring review

- Original Sora/Manrope family names and typography CSS are retained, but the local source registered **no loaded downloadable font faces**. A cross-origin stylesheet was unreadable. This bundle therefore does not contain those font binaries and cannot guarantee their appearance. Obtain properly licensed font files and configure them in WordPress if exact typography is required.
- Two original image URLs were unavailable in the source. Transparent placeholders preserve editable image blocks; replace them in Gutenberg with the correct graphics:
  - Missing source image /__l5e/assets-v1/eb80ef3a-f849-4f43-b0d4-b2317f321c7b/kghq-logo-light.png: a transparent placeholder was imported. Restore the original graphic manually; it was unavailable in the source checkout.
  - Missing source image /__l5e/assets-v1/f8d380ad-ef2b-4dd2-b201-d40f745f341b/ScaleScraper.png: a transparent placeholder was imported. Restore the original graphic manually; it was unavailable in the source checkout.
- Forms, inputs, selects, textareas, JavaScript buttons, filters and onboarding/submission flows are not functional conversions. Their available static text/layout is imported and warnings are recorded; replace these with a WordPress form or appropriate native/custom integration. Do not publish an onboarding/contact page expecting it to submit data.
- Hidden SVG icons without a measurable rendered box were omitted and reported. Visible SVGs are transparent PNG images. Inspect mobile navigation and icon rendering.
- Source internal links retain original paths. Imported draft slugs use the `kghq-` prefix, so update links before publishing, including links to your existing BizPhone/BizSite pages if their WordPress paths differ.
- Native blocks are editable, but class-derived styles are not all represented by Gutenberg design controls. Some typography/background changes require adjusting Advanced classes or the page CSS.

## Verification and practical limits

All 19 pages passed canonical Gutenberg parse/save validation. The **unchanged 0.1.0 importer** on isolated local staging accepted the final bundle, including SHA-256 asset integrity, image signatures, block allowlist and safe-markup checks. Ampersand-containing Tailwind utility tokens were consistently renamed in CSS and block attributes to pass WordPress sanitization without changing their intended selectors. The bundle is within the importer's 48 MiB JSON / 35 MiB decoded-media / 50-page limits.

This release performed validation only: **zero WordPress pages were imported or modified**. No production connection or deployment occurred. Visual comparisons against imported versions of all 19 pages have not been performed; preview on your actual theme before publishing. Conversion fidelity is not certified for GeneratePress, Neve, Astra or other themes by this report.

Full route-specific warnings are in `remaining-pages-conversion-report.json`; validation results are in `remaining-pages-validation.json`.

## Included routes

- `/` — KGHQ — The Execution Engine for Small Business
- `/articles` — Articles — Small Business Insights | KGHQ
- `/articles/appointment-setting-guide` — Step-by-Step Guide to Appointment Setting for Small Business Owners — KGHQ Articles
- `/articles/digital-marketing-tactics-small-business` — 5 Proven Digital Marketing Tactics to Boost Small Business Conversions — KGHQ Articles
- `/articles/evolution-of-growth-services` — The Evolution of Growth Services for Small Business Owners: What’s Next? — KGHQ Articles
- `/articles/future-of-virtual-assistant-services` — The Future of Virtual Assistant Services: AI, Automation, and Human Touch — KGHQ Articles
- `/articles/outbound-outreach-book-more-clients` — How to Use Outbound Outreach Services to Consistently Book More Clients — KGHQ Articles
- `/articles/outsourcing-helps-entrepreneurs` — From Data Entry to Growth Services: How Outsourcing Helps Entrepreneurs Win — KGHQ Articles
- `/articles/reasons-entrepreneurs-need-marketing-agency` — 5 Reasons Entrepreneurs Need a Marketing Agency for Small Business Success — KGHQ Articles
- `/articles/social-media-virtual-assistants` — How Small Business Owners Can Leverage Social Media Virtual Assistants for Growth — KGHQ Articles
- `/articles/strategic-planning-before-scaling` — Why Every Entrepreneur Needs Strategic Planning Before Scaling — KGHQ Articles
- `/business-support` — Business Support That Keeps Work Moving — KGHQ
- `/deliverables` — Deliverables Library — KGHQ
- `/growth-reset` — Growth Reset Workshop — KGHQ
- `/marketing` — Marketing Solutions That Get Done — KGHQ
- `/new-client` — New Client Onboarding — KGHQ
- `/partners` — KGHQ Partner Network — Help Small Businesses Execute
- `/sales` — Sales Development That Gets Done — KGHQ
- `/training` — Free Training Sessions for Small Business Owners — KGHQ
