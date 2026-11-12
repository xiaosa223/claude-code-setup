import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,readFileSync,readdirSync,lstatSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const skill=join(root,'skills','claude-code-setup');
const temporary=mkdtempSync(join(tmpdir(),'claude-code-skill-install-'));
const source=process.argv.includes('--remote')?'xiaosa223/claude-code-setup':root;
const env=Object.fromEntries(Object.entries(process.env).filter(([key])=>!/(?:TOKEN|SECRET|PASSWORD|PRIVATE_KEY)/i.test(key)));
Object.assign(env,{HOME:temporary,USERPROFILE:temporary,XDG_CONFIG_HOME:join(temporary,'.config'),npm_config_cache:join(temporary,'npm-cache'),DO_NOT_TRACK:'1',DISABLE_TELEMETRY:'1',SKILL_INSTALL_SOURCE:source});
function verify(source,destination){
  assert(!lstatSync(destination).isSymbolicLink());
  let count=0;
  for(const entry of readdirSync(source,{withFileTypes:true})){
    if(entry.name==='__pycache__'||entry.name.endsWith('.pyc'))continue;
    const a=join(source,entry.name),b=join(destination,entry.name);
    if(entry.isDirectory())count+=verify(a,b);
    else{assert(!lstatSync(b).isSymbolicLink());assert.deepEqual(readFileSync(a),readFileSync(b));count++;}
  }
  return count;
}
try{
  const args=['--yes','skills@1.7.2','add',source,'--skill','claude-code-setup','--agent','claude-code','--global','--copy','--yes'];
  const result=process.platform==='win32'?spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-Command','& npx.cmd --yes skills@1.7.2 add $env:SKILL_INSTALL_SOURCE --skill claude-code-setup --agent claude-code --global --copy --yes; exit $LASTEXITCODE'],{cwd:temporary,env,encoding:'utf8',timeout:180000}):spawnSync('npx',args,{cwd:temporary,env,encoding:'utf8',timeout:180000});
  assert.equal(result.status,0,result.stderr||result.stdout||String(result.error));
  const destination=[join(temporary,'.claude','skills','claude-code-setup'),join(temporary,'.agents','skills','claude-code-setup')].find(path=>existsSync(path));
  assert(destination,result.stdout);
  const count=verify(skill,destination);
  console.log(JSON.stringify({status:'passed',source,agent:'claude-code',installationTarget:destination.replace(temporary,'<isolated-home>'),installedFilesVerified:count,deploymentExecuted:false,isolatedHome:true},null,2));
}finally{rmSync(temporary,{recursive:true,force:true});}
