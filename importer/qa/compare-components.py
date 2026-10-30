"""Consistent before/after source-visible text and screenshots.
Before: published engine snapshot + companion rc1. After: current engine + rc2.
Only the OLD QA site changes companion version; the final acceptance site stays rc2.
"""
from pathlib import Path
import os,subprocess
root=Path(__file__).resolve().parents[2];os.chdir(root)
for phase,version in [('before','0.5.0-rc1'),('after','0.5.0-rc2')]:
 env={**os.environ,'KGHQ_WP_URL':'http://localhost:8086','KGHQ_INSTALL_PLUGIN_SLUGS':'kghq-import-styles','KGHQ_STYLES_VERSION':version}
 print('INSTALL companion '+version,flush=True)
 with Path('importer/work/'+phase+'-companion-install.log').open('w')as log:subprocess.run(['node','importer/qa/install-plugins.mjs'],env=env,stdout=log,stderr=subprocess.STDOUT,check=True)
 print('CAPTURE '+phase,flush=True)
 with Path('importer/work/'+phase+'-component-comparison.log').open('w')as log:subprocess.run(['python3','importer/qa/recompare.py'],env={**env,'KGHQ_RECOMPARE_LABELS':phase+'-engine-a,'+phase+'-engine-b'},stdout=log,stderr=subprocess.STDOUT,check=True)
print('COMPONENT COMPARISON COMPLETED',flush=True)
