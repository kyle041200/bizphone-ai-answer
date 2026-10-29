import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
const exec = promisify(execFile);
export async function checkout(repository, ref = "main") {
  if (
    !/^[\w.-]+\/[\w.-]+$/.test(repository) ||
    !ref ||
    ref.startsWith("-") ||
    /[\s~^:?*[\\]/.test(ref)
  )
    throw Error("Invalid GitHub repository or ref");
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "kghq-source-"));
  const repo = path.join(directory, "repository");
  const helper = path.join(directory, "askpass.cjs");
  // Token is read at runtime, never interpolated into argv, URLs, files, bundles, or logs.
  await fs.writeFile(
    helper,
    `#!/usr/bin/env node\nprocess.stdout.write(process.argv[2]?.toLowerCase().includes('username')?'x-access-token':process.env.KGHQ_GITHUB_TOKEN||'');\n`,
    { mode: 0o700 },
  );
  const env = {
    ...process.env,
    GIT_TERMINAL_PROMPT: "0",
    ...(process.env.KGHQ_GITHUB_TOKEN ? { GIT_ASKPASS: helper } : {}),
  };
  try {
    await exec(
      "git",
      [
        "-c",
        "protocol.file.allow=never",
        "clone",
        "--depth",
        "1",
        "--branch",
        ref,
        "--single-branch",
        "--",
        "https://github.com/" + repository + ".git",
        repo,
      ],
      { env, maxBuffer: 1024 * 1024, timeout: 120_000 },
    );
    const { stdout } = await exec("git", ["-C", repo, "rev-parse", "HEAD"], { env });
    return {
      repo,
      commit: stdout.trim(),
      cleanup: () => fs.rm(directory, { recursive: true, force: true }),
    };
  } catch {
    await fs.rm(directory, { recursive: true, force: true });
    throw Error(
      "GitHub checkout failed. Verify repository/ref and existing HTTPS Git authentication or KGHQ_GITHUB_TOKEN. No source code was executed.",
    );
  }
}
