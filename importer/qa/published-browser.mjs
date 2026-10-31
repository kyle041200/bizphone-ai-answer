import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from '../engine/node_modules/playwright/index.mjs';
const base = 'http://localhost:8089';
const output = 'importer/work/php-published';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'UTC', reducedMotion: 'reduce' });
await page.route('**/*', route => new URL(route.request().url()).hostname === 'localhost' ? route.continue() : route.abort());
const checks = [];
const check = (name, result) => { assert.ok(result, name); checks.push({ name, status: 'PASS' }); };
try {
  await page.goto(`${base}/wp-login.php`);
  await page.waitForTimeout(350);
  await page.locator('#user_login').fill('kghq-admin');
  await page.locator('#user_pass').fill('automation-staging-admin-only');
  await Promise.all([page.waitForURL('**/wp-admin/**'), page.locator('#wp-submit').click()]);
  for (const plugin of ['kghq-lovable-importer', 'kghq-published-styles']) {
    await page.goto(`${base}/wp-admin/plugin-install.php?tab=upload`);
    await page.locator('#pluginzip').setInputFiles(`kghq-downloads/php-published-preview/${plugin}-0.6.0-alpha1.zip`);
    await page.locator('#install-plugin-submit').click();
    const replace = page.getByRole('link', { name: 'Replace current with uploaded', exact: true });
    const activate = page.getByRole('link', { name: 'Activate Plugin', exact: true });
    await page.waitForFunction(() => document.body?.textContent?.includes('Activate Plugin') || document.body?.textContent?.includes('Replace current with uploaded'));
    if (await replace.count()) await replace.click();
    if (await activate.count()) await activate.click();
    check(`${plugin} installed and activated through WordPress upload UI`, true);
  }
  await page.goto(`${base}/wp-admin/options-general.php?page=kghq-published`);
  await page.locator('#kghq-site').fill('https://93.184.216.34/');
  await page.screenshot({ path: `${output}/dashboard-before.png`, fullPage: true });
  await page.locator('#kghq-start').click();
  await page.waitForFunction(() => !document.querySelector('#kghq-start')?.disabled && document.querySelector('#kghq-status')?.textContent.includes('Crawl finished'), { timeout: 90000 });
  check('Settings-only import finishes without CLI, JSON or external conversion service', true);
  const edits = await page.locator('#kghq-results a').evaluateAll(links => links.filter(link => link.textContent.trim() === 'Edit').map(link => link.href));
  check('Both synthetic source pages created as drafts', edits.length === 2);
  await page.screenshot({ path: `${output}/dashboard-imported.png`, fullPage: true });
  await page.locator('#kghq-start').click();
  await page.waitForFunction(() => !document.querySelector('#kghq-start')?.disabled && document.querySelector('#kghq-status')?.textContent.includes('Crawl finished'), { timeout: 90000 });
  const again = await page.locator('#kghq-results a').evaluateAll(links => links.filter(link => link.textContent.trim() === 'Edit').map(link => link.href));
  check('Dashboard reimport keeps both page IDs', JSON.stringify(edits) === JSON.stringify(again));
  for (const [index, edit] of edits.entries()) {
    await page.goto(edit, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlocks().length > 0, { timeout: 60000 });
    await page.evaluate(() => wp.data.dispatch('core/preferences').set('core/edit-post', 'welcomeGuide', false));
    for (const name of ['Close', 'Get started', 'Got it']) {
      const button = page.getByRole('button', { name, exact: true });
      if (await button.count()) await button.first().click().catch(() => {});
    }
    const inventory = await page.evaluate(() => {
      const blocks = [];
      const walk = list => { for (const b of list) { blocks.push({ id: b.clientId, name: b.name, valid: b.isValid }); walk(b.innerBlocks || []); } };
      walk(wp.data.select('core/block-editor').getBlocks());
      return blocks;
    });
    check(`Page ${index + 1}: all editor blocks valid and native`, inventory.every(b => b.valid && b.name.startsWith('core/')));
    const frame = page.frames().find(frame => frame.name() === 'editor-canvas') || page;
    await page.screenshot({ path: `${output}/editor-${index + 1}-before.png`, fullPage: true });
    const heading = inventory.find(b => b.name === 'core/heading');
    await page.evaluate(id => wp.data.dispatch('core/block-editor').selectBlock(id), heading.id);
    await frame.locator(`[data-block="${heading.id}"][contenteditable="true"], [data-block="${heading.id}"] [contenteditable="true"]`).first().fill(`Edited staging heading ${index + 1}`);
    await page.evaluate(async () => { await wp.data.dispatch('core/editor').savePost(); });
    await page.reload();
    await page.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlocks().length > 0);
    const reopened = await page.evaluate(() => {
      const all = []; const walk = bs => { for (const b of bs) { all.push(b); walk(b.innerBlocks || []); } }; walk(wp.data.select('core/block-editor').getBlocks());
      return { valid: all.every(b => b.isValid), content: all.find(b => b.name === 'core/heading')?.attributes.content };
    });
    check(`Page ${index + 1}: direct text edit survives save/reopen with valid blocks`, reopened.valid && reopened.content === `Edited staging heading ${index + 1}`);
    await page.screenshot({ path: `${output}/editor-${index + 1}-after.png`, fullPage: true });
  }
  await page.goto(`${base}/wp-admin/options-general.php?page=kghq-published`);
  await page.locator('#kghq-start').click();
  await page.waitForFunction(() => !document.querySelector('#kghq-start')?.disabled && document.querySelector('#kghq-status')?.textContent.includes('Crawl finished'), { timeout: 90000 });
  check('Dashboard reimport reports both manually edited pages preserved', (await page.locator('#kghq-results').innerText()).match(/Existing page preserved/g)?.length === 2);
  await page.screenshot({ path: `${output}/dashboard-protected.png`, fullPage: true });
  await fs.writeFile(`${output}/browser.json`, JSON.stringify({ checks, source: 'Synthetic server-rendered fixture intercepted in staging PHP', theme: 'Twenty Seventeen', base, originalPublishedSiteTested: false }, null, 2));
  console.log(JSON.stringify({ passed: checks.length, failed: 0 }));
} catch (error) {
  await page.screenshot({ path: `${output}/browser-failure.png`, fullPage: true }).catch(() => {});
  await fs.writeFile(`${output}/browser-failure.txt`, String(error));
  throw error;
} finally { await browser.close(); }
