/** Retry dependency transport errors only, within one shared installation budget. */
export async function installWithRetry(run, { budget = 360000, now = Date.now, delay = ms => new Promise(r=>setTimeout(r,ms)) } = {}) {
 const end=now()+budget;
 for(let attempt=0;attempt<3;attempt++){
  const remaining=end-now();if(remaining<=0)throw Error('Dependency installation budget exhausted');
  try{return await run(Math.min(120000,remaining),attempt);}
  catch(error){const diagnostic=[error.code,error.message,error.stderr,error.stdout].join(' ');
   const transient=/E(?:408|429|500|502|503|504)|\b(?:ECONNRESET|ETIMEDOUT|EAI_AGAIN|KGHQ_INSTALL_TIMEOUT)\b|(?:status|response|HTTP)\s*:?\s*(?:408|429|500|502|503|504)/i.test(diagnostic);
   if(!transient||attempt===2||now()+1000>=end){if(transient)error.publicMessage='Dependency registry transport failed after bounded retries. Retry the dashboard later; existing pages were not changed.';throw error;}
   await delay(Math.min(1000*2**attempt,end-now()));
  }
 }
}
