// Read-only network probes using the production collectors; never seeds a DB or calls a model.
import fs from 'node:fs/promises';
import { fetchRss } from '../packages/backend/src/sources/rss.ts';
import { fetchJsonList } from '../packages/backend/src/sources/json-list.ts';
import { fetchWebList,fetchDetail } from '../packages/backend/src/sources/web-list.ts';
import { assertSupportedConfig } from '../packages/backend/src/sources/config-keys.ts';
import { admitListing,filterPublicationWindow } from '../packages/backend/src/sources/filters.ts';
import { extractFromUrl } from '../packages/backend/src/content/extract.ts';
import type { SourceRow,Candidate } from '../packages/backend/src/sources/types.ts';
const {sources}=JSON.parse(await fs.readFile('industry/source-candidates.json','utf8'));
const ids=process.argv.find(x=>x.startsWith('--ids='))?.slice(6).split(',');
const prior=ids?JSON.parse(await fs.readFile('../evidence/source-probes.json','utf8')):[];
const allSources=[...sources];
if(ids) sources.splice(0,sources.length,...sources.filter((s:any)=>ids.includes(s.id)));
const results:any[]=prior.filter((r:any)=>!ids?.includes(r.id)); let index=0;
async function worker(){while(index<sources.length){const seed=sources[index++];
 const source={...seed,uses:[],first_party:seed.tier==='T1',cursor:null,fail_count:0} as SourceRow;
 const result:any={id:seed.id,name:seed.name,original_url:seed.original_url,effective_url:seed.config.feedUrl??seed.config.url,kind:seed.kind,tier:seed.tier,priority:Number(seed.id.slice(1))<=28?'original':'additional',checked_at:new Date().toISOString(),enabled_in_seed:false,scheduled_ingestion:'not tested: no database/Docker',body:'not tested'};
 try { assertSupportedConfig(source.kind,source.config);
 const found:Candidate[]=source.kind==='rss'?(await fetchRss(source,{force:true})).candidates:source.kind==='json_list'?await fetchJsonList(source):await fetchWebList(source);
 const admitted=admitListing(found,source);
 for(const item of admitted.slice(0,Number(source.config.detail?.maxFetches??0))) if(!item.publishedAt){try{const detail=await fetchDetail(item.url,source,{date:true,title:false,summary:false});item.publishedAt=detail.publishedAt;item.publicationTime=detail.publicationTime;}catch{}}
 const valid=filterPublicationWindow(admitted,source.config.publishedAfter);
 result.found=found.length;result.valid=valid.length;result.dated=admitted.filter(x=>x.publishedAt).length;result.unique=new Set(found.map(x=>x.url)).size;
 result.samples=valid.slice(0,4).map(x=>({title:x.title,url:x.url,publishedAt:x.publishedAt,excerpt_chars:x.excerpt?.length??0}));
 if(valid.length){try{const body=await extractFromUrl(valid[0]!.url,'chip-source-probe',{}, {paidFallback:false});result.body=body?{chars:body.text.length,ok:body.text.length>150}:'not extractable';}catch(e){result.body='failed: '+String(e).slice(0,180);}}
 result.status=valid.length?'parsed_recent':'no_recent_dated_items';
 result.enabled_in_seed=valid.length>0&&(typeof result.body==='object'&&result.body.ok);
 }catch(e){result.status='failed';result.error=String(e).slice(0,400);result.found=0;result.valid=0;}
 results.push(result);console.log(JSON.stringify({id:result.id,status:result.status,found:result.found,valid:result.valid,enabled:result.enabled_in_seed}));
 await fs.mkdir('../evidence',{recursive:true});await fs.writeFile('../evidence/source-probes.json',JSON.stringify(results,null,2));
}}
await Promise.all(Array.from({length:5},worker));
const enabled=new Set(results.filter(x=>x.enabled_in_seed).map(x=>x.id));
await fs.writeFile('industry/sources.json',JSON.stringify({$comment:'Only sources with recent dated candidates and one readable article in direct collector probe. Scheduled ingestion/admin preview not verified. Seeds never overwrite existing DB rows.',sources:allSources.map(({original_url,...s}:any)=>({...s,enabled:enabled.has(s.id),tags:[enabled.has(s.id)?'试抓通过':'候选待验证']}))},null,2));
process.exit(0);
