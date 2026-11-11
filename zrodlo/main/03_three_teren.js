/* ============ THREE SETUP ============ */
const cvs=$('gl');
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas:cvs,antialias:false,powerPreference:'high-performance'})}catch(e){$('screen').insertAdjacentHTML('beforeend',(EN?'<div id="err">This browser does not support WebGL, so the 3D game cannot start.</div>':'<div id="err">Ta przeglądarka nie obsługuje WebGL, więc gra 3D nie ruszy.</div>'));return}
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.setClearColor(0x030205);
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x050308,.015);
const cam=new THREE.PerspectiveCamera(24,16/9,.5,120);
const amb=new THREE.AmbientLight(0x5a4f78,.85);scene.add(amb);
const hemi=new THREE.HemisphereLight(0x302848,0x1a0a06,.55);scene.add(hemi);
const moon=new THREE.DirectionalLight(0xd0c0ff,0);moon.position.set(-6,14,-10);scene.add(moon);scene.add(moon.target);
let filmUniforms=null;
// Wspolny standard oprawy, indywidualna paleta kazdej mapy. ?art=0 = porownanie przed.
// Dotychczasowy przelacznik ?art1=0 nadal pozwala porownac tylko rozdzial I.
const ART_ON=new URLSearchParams(location.search).get('art')!=='0';
const CH1_ART_ON=ART_ON&&new URLSearchParams(location.search).get('art1')!=='0';
const chapterArt=(ch=CH)=>ch===1?CH1_ART_ON:ART_ON;
const ART_LIGHT={1:[0xffdfba,1.55,10.5],2:[0xffe1b9,1.4,9.5],3:[0xffe4c1,1.45,10],4:[0xcfe4db,1.5,10],5:[0xdde1f0,1.55,10.5],9:[0xd0dded,1.4,9.5]};
const ATM={1:CH1_ART_ON?{amb:0x707784,ai:.98,hs:0x8999ae,hg:0x302622,hi:.46,fog:0x111722,fd:.0085,clear:0x080b11,mi:.22,mc:0xafbdd7,cold:0xe5ecf2,warm:0xf3dfc4}:{amb:0x65738c,ai:1,hs:0x8a9ebf,hg:0x2b1b17,hi:.42,fog:0x0b101b,fd:.010,clear:0x05070d,mi:.16,mc:0x9ebbea,cold:0xdceaff,warm:0xffeedc},
  2:{amb:0x5c5269,ai:.98,hs:0x5c6380,hg:0x25120c,hi:.5,fog:0x0c0910,fd:.013,clear:0x040307,mi:.18,mc:0xb6bbd5,cold:0xdce1ff,warm:0xffe5c9},
  3:{amb:0x6b6076,ai:.7,hs:0xb59a6a,hg:0x2b1921,hi:.32,fog:0x19121a,fd:.009,clear:0x0c080d,mi:.26,mc:0xc7cbe9,cold:0xe2defb,warm:0xffedcf},
  9:{amb:0x55546e,ai:.94,hs:0x566181,hg:0x1d1217,hi:.48,fog:0x090912,fd:.015,clear:0x030309,mi:.12,mc:0xaab9df,cold:0xd9e3ff,warm:0xffead7},
  5:{amb:0x5e586e,ai:1.05,hs:0x74728e,hg:0x28141b,hi:.5,fog:0x0e0b15,fd:.013,clear:0x05030a,mi:.18,mc:0xc8bedf,cold:0xe5ddff,warm:0xffe5d9},
  4:{amb:0x556d70,ai:.9,hs:0x799cac,hg:0x19251d,hi:.42,fog:0x0b161a,fd:.011,clear:0x040a0d,mi:.25,mc:0xb3d8df,cold:0xd6f2f3,warm:0xffedcf}};
// 10.11.2026: paleta rozdziału w obrazie końcowym: [barwa cieni], [barwa świateł], nasycenie, kontrast
const GRADE={1:[[.90,.98,1.12],[1.14,1.02,.86],1.16,1.05],2:[[.98,.95,1.04],[1.15,.99,.82],1.10,1.06],3:[[.93,1.02,.93],[1.12,1.05,.84],1.06,1.05],4:[[.88,1.03,1.0],[.98,1.05,1.03],1.04,1.06],5:[[.93,.96,1.10],[1.07,1.02,.95],.94,1.09],9:[[.92,1.0,1.07],[1.05,1.02,.95],.96,1.05]};
const DAWN=new THREE.Color(0xc0a898),TMPC=new THREE.Color(),WHITE_C=new THREE.Color(1,1,1);
if(CH1_ART_ON)GRADE[1]=[[.94,.99,1.05],[1.07,1.01,.93],1.06,1.06];
if(ART_ON){
 Object.assign(ATM,{
  2:{amb:0x68646f,ai:.98,hs:0x737b8c,hg:0x2c211c,hi:.5,fog:0x101019,fd:.011,clear:0x06050a,mi:.21,mc:0xbcc8d7,cold:0xe3e7ef,warm:0xf5dfbd},
  3:{amb:0x777078,ai:.76,hs:0xb09d7d,hg:0x302527,hi:.36,fog:0x181519,fd:.0085,clear:0x0c0a0e,mi:.25,mc:0xd0cfdd,cold:0xe8e4ee,warm:0xf4e4c7},
  4:{amb:0x657673,ai:.94,hs:0x8ea8ad,hg:0x202a24,hi:.44,fog:0x101b1b,fd:.010,clear:0x070d0d,mi:.25,mc:0xc1d9d7,cold:0xe0efea,warm:0xe9e7d2},
  5:{amb:0x70707b,ai:1.03,hs:0x9297aa,hg:0x28232b,hi:.5,fog:0x14131c,fd:.011,clear:0x08070d,mi:.22,mc:0xcbd0e2,cold:0xe8e7f1,warm:0xeee0d0},
  9:{amb:0x656972,ai:.96,hs:0x798694,hg:0x202027,hi:.46,fog:0x11151d,fd:.0125,clear:0x06080e,mi:.17,mc:0xb7c8de,cold:0xe0e9f2,warm:0xecdfcc}
 });
 Object.assign(GRADE,{
  2:[[.98,.98,1.02],[1.10,1.01,.90],1.04,1.06],
  3:[[.97,1,.96],[1.07,1.04,.93],1.02,1.06],
  4:[[.94,1.03,1],[1.01,1.04,1.01],1,1.06],
  5:[[.98,.99,1.05],[1.04,1.02,.98],.97,1.07],
  9:[[.96,1,1.04],[1.04,1.02,.98],.96,1.06]
 });
}
function applyAtmos(){const a=ATM[CH];amb.color.setHex(a.amb);amb.intensity=a.ai;hemi.color.setHex(a.hs);hemi.groundColor.setHex(a.hg);hemi.intensity=a.hi;scene.fog.color.setHex(a.fog);scene.fog.density=a.fd;renderer.setClearColor(a.clear);moon.intensity=a.mi||0;if(a.mc)moon.color.setHex(a.mc);RIMU.k.value=RIM_K*(.5+(a.mi||0)*3);RIMU.col.value.setHex(a.mc||0x9ebbea);if(filmUniforms){filmUniforms.cold.value.setHex(a.cold);filmUniforms.warm.value.setHex(a.warm);const g=GRADE[CH]||GRADE[9];filmUniforms.gSh.value.set(...g[0]);filmUniforms.gHi.value.set(...g[1]);filmUniforms.gSat.value=g[2];filmUniforms.gCon.value=g[3]}if(typeof setAmbience==='function')setAmbience()}
// moon rim light on sprites: figure pixels whose screen-left neighbour is empty get a cold edge glow (flips with the sprite mirroring)
const RIM_K=.55;
const RIMU={col:{value:new THREE.Color(0x9ebbea)},k:{value:0}};
function moonRim(m,step){const prev=m.onBeforeCompile;m.customProgramCacheKey=()=>'moonrim';
  m.onBeforeCompile=sh=>{if(prev)prev.call(m,sh);sh.uniforms.uRimC=RIMU.col;sh.uniforms.uRimK=RIMU.k;sh.uniforms.uRimStep={value:step};
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying float vRimS;').replace('#include <begin_vertex>','#include <begin_vertex>\nvRimS=modelMatrix[0][0]>=0.?1.:-1.;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vRimS;uniform vec3 uRimC;uniform float uRimK;uniform float uRimStep;')
      .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n{float ra=texture2D(map,vUv).a;float rl=texture2D(map,vUv+vec2(-vRimS*uRimStep,0.)).a;float rl2=texture2D(map,vUv+vec2(-vRimS*uRimStep*2.,0.)).a;float rim=step(.5,ra)*(1.-step(.5,rl))+step(.5,ra)*step(.5,rl)*(1.-step(.5,rl2))*.45;totalEmissiveRadiance+=uRimC*uRimK*rim;}')}}
const phong=o=>{const detail=o.map&&o.map.userData&&o.map.userData.surface,m=new THREE.MeshPhongMaterial(Object.assign({shininess:0,specular:0x000000},detail?{bumpMap:o.map,bumpScale:.075,shininess:18,specular:0x151820}:{},o));if(detail)m.userData.surfaceDetail=o.map;return m};
function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function texFrom(c,rep){const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping}return t}
// Ground and masonry recede into the scene; sprite frames keep their original nearest-pixel sampling.
function surfaceTex(c,rep=false){if(c.width===WW&&c.height===WH)finishGround(c);const t=texFrom(c,rep),pot=v=>(v&(v-1))===0,mip=renderer.capabilities.isWebGL2||pot(c.width)&&pot(c.height);t.generateMipmaps=mip;t.minFilter=mip?THREE.LinearMipmapLinearFilter:THREE.LinearFilter;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());t.userData={surface:true,ground:c.nbGround};return t}
// Source coordinates stay logical (16 px tiles); assets can supply 32/64 px of actual detail.
function atlasDraw(g,img,sx,sy,sw,sh,...dst){const d=img.nbDensity||1;g.drawImage(img,sx*d,sy*d,sw*d,sh*d,...dst)}
// Brzeznica prototype: semantic ground only. Never write map/under/props or consume gameplay RNG.
// Shared semantic planner for the remaining worlds. Original map codes are read-only.
function planOtherGround(ch){if(W.groundPlan)return W.groundPlan;if(W.seed===undefined)W.seed=ch*7919;
  const size=MW*MH,rows=new Uint8Array(size).fill(255),road=new Uint8Array(size),zone=new Uint8Array(size),direction=new Uint8Array(size),paths=[];
  const at=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH?y*MW+x:-1,free=i=>i>=0&&i<size&&!SOLID.has(map[i]);
  const value=i=>map[i]===31?W.under[i]:map[i],wet=i=>ch===4&&[64,65].includes(value(i))||ch===3&&value(i)===54;
  for(let i=0;i<size;i++){if(!free(i))continue;const x=i%MW,y=i/MW|0,X=GTX[x],Y=GTY[y],t=value(i),r=W.region(x,y);let row=0;
    if(ch===2){row=r==='forge'||r==='mine'?2:0;if(t===29||t===25||Math.abs(y-MP(24))<2){road[i]=3;row=0}zone[i]=r==='forge'?3:r==='mine'?4:1}
    if(ch===3){row=r==='slums'?3:r==='monastery'?6:0;if(t===57)row=7;if(t===51){row=1;road[i]=3}zone[i]=r==='slums'?3:r==='monastery'?4:1;if(t===54)row=4}
    if(ch===4){row=r==='camp'?1:r==='meadows'?2:r==='marsh'?6:0;if(r==='hill'||r==='stones')row=2;if(t===61){road[i]=2;row=1}if(t===64||t===65)row=t===64?4:5;zone[i]=r==='camp'?3:r==='marsh'?4:1}
    if(ch===5){row=({dziedziniec:0,kancelaria:2,sala:1,skarbiec:1,krypta:0,tron:1})[r]??0;if(r==='skarbiec'&&(X<11||X>68))row=4;if(t===73)row=3;if(t===76)row=1;zone[i]=({dziedziniec:1,kancelaria:2,sala:3,skarbiec:4,krypta:5,tron:6})[r]||1;if(CY.lanes.some(([a,b])=>X>=a&&X<=b)){road[i]=3}}
    if(ch===9){row=0;zone[i]=1;const room=W.rooms.find(R=>x>=R.x&&x<R.x+R.w&&y>=R.y&&y<R.y+R.h);if(!room){road[i]=2}else if(Math.min(x-room.x,y-room.y,room.x+room.w-1-x,room.y+room.h-1-y)<1.5)row=2}
    rows[i]=row;
  }
  // Walkable door mouths/bridges and all interactions become explicit destinations.
  const targets=[{name:'entry',x:W.start.x/TS,y:W.start.y/TS,rank:3},...W.npcs.filter(n=>!n.lure).map(n=>({name:n.id,x:n.x/TS,y:n.y/TS,rank:1})),...W.shrines.map((n,i)=>({name:'shrine'+i,x:n.x/TS,y:n.y/TS,rank:1}))];
  if(ch===9)for(const R of W.rooms)targets.push({name:'room-'+R.k,x:R.x+R.w/2,y:R.y+R.h/2,rank:2});
  if(ch===2)for(const [x,y] of [[34,24],[41,24],[50,13],[50,33],[51,24],[18,24],[50,48]])targets.push({name:'bridge-door-'+x+'-'+y,x:MP(x),y:MP(y),rank:2});
  if(ch===3)for(const [x,y] of [[32,28],[11,24],[44,22],[51,32],[32,47],[32,10]])targets.push({name:'gate-square-'+x+'-'+y,x:MP(x),y:MP(y),rank:2});
  if(ch===4)for(const [x,y] of [[40,55],[40,45],[40,8],[58,20],[20,15]])targets.push({name:'forest-route-'+x+'-'+y,x:MP(x),y:MP(y),rank:1});
  if(ch===5)for(const [a,b,gaps] of CY.walls)for(const [l,r] of gaps)targets.push({name:'door-'+a+'-'+l,x:MP((l+r)/2),y:MP((a+b)/2),rank:3});
  let root=-1,best=Infinity;for(let i=0;i<size;i++)if(free(i)){const d=Math.hypot(i%MW-W.start.x/TS,(i/MW|0)-W.start.y/TS);if(d<best){best=d;root=i}}road[root]=3;
  // One BFS tree gives deterministic reachable approaches without touching collision data.
  const parent=new Int32Array(size).fill(-2),q=[root];parent[root]=-1;
  for(let n=0;n<q.length;n++){const i=q[n];for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]]){const k=at(i%MW+dx,(i/MW|0)+dy);if(free(k)&&parent[k]===-2){parent[k]=i;q.push(k)}}}
  for(const t of targets){let end=-1,distance=Infinity;for(const i of q){const d=Math.hypot(i%MW+.5-t.x,(i/MW|0)+.5-t.y);if(d<distance){distance=d;end=i}}
    const route=[];for(let i=end;i>=0;i=parent[i])route.push(i);
    // Connect only until the nearest existing route, retaining full path metadata for tests.
    let connected=false;for(let n=0;n<route.length;n++){const i=route[n];if(road[i])connected=true;if(connected)continue;const next=route[n+1]??i;direction[i]=Math.abs(next-i)===MW?1:0;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(dx*dx+dy*dy>(t.rank>1?1.1:0))continue;const k=at(i%MW+dx,(i/MW|0)+dy);if(!free(k))continue;road[k]=Math.max(road[k],t.rank);if(wet(k))continue;
        if(ch===4)rows[k]=1;else if(ch===2||ch===9)rows[k]=0;else if(ch===3&&W.region(k%MW,k/MW|0)==='city')rows[k]=value(k)===51?1:0;}}
    paths.push({name:t.name,approach:end,distance,tiles:route});
  }
  // Mark the full inherited path as a visual way even where it passes an existing road.
  for(const t of paths)for(const i of t.tiles){road[i]=Math.max(road[i],1);if(!wet(i)){if(ch===4)rows[i]=1;else if(ch===2||ch===9)rows[i]=0;else if(ch===3&&W.region(i%MW,i/MW|0)==='city')rows[i]=value(i)===51?1:0}}
  // A transition is always a locally appropriate neutral material; puddles are explicit exceptions.
  const neutral=i=>ch===4?1:ch===3?0:ch===5?({kancelaria:2,sala:1,skarbiec:1,tron:1})[W.region(i%MW,i/MW|0)]??0:0;
  const allowedPair=(a,b)=>a===b||ch===2&&([a,b].includes(0)||[a,b].includes(2)&&[a,b].includes(7))||ch===9||ch===5||ch===4&&([a,b].includes(1)||[a,b].includes(6)&&([a,b].includes(4)||[a,b].includes(5)))||ch===3&&([a,b].includes(0)||[a,b].includes(1)&&[a,b].includes(6));
  for(let pass=0;pass<8;pass++){
    for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=at(x,y);if(!free(i)||wet(i))continue;for(const [dx,dy] of [[1,0],[0,1]]){const k=at(x+dx,y+dy);if(!free(k)||wet(k)||allowedPair(rows[i],rows[k]))continue;rows[i]=neutral(i);}}
    for(let y=0;y<=MH-8;y++)for(let x=0;x<=MW-8;x++){const ids=[];for(let dy=0;dy<8;dy++)for(let dx=0;dx<8;dx++){const i=at(x+dx,y+dy);if(free(i)&&!road[i]&&!wet(i))ids.push(i)}const counts={};for(const i of ids)counts[rows[i]]=(counts[rows[i]]||0)+1;if(Object.keys(counts).length>3){const material=Object.keys(counts).map(Number).filter(v=>!([3].includes(v)&&ch===5)).sort((a,b)=>counts[a]-counts[b])[0];for(const i of ids)if(rows[i]===material)rows[i]=neutral(i)}}
    const seen=new Set();for(let i=0;i<size;i++){if(!free(i)||road[i]||seen.has(i)||wet(i))continue;const q=[i],m=rows[i];seen.add(i);for(let n=0;n<q.length;n++){const j=q[n];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=at(j%MW+dx,(j/MW|0)+dy);if(free(k)&&!road[k]&&!wet(k)&&rows[k]===m&&!seen.has(k)){seen.add(k);q.push(k)}}}if(q.length<6)for(const k of q){rows[k]=neutral(k);if(m===rows[k])road[k]=1}}
  }
  const allowed=[];for(let a=0;a<8;a++)for(let b=a;b<8;b++)if(allowedPair(a,b))allowed.push(a+':'+b);
  return W.groundPlan={rows,road,zone,direction,paths,exceptions:[],allowed,wet:Array.from({length:size},(_,i)=>wet(i)?1:0)};
}

// Lines form complete, symmetric compositions; their direction comes from neighbours, never RNG.
function groundPatterns(ch,p){const bits=new Uint8Array(MW*MH),rail=new Uint8Array(MW*MH),point=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH?y*MW+x:-1;
  const free=i=>i>=0&&(!SOLID.has(map[i])||map[i]===31),put=(x,y)=>{const i=point(x,y);if(free(i))bits[i]=1};
  const frame=(a,b,c,d)=>{a=Math.round(MP(a));b=Math.round(MP(b));c=Math.round(MP(c));d=Math.round(MP(d));for(let x=a;x<=c;x++){put(x,b);put(x,d)}for(let y=b;y<=d;y++){put(a,y);put(c,y)}};
  if(ch===2){frame(5,10,32,37);for(let x=Math.round(MP(5));x<=Math.round(MP(32));x++)put(x,Math.round(MP(24)));}
  if(ch===3){frame(25,26,38,33);frame(23,7,40,12);for(let y=Math.round(MP(24));y<=Math.round(MP(53));y++)put(Math.round(MP(31.5)),y);for(let y=Math.round(MP(6));y<=Math.round(MP(13));y++)put(Math.round(MP(31.5)),y);}
  if(ch===5){frame(14,36,31,43);frame(48,36,65,43);frame(15,25,64,31);frame(27,4,52,9);}
  const mask=(a,x,y)=>(a[point(x,y-1)]?1:0)|(a[point(x+1,y)]?2:0)|(a[point(x,y+1)]?4:0)|(a[point(x-1,y)]?8:0);
  const col=m=>m===5||m===1||m===4?1:m===10||m===2||m===8?0:m===3?3:m===6?4:m===12?5:m===9?6:2;
  if(ch===2){const mark=(x,y)=>{const i=point(x,y);if(free(i)&&W.region(x,y)==='mine')rail[i]=1};for(let x=Math.round(MP(43));x<=Math.round(MP(59));x++)mark(x,Math.round(MP(48)));for(let y=Math.round(MP(44));y<=Math.round(MP(50));y++)mark(Math.round(MP(50)),y);}
  p.pattern=new Uint8Array(MW*MH);p.patternColumns=new Uint8Array(MW*MH).fill(255);p.lineMasks=new Uint8Array(MW*MH);p.railMasks=new Uint8Array(MW*MH);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=point(x,y);if(bits[i]){const m=mask(bits,x,y);p.pattern[i]=1;p.lineMasks[i]=m;p.patternColumns[i]=0;p.rows[i]=1;p.road[i]=Math.max(2,p.road[i])}if(rail[i]){const m=mask(rail,x,y);p.pattern[i]=2;p.railMasks[i]=m;p.patternColumns[i]=col(m);p.rows[i]=7;p.road[i]=2}}
  return p;
}

function planGround(ch){if(ch!==1)return groundPatterns(ch,planOtherGround(ch));if(W.groundPlan)return W.groundPlan;if(W.seed===undefined)W.seed=1349;
  const size=MW*MH,rows=new Uint8Array(size).fill(255),road=new Uint8Array(size),zone=new Uint8Array(size),direction=new Uint8Array(size),paths=[];
  const free=i=>i>=0&&i<size&&!SOLID.has(map[i]),at=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH?y*MW+x:-1;
  const near=(i,fn)=>{const x=i%MW,y=i/MW|0;return [[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>fn(at(x+dx,y+dy)))};
  const interior=i=>(map[i]===31?W.under[i]:map[i])===43;
  for(let i=0;i<size;i++){if(!free(i))continue;const x=i%MW,y=i/MW|0,X=GTX[x],Y=GTY[y];
    const yard=W.PROPS.some(p=>p.fire&&Math.hypot(p.x-x,p.y-y)<4.5),edge=Math.min(x,y,MW-1-x,MH-1-y);
    if(interior(i)){rows[i]=3;zone[i]=4}
    else if(yard){rows[i]=1;zone[i]=3}
    else if(X>=42&&X<=61&&Y>=14&&Y<=24){rows[i]=6;zone[i]=5}
    else if(edge<8||Math.sin(x*.055)+Math.cos(y*.07)>.3){rows[i]=2;zone[i]=1}
    else{rows[i]=6;zone[i]=2}
    const vertical=Math.abs(x-MP(31.5))<1.45,horizontal=Math.abs(y-MP(28.5))<1.45;
    const plaza=Math.abs(x-MP(30))<=4.5&&Math.abs(y-MP(27.5))<=3.5;
    if(!interior(i)&&(vertical||horizontal||plaza)){road[i]=3;rows[i]=4;zone[i]=6;direction[i]=vertical?1:0}
  }
  // All destinations come from existing interactions/doors; BFS finds an approach to the road.
  const targets=[...W.npcs.filter(n=>!n.lure).map(n=>({name:n.id,x:n.x/TS,y:n.y/TS,rank:1})),...W.shrines.map((n,i)=>({name:'shrine'+i,x:n.x/TS,y:n.y/TS,rank:1}))];
  if(W.crypt)targets.push({name:'crypt',x:W.crypt.x/TS,y:W.crypt.y/TS,rank:1});
  for(const [x,y] of [[10,12],[22,11],[42,12],[54,12],[10,37],[21,40],[42,40],[54,42],[17,20]])targets.push({name:'door-'+x+'-'+y,x:MP(x),y:MP(y),rank:2});
  targets.push({name:'boss-barn',x:MP(12),y:MP(20),rank:2});
  for(const t of targets){let start=-1,best=Infinity;for(let i=0;i<size;i++)if(free(i)){const d=Math.hypot(i%MW+.5-t.x,(i/MW|0)+.5-t.y);if(d<best){best=d;start=i}}
    const parent=new Int32Array(size).fill(-2),q=[start];parent[start]=-1;let end=-1;
    for(let n=0;n<q.length;n++){const i=q[n];if(road[i]){end=i;break}const x=i%MW,y=i/MW|0;
      for(const [dx,dy] of (Math.abs(x-MP(31))>Math.abs(y-MP(28))?[[1,0],[-1,0],[0,1],[0,-1]]:[[0,1],[0,-1],[1,0],[-1,0]])){const k=at(x+dx,y+dy);if(free(k)&&parent[k]===-2){parent[k]=i;q.push(k)}}}
    if(end<0)throw Error('Ground route missing: '+t.name);
    const route=[];for(let i=end;i>=0;i=parent[i])route.push(i);
    for(let n=0;n<route.length;n++){const i=route[n],x=i%MW,y=i/MW|0,next=route[n+1]??i,dir=Math.abs(next-i)===MW?1:0;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(dx*dx+dy*dy>(t.rank===2?1.1:0))continue;const k=at(x+dx,y+dy);if(!free(k))continue;road[k]=Math.max(road[k],t.rank);direction[k]=dir;if(!interior(k)&&rows[k]!==4){rows[k]=t.rank===2?4:6;zone[k]=6}}}
    paths.push({name:t.name,approach:start,distance:best,tiles:route});
  }
  // Earth separates meadow from ash, house floors and paving. This is a visual transition band.
  const copy=rows.slice();for(let i=0;i<size;i++)if(free(i)&&!road[i]&&copy[i]===2&&near(i,k=>k>=0&&[1,3,4].includes(copy[k]))){rows[i]=6;zone[i]=2}
  // Small patches merge into their dominant neighbour; interior floors are architectural exceptions.
  for(let pass=0;pass<4;pass++){const seen=new Uint8Array(size);for(let i=0;i<size;i++){if(!free(i)||road[i]||seen[i])continue;const material=rows[i],q=[i],counts={};seen[i]=1;
    for(let n=0;n<q.length;n++){const j=q[n],x=j%MW,y=j/MW|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=at(x+dx,y+dy);if(!free(k)||road[k])continue;if(rows[k]===material){if(!seen[k]){seen[k]=1;q.push(k)}}else counts[rows[k]]=(counts[rows[k]]||0)+1}}
    if(q.length<6&&material!==3){const candidates=Object.keys(counts).map(Number).filter(k=>k!==3);if(candidates.length){const m=candidates.sort((a,b)=>counts[b]-counts[a])[0];for(const j of q)rows[j]=m}else for(const j of q)road[j]=1}}
    for(let y=0;y<=MH-8;y++)for(let x=0;x<=MW-8;x++){const counts={};for(let dy=0;dy<8;dy++)for(let dx=0;dx<8;dx++){const i=at(x+dx,y+dy);if(free(i)&&!road[i])counts[rows[i]]=(counts[rows[i]]||0)+1}if(Object.keys(counts).length>3){const material=[1,2].filter(k=>counts[k]).sort((a,b)=>counts[a]-counts[b])[0];if(material!==undefined)for(let dy=0;dy<8;dy++)for(let dx=0;dx<8;dx++){const i=at(x+dx,y+dy);if(!road[i]&&rows[i]===material)rows[i]=6}}}
  }
  // Final constrained cleanup: earth is the shared transition material.
  for(let pass=0;pass<8;pass++){
    for(let i=0;i<size;i++)if(free(i)){
      if(rows[i]===2&&near(i,k=>free(k)&&[1,3,4].includes(rows[k]))||rows[i]===1&&near(i,k=>free(k)&&[3,4].includes(rows[k])))rows[i]=6;
    }
    for(let y=0;y<=MH-8;y++)for(let x=0;x<=MW-8;x++){const ids=[];for(let dy=0;dy<8;dy++)for(let dx=0;dx<8;dx++){const i=at(x+dx,y+dy);if(free(i)&&!road[i])ids.push(i)}if(new Set(ids.map(i=>rows[i])).size>3)for(const i of ids)if(rows[i]===1)rows[i]=6}
    const seen=new Set();for(let i=0;i<size;i++){if(!free(i)||road[i]||seen.has(i))continue;const q=[i],material=rows[i];seen.add(i);for(let n=0;n<q.length;n++){const j=q[n];for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=at(j%MW+dx,(j/MW|0)+dy);if(free(k)&&!road[k]&&rows[k]===material&&!seen.has(k)){seen.add(k);q.push(k)}}}if(q.length<6&&material!==3)for(const k of q){rows[k]=6;if(material===6)road[k]=1}}
  }
  if(W.crypt){const stairs=W.PROPS.find(p=>p.k==='crypt_stairs'),cx=Math.floor(stairs?stairs.x:W.crypt.x/TS),cy=Math.floor(stairs?stairs.y:W.crypt.y/TS);for(let y=cy-5;y<cy;y++)for(let x=cx-4;x<=cx+4;x++){const i=at(x,y);if(free(i)&&!interior(i)&&rows[i]===4){rows[i]=6;road[i]=0}}for(let y=cy;y<=cy+4;y++)for(let x=cx-3;x<=cx+3;x++){const i=at(x,y);if(free(i)&&!interior(i)){rows[i]=4;road[i]=2;zone[i]=6}}}
  W.groundPlan={rows,road,zone,direction,paths,exceptions:[3],allowed:['1:1','1:6','2:2','2:6','3:3','3:6','3:4','4:4','4:6','6:6']};return W.groundPlan;
}

function groundHash(x,y){let n=Math.imul(x+31,374761393)^Math.imul(y+73,668265263)^(W.seed||CH*977);n=Math.imul(n^(n>>>13),1274126177);return(n^(n>>>16))>>>0}
function naturalGround(img,row){const rows={br_ground:[0,1,2,4,6,7],dm_floor:[0,2],zl_ground:[0,2,3,5,7],cz_ground:[0,1,2,3,6],cy_ground:[0,5]};return(rows[img.nbKey]||[]).includes(row)}
function groundPadded(img){if(!img.nbPadded){const S=img.width/8,P=S/16,I=S-2*P,c=canvas(S*8,S*8),g=c.getContext('2d');for(let y=0;y<8;y++)for(let x=0;x<8;x++){const X=x*S,Y=y*S;g.drawImage(img,X,Y,S,S,X+P,Y+P,I,I);for(const [sx,sy,sw,sh,dx,dy,dw,dh] of [[0,0,1,S,0,P,P,I],[S-1,0,1,S,S-P,P,P,I],[0,0,S,1,P,0,I,P],[0,S-1,S,1,P,S-P,I,P],[0,0,1,1,0,0,P,P],[S-1,0,1,1,S-P,0,P,P],[0,S-1,1,1,0,S-P,P,P],[S-1,S-1,1,1,S-P,S-P,P,P]])g.drawImage(img,X+sx,Y+sy,sw,sh,X+dx,Y+dy,dw,dh)}img.nbPadded=c}return img.nbPadded}
function groundCoarse(img){if(!img.nbCoarse){const c=canvas(128,128);c.getContext('2d').drawImage(img,0,0,128,128);img.nbCoarse=c}return img.nbCoarse}
function groundTile(g,img,col,row,tx,ty){const n=groundHash(tx,ty),plan=W.groundPlan,j=ty*MW+tx;let materialCell=j;
  // A prop's collision tile (31) and a brazier/point tile (27) have the same floor as their surroundings, not a separate old atlas patch.
  if(plan&&plan.rows[j]===255&&(map[j]===31||map[j]===27)){let best=Infinity;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const x=tx+dx,y=ty+dy,k=y*MW+x;if(x<0||y<0||x>=MW||y>=MH||plan.rows[k]===255)continue;const score=dx*dx+dy*dy+((map[k]===31?W.under[k]:map[k])===W.under[j]?0:8);if(score<best){best=score;materialCell=k}}}
  const planned=plan&&plan.rows[materialCell]!==255;
  if(planned){row=plan.rows[materialCell];col=n%100<55?0:1+n%5}const natural=naturalGround(img,row)&&!(plan&&(CH===1&&[3,4].includes(row)||CH===4&&[1,7].includes(row)||CH!==1&&CH!==4)),variant=natural?n&7:0;const shore=col>=4&&((img.nbKey==='br_ground'||img.nbKey==='dm_floor')&&row===5||img.nbKey==='zl_ground'&&row===4||img.nbKey==='cz_ground'&&(row===4||row===5));let flags=natural||shore||img.nbKey==='cz_ground'&&row===7?1:0;
  if(planned){flags|=65;if(CH===3&&row===1){const code=(x,y)=>{const k=y*MW+x;return k>=0&&k<map.length&&(map[k]===51||map[k]===31&&W.under[k]===51)};col=code(tx,ty-1)||code(tx,ty+1)?1:0}if(CH===4&&row===1)col=W.region(tx,ty)==='camp'?1:n%100<55?1:2+n%4;if(CH===5&&row===2)col=0;if(CH===5&&row===4)col=0;}
  if(CH===3&&row===1&&!(plan&&plan.pattern&&plan.pattern[j]===1)){row=0;col=0;flags|=65;}
  if(img.nbKey==='cy_ground'&&row===1)col=[0,1,2,5,6,7][n%6];
  if(img.nbKey==='cy_ground'&&row===3){col=0;const carpet=(x,y)=>{let t=tileAt(x,y);if(t===31)t=W.under[y*MW+x];return t===73};if(!carpet(tx-1,ty))flags|=2;if(!carpet(tx+1,ty))flags|=4;if(!carpet(tx,ty-1))flags|=8;if(!carpet(tx,ty+1))flags|=16;flags|=32}
  let data=g.canvas.nbGround;if(!data)data=g.canvas.nbGround={image:img,cells:new Uint8Array(MW*MH*4)};const i=(ty*MW+tx)*4;let orientation=variant;if(plan&&plan.patternColumns&&plan.patternColumns[j]!==255){col=plan.patternColumns[j];flags&=~65;orientation=plan.pattern[j]===1?plan.lineMasks[j]*8:0;if(plan.pattern[j]===1)row=0;}data.cells.set([col+1,row,orientation,flags],i);
  g.save();g.translate(tx*16+8,ty*16+8);g.rotate((variant&3)*Math.PI/2);if(variant&4)g.scale(-1,1);g.drawImage(groundCoarse(img),col*16,row*16,16,16,-8,-8,16,16);g.restore();
}
// Keep one small atlas and tile index map instead of allocating a 6656 x 5824 texture per chapter.
// CC0 floors: full-resolution repeating textures; IDs change appearance only.
// runda 316: podloze mapy 1 z edytora (eksport autora 4.11.2026), wartosci = indeks w CC0_FLOORS[1].names; blok i rekwizyty w layoutPatch1b
const MAP1_FLOOR=["00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "00004444444444444444444444444444444444444444444000000022222222252111111111555555555555222222555255552000", "00004444444444444444444444444444444444444444444000000022222225552555555555555555555555555555525555555000", "00004444444444444444444444444444444444444444444000000022222255255555555555555555555525555555555555555500", "00004444444444444444444444444444444444444444444000000022222255255555555555555555555555555555555555555500", "00004444444444444444444444444444444444444444444000000022222255525555555555555555555525555555555555555000", "00004444440000000000000004444404444444444444444000000022222255000000000000555555550000000000000055555000", "00004444440033333333333004444403333333333004444000000022222255503333333333055555555333333333333055555000", "00004444440033333333333004444403333333333004444000000022222255503333333333055555555333333333333055555000", "00004444440033333333333004444403333333333004444000000022222255003333333333055555555333333333333055555000", "00004444440033333333333004444403333333333004444000000022222555003333333333055225555333333333333055555000", "00004444440033333333333004444403333333333004444000000022222225503333333333055555550333333333333055555000", "00004444440033333333333004444403333333333004444000000022222225003333333333055555550333333333333055555000", "00004444440033333333333004444403333333333055444000000022222255003333333333555555550333333333333055555000", "00004444440033333333333004444450005333300055444000000022222255003333333333055525550333333333333055555000", "00004444440000033333000004444455555000055255444000000022222255000003333300055555550000033330000055552000", "00004444440000033333000005222555550000055552444000000022222255550003333000055552550000033330000055522000", "00004444442555550000555555222555200000005552444000000022222225555555000055555500055555000005555555552000", "00004444442555520020555555222222000000000000000000000022222225555555000000000000000555000000555555555000", "00004444442222220000444444000000000000000000000000000022222222222255550000000000000000000000000055555000", "00004444442222220000444444000000000000000000000000000022222222222225550000000000000000000000000555555000", "00004444444444440000000000000000000000000000000000000022222222222222555550000000000000000000000255552000", "00004444444444441000000000012222222222222221000000000022222222222225555555555555555555555555555555252000", "00004444444444444444400000012222200000000221441000000022222222222225255555555555555555555555555555555000", "00004444444444444444444000012222200000000221441000000022222222222225255555555555555555555555555555555000", "00004444444444444444444400012440000000000001441000000022222222222225555555555555555555555555555555555000", "00004444441100000001444400044440000000000001441000000022222222222222555555555555555555555555555555555000", "00004444441103333301414400044440000000000001441000000022222222222225555555555555555555555555555555555000", "00004444441553333301114400144442200000000001441010000022222222222225250000000555550000000000000300555000", "00004444441503333305444400044442200000000001111000000022222222222225250000000555550000000000000300555000", "00004444441503333305544400014442222111111114411000000022222222222225250000000555553333333333333300555000", "00004444441550333055511600014422222144444414444000000022222222222225555000000555553333333333333300555000", "00004444441555000555144100044446611144444444444000000022222222222222555550005555553333333333333300555000", "00004444441555000155144100044442211144444444444000000000022222222222525555005555550333333333333333555000", "00004444441111000411144100044442211144111114400000000000022222222222525555005555550333333333333333555000", "00004444441111000444444400044221144414446444000000000000000002222222555555005555550000003333300000555000", "00004444441111000444444400044221144444444000000000000000000000222222255522004122112112222225555555555000", "00004444441111000444444400012221144444444400000000000000000000222222255552004442115555555555555552555000", "00004444442222000444444400022244444444444400000000000000000000222222225552001445555555555555555555555000", "00004444442222000444444400022244444444444400000000000000000000222222225555005555555555555555555555555000", "00004444442222000444444400022244444440000000000000000000000000002222222555005551111155555555555555555000", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "00000000000000000000000000000000000000000000000000000000000000004444000000000000000000000000000000000000", "00002222222222200000222022222222200002200000000000000000000000004444000444444444444444444444444444444000", "00002222222222200002222222222222200002200000000000000000000000004444000444444444444444444444444444444000", "00002222222222200002222222222222200002222000000000000000000000444444000444444444000000000000044444444000", "00002222222222200002222222222222200002222000000000000000000000444444000444444000000000000000000044444000", "00002222222222200002222222222222200002222000000000000000000000444444000444444000000000000000000044444000", "00002222222222200002222222222222200002222220000000000000000000444444000444400000000000000000000044444000", "00002222222222200002222222222222200002222220000000000000000002444444000444400000000000000000000044444000", "00002222222222200002222222222222200002222222220000000000000444444444000444444000000000000000000444444000", "00002222222222200002222222222222200002222444444400000000444444444444000444444400000000000000000444444000", "00002222222552200002222222222222200002222444444400000004444444424444000444444404440000000000000444444000", "00002222225555500000555522222222200002222444444400000004444444424444000000000224444000000044444444444000", "00002222225555500002552522222222200002222444444400000004444444424444000000000024444000000044444444444000", "00002222255000033333005522222222200002222444444400000004444444024444000222000004444444444444444444444000", "00002222255033333333335522222222200002222444444400000004444444424444000222110000224444444444444444444000", "00002222555033333333335522222225500000522444444400000004444440555522000252111100004444444444444444444000", "00002222550033333333335522222555550000552444444400000004444445555522222255555222000004444444444444444000", "00001111110033333333330522225555550033055444444400000004444445000003333350005522220000000024444444444000", "00001111110033333333330222225500033333005444444400000004444445000003333300005000002222000024444444444000", "00001111110033333333330222222503333333300444444400000004444444003333333333300000002225200005524444444000", "00001111110033333333330222222203333333300444444400000004444444003333333333300000005525500025554444444000", "00001111110033333333330222222203333333300444444400000004444444003333333333300000000555533330000544444000", "00001111110000000000000222222203333333300444444400000004444444003333333333300000000777777777777544444000", "00001111110000000000000222222203333333300444444400000004444444003333333333300000000777777777777544444000", "00004444444444444444444444444444333333300444444400000004444444003333333333300000000777777777777544444000", "00004444444444444444444444444444333333300444444400000004444444003333333333300000000777777777777544444000", "00004444444444444444444444444444000000000444444400000004444444003333333333300000000777777777777044444000", "00004444444444444444444444444444444444444444444400070004444444000000000000000000000777777777777044444000", "00004444444444444444444444444444444444444444444400000004444444000000000000000000000777777777777044444000", "00004444444444444444444444444444444444444444444400000004444444444444444444444444440777777777777044444000", "00004444444444444444444444444444444444444444444400000004444444444444444444444444440777777777777044444000", "00004444444444444444444444444444444444444444444400000004444444444444444444444444440000000000000044444000", "00004444444444444444444444444444444444444444444400000004444444444444444444444444444444444444444444444000", "00004444444444444444444444444444444444444444444400000004444444444444444444444444444444444444444444444000", "00004444444444444444444444444444444444444444444400000004444444444444444444444444444444444444444444444000", "00004444444444444444444444444444444444444444444400000004444444444444444444444444444444444444444444444000", "00004444444444444444444444444444444444444444444400000004444444444444444444444444444444444444444444444000", "00004444444444444444444444444444444444444444444400000004444444444444444444444444444444444444444444444000", "00004444444444444444444444444444444444444444444400000004444444444444444444444444444444444444444444444000", "00004444444444444444444444444444444444444444444400000004444444444444444444444444444444444444444444444000", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"]; // runda 317: aktualizacja z eksportu 5.11.2026
const MAP1_SHALLOW=[[27,4],[27,5],[27,6],[27,7],[27,8],[27,9],[27,10],[27,11],[27,12],[27,13],[27,14],[27,15],[27,16],[27,17],[27,18],[27,19],[27,20],[27,21],[27,22],[27,23],[27,24],[27,25],[28,25],[27,26],[28,26],[29,26],[30,26],[31,26],[32,26],[28,27],[29,27],[30,27],[31,27],[32,27],[41,27],[42,27],[29,28],[30,28],[31,31],[32,31]];
const MAP1_HOUSE=[[56,58],[57,58],[58,58],[59,58],[60,58],[61,58],[62,58],[56,59],[62,59],[56,60],[62,60],[56,61],[62,61],[56,62],[62,62],[56,63],[57,63],[61,63],[62,63]];
const MAP1_CROSS=[[70,31],[70,32],[70,33],[71,31],[71,32],[71,33],[72,31],[72,32],[72,33],[73,31],[73,32],[74,31],[74,32],[74,33],[75,31],[75,32],[75,33],[76,31],[76,32],[76,33]],MAP1_TOMB=[[73,33]],MAP1_FERNS=[[69,30],[69,31],[69,32],[69,33],[70,30],[71,30],[72,30],[73,30],[74,30],[75,30],[76,30],[77,30],[77,31],[77,32],[77,33]];
const CC0_FLOORS={1:{names:['dirt2','cracks','charcoal','ground1','ash','moss1','lava','deski'],tint:[1,.97,.92]},2:{names:['ground1','blackrock','charcoal'],tint:[.84,.88,.96]},3:{names:['zl_place','zl_street','zl_moss'],tint:[1,.96,.88]},4:{names:['mud','dirt3','leaves','darkrock','forestmoss'],tint:[.9,.96,.88]},5:{names:['ground2','blackrock','ground1'],tint:[.68,.69,.74]},9:{names:['ground2','ground1'],tint:[.73,.75,.81]}};
function cc0FloorCells(info,ch){const cells=info.cells.slice(),plan=W.groundPlan;if(!plan)return cells;
 const burns=W.PROPS.filter(p=>p.fire||/debris_fire|burnt_hay|furnace|brazier/.test(p.k||''));
 // extra CC0 floors (folder 'skille claude'): ash around the burned houses, moss patches, mossy cobbles in the slums, moss in the forest
 const capId=renderer.capabilities.maxTextures-5,nz=(x,y)=>Math.sin(x*.19+1.3)+Math.cos(y*.23+.7)+Math.sin((x-y)*.11);let ashM=null;
 if(ch===1){ashM=new Uint8Array(MW*MH);for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=tileAt(x,y);if(t===44||t===48||t===43)for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<MW&&Y<MH&&dx*dx+dy*dy<=5)ashM[Y*MW+X]=1}}}
 for(let i=0;i<MW*MH;i++){const a=i*4,row=cells[a+1],flags=cells[a+3],x=i%MW,y=i/MW|0;if(!cells[a]||!(flags&64))continue;let id=-1;
  if(ch===1&&row===3&&IMGS.cc0_deski)id=7; // runda 253: deski we wnętrzach chat
  if(ch===1&&![3,5].includes(row)){id=row===4?3:row===1?1:0;if(id!==3){if(ashM[i])id=4;else if(nz(x,y)>1.25)id=5}if(row!==4&&burns.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2.1))id=2;}
  if(ch===1&&cells[a]&&x>=4&&x<=16&&y>=15&&y<=24)id=nz(x*2.3+5,y*2.3)>1.0?6:4; // runda 242: pogorzelisko po stodole: popiół + żarzące się pęknięcia
  if(ch===1&&row!==3&&id>=0&&id!==2&&id!==4&&id!==6){let d=9;for(let oy=-3;oy<=3;oy++)for(let ox=-3;ox<=3;ox++){const t=tileAt(x+ox,y+oy);if(t===45||t===90)d=Math.min(d,Math.hypot(ox,oy))}if(d<9&&d<=Math.max(1,Math.min(3,1.9+.5*nz(x*1.3+3,y*1.3))))id=5} // runda 290: mech nad woda jak na mapie 4, szerokosc pasa falista
  if(ch===2&&![1,5,7].includes(row)){id=row===2&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>SOLID.has(tileAt(x+dx,y+dy)))?1:0;if(burns.some(p=>Math.hypot(p.x-x-.5,p.y-y-.5)<2))id=2;}
  if(ch===3&&![1,4].includes(row))id=plan.road[i]||row===3?1:0;
  if(ch===3&&id>=0&&W.region(x,y)==='slums'&&(nz(x,y)>.4||[[2,0],[-2,0],[0,2],[0,-2],[1,1],[-1,-1],[1,-1],[-1,1]].some(([dx,dy])=>tileAt(x+dx,y+dy)===54)))id=2;
  if(ch===4&&![4,5,7].includes(row)){const r=W.region(x,y);id=r==='camp'?0:row===1?1:(r==='hill'||r==='stones')?3:r==='forest'?2:0;if(id===2&&nz(x,y)>.6)id=4;}
  if(ch===5&&![3,4,6,7].includes(row))id=row===2?2:row===5?1:0;
  if(ch===9&&![1,5,7].includes(row))id=row===2?1:0;
  if(ch===1){const v=MAP1_FLOOR[y].charCodeAt(x)-48;if(v!==0||id>=0)id=v}
  if(id>capId)id=ch===4?2:0;
  if(id>=0)cells[a+2]=(cells[a+2]%8)+128+id*8;
 }return cells;
}
// Remove only the former base colour, keeping its baked shadows and ground marks.
function cc0FloorOverlay(tex,info,cells){const c=tex.image,g=c.getContext('2d'),d=g.getImageData(0,0,c.width,c.height),ref=canvas(16,16),r=ref.getContext('2d'),coarseImg=groundCoarse(info.image);
 for(let i=0;i<MW*MH;i++){const a=i*4;if(cells[a+2]<128)continue;const tx=i%MW,ty=i/MW|0,v=info.cells[a+2]%8;r.clearRect(0,0,16,16);r.save();r.translate(8,8);r.rotate((v&3)*Math.PI/2);if(v&4)r.scale(-1,1);r.drawImage(coarseImg,(info.cells[a]-1)*16,info.cells[a+1]*16,16,16,-8,-8,16,16);r.restore();const base=r.getImageData(0,0,16,16).data;
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const j=((ty*16+y)*c.width+tx*16+x)*4,k=(y*16+x)*4;for(let q=0;q<3;q++)d.data[j+q]=Math.round(Math.min(2,d.data[j+q]/Math.max(8,base[k+q]))*127.5);}
 }g.putImageData(d,0,0);tex.needsUpdate=true;
}
function groundMaterial(m){const info=m.map&&m.map.userData&&m.map.userData.ground;if(!info)return m;
  const groundChapter=CH,cc0=CC0_FLOORS[groundChapter],cc0Count=cc0?Math.min(cc0.names.length,renderer.capabilities.maxTextures-4):0,compactSamplers=renderer.capabilities.maxTextures<cc0Count+5;
  for(let i=0;i<cc0Count;i++){const t=new THREE.Texture(IMGS['cc0_'+cc0.names[i]]);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());t.needsUpdate=true;m['cc0Texture'+i]=t;hdTexReg(t,'cc0_'+cc0.names[i]);}
  const cc0Cells=cc0?cc0FloorCells(info,groundChapter):info.cells;if(cc0)cc0FloorOverlay(m.map,info,cc0Cells);
  const cc0Uniforms=cc0?cc0.names.slice(0,cc0Count).map((_,i)=>'uniform sampler2D nbCC'+i+';').join('\n'):'';
  const cc0Sample=cc0?cc0.names.slice(0,cc0Count).map((_,i)=>'if(id<'+(i+.5).toFixed(1)+'){\n#ifdef NB_STABLE_GRAD\nreturn texture2DGradEXT(nbCC'+i+',world/12.,nbDx/12.,nbDy/12.).rgb;\n#else\nreturn texture2D(nbCC'+i+',world/12.).rgb;\n#endif\n}').join('\n'):'';
  m.bumpMap=null;m.bumpScale=0;delete m.userData.surfaceDetail;
  m.groundAtlas=surfaceTex(groundPadded(info.image));m.groundCoarse=surfaceTex(groundCoarse(info.image));
  // Stable derivatives across tile-index jumps; retain minification without neighbouring-cell bleed.
  m.groundCoarse.generateMipmaps=false;m.groundCoarse.minFilter=THREE.LinearFilter;m.groundCoarse.anisotropy=1;m.groundCoarse.needsUpdate=true;
  const groundGrad=renderer.capabilities.isWebGL2||renderer.extensions.has('EXT_shader_texture_lod');
  m.extensions={...(m.extensions||{}),derivatives:true,shaderTextureLOD:groundGrad};
  if(!groundGrad)for(const tex of [m.groundAtlas,m.groundCoarse]){tex.generateMipmaps=false;tex.minFilter=THREE.LinearFilter;tex.anisotropy=1;tex.needsUpdate=true;}m.groundLayout=new THREE.DataTexture(cc0Cells,MW,MH,THREE.RGBAFormat);m.groundLayout.magFilter=m.groundLayout.minFilter=THREE.NearestFilter;m.groundLayout.needsUpdate=true;
  m.groundTones=Array.from({length:8},(_,row)=>{const c=groundCoarse(info.image),d=c.getContext('2d').getImageData(0,row*16,128,16).data,v=new THREE.Vector3();for(let i=0;i<d.length;i+=4){v.x+=d[i];v.y+=d[i+1];v.z+=d[i+2]}return v.multiplyScalar(1/(2048*255))});m.groundLite={value:coarse||SETT.quality==='low'?1:0};m.onBeforeCompile=sh=>{for(let i=0;i<cc0Count;i++)sh.uniforms['nbCC'+i]={value:m['cc0Texture'+i]};sh.uniforms.nbCCTint={value:new THREE.Vector3(...(cc0?cc0.tint:[1,1,1]))};sh.uniforms.nbArchitecture={value:[2,3,5].includes(groundChapter)?1:0};sh.uniforms.nbLite=m.groundLite;sh.uniforms.nbTones={value:m.groundTones};sh.uniforms.nbAtlas={value:m.groundAtlas};sh.uniforms.nbCoarse={value:m.groundCoarse};sh.uniforms.nbLayout={value:m.groundLayout};sh.uniforms.nbGrid={value:new THREE.Vector2(MW,MH)};
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>',`#include <common>
${groundGrad?'#define NB_STABLE_GRAD 1':''}
uniform vec3 nbTones[8];uniform float nbLite;uniform float nbArchitecture;
vec3 nbTone(float row){vec3 c=nbTones[0];for(int i=1;i<8;i++)if(abs(row-float(i))<.5)c=nbTones[i];return c;}uniform sampler2D nbAtlas;uniform sampler2D nbCoarse;uniform sampler2D nbLayout;uniform vec2 nbGrid;
vec4 nbCell(vec2 cell){return floor(texture2D(nbLayout,(clamp(cell,vec2(0.),nbGrid-1.)+.5)/nbGrid)*255.+.5);}
vec2 nbUV(vec4 cell,vec2 uv){float v=mod(cell.b,8.); float rot=mod(v,4.);if(rot<.5){}else if(rot<1.5)uv=vec2(uv.y,1.-uv.x);else if(rot<2.5)uv=1.-uv;else uv=vec2(1.-uv.y,uv.x);if(v>=4.)uv.x=1.-uv.x;uv=(4.+56.*clamp(uv,vec2(.02),vec2(.98)))/64.;return vec2((cell.r-1.+uv.x)/8.,1.-(cell.g+uv.y)/8.);}
vec2 nbReference(vec4 cell,vec2 uv){uv=clamp(uv,vec2(.03125),vec2(.96875));vec2 p=nbUV(cell,uv);return vec2((cell.r-1.+(64.*(p.x*8.-cell.r+1.)-4.)/56.)/8.,1.-(cell.g+(64.*((1.-p.y)*8.-cell.g)-4.)/56.)/8.);}
${cc0Uniforms}
uniform vec3 nbCCTint;
vec2 nbWorld,nbDx,nbDy;
vec3 nbCCRead(float id,vec2 world){${cc0Sample}return vec3(1.);}
vec3 nbRead(sampler2D atlas,vec4 cell,vec2 local){if(cell.b>=128.)return nbCCRead(floor((cell.b-128.)/8.),nbWorld)*nbCCTint;vec2 uv=nbUV(cell,local);
#ifdef NB_STABLE_GRAD
vec2 gx=nbUV(cell,vec2(.5)+nbDx)-nbUV(cell,vec2(.5)),gy=nbUV(cell,vec2(.5)+nbDy)-nbUV(cell,vec2(.5));float cap=min(1.,4./max(1024.*max(length(gx),length(gy)),.001));return texture2DGradEXT(atlas,uv,gx*cap,gy*cap).rgb;
#else
return texture2D(atlas,uv).rgb;
#endif
}
float nbFlag(float flags,float bit){return mod(floor(flags/bit),2.);}
vec3 nbNeighbor(vec3 color,vec2 pos,vec2 local,vec2 dir,float distanceToEdge,vec4 cell){if(distanceToEdge>(nbFlag(cell.a,64.)>.5?.48:.19)||nbFlag(cell.a,1.)<.5)return color;vec4 other=nbCell(pos+dir);if(other.r<.5||nbFlag(other.a,1.)<.5)return color;if(cell.b>=128.&&other.b>=128.&&floor((cell.b-128.)/8.)==floor((other.b-128.)/8.))return color;float irregular=nbFlag(cell.a,64.)>.5?.30+.12*sin((pos.x+local.x)*3.1+(pos.y+local.y)*2.7)*sin((pos.y+local.y)*4.3):(other.g==cell.g?.10:.16)+.025*sin((pos.x+local.x)*8.3+(pos.y+local.y)*5.7);float amount=(1.-smoothstep(0.,irregular,distanceToEdge))*.5;return mix(color,nbRead(nbAtlas,other,local-dir),amount);}
`);
    sh.fragmentShader=sh.fragmentShader.replace('#include <map_fragment>',`#ifdef USE_MAP
vec4 sampledDiffuseColor=texture2D(map,vUv);vec2 nbPos=vec2(vUv.x,1.-vUv.y)*nbGrid,nbTile=floor(nbPos),nbLocal=fract(nbPos);vec4 cell=nbCell(nbTile);nbDx=dFdx(nbPos);nbDy=dFdy(nbPos);nbWorld=nbPos;
if(cell.r>.5){
if(cell.b<128.&&nbLite<.5&&nbFlag(cell.a,64.)>.5&&cell.g!=3.&&cell.g!=1.){vec2 warp=nbPos+.64*vec2(sin(nbPos.y*1.7+sin(nbPos.x*.8)),sin(nbPos.x*1.5+sin(nbPos.y*.9)));vec4 next=nbCell(floor(warp));if(next.r>.5&&nbFlag(next.a,64.)>.5&&next.g!=cell.g&&next.g!=3.&&next.g!=1.){cell=next;nbTile=floor(warp);nbLocal=fract(warp);}}
vec2 uv=nbUV(cell,nbLocal);vec3 detail=nbRead(nbAtlas,cell,nbLocal),coarse=${compactSamplers?'nbTone(cell.g)':'texture2D(nbCoarse,nbReference(cell,nbLocal)).rgb'};
if(nbLite<.5){
detail=nbNeighbor(detail,nbTile,nbLocal,vec2(-1.,0.),nbLocal.x,cell);detail=nbNeighbor(detail,nbTile,nbLocal,vec2(1.,0.),1.-nbLocal.x,cell);detail=nbNeighbor(detail,nbTile,nbLocal,vec2(0.,-1.),nbLocal.y,cell);detail=nbNeighbor(detail,nbTile,nbLocal,vec2(0.,1.),1.-nbLocal.y,cell);
}
if(nbLite>=.5&&cell.b>=128.){vec2 ed=min(nbLocal,1.-nbLocal);vec2 dir=ed.x<ed.y?vec2(nbLocal.x<.5?-1.:1.,0.):vec2(0.,nbLocal.y<.5?-1.:1.);detail=nbNeighbor(detail,nbTile,nbLocal,dir,min(ed.x,ed.y),cell);}
vec3 ratio=cell.b>=128.?clamp(sampledDiffuseColor.rgb*2.,vec3(.05),vec3(1.3)):clamp(sampledDiffuseColor.rgb/max(coarse,vec3(.025)),vec3(.7),vec3(1.15));vec3 result=detail*ratio;float decal=smoothstep(.18,.5,length(sampledDiffuseColor.rgb-coarse));if(cell.b<128.)result=mix(result,sampledDiffuseColor.rgb,decal);
if(nbFlag(cell.a,32.)>.5){float edge=1.;if(nbFlag(cell.a,2.)>.5)edge=min(edge,nbLocal.x);if(nbFlag(cell.a,4.)>.5)edge=min(edge,1.-nbLocal.x);if(nbFlag(cell.a,8.)>.5)edge=min(edge,nbLocal.y);if(nbFlag(cell.a,16.)>.5)edge=min(edge,1.-nbLocal.y);float trim=smoothstep(.02,.035,edge)*(1.-smoothstep(.075,.09,edge));result=mix(result,vec3(.56,.35,.105)*(.86+.14*sin((nbPos.x+nbPos.y)*80.)),trim);}
if(nbArchitecture>.5&&cell.b>=8.&&cell.b<128.){float mask=floor(cell.b/8.);vec2 q=nbLocal-.5;float d=2.;
if(nbFlag(mask,1.)>.5)d=min(d,length(vec2(q.x,max(q.y,0.))));if(nbFlag(mask,4.)>.5)d=min(d,length(vec2(q.x,min(q.y,0.))));
if(nbFlag(mask,8.)>.5)d=min(d,length(vec2(max(q.x,0.),q.y)));if(nbFlag(mask,2.)>.5)d=min(d,length(vec2(min(q.x,0.),q.y)));
vec3 base=nbCCRead(0.,nbWorld)*nbCCTint*ratio;float band=1.-smoothstep(.19,.23,d);result=mix(base,base*.94,band);float line=1.-smoothstep(.018,.032,abs(d-.14));result=mix(result,vec3(.65,.45,.21)*(.92+.08*sin((nbWorld.x+nbWorld.y)*30.)),line);}
if(nbLite<.5){float gn=fract(sin(dot(floor(nbWorld*24.),vec2(12.9898,78.233)))*43758.5453);float gp=max(length(nbDx),length(nbDy))*24.;result*=1.+(gn-.5)*.12*clamp(1.3-gp,0.,1.);}
sampledDiffuseColor.rgb=result;}
sampledDiffuseColor=mapTexelToLinear(sampledDiffuseColor);diffuseColor*=sampledDiffuseColor;
#endif`)};m.customProgramCacheKey=()=> 'nightbrand-ground-cc0-v3-'+groundChapter+'-'+compactSamplers;return m}
function groundDetails(g){const plan=W.groundPlan;if(!plan)return;for(const p of W.PROPS){const x=Math.floor(p.x),y=Math.floor(p.y),i=y*MW+x;if(plan.road[i])continue;const fire=p.fire||/furnace|brazier/.test(p.k),blood=/gallows|covered_corpses|beggar_bodies/.test(p.k),bones=/bones|sarcophagus/.test(p.k);if(!fire&&!blood&&!bones)continue;const key=fire?'scorch':blood?'pool':'bones',stamp=canvas(40,40),q=stamp.getContext('2d');q.drawImage((blood&&bloodHD.ready?bloodHD.stamps:DEC[key])[groundHash(x,y)%4],0,0,40,40);q.globalCompositeOperation='destination-in';const mask=q.createRadialGradient(20,20,4,20,20,20);mask.addColorStop(0,'#fff');mask.addColorStop(1,'transparent');q.fillStyle=mask;q.fillRect(0,0,40,40);g.save();g.globalAlpha=blood?.28:.18;g.drawImage(stamp,p.x*16-20,p.y*16-20);g.restore()}
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){const i=y*MW+x;if(plan.road[i]||plan.rows[i]===255||groundHash(x,y)%67)continue;const wall=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>SOLID.has(map[(y+dy)*MW+x+dx]));if(!wall)continue;g.save();g.globalAlpha=.12;g.drawImage(DEC.crack[groundHash(y,x)%4],x*16-4,y*16-4,24,24);g.restore()}}

function finishGround(c){const noise=canvas(64,64),g=noise.getContext('2d'),d=g.createImageData(64,64);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const i=(y*64+x)*4,n=.5+.24*Math.sin(x*.17+CH)*Math.cos(y*.19)+.24*Math.sin((x+y)*.11+CH*2);d.data[i]=10;d.data[i+1]=12;d.data[i+2]=17;d.data[i+3]=12+n*30}g.putImageData(d,0,0);const fg=c.getContext('2d');fg.save();fg.globalCompositeOperation='source-atop';fg.imageSmoothingEnabled=true;fg.drawImage(noise,0,0,c.width,c.height);fg.restore();const info=c.nbGround;if(info&&!W.groundPlan){const random=rng((W.seed||CH*991)^0x54d2);for(let k=0;k<96;k++){const x=(random()*MW)|0,y=(random()*MH)|0;if(!(info.cells[(y*MW+x)*4+3]&1))continue;const images=random()<.65?DEC.crack:DEC.scorch;if(!images)continue;fg.save();fg.globalAlpha=.10+random()*.08;fg.translate(x*16+8,y*16+8);fg.rotate(random()*Math.PI*2);const size=9+random()*11;fg.drawImage(images[(random()*4)|0],-size/2,-size/2,size,size);fg.restore()}}}

const glowC=(col)=>{const c=canvas(16,16),g=c.getContext('2d');const gr=g.createRadialGradient(8,8,0,8,8,8);gr.addColorStop(0,'#fff');gr.addColorStop(.25,col);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,16,16);return texFrom(c)};
const contactTex=(()=>{const c=canvas(32,32),g=c.getContext('2d');let gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(0,0,0,.55)');gr.addColorStop(.6,'rgba(0,0,0,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);
  gr=g.createRadialGradient(16,16,0,16,16,8.5);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.55,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);return texFrom(c)})();
const blobTex=(()=>{const c=canvas(16,16),g=c.getContext('2d');const gr=g.createRadialGradient(8,8,0,8,8,8);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.5,'rgba(0,0,0,.75)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,16,16);return texFrom(c)})();

const floorGeo=new THREE.PlaneGeometry(MW,MH);floorGeo.rotateX(-Math.PI/2);
const decalC=canvas(WW,WH),dg=decalC.getContext('2d');const decalTex=texFrom(decalC);
const decal=new THREE.Mesh(floorGeo,phong({map:decalTex,transparent:true,depthWrite:false}));decal.position.set(MW/2,.02,MH/2);decal.receiveShadow=true;scene.add(decal);
let decalDirty=false,decalT=0;

