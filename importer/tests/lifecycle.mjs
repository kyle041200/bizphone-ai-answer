import { chromium } from "../engine/node_modules/playwright/index.mjs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const exec = promisify(execFile);
const state = JSON.parse(await fs.readFile("importer/work/staging-result.json"));
const results = [];
// Disposable local staging instance only. These are test credentials, never production secrets.
async function wp(...args) {
  const { stdout } = await exec(
    "docker",
    [
      "run",
      "--rm",
      "--network",
      "kghq-staging",
      "--volumes-from",
      "kghq-wp",
      "--user",
      "33:33",
      "-e",
      "WORDPRESS_DB_HOST=kghq-db",
      "-e",
      "WORDPRESS_DB_USER=wordpress",
      "-e",
      "WORDPRESS_DB_PASSWORD=staging-local-only",
      "-e",
      "WORDPRESS_DB_NAME=wordpress",
      "wordpress:cli",
      "wp",
      ...args,
    ],
    { maxBuffer: 2 * 1024 * 1024 },
  );
  return stdout.trim();
}
async function check(name, fn) {
  await fn();
  results.push({ name, status: "passed" });
  console.log("PASS", name);
}
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 390, height: 1000 } });
async function snapshot() {
  return JSON.parse(
    await wp(
      "eval",
      `$ids=get_posts(['post_type'=>'page','post_status'=>['draft','publish'],'meta_key'=>'_kghq_source_key','fields'=>'ids','numberposts'=>-1]);sort($ids);$data=[];foreach($ids as $id){$data[$id]=hash('sha256',get_post($id)->post_content.get_post_meta($id,'_kghq_css',true));}echo wp_json_encode(['pages'=>$data,'media'=>count(get_posts(['post_type'=>'attachment','post_status'=>'inherit','fields'=>'ids','numberposts'=>-1])),'front'=>get_option('page_on_front'),'menu_locations'=>get_theme_mod('nav_menu_locations',[])]);`,
    ),
  );
}
async function visual(styling = true) {
  await page.goto(state.preview, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const css = await page
    .locator("#kghq-durable-styles-inline-css")
    .textContent()
    .catch(() => null);
  assert.equal(!!css, styling);
  assert.match(await page.locator(".kghq-import-root h1").innerText(), /Never Miss/);
  if (styling) {
    assert.equal(
      await page.locator(".kghq-import-root .wp-block-group__inner-container").count(),
      0,
    );
    assert.ok(
      await page
        .locator(".kghq-import-root img")
        .evaluateAll((images) => images.every((i) => i.complete && i.naturalWidth > 0)),
    );
  }
  return css ? crypto.createHash("sha256").update(css).digest("hex") : null;
}
try {
  await page.request.post("http://localhost:8085/wp-login.php", {
    form: {
      log: "kghq-admin",
      pwd: "local-staging-only-4829",
      "wp-submit": "Log In",
      redirect_to: "http://localhost:8085/wp-admin/",
      testcookie: "1",
    },
  });
  const before = await snapshot();
  const cssBefore = await visual();
  await check("ZIP installation is active in real WordPress", async () => {
    assert.equal(await wp("plugin", "is-active", "kghq-lovable-importer"), "");
    assert.equal(await wp("plugin", "is-active", "kghq-import-styles"), "");
  });
  await check("Classic child theme retains scoped styling and media", async () => {
    await wp(
      "scaffold",
      "child-theme",
      "kghq-classic-child",
      "--parent_theme=twentyseventeen",
      "--theme_name=KGHQ Classic QA Child",
      "--activate",
      "--force",
    );
    assert.equal(await visual(), cssBefore);
    await page.screenshot({ path: "importer/work/child-theme-mobile.png", fullPage: true });
  });
  await wp("theme", "activate", "twentyseventeen");
  await check(
    "Importer deactivation preserves pages, media, CSS, and global settings",
    async () => {
      await wp("plugin", "deactivate", "kghq-lovable-importer");
      assert.deepEqual(await snapshot(), before);
      assert.equal(await visual(), cssBefore);
    },
  );
  await check("Importer deletion preserves styled native pages and media", async () => {
    await wp("plugin", "delete", "kghq-lovable-importer");
    assert.deepEqual(await snapshot(), before);
    assert.equal(await visual(), cssBefore);
    await page.screenshot({ path: "importer/work/after-importer-deletion.png", fullPage: true });
  });
  await check("Unimported page does not load scoped import styling", async () => {
    await page.goto("http://localhost:8085/?page_id=2", { waitUntil: "networkidle" });
    assert.equal(await page.locator("#kghq-durable-styles-inline-css").count(), 0);
  });
  await check("Removing styling companion keeps native content and media", async () => {
    await wp("plugin", "deactivate", "kghq-import-styles");
    assert.deepEqual(await snapshot(), before);
    await visual(false);
  });
  await check("Reactivating independent companion restores styling without importer", async () => {
    await wp("plugin", "activate", "kghq-import-styles");
    assert.equal(await visual(), cssBefore);
  });
  // Leave staging usable for review after proving actual deletion.
  await wp(
    "plugin",
    "install",
    "/var/www/html/wp-content/kghq-lovable-importer.zip",
    "--force",
    "--activate",
  );
  await fs.writeFile(
    "importer/work/lifecycle-result.json",
    JSON.stringify(
      {
        results,
        before,
        cssHash: cssBefore,
        finalState:
          "Twenty Seventeen parent, both ZIP-installed plugins active after deletion/reinstallation test.",
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
