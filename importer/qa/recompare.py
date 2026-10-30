"""Recompare unchanged engine fixtures after capture/matcher corrections."""
import os,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[2];os.chdir(root)
labels=os.environ.get('KGHQ_RECOMPARE_LABELS','before-engine-a,after-engine-a,before-engine-b,after-engine-b').split(',')
start=os.environ.get('KGHQ_RECOMPARE_FROM')
if start:labels=labels[labels.index(start):]
for label in labels:
 env={**os.environ,'KGHQ_WP_URL':'http://localhost:8086','KGHQ_SOURCE_URL':'http://localhost:'+('5175'if label.endswith('-b')else'5173')}
 for suffix,cmd in [('capture',['node','importer/qa/capture.mjs',label]),('report',['python3','importer/qa/report.py','importer/work/visual/'+label])]:
  print('START '+label+'-'+suffix,flush=True)
  with Path('importer/work/'+label+'-'+suffix+'.log').open('w')as log:r=subprocess.run(cmd,env=env,stdout=log,stderr=subprocess.STDOUT)
  if r.returncode:raise SystemExit('Failed '+label+' '+suffix)
  print('PASS '+label+'-'+suffix,flush=True)
print('RECOMPARISON COMPLETED',flush=True)
