export const MAP_POINTS=Array.from({length:17},(_,i)=>({x:i>=6&&i<12?895-(i%6)*166:65+(i%6)*166,y:80+Math.floor(i/6)*180}));
export function mapNeighbor(index,key,unlocked){
 const direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[key];if(!direction)return index;
 for(const n of [index-1,index+1]){if(n<0||n>Math.min(unlocked,16))continue;const a=MAP_POINTS[index],b=MAP_POINTS[n];if((b.x-a.x)*direction[0]+(b.y-a.y)*direction[1]>0)return n}return index;
}
export function mapPosition(from,to,t){const a=MAP_POINTS[from],b=MAP_POINTS[to];const k=Math.min(1,Math.max(0,t));return {x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k}}
export const MAP_JARVIS='<ellipse cx="0" cy="8" rx="15" ry="5" fill="#11283988"/><path d="M-10-28h20v8H8v8H-8v-8h-2Z" fill="#67d9b8"/><path d="M-8-20H8v12H-8Z" fill="#ffd6aa"/><path d="M-11-8h22V6H-11Z" fill="#3da89d"/><path d="M-13 4h10v6h-10M3 4h10v6H3" fill="#26354f"/><path d="M2-18h3v3H2" fill="#173950"/><path d="M-10-8h22v4H-10" fill="#f4c56d"/>';

export function landmarkSvg(tower,x,y){
 const stone='#8197ab',edge='#e0d4ac';
 if(tower)return `<g aria-hidden="true" transform="translate(${x-28} ${y-110})"><path d="M6 76V17H0V3H10V10H20V3H30V10H40V3H56V17H50V76Z" fill="${stone}" stroke="${edge}" stroke-width="2"/><path d="M9 24H47M9 42H47M9 59H47" stroke="#526980" stroke-width="2"/><path d="M20 76V60Q28 46 36 60V76" fill="#162d42"/><path d="M14 27H20V37H14M36 27H42V37H36" fill="#ffdd88"/><path d="M28 3V-9H44L28-2" fill="#dc7c6a"/><path d="M7 76H49" stroke="${edge}" stroke-width="4"/></g>`;
 return `<g aria-hidden="true" transform="translate(${x+54} ${y-47})"><path d="M0 80V31H8V15H0V5H10V11H20V5H30V15H23V43H40V23H76V43H94V15H87V5H97V11H107V5H117V15H109V31H117V80Z" fill="${stone}" stroke="${edge}" stroke-width="2"/><path d="M38 25L58 2L79 25Z" fill="#9d6676" stroke="${edge}" stroke-width="2"/><path d="M58 3V-9H76L58-2" fill="#efb56a"/><path d="M44 80V61Q58 39 72 61V80" fill="#17283d"/><path d="M12 34H18V46H12M98 34H104V46H98M54 27H62V39H54" fill="#ffe5a0"/><path d="M3 57H35M82 57H114M3 70H35M82 70H114" stroke="#526980" stroke-width="3"/><path d="M-3 80H120" stroke="${edge}" stroke-width="4"/></g>`;
}
