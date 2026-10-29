# Standalone converter package

From this directory after extracting the converter ZIP:

```sh
npm ci
node cli.mjs --repo /path/to/trusted/source
node cli.mjs --repo /path/to/trusted/source --repository owner/repository --url http://localhost:5173 --routes /bizphone,/bizsite --chromium /usr/bin/chromium --out /path/to/export
npm test
```

Use an existing Playwright Chromium installation if omitting `--chromium`, or set `KGHQ_CHROMIUM`. Source installation/build/startup are explicit separate steps; the converter never executes repository scripts. Use an existing isolated checkout, not a new Git worktree unless explicitly requested.

The CLI exports a versioned bundle for the WordPress importer. See the parent README and architecture/test reports for supported blocks, secure GitHub access, styling persistence, and tested limitations. The test fixture for this repository's route catalog requires its source checkout; serialization/security/scoping tests run independently.
