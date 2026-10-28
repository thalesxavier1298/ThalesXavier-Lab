export const MAP_POINTS=[{x:80,y:130},{x:240,y:105},{x:405,y:170},{x:565,y:130},{x:725,y:105},{x:875,y:190},{x:870,y:350},{x:715,y:310},{x:555,y:375},{x:390,y:335},{x:235,y:365},{x:85,y:420},{x:90,y:595},{x:255,y:565},{x:420,y:625},{x:590,y:580},{x:755,y:645}];
function control(i){const a=MAP_POINTS[i],b=MAP_POINTS[i+1],dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy),bend=i%2?24:-24;return {x:(a.x+b.x)/2-dy/len*bend,y:(a.y+b.y)/2+dx/len*bend}}
export function mapNeighbor(index,key,unlocked,available=null){
 const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[key];if(!d)return index;
 let best=index,score=.55;for(const n of [index-1,index+1]){if(n<0||n>16||(available?!available(n):n>Math.min(unlocked,16)))continue;const a=MAP_POINTS[index],b=MAP_POINTS[n],dx=b.x-a.x,dy=b.y-a.y,s=(dx*d[0]+dy*d[1])/Math.hypot(dx,dy);if(s>score){best=n;score=s}}return best;
}
export function mapPosition(from,to,t){const a=MAP_POINTS[from],b=MAP_POINTS[to],k=Math.min(1,Math.max(0,t));if(Math.abs(to-from)!==1){const c={x:(a.x+b.x)/2,y:Math.min(a.y,b.y)-70};return {x:(1-k)**2*a.x+2*(1-k)*k*c.x+k*k*b.x,y:(1-k)**2*a.y+2*(1-k)*k*c.y+k*k*b.y}};const c=control(Math.min(from,to));return {x:(1-k)**2*a.x+2*(1-k)*k*c.x+k*k*b.x,y:(1-k)**2*a.y+2*(1-k)*k*c.y+k*k*b.y}}
export function mapRoute(){return 'M '+MAP_POINTS[0].x+' '+MAP_POINTS[0].y+MAP_POINTS.slice(1).map((b,i)=>{const c=control(i);return ' Q '+c.x+' '+c.y+' '+b.x+' '+b.y}).join('')}
export function mapLandscape(){
 const tree=(x,y)=>`<g transform="translate(${x} ${y})"><path d="M-3 3H3V20H-3" fill="#87653f"/><path d="M0-28L-19-7H-10L-23 7H23L10-7H19Z" fill="#235e49"/><path d="M0-25L-12-8H-5L-15 3H0Z" fill="#448b59"/></g>`;
 const peak=(x,y,w,h,snow=false)=>`<g><path d="M${x-w/2} ${y}L${x} ${y-h}L${x+w/2} ${y}Z" fill="${snow?'#607f89':'#597d68'}"/><path d="M${x} ${y-h}L${x+w/2} ${y}H${x+10}Z" fill="${snow?'#416473':'#365d53'}"/>${snow?`<path d="M${x-w*.18} ${y-h*.65}L${x} ${y-h}L${x+w*.18} ${y-h*.65}L${x+5} ${y-h*.73}L${x-7} ${y-h*.63}Z" fill="#dce9df"/>`:''}</g>`;
 return `<g aria-hidden="true"><rect width="960" height="760" rx="25" fill="#163d48"/><path d="M35 85Q90 30 245 40L700 30Q914 44 932 180L925 650Q880 733 700 737L120 728Q22 703 25 590Z" fill="#8da976" stroke="#416c5c" stroke-width="12"/>
 <path d="M40 100Q200 0 365 70T700 50Q890 40 915 170L900 235Q710 200 580 225T290 235Q120 210 40 265Z" fill="#b0bd83"/>
 <path d="M40 285Q250 200 440 278T910 250L905 450Q700 400 555 470T45 485Z" fill="#789b7b"/>
 <path d="M38 520Q190 465 350 520T645 515Q820 470 922 545L900 660Q820 725 690 718H120Q40 695 38 620Z" fill="#6b8e6b"/>
 <path d="M340 55Q300 145 390 205T455 300Q480 355 380 420T310 520Q320 600 215 710" fill="none" stroke="#406e76" stroke-width="45"/><path d="M340 55Q300 145 390 205T455 300Q480 355 380 420T310 520Q320 600 215 710" fill="none" stroke="#78b8ba" stroke-width="29"/><path d="M340 55Q300 145 390 205T455 300Q480 355 380 420T310 520Q320 600 215 710" fill="none" stroke="#aad4cb" stroke-width="3" stroke-dasharray="13 15"/>
 ${peak(650,105,115,85)}${peak(785,114,100,95)}${peak(900,115,100,80)}${peak(860,295,155,85,true)}${peak(747,270,135,85,true)}${peak(200,570,120,90)}${peak(340,555,125,100)}${peak(490,580,150,110)}
 <g transform="translate(873 151)"><path d="M-42 25L-40-8L-15-30H15L40-8L42 25Z" fill="#5f6c64" stroke="#bbc29a" stroke-width="3"/><path d="M-22 25V0Q0-30 22 0V25Z" fill="#1d3540"/><path d="M-12-17L-8-10M13-14L18-7" stroke="#8cd7d3" stroke-width="4"/></g>
 <g transform="translate(230 308)"><path d="M-38 24H38L29-13H8L-3-34L-16-13H-31Z" fill="#665c59"/><path d="M-17 19L-9-1H6L14 19Z" fill="#ef9d5f"/><path d="M-5-28L1-38L8-30L6-17" fill="#e1ba85"/><path d="M-25 7H-17M21 0H29" stroke="#f0bb7d" stroke-width="4"/></g>
 <g transform="translate(405 170)"><path d="M-40 7H40M-40 22H40" stroke="#604c3e" stroke-width="7"/><path d="M-32 5V25M-16 5V25M0 5V25M16 5V25M32 5V25" stroke="#c9b17a" stroke-width="9"/></g>
 ${[[115,72],[170,160],[300,80],[490,65],[620,195],[800,220],[925,390],[665,420],[610,470],[315,280],[130,300],[55,500],[140,680],[390,710],[500,675],[680,700],[865,690]].map(([x,y])=>tree(x,y)).join('')}
 <g fill="#cdd49a">${[[160,215],[270,215],[670,245],[490,430],[780,465],[160,475],[700,540],[360,680]].map(([x,y])=>`<path d="M${x} ${y}h12v4h-12M${x+5} ${y-5}v12h3v-12Z"/>`).join('')}</g>
 <text x="70" y="55" font-family="monospace" font-size="13" letter-spacing="3" fill="#365a49">GREEN VALLEY</text><text x="650" y="725" font-family="monospace" font-size="10" letter-spacing="2" fill="#d5dfb2">THE STORM KING'S KEEP</text></g>`;
}
export const MAP_JARVIS='<ellipse cx="0" cy="8" rx="15" ry="5" fill="#11283988"/><path d="M-10-28h20v8H8v8H-8v-8h-2Z" fill="#67d9b8"/><path d="M-8-20H8v12H-8Z" fill="#ffd6aa"/><path d="M-11-8h22V6H-11Z" fill="#3da89d"/><path d="M-13 4h10v6h-10M3 4h10v6H3" fill="#26354f"/><path d="M2-18h3v3H2" fill="#173950"/><path d="M-10-8h22v4H-10" fill="#f4c56d"/>';

export function landmarkSvg(tower,x,y){
 const stone='#8197ab',edge='#e0d4ac';
 if(tower)return `<g aria-hidden="true" transform="translate(${x-28} ${y-110})"><path d="M6 76V17H0V3H10V10H20V3H30V10H40V3H56V17H50V76Z" fill="${stone}" stroke="${edge}" stroke-width="2"/><path d="M9 24H47M9 42H47M9 59H47" stroke="#526980" stroke-width="2"/><path d="M20 76V60Q28 46 36 60V76" fill="#162d42"/><path d="M14 27H20V37H14M36 27H42V37H36" fill="#ffdd88"/><path d="M28 3V-9H44L28-2" fill="#dc7c6a"/><path d="M7 76H49" stroke="${edge}" stroke-width="4"/></g>`;
 return `<g aria-hidden="true" transform="translate(${x+54} ${y-47})"><path d="M0 80V31H8V15H0V5H10V11H20V5H30V15H23V43H40V23H76V43H94V15H87V5H97V11H107V5H117V15H109V31H117V80Z" fill="${stone}" stroke="${edge}" stroke-width="2"/><path d="M38 25L58 2L79 25Z" fill="#9d6676" stroke="${edge}" stroke-width="2"/><path d="M58 3V-9H76L58-2" fill="#efb56a"/><path d="M44 80V61Q58 39 72 61V80" fill="#17283d"/><path d="M12 34H18V46H12M98 34H104V46H98M54 27H62V39H54" fill="#ffe5a0"/><path d="M3 57H35M82 57H114M3 70H35M82 70H114" stroke="#526980" stroke-width="3"/><path d="M-3 80H120" stroke="${edge}" stroke-width="4"/></g>`;
}
