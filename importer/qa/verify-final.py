"""Post-edit preservation, explicit QA-only regeneration, then valid visual baseline.
Run only after clean-site imports and independent editing have been recorded.
"""
import os,json,time,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[2];os.chdir(root);work=root/'importer/work';env={**os.environ,'KGHQ_WP_URL':'http://localhost:8087','KGHQ_WP_CONTAINER':'kghq-final-wp'}
precondition=work/'final-preserve-two-page-automation.json';deadline=time.monotonic()+1800
while not precondition.exists():
 if time.monotonic()>deadline:raise SystemExit('Missing preservation test result')
 time.sleep(1)
r=json.loads(precondition.read_text());assert r['workflow']=='PASS'and r['unapprovedExistingPagesUnchanged'],r
steps=[
 ('final-preserve-project-b',['node','importer/qa/automation.mjs'],{'KGHQ_TEST_LABEL':'final-preserve-project-b','KGHQ_EXPECT_STATUS':'preserved'}),
 ('verified-two-page',['node','importer/qa/automation.mjs'],{'KGHQ_TEST_REPOSITORY':'kyle041200/bizphone-ai-answer','KGHQ_TEST_ROUTES':'/business-support,/marketing','KGHQ_TEST_LABEL':'verified-two-page','KGHQ_ALLOW_MISSING_IMAGES':'1','KGHQ_TEST_REPLACE':'1'}),
 ('verified-project-b',['node','importer/qa/automation.mjs'],{'KGHQ_TEST_LABEL':'verified-project-b','KGHQ_TEST_REPLACE':'1'}),
 ('verified-two-page-capture',['node','importer/qa/capture.mjs','verified-two-page'],{}),
 ('verified-two-page-report',['python3','importer/qa/report.py','importer/work/visual/verified-two-page'],{}),
 ('verified-project-b-capture',['node','importer/qa/capture.mjs','verified-project-b'],{'KGHQ_SOURCE_URL':'http://localhost:5175'}),
 ('verified-project-b-report',['python3','importer/qa/report.py','importer/work/visual/verified-project-b'],{}),
 ('verified-two-page-parity',['node','importer/qa/editor-parity.mjs','verified-two-page'],{}),
 ('verified-project-b-parity',['node','importer/qa/editor-parity.mjs','verified-project-b'],{}),
]
results=[]
for label,cmd,extra in steps:
 print('START '+label,flush=True)
 with(work/(label+'.log')).open('w')as log:r=subprocess.run(cmd,env={**env,**extra},stdout=log,stderr=subprocess.STDOUT)
 results.append({'step':label,'exitCode':r.returncode});(work/'verified-suite-results.json').write_text(json.dumps(results,indent=2));print(('PASS 'if r.returncode==0 else'FAIL ')+label,flush=True)
 if r.returncode:raise SystemExit(r.returncode)
print('VERIFICATION COMPLETED',flush=True)
