import fs from 'node:fs/promises';import path from 'node:path';import {execFile} from 'node:child_process';import{promisify}from'node:util';
const exec=promisify(execFile);
const excluded=name=>['node_modules','.git','dist','.output','.next','coverage','.npmrc','.netrc','.git-credentials'].includes(name)||/^\.env(?:\.|$)/.test(name);
export async function projectFiles(repo){
 const root=path.resolve(repo);let tracked;
 try{const {stdout:top}=await exec('git',['-C',root,'rev-parse','--show-toplevel'],{timeout:5000});if(path.resolve(top.trim())===root){const{stdout}=await exec('git',['-C',root,'ls-files','-z'],{timeout:5000,maxBuffer:16*1024*1024});tracked=stdout.split('\0').filter(Boolean);}}catch{}
 const files=[];
 if(tracked){for(const name of tracked){if(name.split('/').some(excluded))continue;const file=path.resolve(root,name);const st=await fs.lstat(file).catch(()=>null);if(st?.isFile()&&!st.isSymbolicLink())files.push(file);}return files;}
 async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){if(excluded(e.name)||e.isSymbolicLink())continue;const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else if(e.isFile())files.push(p);}}await walk(root);return files;
}
