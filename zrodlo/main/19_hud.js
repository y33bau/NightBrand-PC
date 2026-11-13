/* ============ HUD & FLOW ============ */
let lastHud='',chipsDirty=true;
// style writes only when the value changes (hud runs every frame)
function setW(el,v){if(el._w!==v){el._w=v;el.style.width=v}}
let lastBuffs=null;
function hud(){renderActiveHud();if(!S)return;drawMini(1/60);const left=S.endless?S.t:Math.max(0,(S.stage==='p1'?BREAK_AT:NIGHT)-S.t),m=Math.floor(left/60),s=Math.floor(left%60);
  let bBig=null,bCol=null,bAny=null;for(const e of S.enemies){if(e.rise>0)continue;const big=BIG.has(e.type);if(!(big||e.type==='glizzard'||e.type==='collector'||e.type==='boginka'))continue;if(!bAny)bAny=e;if(big&&!bBig)bBig=e;if(e.type==='collector'&&!bCol)bCol=e}
  const boss=bBig||bCol||bAny;
  const key=`${pl.hp|0}|${pl.max}|${S.xp}|${S.need}|${S.lvl}|${m}:${s}|${S.kills}|${S.coins}|${boss?boss.hp|0:-1}|${S.stage}|${boss&&boss.stolen||0}|${S.merchant?S.merchant.wait|0:0}|${S.dg?(S.dg.done?2:1):0}`;
  if(key!==lastHud){lastHud=key;$('hp').style.width=$('hpg').style.width=(Math.max(0,pl.hp)/pl.max*100)+'%';$('hpbar').classList.toggle('low',pl.hp<pl.max*.3);$('hpbar').classList.toggle('q4',!!SETT.flash&&pl.hp>0&&pl.hp<=pl.max*.25);$('xp').style.width=Math.min(100,S.xp/S.need*100)+'%';$('lvlTag').innerHTML=(EN?`<i class="ic ic-wisp"></i>Level ${S.lvl}`:`<i class="ic ic-wisp"></i>Poziom ${S.lvl}`);
    const mmss=`${m}:${String(s).padStart(2,'0')}`,tic=S.stage==='p1'||S.stage==='break'?'hourglass':S.stage==='p2'?'sun':'bossskull';$('time').innerHTML=`<i class="ic ic-${S.dg?'bossskull':tic}"></i>`+(S.dg?(S.dg.done?(EN?'Crypt cleansed':'Krypta oczyszczona'):(EN?'Crypt beneath the cemetery':'Krypta pod cmentarzem')):S.endless&&(S.stage==='p1'||S.stage==='p2')?(EN?`Endless night ${mmss}`:`Noc bez końca ${mmss}`):S.stage==='p1'?(EN?`Until midnight ${mmss}`:`Do północy ${mmss}`):S.stage==='break'?(EN?`Break · Marga's stall${S.merchant&&S.merchant.state==='here'?' '+Math.ceil(S.merchant.wait)+' s':''}`:`Przerwa · kram Margi${S.merchant&&S.merchant.state==='here'?' '+Math.ceil(S.merchant.wait)+' s':''}`):S.stage==='collector'?(CH===4&&A.leszy?(EN?'Leshy, Lord of the Wilds!':'Leszy, Pan Kniei!'):CH===5?(EN?'Arch-Judge Reckoner!':'Arcysędzia Rachmistrz!'):(EN?'Order Collector!':'Poborca Zakonu!')):S.stage==='final'?(CH===3?(EN?'Defeat Morhad':'Pokonaj Morhada'):CH===4&&A.strzyga?(EN?'Defeat the Striga':'Pokonaj Strzygę'):CH===5?(EN?'Defeat the Creditor':'Pokonaj Wierzyciela'):CH===2&&A.cumlin?(EN?'Defeat Cumlin':'Pokonaj Cumlina'):(EN?'Defeat the Conjoined':'Pokonaj Zrosta')):`${CH===2?'Do otwarcia wrót':'Do świtu'} ${mmss}`);$('kills').innerHTML=(EN?`<i class="ic ic-skull"></i>Kills: ${S.kills}`:`<i class="ic ic-skull"></i>Zabici: ${S.kills}`);$('coins').textContent=S.coins;
    $('boss').hidden=!boss;if(boss){$('bossName').innerHTML='<i class="ic ic-bossskull"></i>'+(boss.type==='glizzard'?(EN?'Glizard, The Glizzy G-Lord':'Glizzard, Wielki Paruwiak'):boss.type==='collector'?(EN?`${CH===5?'Arch-Judge Reckoner':'Order Collector'} · stole ${boss.stolen} coins`:`${CH===5?'Arcysędzia Rachmistrz':'Poborca Zakonu'} · zabrał ${boss.stolen} monet`):boss.type==='beast'?(EN?'Morhad, Beast of a Thousand Slaughters':'Morhad, Bestia Tysiąca Rzezi'):boss.type==='leszy'?(EN?'Leshy, Lord of the Wilds':'Leszy, Pan Kniei'):boss.type==='strzyga'?(boss.phase===2?(EN?'Mother Striga · The Second Soul':'Strzyga Matka · druga dusza'):(EN?'Mother Striga, Queen of the Barrows':'Strzyga Matka, Królowa Kurhanów')):boss.type==='cumlin'?(EN?'Cumlin, the Possessed Dwarf King':'Cumlin, Opętany Król Krasnoludów'):boss.type==='boginka'?(EN?'The Lady of the Forest':'Pani Lasu'):CH===5?(EN?'The Creditor':'Wierzyciel'):(EN?'The Conjoined':'Zrost'));$('bossHp').style.width=Math.max(0,boss.hp/boss.max*100)+'%';$('bossPoise').style.width=Math.min(100,(boss.poise||0)/140*100)+'%';$('bossPoiseB').classList.toggle('brk',boss.stun>.3)}}
  const st=$('stam'),nseg=1;if(st.childElementCount!==nseg){st.innerHTML=('<div class="seg fb st"><span class="trk"><i></i></span><b class=\"l\"></b><b class=\"m\"></b><b class=\"r\"></b></div>').repeat(nseg)}
  setW(st,Math.min(100,pl.staMax/1.8)+'%');
  for(let i=0;i<nseg;i++){const seg=st.children[i],v=Math.max(0,pl.sta/pl.staMax);setW(seg.firstChild.firstChild,(v*100)+'%');seg.classList.toggle('full',v>=1);seg.classList.toggle('q4',!!SETT.flash&&v<=.25)}
  st.classList.toggle('flash',(S.stamFlash||0)>0);
  {const mn=$('mana');if(mn){if(!mn.childElementCount)mn.innerHTML='<div class="seg fb st mn"><span class="trk"><i></i></span><b class="l"></b><b class="m"></b><b class="r"></b></div>';const mm=pl.manaMax||SL.mana.max,v=Math.max(0,Math.min(1,(pl.mana||0)/mm)),sg=mn.firstChild;setW(mn,Math.min(100,mm/1.8)+'%');setW(sg.firstChild.firstChild,(v*100)+'%');sg.classList.toggle('full',v>=1);sg.classList.toggle('q4',!!SETT.flash&&v<=.25);mn.classList.toggle('flash',(S.manaFlash||0)>0)}}
  {const mm=t=>`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`,b=[];
    if(S.rebirth)b.push('<span class="tr">'+(S.rebirthUsed?(EN?'Revival used · character XP −50%':'Odrodzenie zużyte · EXP postaci −50%'):(EN?'Revival ready':'Odrodzenie gotowe'))+'</span>');if(S.trial)b.push((EN?`<span class="tr">Mila's trial: ${S.trial.k}/20 · ${Math.ceil(S.trial.t)} s</span>`:`<span class="tr">Próba Mili: ${S.trial.k}/20 · ${Math.ceil(S.trial.t)} s</span>`));
    if(S.bless)b.push((EN?`Blessing +${S.bless.amt} health · ${mm(S.bless.t)}`:`Błogosławieństwo +${S.bless.amt} życia · ${mm(S.bless.t)}`));
    if(S.mil){const w=S.wick||0;b.push((EN?'Living Wick ':'Żywy Knot ')+'●'.repeat(w)+'○'.repeat(MIL.wick.max-w)+' '+w+'/'+MIL.wick.max)}
    if(S.dzw){if(S.pledgeT>0&&S.pledge>0)b.push(EN?`Life Pledge: shield ${Math.ceil(S.pledge)} · ${Math.ceil(S.pledgeT)} s`:`Zastaw Życia: osłona ${Math.ceil(S.pledge)} · ${Math.ceil(S.pledgeT)} s`);if(S.pledgeHv>0)b.push(EN?`Life Pledge: next heavy blow +${Math.round(S.pledgeHv*DZW.pledge.hv)}`:`Zastaw Życia: następny silny atak +${Math.round(S.pledgeHv*DZW.pledge.hv)}`);if(S.tonN>0)b.push(EN?`Last Toll: ${S.tonN}/${S.pk.dTonN||DZW.ton.n} parries`:`Ostatni Ton: ${S.tonN}/${S.pk.dTonN||DZW.ton.n} parowań`)}
    if(S.fury>0)b.push((EN?`Mila's fury +20% damage · ${mm(S.fury)}`:`Szał Mili +20% obrażeń · ${mm(S.fury)}`));
    if(S.heri>0)b.push((EN?`Heri's sign: stamina regeneration +15% · ${mm(S.heri)}`:`Znak Heriego: regeneracja staminy +15% · ${mm(S.heri)}`));
    if(S.bloodPrimed>0)b.push((EN?'Brand ready: your next hit marks the target':'Piętno gotowe: następny cios oznacza cel'));if(S.swordGuardian)b.push((EN?`Stone Defender: ${Math.ceil(S.swordGuardian.hp)} HP · ${Math.ceil(S.swordGuardian.t)} s`:`Kamienny obrońca: ${Math.ceil(S.swordGuardian.hp)} PŻ · ${Math.ceil(S.swordGuardian.t)} s`));
    if(pl.riposte>0)b.push((EN?`<span class="tr">Riposte ready: ×${riMul().toFixed(1)}</span>`:`<span class="tr">Riposta gotowa: ×${riMul().toFixed(1).replace('.',',')}</span>`));
    if(pl.broken>0)b.push((EN?'<span class="tr">Guard broken!</span>':'<span class="tr">Garda przełamana!</span>'));
    if(S.herb>0)b.push((EN?`Whisperer's brew, healing · ${mm(S.herb)}`:`Napar szeptuchy, leczenie · ${mm(S.herb)}`));
    if(S.slowT>0)b.push((EN?'<span class="tr">Striga\'s scream: slowed</span>':'<span class="tr">Krzyk Strzygi: spowolnienie</span>'));
    if(S.snare>0)b.push((EN?'<span class="tr">Caught!</span>':'<span class="tr">Pochwycony!</span>'));
    const h=b.join('<br>');if(h!==lastBuffs){lastBuffs=h;$('buffs').innerHTML=h}}
  if(S.hl&&clock-S.hl.t>3){S.hl=null;chipsDirty=true}
  if(chipsDirty){chipsDirty=false;const chip=k=>{const mx=ENCH.includes(k)&&S.mainEnchant&&S.mainEnchant!==k?3:SK[k].max||9;return`<span class="sk${S.hl&&S.hl.k===k?' hi':''}" title="${SK[k].name}"><i data-premium-skill="${k}" class="ic ic-${SK[k].ic||k}"></i><em>${'<b class="on"></b>'.repeat(S.sk[k])+'<b></b>'.repeat(Math.max(0,mx-S.sk[k]))}</em></span>`};
    $('chips').innerHTML=SLASH_SK.filter(k=>S.sk[k]).map(chip).join('')}}
// touch controls: detected automatically, but the switch on the title screen can force them on or off (remembered in this browser)
let coarse=matchMedia('(pointer:coarse)').matches;
try{const v=localStorage.getItem('pn_touch');if(v==='1'||v==='0')coarse=v==='1'}catch(e){}
function applyTouchMode(){$('opts').classList.add('sl');$('figKb').hidden=false;$('touchTgl').checked=coarse;
  $('warn').textContent=''}

function applyStory(){$('storyTgl').checked=!STORYMODE;$('sFab').classList.toggle('on',STORYMODE);$('sArc').classList.toggle('on',!STORYMODE);$('sFab').setAttribute('aria-pressed',String(STORYMODE));$('sArc').setAttribute('aria-pressed',String(!STORYMODE));$('storyModeHint').textContent=STORYMODE?(EN?'You unlock acts one by one.':'Rozdziały odblokowujesz po kolei.'):(EN?'All acts available right away.':'Wszystkie rozdziały dostępne od razu.');}
$('sFab').addEventListener('click',()=>{$('storyTgl').checked=false;$('storyTgl').dispatchEvent(new Event('change'))});$('sArc').addEventListener('click',()=>{$('storyTgl').checked=true;$('storyTgl').dispatchEvent(new Event('change'))});
const DIFFCAP={e:(EN?'Fewer, weaker enemies. Rewards: −20% experience, −50% gold.':'Mniej, słabsi wrogowie. Nagrody: −20% doświadczenia, −50% złota.'),n:(EN?'Balanced play, as designed. Rewards unchanged.':'Zrównoważona rozgrywka, tak jak ją zaprojektowano. Nagrody bez zmian.'),h:(EN?'More, stronger enemies. Rewards: +20% experience, +10% gold.':'Więcej, silniejszych wrogów. Nagrody: +20% doświadczenia, +10% złota.')};
function applyDiff(){for(const b of document.querySelectorAll('#diffSw [data-d]'))b.classList.toggle('on',b.dataset.d===DIFFK);$('diffCap').textContent=DIFFCAP[DIFFK];ENEMY_DMG=.8*DF[DIFFK].dmg}
for(const b of document.querySelectorAll('#diffSw [data-d]'))b.addEventListener('click',()=>{DIFFK=b.dataset.d;try{localStorage.setItem('pn_diff',DIFFK)}catch(x){}applyDiff()});applyDiff();
$('storyTgl').addEventListener('change',e=>{STORYMODE=!e.target.checked;try{localStorage.setItem('pn_story',STORYMODE?'1':'0')}catch(x){}applyStory();renderRecords()});
applyStory();
$('briSl').value=Math.round(SETT.bri*100);$('briSl').addEventListener('input',e=>{SETT.bri=+e.target.value/100;postMat.uniforms.bri.value=SETT.bri;try{localStorage.setItem('pn_bri',String(SETT.bri))}catch(x){}});
$('touchTgl').addEventListener('change',e=>{coarse=e.target.checked;try{localStorage.setItem('pn_touch',coarse?'1':'0')}catch(err){}applyTouchMode()});
addEventListener('resize',()=>{if($('title')&&!$('title').hidden)applyTouchMode()});
applyTouchMode();
// full screen on phones and tablets: standard API, Safari's webkit variant (iPad), nothing to do when launched from the home screen
function goFull(){try{if(localStorage.getItem('nb_fs')==='0')return}catch(e){}const d=document.documentElement,inApp=navigator.standalone||matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches;
  if(inApp||document.fullscreenElement||document.webkitFullscreenElement)return;const fs=d.requestFullscreen||d.webkitRequestFullscreen;if(!fs)return;
  try{const p=fs.call(d);if(p&&p.then)p.then(lockLandscape,()=>{});else lockLandscape()}catch(e){}}
function lockLandscape(){try{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}// the game is landscape only: lock where allowed, otherwise the #rot hint covers portrait
// wyglad przyciskow Fabularny / Arcade (paczka NightBrand_PRZYCISKI_TRYBOW); logika trybu bez zmian (aria-checked ustawia syncTitleMode)
{const st=document.createElement('style');st.textContent=`/* NightBrand: standalone, scoped appearance. No gameplay or mode-selection logic. */
.nb-mode-select {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  width: min(100%, 318px);
  isolation: isolate;
}
.nb-mode-select .nb-mode {
  --nb-edge: #665342;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  min-height: 140px;
  aspect-ratio: 0.905;
  padding: 16px 8px 24px;
  margin: 0;
  border: 1px solid var(--nb-edge);
  border-radius: 5px;
  color: #e4d6b7;
  background:
    radial-gradient(ellipse at 50% 20%, #60503b26, transparent 72%),
    linear-gradient(135deg, #ffffff06, transparent 45%),
    linear-gradient(180deg, #24231f, #151715 58%, #111310);
  box-shadow: inset 0 0 0 3px #0b0d0b, inset 0 0 0 4px #77634745,
    inset 0 7px 18px #ffffff03, 0 5px 12px #0006;
  font: inherit;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: border-color 120ms ease, background-color 120ms ease, box-shadow 120ms ease, color 120ms ease;
}
.nb-mode-select .nb-mode::before {
  content: "";
  position: absolute;
  inset: 7px;
  pointer-events: none;
  background:
    linear-gradient(#bda270, #bda270) left top / 13px 1px no-repeat,
    linear-gradient(#bda270, #bda270) left top / 1px 13px no-repeat,
    linear-gradient(#bda270, #bda270) right top / 13px 1px no-repeat,
    linear-gradient(#bda270, #bda270) right top / 1px 13px no-repeat,
    linear-gradient(#bda270, #bda270) left bottom / 13px 1px no-repeat,
    linear-gradient(#bda270, #bda270) left bottom / 1px 13px no-repeat,
    linear-gradient(#bda270, #bda270) right bottom / 13px 1px no-repeat,
    linear-gradient(#bda270, #bda270) right bottom / 1px 13px no-repeat;
  opacity: .48;
}
.nb-mode-select .nb-mode__icon {
  display: block;
  flex: 0 0 auto;
  width: 76px;
  max-width: 68%;
  height: auto;
  aspect-ratio: 1;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
}
.nb-mode-select .nb-mode__title {
  display: block;
  max-width: 100%;
  font-family: var(--nb-menu-font, "Grenze"), Georgia, serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.05;
  text-align: center;
  text-shadow: 0 2px 2px #000c;
  pointer-events: none;
}
.nb-mode-select .nb-mode__marker {
  position: absolute;
  bottom: 13px;
  left: calc(50% - 3px);
  width: 6px;
  height: 6px;
  box-sizing: border-box;
  border: 1px solid #6f6250;
  background: #171a16;
  transform: rotate(45deg);
  pointer-events: none;
}
.nb-mode-select .nb-mode[aria-checked="true"] {
  --nb-edge: #bc9657;
  color: #fff0cf;
  background:
    radial-gradient(ellipse at 50% 24%, #97743932, transparent 74%),
    linear-gradient(180deg, #302b21, #1d1e17 58%, #151710);
  box-shadow: inset 0 0 0 3px #10120d, inset 0 0 0 4px #bd965771,
    0 0 0 1px #bc96572b, 0 5px 12px #0006;
}
.nb-mode-select .nb-mode[aria-checked="true"]::before { opacity: .92; }
.nb-mode-select .nb-mode[aria-checked="true"] .nb-mode__marker {
  background: #e6bd73;
  border-color: #ffe0a3;
  box-shadow: 0 0 7px #d29b3e60;
}
@media (hover: hover) {
  .nb-mode-select .nb-mode:hover:not(:disabled):not([aria-disabled="true"]) {
    border-color: #d4b77d;
    color: #fff3d9;
  }
}
.nb-mode-select .nb-mode:focus-visible {
  outline: 2px solid #f6dc9d;
  outline-offset: 4px;
}
.nb-mode-select .nb-mode:active:not(:disabled):not([aria-disabled="true"]) {
  box-shadow: inset 0 0 0 3px #090b08, inset 0 0 0 4px #ad8b5060, inset 0 5px 18px #0008;
}
.nb-mode-select .nb-mode:disabled,
.nb-mode-select .nb-mode[aria-disabled="true"] { opacity: .45; cursor: default; }
@media (prefers-reduced-motion: reduce) {
  .nb-mode-select .nb-mode { transition: none; }
}
@media (forced-colors: active) {
  .nb-mode-select .nb-mode { border: 1px solid ButtonText; }
  .nb-mode-select .nb-mode[aria-checked="true"] { border: 3px solid Highlight; }
}

/* dopasowanie do lewej kolumny ekranu tytulowego (jedno miejsce: szerokosc kontenera, pole ikony, rozmiar napisu) */
#title .nb-mode-select{width:100%;gap:6px;margin:0}
#title .nb-mode-select .nb-mode{aspect-ratio:auto;min-height:0;height:clamp(84px,13vh,150px);padding:8px 4px 18px;gap:4px}
#title .nb-mode-select .nb-mode::before{inset:5px}
#title .nb-mode-select .nb-mode__icon{width:clamp(30px,6.5vh,58px);max-width:60%}
#title .nb-mode-select .nb-mode__title{font-size:clamp(13px,1.35vw,20px)}
#title .nb-mode-select .nb-mode__marker{bottom:9px}
@media(max-height:550px){#title .nb-mode-select{gap:4px}#title .nb-mode-select .nb-mode{flex-direction:row;height:34px;min-height:0;padding:2px 4px;gap:3px;border-radius:4px}#title .nb-mode-select .nb-mode::before{inset:2px;opacity:.3}#title .nb-mode-select .nb-mode[aria-checked="true"]::before{opacity:.75}#title .nb-mode-select .nb-mode__icon{width:15px;max-width:none}#title .nb-mode-select .nb-mode__title{font-size:9.5px;line-height:1}#title .nb-mode-select .nb-mode__marker{top:4px;right:4px;bottom:auto;left:auto;width:4px;height:4px}}
`;document.head.appendChild(st)}
