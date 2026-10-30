// All source execution stays in a credential-free disposable container.
import fs from 'node:fs';import{spawn}from'node:child_process';
fs.cpSync('/opt/source','/job/source',{recursive:true});process.chdir('/job/source');
const args=process.env.KGHQ_QA_ADAPTER==='vite-dev'?['/job/source/node_modules/vite/bin/vite.js','--host','0.0.0.0','--port','5173','--strictPort']:['/opt/qa/server.mjs'];
const child=spawn(process.execPath,args,{stdio:'inherit'});for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));child.on('exit',code=>process.exit(code??1));
