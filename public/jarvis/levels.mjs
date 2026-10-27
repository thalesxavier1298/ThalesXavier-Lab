import {DESIGNS,authorLevel} from './layouts.mjs';
import {expandDesign,bossDesign} from './campaign.mjs';
export const POWERS = ['cloud','fire','ice','hammer','helicopter'];
const names=['Dewdrop Meadow','Treetop Trail','Amber Aqueduct','Bramble Crossing','Cloudstep Cliffs','Crystal Cavern','Frostfall Run','Windmill Heights','Sentinel Tower','Sunken Gardens','Emberworks','Hammer Ridge','Moonlit Marsh','Skyrail Summit','Thunder Pass','Last Light Ascent','Storm King Castle'];
export const STAGES=names.map((name,i)=>({name,index:i,boss:i===8||i===16,theme:i<5?'meadow':i<9?'frost':i<13?'ember':'storm',power:POWERS[(i>=9?i-1:i)%5]}));
export function makeLevel(index){
 if(!STAGES[index])throw new RangeError('Unknown stage');
 const s=STAGES[index];
 if(!s.boss){const regular=index>8?index-1:index;return {...s,...authorLevel(expandDesign(DESIGNS[regular],regular))}}
 const final=index===16,level=authorLevel(bossDesign(final));
 return {...s,...level,chief:{x:level.width-360,y:390,w:72,h:80,hp:final?10:6,max:final?10:6,cool:0,timer:0,dir:-1},goal:level.width-130};
}
export const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function readProgress(storage){try{const n=Number(storage.getItem('jarvis-skybound-v1'));return Number.isInteger(n)&&n>=0&&n<=17?n:0;}catch{return 0}}
