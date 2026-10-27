// Explicit additional sections, relative to the old end of each regular stage.
// Difficulty grows by taught combinations, not tighter jump physics.
const p=(x,y,w,h=22)=>({x,y,w,h}),g=(x,w)=>p(x,470,w,100);
const rail=(x,y,w,toX,toY,speed=68)=>({x,y,w,h:20,toX,toY,speed});
const fall=(x,y,w,delay=.75)=>({x,y,w,h:20,delay,returnAfter:3});
const thorn=(x,w=42)=>({kind:'spikes',x,y:456,w,h:14});
const vent=(x,offset=0,y=418)=>({kind:'flame',x,y,w:36,h:52,period:6,warning:1,active:1.15,offset});
const patrol=(x,top,min,max,vx=44)=>({x,y:top-32,w:30,h:32,min,max,vx,frozen:0,alive:true});
export const EXTENSIONS=[
 {width:800,limit:300,platforms:[g(0,360),g(420,380)],signs:[[80,470,'ONE LAST EASY HOP'],[460,470,'YOU HAVE PLENTY OF TIME']]},
 {width:1200,limit:300,platforms:[g(0,400),p(480,390,180),p(720,310,180),p(920,390,100),g(1000,200)],signs:[[80,470,'CLIMB, THEN DESCEND']]},
 {width:1200,limit:320,platforms:[g(0,400),g(1000,200)],moving:[rail(420,440,160,790,400,68)],signs:[[80,470,'WAIT FOR YOUR FINAL FERRY']]},
 {width:1600,limit:320,platforms:[g(0,440),g(540,460),g(1120,480)],hazards:[thorn(660),thorn(850),thorn(1370,46)],signs:[[80,470,'PRECISION WITH ROOM TO REST']]},
 {width:2000,limit:340,platforms:[g(0,440),g(520,440),g(1040,440),g(1560,440),p(740,260,200),p(1260,180,180),p(1700,280,140)],enemies:[patrol(720,470,650,850)],signs:[[80,470,'CLOUD DETOURS ARE OPTIONAL']]},
 {width:2300,limit:340,platforms:[g(0,1000),g(1080,560),g(1720,580),p(480,300,350,138),p(350,390,90),p(1200,300,280,138),p(1070,390,90),p(1900,370,160)],signs:[[80,470,'MORE CRYSTAL PASSAGEWAYS'],[350,470,'CRAWL OR CLIMB OVER']]},
 {width:2300,limit:360,platforms:[g(0,700),g(820,550),g(1500,800)],hazards:[thorn(1150,50),thorn(1900,60)],signs:[[80,470,'MORE ROOM TO LEARN THE ICE'],[560,470,'BRAKE BEFORE THE GAP']]},
 {width:2600,limit:360,platforms:[g(0,440),g(1200,360),g(2340,260)],falling:[fall(520,430,160,.85),fall(750,390,160,.8),fall(980,430,160,.75),fall(1640,430,170,.7),fall(1880,390,170,.65),fall(2120,430,150,.7)],returns:[[1300,470]],signs:[[80,470,'KEEP A STEADY RHYTHM'],[1230,470,'REST BEFORE THE LAST CHAIN']]},
 {width:2800,limit:380,platforms:[g(0,900),g(1000,700),g(1800,1000),p(300,390,140),p(500,310,180),p(760,230,180),p(1100,260,180),p(1400,330,180),p(1800,250,200),p(2120,330,200)],enemies:[patrol(560,310,530,620,-40),patrol(2300,470,2240,2430)],signs:[[80,470,'EXPLORE THE FAR GARDEN']]},
 {width:3100,limit:380,platforms:[g(0,900),g(1000,860),g(1960,1140)],hazards:[vent(650),vent(1320,1),vent(1580,2),vent(2280,1.5),vent(2720,3.2)],enemies:[patrol(2920,470,2870,3010)],signs:[[80,470,'OBSERVE BEFORE EACH CROSSING'],[1990,470,'TWO MORE FURNACES AHEAD']]},
 {width:3400,limit:400,platforms:[g(0,440),p(520,390,240),p(840,310,240),p(1160,390,320),g(1540,1860),p(1810,390,180),p(2100,310,240),p(2440,390,180)],enemies:[patrol(960,310,900,1020,-48),patrol(1240,390,1200,1370),patrol(2200,310,2150,2270),patrol(3020,470,2960,3150)],signs:[[80,470,'CHOOSE YOUR ATTACK HEIGHT'],[1580,470,'THE LOW ROUTE STAYS OPEN']]},
 {width:3500,limit:400,platforms:[g(0,650),g(760,680),g(1560,660),g(2340,1160)],moving:[rail(1440,410,100,1510,350,52)],hazards:[vent(1000),vent(1880,1),vent(2690,1.5),vent(3050,3)],signs:[[80,470,'WAIT, CROSS, RECOVER'],[2400,470,'READ THE LAST TWO CYCLES']]},
 {width:3700,limit:420,platforms:[g(0,440),g(1260,420),p(2220,340,200),g(2780,920)],moving:[rail(460,440,180,1060,330,76),rail(1710,440,160,2040,340,72),rail(2440,340,160,2610,440,68)],returns:[[1360,470]],enemies:[patrol(3200,470,3100,3400)],signs:[[80,470,'THE LONG RAIL: WAIT ON THE DOCK'],[1300,470,'REST BEFORE THE TRANSFERS'],[2230,340,'WAIT ON THIS FIXED ISLAND']]},
 {width:3900,limit:420,platforms:[g(0,440),g(1000,460),g(2200,460),g(2780,1120),p(2900,350,160)],moving:[rail(460,430,160,820,390,72)],falling:[fall(1540,430,160,.65),fall(1780,390,160,.6),fall(2020,430,120,.65)],hazards:[vent(1210),vent(2490,1),vent(3260,2),vent(3560,3)],returns:[[2300,470]],signs:[[80,470,'COMBINE WHAT YOU KNOW'],[2240,470,'REST: THE FINAL TIMING SECTION']]},
 {width:4500,limit:440,platforms:[g(0,440),p(520,390,180),p(780,310,180),p(1040,230,240),p(1380,310,220),g(1780,380),p(2700,350,200),g(3380,1120)],moving:[rail(2180,430,160,2480,350,78)],falling:[fall(2940,390,160,.6),fall(3160,430,160,.6)],hazards:[vent(2080),thorn(3520,48),vent(3740,1),vent(4100,2.5)],returns:[[1900,470]],enemies:[patrol(4320,470,4260,4400,52)],signs:[[80,470,'YOUR FINAL REGULAR TRIAL'],[1800,470,'REST, THEN CROSS THE MACHINES'],[3400,470,'READ THE LAST OBSTACLES']]}
];
function shiftRect(b,offset){
 const r={...b,x:b.x+offset};
 for(const key of ['toX','min','max'])if(key in b)r[key]=b[key]+offset;
 return r;
}
export function expandDesign(design,index){
 const d=structuredClone(design),ext=EXTENSIONS[index],offset=d.width;
 for(const key of ['platforms','moving','falling','hazards','enemies'])d[key]=[...(d[key]||[]),...(ext[key]||[]).map(b=>shiftRect(b,offset))];
 d.signs=[...d.signs,...(ext.signs||[]).map(([x,y,label])=>[x+offset,y,label])];
 d.extraCheckpoints=[{x:offset+120,y:442,top:470},...(ext.returns||[]).map(([x,top])=>({x:offset+x,y:top-28,top}))];
 d.width+=ext.width;d.timeLimit=ext.limit;d.difficulty=index+1;
 return d;
}
export function bossDesign(final){
 if(!final)return {id:'tower',identity:'The Sentinel gauntlet',mechanic:'Mid-game synthesis and boss',width:5600,timeLimit:400,difficulty:9,power:'ice',
 intro:'A ferry and a temporary-platform chain.',development:'Two safe returns before the boss.',final:'Face the Sentinel after a timed approach.',optional:'Ice offers ranged boss damage.',checkpoint:{x:1160,y:442,top:470},
 extraCheckpoints:[{x:2300,y:442,top:470},{x:4660,y:442,top:470}],
 platforms:[g(0,440),g(1040,500),g(2280,460),p(3320,350,220),g(3640,1960)],
 moving:[rail(460,440,160,850,400,70),rail(2760,430,180,3100,350,70)],
 falling:[fall(1620,430,150,.75),fall(1840,390,150,.7),fall(2060,430,150,.75)],
 hazards:[vent(2480),vent(3920,1),vent(4340,2)],
 enemies:[patrol(3780,470,3730,3840)],signs:[[200,470,'THE SENTINEL GAUNTLET'],[2300,470,'REST BEFORE THE SECOND CROSSING'],[4680,470,'BOSS AHEAD: KEEP YOUR LAST ITEM']]};
 return {id:'castle',identity:'The Storm King gauntlet',mechanic:'Final combinations and boss',width:8100,timeLimit:480,difficulty:17,power:'fire',
 intro:'A ferry and a short amber chain.',development:'Climb the battlements, then transfer across the machines.',final:'Cross the last hazards and defeat the Storm King.',optional:'Fire gives a ranged option; stomps still work.',checkpoint:{x:1160,y:442,top:470},
 extraCheckpoints:[{x:2300,y:442,top:470},{x:4420,y:442,top:470},{x:7400,y:442,top:470}],
 platforms:[g(0,440),g(1080,400),g(2200,460),p(2740,390,220),p(3040,310,220),p(3340,230,240),p(3700,310,240),p(4060,390,240),g(4380,460),p(5460,350,220),g(6320,1780)],
 moving:[rail(460,430,170,850,350,78),rail(4860,430,170,5230,350,80)],
 falling:[fall(1560,430,160,.65),fall(1780,390,160,.6),fall(2000,430,130,.65),fall(5840,390,150,.6),fall(6070,430,150,.6)],
 hazards:[vent(2460),vent(4670,1),thorn(6580,50),vent(6870,2),vent(7200,3)],
 enemies:[patrol(3160,310,3090,3200,48),patrol(4600,470,4580,4630,50)],
 signs:[[200,470,'THE FINAL CASTLE: USE WHAT YOU LEARNED'],[2320,470,'CLIMB THE BATTLEMENTS'],[4440,470,'REST BEFORE THE MACHINE CROSSING'],[7420,470,'THE STORM KING AWAITS']]};
}
