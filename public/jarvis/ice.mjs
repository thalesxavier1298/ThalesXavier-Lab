import {intersects,solidsFor,moveBody,carryBox} from './physics.mjs';
export const ICE={duration:6,warning:1.5,throwSpeed:420,launchVy:-180,gravity:1100};
export function freezeEnemy(e,duration=ICE.duration){
 if(!e.alive||e.iceState==='carried'||e.iceState==='thrown')return false;
 if(e.iceState!=='frozen')e.patrolVx=e.vx;
 e.frozen=duration;e.iceState='frozen';e.attack=0;e.warning=false;return true;
}
export function breakIce(e,onBreak=()=>{}){if(!e.alive)return false;e.alive=false;e.frozen=0;e.iceState='broken';onBreak(e);return true}
export function stepFrozen(e,level,p,dt){
 if(e.frozen>0&&!e.iceState)freezeEnemy(e,e.frozen);
 if(e.iceState==='carried'||e.iceState==='thrown')return true;
 if(e.iceState!=='frozen')return false;
 const vx=e.vx;e.vx=0;e.vy=Math.min(650,(e.vy||0)+ICE.gravity*dt);
 if(!['plant','fireplant'].includes(e.kind))moveBody(e,dt,solidsFor(level,e));e.vx=vx;
 if(e.y>650||(level.lava||[]).some(b=>intersects(e,b))){breakIce(e);return true}
 e.frozen=Math.max(0,e.frozen-dt);e.iceWarning=e.frozen<=ICE.warning;
 if(e.frozen>0)return true;
 const danger={x:e.x-14,y:e.y-10,w:e.w+28,h:e.h+20};
 if(intersects(danger,p)||solidsFor(level,e).some(b=>intersects(e,b))||level.enemies.some(other=>other!==e&&other.alive&&intersects(e,other))){e.frozen=.2;return true}
 e.iceState='normal';if(e.kind==='flyer'){e.baseY=e.y;e.age=0}e.iceWarning=false;e.thawGrace=.8;e.attack=0;e.jumpTimer=0;e.warning=false;e.vx=e.patrolVx??e.vx;
 const floor=solidsFor(level,e).find(b=>Math.abs(b.y-e.y-e.h)<3&&e.x>=b.x&&e.x+e.w<=b.x+b.w);
 if(floor){e.min=Math.max(floor.x+6,e.x-100);e.max=Math.min(floor.x+floor.w-e.w-6,e.x+100);if(e.min>e.max)e.min=e.max=e.x}else{e.min=e.x-80;e.max=e.x+80}
 return true;
}
function freeBox(box,level,p,except){return box.x>=0&&box.x+box.w<=level.width&&!intersects(box,p)&&!solidsFor(level,except).some(b=>intersects(box,b))&&!level.enemies.some(e=>e!==except&&e.alive&&e.iceState!=='carried'&&intersects(box,e))}
export function pickIce(p,level){
 if(p.carry)return false;
 const candidates=level.enemies.filter(e=>e.alive&&e.iceState==='frozen'&&!['plant','fireplant'].includes(e.kind)&&Math.abs((e.x+e.w/2)-(p.x+p.w/2))<=70&&Math.abs((e.y+e.h/2)-(p.y+p.h/2))<=55).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x));
 for(const e of candidates){
  const pose=carryBox({...p,carry:e}),steps=Math.max(1,Math.ceil(Math.hypot(pose.x-e.x,pose.y-e.y)/4));let clear=true;
  for(let n=1;n<=steps;n++){const box={...e,x:e.x+(pose.x-e.x)*n/steps,y:e.y+(pose.y-e.y)*n/steps};if(solidsFor(level,e).some(b=>intersects(box,b))){clear=false;break}}
  if(!clear||!freeBox(pose,level,p,e))continue;
  p.carry=e;e.iceState='carried';e.vx=0;e.vy=0;Object.assign(e,pose);return true;
 }return false;
}
export function releaseIce(p,level,{throwing=false,force=false,onBreak=()=>{}}={}){
 const e=p.carry;if(!e)return false;
 const face=p.face||1,candidates=[carryBox(p),{...carryBox(p),x:face>0?p.x+p.w+12:p.x-e.w-12}];
 const pos=candidates.find(box=>freeBox(box,level,p,e));
 if(!pos){if(force){p.carry=null;breakIce(e,onBreak)}return false}
 p.carry=null;Object.assign(e,pos);e.iceState=throwing?'thrown':'frozen';e.vx=throwing?face*ICE.throwSpeed:0;e.vy=throwing?ICE.launchVy:0;e.ground=false;e.throwHits=new Set();return true;
}
export function clearCarry(p,onBreak=()=>{}){if(!p?.carry)return;const e=p.carry;p.carry=null;breakIce(e,onBreak)}
export function smashIce(p,level,onBreak=()=>{}){
 const e=level.enemies.find(e=>e.alive&&e.iceState==='frozen'&&Math.abs(e.x+e.w/2-p.x-p.w/2)<65&&Math.abs(e.y+e.h/2-(p.y+p.h))<65);
 if(!e)return false;const steps=Math.ceil(Math.hypot(e.x-p.x,e.y-p.y)/3);for(let n=1;n<steps;n++){const dot={x:p.x+p.w/2+(e.x+e.w/2-p.x-p.w/2)*n/steps,y:p.y+p.h/2+(e.y+e.h/2-p.y-p.h/2)*n/steps,w:2,h:2};if(solidsFor(level,e).some(b=>intersects(dot,b)))return false}return breakIce(e,onBreak);
}
export function stepCarriedAndThrown(level,p,dt,onBreak=()=>{}){
 if(p.carry){if(!p.carry.alive||p.carry.iceState!=='carried')p.carry=null;else Object.assign(p.carry,carryBox(p))}
 for(const e of level.enemies){if(!e.alive||e.iceState!=='thrown')continue;
  e.vy=Math.min(850,e.vy+ICE.gravity*dt);const steps=Math.max(1,Math.ceil(Math.max(Math.abs(e.vx*dt),Math.abs(e.vy*dt))/4));
  for(let n=0;n<steps&&e.alive&&e.iceState==='thrown';n++){
   const bottom=e.y+e.h;e.x+=e.vx*dt/steps;
   for(const wall of solidsFor(level,e)){if(!intersects(e,wall))continue;if(level.enemies.includes(wall))breakIce(wall,onBreak);else {breakIce(e,onBreak);break}}
   if(!e.alive)break;
   e.y+=e.vy*dt/steps;
   for(const wall of solidsFor(level,e)){if(!intersects(e,wall))continue;
    if(level.enemies.includes(wall)){breakIce(wall,onBreak);continue}
    if(e.vy>=0&&bottom<=wall.y+2){e.y=wall.y-e.h;e.vy=0;e.ground=true}
    else {breakIce(e,onBreak);break}
   }
   if(!e.alive)break;
   e.throwHits??=new Set();
   for(const target of level.enemies){if(target===e||!target.alive||target.iceState==='carried'||e.throwHits.has(target)||!intersects(e,target))continue;
    e.throwHits.add(target);if(target.iceState==='frozen')breakIce(target,onBreak);else if(!(target.hurt>0)){target.hp-=2;target.hurt=.45;if(target.hp<=0)target.alive=false;else {breakIce(e,onBreak);break}}
   }
   if(level.chief?.hp>0&&intersects(e,level.chief)){breakIce(e,onBreak);break}
   if(e.y>650||e.x<0||e.x>level.width||(level.lava||[]).some(b=>intersects(e,b))){breakIce(e,onBreak);break}
  }
 }
}

export function addIcePractice(level){
 if(level.power!=='ice')return level;
 level.signs.push({x:80,y:470,label:'ICE: E GRAB / X THROW / DOWN+X BREAK'});
 if(level.boss)return level;
 for(const floor of level.platforms){if(floor.y!==470||floor.w<600)continue;
  for(let x=floor.x+160;x<floor.x+floor.w-250;x+=100){
   const perch={x:x+100,y:320,w:110,h:20};
   if(x+260>level.goal-100||level.checkpoints.some(c=>Math.abs(c.x-x)<210)||level.blocks.some(b=>b.content==='power'&&Math.abs(b.x-x)<150)||level.hazards.some(h=>Math.abs(h.x-x)<180)||level.enemies.some(e=>Math.abs(e.x-x)<180)||level.blocks.some(b=>intersects(perch,b)||b.content==='life'&&Math.abs(b.x-perch.x)<100)||level.platforms.some(b=>b!==floor&&intersects({...perch,y:290,h:180},b)))continue;
   const enemy=(px)=>({kind:'basic',x:px,y:438,w:30,h:32,min:px-20,max:px+20,vx:15,vy:0,ground:true,baseY:438,frozen:0,alive:true,hp:1,hurt:0,age:0,attack:0,jumpTimer:0,active:true,warning:false});
   level.enemies.push(enemy(x));
   if(!level.hazards.some(h=>Math.abs(h.x-x-230)<160)&&!level.checkpoints.some(c=>Math.abs(c.x-x-230)<180)&&!level.enemies.some(e=>Math.abs(e.x-x-230)<160))level.enemies.push(enemy(x+230));
   level.platforms.push(perch);level.coins.push({x:x+135,y:292,taken:false},{x:x+180,y:292,taken:false});
   level.signs.push({x:x-75,y:470,label:'ICE: E GRAB / JUMP + X THROW'},{x:x+120,y:320,label:'FROZEN RIVALS CAN BE STEPS'});return level;
  }
 }
 for(const e of level.enemies){if(['plant','fireplant'].includes(e.kind))continue;
  const floor=level.platforms.find(b=>b.y===470&&e.x>=b.x+100&&e.x+260<b.x+b.w);if(!floor||level.hazards.some(h=>Math.abs(h.x-e.x)<300))continue;
  const perch={x:e.x+80,y:320,w:110,h:20};
  if(level.platforms.some(b=>b!==floor&&intersects(perch,b))||level.blocks.some(b=>intersects(perch,b)||b.content==='life'&&Math.abs(b.x-perch.x)<100))continue;
  level.platforms.push(perch);level.coins.push({x:perch.x+35,y:292,taken:false},{x:perch.x+75,y:292,taken:false});level.signs.push({x:e.x-65,y:470,label:'ICE: E GRAB / JUMP + X THROW'},{x:perch.x+10,y:320,label:'TRY A FROZEN STEP'});return level;
 }
 return level;
}
