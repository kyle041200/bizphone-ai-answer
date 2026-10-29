import { chromium } from "../engine/node_modules/playwright/index.mjs";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
try {
  await page.goto("http://localhost:8085/wp-login.php");
  await page.locator("#user_login").fill("kghq-admin");
  await page.locator("#user_pass").fill("local-staging-only-4829");
  await Promise.all([page.waitForURL("**/wp-admin/**"), page.locator("#wp-submit").click()]);
  await page.goto("http://localhost:8085/wp-admin/tools.php?page=kghq-importer");
  await page.locator("#kghq-bundle").setInputFiles("importer/work/export/bundle.json");
  await page.waitForFunction(
    () =>
      document.querySelectorAll("#kghq-pages input").length === 2 &&
      !document.querySelector("#kghq-import").disabled,
  );
  await page.locator("#kghq-none").click();
  assert.equal(await page.locator("#kghq-pages input:checked").count(), 0);
  await page.locator("#kghq-all").click();
  assert.equal(await page.locator("#kghq-pages input:checked").count(), 2);
  await page.locator('#kghq-pages input[value="/bizsite"]').uncheck();
  assert.equal(await page.locator("#kghq-replace").isChecked(), false);
  await page.locator("#kghq-import").click();
  await page.waitForFunction(() =>
    document.querySelector("#kghq-log").textContent.includes("Import batch finished."),
  );
  const log = await page.locator("#kghq-log").innerText();
  assert.match(log, /\/bizphone: preserved/);
  assert.doesNotMatch(log, /\/bizsite:/);
  assert.equal(await page.locator("#kghq-progress").getAttribute("value"), "100");
  assert.equal(await page.getByRole("link", { name: "Preview", exact: true }).count(), 1);
  await page.screenshot({ path: "importer/work/admin-dashboard.png", fullPage: true });
  await fs.writeFile(
    "importer/work/dashboard-result.json",
    JSON.stringify(
      {
        status: "passed",
        checks: [
          "Real bundle file input and FormData upload",
          "Two detected converted pages displayed",
          "Deselect all and select all",
          "Only checked route submitted",
          "Default reimport preserves existing page",
          "Progress reaches 100 and preview/edit links appear",
        ],
      },
      null,
      2,
    ),
  );
  console.log(
    "PASS Real dashboard upload, select/deselect, selected-page import, preservation, progress, and preview links",
  );
} finally {
  await browser.close();
}
