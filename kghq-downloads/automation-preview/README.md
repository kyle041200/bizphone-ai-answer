# Two-step automation development preview — NOT release-ready

**Full end-to-end conversion/import is BLOCKED and has not passed. Do not install this preview on production or replace an existing working site with it.**

The actual isolated staging browser test verified: a normal two-step dashboard, no visible manual upload/branch field, full GitHub URL entry, real default-branch repository scan, exactly one selected page, automatic authenticated worker invocation, and safe error reporting. Every existing page content/CSS hash remained unchanged.

The test stopped at **“Conversion runner is not installed on the worker host.”** The cloud filesystem had approximately 174 MiB free, insufficient to build the runner image. An operator must provision a dedicated staging worker with approximately 12 GiB free storage and 8 GiB RAM, build/configure the runner, then rerun the complete dashboard-to-editable-draft test. Docker isolated installation/build/render, private repository credentials, successful automatic bundle handoff/import, and auto-generated draft visual/editing acceptance remain unverified.

Downloads:

- `kghq-lovable-importer-0.4.0-preview.zip`: installable **preview** importer with actual worker bridge and simplified dashboard.
- `kghq-import-styles-0.4.0-preview.zip`: persistent styling companion packaged with preview (plugin code remains the Phase 2 0.3.0 version).
- `kghq-converter-0.4.0-preview.zip`: current CLI source/lockfile/docs.
- `kghq-worker-0.4.0-preview.zip`: worker, conversion engine, Docker build context rules, and setup/limitations. Dependencies and secrets excluded.
- `kghq-complete-source-0.4.0-preview.zip`: complete importer project source including both plugins, worker, engine, QA scripts, configuration examples, and documentation. No node_modules/private state/credentials.
- `kghq-automation-test-results.zip`: actual browser screenshots, blocked E2E report, authenticated API/default-branch scan tests, and setup requirements.

Read [worker setup](../../importer/worker/README.md) before use. This is a one-time hosting/operator setup; normal end users must not touch JSON or run a CLI per conversion. A hosted production worker, automatic GitHub App/OAuth onboarding, and automatic post-save visual quality gating have not been deployed/implemented.

The tested Phase 2 fidelity/editability checkpoint and updated testing bundles are separately preserved under [phase-2](../phase-2/). Neither existing downloads nor main was changed. All supplied ZIPs passed CRC/readability checks and are below 95 MiB. Verify `SHA256SUMS`, then use GitHub's **Download raw file** button to save a ZIP locally.
