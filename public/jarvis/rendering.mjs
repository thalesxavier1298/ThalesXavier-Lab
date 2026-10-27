const palettes={
 meadow:{sky:'#82ccdf',far:'#83bba1',near:'#519d8b',grass:'#8bd477',edge:'#377b67',soil:'#906e61',dark:'#654f55',light:'#b6926d'},
 frost:{sky:'#8fb9dd',far:'#b7d8dd',near:'#7cabc3',grass:'#e2faf4',edge:'#729dae',soil:'#8396b0',dark:'#586d8f',light:'#b7c9d3'},
 ember:{sky:'#c28ea1',far:'#a97586',near:'#7e5d7f',grass:'#f5c47c',edge:'#aa785c',soil:'#8a6270',dark:'#55435f',light:'#b4827c'},
 storm:{sky:'#323d70',far:'#535b8b',near:'#344d78',grass:'#afc4c0',edge:'#758caa',soil:'#5d6586',dark:'#3e4665',light:'#818ca2'}
};
palettes.tower={sky:'#202431',far:'#343d50',near:'#47536a',grass:'#b0bdcb',edge:'#64748b',soil:'#59667c',dark:'#303a50',light:'#8291a5'};
palettes.castle={sky:'#251e2b',far:'#443044',near:'#684254',grass:'#c7a38b',edge:'#7e5960',soil:'#665365',dark:'#392c40',light:'#927384'};
const r=(ctx,x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x/2)*2,Math.round(y/2)*2,Math.ceil(w/2)*2,Math.ceil(h/2)*2)};
export function background(ctx,theme,camera,time){
 const c=palettes[theme];r(ctx,0,0,960,540,c.sky);
 if(theme==='tower'||theme==='castle'){
  // Interior masonry, deep arched windows, columns and animated torchlight.
  for(let y=0;y<540;y+=40)for(let x=-80;x<1040;x+=80){const sx=x-(camera*.12)%80+(y/40%2)*40;r(ctx,sx,y,78,38,c.far);r(ctx,sx+3,y+3,72,2,c.near)}
  for(let i=-1;i<6;i++){const x=i*240-(camera*.3)%240;
   r(ctx,x+40,82,90,176,c.dark);r(ctx,x+50,68,70,190,c.dark);r(ctx,x+62,58,46,200,c.dark);
   r(ctx,x+80,74,8,184,c.near);r(ctx,x+48,157,76,8,c.near);
   r(ctx,x+178,0,28,470,c.near);r(ctx,x+170,0,44,24,c.grass);r(ctx,x+170,442,44,28,c.edge);
   r(ctx,x+190,280,6,42,'#5d3c3e');const flicker=Math.floor(time*10+i)%3;
   r(ctx,x+184,258-flicker*3,18,28+flicker*3,'#e87b49');r(ctx,x+190,264-flicker*2,6,18,'#ffe3a0');
   if(theme==='castle'){r(ctx,x+8,94,18,104,'#903e4d');r(ctx,x+10,96,14,12,'#d8b069')}
  }return;
 }
 r(ctx,774,62,52,52,theme==='storm'?'#f4efd1':'#fff0b5');r(ctx,766,72,68,32,theme==='storm'?'#f4efd1':'#fff0b5');
 if(theme==='storm')for(let i=0;i<25;i++)r(ctx,(i*137)%960,(i*73)%230,2,2,'#bacbdc');
 for(let i=-1;i<7;i++){const x=i*205-(camera*.15)%205;
  for(let step=0;step<8;step++)r(ctx,x+step*10,250-step*18,210-step*20,290+step*18,c.far);
  r(ctx,x+66,128,58,14,theme==='frost'?'#e2faf4':c.far);
 }
 for(let i=-1;i<7;i++){const x=i*230-(camera*.32)%230;
  r(ctx,x,350,160,190,c.near);r(ctx,x+20,310,120,40,c.near);r(ctx,x+40,280,80,30,c.near);
  r(ctx,x+60,290,8,22,c.far);r(ctx,x+105,325,8,22,c.far);
 }
 for(let i=0;i<5;i++){const x=(i*290-camera*.08+1600)%1450-150,y=70+(i%3)*36;
  r(ctx,x,y+10,100,18,'#dcefe8');r(ctx,x+14,y,58,10,'#f4f7df');r(ctx,x+32,y-8,26,8,'#f4f7df');r(ctx,x+12,y+28,70,4,'#acd5d4');
 }
}
export function terrain(ctx,platforms,theme,camera){
 const c=palettes[theme];
 for(const b of platforms){
  if(b.x+b.w<camera-20||b.x>camera+980)continue;
  r(ctx,b.x,b.y,b.w,b.h,c.soil);
  for(let y=b.y+12;y<b.y+b.h;y+=24)for(let x=b.x+(Math.floor(y/24)%2)*12;x<b.x+b.w-4;x+=28){
   r(ctx,x,y,12,4,c.dark);r(ctx,x+4,y+4,10,4,c.light);
  }
  r(ctx,b.x,b.y,b.w,6,c.grass);r(ctx,b.x,b.y+6,b.w,4,c.edge);
  for(let x=b.x+4;x<b.x+b.w-8;x+=18){r(ctx,x,b.y+6,4,8,c.grass);r(ctx,x+6,b.y+3,8,2,'#e3e8ab')}
  r(ctx,b.x,b.y+10,4,b.h-10,c.dark);r(ctx,b.x+b.w-4,b.y+10,4,b.h-10,c.dark);
  // Decoration is non-colliding and only sits on the existing terrain.
  if(b.h>50&&theme!=='tower'&&theme!=='castle')for(let x=b.x+60;x<b.x+b.w-30;x+=115){
   r(ctx,x,b.y-10,4,10,c.edge);r(ctx,x-6,b.y-6,6,2,c.grass);r(ctx,x+4,b.y-8,6,2,c.grass);
   r(ctx,x+24,b.y-12,2,12,c.edge);r(ctx,x+20,b.y-16,10,6,theme==='frost'?'#f6faf9':'#f1d98b');
  }
 }
}
export function drawBlocks(ctx,blocks,time){
 for(const b of blocks){if(b.broken)continue;const y=b.y-(b.bump>0?Math.sin(b.bump/.16*Math.PI)*6:0),color=b.kind==='brick'?'#c18369':b.used?'#787b88':'#efc276';
  r(ctx,b.x,y,b.w,b.h,'#26364d');r(ctx,b.x+2,y+2,b.w-4,b.h-4,color);r(ctx,b.x+4,y+4,b.w-8,3,'#ffe3a2');
  if(b.kind==='brick'){r(ctx,b.x+2,y+14,b.w-4,2,'#754f59');r(ctx,b.x+12,y+2,2,12,'#754f59');r(ctx,b.x+20,y+16,2,12,'#754f59')}
  else if(!b.used){r(ctx,b.x+12,y+7,8,4,'#6e5555');r(ctx,b.x+16,y+11,4,5,'#6e5555');r(ctx,b.x+12,y+16,4,3,'#6e5555');r(ctx,b.x+12,y+22,4,3,'#6e5555')}
 }
}

export function drawMechanics(ctx,level,player,checkpoint,time){
 for(const lava of level.lava||[]){
  r(ctx,lava.x,lava.y,lava.w,lava.h,'#bd3b37');
  for(let x=lava.x;x<lava.x+lava.w;x+=16){const wave=Math.sin(time*4+x*.06)*3;r(ctx,x,lava.y+wave,16,8,'#ffbf5f');r(ctx,x,lava.y+10+wave,16,14,'#f47742');}
 }
 for(const b of level.moving||[]){
  // Dotted travel guides distinguish moving routes from solid scenery.
  const dx=b.toX-b.originX,dy=b.toY-b.originY,len=Math.hypot(dx,dy);
  for(let n=0;n<=len;n+=24){const t=n/(len||1);r(ctx,b.originX+b.w/2+dx*t,b.originY+10+dy*t,3,3,'#9de0e080')}
  r(ctx,b.x,b.y,b.w,b.h,'#224a63');r(ctx,b.x+2,b.y,b.w-4,5,'#a3e5ee');
  for(let x=b.x+10;x<b.x+b.w-10;x+=24){r(ctx,x,b.y+8,12,5,'#4d99b2')}
  r(ctx,b.x+4,b.y+b.h,8,4,'#16394c');r(ctx,b.x+b.w-12,b.y+b.h,8,4,'#16394c');
 }
 for(const b of level.falling||[]){
  if(b.state==='waiting')continue;
  const x=b.x+(b.state==='shaking'?(Math.floor(time*24)%2?2:-2):0);
  r(ctx,x,b.y,b.w,20,'#584c55');r(ctx,x+2,b.y,b.w-4,5,b.state==='shaking'?'#ffcf6e':'#d6a974');
  for(let n=x+12;n<x+b.w;n+=22){r(ctx,n,b.y+8,3,8,'#d59b67');r(ctx,n+3,b.y+13,6,3,'#d59b67')}
  if(b.state==='shaking'){r(ctx,x+b.w/2,b.y-10,4,6,'#fff0b5')}
 }
 for(const h of level.hazards||[]){
  if(h.kind==='spikes'){
   for(let x=h.x;x<h.x+h.w;x+=12){r(ctx,x,h.y+10,12,4,'#455a70');r(ctx,x+2,h.y+6,8,4,'#e7a6ab');r(ctx,x+4,h.y,4,6,'#fae4cb')}
  }else{
   r(ctx,h.x-4,h.y+h.h-10,h.w+8,10,'#35465b');
   r(ctx,h.x,h.y+h.h-14,h.w,4,h.state==='active'?'#ff8b60':h.state==='warning'?'#ffdc75':'#83a3ae');
   for(let x=h.x+4;x<h.x+h.w;x+=9)r(ctx,x,h.y+h.h-8,4,5,'#162e45');
   if(h.state==='warning'){
    r(ctx,h.x+14,h.y+8,6,16,'#ffdd76');r(ctx,h.x+14,h.y+28,6,5,'#ffdd76');
   }else if(h.state==='active'){
    for(let x=h.x+3;x<h.x+h.w-3;x+=8){
     const height=30+(Math.floor(time*14+x)%3)*5;
     r(ctx,x,h.y+h.h-14-height,6,height,'#f88063');r(ctx,x+2,h.y+h.h-30,2,16,'#ffe9a0');
    }
   }else{r(ctx,h.x+14,h.y+h.h-23,8,4,'#96b9b7')}
  }
 }
 for(const [i,c] of level.checkpoints.entries()){
  if(i===0)continue;
  r(ctx,c.x,c.top-78,4,78,'#e8dcc4');
  r(ctx,c.x+4,c.top-78,38,24,i<=checkpoint?'#8bd7c0':'#f7cd69');
  ctx.font='bold 10px monospace';ctx.fillStyle='#173b49';ctx.fillText('CP',c.x+13,c.top-62);
 }
 for(const s of level.signs||[]){
  // Each cue is anchored at the height of the relevant safe observation area.
  r(ctx,s.x,s.y-34,4,34,'#99735d');r(ctx,s.x-5,s.y-38,14,16,'#d9bd87');
  ctx.font='bold 10px monospace';ctx.textAlign='left';
  const width=ctx.measureText(s.label).width+16;
  r(ctx,s.x-8,s.y-61,width,18,'#19374be8');
  ctx.fillStyle='#f2e4b4';ctx.fillText(s.label,s.x,s.y-48);
 }
}
