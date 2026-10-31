# Automated conversion worker — development candidate

The recovered development branch has passed fresh WordPress dashboard → GitHub
scan → selected conversion → native Gutenberg draft tests on an isolated site.
See [acceptance recovery status](../docs/RECOVERY-STATUS.md) and the dated evidence
under `kghq-downloads/acceptance-recovery/`. This is not production certification.
Earlier preview reports remain historical and do not describe current results.

## One-time operator setup

The regular import user needs no CLI or bundle files. A server operator must
first provision the worker and connect it to WordPress:

1. Use a dedicated Linux Docker host, Node 22+, Chromium runner image, Git and
   locked engine dependencies (`npm ci --prefix importer/engine --ignore-scripts`).
   Allow several GiB of disk and at least 4 GiB available per conversion job,
   plus the worker OS and Docker overhead. Only one conversion runs at a time.
2. Build from the `importer` context:
   `docker build -f importer/worker/Dockerfile -t kghq-converter-runner:0.5.0-rc1 importer`.
   If your environment requires a public proxy CA, supply
   `--secret id=proxy_ca,src=/path/to/public-proxy-ca.pem`. TLS verification stays on.
3. Configure a private environment file using `.env.example`. Set a cryptographically
   random token of at least 32 characters and exact approved repositories.
   `KGHQ_ALLOWED_OWNERS` is an optional owner-wide opt-in, disabled by default;
   `kyle041200` authorizes that owner's future repositories too. It does not
   authorize other owners or provision private repository credentials.
4. Store `KGHQ_WORKER_DATA` and Git temporary clones on a dedicated filesystem
   with enforced byte/inode quotas. Create private writable jobs/tmp directories
   before startup (the service example uses `/var/lib/kghq-worker`). Set `TMPDIR`
   as well as `KGHQ_WORKER_DATA`; Node Git clones otherwise use the OS temp directory. Host clone limits are not certified by the
   current tests. Source inventory limits apply after clone and are not a substitute.
5. Run `node importer/worker/server.mjs` as a dedicated trusted service account
   with Docker access. Docker access gives that service powerful host privileges;
   repository builds never run in that account. Example systemd/nginx configuration
   is in `deploy/`; it has not been publicly deployed or certified.
6. Expose only a TLS endpoint to approved WordPress servers. Keep the raw worker
   bound to loopback by default. Set server-side WordPress configuration:

   ```php
   define('KGHQ_WORKER_URL', 'https://converter.example.test');
   define('KGHQ_WORKER_TOKEN', 'the-same-private-random-token');
   ```

   Plain HTTP requires explicit `KGHQ_WORKER_ALLOW_HTTP=true` and is staging/private
   network only. Never put credentials in browser JavaScript or source repositories.
7. Install the independent styling companion and importer ZIPs. Open Tools →
   KGHQ Lovable Importer, paste the repository URL, scan, select exact pages,
   review warnings, and click **Convert & Import Selected Pages**. The importer
   creates drafts. Replacement requires a separate explicit approval checkbox.

## Supported and limited behavior

- Independently analyzed React/Vite projects with concrete React Router or TanStack
  routes. Frozen npm lockfiles and Bun text lockfiles are supported. Bun is pinned
  to 1.3.11. Other package managers and dynamic route expansion are unsupported.
- Dependencies install with scripts disabled in a disposable non-root container.
  Registry URLs must be on the operator allowlist. Optional
  `KGHQ_REGISTRY_REWRITES` is a JSON object of approved public URL prefixes to
  public registry prefixes; it changes only a disposable lockfile and preserves
  integrity hashes. It does not enable private npm credentials.
- All untrusted build/render code runs after container networking is disconnected.
  Root filesystem is read-only, capabilities dropped, no new privileges, 4 GiB
  memory, 2 CPUs, 256 processes, 2 GiB executable job tmpfs and 256 MiB temporary
  tmpfs. No source/token/home/Docker-socket mounts enter the runner. Source enters
  as bounded regular-file records, not host-extracted untrusted tar archives.
- Trusted host code checks selected route/repository identity and CSS containment
  before accepting runner output. WordPress independently validates blocks, assets,
  permissions, administrator job ownership and commit bindings.
- Private GitHub access uses an operator-managed fine-grained read-only
  `KGHQ_GITHUB_TOKEN` via Git askpass. It never enters the build container.
  Real private credentials, token refresh, TLS deployment and OAuth installation
  UI have not been tested/implemented as an end-user connection flow.
- Queue capacity 50, one active job, one-hour expiry, bounded polling, idempotent
  job creation, one clone retry and safe restart failures. Arbitrary build failures
  are not blindly retried. This is a single-host queue, not a distributed service.
- Source interactions/integrations are reported and require acknowledgment.
  Authentication, forms, application state and external integrations are not
  automatically migrated. Native editable Details supports disclosure behavior.
- Automated screenshot comparisons are staging QA tools, not an automatic
  post-import quality gate in the customer dashboard. Review remains necessary.

## Verification scope

The current worker was actually run outside WordPress on the private staging
network and used by the dashboard. It is not a hosted service deployed for your
installed WordPress site. No production WordPress deployment occurred.

Run worker tests with `node --test importer/worker/*.test.mjs`; optional
`KGHQ_TEST_NETWORK=1` exercises a real default-branch scan. See `qa/README.md` for
independent front-end, editor, preservation and sandbox verification. A passing
import does not imply visual fidelity, full editability or theme certification.
