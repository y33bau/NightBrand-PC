// cutaway: walls and pillars between the camera and the hero dissolve into a pixel dither
const CUT={value:new THREE.Vector3(-99,0,-99)};
function cutaway(mat){mat.onBeforeCompile=sh=>{sh.uniforms.uCut=CUT;
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vCut;').replace('#include <project_vertex>','#include <project_vertex>\nvec4 cwp=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\ncwp=instanceMatrix*cwp;\n#endif\nvCut=(modelMatrix*cwp).xyz;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vCut;uniform vec3 uCut;').replace('void main() {','void main() {\nvec2 cd=vCut.xz-uCut.xz;if(cd.y>0.3&&cd.y<12.0&&(abs(cd.x)<2.4||cd.y>2.2)&&vCut.y>0.8){float k=mod(floor(gl_FragCoord.x)+floor(gl_FragCoord.y),2.0);if(vCut.y>1.5||k<1.0)discard;}')};return mat}
// 23.11.2026 (runda 868): wezsze wyciecie dla duzych modeli domow: tylko pas przed bohaterem (inaczej caly rzad domow na poludniu tracilby dachy)
function cutawayHouse(mat){mat.onBeforeCompile=sh=>{sh.uniforms.uCut=CUT;
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vCut;').replace('#include <project_vertex>','#include <project_vertex>\nvec4 cwp=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\ncwp=instanceMatrix*cwp;\n#endif\nvCut=(modelMatrix*cwp).xyz;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vCut;uniform vec3 uCut;').replace('void main() {','void main() {\nvec2 cd=vCut.xz-uCut.xz;if(cd.y>-0.6&&cd.y<14.0&&abs(cd.x)<3.4-max(cd.y,0.0)*0.08&&vCut.y>0.8){float k=mod(floor(gl_FragCoord.x)+floor(gl_FragCoord.y),2.0);if(vCut.y>1.5||k<1.0)discard;}')};
 mat.customProgramCacheKey=()=>'cutHouse';return mat}
const WALLTEX=new Map();
function wallTex(img){let t=WALLTEX.get(img);if(!t){t=new THREE.Texture(img);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());t.needsUpdate=true;WALLTEX.set(img,t)}return t}
// ściana/dach z kafelkującej tekstury HD próbkowanej po współrzędnych świata (boki: x/z + wysokość, góra: x/z), bez rozciągania na pojedynczy kafel
function worldSurf(mat,img,scale,kind){mat.map=wallTex(img);mat.emissiveMap=null;mat.bumpMap=null;const prev=mat.onBeforeCompile;
  mat.onBeforeCompile=sh=>{if(prev)prev.call(mat,sh);
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWW;varying vec3 vWN;').replace('#include <project_vertex>','#include <project_vertex>\nvec4 wwp=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nwwp=instanceMatrix*wwp;\n#endif\nvWW=(modelMatrix*wwp).xyz;vWN=normalize(mat3(modelMatrix)*objectNormal);');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vWW;varying vec3 vWN;').replace('#include <map_fragment>','vec2 wuv=abs(vWN.y)>.5?vWW.xz:(abs(vWN.x)>.5?vec2(vWW.z,vWW.y):vec2(vWW.x,vWW.y));vec4 sampledDiffuseColor=texture2D(map,wuv/'+scale.toFixed(2)+');diffuseColor*=sampledDiffuseColor;')};
  mat.customProgramCacheKey=()=>'nbws'+kind+scale;return mat}
/* 23.11.2026 (runda 869): tekstury Osady od autora (ChatGPT, kafelkujace) z mapa wypuklosci (normal mapa liczona z jasnosci).
   Mapowanie jak worldSurf (wspolrzedne swiata), dodatkowo normalna zaburzana z normal mapy: pekniecia, szpary i kamienie lapia swiatlo ognisk. */
const OSADA_TX={"t1_bale":["assets/tekstury/cdc7349029003858b3646884176f3ebeb8dc6fe0c40cbc2ed07028b29e727cb6.webp","assets/tekstury/076cbac3e94709ec9bac86ce7fcb3bca5278cf51aa41f8a2d623214e17afa726.webp"],"t2_belka":["assets/tekstury/97112523da1c9face4cde60010b77ef41e4758b74b77a5553c282d7454abee96.webp","assets/tekstury/136907203a3aebe1e98334deac1c47b54c498604aa6fc123f19e88aa07106bbc.webp"],"t3_poszycie":["assets/tekstury/245b59670ba9eedeaf48bc550a55cd7b1a3e576e63f9a5bd1b7056f980404d35.webp","assets/tekstury/ac5e27500105480abf207e5c40c3fbe91efb712b6e1c13b5ac9b942160e061c0.webp"],"t4_podmurowka":["assets/tekstury/fddc736c28abe2946637a539732aff70ef02f9070dc72340aa963616fd4b95a1.webp","assets/tekstury/3431fc65b90df9ba91fb80f801f9d18263976c10e396fe45c86aaa115afef4cc.webp"],"t5_podloga":["assets/tekstury/7d31cdce9df75e71080286719d203b8fda2115de3261ceb552e932173b810f5a.webp","assets/tekstury/68c8b62eaf49bb70567c25dfe60a3b2f944b22930cb138753d4cce36936b7e5d.webp"],"t6_dachowka":["assets/tekstury/40b3642aff786b5a639c7eb54064c8ae4326e3194e99268ea8d2949151784e69.webp","assets/tekstury/cdc86566f8dcedd8bdda8103ba6fc00572d8f1019d0ec13d081b6816a1dd7636.webp"],"t3a_poszycie_lekkie":["assets/tekstury/5b9e69b90b867d56347f2437159eb3012f488c10c1d1a19a380c184449963423.webp","assets/tekstury/2823beea45c89ec5d192af74ddca0ce1f3794f6039f3537a4edfd4cbc6122890.webp"],"t3c_poszycie_ciezkie":["assets/tekstury/b0fb782c0d3c16f58b7ceaf448c897ceb825b790b1ca92934253409ebda6d1c2.webp","assets/tekstury/7ad30cf53fb77ab19782f97f1abb0575ecca1949539e19977d8d7c9e63528b8f.webp"],"tcz1_drewno_palisady":["assets/tekstury/b03f0dbc3201de9e5ca9cb80bc922f2cdf13a25014919689ae982e887b60ca65.webp","assets/tekstury/7d7dbb14bf207f263575c1caccc507576a67a65d3d1d3c4e4931a18ba7200a2d.webp"],"tgm1_tynk_wapienny":["assets/tekstury/d433e5e965439966954e3e5e5f3b7f7b4624269a16f2c75646e43a7287e3730a.webp","assets/tekstury/78d3db28bf586dd1a1bead8dd9f993a7525525b9da4235508125fd79e866b425.webp"],"tgm2_mur_kamienny":["assets/tekstury/455d6dbde3bbecba83645625551ae018300da01fc989ea8de246f43cafee4f9a.webp","assets/tekstury/98bc21d5db1d978ea50d3f4df4bc778365f548e1270ea090ee10605a35dd9145.webp"],"tgm3_dachowka_gliniana":["assets/tekstury/7df9d0f2ad1aafcbadc56c7e400cad1d4e6a06c67d0f3ad2f8556e5a12f449ba.webp","assets/tekstury/660a0122ca740831c5cd9147671441876931dabd1e04b3aed9e6798247565239.webp"],"tsn1_dab_portowy":["assets/tekstury/80ca3d889fea1cdca2c606bd32e8573af4bc051869c5e1c207805fc68a48ab69.webp","assets/tekstury/569de4779473f5d245a56422762f78494273e2b7bf190561d2a0c5d595ad8cc9.webp"],"tsn2_konopie_skrecane":["assets/tekstury/e5b65659baddcd9bd9b8c144025fc2b4e1560733313dc7e358a136f54db93539.webp","assets/tekstury/b9d76a6bc85d970e965ffca6954b8fe744bcea4330ffbad477f0d40d1bae0025.webp"],"tzl1_miedz_patynowana":["assets/tekstury/ff54cbfd62f5689ae428197ab6a8f9ade9fa2ce1e2a13556643727e6e78f6127.webp","assets/tekstury/52b49f4df2831e22de69f8633c9c3a7573443b5272f67b5bf3ef6ef4e83bbdca.webp"],"tzl2_zloto_patynowane":["assets/tekstury/441f7903530d714d74e05ce9c1551334a05b3357cdbd3231be85f8da91dd8f18.webp","assets/tekstury/80d1982f9f62dd1f1a95e2dcf43983b0fbdf44fcef892bb9c5b281c26ed6fa47.webp"],"m_buda":["assets/rekwizyty/dce3205f6f0b13cc61f03fe22cf84c19970c1e57e99164ea0e030b6e1aad9eea.webp","assets/tekstury/40978edb95bc8804dfe6996592574356a18b2e8dab450ec6fccd4be50d03aeb6.webp"],"tm03_ciosy":["assets/tekstury/2bba4115b261b183945f3cb2cba0c8186672c156916beed4ebd8cf8f0525bcdc.webp","assets/tekstury/f7b9b89bb33eb620eee88a066581e7d90fa8bc24c7b5e1ca3b54a1883f14be8b.webp"]};
// 23.11.2026 (877): malowane, bezszwowe tekstury budynkow (SDXL + IP-Adapter, wybor autora: NOWE MODELE/Tekstury_malowane); od 881 bez zapasu starych tekstur
const _otx=new Map();function osadaTex(u){let t=_otx.get(u);if(!t){t=new THREE.TextureLoader().load(u);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());_otx.set(u,t)}return t}
/* 23.11.2026 (autor: "zeby byly w stylu gry, a nie jak surowe bryly"): patyna liczona z polozenia w swiecie, bez powtorzen kafla.
   wk: 0 bez, 1 miasto (przebarwienia, zacieki, brud przy ziemi), 2 port/wies (+ mech, mocniejszy brud), 3 spalone (+ sadza ku gorze). */
const NB_WEATHER='float nbH(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float nbN(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(nbH(i),nbH(i+vec2(1.,0.)),f.x),mix(nbH(i+vec2(0.,1.)),nbH(i+vec2(1.,1.)),f.x),f.y);}float nbF(vec2 p){return nbN(p)*.55+nbN(p*2.13+3.1)*.3+nbN(p*4.7+7.7)*.15;}';
const nbWeather=wk=>wk?`{float wk=${wk.toFixed(1)};bool wall=abs(nW0.y)<.5;float al=abs(nW0.x)>.5?vWW.z:vWW.x;vec3 c=diffuseColor.rgb;float lum=dot(c,vec3(.3,.59,.11));
 c=mix(vec3(lum),c,1.22);c=mix(c,c*c*(3.-2.*c),.4);c=mix(c,floor(c*9.+.5)/9.,.3);
 float br=wall?mix(nbN(vec2(al*.8,vWW.y*6.5)),nbN(vec2(al*6.,vWW.y*.8)),.5):nbN(vWW.xz*vec2(.9,6.));c*=mix(.9,1.09,br);
 float tw=nbF(vWW.xz*.12+vec2(0.,vWW.y*.05));c*=mix(vec3(.9,.95,1.06),vec3(1.07,.99,.86),tw);lum=dot(c,vec3(.3,.59,.11));
 float bl=nbF(vWW.xz*.33+vec2(vWW.y*.21,0.));c*=mix(.72,1.12,bl);c=mix(c,vec3(lum)*vec3(1.04,1.,.92),.18);
 if(wall){float st=nbN(vec2(al*2.7,vWW.y*.18+nbN(vec2(al*.5,0.))*2.));float sk=smoothstep(.5,.9,st)*(.55+.45*nbN(vec2(al*.9,vWW.y*.6)));c*=1.-.42*sk;
  float gh=1.4+.8*nbN(vec2(al*.7,3.))+(wk>1.5?.4:0.);float g=1.-smoothstep(0.,gh,vWW.y);c=mix(c,c*vec3(.58,.55,.47),g*(.55+.2*wk));
  if(wk>1.5){float ms=smoothstep(.5,.85,nbF(vec2(al*.8,vWW.y*.9)))*(1.-smoothstep(.2,1.4,vWW.y));c=mix(c,vec3(.24,.3,.17)*(.6+lum),ms*.55);}
  if(wk>2.5){float so=smoothstep(.7,2.4,vWW.y)*(.45+.55*nbF(vec2(al*1.3,vWW.y*.8)));c=mix(c,c*vec3(.22,.2,.19),so*.8);}}
 else{float ms=smoothstep(.55,.85,nbF(vWW.xz*.45));c=mix(c,c*vec3(.62,.66,.48),ms*(.25+.12*wk));if(wk>2.5)c=mix(c,c*vec3(.35,.32,.3),nbF(vWW.xz*.8)*.5);}
 diffuseColor.rgb=c;}`:'';
// 23.11.2026 (878, decyzja autora: okna i witraze): shader szyb. Tryby: 0 okno ciemne (odbicie nieba, refleksy, zaslona, brud),
// 1 okno ze swiatlem (lampa we wnetrzu, podswietlona zaslona, szprosy pod swiatlo, migotanie), 2 witraz (bordiura, medalion, olow),
// 3 rozeta (czworolist, zloty srodek). Detale gasna, gdy okno jest male na ekranie (lod). ?okna=0 = stare plaskie szyby.
// Ziarno okna: atrybut nbSeed (siatki scalone) albo polozenie siatki (modelMatrix). Czas: NB_WIN_T (17_render).
const NB_WIN=nbParam('okna')!=='0',NB_WIN_T={value:0};
const NB_WIN_GLSL=`
float wh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float wn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(wh(i),wh(i+vec2(1.,0.)),f.x),mix(wh(i+vec2(0.,1.)),wh(i+vec2(1.,1.)),f.x),f.y);}
float wf(vec2 p){return wn(p)*.5+wn(p*2.03)*.25+wn(p*4.1)*.25;}
vec3 wvor(vec2 p){vec2 g=floor(p);float d1=9.,d2=9.,id=0.;for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 c=g+vec2(float(i),float(j));vec2 q=c+.15+.7*vec2(wh(c),wh(c+7.3));float d=length(p-q);if(d<d1){d2=d1;d1=d;id=wh(c+3.1);}else if(d<d2)d2=d;}return vec3(d1,d2-d1,id);}
vec3 wglass(vec2 p,float sc,vec3 col,float lod){vec3 v=wvor(p*sc);vec3 c=col*(.72+.4*wf(vec2(p.x*6.+v.z*10.,p.y*2.)))*(1.08-.35*min(v.x,1.));float lw=mix(.16,.06,lod);c*=smoothstep(lw*.6,lw,v.y);c=mix(c,c*.62,(1.-smoothstep(lw,lw*1.7,v.y))*lod);return c;}
vec3 wpal(float h,vec3 tint){return h<.6?tint:h<.75?vec3(.42,.2,.52):h<.88?vec3(.18,.46,.24):vec3(.64,.12,.1);}
vec4 nbWin(vec2 uv,float sd,float mode,float R,float t){
 float lod=1.-smoothstep(.012,.045,max(fwidth(uv.x),fwidth(uv.y)));
 float u=uv.x,v=1.-uv.y;
 if(mode<1.5){
  vec2 pg=vec2(u*2.,v*R),pi=floor(pg),pl=fract(pg);
  float e=min(min(u,1.-u),min(v,1.-v)),mw=mix(.05,.028,lod),mu=step(abs(u-.5),mw),mv=step(.5-mw*R*.55,abs(fract(v*R+.5)-.5))*step(.06,e);
  float pe=min(min(pl.x,1.-pl.x),min(pl.y,1.-pl.y));
  if(mode<.5){
   if(e<.03)return vec4(.03,.025,.02,1.);if(mu+mv>0.)return vec4(.07,.06,.05,1.);
   float wu=u+lod*(.012*sin(v*38.+sd*20.)+.007*sin(v*97.+pi.x*2.)),wv=v+lod*.01*sin(u*33.+pi.y*1.7);
   vec3 c=mix(vec3(.36,.43,.56),vec3(.08,.09,.12),smoothstep(-.15,1.1,wv));float off=(wh(pi+sd*13.)-.5)*.3;
   c=mix(c,vec3(.5,.55,.66),(1.-smoothstep(0.,.055,abs(wu*.7+wv-.5-off)))*.38);
   c=mix(c,vec3(.36,.4,.48),(1.-smoothstep(0.,.016,abs(wu*.7+wv-.68-off)))*.28*lod);
   if(wh(pi+sd*7.+1.)>.72){float d=length(pl-vec2(.62,.38));c+=vec3(1.,.62,.3)*exp(-d*d*90.)*.35;}
   float cu=wh(vec2(sd,3.))>.5?1.-u:u;if(cu<.34){float fo=.6+.4*cos(cu*70.+sin(v*5.)*1.5);c=mix(c,vec3(.16,.12,.1)*fo,.4*smoothstep(.34,.22,cu));}
   c*=.6+.4*smoothstep(0.,.2,pe);c*=1.+(wf(vec2(u,v)*7.+sd*10.)-.5)*.3*lod;
   if(fract(sd*7.)<.3&&pi==vec2(1.,1.)&&abs(pl.x-.25-.45*pl.y)<.01*lod)c+=vec3(.25,.27,.3);
   return vec4(c*1.1,.15);}
  float fl=.88+.08*sin(t*6.3+sd*40.)+.04*sin(t*15.1+sd*70.);
  if(e<.03)return vec4(vec3(.03,.015,.008)*fl,1.);if(mu+mv>0.)return vec4(vec3(.1,.055,.028)*fl,1.);
  float lx=.3+.35*wh(vec2(sd,1.)),gl=exp(-((u-lx)*(u-lx)*4.+(v-.82)*(v-.82)*2.4))*fl;
  vec3 c=mix(vec3(.17,.08,.035),vec3(.93,.64,.33),gl*.92);c*=.5+.5*smoothstep(0.,.55,v);
  if(wh(vec2(sd,2.))>.35&&u>.6&&u<.9&&v>.32)c*=mix(1.,.5,lod);if(v>.88)c*=.72;
  float side=wh(vec2(sd,5.))>.5?1.-u:u,ed=.26+.035*sin(v*11.+sd*9.),cm=smoothstep(ed+.03,ed-.02,side);
  vec3 fab=vec3(.82,.36,.15)*(.6+.3*cos(side*80.+sin(v*6.)*2.)*lod)*fl*.85;c=mix(c,fab,.85*cm);
  c*=(.9+.12*wf(vec2(u*8.,v*15.+sd*9.))*lod)*(.92+.12*wh(pi+sd*3.));c*=.78+.22*smoothstep(0.,.15,pe);
  c*=mix(vec3(1.),vec3(1.05,.9,.72),wh(vec2(sd,8.)));float m=max(c.r,max(c.g,c.b));if(m>.85)c*=.85/m;
  return vec4(c*.82,.1);}
 float pu=(.9+.06*sin(t*1.3+sd*20.)+.04*sin(t*3.7))*1.35;
 if(mode<2.5){
  vec2 P=vec2((u-.5)*2.,(1.-v)*R);float de=min(1.-abs(P.x),min(P.y,R-P.y));
  float gl=(.62+.38*exp(-(P.x*P.x*.9+pow(P.y/R-.55,2.)*2.5)))*pu;
  if(de<.07)return vec4(.02,.018,.016,1.);
  if(de<.3){float k=mod(floor(P.y*3.)+(P.x>0.?1.:0.),2.);return vec4(wglass(P,4.,k>.5?vec3(.64,.12,.1):vec3(.12,.24,.62),lod)*gl*1.05,.1);}
  float my=R*.5,md=length(P-vec2(0.,my));
  if(abs(md-.6)<mix(.08,.045,lod))return vec4(.02,.018,.016,1.);
  if(md<.6){if(md<.24)return vec4(wglass(P,6.,vec3(.78,.58,.14),lod)*gl*1.2,.1);float a=atan(P.y-my,P.x);return vec4(wglass(P,3.5,mod(floor((a+3.2)*1.6),2.)>.5?vec3(.64,.12,.1):vec3(.18,.46,.24),lod)*gl,.1);}
  if(abs(P.y-R*.22)<.035*lod||abs(P.y-R*.8)<.035*lod)return vec4(.02,.018,.016,1.);
  vec3 vv=wvor(P*1.6);return vec4(wglass(P,1.6,wpal(fract(vv.z*1.618),uWTint),lod)*gl,.1);}
 vec2 P=(uv-.5)*2.;float r=length(P);float gl=(.75+.25*(1.-r))*pu;
 if(r>.9)return vec4(.02,.018,.016,1.);
 if(abs(r-.24)<.05)return vec4(.02,.018,.016,1.);if(r<.24)return vec4(wglass(P,5.,vec3(.78,.58,.14),lod)*gl*1.2,.1);
 float best=9.;vec2 F[4];F[0]=vec2(0.,.45);F[1]=vec2(0.,-.45);F[2]=vec2(.45,0.);F[3]=vec2(-.45,0.);float fi=0.;
 for(int i=0;i<4;i++){float d=length(P-F[i]);if(d<best){best=d;fi=float(i);}}
 if(best<.47){if(best>.42)return vec4(.02,.018,.016,1.);return vec4(wglass(P,4.,mod(fi,2.)>.5?vec3(.64,.12,.1):uWTint,lod)*gl,.1);}
 float a=atan(P.y,P.x);return vec4(wglass(P,3.,mod(floor((a+3.2)*1.9),2.)>.5?vec3(.78,.58,.14):uWTint*.8,lod)*gl,.1);}
`;
// mode: 0 ciemne, 1 swiatlo, 2 witraz, 3 rozeta; R: liczba rzedow szybek (tryby 0-1) albo wysokosc/polszerokosc witraza (tryb 2)
function winGlass(mat,mode,R,tint){if(!NB_WIN)return mat;const prev=mat.onBeforeCompile,th=tint===undefined?0x1e3c9e:tint,tk=tint===undefined?1:1.3,tc=[(th>>16&255)/255*tk,(th>>8&255)/255*tk,(th&255)/255*tk];R=R||3;mat.userData.nbWin=1;
  mat.onBeforeCompile=sh=>{if(prev)prev.call(mat,sh);sh.uniforms.uWT=NB_WIN_T;sh.uniforms.uWTint={value:new THREE.Vector3(tc[0],tc[1],tc[2])};
   sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute float nbSeed;varying vec2 vWUv;varying float vWS;')
    .replace('#include <project_vertex>','#include <project_vertex>\nvWUv=uv;vWS=nbSeed>0.?nbSeed:fract(sin(dot(modelMatrix[3].xyz,vec3(12.99,78.23,37.71)))*43758.55);');
   sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vWUv;varying float vWS;uniform float uWT;uniform vec3 uWTint;'+NB_WIN_GLSL)
    .replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\n{vec4 wc=nbWin(vWUv,vWS,'+mode.toFixed(1)+','+R.toFixed(2)+',uWT);vec3 lc=pow(max(wc.rgb,vec3(0.)),vec3(2.2));totalEmissiveRadiance=lc;diffuseColor.rgb*=wc.a;}')};
  mat.customProgramCacheKey=()=>'nbwin'+mode+'r'+R+(prev?'c'+String(prev).length:'');return mat}
// cieple swiatlo okna na murze (plaszczyzna z gradientem, addytywnie)
let NB_SPILL=null;
function winSpillMat(){if(NB_SPILL)return NB_SPILL;const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d'),gr=g.createRadialGradient(32,36,2,32,36,31);
  gr.addColorStop(0,'rgba(255,170,90,1)');gr.addColorStop(.45,'rgba(255,140,60,.35)');gr.addColorStop(1,'rgba(255,120,40,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);
  const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;
  NB_SPILL=cutaway(new THREE.MeshBasicMaterial({map:tx,transparent:true,opacity:.7,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,depthWrite:false}));NB_SPILL.userData.nbWin=1;return NB_SPILL}
function worldSurfN(mat,key,scale,str,wk){const e=OSADA_TX[key];wk=wk||0;mat.map=osadaTex(e[0]);mat.emissiveMap=null;mat.bumpMap=null;const nt=osadaTex(e[1]),prev=mat.onBeforeCompile,sc=scale.toFixed(2),st=(str||1).toFixed(2);
  mat.onBeforeCompile=sh=>{if(prev)prev.call(mat,sh);sh.uniforms.uNrm={value:nt};
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vWW;varying vec3 vWN;').replace('#include <project_vertex>','#include <project_vertex>\nvec4 wwp=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\nwwp=instanceMatrix*wwp;\n#endif\nvWW=(modelMatrix*wwp).xyz;vWN=normalize(mat3(modelMatrix)*objectNormal);');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vWW;varying vec3 vWN;uniform sampler2D uNrm;'+(wk?NB_WEATHER:''))
     .replace('#include <map_fragment>','vec3 nW0=normalize(vWN);vec2 wuv=abs(nW0.y)>.5?vWW.xz:(abs(nW0.x)>.5?vec2(vWW.z,vWW.y):vec2(vWW.x,vWW.y));wuv/='+sc+';vec4 sampledDiffuseColor=texture2D(map,wuv);diffuseColor*=sampledDiffuseColor;'+nbWeather(wk))
     .replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\n{vec3 T,B;if(abs(nW0.y)>.5){T=vec3(1.,0.,0.);B=vec3(0.,0.,-sign(nW0.y));}else if(abs(nW0.x)>.5){T=vec3(0.,0.,-sign(nW0.x));B=vec3(0.,1.,0.);}else{T=vec3(sign(nW0.z),0.,0.);B=vec3(0.,1.,0.);}vec3 tn=texture2D(uNrm,wuv).xyz*2.-1.;tn.xy*='+st+';vec3 pw=normalize(T*tn.x+B*tn.y+nW0*max(tn.z,.2));normal=normalize((viewMatrix*vec4(pw,0.)).xyz);}')};
  mat.customProgramCacheKey=()=>'nbwsn'+sc+st+'w'+wk+(prev?'c'+String(prev).length:'');return mat}
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
 {const ob=mat.onBeforeCompile;mat.onBeforeCompile=sh=>{ob(sh);sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute float aw;varying float vAw;').replace('#include <begin_vertex>','#include <begin_vertex>\nvAw=aw;');sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vAw;').replace('#include <fog_fragment>','#include <fog_fragment>\ngl_FragColor.a*=vAw;')};mat.customProgramCacheKey=()=>'waterAw';mat.transparent=true;mat.depthWrite=false}mesh.castShadow=false;mesh.receiveShadow=true;ROOT.add(mesh);
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
   const b=wp.length/3;if(lv){const ym=yb+Math.min(.22,(t-yb)*.4);wp.push(ax,yb,az,bx,yb,bz,ax,ym,az,bx,ym,bz,ax,t,az,bx,t,bz);const hv=(px,pz)=>{const q=Math.sin(px*12.9898+pz*78.233)*43758.5453;return .78+.4*(q-Math.floor(q))},ha=hv(ax,az),hb=hv(bx,bz),mu=(c,h)=>c.map(v=>v*h);/* 24.11.2026 (grafik): sciana misy lawy nie jest jednolita plama: kazdy wierzcholek ma inna jasnosc skaly */wc.push(...mu(bot,ha),...mu(bot,hb),...mu(mid,ha),...mu(mid,hb),...mu(top,ha),...mu(top,hb));wi.push(b,b+1,b+2,b+1,b+3,b+2,b+2,b+3,b+4,b+3,b+5,b+4)}else{wp.push(ax,yb,az,bx,yb,bz,ax,t,az,bx,t,bz);wc.push(...bot,...bot,...top,...top);wi.push(b,b+1,b+2,b+1,b+3,b+2)}}}
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
 const mat=liquidMat({map:lt,emissiveMap:et,emissive:opt.emissive||0xff6a28,emissiveIntensity:.8,...(opt.color?{color:opt.color,shininess:opt.shin||60,specular:opt.spec||0x401820}:{})},1),mesh=new THREE.Mesh(g,mat);if(opt.soft){const ob=mat.onBeforeCompile;mat.onBeforeCompile=sh=>{ob(sh);sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute float aw;varying float vAw;').replace('#include <begin_vertex>','#include <begin_vertex>\nvAw=aw;');sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vAw;').replace('#include <fog_fragment>','#include <fog_fragment>\ngl_FragColor.a*=vAw;')};mat.customProgramCacheKey=()=>'lavaAw';mat.transparent=true;mat.depthWrite=false}mesh.castShadow=false;mesh.receiveShadow=false;ROOT.add(mesh);
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
