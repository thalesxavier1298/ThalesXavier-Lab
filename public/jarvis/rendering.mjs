const palettes={
 meadow:{sky:'#82ccdf',far:'#83bba1',near:'#519d8b',grass:'#8bd477',edge:'#377b67',soil:'#906e61',dark:'#654f55',light:'#b6926d'},
 frost:{sky:'#8fb9dd',far:'#b7d8dd',near:'#7cabc3',grass:'#e2faf4',edge:'#729dae',soil:'#8396b0',dark:'#586d8f',light:'#b7c9d3'},
 ember:{sky:'#c28ea1',far:'#a97586',near:'#7e5d7f',grass:'#f5c47c',edge:'#aa785c',soil:'#8a6270',dark:'#55435f',light:'#b4827c'},
 storm:{sky:'#323d70',far:'#535b8b',near:'#344d78',grass:'#afc4c0',edge:'#758caa',soil:'#5d6586',dark:'#3e4665',light:'#818ca2'}
};
const r=(ctx,x,y,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x/2)*2,Math.round(y/2)*2,Math.ceil(w/2)*2,Math.ceil(h/2)*2)};
export function background(ctx,theme,camera,time){
 const c=palettes[theme];r(ctx,0,0,960,540,c.sky);
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
  if(b.h>50)for(let x=b.x+60;x<b.x+b.w-30;x+=115){
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
