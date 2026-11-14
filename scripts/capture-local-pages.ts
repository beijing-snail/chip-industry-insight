import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const b=await chromium.launch({executablePath:process.env.CHIP_CHROME_PATH??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const results=[];
try{for(const width of [1440,390]){const p=await b.newPage({viewport:{width,height:1000}});for(const route of ['/','/topics','/admin/login']){const r=await p.goto('http://localhost:3000'+route);await p.waitForTimeout(300);results.push({width,path:route,status:r?.status(),overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});await p.screenshot({path:`../evidence/live-${width}-${route==='/'?'home':route.slice(1).replaceAll('/','-')}.png`,fullPage:true});}await p.close();}}finally{await b.close();await fs.writeFile('../evidence/live-page-checks.json',JSON.stringify({mode:'real Docker backend; no synthetic articles',results},null,2));}
console.log(JSON.stringify(results));
