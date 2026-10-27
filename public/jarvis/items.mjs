import {PHYSICS as C,STATES} from './config.mjs';
import {moveBody,intersects,solidsFor} from './physics.mjs';
import {transformPlayer} from './player.mjs';
export function createItem(type,x,y,{emerge=false}={}){
 return {type,x:x-14,y:y-28,w:28,h:28,vx:type==='super'?C.mushroomSpeed:0,vy:0,originY:y-28,emerge:emerge?.35:0,age:0,taken:false};
}
export function activateBlock(block,p,items){
 if(block.kind!=='item'||block.used||block.broken)return false;
 block.used=true;block.bump=.16;block.refill=1.2;
 const type=p.state===STATES.SMALL?'super':block.power;
 items.push(createItem(type,block.x+block.w/2,block.y,{emerge:true}));
 return true;
}
export function stepItems(items,dt,level,p,onCollect=()=>{}){
 const solids=solidsFor(level);
 for(const item of items){
  if(item.taken)continue;item.age+=dt;
  if(item.emerge>0){item.emerge=Math.max(0,item.emerge-dt);continue}
  if(item.type==='super'){
   item.vy=Math.min(C.maxFall,item.vy+C.gravity*dt);
   const dir=Math.sign(item.vx)||1;
   const {hitX}=moveBody(item,dt,solids);
   if(hitX)item.vx=-dir*C.mushroomSpeed;
  }
  if(item.y>650){item.taken=true;continue}
  if(intersects(p,item)){
   const target=item.type==='super'?(p.state===STATES.SMALL?STATES.SUPER:p.state):STATES[item.type.toUpperCase()];
   transformPlayer(p,target,solids);
   item.taken=true;onCollect(item);
  }
 }
}
