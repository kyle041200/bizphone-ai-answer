# Published-site PHP importer: feasibility checkpoint

Date: 2026-10-31

Status: **INCOMPLETE — not an installable replacement release.**

Development branch: `kghq-importer-php-published-sites`.
Previous working source and packages remain on `kghq-importer-acceptance-qa`.
No production WordPress site was changed. No existing page was imported or replaced.

## Findings

- This repository uses TanStack Start with an SSR server entry (`vite.config.ts`)
  and generated routing marked `ssr: true`. That is evidence of server-rendering
  support in the source, not proof that every published route returns complete HTML.
- The managed environment denied the HTTPS CONNECT request to
  `bizphone-ai-answer.lovable.app` with HTTP 403. No published HTML was retrieved.
  `kghq.co` is also absent from the enforced destination list.
- The environment draft now includes both hosts alongside the already requested
  WordPress and font hosts. The draft save reported `requires_publish: true`.
  Saving a draft does not apply access to the running environment.
- PHP HTTP requests receive server responses and do not execute JavaScript.
  Browser-final DOM, computed styles and client-fetched data cannot be obtained by
  `wp_remote_get()` alone. Published client-only Lovable projects cannot meet the
  proposed universal import requirement under these runtime restrictions.
- Neither a sitemap nor repository routes resolve that content limitation. They
  discover URLs, not rendered page content. The supported PHP-only path requires
  content to be present in server-rendered or prerendered HTML at those URLs.

## New code

`class-published-document.php` is a standalone PHP preflight. It requires no Node,
external service or WordPress configuration. It excludes script/hydration data,
navigation, global headers, footers and the known Lovable badge, while preserving
headers inside main content. It rejects empty or ambiguous main regions and reports
interactive content for review. It does not sanitize HTML for publication and must
not be used as a replacement for a safe native-block converter.

The conservative main-region requirement can reject sites that use only generic
div containers. A future extraction fallback must be tested before enabling it.
`html-available` deliberately does not assert complete content or faithful conversion.

## Actual tests

Executed `qa/published-document.php` in the existing isolated staging PHP runtime,
without loading WordPress or modifying its database:

```json
{
    "passed": 9,
    "failed": 0,
    "scope": "Published HTML availability only; not importer acceptance"
}
```

Cases: empty response; React shell; hydration data without rendered content;
rendered main; ARIA main; ambiguous main regions; chrome without content;
empty main; chrome/script removal with section-header preservation and interaction
reporting. `git diff --check` also passed.

Published-source import, native-block conversion, CSS/font extraction, media import,
Settings API credentials, automatic discovery, safe reimports, editor widths,
screenshots, PHPCS and clean-install acceptance are **NOT TESTED for the new
architecture**. Prior architecture tests do not establish these results.

## Resume

Review and save the network draft in cloud environment settings, then publish the
environment. Verify the actual HTTP response for the published home page and at
least two routes before designing extraction and CSS mapping. Inspect the live
WordPress page read-only. Keep all writes and browser editing on isolated staging.

Do not remove the existing installable implementation until the replacement has
passed its tests. Old code is retained in this development checkpoint, so removal
of the previous runtime setup requirement has **not yet been implemented**. No new
plugin ZIP or acceptance PR is supplied at this checkpoint.
