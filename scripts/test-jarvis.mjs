import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {PHYSICS as C,STATES,STATE_COLORS} from '../public/jarvis/config.mjs';
import {intersects,canFit,resizeFeet,moveBody} from '../public/jarvis/physics.mjs';
import {createPlayer,transformPlayer,damagePlayer,stepPlayer} from '../public/jarvis/player.mjs';
import {createItem,activateBlock,stepItems} from '../public/jarvis/items.mjs';
import {spriteMask,drawSprite,drawItem} from '../public/jarvis/sprites.mjs';
import {background,terrain,drawBlocks,drawMechanics} from '../public/jarvis/rendering.mjs';
import {STAGES,makeLevel,overlap,readProgress,POWERS} from '../public/jarvis/levels.mjs';
import {stepWorld,checkpointReached,resetWorld,refillBlocks,solidsFor,hazardState} from '../public/jarvis/world.mjs';
let count=0;function test(name,fn){fn();count++;console.log('PASS '+name)}
const floor={x:-100,y:470,w:20000,h:100};
const flat={width:20000,theme:'meadow',platforms:[floor],blocks:[]};
const neutral={axis:0,jump:false,held:false,run:false,down:false};
const step=(p,input=neutral,n=1,level=flat)=>{for(let i=0;i<n;i++)stepPlayer(p,input,C.fixedStep,level,[])};
const grounded=()=>{const p=createPlayer();p.y=470-p.h;p.ground=true;return p};
test('17 destinations / 15 regular stages / 2 bosses / all original powers',()=>{
 assert.equal(STAGES.length,17);assert.equal(STAGES.filter(s=>!s.boss).length,15);assert.equal(STAGES.filter(s=>s.boss).length,2);
 assert.deepEqual([...new Set(STAGES.map(s=>s.power))].sort(),[...POWERS].sort());
 for(let i=0;i<17;i++){const l=makeLevel(i);assert.equal(Boolean(l.chief),l.boss);assert(l.platforms.some(b=>b.y===470&&b.x<=l.goal&&b.x+b.w>l.goal))}
});
test('progress remains compatible and safe when storage unavailable',()=>{
 assert.equal(readProgress({getItem:()=> '17'}),17);assert.equal(readProgress({getItem:()=> 'NaN'}),0);
 assert.equal(readProgress({getItem(){throw Error()}}),0);
});
test('new player is SMALL with matching 24x28 hitbox',()=>{const p=grounded();assert.equal(p.state,STATES.SMALL);assert.equal(p.power,'none');assert.equal(p.h,28);assert.equal(p.w,24)});
test('growth and all transformations anchor feet / replace abilities',()=>{
 const p=grounded(),feet=p.y+p.h;
 for(const state of Object.values(STATES)){assert(transformPlayer(p,state,[floor]));assert.equal(p.y+p.h,feet);assert.equal(p.h,state===STATES.SMALL?28:48);assert.equal(p.state,state)}
 assert.equal(p.power,'helicopter');
});
test('growth waits safely under ceiling and completes after exit',()=>{
 const p=grounded(),ceiling={x:0,y:420,w:200,h:20};
 assert.equal(transformPlayer(p,STATES.SUPER,[floor,ceiling]),false);assert.equal(p.h,28);assert.equal(p.pending,STATES.SUPER);assert(canFit(p,[floor,ceiling]));
 p.x=220;step(p,neutral,1,{...flat,platforms:[floor,ceiling]});assert.equal(p.state,STATES.SUPER);assert.equal(p.pending,null);
});
test('crouch preserves feet and cannot stand into a low ceiling',()=>{
 const p=grounded();transformPlayer(p,STATES.SUPER,[floor]);step(p,{...neutral,down:true});assert.equal(p.h,28);assert(p.crouch);
 const roof={x:0,y:420,w:200,h:20};step(p,neutral,1,{...flat,platforms:[floor,roof]});assert(p.crouch);
 p.x=220;step(p);assert.equal(p.h,48);assert(!p.crouch);assert.equal(p.y+p.h,470);
});
test('every special form degrades to SUPER then SMALL then death',()=>{
 for(const state of [STATES.FIRE,STATES.ICE,STATES.CLOUD,STATES.HAMMER,STATES.HELICOPTER]){
  const p=grounded();transformPlayer(p,state,[floor]);
  assert.equal(damagePlayer(p,[floor]),'hurt');assert.equal(p.state,STATES.SUPER);assert.equal(p.power,'none');
  assert.equal(damagePlayer(p,[floor]),'ignored');p.inv=0;
  damagePlayer(p,[floor]);assert.equal(p.state,STATES.SMALL);p.inv=0;
  assert.equal(damagePlayer(p,[floor]),'dead');assert.equal(p.anim,'death');
 }
});
test('invulnerability expires while player remains controllable',()=>{
 const p=grounded();transformPlayer(p,STATES.SUPER,[floor]);damagePlayer(p,[floor]);const x=p.x;
 step(p,{...neutral,axis:1},200);assert(p.x>x);assert.equal(p.inv,0);
});
test('walk/run acceleration, release friction and direction reversal',()=>{
 const walk=grounded(),run=grounded();step(walk,{...neutral,axis:1},120);step(run,{...neutral,axis:1,run:true},120);
 assert.equal(walk.vx,C.walkSpeed);assert.equal(run.vx,C.runSpeed);assert(run.x>walk.x);
 step(run,neutral,60);assert.equal(run.vx,0);step(walk,{...neutral,axis:-1},60);assert(walk.vx<0);
});
test('held jump higher than tapped jump / running leap travels farther',()=>{
 function jump(held,run){const p=grounded();p.vx=run?C.runSpeed:C.walkSpeed;
 step(p,{...neutral,jump:true,held:true,axis:1,run});let top=p.y;
 for(let i=0;i<110;i++){step(p,{...neutral,held,axis:1,run});top=Math.min(top,p.y)}return {top,x:p.x}}
 assert(jump(true,false).top<jump(false,false).top-40);
 assert(jump(true,true).x>jump(true,false).x+100);
});
test('100ms coyote window and no accidental double jump',()=>{
 const p=grounded();p.ground=false;p.coyote=.08;
 step(p,{...neutral,jump:true,held:true});assert(p.vy<0);assert.equal(p.coyote,0);
 const before=p.vy;step(p,{...neutral,jump:true,held:true});assert(p.vy>before);
 const late=grounded();late.ground=false;late.coyote=0;late.y=300;step(late,{...neutral,jump:true,held:true});assert(late.vy>0);
});
test('jump buffer triggers when input arrives just before landing',()=>{
 const p=createPlayer();p.y=470-p.h-3;p.vy=250;
 step(p,{...neutral,jump:true,held:true});step(p,{...neutral,held:true},4);assert(p.vy<0);
});
test('fast horizontal movement / vertical boosts do not tunnel thin obstacles',()=>{
 const wall={x:100,y:0,w:4,h:470};const p=createPlayer(0,300);p.vx=5000;moveBody(p,.1,[wall,floor]);assert(p.x+p.w<=100);
 const roof={x:0,y:100,w:400,h:4};const q=createPlayer(30,300);q.vy=-5000;moveBody(q,.1,[roof]);assert(q.y>=104);
 const r=createPlayer(30,0);r.vy=9000;moveBody(r,.1,[floor]);assert.equal(r.y+r.h,470);
});
test('stable grounding and one-way cloud landing',()=>{
 const p=grounded();step(p,neutral,1000);assert.equal(p.y+p.h,470);assert.equal(p.vy,0);
 const q=createPlayer(20,100);q.vy=1000;moveBody(q,.2,[],[{x:0,y:200,w:100,h:14,life:2}]);assert.equal(q.y+q.h,200);
});
test('item blocks adapt to SMALL/SUPER and are single use',()=>{
 const p=grounded(),list=[],b={x:150,y:348,w:32,h:32,kind:'item',power:'fire'};
 assert(activateBlock(b,p,list));assert.equal(list[0].type,'super');assert(!activateBlock(b,p,list));
 transformPlayer(p,STATES.SUPER,[floor]);const b2={...b,used:false};activateBlock(b2,p,list);assert.equal(list[1].type,'fire');
});
test('mushroom emerges, falls, moves, bounces against wall and falls into gaps',()=>{
 const item=createItem('super',30,440,{emerge:true}),p=createPlayer(1000),l={...flat,blocks:[]};const x=item.x;
 stepItems([item],.1,l,p);assert.equal(item.x,x);
 for(let i=0;i<120;i++)stepItems([item],C.fixedStep,l,p);assert(item.x>x);assert.equal(item.y+item.h,470);
 const wall={x:item.x+30,y:400,w:10,h:70};for(let i=0;i<20;i++)stepItems([item],C.fixedStep,{...l,blocks:[wall]},p);assert(item.vx<0);
 const falling=createItem('super',100,100);for(let i=0;i<120;i++)stepItems([falling],C.fixedStep,{...l,platforms:[]},p);assert(falling.y>500);
});
test('collect mushroom grows and special items replace current power',()=>{
 const p=grounded(),item=createItem('super',p.x+14,470);stepItems([item],.01,flat,p);assert(item.taken);assert.equal(p.state,STATES.SUPER);
 for(const type of POWERS){const it=createItem(type,p.x+14,p.y+28);stepItems([it],.01,flat,p);assert(it.taken);assert.equal(p.power,type)}
});
test('all sprite masks and animation poses stay valid',()=>{
 for(const big of [false,true])for(const pose of ['idle','walk','run','jump','fall','land','crouch','damage','death','transform'])for(let f=0;f<4;f++)
  for(const row of spriteMask(big,pose,f)){assert.equal(row.length,16);assert(!/[^.AHKS CBDT]/.test(row))}
});
const nodes=new Map();const node=id=>nodes.get(id)||nodes.set(id,{hidden:false,textContent:'',innerHTML:'',focus(){},setAttribute(){},classList:{add(){},remove(){}}}).get(id);
node('game').getContext=()=>new Proxy({measureText:t=>({width:t.length*6}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{})});
const storage=new Map(),context=vm.createContext({console,Math,Number,Set,Map,STAGES,makeLevel,overlap,readProgress,PHYSICS:C,STATES,createPlayer,stepPlayer,damagePlayer,transformPlayer,createItem,activateBlock,stepItems,drawSprite,drawItem,background,terrain,drawBlocks,drawMechanics,stepWorld,checkpointReached,resetWorld,refillBlocks,solidsFor,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},document:{getElementById:node,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},requestAnimationFrame(){},confirm:()=>true});
vm.runInContext(fs.readFileSync(new URL('../public/jarvis/game.mjs',import.meta.url),'utf8').replace(/^import[^\r\n]*[\r\n]+/gm,''),context);
const run=code=>vm.runInContext(code,context);
test('actual game integration: blocks, five powers and form damage',()=>{
 run('start(0);p.inv=0');
 run('bumpBlock(level.blocks[0])');assert.equal(run('items.at(-1).type'),'super');
 run('transformPlayer(p,STATES.SUPER,level.platforms);bumpBlock(level.blocks[1])');assert.equal(run('items.at(-1).type'),run('level.blocks[1].power'));
 for(const type of ['fire','ice','hammer']){run("transformPlayer(p,STATES."+type.toUpperCase()+",level.platforms);p.cool=0;power()");assert.equal(run('shots.at(-1).type'),type)}
 run('transformPlayer(p,STATES.CLOUD,level.platforms);p.cool=0;power()');assert.equal(run('clouds.length'),1);
 run('transformPlayer(p,STATES.HELICOPTER,level.platforms);p.cool=0;power()');assert.equal(run('p.vy'),-720);
 run('p.inv=0;hit()');assert.equal(run('p.state'),'SUPER');run('p.inv=0;hit()');assert.equal(run('p.state'),'SMALL');
 run('p.inv=0;hit()');assert.equal(run('mode'),'dying');
});
test('small cannot break brick; super can',()=>{
 run('start(0);bumpBlock(level.blocks[3])');assert(!run('level.blocks[3].broken'));
 run('transformPlayer(p,STATES.SUPER,level.platforms);bumpBlock(level.blocks[3])');assert(run('level.blocks[3].broken'));
});
test('both boss gates, victory persistence, retry and pause survive integration',()=>{
 for(const i of [8,16]){run('start('+i+');p.x=level.goal;update(1/120)');assert.equal(run('mode'),'play');run('level.chief.hp=0;update(1/120)');assert.equal(run('mode'),'won')}
 assert.equal(storage.get('jarvis-skybound-v1'),'17');
 run('start(0);pause()');assert.equal(run('mode'),'paused');run('pause()');assert.equal(run('mode'),'play');
 run('p.y=700;update(1/120)');assert.equal(run('mode'),'dying');run('deathScreen()');assert.equal(run('mode'),'dead');
 node('continue').onclick();assert.equal(run('p.state'),'SMALL');assert.equal(run('mode'),'play');
});
test('all 17 stages render every form and support fixed-step simulation',()=>{
 for(let i=0;i<17;i++){run('start('+i+');for(let n=0;n<100;n++)update(1/120);draw()');assert.equal(run('mode'),'play');assert.equal(run('p.y+p.h'),470);
  for(const state of Object.values(STATES))run('transformPlayer(p,STATES.'+state+',level.platforms);draw()');
 }
});
test('world hazards use the same SMALL death and powered damage rules',()=>{
 run('start(10);p.x=level.hazards[0].x;p.y=442;p.inv=0;level.time=5;update(1/120)');
 assert.equal(run('mode'),'dying');
 run('start(10);transformPlayer(p,STATES.FIRE,solidsFor(level));p.x=level.hazards[0].x;p.y=422;p.inv=0;level.time=5;update(1/120)');
 assert.equal(run('p.state'),'SUPER');assert.equal(run('mode'),'play');
});
test('actual retry restores the authored checkpoint, fresh rails and supply blocks',()=>{
 run('start(13);checkpoint=1;level.moving[0].progress=.7;level.time=5;level.blocks[0].used=true;die();deathScreen()');
 node('continue').onclick();
 assert.equal(run('checkpoint'),1);assert.equal(run('p.x'),run('level.checkpoints[1].x'));
 assert.equal(run('p.y+p.h'),run('level.checkpoints[1].top'));assert.equal(run('p.state'),'SMALL');
 assert.equal(run('level.time'),0);assert.equal(run('level.moving[0].progress'),0);assert.equal(run('level.blocks[0].used'),false);
 assert.equal(run('items[0].type'),'super');
});
test('the first gap is reachable with the actual player integrator in both sizes',()=>{
 for(const state of [STATES.SMALL,STATES.SUPER]){
  const l=makeLevel(0),p=createPlayer(430,442);p.ground=true;transformPlayer(p,state,solidsFor(l));p.vx=330;
  stepPlayer(p,{axis:1,run:true,jump:true,held:true,down:false},1/120,l,[]);
  for(let n=0;n<110;n++)stepPlayer(p,{axis:1,run:true,jump:false,held:true,down:false},1/120,l,[]);
  assert(p.x>=600&&p.y+p.h<=470);
 }
});
test('first authored stage can be completed with a scripted sequence of normal inputs',()=>{
 storage.clear();run('unlocked=0;start(0)');
 function drive(target,jump=false){
  run("keys.clear();keys.add('ShiftLeft');keys.add('ArrowRight');"+(jump?"keys.add('Space');pressed.add('Space');":""));
  for(let n=0;n<800&&run('mode')==='play'&&run('p.x')<target;n++)run('update(1/120)');
  assert(!['dead','dying'].includes(run('mode')),'died before '+target+' at '+run('p.x'));
 }
 function settle(){run('keys.clear()');for(let n=0;n<300&&run('mode')==='play';n++){run('update(1/120)');if(n>40&&run('p.ground')&&run('p.vx')===0)break}} drive(430);drive(700,true);settle();drive(730);drive(890,true);settle();drive(1200,true);settle();
 drive(1470);drive(1710,true);settle();drive(1900);drive(2100,true);settle();drive(2160);drive(2400,true);
 assert.equal(run('mode'),'won');assert.equal(storage.get('jarvis-skybound-v1'),'1');assert.equal(run('unlocked'),1);
});
console.log(count+' test groups passed.');
