import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {CATEGORIES,ENTITIES,TOPIC_TAGS,CATEGORY_TAGS,RELEASE} from '../industry/taxonomy.ts';
import {assertSupportedConfig} from '../packages/backend/src/sources/config-keys.ts';
import {PREFILTER_SYSTEM,UNDERSTAND_SYSTEM} from '../packages/backend/src/editorial/writing.ts';
const {sources}=JSON.parse(await fs.readFile('industry/sources.json','utf8'));
const {topics}=JSON.parse(await fs.readFile('industry/topics.json','utf8'));
assert.equal(CATEGORIES.length,5);assert.equal(new Set(topics.map((t:any)=>t.slug)).size,topics.length);
for(const s of sources){assertSupportedConfig(s.kind,s.config);assert.equal(s.site_fulltext,false);assert.equal(s.syndicate_fulltext,false);assert.ok(s.config.publishedAfter);if(s.owner_entity_id)assert.ok(ENTITIES[s.owner_entity_id],s.id);}
for(const t of topics){if(t.entityId)assert.ok(ENTITIES[t.entityId],t.slug);for(const tag of t.tags??[])assert.ok(([...TOPIC_TAGS,...CATEGORY_TAGS] as readonly string[]).includes(tag),tag);}
assert.equal(RELEASE?.category,'chips-products');assert.ok(PREFILTER_SYSTEM.includes('UNKNOWN'));assert.ok(!UNDERSTAND_SYSTEM.includes('{{'));
console.log(JSON.stringify({categories:CATEGORIES.map(c=>c.key),sources:sources.length,seedEnabled:sources.filter((s:any)=>s.enabled).length,topics:topics.length,status:'PASS',limits:'schema and actual prompt loading only; not model quality'}));
