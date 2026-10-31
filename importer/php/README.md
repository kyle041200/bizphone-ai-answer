# KGHQ published HTML importer — 0.6.0-alpha1

**Development preview, not production-ready.** The PHP-only settings workflow is
implemented for bounded server-rendered HTML. This release does not yet preserve
the published site's full visual identity. Do not replace a working installation
on production with this preview.

## Staging installation

1. Back up staging. Deactivate the previous KGHQ Lovable Importer there.
2. Upload `kghq-lovable-importer-0.6.0-alpha1.zip` through Plugins → Add New →
   Upload Plugin and activate it. The ZIP uses the existing plugin slug, so it
   replaces the importer on that staging installation. Old imported pages are
   retained but are not managed by the new source metadata scheme.
3. Open Settings → KGHQ Lovable Importer. Enter the published site URL.
4. Click **Import published pages as drafts**; settings save automatically. Keep the tab open.
5. Review the per-page warnings. Open Edit or View draft links. Nothing is published.

Only PHP 8.1+, the DOM extension, WordPress 6.6+, public outbound HTTPS and writable
WordPress media storage are required at runtime. No configuration constants,
server process, command-line conversion, uploaded JSON or external authentication
service is used by this preview. PHP hosting request limits still apply.

Repository, branch and masked token fields are saved using the Settings API.
**Repository route discovery is not yet implemented.** These optional fields do
not enable private repository importing in this preview; tokens are not transmitted.
Saved tokens are stored in the WordPress options database, not encrypted. Blank
input keeps the existing token; Remove saved token clears it. Do not enter a token
unless you accept database/backup administrators being able to read it.

## Supported content and safeguards

- Standard sitemap URL lists, plus same-origin internal link crawling, up to 50 pages.
- A single `main` or `role="main"` region with actual server-rendered HTML is required.
- Native Group, Heading, Paragraph, List/List Item, Image, Buttons/Button,
  Separator, Quote, Details and basic Table blocks.
- Literal supported inline colors, font sizes, line heights and individual
  margin/padding sides on headings, paragraphs and groups become editable attributes.
- Verified raster images are sideloaded with alt text. The first imported image
  supplies the featured image when the page has none. SVG and source cropping are
  not supported. Each page has a 30-image cap; each image has an 8 MB/32 MP cap.
- Exact source URL ownership plus slug collision checks prevent unrelated page
  replacement. Reimports update unedited owned drafts; published pages are skipped.
- Saving content edits automatically enables **Edited manually** protection. The
  page's KGHQ import protection panel can explicitly clear that protection. The
  reimport fingerprint also covers title, slug, excerpt and featured image changes.
- Unsupported interactions are reported; scripts/forms are omitted instead of
  inserted as executable HTML. Review warnings before publishing.

## Styling and removal

Read [STYLING-GUIDE.md](STYLING-GUIDE.md). The current stylesheet supplies a scoped
base with provisional content widths and an independent full-width page canvas;
it is **not** extracted source design CSS. Importer
deletion preserves posts, metadata and attachments. To retain this base styling,
install and keep `kghq-published-styles-0.6.0-alpha1.zip` active before deleting the
importer. Remove saved access tokens in Settings before deleting the importer if
you do not want them retained in the options database. The older KGHQ Import
Styles companion is for the previous architecture
and cannot be assumed to service this new preview's metadata. Keep it active if
older imports still depend on its styling or custom blocks; this preview does not
migrate those dependencies.

## Known gaps

Source stylesheets, Tailwind responsive rules, external fonts/self-hosting,
CSS variables, gradients, shadows, flex/grid layout translation, Columns/Gallery/
Cover/Media & Text/Embed conversions, sitemap indexes, optional GitHub route
discovery, retry/resume UI, cross-project/theme visual acceptance and complete
editor/front-end width parity remain unfinished. Some generic wrappers produce
more Groups than a hand-built page. Nested inline styles and interactive state
cannot be reconstructed from a raw HTML request. Content loaded later by JavaScript
cannot reliably be detected from the HTTP response alone.

See [TEST-REPORT.md](TEST-REPORT.md) for actual checks and untested requirements.
The earlier release remains on `kghq-importer-acceptance-qa`; main is unchanged.
