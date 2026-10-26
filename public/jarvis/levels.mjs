export const POWERS = ['cloud','fire','ice','hammer','helicopter'];
const names=['Dewdrop Meadow','Treetop Trail','Amber Aqueduct','Bramble Crossing','Cloudstep Cliffs','Crystal Cavern','Frostfall Run','Windmill Heights','Sentinel Tower','Sunken Gardens','Emberworks','Hammer Ridge','Moonlit Marsh','Skyrail Summit','Thunder Pass','Last Light Ascent','Storm King Castle'];
export const STAGES=names.map((name,i)=>({name,index:i,boss:i===8||i===16,theme:i<5?'meadow':i<9?'frost':i<13?'ember':'storm',power:POWERS[(i>=9?i-1:i)%5]}));
export function makeLevel(index){
 const s=STAGES[index],boss=s.boss,width=boss?2200:3400+index*90;
 const platforms=[{x:0,y:470,w:600,h:100}];
 for(let x=690,n=0;x<width;x+=390,n++){
  platforms.push({x,y:470,w:260+((index+n)%3)*15,h:100});
  platforms.push({x:x-40+(index%3)*12,y:355-((n+index)%3)*35,w:115+(index%4)*10,h:22});
  if(n%2===0)platforms.push({x:x+170,y:265,w:110,h:22});
 }
 platforms.push({x:width-500,y:470,w:600,h:100});
 if(boss)platforms.push({x:width-850,y:470,w:850,h:100});
 const pickups=[{x:240,y:420,type:s.power},{x:900,y:300,type:POWERS[(index+1)%5]},{x:width-1000,y:300,type:s.power}];
 const coins=[];
 for(let x=320,n=0;x<width-220;x+=110,n++)coins.push({x,y:n%4===0?270:410,taken:false});
 const enemies=[];
 for(let x=740,n=0;x<width-(boss?850:200);x+=390,n++)enemies.push({x,y:438,w:30,h:32,vx:(n%2?1:-1)*48,min:x-30,max:x+190,frozen:0,alive:true});
 const chief=boss?{x:width-360,y:390,w:72,h:80,hp:index===16?10:6,max:index===16?10:6,cool:0,timer:0,dir:-1}:null;
 return { ...s,width,platforms,pickups,coins,enemies,chief,goal:width-130};
}
export const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function readProgress(storage){try{const n=Number(storage.getItem('jarvis-skybound-v1'));return Number.isInteger(n)&&n>=0&&n<=17?n:0;}catch{return 0}}
