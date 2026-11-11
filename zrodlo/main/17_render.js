/* ============ RENDER ============ */
const camTarget=new THREE.Vector3();let idleA=0;
// slasher hero v2 (S1-S4 sheets): every state has its own drawn-sword animation
function heroFrameV2(D){const fd=()=>Math.abs(pl.fx)>Math.abs(pl.fy)?'side':pl.fy>0?'down':'up',ix=(a,i)=>a[Math.max(0,Math.min(a.length-1,i|0))];
  if(pl.roll>0)return ix(D.roll,pl.rollT/.3*4);
  const K=S&&S.kat&&D.kat?D.kat:S&&S.kn&&D.kn?D.kn:null,Z=S&&S.zab&&D.zab?D.zab:null;
  if(K&&pl.atk&&pl.atk.kind==='whirl'){const a=pl.atk;if(a.stage==='rec')return ix(K.whirlRec,(1-a.t/WHIRL.recovery)*4);if(a.elapsed<.12)return ix(K.whirlWind,a.elapsed/.12*4);return at(K.whirlLoop,a.elapsed,13.3,true)}
  if(K&&pl.atk&&pl.atk.kind==='leap'){const a=pl.atk,arr=K.leap[fd()];return ix(arr,a.stage==='wind'?0:a.stage==='air'?(a.at<LEAP.air*.5?1:2):3)}
  if(Z&&pl.atk&&pl.atk.kind==='h'){const a=pl.atk;if(a.stage==='wind')return ix(Z.whirlWind,(1-a.t/(a.visualWind||SL.heavy.wind))*4);if(a.stage==='act')return ix(Z.whirlLoop,(1-a.t/SL.heavy.act)*Z.whirlLoop.length);return ix(Z.whirlRec,(1-a.t/SL.heavy.rec)*Z.whirlRec.length)}
  if(Z&&pl.atk&&pl.atk.kind==='rend'){const a=pl.atk,arr=Z.rend[fd()];return ix(arr,a.stage==='wind'?(1-a.t/REND.wind)*1.99:a.stage==='cut'?2+a.at/REND.dur*3.99:6+Math.min(1.99,(1-a.t/REND.rec)*2))}
  if(Z&&pl.atk&&pl.atk.kind==='fan'){const a=pl.atk,arr=Z.fan[fd()];return ix(arr,a.stage==='wind'?(1-a.t/FAN.wind)*3.99:4+(1-a.t/FAN.rec)*3.99)}
  if(K&&K.hook&&pl.atk&&pl.atk.kind==='hook'){const a=pl.atk,arr=K.hook[fd()];return ix(arr,a.stage==='wind'?(1-a.t/HOOK.wind)*1.99:a.stage==='fly'?2+Math.min(1.99,a.len/HOOK.dist*2):a.stage==='pull'?4+(1-a.t/HOOK.pull)*1.99:6+Math.min(1.99,(1-a.t/HOOK.rec)*2))}
  if(pl.atk){const a=pl.atk,P=a.kind==='h'?SL.heavy:SL.light,d=pl.swingDir===2?'side':pl.swingDir===0?'down':'up',zh=Z&&Z.hit&&a.kind!=='h'&&!a.visualRiposte&&a.combo>=3?Z.hit[Math.min(1,a.combo-3)][d]:null,asH=!zh&&(a.kind==='h'||(Z&&a.combo===4&&!a.visualRiposte)),arr=zh||(asH?D.heavy[d]:D.light[d][a.visualRiposte?2:(Z?[0,1,2,1,0][a.combo]:a.combo)||0]);
    if(a.stage==='wind')return ix(arr,asH?(a.t>(a.visualWind||P.wind)*.75?0:1):0);if(a.stage==='act')return ix(arr,asH?2:1);
    if(asH)return ix(arr,a.t>P.rec*.72?2:3);return ix(arr,a.t>P.rec*.5?2:3)}
  if(pl.swingT>0&&!pl.block&&!(pl.parryT>0)&&!(pl.broken>0)&&!(pl.hurtT>0)&&!pl.charging){const d=pl.swingDir===2?'side':pl.swingDir===0?'down':'up',dur=pl.swingDur||.25;return ix(D.light[d][0],(dur-pl.swingT)/dur*4)}
  if(pl.broken>0)return ix(D.broken,(1-pl.broken/SL.guardBreak)*4);
  if(pl.parryT>0)return ix(D.parryDir?D.parryDir[fd()]:D.parry,(.45-pl.parryT)/.45*4);
  if(pl.charging){const d=fd();return d==='side'?at(D.charge,clock,4.2):D.heavy[d][0]}
  if(pl.block){const d=fd();if(pl.gHitT>0)return d==='side'?D.guard[3]:D.parryDir?D.parryDir[d][0]:D.guard[d==='down'?1:2];if(pl.moving&&(D.guardWalkDir||d==='side'))return at(D.guardWalkDir?D.guardWalkDir[d]:D.guard_walk,pl.walk,6.7);return D.guard[d==='side'?0:d==='down'?1:2]}
  if(pl.hurtT>0)return ix(D.hurt,(.22-pl.hurtT)/.22*2);
  return null}
// enchant colour on the sword itself: the grey pixels on the sword side of every hero frame get the spell colour (per frame, built once, so it turns with the sprite)
const BLADE_TINT={venom:[150,255,70],fireblade:[255,122,30],iceblade:[110,200,255],bloodblade:[225,10,18]};
// krew: brazowa animacja uderzenia z arkusza zamieniona w krwista czerwien (jedna kopia przy starcie; reszta arkusza bez zmian)
function bloodFix(img,y0,hh){try{const w=img.width,h=img.height,c=canvas(w,h),g=c.getContext('2d');g.drawImage(img,0,0);const id=g.getImageData(0,y0,w,hh),d=id.data;
  for(let i=0;i<d.length;i+=4){if(d[i+3]===0)continue;const v=Math.min(1,Math.max(d[i],d[i+1],d[i+2])/255*1.9+.10);d[i]=215*v+10;d[i+1]=14*v;d[i+2]=18*v}
  g.putImageData(id,0,y0);return c}catch(e){return img}}
function heroBladeMat(fr,k){const key='E'+k;if(fr[key]!==undefined)return fr[key];fr[key]=null;try{const n=fr.n,mi=n&&n.map&&n.map.image,ei=n&&n.emissiveMap&&n.emissiveMap.image,T=BLADE_TINT[k];if(!mi||!ei||!T)return null;
  const w=mi.width,h=mi.height,cv=canvas(w,h),g=cv.getContext('2d');g.drawImage(mi,0,0);const id=g.getImageData(0,0,w,h),d=id.data;let x0=w,x1=-1;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>0){if(x<x0)x0=x;if(x>x1)x1=x}
  if(x1<0)return null;const lim=x0+.55*(x1-x0+1),hit=[];
  for(let y=0;y<h;y++)for(let x=Math.ceil(lim);x<w;x++){const i=(y*w+x)*4;if(d[i+3]===0)continue;const r=d[i],gg=d[i+1],b=d[i+2],mx=Math.max(r,gg,b),mn=Math.min(r,gg,b);
    if(mx>=95&&mx-mn<45){const l=(r+gg+b)/765;d[i]=r*.2+Math.min(255,T[0]*(.5+.7*l))*.8;d[i+1]=gg*.2+Math.min(255,T[1]*(.5+.7*l))*.8;d[i+2]=b*.2+Math.min(255,T[2]*(.5+.7*l))*.8;hit.push(i)}}
  if(!hit.length)return null;g.putImageData(id,0,0);
  const ec=canvas(w,h),eg=ec.getContext('2d');eg.drawImage(ei,0,0);const ed=eg.getImageData(0,0,w,h);for(const i of hit){ed.data[i]=T[0]*.6;ed.data[i+1]=T[1]*.6;ed.data[i+2]=T[2]*.6}eg.putImageData(ed,0,0);
  const m=n.clone(),t1=texFrom(cv),t2=texFrom(ec);for(const p of ['minFilter','magFilter','generateMipmaps'])if(n.map[p]!==undefined)t1[p]=n.map[p];for(const p of ['minFilter','magFilter','generateMipmaps'])if(n.emissiveMap[p]!==undefined)t2[p]=n.emissiveMap[p];
  m.map=t1;m.emissiveMap=t2;m.needsUpdate=true;fr[key]=m;return m}catch(e){return null}}
function heroFrame(){
  const V2=A.heroD&&A.heroD.v2?A.heroD:null;
  if(V2&&!pl.dead){const r=heroFrameV2(V2);if(r)return r}
  if(pl.dead)return S&&S.kn&&A.heroD&&A.heroD.kn?at(A.heroD.kn.death,pl.deadT,5,false):S&&S.zab&&A.heroD&&A.heroD.zab?at(A.heroD.zab.death,pl.deadT,5,false):S&&S.kat&&A.heroD&&A.heroD.kat?at(A.heroD.kat.death,pl.deadT,5,false):at(A.hero.death,pl.deadT,5,false);
  if(pl.roll>0)return at(A.hero.roll,pl.rollT,13,false);
  if(pl.swingT>0){const a=pl.swingDir===2?A.hero.swing_side:pl.swingDir===0?A.hero.swing_down:A.hero.swing_up,dur=pl.swingDur||.32;{const f=(dur-pl.swingT)/dur;return a[Math.min(a.length-1,f<.12?0:f<.24?1:f<.62?2:3)]}}
  const D=A.heroD;
  if(D&&pl.block){const side=Math.abs(pl.fx)>Math.abs(pl.fy);return (side?D.idle_side:pl.fy>0?D.idle_down:D.idle_up)[0]}
  if((pl.charging||pl.block||pl.broken>0)){const side=Math.abs(pl.fx)>Math.abs(pl.fy);return (side?A.hero.swing_side:pl.fy>0?A.hero.swing_down:A.hero.swing_up)[pl.broken>0?3:0]}
  if(pl.hurtT>0)return at(A.hero.hurt,.22-pl.hurtT,9,false);
  if(D){if(pl.moving)return at(pl.dir===2?D.walk_side:pl.dir===0?D.walk_down:D.walk_up,pl.walk,6.7);return at(pl.dir===2?D.idle_side:pl.dir===0?D.idle_down:D.idle_up,clock,2.9)}
  if(pl.moving)return at(pl.dir===2?A.hero.walk_side:pl.dir===0?A.hero.walk_down:A.hero.walk_up,pl.walk,8);
  return at(pl.dir===2?A.hero.idle_side:pl.dir===0?A.hero.idle_down:A.hero.idle_up,clock,pl.dir===0?4:2.5);
}
// Seal of warding: a glowing amber hexagon sigil drawn once into a texture, shown around the hero while it has charges
let threatPool=null;
function syncThreatRingsLegacy(){if(!threatPool){const geo=new THREE.RingGeometry(.96,1,48).rotateX(-Math.PI/2);threatPool=Array.from({length:8},()=>{const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0xffd267,transparent:true,opacity:.65,depthWrite:false,fog:false,side:THREE.DoubleSide}));m.renderOrder=3;scene.add(m);return m})}for(const m of threatPool)m.visible=false;if(!S||S.phase!=='play')return;let i=0;for(const e of S.enemies){if(i>=threatPool.length||e.dead||e.rise>0)continue;let radius=0,x=e.x,y=e.y;if(e.type==='collector')radius=e.hamT>0?56:56;else if(e.atkT>0)radius=54;else if(e.mode==='root'){radius=32;x=e.tx;y=e.ty}else if(e.mode==='up'){radius=e.type==='beast'?70:62;x=e.tx;y=e.ty}if(!radius)continue;const m=threatPool[i++];m.visible=true;m.position.set(x/16,.045,y/16);m.scale.setScalar(radius/16);m.material.color.set(SETT.contrast?'#ffe270':e.type==='collector'?'#e0b84a':'#ff6655');m.material.opacity=e.type==='collector'&&!(e.hamT>0)?.3:.7}}
const COMBAT_WARN={areas:[],marks:null,dummy:combatVisualBuild(()=>new THREE.Object3D()),color:new THREE.Color()};
function initCombatWarnings(){if(COMBAT_WARN.marks)return;
  const ring=new THREE.RingGeometry(.974,1,64).rotateX(-Math.PI/2),back=new THREE.RingGeometry(.95,1.02,64).rotateX(-Math.PI/2);
  for(let i=0;i<8;i++){
    const m=new THREE.Mesh(ring,new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,depthTest:false,fog:false,side:THREE.DoubleSide}));
    const b=new THREE.Mesh(back,new THREE.MeshBasicMaterial({color:0x150e12,transparent:true,opacity:.72,depthWrite:false,depthTest:false,fog:false,side:THREE.DoubleSide}));m.renderOrder=46;b.renderOrder=45;m.visible=b.visible=false;scene.add(m,b);COMBAT_WARN.areas.push({mesh:m,back:b});
  }
  const c=canvas(64,96),g=c.getContext('2d');g.beginPath();g.moveTo(32,5);g.lineTo(55,47);g.lineTo(32,89);g.lineTo(9,47);g.closePath();g.fillStyle='#170e12';g.fill();g.strokeStyle='#ffebcb';g.lineWidth=3;g.stroke();g.fillStyle='#fff1d8';g.fillRect(29,26,6,30);g.beginPath();g.arc(32,66,3.6,0,Math.PI*2);g.fill();
  COMBAT_WARN.marks=new THREE.InstancedMesh(new THREE.PlaneGeometry(.34,.52),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,depthTest:false,fog:false,opacity:.92}),16);COMBAT_WARN.marks.count=0;COMBAT_WARN.marks.frustumCulled=false;COMBAT_WARN.marks.renderOrder=48;scene.add(COMBAT_WARN.marks);
}
function syncThreatRings(){
  if(!COMBAT_POLISH_ON){syncThreatRingsLegacy();return}if(!COMBAT_WARN.marks)combatVisualBuild(initCombatWarnings);for(const f of COMBAT_WARN.areas)f.mesh.visible=f.back.visible=false;COMBAT_WARN.marks.count=0;if(!S||S.phase!=='play')return;
  const players=[pl,pl2].filter(p=>p&&!p.dead);if(!players.length)players.push(pl);const distance=e=>Math.min(...players.map(p=>Math.min(Math.hypot(e.x-p.x,e.y-p.y),e.mode==='up'||e.mode==='root'?Math.hypot(e.tx-p.x,e.ty-p.y):Infinity)));
  const list=S.enemies.filter(e=>!e.dead&&e.rise<=0&&distance(e)<360).sort((a,b)=>((BIG.has(b.type)||b.type==='collector')?3:b.mini?2:1)-((BIG.has(a.type)||a.type==='collector')?3:a.mini?2:1)||distance(a)-distance(b));
  let area=0,mark=0;const d=COMBAT_WARN.dummy;
  for(const e of list){const cue=attackCue(e);let radius=0,x=e.x,y=e.y;
    if(e.type==='collector')radius=56;else if(cue){if(e.atkT>0)radius=54;else if(e.mode==='root'){radius=32;x=e.tx;y=e.ty}else if(e.mode==='up'){radius=e.type==='beast'?70:62;x=e.tx;y=e.ty}}
    const idle=e.type==='collector'&&!cue;
    if(radius&&area<8){const f=COMBAT_WARN.areas[area++];f.mesh.visible=f.back.visible=true;for(const m of [f.mesh,f.back]){m.position.set(x/16,.055,y/16);m.scale.setScalar(radius/16)}f.mesh.material.color.set(SETT.contrast?'#ffe270':e.type==='collector'?'#e0b84a':'#ff6655');f.mesh.material.opacity=idle?.28:.88;f.back.material.opacity=idle?.32:.72}
    const important=e.mini||BIG.has(e.type)||e.type==='collector'||e.red||e.castWind>0||e.fanWind>0||e.aim>0||e.ghoulWind>0||e.mode==='root'||e.mode==='up';
    if(cue&&important&&mark<16){const geo=e.mesh.geometry;if(!geo.boundingBox)geo.computeBoundingBox();const top=geo.boundingBox.max.y*Math.abs(e.mesh.scale.y)+.38;d.position.set(e.x/16,top+(e.lh||0),e.y/16);d.quaternion.copy(cam.quaternion);d.scale.setScalar(BIG.has(e.type)?1.2:1);d.updateMatrix();COMBAT_WARN.marks.setMatrixAt(mark,d.matrix);COMBAT_WARN.color.set(SETT.contrast?'#ffe270':cue==='r'?'#ff7767':'#ffe3b0');COMBAT_WARN.marks.setColorAt(mark++,COMBAT_WARN.color)}
  }
  COMBAT_WARN.marks.count=mark;COMBAT_WARN.marks.instanceMatrix.needsUpdate=true;if(COMBAT_WARN.marks.instanceColor)COMBAT_WARN.marks.instanceColor.needsUpdate=true;
}
function syncScene(dt){SURFACE_TIME.value=clock;SWAY.value=clock;try{ambTick(dt);shockTick(dt)}catch(e){quietErr('amb',e)}if(!S)syncThreatRings();
  let tx,tz;
  if(S){const cp=pl.dead&&pl2&&!pl2.dead?pl2:pl;tx=cp.x/16;tz=cp.y/16}else{idleA+=dt*.08;const I=W.idle;tx=I[0]+Math.sin(idleA)*I[2];tz=I[1]+Math.cos(idleA*.7)*I[3]}
  if(S&&depthOn()){const hw=11.5*Math.min(1.35,Math.max(.75,cam.aspect/(16/9)));if(MW>hw*2+2)tx=Math.min(MW-hw,Math.max(hw,tx));tz=Math.min(MH-7.5,Math.max(8.5,tz))}
  camTarget.x+=(tx-camTarget.x)*Math.min(1,dt*8);camTarget.z+=(tz-camTarget.z)*Math.min(1,dt*8);if(!S||S.t<.1){camTarget.x=tx;camTarget.z=tz}
  let sx=0,sz=0;if(SETT.shake&&S&&S.shakeT>0){const pxw=2*DIST*Math.tan(12*Math.PI/180)/RT_H;S.shkT=(S.shkT||0)-dt;if(S.shkT<=0||!S.shk){S.shkT=.04;S.shk=[Math.round(rnd(-1,1)*S.shakeM/pxw)*pxw,Math.round(rnd(-1,1)*S.shakeM/pxw)*pxw/Math.sin(PITCH)]}sx=S.shk[0];sz=S.shk[1]}
  const EZ=S&&S.exec>0&&SETT.shake?1-.16*Math.min(1,S.exec/.3):1;cam.position.set(camTarget.x+sx,Math.sin(PITCH)*DIST*EZ,camTarget.z+Math.cos(PITCH)*DIST*EZ+sz);cam.lookAt(camTarget.x+sx,.8,camTarget.z+sz);syncSwordGlow();syncCombatEffects(dt);syncWhirlVisual(dt);syncBloodHD(dt);
  const z0=S&&S.zones[0];if(z0){W.zoneLight.x=z0.x/16;W.zoneLight.z=z0.y/16}
  for(const L of LSRC){let k=L.base;
    if(L.kind==='fire')k*=.85+Math.sin(clock*13+L.ph)*.08+Math.random()*.12;else if(L.kind==='lava'||L.kind==='rot')k*=.9+Math.sin(clock*1.7+L.ph)*.1;else if(L.kind==='rune')k*=.75+.25*Math.sin(clock*2+L.ph);
    else if(L.kind==='shrine')k*=.3+.7*(S?S.shr[L.si]/60:1);else if(L.kind==='stone')k=S&&S.stones&&S.stones[L.si]>=STONE_N?L.base*(.8+.2*Math.sin(clock*2.4+L.ph)):0;else if(L.kind==='gate')k=S&&S.opening?2.8*Math.min(1,(3.4-S.opening)/1.4):0;
    else if(L.kind==='npc'){const st=S?S.npc[L.npc]:{state:'alive'};k=st.state==='alive'||st.state==='talked'||st.state==='trial'||st.state==='offered'?L.base*(.8+.2*Math.sin(clock*3+L.ph)):st.state==='fading'?L.base*Math.max(0,st.t/1.5):0}
    else if(L.kind==='merchant')k=S&&S.merchant?L.base*(.85+.15*Math.sin(clock*4)):0;else if(L.kind==='zone')k=z0?1.6*Math.min(1,z0.life)*(.85+Math.random()*.2):0;
    L.k=k;L.d=k>0?Math.hypot(L.x-camTarget.x,(L.z-camTarget.z)*1.3):1e9}
  if(W&&W.halos&&W.haloL){const hl=W.haloL;for(let i=0;i<hl.length;i++){const L=hl[i],f=L.base>0?Math.min(1.35,L.k/L.base):0;TMPC.setHex(L.col).multiplyScalar(f);W.halos.setColorAt(i,TMPC);TMPC.lerp(WHITE_C,.35).multiplyScalar(1);W.cores.setColorAt(i,TMPC);if(W.groundLights&&W.groundL){const gi=W.groundL.indexOf(L);if(gi>=0){TMPC.setHex(L.col).multiplyScalar(f);W.groundLights.setColorAt(gi,TMPC)}}}
   W.halos.instanceColor.needsUpdate=true;W.cores.instanceColor.needsUpdate=true;if(W.groundLights&&W.groundLights.instanceColor)W.groundLights.instanceColor.needsUpdate=true}
  const nearL=LSRC.filter(L=>L.k>0).sort((a,b)=>a.d-b.d);const lightCap=GFX.lights;
  LPOOL.forEach((l,i)=>{const L=i<lightCap?nearL[i]:null;if(!L||L.d>26){l.intensity=0;return}l.color.setHex(L.col);l.distance=L.dist;l.position.set(L.x,L.y,L.z);l.intensity=L.k*Math.min(1,(26-L.d)/4);if(depthOn()){l.intensity*=1.75;l.distance*=1.35}});
  if(S&&S.t>0&&Math.random()<dt*22*GFX.parts){const a=Math.random()*Math.PI*2,d=Math.random()*200;S.parts.push(CH===4?(Math.random()<.35?{k:'m',x:pl.x+Math.cos(a)*d,y:pl.y+Math.sin(a)*d*.6,z:rnd(4,26),vx:rnd(-4,4),vy:rnd(-2,2),vz:rnd(-1.5,1.5),c:Math.random()<.5?'#c8e070':'#7fffd0',life:rnd(1.5,3.5)}:{k:'m',x:pl.x+Math.cos(a)*d,y:pl.y+Math.sin(a)*d*.6,z:rnd(1,8),vx:rnd(-5,-1),vy:rnd(-1,1),vz:rnd(-.5,.5),c:Math.random()<.6?'#4a5660':'#5e6a72',life:rnd(3,6)}):CH===3?{k:'m',x:pl.x+Math.cos(a)*d,y:pl.y+Math.sin(a)*d*.6,z:rnd(30,70),vx:rnd(-3,3),vy:rnd(-1,1),vz:rnd(-5,-2),c:Math.random()<.6?'#c8a040':'#7a6030',life:rnd(4,7)}:CH===1?{k:'m',x:pl.x+Math.cos(a)*d,y:pl.y+Math.sin(a)*d*.6,z:rnd(30,70),vx:rnd(-6,2),vy:rnd(-1,1),vz:rnd(-9,-5),c:Math.random()<.6?'#6a6670':'#8a8490',life:rnd(3,6)}:{k:'m',x:pl.x+Math.cos(a)*d,y:pl.y+Math.sin(a)*d*.6,z:rnd(4,40),vx:rnd(-3,3),vy:rnd(-2,2),vz:rnd(-1,2),c:Math.random()<.7?'#5c5566':'#7d6a58',life:rnd(2,4)})}
  if(S&&CH===2&&Math.abs(pl.x/16-MP(37.5))<16&&Math.random()<dt*14)S.parts.push({k:'e',x:rnd(MP(35.2),MP(39.8))*16,y:(camTarget.z+rnd(-7,7))*16,z:-rnd(20,90),vx:rnd(-2,2),vy:0,vz:rnd(14,30),c:Math.random()<.6?'#ff6a1a':'#ffb347',life:rnd(2,4)});
  for(const o of WATER_ALL)if(o.ch===CH)o.tex.offset.set(clock*(o.deep?.0022:.004),clock*(o.deep?.0015:.0028));
  for(const o of LAVA_ALL){if(o.ch!==CH)continue;{const sp=o.spd||1;o.tex.offset.set(clock*.008*sp,clock*.005*sp);o.etex.offset.set(.37-clock*.006*sp,.61+clock*.009*sp)}const p=Math.sin(clock*1.7)*.5+Math.sin(clock*.63+1.3)*.35+Math.sin(clock*4.1)*.15;o.mat.emissiveIntensity=.78+.22*p;if(o.halo)o.halo.material.opacity=.45+.2*p}
  const lf=((clock*5)|0)%4;if(CH===2&&!LAVA_HD&&lf!==lavaFrame&&lavaFrames.length){lavaFrame=lf;lavaG.clearRect(0,0,64,64);lavaG.drawImage(lavaFrames[lf],0,0);lavaTex.needsUpdate=true}
  if(CH===3&&W.rotTex){const rf=((clock*2.5)|0)%4;if(rf!==W.rotF){W.rotF=rf;W.rotG.clearRect(0,0,64,64);W.rotG.drawImage(W.rotFrames[rf],0,0);W.rotTex.needsUpdate=true}}
  if(CH===4&&W.water){const f4=((clock*4)|0)%4;for(const o of W.water)if(o.f!==f4){o.f=f4;o.g.clearRect(0,0,64,64);o.g.drawImage(o.frames[f4],0,0);o.tex.needsUpdate=true}
    const dz=S&&S.t>DZIADY_AT?Math.min(1,(S.t-DZIADY_AT)/8)*(S.opening?0:1):0;scene.fog.density=ATM[4].fd+dz*.009;scene.fog.color.setHex(ATM[4].fog).lerp(TMPC.setHex(0x12261a),dz)}
  {const kr=!!(S&&S.nev&&S.nev.k==='krew'&&S.nev.t>0&&S.phase==='play');if(kr!==document.body.classList.contains('nb-krew'))document.body.classList.toggle('nb-krew',kr);const ef=S&&S.phase==='play'&&S.evFog||0;if(CH!==4&&ATM[CH]){scene.fog.density=ATM[CH].fd+ef;scene.fog.color.setHex(ATM[CH].fog)}else if(CH===4)scene.fog.density+=ef;if(ef>0)scene.fog.color.lerp(TMPC.setHex(0x59606a),Math.min(.75,ef/.022*.75))}
  const wf=((clock*3)|0)%4;if(CH===1&&wf!==waterFrame&&waterFrames.length){waterFrame=wf;waterG.clearRect(0,0,64,64);waterG.drawImage(waterFrames[wf],0,0);waterTex.needsUpdate=true}
  // weather and dawn (chapter I)
  const fl=SETT.flash&&S?S.flash:0,dawn=CH!==2&&S&&S.opening?Math.min(1,(3.4-S.opening)/2.4):0,AT=ATM[CH];
  amb.intensity=AT.ai+fl*1.4+dawn*.9;hemi.intensity=AT.hi+fl*.8+dawn*.5;if(dawn>0){TMPC.setHex(AT.amb);amb.color.copy(TMPC.lerp(DAWN,dawn))}else amb.color.setHex(AT.amb);
  postMat.uniforms.flash.value=fl*.3;postMat.uniforms.haze.value=CH===2&&S&&S.phase==='play'&&!S.dg&&SETT.quality!=='low'?1:0;postMat.uniforms.tm.value=clock%600;postMat.uniforms.grain.value=SETT.quality==='low'?0:chapterArt()?.015:.03;postMat.uniforms.gtm.value=SETT.flash?clock%600:0;postMat.uniforms.sharp.value=S&&S.shakeT>0?1:Math.max(0,postMat.uniforms.sharp.value-dt*4);
  rain.visible=CH===1;if(rain.visible){rain.material.opacity=(CH1_ART_ON?.20:.32)*(1-dawn*.7);for(let i=0;i<RAIN_N;i++){const d=DROPS[i];d.y-=d.s*dt;d.x-=d.s*.12*dt;if(d.y<0){d.y+=12;d.x=rnd(-15,15);d.z=rnd(-10,10);if(S&&dt>0&&i%9===0)S.parts.push({k:'d',x:(camTarget.x+d.x)*16,y:(camTarget.z+d.z)*16,z:1,vx:rnd(-6,6),vy:rnd(-3,3),vz:rnd(8,14),c:'#6a7a96',life:.25})}
    const x=camTarget.x+d.x,z=camTarget.z+d.z,o=i*6;rainPos[o]=x;rainPos[o+1]=d.y;rainPos[o+2]=z;rainPos[o+3]=x+.07;rainPos[o+4]=d.y-.55;rainPos[o+5]=z}rainGeo.attributes.position.needsUpdate=true}
  for(const o of propObjs){let f;
    if(o.kind==='gate')f=o.frames[!S||!S.opening?0:S.opening>2.4?1:2];
    else if(o.kind==='shrine')f=at(o.frames,clock+o.ph,6);
    else if(o.kind==='stone')f=o.frames[S&&S.stones&&S.stones[o.si]>=STONE_N?1:0];
    else f=o.fps?at(o.frames,clock+o.ph,o.fps):o.frames[0];
    if(f&&o.mesh.material!==f.n)setFrame(o.mesh,f)}
  CUT.value.set(S&&!pl.dead?pl.x/16:-99,0,S&&!pl.dead?pl.y/16:-99);
  if(S&&!pl.dead&&(CH===3||CH===4)){V.set(pl.x/16,.9,pl.y/16).project(cam);CUTS.value.set((V.x+1)/2*rt.width,(V.y+1)/2*rt.height,rt.height*.16)}else CUTS.value.set(-999,-999,0);
  if(S){const art=chapterArt()?ART_LIGHT[CH]:null;plLight.color.setHex(art?art[0]:0xffd2a0);plLight.distance=art?art[2]:13;plLight.position.set(pl.x/16,2.4,pl.y/16);plLight.intensity=pl.dead?.6:(art?art[1]:2.05)+Math.sin(clock*9)*(art?.025:.06);if(depthOn()){plLight.intensity*=1.22;plLight.distance*=1.15}}else plLight.position.set(tx,2.4,tz);
  let bi=0;const bdp=depthOn(),blob=(x,z,s)=>{if(bi>=MAXB)return;if(bdp)s=s*1.55+.25;V.set(x,.03,z);SC.set(s,1,s*(bdp?.5:.6));M4.compose(V,Q.set(0,0,0,1),SC);blobs.setMatrixAt(bi++,M4)};
  // NPCs of the active chapter
  for(const n of W.npcs){const m=W.npcMeshes[n.id];if(!m)continue;const st=S?S.npc[n.id]:{state:'alive',t:0};
    m.visible=st.state!=='gone'&&st.state!=='risen';if(n.id==='marga'&&S&&S.merchant&&CH===1)m.visible=false;if(!m.visible)continue;const fr=A[n.art];
    if(n.art==='tharm'){setFrame(m,at(fr,clock,4));m.material.opacity=st.state==='fading'?.85*Math.max(0,st.t/1.5):.6+.25*Math.sin(clock*3)}
    else if(st.state==='dead')setFrame(m,fr[3]);
    else setFrame(m,at(n.art==='marga'?fr:(fr._s3||(fr._s3=fr.slice(0,3))),clock+n.x,n.art==='wit'?5:n.art==='elder'?1.5:3));
    m.position.set(n.x/16,0,n.y/16);m.scale.set(1,SQ,1);if(n.art!=='tharm')blob(n.x/16,n.y/16,1)}
  if(S){
    heroMesh.visible=!(SETT.flash&&clock<(pl.blinkUntil||0)&&pl.roll<=0&&!pl.dead&&Math.floor(clock*24)%2);
    {const hf=heroFrame(),ek=encLevel()[0];S.heroHF=hf;setFrame(heroMesh,hf);const hv=ek&&hf?heroBladeMat(hf,ek):null;if(hv&&heroMesh.material===hf.n){hv.emissiveIntensity=.8+.35*Math.sin(clock*6);heroMesh.material=hv}}
    const hs=pl.atk&&FACEK.includes(pl.atk.kind)?(pl.fx>=0?1:-1):pl.roll>0||pl.dead?pl.s:A.heroD&&A.heroD.v2&&!pl.atk&&(pl.parryT>0||pl.broken>0||(pl.hurtT>0&&!pl.block))?(pl.fx>=0?1:-1):pl.swingT>0?(pl.swingDir===2?pl.swingS:1):(pl.charging||pl.block)&&Math.abs(pl.fx)>Math.abs(pl.fy)?(pl.fx>0?1:-1):(pl.dir===2?pl.s:1);
    const guardRecoil=!pl.dead?recoilAmount(pl.visualGuard):0;heroMesh.position.set((pl.x+(pl.visualGuard?pl.visualGuard.dx:0)*guardRecoil*.7)/16,S.zab?.1:0,(pl.y+(pl.visualGuard?pl.visualGuard.dy:0)*guardRecoil*.7)/16);heroMesh.rotation.z=-(pl.visualGuard?pl.visualGuard.dx:0)*guardRecoil*.018;heroMesh.scale.set(hs,SQ,1);twinDraw(hs);drawP2(dt);mpHudTick();
    S.qBreak=Math.max(0,(S.qBreak||0)-dt);S.qPop=Math.max(0,(S.qPop||0)-dt);
    // charges orbit the hero as sparks; runes of time and reach leave their own orbiting motes
    const orbit=(n,r,sp,col,z)=>{if(dt<=0)return;for(let i=0;i<n;i++){const a=clock*sp+i*Math.PI*2/n;S.parts.push({k:'e',x:pl.x+Math.cos(a)*r,y:pl.y+Math.sin(a)*r*.6,z,vx:0,vy:0,vz:0,c:col,life:.05})}};
    if(!pl.dead)blob(pl.x/16,pl.y/16,1);if(pl2&&!pl2.dead)blob(pl2.x/16,pl2.y/16,1);
    for(const e of S.enemies){
      const an=A[e.type];let fr;
      if(e.type==='bat')fr=at(an.walk,clock+e.ph,12);
      else if(e.type==='jerzak'){if(e.rise>0)fr=at(an.roll,clock,8);else if(e.selfKill>0){const el=1.1-e.selfKill;fr=el<.45?at(an.panic,el,10):at(an.attack,el-.45,6.5,false)}else fr=at(an.walk,e.walk,7)}
      else if(e.type==='collector'){const cdx=pl.x-e.x,cdy=pl.y-e.y;
        if(e.atkA>0)fr=at(an.attack,.35-e.atkA,11,false);else if(e.hurtA>0)fr=at(an.hurt,.3-e.hurtA,7,false);else if(clock-(e.drainAt||-9)<.6)fr=at(an.drain,clock,8);
        else if(e.tauntA>0)fr=at(an.taunt,1-e.tauntA,3);else fr=at(Math.abs(cdx)>Math.abs(cdy)*.8?an.walk:an.front,e.walk+e.ph,7)}
      else if(e.type==='beast'){if(an.sheet)fr=e.roarT>0?at(an.rage,1.4-e.roarT,2.2,false):e.mode==='wind'||e.atkT>0?an.attack[0]:e.mode==='charge'?at(an.charge,e.walk,8):e.mode==='up'?an.leap[0]:e.mode==='down'?an.leap[1]:e.atkA>0?an.attack[1]:at(an.walk,e.walk,3);
        else fr=e.mode==='wind'||e.mode==='up'||e.atkT>0?an.attack[0]:e.mode==='down'||e.atkA>0?an.attack[1]:at(an.walk,e.walk,e.mode==='charge'?9:3)}
      else if(e.type==='cumlin')fr=cumlinFrame(e,an);
      else if(e.type==='boss'&&an.sheet)fr=e.trans>0?an.rise[0]:e.ph2?(e.atkT>0||e.slamF>0?an.slam2[0]:e.atkA>0||e.castF>0?an.cast2[0]:e.callF>0?an.call2[0]:at(an.walk2,e.walk,2.2)):(e.atkT>0?an.snap[0]:e.atkA>0||e.castF>0?an.attack[1]:e.lashF>0?an.attack[0]:at(an.walk,e.walk,2.2));
      else if(e.type==='boss')fr=e.atkT>0?an.attack[0]:e.atkA>0?an.attack[1]:at(an.walk,e.walk,2.5);
      else if(e.type==='leszy')fr=e.mode==='merge'||e.mode==='emerge'?an.merge[0]:e.mode==='summon'?an.summon[0]:e.mode==='root'||e.atkT>0||e.atkA>0?an.strike[0]:at(an.walk,e.walk,2.5);
      else if(e.type==='strzyga')fr=e.trans>0?an.burst[0]:e.phase===2?(e.roarT>0?an.roar[0]:e.mode==='up'?an.leap[0]:e.mode==='down'||e.atkA>0||e.atkT>0?an.land[0]:e.mode==='raise'?an.raise[0]:at(an.crawl,e.walk,6))
        :(e.mode==='scream'?an.scream[0]:e.mode==='wind'||e.mode==='dive'||e.atkT>0||e.atkA>0?an.slash[0]:at(an.walk,clock+e.ph,3));
      else if(e.type==='drowner'&&e.emerge>0)fr=at(an.rise,.8-e.emerge,2.5,false);
      else if(e.type==='wisp')fr=e.boom>0&&((clock*12)|0)%2?an.attack[0]:an.walk[0];
      else if(e.type==='bies'&&(e.mode==='wind'||e.mode==='charge'))fr=an.attack[e.mode==='wind'?0:1];
      else if(e.type==='zmora')fr=e.atkA>0?an.attack[0]:at(an.walk,clock+e.ph,5);
      else if((e.sw>0||e.stun>0))fr=e.sw>0?an.attack[0]:an.walk[0];
      else if(e.atkA>0||e.leap>0)fr=at(an.attack,.35-Math.max(0,e.atkA),6,false);
      else fr=at(an.walk,e.walk+e.ph,e.type==='warden'?5:7);
      const redW=e.sw>0&&e.red;if(redW&&Math.random()<dt*20)S.parts.push({k:'e',x:e.x+rnd(-4,4),y:e.y,z:rnd(8,26),vx:rnd(-8,8),vy:0,vz:rnd(10,30),c:warningColor(),life:.3});
      setFrame(e.mesh,fr,attackCue(e)||(e.flash>0&&SETT.flash?(COMBAT_POLISH_ON?'impact':'f'):e.frozen>0?'i':statusTint(e)||(e.hunt?(((clock*4)|0)%2?'f':'b'):e.mini?'b':'n')));
      if(e.mini&&Math.random()<dt*12)S.parts.push({k:'e',x:e.x+rnd(-5,5),y:e.y+rnd(-2,2),z:rnd(4,22),vx:rnd(-6,6),vy:0,vz:rnd(8,22),c:Math.random()<.5?'#8a1226':'#d02a44',life:rnd(.4,.8)});
      const y=e.type==='bat'?.85+Math.sin(clock*8+e.ph)*.12:e.type==='courtraven'?.55+Math.sin(clock*7+e.ph)*.12:e.type==='wraith'?.3+Math.sin(clock*2.5+e.ph)*.1:e.type==='zmora'?.25+Math.sin(clock*2.5+e.ph)*.1:e.type==='wisp'?.35+Math.sin(clock*3+e.ph)*.12:(e.rise>0&&e.type!=='jerzak'?-e.rise*(BIG.has(e.type)?3:2):0)+(e.lh||0)+(e.type==='strzyga'&&!e.phase?.35+Math.sin(clock*2)*.1:0)+((CH===1||CH===2)&&!BIG.has(e.type)&&e.type!=='bat'&&e.type!=='collector'&&e.type!=='jerzak'?.1:0);
      const js=e.type==='jerzak'?1.5:e.type==='collector'?(CH===5&&A.collectorC5?1:1.25):e.type==='beast'?(A.beast.sheet?(e.enraged?1.32:1.15):(e.enraged?1.5:1.3)):e.type==='monk'?1.08:e.type==='cumlin'?1.2:e.type==='leszy'?1.25:e.type==='strzyga'?(e.phase===2?1.25:1.2):e.type==='bies'?1.15:e.type==='boginka'?1.1:e.type==='bookgolem'?1.2:e.type==='executioner'?1.1:e.type==='paperrat'?.85:1,hop=0;
      const recoil=recoilAmount(e.visualHit),impact=e.visualHit,pose=enemyImpactShape(e),amount=pose?pose.push:impact?impact.amplitude*recoil:0;e.mesh.position.set((e.x+(impact?impact.dx:0)*amount)/16,y+hop,(e.y+(impact?impact.dy:0)*amount)/16);e.mesh.rotation.z=-(impact?impact.dx:0)*(pose?pose.lean:recoil*.035)*(BIG.has(e.type)?.4:1);const pp=e.pop=(e.pop||1)+(((attackCue(e)&&!BIG.has(e.type)&&!e.mini)?1.07:1)-(e.pop||1))*Math.min(1,dt*16);e.mesh.scale.set(e.s*js*pp*(1+(pose?pose.stretch:0)),SQ*js*pp*(1-(pose?pose.stretch:0))*(e.selfKill>0?.85+.15*Math.sin(clock*40):1),1);
      if((e.type==='beast'||e.type==='strzyga')&&e.lh>0)blob(e.tx/16,e.ty/16,3.2*Math.min(1,e.lh/3));else if(e.type!=='wisp')blob(e.x/16,e.y/16,e.type==='leszy'?3:e.type==='strzyga'?2.6:e.type==='bies'?1.5:e.type==='bookgolem'?1.8:e.type==='courtraven'||e.type==='paperrat'?.5:e.type==='beast'?3.2:e.type==='collector'?(CH===5&&A.collectorC5?2.2:1.4):e.type==='jerzak'?1.8:e.type==='boss'?3:e.type==='cumlin'?3.4:e.type==='warden'?1.5:e.type==='bat'?.45:e.type==='ghoul'?1.2:e.type==='goat'?1.4:e.type==='shieldman'?1.1:1);
    }
    syncThreatRings();
    for(const f of S.eproj)if(f.mesh){const fr=at(A.fireball,clock+f.ph,10);setFrame(f.mesh,fr,COMBAT_POLISH_ON?magicMaterialMode(fr,combatThreatNear(f.x,f.y,12)):null);f.mesh.position.set(f.x/16,COMBAT_POLISH_ON?1.4:.55,f.y/16);f.mesh.quaternion.copy(cam.quaternion);f.mesh.rotateZ(Math.atan2(-f.vy*Math.sin(PITCH),f.vx));f.mesh.scale.set(COMBAT_POLISH_ON?.75:1,COMBAT_POLISH_ON?.75:1,1)}
    for(const c of S.corpses){if(c.fall){const q=Math.min(1,c.t/.32),v=1-Math.pow(1-q,3);c.mesh.position.set((c.x+c.fall.sx*(1-v)+c.fall.dx*c.fall.power*v)/16,c.fall.y*(1-v),(c.y+c.fall.sy*(1-v)+c.fall.dy*c.fall.power*v)/16);c.mesh.rotation.z=c.fall.rz*(1-v)-c.fall.dx*.055*Math.sin(q*Math.PI)}if(c.ash){const fr=at(c.anim,c.t,7,false);if(c.am&&fr&&fr.n)c.am.map=fr.n.map;else if(!c.am)setFrame(c.mesh,fr)}else if(!c.own)setFrame(c.mesh,at(c.anim,c.t,c.big?3:7,false));c.mesh.scale.set(c.s,SQ*(c.k||1),1);if(c.k>1&&!c.fall)c.mesh.position.y=0}
    for(const g of S.golems){setFrame(g.mesh,g.slamA>0?at(A.golem.slam,.35-g.slamA,6,false):g.moving?at(A.golem.walk,g.walk,7):at(A.golem.idle,clock,2));g.mesh.position.set(g.x/16,0,g.y/16);g.mesh.scale.set(g.s,SQ,1);blob(g.x/16,g.y/16,1.4)}
    for(const z of S.zones){setFrame(z.mesh,at(A.fx.inferno,clock+z.x,9));z.mesh.position.set(z.x/16,0,z.y/16);const k=z.r/16*1.25;z.mesh.scale.set(k,k*SQ*.8,1)}
    for(const p of S.picks){if(COMBAT_POLISH_ON)p.visualAge=(p.visualAge||0)+dt;const born=COMBAT_POLISH_ON?Math.min(1,(p.visualAge||0)/.28):1,emerge=.72+.28*(1-Math.pow(1-born,3));const y=.1+Math.sin(clock*4+p.ph)*.07+(COMBAT_POLISH_ON?Math.sin(born*Math.PI)*.10:0);p.mesh.position.set(p.x/16,y+(p.k==='h'?.15:p.k==='c'?.15:-.55),p.y/16);p.mesh.quaternion.copy(cam.quaternion);{const ps=p.k==='h'?.275:p.k==='c'?.3:.9;p.mesh.scale.set(ps*emerge,ps*emerge,1)}
      p.glow.position.set(p.x/16,y+.02,p.y/16+.01);p.glow.quaternion.copy(cam.quaternion);{const gs=p.k==='h'||p.k==='c'?.5:1;p.glow.scale.set(gs,gs,1)}} // runda 302: serca i monety o polowe mniejsze (rysunek, wysokosc, poswiata)
    for(const f of S.vfx){const fr=at(f.anim,f.t,f.anim.length/f.dur,false);setFrame(f.mesh,fr,f.magicKind?magicMaterialMode(fr,combatThreatNear(f.x,f.y,f.size*12)):null);const lead=f.magicFlying?Math.max(0,1-f.t/.12)*5:0;const wx=f.weaponOwner?f.weaponOwner.x-f.weaponX:(f.magicDx||0)*lead,wy=f.weaponOwner?f.weaponOwner.y-f.weaponY:(f.magicDy||0)*lead;
      if(f.mode==='ground'){f.mesh.position.set((f.x+wx)/16,f.h,(f.y+wy)/16);f.mesh.rotation.set(-Math.PI/2,0,f.rot||0);f.mesh.scale.set(f.size*(f.sx||1),f.size*(f.sy||1),1)}
      else{f.mesh.position.set((f.x+wx)/16,f.weaponAspect?weaponFloorLift(f,fr):f.h+(f.mode==='bill'&&f.h===0?f.size*.42:0),(f.y+wy)/16);f.mesh.quaternion.copy(cam.quaternion);if(f.rot)f.mesh.rotateZ(f.rot);f.mesh.scale.set(f.size,f.size*(f.weaponAspect||1),1)}}
    let n=0;for(const p of S.parts){if(p.bloodHD)continue;if(n>=MAXP)break;pPos[n*3]=p.x/16;pPos[n*3+1]=p.z/16+.02;pPos[n*3+2]=p.y/16;const c=col(p.c);let a=p.life!==undefined?Math.max(0,Math.min(1,p.life)):1;pCol[n*3]=c.r*a;pCol[n*3+1]=c.g*a;pCol[n*3+2]=c.b*a;n++}
    pGeo.setDrawRange(0,n);pGeo.attributes.position.needsUpdate=true;pGeo.attributes.color.needsUpdate=true;
    postMat.uniforms.hurt.value=SETT.flash?Math.max(S.hurt*1.2,pl.dead?.25:0,(!pl.dead&&pl.hp<pl.max*.3)?(.12+.08*Math.sin(clock*5)):0):pl.dead?.18:pl.hp<pl.max*.3?.1:0;
  }else{heroMesh.visible=false;if(mesh2)mesh2.visible=false;if(mpTotLast)mpTotLast.visible=false;mpHudTick();pGeo.setDrawRange(0,0);postMat.uniforms.hurt.value=0}
  blobs.count=bi;blobs.instanceMatrix.needsUpdate=true;
  decalT-=dt;if(decalDirty&&decalT<=0){decalTex.needsUpdate=true;decalDirty=false;decalT=.15}
  updatePowerVisuals();
  // talk prompt
  const pr=$('prompt'),free=S&&S.phase==='play'&&!S.notice&&!S.dialog&&!S.choosing&&!S.shop,nmc=free?nearMerchant():null,near=free?(nmc||nearNpc()):null;
  const nf=free&&!near?nearPowerFire():null,nex=free&&!near&&!nf?nearExit():null,lbl=nf?(EN?'Nourishing Cauldron · activate revival':'Sycący Kociołek · aktywuj odrodzenie'):nex?{enter:(EN?'Descend into the crypt':'Zejdź do krypty'),leave:(EN?'Go back up':'Wyjdź na górę'),sealed:(EN?'Crypt sealed':'Krypta zamknięta')}[nex.kind]:nmc?(EN?'Trade':'Handluj'):(EN?'Talk':'Rozmawiaj'),tgt=near||nf||nex;
  if(tgt){V.set(tgt.x/16,2.1,tgt.y/16).project(cam);pr.hidden=false;pr.textContent=(nex&&nex.kind==='sealed')?lbl:coarse?(EN?'Tap: ':'Dotknij: ')+lbl:(PAD.g&&INPUT_LAST==='p'?'Y · ':PAD.g&&!INPUT_LAST?'Enter / Y · ':'Enter · ')+lbl;pr.style.left=((V.x+1)/2*100)+'%';pr.style.top=((1-V.y)/2*100)+'%'}else pr.hidden=true;
  // Marga at her stall during the break
  const mc=S&&S.merchant;margaMesh.visible=!!mc;if(mc){setFrame(margaMesh,at(A.marga,clock,3));margaMesh.position.set(mc.x/16,0,mc.y/16);const k=mc.state==='in'?1-mc.t:mc.state==='out'?mc.t:1;margaMesh.scale.set(1,SQ*Math.max(.05,k),1);blob(mc.x/16,mc.y/16,1);W.merchantLight.x=mc.x/16;W.merchantLight.z=mc.y/16+.3}
  if(S&&S.collector&&!S.collector.dead&&Math.random()<dt*10){const c=S.collector,a=Math.random()*Math.PI*2;S.parts.push({k:'e',x:c.x+Math.cos(a)*14,y:c.y+Math.sin(a)*8,z:rnd(6,26),vx:-Math.sin(a)*10,vy:Math.cos(a)*6,vz:rnd(2,8),c:Math.random()<.6?'#e0b84a':'#fff0b0',life:rnd(.6,1.2)})}
}
function draw(){const tD=SETT.fpsShow?performance.now():0;renderer.setRenderTarget(rt);renderer.render(scene,cam);{const ub=postMat.uniforms.low.value<.5;postMat.uniforms.useB.value=ub?1:0;if(ub)blurPasses()}if(tD){const r=renderer.info.render;FPS.calls=r.calls;FPS.tri=r.triangles}renderer.setRenderTarget(null);renderer.render(postScene,postCam);if(tD)FPS.draw+=performance.now()-tD}


/* 9.11.2026: oprawa: klimat w powietrzu (drobinki dla każdego rozdziału, pasma mgły w Czarnoborze), kałuże z kręgami w deszczu (rozdz. I),
   kołysanie roślin na wietrze, fala uderzeniowa przy ciężkich ciosach */
const SWAY={value:0};
function swayMat(m){if(!m||m.userData.sway)return;m.userData.sway=1;const prev=m.onBeforeCompile,pk=m.customProgramCacheKey?m.customProgramCacheKey():'';
 m.onBeforeCompile=(sh,r)=>{if(prev)prev(sh,r);sh.uniforms.uSway=SWAY;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nuniform float uSway;').replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\n{float ph=instanceMatrix[3].x*.73+instanceMatrix[3].z*.51;float hgt=clamp((position.y+.125)/4.,0.,1.);transformed.x+=(sin(uSway*1.7+ph)*.6+sin(uSway*.63+ph*1.9)*.4)*.11*hgt*hgt;}\n#endif')};
 m.customProgramCacheKey=()=>pk+'|sway';m.needsUpdate=true}
const AMB={sys:[],ch:-1,fog:[],t:0};
const AMB_K={ember:{c:[1,.55,.15],s:CH1_ART_ON?.19:.26,a:CH1_ART_ON?.65:.95,add:1,y:[0,1.6],v:[.5,1.1],life:[2.5,5.5],fl:1},ash:{c:[.6,.6,.63],s:.16,a:CH1_ART_ON?.4:.55,add:0,y:[2,7],v:[-.35,-.18],life:[6,10]},
 spark:{c:[1,.72,.28],s:ART_ON?.16:.18,a:ART_ON?.8:1,add:1,y:[0,1.2],v:[1.1,2.1],life:[1.2,2.6],fl:1},dustw:{c:[.7,.5,.38],s:ART_ON?.20:.22,a:ART_ON?.23:.28,add:1,y:[.2,3],v:[-.05,.05],life:[6,10]},
 mote:{c:[1,.84,.42],s:ART_ON?.17:.2,a:ART_ON?.58:.75,add:1,y:[.4,3.5],v:[-.06,.08],life:[5,9],tw:1},fly:{c:[.05,.05,.04],s:0.1,a:.9,add:0,y:[.3,1.4],v:[0,0],life:[3,6],jit:1},
 firefly:{c:[.78,1,.38],s:ART_ON?.22:.28,a:ART_ON?.8:1,add:1,y:[.3,2.2],v:[-.08,.12],life:[6,11],pulse:1},mote2:{c:[.86,.84,.78],s:.16,a:ART_ON?.28:.32,add:1,y:[.4,4],v:[-.04,.05],life:[6,10],tw:1},
 paper:{c:[.86,.82,.7],s:ART_ON?.22:.26,a:ART_ON?.75:.9,add:0,y:[3,7],v:[-.28,-.16],life:[8,12],sw:1}};
const AMB_CFG={1:[['ember',55],['ash',45]],2:[['spark',55],['dustw',35]],3:[['mote',60],['fly',16]],4:[['firefly',45]],5:[['mote2',50],['paper',20]],9:[['mote2',35]]};
function ambTex(){const c=canvas(32,32),g=c.getContext('2d'),gr=g.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.35,'rgba(255,255,255,.65)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,32,32);const t=new THREE.CanvasTexture(c);return t}
let AMB_TEX=null;
function ambSystem(add,n){const geo=new THREE.BufferGeometry(),pos=new Float32Array(n*3),col=new Float32Array(n*3),sz=new Float32Array(n),al=new Float32Array(n);
 geo.setAttribute('position',new THREE.BufferAttribute(pos,3).setUsage(THREE.DynamicDrawUsage));geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.setAttribute('size',new THREE.BufferAttribute(sz,1));geo.setAttribute('alpha',new THREE.BufferAttribute(al,1).setUsage(THREE.DynamicDrawUsage));
 const mat=new THREE.ShaderMaterial({uniforms:{map:{value:AMB_TEX||(AMB_TEX=ambTex())},px:{value:300}},transparent:true,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending,
  vertexShader:'attribute float size;attribute float alpha;attribute vec3 color;varying vec3 vC;varying float vA;uniform float px;void main(){vC=color;vA=alpha;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=size*px/-mv.z;gl_Position=projectionMatrix*mv;}',
  fragmentShader:'uniform sampler2D map;varying vec3 vC;varying float vA;void main(){vec4 t=texture2D(map,gl_PointCoord);gl_FragColor=vec4(vC,t.a*vA);}'});
 const pts=new THREE.Points(geo,mat);pts.frustumCulled=false;pts.renderOrder=5;scene.add(pts);return {pts,geo,pos,col,sz,al,n,P:[]}}
function ambClear(){for(const s of AMB.sys){scene.remove(s.pts);s.geo.dispose();s.pts.material.dispose()}AMB.sys=[];for(const f of AMB.fog){scene.remove(f);f.material.dispose()}AMB.fog=[]}
function ambSpawn(p,k,cx,cz,init){const K=AMB_K[k],r=(a)=>a[0]+Math.random()*(a[1]-a[0]);p.k=k;p.x=cx+rnd(-17,17);p.z=cz+rnd(-13,9);p.y=init?r(K.y):(K.v[1]>0&&!K.tw&&!K.pulse?K.y[0]:K.v[1]<0?K.y[1]:r(K.y));
 p.vx=rnd(-.15,.15);p.vy=r(K.v);p.vz=rnd(-.08,.08);p.life=r(K.life);p.age=init?Math.random()*p.life:0;p.ph=Math.random()*6.28;p.ax=p.x;p.az=p.z}
function ambBuild(){ambClear();AMB.ch=S&&S.dg?9:CH;const cfg=AMB_CFG[AMB.ch];if(!cfg)return;const q=GFX.fx>0?1:.5;
 for(const add of [1,0]){const ks=cfg.filter(([k])=>!!AMB_K[k].add===!!add);if(!ks.length)continue;const n=ks.reduce((a,[,c])=>a+Math.round(c*q),0),s=ambSystem(add,n);let i=0;
  for(const [k,c] of ks)for(let j=0;j<Math.round(c*q);j++,i++){const p={};ambSpawn(p,k,camTarget.x,camTarget.z,1);s.P.push(p);const K=AMB_K[k];s.col.set(K.c,i*3);s.sz[i]=K.s*(.75+Math.random()*.5)}
  s.geo.attributes.color.needsUpdate=true;s.geo.attributes.size.needsUpdate=true;AMB.sys.push(s)}
 if(AMB.ch===4&&GFX.fx>0){const c=canvas(128,64),g=c.getContext('2d');g.setTransform(1,0,0,.35,0,20.8);for(let i=0;i<22;i++){const x=rnd(14,114),y=rnd(16,48),r=rnd(14,26),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(200,215,210,.22)');gr.addColorStop(1,'rgba(200,215,210,0)');g.fillStyle=gr;g.fillRect(0,0,128,64)}g.setTransform(1,0,0,1,0,0);{const e=g.createLinearGradient(0,0,128,0);e.addColorStop(0,'rgba(0,0,0,1)');e.addColorStop(.2,'rgba(0,0,0,0)');e.addColorStop(.8,'rgba(0,0,0,0)');e.addColorStop(1,'rgba(0,0,0,1)');g.globalCompositeOperation='destination-out';g.fillStyle=e;g.fillRect(0,0,128,64);g.globalCompositeOperation='source-over'}
  const tex=new THREE.CanvasTexture(c);for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(12,3.2),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,opacity:.4,fog:false}));m.rotation.x=-Math.PI/2;m.position.set(camTarget.x+rnd(-16,16),.35+i*.08,camTarget.z+rnd(-12,8));m.userData.v=rnd(.15,.35)*(Math.random()<.5?-1:1);m.renderOrder=4;scene.add(m);AMB.fog.push(m)}}}
function ambTick(dt){const on=!!(S&&S.phase==='play'&&W);if(!on){if(AMB.sys.length)ambClear();AMB.ch=-1;return}const ch=S.dg?9:CH;if(ch!==AMB.ch||AMB.q!==GFX.fx){AMB.q=GFX.fx;ambBuild()}
 const cx=camTarget.x,cz=camTarget.z,t=clock,px=renderer.domElement.height*2.1;
 for(const s of AMB.sys){s.pts.material.uniforms.px.value=px;for(let i=0;i<s.n;i++){const p=s.P[i],K=AMB_K[p.k];p.age+=dt;
  if(K.jit){p.x=p.ax+Math.sin(t*7+p.ph)*.35+Math.sin(t*13+p.ph*2)*.15;p.z=p.az+Math.cos(t*9+p.ph)*.3;p.y+=Math.sin(t*11+p.ph)*.01}
  else{p.x+=(p.vx+(K.sw?Math.sin(t*1.3+p.ph)*.45:0)+(K.fl?Math.sin(t*2.3+p.ph)*.12:0))*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;if(K.pulse||K.tw){p.vx+=rnd(-.3,.3)*dt;p.vz+=rnd(-.3,.3)*dt;p.vx*=.995;p.vz*=.995}}
  if(p.age>p.life||p.y<-.05||p.y>8||Math.abs(p.x-cx)>19||p.z-cz>11||p.z-cz<-15)ambSpawn(p,p.k,cx,cz,0);
  const f=Math.min(1,p.age/.8,(p.life-p.age)/1.2);let a=K.a*Math.max(0,f);if(K.fl)a*=.65+.35*Math.sin(t*14+p.ph*3);if(K.tw)a*=.55+.45*Math.sin(t*2.2+p.ph);if(K.pulse)a*=Math.max(0,Math.sin(t*1.6+p.ph))**2;
  s.pos[i*3]=p.x;s.pos[i*3+1]=p.y;s.pos[i*3+2]=p.z;s.al[i]=a}
  s.geo.attributes.position.needsUpdate=true;s.geo.attributes.alpha.needsUpdate=true}
 for(const m of AMB.fog){m.position.x+=m.userData.v*dt;if(m.position.x-cx>18)m.position.x-=36;if(m.position.x-cx<-18)m.position.x+=36;if(m.position.z-cz>10)m.position.z-=24;if(m.position.z-cz<-14)m.position.z+=24;m.material.opacity=.32+.1*Math.sin(t*.3+m.position.y*10)}
 puddleTick(dt)}
// kałuże (rozdz. I, gdy pada): ciemna, połyskliwa tafla, odbicie pobliskiego ognia, kręgi od kropli
const PUD={w:null,list:[],rings:[],ringTex:null,tex:null};
function puddleBuild(){for(const m of PUD.list){scene.remove(m.m);if(m.g)scene.remove(m.g)}for(const r of PUD.rings)scene.remove(r.m);PUD.list=[];PUD.rings=[];PUD.w=W;if(CH!==1||!W||S.dg)return;
 if(!PUD.tex){const c=canvas(64,32),g=c.getContext('2d'),gr=g.createRadialGradient(32,16,2,32,16,30);gr.addColorStop(0,'rgba(8,11,18,.78)');gr.addColorStop(.7,'rgba(14,18,28,.6)');gr.addColorStop(1,'rgba(26,32,46,0)');g.setTransform(1,0,0,.5,0,8);g.fillStyle=gr;g.fillRect(0,-16,64,64);g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(170,190,215,.34)';g.beginPath();g.ellipse(26,12,12,3,-.15,0,6.28);g.fill();g.fillStyle='rgba(200,215,235,.22)';g.beginPath();g.ellipse(40,20,6,1.5,-.1,0,6.28);g.fill();PUD.tex=new THREE.CanvasTexture(c);
  const r=canvas(32,32),h=r.getContext('2d');h.strokeStyle='rgba(200,215,235,.9)';h.lineWidth=2;h.beginPath();h.arc(16,16,13,0,6.28);h.stroke();PUD.ringTex=new THREE.CanvasTexture(r)}
 const rr=rng(4711),fires=W.PROPS.filter(p=>p.fire);let n=0;
 for(let a=0;a<4000&&n<26;a++){const x=4+rr()*(MW-8),y=4+rr()*(MH-8),t=tileAt(x|0,y|0);if(SOLID.has(t)||VOID.has(t)||t===90||t===45||t===40||W.PROPS.some(p=>Math.hypot(p.x-x,p.y-y)<1.6))continue;
  const s=1.1+rr()*1.3,m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:PUD.tex,transparent:true,depthWrite:false,fog:true}));m.rotation.x=-Math.PI/2;m.position.set(x,.06,y);m.scale.set(s*1.4,s*.8,1);m.renderOrder=1;scene.add(m);
  const f=fires.map(p=>[p,Math.hypot(p.x-x,p.y-y)]).filter(q=>q[1]<5).sort((a,b)=>a[1]-b[1])[0];let gm=null;
  if(f){gm=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:PUD.tex,color:0xff7a2a,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.0,fog:false}));gm.rotation.x=-Math.PI/2;gm.position.set(x,.065,y);gm.renderOrder=2;gm.scale.copy(m.scale);gm.userData.k=1-f[1]/5;scene.add(gm)}
  PUD.list.push({m,g:gm,x,y,s});n++}
 for(let i=0;i<34;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:PUD.ringTex,transparent:true,depthWrite:false,opacity:0,fog:false}));m.rotation.x=-Math.PI/2;m.visible=false;scene.add(m);PUD.rings.push({m,t:9})}}
function puddleTick(dt){if(PUD.w!==W||(CH===1&&!S.dg)!==(PUD.list.length>0)&&!(CH===1&&!S.dg&&PUD.w===W))puddleBuild();const raining=rain.visible&&!S.dg,vis=CH===1&&!S.dg;
 for(const p of PUD.list){p.m.visible=vis;if(p.g){p.g.visible=vis;p.g.material.opacity=p.g.userData.k*(.38+.1*Math.sin(clock*9+p.x)+.06*Math.sin(clock*23+p.y))}}
 if(!vis||!raining||!PUD.list.length){for(const r of PUD.rings)r.m.visible=false;return}
 for(const r of PUD.rings){r.t+=dt;if(r.t>.7){if(Math.random()<dt*6){const p=PUD.list[(Math.random()*PUD.list.length)|0];if(Math.abs(p.x-camTarget.x)>18||Math.abs(p.y-camTarget.z)>14)continue;r.t=0;r.m.position.set(p.x+rnd(-.45,.45)*p.s,.07,p.y+rnd(-.25,.25)*p.s);r.m.visible=true}else{r.m.visible=false;continue}}
  const k=r.t/.7,sc=.08+k*.42;r.m.scale.set(sc,sc*.6,1);r.m.material.opacity=(1-k)*.55}}
// fala uderzeniowa w obrazie: krąg zniekształcenia od miejsca ciosu
const SHOCK={t:9,x:.5,y:.5,s:0};const SHV=new THREE.Vector3();
function shockAt(x,y,str){if(postMat.uniforms.low.value>.5)return;SHV.set(x/16,.4,y/16).project(cam);if(Math.abs(SHV.x)>1.2||Math.abs(SHV.y)>1.2)return;if(SHOCK.t<.25&&SHOCK.s>str)return;SHOCK.t=0;SHOCK.x=SHV.x*.5+.5;SHOCK.y=SHV.y*.5+.5;SHOCK.s=str}
function shockTick(dt){SHOCK.t+=dt;const u=postMat.uniforms.shock.value;if(SHOCK.t<.55)u.set(SHOCK.x,SHOCK.y,SHOCK.t,SHOCK.s*(1-SHOCK.t/.55));else u.set(0,0,0,0)}
