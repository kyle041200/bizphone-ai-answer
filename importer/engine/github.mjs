import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
const exec = promisify(execFile);
export function normalizeRepository(value){
 if(typeof value!=="string")throw Error("Use a GitHub repository URL or owner/repository");
 value=value.trim();if(value.startsWith("https://")){const u=new URL(value);if(u.hostname!=="github.com"||u.port||u.username||u.password||u.search||u.hash)throw Error("Use a github.com repository URL without credentials or query");value=u.pathname.replace(/^\/|\/$/g,"");}
 value=value.replace(/\.git$/,"");
 if(!/^[A-Za-z0-9][A-Za-z0-9_-]*\/[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(value))throw Error("Use a GitHub repository URL or owner/repository");return value;
}
export async function checkout(repository, ref) {
  repository=normalizeRepository(repository);
  if (
    !/^[\w.-]+\/[\w.-]+$/.test(repository) ||
    (ref !== undefined && (typeof ref!=="string" || !ref || ref.startsWith("-") || /[\s~^:?*[\\]/.test(ref)))
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
    if(!ref){const {stdout}=await exec("git",["ls-remote","--symref","https://github.com/"+repository+".git","HEAD"],{env,timeout:60000,maxBuffer:65536});ref=stdout.match(/^ref: refs\/heads\/(.+)\tHEAD$/m)?.[1];if(!ref||ref.startsWith("-")||/[\s~^:?*[\\]/.test(ref))throw Error("Default branch unavailable");}
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
      ref,
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
