import fs from 'node:fs/promises';import{chromium}from'../engine/node_modules/playwright/index.mjs';
const s=JSON.parse(await fs.readFile('importer/work/after-1-staged.json','utf8'));const target=s.results.find(r=>r.sourceRoute==='/business-support');
const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:390,height:1000}});await p.goto('http://localhost:8086/wp-login.php');await p.locator('#user_login').fill('kghq-admin');await p.locator('#user_pass').fill('automation-staging-admin-only');await Promise.all([p.waitForURL('**/wp-admin/**'),p.locator('#wp-submit').click()]);
for(const [kind,url]of [['source','http://127.0.0.1:5173/business-support'],['imported',`http://localhost:8086/?page_id=${target.id}&preview=true`]]){
 await p.goto(url,{waitUntil:'networkidle'});
 console.log(kind,JSON.stringify(await p.evaluate(()=>{
  const el=[...document.querySelectorAll('p')].find(e=>e.textContent.trim()==='Executive Assistance');
  const props=['line-height','font-size','--tw-leading','--text-xs--line-height'];const nodes=[el,el?.parentElement,el?.parentElement?.parentElement];
  return nodes.filter(Boolean).map(el=>{const matched=[];const walk=rules=>{for(const r of rules){if(r instanceof CSSMediaRule&&!matchMedia(r.conditionText).matches)continue;if(r.cssRules)walk(r.cssRules);if(r.selectorText){try{if(el.matches(r.selectorText)&&props.some(p=>r.style?.getPropertyValue(p)))matched.push({selector:r.selectorText,css:r.style.cssText});}catch{}}}};for(const sheet of document.styleSheets)try{walk(sheet.cssRules);}catch{};return{tag:el.tagName,classes:el.className,inline:el.getAttribute('style'),computed:Object.fromEntries(props.map(n=>[n,getComputedStyle(el).getPropertyValue(n)])),matched};});
 }),null,2));
}
await b.close();
