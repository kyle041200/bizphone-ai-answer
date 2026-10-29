import fs from 'node:fs/promises';import path from 'node:path';import{execFile}from'node:child_process';import{promisify}from'node:util';
const exec=promisify(execFile);
/** No repository code executes on the host. All writable build state is bounded tmpfs. */
export async function isolatedConversion(job,phase){
 const uid=process.getuid(),gid=process.getgid();
 const name='kghq-convert-'+job.id,network=process.env.KGHQ_INSTALL_NETWORK||'bridge';
 const docker=async(args,timeout=30000,maxBuffer=1024*1024)=>(await exec('docker',args,{timeout,maxBuffer})).stdout;
 const image=process.env.KGHQ_RUNNER_IMAGE||'kghq-converter-runner:0.4.0';
 try{await docker(['image','inspect',image]);}catch{const e=Error('Runner image missing');e.publicMessage='Conversion runner is not installed on the worker host. Ask the site operator to build and configure the runner image. No pages were changed.';throw e;}
 const source=path.join(job.directory,'source'),pkg=JSON.parse(await fs.readFile(path.join(source,'package.json'),'utf8'));
 if(!pkg.dependencies?.react||!pkg.scripts?.build||!(pkg.dependencies?.vite||pkg.devDependencies?.vite))throw Error('Only Vite React projects with a build script are currently supported by automated rendering.');
 const lock=await fs.access(path.join(source,'package-lock.json')).then(()=>true,()=>false);
 if(!lock)throw Error('Commit package-lock.json. Other package managers need a reviewed worker adapter; no source scripts were run.');
 const lockfile=JSON.parse(await fs.readFile(path.join(source,'package-lock.json'),'utf8'));
 const registries=(process.env.KGHQ_ALLOWED_REGISTRIES||'registry.npmjs.org').split(',').map(s=>s.trim());
 for(const item of Object.values(lockfile.packages||{})){if(!item.resolved)continue;let url;try{url=new URL(item.resolved);}catch{throw Error('Only reviewed HTTPS registry dependencies are supported');}if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||!registries.includes(url.hostname))throw Error('Dependency registry is outside the worker allowlist');}
 const args=['run','-d','--name',name,'--network',network,'--user',`${uid}:${gid}`,'--cap-drop=ALL','--security-opt=no-new-privileges','--read-only','--memory=4g','--cpus=2','--pids-limit=256','--shm-size=256m','--tmpfs',`/job:rw,nosuid,nodev,size=2g,uid=${uid},gid=${gid},mode=0700`,'--tmpfs','/tmp:rw,nosuid,nodev,size=256m','-w','/job','-e','HOME=/tmp','-e','CI=true'];
 if(process.env.KGHQ_NPM_PROXY){const proxy=new URL(process.env.KGHQ_NPM_PROXY);if(proxy.username||proxy.password)throw Error('Do not expose authenticated proxy credentials to dependency containers.');for(const key of ['HTTP_PROXY','HTTPS_PROXY'])args.push('-e',key+'='+proxy.href);}
 if(process.env.KGHQ_NPM_CA)args.push('-v',path.resolve(process.env.KGHQ_NPM_CA)+':/run/npm-ca.pem:ro','-e','NODE_EXTRA_CA_CERTS=/run/npm-ca.pem');
 args.push(image,'node','-e','setInterval(()=>{},10000)');
 try{
  phase('preparing',20);await docker(args);
  await docker(['cp','-a',source,name+':/job/source'],60000);
  phase('installing',30);await docker(['exec','-w','/job/source',name,'npm','ci','--ignore-scripts','--no-audit','--no-fund'],360000);
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
