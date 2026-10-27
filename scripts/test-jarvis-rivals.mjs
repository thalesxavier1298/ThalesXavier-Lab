import assert from 'node:assert/strict';
import {makeLevel} from '../public/jarvis/levels.mjs';
import {stepEnemies,strikeEnemy,stepFinalBoss,stepShell} from '../public/jarvis/encounters.mjs';
import {freezeEnemy,stepCarriedAndThrown,pickIce,releaseIce} from '../public/jarvis/ice.mjs';
import {solidsFor,intersects} from '../public/jarvis/physics.mjs';
let count=0;const test=(name,fn)=>{fn();count++;console.log('PASS '+name)};
const enemy=(kind,x=200,hp=1)=>({kind,x,y:438,w:30,h:32,min:x-80,max:x+80,vx:30,vy:0,baseY:438,ground:true,frozen:0,alive:true,hp,hurt:0,age:0,attack:0,jumpTimer:0,active:true});
const scene=()=>({width:20000,index:10,platforms:[{x:0,y:470,w:20000,h:100}],blocks:[],moving:[],falling:[],enemies:[],lava:[]});
const p=()=>({x:100,y:422,w:24,h:48,face:1,carry:null});
const tick=(l,player,secs,shots=[])=>{for(let i=0;i<secs*120;i++){stepCarriedAndThrown(l,player,1/120);stepEnemies(l,player,1/120,shots)}};

test('ice slides beyond old lifetime, chains ordinary targets and breaks on a wall',()=>{
 const l=scene(),e=enemy('basic',145),player=p();l.enemies=[e,enemy('basic',500),enemy('basic',1400),enemy('basic',2500)];for(const t of l.enemies)t.vx=0;
 freezeEnemy(e);assert(pickIce(player,l));assert(releaseIce(player,l,{throwing:true}));tick(l,player,7);assert(e.alive);assert.equal(e.iceState,'thrown');assert(l.enemies.slice(1).every(t=>!t.alive));assert.equal(e.vx,420);assert.equal(e.frozen,6);
 l.platforms.push({x:e.x+100,y:300,w:8,h:170});tick(l,player,1);assert(!e.alive);
});
test('ice hits armor once and breaks against a surviving resistant target',()=>{
 const l=scene(),player=p(),e=enemy('basic',145),armor=enemy('hammer',300,3);armor.vx=0;l.enemies=[e,armor];freezeEnemy(e);pickIce(player,l);releaseIce(player,l,{throwing:true});tick(l,player,1);assert(!e.alive);assert.equal(armor.hp,1);
});
test('ice drops without sliding and frozen fire plants cannot be picked up',()=>{
 const l=scene(),player=p(),e=enemy('basic',145);l.enemies=[e];freezeEnemy(e);pickIce(player,l);releaseIce(player,l);assert.equal(e.vx,0);assert.equal(e.iceState,'frozen');
 const plant=enemy('fireplant',145);l.enemies=[plant];freezeEnemy(plant);assert(!pickIce(player,l));assert(!solidsFor(l).includes(plant));
});
test('thrown ice falls into a gap and breaks in lava',()=>{
 for(const lava of [false,true]){const l=scene(),e=enemy('basic',145);l.platforms=[{x:0,y:470,w:300,h:100}];if(lava)l.lava=[{x:300,y:490,w:800,h:100}];l.enemies=[e];freezeEnemy(e);Object.assign(e,{iceState:'thrown',vx:420,vy:0});tick(l,p(),2);assert(!e.alive)}
});
test('shell stomps stop, kicks launch both ways, Fire and Hammer defeat it',()=>{
 for(const dir of ['left','right']){const e=enemy('shell');assert(strikeEnemy(e));assert.equal(e.shellMode,'idle');assert(e.alive);e.hurt=0;assert(strikeEnemy(e,'kick-'+dir));assert.equal(e.shellMode,'slide');assert.equal(Math.sign(e.vx),dir==='left'?-1:1);e.hurt=0;strikeEnemy(e);assert.equal(e.vx,0);assert(e.alive)}
 for(const type of ['fire','hammer']){const e=enemy('shell');strikeEnemy(e,type);assert(!e.alive)}
});
test('moving shells bounce on thin walls, defeat targets and shatter frozen rivals',()=>{
 const l=scene(),e=enemy('shell',180),t=enemy('hammer',310,2),f=enemy('basic',400);t.vx=0;freezeEnemy(f);l.enemies=[e,t,f];strikeEnemy(e);e.hurt=0;strikeEnemy(e,'kick-right');l.platforms.push({x:600,y:300,w:4,h:170});
 tick(l,{...p(),x:900},1.4);assert(!t.alive);assert(!f.alive);assert(e.alive);assert(e.vx<0);assert(e.x<600);
});
test('shells fall and die in lava rather than patrolling across empty ground',()=>{
 const l=scene(),e=enemy('shell',180);l.platforms=[{x:0,y:470,w:260,h:100}];l.enemies=[e];strikeEnemy(e);e.hurt=0;strikeEnemy(e,'kick-right');tick(l,p(),2);assert(!e.alive);
});
test('fire plants telegraph shots, pause while frozen and stay fixed',()=>{
 const l=scene(),e=enemy('fireplant',300),player={...p(),x:600};e.vx=0;e.active=false;l.enemies=[e];const shots=[];let warning=false;
 for(let n=0;n<600;n++){stepEnemies(l,player,1/120,shots);warning||=e.warning}assert(warning);assert(shots.length>0);assert.equal(e.x,300);assert.equal(e.y,438);assert(!strikeEnemy(e,'stomp'));
 freezeEnemy(e);const total=shots.length;tick(l,player,2,shots);assert.equal(shots.length,total);assert(strikeEnemy(e,'fire'));assert(!e.alive);
});
test('flyers patrol predictably, fall while frozen, thaw safely and accept stomps',()=>{
 const l=scene(),e=enemy('flyer',300),player={...p(),x:900};e.y=e.baseY=300;l.enemies=[e];let min=999,max=0;
 for(let n=0;n<600;n++){stepEnemies(l,player,1/120,[]);min=Math.min(min,e.y);max=Math.max(max,e.y);assert(e.x>=e.min&&e.x<=e.max)}assert(max-min>30);
 freezeEnemy(e);tick(l,player,2);assert.equal(e.y+e.h,470);tick(l,player,5);assert.equal(e.iceState,'normal');assert(!l.platforms.some(b=>intersects(e,b)));assert(strikeEnemy(e));assert(!e.alive);
});
test('campaign introduces all archetypes gradually and protects cloud trials and checkpoints',()=>{
 assert(makeLevel(0).enemies.every(e=>e.kind==='basic'));assert(makeLevel(1).enemies.some(e=>e.kind==='shell'));assert(makeLevel(5).enemies.some(e=>e.kind==='flyer'));assert(makeLevel(10).enemies.some(e=>e.kind==='fireplant'));
 for(let i=0;i<17;i++){const l=makeLevel(i);for(const e of l.enemies.filter(e=>['shell','flyer','fireplant'].includes(e.kind))){assert(!l.checkpoints.some(c=>Math.abs(c.x-e.x)<190));assert(!l.cloudTrials?.some(t=>e.x>=t.start-180));assert(!solidsFor(l,e).some(b=>intersects(e,b)));if(e.kind==='flyer')assert(i>=5);if(e.kind==='fireplant')assert(i>=7)}}
});
test('the final boss first jump finishes after Jarvis retreats across the old activation boundary',()=>{
 for(const hp of [14,8,4]){const b=makeLevel(16).chief;b.hp=hp;const player={...p(),x:7450};let n=0;while(b.state!=='jump'&&n++<500)stepFinalBoss(b,player,1/120,[]);assert.equal(b.state,'jump');player.x=7200;const firstY=b.y;let top=firstY;
 for(let k=0;k<160;k++){stepFinalBoss(b,player,1/120,[]);top=Math.min(top,b.y)}assert(top<firstY-100);assert.equal(b.state,'recover');assert.equal(b.y,390);assert.equal(b.dock,0);
 }
});
test('unstarted boss waits, jump duration remains stable when damage changes its phase',()=>{
 const b=makeLevel(16).chief,player=p();for(let n=0;n<600;n++)stepFinalBoss(b,player,1/120,[]);assert.equal(b.state,'rest');assert.equal(b.elapsed,0);player.x=7450;while(b.state!=='jump')stepFinalBoss(b,player,1/120,[]);
 const duration=b.jumpDuration;for(let n=0;n<30;n++)stepFinalBoss(b,player,1/120,[]);b.hp=4;stepFinalBoss(b,player,1/120,[]);assert.equal(b.jumpDuration,duration);for(let n=0;n<120;n++)stepFinalBoss(b,player,1/120,[]);assert.equal(b.y,390);
});
test('every archetype handles powers, block impacts and roots consistently',()=>{
 for(const kind of ['basic','fire','hammer','jumper','plant','shell','fireplant','flyer']){
  for(const type of ['ice','fire','hammer','block']){const e=enemy(kind);assert(strikeEnemy(e,type));if(type==='ice')assert.equal(e.iceState,'frozen');else if(kind==='shell'&&type==='block'){assert(e.alive);assert.equal(e.shellMode,'idle')}else assert(!e.alive)}
  const e=enemy(kind);const landed=strikeEnemy(e,'stomp');assert.equal(landed,!['plant','fireplant'].includes(kind));
 }
});
console.log(count+' checkpoint 9 test groups passed.');
