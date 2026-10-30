"""Controlled engine-only before/after comparison on the preserved QA site.
Customer end-to-end automation is tested separately on the clean final site.
"""
import os,subprocess,json
from pathlib import Path
root=Path(__file__).resolve().parents[2];os.chdir(root);work=root/'importer/work'
def step(label,cmd,env=None):
 print('START '+label,flush=True)
 with(work/(label+'.log')).open('w')as log:r=subprocess.run(cmd,env={**os.environ,**(env or {})},stdout=log,stderr=subprocess.STDOUT)
 if r.returncode:raise SystemExit(label+' failed; see log')
 print('PASS '+label,flush=True)
for project,repo,source,routes,folder in [('a','kyle041200/bizphone-ai-answer','http://localhost:5173','/business-support,/marketing','reference-a'),('b','GuidoPenta/TrackZilla','http://localhost:5175','/','cross-project')]:
 step('after-'+project+'-conversion',['node','importer/engine/cli.mjs','--repo',str(work/folder),'--repository',repo,'--url',source,'--routes',routes,'--chromium','/usr/bin/chromium','--out',str(work/('after-'+project+'-export')),'--accept-interaction-loss','--allow-missing-assets','--allow-missing-images'])
 for version in ['before','after']:
  label=version+'-engine-'+project;bundle=json.loads((work/(version+'-'+project+'-export')/'bundle.json').read_text())
  for p in bundle['pages']:p['sourceRoute']=p['route'];p['route']='/qa-'+version+(p['route']if p['route']!='/'else'/home');p['title']='QA '+version+' engine: '+p['title']
  file=work/(label+'-bundle.json');file.write_text(json.dumps(bundle))
  step(label+'-stage',['node','importer/qa/stage.mjs',str(file),label])
  step(label+'-capture',['node','importer/qa/capture.mjs',label],{'KGHQ_WP_URL':'http://localhost:8086','KGHQ_SOURCE_URL':source})
  step(label+'-report',['python3','importer/qa/report.py',str(work/'visual'/label)])
  step(label+'-parity',['node','importer/qa/editor-parity.mjs',label],{'KGHQ_WP_URL':'http://localhost:8086'})
print('ENGINE COMPARISON COMPLETED',flush=True)
