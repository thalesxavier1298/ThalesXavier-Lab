import {intersects} from './physics.mjs';
export function makeSecretTrial(parent,portal){
 const hard=portal.kind==='secret',cloud=parent.power==='cloud',ice=parent.power==='ice',heli=parent.power==='helicopter',hammer=parent.power==='hammer';
 const room={index:parent.index,name:parent.name+' — '+(hard?'Secret Trial':'Bonus Trial'),theme:parent.theme,isTrial:true,boss:false,power:parent.power,width:1740,goal:Infinity,goalY:470,timeLimit:parent.timeLimit,identity:'Optional power trial',mechanic:'Use the stage power, reach the far arch',platforms:cloud?[{x:0,y:470,w:620,h:100},{x:hard?1220:1180,y:470,w:hard?520:560,h:100}]:[{x:0,y:470,w:1740,h:100}],blocks:[120,360].map(x=>({x,y:350,w:32,h:32,kind:'item',content:'power',power:parent.power,used:false,broken:false,bump:0})),enemies:[],moving:[],falling:[],hazards:[],lava:[],cloudTrials:[],checkpoints:[{x:70,top:470}],coins:[],signs:[],relics:[],portals:[{kind:'return',x:55,y:415,w:48,h:55},{kind:'trial-finish',x:1620,y:415,w:48,h:55}],sourcePortal:portal,trialClouds:0,trialBoosts:0,liftSteps:[false,false],trialSolved:false,trialTargets:[],receivers:[]};
 if(cloud){room.signs=[{x:180,y:470,label:'TWO SUPPLIES: SMALL GETS MUSHROOM, THEN CLOUD'},{x:520,y:470,label:'RUN + JUMP: BUILD TWO CLOUD STEPS / C RETRIES'}]}
 else if(heli){
  room.platforms.push({x:620,y:310,w:160,h:18},{x:920,y:180,w:160,h:18},{x:1340,y:180,w:400,h:18});room.portals[1].y=125;room.portals[1].top=180;
  room.signs=[{x:180,y:470,label:'HELICOPTER: X BOOST / HOLD JUMP TO FLOAT'},{x:520,y:470,label:'CLIMB TWO LEDGES — LAND TO RECHARGE THE BOOST'},{x:920,y:180,label:'FLOAT ACROSS TO THE FAR ARCH'}];
 }
 else if(ice){
  room.platforms.push({x:1000,y:390,w:200,h:18});
  room.enemies=[500,820].map(x=>({kind:'basic',x,y:438,w:30,h:32,min:x-25,max:x+25,vx:15,vy:0,ground:true,baseY:438,frozen:0,alive:true,hp:1,hurt:0,age:0,attack:0,jumpTimer:0,active:true}));
  room.receivers=[{x:680,y:410,w:60,h:60,charged:false},{x:1090,y:330,w:60,h:60,charged:false}];
  room.signs=[{x:170,y:470,label:'ICE: FREEZE / E CARRY / E PLACE ON BLUE SOCKETS'},{x:890,y:470,label:'SECOND SOCKET IS UP HIGH — JUMP WITH YOUR ICE'}];
 }else{
  room.platforms.push({x:580,y:390,w:90,h:18},{x:820,y:330,w:100,h:18},{x:1050,y:390,w:90,h:18});
  room.trialTargets=hammer?[{x:710,y:300,w:28,h:40,lit:false},{x:970,y:240,w:28,h:40,lit:false},{x:1230,y:300,w:28,h:40,lit:false}]:[{x:710,y:425,w:24,h:35,lit:false},{x:920,y:425,w:24,h:35,lit:false},{x:1160,y:425,w:24,h:35,lit:false}];
  if(hammer&&hard)room.trialTargets.push({x:1340,y:385,w:28,h:35,lit:false});
  room.signs=[{x:170,y:470,label:hammer?'HAMMER: CLIMB AND ARC SHOTS INTO THREE BELLS':'FIRE: LIGHT THE THREE BRAZIERS'},{x:580,y:470,label:hammer?'JUMP THE LEDGES — HAMMERS CURVE OVER OBSTACLES':'JUMP THE LEDGES AND AIM BOUNCING FIREBALLS'}];
 }
 room.gate={x:1430,y:heli?-40:250,w:30,h:220,broken:false};room.blocks.push(room.gate);return room;
}
export function stepSecretTrial(level,p,shots){
 if(!level.isTrial)return false;
 for(const s of shots){if(s.life<=0||s.owner==='enemy'||s.type!==(level.power==='hammer'?'hammer':'fire'))continue;for(const t of level.trialTargets){if(!t.lit&&intersects(s,t)){t.lit=true;s.life=0;break}}}
 for(const plate of level.receivers){if(plate.charged)continue;const e=level.enemies.find(e=>e.alive&&e.iceState==='frozen'&&!e.trialUsed&&intersects(e,plate));if(e){plate.charged=true;e.trialUsed=true;e.alive=false;e.iceState="broken"}}
 if(level.power==='helicopter'){if(p.ground&&Math.abs(p.y+p.h-310)<2&&p.x>=620&&p.x<780&&level.trialBoosts>=1)level.liftSteps[0]=true;if(p.ground&&Math.abs(p.y+p.h-180)<2&&p.x>=920&&p.x<1080&&level.trialBoosts>=2&&level.liftSteps[0])level.liftSteps[1]=true}
 const solved=level.power==='helicopter'?level.liftSteps.every(Boolean):level.power==='cloud'?level.trialClouds>=2:level.power==='ice'?level.receivers.every(p=>p.charged):level.trialTargets.every(t=>t.lit);
 level.trialSolved=solved;level.gate.broken=solved;return solved;
}
export function drawSecretTrial(ctx,level){if(!level.isTrial)return;
 for(const t of level.trialTargets){ctx.fillStyle='#647b83';ctx.fillRect(t.x,t.y,t.w,t.h);ctx.fillStyle=t.lit?'#ffb95c':'#adb6a5';ctx.fillRect(t.x+4,t.y-12,16,16)}
 for(const b of level.receivers){ctx.strokeStyle=b.charged?'#b5e897':'#8bdcec';ctx.lineWidth=4;ctx.strokeRect(b.x,b.y,b.w,b.h);ctx.fillStyle=b.charged?'#b5e897':'#c0edee';ctx.font='bold 11px monospace';ctx.fillText(b.charged?'OK':'ICE ↓',b.x,b.y-8)}
 if(!level.trialSolved){ctx.fillStyle='#64557b';ctx.fillRect(level.gate.x,level.gate.y,level.gate.w,level.gate.h);ctx.strokeStyle='#dfbddf';ctx.strokeRect(level.gate.x,level.gate.y,level.gate.w,level.gate.h)}

}
