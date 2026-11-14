// Authenticated read-only preview of the real local site. Never prints/saves credentials or cookies.
import fs from 'node:fs/promises';
const base='http://localhost:3000';
const text=await fs.readFile('.env','utf8');const password=/^ADMIN_PASSWORD=(.*)$/m.exec(text)?.[1];
if(!password)throw Error('Local admin credential missing');
const report:any={checkedAt:new Date().toISOString(),mode:'real Docker backend; model calls disabled',previews:[]};
report.unauthenticatedAdmin=(await fetch(base+'/api/admin/me')).status;
const login=await fetch(base+'/api/auth/password',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({password,return:'/admin'}),redirect:'manual'});
const cookie=login.headers.get('set-cookie')?.split(';')[0];if(!cookie||login.status!==303)throw Error('Local login failed');
const headers={cookie};const me=await fetch(base+'/api/admin/me',{headers});const account=await me.json() as any;
report.authenticatedAdmin=me.status;report.developmentBypass=account.dev;
const bad=await fetch(base+'/api/admin/sources/S03/preview',{method:'POST',headers});report.missingCsrf=bad.status;
const {sources}=JSON.parse(await fs.readFile('industry/sources.json','utf8'));let i=0;const enabled=sources.filter((x:any)=>x.enabled);
await Promise.all(Array.from({length:3},async()=>{while(i<enabled.length){const s=enabled[i++];try{const r=await fetch(base+`/api/admin/sources/${s.id}/preview`,{method:'POST',headers:{cookie,'x-csrf-token':account.csrf},signal:AbortSignal.timeout(45000)});const d=await r.json() as any;report.previews.push({id:s.id,status:r.status,count:d.count??0,samples:(d.items??[]).slice(0,2).map((x:any)=>({title:x.title,url:x.url,publishedAt:x.publishedAt})),error:d.detail??null});}catch(e){report.previews.push({id:s.id,error:String(e),count:0});}await fs.writeFile('../evidence/runtime-preview.json',JSON.stringify(report,null,2));}}));
await fetch(base+'/api/auth/logout',{method:'POST',headers:{cookie,'content-type':'application/x-www-form-urlencoded'},body:'',redirect:'manual'});
await fs.writeFile('../evidence/runtime-preview.json',JSON.stringify(report,null,2));console.log(JSON.stringify({unauthorized:report.unauthenticatedAdmin,authorized:report.authenticatedAdmin,missingCsrf:report.missingCsrf,previews:report.previews.map((x:any)=>({id:x.id,status:x.status,count:x.count}))}));
