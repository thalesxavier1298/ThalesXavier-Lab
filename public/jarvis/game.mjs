import {makeSecretTrial,stepSecretTrial,drawSecretTrial} from './secret-trials.mjs';
import {DISCOVERY_KEY,SECRET_ROUTES,BONUS_STAGES,readDiscoveries,saveDiscoveries,collectRelic,discoverExit,stageAvailable,stageCleared,clearedCount,finishStage,relicCount,makeBonus,portalAt,drawSecrets} from './secrets.mjs';
import {pickIce,releaseIce,clearCarry,smashIce,stepCarriedAndThrown} from './ice.mjs';
import {revealBlock,impactBlock,canBreakBlock,bossProjectileAllowed} from './objects.mjs';
import {stepEnemies,strikeEnemy,stepFinalBoss,drawEnemy} from './encounters.mjs';
import {MAP_POINTS,mapNeighbor,mapPosition,MAP_JARVIS,landmarkSvg,mapRoute,mapLandscape} from './map.mjs';
import {STAGES,makeLevel,overlap,readProgress} from './levels.mjs';
import {PHYSICS,STATES} from './config.mjs';
import {createPlayer,stepPlayer,damagePlayer,transformPlayer} from './player.mjs';
import {createItem,activateBlock,stepItems} from './items.mjs';
import {drawSprite,drawItem} from './sprites.mjs';
import {background,terrain,drawBlocks,drawMechanics} from './rendering.mjs';
import {stepWorld,checkpointReached,resetWorld,solidsFor} from './world.mjs';
import {INITIAL_LIVES,readRun,saveRun,loseLife,resetLives,tickTimer,addCoins,claimLife,clearLifeClaim} from './run.mjs';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
let unlocked;try{unlocked=readProgress(localStorage)}catch{unlocked=0}
let level=null,p=null,keys=new Set(),pressed=new Set(),shots=[],clouds=[],particles=[],camera=0,mode='map',last=0,clock=0,score=0,checkpoint=0,sound=false,audio=null,items=[],deathTimer=0,accumulator=0;
let runState;try{runState=readRun(localStorage)}catch{runState={lives:INITIAL_LIVES,stage:0}}
let lifeNotice=0,wonSpaceReady=false,mapSpaceBlocked=false;
let discoveries;try{discoveries=readDiscoveries(localStorage)}catch{discoveries={relics:[],exits:[],cleared:[]}}let bonusVisit=null;
let remaining=0,deathReason='hit',mapIndex=0,mapTravel=null,entryHeld=false;
function persistDiscoveries(){try{saveDiscoveries(discoveries,localStorage)}catch{}}
function persistRun(){try{saveRun(runState,localStorage)}catch{}}
function buildLevel(i){const l=makeLevel(i);if(runState.lifeClaims?.includes(i))for(const b of l.blocks)if(b.content==='life')b.used=true;return l}
function extraLifeNotice(){lifeNotice=2.5;tone(1040,.2);$('status').textContent='1-UP! Extra life earned.'}
function collectCoin(){score++;if(addCoins(runState))extraLifeNotice();persistRun()}
function quitLevel(){if(!['play','paused'].includes(mode))return;checkpoint=0;shots=[];clouds=[];items=[];particles=[];entryHeld=false;showMap()}
$('quit-level').onclick=quitLevel;
ctx.imageSmoothingEnabled=false;
const colors={super:'#a3e477',cloud:'#eef8ff',fire:'#ff9a58',ice:'#8ce5ff',hammer:'#d8b6ff',helicopter:'#f5d977',none:'#8bd7c0'};
function tone(freq=440,duration=.08){if(!sound)return;try{audio??=new AudioContext();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=freq;g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.start();o.stop(audio.currentTime+duration)}catch{}}
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',sound);tone()};
function renderMap(){
 $('progress').textContent=clearedCount(unlocked,discoveries)+' / 17 cleared · Lives '+runState.lives+' · Coins '+(runState.coins||0)+'/50';
 const coords=MAP_POINTS;
 const route=mapRoute();
 $('island-map').innerHTML='<svg viewBox="0 0 960 760" role="group" aria-label="Green Valley world map: 15 levels, tower and castle"><defs><filter id="shadow"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-opacity=".22"/></filter></defs>'+mapLandscape()+'<path d="'+route+'" fill="none" stroke="#294c3f" stroke-width="19" stroke-linecap="round"/><path d="'+route+'" fill="none" stroke="#dfc58a" stroke-width="11" stroke-linecap="round"/><path d="'+route+'" fill="none" stroke="#fff0b2" stroke-width="2" stroke-dasharray="3 10"/>'+secretPathsSvg()+STAGES.map((s,i)=>{
 const {x,y}=coords[i],locked=!stageAvailable(i,unlocked,discoveries),done=stageCleared(i,unlocked,discoveries),label=s.boss?(i===8?'TOWER':'CASTLE'):String(i>8?i:i+1).padStart(2,'0');
 return '<g class="stage '+(locked?'locked':'')+(i===mapIndex?' selected':'')+'" role="button" tabindex="'+(locked?'-1':'0')+'" aria-disabled="'+locked+'" aria-label="'+s.name+' — '+makeLevel(i).mechanic+(locked?', locked':done?', cleared':', ready')+'" data-stage="'+i+'"><circle class="selection-ring" cx="'+x+'" cy="'+y+'" r="34" fill="none" stroke="#ffe8a2" stroke-width="3"/><ellipse cx="'+x+'" cy="'+(y+14)+'" rx="38" ry="17" fill="#0b2435" opacity=".4"/><circle cx="'+x+'" cy="'+y+'" r="'+(s.boss?29:23)+'" fill="'+(done?'#86c6a0':locked?'#284957':'#f7cd69')+'" stroke="'+(locked?'#53747a':'#e7edbd')+'" stroke-width="3" filter="url(#shadow)"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" fill="'+(locked?'#8ca8ad':'#173e42')+'">'+(done?'✓':label)+'</text><text x="'+x+'" y="'+(y+46)+'" text-anchor="middle" fill="#fff7dc" stroke="#203e37" stroke-width="4" paint-order="stroke" style="font-size:11px">'+s.name+'</text>'+'<text x="'+x+'" y="'+(y+62)+'" text-anchor="middle" fill="#ffe3a3" stroke="#203e37" stroke-width="3" paint-order="stroke" style="font-size:10px">'+relicCount(discoveries,i)+'/3 shards</text>'+(s.boss?landmarkSvg(i===8,x,y):'')+(false?'<text x="'+x+'" y="'+(y-(s.boss?103:39))+'" text-anchor="middle" fill="#f7cd69">JARVIS</text>':'')+'</g>'
 }).join('')+'<g id="map-jarvis" aria-hidden="true" transform="translate('+coords[mapIndex].x+' '+(coords[mapIndex].y-18)+')">'+MAP_JARVIS+'</g></svg>';
 const mapBox=$('island-map');if(mapBox.clientWidth&&mapBox.scrollWidth>mapBox.clientWidth)mapBox.scrollLeft=Math.max(0,coords[mapIndex].x*mapBox.scrollWidth/960-mapBox.clientWidth/2);
 const secretRoute=SECRET_ROUTES.find(r=>discoveries.exits.includes(r.from)&&(r.from===mapIndex||r.to===mapIndex));$('secret-map').hidden=!discoveries.exits.length;$('secret-map').textContent=secretRoute?'Use secret path (S)':'Discovered shortcuts (S)';renderShortcuts();
 $('map-selected').textContent=STAGES[mapIndex].name+' — Arrows to walk · Space to enter'+(discoveries.exits.length?' · S: shortcuts · click a purple trail':'');
 document.querySelectorAll('[data-stage]').forEach(el=>{const go=()=>{const i=Number(el.dataset.stage);if(stageAvailable(i,unlocked,discoveries))start(i)};el.onclick=go;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();entryHeld=e.key===' ';go()}}});
}
function walkMap(key,secret=false){if(mode!=='map'||mapTravel)return;const edge=secret&&SECRET_ROUTES.find(r=>discoveries.exits.includes(r.from)&&(r.from===mapIndex&&key==='ArrowRight'||r.to===mapIndex&&key==='ArrowLeft'));const next=edge?(edge.from===mapIndex?edge.to:edge.from):mapNeighbor(mapIndex,key,unlocked,i=>stageAvailable(i,unlocked,discoveries));if(next!==mapIndex)mapTravel={from:mapIndex,to:next,t:0}}
function enterMap(holdSpace=false){if(mode==='map'&&!mapTravel){entryHeld=holdSpace;start(mapIndex)}}
for(const [id,key] of [['map-left','ArrowLeft'],['map-right','ArrowRight'],['map-up','ArrowUp'],['map-down','ArrowDown']])$(id).onclick=()=>walkMap(key);
$('map-enter').onclick=()=>enterMap();
$('secret-map').onclick=()=>{const r=SECRET_ROUTES.find(r=>discoveries.exits.includes(r.from)&&(r.from===mapIndex||r.to===mapIndex));if(r)takeShortcut(r.from);else $('shortcut-list').hidden=!$('shortcut-list').hidden};
function stepMap(dt){if(!mapTravel)return;mapTravel.t=Math.min(1,mapTravel.t+dt/.35);const at=mapPosition(mapTravel.from,mapTravel.to,mapTravel.t);$('map-jarvis').setAttribute('transform','translate('+at.x+' '+(at.y-18+Math.sin(mapTravel.t*Math.PI*6)*2)+')');const mapBox=$('island-map');if(mapBox.clientWidth&&mapBox.scrollWidth>mapBox.clientWidth)mapBox.scrollLeft=Math.max(0,at.x*mapBox.scrollWidth/960-mapBox.clientWidth/2);if(mapTravel.t===1){mapIndex=mapTravel.to;mapTravel=null;renderMap()}}
function showMap(){restoreBonus();clearCarry(p);$('quit-level').hidden=true;$('cloud-retry').hidden=true;mapIndex=Math.min(level?.index??runState.stage??0,16);if(!stageAvailable(mapIndex,unlocked,discoveries))mapIndex=Math.min(unlocked,16);mapTravel=null;mode='map';keys.clear();pressed.clear();$('map').hidden=false;$('play').hidden=true;$('overlay').hidden=true;$('map-button').hidden=true;$('pause').hidden=true;$('world-title').textContent='GREEN VALLEY';$('status').textContent=runState.lives===0?'No lives left. Choose a stage to start again with 5 lives.':unlocked===17?'The Storm King has fallen. Replay any stage to collect more starlight.':'Choose an unlocked stage. Your next destination is highlighted.';renderMap()}
$('map-button').onclick=showMap;
function retryCloudTrial(){if(level?.isTrial){retrySecretTrial();return}
 if(!['play','paused'].includes(mode)||!level.cloudTrials)return;
 const trial=[...level.cloudTrials].reverse().find(t=>p.x>=t.start-24);if(!trial)return;
 checkpoint=trial.checkpoint;level=buildLevel(level.index);runState.state=STATES.SMALL;persistRun();respawn();mode='play';$('overlay').hidden=true;$('pause').textContent='Pause';canvas.focus();
 $('status').textContent='Cloud trial restarted. Collect the two separated supplies. No life lost.';
}
$('cloud-retry').onclick=retryCloudTrial;

$('reset').onclick=()=>{if(confirm('Reset all stages, coins, lives, star shards and secret paths on this device?')){unlocked=0;discoveries={relics:[],exits:[],cleared:[]};persistDiscoveries();runState.coins=0;runState.lifeClaims=[];mapIndex=0;mapTravel=null;resetLives(runState);runState.stage=0;persistRun();try{localStorage.removeItem('jarvis-skybound-v1')}catch{}renderMap()}};
function start(i){bonusVisit=null;clearCarry(p);level=buildLevel(i);runState.stage=i;if(runState.lives===0){gameOver();return}persistRun();$('cloud-retry').hidden=true;checkpoint=0;score=0;lifeNotice=0;accumulator=0;respawn(runState.state||STATES.SMALL);$('map').hidden=true;$('play').hidden=false;$('overlay').hidden=true;$('map-button').hidden=false;$('pause').hidden=false;$('pause').textContent='Pause';$('world-title').textContent=level.name.toUpperCase();mode='play';canvas.focus();$('status').textContent=level.identity+' — '+level.mechanic+'. Shift = run; Down + move = crawl.'}
function respawn(state=STATES.SMALL){clearCarry(p);
 const fresh=resetWorld(level,checkpoint);p=createPlayer(fresh.spawn.x,fresh.spawn.y);p.ground=true;transformPlayer(p,state,solidsFor(level),{animate:false});p.inv=PHYSICS.invincibility;
 shots=[];clouds=[];particles=[];items=fresh.items;remaining=level.timeLimit;
 keys.clear();pressed.clear();camera=Math.max(0,Math.min(level.width-960,p.x-300));
}
function modal(title,copy,label,next){$('quit-level').hidden=true;$('overlay-title').textContent=title;$('overlay-copy').textContent=copy;$('continue').textContent=label;$('overlay').hidden=false;$('continue').onclick=next;keys.clear();pressed.clear()}
function pause(){if(mode==='play'){mode='paused';$('pause').textContent='Resume';modal('Take a breather.','Your adventure will be right here.','Resume',pause);$('quit-level').hidden=false}else if(mode==='paused'){mode='play';$('quit-level').hidden=true;$('pause').textContent='Pause';$('overlay').hidden=true;canvas.focus()}}
$('pause').onclick=pause;
function die(reason='hit'){
 if(mode!=='play')return;wonSpaceReady=!keys.has('Space')&&!entryHeld;restoreBonus();clearCarry(p);
 deathReason=reason;runState.state=STATES.SMALL;loseLife(runState);persistRun();mode='dying';deathTimer=.75;p.dead=true;p.anim='death';p.animTime=0;p.vy=-330;tone(100,.3);
 keys.clear();pressed.clear();
}
function gameOver(){if(!['dying','dead'].includes(mode))wonSpaceReady=!keys.has('Space')&&!entryHeld;restoreBonus();clearCarry(p);
 mode='gameover';$('map').hidden=true;$('play').hidden=false;$('pause').hidden=true;
 remaining=0;if(!p||!level)p=createPlayer(80,442);
 modal('GAME OVER','Click to continue or press Space. Your cleared stages and coins are safe. Return to the map with '+INITIAL_LIVES+' lives.','Return to world map',()=>{
 resetLives(runState);checkpoint=0;persistRun();showMap();
 });
}
function deathScreen(){
 if(runState.lives===0){gameOver();return}
 mode='dead';
 modal(deathReason==='timeout'?'TIME UP':'One more try?',
 'Click to continue or press Space. Lives left: '+runState.lives+'. Return as Small Jarvis at your checkpoint with a fresh timer.','Retry stage',()=>{
 const i=level.index,cp=checkpoint;start(i);checkpoint=cp;respawn();mode='play';$('overlay').hidden=true;
 });
}
function win(){wonSpaceReady=!keys.has('Space')&&!entryHeld;clearCarry(p);clearLifeClaim(runState,level.index);runState.state=p.state;persistRun();mode='won';unlocked=finishStage(discoveries,level.index,unlocked);persistDiscoveries();try{localStorage.setItem('jarvis-skybound-v1',String(unlocked))}catch{}tone(880,.3);modal(level.index===16?'The sky is yours, Jarvis!':'Stage cleared!',level.index===16?'The Storm King is defeated! Revisit cleared trails, finish unexplored stages and find every star shard.':level.name+' complete. You collected '+score+' starlight coins. The next path is open.','Return to world map',()=>{mapSpaceBlocked=!wonSpaceReady;showMap()});$('overlay-copy').textContent+=' Click to continue or press Space.'}
function hit(){
 const result=damagePlayer(p,solidsFor(level));
 if(result!=='ignored'&&p.carry)releaseIce(p,level,{force:true,onBreak:iceBurst});
 if(result==='dead')die();
 else if(result==='hurt'){tone(140,.15);$('status').textContent=p.state+' — temporary invincibility';}
}
function bumpBlock(block){
 if(block.broken||!revealBlock(block,level,items,p))return;
 impactBlock(block,level);

 if(block.content==='life'&&runState.lifeClaims?.includes(level.index)){block.used=true;block.bump=.16;return}
 if(block.kind==='item'&&activateBlock(block,p,items))tone(630);
 if(block.kind==='brick'&&!block.broken&&p.state!==STATES.SMALL&&canBreakBlock(block,level)){
 block.broken=true;burst(block.x+16,block.y+16,'#dcab7e');tone(220);
 }else block.bump=.16;
}
function burst(x,y,color){for(let i=0;i<10;i++)particles.push({x,y,vx:(Math.random()-.5)*220,vy:-Math.random()*190,life:.6,color})}
function iceBurst(e){burst(e.x+e.w/2,e.y+e.h/2,'#b6edff');tone(940,.1)}
function interactIce(){const ok=p.carry?releaseIce(p,level):pickIce(p,level);$('status').textContent=ok?(p.carry?'Object carried. E/J drops; X/K throws.':'Object placed safely.'):'Find a frozen rival or a stationary shell, with room to carry it.';if(ok)tone(720)}
function power(){
 if(p.dead||p.cool>0)return;
 if(p.carry){if(releaseIce(p,level,{throwing:true})){p.cool=.32;tone(530)}else $('status').textContent='No room to throw here.';return}
 if((keys.has('ArrowDown')||keys.has('KeyS'))&&smashIce(p,level,iceBurst)){p.cool=.32;return}
 if(p.cool>0||p.power==='none'||p.crouch||p.dead)return;p.cool=.32;
 if(p.power==='cloud'){if(p.charges>0){clouds.push({x:p.x-30,y:p.y+p.h+14,w:100,h:14,life:4});p.charges--;if(level.isTrial)level.trialClouds++;tone(660)}}
 else if(p.power==='helicopter'){if(p.boost){p.vy=-720;p.boost=false;if(level.isTrial)level.trialBoosts++;tone(740)}}
 else{shots.push({x:p.x+(p.face>0?p.w:-16),y:p.y+p.h*.4,w:16,h:16,vx:p.face*(p.power==='hammer'?340:430),vy:p.power==='hammer'?-430:-80,type:p.power,life:2.4});tone(p.power==='ice'?800:400)}
}
function update(dt){
 clock+=dt;lifeNotice=Math.max(0,lifeNotice-dt);
 remaining=tickTimer(remaining,dt);if(remaining===0){die('timeout');return}
 stepWorld(level,p,dt);
 const oldY=p.y;
 const input={
 jump:!entryHeld&&pressed.has('Space')||pressed.has('KeyW')||pressed.has('ArrowUp'),
 held:!entryHeld&&keys.has('Space')||keys.has('KeyW')||keys.has('ArrowUp'),
 axis:(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0),
 run:keys.has('ShiftLeft')||keys.has('ShiftRight'),
 down:keys.has('ArrowDown')||keys.has('KeyS')
 };
 if(level.isTrial){$('cloud-retry').hidden=false;$('cloud-retry').textContent='Retry secret trial (C)'}else $('cloud-retry').textContent='Retry cloud trial';
 if(!level.isTrial&&level.cloudTrials)$('cloud-retry').hidden=!level.cloudTrials.some(t=>p.x>=t.start-24);
 const result=stepPlayer(p,input,dt,level,clouds,bumpBlock);
 if(result.jumped)tone(520);
 for(const trial of level.cloudTrials||[])if(p.x>=trial.edge-80&&p.x<trial.edge&&p.state!==STATES.CLOUD){p.x=trial.edge-81;p.vx=0;$('status').textContent='Cloud passage: collect the Cloud flower before crossing. C retries this trial.'}
 if(pressed.has('KeyE')||pressed.has('KeyJ'))interactIce();
 if(pressed.has('KeyX')||pressed.has('KeyK'))power();
 stepCarriedAndThrown(level,p,dt,iceBurst);
 for(const block of level.blocks){block.bump=Math.max(0,(block.bump||0)-dt);block.impactLock=Math.max(0,(block.impactLock||0)-dt)}
 for(const b of clouds)b.life-=dt;
 clouds=clouds.filter(b=>b.life>0);
 stepItems(items,dt,level,p,item=>{if(item.type==='life'){if(claimLife(runState,level.index)){persistRun();extraLifeNotice()}return}if(item.type==='coin'){collectCoin();burst(item.x+14,item.y+14,'#f7cd69');tone(1100,.04);return}tone(760,.18);$('status').textContent=(p.pending?'Growth queued until there is headroom':p.state+' acquired')+'. Shift to run; X to use a special power.'});
 if((pressed.has('ArrowUp')||pressed.has('KeyW'))&&portalAt(level,p)){usePortal(portalAt(level,p));pressed.clear();return}
 for(const r of level.relics||[])if(overlap(p,r)&&collectRelic(discoveries,r.id)){persistDiscoveries();burst(r.x+11,r.y+13,'#f9d985');tone(1200,.15);$('status').textContent='Star shard found! '+relicCount(discoveries,level.index)+'/3 — saved.'}
 const reached=level.isBonus?checkpoint:checkpointReached(level,p,checkpoint);
 if(reached!==checkpoint){checkpoint=reached;$('status').textContent='Checkpoint reached — safe return and item boxes.';tone(900)}
 for(const h of level.hazards)if(h.state==='active'&&overlap(p,h)){hit();if(mode!=='play')return}
 for(const lava of level.lava||[])if(overlap(p,lava)){die('lava');return}
 if(p.y>620){if(level.isTrial){retrySecretTrial();return}die('fall');return}
 for(const c of level.coins)if(!c.taken&&overlap(p,{x:c.x-9,y:c.y-9,w:18,h:18})){c.taken=true;collectCoin();tone(1100,.04);burst(c.x,c.y,'#f7cd69')}
 stepEnemies(level,p,dt,shots);
 for(const e of level.enemies){if(!e.alive||e.iceState==='carried'||e.iceState==='thrown'||e.iceState==='frozen'&&!['plant','fireplant'].includes(e.kind)||e.thawGrace>0||['plant','fireplant'].includes(e.kind)&&!e.active&&e.frozen<=0)continue;
 if(overlap(p,e)){if(e.kind==='shell'&&e.shellMode==='idle'&&!(p.vy>0&&oldY+p.h<=e.y+15)){strikeEnemy(e,p.x+p.w/2<e.x+e.w/2?'kick-right':'kick-left');continue}if(e.contactGrace>0)continue;if(e.frozen>0||!['plant','fireplant'].includes(e.kind)&&p.vy>0&&oldY+p.h<=e.y+15){strikeEnemy(e,'stomp');p.vy=-390;burst(e.x,e.y,'#bd91dc');tone(260)}else hit();if(mode!=='play')return;}}
 const boss=level.chief;
 if(boss&&boss.hp>0){if(level.index===16)stepFinalBoss(boss,p,dt,shots);else{boss.cool-=dt;boss.timer+=dt;boss.x+=Math.sin(clock*1.1)*55*dt;
 if(boss.timer>1.5){boss.timer=0;shots.push({x:boss.x,y:boss.y+30,w:20,h:20,vx:p.x<boss.x?-230:230,vy:-140,type:'enemy',life:4})}}
 if(overlap(p,boss)){if(p.vy>0&&oldY+p.h<=boss.y+20){if(boss.cool<=0){boss.hp--;boss.cool=.65;burst(boss.x,boss.y,'#f7cd69')}p.vy=-570}else hit();if(mode!=='play')return;}
 }
 for(const s of shots){s.life-=dt;const before=s.y;s.x+=s.vx*dt;s.vy+=(s.gravity??(s.type==='hammer'?1100:600))*dt;s.y+=s.vy*dt;
 if(s.type!=='hammer'||s.owner==='enemy')for(const b of solidsFor(level))if(overlap(s,b)){if(s.type==='enemy')s.life=0;else if(level.enemies.includes(b)){strikeEnemy(b,s.type);s.life=0;burst(s.x,s.y,'#b6edff')}else if(s.vy>0&&before+s.h<=b.y+12){s.y=b.y-s.h;s.vy=-260}else s.life=0}
 if(s.life<=0)continue;
 if(s.type==='enemy'){if(overlap(p,s)){hit();s.life=0}}else{
 for(const e of level.enemies)if(e.alive&&e.iceState!=='carried'&&e.iceState!=='thrown'&&overlap(s,e)){strikeEnemy(e,s.type);s.life=0;burst(e.x,e.y,colors[s.type])}
 if(boss&&boss.hp>0&&overlap(s,boss)){s.life=0;if(bossProjectileAllowed(level.index,s.type)&&boss.cool<=0){boss.hp--;boss.cool=.4;burst(boss.x,boss.y,colors[s.type]);tone(190)}else if(!bossProjectileAllowed(level.index,s.type)){burst(s.x,s.y,'#b6e7ed');$('status').textContent='The Sentinel resists ice. Use Fire, Hammer or a stomp.'}}
 }}
 if(mode!=='play')return;
 stepSecretTrial(level,p,shots);
 shots=shots.filter(s=>s.life>0&&s.y<650&&s.x>-100&&s.x<level.width+100);
 for(const a of particles){a.life-=dt;a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=450*dt}particles=particles.filter(a=>a.life>0);
 if(p.x>=level.goal&&(!boss||boss.hp<=0)){win();return}
 camera=Math.max(0,Math.min(level.width-960,p.x-300));
 pressed.clear();
}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x/2)*2,Math.round(y/2)*2,Math.ceil(w/2)*2,Math.ceil(h/2)*2)}
function circle(x,y,r,c){
 // Stepped silhouette keeps coins, clouds and particles on the pixel grid.
 for(let row=-r;row<r;row+=4){const half=Math.floor(Math.sqrt(Math.max(0,r*r-row*row))/2)*2;rect(x-half,y+row,half*2,4,c)}
}
function text(t,x,y,size=16,c='#fff',align='left'){ctx.font='600 '+size+'px monospace';ctx.fillStyle=c;ctx.textAlign=align;ctx.fillText(t,x,y)}
function draw(){
 if(mode!=='map'){const hud='Lives '+runState.lives+' · Time '+Math.ceil(remaining);if($('progress').textContent!==hud)$('progress').textContent=hud}
 background(ctx,level.theme,camera,clock);
 ctx.save();ctx.translate(-Math.round(camera/2)*2,0);
 terrain(ctx,level.platforms,level.theme,camera);
 drawBlocks(ctx,level.blocks,clock);
 for(const item of items)drawItem(ctx,item,clock);
 for(const b of clouds){ctx.globalAlpha=Math.min(1,b.life);circle(b.x+20,b.y+8,14,'white');circle(b.x+45,b.y,20,'white');circle(b.x+70,b.y+7,14,'white');rect(b.x,b.y,100,14,'white');ctx.globalAlpha=1}
 drawMechanics(ctx,level,p,checkpoint,clock);
 for(const c of level.coins)if(!c.taken){circle(c.x,c.y,9,'#f7cf62');circle(c.x,c.y,5,'#ffe9a2')}
 drawSecrets(ctx,level,discoveries,clock);drawSecretTrial(ctx,level);
 for(const e of level.enemies)drawEnemy(ctx,e,clock);
 const boss=level.chief;
 if(boss&&boss.hp>0){if(level.index===16&&boss.state==='warn'){const t=boss.arena[boss.target];rect(t.x-6,t.y+boss.h-6,84,6,'#ffc778');text('LANDING',t.x+36,t.y-10,11,'#ffdc8a','center')}rect(boss.x,boss.y,boss.w,boss.h,boss.cool>0?'#f6cb72':'#40375c');rect(boss.x-10,boss.y+12,92,20,'#77618c');for(let i=0;i<3;i++)rect(boss.x+10+i*22,boss.y-12,12,18,'#f7cd69');rect(boss.x+12,boss.y+30,12,8,'#fcba72');rect(boss.x+48,boss.y+30,12,8,'#fcba72');rect(boss.x,boss.y-30,72,5,'#221b36');rect(boss.x,boss.y-30,72*boss.hp/boss.max,5,'#f7cd69');if(level.index===16)text('PHASE '+boss.phase+' · '+boss.state.toUpperCase(),boss.x+36,boss.y-60,10,boss.state==='recover'?'#a8edb4':'#ffe2a3','center');text(level.index===16?'STORM KING':'THE SENTINEL',boss.x+36,boss.y-44,12,'#fff','center')}
 for(const s of shots){ctx.save();ctx.translate(s.x+8,s.y+8);if(s.type==='hammer'||s.style==='hammer'){ctx.rotate(clock*14);rect(-3,-8,6,24,'#dbad74');rect(-12,-10,24,12,s.owner==='enemy'?'#f4b98d':colors.hammer)}else circle(0,0,8,s.type==='enemy'?'#ef8580':colors[s.type]);ctx.restore()}
 if(!level.isBonus&&!level.isTrial){const goal=level.goal;rect(goal,level.goalY-170,6,170,'#ece6bd');rect(goal+6,level.goalY-170,48,30,boss&&boss.hp>0?'#a47e8b':'#f7cd69');circle(goal+3,level.goalY-175,9,'#fff2ae');text(boss&&boss.hp>0?'DEFEAT THE GUARDIAN':'FINISH',goal,level.goalY-188,12,'#fff','center');
 }
 drawSprite(ctx,p,clock);
 for(const a of particles){ctx.globalAlpha=Math.max(0,a.life/.6);rect(a.x,a.y,4,4,a.color);ctx.globalAlpha=1}
 ctx.restore();
 rect(16,14,280,62,'#10283ad9');text('JARVIS',30,36,12,'#8bd7c0');text(p.state,30,61,14,'#f0dba1');text((runState.coins||0)+'/50',123,59,14,'#f7cd69');text(p.power.toUpperCase(),195,37,10,colors[p.power]);text(p.power==='cloud'?p.charges+' clouds':'X · POWER',195,58,10,'#dae8ee');
 if(p.carry){rect(280,496,400,30,'#10283add');text((p.carry.carryType==='shell'?'SHELL':'ICE')+': E/J DROP · X/K THROW',480,516,13,'#c5f3ff','center')}
 rect(312,14,145,35,'#10283add');text([0,1,2].map(i=>discoveries.relics.includes(level.index+':'+i)?'◆':'◇').join(' '),384,38,19,'#f9d985','center');
 if(level.isTrial){rect(310,82,340,28,'#132c40');text(level.trialSolved?'GATE OPEN — REACH THE FAR ARCH':'OPTIONAL TRIAL · C RETRIES · BLUE ARCH RETURNS',480,101,11,'#f8df9f','center')}
 if(lifeNotice>0)text('1-UP! EXTRA LIFE',480,100,20,'#a3f093','center');
 rect(650,14,182,62,'#10283ad9');text('LIVES '+runState.lives,662,37,14,'#f7cd69');text('TIME '+Math.ceil(remaining),662,60,14,remaining<=60?'#ff9b87':'#e5eeec');
 text(level.boss?'BOSS STAGE':'STAGE '+(level.index>8?level.index:level.index+1),930,36,12,'#fff','right');
}
function frame(t){
 const elapsed=Math.max(0,Math.min((t-last)/1000||0,.1));last=t;
 if(mode==='map')stepMap(elapsed);
 if(mode==='play'){
 accumulator=Math.min(accumulator+elapsed,.1);
 while(accumulator>=PHYSICS.fixedStep&&mode==='play'){update(PHYSICS.fixedStep);accumulator-=PHYSICS.fixedStep}
 }else{
 accumulator=0;
 if(mode==='dying'){clock+=elapsed;deathTimer-=elapsed;p.animTime+=elapsed;p.vy+=PHYSICS.gravity*elapsed;p.y+=p.vy*elapsed;if(deathTimer<=0)deathScreen()}
 }
 if(level&&mode!=='map')draw();requestAnimationFrame(frame);
}
function onKeyDown(e){
 if(['won','dead','gameover'].includes(mode)){if(e.code==='Space'){e.preventDefault();if(!e.repeat&&wonSpaceReady){wonSpaceReady=false;mapSpaceBlocked=true;$('continue').onclick();if(mode==='play')entryHeld=true}}return}
 if(mode==='dying'){if(e.code==='Space'){e.preventDefault();wonSpaceReady=false;keys.add('Space')}return}
 if(mode==='map'){if(e.code==='Space'&&e.target?.matches?.('[data-shortcut],#secret-map'))return;if(e.code==='KeyS'){e.preventDefault();if(!e.repeat)$('secret-map').onclick();return}if(e.code==='Space'&&mapSpaceBlocked){e.preventDefault();return}if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)){e.preventDefault();if(!e.repeat){if(e.code==='Space')enterMap(true);else walkMap(e.code,e.shiftKey)}}return}if(entryHeld&&e.code==='Space')return;if(['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();if(e.target.tagName==='BUTTON'&&(e.code==='Space'||e.code==='Enter'))return;if(!e.repeat){pressed.add(e.code);if(e.code==='KeyP'||e.code==='Escape')pause();if(e.code==='KeyC'&&mode==='play')retryCloudTrial();if(e.code==='KeyR'&&mode==='play')start(level.index)}keys.add(e.code)}
document.addEventListener('keydown',onKeyDown);
function onKeyUp(e){keys.delete(e.code);if(e.code==='Space'){entryHeld=false;wonSpaceReady=true;mapSpaceBlocked=false}}
document.addEventListener('keyup',onKeyUp);
window.addEventListener('blur',()=>{entryHeld=false;keys.clear();pressed.clear();if(mode==='play')pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')pause()});
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);canvas.focus();keys.add(b.dataset.key);pressed.add(b.dataset.key);b.classList.add('active')};const up=()=>{keys.delete(b.dataset.key);b.classList.remove('active')};b.onpointerup=up;b.onpointercancel=up;b.onlostpointercapture=up});
showMap();requestAnimationFrame(frame);

function secretPathsSvg(){return SECRET_ROUTES.filter(r=>discoveries.exits.includes(r.from)).map(r=>{const a=MAP_POINTS[r.from],b=MAP_POINTS[r.to];return '<path role="button" tabindex="0" aria-label="Shortcut to '+STAGES[r.to].name+'" data-route="'+r.from+'" d="M '+a.x+' '+a.y+' Q '+((a.x+b.x)/2)+' '+(Math.min(a.y,b.y)-70)+' '+b.x+' '+b.y+'" fill="none" stroke="#e3a8df" stroke-width="4" stroke-dasharray="5 8" pointer-events="stroke" style="cursor:pointer"/>'}).join('')}
function restoreBonus(){
 if(!bonusVisit)return;const saved=bonusVisit;bonusVisit=null;level=saved.level;checkpoint=saved.checkpoint;shots=saved.shots;clouds=saved.clouds;items=saved.items;particles=saved.particles;
 p.x=saved.x;p.y=saved.top-p.h;p.vx=0;p.vy=0;p.ground=true;camera=saved.camera;
 $('world-title').textContent=level.name.toUpperCase();keys.clear();pressed.clear();
}
function usePortal(portal){
 if(p.carry){$('status').textContent='Place your carried object before using this arch.';return false}
 if(portal.kind==='trial-finish'){if(!level.trialSolved){$('status').textContent='Finish the power challenge to open this exit.';return false}const original=level.sourcePortal;restoreBonus();original.trialCleared=true;return usePortal(original)}
 if(portal.kind==='return'){restoreBonus();entryHeld=true;$('status').textContent='Back on the trail. Your timer and discoveries are preserved.';return true}
 if(['bonus','secret'].includes(portal.kind)&&!portal.trialCleared)return enterSecretTrial(portal);
 if(portal.kind==='secret'){
  discoverExit(discoveries,level.index);persistDiscoveries();runState.state=p.state;persistRun();wonSpaceReady=!keys.has('Space');mode='won';
  modal('Secret path discovered!',STAGES[portal.to].name+' is now reachable by the purple trail. Skipped stages remain unfinished. Click to continue or press Space.','Return to world map',()=>{mapSpaceBlocked=!wonSpaceReady;showMap()});return true;
 }
 if(portal.kind!=='bonus'||bonusVisit)return false;
 level.bonusRoom??=makeBonus(level);bonusVisit={level,checkpoint,shots,clouds,items,particles,x:portal.returnX,top:portal.top,camera};
 level=level.bonusRoom;shots=[];clouds=[];items=[];particles=[];p.x=150;p.y=470-p.h;p.vx=0;p.vy=0;p.ground=true;camera=0;keys.clear();pressed.clear();
 $('world-title').textContent='BONUS · STARLIGHT GROTTO';$('status').textContent='Explore the grotto. Up at the blue arch returns to the trail. Timer keeps running.';return true;
}

function renderShortcuts(){
 $('shortcut-list').innerHTML=SECRET_ROUTES.filter(r=>discoveries.exits.includes(r.from)).map(r=>'<button data-shortcut="'+r.from+'">'+STAGES[r.from].name+' ↔ '+STAGES[r.to].name+'</button>').join('');
 document.querySelectorAll('[data-shortcut]').forEach(el=>{el.onclick=()=>takeShortcut(Number(el.dataset.shortcut))});
 document.querySelectorAll('[data-route]').forEach(el=>{const go=()=>takeShortcut(Number(el.dataset.route));el.onclick=go;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();go()}}});
}
function takeShortcut(from){if(mode!=='map'||mapTravel||!discoveries.exits.includes(from))return false;const r=SECRET_ROUTES.find(r=>r.from===from);if(!r)return false;const target=mapIndex===r.to?r.from:r.to;if(mapIndex!==r.from&&mapIndex!==r.to){mapIndex=r.from;renderMap()}mapTravel={from:mapIndex,to:target,t:0};$('shortcut-list').hidden=true;return true}
function enterSecretTrial(portal){
 portal.trialRoom??=makeSecretTrial(level,portal);bonusVisit={level,checkpoint,shots,clouds,items,particles,x:portal.returnX??portal.x,top:portal.top,camera};
 level=portal.trialRoom;shots=[];clouds=[];items=[];particles=[];p.x=70;p.y=470-p.h;p.vx=0;p.vy=0;p.ground=true;camera=0;keys.clear();pressed.clear();
 $('world-title').textContent=level.name.toUpperCase();$('status').textContent='Optional trial: use '+level.power.toUpperCase()+'. C retries; blue arch returns. Timer keeps running.';return true;
}
function retrySecretTrial(){if(!level?.isTrial)return;const portal=level.sourcePortal;restoreBonus();portal.trialRoom=null;transformPlayer(p,STATES.SMALL,solidsFor(level),{animate:false});clearCarry(p);enterSecretTrial(portal);$('status').textContent='Trial reset without losing a life. Collect the two supplies again.'}
