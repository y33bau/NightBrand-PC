// Shared sheets keep identical proportions in the village, city, forge and crypt.
const HUMAN_PROP_SCALE={chapel_stairs:1.5,dead_tree:1.02,impaled_head:.65,grave_cross:.7,tombstone:.7,well:.65,shrine:.75,gallows:1.25,
  debris_fire:.55,order_bonfire:.75,wheel:.6,barrel:.5,marga_cart:.9,crow_post:.75,covered_corpses:.6,order_banner:.8,burnt_hay:.5,dead_horse:1.1,
  king_statue:.88,anvil:.48,mine_cart:.72,pickaxe_rack:.85,healing_shrine:.8,chains:.6,fallen_pillar:.85,dwarf_bones:.6,bellows:.55,furnace:.85,sarcophagus:.9,rune_lantern:.75,black_powder:.48,clan_banner:1.37,
  queen_fountain:1.3,street_lantern:1.3,noble_door:1.2,saint_king:.8,cathedral_gate:1.3,beggar_bodies:.65,plague_cart:1.25,noble_carriage:1.4,gibbet:1.3,pyre:.8,rot_bloom:.45,royal_banner:1.3,offering_bowl:.5,broken_bell:.55,doorway_bones:.9,
  cz_fire:.65,cz_idol:1.2,cz_skullpole:.7,cz_shrine:.8,cz_wagon:1.1,cz_cauldron:.45,cz_firewood:.4,cz_gallows:1.6,cz_sacpole:1.3,cz_beehive:.5,cz_wheel:.55,cz_wisp:.45,cz_crow:.35,cz_walk:1.6,cz_tent:1.4,cz_pelts:.45,cz_bones:.3};
// Runda 259: rozdz. I - skala wg wzrostu bohatera (180 cm = ok. 1,44 j.; 1 j. = ok. 125 cm). Wartosci dla nowych rekwizytow HD (p1_*).
const HUMAN_PROP_SCALE_1={house_fire:.5,shop_sign:.9,crypt_stairs:.75,dead_tree:1.6,impaled_head:1.1,grave_cross:.6,tombstone:.55,well:.8,stocks:.81,shrine:.8,gallows:1.67,wheel:.6,barrel:.5,marga_cart:1.15,crow_post:1.04,covered_corpses:.8,order_banner:1.4,burnt_hay:.8,dead_horse:1};
function fitWorldProps(w,ch){if(ch===5)return;const assigned=new Set();
  for(const p of w.PROPS){const s=(ch===1&&HUMAN_PROP_SCALE_1[p.k]!==undefined)?HUMAN_PROP_SCALE_1[p.k]:HUMAN_PROP_SCALE[p.k];if(s===undefined)continue;const o=p.obj||w.propObjs.find(o=>Math.abs(o.mesh.position.x-p.x)<.001&&Math.abs(o.mesh.position.z-p.y)<.001);if(!o)continue;
    o.mesh.scale.set(s,s*SQ,s);p.obj=o;assigned.add(o);if(['wheel','burnt_hay','covered_corpses','dwarf_bones','beggar_bodies','doorway_bones','cz_pelts','cz_bones'].includes(p.k))o.mesh.castShadow=false}
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
function propFoot(image){if(PROP_FEET.has(image))return PROP_FEET.get(image);if(!image.getContext)return null;const W=image.width,H=image.height,d=image.getContext('2d').getImageData(0,0,W,H).data;let bottom=-1,top=-1;const w=new Float32Array(H);for(let y=0;y<H;y++){let c=0;for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>=128)c++;w[y]=c;if(c){bottom=y;if(top<0)top=y}}
 let foot=bottom<0?null:(bottom+1)/H;if(foot!==null)PROP_RAWB.set(image,{b:foot,t:top/H});
 // runda 301: rekwizyt z okragla podstawa (kopczyk, cokol, tarcza ziemi) stoi srodkiem podstawy na ziemi, nie jej przednia krawedzia: kotwica w najszerszym wierszu dolnych 22% (cien i styk z podlozem wypadaja u pnia); korpus musi byc wyraznie wezszy od podstawy
 if(foot!==null){const lo=Math.max(top,bottom-Math.floor(.22*H));if(bottom-lo>=12){let pr=lo;for(let y=lo;y<=bottom;y++)if(w[y]>w[pr])pr=y;const dd=bottom-pr;let mn=1e9;for(let y=Math.max(top,pr-Math.floor(.3*H));y<=Math.max(top+1,pr-Math.floor(.04*H));y++)if(w[y]>0&&w[y]<mn)mn=w[y];
  if(dd>=H*.02&&mn<1e9&&w[pr]>=1.8*mn)foot-=Math.min(.16,Math.round(dd/H/.02)*.02)+.01}}
 PROP_FEET.set(image,foot);return foot}
function settleProp(m){const g=m.geometry;if(!g.boundingBox)g.computeBoundingBox();const box=g.boundingBox,height=box.max.y-box.min.y,foot=propFoot(m.material.map.image);if(height<.3||foot===null)return;const local=box.max.y-foot*height,before=m.position.y+local*m.scale.y;const lift=PROP_LIFT;m.position.y=.018+lift-local*m.scale.y;m.userData.groundContact={before,after:.018+lift};if(height*m.scale.y<1.5)m.castShadow=false;
  {const sp0=propBase(m.material.map.image);if(sp0&&height*m.scale.y>=.5&&sp0.w*(box.max.x-box.min.x)*m.scale.x<=2.8)baseFade(m.material,sp0.vb,sp0.fh)}
  // miekki cien kontaktowy pod stopa: styka rekwizyt z podlozem zamiast ostrej krawedzi sprite'a
  if(!m.userData.decal&&!m.userData.noDecal&&height*m.scale.y>=.5){const img=m.material.map.image,sp=propBase(img);if(sp&&sp.w*(box.max.x-box.min.x)*m.scale.x<=2.8){const gw=box.max.x-box.min.x,d=new THREE.Mesh(PLANE1,decalMat());d.rotation.x=-Math.PI/2;d.position.set((sp.cx-.5)*gw,local-(.006+lift)/m.scale.y,0);const sx=Math.min(2.6,Math.max(.5,sp.w*gw*1.3));d.scale.set(sx/m.scale.x,sx*.5/Math.max(.01,m.scale.z),1);d.castShadow=false;d.receiveShadow=false;d.renderOrder=-1;d.userData.decalMesh=true;m.add(d);m.userData.decal=d}}}
// rozmyty (dithering) dol sprite'a: rekwizyt przechodzi w podloze zamiast konczyc sie ostra, pozioma krawedzia
function baseFade(mat,vb,fh){if(mat.userData.pf)return;mat.userData.pf=1;const prev=mat.onBeforeCompile,pk=mat.customProgramCacheKey?mat.customProgramCacheKey():'';
 mat.onBeforeCompile=(sh,r)=>{if(prev)prev(sh,r);sh.uniforms.uPf={value:new THREE.Vector2(vb,fh)};
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying float vPy;').replace('#include <begin_vertex>','#include <begin_vertex>\nvPy=uv.y;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vPy;uniform vec2 uPf;').replace('void main() {','void main() {\nif(vPy<uPf.x+uPf.y){float f=clamp((vPy-uPf.x)/uPf.y,0.0,1.0);float n=fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))));if(f<n)discard;}')};
 mat.customProgramCacheKey=()=>pk+'|pf';mat.needsUpdate=true}
const PROP_LIFT=.085,PLANE1=new THREE.PlaneGeometry(1,1),PROP_BASE=new WeakMap();let DECAL_MAT=null;
function decalMat(){if(DECAL_MAT)return DECAL_MAT;const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),r=g.createRadialGradient(32,32,2,32,32,32);r.addColorStop(0,'rgba(0,0,0,.62)');r.addColorStop(.55,'rgba(0,0,0,.3)');r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64);const t=new THREE.CanvasTexture(c);DECAL_MAT=new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,opacity:.8,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});return DECAL_MAT}
// szerokosc i srodek podstawy: dolne 16% widocznej tresci obrazu
function propBase(image){if(PROP_BASE.has(image))return PROP_BASE.get(image);let res=null;if(image&&image.getContext){const W=image.width,H=image.height,d=image.getContext('2d').getImageData(0,0,W,H).data;let bottom=-1,top=-1;for(let y=0;y<H;y++){let any=false;for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>=128){any=true;break}if(any){bottom=y;if(top<0)top=y}}
 if(bottom>=0){const lo=Math.max(top,bottom-Math.max(2,Math.floor((bottom-top)*.16)));let x0=W,x1=-1;for(let y=lo;y<=bottom;y++)for(let x=0;x<W;x++)if(d[(y*W+x)*4+3]>=128){if(x<x0)x0=x;if(x>x1)x1=x}if(x1>=0)res={w:(x1-x0+1)/W,cx:(x0+x1+1)/2/W,vb:1-(bottom+1)/H,fh:Math.max(3,(bottom-top+1)*.09)/H}}}
PROP_BASE.set(image,res);return res}
function settleWorldProps(w){const assets=new Set(w.propObjs.map(o=>o.mesh)),suspended=new Set();for(const p of w.PROPS){if(p.obj)assets.add(p.obj.mesh);if(/wisp|crow|raven|torch|chains|banner|sacpole/.test(p.k)||p.anim==='wisp'){const o=p.obj||w.propObjs.find(o=>Math.abs(o.mesh.position.x-p.x)<.001&&Math.abs(o.mesh.position.z-p.y)<.001);if(o)suspended.add(o.mesh)}}
  w.group.traverse(m=>{if((!assets.has(m)&&!m.userData.propAsset)||!m.isMesh||m.isInstancedMesh||suspended.has(m)||!m.geometry||m.geometry.type!=='PlaneGeometry'||!m.material||Array.isArray(m.material)||!m.material.map||m.material.groundAtlas||Math.abs(m.rotation.x)>.2||Math.abs(m.rotation.z)>.2)return;settleProp(m)});
  // 9.11.2026: male i srednie rekwizyty (ogniska, sterty, wozy, kola, krzaki) staly dolnym wierszem pod podlozem i ziemia ucinala im spod; podnosimy je tak, by najnizszy nieprzezroczysty wiersz lezal tuz nad ziemia. Wysokie (drzewa, posagi) zostaja: ich glebsze osadzenie jest celowe.
  w.group.traverse(m=>{if(!m.isMesh||m.isInstancedMesh||!m.userData.propAsset||m.userData.groundContact||m.userData.lifted||suspended.has(m)||!m.geometry||m.geometry.type==='PlaneGeometry'||!m.material||Array.isArray(m.material)||!m.material.map||m.material.groundAtlas||Math.abs(m.rotation.x)>.05||Math.abs(m.rotation.z)>.05)return;const map=m.material.map;if(map.repeat.x!==1||map.repeat.y!==1||map.offset.y!==0)return;
   const g=m.geometry;if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox,h=(bb.max.y-bb.min.y)*m.scale.y;const R=PROP_RAWB.get(map.image)??(propFoot(map.image),PROP_RAWB.get(map.image));if(!R)return;const rb=R.b;if((rb-R.t)*h>5)return;
   const bw=m.position.y+(bb.min.y+(1-rb)*(bb.max.y-bb.min.y))*m.scale.y;if(bw>=.012||bw<-.7)return;m.position.y+=.012-bw;m.userData.lifted=.012-bw});
}
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
  for(const p of w.PROPS){if(p.k!=='dead_tree'||!p.obj)continue;const h=groundHash(Math.floor(p.x),Math.floor(p.y)),k=p.variant||['dead_oak','birch','spruce'][h%3],m=p.obj.mesh,vs=p.vscale||({spruce:1.08,birch:1}[k]||.82);m.geometry=treeGeo;m.material=frames[k].n;m.customDistanceMaterial=frames[k].d;m.scale.set(vs,vs*SQ,vs);p.obj.frames=[frames[k]];m.castShadow=true;}
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
   for(const [fx,fy] of (w.extraFerns||[])){byK.ferns.push({x:fx+.5,y:fy+.5,f:(fx+fy)%2===0,s:.22});used.push({x:fx+.5,y:fy+.5})} // runda 316: obwodka cmentarza z edytora
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
function buildRoofs(w){if(!w.roofs||!w.group)return;const rm=[];
 for(const r of w.roofs){const W=r.w+.7,D=r.h+.7,rise=Math.min(2.1,Math.min(r.w,r.h)*.3);
  const m=new THREE.Mesh(roofGeo(W,D,rise),new THREE.MeshLambertMaterial({color:0x4a382c,transparent:true,opacity:1,side:THREE.DoubleSide,vertexColors:true}));
  m.position.set(r.x+r.w/2,1.9,r.y+r.h/2);m.castShadow=false;m.receiveShadow=false;m.renderOrder=3;w.group.add(m);r.mesh=m;r.a=1;rm.push(r)}
 roofImg(im=>{if(CH===1&&IMGS.rf_lupek)im=IMGS.rf_lupek;const hd=im===IMGS.rf_lupek;const t=new THREE.Texture(im);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=hd?8:4;t.needsUpdate=true;for(const r of rm){r.mesh.material.map=t;r.mesh.material.color.setHex(hd?0xe4d4c8:0xd8c8bc);r.mesh.material.needsUpdate=true}})}
const ROOF_PNG='./assets/517905a0e4feadfa5ba42b536be2720a1d736e68e81eba922eedcc53d16acee0.png';let _roofIm=null,_roofCbs=[];function roofImg(cb){if(_roofIm&&_roofIm.complete&&_roofIm.naturalWidth){cb(_roofIm);return}_roofCbs.push(cb);if(_roofIm)return;_roofIm=new Image();_roofIm.onload=()=>{const l=_roofCbs;_roofCbs=[];for(const f of l)f(_roofIm)};_roofIm.src=ROOF_PNG}
let roofT=0;
function roofTick(){const rs=W&&W.roofs;if(!rs||!S)return;const ps=[pl1||pl,pl2].filter(p=>p&&!p.dead),dt=Math.min(.1,Math.max(0,clock-roofT));roofT=clock;
 for(const r of rs){if(!r.mesh)continue;let inside=false;for(const p of ps){const tx=p.x/16,ty=p.y/16;if(tx>r.x-.3&&tx<r.x+r.w+.3&&ty>r.y-.3&&ty<r.y+r.h+.3){inside=true;break}}
  r.a+=((inside?0:1)-r.a)*Math.min(1,dt*7);r.mesh.material.opacity=r.a;r.mesh.visible=r.a>.02}}

// Ciemna ziemia za krawedzia mapy zamiast pustego tla (rozdzial I, ?depth=0 wylacza).
function depthApron(w){const m=new THREE.Mesh(new THREE.PlaneGeometry(MW+260,MH+260).rotateX(-Math.PI/2),new THREE.MeshLambertMaterial({color:depthOn(w.ch)[6]}));m.position.set(MW/2,-9.8,MH/2);m.castShadow=false;m.receiveShadow=false;m.userData.depthApron=true;w.group.add(m)}
function softenProps(w){// 12.11.2026: Akt I - rekwizyty bez twardego cienia z swiatla bohatera i lekko sciemnione do koloru ziemi (?softprops=0 = przed)
 if(new URLSearchParams(location.search).get('softprops')==='0')return;const seen=new Set(),tint=new THREE.Color(.76,.77,.8);
 w.group.traverse(o=>{if(!o.userData||!o.userData.propAsset)return;o.castShadow=false;const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms){if(!m||seen.has(m)||!m.color||m.userData.noSoften)continue;seen.add(m);m.color.multiply(tint);if(m.emissiveMap&&m.emissive&&m.emissiveIntensity>0)m.emissiveIntensity*=.72}})}
function finishWorldArt(w){if(depthOn(w.ch))depthApron(w);buildRoofs(w);preparePowerFires(w);composeWorldProps(w);dressSettlementsHD(w);dressNeutral(w);settleWorldProps(w);if(w.ch===1&&depthOn(1))softenProps(w);const flat=new Set(['dwarf_bones','covered_corpses','beggar_bodies','doorway_bones','wheel','burnt_hay','cz_bones','cz_pelts','cz_walk','cz_wisp','cz_crow','mushrooms','ferns','brambles','reeds','wd0','sp0','wd1','sp1','wd2','sp2','wd3','sp3','wd4','sp4','wd5','sp5','wd6','sp6','wd7','sp7','wd8','sp8','wd9','sp9','wd10','sp10','wd11','sp11','scroll','book','pages','keys','seal','purse','shackles','skull']);
  const props=w.PROPS.filter(p=>!flat.has(p.k)&&!VOID.has(tileAt(Math.floor(p.x),Math.floor(p.y-.2))));
  w.groundShadows=instanced(groundFxGeo,groundShadowMat,props,p=>{const m=p.obj&&p.obj.mesh,s=p.k==='sacred_oak'?2.2:p.tree?.8:m?Math.min(2,Math.max(.3,m.geometry.parameters.width*Math.abs(m.scale.x)*.5)):.65;return M4.compose(V.set(p.x,.024,p.y-.1),Q.identity(),SC.set(s*1.1,1,s*.6))},false,false);
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
function applySurfaceQuality(w){const seen=new Set();w.group.traverse(o=>{for(const m of [].concat(o.material||[])){if(m.groundLite)m.groundLite.value=coarse||SETT.quality==='low'?1:0;if(seen.has(m)||!m.userData.surfaceDetail)continue;seen.add(m);const map=SETT.quality==='low'?null:m.userData.surfaceDetail;if(m.bumpMap!==map){m.bumpMap=map;m.needsUpdate=true}const tex=m.userData.surfaceDetail,aniso=Math.min(GFX.aniso,renderer.capabilities.getMaxAnisotropy());if(tex.anisotropy!==aniso){tex.anisotropy=aniso;tex.needsUpdate=true}}})}
function floorAO(fg,solidish){for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){const t=tileAt(tx,ty);if(VOID.has(t)||t===21||t===45)continue;
  let o=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const n=tileAt(tx+dx,ty+dy);if(WALLC.has(n))o+=dx&&dy?.5:1;else if(solidish.has(n))o+=dx&&dy?.25:.5}
  if(o>0){fg.fillStyle=`rgba(4,3,6,${Math.min(.35,o*.07)})`;fg.fillRect(tx*16,ty*16,16,16)}
  if(WALLC.has(tileAt(tx,ty-1))){const shade=fg.createLinearGradient(0,ty*16,0,ty*16+12);shade.addColorStop(0,'rgba(4,3,6,.32)');shade.addColorStop(1,'rgba(4,3,6,0)');fg.fillStyle=shade;fg.fillRect(tx*16,ty*16,16,12)}}}
function decals(I){const dec=row=>[0,1,2,3].map(i=>{const cv=canvas(32,32);cv.getContext('2d').drawImage(I.decals,i*32,row*32,32,32,0,0,32,32);return cv});
  DEC.pool=dec(0);DEC.spray=dec(1);DEC.scorch=dec(2);DEC.crack=dec(3);DEC.bones=dec(5)}

