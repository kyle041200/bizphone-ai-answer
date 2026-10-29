// Runs only inside a network-disabled disposable container, with no credentials.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
const config=JSON.parse(process.env.KGHQ_CONVERSION_CONFIG);
const root=config.adapter==='static' ? await fs.realpath('/job/source/dist') : null;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.woff':'font/woff','.woff2':'font/woff2','.json':'application/json'};
const server=http.createServer(async(req,res)=>{
 try{
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=path.resolve(root,'.'+name);if(!file.startsWith(root+'/')&&file!==root)throw Error();
  const st=await fs.stat(file).catch(()=>null);
  if(!st?.isFile())file=path.join(root,'index.html');
  const real=await fs.realpath(file);if(!real.startsWith(root+'/'))throw Error();
  res.writeHead(200,{'Content-Type':mime[path.extname(real)]||'application/octet-stream'});res.end(await fs.readFile(real));
 }catch{res.writeHead(404);res.end();}
});
let vite;
if(config.adapter==='vite-dev') {
 vite=spawn(process.execPath,['/job/source/node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4173','--strictPort'],{cwd:'/job/source',stdio:'inherit',env:{...process.env,NODE_ENV:'development'}});
 let ready=false;
 for(let i=0;i<90;i++) {
  if(vite.exitCode!==null)throw Error('Vite renderer exited');
  try {const r=await fetch('http://127.0.0.1:4173');if(r.ok){ready=true;break;}}catch{}
  await new Promise(r=>setTimeout(r,1000));
 }
 if(!ready){vite.kill();throw Error('Vite renderer timed out');}
} else await new Promise(r=>server.listen(4173,'127.0.0.1',r));
try{
 const child=spawn(process.execPath,['/opt/kghq/engine/cli.mjs','--repo','/job/source','--repository',config.repository,'--url','http://127.0.0.1:4173','--routes',config.routes.join(','),'--out','/job/export','--chromium','/usr/bin/chromium',...(config.acceptInteractionLoss?['--accept-interaction-loss']:[]),...(config.allowMissingAssets?['--allow-missing-assets']:[]),...(config.allowMissingImages?['--allow-missing-images']:[])],{stdio:'inherit'});
 const code=await new Promise(r=>child.on('exit',r));if(code!==0)throw Error('Converter failed');
}finally{vite?.kill();server.close();}
