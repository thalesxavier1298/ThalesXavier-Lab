import * as endingHelpers from '../public/jarvis/ending.mjs';
import * as trialHelpers from '../public/jarvis/secret-trials.mjs';
import * as secretHelpers from '../public/jarvis/secrets.mjs';
import {ICE,freezeEnemy,stepFrozen,pickIce,releaseIce,clearCarry,smashIce,stepCarriedAndThrown} from '../public/jarvis/ice.mjs';
import {revealBlock,impactBlock,canBreakBlock,bossProjectileAllowed,addHiddenBlocks,standsOnBlock} from '../public/jarvis/objects.mjs';
import {stepEnemies,strikeEnemy,stepFinalBoss,drawEnemy,enemyShot} from '../public/jarvis/encounters.mjs';
import {MAP_POINTS,mapNeighbor,mapPosition,MAP_JARVIS,landmarkSvg,mapRoute,mapLandscape} from '../public/jarvis/map.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {INITIAL_LIVES,readRun,saveRun,loseLife,resetLives,tickTimer,addCoins,claimLife,clearLifeClaim} from '../public/jarvis/run.mjs';
import vm from 'node:vm';
import {PHYSICS as C,STATES,STATE_COLORS} from '../public/jarvis/config.mjs';
import {intersects,canFit,resizeFeet,moveBody} from '../public/jarvis/physics.mjs';
import {createPlayer,transformPlayer,damagePlayer,stepPlayer} from '../public/jarvis/player.mjs';
import {createItem,activateBlock,stepItems} from '../public/jarvis/items.mjs';
import {spriteMask,drawSprite,drawItem} from '../public/jarvis/sprites.mjs';
import {background,terrain,drawBlocks,drawMechanics} from '../public/jarvis/rendering.mjs';
import {STAGES,makeLevel,overlap,readProgress,POWERS} from '../public/jarvis/levels.mjs';
import {stepWorld,checkpointReached,resetWorld,solidsFor,hazardState} from '../public/jarvis/world.mjs';
let prepare=()=>{};let count=0;function test(name,fn){prepare();fn();count++;console.log('PASS '+name)}
const floor={x:-100,y:470,w:20000,h:100};
const flat={width:20000,theme:'meadow',platforms:[floor],blocks:[]};
const neutral={axis:0,jump:false,held:false,run:false,down:false};
const step=(p,input=neutral,n=1,level=flat)=>{for(let i=0;i<n;i++)stepPlayer(p,input,C.fixedStep,level,[])};
const grounded=()=>{const p=createPlayer();p.y=470-p.h;p.ground=true;return p};
test('17 destinations / 15 regular stages / 2 bosses / all original powers',()=>{
 assert.equal(STAGES.length,17);assert.equal(STAGES.filter(s=>!s.boss).length,15);assert.equal(STAGES.filter(s=>s.boss).length,2);
 assert.deepEqual([...new Set(STAGES.map(s=>s.power))].sort(),[...POWERS].sort());
 for(let i=0;i<17;i++){const l=makeLevel(i);assert.equal(Boolean(l.chief),l.boss);assert(l.platforms.some(b=>b.y===l.goalY&&b.x<=l.goal&&b.x+b.w>l.goal))}
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
const nodes=new Map();const node=id=>nodes.get(id)||nodes.set(id,{hidden:false,textContent:'',innerHTML:'',focus(){},setAttribute(){},classList:{values:new Set(),add(k){this.values.add(k)},remove(k){this.values.delete(k)},contains(k){return this.values.has(k)}}}).get(id);
node('game').getContext=()=>new Proxy({measureText:t=>({width:t.length*6}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{})});
const storage=new Map(),context=vm.createContext({...endingHelpers,...trialHelpers,...secretHelpers,console,Math,Number,Set,Map,MAP_POINTS,mapNeighbor,mapPosition,MAP_JARVIS,landmarkSvg,mapRoute,mapLandscape,STAGES,makeLevel,overlap,readProgress,PHYSICS:C,INITIAL_LIVES,readRun,saveRun,loseLife,resetLives,tickTimer,addCoins,claimLife,clearLifeClaim,revealBlock,impactBlock,canBreakBlock,bossProjectileAllowed,freezeEnemy,stepFrozen,pickIce,releaseIce,clearCarry,smashIce,stepCarriedAndThrown,stepEnemies,strikeEnemy,stepFinalBoss,drawEnemy,STATES,createPlayer,stepPlayer,damagePlayer,transformPlayer,createItem,activateBlock,stepItems,drawSprite,drawItem,background,terrain,drawBlocks,drawMechanics,stepWorld,checkpointReached,resetWorld,solidsFor,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},document:{body:node('body'),querySelector:()=>node('shell'),getElementById:node,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},requestAnimationFrame(){},confirm:()=>true});
vm.runInContext(fs.readFileSync(new URL('../public/jarvis/game.mjs',import.meta.url),'utf8').replace(/^import[^\r\n]*[\r\n]+/gm,''),context);
const run=code=>vm.runInContext(code,context);
prepare=()=>run('resetLives(runState);runState.coins=0;runState.lifeClaims=[]');
test('actual game integration: blocks, five powers and form damage',()=>{
 run('start(0);p.inv=0');
 run('bumpBlock(level.blocks[0])');assert.equal(run('items.at(-1).type'),'super');
 run('transformPlayer(p,STATES.SUPER,level.platforms);bumpBlock(level.blocks.find((b,i)=>i>0&&b.content==="power"))');assert.equal(run('items.at(-1).type'),run('level.power'));
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
 assert(secretHelpers.readDiscoveries({getItem:k=>storage.get(k)}).cleared.includes(16));assert.equal(storage.get('jarvis-skybound-v1'),'0');
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
 assert.equal(run('items.length'),0);
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
 drive(1470);drive(1710,true);settle();drive(1900);drive(2100,true);settle();drive(2160);drive(2400,true);settle();drive(2820);drive(3060,true);settle();drive(3200);
 assert.equal(run('mode'),'won');assert.equal(storage.get('jarvis-skybound-v1'),'1');assert.equal(run('unlocked'),1);assert(run('remaining')>150);
});
test('no item is spawned automatically at any stage entry or checkpoint',()=>{
 for(let i=0;i<17;i++){
  run('start('+i+')');assert.equal(run('items.length'),0);
  for(let c=1;c<run('level.checkpoints.length');c++){run('checkpoint='+c+';respawn()');assert.equal(run('items.length'),0)}
 }
});
test('five deaths consume exactly five lives and produce Game Over without clearing unlocks',()=>{
 run('start(3);checkpoint=1');const progress=run('unlocked');
 for(let n=4;n>=0;n--){
  run('p.y=700;update(1/120)');assert.equal(run('runState.lives'),n);run('die()');assert.equal(run('runState.lives'),n);
  run('deathScreen()');assert.equal(run('mode'),n===0?'gameover':'dead');
  if(n>0){node('continue').onclick();assert.equal(run('checkpoint'),1);assert.equal(run('p.state'),'SMALL');assert.equal(run('items.length'),0)}
 }
 assert.equal(run('unlocked'),progress);
 assert.equal(readRun({getItem:k=>storage.get(k)??null}).lives,0);
 node('continue').onclick();assert.equal(run('runState.lives'),5);assert.equal(run('checkpoint'),0);assert.equal(run('mode'),'map');
 run('start(3)');assert.equal(run('remaining'),makeLevel(3).timeLimit);assert.equal(run('unlocked'),progress);
});
test('time expires once regardless of power/invincibility; retry restores a generous full timer',()=>{
 run('start(4);checkpoint=1;transformPlayer(p,STATES.CLOUD,solidsFor(level));p.inv=999;remaining=.001;update(1/120)');
 assert.equal(run('mode'),'dying');assert.equal(run('remaining'),0);assert.equal(run('deathReason'),'timeout');assert.equal(run('runState.lives'),4);
 run('die()');assert.equal(run('runState.lives'),4);run('deathScreen()');node('continue').onclick();
 assert.equal(run('checkpoint'),1);assert.equal(run('remaining'),makeLevel(4).timeLimit);assert.equal(run('p.state'),'SMALL');
});
test('the real frame loop freezes time on pause and after a clear',()=>{
 run('start(0);remaining=20;pause();last=0;frame(100);frame(5000)');
 assert.equal(run('remaining'),20);run('pause();frame(5100)');assert(run('remaining')<20);
 run("mode='won';frame(7000)");const remaining=run('remaining');run('frame(9000)');assert.equal(run('remaining'),remaining);
});
test('changing stages or restarting does not silently refill lives',()=>{
 run('start(0);p.y=700;update(1/120);deathScreen()');node('continue').onclick();assert.equal(run('runState.lives'),4);
 run('start(2)');assert.equal(run('runState.lives'),4);assert.equal(run('remaining'),makeLevel(2).timeLimit);
});
test('saved life data is validated independently of completed stages',()=>{
 assert.equal(readRun({getItem:()=>'{bad json'}).lives,5);
 assert.equal(readRun({getItem:()=>JSON.stringify({lives:-1,stage:0})}).lives,5);
 assert.equal(readRun({getItem:()=>JSON.stringify({lives:0,stage:16})}).lives,0);
 assert.equal(readRun({getItem:()=>JSON.stringify({lives:3,stage:8})}).lives,3);
 assert.equal(readRun({getItem(){throw Error()}}).lives,5);
 const r={lives:2,stage:4};assert.doesNotThrow(()=>saveRun(r,{setItem(){throw Error()}}));
});
test('stage lengths and timers allow exploration; recovery supplies remain single-use',()=>{
 let prior=0;
 for(let i=0;i<17;i++){
  const l=makeLevel(i);assert(l.width>=3300);prior=l.width;
  assert(l.timeLimit>=300&&l.timeLimit<=800);assert(l.timeLimit>l.width/210+120);
  for(const c of l.checkpoints){
   assert(l.blocks.some(b=>b.content==='power'&&b.x>=c.x&&b.x<c.x+140&&Math.abs(b.y-(c.top-104))<1));
  }
  assert(l.blocks.every(b=>!b.reusable));
 }
});

test('coin boxes award one coin without replacing a power, and remain spent',()=>{
 run('start(0);transformPlayer(p,STATES.FIRE,solidsFor(level));var coinBox=level.blocks.find(b=>b.content==="coin");bumpBlock(coinBox);for(let n=0;n<60;n++)update(1/120)');
 assert.equal(run('score'),1);assert.equal(run('p.state'),'FIRE');run('bumpBlock(coinBox);for(let n=0;n<60;n++)update(1/120)');assert.equal(run('score'),1);
 for(let i=0;i<17;i++){const l=makeLevel(i);assert(l.blocks.some(b=>b.content==='coin'));assert(l.blocks.some(b=>b.content==='power'))}
});
test('cloud has three charges total; landing never refills, another flower does',()=>{
 run('start(0);transformPlayer(p,STATES.CLOUD,solidsFor(level));for(let n=0;n<4;n++){p.cool=0;power()}');
 assert.equal(run('clouds.length'),3);assert.equal(run('p.charges'),0);
 run('for(let n=0;n<60;n++)update(1/120)');assert.equal(run('p.charges'),0);
 run('items.push(createItem("cloud",p.x+14,p.y+28));update(1/120)');assert.equal(run('p.charges'),3);
});
test('cleared form persists through map, next stage and storage; Cloud gets three fresh charges',()=>{
 for(const state of Object.values(STATES)){
  run('resetLives(runState);runState.state=STATES.SMALL;start(0);transformPlayer(p,STATES.'+state+',solidsFor(level));p.charges=0;win();showMap();start(1)');
  assert.equal(run('p.state'),state);assert.equal(run('p.charges'),3);
  assert.equal(readRun({getItem:k=>storage.get(k)??null}).state,state);
 }
 run('p.y=700;update(1/120);deathScreen()');node('continue').onclick();assert.equal(run('p.state'),'SMALL');assert.equal(run('runState.state'),'SMALL');
});
test('boss landmarks and fortress interiors are distinct; lava instantly kills every form',()=>{
 assert.equal(makeLevel(8).theme,'tower');assert.equal(makeLevel(16).theme,'castle');assert(makeLevel(16).lava.length>=3);
 run('renderMap()');assert(node('island-map').innerHTML.includes('aria-hidden="true"'));
 for(const state of Object.values(STATES)){
  run('resetLives(runState);start(16);transformPlayer(p,STATES.'+state+',solidsFor(level));p.inv=999;var lava=level.lava[0];p.x=lava.x+40;p.y=lava.y;update(1/120)');
  assert.equal(run('mode'),'dying');assert.equal(run('deathReason'),'lava');assert.equal(run('runState.lives'),4);run('die("lava")');assert.equal(run('runState.lives'),4);
 }
});


test('map arrows follow visual trail bends, respect locks, animate and enter without a jump',()=>{
 assert.equal(mapNeighbor(5,'ArrowDown',17),6);assert.equal(mapNeighbor(6,'ArrowLeft',17),7);
 assert.equal(mapNeighbor(11,'ArrowDown',17),12);assert.equal(mapNeighbor(12,'ArrowRight',17),13);
 assert.equal(mapNeighbor(0,'ArrowRight',0),0);assert.equal(mapNeighbor(0,'ArrowLeft',17),0);
 assert.notEqual(mapPosition(0,1,.5).y,(MAP_POINTS[0].y+MAP_POINTS[1].y)/2);
 run('unlocked=17;level=null;runState.stage=5;showMap();walkMap("ArrowDown");walkMap("ArrowLeft")');assert.equal(run('mapTravel.to'),6);
 run('enterMap()');assert.equal(run('mode'),'map');run('stepMap(.4)');assert.equal(run('mapIndex'),6);
 run('enterMap(true);update(1/120)');assert.equal(run('mode'),'play');assert.equal(run('level.index'),6);assert(run('p.ground'));assert(run('entryHeld'));
 run('showMap()');assert.equal(run('mapIndex'),6);
});
test('single power supplies are separated; adjacent pairs exist only before boss fights',()=>{
 for(let i=0;i<17;i++){
  const l=makeLevel(i),boxes=l.blocks.filter(b=>b.content==='power').sort((a,b)=>a.x-b.x);
  for(let n=1;n<boxes.length;n++){const a=boxes[n-1],b=boxes[n];if(Math.abs(a.y-b.y)<80&&b.x-a.x<200)assert(l.boss&&a.x>=l.width-700&&b.x<l.width-450,i+' unexpected power pair '+a.x+' '+b.x)}
 }
});
test('all mandatory cloud crossings pass the real integrator with two charges and fail without clouds',()=>{
 for(const index of [3,4,9,15])for(let trialIndex=0;trialIndex<makeLevel(index).cloudTrials.length;trialIndex++){
  run('start('+index+');var trial=level.cloudTrials['+trialIndex+'];p.x=trial.edge-50;p.y=trial.top-28;p.ground=true;p.vx=330;transformPlayer(p,STATES.CLOUD,solidsFor(level));entryHeld=false');
  let used=0,spawned=false,reached=false;
  for(let n=0;n<1000;n++){
   const jump=run('p.ground&&(p.x>=trial.edge-45)');if(jump)spawned=false;
   run('keys.clear();keys.add("ShiftLeft");keys.add("ArrowRight");keys.add("Space");'+(jump?'pressed.add("Space");':''));
   if(!spawned&&used<2&&run('!p.ground&&p.vy>=0')){run('pressed.add("KeyX")');used++;spawned=true}
   run('update(1/120)');
   if(run('p.ground&&p.x>=trial.end')){reached=true;break}
   if(run('mode')!=='play')break;
  }
  assert(reached,'cloud crossing '+index+'/'+trialIndex);assert.equal(used,2);assert.equal(run('p.charges'),1);
  // A full running leap alone cannot span the gap, even with the elevated landing.
  const l=makeLevel(index),t=l.cloudTrials[trialIndex],p=createPlayer(t.edge-30,t.top-28);p.ground=true;p.vx=330;
  stepPlayer(p,{axis:1,run:true,jump:true,held:true},1/120,l,[]);
  for(let n=0;n<250&&p.y<=620;n++)stepPlayer(p,{axis:1,run:true,jump:false,held:true},1/120,l,[]);
  assert(p.y>620);assert(p.x<t.end);
 }
});
test('cloud supply works after Small death or another saved power; recovery rebuilds used supplies',()=>{
 for(const state of [STATES.SMALL,STATES.FIRE,STATES.HELICOPTER]){
  run('start(4);var trial=level.cloudTrials[0];checkpoint=trial.checkpoint;p.x=trial.start+80;p.y=trial.top-28;transformPlayer(p,STATES.'+state+',solidsFor(level));var supply=level.blocks.filter(b=>b.content==="power"&&b.x>trial.start&&b.x<trial.edge);var drops=[];activateBlock(supply[0],p,drops)');
  assert.equal(run('drops[0].type'),state===STATES.SMALL?'super':'cloud');
  run('transformPlayer(p,STATES.SUPER,solidsFor(level));activateBlock(supply[1],p,drops)');assert.equal(run('drops[1].type'),'cloud');
  const lives=run('runState.lives');run('p.charges=0;retryCloudTrial()');assert.equal(run('runState.lives'),lives);assert.equal(run('p.state'),'SMALL');assert.equal(run('items.length'),0);assert.equal(run('p.x'),run('level.checkpoints[checkpoint].x'));
  assert.equal(run('level.blocks.filter(b=>b.content==="power"&&b.x>trial.start&&b.x<trial.edge).every(b=>!b.used)'),true);
 }
 run('start(4);trial=level.cloudTrials[0];p.x=trial.edge-79;p.y=trial.top-48;transformPlayer(p,STATES.HELICOPTER,solidsFor(level));update(1/120)');assert(run('p.x')<run('trial.edge-80'));
});


test('coins cross stages and grant exactly one life at 50 while preserving remainder and saves',()=>{
 run('start(0);for(let n=0;n<20;n++)collectCoin();win();showMap();start(1)');assert.equal(run('runState.coins'),20);
 run('for(let n=0;n<20;n++)collectCoin();win();showMap();start(2)');assert.equal(run('runState.coins'),40);
 run('for(let n=0;n<10;n++)collectCoin()');assert.equal(run('runState.coins'),0);assert.equal(run('runState.lives'),6);
 run('runState.coins=49;for(let n=0;n<3;n++)collectCoin()');assert.equal(run('runState.coins'),2);assert.equal(run('runState.lives'),7);
 const saved=readRun({getItem:k=>storage.get(k)});assert.equal(saved.lives,7);assert.equal(saved.coins,2);
 const migrated=readRun({getItem:()=>JSON.stringify({lives:8,stage:3,state:'FIRE'})});assert.equal(migrated.lives,8);assert.equal(migrated.coins,0);assert.deepEqual(migrated.lifeClaims,[]);
 run('p.y=700;update(1/120);deathScreen()');node('continue').onclick();assert.equal(run('runState.coins'),2);
});
test('Game Over returns to map with five lives, coins and unlocks; pause quit discards checkpoint',()=>{
 run('unlocked=17;start(3);runState.coins=23;runState.lives=1;checkpoint=1;die();deathScreen()');assert.equal(run('mode'),'gameover');
 node('continue').onclick();assert.equal(run('mode'),'map');assert.equal(run('runState.lives'),5);assert.equal(run('runState.coins'),23);assert.equal(run('unlocked'),17);assert.equal(run('checkpoint'),0);
 run('runState.state=STATES.FIRE;start(3);checkpoint=1;transformPlayer(p,STATES.ICE,solidsFor(level));keys.add("ArrowRight");pause()');assert.equal(node('quit-level').hidden,false);
 node('quit-level').onclick();assert.equal(run('mode'),'map');assert.equal(run('keys.size'),0);assert.equal(run('runState.lives'),5);assert.equal(run('runState.coins'),23);assert.equal(run('checkpoint'),0);
 run('start(3)');assert.equal(run('p.x'),80);assert.equal(run('p.state'),'FIRE');assert.equal(run('remaining'),makeLevel(3).timeLimit);assert.equal(node('overlay').hidden,true);
});
test('one optional green mushroom per stage gives life without changing form and cannot be farmed',()=>{
 for(let i=0;i<17;i++)assert.equal(makeLevel(i).blocks.filter(b=>b.content==='life').length,1);
 for(const state of Object.values(STATES)){
  run('runState.lifeClaims=[];resetLives(runState);start(0);transformPlayer(p,STATES.'+state+',solidsFor(level));items.push(createItem("life",p.x+14,p.y+28));update(1/120)');
  assert.equal(run('runState.lives'),6);assert.equal(run('p.state'),state);
 }
 run('start(0)');assert.equal(run('level.blocks.find(b=>b.content==="life").used'),true);
 run('var totalItems=items.length;bumpBlock(level.blocks.find(b=>b.content==="life"))');assert.equal(run('items.length'),run('totalItems'));
 run('pause();quitLevel();start(0)');assert.equal(run('level.blocks.find(b=>b.content==="life").used'),true);
 assert(readRun({getItem:k=>storage.get(k)}).lifeClaims.includes(0));
 run('p.y=700;update(1/120);deathScreen()');node('continue').onclick();assert.equal(run('level.blocks.find(b=>b.content==="life").used'),true);
 run('win();start(0)');assert.equal(run('level.blocks.find(b=>b.content==="life").used'),false);
 run('start(4);var trial=level.cloudTrials[0];p.x=trial.start+80;runState.lifeClaims=[4];retryCloudTrial()');assert.equal(run('level.blocks.find(b=>b.content==="life").used'),true);
});
test('green mushroom emerges, obeys gravity and patrols like a growth mushroom',()=>{
 const l=makeLevel(0),p=grounded(),b=l.blocks.find(b=>b.content==='life'),items=[];activateBlock(b,p,items);assert.equal(items[0].type,'life');assert(items[0].emerge>0);
 const item=items[0],x=item.x;for(let n=0;n<100;n++)stepItems(items,1/120,l,p);assert(item.x>x);assert(item.vy>=0);
});
test('new rivals introduce distinct telegraphs, projectile arcs, jumping and armored health',()=>{
 assert(makeLevel(0).enemies.every(e=>e.kind==='basic'));const all=new Set(Array.from({length:17},(_,i)=>makeLevel(i).enemies).flat().map(e=>e.kind));for(const kind of ['basic','fire','hammer','jumper','plant'])assert(all.has(kind));
 for(const [kind,index] of [['fire',1],['hammer',7],['jumper',14]]){
  const l=makeLevel(index),e=l.enemies.find(e=>e.kind===kind);l.enemies=[e];const p=grounded();p.x=e.x+230;p.y=e.y;let sawWarning=false,sawJump=false,shots=[];
  for(let n=0;n<600;n++){stepEnemies(l,p,1/120,shots);sawWarning||=e.warning;sawJump||=e.y<e.baseY-20}
  assert(sawWarning,kind+' warning');assert(shots.length>0);assert(shots.every(s=>s.owner==='enemy'&&s.life<=3.5));
  if(kind==='hammer')assert(shots.some(s=>s.gravity===900&&s.vy<0));if(kind==='jumper')assert(sawJump);
  e.hp=2;e.hurt=0;e.frozen=0;e.alive=true;assert(strikeEnemy(e,'fire'));assert.equal(e.hp,1);assert(e.alive);assert(!strikeEnemy(e,'fire'));e.hurt=0;assert(strikeEnemy(e,'hammer'));assert(!e.alive);
 }
 const l=makeLevel(4),plant=l.enemies.find(e=>e.kind==='plant');l.enemies=[plant];const p=grounded();p.x=plant.x+180;assert(!plant.active);for(let n=0;n<330;n++)stepEnemies(l,p,1/120,[]);assert(plant.active);assert(!strikeEnemy(plant,'stomp'));assert(strikeEnemy(plant,'ice'));assert.equal(plant.frozen,ICE.duration);assert(strikeEnemy(plant,'stomp'));assert(!plant.alive);
 const shots=[];for(let n=0;n<100;n++)enemyShot(shots,{x:0,y:0,w:30},{x:200},'fire');assert.equal(shots.length,24);
});
test('enemy projectiles hit once, expire and stop at terrain; frozen rivals stop moving',()=>{
 run('start(0);p.inv=0;transformPlayer(p,STATES.FIRE,solidsFor(level));shots.push({x:p.x,y:p.y,w:14,h:14,vx:0,vy:0,gravity:0,type:"enemy",owner:"enemy",style:"fire",life:1});update(1/120)');assert.equal(run('p.state'),'SUPER');assert.equal(run('shots.length'),0);
 run('shots.push({x:200,y:480,w:14,h:14,vx:0,vy:0,gravity:0,type:"enemy",owner:"enemy",style:"fire",life:1});update(1/120)');assert.equal(run('shots.length'),0);
 run('shots.push({x:200,y:100,w:14,h:14,vx:0,vy:0,gravity:0,type:"enemy",owner:"enemy",style:"fire",life:.001});update(1/120)');assert.equal(run('shots.length'),0);
 const l=makeLevel(14),e=l.enemies[0],x=e.x;e.frozen=1;stepEnemies(l,grounded(),.5,[]);assert.equal(e.x,x);assert.equal(e.frozen,.5);
});
test('Storm King visits three safe docks, warns, recovers and intensifies; arena can be crossed',()=>{
 const l=makeLevel(16),b=l.chief,p=grounded();p.x=7450;const docks=new Set(),states=new Set(),shots=[];
 for(let n=0;n<4000;n++){stepFinalBoss(b,p,1/120,shots);states.add(b.state);assert(b.x>=7460&&b.x<=7940);assert(b.y>=220&&b.y<=390);assert(!l.platforms.some(t=>intersects(b,t)),'boss clipped a platform');if(b.state==='recover'){docks.add(b.dock);assert(l.platforms.some(t=>b.x>=t.x&&b.x+b.w<=t.x+t.w&&Math.abs(b.y+b.h-t.y)<1))}}
 assert.equal(docks.size,3);for(const s of ['warn','jump','recover','rest'])assert(states.has(s));assert(shots.length<=24);
 b.hp=8;stepFinalBoss(b,p,.01,[]);assert.equal(b.phase,2);b.hp=4;stepFinalBoss(b,p,.01,[]);assert.equal(b.phase,3);
 assert(l.lava.some(t=>t.x===7600));assert.equal(makeLevel(8).chief.hp,6);assert.equal(makeLevel(16).chief.hp,14);
});

test('final boss takes real stomps and projectiles; defeat opens the existing finish gate',()=>{
 run('start(16);p.x=level.chief.x+25;p.y=level.chief.y-49;p.h=48;p.state=STATES.SUPER;p.power="none";p.vy=160;p.ground=false;p.inv=0;entryHeld=false;update(1/120)');assert.equal(run('level.chief.hp'),13);assert(run('p.vy')<0);
 run('p.x=7400;p.y=422;p.inv=0;level.chief.cool=0;shots.push({x:level.chief.x+20,y:level.chief.y+30,w:16,h:16,vx:0,vy:0,type:"fire",life:1});update(1/120)');assert.equal(run('level.chief.hp'),12);
 run('level.chief.hp=1;level.chief.cool=0;shots.push({x:level.chief.x+20,y:level.chief.y+30,w:16,h:16,vx:0,vy:0,type:"fire",life:1});update(1/120)');assert.equal(run('level.chief.hp'),0);
 run('p.x=level.goal;p.y=422;p.vy=0;update(1/120)');assert.equal(run('mode'),'won');assert.equal(run('unlocked'),17);
});
test('Small Jarvis can cross the new arena platforms and gaps with normal running jumps',()=>{
 const l=makeLevel(16),p=createPlayer(7380,442);p.ground=true;let reached=false;
 for(let n=0;n<1400;n++){
  const floor=l.platforms.find(t=>Math.abs(t.y-(p.y+p.h))<2&&p.x+p.w>t.x&&p.x<t.x+t.w);
  const jump=p.ground&&floor&&p.x>floor.x+floor.w-65;
  stepPlayer(p,{axis:1,run:true,jump,held:true,down:false},1/120,l,[]);
  if(p.x>=l.goal&&p.ground){reached=true;break}if(p.y>620)break;
 }
 assert(reached,'arena path should not require any power');
});
test('every life block has a clear underside and can be hit by Small Jarvis with the real jump',()=>{
 for(let i=0;i<17;i++){
  const l=makeLevel(i),b=l.blocks.find(b=>b.content==='life'),p=createPlayer(b.x+4,b.y+144-28);p.ground=true;const items=[];
  for(let n=0;n<160;n++)stepPlayer(p,{axis:0,run:false,jump:n===0,held:true,down:false},1/120,l,[],block=>activateBlock(block,p,items));
  assert(b.used,'unreachable life block '+i);assert.equal(items[0].type,'life');
 }
});

test('Sentinel rejects Ice but accepts Fire, Hammer and stomps; Storm King rules stay intact',()=>{
 for(const [index,type,damage] of [[8,'ice',0],[8,'fire',1],[8,'hammer',1],[16,'ice',1]]){
  run('start('+index+');p.x=level.chief.x-200;p.y=422;p.inv=999;var hp=level.chief.hp;shots.push({x:level.chief.x+20,y:level.chief.y+30,w:16,h:16,vx:0,vy:0,type:"'+type+'",life:1});update(1/120)');
  assert.equal(run('level.chief.hp'),run('hp')-damage);assert.equal(run('shots.length'),0);assert.equal(run('level.chief.frozen'),undefined);
 }
 run('start(8);p.x=level.chief.x+25;p.y=level.chief.y-49;p.h=48;p.state=STATES.SUPER;p.vy=160;p.ground=false;p.inv=0;entryHeld=false;update(1/120)');assert.equal(run('level.chief.hp'),5);
 run('p.x=level.chief.x-200;p.y=422;shots.push({x:level.chief.x+20,y:level.chief.y+30,w:16,h:16,vx:0,vy:0,type:"fire",life:1});update(1/120)');assert.equal(run('level.chief.hp'),5);
});
test('hammer pickup has a dedicated silhouette, not the Ice flower pixel mask',()=>{
 function pixels(type){const points=[];const ctx={set fillStyle(c){this.c=c},fillRect(x,y,w,h){points.push([x,y,w,h])}};drawItem(ctx,{x:0,y:0,type,taken:false,emerge:0},0);return points}
 assert.notDeepEqual(pixels('hammer'),pixels('ice'));assert(pixels('hammer').some(p=>p[2]===26&&p[3]===14));
});
test('hidden blocks allow side and downward passage; upward head contact reveals one reward',()=>{
 const l={width:1000,theme:'meadow',platforms:[{x:0,y:470,w:1000,h:100}],blocks:[{x:300,y:360,w:32,h:32,kind:'item',hidden:true,revealed:false,used:false,content:'coin'}],enemies:[]};
 const b=l.blocks[0];assert(!solidsFor(l).includes(b));
 const side={x:260,y:365,w:24,h:28,vx:200,vy:0};moveBody(side,.5,solidsFor(l));assert(side.x>332);assert(!b.revealed);
 const down=createPlayer(304,310);down.vy=300;for(let n=0;n<50;n++)stepPlayer(down,{axis:0,held:false},1/120,l,[],()=>{throw Error('downward reveal')});assert(!b.revealed);assert(down.y>392);
 const p=createPlayer(304,442);p.ground=true;const items=[];
 for(let n=0;n<120;n++)stepPlayer(p,{axis:0,jump:n===0,held:true},1/120,l,[],block=>{if(revealBlock(block,l,items))activateBlock(block,p,items)});
 assert(b.revealed);assert(b.used);assert(solidsFor(l).includes(b));assert.equal(items.length,1);assert.equal(items[0].type,'coin');assert(canFit(p,solidsFor(l)));
 assert(!activateBlock(b,p,items));assert.equal(items.length,1);
 const walker={x:260,y:365,w:24,h:28,vx:200,vy:0};moveBody(walker,.5,solidsFor(l));assert.equal(walker.x,276);
});
test('hidden reveal refuses overlapping bodies and platforms instead of trapping them',()=>{
 const b={x:200,y:300,w:32,h:32,hidden:true,revealed:false};const e={x:205,y:305,w:30,h:32,alive:true};
 const l={enemies:[e],moving:[],falling:[]};assert(!revealBlock(b,l));assert(!b.revealed);e.x=400;
 l.moving=[{x:201,y:310,w:100,h:20}];assert(!revealBlock(b,l));l.moving=[];
 assert(!revealBlock(b,l,[{x:202,y:300,w:28,h:28,taken:false}]));assert(revealBlock(b,l,[]));b.revealed=false;l.enemies=[];const holder=createPlayer(170,300);holder.carry={w:30,h:32};assert(!revealBlock(b,l,[],holder));
});
test('authored hidden coin blocks are optional, reachable by Small and reset on new attempts',()=>{
 let total=0;
 for(let i=0;i<17;i++){
  const l=makeLevel(i);for(const b of l.blocks.filter(b=>b.hidden)){
   total++;assert.equal(b.content,'coin');assert(!b.revealed);const top=b.y+110,p=createPlayer(b.x+4,top-28);p.ground=true;const items=[];
   for(let n=0;n<120;n++)stepPlayer(p,{axis:0,jump:n===0,held:true},1/120,l,[],block=>{if(revealBlock(block,l,items))activateBlock(block,p,items)});
   assert(b.revealed,'hidden block unreachable '+i);assert.equal(items[0].type,'coin');assert(makeLevel(i).blocks.filter(b=>b.hidden).every(b=>!b.revealed));
  }
 }assert(total>=3);assert(makeLevel(0).blocks.some(b=>b.hidden));
});
test('block impacts hit only a supported enemy once and respect armor and frozen shattering',()=>{
 const b={x:100,y:300,w:32,h:32,kind:'item'},make=(x,y,kind='basic',hp=1)=>({x,y,w:30,h:32,kind,hp,alive:true,hurt:0,frozen:0,vy:0});
 const e=make(101,268),side=make(133,268),air=make(101,250),below=make(101,310),plant=make(101,268,'plant');
 const l={enemies:[e,side,air,below,plant]};assert.equal(impactBlock(b,l),1);assert(!e.alive);assert(side.alive&&air.alive&&below.alive&&plant.alive);assert.equal(plant.vy,0);assert.equal(impactBlock(b,l),0);
 const armor=make(101,268,'hammer',2);l.enemies=[armor];b.impactLock=0;assert.equal(impactBlock(b,l),1);assert.equal(armor.hp,1);assert(armor.alive);assert(armor.vy<0);b.impactLock=0;armor.vy=0;assert.equal(impactBlock(b,l),0);armor.hurt=0;assert.equal(impactBlock(b,l),0);b.impactLock=0;assert.equal(impactBlock(b,l),1);assert(!armor.alive);
 const frozen=make(101,268);frozen.frozen=3;l.enemies=[frozen];b.impactLock=0;impactBlock(b,l);assert(!frozen.alive);
 const terrain={...b,kind:undefined,impactLock:0};const basic=make(101,268);assert.equal(impactBlock(terrain,{enemies:[basic]}),0);assert(basic.alive);
 assert(!canBreakBlock(b,{enemies:[plant]}));
});
test('real head bumps affect patrols on item, spent and brick blocks; broken support makes survivors fall',()=>{
 for(const [kind,used,state] of [['item',false,'SMALL'],['item',true,'SMALL'],['brick',false,'SMALL'],['brick',false,'SUPER']]){
  run('start(0);level.platforms=[{x:0,y:470,w:1000,h:100}];level.blocks=[{x:300,y:380,w:32,h:32,kind:"'+kind+'",content:"coin",used:'+used+',broken:false,bump:0}];level.enemies=[{kind:"hammer",x:301,y:348,w:30,h:32,min:301,max:301,vx:0,vy:0,ground:true,alive:true,hp:2,hurt:0,frozen:0,age:0,attack:0,jumpTimer:0}];p.x=304;p.y=442;p.ground=true;transformPlayer(p,STATES.'+state+',solidsFor(level));pressed.add("Space");keys.add("Space");entryHeld=false');
  for(let n=0;n<90;n++)run('update(1/120)');assert.equal(run('level.enemies[0].hp'),1);assert.equal(run('level.blocks[0].broken'),kind==='brick'&&state==='SUPER');
  if(kind==='brick'&&state==='SUPER'){assert.equal(run('level.enemies[0].y+level.enemies[0].h'),470)}
 }
 for(const i of [7,11]){const l=makeLevel(i);assert(l.enemies.some(e=>l.blocks.some(b=>standsOnBlock(e,b))))}
});


function heldFixture(stage=0){run('start('+stage+');transformPlayer(p,STATES.FIRE,solidsFor(level));var held={x:p.x+45,y:p.y+p.h-32,w:30,h:32,kind:"basic",hp:1,alive:true,hurt:0,frozen:0,vx:25,vy:0,min:p.x,max:p.x+100,ground:true,age:0,attack:0,jumpTimer:0};level.enemies=[held];freezeEnemy(held);pressed.add("KeyE");update(1/120)');assert.equal(run('p.carry===held'),true)}
test('real interaction keys pick, drop and throw; carried ice takes priority over Fire power',()=>{
 heldFixture();run('pressed.add("KeyX");update(1/120)');assert.equal(run('p.carry'),null);assert.equal(run('held.iceState'),'thrown');assert.equal(run('shots.length'),0);
 heldFixture();run('pressed.add("KeyJ");update(1/120)');assert.equal(run('p.carry'),null);assert.equal(run('held.iceState'),'frozen');
 run('p.cool=0;keys.add("ArrowDown");pressed.add("KeyK");update(1/120)');assert.equal(run('held.alive'),false);assert.equal(run('shots.length'),0);
});
test('pause freezes held objects and timers; damage drops safely without restoring an active enemy',()=>{
 heldFixture();const timer=run('held.frozen');run('pause();last=0;frame(100);frame(2000)');assert.equal(run('held.frozen'),timer);assert.equal(run('held.iceState'),'carried');
 run('pause();p.inv=0;hit()');assert.equal(run('p.carry'),null);assert(['frozen','broken'].includes(run('held.iceState')));assert.equal(run('p.state'),'SUPER');
});
test('all stage exit and retry paths discard carried references without saving objects',()=>{
 for(const action of ['showMap()','quitLevel()','start(1)','respawn()','die()','win()','gameOver()']){
  heldFixture();run(action);assert.equal(run('p?.carry??null'),null,action);assert.equal(run('held.alive'),false,action);
 }
 heldFixture(4);run('p.x=level.cloudTrials[0].start+60;retryCloudTrial()');assert.equal(run('p.carry'),null);assert.equal(run('held.alive'),false);
 const data=readRun({getItem:k=>storage.get(k)});assert(!('carry' in data));
});

test('actual shell contacts stomp, kick away, hurt on return and stop on another stomp',()=>{
 run('start(0);level.width=2000;level.platforms=[{x:0,y:470,w:2000,h:100}];level.blocks=[];level.moving=[];level.falling=[];level.hazards=[];level.enemies=[{kind:"shell",x:300,y:438,w:30,h:32,min:200,max:400,vx:0,vy:0,ground:true,alive:true,hp:1,hurt:0,frozen:0,age:0,attack:0,jumpTimer:0}];p.state=STATES.SMALL;p.h=28;p.power="none";p.x=302;p.y=410;p.vy=160;p.ground=false;p.inv=0;update(1/120)');
 assert.equal(run('level.enemies[0].shellMode'),'idle');assert(run('p.vy')<0);
 run('var shell=level.enemies[0];shell.hurt=0;shell.contactGrace=0;p.x=278;p.y=442;p.vy=0;p.ground=true;update(1/120)');assert.equal(run('shell.shellMode'),'slide');assert(run('shell.vx')>0);
 run('shell.contactGrace=0;shell.x=350;shell.vx=-360;p.x=330;p.y=442;p.inv=0;update(1/120)');assert.equal(run('mode'),'dying');
});
test('actual boss pause freezes jump and retry clears engagement state',()=>{
 run('start(16);p.x=7450;p.inv=999');for(let n=0;n<240;n++)run('update(1/120)');assert.equal(run('level.chief.state'),'jump');
 const y=run('level.chief.y');run('pause();last=0;frame(100);frame(1000)');assert.equal(run('level.chief.y'),y);
 run('pause();p.x=7200');for(let n=0;n<150;n++)run('update(1/120)');assert.equal(run('level.chief.y'),390);
 run('start(16)');assert(!run('level.chief.engaged'));assert.equal(run('level.chief.state'),'rest');
});


test('stationary shell pickup shares the single carry slot and drops without launching',()=>{
 heldFixture();run('clearCarry(p);held.alive=true;held.kind="shell";held.frozen=0;held.iceState="normal";held.shellMode="idle";held.x=p.x+45;held.y=438;held.hurt=0;pressed.add("KeyE");update(1/120)');
 assert.equal(run('p.carry===held'),true);assert.equal(run('held.carryType'),'shell');assert.equal(run('held.frozen'),0);
 run('pressed.add("KeyJ");update(1/120)');assert.equal(run('p.carry'),null);assert.equal(run('held.shellMode'),'idle');assert.equal(run('held.vx'),0);assert.equal(run('held.iceState'),'normal');
});
test('shell launch with K slides without firing the current power and respects walls and bosses',()=>{
 run('held.x=p.x+45;held.hurt=0;pressed.add("KeyE");update(1/120)');assert(run('p.carry===held'));
 run('p.cool=0;pressed.add("KeyK");update(1/120)');assert.equal(run('p.carry'),null);assert.equal(run('held.shellMode'),'slide');assert.equal(run('held.vx'),360);assert.equal(run('shots.length'),0);
 run('level.chief={x:held.x+20,y:400,w:72,h:80,hp:6};stepEnemies(level,p,.05,shots)');assert.equal(run('level.chief.hp'),6);assert(!run('held.alive'));
});
test('moving shells cannot be picked up, nor can a frozen shell already launched',()=>{
 const l=makeLevel(1),e=l.enemies.find(e=>e.kind==='shell'),p2=createPlayer(e.x-45,442);e.shellMode='slide';assert(!pickIce(p2,l));e.shellMode='idle';e.iceState='thrown';e.frozen=6;assert(!pickIce(p2,l));
});
test('shell carry damage and all exits clean references without changing saved schema',()=>{
 for(const action of ['hit()','quitLevel()','start(1)','die()','win()','gameOver()']){
  heldFixture();run('held.kind="shell";held.carryType="shell";held.frozen=0;held.shellMode="idle";p.inv=0;'+action);assert.equal(run('p?.carry??null'),null,action);
 }
});
test('Space confirms a clear once and waits for release before entering any stage',()=>{
 for(const i of [0]){run('start('+i+');onKeyUp({code:"Space"});win()');assert.equal(run('mode'),'won');assert(node('overlay-copy').textContent.includes('press Space'));
 run('onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert.equal(run('mode'),'map');
 run('onKeyDown({code:"Space",repeat:true,preventDefault(){}});onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert.equal(run('mode'),'map');
 run('onKeyUp({code:"Space"});onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert.equal(run('mode'),'play');assert(run('entryHeld'));
 }
});
test('holding jump at the finish cannot dismiss the clear; mouse remains available',()=>{
 run('start(0);keys.add("Space");win();onKeyDown({code:"Space",repeat:true,preventDefault(){}});onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert.equal(run('mode'),'won');
 run('onKeyUp({code:"Space"});onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert.equal(run('mode'),'map');
 run('start(0);win()');node('continue').onclick();assert.equal(run('mode'),'map');assert(!run('mapSpaceBlocked'));
});
test('curved map positions reverse precisely and every adjacent destination is reachable',()=>{
 assert.equal(MAP_POINTS.length,17);assert.equal((mapRoute().match(/ Q /g)||[]).length,16);assert(mapLandscape().includes('GREEN VALLEY'));
 for(let i=0;i<16;i++){assert.deepEqual(mapPosition(i,i+1,0),MAP_POINTS[i]);assert.deepEqual(mapPosition(i,i+1,1),MAP_POINTS[i+1]);
  for(const t of [.2,.5,.8]){const a=mapPosition(i,i+1,t),b=mapPosition(i+1,i,1-t);assert(Math.hypot(a.x-b.x,a.y-b.y)<.00001)}
  assert(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].some(k=>mapNeighbor(i,k,17)===i+1));assert(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].some(k=>mapNeighbor(i+1,k,17)===i));assert(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].every(k=>mapNeighbor(i,k,i)<=i));
 }
});
test('Green Valley map preserves 17 destinations and selects the current node',()=>{
 run('unlocked=17;runState.stage=0;level=null;showMap()');assert.equal(node('world-title').textContent,'GREEN VALLEY');assert.equal((node('island-map').innerHTML.match(/data-stage=/g)||[]).length,17);assert(node('island-map').innerHTML.includes(' selected'));
 for(const at of MAP_POINTS)assert(at.x>40&&at.x<930&&at.y>60&&at.y<700);
});
test('death Space confirmation requires a fresh press and does not jump after respawning',()=>{
 run('resetLives(runState);start(0);entryHeld=false;keys.add("Space");die();deathScreen();onKeyDown({code:"Space",repeat:true,preventDefault(){}})');assert.equal(run('mode'),'dead');
 run('onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert.equal(run('mode'),'dead');
 run('onKeyUp({code:"Space"});onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert.equal(run('mode'),'play');assert(run('entryHeld'));const y=run('p.y');run('update(1/120)');assert.equal(run('p.y'),y);run('onKeyUp({code:"Space"})');
});
test('Game Over Space returns to the map once with five lives and preserved resources',()=>{
 run('resetLives(runState);start(0);entryHeld=false;runState.lives=1;runState.coins=23;die();deathScreen();onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert.equal(run('mode'),'map');assert.equal(run('runState.lives'),5);assert.equal(run('runState.coins'),23);
 run('onKeyDown({code:"Space",repeat:true,preventDefault(){}})');assert.equal(run('mode'),'map');run('onKeyUp({code:"Space"})');
});
test('Space pressed during the death animation must be released before the retry screen',()=>{
 run('start(0);entryHeld=false;die();onKeyDown({code:"Space",repeat:false,preventDefault(){}});deathScreen();onKeyDown({code:"Space",repeat:true,preventDefault(){}})');assert.equal(run('mode'),'dead');run('onKeyUp({code:"Space"})');node('continue').onclick();assert.equal(run('mode'),'play');
});
test('bonus entry and return preserve the main level instance, used boxes and elapsed time',()=>{
 run('start(0);var mainLevel=level;var entrance=Object.assign(level.portals.find(d=>d.kind==="bonus"),{trialCleared:true});level.blocks[0].used=true;remaining=200;usePortal(entrance)');assert(run('level.isBonus'));assert.equal(run('remaining'),200);
 run('var roomLevel=level;level.coins[0].taken=true;update(.25);restoreBonus()');assert(run('level===mainLevel'));assert(run('level.blocks[0].used'));assert.equal(run('remaining'),199.75);
 run('usePortal(entrance)');assert(run('level===roomLevel'));assert(run('level.coins[0].taken'));run('restoreBonus()');
});
test('bonus shard saves immediately and does not change the common coin counter',()=>{
 run('discoveries={relics:[],exits:[],cleared:[]};start(0);usePortal(Object.assign(level.portals.find(d=>d.kind==="bonus"),{trialCleared:true}));var specialShard=level.relics[0];var coinsBefore=runState.coins;p.x=specialShard.x;p.y=specialShard.y;p.vx=0;p.vy=0;update(1/120)');assert(run('discoveries.relics.includes(specialShard.id)'));assert.equal(run('runState.coins'),run('coinsBefore'));const id=run('specialShard.id');assert(secretHelpers.readDiscoveries({getItem:k=>storage.get(k)}).relics.includes(id));run('restoreBonus();start(0)');assert(run('discoveries.relics.includes("0:2")'));
});
test('death and quitting inside a bonus restore the parent stage and its checkpoint',()=>{
 run('start(5);checkpoint=1;usePortal(Object.assign(level.portals.find(d=>d.kind==="bonus"),{trialCleared:true}));die()');assert(!run('level.isBonus'));assert.equal(run('checkpoint'),1);run('deathScreen()');node('continue').onclick();assert.equal(run('level.index'),5);assert.equal(run('checkpoint'),1);
 run('start(0);usePortal(Object.assign(level.portals.find(d=>d.kind==="bonus"),{trialCleared:true}));quitLevel()');assert.equal(run('mode'),'map');assert.equal(run('bonusVisit'),null);assert(!run('level.isBonus'));
});
test('portal traversal refuses carried objects rather than cloning or losing them',()=>{
 heldFixture();run('var currentStage=level;usePortal(Object.assign(level.portals.find(d=>d.kind==="bonus"),{trialCleared:true}))');assert(run('level===currentStage'));assert(run('p.carry===held'));run('clearCarry(p)');
});
test('secret exit opens a usable map edge but skipped stages remain unfinished after a later clear',()=>{
 run('discoveries={relics:[],exits:[],cleared:[]};unlocked=1;start(1);entryHeld=false;usePortal(Object.assign(level.portals.find(d=>d.kind==="secret"),{trialCleared:true}))');assert.equal(run('mode'),'won');assert.equal(run('unlocked'),1);assert(!run('discoveries.cleared.includes(1)'));
 node('continue').onclick();run('openJunction(mapIndex);chooseJunction("secret")');assert.equal(run('mapTravel.to'),4);run('stepMap(.4);enterMap();win()');assert.equal(run('unlocked'),1);assert(run('discoveries.cleared.includes(4)'));assert(!run('stageCleared(3,unlocked,discoveries)'));assert(run('stageAvailable(5,unlocked,discoveries)'));
});
test('reset clears shards, secret exits and non-linear completions together with old progress',()=>{
 run('discoveries.relics.push("0:0");saveDiscoveries(discoveries,localStorage)');node('reset').onclick();assert.deepEqual(secretHelpers.readDiscoveries({getItem:k=>storage.get(k)}),{relics:[],exits:[],cleared:[]});assert.equal(run('unlocked'),0);assert.equal(run('runState.coins'),0);assert.equal(storage.get('jarvis-skybound-v1'),undefined);
});

test('bonus coin cannot be recollected by leaving and re-entering; pause freezes its timer',()=>{
 run('start(0);runState.coins=0;transformPlayer(p,STATES.FIRE,solidsFor(level));var arch=Object.assign(level.portals.find(d=>d.kind==="bonus"),{trialCleared:true});usePortal(arch);p.x=level.coins[0].x;p.y=422;p.ground=true;update(1/120)');assert.equal(run('runState.coins'),1);assert.equal(run('p.state'),'FIRE');
 run('var bonusTimer=remaining;pause();last=0;frame(100);frame(1000)');assert.equal(run('remaining'),run('bonusTimer'));run('pause();restoreBonus();usePortal(arch);p.x=level.coins[0].x;p.y=422;p.ground=true;update(1/120)');assert.equal(run('runState.coins'),1);run('restoreBonus()');
});
test('S, signs and discovered route list open an explicit crossroads choice',()=>{
 run('discoveries={relics:[],exits:[1],cleared:[]};unlocked=17;start(1);showMap();openJunction(mapIndex)');assert(run('junction'));assert.equal(run('mapTravel'),null);
 run('onKeyDown({code:"KeyA",repeat:false,preventDefault(){}})');assert.equal(run('mapTravel.to'),4);run('stepMap(.4)');assert.equal(run('junction'),null);
 run('onKeyDown({code:"KeyS",repeat:false,preventDefault(){}})');assert(run('junction'));run('chooseJunction("secret");stepMap(.4);mapIndex=0;renderMap();onKeyDown({code:"KeyS",repeat:false,preventDefault(){}})');assert.equal(node('shortcut-list').hidden,false);assert(node('shortcut-list').innerHTML.includes('data-shortcut="1"'));run('takeShortcut(1)');assert(run('junction'));run('chooseJunction("secret");stepMap(.4)');assert.equal(run('mapIndex'),4);assert(node('island-map').innerHTML.includes('data-route="1"'));
});
test('unsolved golden and purple arches enter power trials and a closed gate cannot be bypassed',()=>{
 for(const stage of [0,1,5,10,12]){run('start('+stage+');var door=level.portals[0];door.trialCleared=false;usePortal(door)');assert(run('level.isTrial'));assert.equal(run('level.power'),makeLevel(stage).power);run('usePortal(level.portals.find(d=>d.kind==="trial-finish"))');assert(run('level.isTrial'));assert(!run('level.trialSolved'));run('restoreBonus()')}
});
test('fire trial uses real projectiles to light three targets and opens the bonus room',()=>{
 run('discoveries={relics:[],exits:[],cleared:[]};start(0);usePortal(level.portals.find(d=>d.kind==="bonus"));transformPlayer(p,STATES.FIRE,solidsFor(level));entryHeld=false');
 for(const x of [650,860,1100]){run('p.x='+x+';p.y=422;p.vx=0;p.vy=0;p.face=1;p.cool=0;power()');for(let n=0;n<35;n++)run('update(1/120)')}
 assert(run('level.trialTargets.every(t=>t.lit)'));assert(run('level.gate.broken'));run('usePortal(level.portals.find(d=>d.kind==="trial-finish"))');assert(run('level.isBonus'));assert(run('bonusVisit'));run('restoreBonus()');
});
test('cloud trials are crossed with running jumps and two created cloud platforms',()=>{
 for(const stage of [4]){run('start('+stage+');usePortal(level.portals.find(d=>d.kind==="bonus"));p.x=570;p.ground=true;p.vx=330;transformPlayer(p,STATES.CLOUD,solidsFor(level));p.y=470-p.h;p.cool=0;entryHeld=false');let used=0,spawned=false,reached=false;
 for(let n=0;n<900;n++){const jump=run('p.ground&&p.x>=575');if(jump)spawned=false;run('keys.clear();keys.add("ShiftLeft");keys.add("ArrowRight");keys.add("Space");'+(jump?'pressed.add("Space");':''));if(!spawned&&used<2&&run('!p.ground&&p.vy>=0')){run('pressed.add("KeyX")');used++;spawned=true}run('update(1/120)');if(run('p.ground&&p.x>=1180')){reached=true;break}}
 assert(reached,'trial stage '+stage);assert(run('level.trialSolved'),'used '+used+' '+run('JSON.stringify({trial:level.isTrial,clouds:level.trialClouds,state:p.state,x:p.x})'));run('restoreBonus()');}
});
test('retry rebuilds the optional trial without life or timer refill; returning preserves it',()=>{
 run('start(10);usePortal(level.portals.find(d=>d.kind==="bonus"));var livesBefore=runState.lives;var timeBefore=remaining;level.blocks[0].used=true;retrySecretTrial()');assert.equal(run('runState.lives'),run('livesBefore'));assert.equal(run('remaining'),run('timeBefore'));assert(!run('level.blocks[0].used'));run('level.blocks[0].used=true;restoreBonus();usePortal(level.portals.find(d=>d.kind==="bonus"))');assert(run('level.blocks[0].used'));run('restoreBonus()');
});
test('helicopter secret trial reaches both high ledges with real boosts and opens its gate',()=>{
 run('start(1);usePortal(level.portals.find(d=>d.kind==="secret"));transformPlayer(p,STATES.HELICOPTER,solidsFor(level));p.x=580;p.y=470-p.h;p.ground=true;p.vx=0;p.cool=0;entryHeld=false');
 for(const target of [{x:700,top:310},{x:1000,top:180}]){
  run('p.cool=0;power();keys.clear();keys.add("Space");keys.add("ShiftLeft")');let landed=false;
  for(let n=0;n<240;n++){run('if(p.x<'+target.x+'){keys.add("ArrowRight")}else keys.delete("ArrowRight");update(1/120)');if(run('p.ground&&Math.abs(p.y+p.h-'+target.top+')<2')){landed=true;break}}
  assert(landed,'ledge '+target.top);if(target.top===310){run('p.x=750;p.vx=0')}
 }
 assert(run('level.trialSolved'));run('usePortal(level.portals.find(d=>d.kind==="trial-finish"))');assert.equal(run('mode'),'won');assert(run('discoveries.exits.includes(1)'));
});
test('hammer bonus requires real arcing hammer hits at three different ledges',()=>{
 run('start(5);usePortal(level.portals.find(d=>d.kind==="bonus"));transformPlayer(p,STATES.HAMMER,solidsFor(level));entryHeld=false');
 for(const pos of [{x:620,top:390},{x:880,top:330},{x:1115,top:390}]){run('p.x='+pos.x+';p.y='+pos.top+'-p.h;p.vx=0;p.vy=0;p.face=1;p.cool=0;p.ground=true;power()');for(let n=0;n<60;n++)run('update(1/120)')}
 assert(run('level.trialTargets.every(t=>t.lit)'));assert(run('level.trialSolved'));run('restoreBonus()');
});
test('ice trial requires two different frozen objects placed into sockets, not carried over them',()=>{
 run('start(10);usePortal(level.portals.find(d=>d.kind==="bonus"));transformPlayer(p,STATES.ICE,solidsFor(level));entryHeld=false');
 for(let i=0;i<2;i++){run('var trialFoe=level.enemies['+i+'];trialFoe.x=p.x+45;trialFoe.y=p.y+p.h-32;freezeEnemy(trialFoe);pickIce(p,level);var socket=level.receivers['+i+'];p.x=socket.x-30;p.y=socket.y+socket.h-p.h;stepCarriedAndThrown(level,p,0);stepSecretTrial(level,p,shots)');assert(!run('socket.charged'));run('releaseIce(p,level);stepSecretTrial(level,p,shots)');assert(run('socket.charged'));
 }
 assert(run('level.trialSolved'));run('usePortal(level.portals.find(d=>d.kind==="trial-finish"))');assert(run('level.isBonus'));run('restoreBonus()');
});
test('all six junction endpoints offer the correct secret destination and A travels both ways',()=>{
 for(const r of secretHelpers.SECRET_ROUTES)for(const point of [r.from,r.to]){run('discoveries={relics:[],exits:[1,5,12],cleared:[]};unlocked=17;start('+point+');showMap();openJunction(mapIndex)');assert.equal(run('junction.secret'),point===r.from?r.to:r.from);assert.equal(node('junction').hidden,false);run('onKeyDown({code:"KeyA",repeat:false,preventDefault(){}});stepMap(.4)');assert.equal(run('mapIndex'),point===r.from?r.to:r.from);assert.equal(run('junction'),null);assert.equal(run('mapTravel'),null)}
});
test('normal B follows the main trail and never marks any stage as cleared',()=>{
 run('discoveries={relics:[],exits:[1],cleared:[]};unlocked=2;start(1);showMap();openJunction(mapIndex);onKeyDown({code:"KeyB",repeat:false,preventDefault(){}})');assert.equal(run('mapTravel.to'),2);run('stepMap(.4)');assert.equal(run('mapIndex'),2);assert.equal(run('discoveries.cleared.length'),0);assert.equal(run('unlocked'),2);
});
test('when the normal next stage is locked, B enters the current stage without a phantom jump',()=>{
 run('discoveries={relics:[],exits:[1],cleared:[]};unlocked=1;start(4);showMap();openJunction(mapIndex);onKeyDown({code:"KeyB",repeat:false,preventDefault(){}})');assert.equal(run('mode'),'play');assert.equal(run('level.index'),4);assert(!run('entryHeld'));run('pressed.add("Space");keys.add("Space");update(1/120)');assert(run('p.vy')<0);
});
test('arrow selection and Enter confirm B; repeating or held Space cannot choose accidentally',()=>{
 run('unlocked=17;start(1);showMap();openJunction(mapIndex);onKeyDown({code:"KeyA",repeat:true,preventDefault(){}})');assert(run('junction'));assert.equal(run('mapTravel'),null);
 run('mapSpaceBlocked=true;onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert(run('junction'));run('onKeyUp({code:"Space"});onKeyDown({code:"ArrowDown",repeat:false,preventDefault(){}})');assert.equal(run('junction.selection'),'normal');run('onKeyDown({code:"Enter",repeat:false,preventDefault(){}})');assert.equal(run('mapTravel.to'),2);run('stepMap(.4)');
});
test('walking into a discovered endpoint opens its sign; Esc allows replaying the selected stage',()=>{
 run('discoveries={relics:[],exits:[1],cleared:[]};unlocked=17;start(0);showMap();openJunction(mapIndex);walkMap("ArrowRight");stepMap(.4)');assert.equal(run('junction.from'),1);run('onKeyDown({code:"Escape",repeat:false,preventDefault(){}})');assert.equal(run('junction'),null);run('enterMap()');assert.equal(run('level.index'),1);assert.equal(run('mode'),'play');
});
test('dialog buttons support click or touch, and hidden roads do not reveal undiscovered exits',()=>{
 run('discoveries={relics:[],exits:[],cleared:[]};unlocked=17;start(1);showMap();openJunction(mapIndex)');assert.equal(run('junction'),null);assert(!node('island-map').innerHTML.includes('data-junction'));
 run('discoveries.exits=[1];openJunction(1)');node('junction-a').onclick();run('stepMap(.4);openJunction(4)');node('junction-b').onclick();assert.equal(run('mapTravel.to'),5);run('stepMap(.4)');
});
test('bonus and secret are independent complete portal flows in every secret stage',()=>{
 for(const stage of [1,5,12]){
  run('discoveries={relics:[],exits:[],cleared:[]};start('+stage+');var parentTrail=level;var bonusDoor=level.portals.find(d=>d.kind==="bonus");var secretDoor=level.portals.find(d=>d.kind==="secret");usePortal(bonusDoor)');assert(run('level.isTrial'));assert.equal(run('level.sourcePortal.kind'),'bonus');run('level.trialSolved=true;usePortal(level.portals.find(d=>d.kind==="trial-finish"))');assert(run('level.isBonus'));assert(!run('discoveries.exits.includes('+stage+')'));run('var bonusShard=level.relics[0];p.x=bonusShard.x;p.y=bonusShard.y;p.vx=0;p.vy=0;update(1/120)');assert(run('discoveries.relics.includes("'+stage+':2")'));run('usePortal(level.portals.find(d=>d.kind==="return"))');assert(run('level===parentTrail'));assert.equal(run('mode'),'play');assert(!run('secretDoor.trialCleared'));run('usePortal(secretDoor)');assert.equal(run('level.sourcePortal.kind'),'secret');assert.equal(run('level.relics.length'),0);run('level.trialSolved=true;usePortal(level.portals.find(d=>d.kind==="trial-finish"))');assert.equal(run('mode'),'won');assert.equal(run('bonusVisit'),null);assert(run('level===parentTrail'));assert(run('discoveries.exits.includes('+stage+')'));assert.equal(run('discoveries.relics.length'),1);
 }
});
test('new helicopter bonus challenges are solvable with real boosts before returning to the stage',()=>{
 for(const stage of [1,12]){
  run('start('+stage+');usePortal(level.portals.find(d=>d.kind==="bonus"));transformPlayer(p,STATES.HELICOPTER,solidsFor(level));p.x=580;p.y=470-p.h;p.ground=true;p.vx=0;p.cool=0;entryHeld=false');
  for(const target of [{x:700,top:310},{x:1000,top:180}]){
   run('p.cool=0;power();keys.clear();keys.add("Space");keys.add("ShiftLeft")');let landed=false;
   for(let n=0;n<240;n++){run('if(p.x<'+target.x+'){keys.add("ArrowRight")}else keys.delete("ArrowRight");update(1/120)');if(run('p.ground&&Math.abs(p.y+p.h-'+target.top+')<2')){landed=true;break}}assert(landed);if(target.top===310)run('p.x=750;p.vx=0');
  }
  assert(run('level.trialSolved'));run('usePortal(level.portals.find(d=>d.kind==="trial-finish"))');assert(run('level.isBonus'));run('usePortal(level.portals.find(d=>d.kind==="return"))');assert.equal(run('mode'),'play');assert(!run('level.isTrial||level.isBonus'));
 }
});
test('every discovered crossroads has forward, backward and current stage access without false clears',()=>{
 for(const route of secretHelpers.SECRET_ROUTES){
  run('discoveries={relics:[],exits:['+route.from+'],cleared:[]};unlocked=1;start('+route.to+');showMap();openJunction(mapIndex)');assert.equal(node('junction-c').hidden,false);assert(node('junction-c').textContent.includes(run("STAGES["+(route.to-1)+"].name")));run('onKeyDown({code:"KeyC",repeat:false,preventDefault(){}});stepMap(.4)');assert.equal(run('mapIndex'),route.to-1);assert(run('stageAvailable(mapIndex,unlocked,discoveries)'));assert.equal(run('discoveries.cleared.length'),0);
  run('mapIndex='+route.to+';openJunction(mapIndex)');node('junction-d').onclick();assert.equal(run('mode'),'play');assert.equal(run('level.index'),route.to);
 }
 run('discoveries={relics:[],exits:[1,5,12],cleared:[]};unlocked=17;start(5);showMap();openJunction(mapIndex);onKeyDown({code:"Digit3",repeat:false,preventDefault(){}});stepMap(.4)');assert.equal(run('mapIndex'),4);run('chooseJunction("back");stepMap(.4)');assert.equal(run('mapIndex'),3);
});
test('returning from clear or quit leaves crossroads closed until leaving and walking back',()=>{
 for(const i of [1,4,5,9,12,15]){
  run('unlocked=17;discoveries={relics:[],exits:[1,5,12],cleared:[]};start('+i+');win()');node('continue').onclick();assert.equal(run('mode'),'map');assert.equal(run('junction'),null);assert.equal(node('junction').hidden,true);
  run('var returnIndex=mapIndex;var walkKey=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].find(k=>mapNeighbor(mapIndex,k,unlocked,n=>stageAvailable(n,unlocked,discoveries))!==mapIndex);walkMap(walkKey);stepMap(.4)');if(run('junction'))run('closeJunction()');run('walkKey=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].find(k=>mapNeighbor(mapIndex,k,unlocked,n=>stageAvailable(n,unlocked,discoveries))===returnIndex);walkMap(walkKey);stepMap(.4)');assert.equal(run('mapIndex'),i);assert(run('junction'));
  run('closeJunction();start('+i+');quitLevel()');assert.equal(run('junction'),null);run('openJunction(mapIndex)');assert(run('junction'));
 }
});
test('final boss defeat clears its stage immediately and leads through the beanstalk to the sky kingdom',()=>{
 run('discoveries={relics:[],exits:[],cleared:[]};start(16);p.inv=999;p.x=level.chief.x-200;level.chief.hp=0;update(1/120)');assert.equal(run('mode'),'won');assert.equal(node('overlay-title').textContent,'Fase concluída!');assert(run('discoveries.cleared.includes(16)'));node('continue').onclick();assert.equal(run('mode'),'ending');
 run('var endingTimer=remaining;var endingLives=runState.lives;var endingCoins=runState.coins;last=0;frame(100)');for(let i=2;i<125;i++)run('frame('+i*100+')');assert.equal(run('mode'),'ending-message');assert.equal(run('ending.scene'),'kingdom');assert.equal(run('remaining'),run('endingTimer'));assert.equal(run('runState.lives'),run('endingLives'));assert.equal(run('runState.coins'),run('endingCoins'));assert(node('overlay-copy').textContent.includes('conquistou o céu'));node('continue').onclick();assert(node('overlay-copy').textContent.includes('0/51'));assert(!node('overlay-title').textContent.includes('100%'));node('continue').onclick();assert.equal(run('mode'),'map');assert.equal(run('junction'),null);
});
test('ending distinguishes 50 from 51 unique valid shards and ignores duplicate or invalid IDs',()=>{
 const ids=Array.from({length:51},(_,n)=>Math.floor(n/3)+':'+n%3);assert.equal(endingHelpers.endingCollection({relics:ids.slice(0,50)}).complete,false);assert.equal(endingHelpers.endingCollection({relics:[...ids,...ids,'99:0']}).count,51);
 run('start(16);discoveries.relics='+JSON.stringify(ids)+';win()');node('continue').onclick();run('ending.time=12;ending.scene="kingdom";endingVictory()');node('continue').onclick();assert(node('overlay-title').textContent.includes('100%'));assert(node('overlay-copy').textContent.includes('51/51'));node('continue').onclick();assert.equal(run('mode'),'map');assert.equal(run('discoveries.relics.length'),51);
});
test('all ending scenes render and a held confirmation cannot skip both ending messages',()=>{
 run('start(16);win()');node('continue').onclick();for(const time of [0,3.5,5,8.5,10,12])run('ending.time='+time+';ending.scene=ending.time<3.5?"trail":ending.time<8?"climb":ending.time<9?"transition":"kingdom";draw()');run('endingVictory();onKeyUp({code:"Space"});onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert(node('overlay-title').textContent.includes('100%'));run('onKeyDown({code:"Space",repeat:true,preventDefault(){}});onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert.equal(run('mode'),'ending-message');run('onKeyUp({code:"Space"});onKeyDown({code:"Space",repeat:false,preventDefault(){}})');assert.equal(run('mode'),'map');
});
console.log(count+' test groups passed.');

