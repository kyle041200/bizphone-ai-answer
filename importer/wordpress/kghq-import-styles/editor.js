/* global wp */
/* Mirror native block controls to the visual leaf hidden behind editor wrappers.
 * Values come exclusively from saved block attributes; no page-specific CSS. */
(() => {
 const tracked=new WeakMap(),observed=new WeakSet();let scheduled=false;
 const value=v=>typeof v==='string'?v.replace(/^var:preset\|([a-z-]+)\|([a-z0-9-]+)$/,'var(--wp--preset--$1--$2)'):v;
 function apply(){
  scheduled=false;const editor=wp.data.select('core/block-editor');if(!editor)return;
  const docs=[document,...[...document.querySelectorAll('iframe')].map(f=>{try{return f.contentDocument;}catch{return null;}}).filter(Boolean)];
  for(const doc of docs)if(!observed.has(doc)&&doc.body){observed.add(doc);new MutationObserver(schedule).observe(doc.body,{childList:true,subtree:true});}
  function walk(block){
   const a=block.attributes||{};
   if((a.className||'').includes('kghq-source-node'))for(const doc of docs){
    let el=doc.querySelector('[data-block="'+block.clientId+'"]');if(!el)continue;
    if(block.name==='core/button')el=el.querySelector('.wp-block-button__link')||el;
    if(block.name==='core/image')el=el.querySelector('img')||el;
    if(['core/button','core/image'].includes(block.name))for(const token of (a.className||'').split(/\s+/).filter(Boolean))el.classList.add(token);
    const styles={},s=a.style||{},l=a.layout||{};
    for(const [key,prop]of Object.entries({textColor:'color',backgroundColor:'background-color',borderColor:'border-color'}))if(a[key])styles[prop]='var(--wp--preset--color--'+a[key]+')';
    if(a.fontFamily)styles['font-family']='var(--wp--preset--font-family--'+a.fontFamily+')';
    if(a.fontSize)styles['font-size']='var(--wp--preset--font-size--'+a.fontSize+')';
    for(const [key,prop]of Object.entries({text:'color',background:'background-color',gradient:'background-image'}))if(s.color?.[key])styles[prop]=s.color[key];
    for(const [key,prop]of Object.entries({fontSize:'font-size',fontFamily:'font-family',fontWeight:'font-weight',lineHeight:'line-height',letterSpacing:'letter-spacing'}))if(s.typography?.[key])styles[prop]=s.typography[key];
    for(const dim of ['padding','margin'])if(s.spacing?.[dim]){if(typeof s.spacing[dim]==='string')styles[dim]=s.spacing[dim];else for(const [side,v]of Object.entries(s.spacing[dim]))styles[dim+'-'+side]=v;}
    if(s.border?.radius)styles['border-radius']=s.border.radius;
    if(a.align&&['left','right','center','justify'].includes(a.align))styles['text-align']=a.align;
    const gap=s.spacing?.blockGap;if(typeof gap==='string')styles.gap=gap;else if(gap){if(gap.top)styles['row-gap']=gap.top;if(gap.left)styles['column-gap']=gap.left;}
    if(l.type==='flex'){
     styles.display='flex';styles['flex-direction']=l.orientation==='vertical'?'column':'row';styles['flex-wrap']=l.flexWrap==='nowrap'?'nowrap':'wrap';
     const j={left:'flex-start',right:'flex-end',center:'center','space-between':'space-between'};if(j[l.justifyContent])styles['justify-content']=j[l.justifyContent];
     const v={top:'flex-start',bottom:'flex-end',center:'center',stretch:'stretch'};if(v[l.verticalAlignment])styles['align-items']=v[l.verticalAlignment];
    }
    if(l.type==='grid'){styles.display='grid';if(l.columnCount)styles['grid-template-columns']='repeat('+Math.max(1,Math.min(12,l.columnCount))+', minmax(0,1fr))';}
    if(block.name==='core/button'&&a.width)styles.width=a.width+'%';
    if(block.name==='core/image')for(const dim of ['width','height'])if(a[dim])styles[dim]=typeof a[dim]==='number'?a[dim]+'px':a[dim];
    for(const prop of tracked.get(el)||[])if(!(prop in styles))el.style.removeProperty(prop);
    for(const [prop,v]of Object.entries(styles))el.style.setProperty(prop,value(v));tracked.set(el,Object.keys(styles));
   }
   (block.innerBlocks||[]).forEach(walk);
  }
  editor.getBlocks().forEach(walk);
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(apply);}}
 wp.data.subscribe(schedule);window.addEventListener('load',schedule);schedule();
})();
