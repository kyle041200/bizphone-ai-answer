"""Inspect actual worker job containers, not a separate imitation sandbox."""
import subprocess,json,time
from pathlib import Path
observed=[];deadline=time.monotonic()+300
while time.monotonic()<deadline:
 ids=subprocess.check_output(['docker','ps','--filter','name=kghq-convert-','--format','{{.Names}}'],text=True).splitlines()
 for name in ids:
  try:
   data=json.loads(subprocess.check_output(['docker','inspect',name],text=True))[0];host=data['HostConfig'];ident=name.removeprefix('kghq-convert-');job=json.loads(Path('importer/work/worker-data',ident,'job.json').read_text());phase=job.get('phase')
   record={'container':name,'phase':phase,'readOnlyRootfs':host['ReadonlyRootfs'],'user':data['Config']['User'],'capDrop':host['CapDrop'],'securityOpt':host['SecurityOpt'],'memoryBytes':host['Memory'],'cpuNano':host['NanoCpus'],'pidsLimit':host['PidsLimit'],'tmpfs':host['Tmpfs'],'mounts':[{'destination':m['Destination'],'readWrite':m['RW'],'type':m['Type']}for m in data['Mounts']],'connectedNetworks':list(data['NetworkSettings']['Networks']),'forbiddenCredentialNamesPresent':[e.split('=',1)[0]for e in data['Config']['Env']if e.split('=',1)[0]in ['KGHQ_WORKER_TOKEN','KGHQ_GITHUB_TOKEN','GITHUB_TOKEN','AWS_SECRET_ACCESS_KEY']]}
   record['checksPassed']=host['ReadonlyRootfs'] and host['Memory']==4*1024**3 and host['PidsLimit']==256 and 'ALL'in host['CapDrop'] and not record['forbiddenCredentialNamesPresent'] and not any(m['readWrite'] for m in record['mounts']) and (phase not in ['building','converting']or not record['connectedNetworks'])
   if not any(o['container']==name and o['phase']==phase for o in observed):observed.append(record)
   if phase=='converting' and not record['connectedNetworks']:
    code="const fs=require('fs');let blocked=false;try{fs.writeFileSync('/__kghq_qa_probe','probe')}catch(e){blocked=e.code==='EROFS'||e.code==='EACCES'}fs.writeFileSync('/job/qa-probe','probe');fs.unlinkSync('/job/qa-probe');if(!blocked)process.exit(1);console.log('root-write-blocked; bounded-job-write-works')"
    probe=subprocess.run(['docker','exec',name,'node','-e',code],capture_output=True,text=True,timeout=10);record['filesystemProbe']={'exitCode':probe.returncode,'result':probe.stdout.strip()};record['checksPassed']=record['checksPassed']and probe.returncode==0
    Path('importer/work/actual-runner-security.json').write_text(json.dumps({'status':'PASS'if observed and all(x['checksPassed']for x in observed)else'FAIL','observations':observed,'limits':'Container configuration and filesystem probes only; not a kernel escape audit or host-clone disk/inode quota certification.'},indent=2));raise SystemExit(0)
  except (subprocess.CalledProcessError,FileNotFoundError):pass
 time.sleep(1)
Path('importer/work/actual-runner-security.json').write_text(json.dumps({'status':'PARTIAL','observations':observed,'reason':'No converting-phase container observed before deadline'},indent=2))
