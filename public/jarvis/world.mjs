import {intersects,canFit,moveBody,solidsFor} from './physics.mjs';
export {solidsFor} from './physics.mjs';
export function hazardState(h,time){
 if(h.kind==='spikes')return 'active';
 const t=((time+(h.offset||0))%h.period+h.period)%h.period;
 const start=h.period-h.active-h.warning;
 return t<start?'off':t<start+h.warning?'warning':'active';
}
const onTop=(p,b)=>Math.abs(p.y+p.h-b.y)<1.5&&p.x+p.w>b.x+1&&p.x<b.x+b.w-1&&p.vy>=0;
function moveRail(level,b,p,dt){
 const old={x:b.x,y:b.y,progress:b.progress,direction:b.direction};
 const length=Math.hypot(b.toX-b.originX,b.toY-b.originY)||1;
 let next=b.progress+b.direction*b.speed/length*dt;
 if(next>=1){next=1;b.direction=-1}else if(next<=0){next=0;b.direction=1}
 const x=b.originX+(b.toX-b.originX)*next,y=b.originY+(b.toY-b.originY)*next;
 const dx=x-b.x,dy=y-b.y,rider=p.ground&&onTop(p,b);
 const other=solidsFor(level).filter(o=>o!==b);
 const body={...p};
 if(rider){
  // Move the rider with the same collision routine as walking. If a ceiling or
  // wall prevents carrying, reverse the lift instead of crushing or clipping.
  p.vx=dx/dt;p.vy=dy/dt;moveBody(p,dt,other);
  p.vx=body.vx;p.vy=body.vy;p.ground=true;
  if(!canFit(p,other)||Math.abs(p.x-body.x-dx)>.2||Math.abs(p.y-body.y-dy)>.2){
   Object.assign(p,body);b.direction=-old.direction;b.dx=0;b.dy=0;return;
  }
 }else if(intersects({...b,x,y},p)){
  // Side/underside contacts stop and reverse; lifts never push into terrain.
  b.direction=-old.direction;b.dx=0;b.dy=0;return;
 }
 b.x=x;b.y=y;b.progress=next;b.dx=dx;b.dy=dy;
}
export function stepWorld(level,p,dt){
 level.time=(level.time||0)+dt;
 for(const b of level.moving||[])moveRail(level,b,p,dt);
 for(const b of level.falling||[]){
  if(b.state==='ready'&&p.ground&&onTop(p,b)){b.state='shaking';b.timer=b.delay}
  else if(b.state==='shaking'){
   b.timer-=dt;if(b.timer<=0){b.state='falling';b.timer=b.returnAfter;b.vy=30}
  }else if(b.state==='falling'){
   b.timer-=dt;b.vy+=700*dt;b.y+=b.vy*dt;
   if(b.timer<=0){b.state='waiting';b.timer=.1}
  }else if(b.state==='waiting'){
   const home={...b,x:b.originX,y:b.originY};
   if(!intersects(p,home)){b.x=b.originX;b.y=b.originY;b.vy=0;b.state='ready';b.timer=0}
  }
 }
 for(const h of level.hazards||[])h.state=hazardState(h,level.time);
}
export function checkpointReached(level,p,current){
 if(!p.ground)return current;
 const feet=p.y+p.h;
 return level.checkpoints.reduce((id,c,i)=>i>id&&p.x>=c.x-24&&p.x<=c.x+100&&Math.abs(feet-c.top)<3?i:id,current);
}
export function resetWorld(level,checkpointIndex){
 // Build a fresh level through the caller: layout and cycles must restart, not
 // preserve used blocks, active vents or absent temporary platforms after death.
 const cp=level.checkpoints[checkpointIndex]||level.checkpoints[0];
 const items=[];
 return {spawn:{x:cp.x,y:cp.top-28},items};
}
