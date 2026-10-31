import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { chromium } from '../engine/node_modules/playwright/index.mjs';
const output = 'importer/work/php-published';
const base = 'http://localhost:8089';
const current = await fs.readFile('importer/php/wordpress/kghq-lovable-importer/published.css', 'utf8');
const baseline = current.split('/* Only the imported canvas')[0];
assert.notEqual(current, baseline, 'Missing width-fix boundary in shared stylesheet');
const hash = value => createHash('sha256').update(value).digest('hex');
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
let useBaseline = true;
await page.route('**/*', async route => {
  const url = new URL(route.request().url());
  if (url.hostname !== 'localhost') return route.abort();
  if (url.pathname.endsWith('/published.css')) return route.fulfill({ contentType: 'text/css', body: useBaseline ? baseline : current });
  return route.continue();
});
try {
  await page.goto(`${base}/wp-login.php`);
  await page.waitForTimeout(350);
  await page.locator('#user_login').fill('kghq-admin');
  await page.locator('#user_pass').fill('automation-staging-admin-only');
  await Promise.all([page.waitForURL('**/wp-admin/**'), page.locator('#wp-submit').click()]);
  const snapshot = JSON.parse(await fs.readFile(`${output}/retention-before.json`, 'utf8'));
  const measurements = [];
  for (const stage of ['before', 'after']) {
    useBaseline = stage === 'before';
    await page.goto(`${base}/wp-admin/post.php?post=${snapshot.pages[0].id}&action=edit`);
    await page.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlocks().length > 0);
    let frame;
    for (let attempt = 0; attempt < 100 && !frame; attempt++) {
      for (const item of page.frames()) if (await item.locator('.kghq-published').count()) { frame = item; break; }
      if (!frame) await page.waitForTimeout(100);
    }
    assert.ok(frame);
    const root = frame.locator('.kghq-published');
    await root.waitFor();
    const measurement = await root.evaluate(node => ({ rootWidth: node.getBoundingClientRect().width, viewport: innerWidth, fontFamily: getComputedStyle(node).fontFamily }));
    measurements.push({ stage, ...measurement });
    await page.screenshot({ path: `${output}/width-editor-${stage}.png`, fullPage: true });
  }
  assert.ok(measurements[0].rootWidth < measurements[0].viewport - 100);
  assert.ok(Math.abs(measurements[1].rootWidth - measurements[1].viewport) <= 2);
  await fs.writeFile(`${output}/width-editor-baseline.json`, JSON.stringify({ method: 'Controlled same-page browser stylesheet comparison: baseline is the shared stylesheet prefix before the canvas/editor width rules. No content edits or theme CSS patches.', baselineCssSha256: hash(baseline), currentCssSha256: hash(current), measurements }, null, 2));
  console.log(JSON.stringify({ passed: true, measurements }));
} finally { await browser.close(); }
