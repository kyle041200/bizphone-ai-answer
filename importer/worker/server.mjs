import http from 'node:http';import crypto from 'node:crypto';import fs from 'node:fs/promises';import path from 'node:path';
import{checkout,normalizeRepository}from'../engine/github.mjs';import{analyze}from'../engine/analyze.mjs';import{isolatedConversion}from'./isolation.mjs';
import { repositoryPolicy } from './policy.mjs';
const token=process.env.KGHQ_WORKER_TOKEN||'';if(token.length<32)throw Error('Configure KGHQ_WORKER_TOKEN (minimum 32 characters)');
const allowsRepository=repositoryPolicy();
const root=path.resolve(process.env.KGHQ_WORKER_DATA||'worker-data');await fs.mkdir(root,{recursive:true,mode:0o700});
const jobs=new Map(),pending=[],ttl=3600000;let active=false;
const routeOK=r=>typeof r==='string'&&/^\/(?!\/)[A-Za-z0-9/_-]*$/.test(r);
const writes=new WeakMap();
function persist(j){const {directory,...safe}=j,snapshot=JSON.stringify(safe);const next=(writes.get(j)||Promise.resolve()).catch(()=>{}).then(async()=>{await fs.writeFile(path.join(j.directory,'job.json.tmp'),snapshot,{mode:0o600});await fs.rename(path.join(j.directory,'job.json.tmp'),path.join(j.directory,'job.json'));});writes.set(j,next);return next;}

for(const id of await fs.readdir(root)){if(!/^[a-f0-9]{32}$/.test(id))continue;try{const j=JSON.parse(await fs.readFile(path.join(root,id,'job.json'),'utf8'));if(j.id!==id)continue;j.directory=path.join(root,id);if(['running','queued'].includes(j.status)){j.status='failed';j.error='Worker restarted. Retry the job; existing pages were not changed.';}jobs.set(id,j);}catch{}}
async function copySource(src,dst){let bytes=0,files=0;async function walk(a,b){await fs.mkdir(b,{recursive:true,mode:0o755});for(const e of await fs.readdir(a,{withFileTypes:true})){if(['.git','node_modules','dist','.output','.npmrc','.netrc','.git-credentials'].includes(e.name)||/^\.env(?:\.|$)/.test(e.name))continue;if(e.isSymbolicLink())throw Error('Source symlinks are not supported');const x=path.join(a,e.name),y=path.join(b,e.name);if(e.isDirectory())await walk(x,y);else if(e.isFile()){const st=await fs.stat(x);bytes+=st.size;if(++files>15000||bytes>150*1024*1024)throw Error('Source exceeds bounded inventory limits');await fs.copyFile(x,y);await fs.chmod(y,0o644);}}}await walk(src,dst);}
async function execute(j){try{
 if(j.kind==='scan'){
  j.phase='cloning';await persist(j);let clone;
  for(let n=0;n<2;n++){try{clone=await checkout(j.repository);break;}catch{if(n)throw Error('GitHub checkout failed; check read-only credentials and repository access.');await new Promise(r=>setTimeout(r,1000));}}
  try{await copySource(clone.repo,path.join(j.directory,'source'));j.commit=clone.commit;j.ref=clone.ref;}finally{await clone.cleanup();}
  j.phase='analyzing';j.progress=60;await persist(j);j.compatibility=await analyze(path.join(j.directory,'source'));
  j.pages=j.compatibility.routing.pages.filter(p=>routeOK(p.path));j.warnings=[...j.compatibility.warnings,...j.compatibility.routing.dynamicAndUnresolvedRoutes.map(w=>w.reason)];
  if(!j.pages.length)throw Error('No supported concrete routes found. Dynamic routes require a project adapter.');
 }else{
  const source=jobs.get(j.scan);if(!source||source.status!=='ready')throw Error('Scan expired; scan again.');
  await copySource(path.join(source.directory,'source'),path.join(j.directory,'source'));
  const bundle=await isolatedConversion(j,(phase,progress)=>{j.phase=phase;j.progress=progress;void persist(j).catch(()=>{});});
  if(bundle.repository!==j.repository||bundle.pages?.length!==j.routes.length||bundle.pages.some(p=>!j.routes.includes(p.route)))throw Error('Conversion source/route mismatch');
  bundle.sourceCommit=j.commit;await fs.writeFile(path.join(j.directory,'bundle.json'),JSON.stringify(bundle),{mode:0o600});
  j.warnings=[...new Set(bundle.pages.flatMap(p=>p.warnings||[]))];await fs.rm(path.join(j.directory,'source'),{recursive:true,force:true});
 }
 j.status='ready';j.phase='ready';j.progress=100;
}catch(e){await fs.rm(path.join(j.directory,'source'),{recursive:true,force:true}).catch(()=>{});j.failurePhase=j.phase;j.status='failed';j.phase='failed';j.error=e.publicMessage||'Job failed. Check repository support, available source assets, dependency installation, runner image/resources and server operator logs. Existing pages were not changed.';console.error(JSON.stringify({job:j.id,phase:j.failurePhase,error:e instanceof Error?e.name:'Error'}));}await persist(j);}
async function pump(){if(active||!pending.length)return;active=true;const j=pending.shift();j.status='running';try{await execute(j);}finally{active=false;void pump();}}
function view(j){return{id:j.id,kind:j.kind,status:j.status,phase:j.phase,progress:j.progress||0,repository:j.repository,commit:j.commit,ref:j.ref,pages:j.kind==='scan'?j.pages:undefined,compatibility:j.kind==='scan'?j.compatibility:undefined,warnings:j.warnings||[],error:j.error};}
const server=http.createServer(async(req,res)=>{
 const send=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
 const expected=Buffer.from('Bearer '+token),supplied=Buffer.from(req.headers.authorization||'');if(expected.length!==supplied.length||!crypto.timingSafeEqual(expected,supplied))return send(401,{message:'Unauthorized'});
 try{const url=new URL(req.url,'http://worker');
 if(req.method==='POST'&&url.pathname==='/v1/jobs'){
  let raw='';for await(const part of req){raw+=part;if(Buffer.byteLength(raw)>65536)return send(413,{message:'Request too large'});}const data=JSON.parse(raw);
  const key=req.headers['idempotency-key'];if(typeof key!=='string'||!/^[a-f0-9]{32}$/.test(key))return send(400,{message:'Idempotency-Key is required'});
  const digest=crypto.createHash('sha256').update(raw).digest('hex'),existing=[...jobs.values()].find(j=>j.key===key);
  if(existing)return existing.digest===digest?send(200,view(existing)):send(409,{message:'Idempotency key payload mismatch'});
  if(jobs.size>=50)return send(429,{message:'Worker queue capacity reached'});
  if(!['scan','convert'].includes(data.kind))return send(400,{message:'Invalid job kind'});
  let repository,commit,policy;
  if(data.kind==='scan'){repository=normalizeRepository(data.repository);if(!allowsRepository(repository))return send(403,{message:'Repository not in operator allowlist'});}
  else{const scan=jobs.get(data.scan);if(!scan||scan.kind!=='scan'||scan.status!=='ready')return send(400,{message:'Scan expired or unavailable'});
   if(!Array.isArray(data.routes)||!data.routes.length||data.routes.length>20||new Set(data.routes).size!==data.routes.length||data.routes.some(r=>!routeOK(r)||!scan.pages.some(p=>p.path===r)))return send(400,{message:'Select 1–20 scanned pages'});
   if(scan.compatibility.requiresInteractionAcknowledgment&&data.acceptInteractionLoss!==true)return send(409,{message:'Review and acknowledge the unsupported interactions report before conversion'});
   repository=scan.repository;commit=scan.commit;policy={acceptInteractionLoss:data.acceptInteractionLoss===true,allowMissingAssets:data.allowMissingAssets===true,allowMissingImages:data.allowMissingImages===true};}
  const id=crypto.randomBytes(16).toString('hex'),directory=path.join(root,id);await fs.mkdir(directory,{mode:0o700});
  const j={id,directory,key,digest,kind:data.kind,created:Date.now(),repository,commit,policy,scan:data.scan,routes:data.routes,status:'queued',phase:'queued'};
  jobs.set(id,j);await persist(j);pending.push(j);void pump();return send(202,view(j));
 }
 const match=url.pathname.match(/^\/v1\/jobs\/([a-f0-9]{32})(\/bundle)?$/);if(req.method==='GET'&&match){const j=jobs.get(match[1]);if(!j)return send(404,{message:'Job expired'});if(!match[2])return send(200,view(j));if(j.kind!=='convert'||j.status!=='ready')return send(409,{message:'Bundle unavailable'});return send(200,JSON.parse(await fs.readFile(path.join(j.directory,'bundle.json'),'utf8')));}
 return send(404,{message:'Not found'});
 }catch{return send(400,{message:'Invalid request'});}
});server.requestTimeout=30000;server.headersTimeout=10000;
setInterval(async()=>{for(const [id,j]of jobs){if(Date.now()-j.created>ttl&&!['queued','running'].includes(j.status)&&![...jobs.values()].some(c=>c.scan===id&&['queued','running'].includes(c.status))){jobs.delete(id);await fs.rm(j.directory,{recursive:true,force:true});}}},60000).unref();
server.listen(Number(process.env.PORT||8787),process.env.KGHQ_WORKER_HOST||'127.0.0.1',()=>console.log('KGHQ worker listening'));
