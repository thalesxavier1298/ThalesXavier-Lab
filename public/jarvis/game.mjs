import {STAGES,makeLevel,overlap,readProgress} from './levels.mjs';
import {PHYSICS,STATES} from './config.mjs';
import {createPlayer,stepPlayer,damagePlayer,transformPlayer} from './player.mjs';
import {createItem,activateBlock,stepItems} from './items.mjs';
import {drawSprite,drawItem} from './sprites.mjs';
import {background,terrain,drawBlocks,drawMechanics} from './rendering.mjs';
import {stepWorld,checkpointReached,resetWorld,solidsFor} from './world.mjs';
import {INITIAL_LIVES,readRun,saveRun,loseLife,resetLives,tickTimer} from './run.mjs';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
let unlocked;try{unlocked=readProgress(localStorage)}catch{unlocked=0}
let level=null,p=null,keys=new Set(),pressed=new Set(),shots=[],clouds=[],particles=[],camera=0,mode='map',last=0,clock=0,score=0,checkpoint=0,sound=false,audio=null,items=[],deathTimer=0,accumulator=0;
let runState;try{runState=readRun(localStorage)}catch{runState={lives:INITIAL_LIVES,stage:0}}
let remaining=0,deathReason='hit';
function persistRun(){try{saveRun(runState,localStorage)}catch{}}
ctx.imageSmoothingEnabled=false;
const colors={super:'#a3e477',cloud:'#eef8ff',fire:'#ff9a58',ice:'#8ce5ff',hammer:'#d8b6ff',helicopter:'#f5d977',none:'#8bd7c0'};
function tone(freq=440,duration=.08){if(!sound)return;try{audio??=new AudioContext();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=freq;g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.start();o.stop(audio.currentTime+duration)}catch{}}
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',sound);tone()};
function renderMap(){
 $('progress').textContent=Math.min(unlocked,17)+' / 17 cleared · Lives '+runState.lives;
 const coords=STAGES.map((s,i)=>({x:65+(i%6)*(830/5),y:90+Math.floor(i/6)*135}));
 // Reverse the middle row to make one continuous trail.
 for(let i=6;i<12;i++)coords[i].x=895-(i%6)*(830/5);
 const route=coords.map(v=>v.x+','+v.y).join(' ');
 $('island-map').innerHTML='<svg viewBox="0 0 960 445" role="group" aria-label="World map: 15 levels, tower and castle"><defs><filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-opacity=".25"/></filter></defs><path d="M30 60 Q200 -5 370 65 T730 55 Q960 10 930 240 Q970 430 730 410 Q510 475 330 405 Q20 460 20 250Z" fill="#477265" opacity=".5"/><path d="M40 65 Q270 15 445 72 T910 76" fill="none" stroke="#8cb58b" stroke-width="2" opacity=".25"/><polyline points="'+route+'" fill="none" stroke="#102e3b" stroke-width="14" stroke-linejoin="round"/><polyline points="'+route+'" fill="none" stroke="#6b938b" stroke-width="3" stroke-dasharray="5 9"/>'+STAGES.map((s,i)=>{
 const {x,y}=coords[i],locked=i>unlocked,done=i<unlocked,label=s.boss?(i===8?'TOWER':'CASTLE'):String(i>8?i:i+1).padStart(2,'0');
 return '<g class="stage '+(locked?'locked':'')+'" role="button" tabindex="'+(locked?'-1':'0')+'" aria-disabled="'+locked+'" aria-label="'+s.name+' — '+makeLevel(i).mechanic+(locked?', locked':done?', cleared':', ready')+'" data-stage="'+i+'"><ellipse cx="'+x+'" cy="'+(y+14)+'" rx="38" ry="17" fill="#0b2435" opacity=".4"/><circle cx="'+x+'" cy="'+y+'" r="'+(s.boss?29:23)+'" fill="'+(done?'#86c6a0':locked?'#284957':'#f7cd69')+'" stroke="'+(locked?'#53747a':'#e7edbd')+'" stroke-width="3" filter="url(#shadow)"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" fill="'+(locked?'#8ca8ad':'#173e42')+'">'+(done?'✓':label)+'</text><text x="'+x+'" y="'+(y+46)+'" text-anchor="middle" fill="'+(locked?'#8da8ad':'#e8eee4')+'" style="font-size:10px">'+s.name+'</text>'+(i===unlocked?'<text x="'+x+'" y="'+(y-39)+'" text-anchor="middle" fill="#f7cd69">JARVIS</text>':'')+'</g>'
 }).join('')+'</svg>';
 document.querySelectorAll('[data-stage]').forEach(el=>{const go=()=>{const i=Number(el.dataset.stage);if(i<=unlocked)start(i)};el.onclick=go;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}});
}
function showMap(){mode='map';keys.clear();pressed.clear();$('map').hidden=false;$('play').hidden=true;$('overlay').hidden=true;$('map-button').hidden=true;$('pause').hidden=true;$('world-title').textContent='THE SKYBOUND ISLES';$('status').textContent=runState.lives===0?'No lives left. Choose a stage to start again with 5 lives.':unlocked===17?'The Storm King has fallen. Replay any stage to collect more starlight.':'Choose an unlocked stage. Your next destination is highlighted.';renderMap()}
$('map-button').onclick=showMap;
$('reset').onclick=()=>{if(confirm('Reset all Jarvis stage progress on this device?')){unlocked=0;resetLives(runState);runState.stage=0;persistRun();try{localStorage.removeItem('jarvis-skybound-v1')}catch{}renderMap()}};
function start(i){level=makeLevel(i);runState.stage=i;if(runState.lives===0){gameOver();return}persistRun();checkpoint=0;score=0;accumulator=0;respawn();$('map').hidden=true;$('play').hidden=false;$('overlay').hidden=true;$('map-button').hidden=false;$('pause').hidden=false;$('pause').textContent='Pause';$('world-title').textContent=level.name.toUpperCase();mode='play';canvas.focus();$('status').textContent=level.identity+' — '+level.mechanic+'. Shift = run; Down + move = crawl.'}
function respawn(){
 const fresh=resetWorld(level,checkpoint);p=createPlayer(fresh.spawn.x,fresh.spawn.y);p.ground=true;p.inv=PHYSICS.invincibility;
 shots=[];clouds=[];particles=[];items=fresh.items;remaining=level.timeLimit;
 keys.clear();pressed.clear();camera=Math.max(0,Math.min(level.width-960,p.x-300));
}
function modal(title,copy,label,next){$('overlay-title').textContent=title;$('overlay-copy').textContent=copy;$('continue').textContent=label;$('overlay').hidden=false;$('continue').onclick=next;keys.clear();pressed.clear()}
function pause(){if(mode==='play'){mode='paused';$('pause').textContent='Resume';modal('Take a breather.','Your adventure will be right here.','Resume',pause)}else if(mode==='paused'){mode='play';$('pause').textContent='Pause';$('overlay').hidden=true;canvas.focus()}}
$('pause').onclick=pause;
function die(reason='hit'){
 if(mode!=='play')return;
 deathReason=reason;loseLife(runState);persistRun();mode='dying';deathTimer=.75;p.dead=true;p.anim='death';p.animTime=0;p.vy=-330;tone(100,.3);
 keys.clear();pressed.clear();
}
function gameOver(){
 mode='gameover';$('map').hidden=true;$('play').hidden=false;$('pause').hidden=true;
 remaining=0;if(!p||!level)p=createPlayer(80,442);
 modal('GAME OVER','No lives left. Your cleared stages are safe. Start this stage again with '+INITIAL_LIVES+' lives.','Try again — '+INITIAL_LIVES+' lives',()=>{
 resetLives(runState);persistRun();start(runState.stage);
 });
}
function deathScreen(){
 if(runState.lives===0){gameOver();return}
 mode='dead';
 modal(deathReason==='timeout'?'TIME UP':'One more try?',
 'Lives left: '+runState.lives+'. Return as Small Jarvis at your checkpoint with a fresh timer.','Retry stage',()=>{
 const i=level.index,cp=checkpoint;start(i);checkpoint=cp;respawn();mode='play';$('overlay').hidden=true;
 });
}
function win(){mode='won';unlocked=Math.max(unlocked,level.index+1);try{localStorage.setItem('jarvis-skybound-v1',String(unlocked))}catch{}tone(880,.3);modal(level.index===16?'The sky is yours, Jarvis!':'Stage cleared!',level.index===16?'The Storm King is defeated and the Skybound Isles are free. All stages are now open for replay.':level.name+' complete. You collected '+score+' starlight coins. The next path is open.','Return to world map',showMap)}
function hit(){
 const result=damagePlayer(p,solidsFor(level));
 if(result==='dead')die();
 else if(result==='hurt'){tone(140,.15);$('status').textContent=p.state+' — temporary invincibility';}
}
function bumpBlock(block){
 if(block.kind==='item'&&activateBlock(block,p,items))tone(630);
 if(block.kind==='brick'&&!block.broken&&p.state!==STATES.SMALL){
 block.broken=true;burst(block.x+16,block.y+16,'#dcab7e');tone(220);
 }else block.bump=.16;
}
function burst(x,y,color){for(let i=0;i<10;i++)particles.push({x,y,vx:(Math.random()-.5)*220,vy:-Math.random()*190,life:.6,color})}
function power(){if(p.cool>0||p.power==='none'||p.crouch||p.dead)return;p.cool=.32;
 if(p.power==='cloud'){if(p.charges>0){clouds.push({x:p.x-30,y:p.y+p.h+14,w:100,h:14,life:4});p.charges--;tone(660)}}
 else if(p.power==='helicopter'){if(p.boost){p.vy=-720;p.boost=false;tone(740)}}
 else{shots.push({x:p.x+(p.face>0?p.w:-16),y:p.y+p.h*.4,w:16,h:16,vx:p.face*(p.power==='hammer'?340:430),vy:p.power==='hammer'?-430:-80,type:p.power,life:2.4});tone(p.power==='ice'?800:400)}
}
function update(dt){
 clock+=dt;
 remaining=tickTimer(remaining,dt);if(remaining===0){die('timeout');return}
 stepWorld(level,p,dt);
 const oldY=p.y;
 const input={
 jump:pressed.has('Space')||pressed.has('KeyW')||pressed.has('ArrowUp'),
 held:keys.has('Space')||keys.has('KeyW')||keys.has('ArrowUp'),
 axis:(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0),
 run:keys.has('ShiftLeft')||keys.has('ShiftRight'),
 down:keys.has('ArrowDown')||keys.has('KeyS')
 };
 const result=stepPlayer(p,input,dt,level,clouds,bumpBlock);
 if(result.jumped)tone(520);
 if(pressed.has('KeyX')||pressed.has('KeyK'))power();
 for(const block of level.blocks)block.bump=Math.max(0,(block.bump||0)-dt);
 for(const b of clouds)b.life-=dt;
 clouds=clouds.filter(b=>b.life>0);
 stepItems(items,dt,level,p,item=>{tone(760,.18);$('status').textContent=(p.pending?'Growth queued until there is headroom':p.state+' acquired')+'. Shift to run; X to use a special power.'});
 const reached=checkpointReached(level,p,checkpoint);
 if(reached!==checkpoint){checkpoint=reached;$('status').textContent='Checkpoint reached — safe return and item boxes.';tone(900)}
 for(const h of level.hazards)if(h.state==='active'&&overlap(p,h)){hit();if(mode!=='play')return}
 if(p.y>620){die('fall');return}
 for(const c of level.coins)if(!c.taken&&overlap(p,{x:c.x-9,y:c.y-9,w:18,h:18})){c.taken=true;score++;tone(1100,.04);burst(c.x,c.y,'#f7cd69')}
 for(const e of level.enemies){if(!e.alive)continue;if(e.frozen>0)e.frozen-=dt;else{e.x+=e.vx*dt;if(e.x<e.min||e.x>e.max)e.vx*=-1}
 if(overlap(p,e)){if(e.frozen>0||p.vy>0&&oldY+p.h<=e.y+15){e.alive=false;p.vy=-390;burst(e.x,e.y,'#bd91dc');tone(260)}else hit();if(mode!=='play')return;}}
 const boss=level.chief;
 if(boss&&boss.hp>0){boss.cool-=dt;boss.timer+=dt;boss.x+=Math.sin(clock*1.1)*55*dt;
 if(boss.timer>1.5){boss.timer=0;shots.push({x:boss.x,y:boss.y+30,w:20,h:20,vx:p.x<boss.x?-230:230,vy:-140,type:'enemy',life:4})}
 if(overlap(p,boss)){if(p.vy>0&&oldY+p.h<=boss.y+20){if(boss.cool<=0){boss.hp--;boss.cool=.65;burst(boss.x,boss.y,'#f7cd69')}p.vy=-570}else hit();if(mode!=='play')return;}
 }
 for(const s of shots){s.life-=dt;const before=s.y;s.x+=s.vx*dt;s.vy+=(s.type==='hammer'?1100:600)*dt;s.y+=s.vy*dt;
 if(s.type!=='hammer')for(const b of solidsFor(level))if(overlap(s,b)){if(s.vy>0&&before+s.h<=b.y+12){s.y=b.y-s.h;s.vy=-260}else s.life=0}
 if(s.type==='enemy'){if(overlap(p,s)){hit();s.life=0}}else{
 for(const e of level.enemies)if(e.alive&&overlap(s,e)){if(s.type==='ice')e.frozen=4;else e.alive=false;s.life=0;burst(e.x,e.y,colors[s.type])}
 if(boss&&boss.hp>0&&boss.cool<=0&&overlap(s,boss)){boss.hp--;boss.cool=.4;s.life=0;burst(boss.x,boss.y,colors[s.type]);tone(190)}
 }}
 if(mode!=='play')return;
 shots=shots.filter(s=>s.life>0&&s.y<650);
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
 for(const e of level.enemies)if(e.alive){const x=e.x,y=e.y;rect(x+3,y+7,24,25,e.frozen>0?'#96e7ff':'#725779');rect(x,y+25,10,7,'#32344e');rect(x+20,y+25,10,7,'#32344e');rect(x+5,y+10,5,5,'#fff');rect(x+20,y+10,5,5,'#fff');if(e.frozen>0){ctx.strokeStyle='#e0ffff';ctx.strokeRect(x-3,y-3,36,38)}}
 const boss=level.chief;
 if(boss&&boss.hp>0){rect(boss.x,boss.y,boss.w,boss.h,boss.cool>0?'#f6cb72':'#40375c');rect(boss.x-10,boss.y+12,92,20,'#77618c');for(let i=0;i<3;i++)rect(boss.x+10+i*22,boss.y-12,12,18,'#f7cd69');rect(boss.x+12,boss.y+30,12,8,'#fcba72');rect(boss.x+48,boss.y+30,12,8,'#fcba72');rect(boss.x,boss.y-30,72,5,'#221b36');rect(boss.x,boss.y-30,72*boss.hp/boss.max,5,'#f7cd69');text(level.index===16?'STORM KING':'THE SENTINEL',boss.x+36,boss.y-44,12,'#fff','center')}
 for(const s of shots){ctx.save();ctx.translate(s.x+8,s.y+8);if(s.type==='hammer'){ctx.rotate(clock*14);rect(-3,-8,6,24,'#dbad74');rect(-12,-10,24,12,colors.hammer)}else circle(0,0,8,s.type==='enemy'?'#ef8580':colors[s.type]);ctx.restore()}
 const goal=level.goal;rect(goal,level.goalY-170,6,170,'#ece6bd');rect(goal+6,level.goalY-170,48,30,boss&&boss.hp>0?'#a47e8b':'#f7cd69');circle(goal+3,level.goalY-175,9,'#fff2ae');text(boss&&boss.hp>0?'DEFEAT THE GUARDIAN':'FINISH',goal,level.goalY-188,12,'#fff','center');
 drawSprite(ctx,p,clock);
 for(const a of particles){ctx.globalAlpha=Math.max(0,a.life/.6);rect(a.x,a.y,4,4,a.color);ctx.globalAlpha=1}
 ctx.restore();
 rect(16,14,280,62,'#10283ad9');text('JARVIS',30,36,12,'#8bd7c0');text(p.state,30,61,14,'#f0dba1');text('✦ '+score,137,59,17,'#f7cd69');text(p.power.toUpperCase(),195,37,10,colors[p.power]);text(p.power==='cloud'?p.charges+' clouds':'X · POWER',195,58,10,'#dae8ee');
 rect(650,14,182,62,'#10283ad9');text('LIVES '+runState.lives,662,37,14,'#f7cd69');text('TIME '+Math.ceil(remaining),662,60,14,remaining<=60?'#ff9b87':'#e5eeec');
 text(level.boss?'BOSS STAGE':'STAGE '+(level.index>8?level.index:level.index+1),930,36,12,'#fff','right');
}
function frame(t){
 const elapsed=Math.max(0,Math.min((t-last)/1000||0,.1));last=t;
 if(mode==='play'){
 accumulator=Math.min(accumulator+elapsed,.1);
 while(accumulator>=PHYSICS.fixedStep&&mode==='play'){update(PHYSICS.fixedStep);accumulator-=PHYSICS.fixedStep}
 }else{
 accumulator=0;
 if(mode==='dying'){clock+=elapsed;deathTimer-=elapsed;p.animTime+=elapsed;p.vy+=PHYSICS.gravity*elapsed;p.y+=p.vy*elapsed;if(deathTimer<=0)deathScreen()}
 }
 if(level&&mode!=='map')draw();requestAnimationFrame(frame);
}
document.addEventListener('keydown',e=>{if(mode==='map')return;if(['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();if(e.target.tagName==='BUTTON'&&(e.code==='Space'||e.code==='Enter'))return;if(!e.repeat){pressed.add(e.code);if(e.code==='KeyP'||e.code==='Escape')pause();if(e.code==='KeyR'&&mode==='play')start(level.index)}keys.add(e.code)});
document.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{keys.clear();pressed.clear();if(mode==='play')pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')pause()});
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);pressed.add(b.dataset.key);b.classList.add('active')};const up=()=>{keys.delete(b.dataset.key);b.classList.remove('active')};b.onpointerup=up;b.onpointercancel=up;b.onlostpointercapture=up});
showMap();requestAnimationFrame(frame);
