# KGHQ Lovable Importer downloads

## New: remaining-pages bundle (BizPhone and BizSite excluded)

Download `KGHQ-Remaining-Pages-Import-Bundle.zip`, extract it, and upload its `bundle.json` through the installed importer. It contains 19 pages and 333 embedded media assets. Read [REMAINING-PAGES-IMPORT.md](REMAINING-PAGES-IMPORT.md) for exact steps, missing-source-image/font limitations and unsupported interactions. The original two-page example ZIP below still contains BizPhone/BizSite; use the new bundle for this import.

Download this branch using **Code → Download ZIP**, or open an individual ZIP and click **Download raw file** (the download arrow).

- `KGHQ-WordPress-Importer-Plugin.zip`: install in WordPress Plugins → Add New → Upload Plugin.
- `KGHQ-Independent-Styling-Companion.zip`: install separately and keep active to retain imported styling.
- `KGHQ-Two-Page-Import-Bundle.zip`: extract and upload its JSON through the importer dashboard.
- `KGHQ-Conversion-CLI.zip`: independent conversion engine, source and lockfile.
- `KGHQ-Screenshot-Evidence.zip`: staging screenshots and test evidence.
- `KGHQ-Lovable-Importer-Complete.zip`: clean complete transfer backup, including the preceding deliverables and project source/tests/configuration.

Read `Installation-Instructions.md` and `documentation/TEST-REPORT.md` before testing. This is the documented two-page MVP; automated dashboard-triggered conversion is not implemented.

The clean backup excludes installed dependencies, cloned test themes/Git metadata, temporary working files, diagnostic logs and staging job/preview metadata. Dependencies can be restored using the included lockfile and `npm ci`. The original full workspace backup remains unchanged. Completed plugin and CLI ZIP bytes are unchanged. Staging fixture credentials in test source are synthetic local-only values, not connected account credentials.

All ZIPs passed CRC/readability checks and recursive credential-signature checks. SHA-256 checksums are in `SHA256SUMS.txt`. No file exceeds 95,000,000 bytes, so splitting/reconstruction is unnecessary. Nothing was deployed and main was not changed.
