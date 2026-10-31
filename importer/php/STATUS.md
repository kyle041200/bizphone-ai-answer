# PHP published-site importer status

0.6.0-alpha1, 2026-10-31. **Working development preview; incomplete acceptance.**

The new source is under `wordpress/`. It provides Settings API source fields,
sitemap/link discovery, a browser-driven PHP import queue, native core blocks,
raster Media Library imports, source-owned draft updates, edit protection, an
independent styling companion and a scoped classic-theme/editor canvas.

See [README.md](README.md), [STYLING-GUIDE.md](STYLING-GUIDE.md) and
[TEST-REPORT.md](TEST-REPORT.md) for setup, observed tests and unresolved work.

This branch preserves the previous implementation elsewhere in the checkout;
the new ZIPs contain only the PHP published-site implementation. Historical
source/packages remain on `kghq-importer-acceptance-qa`. Main and production
WordPress content have not been changed.

The target published Lovable URL remains blocked by this environment's enforced
network policy. Synthetic source tests do not establish compatibility with that
published site. Its repository has SSR support, but the actual response still
needs verification. PHP HTTP requests cannot render client-only React pages.

Source CSS/font extraction, responsive translation and real cross-project/theme
acceptance are incomplete. No universal compatibility or production readiness
claim is made. Saved environment network changes have not been applied/published.
