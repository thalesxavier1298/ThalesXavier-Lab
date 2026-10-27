import {PHYSICS as C,STATES} from './config.mjs';
import {resizeFeet,moveBody,approach,solidsFor} from './physics.mjs';
export const special=s=>s!==STATES.SMALL&&s!==STATES.SUPER;
export function createPlayer(x=80,y=360){
 return {x,y,w:C.width,h:C.smallHeight,vx:0,vy:0,state:STATES.SMALL,power:'none',
 face:1,ground:false,coyote:0,buffer:0,cool:0,charges:3,boost:true,inv:0,
 crouch:false,transform:0,damage:0,landing:0,anim:'idle',animTime:0,pending:null,dead:false};
}
function applyState(p,state){p.state=state;p.power=special(state)?state.toLowerCase():'none';p.charges=3;p.boost=true}
export function transformPlayer(p,state,solids,{animate=true}={}){
 if(!Object.values(STATES).includes(state))return false;
 if(state===p.state){p.pending=null;return true}
 const height=state===STATES.SMALL?C.smallHeight:C.largeHeight;
 if(height>p.h&&!resizeFeet(p,height,solids)){p.pending=state;return false}
 if(height<p.h)resizeFeet(p,height,solids);
 applyState(p,state);p.pending=null;p.crouch=false;
 if(animate)p.transform=C.transformDuration;
 return true;
}
export function damagePlayer(p,solids){
 if(p.inv>0||p.dead)return 'ignored';
 p.pending=null;
 if(p.state===STATES.SMALL){p.dead=true;p.anim='death';p.animTime=0;p.vy=-330;return 'dead'}
 transformPlayer(p,special(p.state)?STATES.SUPER:STATES.SMALL,solids,{animate:false});
 p.transform=0;p.inv=C.invincibility;p.damage=C.damageDuration;
 return 'hurt';
}
function animation(p,dt){
 const next=p.dead?'death':p.transform>0?'transform':p.damage>0?'damage':p.crouch?'crouch':!p.ground?(p.vy<0?'jump':'fall'):p.landing>0?'land':Math.abs(p.vx)>C.walkSpeed+12?'run':Math.abs(p.vx)>12?'walk':'idle';
 if(next!==p.anim){p.anim=next;p.animTime=0}else p.animTime+=dt;
}
export function stepPlayer(p,input,dt,level,clouds,onHead=()=>{}){
 const solids=solidsFor(level);
 p.inv=Math.max(0,p.inv-dt);p.cool=Math.max(0,p.cool-dt);
 p.transform=Math.max(0,p.transform-dt);p.damage=Math.max(0,p.damage-dt);p.landing=Math.max(0,p.landing-dt);
 if(p.pending)transformPlayer(p,p.pending,solids);
 const wasGround=p.ground;
 const wantsCrouch=input.down&&p.ground&&p.state!==STATES.SMALL;
 if(wantsCrouch&&!p.crouch){resizeFeet(p,C.crouchHeight,solids);p.crouch=true}
 else if(!wantsCrouch&&p.crouch){if(resizeFeet(p,C.largeHeight,solids))p.crouch=false}
 if(input.jump)p.buffer=C.jumpBuffer;else p.buffer=Math.max(0,p.buffer-dt);
 p.coyote=wasGround?C.coyoteTime:Math.max(0,p.coyote-dt);
 let jumped=false;
 if(p.buffer>0&&p.coyote>0&&!p.crouch){p.vy=-C.jumpSpeed;p.buffer=0;p.coyote=0;p.ground=false;jumped=true}
 const axis=input.axis,top=p.crouch?C.crawlSpeed:input.run?C.runSpeed:C.walkSpeed;
 const accel=axis?(wasGround?C.acceleration:C.airAcceleration):(level.theme==='frost'&&wasGround?C.iceFriction:C.friction);
 p.vx=approach(p.vx,axis*top,accel*dt);
 if(axis)p.face=axis;
 if(!input.held&&p.vy<-C.jumpCut)p.vy=-C.jumpCut;
 p.vy=Math.min(C.maxFall,p.vy+C.gravity*dt);
 if(p.state===STATES.HELICOPTER&&input.held&&p.vy>100)p.vy=100;
 moveBody(p,dt,solids,clouds,onHead);
 p.x=Math.max(0,Math.min(level.width-p.w,p.x));
 if(p.ground){p.charges=3;p.boost=true;if(!wasGround)p.landing=.09}
 // Prevent coyote time from being re-used after a jump.
 if(jumped)p.coyote=0;
 animation(p,dt);
 return {jumped};
}
