# Phase 2 checkpoint downloads (0.3.0)

Development checkpoint only. The requested two-step automated worker workflow is **not implemented by these ZIPs**; it is the next pass. See [the report](../../importer/docs/PHASE-2.md) for separate visual, editing, and functionality grades and unresolved limitations.

- `kghq-lovable-importer-0.3.0.zip`: installable WordPress importer.
- `kghq-import-styles-0.3.0.zip`: independent persistent styling/canvas/custom linked-layout editor companion; keep active after removing importer.
- `kghq-converter-0.3.0.zip`: converter source, lockfile, tests, and docs (install dependencies separately on a conversion host).
- `kghq-three-page-test-bundle.zip`: `/`, `/business-support`, `/marketing`; **excludes BizPhone/BizSite**. Its bundle includes assets inline. Explicit warnings cover missing original images/fonts and unsupported interactions. Do not import existing routes without deliberate review.
- `trackzilla-public-landing-test-bundle.zip`: independent public Lovable repository's static unauthenticated landing state. Auth and job-tracking functionality are not migrated.
- `kghq-phase-2-reports.zip`: source analysis/results, machine-readable visual/geometry metrics, editor results, lifecycle results, and strict policy test evidence.
- `kghq-evidence-baseline.zip` / `kghq-evidence-release.zip`: before/after full-page captures and section difference images at all three widths. `project-b-release`, `stress-child`, `stress-kghq` evidence ZIPs cover the separate project and QA classic child theme.
- `kghq-editor-evidence.zip`: independent visual editing before/after screenshots and results. These are separate from front-end comparisons.

All ZIPs are readable and below 95 MiB. Verify with `sha256sum -c SHA256SUMS`. No reconstruction is necessary. Exact section originals and 50/50 overlays can be regenerated from the supplied full screenshots and capture.json using the source QA scripts; these redundant derived images are not duplicated in the download archives.

To download: open a ZIP on GitHub, then choose **Download raw file**. If the browser shows a preview, use its Download button. The previous working downloads folder remains unchanged outside this phase-2 subfolder. Complete editable source is in the development branch's `importer/` directory.

No production deployment occurred. Use a separate staging site, back up content/uploads/metadata, install companion first, and review all warnings. These bundles are developer testing artifacts; the finished two-step UI must not require users to upload them.
