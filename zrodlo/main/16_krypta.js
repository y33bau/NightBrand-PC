/* ============ THE CRYPT: a random dungeon under the Brzeźnica graveyard (once per night, before midnight) ============ */
const DG_T1=['possessed','madman','ghoul','hound','dwarf','bat','wolf','strzygon'],DG_T2=['bandit','monk','xbow','zmora','drowner'],DG_BOSS=['boss','beast','leszy','strzyga'];
const DG_BOSS_MSG={boss:(EN?'Bones spill across the floor. Among them the Grave Conjoined rises.':'Kości osypują się na posadzkę. Między nimi podnosi się Zrost Grobowy.'),beast:(EN?'A winged shadow tears loose from the vault. The Echo of Morhad.':'Spod sklepienia odrywa się skrzydlaty cień. Echo Morhada.'),
  leszy:(EN?'Roots force apart the stone slabs. The Echo of Leshy grows out of them.':'Korzenie rozpychają kamienne płyty. Wyrasta z nich Echo Leszego.'),strzyga:(EN?'Two hearts beat beneath the lid. The Echo of Mother Striga climbs out of the sarcophagus.':'Spod wieka słychać dwa serca. Z sarkofagu wychodzi Echo Strzygi Matki.')};
const DG_TITLES={boss:['Zrost Grobowy','','Grave Conjoined',''],beast:['Echo Morhada','Cień Rzezi','Echo of Morhad','Shadow of Slaughter'],leszy:['Echo Leszego','Cień Kniei','Echo of Leshy','Shadow of the Wilds'],strzyga:['Echo Strzygi','Cień Kurhanów','Echo of the Striga','Shadow of the Barrows']};
const DG_PHASE={beast:(EN?'The Echo spreads its wings. Their shadow reaches the vault.':'Echo rozkłada skrzydła. Ich cień sięga sklepienia.'),strzyga1:(EN?'The first heart falls silent.':'Pierwsze serce milknie.'),strzyga2:(EN?'The second beats faster. The Echo moves on all fours.':'Drugie bije szybciej. Echo rusza na czworakach.')};
const DG_END={boss:(EN?'The bones fall apart one by one. None bears a trace of fire.':'Kości rozsypują się osobno. Na żadnej nie ma śladu ognia.'),beast:(EN?'The Echo of Morhad vanishes. One last time, someone is heard losing count.':'Echo Morhada znika. Po raz ostatni słychać, jak ktoś myli się w liczeniu.'),
  leszy:(EN?'The roots crumble between the slabs. The shadow of antlers fades.':'Korzenie kruszą się między płytami. Cień poroża gaśnie.'),strzyga:(EN?'The second beat breaks off. A handful of dust is left in the sarcophagus.':'Urywa się drugie bicie. W sarkofagu zostaje garść pyłu.')};
function releaseWorld(ch){const old=WORLDS[ch];if(!old)return;scene.remove(old.group);const keep=new Set([geo32,geo64,geoC,geoT,geo64w,floorGeo,groundFxGeo,groundShadowMat,groundGlowMat,groundGlowTex,haloGeo,haloMat,coreMat,waterTex,lavaTex]),seen=new Set();const remember=v=>{if(!v||typeof v!=='object'||seen.has(v))return;seen.add(v);if(v.isMaterial){keep.add(v);for(const x of Object.values(v))if(x&&x.isTexture)keep.add(x)}else if(Array.isArray(v))v.forEach(remember);else if(!v.isTexture)Object.values(v).forEach(remember)};remember(A);for(const [k,w] of Object.entries(WORLDS))if(+k!==ch)w.group.traverse(o=>{if(o.geometry){keep.add(o.geometry);if(o.geometry.userData&&o.geometry.userData.chunkBase)keep.add(o.geometry.userData.chunkBase)}for(const m of [].concat(o.material||[])){keep.add(m);for(const v of Object.values(m))if(v&&v.isTexture)keep.add(v)}});const resources=new Set(),views=[];old.group.traverse(o=>{if(o.geometry){const b=o.geometry.userData&&o.geometry.userData.chunkBase;if(b){views.push(o.geometry);resources.add(b)}else resources.add(o.geometry)}for(const m of [].concat(o.material||[],o.customDistanceMaterial||[],o.customDepthMaterial||[])){resources.add(m);for(const v of Object.values(m))if(v&&v.isTexture)resources.add(v)}});for(const v of views)if(!keep.has(v.userData.chunkBase))v.dispose();/* 23.11.2026: widok kawalka zwalniany tylko razem z baza (inaczej skasowalby bufory wspolne z innym swiatem) */for(const r of resources)if(!keep.has(r)&&r.dispose)r.dispose();old.group.clear();delete WORLDS[ch]}
function releaseDungeon(){releaseWorld(9)}
function makeDungeon(){releaseDungeon();initWorld(9);useWorld(9);ROOT=W.group;buildDungeon(IMGS);fitWorldProps(W,9);finishWorldArt(W);ROOT=scene;buildMini()}
// everything lying around belongs to the level we leave; coins on the ground are picked up on the way
function stashEntities(){if(pl2)asP2(clearSwordTransient);clearSwordTransient();S.swordTrails=[];for(const p of S.picks)if(p.k==='c'){if(p.returned)S.coins+=p.v||1;else awardCoins(p.v||1)}
  for(const m of [...S.enemies.map(e=>e.mesh),...S.picks.flatMap(p=>[p.mesh,p.glow]),...S.vfx.map(f=>f.mesh),...S.corpses.map(c=>c.mesh),...S.zones.map(z=>z.mesh),...(S.eproj||[]).map(f=>f.mesh)])if(m)scene.remove(m);
  for(const c of S.corpses)if(c.own)c.mesh.material.dispose();S.enemies=[];S.picks=[];S.vfx=[];S.waves=[];S.corpses=[];S.zones=[];S.eproj=[];S.quakes=[];S.delayed=[];S.parts=[];S.leszy=null;S.collector=null;S.merchant=null;
  for(const g of S.golems){g.x=pl.x+rnd(-10,10);g.y=pl.y+rnd(-6,6)}
  Object.assign(pl,{roll:0,swingT:0,inv:1,atk:null,block:false,charging:false,atkHeld:false});camTarget.set(pl.x/16,0,pl.y/16)}
function enterDungeon(){play('doorIn',0);const fog=canvas(MW,MH);fog.getContext('2d').drawImage(MINI.fog,0,0);const dec=canvas(WW,WH);dec.getContext('2d').drawImage(decalC,0,0);
  S.dgBack={x:W.crypt.x,y:W.crypt.y+12,shr:S.shr,fog,dec};
  makeDungeon();pl.x=START.x;pl.y=START.y;stashEntities();
  S.shr=W.shrines.map(()=>60);S.dg={done:false,boss:null,margaT:0};
  dg.clearRect(0,0,WW,WH);decalDirty=true;resetFog();MINI.t=0;lastHud='';
  populateDungeon();play('rumble',0);shake(.15,.6);padRumble(.5,.7,700);
  say((EN?'Under the cemetery, time stops. A single bell tone drifts down from above and does not fade. The Night has kept the echoes of those who serve the Pact here. In the depths of the crypt, one of them stirs.':'Pod cmentarzem czas staje. Z góry dolatuje jeden dźwięk dzwonu i już nie cichnie. Noc zachowała tu echa tych, którzy służą Paktowi. W głębi krypty porusza się jedno z takich ech.'))}
function exitDungeon(){play('doorOut',0);const b=S.dgBack,done=S.dg&&S.dg.done;useWorld(1);pl.x=b.x;pl.y=b.y;stashEntities();S.shr=b.shr;
  const fg=MINI.fog.getContext('2d');fg.globalCompositeOperation='source-over';fg.clearRect(0,0,MW,MH);fg.drawImage(b.fog,0,0);
  dg.clearRect(0,0,WW,WH);dg.drawImage(b.dec,0,0);decalDirty=true;
  S.dg=null;S.dgBack=null;S.dgDone=true;S.spawnT=1.5;lastHud='';play('rumble',0);
  say(done?(EN?'You return to the surface with your spoils. The stairs collapse behind you.':'Z łupem wracasz na powierzchnię. Schody zapadają się za tobą.'):(EN?'You make it back up. The entrance to the crypt collapses with a crash.':'Udaje ci się wrócić na górę. Wejście do krypty zapada się z łoskotem.'))}
// low dead from every chapter sleep in the crypts and wake together when you come close or hurt one of them
function populateDungeon(){const T1=DG_T1.filter(k=>A[k]&&ET[k]),T2=DG_T2.filter(k=>A[k]&&ET[k]);
  W.rooms.forEach((R,i)=>{if(R.k==='start'||R.k==='boss')return;const n=3+((Math.random()*3)|0)+(S.lvl>=8?1:0)+(R.k==='pre'?1:0);
    for(let j=0;j<n;j++){let p=null;for(let t=0;t<30&&!p;t++){const x=(R.x+1+Math.random()*(R.w-2))*TS,y=(R.y+1+Math.random()*(R.h-2))*TS;if(!boxSolid(x,y,6,4))p=[x,y]}if(!p)continue;
      const pool=Math.random()<.62||!T2.length?T1:T2,t=pool[(Math.random()*pool.length)|0];
      for(let k=0;k<(t==='bat'||t==='wolf'||t==='hound'?2:1);k++)spawnEnemy(t,p[0]+(k?rnd(-10,10):0),p[1]+(k?rnd(-6,6):0),{rise:0,sleep:1,room:i})}})}
function wakeRoom(e){for(const q of S.enemies)if(q.room===e.room)q.sleep=0}
function dungeonTick(dt){const d=S.dg;
  if(!d.boss&&!d.done){const B=W.rooms.find(R=>R.k==='boss'),tx=pl.x/TS,ty=pl.y/TS;
    if(tx>B.x+.8&&tx<B.x+B.w-.8&&ty>B.y+.8&&ty<B.y+B.h-.8){const types=DG_BOSS.filter(k=>A[k]),t=types[(Math.random()*types.length)|0],hp=bossHealth(t,.45);
      let p=null;for(let i=0;i<40&&!p;i++){const x=(B.x+B.w*(.3+Math.random()*.4))*TS,y=(B.y+B.h*(.3+Math.random()*.4))*TS;if(!boxSolid(x,y,10,4)&&Math.hypot(x-pl.x,y-pl.y)>70)p=[x,y]}
      p=p||[(B.x+B.w/2)*TS,(B.y+B.h/2)*TS];d.boss=spawnEnemy(t,p[0],p[1],{rise:1.6,hp,max:hp,dgBoss:true});play('rise',0);play('bossGrowl',0);shake(.3,1);say(DG_BOSS_MSG[t])}}
  if(d.margaT>0&&(d.margaT-=dt)<=0){let spot=null;for(let i=0;i<30&&!spot;i++){const a=Math.random()*Math.PI*2,x=pl.x+Math.cos(a)*44,y=pl.y+Math.sin(a)*30;if(!boxSolid(x,y,6,3))spot=[x,y]}
    spot=spot||[pl.x+20,pl.y];S.merchant={x:spot[0],y:spot[1],state:'in',t:1,wait:90,dg:true};play('bless',0);
    for(let i=0;i<26;i++)S.parts.push({k:'a',x:spot[0]+rnd(-8,8),y:spot[1],z:rnd(0,20),vx:rnd(-8,8),vy:0,vz:rnd(8,20),c:'#3d4a3a',life:rnd(1,2)});say((EN?'Marga steps out of the shadow between the sarcophagi and sets up her stall.':'Z cienia między sarkofagami wychodzi Marga i rozkłada kram.'))}}
function dungeonCleared(e){const d=S.dg;if(!d||d.done)return;d.done=true;d.boss=null;d.margaT=2.2;S.coins+=150;play('coin',0);play('bless',0);lastHud='';
  for(let i=0;i<40;i++){const a=Math.random()*Math.PI*2,sp=rnd(30,90);S.parts.push({k:'e',x:e.x,y:e.y,z:rnd(4,16),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*.6,vz:rnd(20,50),c:Math.random()<.6?'#e0b84a':'#fff0b0',life:rnd(.8,1.6)})}
  say((EN?'The Echo is gone. Reward: 150 coins. The stairs in the depths lead to the surface.':'Echo znika. Nagroda — 150 monet. Schody w głębi prowadzą na powierzchnię.'))}
// stairs: down into the crypt from the graveyard (before midnight, once), back up from the entrance room or, after the boss, from the boss hall
function nearExit(){if(!S||pl.dead)return null;
  if(CH===1&&W.crypt&&Math.hypot(pl.x-W.crypt.x,pl.y-W.crypt.y)<30)return{x:W.crypt.x,y:W.crypt.y-6,kind:S.dgDone||S.stage!=='p1'?'sealed':'enter'};
  if(CH===PORT&&S.solne){const st=S.solne;for(let i=0;i<2;i++){if(st.open[i])continue;const q=portWinchAt(i);if(Math.hypot(pl.x-q.x,pl.y-q.y)<34)return{x:q.x,y:q.y-12,kind:'winch',i}}
    if(portOnFerry(pl)&&S.stage==='final'&&st.bossDead&&!S.won)return{x:pl.x,y:pl.y-8,kind:st.open.every(Boolean)?'ferry':'ferryLocked'}}
  if(CH===9&&S.dg)for(const p of PROPS){if(!p.exit)continue;const x=p.x*16,y=(p.y+.5)*16;if(Math.hypot(pl.x-x,pl.y-y)<30&&(p.exit==='start'||S.dg.done))return{x,y:y-6,kind:'leave'}}
  return null}
function useExit(n){if(n.kind==='winch')return portRelease(n.i);if(n.kind==='ferry')return portDepart();if(n.kind==='ferryLocked')return say((EN?'The ferry is still chained. Check the winches at the piers.':'Prom wciąż jest przykuty. Sprawdź kołowroty przy pomostach.'));
  if(n.kind==='enter')enterDungeon();else if(n.kind==='leave')exitDungeon();
  else say(S.dgDone?(EN?'The crypt entrance has collapsed.':'Wejście do krypty zawaliło się.'):(EN?'At midnight the crypt seals shut. Try again next night.':'O północy krypta zamyka się na głucho. Spróbuj następnej nocy.'))}
