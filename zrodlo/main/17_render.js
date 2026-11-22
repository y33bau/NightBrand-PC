/* ============ RENDER ============ */
const camTarget=new THREE.Vector3();let idleA=0;
// slasher hero v2 (S1-S4 sheets): every state has its own drawn-sword animation
function heroFrameV2(D){const MI=S&&S.mil&&D.mil?D.mil:null,fd=()=>Math.abs(pl.fx)>Math.abs(pl.fy)?'side':pl.fy>0?'down':'up',ix=(a,i)=>a[Math.max(0,Math.min(a.length-1,i|0))];
  if(MI&&pl.atk&&pl.atk.kind==='gut')return ix(MI.gut[fd()],pl.atk.stage==='hold'?(1-pl.atk.t/MIL.gut.hold)*3.99:3);
  if(pl.roll>0)return MI&&pl.milEffT>0?ix(MI.eff[fd()],pl.rollT/.3*4):ix(D.roll,pl.rollT/.3*4);
  const K=S&&S.kat&&D.kat?D.kat:S&&S.kn&&D.kn?D.kn:S&&S.dzw&&D.dzw?D.dzw:null,Z=S&&S.zab&&D.zab?D.zab:null,DZ=S&&S.dzw&&D.dzw?D.dzw:null;
  if(DZ&&pl.tonT>0&&!pl.atk)return ix(DZ.ton,(.5-pl.tonT)/.5*4);if(DZ&&DZ.cast&&pl.castT>0&&!pl.atk)return ix(DZ.cast[fd()],(.45-pl.castT)/.45*4);
  if(K&&pl.atk&&pl.atk.kind==='whirl'){const a=pl.atk;if(a.stage==='rec')return ix(K.whirlRec,(1-a.t/WHIRL.recovery)*4);if(a.elapsed<.12)return ix(K.whirlWind,a.elapsed/.12*4);return at(K.whirlLoop,a.elapsed,13.3,true)}
  if(K&&K.lunge&&pl.atk&&pl.atk.kind==='wypad'){const a=pl.atk,arr=K.lunge[fd()];return ix(arr,a.stage==='wind'?(1-a.t/LUNGE.wind)*1.99:a.stage==='dash'?(a.at<LUNGE.dur*.45?2:3):a.t>LUNGE.rec*.45?3:4)}
  if(K&&pl.atk&&pl.atk.kind==='leap'){const a=pl.atk,arr=K.leap[fd()];return ix(arr,a.stage==='wind'?0:a.stage==='air'?(a.at<LEAP.air*.5?1:2):3)}
  if(Z&&pl.atk&&pl.atk.kind==='h'){const a=pl.atk;if(a.stage==='wind')return ix(Z.whirlWind,(1-a.t/(a.visualWind||SL.heavy.wind))*4);if(a.stage==='act')return ix(Z.whirlLoop,(1-a.t/SL.heavy.act)*Z.whirlLoop.length);return ix(Z.whirlRec,(1-a.t/SL.heavy.rec)*Z.whirlRec.length)}
  if(Z&&pl.atk&&pl.atk.kind==='rend'){const a=pl.atk,arr=Z.rend[fd()];return ix(arr,a.stage==='wind'?(1-a.t/REND.wind)*1.99:a.stage==='cut'?2+a.at/REND.dur*3.99:6+Math.min(1.99,(1-a.t/REND.rec)*2))}
  if(Z&&pl.atk&&pl.atk.kind==='fan'){const a=pl.atk,arr=Z.fan[fd()];return ix(arr,a.stage==='wind'?(1-a.t/FAN.wind)*3.99:4+(1-a.t/FAN.rec)*3.99)}
  if(K&&K.hook&&pl.atk&&pl.atk.kind==='hook'){const a=pl.atk,arr=K.hook[fd()];return ix(arr,a.stage==='wind'?(1-a.t/HOOK.wind)*1.99:a.stage==='fly'?2+Math.min(1.99,a.len/HOOK.dist*2):a.stage==='pull'?4+(1-a.t/HOOK.pull)*1.99:6+Math.min(1.99,(1-a.t/HOOK.rec)*2))}
  if(pl.atk){const a=pl.atk,P=a.kind==='h'?SL.heavy:SL.light,d=pl.swingDir===2?'side':pl.swingDir===0?'down':'up',zh=Z&&Z.hit&&a.kind!=='h'&&!a.visualRiposte&&a.combo>=3?Z.hit[Math.min(1,a.combo-3)][d]:null,asH=!zh&&(a.kind==='h'||(Z&&a.combo===4&&!a.visualRiposte)),arr=zh||(asH?(a.emp&&DZ&&DZ.emp?DZ.emp[d]:D.heavy[d]):D.light[d][a.visualRiposte?2:(Z?[0,1,2,1,0][a.combo]:a.combo)||0]);
    if(a.stage==='wind')return ix(arr,asH?(a.t>(a.visualWind||P.wind)*(Z&&a.kind==='h'?.55:.75)?0:1):0);if(a.stage==='act')return ix(arr,asH?2:1);
    if(asH)return ix(arr,a.t>P.rec*.58?2:3);return ix(arr,a.t>P.rec*.36?2:3)}
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
// 16.11.2026 (pilot): ruch z kodu na sprite'cie bohatera: oddech, kolysanie kroku, pochylenie w strone ruchu i ciosu, dopchniecie w chwili uderzenia,
// rozciagniecie przy zrywie, przysiad po skoku i uniku. TYLKO wyglad: nie zmienia pl.x/pl.y, zasiegow, czasow ani trafien. Wylacza je opcja wstrzasow (SETT.shake); do porownania u autora ?ruch=0 (tylko lokalnie: ten sam warunek co LOKALNIE w czesci 27, tam jest w domknieciu).
const HERO_MOTION_OFF=(location.protocol==='file:'||/^(127\.0\.0\.1|localhost|\[::1\])$/.test(location.hostname))&&nbParam('ruch')==='0',HERO_MOTION=new WeakMap();
const NPC_STILL=new Set(['wolch','bartosz','wierz','dobromir','nawoj','rudna','straznik','pieczetnik','lucjan','marga','chojrak']),NPC_STILL_OFF=(location.protocol==='file:'||/^(127\.0\.0\.1|localhost|\[::1\])$/.test(location.hostname))&&nbParam('ruch')==='0';
function heroMotion(p,mesh,hs,dt,rz0){let j=HERO_MOTION.get(p);if(!j){j={x:p.x,y:p.y,vx:0,vy:0,lean:0,px:0,py:0,sx:1,sy:1,lift:0,sq:0,st:''};HERO_MOTION.set(p,j)}
  if(HERO_MOTION_OFF||!SETT.shake||p.dead){j.x=p.x;j.y=p.y;j.vx=j.vy=j.lean=j.px=j.py=j.lift=j.sq=0;j.sx=j.sy=1;j.st='';mesh.rotation.z=rz0;return}
  if(dt>0){const dx=p.x-j.x,dy=p.y-j.y;j.x=p.x;j.y=p.y;if(Math.abs(dx)+Math.abs(dy)>48){j.vx=j.vy=0}else{const k=Math.min(1,dt*14);j.vx+=(dx/dt-j.vx)*k;j.vy+=(dy/dt-j.vy)*k}
    const a=p.atk,roll=p.roll>0,st=a?a.kind+':'+a.stage:roll?'roll':'';if(st!==j.st){if(j.st==='leap:air')j.sq=1;else if(j.st==='roll')j.sq=.55;j.st=st}j.sq=Math.max(0,j.sq-dt*5.5);
    const sp=Math.hypot(j.vx,j.vy),nx=sp>1?Math.abs(j.vx)/sp:0,ny=sp>1?Math.abs(j.vy)/sp:0,e=Math.max(0,Math.min(1,(sp-110)/480));
    let lean=-Math.max(-1,Math.min(1,j.vx/70))*.034*(1+e*1.3),push=0,tx=1+e*(.10*nx-.04*ny),ty=1+e*(.07*ny-.06*nx),lift=0,fast=12;
    if(a&&a.kind!=='whirl'){const g=a.stage;if(g==='wind'||g==='hold'){lean+=p.fx*.04;push=-.035;ty*=.975;tx*=1.015}else if(g==='act'||g==='cut'||g==='dash'){lean-=p.fx*.06;push=.11;tx*=1.03;ty*=.99;fast=34}else if(g==='rec'){lean-=p.fx*.02;push=.035}}
    else if(!a&&!roll){if(p.moving)lift=.028*(.5-.5*Math.cos(Math.PI*(p.walk*6.7-.5)));else if(!(p.hurtT>0)&&!(p.broken>0)){const b=Math.sin(clock*2.1+(p===pl2?1.3:0));ty*=1+.011*b;tx*=1-.005*b}}
    if(p.hurtT>0&&!a){const h=Math.min(1,p.hurtT/.22);ty*=1-.06*h;tx*=1+.04*h;lean+=p.fx*.05*h}
    ty*=1-.10*j.sq;tx*=1+.07*j.sq;
    const k1=Math.min(1,dt*18),k2=Math.min(1,dt*fast);j.lean+=(lean-j.lean)*k1;j.sx+=(tx-j.sx)*k1;j.sy+=(ty-j.sy)*k1;j.lift+=(lift-j.lift)*k1;j.px+=(p.fx*push-j.px)*k2;j.py+=(p.fy*push-j.py)*k2}
  mesh.scale.set(hs*j.sx,SQ*j.sy,1);mesh.rotation.z=rz0+j.lean;mesh.position.x+=j.px;mesh.position.z+=j.py;mesh.position.y+=j.lift}
// spoczynek odtwarzany tam i z powrotem (0,1,2,3,2,1): bez przeskoku z ostatniej klatki na pierwsza
const pong=(anim,t,fps)=>{const n=anim.length;if(n<3)return at(anim,t,fps);const i=Math.floor(t*fps)%(2*n-2);return anim[i<n?i:2*n-2-i]};
function heroFrame(){
  const V2=A.heroD&&A.heroD.v2?A.heroD:null;
  if(V2&&!pl.dead){const r=heroFrameV2(V2);if(r)return r}
  if(pl.dead)return S&&S.mil&&A.heroD&&A.heroD.mil?at(A.heroD.mil.death,pl.deadT,6,false):S&&S.dzw&&A.heroD&&A.heroD.dzw?at(A.heroD.dzw.death,pl.deadT,6,false):S&&S.kn&&A.heroD&&A.heroD.kn?at(A.heroD.kn.death,pl.deadT,5,false):S&&S.zab&&A.heroD&&A.heroD.zab?at(A.heroD.zab.death,pl.deadT,5,false):S&&S.kat&&A.heroD&&A.heroD.kat?at(A.heroD.kat.death,pl.deadT,5,false):at(A.hero.death,pl.deadT,5,false);
  if(pl.roll>0)return at(A.hero.roll,pl.rollT,13,false);
  if(pl.swingT>0){const a=pl.swingDir===2?A.hero.swing_side:pl.swingDir===0?A.hero.swing_down:A.hero.swing_up,dur=pl.swingDur||.32;{const f=(dur-pl.swingT)/dur;return a[Math.min(a.length-1,f<.12?0:f<.24?1:f<.62?2:3)]}}
  const D=A.heroD;
  if(D&&pl.block){const side=Math.abs(pl.fx)>Math.abs(pl.fy);return (side?D.idle_side:pl.fy>0?D.idle_down:D.idle_up)[0]}
  if((pl.charging||pl.block||pl.broken>0)){const side=Math.abs(pl.fx)>Math.abs(pl.fy);return (side?A.hero.swing_side:pl.fy>0?A.hero.swing_down:A.hero.swing_up)[pl.broken>0?3:0]}
  if(pl.hurtT>0)return at(A.hero.hurt,.22-pl.hurtT,9,false);
  if(D){if(pl.moving)return at(pl.dir===2?D.walk_side:pl.dir===0?D.walk_down:D.walk_up,pl.walk,6.7);return pong(pl.dir===2?D.idle_side:pl.dir===0?D.idle_down:D.idle_up,clock,3.6)}
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
    // krag obszaru ataku lezy na ziemi i chowa sie za sylwetkami (test glebi), zamiast rysowac sie na bossie
    const m=new THREE.Mesh(ring,new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,depthTest:true,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,fog:false,side:THREE.DoubleSide}));
    const b=new THREE.Mesh(back,new THREE.MeshBasicMaterial({color:0x150e12,transparent:true,opacity:.72,depthWrite:false,depthTest:true,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,fog:false,side:THREE.DoubleSide}));m.renderOrder=46;b.renderOrder=45;m.visible=b.visible=false;scene.add(m,b);COMBAT_WARN.areas.push({mesh:m,back:b});
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
    if(radius&&area<8){const f=COMBAT_WARN.areas[area++];f.mesh.visible=f.back.visible=true;for(const m of [f.mesh,f.back]){m.position.set(x/16,.07,y/16);m.scale.setScalar(radius/16)}f.mesh.material.color.set(SETT.contrast?'#ffe270':e.type==='collector'?'#e0b84a':'#ff6655');f.mesh.material.opacity=idle?.28:.88;f.back.material.opacity=idle?.32:.72}
    const important=e.mini||BIG.has(e.type)||e.type==='collector'||e.red||e.castWind>0||e.fanWind>0||e.aim>0||e.ghoulWind>0||e.mode==='root'||e.mode==='up';
    if(cue&&important&&mark<16){const geo=e.mesh.geometry;if(!geo.boundingBox)geo.computeBoundingBox();const top=geo.boundingBox.max.y*Math.abs(e.mesh.scale.y)+.38;d.position.set(e.x/16,top+(e.lh||0),e.y/16);d.quaternion.copy(cam.quaternion);d.scale.setScalar(BIG.has(e.type)?1.2:1);d.updateMatrix();COMBAT_WARN.marks.setMatrixAt(mark,d.matrix);COMBAT_WARN.color.set(SETT.contrast?'#ffe270':cue==='r'?'#ff7767':'#ffe3b0');COMBAT_WARN.marks.setColorAt(mark++,COMBAT_WARN.color)}
  }
  COMBAT_WARN.marks.count=mark;COMBAT_WARN.marks.instanceMatrix.needsUpdate=true;if(COMBAT_WARN.marks.instanceColor)COMBAT_WARN.marks.instanceColor.needsUpdate=true;
}
function syncScene(dt){SURFACE_TIME.value=clock;SWAY.value=clock;if(!S){heroMarks[0].visible=false;heroMarks[1].visible=false}try{ambTick(dt);shockTick(dt)}catch(e){quietErr('amb',e)}if(!S)syncThreatRings();
  let tx,tz;
  if(S){const cp=pl.dead&&pl2&&!pl2.dead?pl2:pl;tx=cp.x/16;tz=cp.y/16}else{idleA+=dt*.08;const I=W.idle;tx=I[0]+Math.sin(idleA)*I[2];tz=I[1]+Math.cos(idleA*.7)*I[3]}
  if(S&&depthOn()){if(S&&NB3D_ON&&SETT.shake){const cp=pl.dead&&pl2&&!pl2.dead?pl2:pl,mv=cp&&cp.moving&&!(cp.roll>0);NB3D_FX.lead.x+=((mv?(cp.fx||0)*1.3:0)-NB3D_FX.lead.x)*Math.min(1,dt*1.4);NB3D_FX.lead.y+=((mv?(cp.fy||0)*.9:0)-NB3D_FX.lead.y)*Math.min(1,dt*1.4);tx+=NB3D_FX.lead.x;tz+=NB3D_FX.lead.y}else NB3D_FX.lead.set(0,0);
  const hw=11.5*KAMV[3]*Math.min(1.35,Math.max(.75,cam.aspect/(16/9)));const hx=tx,hz=tz;if(MW>hw*2+2)tx=Math.min(MW-hw,Math.max(hw,tx));tz=Math.min(MH-KAMV[5],Math.max(KAMV[4],tz));tx=Math.min(hx+hw*.6,Math.max(hx-hw*.6,tx));tz=Math.min(hz+4,Math.max(hz-2.2,tz))}
  let cineZ=1;if(NB3D2.cine){const q=nb3dCineT(dt,tx,tz);tx=q[0];tz=q[1];cineZ=q[2]}camTarget.x+=(tx-camTarget.x)*Math.min(1,dt*8);camTarget.z+=(tz-camTarget.z)*Math.min(1,dt*8);if(!S||S.t<.1){camTarget.x=tx;camTarget.z=tz}
  let sx=0,sz=0;if(SETT.shake&&S&&S.shakeT>0){const pxw=2*DIST*Math.tan(KAMH)/RT_H;S.shkT=(S.shkT||0)-dt;if(S.shkT<=0||!S.shk){S.shkT=.04;S.shk=[Math.round(rnd(-1,1)*S.shakeM/pxw)*pxw,Math.round(rnd(-1,1)*S.shakeM/pxw)*pxw/Math.sin(PITCH)]}sx=S.shk[0];sz=S.shk[1]}
  const EZ=(S&&S.exec>0&&SETT.shake?1-.16*Math.min(1,S.exec/.3):1)*nb3dZoom(dt)*cineZ;cam.position.set(camTarget.x+sx,Math.sin(PITCH)*DIST*EZ,camTarget.z+Math.cos(PITCH)*DIST*EZ+sz);cam.lookAt(camTarget.x+sx,.8,camTarget.z+sz);syncSwordGlow();syncCombatEffects(dt);syncWhirlVisual(dt);syncBloodHD(dt);
  const z0=S&&S.zones[0];if(z0){W.zoneLight.x=z0.x/16;W.zoneLight.z=z0.y/16}
  for(const L of LSRC){let k=L.base;
    if(L.kind==='fire')k*=.85+Math.sin(clock*13+L.ph)*.08+Math.random()*.12;else if(L.kind==='lava'||L.kind==='rot')k*=.9+Math.sin(clock*1.7+L.ph)*.1;else if(L.kind==='rune')k*=.75+.25*Math.sin(clock*2+L.ph);
    else if(L.kind==='shrine')k*=.3+.7*(S?S.shr[L.si]/60:1);else if(L.kind==='stone')k=S&&S.stones&&S.stones[L.si]>=STONE_N?L.base*(.8+.2*Math.sin(clock*2.4+L.ph)):0;else if(L.kind==='gate')k=S&&S.opening?2.8*Math.min(1,(3.4-S.opening)/1.4):0;
    else if(L.kind==='npc'){const st=S?S.npc[L.npc]:{state:'alive'};k=st.state==='alive'||st.state==='talked'||st.state==='trial'||st.state==='offered'?L.base*(.8+.2*Math.sin(clock*3+L.ph)):st.state==='fading'?L.base*Math.max(0,st.t/1.5):0}
    else if(L.kind==='merchant')k=S&&S.merchant?L.base*(.85+.15*Math.sin(clock*4)):0;else if(L.kind==='zone')k=z0?1.6*Math.min(1,z0.life)*(.85+Math.random()*.2):0;
    L.k=k;L.d=k>0?Math.hypot(L.x-camTarget.x,(L.z-camTarget.z)*1.3):1e9}
  if(W&&W.halos&&W.haloL){const hl=W.haloL;for(let i=0;i<hl.length;i++){const L=hl[i],f=(L.base>0?Math.min(1.35,L.k/L.base):0)*(L.kind==='fire'?.7:1);TMPC.setHex(L.col).multiplyScalar(f);W.halos.setColorAt(i,TMPC);TMPC.lerp(WHITE_C,.35).multiplyScalar(1);W.cores.setColorAt(i,TMPC);if(W.groundLights&&W.groundL){const gi=W.groundL.indexOf(L);if(gi>=0){TMPC.setHex(L.col).multiplyScalar(f*(L.kind==='fire'?.75:1));W.groundLights.setColorAt(gi,TMPC)}}}
   W.halos.instanceColor.needsUpdate=true;W.cores.instanceColor.needsUpdate=true;if(W.groundLights&&W.groundLights.instanceColor)W.groundLights.instanceColor.needsUpdate=true}
  const nearL=LSRC.filter(L=>L.k>0).concat(nb3dDynLights(dt)).sort((a,b)=>a.d-b.d);const lightCap=GFX.lights;
  LPOOL.forEach((l,i)=>{const L=i<lightCap?nearL[i]:null;if(!L||L.d>26){l.intensity=0;return}l.color.setHex(L.col);l.distance=L.dist;if(NB3D_ON&&L.kind==='fire')l.position.set(L.x+Math.sin(clock*7.3+L.ph)*.06,L.y+Math.sin(clock*9.1+L.ph*1.7)*.05,L.z+Math.cos(clock*6.7+L.ph)*.06);else l.position.set(L.x,L.y,L.z);l.intensity=L.k*Math.min(1,(26-L.d)/4);{const dp=depthOn();if(dp){l.intensity*=dp[2];l.distance*=dp[3]}}/* 18.11.2026: latarnie i ogniska slabsze (autor: przeswietlaja) */if(L.kind==='fire')l.intensity*=FIRE_DIM;/* 22.11.2026: wszystkie światła słabsze o 30% (autor: prześwietla) */l.intensity*=.7});nb3dTick(dt,nearL);
  if(S&&S.t>0&&Math.random()<dt*22*GFX.parts){const a=Math.random()*Math.PI*2,d=Math.random()*200;S.parts.push(CH===4?(Math.random()<.35?{k:'m',x:pl.x+Math.cos(a)*d,y:pl.y+Math.sin(a)*d*.6,z:rnd(4,26),vx:rnd(-4,4),vy:rnd(-2,2),vz:rnd(-1.5,1.5),c:Math.random()<.5?'#c8e070':'#7fffd0',life:rnd(1.5,3.5)}:{k:'m',x:pl.x+Math.cos(a)*d,y:pl.y+Math.sin(a)*d*.6,z:rnd(1,8),vx:rnd(-5,-1),vy:rnd(-1,1),vz:rnd(-.5,.5),c:Math.random()<.6?'#4a5660':'#5e6a72',life:rnd(3,6)}):CH===3?{k:'m',x:pl.x+Math.cos(a)*d,y:pl.y+Math.sin(a)*d*.6,z:rnd(30,70),vx:rnd(-3,3),vy:rnd(-1,1),vz:rnd(-5,-2),c:Math.random()<.6?'#c8a040':'#7a6030',life:rnd(4,7)}:CH===PORT?{k:'m',x:pl.x+Math.cos(a)*d,y:pl.y+Math.sin(a)*d*.6,z:rnd(1,9),vx:rnd(-6,-2),vy:rnd(-1,1),vz:rnd(-.4,.6),c:Math.random()<.6?'#5d6f7c':'#8496a0',life:rnd(3,6)}:CH===1?{k:'m',x:pl.x+Math.cos(a)*d,y:pl.y+Math.sin(a)*d*.6,z:rnd(30,70),vx:rnd(-6,2),vy:rnd(-1,1),vz:rnd(-9,-5),c:Math.random()<.6?'#6a6670':'#8a8490',life:rnd(3,6)}:{k:'m',x:pl.x+Math.cos(a)*d,y:pl.y+Math.sin(a)*d*.6,z:rnd(4,40),vx:rnd(-3,3),vy:rnd(-2,2),vz:rnd(-1,2),c:Math.random()<.7?'#5c5566':'#7d6a58',life:rnd(2,4)})}
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
  amb.intensity=AT.ai+fl*1.4+dawn*.9;hemi.intensity=AT.hi+fl*.8+dawn*.5;if(dawn>0){TMPC.setHex(AT.amb);amb.color.copy(TMPC.lerp(DAWN,dawn))}else amb.color.setHex(AT.amb);nb3dNight();
  postMat.uniforms.flash.value=fl*.3;postMat.uniforms.haze.value=CH===2&&S&&S.phase==='play'&&!S.dg&&SETT.quality!=='low'?1:0;postMat.uniforms.tm.value=clock%600;postMat.uniforms.grain.value=SETT.quality==='low'?0:chapterArt()?.015:.03;postMat.uniforms.gtm.value=SETT.flash?clock%600:0;postMat.uniforms.sharp.value=S&&S.shakeT>0?1:Math.max(0,postMat.uniforms.sharp.value-dt*4);
  rain.visible=(CH===1||CH===PORT)&&!(NB3D_ON&&GFX.fx>0&&!(S&&S.dg));if(rain.visible){rain.material.opacity=(CH===PORT?.13:CH1_ART_ON?.20:.32)*(1-dawn*.7);for(let i=0;i<RAIN_N;i++){const d=DROPS[i];d.y-=d.s*dt;d.x-=d.s*.12*dt;if(d.y<0){d.y+=12;d.x=rnd(-15,15);d.z=rnd(-10,10);if(S&&dt>0&&i%9===0)S.parts.push({k:'d',x:(camTarget.x+d.x)*16,y:(camTarget.z+d.z)*16,z:1,vx:rnd(-6,6),vy:rnd(-3,3),vz:rnd(8,14),c:'#6a7a96',life:.25})}
    const x=camTarget.x+d.x,z=camTarget.z+d.z,o=i*6,hid=CH===PORT&&portCovered(x,z);rainPos[o]=x;rainPos[o+1]=hid?-99:d.y;rainPos[o+2]=z;rainPos[o+3]=x+.07;rainPos[o+4]=hid?-99:d.y-.55;rainPos[o+5]=z}rainGeo.attributes.position.needsUpdate=true}
  for(const o of propObjs){let f;
    if(o.kind==='gate')f=o.frames[!S||!S.opening?0:S.opening>2.4?1:2];
    else if(o.kind==='shrine')f=at(o.frames,clock+o.ph,6);
    else if(o.kind==='stone')f=o.frames[S&&S.stones&&S.stones[o.si]>=STONE_N?1:0];
    else f=o.fps?at(o.frames,clock+o.ph,o.fps):o.frames[0];
    if(f&&o.mesh.material!==f.n)setFrame(o.mesh,f)}
  if(W&&W.portRoom){
   const room=W.portRoom;
   const inside=p=>p&&!p.dead&&p.x/TS>room.left-.25&&p.x/TS<room.right+.25&&p.y/TS>room.north-.8&&p.y/TS<room.south+.8;
   room.cover.visible=!(S&&(inside(pl)||inside(pl2)));
  }
  CUT.value.set(S&&!pl.dead?pl.x/16:-99,0,S&&!pl.dead?pl.y/16:-99);
  if(S&&!pl.dead&&(CH===3||CH===4)){V.set(pl.x/16,.9,pl.y/16).project(cam);CUTS.value.set((V.x+1)/2*rt.width,(V.y+1)/2*rt.height,rt.height*.16)}else CUTS.value.set(-999,-999,0);
  if(S){const art=chapterArt()?ART_LIGHT[CH]:null;plLight.color.setHex(art?art[0]:0xffd2a0);plLight.distance=art?art[2]:13;plLight.position.set(pl.x/16,2.4,pl.y/16);plLight.intensity=pl.dead?.6:(art?art[1]:2.05)+Math.sin(clock*9)*(art?.025:.06);{const dp=depthOn();if(dp){plLight.intensity*=dp[4];plLight.distance*=dp[5]}}}else plLight.position.set(tx,2.4,tz);
  let bi=0;const bdp=depthOn(),blob=(x,z,s)=>{if(bi>=MAXB)return;if(bdp)s=s*1.55+.25;V.set(x,.03,z);SC.set(s,1,s*(bdp?.5:.6));M4.compose(V,Q.set(0,0,0,1),SC);blobs.setMatrixAt(bi++,M4);nb3dShadow(x,z,s)};
  // NPCs of the active chapter
  for(const n of W.npcs){const m=W.npcMeshes[n.id];if(!m)continue;const st=S?S.npc[n.id]:{state:'alive',t:0};
    m.visible=st.state!=='gone'&&st.state!=='risen';if(n.id==='marga'&&S&&S.merchant&&CH===1)m.visible=false;if(!m.visible)continue;const fr=A[n.art];
    if(n.art==='tharm'){setFrame(m,at(fr,clock,4));m.material.opacity=st.state==='fading'?.85*Math.max(0,st.t/1.5):.6+.25*Math.sin(clock*3)}
    else if(st.state==='dead')setFrame(m,fr[3]);
    else if(NPC_STILL.has(n.art)&&!NPC_STILL_OFF)setFrame(m,fr[0]);// 16.11.2026: klatki tych NPC roznia sie szumem tekstury, wiec stoja na jednej klatce, a zycie daje oddech z kodu
    else setFrame(m,at(n.art==='marga'?fr:(fr._s3||(fr._s3=fr.slice(0,3))),clock+n.x,n.art==='wit'?5:n.art==='elder'?1.5:3));
    const br=NPC_STILL.has(n.art)&&!NPC_STILL_OFF&&st.state!=='dead'?Math.sin(clock*1.7+n.x*.37)*.011:0;
    m.castShadow=false;m.position.set(n.x/16,npcLift(m)*(1+br*2),n.y/16);m.scale.set(1-br*.5,SQ*(1+br*2),1);if(n.art!=='tharm')blob(n.x/16,n.y/16,1)}
  if(S){
    heroMesh.visible=!(SETT.flash&&clock<(pl.blinkUntil||0)&&pl.roll<=0&&!pl.dead&&Math.floor(clock*24)%2);
    {const hf=heroFrame();S.heroHF=hf;setFrame(heroMesh,hf)}// 14.11.2026 (decyzja autora): zaklęcie ostrza nie barwi już sprite'a bohatera (heroBladeMat); żywioł widać na cięciach, iskrach i statusach
    const hs=pl.atk&&FACEK.includes(pl.atk.kind)?(pl.fx>=0?1:-1):pl.roll>0||pl.dead?pl.s:A.heroD&&A.heroD.v2&&!pl.atk&&(pl.parryT>0||pl.broken>0||(pl.hurtT>0&&!pl.block))?(pl.fx>=0?1:-1):pl.swingT>0?(pl.swingDir===2?pl.swingS:1):(pl.charging||pl.block)&&Math.abs(pl.fx)>Math.abs(pl.fy)?(pl.fx>0?1:-1):(pl.dir===2?pl.s:1);
    const guardRecoil=!pl.dead?recoilAmount(pl.visualGuard):0;heroMesh.position.set((pl.x+(pl.visualGuard?pl.visualGuard.dx:0)*guardRecoil*.7)/16,S.zab?.1:0,(pl.y+(pl.visualGuard?pl.visualGuard.dy:0)*guardRecoil*.7)/16);heroMesh.rotation.z=-(pl.visualGuard?pl.visualGuard.dx:0)*guardRecoil*.018;heroMesh.scale.set(hs,SQ,1);heroMotion(pl,heroMesh,hs,dt,heroMesh.rotation.z);dzwDraw(hs);drawP2(dt);mpHudTick();
    S.qBreak=Math.max(0,(S.qBreak||0)-dt);S.qPop=Math.max(0,(S.qPop||0)-dt);
    // charges orbit the hero as sparks; runes of time and reach leave their own orbiting motes
    const orbit=(n,r,sp,col,z)=>{if(dt<=0)return;for(let i=0;i<n;i++){const a=clock*sp+i*Math.PI*2/n;S.parts.push({k:'e',x:pl.x+Math.cos(a)*r,y:pl.y+Math.sin(a)*r*.6,z,vx:0,vy:0,vz:0,c:col,life:.05})}};
    if(!pl.dead)blob(pl.x/16,pl.y/16,1);if(pl2&&!pl2.dead)blob(pl2.x/16,pl2.y/16,1);heroMark(0,pl);heroMark(1,pl2);
    for(const e of S.enemies){
      const an=A[e.type];let fr;
      if(e.portArt){
        const art=e.portArt;fr=e.portBoss&&art.chain?(e.hookWind>0?art.chain[0]:e.hookF>0?art.chain[1]:e.atkA>0?art.attack[1]:e.atkT>0||e.ctw>0?art.attack[0]:at(art.walk,e.walk+e.ph,4)):e.atkA>0||e.leap>0?art.attack[1]:e.sw>0||e.atkT>0||e.ghoulWind>0?art.attack[0]:at(art.walk,e.walk+e.ph,7);
      }else if(e.type==='bat')fr=at(an.walk,clock+e.ph,12);
      else if(e.type==='glizzard'){if(e.rise>0||e.mode==='curl')fr=at(an.curl,clock,7);else if(e.mode==='tell')fr=e.atk==='bomb'?at(an.tell,clock,6):an.attack[0];else if(e.atkA>0)fr=at(an.attack,.35-e.atkA,9,false);else if(e.mode==='roar')fr=at(an.tell,clock,10);else fr=at(Math.hypot(e.vx,e.vy)>1||e.moving?an.walk:an.idle,e.walk+e.ph,e.moving?7:4)}
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
      const y=e.type==='bat'?.85+Math.sin(clock*8+e.ph)*.12:e.type==='courtraven'?.55+Math.sin(clock*7+e.ph)*.12:e.type==='wraith'?.3+Math.sin(clock*2.5+e.ph)*.1:e.type==='zmora'?.25+Math.sin(clock*2.5+e.ph)*.1:e.type==='wisp'?.35+Math.sin(clock*3+e.ph)*.12:(e.rise>0&&e.type!=='glizzard'?-e.rise*(BIG.has(e.type)?3:2):0)+(e.lh||0)+(e.type==='strzyga'&&!e.phase?.35+Math.sin(clock*2)*.1:0)+((CH===1||CH===2)&&!BIG.has(e.type)&&e.type!=='bat'&&e.type!=='collector'&&e.type!=='glizzard'?.1:0);
      const js=e.portArt?e.portArt.scale:e.type==='glizzard'?1.3:e.type==='collector'?(CH===5&&A.collectorC5?1:1.25):e.type==='beast'?(A.beast.sheet?(e.enraged?1.32:1.15):(e.enraged?1.5:1.3)):e.type==='monk'?1.08:e.type==='cumlin'?1.2:e.type==='leszy'?1.25:e.type==='strzyga'?(e.phase===2?1.25:1.2):e.type==='bies'?1.15:e.type==='boginka'?1.1:e.type==='bookgolem'?1.2:e.type==='executioner'?1.1:e.type==='paperrat'?.85:1,hop=0;
      const recoil=recoilAmount(e.visualHit),impact=e.visualHit,pose=enemyImpactShape(e),amount=pose?pose.push:impact?impact.amplitude*recoil:0;e.mesh.position.set((e.x+(impact?impact.dx:0)*amount)/16,y+hop,(e.y+(impact?impact.dy:0)*amount)/16);e.mesh.rotation.z=-(impact?impact.dx:0)*(pose?pose.lean:recoil*.035)*(BIG.has(e.type)?.4:1);const pp=e.pop=(e.pop||1)+(((attackCue(e)&&!BIG.has(e.type)&&!e.mini)?1.07:1)-(e.pop||1))*Math.min(1,dt*16);e.mesh.scale.set(e.s*js*pp*(1+(pose?pose.stretch:0)),SQ*js*pp*(1-(pose?pose.stretch:0))*1,1);
      if((e.type==='beast'||e.type==='strzyga')&&e.lh>0)blob(e.tx/16,e.ty/16,3.2*Math.min(1,e.lh/3));else if(e.type!=='wisp')blob(e.x/16,e.y/16,e.type==='leszy'?3:e.type==='strzyga'?2.6:e.type==='bies'?1.5:e.type==='bookgolem'?1.8:e.type==='courtraven'||e.type==='paperrat'?.5:e.type==='beast'?3.2:e.type==='collector'?(CH===5&&A.collectorC5?2.2:1.4):e.type==='glizzard'?1.2:e.type==='boss'?3:e.type==='cumlin'?3.4:e.type==='warden'?1.5:e.type==='bat'?.45:e.type==='ghoul'?1.2:e.type==='goat'?1.4:e.type==='shieldman'?1.1:1);
    }
    syncThreatRings();
    for(const f of S.eproj)if(f.mesh){const fr=at(f.anim||A.fireball,clock+f.ph,10);setFrame(f.mesh,fr,COMBAT_POLISH_ON?magicMaterialMode(fr,combatThreatNear(f.x,f.y,12)):null);f.mesh.position.set(f.x/16,COMBAT_POLISH_ON?1.4:.55,f.y/16);f.mesh.quaternion.copy(cam.quaternion);f.mesh.rotateZ(Math.atan2(-f.vy*Math.sin(PITCH),f.vx));f.mesh.scale.set(COMBAT_POLISH_ON?.75:1,COMBAT_POLISH_ON?.75:1,1)}
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
  blobs.count=bi;blobs.instanceMatrix.needsUpdate=true;nb3dShadowEnd();try{nb3dRefl()}catch(e){quietErr('nb3dRefl',e)}
  decalT-=dt;if(decalDirty&&decalT<=0){decalTex.needsUpdate=true;decalDirty=false;decalT=.15}
  updatePowerVisuals();
  // talk prompt
  const pr=$('prompt'),free=S&&S.phase==='play'&&!S.notice&&!S.dialog&&!S.choosing&&!S.shop,nmc=free?nearMerchant():null,near=free?(nmc||nearNpc()):null;
  const nf=free&&!near?nearPowerFire():null,nex=free&&!near&&!nf?nearExit():null,lbl=nf?(EN?'Nourishing Cauldron · activate revival':'Sycący Kociołek · aktywuj odrodzenie'):nex?{enter:(EN?'Descend into the crypt':'Zejdź do krypty'),leave:(EN?'Go back up':'Wyjdź na górę'),sealed:(EN?'Crypt sealed':'Krypta zamknięta'),winch:(EN?'Release the chain':'Zwolnij łańcuch'),ferry:(EN?'Cast off':'Odbij od nabrzeża'),ferryLocked:(EN?'Ferry chained':'Prom przykuty')}[nex.kind]:nmc?(EN?'Trade':'Handluj'):(EN?'Talk':'Rozmawiaj'),tgt=near||nf||nex;
  if(tgt){V.set(tgt.x/16,2.55,tgt.y/16).project(cam);pr.hidden=false;{const kp=PAD.g&&INPUT_LAST==='p'?'Y':PAD.g&&!INPUT_LAST?'Enter / Y':'Enter',h=(nex&&nex.kind==='sealed')?lbl:'<b class="pk">'+kp+'</b>'+lbl;if(pr._h!==h){pr._h=h;pr.innerHTML=h}}pr.style.left=((V.x+1)/2*100)+'%';pr.style.top=((1-V.y)/2*100)+'%'}else pr.hidden=true;
  // Marga at her stall during the break
  const mc=S&&S.merchant;margaMesh.visible=!!mc;if(mc){setFrame(margaMesh,at(A.marga,clock,3));margaMesh.position.set(mc.x/16,0,mc.y/16);const k=mc.state==='in'?1-mc.t:mc.state==='out'?mc.t:1;margaMesh.scale.set(1,SQ*Math.max(.05,k),1);blob(mc.x/16,mc.y/16,1);W.merchantLight.x=mc.x/16;W.merchantLight.z=mc.y/16+.3}
  if(S&&S.collector&&!S.collector.dead&&Math.random()<dt*10){const c=S.collector,a=Math.random()*Math.PI*2;S.parts.push({k:'e',x:c.x+Math.cos(a)*14,y:c.y+Math.sin(a)*8,z:rnd(6,26),vx:-Math.sin(a)*10,vy:Math.cos(a)*6,vz:rnd(2,8),c:Math.random()<.6?'#e0b84a':'#fff0b0',life:rnd(.6,1.2)})}
}
function draw(){const tD=SETT.fpsShow?performance.now():0;postMat.uniforms.uCA.value=NB3D_ON?NB3D_FX.ca:0;postMat.uniforms.uSh.value=NB3D_ON?(GFX.fx>=2?.25:GFX.fx>=1?.3:.2):0;renderer.setRenderTarget(rt);renderer.render(scene,cam);{const ub=postMat.uniforms.low.value<.5;postMat.uniforms.useB.value=ub?1:0;if(ub)blurPasses()}if(tD){const r=renderer.info.render;FPS.calls=r.calls;FPS.tri=r.triangles}renderer.setRenderTarget(null);renderer.render(postScene,postCam);if(tD)FPS.draw+=performance.now()-tD}


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
 paper:{c:[.86,.82,.7],s:ART_ON?.22:.26,a:ART_ON?.75:.9,add:0,y:[3,7],v:[-.28,-.16],life:[8,12],sw:1},
 /*17.11.2026: port (rozdz. III) - chlodna morska mgielka*/spray:{c:[.72,.84,.92],s:.15,a:.26,add:1,y:[.2,2.5],v:[-.03,.04],life:[6,10],tw:1}};
const AMB_CFG={1:[['ember',55],['ash',45]],2:[['spark',55],['dustw',35]],3:[['mote',60],['fly',16]],4:[['firefly',45]],5:[['mote2',50],['paper',20]],6:[['spray',40],['ember',16]],9:[['mote2',35]]};
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
 if(AMB.ch===4&&GFX.fx>0){const c=canvas(128,96),g=c.getContext('2d');g.setTransform(1,0,0,.55,0,21.6);for(let i=0;i<26;i++){const x=rnd(18,110),y=rnd(20,68),r=rnd(12,24),gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(200,215,210,.22)');gr.addColorStop(1,'rgba(200,215,210,0)');g.fillStyle=gr;g.fillRect(0,-200,128,600)}g.setTransform(1,0,0,1,0,0);/* 15.11.2026: gradient nie jest juz ucinany prostokatem (ostre poziome linie mgly w IV); wygaszenie przy wszystkich czterech krawedziach */g.globalCompositeOperation='destination-out';for(const [x0,y0,x1,y1] of [[0,0,128,0],[0,0,0,96]]){const e=g.createLinearGradient(x0,y0,x1,y1);e.addColorStop(0,'rgba(0,0,0,1)');e.addColorStop(.22,'rgba(0,0,0,0)');e.addColorStop(.78,'rgba(0,0,0,0)');e.addColorStop(1,'rgba(0,0,0,1)');g.fillStyle=e;g.fillRect(0,0,128,96)}g.globalCompositeOperation='source-over';
  const tex=new THREE.CanvasTexture(c);for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(12,6.5),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,opacity:.34,fog:false}));m.rotation.x=-Math.PI/2;m.position.set(camTarget.x+rnd(-16,16),.35+i*.08,camTarget.z+rnd(-12,8));m.userData.v=rnd(.15,.35)*(Math.random()<.5?-1:1);m.renderOrder=4;scene.add(m);AMB.fog.push(m)}}}
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
function puddleBuild(){for(const m of PUD.list){scene.remove(m.m);if(m.g)scene.remove(m.g)}for(const r of PUD.rings)scene.remove(r.m);PUD.list=[];PUD.rings=[];PUD.w=W;if(CH!==1&&CH!==PORT||!W||S.dg)return;
 if(!PUD.tex){const c=canvas(64,32),g=c.getContext('2d'),gr=g.createRadialGradient(32,16,2,32,16,30);gr.addColorStop(0,'rgba(8,11,18,.78)');gr.addColorStop(.7,'rgba(14,18,28,.6)');gr.addColorStop(1,'rgba(26,32,46,0)');g.setTransform(1,0,0,.5,0,8);g.fillStyle=gr;g.fillRect(0,-16,64,64);g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(170,190,215,.34)';g.beginPath();g.ellipse(26,12,12,3,-.15,0,6.28);g.fill();g.fillStyle='rgba(200,215,235,.22)';g.beginPath();g.ellipse(40,20,6,1.5,-.1,0,6.28);g.fill();PUD.tex=new THREE.CanvasTexture(c);
  const r=canvas(32,32),h=r.getContext('2d');h.strokeStyle='rgba(200,215,235,.9)';h.lineWidth=2;h.beginPath();h.arc(16,16,13,0,6.28);h.stroke();PUD.ringTex=new THREE.CanvasTexture(r)}
 const rr=rng(4711),fires=W.PROPS.filter(p=>p.fire);let n=0;
 for(let a=0;a<4000&&n<26;a++){const x=4+rr()*(MW-8),y=4+rr()*(MH-8),t=tileAt(x|0,y|0);if(W.portRoom&&x>W.portRoom.left-1&&x<W.portRoom.right+1&&y>W.portRoom.north-1&&y<W.portRoom.south+1)continue;if(SOLID.has(t)||VOID.has(t)||t===90||t===45||t===40||W.PROPS.some(p=>Math.hypot(p.x-x,p.y-y)<1.6))continue;
  const s=1.1+rr()*1.3,m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:PUD.tex,transparent:true,depthWrite:false,fog:true}));m.rotation.x=-Math.PI/2;m.position.set(x,.06,y);m.scale.set(s*1.4,s*.8,1);m.renderOrder=1;scene.add(m);
  const f=fires.map(p=>[p,Math.hypot(p.x-x,p.y-y)]).filter(q=>q[1]<5).sort((a,b)=>a[1]-b[1])[0];let gm=null;
  if(f){gm=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:PUD.tex,color:0xff7a2a,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.0,fog:false}));gm.rotation.x=-Math.PI/2;gm.position.set(x,.065,y);gm.renderOrder=2;gm.scale.copy(m.scale);gm.userData.k=1-f[1]/5;scene.add(gm)}
  PUD.list.push({m,g:gm,x,y,s});n++}
 for(let i=0;i<34;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:PUD.ringTex,transparent:true,depthWrite:false,opacity:0,fog:false}));m.rotation.x=-Math.PI/2;m.visible=false;scene.add(m);PUD.rings.push({m,t:9})}}
// 16.11.2026: kropla deszczu pod dachem portu (xz w obrysie budynku z PORT_BUILDINGS, wspolrzedne wielkiej mapy); deszcz nie pada w srodku skladu
function portCovered(x,z){return PORT_BUILDINGS.some(([bx,by,w,h])=>x>MP(bx)&&x<MP(bx+w)&&z>MP(by)&&z<MP(by+h))}
function puddleTick(dt){const wet=(CH===1||CH===PORT)&&!S.dg;if(PUD.w!==W||wet!==(PUD.list.length>0)&&!(wet&&PUD.w===W))puddleBuild();const raining=rain.visible&&!S.dg,vis=wet;
 for(const p of PUD.list){p.m.visible=vis;if(p.g){p.g.visible=vis;p.g.material.opacity=p.g.userData.k*(.38+.1*Math.sin(clock*9+p.x)+.06*Math.sin(clock*23+p.y))}}
 if(!vis||!raining||!PUD.list.length){for(const r of PUD.rings)r.m.visible=false;return}
 for(const r of PUD.rings){r.t+=dt;if(r.t>.7){if(Math.random()<dt*6){const p=PUD.list[(Math.random()*PUD.list.length)|0];if(Math.abs(p.x-camTarget.x)>18||Math.abs(p.y-camTarget.z)>14)continue;r.t=0;r.m.position.set(p.x+rnd(-.45,.45)*p.s,.07,p.y+rnd(-.25,.25)*p.s);r.m.visible=true}else{r.m.visible=false;continue}}
  const k=r.t/.7,sc=.08+k*.42;r.m.scale.set(sc,sc*.6,1);r.m.material.opacity=(1-k)*.55}}
// fala uderzeniowa w obrazie: krąg zniekształcenia od miejsca ciosu
const SHOCK={t:9,x:.5,y:.5,s:0};const SHV=new THREE.Vector3();
function shockAt(x,y,str){if(postMat.uniforms.low.value>.5)return;SHV.set(x/16,.4,y/16).project(cam);if(Math.abs(SHV.x)>1.2||Math.abs(SHV.y)>1.2)return;if(SHOCK.t<.25&&SHOCK.s>str)return;SHOCK.t=0;SHOCK.x=SHV.x*.5+.5;SHOCK.y=SHV.y*.5+.5;SHOCK.s=str}
function shockTick(dt){SHOCK.t+=dt;const u=postMat.uniforms.shock.value;if(SHOCK.t<.55)u.set(SHOCK.x,SHOCK.y,SHOCK.t,SHOCK.s*(1-SHOCK.t/.55));else u.set(0,0,0,0)}

// ===== 18.11.2026: oprawa 3D (decyzja autora; nowe shadery za zgoda autora z 18.11.2026) =====
// 1) promienie swiatla w mgle: stozki pod latarniami i nad ogniskami oraz smugi ksiezyca (addytywny shader z szumem pylu),
// 2) ruchome swiatla od pociskow ognia/lodu i wybuchow kul ognia (bez nowych lamp: biora miejsca z istniejacej puli LPOOL, wiec bez rekompilacji materialow),
// 3) cienie od ognisk pod postaciami i wrogami (miekki shader, kierunek od najblizszych swiatel),
// 4) kamera w walce: lekkie oddalenie przy bossie i w czasie naporu. Wszystko TYLKO wyglad: nie zmienia pozycji, zasiegow, trafien ani balansu.
// ?oprawa3d=0 (tylko lokalnie) = porownanie przed. Na jakosci Srednia/Niska promienie sa wylaczone (GFX.fx=0).
const NB3D_ON=nbParam('oprawa3d')!=='0',FIRE_DIM=.48;
const NB3D={dyn:[],pool:[],pi:0,bursts:[],lights:[],si:0,zoom:1,zt:0,bossNear:false,max:56,moonCells:[]};
const NB3D_VS=`varying vec3 vP;varying vec3 vN;varying vec3 vV;varying vec3 vC;varying vec3 vW;
 void main(){vec4 lp=vec4(position,1.);vec3 n=normal;
 #ifdef USE_INSTANCING
  lp=instanceMatrix*lp;n=mat3(instanceMatrix)*n;
 #endif
 vC=vec3(1.);
 #ifdef USE_INSTANCING_COLOR
  vC=instanceColor;
 #endif
 vP=position;vec4 wp=modelMatrix*lp;vW=wp.xyz;vN=normalize(mat3(modelMatrix)*n);vV=normalize(cameraPosition-wp.xyz);gl_Position=projectionMatrix*viewMatrix*wp;}`;
// stozek: wierzcholek w y=0, podstawa w y=-1; jasny w srodku, miekkie brzegi (patrzymy na sciane bokiem), wygasa ku podstawie, pyl i krople plyna w smudze
const NB3D_FS=`uniform float uT;uniform float uI;uniform float uE;varying vec3 vP;varying vec3 vN;varying vec3 vV;varying vec3 vC;varying vec3 vW;
 float hh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float nz(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hh(i),hh(i+vec2(1.,0.)),f.x),mix(hh(i+vec2(0.,1.)),hh(i+1.),f.x),f.y);}
 void main(){float t=clamp(-vP.y,0.,1.);float e=abs(dot(normalize(vN),normalize(vV)));float edge=pow(e,uE);
  float fall=smoothstep(0.,.14,t)*pow(1.-t,1.25);
  float dust=.5+.5*nz(vec2(vW.x*1.3+vW.z*.6,vW.y*2.2-uT*.6))*(.6+.4*nz(vW.xz*2.3+vec2(uT*.15,-uT*.1)));
  float a=edge*fall*dust*uI;gl_FragColor=vec4(vC*a,1.);}`;
const nb3dShaftMat=(k,e=1.8)=>new THREE.ShaderMaterial({uniforms:{uT:{value:0},uI:{value:k},uE:{value:e}},vertexShader:NB3D_VS,fragmentShader:NB3D_FS,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false});
const NB3D_CONE=(()=>{const g=new THREE.CylinderGeometry(.16,1,1,20,4,true);g.translate(0,-.5,0);return g})();
const NB3D_SHAFTS=(()=>{const m=new THREE.InstancedMesh(NB3D_CONE,nb3dShaftMat(.62),NB3D.max);m.frustumCulled=false;m.renderOrder=6;for(let i=0;i<NB3D.max;i++)m.setColorAt(i,WHITE_C);m.count=0;scene.add(m);return m})();
const NB3D_MOON=(()=>{const m=new THREE.InstancedMesh(NB3D_CONE,nb3dShaftMat(1.25,3.),12);m.frustumCulled=false;m.renderOrder=6;for(let i=0;i<12;i++)m.setColorAt(i,WHITE_C);m.count=0;scene.add(m);return m})();
// cien od swiatla: pas wychodzacy od stop w strone przeciwna do ognia; uv.y=0 przy stopach, 1 na koncu
const NB3D_LSH=(()=>{const g=new THREE.PlaneGeometry(1,1);g.translate(0,.5,0);g.rotateX(-Math.PI/2);
 const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:false,uniforms:{},vertexShader:`varying vec2 vU;varying float vO;void main(){vU=uv;vO=1.;
  #ifdef USE_INSTANCING_COLOR
   vO=instanceColor.r;
  #endif
  vec4 p=vec4(position,1.);
  #ifdef USE_INSTANCING
   p=instanceMatrix*p;
  #endif
  gl_Position=projectionMatrix*viewMatrix*modelMatrix*p;}`,
  fragmentShader:`varying vec2 vU;varying float vO;void main(){float w=mix(.95,.5,vU.y);float d=abs(vU.x-.5)*2./w;float a=(1.-smoothstep(.35,1.,d))*pow(1.-vU.y,1.3)*smoothstep(0.,.06,vU.y);gl_FragColor=vec4(.015,.012,.03,a*vO);}`});
 const m=new THREE.InstancedMesh(g,mat,1200);m.frustumCulled=false;m.renderOrder=-1;for(let i=0;i<1200;i++)m.setColorAt(i,WHITE_C);m.count=0;scene.add(m);return m})();
const NB3D_M=new THREE.Matrix4(),NB3D_Q=new THREE.Quaternion(),NB3D_V=new THREE.Vector3(),NB3D_S=new THREE.Vector3(),NB3D_C=new THREE.Color(),NB3D_DIR=new THREE.Vector3(),NB3D_E=new THREE.Euler();
// --- ruchome swiatla: pociski i krotkie blyski wybuchow
function nb3dBurst(x,y,col,k,dist,life){if(!NB3D_ON)return;if(k>2)nb3dDisturb(x/16,y/16,dist*.5,1);if(NB3D.bursts.length>12)NB3D.bursts.shift();NB3D.bursts.push({x:x/16,z:y/16,col,k,dist,life,t:0})}
function nb3dDyn(x,y,z,col,k,dist,pri){const o=NB3D.pool[NB3D.pi]||(NB3D.pool[NB3D.pi]={kind:'dyn'});NB3D.pi++;o.x=x;o.y=y;o.z=z;o.col=col;o.k=k;o.base=k;o.dist=dist;o.d=Math.hypot(x-camTarget.x,(z-camTarget.z)*1.3)*pri;NB3D.dyn.push(o)}
function nb3dDynLights(dt){NB3D.dyn.length=0;NB3D.pi=0;if(!NB3D_ON||!S)return NB3D.dyn;
 for(const p of S.swordShots||[])if(p&&p.t>0)nb3dDyn(p.x/16,.75,p.y/16,p.ice?0x8fd6ff:0xff8a3a,p.ice?1.15:1.7,p.ice?4.2:5.2,.55);
 let n=0;for(const f of S.eproj||[]){if(n>=6)break;if(f&&(!f.anim||f.anim===A.fireball)){nb3dDyn(f.x/16,.7,f.y/16,0xff7a2c,1.25,4.2,.7);n++}}
 if(NB3D_BEAM.on)nb3dDyn(NB3D_BEAM.p.x,1.7,NB3D_BEAM.p.z,0xcfdcff,1.45,7.5,.5);/* 19.11.2026: swiecace ostrze usuniete (autor) */
 for(let i=NB3D.bursts.length-1;i>=0;i--){const b=NB3D.bursts[i];b.t+=dt;if(b.t>=b.life){NB3D.bursts.splice(i,1);continue}const f=1-b.t/b.life;nb3dDyn(b.x,1.1,b.z,b.col,b.k*f*f,b.dist,.4)}
 return NB3D.dyn}
// --- cienie od swiatel pod postaciami
function nb3dShadow(x,z,s){if(!NB3D_ON||NB3D.si>=1190)return;if(NB3D2.boltShadow>.05)nb3dBoltShadow(x,z,s);else if(nb3dMoonOn())nb3dMoonShadow(x,z,s,.26);let a=null,b=null,sa=0,sb=0;
 for(const L of NB3D.lights){const dx=x-L.x,dz=z-L.z,d=Math.hypot(dx,dz),r=L.dist*1.15;if(d>r||d<.12)continue;const st=L.k*(1-d/r);if(st>sa){b=a;sb=sa;a=L;sa=st}else if(st>sb){b=L;sb=st}}
 for(const [L,st] of [[a,sa],[b,sb]]){if(!L||st<.05||NB3D.si>=1190)continue;const dx=x-L.x,dz=z-L.z,d=Math.hypot(dx,dz),ln=Math.min(3.6,s*(.85+d*.5/Math.max(.6,L.y*.8))),w=s*.82;
  NB3D_E.set(0,Math.atan2(-dx,-dz),0);NB3D_Q.setFromEuler(NB3D_E);NB3D_M.compose(NB3D_V.set(x,.036,z),NB3D_Q,NB3D_S.set(w,1,ln));NB3D_LSH.setMatrixAt(NB3D.si,NB3D_M);NB3D_C.setRGB(Math.min(.82,st*1.5),0,0);NB3D_LSH.setColorAt(NB3D.si,NB3D_C);NB3D.si++}}
function nb3dShadowEnd(){NB3D_LSH.count=NB3D.si;NB3D_LSH.instanceMatrix.needsUpdate=true;if(NB3D_LSH.instanceColor)NB3D_LSH.instanceColor.needsUpdate=true;NB3D.si=0}
// --- promienie w mgle i smugi ksiezyca
const NB3D_MOON_CH={1:1,3:.8,4:1,6:1.1};
function nb3dTick(dt,nearL){const on=NB3D_ON&&GFX.fx>0;NB3D.lights.length=0;for(const L of nearL){if(NB3D.lights.length>=8)break;if(L.kind==='fire'||L.kind==='lava'||L.kind==='dyn'||L.kind==='zone')NB3D.lights.push(L)}
 NB3D_SHAFTS.material.uniforms.uT.value=NB3D_MOON.material.uniforms.uT.value=clock%1000;try{nb3dTick2(dt);nb3dTick4(dt)}catch(e){quietErr('nb3d2',e)}
 if(W&&W.portShip3){const g=W.portShip3;g.position.y=g.userData.y0+Math.sin(clock*.7)*.05;g.rotation.z=Math.sin(clock*.53)*.018;g.rotation.x=Math.sin(clock*.41+1)*.012}
 if(!on){NB3D_SHAFTS.count=0;NB3D_MOON.count=0;return}
 let n=0;for(const L of LSRC){if(n>=NB3D.max)break;if(L.kind!=='fire'||!(L.k>0)||L.d>24)continue;const low=L.y<1.05,len=low?2.4:L.y+.15,r=low?.75:.9+L.y*.42;
  if(low){NB3D_Q.setFromAxisAngle(NB3D_DIR.set(1,0,0),Math.PI);NB3D_M.compose(NB3D_V.set(L.x,L.y+.05,L.z),NB3D_Q,NB3D_S.set(r,len,r))}else{NB3D_Q.identity();NB3D_M.compose(NB3D_V.set(L.x,L.y+.05,L.z),NB3D_Q,NB3D_S.set(r,len,r))}
  NB3D_SHAFTS.setMatrixAt(n,NB3D_M);NB3D_C.setHex(L.col).multiplyScalar(Math.min(1.4,L.k/(L.base||1))*(low?.55:1));NB3D_SHAFTS.setColorAt(n,NB3D_C);n++}
 NB3D_SHAFTS.count=n;NB3D_SHAFTS.instanceMatrix.needsUpdate=true;if(NB3D_SHAFTS.instanceColor)NB3D_SHAFTS.instanceColor.needsUpdate=true;
 // smugi ksiezyca: przypiete do siatki swiata co 13 j. (nie jada za kamera), tylko na mapach pod niebem
 const mk=NB3D_MOON_CH[CH]||0;let m=0;if(mk&&S&&!S.dg){const AT=ATM[CH]||{};NB3D_DIR.copy(moon.position).normalize();const cs=13,gx0=Math.floor((camTarget.x-20)/cs),gz0=Math.floor((camTarget.z-16)/cs);
  for(let gx=gx0;gx<=gx0+3&&m<12;gx++)for(let gz=gz0;gz<=gz0+3&&m<12;gz++){const h1=Math.abs(Math.sin(gx*12.9898+gz*78.233)*43758.5453)%1,h2=Math.abs(Math.sin(gx*39.346+gz*11.135)*43758.5453)%1;if(h1>.42)continue;
   const len=17,gxw=gx*cs+h2*9,gzw=gz*cs+h1*9;NB3D_Q.setFromUnitVectors(UP,NB3D_DIR);NB3D_M.compose(NB3D_V.set(gxw,0,gzw).addScaledVector(NB3D_DIR,len),NB3D_Q,NB3D_S.set(1.6+h2*1.4,len,1.6+h2*1.4));
   NB3D_MOON.setMatrixAt(m,NB3D_M);NB3D_C.setHex(AT.mc||0xb8c4dd).multiplyScalar(mk*(.55+.45*Math.sin(clock*.23+h1*9)));NB3D_MOON.setColorAt(m,NB3D_C);m++}}
 NB3D_MOON.count=m;NB3D_MOON.instanceMatrix.needsUpdate=true;if(NB3D_MOON.instanceColor)NB3D_MOON.instanceColor.needsUpdate=true}
// --- kamera w walce: przy bossie w poblizu i w czasie naporu kamera lekko sie oddala (plynnie, ok. 1 s)
function nb3dZoom(dt){if(!NB3D_ON||!S||S.phase!=='play'){NB3D.zoom+=(1-NB3D.zoom)*Math.min(1,dt*2);return NB3D.zoom}
 NB3D.zt-=dt;if(NB3D.zt<=0){NB3D.zt=.3;NB3D.bossNear=false;for(const e of S.enemies){if(e.dead||!bossBar(e))continue;if(Math.hypot(e.x-pl.x,e.y-pl.y)<22*16){NB3D.bossNear=true;break}}}
 const tg=NB3D.bossNear?1.09:surgeOn()?1.05:1;NB3D.zoom+=(tg-NB3D.zoom)*Math.min(1,dt*1.1);return NB3D.zoom}

// ===== 18.11.2026 (runda oprawa-2, decyzja autora: "rob wszystko oprocz brył"; nowe shadery za zgoda autora) =====
// mgla przy ziemi, cienie chmur, odbicia swiatel na mokrej ziemi i wodzie (deszcz), kregi deszczu na wodzie portu, wiatr w trzcinach,
// noc, ktora sie zmienia (ksiezyc wedruje, polnoc ciemniejsza, przedswit), blyskawice z dlugimi cieniami, reflektor Zakonu w porcie,
// najazd kamery przy wejsciu bossa (wylaczany opcja "Wstrzasy kamery"), cieply kontur postaci od strony ognia. Wszystko TYLKO wyglad.
const NB3D_NZ=`float hh(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float nz(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hh(i),hh(i+vec2(1.,0.)),f.x),mix(hh(i+vec2(0.,1.)),hh(i+1.),f.x),f.y);}
 float fbm(vec2 p){return .55*nz(p)+.3*nz(p*2.07+7.3)+.15*nz(p*4.31+13.1);}`;
const NB3D_PL={value:new THREE.Vector4(-99,-99,-99,-99)};
const NB3D_DIST={value:[0,1,2,3].map(()=>new THREE.Vector4(-99,-99,1,0))},NB3D_DL=[];
const NB3D2={cine:null,ringT:0,boltShadow:0,windK:{value:.05},refl:null};
// --- warstwy przy ziemi: mgla (dwie warstwy) i cienie chmur; plaszczyzny jada z kamera, wzor jest przypiety do swiata (nie plywa)
function nb3dLayer(y,order,frag,blend){const g=new THREE.PlaneGeometry(70,56);g.rotateX(-Math.PI/2);
 const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:false,blending:blend||THREE.NormalBlending,uniforms:{uT:{value:0},uC:{value:new THREE.Color()},uA:{value:0},uCen:{value:new THREE.Vector2()},uP:NB3D_PL,uD:NB3D_DIST},
  vertexShader:'varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader:'uniform float uT;uniform vec3 uC;uniform float uA;uniform vec2 uCen;uniform vec4 uP;uniform vec4 uD[4];varying vec3 vW;'+NB3D_NZ+'void main(){float edge=(1.-smoothstep(20.,30.,length(vW.xz-uCen)))*smoothstep(.9,2.4,length(vW.xz-uP.xy))*smoothstep(.9,2.4,length(vW.xz-uP.zw));for(int i=0;i<4;i++){vec4 d=uD[i];edge*=1.-d.w*(1.-smoothstep(d.z*.35,d.z,length(vW.xz-d.xy)));}'+frag+'}'});
 const m=new THREE.Mesh(g,mat);m.position.y=y;m.renderOrder=order;m.frustumCulled=false;m.visible=false;scene.add(m);return m}
const NB3D_FOG=[nb3dLayer(.32,5,'vec2 p=vW.xz*.11+vec2(uT*.045,uT*.016);float n=fbm(p);gl_FragColor=vec4(uC,smoothstep(.34,.8,n)*uA*edge);'),
 nb3dLayer(.85,5,'vec2 p=vW.xz*.07+vec2(-uT*.03,uT*.021);float n=fbm(p+3.7);gl_FragColor=vec4(uC,smoothstep(.48,.9,n)*uA*.75*edge);')];
const NB3D_CLOUD=nb3dLayer(.042,1,'vec2 p=vW.xz*.035+vec2(uT*.012,uT*.006);float n=fbm(p);gl_FragColor=vec4(.01,.012,.02,smoothstep(.4,.7,n)*uA*edge);');
const NB3D_FOGK={1:.4,2:.14,3:.24,4:.5,5:.2,6:.4,9:.26},NB3D_CLOUDK={1:.55,3:.4,4:.58,6:.55};
// --- odbicia swiatel: smuga od zrodla w strone kamery, drga jak fala; tylko na mapach z deszczem (mokra ziemia) i nad woda portu
const NB3D_REFL=(()=>{const g=new THREE.PlaneGeometry(1,1);g.translate(0,.5,0);g.rotateX(Math.PI/2);
 const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,uniforms:{uT:{value:0},uI:{value:.5}},
  vertexShader:'varying vec2 vU;varying vec3 vC;varying vec3 vW;void main(){vU=uv;vC=vec3(1.);\n#ifdef USE_INSTANCING_COLOR\nvC=instanceColor;\n#endif\nvec4 p=vec4(position,1.);\n#ifdef USE_INSTANCING\np=instanceMatrix*p;\n#endif\nvec4 w=modelMatrix*p;vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader:'uniform float uT;uniform float uI;varying vec2 vU;varying vec3 vC;varying vec3 vW;'+NB3D_NZ+'void main(){float y=vU.y;float x=abs(vU.x-.5)*2.;float wob=nz(vec2(vW.z*3.1-uT*1.7,vW.x*.7));float w=mix(.95,.45,y)*(.75+.5*wob);float body=(1.-smoothstep(w*.35,w,x))*pow(1.-y,1.15)*smoothstep(0.,.06,y);float band=.55+.45*sin(vW.z*14.+uT*4.+wob*6.);gl_FragColor=vec4(vC*body*band*uI,1.);}'});
 const m=new THREE.InstancedMesh(g,mat,48);m.frustumCulled=false;m.renderOrder=3;for(let i=0;i<48;i++)m.setColorAt(i,WHITE_C);m.count=0;scene.add(m);return m})();
// --- kregi deszczu na wodzie portu (kaluze maja swoje od 9.11)
const NB3D_RING=(()=>{const g=new THREE.PlaneGeometry(1,1);g.rotateX(-Math.PI/2);
 const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending,uniforms:{},
  vertexShader:'varying vec2 vU;varying float vA;void main(){vU=uv;vA=0.;\n#ifdef USE_INSTANCING_COLOR\nvA=instanceColor.r;\n#endif\nvec4 p=vec4(position,1.);\n#ifdef USE_INSTANCING\np=instanceMatrix*p;\n#endif\ngl_Position=projectionMatrix*viewMatrix*modelMatrix*p;}',
  fragmentShader:'varying vec2 vU;varying float vA;void main(){float d=length(vU-.5)*2.;float r=vA;float ring=smoothstep(r-.12,r,d)*(1.-smoothstep(r,r+.05,d));float r2=r*.6;ring+=.5*smoothstep(r2-.1,r2,d)*(1.-smoothstep(r2,r2+.04,d));gl_FragColor=vec4(vec3(.42,.5,.6)*ring*(1.-vA)*.55,1.);}'});
 const m=new THREE.InstancedMesh(g,mat,40);m.frustumCulled=false;m.renderOrder=3;for(let i=0;i<40;i++)m.setColorAt(i,WHITE_C);m.count=0;scene.add(m);return {m,list:[]}})();
// --- reflektor Zakonu: snop z latarni kogi omiata nabrzeze (tylko port)
const NB3D_BEAM=(()=>{const m=new THREE.Mesh(NB3D_CONE,nb3dShaftMat(.5));m.frustumCulled=false;m.renderOrder=6;m.visible=false;scene.add(m);
 const spot=new THREE.Mesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:glowC('#cfdcff'),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.35,fog:false}));spot.visible=false;spot.renderOrder=3;scene.add(spot);return {m,spot,p:new THREE.Vector3(),on:false}})();
// --- wiatr: kolysanie trzcin (i innych pojedynczych roslin), mocniej w czasie naporu
function nb3dSwayMat(m){if(!m||m.userData.nbWind)return;m.userData.nbWind=1;const prev=m.onBeforeCompile,pk=m.customProgramCacheKey?m.customProgramCacheKey():'';
 m.onBeforeCompile=(sh,r)=>{if(prev)prev.call(m,sh,r);sh.uniforms.uSway=SWAY;sh.uniforms.uWind=NB3D2.windK;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nuniform float uSway;uniform float uWind;').replace('#include <begin_vertex>','#include <begin_vertex>\n{float ph=modelMatrix[3].x*.73+modelMatrix[3].z*.51;float hg=clamp(position.y/1.3,0.,1.);transformed.x+=(sin(uSway*1.9+ph)*.65+sin(uSway*.71+ph*1.7)*.35)*uWind*hg*hg/max(abs(modelMatrix[0][0]),.2);}')};
 m.customProgramCacheKey=()=>pk+'|nbwind';m.needsUpdate=true}
// --- cieply kontur od strony ognia na postaciach (rozszerza moonRim): wspolne uniformy dla wszystkich klatek
const NB3D_FIRE={p:{value:[0,1,2,3].map(()=>new THREE.Vector4(0,0,0,0))},c:{value:[0,1,2,3].map(()=>new THREE.Color())},r:{value:[1,1,1,1]},k:{value:0}};
// --- najazd kamery na bossa
function nb3dCine(e){if(!NB3D_ON||!SETT.shake||!e)return;NB3D2.cine={t:0,len:2.1,x:e.x/16,z:e.y/16}}
function nb3dCineT(dt,tx,tz){const c=NB3D2.cine;if(!c)return [tx,tz,1];c.t+=dt;if(c.t>=c.len){NB3D2.cine=null;return [tx,tz,1]}
 const w=c.t<.45?c.t/.45:c.t>c.len-.6?(c.len-c.t)/.6:1,e=w*w*(3-2*w)*.62;return [tx+(c.x-tx)*e,tz+(c.z-tz)*e,1-.2*e]}
// --- noc: ksiezyc wedruje, polnoc ciemniejsza, przed switem chlodniej (mnoznik swiatla otoczenia; balans bez zmian)
function nb3dNight(){if(!NB3D_ON||!S||S.dg){moon.position.set(-6,14,-10);return}const f=Math.min(1,Math.max(0,S.t/NIGHT)),a=-1.15+2.3*f;moon.position.set(Math.sin(a)*13,14-4*Math.abs(Math.sin(a)),-10+Math.cos(a)*3);
 if(S.phase!=='play'||S.opening)return;const mid=Math.exp(-Math.pow((S.t-BREAK_AT)/170,2)),late=Math.max(0,Math.min(1,(S.t-(NIGHT-160))/160));
 amb.intensity*=1-.13*mid+.06*late;hemi.intensity*=1-.15*mid+.1*late;if(late>0)amb.color.lerp(TMPC.setHex(0xa8b8dc),.22*late)}
// --- wspolna klatka dla wszystkich efektow tej rundy (wolana z nb3dTick)
function nb3dTick2(dt){{const a=S&&pl&&!pl.dead?pl:null,b=S&&pl2&&!pl2.dead?pl2:null;NB3D_PL.value.set(a?a.x/16:-99,a?a.y/16:-99,b?b.x/16:-99,b?b.y/16:-99)}const T=clock%1000,play=!!S&&S.phase==='play',fx=NB3D_ON&&GFX.fx>0,cen=camTarget;
 // wiatr
 NB3D2.windK.value+=((NB3D_ON?(S&&surgeOn()?.13:.055):0)-NB3D2.windK.value)*Math.min(1,dt*.8);
 // mgla i chmury
 const fk=fx?(NB3D_FOGK[S&&S.dg?9:CH]||0):0,ck=fx&&!(S&&S.dg)?(NB3D_CLOUDK[CH]||0):0;
 for(const m of NB3D_FOG){m.visible=fk>0;if(!m.visible)continue;m.position.x=cen.x;m.position.z=cen.z;const u=m.material.uniforms;u.uT.value=T;u.uA.value=fk;u.uCen.value.set(cen.x,cen.z);u.uC.value.copy(scene.fog.color).lerp(TMPC.setHex(ATM[CH]?ATM[CH].mc||0xb8c4dd:0xb8c4dd),.55).multiplyScalar(1.15)}
 NB3D_CLOUD.visible=ck>0;if(ck>0){NB3D_CLOUD.position.x=cen.x;NB3D_CLOUD.position.z=cen.z;const u=NB3D_CLOUD.material.uniforms;u.uT.value=T;u.uA.value=ck;u.uCen.value.set(cen.x,cen.z)}
 // odbicia swiatel (deszcz: rozdzial I i port)
 const wet=fx&&(CH===1||CH===PORT)&&!(S&&S.dg);let n=0;
 if(wet){NB3D_REFL.material.uniforms.uT.value=T;const add=(x,y,z,col,k)=>{if(n>=48)return;const h=Math.max(.2,y),len=1.4+h*1.5,w=.42+h*.18;NB3D_M.compose(NB3D_V.set(x,.06,z+h*.45),NB3D_Q.identity(),NB3D_S.set(w,1,len));NB3D_REFL.setMatrixAt(n,NB3D_M);NB3D_C.setHex(col).multiplyScalar(Math.min(1.5,k));NB3D_REFL.setColorAt(n,NB3D_C);n++};
  for(const L of LSRC){if(L.kind!=='fire'||!(L.k>0)||L.d>22)continue;add(L.x,L.y,L.z,L.col,L.k/(L.base||1))}
  for(const L of NB3D.dyn)add(L.x,L.y,L.z,L.col,L.k*.6)}
 NB3D_REFL.count=n;NB3D_REFL.instanceMatrix.needsUpdate=true;if(NB3D_REFL.instanceColor)NB3D_REFL.instanceColor.needsUpdate=true;
 // kregi deszczu na wodzie portu
 const R=NB3D_RING,rain=fx&&(CH===PORT&&W&&W.waters&&W.waters.length||CH===1)&&!(S&&S.dg);let rc=0;
 if(rain){NB3D2.ringT+=CH===PORT?dt*26:0;while(NB3D2.ringT>1&&R.list.length<40){NB3D2.ringT--;for(let k=0;k<6;k++){const t=W.waters[(Math.random()*W.waters.length)|0];if(Math.abs(t[0]+.5-cen.x)<17&&Math.abs(t[1]+.5-cen.z)<13){R.list.push({x:t[0]+Math.random(),z:t[1]+Math.random(),a:0,s:.5+Math.random()*.6});break}}}if(NB3D2.ringT>1)NB3D2.ringT=1;
  for(let i=R.list.length-1;i>=0;i--){const r=R.list[i];r.a+=dt/.85;if(r.a>=1){R.list.splice(i,1);continue}NB3D_M.compose(NB3D_V.set(r.x,r.y!==undefined?r.y:-.165,r.z),NB3D_Q.identity(),NB3D_S.set(r.s,1,r.s));R.m.setMatrixAt(rc,NB3D_M);NB3D_C.setRGB(r.a,0,0);R.m.setColorAt(rc,NB3D_C);rc++}}else R.list.length=0;
 R.m.count=rc;R.m.instanceMatrix.needsUpdate=true;if(R.m.instanceColor)R.m.instanceColor.needsUpdate=true;
 // reflektor Zakonu
 const B=NB3D_BEAM;B.on=fx&&CH===PORT&&!!(W&&W.portLamp)&&!(S&&S.dg);B.m.visible=B.spot.visible=B.on;
 if(B.on){const [lx,ly,lz]=W.portLamp,t=clock;B.p.set(lx-13+Math.sin(t*.19)*17,0,lz+8.5+Math.sin(t*.37+1)*4.5);const top=NB3D_V.set(lx,ly,lz),d=top.clone().sub(B.p),len=d.length();
  B.m.position.copy(top);B.m.quaternion.setFromUnitVectors(UP,d.normalize());B.m.scale.set(1.9,len,1.9);B.m.material.uniforms.uT.value=T;
  B.spot.position.set(B.p.x,.07,B.p.z);B.spot.scale.set(5.2,1,4.2)}
 // cieply kontur postaci: cztery najsilniejsze ognie przy kamerze
 const FK=NB3D_FIRE;FK.k.value=NB3D_ON?.5:0;/* 19.11.2026: slabiej i z limitem (Zabojczyni sie wybielala) */for(let i=0;i<4;i++){const L=NB3D.lights[i];if(L&&L.kind!=='zone'){FK.p.value[i].set(L.x,L.y,L.z,L.k);FK.c.value[i].setHex(L.col);FK.r.value[i]=L.dist*1.25}else FK.p.value[i].w=0}
 // dlugie cienie przy blysku: od ksiezyca, dla rekwizytow w poblizu kamery
 NB3D2.boltShadow=NB3D_ON&&S&&SETT.flash?S.flash||0:0;
 if(NB3D2.boltShadow>.05&&PROPS){NB3D_DIR.copy(moon.position).normalize();for(const p of PROPS){if(Math.abs(p.x-cen.x)>16||Math.abs(p.y-cen.z)>12)continue;nb3dBoltShadow(p.x,p.y-.15,p.tree?1.6:1.1)}}
 else if(PROPS&&nb3dMoonOn()){for(const p of PROPS){if(Math.abs(p.x-cen.x)>16||Math.abs(p.y-cen.z)>12)continue;nb3dMoonShadow(p.x,p.y-.15,p.tree?1.7:1.15,.3)}}
 try{nb3dSteps(dt)}catch(e){}}
function nb3dBoltShadow(x,z,s){if(NB3D.si>=1190)return;const k=NB3D2.boltShadow,ln=Math.min(7,s*4.2);NB3D_E.set(0,Math.atan2(NB3D_DIR.x,NB3D_DIR.z),0);NB3D_Q.setFromEuler(NB3D_E);NB3D_M.compose(NB3D_V.set(x,.037,z),NB3D_Q,NB3D_S.set(s*.8,1,ln));NB3D_LSH.setMatrixAt(NB3D.si,NB3D_M);NB3D_C.setRGB(Math.min(.8,k*.9),0,0);NB3D_LSH.setColorAt(NB3D.si,NB3D_C);NB3D.si++}
// ===== 19.11.2026 (runda oprawa-3, autor: "lecimy na pelnej"): odbicia postaci na mokrej ziemi, staly cien od ksiezyca, rozbryzgi krokow w deszczu =====
// Odbicie = plaska, odwrocona kopia klatki postaci polozona na ziemi w strone kamery, z falowaniem; tylko bohaterowie i do 10 najblizszych wrogow (malo rysowania).
const NB3D_REFL_GEO=(()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,1,0,0,0,0,1,1,0,1],3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,0,1,1,1],2));g.setIndex([0,2,1,1,2,3]);return g})();
const NB3D_RFS=[];for(let i=0;i<12;i++){const m=new THREE.Mesh(NB3D_REFL_GEO,new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:false,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,uniforms:{map:{value:null},uT:{value:0},uA:{value:0}},
 vertexShader:'varying vec2 vU;varying vec3 vW;void main(){vU=uv;vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
 fragmentShader:'uniform sampler2D map;uniform float uT;uniform float uA;varying vec2 vU;varying vec3 vW;void main(){float v=vU.y;vec2 uv=vec2(vU.x+sin(v*24.+uT*3.3+vW.z*3.)*.014*v+sin(vW.x*7.+uT*2.)*.004,v);vec4 t=texture2D(map,uv);if(t.a<.45)discard;float a=uA*pow(1.-v,1.05)*smoothstep(0.,.05,v)*(.82+.18*sin(vW.z*16.-uT*5.));gl_FragColor=vec4(t.rgb*vec3(.62,.7,.84),a);}'}));
 m.frustumCulled=false;m.renderOrder=2;m.visible=false;scene.add(m);NB3D_RFS.push(m)}
const NB3D_REFL_K={1:.62,6:.68};
function nb3dReflOne(i,src,a){const m=NB3D_RFS[i];if(!src||!src.visible||!src.material||!src.material.map||!src.geometry){m.visible=false;return}const g=src.geometry;if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox,sx=src.scale.x,sy=Math.abs(src.scale.y),k=sy/Math.tan(PITCH);
 m.position.set(src.position.x+bb.min.x*sx,.045,src.position.z+Math.max(0,bb.min.y)*k);m.scale.set((bb.max.x-bb.min.x)*sx,1,(bb.max.y-Math.max(0,bb.min.y))*k);const u=m.material.uniforms;u.map.value=src.material.map;u.uT.value=clock%1000;u.uA.value=a;m.visible=true}
function nb3dRefl(){const k=NB3D_ON&&GFX.fx>0&&S&&!S.dg?(NB3D_REFL_K[CH]||0):0;let n=0;
 if(k>0){if(heroMesh&&pl&&!pl.dead)nb3dReflOne(n++,heroMesh,k);if(typeof mesh2!=='undefined'&&mesh2&&pl2&&!pl2.dead)nb3dReflOne(n++,mesh2,k);
  const cx=camTarget.x*16,cz=camTarget.z*16,L=[];for(const e of S.enemies){if(e.dead||!e.mesh||!e.mesh.visible)continue;const d=Math.abs(e.x-cx)+Math.abs(e.y-cz);if(d<300)L.push([d,e])}L.sort((a,b)=>a[0]-b[0]);
  for(const [,e] of L){if(n>=12)break;nb3dReflOne(n++,e.mesh,k*.85)}}
 for(;n<12;n++)NB3D_RFS[n].visible=false}
// --- staly cien od ksiezyca (slaby, miekki, obraca sie z wedrujacym ksiezycem); mapy pod niebem
function nb3dMoonOn(){return NB3D_ON&&S&&!S.dg&&!!NB3D_MOON_CH[CH]}
function nb3dMoonShadow(x,z,s,k){if(NB3D.si>=1190)return;NB3D_DIR.copy(moon.position).normalize();const ln=Math.min(4.2,s*2.4);NB3D_E.set(0,Math.atan2(NB3D_DIR.x,NB3D_DIR.z),0);NB3D_Q.setFromEuler(NB3D_E);NB3D_M.compose(NB3D_V.set(x,.035,z),NB3D_Q,NB3D_S.set(s*.75,1,ln));NB3D_LSH.setMatrixAt(NB3D.si,NB3D_M);NB3D_C.setRGB(k,0,0);NB3D_LSH.setColorAt(NB3D.si,NB3D_C);NB3D.si++}
// --- rozbryzgi: kroki w deszczu zostawiaja male kregi (rozdzial I i port)
const NB3D_STEP=new Map();
function nb3dSteps(dt){if(!NB3D_ON||GFX.fx<=0||!S||S.dg||!(CH===1||CH===PORT))return;for(const p of [pl,pl2]){if(!p||p.dead||!p.moving)continue;let t=(NB3D_STEP.get(p)||0)-dt;if(t<=0){t=.27;const R=NB3D_RING.list;if(R.length<40)R.push({x:p.x/16+(Math.random()-.5)*.3,z:p.y/16+.1+(Math.random()-.5)*.2,a:0,s:.32+Math.random()*.2,y:.04})}NB3D_STEP.set(p,t)}}
// ===== 19.11.2026 (runda oprawa-4, autor: "rob wszystko") =====
// deszcz 3D (smugi liczone na karcie graficznej, swieca przy latarniach), mgla rozstepuje sie przy ciosach/przewrotach/wybuchach, aberracja przy mocnych trafieniach,
// swiecace ostrze (Plonace/Lodowe ostrze), piana fal przy nabrzezu portu, kamera lekko wyprzedza ruch, blysk swiatla przy smierci wroga. Tylko wyglad.
const NB3D_RAIN=(()=>{const N=1100,g=new THREE.InstancedBufferGeometry();g.copy(new THREE.PlaneGeometry(1,1).translate(0,.5,0));g.instanceCount=N;g._maxInstanceCount=N;const off=new Float32Array(N*4);
 for(let i=0;i<N;i++){off[i*4]=Math.random()*34;off[i*4+1]=Math.random()*13;off[i*4+2]=Math.random()*26;off[i*4+3]=13+Math.random()*8}g.setAttribute('aOff',new THREE.InstancedBufferAttribute(off,4));
 const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:false,blending:THREE.AdditiveBlending,uniforms:{uT:{value:0},uCam:{value:new THREE.Vector3()},uA:{value:0},uFireP:NB3D_FIRE.p,uFireC:NB3D_FIRE.c,uFireR:NB3D_FIRE.r},
  vertexShader:'attribute vec4 aOff;uniform float uT;uniform vec3 uCam;varying vec2 vU;varying vec3 vW;void main(){vU=uv;float fall=uT*aOff.w;vec3 c;c.x=uCam.x-17.+mod(aOff.x-uCam.x+17.-fall*.12,34.);c.y=mod(aOff.y-fall,13.);c.z=uCam.z-13.+mod(aOff.z-uCam.z+13.,26.);vec3 p=c+vec3(position.x*.022-position.y*.09,position.y*.62,0.);vec4 w=modelMatrix*vec4(p,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader:'uniform float uA;uniform vec4 uFireP[4];uniform vec3 uFireC[4];uniform float uFireR[4];varying vec2 vU;varying vec3 vW;void main(){float a=smoothstep(0.,.25,vU.y)*(1.-smoothstep(.75,1.,vU.y))*(1.-abs(vU.x-.5)*2.);vec3 col=vec3(.42,.48,.6);for(int i=0;i<4;i++){vec4 L=uFireP[i];if(L.w<=0.)continue;float d=length(vW-L.xyz);col+=uFireC[i]*L.w*1.6*max(0.,1.-d/(uFireR[i]*.8));}gl_FragColor=vec4(col*a*uA,1.);}'});
 const m=new THREE.Mesh(g,mat);m.frustumCulled=false;m.renderOrder=7;m.visible=false;scene.add(m);return m})();
function nb3dDisturb(x,z,r,k){if(!NB3D_ON)return;if(NB3D_DL.length>=4)NB3D_DL.shift();NB3D_DL.push({x,z,r,k,t:0})}
const NB3D_FX={ca:0,lead:new THREE.Vector2(),deaths:0};
function nb3dKill(e){if(!NB3D_ON||!e)return;const d=Math.hypot(e.x/16-camTarget.x,e.y/16-camTarget.z);if(d>15)return;let n=0;for(const b of NB3D.bursts)if(b.k<2)n++;if(n<3||e.mini||bossBar(e))nb3dBurst(e.x,e.y,0xff9a4a,bossBar(e)?3:e.mini?2:1.1,bossBar(e)?8:4.5,bossBar(e)?.7:.32);nb3dDisturb(e.x/16,e.y/16,bossBar(e)?5:e.mini?3:1.6,1);if(SETT.shake&&(e.mini||BIG.has(e.type)||bossBar(e)))NB3D_FX.ca=Math.max(NB3D_FX.ca,bossBar(e)?1:.7)}
// piana fal przy nabrzezu (port): pasy na granicy wody, pulsuja jak fale
function nb3dFoam(list){if(!NB3D_ON||!list||!list.length)return null;const g=new THREE.PlaneGeometry(1,1);g.rotateX(-Math.PI/2);
 const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,fog:false,uniforms:{uT:{value:0}},
  vertexShader:'varying vec2 vU;varying vec3 vW;void main(){vU=uv;vec4 p=vec4(position,1.);\n#ifdef USE_INSTANCING\np=instanceMatrix*p;\n#endif\nvec4 w=modelMatrix*p;vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader:'uniform float uT;varying vec2 vU;varying vec3 vW;'+NB3D_NZ+'void main(){float wave=.5+.5*sin(uT*1.7+vW.x*1.3+vW.z*1.1);float reach=.16+.3*wave;float y=vU.y;float band=(1.-smoothstep(reach-.22,reach,y))*smoothstep(0.,.05,y);float n=fbm(vec2(vW.x*3.+uT*.4,vW.z*3.-uT*.3));float a=band*smoothstep(.4,.75,n+wave*.2)*.3;gl_FragColor=vec4(vec3(.78,.84,.88),a);}'});
 const m=new THREE.InstancedMesh(g,mat,list.length),M=new THREE.Matrix4(),Q=new THREE.Quaternion();
 list.forEach(([x,z,ang],i)=>{Q.setFromAxisAngle(UP,ang);M.compose(new THREE.Vector3(x,-.165,z),Q,new THREE.Vector3(1.02,1,.75));m.setMatrixAt(i,M)});m.frustumCulled=false;m.renderOrder=9;return m}
function nb3dTick4(dt){const fx=NB3D_ON&&GFX.fx>0;
 // deszcz 3D
 const rk=fx&&!(S&&S.dg)&&(CH===1||CH===PORT)?(CH===PORT?.55:.7):0;NB3D_RAIN.visible=rk>0;if(rk>0){const u=NB3D_RAIN.material.uniforms;u.uT.value=clock%600;u.uCam.value.copy(camTarget);u.uA.value=rk}
 // mgla: zaklocenia (ciosy, przewroty, wybuchy) wygasaja w ok. 1,5 s
 for(const p of [pl,pl2])if(p&&!p.dead&&S&&p.roll>0&&Math.random()<dt*14)nb3dDisturb(p.x/16,p.y/16,1.7,.8);
 for(let i=NB3D_DL.length-1;i>=0;i--){const d=NB3D_DL[i];d.t+=dt;if(d.t>1.6)NB3D_DL.splice(i,1)}
 for(let i=0;i<4;i++){const d=NB3D_DL[i],v=NB3D_DIST.value[i];if(d){const f=Math.sin(Math.min(1,d.t/1.6)*Math.PI);v.set(d.x,d.z,d.r*(.6+d.t*.5),d.k*f)}else v.set(-99,-99,1,0)}
 // aberracja przy mocnych trafieniach
 NB3D_FX.ca=Math.max(0,NB3D_FX.ca-dt*2.6);if(S&&S.hitstop>0&&SETT.shake)NB3D_FX.ca=Math.max(NB3D_FX.ca,.45);
 // piana fal
 if(W&&W.foam)W.foam.material.uniforms.uT.value=clock%1000}
