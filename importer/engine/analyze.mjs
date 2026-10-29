import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import postcss from 'postcss';
import {scan} from './scan.mjs';
const assetPattern=/\.(?:png|jpe?g|gif|webp|svg|avif|woff2?|ttf|otf|mp4|webm)$/i;
const safeValue=value=>/gh[pousr]_[A-Za-z0-9]{25,}|github_pat_|-----BEGIN .*PRIVATE KEY/.test(value)?'[redacted credential-like value]':value.replace(/https?:\/\/[^\s"')]+/g,url=>{try{const u=new URL(url);return u.origin+u.pathname;}catch{return '[external URL]';}});
/** Static project analysis only: never imports/evaluates repository code/config. */
export async function analyze(repository){
 const root=path.resolve(repository),files=[],assets=[],components=[],integrations=[],interactions=[],tokens=[],fonts=[],variants=[],imports=[],missingAssets=[],warnings=[];
 let total=0;
 const {projectFiles}=await import("./files.mjs");
 for(const file of await projectFiles(root)){
   const rel=path.relative(root,file);if(assetPattern.test(file))assets.push(rel);
   if(/\.(?:[cm]?[jt]sx?|css|json)$/.test(file)){const st=await fs.stat(file);total+=st.size;if(st.size>2*1024*1024||total>30*1024*1024||files.length>10000){warnings.push('Source analysis limit reached; inventory may be incomplete.');continue;}files.push({file,rel});}
 }
 let pkg={};try{pkg=JSON.parse(await fs.readFile(path.join(root,'package.json'),'utf8'));}catch{warnings.push('No readable root package.json; framework/build detection is incomplete.');}
 const dependencies={...pkg.dependencies,...pkg.devDependencies};
 const complexPackages=Object.keys(dependencies).filter(n=>/recharts|chart.js|@nivo|three|leaflet|mapbox|@dnd-kit|firebase|supabase|stripe/.test(n));
 const frameworks=Object.keys(dependencies).filter(n=>['react','vite','react-router','react-router-dom','@tanstack/react-router','@tanstack/react-start','tailwindcss','@tailwindcss/vite','class-variance-authority','next'].includes(n)).map(name=>({name,version:dependencies[name]}));
 const aliases=[];
 for(const name of ['tsconfig.json','tsconfig.app.json','jsconfig.json'])try{const raw=await fs.readFile(path.join(root,name),'utf8'),cfg=ts.parseConfigFileTextToJson(name,raw).config;for(const [key,values]of Object.entries(cfg?.compilerOptions?.paths||{}))for(const value of values)aliases.push([key.replace(/\*$/,''),value.replace(/\*$/,'')]);}catch{}
 const resolve=async(spec,file)=>{
  let target;if(spec.startsWith('.'))target=path.resolve(path.dirname(file),spec);else if(spec.startsWith('/'))target=path.resolve(root,'public',spec.slice(1));else{const alias=aliases.find(([key])=>spec.startsWith(key));if(alias)target=path.resolve(root,alias[1],spec.slice(alias[0].length));}
  if(!target||!target.startsWith(root+path.sep))return null;
  return await fs.access(target).then(()=>true,()=>false);
 };
 for(const {file,rel}of files){const text=await fs.readFile(file,'utf8');
  if(rel.endsWith('.css')){try{const css=postcss.parse(text);
   css.walkDecls(d=>{if(d.prop.startsWith('--'))tokens.push({name:d.prop,value:/secret|password|token|api.?key/i.test(d.prop)?'[redacted]':safeValue(d.value),selector:d.parent.selector||':root',file:rel});});
   css.walkAtRules('font-face',r=>{const face={file:rel};r.walkDecls(d=>{if(['font-family','font-weight','font-style','src'].includes(d.prop))face[d.prop]=safeValue(d.value);});fonts.push(face);});
   css.walkAtRules('media',r=>tokens.push({type:'breakpoint',condition:r.params,file:rel}));
   css.walkAtRules('import',r=>{if(/https?:/.test(r.params))warnings.push('External stylesheet/font import requires rendered availability check: '+safeValue(r.params));});
  }catch{warnings.push('Could not parse CSS: '+rel);}continue;}
  if(!/\.[jt]sx?$/.test(rel))continue;
  const ast=ts.createSourceFile(rel,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
  const eventNames=new Set(),hooks=new Set(),external=new Set(),unsupportedTags=new Set();
  const literals=(n,result=[])=>{if(ts.isStringLiteralLike(n))result.push(n.text);else ts.forEachChild(n,c=>literals(c,result));return result;};
  const literalValue=n=>{
    if(ts.isStringLiteralLike(n)||ts.isNumericLiteral(n))return n.text;
    if(ts.isArrayLiteralExpression(n))return n.elements.map(literalValue);
    if(ts.isObjectLiteralExpression(n))return Object.fromEntries(n.properties.filter(ts.isPropertyAssignment).map(p=>[p.name.getText(ast).replace(/["']/g,''),literalValue(p.initializer)]));
    return '[computed value: use compiled CSS/rendered audit]';
  };
  function visit(n){
   if(ts.isJsxOpeningElement(n)||ts.isJsxSelfClosingElement(n)){const tag=n.tagName.getText(ast);if(['iframe','canvas','video','audio','form','input','select','textarea'].includes(tag))unsupportedTags.add(tag);}
   if(/tailwind\.config\./.test(rel)&&ts.isPropertyAssignment(n)&&['colors','spacing','fontFamily','fontSize','screens','boxShadow','borderRadius','container'].includes(n.name.getText(ast)))tokens.push({type:'tailwind-config',name:n.name.getText(ast),value:literalValue(n.initializer),file:rel});
   if(ts.isImportDeclaration(n)&&ts.isStringLiteral(n.moduleSpecifier))imports.push({file:rel,source:n.moduleSpecifier.text,names:[n.importClause?.name?.text,...(n.importClause?.namedBindings&&ts.isNamedImports(n.importClause.namedBindings)?n.importClause.namedBindings.elements.map(e=>e.propertyName?.text||e.name.text):[])].filter(Boolean)});
   if(ts.isFunctionDeclaration(n)&&n.name&&/^[A-Z]/.test(n.name.text))components.push({name:n.name.text,file:rel,kind:'function'});
   if(ts.isVariableDeclaration(n)&&ts.isIdentifier(n.name)&&/^[A-Z]/.test(n.name.text)&&n.initializer&&(ts.isArrowFunction(n.initializer)||ts.isFunctionExpression(n.initializer)||(ts.isCallExpression(n.initializer)&&/(?:^|\.)(?:forwardRef|memo)$/.test(n.initializer.expression.getText(ast)))))components.push({name:n.name.text,file:rel,kind:'function-expression'});
   if(ts.isJsxAttribute(n)&&/^on[A-Z]/.test(n.name.getText(ast)))eventNames.add(n.name.getText(ast));
   if(ts.isCallExpression(n)){
    const callee=n.expression.getText(ast);
    if(/^use[A-Z]/.test(callee))hooks.add(callee);
    if(/(?:^|\.)(?:fetch|createClient|signIn|signUp|invoke|mutate|subscribe)$/.test(callee)||/supabase|stripe|firebase|WebSocket/i.test(callee))external.add(callee.slice(0,100));
    if(callee==='cva'&&n.arguments[1]&&ts.isObjectLiteralExpression(n.arguments[1])){const definition=n.arguments[1].properties.find(p=>ts.isPropertyAssignment(p)&&p.name.getText(ast)==='variants');if(definition&&ts.isObjectLiteralExpression(definition.initializer))for(const option of definition.initializer.properties)if(ts.isPropertyAssignment(option)&&ts.isObjectLiteralExpression(option.initializer))variants.push({file:rel,axis:option.name.getText(ast),values:option.initializer.properties.filter(ts.isPropertyAssignment).map(v=>({name:v.name.getText(ast),classes:literals(v.initializer).map(safeValue)}))});}
   }
   ts.forEachChild(n,visit);
  }visit(ast);
  if(eventNames.size||[...hooks].some(n=>/State|Effect|Query|Mutation|Form/.test(n)))interactions.push({file:rel,events:[...eventNames],hooks:[...hooks],handling:'Requires rendered semantic adapter or explicit WordPress integration; arbitrary React handlers are not transferred.'});
  if(unsupportedTags.size)integrations.push({file:rel,elements:[...unsupportedTags],handling:'Requires a WordPress integration or custom visual block; export does not implement this functionality.'});
  if(external.size)integrations.push({file:rel,calls:[...external],environmentVariableNames:[...text.matchAll(/(?:import\.meta\.env|process\.env)\.([A-Z][A-Z0-9_]*)/g)].map(m=>m[1]),handling:'Server/client integration must be reimplemented in WordPress; credentials are not extracted.'});
  for(const i of imports.filter(i=>i.file===rel&&assetPattern.test(i.source)))if(await resolve(i.source,file)===false)missingAssets.push({file:rel,reference:i.source});
  for(const match of text.matchAll(/\bsrc\s*=\s*["'](\/[^"']+)["']/g))if(assetPattern.test(match[1])&&await resolve(match[1],file)===false)missingAssets.push({file:rel,reference:match[1]});
 }
 const routes=await scan(root);
 const usage=components.map(c=>({...c,importedBy:[...new Set(imports.filter(i=>i.names.includes(c.name)).map(i=>i.file))]}));
 const shared=usage.filter(c=>c.importedBy.length>1||/layout|header|footer|nav|template/i.test(c.name));
 return {schemaVersion:1,analysisVersion:'0.3.0',frameworks,routing:{systems:[dependencies['react-router-dom']||dependencies['react-router']?'React Router':null,dependencies['@tanstack/react-router']?'TanStack Router':null].filter(Boolean),pages:routes.routes,dynamicAndUnresolvedRoutes:routes.warnings},build:{scripts:Object.keys(pkg.scripts||{}),lockfiles:(await fs.readdir(root)).filter(n=>/^(?:package-lock\.json|bun\.lockb?|pnpm-lock\.yaml|yarn\.lock)$/.test(n)),execution:'Analysis does not execute build/config/source code. Conversion requires a trusted rendered source URL.'},components:{inventory:usage,sharedLayoutsAndNavigation:shared,nativeCandidates:['headings','paragraphs and inline text','images','buttons/links','groups with exact flex/grid CSS','lists','native Details/accessibility-linked disclosures'],customBlockCandidates:['linked layout/card → KGHQ Linked Layout with native child blocks',...complexPackages.map(n=>n+' component → inspect data/interaction requirements; no automatic functional conversion is claimed')],heuristicNotice:'Component naming/import frequency suggests shared layouts; it does not certify runtime behavior.'},design:{tokens,fonts,componentVariants:variants,tailwindConfigFiles:files.filter(f=>/tailwind\.config\./.test(f.rel)).map(f=>f.rel),shadcnDetected:files.some(f=>f.rel==='components.json')||Object.keys(dependencies).some(n=>n.startsWith('@radix-ui/')),runtime:'Compiled CSS/CSS variables, media queries and actual rendered typography are authoritative. Missing/cross-origin fonts must be reported; no styles are inferred from a previous project.'},assets:{inventory:assets,missingStaticReferences:missingAssets,renderedCheckRequired:true},interactions,integrations,limitations:['Computed/rendered state does not contain content fetched only after user actions, auth or other application states.','Unknown interactions are not implemented as a React embed. Acknowledgment is required for a static-content export.','Raster SVG icons cannot preserve dynamic stroke/fill changes unless separately integrated.','Source live font/asset availability and per-theme/editor fidelity require rendered QA.'],requiresInteractionAcknowledgment:interactions.length>0||integrations.length>0,warnings:[...new Set(warnings)],status:'static-analysis-only; rendered compatibility and visual QA are required before publishing'};
}
