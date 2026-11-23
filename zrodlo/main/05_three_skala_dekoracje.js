// Shared sheets keep identical proportions in the village, city, forge and crypt.
const HUMAN_PROP_SCALE={chapel_stairs:1.5,dead_tree:1.02,impaled_head:.65,grave_cross:.7,tombstone:.7,well:.65,shrine:.75,gallows:1.25,
  debris_fire:.55,order_bonfire:.75,wheel:.6,barrel:.5,marga_cart:.9,crow_post:.75,covered_corpses:.6,order_banner:.8,burnt_hay:.5,dead_horse:1.1,
  king_statue:.88,anvil:.48,mine_cart:.72,pickaxe_rack:.85,healing_shrine:.8,chains:.6,fallen_pillar:.85,dwarf_bones:.6,bellows:.55,furnace:.85,sarcophagus:.9,rune_lantern:.75,black_powder:.48,clan_banner:1.37,
  queen_fountain:1.3,street_lantern:1.3,noble_door:1.2,saint_king:.8,cathedral_gate:1.3,beggar_bodies:.65,plague_cart:1.25,noble_carriage:1.4,gibbet:1.3,pyre:.8,rot_bloom:.45,royal_banner:1.3,offering_bowl:.5,broken_bell:.55,doorway_bones:.9,
  cz_fire:.65,cz_idol:1.2,cz_skullpole:.7,cz_shrine:.8,cz_wagon:1.1,cz_cauldron:.45,cz_firewood:.4,cz_gallows:1.6,cz_sacpole:1.3,cz_beehive:.5,cz_wheel:.55,cz_wisp:.45,cz_crow:.35,cz_walk:1.6,cz_tent:1.4,cz_pelts:.45,cz_bones:.3};
// Runda 259: rozdz. I - skala wg wzrostu bohatera (180 cm = ok. 1,44 j.; 1 j. = ok. 125 cm). Wartosci dla nowych rekwizytow HD (p1_*).
const HUMAN_PROP_SCALE_1={house_fire:.5,shop_sign:.9,crypt_stairs:.75,dead_tree:1.6,impaled_head:1.1,grave_cross:.6,tombstone:.55,well:.8,stocks:.81,shrine:.8,gallows:1.67,wheel:.6,barrel:.5,marga_cart:1.15,crow_post:1.04,covered_corpses:.8,order_banner:1.4,burnt_hay:.8,dead_horse:1};
function fitWorldProps(w,ch){if(ch===5)return;const assigned=new Set();
  for(const p of w.PROPS){const s=((ch===1||ch===PORT)&&HUMAN_PROP_SCALE_1[p.k]!==undefined)?HUMAN_PROP_SCALE_1[p.k]:HUMAN_PROP_SCALE[p.k];if(s===undefined)continue;const o=p.obj||w.propObjs.find(o=>Math.abs(o.mesh.position.x-p.x)<.001&&Math.abs(o.mesh.position.z-p.y)<.001);if(!o)continue;
    o.mesh.scale.set(p.flip?-s:s,s*SQ,s);p.obj=o;assigned.add(o);/* 15.11.2026: skala nie kasuje odbicia lustrzanego (flip) */if(['wheel','burnt_hay','covered_corpses','dwarf_bones','beggar_bodies','doorway_bones','cz_pelts','cz_bones'].includes(p.k))o.mesh.castShadow=false}
  for(const o of w.propObjs)if(!assigned.has(o)&&o.fps===6&&!o.kind)o.mesh.scale.set(.55,.55*SQ,.55);
}
const SURFACE_TIME={value:0};
const FOLIAGE_MOTION={value:matchMedia('(prefers-reduced-motion: reduce)').matches?0:1};
function foliageWind(fr){for(const m of [fr.n,fr.d]){if(!m)continue;const previous=m.onBeforeCompile;m.onBeforeCompile=sh=>{previous.call(m,sh);sh.uniforms.uFoliageTime=SURFACE_TIME;sh.uniforms.uFoliageMotion=FOLIAGE_MOTION;
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nuniform float uFoliageTime;uniform float uFoliageMotion;').replace('#include <begin_vertex>','#include <begin_vertex>\nfloat windPhase=0.;\n#ifdef USE_INSTANCING\nwindPhase=instanceMatrix[3].x*.37+instanceMatrix[3].z*.21;\n#endif\ntransformed.x+=sin(uFoliageTime*.65+windPhase)*pow(max(position.y,0.)*.18,2.)*.075*uFoliageMotion;')};m.customProgramCacheKey=()=> 'nightbrand-foliage-'+m.type}}
function liquidMat(options,kind=0){const m=phong(options);m.onBeforeCompile=sh=>{sh.uniforms.uFlow=SURFACE_TIME;sh.uniforms.uLiquid={value:kind};
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vLiquid;').replace('#include <project_vertex>','#include <project_vertex>\nvec4 lp=vec4(transformed,1.);\n#ifdef USE_INSTANCING\nlp=instanceMatrix*lp;\n#endif\nvLiquid=(modelMatrix*lp).xz;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vLiquid;uniform float uFlow;uniform float uLiquid;').replace('#include <dithering_fragment>',`float drift=sin(vLiquid.x*4.8+vLiquid.y*2.1+uFlow*.65)+sin(vLiquid.y*7.1-vLiquid.x*1.3-uFlow*.9);
    float glint=pow(max(0.,sin(vLiquid.x*9.+vLiquid.y*5.+sin(vLiquid.y*2.+uFlow*.45))),12.);
    if(uLiquid>1.5){float w1=sin(vLiquid.x*3.1+vLiquid.y*1.7+uFlow*.8),w2=sin(vLiquid.y*4.3-vLiquid.x*2.2-uFlow*.6);
    float n=sin(vLiquid.x*11.3+w1*2.1)*sin(vLiquid.y*9.7-w2*1.9+uFlow*.7)*sin((vLiquid.x+vLiquid.y)*5.3+uFlow*.37);
    gl_FragColor.rgb+=vec3(.08,.10,.13)*pow(max(0.,n),9.)*.9+vec3(.006,.009,.013)*(w1+w2);}else
    gl_FragColor.rgb+=uLiquid>.5?vec3(.065,.025,.008)*(drift*.25+.4):vec3(.035,.055,.07)*(glint*.55+drift*.12);
    #include <dithering_fragment>`)};m.customProgramCacheKey=()=> 'nightbrand-liquid-'+kind;return m}
const groundFxGeo=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2);
const groundShadowMat=new THREE.MeshBasicMaterial({map:blobTex,transparent:true,opacity:.72,depthWrite:false,color:0x0c0912});
const groundGlowTex=(()=>{const c=canvas(64,64),g=c.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,.8)');r.addColorStop(.38,'rgba(255,255,255,.35)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,64,64);const t=texFrom(c);t.magFilter=t.minFilter=THREE.LinearFilter;return t})();
const groundGlowMat=new THREE.MeshBasicMaterial({map:groundGlowTex,transparent:true,opacity:.14,depthWrite:false,blending:THREE.AdditiveBlending});
// Runda 257: lun nad zrodlami swiatla (billboard ku kamerze, addytywny); haloGeo tworzone leniwie, bo PITCH jest zdefiniowane pozniej
let haloGeo=null;const haloMat=new THREE.MeshBasicMaterial({map:groundGlowTex,transparent:true,opacity:.45,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending,fog:false}),coreMat=new THREE.MeshBasicMaterial({map:groundGlowTex,transparent:true,opacity:.55,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending,fog:false});
const HALO_KINDS=['fire','shrine','rune','npc','stone','merchant','rot'];
const PROP_FEET=new WeakMap();
const PROP_RAWB=new WeakMap(); // surowy dol nieprzezroczystej czesci sprite'a (ulamek wysokosci od gory)
function propFoot(image){if(!image)return null;/* 23.11.2026: tekstura jeszcze bez obrazka (wczytywana w tle) */if(PROP_FEET.has(image))return PROP_FEET.get(image);if(!image.getContext)return null;const W=image.width,H=image.height,d=image.getContext('2d').getImageData(0,0,W,H).data;let bottom=-1,top=-1;const w=new Float32Array(H);for(let y=0;y<H;y++){let c=0;for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>=128)c++;w[y]=c;if(c){bottom=y;if(top<0)top=y}}
 let foot=bottom<0?null:(bottom+1)/H;if(foot!==null)PROP_RAWB.set(image,{b:foot,t:top/H});
 // runda 301: rekwizyt z okragla podstawa (kopczyk, cokol, tarcza ziemi) stoi srodkiem podstawy na ziemi, nie jej przednia krawedzia: kotwica w najszerszym wierszu dolnych 22% (cien i styk z podlozem wypadaja u pnia); korpus musi byc wyraznie wezszy od podstawy
 if(foot!==null){const lo=Math.max(top,bottom-Math.floor(.22*H));if(bottom-lo>=12){let pr=lo;for(let y=lo;y<=bottom;y++)if(w[y]>w[pr])pr=y;const dd=bottom-pr;let mn=1e9;for(let y=Math.max(top,pr-Math.floor(.3*H));y<=Math.max(top+1,pr-Math.floor(.04*H));y++)if(w[y]>0&&w[y]<mn)mn=w[y];
  if(dd>=H*.02&&mn<1e9&&w[pr]>=1.8*mn)foot-=Math.min(.16,Math.round(dd/H/.02)*.02)+.01}}
 PROP_FEET.set(image,foot);return foot}
// 13.11.2026: NPC staly 16 cm pod posadzka (plaszczyzna geo32 zaczyna sie pod ziemia, a rysunki NPC nie maja pustego marginesu u dolu); podnosimy tak, by najnizszy nieprzezroczysty wiersz lezal na ziemi
const NPC_LIFT=new WeakMap();function npcLift(m){const img=m.material&&m.material.map&&m.material.map.image;if(!img)return 0;let v=NPC_LIFT.get(img);if(v===undefined){propFoot(img);const R=PROP_RAWB.get(img),g=m.geometry;if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox;v=R?Math.max(0,.01-(bb.max.y-R.b*(bb.max.y-bb.min.y))*SQ):0;NPC_LIFT.set(img,v)}return v}
function settleProp(m){const g=m.geometry;if(!g.boundingBox)g.computeBoundingBox();const box=g.boundingBox,height=box.max.y-box.min.y,foot=propFoot(m.material.map.image);if(height<.3||foot===null)return;/* 12.11.2026 (autor): rekwizyt nie lewituje i nie wpada w posadzke - najnizszy nieprzezroczysty wiersz lezy tuz nad ziemia (wczesniej kotwica 'foot' topila przod podstawy, a PROP_LIFT unosil reszte o 10 cm) */const raw=PROP_RAWB.get(m.material.map.image),local=box.max.y-(raw?raw.b:foot)*height,before=m.position.y+local*m.scale.y;const lift=.008;m.position.y=.02-local*m.scale.y;m.userData.groundContact={before,after:.02};if(height*m.scale.y<1.5)m.castShadow=false;
  {const sp0=propBase(m.material.map.image);if(sp0&&height*m.scale.y>=.5&&sp0.w*(box.max.x-box.min.x)*m.scale.x<=2.8)baseFade(m.material,sp0.vb,sp0.fh)}
  // miekki cien kontaktowy pod stopa: styka rekwizyt z podlozem zamiast ostrej krawedzi sprite'a
  if(!m.userData.decal&&!m.userData.noDecal&&height*m.scale.y>=.5){const img=m.material.map.image,sp=propBase(img);if(sp&&sp.w*(box.max.x-box.min.x)*m.scale.x<=2.8){const gw=box.max.x-box.min.x,d=new THREE.Mesh(PLANE1,decalMat());d.rotation.x=-Math.PI/2;d.position.set((sp.cx-.5)*gw,local-(.006+lift)/m.scale.y,0);const sx=Math.min(2.6,Math.max(.5,sp.w*gw*1.3));d.scale.set(sx/m.scale.x,sx*.5/Math.max(.01,m.scale.z),1);d.castShadow=false;d.receiveShadow=false;d.renderOrder=-1;d.userData.decalMesh=true;m.add(d);m.userData.decal=d}}}
// rozmyty (dithering) dol sprite'a: rekwizyt przechodzi w podloze zamiast konczyc sie ostra, pozioma krawedzia
function baseFade(mat,vb,fh){if(mat.userData.pf)return;mat.userData.pf=1;const prev=mat.onBeforeCompile,pk=mat.customProgramCacheKey?mat.customProgramCacheKey():'';
 mat.onBeforeCompile=(sh,r)=>{if(prev)prev(sh,r);sh.uniforms.uPf={value:new THREE.Vector2(vb,fh)};
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying float vPy;').replace('#include <begin_vertex>','#include <begin_vertex>\nvPy=uv.y;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vPy;uniform vec2 uPf;').replace('void main() {','void main() {\nif(vPy<uPf.x+uPf.y){float f=clamp((vPy-uPf.x)/uPf.y,0.0,1.0);float n=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))));if(f<n)discard;}')};
 mat.customProgramCacheKey=()=>pk+'|pf';mat.needsUpdate=true}
const PLANE1=new THREE.PlaneGeometry(1,1),PROP_BASE=new WeakMap();let DECAL_MAT=null;
function decalMat(){if(DECAL_MAT)return DECAL_MAT;const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,2,32,32,32);r.addColorStop(0,'rgba(0,0,0,.62)');r.addColorStop(.55,'rgba(0,0,0,.3)');r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64);const t=new THREE.CanvasTexture(c);DECAL_MAT=new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,opacity:.8,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});return DECAL_MAT}
// szerokosc i srodek podstawy: dolne 16% widocznej tresci obrazu
function propBase(image){if(PROP_BASE.has(image))return PROP_BASE.get(image);let res=null;if(image&&image.getContext){const W=image.width,H=image.height,d=image.getContext('2d').getImageData(0,0,W,H).data;let bottom=-1,top=-1;for(let y=0;y<H;y++){let any=false;for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>=128){any=true;break}if(any){bottom=y;if(top<0)top=y}}
 if(bottom>=0){const lo=Math.max(top,bottom-Math.max(2,Math.floor((bottom-top)*.16)));let x0=W,x1=-1;for(let y=lo;y<=bottom;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>=128){if(x<x0)x0=x;if(x>x1)x1=x}if(x1>=0)res={w:(x1-x0+1)/W,cx:(x0+x1+1)/2/W,vb:1-(bottom+1)/H,fh:Math.max(3,(bottom-top+1)*.09)/H}}}
PROP_BASE.set(image,res);return res}
function settleWorldProps(w){const assets=new Set(w.propObjs.map(o=>o.mesh)),suspended=new Set();for(const p of w.PROPS){if(p.obj)assets.add(p.obj.mesh);if(/wisp|torch/.test(p.k)||p.anim==='wisp'){const o=p.obj||w.propObjs.find(o=>Math.abs(o.mesh.position.x-p.x)<.001&&Math.abs(o.mesh.position.z-p.y)<.001);if(o)suspended.add(o.mesh)}}
  w.group.traverse(m=>{if((!assets.has(m)&&!m.userData.propAsset)||!m.isMesh||m.isInstancedMesh||suspended.has(m)||!m.geometry||m.geometry.type!=='PlaneGeometry'||!m.material||Array.isArray(m.material)||!m.material.map||m.material.groundAtlas||Math.abs(m.rotation.x)>.2||Math.abs(m.rotation.z)>.2)return;settleProp(m)});
  // 9.11.2026: male i srednie rekwizyty (ogniska, sterty, wozy, kola, krzaki) staly dolnym wierszem pod podlozem i ziemia ucinala im spod; podnosimy je tak, by najnizszy nieprzezroczysty wiersz lezal tuz nad ziemia. Wysokie (drzewa, posagi) zostaja: ich glebsze osadzenie jest celowe.
  w.group.traverse(m=>{if(!m.isMesh||m.isInstancedMesh||!m.userData.propAsset||m.userData.groundContact||m.userData.lifted||suspended.has(m)||!m.geometry||m.geometry.type==='PlaneGeometry'||!m.material||Array.isArray(m.material)||!m.material.map||m.material.groundAtlas||Math.abs(m.rotation.x)>.05||Math.abs(m.rotation.z)>.05)return;const map=m.material.map;if(map.repeat.x!==1||map.repeat.y!==1||map.offset.y!==0)return;
   const g=m.geometry;if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox,h=(bb.max.y-bb.min.y)*m.scale.y;const R=PROP_RAWB.get(map.image)??(propFoot(map.image),PROP_RAWB.get(map.image));if(!R)return;const rb=R.b;if((rb-R.t)*h>5)return;
   const bw=m.position.y+(bb.min.y+(1-rb)*(bb.max.y-bb.min.y))*m.scale.y;if(bw>=.012||bw<-.7)return;m.position.y+=.012-bw;m.userData.lifted=.012-bw});
  // 12.11.2026: ostatnia kontrola - kazdy stojacy rekwizyt, ktory nadal tonie (>2 cm) albo wisi (>6 cm), staje dolnym wierszem na ziemi
  w.group.traverse(m=>{if(!m.isMesh||m.isInstancedMesh||(!assets.has(m)&&!m.userData.propAsset)||suspended.has(m)||!m.geometry||!m.material||Array.isArray(m.material)||!m.material.map||m.material.groundAtlas||Math.abs(m.rotation.x)>.2||Math.abs(m.rotation.z)>.2)return;const map=m.material.map,im=map.image;if(!im||map.repeat.x!==1||map.repeat.y!==1)return;const rb=rawBottom(im);if(rb==null)return;const g=m.geometry;if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox,bw=m.position.y+(bb.min.y+(1-rb)*(bb.max.y-bb.min.y))*m.scale.y;if(bw>-.02&&bw<.05)return;m.position.y+=.02-bw;if(m.userData.groundContact)m.userData.groundContact.after=.02});
}
const RAW_BOTTOM=new WeakMap();function rawBottom(im){if(RAW_BOTTOM.has(im))return RAW_BOTTOM.get(im);let r=null;try{const W=im.width,H=im.height,c=im.getContext?im:(()=>{const q=canvas(W,H);q.getContext('2d').drawImage(im,0,0);return q})(),d=c.getContext('2d').getImageData(0,0,W,H).data;for(let y=H-1;y>=0&&r===null;y--)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>=128){r=(y+1)/H;break}}catch(e){}RAW_BOTTOM.set(im,r);return r}
// Presentation only: deterministic dressing of non-blocking, non-interactive debris.
function composeWorldProps(w){
 const movable=new Set(['dwarf_bones','doorway_bones','cz_bones','cz_pelts','burnt_hay','wheel']);
 const anchors=w.PROPS.filter(p=>/sarcophagus|cart|wagon|tent|barrel|fallen_pillar|bookcase|desk/.test(p.k)&&!p.fire&&p.shrine===undefined);
 const occupied=w.PROPS.map(p=>({x:p.x,y:p.y}));
 // A few small companions stay inside existing blocked trunk cells: no new obstacles or routes.
 if(w.ch===1){let added=0;for(const p of w.PROPS){if(p.k!=='dead_tree'||!p.obj||added>=6||groundHash(Math.floor(p.x),Math.floor(p.y))%5!==0)continue;const x=p.x+.27,y=p.y-.3,i=Math.floor(y)*MW+Math.floor(x);if(tileAt(Math.floor(x),Math.floor(y))!==31||w.clearways?.has(i))continue;const m=p.obj.mesh.clone();m.scale.multiplyScalar(.62);m.position.x=x;m.position.z=y;m.castShadow=false;m.userData={propAsset:true,artOnly:true};w.group.add(m);added++}}

 for(const p of w.PROPS){const m=p.obj?.mesh||w.propObjs.find(o=>Math.abs(o.mesh.position.x-p.x)<.001&&Math.abs(o.mesh.position.z-p.y)<.001)?.mesh;
  if(!m||!movable.has(p.k)||p.fire||p.anim||p.shrine!==undefined||tileAt(Math.floor(p.x),Math.floor(p.y-.2))===31)continue;
  const anchor=anchors.filter(a=>a!==p&&Math.hypot(a.x-p.x,a.y-p.y)<5).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];if(!anchor)continue;
  const offsets=[[-1.2,.2],[1.2,.2],[-.9,1.1],[.9,1.1]];for(const [dx,dy]of offsets){const x=anchor.x+dx,y=anchor.y+dy,ix=Math.floor(x),iy=Math.floor(y),i=iy*MW+ix;
   if(ix<1||iy<1||ix>=MW-1||iy>=MH-1||SOLID.has(tileAt(ix,iy))||VOID.has(tileAt(ix,iy))||w.clearways?.has(i)||w.groundPlan?.road[i]||occupied.some(a=>Math.hypot(a.x-x,a.y-y)<.75)||w.npcs.some(n=>Math.hypot(n.x/TS-x,n.y/TS-y)<2.5)||w.shrines.some(n=>Math.hypot(n.x/TS-x,n.y/TS-y)<2.5))continue;
   m.position.x=x;m.position.z=y;m.userData.artOffset={x:x-p.x,y:y-p.y};occupied.push({x,y});break;
  }
 }
}
// Authored visual dressing uses existing HD atlases; gameplay anchors and grids remain untouched.

const NP_CFG={1:{n:70,pal:[[1.05,.68,.28],[.78,.82,.28],[.92,.52,.24]]},2:{n:45,pal:[null,[.28,.62,.9],null]},3:{n:60,pal:[[1,.92,.2],[.55,.88,.28],[.95,.62,.25]]},4:{n:60,pal:[[.28,.95,.4],[.22,.7,.45],[.5,.9,.25]]},5:{n:35,pal:[[.45,.62,1.15],[.6,.45,.95],[.4,.78,.9]]}};
const MAP1_PLANTS=[[5,6.87,76.5,0.112,0,[1,0.7,0.3]],[5,14.53,83.26,0.138,0,[1,0.7,0.3]],[5,17.77,76.29,0.111,1,[1,0.7,0.3]],[5,18.11,77.11,0.111,1,[1,0.7,0.3]],[5,15.87,82.75,0.148,1,[1,0.7,0.3]],[5,11.89,79.24,0.128,0,[1,0.7,0.3]],[5,11.84,77.96,0.114,0,[1,0.7,0.3]],[5,9.89,83.73,0.146,1,[1,0.7,0.3]],[5,14.37,74.47,0.117,0,[1,0.7,0.3]],[5,11.22,87.46,0.144,0,[1,0.7,0.3]],[5,14.38,76.3,0.138,1,[1,0.7,0.3]],[5,12.21,82.63,0.119,0,[1,0.7,0.3]],[5,10.62,79.89,0.116,0,[1,0.7,0.3]],[5,8.48,80.01,0.112,0,[1,0.7,0.3]],[5,5.88,82.37,0.112,0,[1,0.7,0.3]],[5,13.45,77.34,0.134,1,[1,0.7,0.3]],[5,11.16,84.01,0.148,1,[1,0.7,0.3]],[5,4.82,81.77,0.126,1,[1,0.7,0.3]],[5,7.46,80.38,0.114,1,[1,0.7,0.3]],[5,8.45,80.81,0.136,0,[1,0.7,0.3]],[5,19.17,80.53,0.124,1,[1,0.7,0.3]],[5,17.78,87.92,0.136,1,[1,0.7,0.3]],[5,15.34,78.33,0.125,0,[1,0.7,0.3]],[5,19.49,83.2,0.113,1,[1,0.7,0.3]],[5,19.91,83.96,0.126,1,[1,0.7,0.3]],[5,26.73,82.77,0.135,1,[1,0.7,0.3]],[5,21.16,79.97,0.113,1,[1,0.7,0.3]],[5,23.78,78.79,0.125,0,[1,0.7,0.3]],[5,13.72,83.28,0.138,1,[1,0.7,0.3]],[5,20.73,76.15,0.131,1,[1,0.7,0.3]],[5,13.8,75.45,0.116,0,[1,0.7,0.3]],[5,17.52,84.38,0.131,0,[1,0.7,0.3]],[5,23.03,80.6,0.118,0,[1,0.7,0.3]],[5,24.47,80.06,0.147,1,[1,0.7,0.3]],[5,13.4,82.72,0.121,0,[1,0.7,0.3]],[5,17.76,74.32,0.111,0,[1,0.7,0.3]],[5,22.77,78.94,0.145,0,[1,0.7,0.3]],[5,15.34,79.25,0.128,0,[1,0.7,0.3]],[5,24.6,80.58,0.134,0,[1,0.7,0.3]],[5,23.33,74.33,0.114,0,[1,0.7,0.3]],[5,33.75,80.07,0.127,0,[1,0.7,0.3]],[5,33.96,78.4,0.117,1,[1,0.7,0.3]],[5,33.64,82.57,0.121,0,[1,0.7,0.3]],[5,27.92,80.43,0.113,0,[1,0.7,0.3]],[5,30.29,79.13,0.131,0,[1,0.7,0.3]],[5,27.31,78.87,0.142,0,[1,0.7,0.3]],[5,24.67,53.71,0.133,1,[1,0.7,0.3]],[5,28.76,56.01,0.124,1,[1,0.7,0.3]],[5,31.7,52.13,0.113,0,[1,0.7,0.3]],[5,25.73,50.66,0.113,1,[1,0.7,0.3]],[5,28.56,48.9,0.117,0,[1,0.7,0.3]],[5,30.1,50.77,0.126,1,[1,0.7,0.3]],[5,43.7,56.72,0.145,1,[1,0.7,0.3]],[5,42.38,59.83,0.143,0,[1,0.7,0.3]],[5,42.35,60.26,0.133,1,[1,0.7,0.3]],[5,40.77,60.9,0.147,0,[1,0.7,0.3]],[5,45.22,58.57,0.119,0,[1,0.7,0.3]],[5,42.82,62.36,0.131,0,[1,0.7,0.3]],[5,58.61,60.07,0.14,0,[1,0.7,0.3]],[5,57.96,62.57,0.134,1,[1,0.7,0.3]],[5,60.64,63.5,0.14,1,[1,0.7,0.3]],[5,65.34,58.52,0.116,1,[1,0.7,0.3]],[5,60.04,64.69,0.144,1,[1,0.7,0.3]],[5,60.03,57.98,0.119,1,[1,0.7,0.3]],[5,67.82,56.82,0.131,0,[1,0.7,0.3]],[5,62.93,58.73,0.131,1,[1,0.7,0.3]],[5,62.7,55.91,0.143,1,[1,0.7,0.3]],[5,60.44,56.11,0.124,1,[1,0.7,0.3]],[5,69,57.22,0.148,0,[1,0.7,0.3]],[5,66.33,52.08,0.136,0,[1,0.7,0.3]],[5,68.09,51.53,0.124,1,[1,0.7,0.3]],[5,63.3,49.73,0.111,0,[1,0.7,0.3]],[5,66.59,47.73,0.124,1,[1,0.7,0.3]],[5,68.17,48.4,0.133,1,[1,0.7,0.3]],[5,65.12,53.27,0.116,0,[1,0.7,0.3]],[5,70.77,49.6,0.114,0,[1,0.7,0.3]],[5,62.62,22.7,0.123,1,[1,0.7,0.3]],[5,62.61,20.67,0.127,1,[1,0.7,0.3]],[5,61.16,20.96,0.149,0,[1,0.7,0.3]],[5,61.66,24.5,0.111,1,[1,0.7,0.3]],[5,57.5,22.38,0.121,0,[1,0.7,0.3]],[5,57.51,26.42,0.12,1,[1,0.7,0.3]],[5,60.49,26.88,0.139,0,[1,0.7,0.3]],[5,60.24,30.69,0.124,1,[1,0.7,0.3]],[5,59.4,27.01,0.145,1,[1,0.7,0.3]],[5,60.51,28.82,0.113,1,[1,0.7,0.3]],[5,58.92,31.12,0.145,0,[1,0.7,0.3]],[5,62.89,28.88,0.148,0,[1,0.7,0.3]],[5,38.35,35.75,0.145,0,[1,0.7,0.3]],[5,33.39,34.85,0.14,1,[1,0.7,0.3]],[5,35.36,35.44,0.111,1,[1,0.7,0.3]],[5,37.06,34.35,0.133,0,[1,0.7,0.3]],[5,35.9,33.28,0.12,0,[1,0.7,0.3]],[5,40.5,33.81,0.134,0,[1,0.7,0.3]],[5,28.83,35.09,0.14,0,[1,0.7,0.3]],[5,34.82,38.83,0.148,0,[1,0.7,0.3]],[5,28.32,39.71,0.141,0,[1,0.7,0.3]],[5,30.06,38.4,0.121,1,[1,0.7,0.3]],[5,28.79,37.95,0.144,0,[1,0.7,0.3]],[5,27.04,37.34,0.133,1,[1,0.7,0.3]],[5,38.89,37.63,0.113,1,[1,0.7,0.3]],[5,37.44,41.41,0.138,1,[1,0.7,0.3]],[5,39.83,39.11,0.145,0,[1,0.7,0.3]],[5,40.24,41.57,0.137,1,[1,0.7,0.3]],[5,36.84,42.78,0.12,1,[1,0.7,0.3]],[5,36.25,42.01,0.148,0,[1,0.7,0.3]],[5,33.3,36.08,0.139,1,[1,0.7,0.3]],[5,31.68,36.72,0.123,1,[1,0.7,0.3]],[5,29.24,33.97,0.112,1,[1,0.7,0.3]],[5,28.7,32.79,0.132,0,[1,0.7,0.3]],[5,29.12,31.37,0.119,1,[1,0.7,0.3]],[5,29.94,36.14,0.124,1,[1,0.7,0.3]],[5,24.31,38.25,0.13,1,[1,0.7,0.3]],[5,17.22,42.48,0.134,0,[1,0.7,0.3]],[5,24.07,37,0.129,1,[1,0.7,0.3]],[5,16.74,37.29,0.131,0,[1,0.7,0.3]],[5,17.32,37.34,0.132,1,[1,0.7,0.3]],[5,18.06,41.19,0.143,0,[1,0.7,0.3]],[5,11.04,41.23,0.127,0,[1,0.7,0.3]],[5,13.16,36.66,0.137,0,[1,0.7,0.3]],[5,12.91,38.83,0.137,0,[1,0.7,0.3]],[5,13.27,39.84,0.117,1,[1,0.7,0.3]],[5,7.01,38.84,0.149,1,[1,0.7,0.3]],[5,10.11,41.97,0.13,1,[1,0.7,0.3]],[5,5.71,26.79,0.129,0,[1,0.7,0.3]],[5,7.15,33.33,0.13,1,[1,0.7,0.3]],[5,6.75,28.48,0.138,1,[1,0.7,0.3]],[5,8.89,25.53,0.145,1,[1,0.7,0.3]],[5,5.08,26.11,0.114,0,[1,0.7,0.3]],[5,8.42,27.32,0.113,0,[1,0.7,0.3]],[5,12.82,28.6,0.145,0,[1,0.7,0.3]],[5,9.78,24.6,0.129,0,[1,0.7,0.3]],[5,13.23,23.66,0.127,1,[1,0.7,0.3]],[5,9.83,22.24,0.115,0,[1,0.7,0.3]],[5,13.56,24.43,0.128,1,[1,0.7,0.3]],[5,9.06,25.21,0.149,0,[1,0.7,0.3]],[5,5.13,20.4,0.126,0,[1,0.7,0.3]],[5,8.71,23.88,0.142,0,[1,0.7,0.3]],[5,4.34,22.87,0.117,0,[1,0.7,0.3]],[5,7.25,21.78,0.139,0,[1,0.7,0.3]],[5,7.81,19.42,0.143,1,[1,0.7,0.3]],[5,8.99,19.22,0.144,0,[1,0.7,0.3]],[5,4.59,5.98,0.13,0,[1,0.7,0.3]],[5,6.5,11.03,0.141,1,[1,0.7,0.3]],[5,7.9,13.29,0.13,1,[1,0.7,0.3]],[5,7.3,12.9,0.142,0,[1,0.7,0.3]],[5,7.99,10.24,0.12,1,[1,0.7,0.3]],[5,9.22,11.23,0.145,0,[1,0.7,0.3]],[5,39.58,7.73,0.146,1,[1,0.7,0.3]],[5,44.49,9.69,0.118,0,[1,0.7,0.3]],[5,43.85,7.98,0.127,1,[1,0.7,0.3]],[5,43.61,9.92,0.122,1,[1,0.7,0.3]],[5,43.94,9.12,0.137,1,[1,0.7,0.3]],[5,43.94,8.47,0.136,0,[1,0.7,0.3]],[5,56.64,10.45,0.119,0,[1,0.7,0.3]],[5,61.98,8.45,0.124,1,[1,0.7,0.3]],[5,62.52,7.7,0.117,1,[1,0.7,0.3]],[5,59.71,5.57,0.128,1,[1,0.7,0.3]],[5,61.32,8.51,0.12,1,[1,0.7,0.3]],[5,62.52,6.07,0.143,0,[1,0.7,0.3]],[5,57.59,19.39,0.146,1,[1,0.7,0.3]],[5,59.96,15.34,0.13,1,[1,0.7,0.3]],[5,58.32,16.44,0.146,0,[1,0.7,0.3]],[5,59.68,19.41,0.129,1,[1,0.7,0.3]],[5,57.19,17.22,0.117,1,[1,0.7,0.3]],[5,55.31,18.43,0.123,0,[1,0.7,0.3]],[5,60.65,24.76,0.147,1,[1,0.7,0.3]],[5,58.87,30.48,0.126,1,[1,0.7,0.3]],[5,59.28,29.56,0.141,0,[1,0.7,0.3]],[5,62.9,30.73,0.121,0,[1,0.7,0.3]],[5,61.38,24.9,0.132,1,[1,0.7,0.3]],[5,61.39,28.73,0.149,0,[1,0.7,0.3]],[5,61.63,33.24,0.115,0,[1,0.7,0.3]],[5,60.05,32.69,0.141,1,[1,0.7,0.3]],[5,58.33,33.14,0.147,1,[1,0.7,0.3]],[5,63.1,33.09,0.137,1,[1,0.7,0.3]],[5,56.42,32.02,0.148,1,[1,0.7,0.3]],[5,62.64,31.57,0.136,1,[1,0.7,0.3]],[0,96.92,10.76,0.17,1],[0,98.96,6.31,0.177,0],[0,100.11,7.1,0.221,1],[0,100.85,7.54,0.183,1],[0,96.23,11.37,0.225,1],[0,96.66,12.97,0.196,1],[0,46.42,64.58,0.199,0],[0,43.67,59.42,0.189,1],[0,47.02,60.2,0.18,1],[0,43.16,59.76,0.225,1],[0,41.88,64.56,0.197,0],[0,45.26,58,0.224,0],[0,26.19,54.49,0.213,1],[0,24.82,51.31,0.194,1],[0,24.93,57.11,0.223,0],[0,22.05,55.19,0.192,0],[0,21.23,52.38,0.189,1],[0,21.69,55.64,0.194,1],[0,22.03,56.75,0.188,1],[0,20.37,56.85,0.225,1],[0,24.52,58.75,0.217,0],[0,25.59,53.01,0.199,1],[0,22.15,58.98,0.19,0],[0,22.98,52.26,0.218,0],[0,8.12,51.11,0.223,1],[0,14.46,53.61,0.216,1],[0,12.37,54.3,0.184,0],[0,7.01,54.87,0.202,1],[0,12.42,55.17,0.208,0],[0,13.2,53.77,0.219,0],[0,9.93,52.83,0.226,1],[0,9.7,59.45,0.175,0],[0,10.91,53.69,0.187,0],[0,14,56.72,0.19,0],[0,8.22,58.86,0.217,0],[0,7.8,52.49,0.187,0],[0,25.7,58.97,0.204,0],[0,30.41,53.81,0.178,0],[0,25.74,57.81,0.218,1],[0,32.03,56.97,0.217,0],[0,32,56.22,0.199,0],[0,30.05,55.58,0.177,0]]; // runda 317: rosliny mapy I z edytora (eksport 5.11.2026): [rodzaj,x,y,skala,odbicie,kolor?]; zastepuja losowe rosliny rozdz. I
const PLANT_KEYS=['wolf_skull_bush','brambles','ferns','mushrooms','reeds','np_grass','np_tall','np_fern','np_thistle'];
// runda 317: rosliny wg ukladu autora (bez kolizji, jak losowe); kolor z listy mnozy ramke (trawa)
function plantLayout(w,list){const fr={},geo=new THREE.PlaneGeometry(4,4).translate(0,1.875,0),Mx=new THREE.Matrix4(),Vv=new THREE.Vector3(),Qq=new THREE.Quaternion(),Ss=new THREE.Vector3(),Cc=new THREE.Color(),by={};
 const frame=k=>{if(fr[k])return fr[k];let f;if(k.startsWith('np_'))f=IMGS['p0_'+k]?procFrame(IMGS['p0_'+k],0,0,64,64,'prop'):null;
  else{const r={wolf_skull_bush:[128,320,64,64],brambles:[64,256,64,64],ferns:[64,320,64,64],mushrooms:[128,256,64,64],reeds:[0,256,64,64]}[k];f=IMGS['p4_'+k]?procFrame(IMGS['p4_'+k],0,0,64,64,'prop'):procFrame(IMGS.cz_trees,...r,'prop')}
  if(f)cutCircle(f.n);return fr[k]=f};
 for(const p of list){const k=PLANT_KEYS[p[0]];if(k&&frame(k))(by[k]=by[k]||[]).push(p)}
 for(const k in by){const l=by[k];swayMat(fr[k].n);const im=new THREE.InstancedMesh(geo,fr[k].n,l.length);
  l.forEach((p,i)=>{const s=p[3];Mx.compose(Vv.set(p[1],0,p[2]),Qq,Ss.set((p[4]?-1:1)*s,s*SQ,s));im.setMatrixAt(i,Mx);if(p[5]){Cc.setRGB(p[5][0],p[5][1],p[5][2]);im.setColorAt(i,Cc)}});
  im.castShadow=false;im.receiveShadow=false;im.frustumCulled=false;im.userData.propAsset=true;w.group.add(im)}
 w.plantCount=(w.plantCount||0)+list.length}
function dressNeutral(w){const cfg=NP_CFG[w.ch];if(!cfg||!IMGS.p0_np_grass)return;if(w.ch===1)return; // rozdz. I: rosliny z MAP1_PLANTS (dressSettlementsHD)
 const T=[['np_grass',.13],['np_tall',.2],['np_fern',.2],['np_thistle',.14]],fr=T.map(([k])=>{const f=procFrame(IMGS['p0_'+k],0,0,64,64,'prop');cutCircle(f.n);return f});
 const rr=rng(9100+w.ch),used=[],L=T.map(()=>[]);
 const free=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y);if(ix<1||iy<1||ix>=MW-1||iy>=MH-1)return false;const i=iy*MW+ix,t=tileAt(ix,iy);if(SOLID.has(t)||VOID.has(t)||t===90||t===64||t===65||t===54||t===43||(w.ch===1&&t===40)||w.clearways?.has(i)||w.groundPlan?.road?.[i])return false;
  if(w.npcs.some(a=>Math.hypot(a.x/TS-x,a.y/TS-y)<3)||w.shrines.some(s=>Math.hypot(s.x/TS-x,s.y/TS-y)<3)||Math.hypot(w.start.x/TS-x,w.start.y/TS-y)<4)return false;
  return !w.PROPS.some(a=>Math.hypot(a.x-x,a.y-y)<1.2)&&!used.some(a=>Math.hypot(a.x-x,a.y-y)<.8)};
 let clumps=0;for(let a=0;a<8000&&clumps<cfg.n;a++){const cx=3+rr()*(MW-6),cy=3+rr()*(MH-6);if(!free(cx,cy))continue;clumps++;
  const n=1+((rr()*3)|0),pal=cfg.pal[(rr()*cfg.pal.length)|0];
  for(let j=0;j<n;j++){const x=cx+(j?(rr()-.5)*1.8:0),y=cy+(j?(rr()-.5)*1.2:0);if(j&&!free(x,y))continue;const q=rr(),k=q<.4?0:q<.65?1:q<.85?2:3,v=.85+rr()*.3;
   const o={x,y,f:rr()<.5,s:T[k][1]*(.85+rr()*.3),c:pal?[pal[0]*v,pal[1]*v,pal[2]*v]:null};if(pal)L[k].push(o);used.push({x,y})}}
 const pg=new THREE.PlaneGeometry(4,4).translate(0,1.875,0),Mx=new THREE.Matrix4(),Vv=new THREE.Vector3(),Qq=new THREE.Quaternion(),Ss=new THREE.Vector3(),Cc=new THREE.Color();
 L.forEach((l,k)=>{if(!l.length)return;swayMat(fr[k].n);const im=new THREE.InstancedMesh(pg,fr[k].n,l.length);
  l.forEach((p,i)=>{Mx.compose(Vv.set(p.x,0,p.y),Qq,Ss.set((p.f?-1:1)*p.s,p.s*SQ,p.s));im.setMatrixAt(i,Mx);Cc.setRGB(p.c[0],p.c[1],p.c[2]);im.setColorAt(i,Cc)});
  im.castShadow=false;im.receiveShadow=false;im.frustumCulled=false;im.userData.propAsset=true;w.group.add(im)})}
function dressSettlementsHD(w){
 if(w.ch===1){
  const specs={birch:[192,0,64,64],spruce:[0,0,64,64],dead_oak:[128,0,64,64],ferns:[64,320,64,64],brambles:[64,256,64,64],mossy_boulder:[0,192,64,64],dead_spruce:[64,0,64,64]};const frames={};
  for(const [k,r]of Object.entries(specs)){frames[k]=IMGS['p4_'+k]?procFrame(IMGS['p4_'+k],0,0,r[2],r[3],'prop'):procFrame(IMGS.cz_trees,...r,'prop');cutCircle(frames[k].n)}
  // Replace selected existing trunks, preserving their blocking position and ground contact.
  const treeGeo=new THREE.PlaneGeometry(4,4).translate(0,1.875,0);
  for(const p of w.PROPS){if(p.k!=='dead_tree'||!p.obj)continue;const h=groundHash(Math.floor(p.x),Math.floor(p.y)),k=p.variant||['dead_oak','dead_spruce','dead_oak'][h%3],m=p.obj.mesh,vs=p.vscale||({spruce:1.08,birch:1}[k]||.82);m.geometry=treeGeo;m.material=frames[k].n;m.customDistanceMaterial=frames[k].d;m.scale.set(vs,vs*SQ,vs);p.obj.frames=[frames[k]];m.castShadow=true;}
  // Low garden/ruin clusters leave the plaza, doors and interaction approaches clear.
  const sites=MAP1_PLANTS?[]:[[25,23],[35,23],[25,32],[37,32],[43,18],[58,19],[45,24],[57,24],[18,28],[42,34],[8,34],[53,39]];
  const geo=new THREE.PlaneGeometry(4,4).translate(0,1.875,0);const used=[];
  for(let n=0;n<sites.length;n++){const [gx,gy]=sites[n];for(let j=0;j<3;j++){const x=MP(gx)+[0,.75,-.65][j],y=MP(gy)+[0,.45,.6][j],ix=Math.floor(x),iy=Math.floor(y),i=iy*MW+ix;
   if(SOLID.has(tileAt(ix,iy))||VOID.has(tileAt(ix,iy))||w.clearways?.has(i)||w.groundPlan.road[i]||w.npcs.some(a=>Math.hypot(a.x/TS-x,a.y/TS-y)<3)||w.PROPS.some(a=>Math.hypot(a.x-x,a.y-y)<1)||used.some(a=>Math.hypot(a.x-x,a.y-y)<.6))continue;
   const k=j===0?'brambles':'ferns',fr=frames[k],m=new THREE.Mesh(geo,fr.n),z=j===0?.24:.18;m.position.set(x,0,y);m.scale.set(z,z*SQ,z);m.userData.propAsset=true;m.castShadow=false;w.group.add(m);used.push({x,y});
  }}
  // Roślinność bez kolizji po całej mapie: paprocie (trawa), jeżyny (krzaki), grzyby; przy stawie trzciny.
  {const ex={mushrooms:[128,256,64,64],reeds:[0,256,64,64]};for(const [k,r]of Object.entries(ex)){frames[k]=IMGS['p4_'+k]?procFrame(IMGS['p4_'+k],0,0,r[2],r[3],'prop'):procFrame(IMGS.cz_trees,...r,'prop');cutCircle(frames[k].n)}
   const rr=rng(4711),byK={ferns:[],brambles:[],mushrooms:[],reeds:[]},
     near=(x,y,t,R)=>{for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++)if(tileAt(x+dx,y+dy)===t)return true;return false},
     free=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),i=iy*MW+ix,t=tileAt(ix,iy);if(SOLID.has(t)||VOID.has(t)||t===40||t===43||w.clearways?.has(i)||w.groundPlan.road[i])return false;
       if(w.npcs.some(a=>Math.hypot(a.x/TS-x,a.y/TS-y)<3)||w.shrines.some(s=>Math.hypot(s.x/TS-x,s.y/TS-y)<3)||Math.hypot(w.start.x/TS-x,w.start.y/TS-y)<4)return false;
       return !w.PROPS.some(a=>Math.hypot(a.x-x,a.y-y)<1.2)&&!used.some(a=>Math.hypot(a.x-x,a.y-y)<.9)};
   // runda 316: obwodka cmentarza z edytora; 22.11.2026 (autor): bez rownego rzedu: przesuniecie, rozna wielkosc, czesc pol pominieta, czesc z druga paprocia (stale, z hasha pola)
   for(const [fx,fy] of (w.extraFerns||[])){const h=k=>{let n=Math.imul(fx*7+k+31,374761393)^Math.imul(fy*13+k*3+73,668265263);n=Math.imul(n^(n>>>13),1274126177);return(((n^(n>>>16))>>>0)%1000)/1000};if(h(1)<.18)continue;
    const put=(x,y,s,f)=>{byK.ferns.push({x,y,f,s});used.push({x,y})};put(fx+.5+(h(2)-.5)*.9,fy+.5+(h(3)-.5)*.7,.16+h(4)*.1,h(5)<.5);
    if(h(6)<.3)put(fx+.5+(h(7)-.5)*1.6,fy+.5+(h(8)-.5)*1.4,.12+h(9)*.06,h(10)<.5)}
   let clumps=0;for(let a=0;a<6000&&clumps<(MAP1_PLANTS?0:170);a++){const cx=3+rr()*(MW-6),cy=3+rr()*(MH-6);if(!free(cx,cy))continue;const wet=near(Math.floor(cx),Math.floor(cy),45,2);clumps++;
     const n=3+((rr()*3)|0);for(let j=0;j<n;j++){const x=cx+(j?(rr()-.5)*2.4:0),y=cy+(j?(rr()-.5)*1.6:0);if(!free(x,y))continue;
       const q=rr(),k=wet?(q<.7?'reeds':'ferns'):q<.55?'ferns':q<.88?'brambles':'mushrooms';
       byK[k].push({x,y,f:rr()<.5,s:(k==='brambles'?.26:k==='reeds'?.28:k==='mushrooms'?.13:.22)*(.85+rr()*.3)});used.push({x,y})}}
   const pg=new THREE.PlaneGeometry(4,4).translate(0,1.875,0),Mx=new THREE.Matrix4(),Vv=new THREE.Vector3(),Qq=new THREE.Quaternion(),Ss=new THREE.Vector3();
   for(const k in byK){const L=byK[k];if(!L.length)continue;swayMat(frames[k].n);const im=new THREE.InstancedMesh(pg,frames[k].n,L.length);
     L.forEach((p,i)=>{Mx.compose(Vv.set(p.x,0,p.y),Qq,Ss.set((p.f?-1:1)*p.s,p.s*SQ,p.s));im.setMatrixAt(i,Mx)});im.castShadow=false;im.receiveShadow=false;im.frustumCulled=false;im.userData.propAsset=true;w.group.add(im)}
   w.plantCount=Object.values(byK).reduce((a,l)=>a+l.length,0);if(MAP1_PLANTS)plantLayout(w,MAP1_PLANTS)}
 }
 if(w.ch===2){
  const fr=[0,1,2,3].map(i=>procFrame(IMGS.br_props,...[[64,64],[96,64],[0,96],[32,96]][i],32,32,'prop'));
  const sites=[],geo=new THREE.PlaneGeometry(2,2).translate(0,.875,0); // runda 259: bez ognisk przy lawie (dawne obozowiska [[46,13],[53,16],[47,35]] usuniete)
  for(const [gx,gy]of sites)for(const [dx,dy,z]of [[0,0,.65],[1.1,.45,.43],[-.9,.65,.36]]){const x=MP(gx)+dx,y=MP(gy)+dy,ix=Math.floor(x),iy=Math.floor(y),i=iy*MW+ix;
   if(SOLID.has(tileAt(ix,iy))||VOID.has(tileAt(ix,iy))||w.clearways?.has(i)||w.groundPlan.road[i]||w.PROPS.some(p=>Math.hypot(p.x-x,p.y-y)<1)||w.npcs.some(n=>Math.hypot(n.x/TS-x,n.y/TS-y)<3))continue;
   const m=new THREE.Mesh(geo,fr[0].n);m.position.set(x,0,y);m.scale.set(z,z*SQ,z);m.userData.propAsset=true;m.castShadow=false;w.group.add(m);w.propObjs.push({mesh:m,frames:fr,fps:6,ph:groundHash(ix,iy)%10,kind:'static',artOnly:true});
  }
 }
}
function roofGeo(W,D,rise){const ax=W>=D,L=ax?W:D,T=ax?D:W,hT=T/2,sl=Math.hypot(rise,hT),P=[],U=[],C=[],vx=(a,b,y,u,v,c=1)=>{if(ax)P.push(a,y,b);else P.push(b,y,a);U.push(u/2.2,v/2.2);C.push(c,c,c)};
 // 12.11.2026: steeper gable with baked shading (sunlit south slope, dark north slope, darker eaves) and a ridge beam, so a roof reads as a roof, not as a floor
 for(const sg of[-1,1]){const lo=ax?(sg>0?.98:.46):(sg>0?1:.55),hi=ax?(sg>0?1.28:.68):(sg>0?1.2:.74),A=[-L/2,sg*hT,0,0,0,lo],B=[L/2,sg*hT,0,L,0,lo],Cc=[L/2,0,rise,L,sl,hi],E=[-L/2,0,rise,0,sl,hi];for(const q of[A,B,Cc,A,Cc,E])vx(...q)}
 for(const e of[-1,1]){vx(e*L/2,-hT,0,0,0,.5);vx(e*L/2,hT,0,T,0,.62);vx(e*L/2,0,rise,T/2,rise,.72)}
 {const rw=.11,ry=rise-rw*rise/hT+.03,rt=rise+.05;for(const sg of[-1,1]){const A=[-L/2,sg*rw,ry,0,0,.2],B=[L/2,sg*rw,ry,L,0,.2],Cc=[L/2,0,rt,L,.2,.3],E=[-L/2,0,rt,0,.2,.3];for(const q of[A,B,Cc,A,Cc,E])vx(...q)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(new Float32Array(P),3));g.setAttribute('uv',new THREE.BufferAttribute(new Float32Array(U),2));g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(C),3));g.computeVertexNormals();return g}
/* 23.11.2026 (runda 869, autor: domy z modeli w Osadzie wycofane, "ladne domy z obecnych tekstur"):
   spalone domy z kodu na prostokatach dachow: zweglona wiezba (kalenica, platwie, krokwie, czesc brakuje), resztki poszycia,
   slupy narozne, rama drzwi, zawalone belki w srodku. Wiezba i poszycie znikaja, gdy bohater jest w srodku (jak stary dach).
   Tekstury: wl_palecap (drewno), p1_roof_burnt (poszycie); BURNT_TEX pozwala podmienic na nowe (t2_belka, t3_poszycie). ?spalone=0 = stary dach. */
const BURNT_TEX={beam:null,roof:null};
/* 23.11.2026 (autor: sklep Margi ma wygladac jak sklep): daszek w pasy nad wejsciem na dwoch slupkach, szyld z czaszka na wysiegniku,
   lada z towarem za wejsciem, regal z towarem pod tylna sciana, skrzynie i beczki przy scianie, latarnie pod daszkiem. Bez kolizji (tylko oprawa). */
function margaShop(r,wall,put,box,acc,mesh){
 const fy=r.y+r.h-1;let ox0=-1,ox1=-1;for(let x=r.x+1;x<r.x+r.w-1;x++)if(!wall.has(fy*MW+x)){if(ox0<0)ox0=x;ox1=x}
 if(ox0<0){ox0=Math.floor(r.x+r.w/2)-2;ox1=ox0+4}
 const z0=r.y+r.h,xa=ox0,xb=ox1+1,cx=(xa+xb)/2,span=xb-xa,zi=r.y+1.9;
 const cyl=new THREE.CylinderGeometry(.5,.5,1,10).toNonIndexed(),sph=new THREE.SphereGeometry(.5,10,7).toNonIndexed();
 const A={wood:acc(),dark:acc(),clA:acc(),clB:acc(),bone:acc(),glass:acc(),glassR:acc(),fl:acc(),gold:acc(),iron:acc(),lamp:acc()};
 // daszek: slupki, belka, pasy plotna od sciany do belki, falbana
 const zp=z0+1.45,hp=1.62,hw=1.98;
 for(const x of [xa+.12,xb-.12]){put(A.wood,box,x,hp/2,zp,.16,hp,.16);put(A.dark,box,x,.06,zp,.26,.12,.26)}
 put(A.wood,box,cx,hp+.05,zp,span+.1,.14,.14);
 const n=Math.max(4,Math.round(span/.5)),ln=Math.hypot(zp-z0,hw-hp),ang=Math.atan2(hw-hp,zp-z0);
 for(let i=0;i<n;i++){const x=xa+(i+.5)*span/n;put(i%2?A.clB:A.clA,box,x,(hw+hp)/2+.08,(z0+zp)/2,span/n+.005,.03,ln+.12,ang,0,0);
  put(i%2?A.clB:A.clA,box,x,hp-.04,zp+.08,span/n+.005,.22,.025)}
 // latarnie pod daszkiem
 for(const x of [cx-span*.3,cx+span*.3]){put(A.iron,cyl,x,hp-.2,zp-.08,.02,.36,.02);put(A.iron,box,x,hp-.4,zp-.08,.2,.04,.2);put(A.lamp,box,x,hp-.56,zp-.08,.16,.26,.16);put(A.iron,box,x,hp-.71,zp-.08,.2,.04,.2)}
 // szyld na wysiegniku przy prawym slupku: deska z czaszka i skrzyzowanymi koscmi
 const sx=xb+.55,sy=1.3;put(A.iron,box,xb+.3,hp-.02,zp,.75,.05,.05);for(const d of [-.28,.28])put(A.iron,cyl,sx+d,hp-.15,zp,.015,.26,.015);
 put(A.dark,box,sx,sy-.02,zp,.86,.5,.06);put(A.wood,box,sx,sy,zp+.01,.76,.4,.06);
 put(A.bone,sph,sx,sy+.04,zp+.07,.17,.17,.1);put(A.dark,box,sx-.04,sy+.05,zp+.12,.04,.04,.02);put(A.dark,box,sx+.04,sy+.05,zp+.12,.04,.04,.02);
 for(const a of [.7,-.7])put(A.bone,cyl,sx,sy-.06,zp+.06,.025,.42,.025,0,0,a);
 // lada za wejsciem z towarem (uklad sprzed 879)
 const zc=z0-2.7,cl=Math.min(span+1,r.w-6);if(!r.shopU){put(A.wood,box,cx,.42,zc,cl,.84,.5);put(A.dark,box,cx,.87,zc,cl+.14,.06,.62);/* lada w glebi izby, z bocznymi ramionami do tylu */
 for(const sx of [-1,1]){put(A.wood,box,cx+sx*(cl/2-.25),.42,zc-.7,.5,.84,.9);put(A.dark,box,cx+sx*(cl/2-.25),.87,zc-.7,.62,.06,1.02)}}
 const goods=(px,pz,y,k)=>{if(k===0){put(A.bone,sph,px,y+.1,pz,.2,.18,.18);put(A.bone,box,px,y+.03,pz+.05,.1,.06,.08)}
  else if(k===1){put(A.glass,cyl,px,y+.13,pz,.14,.26,.14);put(A.dark,cyl,px,y+.28,pz,.09,.05,.09)}
  else if(k===2){put(A.glassR,sph,px,y+.08,pz,.15,.15,.15);put(A.dark,cyl,px,y+.18,pz,.04,.08,.04)}
  else if(k===3){for(let j=0;j<4;j++)put(A.gold,cyl,px+(j%2)*.03,y+.015+j*.03,pz,.12,.025,.12)}
  else if(k===4){put(A.bone,cyl,px,y+.05,pz,.04,.4,.04,0,0,Math.PI/2);put(A.bone,cyl,px+.05,y+.09,pz+.03,.035,.36,.035,0,.5,Math.PI/2)}
  else{put(A.bone,cyl,px,y+.1,pz,.05,.2,.05);put(A.fl,sph,px,y+.24,pz,.05,.08,.05)}};
 if(!r.shopU)for(let i=0;i<7;i++)goods(cx-cl/2+.35+i*(cl-.7)/6,zc+(i%2?.08:-.08),.9,[0,1,5,3,2,4,1][i]);
 // regal pod tylna sciana
 const rw=Math.min(6,r.w-5);for(const x of [cx-rw/2,cx+rw/2,cx])put(A.wood,box,x,.95,zi,.1,1.9,.38);
 for(const y of [.45,1.0,1.55])put(A.wood,box,cx,y,zi,rw+.1,.05,.42);
 let k=0;for(const y of [.47,1.02,1.57])for(let i=0;i<8;i++){const px=cx-rw/2+.4+i*(rw-.8)/7;if((i+k)%5===4)continue;goods(px,zi,y,(i*3+k)%6)}k++;
 // powiekszona izba: stoly z towarem po bokach regalu, beczki w rogach
 if(r.marga&&!r.shopU)for(const sx of [-1,1]){const tx=cx+sx*(rw/2+2.1),tz=r.y+3.0;put(A.wood,box,tx,.78,tz,1.6,.08,.9);for(const [a2,b2] of [[-.7,-.38],[.7,-.38],[-.7,.38],[.7,.38]])put(A.wood,box,tx+a2,.38,tz+b2,.08,.76,.08);
  for(let i=0;i<5;i++)goods(tx-.6+i*.3,tz+(i%2?.18:-.18),.82,(i*2+(sx>0?1:0))%6);if(!r.shopU){put(A.wood,cyl,r.x+1.7+(sx>0?r.w-3.4:0),.42,r.y+1.7,.6,.84,.6);put(A.iron,cyl,r.x+1.7+(sx>0?r.w-3.4:0),.69,r.y+1.7,.62,.05,.62)}}
 // skrzynie, beczki i kosz z koscmi przy scianie, z obu stron wejscia
 const crate=(x,z,s,rot)=>{put(A.wood,box,x,s/2,z,s,s,s,0,rot,0);put(A.dark,box,x,s+.01,z,s+.03,.03,.1,0,rot,0)};
 const barrel=(x,z)=>{put(A.wood,cyl,x,.42,z,.5,.84,.5);for(const y of [.15,.69])put(A.iron,cyl,x,y,z,.52,.05,.52)};
 crate(xa-.9,z0+.45,.6,.2);crate(xa-.85,z0+.45,.42,-.3);put(A.wood,box,xa-.85,.6+.21,z0+.45,.42,.42,.42,0,-.3,0);barrel(xa-1.7,z0+.5);
 barrel(xb+1.0,z0+.48);crate(xb+1.8,z0+.5,.55,.5);put(A.dark,cyl,xb+1.0,.86,z0+.48,.46,.04,.46);goods(xb+1.0,z0+.48,.88,0);goods(xb+.92,z0+.4,.88,4);
 if(r.shopU){/* 23.11.2026 (879, autor): lada w ksztalcie U przed regalem (Marga w srodku), regaly i szafki przy scianach, beczki i skrzynie w przednich rogach */
  const Q=r.shopU,zf=Q.cz+.45,zb=r.y+2.05,xl=Q.x0+.5,xr=Q.x1+.5,L=xr-xl+.6,lz=zf-zb,zm=(zb+zf)/2;
  put(A.wood,box,Q.cx,.42,zf,L,.84,.6);put(A.dark,box,Q.cx,.87,zf,L+.14,.06,.72);put(A.dark,box,Q.cx,.08,zf+.31,L,.16,.03);
  for(const ax of [xl,xr]){put(A.wood,box,ax,.42,zm,.6,.84,lz);put(A.dark,box,ax,.87,zm,.72,.06,lz+.12)}
  for(let i=0;i<9;i++)goods(xl+.35+i*(L-1.3)/8,zf+(i%2?.1:-.1),.9,[0,1,5,3,2,4,1,3,0][i]);
  for(const ax of [xl,xr])for(let i=0;i<2;i++)goods(ax+(i?.08:-.08),zb+.5+i*.7,.9,(i+(ax>Q.cx?2:4))%6);
  const wallShelf=(xw,dir,za,zb2)=>{const Ls=zb2-za,zs=(za+zb2)/2,xf=xw+dir*.23;for(const z of [za,zb2,zs])put(A.wood,box,xf,.95,z,.44,1.9,.1);put(A.dark,box,xw+dir*.03,.95,zs,.05,1.9,Ls);
   for(const y of [.45,1.0,1.55])put(A.wood,box,xf,y,zs,.48,.05,Ls+.1);let q=0;for(const y of [.47,1.02,1.57]){for(let i=0;i<5;i++){if((i+q)%4===3)continue;goods(xf,za+.3+i*(Ls-.6)/4,y,(i*2+q+(dir>0?1:3))%6)}q++}};
  const zs0=Q.cz+.1,zs1=Math.min(Q.cz+2.9,r.y+r.h-3.1);if(zs1-zs0>1)for(const [xw,dir] of [[r.x+1,1],[r.x+r.w-1,-1]])wallShelf(xw,dir,zs0,zs1);
  const cab=(x,z,w)=>{put(A.wood,box,x,.5,z,w,1.0,.5);put(A.dark,box,x,1.02,z,w+.1,.05,.58);put(A.dark,box,x,.5,z+.26,.03,.9,.02);
   for(let i=0;i<4;i++)goods(x-w/2+.25+i*(w-.5)/3,z,1.05,[1,2,1,5][i]);put(A.wood,box,x,1.65,z-.1,w,.05,.3);for(let i=0;i<3;i++)goods(x-w/2+.35+i*(w-.7)/2,z-.1,1.68,[0,3,0][i])};
  cab(r.x+2.05,r.y+1.3,1.8);cab(r.x+r.w-2.05,r.y+1.3,1.8);
  const fz=r.y+r.h-2.0;barrel(r.x+1.6,fz);barrel(r.x+2.4,fz+.15);put(A.wood,cyl,r.x+1.65,.3,fz-.9,.55,.6,.55);goods(r.x+1.65,fz-.9,.6,4);goods(r.x+1.6,fz-.85,.62,0);
  crate(r.x+r.w-1.6,fz,.7,.15);crate(r.x+r.w-1.6,fz-.85,.55,-.2);put(A.wood,box,r.x+r.w-1.6,.7+.25,fz,.5,.5,.5,0,.4,0);barrel(r.x+r.w-2.5,fz+.1);goods(r.x+r.w-1.6,fz,1.2,3)}
 const M=(c,o)=>cutaway(phong(Object.assign({color:c},o||{})));
 const mats={wood:worldSurfN(cutaway(phong({color:0xe0d4c8})),'t2_belka',1.1,1),dark:M(0x4a3c32),clA:new THREE.MeshBasicMaterial({color:0x5a1c16,side:THREE.DoubleSide}),clB:new THREE.MeshBasicMaterial({color:0x6c6252,side:THREE.DoubleSide})/* plotno bez swiatla: swiatlo bohatera tuz nad daszkiem przepalalo kolory */,
  bone:M(0xd8cab0,{specular:0x222018,shininess:8}),glass:M(0x223a2c,{emissive:0x0e3a1c,specular:0x88aa99,shininess:60}),glassR:M(0x3a1414,{emissive:0x4a0e0a,specular:0xaa8888,shininess:60}),
  fl:phong({color:0xffe0a0,emissive:0xffa040}),gold:M(0xb89040,{emissive:0x2a1c06,specular:0x806020,shininess:30}),iron:M(0x2e2a28,{specular:0x222222,shininess:20}),lamp:phong({color:0xffd090,emissive:0xd07020})};
 for(const key in A)if(A[key].p.length)mesh(A[key],mats[key])}
function burntHouses(w){const rs=w.roofs,wall=new Set((w.walls||[]).filter(t=>t[2]===48).map(([x,y])=>y*MW+x));
 const wood=BURNT_TEX.beam||IMGS.wl_palecap||IMGS.wl_chata,roofIm=BURNT_TEX.roof||IMGS.p1_roof_burnt||IMGS.wl_chata;
 const NT=typeof OSADA_TX!=='undefined',postM=NT?worldSurfN(cutaway(phong({color:0xe8dcd0})),'t2_belka',1.3,1.9,3):worldSurf(cutaway(phong({color:0x8c7868})),wood,1.3,'a');
 const box=new THREE.BoxGeometry(1,1,1).toNonIndexed(),M=new THREE.Matrix4(),Q=new THREE.Quaternion(),E=new THREE.Euler(),Vs=new THREE.Vector3(),Vp=new THREE.Vector3();
 const acc=w=>({p:[],n:[],u:w?[]:null,s:w?[]:null}),put=(a,geo,px,py,pz,sx,sy,sz,rx,ry,rz)=>{E.set(rx||0,ry||0,rz||0);Q.setFromEuler(E);M.compose(Vp.set(px,py,pz),Q,Vs.set(sx,sy,sz));
   const g=geo.clone().applyMatrix4(M),P=g.attributes.position.array,N=g.attributes.normal.array;for(let i=0;i<P.length;i++){a.p.push(P[i]);a.n.push(N[i])}
   if(a.u){const U=g.attributes.uv.array,k=Math.sin(px*12.9898+pz*78.233+py*4.1)*43758.5453,sd=.01+.98*(k-Math.floor(k));for(let i=0;i<U.length;i++)a.u.push(U[i]);for(let i=0;i<P.length/3;i++)a.s.push(sd)}g.dispose()};
 const mesh=(a,mat)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(a.n,3));if(a.u&&a.u.length){g.setAttribute('uv',new THREE.Float32BufferAttribute(a.u,2));g.setAttribute('nbSeed',new THREE.Float32BufferAttribute(a.s,1))}const m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;w.group.add(m);return m};
 const holes=acc(1),glow=acc(1),spillA=acc(1),plane=new THREE.PlaneGeometry(1,1).toNonIndexed(),chim=acc(),cyl=new THREE.CylinderGeometry(.5,.5,1,8).toNonIndexed(),posts=acc(),floors=acc(),margaR=rs.find(r=>r.marga)||rs.reduce((b,r)=>(!b||r.w/r.h>b.w/b.h)?r:b,null);
 for(const r of rs){if(r.chata)continue;const h=(i=>{const x=Math.sin((r.x*12.9898+r.y*78.233+i*37.7))*43758.5453;return x-Math.floor(x)});let hi=0;const rnd=()=>h(hi++);
  const marga=r===margaR&&(r.marga||r.w/r.h>1.6);
  const alongX=r.w>=r.h,L=alongX?r.w:r.h,D=alongX?r.h:r.w,cx=r.x+r.w/2,cz=r.y+r.h/2,eave=NT&&nbParam('osada2')!=='0'?2.4:1.9,rise=Math.min(2.3,D*.34),ov=.35,half=D/2+ov,slope=Math.atan2(rise,half),sl=Math.hypot(half,rise);
  // dla osi wzdluz Z zamieniamy x<->z przy skladaniu
  const P=(a,u,y,v,su,sy,sv,rU,rY,rV)=>alongX?put(a,box,cx+u,y,cz+v,su,sy,sv,rV||0,rY||0,rU||0):put(a,box,cx+v,y,cz+u,sv,sy,su,rU||0,rY||0,-(rV||0));
  const roof=acc(),wood_=acc();
  // kalenica (czasem przelamana) i platwie na scianach
  const ridgeBreak=null,burn=marga?'t6_dachowka':['t3a_poszycie_lekkie','t3_poszycie','t3c_poszycie_ciezkie'][Math.floor(rnd()*3)];
  if(ridgeBreak===null)P(wood_,0,eave+rise,0,L+.5,.24,.24);else{const a=(L+.5)/2+ridgeBreak;P(wood_,-(L+.5)/2+a/2,eave+rise,0,a-.3,.24,.24);P(wood_,(L+.5)/2-((L+.5)-a)/2+.2,eave+rise-.45,0,(L+.5)-a-.6,.22,.22,0,0,.0)}
  for(const s of [-1,1])P(wood_,0,eave+.08,s*(D/2-.15),L+.3,.2,.26);
  // krokwie co ok. 1.15, czesc brakuje, czesc skrocona
  const n=Math.max(3,Math.round(L/1.15));for(let i=0;i<=n;i++){const u=-L/2+.2+i*(L-.4)/n;for(const s of [-1,1]){const k=marga?1:rnd();if(k<.08)continue;const len=sl,mid=len/2;
    // od okapu w gore
    const vy=eave+Math.sin(slope)*mid,vv=s*(half-Math.cos(slope)*mid);P(wood_,u,vy,vv,.17,.17,len,0,0,s*slope)}}
  // resztki poszycia: odcinki wzdluz kalenicy, na obu polaciach osobno, ok. 40% zostaje (przy szczytach czesciej)
  /* 23.11.2026 (autor): pelne polacie bez przerw; dziury tylko z tekstury wypalonych gontow (lekko/srednio/mocno spalone) */
  for(const s of [-1,1]){const mid=sl/2,vy=eave+Math.sin(slope)*mid+.1,vv=s*(half-Math.cos(slope)*mid);P(roof,0,vy,vv,L+.5,.05,sl,0,0,s*slope)}
  // zawalone belki w srodku
  if(!marga)for(let i=0;i<2+(rnd()<.5?1:0);i++){const len=1.6+rnd()*2.2,u=(rnd()-.5)*(L-2.5),v=(rnd()-.5)*(D-2.5);P(wood_,u,.22+rnd()*.25,v,len,.2,.2,0,(rnd()-.5)*2.4,(rnd()-.5)*.35)}
  // podloga z desek pod popiolem (wnetrze bez scian)
  if(NT&&!marga)put(floors,box,cx,.012,cz,r.w-2,.02,r.h-2);
  // slupy narozne (wyzsze od scian, zweglone szczyty) i rama drzwi
  for(const [ux,vz] of [[-1,-1],[1,-1],[-1,1],[1,1]])P(posts,ux*(L/2-.2),(eave+.4)/2+rnd()*.15,vz*(D/2-.2),.34,eave+.4+rnd()*.3,.34);
  for(const yy of [r.y,r.y+r.h-1]){let a=-1;for(let x=r.x;x<=r.x+r.w;x++){const open=x<r.x+r.w&&!wall.has(yy*MW+x)&&wall.has(yy*MW+r.x)===true||false;const isOpen=x<r.x+r.w&&!wall.has(yy*MW+x);
    if(isOpen&&a<0)a=x;if((!isOpen||x===r.x+r.w)&&a>=0){const b=x;if(b-a>=2&&b-a<=6&&a>r.x&&b<r.x+r.w){const zz=yy+.5;for(const xx of [a,b])put(posts,box,xx,(eave-.3)/2,zz,.26,eave-.3,.32);if(rnd()<.7)put(posts,box,(a+b)/2,eave-.35,zz,b-a+.5,.24,.3)}a=-1}}}
  /* 23.11.2026 (autor: domy Osady w nowym standardzie): okna z ramami i okiennicami w pelnych odcinkach scian, wystajace konce bali na narozach, murowane kominy */
  if(NT&&nbParam('osada2')!=='0'){const full=(x,y)=>{if(marga)return true;const k=Math.sin(x*12.9898+y*78.233)*43758.5453,f=k-Math.floor(k);return f>=(eave>2?.25:.38)};
   const sides=[{n:r.w,at:i=>[r.x+i,r.y],face:(i)=>[r.x+i+.5,r.y-.03],ry:0,out:-1},{n:r.w,at:i=>[r.x+i,r.y+r.h-1],face:i=>[r.x+i+.5,r.y+r.h+.03],ry:0,out:1},
    {n:r.h,at:i=>[r.x,r.y+i],face:i=>[r.x-.03,r.y+i+.5],ry:Math.PI/2,out:-1},{n:r.h,at:i=>[r.x+r.w-1,r.y+i],face:i=>[r.x+r.w+.03,r.y+i+.5],ry:Math.PI/2,out:1}];
   for(const S of sides){let run=0;for(let i=2;i<S.n-2;i++){const [tx,ty]=S.at(i),ok=wall.has(ty*MW+tx)&&full(tx,ty);run=ok?run+1:0;if(!ok||run%3!==2)continue;
     const [px,pz]=S.face(i),a=S.ry,ax=Math.cos(a),az=-Math.sin(a),o=S.out,ox=S.ry?o:0,oz=S.ry?0:o,y=eave*.56;
     put(holes,box,px,y,pz,.62,.56,.06,0,a,0);if(rnd()<.35){put(glow,box,px-ox*.02,y,pz-oz*.02,.5,.44,.04,0,a,0);if(NB_WIN)put(spillA,plane,px+ox*.1,y-.12,pz+oz*.1,1.45,1.25,1,0,a,0)}
     for(const sy of [-1,1])put(posts,box,px+ox*.03,y+sy*.33,pz+oz*.03,.86,.1,.14,0,a,0);for(const sx of [-1,1])put(posts,box,px+ax*sx*.38+ox*.03,y,pz+az*sx*.38+oz*.03,.1,.76,.14,0,a,0);
     if(rnd()<.75){const sx=rnd()<.5?-1:1,hang=rnd()<.3;put(posts,box,px+ax*sx*.62+ox*.12,y-(hang?.12:0),pz+az*sx*.62+oz*.12,.3,.62,.04,0,a+sx*o*(hang?.5:1.2),hang?sx*.4:0)}}}
   for(const [cx0,cz0,sx,sz] of [[r.x,r.y,-1,-1],[r.x+r.w,r.y,1,-1],[r.x,r.y+r.h,-1,1],[r.x+r.w,r.y+r.h,1,1]])for(let i=0;i<(eave>2?8:6);i++){const y=.6+i*.22;
     if(i%2)put(posts,cyl,cx0+sx*.16,y,cz0-sz*.5,.24,.62,.24,0,0,Math.PI/2);else put(posts,cyl,cx0-sx*.5,y,cz0+sz*.16,.24,.62,.24,Math.PI/2,0,0)}
   if(!marga&&rnd()<.6){const east=rnd()<.5,tx=east?r.x+r.w-1:r.x,ty=r.y+Math.floor(r.h/2);if(wall.has(ty*MW+tx)){const H=eave+rise+.9;put(chim,box,tx+.5,H/2,ty+.5,1.0,H,1.0);put(chim,box,tx+.5,H+.08,ty+.5,1.2,.16,1.2);put(holes,box,tx+.5,H+.17,ty+.5,.55,.04,.55)}}}
  const fadeR=phong({color:0xffffff,transparent:true,opacity:1,side:THREE.DoubleSide,alphaTest:marga?0:.5});
  const roofM=NT?worldSurfN(fadeR,burn,marga?2.6:3.6,1.8,3):worldSurf(fadeR,wood,.9,'a');roofM.color.setHex(NT?(marga?0xf0e4dc:0xfff4ec):0x9a8474);/* poszycie: gonty z dziurami, dom Margi: dachowka */
  const woodM=NT?worldSurfN(phong({color:0xe8dcd0,transparent:true,opacity:1}),'t2_belka',1.3,1.2):worldSurf(phong({color:0x8c7868,transparent:true,opacity:1}),wood,1.3,'a');
  const g=new THREE.Group();g.add(mesh(wood_,woodM));if(roof.p.length)g.add(mesh(roof,roofM));w.group.add(g);
  r.mats=[woodM,roofM];r.mesh=g;r.a=1}
 if(margaR&&(margaR.marga||margaR.w/margaR.h>1.6)&&NT&&nbParam('sklep')!=='0')margaShop(margaR,wall,put,box,acc,mesh);// 23.11.2026 (autor: sklep bardziej sklepowy)
 if(holes.p.length)mesh(holes,winGlass(cutaway(phong({color:0x0e0b09})),0,2));if(glow.p.length)mesh(glow,winGlass(phong({color:0x1a0a04,emissive:0x5a1c06}),1,2));if(spillA.p.length)mesh(spillA,winSpillMat()).castShadow=false;if(chim.p.length)mesh(chim,worldSurfN(cutaway(phong({color:0xb8aca4})),'t4_podmurowka',1.6,1.9,3));
 if(posts.p.length)mesh(posts,postM);if(floors.p.length){const f=mesh(floors,worldSurfN(phong({color:0x8c847c}),'t5_podloga',2.6,1.1));f.castShadow=false}}
function buildRoofs(w){if(!w.roofs||!w.group)return;if(w.ch===1&&IMGS.wl_palecap&&nbParam('spalone')!=='0'){burntHouses(w);return}const rm=[];
 for(const r of w.roofs){if(r.tri||r.mesh)continue;/* 23.11.2026: dom z modelu ma wlasny dach */const W=r.w+.7,D=r.h+.7,rise=Math.min(2.1,Math.min(r.w,r.h)*.3);
  const m=new THREE.Mesh(roofGeo(W,D,rise),new THREE.MeshLambertMaterial({color:0x4a382c,transparent:true,opacity:1,side:THREE.DoubleSide,vertexColors:true}));
  m.position.set(r.x+r.w/2,1.9,r.y+r.h/2);m.castShadow=false;m.receiveShadow=false;m.renderOrder=3;w.group.add(m);r.mesh=m;r.a=1;rm.push(r)}
 roofImg(im=>{const hdIm=CH===1?(IMGS.p1_roof_burnt||IMGS.rf_lupek):null;if(hdIm)im=hdIm;const hd=!!hdIm;const t=new THREE.Texture(im);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=hd?8:4;t.needsUpdate=true;for(const r of rm){r.mesh.material.map=t;if(hd&&CH===1)r.mesh.material.color.setRGB(2.15,1.9,1.7);/* 22.11.2026: tekstura zgliszczy srednio 34/255 = czarna plyta; rozjasnienie ok. 2x, cieply odcien */else r.mesh.material.color.setHex(hd?0xe4d4c8:0xd8c8bc);r.mesh.material.needsUpdate=true}})}
const ROOF_PNG='./assets/tekstury/517905a0e4feadfa5ba42b536be2720a1d736e68e81eba922eedcc53d16acee0.png';let _roofIm=null,_roofCbs=[];function roofImg(cb){if(_roofIm&&_roofIm.complete&&_roofIm.naturalWidth){cb(_roofIm);return}_roofCbs.push(cb);if(_roofIm)return;_roofIm=new Image();_roofIm.onload=()=>{const l=_roofCbs;_roofCbs=[];for(const f of l)f(_roofIm)};_roofIm.src=ROOF_PNG}
let roofT=0;
function roofTick(){const rs=W&&W.roofs;if(!rs||!S)return;const ps=[pl1||pl,pl2].filter(p=>p&&!p.dead),dt=Math.min(.1,Math.max(0,clock-roofT));roofT=clock;
 for(const r of rs){if(!r.mesh)continue;let inside=false;const pd=r.pad||.3;for(const p of ps){const tx=p.x/16,ty=p.y/16;if(tx>r.x-pd&&tx<r.x+r.w+pd&&ty>r.y-pd&&ty<r.y+r.h+pd){inside=true;break}}
  r.a+=((inside?0:1)-r.a)*Math.min(1,dt*7);if(r.mats)for(const m of r.mats)m.opacity=r.a;else r.mesh.material.opacity=r.a;r.mesh.visible=r.a>.02}}

// Ciemna ziemia za krawedzia mapy zamiast pustego tla (rozdzial I, ?depth=0 wylacza).
function depthApron(w){const m=new THREE.Mesh(new THREE.PlaneGeometry(MW+260,MH+260).rotateX(-Math.PI/2),new THREE.MeshLambertMaterial({color:depthOn(w.ch)[6]}));m.position.set(MW/2,-9.8,MH/2);m.castShadow=false;m.receiveShadow=false;m.userData.depthApron=true;w.group.add(m)}
function softenProps(w){// 12.11.2026: Akt I - rekwizyty bez twardego cienia z swiatla bohatera i lekko sciemnione do koloru ziemi (?softprops=0 = przed)
 if(nbParam('softprops')==='0')return;const seen=new Set(),tint=new THREE.Color(.76,.77,.8);
 w.group.traverse(o=>{if(!o.userData||!o.userData.propAsset)return;o.castShadow=false;const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms){if(!m||seen.has(m)||!m.color||m.userData.noSoften)continue;seen.add(m);m.color.multiply(tint);if(m.emissiveMap&&m.emissive&&m.emissiveIntensity>0)m.emissiveIntensity*=.72}})}
function finishWorldArt(w){if(depthOn(w.ch))depthApron(w);buildRoofs(w);preparePowerFires(w);if(w.ch!==PORT)composeWorldProps(w);paint3dFinish(w);dressSettlementsHD(w);dressNeutral(w);settleWorldProps(w);if(w.ch===1&&depthOn(1))softenProps(w);const flat=new Set(['dwarf_bones','covered_corpses','beggar_bodies','doorway_bones','wheel','burnt_hay','cz_bones','cz_pelts','cz_walk','cz_wisp','cz_crow','mushrooms','ferns','brambles','reeds','wd0','sp0','wd1','sp1','wd2','sp2','wd3','sp3','wd4','sp4','wd5','sp5','wd6','sp6','wd7','sp7','wd8','sp8','wd9','sp9','wd10','sp10','wd11','sp11','scroll','book','pages','keys','seal','purse','shackles','skull']);
  const props=w.PROPS.filter(p=>!flat.has(p.k)&&!VOID.has(tileAt(Math.floor(p.x),Math.floor(p.y-.2))));
  w.groundShadows=instanced(groundFxGeo,groundShadowMat,props,p=>{const m=p.obj&&p.obj.mesh,s=p.k==='sacred_oak'?2.2:p.tree?.8:(!m&&p.port&&PORT_PROP_SIZE[p.k])?Math.min(2,PORT_PROP_SIZE[p.k][0]*.62):m?Math.min(2,Math.max(.3,m.geometry.parameters.width*Math.abs(m.scale.x)*.5)):.65;return M4.compose(V.set(p.x,.024,p.y-.1),Q.identity(),SC.set(s*1.1,1,s*.6))},false,false);
  const lights=w.LSRC.filter(l=>['fire','shrine','rune','npc','stone','merchant'].includes(l.kind)&&l.base>0&&[-1,0,1].every(dy=>[-1,0,1].every(dx=>!VOID.has(tileAt(Math.floor(l.x)+dx,Math.floor(l.z)+dy))))).slice(0,48);w.groundL=lights;
  w.groundLights=instanced(groundFxGeo,groundGlowMat,lights,l=>{const s=l.kind==='fire'?3.5:l.kind==='shrine'?3:2.2;return M4.compose(V.set(l.x,.028,l.z),Q.identity(),SC.set(s,1,s*.7))},false,false);
  lights.forEach((l,i)=>w.groundLights.setColorAt(i,new THREE.Color(l.col)));w.groundLights.instanceColor&&(w.groundLights.instanceColor.needsUpdate=true);
  if(!haloGeo)haloGeo=new THREE.PlaneGeometry(1,1).rotateX(-PITCH);
  const hl=w.LSRC.filter(l=>HALO_KINDS.includes(l.kind)&&l.base>0&&l.y>.3).slice(0,64);w.haloL=hl;
  const hsz=l=>Math.max(2.4,1.5+l.dist*.55);
  w.halos=instanced(haloGeo,haloMat,hl,l=>{const s=hsz(l);return M4.compose(V.set(l.x,l.y,l.z),Q.identity(),SC.set(s,s,1))},false,false);
  w.cores=instanced(haloGeo,coreMat,hl,l=>{const s=hsz(l)*.38;return M4.compose(V.set(l.x,l.y,l.z),Q.identity(),SC.set(s,s,1))},false,false);
  for(const m of [w.halos,w.cores]){m.frustumCulled=false;m.renderOrder=40;hl.forEach((l,i)=>m.setColorAt(i,new THREE.Color(l.col)))}
  applySurfaceQuality(w);
}
function applySurfaceQuality(w){const seen=new Set();w.group.traverse(o=>{for(const m of [].concat(o.material||[])){if(m.groundLite)m.groundLite.value=SETT.quality==='low'?1:0;if(seen.has(m)||!m.userData.surfaceDetail)continue;seen.add(m);const map=SETT.quality==='low'?null:m.userData.surfaceDetail;if(m.bumpMap!==map){m.bumpMap=map;m.needsUpdate=true}const tex=m.userData.surfaceDetail,aniso=Math.min(GFX.aniso,renderer.capabilities.getMaxAnisotropy());if(tex.anisotropy!==aniso){tex.anisotropy=aniso;tex.needsUpdate=true}}})}
function floorAO(fg,solidish){for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){const t=tileAt(tx,ty);if(VOID.has(t)||t===21||t===45)continue;
  let o=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const n=tileAt(tx+dx,ty+dy);if(WALLC.has(n))o+=dx&&dy?.5:1;else if(solidish.has(n))o+=dx&&dy?.25:.5}
  if(o>0){fg.fillStyle=`rgba(4,3,6,${Math.min(.35,o*.07)})`;fg.fillRect(tx*16,ty*16,16,16)}
  if(WALLC.has(tileAt(tx,ty-1))){const shade=fg.createLinearGradient(0,ty*16,0,ty*16+12);shade.addColorStop(0,'rgba(4,3,6,.32)');shade.addColorStop(1,'rgba(4,3,6,0)');fg.fillStyle=shade;fg.fillRect(tx*16,ty*16,16,12)}}}
function decals(I){const dec=row=>[0,1,2,3].map(i=>{const cv=canvas(32,32);cv.getContext('2d').drawImage(I.decals,i*32,row*32,32,32,0,0,32,32);return cv});
  DEC.pool=dec(0);DEC.spray=dec(1);DEC.scorch=dec(2);DEC.crack=dec(3);DEC.bones=dec(5)}


