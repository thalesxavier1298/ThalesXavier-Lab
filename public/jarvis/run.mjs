import {STATES} from './config.mjs';
export const RUN_KEY='jarvis-adventure-run-v1';
export const INITIAL_LIVES=5;
export function freshRun(){return {lives:INITIAL_LIVES,stage:0,state:STATES.SMALL}}
export function readRun(storage){
 try{const r=JSON.parse(storage.getItem(RUN_KEY));if(r&&Number.isInteger(r.lives)&&r.lives>=0&&r.lives<=INITIAL_LIVES&&Number.isInteger(r.stage)&&r.stage>=0&&r.stage<17)return {lives:r.lives,stage:r.stage,state:Object.values(STATES).includes(r.state)?r.state:STATES.SMALL}}catch{}
 return freshRun();
}
export function saveRun(run,storage){try{storage.setItem(RUN_KEY,JSON.stringify(run))}catch{}}
export function loseLife(run){run.lives=Math.max(0,run.lives-1);return run.lives>0}
export function resetLives(run){run.lives=INITIAL_LIVES;run.state=STATES.SMALL}
export function tickTimer(remaining,dt){return Math.max(0,remaining-Math.max(0,dt))}
