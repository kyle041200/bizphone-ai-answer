# Install and test the current candidate

This is a development candidate, **not production-ready**. Read
`FINAL-ACCEPTANCE.md` and its unresolved defects first. Existing working branches
and packages remain unchanged. Use an isolated staging WordPress website.

## Download from GitHub

Open this branch's `kghq-downloads/acceptance-recovery/packages` folder. Open the
ZIP you need and use GitHub's **Download raw file** control. These are real GitHub
files; no Codex workspace artifact publisher is required. Sign into GitHub if the
repository requires access. Do not use older historical packages by mistake.

Current WordPress files:

- `kghq-import-styles-0.5.0-rc3.zip` — install/activate first; persistent companion.
- `kghq-lovable-importer-0.5.0-rc1.zip` — importer/dashboard.

The components have independent version numbers. Older rc1/rc2 companion files
remain as historical checkpoints; use rc3 for current testing.

## One-time operator setup

A server operator must host and configure the external conversion worker. The
WordPress ZIP is not a hosted conversion service. See the worker source package,
`worker/README.md`, `.env.example`, Dockerfile and deployment examples. Requirements
include Linux Docker, Node 22+, Git, locked engine dependencies, several GiB of
free disk and at least 4 GiB available per active conversion, plus OS overhead.
Enforce host clone byte/inode quotas and deploy verified TLS before production.
Real private repository credentials and production TLS have not been certified.

Set a private random worker bearer token and approved repository policy server-side.
The optional owner allowlist is disabled by default; `KGHQ_ALLOWED_OWNERS=kyle041200`
is the user-approved opt-in for that owner's future repositories. It does not
expand a GitHub credential's permissions. Never put credentials in browser code.

Configure WordPress server-side, before the stop-editing line in wp-config.php:

```php
define('KGHQ_WORKER_URL', 'https://your-worker-host.example');
define('KGHQ_WORKER_TOKEN', 'your-private-random-worker-token');
```

The tested worker was reachable over a private disposable staging network, not a
public service deployed for your existing WordPress website. HTTP requires an
explicit staging-only exception; normal hosted use requires TLS.

Use WordPress 6.6+ and PHP 8.1+. Tested: WordPress 7.1.4/PHP 8.3.36. The importer
account needs manage_options, edit_pages, upload_files and unfiltered_html. On
multisite, unfiltered_html normally requires super administrator access.

## Regular user workflow — two steps

1. Open Tools → KGHQ Lovable Importer. Paste a GitHub repository URL or
   owner/repository and click **Scan Website**. The default branch is detected.
2. Check exactly the desired pages and click **Convert & Import Selected Pages**.
   Review compatibility warnings/options before proceeding. The worker runs
   automatically; progress and draft preview/edit links appear in the dashboard.

No CLI, JSON upload, manual repository download or Codex conversion is required
per import. The CLI and bundle ZIPs are developer backups/troubleshooting tools.
Manual bundle staging is hidden unless the operator enables developer mode.

New pages are drafts. Keep replacement unchecked to preserve existing pages and
WordPress edits. Unrelated same-path pages are not overwritten. Job size is limited
to 20 selected routes. Unsupported interactions require explicit acknowledgment.
Missing fonts/images fail by default; accepting their warnings permits degraded
output and is not proof that those assets were restored.

For source-like staging comparisons, choose the independent canvas template/full
width and disable the existing theme header/footer only when intended. These
settings affect imported pages, not global navigation/settings. The source may
already contain its own header/footer. Default theme-template layouts and the
named GeneratePress/Neve/Astra matrix remain untested.

## Editing, review and removal

Edit native text/images/buttons/Groups in Gutenberg. The reusable Linked Layout
block additionally requires the companion's editor registration. CSS-driven
responsive styling does not automatically provide every native inspector default
or independent breakpoint control; see the editability limitations.

Review source links (draft slugs are prefixed), unsupported menus/forms/auth,
missing fonts/assets and all responsive previews. Publish only after human review.
No source JS integrations are silently claimed as working.

You may deactivate/delete the importer after conversion. Native pages and media
remain. **Keep KGHQ Import Styles active** for scoped CSS, canvas templates and
Linked Layout editing. Removing both plugins loses those styling/editor services.

## Backups, bundles and evidence

- `bundles/kghq-two-page-acceptance-bundle.zip`: Business Support + Marketing only;
  no BizPhone or BizSite. `trackzilla-acceptance-bundle.zip`: independent project.
  Media assets are embedded as integrity-checked base64; styling is included in
  the bundle. No separate media upload is needed for developer staging imports.
- `kghq-converter-0.5.0-rc1.zip`: developer CLI source and locked dependencies.
- Worker/source archives: full project code, configuration examples and QA scripts,
  excluding dependencies, private environment files, cookies and credentials.
- Visual archives: unzip one and open its `index.html` locally for full-page and
  section source/WordPress/diff views. JSON reports retain metrics and limitations.
- Complete backup: if split for GitHub's file limit, use `RECONSTRUCT.md`. Verify
  `SHA256SUMS.txt`. ZIP integrity verification is included in `package-validation.json`.

The test bundles explicitly report unavailable remote fonts and the missing KGHQ
light logo. The normal offline worker still needs secure font prefetch/vendoring
work; opening a network domain alone does not implement it.
