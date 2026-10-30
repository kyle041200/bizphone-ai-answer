import fs from 'node:fs/promises';import assert from 'node:assert/strict';import{chromium}from'../engine/node_modules/playwright/index.mjs';
const label=process.argv[2]||'editor',data=JSON.parse(await fs.readFile('importer/work/'+label+'-staged.json','utf8'));const id=data.results[0].id;
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('dialog',d=>d.accept());await page.route('**/*',r=>['localhost','127.0.0.1'].includes(new URL(r.request().url()).hostname)?r.continue():r.abort('blockedbyclient'));const results=[];
const check=async(name,fn)=>{try{await fn();results.push({name,status:'PASS'});console.log('PASS '+name);}catch(e){results.push({name,status:'FAIL',error:e.message.slice(0,1000)});console.log('FAIL '+name+': '+e.message.slice(0,140));}};
try{
 await page.goto('http://localhost:8086/wp-login.php');await page.locator('#user_login').fill('kghq-admin');await page.locator('#user_pass').fill(process.env.KGHQ_STAGING_PASSWORD||'automation-staging-admin-only');await Promise.all([page.waitForURL('**/wp-admin/**'),page.locator('#wp-submit').click()]);
 await page.goto(`http://localhost:8086/wp-admin/post.php?post=${id}&action=edit`,{waitUntil:'domcontentloaded',timeout:60000});
 for(const name of ['Close','Get started','Got it']){const close=page.getByRole('button',{name,exact:true});if(await close.count())await close.first().click().catch(()=>{});}
 await page.waitForFunction(()=>window.wp?.data?.select('core/block-editor')?.getBlocks().length>0,{timeout:60000});
 await page.evaluate(()=>wp.data.dispatch('core/preferences').set('core/edit-post','welcomeGuide',false));
 await page.waitForTimeout(400);
 const iframe=page.frames().find(f=>f.name()==='editor-canvas');const canvas=iframe||page;await canvas.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
 await check('No invalid/recovery blocks on initial open',async()=>{const invalid=await page.evaluate(()=>{const bad=[];function walk(bs){for(const b of bs){if(b.isValid===false)bad.push(b.name);walk(b.innerBlocks||[]);}}walk(wp.data.select('core/block-editor').getBlocks());return bad;});assert.deepEqual(invalid,[]);});
 await page.screenshot({path:'importer/work/'+label+'-editor-before.png',fullPage:true});
 let originalHeading,headingId,buttonId,imageId,groupId;
 const inventory=await page.evaluate(()=>{const all=[];function walk(bs){for(const b of bs){all.push({id:b.clientId,name:b.name,attributes:b.attributes});walk(b.innerBlocks||[]);}}walk(wp.data.select('core/block-editor').getBlocks());return all;});
 headingId=inventory.find(b=>b.name==='core/heading')?.id;buttonId=inventory.find(b=>b.name==='core/button')?.id;imageId=inventory.find(b=>b.name==='core/image'&&!b.attributes.className?.includes('kghq-source-svg'))?.id;groupId=inventory.find(b=>b.name==='core/group'&&/\bgrid\b/.test(b.attributes.className||''))?.id;
 await check('Heading can be clicked and typed directly in visual canvas',async()=>{const heading=canvas.locator('[data-block="'+headingId+'"][contenteditable="true"], [data-block="'+headingId+'"] [contenteditable="true"]').first();originalHeading=await heading.innerText();await heading.fill('QA editable heading');await page.waitForFunction(id=>wp.data.select('core/block-editor').getBlock(id)?.attributes.content.includes('QA editable heading'),headingId);});
 await check('Paragraph text and alignment remain visually editable',async()=>{
  const paragraphId=inventory.find(b=>b.name==='core/paragraph')?.id;assert.ok(paragraphId);
  const paragraph=canvas.locator('[data-block="'+paragraphId+'"][contenteditable="true"], [data-block="'+paragraphId+'"] [contenteditable="true"]').first();await paragraph.fill('QA editable paragraph');
  await page.evaluate(id=>wp.data.dispatch('core/block-editor').updateBlockAttributes(id,{align:'center'}),paragraphId);
  assert.equal(await paragraph.evaluate(e=>getComputedStyle(e).textAlign),'center');
 });
 await check('Button text is editable directly, with native link/style controls',async()=>{assert.ok(buttonId);await page.evaluate(id=>wp.data.dispatch('core/block-editor').selectBlock(id),buttonId);const link=canvas.locator('[data-block="'+buttonId+'"] .wp-block-button__link[contenteditable="true"]').first();await link.fill('QA button text');await page.waitForFunction(id=>wp.data.select('core/block-editor').getBlock(id)?.attributes.text.includes('QA button text'),buttonId);});
 await check('Custom colors, padding and button link visibly update',async()=>{
  await page.evaluate(id=>{const store=wp.data.select('core/block-editor'),b=store.getBlock(id);wp.data.dispatch('core/block-editor').updateBlockAttributes(id,{url:'https://example.com/qa',style:{...b.attributes.style,color:{background:'#123456',text:'#ffffff'},spacing:{padding:{top:'17px',bottom:'17px',left:'29px',right:'29px'}}}});},buttonId);
  const button=canvas.locator('[data-block="'+buttonId+'"] .wp-block-button__link').first();await button.waitFor();await page.waitForTimeout(200);const style=await button.evaluate(e=>({background:getComputedStyle(e).backgroundColor,padding:getComputedStyle(e).paddingTop}));assert.equal(style.background,'rgb(18, 52, 86)');assert.equal(style.padding,'17px');
 });
 await check('Native image replacement control and Media Library are available',async()=>{
  assert.ok(imageId);await page.evaluate(id=>wp.data.dispatch('core/block-editor').selectBlock(id),imageId);await page.waitForTimeout(200);
  const replace=page.getByRole('button',{name:/Replace|Edit image|Add media|Upload to Media Library/i});const frameReplace=canvas.getByRole('button',{name:/Replace|Edit image|Add media|Upload to Media Library/i});assert.ok(await replace.count()||await frameReplace.count(), 'Image replacement toolbar not found');
  const exact=page.getByRole('button',{name:'Replace',exact:true});const trigger=await exact.count()?exact.first():frameReplace.first();await trigger.click();
  await page.waitForTimeout(200);
  const library=page.getByRole('menuitem',{name:/Media Library/i}).or(page.getByRole('button',{name:/Media Library/i}));
  await library.first().waitFor({state:'visible'});await library.first().click();
  await page.screenshot({path:'importer/work/'+label+'-media-dialog.png',fullPage:true});await fs.writeFile('importer/work/'+label+'-media-dialog.txt',await page.locator('body').innerText());
  const modal=page.locator('.media-modal');await modal.waitFor({state:'visible'});
  const libraryTab=modal.getByRole('tab',{name:/Media Library/i});if(await libraryTab.count())await libraryTab.click();
  const tiles=modal.locator('.attachments .attachment:not(.selected)');await tiles.first().waitFor({state:'visible'});const selectedId=Number(await tiles.first().getAttribute('data-id'));await tiles.first().click();
  const select=modal.locator('.media-button-select');await select.waitFor({state:'visible'});await select.click();await modal.waitFor({state:'hidden'});
  await page.waitForFunction(({id,media})=>wp.data.select('core/block-editor').getBlock(id)?.attributes.id===media,{id:imageId,media:selectedId});
  assert.ok(selectedId>0);

 });
 await check('Native Group grid columns, spacing and background visibly update',async()=>{
  assert.ok(groupId);await page.evaluate(id=>{const b=wp.data.select('core/block-editor').getBlock(id);wp.data.dispatch('core/block-editor').updateBlockAttributes(id,{layout:{type:'grid',columnCount:2},style:{...b.attributes.style,color:{background:'#f0e0d0'},spacing:{padding:{top:'37px',right:'19px',bottom:'37px',left:'19px'},blockGap:'31px'}}});},groupId);
  const group=canvas.locator('[data-block="'+groupId+'"]').first();await page.waitForTimeout(200);const s=await group.evaluate(el=>{const c=getComputedStyle(el);return{display:c.display,gap:c.gap,padding:c.paddingTop,bg:c.backgroundColor,columns:c.gridTemplateColumns};});assert.equal(s.display,'grid');assert.equal(s.gap,'31px');assert.equal(s.padding,'37px');assert.equal(s.bg,'rgb(240, 224, 208)');assert.equal(s.columns.split(' ').length,2);
 });
 await check('Sections can be added, duplicated, reordered and removed as native blocks',async()=>{
  await page.evaluate(()=>{const editor=wp.data.select('core/block-editor'),dispatch=wp.data.dispatch('core/block-editor'),root=editor.getBlocks()[0];const temp=wp.blocks.createBlock('core/group',{metadata:{name:'QA temporary section'}},[wp.blocks.createBlock('core/paragraph',{content:'QA section text'})]);dispatch.insertBlocks(temp,0,root.clientId);dispatch.duplicateBlocks([temp.clientId],false);const siblings=editor.getBlocks(root.clientId);const copy=siblings.find(b=>b.clientId!==temp.clientId&&b.attributes.metadata?.name==='QA temporary section');if(!copy)throw Error('Duplicate failed');dispatch.moveBlocksToPosition([copy.clientId],root.clientId,root.clientId,2);dispatch.removeBlocks([temp.clientId,copy.clientId],false);});
 });
 await page.screenshot({path:'importer/work/'+label+'-editor-after.png',fullPage:true});
 await check('Save draft and reopen without block recovery errors',async()=>{
  await page.evaluate(()=>wp.data.dispatch('core/editor').savePost());await page.waitForFunction(()=>!wp.data.select('core/editor').isSavingPost()&&!wp.data.select('core/editor').isEditedPostDirty(),{timeout:30000});
  await page.reload({waitUntil:'domcontentloaded',timeout:60000});await page.waitForFunction(()=>wp.data.select('core/block-editor').getBlocks().length>0);const state=await page.evaluate(()=>{const all=[];function walk(bs){for(const b of bs){all.push(b);walk(b.innerBlocks||[]);}}walk(wp.data.select('core/block-editor').getBlocks());return{invalid:all.filter(b=>b.isValid===false).map(b=>b.name),heading:all.find(b=>b.name==='core/heading')?.attributes.content,button:all.find(b=>b.name==='core/button')?.attributes};});assert.deepEqual(state.invalid,[]);assert.match(state.heading,/QA editable heading/);assert.match(state.button.text,/QA button text/);assert.equal(state.button.url,'https://example.com/qa');
 });
 await check('Saved native styles also appear on front-end draft preview',async()=>{await page.goto(`http://localhost:8086/?page_id=${id}&preview=true`,{waitUntil:'domcontentloaded',timeout:60000});const button=page.locator('.kghq-import-root .wp-block-button__link').filter({hasText:'QA button text'}).first();const s=await button.evaluate(e=>({color:getComputedStyle(e).backgroundColor,padding:getComputedStyle(e).paddingTop}));assert.equal(s.color,'rgb(18, 52, 86)');assert.equal(s.padding,'17px');await page.screenshot({path:'importer/work/'+label+'-edited-preview.png',fullPage:true});});
}catch(e){results.push({name:'Editor setup/runtime',status:'FAIL',error:e.message.slice(0,1000)});throw e;}finally{await fs.writeFile('importer/work/'+label+'-editor-results.json',JSON.stringify({postId:id,results,allPassed:results.length>=9&&results.every(r=>r.status==='PASS')},null,2));await browser.close();}
if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
