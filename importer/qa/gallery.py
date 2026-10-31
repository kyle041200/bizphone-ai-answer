"""Standalone full-page and section side-by-side gallery; no remote resources."""
from pathlib import Path
import json,html,sys
folder=Path(sys.argv[1]);report=json.loads((folder/'report.json').read_text());capture=json.loads((folder/'capture.json').read_text());cards=[]
def panel(files):return '<div class="images">'+''.join('<a href="'+html.escape(f,quote=True)+'" target="_blank"><img loading="lazy" src="'+html.escape(f,quote=True)+'"></a>'for f in files)+'</div>'
for row in report['results']:
 page=next(p for p in capture['pages']if p['route']==row['route']);view=next(w for w in page['widths']if w['width']==row['width']);cards.append('<section><h2>'+html.escape(row['route'])+' · '+str(row['width'])+'px</h2><p>Source / WordPress / RGB difference. Changed pixels: '+str(row['fullPage']['changedPixelsRGBDeltaAbove25Percent'])+'%. Local gate: '+('PASS'if row['qualityGoalMet']else'REVIEW')+'.</p>'+panel([view['source']['screenshot'],view['imported']['screenshot'],row['fullPage']['diff']]))
 for s in row['sections']:
  if s.get('pixels'):cards.append('<details><summary>'+html.escape(s['title'])+' · '+str(s['pixels']['changedPixelsRGBDeltaAbove25Percent'])+'% changed · '+('PASS'if s['qualityGoalMet']else'REVIEW')+'</summary>'+panel([s['sourceScreenshot'],s['importedScreenshot'],s['pixels']['diff']])+'</details>')
 cards.append('</section>')
(folder/'index.html').write_text('<!doctype html><meta charset="utf-8"><title>KGHQ visual evidence</title><style>body{font:16px system-ui;background:#eee;margin:24px}section{padding:20px;margin:24px 0;background:white}.images{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;align-items:start}.images img{width:100%;height:auto}details{margin:16px 0}summary{cursor:pointer}a{overflow-wrap:anywhere}</style><h1>'+html.escape(report['label'])+'</h1><p>Raw screenshots are not rescaled for measurement; thumbnails below scale only for viewing. Click an image to inspect original pixels. Missing fonts/assets and unsupported functions are separate blockers. See <a href="report.json">report.json</a> for the method and all findings.</p>'+''.join(cards))
