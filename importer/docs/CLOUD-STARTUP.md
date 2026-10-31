# Resume development in a managed cloud workspace

Use the reviewed `kghq-importer-acceptance-qa` development source, not main (which
intentionally has no importer). Preserve existing changes and never reset main or
create a Git worktree just for setup. Read AGENTS.md and the cloud runtime skill.

The tested dependency/setup commands, from `/workspace/bizphone-ai-answer`, are:

```sh
npm ci --prefix importer/engine --ignore-scripts --no-audit --no-fund
python3 -c 'import PIL, numpy'
python3 importer/qa/unit-checks.py
```

The current managed base supplies Node, Git, Chromium, Python/Pillow/numpy and Docker.
Verify Docker against its managed local socket before using it. Build the runner
with the Dockerfile and the session's public CA as documented in worker/README.md.
Do not disable TLS or package-integrity checks. Check free space first; Docker's
vfs driver duplicates layers. Do not remove user data/backups to free build space.

Live processes must restart after environment restoration. If the owned disposable
containers exist, inspect them before starting only those needed:

- `kghq-visual-db`: isolated QA database.
- `kghq-clean-wp`: final fresh-install workflow on loopback port 8088.
- `kghq-final-wp`: isolated acceptance site on 8087; importer intentionally deleted
  by the actual removal test, companion retained.
- `kghq-visual-wp`: controlled before/after site on 8086.
- `kghq-source-a`, `kghq-source-b`: credential-free source renderer containers on
  the internal source-only network.

Never assume ignored private configuration or Docker volumes survived. If the
private QA worker helper/config are present, restart that worker once, using the
current session proxy/CA and the existing private token without printing it. If
absent, follow worker/README.md to generate a new private one-time configuration
and connect only disposable WordPress instances. Never package wp-config.php,
private environment files or browser cookies. The live test policy authorizes
only the two named public test repositories; owner-wide access remains an opt-in.

For source comparisons, restart the owned internal source containers and use
`qa/source-renderer/forward.py` for their loopback transport only. Check an actual
source page/title and reject error responses before calculating any visual score.
The published Lovable URL, Google font hosts and official theme downloads require
additional network access; a saved configuration draft is not applied access.

Do not blindly rerun mutating tests against populated sites. `automation.mjs`
expects new drafts by default; preservation checks explicitly expect preserved
status. Editor tests modify only labeled QA drafts. Removal tests actually delete
the importer. Retain their evidence before controlled regeneration. Never point
these scripts at production. Fresh-task restoration has not been independently
certified; the GitHub branch, source ZIPs and checksums are the recoverable source.
