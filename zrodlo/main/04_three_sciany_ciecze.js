// cutaway: walls and pillars between the camera and the hero dissolve into a pixel dither
const CUT={value:new THREE.Vector3(-99,0,-99)};
function cutaway(mat){mat.onBeforeCompile=sh=>{sh.uniforms.uCut=CUT;
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vCut;').replace('#include <project_vertex>','#include <project_vertex>\nvec4 cwp=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\ncwp=instanceMatrix*cwp;\n#endif\nvCut=(modelMatrix*cwp).xyz;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vCut;uniform vec3 uCut;').replace('void main() {','void main() {\nvec2 cd=vCut.xz-uCut.xz;if(cd.y>0.3&&cd.y<12.0&&(abs(cd.x)<2.4||cd.y>2.2)&&vCut.y>0.8){float k=mod(floor(gl_FragCoord.x)+floor(gl_FragCoord.y),2.0);if(vCut.y>1.5||k<1.0)discard;}')};return mat}
const WALLTEX=new Map();
function wallTex(img){let t=WALLTEX.get(img);if(!t){t=new THREE.Texture(img);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());t.needsUpdate=true;WALLTEX.set(img,t)}return t}
// ściana/dach z kafelkującej tekstury HD próbkowanej po współrzędnych świata (boki: x/z + wysokość, góra: x/z), bez rozciągania na pojedynczy kafel
function worldSurf(mat,img,scale,kind){mat.map=wallTex(img);mat.emissiveMap=null;mat.bumpMap=null;const prev=mat.onBeforeCompile;
  mat.onBeforeCompile=sh=>{if(prev)prev.call(mat,sh);
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWW;varying vec3 vWN;').replace('#include <project_vertex>','#include <project_vertex>\nvec4 wwp=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nwwp=instanceMatrix*wwp;\n#endif\nvWW=(modelMatrix*wwp).xyz;vWN=normalize(mat3(modelMatrix)*objectNormal);');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vWW;varying vec3 vWN;').replace('#include <map_fragment>','vec2 wuv=abs(vWN.y)>.5?vWW.xz:(abs(vWN.x)>.5?vec2(vWW.z,vWW.y):vec2(vWW.x,vWW.y));vec4 sampledDiffuseColor=texture2D(map,wuv/'+scale.toFixed(2)+');diffuseColor*=sampledDiffuseColor;')};
  mat.customProgramCacheKey=()=>'nbws'+kind+scale;return mat}
const M4=new THREE.Matrix4(),Q=new THREE.Quaternion(),V=new THREE.Vector3(),SC=new THREE.Vector3(1,1,1),UP=new THREE.Vector3(0,1,0);
let ROOT=scene;
function instanced(geo,mat,list,fn,cast=true,recv=true){const im=new THREE.InstancedMesh(geo,mat,Math.max(1,list.length));list.forEach((p,i)=>{fn(p);im.setMatrixAt(i,M4)});im.count=list.length;im.castShadow=cast;im.receiveShadow=recv;ROOT.add(im);return im}
let LAVA_HD=null,LAVA_ALL=[];
// Runda 214: woda HD (tekstura + połysk + jaśniejsze brzegi). Płytka (chodzi się po niej) jaśniejsza i bardziej zielonkawa, głęboka (blokuje) ciemna, granatowa.
let WATER_ALL=[];
function waterHD(li,cells,Y,RU,col,deep){if(!li||!cells||!cells.length)return null;
 const lt=new THREE.Texture(li);lt.wrapS=lt.wrapT=THREE.RepeatWrapping;lt.magFilter=THREE.LinearFilter;lt.minFilter=THREE.LinearMipmapLinearFilter;lt.generateMipmaps=true;lt.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());lt.needsUpdate=true;
 const L=new Set(cells.map(([x,y])=>x+','+y)),shore=(cx,cy)=>{let d=3;for(let oy=-3;oy<=2;oy++)for(let ox=-3;ox<=2;ox++){const x=Math.floor(cx)+ox,y=Math.floor(cy)+oy;if(L.has(x+','+y))continue;const dx=Math.max(x-cx,0,cx-x-1),dy=Math.max(y-cy,0,cy-y-1);d=Math.min(d,Math.hypot(dx,dy))}return d};
 // 12.11.2026: brzeg wody bez schodkow z kafli. Siatka 4x4 na kafel obejmuje tez pas ladu wokol wody; przezroczystosc liczona z gladkiej odleglosci od brzegu z lekkim falowaniem, wiec linia brzegu jest zaokraglona i nieregularna
 const N=4,ring=new Set(L);for(const [x,y] of cells)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)ring.add((x+dx)+','+(y+dy));
 const CV=[];for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++)if(i*i+j*j<=9)CV.push([i*.3,j*.3]);const cover=(vx,vy)=>{let n=0;for(const [ox,oy] of CV)if(L.has(Math.floor(vx+ox)+','+Math.floor(vy+oy)))n++;return n/CV.length};
 const wob=(x,y)=>.14*(Math.sin(x*2.3+y*1.1)+Math.sin(y*2.9-x*1.7))+.05*Math.sin(x*6.1+y*5.3);
 const pos=[],uv=[],cl=[],aw=[],idx=[];for(const k of ring){const [x,y]=k.split(',').map(Number);const b=pos.length/3;
  for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const vx=x+i/N,vy=y+j/N;pos.push(vx,Y,vy);uv.push(vx/RU,-vy/RU);const d=shore(vx,vy),v=deep?1.1-.4*Math.min(d,2.5)/2.5:1-.12*Math.min(d,1.5)/1.5;cl.push(v,v,v);const t=Math.min(1,Math.max(0,(cover(vx,vy)+wob(vx,vy)-.32)/.36));aw.push(t*t*(3-2*t))}
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=b+j*(N+1)+i;if(aw[a]+aw[a+1]+aw[a+N+1]+aw[a+N+2]===0)continue;idx.push(a,a+N+1,a+1,a+1,a+N+1,a+N+2)}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(cl,3));g.setAttribute('aw',new THREE.Float32BufferAttribute(aw,1));g.setIndex(idx);g.computeVertexNormals();
 const mat=liquidMat({map:lt,color:col,vertexColors:true,shininess:deep?36:26,specular:deep?0x1e2a38:0x161c1c},2),mesh=new THREE.Mesh(g,mat);
 {const ob=mat.onBeforeCompile;mat.onBeforeCompile=sh=>{ob(sh);sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute float aw;varying float vAw;').replace('#include <begin_vertex>','#include <begin_vertex>\nvAw=aw;');sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vAw;').replace('#include <fog_fragment>','#include <fog_fragment>\ngl_FragColor.a*=vAw;')};{const pk0=mat.customProgramCacheKey?mat.customProgramCacheKey():'';mat.customProgramCacheKey=()=>pk0+'|waterAw'}mat.transparent=true;mat.depthWrite=false}mesh.castShadow=false;mesh.receiveShadow=true;ROOT.add(mesh);
 WATER_ALL=WATER_ALL.filter(o=>!(o.ch===CH&&o.deep===deep&&o.Y===Y));const o={ch:CH,tex:lt,deep,Y,mesh};WATER_ALL.push(o);return o}
// Runda 254: fazowanie brzegów cieczy (woda, lawa, szkarłatna maź). Trzy elementy:
// 1) zbocze niecki (pionowa ścianka od lustra cieczy do gruntu; tylko tam, gdzie ciecz leży poniżej gruntu),
// 2) ciemny, mokry pas gruntu przy brzegu i ciemniejszy brzeg samej cieczy (warstwa mnożąca, bez tekstur),
// 3) skorupa na brzegu lawy i mazi (mocniejsze przyciemnienie).
// 10.11.2026: miękkie przyciemnienie ziemi wzdłuż murów i domów (statyczna siatka mnożąca, jak brzegi cieczy)
function wallShade(){if(SETT.quality==='low'||!W||!W.map)return;const M=W.map,isW=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&WALLC.has(M[y*MW+x]),free=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&!SOLID.has(M[y*MW+x])&&!VOID.has(M[y*MW+x]);
 const pos=[],col=[],idx=[],N=3;
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){if(!free(x,y))continue;const ws=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(isW(x+dx,y+dy))ws.push([x+dx,y+dy]);if(!ws.length)continue;
  const b=pos.length/3;for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const vx=x+i/N,vy=y+j/N;let d=2;for(const [wx,wy] of ws)d=Math.min(d,Math.hypot(Math.max(wx-vx,0,vx-wx-1),Math.max(wy-vy,0,vy-wy-1)));const f=1-.36*Math.pow(Math.max(0,1-d/.85),2);pos.push(vx,.024,vy);col.push(f,f,f)}
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=b+j*(N+1)+i;idx.push(a,a+N+1,a+1,a+1,a+N+1,a+N+2)}}
 if(!pos.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);
 const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,blending:THREE.MultiplyBlending,premultipliedAlpha:true,depthWrite:false,fog:false,toneMapped:false}));m.renderOrder=1;m.castShadow=m.receiveShadow=false;m.frustumCulled=false;ROOT.add(m)}
function shoreFX(all,draw,Y,kind,land,step){if(!all||!all.length||!draw||!draw.length)return;
 const A=new Set(all.map(([x,y])=>x+','+y)),D=new Set(draw.map(([x,y])=>x+','+y));
 const P={water:{ld:.42,lw:.9,id:.08,iw:.3},lava:{ld:.55,lw:.8,id:.85,iw:.4},rot:{ld:.5,lw:.75,id:.8,iw:.38}}[kind]||{ld:.5,lw:.8,id:.5,iw:.3};
 const dist=(vx,vy,wantLiquid)=>{let d=2;for(let oy=-2;oy<=1;oy++)for(let ox=-2;ox<=1;ox++){const x=Math.floor(vx)+ox,y=Math.floor(vy)+oy;if(A.has(x+','+y)!==wantLiquid)continue;const dx=Math.max(x-vx,0,vx-x-1),dy=Math.max(y-vy,0,vy-y-1);d=Math.min(d,Math.hypot(dx,dy))}return d};
 const CVW=[];for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++)if(i*i+j*j<=16)CVW.push([i*.24,j*.24]); // 12.11.2026: mokry pas przy wodzie liczony z wygladzonego zasiegu wody, bez prostych krawedzi z kafli
 const pos=[],col=[],idx=[],N=4,quad=(x,y,yy,fn)=>{const b=pos.length/3;for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const vx=x+i/N,vy=y+j/N,f=fn(vx,vy);pos.push(vx,yy,vy);col.push(f,f,f)}for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=b+j*(N+1)+i;idx.push(a,a+N+1,a+1,a+1,a+N+1,a+N+2)}};
 if(kind!=='water'&&kind!=='rot')for(const k of D){const [x,y]=k.split(',').map(Number);quad(x,y,Y,(vx,vy)=>1-P.id*Math.exp(-dist(vx,vy,false)/P.iw))}
 if(land&&(kind==='water'||kind==='rot')){const seen=new Set(),f=(vx,vy)=>{let n=0;for(const [ox,oy] of CVW)if(A.has(Math.floor(vx+ox)+','+Math.floor(vy+oy)))n++;const c=n/CVW.length;return 1-P.ld*4*c*(1-c)};for(const k of A){const [cx,cy]=k.split(',').map(Number);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=cx+dx,y=cy+dy,kk=x+','+y;if(seen.has(kk)||x<0||y<0||x>=MW||y>=MH)continue;seen.add(kk);if(A.has(kk)&&[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]].every(([ax,ay])=>A.has((x+ax)+','+(y+ay))))continue;quad(x,y,.02,f)}}}
 else if(land){const seen=new Set();for(const k of A){const [cx,cy]=k.split(',').map(Number);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=cx+dx,y=cy+dy,kk=x+','+y;if(A.has(kk)||seen.has(kk)||x<0||y<0||x>=MW||y>=MH)continue;seen.add(kk);quad(x,y,.02,kind==='water'?(vx,vy)=>{let n=0;for(const [ox,oy] of CVW)if(A.has(Math.floor(vx+ox)+','+Math.floor(vy+oy)))n++;const c=n/CVW.length;return 1-P.ld*Math.min(1,c*2.2)}:(vx,vy)=>{const d=dist(vx,vy,true);return 1-P.ld*Math.pow(Math.max(0,1-d/P.lw),2)})}}}
 if(pos.length){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);
  const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,blending:THREE.MultiplyBlending,premultipliedAlpha:true,depthWrite:false,fog:false,toneMapped:false}));m.renderOrder=1;m.castShadow=m.receiveShadow=false;m.frustumCulled=false;ROOT.add(m)}
 if(Y<-.03){const wp=[],wc=[],wi=[],lv=kind==='lava',top=lv?[.085,.055,.05]:[.34,.27,.21],bot=lv?[.46,.13,.035]:[.07,.09,.11],mid=[.2,.075,.045],yb=Y-.012;
  for(const k of D){const [x,y]=k.split(',').map(Number);for(const [dx,dy,ax,az,bx,bz] of [[-1,0,x,y,x,y+1],[1,0,x+1,y,x+1,y+1],[0,-1,x,y,x+1,y],[0,1,x,y+1,x+1,y+1]]){const nk=(x+dx)+','+(y+dy);let t;if(!A.has(nk))t=0;else if(!D.has(nk)&&step!==undefined)t=step;else continue;if(t<=yb+.01)continue;
   const b=wp.length/3;if(lv){const ym=yb+Math.min(.22,(t-yb)*.4);wp.push(ax,yb,az,bx,yb,bz,ax,ym,az,bx,ym,bz,ax,t,az,bx,t,bz);wc.push(...bot,...bot,...mid,...mid,...top,...top);wi.push(b,b+1,b+2,b+1,b+3,b+2,b+2,b+3,b+4,b+3,b+5,b+4)}else{wp.push(ax,yb,az,bx,yb,bz,ax,t,az,bx,t,bz);wc.push(...bot,...bot,...top,...top);wi.push(b,b+1,b+2,b+1,b+3,b+2)}}}
  if(wp.length){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(wp,3));g.setAttribute('color',new THREE.Float32BufferAttribute(wc,3));g.setIndex(wi);
   const m=new THREE.Mesh(g,lv?new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,fog:false}):new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide}));m.castShadow=false;m.receiveShadow=true;ROOT.add(m)}}
}
// głębokie środki bagien w rozdz. IV: tylko tam, gdzie nie odetnie to żadnej części mapy
function deepMarsh(w){const M=w.map,at=(x,y)=>(x<0||y<0||x>=MW||y>=MH)?21:M[y*MW+x],cand=[];
 for(let y=2;y<MH-2;y++)for(let x=2;x<MW-2;x++){if(at(x,y)!==65)continue;let ok=true;for(let dy=-2;dy<=2&&ok;dy++)for(let dx=-2;dx<=2;dx++)if(at(x+dx,y+dy)!==65){ok=false;break}if(ok)cand.push(y*MW+x)}
 if(!cand.length)return;const big=()=>{const seen=new Uint8Array(MW*MH);let best=0,tot=0;for(let i=0;i<MW*MH;i++){if(seen[i]||SOLID.has(M[i]))continue;let n=0;const q=[i];seen[i]=1;while(q.length){const c=q.pop();n++;const x=c%MW,y=(c/MW)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const j=ny*MW+nx;if(!seen[j]&&!SOLID.has(M[j])){seen[j]=1;q.push(j)}}}tot+=n;best=Math.max(best,n)}return [best,tot]};
 const [b0]=big();for(const i of cand)M[i]=91;const [b1]=big();if(b1<b0-cand.length)for(const i of cand)M[i]=65}

// Runda 213: wspólna lawa HD (ch II lawa, ch III kałuże): tekstura płynie, a druga kopia jako mapa świecenia płynie w inną stronę,
// więc pęknięcia rozjaśniają się i gasną nierówno; wokół brzegów miękka łuna (warstwa addytywna, bez prawdziwych świateł).
function lavaHD(li,cells,Y,RU,opt={}){if(!li||!cells.length)return null;if(!opt.keep)LAVA_ALL=LAVA_ALL.filter(o=>o.ch!==CH);
 const mk=()=>{const t=new THREE.Texture(li);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());t.needsUpdate=true;return t};
 const lt=mk(),et=mk();et.repeat.set(.83,.83);
 const pos=[],uv=[],idx=[],aw=[];
 if(opt.soft){ // 12.11.2026: kaluza mazý bez kwadratowych krawedzi: siatka 4x4 na kafel, przezroczystosc z wygladzonego zasiegu + falowanie, krawedz jest nieregularna i zaokraglona
  const L0=new Set(cells.map(([x,y])=>x+','+y)),ring=new Set(L0),N=4;for(const [x,y] of cells)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)ring.add((x+dx)+','+(y+dy));
  const CV=[];for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++)if(i*i+j*j<=9)CV.push([i*.3,j*.3]);const cover=(vx,vy)=>{let n=0;for(const [ox,oy] of CV)if(L0.has(Math.floor(vx+ox)+','+Math.floor(vy+oy)))n++;return n/CV.length};
  const wob=(x,y)=>.17*(Math.sin(x*2.1+y*1.3)+Math.sin(y*2.7-x*1.9))+.07*Math.sin(x*5.7+y*6.1)+.05*Math.sin(x*11.3-y*9.1);
  for(const k of ring){const [x,y]=k.split(',').map(Number);const b=pos.length/3;
   for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const vx=x+i/N,vy=y+j/N;pos.push(vx,Y,vy);uv.push(vx/RU,-vy/RU);const t=Math.min(1,Math.max(0,(cover(vx,vy)+wob(vx,vy)-.34)/.3));aw.push(t*t*(3-2*t))}
   for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=b+j*(N+1)+i;if(aw[a]+aw[a+1]+aw[a+N+1]+aw[a+N+2]===0)continue;idx.push(a,a+N+1,a+1,a+1,a+N+1,a+N+2)}}
 }else for(const [x,y] of cells){const b=pos.length/3;pos.push(x,Y,y,x+1,Y,y,x,Y,y+1,x+1,Y,y+1);uv.push(x/RU,-y/RU,(x+1)/RU,-y/RU,x/RU,-(y+1)/RU,(x+1)/RU,-(y+1)/RU);idx.push(b,b+2,b+1,b+1,b+2,b+3)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));if(opt.soft)g.setAttribute('aw',new THREE.Float32BufferAttribute(aw,1));g.setIndex(idx);g.computeVertexNormals();
 const mat=liquidMat({map:lt,emissiveMap:et,emissive:opt.emissive||0xff6a28,emissiveIntensity:.8,...(opt.color?{color:opt.color,shininess:opt.shin||60,specular:opt.spec||0x401820}:{})},1),mesh=new THREE.Mesh(g,mat);if(opt.soft){const ob=mat.onBeforeCompile;mat.onBeforeCompile=sh=>{ob(sh);sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute float aw;varying float vAw;').replace('#include <begin_vertex>','#include <begin_vertex>\nvAw=aw;');sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vAw;').replace('#include <fog_fragment>','#include <fog_fragment>\ngl_FragColor.a*=vAw;')};{const pk0=mat.customProgramCacheKey?mat.customProgramCacheKey():'';mat.customProgramCacheKey=()=>pk0+'|lavaAw'}mat.transparent=true;mat.depthWrite=false}mesh.castShadow=false;mesh.receiveShadow=false;ROOT.add(mesh);
 const L=new Set(cells.map(([x,y])=>x+','+y)),R=2.2,inten=(cx,cy)=>{let d=9;for(let oy=-3;oy<=2;oy++)for(let ox=-3;ox<=2;ox++){const x=Math.floor(cx)+ox,y=Math.floor(cy)+oy;if(!L.has(x+','+y))continue;const dx=Math.max(x-cx,0,cx-x-1),dy=Math.max(y-cy,0,cy-y-1);d=Math.min(d,Math.hypot(dx,dy))}return Math.pow(Math.max(0,1-d/R),1.6)};
 const hp=[],hc=[],hi=[],done=new Set();for(const [lx,ly] of cells)for(let y=ly-2;y<=ly+2;y++)for(let x=lx-2;x<=lx+2;x++){const k=x+','+y;if(L.has(k)||done.has(k))continue;done.add(k);
  const c=[inten(x,y),inten(x+1,y),inten(x,y+1),inten(x+1,y+1)];if(Math.max(...c)<.01)continue;const b=hp.length/3,hy=(Y<0?0:Y)+.02;hp.push(x,hy,y,x+1,hy,y,x,hy,y+1,x+1,hy,y+1);const HC=opt.h||[1,.42,.12];for(const v of c)hc.push(v*HC[0],v*HC[1],v*HC[2]);hi.push(b,b+2,b+1,b+1,b+2,b+3)}
 let halo=null;if(hp.length&&!opt.soft){const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.Float32BufferAttribute(hp,3));hg.setAttribute('color',new THREE.Float32BufferAttribute(hc,3));hg.setIndex(hi);
  halo=new THREE.Mesh(hg,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));halo.renderOrder=2;halo.castShadow=halo.receiveShadow=false;ROOT.add(halo)}
 if(!opt.soft)shoreFX(cells,cells,Y+.012,CH===3?'rot':'lava',true);const o={ch:CH,tex:lt,etex:et,mat,halo,spd:opt.spd||1};LAVA_ALL.push(o);return o}// lawa HD (CC0, Stunt Rally / Nobiax): jedna płaszczyzna z teksturą w przestrzeni świata, bez siatki kafli
const lavaC=canvas(64,64),lavaG=lavaC.getContext('2d'),lavaTex=texFrom(lavaC,true);let lavaFrames=[],lavaFrame=-1;
const waterC=canvas(64,64),waterG=waterC.getContext('2d'),waterTex=texFrom(waterC,true);let waterFrames=[],waterFrame=-1;
const DEC={};
const geoT=new THREE.PlaneGeometry(2,4).translate(0,1.875,0);
const geo64w=new THREE.PlaneGeometry(4,2).translate(0,.875,0);const geoCrypt=new THREE.PlaneGeometry(6,4.5).translate(0,2.125,0);
const tcut=(img,c,row)=>{const size=16*(img.nbDensity||1),cv=canvas(size,size);atlasDraw(cv.getContext('2d'),img,c*16,row*16,16,16,0,0,size,size);return cv};
const stackTex=(img,rows)=>{const size=16*(img.nbDensity||1),c=canvas(size,size*rows.length),g=c.getContext('2d');rows.forEach(([col,row],i)=>atlasDraw(g,img,col*16,row*16,16,16,0,i*size,size,size));return surfaceTex(c,true)};
const SINK_GEO=new Map();function mkProp(frames,x,y,rc){let geo=rc[2]===96?geoCrypt:rc[3]===64?geoT:rc[2]===64?geo64w:geo32;const pb=frames[0].padB||0,vs=frames[0].vis==null?1:frames[0].vis,ex=.05*Math.min(1,Math.max(0,(vs-.15)/.35));if(true){const key=geo.uuid+':'+pb.toFixed(3)+':'+ex.toFixed(3)+'s';let g2=SINK_GEO.get(key);if(!g2){g2=geo.clone().translate(0,-(pb+ex)*geo.parameters.height,0);g2.parameters=geo.parameters;SINK_GEO.set(key,g2)}geo=g2}const m=new THREE.Mesh(geo,frames[0].n);m.customDistanceMaterial=frames[0].d;m.userData.propAsset=true;m.castShadow=true;m.position.set(x+(rc[2]===96?1.2:0),0,y+(rc[2]===96?1:0));m.scale.set(1,SQ,1);ROOT.add(m);return m}
