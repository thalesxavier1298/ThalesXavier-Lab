import assert from 'node:assert/strict';
import {DESIGNS} from '../public/jarvis/layouts.mjs';
import {makeLevel,STAGES} from '../public/jarvis/levels.mjs';
import {intersects,canFit} from '../public/jarvis/physics.mjs';
import {createPlayer,stepPlayer,transformPlayer} from '../public/jarvis/player.mjs';
import {PHYSICS as C,STATES} from '../public/jarvis/config.mjs';
import {activateBlock,stepItems} from '../public/jarvis/items.mjs';
import {stepWorld,solidsFor,hazardState,checkpointReached,resetWorld} from '../public/jarvis/world.mjs';
let count=0;const test=(name,fn)=>{fn();count++;console.log('PASS '+name)};
const neutral={axis:0,jump:false,held:false,run:false,down:false};
function stand(x,top){const p=createPlayer(x,top-28);p.ground=true;return p}
const tick=(l,p,n)=>{for(let i=0;i<n;i++){stepWorld(l,p,C.fixedStep);stepPlayer(p,neutral,C.fixedStep,l,[])}};
test('15 authored, distinct layouts with explicit identities and two preserved bosses',()=>{
 assert.equal(DESIGNS.length,15);assert.equal(new Set(DESIGNS.map(d=>d.mechanic)).size,15);
 assert.equal(new Set(DESIGNS.map(d=>JSON.stringify(d.platforms))).size,15);
 for(let i=0;i<17;i++){const l=makeLevel(i);assert(l.identity&&l.mechanic);assert(l.checkpoints.length>=2);assert.equal(l.index,i)}
 for(const i of [8,16]){const l=makeLevel(i);assert.equal(l.chief.hp,i===8?6:14);assert.equal(l.width,i===8?5600:8100)}
});
test('every checkpoint is grounded, clear, away from hazards and enemies; no block overlaps terrain',()=>{
 for(let i=0;i<17;i++){
  const l=makeLevel(i);
  for(const c of l.checkpoints){const p=stand(c.x,c.top);
   assert(canFit(p,l.platforms),i+' spawn terrain');
   assert(l.platforms.some(b=>c.x>=b.x&&c.x+p.w<=b.x+b.w&&c.top===b.y),i+' support');
   assert(!l.enemies.some(e=>Math.abs(e.x-p.x)<120&&Math.abs(e.y-p.y)<80),i+' enemy');
   assert(!l.hazards.some(h=>Math.abs(h.x-p.x)<140&&Math.abs(h.y-p.y)<80),i+' hazard');
  }
  for(const b of l.blocks)assert(!l.platforms.some(t=>intersects(b,t)),i+' block terrain');
 }
});
// A reachability graph is a geometric check, not an end-to-end playthrough.
// Moving-platform endpoints are connected by travel edges. Jump edges use the
// configured full jump and a 24-unit safety margin, without any special power.
function routeGraph(l){
 const nodes=l.platforms.map((b,i)=>({...b,id:'static-'+i}));
 for(const b of l.falling)nodes.push({...b,id:b.id});
 for(const b of l.moving){nodes.push({...b,id:b.id,endpoint:0});nodes.push({...b,x:b.toX,y:b.toY,id:b.id,endpoint:1})}
 const links=nodes.map(()=>[]);
 for(let i=0;i<nodes.length;i++)for(let j=0;j<nodes.length;j++){
  if(i===j)continue;
  const a=nodes[i],b=nodes[j];
  if(a.id===b.id){links[i].push(j);continue}
  const rise=a.y-b.y;
  if(rise>C.jumpSpeed*C.jumpSpeed/(2*C.gravity)-4||rise< -300)continue;
  const disc=C.jumpSpeed*C.jumpSpeed-2*C.gravity*rise;
  const flight=(C.jumpSpeed+Math.sqrt(disc))/C.gravity;
  const gap=Math.max(0,b.x-(a.x+a.w),a.x-(b.x+b.w));
  if(gap<=C.runSpeed*flight-24)links[i].push(j);
 }
 const seen=new Set([0]),queue=[0];while(queue.length){const a=queue.shift();for(const b of links[a])if(!seen.has(b)){seen.add(b);queue.push(b)}}
 return {nodes,seen};
}
test('ordinary routes are connected without powers; mandatory cloud trials tested separately',()=>{
 for(let i=0;i<17;i++){
  const full=makeLevel(i),l=full.cloudTrials?{...full,platforms:full.platforms.filter(b=>b.x<full.cloudTrials[0].start),checkpoints:full.checkpoints.filter(c=>c.x<full.cloudTrials[0].start),goal:full.cloudTrials[0].start-120,goalY:470}:full;const {nodes,seen}=routeGraph(l);
  assert(nodes.some((b,n)=>seen.has(n)&&l.goal>=b.x&&l.goal+24<=b.x+b.w&&b.y===l.goalY),i+' goal disconnected');
  for(const c of l.checkpoints)assert(nodes.some((b,n)=>seen.has(n)&&c.x>=b.x&&c.x+24<=b.x+b.w&&b.y===c.top),i+' checkpoint disconnected');
 }
});
test('horizontal and diagonal ferries carry grounded Jarvis without sliding through the deck',()=>{
 for(const index of [2,13]){
  const l=makeLevel(index),b=l.moving[0],p=stand(b.x+40,b.y),x=p.x;
  tick(l,p,180);assert(p.x>x+60);assert(Math.abs(p.y+p.h-b.y)<.01);assert(p.ground);
 }
});
test('lift ceiling contact reverses safely rather than crushing or clipping',()=>{
 const l=makeLevel(2),b=l.moving[0];l.moving=[b];l.blocks=[];
 Object.assign(b,{x:0,y:300,originX:0,originY:300,toX:0,toY:150,w:150,speed:80,progress:0,direction:1});
 l.platforms=[{x:0,y:200,w:180,h:20}];l.falling=[];
 const p=stand(30,300);
 for(let i=0;i<400;i++){stepWorld(l,p,C.fixedStep);stepPlayer(p,neutral,C.fixedStep,l,[]);assert(canFit(p,l.platforms),'ceiling overlap')}
 assert(p.y>=220);
});
test('moving-platform side contact stops and reverses without pushing Jarvis',()=>{
 const l=makeLevel(2),b=l.moving[0];l.moving=[b];l.platforms=[];l.blocks=[];l.falling=[];
 Object.assign(b,{x:0,y:300,originX:0,originY:300,toX:300,toY:300,w:100,speed:70,progress:0,direction:1});
 const p=createPlayer(160,300),x=p.x;
 for(let i=0;i<200;i++){stepWorld(l,p,C.fixedStep);assert(!intersects(p,b))}
 assert.equal(p.x,x);
});
test('temporary ledges shake, become non-solid, fall and return; blocked respawn waits',()=>{
 const l=makeLevel(7),b=l.falling[0],p=stand(b.x+30,b.y);
 stepWorld(l,p,C.fixedStep);assert.equal(b.state,'shaking');assert(solidsFor(l).includes(b));
 for(let i=0;i<110;i++)stepWorld(l,p,C.fixedStep);
 assert.equal(b.state,'falling');assert(!solidsFor(l).includes(b));
 p.x=0;for(let i=0;i<400;i++)stepWorld(l,p,C.fixedStep);
 assert.equal(b.state,'ready');assert.equal(b.y,b.originY);
 b.state='waiting';p.x=b.x+30;p.y=b.originY;
 stepWorld(l,p,C.fixedStep);assert.equal(b.state,'waiting');
 p.x=0;stepWorld(l,p,C.fixedStep);assert.equal(b.state,'ready');
});
test('vent cycles have off, warning, active and safe reset states',()=>{
 const h=makeLevel(10).hazards[0];
 assert.equal(hazardState(h,0),'off');assert.equal(hazardState(h,4),'warning');assert.equal(hazardState(h,5),'active');assert.equal(hazardState(h,6),'off');
 for(const index of [10,12,14,15]){
  const l=makeLevel(index),p=stand(80,470);stepWorld(l,p,5);assert(l.hazards.some(h=>h.state==='active'));
  const fresh=makeLevel(index);assert.equal(fresh.time,0);
 }
});
test('checkpoint activation requires standing at the configured location and height',()=>{
 const l=makeLevel(1),c=l.checkpoints[1],p=stand(c.x,c.top);
 assert.equal(checkpointReached(l,p,0),1);p.ground=false;assert.equal(checkpointReached(l,p,0),0);
 p.ground=true;p.y=442;assert.equal(checkpointReached(l,p,0),0);
});
test('all returns restart cycles and objects, provide empty boxes instead of automatic mushrooms',()=>{
 for(let i=0;i<17;i++){
  let l=makeLevel(i);for(const b of l.blocks)b.used=true;for(const b of l.falling)b.state='falling';l.time=5;
  l=makeLevel(i);const {spawn,items}=resetWorld(l,1),c=l.checkpoints[1];
  assert.equal(spawn.y,c.top-28);assert.equal(items.length,0);assert(!l.blocks.some(b=>b.used));assert(l.falling.every(b=>b.state==='ready'));
  assert(l.blocks.some(b=>b.kind==='item'&&Math.abs(b.x-c.x)<120));
 }
});
test('each power box stays spent; Small gets a mushroom and large gets the stage power',()=>{
 const l=makeLevel(4),b=l.blocks[0],p=stand(b.x,470),items=[];
 activateBlock(b,p,items);assert.equal(items[0].type,'super');
 items[0].taken=true;transformPlayer(p,STATES.SUPER,solidsFor(l));
 for(let n=0;n<1500;n++)stepWorld(l,p,C.fixedStep);
 assert(b.used);assert(!activateBlock(b,p,items));assert.equal(items.length,1);
 activateBlock(l.blocks.find((b,i)=>i>0&&b.content==='power'),p,items);assert.equal(items[1].type,'cloud');
 assert.equal(makeLevel(4).blocks[0].used,false);
});
test('Super can crawl through the crystal passage and stand after leaving it',()=>{
 const l=makeLevel(5),p=stand(350,470);transformPlayer(p,STATES.SUPER,solidsFor(l));
 for(let i=0;i<800;i++){stepPlayer(p,{...neutral,axis:1,down:true},C.fixedStep,l,[]);assert(canFit(p,solidsFor(l)))}
 assert(p.x>780);stepPlayer(p,neutral,C.fixedStep,l,[]);assert.equal(p.h,48);assert(!p.crouch);
});
test('moving and falling platform instances do not leak state between stage loads',()=>{
 const a=makeLevel(13),b=makeLevel(13);a.moving[0].x=9999;assert.notEqual(b.moving[0].x,9999);
 const c=makeLevel(7),d=makeLevel(7);c.falling[0].state='falling';assert.equal(d.falling[0].state,'ready');
});
console.log(count+' world-mechanic test groups passed.');
