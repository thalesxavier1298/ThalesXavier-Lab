import {STAGES,makeLevel,overlap,readProgress} from './levels.mjs';
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');
let unlocked;try{unlocked=readProgress(localStorage)}catch{unlocked=0}
let level=null,p=null,keys=new Set(),pressed=new Set(),shots=[],clouds=[],particles=[],camera=0,mode='map',last=0,clock=0,score=0,checkpoint=80,sound=false,audio=null;
const colors={cloud:'#eef8ff',fire:'#ff9a58',ice:'#8ce5ff',hammer:'#d8b6ff',helicopter:'#f5d977',none:'#8bd7c0'};
function tone(freq=440,duration=.08){if(!sound)return;try{audio??=new AudioContext();const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=freq;g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.start();o.stop(audio.currentTime+duration)}catch{}}
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',sound);tone()};
function renderMap(){
 $('progress').textContent=Math.min(unlocked,17)+' / 17 cleared';
 const coords=STAGES.map((s,i)=>({x:65+(i%6)*(830/5),y:90+Math.floor(i/6)*135}));
 // Reverse the middle row to make one continuous trail.
 for(let i=6;i<12;i++)coords[i].x=895-(i%6)*(830/5);
 const route=coords.map(v=>v.x+','+v.y).join(' ');
 $('island-map').innerHTML='<svg viewBox="0 0 960 445" role="group" aria-label="World map: 15 levels, tower and castle"><defs><filter id="shadow"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-opacity=".25"/></filter></defs><path d="M30 60 Q200 -5 370 65 T730 55 Q960 10 930 240 Q970 430 730 410 Q510 475 330 405 Q20 460 20 250Z" fill="#477265" opacity=".5"/><path d="M40 65 Q270 15 445 72 T910 76" fill="none" stroke="#8cb58b" stroke-width="2" opacity=".25"/><polyline points="'+route+'" fill="none" stroke="#102e3b" stroke-width="14" stroke-linejoin="round"/><polyline points="'+route+'" fill="none" stroke="#6b938b" stroke-width="3" stroke-dasharray="5 9"/>'+STAGES.map((s,i)=>{
 const {x,y}=coords[i],locked=i>unlocked,done=i<unlocked,label=s.boss?(i===8?'TOWER':'CASTLE'):String(i>8?i:i+1).padStart(2,'0');
 return '<g class="stage '+(locked?'locked':'')+'" role="button" tabindex="'+(locked?'-1':'0')+'" aria-disabled="'+locked+'" aria-label="'+s.name+(locked?', locked':done?', cleared':', ready')+'" data-stage="'+i+'"><ellipse cx="'+x+'" cy="'+(y+14)+'" rx="38" ry="17" fill="#0b2435" opacity=".4"/><circle cx="'+x+'" cy="'+y+'" r="'+(s.boss?29:23)+'" fill="'+(done?'#86c6a0':locked?'#284957':'#f7cd69')+'" stroke="'+(locked?'#53747a':'#e7edbd')+'" stroke-width="3" filter="url(#shadow)"/><text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" fill="'+(locked?'#8ca8ad':'#173e42')+'">'+(done?'✓':label)+'</text><text x="'+x+'" y="'+(y+46)+'" text-anchor="middle" fill="'+(locked?'#8da8ad':'#e8eee4')+'" style="font-size:10px">'+s.name+'</text>'+(i===unlocked?'<text x="'+x+'" y="'+(y-39)+'" text-anchor="middle" fill="#f7cd69">JARVIS</text>':'')+'</g>'
 }).join('')+'</svg>';
 document.querySelectorAll('[data-stage]').forEach(el=>{const go=()=>{const i=Number(el.dataset.stage);if(i<=unlocked)start(i)};el.onclick=go;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}});
}
function showMap(){mode='map';keys.clear();pressed.clear();$('map').hidden=false;$('play').hidden=true;$('overlay').hidden=true;$('map-button').hidden=true;$('pause').hidden=true;$('world-title').textContent='THE SKYBOUND ISLES';$('status').textContent=unlocked===17?'The Storm King has fallen. Replay any stage to collect more starlight.':'Choose an unlocked stage. Your next destination is highlighted.';renderMap()}
$('map-button').onclick=showMap;
$('reset').onclick=()=>{if(confirm('Reset all Jarvis stage progress on this device?')){unlocked=0;try{localStorage.removeItem('jarvis-skybound-v1')}catch{}renderMap()}};
function start(i){level=makeLevel(i);checkpoint=80;score=0;respawn();$('map').hidden=true;$('play').hidden=false;$('overlay').hidden=true;$('map-button').hidden=false;$('pause').hidden=false;$('pause').textContent='Pause';$('world-title').textContent=level.name.toUpperCase();mode='play';canvas.focus();$('status').textContent='Reach the beacon. Collect capsules for powers. Jump on enemies or use X to attack.'}
function respawn(){p={x:checkpoint,y:360,w:28,h:40,vx:0,vy:0,hp:3,inv:1.5,power:'none',face:1,ground:false,coyote:0,buffer:0,cool:0,charges:3,boost:true};shots=[];clouds=[];particles=[];keys.clear();pressed.clear()}
function modal(title,copy,label,next){$('overlay-title').textContent=title;$('overlay-copy').textContent=copy;$('continue').textContent=label;$('overlay').hidden=false;$('continue').onclick=next;keys.clear();pressed.clear()}
function pause(){if(mode==='play'){mode='paused';$('pause').textContent='Resume';modal('Take a breather.','Your adventure will be right here.','Resume',pause)}else if(mode==='paused'){mode='play';$('pause').textContent='Pause';$('overlay').hidden=true;canvas.focus()}}
$('pause').onclick=pause;
function die(){mode='dead';tone(100,.3);modal('One more try?','Restart from your checkpoint with fresh hearts. Stage progress is kept.','Retry stage',()=>{const i=level.index,cp=checkpoint;start(i);checkpoint=cp;respawn();mode='play';$('overlay').hidden=true})}
function win(){mode='won';unlocked=Math.max(unlocked,level.index+1);try{localStorage.setItem('jarvis-skybound-v1',String(unlocked))}catch{}tone(880,.3);modal(level.index===16?'The sky is yours, Jarvis!':'Stage cleared!',level.index===16?'The Storm King is defeated and the Skybound Isles are free. All stages are now open for replay.':level.name+' complete. You collected '+score+' starlight coins. The next path is open.','Return to world map',showMap)}
function hit(){if(p.inv>0)return;p.hp--;p.inv=1.5;p.power='none';p.vy=-280;tone(140,.15);if(p.hp<=0)die()}
function burst(x,y,color){for(let i=0;i<10;i++)particles.push({x,y,vx:(Math.random()-.5)*220,vy:-Math.random()*190,life:.6,color})}
function power(){if(p.cool>0||p.power==='none')return;p.cool=.32;
 if(p.power==='cloud'){if(p.charges>0){clouds.push({x:p.x-30,y:p.y+p.h+14,w:100,h:14,life:4});p.charges--;tone(660)}}
 else if(p.power==='helicopter'){if(p.boost){p.vy=-720;p.boost=false;tone(740)}}
 else{shots.push({x:p.x+(p.face>0?28:-12),y:p.y+12,w:16,h:16,vx:p.face*(p.power==='hammer'?340:430),vy:p.power==='hammer'?-430:-80,type:p.power,life:2.4});tone(p.power==='ice'?800:400)}
}
function update(dt){
 clock+=dt;p.inv-=dt;p.cool-=dt;
 const jump=pressed.has('Space')||pressed.has('KeyW')||pressed.has('ArrowUp'),held=keys.has('Space')||keys.has('KeyW')||keys.has('ArrowUp');
 if(jump)p.buffer=.14;else p.buffer-=dt;
 p.coyote=p.ground?.12:p.coyote-dt;
 if(p.buffer>0&&p.coyote>0){p.vy=-590;p.buffer=0;p.coyote=0;p.ground=false;tone(520)}
 if(pressed.has('KeyX')||pressed.has('KeyK'))power();
 const axis=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0);
 p.vx+=(axis*280-p.vx)*Math.min(1,dt*14);if(axis)p.face=axis;
 const oldY=p.y;
 p.vy+=1450*dt;
 if(!held&&p.vy<-220)p.vy+=1300*dt;
 if(p.power==='helicopter'&&held&&p.vy>100)p.vy=100;
 p.x+=p.vx*dt;
 for(const b of level.platforms)if(overlap(p,b)){if(p.vx>0)p.x=b.x-p.w;else if(p.vx<0)p.x=b.x+b.w}
 p.x=Math.max(0,Math.min(level.width-p.w,p.x));
 p.y+=p.vy*dt;p.ground=false;
 for(const b of level.platforms){if(overlap(p,b)){if(p.vy>=0&&oldY+p.h<=b.y+6){p.y=b.y-p.h;p.vy=0;p.ground=true}else if(p.vy<0){p.y=b.y+b.h;p.vy=0}}}
 for(const b of clouds){b.life-=dt;if(p.vy>=0&&oldY+p.h<=b.y+3&&overlap(p,b)){p.y=b.y-p.h;p.vy=0;p.ground=true}}
 clouds=clouds.filter(b=>b.life>0);
 if(p.ground){p.charges=3;p.boost=true}
 if(p.x>level.width*.5&&checkpoint===80&&p.ground){checkpoint=level.width*.5; // Find safe ground at the midpoint.
 const floor=level.platforms.find(b=>b.y===470&&b.x>=checkpoint);checkpoint=floor?floor.x+35:80;$('status').textContent='Checkpoint reached!';tone(900)}
 if(p.y>620){die();return}
 for(const c of level.coins)if(!c.taken&&overlap(p,{x:c.x-9,y:c.y-9,w:18,h:18})){c.taken=true;score++;tone(1100,.04);burst(c.x,c.y,'#f7cd69');if(score%25===0)p.hp=Math.min(3,p.hp+1)}
 for(const item of level.pickups)if(!item.taken&&overlap(p,{x:item.x-16,y:item.y-16,w:32,h:32})){item.taken=true;p.power=item.type;p.charges=3;p.boost=true;tone(760,.18);$('status').textContent=item.type.toUpperCase()+' acquired. Press X / Power to use it.'}
 for(const e of level.enemies){if(!e.alive)continue;if(e.frozen>0)e.frozen-=dt;else{e.x+=e.vx*dt;if(e.x<e.min||e.x>e.max)e.vx*=-1}
 if(overlap(p,e)){if(e.frozen>0||p.vy>0&&oldY+p.h<=e.y+15){e.alive=false;p.vy=-390;burst(e.x,e.y,'#bd91dc');tone(260)}else hit()}}
 const boss=level.chief;
 if(boss&&boss.hp>0){boss.cool-=dt;boss.timer+=dt;boss.x+=Math.sin(clock*1.1)*55*dt;
 if(boss.timer>1.5){boss.timer=0;shots.push({x:boss.x,y:boss.y+30,w:20,h:20,vx:p.x<boss.x?-230:230,vy:-140,type:'enemy',life:4})}
 if(overlap(p,boss)){if(p.vy>0&&oldY+p.h<=boss.y+20){if(boss.cool<=0){boss.hp--;boss.cool=.65;burst(boss.x,boss.y,'#f7cd69')}p.vy=-570}else hit()}
 }
 for(const s of shots){s.life-=dt;const before=s.y;s.x+=s.vx*dt;s.vy+=(s.type==='hammer'?1100:600)*dt;s.y+=s.vy*dt;
 if(s.type!=='hammer')for(const b of level.platforms)if(overlap(s,b)){if(s.vy>0&&before+s.h<=b.y+12){s.y=b.y-s.h;s.vy=-260}else s.life=0}
 if(s.type==='enemy'){if(overlap(p,s)){hit();s.life=0}}else{
 for(const e of level.enemies)if(e.alive&&overlap(s,e)){if(s.type==='ice')e.frozen=4;else e.alive=false;s.life=0;burst(e.x,e.y,colors[s.type])}
 if(boss&&boss.hp>0&&boss.cool<=0&&overlap(s,boss)){boss.hp--;boss.cool=.4;s.life=0;burst(boss.x,boss.y,colors[s.type]);tone(190)}
 }}
 shots=shots.filter(s=>s.life>0&&s.y<650);
 for(const a of particles){a.life-=dt;a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=450*dt}particles=particles.filter(a=>a.life>0);
 if(p.x>=level.goal&&(!boss||boss.hp<=0)){win();return}
 camera=Math.max(0,Math.min(level.width-960,p.x-300));
 pressed.clear();
}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
function circle(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function text(t,x,y,size=16,c='#fff',align='left'){ctx.font='600 '+size+'px "Space Grotesk", sans-serif';ctx.fillStyle=c;ctx.textAlign=align;ctx.fillText(t,x,y)}
function draw(){
 const theme=level.theme,sky=theme==='meadow'?['#73bdca','#d6eec4']:theme==='frost'?['#6f9fca','#d5e5ed']:theme==='ember'?['#694c73','#e7a884']:['#192b54','#776fa0'];
 const grad=ctx.createLinearGradient(0,0,0,540);grad.addColorStop(0,sky[0]);grad.addColorStop(1,sky[1]);ctx.fillStyle=grad;ctx.fillRect(0,0,960,540);
 circle(785,96,45,theme==='storm'?'#eee8ce':'#fff1bc');
 for(let i=-1;i<7;i++){const x=i*235-(camera*.2)%235;ctx.fillStyle=theme==='meadow'?'#75aa9b':theme==='frost'?'#a4c6d7':'#6b667d';ctx.beginPath();ctx.moveTo(x-100,480);ctx.quadraticCurveTo(x+90,90+(i%3)*45,x+260,480);ctx.fill()}
 for(let i=0;i<6;i++){const x=(i*260-camera*.1+2000)%1500-200;circle(x,120+(i%2)*50,25,'#ffffff40');circle(x+25,110+(i%2)*50,32,'#ffffff40');circle(x+55,125+(i%2)*50,22,'#ffffff40')}
 ctx.save();ctx.translate(-camera,0);
 for(const b of level.platforms){rect(b.x,b.y,b.w,b.h,theme==='frost'?'#718899':'#675e68');rect(b.x,b.y,b.w,9,theme==='meadow'?'#8cc594':theme==='frost'?'#d6f1ff':'#d5a187');for(let x=b.x+12;x<b.x+b.w;x+=35)rect(x,b.y+20,15,4,'#ffffff15')}
 for(const b of clouds){ctx.globalAlpha=Math.min(1,b.life);circle(b.x+20,b.y+8,14,'white');circle(b.x+45,b.y,20,'white');circle(b.x+70,b.y+7,14,'white');rect(b.x,b.y,100,14,'white');ctx.globalAlpha=1}
 // Checkpoint flag.
 const mid=level.platforms.find(b=>b.y===470&&b.x>=level.width*.5);
 if(mid){rect(mid.x+35,395,3,75,'#f0e8d9');rect(mid.x+38,395,30,20,checkpoint>80?'#8bd7c0':'#b6c3cc')}
 for(const c of level.coins)if(!c.taken){circle(c.x,c.y,9,'#f7cf62');circle(c.x,c.y,5,'#ffe9a2')}
 for(const item of level.pickups)if(!item.taken){const y=item.y+Math.sin(clock*3)*5;circle(item.x,y,23,colors[item.type]+'40');circle(item.x,y,16,colors[item.type]);text({cloud:'☁',fire:'F',ice:'I',hammer:'H',helicopter:'↟'}[item.type],item.x,y+5,18,'#244255','center')}
 for(const e of level.enemies)if(e.alive){const x=e.x,y=e.y;rect(x+3,y+7,24,25,e.frozen>0?'#96e7ff':'#725779');rect(x,y+25,10,7,'#32344e');rect(x+20,y+25,10,7,'#32344e');rect(x+5,y+10,5,5,'#fff');rect(x+20,y+10,5,5,'#fff');if(e.frozen>0){ctx.strokeStyle='#e0ffff';ctx.strokeRect(x-3,y-3,36,38)}}
 const boss=level.chief;
 if(boss&&boss.hp>0){rect(boss.x,boss.y,boss.w,boss.h,boss.cool>0?'#f6cb72':'#40375c');rect(boss.x-10,boss.y+12,92,20,'#77618c');for(let i=0;i<3;i++)rect(boss.x+10+i*22,boss.y-12,12,18,'#f7cd69');rect(boss.x+12,boss.y+30,12,8,'#fcba72');rect(boss.x+48,boss.y+30,12,8,'#fcba72');rect(boss.x,boss.y-30,72,5,'#221b36');rect(boss.x,boss.y-30,72*boss.hp/boss.max,5,'#f7cd69');text(level.index===16?'STORM KING':'THE SENTINEL',boss.x+36,boss.y-44,12,'#fff','center')}
 for(const s of shots){ctx.save();ctx.translate(s.x+8,s.y+8);if(s.type==='hammer'){ctx.rotate(clock*14);rect(-3,-8,6,24,'#dbad74');rect(-12,-10,24,12,colors.hammer)}else circle(0,0,8,s.type==='enemy'?'#ef8580':colors[s.type]);ctx.restore()}
 const goal=level.goal;rect(goal,300,6,170,'#ece6bd');rect(goal+6,300,48,30,boss&&boss.hp>0?'#a47e8b':'#f7cd69');circle(goal+3,295,9,'#fff2ae');text(boss&&boss.hp>0?'DEFEAT THE GUARDIAN':'FINISH',goal,282,12,'#fff','center');
 if(!(p.inv>0&&Math.floor(clock*12)%2)){const x=p.x,y=p.y,c=colors[p.power];rect(x+4,y+18,20,18,'#214a60');rect(x+1,y+35,11,5,'#162c48');rect(x+17,y+35,11,5,'#162c48');rect(x+3,y+2,22,19,'#e1ab82');rect(x,y,28,8,c);rect(x+(p.face>0?19:5),y+10,4,5,'#162c48');rect(x-4,y+22,7,10,c);rect(x+25,y+22,7,10,c);if(p.power==='helicopter'){rect(x+12,y-10,3,12,'#f7cd69');rect(x-9+Math.sin(clock*30)*5,y-11,46,4,'#f7cd69')}}
 for(const a of particles){ctx.globalAlpha=Math.max(0,a.life/.6);rect(a.x,a.y,4,4,a.color);ctx.globalAlpha=1}
 ctx.restore();
 rect(16,14,280,62,'#10283ad9');text('JARVIS',30,36,12,'#8bd7c0');text('♥'.repeat(Math.max(0,p.hp)),30,61,19,'#f0a39c');text('✦ '+score,118,59,17,'#f7cd69');text(p.power.toUpperCase(),195,37,10,colors[p.power]);text(p.power==='cloud'?p.charges+' clouds':'X · POWER',195,58,10,'#dae8ee');
 text(level.boss?'BOSS STAGE':'STAGE '+(level.index>8?level.index:level.index+1),930,36,12,'#fff','right');
}
function frame(t){const dt=Math.min((t-last)/1000||0,1/30);last=t;if(mode==='play')update(dt);if(level)draw();requestAnimationFrame(frame)}
document.addEventListener('keydown',e=>{if(mode==='map')return;if(['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();if(e.target.tagName==='BUTTON'&&e.code==='Space')return;if(!e.repeat){pressed.add(e.code);if(e.code==='KeyP'||e.code==='Escape')pause();if(e.code==='KeyR'&&mode==='play')start(level.index)}keys.add(e.code)});
document.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{keys.clear();pressed.clear();if(mode==='play')pause()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='play')pause()});
document.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);pressed.add(b.dataset.key);b.classList.add('active')};const up=()=>{keys.delete(b.dataset.key);b.classList.remove('active')};b.onpointerup=up;b.onpointercancel=up;b.onlostpointercapture=up});
showMap();requestAnimationFrame(frame);
