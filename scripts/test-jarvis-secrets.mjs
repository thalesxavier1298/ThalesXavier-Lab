import assert from 'node:assert/strict';
import {makeLevel} from '../public/jarvis/levels.mjs';
import {createPlayer,stepPlayer} from '../public/jarvis/player.mjs';
import {intersects,solidsFor} from '../public/jarvis/physics.mjs';
import {DISCOVERY_KEY,SECRET_ROUTES,BONUS_STAGES,readDiscoveries,saveDiscoveries,collectRelic,discoverExit,stageAvailable,stageCleared,finishStage,relicCount,makeBonus,portalAt} from '../public/jarvis/secrets.mjs';
let count=0;const test=(name,fn)=>{fn();count++;console.log('PASS '+name)},fresh=()=>({relics:[],exits:[],cleared:[]});
test('51 globally unique shards across 17 stages and their bonus rooms',()=>{const ids=[];for(let i=0;i<17;i++){const l=makeLevel(i),r=[...l.relics,...(l.bonusRelic?makeBonus(l).relics:[])];assert.equal(r.length,3);for(let n=0;n<3;n++)assert(r.some(r=>r.id===i+':'+n));ids.push(...r.map(r=>r.id))}assert.equal(new Set(ids).size,51)});
test('every authored main-stage shard is reachable with real Small Jarvis controls from its supporting trail',()=>{
 for(let i=0;i<17;i++){const l=makeLevel(i);for(const r of l.relics){let got=false;
  for(const offset of [-125,-85,-45,0,70,110]){const p=createPlayer(r.x+offset,r.sourceTop-28);p.ground=true;p.inv=999;const dir=Math.sign(r.x-p.x);for(let n=0;n<160;n++){stepPlayer(p,{axis:dir,run:false,jump:n===0,held:n<70,down:false},1/120,l,[]);if(intersects(p,r)){got=true;break}}if(got)break}
  assert(got,i+' unreachable '+r.id+' at '+r.x+','+r.y);
 }}
});
test('shards do not overlap solids or hazards and stay before compulsory cloud crossings',()=>{for(let i=0;i<17;i++){const l=makeLevel(i);for(const r of l.relics){assert(!solidsFor(l).some(b=>intersects(r,b)),r.id);assert(!l.hazards.some(h=>intersects(r,h)));assert(!l.cloudTrials?.some(t=>r.x>=t.start-140))}}});
test('discoveries validate corrupt and old data without changing coin or life records',()=>{assert.deepEqual(readDiscoveries({getItem:()=>null}),fresh());assert.deepEqual(readDiscoveries({getItem:()=>'{bad'}),fresh());const d=readDiscoveries({getItem:()=>JSON.stringify({relics:['0:0','0:0','16:2','17:0',null,{},'01:0'],exits:[1,1,99],cleared:[0,0,16,17,-1,'3']})});assert.deepEqual(d,{relics:['0:0','16:2'],exits:[1],cleared:[0,16]});assert.doesNotThrow(()=>saveDiscoveries(d,{setItem(){throw Error('blocked')}}))});
test('shards and secret exits are idempotent and survive a storage round trip',()=>{const d=fresh(),storage=new Map();assert(collectRelic(d,'4:1'));assert(!collectRelic(d,'4:1'));assert(!collectRelic(d,'100:1'));assert(discoverExit(d,1));assert(!discoverExit(d,1));assert(!discoverExit(d,0));saveDiscoveries(d,{setItem:(k,v)=>storage.set(k,v)});assert.deepEqual(readDiscoveries({getItem:k=>storage.get(k)}),d);assert.equal(relicCount(d,4),1)});
test('shortcuts open destinations without clearing skipped stages or increasing linear progress',()=>{const d=fresh();discoverExit(d,1);assert(stageAvailable(4,1,d));assert(!stageAvailable(3,1,d));assert(!stageCleared(2,1,d));let linear=finishStage(d,4,1);assert.equal(linear,1);assert(stageAvailable(5,linear,d));assert(!stageCleared(3,linear,d));linear=finishStage(d,1,linear);linear=finishStage(d,2,linear);linear=finishStage(d,3,linear);assert.equal(linear,5)});
test('bonus grotto is a stable mutable room with one special shard and a return portal',()=>{for(const i of BONUS_STAGES){const l=makeLevel(i),b=makeBonus(l);assert(b.isBonus);assert.equal(b.index,i);assert.equal(b.relics[0].id,l.bonusRelic);assert.equal(b.portals[0].kind,'return');assert.equal(b.goal,Infinity);assert(b.coins.length>0);const p=createPlayer(80,442);assert.equal(portalAt(b,p)?.kind,'return');b.coins[0].taken=true;assert(b.coins[0].taken)}});
test('bonus ledges and shard can be reached with ordinary jumps and a grounded safe return',()=>{
 for(const i of BONUS_STAGES.filter(i=>i!==5)){const b=makeBonus(makeLevel(i)),p=createPlayer(230,442);p.ground=true;
  for(const target of [{x:350,top:390},{x:410,top:390},{x:565,top:310}]){let landed=false;for(let n=0;n<240;n++){stepPlayer(p,{axis:p.x<target.x?1:0,run:false,jump:n===0&&target.x!==410,held:true,down:false},1/120,b,[]);if(p.ground&&Math.abs(p.y+p.h-target.top)<1&&p.x>=target.x-5){landed=true;break}}assert(landed,'bonus step '+i+' '+target.x)}
  assert(intersects(p,b.relics[0])||Math.abs(p.x-b.relics[0].x)<30);
 }
});
test('all secret exits belong to reachable platforms and point to distinct existing destinations',()=>{for(const edge of SECRET_ROUTES){const l=makeLevel(edge.from),door=l.portals.find(p=>p.kind==='secret');assert(door);assert.equal(door.to,edge.to);assert(l.platforms.some(b=>Math.abs(b.y-door.y-door.h)<1&&door.x>=b.x&&door.x+door.w<=b.x+b.w));assert(edge.to<17)}});
test('crystal bonus has a low archive passage and its shard is reachable by Small Jarvis',()=>{const b=makeBonus(makeLevel(5)),p=createPlayer(260,442);p.ground=true;let found=false;for(let n=0;n<200;n++){stepPlayer(p,{axis:1,jump:false,held:false,down:true},1/120,b,[]);if(intersects(p,b.relics[0])){found=true;break}}assert(found)});
test('legacy linear progress preserves all cleared stages and starts with empty shard records',()=>{for(let old=0;old<=17;old++){const d=readDiscoveries({getItem:()=>null});for(let i=0;i<17;i++){assert.equal(stageCleared(i,old,d),i<old);assert.equal(stageAvailable(i,old,d),i<=old);assert.equal(relicCount(d,i),0)}}});
test('bonus return poses are grounded and have headroom for every large form',()=>{for(const i of BONUS_STAGES){const l=makeLevel(i),d=l.portals.find(p=>p.kind==='bonus'),body={x:d.returnX,y:d.top-48,w:24,h:48};assert(!solidsFor(l).some(b=>intersects(body,b)));assert(l.platforms.some(b=>b.y===d.top&&body.x>=b.x&&body.x+24<=b.x+b.w))}});
console.log(count+' exploration test groups passed.');
