/* ============ SPRITE SHEETS ============ */
// sprite planes: 32 game px = 2 world units; feet line sits 2 px above the cell bottom
// depth of the visible ground strip (tiles) for the minimap frame; 13 tiles at the old 40° camera
const VIEW_H=13*Math.sin(40*Math.PI/180)/Math.sin(PITCH);
// sprites stand upright and are stretched to undo the camera tilt so that their pixels come out square, as drawn
const SQ=1/Math.cos(PITCH);
const geo32=new THREE.PlaneGeometry(2,2).translate(0,.875,0);
const geo64=new THREE.PlaneGeometry(4,4).translate(0,1.875,0);
const geoC=new THREE.PlaneGeometry(2,2);
// sprites face the camera but take light as if tilted toward the sky, so torches above still light them
for(const g of [geo32,geo64,geoC,geoT,geo64w]){const n=g.attributes.normal;for(let i=0;i<n.count;i++)n.setXYZ(i,0,.8,.6);n.needsUpdate=true}
const GLOW=[[255,42,42],[127,208,255],[127,255,208]],GLOW_PROP=GLOW.concat([[255,106,26],[255,179,71]]);
// rim colours [texture r,g,b, glow r,g,b]: a faint cold rim for fighters, a warm golden halo for NPCs
const SELF_LIT=.16;
// outline softening: share of neighbour colour (darkened) mixed into the edge, edge glow, edge width of 64 px frames (was 2)
const OUTLINE_MIX=.7,OUTLINE_DARK=.42,OUTLINE_EM=.5,OUTLINE_W64=1.5,OUTLINE_OUTER=.5;
// 15.11.2026: poswiata obwodki NPC -20% (bylo 50,39,30)
const OUTLINE={char:[44,38,48,62,54,70],npc:[65,51,40,40,31,24],kat:[16,11,11,30,20,18]};
// lift: move the picture up by n pixels (64 px sheets have their feet 2 px lower than the 32 px ones)
// lagodna normalizacja jasnosci i nasycenia calego arkusza (liczona raz z miniatury), zeby modele z roznych zrodel stały obok siebie spojnie
function sheetNorm(img){if(img.nbNorm)return img.nbNorm;let r={gl:1,gs:1};try{const cw=96,ch=Math.max(8,Math.round(96*img.height/img.width)),c=canvas(cw,ch),g=c.getContext('2d');g.drawImage(img,0,0,cw,ch);const d=g.getImageData(0,0,cw,ch).data;let n=0,L=0,S=0;for(let i=0;i<d.length;i+=4){if(d[i+3]<200)continue;const R=d[i],G=d[i+1],B=d[i+2],mx=Math.max(R,G,B),mn=Math.min(R,G,B);n++;L+=.299*R+.587*G+.114*B;S+=mx?(mx-mn)/mx:0}
 if(n>150){const cl=(v,a,b)=>Math.max(a,Math.min(b,v));r={gl:cl(1+.4*(58/(L/n)-1),.9,1.12),gs:cl(1+.4*(.41/(S/n)-1),.88,1.12)}}}catch(e){quietErr('sheetNorm',e)}return img.nbNorm=r}
// hit flash: the same colour texture, every visible pixel painted with the material colour (no separate white canvas per frame; 5.11.2026)
function flashMat(tex){const m=new THREE.MeshBasicMaterial({map:tex,alphaTest:.5,side:THREE.DoubleSide,color:0xfff0e0});m.customProgramCacheKey=()=>'flashwhite';
  m.onBeforeCompile=sh=>{sh.fragmentShader=sh.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\ndiffuseColor.rgb=diffuse;')};return m}
function lazyMat(o,k,mk){const v=mk();Object.defineProperty(o,k,{value:v,writable:true,configurable:true,enumerable:true});return v}
// first-frame material for hero meshes before setFrame runs (does not touch the lazy legacy hero)
function heroIdleMat(){const D=A.heroD,f=D&&D.idle_down&&D.idle_down[0];return (f||A.hero.idle_down[0]).n}
function procFrame(img,x,y,size,h,kind,lift=0){
  // New painted palettes: only known live flames/shrines emit light; gold and depleted shrines do not.
  const key=img.nbKey,hd=img.nbDensity>1,warm=hd&&(/^p[134]_(debris_fire|cz_fire|pyre|order_bonfire)|^p5_candelabra/.test(key||'')||(key==='br_props'&&((y===64&&x>=64)||(y===96&&x<64)||(y===160&&x===0)))||(key==='dm_props'&&(y===0||y===128))||(key==='zl_props'&&y===96)||(key==='cz_props'&&y===0)||(key==='cy_big'&&y===256&&x>=64)||(key==='cy_props'&&y===0)),cool=hd&&(key==='p4_standing_stone_lit'||(key==='dm_props'&&((x===32&&y===64)||(x===32&&y===160)))||(key==='zl_props'&&x===64&&y===128)||(key==='cz_props'&&((x===64&&y===32)||(y===128&&x<64))));
  const density=img.nbDensity||1,logicalW=size,w=size*density;x*=density;y*=density;h=(h||size)*density;lift*=density;
  const c=canvas(w,h),g=c.getContext('2d');g.drawImage(img,x,y,w,h-lift,0,0,w,h-lift);
  // 15.11.2026: mocniejsze kolory wszystkich wrogow i NPC (nasycenie i kontrast w polcieniach), raz przy wczytaniu klatki.
  // Takze Dzwonnik i Woskownica (stare arkusze). Bez Rycerza, Zabojczyni i Kata (nowe arkusze, juz nasycone) i bez zalogi portu.
  if((kind===undefined||kind===null||kind==='boss'||kind==='npc'||kind==='thin'||kind==='propc'||kind==='ghost')&&!/^(hero_|zab_|knight_|kat_|dzw_|mil_)/.test(key||'')){const idc=g.getImageData(0,0,w,h),q=idc.data;
    for(let i=0;i<q.length;i+=4){if(!q[i+3])continue;const l=.299*q[i]+.587*q[i+1]+.114*q[i+2],k=Math.pow(Math.max(l,1)/255,.12);for(let j=0;j<3;j++)q[i+j]=Math.max(0,Math.min(255,(l+(q[i+j]-l)*1.6)*k))}
    g.putImageData(idc,0,0)}
  // nowy styl bohaterow (malowane HD, 15.11.2026): bez rozjasnianej krawedzi w teksturze i z cienszym konturem
  const hdHero=/^(knight_|zab_|kat_|dzw_|mil_)/.test(key||''); /* 15.11.2026: + Dzwonnik i Woskownica w nowym stylu */
  if(density>=2&&(kind===undefined||kind==='boss')&&!hdHero){const id0=g.getImageData(0,0,w,h),p=id0.data,w0=density,w1=Math.round(density*2.5),A=new Uint8Array(w*h);
    if(!/^(hero_|kat_|zab_|knight_|dzw_|mil_)/.test(img.nbKey||'')){const nm=sheetNorm(img);if(Math.abs(nm.gl-1)>.01||Math.abs(nm.gs-1)>.01)for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;const l=.299*p[i]+.587*p[i+1]+.114*p[i+2];p[i]=Math.max(0,Math.min(255,(l+(p[i]-l)*nm.gs)*nm.gl));p[i+1]=Math.max(0,Math.min(255,(l+(p[i+1]-l)*nm.gs)*nm.gl));p[i+2]=Math.max(0,Math.min(255,(l+(p[i+2]-l)*nm.gs)*nm.gl))}}for(let i=0;i<w*h;i++)A[i]=p[i*4+3]>127?1:0;
    for(let yy=w1;yy<h;yy++)for(let xx=w1;xx<w;xx++){const i=yy*w+xx;if(!A[i]||!A[i-w0*w-w0]||A[i-w1*w-w1])continue;const j=i*4;p[j]=Math.min(255,p[j]*1.3+19);p[j+1]=Math.min(255,p[j+1]*1.3+24);p[j+2]=Math.min(255,p[j+2]*1.3+38)}
    g.putImageData(id0,0,0)}
  const tex=texFrom(c);
  if(density>1)tex.minFilter=THREE.LinearFilter;
  if(kind==='fx')return{n:new THREE.MeshBasicMaterial({map:tex,alphaTest:.5,side:THREE.DoubleSide,fog:false,transparent:true,opacity:.82,color:0xfff0e0})};
  const id=g.getImageData(0,0,w,h),d=id.data,glow=kind==='prop'||kind==='propc'||kind==='npc'?GLOW_PROP:GLOW;
  const ec=canvas(w,h),eg=ec.getContext('2d'),ed=eg.createImageData(w,h),selfLit=kind!=='prop';
  for(let i=0;i<d.length;i+=4){
    ed.data[i+3]=255;
    if(d[i+3]>0){
      if(selfLit){ed.data[i]=d[i]*SELF_LIT;ed.data[i+1]=d[i+1]*SELF_LIT;ed.data[i+2]=d[i+2]*SELF_LIT}
      if((warm&&d[i]>175&&d[i+1]>50&&d[i+2]<d[i+1]*.7)||(cool&&d[i+1]>100&&d[i+2]>150&&d[i]<d[i+2]*.7)||glow.some(q=>q[0]===d[i]&&q[1]===d[i+1]&&q[2]===d[i+2])){ed.data[i]=d[i];ed.data[i+1]=d[i+1];ed.data[i+2]=d[i+2]}}
  }
  // outline: every empty pixel touching the figure gets a rim colour that also glows a little, so figures read against any floor
  // 'thin': ragged bosses full of loose pixels (crows, rags) get a single-pixel rim
  const ol=kind==='npc'?OUTLINE.npc:(kind===undefined||kind===null||kind==='propc'||kind==='thin')?(/^(kat|zab|knight|dzw|mil)_/.test(key||'')?OUTLINE.kat:OUTLINE.char):null;
  // 64 px frames get a 2 px rim so it looks as thick on screen as the 1 px rim of the 32 px frames
  // same result as growing the rim one pixel per pass (4-neighbour), computed in two sweeps: pixels within N steps of the figure
  if(ol){const N=Math.ceil((hdHero?.75:logicalW>=64&&kind!=='thin'&&kind!=='npc'?OUTLINE_W64:1)*density),D=new Int32Array(w*h),d0=d.slice();
    for(let j=0;j<w*h;j++)D[j]=d[j*4+3]?0:1e9;
    for(let py=0;py<h;py++)for(let px=0;px<w;px++){const j=py*w+px;let v=D[j];if(!v)continue;if(px>0&&D[j-1]+1<v)v=D[j-1]+1;if(py>0&&D[j-w]+1<v)v=D[j-w]+1;D[j]=v}
    for(let py=h-1;py>=0;py--)for(let px=w-1;px>=0;px--){const j=py*w+px;let v=D[j];if(!v)continue;if(px<w-1&&D[j+1]+1<v)v=D[j+1]+1;if(py<h-1&&D[j+w]+1<v)v=D[j+w]+1;D[j]=v}
    for(let j=0;j<w*h;j++){const v=D[j];if(!v||v>N)continue;const i=j*4;
      const soft=kind!=='npc',oo=soft?OUTLINE_OUTER:1;let r=ol[0]*oo,gg=ol[1]*oo,b=ol[2]*oo;
      if(soft&&v===1&&OUTLINE_MIX>0){let n=0,ar=0,ag=0,ab=0;const x=j%w,y=(j/w)|0;for(const q of [x>0?j-1:-1,x<w-1?j+1:-1,y>0?j-w:-1,y<h-1?j+w:-1]){if(q<0||!d0[q*4+3])continue;n++;ar+=d0[q*4];ag+=d0[q*4+1];ab+=d0[q*4+2]}
        if(n){const k=OUTLINE_MIX;r=ol[0]*(1-k)+ar/n*OUTLINE_DARK*k;gg=ol[1]*(1-k)+ag/n*OUTLINE_DARK*k;b=ol[2]*(1-k)+ab/n*OUTLINE_DARK*k}}
      d[i]=r;d[i+1]=gg;d[i+2]=b;d[i+3]=255;const em2=soft?OUTLINE_EM:1;ed.data[i]=ol[3]*em2;ed.data[i+1]=ol[4]*em2;ed.data[i+2]=ol[5]*em2}
    g.putImageData(id,0,0)}
  eg.putImageData(ed,0,0);
  const em=texFrom(ec);
  if(hdHero&&kind!=='fx'&&typeof renderer!=='undefined'&&renderer&&(renderer.capabilities.isWebGL2||((w&(w-1))===0&&(h&(h-1))===0))){for(const map of [tex,em]){map.magFilter=THREE.LinearFilter;map.minFilter=THREE.LinearMipmapLinearFilter;map.generateMipmaps=true}} /* 16.11.2026: malowani bohaterowie probkowani gladko (bez ziarna i migotania detali) */
  if(kind==='portCrew'){
    // The painted cutouts already contain a fine edge. Filter each isolated cell at camera distance.
    for(const map of [tex,em]){
      map.magFilter=THREE.LinearFilter;
      map.minFilter=THREE.LinearMipmapLinearFilter;
      map.generateMipmaps=true;
    }
  }
  if(kind==='ghost')return{n:new THREE.MeshBasicMaterial({map:tex,alphaTest:.5,side:THREE.DoubleSide,transparent:true,opacity:.85,fog:false})};
  let padB=0,vis=1;if(kind==='prop'){let r=h-1;for(;r>=0;r--){let o=false;for(let q=0;q<w;q++)if(d[(r*w+q)*4+3]>=128){o=true;break}if(o)break}padB=Math.min(.15,Math.max(0,(h-1-r)/h));if(padB<.01)padB=0;let u=0;for(;u<=r;u++){let o=false;for(let q=0;q<w;q++)if(d[(u*w+q)*4+3]>=128){o=true;break}if(o)break}vis=(r-u+1)/h}
  return{padB,vis,
    n:(m=>{if(ol&&kind!=='npc')moonRim(m,density/w);return m})(phong({map:tex,emissiveMap:em,emissive:0xffffff,emissiveIntensity:kind==='npc'?.5:1,alphaTest:.5,side:THREE.DoubleSide,color:hdHero?0xdadada:/^hero_/.test(key||'')?0xb4b4b4:kind==='npc'?0xa4a4a4:0xffffff})) /* 16.11.2026: nowi bohaterowie 85% zamiast 70% */,
    // rarely used variants are made on first use (setFrame reads fr[mode]); 5.11.2026
    get f(){return lazyMat(this,'f',()=>flashMat(tex))},
    get i(){return lazyMat(this,'i',()=>phong({map:tex,emissiveMap:em,emissive:0xffffff,color:0x8fd0ff,alphaTest:.5,side:THREE.DoubleSide}))},
    get b(){return lazyMat(this,'b',()=>phong({map:tex,emissiveMap:em,emissive:0xffffff,color:0xc2304a,alphaTest:.5,side:THREE.DoubleSide}))},
    d:new THREE.MeshDistanceMaterial({map:tex,alphaTest:.5})};
}

let A=null,IMGS=null;
function fixHeroD(D,I){I=I||(typeof IMGS!=='undefined'?IMGS:null);if(D&&D.v2&&!D.knFx&&I&&I.knight_db&&I.hero_db===I.knight_db){D.knFx=1}
  if(D&&D.v2)for(const d of ['side','down','up']){const ready=D['idle_'+d][0];for(const combo of D.light[d])combo[3]=ready;D.heavy[d][3]=ready;if(D.parryDir)D.parryDir[d][3]=D.guard[d==='side'?0:d==='down'?1:2]}}
// ---- przemalowania rycerza z Krypty prestizu (runda 312): zbroja szaroczarna, peleryna i ostrze czarne z zarzacym konturem ----
function recolorHero(img,o,gc=4,gr=6){const W=img.width,H=img.height,c=canvas(W,H),g=c.getContext('2d');g.drawImage(img,0,0);const id=g.getImageData(0,0,W,H),p=id.data,N=W*H,dens=img.nbDensity||1;
  const cape=new Uint8Array(N),steel=new Uint8Array(N),blade=new Uint8Array(N);
  for(let i=0;i<N;i++){const j=i*4;if(p[j+3]<128)continue;const r=p[j],gg=p[j+1],b=p[j+2],mx=Math.max(r,gg,b),mn=Math.min(r,gg,b),sat=mx?(mx-mn)/mx:0;
    if(r>gg*1.6&&r>b*1.6&&r>60)cape[i]=1;else if(sat<.22&&mx>26&&Math.abs(r-b)<22)steel[i]=1}
  if(o.blade){const cw=Math.round(W/gc),ch=Math.round(H/gr),lab=new Int32Array(N),q=new Int32Array(N);let id2=0;
    for(let cy=0;cy<H;cy+=ch)for(let cx=0;cx<W;cx+=cw){const x1=Math.min(W,cx+cw),y1=Math.min(H,cy+ch);
      for(let y=cy;y<y1;y++)for(let x=cx;x<x1;x++){const s0=y*W+x;if(!steel[s0]||lab[s0])continue;const mxv=Math.max(p[s0*4],p[s0*4+1],p[s0*4+2]);if(mxv<72)continue;
        id2++;let qh=0,qt=0;q[qt++]=s0;lab[s0]=id2;let minx=x,maxx=x,miny=y,maxy=y;
        while(qh<qt){const k=q[qh++],kx=k%W,ky=(k-kx)/W;if(kx<minx)minx=kx;if(kx>maxx)maxx=kx;if(ky<miny)miny=ky;if(ky>maxy)maxy=ky;
          for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=kx+dx,ny=ky+dy;if(nx<cx||nx>=x1||ny<cy||ny>=y1)continue;const n=ny*W+nx;if(lab[n]||!steel[n])continue;const nm=Math.max(p[n*4],p[n*4+1],p[n*4+2]);if(nm<72)continue;lab[n]=id2;q[qt++]=n}}
        const L=Math.hypot(maxx-minx,maxy-miny),sc=dens/4;if(qt>=200*sc*sc&&L>=48*sc&&qt<L*15*sc)for(let t=0;t<qt;t++)blade[q[t]]=1}}}
  {const lab=new Uint8Array(N),q=new Int32Array(N),minA=60*(dens/4)*(dens/4);for(let s0=0;s0<N;s0++){if(!cape[s0]||lab[s0])continue;let qh=0,qt=0;q[qt++]=s0;lab[s0]=1;
    while(qh<qt){const k=q[qh++],kx=k%W;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=kx+dx,n=k+dy*W+dx;if(nx<0||nx>=W||n<0||n>=N||lab[n]||!cape[n])continue;lab[n]=1;q[qt++]=n}}
    if(qt<minA)for(let t=0;t<qt;t++)cape[q[t]]=0}}
  if(o.cape){const cl=new Uint8Array(N);for(let i=0;i<N;i++){const j=i*4;if(p[j+3]<128||cape[i])continue;const r=p[j],gg=p[j+1],bb=p[j+2],mx=r,sat=mx?(r-bb)/mx:0;if(r>=gg&&gg>=bb&&r>120&&r-bb>14&&r-bb<110&&sat<.42)cl[i]=1}
    const lab=new Uint8Array(N),q=new Int32Array(N),sc=(dens/4)*(dens/4);for(let s0=0;s0<N;s0++){if(!cl[s0]||lab[s0])continue;let qh=0,qt=0,x0=W,x1=0,y0=H,y1=0;q[qt++]=s0;lab[s0]=1;
      while(qh<qt){const k=q[qh++],kx=k%W,ky=(k-kx)/W;if(kx<x0)x0=kx;if(kx>x1)x1=kx;if(ky<y0)y0=ky;if(ky>y1)y1=ky;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=kx+dx,n=k+dy*W+dx;if(nx<0||nx>=W||n<0||n>=N||lab[n]||!cl[n])continue;lab[n]=1;q[qt++]=n}}
      const bw=x1-x0+1,bh=y1-y0+1;if(qt>=80*sc&&qt/(bw*bh)>=.35&&bh>=.9*bw)for(let t=0;t<qt;t++)cape[q[t]]=1}}
  const d=Math.max(1,Math.round(dens*.5)),edge=(M,i)=>{const x=i%W,y=(i-x)/W;return x<d||y<d||x>=W-d||y>=H-d||!M[i-d]||!M[i+d]||!M[i-d*W]||!M[i+d*W]};
  for(let i=0;i<N;i++){const j=i*4;if(p[j+3]<128)continue;const lum=.3*p[j]+.59*p[j+1]+.11*p[j+2];
    if(o.cape&&cape[i]){if(edge(cape,i)){p[j]=236;p[j+1]=52;p[j+2]=20}else{const v=lum*.22+6;p[j]=v+4;p[j+1]=v;p[j+2]=v}}
    else if(o.blade&&blade[i]){if(edge(blade,i)){p[j]=240;p[j+1]=60;p[j+2]=24}else{const v=lum*.28+6;p[j]=v+3;p[j+1]=v;p[j+2]=v}}
    else if(o.armor&&steel[i]&&!blade[i]){const v=lum*.42+8;p[j]=v;p[j+1]=v;p[j+2]=Math.min(255,v*1.06)}}
  g.putImageData(id,0,0);c.nbDensity=img.nbDensity;c.nbKey=img.nbKey;return c}
// 8.11.2026: armour sets of the three classes (Shrine of Ashes). Recolours the SOURCE sheet before procFrame,
// so outline, emission and moon rim are computed from the new colours. Armour = low-saturation metal pixels
// (red cloth and skin kept); the weapon follows the armour (detecting it apart was unreliable between animations).
// Per frame cell the top part of the figure is kept (Kat's hood, Ash Dancer's hair).
const ARM_PAL={kosc:[[58,46,36],[196,180,150],[252,246,230]],otch:[[4,3,7],[34,24,46],[150,104,186]],zloto:[[46,26,6],[196,144,44],[255,238,168]],plat:[[38,42,50],[168,176,190],[246,249,255]]};
const ARM_CFG={r:{sat:.42,lo:20,top:0},k:{sat:.42,lo:24,top:.15},z:{sat:.32,lo:50,top:.27},d:{sat:.42,lo:24,top:.22},m:{sat:.42,lo:24,top:.22,wax:1}};
function armorRecolor(img,cls,v){const P=ARM_PAL[v],C=ARM_CFG[cls];if(!P||!C)return img;
  const W=img.width,H=img.height,c=canvas(W,H),g=c.getContext('2d');g.drawImage(img,0,0);const id=g.getImageData(0,0,W,H),p=id.data,N=W*H,M=new Uint8Array(N);
  const cell=Math.round(64*(img.nbDensity||4)),sc=cell/256,minA=14*sc*sc;
  for(let i=0;i<N;i++){const j=i*4;if(p[j+3]<128)continue;const r=p[j],gg=p[j+1],b=p[j+2],mx=Math.max(r,gg,b),mn=Math.min(r,gg,b),sat=mx?(mx-mn)/mx:0;
    if(r>gg*1.5&&r>b*1.5)continue;if(C.wax&&r>=gg&&gg>=b&&mx>110&&sat>.1)continue;if(r>gg&&gg>b&&sat>.25&&r>110)continue;if(sat<C.sat&&mx>C.lo&&Math.abs(r-b)<44)M[i]=1}
  const q=new Int32Array(cell*cell),seen=new Uint8Array(N);
  for(let y0=0;y0<H;y0+=cell)for(let x0=0;x0<W;x0+=cell){const x1=Math.min(W,x0+cell),y1=Math.min(H,y0+cell);let top=-1,bot=-1;
    for(let y=y0;y<y1&&top<0;y++)for(let x=x0;x<x1;x++)if(p[(y*W+x)*4+3]>=128){top=y;break}
    if(top<0)continue;for(let y=y1-1;y>=y0&&bot<0;y--)for(let x=x0;x<x1;x++)if(p[(y*W+x)*4+3]>=128){bot=y;break}
    const cut=Math.floor(top+(bot-top)*C.top);for(let y=y0;y<cut;y++)for(let x=x0;x<x1;x++)M[y*W+x]=0;
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const s0=y*W+x;if(!M[s0]||seen[s0])continue;let qh=0,qt=0;q[qt++]=s0;seen[s0]=1;
      while(qh<qt){const k=q[qh++],kx=k%W,ky=(k-kx)/W;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=kx+dx,ny=ky+dy;if(nx<x0||nx>=x1||ny<y0||ny>=y1)continue;const n=ny*W+nx;if(seen[n]||!M[n])continue;seen[n]=1;if(qt<q.length)q[qt++]=n}}
      if(qt<minA)for(let t=0;t<qt;t++)M[q[t]]=0}}
  for(let i=0;i<N;i++){if(!M[i])continue;const j=i*4;let t=((.3*p[j]+.59*p[j+1]+.11*p[j+2])/255-.04)/.72;t=t<0?0:t>1?1:Math.pow(t,.9);
    const A=t<.5?P[0]:P[1],B=t<.5?P[1]:P[2],u=t<.5?t/.5:(t-.5)/.5;p[j]=A[0]+(B[0]-A[0])*u;p[j+1]=A[1]+(B[1]-A[1])*u;p[j+2]=A[2]+(B[2]-A[2])*u}
  g.putImageData(id,0,0);c.nbDensity=img.nbDensity;c.nbKey=img.nbKey;return c}
// kolor tkaniny (Kaplica, 15.11.2026): mocno czerwone płaty (peleryna, przepaska, chusta, szarfa) bez głowy, drobiny pominięte
const CAPE_PAL={nocna:[[6,8,24],[40,60,140],[170,200,255]],popielna:[[20,20,22],[110,108,104],[230,226,218]],zlota:[[40,24,4],[180,130,40],[255,236,160]],zielona:[[6,20,10],[40,110,50],[170,230,150]]};
const CAPE_CFG={r:{top:.06},k:{top:.3},z:{top:.08},m:{top:.3},d:{top:.3}};
function capeRecolor(img,cls,v){const P=CAPE_PAL[v],C=CAPE_CFG[cls];if(!P||!C)return img;
  const W=img.width,H=img.height,c=canvas(W,H),g=c.getContext('2d');g.drawImage(img,0,0);const id=g.getImageData(0,0,W,H),p=id.data,N=W*H,M=new Uint8Array(N);
  const cell=Math.round(64*(img.nbDensity||4)),sc=cell/256,minA=40*sc*sc;
  for(let i=0;i<N;i++){const j=i*4;if(p[j+3]<128)continue;const r=p[j];if(r>p[j+1]*1.9&&r>p[j+2]*1.7&&r>55)M[i]=1}
  const q=new Int32Array(cell*cell),seen=new Uint8Array(N);
  for(let y0=0;y0<H;y0+=cell)for(let x0=0;x0<W;x0+=cell){const x1=Math.min(W,x0+cell),y1=Math.min(H,y0+cell);let top=-1,bot=-1;
    for(let y=y0;y<y1&&top<0;y++)for(let x=x0;x<x1;x++)if(p[(y*W+x)*4+3]>=128){top=y;break}
    if(top<0)continue;for(let y=y1-1;y>=y0&&bot<0;y--)for(let x=x0;x<x1;x++)if(p[(y*W+x)*4+3]>=128){bot=y;break}
    const cut=Math.floor(top+(bot-top)*C.top);for(let y=y0;y<cut;y++)for(let x=x0;x<x1;x++)M[y*W+x]=0;
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const s0=y*W+x;if(!M[s0]||seen[s0])continue;let qh=0,qt=0;q[qt++]=s0;seen[s0]=1;
      while(qh<qt){const k=q[qh++],kx=k%W,ky=(k-kx)/W;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=kx+dx,ny=ky+dy;if(nx<x0||nx>=x1||ny<y0||ny>=y1)continue;const n=ny*W+nx;if(seen[n]||!M[n])continue;seen[n]=1;if(qt<q.length)q[qt++]=n}}
      if(qt<minA)for(let t=0;t<qt;t++)M[q[t]]=0}}
  for(let i=0;i<N;i++){if(!M[i])continue;const j=i*4;let t=((.3*p[j]+.59*p[j+1]+.11*p[j+2])/255-.04)/.72;t=t<0?0:t>1?1:Math.pow(t,.9);
    const A=t<.5?P[0]:P[1],B=t<.5?P[1]:P[2],u=t<.5?t/.5:(t-.5)/.5;p[j]=A[0]+(B[0]-A[0])*u;p[j+1]=A[1]+(B[1]-A[1])*u;p[j+2]=A[2]+(B[2]-A[2])*u}
  g.putImageData(id,0,0);c.nbDensity=img.nbDensity;c.nbKey=img.nbKey;return c}
function skinRecolor(img,cls,arm,cape){let o=img;if(arm)o=armorRecolor(o,cls,arm);if(cape)o=capeRecolor(o,cls,cape);return o}
const MOB_GROUPS={'core':['possessed','ghoul','bat','dwarf','knight','warden','shieldman'],'r3':['madman','hound','rotknight','militia','marauder','gravedigger'],'r4':['goat','wolf','bandit','xbow','drowner','strzygon','zmora','wisp','bies','wight'],'r5':['guard','scribe','executioner','debtor','wraith','courtraven','paperrat','bookgolem','condemned','judge','arbiter','cursed'],'r2':['glizzard','glz_fx']};
/* 23.11.2026 (runda 866): goscie z innych rozdzialow; ich arkusze mob_* sa tez w grupie danego rozdzialu (00_grupy_sprite.js), madman w core */
const MOB_GUEST={core:['madman'],r2:['militia'],r4:['gravedigger'],r5:['rotknight','marauder']};
function buildAnims(imgs,group="all"){
  const has=g=>group==="all"||group===g;
  const bz=has("r3")&&!imgs.morhad?beastSheet():null,bs=(c,r)=>procFrame(bz,c*64,r*64,64,64);
  // sheets redrawn at 64x64 (same layout, cells twice as big) are detected by their width and drawn at the same size in the world
  const HI=new Set(['protagonist_a','protagonist_b','village_undead','order_deep_dead','ally_npcs','effects_pickups','collector','zl_en_a','zl_en_b','npc_new','cz_en_a','cz_en_b','cz_en_c','cz_npc','shield_dead','goat_beast','cy_en_a','cy_en_b','cy_en_c','cy_en_d','zl_en_c','cy_npc','hero_d','hero_db','hero_dc','hero_dd','hero_def','knight_d','knight_db','knight_dc','knight_dd','knight_def','knight_death','knight_whirl','knight_lunge','kat_death','kat_leap','kat_whirl','kat_hook','zab_d','zab_db','zab_dc','zab_dd','zab_def','zab_death','zab_rend','zab_fan','zab_whirl','zab_atk45','dzw_d','dzw_db','dzw_dc','dzw_dd','dzw_def','dzw_ex','dzw_sk','dzw_zas','mil_d','mil_db','mil_dc','mil_dd','mil_def','mil_ex','mil_sk','mil_fx','golem_a','golem_b']);
  const row=(sheet,r,from=0,to=4,kind,size=32)=>{const k=(HI.has(sheet)||sheet.startsWith('mob_')||sheet.startsWith('npc_'))&&imgs[sheet].width/(imgs[sheet].nbDensity||1)>=256?2:1,cs=size*k;const out=[];for(let c=from;c<to;c++)out.push(procFrame(imgs[sheet],c*cs,r*cs,cs,cs,kind,k>1?2:0));return out};
  const ha='protagonist_a',hb='protagonist_b',vu='village_undead',od='order_deep_dead',an='ally_npcs',fx='effects_pickups';
  const pick=has('core')?row(fx,5,0,4,'fx'):[];
  const mkHeroD=()=>({idle_down:row('hero_d',0),idle_side:row('hero_d',1),idle_up:row('hero_d',2),walk_down:row('hero_d',3),walk_side:row('hero_d',4),walk_up:row('hero_d',5),
      ...(imgs.hero_db&&imgs.hero_dc&&imgs.hero_dd?{v2:true,light:{side:[0,1,2].map(i=>row('hero_db',i)),down:[3,4,5].map(i=>row('hero_db',i)),up:[0,1,2].map(i=>row('hero_dc',i))},heavy:{side:row('hero_dc',3),down:row('hero_dc',4),up:row('hero_dc',5)},
        guard:((imgs.zab_dd&&imgs.hero_dd===imgs.zab_dd)&&imgs.hero_def)?[row('hero_def',3)[1],row('hero_def',4)[0],row('hero_def',5)[0],row('hero_def',3)[1]]:row('hero_dd',0),guard_walk:row('hero_dd',1),parry:row('hero_dd',2),...(imgs.hero_def?{parryDir:{side:row('hero_def',0),down:row('hero_def',1),up:row('hero_def',2)},guardWalkDir:{side:row('hero_def',3),down:row('hero_def',4),up:row('hero_def',5)}}:{}),broken:row('hero_dd',(imgs.zab_dd&&imgs.hero_dd===imgs.zab_dd)?4:3),roll:row('hero_dd',(imgs.zab_dd&&imgs.hero_dd===imgs.zab_dd)?3:4),hurt:row('hero_dd',5,0,2),charge:row('hero_dd',5,2,4)}:{}),...(imgs.kat_death&&imgs.kat_leap&&imgs.kat_whirl?{kat:{death:[...row('kat_death',0),...row('kat_death',1,0,2)],leap:{side:row('kat_leap',0),down:row('kat_leap',1),up:row('kat_leap',2)},whirlWind:row('kat_whirl',0),whirlLoop:[...row('kat_whirl',1),...row('kat_whirl',2)],whirlRec:row('kat_whirl',3),...(imgs.kat_hook?{hook:{side:[...row('kat_hook',0),...row('kat_hook',1)],down:[...row('kat_hook',2),...row('kat_hook',3)],up:[...row('kat_hook',4),...row('kat_hook',5)]}}:{})}}:{}),...(imgs.dzw_ex&&imgs.dzw_sk?{dzw:{death:[...row('dzw_ex',0),...row('dzw_ex',1)],leap:{side:row('dzw_ex',2),down:row('dzw_ex',3),up:row('dzw_ex',4)},ton:row('dzw_ex',5),whirlWind:row('dzw_sk',0),whirlLoop:row('dzw_sk',1),whirlRec:row('dzw_sk',2),echo:{side:row('dzw_sk',3),down:row('dzw_sk',4),up:row('dzw_sk',5)},...(imgs.dzw_zas?{cast:{side:row('dzw_zas',0),down:row('dzw_zas',1),up:row('dzw_zas',2)},emp:{side:row('dzw_zas',3),down:row('dzw_zas',4),up:row('dzw_zas',5)}}:{})}}:{}),...(imgs.mil_ex&&imgs.mil_sk?{mil:{death:[...row('mil_ex',0),...row('mil_ex',1)],eff:{side:row('mil_sk',1),down:row('mil_sk',0),up:row('mil_sk',2)},gut:{side:row('mil_sk',4),down:row('mil_sk',3),up:row('mil_sk',5)}}}:{}),...(imgs.knight_death&&imgs.knight_whirl?{kn:{death:[...row('knight_death',0),...row('knight_death',1,0,2)],...(imgs.knight_lunge?(()=>{const r=row('knight_lunge',3,0,3);return{lunge:{side:[...row('knight_lunge',0),r[0]],down:[...row('knight_lunge',1),r[1]],up:[...row('knight_lunge',2),r[2]]}}})():{}),whirlWind:row('knight_whirl',0),whirlLoop:[...row('knight_whirl',1),...row('knight_whirl',2)],whirlRec:row('knight_whirl',3)}}:{}),...(imgs.zab_death&&imgs.zab_rend&&imgs.zab_whirl&&imgs.zab_fan?{zab:{death:[...row('zab_death',0),...row('zab_death',1,0,2)],rend:{side:[...row('zab_rend',0),...row('zab_rend',1)],down:[...row('zab_rend',2),...row('zab_rend',3)],up:[...row('zab_rend',4),...row('zab_rend',5)]},fan:{side:[...row('zab_fan',0),...row('zab_fan',1)],down:[...row('zab_fan',2),...row('zab_fan',3)],up:[...row('zab_fan',4),...row('zab_fan',5)]},whirlWind:row('zab_whirl',0),whirlLoop:[...row('zab_whirl',1),...row('zab_whirl',2),...row('zab_whirl',3),...row('zab_whirl',4)],whirlRec:row('zab_whirl',5),...(imgs.zab_atk45?{hit:[{side:row('zab_atk45',0),down:row('zab_atk45',2),up:row('zab_atk45',4)},{side:row('zab_atk45',1),down:row('zab_atk45',3),up:row('zab_atk45',5)}]}:{})}}:{})});
  if(group==='hero'){const an={heroD:imgs.hero_d?mkHeroD():null};fixHeroD(an.heroD,imgs);return an}
  const anims={
    ...(has("core")?{
    // the hero keeps the greatsword drawn (S1: idle and walk in three directions)
    ...(imgs.hero_d?{heroD:mkHeroD()}:{}),
    dwarf:{walk:row(od,2),attack:row(od,3,0,2),death:row(od,3,2,4)},
    possessed:{walk:row(vu,0),attack:row(vu,1,0,2),death:row(vu,1,2,4)},
    knight:{walk:row(od,0),attack:row(od,1,0,2),death:row(od,1,2,4)},
    collector:{front:row('collector',0),walk:row('collector',1),attack:row('collector',2),drain:row('collector',3),hurt:row('collector',4,0,2),taunt:row('collector',4,2,4),death:row('collector',5)},
    elder:row(an,2,0,4,'npc'),marga:imgs.npc_new&&imgs.npc_new.height/(imgs.npc_new.nbDensity||1)>=256?row('npc_new',3,0,4,'npc'):row(an,3,0,4,'npc'),wit:row(an,4,0,4,'npc'),
    ...(imgs.npc_new?{chojrak:row('npc_new',0,0,4,'npc'),mila:row('npc_new',1,0,4,'npc'),heri:row('npc_new',2,0,4,'npc'),npcNew:1}:{chojrak:row(ha,0,0,4,'npc'),mila:row(ha,0,0,4,'npc'),heri:row(ha,0,0,4,'npc')}),
    warden:{walk:row(od,4),attack:row(od,5,0,2),death:row(od,5,2,4)},
    shieldman:imgs.shield_dead?{walk:row('shield_dead',0),attack:row('shield_dead',1,0,2),death:row('shield_dead',1,2,4),sheet:1}:{walk:row(od,0),attack:row(od,1,0,2),death:row(od,1,2,4)},
    ghoul:{walk:row(vu,2),attack:row(vu,3,0,2),death:row(vu,3,2,4)},
    bat:{walk:row(vu,4),attack:row(vu,4),death:row(vu,5,0,2)},
    }:{}),
    ...(has("r3")?{
    ...(imgs.zl_en_a?{
      madman:{walk:row('zl_en_a',0),attack:row('zl_en_a',1,0,2),death:row('zl_en_a',1,2,4),sheet:1},
      hound:{walk:row('zl_en_a',2),attack:row('zl_en_a',3,0,2),death:row('zl_en_a',3,2,4),sheet:1},
      rotknight:{walk:row('zl_en_a',4),attack:row('zl_en_a',5,0,2),death:row('zl_en_a',5,2,4),sheet:1},
      monk:{walk:row('zl_en_b',0,0,4,'propc'),attack:row('zl_en_b',1,0,2,'propc'),death:row('zl_en_b',1,2,4,'propc'),sheet:1},
      fireball:row('zl_en_b',2,0,4,'prop'),
      izolda:row('zl_en_b',3,0,4,'npc'),ottokar:row('zl_en_b',4,0,4,'npc'),aurel:row('zl_en_b',5,0,4,'npc')}:{
      madman:{walk:row(vu,0),attack:row(vu,1,0,2),death:row(vu,1,2,4)},
      hound:{walk:row(vu,2),attack:row(vu,3,0,2),death:row(vu,3,2,4)},
      rotknight:{walk:row(od,0),attack:row(od,1,0,2),death:row(od,1,2,4)},
      monk:{walk:row(vu,0),attack:row(vu,1,0,2),death:row(vu,1,2,4)},
      izolda:row(an,2,0,4,'npc'),ottokar:row(an,4,0,4,'npc'),aurel:row(an,2,0,4,'npc')}),
    // chapter III: new mobs instead of the firing monk (Rotten Militiaman, Black Marauder, Gravedigger)
    ...(imgs.zl_en_c?{
      militia:{walk:row('zl_en_c',0),attack:row('zl_en_c',1,0,2),death:row('zl_en_c',1,2,4),sheet:1},
      marauder:{walk:row('zl_en_c',2),attack:row('zl_en_c',3,0,2),death:row('zl_en_c',3,2,4),sheet:1},
      gravedigger:{walk:row('zl_en_c',4),attack:row('zl_en_c',5,0,2),death:row('zl_en_c',5,2,4),sheet:1}}:{
      militia:{walk:row(od,0),attack:row(od,1,0,2),death:row(od,1,2,4)},marauder:{walk:row(od,0),attack:row(od,1,0,2),death:row(od,1,2,4)},gravedigger:{walk:row(vu,0),attack:row(vu,1,0,2),death:row(vu,1,2,4)}}),
    // Morhad: Z6 (walk, wind-up/slam, death) and Z6b (charge, leap/dive, enraged roar), 64 px cells
    beast:imgs.morhad?(()=>{const m=(c,r)=>procFrame(imgs.morhad,c*64,r*64,64,64),w=[m(0,0),m(1,0),m(2,0),m(3,0)];return{walk:w,attack:[m(0,1),m(1,1)],death:[m(2,1),m(3,1)],
      charge:w,leap:[m(0,1),m(1,1)],rage:[m(0,1),m(0,1),m(0,1)],sheet:1}})():{walk:[bs(0,0),bs(1,0)],attack:[bs(0,1),bs(1,1)],death:[bs(0,2),bs(1,2)]},
    }:{}),
    ...(has("r5")?{
    ...(imgs.cy_npc?{skryba:row('cy_npc',0,0,4,'npc'),straznik:row('cy_npc',1,0,4,'npc'),pieczetnik:row('cy_npc',2,0,4,'npc')}:{skryba:row(an,2,0,4,'npc'),straznik:row(ha,0,0,4,'npc'),pieczetnik:row(an,3,0,4,'npc')}),
    // chapter V mid-boss Rachmistrz replaces the Collector in chapter V (swapped in useWorld)
    ...(imgs.wierz1&&imgs.wierz2?(()=>{const m=(k,c,r)=>procFrame(imgs[k],c*64,r*64,64,64),w=(k)=>[0,1,2,3].map(c=>m(k,c,0));return{bossC5:{walk:w('wierz1'),attack:[m('wierz1',0,1),m('wierz1',1,1)],snap:[m('wierz1',2,1)],rise:[m('wierz1',3,1)],walk2:w('wierz2'),slam2:[m('wierz2',0,1)],cast2:[m('wierz2',1,1)],call2:[m('wierz2',2,1)],death:[m('wierz2',0,2),m('wierz2',1,2)],sheet:1}}})():{}),
    ...(imgs.rachm?(()=>{const m=(c,r)=>procFrame(imgs.rachm,c*64,r*64,64,64),w=[m(0,0),m(1,0),m(2,0),m(3,0)];return{collectorC5:{front:[m(0,0)],walk:w,attack:[m(0,1),m(1,1)],drain:[m(0,1)],hurt:[m(0,0)],taunt:[m(0,1)],death:[m(2,1),m(3,1)],sheet:1}}})():{}),
    // chapter V (K5, K6, K6b); without the sheets the old enemies stand in
    ...(imgs.cy_en_a?{
      guard:{walk:row('cy_en_a',0),attack:row('cy_en_a',1,0,2),death:row('cy_en_a',1,2,4),sheet:1},
      scribe:{walk:row('cy_en_a',2),attack:row('cy_en_a',3,0,2),death:row('cy_en_a',3,2,4),sheet:1},
      executioner:{walk:row('cy_en_a',4),attack:row('cy_en_a',5,0,2),death:row('cy_en_a',5,2,4),sheet:1}}:{
      guard:{walk:row(od,0),attack:row(od,1,0,2),death:row(od,1,2,4)},scribe:{walk:row(vu,0),attack:row(vu,1,0,2),death:row(vu,1,2,4)},executioner:{walk:row(od,4),attack:row(od,5,0,2),death:row(od,5,2,4)}}),
    ...(imgs.cy_en_b?{
      debtor:{walk:row('cy_en_b',0),attack:row('cy_en_b',1,0,2),death:row('cy_en_b',1,2,4),sheet:1},
      wraith:{walk:row('cy_en_b',2,0,4,'propc'),attack:row('cy_en_b',3,0,2,'propc'),death:row('cy_en_b',3,2,4,'propc'),sheet:1},
      courtraven:{walk:row('cy_en_b',4),attack:row('cy_en_b',5,0,2),death:row('cy_en_b',5,2,4),sheet:1}}:{
      debtor:{walk:row(vu,0),attack:row(vu,1,0,2),death:row(vu,1,2,4)},wraith:{walk:row(vu,4),attack:row(vu,4),death:row(vu,5,0,2)},courtraven:{walk:row(vu,4),attack:row(vu,4),death:row(vu,5,0,2)}}),
    ...(imgs.cy_en_c?{
      paperrat:{walk:row('cy_en_c',0),attack:row('cy_en_c',1,0,2),death:row('cy_en_c',1,2,4),sheet:1},
      bookgolem:{walk:row('cy_en_c',2),attack:row('cy_en_c',3,0,2),death:row('cy_en_c',3,2,4),sheet:1},
      condemned:{walk:row('cy_en_c',4),attack:row('cy_en_c',5,0,2),death:row('cy_en_c',5,2,4),sheet:1}}:{
      paperrat:{walk:row(vu,2),attack:row(vu,3,0,2),death:row(vu,3,2,4)},bookgolem:{walk:row(od,4),attack:row(od,5,0,2),death:row(od,5,2,4)},condemned:{walk:row(vu,0),attack:row(vu,1,0,2),death:row(vu,1,2,4)}}),
    // chapter V: new mobs (Judge, Seal Arbiter, Cursed Knight); without the sheet the old guards stand in
    ...(imgs.cy_en_d?{
      judge:{walk:row('cy_en_d',0),attack:row('cy_en_d',1,0,2),death:row('cy_en_d',1,2,4),sheet:1},
      arbiter:{walk:row('cy_en_d',2),attack:row('cy_en_d',3,0,2),death:row('cy_en_d',3,2,4),sheet:1},
      cursed:{walk:row('cy_en_d',4),attack:row('cy_en_d',5,0,2),death:row('cy_en_d',5,2,4),sheet:1}}:{
      judge:{walk:row(od,0),attack:row(od,1,0,2),death:row(od,1,2,4)},arbiter:{walk:row(od,4),attack:row(od,5,0,2),death:row(od,5,2,4)},cursed:{walk:row(od,0),attack:row(od,1,0,2),death:row(od,1,2,4)}}),
    // chapter IV (K5, K6, KC, K7); without the sheets the old enemies stand in
    }:{}),
    ...(has("r4")?{
    goat:imgs.goat_beast?{walk:row('goat_beast',0),attack:row('goat_beast',1,0,2),death:row('goat_beast',1,2,4),sheet:1}:{walk:row(vu,2),attack:row(vu,3,0,2),death:row(vu,3,2,4)},
    ...(imgs.cz_en_a?{
      wolf:{walk:row('cz_en_a',0),attack:row('cz_en_a',1,0,2),death:row('cz_en_a',1,2,4),sheet:1},
      bandit:{walk:row('cz_en_a',2),attack:row('cz_en_a',3,0,2),death:row('cz_en_a',3,2,4),sheet:1},
      xbow:{walk:row('cz_en_a',4),attack:row('cz_en_a',5,0,2),death:row('cz_en_a',5,2,4),sheet:1}}:{
      wolf:{walk:row(vu,2),attack:row(vu,3,0,2),death:row(vu,3,2,4)},bandit:{walk:row(od,0),attack:row(od,1,0,2),death:row(od,1,2,4)},xbow:{walk:row(vu,0),attack:row(vu,1,0,2),death:row(vu,1,2,4)}}),
    ...(imgs.cz_en_b?{
      drowner:{rise:row('cz_en_b',0,0,2),walk:row('cz_en_b',0,2,4),attack:row('cz_en_b',1,0,2),death:row('cz_en_b',1,2,4),sheet:1},
      strzygon:{walk:row('cz_en_b',2),attack:row('cz_en_b',3,0,2),death:row('cz_en_b',3,2,4),sheet:1},
      zmora:{walk:row('cz_en_b',4,0,3),attack:row('cz_en_b',4,3,4),death:row('cz_en_b',5,0,2),sheet:1},
      wisp:{walk:row('cz_en_b',5,2,3,'propc'),attack:row('cz_en_b',5,3,4,'propc'),death:row('cz_en_b',5,3,4,'propc'),sheet:1}}:{
      drowner:{rise:row(vu,1,2,4),walk:row(vu,0),attack:row(vu,1,0,2),death:row(vu,1,2,4)},strzygon:{walk:row(vu,2),attack:row(vu,3,0,2),death:row(vu,3,2,4)},
      zmora:{walk:row(vu,4),attack:row(vu,4),death:row(vu,5,0,2)},wisp:{walk:row(fx,5,0,1,'fx'),attack:row(fx,5,0,1,'fx'),death:row(fx,5,0,1,'fx')}}),
    ...(imgs.cz_en_c?{
      bies:{walk:row('cz_en_c',0),attack:row('cz_en_c',1,0,2),death:row('cz_en_c',1,2,4),sheet:1},
      wight:{walk:row('cz_en_c',2),attack:row('cz_en_c',3,0,2),death:row('cz_en_c',3,2,4),sheet:1}}:{
      bies:{walk:row(od,4),attack:row(od,5,0,2),death:row(od,5,2,4)},wight:{walk:row(od,0),attack:row(od,1,0,2),death:row(od,1,2,4)}}),
    ...(imgs.cz_npc?{wierz:row('cz_npc',0,0,4,'npc'),bartosz:row('cz_npc',1,0,4,'npc'),wolch:row('cz_npc',2,0,4,'npc'),boginka_lure:row('cz_npc',3,0,2),
      boginka:imgs.pani_lasu?(()=>{const m=(c,r)=>procFrame(imgs.pani_lasu,c*64,r*64,64,64);return{walk:[0,1,2,3].map(c=>m(c,0)),attack:[m(0,1),m(1,1)],death:[m(2,1),m(3,1)],sheet:1}})():{walk:row('cz_npc',3,2,4),attack:row('cz_npc',3,3,4),death:imgs.cz_en_b?row('cz_en_b',1,2,4):row(vu,1,2,4),sheet:1}}:{
      wierz:row(an,3,0,4,'npc'),bartosz:row(ha,0,0,4,'npc'),wolch:row(an,2,0,4,'npc'),boginka_lure:row(an,3,0,2),boginka:{walk:row(vu,2),attack:row(vu,3,0,2),death:row(vu,3,2,4)}}),
    // Cumlin (chapter II boss): 64 px cells, 4 columns x 7 rows (walk, idle, slam, sweep, tell, rage, death); cumlin_fx: 32 px cells, 4x4
    ...(imgs.cumlin?(()=>{const m=(c,r)=>procFrame(imgs.cumlin,c*64,r*64,64,64,'thin'),rw=r=>[0,1,2,3].map(c=>m(c,r)),dth=rw(6);return{cumlin:{walk:rw(0),idle:rw(1),slam:rw(2),sweep:rw(3),tell:rw(4),rage:rw(5),death:dth,hurt:[dth[1]],sheet:1}}})():{}),
    ...(imgs.cumlin_fx?(()=>{const m=(c,r)=>procFrame(imgs.cumlin_fx,c*32,r*32,32,32,'fx'),rw=r=>[0,1,2,3].map(c=>m(c,r));return{cumlinFx:{shards:rw(0),dust:rw(1),drips:rw(2),wave:rw(3)}}})():{}),
    // Leszy (K8) and the Strzyga Mother (K9, second soul K9b): 64 px cells, 2x3 grid
    ...(imgs.leszy?(()=>{const m=(img,c,r)=>procFrame(imgs[img],c*64,r*64,64,64,'thin');return{
      leszy:{walk:[m('leszy',0,0),m('leszy',1,0),m('leszy',2,0),m('leszy',3,0)],summon:[m('leszy',0,1)],strike:[m('leszy',1,1)],merge:[m('leszy',2,1)],attack:[m('leszy',1,1),m('leszy',1,1)],death:[m('leszy',2,1),m('leszy',3,1)],sheet:1},
      strzyga:{walk:[m('strzyga',0,0),m('strzyga',1,0)],scream:[m('strzyga',0,1)],slash:[m('strzyga',1,1)],burst:[m('strzyga',0,2)],attack:[m('strzyga',1,1),m('strzyga',1,1)],death:[m('strzyga',0,2),m('strzyga',1,2)],
        ...(imgs.strzyga_b?{crawl:[m('strzyga_b',0,0),m('strzyga_b',1,0)],leap:[m('strzyga_b',0,1)],land:[m('strzyga_b',1,1)],raise:[m('strzyga_b',0,2)],roar:[m('strzyga_b',1,2)]}:{crawl:[m('strzyga',0,0),m('strzyga',1,0)],leap:[m('strzyga',1,1)],land:[m('strzyga',1,1)],raise:[m('strzyga',0,1)],roar:[m('strzyga',0,1)]}),sheet:1}}})():{}),
    }:{}),
    ...(has('core')?{
    boss:{walk:row('boss_zrost',0,0,4,null,64),attack:[row('boss_zrost',1,1,2,null,64)[0],row('boss_zrost',1,0,1,null,64)[0]],death:row('boss_zrost',3,0,4,null,64)},
    golem:imgs.golem_a&&imgs.golem_b?{walk:[1,2,3,4].flatMap(r=>row('golem_a',r)),idle:row('golem_a',5),slam:row('golem_b',2,0,2),atk:[0,1,2,3,4].flatMap(r=>row('golem_b',r))}:{walk:row(an,0),slam:row(an,1,0,2),idle:row(an,1,2,4)},
    tharm:row(an,5,0,4,'ghost'),
    fx:{slash:row(fx,0,0,4,'fx'),spin:row(fx,1,0,4,'fx'),nova:row(fx,2,0,4,'fx'),inferno:row(fx,3,0,4,'fx'),spikes:row(fx,4,0,4,'fx')},
    pick:{1:pick[0],2:pick[1],5:pick[2],c:pick[3]}
    }:{})
  };
  // New mob models (12.11.2026): one sheet per enemy, 4 columns x 2 rows of 256 px (row 0 walk, row 1: two attack frames + two death frames); on-screen size matches the old sheets
  for(const g in MOB_GROUPS)if(has(g))for(const k of MOB_GROUPS[g].concat(MOB_GUEST[g]||[])){const S_='mob_'+k;if(!imgs[S_])continue;const kd=k==='wraith'||k==='wisp'?'propc':undefined;
    if(k==='glz_fx')anims.glzFx={fly:row(S_,0,0,4,'fx'),splash:[...row(S_,2,0,4,'fx'),...row(S_,3,0,4,'fx')]};
    else if(k==='glizzard')anims.glizzard={walk:row(S_,0),idle:row(S_,1),tell:row(S_,2),attack:[row(S_,3,1,2)[0],row(S_,3,2,3)[0]],hurt:row(S_,4,0,2),death:row(S_,4,2,4),curl:row(S_,5,0,2),sheet:1};
    else if(k==='drowner')anims.drowner={rise:row(S_,0,0,2),walk:row(S_,0,2,4),attack:row(S_,1,0,2),death:row(S_,1,2,4),sheet:1};
    else anims[k]={walk:row(S_,0,0,4,kd),attack:row(S_,1,0,2,kd),death:row(S_,1,2,4,kd),sheet:1}}
  // NPC models (12.11.2026): one sheet per character, 4 columns x 256 px (frames 0-2 idle, frame 3 = dead/gone), in the group of the act where they live
  const NPC_GROUPS={'core':['chojrak','marga','elder','wit','nawoj'],'r2':['mila','tharm','rudna'],'r3':['heri','izolda','ottokar','aurel','seweryna'],'r4':['wierz','bartosz','wolch','dobromir'],'r5':['skryba','straznik','pieczetnik','lucjan'],'r6':['ambrozy','wieslawa']};
  for(const g in NPC_GROUPS)if(has(g))for(const k of NPC_GROUPS[g])if(imgs['npc_'+k])anims[k]=row('npc_'+k,0,0,4,k==='tharm'?'ghost':'npc');
  // old one-piece hero (protagonist_a/b): only a fallback behind heroD, so its frames are built on first use, not at start (5.11.2026: ~35 MB of canvases)
  if(has("core"))Object.defineProperty(anims,'hero',{configurable:true,enumerable:false,get(){const v={idle_down:row(ha,0),walk_down:row(ha,1),walk_up:row(ha,2),walk_side:row(ha,3),roll:row(ha,4),hurt:row(ha,5,0,2),
      swing_side:row(hb,0),swing_down:row(hb,1),swing_up:row(hb,2),death:row(hb,3).concat(row(hb,4,0,2)),idle_up:row(hb,5,0,2),idle_side:row(hb,5,2,4)};Object.defineProperty(anims,'hero',{value:v,writable:true,configurable:true,enumerable:false});return v}});
  // Return to the same grip and blade length after every attack/deflection.
  fixHeroD(anims.heroD,imgs);
  return anims;
}
function enemyWinding(e){return e.ghoulWind>0||e.sw>0||e.ctw>0||e.chT>0||e.hamT>0||e.atkT>0||e.castWind>0||e.fanWind>0||e.stealWind>0||e.drainWind>0||e.aim>0||e.tw>0||e.mode==='wind'||e.mode==='root'||e.mode==='up'}
function attackCue(e){if(e.dead||e.rise>0||e.stun>0||e.frozen>0||e.trans>0)return null;
  return enemyWinding(e)?(e.sw>0&&e.red?(SETT.contrast?'y':'r'):'w'):null}
function setFrame(mesh,fr,mode){if(!fr)return;
  if(mode==='p2'&&!fr.p2){const m=fr.n.clone();if(fr.n.map){m.map=recolorTex(fr.n.map);if(m.emissiveMap)m.emissiveMap=m.map}fr.p2=m}
  const STT={sg:[0x8aff5a,.55],so:[0xff9a40,.6],sb:[0xe03048,.4],sc:[0x9adcff,.5],sh:[0x7a62d8,.45],se:[0xa8d8cf,.5]};if(STT[mode]&&!fr[mode]){const m=fr.n.clone(),s=STT[mode];m.color.setHex(s[0]);if(m.emissive){m.emissive.setHex(s[0]);if(!PLYN)m.emissiveMap=fr.n.map;m.emissiveIntensity=PLYN?s[1]*.35:s[1]}if(mode==='sh'||mode==='se'){m.transparent=true;m.opacity=mode==='se'?.72:.6;m.depthWrite=false}fr[mode]=m}
  if((mode==='w'||mode==='r'||mode==='y')&&!fr[mode]){const m=fr.n.clone(),color=mode==='r'?0xff694b:mode==='y'?0xffdf62:0xffe1b0;
    m.color.setHex(color);if(m.emissive){m.emissive.setHex(color);if(!PLYN)m.emissiveMap=fr.n.map;m.emissiveIntensity=PLYN?(mode==='w'?.2:.3):mode==='w'?.7:.85}if(!PLYN)m.fog=false;fr[mode]=m}/* 26.11 (autor: przyciecia przed atakami): z PLYN podswietlenie nie zmienia mgly ani map, wiec karta nie kompiluje nowego shadera w walce */
  if(mode==='impact'&&!fr.impact){void fr.f;const m=combatVisualBuild(()=>fr.n.clone());m.color.setHex(0xffd9be);if(m.emissive){m.emissive.setHex(0x7a3020);m.emissiveIntensity=PLYN?.12:.38;if(!PLYN)m.emissiveMap=fr.n.map}fr.impact=m}
  mesh.material=(mode&&fr[mode])||fr.n;if(mesh.userData.groundContact)settleProp(mesh);if(fr.d)mesh.customDistanceMaterial=fr.d}

const at=(anim,t,fps,loop=true)=>anim[loop?Math.floor(t*fps)%anim.length:Math.min(anim.length-1,Math.floor(t*fps))];

let heroMesh,margaMesh;
// Znacznik pod stopami gracza: miekka ciepla plama swiatla bez krawedzi (16.11.2026: zamiast pierscienia z trzema widocznymi strefami), zeby bohater nie ginal w tlumie. ?heromark=0 wylacza.
const HERO_MARK_ON=nbParam('heromark')!=='0';
const heroMarks=(()=>{const c=canvas(128,128),g=c.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);for(let i=0;i<=16;i++){const r=i/16;gr.addColorStop(r,'rgba(255,255,255,'+(.6*Math.exp(-r*r*4.2)*(1-r*r)).toFixed(3)+')')}g.fillStyle=gr;g.fillRect(0,0,128,128);const t=texFrom(c);t.magFilter=t.minFilter=THREE.LinearFilter;
 return [0xffbd72,0xf4b4d2].map(col=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:t,color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.5,fog:false}));m.visible=false;m.renderOrder=-2;m.frustumCulled=false;scene.add(m);return m})})();
function heroMark(i,p){const m=heroMarks[i];if(!HERO_MARK_ON||!p||p.dead||!S||S.phase!=='play'){m.visible=false;return}m.visible=true;m.position.set(p.x/16,.045,p.y/16);const s=2.35+(p.roll>0?.3:0);m.scale.set(s,1,s);m.material.opacity=(SETT.flash?.4:.3)*(p.inv>0&&p.roll<=0?.7:1)}
const MAXB=420;const blobs=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:contactTex,transparent:true,depthWrite:false}),MAXB);scene.add(blobs);
const wispGlow={1:'#7fd0ff',2:'#9ef0a0',5:'#ff6b6b',c:'#e0b84a'};for(const k in wispGlow)wispGlow[k]=new THREE.MeshBasicMaterial({map:glowC(wispGlow[k]),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,opacity:.55});
const glowGeo=new THREE.PlaneGeometry(.7,.7);
const MAXP=3000,pPos=new Float32Array(MAXP*3),pCol=new Float32Array(MAXP*3);
const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3).setUsage(THREE.DynamicDrawUsage));pGeo.setAttribute('color',new THREE.BufferAttribute(pCol,3).setUsage(THREE.DynamicDrawUsage));
const points=new THREE.Points(pGeo,new THREE.PointsMaterial({size:2,sizeAttenuation:false,vertexColors:true,fog:false}));points.frustumCulled=false;scene.add(points);
const RAIN_N=650,rainPos=new Float32Array(RAIN_N*6),rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3).setUsage(THREE.DynamicDrawUsage));
const rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0x8c9cb8,transparent:true,opacity:.32,fog:false}));rain.frustumCulled=false;scene.add(rain);
const DROPS=[];for(let i=0;i<RAIN_N;i++)DROPS.push({x:rnd(-15,15),y:rnd(0,12),z:rnd(-10,10),s:rnd(15,21)});
const colCache={};const col=h=>colCache[h]||(colCache[h]=new THREE.Color(h));

// post-processing: low-res target, tilt-shift blur at top and bottom, vignette
const rt=new THREE.WebGLRenderTarget(16,9,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});
const postMat=new THREE.ShaderMaterial({uniforms:{tD:{value:rt.texture},uSh:{value:0},uCA:{value:0},tB:{value:null},useB:{value:0},shock:{value:new THREE.Vector4()},res:{value:new THREE.Vector2(480,270)},hurt:{value:0},flash:{value:0},sharp:{value:0},bri:{value:1},low:{value:0},hq:{value:0},haze:{value:0},tm:{value:0},gSh:{value:new THREE.Vector3(1,1,1)},gHi:{value:new THREE.Vector3(1,1,1)},gSat:{value:1},gCon:{value:1},grain:{value:0},gtm:{value:0},cold:{value:new THREE.Color(0xdceaff)},warm:{value:new THREE.Color(0xffeedc)}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
  fragmentShader:`uniform sampler2D tD;uniform float uSh;uniform float uCA;uniform sampler2D tB;uniform float useB;uniform vec4 shock;uniform vec2 res;uniform float hurt;uniform float flash;uniform float sharp;uniform float bri;uniform float low;uniform float hq;uniform float haze;uniform float tm;uniform vec3 gSh;uniform vec3 gHi;uniform float gSat;uniform float gCon;uniform float grain;uniform float gtm;uniform vec3 cold;uniform vec3 warm;varying vec2 vUv;
  void main(){float u=max(res.y/720.,1.);vec2 uv=vUv;float sk=0.;if(shock.w>0.){float ar=res.x/res.y;vec2 d=(vUv-shock.xy)*vec2(ar,1.);float r=length(d);sk=smoothstep(.06,0.,abs(r-shock.z*.95))*shock.w;uv-=d/max(r,1e-4)*sk*.022/vec2(ar,1.);}if(haze>0.){vec3 h0=texture2D(tD,uv-vec2(0.,.03)).rgb;float hot=smoothstep(.22,.55,h0.r-h0.b)*smoothstep(.5,.85,h0.r);uv.x+=(sin(uv.y*95.+tm*5.3)+sin(uv.y*41.-tm*3.1))*.0013*hot*haze;}vec3 c=texture2D(tD,uv).rgb;if(uCA>0.){vec2 cd=(uv-.5)*uCA*.014;c.r=texture2D(tD,uv+cd).r;c.b=texture2D(tD,uv-cd).b;}if(uSh>0.){vec2 px=1./res;vec3 nb=texture2D(tD,uv+vec2(0.,px.y)).rgb+texture2D(tD,uv-vec2(0.,px.y)).rgb+texture2D(tD,uv+vec2(px.x,0.)).rgb+texture2D(tD,uv-vec2(px.x,0.)).rgb;c=max(c+(c-nb*.25)*uSh,vec3(0.));}float focus=smoothstep(.28,.51,abs(vUv.y-.51))*(1.-sharp);
    if(useB>.5){vec3 b=texture2D(tB,uv).rgb;float fo=smoothstep(.24,.5,abs(vUv.y-.5))*(1.-sharp*.7);c=mix(c,b,fo*.72);vec3 bl=max(b-vec3(.45),vec3(0.));c+=bl*bl*.8+bl*.12;}
    else if(low<.5){vec3 soft=vec3(0.),glow=vec3(0.);float total=0.;
      for(int i=-1;i<=1;i++)for(int j=-1;j<=1;j++){float w=1.-.22*float(i*i+j*j);vec3 s=texture2D(tD,vUv+vec2(float(i),float(j))*(2.+focus*1.5)*u/res).rgb;soft+=s*w;glow+=max(s-vec3(.52),vec3(0.))*w;total+=w;}
      c=mix(c,soft/total,focus*.55)+glow/total*.28;}
    if(hq>.5&&useB<.5){vec3 bl=vec3(0.);for(int k=0;k<16;k++){float a=float(k)*.3927;float rr=(k<8?3.5:8.)*u;vec3 s=texture2D(tD,vUv+vec2(cos(a),sin(a))*rr/res).rgb;bl+=max(s-vec3(.5),vec3(0.))*(k<8?1.:.7);}c+=bl/13.6*.34;}
    c+=sk*.07;float l=dot(c,vec3(.2126,.7152,.0722));c*=mix(mix(vec3(1.),cold,.5),mix(vec3(1.),warm,.35),smoothstep(.08,.65,l));
    c=pow(max(c,vec3(0.)),vec3(.97));c=c*(1.05+.15*c)/(1.+.25*c);{float l2=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l2),c,gSat);c*=mix(gSh,gHi,smoothstep(.04,.5,l2));c=max((c-.18)*gCon+.18,vec3(0.));}
    float vignette=1.-smoothstep(${KLIMAT_ON?'.3,.8':'.36,.82'},length((vUv-.5)*vec2(1.05,.95)));c*=mix(${KLIMAT_ON?'.56':'.72'},1.,vignette);if(grain>0.){float gn=fract(sin(dot(gl_FragCoord.xy+floor(gtm*24.)*vec2(17.13,9.71),vec2(12.9898,78.233)))*43758.5453)-.5;c+=gn*grain*(.4+.6*smoothstep(0.,.45,dot(c,vec3(.333))));}
    c=mix(c,vec3(c.r*1.2+.15,c.g*.5,c.b*.5),hurt);c=mix(c,c*2.4+vec3(.16,.19,.27),flash);
    if(hq>.5)c+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5)/255.;gl_FragColor=vec4(c*bri,1.);}`});
filmUniforms=postMat.uniforms;
const postScene=new THREE.Scene(),postCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),postMat));
// 9.11.2026: prawdziwe rozmycie HD-2D (góra i dół ekranu) i umiarkowana poświata: obraz w 1/4 rozdzielczości, dwa przebiegi rozmycia Gaussa
const BLUR={a:new THREE.WebGLRenderTarget(4,4,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:false}),b:new THREE.WebGLRenderTarget(4,4,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:false}),w:0,h:0};
const blurMat=new THREE.ShaderMaterial({uniforms:{tD:{value:null},dir:{value:new THREE.Vector2()}},depthTest:false,depthWrite:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
 fragmentShader:'uniform sampler2D tD;uniform vec2 dir;varying vec2 vUv;void main(){vec3 c=texture2D(tD,vUv).rgb*.2270;c+=(texture2D(tD,vUv+dir*1.3846).rgb+texture2D(tD,vUv-dir*1.3846).rgb)*.3162;c+=(texture2D(tD,vUv+dir*3.2308).rgb+texture2D(tD,vUv-dir*3.2308).rgb)*.0703;gl_FragColor=vec4(c,1.);}'});
const blurScene=new THREE.Scene();blurScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),blurMat));
function blurPasses(){const W0=rt.width,H0=rt.height,w=Math.max(8,Math.round(W0/4)),h=Math.max(8,Math.round(H0/4));if(w!==BLUR.w||h!==BLUR.h){BLUR.a.setSize(w,h);BLUR.b.setSize(w,h);BLUR.w=w;BLUR.h=h}
 const pass=(src,dst,dx,dy)=>{blurMat.uniforms.tD.value=src;blurMat.uniforms.dir.value.set(dx,dy);renderer.setRenderTarget(dst);renderer.render(blurScene,postCam)};
 pass(rt.texture,BLUR.a,2.2/W0,0);pass(BLUR.a.texture,BLUR.b,0,1/h);pass(BLUR.b.texture,BLUR.a,1.8/w,0);pass(BLUR.a.texture,BLUR.b,0,1.8/h);postMat.uniforms.tB.value=BLUR.b.texture}

/* 13.11.2026: menu/UI, kroki i odglosy rzemiosla (ksiega, sakiewka, drzwi krypty) z paczek Kenney RPG Audio / UI Audio (CC0) */
/* TomMusic + Owlish Media — prepared by tools/prepare-owlish-sfx.cjs */
const SFX_SAMPLES={"kenney_armor":"assets/dzwieki/363d2d403ec8661bc243d606c54e6764829fbb65e520ac1c5130153f12555f80.mp3","kenney_summon":"assets/dzwieki/21fd597a21af7959a66805f6bd630ba3cf09f894f4be31fe0fa9a1f16e571948.mp3","kenney_deflect":"assets/dzwieki/793be072dcb88cdab779b47178976c92dbe88c162f6abbe363749fbdf568be84.mp3","kenney_rx":"assets/dzwieki/c89f374ba71760443022d1b0de05d920295e778266a0e170ae1b558d53038836.mp3","kenney_rare":"assets/dzwieki/5e6416f5d0046c7498698e16f96099e8fba69a017a15b55849ee80e667f22590.mp3","kenney_champ":"assets/dzwieki/6424b803e2f0873f15f5c3f7bcab27d808647e0940e2fcdfae36e15df9385cfc.mp3","kenney_blastwarn":"assets/dzwieki/45eb2b0f67c73cf15e48d05235cc38e198aec2a25e6d4f4874378d55552a060c.mp3","kenney_blast":"assets/dzwieki/a22e9eef0d7de29e50a6755cb03b5ce9808ac1e86ecd56dcc5c47e085d150d03.mp3","Level Up Snare":"assets/dzwieki/3c5516886e8995f53c2bfd3d65fd420567ba9a99bb4d18974ce32c389e1b89a0.mp3","Sword Attack 1":"assets/dzwieki/25154cec1ed959935cc1b7a8a728c1eaedda87b75c01d750e033c9e7942a63de.mp3","Sword Attack 2":"assets/dzwieki/dd687aa757cf626758c5231780b3b6b14617e17dc974f201e4f05821fa89ce11.mp3","Sword Attack 3":"assets/dzwieki/b65e2c866ab005e5455708b5c65253f3d4addf8f3b39b1bc75c11acb96da8295.mp3","Sword Impact Hit 1":"assets/dzwieki/85b382b1e9e1011f48ace28e2996ec789944578d72ed98cb5664831eb2b88cfc.mp3","Sword Impact Hit 2":"assets/dzwieki/99fdcc4ff695385d5642a2ba21d32bf124ea506cad122e4607f083f596190161.mp3","Sword Blocked 1":"assets/dzwieki/e622475e143f097d12a81437161184b257b58738c1ecf8131430501b4968efcb.mp3","Sword Blocked 2":"assets/dzwieki/db5daf90206e562eddc378c03925e7a0c9f62cb167f513345604481b7372ea00.mp3","Sword Parry 1":"assets/dzwieki/20be0a0ff94830c967fd967cbef3f0f42369a85632545dce03f90e43358ef15c.mp3","Sword Parry 2":"assets/dzwieki/5be0c2d0366031e36c01bf088eeebe3c62a49f6577a32ef61f7ce3fb12e6411d.mp3","Sword Impact Hit 3":"assets/dzwieki/c4358ecfbb63e19ffc9a61934123dbb613e24c02c3c9e25cfe6bc26469658c57.mp3","Ice Throw 1":"assets/dzwieki/e14f335d41980db34c42719ee972f0e8a7100e7c5f88e5ab07baca59f5483956.mp3","Ice Throw 2":"assets/dzwieki/f1c792a79c1e5245e900adb71001de7b9681de35ef474a9409635d434b216a61.mp3","Rock Meteor Throw 1":"assets/dzwieki/074a22ca7bd4ec33c3f0fd412bec2d09724e08294295464de6ca975f3303fbbf.mp3","Fireball 1":"assets/dzwieki/8591cef4b00ca43a4baa2b34915e09f05473793b068c5786844d0b8400946c55.mp3","Fireball 2":"assets/dzwieki/1b8b57939e3a6a006bd2f5421f1ee5ff61437cfc64c79be2d955f728c78ac79f.mp3","Rock Wall 1":"assets/dzwieki/66eeb48e9b22f4ed221070a55446d6eea2235737878a066d7f33e5e6b0382b64.mp3","Rock Meteor Throw 2":"assets/dzwieki/f7ed7a1243d84eaa0cb5a4afa2c17f1499bef9f18294b32a53abd6ac85124223.mp3","Rock Wall 2":"assets/dzwieki/5b5e27f9d88ad6d82f9a01beebfeaac4f4b8e9478e85362231e17cb2ae61c781.mp3","Owlish/Impacts/flip.wav":"assets/dzwieki/6c32885affe39e5c22d72643a76036f01325c83e86128e712fc9a6e9f4560135.mp3","Owlish/UI/UI_024.wav":"assets/dzwieki/b6d95998833fbf557e2896fd21a9881aba5d03ae758b96499c4a8e9770e93bea.mp3","Owlish/UI/UI_040.wav":"assets/dzwieki/efd4460645b0f4aa0ce4421726853195cc29aebebd981be0bc87f407b08063a0.mp3","Owlish/80-CC0-RPG-SFX/item_coins_01.ogg":"assets/dzwieki/7c0938ddc084b863cf4c1b5d2bc0b4cb3b7c1252705333469c52acf23df28b25.mp3","Owlish/80-CC0-RPG-SFX/item_coins_02.ogg":"assets/dzwieki/c6ce80b685807745c19e100abc428d96799669c2ee5e82afb22442eb474e30d6.mp3","Owlish/80-CC0-RPG-SFX/item_coins_03.ogg":"assets/dzwieki/76697290695e486e73d2e16608c2c703c950f49913f0b70af0f2d30deb340cfb.mp3","Owlish/80-CC0-RPG-SFX/item_gem_02.ogg":"assets/dzwieki/b4504e126640beabb6f6fa9e825c664db0b67a3389198925cc60ed7b3d780f1b.mp3","Owlish/80-CC0-RPG-SFX/item_gem_03.ogg":"assets/dzwieki/4d58e079c800b8f019180630e6595d5347d25b5a3a6fcd0ad41757b38b410bad.mp3","Owlish/UI/UI_017.wav":"assets/dzwieki/e008d3b796ef3f64cd3892520ab2af6cf9a829d64c53316fa2f087830d082e9a.mp3","Owlish/80-CC0-RPG-SFX/spell_01.ogg":"assets/dzwieki/26e7c4ab03d723a7b93fc05041ff46ce08a4aab92be4718f29909d9e3039b1fa.mp3","Owlish/UI/UI_001.wav":"assets/dzwieki/4a508e780137c94b695071f4527826092e0dec569e4ffb871e0f2f8bc5441d27.mp3","Owlish/80-CC0-RPG-SFX/creature_monster_03.ogg":"assets/dzwieki/da163cc77b3a3be6e23d5644db25654abba99ce8fa58f7ed6c2dad8394e8b924.mp3","Owlish/80-CC0-RPG-SFX/creature_monster_04.ogg":"assets/dzwieki/5447e5d33412b09cdb407abbfd8565402b18a3af841d2fb440c787c29395b0d8.mp3","Owlish/80-CC0-RPG-SFX/creature_roar_01.ogg":"assets/dzwieki/a524633f6ea42a3fe61e4fc1e60e78049e8f8fec24c2a74387d348ca34a6ea2c.mp3","Owlish/80-CC0-RPG-SFX/creature_roar_02.ogg":"assets/dzwieki/88500a58b5394b373fbf51b93d4bef99e0191bd184a9b29cae3cc93e90eab665.mp3","Owlish/80-CC0-RPG-SFX/creature_roar_03.ogg":"assets/dzwieki/f67bf5040c25da3be64458be7bd2d84b31b33d43abd1853417809bad04d4d99d.mp3","Owlish/80-CC0-RPG-SFX/creature_hurt_01.ogg":"assets/dzwieki/ffe6dcb49b564d161675e70afa1891f9333dda1e9896d1c34cffd3670bcf7509.mp3","Owlish/80-CC0-RPG-SFX/creature_die_01.ogg":"assets/dzwieki/9b82818f5461d6107df42de39fc695a1b0fb09f2c6337c9eb9728778b01592bc.mp3","Owlish/Impacts/hit.wav":"assets/dzwieki/c5c97a4e4f8270a1d2af480fd85f9e82109acce2b014bcc71dc5732d21357d02.mp3","Owlish/Ambience/earthquake.wav":"assets/dzwieki/3000cdc76be4c6f3c08d1c34bf5e310feaa5366d5eac83170ba2d6eecaec44cc.mp3","Zar":"assets/dzwieki/5971f130dc39af553e17a9d1e1f35493513b9dd3d9014a888b808d7958210b27.mp3","Postawa":"assets/dzwieki/96144c52f7361ad0f5d8a9976ad713eafeb2626109ed70b6ae414f8df5ec7294.mp3","kenney_back":"assets/dzwieki/0a178e6fa1459c6eea5f89215ecbfc77b1ca29ff5e3301396cab27d4edba1e1b.mp3","kenney_buy1":"assets/dzwieki/aa81065d40bf7cd700f5ebb35d0c1226f00ad2776b427698cc9178a85d063ead.mp3","kenney_buy2":"assets/dzwieki/b0b775bbd2ae3c32427c9989ebf0f8f067244ea82b13642d0a8848fc03c6890c.mp3","kenney_card":"assets/dzwieki/e4a24ee2d91160bf203da8d518aec9751d4f001573aae5875668101c3ccc3549.mp3","kenney_cloth1":"assets/dzwieki/f6a568849fc46a4ec81d24ec4038d3bf27bf23b26a826eaa45776ad860e85eb7.mp3","kenney_cloth2":"assets/dzwieki/8b5d38e290e3650b6792d0dfd8fe037403cecbd2778786c99370799ecbbe00aa.mp3","kenney_door_in":"assets/dzwieki/74bd5b93ff56659597fd96186a58d0c6078cb158b95628db47d529d5f99b48a8.mp3","kenney_door_out":"assets/dzwieki/ac6c2173987fbb5e934c2eebbccda9ff3e3afe1fdb153a55521463f010779695.mp3","kenney_draw":"assets/dzwieki/32e9f645982db76deeaaf554962d504dc9c94e3ac2933cb1474c6e06596befaf.mp3","kenney_flip1":"assets/dzwieki/47bf1389b12136f6c9f8e9422ef411f4fb17af80b53fa6bdc4424d2b85834e7f.mp3","kenney_flip2":"assets/dzwieki/ef94b77d6377b2c3b12214d0309bdce772ccffe1a046d87042c548ba77817d7c.mp3","kenney_flip3":"assets/dzwieki/5c18fd1e874ccebfe4b359abbc6e0ac62361274fbbe005ced94ca0696f6d3bc2.mp3","kenney_purse":"assets/dzwieki/836877aa64a22b78dc29c0e27ec65edd6573f8ab4bebfdbb5ee9a7c5d75bf50d.mp3","kenney_step1":"assets/dzwieki/67b10afe247a358ece47cf4f2b89113d5d964a6bfe3a71e99db331ca77f7cb9a.mp3","kenney_step2":"assets/dzwieki/c78b5ce004ff60b955613a31cd622f183238b2b22bd735dfa02c2489d29cfeb6.mp3","kenney_step3":"assets/dzwieki/1a57262509699e042c8283fd0d7d188168849913a6f6e3d33a9b6de3976e2066.mp3","kenney_step4":"assets/dzwieki/09ac9d9df833d64fc450cb00101e94ac1457f7d8e910492ca89854be758fe2f9.mp3","kenney_step5":"assets/dzwieki/5eca5417cb2e07db1651045a7da6dcb1e9da857613defae1fa3a5da44ad82869.mp3","kenney_ui":"assets/dzwieki/71ad3318e868241a626909f4a404b8a6cabe1dc26fd27b000c1a3a2ba357ca91.mp3","kenney_ui_heavy":"assets/dzwieki/bf45d7d59c9bdb41ef3425d5828e94a970898bc6651cfadd33c3fa79373ff820.mp3","Kociolek":"assets/dzwieki/7b0f1cf24767e23dbdc97779fea1594072201d1326dd382a436d20be2dc6bb66.mp3"};
const SFX_SAMPLE_MAP={"level":["Level Up Snare"],"bladeLight":["Sword Attack 1","Sword Attack 2"],"bladeHeavy":["Sword Attack 3"],"hitSteel":["Sword Impact Hit 1","Sword Impact Hit 2"],"block":["Sword Blocked 1","Sword Blocked 2"],"parry":["Sword Parry 1","Sword Parry 2"],"swing":["Sword Attack 3"],"katana":["Sword Attack 2"],"hit":["Sword Impact Hit 1","Sword Impact Hit 2"],"hitH":["Sword Impact Hit 3"],"hitC":["Sword Impact Hit 3"],"kill":["Owlish/80-CC0-RPG-SFX/creature_die_01.ogg"],"roll":["Owlish/Impacts/flip.wav"],"frost":["Ice Throw 1","Ice Throw 2"],"quake":["Rock Meteor Throw 1"],"fire":["Fireball 1","Fireball 2"],"golem":["Rock Wall 1"],"slam":["Rock Meteor Throw 2"],"rise":["Rock Wall 2"],"empty":["Owlish/UI/UI_040.wav"],"coin":["Owlish/80-CC0-RPG-SFX/item_coins_01.ogg","Owlish/80-CC0-RPG-SFX/item_coins_02.ogg","Owlish/80-CC0-RPG-SFX/item_coins_03.ogg"],"pick":["Owlish/80-CC0-RPG-SFX/item_gem_02.ogg","Owlish/80-CC0-RPG-SFX/item_gem_03.ogg"],"bell":["Owlish/UI/UI_017.wav"],"heal":["Owlish/80-CC0-RPG-SFX/spell_01.ogg"],"bless":["Owlish/UI/UI_001.wav"],"growl":["Owlish/80-CC0-RPG-SFX/creature_monster_03.ogg","Owlish/80-CC0-RPG-SFX/creature_monster_04.ogg"],"bossGrowl":["Owlish/80-CC0-RPG-SFX/creature_roar_01.ogg","Owlish/80-CC0-RPG-SFX/creature_roar_02.ogg","Owlish/80-CC0-RPG-SFX/creature_roar_03.ogg"],"warnR":["Owlish/80-CC0-RPG-SFX/creature_hurt_01.ogg"],"hurt":["Owlish/Impacts/hit.wav"],"rumble":["Owlish/Ambience/earthquake.wav"],"poiseBreak":["Postawa"],"ui":["kenney_ui_heavy"],"back":["kenney_back"],"tab":["kenney_ui_heavy"],"toggle":["kenney_ui_heavy"],"pauseIn":["kenney_ui_heavy"],"pauseOut":["kenney_back"],"buy":["kenney_buy1","kenney_buy2"],"shopIn":["kenney_purse"],"equip":["kenney_cloth1","kenney_cloth2"],"runStart":["kenney_draw"],"card":["kenney_card"],"reroll":["kenney_flip2","kenney_flip1"],"doorIn":["kenney_door_in"],"doorOut":["kenney_door_out"],"step":["kenney_step1","kenney_step3","kenney_step2","kenney_step5","kenney_step4"],"note":["kenney_flip1"],"purse":["kenney_purse"],"rx":["kenney_rx"],"rare":["kenney_rare"],"champ":["kenney_champ"],"blastWarn":["kenney_blastwarn"],"blast":["kenney_blast"],"afxArmor":["kenney_armor"],"afxSummon":["kenney_summon"],"afxRage":["Owlish/80-CC0-RPG-SFX/creature_roar_02.ogg"],"deflectHit":["kenney_deflect"]};

