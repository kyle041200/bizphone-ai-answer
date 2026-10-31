import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from '../engine/node_modules/playwright/index.mjs';
const base = 'http://localhost:8089';
const output = 'importer/work/php-published';
const snapshot = JSON.parse(await fs.readFile(`${output}/retention-before.json`, 'utf8'));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, locale: 'en-US', timezoneId: 'UTC', reducedMotion: 'reduce' });
await page.route('**/*', route => new URL(route.request().url()).hostname === 'localhost' ? route.continue() : route.abort());
const evidence = { source: 'Synthetic PHP fixture, not the published Lovable site', measurements: [], checks: [] };
try {
  await page.goto(`${base}/wp-login.php`);
  await page.waitForTimeout(350);
  await page.locator('#user_login').fill('kghq-admin');
  await page.locator('#user_pass').fill('automation-staging-admin-only');
  await Promise.all([page.waitForURL('**/wp-admin/**'), page.locator('#wp-submit').click()]);
  for (const record of snapshot.pages) {
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${base}/?page_id=${record.id}&preview=true`);
      await page.locator('.kghq-published').waitFor();
      await page.evaluate(async () => {
        for (const image of document.images) image.loading = 'eager';
        await document.fonts.ready;
        await Promise.race([
          Promise.all([...document.images].map(image => image.decode().catch(() => {}))),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Images did not settle within 10 seconds')), 10000))
        ]);
      });
      const measure = await page.locator('.kghq-published').evaluate(root => ({ width: root.getBoundingClientRect().width, font: getComputedStyle(root).fontFamily, headingSize: getComputedStyle(root.querySelector('h1')).fontSize }));
      evidence.measurements.push({ id: record.id, viewport: width, ...measure });
      await page.screenshot({ path: `${output}/frontend-${record.id}-${width}.png`, fullPage: true });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/wp-admin/plugins.php`);
  const row = page.locator('tr[data-plugin="kghq-lovable-importer/kghq-lovable-importer.php"]');
  if (await row.count()) {
  if (await row.getByRole('link', { name: /^Deactivate/ }).count()) await row.getByRole('link', { name: /^Deactivate/ }).click();
  page.on('dialog', dialog => dialog.accept());
  await row.getByRole('link', { name: /^Delete/ }).click();
  const confirm = page.getByText('Yes, delete these files', { exact: true });
  await confirm.waitFor({ timeout: 4000 }).catch(() => {});
  if (await confirm.isVisible()) await confirm.click();
  await page.goto(`${base}/wp-admin/plugins.php`);
  }
  await page.waitForFunction(() => !document.querySelector('tr[data-plugin="kghq-lovable-importer/kghq-lovable-importer.php"]'));
  evidence.checks.push('Importer absent from plugin listing after WordPress UI removal');
  assert.ok(await page.locator('tr[data-plugin="kghq-published-styles/kghq-published-styles.php"].active').count());
  evidence.checks.push('Independent styling companion remains active');
  await page.screenshot({ path: `${output}/importer-deleted.png`, fullPage: true });
  for (const record of snapshot.pages) {
    await page.goto(`${base}/?page_id=${record.id}&preview=true`);
    await page.locator('.kghq-published').waitFor();
    assert.ok(await page.locator('link[href*="kghq-published-styles/published.css"]').count());
    assert.ok(await page.locator('.kghq-published-canvas').count(), 'Independent canvas template missing after removal');
    const width = await page.locator('.kghq-published').evaluate(node => node.getBoundingClientRect().width);
    assert.ok(Math.abs(width - 1440) <= 1, 'Full-width layout changed after importer deletion');
    evidence.checks.push(`Page ${record.id}: front end loads independent base stylesheet after deletion`);
    await page.goto(`${base}/wp-admin/post.php?post=${record.id}&action=edit`);
    await page.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlocks().length > 0);
    const valid = await page.evaluate(() => {
      const walk = blocks => blocks.every(b => b.isValid && b.name.startsWith('core/') && walk(b.innerBlocks || []));
      return walk(wp.data.select('core/block-editor').getBlocks());
    });
    assert.ok(valid);
    evidence.checks.push(`Page ${record.id}: native blocks still valid in editor after deletion`);
  }
  await fs.writeFile(`${output}/retention-browser.json`, JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify({ passed: evidence.checks.length, screenshots: snapshot.pages.length * 3, fidelityScore: null }));
} catch (error) {
  await page.screenshot({ path: `${output}/retention-failure.png`, fullPage: true }).catch(() => {});
  throw error;
} finally { await browser.close(); }
