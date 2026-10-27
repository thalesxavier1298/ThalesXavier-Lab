import {STATES} from './config.mjs';
export const RUN_KEY='jarvis-adventure-run-v1';
export const INITIAL_LIVES=5,MAX_LIVES=999;
export function freshRun(){return {lives:INITIAL_LIVES,stage:0,state:STATES.SMALL,coins:0,lifeClaims:[]}}
export function readRun(storage){
 try{const r=JSON.parse(storage.getItem(RUN_KEY));if(r&&Number.isInteger(r.lives)&&r.lives>=0&&r.lives<=MAX_LIVES&&Number.isInteger(r.stage)&&r.stage>=0&&r.stage<17)return {lives:r.lives,stage:r.stage,state:Object.values(STATES).includes(r.state)?r.state:STATES.SMALL,coins:Number.isInteger(r.coins)&&r.coins>=0&&r.coins<50?r.coins:0,lifeClaims:Array.isArray(r.lifeClaims)?[...new Set(r.lifeClaims.filter(i=>Number.isInteger(i)&&i>=0&&i<17))]:[]}}catch{}
 return freshRun();
}
export function saveRun(run,storage){try{storage.setItem(RUN_KEY,JSON.stringify(run))}catch{}}
export function gainLife(run,n=1){const before=run.lives;run.lives=Math.min(MAX_LIVES,run.lives+n);return run.lives-before}
export function addCoins(run,n=1){const total=(run.coins||0)+n;run.coins=total%50;return gainLife(run,Math.floor(total/50))}
export function claimLife(run,stage){run.lifeClaims??=[];if(run.lifeClaims.includes(stage))return false;run.lifeClaims.push(stage);gainLife(run);return true}
export function clearLifeClaim(run,stage){run.lifeClaims=(run.lifeClaims||[]).filter(i=>i!==stage)}
export function loseLife(run){run.lives=Math.max(0,run.lives-1);return run.lives>0}
export function resetLives(run){run.lives=INITIAL_LIVES;run.state=STATES.SMALL}
export function tickTimer(remaining,dt){return Math.max(0,remaining-Math.max(0,dt))}
