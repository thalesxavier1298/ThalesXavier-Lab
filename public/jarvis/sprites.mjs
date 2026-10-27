import {STATE_COLORS,STATES} from './config.mjs';
// Original Jarvis pixel masks. No downloaded or commercial game assets.
const HEAD=[
'.....AAAAAA.....',
'....AHHHHHHA....',
'...AHHHHHHHHA...',
'...AAAAAAAAAAA..',
'...AKSSSSKSSA...',
'....KSSSSSSK....',
'.....KSSSSK.....',
'......KKKK......'];
const BODY=[
'.....CCCCCC.....',
'....ACCCCCTT....',
'...ACCCCCTTTTA..',
'..AACCCCCT..AA..',
'..SKCCCCCCT.KS..',
'..SKBBBBBBT.KS..',
'...KBBBBBBBK....',
'....BBBBBBBK....'];
const LEGS=[
'....KBB..BBK....',
'....KBB..BBK....',
'....KBB..BBK....',
'....KBB..BBK....',
'....KBB..BBK....',
'...KDDD..DDDK...',
'...KDDD..DDDK...',
'....KKK..KKK....'];
const SMALLBODY=[
'....ACCCTTTA....',
'...ACCCCT..AA...',
'..SKBBBCC..KS...',
'...KBBBBBBBK....',
'....KBB.BBK.....',
'...KDDD.DDDK....'];
function shiftRow(row,n){if(n>0)return '.'.repeat(n)+row.slice(0,16-n);if(n<0)return row.slice(-n)+'.'.repeat(-n);return row}
export function spriteMask(big,pose,frame=0){
 let rows=[...HEAD,...(big?[...BODY,...LEGS]:SMALLBODY)];
 const legStart=big?16:11;
 if(pose==='walk'||pose==='run'){
  rows=rows.map((row,i)=>i>=legStart?shiftRow(row,(frame%4<2?1:-1)*(pose==='run'?2:1)):row);
  if(frame%2)rows=['................',...rows.slice(0,-1)];
 }
 if(pose==='jump')rows=rows.map((r,i)=>i>=legStart?shiftRow(r,i%2?2:-1):r);
 if(pose==='fall')rows=rows.map((r,i)=>i>=8&&i<11?shiftRow(r,i%2?1:-1):r);
 if(pose==='crouch'||pose==='land')rows=[...HEAD,...rows.slice(big?18:10)];
 if(pose==='damage')rows=rows.map((r,i)=>shiftRow(r,i%2?1:0));
 if(pose==='death')rows=rows.slice().reverse();
 return rows;
}
export function drawSprite(ctx,p,time){
 if(p.inv>0&&Math.floor(time*14)%2)return;
 const big=p.state!==STATES.SMALL,frame=Math.floor(p.animTime*(p.anim==='run'?15:9));
 const rows=spriteMask(big,p.anim,frame),pixel=2;
 const palette={A:'#193350',H:STATE_COLORS[p.state],K:'#17283f',S:'#ffd0a0',C:'#277b9a',B:'#25446c',D:'#efd5a0',T:'#fb895a'};
 if(p.transform>0&&Math.floor(p.transform*18)%2){palette.H='#fff2b1';palette.C='#a4f7eb'}
 const left=Math.round(p.x+p.w/2-16),top=Math.round(p.y+p.h-rows.length*pixel);
 ctx.save();
 if(p.face<0){ctx.translate(left+32,top);ctx.scale(-1,1)}else ctx.translate(left,top);
 for(let y=0;y<rows.length;y++)for(let x=0;x<16;x++){const col=palette[rows[y][x]];if(col){ctx.fillStyle=col;ctx.fillRect(x*pixel,y*pixel,pixel,pixel)}}
 // Idle breathing and scarf flutter stay within the same silhouette.
 if(p.anim==='idle'&&Math.floor(time*2)%2){ctx.fillStyle=palette.T;ctx.fillRect(26,18,4,2)}
 if(p.state===STATES.HELICOPTER){ctx.fillStyle='#25446c';ctx.fillRect(14,-8,4,8);ctx.fillStyle=palette.H;ctx.fillRect(frame%2?0:5,-10,frame%2?32:22,4)}
 if(p.state===STATES.CLOUD){ctx.fillStyle='#fff9e8';ctx.fillRect(2,2,8,4);ctx.fillRect(20,2,8,4)}
 if(p.state===STATES.HAMMER){ctx.fillStyle='#b4a3cc';ctx.fillRect(4,19,24,5)}
 if(p.transform>0){ctx.fillStyle='#fff2b1';for(let i=0;i<4;i++){const x=16+Math.round(Math.sin(time*16+i*2)*22),y=rows.length-8+Math.round(Math.cos(time*16+i*2)*24);ctx.fillRect(x,y,3,3)}}
 ctx.restore();
}
export function drawItem(ctx,item,time){
 if(item.taken)return;
 const x=Math.round(item.x),y=Math.round(item.y+(item.type==='super'?0:Math.sin(time*3)*3)+(item.emerge>0?item.emerge/.35*28:0));
 const color=item.type==='life'?'#39cc62':item.type==='super'?'#a3e477':STATE_COLORS[item.type.toUpperCase()]||'#a8e978';
 const r=(a,b,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(x+a,y+b,w,h)};
 if(item.type==='hammer'){
  // Hammer-shaped blossom: broad metal head, narrow handle, two leaves.
  r(1,1,26,14,'#24334b');r(3,3,22,10,'#bba6d9');r(5,4,5,8,'#f2e9ff');r(20,3,5,10,'#82719f');
  r(12,15,5,13,'#a27650');r(13,16,2,10,'#e4bd79');r(4,19,8,4,'#66b888');r(17,22,8,4,'#66b888');return;
 }
 if(item.type==='coin'){r(8,2,12,24,'#d99435');r(4,6,20,16,'#f7cd69');r(12,6,4,16,'#fff0a4');return}
 if(item.type==='super'||item.type==='life'||item.type==='helicopter'){
  r(8,2,12,2,'#173950');r(4,4,20,4,color);r(2,8,24,8,color);r(0,14,28,4,'#173950');
  r(8,18,12,8,'#ffe0ab');r(10,20,2,3,'#173950');r(16,20,2,3,'#173950');
  r(6,7,5,5,'#e5fff4');r(18,10,5,4,'#e5fff4');
  if(item.type==='life'){r(8,8,12,8,'#e9ffe0');r(12,9,4,6,'#28974c')}
  else if(item.type==='super'){r(12,4,4,4,'#a3e477');r(2,12,4,3,'#235f67')}
  else{r(12,-6,3,8,'#173950');r(2,-8,24,3,'#ffdd70')}
 }else{
  r(12,14,4,14,'#377c68');r(5,21,8,4,'#6bba7e');r(16,19,8,4,'#6bba7e');
  r(8,0,12,4,color);r(4,4,20,12,color);r(8,16,12,4,color);
  r(10,5,8,8,'#fff1b5');r(11,7,2,3,'#173950');r(16,7,2,3,'#173950');
 }
}
