"""Curate public deliverables. Never archive work/, cookies, credentials or dependencies."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED,ZipInfo
import json,hashlib,shutil,subprocess,os,zlib
root=Path(__file__).resolve().parents[2];project=root/'importer';work=project/'work';out=root/'kghq-downloads/acceptance-recovery';packages=out/'packages';evidence=out/'evidence';visual=out/'visual-evidence'
for d in [packages,evidence,visual]:d.mkdir(parents=True,exist_ok=True)
# Known generated staging secret is tested for absence, never printed or exported.
known_secret=json.loads((work/'staging-private.json').read_text())['token'].encode()
def public_file(p):
 return p.is_file()and not p.is_symlink()and not any(x in p.parts for x in ['node_modules','.git','work','dist','__pycache__'])and(p.name=='.env.example'or not p.name.startswith('.env'))and p.suffix not in ['.pyc']
def archive(file,entries):
 with ZipFile(file,'w',ZIP_DEFLATED)as z:
  for p,name in sorted(entries,key=lambda x:x[1]):
   data=p.read_bytes();assert known_secret not in data,str(p)
   info=ZipInfo(name,(2026,10,31,0,0,0));info.compress_type=ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,data)
 with ZipFile(file)as z:assert z.testzip()is None
for name in ['kghq-lovable-importer-0.5.0-rc1.zip','kghq-import-styles-0.5.0-rc3.zip','kghq-converter-0.5.0-rc1.zip']:shutil.copyfile(project/'dist'/name,packages/name)
for p in work.glob('*-named.txt'):shutil.copyfile(p,evidence/p.name)
for name in ['final-environment.json','unit-results.json','actual-runner-security.json','frontend-integrity.json','punctuation-results.json','editor-decoration-results.json','global-navigation-preservation.json','reference-availability.json','final-current-security-preservation.json','final-rc3-removal.log','verified-two-page-automation.json','verified-project-b-automation.json','final-preserve-project-b-automation.json','clean-install-results.json','clean-final-two-page-automation.json','clean-final-two-page-editor-results.json','clean-final-marketing-editor-results.json','verified-two-page-editor-parity.json','verified-project-b-editor-parity.json']:
 p=work/name
 if p.exists():shutil.copyfile(p,evidence/(name.removesuffix('.log')+'.txt'if p.suffix=='.log'else name))
for label in ['final-two-page','final-project-b','final-marketing','rc3-project-b','clean-final-two-page','clean-final-marketing']:
 for pattern in [label+'-editor-*.png',label+'-media-dialog.png',label+'-edited-preview.png']:
  for p in work.glob(pattern):shutil.copyfile(p,evidence/p.name)
for p in work.glob('theme-*.png'):shutil.copyfile(p,evidence/p.name)
for name in ['native-details-open.png','removal-plugin-list.png','removal-styled-preview.png','removal-editor.png','clean-final-two-page-selection.png','clean-final-two-page-result.png']:
 p=work/name
 if p.exists():shutil.copyfile(p,evidence/name)
# Only completed valid-reference captures are public. Invalid/failed iterations stay diagnostic.
labels=['before-engine-a','after-engine-a','before-engine-b','after-engine-b','verified-two-page','verified-project-b']
summary=[]
for label in labels:
 folder=work/'visual'/label;report=json.loads((folder/'report.json').read_text());capture=json.loads((folder/'capture.json').read_text())
 assert all(w['source']['sections']and w['source']['height']>1000 for p in capture['pages']for w in p['widths'])
 subprocess.run(['python3',str(project/'qa/gallery.py'),str(folder)],check=True)
 visual_zip=visual/('kghq-'+label+'-visual-evidence.zip')
 if os.environ.get('KGHQ_REUSE_VISUALS')=='1'and visual_zip.exists():
  with ZipFile(visual_zip)as z:
   # HTML may change independently; use a fresh archive if any entry differs.
   same=all(z.getinfo(label+'/'+p.name).CRC==zlib.crc32(p.read_bytes()) for p in folder.iterdir()if p.is_file())
  if not same:archive(visual_zip,[(p,label+'/'+p.name)for p in folder.iterdir()if p.is_file()])
 else:archive(visual_zip,[(p,label+'/'+p.name)for p in folder.iterdir()if p.is_file()])
 shutil.copyfile(folder/'report.json',evidence/(label+'-visual-report.json'))
 summary.append({'label':label,'conditions':report['conditions'],'results':[{'route':r['route'],'width':r['width'],'changedPixels':r['fullPage']['changedPixelsRGBDeltaAbove25Percent'],'localSSIM':r['fullPage']['localLuminanceSSIM16px'],'heightDelta':r['heightDelta'],'localQualityGoalMet':r['qualityGoalMet']}for r in report['results']]})
(evidence/'visual-summary.json').write_text(json.dumps(summary,indent=2))
# Public project analyses omit internal job keys and filesystem locations.
for repo,label in [('kyle041200/bizphone-ai-answer','source-a'),('GuidoPenta/TrackZilla','source-b')]:
 candidates=[]
 for p in(work/'worker-data').glob('*/job.json'):
  j=json.loads(p.read_text())
  if j.get('kind')=='scan'and j.get('status')=='ready'and j['repository']==repo:candidates.append(j)
 if candidates:
  j=max(candidates,key=lambda j:j['created']);(evidence/(label+'-project-analysis.json')).write_text(json.dumps({k:j[k]for k in ['repository','commit','ref','compatibility','pages','warnings']if k in j},indent=2))
# Controlled comparison fixtures are developer backups, not the customer workflow.
fixtures=[work/(label+'-bundle.json')for label in labels[:4]]
archive(out/'bundles/kghq-engine-comparison-fixtures.zip',[(p,p.name)for p in fixtures])
shutil.copyfile(project/'docs/FINAL-ACCEPTANCE.md',out/'FINAL-ACCEPTANCE.md')
# Independent worker and complete project source, without third-party dependencies.
sources=[p for p in project.rglob('*')if public_file(p)]
archive(packages/'kghq-importer-complete-source.zip',[(p,'kghq-lovable-importer-project/importer/'+str(p.relative_to(project)))for p in sources]+[(root/'.gitignore','kghq-lovable-importer-project/.gitignore')])
worker=[p for p in sources if p.relative_to(project).parts[0]in ['worker','engine','docs']or p.name=='.dockerignore']
worker_readme=out/'WORKER-PACKAGE.md'
worker_readme.write_text('# Worker source package\n\nFollow `importer/worker/README.md` inside the worker ZIP. Run commands from its\n`kghq-worker` root; the importer/engine and importer/worker layout is preserved.\nInstall locked engine dependencies once, build the runner, configure the private\nenvironment file, quotas and TLS, then connect WordPress. No customer-facing\nworker service is supplied by these files. Do not use the CLI per normal import.\n')
archive(packages/'kghq-conversion-worker-source.zip',[(p,'kghq-worker/importer/'+str(p.relative_to(project)))for p in worker]+[(worker_readme,'kghq-worker/README.md')])
# Validate all independent ZIPs and their decompressed entries for the known secret.
checks=[]
for p in out.rglob('*.zip'):
 with ZipFile(p)as z:
  assert z.testzip()is None
  for name in z.namelist():assert known_secret not in z.read(name),str(p)
 assert p.stat().st_size<95_000_000,'Split oversized independent ZIP before publishing: '+str(p)
 checks.append({'file':str(p.relative_to(out)),'bytes':p.stat().st_size,'zipReadable':True,'knownStagingBearerAbsent':True})
(out/'package-validation.json').write_text(json.dumps({'status':'PASS','checks':checks,'exclusions':'No work directories, node_modules, Git metadata, cookies, wp-config.php, private .env files or actual service credential files. Synthetic local-only QA defaults remain test data.','note':'Known generated staging bearer checked in decompressed entries; this is not an exhaustive secret-discovery audit.'},indent=2))
# Complete backup contains every current public deliverable plus complete source.
contents=[hashlib.sha256(p.read_bytes()).hexdigest()+'  '+str(p.relative_to(out))for p in sorted(out.rglob('*'))if p.is_file()and p.name not in ['SHA256SUMS.txt','CONTENTS-SHA256.txt','RECONSTRUCT.md']and not p.name.startswith('KGHQ-Lovable-Importer-Complete.zip')]
(out/'CONTENTS-SHA256.txt').write_text('\n'.join(contents)+'\n')
outputs=Path('/workspace/outputs');outputs.mkdir(exist_ok=True)
complete=outputs/'KGHQ-Lovable-Importer-Complete.zip'
entries=[(p,'KGHQ-Lovable-Importer-Complete/'+str(p.relative_to(out)))for p in out.rglob('*')if p.is_file()and not p.name.startswith('KGHQ-Lovable-Importer-Complete.zip.part')and not p.name.startswith('KGHQ-Lovable-Importer-Complete.zip')and p.name not in ['SHA256SUMS.txt','RECONSTRUCT.md']]
archive(complete,entries)
for old in out.glob('KGHQ-Lovable-Importer-Complete.zip.part*'):old.unlink()
if complete.stat().st_size<95_000_000:shutil.copyfile(complete,out/complete.name)
else:
 with complete.open('rb')as src:
  i=1
  while data:=src.read(94_000_000):(out/(complete.name+f'.part{i:03d}')).write_bytes(data);i+=1
fullhash=hashlib.sha256(complete.read_bytes()).hexdigest()
part_names=sorted(p.name for p in out.glob('KGHQ-Lovable-Importer-Complete.zip.part*'))
windows_command='copy /b '+'+'.join(part_names)+' KGHQ-Lovable-Importer-Complete.zip'
if part_names:
 check=hashlib.sha256()
 for name in part_names:
  with(out/name).open('rb')as f:
   while chunk:=f.read(1024*1024):check.update(chunk)
 assert check.hexdigest()==fullhash
(out/'RECONSTRUCT.md').write_text('''# Complete backup reconstruction

The complete ZIP is split only when needed to keep each GitHub file below 95 MB.
Download every part into one directory. Do not open individual parts as ZIPs.

macOS/Linux:

```sh
cat KGHQ-Lovable-Importer-Complete.zip.part* > KGHQ-Lovable-Importer-Complete.zip
shasum -a 256 KGHQ-Lovable-Importer-Complete.zip
```

Windows Command Prompt (use the actual part count shown in the folder):

```bat
'''+windows_command+'''
```

Or PowerShell for any part count:

```powershell
$output = [IO.File]::Create("KGHQ-Lovable-Importer-Complete.zip")
try {
  Get-ChildItem "KGHQ-Lovable-Importer-Complete.zip.part*" | Sort-Object Name | ForEach-Object {
    $inputFile = [IO.File]::OpenRead($_.FullName)
    try { $inputFile.CopyTo($output) } finally { $inputFile.Dispose() }
  }
} finally { $output.Dispose() }
Get-FileHash "KGHQ-Lovable-Importer-Complete.zip" -Algorithm SHA256
```

If a single complete ZIP is present, no reconstruction is necessary. The standalone
WordPress plugin ZIPs and bundle ZIPs never require reconstruction. The backup
contains nested evidence ZIPs; unzip the desired visual archive to open its HTML
gallery locally. Actual credentials and dependencies are intentionally excluded.

Complete ZIP SHA256: `'''+fullhash+'`\n')
sums=[]
for p in sorted(out.rglob('*')):
 if p.is_file()and p.name!='SHA256SUMS.txt':sums.append(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+str(p.relative_to(out)))
sums.append(fullhash+'  KGHQ-Lovable-Importer-Complete.zip [reconstructed]')
(out/'SHA256SUMS.txt').write_text('\n'.join(sums)+'\n')
for p in packages.glob('*.zip'):shutil.copyfile(p,outputs/p.name)
for p in (out/'bundles').glob('*.zip'):shutil.copyfile(p,outputs/p.name)
print(json.dumps({'completeBytes':complete.stat().st_size,'completeSHA256':fullhash,'independentZipCount':len(checks),'allReadable':True,'parts':[p.name for p in out.glob('KGHQ-Lovable-Importer-Complete.zip.part*')]},indent=2))
