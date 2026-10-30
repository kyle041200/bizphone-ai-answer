"""Unmasked pixel/section/DOM comparisons; no resizing or image registration."""
from pathlib import Path
from PIL import Image, ImageChops
import numpy as np
import json, sys, html, re
root=Path(sys.argv[1]);data=json.loads((root/'capture.json').read_text());rows=[];gallery=[]
def source_tag(element):
 # Native Paragraph/Group wrappers may change the HTML tag deliberately. The
 # converter preserves source tag identity as metadata on the rendered leaf.
 for token in element.get('classes','').split():
  if token.startswith('kghq-tag-'):return token.removeprefix('kghq-tag-').upper()
 return element['tag']
def text_key(element):
 text=element.get('textKey',element.get('text','')).replace('\u200b','')
 return re.sub(r'\s+','',text.translate(str.maketrans({'’':"'",'‘':"'",'“':'"','”':'"','–':'-','—':'--','…':'...'})))
def visible_text(element):
 return ' '.join(element['text'].replace('\u200b','').split())
def text_equivalent(source,target):
 a,b=text_key(source),text_key(target)
 return a==b or min(len(a),len(b))>=60 and (a.startswith(b) or b.startswith(a))
def native_equivalent(source,target):
 return source_tag(target)==source['tag'] or source['tag']=='BUTTON' and target['tag']=='SUMMARY'
def crop(image,box):
 x=max(0,int(box['x']));y=max(0,int(box['y']));return image.crop((x,y,min(image.width,int(box['x']+box['width']+.5)),min(image.height,int(box['y']+box['height']+.5))))
def compare(a,b,name):
 w=max(a.width,b.width);h=max(a.height,b.height)
 if not w or not h:return None
 ca=Image.new('RGB',(w,h),'white');cb=ca.copy();ca.paste(a,(0,0));cb.paste(b,(0,0))
 x=np.asarray(ca,dtype=np.float32);y=np.asarray(cb,dtype=np.float32);d=np.abs(x-y)
 # Local 16px tile luminance SSIM, reporting contrast/structure as well as RGB error.
 ss=[]
 for off in range(0,h,16):
  aa=x[off:off+16].mean(2);bb=y[off:off+16].mean(2)
  for left in range(0,w,16):
   p=aa[:,left:left+16];q=bb[:,left:left+16];u=p.mean();v=q.mean();va=p.var();vb=q.var();cov=((p-u)*(q-v)).mean();ss.append(float(((2*u*v+6.5025)*(2*cov+58.5225))/((u*u+v*v+6.5025)*(va+vb+58.5225))))
 ImageChops.difference(ca,cb).save(root/(name+'-diff.png'))
 overlay=Image.blend(ca,cb,.5);overlay.save(root/(name+'-overlay.png'))
 return {'changedPixelsRGBDeltaAbove25Percent':round(float((d.max(2)>25).mean()*100),3),'meanAbsoluteRGBError':round(float(d.mean()),3),'localLuminanceSSIM16px':round(float(np.mean(ss)),5),'sourceSize':[a.width,a.height],'importedSize':[b.width,b.height],'diff':name+'-diff.png','overlay':name+'-overlay.png'}
def causes(props):
 p=set(props);a=[]
 if p&{'display','grid-template-columns','flex-direction','flex-wrap','align-items','justify-content','gap'}:a.append('Layout mode, extra native wrappers or native Columns rules differ from source')
 if p&{'margin-top','margin-bottom','padding-top','padding-bottom','height'}:a.append('Theme/default block spacing or changed element height')
 if p&{'font-family','font-size','font-weight','line-height','letter-spacing'}:a.append('Font availability or inherited theme/block typography')
 if p&{'color','background-color','background-image','border-radius','box-shadow'}:a.append('Cascade/reset order, design-token resolution or theme component skin')
 if p&{'width','max-width','object-fit','object-position'}:a.append('Native image/button wrapper or theme container sizing')
 return a
for page in data['pages']:
 slug='home' if page['route']=='/' else page['route'].strip('/').replace('/','--')
 for v in page['widths']:
  width=v['width'];a=Image.open(root/v['source']['screenshot']).convert('RGB');b=Image.open(root/v['imported']['screenshot']).convert('RGB');name=f'{slug}-{width}-full'
  full=compare(a,b,name);sections=[]
  for i,s in enumerate(v['source']['sections']):
   candidates=[t for t in v['imported']['sections'] if t['title']==s['title']]
   t=candidates[0] if candidates else (v['imported']['sections'][i] if i<len(v['imported']['sections']) else None)
   if not t:sections.append({'title':s['title'],'status':'missing'});continue
   sa=crop(a,s['box']);sb=crop(b,t['box']);sa.save(root/s['screenshot']);sb.save(root/t['screenshot']);key=f'{slug}-{width}-section-{i}'
   pixels=compare(sa,sb,key);changes=[];text_mutations=[];unmatched=0;unmatched_elements=[];used=set()
   for element in s['elements']:
    candidates=[(n,e) for n,e in enumerate(t['elements']) if n not in used and native_equivalent(element,e) and text_equivalent(element,e)]
    if not candidates:unmatched+=1;unmatched_elements.append({'tag':element['tag'],'text':element['text'],'box':element['box']});continue
    def signature(el):return {c for c in el.get('classes','').split() if not c.startswith(('kghq-','wp-','has-','is-'))}
    n,e=max(candidates,key=lambda pair:len(signature(pair[1]) & signature(element)) / max(1,len(signature(pair[1]) | signature(element))));used.add(n)
    if element['tag'] not in ['SECTION','DIV'] and visible_text(element)!=visible_text(e):
     text_mutations.append({'sourceTag':element['tag'],'renderedTag':e['tag'],'source':element['text'],'imported':e['text'],'likelyCause':'WordPress typography/content filters or a native-block text mutation; review actual glyphs.'})
    props={p:{'source':value,'imported':e['styles'].get(p)} for p,value in element['styles'].items() if value!=e['styles'].get(p) and p not in ['height','width','grid-template-columns']}
    delta={k:round(e['box'][k]-element['box'][k],2) for k in ['x','y','width','height']}
    if props or any(abs(d)>1 for d in delta.values()):changes.append({'tag':element['tag'],'text':element['text'],'geometryDelta':delta,'styleDifferences':props,'likelyCauses':causes(props)})
   geo={k:round(t['box'][k]-s['box'][k],2) for k in ['x','y','width','height']}
   geometry_pass=all(abs(d)<=2 for d in geo.values())
   goal=bool(pixels and pixels['changedPixelsRGBDeltaAbove25Percent']<=5 and pixels['localLuminanceSSIM16px']>=.95 and geometry_pass and not unmatched and not text_mutations)
   sections.append({'index':i,'title':s['title'],'geometryDelta':geo,'pixels':pixels,'sourceScreenshot':s['screenshot'],'importedScreenshot':t['screenshot'],'unmatchedSourceElements':unmatched,'unmatchedElements':unmatched_elements,'elementDifferences':changes,'textMutations':text_mutations,'qualityGoalMet':goal})
   gallery.append(f'<section><h3>{html.escape(page["route"])} · {width}px · {html.escape(s["title"])}</h3><p>Changed pixels: {pixels["changedPixelsRGBDeltaAbove25Percent"] if pixels else "n/a"}% · section geometry Δ {geo} · {"PASS" if goal else "REVIEW"}</p><div><img loading="lazy" src="{s["screenshot"]}"><img loading="lazy" src="{t["screenshot"]}"><img loading="lazy" src="{pixels["diff"] if pixels else ""}"></div></section>')
  rows.append({'route':page['route'],'width':width,'fullPage':full,'heightDelta':v['imported']['height']-v['source']['height'],'scrollWidthDelta':v['imported']['scrollWidth']-v['source']['scrollWidth'],'sourceHorizontalOverflow':v['source']['scrollWidth']>width,'horizontalOverflow':v['imported']['scrollWidth']>width,'sourceMissingImages':v['source']['missingImages'],'importedMissingImages':v['imported']['missingImages'],'sourceFonts':v['source']['fonts'],'importedFonts':v['imported']['fonts'],'sections':sections,'qualityGoalMet':bool(sections) and all(s.get('qualityGoalMet',False) for s in sections) and full['changedPixelsRGBDeltaAbove25Percent']<=5 and full['localLuminanceSSIM16px']>=.95 and abs(v['imported']['height']-v['source']['height'])<=2 and abs(v['imported']['scrollWidth']-v['source']['scrollWidth'])<=2})
result={'label':data['label'],'conditions':data['conditions'],'semanticMatching':'Match source tag identity carried by kghq-tag-* metadata; native Details summary is the documented equivalent of its source disclosure button. Pair text after normalizing structural whitespace, smart punctuation and the documented zero-width RichText decorative-span marker; separately report actual visible punctuation mutations. Never erase pixel differences.', 'method':'Unmasked full-page and section RGB differences (any channel delta >25); 16px local luminance SSIM; DOM box and computed-style diffs. No scaling, registration, filtering or hidden-content masks.','internalGoal':'At least 95% pixels within RGB tolerance AND local SSIM >=0.95 AND section x/y/width/height within 2px AND no unmatched source elements AND no observed leaf-text mutations. Missing fonts/assets/interactions remain separate review blockers; similarity alone is not certification.','results':rows}
(root/'report.json').write_text(json.dumps(result,indent=2))
(root/'index.html').write_text('<!doctype html><meta charset="utf-8"><title>KGHQ visual regression</title><style>body{font:16px system-ui;margin:24px;background:#eee}section{background:white;padding:16px;margin:20px 0}section div{display:flex;gap:8px;align-items:start}img{width:32%;height:auto}p{overflow-wrap:anywhere}</style><h1>'+html.escape(data['label'])+' · Source / WordPress / pixel difference</h1><p>Full-page screenshots and machine-readable section/element findings are included alongside this gallery. See report.json for the combined quality gate and all unresolved differences.</p>'+''.join(gallery))
for row in rows:
 ranked=sorted([s for s in row['sections'] if s.get('pixels')],key=lambda s:s['pixels']['changedPixelsRGBDeltaAbove25Percent'],reverse=True)
 print(row['route'],row['width'],'full changed',row['fullPage']['changedPixelsRGBDeltaAbove25Percent'],'height Δ',row['heightDelta'],'worst',[(s['title'][:35],s['pixels']['changedPixelsRGBDeltaAbove25Percent']) for s in ranked[:3]])
