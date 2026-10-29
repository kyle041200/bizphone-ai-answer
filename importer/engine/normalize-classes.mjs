import crypto from 'node:crypto';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import {parse,serialize} from './blocks.mjs';
// WordPress sanitizes ampersands inside className block attributes. Rename those
// utility tokens in both native blocks and CSS rather than weakening WP validation.
export async function normalizeClasses(content,css) {
 const names=new Map();
 const token = name => {
  if(!name.includes('&'))return name;
  if(!names.has(name))names.set(name,'kghq-utility-'+crypto.createHash('sha256').update(name).digest('hex').slice(0,16));
  return names.get(name);
 };
 const classes=value=>value.split(/\s+/).map(token).join(' ');
 const inline=value=>value.replace(/class="([^"]*)"/g,(_,raw)=>'class="'+classes(raw.replaceAll('&amp;','&')).replaceAll('&','&amp;').replaceAll('"','&quot;')+'"');
 const blocks=parse(content);
 function walk(block){
  if(block.attributes.className)block.attributes.className=classes(block.attributes.className);
  for(const name of ['content','text','summary'])if(typeof block.attributes[name]==='string')block.attributes[name]=inline(block.attributes[name]);
  block.innerBlocks.forEach(walk);
 }
 blocks.forEach(walk);
 const root=postcss.parse(css);
 root.walkRules(rule=>{
  rule.selector=selectorParser(selectors=>selectors.walkClasses(node=>{const mapped=token(node.value);if(mapped!==node.value)node.value=mapped;})).processSync(rule.selector);
 });
 return {content:serialize(blocks),css:root.toString()};
}
