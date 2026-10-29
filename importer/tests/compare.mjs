import { chromium } from "../engine/node_modules/playwright/index.mjs";
import fs from "node:fs/promises";
const state = JSON.parse(await fs.readFile("importer/work/staging-result.json"));
const target = process.argv.includes("--bizsite")
  ? { slug: "bizsite", preview: state.bizsite.preview, prefix: "bizsite-" }
  : { slug: "bizphone", preview: state.preview, prefix: "" };
const b = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.request.post("http://localhost:8085/wp-login.php", {
  form: {
    log: "kghq-admin",
    pwd: "local-staging-only-4829",
    "wp-submit": "Log In",
    redirect_to: "http://localhost:8085/wp-admin/",
    testcookie: "1",
  },
});
const report = {};
for (const [label, url] of [
  ["source", "http://localhost:5173/" + target.slug],
  ["imported", target.preview],
]) {
  report[label] = [];
  await p.goto(url, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 768, 390]) {
    await p.setViewportSize({ width, height: 1000 });
    await p.screenshot({ path: `importer/work/${target.prefix}${label}-${width}-top.png` });
    await p.screenshot({
      path: `importer/work/${target.prefix}${label}-${width}.png`,
      fullPage: true,
    });
    report[label].push(
      await p.evaluate(() => ({
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
        fonts: [...document.fonts].map((f) => ({ family: f.family, status: f.status })),
        elements: [...document.querySelectorAll("h1,p,a")]
          .filter(
            (e) =>
              e.textContent.includes("It answers") ||
              e.tagName === "H1" ||
              e.textContent.trim() === "Get BizPhone",
          )
          .slice(-5)
          .map((e) => {
            const s = getComputedStyle(e);
            return {
              tag: e.tagName,
              text: e.textContent.trim().slice(0, 80),
              font: s.fontFamily,
              fontSize: s.fontSize,
              background: s.background,
              lineHeight: s.lineHeight,
              box: {
                x: e.getBoundingClientRect().x,
                y: e.getBoundingClientRect().y,
                width: e.getBoundingClientRect().width,
                height: e.getBoundingClientRect().height,
              },
            };
          }),
      })),
    );
  }
}
await fs.writeFile(
  "importer/work/" + target.prefix + "visual-metrics.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
await b.close();
