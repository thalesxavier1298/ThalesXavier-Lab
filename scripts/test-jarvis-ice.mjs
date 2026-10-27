import {stepWorld} from '../public/jarvis/world.mjs';
import assert from 'node:assert/strict';
import {ICE,freezeEnemy,stepFrozen,pickIce,releaseIce,clearCarry,smashIce,stepCarriedAndThrown,breakIce} from '../public/jarvis/ice.mjs';
import {createPlayer,stepPlayer,transformPlayer} from '../public/jarvis/player.mjs';
import {solidsFor,intersects,carryBox,canFit} from '../public/jarvis/physics.mjs';
import {stepEnemies,strikeEnemy} from '../public/jarvis/encounters.mjs';
import {makeLevel} from '../public/jarvis/levels.mjs';
import {STATES} from '../public/jarvis/config.mjs';
let count=0;const test=(name,fn)=>{fn();count++;console.log('PASS '+name)};
const level=()=>({width:2000,theme:'meadow',platforms:[{x:0,y:470,w:2000,h:100}],blocks:[],enemies:[],moving:[],falling:[],lava:[]});
const player=(x=100)=>{const p=createPlayer(x,442);p.ground=true;return p};
const enemy=(x=145,kind='basic',hp=1)=>({x,y:438,w:30,h:32,kind,hp,alive:true,hurt:0,frozen:0,vx:32,vy:0,min:x-80,max:x+80,ground:true,age:0,attack:0,jumpTimer:0,active:true});
const neutral={axis:0,held:false,jump:false,down:false};
function tick(l,p,n=1){for(let i=0;i<n;i++){stepPlayer(p,neutral,1/120,l,[]);stepCarriedAndThrown(l,p,1/120);stepEnemies(l,p,1/120,[])}}

test('freeze makes a solid support with gravity and never restores attacks while carried',()=>{
 const l=level(),p=player(110),e=enemy(145);l.enemies=[e];assert(freezeEnemy(e));assert.equal(e.iceState,'frozen');assert(solidsFor(l).includes(e));
 assert(pickIce(p,l));const timer=e.frozen;for(let n=0;n<1200;n++){stepCarriedAndThrown(l,p,1/120);stepEnemies(l,p,1/120,[])}
 assert.equal(e.frozen,timer);assert.equal(e.iceState,'carried');assert(!solidsFor(l).includes(e));assert.equal(e.attack,0);
});
test('pickup requires proximity, free space and a path without walls; plants stay anchored',()=>{
 const l=level(),p=player(),e=enemy(300);l.enemies=[e];freezeEnemy(e);assert(!pickIce(p,l));
 e.x=145;l.platforms.push({x:130,y:380,w:8,h:90});assert(!pickIce(p,l));l.platforms.pop();e.kind='plant';assert(!pickIce(p,l));e.kind='basic';assert(pickIce(p,l));
 const other=enemy(200);freezeEnemy(other);l.enemies.push(other);assert(!pickIce(p,l));
});
test('carrier substeps stop at walls and low ceilings and prevent unsafe direction changes',()=>{
 const l=level(),p=player(),e=enemy(145);l.enemies=[e];freezeEnemy(e);assert(pickIce(p,l));l.platforms.push({x:235,y:350,w:20,h:120});
 for(let n=0;n<150;n++){stepPlayer(p,{...neutral,axis:1,run:true},1/120,l,[]);stepCarriedAndThrown(l,p,1/120);assert(!intersects(carryBox(p),l.platforms[1]))}
 assert(p.x<181);assert(canFit(p,solidsFor(l)));
 l.platforms.push({x:p.x-33,y:430,w:6,h:36});stepPlayer(p,{...neutral,axis:-1},1/120,l,[]);assert.equal(p.face,1);
 const top=p.y; l.platforms.push({x:p.x+p.w+5,y:395,w:45,h:20});
 for(let n=0;n<90;n++){stepPlayer(p,{...neutral,jump:n===0,held:true},1/120,l,[]);stepCarriedAndThrown(l,p,1/120);assert(!l.platforms.some(b=>intersects(carryBox(p),b)))}assert(p.y<=top+.1);
});
test('safe drop resumes timer; blocked drop keeps the item; forced cleanup breaks only once',()=>{
 const l=level(),p=player(),e=enemy(145);l.enemies=[e];freezeEnemy(e);pickIce(p,l);const timer=e.frozen;
 assert(releaseIce(p,l));assert.equal(p.carry,null);assert.equal(e.iceState,'frozen');stepEnemies(l,p,.5,[]);assert(e.frozen<timer);
 assert(pickIce(p,l));l.platforms.push({...carryBox(p)},{...carryBox(p),x:carryBox(p).x+6});assert(!releaseIce(p,l));assert.equal(p.carry,e);
 let broken=0;releaseIce(p,l,{force:true,onBreak:()=>broken++});assert.equal(p.carry,null);assert.equal(e.iceState,'broken');assert.equal(broken,1);clearCarry(p,()=>broken++);assert.equal(broken,1);
});
test('throw hits the first target once; armor takes two damage; a wall protects targets behind it',()=>{
 for(const wall of [false,true]){
  const l=level(),p=player(),e=enemy(145),target=enemy(260,'hammer',3);l.enemies=[e,target];freezeEnemy(e);pickIce(p,l);p.y=330;stepCarriedAndThrown(l,p,0);assert(releaseIce(p,l,{throwing:true}));target.y=e.y;
  if(wall)l.platforms.push({x:220,y:250,w:8,h:220});let breaks=0;
  for(let n=0;n<100;n++)stepCarriedAndThrown(l,p,1/120,()=>breaks++);
  assert.equal(e.iceState,'broken');assert.equal(breaks,1);assert.equal(target.hp,wall?3:1);
 }
});
test('landings keep thrown ice sliding without a lifetime or thaw; edges still remove it',()=>{
 const l=level(),p=player(1600),e=enemy(200);l.width=20000;l.platforms[0].w=20000;l.enemies=[e];freezeEnemy(e);Object.assign(e,{iceState:'thrown',x:200,y:430,vx:420,vy:500});
 for(let n=0;n<1200;n++)stepCarriedAndThrown(l,p,1/120);assert(e.alive);assert.equal(e.iceState,'thrown');assert.equal(e.vx,420);assert(e.x>4300);assert.equal(e.y+e.h,470);assert.equal(e.frozen,6);
 l.width=e.x+10;stepCarriedAndThrown(l,p,.1);assert.equal(e.iceState,'broken');
});

test('standing on ice does not shatter it; Down + power explicitly breaks nearby ice',()=>{
 const l=level(),e=enemy(200),p=player(202);l.enemies=[e];freezeEnemy(e);p.y=350;p.ground=false;
 tick(l,p,90);assert(e.alive);assert.equal(p.y+p.h,e.y);assert(p.ground);assert(smashIce(p,l));assert(!e.alive);
});
test('thaw warns and waits near Jarvis or another body; safe thaw gives grace and resets attacks',()=>{
 const l=level(),p=player(145),e=enemy(145);l.enemies=[e];freezeEnemy(e,.01);stepEnemies(l,p,.02,[]);assert.equal(e.iceState,'frozen');assert(e.iceWarning);
 p.x=700;const blocker=enemy(145);l.enemies.push(blocker);stepEnemies(l,p,.3,[]);assert.equal(e.iceState,'frozen');blocker.x=900;
 e.attack=4;stepEnemies(l,p,.3,[]);assert.equal(e.iceState,'normal');assert(e.thawGrace>0);assert.equal(e.attack,0);assert.equal(e.frozen,0);
});
test('thrown ice cannot damage either boss or exploit the Sentinel immunity',()=>{
 for(const hp of [6,14]){const l=level(),p=player(600),e=enemy(200);l.enemies=[e];l.chief={x:240,y:380,w:72,h:80,hp};freezeEnemy(e);Object.assign(e,{iceState:'thrown',x:200,y:400,vx:420,vy:0});for(let n=0;n<30;n++)stepCarriedAndThrown(l,p,1/120);assert.equal(l.chief.hp,hp);assert.equal(e.iceState,'broken')}
});
test('plants freeze and break but never move into a carried state; blocks still shatter frozen enemies',()=>{
 const l=level(),p=player(100),plant=enemy(145,'plant');l.enemies=[plant];freezeEnemy(plant);assert(!pickIce(p,l));assert(strikeEnemy(plant,'stomp'));assert.equal(plant.iceState,'broken');
 const e=enemy();freezeEnemy(e);assert(strikeEnemy(e,'block'));assert.equal(e.iceState,'broken');
});
test('practice areas remain optional and preserve the original power and goal',()=>{
 for(const i of [2,10]){const l=makeLevel(i);assert.equal(l.power,'ice');assert(l.signs.some(s=>/GRAB/.test(s.label)));assert(l.platforms.some(b=>b.y===470&&l.goal>=b.x&&l.goal<b.x+b.w))}
});
test('carried bodies remain inside world edges and frozen bodies melt in lava',()=>{
 const l=level(),p=player(100),e=enemy(145);l.enemies=[e];freezeEnemy(e);assert(pickIce(p,l));
 for(let n=0;n<1500;n++){stepPlayer(p,{...neutral,axis:1,run:true},1/120,l,[]);stepCarriedAndThrown(l,p,1/120)}assert(carryBox(p).x+e.w<=l.width);
 p.face=-1;p.x=40;stepCarriedAndThrown(l,p,0);for(let n=0;n<100;n++){stepPlayer(p,{...neutral,axis:-1,run:true},1/120,l,[]);stepCarriedAndThrown(l,p,1/120)}assert(carryBox(p).x>=0);
 clearCarry(p);const f=enemy(400);freezeEnemy(f);l.enemies=[f];l.lava=[{x:390,y:430,w:100,h:80}];stepEnemies(l,p,.01,[]);assert(!f.alive);
});
test('a lift reverses when the carried block reaches a ceiling without clipping the rider',()=>{
 const l=makeLevel(2),b=l.moving[0];l.moving=[b];l.falling=[];l.blocks=[];
 Object.assign(b,{x:0,y:400,originX:0,originY:400,toX:0,toY:180,w:180,speed:80,progress:0,direction:1});
 const p=player(30);p.y=372;const e=enemy(75);e.iceState='carried';e.frozen=6;p.carry=e;l.enemies=[e];
 const ceiling={x:60,y:300,w:70,h:20};l.platforms=[ceiling];
 for(let n=0;n<500;n++){stepWorld(l,p,1/120);stepPlayer(p,neutral,1/120,l,[]);stepCarriedAndThrown(l,p,1/120);assert(!intersects(carryBox(p),ceiling));assert(!intersects(p,ceiling))}
});
console.log(count+' ice test groups passed.');


