import fs from 'node:fs/promises';
import path from 'node:path';
import {chromium} from '../engine/node_modules/playwright/index.mjs';
const wpBase=process.env.KGHQ_WP_URL||'http://localhost:8086';
const label=process.argv[2]||'baseline',sourceBase=process.env.KGHQ_SOURCE_URL||'http://127.0.0.1:5173';
const staged=JSON.parse(await fs.readFile('importer/work/'+label+'-staged.json','utf8'));
const out=path.resolve('importer/work/visual/'+label);await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.KGHQ_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox','--disable-lcd-text']});
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,locale:'en-US',timezoneId:'UTC',colorScheme:'light',reducedMotion:'reduce'});
await context.route('**/*',r=>['localhost','127.0.0.1'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort('blockedbyclient'));
const page=await context.newPage();
await page.goto(wpBase+'/wp-login.php');await page.locator('#user_login').fill(process.env.KGHQ_WP_USER||'kghq-admin');await page.locator('#user_pass').fill(process.env.KGHQ_STAGING_PASSWORD||'automation-staging-admin-only');
await Promise.all([page.waitForURL('**/wp-admin/**'),page.locator('#wp-submit').click()]);
const report={label,sourceBase,conditions:{browser:await browser.version(),viewportHeight:1000,deviceScaleFactor:1,locale:'en-US',timezoneId:'UTC',colorScheme:'light',reducedMotion:'reduce',animations:'disabled',screenshots:'unmasked, no resizing, full-page + native section crops'},pages:[]};
try{
for(const result of staged.results){
 const route=result.sourceRoute || result.route.replace(/^\/visual-baseline/,'').replace(/^\/home$/,'/')||'/';
 const slug=route==='/'?'home':route.slice(1).replaceAll('/','--');
 const item={route,id:result.id,widths:[]};
 for(const width of [1440,768,390]){
  const record={width};
  for(const [kind,url]of [['source',new URL(route,sourceBase).href],['imported',`${wpBase}/?page_id=${result.id}&preview=true`]]){
   await page.setViewportSize({width,height:1000});await page.goto(url,{waitUntil:'networkidle',timeout:60000});await page.evaluate(()=>document.fonts.ready);
   await page.addStyleTag({content:'html{scroll-behavior:auto!important}*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}#wpadminbar{display:none!important}html{margin-top:0!important}'});
   await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=800){scrollTo(0,y);await new Promise(r=>setTimeout(r,10));}scrollTo(0,0);});
   // Full-page captures must wait for lazy image decoding after scroll. Browser
   // screenshots do not wait for WordPress loading=lazy automatically.
   await page.evaluate(async()=>{await Promise.all([...document.images].map(async image=>{image.loading='eager';await Promise.race([image.decode().catch(()=>{}),new Promise(r=>setTimeout(r,10000))]);}));});
   await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const data=await page.evaluate((kind)=>{
    const root=kind==='imported'?document.querySelector('.kghq-import-root'):document.body;
    const props=['display','position','flex-direction','flex-wrap','justify-content','align-items','grid-template-columns','gap','width','max-width','height','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left','font-family','font-size','font-weight','line-height','letter-spacing','text-align','color','background-color','background-image','border-radius','box-shadow','object-fit','object-position'];
    const rect=el=>{const b=el.getBoundingClientRect();return{x:b.x,y:b.y+scrollY,width:b.width,height:b.height};};
    const styles=el=>{const c=getComputedStyle(el);return Object.fromEntries(props.map(p=>[p,c.getPropertyValue(p)]));};
    const sections=[...root.querySelectorAll('section')].filter(e=>!e.parentElement.closest('section'));
    if(!sections.length)sections.push(root);
    return{height:document.documentElement.scrollHeight,scrollWidth:document.documentElement.scrollWidth,root:rect(root),fonts:[...document.fonts].map(f=>({family:f.family,status:f.status})),missingImages:[...root.querySelectorAll('img')].filter(i=>!i.complete||i.naturalWidth===0).map(i=>({alt:i.alt,url:i.getAttribute('src')})),sections:sections.map((el,i)=>({index:i,title:(el.querySelector('h1,h2,h3')?.textContent||'Section '+(i+1)).replace(/\s+/g,' ').trim().slice(0,140),box:rect(el),styles:styles(el),elements:[el,...el.querySelectorAll('h1,h2,h3,h4,p,a,button,img,div')].filter(e=>{const s=getComputedStyle(e);return e.tagName!=='DIV'||['flex','grid','inline-flex','inline-grid'].includes(s.display);}).filter(e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0).slice(0,180).map(e=>({tag:e.tagName,text:(e.tagName==='IMG'?e.alt:e.textContent).replace(/\s+/g,' ').trim().slice(0,100),classes:typeof e.className==='string'?e.className:'',box:rect(e),styles:styles(e)}))}))};
   },kind);
   const filename=`${slug}-${width}-${kind}.png`;await page.screenshot({path:path.join(out,filename),fullPage:true,animations:'disabled'});
   for(const section of data.sections) section.screenshot=`${slug}-${width}-${kind}-section-${section.index}.png`;
   record[kind]={...data,screenshot:filename};
  }
  item.widths.push(record);console.log(label+' '+route+' '+width+': '+record.source.height+' → '+record.imported.height);
 }
 report.pages.push(item);
}
await fs.writeFile(path.join(out,'capture.json'),JSON.stringify(report,null,2));
}finally{await browser.close();}
