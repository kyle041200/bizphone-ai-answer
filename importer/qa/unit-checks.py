"""Run named node:test cases directly so file-level aggregation cannot hide counts."""
from pathlib import Path
import subprocess,os,json,re
root=Path(__file__).resolve().parents[2];os.chdir(root);work=root/'importer/work';results=[]
files=['engine/test.mjs','engine/analysis.test.mjs','worker/policy.test.mjs','worker/output.test.mjs','worker/retry.test.mjs','worker/test.mjs']
for file in files:
 result=subprocess.run(['node','importer/'+file],env={**os.environ,**({'KGHQ_TEST_NETWORK':'1'}if file=='worker/test.mjs'else{})},text=True,capture_output=True)
 output=result.stdout+result.stderr;label=file.replace('/','-').replace('.mjs','');(work/(label+'-named.txt')).write_text(output)
 count=re.search(r'tests (\d+)',output);results.append({'file':file,'exitCode':result.returncode,'namedTestCount':int(count.group(1))if count else None})
 if result.returncode:print(output);raise SystemExit(result.returncode)
(work/'unit-results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
