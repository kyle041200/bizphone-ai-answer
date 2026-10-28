# Architecture and API contract

## Boundaries

`GitHub or local checkout → AST route manifest → trusted running source → Chromium DOM/CSS/assets → native WordPress block serialization → versioned JSON bundle → authenticated WordPress REST → draft pages + attachments + durable page metadata → independent styling companion`.

The CLI is the defined automation boundary: GitHub Actions, Codex, or Claude Code can invoke it, inspect exit status/warnings/screenshots, and transfer the bundle to a staging WordPress workflow. Exit 0 means a bundle was produced and its native saved markup passed the installed WordPress JS parser/validator; it does not certify every theme, runtime behavior, SEO metadata, source/server commit alignment, or publication readiness. A server wrapper can invoke this process later in a sandbox; the importer never runs remote shell commands.

The current MVP intentionally uses a file transfer between conversion and WordPress. There is no always-on conversion API, remote code executor, webhook, automatic production deploy, or credential-bearing browser client.

## Bundle v1

See `bundle.schema.json`. Main fields:

- `schemaVersion: 1`, `repository: owner/name`, optional `sourceCommit`, `createdAt`.
- `pages[]`: unique source route, title, generated page scope, serialized native block `content`, scoped CSS, source hash, typography report, warnings.
- `assets[]`: SHA-256 content ID, sanitized filename, MIME hint, base64 bytes. References in content/CSS use `https://kghq.invalid/asset/<sha256>` until WordPress rewrites them.
- `scan`: scanner manifest and unresolved route warnings.

The schema is a structural interchange reference; the PHP importer performs additional limits, SHA-256 verification, magic-byte asset identification, allowed-block checks, WordPress HTML sanitization checks, URL checks, and capability enforcement. Bundles must originate from a trusted source/converter. Administrator upload privilege is not a sandbox for hostile CSS. Do not import arbitrary third-party JSON.

## WordPress REST

Namespace: `kghq-importer/v1`. Standard WordPress REST cookie authentication and `X-WP-Nonce` are used. Application-password auth can be used on an appropriately secured HTTPS staging site. All endpoints require the same administrative/content/media capabilities, including `unfiltered_html`.

- `POST /scan` JSON `{repository, ref}`: server-side GitHub tree preview for TanStack file routes. GitHub host is fixed to `api.github.com`; no arbitrary remote URL is accepted. Token comes only from a server constant backed by a secret environment variable. No GitHub source is evaluated.
- `POST /stage` multipart `bundle`: validates and stores a user-scoped one-hour job; returns job token and page summaries. The opaque job identifier is not a GitHub credential and is insufficient without authenticated authorization.
- `POST /import` JSON `{job, route, replace: false, settings: {width: 1200, canvas: false, full: false, header: true, footer: true}}`: imports one selected route. Calls are sequential in the dashboard for progress and per-page errors. Selection is enforced by selecting a single route from a validated job; arbitrary route requests fail.

Responses include `created`, `updated`, or `preserved`, page ID, draft preview/edit URLs, and warnings. WP_Error responses use 400 (invalid bundle/settings), 403/401 (auth/permissions), 409 (ambiguous source/lock/trashed page), or 500 (storage failure). Temporary media created before a failed page save is removed; pre-existing media/content is preserved. Successful imports remain saved if a later selected page fails: the batch is intentionally per-page, not a site-wide transaction.

## Metadata and persistence

Pages use `_kghq_source_key`, `_kghq_repository`, `_kghq_route`, `_kghq_source_commit`, `_kghq_css`, `_kghq_scope`, `_kghq_content_hash`, `_kghq_warnings`, `_kghq_layout`, and optionally `_wp_page_template=kghq-canvas.php`. Media uses `_kghq_asset_hash` for reuse. Settings are per page. Native blocks and metadata are retained after either package is deleted.

The companion has no dependency on importer classes. It reads CSS/layout metadata, enqueues scoped styling on the relevant page/editor, supplies the optional canvas template, and normalizes the classic-theme core Group inner container only for generated Group classes. This behavior is an explicit persistent styling dependency; it is not hidden in the importer.

## Security and operational limits

The WordPress importer does not clone repositories, run Node, accept shell commands, fetch arbitrary asset URLs, load remote JavaScript, accept SVG uploads, or expose GitHub tokens. Media bytes arrive in a validated upload and are type-checked; original SVG graphics are rasterized by the CLI. CSS remote assets must be embedded. Unknown blocks and unsafe markup fail before content writes. New pages are drafts and never overwrite unrelated content. Errors do not log authorization headers or token values.

Use OS/browser isolation when converting untrusted sites: Chromium executes the source site's client-side code to render it, while the WordPress side remains separate. Build tools and running-site configuration are outside the converter's responsibility. Private repository authentication uses existing Git authentication or an ephemeral environment-backed askpass helper. The browser never receives the GitHub token.

Known hardening work before broad distribution: resumable background queues; stronger transactional metadata failure handling; richer per-route conflict/revision UI; a complete PHP CSS parser for independently untrusted bundles; more router adapters; authenticated conversion sources; art-directed responsive images; screenshot tolerances per component; theme-specific template/header integrations; and private GitHub/multisite/older WordPress version matrices.
