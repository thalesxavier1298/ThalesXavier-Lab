import {intersects,solidsFor} from './physics.mjs';
export const DISCOVERY_KEY='jarvis-hidden-trails-v1';
export const SECRET_ROUTES=[{from:1,to:4},{from:5,to:9},{from:12,to:15}];
export const BONUS_STAGES=[0,1,4,5,10,12];
export function readDiscoveries(storage){
 try{const r=JSON.parse(storage.getItem(DISCOVERY_KEY));return {relics:[...new Set((Array.isArray(r?.relics)?r.relics:[]).filter(k=>typeof k==='string'&&/^(?:[0-9]|1[0-6]):[0-2]$/.test(k)))],exits:[...new Set((Array.isArray(r?.exits)?r.exits:[]).filter(i=>SECRET_ROUTES.some(s=>s.from===i)))],cleared:[...new Set((Array.isArray(r?.cleared)?r.cleared:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<17))]}}catch{return {relics:[],exits:[],cleared:[]}}
}
export function saveDiscoveries(data,storage){try{storage.setItem(DISCOVERY_KEY,JSON.stringify(data))}catch{}}
export function collectRelic(data,id){if(!/^(?:[0-9]|1[0-6]):[0-2]$/.test(id)||data.relics.includes(id))return false;data.relics.push(id);return true}
export function discoverExit(data,index){if(!SECRET_ROUTES.some(s=>s.from===index)||data.exits.includes(index))return false;data.exits.push(index);return true}
export function stageAvailable(index,linear,data){return index>=0&&index<17&&(index<=linear||data.cleared.includes(index)||data.cleared.includes(index-1)||SECRET_ROUTES.some(s=>index<=s.to&&data.exits.includes(s.from)))}
export function stageCleared(index,linear,data){return index<linear||data.cleared.includes(index)}
export function clearedCount(linear,data){return Array.from({length:17},(_,i)=>i).filter(i=>stageCleared(i,linear,data)).length}
export function finishStage(data,index,linear){if(!data.cleared.includes(index))data.cleared.push(index);while(linear<17&&data.cleared.includes(linear))linear++;return linear}
export function relicCount(data,index){return data.relics.filter(k=>k.startsWith(index+':')).length}
// Secrets are placed on broad, clear supports, away from required cloud crossings.
export function addSecrets(level){
 level.relics=[];level.portals=[];const occupied=[];
 for(let slot=0;slot<3;slot++){
  const candidates=[];
  for(const floor of level.platforms){if(floor.w<260||floor.y>470||floor.h<18)continue;
   for(let x=floor.x+100;x<floor.x+floor.w-100;x+=35){
    const room={x:x-80,y:floor.y-160,w:210,h:158};
    if(x<260||x>level.goal-240||level.cloudTrials?.some(t=>x>=t.start-180)||occupied.some(px=>Math.abs(px-x)<240)||level.checkpoints.some(c=>Math.abs(c.x-x)<140)||level.hazards.some(h=>Math.abs(h.x-x)<150)||level.enemies.some(e=>Math.abs(e.x-x)<140)||level.blocks.some(b=>intersects(room,b))||level.platforms.some(b=>b!==floor&&intersects(room,b))||level.moving.some(b=>Math.min(b.x,b.toX)<x+100&&Math.max(b.x+b.w,b.toX+b.w)>x-100))continue;
    candidates.push({x,floor});
   }
  }
  if(!candidates.length)for(const floor of level.platforms){if(floor.w<130||floor.y>470)continue;for(let x=floor.x+35;x<floor.x+floor.w-45;x+=30){const area={x:x-10,y:floor.y-52,w:46,h:50};if(x<220||x>level.goal-160||level.cloudTrials?.some(t=>x>=t.start-180)||occupied.some(px=>Math.abs(px-x)<100)||level.hazards.some(h=>Math.abs(h.x-x)<100)||level.checkpoints.some(c=>Math.abs(c.x-x)<100)||level.enemies.some(e=>Math.abs(e.x-x)<100)||level.blocks.some(b=>intersects(area,b))||level.platforms.some(b=>b!==floor&&intersects(area,b)))continue;candidates.push({x,floor,low:true})}}
  if(!candidates.length)throw Error('No safe secret pocket '+level.index+':'+slot);
  const choice=candidates[Math.min(candidates.length-1,Math.floor(candidates.length*(slot===0?.08:slot===1?.55:.9)))],{x,floor}=choice;occupied.push(x);
  const ledge=choice.low?{x:x-15,y:floor.y,w:74,h:18}:{x:x-15,y:floor.y-(slot===1?112:80),w:74,h:18};if(!choice.low)level.platforms.push(ledge);
  const relic={id:level.index+':'+slot,x:x+22,y:ledge.y-28,w:22,h:26,sourceTop:floor.y,hidden:slot===2};
  const hasSecret=SECRET_ROUTES.some(s=>s.from===level.index);
  if(slot===(hasSecret?0:2)&&BONUS_STAGES.includes(level.index)){
   level.portals.push({kind:'bonus',x:x-12,y:floor.y-55,w:48,h:55,slot,returnX:Math.max(floor.x+6,x-55),top:floor.y});
  }
  if(slot===2&&BONUS_STAGES.includes(level.index))level.bonusRelic=relic.id;else level.relics.push(relic);
  if(slot===2&&SECRET_ROUTES.some(s=>s.from===level.index))level.portals.push({kind:'secret',x:x+8,y:ledge.y-50,w:40,h:50,top:ledge.y,to:SECRET_ROUTES.find(s=>s.from===level.index).to});
  level.signs.push({x:x-75,y:floor.y,label:slot===0?(hasSecret?'BONUS: SHARD CHALLENGE / RETURN TO THIS TRAIL':'A STAR SHARD ABOVE THE TRAIL'):slot===1?'OPTIONAL HIGH PATH — HOLD JUMP':hasSecret?'SECRET EXIT: ENDS STAGE / NO SHARD':BONUS_STAGES.includes(level.index)?'BONUS ARCH: UP TO EXPLORE':'RUIN PASSAGE: LOOK BEHIND THE ARCH'});
 }
 if(level.portals.some(p=>p.kind==='secret'))level.signs.push({x:level.portals.find(p=>p.kind==='secret').x-90,y:level.portals.find(p=>p.kind==='secret').top,label:'SECRET EXIT: ENDS STAGE / UNLOCKS SHORTCUT — NO SHARD'});
 level.timeLimit+=60;return level;
}
export function makeBonus(parent){
 const room={index:parent.index,name:parent.name+' — Starlight Grotto',theme:parent.theme,isBonus:true,boss:false,power:parent.power,width:960,goal:Infinity,goalY:470,timeLimit:parent.timeLimit,identity:'Hidden grotto',mechanic:'Return through the blue arch',platforms:[{x:0,y:470,w:960,h:100},{x:300,y:390,w:130,h:18},{x:500,y:310,w:130,h:18},{x:700,y:390,w:130,h:18}],blocks:[],enemies:[],moving:[],falling:[],hazards:[],lava:[],cloudTrials:[],checkpoints:[{x:80,top:470}],coins:[220,270,340,390,540,590,740,790].map((x,i)=>({x,y:i<2?430:i<4?355:i<6?275:355,taken:false})),signs:[{x:125,y:470,label:'BLUE ARCH: UP TO RETURN'},{x:495,y:310,label:'A SHARD FOR THE EXPLORER'}],relics:[{id:parent.bonusRelic,x:554,y:275,w:22,h:26,hidden:false}],portals:[{kind:'return',x:65,y:415,w:48,h:55}]};
 if(parent.index===5){room.name=parent.name+' — Crystal Archive';room.platforms=[room.platforms[0],{x:220,y:390,w:65,h:18},{x:300,y:330,w:220,h:102},{x:650,y:390,w:120,h:18}];room.relics[0].x=430;room.relics[0].y=440;room.relics[0].hidden=true;room.coins=[350,390,470].map(x=>({x,y:450,taken:false}));room.signs=[{x:125,y:470,label:'BLUE ARCH: UP TO RETURN'},{x:250,y:470,label:'CRYSTAL ARCHIVE: DOWN + MOVE TO CRAWL'}]}
 if(parent.index===10){room.name=parent.name+' — Ember Loft';room.platforms.splice(1,1);room.falling=[{x:300,y:390,w:130,h:18,originX:300,originY:390,state:'ready',delay:1,timer:0,returnAfter:3,vy:0}];room.signs.push({x:260,y:470,label:'SHAKING LEDGE: JUMP AGAIN — SAFE FLOOR BELOW'})}
 return room;
}
export function portalAt(level,p){return (level.portals||[]).find(b=>intersects(p,{...b,x:b.x-8,w:b.w+16}))}
export function drawSecrets(ctx,level,data,time){
 for(const r of level.relics||[]){const found=data.relics.includes(r.id);ctx.save();ctx.globalAlpha=found?.25:1;ctx.fillStyle=found?'#a5d7c5':'#f9d985';ctx.beginPath();ctx.moveTo(r.x+11,r.y);ctx.lineTo(r.x+22,r.y+13);ctx.lineTo(r.x+11,r.y+26);ctx.lineTo(r.x,r.y+13);ctx.closePath();ctx.fill();ctx.strokeStyle='#fff3c4';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#9c7cc6';ctx.fillRect(r.x+8,r.y+9,6,8);ctx.restore();
  if(r.hidden){ctx.strokeStyle='#597f76';ctx.lineWidth=5;ctx.strokeRect(r.x-12,r.y-12,48,48);ctx.fillStyle='#8eab87';ctx.fillRect(r.x-14,r.y-12,14,48);ctx.fillRect(r.x+34,r.y-12,8,48)}
 }
 for(const b of level.portals||[]){ctx.fillStyle=(b.kind==='secret'||b.kind==='trial-finish'&&level.sourcePortal.kind==='secret')?'#be8cbb':b.kind==='return'?'#87ccde':'#e7c887';ctx.fillRect(b.x,b.y,b.w,b.h);ctx.fillStyle='#193b49';ctx.fillRect(b.x+7,b.y+9,b.w-14,b.h-9);ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillStyle='#fff1ce';ctx.fillText(b.kind==='secret'?'SECRET EXIT ↑':b.kind==='return'?'RETURN ↑':b.kind==='trial-finish'?(level.sourcePortal.kind==='secret'?'SECRET EXIT ↑':'BONUS ROOM ↑'):'BONUS ↑',b.x+b.w/2,b.y-9)}
}
