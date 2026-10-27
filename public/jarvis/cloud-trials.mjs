// Authored obligatory cloud crossings, with a safe supply dock at each attempt.
export function addCloudTrials(level){
 if(level.power!=='cloud')return level;
 const count=level.index<4?1:level.index<10?2:3;
 let x=level.width;const trials=[];
 const box=(x,top)=>({x:x-16,y:top-104,w:32,h:32,kind:'item',power:'cloud',content:'power',used:false,broken:false,bump:0});
 for(let n=0;n<count;n++){
  const top=470-(n%2)*60,dock={x,y:top,w:820,h:100};
  // Connect an elevated dock with a broad step, rather than strand the preceding exit.
  if(n===0&&top!==470)level.platforms.push({x:x-80,y:470,w:120,h:100});
  level.platforms.push(dock);
  const cp={id:'cloud-'+n,x:x+60,y:top-28,top};level.checkpoints.push(cp);
  level.blocks.push(box(x+140,top),box(x+420,top));
  level.signs.push({x:x+80,y:top,label:'CLOUD TRIAL: TWO SUPPLY STOPS'}, {x:x+510,y:top,label:'CLOUD ONLY: JUMP, X, LAND, JUMP AGAIN'});
  const gap=level.index<4?560:level.index<10?600:640;
  const landingTop=top-(level.index===15?50:0),end=x+820+gap;
  trials.push({checkpoint:level.checkpoints.length-1,start:x,edge:x+820,end,top,landingTop,gap});
  level.platforms.push({x:end,y:landingTop,w:480,h:100});
  level.signs.push({x:end+80,y:landingTop,label:'SAFE DOCK: PREPARE THE NEXT CROSSING'});
  x=end+480;
 }
 // Final goal stays on a generous landing, at the actual platform height.
 level.width=x;level.goal=x-140;level.goalY=trials.at(-1).landingTop;
 level.timeLimit+=count*100;level.cloudTrials=trials;
 level.mechanic='Required cloud crossings and aerial steps';
 return level;
}
