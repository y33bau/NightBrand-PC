/* ============ ENEMIES ============ */
const ET={madman:{hp:22,spd:26,r:5,dmg:8,xp:1,coin:.08},hound:{hp:16,spd:33,r:5,dmg:7,xp:1,coin:.05},rotknight:{hp:120,spd:17,r:6,dmg:16,xp:5,coin:.35},monk:{hp:45,spd:20,r:5,dmg:6,xp:3,coin:.15},beast:{hp:2200,spd:21,r:14,dmg:24,xp:50,coin:1},collector:{hp:900,spd:31,r:8,dmg:12,xp:25,coin:0},possessed:{hp:20,spd:24,r:5,dmg:8,xp:1,coin:.06},knight:{hp:95,spd:19,r:6,dmg:15,xp:5,coin:.3},glizzard:{hp:560,spd:24,r:6,dmg:12,xp:22,coin:1},dwarf:{hp:26,spd:22,r:5,dmg:9,xp:1,coin:.07},ghoul:{hp:14,spd:30,r:5,dmg:6,xp:1,coin:.06},bat:{hp:6,spd:36,r:4,dmg:2,xp:1,coin:.04},warden:{hp:150,spd:15,r:7,dmg:18,xp:6,coin:.35},shieldman:{hp:48,spd:16,r:6,dmg:11,xp:3,coin:.2},goat:{hp:60,spd:27,r:7,dmg:14,xp:4,coin:.2},boss:{hp:1500,spd:14,r:13,dmg:20,xp:40,coin:1},cumlin:{hp:1900,spd:12,r:15,dmg:28,xp:40,coin:1},
  wolf:{hp:18,spd:35,r:5,dmg:7,xp:1,coin:.05},bandit:{hp:30,spd:25,r:5,dmg:10,xp:2,coin:.3},xbow:{hp:26,spd:22,r:5,dmg:5,xp:2,coin:.25},drowner:{hp:40,spd:18,r:5,dmg:9,xp:2,coin:.1},
  strzygon:{hp:28,spd:33,r:5,dmg:9,xp:2,coin:.08},zmora:{hp:34,spd:23,r:5,dmg:3,xp:2,coin:.1},wisp:{hp:3,spd:0,r:4,dmg:0,xp:0,coin:0},bies:{hp:280,spd:19,r:7,dmg:20,xp:8,coin:.6},
  wight:{hp:110,spd:17,r:6,dmg:15,xp:5,coin:.3},guard:{hp:95,spd:18,r:6,dmg:14,xp:4,coin:.25},scribe:{hp:34,spd:20,r:5,dmg:5,xp:3,coin:.25},executioner:{hp:190,spd:16,r:7,dmg:22,xp:8,coin:.5},
  debtor:{hp:60,spd:19,r:5,dmg:10,xp:3,coin:.2},wraith:{hp:36,spd:24,r:5,dmg:3,xp:3,coin:0},courtraven:{hp:12,spd:38,r:4,dmg:5,xp:1,coin:.06},paperrat:{hp:8,spd:36,r:4,dmg:4,xp:1,coin:.03},bookgolem:{hp:300,spd:13,r:8,dmg:24,xp:9,coin:.6},condemned:{hp:22,spd:22,r:5,dmg:8,xp:1,coin:.08},
  boginka:{hp:432,spd:28,r:6,dmg:14,xp:10,coin:1},leszy:{hp:1100,spd:15,r:12,dmg:16,xp:30,coin:0},strzyga:{hp:1625,spd:22,r:12,dmg:20,xp:50,coin:1},
  judge:{hp:110,spd:17,r:6,dmg:15,xp:5,coin:.3},arbiter:{hp:150,spd:16,r:7,dmg:18,xp:6,coin:.4},cursed:{hp:170,spd:15,r:7,dmg:20,xp:7,coin:.45},
  militia:{hp:60,spd:19,r:6,dmg:11,xp:3,coin:.2},marauder:{hp:135,spd:18,r:6,dmg:17,xp:6,coin:.35},gravedigger:{hp:75,spd:21,r:5,dmg:12,xp:4,coin:.25}};
// runda 233: tempo wrogow (zwykli x1,4; szybcy i lekcy x1,18; bossowie x1,15), bohater 72 -> 58 px/s
for(const k of Object.keys(ET)){const t=ET[k];if(!t.spd)continue;t.spd*=['bat','courtraven','paperrat','wolf','hound','strzygon'].includes(k)?1.18:['beast','collector','glizzard','boss','cumlin','leszy','strzyga','boginka'].includes(k)?1.15:1.4}
// 9.11.2026: plansza wejścia bossa (imię + przydomek) i spowolnienie czasu (wejście bossa, ostatni cios)
const BOSS_TITLES={'1:boss':['Zrost','Plaga Spalonej Osady','The Conjoined','Blight of the Scorched Settlement'],'5:boss':['Wierzyciel','Pan Pierwszego Wpisu','The Creditor','Lord of the First Entry'],'5:collector':['Arcysędzia Rachmistrz','Ostatnia instancja','Arch-Judge Reckoner','The Final Court'],'6:boss':['Bosman','Pan Łańcuchów','The Harbour Master','Lord of the Chains'],'collector':['Poborca Zakonu','Ten, który przychodzi o północy','Order Collector','He Who Comes at Midnight'],'boginka':['Pani Lasu','Ta, co topi we mgle','The Lady of the Forest','She Who Drowns in Mist']};
function bossTitle(e){const dgt=e.dgBoss&&DG_TITLES[e.type];if(dgt)return EN?[dgt[2],dgt[3]]:[dgt[0],dgt[1]];const t=BOSS_TITLES[CH+':'+e.type]||BOSS_TITLES[e.type];if(t)return EN?[t[2],t[3]]:[t[0],t[1]];const n=deathCauseName(e),i=n.indexOf(', ');return i>0?[n.slice(0,i),n.slice(i+2)]:[n,'']}
function slowMo(d,min){if(!S)return;S.slowD=Math.max(S.slowT>0?S.slowD:0,d);S.slowT=Math.max(S.slowT||0,d);S.slowMin=Math.min(S.slowT>0&&S.slowMin?S.slowMin:1,min)}
let BOSS_CARD_UNTIL=0;
function slowTick(dt,frozen){if(BOSS_CARD_UNTIL&&performance.now()>BOSS_CARD_UNTIL){BOSS_CARD_UNTIL=0;const c=$('bossCard');if(c){c.style.transition='opacity .6s ease';c.style.opacity='0'}}if(!S||!(S.slowT>0))return 1;if(!frozen)S.slowT-=dt;if(S.slowT<=0){S.slowT=0;S.slowMin=1;return 1}const k=S.slowT/S.slowD,m=S.slowMin;return k>.35?m:m+(1-m)*(1-k/.35)}
function bossIntro(e){if(S.dg&&!e.dgBoss)return;nb3dCine(e);const[n,t]=bossTitle(e);let c=$('bossCard');if(!c){c=document.createElement('div');c.id='bossCard';c.setAttribute('aria-live','polite');c.innerHTML='<b></b><i></i>';($('msg')&&$('msg').parentNode||document.body).appendChild(c);const st=document.createElement('style');st.textContent='#bossCard{position:absolute;left:50%;top:26%;transform:translate(-50%,-50%);z-index:40;pointer-events:none;text-align:center;opacity:0;transition:opacity .45s ease;min-width:60vw;padding:1.1em 2em;background:radial-gradient(ellipse at center,rgba(8,4,6,.82) 0%,rgba(8,4,6,.55) 45%,rgba(8,4,6,0) 72%)}#bossCard.nbbc-show{opacity:1}#bossCard b{display:block;font:700 clamp(28px,4.4vw,64px)/1.05 Georgia,serif;letter-spacing:.14em;text-transform:uppercase;color:#f0d79a;text-shadow:0 0 18px rgba(170,30,30,.75),0 3px 0 #2a0c0c}#bossCard i{display:block;margin-top:.45em;font:italic 400 clamp(15px,1.7vw,26px)/1.2 Georgia,serif;color:#d9c3a0;letter-spacing:.04em}#bossCard b:after{content:"";display:block;width:46%;height:2px;margin:.32em auto 0;background:linear-gradient(90deg,transparent,#a8322a,transparent)}';document.head.appendChild(st)}
 c.querySelector('b').textContent=n;c.querySelector('i').textContent=t;c.querySelector('i').hidden=!t;c.style.transition='none';c.style.opacity='1';BOSS_CARD_UNTIL=performance.now()+2600;slowMo(1.2,.35);padRumble(.6,.6,500)}
// Relative to the knight's standing silhouette. Keep one size throughout the animation.
// 15.11.2026: wieksza zaloga, bo nowy Rycerz jest wyzszy (200 px zamiast 168 w klatce): zwykli ok. 0,95 Rycerza, ciezcy ok. 1,1, Bosman ok. 1,35
const portSkinScale={tragarz:.93,sieciarka:.86,latarnik:.95,kalafater:1.05,krab:.62,nurek:1.02,cumownik:.92,pijawczarz:.94,muszlowy:1.06,dzwonnik:1.0,bosman:.76};// Bosman rysowany na duzej siatce bossa (64)
const PORT_NAMES={tragarz:(EN?'Salt Porter':'Tragarz soli'),sieciarka:(EN?'Net-Wife':'Sieciarka'),latarnik:(EN?'Lamplighter':'Latarnik'),kalafater:(EN?'Caulker':'Kalafater'),krab:(EN?'Strongbox Crab':'Krab skrzyniowy'),nurek:(EN?'Drowned Diver':'Topielec w skafandrze'),cumownik:(EN?'Mooring Hand':'Cumownik'),pijawczarz:(EN?'Leech-Monger':'Pijawczarz'),muszlowy:(EN?'Barnacled Castaway':'Muszlowy rozbitek'),dzwonnik:(EN?'Bellringer of the Deep':'Dzwonnik głębin'),bosman:(EN?'The Harbour Master':'Bosman')};
const portSkins=new Map();
function portEnemyArt(key){
 if(!key)return null;
 if(portSkins.has(key))return portSkins.get(key);
 let img=IMGS['port_'+key];if(!img)return null;
 const density=img.width/128;img.nbDensity=density;
 // arkusze portu sa namalowane twarza w lewo, a silnik zaklada postacie patrzace w prawo: kazda klatke odbijamy raz, przy wczytaniu
 {const cell=img.width/4,cv=document.createElement('canvas');cv.width=img.width;cv.height=img.height;const g=cv.getContext('2d');
  for(let y=0;y<img.height;y+=cell)for(let x=0;x<img.width;x+=cell){g.save();g.translate(x+cell,y);g.scale(-1,1);g.drawImage(img,x,y,cell,cell,0,0,cell,cell);g.restore()}
  cv.nbDensity=img.nbDensity;img=cv}
 const rows=Math.round(img.height/img.width*4),frames=Array.from({length:rows*4},(_,i)=>procFrame(img,(i%4)*32,(i>>2)*32,32,32,'portCrew'));
 // zaloga: 4 klatki chodu, 2 ataku, 2 smierci. Bosman (4x4): chod, hak (zamach, cios), lancuch (zamach, cios), smierc
 const skin=rows>=4?{scale:portSkinScale[key],walk:frames.slice(0,4),attack:[frames[5],frames[6]],chain:[frames[9],frames[10]],death:frames.slice(13,16)}:{scale:portSkinScale[key],walk:frames.slice(0,4),attack:frames.slice(4,6),death:frames.slice(6)};
 portSkins.set(key,skin);return skin;
}
/* 22.11.2026 (zgoda autora): zycie mobkow rosnie wolno na poczatku i coraz szybciej po polnocy: x0,6 -> x0,86 (4 min) -> x1,39 (8) -> x2,11 (12) -> x3,0 (16) */function nightHp(){return .6+2.4*Math.pow(Math.min(S.t,NIGHT)/NIGHT,1.6)}
function spawnEnemy(type,x,y,extra){{const s0=W&&shelterAt(x,y);if(s0){const d=s0.door;x=(d[0]+.5)*TS;y=(d[1]+1.7)*TS}}if((type==='xbow'||type==='monk')&&S.enemies.reduce((n,o)=>n+(!o.dead&&(o.type==='xbow'||o.type==='monk')?1:0),0)>=2)type=type==='monk'?'madman':'bandit';// max 2 strzelców naraz; reszta walczy w zwarciu
  const T=ET[type],mul=(BIG.has(type)||type==='collector'?1:nightHp()*(surgeOn()?.45:1))/* 15.11.2026: wzrost zycia liczony od ulamka nocy (koniec nocy = jak dawniej), mobki -20%, w Naporze slabsze */*S.pk.ehp*DF[DIFFK].hp*chapterHp(type);
  const e=Object.assign({type,x,y,hp:T.hp*mul,max:T.hp*mul,spd:T.spd*rnd(.9,1.1),r:T.r,dmg:T.dmg,xp:T.xp,vx:0,vy:0,flash:0,walk:Math.random()*5,s:1,ph:Math.random()*9,leap:0,lcd:2,side:Math.random()<.5?1:-1,
    frozen:0,bleed:0,bleedT:0,rise:type==='bat'?0:.5,atkA:0,slamT:4,atkT:0,dead:false},extra||{});
  if(CH===PORT){
   if(type==='boss')e.portBoss=true;
   let key=e.portBoss?'bosman':({knight:'latarnik',ghoul:'krab'})[type];
   if(type==='possessed'){S.portCrew=(S.portCrew||0)+1;key=['tragarz','sieciarka','cumownik','pijawczarz'][S.portCrew%4]}
   if(type==='shieldman'){S.portDeep=(S.portDeep||0)+1;key=['kalafater','nurek','muszlowy'][S.portDeep%3]}
   if(type==='knight'){S.portKn=(S.portKn||0)+1;key=S.portKn%2?'latarnik':'dzwonnik'}// elita: latarnik albo dzwonnik glebin z mlotem// ciezcy: mlot kalafatera i topielec w skafandrze
   e.portArt=portEnemyArt(key);e.portKey=key;
  }
  e.spd*=S.pk.espd||1;
  if(extra&&Number.isFinite(extra.hp)){e.hp=extra.hp*S.pk.ehp*DF[DIFFK].hp*chapterHp(type);e.max=(extra.max??extra.hp)*S.pk.ehp*DF[DIFFK].hp*chapterHp(type)}
  if((BIG.has(type)||type==='collector'||type==='boginka'||type==='glizzard')){e.hp*=SL.bossHp;e.max*=SL.bossHp}
  if(type==='ghoul'&&CH===1)e.lcd=4;if(type==='beast'){e.hw=7;e.cT=2.5;e.lT=3}if(type==='leszy'||type==='strzyga')e.hw=7;if(type==='cumlin')e.hw=11;
  e.mesh=new THREE.Mesh(BIG.has(type)||type==='collector'&&CH===5&&A.collectorC5?geo64:type==='bat'?geoC:geo32,A[type].walk[0].n);e.mesh.castShadow=BIG.has(type);scene.add(e.mesh);S.enemies.push(e);if(S.endless&&S.t>240&&e.hp){const g=1+(S.t-240)/360;e.hp*=g;e.max*=g;if(e.dmg)e.dmg*=1+(S.t-240)/600}if(bossBar(e)&&!(extra&&extra.noIntro))try{bossIntro(e)}catch(er){quietErr('bossIntro',er)}return e}
function ringSpot(rmin=260,rmax=320){for(let i=0;i<40;i++){const a=Math.random()*Math.PI*2,d=rnd(rmin,rmax),x=pl.x+Math.cos(a)*d,y=pl.y+Math.sin(a)*d*.75;if(x<20||y<20||x>WW-20||y>WH-20||boxSolid(x,y,6,3)||!navReach(x,y)||CH===1&&tileAt(Math.floor(x/TS),Math.floor(y/TS))===43)continue;return[x,y]}return null}
let ftCrit=false,ftHeavy=false,ftMelee=false,DSRC='';
function steelEnemy(e){return ['knight','warden','shieldman','rotknight','wight','guard','executioner','bookgolem','collector','cursed','marauder','militia'].includes(e.type)||e.type==='boss'&&CH===5||e.type==='cumlin'}
function recoilAmount(v){if(!SETT.shake||!v||v.t<=0)return 0;const p=1-v.t/v.life;return(1-p)*(1-p)*Math.cos(p*Math.PI*1.5)}
// Cosmetic particles use their own deterministic variation, without consuming gameplay randomness.
// Fixed visual-only pool: shared atlas, no RNG or gameplay state changes.
const combatEffects=[],COMBAT_FX_LIMIT=16,COMBAT_TRAIL={fireblade:'fire',iceblade:'ice',venom:'poison',bloodblade:'blood'};
function initCombatEffects(){if(combatEffects.length)return;const texture=texFrom(bloodFix(IMGS.combat_fx,896,128));for(let i=0;i<COMBAT_FX_LIMIT;i++){
 const mesh=new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1),new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.08,depthWrite:false,depthTest:false,side:THREE.DoubleSide,fog:false}));
 mesh.visible=false;mesh.renderOrder=6;mesh.frustumCulled=false;scene.add(mesh);combatEffects.push({mesh,active:false,t:0,frame:-1,x:0,y:0,size:1,rot:0,kind:'light',low:false});}}
function clearCombatEffects(){for(const f of combatEffects){f.active=false;f.mesh.visible=false}}
function swordVisualSize(kind){return (kind==='h'?SL.heavy.range*.95*1.35*.9:SL.light.range*.8*1.30*.9)*.72/16}
function emitCombatEffect(kind,x,y,size,rot=0,tint=null){const cfg=COMBAT_FX.effects[kind];if(!cfg)return false;let f=null;for(const slot of combatEffects)if(!slot.active){f=slot;break}if(!f)return true; // Drop visual only when the fixed pool is full.
 f.active=true;f.kind=kind;f.tint=tint;f.x=x;f.y=y;f.size=size;f.rot=rot;f.t=0;f.frame=-1;f.low=SETT.quality==='low';f.mesh.visible=true;return true;}
function syncCombatEffects(dt){for(const f of combatEffects){if(!f.active)continue;const cfg=COMBAT_FX.effects[f.kind],trail=cfg.source==='03_element_slash_trails.png',duration=f.low?Math.min(.22,cfg.duration):cfg.duration;
 f.t+=dt;if(f.t>=duration){f.active=false;f.mesh.visible=false;continue}const phase=f.t/duration,frame=f.low?(phase<.5?0:2):Math.min(3,Math.floor(phase*4)),m=f.mesh,size=f.size*(f.low?.85:1);
 // Hide this decoration near a warning; never dim/recolor the enemy warning itself.
 let warning=false;for(const e of S.enemies)if(!e.dead&&Math.hypot(e.x-f.x,e.y-f.y)<e.r+size*18&&attackCue(e)){warning=true;break}m.visible=!warning;
 if(frame!==f.frame){f.frame=frame;const a=cfg.frames[frame],u0=(a.x+.5)/COMBAT_FX.width,u1=(a.x+a.width-.5)/COMBAT_FX.width,v0=1-(a.y+a.height-.5)/COMBAT_FX.height,v1=1-(a.y+.5)/COMBAT_FX.height,uv=m.geometry.attributes.uv;
 uv.setXY(0,u0,v1);uv.setXY(1,u1,v1);uv.setXY(2,u0,v0);uv.setXY(3,u1,v0);uv.needsUpdate=true;
 const pos=m.geometry.attributes.position,px=cfg.pivot[0],py=cfg.pivot[1];pos.setXYZ(0,-px,py,0);pos.setXYZ(1,1-px,py,0);pos.setXYZ(2,-px,py-1,0);pos.setXYZ(3,1-px,py-1,0);pos.needsUpdate=true;}
 m.position.set(f.x/16,COMBAT_POLISH_ON&&(f.kind==='light'||f.kind==='heavy')?1.35:trail?.25:.45,f.y/16);m.material.color.setHex(COMBAT_POLISH_ON&&f.tint?(f.tint==='steel'?0xe3d3ac:0xd89c84):0xffffff);m.quaternion.copy(cam.quaternion);m.rotateZ(f.rot);m.scale.set(size,size,1);
 m.material.opacity=(trail?.72:f.kind==='parry'?.48:.64)*(chapterArt()&&f.kind!=='parry'&&f.kind!=='block'?.82:1)*(SETT.flash?1:.38)*Math.min(1,(1-phase)*3);
}}

function contactSparks(x,y,nx,ny,kind,count){const angle=Math.atan2(ny,nx),soft=!SETT.flash,n=Math.max(1,Math.round(count*GFX.parts));
  for(let i=0;i<n;i++){const q=(Math.sin((i+1)*78.233+clock*12.9898)*43758.5453)%1,f=q-Math.floor(q),a=angle+(f-.5)*2.1,sp=26+f*(kind==='parry'?66:42);S.parts.push({k:'e',x,y,z:10+f*4,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*.6,vz:12+f*25,c:kind==='flesh'?(i%2?'#ba7354':'#96513f'):soft?(i%2?'#b9b1a0':'#8c969c'):kind==='parry'?(i%2?'#ffe9bb':'#d3e0eb'):(i%2?'#c9c3aa':'#b8c6d0'),life:.09+f*.09})}}
function guardFeedback(kind,nx,ny,projectile){let dx=-nx,dy=-ny,d=Math.hypot(dx,dy);if(d<.001){dx=pl.fx;dy=pl.fy;d=1}dx/=d;dy/=d;const attacker=S.attacker,reach=attacker?Math.min(10,Math.hypot(attacker.x-pl.x,attacker.y-pl.y)*.5):9,x=projectile?projectile.x:pl.x+dx*reach,y=projectile?projectile.y:pl.y+dy*reach;
  if(!(kind==='parry'&&skAdd('kat_parry',.28,x,y,.9,1.9,'bill',0)/* 22.11.2026 (decyzja autora): parowanie Kata u wszystkich postaci */)&&!emitCombatEffect(kind==='parry'?'parry':'block',x,y,kind==='parry'?1.3:.9))contactSparks(x,y,dx,dy,kind,kind==='parry'?12:7);if(kind==='parry')shockAt(x,y,.35);pl.visualGuard={t:.16,life:.16,dx:nx,dy:ny};play(kind,kind==='parry'?.03:.05)}
function hitSpark(e,nx,ny){const length=Math.hypot(nx,ny)||1,dx=nx/length,dy=ny/length,armour=steelEnemy(e),amplitude=BIG.has(e.type)?.35:e.type==='collector'?.55:ftHeavy?1.3:ftCrit?1.1:.75;
  if(!emitCombatEffect(ftHeavy?'heavy':'light',e.x-dx*Math.min(e.r*.55,5),e.y-dy*Math.min(e.r*.55,5),ftHeavy?1.35:.9,0,armour?'steel':'flesh'))contactSparks(e.x-dx*Math.min(e.r*.55,5),e.y-dy*Math.min(e.r*.55,5),dx,dy,armour?'steel':'flesh',ftCrit?8:ftHeavy?6:4);
  const life=COMBAT_POLISH_ON?(ftHeavy?.23:.18):.15,power=COMBAT_POLISH_ON?amplitude*(armour?2.1:2.8):amplitude;e.visualHit={t:life,life,dx,dy,amplitude:power,heavy:ftHeavy};}
function damageEnemy(e,dmg,nx,ny,kb=1,src){if(e.dead||e.trans>0||e.inv>0)return false;if(W.heroOnly&&pl&&heroOnlyAt(pl.x,pl.y))return false;/* 23.11.2026: ze schronienia nie da sie bic */if(TRN.ohk)dmg=Math.max(dmg,e.hp+1);if(e.hookMark>0)dmg*=1.25;if(src&&src.startsWith('sk:'))dmg*=skStatusMul(e,src);if(e.type==='shieldman'&&ftMelee&&!ftHeavy&&!ftCrit&&!(e.stun>0))dmg*=.5;if(e.affix==='pancerz'&&ftMelee&&!ftHeavy&&!ftCrit&&!(e.stun>0)){dmg*=.55;try{play('afxArmor',.18)}catch(_){}};// tarcza: lekkie ciecia zadaja polowe; ciezki atak, krytyk i ogluszenie po paradzie przebijaja
  if(S.zab&&e.mini&&e.fhT==null)e.fhT=S.t;if(dmg>=.5&&Math.hypot(e.x-pl.x,e.y-pl.y)<190)ftx(dmg,e.x,e.y,ftEntH(e),ftCrit?'c':'d',e);// Kat: Guillotine perk finishes regular enemies; hit counter for 'One Verdict'
  if(S.pk.kExec&&ftHeavy&&ftMelee&&!e.mini&&!BIG.has(e.type)&&e.type!=='collector'&&e.hp-dmg>0&&e.hp-dmg<e.max*.35)dmg=e.hp;
  e.hN=(e.hN||0)+1;S.dealt=(S.dealt||0)+dmg;if(src!=='trn'){const sk=typeof src==='string'&&src.slice(0,3)==='sk:'?src.slice(3):'',D=S.dsrc||(S.dsrc={}),k=src==='parry'?'p':src==='dot'?'d':sk?'s':DSRC||'s';D[k]=(D[k]||0)+dmg;if(sk){const Q=S.dsk||(S.dsk={});Q[sk]=(Q[sk]||0)+dmg}}if(dmg>(S.bigHit||0))S.bigHit=dmg;e.hp-=dmg;if(!e.ph2&&e.hp>0&&e.hp<=e.max*.5&&!e.mini&&(BIG.has(e.type)||e.type==='collector'||e.type==='boginka'))bossPhase2(e);e.flash=ftCrit?.17:ftHeavy?.12:.08;if(ftMelee&&dmg>=.5)hitSpark(e,nx,ny);else if(COMBAT_POLISH_ON&&dmg>=.5&&src!=='dot'&&src!=='trn'){const len=Math.hypot(nx,ny)||1;e.visualHit={t:.17,life:.17,dx:nx/len,dy:ny/len,amplitude:BIG.has(e.type)?.3:1.2,heavy:false}}if(e.type==='collector'&&!(e.hurtCd>0)&&dmg>=20){e.hurtA=.3;e.hurtCd=2.5}const k=(BIG.has(e.type)?.05:e.type==='collector'?.15:(e.type==='warden'||e.type==='knight'||e.type==='rotknight'||e.type==='wight'||e.type==='bies'||e.type==='boginka'||e.type==='marauder'||e.type==='cursed'||e.type==='arbiter')?.35:1)*110*kb;if(e.frozen<=0){e.vx+=nx*k;e.vy+=ny*k}
  if(Math.random()<.6)blood(e.x,e.y,2,nx||rnd(-1,1),ny||rnd(-1,1));play(ftCrit?'hitC':ftHeavy?'hitH':ftMelee&&steelEnemy(e)?'hitSteel':'hit',.05);if(e.hp<=0){if(e.type==='strzyga'&&!e.phase){e.phase=1;e.hp=e.max*.6;e.trans=1.8;e.mode=null;e.lh=0;shake(.6,.8);S.flash=.7;blood(e.x,e.y,80,0,1,3);play('bossGrowl',0);for(let i=0;i<40;i++){const a=Math.random()*Math.PI*2;S.parts.push({k:'d',x:e.x,y:e.y,z:rnd(10,40),vx:Math.cos(a)*rnd(40,120),vy:Math.sin(a)*rnd(20,60),vz:rnd(10,40),c:Math.random()<.6?'#141014':P.blood,life:rnd(.8,1.6)})}say(e.dgBoss?DG_PHASE.strzyga1:(EN?'The first heart has burst. The second still beats.':'Pierwsze serce pękło. Drugie wciąż bije.'))}else killEnemy(e,nx,ny)}return true}
// serduszko: wypada z 15% szansą z zabitego wroga, leczy 10% maks. życia (piksel-art rysowany w kodzie)
const HEART_MAT=(()=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');x.scale(2,2);
  const rows=['................','..XXXX....XXXX..','.XXXXXX..XXXXXX.','XXXXXXXXXXXXXXXX','XXXXXXXXXXXXXXXX','XXXXXXXXXXXXXXXX','.XXXXXXXXXXXXXX.','..XXXXXXXXXXXX..','...XXXXXXXXXX...','....XXXXXXXX....','.....XXXXXX.....','......XXXX......','.......XX.......','................','................','................'];
  rows.forEach((r,j)=>{for(let i=0;i<16;i++)if(r[i]==='X'){const edge=(j<2||!rows[j-1]||rows[j-1][i]!=='X'||rows[j][i-1]!=='X'||rows[j][i+1]!=='X'||!rows[j+1]||rows[j+1][i]!=='X');x.fillStyle=edge?'#7a0f1c':(i<5&&j<6?'#ff7a86':'#d8202f');x.fillRect(i,j,1,1)}});
  const tex=new THREE.CanvasTexture(c);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;const im=new Image();im.onload=()=>{x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,32,32);x.drawImage(im,0,0,32,32);tex.needsUpdate=true};im.src='data:image/png;base64,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';return new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.1,fog:false})})();
// runda 293: nowa moneta (sprite od autora) wypadajaca z wrogow
const COIN_MAT=(()=>{const c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d'),tex=new THREE.CanvasTexture(c);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;const im=new Image();im.onload=()=>{x.drawImage(im,0,0,32,32);tex.needsUpdate=true};im.src='data:image/png;base64,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';return new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.1,fog:false})})();
wispGlow.h=new THREE.MeshBasicMaterial({map:glowC('#ff3a4a'),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,opacity:.3});
function awardXp(v){if(!S||!(v>0))return;S.xp+=v*S.pk.xp*DF[DIFFK].xp*1.02;/* 15.11.2026: noc 16 min i wiecej wrogow: doswiadczenie -15% (bylo 1.2) */S.actions.collect++;while(S.xp>=S.need){S.xp-=S.need;S.lvl++;S.need=xpNeed(S.lvl);S.pendLv++}}
function dropPick(k,x,y,v=1){if(k==='w'){awardXp(v);return}const fr=k==='c'?{n:COIN_MAT}:k==='h'?{n:HEART_MAT}:A.pick[v>=5?5:v>=2?2:1];const m=new THREE.Mesh(geoC,fr.n);scene.add(m);const g=new THREE.Mesh(glowGeo,k==='c'||k==='h'?wispGlow[k]:wispGlow[v>=5?5:v>=2?2:1]);scene.add(g);
  S.picks.push({k,x,y,v,mag:false,sp:0,visualAge:0,ph:Math.random()*6,mesh:m,glow:g})}
// 8.11.2026 boss second phase: at half health the boss enrages (faster, harder hits) and calls two of the night's creatures
function bossPhase2(e){e.ph2=1;if(e.spd)e.spd*=1.2;if(e.dmg)e.dmg*=1.15;e.flash=.5;S.flash=Math.max(S.flash||0,.35);shake(.5,.45);play('hitH',0);padRumble(1,.6,320);
  ftInfo(EN?'Second phase!':'Druga faza!');say((ENAME[e.type]||(EN?'The boss':'Boss'))+(EN?' flies into a rage.':' wpada w szał.'),'event');
  const pool=S.enemies.filter(x=>!x.dead&&!x.mini&&!BIG.has(x.type)&&x.type!=='collector'&&x.type!=='boginka'&&x.type!=='glizzard'),t=pool.length?pool[0].type:null;
  if(t)for(const s of [-1,1]){try{const a=spawnEnemy(t,e.x+s*34,e.y+8);if(a)a.rise=Math.max(a.rise||0,.6)}catch(err){quietErr('bossAdd',err)}}}
function killEnemy(e,nx,ny){if(e.mini||BIG.has(e.type)){S.hitstop=Math.max(S.hitstop||0,.1);shake(.3,.22)}if(bossBar(e)){slowMo(1.4,.22);shockAt(e.x,e.y,1)}else if(e.mini){slowMo(.5,.45);shockAt(e.x,e.y,.55)}swordOnKill(e);try{rxInfect(e)}catch(_){}try{affixDeath(e)}catch(_){}e.dead=true;nb3dKill(e);S.kills++;S.streak=(S.streak||0)+1;if(S.streak>(S.bestStreak||0))S.bestStreak=S.streak;metaKill(e);
  // 8.11.2026 execution: slow motion + camera push-in + extra blood on the killing blow of an elite or a boss
  if(ftMelee&&!pl.dead&&(e.mini||BIG.has(e.type)||e.type==='collector'||e.type==='boginka'||e.type==='glizzard')){S.exec=BIG.has(e.type)||e.type==='collector'||e.type==='boginka'||e.type==='glizzard'?1.1:.75;S.execX=e.x;S.execY=e.y;blood(e.x,e.y,BIG.has(e.type)?42:26,e.x-pl.x,e.y-pl.y,1.6);play('hitH',0);padRumble(1,.8,260)}if(S.zab){if(S.zTag==='x')S.zCrossK++;else if(S.zTag==='s')S.zSlideK++;else if(S.zTag==='w')S.zWhirlN++;if(e.mini&&e.fhT!=null&&S.t-e.fhT<=15)S.zEliteFast=1}if(e.mini&&S.eliteLoot){dropPick('c',e.x+rnd(-6,6),e.y+rnd(-4,4),25);dropPick('h',e.x+rnd(-8,8),e.y+rnd(-4,4))}if(e.mini){S.eliteK=1;S.eliteN=(S.eliteN||0)+1;if(S.t-(e.bornT??-99)<=20)S.eliteFast=1}if(ftHeavy&&ftMelee)S.hvK=(S.hvK||0)+1;
  if(S.mil&&e.mini&&ftHeavy&&ftMelee&&pl.atk&&pl.atk.wick>=MIL.wick.max)S.mEliteK=(S.mEliteK||0)+1;
  if(S.kat){if(ftHeavy&&ftMelee&&e.hN===1)S.kOne=(S.kOne||0)+1;if(S.kTag==='w'){S.kKrN=(S.kKrN||0)+1;S.kKrBest=Math.max(S.kKrBest||0,S.kKrN)}if(S.kTag==='l')S.kLeapK=(S.kLeapK||0)+1;if(e.mini&&ftHeavy&&ftMelee)S.kEliteHv=(S.kEliteHv||0)+1}
  if(S.pk.kHood&&ftHeavy&&ftMelee&&!pl.dead)pl.sta=Math.min(pl.staMax,pl.sta+pl.staMax*.15);if(!pl.dead&&pl.hp<pl.max*.3)S.lowK=(S.lowK||0)+1;storyBoss(e);if(S.trial)S.trial.k++;
  // altars (standing stones, graves, rune lanterns, offering bowls) wake up after STONE_N kills next to each; all of them: full heal and 30 coins
  if(W.stoneP&&W.altar)W.stoneP.forEach((q,i)=>{if(S.stones[i]>=STONE_N||Math.hypot(e.x-q.x,e.y-q.y)>70)return;if(++S.stones[i]<STONE_N)return;
    play('bless',0);for(let j=0;j<30;j++)S.parts.push({k:'e',x:q.x+rnd(-6,6),y:q.y,z:rnd(0,30),vx:rnd(-10,10),vy:0,vz:rnd(10,30),c:W.altar.pc,life:rnd(.8,1.6)});
    const lit=S.stones.filter(v=>v>=STONE_N).length;
    if(lit<W.stoneP.length)say(W.altar.one(lit));
    else{pl.hp=pl.max;S.coins+=30;play('coin',0);shake(.12,.5);say(W.altar.all)}});
  // barrels of black powder in the Lower City blow up when someone dies next to them
  if(CH===2)for(const p of PROPS){if(p.k!=='black_powder'||S.boom.has(p)||Math.hypot(e.x-p.x*16,e.y-p.y*16)>30)continue;S.boom.add(p);S.delayed.push({t:.15,fn:()=>powderBlast(p)})}
  const big=BIG.has(e.type),jz=e.type==='glizzard',ghost=e.type==='wisp'||e.type==='zmora'||e.type==='wraith';
  if(e.type==='wisp'){scene.remove(e.mesh);return}
  if(e.type==='wraith'&&e.stolen>0){dropPick('c',e.x,e.y,e.stolen);S.picks[S.picks.length-1].returned=true}if(e.type==='wraith'&&e.skrybaSpecter)say(EN?'The Ledger Wraith crumbles. On the ground lies a page with the Scribe\'s name, crossed out. This time the account was closed by you.':'Upiór rachunków rozsypuje się. Na ziemi zostaje kartka z nazwiskiem Skryby, przekreślona. Tym razem rachunek zamknąłeś ty.');if(e.type==='wraith'&&e.ottokarSpecter)say(EN?'The Ledger Wraith crumbles into ash. "Settled. The count will pay one day as well. Not tonight."':'Upiór rachunków rozsypuje się w popiół. „Wyrównane. Hrabia też kiedyś zapłaci. Nie dziś.”');if(e.type==='wraith'&&e.witSpecter)say(EN?'The Ledger Wraith crumbles into seal-wax ash. "Settled. Remember this: you were kind to the wrong man. The granary paid for it."':'Upiór rachunków rozsypuje się w popiół z laku pieczęci. „Wyrównane. Zapamiętaj: byłeś dobry dla niewłaściwego. Zapłacił za to spichlerz.”');
  if(e.type==='leszy'&&!e.dgBoss){startBreak();S.leszy=null;say((EN?'Leshy turns to rotten wood. The path to the barrows lies open.':'Leszy obraca się w próchno. Ścieżka do kurhanów stoi otworem.'));for(let i=0;i<30;i++)dropPick('c',e.x+rnd(-26,26),e.y+rnd(-16,16));for(let i=0;i<10;i++)dropPick('w',e.x+rnd(-20,20),e.y+rnd(-12,12),3)}
  if(e.type==='boginka'){say((EN?'Leaves fall from the Lady of the Forest. Among them lie the fugitives\' coins.':'Z Pani Lasu opadają liście. Wśród nich leżą monety zbiegów.'));bossSay('ladyOfTheForest','defeat');for(let i=0;i<25;i++)dropPick('c',e.x+rnd(-22,22),e.y+rnd(-14,14));for(let i=0;i<5;i++)dropPick('w',e.x+rnd(-16,16),e.y+rnd(-10,10),3)}
  if(e.type==='collector'){S.collector=null;startBreak();const st=Math.floor(e.stolen||0),back=Math.floor(st*.6),total=back+20,n=Math.min(40,total);say((EN?`${CH===5?'The Arch-Judge Reckoner falls':'The Collector falls'}.${st?` The Order keeps its tithe of ${st-back}.`:''} Your gold returns to you: ${total} coins.`:`${CH===5?'Arcysędzia Rachmistrz pada':'Poborca pada'}.${st?` Zakon zatrzymuje dziesięcinę: ${st-back} monet.`:''} Złoto wraca do ciebie: ${total} monet.`));bossSay(CH===5?'auditor':CH===2?'collector':null,'defeat');shake(.4,.5);
    for(let i=0;i<n;i++){dropPick('c',e.x+rnd(-26,26),e.y+rnd(-16,16));Object.assign(S.picks[S.picks.length-1],{v:Math.floor(total/n)+(i<total%n?1:0),returned:true})}for(let i=0;i<8;i++)dropPick('w',e.x+rnd(-20,20),e.y+rnd(-12,12),3)}
  if(jz){say((EN?'Glizard, The Glizzy G-Lord, falls. The air reeks of mustard.':'Glizzard, Wielki Paruwiak, pada. W powietrzu wisi zapach musztardy.'));shake(.3,.4);for(let i=0;i<40;i++){const a=Math.random()*Math.PI*2,sp=rnd(30,110);S.parts.push({k:'d',x:e.x,y:e.y,z:rnd(6,16),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*.6,vz:rnd(20,60),c:Math.random()<.6?'#d8a820':'#8a2a1a',life:rnd(1,2)})}
    for(let i=0;i<30;i++)dropPick('c',e.x+rnd(-26,26),e.y+rnd(-16,16));for(let i=0;i<8;i++)dropPick('w',e.x+rnd(-18,18),e.y+rnd(-12,12),2)}
  if(!ghost)blood(e.x,e.y,big?140:e.type==='warden'?4:e.type==='bat'?5:16,nx||0,ny||1,big?3:1.5);play('kill',.06);
  if(e.type!=='warden'&&e.type!=='bat'&&!ghost){pool(e.x,e.y,big?36:12,big?12:5);if(DEC.spray&&Math.random()<.5)decalAt(DEC.spray[(Math.random()*4)|0],e.x+(nx||0)*10,e.y+(ny||0)*7,.85)}
  // corpse keeps the death animation and stays on the floor
  e.mesh.castShadow=false;if(e.type==='bat'){e.mesh.geometry=geo32;e.mesh.position.y=0}const ck=e.portArt?e.portArt.scale:jz?1.3:e.type==='beast'?(A.beast.sheet?1.2:1.35):e.type==='collector'?(CH===5&&A.collectorC5?.95:1.25):e.type==='leszy'?1.25:e.type==='strzyga'?1.2:e.type==='bies'?1.15:e.type==='cumlin'?1.2:1;const fire=e.burn>0||(NB3D_ON&&GFX.fx>0);S.corpses.push({mesh:e.mesh,anim:(e.portArt||A[e.type]).death,t:0,s:e.s*ck,k:ck,big,gone:ghost?1:0,ash:!ghost&&!big,x:e.x,y:e.y,fire,fall:COMBAT_POLISH_ON&&!ghost&&e.type!=='bat'&&e.type!=='courtraven'?{dx:(nx||0)/(Math.hypot(nx||0,ny||0)||1),dy:(ny||0)/(Math.hypot(nx||0,ny||0)||1),power:big?.7:2.8,y:e.mesh.position.y,sx:Math.abs(e.mesh.position.x*16-e.x)<16?e.mesh.position.x*16-e.x:0,sy:Math.abs(e.mesh.position.z*16-e.y)<16?e.mesh.position.z*16-e.y:0,rz:e.mesh.rotation.z}:null});if(!ghost&&!big)ashFx(e.x,e.y,big,fire,SETT.quality==='low'?3:6,20);
  {let n=0;for(const c of S.corpses)if(!c.big)n++;if(n>36){const i=S.corpses.findIndex(c=>!c.big);if(i>=0){const c=S.corpses.splice(i,1)[0];scene.remove(c.mesh);if(c.own)c.mesh.material.dispose()}}}
  if(big&&e.type!=='leszy'){if(S.stage==='final'){if(CH===PORT&&S.solne)S.solne.bossDead=true;else S.won=true}{const bk=e.type==='beast'?'morhad':e.type==='cumlin'?'cumlin':e.type==='boss'?(CH===5?'creditor':CH===1?'outgrowth':null):null;if(bk)setTimeout(()=>{if(S&&S.phase==='play')bossSay(bk,bk==='creditor'?'beforeLedgerDestroyed':'defeat')},0)}say(e.dgBoss?DG_END[e.type]:e.portBoss?(EN?'The Harbour Master falls. The keys clatter on the boards.':'Bosman upada. Klucze uderzają o deski.'):e.type==='strzyga'?(EN?'The second heart falls silent. Ravens burst from the Striga\'s ash.':'Drugie serce cichnie. Z popiołu Strzygi podrywają się kruki.'):e.type==='beast'?(EN?'Morhad falls. Blood seeps from the seams beneath his hand.':'Morhad pada. Ze spoin pod jego dłonią występuje krew.'):e.type==='cumlin'?(EN?'Cumlin falls to his knees. The crown rolls across the stone, and the last gold pours from his armour.':'Cumlin pada na kolana. Korona toczy się po kamieniu, a z jego zbroi sypie się ostatnie złoto.'):CH===5?(EN?'The Creditor falls. The Great Ledger lies open.':'Wierzyciel pada. Wielka Księga leży otwarta.'):(EN?'The Conjoined settles into the ash. For a moment each of its faces breathes on its own.':'Zrost osiada w popiele. Przez chwilę każda z twarzy oddycha osobno.'));if(e.type==='beast'){for(let i=0;i<6;i++)pool(e.x+rnd(-30,30),e.y+rnd(-14,14),36,12)}shake(.6,.7);for(let i=0;i<14;i++)dropPick('w',e.x+rnd(-24,24),e.y+rnd(-14,14),3);for(let i=0;i<20;i++)dropPick('c',e.x+rnd(-26,26),e.y+rnd(-16,16))}
  else if(!big){if(e.xp>0)dropPick('w',e.x,e.y,e.xp);if(Math.random()<.03)dropPick('h',e.x+rnd(-5,5),e.y+rnd(-3,3));
    if(e.mini){dropPick('h',e.x+rnd(-5,5),e.y+rnd(-3,3));/* 15.11.2026: elita zawsze zostawia serce (+10% HP) */for(let i=0;i<3;i++){dropPick("c",e.x+rnd(-14,14),e.y+rnd(-9,9));S.picks[S.picks.length-1].v=SL.coinStrong}ftx(e.named?e.nmN+(EN?' falls':' pada'):(EN?'Elite defeated':'Elita pokonana'),e.x,e.y,ftEntH(e)+.8,'i');if(e.named)metaNamed(e)}
    {const strong=ET[e.type].hp>=90;if(strong||Math.random()<SL.coinDrop){dropPick('c',e.x+rnd(-4,4),e.y+rnd(-3,3));if(strong)S.picks[S.picks.length-1].v=SL.coinStrong}}}
  if(e.dgBoss){if(e.type==='leszy')say(DG_END.leszy);dungeonCleared(e)}
}
function powderBlast(p){const x=p.x*16,y=p.y*16;shockAt(x,y,1);if(p.obj)p.obj.mesh.visible=false;shake(.45,.4);play('quake',0);play('fire',0);S.flash=Math.max(S.flash,.35);
  if(DEC.scorch)decalAt(DEC.scorch[(Math.random()*4)|0],x,y);slamFx(.35,x,y,.08,70/8);
  for(let i=0;i<40;i++){const a=Math.random()*Math.PI*2,sp=rnd(40,140);S.parts.push({k:'e',x,y,z:rnd(2,10),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*.6,vz:rnd(10,50),c:Math.random()<.5?'#ff6a1a':'#ffb347',life:rnd(.3,.8)})}
  for(const e of [...S.enemies])if(!e.dead&&Math.hypot(e.x-x,e.y-y)<48)damageEnemy(e,BIG.has(e.type)?60:90,(e.x-x)/48,(e.y-y)/48,2);
  const d=Math.hypot(pl.x-x,pl.y-y);if(d<34)hurtPlayer(12,(pl.x-x)/(d||1),(pl.y-y)/(d||1),'powder');
  for(const q of PROPS)if(q!==p&&q.k==='black_powder'&&!S.boom.has(q)&&Math.hypot(q.x-p.x,q.y-p.y)<4){S.boom.add(q);S.delayed.push({t:.25,fn:()=>powderBlast(q)})}}
function hurtPlayer(dmg,nx,ny,source='night'){if(S.zab&&pl.roll>0&&pl.inv>0&&!S.notice&&!pl.dead)S.zDodgeOk=1;if(S.notice||pl.inv>0||pl.dead)return false;if(TRN.god)return false;dmg*=S.pk.hurt*(S.zDance>0?1.2:1);if(S.pk.kBlock&&(pl.charging||pl.atk&&pl.atk.kind==='h'))dmg*=.7;if(S.gut)dmg*=S.pk.mFlame||1;if(S.vuln)dmg*=S.vuln;if(brHalf('def'))dmg*=.94;
  if(S.attacker)[nx,ny]=incomingMelee(S.attacker,nx,ny);
  if(S.redHit&&pl.block)ftInfo((EN?'Heavy blow — dodge!':'Ciężki cios — unik!'));
  if(!S.redHit&&pl.block&&-(pl.fx*nx+pl.fy*ny)>.3){
    if(pl.blockT<parryWin()&&S.attacker&&!S.attacker.dead&&!S.redHit){const e=S.attacker;e.stun=S.kat?2:S.dzw?1.7:1.4;if(S.kat)S.kStun=(S.kStun||0)+1;e.sw=0;e.recov=0;onParry();pl.parryT=.45;S.hitstop=.12;padRumble(.6,.3,140);guardFeedback('parry',nx,ny);shake(.15,.15);ftInfo((EN?'Parry!':'Parowanie!'));return}
    if(S.redHit&&pl.blockT<parryWin()+.1)ftInfo((EN?'Unparryable':'Nie do sparowania'));pl.sta-=dmg*blockMulX()*S.pk.blockSta*(S.redHit?2.2:1);pl.staDelay=SL.delay;pl.gHitT=.25;guardFeedback('block',nx,ny);
    if(pl.sta>=0){if(S.pk.leak&&!pl.dead)pl.hp=Math.max(1,pl.hp-dmg*S.pk.leak);pl.inv=.18;moveBox(pl,nx*6,ny*4,4,3);return}
    pl.sta=0;pl.broken=SL.guardBreak;S.dBroken=1;pl.block=false;dmg*=.5;play('empty',0);ftInfo((EN?'Guard broken':'Garda przełamana'))}
  if(S.dzw&&S.pledgeT>0&&S.pledge>0){const ab=Math.min(S.pledge,dmg);S.pledge-=ab;S.dAbs=(S.dAbs||0)+ab;dmg-=ab;swordSparks(pl.x,pl.y,'#a8d8cf',8);if(dmg<=.01){S.combatLock=4;pl.inv=Math.max(pl.inv,.3);guardFeedback('block',nx,ny);shake(.12,.1);return false}}
  S.combatLock=4;S.hitsT++;S.streak=0;(S.hitLog=S.hitLog||[]).push({n:deathCauseName(source),d:Math.max(1,Math.round(dmg))});if(S.hitLog.length>3)S.hitLog.shift();pl.hp-=dmg;if(S.zab){S.zCombo=0;S.zT=0;S.zFull=0}padRumble(.8,.5,200);pl.inv=.45;pl.blinkUntil=clock+.45;pl.hurtT=.22;S.hurt=.3;shake(.25,.18);blood(pl.x,pl.y,10,nx,ny);play('hurt',.1);
  if(S.train&&pl.hp<=0)pl.hp=1;if(pl.hp<=0){if(S.lastCh&&!S.lastChUsed&&!pl2&&!pl.dead){S.lastChUsed=1;pl.hp=1;pl.inv=Math.max(pl.inv,1.5);pl.blinkUntil=clock+1.5;S.flash=.6;shake(.3,.3);play('bless',0);ftInfo(EN?'Last Chance!':'Ostatnia szansa!');return true}if(pl2&&withRb(pl,tryRebirth))return true;{const o=pl===pl2?pl1:pl2;if(o&&!o.dead){pl.hp=0;pl.dead=true;pl.deadT=0;pl.revT=0;padRumble(1,1,450,pl===pl2&&typeof PAD2!=='undefined'?PAD2.g:null);blood(pl.x,pl.y,40,nx,ny,3);play('kill',0);return true}}if(tryRebirth())return true;S.deathCause=deathCauseName(source);S.deathSrc=typeof source==='string'?source:source&&source.type?source.type:'night';loseSecondLife();clearSwordTransient();S.swordTrails=[];pl.hp=0;pl.dead=true;pl.deadT=0;padRumble(1,1,520);blood(pl.x,pl.y,70,nx,ny,3);play('kill',0);S.endT=2.6;pool(pl.x,pl.y,20,8)}return true}
function updEnemy(e,dt){
  /* 23.11.2026 (autor: bez cheese w drzwiach): gdy bohater jest w schronieniu (dom Heriego, chata Chojraka), wrogowie nie tlocza sie przy drzwiach, tylko odchodza na ok. 8 pol i czekaja */
  if(W.heroOnly&&pl&&!pl.dead&&heroOnlyAt(pl.x,pl.y)&&!e.dead&&!(e.rise>0)){const h=shelterAt(pl.x,pl.y);if(h){const ox=(h.door[0]+.5)*TS,oy=(h.door[1]+.5)*TS,vx=e.x-ox,vy=e.y-oy,dd=Math.hypot(vx,vy)||1;
    if(dd<8*TS){const sp=Math.min(70,e.spd||45)*dt;moveBox(e,vx/dd*sp,vy/dd*sp,4,3)}e.vx=0;e.vy=0;return}}
  keepEnemyDistance(e);const ox=e.x,oy=e.y,dx=pl.x-e.x,dy=pl.y-e.y,d=Math.hypot(dx,dy);
  if(d>.001){e.contactNX=dx/d;e.contactNY=dy/d}
  const lock=attackCue(e)!==null&&e.mode!=='up',mode=e.mode;
  stepEnemyAI(e,dt);
  if(W.heroOnly&&heroOnlyAt(e.x,e.y)&&!heroOnlyAt(ox,oy)){e.x=ox;e.y=oy}
  if(lock&&!e.dead&&e.mode===mode){e.x=ox;e.y=oy}
  keepEnemyDistance(e,ox,oy);keepGolemDistance(e);
}
// status colour on the enemy sprite: poison green, fire orange (flickers, so it is not mistaken for a warning), bleeding crimson, chill pale blue
function statusTint(e){const l=[];if(e.burn>0)l.push('so');if(e.pois>0)l.push('sg');if(e.bleed>0)l.push('sb');if(e.chill>0)l.push('sc');if(!l.length)return null;const m=l[((clock*2.4)|0)%l.length];return m==='so'&&((clock*11)|0)%2?null:m}
function stepEnemyAI(e,dt){
  if(e.staggerCd>0)e.staggerCd=Math.max(0,e.staggerCd-dt);if(e.acd!==undefined)e.acd-=dt;
  if(e.visualHit)e.visualHit.t=Math.max(0,e.visualHit.t-dt);e.flash-=dt;e.atkA-=dt;if(e.rise>0){e.rise-=dt;return}
  if(e.bleed>0){e.bleed-=dt;e.bleedT-=dt;if(Math.random()<dt*12)S.parts.push({k:'e',x:e.x+rnd(-4,4),y:e.y,z:rnd(8,18),vx:rnd(-6,6),vy:0,vz:rnd(-4,6),c:Math.random()<.5?'#e0182c':'#8a0e18',life:.45});if(e.bleedT<=0){e.bleedT=.4;damageEnemy(e,(e.bleedDmg||5)*rxBoil(e),0,0,0,'dot');if(e.dead)return}}
  if(e.pois>0){e.pois-=dt;e.poisT=(e.poisT||0)-dt;if(Math.random()<dt*14)S.parts.push({k:'m',x:e.x+rnd(-4,4),y:e.y,z:rnd(6,22),vx:0,vy:0,vz:rnd(6,14),c:Math.random()<.5?'#a6ff52':'#5aa02a',life:.55});if(e.poisT<=0){e.poisT=.5;if(Math.random()<.7)S.parts.push({k:'m',x:e.x+rnd(-4,4),y:e.y,z:rnd(6,16),vx:0,vy:0,vz:rnd(4,10),c:'#8ac04a',life:.6});damageEnemy(e,e.poisD*.5,0,0,0,'dot');if(e.dead)return}}
  if(e.burn>0){e.burn-=dt;e.burnT=(e.burnT||0)-dt;if(Math.random()<dt*12)S.parts.push({k:'e',x:e.x+rnd(-4,4),y:e.y,z:rnd(4,14),vx:0,vy:0,vz:rnd(10,20),c:Math.random()<.5?'#ff6a1a':'#ffb347',life:.4});if(e.burnT<=0){e.burnT=.5;damageEnemy(e,e.burnD*.5,0,0,0,'dot');if(e.dead)return}}
  if(e.chill>0)e.chill-=dt;if(e.hookMark>0)e.hookMark-=dt;
  if(e.sleep){if(e.hp<e.max||Math.hypot(pl.x-e.x,pl.y-e.y)<125)wakeRoom(e);else return}
  if(e.frozen>0){e.frozen-=dt;return}
  if(e.emerge>0){e.emerge-=dt;return}
  const fly=e.type==='bat'||e.type==='zmora'||e.type==='wraith'||e.type==='courtraven'||(e.type==='strzyga'&&!e.phase);
  const hw=e.hw||e.r-1;
  if(Math.abs(e.vx)+Math.abs(e.vy)>1){if(fly){e.x+=e.vx*dt;e.y+=e.vy*dt}else moveBox(e,e.vx*dt,e.vy*dt,hw,3);const f=Math.pow(.002,dt);e.vx*=f;e.vy*=f}
  // stunned enemies still fly back from a knockback, but do nothing else
  if(e.stun>0){e.ghoulWind=0;e.stun-=dt;e.sw=0;e.chT=0;e.pull=0;e.aim=0;if(e.cmA){e.cmA=null;e.cmH=null;e.red=false}return}
  const T=enemyTarget(e,dt),dx=T.x-e.x,dy=T.y-e.y,d=Math.hypot(dx,dy)||1;
  if(Math.hypot(pl.x-e.x,pl.y-e.y)>480&&!BIG.has(e.type)&&e.type!=='wisp'&&e.type!=='boginka'){const p=ringSpot();if(p){e.x=p[0];e.y=p[1]}return}
  if(Math.abs(dx)>1)e.s=dx>0?1:-1;
  if(pl.dead)return;if(e.ghoulWind>0){e.ghoulWind-=dt;if(e.ghoulWind<=0){const v=e.lspd||82;e.leap=.3;e.lhit=0;e.atkA=.3;e.lx=e.ghoulDX*v;e.ly=e.ghoulDY*v}return}
  if(e.type==='collector'){e.stealCd=(e.stealCd||0)-dt;e.drain=(e.drain||0)-dt;e.hurtA=(e.hurtA||0)-dt;e.hurtCd=(e.hurtCd||0)-dt;e.tauntA=(e.tauntA||0)-dt;e.tauntCd=(e.tauntCd===undefined?4:e.tauntCd)-dt;
    if(e.tauntCd<=0&&e.stolen>0&&d>90){e.tauntCd=rnd(6,9);e.tauntA=1}
    if(e.stealWind>0){e.stealWind-=dt;if(e.stealWind<=0&&d<e.r+15){S.attacker=e;const hit=hitT(e,enemyDamage(12,0),dx/d,dy/d);S.attacker=null;if(hit){const n=Math.min(S.coins,Math.max(3,Math.floor(S.coins*.15)));S.coins-=n;e.stolen+=n;if(n)ftInfo('−'+n+(EN?' coins':' monet'))}}}
    else if(d<e.r+10&&e.stealCd<=0&&(golemTgt(e)||pl.inv<=0)){e.stealWind=.65;e.stealCd=2;telegraph(e)}
    else if(!golemTgt(e)&&d<56&&e.drain<=0&&S.coins>0&&pl.inv<=0&&sight(e.x,e.y,T.x,T.y)){e.drain=1;e.drainAt=clock;S.coins--;e.stolen++;if(e.type==='collector')bossSay(CH===5?'auditor':CH===2?'collector':null,'combat');S.parts.push({k:'g2',x:pl.x,y:pl.y,z:10,tx:e,life:.6,c:'#e0b84a'})}}

  if(e.type==='collector'&&CH===5&&A.collectorC5){// Arcysędzia Rachmistrz: wyrok młotem, strony nakazu, wezwanie ławników
    e.hamCd=(e.hamCd===undefined?4:e.hamCd)-dt;e.sumCd=(e.sumCd===undefined?15:e.sumCd)-dt;e.fanCd=(e.fanCd===undefined?3:e.fanCd)-dt;
    if(e.hamT>0){e.hamT-=dt;e.tauntA=.2;if(e.hamT<=0){shake(.5,.4);play('slam',0);shockAt(e.x,e.y,.75);slamFx(.35,e.x,e.y,.08,60/8);if(pl.inv<=0)aoeP(e,56,enemyDamage(20));e.atkA=.4;
        for(let i=0;i<20;i++){const a=i/20*Math.PI*2;S.parts.push({k:'d',x:e.x+Math.cos(a)*12,y:e.y+Math.sin(a)*6,z:1,vx:Math.cos(a)*90,vy:Math.sin(a)*45,vz:18,c:'#e0b84a',life:.6})}}return}
    if(d<64&&e.hamCd<=0&&!(e.stealWind>0)){e.hamT=.7;e.hamCd=5.5;telegraph(e);for(let k=0;k<3;k++)telegraph(e);play('bossGrowl',0);return}
    if(e.sumCd<=0&&S.enemies.length<ENEMY_CAP-6){e.sumCd=22;e.tauntA=.8;say((EN?'The Arch-Judge summons the jurors: "The sentence is already written."':'Arcysędzia wzywa ławników: „Wyrok jest już spisany”.'));for(let k=0;k<2;k++){const a=Math.random()*6.28,q=spawnEnemy('scribe',e.x+Math.cos(a)*26,e.y+Math.sin(a)*16);q.rise=.8}}
    if(e.fanWind>0){e.fanWind-=dt;if(e.fanWind<=0){for(const o of [-.25,0,.25])S.eproj.push({source:{type:e.type,chapter:CH},x:e.x,y:e.y,vx:Math.cos(e.fanAim+o)*95,vy:Math.sin(e.fanAim+o)*95,life:2.4,bolt:1});e.atkA=.35;play('swing',.2)}return}
    if(e.fanCd<=0&&d>70&&d<210&&sight(e.x,e.y,T.x,T.y)){e.fanCd=4.8;e.fanWind=.75;e.fanAim=Math.atan2(dy,dx);telegraph(e);return}}
  if(e.type==='cumlin'&&cumlinAI(e,dx,dy,d,dt,hw))return;
  if(e.type==='beast'&&beastAI(e,dx,dy,d,dt))return;
  if(CZAI[e.type]&&CZAI[e.type](e,dx,dy,d,dt,hw))return;
  if(e.type==='monk'){e.cast=(e.cast===undefined?rnd(1,2.5):e.cast)-dt;
    const mFire=()=>{e.atkA=.35;S.eproj.push({source:{type:e.type,chapter:CH},x:e.x,y:e.y,vx:dx/d*74,vy:dy/d*74,life:2.6,dm:5/* 24.11.2026 (autor: strzelcy za mocni): bylo 7 */,ph:Math.random(),mesh:A.fireball?(()=>{const m=new THREE.Mesh(geoC,A.fireball[0].n);scene.add(m);return m})():null});play('fire',.2)};
    if(e.aim>0){e.aim-=dt;if(e.aim<=0&&d>1&&sight(e.x,e.y,T.x,T.y))mFire()}
    else if(d<140&&e.cast<=0&&sight(e.x,e.y,T.x,T.y)&&(S.enemyShotCd||0)<=0){e.aim=SL.aim;e.cast=rnd(6,7)/* 24.11.2026: rzadziej, bylo 4-5 s */;S.enemyShotCd=SL.shotGap+SL.aim;telegraph(e)}
    /* 24.11.2026 (autor: uciekaja, nie da sie dogonic): cofa sie dopiero z bliska i o polowe wolniej (bylo: od 64 pelna predkoscia) */if(d<40){moveBox(e,-dx/d*e.spd*.5*dt,-dy/d*e.spd*.5*dt,hw,3);e.walk+=dt*.5;return}if(d<110){e.walk+=dt*.3;return}}
  if(!BIG.has(e.type)&&e.type!=='collector'&&e.type!=='glizzard'&&e.type!=='wisp'&&e.dmg>0&&e.leap<=0){if(slashEnemy(e,dx,dy,d,dt)){e.walk+=dt*.2;return}}
  else if(d<e.r+6&&e.dmg>0&&e.type!=='collector'&&BIG.has(e.type)){
    if(BIG.has(e.type)){if(!(e.ctw>0)&&!(e.ccd>0)){e.ctw=.4;for(let k=0;k<3;k++)telegraph(e)}}// boss: zapowiedź .4 s, potem przerwa 1,4 s (unik w tym czasie ratuje)
    else{hitT(e,enemyDamage(e.dmg,480),dx/d,dy/d);if(e.atkA<=0)e.atkA=.35}}
  if(BIG.has(e.type)){if(e.ccd>0)e.ccd-=dt;if(e.ctw>0){e.ctw-=dt;if(e.ctw<=0){e.ccd=1.4;if(d<e.r+10){hitT(e,enemyDamage(e.dmg,480),dx/d,dy/d,true);e.atkA=.35}}}}
  if(e.type==='boss'&&CH===5&&A.bossC5){// Wierzyciel: faza I (strony), faza II (po połowie życia: monety, wyrok, szybszy)
    for(const k of ['lashF','castF','callF','slamF'])if(e[k]>0)e[k]-=dt;
    if(!e.ph2&&e.hp<e.max*.5){e.ph2=1;bossSay('creditor','phase2');e.trans=1.6;e.ctw=0;e.ccd=2;e.atkT=0;e.castWind=0;e.cast=2;e.spd*=1.35;shake(.7,.8);play('bossGrowl',0);slamFx(.6,e.x,e.y,.08,80/8);say((EN?'The Creditor tears off his chains. A ledger opens in his hands.':'Wierzyciel zrywa łańcuchy. W dłoniach otwiera mu się księga.'));
      for(let i=0;i<20;i++){const a=i/20*Math.PI*2;S.parts.push({k:'d',x:e.x,y:e.y,z:6,vx:Math.cos(a)*70,vy:Math.sin(a)*35,vz:22,c:'#e0b84a',life:.7})}}
    if(e.trans>0){e.trans-=dt;return}
    e.cast=(e.cast===undefined?3:e.cast)-dt;
    if(e.castWind>0){e.castWind-=dt;if(e.castWind<=0){if(!e.ph2){for(const o of [-.32,0,.32])S.eproj.push({source:{type:e.type,chapter:CH},x:e.x,y:e.y,vx:Math.cos(e.castAim+o)*90,vy:Math.sin(e.castAim+o)*90,life:2.8,bolt:1});e.castF=.4}else{e.ringOff=(e.ringOff||0)+.31;for(let i=0;i<12;i++){const a=i/12*Math.PI*2+e.ringOff;S.eproj.push({source:{type:e.type,chapter:CH},x:e.x,y:e.y,vx:Math.cos(a)*78,vy:Math.sin(a)*78,life:2.6,bolt:1})}e.callF=.4}play('swing',.2)}return}
    if(e.cast<=0&&d<240&&sight(e.x,e.y,T.x,T.y)){e.cast=e.ph2?3.4:4.2;e.castWind=e.ph2?.9:.75;e.castAim=Math.atan2(dy,dx);telegraph(e);return}
  }

  if(e.portBoss){// Bosman: cios hakiem z bliska, rzut hakiem na lancuchu z daleka, a od polowy zycia trzy haki naraz i zaloga spod pomostow
    if(e.hookF>0)e.hookF-=dt;
    if(!e.ph2&&e.hp<e.max*.5){e.ph2=1;e.spd*=1.2;e.hook=1.2;shake(.6,.7);play('bossGrowl',0);say(EN?'The Harbour Master rattles his chains. Something answers from under the piers.':'Bosman szarpie łańcuchami. Spod pomostów coś mu odpowiada.');
      for(let i=0;i<4;i++){const p=ringSpot();if(p)spawnEnemy('ghoul',p[0],p[1])}}
    e.hook=(e.hook===undefined?3:e.hook)-dt;
    if(e.hookWind>0){e.hookWind-=dt;if(e.hookWind<=0){for(const o of e.ph2?[-.24,0,.24]:[0])S.eproj.push({source:{type:e.type,chapter:CH},x:e.x,y:e.y,vx:Math.cos(e.hookAim+o)*125,vy:Math.sin(e.hookAim+o)*125,life:2,bolt:1});e.hookF=.45;play('swing',.2)}return}
    if(e.hook<=0&&e.atkT<=0&&d>46&&d<230&&sight(e.x,e.y,T.x,T.y)){e.hook=e.ph2?3.6:5;e.hookWind=.7;e.hookAim=Math.atan2(dy,dx);telegraph(e);return}
  }
  if(BIG.has(e.type)){
    if(e.atkT>0){e.atkT-=dt;if(e.atkT<=0){e.atkA=.4;shake(.5,.35);play('slam',0);shockAt(e.x,e.y,.75);slamFx(.35,e.x,e.y,.08,54/8);aoeP(e,54,enemyDamage(e.type==='beast'?24:20));
      for(let i=0;i<24;i++){const a=i/24*Math.PI*2;S.parts.push({k:'d',x:e.x+Math.cos(a)*12,y:e.y+Math.sin(a)*6,z:1,vx:Math.cos(a)*90,vy:Math.sin(a)*45,vz:18,c:P.st3,life:.6})}}return}
    e.slamT-=dt;if(e.slamT<=0&&d<80){e.slamT=e.ph2?2.4:3.4;e.slamF=.8;e.atkT=.8;play('bossGrowl',0);return}
  }
  let sp=e.spd*(e.chill>0?e.chillMul||.6:1);if(e.type==='madman'){sp*=.4+1.1*Math.abs(Math.sin(e.walk*4.3+e.ph));e.side=Math.sin(clock*2+e.ph)>0?1:-1}if(e.type==='dwarf'||e.type==='possessed')sp*=.65+.6*Math.abs(Math.sin(e.walk*3));
  if(e.type==='ghoul'||e.type==='hound'||e.type==='wolf'||e.type==='goat'||e.type==='strzygon'||e.type==='paperrat'){e.lcd-=dt;if(e.leap>0){e.leap-=dt;moveBox(e,e.lx*dt,e.ly*dt,4,3);e.walk+=dt*2;if(!e.lhit&&d<e.r+9){e.lhit=1;S.attacker=e;hitT(e,enemyDamage(e.dmg*SL.enemyHit,SL.dmgDiv),dx/d,dy/d);S.attacker=null;e.leap=0}/* 23.11.2026 (runda 864): doskok konczy sie na trafieniu (bez przelatywania przez gracza), po nim chwila odsloniecia zamiast natychmiastowego drugiego ciosu */if(e.leap<=0){e.leap=0;e.recov=Math.max(e.recov||0,.6);e.acd=Math.max(e.acd||0,1)}return}if(d<52&&d>22&&e.lcd<=0){/* doskok zawsze z zamachem (podswietlenie ostrzezenia) i najwyzej 2 naraz w calej sforze */let n=0;for(const o of S.enemies)if(!o.dead&&(o.ghoulWind>0||o.leap>0))n++;if(n>=2){e.lcd=.4+Math.random()*.6}else{const g1=e.type==='ghoul'&&CH===1;e.ghoulWind=g1?.35:.32;e.ghoulDX=dx/d;e.ghoulDY=dy/d;e.lspd=g1?82:105;e.lcd=g1?4.5+Math.random()*1.7:3.2+Math.random()*1.5;telegraph(e);e.atkA=0;return}}}/* zamach bez klatki ataku: jedna animacja skoku zamiast dwoch */
  let mx=dx/d,my=dy/d;
  if(!fly&&T===pl&&d>18){e.navT=(e.navT||0)-dt;if(e.navT<=0){e.navT=.25+Math.random()*.1;e.navOn=!sight(e.x,e.y,pl.x,pl.y)}if(e.navOn){const nd=navDir(e);if(nd){mx=nd[0];my=nd[1]}}}
  if(fly){const w=Math.sin(clock*5+e.ph)*1.2,c=Math.cos(w),s=Math.sin(w);[mx,my]=[mx*c-my*s,mx*s+my*c]}
  for(const o of nearbyEnemies(e)){if(o===e||o.dead)continue;const ox=e.x-o.x,oy=e.y-o.y;if(Math.abs(ox)>24||Math.abs(oy)>24)continue;const od=Math.hypot(ox,oy),min=e.r+o.r+1;if(od<min&&od>0){mx+=ox/od*.9;my+=oy/od*.9}}
  const ml=Math.hypot(mx,my)||1;
  if(fly){e.x+=mx/ml*sp*dt;e.y+=my/ml*sp*dt}else{const ox=e.x,oy=e.y;moveBox(e,mx/ml*sp*dt,my/ml*sp*dt,hw,3);if(Math.hypot(e.x-ox,e.y-oy)<sp*dt*.3){moveBox(e,-my/ml*sp*dt*1.3*e.side,mx/ml*sp*dt*1.3*e.side,hw,3);if(Math.random()<dt*.5)e.side*=-1}}
  e.walk+=dt;
}
// Cumlin, the Possessed Dwarf King (chapter II boss): slow, heavy hammer. Overhead slam and wide sweep can be parried; the red smash cannot - dodge it, and a miss leaves him exposed.
// 15.11.2026: stary pierscien kryształów (A.fx.nova, maly arkusz 32 px) powiekszony do 7-10 jednostek wygladal jak wielka pikselowa gwiazda. Uderzenia wrogow uzywaja teraz HD efektu 'earth' (pyl i odlamki); stary pierscien zostaje tylko jako zapas.
function slamFx(dur,x,y,h,size){const v=skAdd('earth',dur,x,y,h,Math.min(size*.42,3.6),'ground',0);if(v){v.sy=1/Math.sin(PITCH);return v}return addVfx(A.fx.nova,dur,x,y,h,size,'ground')}
function cumlinFx(k,dur,x,y,h,size,mode){const f=A.cumlinFx&&A.cumlinFx[k];if(f)addVfx(f,dur,x,y,h,size,mode)}
function cumlinAI(e,dx,dy,d,dt,hw){
  if(Math.random()<dt*16)S.parts.push({k:'b',x:e.x+rnd(-12,12),y:e.y+rnd(-3,3),z:rnd(10,34),vx:rnd(-5,5),vy:rnd(-3,3),vz:rnd(-8,4),c:Math.random()<.7?P.blood:P.blood2});
  if(Math.random()<dt*9)S.parts.push({k:'d',x:e.x+rnd(-12,12),y:e.y+rnd(-3,3),z:rnd(14,38),vx:rnd(-6,6),vy:rnd(-3,3),vz:rnd(-4,6),c:Math.random()<.5?'#e0b84a':'#b8902f',life:.6});
  if(!e.cmEn&&e.hp<e.max*.5){e.cmEn=1;e.spd*=1.2;shake(.5,.8);play('bossGrowl',0);S.flash=.5;blood(e.x,e.y,60,0,1,3);say((EN?'Cumlin roars. Gold pours from his armour, and the cracks glow red.':'Cumlin ryczy. Ze zbroi sypie się złoto, a szczeliny rozżarzają się na czerwono.'));bossSay('cumlin','controlBroken')}
  const wins={slam:[.95,.85],sweep:[.8,.7],rage:[1.25,1.0]};
  if(e.cmA){
    const W=wins[e.cmA];e.cmT+=dt;e.cmMv=false;
    if(e.cmH==null){e.sw=Math.max(.001,W[0]-e.cmT);
      if(e.cmA==='rage'&&Math.random()<dt*22)S.parts.push({k:'e',x:e.x+rnd(-6,6),y:e.y,z:rnd(10,30),vx:rnd(-8,8),vy:0,vz:rnd(10,30),c:warningColor(),life:.3});
      if(e.cmT>=W[0]){e.cmH=0;e.sw=0;const red=e.red;e.red=false;
        const cx=e.x+e.cmUX*20,cy=e.y+e.cmUY*12,pdx=pl.x-e.x,pdy=pl.y-e.y,pd=Math.hypot(pdx,pdy)||1;
        if(e.cmA==='sweep'){
          shake(.35,.3);play('swing',0);cumlinFx('dust',.5,e.x+e.s*22,e.y,0,3.6,'bill');
          for(let i=0;i<14;i++){const a=(i/13-.5)*2.4;S.parts.push({k:'d',x:e.x+e.s*Math.cos(a)*24,y:e.y+Math.sin(a)*14,z:4,vx:e.s*Math.cos(a)*80,vy:Math.sin(a)*40,vz:10,c:Math.random()<.5?'#e0b84a':P.st3,life:.45})}
          if(pd<e.r+38&&pdx*e.s>-8){S.attacker=e;hitT(e,enemyDamage(e.dmg*.8),pdx/pd,pdy/pd);S.attacker=null}
        }else{
          const R=red?58:40;shake(red?.7:.5,.4);play('slam',0);shockAt(e.x,e.y,.75);cumlinFx('wave',.45,cx,cy,.08,R/6.2,'ground');if(DEC.crack)decalAt(DEC.crack[2],cx,cy);
          for(let i=0;i<(red?30:20);i++){const a=i/(red?30:20)*Math.PI*2;S.parts.push({k:'d',x:cx+Math.cos(a)*12,y:cy+Math.sin(a)*6,z:1,vx:Math.cos(a)*100,vy:Math.sin(a)*50,vz:20,c:Math.random()<.4?'#e0b84a':P.st3,life:.6})}
          if(red){cumlinFx('shards',.6,cx,cy,0,4.6,'bill');blood(cx,cy,24,0,1,3)}
          S.attacker=e;S.redHit=!!red;const hit=aoeP(e,R,enemyDamage(red?e.dmg*1.35:e.dmg),cx,cy);S.attacker=null;S.redHit=false;
          if(red&&!hit&&e.stun<=0){e.stun=2.4;e.cmA=null;ftx((EN?'Exposed!':'Odsłonięty!'),e.x,e.y,ftEntH(e)+.8,'i');cumlinFx('dust',.5,e.x,e.y,0,4,'bill');return true}
        }
        if(e.stun>0){e.cmA=null;e.sw=0;return true}
      }
    }else{e.cmH+=dt;if(e.cmH>=W[1]){e.cmA=null;e.cmH=null;e.cmCd=rnd(.6,1.2)*(e.cmEn?.7:1)}}
    return true}
  e.cmCd=(e.cmCd===undefined?1.6:e.cmCd)-dt;
  if(e.cmCd<=0&&d<95){
    e.cmN=(e.cmN||0)+1;e.cmT=0;e.cmH=null;e.cmUX=dx/d;e.cmUY=dy/d;
    e.cmA=(e.cmN%4===0||(e.cmEn&&e.cmN%3===0))?'rage':(d<70&&Math.random()<.45?'sweep':'slam');
    e.red=e.cmA==='rage';e.sw=wins[e.cmA][0];telegraph(e);if(e.red){for(let k=0;k<3;k++)telegraph(e);play('warnR',0)}play('bossGrowl',0);return true}
  // approach and stand off at hammer range
  e.cmMv=false;
  if(d>e.r+26){
    let mx=dx/d,my=dy/d;
    if(d>18){e.navT=(e.navT||0)-dt;if(e.navT<=0){e.navT=.25+Math.random()*.1;e.navOn=!sight(e.x,e.y,pl.x,pl.y)}if(e.navOn){const nd=navDir(e);if(nd){mx=nd[0];my=nd[1]}}}
    const sp=e.spd*(e.chill>0?e.chillMul||.6:1),ox=e.x,oy=e.y;moveBox(e,mx*sp*dt,my*sp*dt,hw,3);
    if(Math.hypot(e.x-ox,e.y-oy)<sp*dt*.3)moveBox(e,-my*sp*dt*1.3*e.side,mx*sp*dt*1.3*e.side,hw,3);
    e.walk+=dt;e.cmMv=true}
  return true}
function cumlinFrame(e,an){
  const q=(a,k)=>a[Math.max(0,Math.min(a.length-1,k|0))];
  if(e.stun>0)return an.hurt[0];
  if(e.cmA){const W=e.cmA==='rage'?1.25:e.cmA==='sweep'?.8:.95;
    if(e.cmH==null){const p=Math.min(.999,e.cmT/W);return e.cmA==='rage'?q(an.tell,p*4):q(an[e.cmA],p<.5?0:1)}
    if(e.cmA==='rage')return e.cmH<.3?an.rage[2]:an.rage[3];
    return e.cmH<.3?an[e.cmA][2]:an[e.cmA][3]}
  return e.cmMv?at(an.walk,e.walk,3):at(an.idle,clock+e.ph,2.5)}
// Morhad: charges in a straight line, slams up close, and once wounded leaps from above onto the hero
function beastAI(e,dx,dy,d,dt){
  if(Math.random()<dt*22)S.parts.push({k:'b',x:e.x+rnd(-12,12),y:e.y+rnd(-3,3),z:rnd(14,40)+(e.lh||0)*16,vx:rnd(-6,6),vy:rnd(-3,3),vz:rnd(-10,5),c:Math.random()<.7?P.blood:P.blood2});
  if(e.roarT>0){e.roarT-=dt;return true}
  if(!e.enraged&&e.hp<e.max*.5){e.enraged=true;if(e.type==='beast')bossSay('morhad','phase2');e.roarT=1.4;e.spd*=1.25;e.mode=null;e.atkA=.6;e.lT=1.5;shake(.5,.8);play('bossGrowl',0);S.flash=.8;blood(e.x,e.y,60,0,1,3);say(e.dgBoss?DG_PHASE.beast:(EN?'Morhad spreads his wings. Horns tear through his skin and keep growing.':'Morhad rozkłada skrzydła. Rogi rozrywają mu skórę i rosną dalej.'))}
  const hit=k=>{const ddx=pl.x-e.x,ddy=pl.y-e.y,dd=Math.hypot(ddx,ddy)||1;hurtPlayer(enemyDamage(k),ddx/dd,ddy/dd,e)};
  if(e.mode==='wind'){e.mt-=dt;e.atkA=.15;if(e.mt<=0){e.mode='charge';e.mt=.85;play('roll',0)}return true}
  if(e.mode==='charge'){e.mt-=dt;const ox=e.x,oy=e.y;moveBox(e,e.cx*200*dt,e.cy*200*dt,e.hw,3);e.walk+=dt*3;
    if(Math.random()<dt*14)pool(e.x+rnd(-4,4),e.y+rnd(-2,2),10,4);
    if(d<e.r+8&&golemTgt(e))golemHurt(e.tg,enemyDamage(26));else if(d<e.r+8&&pl.inv<=0){hit(26);moveBox(pl,e.cx*16,e.cy*12,4,3);shake(.4,.3)}
    if(Math.hypot(e.x-ox,e.y-oy)<200*dt*.3){e.mt=0;shake(.4,.3);play('slam',0)}
    if(e.mt<=0){e.mode=null;e.cT=rnd(3,4.5)}return true}
  if(e.mode==='up'){e.mt-=dt;e.lh=Math.min(4,(e.lh||0)+dt*9);
    if(Math.random()<dt*40){const a=Math.random()*Math.PI*2;S.parts.push({k:'d',x:e.tx+Math.cos(a)*34,y:e.ty+Math.sin(a)*20,z:1,vx:0,vy:0,vz:3,c:warningColor(),life:.4})}
    if(e.mt<=0){e.mode='down';e.mt=.3;e.x=e.tx;e.y=e.ty}return true}
  if(e.mode==='down'){e.mt-=dt;e.lh=Math.max(0,e.lh-dt*14);if(e.mt<=0){e.lh=0;e.mode=null;e.lT=rnd(6,8);e.atkA=.5;shake(.7,.5);play('slam',0);shockAt(e.x,e.y,.75);
    slamFx(.4,e.x,e.y,.08,70/8);if(DEC.crack)decalAt(DEC.crack[2],e.x,e.y);pool(e.x,e.y,30,10);if(Math.hypot(pl.x-e.x,pl.y-e.y)<70)hit(26);
    for(let i=0;i<30;i++){const a=i/30*Math.PI*2;S.parts.push({k:'d',x:e.x+Math.cos(a)*14,y:e.y+Math.sin(a)*7,z:1,vx:Math.cos(a)*110,vy:Math.sin(a)*55,vz:20,c:Math.random()<.5?P.blood:P.st3,life:.6})}}return true}
  if(e.atkT>0)return false;
  e.cT-=dt;if(e.enraged)e.lT-=dt;
  if(e.enraged&&e.lT<=0&&d<230){e.mode='up';e.mt=.9;e.tx=e.x+dx;e.ty=e.y+dy;play('bossGrowl',0);return true}
  if(e.cT<=0&&d>56&&d<240){e.mode='wind';e.mt=.7;e.cx=dx/d;e.cy=dy/d;play('bossGrowl',0);shake(.15,.6);return true}
  return false}
// chapter IV behaviours; return true when the enemy is done for this frame
const CZAI={
  // crossbowman keeps his distance and shoots bolts
  xbow(e,dx,dy,d,dt,hw){e.cast=(e.cast===undefined?rnd(1,2.5):e.cast)-dt;
    if(e.aim>0){e.aim-=dt;if(e.aim<=0&&d>1&&sight(e.x,e.y,e.x+dx,e.y+dy)){e.atkA=.35;S.eproj.push({source:{type:e.type,chapter:CH},x:e.x,y:e.y,vx:dx/d*110,vy:dy/d*110,life:2.2,bolt:1,dm:4/* 24.11.2026 (autor): bylo 6 */});play('swing',.2)}}
    else if(d<170&&e.cast<=0&&sight(e.x,e.y,e.x+dx,e.y+dy)&&(S.enemyShotCd||0)<=0){e.aim=SL.aim;e.cast=rnd(7,8.5)/* 24.11.2026: rzadziej, bylo 5-6 s */;S.enemyShotCd=SL.shotGap+SL.aim;telegraph(e)}
    /* 24.11.2026 (autor): cofa sie dopiero z bliska i o polowe wolniej (bylo: od 45 pelna predkoscia) */if(d<32){moveBox(e,-dx/d*e.spd*.5*dt,-dy/d*e.spd*.5*dt,hw,3);e.walk+=dt*.5;return true}if(d<125){e.walk+=dt*.3;return true}return false},
  // chapter V: the scribe shoots like the crossbowman, the account wraith drains coins on touch
  // chapter V: the debtor throws a chain and drags the hero to him
  debtor(e,dx,dy,d,dt){e.chCd=(e.chCd===undefined?rnd(3,6):e.chCd)-dt;
    if(e.chT>0){e.chT-=dt;if(e.chT<=0){const a=e.chainAim,along=dx*a[0]+dy*a[1],side=Math.abs(dx*a[1]-dy*a[0]);if(pl.inv>0||pl.roll>0||d>140||along<0||side>15||!sight(e.x,e.y,pl.x,pl.y)){e.chCd=4;ftx((EN?'Chain missed':'Łańcuch chybił'),e.x,e.y,2,'i')}else e.pull=.3}return true}
    if(e.pull>0){if(pl.inv>0||pl.roll>0||d>150||!sight(e.x,e.y,pl.x,pl.y)){e.pull=0;e.chCd=5;return true}e.pull-=dt;moveBox(pl,-dx/d*140*dt,-dy/d*140*dt,4,3);
      for(let i=1;i<=8;i++){const t=i/8;S.parts.push({k:'d',x:e.x+(pl.x-e.x)*t,y:e.y+(pl.y-e.y)*t,z:8,vx:0,vy:0,vz:0,c:'#dce7ef',life:.1})}
      if(e.pull<=0||d<e.r+8){e.pull=0;e.chCd=rnd(6,8);if(d<e.r+14)hurtPlayer(enemyDamage(8),dx/d,dy/d,e)}return true}
    if(!golemTgt(e)&&d>46&&d<125&&e.chCd<=0&&pl.inv<=0&&sight(e.x,e.y,pl.x,pl.y)){e.chainAim=[dx/d,dy/d];e.chT=.7;e.chCd=6;telegraph(e);return true}return false},
  wraith(e,dx,dy,d,dt){e.dcd=(e.dcd||0)-dt;
    if(e.drainWind>0){e.drainWind-=dt;if(e.drainWind<=0&&d<e.r+14){S.attacker=e;const hit=hitT(e,enemyDamage(e.dmg,SL.dmgDiv),dx/d,dy/d);S.attacker=null;if(hit&&S.coins>0){const n=Math.min(S.coins,3+Math.floor(Math.min(S.t,NIGHT)/NIGHT*4));S.coins-=n;e.stolen=(e.stolen||0)+n;ftInfo('−'+n+(EN?' coins — you will get them back after the fight':' monet — odzyskasz je po walce'))}}return true}
    if(d<e.r+9&&e.dcd<=0&&(golemTgt(e)||pl.inv<=0)){e.drainWind=.6;e.dcd=2.5;telegraph(e);return true}return false},

  // drowned corpse grabs and holds the hero for a moment
  drowner(e,dx,dy,d,dt){e.gcd=(e.gcd||0)-dt;
    {if(e.tw>0){e.tw-=dt;if(e.tw>0)return false;if(d>=e.r+14||(!golemTgt(e)&&pl.inv>0))return false}else if(d<e.r+8&&e.gcd<=0&&(golemTgt(e)||pl.inv<=0)){e.tw=.3;e.gcd=2.6;telegraph(e);return false}else return false}
    {e.gcd=2.6;e.atkA=.45;if(golemTgt(e)){golemHurt(e.tg,enemyDamage(9,SL.dmgDiv));return false}S.snare=.8;hurtPlayer(enemyDamage(9,SL.dmgDiv),dx/d,dy/d,e);for(let i=0;i<10;i++)S.parts.push({k:'d',x:pl.x+rnd(-6,6),y:pl.y,z:rnd(0,6),vx:rnd(-20,20),vy:0,vz:rnd(10,24),c:'#2e3e3a',life:.5})}return false},
  // nightmare drains a stamina charge on touch
  zmora(e,dx,dy,d,dt){e.dcd=(e.dcd||0)-dt;const zg=golemTgt(e);if(!zg&&(pl.inv>0||pl.roll>0))return false;
    {if(e.tw>0){e.tw-=dt;if(e.tw>0)return false;if(d>=e.r+14)return false}else if(d<e.r+8&&e.dcd<=0){e.tw=.3;e.dcd=2.2;telegraph(e);return false}else return false}
    {e.dcd=2.2;e.atkA=.4;if(zg)golemHurt(e.tg,enemyDamage(e.dmg,SL.dmgDiv));else{pl.sta=Math.max(0,pl.sta-35);pl.staDelay=1;S.stamFlash=.5}}return false},
  // false will-o'-wisp waits; when you come close it flares and bursts
  wisp(e,dx,dy,d,dt){e.walk+=dt;if(e.boom>0){e.boom-=dt;if(e.boom<=0){if(d<38)hurtPlayer(enemyDamage(14),dx/d,dy/d,e);shake(.2,.25);play('fire',0);for(let i=0;i<26;i++){const a=i/26*Math.PI*2;S.parts.push({k:'e',x:e.x,y:e.y,z:8,vx:Math.cos(a)*90,vy:Math.sin(a)*50,vz:rnd(5,25),c:Math.random()<.5?'#7fffd0':'#d8ffe8',life:rnd(.3,.6)})}e.xp=0;e.hp=0;killEnemy(e,0,1)}return true}
    if(d<30){e.boom=.55;play('pick',0)}return true},
  // horned demon charges with lowered horns
  bies(e,dx,dy,d,dt,hw){e.cT=(e.cT===undefined?2:e.cT)-dt;
    if(e.mode==='wind'){e.mt-=dt;if(e.mt<=0){e.mode='charge';e.mt=.65;play('roll',0)}return true}
    if(e.mode==='charge'){e.mt-=dt;const ox=e.x,oy=e.y;moveBox(e,e.cx*175*dt,e.cy*175*dt,hw,3);e.walk+=dt*3;if(d<e.r+8&&golemTgt(e))golemHurt(e.tg,enemyDamage(22));else if(d<e.r+8&&pl.inv<=0){hurtPlayer(enemyDamage(22),e.cx,e.cy,e);moveBox(pl,e.cx*12,e.cy*9,4,3)}
      if(e.mt<=0||Math.hypot(e.x-ox,e.y-oy)<175*dt*.3){e.mode=null;e.cT=rnd(3,4.5)}return true}
    if(e.cT<=0&&d>40&&d<190){e.mode='wind';e.mt=.6;e.cx=dx/d;e.cy=dy/d;play('growl',0);return true}return false},
  leszy:leszyAI,strzyga:strzygaAI,glizzard:glizzardAI};
// Leszy, Lord of the Wild Wood: calls wolves, strikes with roots from below, steps into one tree and out of another
function leszyAI(e,dx,dy,d,dt){
  if(Math.random()<dt*5)S.parts.push({k:'m',x:e.x+rnd(-10,10),y:e.y+rnd(-3,3),z:rnd(20,50),vx:rnd(-4,4),vy:0,vz:rnd(-6,-2),c:Math.random()<.5?'#4a5e3a':'#3a2a1c',life:rnd(1,2)});
  e.sT=(e.sT===undefined?3:e.sT)-dt;e.rT=(e.rT===undefined?2:e.rT)-dt;e.tT=(e.tT===undefined?7:e.tT)-dt;
  if(e.mode==='merge'){e.mt-=dt;e.inv=1;if(e.mt<=0){const tr=(W.treeP||[]).filter(q=>{const k=Math.hypot(q.x-pl.x,q.y-pl.y);return k>60&&k<170}),q=tr[(Math.random()*tr.length)|0];
      if(q){e.x=q.x+rnd(-4,4);e.y=q.y+8}e.mode='emerge';e.mt=.6;play('rise',0)}return true}
  if(e.mode==='emerge'){e.mt-=dt;if(e.mt<=0){e.mode=null;e.inv=0}return true}
  if(e.mode==='summon'){e.mt-=dt;if(e.mt<=0){e.mode=null;for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2;spawnEnemy('wolf',e.x+Math.cos(a)*30,e.y+Math.sin(a)*20,{rise:.4})}}return true}
  if(e.mode==='root'){e.mt-=dt;if(Math.random()<dt*40){const a=Math.random()*Math.PI*2;S.parts.push({k:'d',x:e.tx+Math.cos(a)*30,y:e.ty+Math.sin(a)*18,z:1,vx:0,vy:0,vz:3,c:warningColor(),life:.4})}
    if(e.mt<=0){e.mode=null;e.atkA=.4;shake(.3,.3);play('quake',0);if(DEC.crack)decalAt(DEC.crack[(Math.random()*4)|0],e.tx,e.ty);if(Math.hypot(pl.x-e.tx,pl.y-e.ty)<32)hurtPlayer(enemyDamage(18),0,1,e);
      for(let i=0;i<26;i++){const a=Math.random()*Math.PI*2;S.parts.push({k:'d',x:e.tx+Math.cos(a)*rnd(0,22),y:e.ty+Math.sin(a)*rnd(0,13),z:1,vx:Math.cos(a)*20,vy:0,vz:rnd(30,70),c:Math.random()<.6?'#3a2a1c':'#5a4330',life:rnd(.5,.9)})}}return true}
  if(e.atkT>0)return false;
  if(e.tT<=0&&d>60&&W.treeP&&W.treeP.length){e.mode='merge';e.mt=.8;e.tT=rnd(8,11);return true}
  if(e.sT<=0){e.mode='summon';e.mt=.9;e.sT=rnd(10,13);play('howl',0);return true}
  if(e.rT<=0&&d<220){e.mode='root';e.mt=.9;e.tx=e.x+dx;e.ty=e.y+dy;e.rT=rnd(4,5.5);play('bossGrowl',0);return true}
  return false}
// Glizzard, the Glizzy G-Lord (act II mini-boss after the talk with Tharm's ghost): kites the hero, throws fans of sausages (they burst into mustard),
// lobs a delayed mustard bomb at the hero's position, curls up and pops away when pressed, and in the second half (below 50% health) throws more and faster.
function mustardSplash(x,y,sz){const f=A.glzFx;if(f&&f.splash)addVfx(f.splash,.5,x,y,.5,1.5*sz,'bill');for(let k=0;k<14;k++){const a=Math.random()*Math.PI*2;S.parts.push({k:'d',x,y,z:8,vx:Math.cos(a)*rnd(10,60)*sz,vy:Math.sin(a)*rnd(5,30)*sz,vz:rnd(10,50),c:k%3?'#e8b830':'#a8321c',life:rnd(.3,.7)})}}
function glizzSausage(e,ang,spd,dm){const f={source:{type:e.type,chapter:CH},x:e.x,y:e.y,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,life:2.6,ph:Math.random(),sau:1,dm,anim:A.glzFx&&A.glzFx.fly};if(f.anim)f.mesh=(()=>{const m=new THREE.Mesh(geoC,f.anim[0].n);scene.add(m);return m})();S.eproj.push(f)}
function glizzardAI(e,dx,dy,d,dt,hw){
  const P=!!e.ph2;e.moving=false;e.gcd=(e.gcd===undefined?1.6:e.gcd)-dt;e.curlCd=(e.curlCd===undefined?4:e.curlCd)-dt;
  if(!P&&e.hp<e.max*.5){e.ph2=1;e.mode='roar';e.mt=1;e.spd*=1.15;play('bossGrowl',0);shake(.3,.5);say((EN?'Glizard bristles with fury. The sausages fly thicker now.':'Glizzard jeży się z wściekłości. Kiełbasy lecą gęściej.'))}
  if(e.mode==='roar'){e.mt-=dt;if(e.mt<=0)e.mode=null;return true}
  if(e.mode==='curl'){e.mt-=dt;e.inv=Math.max(e.inv||0,.1);if(e.mt<=0){const p=ringSpot(95,150);mustardSplash(e.x,e.y,.6);if(p){e.x=p[0];e.y=p[1]}mustardSplash(e.x,e.y,.6);e.mode=null;e.inv=0;e.gcd=Math.min(e.gcd,.6);play('rise',0)}return true}
  if(e.mode==='tell'){e.mt-=dt;e.moving=false;
    if(e.atk==='bomb'&&Math.random()<dt*40){const a=Math.random()*Math.PI*2;S.parts.push({k:'d',x:e.bx+Math.cos(a)*24,y:e.by+Math.sin(a)*14,z:1,vx:0,vy:0,vz:3,c:warningColor(),life:.4})}
    if(e.mt<=0){e.mode=null;e.atkA=.35;e.gcd=P?1.5:2.3;
      if(e.atk==='bomb'){const bx=e.bx,by=e.by;play('swing',.2);S.delayed.push({t:.25,fn:()=>{if(e.dead)return;mustardSplash(bx,by,1.6);shake(.2,.25);play('quake',0);aoeP(e,30,enemyDamage(16),bx,by);for(let k=0;k<2;k++){const a=Math.random()*Math.PI*2;if(P)S.delayed.push({t:.3+k*.25,fn:()=>{if(e.dead)return;const x=bx+Math.cos(a)*34,y=by+Math.sin(a)*20;if(!solidAt(x,y)){mustardSplash(x,y,1.1);aoeP(e,20,enemyDamage(10),x,y)}}})}}})}
      else{const n=P?5:3,sp=P?.26:.3;for(let i=0;i<n;i++)glizzSausage(e,e.aimA+(i-(n-1)/2)*sp,98,7);play('swing',.2)}}
    return true}
  if(d<62){moveBox(e,-dx/d*e.spd*1.1*dt,-dy/d*e.spd*1.1*dt,hw,3);e.walk+=dt;e.moving=true}
  else if(d>140){moveBox(e,dx/d*e.spd*dt,dy/d*e.spd*dt,hw,3);e.walk+=dt;e.moving=true}
  if(d<36&&e.curlCd<=0){e.mode='curl';e.mt=.55;e.curlCd=rnd(6,8);return true}
  if(e.gcd<=0&&d<240&&sight(e.x,e.y,e.x+dx,e.y+dy)){e.cnt=(e.cnt||0)+1;e.atk=e.cnt%3===0?'bomb':'fan';e.mode='tell';e.mt=e.atk==='bomb'?.85:.6;e.aimA=Math.atan2(dy,dx);e.bx=pl.x;e.by=pl.y;telegraph(e);play('swing',.2)}
  return true}
// the Strzyga Mother: first soul flies, screams (slows you) and dives with her talons; second soul crawls, leaps and raises barrow wights
function strzygaAI(e,dx,dy,d,dt){
  if(Math.random()<dt*8)S.parts.push({k:'d',x:e.x+rnd(-18,18),y:e.y+rnd(-6,6),z:rnd(20,50),vx:rnd(-20,20),vy:0,vz:rnd(-2,8),c:'#141014',life:rnd(.6,1.2)});
  if(e.trans>0){e.trans-=dt;if(e.trans<=0){e.phase=2;e.spd=30;e.roarT=1.2;e.lT=2.5;e.wT=4;play('bossGrowl',0);shake(.4,.8);say(e.dgBoss?DG_PHASE.strzyga2:(EN?'The Striga rises onto all fours. The second heart beats faster.':'Strzyga podnosi się na czworaki. Drugie serce bije szybciej.'))}return true}
  if(e.roarT>0){e.roarT-=dt;return true}
  if(e.phase!==2){e.scT=(e.scT===undefined?4:e.scT)-dt;e.cT=(e.cT===undefined?3:e.cT)-dt;e.bT=(e.bT===undefined?7:e.bT)-dt;
    if(e.mode==='scream'){e.mt-=dt;if(e.mt<=0){e.mode=null;if(Math.hypot(pl.x-e.x,pl.y-e.y)<180){S.slowT=2.5;ftInfo((EN?'Slow':'Spowolnienie'))}for(let i=0;i<36;i++){const a=i/36*Math.PI*2;S.parts.push({k:'d',x:e.x+Math.cos(a)*10,y:e.y+Math.sin(a)*6,z:16,vx:Math.cos(a)*140,vy:Math.sin(a)*70,vz:0,c:'#c8d2dc',life:.6})}}return true}
    if(e.mode==='wind'){e.mt-=dt;if(e.mt<=0){e.mode='dive';e.mt=.5}return true}
    if(e.mode==='dive'){e.mt-=dt;e.x+=e.cx*190*dt;e.y+=e.cy*190*dt;e.x=Math.max(30,Math.min(WW-30,e.x));e.y=Math.max(30,Math.min(WH-30,e.y));if(d<e.r+8&&golemTgt(e))golemHurt(e.tg,enemyDamage(22));else if(d<e.r+8&&pl.inv<=0)hurtPlayer(enemyDamage(22),e.cx,e.cy,e);if(e.mt<=0){e.mode=null;e.cT=rnd(3,4.5)}return true}
    if(e.scT<=0&&d<170){e.mode='scream';e.mt=.8;e.scT=rnd(7,9);play('bossGrowl',0);return true}
    if(e.bT<=0){e.bT=rnd(9,12);for(let i=0;i<4;i++)spawnEnemy('bat',e.x+rnd(-20,20),e.y+rnd(-12,12))}
    if(e.cT<=0&&d>40&&d<210){e.mode='wind';e.mt=.45;e.cx=dx/d;e.cy=dy/d;play('growl',0);return true}
    return false}
  e.lT-=dt;e.wT-=dt;
  if(e.mode==='up'){e.mt-=dt;e.lh=Math.min(4,(e.lh||0)+dt*9);if(Math.random()<dt*40){const a=Math.random()*Math.PI*2;S.parts.push({k:'d',x:e.tx+Math.cos(a)*34,y:e.ty+Math.sin(a)*20,z:1,vx:0,vy:0,vz:3,c:warningColor(),life:.4})}
    if(e.mt<=0){e.mode='down';e.mt=.3;e.x=e.tx;e.y=e.ty}return true}
  if(e.mode==='down'){e.mt-=dt;e.lh=Math.max(0,e.lh-dt*14);if(e.mt<=0){e.lh=0;e.mode=null;e.atkA=.5;shake(.6,.5);play('slam',0);shockAt(e.x,e.y,.75);slamFx(.4,e.x,e.y,.08,64/8);if(Math.hypot(pl.x-e.x,pl.y-e.y)<62)hurtPlayer(enemyDamage(24),0,1,e);pool(e.x,e.y,24,8)}return true}
  if(e.mode==='raise'){e.mt-=dt;if(Math.random()<dt*30)S.parts.push({k:'m',x:e.x+rnd(-40,40),y:e.y+rnd(-20,20),z:0,vx:0,vy:0,vz:rnd(6,14),c:'#4a7a5a',life:rnd(.6,1.2)});if(e.mt<=0){e.mode=null;for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2;spawnEnemy('wight',e.x+Math.cos(a)*44,e.y+Math.sin(a)*26,{rise:1})}play('rise',0)}return true}
  if(e.atkT>0)return false;
  if(e.lT<=0&&d<240){e.mode='up';e.mt=.8;e.tx=e.x+dx;e.ty=e.y+dy;e.lT=rnd(4.5,6);play('bossGrowl',0);return true}
  if(e.wT<=0){e.mode='raise';e.mt=1;e.wT=rnd(11,14);play('growl',0);return true}
  return false}
const warningColor=()=>SETT.contrast?'#ffe270':'#ff5a4e';
function telegraph(e){S.parts.push({k:'e',x:e.x,y:e.y,z:26,vx:0,vy:0,vz:4,c:warningColor(),life:.45});e.atkA=.2}
// Runda 212: sparowany pocisk wroga wraca i zawsze trafia najbliższego wroga (naprowadzany, przelatuje nad ścianami).
function nearestFoe(x,y){let b=null,bd=1e9;for(const e of S.enemies){if(e.dead||e.rise>0||e.trans>0)continue;const d=Math.hypot(e.x-x,e.y-y);if(d<bd){bd=d;b=e}}return b}
function updEproj(dt){const _pl=pl;try{updEprojX(dt)}finally{pl=_pl}}
function updEprojX(dt){S.enemyShotCd=Math.max(0,(S.enemyShotCd||0)-dt);for(let i=S.eproj.length-1;i>=0;i--){const f=S.eproj[i];if(pl2)pl=pickTarget(f);f.life-=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;
  if(f.bolt){const ar=!!(f.source&&(f.source.type==='xbow'||f.source.type==='scribe'));if(!f.vfe&&skFrames(ar?'bolt':'boss')){addVfx(skLoop(skFrames(ar?'bolt':'boss'),f.life,10),f.life,f.x,f.y,.5,ar?.95:.8,'bill',-screenAng(f.vx,f.vy));f.vfe=S.vfx[S.vfx.length-1]}if(f.vfe){f.vfe.x=f.x;f.vfe.y=f.y}}
  if(f.bolt)S.parts.push({k:'d',x:f.x,y:f.y,z:9,vx:0,vy:0,vz:0,c:'#d8cfb8',life:.12});
  else if(f.sau){if(Math.random()<.6)S.parts.push({k:'d',x:f.x+rnd(-2,2),y:f.y+rnd(-1,1),z:9+rnd(-2,2),vx:rnd(-4,4),vy:0,vz:rnd(-2,4),c:Math.random()<.5?'#e8b830':'#a8321c',life:rnd(.2,.4)})}
  else for(let k=0;k<(f.mesh?1:3);k++)S.parts.push({k:'e',x:f.x+rnd(-2,2),y:f.y+rnd(-1,1),z:9+rnd(-2,2),vx:rnd(-4,4),vy:0,vz:rnd(2,8),c:k?'#ff6a1a':'#ffb347',life:rnd(.15,.35)});
  let gone=f.life<=0||solidAt(f.x,f.y);
  if(f.ref){let e=f.tgt;if(!e||e.dead||!S.enemies.includes(e))e=f.tgt=nearestFoe(f.x,f.y);gone=!e;
    if(e){const dx=e.x-f.x,dy=e.y-f.y,d=Math.hypot(dx,dy)||1;f.vx=dx/d*f.spd;f.vy=dy/d*f.spd;f.life=Math.max(f.life,.2);if(f.vfe)f.vfe.rot=-screenAng(f.vx,f.vy);
      if(d<(e.r||6)+5){const oM=ftMelee,oC=ftCrit;ftMelee=false;ftCrit=true;try{damageEnemy(e,f.dmg,dx/d,dy/d,.6,'parry')}finally{ftMelee=oM;ftCrit=oC}try{play('deflectHit',.06)}catch(_){}gone=true}}
    if(!gone)continue}
  {const G=S.swordGuardian;if(!gone&&G&&!G.gone&&Math.hypot(G.x-f.x,G.y-f.y)<SL.guard.r+3){golemHurt(G,enemyDamage(f.dm||(f.bolt?6:7),SL.projDiv));gone=true}}
  if(!gone&&!pl.dead&&Math.hypot(pl.x-f.x,pl.y-f.y)<8){const sp=Math.hypot(f.vx,f.vy)||1,nx=f.vx/sp,ny=f.vy/sp;
    if(pl.block&&pl.inv<=0&&-(pl.fx*nx+pl.fy*ny)>.3&&pl.blockT<parryWin()){onParry();pl.parryT=.45;S.hitstop=.12;padRumble(.6,.3,140);guardFeedback('parry',nx,ny,f);shake(.15,.15);ftInfo((EN?'Deflected!':'Odbicie!'));
      const tg=nearestFoe(f.x,f.y);if(tg){f.ref=1;f.tgt=tg;f.spd=Math.max(240,sp*1.4);f.dmg=SL.light.dmg[0]*lvlMul()*(S.str||1)*might()*riMul();f.life=5;f.x=pl.x;f.y=pl.y;if(f.vfe){f.vfe.t=f.vfe.dur;f.vfe=null}}}
    else hurtPlayer(enemyDamage(f.dm||(f.bolt?6:7),SL.projDiv),nx,ny,f.source||(f.bolt?'night':'fire'));gone=!f.ref}
  if(gone&&f.bolt){if(f.vfe)f.vfe.t=f.vfe.dur;if(f.source&&(f.source.type==='xbow'||f.source.type==='scribe'))skAdd('boltHit',.3,f.x,f.y,.5,.7,'bill');for(let k=0;k<5;k++)S.parts.push({k:'d',x:f.x,y:f.y,z:8,vx:rnd(-30,30),vy:rnd(-15,15),vz:rnd(5,20),c:'#9d9584',life:.3});S.eproj.splice(i,1);continue}
  if(gone&&f.sau){mustardSplash(f.x,f.y,1);if(f.mesh)scene.remove(f.mesh);S.eproj.splice(i,1);continue}
  if(gone){for(let k=0;k<12;k++)S.parts.push({k:'e',x:f.x,y:f.y,z:8,vx:rnd(-40,40),vy:rnd(-25,25),vz:rnd(5,30),c:Math.random()<.5?'#ff6a1a':'#ffb347',life:rnd(.2,.5)});if(f.mesh)scene.remove(f.mesh);if(f.vfe)f.vfe.t=f.vfe.dur;S.eproj.splice(i,1)}}}
// player sword strikes (light/heavy, cascade, whirl) are stopped only by walls/cliffs, not by prop tiles (31) whose collision box is bigger than the sprite (cache 200)
function sightSword(x0,y0,x1,y1){const n=Math.ceil(Math.hypot(x1-x0,y1-y0)/8);for(let i=1;i<n;i++){const px=x0+(x1-x0)*i/n,py=y0+(y1-y0)*i/n,t=tileAt(Math.floor(px/TS),Math.floor(py/TS));if(t!==31&&SOLID.has(t))return false}return true}
// Nawigacja wrogów: mapa odległości po kaflach (BFS) od bohatera, odświeżana co 0,35 s.
// Wróg, który nie widzi bohatera przez ścianę, idzie po niej: wychodzi z domów drzwiami i obchodzi przeszkody.
const NAV={d:null,q:null,t:0};
function navUpdate(dt){NAV.t-=dt;if(NAV.t>0||!pl)return;NAV.t=.35;const n=MW*MH;if(!NAV.d||NAV.d.length!==n){NAV.d=new Int16Array(n);NAV.q=new Int32Array(n)}
  const D=NAV.d,Q=NAV.q,tx=Math.floor(pl.x/TS),ty=Math.floor(pl.y/TS);D.fill(-1);if(tx<0||ty<0||tx>=MW||ty>=MH)return;const HO=W.heroOnly,pin=!!HO&&HO.has(ty*MW+tx);if(pin&&!S.sanctMsg&&(shelterAt(pl.x,pl.y)||{}).kind!=='shop'){S.sanctMsg=1;const hs=shelterAt(pl.x,pl.y),lf=hs&&S.shelT&&S.shelT[hs.kind]!==undefined&&!SHELTER_OFF?Math.ceil(S.shelT[hs.kind]):0;say(lf?(EN?`A safe roof, for ${lf} s more tonight. Here your blade stays sheathed, and the night waits outside.`:`Bezpieczny dach, jeszcze ${lf} s tej nocy. Tu broń milczy, a noc czeka na zewnątrz.`):(EN?'A safe roof. Here your blade stays sheathed, and the night waits outside.':'Bezpieczny dach. Tu broń milczy, a noc czeka na zewnątrz.'))}else if(!pin)S.sanctMsg=0;let h=0,t=0;D[ty*MW+tx]=0;Q[t++]=ty*MW+tx;
  while(h<t){const c=Q[h++],cx=c%MW,cy=(c/MW)|0,v=D[c]+1;
    if(cx>0&&D[c-1]<0&&!SOLID.has(tileAt(cx-1,cy))&&!(HO&&!pin&&HO.has(c-1))){D[c-1]=v;Q[t++]=c-1}
    if(cx<MW-1&&D[c+1]<0&&!SOLID.has(tileAt(cx+1,cy))&&!(HO&&!pin&&HO.has(c+1))){D[c+1]=v;Q[t++]=c+1}
    if(cy>0&&D[c-MW]<0&&!SOLID.has(tileAt(cx,cy-1))&&!(HO&&!pin&&HO.has(c-MW))){D[c-MW]=v;Q[t++]=c-MW}
    if(cy<MH-1&&D[c+MW]<0&&!SOLID.has(tileAt(cx,cy+1))&&!(HO&&!pin&&HO.has(c+MW))){D[c+MW]=v;Q[t++]=c+MW}}}
function navReach(x,y){const D=NAV.d;if(!D)return true;const tx=Math.floor(x/TS),ty=Math.floor(y/TS);return tx>=0&&ty>=0&&tx<MW&&ty<MH&&D[ty*MW+tx]>=0}
const NAV8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function navDir(e){const D=NAV.d;if(!D)return null;const ex=Math.floor(e.x/TS),ey=Math.floor(e.y/TS);if(ex<0||ey<0||ex>=MW||ey>=MH)return null;const here=D[ey*MW+ex];if(here<=0)return null;let best=here,bx=0,by=0;
  for(const [ox,oy] of NAV8){const nx=ex+ox,ny=ey+oy;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const v=D[ny*MW+nx];if(v<0||v>=best)continue;if(ox&&oy&&(D[ey*MW+nx]<0||D[ny*MW+ex]<0))continue;best=v;bx=ox;by=oy}
  if(!bx&&!by)return null;const cx=(ex+bx+.5)*TS-e.x,cy=(ey+by+.5)*TS-e.y,l=Math.hypot(cx,cy)||1;return [cx/l,cy/l]}
function sight(x0,y0,x1,y1){const n=Math.ceil(Math.hypot(x1-x0,y1-y0)/8);for(let i=1;i<n;i++)if(solidAt(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n))return false;return true}
/* 23.11.2026 (runda 866, zgoda autora): goscie, czyli potwory z innych rozdzialow wplatane w fale (typ, szansa na jedno miejsce, od sekundy nocy). Port ma wlasne skorki zalogi, wiec bez gosci. */
const GUEST={1:[['madman',.06,60],['dwarf',.04,200]],2:[['possessed',.07,0],['militia',.05,120]],3:[['ghoul',.05,60],['shieldman',.05,90],['monk',.04,150]],4:[['possessed',.05,20],['ghoul',.05,60],['gravedigger',.04,150]],5:[['knight',.05,90],['rotknight',.04,150],['marauder',.04,200]]};
function guestType(t){if(!S||S.dg||S.train)return null;for(const [k,c,from] of GUEST[CH]||[])if(t>=from&&Math.random()<c&&A[k]&&ET[k])return k;return null}
function spawnTick(dt){const n0=S?S.enemies.length:0;spawnTick0(dt);try{champRoll(n0)}catch(e){quietErr('champ',e)}}
/* 23.11.2026 (zgoda autora): cechy elit i czempioni. Kazda elita dostaje jedna ceche; po polnocy czesc zwyklych wrogow
   wychodzi jako czempion (2-7% nowych, najwyzej 3 naraz): wiecej zycia, bordowa poswiata, nazwa z cecha nad glowa.
   Cechy: Pancerz (szybkie ciosy -45%, silne, krytyki i ogluszenie przebijaja), Szal (szybszy i mocniejszy),
   Wezwanie (co 9 s przyzywa dwoch wrogow), Wybuch (po smierci wybucha po 0,9 s ostrzezenia). EN niezatwierdzone. */
const AFX={pancerz:{n:(EN?'Armoured':'Pancerz'),c:'#8fb8ff'},szal:{n:(EN?'Enraged':'Szał'),c:'#ff5a6a'},wezwanie:{n:(EN?'Summoner':'Wezwanie'),c:'#c08cff'},wybuch:{n:(EN?'Volatile':'Wybuch'),c:'#ff9a3a'}};
function setAffix(e,k){k=k||Object.keys(AFX)[(Math.random()*4)|0];e.affix=k;if(k==='szal'){e.spd*=1.3;e.dmg*=1.15}if(k==='wezwanie')e.sumT=4;return e}
function champRoll(n0){if(!S||S.t<BREAK_AT||S.dg||S.train||S.stage==='break')return;let alive=0;for(const o of S.enemies)if(o.champ&&!o.dead)alive++;if(alive>=3)return;
 const p=.02+.02*Math.min(1,(S.t-BREAK_AT)/(NIGHT-BREAK_AT));for(let i=n0;i<S.enemies.length&&alive<3;i++){const e=S.enemies[i];if(!e||e.dead||e.mini||e.champ||e.named||BIG.has(e.type)||['collector','boginka','wisp','bat','paperrat','courtraven','glizzard'].includes(e.type))continue;if(Math.random()>=p)continue;
  e.champ=true;e.hp*=2.2;e.max*=2.2;e.dmg*=1.25;e.xp*=3;e.s=(e.s||1)*1.12;setAffix(e);alive++;try{play('champ',1.2);if(e.affix==='szal')play('afxRage',.8)}catch(_){}}}
function affixDeath(e){if(e.affix!=='wybuch')return;(S.blasts||(S.blasts=[])).push({x:e.x,y:e.y,t:.9,r:44,dmg:enemyDamage(e.dmg*1.3),e:0});try{play('blastWarn',.1)}catch(_){}ftx(AFX.wybuch.n+'!',e.x,e.y,ftEntH(e)+.6,'i')}
function affixTick(dt){if(!S)return;
 for(const e of S.enemies){if(e.affix!=='wezwanie'||e.dead||e.rise>0)continue;e.sumT-=dt;if(e.sumT>0)continue;e.sumT=9;let alive=0;const pool=[];for(const o of S.enemies)if(!o.dead&&o.type!=='wisp'){alive++;if(!o.mini&&!o.champ&&!BIG.has(o.type)&&o.type!=='collector'&&o.type!=='boginka'&&o.type!=='bat')pool.push(o.type)}
  if(alive>spawnTarget()+6)continue;const ty=pool.length?pool[(Math.random()*pool.length)|0]:e.type;for(let k=0;k<2;k++){const a=Math.random()*6.283,x=e.x+Math.cos(a)*22,y=e.y+Math.sin(a)*14;if(solidAt(x,y))continue;try{spawnEnemy(ty,x,y,{rise:1})}catch(_){}}
  ftx(AFX.wezwanie.n+'!',e.x,e.y,ftEntH(e)+.6,'i');try{play('afxSummon',.3)}catch(_){}for(let i=0;i<14;i++){const an=Math.random()*6.283;S.parts.push({k:'e',x:e.x,y:e.y,z:rnd(4,14),vx:Math.cos(an)*rnd(30,70),vy:Math.sin(an)*rnd(20,45),vz:rnd(6,20),c:AFX.wezwanie.c,life:rnd(.35,.7)})}}
 const B=S.blasts;if(!B||!B.length)return;for(let i=B.length-1;i>=0;i--){const b=B[i];b.t-=dt;b.e-=dt;
  if(b.e<=0&&b.t>0){b.e=.07;for(let k=0;k<14;k++){const a=k/14*6.283+Math.random()*.2;S.parts.push({k:'e',x:b.x+Math.cos(a)*b.r,y:b.y+Math.sin(a)*b.r*.62,z:2,vx:0,vy:0,vz:rnd(4,12),c:k%2?AFX.wybuch.c:'#ffd08a',life:.16})}}
  if(b.t<=0){B.splice(i,1);shake(.16,.45);try{play('blast',.06)}catch(_){}for(let k=0;k<34;k++){const a=Math.random()*6.283,sp=rnd(40,120);S.parts.push({k:'e',x:b.x,y:b.y,z:rnd(4,16),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp*.62,vz:rnd(10,40),c:k%3?AFX.wybuch.c:'#fff1c0',life:rnd(.3,.65)})}
   if(!pl.dead&&Math.hypot((pl.x-b.x),(pl.y-b.y)*1.6)<b.r){const d=Math.hypot(pl.x-b.x,pl.y-b.y)||1;hurtPlayer(b.dmg,(pl.x-b.x)/d,(pl.y-b.y)/d)}
   if(pl2&&!pl2.dead&&Math.hypot((pl2.x-b.x),(pl2.y-b.y)*1.6)<b.r){const d=Math.hypot(pl2.x-b.x,pl2.y-b.y)||1;try{asP2(()=>hurtPlayer(b.dmg,(pl.x-b.x)/d,(pl.y-b.y)/d))}catch(_){}}}}}

function spawnTick0(dt){
  if(pl.dead||S.phase!=='play'||S.opening||S.stage==='break'||S.dg||S.train)return;
  if(!S.endless)for(let i=0;i<SURGE.length;i++)if(S.t>=SURGE[i]&&S.t<SURGE[i]+SURGE_LEN&&!((S.surgeMask||0)&1<<i)){S.surgeMask=(S.surgeMask||0)|1<<i;S.spawnT=0;shake(.12,.5);say(EN?'Onslaught! The dead pour in from every side.':'Napór! Martwi napierają ze wszystkich stron.')}
  S.spawnT-=dt;if(S.spawnT>0)return;S.spawnT=.5;
  const target=spawnTarget();// will-o'-wisps sit far away on the marsh and must not take up places in the cap
  let n=Math.min(5,Math.floor(target-S.enemies.filter(e=>e.type!=='wisp').length));
  while(n-->0){const p=ringSpot()||ringSpot(170,260);if(!p)continue;const r=Math.random(),t=S.t;
    if(CH!==5&&CH!==PORT){const g=guestType(t);if(g){spawnEnemy(g,p[0],p[1]);continue}}
    if(CH===5){if(!sight(p[0],p[1],pl.x,pl.y)){const q=ringSpot(150,230);if(!q||!sight(q[0],q[1],pl.x,pl.y))continue;p[0]=q[0];p[1]=q[1]}
      if(t<12){n=0;continue}
      {const g=guestType(t);if(g){spawnEnemy(g,p[0],p[1]);continue}}
      const rg=W.region(Math.floor(p[0]/TS),Math.floor(p[1]/TS));
      const T={dziedziniec:[['guard',38,0],['condemned',24,0],['courtraven',18,20],['judge',12,45],['cursed',12,90]],kancelaria:[['scribe',25,30],['paperrat',32,0],['guard',20,0],['judge',10,70],['arbiter',9,110],['bookgolem',12,150]],
        sala:[['executioner',12,120],['guard',28,0],['judge',15,60],['scribe',14,30],['condemned',21,0],['cursed',10,100]],skarbiec:[['wraith',42,55],['courtraven',20,20],['guard',24,0],['arbiter',14,100]],
        krypta:[['debtor',52,40],['condemned',28,0],['wraith',20,70]],tron:[['bookgolem',12,100],['executioner',10,120],['guard',22,0],['judge',13,60],['arbiter',12,100],['cursed',8,130],['scribe',11,30],['debtor',24,40]]}[rg]||[['guard',60,0],['condemned',40,0]];
      const pool=T.filter(x=>t>=x[2]),tot=pool.reduce((a,x)=>a+x[1],0);let q=Math.random()*tot,ty=pool[0][0];for(const x of pool){if(q<x[1]){ty=x[0];break}q-=x[1]}
      if(ty==='paperrat'||ty==='courtraven'&&Math.random()<.4){const k=ty==='paperrat'?4:3;for(let i=0;i<k;i++)spawnEnemy(ty,p[0]+rnd(-12,12),p[1]+rnd(-8,8));n-=2;continue}
      spawnEnemy(ty,p[0],p[1]);continue}
    if(CH===4){if(t<15){n=0;continue}const tl=tileAt(Math.floor(p[0]/TS),Math.floor(p[1]/TS));
      if((tl===64||tl===65)&&t>20&&r<.55){spawnEnemy('drowner',p[0],p[1],{rise:0,emerge:.8});continue}
      if(t>30&&r<.14){const k=3+(Math.random()<.4?1:0);for(let i=0;i<k;i++)spawnEnemy('wolf',p[0]+rnd(-12,12),p[1]+rnd(-8,8));n-=2;continue}
      if(t>60&&r<.21){spawnEnemy('zmora',p[0],p[1],{rise:0});continue}
      if(t>200&&r<.25){spawnEnemy('bies',p[0],p[1]);continue}
      if(t>100&&Math.random()<.1){spawnEnemy('goat',p[0],p[1]);continue}
      {const xl=t>150?.33:0,xe=xl+(.47-xl)*.7;if(t>150&&r<.33)spawnEnemy('wight',p[0],p[1]);else if(t>90&&r<xe)spawnEnemy('xbow',p[0],p[1]);else if(t>90&&r<.47)spawnEnemy(['strzygon','bandit','wolf'][Math.floor(Math.random()*3)],p[0],p[1]);else spawnEnemy(t>40&&r<.64?'strzygon':r<.82?'bandit':'wolf',p[0],p[1]);continue}}
    if(CH===PORT){if(S.solne&&S.solne.bossDead){n=0;continue}
      if(t>40&&r<.12){for(let i=0;i<3;i++)spawnEnemy('ghoul',p[0]+rnd(-10,10),p[1]+rnd(-8,8));n-=2;continue}
      {const q=Math.random();spawnEnemy(t>50&&r<.24?(t>120&&q<.45?'knight':'shieldman'):t>35&&r<.5?'ghoul':'possessed',p[0],p[1])}continue}
    if(CH===3){if(t>35&&r<.12){for(let i=0;i<3;i++)spawnEnemy('hound',p[0]+rnd(-10,10),p[1]+rnd(-8,8));n-=2;continue}
      {const q=Math.random();spawnEnemy(t>50&&r<.22?(t>150&&q<.34?'marauder':t>90&&q<.67?'gravedigger':'militia'):t>70&&r<.42?'rotknight':t>35&&r<.62?'hound':'madman',p[0],p[1])}continue}
    if(t>25&&r<.11){for(let i=0;i<3;i++)spawnEnemy('bat',p[0]+rnd(-10,10),p[1]+rnd(-8,8));n-=2;continue}
    if(t>45&&Math.random()<.14){spawnEnemy('shieldman',p[0],p[1]);continue}
    /* 23.11.2026: lagodniejszy start I i II: ghule pozniej i najpierw rzadziej (25% -> 50% do ok. 7. minuty) */const gh=.25+.25*Math.min(1,Math.max(0,t-70)/360);
    if(CH===1)spawnEnemy(t>110&&r<.25?'knight':t>70&&r<gh?'ghoul':'possessed',p[0],p[1]);else spawnEnemy(t>70&&r<.25?'warden':t>55&&r<gh?'ghoul':'dwarf',p[0],p[1])}
}
// ---- elity: 4 na noc (4:15, 10:00, 12:15 i 14:30; w pierwszej nocy nieco później), zwykły wróg z rozdziału, bordowa poświata ----
const ELITE={times:[255,600,735,870],timesFirst:[270,620,750,880],/* 22.11.2026: czwarta elita w koncowce *//* 15.11.2026: noc 16 min; pierwszy i ostatni konczy Napor */t:180,hp:3.5,dmg:1.65,type:{1:'knight',2:'warden',3:'rotknight',4:'bandit',5:'executioner',6:'knight'}};
// 9.11.2026: elity z imieniem: czasem (30%, najwyżej jedna na noc) elita ma imię, własną kartę w Bestiariuszu i jednorazową nagrodę; statystyki jak zwykła elita
const NAMED={1:[['bogumil','Sir Bogumił Wiarołomny','Sir Bogumil the Oathbreaker','Przysięgał bronić osady, a otworzył bramę Zakonowi. Do dziś nosi herb, którego się wyparł.','He swore to hold the settlement, then opened its gate to the Holy Order. He still wears the crest he renounced.'],['dobieslaw','Dobiesław Spopielały','Dobieslaw the Ashen','Spłonął razem z kaplicą, ale zbroja nie pozwoliła mu upaść. Przy każdym kroku sypie się z niej popiół.','He burned with the chapel, but his armour would not let him fall. Ash sifts out of it with every step.'],['wojmir','Wojmir Krwawa Ostroga','Wojmir Bloodspur','Najmłodszy z rycerzy osady. Noc obiecała mu chwałę i dotrzymała słowa po swojemu.','The youngest of the settlement\'s knights. The Night promised him glory, and kept its word in its own fashion.']],
 2:[['gromislaw','Gromisław Żelazna Brama','Gromislaw Irongate','Pilnował krasnoludzkiej bramy przez sto zim. Nikt mu nie powiedział, że może już odejść.','He guarded the dwarven gate for a hundred winters. No one has told him he may stand down.'],['bolko','Bolko Kamiennoręki','Bolko Stonehand','Stracił dłonie w zawale i wykuł sobie nowe z granitu. Teraz bije nimi wszystko, co się rusza.','He lost his hands in a cave-in and cut new ones from granite. Now he uses them on anything that moves.'],['mszczuj','Mszczuj, ostatni klucznik','Mszczuj, the Last Keykeeper','Nosi na szyi klucze do każdych drzwi Dolnego Miasta. Żadne z nich już się nie otwierają.','Round his neck hang the keys to every door in the Lower City. None of them opens now.']],
 3:[['gniewomir','Gniewomir Zgniły','Gniewomir the Rotten','Złotogród płacił mu w złocie, Noc płaci w pleśni. Wciąż walczy za tego, kto da więcej.','Goldheim paid him in gold; the Night pays in mould. He still fights for the higher bidder.'],['radost','Sir Radost bez twarzy','Sir Radost the Faceless','Pod przyłbicą nie ma już twarzy, tylko ciemność. Słychać, jak oddycha.','There is no face behind the visor now, only the dark. You can hear it breathing.'],['czcibor','Czcibor Pleśniopancerny','Czcibor Mouldmail','Jego kolczuga zrosła się z grzybnią. Każdy cios, który przyjmie, wypuszcza obłok zarodników.','His mail has fused with the mycelium. Every blow he takes lets out a cloud of spores.']],
 4:[['jagna','Jagna Wilcza Hersztka','Jagna the Wolf Chief','Prowadziła zbójów Czarnoboru, zanim wilki zaczęły prowadzić ją. Nie wiadomo już, kto komu służy.','She led the Blackwood robbers until the wolves began leading her. No one can say any more who serves whom.'],['maciej','Maciej Siedem Noży','Maciej Seven Knives','Każdy nóż nosi imię kogoś, kogo zdradził. Siódmy wciąż jest bezimienny.','Each knife bears the name of someone he betrayed. The seventh has no name yet.'],['bartosz','Bartosz Szubienicznik','Bartosz Gallowbird','Wisiał na dębie trzy dni, aż Noc przecięła sznur. Od tamtej pory nie boi się niczego.','He hung from an oak for three days before the Night cut him down. He has feared nothing since.']],
 6:[['jaromir','Jaromir Zgaszona Latarnia','Jaromir Darklamp','Zapalał latarnie na nabrzeżu przez trzydzieści lat. Ostatniej nocy zgasił wszystkie naraz i nikt nie wie, komu dał znak.','He lit the quay lamps for thirty years. On the last night he put them all out at once, and nobody knows whom he signalled.'],['sambor','Sambor Solny','Sambor Saltblind','Sól wyżarła mu oczy, więc idzie na słuch. Stuk twoich butów o deski wystarczy.','Salt ate his eyes, so he hunts by ear. Your boots on the boards are enough.'],['wszebor','Wszebor od Trzeciej Wachty','Wszebor of the Third Watch','Trzecia wachta nigdy się nie skończyła. Wciąż obchodzi pomosty i liczy tych, którzy nie zapłacili za przeprawę.','The third watch never ended. He still walks the piers, counting those who have not paid their fare.']],
 5:[['wiktor','Wiktor, pierwszy wyrok','Wiktor, the First Verdict','Wykonał pierwszy wyrok Cytadeli i każdy następny. Liczy głowy, nie lata.','He carried out the Citadel\'s first sentence and every one since. He counts heads, not years.'],['ignacy','Mistrz Ignacy od Topora','Master Ignacy of the Axe','Uczył katów fachu. Mówi, że czysty cios to jedyna łaska, jaką zna.','He taught executioners their trade. A clean stroke, he says, is the only mercy he knows.'],['bezimienny','Kat bez imienia','The Nameless Headsman','W księgach Cytadeli zapisano go jako dług. Spłaca go cudzymi głowami.','The Citadel\'s ledgers list him only as a debt. He pays it off in other people\'s heads.']]};
const NAMED_ALL=Object.entries(NAMED).flatMap(([ch,l])=>l.map(r=>({id:r[0],ch:+ch,type:ELITE.type[ch],n:EN?r[2]:r[1],d:EN?r[4]:r[3]}))),NAMED_ASH=15,NAMED_P=.3;
function pickNamed(){if(S.namedDone)return null;const l=NAMED_ALL.filter(r=>r.ch===CH);if(!l.length||Math.random()>=NAMED_P)return null;const nm=(typeof META!=='undefined'&&META.nm)||{},fresh=l.filter(r=>!nm[r.id]);const q=fresh.length?fresh:l;return q[(Math.random()*q.length)|0]}
function miniTick(){const n=S?S.miniN||0:0,ts=S&&S.firstNight?ELITE.timesFirst:ELITE.times;if(!S||!(S.t>=(n<ts.length?ts[n]:S.endless?ts[ts.length-1]+150*(n-ts.length+1):1e9))||pl.dead||S.dg||S.stage==='break'||S.opening)return;
  const type=ELITE.type[CH]||'knight';if(!A[type])return;S.miniN=n+1;S.miniDone=true;
  const p=ringSpot(150,230)||ringSpot(90,300)||[pl.x+110,pl.y],e=spawnEnemy(type,p[0],p[1],{rise:1,mini:true,bornT:S.t});
  const hm=S.firstNight?2.8:ELITE.hp;e.hp*=hm;e.max*=hm;e.dmg*=S.firstNight?1.4:ELITE.dmg;e.xp*=hm;e.s=1.2;setAffix(e);play('bossGrowl',0);shake(.15,.6);const nd=pickNamed();if(nd){S.namedDone=1;e.named=nd.id;e.nmN=nd.n;e.s=1.28;padRumble(.7,.4,380);say((EN?nd.n+' steps out of the dark. This one has a name.':nd.n+' wychodzi z mroku. Ten ma imię.'))}else say((EN?'An elite emerges from the dark in a crimson glow.':'Z mroku wychodzi elita w bordowej poświacie.'))}
// Rozdzial III, Solne Nabrzeze: zdarzenia nocy (rozmowy NPC maja wlasne kwestie w 02_swiaty.js)
function portEvents(){
  const ev=(k,c,fn)=>{if(c&&!S.ev.has(k)){S.ev.add(k);fn()}};
  ev('a',S.t>.5,()=>say((EN?'Salt Quay. The Holy Order has chained the ferry to both banks.':'Solne Nabrzeże. Zakon przykuł prom do obu nabrzeży.')));
  ev('b',S.t>7,()=>say((EN?'Each quay has a winch. Both chains must fall.':'Przy każdym nabrzeżu jest kołowrót. Oba łańcuchy muszą opaść.')));
  ev('c',S.t>95,()=>say((EN?'Something scrapes under the boards. The tide throws the dead ashore.':'Coś szura pod deskami. Przypływ wyrzuca umarłych na brzeg.')));
  ev('d',S.t>NIGHT-45&&S.stage==='p2',()=>{play('rumble',0);say((EN?'From the far bank comes the knock of a wooden leg.':'Z drugiego brzegu niesie się stuk drewnianej nogi.'))});
}
function events(){
  if(CH===PORT)return portEvents();
  const ev=(k,c,fn)=>{if(c&&!S.ev.has(k)){S.ev.add(k);fn()}};
  
  if(CH<4&&W.altar){
    ev('alt',S.t>34,()=>say(W.altar.hint));
    ev('wave',S.t>DZIADY_AT&&!S.won,()=>{play('rise',0);play('bossGrowl',0);shake(.2,1);say(W.wave.msg);for(const [t,n] of W.wave.list)for(let i=0;i<n;i++){const p=ringSpot(150,240)||ringSpot(100,300);if(p)spawnEnemy(t,p[0],p[1],{rise:1})}});
    ev('pw',CH===2,()=>{for(const p of PROPS)if(p.obj&&p.k==='black_powder')p.obj.mesh.visible=true});
    // traps: the shrouded dead in Brzeźnica rise when you step close, rot blooms in Złotogród burst into spores
    for(const p of PROPS){if(!(p.ambush||p.k==='rot_bloom'))continue;const d=Math.hypot(pl.x-p.x*16,pl.y-p.y*16);if(d>24)continue;const cd=S.trapCd.get(p);
      if(p.ambush&&!cd){S.trapCd.set(p,1);for(let i=0;i<3;i++)spawnEnemy('possessed',p.x*16+rnd(-14,14),p.y*16+rnd(-6,8),{rise:.8});play('rise',0)}
      else if(p.k==='rot_bloom'&&!(cd>S.t)&&d<18){S.trapCd.set(p,S.t+8);S.slowT=1.5;hurtPlayer(6,0,1,'poison');play('fire',.3);
        for(let i=0;i<24;i++){const a=Math.random()*Math.PI*2;S.parts.push({k:'m',x:p.x*16,y:p.y*16,z:rnd(2,10),vx:Math.cos(a)*rnd(20,60),vy:Math.sin(a)*rnd(10,30),vz:rnd(4,16),c:Math.random()<.5?'#e07a30':'#c24a20',life:rnd(.6,1.2)})}
        ftInfo((EN?'Spores':'Zarodniki'))}}}
  // OBDYP shows up only in the Lower City (chapter II)
  ev('gl',CH===2&&S.glizT>0&&S.t>S.glizT,()=>{const p=ringSpot(110,150)||ringSpot(80,200)||[pl.x+100,pl.y];spawnEnemy('glizzard',p[0],p[1],{rise:1});play('boing',0);say((EN?'Glizard, The Glizzy G-Lord, shuffles out of the dark!':'Z mroku wytacza się Glizzard, Wielki Paruwiak!'))});
  if(CH===1){const N=S.npc;
    ev('a',S.t>.5,()=>say((EN?'Night falls over the Scorched Settlement.':'Noc zapada nad Spaloną Osadą.')));
    ev('b',S.t>5,()=>tutActive()||say((EN?'Every kill gives experience at once. Survive until dawn.':'Każde zabójstwo od razu daje doświadczenie. Przetrwaj do świtu.')));
    ev('c',S.t>14,()=>0);
    ev('s',S.t>24,()=>0);
    ev('pal',S.t>30,()=>0);
    ev('d',S.t>36,()=>0);
    ev('el',S.t>62&&N.elder.state==='alive',()=>{N.elder.state='dead';N.elder.deadAt=S.t;const n=W.npcs[0];pool(n.x,n.y,14,6)});
    ev('er',N.elder.state==='dead'&&S.t>(N.elder.deadAt||1e9)+14&&!!A.rotknight,()=>{N.elder.state='risen';const n=W.npcs[0];spawnEnemy('rotknight',n.x,n.y+2,{elder:true,rise:1.2,hp:220,max:220});play('rise',0);S.flash=1;shake(.12,.6);say((EN?'The old man from the well rises in rusted armour. Rot pours out from under his visor.':'Starzec spod studni wstaje w zardzewiałej zbroi. Zgnilizna wylewa się spod przyłbicy.'))});
    ev('k',S.t>(S.firstNight?110:70),()=>0);
    ev('mg',S.t>100&&N.marga.state==='alive'&&!(W.shelters&&W.shelters.some(s=>s.kind==='shop')),()=>{N.marga.state='gone';say((EN?'The trader\'s lantern goes out in the rain.':'Latarnia handlarki gaśnie w deszczu.'))});
    ev('w',S.t>150&&N.wit.state==='alive',()=>{N.wit.state='dead';const n=W.npcs[2];pool(n.x,n.y+1,20,8);say((EN?'The screams from the stocks suddenly fall silent.':'Krzyki od strony dybów nagle ucichły.'))});
    return}
  if(CH===5){
    ev('a',S.t>.5,()=>say((EN?'The Creditors\' Citadel. Seat of the Holy Order, where every debt has been entered in the ledgers.':'Cytadela Wierzycieli. Siedziba Zakonu, w której każdy dług zapisano w księgach.')));
    ev('b',S.t>6,()=>say((EN?'The gate slammed shut behind you. The guards close ranks.':'Brama zatrzasnęła się za tobą. Straż zamyka szeregi.')));
    ev('k',S.t>70,()=>say((EN?'In the Chancery, the scribes whisper your name and the sum you owe.':'W kancelarii skrybowie szepczą twoje imię i wysokość długu.')));
    ev('rk',S.t>150,()=>say((EN?'Shackles clank in the dungeons. The debtors can tell their turn is coming.':'Z lochów dobiega brzęk kajdan. Dłużnicy czują, że po nich też przyjdą.')));
    ev('roz',S.t>DZIADY_AT,()=>{play('rise',0);play('bossGrowl',0);shake(.2,1);say((EN?'Nine strokes of the court bell. The guard moves to carry out the sentence.':'Dziewięć uderzeń sądowego dzwonu. Straż rusza wykonać wyrok.'));
      for(const [t,c] of [['condemned',9],['guard',3],['executioner',1]])for(let i=0;i<c;i++){let p=null;for(let j=0;j<12&&!p;j++){const q=ringSpot(150,240)||ringSpot(100,300);if(q&&sight(q[0],q[1],pl.x,pl.y))p=q}if(p)spawnEnemy(t,p[0],p[1],{rise:1})}});
    return}
  if(CH===4){
    ev('a',S.t>.5,()=>say((EN?'Beyond Goldheim stretch the wild valleys of Blackwood. The refugee camp is the last safe place.':'Za Złotogrodem ciągną się dzikie doliny Czarnoboru. Obóz uciekinierów to ostatnie bezpieczne miejsce.')));
    ev('b',S.t>6,()=>{play('howl',0);0});
    ev('c',S.t>16,()=>0);
    ev('s',S.t>26,()=>0);
    ev('st',S.t>34,()=>0);
    ev('k',S.t>70,()=>say((EN?'The Holy Order has reached even here. Fanatics are burning the shrines of the old faith.':'Zakon dotarł i tutaj. Fanatycy palą chramy starej wiary.')));
    ev('rk',S.t>150,()=>say((EN?'Knocking comes from the barrows. Something wants to get out.':'Z kurhanów dobiega stukanie. Coś chce wyjść.')));
    ev('dz',S.t>DZIADY_AT,()=>{play('rise',0);shake(.15,1);say((EN?'The Forefathers\' Eve. The mist turns green, and the dead leave the barrows to claim what is theirs.':'Dziady. Mgła zielenieje, a umarli wychodzą z kurhanów po swoje.'));
      for(const b of W.barrows)if(Math.hypot(b.x-pl.x,b.y-pl.y)<420)for(let i=0;i<2;i++)spawnEnemy('wight',b.x+rnd(-12,12),b.y+rnd(2,10),{rise:1.2})});
    // false will-o'-wisps wait over the marsh
    const wisps=()=>{for(const q of W.wisps)if(Math.hypot(q.x*16-pl.x,q.z*16-pl.y)>90)spawnEnemy('wisp',q.x*16+rnd(-20,20),q.z*16+rnd(-10,10),{rise:0})};
    ev('ws',S.t>.2,wisps);ev('ws2',S.t>BREAK_AT-60,wisps);
    ev('np',S.t>12,()=>0);
    ev('wo',S.t>44,()=>0);
    const N=S.npc,bt=W.npcs.find(n=>n.id==='bartosz');
    ev('bd',S.t>200&&N.bartosz&&N.bartosz.state==='alive',()=>{N.bartosz.state='dead';pool(bt.x,bt.y,18,7);for(let i=0;i<3;i++)spawnEnemy('wolf',bt.x+rnd(-20,20),bt.y+rnd(-12,12),{rise:.3});say((EN?'A howl and a short scream come from the road. The wolves have caught the scout.':'Od strony drogi dobiega wycie i krótki krzyk. Wilki dopadły tropiciela.'))});
    const bg=W.npcs.find(n=>n.lure);
    if(bg&&N.boginka){ev('cry',S.t>240,()=>{play('cry',0);say((EN?'A child\'s crying comes from deep within Blackwood.':'Z głębi Czarnoboru dobiega płacz dziecka.'))});
      if(S.ev.has('cry')&&N.boginka.state==='alive'&&Math.random()<1/240)play('cry',0);
      if(N.boginka.state==='alive'&&Math.hypot(pl.x-bg.x,pl.y-bg.y)<46){N.boginka.state='gone';spawnEnemy('boginka',bg.x,bg.y,{rise:0});play('bossGrowl',0);shake(.25,.6);S.flash=.4;say((EN?'The child\'s voice falls silent. The Lady of the Forest reaches out her arms.':'Dziecięcy głos milknie. Pani Lasu wyciąga ręce.'));bossSay('ladyOfTheForest','intro')}}
    return}
  if(CH===3){const N=S.npc;
    ev('a',S.t>.5,()=>say((EN?'The ferry reaches Goldheim. Up close you can see the walls rotting beneath the gold.':'Prom dobija do Złotogrodu. Z bliska widać, jak gniją mury pod złotem.')));
    ev('b',S.t>5,()=>0);
    ev('c',S.t>14,()=>0);
    ev('s',S.t>24,()=>0);
    ev('he',S.t>28,()=>0);
    ev('d',S.t>36,()=>0);
    ev('k',S.t>70,()=>0);
    ev('m',S.t>110,()=>0);
    ev('ot',S.t>210&&N.ottokar.state!=='dead',()=>{N.ottokar.state='dead';const n=W.npcs[1];pool(n.x,n.y+2,22,8);for(let i=0;i<4;i++)spawnEnemy('madman',n.x+rnd(-14,14),n.y+rnd(4,12),{rise:.6});say((EN?'Madmen have broken down Count Ottokar\'s door. Gold did not save him.':'Szaleńcy wyważyli drzwi hrabiego Ottokara. Złoto go nie uratowało.'))});
    ev('roar',S.t>NIGHT-120,()=>{play('bossGrowl',0);shake(.15,1.2);say((EN?'Something enormous beats its wings above the domes. The basilica bells begin to ring by themselves.':'Nad kopułami coś ogromnego łopocze skrzydłami. Dzwony bazyliki zaczynają bić same.'))});
    return}
  ev('a',S.t>.5,()=>say((EN?'Descent into the Lower City. The sun never reaches here.':'Zejście do Dolnego Miasta. Tu nigdy nie dochodzi słońce.')));
  ev('b',S.t>5,()=>0);
  ev('c',S.t>14,()=>0);
  ev('mi',S.t>28,()=>0);
  ev('d',S.t>70,()=>0);

}


