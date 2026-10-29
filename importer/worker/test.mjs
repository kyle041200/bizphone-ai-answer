import{test}from'node:test';import assert from'node:assert/strict';import{spawn}from'node:child_process';import fs from'node:fs/promises';import os from'node:os';import path from'node:path';import crypto from'node:crypto';
import{normalizeRepository}from'../engine/github.mjs';
test('repository inputs accept full GitHub URLs and reject credentials/hosts/path injection',()=>{assert.equal(normalizeRepository('https://github.com/GuidoPenta/TrackZilla.git/'),'GuidoPenta/TrackZilla');for(const s of ['https://example.com/a/b','https://token@github.com/a/b','https://github.com/a/b?token=private','a/..','../b','a/b/tree/main'])assert.throws(()=>normalizeRepository(s));});
test('authenticated async API rejects invalid jobs and replays idempotently; optional real default-branch scan',async()=>{
 const data=await fs.mkdtemp(path.join(os.tmpdir(),'kghq-worker-test-')),token=crypto.randomBytes(32).toString('hex'),port=18987;
 const child=spawn(process.execPath,[new URL('./server.mjs',import.meta.url).pathname],{env:{...process.env,KGHQ_WORKER_TOKEN:token,KGHQ_ALLOWED_REPOSITORIES:'GuidoPenta/TrackZilla',KGHQ_WORKER_DATA:data,PORT:String(port)},stdio:['ignore','pipe','pipe']});let errors='';child.stderr.on('data',b=>errors+=b.toString());
 const request=async(route,body,auth=true,key=crypto.randomBytes(16).toString('hex'))=>{const response=await fetch('http://127.0.0.1:'+port+route,{method:body?'POST':'GET',headers:{...(auth?{Authorization:'Bearer '+token}:{}),'Content-Type':'application/json','Idempotency-Key':key},body:body?JSON.stringify(body):undefined});return{status:response.status,data:await response.json()};};
 try{
  for(let n=0;n<100;n++){try{await request('/');break;}catch{if(child.exitCode!==null)throw Error('Worker failed startup: '+errors);await new Promise(r=>setTimeout(r,100));}}
  assert.equal((await request('/v1/jobs/00000000000000000000000000000000',null,false)).status,401);
  assert.equal((await request('/v1/jobs',{kind:'scan',repository:'other/forbidden'})).status,403);
  assert.equal((await request('/v1/jobs',{kind:'convert',scan:'missing',routes:['/']})).status,400);
  if(process.env.KGHQ_TEST_NETWORK==='1'){
   const body={kind:'scan',repository:'https://github.com/GuidoPenta/TrackZilla'},key=crypto.randomBytes(16).toString('hex'),started=await request('/v1/jobs',body,true,key);assert.equal(started.status,202);
   assert.equal((await request('/v1/jobs',body,true,key)).data.id,started.data.id);
   let state;for(let n=0;n<180;n++){state=await request('/v1/jobs/'+started.data.id);if(['ready','failed'].includes(state.data.status))break;await new Promise(r=>setTimeout(r,1000));}
   assert.equal(state.data.status,'ready',JSON.stringify(state.data));assert.ok(state.data.ref);assert.match(state.data.commit,/^[a-f0-9]{40}$/);assert.ok(state.data.pages.some(p=>p.path==='/'));assert.ok(state.data.compatibility.requiresInteractionAcknowledgment);
   const rejected=await request('/v1/jobs',{kind:'convert',scan:started.data.id,routes:['/']});assert.equal(rejected.status,409);
   await fs.mkdir(new URL('../work/',import.meta.url),{recursive:true});await fs.writeFile(new URL('../work/worker-scan-results.json',import.meta.url),JSON.stringify({status:'PASS',defaultBranch:state.data.ref,repository:state.data.repository,commit:state.data.commit,pages:state.data.pages,authenticationAndIdempotency:true,interactionAcknowledgmentEnforced:true,conversionEndToEnd:'NOT TESTED — runner image and isolated build environment still required'},null,2));
  }
 }finally{child.kill('SIGTERM');await new Promise(r=>child.once('exit',r));await fs.rm(data,{recursive:true,force:true});}
});
