import {freezeEnemy,stepFrozen,breakIce} from './ice.mjs';
import {intersects,moveBody,solidsFor} from './physics.mjs';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function prepareEncounters(level){
 if(level.index===16){
  const ground=level.platforms.find(b=>b.x<=7400&&b.x+b.w===8100&&b.y===470);
  if(ground){ground.w=7600-ground.x;level.platforms.push({x:7680,y:470,w:140,h:100},{x:7900,y:470,w:200,h:100},{x:7540,y:370,w:120,h:20},{x:7810,y:370,w:120,h:20});}
  level.blocks=level.blocks.filter(b=>b.x<7520);
  level.lava.push({x:7600,y:510,w:80,h:80},{x:7820,y:510,w:80,h:80});
  Object.assign(level.chief,{hp:14,max:14,state:'rest',phase:1,elapsed:0,arena:[{x:7460,y:390},{x:7710,y:390},{x:7940,y:390}],dock:1,x:7710,y:390});
  level.signs.push({x:7490,y:470,label:'STORM KING: WATCH THE LANDING MARKER'},{x:7910,y:470,label:'ATTACK DURING THE RECOVERY WINDOW'});
 }
 const types=level.index<1?['basic']:level.index<4?['basic','fire']:level.index<7?['basic','fire','plant']:level.index<11?['basic','fire','plant','hammer']:['basic','fire','plant','hammer','jumper'];
 level.enemies.forEach((e,i)=>{e.kind=types[(i+level.index)%types.length];e.baseY=e.y;e.hp=e.kind==='hammer'||e.kind==='jumper'?2:1;e.hurt=0;e.attack=0;e.age=0;e.jumpTimer=0;e.vy=0;e.ground=true;e.active=e.kind!=='plant';e.warning=false;
  if(e.kind==='plant')e.vx=0;
  if(e.kind==='jumper')e.vx=Math.sign(e.vx||1)*72;
  const floor=level.platforms.find(b=>Math.abs(b.y-e.y-e.h)<3&&e.x>=b.x&&e.x+e.w<=b.x+b.w);if(floor){e.min=Math.max(e.min,floor.x+12);e.max=Math.min(e.max,floor.x+floor.w-e.w-12)}
 });
 // Add a few safe, deliberate encounters, never on cloud trials or recovery docks.
 if(level.index>=2){let added=0;for(const floor of level.platforms){
  if(added>=Math.min(3,1+Math.floor(level.index/6))||floor.w<420)continue;
  const x=floor.x+floor.w*.6,kind=types[(added+level.index+1)%types.length];
  if(kind==='basic'||x<550||x>level.goal-450||level.cloudTrials?.some(t=>x>=t.start-160)||level.checkpoints.some(c=>Math.abs(c.x-x)<220)||level.enemies.some(e=>Math.abs(e.x-x)<180)||level.hazards.some(h=>Math.abs(h.x-x)<140))continue;
  level.enemies.push({kind,x,y:floor.y-32,w:30,h:32,min:x-65,max:Math.min(x+90,floor.x+floor.w-42),vx:kind==='plant'?0:kind==='jumper'?72:38,vy:0,baseY:floor.y-32,ground:true,frozen:0,alive:true,hp:['hammer','jumper'].includes(kind)?2:1,hurt:0,attack:0,age:0,jumpTimer:0,active:kind!=='plant',warning:false});added++;
 }}
 // One optional life block, separate from power supplies and the main checkpoint.
 let placed=false;
 for(const floor of level.platforms){if(placed||floor.w<380)continue;
  for(let x=floor.x+170;x<floor.x+floor.w-70;x+=40){
   const b={x,y:floor.y-144,w:32,h:32,kind:'item',power:'life',content:'life',used:false,broken:false,bump:0};
   if(x>level.goal-200||level.cloudTrials?.some(t=>x>=t.start)||level.checkpoints.some(c=>Math.abs(c.x-x)<145)||level.platforms.some(t=>intersects(b,t)||t!==floor&&t.x<b.x+b.w+16&&t.x+t.w>b.x-16&&t.y>=b.y-30&&t.y<floor.y)||level.blocks.some(t=>intersects({...b,x:b.x-12,w:56},t)||t.x<b.x+b.w+12&&t.x+t.w>b.x-12&&t.y>b.y&&t.y<floor.y)||level.hazards.some(h=>Math.abs(h.x-x)<90))continue;
   level.blocks.push(b);placed=true;break;
  }
 }
 if(!placed)throw Error('No safe life block for stage '+level.index);
 return level;
}
export function enemyShot(shots,source,player,style='fire',speed=210){
 if(shots.filter(s=>s.owner==='enemy'||s.type==='enemy').length>=24)return false;
 const dir=player.x<source.x?-1:1;
 shots.push({x:source.x+source.w/2,y:source.y+10,w:14,h:14,vx:dir*speed,vy:style==='hammer'?-380:0,type:'enemy',owner:'enemy',style,gravity:style==='hammer'?900:0,life:3.5});return true;
}
export function stepEnemies(level,p,dt,shots){
 for(const e of level.enemies){if(!e.alive)continue;e.hurt=Math.max(0,(e.hurt||0)-dt);
  e.thawGrace=Math.max(0,(e.thawGrace||0)-dt);
  if(stepFrozen(e,level,p,dt))continue;
  e.age+=dt;e.warning=false;
  if(e.kind==='plant'){const t=e.age%4.8;e.active=t>=2.6;e.warning=t>=2.1&&t<2.6;continue}
  if(e.kind==='jumper'){e.jumpTimer+=dt;if(e.jumpTimer>2.2&&e.ground){e.vy=-390;e.jumpTimer=0;e.ground=false}}
  const patrol=e.vx,direction=Math.sign(patrol)||1;
  e.vy=Math.min(650,(e.vy||0)+1100*dt);
  const collision=moveBody(e,dt,solidsFor(level));
  if(collision.hitX)e.vx=-direction*Math.abs(patrol);
  if(e.y>650){e.alive=false;continue}
  if(e.x<e.min||e.x>e.max){e.x=clamp(e.x,e.min,e.max);e.vx=-e.vx}
  if(!['fire','hammer','jumper'].includes(e.kind)||(e.x<p.x-300||e.x>p.x+520)||Math.abs(e.y-p.y)>180||Math.abs(e.x-p.x)<100)continue;
  const period=e.kind==='jumper'?2.5:level.index<5?3.6:3;
  e.attack+=dt;e.warning=e.attack>period-.55;
  if(e.attack>=period){e.attack=0;enemyShot(shots,e,p,e.kind==='hammer'?'hammer':'fire',e.kind==='jumper'?240:200)}
 }
}
export function strikeEnemy(e,type='stomp'){
 if(!e.alive||e.hurt>0)return false;
 if(type==='ice')return freezeEnemy(e);
 if(e.frozen>0)return breakIce(e);
 if(e.kind==='plant'&&type==='stomp')return false;
 e.hp-=type==='hammer'?2:1;e.hurt=.45;if(e.hp<=0)e.alive=false;return true;
}
export function stepFinalBoss(b,p,dt,shots){
 if(b.hp<=0)return;b.cool=Math.max(0,b.cool-dt);
 if(p.x<7340)return;
 b.phase=b.hp<=5?3:b.hp<=9?2:1;b.elapsed+=dt;
 if(b.state==='rest'&&b.elapsed>=1.2){b.state='warn';b.elapsed=0;b.target=b.dock+b.dir;if(b.target<0||b.target>2){b.dir=-b.dir;b.target=b.dock+b.dir}enemyShot(shots,b,p,'fire',210+b.phase*15)}
 else if(b.state==='warn'&&b.elapsed>=.7){b.state='jump';b.elapsed=0;b.from={x:b.x,y:b.y}}
 else if(b.state==='jump'){
  const t=Math.min(1,b.elapsed/(b.phase===3?.95:1.15)),to=b.arena[b.target];const travel=clamp((t-.25)/.5,0,1);b.x=b.from.x+(to.x-b.from.x)*travel;b.y=b.from.y+(to.y-b.from.y)*t-Math.sin(t*Math.PI)*165;
  if(t===1){b.dock=b.target;b.state='recover';b.elapsed=0;if(b.phase>=2)enemyShot(shots,b,p,'hammer',185)}
 }else if(b.state==='recover'&&b.elapsed>=1.25){b.state='rest';b.elapsed=0}
}
export function drawEnemy(ctx,e,time){
 if(!e.alive)return;const r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)},x=e.x,y=e.y;
 const c=e.frozen>0?'#9ce9f6':e.hurt>0?'#fff1ad':({basic:'#725779',fire:'#c86a55',hammer:'#8270ad',jumper:'#d3a451',plant:'#439b70'}[e.kind]||'#725779');
 if(e.kind==='plant'){
  r(x+12,y+18,6,14,'#36785f');r(x+2,y+24,12,5,'#6cc27d');r(x+18,y+21,10,5,'#6cc27d');r(x+1,y+(e.active?0:15),28,e.active?20:12,c);
  if(e.active){r(x+4,y+8,22,7,'#252c45');for(let n=4;n<26;n+=7)r(x+n,y+7,3,4,'#fff2d4')}
 }else{
  r(x+3,y+7,24,25,c);r(x,y+25,10,7,'#28364d');r(x+20,y+25,10,7,'#28364d');r(x+5,y+10,5,5,'#fff');r(x+20,y+10,5,5,'#fff');
  if(e.kind==='fire'){r(x+5,y+1,20,8,'#f5b56b');r(x+9,y-3,4,8,'#f28250')}
  if(e.kind==='hammer'){r(x+1,y+2,28,8,'#bdafdb');r(x+30,y+12,4,18,'#c09c73');r(x+25,y+7,14,8,'#ddd4e9')}
  if(e.kind==='jumper'){r(x+2,y+3,26,5,'#f1df9b');r(x+3,y+27,9,7,'#d88669');r(x+20,y+27,9,7,'#d88669')}
 }
 if(e.warning){r(x+12,y-14,5,9,'#ffe19a');r(x+12,y-3,5,3,'#ffe19a')}
 if(e.hp>1){r(x+8,y-7,4,3,'#f6dd98');r(x+18,y-7,4,3,'#f6dd98')}
 if(e.frozen>0){ctx.strokeStyle=e.iceWarning&&Math.floor(time*10)%2?'#ffdc99':'#e1ffff';ctx.lineWidth=2;ctx.strokeRect(x-3,y-3,e.w+6,e.h+6);r(x+3,y+3,3,10,'#e9ffff');r(x+e.w-8,y+e.h-10,5,3,'#e9ffff')}
}
