import {intersects} from './physics.mjs';
import {strikeEnemy} from './encounters.mjs';
export function standsOnBlock(e,b){return e.alive&&Math.abs(e.y+e.h-b.y)<=2&&e.x+e.w>b.x+1&&e.x<b.x+b.w-1&&Math.abs(e.vy||0)<2}
export function revealBlock(b,level,items=[]){
 if(!b.hidden||b.revealed)return true;
 const occupants=[...(level.enemies||[]).filter(e=>e.alive),...(level.moving||[]),...(level.falling||[]).filter(e=>e.state!=='waiting'),...items.filter(i=>!i.taken)];
 if(occupants.some(e=>intersects(b,e)))return false;
 b.revealed=true;return true;
}
export function impactBlock(b,level){
 if(!['item','brick'].includes(b.kind)||b.impactLock>0)return 0;b.impactLock=.16;let count=0;
 for(const e of level.enemies||[]){if(!standsOnBlock(e,b)||e.kind==='plant')continue;
  if(strikeEnemy(e,'block')){count++;if(e.alive){e.vy=-175;e.ground=false}}
 }return count;
}
export function canBreakBlock(b,level){return !(level.enemies||[]).some(e=>e.kind==='plant'&&standsOnBlock(e,b))}
export function bossProjectileAllowed(index,type){return index!==8||type==='fire'||type==='hammer'}
export function addHiddenBlocks(level){
 if(![0,2,5,10,13].includes(level.index))return level;
 for(const floor of level.platforms){if(floor.w<260)continue;
  for(let x=floor.x+140;x<floor.x+floor.w-110;x+=40){
   const b={x,y:floor.y-110,w:32,h:32,kind:'item',content:'coin',power:level.power,hidden:true,revealed:false,used:false,broken:false,bump:0};
   if(x<300||x>level.goal-300||level.checkpoints.some(c=>Math.abs(c.x-x)<170)||level.enemies.some(e=>Math.abs(e.x-x)<160)||level.hazards.some(h=>Math.abs(h.x-x)<100)||level.platforms.some(t=>t!==floor&&t.x<b.x+48&&t.x+t.w>b.x-16&&t.y<floor.y&&t.y+t.h>b.y-40)||level.blocks.some(t=>Math.abs(t.x-x)<100)||level.moving.some(t=>Math.min(t.x,t.toX)<x+48&&Math.max(t.x+t.w,t.toX+t.w)>x-16))continue;
   level.blocks.push(b);level.coins.push({x:x+16,y:floor.y-30,taken:false});
   level.signs.push({x:x-62,y:floor.y,label:level.index===0?'A LONE COIN? TRY JUMPING HERE.':'A SMALL SPARK HIDES A SURPRISE'});return level;
  }
 }
 return level;
}


export function addBlockEncounters(level){
 if(![1,7,11].includes(level.index))return level;
 for(const e of level.enemies){if(e.kind==='plant')continue;
  const floor=level.platforms.find(t=>t.y===470&&t.w>=400&&e.x>t.x+140&&e.x<t.x+t.w-140&&Math.abs(e.y+e.h-t.y)<2);if(!floor)continue;
  const x=e.x-33,y=floor.y-90,row={x,y,w:96,h:32};
  if(level.checkpoints.some(c=>Math.abs(c.x-x)<200)||level.blocks.some(b=>intersects({...row,x:x-30,w:156,h:90},b))||level.platforms.some(t=>t!==floor&&intersects({...row,y:y-40,h:130},t)))continue;
  for(let n=0;n<3;n++)level.blocks.push({x:x+n*32,y,w:32,h:32,kind:'brick',broken:false,bump:0});
  e.y=y-e.h;e.baseY=e.y;e.min=x;e.max=x+96-e.w;e.vy=0;e.ground=true;
  level.signs.push({x:x-95,y:floor.y,label:'HIT THE BRICK UNDER THE PATROL'});return level;
 }
 if(level.index===1)for(const floor of level.platforms){if(floor.y!==470||floor.w<500)continue;
  for(let x=floor.x+150;x<floor.x+floor.w-180;x+=80){const y=380,row={x,y:y-40,w:96,h:130};
   if(level.checkpoints.some(c=>Math.abs(c.x-x)<220)||level.enemies.some(e=>Math.abs(e.x-x)<180)||level.blocks.some(b=>intersects({...row,x:x-25,w:146},b))||level.platforms.some(t=>t!==floor&&intersects(row,t)))continue;
   for(let n=0;n<3;n++)level.blocks.push({x:x+n*32,y,w:32,h:32,kind:'brick',broken:false,bump:0});
   level.enemies.push({kind:'basic',x:x+33,y:y-32,w:30,h:32,min:x,max:x+66,vx:30,vy:0,ground:true,baseY:y-32,frozen:0,alive:true,hp:1,hurt:0,age:0,attack:0,jumpTimer:0,active:true,warning:false});
   level.signs.push({x:x-90,y:470,label:'HIT THE BRICK UNDER THE PATROL'});return level;
  }
 }
 return level;
}
