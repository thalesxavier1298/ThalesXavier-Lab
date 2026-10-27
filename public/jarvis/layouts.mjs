// Individually authored layouts in the original 960x540 world coordinate system.
// Each route teaches one idea, then develops it; every power route is optional.
const p=(x,y,w,h=22)=>({x,y,w,h});
const g=(x,w)=>p(x,470,w,100);
const rail=(x,y,w,toX,toY,speed=65)=>({x,y,w,h:20,toX,toY,speed});
const crumble=(x,y,w,delay=.65)=>({x,y,w,h:20,delay,returnAfter:3});
const spikes=(x,y,w=40)=>({kind:'spikes',x,y,w,h:14});
const flame=(x,y,offset=0)=>({kind:'flame',x,y,w:36,h:52,period:6,warning:.9,active:1.15,offset});
const enemy=(x,top,min,max,vx=42)=>({x,y:top-32,w:30,h:32,min,max,vx,frozen:0,alive:true});
const cp=(x,top)=>({x,y:top-28,top});
const station=(x,top,power)=>({x:x-16,y:top-104,w:32,h:32,kind:'item',power,used:false,broken:false,bump:0});
export const DESIGNS=[
 {id:'meadow',identity:'First steps',mechanic:'Fundamentals',width:2500,
 intro:'Short hops over a forgiving first gap.',development:'Try the upper coin trail and a single patrol.',final:'Two wider gaps separated by a rest island.',optional:'Fire makes the patrol optional.',power:'fire',checkpoint:cp(1150,470),
 platforms:[g(0,520),g(600,360),g(1040,500),g(1640,320),g(2040,460),p(300,360,100),p(780,350,140),p(1270,320,150)],
 enemies:[enemy(810,470,770,880),enemy(2230,470,2190,2330)],
 signs:[[270,470,'WALK, THEN JUMP'],[650,470,'UPPER COINS ARE OPTIONAL'],[1645,470,'HOLD JUMP FOR HEIGHT']]},
 {id:'treetops',identity:'Above the canopy',mechanic:'Vertical routes',width:2400,
 intro:'Climb one ledge at a time.',development:'A high canopy path with a landing at every height.',final:'Descend through branches to the exit.',optional:'Helicopter helps reach extra canopy coins.',power:'helicopter',checkpoint:cp(1040,230),
 platforms:[g(0,400),p(480,390,180),p(720,310,170),p(960,230,200),p(1220,300,180),p(1460,370,180),g(1700,700),p(1850,370,140),p(2050,280,150)],
 enemies:[enemy(1510,370,1490,1580,-38),enemy(2180,470,2130,2290)],
 signs:[[180,470,'CLIMB THE BRANCHES'],[980,230,'A REST ABOVE THE TREES'],[1730,470,'THE HIGH PATH HOLDS COINS']]},
 {id:'aqueduct',identity:'Ride the aqueduct',mechanic:'Moving platforms',width:2700,
 intro:'Board the first slow ferry from a broad dock.',development:'Wait and ride across the first channel.',final:'A diagonal ferry changes the landing height.',optional:'Ice offers another way past the dock patrol.',power:'ice',checkpoint:cp(1120,470),
 platforms:[g(0,520),g(1020,480),g(1980,720),p(1260,370,160),p(2260,360,180)],
 moving:[rail(540,440,150,850,440,68),rail(1520,430,160,1800,350,60)],
 enemies:[enemy(2410,470,2350,2500)],
 signs:[[290,470,'WAIT FOR THE BLUE FERRY'],[1100,470,'DIAGONAL FERRY AHEAD'],[2040,470,'STEP OFF ONTO THE DOCK']]},
 {id:'bramble',identity:'Bramble footwork',mechanic:'Precision and rest spots',width:2600,
 intro:'One clearly marked bramble patch.',development:'Spaced patches with generous places to stop.',final:'Combine a gap with a final bramble hop.',optional:'Cloud platforms offer an upper bypass.',power:'cloud',checkpoint:cp(1110,470),
 platforms:[g(0,600),g(680,580),g(1340,560),g(1980,620),p(750,350,170),p(1530,340,180),p(2150,350,170)],
 hazards:[spikes(430,456),spikes(900,456,54),spikes(1460,456,48),spikes(1650,456,46),spikes(2260,456,58)],
 enemies:[enemy(2410,470,2370,2500)],
 signs:[[220,470,'BRAMBLES HURT: HOP OVER'],[1060,470,'REST BEFORE THE NEXT PATCH'],[1990,470,'PRECISION, NOT SPEED']]},
 {id:'cloudsteps',identity:'Clouds above the cliffs',mechanic:'Cloud power and optional height',width:2500,
 intro:'Find cloud power in the item boxes.',development:'Build temporary steps to a high coin trail.',final:'Choose ground hops or the upper cloud route.',optional:'The upper terraces reward cloud placement; the ground route needs no power.',power:'cloud',checkpoint:cp(1510,470),
 platforms:[g(0,480),g(560,360),g(1000,360),g(1440,440),g(1960,540),p(650,260,180),p(1100,180,160),p(1550,260,180),p(2060,300,170)],
 stations:[[340,470],[1560,470],[2100,470]],
 enemies:[enemy(1190,470,1130,1260)],
 signs:[[160,470,'ONE ITEM PER ? BLOCK'],[580,470,'X CREATES A CLOUD STEP'],[1460,470,'LOW ROUTE NEEDS NO POWER']]},
 {id:'cavern',identity:'Crystal passageways',mechanic:'Low passages and alternate routes',width:2500,
 intro:'A low tunnel with an overhead alternative.',development:'Crawl as Super; Small can walk through.',final:'A second tunnel and a normal final gap.',optional:'Hammer provides a different attack angle from the high route.',power:'hammer',checkpoint:cp(1740,470),
 platforms:[g(0,900),g(980,620),g(1680,820),p(380,300,380,138),p(250,390,100),p(1100,300,360,138),p(970,390,100),p(1910,370,170)],
 enemies:[enemy(2210,470,2160,2310)],
 signs:[[120,470,'DOWN + MOVE TO CRAWL'],[380,300,'OR TAKE THE HIGH ROUTE'],[990,470,'GROWTH WAITS FOR HEADROOM']]},
 {id:'frost',identity:'Learn to brake',mechanic:'Ice momentum',width:2800,
 intro:'A long safe runway to learn the low friction.',development:'Brake before a wide gap, then cross.',final:'A bramble patch followed by another braking zone.',optional:'Fire handles the far-side patrol.',power:'fire',checkpoint:cp(1630,470),
 platforms:[g(0,650),g(760,500),g(1390,590),g(2100,700),p(800,300,140),p(1490,360,140),p(2280,340,180)],
 hazards:[spikes(1060,456,44),spikes(2440,456,54)],
 enemies:[enemy(2650,470,2610,2720,55)],
 signs:[[220,470,'ICE: RELEASE EARLY TO BRAKE'],[530,470,'BRAKE BEFORE THE EDGE'],[1430,470,'A LONG RUNWAY TO RECOVER']]},
 {id:'windmills',identity:'Do not linger',mechanic:'Temporary platforms',width:2800,
 intro:'The first amber platform shakes before it drops.',development:'Three broad ledges teach continuous movement.',final:'A longer chain after a safe checkpoint dock.',optional:'Helicopter lets you recover from a late departure.',power:'helicopter',checkpoint:cp(1270,470),
 platforms:[g(0,450),g(1120,420),g(2250,550)],
 falling:[crumble(520,430,150,.85),crumble(730,390,150,.75),crumble(940,430,150,.75),crumble(1610,430,170),crumble(1830,390,170),crumble(2050,430,150)],
 enemies:[enemy(2510,470,2460,2630)],
 signs:[[220,470,'AMBER LEDGES SHAKE, THEN FALL'],[1150,470,'KEEP MOVING: LEDGES RETURN']]},
 {id:'gardens',identity:'The hidden terraces',mechanic:'Exploration and branches',width:2900,
 intro:'A low road and a staircase into the gardens.',development:'Choose height, coins or the shorter ground path.',final:'The routes reunite before the exit garden.',optional:'Cloud reveals the highest terrace.',power:'cloud',checkpoint:cp(1480,470),
 platforms:[g(0,800),g(920,880),g(1900,1000),p(240,390,150),p(460,310,220),p(740,230,220),p(1030,260,220),p(1320,330,220),p(1680,250,220),p(2010,320,220),p(2320,380,200)],
 enemies:[enemy(535,310,490,610,-34),enemy(1150,470,1080,1230),enemy(2420,470,2360,2540)],
 signs:[[150,470,'CHOOSE YOUR GARDEN PATH'],[950,470,'HIGH TERRACES HIDE COINS'],[1940,470,'ALL PATHS LEAD TO THE BEACON']]},
 {id:'emberworks',identity:'Read the furnace',mechanic:'Telegraphed periodic hazards',width:2900,
 intro:'Watch a vent through one complete cycle.',development:'Wait for the warning light to fade.',final:'Two staggered vents with a safe space between.',optional:'Ice helps clear patrols beyond the machines.',power:'ice',checkpoint:cp(1800,470),
 platforms:[g(0,760),g(840,770),g(1690,1210),p(960,350,170),p(2150,340,190)],
 hazards:[flame(560,418),flame(1150,418,.8),flame(1410,418,2),flame(2120,418,1.2),flame(2490,418,3)],
 enemies:[enemy(2710,470,2660,2810)],
 signs:[[280,470,'VENT: DARK = SAFE, GOLD = WARNING'],[880,470,'RED = ACTIVE. WAIT HERE.'],[1730,470,'READ THE NEXT CYCLE']]},
 {id:'hammerridge',identity:'Attack from an angle',mechanic:'Height and hammer arcs',width:2900,
 intro:'Find hammer power on the approach.',development:'Face patrols on ledges at different heights.',final:'Choose a low path or throw from the high ledge.',optional:'Hammer clears upper patrols, but every enemy can be jumped or avoided.',power:'hammer',checkpoint:cp(1640,470),
 platforms:[g(0,440),p(520,390,240),p(840,310,240),p(1160,390,300),g(1540,1360),p(1770,390,110),p(1930,320,240),p(2270,390,170)],
 stations:[[280,470],[1670,470]],
 enemies:[enemy(935,310,890,1000,-50),enemy(1280,390,1230,1360),enemy(2020,320,1980,2090),enemy(2650,470,2600,2740)],
 signs:[[140,470,'X THROWS AN ARCING HAMMER'],[550,390,'USE HEIGHT OR JUMP PAST'],[1570,470,'THE LOW ROAD IS ALWAYS OPEN']]},
 {id:'marsh',identity:'Move, observe, cross',mechanic:'Timing windows',width:3100,
 intro:'A gap, then a vent with a clear waiting bank.',development:'Alternate movement and observation.',final:'A pair of offset vents that never require rushing blindly.',optional:'Helicopter offers a high detour across the marsh.',power:'helicopter',checkpoint:cp(2070,470),
 platforms:[g(0,580),g(690,500),g(1320,520),g(1970,1130),p(820,340,160),p(1440,330,180),p(2680,340,180)],
 moving:[rail(1850,410,100,1940,330,46)],
 hazards:[flame(930,418),flame(1560,418,1),flame(2340,418,1.5),flame(2640,418,3)],
 enemies:[enemy(2880,470,2810,3000)],
 signs:[[220,470,'MOVE, OBSERVE, THEN CROSS'],[1340,470,'WAIT ON THE WIDE BANK'],[2010,470,'WATCH EACH VENT SEPARATELY']]},
 {id:'skyrail',identity:'The long skyrail',mechanic:'Advanced moving routes',width:3200,
 intro:'Ride a long diagonal lift from the starting dock.',development:'A rest station separates the two crossings.',final:'Transfer between a lift, a fixed island and a second lift.',optional:'Helicopter makes the transfers more forgiving.',power:'helicopter',checkpoint:cp(1290,470),
 platforms:[g(0,480),g(1150,400),p(1960,340,200),g(2480,720)],
 moving:[rail(500,440,180,960,340,70),rail(1580,440,170,1770,340,65),rail(2180,340,180,2320,440,60)],
 enemies:[enemy(2790,470,2720,2910)],
 signs:[[230,470,'RIDE UP. WAIT FOR THE FAR DOCK.'],[1180,470,'REST BEFORE THE NEXT TRANSFER'],[1970,340,'FIXED ISLAND: WAIT HERE']]},
 {id:'thunder',identity:'Lessons in combination',mechanic:'Ferries, temporary ledges and vents',width:3300,
 intro:'A familiar ferry starts the route.',development:'A vent, then a temporary-platform chain.',final:'Rest at the checkpoint before the final timing section.',optional:'Fire handles the final patrol without a close approach.',power:'fire',checkpoint:cp(2110,470),
 platforms:[g(0,500),g(980,440),g(2040,460),g(2580,720)],
 moving:[rail(520,430,160,800,390,65)],
 falling:[crumble(1480,430,150,.75),crumble(1700,390,150,.7),crumble(1910,430,100,.8)],
 hazards:[flame(1190,418),flame(2350,418,1),flame(2900,418,2.5)],
 enemies:[enemy(3140,470,3080,3220)],
 signs:[[250,470,'FAMILIAR TOOLS, NEW COMBINATIONS'],[1000,470,'VENT, THEN THE AMBER CHAIN'],[2070,470,'REST BEFORE THE LAST CROSSING']]},
 {id:'lastlight',identity:'The last light ascent',mechanic:'Climbing and synthesis',width:3000,
 intro:'A staircase revisits canopy jumps.',development:'Descend to a mid-height checkpoint and time the furnace.',final:'A temporary ledge leads to the castle road.',optional:'Cloud adds a high coin detour near the summit.',power:'cloud',checkpoint:cp(1460,310),
 platforms:[g(0,400),p(480,390,200),p(760,310,200),p(1040,230,240),p(1380,310,220),p(1740,390,260),g(2180,820),p(2470,350,170)],
 falling:[crumble(2050,430,110,.8)],
 hazards:[flame(1840,338),spikes(2660,456,50)],
 enemies:[enemy(2860,470,2800,2930)],
 signs:[[160,470,'THE FINAL CLIMB'],[1400,310,'REST, THEN READ THE FURNACE'],[2210,470,'THE CASTLE ROAD AWAITS']]}
];
export function authorLevel(design){
 const d=structuredClone(design);
 const platforms=d.platforms;
 const checkpoints=[{id:'start',x:80,y:442,top:470},{id:'mid',...d.checkpoint},...(d.extraCheckpoints||[]).map((c,i)=>({id:'rest-'+i,...c}))];
 const blocks=[station(144,470,d.power),station(216,470,d.power),station(d.checkpoint.x+45,d.checkpoint.top,d.power),
 {x:260,y:348,w:32,h:32,kind:'brick',broken:false,bump:0}];
 const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
 const addBox=(x,top)=>{const b=station(x,top,d.power);if(!platforms.some(t=>overlaps(b,t))&&!blocks.some(t=>overlaps(b,t)))blocks.push(b)};
 addBox(d.checkpoint.x+98,d.checkpoint.top);
 for(const c of d.extraCheckpoints||[]){addBox(c.x+45,c.top);addBox(c.x+98,c.top)}
 addBox(d.width-200,470);
 for(const [x,top] of d.stations||[])addBox(x,top);
 for(const b of blocks)if(b.kind==='item')b.content=checkpoints.some(c=>Math.abs(b.x-(c.id==='start'?128:c.x+29))<2)?'power':'coin';
 for(const c of checkpoints){const x=c.x+330,top=c.top;const support=platforms.find(t=>t.y===top&&x-20>=t.x&&x+20<t.x+t.w);if(support){addBox(x,top);const box=blocks.find(b=>Math.abs(b.x-(x-16))<1&&b.y===top-104);if(box)box.content='power'}}
 if(d.id==='tower'||d.id==='castle'){const x=d.width-660;addBox(x,470);addBox(x+72,470);for(const b of blocks)if(b.x>=x-16&&b.x<=x+72)b.content='power'}
 for(const floor of platforms){
  if(floor.w<650)continue;
  for(let x=floor.x+240;x<floor.x+floor.w-220;x+=180){
   const b=station(x,floor.y,d.power);b.content='coin';
   if(!platforms.some(t=>overlaps(b,t))&&!blocks.some(t=>overlaps({...b,x:b.x-16,w:b.w+32},t))&&!(d.hazards||[]).some(h=>Math.abs(h.x-x)<85))blocks.push(b);
  }
 }
 // Marked ledges carry deliberate coin trails, not a uniform line across the world.
 const coins=[];
 for(const b of platforms.filter(b=>b.h<40))for(let x=b.x+30;x<b.x+b.w-15;x+=38)coins.push({x,y:b.y-30,taken:false});
 for(const x of [320,d.checkpoint.x+110,d.width-160])coins.push({x,y:410,taken:false});
 const moving=(d.moving||[]).map((b,i)=>({...b,id:'rail-'+i,originX:b.x,originY:b.y,progress:0,direction:1,dx:0,dy:0,kind:'moving'}));
 const falling=(d.falling||[]).map((b,i)=>({...b,id:'fall-'+i,originX:b.x,originY:b.y,state:'ready',timer:0,vy:0,kind:'falling'}));
 const hazards=(d.hazards||[]).map(b=>({...b,state:b.kind==='spikes'?'active':'off'}));
 return {...d,platforms,blocks,coins,moving,falling,hazards,enemies:d.enemies||[],signs:d.signs.map(([x,y,label])=>({x,y,label})),
 checkpoints,
 pickups:blocks.filter(b=>b.kind==='item').map(b=>({x:b.x+16,y:b.y,type:b.power})),chief:null,goal:d.width-120,goalY:470,time:0};
}

