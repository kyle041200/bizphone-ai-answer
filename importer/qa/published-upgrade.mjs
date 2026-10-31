import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from '../engine/node_modules/playwright/index.mjs';
const base = 'http://localhost:8089';
const output = 'importer/work/php-published';
const snapshot = JSON.parse(await fs.readFile(`${output}/retention-after.json`, 'utf8'));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
await page.route('**/*', route => new URL(route.request().url()).hostname === 'localhost' ? route.continue() : route.abort());
const editorOnly = process.env.KGHQ_EDITOR_ONLY === '1';
const result = editorOnly ? JSON.parse(await fs.readFile(`${output}/upgrade-failure.json`, 'utf8')) : { checks: [], measurements: [] };
delete result.error;
try {
  await page.goto(`${base}/wp-login.php`);
  await page.waitForTimeout(350); // WordPress schedules a delayed initial username focus.
  await page.locator('#user_login').fill('kghq-admin');
  await page.locator('#user_pass').fill('automation-staging-admin-only');
  assert.equal(await page.locator('#user_login').inputValue(), 'kghq-admin');
  assert.equal(await page.locator('#user_pass').inputValue(), 'automation-staging-admin-only');
  await Promise.all([page.waitForURL('**/wp-admin/**'), page.locator('#wp-submit').click()]);
  if (!editorOnly) {
  for (const name of ['kghq-lovable-importer', 'kghq-published-styles']) {
    await page.goto(`${base}/wp-admin/plugin-install.php?tab=upload`);
    await page.locator('#pluginzip').setInputFiles(`kghq-downloads/php-published-preview/${name}-0.6.0-alpha1.zip`);
    await page.locator('#install-plugin-submit').click();
    await page.waitForFunction(() => document.body?.textContent?.includes('Activate Plugin') || document.body?.textContent?.includes('Replace current with uploaded'));
    const replace = page.getByRole('link', { name: 'Replace current with uploaded', exact: true });
    if (await replace.count()) await replace.click();
    const activate = page.getByRole('link', { name: 'Activate Plugin', exact: true });
    if (await activate.count()) await activate.click();
    result.checks.push(`${name}: current ZIP installed through UI`);
  }
  await page.goto(`${base}/wp-admin/options-general.php?page=kghq-published`);
  await page.locator('#kghq-site').fill('https://93.184.216.34/unconfigured');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.getByRole('button', { name: 'Save settings only', exact: true }).click()
  ]);
  await page.locator('#kghq-site').fill('https://93.184.216.34/');
  assert.equal(await page.locator('#kghq-site').inputValue(), 'https://93.184.216.34/');
  await page.locator('#kghq-start').click();
  await page.waitForFunction(() => !document.querySelector('#kghq-start')?.disabled && document.querySelector('#kghq-status')?.textContent.includes('Crawl finished'), { timeout: 90000 });
  assert.equal((await page.locator('#kghq-results').innerText()).match(/Existing page preserved/g)?.length, 2);
  result.checks.push('Modular controller loads its admin script and preserves both edited drafts');
  await page.reload();
  assert.equal(await page.locator('#kghq-site').inputValue(), 'https://93.184.216.34/');
  result.checks.push('Import saves the newly typed URL automatically without a separate Save action');
  const csrf = await page.request.post(`${base}/wp-admin/admin-ajax.php`, { form: { action: 'kghq_published', operation: 'start' } });
  assert.equal(csrf.status(), 403);
  result.checks.push('AJAX import without nonce rejected with HTTP 403');
  for (const record of snapshot.pages) {
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${base}/?page_id=${record.id}&preview=true`);
      const root = page.locator('.kghq-published');
      await root.waitFor();
      const measurement = await root.evaluate(node => ({ rootWidth: node.getBoundingClientRect().width, viewport: innerWidth, fontFamily: getComputedStyle(node).fontFamily }));
      assert.ok(Math.abs(measurement.rootWidth - width) <= 1, `Canvas still constrained: ${JSON.stringify(measurement)}`);
      result.measurements.push({ id: record.id, kind: 'front-end', ...measurement });
      await page.screenshot({ path: `${output}/canvas-${record.id}-${width}.png`, fullPage: true });
    }
  }
  result.checks.push('Both synthetic pages use full available canvas width at all three viewports');
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/wp-admin/post.php?post=${snapshot.pages[0].id}&action=edit`);
  await page.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlocks().length > 0);
  await page.waitForTimeout(600);
  let frame;
  for (let attempt = 0; attempt < 100 && !frame; attempt++) {
    for (const candidate of page.frames()) {
      if (await candidate.locator('.kghq-published').count()) { frame = candidate; break; }
    }
    if (!frame) await page.waitForTimeout(100);
  }
  assert.ok(frame, 'Imported root class is missing from all editor frames');
  const editorRoot = frame.locator('.kghq-published');
  await editorRoot.waitFor();
  const editor = await editorRoot.evaluate(node => ({ rootWidth: node.getBoundingClientRect().width, viewport: innerWidth, fontFamily: getComputedStyle(node).fontFamily }));
  result.editorAncestors = await editorRoot.evaluate(node => {
    const parents = [];
    while (node && parents.length < 10) {
      const style = getComputedStyle(node);
      parents.push({ tag: node.tagName, class: node.className, width: node.getBoundingClientRect().width, maxWidth: style.maxWidth, padding: style.padding, margin: style.margin });
      node = node.parentElement;
    }
    return parents;
  });
  assert.ok(await frame.locator('link[href*="published.css"]').count(), 'Shared editor stylesheet is missing');
  assert.ok(Math.abs(editor.rootWidth - editor.viewport) <= 2, `Editor width constrained: ${JSON.stringify(editor)}`);
  result.measurements.push({ kind: 'editor', ...editor });
  result.checks.push('Shared stylesheet loads in editor and root uses available iframe width');
  await page.screenshot({ path: `${output}/canvas-editor.png`, fullPage: true });
  await fs.writeFile(`${output}/upgrade.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ passed: result.checks.length, fontParity: result.measurements[0].fontFamily === editor.fontFamily }));
} catch (error) {
  await fs.writeFile(`${output}/upgrade-failure.json`, JSON.stringify({ ...result, error: String(error) }, null, 2));
  await page.screenshot({ path: `${output}/upgrade-failure.png`, fullPage: true }).catch(() => {});
  throw error;
} finally { await browser.close(); }
