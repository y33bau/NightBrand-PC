/* ============ WALKA MIECZEM (Slasher) ============ */
// The only combat mode (Horde was removed on 28.10.2026). The hero swings by hand (light combo, heavy blow), blocks and parries, every action costs stamina;
// enemies wind up before they strike instead of hurting on touch, there are fewer of them, bosses have less health.
let STORYMODE=true;try{STORYMODE=localStorage.getItem('pn_story')!=='0'}catch(e){}
const chWon=c=>!!((SETT.save['s'+c]&&SETT.save['s'+c].win)||(SETT.save['a'+c]&&SETT.save['a'+c].win));
const chLocked=c=>STORYMODE&&c>1&&!chWon(c-1);
let heavyPress=false,signPress=false,mouseL=false,mouseR=false,mouseX=0,mouseY=0,mouseT=-99,tAtk=false,tBlock=false;
const SL={regen:28,delay:.55,roll:24,blockRegen:.25,stepCost:8,
  mana:{max:60,regen:1.2,delay:.75,onHit:1,onParry:0,onKill:0,hitGap:.5},
  shot:{iceDmg:16,perL:2,targets:[3,4,6],iceR:8,fireDmg:[30,36,42],fireR:[34,38,42],fireHit:9,splash:.5},
  guard:{dmg:[15,17,20,22,29],hits:[2,3,4,5,5],gap:2,hitR:90,dur:10,hp:[.8,.9,1,1.1,1.2],taunt:[96,104,112,120,128],bossTaunt:5,spd:42,r:7,leash:140,inv:.3},parry:.18,blockMul:1.2,guardBreak:.8,riposte:1.5,cap:28,ramp:.12,bossHp:.45,enemyWind:.5,enemyRec:.5,enemyHit:1.6,staggerGap:.9,coinDrop:.45,coinStrong:2,coinSurvive:15,projDiv:900,dmgDiv:800,shotGap:1.3,aim:.55,
  wave:{l:{dmg:.6,speed:230,life:.62,r:13,size:1.25},h:{dmg:.7,speed:250,life:.75,r:19,size:1.8},stun:.4},
  light:{cost:14,dmg:[17,19,28],wind:.12,act:.1,rec:.27,range:30,arc:1.05,stun:[.18,.18,.3],lunge:[30,30,55]},
  heavy:{cost:36,dmg:48,charge:.42,wind:.52,act:.12,rec:.3,range:37,arc:1.5,stun:.7,lunge:70}};
// level-up cards in slasher mode raise the hero's attributes instead of giving skills
const SLASH_UP=['_vit','_dex','_str','_int'];
// direction from the hero to the mouse pointer (screen y is foreshortened by the camera tilt)
function aimDir(){if(clock-PAD.aimT<.15)return [PAD.ax,PAD.ay];if(coarse||clock-mouseT>3)return null;V.set(pl.x/16,.9,pl.y/16).project(cam);const r=$('screen').getBoundingClientRect();
  const hx=(V.x+1)/2*r.width,hy=(1-V.y)/2*r.height,dx=mouseX-hx,dy=(mouseY-hy)/Math.sin(PITCH),d=Math.hypot(dx,dy);return d>4?[dx/d,dy/d]:null}
// keyboard and touch: lock on to the closest enemy roughly in front
function autoAim(){let b=null,bd=1e9;for(const e of S.enemies){if(e.dead||e.rise>0||e.type==='wisp')continue;const dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy);if(d>75||d<1)continue;const f=(dx*pl.fx+dy*pl.fy)/d;if(f<-.2)continue;const sc=d*(1.6-f);if(sc<bd){bd=sc;b=[dx/d,dy/d]}}return b}
// ---- STYLE WALKI (slasher): trzy gałęzie kart z poziomami. Osiem poziomów w jednej gałęzi daje bonus zestawu ----
const BR={def:{n:(EN?'Defender':'Obrońca'),set:(EN?'Parry: 0.9 s of invulnerability instead of 0.7 s; +2% health (once per 2.5 s).':'Parowanie: 0,9 s nietykalności zamiast 0,7 s; +2% życia (raz na 2,5 s).')},off:{n:(EN?'Assassin':'Zabójca'),set:(EN?'Hitting a stunned enemy restores 6 stamina.':'Trafienie ogłuszonego wroga zwraca 6 staminy.')},wav:{n:(EN?'Wavemaster':'Mistrz fal'),set:(EN?'Waves deal +30% damage and apply the blade status.':'Fale +30% obrażeń i nakładają status ostrza.')}},SET_N=8;
const FALA_B=[0,.1,.2,.3,.4,.6],ZRYW_N=[0,6,4,3];// Fala Mocy: łączny bonus na poziomie; Zryw: co ile trafień
const STY={
  garda:{br:'def',name:(EN?'Iron Guard':'Żelazna Garda'),ic:'quen',max:5,d:(EN?'Block −10% stamina per level (lvl 5: −50%).':'Blok −10% staminy za poziom (poz. 5: −50%).')},
  riposta:{br:'def',name:(EN?'Mortal Riposte':'Śmiertelna Riposta'),ic:'riposta',max:5,d:(EN?'Riposte multiplier: ×1.5 base, ×2 at level 1, ×3 from level 2; +0.25 s window per level.':'Mnożnik riposty: ×1,5 bazowo, ×2 na poziomie 1, ×3 od poziomu 2; +0,25 s okna za poziom.')},
  odzysk:{br:'def',name:(EN?'Second Wind':'Odzysk Tchu'),ic:'odzysk',max:3,d:(EN?'Parrying restores 10 stamina per level. Lvl 3: +2% health (once per 2.5 s).':'Parowanie zwraca 10 staminy za poziom. Poz. 3: +2% życia (raz na 2,5 s).')},
  ostrze:{br:'off',name:(EN?'Swift Blade':'Szybkie Ostrze'),ic:'whet',max:5,d:(EN?'Light attack: −8% stamina and −6% recovery time per level.':'Szybki atak: −8% staminy i −6% czasu powrotu za poziom.')},
  rytm:{br:'off',name:(EN?'Death Rhythm':'Rytm Śmierci'),ic:'rytm',max:5,d:(EN?'Third combo hit: +18% damage per level.':'Trzeci cios combo: +18% obrażeń za poziom.')},
  buty:{br:'off',name:(EN?'Winged Boots':'Skrzydlate Buty'),ic:'buty',max:3,d:(EN?'Per level: +10% movement speed.':'Za poziom: +10% prędkości ruchu.')},taniec:{br:'off',name:(EN?'Blade Dance':'Taniec Ostrzy'),ic:'haste',max:3,d:(EN?'Per level: dodge −12% stamina, first hit after a dodge +25% damage.':'Za poziom: unik −12% staminy, pierwszy cios po uniku +25% obrażeń.')},
  fala:{br:'wav',name:(EN?'Force Wave':'Fala Mocy'),ic:'fala',max:5,d:(EN?'Slash wave: +10% damage and +15% range per level (lvl 5: damage +20% instead of +10%).':'Fala cięcia: +10% obrażeń i +15% zasięgu za poziom (poz. 5: obrażenia +20% zamiast +10%).')},
  echo:{br:'wav',name:(EN?'Parry Echo':'Echo Parowania'),ic:'earth',max:3,d:(EN?'More waves after a parry: lvl 1 – two, lvl 2–3 – three (lvl 3: +20% damage).':'Po parowaniu więcej fal: poz. 1 – dwie, poz. 2–3 – trzy (poz. 3: +20% obrażeń).')},
  zryw:{br:'wav',name:(EN?'Blade Rush':'Zryw Ostrza'),ic:'zryw',max:3,d:(EN?'Every 6th, 4th or 3rd light hit (lvl 1–3) releases a wave (60% damage).':'Co 6., 4. lub 3. trafienie szybkim atakiem (poz. 1–3) wypuszcza falę (60% obrażeń).')},
  szklo:{pact:1,name:(EN?'Glass Sword':'Szklany Miecz'),ic:'wisp',max:1,d:(EN?'+50% damage, enemies hit you 30% harder.':'+50% obrażeń, wrogowie ranią cię o 30% mocniej.')},
  cisza:{pact:1,name:(EN?'Pact of Silence':'Pakt Ciszy'),ic:'cisza',max:1,d:(EN?'+50% stamina regeneration, −20% max health.':'+50% regeneracji staminy, −20% maks. życia.')}};
for(const k in STY){const t=STY[k];t.kind=t.pact?(EN?'Pact':'Pakt'):(EN?'Style · ':'Styl · ')+BR[t.br].n;if(t.pact)t.sub=(EN?'An edge with a price':'Przewaga z ceną');Object.assign(SK[k]=SK[k]||{},t)}
const sk=k=>(S&&S.sk&&S.sk[k])||0;
const brSum=br=>Object.keys(STY).filter(k=>STY[k].br===br).reduce((a,k)=>a+sk(k),0),brOn=br=>brSum(br)>=SET_N;
const parryWin=()=>SL.parry*(S.pk.parryWin||1),riMul=()=>{const l=sk('riposta');return l>=2?3:l>=1?2:SL.riposte},blockMulX=()=>SL.blockMul*(1-.1*sk('garda'));
// 10.11.2026 (decyzja autora): gdy riposta jest gotowa, ciężki cios Kata (ładowanie) i Zabójczyni (zamach) trafia po 0,66 s,
// czyli w oknie 0,7 s nietykalności po parowaniu; poza ripostą czasy bez zmian (0,75 s)
const RIPO_HV=.66;function hvCharge(){return (S.kat||S.dzw)&&pl.riposte>0?Math.min(SL.heavy.charge,RIPO_HV):SL.heavy.charge}
function onParry(){if(S.mil&&pl===(typeof pl1!=='undefined'&&pl1||pl))milParry();if(S.dzw&&S.pk.dParrySta)pl.sta=Math.min(pl.staMax,pl.sta+S.pk.dParrySta);if(S.dzw&&pl===(typeof pl1!=='undefined'&&pl1||pl))dzwParry();S.combatLock=4;S.parries++;S.actions.parry++;pl.riposte=1.6+.25*sk('riposta');const o=sk('odzysk');if(o)pl.sta=Math.min(pl.staMax,pl.sta+10*o);
  const ready=!(pl.parryHealCd>0);if(ready){heal(pl.max*(.01+(o>=3?.02:0)+(brOn('def')?.02:0)));pl.parryHealCd=2.5}
  // 9.11.2026 (10.11: 0,7 s, decyzja autora): udane parowanie daje 0,7 s nietykalności (Mur obrońcy 0,9 s) i lekko odpycha najbliższych wrogów, żeby w tłumie nie karać za dobrą obronę
  pl.inv=Math.max(pl.inv,brOn('def')?.9:.7);if(brOn('def'))ftInfo((EN?'Defender\'s Wall':'Mur obrońcy'));
  for(const e of S.enemies){if(e.dead||BIG.has(e.type)||bossBar(e))continue;const dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy);if(d<26&&d>.01){const f=240*(1-d/34);e.vx=(e.vx||0)+dx/d*f;e.vy=(e.vy||0)+dy/d*f}}}
function attackCost(kind){if(kind==='h'&&S.echoArm)return 0;return (kind==='h'?SL.heavy.cost:SL.light.cost)*(S.dex||1)*(kind==='l'?1-.08*sk('ostrze'):1)*(kind==='h'?(S.pk.heavyCost||1):1)}
function startAttack(kind,combo=0,charged=false){if(pl.atk&&SKATK.includes(pl.atk.kind))return;const P=kind==='h'?SL.heavy:SL.light,cost=attackCost(kind);if(pl.sta+1e-8<cost){S.stamFlash=.45;play('empty',.25);return}
  const a=aimDir()||autoAim()||[pl.fx,pl.fy];pl.fx=a[0];pl.fy=a[1];
  pl.sta=Math.max(0,pl.sta-cost);S.combatLock=4;S.actions.attack++;let wind=(kind==='h'&&S.zab&&pl.riposte>0?Math.min(P.wind,RIPO_HV):P.wind)-(kind==='h'&&charged?P.charge:0),slide=false;if(S.zab&&kind==='l'&&combo===0&&S.zWin>0){wind=Math.min(wind,.02);slide=true;S.zWin=0}pl.staDelay=SL.delay;pl.atk={kind,combo,charged,stage:'wind',t:wind,visualWind:wind,dx:a[0],dy:a[1],hit:false,slide,visualRiposte:pl.riposte>0};pl.queue=false;if(S.mil&&kind==='h'&&(S.wick||0)>0&&pl===(typeof pl1!=='undefined'&&pl1||pl)){pl.atk.wick=S.wick;S.wick=0}if(S.dzw&&kind==='h'){if(S.echoArm){pl.atk.echo=S.echoArm;S.echoArm=0}pl.atk.emp=(S.pledgeT>0&&S.pledge>0)||S.pledgeHv>0}
  if(S.bloodCharge>0)S.bloodCharge=0;const dur=(wind+P.act+P.rec)/atkRate({kind});pl.swingT=pl.swingDur=dur;if(Math.abs(a[0])>Math.abs(a[1])){pl.swingDir=2;pl.swingS=a[0]>0?1:-1}else{pl.swingDir=a[1]>0?0:1;pl.swingS=1}
  play(kind==='h'?'bladeHeavy':'bladeLight',.03)}
// Repeated ordinary hits cannot keep cancelling the same enemy's attack forever.
// Parry and Aard keep their guaranteed interrupt; a heavy blow can stop a light-hit recovery.
function slashStagger(e,seconds,heavy=false){if(e.staggerCd>0&&!heavy)return false;e.stun=Math.max(e.stun||0,seconds);e.ghoulWind=0;e.sw=0;e.staggerCd=seconds+SL.staggerGap;return true}
function attackHit(a){const P=a.kind==='h'?SL.heavy:SL.light,R=P.range*(S.zab&&a.kind==='h'?S.pk.vortR:1)*(a.kind==='h'?(S.pk.kReach||1):1),arc=P.arc,crit=pl.riposte>0,LC=lastCombo();if(S.zab){S.zTag=a.kind==='h'?'w':a.combo===4?'x':a.slide&&a.combo===0?'s':null;S.zWhirlN=0}ftCrit=crit;ftHeavy=a.kind==='h';ftMelee=true;DSRC=crit?'r':a.kind==='h'?'h':'l';
  let dmg=(a.kind==='h'?P.dmg:P.dmg[a.combo])*(1+.07*(S.lvl-1))*(S.str||1)*might()*encDmg(encLevel()[1]);const twinBase=dmg;if(crit)dmg*=riMul()*S.pk.ripo;if(a.kind==='l')dmg*=S.pk.light;else if(a.kind==='h')dmg*=S.pk.heavyDmg;if(a.kind==='l'&&a.combo===LC)dmg*=1+.18*sk('rytm');if(S.zab&&a.kind==='l'){if(a.combo<4)dmg*=S.pk.zLight4;if(S.zDance>0)dmg*=1+.07*((S.zDanceL||1)-1)}if(pl.dance>0){dmg*=1+.25*sk('taniec');pl.dance=0}
  if(S.dzw&&a.kind==='h')dmg+=dzwPledgeHit();
  const waveDmg=dmg*(S.dzw&&a.kind==='h'?.5:1);const ang=Math.atan2(a.dy,a.dx);let hits=0;
  const LST=[...S.enemies];if(S.zab&&a.kind==='l')LST.sort((p,q)=>Math.hypot(p.x-pl.x,p.y-pl.y)-Math.hypot(q.x-pl.x,q.y-pl.y));for(const e of LST){if(S.zab&&a.kind==='l'&&hits>=3)break;if(e.dead||e.rise>0)continue;const dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy);if(d>R+e.r||!sightSword(pl.x,pl.y,e.x,e.y))continue;let df=Math.atan2(dy,dx)-ang;while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;if(d>10&&Math.abs(df)>arc)continue;
    const big=BIG.has(e.type)||e.type==='collector',weak=e.stun>0||e.recov>0||crit;let dm=dmg;if(S.zab){dm*=finMul(e);if(crit&&S.pk.zInsta&&!big&&e.type!=='glizzard')dm=e.mini?dm*2:e.hp+1}if(damageEnemy(e,dm,dx/(d||1),dy/(d||1),a.kind==='h'?1.6*S.pk.heavyKb:(a.combo===LC?1.2:.7)*(S.kat?1.5:1))){hits++;if(S.zab&&S.pk.zVenom&&a.kind==='l'&&a.combo===4&&!e.dead){e.pois=Math.max(e.pois||0,3);e.poisD=Math.max(e.poisD||0,dm*.2)}swordTechniqueHit(e,a);supportEnchant(e,a,crit);applyEnchants(e,a,crit);if(weak&&brOn('off'))pl.sta=Math.min(pl.staMax,pl.sta+Math.min(6,Math.max(0,12-(a.refund||0))));if(weak&&brOn('off'))a.refund=(a.refund||0)+6}else continue;
    // stagger: normal enemies are interrupted, big ones only when their poise breaks
    if(!e.dead){const st=a.kind==='h'?P.stun:P.stun[a.combo];if(big){breakPoise(e,a.kind==='h'?45*S.pk.poise:a.combo===LC?20:12)}else{slashStagger(e,st,a.kind==='h'||crit)}}}
  ftCrit=false;ftHeavy=false;ftMelee=false;DSRC='';
  if(S.zab){S.zTag=null;if(a.kind==='h')S.zWhirlBest=Math.max(S.zWhirlBest||0,S.zWhirlN||0);if(hits>0){S.zHits++;S.zCombo=Math.min(S.pk.zCap,(S.zCombo||0)+.03);S.zT=S.pk.zDecay}}
  if(hits>0&&!(S.manaHitCd>0)&&SL.mana.onHit>0){gainMana(SL.mana.onHit);S.manaHitCd=SL.mana.hitGap}
  const c=Math.cos(ang),s=Math.sin(ang),trail=COMBAT_TRAIL[encLevel()[0]]||embTrail(),visualSize=swordVisualSize(a.kind);
  if(WEAPON_FX_ON)emitWeaponSlash(a,c,s,R);else if(S.zab&&zabSlashFx(a,c,s,R,visualSize)){}else if(!skAdd('slash',.26,pl.x+c*R*.55,pl.y+s*R*.55,.6,visualSize*1.1,'bill',-screenAng(c,s),trail)){if(!trail||!emitCombatEffect(trail,pl.x+c*R*.12,pl.y+s*R*.12,visualSize,-screenAng(c,s)))addVfx(A.fx.slash,.26,pl.x+c*R*.55,pl.y+s*R*.55,.6,visualSize,'bill',-screenAng(c,s))}
  {const en=ENCH.filter(k=>S.sk[k]);if(en.length)for(let i=0;i<16;i++){const t=ang+rnd(-arc,arc),rr=rnd(10,R),k=en[i%en.length];S.parts.push({k:'e',x:pl.x+Math.cos(t)*rr,y:pl.y+Math.sin(t)*rr,z:rnd(8,18),vx:0,vy:0,vz:rnd(4,12),c:Math.random()<.6?ENC[k].col:ENC[k].col2,life:rnd(.2,.45)})}}
  if(crit){pl.riposte=0;const wdp=waveDmg*.8;launchWave(a,ang,wdp);const ec=sk('echo');if(ec>=1){launchWave(a,ang-.28,wdp*(ec>=3?1.2:1),1);if(ec>=2)launchWave(a,ang+.28,wdp*(ec>=3?1.2:1),1)}if(hits)ftInfo((EN?'Critical hit!':'Cios krytyczny!'))}
  else if(hits&&a.kind==='l'&&sk('zryw')){S.hitN=(S.hitN||0)+1;if(S.hitN>=ZRYW_N[sk('zryw')]){S.hitN=0;launchWave(a,ang,waveDmg)}}
  if(hits){S.hitstop=a.kind==='h'?.09:crit?.12:.045;shake(a.kind==='h'?.25:.1,.1);if(crit)play('katana',0)}
  if(a.wick>0)milStrip(a.wick,ang);
  if(a.echo)dzwEcho(a,twinBase,ang)}
// fala cięcia: nagroda za parowanie, leci przed siebie i przebija wszystkich wrogów na swojej drodze (raz każdego)
function launchWave(a,ang,base,quiet){const W0=a.kind==='h'?SL.wave.h:SL.wave.l,zs=sk('fala'),W=Object.assign({},W0,{life:W0.life*(1+.15*zs),r:W0.r*(1+.15*zs),size:W0.size*(1+.08*zs),dmg:W0.dmg*(1+FALA_B[sk('fala')])*(brOn('wav')?1.3:1)}),c=Math.cos(ang),s=Math.sin(ang);{const wk=brOn('wav')?'rush':sk('fala')>=3?'wave2':'wave1',wf=skFrames(wk);if(wf)addVfx(wf,W.life,pl.x+c*14,pl.y+s*14,.6,W.size*1.05,'bill',-screenAng(c,s));else addVfx(A.fx.slash,W.life,pl.x+c*14,pl.y+s*14,.6,W.size,'bill',-screenAng(c,s))}
  if(WEAPON_FX_ON){const f=S.vfx[S.vfx.length-1];f.h=1.55;f.size=Math.min(1.2,f.size*.72);f.weaponAspect=.74}
  (S.waves=S.waves||[]).push({f:S.vfx[S.vfx.length-1],x:pl.x+c*14,y:pl.y+s*14,vx:c*W.speed,vy:s*W.speed,t:W.life,r:W.r,dmg:base*W.dmg,hit:new Set()});play('katana',0);shake(.12,.1);padRumble(.4,.7,160);
  if(!quiet)ftInfo((EN?'Slash wave':'Fala cięcia'))}
function waveTick(dt){if(!S.waves||!S.waves.length)return;for(let i=S.waves.length-1;i>=0;i--){const w=S.waves[i];w.t-=dt;w.x+=w.vx*dt;w.y+=w.vy*dt;if(w.f){w.f.x=w.x;w.f.y=w.y}
    if(w.t<=0||boxSolid(w.x,w.y,2,2)){S.waves.splice(i,1);continue}
    for(const e of [...S.enemies]){if(w.hit.size>=(w.cap||4))break;if(e.dead||e.rise>0||w.hit.has(e))continue;if(Math.hypot(e.x-w.x,e.y-w.y)>w.r+e.r)continue;w.hit.add(e);const d=Math.hypot(w.vx,w.vy)||1;
      if(damageEnemy(e,w.dmg,w.vx/d,w.vy/d,.9,'sk:'+(w.sk||'wave'))){if(brOn('wav'))applyEnchants(e,{kind:'l'},true);if(!e.dead){const big=BIG.has(e.type)||e.type==='collector';if(big){breakPoise(e,25)}else{slashStagger(e,SL.wave.stun)}}}
      for(let k=0;k<6;k++)S.parts.push({k:'e',x:e.x,y:e.y,z:rnd(6,18),vx:rnd(-40,40),vy:rnd(-20,20),vz:rnd(4,12),c:'#ffe9a0',life:rnd(.2,.4)})}
    if(w.hit.size>=(w.cap||4)){if(w.f)w.f.t=w.f.dur;S.waves.splice(i,1)}}} // runda 302: fala ciecia po parowaniu rani najwyzej 4 wrogow i znika

function manaTick(dt){S.manaHitCd=Math.max(0,(S.manaHitCd||0)-dt);S.manaFlash=Math.max(0,(S.manaFlash||0)-dt);if(!pl.manaMax)return;if(pl.manaDelay>0)pl.manaDelay=Math.max(0,pl.manaDelay-dt);else pl.mana=Math.min(pl.manaMax,pl.mana+SL.mana.regen*S.pk.manaRegen*dt)}
function slashUpdate(dt,p2){
  manaTick(dt);swordTick(dt,p2);if(!p2&&S.dzw)dzwTick(dt);if(!p2&&S.mil)milTick(dt);
  // recenzja 1.2: odnowienia Dzwonnika i Woskownicy oraz ich liczniki animacji także dla gracza 2 (stan podmieniony przez asP2)
  if(p2){for(const k of ['echoCd','pledgeCd','effCd','gutCd'])S[k]=Math.max(0,(S[k]||0)-dt);for(const k of ['tonT','castT','milEffT'])if(pl[k]>0)pl[k]-=dt}if(!p2&&S.zab)zabTick(dt);else if(p2&&S.zDance>0)S.zDance=Math.max(0,S.zDance-dt);if(pl.atk?.kind==='whirl'){whirlTick(dt);return}if(pl.atk?.kind==='leap'){leapTick(dt);return}if(pl.atk?.kind==='rend'){rendTick(dt);return}if(pl.atk?.kind==='fan'){fanTick(dt);return}if(pl.atk?.kind==='hook'){hookTick(dt);return}if(pl.atk?.kind==='gut'){gutTick(dt);return}if(pl.atk?.kind==='shot'||pl.atk?.kind==='skill'){if(!S.shotWind&&!S.activeWind){pl.atk.t-=dt;if(pl.atk.t<=0)pl.atk=null}return}
  if(pl.staDelay>0)pl.staDelay-=dt;else if(!pl.atk&&pl.roll<=0)pl.sta=Math.min(pl.staMax,pl.sta+SL.regen*(S.regenMul||1)*S.pk.staRegen*(S.heri>0?1.15:1)*(pl.block?SL.blockRegen:1)*dt);if(pl.sta<=.01&&!pl.dead)S.staZero=1;
  if(pl.parryHealCd>0)pl.parryHealCd-=dt;if(pl.parryCd>0)pl.parryCd-=dt;if(pl.riposte>0)pl.riposte-=dt;if(pl.dance>0)pl.dance-=dt;if(!p2)waveTick(dt);
  if(pl.broken>0){pl.broken-=dt;pl.block=false;pl.atk=null;return}
  if(pl.dead||pl.roll>0){pl.block=false;pl.atkHeld=false;pl.charging=false;return}
  // block (hold), parry = block raised just before the hit lands
  const wantRaw=keys.l||mouseR||tBlock||PAD.blk;if(!wantRaw)pl.holdLock=false;const wantBlock=wantRaw&&!pl.holdLock;
  if(wantBlock&&!pl.block&&!pl.atk){pl.block=true;S.actions.block++;pl.blockT=pl.parryCd>0?parryWin()+.1:0;pl.parryCd=.35}else if(!wantBlock)pl.block=false;if(pl.block&&S.pk.noHold&&pl.blockT>.3){pl.block=false;pl.holdLock=true}
  if(pl.block){pl.blockT+=dt;const a=aimDir();if(a){pl.fx=a[0];pl.fy=a[1]}
    if(Math.random()<dt*20){const sp=(Math.random()-.5)*1.6,c=Math.cos(Math.atan2(pl.fy,pl.fx)+sp),s2=Math.sin(Math.atan2(pl.fy,pl.fx)+sp);S.parts.push({k:'i',x:pl.x+c*12,y:pl.y+s2*8,z:rnd(4,16),vx:0,vy:0,vz:rnd(2,6),c:pl.blockT<parryWin()?'#ffe9a0':'#9fb4d0',life:.25})}}
  // attack button: a tap is a light blow (chains into a combo of three), holding it charges a heavy blow
  if(heavyPress){heavyPress=false;if(!pl.atk&&!pl.block&&!(pl.broken>0))startAttack('h')}
  const held=keys.j||mouseL||tAtk||PAD.atk,cc=true;
  if(held&&!pl.atkHeld){pl.atkHeld=true;pl.charge=0}
  if(pl.atkHeld){if(held){if(!pl.atk&&!pl.block)pl.charge+=dt;pl.charging=cc&&pl.charge>.18&&!pl.atk&&!pl.block;
      if(pl.charging&&Math.random()<dt*30)S.parts.push({k:'e',x:pl.x+rnd(-8,8),y:pl.y+rnd(-3,3),z:rnd(6,20),vx:0,vy:0,vz:rnd(6,14),c:pl.charge>=hvCharge()?'#ffb347':'#d8cfb8',life:.3});
      if(cc&&pl.charge>=hvCharge()&&!pl.atk&&!pl.block){pl.atkHeld=false;pl.charging=false;startAttack('h',0,true)}}
    else{pl.atkHeld=false;pl.charging=false;if(pl.atk){if(pl.atk.kind==='l'&&pl.atk.stage!=='wind')pl.queue=true}else if(!pl.block)startAttack('l',pl.comboT>0?pl.nextCombo:0)}}
  if(SETT.oneHand&&!pl.atk&&!pl.block&&!pl.charging&&nearest(pl.x,pl.y,SL.light.range+8)&&pl.sta>=attackCost('l'))startAttack('l',pl.comboT>0?pl.nextCombo:0);
  if(pl.comboT>0)pl.comboT-=dt;
  const a=pl.atk;if(!a)return;const P=a.kind==='h'?SL.heavy:SL.light;a.t-=dt*atkRate(a);
  if(a.stage==='wind'&&a.t<=0){a.visualRiposte=pl.riposte>0;a.stage='act';a.t=P.act;attackHit(a)}
  else if(a.stage==='act'){moveBox(pl,a.dx*(a.kind==='h'?P.lunge:P.lunge[a.combo])*dt,a.dy*(a.kind==='h'?P.lunge:P.lunge[a.combo])*dt,4,3);if(a.t<=0){a.stage='rec';a.t=P.rec*(a.kind==='l'?1-.06*sk('ostrze'):1)}}
  else if(a.stage==='rec'&&a.t<=0){pl.atk=null;
    if(a.kind==='l'&&pl.queue&&a.combo<lastCombo()&&pl.sta>0)startAttack('l',a.combo+1);else{pl.comboT=a.kind==='l'&&a.combo<lastCombo()?.35:0;pl.nextCombo=a.combo+1}}}
// ---- slasher skills: four blade enchantments (only one can be taken) and the Force Push sign ----
// the enchantment has 10 levels: every hit has a chance to inflict its status (15% at level 1, +5% per level, heavy blows x1.5,
// a riposte always); each inflicted status adds a mark, 3 marks finish a normal enemy (bosses: 5 marks take a slice of health);
// every second level also adds +7% weapon damage (+35% at level 10)
const SLASH_SK=['venom','fireblade','iceblade','bloodblade','aard'],ENCH=['venom','fireblade','iceblade','bloodblade'],MAX_ENCH=2,ENCH_MAX=10;
const ENC={venom:{col:'#8ac04a',col2:'#4a6a22',name:(EN?'Poison':'Zatrucie')},fireblade:{col:'#ff6a1a',col2:'#ffb347',name:(EN?'Incineration':'Spopielenie')},iceblade:{col:'#7fd0ff',col2:'#d8f0ff',name:(EN?'Freeze':'Zamrożenie')},bloodblade:{col:'#c4202a',col2:'#560a0d',name:(EN?'Bleeding':'Wykrwawienie')}};
const encChance=L=>.15+.05*(L-1),encDmg=L=>1+.07*Math.floor(L/2),encMarks=e=>BIG.has(e.type)||e.type==='collector'||e.type==='glizzard'?5:3;
const encLevel=()=>{if(S.mainEnchant&&S.sk[S.mainEnchant])return[S.mainEnchant,S.sk[S.mainEnchant]];for(const k of ENCH)if(S.sk[k])return[k,S.sk[k]];return[null,0]};
function encLvText(k,L){const st={venom:(EN?`poison ${2+L} dmg/s for 4 s`:`trucizna ${2+L} obr/s przez 4 s`),fireblade:(EN?`burning ${(3+1.5*L).toFixed(1).replace('.0','')} dmg/s for 3 s`:`podpalenie ${(3+1.5*L).toFixed(1).replace('.0','').replace('.',',')} obr/s przez 3 s`),iceblade:(EN?`slow ${Math.round((1-Math.max(.3,.6-.03*L))*100)}% for 2.5 s`:`spowolnienie ${Math.round((1-Math.max(.3,.6-.03*L))*100)}% na 2,5 s`),bloodblade:(EN?`bleeding ${String((2+L)*2.5)} dmg/s for 3 s`:`krwawienie ${String((2+L)*2.5).replace('.',',')} obr/s przez 3 s`)}[k];
  const fin={venom:(EN?'poison spreads to nearby enemies':'trucizna przechodzi na sąsiadów'),fireblade:(EN?'the explosion hurts those nearby':'wybuch rani pobliskich'),iceblade:(EN?'shards slow nearby enemies':'odłamki spowalniają sąsiadów'),bloodblade:(EN?`+${4+L} health for you`:`+${4+L} życia dla ciebie`)}[k];
  return (EN?`${Math.round(encChance(L)*100)}% chance to inflict: ${st}. 3 statuses kill a normal enemy (${fin}).`:`${Math.round(encChance(L)*100)}% szansy na status: ${st}. 3 statusy zabijają zwykłego wroga (${fin}).`)+(L>=2?(EN?` Sword +${Math.floor(L/2)*7}% damage`:` Miecz +${Math.floor(L/2)*7}% obrażeń`)+(L%2===0?(EN?' (new threshold).':' (nowy próg).'):'.'):'')}
for(const k of ['venom','fireblade','iceblade','bloodblade'])SK[k].lv=[...Array(10).keys()].map(i=>encLvText(k,i+1));
// Slasher: intentional sword actions, a main element and one compatible support.
const ELEMENT_NAME={fire:(EN?'Fire':'Ogień'),ice:(EN?'Ice':'Lód'),venom:(EN?'Poison':'Trucizna'),blood:(EN?'Blood':'Krew'),earth:(EN?'Earth':'Ziemia')};
const ELEMENT_OF={fireblade:'fire',iceblade:'ice',venom:'venom',bloodblade:'blood'};// tylko zaklęcia ostrza; umiejętności aktywne nie liczą się do żywiołów
const NEW_SWORD_SK=['odlew','dogasanie','frostshot','embershot','stoneguard','whirl','leap','rend','fan','ldance','hook','zalecho','zastaw'];
// distances are shown as words, not units: up to 40 short, 80 medium, 120 long, above very long
const RANGE_W=v=>v<=40?(EN?'short':'krótki'):v<=80?(EN?'medium':'średni'):v<=120?(EN?'long':'długi'):(EN?'very long':'bardzo długi'),AREA_W=v=>v<=80?(EN?'medium':'średni'):v<=120?(EN?'large':'duży'):(EN?'very large':'bardzo duży');
const LEAP={cost:30,dist:48,wind:.16,air:.3,land:.22,mul:[1.2,1.35,1.5],cooldown:[9,8,7],push:16,pushR:34,hitR:30,stun:.5,inv:.42};
const WHIRL={cost:35,damage:[8,10,12],hits:[4,5,6],radius:[32,38,44],cooldown:[10,9,8],duration:1.2,recovery:.25,speed:.6,inv:.25};
Object.assign(SK,{
 leap:{name:(EN?'Leap Attack':'Atak z doskoku'),kind:(EN?'Active technique · Executioner':'Technika aktywna · Kat'),ic:'breach',max:3,who:'k',lv:[1,2,3].map(L=>(EN?`30 stamina, cooldown ${LEAP.cooldown[L-1]} s. Leap 3 tiles toward your aim, flying over enemies; invulnerable while airborne. On landing the nearest enemy takes ${Math.round(LEAP.mul[L-1]*100)}% of a heavy attack, other nearby enemies are pushed 1 tile and stunned for 0.5 s (bosses are not pushed). Stops at walls.`:`30 staminy, odnowienie ${LEAP.cooldown[L-1]} s. Skok o 3 pola w stronę celowania, ponad wrogami; nietykalność w locie. Przy lądowaniu najbliższy wróg dostaje ${Math.round(LEAP.mul[L-1]*100)}% silnego ataku, pozostali w pobliżu są odepchnięci o 1 pole i ogłuszeni na 0,5 s (bossów nie odpycha). Zatrzymuje się na ścianach.`))},
 whirl:{name:(EN?'Blade Whirlwind':'Wir Ostrza'),kind:(EN?'Active technique':'Technika aktywna'),ic:'whirl',max:3,lv:[1,2,3].map(L=>(EN?`35 stamina, cooldown ${WHIRL.cooldown[L-1]} s. Spin for 1.2 s: ${WHIRL.hits[L-1]} × ${WHIRL.damage[L-1]} dmg around you, ${['medium','medium+','large'][L-1]} area. Move speed 60%; 0.25 s invulnerable at the start. Recovery 0.25 s.`:`35 staminy, odnowienie ${WHIRL.cooldown[L-1]} s. Obrót 1,2 s: ${WHIRL.hits[L-1]} × ${WHIRL.damage[L-1]} obr. wokół ciebie, obszar ${['średni','średni+','duży'][L-1]}. Ruch 60%; nietykalność 0,25 s na starcie. Powrót 0,25 s.`))},
 frostshot:{name:(EN?'Frost Shard':'Odłamek szronu'),kind:(EN?'Support · Ice':'Wsparcie · Lód'),ic:'frostshot',max:3,lv:[1,2,3].map(L=>(EN?`18 mana, no cooldown. Large shard: ${16+2*L} dmg, ${[3,4,6][L-1]} targets, ${RANGE_W(120+10*L)} range. Slow ${25+5*L}% for 1.5 s (bosses 10%).`:`18 many, bez odnowienia. Duży odłamek: ${16+2*L} obr., ${[3,4,6][L-1]} ${L<3?'cele':'celów'}, zasięg ${RANGE_W(120+10*L)}. Spowolnienie ${25+5*L}% na 1,5 s (na bossa 10%).`))},
 embershot:{name:(EN?'Fireball':'Kula ognia'),kind:(EN?'Support · Fire':'Wsparcie · Ogień'),ic:'embershot',max:3,lv:[1,2,3].map(L=>(EN?`24 mana, no cooldown. A large, slow orb: explodes on the first target hit, which takes ${SL.shot.fireDmg[L-1]} dmg (100%); nearby enemies take 50%. Sets the target on fire for ${String(1+.5*L)} s.`:`24 many, bez odnowienia. Duża, wolna kula: wybucha na pierwszym trafionym celu, który dostaje ${SL.shot.fireDmg[L-1]} obr. (100%), pobliscy wrogowie 50%. Podpala trafiony cel na ${String(1+.5*L).replace('.',',')} s.`))},
 stoneguard:{name:(EN?'Stone Defender':'Kamienny obrońca'),kind:(EN?'Support · Earth':'Wsparcie · Ziemia'),ic:'stoneguard',max:5,lv:[1,2,3,4,5].map(L=>(EN?`34 mana, no cooldown. A golem for 10 s with ${[80,90,100,110,120][L-1]}% of your health. Draws normal enemies (${AREA_W([96,104,112,120,128][L-1])} area). Holds bosses for at most 5 s. Every 2 s it smashes ${SL.guard.hits[L-1]} random enemies nearby for ${SL.guard.dmg[L-1]} damage each${L===5?' (+30% damage at the top level)':''}. It does not heal.`:`34 many, bez odnowienia. Golem na 10 s, życie ${[80,90,100,110,120][L-1]}% twojego. Ściąga zwykłych wrogów (obszar ${AREA_W([96,104,112,120,128][L-1])}). Bossa zatrzymuje najwyżej na 5 s. Co 2 s uderza ${SL.guard.hits[L-1]} losowych wrogów w pobliżu, każdego za ${SL.guard.dmg[L-1]} obrażeń${L===5?' (na najwyższym poziomie +30% obrażeń)':''}. Nie leczy.`))}
});
SLASH_SK.push(...NEW_SWORD_SK);
function chosenElements(){return [...new Set(Object.keys(ELEMENT_OF).filter(k=>sk(k)).map(k=>ELEMENT_OF[k]))]}
function elementConflict(a,b){return a==='fire'&&b==='ice'||a==='ice'&&b==='fire'}
function canLearnSlasher(k){if(!SK[k])return false;if(SK[k].who&&SK[k].who!==(S.kat?'k':S.zab?'z':S.dzw?'d':S.mil?'m':'r'))return false;if(k==='whirl'&&S.zab)return false;const have=sk(k),max=ENCH.includes(k)&&S.mainEnchant&&S.mainEnchant!==k?3:SK[k].max||5;if(have>=max)return false;if(have)return true;const el=ELEMENT_OF[k];if(!el)return true;const own=chosenElements();if(own.some(v=>elementConflict(v,el)))return false;if(!own.includes(el)&&own.length>=2)return false;if(ENCH.includes(k)&&ENCH.filter(v=>sk(v)).length>=2)return false;return true}
function learnElement(k){if(!ELEMENT_OF[k])return;if(ENCH.includes(k)&&!S.mainEnchant)S.mainEnchant=k;const main=S.mainEnchant?ELEMENT_OF[S.mainEnchant]:null;const own=chosenElements();S.elementMain=main;S.elementSupport=own.find(e=>e!==main)||null}
function elementalSummary(){const main=S.mainEnchant?SK[S.mainEnchant].name:(EN?'none chosen':'nie wybrano');const own=chosenElements(),support=own.filter(e=>e!==S.elementMain).map(e=>ELEMENT_NAME[e]).join(', ')||'wolne';return (EN?`Blade: ${main} · support: ${support}. Fire excludes ice (blade spells only).`:`Ostrze: ${main} · wsparcie: ${support}. Ogień wyklucza lód (dotyczy zaklęć ostrza).`)}
function supportEnchant(e,a,crit){const k=ENCH.find(k=>sk(k)&&k!==encLevel()[0]);if(!k||e.dead)return;const L=Math.min(3,sk(k));if(!crit&&Math.random()>=encChance(L)*.5*(a.kind==='h'?1.5:1))return;
 if(k==='venom'){e.pois=Math.max(e.pois||0,2);e.poisD=Math.max(e.poisD||0,(2+L)*.35)}
 if(k==='fireblade'){e.burn=Math.max(e.burn||0,1.5);e.burnD=Math.max(e.burnD||0,(3+1.5*L)*.35)}
 if(k==='iceblade'){e.chill=Math.max(e.chill||0,1);e.chillMul=Math.min(e.chillMul||1,BIG.has(e.type)||e.type==='collector'?.9:.85)}
 if(k==='bloodblade'){e.bleed=Math.max(e.bleed||0,1.5);e.bleedDmg=Math.max(e.bleedDmg||0,(2+L)*.35)}
 swordSparks(e.x,e.y,ENC[k].col,5);
}
function swordSparks(x,y,col,n=8){for(let i=0;i<n;i++)S.parts.push({k:'e',x:x+rnd(-3,3),y:y+rnd(-2,2),z:rnd(8,16),vx:rnd(-12,12),vy:rnd(-8,8),vz:rnd(5,20),c:col,life:.2+rnd(0,.15)})}
const REND={cost:40,cuts:6,dmg:[9,9.6,10.3],cooldown:[12,11,10],wind:.14,dist:44,dur:.28,rec:.2,maxT:3,hitR:26};
const FAN={cost:20,dmgPct:[.60,.64,.68],cooldown:[8,7,6],wind:.25,rec:.25,cone:.39};
const LDANCE={cost:20,dur:5,cooldown:[20,18,16]};
const HOOK={cost:25,cooldown:[10,9,8],dist:80,speed:420,wind:.2,pull:.25,rec:.25,stun:1.2,mark:3,dmg:[12,12.8,13.7]};
const cdTxt=a=>a.join('/');
const MIL={wick:{max:5,gap:.6},strip:{len:44,lenN:10,w:13,wN:2,dur:2,durN:.4,tick:.5,dmg:9,dmgN:2,slow:.65,slowT:1.2,bossSlow:.9},
 effigy:{cost:24,cooldown:[16,14,12],life:[6,7,8],r:[44,50,56],touch:12,dmg:10,slowT:[2.2,2.6,3],bossSlowT:1.1,slow:.55,dist:46},
 gut:{cost:34,cooldown:[20,18,16],waves:5,gap:.2,r0:26,dr:13,dmg:[12,14,16],slow:.65,slowT:1.2,bossSlow:.9,hold:1.0}};
const DZW={echo:{cost:30,cooldown:[10,9,8],delay:.9,mul:[.5,.6,.7]},pledge:{cost:30,cooldown:[22,20,18],dur:6,sh:[.15,.2,.25],hv:1.5,keep:8},ton:{n:3,r:78,stun:1.6,dmg:18}};
Object.assign(SK,{
 odlew:{name:(EN?'Condemned Effigy':'Odlew Skazańca'),kind:(EN?'Active technique · Candlebound':'Technika aktywna · Woskownica'),ic:'odlew',max:3,who:'m',lv:[1,2,3].map(L=>(EN?`${MIL.effigy.cost} mana, cooldown ${MIL.effigy.cooldown[L-1]} s. A somersault in the chosen direction leaves a wax effigy (${MIL.effigy.life[L-1]} s). The first enemy to touch it shatters it, covering enemies nearby in wax: slowed for ${String(MIL.effigy.slowT[L-1])} s (${MIL.effigy.bossSlowT} s on bosses). Bursts once; does not draw enemies in.`:`${MIL.effigy.cost} many, odnowienie ${MIL.effigy.cooldown[L-1]} s. Przewrót w wybranym kierunku zostawia woskowy odlew (${MIL.effigy.life[L-1]} s). Pierwszy wróg, który go dotknie, rozbija go: wrogowie w pobliżu, oblepieni woskiem, są spowolnieni na ${String(MIL.effigy.slowT[L-1]).replace('.',',')} s (na bossach ${String(MIL.effigy.bossSlowT).replace('.',',')} s). Wybucha raz; nie przyciąga wrogów.`))},
 dogasanie:{name:(EN?'Guttering':'Dogasanie'),kind:(EN?'Active technique · Candlebound':'Technika aktywna · Woskownica'),ic:'dogasanie',max:3,who:'m',lv:[1,2,3].map(L=>(EN?`${MIL.gut.cost} mana, cooldown ${MIL.gut.cooldown[L-1]} s. Plants the candlestick butt and releases 5 waves of hot wax with growing radius (${MIL.gut.dmg[L-1]} dmg each, slow ${MIL.gut.slowT} s). Taking damage interrupts the remaining waves; a wave hits each enemy once.`:`${MIL.gut.cost} many, odnowienie ${MIL.gut.cooldown[L-1]} s. Wbija stopę lichtarza i uwalnia 5 fal gorącego wosku o rosnącym promieniu (po ${MIL.gut.dmg[L-1]} obr., spowolnienie ${String(MIL.gut.slowT).replace('.',',')} s). Utrata życia przerywa pozostałe fale; fala trafia wroga raz.`))},
 zalecho:{name:(EN?'Echo of Mourning':'Echo Żałoby'),kind:(EN?'Active technique · Bellringer':'Technika aktywna · Dzwonnik'),ic:'zalecho',max:3,who:'d',lv:[1,2,3].map(L=>(EN?`${DZW.echo.cost} stamina, cooldown ${DZW.echo.cooldown[L-1]} s. An immediate heavy blow; a motionless phantom stays behind and after ${DZW.echo.delay} s repeats the strike in the same place for ${Math.round(DZW.echo.mul[L-1]*100)}% of its damage.`:`${DZW.echo.cost} staminy, odnowienie ${String(DZW.echo.cooldown[L-1])} s. Natychmiastowy silny atak; w miejscu ciosu zostaje nieruchome widmo, które po ${String(DZW.echo.delay).replace('.',',')} s powtarza uderzenie za ${Math.round(DZW.echo.mul[L-1]*100)}% obrażeń.`))},
 zastaw:{name:(EN?'Life Pledge':'Zastaw Życia'),kind:(EN?'Active technique · Bellringer':'Technika aktywna · Dzwonnik'),ic:'zastaw',max:3,who:'d',lv:[1,2,3].map(L=>(EN?`${DZW.pledge.cost} stamina, cooldown ${DZW.pledge.cooldown[L-1]} s. For ${DZW.pledge.dur} s a shield absorbs damage equal to ${Math.round(DZW.pledge.sh[L-1]*100)}% of max health. Its unused part strengthens your next heavy blow (×${DZW.pledge.hv} of what is left).`:`${DZW.pledge.cost} staminy, odnowienie ${DZW.pledge.cooldown[L-1]} s. Przez ${DZW.pledge.dur} s osłona pochłania obrażenia równe ${Math.round(DZW.pledge.sh[L-1]*100)}% maks. życia. Niewykorzystana część wzmacnia następny silny atak (×${String(DZW.pledge.hv).replace('.',',')} pozostałej osłony).`))},
 rend:{name:(EN?'Rend':'Rozszarpanie'),kind:(EN?'Active technique · Assassin':'Technika aktywna · Zabójczyni'),ic:'rozszarpanie',max:3,who:'z',lv:[1,2,3].map(L=>(EN?`${REND.cost} stamina, cooldown ${REND.cooldown[L-1]} s. A swift dash of about 3 tiles through enemies with ${REND.cuts} cuts of ${REND.dmg[L-1]} dmg each; every cut hits up to ${REND.maxT} enemies. No invulnerability.`:`${REND.cost} staminy, odnowienie ${REND.cooldown[L-1]} s. Szybki wypad o ok. 3 pola przez wrogów: ${REND.cuts} cięć po ${String(REND.dmg[L-1]).replace('.',',')} obr., każde rani do ${REND.maxT} wrogów. Bez nietykalności.`))},
 fan:{name:(EN?'Blade Fan':'Wachlarz Ostrzy'),kind:(EN?'Active technique · Assassin':'Technika aktywna · Zabójczyni'),ic:'wachlarz',max:3,who:'z',lv:[1,2,3].map(L=>(EN?`${FAN.cost} stamina, cooldown ${FAN.cooldown[L-1]} s. Throw 3 spinning crescents in a 45° cone; each pierces up to 3 enemies and deals ${Math.round(FAN.dmgPct[L-1]*100)}% of a light attack.`:`${FAN.cost} staminy, odnowienie ${FAN.cooldown[L-1]} s. Rzut 3 wirujących sierpów w stożku 45°; każdy przebija do 3 wrogów i zadaje ${Math.round(FAN.dmgPct[L-1]*100)}% szybkiego ataku.`))},
 ldance:{name:(EN?'Last Dance':'Ostatni Taniec'),kind:(EN?'Active technique · Assassin':'Technika aktywna · Zabójczyni'),ic:'taniec',max:3,who:'z',lv:[1,2,3].map(L=>(EN?`${LDANCE.cost} stamina, cooldown ${LDANCE.cooldown[L-1]} s. For ${LDANCE.dur} s: +20% attack speed${L>1?` and +${7*(L-1)}% light attack damage`:''}, but you take +20% damage.`:`${LDANCE.cost} staminy, odnowienie ${LDANCE.cooldown[L-1]} s. Przez ${LDANCE.dur} s: +20% szybkości ataków${L>1?` i +${7*(L-1)}% obrażeń szybkich ataków`:''}, ale otrzymujesz +20% obrażeń.`))},
 hook:{name:(EN?'Executioner\'s Hook':'Hak Kata'),kind:(EN?'Active technique · Executioner':'Technika aktywna · Kat'),ic:'hak',max:3,who:'k',lv:[1,2,3].map(L=>(EN?`${HOOK.cost} stamina, cooldown ${HOOK.cooldown[L-1]} s. The hook flies 5 tiles and drags the first normal enemy to your feet: ${HOOK.dmg[L-1]} dmg, stun 1.2 s, then +25% damage taken for 3 s. Bosses and huge monsters are only marked.`:`${HOOK.cost} staminy, odnowienie ${HOOK.cooldown[L-1]} s. Hak leci na 5 pól i przyciąga pierwszego zwykłego wroga pod nogi: ${String(HOOK.dmg[L-1]).replace('.',',')} obr., ogłuszenie 1,2 s, potem +25% otrzymywanych obrażeń przez 3 s. Bossów i wielkie potwory tylko oznacza.`))}
});
// Three equipped active skills. Cooldowns belong to skills, never to slots.
const ACTIVE_SLASHER=['odlew','dogasanie','aard','stoneguard','frostshot','embershot','whirl','leap','rend','fan','ldance','hook','zalecho','zastaw'];
const ACTIVE_CFG={odlew:{cost:24,cd:'effCd',wait:L=>MIL.effigy.cooldown[Math.min(3,Math.max(1,L))-1]},dogasanie:{get cost(){return Math.round(34*((S&&S.pk&&S.pk.mGutCost)||1))},cd:'gutCd',wait:L=>MIL.gut.cooldown[Math.min(3,Math.max(1,L))-1]},zalecho:{cost:DZW.echo.cost,resource:'stamina',cd:'echoCd',wait:L=>DZW.echo.cooldown[Math.min(3,Math.max(1,L))-1]},zastaw:{cost:DZW.pledge.cost,resource:'stamina',cd:'pledgeCd',wait:L=>DZW.pledge.cooldown[Math.min(3,Math.max(1,L))-1]},rend:{cost:REND.cost,resource:'stamina',cd:'rendCd',wait:L=>REND.cooldown[Math.min(3,Math.max(1,L))-1]},fan:{cost:FAN.cost,resource:'stamina',cd:'fanCd',wait:L=>FAN.cooldown[Math.min(3,Math.max(1,L))-1]},ldance:{cost:LDANCE.cost,resource:'stamina',cd:'ldCd',wait:L=>LDANCE.cooldown[Math.min(3,Math.max(1,L))-1]},hook:{cost:HOOK.cost,resource:'stamina',cd:'hookCd',wait:L=>HOOK.cooldown[Math.min(3,Math.max(1,L))-1]},leap:{cost:LEAP.cost,resource:'stamina',cd:'leapCd',wait:L=>LEAP.cooldown[Math.min(3,Math.max(1,L))-1]},whirl:{cost:WHIRL.cost,resource:'stamina',cd:'whirlCd',wait:L=>WHIRL.cooldown[Math.min(3,L)-1]},aard:{cost:24,cd:'aardCd',wait:()=>0,wind:.18},stoneguard:{cost:34,cd:'guardCd',wait:()=>0,wind:.3},frostshot:{cost:18,cd:'shotCd',wait:()=>0},embershot:{cost:24,cd:'shotCd',wait:()=>0}};
// Existing spells keep their mana payment. Active sword techniques may explicitly select stamina.
function canPayMana(k){return pl.mana+1e-8>=ACTIVE_CFG[k].cost}
function payMana(k){pl.mana=Math.max(0,pl.mana-ACTIVE_CFG[k].cost);pl.manaDelay=SL.mana.delay}
function activeResourceName(k){return ACTIVE_CFG[k].resource==='stamina'?(EN?'stamina':'staminy'):(EN?'mana':'many')}
function canPayActive(k){return ACTIVE_CFG[k].resource==='stamina'?pl.sta+1e-8>=ACTIVE_CFG[k].cost:canPayMana(k)}
function payActive(k){if(ACTIVE_CFG[k].resource==='stamina'){pl.sta=Math.max(0,pl.sta-ACTIVE_CFG[k].cost);pl.staDelay=SL.delay}else payMana(k)}
function activeResourceFlash(k){if(ACTIVE_CFG[k].resource==='stamina'){S.stamFlash=.45;play('empty',.2)}else manaFlash()}
function manaFlash(t=.3){S.manaFlash=t;play('empty',.2)}
function gainMana(v){if(v>0&&pl.manaMax)pl.mana=Math.min(pl.manaMax,pl.mana+v)}
function autoEquipActive(k){const slots=pl2&&S.mpTurn===2?pl2.actives.activeSlots:S.activeSlots;if(!ACTIVE_SLASHER.includes(k)||slots.includes(k))return;const i=slots.indexOf(null);if(i>=0)slots[i]=k;renderActiveHud()}
// 13.11.2026 (decyzja autora): zmiana wyposażenia umiejętności w pauzie zawsze, także w walce.
// Trwające użycie (activeWind, przywołania) ma własny klucz umiejętności, więc zmiana slotu go nie przerywa.
function loadoutSafe(){return !!(S&&S.paused&&!pl.dead)}
function equipActive(i,k){if(!loadoutSafe()||!Number.isInteger(i)||i<0||i>=S.activeSlots.length||k!==null&&(!ACTIVE_SLASHER.includes(k)||!sk(k)))return false;const other=k?S.activeSlots.indexOf(k):-1,old=S.activeSlots[i];S.activeSlots[i]=k;if(other>=0&&other!==i)S.activeSlots[other]=old;renderLoadout();renderActiveHud();return true}
function activateSlot(i){if(!swordCanAct())return false;const k=S.activeSlots[i],c=ACTIVE_CFG[k],L=sk(k);if(!c||!L)return false;if((S[c.cd]||0)>0){play('empty',.2);return false}if(!canPayActive(k)){activeResourceFlash(k);return false}S.combatLock=4;
 if(k==='whirl'){beginWhirl(L);return true}
 if(k==='leap'){beginLeap(L);return true}
 if(k==='rend'){beginRend(L);return true}
 if(k==='fan'){beginFan(L);return true}
 if(k==='hook'){beginHook(L);return true}
 if(k==='ldance'){beginLDance(L);return true}
 if(k==='odlew')return beginEffigy(L);
 if(k==='dogasanie')return beginGut(L);
 if(k==='zalecho')return beginEcho(L);
 if(k==='zastaw')return beginPledge(L);
 if(['frostshot','embershot'].includes(k)){requestSwordShot(k);return true}
 const d=aimDir()||[pl.fx,pl.fy];pl.fx=d[0];pl.fy=d[1];payActive(k);S[c.cd]=c.wait(L);S.activeWind={k,x:d[0],y:d[1],t:c.wind};pl.atk={kind:'skill',stage:'wind',t:c.wind};pl.atkHeld=false;pl.charging=false;S.actions.skill=(S.actions.skill||0)+1;play('swing',0);return true}
// Siła i Inteligencja wzmacniają wszystkie umiejętności aktywne (Siła ×1,1 za wybór, Inteligencja ×1,02 za wybór).
const skillMul=()=>(S.str||1)*(S.int||1);
// Whirl owns one existing slash visual and one bounded set for this activation only.
function beginWhirl(L){const level=Math.min(3,Math.max(1,L)),angle=Math.atan2(pl.fy,pl.fx);payActive('whirl');S.kKrN=0;S.whirlCd=ACTIVE_CFG.whirl.wait(level);S.actions.skill=(S.actions.skill||0)+1;
 pl.block=false;pl.blockT=0;pl.parryT=0;pl.atkHeld=false;pl.charging=false;pl.queue=false;pl.comboT=0;pl.inv=Math.max(pl.inv,WHIRL.inv);
 const visual=beginWhirlVisual(level,angle);
 pl.atk={kind:'whirl',stage:'act',L:level,elapsed:0,t:WHIRL.duration,angle,baseAngle:angle,pulse:0,statuses:new Set(),visual,statusOnly:true};play('swing',0);}
function endWhirl(){const a=pl?.atk;if(a?.kind!=='whirl')return;if(a.visual){releaseWhirlVisual(a.visual,false);a.visual=null}a.statuses.clear();pl.atk=null;pl.swingT=0;pl.queue=false;pl.atkHeld=false;pl.charging=false;}
function whirlHit(a){const R=WHIRL.radius[a.L-1]*(S.pk.kReach||1),dmg=WHIRL.damage[a.L-1]*(1+.07*(S.lvl-1))*(S.str||1)*(S.int||1)*might()*encDmg(encLevel()[1]),oldM=ftMelee,oldH=ftHeavy,oldC=ftCrit;
 ftMelee=true;ftHeavy=false;ftCrit=false;const oldT=S.kTag;S.kTag='w';try{for(const e of S.enemies){if(e.dead||e.rise>0||Math.hypot(e.x-pl.x,e.y-pl.y)>R+e.r||!sightSword(pl.x,pl.y,e.x,e.y))continue;
 const d=Math.hypot(e.x-pl.x,e.y-pl.y)||1;if(!damageEnemy(e,dmg,(e.x-pl.x)/d,(e.y-pl.y)/d,0,'sk:whirl'))continue;
 if(!a.statuses.has(e)){a.statuses.add(e);supportEnchant(e,a,false);applyEnchants(e,a,false);}}}finally{ftMelee=oldM;ftHeavy=oldH;ftCrit=oldC;S.kTag=oldT}}
function whirlTick(dt){const a=pl.atk;if(pl.dead||pl.broken>0){endWhirl();return}pl.block=false;pl.parryT=0;pl.atkHeld=false;pl.charging=false;pl.queue=false;heavyPress=false;
 pl.staDelay=Math.max(0,pl.staDelay-dt);for(const k of ['parryHealCd','parryCd','riposte','dance'])if(pl[k]>0)pl[k]=Math.max(0,pl[k]-dt);waveTick(dt);
 if(a.stage==='rec'){a.t-=dt;if(a.t<=1e-8)endWhirl();return}
 a.elapsed+=dt;a.t=Math.max(0,WHIRL.duration-a.elapsed);a.angle=a.baseAngle+a.elapsed/WHIRL.duration*Math.PI*4;
 const dx=Math.cos(a.angle),dy=Math.sin(a.angle);pl.swingDir=Math.abs(dx)>Math.abs(dy)?2:dy>0?0:1;pl.swingS=dx>=0?1:-1;pl.swingT=.15;pl.swingDur=.26;
 const n=WHIRL.hits[a.L-1],step=WHIRL.duration/n;while(a.pulse<n&&a.elapsed+1e-8>=(a.pulse+.5)*step){whirlHit(a);a.pulse++;}
 // The visual pool follows the player in syncWhirlVisual, after enemy warnings update.
 if(a.elapsed+1e-8>=WHIRL.duration){a.stage='rec';a.t=Math.max(0,WHIRL.recovery-Math.max(0,a.elapsed-WHIRL.duration));a.statuses.clear();if(a.visual){releaseWhirlVisual(a.visual,true);a.visual=null}pl.swingT=0;if(a.t<=1e-8)endWhirl();}}
// Atak z doskoku (tylko Kat): skok o 3 pola, nietykalność w locie, lądowanie ranie jednego wroga i odpycha resztę o 1 pole.
function beginLeap(L){const level=Math.min(3,Math.max(1,L)),d=aimDir()||(pl.moving?[pl.fx,pl.fy]:null)||autoAim()||[pl.fx,pl.fy],m=Math.hypot(d[0],d[1])||1,dx=d[0]/m,dy=d[1]/m;pl.fx=dx;pl.fy=dy;payActive('leap');S.leapCd=ACTIVE_CFG.leap.wait(level);S.actions.skill=(S.actions.skill||0)+1;
 pl.block=false;pl.blockT=0;pl.parryT=0;pl.atkHeld=false;pl.charging=false;pl.queue=false;pl.comboT=0;
 pl.atk={kind:'leap',stage:'wind',L:level,t:LEAP.wind,at:0,moved:0,dx,dy,statuses:new Set()};play('swing',0)}
function endLeap(){const a=pl?.atk;if(a?.kind!=='leap')return;pl.atk=null;pl.swingT=0;pl.queue=false;pl.atkHeld=false;pl.charging=false}
function leapLand(a){const dmg=(SL.heavy.dmg)*LEAP.mul[a.L-1]*(1+.07*(S.lvl-1))*(S.str||1)*might()*encDmg(encLevel()[1]),oldM=ftMelee,oldH=ftHeavy,oldC=ftCrit;let tgt=null,bd=1e9;
 for(const e of S.enemies){if(e.dead||e.rise>0)continue;const d=Math.hypot(e.x-pl.x,e.y-pl.y);if(d<=LEAP.hitR+e.r&&d<bd){bd=d;tgt=e}}
 ftMelee=true;ftHeavy=true;ftCrit=false;const oldT=S.kTag;S.kTag='l';try{
  if(tgt){const d=bd||1;if(damageEnemy(tgt,dmg,(tgt.x-pl.x)/d,(tgt.y-pl.y)/d,0,'sk:leap')){supportEnchant(tgt,a,false);applyEnchants(tgt,a,false)}}
  for(const e of S.enemies){if(e===tgt||e.dead||e.rise>0||BIG.has(e.type)||e.type==='collector'||e.type==='glizzard')continue;const dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy);if(d>LEAP.pushR+e.r)continue;const n=d||1,ux=d?dx/n:pl.fx,uy=d?dy/n:pl.fy;moveBox(e,ux*LEAP.push,uy*LEAP.push,e.hw||e.r-1,3);slashStagger(e,LEAP.stun,true)}
 }finally{ftMelee=oldM;ftHeavy=oldH;ftCrit=oldC;S.kTag=oldT}
 for(let i=0;i<16;i++){const an=Math.random()*Math.PI*2,sp=rnd(18,46);S.parts.push({k:'d',x:pl.x+Math.cos(an)*4,y:pl.y+Math.sin(an)*3,z:rnd(1,5),vx:Math.cos(an)*sp,vy:Math.sin(an)*sp*.6,vz:rnd(8,26),c:Math.random()<.5?'#6e6458':'#8d8272',life:rnd(.35,.7)})}
 shake(.35,.3);play(tgt?'hitH':'hit',.05)}
function leapTick(dt){const a=pl.atk;if(pl.dead||pl.broken>0){endLeap();return}pl.block=false;pl.parryT=0;pl.atkHeld=false;pl.charging=false;pl.queue=false;heavyPress=false;
 pl.staDelay=Math.max(0,pl.staDelay-dt);for(const k of ['parryHealCd','parryCd','riposte','dance'])if(pl[k]>0)pl[k]=Math.max(0,pl[k]-dt);waveTick(dt);
 if(a.stage==='wind'){a.t-=dt;if(a.t<=0){a.stage='air';a.t=LEAP.air;a.at=0}return}
 if(a.stage==='air'){pl.inv=Math.max(pl.inv,.12);const step=LEAP.dist/LEAP.air*dt,n=Math.max(1,Math.ceil(step/3));let blocked=false;
  for(let i=0;i<n;i++){const ox=pl.x,oy=pl.y,q=step/n;moveBox(pl,a.dx*q,a.dy*q,4,3,true);const mv=Math.hypot(pl.x-ox,pl.y-oy);a.moved+=mv;if(mv<q*.5){blocked=true;break}}
  a.at+=dt;if(blocked||a.moved>=LEAP.dist-.5||a.at>=LEAP.air){a.stage='land';a.t=LEAP.land;pl.inv=Math.max(pl.inv,.12);leapLand(a)}return}
 a.t-=dt;if(a.t<=1e-8)endLeap()}
// ======== Zabójczyni (Ash Dancer) i nowe umiejętności ========
const SKATK=['whirl','leap','rend','fan','hook','gut'],FACEK=['leap','rend','fan','hook'];
const lastCombo=()=>S.zab?4:2;
const finMul=e=>S.zab&&S.pk.zFin?(e.hp<e.max*.35?1.5:.85):1;
const skDmg=b=>b*(1+.07*(S.lvl-1))*skillMul()*might();
// tempo ataków: wściekłość Rycerza, +30% lekkich (Zabójczyni), premia serii, Ostatni Taniec, szybka kontra po parowaniu
function atkRate(a){let r=(S.pk.fury>1&&pl.hp<pl.max*.35?S.pk.fury:1)*(S.pk.aspd||1);if(S.zab){if(a.kind==='l')r*=S.pk.zAspd||1;r*=1+(S.zCombo||0);if(S.zDance>0)r*=1.2;if(pl.riposte>0&&a.kind==='l')r*=1.35}return r}
function zabTick(dt){
 if(S.zT>0){S.zT-=dt;if(S.zT<=0){S.zCombo=0;S.zHits=0}}
 if((S.zCombo||0)>=S.pk.zCap-1e-6){S.zFull+=dt;if(S.zFull>S.zFullBest)S.zFullBest=S.zFull}else S.zFull=0;
 if(S.zWin>0)S.zWin-=dt;
 if(S.zDance>0){S.zDance-=dt;if(Math.random()<dt*30)S.parts.push({k:'e',x:pl.x+rnd(-6,6),y:pl.y+rnd(-2,2),z:rnd(6,22),vx:0,vy:0,vz:rnd(8,18),c:Math.random()<.5?'#e0182c':'#ff6a4a',life:.4})}
 if(pl.roll>0)S.zWasRoll=1;else if(S.zWasRoll){S.zWasRoll=0;if(S.zDodgeOk){S.zWin=S.pk.zWinT;S.zDodgeOk=0}}
 if(pl.block&&pl.blockT>.35)S.zHold=1}
// efekty cięć z arkuszy fx_zab (komórki 256) i fx_kat (313x256); klatki robione raz
const FXC={};
function fxFrames(name,row,n=4){const key=name+row;if(FXC[key])return FXC[key];const im=typeof IMGS!=='undefined'&&IMGS&&IMGS[name];if(!im)return null;const cw=name==='fx_kat'?313:256,ch=256,s2=Math.max(cw,ch),out=[];
 for(let i=0;i<n;i++){const c=document.createElement('canvas');c.width=c.height=s2;c.getContext('2d').drawImage(im,i*cw,row*ch,cw,ch,(s2-cw)/2,(s2-ch)/2,cw,ch);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;out.push({n:new THREE.MeshBasicMaterial({map:t,transparent:true,alphaTest:.04,depthWrite:false,depthTest:false,side:THREE.DoubleSide,fog:false})})}return FXC[key]=out}
function zfx(name,row,dur,x,y,h,size,mode,rot){const fr=fxFrames(name,row);if(!fr)return null;addVfx(fr,dur,x,y,h,size,mode||'bill',rot||0);return S.vfx[S.vfx.length-1]}
function zabSlashFx(a,c,s,R,vs,ox=pl.x,oy=pl.y){
 if(a.kind==='h')return !!zfx('fx_zab',2,.34,ox,oy,.13,R/16*1.1,'ground',0);
 if(a.combo===4)return !!zfx('fx_zab',1,.24,ox+c*R*.6,oy+s*R*.6,.6,vs*1.3,'bill',0);
 return !!zfx('fx_zab',0,.22,ox+c*R*.55,oy+s*R*.55,.6,vs*1.15,'bill',-screenAng(c,s))}
function skTickCommon(dt){pl.block=false;pl.parryT=0;pl.atkHeld=false;pl.charging=false;pl.queue=false;heavyPress=false;pl.staDelay=Math.max(0,pl.staDelay-dt);for(const k of ['parryHealCd','parryCd','riposte','dance'])if(pl[k]>0)pl[k]=Math.max(0,pl[k]-dt);waveTick(dt)}
function skPrep(){pl.block=false;pl.blockT=0;pl.parryT=0;pl.atkHeld=false;pl.charging=false;pl.queue=false;pl.comboT=0}
function endSk(kind){const a=pl?.atk;if(!a||a.kind!==kind)return;if(kind==='hook')hookClear(a);pl.atk=null;pl.swingT=0;pl.queue=false;pl.atkHeld=false;pl.charging=false}
function skDir(){const d=aimDir()||(pl.moving?[pl.fx,pl.fy]:null)||autoAim()||[pl.fx,pl.fy],m=Math.hypot(d[0],d[1])||1;return [d[0]/m,d[1]/m]}
// --- Rozszarpanie: wypad z 6 cięciami ---
function beginRend(L){const level=Math.min(3,Math.max(1,L)),[dx,dy]=skDir();pl.fx=dx;pl.fy=dy;payActive('rend');S.rendCd=ACTIVE_CFG.rend.wait(level);S.actions.skill=(S.actions.skill||0)+1;skPrep();
 pl.atk={kind:'rend',stage:'wind',L:level,t:REND.wind,at:0,n:0,dx,dy,st:new Set()};play('swing',0)}
function rendCut(a){const cx=pl.x+a.dx*12,cy=pl.y+a.dy*12,dmg=skDmg(REND.dmg[a.L-1]),oldM=ftMelee,oldH=ftHeavy,oldC=ftCrit,list=[];
 for(const e of S.enemies){if(e.dead||e.rise>0)continue;const d=Math.hypot(e.x-cx,e.y-cy);if(d<=REND.hitR+e.r)list.push([d,e])}
 list.sort((p,q)=>p[0]-q[0]);ftMelee=true;ftHeavy=false;ftCrit=false;
 try{for(const [d,e] of list.slice(0,REND.maxT)){const big=BIG.has(e.type)||e.type==='collector';if(!damageEnemy(e,dmg*finMul(e),a.dx,a.dy,.25,'sk:rend'))continue;if(!a.st.has(e)){a.st.add(e);supportEnchant(e,a,false);applyEnchants(e,a,false)}if(!e.dead){if(big)breakPoise(e,4);else slashStagger(e,.25)}}}finally{ftMelee=oldM;ftHeavy=oldH;ftCrit=oldC}
 {const vr=a.n%2?0:Math.random()*6.28;if(WEAPON_FX_ON)bindWeaponFx(zfx('fx_zab',a.n%2?1:0,.18,cx+a.dx*8,cy+a.dy*8,1.6,1.0,'bill',-screenAng(a.dx,a.dy)));else zfx('fx_zab',a.n%2?1:0,.18,cx+a.dx*8,cy+a.dy*8,.6,1.5,'bill',vr);}if(a.n%2===0)play('bladeLight',.03);shake(.05,.05)}
function rendTick(dt){const a=pl.atk;if(pl.dead||pl.broken>0){endSk('rend');return}skTickCommon(dt);
 if(a.stage==='wind'){a.t-=dt;if(a.t<=0){a.stage='cut';a.at=0;a.n=0}return}
 if(a.stage==='cut'){a.at+=dt;moveBox(pl,a.dx*REND.dist/REND.dur*dt,a.dy*REND.dist/REND.dur*dt,4,3,true);const done=a.at>=REND.dur;
  while(a.n<REND.cuts&&(done||a.at+1e-8>=(a.n+.3)*REND.dur/REND.cuts)){rendCut(a);a.n++}
  if(done){a.stage='rec';a.t=REND.rec}return}
 a.t-=dt;if(a.t<=1e-8)endSk('rend')}
// --- Wachlarz Ostrzy: 3 wirujące sierpy w stożku 45° ---
function beginFan(L){const level=Math.min(3,Math.max(1,L)),[dx,dy]=skDir();pl.fx=dx;pl.fy=dy;payActive('fan');S.fanCd=ACTIVE_CFG.fan.wait(level);S.actions.skill=(S.actions.skill||0)+1;skPrep();
 pl.atk={kind:'fan',stage:'wind',L:level,t:FAN.wind,dx,dy};play('swing',0)}
function fanLaunch(a){const ang=Math.atan2(a.dy,a.dx),base=skDmg(SL.light.dmg[0])*FAN.dmgPct[a.L-1],life=.5;
 for(const off of [-FAN.cone,0,FAN.cone]){const t=ang+off,c=Math.cos(t),s=Math.sin(t),fr=fxFrames('fx_zab',3);let f=null;
  if(fr){addVfx(skLoop(fr,life,14),life,pl.x+c*14,pl.y+s*14,.6,1.15,'bill',-screenAng(c,s));f=S.vfx[S.vfx.length-1]}
  (S.waves=S.waves||[]).push({f,x:pl.x+c*14,y:pl.y+s*14,vx:c*210,vy:s*210,t:life,r:9,dmg:base,hit:new Set(),cap:3,sk:'fan'})}
 play('katana',0);shake(.08,.08)}
function fanTick(dt){const a=pl.atk;if(pl.dead||pl.broken>0){endSk('fan');return}skTickCommon(dt);
 if(a.stage==='wind'){a.t-=dt;if(a.t<=0){fanLaunch(a);a.stage='rec';a.t=FAN.rec}return}
 a.t-=dt;if(a.t<=1e-8)endSk('fan')}
// --- Ostatni Taniec: 5 s szybszych ataków za cenę większych obrażeń ---
function beginLDance(L){const level=Math.min(3,Math.max(1,L));payActive('ldance');S.ldCd=ACTIVE_CFG.ldance.wait(level);S.actions.skill=(S.actions.skill||0)+1;S.zDance=LDANCE.dur;S.zDanceL=level;play('swing',0);ftInfo(EN?'Last Dance!':'Ostatni Taniec!');for(let i=0;i<24;i++){const an=Math.random()*Math.PI*2;S.parts.push({k:'e',x:pl.x+Math.cos(an)*6,y:pl.y+Math.sin(an)*4,z:rnd(2,16),vx:Math.cos(an)*30,vy:Math.sin(an)*18,vz:rnd(6,20),c:Math.random()<.5?'#e0182c':'#ffb347',life:rnd(.3,.6)})}}
// --- Hak Kata: hak leci na 5 pól, przyciąga pierwszego wroga pod nogi ---
function hookVis(a,init){
 if(init){const hf=fxFrames('fx_kat',0),cf=fxFrames('fx_kat',1);if(hf){addVfx([hf[1]],99,pl.x,pl.y,.6,.8,'bill',-screenAng(a.dx,a.dy));a.vh=S.vfx[S.vfx.length-1]}if(cf){addVfx([cf[1]],99,pl.x,pl.y,.15,1,'ground',0);a.vc=S.vfx[S.vfx.length-1]}}
 if(a.vh){a.vh.x=a.hx;a.vh.y=a.hy;a.vh.t=0;if(WEAPON_FX_ON){a.vh.h=1.4;a.vh.weaponAspect=.74}}
 if(a.vc){if(WEAPON_FX_ON)a.vc.h=.7;const L=Math.hypot(a.hx-pl.x,a.hy-pl.y);a.vc.x=(pl.x+a.hx)/2;a.vc.y=(pl.y+a.hy)/2;a.vc.rot=-Math.atan2(a.hy-pl.y,a.hx-pl.x);a.vc.sx=Math.max(.05,L/32);a.vc.sy=.3;a.vc.t=0}}
function hookClear(a){for(const v of [a.vh,a.vc])if(v)v.t=v.dur;a.vh=a.vc=null}
function beginHook(L){const level=Math.min(3,Math.max(1,L)),[dx,dy]=skDir();pl.fx=dx;pl.fy=dy;payActive('hook');S.hookCd=ACTIVE_CFG.hook.wait(level);S.actions.skill=(S.actions.skill||0)+1;skPrep();
 pl.atk={kind:'hook',stage:'wind',L:level,t:HOOK.wind,dx,dy,len:0,hx:pl.x,hy:pl.y,tgt:null};play('swing',0)}
function hookHit(a,e){const big=BIG.has(e.type)||e.type==='collector'||e.type==='glizzard',oldM=ftMelee,oldH=ftHeavy,oldC=ftCrit;ftMelee=true;ftHeavy=false;ftCrit=false;
 try{damageEnemy(e,skDmg(HOOK.dmg[a.L-1]),a.dx,a.dy,0,'sk:hook')}finally{ftMelee=oldM;ftHeavy=oldH;ftCrit=oldC}
 e.hookMark=HOOK.mark;play('hitH',.05);shake(.12,.1);swordSparks(e.x,e.y,'#c4202a',8);
 if(e.dead||big){a.stage='ret';a.t=HOOK.rec;return}a.stage='pull';a.t=HOOK.pull;a.tgt=e}
function hookTick(dt){const a=pl.atk;if(pl.dead||pl.broken>0){endSk('hook');return}skTickCommon(dt);
 if(a.stage==='wind'){a.t-=dt;if(a.t<=0){a.stage='fly';a.len=0;a.hx=pl.x;a.hy=pl.y;hookVis(a,true);play('swing',0)}return}
 if(a.stage==='fly'){const n=Math.max(1,Math.ceil(HOOK.speed*dt/4)),st=HOOK.speed*dt/n;let hit=null;
  for(let i=0;i<n&&!hit&&a.stage==='fly';i++){a.len+=st;a.hx=pl.x+a.dx*a.len;a.hy=pl.y+a.dy*a.len;
   if(boxSolid(a.hx,a.hy,2,2)||a.len>=HOOK.dist){a.stage='ret';a.t=HOOK.rec;break}
   for(const e of S.enemies){if(e.dead||e.rise>0)continue;if(Math.hypot(e.x-a.hx,e.y-a.hy)<=e.r+4){hit=e;break}}}
  if(hit)hookHit(a,hit);hookVis(a);return}
 if(a.stage==='pull'){const e=a.tgt;a.t-=dt;if(!e||e.dead){a.stage='ret';a.t=HOOK.rec;hookVis(a);return}
  const tx=pl.x+a.dx*(e.r+7),ty=pl.y+a.dy*(e.r+7),dx=tx-e.x,dy=ty-e.y,dd=Math.hypot(dx,dy);e.stun=Math.max(e.stun||0,.3);e.sw=0;e.ghoulWind=0;
  if(dd>2){const stp=Math.min(dd,HOOK.dist/HOOK.pull*dt);moveBox(e,dx/dd*stp,dy/dd*stp,e.hw||e.r-1,3)}
  a.hx=e.x;a.hy=e.y;a.len=Math.hypot(e.x-pl.x,e.y-pl.y);
  if(dd<=2||a.t<=0){e.stun=Math.max(e.stun||0,HOOK.stun);e.staggerCd=HOOK.stun+SL.staggerGap;a.stage='ret';a.t=HOOK.rec}
  hookVis(a);return}
 a.t-=dt;a.len=Math.max(0,a.len-HOOK.dist/HOOK.rec*dt);if(!(a.tgt&&!a.tgt.dead&&Math.hypot(a.tgt.x-pl.x,a.tgt.y-pl.y)<30)){a.hx=pl.x+a.dx*a.len;a.hy=pl.y+a.dy*a.len}else{a.hx=pl.x;a.hy=pl.y}
 hookVis(a);if(a.t<=1e-8)endSk('hook')}
// Three reusable visual handles: ring, startup dust, ending debris. Never allocate per frame/cast.
let whirlVisualPool=[];
function initWhirlVisuals(){if(whirlVisualPool.length)return;const texture=texFrom(bloodFix(IMGS.whirl_fx,320,80));for(let i=0;i<3;i++){const mesh=new THREE.Mesh(new THREE.PlaneBufferGeometry(1,.625),new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.06,depthWrite:false,depthTest:true,side:THREE.DoubleSide,fog:false}));mesh.renderOrder=-3;mesh.frustumCulled=false;mesh.visible=false;scene.add(mesh);whirlVisualPool.push({mesh,active:false,kind:'steel',elapsed:0,x:0,y:0,radius:32,frame:-1,level:1})}}
function setWhirlVisualFrame(f,frame){const key=f.kind+':'+frame;if(f.frame===key)return;f.frame=key;const a=WHIRL_FX.effects[f.kind].frames[frame],uv=f.mesh.geometry.attributes.uv,u0=(a.x+.5)/WHIRL_FX.width,u1=(a.x+a.width-.5)/WHIRL_FX.width,v0=1-(a.y+a.height-.5)/WHIRL_FX.height,v1=1-(a.y+.5)/WHIRL_FX.height;uv.setXY(0,u0,v1);uv.setXY(1,u1,v1);uv.setXY(2,u0,v0);uv.setXY(3,u1,v0);uv.needsUpdate=true}
let skWhirlMesh=null;function skWhirl(){if(!skWhirlMesh){skWhirlMesh=new THREE.Mesh(new THREE.PlaneBufferGeometry(1,1),new THREE.MeshBasicMaterial({transparent:true,alphaTest:.04,depthWrite:false,side:THREE.DoubleSide,fog:false}));skWhirlMesh.renderOrder=-3;skWhirlMesh.frustumCulled=false;skWhirlMesh.visible=false;scene.add(skWhirlMesh)}return skWhirlMesh}
function clearWhirlVisuals(){if(skWhirlMesh)skWhirlMesh.visible=false;for(const f of whirlVisualPool){f.active=false;f.mesh.visible=false}}
function beginWhirlVisual(level,angle){initWhirlVisuals();clearWhirlVisuals();const f=whirlVisualPool[0],dust=whirlVisualPool[1];for(let i=0;i<2;i++){const z=whirlVisualPool[i];z.active=true;z.elapsed=0;z.x=pl.x;z.y=pl.y;z.radius=WHIRL.radius[level-1];z.level=level;z.frame=-1;z.mesh.visible=false}f.kind=COMBAT_TRAIL[encLevel()[0]]||embTrail()||'steel';dust.kind='start';return f}
function releaseWhirlVisual(f,finished){f.active=false;f.mesh.visible=false;if(skWhirlMesh)skWhirlMesh.visible=false;whirlVisualPool[1].active=false;whirlVisualPool[1].mesh.visible=false;if(finished){const end=whirlVisualPool[2];end.active=true;end.elapsed=0;end.kind='end';end.frame=-1;end.x=pl.x;end.y=pl.y;end.radius=f.radius;end.mesh.visible=false}}
function syncWhirlVisual(dt=0){const a=pl?.atk;for(let i=0;i<whirlVisualPool.length;i++){const f=whirlVisualPool[i];if(!f.active)continue;
 if(!S||S.phase!=='play'||pl.dead){f.active=false;f.mesh.visible=false;continue}
 const ring=i===0;if(ring){if(a?.kind!=='whirl'||a.stage!=='act'){f.active=false;f.mesh.visible=false;if(skWhirlMesh)skWhirlMesh.visible=false;continue}f.elapsed=a.elapsed;f.x=pl.x;f.y=pl.y;f.kind=COMBAT_TRAIL[encLevel()[0]]||embTrail()||'steel'}else{f.elapsed+=dt;if(f.elapsed>=.22){f.active=false;f.mesh.visible=false;continue}}
 const low=SETT.quality==='low',raw=ring?Math.floor(f.elapsed/(WHIRL.duration/8))%4:Math.min(3,Math.floor(f.elapsed/.055)),frame=low?raw<2?0:2:raw;
 setWhirlVisualFrame(f,frame);let warning=false;for(const e of S.enemies)if(!e.dead&&attackCue(e)&&Math.hypot(e.x-f.x,e.y-f.y)<f.radius+e.r+12){warning=true;break}
 const m=f.mesh;m.visible=!warning;m.position.set(f.x/16,WEAPON_FX_ON?(ring?.72:.07):.13,f.y/16);m.rotation.set(-Math.PI/2,0,0);const size=f.radius*2/16*(low?.94:1);m.scale.set(size,size/Math.sin(PITCH),1);m.material.opacity=(ring?.66:.45)*(SETT.flash?1:.38)*(ring?1:1-f.elapsed/.22);
 if(ring){const wf=skFrames('whirl',f.kind==='steel'?null:f.kind),sm=skWhirl();if(wf){m.visible=false;sm.visible=!warning;sm.material=wf[frame%wf.length].n;sm.position.copy(m.position);sm.rotation.set(-Math.PI/2,0,0);const q=f.radius*2/16*(WEAPON_FX_ON?1:1.25);sm.scale.set(q,q/Math.sin(PITCH),1)}else sm.visible=false}
}}

function activeSlotsTick(dt){S.combatLock=Math.max(0,(S.combatLock||0)-dt);S.aardCd=Math.max(0,(S.aardCd||0)-dt);if(!S.activeWind)return;
 if(pl.dead||pl.roll>0||pl.broken>0){S.activeWind=null;if(pl.atk?.kind==='skill')pl.atk=null;return}S.activeWind.t-=dt;if(S.activeWind.t>0)return;const w=S.activeWind;S.activeWind=null;pl.atk=null;if(w.k==='aard')castAard(true);if(w.k==='stoneguard')summonSwordGuardian(true);
 pl.atk={kind:'skill',stage:'rec',t:.18};}
function renderLoadoutOne(){const el=$('skillLoadout');if(!el)return;el.hidden=!S;if(el.hidden)return;const focused=document.activeElement,focusSlot=el.contains(focused)?focused.dataset.slot:undefined,focusEquip=el.contains(focused)?focused.dataset.equip:undefined;const safe=loadoutSafe(),selected=S.loadoutSelected||0,keys=pl2&&pl===pl2?['LT+X','LT+Y','LT+B','LT+A']:[kbName(KB.map.s1)+' · LT+X',kbName(KB.map.s2)+' · LT+Y',kbName(KB.map.s3)+' · LT+B',kbName(KB.map.s4)+' · LT+A','G · LT+RB','6 · LT+LS'];el.innerHTML=(EN?'<h2>Active skills</h2><p>Choose a slot, then a skill you have learned. Sword techniques and blade spells work outside slots.</p><div class="slot-pick">':'<h2>Aktywne umiejętności</h2><p>Wybierz slot, potem zdobytą umiejętność. Techniki miecza i zaklęcia ostrza działają poza slotami.</p><div class="slot-pick">')+S.activeSlots.map((k,i)=>`<button type="button" class="go slot-tab${selected===i?' chosen':''}" data-slot="${i}" aria-pressed="${selected===i}"><small class="loadout-key">${keys[i]}</small>${k?`<i data-premium-skill="${k}" class="ic ic-${SK[k].ic}"></i><span class="loadout-name">${SK[k].name}</span>`:`<span class="loadout-name empty-name">${EN?'Empty slot':'Wolny slot'}</span>`}</button>`).join('')+'</div><p class="loadout-state">'+(safe?(EN?'You can change your loadout. Cooldowns stay with the skills.':'Możesz zmienić wyposażenie. Odnowienia pozostają przypisane do umiejętności.'):(EN?'Changes are locked during combat. Move away from enemies and wait 4 s without attacking or being hit.':'Zmiana zablokowana podczas walki. Oddal się od wrogów i odczekaj 4 s bez atakowania ani otrzymywania ciosów.'))+'</p>'+(ACTIVE_SLASHER.some(k=>sk(k))?'':`<p class="loadout-state">${EN?'You have no active skill yet. You earn them on level-up cards.':'Nie masz jeszcze aktywnej umiejętności. Zdobywasz je na kartach przy awansie.'}</p>`)+'<div class="slot-inventory">'+ACTIVE_SLASHER.filter(k=>sk(k)).map(k=>(EN?`<button type="button" class="go${S.activeSlots[selected]===k?' selected-skill':''}" data-equip="${k}" ${safe?'':'disabled'}><i data-premium-skill="${k}" class="ic ic-${SK[k].ic}"></i><span class="loadout-copy">${SK[k].name}<small>${ACTIVE_CFG[k].cost} ${activeResourceName(k)} · ${S[ACTIVE_CFG[k].cd]>0?'cooldown '+Math.ceil(S[ACTIVE_CFG[k].cd])+' s':'ready'}${S.activeSlots.includes(k)?' · slot '+(S.activeSlots.indexOf(k)+1):' · in reserve'}</small></span></button>`:`<button type="button" class="go${S.activeSlots[selected]===k?' selected-skill':''}" data-equip="${k}" ${safe?'':'disabled'}><i data-premium-skill="${k}" class="ic ic-${SK[k].ic}"></i><span class="loadout-copy">${SK[k].name}<small>${ACTIVE_CFG[k].cost} ${activeResourceName(k)} · ${S[ACTIVE_CFG[k].cd]>0?'odnowienie '+Math.ceil(S[ACTIVE_CFG[k].cd])+' s':'gotowa'}${S.activeSlots.includes(k)?' · slot '+(S.activeSlots.indexOf(k)+1):' · w rezerwie'}</small></span></button>`)).join('')+(EN?`<button type="button" class="go alt" data-equip="" ${safe&&S.activeSlots[selected]?'':'disabled'}>Empty slot ${selected+1}</button></div>`:`<button type="button" class="go alt" data-equip="" ${safe&&S.activeSlots[selected]?'':'disabled'}>Opróżnij slot ${selected+1}</button></div>`);const restore=focusSlot!==undefined?el.querySelector('[data-slot="'+focusSlot+'"]'):focusEquip!==undefined?el.querySelector('[data-equip="'+focusEquip+'"]'):null;if(restore&&!restore.disabled)restore.focus({preventScroll:true});}
function renderActiveHud(){if(pl2&&pl===pl2)return;const el=$('activeSkillHud');if(!el)return;const visible=S&&S.phase==='play'&&!S.paused&&!S.notice&&!S.dialog&&!S.choosing&&!S.shop&&!S.intro&&!pl.dead;el.hidden=!visible;if(!visible)return;el.classList.toggle('lt-held',!!PAD.skillHeld);const labels=PAD.on?['LT+X','LT+Y','LT+B','LT+A','LT+RB','LT+LS']:[kbName(KB.map.s1),kbName(KB.map.s2),kbName(KB.map.s3),kbName(KB.map.s4),'G','6'];const markup=S.activeSlots.map((k,i)=>{const c=ACTIVE_CFG[k],cd=k?Math.max(0,S[c.cd]||0):0;return `<button type="button" data-active="${i}" class="active-slot${k?'':' empty'}${k&&!canPayActive(k)?' no-mana':''}${cd>0?' cooling':''}" title="${k?SK[k].name+' · '+c.cost+' '+activeResourceName(k):'Wolny slot — wyposaż w pauzie'}" aria-label="${labels[i]}: ${k?SK[k].name:'wolny slot'}" ${k?'':'disabled'}><kbd>${labels[i]}</kbd>${k?`<i data-premium-skill="${k}" class="ic ic-${SK[k].ic}"></i><small class="res-${c.resource}">${c.cost} ${c.resource==='stamina'?'S':'M'}</small>`:'<span>—</span>'}${cd>0?`<b class="slot-cd">${Math.ceil(cd)}</b>`:''}</button>`}).join('');if(el.dataset.markup!==markup){el.innerHTML=markup;el.dataset.markup=markup}}
function renderLoadout(){
 const p2=!!(pl2&&S.loadoutPlayer===2);if(p2)asP2(renderLoadoutOne);else renderLoadoutOne();
 if(!pl2)return;const tabs=document.createElement('div');tabs.className='pcmp-loadout-tabs';
 for(const i of [1,2]){const b=document.createElement('button');b.type='button';b.className='nbp-tab';b.dataset.loadoutPlayer=i;b.setAttribute('aria-pressed',String((S.loadoutPlayer||1)===i));b.textContent=(EN?'Player ':'Gracz ')+i;tabs.append(b)}$('skillLoadout').prepend(tabs)
}
$('skillLoadout').addEventListener('click',e=>{const player=e.target.closest('[data-loadout-player]');if(player){S.loadoutPlayer=+player.dataset.loadoutPlayer;renderLoadout();return}const slot=e.target.closest('[data-slot]'),choice=e.target.closest('[data-equip]'),change=()=>{if(slot){S.loadoutSelected=+slot.dataset.slot;renderLoadout()}else if(choice)equipActive(S.loadoutSelected||0,choice.dataset.equip||null)};if(pl2&&S.loadoutPlayer===2)asP2(change);else change()});
for(const ev of ['pointerdown','mousedown','touchstart'])$('activeSkillHud').addEventListener(ev,e=>e.stopPropagation());
$('activeSkillHud').addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('[data-active]');if(b){e.preventDefault();activateSlot(+b.dataset.active)}});

function swordCanAct(){return !!(S&&S.phase==='play'&&!S.paused&&!S.notice&&!S.dialog&&!S.choosing&&!S.shop&&!S.intro&&!pl.dead&&pl.roll<=0&&!(pl.broken>0)&&!pl.atk&&!pl.block&&!pl.charging)}
function requestSwordShot(k=sk('frostshot')?'frostshot':sk('embershot')?'embershot':null){if(!swordCanAct())return;if(!k)return;if((S.shotCd||0)>0){play('empty',.2);return}if(!canPayMana(k)){manaFlash();return}const d=aimDir()||[pl.fx,pl.fy];pl.fx=d[0];pl.fy=d[1];payMana(k);S.shotCd=ACTIVE_CFG[k].wait(sk(k));S.shotWind={k,L:sk(k),x:d[0],y:d[1],t:.2};pl.atk={kind:'shot',stage:'wind',t:.2};S.actions.shot=(S.actions.shot||0)+1;play('swing',0)}
// Odłamek szronu: duży pocisk, przebija kilka celów i spowalnia. Kula ognia: duża, wolniejsza, wybucha na pierwszym trafionym celu.
function swordShotLaunch(w){const ice=w.k==='frostshot',spd=ice?190:150,range=(ice?120:130)+10*w.L,L=Math.min(3,Math.max(1,w.L));
 S.swordShots.push({x:pl.x+w.x*8,y:pl.y+w.y*8,vx:w.x*spd,vy:w.y*spd,spd,R:ice?SL.shot.iceR:SL.shot.fireHit,t:range/spd,L,ice,fire:!ice,ch:CH,hit:new Set(),n:0,max:ice?SL.shot.targets[L-1]:1});
 const p=S.swordShots[S.swordShots.length-1];{const fl=skFrames(ice?'frostf':'firef');if(fl)addVfx(skLoop(fl,p.t,ice?11:10),p.t,p.x,p.y,.55,ice?1.7:1.9,'bill',-screenAng(w.x,w.y));else addVfx(ice?A.fx.nova:A.fx.inferno,p.t,p.x,p.y,.55,ice?1:1.3,'bill',ice?-screenAng(w.x,w.y):0)}p.visual=S.vfx[S.vfx.length-1];
 swordSparks(pl.x+w.x*10,pl.y+w.y*10,ice?'#9ee9ff':'#ffa44b',ice?8:12)}
function fireballExplode(p,main){const L=p.L,R=SL.shot.fireR[L-1],base=SL.shot.fireDmg[L-1]*(1+.07*(S.lvl-1))*skillMul();
 for(const e of [...S.enemies]){if(e.dead||e.rise>0)continue;const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(e!==main&&d>R+e.r)continue;
  if(damageEnemy(e,base*(e===main?1:SL.shot.splash),dx/(d||1),dy/(d||1),e===main?.4:.7,'sk:embershot')&&e===main&&!e.dead){e.burn=Math.max(e.burn||0,1+.5*L);e.burnD=Math.max(e.burnD||0,2)}}
 if(!skAdd('firei',.75,p.x,p.y,.2,R/13,'bill'))addVfx(A.fx.inferno,.5,p.x,p.y,0,R/14,'bill');for(let i=0;i<26;i++){const an=Math.random()*Math.PI*2,sp=rnd(30,120);S.parts.push({k:'e',x:p.x,y:p.y,z:rnd(4,18),vx:Math.cos(an)*sp,vy:Math.sin(an)*sp*.6,vz:rnd(8,30),c:Math.random()<.5?'#ff6a1a':'#ffb347',life:rnd(.3,.7)})}
 shake(.22,.2);play('fire',0)}
function swordTechniqueHit(e,a){if(e.dead)return;if(a.kind==='h'&&sk('iceblade')>=3&&e.chill>0){e.chill=0;for(const o of S.enemies)if(o!==e&&!o.dead&&Math.hypot(o.x-e.x,o.y-e.y)<28){o.chill=Math.max(o.chill||0,1);o.chillMul=Math.min(o.chillMul||1,BIG.has(o.type)||o.type==='collector'?.9:.8)}swordSparks(e.x,e.y,'#b4efff',10)}
}
function swordOnKill(e){}
// Stone guardian: a walking golem that draws ordinary enemies to itself for up to 10 s. It has its own life,
// every SL.guard.gap s it smashes a random enemy nearby (flat SL.guard.dmg), never heals. Bosses (bottom health bar) follow it for at most SL.guard.bossTaunt seconds per summon.
function summonSwordGuardian(active=false){const L=Math.min(5,sk('stoneguard'));if(!active||!L)return;removeGuardian();let x=pl.x+pl.fx*14,y=pl.y+pl.fy*14;if(boxSolid(x,y,6,4)){x=pl.x;y=pl.y}const mesh=new THREE.Mesh(geo32,A.golem.idle[0].n);mesh.position.set(x/16,0,y/16);mesh.scale.set(1.25,SQ*1.25,1);scene.add(mesh);
  const max=Math.max(1,Math.round(pl.max*SL.guard.hp[L-1]));S.guardSeq=(S.guardSeq||0)+1;S.swordGuardian={golem:true,id:S.guardSeq,x,y,t:SL.guard.dur,hp:max,max,L,R:SL.guard.taunt[L-1],mesh,ch:CH,s:pl.fx<0?-1:1,walk:0,moving:false,inv:0,gone:false,cd:.6,atk:null};skAdd('stone',1.1,x,y,.3,1.5,'bill');swordSparks(x,y,'#d6bf81',12)}
// ---- Dzwonnik / Bellringer (12.11.2026): Echo Żałoby, Zastaw Życia, Ostatni Ton. Liczby wstępne, do strojenia przez autora.
const DZW_MESH=[];
function dzwClear(){for(const m of DZW_MESH)scene.remove(m);DZW_MESH.length=0;if(S){S.echoes=[];S.echoArm=0;S.pledge=0;S.pledgeT=0;S.pledgeHv=0;S.pledgeHvT=0}}
function beginEcho(L){const level=Math.min(3,Math.max(1,L));if(pl.atk||pl.block||pl.broken>0||pl.roll>0){play('empty',.2);return false}payActive('zalecho');S.echoCd=ACTIVE_CFG.zalecho.wait(level);S.actions.skill=(S.actions.skill||0)+1;S.echoArm=level;startAttack('h');if(!pl.atk||pl.atk.kind!=='h')S.echoArm=0;return true}
function dzwEcho(a,base,ang){const L=a.echo,mesh=new THREE.Mesh(geo32,heroIdleMat());mesh.visible=false;scene.add(mesh);DZW_MESH.push(mesh);(S.echoes=S.echoes||[]).push({x:pl.x,y:pl.y,dx:a.dx,dy:a.dy,ang,age:0,done:false,dmg:base*(DZW.echo.mul[L-1]+(S.pk.dEcho||0)),dir:pl.swingDir,s:pl.swingS,mesh});swordSparks(pl.x,pl.y,'#a8d8cf',10);ftInfo(EN?'Echo of Mourning':'Echo Żałoby')}
function echoStrike(E){const P=SL.heavy,R=P.range,arc=P.arc;let hits=0;const oldM=ftMelee,oldH=ftHeavy,oldC=ftCrit;ftMelee=true;ftHeavy=true;ftCrit=false;
  try{for(const e of [...S.enemies]){if(e.dead||e.rise>0)continue;const dx=e.x-E.x,dy=e.y-E.y,d=Math.hypot(dx,dy);if(d>R+e.r||!sightSword(E.x,E.y,e.x,e.y))continue;let df=Math.atan2(dy,dx)-E.ang;while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;if(d>10&&Math.abs(df)>arc)continue;
    if(damageEnemy(e,E.dmg,dx/(d||1),dy/(d||1),1.2,'sk:zalecho')){hits++;if(e.dead)S.dEchoK=(S.dEchoK||0)+1;if(!e.dead){if(BIG.has(e.type)||e.type==='collector')breakPoise(e,30);else slashStagger(e,.6,true)}}}}finally{ftMelee=oldM;ftHeavy=oldH;ftCrit=oldC}
  const c=Math.cos(E.ang),s=Math.sin(E.ang);addVfx(A.fx.slash,.26,E.x+c*R*.55,E.y+s*R*.55,.6,swordVisualSize('h'),'bill',-screenAng(c,s));swordSparks(E.x+c*R*.5,E.y+s*R*.5,'#a8d8cf',hits?14:6);play('bladeHeavy',.05);if(hits)shake(.18,.1)}
function dzwPledgeHit(){let b=0;if(S.pledgeT>0&&S.pledge>0){b=S.pledge;S.pledge=0;S.pledgeT=0}else if(S.pledgeHv>0){b=S.pledgeHv;S.pledgeHv=0;S.pledgeHvT=0}if(b>0){ftInfo(EN?'Pledge released!':'Zastaw uwolniony!');swordSparks(pl.x,pl.y,'#e8c878',12)}return b*DZW.pledge.hv}
function beginPledge(L){const level=Math.min(3,Math.max(1,L));payActive('zastaw');S.pledgeCd=ACTIVE_CFG.zastaw.wait(level)*(S.pk.dPledgeCd||1);S.actions.skill=(S.actions.skill||0)+1;S.pledge=Math.round(pl.max*DZW.pledge.sh[level-1]*(S.pk.dPledge||1));S.pledgeT=DZW.pledge.dur;S.pledgeHv=0;S.pledgeHvT=0;pl.castT=.45;play('bless',0);ftInfo(EN?'Life Pledge':'Zastaw Życia');for(let i=0;i<22;i++){const an=i/22*Math.PI*2;S.parts.push({k:'e',x:pl.x+Math.cos(an)*14,y:pl.y+Math.sin(an)*9,z:rnd(2,20),vx:0,vy:0,vz:rnd(8,18),c:i%2?'#a8d8cf':'#e8c878',life:rnd(.35,.7)})}return true}
function dzwParry(){S.tonN=(S.tonN||0)+1;if(S.tonN<(S.pk.dTonN||DZW.ton.n))return;S.tonN=0;pl.tonT=.5;S.dTon=(S.dTon||0)+1;const T={r:DZW.ton.r*(S.pk.dTonR||1),stun:DZW.ton.stun+(S.pk.dTonStun||0),dmg:DZW.ton.dmg},dm=skDmg(T.dmg);let n=0;for(const e of [...S.enemies]){if(e.dead||e.rise>0)continue;const dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy);if(d>T.r+e.r)continue;n++;damageEnemy(e,dm,dx/(d||1),dy/(d||1),1.1,'sk:ton');if(e.dead)continue;if(BIG.has(e.type)||bossBar(e))breakPoise(e,60);else{S.dTonHit=(S.dTonHit||0)+1;e.stun=Math.max(e.stun||0,T.stun);e.sw=0;e.ghoulWind=0}}
  for(let i=0;i<48;i++){const an=i/48*Math.PI*2;S.parts.push({k:'e',x:pl.x+Math.cos(an)*10,y:pl.y+Math.sin(an)*7,z:rnd(4,10),vx:Math.cos(an)*150,vy:Math.sin(an)*100,vz:rnd(0,4),c:i%3?'#e8c878':'#a8d8cf',life:rnd(.35,.55)})}
  shake(.3,.25);S.flash=Math.max(S.flash||0,.18);play('poiseBreak',0);play('bless',.05);padRumble(.9,.6,260);ftInfo(EN?'Last Toll!':'Ostatni Ton!')}
function dzwTick(dt){for(const k of ['echoCd','pledgeCd'])S[k]=Math.max(0,(S[k]||0)-dt);if(pl.tonT>0)pl.tonT-=dt;if(pl.castT>0)pl.castT-=dt;
  if(S.pledgeT>0){S.pledgeT-=dt;if(S.pledge>0&&Math.random()<dt*14)S.parts.push({k:'i',x:pl.x+rnd(-9,9),y:pl.y+rnd(-5,5),z:rnd(2,22),vx:0,vy:0,vz:rnd(4,10),c:'#a8d8cf',life:.3});if(S.pledgeT<=0){if(S.pledge>0){S.pledgeHv=S.pledge;S.pledgeHvT=DZW.pledge.keep;ftInfo(EN?'Pledge: next heavy blow empowered':'Zastaw: następny silny atak wzmocniony')}S.pledge=0}}
  if(S.pledgeHvT>0){S.pledgeHvT-=dt;if(S.pledgeHvT<=0)S.pledgeHv=0}
  const L=S.echoes;if(L)for(let i=L.length-1;i>=0;i--){const E=L[i];E.age+=dt;if(!E.done&&E.age>=DZW.echo.delay){E.done=true;if(!pl.dead)echoStrike(E);if(S.pk.dEcho2&&!E.second){E.second=true;E.done=false;E.age=DZW.echo.delay-.5;E.dmg*=.5}}if(E.age>=DZW.echo.delay+.4||pl.dead){scene.remove(E.mesh);const j=DZW_MESH.indexOf(E.mesh);if(j>=0)DZW_MESH.splice(j,1);L.splice(i,1)}}}
function dzwDraw(hs){const L=S&&S.echoes;if(!L||!L.length)return;const D=A.heroD&&A.heroD.dzw;for(const E of L){const arr=D&&D.echo?D.echo[E.dir===2?'side':E.dir===0?'down':'up']:null;if(!arr){E.mesh.visible=false;continue}const d=DZW.echo.delay,i=E.done?(E.age-d<.12?2:3):(E.age<d*.6?0:1);setFrame(E.mesh,arr[Math.min(arr.length-1,i)],'se');E.mesh.position.set(E.x/16,0,E.y/16);E.mesh.scale.set((E.dir===2?E.s:1)*(hs?Math.abs(hs):1),SQ,1);E.mesh.visible=true}}
function removeGuardian(){const g=S&&S.swordGuardian;if(!g)return;g.gone=true;scene.remove(g.mesh);S.swordGuardian=null}
function bossBar(e){return BIG.has(e.type)||e.type==='collector'||e.type==='glizzard'||e.type==='boginka'}
function golemTgt(e){return !!(e.tg&&e.tg.golem)}
// only direct blows and projectiles reach the golem; it shrugs off nothing else
function golemHurt(g,dmg){if(!g||g.gone||g.inv>0||!(dmg>0))return false;g.hp-=dmg;g.inv=SL.guard.inv;swordSparks(g.x,g.y,'#d6bf81',5);if(g.hp<=0){g.hp=0;swordSparks(g.x,g.y,'#d6bf81',18);shake(.15,.2);if(g===S.swordGuardian)removeGuardian();else{g.gone=true;scene.remove(g.mesh);if(pl2?.actives?.swordGuardian===g)pl2.actives.swordGuardian=null}}return true}
// a direct enemy blow lands on the target chosen when the attack began
function hitT(e,dmg,nx,ny,att=false){if(golemTgt(e)){golemHurt(e.tg,dmg);return false}return att?hurtFromEnemy(e,dmg,nx,ny):hurtPlayer(dmg,nx,ny,e)}
// area blows (slams, roots, bursts) only ever check the hero's own position
function aoeP(e,R,dmg,cx=e.x,cy=e.y){const dx=pl.x-cx,dy=pl.y-cy,d=Math.hypot(dx,dy)||1;return d<R?hurtPlayer(dmg,dx/d,dy/d,e):false}
function enemyBusy(e){return enemyWinding(e)||e.leap>0||e.mode==='charge'||e.mode==='dive'||e.mode==='down'||e.pull>0||e.boom>0}
// who this enemy is after; kept for the whole wind-up and strike so a ready blow never turns at the last moment
function enemyTarget(e,dt){if(enemyBusy(e)&&e.tg)return e.tg;const g=[S.swordGuardian,pl2?.actives?.swordGuardian].filter(g=>g&&!g.gone&&g.ch===CH&&Math.hypot(g.x-e.x,g.y-e.y)<=g.R+e.r&&sight(e.x,e.y,g.x,g.y)).sort((a,b)=>Math.hypot(a.x-e.x,a.y-e.y)-Math.hypot(b.x-e.x,b.y-e.y))[0];let t=pl;
  if(g&&!g.gone&&g.ch===CH&&e.type!=='wisp'&&Math.hypot(g.x-e.x,g.y-e.y)<=g.R+e.r&&sight(e.x,e.y,g.x,g.y)){
    if(bossBar(e)){if(pl2){const times=e.coopTaunts||(e.coopTaunts={});if(times[g.id]===undefined)times[g.id]=SL.guard.bossTaunt;if(times[g.id]>0){times[g.id]-=dt;t=g}}else{if(e.tauntId!==g.id){e.tauntId=g.id;e.tauntLeft=SL.guard.bossTaunt}if(e.tauntLeft>0){e.tauntLeft-=dt;t=g}}}else t=g}
  e.tg=t;return t}
function keepGolemDistance(e){if(!enemyBody(e))return;for(const g of new Set([S.swordGuardian,pl2?.actives?.swordGuardian])){if(!g||g.gone)continue;const dx=e.x-g.x,dy=e.y-g.y,d=Math.hypot(dx,dy),gap=SL.guard.r+e.r;if(d>=gap||d<.001)continue;moveBox(e,dx/d*(gap-d),dy/d*(gap-d),e.hw||e.r-1,3)}}
function golemTick(dt){const g=S.swordGuardian;if(!g)return;g.t-=dt;g.inv=Math.max(0,g.inv-dt);
  if(g.t<=0||g.hp<=0||g.ch!==CH||pl.dead){removeGuardian();return}
  let tg=null,best=1e9;for(const e of S.enemies){if(e.dead||e.rise>0||e.sleep||bossBar(e)||e.type==='wisp'||Math.hypot(e.x-pl.x,e.y-pl.y)>SL.guard.leash)continue;const dd=Math.hypot(e.x-g.x,e.y-g.y);if(dd<best&&sight(g.x,g.y,e.x,e.y)){best=dd;tg=e}}
  const tx=tg?tg.x:pl.x-pl.fx*14,ty=tg?tg.y:pl.y-pl.fy*14,stop=tg?tg.r+SL.guard.r+2:12,dx=tx-g.x,dy=ty-g.y,d=Math.hypot(dx,dy);g.moving=false;
  if(!g.atk&&d>stop){const st=Math.min(d-stop,SL.guard.spd*dt),ox=g.x,oy=g.y;moveBox(g,dx/d*st,dy/d*st,5,3);g.moving=Math.hypot(g.x-ox,g.y-oy)>st*.3;if(g.moving)g.walk+=dt}
  if(Math.abs(dx)>1)g.s=dx>0?1:-1;
  if(g.atk){g.atk.t+=dt;const e=g.atk.e;if(e&&!e.dead&&Math.abs(e.x-g.x)>1)g.s=e.x>g.x?1:-1;if(!g.atk.hit&&g.atk.t>=GOLEM_HIT){g.atk.hit=true;golemSlam(g)}if(g.atk.t>=GOLEM_ANIM)g.atk=null}
  else{g.cd-=dt;if(g.cd<=0){const c=S.enemies.filter(e=>!e.dead&&e.rise<=0&&!e.sleep&&e.type!=='wisp'&&Math.hypot(e.x-g.x,e.y-g.y)<SL.guard.hitR+e.r&&sight(g.x,g.y,e.x,e.y));if(c.length){for(let a=c.length-1;a>0;a--){const b=(Math.random()*(a+1))|0;[c[a],c[b]]=[c[b],c[a]]}const es=c.slice(0,SL.guard.hits[Math.min(5,g.L)-1]||2);g.atk={t:0,hit:false,e:es[0],es};g.cd=SL.guard.gap}else g.cd=.25}}
  const AT=A.golem.atk,gs=1.25;g.mesh.position.set(g.x/16,0,g.y/16);g.mesh.scale.set(g.s*gs,SQ*gs,1);setFrame(g.mesh,g.atk&&AT?AT[Math.min(AT.length-1,(g.atk.t/GOLEM_ANIM*AT.length)|0)]:g.moving?at(A.golem.walk,g.walk,9):at(A.golem.idle,clock,2))}
const GOLEM_ANIM=1,GOLEM_HIT=.5;
function golemSlam(g){const es=g.atk&&(g.atk.es||[g.atk.e]);if(!es)return;let n=0;
  for(const e of es){if(!e||e.dead)continue;n++;const dx=e.x-g.x,dy=e.y-g.y,d=Math.hypot(dx,dy)||1;
    if(damageEnemy(e,SL.guard.dmg[Math.min(5,g.L)-1],dx/d,dy/d,.6,'sk:stoneguard')&&!e.dead){if(BIG.has(e.type)||e.type==='collector')breakPoise(e,6);else slashStagger(e,.35)}
    const v=skAdd('earth',.6,e.x,e.y,.04,2.4,'ground',0);if(v)v.sy=1/Math.sin(PITCH);swordSparks(e.x,e.y,'#d6bf81',10)}
  if(n){shake(.12,.15);play('golem',0)}}
function clearSwordTransient(){clearCombatEffects();clearWhirlVisuals();if(!S)return;dzwClear();if(typeof milClear==='function')milClear();if(pl?.atk?.kind==='whirl')endWhirl();if(pl?.atk?.kind==='leap')endLeap();for(const k of ['rend','fan','hook'])if(pl?.atk?.kind===k)endSk(k);S.zDance=0;S.activeWind=null;if(pl?.atk?.kind==='skill')pl.atk=null;if(pl?.atk?.kind==='shot')pl.atk=null;S.swordTrails=[];removeGuardian();for(const p of S.swordShots||[])if(p.visual)p.visual.t=p.visual.dur;S.swordShots=[];S.shotWind=null;S.shadowReady=0}
function swordTick(dt,p2=false){if(!p2)navUpdate(dt);activeSlotsTick(dt);for(let i=S.swordTrails.length-1;i>=0;i--){const z=S.swordTrails[i];z.t-=dt;if(z.t<=0){S.swordTrails.splice(i,1);continue}if(Math.random()<dt*16)swordSparks(z.x,z.y,'#ff8a38',1);for(const e of S.enemies)if(!e.dead&&!z.hit.has(e)&&Math.hypot(e.x-z.x,e.y-z.y)<12+e.r){z.hit.add(e);e.burn=Math.max(e.burn||0,1);e.burnD=Math.max(e.burnD||0,2)}}for(const k of ['shotCd','guardCd','whirlCd','leapCd','rendCd','fanCd','ldCd','hookCd','shadowReady'])S[k]=Math.max(0,(S[k]||0)-dt);
 if(S.shotWind){if(pl.dead||pl.roll>0||pl.broken>0){S.shotWind=null;if(pl.atk?.kind==='shot')pl.atk=null}else{S.shotWind.t-=dt;if(S.shotWind.t<=0){swordShotLaunch(S.shotWind);S.shotWind=null;pl.atk={kind:'shot',stage:'rec',t:.18}}}}
 golemTick(dt);
 for(let i=S.swordShots.length-1;i>=0;i--){const p=S.swordShots[i];p.t-=dt;let gone=p.t<=0||p.ch!==CH,boom=null;const steps=Math.max(1,Math.ceil(p.spd*dt/3));for(let s=0;s<steps&&!gone;s++){p.x+=p.vx*dt/steps;p.y+=p.vy*dt/steps;if(boxSolid(p.x,p.y,2,2)){gone=true;break}const ux=p.vx/p.spd,uy=p.vy/p.spd,touch=S.enemies.filter(e=>!e.dead&&!(e.rise>0)&&!p.hit.has(e)&&Math.hypot(e.x-p.x,e.y-p.y)<=e.r+p.R).sort((a,b)=>((a.x-p.x)*ux+(a.y-p.y)*uy)-((b.x-p.x)*ux+(b.y-p.y)*uy));
   if(p.fire){if(touch.length){boom=touch[0];gone=true;break}continue}
   for(const e of touch){p.hit.add(e);const ok=damageEnemy(e,(SL.shot.iceDmg+SL.shot.perL*p.L)*(1+.07*(S.lvl-1))*skillMul(),ux,uy,0,'sk:frostshot');if(!ok)continue;p.n++;if(!e.dead){e.chill=Math.max(e.chill||0,1.5);e.chillMul=Math.min(e.chillMul||1,BIG.has(e.type)||e.type==='collector'||e.type==='glizzard'?.9:1-(.25+.05*p.L))}swordSparks(p.x,p.y,'#a2e9ff',8);if(p.n>=p.max){gone=true;break}}}
  if(p.visual){p.visual.x=p.x;p.visual.y=p.y;if(gone)p.visual.t=p.visual.dur}
  if(gone&&p.ice&&p.ch===CH)skAdd('frosti',.5,p.x,p.y,.5,1.5,'bill');
  if(gone&&p.fire&&p.ch===CH)fireballExplode(p,boom);
  if(!gone)swordSparks(p.x,p.y,p.ice?'#a2e9ff':'#ff9a43',p.ice?3:4);else S.swordShots.splice(i,1)}
}
let swordGlow=null;

let bladeVisualKey='';
function updateBladeTexture(k){const secondary=ENCH.find(x=>sk(x)&&x!==k)||'',key=k+':'+secondary;if(key===bladeVisualKey)return;bladeVisualKey=key;const c=canvas(64,192),g=c.getContext('2d'),col=x=>({venom:'#a6ff52',fireblade:'#ff7a1e',iceblade:'#7fd8ff',bloodblade:'#d8101c'})[x]||ENC[x].col,main=col(k);const grad=g.createLinearGradient(8,0,56,0);grad.addColorStop(0,'transparent');grad.addColorStop(.3,main+'50');grad.addColorStop(.5,main);grad.addColorStop(.7,main+'70');grad.addColorStop(1,'transparent');g.fillStyle=grad;g.beginPath();g.moveTo(32,5);g.lineTo(48,154);g.lineTo(32,184);g.lineTo(16,154);g.closePath();g.fill();g.fillStyle=main;g.strokeStyle=main;g.lineWidth=2;for(let i=0;i<7;i++){const y=30+i*20,side=i%2?1:-1,x=32+side*(4+i);g.beginPath();if(k==='iceblade'){g.moveTo(x,y);g.lineTo(x+side*10,y-10);g.lineTo(x+side*6,y+8);g.closePath();g.fill()}else if(k==='fireblade'){g.moveTo(x,y+9);g.quadraticCurveTo(x+side*17,y-3,x+side*7,y-14);g.quadraticCurveTo(x+side*3,y,x,y+9);g.fill()}else if(k==='bloodblade'){g.ellipse(x+side*3,y,2,5,-side*.4,0,Math.PI*2);g.fill()}else{g.arc(x+side*5,y,3+i%2,0,Math.PI*2);g.stroke()}}if(secondary){g.strokeStyle=col(secondary);g.lineWidth=3;g.beginPath();g.moveTo(30,28);g.lineTo(30,164);g.stroke()}const tex=new THREE.CanvasTexture(c);if(swordGlow.material.map)swordGlow.material.map.dispose();swordGlow.material.map=tex;swordGlow.material.needsUpdate=true}
function syncSwordGlow(){if(!swordGlow){const c=canvas(32,128),g=c.getContext('2d'),a=g.createLinearGradient(0,0,32,0);a.addColorStop(0,'transparent');a.addColorStop(.42,'#ffffffaa');a.addColorStop(.5,'#fff');a.addColorStop(.58,'#ffffff55');a.addColorStop(1,'transparent');g.fillStyle=a;g.beginPath();g.moveTo(16,2);g.lineTo(28,100);g.lineTo(16,125);g.lineTo(4,100);g.closePath();g.fill();const t=new THREE.CanvasTexture(c);swordGlow=new THREE.Mesh(new THREE.PlaneGeometry(.3,1.05),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending,toneMapped:false}));swordGlow.renderOrder=5;scene.add(swordGlow)}const k=S?encLevel()[0]:null;const on=!!(k&&S.phase==='play'&&!pl.dead&&pl.roll<=0);swordGlow.visible=false;if(on&&!(S.paused||S.notice||S.choosing||S.dialog||S.shop)&&Math.random()<.14)swordSparks(pl.x+pl.fx*7,pl.y+pl.fy*5,ENC[k].col,1);return;const a=pl.atk,ang=a?.kind==='whirl'?a.angle:a&&a.kind!=='shot'?Math.atan2(pl.fy,pl.fx)+(a.stage==='wind'?-.65:a.stage==='act'?.5:.85):(Math.abs(pl.fx)>.5?(pl.fx>0?.7:Math.PI-.7):pl.fy>0?.9:-.9);swordGlow.position.set((pl.x+(a?Math.cos(ang)*9:pl.fx*6))/16,.65,(pl.y+(a?Math.sin(ang)*8:pl.fy*8+2))/16);swordGlow.quaternion.copy(cam.quaternion);swordGlow.rotateZ(-screenAng(Math.cos(ang),Math.sin(ang))-Math.PI/2);updateBladeTexture(k);swordGlow.material.color.setHex(0xffffff);swordGlow.material.opacity=(SETT.flash?.95:.5)*(.82+.18*Math.sin(clock*7));swordGlow.scale.set(a?1.7:.95,a?1.3:1,1);if(!(S.paused||S.notice||S.choosing||S.dialog||S.shop)&&Math.random()<.14)swordSparks(swordGlow.position.x*16,swordGlow.position.z*16,ENC[k].col,1)}

function applyEnchants(e,a,crit){if(e.dead)return;const [k,L]=encLevel();if(!k)return;const big=BIG.has(e.type)||e.type==='collector'||e.type==='glizzard',c=ENC[k];
  if(!crit&&Math.random()>=encChance(L)*(a.kind==='h'?1.5:1))return;
  // the status itself
  if(!(e.pois>0||e.burn>0||e.chill>0||e.bleed>0))ftx(c.name,e.x,e.y,ftEntH(e)+.5,'i');
  if(k==='venom'){e.pois=4;e.poisD=2+L}else if(k==='fireblade'){e.burn=3;e.burnD=3+1.5*L}else if(k==='iceblade'){e.chill=2.5;e.chillMul=Math.max(.3,.6-.03*L)}else{e.bleed=3;e.bleedDmg=2+L}
  {const v=skAdd(k==='venom'?'poison':k==='fireblade'?'burn':k==='iceblade'?'freeze':'bleed',.5,e.x,e.y,.3,.85,'bill');if(COMBAT_POLISH_ON)bindWeaponFx(v,e)}
  for(let i=0;i<8;i++)S.parts.push({k:'e',x:e.x+rnd(-5,5),y:e.y+rnd(-3,3),z:rnd(6,18),vx:rnd(-14,14),vy:0,vz:rnd(8,22),c:Math.random()<.6?c.col:c.col2,life:rnd(.3,.6)});
  if(a.statusOnly)return; // Whirl applies the status only: no elemental execution, healing or boss stun.
  e.marks=(e.marks||0)+1;if(e.marks<encMarks(e))return;e.marks=0;
  // finisher
  ftx(c.name+'!',e.x,e.y,ftEntH(e)+.55,'i')
  for(let i=0;i<30;i++){const an=Math.random()*Math.PI*2,sp=rnd(30,110);S.parts.push({k:'e',x:e.x,y:e.y,z:rnd(4,20),vx:Math.cos(an)*sp,vy:Math.sin(an)*sp*.6,vz:rnd(10,40),c:Math.random()<.5?c.col:c.col2,life:rnd(.4,.9)})}
  shake(.15,.2);play(k==='iceblade'?'frost':k==='fireblade'?'fire':k==='venom'?'heal':'katana',0);
  const near=r=>S.enemies.filter(o=>o!==e&&!o.dead&&o.rise<=0&&Math.hypot(o.x-e.x,o.y-e.y)<r);
  if(k==='fireblade'){addVfx(A.fx.inferno,.5,e.x,e.y,0,2.4,'bill');for(const o of near(36))damageEnemy(o,15+5*L,(o.x-e.x)/36,(o.y-e.y)/36,1)}
  if(k==='venom')for(const o of near(32)){o.marks=(o.marks||0)+1;o.pois=4;o.poisD=2+L}
  if(k==='iceblade'){addVfx(A.fx.nova,.4,e.x,e.y,.06,2.6,'ground');for(const o of near(36)){o.chill=3;o.chillMul=.4}}
  if(k==='bloodblade'){const h=heal(4+L);if(h>0)S.parts.push({k:'i',x:pl.x,y:pl.y,z:12,vx:0,vy:0,vz:20,c:'#c4202a',life:.6});pool(e.x,e.y,18,7)}
  if(big){damageEnemy(e,e.max*(.05+.01*L),0,1,0);if(k==='iceblade')e.stun=Math.max(e.stun||0,.8)}
  else{e.xp=Math.max(e.xp,1);e.hp=0;killEnemy(e,0,1)}}
// Force Push (a sign): a cone of force that throws enemies back, stuns them and knocks projectiles out of the air
function castAard(prepaid=false){const L=S.sk.aard||0;if(!L||pl.dead||pl.roll>0||pl.broken>0||(pl.atk&&pl.atk.stage!=='rec'))return;
  if(!prepaid&&S.aardCd>0){play('empty',.2);return}if(!prepaid&&!canPayMana('aard')){manaFlash(.45);return}
  if(!prepaid)payMana('aard');pl.atk=null;pl.block=false;S.aardCd=0;
  const a=aimDir()||autoAim()||[pl.fx,pl.fy];pl.fx=a[0];pl.fy=a[1];const ang=Math.atan2(a[1],a[0]),R=56+8*L,full=L>=5,stun=1+.2*L,dmg=8+8*L;
  for(const e of S.enemies){if(e.dead||e.rise>0)continue;const dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy)||1;if(d>R+e.r)continue;let df=Math.atan2(dy,dx)-ang;while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;if(!full&&Math.abs(df)>.95)continue;
    const big=BIG.has(e.type)||e.type==='collector';if(!damageEnemy(e,dmg*(1+.07*(S.lvl-1))*skillMul(),dx/d,dy/d,0,'sk:aard')||e.dead)continue;
    if(big){breakPoise(e,60+15*L)}else{e.vx+=dx/d*(220+20*L);e.vy+=dy/d*(220+20*L);e.stun=Math.max(e.stun||0,stun);e.sw=0;e.ghoulWind=0;e.leap=0}}
  for(let i=S.eproj.length-1;i>=0;i--){const f=S.eproj[i],dx=f.x-pl.x,dy=f.y-pl.y,d=Math.hypot(dx,dy);if(d>R+20)continue;if(f.mesh)scene.remove(f.mesh);if(f.vfe)f.vfe.t=f.vfe.dur;S.eproj.splice(i,1)}
  for(let i=0;i<60;i++){const an=full?Math.random()*Math.PI*2:ang+rnd(-.95,.95),sp=rnd(80,240);S.parts.push({k:'i',x:pl.x+Math.cos(an)*6,y:pl.y+Math.sin(an)*4,z:rnd(4,16),vx:Math.cos(an)*sp,vy:Math.sin(an)*sp*.6,vz:rnd(0,10),c:Math.random()<.5?'#d8f0ff':'#9fb4d0',life:rnd(.25,.45)})}
  if(!skAdd('knock',.6,pl.x+(full?0:Math.cos(ang)*R*.4),pl.y+(full?0:Math.sin(ang)*R*.4),.3,R/14.6*(full?1.15:.85),'bill'))addVfx(A.fx.nova,.3,pl.x+Math.cos(ang)*R*.35,pl.y+Math.sin(ang)*R*.35,.06,R/16*(full?1.2:.8),'ground');shake(.2,.2);play('quake',0);play('frost',.1);
  pl.swingT=pl.swingDur=.25;if(Math.abs(a[0])>Math.abs(a[1])){pl.swingDir=2;pl.swingS=a[0]>0?1:-1}else{pl.swingDir=a[1]>0?0:1;pl.swingS=1}}
// enemy side: wind up, strike, then stand open for a moment
function slashEnemy(e,dx,dy,d,dt){
  if(e.sw>0){e.sw-=dt;if(e.sw<=0){e.recov=SL.enemyRec*(e.type==='bat'?.5:1);e.atkA=.3;const red=!!e.red,avoid=(!golemTgt(e)&&pl.inv>0)||d>=e.r+17;e.red=false;
    if(d<e.r+17&&!pl.dead){S.attacker=e;S.redHit=red;hitT(e,enemyDamage(e.dmg*SL.enemyHit,SL.dmgDiv),dx/d,dy/d);S.attacker=null;S.redHit=false}
    if(red&&avoid&&!pl.dead){e.stun=Math.max(e.stun||0,.9);e.recov=0;e.sw=0;ftx((EN?'Exposed':'Odsłonięty'),e.x,e.y,ftEntH(e)+.5,'i')}}return true}
  if(e.recov>0){e.recov-=dt;return true}
  if(e.acd===undefined)e.acd=rnd(.2,.9);
  if(d<e.r+12&&e.acd<=0){// white strike can be blocked and parried; red strike (heavy enemies, elite, after 2 min) only dodged
    const heavy=!BIG.has(e.type)&&ET[e.type]&&ET[e.type].hp>=90;e.hc=(e.hc||0)+1;e.red=S.t>120&&(e.mini?e.hc%2===0:heavy&&e.hc%3===0);
    e.sw=SL.enemyWind*(e.type==='bat'?.6:1)+(e.red?.22:0);e.acd=rnd(1.3,2.2);S.parts.push({k:'e',x:e.x,y:e.y,z:26,vx:0,vy:0,vz:4,c:e.red?warningColor():'#f2ecd8',life:.35});
    if(e.red)play('warnR',0);return true}
  return false}

// ---- Milena / Candlebound (12.11.2026): Żywy Knot, Odlew Skazańca, Dogasanie. Liczby wstępne, do strojenia przez autora.
function milClear(){if(!S)return;if(S.effigy&&S.effigy.f)S.effigy.f.t=S.effigy.f.dur;S.effigy=null;S.gut=null;S.wick=0;S.milStrips=[];if(pl){pl.milEffT=0;if(pl.atk?.kind==='gut')pl.atk=null}}
function milWaxSlow(e,t,mul,bossMul,bossT){const big=BIG.has(e.type)||e.type==='collector'||e.type==='glizzard',q=(S.pk&&S.pk.mWaxT)||1;if(!e.mSl){e.mSl=1;S.mSlowN=(S.mSlowN||0)+1}e.chill=Math.max(e.chill||0,big?(bossT||t*.5)*q:t*q);e.chillMul=Math.max(.3,Math.min(e.chillMul||1,big?bossMul:mul))}
function milParry(){const e=S.attacker;if(e){if(e.milPar!==undefined&&S.t-e.milPar<MIL.wick.gap)return;e.milPar=S.t}
  if((S.wick||0)>=MIL.wick.max){ftInfo(EN?'Living Wick: full':'Żywy Knot: pełny');return}
  S.wick=Math.min(MIL.wick.max,(S.wick||0)+(S.pk.mKnot||1));ftInfo((EN?'Living Wick ':'Żywy Knot ')+S.wick+'/'+MIL.wick.max);for(let i=0;i<8;i++)S.parts.push({k:'e',x:pl.x+rnd(-6,6),y:pl.y+rnd(-3,3),z:rnd(14,28),vx:0,vy:0,vz:rnd(8,16),c:i%2?'#ffb347':'#ffe9a0',life:.4})}
function milStrip(n,ang){if(n>=MIL.wick.max)S.mFull=(S.mFull||0)+1;const M=MIL.strip,c=Math.cos(ang),s=Math.sin(ang),len=M.len+M.lenN*n,dur=M.dur+M.durN*n,z={x:pl.x,y:pl.y,c,s,len,w:M.w+M.wN*n,t:dur,tk:0,n,ch:CH};
  const fr=fxFrames('mil_fx',3);if(fr){addVfx(skLoop(fr,dur,10),dur,pl.x+c*len*.5,pl.y+s*len*.5,.06,len/29,'ground',-Math.atan2(s,c));z.f=S.vfx[S.vfx.length-1];z.f.sy=1.25}
  (S.milStrips=S.milStrips||[]).push(z);ftInfo(EN?`Wax strip ×${n}`:`Pas wosku ×${n}`);swordSparks(pl.x+c*len*.5,pl.y+s*len*.5,'#ffb347',10)}
function milStripTick(dt){const L=S.milStrips;if(!L)return;for(let i=L.length-1;i>=0;i--){const z=L[i];z.t-=dt;z.tk-=dt;if(z.t<=0||pl.dead||z.ch!==CH){if(z.f)z.f.t=z.f.dur;L.splice(i,1);continue}
  if(z.tk<=0){z.tk=MIL.strip.tick;const dm=skDmg((MIL.strip.dmg+MIL.strip.dmgN*z.n)*(z.n>=MIL.wick.max?(S.pk.mFive||1):1));for(const e of [...S.enemies]){if(e.dead||e.rise>0)continue;const dx=e.x-z.x,dy=e.y-z.y,t=dx*z.c+dy*z.s,p=-dx*z.s+dy*z.c;if(t<-e.r||t>z.len+e.r||Math.abs(p)>z.w+e.r)continue;damageEnemy(e,dm,z.c,z.s,0,'sk:knot');if(e.dead)S.mWaxK=(S.mWaxK||0)+1;else milWaxSlow(e,MIL.strip.slowT,MIL.strip.slow,MIL.strip.bossSlow,.6)}}}}
function beginEffigy(L){const lv=Math.min(3,Math.max(1,L));if(pl.atk||pl.block||pl.broken>0||pl.roll>0){play('empty',.2);return false}
  payActive('odlew');S.effCd=ACTIVE_CFG.odlew.wait(lv)*(S.pk.mEffCd||1);S.actions.skill=(S.actions.skill||0)+1;if(S.effigy&&S.effigy.f)S.effigy.f.t=S.effigy.f.dur;
  const d=aimDir()||[pl.fx,pl.fy],life=MIL.effigy.life[lv-1],fr=fxFrames('mil_fx',0);let f=null;
  if(fr){const a=[fr[0],fr[1],fr[2],fr[3]];for(let i=0;i<Math.round(life*10)-4;i++)a.push(fr[3]);addVfx(a,life,pl.x,pl.y,.5,1.7,'bill');f=S.vfx[S.vfx.length-1]}
  S.effigy={x:pl.x,y:pl.y,t:life,L:lv,f,ch:CH};pl.fx=d[0];pl.fy=d[1];pl.s=d[0]>=0?1:-1;pl.roll=.3;pl.rollT=0;pl.rvx=d[0]*190;pl.rvy=d[1]*190;pl.inv=Math.max(pl.inv,.3);pl.rollCd=.28;pl.swingT=0;pl.milEffT=.3;play('roll',0);ftInfo(EN?'Condemned Effigy':'Odlew Skazańca');swordSparks(pl.x,pl.y,'#ffb347',12);return true}
function effigyBurst(E){S.mEffB=(S.mEffB||0)+1;const lv=E.L,R=MIL.effigy.r[lv-1],dm=skDmg(MIL.effigy.dmg);let n=0;for(const e of [...S.enemies]){if(e.dead||e.rise>0)continue;const dx=e.x-E.x,dy=e.y-E.y,d=Math.hypot(dx,dy);if(d>R+e.r)continue;n++;damageEnemy(e,dm,dx/(d||1),dy/(d||1),.5,'sk:odlew');if(!e.dead)milWaxSlow(e,MIL.effigy.slowT[lv-1],MIL.effigy.slow,.9,MIL.effigy.bossSlowT)}
  zfx('mil_fx',1,.4,E.x,E.y,.4,R/16*1.2,'bill');for(let i=0;i<24;i++){const an=i/24*Math.PI*2;S.parts.push({k:'e',x:E.x+Math.cos(an)*8,y:E.y+Math.sin(an)*5,z:rnd(4,14),vx:Math.cos(an)*90,vy:Math.sin(an)*60,vz:rnd(0,6),c:i%2?'#ffb347':'#e8d6a8',life:rnd(.3,.5)})}
  shake(.12,.1);play('hitSteel',0);if(E.f)E.f.t=E.f.dur;S.effigy=null;if(n)ftInfo(EN?'Effigy shattered':'Odlew rozpadł się')}
function beginGut(L){const lv=Math.min(3,Math.max(1,L));if(pl.atk||pl.block||pl.broken>0||pl.roll>0){play('empty',.2);return false}
  payActive('dogasanie');S.gutCd=ACTIVE_CFG.dogasanie.wait(lv);S.actions.skill=(S.actions.skill||0)+1;const d=aimDir()||[pl.fx,pl.fy];pl.fx=d[0];pl.fy=d[1];
  S.gut={L:lv,n:0,t:0,hp:pl.hp};pl.atk={kind:'gut',stage:'hold',t:MIL.gut.hold,L:lv};pl.atkHeld=false;pl.charging=false;pl.queue=false;pl.swingT=0;play('bless',0);ftInfo(EN?'Guttering':'Dogasanie');return true}
function gutTick(dt){const g=S.gut,a=pl.atk;if(!g||!a||a.kind!=='gut'){if(a&&a.kind==='gut')pl.atk=null;return}
  if(pl.hp<g.hp-.01){ftInfo(EN?'Guttering interrupted':'Dogasanie przerwane');S.gut=null;pl.atk=null;return}g.hp=pl.hp;g.t-=dt;a.t-=dt;
  if(g.t<=0&&g.n<MIL.gut.waves){const R=(MIL.gut.r0+MIL.gut.dr*g.n)*(S.pk.mGutR||1),dm=skDmg(MIL.gut.dmg[g.L-1]),hit=new Set();g.n++;g.t=MIL.gut.gap;if(g.n===MIL.gut.waves)S.mFifth=(S.mFifth||0)+1;
    for(const e of [...S.enemies]){if(e.dead||e.rise>0||hit.has(e))continue;const dx=e.x-pl.x,dy=e.y-pl.y,d=Math.hypot(dx,dy);if(d>R+e.r)continue;hit.add(e);damageEnemy(e,dm,dx/(d||1),dy/(d||1),.4,'sk:dogasanie');if(!e.dead)milWaxSlow(e,MIL.gut.slowT,MIL.gut.slow,MIL.gut.bossSlow,.6)}
    if(hit.size>=5)S.mMourn=1;zfx('mil_fx',2,.3,pl.x,pl.y,.1,R/16*1.1,'ground',0);for(let i=0;i<10;i++){const an=Math.random()*Math.PI*2;S.parts.push({k:'e',x:pl.x+Math.cos(an)*R,y:pl.y+Math.sin(an)*R*.7,z:rnd(2,10),vx:0,vy:0,vz:rnd(6,14),c:'#ffb347',life:.3})}shake(.08,.08);play('hitSteel',0)}
  if(g.n>=MIL.gut.waves&&g.t<=-.15||a.t<=-.4){S.gut=null;pl.atk=null}}
function milTick(dt){for(const k of ['effCd','gutCd'])S[k]=Math.max(0,(S[k]||0)-dt);if(pl.milEffT>0)pl.milEffT-=dt;milStripTick(dt);
  const E=S.effigy;if(E){E.t-=dt;if(E.ch!==CH||pl.dead){milClear();return}if(E.t<=0){if(E.f)E.f.t=E.f.dur;S.effigy=null}else for(const e of S.enemies){if(e.dead||e.rise>0)continue;if(Math.hypot(e.x-E.x,e.y-E.y)<=e.r+MIL.effigy.touch){effigyBurst(E);break}}}}
