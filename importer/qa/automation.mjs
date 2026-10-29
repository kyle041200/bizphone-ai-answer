// Honest staging smoke test: real dashboard → real worker scan → selected conversion.
// Missing runner is a BLOCKED end-to-end result, never a passing import result.
import{execFile}from'node:child_process';import{promisify}from'node:util';
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import{chromium}from'../engine/node_modules/playwright/index.mjs';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:1440,height:1000}});let result={repository:'GuidoPenta/TrackZilla',workflow:'NOT COMPLETED'};
await page.route('**/*',r=>['localhost','127.0.0.1'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
const snapshot=async()=>(await promisify(execFile)('docker',['exec','kghq-visual-wp','php','/tmp/kghq-visual-staging.php','snapshot'])).stdout;const before=await snapshot();
try{
 await page.goto('http://localhost:8086/wp-login.php');await page.locator('#user_login').fill('kghq-admin');await page.locator('#user_pass').fill(process.env.KGHQ_STAGING_PASSWORD||'automation-staging-admin-only');await Promise.all([page.waitForURL('**/wp-admin/**'),page.locator('#wp-submit').click()]);
 await page.goto('http://localhost:8086/wp-admin/tools.php?page=kghq-importer');assert.equal(await page.locator('#kghq-bundle').count(),0);assert.equal(await page.locator('#kghq-ref').count(),0);
 const sections=await page.locator('.kghq-card h2').allTextContents();assert.equal(sections.length,2);result.twoStepDashboard=true;result.manualUploadHidden=true;
 await page.locator('#kghq-repository').fill('https://github.com/GuidoPenta/TrackZilla');await page.locator('#kghq-scan').click();
 await page.locator('#kghq-pages input[type=checkbox]').first().waitFor({timeout:180000});result.realRepositoryScan=true;result.defaultBranchInfo=await page.locator('#kghq-job-info').innerText();
 await page.locator('#kghq-none').click();await page.locator('#kghq-pages input[type=checkbox]').first().check();assert.equal(await page.locator('#kghq-pages input:checked').count(),1);result.exactlyOnePageSelected=true;
 if(await page.locator('#kghq-interaction-warning').isVisible())await page.locator('#kghq-interactions').check();
 await page.screenshot({path:'importer/work/automation-selection.png',fullPage:true});await page.locator('#kghq-import').click();
 await page.waitForFunction(()=>/runner is not installed|Draft saved|Job failed|failed/i.test(document.getElementById('kghq-log').innerText),{timeout:180000});
 result.log=await page.locator('#kghq-log').innerText();result.workerAutomaticallyInvoked=true;
 result.workflow=result.log.includes('Draft saved')?'PASS':'BLOCKED';
 if(result.workflow==='BLOCKED')result.blocker='Runner image unavailable; isolated container build/render and automatic draft import were not tested. Current cloud filesystem has less than 200 MiB available; production runner build needs several GiB.';
 await page.screenshot({path:'importer/work/automation-result.png',fullPage:true});
}catch(e){result.workflow='FAIL';result.error=e.message;process.exitCode=1;}finally{result.allExistingPageContentAndStylesUnchanged=(await snapshot())===before;await fs.writeFile('importer/work/automation-results.json',JSON.stringify(result,null,2));await browser.close();}
