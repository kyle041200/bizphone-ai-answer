// Real two-step dashboard acceptance, restricted to disposable loopback staging.
import {execFile} from 'node:child_process';import{promisify}from'node:util';
import fs from 'node:fs/promises';import assert from 'node:assert/strict';import{chromium}from'../engine/node_modules/playwright/index.mjs';
const base=process.env.KGHQ_WP_URL||'http://localhost:8086';if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('Staging only');
const repository=process.env.KGHQ_TEST_REPOSITORY||'GuidoPenta/TrackZilla',routes=(process.env.KGHQ_TEST_ROUTES||'/').split(','),label=process.env.KGHQ_TEST_LABEL||'acceptance';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultNavigationTimeout(90000);let result={repository,routes,workflow:'NOT COMPLETED',imports:[],started:new Date().toISOString()};
await page.route('**/*',r=>['localhost','127.0.0.1'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort());
const snapshot=async()=>JSON.parse((await promisify(execFile)('docker',['exec','kghq-visual-wp','php','/tmp/kghq-visual-staging.php','snapshot'])).stdout);const before=await snapshot();
page.on('response',async response=>{if(response.url().includes('/kghq-importer/v1/import')){try{result.imports.push(await response.json());}catch{}}});
try{
 await page.goto(base+'/wp-login.php');await page.locator('#user_login').fill('kghq-admin');await page.locator('#user_pass').fill(process.env.KGHQ_STAGING_PASSWORD||'automation-staging-admin-only');await Promise.all([page.waitForURL('**/wp-admin/**'),page.locator('#wp-submit').click()]);
 await page.goto(base+'/wp-admin/tools.php?page=kghq-importer');assert.equal(await page.locator('#kghq-bundle').count(),0);assert.equal(await page.locator('#kghq-ref').count(),0);assert.equal(await page.locator('.kghq-card h2').count(),2);result.twoStepDashboard=true;result.manualUploadHidden=true;
 await page.locator('#kghq-repository').fill('https://github.com/'+repository);await page.locator('#kghq-scan').click();
 await page.locator('#kghq-pages input[type=checkbox]').first().waitFor({timeout:240000});await page.waitForFunction(()=>!document.getElementById('kghq-scan').disabled,null,{timeout:240000});result.detectedPages=await page.locator('#kghq-pages input').evaluateAll(es=>es.map(e=>e.value));result.defaultBranchInfo=await page.locator('#kghq-job-info').innerText();
 await page.locator('#kghq-all').click();assert.equal(await page.locator('#kghq-pages input:checked').count(),result.detectedPages.length);await page.locator('#kghq-none').click();assert.equal(await page.locator('#kghq-pages input:checked').count(),0);
 for(const route of routes)await page.locator('#kghq-pages input').filter({visible:true}).evaluateAll((es,route)=>{const e=es.find(e=>e.value===route);if(!e)throw Error('Selected route not discovered: '+route);e.click();},route);
 assert.equal(await page.locator('#kghq-pages input:checked').count(),routes.length);result.exactSelection=true;
 await page.getByText('Compatibility report and import options',{exact:true}).click();
 if(await page.locator('#kghq-interaction-warning').isVisible())await page.locator('#kghq-interactions').check();
 await page.locator('#kghq-missing-assets').check();if(process.env.KGHQ_ALLOW_MISSING_IMAGES==='1')await page.locator('#kghq-missing-images').check();
 await page.locator('#kghq-canvas').check();await page.locator('#kghq-full').check();await page.locator('#kghq-header').uncheck();await page.locator('#kghq-footer').uncheck();
 if(process.env.KGHQ_TEST_REPLACE==='1')await page.locator('#kghq-replace').check();
 await page.screenshot({path:`importer/work/${label}-selection.png`,fullPage:true});await page.locator('#kghq-import').click();
 await page.waitForFunction(()=>!document.getElementById('kghq-import').disabled,null,{timeout:25*60*1000});
 result.log=await page.locator('#kghq-log').innerText();assert.equal(result.imports.length,routes.length,result.log);const expected=process.env.KGHQ_EXPECT_STATUS||(process.env.KGHQ_TEST_REPLACE==='1'?'updated':'created');for(const r of result.imports){assert.equal(r.status,expected,result.log);assert.ok(r.id);assert.ok(r.edit);}
 result.workflow='PASS';result.workerAutomaticallyInvoked=true;result.noManualBundleOrCLI=true;await page.screenshot({path:`importer/work/${label}-result.png`,fullPage:true});
 await fs.writeFile(`importer/work/${label}-staged.json`,JSON.stringify({results:result.imports.map((r,i)=>({...r,route:routes[i],sourceRoute:routes[i]}))},null,2));
}catch(e){result.workflow='FAIL';result.error=e.message;result.log=await page.locator('#kghq-log').innerText().catch(()=>'');await page.screenshot({path:`importer/work/${label}-failure.png`,fullPage:true}).catch(()=>{});process.exitCode=1;}finally{const after=await snapshot();const approved=process.env.KGHQ_TEST_REPLACE==='1'?new Set(result.imports.map(r=>String(r.id))):new Set();result.unapprovedExistingPagesUnchanged=Object.entries(before).every(([id,hash])=>approved.has(id)||after[id]===hash);result.finished=new Date().toISOString();await fs.writeFile(`importer/work/${label}-automation.json`,JSON.stringify(result,null,2));await browser.close();}
console.log(JSON.stringify(result,null,2));
