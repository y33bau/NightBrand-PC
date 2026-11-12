/* ===== tryb 2 graczy (etap 1): gracz 2 = drugi pad, kamera na graczu 1 ===== */
const PAD2={cur:[],prev:[],x:0,y:0,ax:0,ay:0,aimT:-99,atk:false,blk:false,roll:false,heavy:false,g:null};
let MPON=false;function mpWanted(){return(MPON||/[?&]mp=1/.test(location.search))&&!!PAD2.g}
function spawnP2(){S.activeSlots=S.activeSlots.slice(0,4);while(S.activeSlots.length<4)S.activeSlots.push(null);pl2=Object.assign({},pl,{x:pl.x+14,y:pl.y+6,visualGuard:null,atk:null,actives:mpActiveState()});pl2.revT=0;pl.revT=0;if(!mesh2){mesh2=new THREE.Mesh(geo32,heroIdleMat());scene.add(mesh2)}mesh2.visible=true}
// Tylko stan wykonawczy umiejetnosci jest osobny; rozwoj Nocy i wyuczone skille pozostaja wspolne.
const MP_ACTIVE_KEYS=['activeSlots','loadoutSelected','activeWind','combatLock','swordShots','swordTrails','shotWind','swordGuardian','zDance','zDanceL','manaHitCd','manaFlash','stamFlash','aardCd','shotCd','guardCd','whirlCd','leapCd','rendCd','fanCd','ldCd','hookCd','echoCd','pledgeCd','shadowReady','retaliate'];
function mpActiveState(){const s=Object.fromEntries(MP_ACTIVE_KEYS.map(k=>[k,0]));return Object.assign(s,{activeSlots:Array(4).fill(null),activeWind:null,shotWind:null,swordGuardian:null,swordShots:[],swordTrails:[],whirlPool:[],whirlMesh:null})}
const P2TEX=new WeakMap();
function recolorTex(t){if(P2TEX.has(t))return P2TEX.get(t);let out=t;try{const im=t.image,w=im.width,h=im.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0);const d=x.getImageData(0,0,w,h),a=d.data;for(let i=0;i<a.length;i+=4){const r=a[i],g=a[i+1],b=a[i+2];if(a[i+3]>8&&r>60&&r>b*1.5&&r>g*1.5){a[i]=b;a[i+2]=r;a[i+1]=Math.min(255,g*1.15)}}x.putImageData(d,0,0);out=t.clone();out.image=c;out.needsUpdate=true}catch(e){quietErr('recolorTex',e)}P2TEX.set(t,out);return out}
function asP2(fn){if(!pl2)return;if(pl===pl2)return fn();const state=pl2.actives||(pl2.actives=mpActiveState()),saved={};for(const k of MP_ACTIVE_KEYS){saved[k]=S[k];S[k]=state[k]}const pool=whirlVisualPool,whirlMesh=skWhirlMesh;whirlVisualPool=state.whirlPool;skWhirlMesh=state.whirlMesh;
 const sPl=pl,sx=PAD.x,sy=PAD.y,sa=PAD.atk,sb=PAD.blk,sax=PAD.ax,say=PAD.ay,sat=PAD.aimT,sKeys={...keys},sTjx=tj.x,sTjy=tj.y,sRoll=rollPress,sHeavy=heavyPress,sTalk=talkPress,sML=mouseL,sMR=mouseR,sTA=tAtk,sTB=tBlock,sMT=mouseT,sBuf=S.bufRoll;
  pl=pl2;for(const k of Object.keys(keys))delete keys[k];tj.x=0;tj.y=0;PAD.x=PAD2.x;PAD.y=PAD2.y;PAD.atk=PAD2.atk;PAD.blk=PAD2.blk;PAD.ax=PAD2.ax;PAD.ay=PAD2.ay;PAD.aimT=PAD2.aimT;
  rollPress=PAD2.roll;PAD2.roll=false;heavyPress=PAD2.heavy;PAD2.heavy=false;talkPress=false;mouseL=mouseR=tAtk=tBlock=false;mouseT=-99;S.bufRoll=0;
  try{return fn()}finally{for(const k of MP_ACTIVE_KEYS){state[k]=S[k];S[k]=saved[k]}state.whirlPool=whirlVisualPool;state.whirlMesh=skWhirlMesh;whirlVisualPool=pool;skWhirlMesh=whirlMesh;pl2=pl;pl=sPl;PAD.x=sx;PAD.y=sy;PAD.atk=sa;PAD.blk=sb;PAD.ax=sax;PAD.ay=say;PAD.aimT=sat;for(const k of Object.keys(keys))delete keys[k];Object.assign(keys,sKeys);tj.x=sTjx;tj.y=sTjy;rollPress=sRoll;heavyPress=sHeavy;talkPress=sTalk;mouseL=sML;mouseR=sMR;tAtk=sTA;tBlock=sTB;mouseT=sMT;S.bufRoll=sBuf}}
function pad2Tick(g2){if(!g2){PAD2.g=null;PAD2.cur=[];PAD2.prev=[];PAD2.x=PAD2.y=0;PAD2.atk=PAD2.blk=false;return}
  PAD2.g=g2;PAD2.prev=PAD2.cur;PAD2.cur=g2.buttons.map(b=>!!b&&(b.pressed||b.value>.5));
  if(!S||S.phase!=='play'||S.intro||padMenuId()){PAD2.x=PAD2.y=0;PAD2.atk=PAD2.blk=false;return}
  const c=PAD2.cur,pv=PAD2.prev,pr=i=>c[i]&&!pv[i];
  let [x,y]=padDz(g2.axes[0]||0,g2.axes[1]||0,.22);x+=(c[15]?1:0)-(c[14]?1:0);y+=(c[13]?1:0)-(c[12]?1:0);PAD2.x=x;PAD2.y=y;
  const [ax,ay]=padDz(g2.axes[2]||0,g2.axes[3]||0,.35);if(ax||ay){const m=Math.hypot(ax,ay);PAD2.ax=ax/m;PAD2.ay=ay/m;PAD2.aimT=clock}
  const lt=!!c[6];PAD2.skillHeld=lt;if(!c[0]&&!c[1]&&!c[2]&&!c[3])PAD2.skillConsumed=false;if(lt&&[0,1,2,3].some(pr))PAD2.skillConsumed=true;PAD2.atk=!!c[7]||(!lt&&!PAD2.skillConsumed&&!!c[2]);PAD2.blk=!!c[4];
  if(lt){for(const [i,b] of [2,3,1,0].entries())if(pr(b))asP2(()=>activateSlot(i))}
  else{if(pr(0))PAD2.roll=true;if(pr(1)||pr(5))PAD2.heavy=true;if(pr(3))PAD2.talk=true}}
function drawP2(dt=0){if(!pl2||!mesh2)return;asP2(()=>{syncWhirlVisual(dt);const hf=heroFrame();setFrame(mesh2,hf,'p2');
  const hs=pl.atk&&FACEK.includes(pl.atk.kind)?(pl.fx>=0?1:-1):pl.roll>0||pl.dead?pl.s:A.heroD&&A.heroD.v2&&!pl.atk&&(pl.parryT>0||pl.broken>0||(pl.hurtT>0&&!pl.block))?(pl.fx>=0?1:-1):pl.swingT>0?(pl.swingDir===2?pl.swingS:1):(pl.charging||pl.block)&&Math.abs(pl.fx)>Math.abs(pl.fy)?(pl.fx>0?1:-1):(pl.dir===2?pl.s:1);
  mesh2.position.set(pl.x/16,0,pl.y/16);mesh2.scale.set(hs,SQ,1);mesh2.visible=!(SETT.flash&&pl.inv>0&&pl.roll<=0&&!pl.dead&&Math.floor(clock*24)%2);})}
function allDead(){return pl1.dead&&(!pl2||pl2.dead)}
function pickTarget(e){if(!pl2)return pl1;const a=pl1.dead,b=pl2.dead;if(a&&b)return pl1;if(a)return pl2;if(b)return pl1;return Math.hypot(e.x-pl2.x,e.y-pl2.y)<Math.hypot(e.x-pl1.x,e.y-pl1.y)?pl2:pl1}
function withRb(p,fn){if(!pl2||p!==pl2)return fn();const a=S.rebirth,b=S.rebirthUsed;S.rebirth=p.rbF||null;S.rebirthUsed=!!p.rbU;try{return fn()}finally{p.rbF=S.rebirth;p.rbU=S.rebirthUsed;S.rebirth=a;S.rebirthUsed=b}}
let mpTotLast=null;
function totemSpot(){const cx=MW/2*TS,cy=MH/2*TS,bad=[...(W.npcs||[]),...(W.shrines||[]),W.start].filter(Boolean);
  for(const md of [144,112,80,0])for(let r=0;r<44;r++)for(let k=0;k<(r?16:1);k++){const a=k/16*6.2832,x=cx+Math.cos(a)*r*8,y=cy+Math.sin(a)*r*8;if(boxSolid(x,y,12,10)||VOID.has(tileAt(Math.floor(x/TS),Math.floor(y/TS))))continue;if(bad.some(n=>Math.hypot(n.x-x,n.y-y)<md))continue;return{x,y}}
  return{x:START.x,y:START.y}}
const TOTGLOW=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),gr=x.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,.04)');gr.addColorStop(.6,'rgba(255,255,255,.2)');gr.addColorStop(.88,'rgba(255,255,255,.38)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)})();
const TOTDOT=(()=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),gr=x.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.4,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,32,32);return new THREE.CanvasTexture(c)})();
const TOTEM_PNG='./assets/450093d43cdcfb4c4a8de3632fbc10d27f8e33d2580e5ff871e7b1b3d69c5430.png';let _totImg=null,_totFr=null;
function totemLoad(cb){if(_totFr){cb(_totFr);return}if(!_totImg){const im=_totImg=new Image();im.nbKey='totem';im.nbDensity=5;im.cbs=[];im.onload=()=>{try{_totFr=procFrame(im,0,0,im.width/5,im.height/5,'prop');cutCircle(_totFr.n)}catch(e){_totFr=null}for(const f of im.cbs)f(_totFr);im.cbs=[]};im.src=TOTEM_PNG}_totImg.cbs.push(cb)}
let FXS=null;
function fireFxTick(){
 if(FXS===false)return;
 if(!S||!W||!scene||!W.propObjs){if(FXS)FXS.g.visible=false;return}
 try{
 const low=SETT&&SETT.quality==='low';
 if(!FXS){
  const mk=(n,size)=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));geo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3),3));const pt=new THREE.Points(geo,new THREE.PointsMaterial({size,map:TOTDOT,vertexColors:true,sizeAttenuation:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));pt.frustumCulled=false;return pt};
  const ne=low?90:200,nw=low?10:26,em=mk(ne,.34),wi=mk(nw,.5),g=new THREE.Group();g.add(em,wi);scene.add(g);
  const P=n=>Array.from({length:n},()=>({a:0,l:0,y:-99,ex:0,ez:0,vy:0,ph:0,sw:0}));
  FXS={g,em,wi,pe:P(ne),pw:P(nw),W:null,fire:[],lava:[],shr:[],t:clock}}
 const F=FXS;F.g.visible=true;
 if(F.W!==W){F.W=W;F.fire=[];F.shr=[];F.lava=[];
  for(const o of W.propObjs)if(o.kind==='shrine'&&o.mesh)F.shr.push({x:o.mesh.position.x,z:o.mesh.position.z-.3,h:.55,r:.6});
  for(const p of W.PROPS||[]){const k=p.k||'';if(p.shrine!==undefined)continue;
   if(!(p.fire||p.anim==='torch'||p.anim==='furnace'||/debris_fire|pyre|bonfire|cz_fire|furnace|torch|brazier/.test(k)))continue;
   const m=p.obj&&p.obj.mesh,x=m?m.position.x:p.x,z=m?m.position.z:p.y,tor=/torch/.test(k)||p.anim==='torch',fur=/furnace/.test(k);
   F.fire.push({x,z:z-(tor?.1:.3),h:tor?1.1:fur?.9:.45,r:p.big?.7:tor?.12:.35})}
  for(const b of W.braziers||[])F.fire.push({x:b[0]+.5,z:b[1]+.62,h:.8,r:.25});
  for(const l of W.lavas||[])F.lava.push([l[0]+.5,l[1]+.5])}
 const dt=Math.min(.1,Math.max(0,clock-F.t));F.t=clock;
 const cx=camTarget.x,cz=camTarget.z,near=(x,z)=>{const dx=x-cx,dz=z-cz;return dx*dx+dz*dz<900};
 if(clock-(F.snT||-9)>.12){F.snT=clock;let md=1e9;for(const e of F.fire){const dx=e.x-cx,dz=e.z-cz;md=Math.min(md,dx*dx+dz*dz)}for(const c of F.lava){const dx=c[0]-cx,dz=c[1]-cz;md=Math.min(md,dx*dx+dz*dz)}F.snV=.35*Math.pow(Math.max(0,1-Math.sqrt(md)/14),2)}loopSnd('fire','Zar',F.snV||0);
 const pick=()=>{const r=Math.random();
  if(r<.3&&F.lava.length){for(let t=0;t<6;t++){const c=F.lava[(Math.random()*F.lava.length)|0];if(near(c[0],c[1]))return{x:c[0]+rnd(-.5,.5),z:c[1]+rnd(-.5,.5),h:-.2,r:0,lava:1}}}
  if(r<.5&&F.shr.length){const e=F.shr[(Math.random()*F.shr.length)|0];if(near(e.x,e.z))return e}
  if(F.fire.length){for(let t=0;t<6;t++){const e=F.fire[(Math.random()*F.fire.length)|0];if(near(e.x,e.z))return e}}
  return null};
 const pos=F.em.geometry.attributes.position,col=F.em.geometry.attributes.color;
 for(let i=0;i<F.pe.length;i++){const q=F.pe[i];q.a+=dt;
  if(q.a>=q.l){const e=pick();q.a=0;
   if(!e){q.l=.3+Math.random()*.5;q.y=-99;q.ex=q.ez=0;pos.setXYZ(i,0,-99,0);col.setXYZ(i,0,0,0);continue}
   q.ex=e.x+rnd(-1,1)*(e.r||0);q.ez=e.z+rnd(-1,1)*(e.r||0);q.y=e.h+Math.random()*.15;q.vy=(e.lava?.5:.8)+Math.random()*.9;q.l=(e.lava?1.2:.9)+Math.random()*1.3;q.lava=e.lava?1:0;q.ph=Math.random()*6.28;q.sw=.15+Math.random()*.3}
  if(q.y<-50)continue;
  q.y+=q.vy*dt;const k=q.a/q.l,f=k<.15?k/.15:Math.max(0,1-(k-.15)/.85);
  pos.setXYZ(i,q.ex+Math.sin(clock*2.2+q.ph)*q.sw*k,q.y,q.ez+Math.cos(clock*1.7+q.ph)*q.sw*k*.7);
  col.setXYZ(i,f,f*(q.lava?.35:.55)*(1-k*.4),f*(q.lava?.08:.18))}
 pos.needsUpdate=true;col.needsUpdate=true;
 const wp=F.wi.geometry.attributes.position,wc=F.wi.geometry.attributes.color;
 for(let i=0;i<F.pw.length;i++){const q=F.pw[i];q.a+=dt;
  if(q.a>=q.l){q.a=0;const e=F.shr.length?F.shr[(Math.random()*F.shr.length)|0]:null;
   if(!e||!near(e.x,e.z)){q.l=.5;q.y=-99;wp.setXYZ(i,0,-99,0);wc.setXYZ(i,0,0,0);continue}
   q.ph=Math.random()*6.28;q.sw=.5+Math.random()*.7;q.ex=e.x;q.ez=e.z;q.y=.3+Math.random()*.4;q.vy=.25+Math.random()*.3;q.l=2.2+Math.random()*2;q.w=(Math.random()<.5?1:-1)*(.8+Math.random()*.8)}
  if(q.y<-50)continue;
  q.y+=q.vy*dt;const k=q.a/q.l,ang=q.ph+clock*q.w,f=Math.sin(Math.PI*k)*.9;
  wp.setXYZ(i,q.ex+Math.cos(ang)*q.sw,q.y,q.ez+Math.sin(ang)*q.sw*.8);wc.setXYZ(i,.55*f,.9*f,f)}
 wp.needsUpdate=true;wc.needsUpdate=true;
 }catch(err){console.warn('fireFx',err);FXS=false}}

function mkTotem(x,y){const g=new THREE.Group();
  const fb=new THREE.Group(),st=new THREE.MeshBasicMaterial({color:0x5a5c70}),base=new THREE.Mesh(new THREE.CylinderGeometry(.6,.78,.4,8),st);base.position.y=.2;const pil=new THREE.Mesh(new THREE.CylinderGeometry(.24,.38,2.4,6),st);pil.position.y=1.4;fb.add(base,pil);g.add(fb);
  totemLoad(fr=>{if(!fr)return;const im=_totImg,hh=4.5,geo=new THREE.PlaneGeometry(hh*im.width/im.height,hh).translate(0,hh/2-.1,0),n=geo.attributes.normal;for(let i=0;i<n.count;i++)n.setXYZ(i,0,.8,.6);const m=new THREE.Mesh(geo,fr.n);m.scale.set(1,SQ,1);g.add(m);g.remove(fb)});
  const ring=new THREE.Mesh(new THREE.PlaneGeometry(5.6,5.6).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:TOTGLOW,color:0xff9a3c,transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));ring.position.y=.05;g.add(ring);
  const low=SETT&&SETT.quality==='low',mk=(n,col,size)=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));const pt=new THREE.Points(geo,new THREE.PointsMaterial({color:col,size,map:TOTDOT,sizeAttenuation:true,transparent:true,opacity:.95,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));pt.frustumCulled=false;g.add(pt);return pt};
  const em=mk(low?18:36,0xff9a3c,.3),wi=mk(low?5:10,0x8fe8ff,.5);
  g.position.set(x/16,0,y/16);scene.add(g);return{g,ring,em,wi}}
function mpTotAnim(o,t,on){const E=o.em.geometry.attributes.position,Wp=o.wi.geometry.attributes.position;
  for(let i=0;i<E.count;i++){const ph=(t*.32+i*.6180339)%1,a=i*2.399+t*.45*(i%2?1:-1),r=.8+((i*37)%10)*.13;E.setXYZ(i,Math.cos(a)*r,.2+ph*3.2,Math.sin(a)*r*.8)}E.needsUpdate=true;
  for(let i=0;i<Wp.count;i++){const a=t*.7+i/Wp.count*6.2832;Wp.setXYZ(i,Math.cos(a)*2.1,.7+Math.sin(t*1.3+i*1.7)*.4+(i%3)*.35,Math.sin(a)*1.8)}Wp.needsUpdate=true;
  o.em.material.opacity=on?.95:.25;o.wi.material.opacity=on?.9:.2;o.ring.material.opacity=on?.35+.15*Math.sin(t*3):.1;o.ring.material.color.setHex(on?0xff9a3c:0x666666)}
function mpTotTxt(){const c=S.mpCh==null?3:S.mpCh,p=S.mpProg||0;return(EN?"Whisperer's Tree: ":'Drzewo Szeptuchy: ')+c+'/3'+(p>0?' · '+Math.round(p/5*100)+'%':'')}
function mpTotemTick(dt){if(!S||!pl2||S.dg){if(mpTotLast)mpTotLast.visible=false;return}
  if(S.mpCh==null){S.mpCh=3;S.mpProg=0;S.mpHintT=0}
  let T=S.mpTot;if(T&&T.W!==W){scene.remove(T.o.g);T=S.mpTot=null}
  if(!T){if(mpTotLast)scene.remove(mpTotLast);const sp=totemSpot();T=S.mpTot={W,x:sp.x,y:sp.y,o:mkTotem(sp.x,sp.y)}}
  mpTotLast=T.o.g;T.o.g.visible=true;mpTotAnim(T.o,clock,S.mpCh>0);
  const d=pl1.dead?pl1:pl2.dead?pl2:null,o=d===pl1?pl2:pl1;
  if(!d||o.dead||S.mpCh<=0){S.mpProg=Math.max(0,(S.mpProg||0)-dt*2);return}
  S.mpHintT=(S.mpHintT||0)-dt;if(S.mpHintT<=0){S.mpHintT=9;ftx(EN?"The Whisperer's Tree in the middle of the map will revive your partner":'Drzewo Szeptuchy w środku mapy wskrzesi towarzysza',o.x,o.y,2.4,'i')}
  if(Math.hypot(o.x-T.x,o.y-T.y)<44)S.mpProg=(S.mpProg||0)+dt;else S.mpProg=Math.max(0,(S.mpProg||0)-dt*2);
  if(S.mpProg>=5){S.mpProg=0;S.mpCh--;Object.assign(d,{x:T.x+(d===pl2?12:-12),y:T.y+10,hp:Math.round(d.max*.5),dead:false,deadT:0,inv:2.5,roll:0,atk:null,block:false,charging:false,atkHeld:false,queue:false,swingT:0,broken:0,hurtT:0,sta:d.staMax,revT:0});play('bless',0);ftx(EN?'Revived!':'Wskrzeszony!',T.x,T.y,2.8,'i');for(let k=0;k<16;k++)S.parts.push({k:'e',x:T.x+rnd(-8,8),y:T.y,z:rnd(2,16),vx:rnd(-8,8),vy:0,vz:rnd(12,30),c:'#7fd0ff',life:rnd(.5,1)})}}
let mpEls=null;const MPV=new THREE.Vector3();
function mpHudTick(){{const h=$('hud');if(h)h.classList.toggle('mp2',!!(S&&pl2&&S.phase==='play'))}const show=!!(S&&pl2&&S.phase==='play'&&!S.paused&&!S.choosing&&!S.shop&&!S.dialog&&!S.intro&&!S.notice);
  if(!mpEls){if(!show)return;const left=document.querySelector('#hud .left');if(!left)return;
    const mk=h=>{const d=document.createElement('div');d.innerHTML=h;return d.firstChild},bars='<b class="l"></b><b class="m"></b><b class="r"></b></div>';
    const panel=mk('<div style="pointer-events:none"></div>'),tag=mk('<span class="lvl-tag" style="color:#8fb4ff"></span>');tag.textContent=EN?'Player 2':'Gracz 2';
    const hb=mk('<div class="fb hp"><span class="trk"><b class="g"></b><i></i></span>'+bars),stm=mk('<div class="stam"><div class="seg fb st"><span class="trk"><i></i></span>'+bars+'</div>'),mn=mk('<div class="stam mana"><div class="seg fb st mn"><span class="trk"><i></i></span>'+bars+'</div>'),info=mk('<div class="buffs"></div>');
    const kr2=mk('<div class="mpk"></div>');panel.append(tag,hb,stm,mn,info,kr2);left.appendChild(panel);
    const i1=mk('<div class="buffs" style="pointer-events:none"></div>'),kr1=mk('<div class="mpk"></div>');const m1=$('mana');if(m1)m1.after(i1);else left.appendChild(i1);i1.after(kr1);
    const mkBar=col=>{const b=document.createElement('div');b.style.cssText='position:fixed;z-index:50;width:38px;height:5px;background:rgba(0,0,0,.45);pointer-events:none;transform:translate(-50%,-100%);opacity:.7;display:none';b.innerHTML='<i style="display:block;height:100%;width:100%;background:'+col+'"></i>';document.body.appendChild(b);return b};
    const mkAr=col=>{const a=document.createElement('div');a.style.cssText='position:fixed;z-index:51;pointer-events:none;display:none;width:0;height:0;border-left:18px solid '+col+';border-top:11px solid transparent;border-bottom:11px solid transparent;filter:drop-shadow(0 0 3px #000);opacity:.92';document.body.appendChild(a);return a};
    mpEls={k1:kr1,k2:kr2,ks1:'',ks2:'',a1:mkAr('#d84a4a'),a2:mkAr('#4f8fd8'),panel,i1,info,hb,hbi:hb.querySelector('.trk>i'),hbg:hb.querySelector('.g'),stm,mn,t1:'',t2:'',b1:mkBar('#d84a4a'),b2:mkBar('#4f8fd8')}}
  const on=!!(S&&pl2&&S.phase==='play');mpEls.panel.style.display=on?'block':'none';mpEls.i1.style.display=on?'block':'none';
  if(!show){mpEls.b1.style.display=mpEls.b2.style.display=mpEls.a1.style.display=mpEls.a2.style.display='none';return}
  const pct=Math.max(0,pl2.hp)/pl2.max*100+'%';mpEls.hbi.style.width=mpEls.hbg.style.width=pct;mpEls.hb.classList.toggle('low',pl2.hp<pl2.max*.3);
  {const sg=mpEls.stm.firstChild,v=Math.max(0,pl2.sta/pl2.staMax);mpEls.stm.style.width=Math.min(100,pl2.staMax/1.8)+'%';sg.firstChild.firstChild.style.width=v*100+'%';sg.classList.toggle('full',v>=1)}
  {const sg=mpEls.mn.firstChild,mm=pl2.manaMax||SL.mana.max,v=Math.max(0,Math.min(1,(pl2.mana||0)/mm));mpEls.mn.style.width=Math.min(100,mm/1.8)+'%';sg.firstChild.firstChild.style.width=v*100+'%';sg.classList.toggle('full',v>=1)}
  const tt=mpTotTxt(),t1='<span class="tr">'+tt+'</span>',t2=(pl2.rbF?'<span class="tr">'+(pl2.rbU?(EN?'Revival used':'Odrodzenie zużyte'):(EN?'Revival ready':'Odrodzenie gotowe'))+'</span>':'')+t1;
  if(mpEls.t1!==t1){mpEls.t1=t1;mpEls.i1.innerHTML=t1}if(mpEls.t2!==t2){mpEls.t2=t2;mpEls.info.innerHTML=t2}
  {const own=S.own||{};let h1='',h2='';for(const k in own){const o=own[k],d=SK[k];if(!d||!d.ic)continue;const c=n=>'<span title="'+d.name+'"><i data-premium-skill="'+k+'" class="ic ic-'+d.ic+'"></i>'+(n>1?'<small>'+n+'</small>':'')+'</span>';if(o[0])h1+=c(o[0]);if(o[1])h2+=c(o[1])}if(mpEls.ks1!==h1){mpEls.ks1=h1;mpEls.k1.innerHTML=h1}if(mpEls.ks2!==h2){mpEls.ks2=h2;mpEls.k2.innerHTML=h2}}
  const r=$('screen').getBoundingClientRect();
  for(const [p,el,ar] of [[pl1,mpEls.b1,mpEls.a1],[pl2,mpEls.b2,mpEls.a2]]){MPV.set(p.x/16,2.1,p.y/16).project(cam);const inView=MPV.z<1&&Math.abs(MPV.x)<1.05&&Math.abs(MPV.y)<1.05;
    el.style.display=inView?'block':'none';ar.style.display=inView?'none':'block';if(!inView){let vx=MPV.x,vy=-MPV.y;if(MPV.z>1){vx=-vx;vy=-vy}const px=vx*r.width/2,py=vy*r.height/2,t=Math.min((r.width/2-26)/Math.max(1e-3,Math.abs(px)),(r.height/2-26)/Math.max(1e-3,Math.abs(py)));ar.style.left=(r.left+r.width/2+px*t-9)+'px';ar.style.top=(r.top+r.height/2+py*t-11)+'px';ar.style.transform='rotate('+Math.atan2(py,px)+'rad)'}if(!inView)continue;el.style.left=(r.left+(MPV.x*.5+.5)*r.width)+'px';el.style.top=(r.top+(-MPV.y*.5+.5)*r.height)+'px';
    const f=p.dead?Math.min(1,(S.mpProg||0)/5):Math.max(0,p.hp)/p.max;el.firstChild.style.width=f*100+'%';el.firstChild.style.background=p.dead?'#e8c85a':(p===pl1?'#d84a4a':'#4f8fd8')}}
function clearScene(){resetBloodHD();if(!S)return;for(const f of S.vfx)if(f.ownMat)for(const a of f.anim)a.n.dispose();if(pl2){asP2(clearSwordTransient);const a=pl2.actives;if(a){for(const f of a.whirlPool){scene.remove(f.mesh);f.mesh.geometry.dispose();f.mesh.material.dispose()}a.whirlPool[0]?.mesh.material.map?.dispose();if(a.whirlMesh){scene.remove(a.whirlMesh);a.whirlMesh.geometry.dispose()}a.whirlPool=[];a.whirlMesh=null}}clearSwordTransient();if(swordGlow)swordGlow.visible=false;const all=[...S.enemies.map(e=>e.mesh),...S.picks.flatMap(p=>[p.mesh,p.glow]),...S.vfx.map(f=>f.mesh),...S.corpses.map(c=>c.mesh),...S.golems.map(g=>g.mesh),...S.zones.map(z=>z.mesh),...(S.eproj||[]).map(f=>f.mesh),...(S.deathPurses||[]).map(p=>p.mesh)];for(const m of all)if(m)scene.remove(m);for(const c of S.corpses)if(c.own)c.mesh.material.dispose()}
function newGame(){
  clearScene();dg.clearRect(0,0,WW,WH);decalDirty=true;resetFog();MINI.t=0;
  S={t:0,kills:0,coins:0,lvl:1,xp:0,need:xpNeed(1),pendLv:0,choosing:false,phase:'play',enemies:[],parts:[],picks:[],vfx:[],corpses:[],quakes:[],golems:[],zones:[],delayed:[],
    waves:[],sk:{sword:1},cd:{sword:.6},spawnT:1,hurt:0,shakeT:0,shakeM:0,endT:0,stage:'p1',merchant:null,collector:null,bought:{},whet:0,magnet:0,ev:new Set(),shr:SHRINES.map(()=>60),eproj:[],stones:[0,0,0,0,0],boom:new Set(),trapCd:new Map(),dialog:null,dlg:0,npc:Object.fromEntries(W.npcs.map(n=>[n.id,{state:n.id==='chojrak'&&CH>=2&&!STORYMODE?'gone':'alive',t:0}])),flash:0,nextBolt:9};
  pl={x:START.x,y:START.y,fx:1,fy:0,dir:2,s:1,hp:100,max:100,inv:0,roll:0,rollT:0,rvx:0,rvy:0,walk:0,moving:false,dead:false,deadT:0,rollCd:0,swingT:0,swingDir:2,swingS:1,hurtT:0};
  S.activeSlots=[null,null,null,null,null];S.activeWind=null;S.combatLock=0;S.swordShots=[];S.mainEnchant=null;S.elementMain=null;S.elementSupport=null;S.shotCd=0;S.manaHitCd=0;S.manaFlash=0;S.enemyShotCd=0;S.swordGuardian=null;S.shotWind=null;S.swordTrails=[];S.sk={};S.cd={};S.str=1;S.dex=1;S.int=1;Object.assign(pl,{mana:SL.mana.max,manaMax:SL.mana.max,manaDelay:0,sta:100,staMax:100,staDelay:0,atk:null,block:false,blockT:0,broken:0,riposte:0,atkHeld:false,charge:0,charging:false,comboT:0,nextCombo:0,queue:false});pl1=pl;pl2=null;if(mesh2)mesh2.visible=false;if(mpWanted())spawnP2()
  S.deathCause=null;S.pk=PK0();S.hitsT=0;S.parries=0;S.kOne=0;S.dTon=0;S.dTonHit=0;S.dEchoK=0;S.dAbs=0;S.dBroken=0;S.tonN=0;S.kStun=0;S.kKrN=0;S.kKrBest=0;S.kLeapK=0;S.kDodge=0;S.kEliteHv=0;S.mFull=0;S.mWaxK=0;S.mSlowN=0;S.mEffB=0;S.mFifth=0;S.mMourn=0;S.mEliteK=0;S.kTag=null;S.cEarn=0;S.coinFrac=0;S.dealt=0;S.dsrc=null;S.dsk=null;S.chal=null;S.perkIds=[];S.actions={attack:0,dodge:0,block:0,parry:0,collect:0};S.firstNight=CH===1&&!tutorialDone();S.noticeQueue=[];S.rebirth=null;S.rebirthUsed=false;S.deaths=0;S.deathPurses=[];S.finalDeathLoss=false;
  heroMesh.visible=true;chipsDirty=true;
}
function boxSolid(x,y,hw,hh){return solidAt(x-hw,y-hh)||solidAt(x+hw,y-hh)||solidAt(x-hw,y)||solidAt(x+hw,y)}
function enemyBody(e){return !e.dead&&e.rise<=0&&e.type!=='wisp'&&e.mode!=='merge'&&e.mode!=='emerge'&&!((e.mode==='up'||e.mode==='down')&&e.lh>0)}
const contactGap=e=>e.r+(BIG.has(e.type)?4:['drowner','zmora','wraith'].includes(e.type)?6:8);
function playerBodyBlocked(x,y,ox,oy){if(!S||!pl||pl.dead||pl.roll>0)return false;
  for(const e of S.enemies){if(!enemyBody(e))continue;const r=contactGap(e),next=Math.hypot(x-e.x,y-e.y),before=Math.hypot(ox-e.x,oy-e.y);if(next<r-.01&&next<before-.001)return true}return false}
function moveBox(o,dx,dy,hw,hh,passBodies=false){const free=(x,y)=>!boxSolid(x,y,hw,hh)&&(o!==pl||passBodies||!playerBodyBlocked(x,y,o.x,o.y));if(dx){const nx=o.x+dx;if(free(nx,o.y))o.x=nx}if(dy){const ny=o.y+dy;if(free(o.x,ny))o.y=ny}}
function keepEnemyDistance(e,ox=e.x,oy=e.y){if(!pl||pl.dead||pl.roll>0||!enemyBody(e))return;
  const gap=contactGap(e),vx=e.x-ox,vy=e.y-oy,px=ox-pl.x,py=oy-pl.y,a=vx*vx+vy*vy,b=2*(px*vx+py*vy),c=px*px+py*py-gap*gap;
  // Clip a movement segment at the hero's body, including a fast leap or charge.
  if(a>1e-8&&c>=-.01&&b<0){const disc=b*b-4*a*c;if(disc>=0){const t=(-b-Math.sqrt(disc))/(2*a);if(t>=0&&t<1){e.x=ox+vx*Math.max(0,t-.0001);e.y=oy+vy*Math.max(0,t-.0001)}}}
  let dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy);if(d>=gap-.01)return;
  if(d<.001){dx=-(e.contactNX??-pl.fx);dy=-(e.contactNY??-pl.fy);d=Math.hypot(dx,dy)||1}
  const angle=Math.atan2(dy,dx),fly=['bat','courtraven','wraith','zmora'].includes(e.type);
  for(const offset of [0,.3,-.3,.6,-.6,1,-1,Math.PI/2,-Math.PI/2,Math.PI]){const x=pl.x+Math.cos(angle+offset)*(gap+.02),y=pl.y+Math.sin(angle+offset)*(gap+.02);if(fly||!boxSolid(x,y,e.hw||e.r-1,3)){e.x=x;e.y=y;return}}
  if(Math.hypot(ox-pl.x,oy-pl.y)>=gap-.01){e.x=ox;e.y=oy}
}
function incomingMelee(e,nx,ny){const dx=pl.x-e.x,dy=pl.y-e.y,d=Math.hypot(dx,dy);if(d>=contactGap(e)*.5)return[dx/d,dy/d];
  const x=e.contactNX??nx,y=e.contactNY??ny,n=Math.hypot(x,y);return n>.001?[x/n,y/n]:[-pl.fx,-pl.fy]}
function hurtFromEnemy(e,dmg,nx,ny){const previous=S.attacker;S.attacker=e;try{return hurtPlayer(dmg,nx,ny,e)}finally{S.attacker=previous}}
// ---- unoszące się napisy: obrażenia zadane wrogom i krótkie info przy postaci ----
const FLT={act:[],tm:0};
function ftClear(){for(const f of FLT.act)f.el.remove();FLT.act.length=0}
function ftx(text,x,y,h,kind,ent){const box=$('ft');if(!box||!S)return;if(kind!=='i'&&!SETT.dmg)return;
  if(ent&&kind!=='i'){const q=ent.ftI;if(q&&FLT.act.includes(q)&&FLT.tm-q.t0<.5&&q.kind===kind){q.val+=text;q.el.textContent=Math.round(q.val);if(kind==='c')q.el.style.fontSize='';return}}
  while(FLT.act.length>=20){FLT.act.shift().el.remove()}
  const el=document.createElement('div');el.className='ft '+kind;el.textContent=kind==='i'?text:Math.round(text);box.appendChild(el);
  const f={el,x:x+rnd(-4,4),y,h,kind,t0:FLT.tm,val:kind==='i'?0:text,life:kind==='i'?1.2:kind==='c'?1.0:.8,dx:rnd(-6,6),rise:kind==='i'?20:26};
  FLT.act.push(f);if(ent&&kind!=='i')ent.ftI=f}
const ftEntH=e=>.95+(e.r||5)/14;
function ftInfo(text){if(!S||!pl)return;const n=FLT.act.filter(f=>f.pl&&FLT.tm-f.t0<.7).length;ftx(text,pl.x,pl.y,1.75+n*.95,'i');FLT.act[FLT.act.length-1].pl=true}
function ftTick(dt){FLT.tm+=dt;const r=$('screen').getBoundingClientRect();
  for(let i=FLT.act.length-1;i>=0;i--){const f=FLT.act[i],a=FLT.tm-f.t0;if(a>=f.life){f.el.remove();FLT.act.splice(i,1);continue}
    const k=a/f.life,e=1-(1-Math.min(1,a/.35))*(1-Math.min(1,a/.35));
    V.set((f.x+f.dx*k)/16,f.h+f.rise*(e*.6+k*.4)/16,f.y/16).project(cam);
    f.el.style.left=((V.x+1)/2*100)+'%';f.el.style.top=((1-V.y)/2*100)+'%';
    f.el.style.opacity=k<.6?1:Math.max(0,1-(k-.6)/.4);
    const sc=f.kind==='d'&&a<.12?1.35-a*3:1;f.el.style.transform='translate(-50%,-50%) scale('+sc+')'}}
// ---- paski zdrowia i nazwy elit i minibossów ----
const ENAME={judge:(EN?'Judge':'Sędzia'),arbiter:(EN?'Seal Arbiter':'Arbiter pieczęci'),cursed:(EN?'Cursed Knight':'Przeklęty rycerz'),militia:(EN?'Rotten Militiaman':'Zgniły milicjant'),marauder:(EN?'Black Marauder':'Czarny maruder'),gravedigger:(EN?'Gravedigger':'Grabarz'),guard:(EN?'Guard':'Strażnik'),scribe:(EN?'Scribe':'Skryba'),executioner:(EN?'Executioner':'Kat'),debtor:(EN?'Debtor':'Dłużnik'),wraith:(EN?'Ledger Wraith':'Upiór rachunków'),bookgolem:(EN?'Tome Golem':'Golem ksiąg'),condemned:(EN?'Convict':'Skazaniec'),courtraven:(EN?'Court Raven':'Kruk sądowy'),paperrat:(EN?'Paper Rat':'Szczur papierowy'),madman:(EN?'Madman':'Szaleniec'),hound:(EN?'Hound':'Ogar'),rotknight:(EN?'Rotten Knight':'Zgniły rycerz'),monk:(EN?'Monk':'Mnich'),possessed:(EN?'Possessed':'Opętany'),knight:(EN?'Knight':'Rycerz'),dwarf:(EN?'Dwarf':'Krasnolud'),ghoul:(EN?'Ghoul':'Ghul'),shieldman:(EN?'Shieldbearer':'Tarczownik'),goat:(EN?'Goat Beast':'Kozioł'),warden:(EN?'Warden':'Strażnik'),wolf:(EN?'Wolf':'Wilk'),bandit:(EN?'Bandit':'Bandyta'),xbow:(EN?'Crossbowman':'Kusznik'),drowner:(EN?'Drowner':'Utopiec'),strzygon:(EN?'Strigoi':'Strzygoń'),wight:(EN?'Wraith':'Upiór'),zmora:(EN?'Night Hag':'Zmora'),bies:(EN?'Fiend':'Bies')};
// Display-only attribution: explicit hit source, independent of the melee/parry context.
const DEATH_CAUSES={night:(EN?'The Night':'Noc'),powder:(EN?'Powder explosion':'Wybuch prochu'),fire:(EN?'Fire':'Ogień'),poison:(EN?'Poison':'Trucizna'),bleed:(EN?'Bleeding':'Krwawienie')};
const DEATH_ENEMIES={bat:(EN?'Bat':'Nietoperz'),wisp:(EN?'Will-o\'-wisp':'Błędny ognik'),boss:(EN?'The Conjoined':'Zrost'),cumlin:(EN?'Cumlin, the Possessed Dwarf King':'Cumlin, Opętany Król Krasnoludów'),beast:(EN?'Morhad, Beast of a Thousand Slaughters':'Morhad, Bestia Tysiąca Rzezi'),glizzard:(EN?'Glizard, The Glizzy G-Lord':'Glizzard, Wielki Paruwiak'),boginka:(EN?'The Lady of the Forest':'Pani Lasu'),leszy:(EN?'Leshy, Lord of the Wilds':'Leszy, Pan Kniei'),strzyga:(EN?'Mother Striga, Queen of the Barrows':'Strzyga Matka, Królowa Kurhanów')};
function deathCauseName(source){if(typeof source==='string')return DEATH_CAUSES[source]||(EN?'The Night':'Noc');if(!source?.type)return (EN?'The Night':'Noc');if(source.named&&source.nmN)return source.nmN;const ch=source.chapter??CH;if(source.type==='collector')return ch===5?(EN?'Arch-Judge Reckoner':'Arcysędzia Rachmistrz'):(EN?'Order Collector':'Poborca Zakonu');if(source.type==='boss'&&ch===5)return (EN?'The Creditor':'Wierzyciel');return ENAME[source.type]||DEATH_ENEMIES[source.type]||(EN?'The Night':'Noc')}

// 9.11.2026: jedna rada na ekranie śmierci, dobrana do tego, co zabiło, i do przebiegu nocy
function deathTip(src){const T=(pl,en)=>EN?en:pl,g=k=>[...k].includes(src);
  if(BIG.has(src)||['collector','boginka','glizzard'].includes(src))return T('Boss zapowiada ciosy: obserwuj zamach, odskocz w ostatniej chwili i bij, gdy odpoczywa po ataku.','Bosses telegraph their blows: watch the wind-up, dodge at the last moment and strike while they recover.');
  if(src==='poison'||src==='bleed')return T('Statusy zabijają powoli: gdy pasek życia spada sam, odsuń się od walki i zbierz serce albo przeczekaj.','Status effects kill slowly: when your health keeps falling, step out of the fight and grab a heart or wait it out.');
  if(src==='fire'||src==='powder')return T('Ogień i proch ranią każdego w pobliżu: nie stój przy beczkach i płonącej ziemi.','Fire and powder hurt everyone nearby: stay away from barrels and burning ground.');
  if(['xbow','scribe','monk'].includes(src))return T('Strzelcy nie lubią bliskiego dystansu: biegnij do nich bokiem, a nie prosto pod pociski.','Ranged foes hate being rushed: close in from the side, not straight into their shots.');
  if(['goat','bies','strzygon','paperrat','hound','zmora','courtraven'].includes(src))return T('Ten wróg rzuca się skokiem: gdy się zbiera, odskocz w bok i kontruj.','This enemy lunges: when it winds up, dodge sideways and counter.');
  if(['executioner','judge','warden','rotknight','bookgolem','knight','marauder','cursed','arbiter','gravedigger','wight','shieldman'].includes(src))return T('Ciężkie ciosy lepiej parować: zablokuj tuż przed uderzeniem, a wróg zostanie ogłuszony.','Heavy blows are better parried: block just before impact and the enemy is stunned.');
  if((S.parries||0)===0&&(S.hitsT||0)>=15)return T('Dużo trafień i żadnego parowania: spróbuj bloku tuż przed ciosem, to najtańsza obrona w grze.','Many hits taken and no parries: try blocking right before impact, it is the cheapest defence in the game.');
  return T('Otoczyli cię: nie stój w tłumie, prowadź wrogów za sobą i tnij tych na krawędzi grupy.','You were surrounded: don\'t stand in the crowd, lead enemies behind you and cut down the ones at the edge.')}
const HB=new Map();
function hbClear(){for(const el of HB.values())el.remove();HB.clear()}
const GUARD_TOPS=new WeakMap();
function guardianBarAnchor(g){const m=g.mesh,image=m.material.map.image;let top=GUARD_TOPS.get(image);if(top===undefined){top=0;if(image.getContext){const d=image.getContext('2d').getImageData(0,0,image.width,image.height).data;findTop:for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)if(d[(y*image.width+x)*4+3]>=128){top=y/image.height;break findTop}}GUARD_TOPS.set(image,top)}if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();const b=m.geometry.boundingBox;m.updateWorldMatrix(true,false);V.set(0,b.max.y-top*(b.max.y-b.min.y),0);m.localToWorld(V);return V.project(cam)}
// 10.11.2026: edge pointers to off-screen bosses, named elites, the hunt target and Marga's stall
const EDG={els:[],v:new THREE.Vector3()};
function edgeTick(){let box=$('nbEdge');const on=!!(S&&S.phase==='play'&&!S.paused&&!S.intro&&!S.choosing&&!S.shop&&!S.dialog&&!S.notice&&!pl.dead);
  if(!on){if(box)box.style.display='none';return}
  if(!box){box=document.createElement('div');box.id='nbEdge';box.setAttribute('aria-hidden','true');box.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;pointer-events:none;z-index:5';document.body.appendChild(box)}
  box.style.display='block';const T=[];
  for(const e of S.enemies){if(e.dead||e.rise>0)continue;if(e.hunt)T.push([e.x,e.y,'#ffd95a','\u25c6']);else if(e.named)T.push([e.x,e.y,'#e0555a','\u2605']);else if(bossBar(e))T.push([e.x,e.y,'#ff6a4a','!'])}
  if(S.merchant&&S.merchant.state!=='out')T.push([S.merchant.x,S.merchant.y,'#e8c25a','M']);
  const r=$('screen').getBoundingClientRect(),V=EDG.v;let n=0;
  for(const [x,y,col,ch] of T){if(n>=4)break;V.set(x/16,1,y/16).project(cam);if(V.z<1&&Math.abs(V.x)<.97&&Math.abs(V.y)<.95)continue;
    let el=EDG.els[n];if(!el){el=document.createElement('div');el.style.cssText='position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;background:#0d0b0ecc;border:2px solid #fff;box-shadow:0 0 8px #000;font:700 15px/22px Georgia,serif;text-align:center';el.innerHTML='<b></b><i style="position:absolute;left:50%;top:50%;width:0;height:0;margin:-6px 0 0 -4px;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:8px solid #fff"></i>';box.appendChild(el);EDG.els[n]=el}
    let vx=V.x,vy=-V.y;if(V.z>1){vx=-vx;vy=-vy}const px=vx*r.width/2,py=vy*r.height/2,t=Math.min((r.width/2-34)/Math.max(1e-3,Math.abs(px)),(r.height/2-34)/Math.max(1e-3,Math.abs(py))),a=Math.atan2(py,px);
    el.style.display='block';el.style.left=(r.left+r.width/2+px*t)+'px';el.style.top=(r.top+r.height/2+py*t)+'px';el.style.borderColor=col;el.style.color=col;el.firstChild.textContent=ch;el.lastChild.style.borderLeftColor=col;el.lastChild.style.transform='rotate('+a+'rad) translate(21px,0)';n++}
  for(let i=n;i<EDG.els.length;i++)EDG.els[i].style.display='none'}
function hbTick(){const box=$('hbs');if(!box)return;

  for(const [e,el] of HB)if(e==='guard'||e==='guard2'?!S||!(e==='guard'?S.swordGuardian:pl2?.actives?.swordGuardian):(e.dead||!S||!S.enemies.includes(e))){el.remove();HB.delete(e)}
  if(!S)return;
  for(const e of S.enemies){if(e.dead||e.rise>0||BIG.has(e.type)||e.type==='collector'||e.type==='glizzard'||e.type==='boginka'||e.type==='wisp'||e.type==='bat')continue;
    const elite=e.mini||(e.max>=90&&e.hp<e.max)||((e.type==='debtor'||e.type==='wraith')&&Math.hypot(e.x-pl.x,e.y-pl.y)<130);if(!elite)continue;
    let el=HB.get(e);if(!el){el=document.createElement('div');el.className='hb'+(e.mini?' m':'');el.innerHTML='<b></b><i><u></u></i>';el.firstChild.textContent=e.named?'★ '+e.nmN:(e.mini?(EN?'Elite: ':'Elita: '):'')+(ENAME[e.type]||(EN?'Enemy':'Wróg'));box.appendChild(el);HB.set(e,el)}
    V.set(e.x/16,ftEntH(e)+.45,e.y/16).project(cam);
    el.style.left=((V.x+1)/2*100)+'%';el.style.top=((1-V.y)/2*100)+'%';el.lastChild.firstChild.style.width=Math.max(0,e.hp/e.max*100)+'%'}
  for(const [guardKey,g] of [['guard',S.swordGuardian],['guard2',pl2?.actives?.swordGuardian]]){if(g&&!g.gone){let el=HB.get(guardKey);if(!el){el=document.createElement('div');el.className='hb gd';el.innerHTML='<i><u></u></i>';el.setAttribute('role','progressbar');el.setAttribute('aria-label',(EN?'Golem health':'Życie golema'));el.setAttribute('aria-valuemin','0');box.appendChild(el);HB.set(guardKey,el)}guardianBarAnchor(g);el.style.left=((V.x+1)/2*100)+'%';el.style.top='calc('+((1-V.y)/2*100)+'% - 7px)';el.setAttribute('aria-valuemax',Math.ceil(g.max));el.setAttribute('aria-valuenow',Math.max(0,Math.ceil(g.hp)));el.lastChild.firstChild.style.width=Math.max(0,Math.min(100,g.hp/g.max*100))+'%'}}}
let msgT=0;
let HINTS_ENABLED=true;try{HINTS_ENABLED=localStorage.getItem('pn_hints')!=='0'}catch(e){}
function setHints(on){HINTS_ENABLED=!!on;$('hintsTgl').checked=HINTS_ENABLED;try{localStorage.setItem('pn_hints',on?'1':'0')}catch(e){}if(!on){$('tut').classList.remove('on');$('tutSkip').hidden=true}TUT.sid=null}
// the old pausing event box is gone; this only hands out a pending Wit reward once its message has been shown
function pumpNotice(){if(!S||S.phase!=='play'||S.notice||S.intro||S.dialog||S.choosing||S.shop||S.paused)return;if(S.witRewardPending&&S.pendLv>0&&!S.banner&&!(S.noticeQueue||[]).length){S.witRewardPending=false;openLevelUp()}}
function dismissNotice(){if(!S||!S.notice)return;S.notice=null;$('notice').hidden=true;resetInput();for(const k in keys)keys[k]=false;pumpNotice();if(!S.notice)$('touch').hidden=!coarse||!!(S.dialog||S.choosing||S.shop||S.intro||S.paused)}
function say(t,kind='event'){if(!t)return;if(kind==='hint'&&isPort())return;if(S&&S.phase==='play'){const q=S.noticeQueue||(S.noticeQueue=[]);if(S.banner?.text!==t&&!q.some(n=>n.text===t))q.push({text:t,kind});return}const m=$('msg');m.classList.remove('boss','tick','tickhold');m.textContent=t;m.classList.add('on');clearTimeout(msgT);msgT=setTimeout(()=>m.classList.remove('on'),messageDuration(t)*1000)}
// Event messages: a banner at the top of the screen that never pauses the game. Each stays MSG.show seconds of play
// time at minimum, extended by text length up to MSG.max; the next waits until fade-out ends (MSG.gap).
// The banner waits (and hides) while the game is paused, in a dialog, on level-up cards, in the shop or the intro.
const MSG={show:3,gap:.45,threshold:60,perChar:.025,max:7};
function messageDuration(text){return Math.min(MSG.max,MSG.show+Math.max(0,[...String(text)].length-MSG.threshold)*MSG.perChar)}
// Pion (telefon): komunikaty fabularne i bossów ('story'/'boss') jadą jako pasek jednej linijki i nie zatrzymują gry; samouczek jest wyłączony.
function isPort(){const s=$('screen');return !!(s&&s.classList.contains('port'))}
const MSG_TICK={min:6,max:16,base:2.5,perChar:.11};
function tickDuration(text){return Math.min(MSG_TICK.max,Math.max(MSG_TICK.min,MSG_TICK.base+[...String(text)].length*MSG_TICK.perChar))}
function bannerTick(dt){const m=$('msg');if(!S||S.phase!=='play'){S&&(S.banner=null);return}
  const hold=!!(S.paused||S.choosing||S.shop||S.dialog||S.intro||S.witChoice||pl.dead);
  if(S.banner){if(hold){m.classList.remove('on');m.classList.add('tickhold');return}m.classList.remove('tickhold');S.banner.t-=dt;if(S.banner.t>0){m.classList.add('on');return}m.classList.remove('on');if(S.banner.t<=-MSG.gap)S.banner=null;return}
  if(hold)return;const next=(S.noticeQueue||[]).shift();if(!next)return;
  const tick=(next.kind==='story'||next.kind==='boss')&&isPort()&&!matchMedia('(prefers-reduced-motion:reduce)').matches,dur=tick?tickDuration(next.text):messageDuration(next.text);
  S.banner={text:next.text,kind:next.kind,t:dur};m.classList.remove('tickhold');m.classList.toggle('tick',tick);m.classList.toggle('boss',next.kind==='boss');
  if(tick){m.textContent='';const sp=document.createElement('span');sp.textContent=next.text;m.appendChild(sp);m.style.setProperty('--tickT',dur+'s')}else m.textContent=next.text;
  m.classList.add('on')}
function nearPowerFire(){if(!S||pl.dead||S.rebirthUsed||S.rebirth)return null;let result=null,best=32;for(let i=0;i<SHRINES.length;i++){const f=SHRINES[i],d=Math.hypot(pl.x-f.x,pl.y-f.y);if(d<best){best=d;result={...f,index:i,kind:'powerFire'}}}return result}
function activatePowerFire(f){if(!f||!S||S.rebirth||S.rebirthUsed)return false;S.rebirth={ch:CH,x:pl.x,y:pl.y,index:f.index};play('bless',0);say((EN?'The Nourishing Cauldron remembers your Brand. Tonight you will return once. Revival costs half of the character experience earned this night. Your coins will stay where you died.':'Sycący Kociołek zapamiętuje twoje Piętno. Tej nocy powrócisz raz. Odrodzenie kosztuje połowę doświadczenia postaci otrzymanego za noc. Monety zostaną w miejscu śmierci.'));return true}
let _fgt=null;function fireGlowTex(){if(_fgt)return _fgt;const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),gr=x.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,255,255,.6)');gr.addColorStop(.45,'rgba(255,255,255,.28)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,128,128);return _fgt=new THREE.CanvasTexture(c)}
const POT_PNG='./assets/00a19433f6e4d7a9436e350b567cabcf808435eba909266bde9f749922afbb93.png';let _potImg=null,_potFr=null;function potLoad(cb){if(_potFr){cb(_potFr);return}if(!_potImg){const im=_potImg=new Image();im.nbKey='pot';im.nbDensity=5;im.cbs=[];im.onload=()=>{try{_potFr=procFrame(im,0,0,im.width/5,im.height/5,'prop');cutCircle(_potFr.n)}catch(e){_potFr=null}for(const f of im.cbs)f(_potFr);im.cbs=[]};im.src=POT_PNG}_potImg.cbs.push(cb)}
function preparePowerFires(w){if(!A.powerFire)A.powerFire=[[64,64],[96,64],[0,96],[32,96]].map(([x,y])=>procFrame(IMGS.br_props,x,y,32,32,'prop'));
  w.fireMarkers=[];for(const o of w.propObjs)if(o.kind==='shrine'){o.frames=A.powerFire;o.fps=6;o.mesh.geometry=geo32;o.mesh.material=o.frames[0].n;o.mesh.castShadow=false;potLoad(fr=>{if(!fr||!_potImg)return;const hh=1.6,g=new THREE.PlaneGeometry(hh*_potImg.width/_potImg.height,hh).translate(0,hh/2-.1,0),nn=g.attributes.normal;for(let i=0;i<nn.count;i++)nn.setXYZ(i,0,.8,.6);o.frames=[fr];o.fps=0;o.mesh.geometry=g;o.mesh.material=fr.n});const mat=new THREE.MeshBasicMaterial({map:fireGlowTex(),color:0xffad55,transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}),ring=new THREE.Mesh(new THREE.PlaneGeometry(3.4,3.4).rotateX(-Math.PI/2),mat);ring.position.set(o.mesh.position.x,.035,o.mesh.position.z);w.group.add(ring);w.fireMarkers.push({mesh:ring,index:o.si})}for(const l of w.LSRC)if(l.kind==='shrine')l.col=0xffa355}
function makeDeathPurse(x,y,amount){if(!(amount>0))return;const mesh=new THREE.Mesh(geoC,A.pick.c.n);mesh.scale.setScalar(.8);mesh.position.set(x/16,.2,y/16);scene.add(mesh);(S.deathPurses||(S.deathPurses=[])).push({ch:CH,x,y,amount,mesh,ready:false})}
function updatePowerVisuals(){fireFxTick();roofTick();if(!S)return;loopSnd('pot','Kociolek',clock-(S.potHealT||-9)<.25?.7:0);for(const f of W.fireMarkers||[]){const armed=S.rebirth&&S.rebirth.ch===CH&&S.rebirth.index===f.index;f.mesh.material.color.setHex(S.rebirthUsed||S.rebirth&&!armed?0x766b65:armed?0x8cead4:0xffad55);f.mesh.material.opacity=(S.rebirthUsed||S.rebirth&&!armed)?.18:armed?.85:.48+.18*Math.sin(clock*2);{const pv=S.pot&&S.pot[CH+':'+f.index];if(pv!=null&&pv<=0){f.mesh.material.color.setHex(0x555555);f.mesh.material.opacity=.15}}if(S.fxHeal!=null&&f.index===S.fxHealIdx&&clock-S.fxHeal<.25){f.mesh.material.color.setHex(0x9dffc0);f.mesh.material.opacity=.95;f.mesh.scale.setScalar(1.15+.12*Math.sin(clock*8))}else f.mesh.scale.setScalar(1)}for(const p of S.deathPurses||[]){p.mesh.visible=p.ch===CH;p.mesh.position.set(p.x/16,.2+Math.sin(clock*3)*.035,p.y/16)}}
function recoverPurses(){for(let i=(S.deathPurses||[]).length-1;i>=0;i--){const p=S.deathPurses[i];if(p.ch!==CH)continue;const distance=Math.hypot(pl.x-p.x,pl.y-p.y);if(!p.ready){if(distance>24)p.ready=true;continue}if(distance>16)continue;S.coins+=p.amount;scene.remove(p.mesh);S.deathPurses.splice(i,1);play('coin',0);say((EN?'You recover the purse from where you died: ':'Odzyskujesz sakwę z miejsca śmierci: ')+p.amount+(EN?' coins.':' monet.'))}}
function tryRebirth(){if(!S.rebirth||S.rebirthUsed)return false;clearSwordTransient();S.swordTrails=[];const f=S.rebirth;makeDeathPurse(pl.x,pl.y,S.coins);S.coins=0;S.rebirthUsed=true;S.deaths=1;let x=f.ch===CH?f.x:START.x,y=f.ch===CH?f.y:START.y;
  if(boxSolid(x,y,4,3)){x=START.x;y=START.y}Object.assign(pl,{x,y,hp:Math.max(1,Math.round(pl.max*.7)),dead:false,deadT:0,inv:3,roll:0,rollCd:0,atk:null,block:false,charging:false,atkHeld:false,queue:false,swingT:0,broken:0,hurtT:0,sta:pl.staMax,mana:pl.manaMax,manaDelay:0});S.endT=0;S.hurt=0;S.hitstop=0;S.snare=0;S.slowT=0;camTarget.set(x/16,0,y/16);resetInput();play('bless',0);say((EN?'The Nourishing Cauldron brings you back to life. Character experience for this night: −50%. Your purse waits where you fell. Another death will end the night without its rewards.':'Sycący Kociołek przywraca cię do życia. Doświadczenie postaci za tę noc: −50%. Sakwa czeka tam, gdzie upadłeś. Kolejna śmierć zakończy noc bez jej nagród.'));return true}
function loseSecondLife(){clearSwordTransient();if(!S.rebirthUsed)return;S.finalDeathLoss=true;S.deaths=2;S.coins=0;S.xp=0;for(const p of S.deathPurses||[])scene.remove(p.mesh);S.deathPurses=[];for(let i=S.picks.length-1;i>=0;i--)if(S.picks[i].k==='c'){scene.remove(S.picks[i].mesh);scene.remove(S.picks[i].glow);S.picks.splice(i,1)}}
function offerWitChoice(){S.witChoice=true;$('witChoices').hidden=false;document.querySelector('#dialog .next').hidden=true;$('dlgTxt').textContent=(EN?'"It wasn\'t my decision. But orders are orders… That\'s what I told myself. I\'m begging you, kill me. I don\'t want to live with it any more." What do you decide?':'„To nie była moja decyzja. Ale rozkaz to rozkaz… Tak sobie wtedy mówiłem. Błagam, zabij mnie. Nie chcę już z tym żyć”. Co postanawiasz?');resetInput();$('witLeave').focus()}
function chooseWit(mercy){if(!S||!S.witChoice||S.dialog?.id!=='wit')return;const n=S.dialog,st=S.npc.wit;S.witChoice=false;S.dialog=null;$('witChoices').hidden=true;$('dialog').hidden=true;document.querySelector('#dialog .next').hidden=false;S.ev.add('w');resetInput();
  if(mercy){st.state='spared';S.coins+=30;const xp=S.need*.5;S.xp+=xp;while(S.xp>=S.need){S.xp-=S.need;S.lvl++;S.need=xpNeed(S.lvl);S.pendLv++}S.witRewardPending=S.pendLv>0;play('coin',0);say((EN?'You leave Wit in the stocks. He gives you a hidden purse: +30 coins. This choice grants half a bar of night-level experience.':'Pozostawiasz Wita w dybach. Oddaje ci ukrytą sakiewkę: +30 monet. Ta decyzja daje pół paska doświadczenia poziomu nocy.'));}
  else{st.state='dead';pool(n.x,n.y,18,7);const e=spawnEnemy('wraith',n.x+20,n.y+8,{rise:1,stolen:0,witSpecter:true});e.stolen=S.coins;S.coins=0;play('bossGrowl',0);say((EN?'You finish Wit off. With his last breath, a Ledger Wraith arrives from the Citadel and takes your coins. Defeat it to get them back.':'Dobijasz Wita. Z jego ostatnim tchnieniem przybywa Upiór rachunków z Cytadeli i zabiera twoje monety. Pokonaj go, by je odzyskać.'));}}

function shake(m,t){if(!SETT.shake)return;S.shakeM=Math.max(S.shakeM,m);S.shakeT=Math.max(S.shakeT,t)}
// Blood HD: shared artwork, bounded reusable meshes, no gameplay randomness or shaders.
const BLOOD_HD_ON=new URLSearchParams(location.search).get('blood')!=='0';
const bloodHD={ready:false,stamps:[],textures:[],ground:[],sprays:[],drops:null,dropDummy:new THREE.Object3D(),serial:0,groundNext:0,sprayNext:0};
function initBloodHD(){
  if(!BLOOD_HD_ON)return;
  const im=new Image();im.onload=()=>{
    for(let i=0;i<8;i++){
      const w=im.width/4,h=im.height/2,cv=canvas(w,h);
      cv.getContext('2d').drawImage(im,(i%4)*w,Math.floor(i/4)*h,w,h,0,0,w,h);
      if(i<4)bloodHD.stamps.push(cv);
      const t=new THREE.CanvasTexture(cv);t.minFilter=THREE.LinearMipMapLinearFilter;t.magFilter=THREE.LinearFilter;
      t.generateMipmaps=true;bloodHD.textures.push(t);
    }
    const geo=new THREE.PlaneGeometry(1,1);
    for(const [list,count,ground] of [[bloodHD.ground,64,true],[bloodHD.sprays,16,false]]){
      for(let i=0;i<count;i++){
        const mat=new THREE.MeshBasicMaterial({map:bloodHD.textures[(ground?0:4)+i%4],transparent:true,depthWrite:false,alphaTest:.018,fog:true});
        const mesh=new THREE.Mesh(geo,mat);mesh.visible=false;mesh.renderOrder=ground?1:5;
        if(ground)mesh.rotation.x=-Math.PI/2;scene.add(mesh);list.push({mesh,active:false,age:0});
      }
    }
    // Small rounded droplets use the existing ballistic particles, in one draw call.
    const cv=canvas(64,96),g=cv.getContext('2d');
    g.beginPath();g.moveTo(32,5);g.bezierCurveTo(27,25,12,44,13,63);g.bezierCurveTo(13,89,51,89,51,63);g.bezierCurveTo(52,44,37,25,32,5);g.closePath();
    const fill=g.createLinearGradient(12,15,51,83);fill.addColorStop(0,'#ca3440');fill.addColorStop(.38,'#961322');fill.addColorStop(1,'#3e0813');g.fillStyle=fill;g.fill();
    g.beginPath();g.ellipse(24,58,4,10,.28,0,Math.PI*2);g.fillStyle='rgba(229,103,103,.35)';g.fill();
    const tex=new THREE.CanvasTexture(cv);tex.minFilter=THREE.LinearMipMapLinearFilter;tex.magFilter=THREE.LinearFilter;
    bloodHD.drops=new THREE.InstancedMesh(geo,new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,alphaTest:.03,opacity:.94,fog:true}),160);
    bloodHD.drops.instanceMatrix.setUsage(THREE.DynamicDrawUsage);bloodHD.drops.count=0;bloodHD.drops.frustumCulled=false;bloodHD.drops.renderOrder=5;scene.add(bloodHD.drops);
    bloodHD.ready=true;
  };
  im.src='assets/ec46e83d933a2db80e3e82c795ba3a9ec7e50910bbdd085df486bc0be2b26d3e.png';
}
function resetBloodHD(){for(const f of [...bloodHD.ground,...bloodHD.sprays]){f.active=false;f.mesh.visible=false}if(bloodHD.drops)bloodHD.drops.count=0;bloodHD.serial=0;bloodHD.groundNext=0;bloodHD.sprayNext=0}
function stampBloodHD(x,y,w,h,old=false){
  if(!bloodHD.ready)return false;
  if(VOID.has(tileAt(Math.floor(x/TS),Math.floor(y/TS))))return true;
  const f=bloodHD.ground[bloodHD.groundNext++%bloodHD.ground.length],id=++bloodHD.serial;
  Object.assign(f,{active:true,age:old?75:0,ch:CH,dur:210,x,y});
  f.mesh.position.set(x/16,.027+(id%7)*.0004,y/16);
  f.mesh.rotation.z=(id*2.399963)%6.283185;
  f.mesh.scale.set(Math.max(.22,w/16)*1.3,Math.max(.2,h/16)*1.5,1);
  f.mesh.material.color.setHex(old?0x65565c:0xb39595);f.mesh.material.opacity=old?.46:.76;
  f.mesh.visible=true;return true;
}
function sprayBloodHD(x,y,n,nx,ny,spread){
  if(!bloodHD.ready)return false;
  const f=bloodHD.sprays[bloodHD.sprayNext++%bloodHD.sprays.length],len=Math.hypot(nx,ny)||1;
  const dx=nx/len,dy=ny/len,size=Math.min(2.3,.72+Math.sqrt(Math.max(1,n))*.17);
  Object.assign(f,{active:true,age:0,dur:.27,ch:CH,x,y,dx,dy,size,stamped:false});
  f.mesh.material.color.setHex(0xbb7c7c);f.mesh.material.opacity=.82;
  f.mesh.position.set(x/16+dx*.25,.55,y/16+dy*.25);f.mesh.visible=true;return true;
}
function syncBloodHD(dt){
  if(!bloodHD.ready)return;
  let count=0;const d=bloodHD.dropDummy;
  if(S)for(let i=S.parts.length-1;i>=0&&count<160;i--){
    const p=S.parts[i];if(p.k!=='b'||!p.bloodHD||p.bloodVisible===false||p.z<=0)continue;
    const speed=Math.hypot(p.vx,p.vy),v=Math.abs(p.vx*.31+p.vy*.17)%1;
    const size=(.075+v*.035)*Math.min(1,.45+p.z/6);
    d.position.set(p.x/16,p.z/16+.02,p.y/16);d.quaternion.copy(cam.quaternion);
    d.rotateZ(Math.atan2(p.vz*Math.cos(PITCH)-p.vy*Math.sin(PITCH),p.vx)-Math.PI/2);
    d.scale.set(size,size*(1.25+Math.min(1.1,speed/100)),1);d.updateMatrix();bloodHD.drops.setMatrixAt(count++,d.matrix);
  }
  bloodHD.drops.count=count;bloodHD.drops.instanceMatrix.needsUpdate=true;
  for(const f of bloodHD.ground){
    if(!f.active)continue;f.age+=dt;
    if(f.age>=f.dur){f.active=false;f.mesh.visible=false;continue}
    const t=Math.min(1,f.age/65);f.mesh.material.color.setRGB(.70-.31*t,.58-.25*t,.58-.23*t);
    f.mesh.material.opacity=(.76-.28*t)*Math.min(1,(f.dur-f.age)/25);
    f.mesh.visible=!!S&&f.ch===CH&&Math.hypot(f.x-pl.x,f.y-pl.y)<380;
  }
  for(const f of bloodHD.sprays){
    if(!f.active)continue;f.age+=dt;
    if(f.ch!==CH){f.active=false;f.mesh.visible=false;continue}
    if(!f.stamped&&f.age>=.16){stampBloodHD(f.x+f.dx*8,f.y+f.dy*8,6+f.size*4,4+f.size*3);f.stamped=true}
    if(f.age>=f.dur){f.active=false;f.mesh.visible=false;continue}
    const t=f.age/f.dur;f.mesh.visible=!!S&&f.ch===CH&&!S.enemies.some(e=>!e.dead&&attackCue(e)&&Math.hypot(e.x-f.x,e.y-f.y)<e.r+f.size*18);
    f.mesh.quaternion.copy(cam.quaternion);f.mesh.rotateZ(Math.atan2(-f.dy*.7,f.dx));
    f.mesh.position.set(f.x/16+f.dx*(.25+t*.4),.55+t*.15,f.y/16+f.dy*(.25+t*.4));
    f.mesh.scale.set(f.size*(.72+t*.4),f.size*(.68-t*.18),1);
    f.mesh.material.opacity=.85*Math.min(1,(1-t)*2.5);
  }
}
initBloodHD();
function blood(x,y,n,nx,ny,spread=1){const hd=sprayBloodHD(x,y,n,nx,ny,spread);const art=chapterArt(),c0=art?'#74202a':P.blood,c1=art?'#39141c':P.blood2;const b=Math.atan2(ny,nx),m=n>=100?n:n<=3?n*3:n*2;for(let i=0;i<m;i++){const a=b+(Math.random()-.5)*2.2*spread,s=(25+Math.random()*100)*(art?.72:1);S.parts.push({k:'b',bloodHD:hd,bloodVisible:i%Math.max(1,Math.ceil(m/18))===0,x,y,z:8+Math.random()*8,vx:Math.cos(a)*s,vy:Math.sin(a)*s,vz:15+Math.random()*70,c:Math.random()<.65?c0:c1});if(i%2===0&&m<100){const a2=b+(Math.random()-.5)*1.6*spread,s2=10+Math.random()*45;S.parts.push({k:'d',bloodHD:hd,x,y,z:10+Math.random()*10,vx:Math.cos(a2)*s2,vy:Math.sin(a2)*s2,vz:6+Math.random()*26,c:Math.random()<.5?c1:art?'#5e1722':'#6e0f12',life:.25+Math.random()*.3})}}}
function decalAt(cv,x,y,a=1){if(bloodHD.ready&&DEC.spray?.includes(cv)){stampBloodHD(x,y,18,11);return}dg.globalAlpha=a;dg.drawImage(cv,Math.round(x-16),Math.round(y-16));dg.globalAlpha=1;decalDirty=true}
function pool(x,y,w,h){if(stampBloodHD(x,y,w,h))return;if(DEC.pool){decalAt(DEC.pool[w<14?0:w<19?1:w<30?2:3],x,y);return}x=Math.round(x);y=Math.round(y);dg.fillStyle=P.blood2;dg.fillRect(x-w/2,y-h/2+1,w,h-2);dg.fillStyle=P.blood;dg.fillRect(x-w/4,y-1,w/2,2);decalDirty=true}
function heal(n){if(pl.dead||pl.hp>=pl.max)return 0;const h=Math.min(n,pl.max-pl.hp);pl.hp+=h;return h}
const might=()=>(1+.1*(S.whet||0))*(S.fury>0?1.2:1)*(S.pk?S.pk.dmg:1);
function spriteMesh(geo){const m=new THREE.Mesh(geo,A.fx.slash[0].n);scene.add(m);return m}
function addVfx(anim,dur,x,y,h,size,mode,rot=0,flip=1){const m=spriteMesh(geoC);m.renderOrder=6;setFrame(m,anim[0]);const f={mesh:m,anim,t:0,dur,x,y,h,size,mode,rot,flip};polishMagic(f,anim._magicKind);S.vfx.push(f);return m}
// Combat presentation only: never changes AI, hitboxes, rewards or gameplay RNG.
const COMBAT_POLISH_ON=new URLSearchParams(location.search).get('combatfx')!=='0';
let combatVisualSeed=0x63b09a17;
function combatVisualBuild(fn){const original=Math.random;Math.random=()=>{combatVisualSeed=(Math.imul(combatVisualSeed,1664525)+1013904223)>>>0;return combatVisualSeed/4294967296};try{return fn()}finally{Math.random=original}}
const MAGIC_KINDS=new Set(['frostf','firef','frosti','firei','freeze','burn','poison','bleed','knock','stone','bolt','boss','boltHit','earth']);
function polishMagic(f,kind){
  if(!COMBAT_POLISH_ON||!kind)return f;f.magicKind=kind;
  if(f.mode==='ground')return f;
  f.weaponAspect=.8;
  if(['frostf','firef','bolt','boss'].includes(kind)){
    f.magicFlying=true;f.size=Math.min(f.size,kind==='frostf'?.9:kind==='firef'?.86:.65);f.h=1.5;
    const a=-(f.rot||0),x=Math.cos(a),y=Math.sin(a)/Math.sin(PITCH),n=Math.hypot(x,y)||1;f.magicDx=x/n;f.magicDy=y/n;
  }else if(['freeze','burn','poison','bleed'].includes(kind)){f.size*=.72;f.h=1.3}
  else if(kind==='firei'||kind==='frosti'){f.size*=.82;f.h=1.45}
  else if(kind==='boltHit'){f.size*=.8;f.h=1.35}
  else if(kind==='knock'){f.mode='ground';f.h=.09;f.sy=1/Math.sin(PITCH);f.weaponAspect=null}
  else{f.size*=.85;f.h=Math.max(1.4,f.h)}
  return f;
}
function magicMaterialMode(fr,soft=false){
  const key=soft?'cmSoft':'cm';if(!fr[key]){const m=combatVisualBuild(()=>fr.n.clone());m.transparent=true;m.depthWrite=false;m.depthTest=true;m.opacity=soft?.28:.84;fr[key]=m}return key;
}
function combatThreatNear(x,y,r=0){return !!(S&&S.enemies.some(e=>!e.dead&&attackCue(e)&&Math.hypot((e.mode==='up'||e.mode==='root'?e.tx:e.x)-x,(e.mode==='up'||e.mode==='root'?e.ty:e.y)-y)<r+e.r+38))}
function enemyImpactShape(e){
  const v=e.visualHit;if(!COMBAT_POLISH_ON||!SETT.shake||!v||v.t<=0)return null;if(attackCue(e))return {push:0,lean:0,stretch:0};
  const t=1-v.t/v.life,p=Math.min(1,t/.22),q=t<.22?1-(1-p)*(1-p):Math.pow((1-t)/.78,2);
  return {push:v.amplitude*q,lean:(v.heavy?.065:.038)*q,stretch:(v.heavy?.045:.025)*q};
}
// Visual-only blade placement: owner-relative anchor and floor-safe billboard bounds.
const WEAPON_FX_ON=new URLSearchParams(location.search).get('weaponfx')!=='0',WEAPON_BOX=new WeakMap();
function bindWeaponFx(f,owner=pl){if(!f)return f;f.weaponOwner=owner;f.weaponX=owner.x;f.weaponY=owner.y;f.weaponAspect=.74;return f}
function weaponFloorLift(f,fr){
  const key=f.size+':'+f.rot+':'+f.weaponAspect;if(f.weaponFloor!==undefined&&f.weaponFloorKey===key)return f.weaponFloor;f.weaponFloorKey=key;
  let bottom=0;
  for(const frame of f.anim){const im=frame?.n?.map?.image;if(!im)continue;
  let b=WEAPON_BOX.get(im);
  if(!b){let l=.08,r=.92,t=.08,d=.92;
    if(im.getContext){const g=im.getContext('2d'),w=im.width,h=im.height,a=g.getImageData(0,0,w,h).data;let x0=w,x1=0,y0=h,y1=0;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(a[(y*w+x)*4+3]>32){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}
      if(x0<=x1){l=x0/w;r=(x1+1)/w;t=y0/h;d=(y1+1)/h}}
    b=[l*2-1,r*2-1,1-t*2,1-d*2];WEAPON_BOX.set(im,b);
  }
  const a=f.rot||0,cs=Math.cos(a),sn=Math.sin(a),sy=f.weaponAspect||1;
  bottom=Math.min(bottom,...[b[0],b[1]].flatMap(x=>[b[2],b[3]].map(y=>(x*sn+y*sy*cs)*f.size)));
  }
  return f.weaponFloor=Math.max(f.h,(.035-bottom)/Math.cos(PITCH));
}
function emitWeaponSlash(a,c,s,R,owner=pl,trail=COMBAT_TRAIL[encLevel()[0]]||embTrail()){
  const heavy=a.kind==='h',size=Math.min(heavy?1.25:1.05,R/16*(heavy?.48:.44)),x=owner.x+c*R*.50,y=owner.y+s*R*.50,h=heavy?1.7:1.55,rot=-screenAng(c,s);
  let f;
  if(S.zab){
    if(heavy)f=zfx('fx_zab',2,.34,owner.x,owner.y,.72,R/16*.94,'ground',0);
    else f=zfx('fx_zab',a.combo===4?1:0,a.combo===4?.24:.22,x,y,h,size,'bill',rot);
  }else f=skAdd('slash',.26,x,y,h,size,'bill',rot,trail);
  if(!f){addVfx(A.fx.slash,.26,x,y,h,size,'bill',rot);f=S.vfx[S.vfx.length-1]}
  return bindWeaponFx(f,owner);
}
// ---- nowe animacje skilli i pocisków (Gemini, 30.10.2026): arkusz skill_fx, 192 px na klatkę ----
const SKM={"knock": [0, 6], "earth": [1, 6], "stone": [2, 6], "frostf": [3, 4], "frosti": [4, 6], "firef": [5, 4], "firei": [6, 6], "casc": [7, 6], "whirl": [8, 4], "wave1": [9, 6], "wave2": [10, 6], "rush": [11, 6], "slash": [12, 6], "bolt": [13, 3], "boltHit": [14, 6], "boss": [15, 4], "freeze": [16, 4], "burn": [17, 4], "poison": [18, 4], "bleed": [19, 4], "slash_fire": [20, 4], "slash_ice": [21, 4], "slash_poison": [22, 4], "slash_blood": [23, 4]},SKFX={};
// runda 245: statusy ostrza (ogień, lód, trucizna, krew) = te same animacje co stal, tylko przebarwione (mapa gradientu po jasności)
const SK_TINTS={fire:[[110,14,0],[255,104,18],[255,236,150]],ice:[[16,52,130],[84,184,255],[236,251,255]],poison:[[14,62,16],[108,220,58],[232,255,172]],blood:[[84,0,8],[188,18,30],[255,128,116]]};
function skTint(c,tint){const T=SK_TINTS[tint];if(!T)return;const g=c.getContext('2d'),d=g.getImageData(0,0,c.width,c.height),p=d.data;for(let i=0;i<p.length;i+=4){if(!p[i+3])continue;let l=Math.pow((p[i]*.299+p[i+1]*.587+p[i+2]*.114)/255,.8);l=Math.min(1,l*1.15);const a=l<.5?T[0]:T[1],b=l<.5?T[1]:T[2],q=l<.5?l*2:(l-.5)*2;p[i]=a[0]+(b[0]-a[0])*q;p[i+1]=a[1]+(b[1]-a[1])*q;p[i+2]=a[2]+(b[2]-a[2])*q}g.putImageData(d,0,0)}
function skFrames(k,tint){if(tint&&SKM[k+'_'+tint]){k+='_'+tint;tint=null}const key=tint?k+':'+tint:k;if(SKFX[key])return SKFX[key];const im=typeof IMGS!=='undefined'&&IMGS&&IMGS.skill_fx,m=SKM[k];if(!im||!m)return null;const out=[];for(let i=0;i<m[1];i++){const c=document.createElement('canvas');c.width=c.height=192;c.getContext('2d').drawImage(im,i*192,m[0]*192,192,192,0,0,192,192);if(tint)skTint(c,tint);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;out.push({n:new THREE.MeshBasicMaterial({map:t,transparent:true,alphaTest:.04,depthWrite:false,depthTest:false,side:THREE.DoubleSide,fog:false})})}if(MAGIC_KINDS.has(k))out._magicKind=k;return SKFX[key]=out}
function skLoop(fr,dur,fps){const n=Math.max(fr.length,Math.round(dur*fps/fr.length)*fr.length),o=[];for(let i=0;i<n;i++)o.push(fr[i%fr.length]);o._magicKind=fr._magicKind;return o}
function skAdd(k,dur,x,y,h,size,mode,rot=0,tint){const fr=skFrames(k,tint);if(!fr)return null;addVfx(fr,dur,x,y,h,size,mode||'bill',rot);return S.vfx[S.vfx.length-1]}


