// Disposable staging only. Install the actual ZIPs through WordPress UI.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from '../engine/node_modules/playwright/index.mjs';
const base=process.env.KGHQ_WP_URL||'http://localhost:8086';
if(!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('Staging only');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),results=[];
try{
 await page.goto(base+'/wp-login.php');await page.locator('#user_login').fill('kghq-admin');await page.locator('#user_pass').fill(process.env.KGHQ_STAGING_PASSWORD||'automation-staging-admin-only');await Promise.all([page.waitForURL('**/wp-admin/**',{waitUntil:'domcontentloaded',timeout:90000}),page.locator('#wp-submit').click()]);
 for(const slug of (process.env.KGHQ_INSTALL_PLUGIN_SLUGS||'kghq-import-styles,kghq-lovable-importer').split(',')){
  const version=slug==='kghq-import-styles'?(process.env.KGHQ_STYLES_VERSION||'0.5.0-rc2'):'0.5.0-rc1';
  await page.goto(base+'/wp-admin/plugin-install.php?tab=upload');await page.locator('#pluginzip').setInputFiles(`importer/dist/${slug}-${version}.zip`);await page.locator('#install-plugin-submit').click();
  await page.getByRole('link',{name:'Activate Plugin',exact:true}).or(page.getByRole('link',{name:'Replace current with uploaded',exact:true})).waitFor({timeout:120000});
  const replace=page.getByRole('link',{name:'Replace current with uploaded',exact:true});if(await replace.count())await replace.click();await page.screenshot({path:`importer/work/install-${slug}.png`,fullPage:true});const activate=page.getByRole('link',{name:'Activate Plugin',exact:true});if(await activate.count())await activate.click();results.push({plugin:slug,status:'PASS',version});
 }
 await page.goto(base+'/wp-admin/tools.php?page=kghq-importer');assert.equal(await page.locator('#kghq-scan').count(),1);await page.screenshot({path:'importer/work/install-dashboard.png',fullPage:true});
}catch(e){results.push({status:'FAIL',error:e.message});process.exitCode=1;}finally{await fs.writeFile('importer/work/install-results.json',JSON.stringify(results,null,2));await browser.close();}
