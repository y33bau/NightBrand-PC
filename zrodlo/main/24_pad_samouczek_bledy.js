// ---- pad Xbox (Gamepad API): ruch, walka i nawigacja po menu ----
let pcMenuBack=null;
const PAD={x:0,y:0,ax:0,ay:0,aimT:-99,prev:[],cur:[],atk:false,blk:false,on:false,g:null,menu:'',lock:0,nav:0,navD:0};
function padRumble(s,w,ms,g0){if(SETT.rumble===false)return;try{const g=g0||PAD.g;if(g&&g.vibrationActuator)g.vibrationActuator.playEffect('dual-rumble',{duration:ms,strongMagnitude:s,weakMagnitude:w})}catch(e){}}
function padDz(x,y,dz){const m=Math.hypot(x,y);if(m<dz)return [0,0];const k=Math.min(1,(m-dz)/(1-dz))/m;return [x*k,y*k]}
function padMenuId(){if(recoveryActive)return 'recovery';if(S&&S.notice&&!$('notice').hidden)return 'notice';if(S&&S.witChoice&&!$('witChoices').hidden)return 'witChoices';if(S&&S.phase==='end'&&!$('end').hidden)return 'end';for(const id of ['lang','pause','shop','lvl','prep','conf','manual','opts','kap','end','title']){const el=$(id);if(el&&!el.hidden)return id}return ''}
// Menus: up/down/left/right pick the nearest control in that direction on screen (not the next one in the list).
function navMove(id,d){const root=$(id);if(!root)return false;const items=[...root.querySelectorAll('button,input,summary')].filter(e=>!e.disabled&&e.offsetParent!==null);if(!items.length)return false;
  const ae=document.activeElement,cur=items.includes(ae)?ae:null;if(!cur){const s1=id==='title'?$('start1'):null;(s1&&items.includes(s1)?s1:items[0]).focus();return true}
  const c=lrect(cur),cx=c.left+c.width/2,cy=c.top+c.height/2;let best=null,bs=1e9;
  for(const e of items){if(e===cur)continue;const r=lrect(e),dx=r.left+r.width/2-cx,dy=r.top+r.height/2-cy;const main=d==='d'?dy:d==='u'?-dy:d==='r'?dx:-dx,side=d==='d'||d==='u'?dx:dy;if(main<=2)continue;const sc=main+Math.abs(side)*2.2;if(sc<bs){bs=sc;best=e}}
  if(!best){const i=items.indexOf(cur),step=d==='d'||d==='r'?1:-1;best=items[(i+step+items.length)%items.length]}
  best.focus({preventScroll:true});try{best.scrollIntoView({block:'nearest'})}catch(e){}return true}
addEventListener('keydown',e=>{const m={arrowdown:'d',arrowup:'u',arrowleft:'l',arrowright:'r'}[e.key.toLowerCase()];if(!m||recoveryActive||e.target.closest?.('[role=radiogroup]')&&['l','r'].includes(m))return;const id=padMenuId();if(!id||id==='notice')return;const ae=document.activeElement;if(ae&&ae.type==='range'&&(m==='l'||m==='r'))return;if(ae&&(ae.tagName==='SELECT'||ae.tagName==='TEXTAREA'||ae.type==='text'))return;if(navMove(id,m)){e.preventDefault();e.stopImmediatePropagation()}},true);
function padNav(id,dt,pr,g){
  const root=$(id);if(!root)return;const items=[...root.querySelectorAll('button,input,summary')].filter(e=>!e.disabled&&e.offsetParent!==null);if(!items.length)return;
  const ae=document.activeElement;let i=items.indexOf(ae);if(i<0){const s1=id==='title'?items.indexOf($('start1')):-1;i=s1>=0?s1:0;items[i].focus()}
  const cur=items[i];
  let dir=0,hor=0;const lx=g.axes[0]||0,ly=g.axes[1]||0;
  const up=PAD.cur[12]||ly<-.6,dn=PAD.cur[13]||ly>.6,lf=PAD.cur[14]||lx<-.6,rt=PAD.cur[15]||lx>.6;
  const d=up?-1:dn?1:lf?-2:rt?2:0;
  if(d===0){PAD.navD=0;PAD.nav=0}else{PAD.nav-=dt;if(d!==PAD.navD||PAD.nav<=0){PAD.nav=PAD.navD===d?.16:.4;PAD.navD=d;if(d===1||d===2)dir=1;else dir=-1;hor=Math.abs(d)===2}}
  const grabOff=()=>{PAD.grab=null;for(const e of document.querySelectorAll('.rng.grab'))e.classList.remove('grab')};
  if(PAD.grab&&PAD.grab!==cur)grabOff();
  if(dir){if(PAD.grab===cur){if(hor){cur.value=String(Math.max(+cur.min,Math.min(+cur.max,+cur.value+dir*5)));cur.dispatchEvent(new Event('input',{bubbles:true}));cur.dispatchEvent(new Event('change',{bubbles:true}))}}
    else navMove(id,d===1?'d':d===-1?'u':d===2?'r':'l')}
  if(pr(0)){if(cur.type==='range'){if(PAD.grab===cur)grabOff();else{PAD.grab=cur;if(cur.parentNode)cur.parentNode.classList.add('grab')}}else cur.click()}
  if(pr(1)&&PAD.grab){grabOff();return}
  if(pr(1)&&pcMenuBack&&pcMenuBack())return;
  // LB / RB: przełączanie zakładek w Opcjach i Instrukcji
  if((pr(4)||pr(5))&&(id==='opts'||id==='manual'||id==='kap')){const tb=[...root.querySelectorAll('.tabs .tab')],ci=tb.findIndex(b=>b.classList.contains('on'));if(tb.length){const nx=tb[(ci+(pr(5)?1:-1)+tb.length)%tb.length];nx.click();nx.focus()}}
  if(pr(1)){if(id==='pause')togglePause(false);else if(id==='shop')closeShop();else if(id==='opts')$('optsBack').click();else if(id==='manual')$('manBack').click();else if(id==='conf')$('confNo').click();else if(id==='prep')$('prepBack').click();else if(id==='kap')closeKap();else if(id==='end')$('menuBtn').click();else if(id==='title'&&$('orient').classList.contains('pc-menu')&&!$('title').classList.contains('pc-home'))$('title').querySelector('.pc-home-button')?.click()}
  if(pr(9)){if(id==='prep')$('prepGo').click();else if(id==='shop')closeShop()}
}
function padMark(){for(const e of document.querySelectorAll('.pf'))e.classList.remove('pf');if(!PAD.menu||!document.body.classList.contains('padnav'))return;const a=document.activeElement,root=$(PAD.menu);if(!a||!root||!root.contains(a))return;const t=a.type==='range'?a.parentNode:a.type==='checkbox'?(a.closest('label')||a):a;t.classList.add('pf')}
let INPUT_LAST='';window.addEventListener('keydown',()=>{INPUT_LAST='k';document.body.classList.remove('padlast')},true);for(const ev of ['pointerdown','mousedown','touchstart'])window.addEventListener(ev,()=>{INPUT_LAST='m';document.body.classList.remove('padlast')},true);
function padTick(dt){try{padTick0(dt)}finally{MPCLK=false}}
function padTick0(dt){
  let g=null,g2=null;try{const l=navigator.getGamepads?navigator.getGamepads():[];for(const p of l)if(p&&p.connected){if(!g)g=p;else{g2=p;break}}}catch(e){}
  {const pn=(g?1:0)+(g2?1:0);if(pn<(PAD.n||0)&&S&&S.phase==='play'&&!S.paused&&(INPUT_LAST==='p'||pl2)){togglePause(true);if(S.paused)padLostMsg(true)}PAD.n=pn}
  {const mt=S?S.mpTurn||0:0;if(mt!==PAD.mpT){PAD.mpT=mt;PAD.lock=.4;PAD.fresh=true}}const sw=!!(g2&&pl2&&S&&S.choosing&&S.mpTurn===2);if(sw){const tg=g;g=g2;g2=tg}MPCLK=sw;pad2Tick(g2);PAD.prev=PAD.cur;PAD.g=g;
  if(!g){PAD.cur=[];PAD.x=PAD.y=0;PAD.atk=PAD.blk=PAD.skillHeld=PAD.skillConsumed=false;return}
  PAD.cur=g.buttons.map(b=>!!b&&(b.pressed||b.value>.5));if(PAD.cur.some(Boolean)){INPUT_LAST='p';document.body.classList.add('padlast')}
  // krzyżak w nietypowych padach: oś hat (axes[9]) albo osie 6/7
  if(g.mapping!=='standard'||g.buttons.length<16){const ax=g.axes||[];let u=0,d=0,l=0,r=0;
    if(ax.length>9&&Math.abs(ax[9])<=1.01){const v=Math.round((ax[9]+1)*3.5);u=v===0||v===1||v===7;r=v===1||v===2||v===3;d=v===3||v===4||v===5;l=v===5||v===6||v===7}
    else if(ax.length>7&&(Math.abs(ax[6])>.5||Math.abs(ax[7])>.5)&&Math.abs(ax[6])<=1.01){l=ax[6]<-.5;r=ax[6]>.5;u=ax[7]<-.5;d=ax[7]>.5}
    if(u||d||l||r){PAD.cur[12]=PAD.cur[12]||!!u;PAD.cur[13]=PAD.cur[13]||!!d;PAD.cur[14]=PAD.cur[14]||!!l;PAD.cur[15]=PAD.cur[15]||!!r}}
  const pr=i=>PAD.cur[i]&&!PAD.prev[i];
  if(!PAD.on&&PAD.cur.some(Boolean)){PAD.on=true;document.body.classList.add('padnav');const k=$('keysPad');if(k)k.hidden=false}
  if(PAD.cur.some(Boolean)){try{if(AC&&AC.state==='suspended'&&!(S&&S.paused))acResume()}catch(e){}}
  const mid=padMenuId();setTimeout(padMark,0);if(mid!==PAD.menu){PAD.menu=mid;PAD.lock=.4;PAD.fresh=true;PAD.grab=null;for(const e of document.querySelectorAll('.rng.grab'))e.classList.remove('grab')}if(PAD.lock>0)PAD.lock-=dt;
  // wstęp fabularny
  if(S&&S.intro){PAD.x=PAD.y=0;PAD.atk=PAD.blk=false;if(INTRO)INTRO.pad=!!(PAD.cur[0]||PAD.cur[1]||PAD.cur[2]);if(pr(9)&&INTRO)introEnd();return}
  // menu / sklep / wybór umiejętności / koniec
  if(mid){PAD.x=PAD.y=0;PAD.atk=PAD.blk=false;
    if(PAD.lock>0)return;
    if(PAD.fresh){PAD.fresh=false;const f=(mid==='title'&&$('orient').classList.contains('pc-menu')&&!$('title').classList.contains('pc-home')?$('title').querySelector('.premium-selected:not(:disabled)'):null)||(mid==='title'&&$('start1')&&$('start1').offsetParent!==null&&!$('start1').disabled?$('start1'):null)||[...$(mid).querySelectorAll('button,input')].filter(e=>!e.disabled&&e.offsetParent!==null)[0];if(f)f.focus();return}
    if(mid==='lvl'){const lv=$('lvl'),ready=performance.now()>=levelReadyAt;if(!lv.contains(document.activeElement)){const f=$('card0')||lv.querySelector('button:not(:disabled)');if(f)f.focus({preventScroll:true})}if(!ready&&(pr(0)||pr(3))){play('empty',0);return}if(pr(3)){rerollLevelCards();return}}
    padNav(mid,dt,pr,g);if(pr(9)&&mid==='pause')togglePause(false);return}
  if(!S||S.phase!=='play'){PAD.x=PAD.y=0;PAD.atk=PAD.blk=false;return}
  if(pr(9)){togglePause(true);return}
  // ruch: lewa gałka lub krzyżak; celowanie: prawa gałka
  let [x,y]=padDz(g.axes[0]||0,g.axes[1]||0,.22);
  x+=(PAD.cur[15]?1:0)-(PAD.cur[14]?1:0);y+=(PAD.cur[13]?1:0)-(PAD.cur[12]?1:0);PAD.x=x;PAD.y=y;
  const [ax,ay]=padDz(g.axes[2]||0,g.axes[3]||0,.35);if(ax||ay){const m=Math.hypot(ax,ay);PAD.ax=ax/m;PAD.ay=ay/m;PAD.aimT=clock}
  const lt=!!PAD.cur[6];PAD.skillHeld=lt;if(!PAD.cur[1]&&!PAD.cur[2]&&!PAD.cur[3])PAD.skillConsumed=false;PAD.atk=!!PAD.cur[7]||(!lt&&!PAD.skillConsumed&&!!PAD.cur[2]);PAD.blk=!!PAD.cur[4];
  if(pr(0)&&!lt)rollPress=true;if(lt){if(pr(0)){PAD.skillConsumed=true;activateSlot(3)}if(pr(2)){PAD.skillConsumed=true;activateSlot(0)}if(pr(3)){PAD.skillConsumed=true;activateSlot(1)}if(pr(1)){PAD.skillConsumed=true;activateSlot(2)}if(pr(5)){PAD.skillConsumed=true;activateSlot(4)}if(pr(10)){PAD.skillConsumed=true;activateSlot(5)}}else if(!PAD.skillConsumed){if(pr(3))talkPress=true;if(pr(1))heavyPress=true}
  if(pr(5)&&!lt)heavyPress=true;
}
for(const e of document.querySelectorAll('input[type=range]')){const w=document.createElement('span');w.className='rng';e.parentNode.insertBefore(w,e);w.innerHTML='<i class="rk"></i><i class="rf"></i><i class="rh"></i>';w.appendChild(e)}
function syncRanges(){for(const e of document.querySelectorAll('input[type=range]')){const mn=+e.min||0,mx=+e.max||100,v=String(Math.max(0,Math.min(1,(e.value-mn)/(mx-mn))));e.style.setProperty('--v',v);if(e.parentNode)e.parentNode.style.setProperty('--v',v)}}
document.addEventListener('input',syncRanges,true);document.addEventListener('click',()=>setTimeout(syncRanges,0),true);document.addEventListener('keyup',syncRanges,true);syncRanges();
addEventListener('gamepadconnected',()=>{document.body.classList.add('padnav');const k=$('keysPad');if(k)k.hidden=false});
addEventListener('mousedown',()=>document.body.classList.remove('padnav'),true);
// ---- krótki samouczek: podpowiedzi w pierwszej nocy rozdziału I, tylko raz ----
function tutorialKey(){return 'pn_tut_s'}
function tutorialDone(){try{return localStorage.getItem(tutorialKey())==='1'}catch(e){return false}}
function finishTutorial(){try{localStorage.setItem(tutorialKey(),'1')}catch(e){}$('tut').classList.remove('on');$('tutSkip').hidden=true}
const TUT={i:0,shown:0,sid:null,x0:null};
function tutList(){const tc=coarse,pd=PAD.on&&!tc;
return [{t:1,text:tc?(SETT.touchLeft?(EN?'Right':'Prawy'):(EN?'Left':'Lewy'))+(EN?' thumb: drag to move':' kciuk: przeciągnij, aby się poruszać'):pd?(EN?'Left stick: move':'Lewy drążek: ruch'):(EN?'WASD or arrow keys: move':'WASD lub strzałki: ruch'),done:()=>Math.hypot(pl.x-TUT.x0[0],pl.y-TUT.x0[1])>30},
{t:4,text:(tc?(EN?'Light attack: tap the button ':'Szybki atak: dotknij przycisku ')+(SETT.touchLeft?(EN?'on the left':'po lewej'):(EN?'on the right':'po prawej')):pd?(EN?'X: light attack · B: heavy attack':'X: szybki atak · B: silny atak'):(EN?'J: light attack · K: heavy attack · L: block':'J: szybki atak · K: silny atak · L: blok')),done:()=>S.actions.attack>0},
{t:12,text:(EN?'Blocking just before a hit parries. A bright highlight announces an attack; a red one requires a dodge.':'Blok tuż przed trafieniem paruje. Jasne podświetlenie zapowiada cios; czerwone wymaga uniku.'),done:()=>S.actions.block>0},
{t:20,text:tc?(EN?'Dodge: the button next to attack. You need the full stamina cost.':'Unik: przycisk przy ataku. Potrzebujesz pełnego kosztu staminy.'):pd?(EN?'A: dodge. Moves you and gives brief invulnerability.':'A: unik. Przesuwa cię i daje krótką nietykalność.'):(EN?'Space or Shift: dodge. Avoid the red highlight and the chain.':'Spacja lub Shift: unik. Unikaj czerwonego podświetlenia i łańcucha.'),done:()=>S.actions.dodge>0},
{t:30,text:(EN?'Kills give experience at once; collect coins. Levelling up heals ':'Zabójstwa od razu dają doświadczenie, zbieraj monety. Awans leczy ')+Math.round(S.pk.lvHeal*100)+(EN?'% health. At midnight you can buy upgrades from Marga.':'% życia. O północy kupisz ulepszenia u Margi.'),done:()=>S.actions.collect>0},
...([{t:35,text:(EN?'Magic supports the sword: the first blade element is the main one, the second is support. At most two elements in total. Fire excludes ice, but only in blade spells.':'Magia wspiera miecz: pierwszy żywioł ostrza jest główny, drugi wspierający. Łącznie najwyżej dwa żywioły. Ogień wyklucza lód, ale tylko w zaklęciach ostrza.'),done:()=>true},{t:40,text:tc?(EN?'The four icons are your equipped skills. Tap the one you want. In the pause menu outside combat you can change your loadout. Magic costs mana (the blue bar), Blade Whirlwind — stamina. Check the cost and cooldown in the skill description.':'Cztery ikony to wyposażone skille. Dotknij wybraną. W pauzie poza walką możesz zmienić wyposażenie. Magia płaci maną (niebieski pasek), Wir Ostrza — staminą. Koszt i odnowienie sprawdzisz w opisie skilla.'):pd?(EN?'Hold LT and press X, Y, B or A to use a slot skill. Without LT: A dodges, LB blocks, RT is a light attack, RB a heavy one. You can change your loadout in the pause menu outside combat.':'Przytrzymaj LT i naciśnij X, Y, B lub A, aby użyć skilla ze slotu. Bez LT: A to unik, LB blok, RT szybki atak, RB silny. Wyposażenie zmienisz w pauzie poza walką.'):(EN?'Q / E / F / R trigger your equipped skills. Aim with the cursor; without a mouse, face the target. Talk: Enter. You can change your loadout in the pause menu outside combat.':'Q / E / F / R uruchamiają wyposażone skille. Celuj kursorem; bez myszy patrz w kierunku celu. Rozmowa: Enter. Wyposażenie zmienisz w pauzie poza walką.'),done:()=>true},{t:43,text:(EN?'Techniques support swordplay: Breaker needs a charged heavy attack, Retaliation — a parry; spikes and the defender are triggered from slots. You will find the details of every technique in Guide → Styles.':'Techniki wspierają szermierkę: Przełamanie wymaga naładowanego silnego ataku, Odwet — parowania; kolce i obrońcę aktywujesz ze slotów. Szczegóły każdej techniki znajdziesz w Instrukcji → Style.'),done:()=>true}]),{t:45,text:(EN?'Goal: survive the night and defeat the final boss. The shop and the bosses make a run longer.':'Cel: przetrwaj noc i pokonaj finałowego bossa. Sklep i bossowie wydłużają podejście.'),done:()=>true}];}
function tutTick(dt){const h=$('tut');if(!HINTS_ENABLED||tutorialDone()||S.dg||CH!==1||STORYINTRO_ACTIVE()||isPort()){$('tutSkip').hidden=true;h.classList.remove('on');return}if(TUT.sid!==S){TUT.sid=S;TUT.i=0;TUT.shown=0;TUT.x0=[pl.x,pl.y]}const steps=tutList();if(TUT.i>=steps.length){finishTutorial();return}const q=steps[TUT.i];if(S.t<q.t)return;$('tutText').textContent=q.text;h.classList.add('on');$('tutSkip').hidden=false;TUT.shown+=dt;if(TUT.shown>=5&&q.done()){TUT.i++;TUT.shown=0;h.classList.remove('on')}}

function STORYINTRO_ACTIVE(){return !!(S&&S.intro)}
// Recovery is independent of the renderer, so its controls work even after a failed frame.
let recoveryActive=false,contextLost=false,errorMemory=[];
const recovery=document.createElement('div');recovery.id='recovery';recovery.hidden=true;recovery.setAttribute('role','alertdialog');recovery.setAttribute('aria-modal','true');recovery.setAttribute('aria-label',(EN?'Game problem':'Problem z grą'));recovery.style.cssText='position:absolute;inset:0;z-index:99999;background:#100f12f5;color:#eee;padding:8%;overflow:auto;pointer-events:auto';
recovery.innerHTML=(EN?'<h2>The game has been paused</h2><p id="recoveryText"></p><button class="go" id="recoveryMenu" type="button">Back to menu</button><p><button class="go alt" id="recoveryReload" type="button">Reload game</button></p><p>Your permanent progress stays saved. The current night will not resume after reloading.</p>':'<h2>Gra została wstrzymana</h2><p id="recoveryText"></p><button class="go" id="recoveryMenu" type="button">Wróć do menu</button><p><button class="go alt" id="recoveryReload" type="button">Przeładuj grę</button></p><p>Trwały postęp pozostaje zapisany. Bieżąca noc nie zostanie wznowiona po przeładowaniu.</p>');$('screen').appendChild(recovery);
// 8.11.2026: errors that the game survives (it keeps running) are kept separately, so they never push out the real crash reports.
// One entry per place+message (with a counter), at most 30, written once per session per entry. Never throws.
function quietErr(where,e){try{const f=quietErr,m=String(e&&e.message||e||'?').slice(0,300),k=where+'|'+m;f.seen=f.seen||new Set();if(f.seen.has(k))return;f.seen.add(k);
  let L=[];try{L=JSON.parse(localStorage.getItem('pn_errors_quiet')||'[]');if(!Array.isArray(L))L=[]}catch(x){L=[]}
  const o=L.find(r=>r&&r.where===where&&r.message===m);if(o){o.count=(o.count||1)+1;o.time=new Date().toISOString()}else L.push({time:new Date().toISOString(),where,message:m,stack:String(e&&e.stack||'').slice(0,800),count:1});
  try{localStorage.setItem('pn_errors_quiet',JSON.stringify(L.slice(-30)))}catch(x){}}catch(x){}}
function readQuietErrors(){try{const v=JSON.parse(localStorage.getItem('pn_errors_quiet')||'[]');return Array.isArray(v)?v:[]}catch(e){return[]}}
function readErrors(){try{const v=JSON.parse(localStorage.getItem('pn_errors')||'[]');return Array.isArray(v)?v.slice(-20):[]}catch(e){return errorMemory}}
function recordError(kind,value,source=''){try{const errors=readErrors();errors.push({time:new Date().toISOString(),kind,message:String(value&&value.message||value||(EN?'Unknown error':'Nieznany błąd')).slice(0,2000),stack:String(value&&value.stack||'').slice(0,4000),source:String(source).slice(0,500)});errorMemory=errors.slice(-20);try{localStorage.setItem('pn_errors',JSON.stringify(errorMemory))}catch(e){}}catch(e){}}
function showRecovery(text){recoveryActive=true;if(S)S.paused=true;resetInput();$('recoveryText').textContent=text;recovery.hidden=false;$('recoveryMenu').disabled=contextLost;$('recoveryReload').focus()}
function handleGameError(kind,value,source){recordError(kind,value,source);try{showRecovery((EN?'An error occurred. Return to the menu. You will find a report for testers in Options → Save data.':'Wystąpił błąd. Wróć do menu. Raport dla testera znajdziesz w Opcjach → Dane zapisu.'))}catch(e){recoveryActive=true;recovery.hidden=false}}
// Only a failure inside the game loop stops the game. Other errors are logged; ours also get a short note on screen.
function acResume(){try{const p=AC&&AC.resume();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
let lastErrNote=-1e9;
function noteError(kind,value,source){recordError(kind,value,source);const now=performance.now();if(now-lastErrNote<10000)return;lastErrNote=now;try{const m=$('msg');m.textContent=(EN?'A minor error occurred. The game keeps running; the report is in Options → Save data.':'Wystąpił drobny błąd. Gra działa dalej; raport jest w Opcjach → Dane zapisu.');m.classList.add('on');clearTimeout(msgT);msgT=setTimeout(()=>m.classList.remove('on'),3400)}catch(e){}}
function foreignError(e){const f=e.filename||'';if(!f)return /^script error\.?$/i.test(String(e.message||'').trim())||!e.error;try{const u=new URL(f,location.href);return u.href.split(/[?#]/)[0]!==location.href.split(/[?#]/)[0]&&u.origin!==location.origin}catch(x){return true}}
window.addEventListener('error',e=>{if(e.target&&e.target!==window)return;if(foreignError(e)){recordError('external',e.message||'Script error',e.filename||'');return}noteError('error',e.error||e.message,(e.filename||'')+':'+(e.lineno||0))});
window.addEventListener('unhandledrejection',e=>{e.preventDefault();const r=e.reason,n=r&&r.name;if(n==='NotAllowedError'||n==='AbortError'||n==='NotSupportedError'){recordError('ignored',r);return}noteError('unhandledrejection',r)});
$('recoveryReload').onclick=()=>location.reload();
$('recoveryMenu').onclick=()=>{if(contextLost)return;try{toMenu();last=performance.now();recoveryActive=false;recovery.hidden=true}catch(e){recordError('menu',e);$('recoveryText').textContent=(EN?'Could not return to the menu. Reload the game; your permanent progress will stay saved.':'Nie udało się wrócić do menu. Przeładuj grę; trwały postęp pozostanie zapisany.')}};
recovery.addEventListener('pointerdown',e=>e.stopPropagation());
window.addEventListener('keydown',e=>{if(recoveryActive&&e.key!=='Tab'){e.stopImmediatePropagation();e.preventDefault();if(e.key==='Enter')document.activeElement.click()}},true);
cvs.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;recordError('webglcontextlost',(EN?'WebGL context lost':'Utrata kontekstu WebGL'));showRecovery((EN?'The image was lost. The game is paused. Once the image recovers, the game will reload without deleting your permanent progress. If the image does not come back, choose Reload game.':'Utracono obraz. Gra jest wstrzymana. Po odzyskaniu obrazu gra przeładuje się bez usuwania trwałego postępu. Jeśli obraz nie wraca, wybierz Przeładuj grę.'))});
cvs.addEventListener('webglcontextrestored',()=>{recordError('webglcontextrestored',(EN?'Safe reload':'Bezpieczne przeładowanie'));location.reload()});
function errorReport(){return JSON.stringify({game:'Nightbrand',url:location.href.split('?')[0],userAgent:navigator.userAgent,quality:SETT.quality,qmode:SETT.qmode,fpsCap:SETT.fpsCap,gfx:GFX,touch:coarse,errors:readErrors(),quietErrors:readQuietErrors()},null,2)}
$('copyErrors').onclick=async()=>{const report=errorReport();try{await navigator.clipboard.writeText(report);saveMsg((EN?'Error report copied.':'Skopiowano raport błędów.'))}catch(e){const t=document.createElement('textarea');t.value=report;t.setAttribute('aria-label',(EN?'Error report to copy':'Raport błędów do skopiowania'));$('pane-dat').appendChild(t);t.focus();t.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}if(ok)t.remove();saveMsg(ok?(EN?'Error report copied.':'Skopiowano raport błędów.'):(EN?'Copy the selected report manually.':'Zaznaczony raport skopiuj ręcznie.'))}};
function frameLimit(){return SETT.quality==='low'||coarse?.2:.5}
