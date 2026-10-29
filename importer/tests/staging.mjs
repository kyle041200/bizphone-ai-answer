import { chromium } from "../engine/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const site = "http://localhost:8085";
const bundle = await fs.readFile(new URL("../work/export/bundle.json", import.meta.url));
const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const results = [];
async function check(name, fn) {
  await fn();
  results.push({ name, status: "passed" });
  console.log("PASS", name);
}
try {
  await check("Unauthenticated API denied", async () => {
    const r = await page.request.post(site + "/?rest_route=/kghq-importer/v1/import", { data: {} });
    assert.equal(r.status(), 401);
  });
  await page.goto(site + "/wp-login.php");
  await page.locator("#user_login").fill("kghq-admin");
  await page.locator("#user_pass").fill("local-staging-only-4829");
  await Promise.all([page.waitForURL("**/wp-admin/**"), page.locator("#wp-submit").click()]);
  await page.goto(site + "/wp-admin/tools.php?page=kghq-importer");
  await page.screenshot({
    path: new URL("../work/admin-dashboard.png", import.meta.url).pathname,
    fullPage: true,
  });
  const nonce = await page.evaluate(() => KGHQ_IMPORT.nonce);
  const post = async (endpoint, data) =>
    page.request.post(site + "/?rest_route=/kghq-importer/v1/" + endpoint, {
      headers: { "X-WP-Nonce": nonce },
      data,
    });
  let job;
  await check("Bundle validates and stages", async () => {
    const r = await page.request.post(site + "/?rest_route=/kghq-importer/v1/stage", {
      headers: { "X-WP-Nonce": nonce },
      multipart: { bundle: { name: "bundle.json", mimeType: "application/json", buffer: bundle } },
    });
    const data = await r.json();
    assert.equal(r.status(), 200, JSON.stringify(data));
    assert.equal(data.pages.length, 2);
    job = data.job;
  });
  await check("Missing nonce denied", async () => {
    const r = await page.request.post(site + "/?rest_route=/kghq-importer/v1/import", {
      data: { job, route: "/bizphone" },
    });
    assert.equal(r.status(), 401);
  });
  await check("Non-bundle route denied", async () => {
    const r = await post("import", { job, route: "/not-selected" });
    assert.equal(r.status(), 400);
  });
  let imported;
  await check("Import only one selected route as draft", async () => {
    const r = await post("import", {
      job,
      route: "/bizphone",
      replace: false,
      settings: { canvas: true, full: true, header: false, footer: false, width: 1200 },
    });
    imported = await r.json();
    assert.equal(r.status(), 200, JSON.stringify(imported));
    assert.ok(["created", "preserved"].includes(imported.status));
  });
  await check("Duplicate import preserves existing page", async () => {
    const r = await post("import", { job, route: "/bizphone", replace: false });
    const body = await r.json();
    assert.equal(body.status, "preserved");
    assert.equal(body.id, imported.id);
  });
  await fs.writeFile(
    new URL("../work/staging-result.json", import.meta.url),
    JSON.stringify(
      { job, id: imported.id, preview: imported.preview, edit: imported.edit, results },
      null,
      2,
    ),
  );
  await page.goto(imported.preview);
  assert.equal(await page.locator("h1").count(), 1);
  assert.match(await page.locator("h1").innerText(), /Never Miss/);
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.screenshot({
      path: new URL(`../work/imported-${width}.png`, import.meta.url).pathname,
      fullPage: true,
    });
  }
  await page.goto(imported.edit);
  await page.waitForTimeout(4000);
  await page.screenshot({
    path: new URL("../work/block-editor.png", import.meta.url).pathname,
    fullPage: true,
  });
  console.log("Staging page", imported.id);
} finally {
  await browser.close();
}
