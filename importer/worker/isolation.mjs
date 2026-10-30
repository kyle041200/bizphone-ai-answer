import fs from 'node:fs/promises';import path from 'node:path';import{execFile}from'node:child_process';import{promisify}from'node:util';import{spawn}from'node:child_process';import{once}from'node:events';import ts from'../engine/node_modules/typescript/lib/typescript.js';
const exec=promisify(execFile);
/** No repository code executes on the host. All writable build state is bounded tmpfs. */
export async function isolatedConversion(job,phase){
 const uid=process.getuid(),gid=process.getgid();
 const name='kghq-convert-'+job.id,network=process.env.KGHQ_INSTALL_NETWORK||'bridge';
 const docker=async(args,timeout=30000,maxBuffer=1024*1024)=>(await exec('docker',args,{timeout,maxBuffer})).stdout;
 const image=process.env.KGHQ_RUNNER_IMAGE||'kghq-converter-runner:0.5.0-rc1';
 try{await docker(['image','inspect',image]);}catch{const e=Error('Runner image missing');e.publicMessage='Conversion runner is not installed on the worker host. Ask the site operator to build and configure the runner image. No pages were changed.';throw e;}
 const source=path.join(job.directory,'source'),pkg=JSON.parse(await fs.readFile(path.join(source,'package.json'),'utf8'));
 if(!pkg.dependencies?.react||!pkg.scripts?.build||!(pkg.dependencies?.vite||pkg.devDependencies?.vite))throw Error('Only Vite React projects with a build script are currently supported by automated rendering.');
 const npmLock=await fs.access(path.join(source,'package-lock.json')).then(()=>true,()=>false);
 const bunLock=await fs.access(path.join(source,'bun.lock')).then(()=>true,()=>false);
 if(!npmLock&&!bunLock)throw Error('A committed npm package-lock.json or Bun text bun.lock is required.');
 const registries=(process.env.KGHQ_ALLOWED_REGISTRIES||'registry.npmjs.org').split(',').map(s=>s.trim());
 const rewrites=JSON.parse(process.env.KGHQ_REGISTRY_REWRITES||'{}');
 const checkURL=value=>{let url;try{url=new URL(value);}catch{throw Error('Only HTTPS registry dependencies are supported');}if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||!registries.includes(url.hostname))throw Error('Dependency registry is outside the worker allowlist');};
 if(npmLock){const lock=JSON.parse(await fs.readFile(path.join(source,'package-lock.json'),'utf8'));for(const item of Object.values(lock.packages||{}))if(item.resolved)checkURL(item.resolved);}
 else {
  const file=path.join(source,'bun.lock'),parsed=ts.parseConfigFileTextToJson(file,await fs.readFile(file,'utf8'));
  if(parsed.error||!parsed.config?.packages)throw Error('Unsupported Bun lock format');
  for(const entry of Object.values(parsed.config.packages)){
   if(!Array.isArray(entry)||typeof entry[0]!=='string'||!/@[^@]+$/.test(entry[0]))throw Error('Unsupported Bun dependency');
   const version=entry[0].slice(entry[0].lastIndexOf('@')+1);if(!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version))throw Error('Only locked registry packages are supported');
   if(entry[1]){for(const [prefix,target]of Object.entries(rewrites)){if(entry[1].startsWith(prefix)){checkURL(target);entry[1]=target+entry[1].slice(prefix.length);break;}}checkURL(entry[1]);}
  }
  await fs.writeFile(file,JSON.stringify(parsed.config));
 }
 const args=['run','-d','--name',name,'--network',network,'--user',`${uid}:${gid}`,'--cap-drop=ALL','--security-opt=no-new-privileges','--read-only','--memory=4g','--cpus=2','--pids-limit=256','--shm-size=256m','--tmpfs',`/job:rw,exec,nosuid,nodev,size=2g,uid=${uid},gid=${gid},mode=0700`,'--tmpfs','/tmp:rw,nosuid,nodev,size=256m','-w','/job','-e','HOME=/tmp','-e','CI=true','-e','TMPDIR=/job/tmp','-e','npm_config_cache=/job/.npm-cache','-e','BUN_INSTALL_CACHE_DIR=/job/.bun-cache'];
 if(process.env.KGHQ_NPM_PROXY){const proxy=new URL(process.env.KGHQ_NPM_PROXY);if(proxy.username||proxy.password)throw Error('Do not expose authenticated proxy credentials to dependency containers.');for(const key of ['HTTP_PROXY','HTTPS_PROXY','http_proxy','https_proxy','npm_config_proxy','npm_config_https_proxy'])args.push('-e',key+'='+proxy.href);}
 if(process.env.KGHQ_NPM_CA)args.push('-v',path.resolve(process.env.KGHQ_NPM_CA)+':/run/npm-ca.pem:ro','-e','NODE_EXTRA_CA_CERTS=/run/npm-ca.pem');
 args.push(image,'node','-e','setInterval(()=>{},10000)');
 try{
  phase('preparing',20);await docker(args);
  await streamSource(source,name);
  await docker(['exec',name,'mkdir','-p','/job/tmp']);
  phase('installing',30);const install=npmLock?['npm','ci','--ignore-scripts','--no-audit','--no-fund']:['bun','install','--frozen-lockfile','--ignore-scripts','--network-concurrency','8'];await docker(['exec','-w','/job/source',name,...install],360000);
  await docker(['exec',name,'rm','-rf','/job/.npm-cache','/job/.bun-cache']);
  // No untrusted build/render process starts until the network has been detached.
  await docker(['network','disconnect',network,name]);
  const connections=JSON.parse(await docker(['inspect','--format','{{json .NetworkSettings.Networks}}',name]));
  if(Object.keys(connections).length)throw Error('Runner network isolation could not be verified.');
  const adapter=pkg.dependencies?.['@tanstack/react-start']?'vite-dev':'static';
  if(adapter==='static'){phase('building',55);await docker(['exec','-w','/job/source',name,'npm','run','build'],360000);}
  phase('converting',70);
  const config={repository:job.repository,routes:job.routes,adapter,...job.policy};
  await docker(['exec','-e','KGHQ_CONVERSION_CONFIG='+JSON.stringify(config),name,'node','/opt/kghq/worker/runner.mjs'],600000);
  // Read one bounded regular file. No untrusted tar extraction or host-writable mounts.
  const text=await docker(['exec',name,'node','-e',`const fs=require('fs');const d=fs.lstatSync('/job/export'),p='/job/export/bundle.json',s=fs.lstatSync(p);if(!d.isDirectory()||d.isSymbolicLink()||!s.isFile()||s.isSymbolicLink()||s.size>48*1024*1024)process.exit(1);process.stdout.write(fs.readFileSync(p));`],30000,49*1024*1024);
  return JSON.parse(text);
 }finally{await docker(['rm','-f',name]).catch(()=>{});}
}

// Stream only bounded regular files into tmpfs. docker cp cannot target a
// read-only root reliably, and extracting an untrusted tar on the host is unsafe.
async function streamSource(source,name){
 const receiver=`const fs=require('fs'),path=require('path'),rl=require('readline').createInterface({input:process.stdin});let bytes=0,count=0;rl.on('line',line=>{const x=JSON.parse(line);if(typeof x.path!=='string'||x.path.includes('\\\\')||x.path.split('/').some(p=>!p||p==='.'||p==='..'))process.exit(1);const data=Buffer.from(x.data,'base64');bytes+=data.length;if(++count>15000||bytes>150*1024*1024)process.exit(1);const p=path.join('/job/source',x.path);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,data,{mode:0o644,flag:'wx'});});`;
 const child=spawn('docker',['exec','-i',name,'node','-e',receiver],{stdio:['pipe','ignore','pipe']});let diagnostic='';child.stderr.on('data',b=>{diagnostic=(diagnostic+b.toString()).slice(-1000)});
 const completion=new Promise((resolve,reject)=>{child.on('error',reject);child.on('close',code=>code===0?resolve():reject(Error('Source transfer failed: '+diagnostic)));});
 // Attach rejection handling immediately, before walking source files.
 completion.catch(()=>{});const timer=setTimeout(()=>child.kill('SIGKILL'),60000);
 let count=0,bytes=0;
 try{async function walk(dir,prefix=''){for(const e of await fs.readdir(dir,{withFileTypes:true})){const rel=prefix+e.name,p=path.join(dir,e.name);if(e.isSymbolicLink())throw Error('Source symlinks are unsupported');if(e.isDirectory())await walk(p,rel+'/');else if(e.isFile()){const data=await fs.readFile(p);bytes+=data.length;if(++count>15000||bytes>150*1024*1024)throw Error('Source inventory exceeded');if(!child.stdin.write(JSON.stringify({path:rel,data:data.toString('base64')})+'\n'))await once(child.stdin,'drain');}}}await walk(source);child.stdin.end();await completion;}catch(e){child.kill('SIGKILL');throw e;}finally{clearTimeout(timer);}
}
