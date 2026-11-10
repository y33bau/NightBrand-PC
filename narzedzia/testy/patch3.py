import glob
D='/home/claude/nightbrand-backup/zrodlo/main/'
def rep(pref,old,new):
    f=glob.glob(D+pref+'*.js')[0];t=open(f,encoding='utf8').read()
    assert t.count(old)==1,(pref,t.count(old),old[:70])
    open(f,'w',encoding='utf8').write(t.replace(old,new))
# ===== własne klawisze =====
rep('09',"const SETT={sfx:1,","""// 10.11.2026: own keyboard bindings. Game logic keeps reading the default keys; during play the pressed key
// is translated to the default key of its action (kbIn). Stored in localStorage pn_keys.
const KB_DEF={up:'w',down:'s',left:'a',right:'d',atk:'j',blk:'l',heavy:'k',roll:' ',s1:'q',s2:'e',s3:'f',s4:'r',talk:'enter'};
const KB={map:{...KB_DEF},rev:{},wait:null};
function kbOk(k){return typeof k==='string'&&k.length>0&&k.length<=12&&!['escape','p','tab','arrowup','arrowdown','arrowleft','arrowright','meta','os','contextmenu','capslock','dead','unidentified','process','1','2','3','4','5','6','g'].includes(k)&&!/^f\\d+$/.test(k)}
function kbBuild(){KB.rev={};for(const a in KB_DEF)KB.rev[KB.map[a]]=KB_DEF[a]}
function kbIn(k){if(KB.rev[k]!==undefined)return KB.rev[k];for(const a in KB_DEF)if(KB_DEF[a]===k)return '';return k}
function kbName(k){return k===' '?(EN?'Space':'Spacja'):k==='enter'?'Enter':k.length===1?k.toUpperCase():k[0].toUpperCase()+k.slice(1)}
function kbSave(){try{localStorage.setItem('pn_keys',JSON.stringify(KB.map))}catch(e){}kbBuild()}
try{const v=JSON.parse(localStorage.getItem('pn_keys')||'{}');if(isRecord(v)){for(const a in KB_DEF)if(kbOk(v[a])&&(v[a]!=='enter'||a==='talk'))KB.map[a]=v[a];const seen={};for(const a in KB_DEF){if(seen[KB.map[a]]){KB.map={...KB_DEF};break}seen[KB.map[a]]=1}}}catch(e){KB.map={...KB_DEF}}kbBuild();
const SETT={sfx:1,""")
rep('23',"if(e.repeat)return;keys[k]=true;if(k===' '||k==='shift')rollPress=true;if(k==='k')heavyPress=true;if(['q','e','f','r','g'].includes(k))activateSlot(['q','e','f','r','g'].indexOf(k));if(k==='enter')talkPress=true});",
 "if(e.repeat)return;const q=kbIn(k);if(!q)return;keys[q]=true;if(q===' '||q==='shift')rollPress=true;if(q==='k')heavyPress=true;if(['q','e','f','r','g'].includes(q))activateSlot(['q','e','f','r','g'].indexOf(q));if(q==='enter')talkPress=true});")
rep('23',"addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});","addEventListener('keyup',e=>{const k=e.key.toLowerCase(),q=kbIn(k);keys[k]=false;if(q)keys[q]=false});")
rep('12',":['Q','E','F','R','G'];",":[kbName(KB.map.s1),kbName(KB.map.s2),kbName(KB.map.s3),kbName(KB.map.s4),'G'];")
rep('14',"['Q','E','F','R'][at]","[KB.map.s1,KB.map.s2,KB.map.s3,KB.map.s4].map(kbName)[at]")
rep('23',"function trnBuild(){","""// 10.11.2026: Options > Controls > Keyboard: rows to rebind the play keys
function kbUi(){const host=$('sub-kb');if(!host)return;let b=$('kbBind');if(!b){b=document.createElement('div');b.id='kbBind';host.appendChild(b)}
  if(!$('kbCss')){const st=document.createElement('style');st.id='kbCss';st.textContent='#kbBind .kbgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.45em 1.6em;margin:.6em 0}#kbBind .kbrow{display:flex;align-items:center;justify-content:space-between;gap:.8em}#kbBind .kbb{min-width:8.5em;margin:0}#kbBind .kbb.on{outline:2px solid #e8c25a;color:#ffe2a2}@media (max-width:700px){#kbBind .kbgrid{grid-template-columns:1fr}}';document.head.appendChild(st)}
  const N=EN?{up:'Move up',down:'Move down',left:'Move left',right:'Move right',atk:'Strike (hold: heavy)',blk:'Block and parry',heavy:'Heavy strike',roll:'Dodge',s1:'Skill 1',s2:'Skill 2',s3:'Skill 3',s4:'Skill 4',talk:'Talk / use'}:{up:'Ruch w górę',down:'Ruch w dół',left:'Ruch w lewo',right:'Ruch w prawo',atk:'Cios (przytrzymaj: ciężki)',blk:'Blok i parowanie',heavy:'Ciężki cios',roll:'Unik',s1:'Umiejętność 1',s2:'Umiejętność 2',s3:'Umiejętność 3',s4:'Umiejętność 4',talk:'Rozmowa / użycie'};
  b.innerHTML=`<div class="opsep sm" aria-hidden="true"></div><h3 class="sth">${EN?'Your own keys':'Własne klawisze'}</h3><p class="figcap">${EN?'Click an action, then press the new key. Esc cancels. A key already in use swaps places. Arrow keys always move; Esc, P and the digits stay fixed. The diagram above and the hints show the default keys.':'Kliknij czynność, potem naciśnij nowy klawisz. Esc anuluje. Zajęty klawisz zamienia się miejscami. Strzałki zawsze poruszają postacią; Esc, P i cyfry są stałe. Schemat powyżej i podpowiedzi pokazują klawisze domyślne.'}</p><div class="kbgrid">`+Object.keys(KB_DEF).map(a=>`<div class="kbrow"><span>${N[a]}</span><button type="button" class="go alt kbb${KB.wait===a?' on':''}" data-a="${a}"></button></div>`).join('')+`</div><div class="btnrow"><button type="button" class="go alt" id="kbReset">${EN?'Restore default keys':'Przywróć domyślne klawisze'}</button></div>`;
  for(const x of b.querySelectorAll('.kbb')){const a=x.dataset.a;x.textContent=KB.wait===a?(EN?'Press a key…':'Naciśnij klawisz…'):kbName(KB.map[a]);x.addEventListener('click',()=>{KB.wait=KB.wait===a?null:a;kbUi();const n=$('kbBind').querySelector('.kbb[data-a="'+a+'"]');n&&n.focus()})}
  $('kbReset').addEventListener('click',()=>{KB.map={...KB_DEF};KB.wait=null;kbSave();kbUi()})}
addEventListener('keydown',e=>{if(!KB.wait)return;e.preventDefault();e.stopImmediatePropagation();const k=e.key.toLowerCase(),a=KB.wait;KB.wait=null;if(k!=='escape'&&kbOk(k)&&(k!=='enter'||a==='talk')){const o=Object.keys(KB.map).find(x=>KB.map[x]===k);if(o&&o!==a)KB.map[o]=KB.map[a];KB.map[a]=k;kbSave()}kbUi();const n=$('kbBind')&&$('kbBind').querySelector('.kbb[data-a="'+a+'"]');n&&n.focus()},true);
try{kbUi()}catch(e){quietErr('kbUi',e)}
// 10.11.2026: training ground (S.train): chapter I without the night clock, spawns, death or saved progress;
// enemies are summoned from the pause menu
function startTraining(){const go=()=>{$('manual').hidden=true;openPrep(1);PREP.curses=[];PREP.weekly=null;PREP.daily=null;PREP.endless=false;PREP.train=true;renderPrep();beginRun()};return groupReady(1)?go():waitChapter(1,go,$('trainBtn'))}
function trainBox(){const old=$('trainBox');if(old)old.remove();if(!S||!S.train||!S.paused)return;const at=$('skillLoadout');if(!at)return;
  const B=(id,t)=>`<button class="go alt" type="button" id="${id}">${t}</button>`;
  at.insertAdjacentHTML('beforebegin',`<div id="trainBox" class="pbox trnbox"><h3 class="sth">${EN?'Training ground':'Plac ćwiczeń'}</h3><p class="figcap">${EN?'You cannot die here and nothing is saved. Summon an enemy and practise parrying, dodging and skills.':'Tutaj nie możesz zginąć i nic się nie zapisuje. Przywołaj wroga i ćwicz parowanie, uniki i umiejętności.'}</p><div class="btnrow"><select id="trainType" aria-label="${EN?'Enemy':'Wróg'}"></select>${B('trainSpawn',EN?'Summon':'Przywołaj')}${B('trainClear',EN?'Remove all':'Usuń wszystkich')}${B('trainLvl',EN?'+1 night level':'+1 poziom nocy')}</div></div>`);
  const sel=$('trainType'),ks=Object.keys(ET).filter(k=>A[k]&&ENAME[k]&&k!=='jerzak');for(const k of ks){const o=document.createElement('option');o.value=k;o.textContent=ENAME[k]+(BIG.has(k)||k==='collector'?' ★':'');sel.appendChild(o)}if(ks.includes(S.trainSel))sel.value=S.trainSel;
  $('trainSpawn').addEventListener('click',()=>{S.trainSel=sel.value;trnSpawn(sel.value);togglePause(false)});
  $('trainClear').addEventListener('click',()=>{for(const e of S.enemies.slice())trnKill(e);togglePause(false)});
  $('trainLvl').addEventListener('click',()=>{S.xp=S.need;while(S.xp>=S.need){S.xp-=S.need;S.lvl++;S.need=xpNeed(S.lvl);S.pendLv++}play('level',0);togglePause(false)})}
function trnBuild(){""")
rep('23',"if(S.paused){fillPauseKeys();renderLoadout();trnFill();pl.swingT=0}","if(S.paused){fillPauseKeys();renderLoadout();trnFill();pl.swingT=0}trainBox();")
rep('23',"function toMenu(){try{clearNoteMesh()}catch(e){}","function toMenu(){try{clearNoteMesh()}catch(e){}{const tb=$('trainBox');if(tb)tb.remove()}")
rep('23',"$('manBack').addEventListener('click',()=>{$('manual').hidden=true;","""{const mb=$('manBack'),tb=document.createElement('button');tb.type='button';tb.id='trainBtn';tb.className=mb.className;tb.textContent=EN?'Training ground':'Plac ćwiczeń';tb.title=EN?'Practise on chapter I: no death, nothing saved':'Ćwicz w rozdziale I: bez śmierci, nic się nie zapisuje';mb.after(tb);tb.addEventListener('click',startTraining)}
$('manBack').addEventListener('click',()=>{$('manual').hidden=true;""")
rep('22',"  S.endless=!!PREP.endless;LASTPREP=","""  S.train=!!PREP.train;PREP.train=false;if(S.train){S.firstNight=false;S.endless=false;setTimeout(()=>{try{if(S&&S.train&&S.phase==='play'){if(S.intro)introEnd();say(EN?'Training ground: summon enemies in the pause menu (Esc). You cannot die and nothing is saved.':'Plac ćwiczeń: wrogów przywołasz w pauzie (Esc). Nie możesz zginąć i nic się nie zapisuje.');trnSpawn('possessed')}}catch(e){quietErr('train',e)}},2600);PREP.endless=false;return}
  S.endless=!!PREP.endless;LASTPREP=""")
rep('13',"if(pl.dead||S.phase!=='play'||S.opening||S.stage==='break'||S.dg)return;S.spawnT-=dt;","if(pl.dead||S.phase!=='play'||S.opening||S.stage==='break'||S.dg||S.train)return;S.spawnT-=dt;")
rep('14',"if(S.stage!=='break'&&S.stage!=='collector'&&!S.dg&&!allDead()){S.t+=dt;","if(S.stage!=='break'&&S.stage!=='collector'&&!S.dg&&!S.train&&!allDead()){S.t+=dt;")
rep('13',"if(pl.hp<=0){if(S.lastCh&&!S.lastChUsed","if(S.train&&pl.hp<=0)pl.hp=1;if(pl.hp<=0){if(S.lastCh&&!S.lastChUsed")
rep('14',"if(TRN.god&&!pl.dead){pl.hp=pl.max;pl.sta=pl.staMax;pl.mana=pl.manaMax}","if(TRN.god&&!pl.dead){pl.hp=pl.max;pl.sta=pl.staMax;pl.mana=pl.manaMax}if(S.train&&!pl.dead){pl.hp=Math.min(pl.max,pl.hp+pl.max*.12*dt);if(pl.manaMax)pl.mana=Math.min(pl.manaMax,(pl.mana||0)+pl.manaMax*.25*dt)}")
rep('22',"function metaNamed(e){if(e&&e.named)","function metaNamed(e){if(S&&S.train)return;if(e&&e.named)")
rep('22',"function metaKill(e){if(e&&e.type&&ENAME[e.type])","function metaKill(e){if(S&&S.train)return;if(e&&e.type&&ENAME[e.type])")
rep('15',"function noteTick(){if(S.noteInit||S.dg||","function noteTick(){if(S.noteInit||S.train||S.dg||")
print('OK')
