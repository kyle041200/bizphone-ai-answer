import { chromium } from "../engine/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const root = new URL("../work/", import.meta.url);
const state = JSON.parse(await fs.readFile(new URL("staging-result.json", root)));
const bundle = JSON.parse(await fs.readFile(new URL("export/bundle.json", root)));
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
  await page.goto("http://localhost:8085/wp-login.php");
  await page.locator("#user_login").fill("kghq-admin");
  await page.locator("#user_pass").fill("local-staging-only-4829");
  await Promise.all([page.waitForURL("**/wp-admin/**"), page.locator("#wp-submit").click()]);
  await page.goto("http://localhost:8085/wp-admin/tools.php?page=kghq-importer");
  const nonce = await page.evaluate(() => KGHQ_IMPORT.nonce);
  const api = async (route, data, method = "POST") =>
    page.request.fetch("http://localhost:8085/?rest_route=" + route, {
      method,
      headers: { "X-WP-Nonce": nonce },
      ...(data ? { data } : {}),
    });
  const stage = async (b) =>
    page.request.post("http://localhost:8085/?rest_route=/kghq-importer/v1/stage", {
      headers: { "X-WP-Nonce": nonce },
      multipart: {
        bundle: {
          name: "bundle.json",
          mimeType: "application/json",
          buffer: Buffer.from(JSON.stringify(b)),
        },
      },
    });
  await check("Invalid nonce is rejected", async () => {
    const r = await page.request.post(
      "http://localhost:8085/?rest_route=/kghq-importer/v1/import",
      { headers: { "X-WP-Nonce": "invalid" }, data: {} },
    );
    assert.equal(r.status(), 403);
  });
  await check("Tampered asset fails integrity before writes", async () => {
    const b = structuredClone(bundle);
    b.assets[0].data = "bWFsaWNpb3Vz";
    const r = await stage(b);
    assert.equal(r.status(), 400);
    assert.match((await r.json()).message, /integrity/);
  });
  await check("Custom HTML block and unsafe script rejected", async () => {
    const b = structuredClone(bundle);
    b.pages[0].content += "<script>alert(1)</script>";
    assert.equal((await stage(b)).status(), 400);
    const c = structuredClone(bundle);
    c.pages[0].content += "<!-- wp:html --><p>injected</p><!-- /wp:html -->";
    assert.equal((await stage(c)).status(), 400);
  });
  await check("External stylesheet URL rejected", async () => {
    const b = structuredClone(bundle);
    b.pages[0].css += " .x{background:url(https://evil.example/track)}";
    assert.equal((await stage(b)).status(), 400);
  });
  await check("Malformed JSON field types rejected cleanly", async () => {
    for (const [field, value] of [
      ["pages", "wrong"],
      ["repository", []],
      ["sourceCommit", []],
    ]) {
      const b = structuredClone(bundle);
      b[field] = value;
      const r = await stage(b);
      assert.equal(r.status(), 400);
    }
  });
  let job;
  await check("Revised bundle validates", async () => {
    const r = await stage(bundle);
    const b = await r.json();
    assert.equal(r.status(), 200, JSON.stringify(b));
    job = b.job;
  });
  let before;
  await check("Existing user edit is preserved without replacement approval", async () => {
    let r = await page.request.get(
      "http://localhost:8085/?rest_route=/wp/v2/pages/" + state.id + "&context=edit",
      { headers: { "X-WP-Nonce": nonce } },
    );
    before = (await r.json()).content.raw;
    const edited =
      before + "\n<!-- wp:paragraph --><p>User edit to preserve.</p><!-- /wp:paragraph -->";
    r = await api("/wp/v2/pages/" + state.id, { content: edited });
    assert.equal(r.status(), 200);
    r = await api("/kghq-importer/v1/import", { job, route: "/bizphone", replace: false });
    assert.equal((await r.json()).status, "preserved");
    r = await api("/wp/v2/pages/" + state.id + "?context=edit", null, "GET"); // rest_route must not absorb query: request below is canonical
    const p = await page.request.get(
      "http://localhost:8085/?rest_route=/wp/v2/pages/" + state.id + "&context=edit",
      { headers: { "X-WP-Nonce": nonce } },
    );
    assert.match((await p.json()).content.raw, /User edit to preserve/);
  });
  await check("Explicit replacement updates same page and keeps draft", async () => {
    const r = await api("/kghq-importer/v1/import", {
      job,
      route: "/bizphone",
      replace: true,
      settings: { canvas: true, full: true, header: false, footer: false, width: 1200 },
    });
    const b = await r.json();
    assert.equal(r.status(), 200, JSON.stringify(b));
    assert.equal(b.id, state.id);
    assert.equal(b.status, "updated");
    state.preview = b.preview;
    const p = await page.request.get(
      "http://localhost:8085/?rest_route=/wp/v2/pages/" + state.id + "&context=edit",
      { headers: { "X-WP-Nonce": nonce } },
    );
    const post = await p.json();
    assert.equal(post.status, "draft");
    assert.doesNotMatch(post.content.raw, /User edit to preserve/);
    await fs.writeFile(new URL("saved-content.html", root), post.content.raw);
  });
  await check("Unrelated page with colliding slug remains unchanged", async () => {
    const r = await api("/wp/v2/pages", {
      title: "Unrelated content to preserve",
      slug: "kghq-bizsite",
      status: "draft",
      content: "<!-- wp:paragraph --><p>Keep this original page.</p><!-- /wp:paragraph -->",
    });
    const unrelated = await r.json();
    assert.equal(r.status(), 201);
    const imported = await api("/kghq-importer/v1/import", {
      job,
      route: "/bizsite",
      replace: true,
      settings: { canvas: true, full: true, header: false, footer: false, width: 1200 },
    });
    const body = await imported.json();
    assert.equal(imported.status(), 200, JSON.stringify(body));
    assert.notEqual(body.id, unrelated.id);
    const original = await page.request.get(
      "http://localhost:8085/?rest_route=/wp/v2/pages/" + unrelated.id + "&context=edit",
      { headers: { "X-WP-Nonce": nonce } },
    );
    assert.match((await original.json()).content.raw, /Keep this original page/);
    state.bizsite = body;
  });
  await page.goto(state.preview);
  await check("Native FAQ Details toggles remain functional", async () => {
    const detail = page.locator("details.wp-block-details").first();
    assert.ok(await detail.count());
    assert.equal(await detail.getAttribute("open"), null);
    await detail.locator("summary").click();
    assert.notEqual(await detail.getAttribute("open"), null);
    await detail.locator("summary").click();
  });
  await page.evaluate(() => document.fonts.ready);
  state.screenshots = [];
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.screenshot({
      path: new URL(`imported-${width}.png`, root).pathname,
      fullPage: true,
    });
    await page.screenshot({ path: new URL(`imported-${width}-top.png`, root).pathname });
    const metrics = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      images: [...document.querySelectorAll(".kghq-import-root img")].map((i) => ({
        loaded: i.complete && i.naturalWidth > 0,
        src: i.src,
      })),
      font: getComputedStyle(document.querySelector("h1")).fontFamily,
    }));
    assert.ok(metrics.images.every((i) => i.loaded));
    assert.equal(metrics.scrollWidth, metrics.width, "Horizontal overflow");
    state.screenshots.push(metrics);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(state.edit);
  await page.waitForTimeout(5000);
  await page.evaluate(() =>
    wp.data.dispatch("core/preferences").set("core/edit-post", "welcomeGuide", false),
  );
  await check("WordPress editor reports no invalid blocks", async () => {
    const invalid = await page.evaluate(() => {
      const blocks = wp.data.select("core/block-editor").getBlocks();
      const out = [];
      function walk(b) {
        if (b.isValid === false) out.push(b.name);
        b.innerBlocks.forEach(walk);
      }
      blocks.forEach(walk);
      return { invalid: out, count: blocks.length };
    });
    assert.ok(invalid.count > 0);
    assert.deepEqual(invalid.invalid, []);
    assert.equal(await page.getByText("Attempt recovery", { exact: true }).count(), 0);
  });
  await check("Heading, image, and spacing attributes are independently editable", async () => {
    const report = await page.evaluate(() => {
      const store = wp.data.select("core/block-editor");
      const flat = [];
      function walk(b) {
        flat.push(b);
        b.innerBlocks.forEach(walk);
      }
      store.getBlocks().forEach(walk);
      const heading = flat.find((b) => b.name === "core/heading");
      const image = flat.find((b) => b.name === "core/image");
      const group = flat.find((b) => b.name === "core/group");
      const old = heading.attributes.content;
      wp.data
        .dispatch("core/block-editor")
        .updateBlockAttributes(heading.clientId, { content: "Native edit verification" });
      const editable =
        store.getBlock(heading.clientId).attributes.content === "Native edit verification";
      wp.data
        .dispatch("core/block-editor")
        .updateBlockAttributes(heading.clientId, { content: old });
      return {
        editable,
        image: !!image,
        spacing: !!wp.blocks.getBlockType(group.name).supports.spacing,
      };
    });
    assert.deepEqual(report, { editable: true, image: true, spacing: true });
  });
  await page.screenshot({ path: new URL("block-editor.png", root).pathname, fullPage: true });
  state.extended = results;
  await fs.writeFile(new URL("staging-result.json", root), JSON.stringify(state, null, 2));
} finally {
  await browser.close();
}
