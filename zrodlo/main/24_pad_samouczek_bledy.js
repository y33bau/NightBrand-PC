// ---- pad Xbox (Gamepad API): ruch, walka i nawigacja po menu ----
let pcMenuBack=null;
const PAD={x:0,y:0,ax:0,ay:0,aimT:-99,prev:[],cur:[],atk:false,blk:false,on:false,g:null,menu:'',lock:0,nav:0,navD:0};
function padRumble(s,w,ms,g0){if(SETT.rumble===false)return;try{const g=g0||PAD.g;if(g&&g.vibrationActuator)g.vibrationActuator.playEffect('dual-rumble',{duration:ms,strongMagnitude:s,weakMagnitude:w})}catch(e){}}
function padDz(x,y,dz){const m=Math.hypot(x,y);if(m<dz)return [0,0];const k=Math.min(1,(m-dz)/(1-dz))/m;return [x*k,y*k]}
function padMenuId(){if(recoveryActive)return 'recovery';if(S&&S.notice&&!$('notice').hidden)return 'notice';if(S&&S.witChoice&&!$('witChoices').hidden)return 'witChoices';if(S&&S.dialog&&!$('dialog').hidden&&$('orient').classList.contains('pc-conversations'))return 'dialog';if(S&&S.phase==='end'&&!$('end').hidden)return 'end';for(const id of ['lang','pause','shop','lvl','prep','conf','manual','opts','kap','end','title']){const el=$(id);if(el&&!el.hidden&&!el.classList.contains('lvout'))return id}return ''}
// Menus: up/down/left/right pick the nearest control in that direction on screen (not the next one in the list).
function navMove(id,d,pad){const root=$(id);if(!root)return false;const items=pad?padItems(root):[...root.querySelectorAll('button,input,summary')].filter(e=>!e.disabled&&e.offsetParent!==null);if(!items.length)return false;
  const ae=document.activeElement,cur=items.includes(ae)?ae:null;if(!cur){const s1=id==='title'?$('start1'):null;(s1&&items.includes(s1)?s1:pad?padFirstContent(root,items):items[0]).focus();return true}
  const c=lrect(cur),cx=c.left+c.width/2,cy=c.top+c.height/2;let best=null,bs=1e9;
  for(const e of items){if(e===cur)continue;const r=lrect(e),dx=r.left+r.width/2-cx,dy=r.top+r.height/2-cy;const main=d==='d'?dy:d==='u'?-dy:d==='r'?dx:-dx,side=d==='d'||d==='u'?dx:dy;if(main<=2)continue;const sc=main+Math.abs(side)*2.2;if(sc<bs){bs=sc;best=e}}
  if(!best){const i=items.indexOf(cur),step=d==='d'||d==='r'?1:-1;best=items[(i+step+items.length)%items.length]}
  best.focus({preventScroll:true});try{best.scrollIntoView({block:'nearest'})}catch(e){}return true}
// 16.11.2026: WSAD w menu dziala jak strzalki (W gora, S dol, A lewo, D prawo); w suwakach A/D przesuwa wartosc o jeden krok
addEventListener('keydown',e=>{const kk=e.key.toLowerCase(),m={arrowdown:'d',arrowup:'u',arrowleft:'l',arrowright:'r',s:'d',w:'u',a:'l',d:'r'}[kk];if(!m||recoveryActive||e.target.closest?.('[role=radiogroup]')&&['l','r'].includes(m))return;const id=padMenuId();if(!id||id==='notice')return;const ae=document.activeElement;if(ae&&ae.type==='range'&&(m==='l'||m==='r')){if(!kk.startsWith('arrow')&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();e.stopImmediatePropagation();ae.value=String(+ae.value+(m==='r'?1:-1)*(+ae.step||1));ae.dispatchEvent(new Event('input',{bubbles:true}));ae.dispatchEvent(new Event('change',{bubbles:true}))}return}if(ae&&(ae.tagName==='SELECT'||ae.tagName==='TEXTAREA'||ae.type==='text'))return;if(navMove(id,m)){e.preventDefault();e.stopImmediatePropagation()}},true);
// 13.11.2026 (runda pad-menu-2): nawigacja padem wg Xbox Accessibility Guideline 112.
// Fokus nie gubi się: gdy menu przerysuje przyciski albo mysz zdejmie fokus, wraca na ten sam
// element (lub jego odpowiednik po id/zakładce/tekście, albo najbliższy na ekranie), a nie na pierwszy.
function padIsTab(e){return !!(e.matches&&(e.matches(PADTABS)||e.matches(PADSUBS)))}
function padTiny(e){const r=e.getBoundingClientRect();return r.width<4||r.height<4}
function padItems(root){return [...root.querySelectorAll('button,input,summary')].filter(e=>!e.disabled&&e.offsetParent!==null&&!padIsTab(e)&&!padTiny(e))}
// pierwszy element treści pod paskiem zakładek (lewy górny), a gdy zakładek brak: pierwszy w kolejności
function padFirstContent(root,items){const tb=[...root.querySelectorAll(PADTABS)].filter(b=>b.offsetParent!==null);if(!tb.length)return items[0];
  const vert=tb.length>1&&Math.abs(tb[0].getBoundingClientRect().top-tb[1].getBoundingClientRect().top)>8;let c;
  if(vert){const rr=Math.max(...tb.map(b=>b.getBoundingClientRect().right));c=items.filter(e=>e.getBoundingClientRect().left>=rr-2)}
  else{const bb=Math.max(...tb.map(b=>b.getBoundingClientRect().bottom));c=items.filter(e=>e.getBoundingClientRect().top>=bb-2)}
  c.sort((a,b)=>{const p=a.getBoundingClientRect(),q=b.getBoundingClientRect();return Math.abs(p.top-q.top)>8?p.top-q.top:p.left-q.left});return c[0]||items[0]}
function padSig(e){if(!e)return '';const d=e.dataset||{};return e.id||['nbp','panel','tab','sub','ps','hero','m'].map(k=>d[k]?k+':'+d[k]:'').join('')||(e.className+'|'+(e.textContent||'').trim().slice(0,40))}
function padKeep(id,items){const ae=document.activeElement;
  if(items.includes(ae)){const r=ae.getBoundingClientRect();PAD.keep={id,el:ae,sig:padSig(ae),x:r.left+r.width/2,y:r.top+r.height/2};return ae}
  const K=PAD.keep&&PAD.keep.id===id?PAD.keep:null;let f=null;
  if(K){f=items.includes(K.el)?K.el:items.find(e=>padSig(e)===K.sig)||null;
    if(!f){let bs=1e9;for(const e of items){const r=e.getBoundingClientRect(),d=Math.hypot(r.left+r.width/2-K.x,r.top+r.height/2-K.y);if(d<bs){bs=d;f=e}}}}
  if(!f){const s1=id==='title'?$('start1'):id==='lvl'?$('card0'):null;f=s1&&items.includes(s1)?s1:padFirstContent($(id),items)}
  if(f){f.focus({preventScroll:true});const r=f.getBoundingClientRect();PAD.keep={id,el:f,sig:padSig(f),x:r.left+r.width/2,y:r.top+r.height/2}}return f}
function padCycle(root,sel,step){const tb=[...root.querySelectorAll(sel)].filter(b=>!b.disabled&&!b.hidden&&b.offsetParent!==null);if(tb.length<2)return false;
  const on=b=>b.classList.contains('on')||b.getAttribute('aria-pressed')==='true'||b.getAttribute('aria-selected')==='true';
  let ci=tb.findIndex(on);if(ci<0)ci=Math.max(0,tb.indexOf(document.activeElement));const nx=tb[(ci+step+tb.length)%tb.length];
  nx.click();setTimeout(()=>{const it=padItems(root),f=sel===PADSUBS?(it.find(e=>e.getBoundingClientRect().top>nx.getBoundingClientRect().bottom-2)||it[0]):padFirstContent(root,it);PAD.keep=null;if(f)f.focus({preventScroll:true})},40);return true}
function padScroll(root,ry,dt){if(Math.abs(ry)<.3)return;const can=e=>e&&e.scrollHeight>e.clientHeight+4&&/(auto|scroll)/.test(getComputedStyle(e).overflowY);
  let t=[...root.querySelectorAll('.pc-perk-detail,#kapDet,.m2k-det,.nbp-panel,#lvl .level-build,.pane:not([hidden]),.mpane:not([hidden])')].find(e=>e.offsetParent!==null&&can(e));
  if(!t){let e=document.activeElement;while(e&&e!==document.body&&!can(e))e=e.parentElement;if(can(e))t=e}if(!t&&can(root))t=root;
  if(t)t.scrollTop+=Math.sign(ry)*(Math.abs(ry)-.3)/.7*dt*1300}
// 14.11.2026: kursor w grze = nowy grot z menu z cienka jasna obwodka (lepiej widoczny na mapie).
// 13.11.2026: kursor pada w menu (jak w konsolowych wersjach wielu gier): lewa gałka przesuwa sztylet, A klika to, co pod nim.
// Element pod kursorem dostaje fokus pada (złote podświetlenie), więc A, legenda i znaczki działają bez zmian. Krzyżak nadal skacze po przyciskach.
const PCUR={x:innerWidth/2,y:innerHeight/2,el:null,last:0,show:false,hov:null,src:'assets/ui/09ec512dc3c0387166c377318f86878d62e4c4b39f2d081fb32b9a8075d99898.png'};
{const st=document.createElement('style');st.textContent="#padCur{position:fixed;left:0;top:0;z-index:2147483050;width:calc(40 * min(.05981vw,.10627vh));height:auto;pointer-events:none;filter:drop-shadow(0 2px 3px #000c);will-change:transform}#padCur[hidden],body:not(.padlast) #padCur{display:none}"+
 "body,body *{cursor:url(assets/ui/f2bdfe0d27c4a8f08d3ffa8134a8a68bff08b21b4d9738ab1163dc0abff798b6.png) 1 1,auto!important}body canvas#gl{cursor:url(assets/ui/fc21d21915564f152d019ed9b75b358a75419b3be310550a73c1dc943825f24e.png) 3 3,crosshair!important}";document.head.append(st)}
function padCurPark(){const a=document.activeElement;if(a&&a!==document.body){const r=a.getBoundingClientRect();PCUR.x=r.left+r.width/2;PCUR.y=r.top+r.height/2}if(PCUR.el)PCUR.el.hidden=true;PCUR.show=false;padCurHover(null)}
// 13.11.2026 (poprawka): kursor ma własną pętlę klatek (requestAnimationFrame), niezależną od pętli gry, więc porusza się płynnie.
// Najechanie NIE przenosi fokusu ani nie wysyła zdarzeń najechania (w menu rozdziałów wybierały mapę); tylko złote podświetlenie.
// A klika element pod kursorem (padNav). Suwak: A chwyta, gałka zmienia wartość.
function padCurHover(b){if(b===PCUR.hov)return;PCUR.hov=b;padMark()}/* tylko podświetlenie: zdarzenia najechania wybierały mapę bez A */
function padCurLoop(now){requestAnimationFrame(padCurLoop);const dt=Math.min(.05,(now-(PCUR.last||now))/1000);PCUR.last=now;
  const mid=padPrio()&&!PADASK&&!PAD.grab?padMenuId():null;if(!mid||mid==='notice'||mid==='recovery')return;
  let g=null;try{g=[...navigator.getGamepads()].find(p=>p&&p.connected)||null}catch(e){}if(!g)return;
  const [x,y]=padDz(g.axes[0]||0,g.axes[1]||0,.2);if(!x&&!y)return;const root=$(mid);if(!root)return;
  if(!PCUR.el){PCUR.el=document.createElement('img');PCUR.el.id='padCur';PCUR.el.src=PCUR.src;PCUR.el.alt='';PCUR.el.setAttribute('aria-hidden','true');document.body.append(PCUR.el)}
  if(!PCUR.show){PCUR.show=true;PCUR.el.hidden=false}
  const m=Math.hypot(x,y),sp=.36*(380+1500*m*m)*Math.max(.6,Math.min(innerWidth,innerHeight*16/9)/1600);
  PCUR.x=Math.max(2,Math.min(innerWidth-2,PCUR.x+x*sp*dt));PCUR.y=Math.max(2,Math.min(innerHeight-2,PCUR.y+y*sp*dt));
  PCUR.el.style.transform='translate3d('+PCUR.x.toFixed(1)+'px,'+PCUR.y.toFixed(1)+'px,0) translate(-50%,-50%)';
  const t=document.elementFromPoint(PCUR.x,PCUR.y),b=t&&t.closest('button,summary,input,label,.rng,[tabindex]:not([tabindex="-1"])');
  padCurHover(b&&root.contains(b)&&!b.disabled?b:null)}
requestAnimationFrame(padCurLoop);
// 13.11.2026: START na ekranie przygotowania pyta, czy rozpocząć noc (A/START — tak, B — nie, lewo/prawo — wybór)
let PADASK=null;
function padAskOpen(){if(PADASK)return;const T=(p,e)=>EN?e:p,d=document.createElement('div');d.id='padAsk';d.setAttribute('role','alertdialog');d.setAttribute('aria-modal','true');
  d.innerHTML='<div class="pa-box"><p class="pa-q">'+T('Rozpocząć noc?','Start the night?')+'</p><div class="pa-btns"><button type="button" class="pa-yes">'+T('Tak, ruszam','Yes, begin')+'</button><button type="button" class="pa-no">'+T('Jeszcze nie','Not yet')+'</button></div></div>';
  if(!$('padAskSt')){const st=document.createElement('style');st.id='padAskSt';st.textContent="#padAsk{position:fixed;inset:0;z-index:2147483100;display:grid;place-items:center;background:#05030499}#padAsk .pa-box{min-width:min(520px,80vw);padding:28px 36px 30px;background:linear-gradient(160deg,#241a1f,#100c0e);border:1px solid #b08a4a99;box-shadow:0 0 0 1px #000,0 20px 60px #000c;text-align:center}#padAsk .pa-q{margin:0 0 22px;font:600 30px/1.2 Cinzel,Georgia,serif;letter-spacing:.06em;color:#ecd6a6}#padAsk .pa-btns{display:flex;gap:16px;justify-content:center}#padAsk button{min-width:180px;padding:12px 22px;font:600 18px/1 Cinzel,Georgia,serif;letter-spacing:.06em;color:#d9c8a6;background:#16101399;border:1px solid #6d5a3e;cursor:pointer}#padAsk button.on{color:#fff0cf;background:linear-gradient(145deg,#572632,#2b161c);border-color:#e8c16f;box-shadow:0 0 14px #e3bb7855}";document.head.append(st)}
  document.body.append(d);PADASK={el:d,sel:0};const upd=()=>{d.querySelector('.pa-yes').classList.toggle('on',PADASK.sel===0);d.querySelector('.pa-no').classList.toggle('on',PADASK.sel===1)};PADASK.upd=upd;upd();
  d.querySelector('.pa-yes').onclick=()=>padAskClose(true);d.querySelector('.pa-no').onclick=()=>padAskClose(false);d.addEventListener('pointermove',e=>{const b=e.target.closest('button');if(b&&PADASK){PADASK.sel=b.classList.contains('pa-yes')?0:1;upd()}});try{play('ui',0)}catch(e){}}
function padAskClose(go){if(!PADASK)return;PADASK.el.remove();PADASK=null;if(go){const b=$('prepGo');if(b&&!b.disabled)b.click()}}
function padNav(id,dt,pr,g){
  if(PADASK){if(id!=='prep'){padAskClose(false);return}if(pr(14)||pr(15)||pr(2)){PADASK.sel=PADASK.sel?0:1;PADASK.upd()}if(pr(9))padAskClose(true);else if(pr(0))padAskClose(PADASK.sel===0);else if(pr(1))padAskClose(false);return}
  const root=$(id);if(!root)return;const items=padItems(root);if(!items.length)return;
  let i=items.indexOf(padKeep(id,items));if(i<0)return;
  const cur=items[i];
  let dir=0,hor=0;const lx=g.axes[0]||0,ly=g.axes[1]||0;
  const sk=!!PAD.grab,up=PAD.cur[12]||sk&&ly<-.6,dn=PAD.cur[13]||sk&&ly>.6,lf=PAD.cur[14]||sk&&lx<-.6,rt=PAD.cur[15]||sk&&lx>.6;/* 13.11.2026: lewa gałka steruje kursorem (padCurLoop); krzyżak skacze po przyciskach; gałka zmienia suwak tylko po chwyceniu A */
  const d=up?-1:dn?1:lf?-2:rt?2:0;
  if(d===0){PAD.navD=0;PAD.nav=0}else{PAD.nav-=dt;if(d!==PAD.navD||PAD.nav<=0){PAD.nav=PAD.navD===d?.16:.4;PAD.navD=d;if(d===1||d===2)dir=1;else dir=-1;hor=Math.abs(d)===2}}
  const grabOff=()=>{PAD.grab=null;for(const e of document.querySelectorAll('.rng.grab'))e.classList.remove('grab')};
  if(PAD.grab&&PAD.grab!==cur)grabOff();
  if(dir){if(PAD.grab===cur||cur.type==='range'&&hor){if(hor){cur.value=String(Math.max(+cur.min,Math.min(+cur.max,+cur.value+dir*Math.max(5,+cur.step||0))));/* 13.11.2026: krok suwaka co najmniej jego step; przy step 10 krok 5 zaokrąglał się w górę i nie dało się zmniejszyć (Wielkość napisów) */cur.dispatchEvent(new Event('input',{bubbles:true}));cur.dispatchEvent(new Event('change',{bubbles:true}))}}
    else{navMove(id,d===1?'d':d===-1?'u':d===2?'r':'l',true);padCurPark()}}
  if(pr(0)&&!PAD.grab&&PCUR.show&&PCUR.hov&&root.contains(PCUR.hov)){const h=PCUR.hov,ri=h.matches('input[type=range]')?h:h.querySelector?.('input[type=range]');if(ri){ri.focus({preventScroll:true});PAD.grab=ri;ri.parentNode?.classList.add('grab')}else{h.focus({preventScroll:true});h.click()}return}
  if(pr(0)){if(cur.type==='range'){if(PAD.grab===cur)grabOff();else{PAD.grab=cur;if(cur.parentNode)cur.parentNode.classList.add('grab')}}else cur.click()}
  if(pr(1)&&PAD.grab){grabOff();return}
  if(pr(1)&&pcMenuBack&&pcMenuBack())return;
  // LB / RB: przełączanie zakładek w Opcjach i Instrukcji
  // LB / RB: górne zakładki; LT / RT: podzakładki (strony); prawa gałka: przewijanie opisów
  // Back (View): z każdego menu poza grą otwiera Opcje; B wraca tam, skąd przyszliśmy
  if(pr(8)&&['title','prep','kap','manual'].includes(id)){$('optsBtn').click();PAD.fresh=true;return}
  if(pr(4)||pr(5))padCycle(root,PADTABS,pr(5)?1:-1);
  if(pr(6)||pr(7))padCycle(root,PADSUBS,pr(7)?1:-1);
  padScroll(root,g.axes[3]||0,dt);
  if(pr(1)){if(id==='pause')togglePause(false);else if(id==='shop')closeShop();else if(id==='opts')$('optsBack').click();else if(id==='manual')$('manBack').click();else if(id==='conf')$('confNo').click();else if(id==='prep')$('prepBack').click();else if(id==='kap')closeKap();else if(id==='end')$('menuBtn').click();else if(id==='title'&&$('orient').classList.contains('pc-menu')&&!$('title').classList.contains('pc-home'))$('title').querySelector('.pc-home-button')?.click()}
  if(pr(9)){if(id==='prep'){const b=$('prepGo');if(b&&!b.disabled)padAskOpen()}else if(id==='shop')closeShop();else if(id==='title'&&$('orient').classList.contains('pc-menu')&&!$('title').classList.contains('pc-home')){const b=$('premiumPrepare');if(b&&b.offsetParent!==null&&!b.disabled)b.click()}}
}
function padMark(){for(const e of document.querySelectorAll('.pf'))e.classList.remove('pf');if(!PAD.menu||!document.body.classList.contains('padnav'))return;if(PCUR.show){const h=PCUR.hov;if(h){const ri=h.matches('input[type=range]')?h:null;(ri?ri.parentNode:h.matches('input[type=checkbox]')?(h.closest('label')||h):h).classList.add('pf')}return}const a=document.activeElement,root=$(PAD.menu);if(!a||!root||!root.contains(a))return;const t=a.type==='range'?a.parentNode:a.type==='checkbox'?(a.closest('label')||a):a;t.classList.add('pf')}
let INPUT_LAST='';window.addEventListener('keydown',()=>{INPUT_LAST='k';document.body.classList.remove('padlast')},true);for(const ev of ['pointerdown','mousedown'])window.addEventListener(ev,()=>{INPUT_LAST='m';document.body.classList.remove('padlast')},true);
function padTick(dt){try{padTick0(dt)}finally{MPCLK=false}}
function padTick0(dt){
  let g=null,g2=null;try{const l=navigator.getGamepads?navigator.getGamepads():[];for(const p of l)if(p&&p.connected){if(!g)g=p;else{g2=p;break}}}catch(e){}
  {const pn=(g?1:0)+(g2?1:0);if(pn<(PAD.n||0)&&S&&S.phase==='play'&&!S.paused&&(INPUT_LAST==='p'||pl2)){togglePause(true);if(S.paused)padLostMsg(true)}PAD.n=pn}
  {const mt=S?S.mpTurn||0:0;if(mt!==PAD.mpT){PAD.mpT=mt;PAD.lock=.4;PAD.fresh=true}}const sw=!!(g2&&pl2&&S&&S.choosing&&S.mpTurn===2);if(sw){const tg=g;g=g2;g2=tg}MPCLK=sw;pad2Tick(g2);PAD.prev=PAD.cur;PAD.g=g;
  {const pp=!!g;if(pp!==PAD.pp){PAD.pp=pp;padPrioSet(pp)}}
  if(!g){PAD.cur=[];PAD.x=PAD.y=0;PAD.atk=PAD.blk=PAD.skillHeld=PAD.skillConsumed=false;if(document.body.classList.contains('padnav')){/* 813: pad odlaczony = zdejmij jego zlote zaznaczenie, zeby nie zostawalo na ekranie */document.body.classList.remove('padnav','padlast');for(const e of document.querySelectorAll('.pf'))e.classList.remove('pf')}return}
  PAD.cur=g.buttons.map(b=>!!b&&(b.pressed||b.value>.5));if(PAD.cur.some(Boolean)){INPUT_LAST='p';document.body.classList.add('padlast','padnav')}
  // krzyżak w nietypowych padach: oś hat (axes[9]) albo osie 6/7
  if(g.mapping!=='standard'||g.buttons.length<16){const ax=g.axes||[];let u=0,d=0,l=0,r=0;
    if(ax.length>9&&Math.abs(ax[9])<=1.01){const v=Math.round((ax[9]+1)*3.5);u=v===0||v===1||v===7;r=v===1||v===2||v===3;d=v===3||v===4||v===5;l=v===5||v===6||v===7}
    else if(ax.length>7&&(Math.abs(ax[6])>.5||Math.abs(ax[7])>.5)&&Math.abs(ax[6])<=1.01){l=ax[6]<-.5;r=ax[6]>.5;u=ax[7]<-.5;d=ax[7]>.5}
    if(u||d||l||r){PAD.cur[12]=PAD.cur[12]||!!u;PAD.cur[13]=PAD.cur[13]||!!d;PAD.cur[14]=PAD.cur[14]||!!l;PAD.cur[15]=PAD.cur[15]||!!r}}
  const pr=i=>PAD.cur[i]&&!PAD.prev[i];
  if(!PAD.on&&PAD.cur.some(Boolean)){PAD.on=true;document.body.classList.add('padnav');const k=$('keysPad');if(k)k.hidden=false}
  if(PAD.cur.some(Boolean)){try{if(AC&&AC.state==='suspended'&&!(S&&S.paused))acResume()}catch(e){}}
  const mid=padMenuId();setTimeout(padMark,0);padHintTick(mid,dt);if(mid!==PAD.menu){if(padPrio())padHoverRewrite();PAD.menu=mid;PAD.lock=.4;PAD.fresh=true;PAD.grab=null;for(const e of document.querySelectorAll('.rng.grab'))e.classList.remove('grab')}if(PAD.lock>0)PAD.lock-=dt;
  // wstęp fabularny
  if(S&&S.intro){PAD.x=PAD.y=0;PAD.atk=PAD.blk=false;if(INTRO)INTRO.pad=!!(PAD.cur[0]||PAD.cur[1]||PAD.cur[2]);if(pr(9)&&INTRO)introEnd();return}
  // menu / sklep / wybór umiejętności / koniec
  if(mid){PAD.x=PAD.y=0;PAD.atk=PAD.blk=false;
    if(PAD.lock>0)return;
    if(PAD.fresh){PAD.fresh=false;PAD.keep=null;const ae0=document.activeElement,keep0=$(mid).contains(ae0)&&ae0!==$(mid)&&!ae0.disabled&&ae0.offsetParent!==null&&!padIsTab(ae0)?ae0:null;const f=keep0||(mid==='lvl'&&$('card0')&&!$('card0').disabled?$('card0'):null)||(mid==='title'&&$('orient').classList.contains('pc-menu')&&!$('title').classList.contains('pc-home')?$('title').querySelector('.premium-selected:not(:disabled)'):null)||(mid==='title'&&$('start1')&&$('start1').offsetParent!==null&&!$('start1').disabled?$('start1'):null)||padFirstContent($(mid),padItems($(mid)));if(f)f.focus({preventScroll:true});return}
    if(mid==='lvl'){const ready=performance.now()>=levelReadyAt;if(pr(2)){const d=document.querySelector('#lvl .level-build');if(d)d.open=!d.open;return}if(!ready&&(pr(0)||pr(3))){play('empty',0);return}if(pr(3)){rerollLevelCards();return}}
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
// 13.11.2026: pad ma pierwszeństwo w nawigacji po menu, gdy jest podłączony. Mysz nie przejmuje fokusu ani podglądów,
// :hover jest wyłączony (klasa padprio na <html>), a klik myszy nie zdejmuje znacznika pada. Klik nadal działa.
const padPrio=()=>document.documentElement.classList.contains('padprio');
function padPrioSet(on){document.documentElement.classList.toggle('padprio',!!on);if(on)padHoverRewrite()}
function padHoverRewrite(){const M=':where(:root:not(.padprio) *)';const fix=rules=>{for(const r of rules){try{if(!r.selectorText){if(r.cssRules)fix(r.cssRules);continue}const t=r.selectorText;if(!t.includes(':hover')||t.includes('padprio'))continue;r.selectorText=t.replace(/:hover(?![\w-])/g,':hover'+M)}catch(e){}}};for(const ss of document.styleSheets){try{fix(ss.cssRules)}catch(e){}}}
addEventListener('gamepadconnected',()=>padPrioSet(true));addEventListener('gamepaddisconnected',()=>setTimeout(()=>{try{padPrioSet([...navigator.getGamepads()].some(p=>p&&p.connected))}catch(e){padPrioSet(false)}},50));
addEventListener('mousedown',()=>{if(!padPrio())document.body.classList.remove('padnav')},true);
// kursor myszy chowa się, gdy grasz padem; wraca, gdy ruszysz myszą
{let mx=0;addEventListener('mousemove',e=>{mx+=Math.abs(e.movementX||0)+Math.abs(e.movementY||0);if(mx>12){mx=0;document.body.classList.remove('padlast')}},{passive:true});setInterval(()=>{mx=0},400)}
// podpowiedzi przycisków pada w menu (13.11.2026): znaczki LB/RB, LT/RT, B, X, Y, ☰ przy samych kontrolkach
// oraz stały pasek legendy u dołu (od 13.11.2026 wieczorem). Pozycja liczona z prostokąta kontrolki; strona, na której znaczek nic nie zasłania.
// 13.11.2026: znaczki pada jako obrazki (arkusz autora, metalowe tarcze w stylu gry); [adres, szerokość/wysokość]
const PADICON={A:["assets/ui/62b501663682a1a1c58680844ae5a2b3319f97ebc1baa06a04a20175160e9d95.webp",0.98],B:["assets/ui/a17afd0a6b6dcba5fcdb2c88d8aba4ebaafdffa759f24f924a5bde96810037f1.webp",0.98],X:["assets/ui/3885927b9a32f7ecae1254c91deae863bfe67dae5463e8b5863dbc557b011ea0.webp",0.98],Y:["assets/ui/092b0c1a385b25f28904e5b9149ec048f69abbbe7704acdd45a8553973cabf32.webp",0.98],LB:["assets/ui/74bf58bbb8fcb18469e3d1f12be2a9f437d79e2ad943ecf6abfd339012a2aa35.webp",1.79],RB:["assets/ui/881d4b70a213b5231bbf79218110d7c37f38408444968552a68a30e46f5c8af2.webp",1.79],LT:["assets/ui/a52cf5ace48319829c3311e3ecd1815ad5bdf439fe5182126ef309f442fa751e.webp",1.00],RT:["assets/ui/33d7c9ae5f73f677e46cccc988d9f823fb7e212da3c96d5450b9f2cb2679d946.webp",1.01],MENU:["assets/ui/eb938bd3b72606960b9a0b2d20ca752bec77b36a298572d506ad4a2d3b47e00f.webp",0.98],VIEW:["assets/ui/941f5400856a32849dba12350c29eb7ea67fedde27322420d9832dc2dba45c51.webp",0.99],DPAD:["assets/ui/3dbd44fb2bd67bbbc669a08332c84ac7887175d7045bbaa73f83ff42993f69aa.webp",0.99]};
let PADHINT=null,PADHT=0;
// 13.11.2026: jedno wspólne podświetlenie zaznaczenia pada (złota ramka z poświatą) na każdym elemencie,
// na który wchodzi pad. Wiele starszych reguł miało podświetlenie tylko dla myszy/klawiatury, a dla pada żadne.
{const Z=':is('+'#orient'.repeat(60)+',body)',st=document.createElement('style');st.id='pad-focus';st.textContent=
`html.padprio body.padnav ${Z} .pf,html.padprio body.padnav .pf{outline:2px solid #e8c16f!important;outline-offset:2px!important;box-shadow:0 0 0 1px #000c,0 0 16px 2px #e3bb7870!important;filter:brightness(1.12)!important}
html.padprio body.padnav ${Z} label.pf,html.padprio body.padnav ${Z} .rng.pf{outline-offset:4px!important}`;document.head.append(st)}
// 13.11.2026: przycisk „Wróć” widoczny także przy padzie (znaczek B obok); zastępuje ukrywanie z rundy 261 w CSS
{const st=document.createElement('style');st.textContent="html body.padlast #orient#orient#orient#orient .backar,html body.padlast #orient#orient#orient#orient :is(#prep,#opts,#manual)>.backar{display:block!important}";document.head.append(st)}
function padHintTick(mid,dt){if(PCUR.el&&(!mid||PADASK)&&!PCUR.el.hidden){PCUR.el.hidden=true;PCUR.show=false}PADHT-=dt;if(PADHT>0)return;PADHT=.15;
  const show=!PADASK&&!!mid&&mid!=='notice'&&mid!=='recovery'&&padPrio()&&document.body.classList.contains('padlast');
  if(!PADHINT){if(!show)return;PADHINT=document.createElement('div');PADHINT.id='padHints';PADHINT.setAttribute('aria-hidden','true');document.body.append(PADHINT);
    const st=document.createElement('style');st.textContent="#padHints{--u:min(.05981vw,.10627vh);position:fixed;inset:0;z-index:2147483000;pointer-events:none}#padHints[hidden]{display:none}#padHints b{position:absolute;display:grid;place-items:center;box-sizing:border-box;height:calc(32 * var(--u));min-width:calc(32 * var(--u));padding:0 calc(7 * var(--u));border-radius:calc(16 * var(--u));background:radial-gradient(circle at 50% 35%,#3a2a2e,#160f12 75%);border:calc(1.5 * var(--u)) solid #c8a05a;box-shadow:0 0 0 calc(1 * var(--u)) #000a,0 calc(2 * var(--u)) calc(6 * var(--u)) #000c;color:#f1d79a;font:700 calc(15 * var(--u))/1 Cinzel,Georgia,serif;letter-spacing:.02em;white-space:nowrap}#padHints b.ic{display:block;background:none;border:0;box-shadow:none;padding:0;border-radius:0;min-width:0}#padHints b.ic img{display:block;width:100%;height:100%;filter:drop-shadow(0 calc(1 * var(--u)) calc(2 * var(--u)) #000d)}#padHints .leg{position:absolute;display:flex;align-items:center;gap:calc(16 * var(--u));padding:calc(5 * var(--u)) calc(14 * var(--u));background:#0d090a73;border:calc(1 * var(--u)) solid #b08a4a3a;border-radius:calc(3 * var(--u));font:600 calc(12.5 * var(--u))/1 Cinzel,Georgia,serif;letter-spacing:.04em;color:#e9dcc2e6;text-shadow:0 1px 2px #000;white-space:nowrap}#padHints .leg span{display:flex;align-items:center;gap:calc(6 * var(--u));height:calc(20 * var(--u))}#padHints .leg img{height:100%;width:auto;display:block}html.padprio body.padlast,html.padprio body.padlast *{cursor:none!important}html.padprio body.padlast #lvl .hint{visibility:hidden}";document.head.append(st)}
  PADHINT.hidden=!show;if(!show)return;
  const root=$(mid);if(!root){PADHINT.innerHTML='';return}
  const vis=e=>e&&!e.hidden&&!e.disabled&&e.offsetParent!==null&&e.getBoundingClientRect().width>2;
  const u=Math.min(innerWidth*.0005981,innerHeight*.0010627),gap=8*u,H=26*u;
  // przeszkody: widoczne przyciski i elementy z własnym tekstem w aktywnym menu
  const obs=[];for(const e of root.querySelectorAll('button,input,summary,h1,h2,h3,p,span,strong,small,img,label')){if(!vis(e))continue;const r=e.getBoundingClientRect();if(r.width>innerWidth*.8&&r.height>innerHeight*.5)continue;obs.push([e,r])}
  const out=[],placed=[];
  const hit=(x,y,w,h,own)=>x<2||y<2||x+w>innerWidth-2||y+h>innerHeight-2||placed.some(q=>x<q[0]+q[2]+2&&q[0]<x+w+2&&y<q[1]+q[3]+2&&q[1]<y+h+2)||obs.some(([e,r])=>{if(own.includes(e)||e.contains(own[0])||!(x<r.right&&r.left<x+w&&y<r.bottom&&r.top<y+h))return false;const t=document.elementFromPoint((Math.max(x,r.left)+Math.min(x+w,r.right))/2,(Math.max(y,r.top)+Math.min(y+h,r.bottom))/2);return !!t&&(t===e||e.contains(t)||t.contains(e))});
  const put=(txt,el,sides,own,tr)=>{if(!vis(el))return;let r=el.getBoundingClientRect();if(tr){try{const g=document.createRange();g.selectNodeContents(el);const q=g.getBoundingClientRect();if(q.width>2)r=q}catch(e){}}const top=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);if(top&&!root.contains(top))return;const ic=PADICON[txt],w=ic?H*ic[1]:txt.startsWith('<')?H*1.35:Math.max(H,(txt.length*11+14)*u);own=own||[el];
    for(const sd of sides){let x,y;if(sd==='l'){x=r.left-gap-w;y=r.top+r.height/2-H/2}else if(sd==='r'){x=r.right+gap;y=r.top+r.height/2-H/2}else if(sd==='t'){x=r.left+r.width/2-w/2;y=r.top-gap-H}else if(sd==='b'){x=r.left+r.width/2-w/2;y=r.bottom+gap}else if(sd==='in'){x=r.right-w-gap;y=r.top+r.height/2-H/2}
      if(!hit(x,y,w,H,own)){placed.push([x,y,w,H]);out.push('<b'+(ic?' class="ic"':'')+' style="left:'+x.toFixed(1)+'px;top:'+y.toFixed(1)+'px;'+(ic?'width:'+w.toFixed(1)+'px;height:'+H.toFixed(1)+'px':'')+'">'+(ic?'<img src="'+ic[0]+'" alt="" style="height:'+H.toFixed(1)+'px">':txt)+'</b>');return}}};
  const pair=(sel,a,b)=>{const tb=[...root.querySelectorAll(sel)].filter(vis);if(tb.length<2)return;const f=tb[0].getBoundingClientRect(),l=tb[tb.length-1].getBoundingClientRect(),hor=Math.abs(f.top-l.top)<f.height/2;
    if(hor){put(a,tb[0],['l','t'],tb);put(b,tb[tb.length-1],['r','t'],tb)}else{put(a,tb[0],['t','l','r'],tb);put(b,tb[tb.length-1],['b','l','r'],tb)}};
  // 13.11.2026: stały pasek legendy u dołu po prawej (krzyżak, A, B, View, Start); tylko przyciski, które w tym menu coś robią
  {const home=mid==='title'&&$('title').classList.contains('pc-home'),L=[['DPAD',EN?'Select':'Wybierz'],['A',EN?'Confirm':'Zatwierdź']];
   const b={pause:EN?'Resume':'Wznów',shop:EN?'Close':'Zamknij',end:'Menu',opts:EN?'Back':'Wróć',manual:EN?'Back':'Wróć',prep:EN?'Back':'Wróć',kap:EN?'Back':'Wróć',conf:EN?'Back':'Wróć'}[mid]||(mid==='title'&&!home?(EN?'Back':'Wróć'):'');if(b)L.push(['B',b]);
   if(['title','prep','kap','manual'].includes(mid))L.push(['VIEW',EN?'Options':'Opcje']);
   const st={prep:EN?'Set out':'Wyrusz',pause:EN?'Resume':'Wznów',shop:EN?'Close':'Zamknij'}[mid]||(mid==='title'&&!home?(EN?'Prepare':'Przygotuj się'):'');if(st)L.push(['MENU',st]);
   // pozycja: zawsze prawy dolny róg (wybór autora 13.11.2026), z odstępem od ikon przeglądarki przy prawej krawędzi
   const LH=32*u;let lw=30*u;for(const [k,t] of L)lw+=20*u*PADICON[k][1]+(t.length*9.2+24)*u;
   const lx=innerWidth-lw-56*u,ly=innerHeight-LH-1*u;placed.push([lx,ly,lw,LH]);
   out.push('<div class="leg" style="right:'+(56*u).toFixed(1)+'px;bottom:'+(1*u).toFixed(1)+'px">'+L.map(([k,t])=>'<span><img src="'+PADICON[k][0]+'" alt="">'+t+'</span>').join('')+'</div>')}
  pair(PADTABS,'LB','RB');pair(PADSUBS,'LT','RT');
  // Back (View) otwiera Opcje: znaczek przy kole zębatym na wyborze rozdziału
  if(mid==='title'&&!$('title').classList.contains('pc-home'))put('VIEW',$('optsBtn'),['l','b','r'],null,false);
  if(mid==='lvl'){put('Y',$('rerollBtn'),['r','l','t','b']);const bd=root.querySelector('.level-build>summary')||root.querySelector('.level-build');if(bd)put('X',bd,['r','l','in'],null,true)}
  else if(mid==='pause'){put('MENU',$('resumeBtn'),['l','t','r','in'])}
  else{const bk=[...root.querySelectorAll('button')].filter(vis).find(e=>/(Back|Close)$/.test(e.id)||/^\s*(←|‹)/.test(e.textContent)||e.classList.contains('pc-back')||e.classList.contains('back'));if(bk)put('B',bk,['r','l','in'])}
  const html=out.join('');if(PADHINT.innerHTML!==html)PADHINT.innerHTML=html}
// ---- krótki samouczek: podpowiedzi w pierwszej nocy rozdziału I, tylko raz ----
function tutorialKey(){return 'pn_tut_s'}
function tutorialDone(){try{return localStorage.getItem(tutorialKey())==='1'}catch(e){return false}}
function finishTutorial(){try{localStorage.setItem(tutorialKey(),'1');localStorage.setItem('pn_tut_h',JSON.stringify(TUT_IDS))}catch(e){}TUT.ok=null;TUT.cur=null;$('tut').classList.remove('on');$('tutSkip').hidden=true}
// ---- Samouczek 14.11.2026: porady sterowane tym, co robi gracz (nie zegarem). Jedna naraz, znika po wykonaniu.
// Każda porada: when() = kiedy ją pokazać, done() = gracz już to zrobił (wtedy znika albo w ogóle się nie pokaże), max = po ilu sekundach odpuszcza.
// Ukończone porady pamięta 'pn_tut_h'; po rdzeniu (ruch…silny) ustawiany jest dawny znacznik 'pn_tut_s' (S.firstNight).
const TUT_CORE=['ruch','atak','unik','blok','parowanie','silny'],TUT_IDS=[...TUT_CORE,'karty','slot','marga','reakcja','zestaw','technika'];/* 22.11.2026: podpowiedzi nowych mechanik, raz */
const TUT={sid:null,cur:null,shown:0,gap:0,x0:null,ok:null,hv:0,blocks:0,gPrev:0};
function tutLoad(){if(TUT.ok)return TUT.ok;let a=null;try{a=JSON.parse(localStorage.getItem('pn_tut_h')||'null')}catch(e){}if(!Array.isArray(a))a=tutorialDone()?[...TUT_IDS]:[];return TUT.ok=new Set(a.filter(k=>TUT_IDS.includes(k)))}
function tutMark(id){const ok=tutLoad();if(ok.has(id))return;ok.add(id);try{localStorage.setItem('pn_tut_h',JSON.stringify([...ok]));if(TUT_CORE.every(k=>ok.has(k)))localStorage.setItem(tutorialKey(),'1')}catch(e){}}
function tutOpen(id){return HINTS_ENABLED&&!tutLoad().has(id)}
function tutActive(){return HINTS_ENABLED&&TUT_CORE.some(k=>!tutLoad().has(k))&&!isPort()}
function tutList(){const pd=PAD.on,key=a=>kbName(KB.map[a]),ok=tutLoad(),fin=id=>ok.has(id),near=r=>S.enemies.some(e=>!e.dead&&!(e.rise>0)&&e.type!=='wisp'&&Math.hypot(e.x-pl.x,e.y-pl.y)<r),
  si=(S.activeSlots||[]).findIndex(Boolean),sk0=si>=0?S.activeSlots[si]:null,slotKey=si<0?'':pd?'LT + '+['X','Y','B','A','RB','LS'][si]:si<4?key('s'+(si+1)):si===4?'G':'6';
 return [
 {id:'ruch',keys:pd?[EN?'Left stick':'Lewy drążek']:[key('up'),key('left'),key('down'),key('right')],name:EN?'Move':'Ruch',text:(EN?'Walk a few steps.':'Przejdź kilka kroków.'),max:40,when:()=>true,done:()=>Math.hypot(pl.x-TUT.x0[0],pl.y-TUT.x0[1])>30},
 {id:'atak',keys:pd?['RT']:[EN?'LMB':'LPM',key('atk')],name:EN?'Light attack':'Szybki atak',text:(EN?'Hit an enemy.':'Traf wroga.'),max:40,when:()=>near(110),done:()=>(S.dealt||0)>0},
 {id:'unik',keys:pd?['A']:[key('roll')],name:EN?'Dodge':'Unik',text:(EN?'Dodge when an enemy winds up. Red attacks can only be dodged.':'Odskocz, gdy wróg bierze zamach. Czerwonych ciosów nie da się zablokować.'),max:25,when:()=>S.t>45||S.enemies.some(e=>!e.dead&&Math.hypot(e.x-pl.x,e.y-pl.y)<80&&attackCue(e)),done:()=>S.actions.dodge>0},
 {id:'blok',keys:pd?['LB']:[EN?'RMB':'PPM',key('blk')],name:EN?'Block':'Blok',text:(EN?'Hold to stop a blow. It costs stamina.':'Przytrzymaj, aby zatrzymać cios. Kosztuje staminę.'),max:25,when:()=>(S.hitsT||0)>0||S.t>70,done:()=>TUT.blocks>0||(S.parries||0)>0},
 {id:'parowanie',keys:pd?['LB']:[EN?'RMB':'PPM',key('blk')],name:EN?'Parry':'Parowanie',text:EN?'Press block just before the blow lands. The enemy flashes bright as a warning.':'Wciśnij blok tuż przed trafieniem. Wróg błyska jasno, gdy bierze zamach.',max:30,when:()=>fin('blok')&&(TUT.blocks>=2||S.t>100),done:()=>(S.parries||0)>0},
 {id:'silny',keys:pd?['RB']:[key('heavy')],name:EN?'Heavy attack':'Silny atak',text:(EN?'Slower, stronger, breaks shields. Best right after a parry.':'Wolniejszy, mocniejszy, przebija tarcze. Najlepszy tuż po parowaniu.'),max:25,when:()=>fin('parowanie')||S.t>130,done:()=>TUT.hv>0},
 {id:'slot',keys:!slotKey?[]:[slotKey],name:sk0&&SK[sk0]?SK[sk0].name:(EN?'Skill':'Umiejętność'),text:(EN?'Use your new skill. You can rearrange slots in the pause menu.':'Użyj nowej umiejętności. Sloty zmienisz w pauzie.'),max:25,when:()=>!!sk0&&TUT_CORE.slice(0,2).every(fin),done:()=>((S.actions.skill||0)+(S.actions.shot||0))>0},
 {id:'reakcja',keys:[],name:EN?'Elemental reaction':'Reakcja żywiołów',text:EN?'Your two blade elements combined. Every pair has its own reaction: the card of the second element shows which.':'Dwa żywioły ostrza połączyły się. Każda para ma własną reakcję: pokazuje ją karta drugiego żywiołu.',max:7,when:()=>(S.rxN||0)>0&&S.t-(S.rxLast||-99)<20,done:()=>false},
 {id:'zestaw',keys:[],name:EN?'Style set':'Zestaw stylu',text:EN?'4 cards from one style branch switch on a small bonus, 7 the full set. Check it in the build view when levelling up.':'4 karty z jednej gałęzi stylu włączają małą premię, 7 pełny zestaw. Podgląd w rozwoju przy awansie.',max:7,when:()=>['def','off','wav'].some(b=>brHalf(b)),done:()=>false},
 {id:'technika',keys:[],name:EN?'Technique and status':'Technika i stan',text:EN?'Active techniques hit harder on enemies under a status: frozen, burning, poisoned, bleeding or stunned.':'Techniki aktywne biją mocniej we wrogów pod wpływem stanu: zmrożonych, płonących, zatrutych, krwawiących lub ogłuszonych.',max:7,when:()=>(S.skstN||0)>0,done:()=>false},
 {id:'marga',keys:pd?['Y']:[key('talk')],name:'Marga',text:EN?'Walk up to the merchant and spend your coins on upgrades.':'Podejdź do kupcowej i wydaj monety na ulepszenia.',max:25,when:()=>!!(S.merchant&&!S.merchant.dg&&S.merchant.state==='here'),done:()=>!S.merchant||Object.keys(S.bought||{}).length>0}];}
function tutShow(q){const t=$('tutText');t.textContent='';for(const k of q.keys){const b=document.createElement('kbd');b.textContent=k;t.appendChild(b)}const n=document.createElement('b');n.textContent=q.name;const d=document.createElement('span');d.className='tut-d';d.textContent=q.text;t.append(n,d);const c=$('pcTutCount');if(c)c.textContent=''}
function tutTick(dt){const h=$('tut'),off=()=>{$('tutSkip').hidden=true;h.classList.remove('on')};if(!HINTS_ENABLED||S.dg||S.train||STORYINTRO_ACTIVE()||isPort()){off();return}
 if(TUT.sid!==S){TUT.sid=S;TUT.cur=null;TUT.shown=0;TUT.gap=0;TUT.x0=[pl.x,pl.y];TUT.hv=0;TUT.blocks=0;TUT.gPrev=0;TUT.ok=null}
 const ok=tutLoad();if(TUT_IDS.every(k=>ok.has(k)||k==='karty')){off();return}
 if(pl.atk&&pl.atk.kind==='h')TUT.hv=1;{const g=pl.gHitT>0?1:0;if(g&&!TUT.gPrev)TUT.blocks++;TUT.gPrev=g}
 const steps=tutList();let q=TUT.cur?steps.find(s=>s.id===TUT.cur):null;
 if(!q){off();if(TUT.gap>0){TUT.gap-=dt;return}for(const s of steps){if(ok.has(s.id)||s.id==='karty')continue;if(s.done()){if(s.id!=='marga')tutMark(s.id);continue}if(CH!==1&&TUT_CORE.includes(s.id))continue;if(!s.when())continue;q=s;TUT.cur=s.id;TUT.shown=0;tutShow(s);break}if(!q)return}
 h.classList.add('on');$('tutSkip').hidden=false;TUT.shown+=dt;
 if((TUT.shown>=2.5&&q.done())||TUT.shown>=q.max){tutMark(q.id);TUT.cur=null;TUT.gap=1.2;h.classList.remove('on')}}

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
function errorReport(){return JSON.stringify({game:'Nightbrand',url:location.href.split('?')[0],userAgent:navigator.userAgent,quality:SETT.quality,qmode:SETT.qmode,fpsCap:SETT.fpsCap,gfx:GFX,errors:readErrors(),quietErrors:readQuietErrors()},null,2)}
$('copyErrors').onclick=async()=>{const report=errorReport();try{await navigator.clipboard.writeText(report);saveMsg((EN?'Error report copied.':'Skopiowano raport błędów.'))}catch(e){const t=document.createElement('textarea');t.value=report;t.setAttribute('aria-label',(EN?'Error report to copy':'Raport błędów do skopiowania'));$('pane-dat').appendChild(t);t.focus();t.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}if(ok)t.remove();saveMsg(ok?(EN?'Error report copied.':'Skopiowano raport błędów.'):(EN?'Copy the selected report manually.':'Zaznaczony raport skopiuj ręcznie.'))}};
function frameLimit(){return SETT.quality==='low'?.2:.5}
