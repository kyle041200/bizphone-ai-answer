# KGHQ Lovable Importer — tested development candidate

**Not production-ready.** Read [FINAL-ACCEPTANCE.md](FINAL-ACCEPTANCE.md) for the
PASS / FAIL / PARTIAL / NOT TESTED scorecard, actual measurements and unresolved work.

The real two-step workflow passed on clean isolated WordPress staging. Current
WordPress downloads are in [packages](packages):

- **kghq-lovable-importer-0.5.0-rc1.zip**
- **kghq-import-styles-0.5.0-rc3.zip** — independent persistent companion; use rc3.

See [INSTALLATION.md](INSTALLATION.md). A one-time operator-hosted authenticated
worker is required; no customer-facing hosted worker was deployed for your site.
Normal imports require no CLI, JSON upload or Codex conversion.

[Bundles](bundles) are developer/staging backups of actual automatic worker output,
with media embedded. The KGHQ test bundle contains Business Support and Marketing;
BizPhone and BizSite are excluded. Missing remote fonts/logo and unsupported source
interactions are explicitly documented. Do not treat the bundles as complete apps.

Source/worker ZIPs include code, locked manifests, configuration examples and QA
scripts without dependencies or actual credentials. [Evidence](evidence) contains
observed results, UI screenshots, security/preservation outputs and visual summaries.
Unzip a [visual-evidence](visual-evidence) archive and open its index.html for full-page
and section comparisons, diffs and computed-style/geometry findings.

The complete backup is a single ZIP or numbered parts, depending on size. Use
[RECONSTRUCT.md](RECONSTRUCT.md), [SHA256SUMS.txt](SHA256SUMS.txt), and
[package-validation.json](package-validation.json). GitHub's **Download raw file**
control downloads actual ZIP/part files to your computer; these are not Codex
workspace artifact links. Older working branches/packages remain preserved.
