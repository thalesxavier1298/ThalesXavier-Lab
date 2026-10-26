import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { STAGES, makeLevel, overlap, readProgress } from '../public/jarvis/levels.mjs';
const nodes=new Map();
const node=id=>nodes.get(id)||nodes.set(id,{hidden:false,textContent:'',innerHTML:'',focus(){},setAttribute(){},classList:{add(){},remove(){}}}).get(id);
node('game').getContext=()=>new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]||(()=>{})});
const storage=new Map();
const context=vm.createContext({console,Math,Number,Set,Map,STAGES,makeLevel,overlap,readProgress,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},document:{getElementById:node,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},requestAnimationFrame(){},confirm:()=>true});
const code=fs.readFileSync(new URL('../public/jarvis/game.mjs',import.meta.url),'utf8').replace(/^import[^\n]+\n/,'');
vm.runInContext(code,context);
function run(code){return vm.runInContext(code,context)}
assert.equal(STAGES.length,17);
assert.equal(STAGES.filter(s=>s.boss).length,2);
assert.equal(readProgress({getItem:()=>'-1'}),0);
assert.equal(readProgress({getItem:()=> '17'}),17);
assert.equal(readProgress({getItem(){throw Error()}}),0);
for(let i=0;i<17;i++){const l=makeLevel(i);assert(l.platforms.some(b=>b.x<=l.goal&&b.x+b.w>l.goal&&b.y===470));assert.equal(l.chief!==null,l.boss)}
run('start(0); for(let i=0;i<90;i++) update(1/60)');
assert.equal(run('p.y'),430,'Jarvis lands on floor');
run("keys.add('ArrowRight');for(let i=0;i<30;i++)update(1/60);keys.clear()");
assert(run('p.x')>150,'movement');
run("pressed.add('Space');update(1/60)");
assert(run('p.vy')<0,'jump');
for(const power of ['fire','ice','hammer']){run("p.power='"+power+"';p.cool=0;power()");assert.equal(run('shots.at(-1).type'),power)}
run("p.power='cloud';p.cool=0;p.charges=3;power()");
assert.equal(run('clouds.length'),1);
run("p.power='helicopter';p.cool=0;p.boost=true;power()");
assert.equal(run('p.vy'),-720);
run('p.inv=0;hit()');assert.equal(run('p.hp'),2);run('hit()');assert.equal(run('p.hp'),2,'invulnerability');
run("start(8);p.x=level.goal;update(1/60)");
assert.equal(run('mode'),'play','boss blocks finish');
run("level.chief.hp=0;update(1/60)");
assert.equal(run('mode'),'won');assert.equal(storage.get('jarvis-skybound-v1'),'9');
run("start(16);level.chief.hp=0;p.x=level.goal;update(1/60)");
assert.equal(storage.get('jarvis-skybound-v1'),'17');
run('start(0);pause()');assert.equal(run('mode'),'paused');run('pause()');assert.equal(run('mode'),'play');
run('p.y=700;update(1/60)');assert.equal(run('mode'),'dead');
console.log('Passed: stage counts, geometry, persistence, movement, jumping, five powers, damage, invulnerability, boss gates, victory, pause, and death.');
