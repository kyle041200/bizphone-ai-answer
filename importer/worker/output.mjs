import postcss from '../engine/node_modules/postcss/lib/postcss.mjs';
import selectorParser from '../engine/node_modules/postcss-selector-parser/dist/index.js';
/** Validate untrusted runner output on the trusted host, before WordPress sees it. */
export function verifyCSSIsolation(page) {
 const scope=page.scope;if(!/^kghq-page-[a-f0-9]{12}$/.test(scope))throw Error('Invalid output CSS scope');
 if(typeof page.css!=='string'||Buffer.byteLength(page.css)>3*1024*1024)throw Error('Excessive output CSS');
 const root=postcss.parse(page.css),resolved=new WeakMap();let rules=0;
 root.walkAtRules(rule=>{
  if(!['media','supports','container','font-face','keyframes','-webkit-keyframes','property','starting-style'].includes(rule.name))throw Error('Unsupported output CSS at-rule');
  if((rule.name.endsWith('keyframes')||rule.name==='property')&&!rule.params.startsWith((rule.name==='property'?'--':'')+scope+'-'))throw Error('Unscoped CSS definition');
 });
 root.walkRules(rule=>{
  if(++rules>25000||rule.selector.length>65536)throw Error('Excessive CSS selector inventory');
  let keyframe=false;for(let p=rule.parent;p;p=p.parent)if(p.type==='atrule'&&p.name.endsWith('keyframes'))keyframe=true;
  if(keyframe){if(!/^(?:from|to|\d+(?:\.\d+)?%)(?:\s*,\s*(?:from|to|\d+(?:\.\d+)?%))*$/.test(rule.selector))throw Error('Invalid keyframe selector');return;}
  const canvas=`body.kghq-import-canvas:has(.${scope})`;
  if(rule.selector===canvas){if(rule.nodes.some(n=>n.type!=='decl'||n.prop!=='background-color'))throw Error('Invalid canvas declaration');return;}
  let ancestor=rule.parent;while(ancestor&&ancestor.type!=='rule')ancestor=ancestor.parent;
  const parents=ancestor?resolved.get(ancestor):null,selectors=[];
  selectorParser(ast=>ast.each(selector=>{
   if(!parents){selectors.push(selector.toString());return;}
   for(const parent of parents){const clone=selector.clone();let nesting=false;clone.walkNesting(node=>{nesting=true;node.replaceWith(...selectorParser().astSync(parent).first.nodes.map(n=>n.clone()));});selectors.push(nesting?clone.toString():parent+' '+clone.toString());if(selectors.length>256)throw Error('Excessive nested selectors');}
  })).processSync(rule.selector);
  for(const selector of selectors)selectorParser(ast=>ast.each(s=>{
   let firstCombinator=s.nodes.findIndex(n=>n.type==='combinator');if(firstCombinator<0)firstCombinator=s.nodes.length;
   const confined=nodes=>nodes.some(n=>n.type==='class'&&n.value===scope||n.type==='pseudo'&&[':where',':is'].includes(n.value)&&n.nodes?.length&&n.nodes.every(branch=>{const combinator=branch.nodes.findIndex(c=>c.type==='combinator');return combinator===-1&&confined(branch.nodes);}));
   if(!confined(s.nodes.slice(0,firstCombinator)))throw Error('CSS selector escapes page scope');
   if(firstCombinator<s.nodes.length&&!['','>'].includes(s.nodes[firstCombinator].value.trim()))throw Error('Root sibling CSS escapes page scope');
  })).processSync(selector);
  resolved.set(rule,selectors);
 });
 return true;
}
