/* ============ THE CRYPT: a random dungeon under the Brzeźnica graveyard (once per night, before midnight) ============ */
const DG_T1=['possessed','madman','ghoul','hound','dwarf','bat','wolf','strzygon'],DG_T2=['bandit','monk','xbow','zmora','drowner'],DG_BOSS=['boss','beast','leszy','strzyga'];
const DG_BOSS_MSG={boss:(EN?'The Conjoined rises from a pile of bones deep in the hall, fused from the bodies buried in the crypt.':'Ze stosu kości w głębi sali wstaje Zrost, zrośnięty z ciał pogrzebanych w krypcie.'),beast:(EN?'Morhad, Beast of a Thousand Slaughters, bursts out of the crypt\'s darkness. Someone locked him in here.':'Z mroku krypty wypada Morhad, Bestia Tysiąca Rzezi. Ktoś go tu zamknął.'),
  leszy:(EN?'Roots burst through the floor. Leshy, Lord of the Wilds, has come for those who lie here.':'Korzenie rozsadzają posadzkę. Leszy, Pan Kniei, przyszedł po tych, co tu leżą.'),strzyga:(EN?'The sarcophagus lid cracks. Mother Striga, Queen of the Barrows, rises.':'Wieko sarkofagu pęka. Wstaje Strzyga Matka, Królowa Kurhanów.')};
function releaseWorld(ch){const old=WORLDS[ch];if(!old)return;scene.remove(old.group);const keep=new Set([geo32,geo64,geoC,geoT,geo64w,floorGeo,groundFxGeo,groundShadowMat,groundGlowMat,groundGlowTex,haloGeo,haloMat,coreMat,waterTex,lavaTex]),seen=new Set();const remember=v=>{if(!v||typeof v!=='object'||seen.has(v))return;seen.add(v);if(v.isMaterial){keep.add(v);for(const x of Object.values(v))if(x&&x.isTexture)keep.add(x)}else if(Array.isArray(v))v.forEach(remember);else if(!v.isTexture)Object.values(v).forEach(remember)};remember(A);for(const [k,w] of Object.entries(WORLDS))if(+k!==ch)w.group.traverse(o=>{if(o.geometry)keep.add(o.geometry);for(const m of [].concat(o.material||[])){keep.add(m);for(const v of Object.values(m))if(v&&v.isTexture)keep.add(v)}});const resources=new Set();old.group.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of [].concat(o.material||[],o.customDistanceMaterial||[],o.customDepthMaterial||[])){resources.add(m);for(const v of Object.values(m))if(v&&v.isTexture)resources.add(v)}});for(const r of resources)if(!keep.has(r)&&r.dispose)r.dispose();old.group.clear();delete WORLDS[ch]}
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
  say((EN?'You descend into the crypt beneath the cemetery. Above, the night stands still. Something awaits you in the deepest hall.':'Schodzisz do krypty pod cmentarzem. Na górze noc stoi w miejscu. W najgłębszej sali coś na ciebie czeka.'))}
function exitDungeon(){play('doorOut',0);const b=S.dgBack,done=S.dg&&S.dg.done;useWorld(1);pl.x=b.x;pl.y=b.y;stashEntities();S.shr=b.shr;
  const fg=MINI.fog.getContext('2d');fg.globalCompositeOperation='source-over';fg.clearRect(0,0,MW,MH);fg.drawImage(b.fog,0,0);
  dg.clearRect(0,0,WW,WH);dg.drawImage(b.dec,0,0);decalDirty=true;
  S.dg=null;S.dgBack=null;S.dgDone=true;S.spawnT=1.5;lastHud='';play('rumble',0);
  say(done?(EN?'You leave the crypt with a full purse. The entrance collapses behind you.':'Wychodzisz z krypty z pełną sakwą. Wejście zapada się za tobą.'):(EN?'You flee the crypt. The entrance collapses behind you.':'Uciekasz z krypty. Wejście zapada się za tobą.'))}
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
  say((EN?'The crypt falls silent. 150 coins are added to your purse. The stairs deep in the hall lead up.':'Krypta milknie. Do twojej sakwy wpada 150 monet. Schody w głębi sali prowadzą na górę.'))}
// stairs: down into the crypt from the graveyard (before midnight, once), back up from the entrance room or, after the boss, from the boss hall
function nearExit(){if(!S||pl.dead)return null;
  if(CH===1&&W.crypt&&Math.hypot(pl.x-W.crypt.x,pl.y-W.crypt.y)<30)return{x:W.crypt.x,y:W.crypt.y-6,kind:S.dgDone||S.stage!=='p1'?'sealed':'enter'};
  if(CH===PORT&&S.solne){const st=S.solne;for(let i=0;i<2;i++){if(st.open[i])continue;const q=portWinchAt(i);if(Math.hypot(pl.x-q.x,pl.y-q.y)<34)return{x:q.x,y:q.y-12,kind:'winch',i}}
    if(portOnFerry(pl)&&S.stage==='final'&&st.bossDead&&!S.won)return{x:pl.x,y:pl.y-8,kind:st.open.every(Boolean)?'ferry':'ferryLocked'}}
  if(CH===9&&S.dg)for(const p of PROPS){if(!p.exit)continue;const x=p.x*16,y=(p.y+.5)*16;if(Math.hypot(pl.x-x,pl.y-y)<30&&(p.exit==='start'||S.dg.done))return{x,y:y-6,kind:'leave'}}
  return null}
function useExit(n){if(n.kind==='winch')return portRelease(n.i);if(n.kind==='ferry')return portDepart();if(n.kind==='ferryLocked')return say((EN?'The ferry is still chained. Release both winches.':'Prom wciąż jest przykuty. Zwolnij oba kołowroty.'));
  if(n.kind==='enter')enterDungeon();else if(n.kind==='leave')exitDungeon();
  else say(S.dgDone?(EN?'The crypt entrance has collapsed.':'Wejście do krypty zawaliło się.'):(EN?'At midnight the crypt seals shut. Try again next night.':'O północy krypta zamyka się na głucho. Spróbuj następnej nocy.'))}
