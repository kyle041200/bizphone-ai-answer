import fs from "node:fs/promises";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { chromium } from "../engine/node_modules/playwright/index.mjs";
import { createBlock, serialize, validateContent } from "../engine/blocks.mjs";
const bytes = await fs.readFile("importer/work/font-fixture.woff2");
const id = crypto.createHash("sha256").update(bytes).digest("hex");
const scope = "kghq-page-f012345678ab";
const family = "kghq-qa-dashicons";
const content = serialize([
  createBlock(
    "core/group",
    { className: scope + " kghq-import-root", layout: { type: "default" } },
    [
      createBlock("core/paragraph", {
        content: "\uf100 Font persistence fixture",
        className: "kghq-font-example",
      }),
    ],
  ),
]);
assert.deepEqual(validateContent(content), []);
const bundle = {
  schemaVersion: 1,
  repository: "kghq-qa/font-fixture",
  pages: [
    {
      route: "/font-fixture",
      title: "KGHQ font fixture",
      scope,
      content,
      css: `@font-face{font-family:${family};src:url(https://kghq.invalid/asset/${id}) format('woff2');font-display:swap}.${scope} .kghq-font-example{font-family:${family};font-size:24px}`,
      warnings: [],
    },
  ],
  assets: [
    { id, filename: "font-fixture.woff2", mime: "font/woff2", data: bytes.toString("base64") },
  ],
};
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
try {
  await page.goto("http://localhost:8085/wp-login.php");
  await page.locator("#user_login").fill("kghq-admin");
  await page.locator("#user_pass").fill("local-staging-only-4829");
  await Promise.all([page.waitForURL("**/wp-admin/**"), page.locator("#wp-submit").click()]);
  await page.goto("http://localhost:8085/wp-admin/tools.php?page=kghq-importer");
  const nonce = await page.evaluate(() => KGHQ_IMPORT.nonce);
  const stage = await page.request.post(
    "http://localhost:8085/?rest_route=/kghq-importer/v1/stage",
    {
      headers: { "X-WP-Nonce": nonce },
      multipart: {
        bundle: {
          name: "font-fixture.json",
          mimeType: "application/json",
          buffer: Buffer.from(JSON.stringify(bundle)),
        },
      },
    },
  );
  const job = await stage.json();
  assert.equal(stage.status(), 200, JSON.stringify(job));
  const response = await page.request.post(
    "http://localhost:8085/?rest_route=/kghq-importer/v1/import",
    {
      headers: { "X-WP-Nonce": nonce },
      data: {
        job: job.job,
        route: "/font-fixture",
        replace: true,
        settings: { canvas: true, full: true, header: false, footer: false, width: 1200 },
      },
    },
  );
  const result = await response.json();
  assert.equal(response.status(), 200, JSON.stringify(result));
  await page.goto(result.preview);
  const loaded = await page.evaluate(async (family) => {
    const faces = await document.fonts.load(`24px "${family}"`);
    return faces.map((f) => ({ family: f.family, status: f.status }));
  }, family);
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].status, "loaded");
  const css = await page.locator("#kghq-durable-styles-inline-css").textContent();
  const url = css.match(/url\(([^)]+\.woff2)\)/)[1];
  const media = await page.request.get(url);
  assert.equal(media.status(), 200);
  assert.equal(
    crypto
      .createHash("sha256")
      .update(await media.body())
      .digest("hex"),
    id,
  );
  await fs.writeFile(
    "importer/work/font-result.json",
    JSON.stringify(
      {
        status: "passed",
        fixture: "WordPress core Dashicons WOFF2, not a source-site font",
        mediaHash: id,
        url,
        loaded,
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS WOFF2 uploaded into Media Library, bytes preserved, and browser FontFace loaded",
  );
} finally {
  await browser.close();
}
