"""Sequential staging acceptance: imports, untouched visual baseline, then editing.
Requires the disposable WordPress site and credential-free source renderers.
No source code/build scripts run on this host. Evidence stays in ignored work/.
"""
import os, subprocess, json
from pathlib import Path
root=Path(__file__).resolve().parents[2];os.chdir(root)
work=root/'importer/work';env=os.environ.copy();env.setdefault('KGHQ_WP_URL','http://localhost:8087');env.setdefault('KGHQ_WP_CONTAINER','kghq-final-wp')
source_ip=lambda name:subprocess.check_output(['docker','inspect','--format','{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}',name],text=True).strip()
env.setdefault('KGHQ_SOURCE_URL','http://localhost:5173')
source_b='http://localhost:5175'
steps=[
 ('final-two-page-import',['node','importer/qa/automation.mjs'],{'KGHQ_TEST_REPOSITORY':'kyle041200/bizphone-ai-answer','KGHQ_TEST_ROUTES':'/business-support,/marketing','KGHQ_TEST_LABEL':'final-two-page','KGHQ_ALLOW_MISSING_IMAGES':'1'}),
 ('final-project-b-import',['node','importer/qa/automation.mjs'],{'KGHQ_TEST_LABEL':'final-project-b'}),
 ('final-two-page-capture',['node','importer/qa/capture.mjs','final-two-page'],{}),
 ('final-two-page-report',['python3','importer/qa/report.py','importer/work/visual/final-two-page'],{}),
 ('final-project-b-capture',['node','importer/qa/capture.mjs','final-project-b'],{'KGHQ_SOURCE_URL':source_b}),
 ('final-project-b-report',['python3','importer/qa/report.py','importer/work/visual/final-project-b'],{}),
 ('final-two-page-parity',['node','importer/qa/editor-parity.mjs','final-two-page'],{}),
 ('final-project-b-parity',['node','importer/qa/editor-parity.mjs','final-project-b'],{}),
 ('final-two-page-editing',['node','importer/qa/editor.mjs','final-two-page'],{}),
 ('final-project-b-editing',['node','importer/qa/editor.mjs','final-project-b'],{}),
]
resume=os.environ.get('KGHQ_ACCEPTANCE_FROM')
if resume:steps=steps[next(i for i,s in enumerate(steps)if s[0]==resume):]
results=[]
for label,cmd,extra in steps:
 print('START '+label,flush=True)
 with (work/(label+'.log')).open('w') as log:r=subprocess.run(cmd,env={**env,**extra},stdout=log,stderr=subprocess.STDOUT)
 results.append({'step':label,'exitCode':r.returncode});(work/'final-suite-results.json').write_text(json.dumps(results,indent=2));print(('PASS ' if r.returncode==0 else 'FAIL ')+label,flush=True)
 if r.returncode:raise SystemExit(r.returncode)
print('SUITE COMPLETED',flush=True)
