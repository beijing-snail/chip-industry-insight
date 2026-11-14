// Frontend-only QA on the production web server with synthetic API data; never a live ingestion claim.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {fakeApi,feedItem,startWebServer} from '../apps/web/tests/web-server.ts';
const topic=JSON.parse(await fs.readFile('industry/topics.json','utf8'));
const items=[feedItem({id:'qa-chip',title:'演示条目：计算平台公开信息',summary:'仅供前端版式检查；不是采集或AI生成结果。',category:'chips-products',source:{name:'本地测试数据'}})];
const server=await startWebServer(fakeApi(url=>{
 if(url.pathname==='/api/site/timeline')return {filters:{channel:'all',category:null,tag:null},cards:items.map(item=>({key:item.id,anchorAt:item.timelineAt,item,group:null})),nextCursor:null,hot:null,dayCounts:{}};
 if(url.pathname==='/api/site/hot')return {computedAt:new Date().toISOString(),windowHours:48,entries:[]};
 if(url.pathname==='/api/site/topics')return {groups:topic.groups,topics:topic.topics.map((t:any)=>({...t,path:'/topics/'+t.slug,brand:null,total:0,recent:0,indexable:false,latest:null}))};
 if(url.pathname==="/api/site/pool")return {items,freshness:new Date().toISOString(),todayCount:1,total:1,page:1,pageCount:1,pageSize:20,filters:{channel:"all",category:null,tag:null,q:url.searchParams.get("q"),tab:null}};
 return undefined;
}));
const browser=await chromium.launch({executablePath:process.env.CHIP_CHROME_PATH??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const results=[];
try{for(const width of [1440,390]){const page=await browser.newPage({viewport:{width,height:1000}});for(const path of ['/','/all','/hot','/topics','/about','/terms','/privacy','/agent','/all?q=Thor']){const r=await page.goto(server.origin+path);await page.waitForTimeout(400);const text=await page.locator('body').innerText();const status=r?.status()??0;results.push({width,path,status,brand:text.includes('AI 芯片观察'),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});assert.equal(status,200,path);if(['/','/topics','/about'].includes(path))await page.screenshot({path:`../evidence/page-${width}-${path==='/'?'home':path.slice(1)}.png`,fullPage:true});}await page.close();}}
finally{await browser.close();await server.stop();await fs.writeFile('../evidence/page-checks.json',JSON.stringify({mode:'production frontend + synthetic API; no live DB/LLM',results},null,2));}
console.log(JSON.stringify(results));
