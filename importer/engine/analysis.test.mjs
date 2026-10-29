import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {analyze} from './analyze.mjs';
import {projectFiles} from './files.mjs';
test('independent project analysis inventories routes/tokens/integrations without evaluating config or reading credentials',async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'kghq-independent-'));
 try {
  await fs.writeFile(path.join(root,'package.json'),JSON.stringify({dependencies:{react:'18',vite:'5','react-router-dom':'6','@supabase/supabase-js':'2'}}));
  await fs.writeFile(path.join(root,'App.tsx'),`export const Header=()=> <header>Different identity</header>;export function Screen(){return <><Header/><button onClick={()=>fetch('/service')}>Send</button><Routes><Route path="/different" element={<div/>}/></Routes></>}`);
  await fs.writeFile(path.join(root,'design.css'),':root{--brand:#287164;--secret-token:do-not-export}@media(min-width:53rem){h1{font-size:3rem}}');
  await fs.writeFile(path.join(root,'vite.config.ts'),'throw Error("MUST NEVER EXECUTE")');
  await fs.writeFile(path.join(root,'.env'),'PRIVATE_VALUE=never-read');
  await fs.writeFile(path.join(root,'.npmrc'),'//registry.npmjs.org/:_authToken=never-read');
  const report=await analyze(root),json=JSON.stringify(report);
  assert.ok(report.routing.pages.some(p=>p.path==='/different'));
  assert.ok(report.design.tokens.some(t=>t.name==='--brand'&&t.value==='#287164'));
  assert.ok(report.requiresInteractionAcknowledgment);
  assert.ok(report.frameworks.some(f=>f.name==='vite'));
  assert.doesNotMatch(json,/never-read|do-not-export/);
  assert.ok(!(await projectFiles(root)).some(f=>f.endsWith('.env')||f.endsWith('.npmrc')));
 }finally{await fs.rm(root,{recursive:true,force:true});}
});
