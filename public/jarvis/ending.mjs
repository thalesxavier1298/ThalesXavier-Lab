import {drawSprite} from './sprites.mjs';
export function createEnding(){return {time:0,scene:'trail',done:false}}
export function stepEnding(e,dt){e.time+=Math.max(0,Math.min(dt,.1));e.scene=e.time<3.5?'trail':e.time<8?'climb':e.time<9?'transition':'kingdom';e.done=e.time>=12;return e.done}
export function endingCollection(data){const found=new Set(data.relics);let count=0;for(let i=0;i<17;i++)for(let j=0;j<3;j++)if(found.has(i+':'+j))count++;return {count,total:51,complete:count===51}}
export function drawEnding(ctx,e,player){
 player={...player,inv:0,transform:0};
 const t=e.time,realm=e.scene==='kingdom',r=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h)},ellipse=(x,y,rx,ry,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()},label=(v,x,y,size=20)=>{ctx.font='bold '+size+'px monospace';ctx.fillStyle='#fff2c5';ctx.textAlign='center';ctx.fillText(v,x,y)},gem=(x,y,s=12)=>{ctx.fillStyle='#80e4ef';ctx.beginPath();ctx.moveTo(x,y-s);ctx.lineTo(x+s,y);ctx.lineTo(x,y+s);ctx.lineTo(x-s,y);ctx.closePath();ctx.fill();r(x-2,y-s/2,3,s/2,'#efffff')},cloud=(x,y,s=1)=>{ellipse(x,y,80*s,20*s,'#ecf9ed');ellipse(x-30*s,y-12*s,36*s,25*s,'#ecf9ed');ellipse(x+20*s,y-18*s,40*s,30*s,'#fffbee')};
 const sky=ctx.createLinearGradient(0,0,0,540);sky.addColorStop(0,realm?'#173c66':'#163344');sky.addColorStop(1,realm?'#7cacc0':'#467f73');ctx.fillStyle=sky;ctx.fillRect(0,0,960,540);
 for(let i=0;i<35;i++){const x=(i*137+31)%960,y=(i*61+23)%290,a=1+Math.sin(t*2+i);r(x,y,2+a,2+a,'#fff2b9')}
 for(let i=0;i<6;i++)cloud((i*211+70+t*5)%1160-100,100+(i%3)*110,.7);
 if(!realm){
  label('O CAMINHO PARA O CÉU',480,48,25);ellipse(460,475,445,70,'#163e40');ellipse(460,437,440,65,'#5d9478');
  ctx.lineCap='round';ctx.strokeStyle='#785c3e';ctx.lineWidth=28;ctx.beginPath();ctx.moveTo(150,430);ctx.bezierCurveTo(310,350,510,510,750,425);ctx.stroke();ctx.strokeStyle='#dbbe82';ctx.lineWidth=19;ctx.stroke();
  r(62,335,148,94,'#607683');r(55,322,162,22,'#d5c08a');for(let i=0;i<5;i++)r(55+i*35,305,22,22,'#d5c08a');r(113,375,44,54,'#203446');
  ctx.strokeStyle='#b4d77e';ctx.lineWidth=16;ctx.beginPath();ctx.moveTo(750,450);ctx.bezierCurveTo(705,300,800,180,750,-70);ctx.stroke();
  ctx.strokeStyle='#548e51';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(747,450);ctx.bezierCurveTo(740,250,778,170,750,-70);ctx.stroke();
  for(let i=0;i<10;i++){const y=425-i*57,x=750+Math.sin(i)*14;ellipse(x+(i%2?33:-33),y,40,12,i%2?'#8cc776':'#73b16a')}
  const walk=Math.min(1,t/3.5),climb=Math.max(0,Math.min(1,(t-3.5)/4.5));drawSprite(ctx,{...player,x:150+600*walk,y:420-player.h-climb*520,face:1,anim:climb?'walk':'run',animTime:t},t);
  if(e.scene==='transition'){ctx.globalAlpha=Math.min(1,t-8);r(0,0,960,540,'#fff8d6');ctx.globalAlpha=1}
 }else{
  for(let i=0;i<8;i++)cloud(i*145-30,498,1.4);
  r(130,424,700,34,'#f4e3b5');r(155,405,650,20,'#c99e51');r(180,388,600,18,'#ffe5a3');
  for(const x of [185,270,665,750]){r(x,185,24,204,'#ecdeb5');r(x-8,178,40,14,'#f8cd72');r(x-8,375,40,14,'#f8cd72');r(x+5,195,5,170,'#fff5d7')}
  r(160,146,640,34,'#d1a451');r(180,126,600,22,'#fff0bb');ctx.fillStyle='#f6d48c';ctx.beginPath();ctx.moveTo(145,145);ctx.lineTo(480,48);ctx.lineTo(815,145);ctx.closePath();ctx.fill();
  r(414,216,132,164,'#e6b44d');r(427,231,106,116,'#913e62');r(403,325,154,32,'#ffda79');r(403,348,23,40,'#d89f3e');r(534,348,23,40,'#d89f3e');
  for(let i=0;i<5;i++)r(414+i*28,201-(i===2?18:0),20,25+(i===2?18:0),'#ffe5a0');gem(480,255,22);
  for(const x of [325,595]){r(x,358,66,33,'#875739');r(x-3,348,72,19,'#e6b85c');r(x+28,348,10,43,'#ffe195')}
  for(let i=0;i<42;i++){const x=210+(i*71)%550,y=398+(i%3)*11;ellipse(x,y,9,4,i%2?'#ffe394':'#dca443')}
  for(let i=0;i<12;i++)gem(240+i*43,382+(i%2)*27,8);
  ctx.font='bold 22px monospace';ctx.textAlign='center';ctx.fillStyle='#654928';ctx.fillText('REINO DO CÉU',480,103);const approach=Math.min(1,(t-9)/3);drawSprite(ctx,{...player,x:150+315*approach,y:388-player.h,face:1,anim:approach<1?'walk':'idle',animTime:t},t);
  for(let i=0;i<10;i++)r(350+i*29,170+Math.sin(t+i)*20,3,3,'#fff9d1');
 }
}
