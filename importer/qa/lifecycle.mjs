import {execFile} from 'node:child_process';import {promisify} from 'node:util';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const exec=promisify(execFile),docker=async(...a)=>(await exec('docker',a,{maxBuffer:8*1024*1024})).stdout;
const snapshot=()=>docker('exec','kghq-visual-wp','php','/tmp/kghq-visual-staging.php','snapshot');
const before=await snapshot();let removed=false;
try{
 await docker('exec','kghq-visual-wp','php','-r','require "/var/www/html/wp-load.php";require_once ABSPATH."wp-admin/includes/plugin.php";deactivate_plugins("kghq-lovable-importer/kghq-lovable-importer.php");');
 await docker('exec','kghq-visual-wp','mv','/var/www/html/wp-content/plugins/kghq-lovable-importer','/tmp/kghq-importer-lifecycle-backup');removed=true;
 assert.equal(await snapshot(),before);
 const checks=await docker('exec','kghq-visual-wp','php','-r','require "/var/www/html/wp-load.php";echo json_encode(["companionActive"=>is_plugin_active("kghq-import-styles/kghq-import-styles.php"),"customBlockRegistered"=>WP_Block_Type_Registry::get_instance()->is_registered("kghq/link-group"),"styledPages"=>count(get_posts(["post_type"=>"page","post_status"=>"any","meta_key"=>"_kghq_css","numberposts"=>-1])),"mediaCount"=>wp_count_posts("attachment")->inherit]);');
 const result=JSON.parse(checks);assert.ok(result.companionActive&&result.customBlockRegistered&&result.styledPages>0&&Number(result.mediaCount)>0);
 await fs.writeFile('importer/work/lifecycle-results.json',JSON.stringify({status:'PASS',importerFilesRemovedFromPlugins:true,allPageContentAndStyleHashesUnchanged:true,...result,limitation:'Companion must remain active for source styling, canvas, and Linked Layout editor registration.'},null,2));
}finally{if(removed)await docker('exec','kghq-visual-wp','mv','/tmp/kghq-importer-lifecycle-backup','/var/www/html/wp-content/plugins/kghq-lovable-importer');await docker('exec','kghq-visual-wp','php','-r','require "/var/www/html/wp-load.php";require_once ABSPATH."wp-admin/includes/plugin.php";activate_plugin("kghq-lovable-importer/kghq-lovable-importer.php");');}
