# Automated worker development preview (0.4.0)

**Not production-ready; full conversion E2E is blocked and has not passed.** The actual WordPress dashboard → authenticated worker → public repository clone/default-branch analysis → page checkbox selection → conversion-job initiation has been exercised on isolated staging. Conversion stops safely because the runner image is not installed. Current cloud disk availability was approximately 174 MiB, insufficient for an image build. No automatic draft was created by this workflow test. Phase 2 CLI-generated drafts passed separate visual/editing tests; those are not evidence that this worker path passed.

The worker is actual asynchronous server/queue/build-isolation code, not a dashboard mock. Its Docker install/build/render path, tmpfs resource limits, network disconnection, new automatic bundle handoff, and successful automatic draft save still require verification on a suitably provisioned **isolated staging host**. Do not replace the existing working plugin with this preview on a user site.

## One-time site-operator setup

End users must not run Node commands or handle bundles. The following setup is performed once by a hosting/site operator; subsequent projects use the two-step WordPress dashboard.

1. Provision a dedicated disposable Linux worker VM with Node 22+, Git, Docker Engine, at least 8 GiB RAM, 2 CPU cores, and **12 GiB free storage** for image layers/cache/checkouts. Prefer rootless Docker or a dedicated worker VM: Docker access is a privileged host capability. This cloud session's vfs driver expands build layers substantially, so allow additional headroom. Put worker data **and TMPDIR used for Git checkout** on a dedicated filesystem with enforced disk/inode quotas. A low-free-space check is not a substitute for quotas. Do not share production services/credentials with the worker.
2. Configure firewall/egress policy. Only GitHub is required for host checkout; dependency installation requires explicitly reviewed HTTPS package registries, by default registry.npmjs.org. Use a dedicated restricted Docker installation network or egress proxy, preventing access to internal services/cloud metadata. `KGHQ_ALLOWED_REGISTRIES` validates lockfile hosts but does not enforce DNS/network routing by itself. Container build/render network is disconnected and checked before repository scripts execute.
3. Check out this development branch. In the `importer` directory build the isolated runner:

   ```sh
   docker build -f worker/Dockerfile -t kghq-converter-runner:0.4.0 .
   ```

   `.dockerignore` excludes local work, secrets, and dependencies. If a managed proxy requires a public CA, use the BuildKit secret supported by the Dockerfile (`--secret id=proxy_ca,src=/path/to/public-ca.crt`) with the build environment's approved proxy settings. Never disable TLS verification. The production runner image has not been built/tested in this pass.
4. Create a private service environment file **outside Git**, mode 0600, based on `.env.example`. Generate a random 32-byte worker token. Set an explicit repository allowlist; each client project must be authorized by the operator. Start `node importer/worker/server.mjs` under a supervised non-root service with that environment. Bind loopback behind an HTTPS reverse proxy. Add service-level CPU/memory/pid/file limits and protect data/backups. Node does not automatically load `.env` files; use your service manager's environment-file facility. Install engine dependencies with the committed lockfile (`npm ci --ignore-scripts` in `importer/engine`) on the worker host for static AST analysis.
5. For private repositories, configure a fine-grained, read-only GitHub token in the worker service's `KGHQ_GITHUB_TOKEN`, restricted to approved repositories and contents/metadata read access. A short-lived GitHub App installation token may also be supplied by an operator-managed refresh process; automatic OAuth/App installation/refresh UI is **not implemented**. Tokens are used by Git's temporary askpass helper, not embedded in URLs, browser data, job reports, or containers. Private repository access has **not been tested** with a real private credential. Private npm dependencies are not supported by this adapter.
6. Install the independent KGHQ Import Styles companion and preview importer on isolated WordPress staging. Configure server-side `wp-config.php` constants before the stop-editing line:

   ```php
   define('KGHQ_WORKER_URL', 'https://worker.example.test');
   define('KGHQ_WORKER_TOKEN', 'the-same-private-random-worker-token');
   ```

   Keep secrets out of source control/backups intended for sharing. TLS verification stays enabled; redirects never receive the token. Plain HTTP requires explicit `KGHQ_WORKER_ALLOW_HTTP=true` and is for trusted private staging networks only. Configure private-network NO_PROXY routing at the operator level when required, without bypassing internet restrictions.
7. Open Tools → KGHQ Lovable Importer. Paste a full GitHub repository URL or owner/repository, scan, review compatibility warnings, select exact pages, and click **Convert & Import Selected Pages**. Unsupported interactions require acknowledgment; missing assets/images fail by default and can be explicitly accepted under compatibility options. Pages are drafts. Existing imported pages are preserved unless replacement is explicitly approved. Theme globals/navigation are not changed; canvas/header/footer settings are per imported page.

The normal UI has exactly two numbered steps. Manual JSON upload exists only when an operator explicitly enables `KGHQ_IMPORTER_DEVELOPER_MODE`; it is not part of the normal workflow.

## Supported initial automation contract

- GitHub HTTPS repositories, automatic default branch, concrete static React Router/TanStack routes found by independent project analysis.
- **React + Vite with committed package-lock.json**. `npm ci --ignore-scripts` runs in the disposable runner. Reviewed registry HTTPS dependencies only. Other package managers, non-Vite frameworks, dynamic route expansion, custom install scripts, SSR adapters beyond the experimental TanStack/Vite renderer, and private package registries need more development/testing. They must not be silently represented as supported.
- Single active job, bounded queue, persisted job state, one-hour expiry. Interrupted jobs are marked failed after restart; users can retry. Idempotency keys protect creation against transient POST retries. Browser polling retries connection errors with bounds; Git clone retries once. Arbitrary source build/render failures are not blindly retried. This is not a distributed queue service.
- WordPress binds jobs to the requesting administrator, repository, scan commit, and selected routes; validates the received bundle/assets; imports only those routes. Post locks and source keys prevent duplicates and unapproved replacement. No publishing endpoint is used.
- Container writable project state is a 2 GiB tmpfs, temporary state 256 MiB, memory 4 GiB, CPU 2, pids 256. Root filesystem read-only, capabilities dropped, no new privileges, no Docker socket, no repository/token/secret host mounts. One runner persists through install then loses its network before build/render. Output is read as one bounded regular JSON file, never extracted into the host from an untrusted tar archive.

## Verification and remaining gaps

Run `node --test importer/worker/test.mjs`; add `KGHQ_TEST_NETWORK=1` for the real public GitHub default-branch scan. `node importer/qa/automation.mjs` tests the real WordPress UI on the dedicated staging site and reports **BLOCKED**, rather than passing, when the runner is unavailable. Before release this must be rerun on a properly provisioned host and produce an actual editable Gutenberg draft with no JSON/CLI end-user steps. Then rerun Phase 2 front-end/editor suites on that automatically generated draft and verify persistence, duplicates, private access, worker restart/retry, source failures, and security/resource limits.

Per-import automatic post-save screenshot comparison/quality gating is not yet connected to the worker. Phase 2 comparison scripts are separate staging QA tools. Live font downloads, all commercial classic theme combinations, unsupported interactions/integrations, and broad editor parity remain unresolved as documented in `docs/PHASE-2.md`.

No production service was deployed. This preview is not a claim of universal React conversion or complete automation acceptance.
