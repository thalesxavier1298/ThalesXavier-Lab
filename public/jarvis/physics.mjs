import {PHYSICS as C} from './config.mjs';
export const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function carryBox(body,face=body.face){const e=body.carry;if(!e)return null;return {x:face>0?body.x+body.w+6:body.x-e.w-6,y:body.y+body.h-e.h-4,w:e.w,h:e.h}}
export function canFit(body,solids){return !solids.some(b=>!b.broken&&intersects(body,b))}
export function resizeFeet(body,height,solids){
 const next={...body,y:body.y+body.h-height,h:height};
 if(!canFit(next,solids))return false;
 body.y=next.y;body.h=height;return true;
}
// Small spatial steps prevent fast boosts from tunnelling through thin tiles.
export function moveBody(body,dt,solids,oneWays=[],onHead=()=>{},hiddenBlocks=[]){
 const dx=body.vx*dt,dy=body.vy*dt,steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/C.maxSubstep));
 let hitX=false,hitY=false,landed=false;body.ground=false;
 for(let n=0;n<steps;n++){
  const previousX=body.x,sx=hitX?0:dx/steps;body.x+=sx;
  for(const b of solids)if(!b.broken&&intersects(body,b)){
   if(sx>0)body.x=b.x-body.w;else if(sx<0)body.x=b.x+b.w;
   if(sx){hitX=true;body.vx=0}
  }
  if(body.carry&&solids.some(b=>b!==body.carry&&intersects(carryBox(body),b))){body.x=previousX;body.vx=0;hitX=true}
  const oldTop=body.y,oldBottom=body.y+body.h,sy=hitY?0:dy/steps;body.y+=sy;
  for(const b of solids)if(!b.broken&&intersects(body,b)){
   if(sy>0){body.y=b.y-body.h;body.ground=true;landed=true;hitY=true;body.vy=0}
   else if(sy<0){body.y=b.y+b.h;hitY=true;body.vy=0;onHead(b)}
  }
  if(sy<0&&!hitY)for(const b of hiddenBlocks)if(!b.revealed&&!b.broken&&body.x+body.w>b.x&&body.x<b.x+b.w&&oldTop>=b.y+b.h-.01&&body.y<b.y+b.h){
   onHead(b);if(b.revealed){body.y=b.y+b.h;body.vy=0;hitY=true;break}
  }
  if(body.carry&&solids.some(b=>b!==body.carry&&intersects(carryBox(body),b))){body.y=oldTop;body.vy=0;hitY=true}
  if(sy>=0)for(const b of oneWays)if(b.life>0&&oldBottom<=b.y+.01&&intersects(body,b)){
   body.y=b.y-body.h;body.vy=0;body.ground=true;landed=true;hitY=true;
  }
 }
 return {hitX,hitY,landed};
}
export function approach(value,target,amount){return value<target?Math.min(value+amount,target):Math.max(value-amount,target)}

export function solidsFor(level,exclude=null){
 return [...(level.enemies||[]).filter(e=>e.alive&&e.iceState==='frozen'&&!['plant','fireplant'].includes(e.kind)),...level.platforms,...(level.blocks||[]),...(level.moving||[]),...(level.falling||[]).filter(b=>b.state==='ready'||b.state==='shaking')].filter(b=>b!==exclude&&!b.broken&&(!b.hidden||b.revealed));
}
