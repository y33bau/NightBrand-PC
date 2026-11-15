// ===== Menu PC: usprawnienia 13.11.2026 (runda menu-usprawnienia). ?menu2=0 wylacza te warstwe.
// Zakres: przygotowanie (karta klasy, staly rzad klas, trudnosc na wierzchu, karty perkow/wyzwan/klatw),
// wybor rozdzialu (medale, opis, przelacznik trybu), menu glowne (wyzwanie dnia), Opcje (start na Grafice,
// pelny ekran, bez dotyku na PC, kasowanie zapisu oddzielone), pauza (Grafika), Kronika (siatka bestiariusza), Kaplica.
// Tylko prezentacja i przenoszenie istniejacych kontrolek; zasady gry, zapis i balans bez zmian.
{const st=document.createElement('style');st.id='nb2Base';st.textContent=`.nbk-beast.lk img{filter:brightness(0) invert(.34)}
.nb-tierbar{display:inline-block;width:9em;height:.42em;margin-left:.8em;vertical-align:middle;border:1px solid rgba(230,214,184,.3);background:linear-gradient(90deg,#c9a45a calc(var(--p,0)*100%),rgba(255,255,255,.08) 0)}
.nbk-group{margin:.9em 0 .2em;font:600 1em Cinzel,Georgia,serif;letter-spacing:.08em;color:#d9b876;text-align:left}
#pauseQuit p{margin:0}`;document.head.append(st)}
(()=>{
 const root=$('orient');if(!root.classList.contains('pc-menu')||new URLSearchParams(location.search).get('menu2')==='0')return;
 root.classList.add('nb2');if(!coarse)root.classList.add('nb2-pc');
 const T=(p,e)=>EN?e:p,mk=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
 const title=$('title'),prep=$('prep'),put=(el,text)=>{if(el&&el.textContent!==text)el.textContent=text};
 const CLS=[...'rkzdm'],medalRing=v=>v?MEDAL_C[v]:'rgba(230,214,184,.22)';

 // ---------- Przygotowanie ----------
 // Karta wybranej klasy (portret, przydomek, opis, wspolny poziom) nad stalym rzedem pieciu klas.
 function heroCard(){const pc=$('prepChar');if(!pc)return;const on=pc.querySelector('.nb-prep-class.on');if(!on)return;const id=on.dataset.hero,H=HEROES[id],q=prog();
  const lv=T('Poziom ','Level ')+q.lv+(q.lv>=PMAX?'':' · '+q.xp+' / '+PNEED(q.lv)+' XP');
  let card=pc.querySelector('.nb2-hero');
  if(!card){card=mk('div','nb2-hero');const im=mk('img','');im.alt='';card.append(im,mk('b',''),mk('small','nb2-ep'),mk('small','nb2-cls'),mk('p','nb2-desc'),mk('p','nb2-mot'),mk('small','nb2-lv'));pc.prepend(card)}
  const [im,nm,ep,cl,ds,mo,lvE]=card.children,src=PREMIUM_ASSETS['portret-'+H.art];if(im.getAttribute('src')!==src)im.src=src;
  put(nm,H.n);put(ep,H.ep);put(cl,H.cls);put(ds,on.querySelector(':scope>span:not(.hero-motive)')?.textContent||'');put(mo,H.mot||'');put(lvE,lv);
  for(const b of pc.querySelectorAll('.nb-prep-class')){const h=HEROES[b.dataset.hero];if(h){b.setAttribute('aria-label',h.n+', '+h.cls);b.setAttribute('aria-pressed',String(b.classList.contains('on')))}}}
 {const grid=prep.querySelector('.prepgrid');new MutationObserver(heroCard).observe(grid,{childList:true,subtree:true});heroCard()}
 // Sygnal, ze lista kart ma ciag dalszy ponizej.
 {const more=()=>{if(prep.hidden)return;for(const e of prep.querySelectorAll('.prepgrid>.prepbox:not(#prepChar)'))e.classList.toggle('nb2-more',e.scrollHeight>e.clientHeight+10&&e.scrollTop+e.clientHeight<e.scrollHeight-6)};
  prep.addEventListener('scroll',more,true);addEventListener('resize',more);new MutationObserver(()=>requestAnimationFrame(more)).observe(prep.querySelector('.prepgrid'),{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});new MutationObserver(()=>requestAnimationFrame(more)).observe(prep,{attributes:true,attributeFilter:['hidden']})}
 // Trudnosc: trzy przyciski i opis stale widoczne w stopce; nazwa rozdzialu jako podtytul naglowka.
 {const head=prep.querySelector('.premium-prep-head'),dest=prep.querySelector('.pc-prep-destination'),sw=$('diffSw'),cap=$('diffCap'),kicker=$('prepK');
  if(head&&dest&&sw&&cap&&kicker){const old=sw.closest('details');kicker.classList.add('nb2-sub');head.append(kicker);
   const box=mk('section','nb2-diff');box.setAttribute('aria-label',T('Trudność','Difficulty'));box.append(mk('h3','',T('Trudność','Difficulty')),sw,cap);dest.replaceWith(box);if(old)old.remove()}}

 // ---------- Wybor rozdzialu ----------
 const DESC=EN?['A village, a cemetery and the crypt beneath it. Boss: The Conjoined.','Dwarven mines and forges. Boss: Cumlin, the Possessed Dwarf King.','A rotting city of the rich. Boss: Morhad, Beast of a Thousand Slaughters.','The forest and Bleak Peak. Bosses: Leshy and Mother Striga.','Seat of the Holy Order. Bosses: the Arch-Judge Reckoner and the Creditor.','A river harbour, salt warehouses and the chained ferry to the capital. Boss: the Harbour Master.']
  :['Wioska, cmentarz i krypta pod nim. Boss: Zrost.','Krasnoludzkie kopalnie i kuźnie. Boss: Cumlin, Opętany Król Krasnoludów.','Zgniłe miasto bogaczy. Boss: Morhad, Bestia Tysiąca Rzezi.','Las i Łysa Góra. Bossowie: Leszy i Strzyga Matka.','Siedziba Zakonu. Bossowie: Arcysędzia Rachmistrz i Wierzyciel.','Rzeczny port, składy soli i przykuty prom do stolicy. Boss: Bosman.'];
 const banner=title.querySelector('.premium-banner'),caption=title.querySelector('.premium-caption'),facts=title.querySelector('.pc-destination-facts'),chDesc=mk('p','nb2-chdesc');
 if(caption)caption.after(chDesc);
 const medCell=facts&&facts.firstElementChild,medRow=mk('div','nb2-medrow');
 if(medCell){medCell.classList.add('nb2-medcell');put(medCell.querySelector('small'),T('Medale klas','Class medals'));
  for(const c of CLS){const it=mk('span','nb2-med'),im=mk('img','');im.alt='';im.src=PREMIUM_ASSETS['portret-'+HEROES[c].art];it.dataset.c=c;it.append(im);medRow.append(it)}medCell.append(medRow)}
 function journey2(){if(title.hidden)return;const sel=title.querySelector('.premium-selected'),ch=Number(sel?.id.slice(5))||1,locked=chLocked(ch);
  put(chDesc,DESC[ch-1]);if(medCell)medCell.classList.toggle('nb2-locked',locked);
  for(const it of medRow.children){const v=medalOf(it.dataset.c,ch),h=HEROES[it.dataset.c],tip=h.n+' ('+h.cls+'): '+(v?MEDAL_N[v]:T('brak medalu','no medal'));if(it.title!==tip){it.title=tip;it.style.setProperty('--ring',medalRing(v));it.classList.toggle('nb2-has',!!v)}}
  for(const i of CAMPAIGN){const b=$('start'+i);if(!b)continue;let m=b.querySelector('.nb2-meds');if(!m){m=mk('span','nb2-meds');m.setAttribute('aria-hidden','true');for(const c of CLS){const d=mk('i','');d.dataset.c=c;m.append(d)}b.append(m)}
   const key=CLS.map(c=>medalOf(c,i)).join('');if(m.dataset.k!==key){m.dataset.k=key;[...m.children].forEach((d,k)=>d.style.background=medalRing(+key[k]))}}}
 for(const [node,opt] of [[title.querySelector('.m2-right'),{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-status']}],[title,{attributes:true,attributeFilter:['hidden','class']}]])if(node)new MutationObserver(journey2).observe(node,opt);
 journey2();
 // „Tryb gry" jest przelacznikiem (dotad zmiana tylko w menu glownym).
 {const info=title.querySelector('.pc-journey-mode');if(info){const b=mk('button','pc-journey-mode nb2-mode');b.type='button';while(info.firstChild)b.append(info.firstChild);b.append(mk('span','nb2-mode-hint',T('zmień','change')));info.replaceWith(b);
   b.addEventListener('click',()=>{(STORYMODE?$('sArc'):$('sFab'))?.click();const sel=title.querySelector('.premium-selected'),ch=Number(sel?.id.slice(5))||1;if(chLocked(ch))$('start1')?.focus();setTimeout(()=>{journey2();b.focus()},0)})}}

 // ---------- Menu glowne ----------
 {const rail=title.querySelector('.premium-rail'),nav=title.querySelector('.premium-nav');
  if(rail&&nav){const b=mk('button','nb2-daily');b.type='button';const k=mk('small',''),v=mk('strong','');b.append(k,v);nav.after(b);
   const fill=()=>{if(title.hidden)return;const D=dayNight(),done=META.dy.done===D.key;put(k,T('Wyzwanie dnia','Daily challenge'));put(v,done?T('✓ Wygrane dzisiaj · wróć jutro','✓ Won today · come back tomorrow'):D.ruleN+' · '+HEROES[D.cls].n+' · +'+DAILY_ASH+T(' Popiołów',' Ashes'));b.classList.toggle('nb2-done',done)};
   b.addEventListener('click',()=>{KRONTAB=0;$('kronBtn')?.click()});new MutationObserver(fill).observe(title,{attributes:true,attributeFilter:['hidden','class']});fill()}}

 // ---------- Pauza ----------
 put($('pauseMenuBtn'),T('Porzuć noc','Abandon night'));{const q=$('pauseMenuBtn').style;q.setProperty('transform','scale(.8)','important');q.setProperty('margin-left','6vh','important');q.setProperty('opacity','.82','important')}// mniejszy i odsunięty od „Wróć do gry”
 {const pz=$('pause'),src=$('pane-gfx'),dst=pz.querySelector('.nbp-pane[data-pane="gfx"]');
  if(src&&dst){const home=()=>{const from=pz.hidden?dst:src,to=pz.hidden?src:dst;while(from.firstChild)to.append(from.firstChild)};new MutationObserver(home).observe(pz,{attributes:true,attributeFilter:['hidden']})}}

 // ---------- Opcje ----------
 $('optsBtn').addEventListener('click',()=>{document.querySelector('#opts .tab[data-tab="gfx"]')?.click()});
 if(!coarse){ // PC: bez wzmianek o telefonie i baterii (kod dotyku zostaje)
  for(const p of document.querySelectorAll('#pane-gfx .figcap')){const t=p.textContent;
   const n=t.replace('Auto: telefon i tablet dostają Średnią, komputer Wysoką.','Auto: na komputerze Wysoka.').replace('dla mocnych komputerów i tabletów','dla mocnych komputerów').replace('Niższy limit oszczędza baterię i może pomóc','Niższy limit może pomóc')
    .replace(/Auto: phones and tablets get Medium, (?:a )?computers? (?:gets? )?High\./i,'Auto: High on a computer.').replace(/A lower limit saves battery and (?:can|may) help/i,'A lower limit can help').replace('strong computers and tablets','strong computers');
   if(n!==t)p.textContent=n}}
 // Pelny ekran: przelacznik w Grafice. Wybor „W oknie" pamieta klucz nb_fs (goFull go szanuje).
 {const d=document.documentElement,can=!!(d.requestFullscreen||d.webkitRequestFullscreen)&&document.fullscreenEnabled!==false,host=document.querySelector('#pane-gfx .pc-brightness-tile')||$('pane-gfx');
  if(can&&host){const isFs=()=>!!(document.fullscreenElement||document.webkitFullscreenElement),lab=mk('p','figcap nb2-fslab',T('Tryb wyświetlania','Display mode')),row=mk('div','qrow');row.id='fsRow';row.setAttribute('role','group');row.setAttribute('aria-label',T('Tryb wyświetlania','Display mode'));
   const mkB=(on,text)=>{const b=mk('button','go alt',text);b.type='button';b.dataset.fs=on?'1':'0';b.addEventListener('click',()=>{try{localStorage.setItem('nb_fs',on?'1':'0')}catch(e){}try{if(on&&!isFs()){const r=(d.requestFullscreen||d.webkitRequestFullscreen).call(d);if(r&&r.catch)r.catch(()=>{})}else if(!on&&isFs())(document.exitFullscreen||document.webkitExitFullscreen).call(document)}catch(e){}setTimeout(sync,60)});return b};
   const sync=()=>{for(const b of row.children){const on=(b.dataset.fs==='1')===isFs();b.setAttribute('aria-pressed',String(on));b.classList.toggle('on',on)}};
   row.append(mkB(false,T('W oknie','Windowed')),mkB(true,T('Pełny ekran','Full screen')));const edge=host.querySelector(':scope>.pcg-edge');if(edge)edge.before(lab,row);else host.append(lab,row);
   for(const ev of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(ev,sync);sync()}}
 // Dane zapisu: najpierw postep i kopia, raport bledow nizej, kasowanie osobno na dole.
 {const pane=$('pane-dat'),copy=$('copyErrors'),clear=$('clearSave');
  if(pane&&copy&&clear){const zone=mk('section','nb2-danger');zone.append(mk('h3','',T('Usuwanie zapisu','Delete save')),mk('p','figcap',T('Usuwa rekordy, poziomy i odblokowane perki w obu trybach. Tego nie da się cofnąć.','Removes records, levels and unlocked perks in both modes. This cannot be undone.')),clear);pane.append(copy,zone)}}

 // ---------- Styl ----------
 const css=mk('style','');css.id='nb2Css';css.textContent=`/* NightBrand PC: usprawnienia menu 13.11.2026. ?menu2=0 wylacza. */
/* --- Przygotowanie: naglowek --- */
@N@ #prep #prepBack{width:auto!important;height:auto!important;min-height:0!important;padding:.95vh 1.9vh!important;border:1px solid var(--nbs-idle)!important;background:var(--nbs-cell)!important}
@N@ #prep #prepBack:hover{border-color:var(--nbs-hover)!important}
@N@ #prep .premium-prep-head{position:relative!important}
@N@ #prep .pc-prep-settings details{left:auto!important;right:0!important}
@N@ #prep .pc-prep-settings details>div{left:auto!important;right:0!important}
@N@ #prep .nb2-sub{position:absolute!important;left:0!important;right:0!important;bottom:-.4vh!important;margin:0!important;padding:0!important;text-align:center!important;font:500 max(12px,1.75vh)/1 Cinzel,Georgia,serif!important;letter-spacing:.22em!important;text-transform:uppercase!important;color:#c9a45a!important;background:none!important;border:0!important;pointer-events:none!important;display:block!important}
@N@ #prep #prepK.nb2-sub{display:none!important}
/* --- Przygotowanie: karta klasy i staly rzad klas --- */
@N@ #prep #prepChar{display:flex!important;flex-direction:column!important;gap:1.1vh!important;overflow:hidden auto!important}
@N@ #prep #prepChar>.premium-class-description{display:none!important}
@N@ #prep #prepChar>.nb2-hero{order:1!important;flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important;padding:1.2vh 1.4vh 1.3vh!important;background:var(--nbs-on)!important;border:1px solid var(--nbs-line)!important}
@N@ #prep .nb2-hero>img{flex:0 1 21vh!important;min-height:11vh!important;max-height:21vh!important;width:auto!important;max-width:100%!important;object-fit:contain!important;display:block!important}
@N@ #prep .nb2-hero>b{font:500 max(18px,3.3vh)/1.15 Cinzel,Georgia,serif!important;color:#fff0d5!important;margin-top:.5vh!important}
@N@ #prep .nb2-hero>.nb2-ep{font:600 calc(max(12px,2.05vh) * var(--nbts,1))/1.2 Grenze,Georgia,serif!important;color:#e8d6a8!important}
@N@ #prep .nb2-hero>.nb2-cls{font:500 max(11px,1.6vh)/1.3 Cinzel,Georgia,serif!important;letter-spacing:.16em!important;text-transform:uppercase!important;color:#c9a45a!important;margin-top:.2vh!important}
@N@ #prep .nb2-hero>.nb2-desc{margin:.9vh 0 0!important;font:400 calc(max(12px,1.62vh) * var(--nbts,1))/1.34 Grenze,Georgia,serif!important;color:#e6d6b8!important;text-align:center!important;hyphens:none!important}
@N@ #prep .nb2-hero>.nb2-mot{margin:.9vh 0 0!important;padding:.8vh 1.2vh 0!important;max-width:92%!important;border-top:1px solid rgba(201,164,90,.4)!important;font:italic 400 calc(max(12px,1.5vh) * var(--nbts,1))/1.35 Grenze,Georgia,serif!important;color:#cfc3a8!important;text-align:center!important;hyphens:none!important}
@N@ #prep .nb2-hero>.nb2-lv{margin-top:auto!important;padding-top:.8vh!important;font:400 calc(max(11px,1.38vh) * var(--nbts,1))/1.25 Grenze,Georgia,serif!important;color:#b9a98c!important}
@N@ #prep #prepChar>div:not(.nb2-hero){order:2!important;flex:none!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:.7vh!important;padding:0!important}
@N@ #prep #prepChar .nb-prep-class{order:0!important;grid-column:auto!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:.3vh!important;width:auto!important;min-width:0!important;height:auto!important;min-height:0!important;margin:0!important;padding:.5vh .3vh .6vh!important;border:1px solid var(--nbs-idle)!important;background:var(--nbs-cell)!important;box-shadow:none!important;cursor:pointer!important;opacity:1!important;overflow:hidden!important}
@N@ #prep #prepChar .nb-prep-class:hover{border-color:var(--nbs-hover)!important;background:var(--nbs-cellh)!important;filter:none!important}
@N@ #prep #prepChar .nb-prep-class.on{background:var(--nbs-on)!important;border-color:var(--nbs-line)!important;box-shadow:inset 0 -2px #c9a45a!important}
@N@ #prep #prepChar .nb-prep-class:is(:focus-visible,.pf){outline:2px solid var(--nbs-focus)!important;outline-offset:1px!important}
@N@ #prep #prepChar .nb-prep-class .premium-class-art{display:block!important;width:100%!important;height:6.4vh!important;max-height:none!important;object-fit:cover!important;object-position:center 12%!important;mask-image:none!important;-webkit-mask-image:none!important;opacity:.78!important}
@N@ #prep #prepChar .nb-prep-class.on .premium-class-art,@N@ #prep #prepChar .nb-prep-class:hover .premium-class-art{opacity:1!important}
@N@ #prep #prepChar .nb-prep-class b{display:block!important;font:500 max(11px,1.72vh)/1.1 Cinzel,Georgia,serif!important;color:#e6d6b8!important;text-align:center!important;white-space:nowrap!important;flex:none!important}
@N@ #prep #prepChar .nb-prep-class.on b{color:#fff0d5!important}
@N@ #prep #prepChar .nb-prep-class :is(small,span){display:none!important}
@N@ #prep #prepChar .nb-prep-class::after,@N@ #prep #prepChar .nb-prep-class::before{content:none!important;display:none!important}
/* --- Przygotowanie: karty perkow, wyzwan i klatw --- */
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL){display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-auto-rows:auto!important;gap:.8vh!important;align-content:start!important;padding:.2vh .3vh .6vh!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt{position:relative!important;display:grid!important;grid-template-columns:auto minmax(0,1fr)!important;grid-auto-rows:min-content!important;column-gap:1.1vh!important;row-gap:.25vh!important;align-content:start!important;align-items:start!important;justify-items:start!important;text-align:left!important;width:auto!important;min-width:0!important;height:auto!important;min-height:7.6vh!important;margin:0!important;padding:.95vh 1.2vh!important;border:1px solid var(--nbs-idle)!important;border-image:none!important;background:var(--nbs-cell)!important;box-shadow:none!important;border-radius:2px!important;opacity:1!important;cursor:pointer!important;font:400 calc(max(12px,1.55vh) * var(--nbts,1))/1.3 Grenze,Georgia,serif!important;color:#cdbd9e!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt::before,@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt::after{content:none!important;display:none!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt:not(:disabled):hover{border-color:var(--nbs-hover)!important;background:var(--nbs-cellh)!important;filter:none!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt.on{background:var(--nbs-on)!important;border-color:var(--nbs-line)!important;box-shadow:inset 0 0 0 1px rgba(110,48,62,.95),inset 0 0 22px rgba(127,52,69,.22)!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt:is(:focus-visible,.pf){outline:2px solid var(--nbs-focus)!important;outline-offset:1px!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt:disabled{cursor:default!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt:disabled>*{opacity:.5!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt>img{position:static!important;grid-column:1!important;grid-row:1/span 4!important;width:5.4vh!important;height:5.4vh!important;margin:0!important;inset:auto!important;transform:none!important;object-fit:contain!important;display:block!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt>:not(img){grid-column:2/-1!important;display:block!important;position:static!important;margin:0!important;padding:0!important;text-align:left!important;white-space:normal!important;max-width:100%!important;min-width:0!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt:not(:has(>img))>*{grid-column:1/-1!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt>*{word-break:normal!important;overflow-wrap:normal!important;hyphens:none!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt>b{font:500 max(14px,2.12vh)/1.18 Cinzel,Georgia,serif!important;color:#ead7b4!important;letter-spacing:.01em!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt.on>b{color:#fff0d5!important}
@N@ #prep :is(#prepPerks,#prepCh,#prepCurseL) .opt>span:not(.nb-rw),@N@ #prep #prepPerks .opt>small{font:400 calc(max(12px,1.55vh) * var(--nbts,1))/1.28 Grenze,Georgia,serif!important;color:#cdbd9e!important}
@N@ #prep #prepPerks .opt>.pl{color:#d8e0b4!important}
@N@ #prep #prepPerks .opt>.mi{color:#dc9d8c!important}
@N@ #prep :is(#prepCh,#prepCurseL) .opt>.nb-rw{display:flex!important;justify-content:flex-start!important;align-items:center!important;flex-wrap:wrap!important;gap:.35vh!important;margin-top:.2vh!important;white-space:nowrap!important;flex-wrap:nowrap!important;font:600 calc(max(12px,1.5vh) * var(--nbts,1))/1 Grenze,Georgia,serif!important;color:#d9b876!important}
@N@ #prep :is(#prepCh,#prepCurseL) .opt>.nb-rw i{width:2.3vh!important;height:2.3vh!important;margin:0 .1vh 0 0!important;flex:none!important}
@N@ #prep :is(#prepCh,#prepCurseL) .opt>.nb-rw small{font-weight:400!important;font-size:.85em!important;opacity:.8!important;margin-left:.3vh!important}
@N@ #prep :is(#prepCh,#prepCurseL) .opt>.nb-rw i.nb-coin{margin-left:.6vh!important;width:1.9vh!important;height:1.9vh!important}
@N@ #prep .prepgrid>.prepbox.nb2-more::after{content:'\\25BE';display:block;position:sticky;bottom:0;height:3.4vh;margin-top:-3.4vh;text-align:center;line-height:4vh;font-size:max(13px,1.7vh);color:#e8c878;pointer-events:none;background:linear-gradient(to bottom,rgba(10,8,10,0),rgba(10,8,10,.94))}
/* --- Przygotowanie: trudnosc w stopce --- */
@N@ #prep .nb2-diff{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:.6vh!important;min-width:0!important;padding:.9vh 1.4vh!important;background:linear-gradient(145deg,rgba(25,19,27,.92),rgba(13,11,16,.85))!important;border:1px solid var(--nbs-idle)!important}
@N@ #prep .nb2-diff>h3{display:none!important}
@N@ #prep .nb2-diff #diffSw{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:.7vh!important;width:100%!important;margin:0!important;padding:0!important;border:0!important;background:none!important}
@N@ #prep .nb2-diff #diffSw button{display:block!important;width:auto!important;min-width:0!important;height:auto!important;min-height:4.3vh!important;margin:0!important;padding:.6vh .8vh!important;border:1px solid var(--nbs-idle)!important;border-image:none!important;background:var(--nbs-cell)!important;box-shadow:none!important;font:500 max(13px,2.05vh)/1.1 Cinzel,Georgia,serif!important;color:#e6d6b8!important;text-align:center!important;cursor:pointer!important}
@N@ #prep .nb2-diff #diffSw button:hover{border-color:var(--nbs-hover)!important;background:var(--nbs-cellh)!important}
@N@ #prep .nb2-diff #diffSw button:is(.on,[aria-pressed=true],[aria-checked=true]){background:var(--nbs-on)!important;border-color:var(--nbs-line)!important;color:#fff0d5!important;box-shadow:inset 0 -2px #c9a45a!important}
@N@ #prep .nb2-diff #diffSw button:is(:focus-visible,.pf){outline:2px solid var(--nbs-focus)!important;outline-offset:1px!important}
@N@ #prep .nb2-diff #diffCap{display:block!important;margin:0!important;padding:0!important;text-align:center!important;font:400 calc(max(11px,1.42vh) * var(--nbts,1))/1.25 Grenze,Georgia,serif!important;color:#b9a98c!important}
/* --- Wybor rozdzialu --- */
@N@ #title:not(.pc-home) .premium-banner>.premium-caption{bottom:calc(188 * var(--pc-u))!important}
@N@ #title:not(.pc-home) .nb2-chdesc{display:block!important;position:absolute!important;left:calc(42 * var(--pc-u))!important;bottom:calc(148 * var(--pc-u))!important;margin:0!important;font:400 calc(max(13px,2vh) * var(--nbts,1))/1.3 Grenze,Georgia,serif!important;color:#d9c9a8!important;text-shadow:0 1px 4px #000!important;max-width:70%!important}
@N@ #title.pc-home :is(.nb2-chdesc,.nb2-meds){display:none!important}
@N@ #title .nb2-medcell>strong{display:none!important}
@N@ #title .nb2-medcell.nb2-locked>strong{display:block!important}
@N@ #title .nb2-medcell.nb2-locked>.nb2-medrow{display:none!important}
@N@ #title .nb2-medrow{display:flex!important;gap:1vh!important;margin-top:.5vh!important}
@N@ #title .nb2-med{display:block!important;width:4.3vh!important;height:4.3vh!important;border-radius:50%!important;overflow:hidden!important;border:2px solid var(--ring,rgba(230,214,184,.22))!important;background:#0c0a0e!important;opacity:.55!important}
@N@ #title .nb2-med.nb2-has{opacity:1!important;box-shadow:0 0 8px var(--ring)!important}
@N@ #title .nb2-med>img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center 8%!important;transform:scale(1.5)!important;transform-origin:50% 12%!important}
@N@ #title:not(.pc-home) .m2-ch .nb2-meds{position:absolute!important;right:1.3vh!important;bottom:1.2vh!important;display:flex!important;gap:.45vh!important;pointer-events:none!important}
@N@ #title:not(.pc-home) .m2-ch .nb2-meds>i{display:block!important;width:1.05vh!important;height:1.05vh!important;border-radius:50%!important;border:1px solid rgba(0,0,0,.55)!important}
@N@ #title:not(.pc-home) .m2-ch .nb-medal{display:none!important}
@N@ #title:not(.pc-home) button.nb2-mode{cursor:pointer!important;position:relative!important;font:inherit!important;color:inherit!important;text-align:center!important}
@N@ #title:not(.pc-home) button.nb2-mode:hover{filter:brightness(1.25)!important}
@N@ #title:not(.pc-home) button.nb2-mode:is(:focus-visible,.pf){outline:2px solid var(--nbs-focus)!important;outline-offset:2px!important}
@N@ #title:not(.pc-home) .nb2-mode-hint{position:absolute!important;right:1.6vh!important;top:50%!important;transform:translateY(-50%)!important;font:500 max(11px,1.45vh)/1 Cinzel,Georgia,serif!important;letter-spacing:.14em!important;text-transform:uppercase!important;color:#c9a45a!important}
@N@ #title:not(.pc-home) .nb2-mode-hint::before{content:'\\21C4  '}
/* --- Menu glowne: wyzwanie dnia --- */
@N@ #title:not(.pc-home) .nb2-daily{display:none!important}
@N@ #title.pc-home .nb2-daily{flex:none!important;display:flex!important;flex-direction:row!important;align-items:baseline!important;justify-content:center!important;gap:1.2vh!important;width:100%!important;margin:1.6vh 0 0!important;padding:1vh 1.4vh!important;border:1px solid var(--nbs-idle)!important;background:var(--nbs-cell)!important;cursor:pointer!important;color:#e6d6b8!important}
@N@ #title.pc-home .nb2-daily:hover{border-color:var(--nbs-hover)!important;background:var(--nbs-cellh)!important}
@N@ #title.pc-home .nb2-daily:is(:focus-visible,.pf){outline:2px solid var(--nbs-focus)!important;outline-offset:2px!important}
@N@ #title.pc-home .nb2-daily>small{font:500 max(11px,1.5vh)/1.2 Cinzel,Georgia,serif!important;letter-spacing:.16em!important;text-transform:uppercase!important;color:#c9a45a!important;white-space:nowrap!important}
@N@ #title.pc-home .nb2-daily>strong{font:400 calc(max(13px,1.85vh) * var(--nbts,1))/1.2 Grenze,Georgia,serif!important;color:#ead7b4!important}
@N@ #title.pc-home .nb2-daily.nb2-done>strong{color:#b9a98c!important}
/* --- Pauza --- */
@N@ #pause #pauseQuit:not([hidden]){display:flex!important;flex-wrap:nowrap!important;align-items:center!important;justify-content:center!important;gap:1.6vh!important;width:100%!important}
@N@ #pause #pauseQuit[hidden]{display:none!important}
@N@ #pause #pauseQuit>p{flex:0 1 auto!important;text-align:right!important;font:500 calc(max(14px,2.2vh) * var(--nbts,1))/1.3 Grenze,Georgia,serif!important;color:#f1d9a5!important}
@N@ #pause #pauseQuit>button{min-width:24vh!important}
@N@ #pause .btnrow[hidden]{display:none!important}
@N@ #pause .nbp-pane[data-pane=gfx]{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.6vh;align-items:start;text-align:left}
@N@ #pause .nbp-pane[data-pane=gfx][hidden]{display:none!important}
@N@ #pause .nbp-pane[data-pane=gfx]>section{padding:1.4vh 1.8vh!important;border:1px solid var(--nbs-idle)!important;background:var(--nbs-cell)!important;min-width:0!important}
@N@ #pause .nbp-pane[data-pane=gfx]>section:last-of-type{grid-column:1/-1!important}
@N@ #pause .nbp-pane[data-pane=gfx]>.opsep,@N@ #pause .nbp-pane[data-pane=gfx] .pcg-edge{display:none!important}
@N@ #pause .nbp-pane[data-pane=gfx] h3{margin:0 0 .8vh!important;font:500 max(15px,2.5vh)/1.2 Cinzel,Georgia,serif!important;color:#ead7b4!important;text-align:left!important}
@N@ #pause .nbp-pane[data-pane=gfx] .figcap{margin:.7vh 0 .4vh!important;font:400 calc(max(12px,1.55vh) * var(--nbts,1))/1.3 Grenze,Georgia,serif!important;color:#b9a98c!important;text-align:left!important}
@N@ #pause .nbp-pane[data-pane=gfx] .qrow{display:flex!important;flex-wrap:wrap!important;gap:.6vh!important;justify-content:flex-start!important}
@N@ #pause .nbp-pane[data-pane=gfx] .qrow>button{width:auto!important;min-width:0!important;min-height:0!important;height:auto!important;margin:0!important;padding:.7vh 1.4vh!important;border:1px solid var(--nbs-idle)!important;border-image:none!important;background:var(--nbs-cell)!important;font:500 max(12px,1.8vh)/1.1 Cinzel,Georgia,serif!important;color:#e6d6b8!important;box-shadow:none!important}
@N@ #pause .nbp-pane[data-pane=gfx] .qrow>button:hover{border-color:var(--nbs-hover)!important}
@N@ #pause .nbp-pane[data-pane=gfx] .qrow>button:is([aria-pressed=true],.on){background:var(--nbs-on)!important;border-color:var(--nbs-line)!important;color:#fff0d5!important;box-shadow:inset 0 -2px #c9a45a!important}
@N@ #pause .nbp-pane[data-pane=gfx] .qrow>button:is(:focus-visible,.pf){outline:2px solid var(--nbs-focus)!important;outline-offset:1px!important}
/* --- Opcje --- */
@N@.nb2-pc #opts .stab[data-sub=touch],@N@.nb2-pc #opts label:has(#touchLeftTgl),@N@.nb2-pc #opts label:has(#touchSizeSl),@N@.nb2-pc #opts label:has(.touchSizeSl){display:none!important}
@N@ #opts .nb2-fslab{margin-top:1.6vh!important}
@N@ #opts #pane-dat:not([hidden]){display:flex!important;flex-direction:column!important;align-items:center!important;gap:1.4vh!important}
@N@ #opts #pane-dat #copyErrors{margin-top:1.2vh!important;font-size:max(12px,1.9vh)!important;opacity:.85!important}
@N@ #opts .nb2-danger{width:min(100%,86vh)!important;margin-top:2.4vh!important;padding:1.6vh 2vh 1.8vh!important;border:1px solid rgba(196,72,72,.55)!important;background:rgba(60,14,18,.35)!important;text-align:center!important}
@N@ #opts .nb2-danger>h3{text-align:center!important;border:0!important;padding:0!important;margin:0 0 .5vh!important;font:500 max(14px,2.2vh)/1.2 Cinzel,Georgia,serif!important;color:#e9a39a!important}
@N@ #opts .nb2-danger>.figcap{text-align:center!important;max-width:none!important;margin:0 0 1.1vh!important;color:#d7b9ae!important}
@N@ #opts .nb2-danger #clearSave{border:1px solid rgba(214,92,92,.8)!important;border-image:none!important;background:rgba(92,22,28,.6)!important;color:#ffd9d2!important;padding:.9vh 2.4vh!important;width:auto!important;min-height:0!important}
@N@ #opts .nb2-danger #clearSave:hover{background:rgba(128,30,38,.75)!important;filter:none!important}
/* --- Kronika: bestiariusz jako siatka sylwetek --- */
@N@ #kap #kapList.nbk-beasts{display:grid!important;grid-template-columns:repeat(auto-fill,minmax(11.2vh,1fr))!important;grid-auto-rows:min-content!important;gap:.9vh!important;align-content:start!important}
@N@ #kap #kapList.nbk-beasts>.nbk-group{grid-column:1/-1!important;margin:1.1vh 0 0!important;padding:0 0 .4vh!important;border-bottom:1px solid rgba(201,164,90,.3)!important;font:500 max(12px,1.75vh)/1.2 Cinzel,Georgia,serif!important;letter-spacing:.1em!important;color:#d9b876!important;text-align:left!important}
@N@ #kap #kapList.nbk-beasts>.nbk-group:first-child{margin-top:0!important}
@N@ #kap #kapList.nbk-beasts .m2k-row.nbk-beast{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;gap:.4vh!important;min-height:0!important;height:auto!important;padding:.8vh .4vh .7vh!important;text-align:center!important}
@N@ #kap #kapList.nbk-beasts .nbk-beast>img{position:static!important;width:7.4vh!important;height:7.4vh!important;margin:0!important;object-fit:contain!important;image-rendering:pixelated!important;flex:none!important;transform:none!important;inset:auto!important}
@N@ #kap #kapList.nbk-beasts .nbk-beast>b{display:block!important;width:100%!important;margin:0!important;padding:0!important;font:500 max(10px,1.36vh)/1.15 Cinzel,Georgia,serif!important;text-align:center!important;white-space:normal!important;overflow-wrap:anywhere!important}
@N@ #kap #kapList.nbk-beasts .nbk-beast>small{display:none!important}
@N@ #kap #kapList.nbk-beasts .nbk-beast.lk>*{opacity:1!important}
@N@ #kap #kapList.nbk-beasts .nbk-beast.lk>b{color:#8f8472!important}
@N@ #kap #kapList.nbk-beasts .nbk-beast .nbk-new{position:absolute!important;top:.4vh!important;right:.4vh!important;font-size:9px!important}
/* --- Kaplica --- */
@N@ #kap:not(.pc-chronicle) .m2k-row.lk .m2k-pips:empty::after{content:'zablokowane'!important}
html[lang=en] @N@ #kap:not(.pc-chronicle) .m2k-row.lk .m2k-pips:empty::after{content:'locked'!important}
`.replace(/@N@/g,'#orient'.repeat(130)+'.nb2');document.head.append(css);
})();
// 13.11.2026: Przygotowanie — zamiast rozwijanego „Ustawienia” dwa przełączniki widoczne na ekranie
// (Samouczek, 2 graczy). Przyciski klikają oryginalne pola wyboru, więc logika i zapis zostają bez zmian.
(()=>{try{
 const prep=$('prep'),hi=$('hintsTgl'),mp=$('mpTgl');if(!prep||!hi||!mp)return;
 const pop=[...prep.querySelectorAll('details.pc-popover')].find(d=>d.contains(hi)||d.contains(mp));if(!pop)return;
 const wrap=document.createElement('div');wrap.className='pc-prep-quick';
 const mk=(inp,label,noteId,lab)=>{const b=document.createElement('button');b.type='button';b.className='pc-quick';b.innerHTML='<i aria-hidden="true"></i><span></span>';
  const sync=()=>{const on=!!inp.checked;b.setAttribute('aria-pressed',String(on));b.classList.toggle('is-on',on);const n=noteId&&$(noteId);b.lastChild.textContent=label+(n?n.textContent:'');if(lab)b.hidden=lab.style.display==='none'};
  b.addEventListener('click',()=>{inp.click();sync()});inp.addEventListener('change',sync);sync();setInterval(sync,700);return b};
 wrap.append(mk(hi,EN?'Tutorial':'Samouczek'),mk(mp,EN?'2 players':'2 graczy','mpTglT',$('mpTglL')));
 pop.after(wrap);pop.hidden=true;pop.open=false;
 const Z='#orient'.repeat(140),st=document.createElement('style');st.id='pc-prep-quick';st.textContent=
`${Z} #prep details.pc-popover[hidden]{display:none!important}
${Z} #prep .pc-prep-quick{position:absolute!important;right:0!important;top:50%!important;transform:translateY(-50%)!important;display:flex!important;gap:calc(10 * min(.05981vw,.10627vh))!important;z-index:5}
${Z} #prep .pc-prep-quick .pc-quick{display:inline-flex!important;align-items:center!important;gap:.6em!important;width:auto!important;min-width:0!important;height:auto!important;min-height:0!important;margin:0!important;padding:.95vh 1.6vh!important;border:1px solid var(--nbs-idle,#a68b5e66)!important;border-image:none!important;background:var(--nbs-cell,#16111499)!important;color:#eadcc4!important;font:500 max(12px,1.85vh)/1 Cinzel,Georgia,serif!important;letter-spacing:.04em!important;text-transform:none!important;white-space:nowrap!important;cursor:pointer}
${Z} #prep .pc-prep-quick .pc-quick[hidden]{display:none!important}
${Z} #prep .pc-prep-quick .pc-quick i{display:inline-grid!important;place-items:center!important;width:1.15em!important;height:1.15em!important;border:1px solid #c8a05a!important;background:#0b080a!important;font:700 .9em/1 Georgia,serif!important;font-style:normal!important;color:#f1d79a!important}
${Z} #prep .pc-prep-quick .pc-quick.is-on i::before{content:'✓'}
${Z} #prep .pc-prep-quick .pc-quick.is-on{border-color:#c8a05a!important;background:linear-gradient(150deg,#3a1d26e6,#1e1418e6)!important}
${Z} #prep .pc-prep-quick .pc-quick:hover{border-color:var(--nbs-hover,#d8b878)!important}`;
 document.head.append(st);
}catch(e){quietErr('prepQuick',e)}})();
// 13.11.2026: pauza bez przewijania. Audio: trzy karty w jednym rzędzie. Grafika: lewa kolumna Jasność + Płynność,
// prawa Jakość + Zaawansowane (te w dwóch kolumnach), zamiast długiej listy pod spodem.
(()=>{const Z='#orient'.repeat(140),st=document.createElement('style');st.id='pc-pause-fit';st.textContent=
`${Z} #pause .nbp-audiogrid{max-width:none!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:stretch!important}
${Z} #pause .nbp-audiogrid>.nbp-ah{grid-column:1/-1!important}
${Z} :is(#pause .nbp-ah,#opts .nbo-ah)>:is(small,h2,h3){display:none!important}
${Z} :is(#pause .nbp-ah,#opts .nbo-ah){margin-top:0!important;padding-top:0!important}
${Z} #pause .nbp-audiogrid>.nbp-audio{margin:0!important;min-width:0!important}
${Z} #pause .nbp-pane:has(#qualityRow){grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:auto auto!important;align-items:stretch!important;gap:calc(14 * min(.05981vw,.10627vh))!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section{margin:0!important;min-width:0!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section:nth-of-type(1){grid-column:1!important;grid-row:1!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section:nth-of-type(2){grid-column:2!important;grid-row:1!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section:nth-of-type(3){grid-column:3!important;grid-row:1!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section:nth-of-type(4){grid-column:1/-1!important;grid-row:2!important;columns:4!important;column-gap:calc(26 * min(.05981vw,.10627vh))!important;height:auto!important;max-height:none!important;overflow:visible!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section:nth-of-type(4)>h3{column-span:all!important;margin:0 0 .2em!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section:nth-of-type(4)>.qrow~p:not(:has(+.qrow)){font-size:.78em!important;line-height:1.25!important;margin:.1em 0 .25em!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section:nth-of-type(4)>p{break-after:avoid!important;max-width:none!important}
${Z} #pause .nbp-pane:has(#qualityRow) .qrow{flex-wrap:wrap!important;width:auto!important;gap:4px!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section:nth-of-type(4)>.qrow{break-inside:avoid!important;margin-bottom:.8em!important}
${Z} #pause .nbp-pane:has(#qualityRow) .qrow>button{padding:.26em .42em!important;font-size:.76em!important;min-width:0!important;min-height:0!important;line-height:1.15!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section{padding:calc(12 * min(.05981vw,.10627vh)) calc(16 * min(.05981vw,.10627vh))!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section>h3{margin:0 0 .35em!important}
${Z} #pause .nbp-pane:has(#qualityRow) .figcap{margin:.15em 0 .3em!important;line-height:1.3!important}
${Z} #pause .nbp-pane:has(#qualityRow)>section:nth-of-type(4)>.qrow{margin-bottom:.45em!important}
${Z} #pause .nbp-pane:has(#qualityRow) .musrow{min-width:0!important}
${Z} #pause .nbp-pane:has(#qualityRow) .musrow .rng{flex:1 1 auto!important;width:auto!important;min-width:0!important;max-width:100%!important}
${Z} #pause .nbp-pane:has(#qualityRow) .musrow .rng input{width:100%!important}`;
document.head.append(st)})();
// 13.11.2026: „Tryb gry” na wyborze rozdziału jako czytelny przełącznik dwóch opcji (Fabularny | Arcade).
// Wcześniej nazwa trybu była obrazkiem z gotyckich liter, który po przełączeniu znikał (pusty przycisk).
(()=>{try{
 const b=document.querySelector('#title .pc-journey-mode');if(!b)return;
 const seg=document.createElement('span');seg.className='nb2-seg';seg.setAttribute('aria-hidden','true');
 const a1=document.createElement('i'),a2=document.createElement('i');a1.textContent=EN?'Story':'Fabularny';a2.textContent='Arcade';seg.append(a1,a2);b.append(seg);
 const sync=()=>{a1.classList.toggle('is-on',!!STORYMODE);a2.classList.toggle('is-on',!STORYMODE);b.setAttribute('aria-label',(EN?'Game mode: ':'Tryb gry: ')+(STORYMODE?a1.textContent:'Arcade'))};
 sync();b.addEventListener('click',()=>setTimeout(sync,0));for(const id of ['sFab','sArc'])$(id)?.addEventListener('click',()=>setTimeout(sync,0));
 const st0=b.querySelector('strong');if(st0)new MutationObserver(sync).observe(st0,{childList:true,characterData:true,subtree:true});
 const Z='#orient'.repeat(140),U='min(.05981vw,.10627vh)',st=document.createElement('style');st.id='nb2-mode-seg';st.textContent=
`${Z} #title .pc-journey-mode.nb2-mode{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:calc(7 * ${U})!important}
${Z} #title .pc-journey-mode.nb2-mode>strong,${Z} #title .pc-journey-mode.nb2-mode>.nb2-mode-hint{display:none!important}
${Z} #title .pc-journey-mode.nb2-mode>small{font:500 calc(13 * ${U})/1 Cinzel,Georgia,serif!important;letter-spacing:.18em!important;text-transform:uppercase!important;color:#b89a68!important}
${Z} #title .pc-journey-mode.nb2-mode>small .pcg-glyph{display:none!important}
${Z} #title .pc-journey-mode .nb2-seg{display:flex!important;gap:calc(6 * ${U})!important}
${Z} #title .pc-journey-mode .nb2-seg i{font:600 calc(18 * ${U})/1 Cinzel,Georgia,serif!important;font-style:normal!important;letter-spacing:.06em!important;padding:calc(7 * ${U}) calc(16 * ${U})!important;border:1px solid #6d5a3e66!important;background:#0c090b8c!important;color:#8f8170!important;transition:background .15s,color .15s,border-color .15s}
${Z} #title .pc-journey-mode .nb2-seg i.is-on{background:linear-gradient(150deg,#5a2433,#2c161d)!important;border-color:#d8b46e!important;color:#f3e2bf!important;box-shadow:0 0 10px #c9a45a33,inset 0 0 8px #0006!important}`;
 document.head.append(st);
}catch(e){quietErr('modeSeg',e)}})();
// 13.11.2026: Opcje > Grafika w układzie PC: jedna kolumna, w każdym wierszu nazwa po lewej i przełącznik po prawej,
// sekcje jako paski nagłówków, objaśnienia drobnym tekstem pod sekcją. Same przyciski i ich obsługa bez zmian.
(()=>{try{const pane=$('pane-gfx');if(!pane||pane.classList.contains('pcs'))return;pane.classList.add('pcs');
 const row=(lab,ctl)=>{const r=document.createElement('div');r.className='pcs-row';lab.before(r);lab.classList.add('pcs-lab');ctl.classList.add('pcs-ctl');r.append(lab,ctl);return r};
 for(const sec of pane.querySelectorAll('.pc-option-section')){
  for(const p of [...sec.querySelectorAll(':scope>p.figcap')]){const n=p.nextElementSibling;if(n&&n.classList.contains('qrow'))row(p,n);else p.classList.add('pcs-help')}
  for(const l of sec.querySelectorAll(':scope>label.musrow,:scope>label.tgl'))l.classList.add('pcs-row',l.classList.contains('tgl')?'pcs-tgl':'pcs-sl');
  for(const h of [...sec.querySelectorAll(':scope>.pcs-help')])sec.append(h);}
 const Z='#orient'.repeat(40)+' #opts #pane-gfx.pcs',st=document.createElement('style');st.textContent=`
${Z}:not([hidden]){display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:calc(22 * var(--pc-u,1px))!important;max-width:1180px!important;margin:0 auto!important;width:100%!important}
${Z} .pc-section-separator,${Z} .opsep{display:none!important}
${Z} .pc-option-section{width:100%!important;max-width:none!important;box-sizing:border-box!important;display:block!important;padding:0 0 calc(10 * var(--pc-u,1px))!important;border:0!important;border-image:none!important;background:linear-gradient(#120d10cc,#0c090bb3)!important;box-shadow:inset 0 0 0 1px #6d5a3e40!important;grid-column:auto!important}
${Z} .pc-option-section>h3.sth{margin:0 0 calc(4 * var(--pc-u,1px))!important;padding:calc(10 * var(--pc-u,1px)) calc(22 * var(--pc-u,1px))!important;text-align:left!important;font:600 calc(22 * var(--pc-u,1px))/1.2 Cinzel,Georgia,serif!important;letter-spacing:.08em!important;color:#e8c995!important;background:linear-gradient(90deg,#3a1c25cc,#1a1015 70%,#0000)!important;border-bottom:1px solid #b08a4a66!important}
${Z} .pc-option-section>h3.sth:before,${Z} .pc-option-section>h3.sth:after{display:none!important}
${Z} .pcg-edge{display:none!important}
${Z} .pcs-row{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:calc(24 * var(--pc-u,1px))!important;min-height:calc(54 * var(--pc-u,1px))!important;margin:0!important;padding:calc(4 * var(--pc-u,1px)) calc(22 * var(--pc-u,1px))!important;width:auto!important;max-width:none!important;box-sizing:border-box!important;border-bottom:1px solid #6d5a3e26!important}
${Z} .pcs-row:nth-child(odd of .pcs-row){background:#ffffff05!important}
${Z} .pcs-row:focus-within,${Z} .pcs-row:has(.pf){background:linear-gradient(90deg,#c9a45a1f,#0000)!important}
${Z} .pcs-row>.pcs-lab,${Z} .pcs-row.pcs-sl>span:first-child{margin:0!important;padding:0!important;text-align:left!important;font:400 calc(19 * var(--pc-u,1px))/1.3 Georgia,serif!important;color:#e6d7bc!important;letter-spacing:.01em!important;text-transform:none!important}
${Z} .pcs-row>.qrow{display:flex!important;flex-wrap:nowrap!important;justify-content:flex-end!important;gap:0!important;margin:0!important;width:auto!important}
${Z} .pcs-row>.qrow>button{min-width:calc(84 * var(--pc-u,1px))!important;min-height:calc(40 * var(--pc-u,1px))!important;height:auto!important;margin:0 0 0 -1px!important;padding:calc(6 * var(--pc-u,1px)) calc(14 * var(--pc-u,1px))!important;border-radius:0!important;font-size:calc(16 * var(--pc-u,1px))!important;white-space:nowrap!important}
${Z} .pcs-row>.qrow>button:first-child{border-radius:calc(3 * var(--pc-u,1px)) 0 0 calc(3 * var(--pc-u,1px))!important}
${Z} .pcs-row>.qrow>button:last-child{border-radius:0 calc(3 * var(--pc-u,1px)) calc(3 * var(--pc-u,1px)) 0!important}
${Z} .pcs-row.pcs-sl .rng{width:calc(420 * var(--pc-u,1px))!important;max-width:45vw!important}
${Z} .pcs-row.pcs-tgl{display:flex!important;align-items:center!important;justify-content:space-between!important;cursor:pointer}
${Z} .pcs-row.pcs-tgl>span:last-child{order:-1;flex:1 1 auto;text-align:left!important;margin:0!important;font:400 calc(19 * var(--pc-u,1px))/1.3 Georgia,serif!important;color:#e6d7bc!important}
${Z} .pcs-help{margin:calc(8 * var(--pc-u,1px)) calc(22 * var(--pc-u,1px)) 0!important;max-width:none!important;text-align:left!important;font:italic 400 calc(14.5 * var(--pc-u,1px))/1.5 Georgia,serif!important;color:#a8977acc!important}`;
 document.head.append(st);
}catch(e){quietErr('gfxPcLayout',e)}})();
// 15.11.2026 (decyzja autora): Ustawienia, Dzwiek i Dane zapisu w tym samym standardzie co Grafika: sekcje z paskiem naglowka,
// w wierszu nazwa po lewej i przelacznik po prawej, objasnienia drobna kursywa pod sekcja. Przyciski i ich obsluga bez zmian.
(()=>{try{const L=(p,e)=>EN?e:p,mk=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
 const sec=(title,cls)=>{const s=mk('section','pc-option-section pcg-panel'+(cls?' '+cls:''));s.append(mk('h3','sth',title));return s};
 const row=(label,ctl)=>{const r=mk('div','pcs-row');ctl.before(r);ctl.classList.add('pcs-ctl');r.append(mk('p','figcap pcs-lab',label),ctl);return r};
 const tidy=sec=>{for(const l of sec.querySelectorAll(':scope>label.musrow,:scope>label.tgl'))l.classList.add('pcs-row',l.classList.contains('tgl')?'pcs-tgl':'pcs-sl');
  for(const p of [...sec.querySelectorAll(':scope>p.figcap')])p.classList.add('pcs-help');for(const h of [...sec.querySelectorAll(':scope>.pcs-help')])sec.append(h)};
 // Ustawienia
 const set=$('pane-set');if(set&&!set.classList.contains('pcs')){set.classList.add('pcs');
  const lr=set.querySelector('.langrow');if(lr){lr.classList.add('qrow');for(const b of lr.children)b.classList.add('alt');row(L('Język gry','Game language'),lr)}
  const ts=$('tsRow');if(ts){ts.classList.add('qrow');for(const b of ts.children)b.classList.add('go','alt');row(L('Rozmiar tekstu','Text size'),ts)}
  for(const s of set.querySelectorAll('.pc-option-section'))tidy(s);
  const rt=$('repeatTut');if(rt)for(const h of [...rt.parentElement.querySelectorAll(':scope>.pcs-help')])rt.before(h)}// Tryb testera wstawia sie za #repeatTut (trnOpts), wiec przycisk zostaje na miejscu
 // Dzwiek
 const aud=$('pane-aud'),na=aud&&aud.querySelector('.nbo-aud');if(na&&!aud.classList.contains('pcs')){aud.classList.add('pcs');const s=sec(L('Głośność','Volume'));na.before(s);s.append(na);
  for(const r of na.querySelectorAll('.nbo-row'))r.classList.add('pcs-row','pcs-vol')}
 // Dane zapisu
 const dat=$('pane-dat');if(dat&&!dat.classList.contains('pcs')){dat.classList.add('pcs');
  const s1=sec(L('Postęp','Progress')),info=$('datInfo'),br=$('expSave')?.parentElement,msg=$('saveMsg'),cp=$('copyErrors'),zone=dat.querySelector('.nb2-danger'),clr=$('clearSave');
  dat.prepend(s1);if(info)s1.append(info);if(br){s1.append(br);br.classList.add('qrow');row(L('Kopia w pliku','Backup file'),br)}if(msg){msg.classList.add('pcs-help');s1.append(msg)}
  if(cp){const s2=sec(L('Diagnostyka','Diagnostics')),w=mk('div','qrow');s1.after(s2);s2.append(w);w.append(cp);row(L('Raport błędów dla autora','Error report for the developer'),w)}
  if(zone&&clr){zone.className='pc-option-section pcg-panel pcs-danger';const h=zone.querySelector('h3');if(h)h.className='sth';const w=mk('div','qrow');zone.append(w);w.append(clr);row(L('Usuń cały postęp','Delete all progress'),w);tidy(zone)}}
 const Z='#orient'.repeat(40)+' #opts .pane.pcs:is(#pane-set,#pane-aud,#pane-dat)',st=document.createElement('style');st.id='pcs-all';st.textContent=`
${Z}:not([hidden]){display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;gap:calc(22 * var(--pc-u,1px))!important;max-width:1180px!important;margin:0 auto!important;width:100%!important;grid-template-columns:none!important}
${Z} .pc-section-separator,${Z} .opsep,${Z} .nbo-sep{display:none!important}
${Z} .pc-option-section{width:100%!important;max-width:none!important;box-sizing:border-box!important;display:block!important;margin:0!important;padding:0 0 calc(10 * var(--pc-u,1px))!important;border:0!important;border-image:none!important;background:linear-gradient(#120d10cc,#0c090bb3)!important;box-shadow:inset 0 0 0 1px #6d5a3e40!important;grid-column:auto!important}
${Z} .pc-option-section>h3.sth,${Z} #trnOpt>h3.sth{margin:0 0 calc(4 * var(--pc-u,1px))!important;padding:calc(10 * var(--pc-u,1px)) calc(22 * var(--pc-u,1px))!important;text-align:left!important;font:600 calc(22 * var(--pc-u,1px))/1.2 Cinzel,Georgia,serif!important;letter-spacing:.08em!important;color:#e8c995!important;background:linear-gradient(90deg,#3a1c25cc,#1a1015 70%,#0000)!important;border:0!important;border-bottom:1px solid #b08a4a66!important}
${Z} .pc-option-section>h3.sth:before,${Z} .pc-option-section>h3.sth:after,${Z} #trnOpt>h3.sth:before,${Z} #trnOpt>h3.sth:after{display:none!important}
${Z} .pcg-edge{display:none!important}
${Z} .pcs-row{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:calc(24 * var(--pc-u,1px))!important;min-height:calc(54 * var(--pc-u,1px))!important;margin:0!important;padding:calc(4 * var(--pc-u,1px)) calc(22 * var(--pc-u,1px))!important;width:auto!important;max-width:none!important;box-sizing:border-box!important;border-bottom:1px solid #6d5a3e26!important;font-size:inherit!important}
${Z} .pcs-row:nth-child(odd of .pcs-row){background:#ffffff05!important}
${Z} .pcs-row:focus-within,${Z} .pcs-row:has(.pf){background:linear-gradient(90deg,#c9a45a1f,#0000)!important}
${Z} .pcs-row>.pcs-lab,${Z} .pcs-row.pcs-sl>span:first-child,${Z} .pcs-row.pcs-vol label.musrow>span:first-child{margin:0!important;padding:0!important;text-align:left!important;font:400 calc(19 * var(--pc-u,1px))/1.3 Georgia,serif!important;color:#e6d7bc!important;letter-spacing:.01em!important;text-transform:none!important}
${Z} .pcs-row>.qrow{display:flex!important;flex-wrap:nowrap!important;justify-content:flex-end!important;gap:0!important;margin:0!important;width:auto!important;padding:0!important;background:none!important;border:0!important}
${Z} .pcs-row>.qrow>button{width:auto!important;min-width:calc(84 * var(--pc-u,1px))!important;min-height:calc(40 * var(--pc-u,1px))!important;height:auto!important;margin:0 0 0 -1px!important;padding:calc(6 * var(--pc-u,1px)) calc(14 * var(--pc-u,1px))!important;border-radius:0!important;font-size:calc(16 * var(--pc-u,1px))!important;white-space:nowrap!important;flex:0 0 auto!important}
${Z} .pcs-row>.qrow>button:first-child{border-radius:calc(3 * var(--pc-u,1px)) 0 0 calc(3 * var(--pc-u,1px))!important}
${Z} .pcs-row>.qrow>button:last-child{border-radius:0 calc(3 * var(--pc-u,1px)) calc(3 * var(--pc-u,1px)) 0!important}
${Z} .pcs-row.pcs-sl .rng{width:calc(420 * var(--pc-u,1px))!important;max-width:45vw!important}
${Z} .pcs-row.pcs-vol{grid-template-columns:minmax(0,1fr) calc(420 * var(--pc-u,1px)) calc(56 * var(--pc-u,1px))!important;font-size:inherit!important}
${Z} .pcs-row.pcs-vol label.musrow{display:contents!important}
${Z} .pcs-row.pcs-vol .rng{width:100%!important;max-width:none!important}
${Z} .pcs-row.pcs-vol>output{font:400 calc(18 * var(--pc-u,1px))/1 Georgia,serif!important;color:#c9b48c!important;text-align:right!important}
${Z} .nbo-aud{display:block!important;width:100%!important;max-width:none!important;margin:0!important;padding:0!important;gap:0!important}
${Z} .pcs-row.pcs-tgl{display:flex!important;align-items:center!important;justify-content:space-between!important;cursor:pointer}
${Z} .pcs-row.pcs-tgl>span:last-child{order:-1;flex:1 1 auto;text-align:left!important;margin:0!important;font:400 calc(19 * var(--pc-u,1px))/1.3 Georgia,serif!important;color:#e6d7bc!important}
${Z} .pcs-help{margin:calc(8 * var(--pc-u,1px)) calc(22 * var(--pc-u,1px)) 0!important;max-width:none!important;text-align:left!important;font:italic 400 calc(14.5 * var(--pc-u,1px))/1.5 Georgia,serif!important;color:#a8977acc!important}
${Z} #trnOpt{margin-top:calc(14 * var(--pc-u,1px))!important}
${Z} #repeatTut{display:block!important;width:auto!important;margin:calc(12 * var(--pc-u,1px)) calc(22 * var(--pc-u,1px)) 0 auto!important;font-size:calc(16 * var(--pc-u,1px))!important;min-height:calc(40 * var(--pc-u,1px))!important;padding:calc(6 * var(--pc-u,1px)) calc(14 * var(--pc-u,1px))!important}
${Z} #trnOpt>.btnrow{display:flex!important;justify-content:flex-end!important;gap:calc(8 * var(--pc-u,1px))!important;padding:calc(6 * var(--pc-u,1px)) calc(22 * var(--pc-u,1px))!important;margin:0!important}
${Z} #trnOpt>.figcap{margin:calc(8 * var(--pc-u,1px)) calc(22 * var(--pc-u,1px)) 0!important;text-align:left!important;font:italic 400 calc(14.5 * var(--pc-u,1px))/1.5 Georgia,serif!important;color:#a8977acc!important}
${Z} #datInfo{margin:0!important;padding:0!important;max-width:none!important;width:auto!important}
${Z} #datInfo .ban{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;width:100%!important;min-height:calc(54 * var(--pc-u,1px))!important;margin:0!important;padding:calc(4 * var(--pc-u,1px)) calc(22 * var(--pc-u,1px))!important;background:#ffffff05!important;border:0!important;border-image:none!important;border-bottom:1px solid #6d5a3e26!important;box-shadow:none!important;text-align:left!important}
${Z} #datInfo .ban>b{font:400 calc(19 * var(--pc-u,1px))/1.3 Georgia,serif!important;color:#e6d7bc!important;text-transform:none!important;letter-spacing:.01em!important}
${Z} #datInfo .ban>span{font:400 calc(17 * var(--pc-u,1px))/1.3 Georgia,serif!important;color:#c9b48c!important;text-align:right!important}
${Z} .pcs-danger{box-shadow:inset 0 0 0 1px #c4484859!important;background:linear-gradient(#1c0b0ecc,#0c090bb3)!important}
${Z} .pcs-danger>h3.sth{color:#e9a39a!important;background:linear-gradient(90deg,#5a1a20cc,#1a1015 70%,#0000)!important;border-bottom-color:#c4484866!important}
${Z} .pcs-danger #clearSave{border:1px solid rgba(214,92,92,.8)!important;border-image:none!important;background:rgba(92,22,28,.6)!important;color:#ffd9d2!important}`;
 document.head.append(st);
}catch(e){quietErr('pcsAll',e)}})();
// 13.11.2026: wybór trybu w menu głównym jako delikatny przełącznik tekstowy (Fabularny | Arcade) zamiast dwóch dużych banerów.
// Te same przyciski #sFab/#sArc i ich obsługa; zmienia się tylko wygląd. Opis widoczny tylko pod wybranym trybem.
(()=>{try{const S='#orient'.repeat(50)+' #title.pc-home .nb-mode-select',st=document.createElement('style');st.textContent=`
${S}{display:flex!important;justify-content:center!important;align-items:flex-start!important;gap:0!important;width:auto!important;height:auto!important;min-height:0!important;margin:calc(6 * var(--pc-u,1px)) auto 0!important;padding:0!important;background:none!important;border:0!important;border-image:none!important;box-shadow:none!important}
${S}>.nb-mode{position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:calc(3 * var(--pc-u,1px))!important;width:auto!important;min-width:calc(150 * var(--pc-u,1px))!important;height:auto!important;min-height:0!important;margin:0!important;padding:calc(4 * var(--pc-u,1px)) calc(22 * var(--pc-u,1px))!important;background:none!important;background-image:none!important;border:0!important;border-image:none!important;border-radius:0!important;box-shadow:none!important;filter:none!important;opacity:.45!important;transition:opacity .15s!important}
${S}>.nb-mode:before,${S}>.nb-mode:after{content:none!important;display:none!important}
${S}>.nb-mode+.nb-mode{border-left:1px solid #b08a4a59!important}
${S}>.nb-mode.on,${S}>.nb-mode[aria-checked=true]{opacity:1!important}
${S}>.nb-mode:is(:hover,:focus-visible,.pf){opacity:.85!important;outline:0!important}
${S}>.nb-mode.on:is(:hover,:focus-visible,.pf){opacity:1!important}
${S} :is(.nb-mode__icon,.nb-mode__marker,.pc-mode-check){display:none!important}
${'#orient'.repeat(50)} #title.pc-home .m2-logo{transform:translateY(calc(-6 * var(--pc-u,1px))) scale(1.26)!important;transform-origin:50% 0!important}/* 13.11.2026: logo większe od przycisków menu */
${S} .pcg-glyph{--pcg-h:calc(19 * var(--pc-u,1px))!important;letter-spacing:.12em!important;color:#d9c8a6!important;padding-bottom:calc(3 * var(--pc-u,1px))!important;border-bottom:1px solid transparent!important}
${S}>.nb-mode.on .pcg-glyph{color:#ecc779!important;border-bottom-color:#c9a45a!important}
${S} .pc-mode-note{display:block!important;visibility:hidden!important;margin:0!important;font:italic 400 calc(12.5 * var(--pc-u,1px))/1.3 Georgia,serif!important;color:#a89a7fcc!important;white-space:nowrap!important}
${S}>.nb-mode.on .pc-mode-note{visibility:visible!important}
html.padprio body.padnav ${S}>.nb-mode.pf{box-shadow:none!important;outline:1px solid #e8c16f88!important;outline-offset:2px!important;filter:none!important}`;
 document.head.append(st);
}catch(e){quietErr('modeSwitchSoft',e)}})();
/* ===== EDYTOR UKŁADU MENU (?edytor=1) + wbudowany układ NB_LAYOUT_DEF ===== */
(function(){try{
 const NB_LAYOUT_DEF={}; /* tu trafia układ zapisany przez autora: {"selektor":[x,y,skala,"ekran"]} (x,y w % szerokości okna) */
 const LSK='nbLayoutEd', LOKALNIE=location.protocol==='file:'||/^(127\.0\.0\.1|localhost|\[::1\])$/.test(location.hostname), EDIT=LOKALNIE&&/[?&]edytor=1/.test(location.search); /* edytor tylko u autora (serwer lokalny), na itch.io zablokowany */
 let L=Object.assign({},NB_LAYOUT_DEF);
 if(EDIT){try{const s=localStorage.getItem(LSK);if(s)L=JSON.parse(s)||L}catch(e){}}
 const st=document.createElement('style');st.id='nb-layout-css';document.head.append(st);
 const r2=v=>Math.round(v*100)/100;
 let EDM=false;
 const NB_IMG_DEF={}; /* nazwa pliku -> adres obrazu w assets (uzupełnia Claude po wgraniu obrazów) */
 let IMG=Object.assign({},NB_IMG_DEF);
 if(EDIT){try{Object.assign(IMG,JSON.parse(localStorage.getItem('nbLayoutImg')||'{}'))}catch(e){}}
 const PRE={
  ciemny:'background:#120a09!important;border:1px solid #5a4630!important;border-image:none!important;box-shadow:none!important;',
  zlota:'background:#1a0e0ccc!important;border:2px solid #e8c16f!important;border-image:none!important;box-shadow:0 0 12px #e8c16f55!important;',
  szklo:'background:rgba(255,255,255,.08)!important;border:1px solid rgba(255,255,255,.28)!important;border-image:none!important;box-shadow:none!important;backdrop-filter:blur(6px)!important;',
  przezr:'background:none!important;border:none!important;border-image:none!important;box-shadow:none!important;',
  krew:'background:#3a0a0e!important;border:2px solid #8a1a22!important;border-image:none!important;box-shadow:0 0 10px #8a1a2266!important;',
  kamien:'background:#2a2623!important;border:3px ridge #6b6258!important;border-image:none!important;box-shadow:inset 0 0 12px #000a!important;',
  bezobr:'border:none!important;border-image:none!important;box-shadow:none!important;'};
 const PREN={'':'Domyślny (z gry)',ciemny:'Ciemny',zlota:'Złota ramka',szklo:'Szkło',przezr:'Przezroczysty',krew:'Krwisty',kamien:'Kamień',bezobr:'Bez ramki (tło zostaje)'};
 const PFX='#orient'.repeat(60)+' ';
 function css(){let o='',o2='';for(const k in L){const a=L[k];if(!a)continue;const e=a[4]||{};
  if(a[0]||a[1]||a[2]!==1||e.rot)o+=k+'{translate:'+r2(a[0])+'vw '+r2(a[1])+'vw!important;scale:'+(Math.round(a[2]*1000)/1000)+'!important'+(e.rot?';rotate:'+e.rot+'deg!important':'')+'}\n';
  let d='';
  if(e.pre&&PRE[e.pre])d+=PRE[e.pre];
  if(e.img&&IMG[e.img]){const u='url("'+IMG[e.img]+'")';
   if(e.fit==='slice')d+='background:none!important;background-image:none!important;border:24px solid transparent!important;border-image:'+u+' '+(e.sl||30)+'% fill / 24px stretch!important;box-shadow:none!important;';
   else d+='background:'+u+' center/100% 100% no-repeat!important;border:none!important;border-image:none!important;box-shadow:none!important;'}
  if(e.bg)d+='background:'+e.bg+'!important;background-image:none!important;';
  if(e.bd)d+='border:2px solid '+e.bd+'!important;border-image:none!important;';
  if(e.r!=null)d+='border-radius:'+e.r+'px!important;';
  if(e.o!=null&&e.o<100)d+='opacity:'+e.o/100+'!important;';
  if(e.br!=null&&e.br!==100)d+='filter:brightness('+e.br/100+')!important;';
  if(e.fs&&e.fs!==100)d+='font-size:'+e.fs+'%!important;';
  if(e.hide)d+=EDM?'opacity:.25!important;':'display:none!important;';
  const pk=k.indexOf('body>')===0?k:PFX+k;
  if(d)o2+=pk+'{'+d+'}\n';
  if(e.fg)o2+=pk+', '+pk+' *{color:'+e.fg+'!important}\n'}
  st.textContent=o+o2}
 css();
 if(!EDIT)return;
 const OV='#title,#prep,#opts,#kap,#manual,#pause,#lvl,#shop,#end,#conf,#intro,#lang,#dialog';
 let mode='play',sel=null,last=null,hist=[],ui,box,gx,gy,drag=null,panel;
 const $=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
 const inUi=e=>!!(e&&e.closest&&e.closest('#nbed'));
 function keyOf(el){
  if(el.id&&document.querySelectorAll('#'+CSS.escape(el.id)).length===1)return '#'+CSS.escape(el.id);
  const p=[];let c=el;
  while(c&&c!==document.body){
   if(c.id&&c!==el){p.unshift('#'+CSS.escape(c.id));break}
   const par=c.parentElement;if(!par)break;
   p.unshift(c.tagName.toLowerCase()+':nth-child('+(Array.prototype.indexOf.call(par.children,c)+1)+')');
   c=par}
  return p.join('>').replace(/^([^#])/,'body>$1')}
 const screenOf=el=>{const o=el.closest(OV);return o?(o.id||'inne'):'gra'};
 function pick(el){ /* pomiń elementy liniowe i malutkie */
  while(el&&el.parentElement&&el!==document.body){
   const cs=getComputedStyle(el),r=el.getBoundingClientRect();
   if(cs.display!=='inline'&&r.width>14&&r.height>10)break;el=el.parentElement}
  return (el&&el!==document.body&&el!==document.documentElement)?el:null}
 const get=k=>L[k]||[0,0,1,''];
 function save(){try{localStorage.setItem(LSK,JSON.stringify(L))}catch(e){}css();info()}
 function push(){hist.push(JSON.stringify(L));if(hist.length>80)hist.shift()}
 function setSel(el){sel=el;info();draw()}
 function curKey(){return sel?keyOf(sel):null}
 function put(k,a){push();const sc=screenOf(sel);L[k]=[r2(a[0]),r2(a[1]),Math.max(.2,Math.min(4,a[2])),sc].concat(a[4]?[a[4]]:[]);save()}
 /* ---- UI ---- */
 ui=$('div');ui.id='nbed';
 ui.innerHTML=`<style>
 #nbed{position:fixed;inset:0;z-index:2147483000;pointer-events:none;font:12px/1.35 system-ui,Segoe UI,sans-serif;color:#f3e3b8}
 #nbed *{cursor:default!important;box-sizing:border-box}
 body.nbed-edit,body.nbed-edit *{cursor:crosshair!important}
 #nbed .box{position:fixed;border:2px dashed #e8c16f;box-shadow:0 0 0 1px #000a;display:none}
 #nbed .hd{position:absolute;width:16px;height:16px;background:#e8c16f;border:2px solid #000;border-radius:3px;pointer-events:auto;cursor:nwse-resize!important}
 #nbed .hd.a{left:-9px;top:-9px}#nbed .hd.b{right:-9px;top:-9px}#nbed .hd.c{left:-9px;bottom:-9px}#nbed .hd.d{right:-9px;bottom:-9px}
 #nbed .g{position:fixed;background:#4fd1ff;display:none}
 #nbed .pn{position:fixed;top:8px;right:8px;width:290px;max-height:calc(100vh - 16px);overflow:auto;background:#150d0cee;border:1px solid #e8c16f;border-radius:8px;padding:8px;pointer-events:auto}
 #nbed .pn.l{right:auto;left:8px}
 #nbed .pn b.t{display:block;margin-bottom:4px;color:#e8c16f;cursor:pointer!important}
 #nbed button{background:#3a2420;color:#f3e3b8;border:1px solid #8a6a3a;border-radius:5px;padding:4px 7px;margin:2px 2px 0 0;font:inherit;pointer-events:auto}
 #nbed button:hover{background:#5a3a2e}#nbed button.on{background:#e8c16f;color:#1a0e0c}
 #nbed .inf{margin:4px 0;color:#cdb98a;word-break:break-all;min-height:2.7em}
 #nbed textarea{width:100%;height:46px;background:#0b0605;color:#f3e3b8;border:1px solid #6a4a2a;border-radius:4px;font:10px monospace;pointer-events:auto}
 #nbed .st{border-top:1px solid #6a4a2a;margin-top:4px;padding-top:4px}#nbed .st label{display:flex;align-items:center;gap:6px;margin:3px 0}#nbed .st label span{width:92px;flex:none}#nbed .st input[type=range]{flex:1;pointer-events:auto;min-width:0}#nbed .st select{flex:1;background:#0b0605;color:#f3e3b8;border:1px solid #6a4a2a;pointer-events:auto;min-width:0}#nbed .st input[type=color]{width:36px;height:22px;padding:0;border:1px solid #6a4a2a;background:none;pointer-events:auto}
 #nbed .hp{color:#a89870;font-size:11px;margin-top:4px}
 </style>
 <div class="box"><i class="hd a" data-h="a"></i><i class="hd b" data-h="b"></i><i class="hd c" data-h="c"></i><i class="hd d" data-h="d"></i></div>
 <div class="g gx" style="width:1px;top:0;bottom:0"></div><div class="g gy" style="height:1px;left:0;right:0"></div>
 <div class="pn"><b class="t" data-a="side">EDYTOR MENU ⇄</b>
  <button data-a="mode" class="on">✎ Edycja (F2)</button><button data-a="undo">↶ Cofnij</button><br>
  <button data-a="up">▲ Rodzic</button><button data-a="down">▼ Dziecko</button><button data-a="s-">Mniejszy −</button><button data-a="s+">Większy +</button><br>
  <button data-a="r1">Reset elementu</button><button data-a="r2">Reset ekranu</button><button data-a="r3">Reset wszystkiego</button>
<div class="st" data-st>
   <label><span>Własny obraz</span><input type="file" accept="image/*" data-file style="flex:1;min-width:0;pointer-events:auto"></label>
   <label><span>Sposób</span><select data-p="fit"><option value="">Rozciągnij na cały baner</option><option value="slice">Ramka 9-pól (rogi stałe)</option></select></label>
   <label><span>Grubość rogów %</span><input type="range" data-p="sl" min="5" max="45" value="30"></label>
   <button data-x="img">✕ Usuń obraz</button>
  
   <label><span>Rodzaj baneru</span><select data-p="pre">${Object.keys(PREN).map(k=>'<option value="'+k+'">'+PREN[k]+'</option>').join('')}</select></label>
   <label><span>Kolor tła</span><input type="color" data-p="bg" value="#2a1410"><button data-x="bg">✕</button></label>
   <label><span>Kolor ramki</span><input type="color" data-p="bd" value="#e8c16f"><button data-x="bd">✕</button></label>
   <label><span>Kolor tekstu</span><input type="color" data-p="fg" value="#f3e3b8"><button data-x="fg">✕</button></label>
   <label><span>Przezroczystość</span><input type="range" data-p="o" min="10" max="100" value="100"></label>
   <label><span>Jasność</span><input type="range" data-p="br" min="40" max="160" value="100"></label>
   <label><span>Rozmiar tekstu</span><input type="range" data-p="fs" min="50" max="200" value="100"></label>
   <label><span>Zaokrąglenie</span><input type="range" data-p="r" min="0" max="40" value="0"></label>
   <label><span>Obrót</span><input type="range" data-p="rot" min="-30" max="30" step="0.5" value="0"></label>
   <label><span>Ukryj element</span><input type="checkbox" data-p="hide"></label>
   <button data-a="rstyle">Reset wyglądu elementu</button>
  </div>
  <div class="inf" data-i>Kliknij element na ekranie.</div>
  <button data-a="copy">📋 Kopiuj układ</button><button data-a="load">⬇ Wczytaj z pola</button>
  <textarea data-t placeholder="Tu pojawi się układ do wklejenia Claude'owi. Można też wkleić układ i kliknąć Wczytaj."></textarea>
  <div class="hp">Przeciągnij = ruch · róg = rozmiar · strzałki = ruch (Shift ×10) · +/− = rozmiar · Del = reset elementu · Alt = bez przyciągania · F2 = przełącz Edycja/Gra (w trybie Gra klikasz po grze normalnie, żeby zmienić ekran).</div>
 </div>`;
 document.body.append(ui);
 box=ui.querySelector('.box');gx=ui.querySelector('.gx');gy=ui.querySelector('.gy');panel=ui.querySelector('.pn');
 const ta=ui.querySelector('[data-t]'),inf=ui.querySelector('[data-i]');
 function syncSt(){const e=sel?(get(keyOf(sel))[4]||{}):{};
  ui.querySelectorAll('[data-p]').forEach(c=>{const n=c.dataset.p,v=e[n];
   if(c.type==='checkbox')c.checked=!!v;else if(c.tagName==='SELECT')c.value=v||'';
   else if(c.type==='color')c.value=v||c.defaultValue;
   else c.value=v!=null?v:(n==='r'||n==='rot'?0:n==='sl'?30:100)})}
 function info(){syncSt();if(!sel){inf.textContent='Kliknij element na ekranie.';return}
  const k=keyOf(sel),a=get(k);inf.innerHTML='<b>'+screenOf(sel)+'</b> · '+k.replace(/^body>/,'').slice(-70)+'<br>x '+a[0]+' · y '+a[1]+' · skala '+a[2]}
 function draw(){if(!sel||!document.contains(sel)||mode!=='edit'){box.style.display='none';return}
  const r=sel.getBoundingClientRect();if(r.width<1){box.style.display='none';return}
  Object.assign(box.style,{display:'block',left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'})}
 (function lp(){draw();requestAnimationFrame(lp)})();
 function setMode(m){mode=m;EDM=m==='edit';css();document.body.classList.toggle('nbed-edit',m==='edit');
  const b=ui.querySelector('[data-a=mode]');b.classList.toggle('on',m==='edit');b.textContent=m==='edit'?'✎ Edycja (F2)':'▶ Gra (F2)';draw()}
 setMode('edit');
 /* ---- blokada gry w trybie edycji ---- */
 const stop=e=>{if(mode!=='edit'||inUi(e.target))return;e.preventDefault();e.stopImmediatePropagation()};
 ['click','dblclick','contextmenu','mouseup','mousedown','touchstart','wheel','auxclick'].forEach(t=>window.addEventListener(t,stop,true));
 window.addEventListener('pointerdown',e=>{
  if(mode!=='edit'||inUi(e.target))return;
  e.preventDefault();e.stopImmediatePropagation();
  const raw=document.elementFromPoint(e.clientX,e.clientY);if(!raw)return;last=raw;
  let el=pick(raw);if(!el)return;
  if(!(sel&&(el===sel||sel.contains(el)))){setSel(el)}
  startDrag(e,'move')},true);
 window.addEventListener('pointerup',e=>{if(mode!=='edit')return;stop(e);endDrag()},true);
 ui.querySelectorAll('.hd').forEach(h=>h.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();startDrag(e,'size')}));
 function targets(){
  const o=sel.closest(OV)||document.body,T={x:[0,innerWidth/2,innerWidth],y:[0,innerHeight/2,innerHeight]};
  let n=0;for(const e of o.querySelectorAll('*')){
   if(n>400)break;if(e===sel||sel.contains(e)||e.contains(sel)||inUi(e))continue;
   const r=e.getBoundingClientRect();if(r.width<24||r.height<12||r.right<0||r.bottom<0||r.left>innerWidth)continue;
   T.x.push(r.left,r.left+r.width/2,r.right);T.y.push(r.top,r.top+r.height/2,r.bottom);n++}
  return T}
 function startDrag(e,kind){
  if(!sel)return;const k=keyOf(sel),a=get(k).slice(),r=sel.getBoundingClientRect();
  drag={kind,k,a,x0:e.clientX,y0:e.clientY,r,cx:r.left+r.width/2,cy:r.top+r.height/2,moved:false,T:null,pushed:false}}
 window.addEventListener('pointermove',e=>{
  if(!drag)return;const d=drag;
  if(!d.moved&&Math.hypot(e.clientX-d.x0,e.clientY-d.y0)<3)return;
  d.moved=true;if(!d.pushed){push();d.pushed=true}
  let a;
  if(d.kind==='move'){
   let dx=e.clientX-d.x0,dy=e.clientY-d.y0;
   if(!e.altKey){if(!d.T)d.T=targets();
    const sn=(vals,T)=>{let best=null;for(const v of vals)for(const t of T){const df=t-v;if(Math.abs(df)<8&&(best===null||Math.abs(df)<Math.abs(best.d))||false)best={d:df,t}}return best};
    const bx=sn([d.r.left+dx,d.r.left+d.r.width/2+dx,d.r.right+dx],d.T.x),by=sn([d.r.top+dy,d.r.top+d.r.height/2+dy,d.r.bottom+dy],d.T.y);
    if(bx){dx+=bx.d;gx.style.display='block';gx.style.left=bx.t+'px'}else gx.style.display='none';
    if(by){dy+=by.d;gy.style.display='block';gy.style.top=by.t+'px'}else gy.style.display='none'}
   else{gx.style.display=gy.style.display='none'}
   a=[d.a[0]+dx/innerWidth*100,d.a[1]+dy/innerWidth*100,d.a[2]]}
  else{const d0=Math.hypot(d.x0-d.cx,d.y0-d.cy)||1,d1=Math.hypot(e.clientX-d.cx,e.clientY-d.cy);
   a=[d.a[0],d.a[1],d.a[2]*d1/d0]}
  L[d.k]=[r2(a[0]),r2(a[1]),Math.max(.2,Math.min(4,a[2])),screenOf(sel)].concat(d.a[4]?[d.a[4]]:[]);save()},true);
 function endDrag(){drag=null;gx.style.display=gy.style.display='none'}
 /* ---- klawisze ---- */
 window.addEventListener('keydown',e=>{
  if(e.key==='F2'){e.preventDefault();setMode(mode==='edit'?'play':'edit');return}
  if(mode!=='edit'||inUi(e.target)&&/TEXTAREA/.test(e.target.tagName))return;
  const k=sel&&keyOf(sel);let used=true;
  if(sel&&/^Arrow/.test(e.key)){const s=(e.shiftKey?1:.1),a=get(k).slice();
   if(e.key==='ArrowLeft')a[0]-=s;if(e.key==='ArrowRight')a[0]+=s;if(e.key==='ArrowUp')a[1]-=s;if(e.key==='ArrowDown')a[1]+=s;put(k,a)}
  else if(sel&&(e.key==='+'||e.key==='=')){const a=get(k).slice();a[2]*=e.shiftKey?1.1:1.02;put(k,a)}
  else if(sel&&(e.key==='-'||e.key==='_')){const a=get(k).slice();a[2]/=e.shiftKey?1.1:1.02;put(k,a)}
  else if(sel&&(e.key==='Delete'||e.key==='Backspace')){push();delete L[k];save()}
  else if(e.key==='z'&&(e.ctrlKey||e.metaKey)){undo()}
  else used=false;
  if(used||!inUi(e.target)){e.preventDefault();e.stopImmediatePropagation()}},true);
 window.addEventListener('keyup',e=>{if(mode==='edit'&&!inUi(e.target)){e.preventDefault();e.stopImmediatePropagation()}},true);
 function undo(){if(!hist.length)return;L=JSON.parse(hist.pop());save()}
 function dump(){const o={};for(const k in L)if(L[k]&&(L[k][0]||L[k][1]||L[k][2]!==1||L[k][4]))o[k]=L[k];
  return 'NBLAYOUT '+innerWidth+'x'+innerHeight+' '+JSON.stringify(o)}
 ui.addEventListener('change',e=>{const f=e.target.closest('[data-file]');if(!f||!f.files[0]||!sel)return;
  const file=f.files[0],name=file.name.replace(/[^\w.\-]/g,'_'),fr=new FileReader();
  fr.onload=()=>{const im=new Image();im.onload=()=>{
   const sc=Math.min(1,1200/im.width),c=document.createElement('canvas');c.width=Math.round(im.width*sc);c.height=Math.round(im.height*sc);
   c.getContext('2d').drawImage(im,0,0,c.width,c.height);IMG[name]=c.toDataURL('image/webp',.88);
   try{localStorage.setItem('nbLayoutImg',JSON.stringify(IMG))}catch(x){inf.textContent='Obraz za duży do zapamiętania w przeglądarce – działa do odświeżenia.'}
   stPush=true;setX('img',name);save();f.value=''};im.src=fr.result};fr.readAsDataURL(file)});
 let stPush=false;
 ui.addEventListener('pointerdown',e=>{if(e.target.closest('[data-st]'))stPush=true});
 function setX(n,v){if(!sel)return;const k=keyOf(sel),a=get(k).slice();const x=Object.assign({},a[4]||{});
  if(stPush){push();stPush=false}
  if(v===null||v===''||v===false)delete x[n];else x[n]=v;
  if(n==='r'&&v===0)delete x.r;if(n==='rot'&&v===0)delete x.rot;
  a[4]=Object.keys(x).length?x:undefined;if(!a[4])a.length=4;
  a[3]=screenOf(sel);L[k]=a;css();inf.innerHTML=inf.innerHTML}
 ui.addEventListener('input',e=>{const c=e.target.closest('[data-p]');if(!c)return;const n=c.dataset.p;
  setX(n,c.type==='checkbox'?c.checked:(c.tagName==='SELECT'||c.type==='color')?c.value:+c.value)});
 ui.addEventListener('change',e=>{const c=e.target.closest('[data-p]');if(c)save()});
 ui.addEventListener('click',e=>{
  const xb=e.target.closest('[data-x]');if(xb){push();setX(xb.dataset.x,null);save();return}
  const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,k=sel&&keyOf(sel);
  if(a==='side')panel.classList.toggle('l');
  else if(a==='mode')setMode(mode==='edit'?'play':'edit');
  else if(a==='undo')undo();
  else if(a==='up'&&sel&&sel.parentElement&&sel.parentElement!==document.body)setSel(sel.parentElement);
  else if(a==='down'&&sel){let c=last;while(c&&c.parentElement&&c.parentElement!==sel)c=c.parentElement;if(c&&c.parentElement===sel)setSel(c);else if(sel.firstElementChild)setSel(sel.firstElementChild)}
  else if(a==='s-'&&sel){const v=get(k).slice();v[2]/=1.05;put(k,v)}
  else if(a==='s+'&&sel){const v=get(k).slice();v[2]*=1.05;put(k,v)}
  else if(a==='rstyle'&&sel){push();const v=get(k).slice();v.length=4;if(!v[0]&&!v[1]&&v[2]===1)delete L[k];else L[k]=v;save()}
  else if(a==='r1'&&sel){push();delete L[k];save()}
  else if(a==='r2'&&sel){const sc=screenOf(sel);push();for(const q in L)if(L[q][3]===sc)delete L[q];save()}
  else if(a==='r3'){push();L={};save()}
  else if(a==='copy'){const t=dump();ta.value=t;ta.select();
   let ok=false;try{navigator.clipboard.writeText(t).then(()=>{b.textContent='✓ Skopiowano'},()=>{b.textContent='Zaznacz i Ctrl+C'});ok=true}catch(x){}
   if(!ok){try{document.execCommand('copy');b.textContent='✓ Skopiowano'}catch(x){b.textContent='Zaznacz i Ctrl+C'}}
   setTimeout(()=>{b.textContent='📋 Kopiuj układ'},2000)}
  else if(a==='load'){const m=ta.value.match(/\{[\s\S]*\}/);if(m){try{push();L=JSON.parse(m[0]);save()}catch(x){inf.textContent='Błędny układ w polu.'}}}
 });
}catch(e){quietErr('menuEditor',e)}})();
// 14.11.2026: odswiezenie menu glownego, etap 1 (grafiki ChatGPT). Tylko wyglad: te same przyciski, kolejnosc, nawigacja padem i klawiatura.
// Zaznaczenie: pas mgly z zarem i rozzarzone pietno. Zlota ramka padu (.pf, styl pad-focus) zostaje bez zmian.
(()=>{try{
 const Z='#orient'.repeat(150)+' #title.pc-home',A=u=>`url('${u}')`,
  PAS=A('assets/ui/aa11153800fd0cba5e5c2f75624de5a0095be6f72b9c354d45d6e1407eddf649.webp'),PAS_ON=A('assets/ui/8db53ef35bb4029e41d8805f4883df423d733c54d619333967a58e5291bca9d5.webp'),GRAJ=A('assets/ui/94a14dac03245fb2b6bdbad243ff76c16d68d88ed8b3de2dca3e39c48653e067.webp'),SEP=A('assets/ui/dc953247d88ddda8bd2dbc13f0f1ec4f6427ab12419da7836ac468cad25ea55d.webp'),PIET=A('assets/ui/a8a2aa56606d05baf32c926ae36412f62a4fa8eaaf6c81f0a4b6a23cfa6808c7.webp'),
  IK={'premium-journey':A('assets/ui/de7572b3ab143465b2bffd81fd6516e066bbb9bbed4088b9b7c94c9fdfc3ee29.webp'),kapBtn:A('assets/ui/09c2709d88e884e8fb245450a7c371617c68d7b5fb1452a5956ead6c57cf33ee.webp'),kronBtn:A('assets/ui/65573edb49b7e9f6506f19263870f7d4e2f30c32233621a1b26b37675767b78c.webp'),manBtn:A('assets/ui/7c65e8bd51920f28d168cf22b7eab6cfdcb943622d1424c5d053388d742a6ac9.webp'),optsBtn:A('assets/ui/c18aafac5bf475178a58ebc01f17e3fc4dd47acb1461ce60ecc4e865f8355c06.webp')},
  ON=':is(:hover,:focus,:focus-visible,.pf)',NAV=Z+' .premium-nav>:is(.premium-journey,#kapBtn,#kronBtn,#manBtn,#optsBtn)',
  KURSOR="url('assets/ui/f2bdfe0d27c4a8f08d3ffa8134a8a68bff08b21b4d9738ab1163dc0abff798b6.png') 1 1",KURSOR_ON="url('assets/ui/bbb913eb13015dbe4642b534d69766dd39a04688ad6f98bd4b3611032eea7bf7.png') 1 1";
 const URNA=`url('assets/ui/bec1edb981cde86153bfc1f97330a541237d7963c2926133284dbc3f9ef457bf.webp')`,RAMKA=`url('assets/ui/1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp')`,PR='#orient'.repeat(150)+' :is(#title,#prep,#kap,#opts,#manual)',PAS_G=`url('assets/ui/eacf8e623d8575a62966b86c0f4baf6c00e3f31f40fbc778335edece46b7a824.webp')`,K='#orient'.repeat(220),S='#orient'.repeat(220)+' :is(#prep,#kap,#opts,#manual,#pause,#lvl,#shop,#end,#conf,#title:not(.pc-home),#notice,#dialog,#witChoices,#finale,#intro,#recovery)',PAS_EL='.tab,.stab,.nbp-tab,.slot-tab,.nb-mode,.m2-b:not(.m2k-buy),.m2-kap,.backar,.pc-home-button,.nb2-mode,.pc-journey-mode,#pause .go.alt,#end .go.alt,#notice .go.alt,#dialog .go.alt,#dialog button.next,#witChoices .go.alt,#recovery .go.alt,#intro .iskip',CARD='.m2k-row,.m2-ch,#opts .go.alt,.lvl-card,.card,.shopc .it',MAIN='.premium-go,.m2k-buy,#prepGo,.go:not(.alt):not(.slot-tab)',PANEL='.premium-banner,#kapDet,#manual .premium-page-content,#pause #skillLoadout,#lvl .level-panel,#shop .shopc,#end .nbs-grid,#conf';
 const st=document.createElement('style');st.id='nb-menu-odswiezenie';st.textContent=`
${Z} .premium-rail{overflow:visible!important}
${NAV}{border-color:transparent!important;border-image:none!important;background-color:transparent!important;background-image:none!important;position:relative!important;isolation:isolate!important;overflow:visible!important}
${NAV}::after{content:''!important;display:block!important;position:absolute!important;inset:-40% -9% -40% -9%!important;width:auto!important;height:auto!important;margin:0!important;transform:none!important;z-index:-1!important;pointer-events:none!important;background:${PAS} center/100% 100% no-repeat!important;opacity:.8!important}
${Z} .premium-nav>:is(.premium-journey,#nbBrak)::after{inset:-46% -12% -46% -12%!important;opacity:.9!important}
/* zaznaczenie: ten sam prostokat, zmienia sie tylko obrazek (pas z zarem od spodu) */
${NAV}${ON}::after{background:${PAS_ON} center/100% 100% no-repeat!important;opacity:1!important;filter:none!important;animation:nbZar 1.8s ease-in-out infinite!important}
${NAV}::before{content:''!important;display:block!important;position:absolute!important;height:auto!important;margin:0!important;left:3%!important;right:auto!important;top:-6%!important;bottom:-6%!important;width:11%!important;z-index:1!important;pointer-events:none!important;background:center/contain no-repeat!important;transform:none!important;opacity:1!important;font-size:0!important;color:transparent!important}
${NAV}${ON}{outline:none!important;box-shadow:none!important;filter:none!important}
@keyframes nbZar{0%,100%{filter:brightness(1.05) saturate(1)}50%{filter:brightness(1.3) saturate(1.25)}}
${Z} .nb2-daily${ON}{outline:none!important;box-shadow:none!important;filter:none!important}
${Z} :is(.nb-mode,.pc-language)${ON}{outline:none!important;box-shadow:none!important;filter:drop-shadow(0 0 6px rgba(255,138,58,.7))!important}
${Object.entries(IK).map(([id,u])=>`${Z} .premium-nav>:is(${id==='premium-journey'?'.'+id:'#'+id},#nbBrak)::before{background-image:${u}!important}`).join('\n')}
${Z} .premium-nav{background:none!important}
${Z} .premium-nav::before,${Z} .premium-nav::after{content:none!important;display:block!important;position:absolute!important;left:12%!important;right:12%!important;height:30px!important;background:${SEP} center/contain no-repeat!important;pointer-events:none!important;opacity:.9!important}
${Z} .premium-nav{position:relative!important}
${Z} .premium-nav::before{top:2px!important}
${Z} .premium-nav::after{bottom:2px!important}
${Z} .nb2-daily{border:none!important;background:${A('assets/ui/6679e28f0d4528a14db5abaeb1f51f96eefc35d966cdec24f48246011b086585.webp')} 4% 50%/auto 92% no-repeat,${PAS} center/100% 160% no-repeat!important;padding-left:13%!important}
${Z} .nb2-daily${ON}{background:${A('assets/ui/6679e28f0d4528a14db5abaeb1f51f96eefc35d966cdec24f48246011b086585.webp')} 4% 50%/auto 92% no-repeat,${PAS_ON} center/100% 160% no-repeat!important}
/* 15.11.2026: menu glowne w spalonej desce (jak Przygotuj sie); zaznaczenie: zar w srodku deski */
${NAV}::after{inset:-10% -4% -10% -4%!important;background:${RAMKA} center/100% 100% no-repeat!important;opacity:1!important}
${Z} .premium-nav>:is(.premium-journey,#nbBrak)::after{inset:-12% -5% -12% -5%!important;opacity:1!important}
${NAV}${ON}::after{background:radial-gradient(ellipse 44% 40% at 50% 58%,rgba(255,118,36,.5),rgba(255,90,30,.16) 60%,rgba(255,90,30,0) 100%) center/86% 74% no-repeat,${RAMKA} center/100% 100% no-repeat!important;animation:nbZarG 1.8s ease-in-out infinite!important}
${NAV}${ON}{color:#ffe2b8!important;text-shadow:0 0 10px rgba(255,140,60,.75)!important}
${NAV}::before{display:none!important;content:none!important} /* 15.11.2026: deski bez ikon (decyzja autora) */
${Z} .nb2-daily{background:${A('assets/ui/6679e28f0d4528a14db5abaeb1f51f96eefc35d966cdec24f48246011b086585.webp')} 5% 50%/auto 64% no-repeat,${RAMKA} center/100% 100% no-repeat!important;padding-top:1.4vh!important;padding-bottom:1.4vh!important}
${Z} .nb2-daily${ON}{background:${A('assets/ui/6679e28f0d4528a14db5abaeb1f51f96eefc35d966cdec24f48246011b086585.webp')} 5% 50%/auto 64% no-repeat,radial-gradient(ellipse 44% 40% at 50% 58%,rgba(255,118,36,.42),rgba(255,90,30,0) 100%) center/86% 74% no-repeat,${RAMKA} center/100% 100% no-repeat!important;animation:nbZarG 1.8s ease-in-out infinite!important}
/* 15.11.2026: menu glowne w lewej kolumnie (logo nad deskami), scena z ogniskiem odslonieta (wariant B autora) */
@media (min-width:900px){
${Z} .premium-body .premium-rail{translate:calc(-427 * var(--pc-u,1px)) 0!important}
${Z} .premium-mast{translate:calc(-427 * var(--pc-u,1px)) calc(12 * var(--pc-u,1px))!important;scale:.74!important}
${Z} .premium-mast:before{left:50%!important;top:52%!important;inset:auto!important;width:calc(958 * var(--pc-u,1px))!important;height:calc(453 * var(--pc-u,1px))!important;translate:-50% -50%!important;background:radial-gradient(ellipse closest-side,rgba(8,6,8,.82),rgba(8,6,8,.5) 55%,rgba(8,6,8,0))!important;z-index:-1!important;pointer-events:none!important}
${Z} .premium-mast .m2-logo{filter:drop-shadow(0 0 18px rgba(255,110,40,.28)) drop-shadow(0 6px 10px rgba(0,0,0,.9))!important}
/* licznik Popiolow i poziomu w lewej kolumnie, pod deskami; pod nim wyzwanie dnia i tryb */
${Z} .pc-profile{position:relative!important;right:auto!important;left:auto!important;top:auto!important;flex:none!important;width:100%!important;height:calc(50 * var(--pc-u,1px))!important;margin:calc(14 * var(--pc-u,1px)) 0 0!important;box-sizing:border-box!important;padding:0 calc(30 * var(--pc-u,1px))!important;gap:calc(14 * var(--pc-u,1px))!important;justify-content:center!important;align-items:center!important}
${Z} .pc-profile-ash{width:calc(30 * var(--pc-u,1px))!important;height:calc(30 * var(--pc-u,1px))!important}
${Z} .pc-profile-stat{flex-direction:row!important;align-items:baseline!important;gap:calc(8 * var(--pc-u,1px))!important;min-width:0!important}
${Z} .pc-profile-stat small{font:400 calc(14 * var(--pc-u,1px))/1 Georgia,serif!important;color:#bca177!important}
${Z} .pc-profile-stat strong{font:400 calc(23 * var(--pc-u,1px))/1 Georgia,serif!important}
${Z} .pc-profile-stat+.pc-profile-stat{padding-left:calc(18 * var(--pc-u,1px))!important;margin-left:calc(6 * var(--pc-u,1px))!important;align-items:center!important}
${Z} .pc-profile-stat+.pc-profile-stat::before{content:none!important;display:none!important}
${Z} .pc-profile-stat+.pc-profile-stat::after{content:''!important;display:block!important;width:calc(84 * var(--pc-u,1px))!important;height:calc(5 * var(--pc-u,1px))!important;margin-left:calc(4 * var(--pc-u,1px))!important;background:linear-gradient(90deg,#e8873a calc(var(--nb-xp,0) * 100%),#1c1210 0)!important;border:1px solid #6a4426!important;box-shadow:0 0 6px rgba(255,120,40,.25)!important}
}
${PR} .pc-profile{border:none!important;border-image:none!important;background:${A('assets/ui/1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp')} center/100% 100% no-repeat!important;box-shadow:none!important;padding-left:2.2%!important;padding-right:2.2%!important}
${PR} .pc-profile>.pcg-edge{display:none!important}
${PR} img.pc-profile-ash{content:${A('assets/ui/bec1edb981cde86153bfc1f97330a541237d7963c2926133284dbc3f9ef457bf.webp')}!important;filter:none!important;object-fit:contain!important}
${PR} .pc-profile-stat+.pc-profile-stat{position:relative!important;padding-left:2.4em!important}
${PR} .pc-profile-stat+.pc-profile-stat::before{content:''!important;position:absolute!important;left:0!important;top:50%!important;width:2.1em!important;height:2.1em!important;transform:translateY(-50%)!important;background:${A('assets/ui/516bd88256fbc226fa5570719b9fd6743b2086353a5a9e8c156f936324dc5a0a.webp')} center/contain no-repeat!important}
${'#orient'.repeat(150)} :is(#title,#kap,#opts,#manual,#prep,#conf,#end,#lang){cursor:${KURSOR},auto!important}
${'#orient'.repeat(150)} :is(#title,#kap,#opts,#manual,#prep,#conf,#end,#lang) :is(button,a,summary,label,input,[role=button],[role=tab],[role=radio]){cursor:${KURSOR_ON},pointer!important}

/* 14.11.2026: reszta menu w tym samym stylu (Przygotowanie, Kaplica, Kronika, Opcje, Instrukcja, Pauza, Awans, Kram, Koniec nocy) */
${S} :is(.pf,:focus-visible){outline:2px solid rgba(255,138,58,.85)!important;outline-offset:2px!important;box-shadow:0 0 0 1px #000c,0 0 16px 2px rgba(255,110,40,.42)!important;filter:none!important}
${S} :is(${PAS_EL})>:is(.pc-route-edge,.pcg-edge){display:none!important}
${S} :is(${PAS_EL})::before,${S} :is(${PAS_EL})::after{border:none!important;border-image:none!important;box-shadow:none!important;background:none!important}
${S} :is(${PAS_EL}){outline:none!important;border-color:transparent!important;border-image:none!important;background:${PAS_G} center/100% 100% no-repeat!important;box-shadow:none!important}
${S} :is(${PAS_EL}):is(.on,.chosen,[aria-pressed=true],[aria-selected=true],.premium-selected,${ON.slice(4,-1)}){background:${PAS_ON} center/100% 100% no-repeat!important;outline:none!important;box-shadow:none!important}
${S} :is(${PAS_EL})${ON}{outline:none!important;box-shadow:none!important;animation:nbZar 1.8s ease-in-out infinite!important}
/* 14.11.2026: komunikaty, rozmowy, wybory, final, wstep nocy i ekran bledu w tym samym standardzie */
${K} :is(#notice,#dialog,#witChoices,#recovery,#intro) :is(.go.alt,.iskip,button.next){font:600 calc(15 * var(--pc-u,1px)) Cinzel,Georgia,serif!important;letter-spacing:.06em!important;text-transform:none!important;padding:9px 34px!important;min-height:40px!important;color:#e6d6b8!important;text-shadow:0 1px 2px #000!important}
${K} :is(#notice,#dialog,#witChoices,#recovery,#intro) :is(.go.alt,.iskip,button.next)${ON}{color:#fff0d5!important}
${K} :is(#notice,#dialog,#witChoices,#recovery,#intro) :is(.go.alt,.iskip,button.next) :is(kbd,.kbd,.kbb,.btn-glyph){filter:none!important}
${K} :is(#notice,#dialog,#witChoices,#recovery,#intro) :is(.go.alt,.iskip,button.next)>span:not(.kbd):not(.btn-glyph){font:inherit!important;letter-spacing:inherit!important;color:inherit!important}
${K} :is(#finale,#recovery) .go:not(.alt){font:600 calc(17 * var(--pc-u,1px)) Cinzel,Georgia,serif!important;letter-spacing:.06em!important;padding:12px 40px!important;color:#ead7b4!important;text-shadow:0 1px 2px #000!important}
${K} #recovery{background:radial-gradient(ellipse 70% 60% at 30% 40%,rgba(60,18,16,.35),rgba(0,0,0,0) 70%),#0d0b0df5!important}
${K} #finale #finTitle{font-family:Cinzel,Georgia,serif!important;letter-spacing:.05em!important;color:#ead7b4!important}
${K} #finale #finText{font-family:Georgia,serif!important;color:#d8cab0!important}
${K} #recovery h2{font:600 calc(30 * var(--pc-u,1px)) Cinzel,Georgia,serif!important;letter-spacing:.05em!important;color:#ead7b4!important}
${K} #recovery p{font:400 calc(16 * var(--pc-u,1px)) Georgia,serif!important;color:#cdbfa6!important}
${S} :is(${CARD}){border-image:none!important}
${S} :is(${CARD}):is(.on,.chosen,[aria-pressed=true],[aria-selected=true],.premium-selected){border-color:rgba(255,140,70,.65)!important;box-shadow:inset 0 -3px 0 -1px rgba(255,150,70,.9),inset 0 -22px 26px -18px rgba(255,110,40,.55)!important}
${S} :is(${CARD})${ON}{outline:none!important;border-color:rgba(255,150,80,.85)!important;box-shadow:inset 0 -3px 0 -1px rgba(255,170,90,1),inset 0 -26px 30px -18px rgba(255,120,40,.7),0 0 14px 1px rgba(255,110,40,.35)!important}
/* 15.11.2026: banery wyboru rozdzialu w spalonej ramie z okuciami (ten sam standard co deska Przygotuj sie i licznik Popiolow); srodek pusty, ilustracja zostaje */
${S} .m2-ch>.pcg-edge{border:calc(24 * var(--pc-u,1px)) solid transparent!important;border-image:url('assets/ui/5a6a99a0140440ac5856623aed2e2ea738c3d6c97dba954373663177fc20f69f.webp') 48 / calc(24 * var(--pc-u,1px)) stretch!important;opacity:1!important;filter:brightness(.92)!important}
${S} .m2-ch.premium-selected>.pcg-edge{filter:brightness(1.12) saturate(1.15)!important}
${S} .m2-ch:not(:disabled)${ON}>.pcg-edge{filter:brightness(1.3) saturate(1.25) drop-shadow(0 0 5px rgba(255,120,40,.5))!important}
${S} .m2-ch:before{left:calc(22 * var(--pc-u,1px))!important;top:calc(19 * var(--pc-u,1px))!important}
${S} .m2-ch .nb2-meds{right:calc(24 * var(--pc-u,1px))!important;bottom:calc(19 * var(--pc-u,1px))!important}
/* 15.11.2026: napisy rozdzialu przy numerze (lewa strona), ilustracja odslonieta z prawej */
${S} .premium-map .m2-ch{padding-left:calc(58 * var(--pc-u,1px))!important}
${S} .premium-map .m2-ch:after{left:calc(58 * var(--pc-u,1px))!important;bottom:calc(19 * var(--pc-u,1px))!important}
${CAMPAIGN.map(i=>`${S} .premium-map #start${i}{background-image:linear-gradient(90deg,#0d0b10f2 0%,#0d0b10d6 34%,#0d0b1080 62%,#0d0b1026 100%),url('${PREMIUM_ASSETS['rozdzial-'+i+'-mini']}')!important}`).join('\n')}
/* 15.11.2026: dolny pasek wyboru rozdzialu (Kaplica, Kronika, Tryb gry) w spalonej desce jak Przygotuj sie */
${S} :is(#title #kapBtn,#title #kronBtn,#title .pc-journey-mode,#title #pcMainMenuBack){border-color:transparent!important;border-image:none!important;background:${RAMKA} center/100% 100% no-repeat border-box!important;box-shadow:none!important;outline:none!important;animation:none!important}
${S} :is(#title #kapBtn,#title #kronBtn,#title .pc-journey-mode,#title #pcMainMenuBack)${ON}{color:#ffe2b8!important;text-shadow:0 0 10px rgba(255,140,60,.75)!important;background:radial-gradient(ellipse 44% 40% at 50% 58%,rgba(255,118,36,.5),rgba(255,90,30,.16) 60%,rgba(255,90,30,0) 100%) center/86% 74% no-repeat border-box,${RAMKA} center/100% 100% no-repeat border-box!important;animation:nbZarG 1.8s ease-in-out infinite!important}
${S} :is(#title .pc-journey-mode)>small{translate:0 calc(8 * var(--pc-u,1px))!important;font-size:calc(13 * var(--pc-u,1px))!important}
${S} :is(#title .pc-journey-mode)>.nb2-seg{translate:0 calc(2 * var(--pc-u,1px))!important}
${S} .pc-journey-mode .nb2-seg>i.is-on{background:radial-gradient(ellipse 50% 48% at 50% 62%,rgba(255,120,40,.38),rgba(255,120,40,0) 100%)!important;color:#ffe2b8!important;text-shadow:0 0 8px rgba(255,140,60,.7)!important}
${S} .nb2-seg>i{border:none!important;box-shadow:none!important;background:none!important;color:rgba(230,214,184,.55)!important}
${S} .nb2-seg>i.is-on{background:${PAS_ON} center/100% 100% no-repeat!important;color:#f3e2c2!important}
${S} .pc-fantasy-title{border-image:none!important;border-color:transparent!important;background:none!important;box-shadow:none!important;position:relative!important;overflow:visible!important}
${S} .pc-fantasy-title::after{content:''!important;display:block!important;position:absolute!important;left:0!important;right:0!important;width:100%!important;top:100%!important;height:34px!important;transform:translateY(-3px)!important;background:url('assets/ui/e87781cfaa14780d76e1373114c875c6decbcc7790153c52696e97dd6354f281.webp') center/auto 100% no-repeat,url('assets/ui/6912c5b070f1130d9bcc48c7936b6fd3effa4128a0d462ce9145f932770cdce7.webp') left center/calc(50% - 9px) 100% no-repeat,url('assets/ui/789a7c5e5aeb6b48e8a1ff01e6e8a985a2fa162fca2d479e8075b1cd2c5fc64f.webp') right center/calc(50% - 9px) 100% no-repeat!important;filter:brightness(1.15) drop-shadow(0 2px 3px rgba(0,0,0,.8))!important;pointer-events:none!important}
/* glowne akcje: spalona deska z okuciami; zaznaczenie: zar od spodu */
${S} :is(${MAIN}){border-color:transparent!important;border-image:none!important;background:url('assets/ui/1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp') center/100% 100% no-repeat border-box!important;box-shadow:none!important;outline:none!important}
${S} :is(${MAIN})${ON}{box-shadow:none!important;outline:none!important;color:#ffe2b8!important;text-shadow:0 0 10px rgba(255,140,60,.75)!important;background:radial-gradient(ellipse 44% 40% at 50% 58%,rgba(255,118,36,.5),rgba(255,90,30,.16) 60%,rgba(255,90,30,0) 100%) center/86% 74% no-repeat border-box,url('assets/ui/1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp') center/100% 100% no-repeat border-box!important;animation:nbZarG 1.8s ease-in-out infinite!important}
${S} :is(${MAIN})${ON}::before,${S} :is(${MAIN})${ON}::after{box-shadow:none!important;outline:none!important;border:0!important}
@keyframes nbZarG{0%,100%{filter:brightness(1.12) drop-shadow(0 0 4px rgba(255,120,40,.45))}50%{filter:brightness(1.3) saturate(1.2) drop-shadow(0 0 8px rgba(255,130,50,.6))}}
/* panele: zweglona rama z zelaznymi naroznikami */
${S} :is(${PANEL}){border:18px solid transparent!important;border-image:url('assets/ui/39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp') 48 stretch!important;box-shadow:none!important}
${S} :is(${PANEL})>.pcg-edge{display:none!important}

/* licznik Popiolow na kazdym ekranie: ta sama spalona ramka z urna co w menu glownym */
${S} .m2-emb{border:none!important;border-image:none!important;box-shadow:none!important;background:${URNA} 12px center/auto 64% no-repeat,${RAMKA} center/100% 100% no-repeat!important;padding:10px 22px 10px 48px!important;display:flex!important;align-items:center!important;gap:8px!important}
${S} .m2-emb>.m2-ico-emb{background:${URNA} center/contain no-repeat!important;width:30px!important;height:30px!important;filter:none!important}
${S} .pc-fantasy-title::before{display:none!important}
`;document.head.append(st);
}catch(e){quietErr('menuOdswiezenie',e)}})();

// 15.11.2026: nowy standard pozostalych sekcji menu (Kaplica, Kronika, Opcje, Instrukcja, Przygotowanie, Pauza, Awans, Koniec nocy, rozmowy, komunikaty): zakladki i przyciski na spalonej desce, panele w spopielonej ramie z okuciami, karty w spalonej ramie banerow rozdzialow
(()=>{try{const P='#orient'.repeat(300)+' ';const st=document.createElement('style');st.id='nb-menu-standard';st.textContent=`
${P}:is(.tab,.stab,.nbp-tab,.pc-prep-tab,.backar,#kapBack,.premium-back,.go.alt,#dialog button.next,.premium-difficulty,.pc-quick){border-color:transparent!important;border-image:none!important;background:url('assets/ui/1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp') center/100% 100% no-repeat border-box!important;box-shadow:none!important;outline:none!important;animation:none!important;color:#e6d6b8!important}
${P}:is(.tab,.stab,.nbp-tab,.pc-prep-tab,.backar,#kapBack,.premium-back,.go.alt,#dialog button.next,.premium-difficulty,.pc-quick)::before,${P}:is(.tab,.stab,.nbp-tab,.pc-prep-tab,.backar,#kapBack,.premium-back,.go.alt,#dialog button.next,.premium-difficulty,.pc-quick)::after{background:none!important;border:none!important;box-shadow:none!important}
${P}:is(.tab,.stab,.nbp-tab,.pc-prep-tab,.backar,#kapBack,.premium-back,.go.alt,#dialog button.next,.premium-difficulty,.pc-quick)>.pcg-edge{display:none!important}
${P}:is(.tab,.stab,.nbp-tab,.pc-prep-tab,.backar,#kapBack,.premium-back,.go.alt,#dialog button.next,.premium-difficulty,.pc-quick):is(.on,.chosen,[aria-selected=true],[aria-pressed=true]){background:radial-gradient(ellipse 46% 42% at 50% 58%,rgba(255,118,36,.48),rgba(255,90,30,.14) 60%,rgba(255,90,30,0) 100%) center/86% 74% no-repeat,url('assets/ui/1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp') center/100% 100% no-repeat border-box!important;color:#ffe2b8!important;text-shadow:0 0 10px rgba(255,140,60,.75)!important;filter:brightness(1.12) drop-shadow(0 0 6px rgba(255,120,40,.45))!important}
/* panele: spopielona rama z okuciami (jak ilustracja rozdzialu) */
${P}:is(.prepbox,.pc-perk-detail,.pc-option-section,.nb2-diff,#dialog,.premium-prep-controls){border-style:solid!important;border-color:transparent!important;border-image:url('assets/ui/39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp') 48 / 18px stretch!important;box-shadow:none!important}
${P}#dialog{background:linear-gradient(140deg,rgba(22,16,16,.96),rgba(12,9,10,.96)) padding-box!important}
${P}.pc-option-section>.sth{background:linear-gradient(90deg,rgba(90,40,20,.55),rgba(40,20,14,0))!important;border:none!important}
/* karty: spalona rama jak banery rozdzialow */
${P}:is(.m2k-row,#lvl .card,#prep .opt,.pc-run-status){border-style:solid!important;border-color:transparent!important;border-image:url('assets/ui/5a6a99a0140440ac5856623aed2e2ea738c3d6c97dba954373663177fc20f69f.webp') 48 / 16px stretch!important;box-shadow:none!important}
${P}:is(.m2k-row,#lvl .card,#prep .opt,.pc-run-status)>.pcg-edge{display:none!important}
${P}:is(.m2k-row,#lvl .card,#prep .opt):is(.on,.chosen,:focus-visible,.pf){filter:brightness(1.2) saturate(1.15) drop-shadow(0 0 8px rgba(255,120,40,.5))!important}
${P}#lvl .card{border-image-width:22px!important}
/* komunikat: spalona deska */
${P}#msg{background:url('assets/ui/1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp') center/100% 100% no-repeat!important;padding:16px 48px!important;border:none!important;box-shadow:none!important;color:#f0dcb6!important}

${P}:is(.prepbox,.pc-perk-detail,.pc-option-section,.nb2-diff,.premium-prep-controls,.m2k-row,#prep .opt,.pc-run-status){border-width:1px!important}
${P}:is(.m2k-row,#lvl .card,#prep .opt,.nb2-hero):is(.on,.chosen,[aria-pressed=true]),${P}#lvl .card:is(:focus,:focus-visible,.pf){background:radial-gradient(ellipse 70% 40% at 50% 100%,rgba(255,110,40,.28),rgba(255,110,40,0) 70%),linear-gradient(rgba(34,20,14,.94),rgba(13,9,9,.96))!important}
${P}.nb2-hero{border-style:solid!important;border-color:transparent!important;border-image:url('assets/ui/39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp') 48 / 16px stretch!important;box-shadow:none!important}
${P}.nb2-hero{background:radial-gradient(ellipse 70% 40% at 50% 100%,rgba(255,110,40,.22),rgba(255,110,40,0) 70%),linear-gradient(rgba(34,20,14,.94),rgba(13,9,9,.96))!important}

${P}:is(.tab,.stab,.nbp-tab,.pc-prep-tab,.backar,#kapBack,.premium-back,.go.alt,#dialog button.next,.premium-difficulty,.pc-quick):is(:hover,:focus-visible,.pf){background:radial-gradient(ellipse 46% 42% at 50% 58%,rgba(255,118,36,.48),rgba(255,90,30,.14) 60%,rgba(255,90,30,0) 100%) center/86% 74% no-repeat,url('assets/ui/1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp') center/100% 100% no-repeat border-box!important;color:#ffe2b8!important;text-shadow:0 0 10px rgba(255,140,60,.75)!important;animation:nbZarG 1.8s ease-in-out infinite!important}
${P}:is(.m2k-row,#prep .opt):is(:hover,:focus-visible,.pf){filter:brightness(1.2) saturate(1.15) drop-shadow(0 0 8px rgba(255,120,40,.5))!important}
`;document.head.append(st)}catch(e){quietErr('menuStandard',e)}})();
// 15.11.2026: postacie siedzace przy ognisku (ChatGPT, przyciete do obrysu): menu glowne, ekran wyboru postaci, Przygotowanie
const NB_KAMIEN={r:'assets/ui/5603fdc363945b6e1f72befd731652697b1d181fec06a9fd799dfde08b5e531b.webp',k:'assets/ui/a16ceac8b2dc89552536e37b6c5d0a96cfc34b444d368e380608757ddf0968ea.webp',z:'assets/ui/49612738b475e737de403938a3407bf4d2bbfddb9027b56a3fe5d0a4c303295b.webp',d:'assets/ui/115b046f2a37f6cac6ac856d7f245b41a20a2fdc9a953b7b06dcf87445b7daf6.webp',m:'assets/ui/13a16ad21e0568ba857a67f77e55f9fd122ccd9bdfde8d50df586045f73ade4d.webp'},NB_KAMIEN_AR={r:.7,k:.849,z:.677,d:.649,m:.677};
// 14.11.2026: menu glowne - oboz przy ognisku; przy ogniu siedzi ostatnio wybrana postac (prog().char). Tylko wyglad, bez wplywu na nawigacje.
(()=>{try{
 const H=NB_KAMIEN,T=document.getElementById('title');if(!T)return;
 const st=document.createElement('style');st.id='nb-oboz';const Z='#orient'.repeat(150)+' #title.pc-home';
 st.textContent=`${Z}{background-image:none!important;background-color:#08070a!important;isolation:isolate!important}
#title:not(.pc-home)>#nbOboz{display:none}
#nbOboz{position:absolute;left:50%;top:50%;width:max(100%,177.78vh);height:max(100%,56.25vw);transform:translate(-50%,-50%);z-index:-1;pointer-events:none;overflow:hidden}
#nbOboz>i{position:absolute;display:block}
#nbOboz .tlo{inset:0;background:url('assets/ui/3bd17f48aa2077bfee3633ea875fb4407ca63c0374c52d2fd8e34176d9728747.webp') center/100% 100% no-repeat}
#nbOboz .cien{inset:0;background:linear-gradient(90deg,rgba(8,7,10,.82) 0%,rgba(8,7,10,.7) 38%,rgba(8,7,10,.38) 62%,rgba(8,7,10,.08) 80%,rgba(8,7,10,0) 100%),linear-gradient(0deg,rgba(8,7,10,.55),rgba(8,7,10,0) 30%)}
#nbOboz .luna{left:62%;top:42%;width:34%;height:46%;background:radial-gradient(ellipse at 50% 55%,rgba(255,140,60,.28),rgba(255,110,40,0) 65%);mix-blend-mode:screen;animation:nbLuna 2.3s ease-in-out infinite}
#nbOboz .ogA,#nbOboz .ogB{left:74.9%;top:42%;width:8.4%;height:20%;background:url('assets/ui/69da6ff24de1c6408c4b15f672aea07db6bb74453ed8ea4625dc930ff290c17f.webp') 0 0/400% 200% no-repeat;mix-blend-mode:screen;opacity:.95}
#nbOboz canvas.isk{position:absolute;inset:0;width:100%;height:100%}
#nbOboz .bohater{left:68.3%;bottom:17%;height:31%;aspect-ratio:var(--ar,.9);background:center bottom/contain no-repeat;transform-origin:50% 100%;filter:brightness(.94);animation:nbOddech 4.2s ease-in-out infinite,nbBlask 2.3s ease-in-out infinite}
#nbOboz .kontakt{left:67.3%;bottom:15.4%;width:15%;height:4.5%;background:radial-gradient(closest-side,rgba(6,3,2,.85),rgba(6,3,2,.45) 55%,rgba(6,3,2,0));filter:blur(2px)}
#nbOboz .mgla{left:61%;bottom:11.5%;width:27%;height:12%;background:url('assets/ui/b5aa0b5f36f083311f26a7dd935871b17ce548e28b3915092de5be30df5207be.webp') center/100% 100% no-repeat;opacity:.6;filter:sepia(.4) brightness(.85);animation:nbMgla 14s ease-in-out infinite alternate}
#nbOboz .ziarno{inset:0;background:url('assets/ui/7c8deda4dcbd2ff1b4e8381167626c58a6e734b1cd9bdc331a3399749f2b8595.webp') 0 0/256px 256px repeat;mix-blend-mode:overlay;opacity:.13;animation:nbZiarno .5s steps(1) infinite}
#nbOboz .bohater.lustro{transform:scaleX(-1)}
@keyframes nbLuna{0%,100%{opacity:.85}45%{opacity:1}70%{opacity:.75}}
@keyframes nbOddech{0%,100%{scale:1 1}50%{scale:1 1.012}}
@keyframes nbBlask{0%,100%{filter:brightness(.9)}50%{filter:brightness(1.02)}}
@keyframes nbMgla{from{translate:-3% 0}to{translate:3% -4%}}
@keyframes nbZiarno{0%{background-position:0 0}20%{background-position:-61px 37px}40%{background-position:83px -29px}60%{background-position:-17px -91px}80%{background-position:45px 70px}}`;
 document.head.append(st);
 const box=document.createElement('div');box.id='nbOboz';box.setAttribute('aria-hidden','true');
 box.innerHTML='<i class="tlo"></i><i class="cien"></i><i class="luna"></i><i class="ogA"></i><i class="ogB"></i><i class="kontakt"></i><i class="bohater"></i><i class="mgla"></i><i class="ziarno"></i><canvas class="isk"></canvas>';T.prepend(box);
 const AR=NB_KAMIEN_AR,LUSTRO={z:1,d:1};
 const hero=box.querySelector('.bohater');
 const pokaz=()=>{let c='r';try{const q=prog();if(q&&H[q.char])c=q.char}catch(e){}if(hero.dataset.c===c)return;hero.dataset.c=c;hero.style.backgroundImage=`url('${H[c]}')`;hero.style.setProperty('--ar',AR[c]);hero.classList.toggle('lustro',!!LUSTRO[c])};
 pokaz();new MutationObserver(pokaz).observe(T,{attributes:true,attributeFilter:['hidden','class']});
// 15.11.2026: ten sam ogien co na ekranie wyboru postaci (plynne przejscie klatek, iskry, migotanie swiatla), zamiast starego 8-klatkowego
 {const oA=box.querySelector('.ogA'),oB=box.querySelector('.ogB'),luna=box.querySelector('.luna'),CVs=box.querySelector('canvas.isk'),CXs=CVs.getContext('2d'),RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isk=[],t0=performance.now(),flT=1,fl=1,anim=0;const poz=f=>`${(f%4)*100/3}% ${f<4?0:100}%`;
  const widoczne=()=>!T.hidden&&T.classList.contains('pc-home');
  const kl=now=>{if(!widoczne()){anim=0;return}const t=(now-t0)/100,f=Math.floor(t)%8,m=t%1;oA.style.backgroundPosition=poz(f);oB.style.backgroundPosition=poz((f+1)%8);oA.style.opacity=String(.95*(1-m));oB.style.opacity=String(.95*m);
   if(Math.random()<.08)flT=.93+Math.random()*.14;fl+=(flT-fl)*.12;luna.style.opacity=String(Math.min(1,.8*fl));
   const w=CVs.width=box.clientWidth,h=CVs.height=box.clientHeight;CXs.clearRect(0,0,w,h);
   if(isk.length<40&&Math.random()<.2)isk.push({x:w*(.792+(Math.random()-.5)*.02),y:h*.56,vx:(Math.random()-.5)*w*.00022,vy:-h*(.0004+Math.random()*.0007),l:1,r:w*(.0006+Math.random()*.001)});
   isk=isk.filter(q=>(q.l-=.0028+Math.random()*.002)>0);for(const q of isk){q.vx+=(Math.random()-.5)*w*.00003;q.x+=q.vx;q.y+=q.vy;CXs.fillStyle=`rgba(255,${150+60*q.l|0},70,${q.l*q.l})`;CXs.shadowColor='rgba(255,110,30,.9)';CXs.shadowBlur=q.r*5;CXs.beginPath();CXs.arc(q.x,q.y,q.r,0,7);CXs.fill()}
   anim=requestAnimationFrame(kl)};
  const start=()=>{if(RM){oA.style.backgroundPosition=poz(0);oA.style.opacity='.95';oB.style.opacity='0';return}if(!anim&&widoczne()){t0=performance.now();anim=requestAnimationFrame(kl)}};
  start();new MutationObserver(start).observe(T,{attributes:true,attributeFilter:['hidden','class']})}
}catch(e){quietErr('menuOboz',e)}})();
// 15.11.2026: ekran wyboru postaci przy ognisku (Graj -> Ognisko -> Wybor rozdzialu) oraz nowe Przygotowanie (perk, wyzwanie, klatwy, trudnosc).
// Warstwy rysowane w #title i #prep; stan i zapis przez te same zmienne co dotad (PREP, prog(), saveProg, renderPrep). Noc dnia i tygodnia: dawny ekran.
(()=>{try{
 const title=$('title'),prep=$('prep');if(!title||!prep)return;
 const T=(p,e)=>EN?e:p,U='assets/ui/',
  IMG={tlo:U+'c36d0b47cc7bd406ab997737de97057d8ea274fd95f49b90117995447fd04c18.webp',ogien:U+'69da6ff24de1c6408c4b15f672aea07db6bb74453ed8ea4625dc930ff290c17f.webp',pal:U+'3e3a4da2d47934c69d63f853e652a96902874c0dafd9b25f93feccc3b334dc70.webp',
   deska:U+'1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp',rama:U+'39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp',karta:U+'5a6a99a0140440ac5856623aed2e2ea738c3d6c97dba954373663177fc20f69f.webp',
   urna:U+'bec1edb981cde86153bfc1f97330a541237d7963c2926133284dbc3f9ef457bf.webp',moneta:U+'e2eeee3e0c4a316695cb8aa6c276d73706d760b3079f90021c7c443c9f68a5c0.png',ziarno:U+'7c8deda4dcbd2ff1b4e8381167626c58a6e734b1cd9bdc331a3399749f2b8595.webp',mgla:U+'b5aa0b5f36f083311f26a7dd935871b17ce548e28b3915092de5be30df5207be.webp'},
  ORDER=['k','m','r','z','d'],POS={k:[13.6,37],m:[31.8,41],r:[50,40.5],z:[68.2,38.5],d:[86.4,41]},
  FACE={k:[.56,.12],m:[.55,.11],r:[.5,.11],z:[.46,.13],d:[.3,.16]},
  OPIS={r:T('Miecz: szybki i zwrotny, wyważony styl walki.','Sword: quick and agile, the balanced way to fight.'),
   k:T('Topór: wolny i ciężki. +25% życia, mocniejsze ciosy i dłuższe ogłuszenie po parowaniu.','Axe: slow and heavy. +25% health, harder hits and a longer stun after a parry.'),
   z:T('Dwie szable: błyskawiczne serie, szybki ruch i uniki. −25% życia.','Twin sabres: lightning-fast combos, quick movement and dodges. −25% health.'),
   d:T('Młot: ciężkie, świadome ciosy, +15% życia. Co trzecie parowanie uwalnia ogłuszający ton.','Hammer: heavy, deliberate blows, +15% health. Every third parry releases a stunning toll.'),
   m:T('Lichtarz-włócznia: duży zasięg i kontrola pola. Parowania ładują Żywy Knot, silny atak zostawia pas gorącego wosku.','Candlestick spear: long reach and area control. Parries charge the Living Wick; a heavy blow leaves a strip of hot wax.')},
  STYL={r:T('Walka w zwarciu · miecz · garda','Melee · sword · guard'),k:T('Walka w zwarciu · topór · łańcuch','Melee · axe · chain'),z:T('Szybkie serie · dwie szable · uniki','Fast combos · twin sabres · dodges'),d:T('Walka w zwarciu · parowanie · ogłuszenie','Melee · parry · stun'),m:T('Zasięg włóczni · wosk · kontrola pola','Spear reach · wax · area control')},
  TECH={r:['wypad','whirl'],k:['leap','hook'],z:['rend','fan','ldance'],d:['zalecho','zastaw'],m:['odlew','dogasanie']},
  O='#orient'.repeat(400),mk=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e},
  esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
  hero=c=>HEROES[c]||HEROES.r,cur=()=>{try{return charId()}catch(e){return 'r'}},
  ruch=!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const st=document.createElement('style');st.id='nb-oboz-przygotowanie';st.textContent=`
${O} #title.nbw-on>:not(#nbW),${O} #prep.nbp-on>:not(#nbP){display:none!important}
${O} #nbW,${O} #nbP{position:fixed!important;inset:0!important;z-index:60!important;background:#050406!important;color:#e6d6b8!important;font-family:Georgia,'Times New Roman',serif!important;overflow:hidden!important;user-select:none!important;-webkit-user-select:none!important}
${O} #nbW[hidden],${O} #nbP[hidden]{display:none!important}
${O} #nbW .nst,${O} #nbP .nst{position:absolute!important;left:50%!important;top:50%!important;width:min(100vw,177.78vh)!important;height:min(100vh,56.25vw)!important;transform:translate(-50%,-50%)!important;overflow:hidden!important;--u:calc(min(100vw,177.78vh)/1920)!important;--fl:1!important;font-size:calc(16*var(--u))!important}
${O} #nbW i,${O} #nbP i{font-style:normal!important}
${O} #nbW .nw,${O} #nbP .nw{position:absolute!important;pointer-events:none!important;display:block!important}
${O} #nbW button,${O} #nbP button{font:inherit!important;color:inherit!important;background:none!important;border:none!important;padding:0!important;margin:0!important;cursor:pointer!important;text-align:left!important;outline:none!important}
${O} #nbW button:focus-visible{outline:none!important}/* 15.11.2026: wybor postaci bez zlotej ramki, wystarcza podswietlenie sylwetki */
${O} #nbP button:focus-visible{outline:calc(2*var(--u)) solid rgba(240,190,120,.85)!important;outline-offset:calc(3*var(--u))!important}
${O} .nbd{background:url('${IMG.deska}') center/100% 100% no-repeat!important;font:700 calc(18.5*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.12em!important;color:#e6d6b8!important;text-shadow:0 2px 3px #000!important;text-align:center!important;filter:brightness(.86)!important}
${O} .nbd:hover,${O} .nbd:focus-visible{filter:brightness(1.08)!important}
${O} .nbd.zn{filter:brightness(1.14) drop-shadow(0 0 calc(6*var(--u)) rgba(255,120,40,.45))!important;color:#ffe2b8!important;text-shadow:0 0 calc(10*var(--u)) rgba(255,140,60,.75)!important;background:radial-gradient(ellipse 46% 42% at 50% 58%,rgba(255,118,36,.48),rgba(255,90,30,.14) 60%,rgba(255,90,30,0) 100%) center/86% 74% no-repeat,url('${IMG.deska}') center/100% 100% no-repeat!important}
${O} .nbd.gl{filter:none!important;color:#ffe2b8!important;text-shadow:0 0 calc(12*var(--u)) rgba(255,140,60,.8)!important;background:radial-gradient(ellipse 44% 40% at 50% 58%,rgba(255,118,36,.58),rgba(255,90,30,.16) 60%,rgba(255,90,30,0) 100%) center/86% 74% no-repeat,url('${IMG.deska}') center/100% 100% no-repeat!important;animation:nbwZr 1.8s ease-in-out infinite!important}
${O} .nbd.gl small{display:block!important;margin-top:calc(6*var(--u))!important;font:600 calc(12.5*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.2em!important;color:#cdb48c!important;text-shadow:none!important}
${O} .nbr{border:calc(18*var(--u)) solid transparent!important;border-image:url('${IMG.rama}') 48 stretch!important;background:linear-gradient(180deg,rgba(13,10,10,.9),rgba(8,6,7,.94)) padding-box!important}
${O} .nbk{border:calc(12*var(--u)) solid transparent!important;border-image:url('${IMG.karta}') 48 stretch!important;background:rgba(18,13,12,.82) padding-box!important}
${O} .nbt{position:absolute!important;left:0!important;right:0!important;top:calc(30*var(--u))!important;text-align:center!important;pointer-events:none!important}
${O} .nbt b{display:block!important;font:600 calc(48*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.17em!important;color:#e8d4ad!important;text-shadow:0 0 calc(20*var(--u)) rgba(255,120,40,.25),0 2px 6px #000!important;padding-left:.17em!important}
${O} .nbt .sep{display:block!important;width:calc(620*var(--u))!important;height:calc(34*var(--u))!important;margin:calc(4*var(--u)) auto 0!important;background:url('assets/ui/e87781cfaa14780d76e1373114c875c6decbcc7790153c52696e97dd6354f281.webp') center/auto 100% no-repeat,url('assets/ui/6912c5b070f1130d9bcc48c7936b6fd3effa4128a0d462ce9145f932770cdce7.webp') left center/calc(50% - 9px) 100% no-repeat,url('assets/ui/789a7c5e5aeb6b48e8a1ff01e6e8a985a2fa162fca2d479e8075b1cd2c5fc64f.webp') right center/calc(50% - 9px) 100% no-repeat!important;filter:brightness(1.15) drop-shadow(0 2px 3px rgba(0,0,0,.8))!important}
${O} .nbt span{display:block!important;margin-top:calc(8*var(--u))!important;font:600 calc(16.5*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.22em!important;color:#c8b694!important}
${O} .nbt span.it{font:italic calc(19*var(--u))/1 Georgia,serif!important;letter-spacing:0!important}
${O} .nbur,${O} .nbmo{display:inline-block!important;width:1.3em!important;height:1.3em!important;vertical-align:-.3em!important;background:center/contain no-repeat!important;margin-right:.15em!important}
${O} .nbur{background-image:url('${IMG.urna}')!important}${O} .nbmo{background-image:url('${IMG.moneta}')!important}
${O} .nbzi{inset:0!important;background:url('${IMG.ziarno}') 0 0/256px 256px repeat!important;mix-blend-mode:overlay!important;opacity:.1!important;z-index:80!important;animation:nbwZi .5s steps(1) infinite!important}
/* ---- ognisko ---- */
${O} #nbW .ntlo{left:-3%!important;right:-3%!important;top:-2%!important;bottom:-2%!important;background:url('${IMG.tlo}') center 62%/cover no-repeat!important;transition:transform 1.4s cubic-bezier(.2,.7,.2,1)!important;filter:brightness(.92) saturate(1.05)!important}
${O} #nbW .nie{inset:0!important;background:linear-gradient(180deg,rgba(6,5,8,.78) 0%,rgba(6,5,8,.25) 18%,rgba(6,5,8,0) 32%),linear-gradient(0deg,rgba(6,5,8,.9) 0%,rgba(6,5,8,.35) 16%,rgba(6,5,8,0) 32%),linear-gradient(90deg,rgba(6,5,8,.55),rgba(6,5,8,0) 16%,rgba(6,5,8,0) 84%,rgba(6,5,8,.55))!important}
${O} #nbW .bla{left:18%!important;right:18%!important;top:48%!important;bottom:-10%!important;background:radial-gradient(ellipse 50% 46% at 50% 82%,rgba(255,138,52,.42),rgba(255,98,30,.14) 45%,rgba(255,90,30,0) 72%)!important;mix-blend-mode:screen!important;opacity:calc(.75 + 1.4 * (var(--fl) - 1))!important}
${O} #nbW .mg{left:-5%!important;right:-5%!important;bottom:22%!important;height:20%!important;background:url('${IMG.mgla}') center/100% 100% no-repeat!important;opacity:.32!important;filter:sepia(.3) brightness(.8)!important;animation:nbwMg 18s ease-in-out infinite alternate!important}
${O} #nbW .nwin{inset:0!important;background:radial-gradient(ellipse 75% 70% at 50% 52%,rgba(0,0,0,0) 55%,rgba(0,0,0,.55))!important;z-index:79!important}
${O} #nbW .rz{position:absolute!important;inset:0!important;transition:transform 1.4s cubic-bezier(.2,.7,.2,1)!important}
${O} #nbW .bo{position:absolute!important;bottom:37%!important;translate:-50% 0!important;aspect-ratio:var(--ar)!important;cursor:pointer!important;transform-origin:50% 100%!important;--b:.56!important;--s:.72!important}
${O} #nbW .bo .ci{position:absolute!important;left:-6%!important;right:-6%!important;bottom:-2.2%!important;height:9%!important;background:radial-gradient(closest-side,rgba(4,2,2,.9),rgba(4,2,2,.45) 55%,rgba(4,2,2,0))!important;filter:blur(calc(3*var(--u)))!important}
${O} #nbW .bo .pod{position:absolute!important;left:-30%!important;right:-30%!important;bottom:-8%!important;height:22%!important;background:radial-gradient(closest-side,rgba(255,120,40,.38),rgba(255,90,30,0))!important;mix-blend-mode:screen!important;opacity:0!important;transition:opacity .5s!important}
${O} #nbW .bo .im{position:absolute!important;inset:0!important;background-position:center bottom!important;background-size:100% 100%!important;background-repeat:no-repeat!important;transform-origin:50% 100%!important;animation:nbwOd 4.6s ease-in-out infinite!important;filter:brightness(calc(var(--b) * (.92 + 1.2 * (var(--fl) - 1)))) saturate(var(--s)) sepia(.08)!important;transition:filter .45s,scale .45s!important}
${O} #nbW .bo:hover{--b:.74!important;--s:.85!important}
${O} #nbW .bo.wyb{--b:1.06!important;--s:1.05!important}
${O} #nbW .bo.wyb .im{scale:1.04!important;filter:brightness(calc(var(--b) * (.96 + 1.2 * (var(--fl) - 1)))) saturate(var(--s)) drop-shadow(0 0 calc(2*var(--u)) rgba(255,170,90,.95)) drop-shadow(0 0 calc(20*var(--u)) rgba(255,110,40,.45))!important}
${O} #nbW .bo.wyb .pod{opacity:1!important}
${O} #nbW .bo.potw .im{animation:nbwOd 4.6s ease-in-out infinite,nbwPotw .9s ease-out!important}
${O} #nbW.potw .bo:not(.wyb){--b:.32!important;--s:.5!important}
${O} #nbW .nwt{position:absolute!important;top:62.6%!important;translate:-50% 0!important;width:calc(226*var(--u))!important;height:calc(56*var(--u))!important;font-size:calc(17*var(--u))!important;z-index:50!important}
${O} #nbW .npal{left:50%!important;bottom:5%!important;width:21%!important;aspect-ratio:1!important;translate:-50% 0!important;background:url('${IMG.pal}') center/100% 100% no-repeat!important;z-index:40!important;filter:brightness(calc(.9 + 1.5 * (var(--fl) - 1)))!important}
${O} #nbW .npl{left:50%!important;bottom:12.9%!important;width:14.5%!important;aspect-ratio:384/512!important;translate:-50% 0!important;background:url('${IMG.ogien}') 0 0/400% 200% no-repeat!important;mix-blend-mode:screen!important;z-index:41!important}
${O} #nbW canvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:42!important;mix-blend-mode:screen!important;pointer-events:none!important}
${O} #nbW .wroc{position:absolute!important;left:2.2%!important;top:3.4%!important;width:calc(200*var(--u))!important;height:calc(60*var(--u))!important;z-index:60!important}
${O} #nbW .wyb2{position:absolute!important;right:3%!important;bottom:7%!important;width:calc(400*var(--u))!important;height:calc(104*var(--u))!important;font-size:calc(28*var(--u))!important;z-index:60!important}
${O} #nbW .pan{position:absolute!important;left:2.2%!important;bottom:2.6%!important;width:calc(640*var(--u))!important;z-index:60!important;padding:calc(8*var(--u)) calc(22*var(--u)) calc(8*var(--u))!important}
${O} #nbW .pan .nin{transition:opacity .25s,translate .25s!important}
${O} #nbW .pan.zm .nin{opacity:0!important;translate:0 calc(6*var(--u))!important}
${O} #nbW .kl{font:700 calc(32*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.08em!important;color:#dcb877!important;text-shadow:0 0 calc(14*var(--u)) rgba(255,120,40,.3),0 2px 4px #000!important}
${O} #nbW .imi{font:italic calc(19*var(--u))/1.3 Georgia,serif!important;color:#d0bc94!important;margin:calc(4*var(--u)) 0 calc(8*var(--u))!important}
${O} #nbW .mot{font:italic calc(15*var(--u))/1.35 Georgia,serif!important;color:#c9b88f!important;margin:calc(-2*var(--u)) 0 calc(7*var(--u))!important;padding-left:calc(10*var(--u))!important;border-left:calc(2*var(--u)) solid rgba(201,164,90,.45)!important;min-height:2.7em!important}
${O} #nbW .nop{font-size:calc(16.5*var(--u))!important;line-height:1.4!important;color:#ecdcbc!important;min-height:2.8em!important}
${O} #nbW .sty{margin-top:calc(5*var(--u))!important;font:600 calc(13*var(--u))/1.4 Cinzel,Georgia,serif!important;letter-spacing:.14em!important;color:#b9a789!important}
${O} #nbW .nte{display:flex!important;gap:calc(10*var(--u))!important;margin-top:calc(8*var(--u))!important}
${O} #nbW .nte>div{flex:1!important;display:flex!important;align-items:center!important;gap:calc(10*var(--u))!important;padding:calc(2*var(--u)) calc(6*var(--u))!important;min-width:0!important}
${O} #nbW .nte img{width:calc(38*var(--u))!important;height:calc(38*var(--u))!important;object-fit:contain!important;flex:none!important}
${O} #nbW .nte b{font:700 calc(15.5*var(--u))/1.15 Cinzel,Georgia,serif!important;color:#f2dfba!important}
${O} #nbW .nte.tri b{font-size:calc(13*var(--u))!important;letter-spacing:0!important}${O} #nbW .nte.tri>div{gap:calc(7*var(--u))!important;padding:calc(2*var(--u)) calc(4*var(--u))!important}${O} #nbW .nte.tri img{width:calc(34*var(--u))!important;height:calc(34*var(--u))!important}
/* ---- przygotowanie ---- */
${O} #nbP .ntlo{inset:-2%!important;background:url('${IMG.tlo}') center 60%/cover no-repeat!important;filter:blur(calc(7*var(--u))) brightness(.34) saturate(.9)!important}
${O} #nbP .cie{inset:0!important;background:radial-gradient(ellipse 70% 60% at 50% 45%,rgba(5,4,6,.15),rgba(5,4,6,.75)),linear-gradient(0deg,rgba(5,4,6,.85),rgba(5,4,6,0) 28%)!important}
${O} #nbP .zar{left:20%!important;right:20%!important;bottom:-8%!important;height:30%!important;background:radial-gradient(ellipse at 50% 100%,rgba(255,110,36,.22),rgba(255,90,30,0) 70%)!important}
${O} #nbP .wroc{position:absolute!important;left:calc(60*var(--u))!important;top:calc(36*var(--u))!important;width:calc(200*var(--u))!important;height:calc(58*var(--u))!important}
${O} #nbP .boh{position:absolute!important;right:calc(60*var(--u))!important;top:calc(26*var(--u))!important;display:flex!important;align-items:center!important;gap:calc(14*var(--u))!important}
${O} #nbP .ntw{width:calc(76*var(--u))!important;height:calc(76*var(--u))!important;border-radius:50%!important;background-repeat:no-repeat!important;background-color:#160f0c!important;box-shadow:0 0 0 calc(2*var(--u)) #8a6a3c,0 0 0 calc(4*var(--u)) #1a120d,0 0 calc(18*var(--u)) rgba(255,120,40,.35)!important}
${O} #nbP .boh b{display:block!important;font:700 calc(22*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.12em!important;color:#dcb877!important}
${O} #nbP .boh span{display:block!important;margin-top:calc(5*var(--u))!important;font:italic calc(16*var(--u))/1 Georgia,serif!important;color:#d0bf9c!important}
${O} #nbP .zmien{width:calc(130*var(--u))!important;height:calc(44*var(--u))!important;font-size:calc(13.5*var(--u))!important}
${O} #nbP .kol{position:absolute!important;top:calc(158*var(--u))!important;width:calc(560*var(--u))!important;height:calc(704*var(--u))!important;padding:calc(10*var(--u)) calc(16*var(--u)) calc(14*var(--u))!important;display:flex!important;flex-direction:column!important}
${O} #nbP .nk1{left:calc(80*var(--u))!important}${O} #nbP .nk2{left:calc(680*var(--u))!important}${O} #nbP .nk3{left:calc(1280*var(--u))!important}
${O} #nbP .kol:focus-within{filter:drop-shadow(0 0 calc(14*var(--u)) rgba(255,120,40,.18))!important}
${O} #nbP .nhd{display:flex!important;align-items:center!important;gap:calc(12*var(--u))!important;padding-bottom:calc(10*var(--u))!important;border-bottom:1px solid rgba(201,160,100,.22)!important}
${O} #nbP .nr{width:calc(40*var(--u))!important;height:calc(40*var(--u))!important;flex:none!important;display:grid!important;place-items:center!important;font:700 calc(17*var(--u))/1 Cinzel,Georgia,serif!important;color:#e8c690!important;border:1px solid rgba(201,160,100,.55)!important;rotate:45deg!important}
${O} #nbP .nr>i{rotate:-45deg!important}
${O} #nbP .tt{flex:1!important;min-width:0!important}
${O} #nbP .tt b{display:block!important;font:700 calc(23*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.16em!important;color:#e6d2ab!important}
${O} #nbP .tt span{display:block!important;margin-top:calc(6*var(--u))!important;font:italic calc(15*var(--u))/1.2 Georgia,serif!important;color:#c8b694!important}
${O} #nbP .licz{font:700 calc(17*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.08em!important;padding:calc(7*var(--u)) calc(11*var(--u))!important;border:1px solid rgba(201,160,100,.4)!important;color:#cdb48c!important;white-space:nowrap!important}
${O} #nbP .licz.ok{color:#ffd9a0!important;border-color:rgba(255,150,70,.7)!important;box-shadow:0 0 calc(10*var(--u)) rgba(255,120,40,.3) inset!important}
${O} #nbP .gn{margin:calc(12*var(--u)) 0!important;height:calc(146*var(--u))!important;position:relative!important;display:flex!important;gap:calc(14*var(--u))!important;align-items:center!important;padding:calc(6*var(--u)) calc(12*var(--u))!important;flex:none!important}
${O} #nbP .gn .et{position:absolute!important;right:calc(10*var(--u))!important;top:calc(6*var(--u))!important;font:600 calc(12.5*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.22em!important;color:#8f806a!important}
${O} #nbP .gn.wy .et{color:#ffb070!important}
${O} #nbP .gn img{width:calc(84*var(--u))!important;height:calc(84*var(--u))!important;object-fit:contain!important;flex:none!important;filter:drop-shadow(0 0 calc(10*var(--u)) rgba(0,0,0,.8))!important}
${O} #nbP .gn b{display:block!important;font:700 calc(23*var(--u))/1.1 Cinzel,Georgia,serif!important;color:#f0dcb6!important;margin-bottom:calc(8*var(--u))!important}
${O} #nbP .gn .ntx>span{display:block!important;font-size:calc(16.5*var(--u))!important;line-height:1.35!important;color:#ecdcbc!important}
${O} #nbP .gn.pu{justify-content:center!important;text-align:center!important;background:rgba(10,8,8,.6) padding-box!important;filter:brightness(.8)!important}
${O} #nbP .gn.pu b{font-size:calc(17*var(--u))!important;color:#b3a283!important;letter-spacing:.1em!important}
${O} #nbP .gn.pu .ntx>span{color:#8f826d!important;font-style:italic!important}
${O} #nbP .gn.wy{background:radial-gradient(ellipse 60% 90% at 20% 50%,rgba(140,55,18,.5),rgba(26,14,10,.92)) padding-box!important}
${O} #nbP .plus{color:#bcd59c!important}${O} #nbP .minus{color:#eaa58f!important}${O} #nbP .zl{color:#f0c27a!important}
${O} #nbP .npg{flex:1!important;display:grid!important;grid-template-columns:1fr 1fr!important;grid-template-rows:repeat(4,1fr)!important;gap:calc(8*var(--u))!important;min-height:0!important}
${O} #nbP .npk{display:flex!important;align-items:center!important;gap:calc(10*var(--u))!important;padding:calc(2*var(--u)) calc(10*var(--u)) calc(2*var(--u)) calc(6*var(--u))!important;position:relative!important;min-height:0!important;background:linear-gradient(90deg,rgba(6,4,4,.92),rgba(30,20,16,.75)) padding-box!important}
${O} #nbP .npk>div{min-width:0!important}
${O} #nbP .npk img{width:calc(58*var(--u))!important;height:calc(58*var(--u))!important;object-fit:contain!important;flex:none!important;filter:drop-shadow(0 0 calc(6*var(--u)) rgba(0,0,0,.9))!important}
${O} #nbP .npk b{display:block!important;font:700 calc(17*var(--u))/1.15 Cinzel,Georgia,serif!important;color:#f2dfba!important;text-shadow:0 1px 2px #000!important}
${O} #nbP .npk small{display:block!important;margin-top:calc(4*var(--u))!important;font-size:calc(14*var(--u))!important;color:#b3a283!important}
${O} #nbP .npk.za{filter:grayscale(.9) brightness(.5)!important;cursor:default!important}
${O} #nbP .npk:not(.za):hover,${O} #nbP .npk:not(.za):focus-visible{filter:brightness(1.18)!important}
${O} #nbP .npk.zn{background:linear-gradient(90deg,rgba(160,62,20,.7),rgba(40,18,10,.9)) padding-box!important;filter:drop-shadow(0 0 calc(8*var(--u)) rgba(255,120,40,.45))!important}
${O} #nbP .npk.zn b{color:#ffe2b8!important}
${O} #nbP .npk.zn::before{content:'✓'!important;position:absolute!important;top:0!important;right:calc(2*var(--u))!important;font:700 calc(15*var(--u))/1 Georgia,serif!important;color:#ffb070!important}
${O} #nbP .ls{flex:1!important;display:flex!important;flex-direction:column!important;gap:calc(6*var(--u))!important;min-height:0!important;overflow-y:auto!important;padding:calc(2*var(--u)) calc(8*var(--u)) calc(2*var(--u)) calc(2*var(--u))!important;scrollbar-width:thin!important;scrollbar-color:#7a5530 rgba(255,255,255,.04)!important}
${O} #nbP .wz{display:grid!important;grid-template-columns:1fr auto!important;column-gap:calc(12*var(--u))!important;row-gap:calc(5*var(--u))!important;align-items:center!important;flex:none!important;position:relative!important;min-height:calc(80*var(--u))!important;padding:calc(6*var(--u)) calc(12*var(--u)) calc(6*var(--u)) calc(30*var(--u))!important;background:linear-gradient(90deg,rgba(6,4,4,.92),rgba(30,20,16,.75)) padding-box!important}
${O} #nbP .wz::before{content:''!important;position:absolute!important;left:calc(6*var(--u))!important;top:50%!important;translate:0 -50%!important;width:calc(14*var(--u))!important;height:calc(14*var(--u))!important;border:1px solid rgba(201,160,100,.5)!important;rotate:45deg!important}
${O} #nbP .wz b{font:700 calc(17*var(--u))/1.1 Cinzel,Georgia,serif!important;color:#f2dfba!important;text-shadow:0 1px 2px #000!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
${O} #nbP .wz .nop{grid-column:1/-1!important;font-size:calc(15.5*var(--u))!important;line-height:1.3!important;color:#d9c9a8!important}
${O} #nbP .wz .ef{grid-column:1/-1!important;font-size:calc(15.5*var(--u))!important;line-height:1.3!important;color:#eaa58f!important}
${O} #nbP .wz .nb{font:700 calc(16.5*var(--u))/1 Cinzel,Georgia,serif!important;white-space:nowrap!important;color:#f0c27a!important}
${O} #nbP .wz .nb+.nb{margin-left:calc(8*var(--u))!important}
${O} #nbP .wz .nb .nbur,${O} #nbP .wz .nb .nbmo{width:1.45em!important;height:1.45em!important;vertical-align:-.42em!important}
${O} #nbP .wz:hover,${O} #nbP .wz:focus-visible{background:linear-gradient(90deg,rgba(30,18,14,.95),rgba(55,34,24,.8)) padding-box!important}
${O} #nbP .wz.zn{background:linear-gradient(90deg,rgba(160,62,20,.7),rgba(40,18,10,.9)) padding-box!important;filter:drop-shadow(0 0 calc(6*var(--u)) rgba(255,120,40,.35))!important}
${O} #nbP .wz.zn b{color:#ffe2b8!important}${O} #nbP .wz.zn .nop{color:#efdcb8!important}
${O} #nbP .wz.zn::before{background:#ff9a4a!important;border-color:#ffc080!important;box-shadow:0 0 calc(8*var(--u)) rgba(255,130,50,.8)!important}
${O} #nbP .wz.npe{opacity:.4!important}
${O} #nbP .trzy{margin:calc(12*var(--u)) 0 calc(14*var(--u))!important;height:calc(124*var(--u))!important;display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:calc(10*var(--u))!important;flex:none!important}
${O} #nbP .nsk{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;padding:calc(6*var(--u))!important;gap:calc(8*var(--u))!important}
${O} #nbP .nsk .nik{width:calc(44*var(--u))!important;height:calc(44*var(--u))!important;display:grid!important;place-items:center!important;font:700 calc(24*var(--u))/1 Cinzel,Georgia,serif!important;color:#c04a2c!important;border:1px solid rgba(200,80,50,.5)!important;rotate:45deg!important;background:radial-gradient(circle,rgba(120,20,10,.5),rgba(20,6,6,.8))!important}
${O} #nbP .nsk .nik>i{rotate:-45deg!important}
${O} #nbP .nsk b{font:700 calc(15.5*var(--u))/1.1 Cinzel,Georgia,serif!important;color:#f6dcbc!important}
${O} #nbP .nsk.pu{background:rgba(8,6,6,.7) padding-box!important;filter:brightness(.6)!important}
${O} #nbP .nsk.pu .nik{border-color:rgba(201,160,100,.3)!important;background:none!important;color:rgba(201,160,100,.4)!important}
${O} #nbP .nsk.pu b{color:#9a8b72!important;font:italic calc(14*var(--u))/1 Georgia,serif!important}
${O} #nbP .nmn{text-align:center!important;margin:calc(-4*var(--u)) 0 calc(8*var(--u))!important;font:700 calc(15.5*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.1em!important;color:#c8b694!important}
${O} #nbP .nmn em{font-style:normal!important;color:#f0c27a!important}
${O} #nbP .ntr{position:absolute!important;left:calc(80*var(--u))!important;top:calc(886*var(--u))!important;width:calc(760*var(--u))!important;height:calc(170*var(--u))!important;padding:calc(6*var(--u)) calc(16*var(--u))!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:calc(8*var(--u))!important}
${O} #nbP .ntr .rw{display:flex!important;gap:calc(8*var(--u))!important;align-items:center!important}
${O} #nbP .ntr .nhd{border:none!important;padding:0!important;width:calc(210*var(--u))!important;flex:none!important}
${O} #nbP .ntr .nhd .tt b{font-size:calc(20*var(--u))!important}
${O} #nbP .ntr .rw button{flex:1!important;height:calc(52*var(--u))!important}
${O} #nbP .ntd{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:calc(8*var(--u))!important}
${O} #nbP .ntd div{text-align:center!important;padding:calc(8*var(--u)) 0!important;background:rgba(255,240,220,.04)!important;border-top:1px solid rgba(201,160,100,.25)!important}
${O} #nbP .ntd b{display:block!important;font:700 calc(25*var(--u))/1 Cinzel,Georgia,serif!important;color:#f0dcb6!important}
${O} #nbP .ntd span{display:block!important;margin-top:calc(6*var(--u))!important;font:600 calc(12.5*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.04em!important;color:#c8b694!important;text-transform:uppercase!important;white-space:nowrap!important}
${O} #nbP .ng{position:absolute!important;left:calc(880*var(--u))!important;top:calc(886*var(--u))!important;width:calc(500*var(--u))!important;height:calc(170*var(--u))!important;padding:calc(8*var(--u)) calc(18*var(--u))!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:calc(8*var(--u))!important}
${O} #nbP .ng .h2{font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.26em!important;color:#c8b694!important}
${O} #nbP .ng .nrr{display:flex!important;justify-content:space-between!important;gap:calc(10*var(--u))!important;font-size:calc(17*var(--u))!important;color:#ecdcbc!important}
${O} #nbP .ng .nrr em{font:700 calc(18*var(--u))/1 Cinzel,Georgia,serif!important;font-style:normal!important;color:#f0c27a!important;text-align:right!important}
${O} #nbP .pr{position:absolute!important;left:calc(1420*var(--u))!important;top:calc(886*var(--u))!important;width:calc(440*var(--u))!important;height:calc(170*var(--u))!important;display:flex!important;flex-direction:column!important;gap:calc(8*var(--u))!important}
${O} #nbP .op2{display:flex!important;gap:calc(8*var(--u))!important}
${O} #nbP .op2 button{flex:1!important;height:calc(46*var(--u))!important;font-size:calc(14.5*var(--u))!important}
${O} #nbP .op2 button::before{content:'☐  '!important;font-family:Georgia,serif!important}
${O} #nbP .op2 button.zn::before{content:'☑  '!important}
${O} #nbP .op2 button[hidden]{display:none!important}
${O} #nbP .ngot{flex:1!important;font-size:calc(32*var(--u))!important}
${O} #nbP .tt,${O} #nbP .gn:not(.pu),${O} #nbP .gn:not(.pu) .ntx,${O} #nbP .wz,${O} #nbP .npk,${O} #nbW .pan,${O} #nbW .nte b{text-align:left!important}
${O} #nbP .gn:not(.pu) .ntx{flex:1!important;min-width:0!important}
${O} #nbW .kl,${O} #nbW .nbt b,${O} #nbP .nbt b,${O} #nbP .wz b,${O} #nbP .npk b{text-shadow:0 2px 4px #000!important}
@keyframes nbwZr{0%,100%{filter:brightness(1)}50%{filter:brightness(1.16)}}
@keyframes nbwOd{0%,100%{scale:1 1}50%{scale:1 1.01}}
@keyframes nbwPotw{0%{filter:brightness(1.6) drop-shadow(0 0 calc(30*var(--u)) rgba(255,150,60,.9))}100%{}}
@keyframes nbwMg{from{translate:-2% 0}to{translate:2% -3%}}
@keyframes nbwZi{0%{background-position:0 0}20%{background-position:-61px 37px}40%{background-position:83px -29px}60%{background-position:-17px -91px}80%{background-position:45px 70px}}
@media (prefers-reduced-motion:reduce){#nbW .bo .im,#nbW .mg,.nbzi,.nbd.gl{animation:none}}`;
 document.head.append(st);

 /* ================= OGNISKO ================= */
 const W=mk('div','');W.id='nbW';W.hidden=true;W.setAttribute('role','dialog');W.setAttribute('aria-label',T('Wybór postaci','Choose your hero'));
 W.innerHTML=`<div class="nst"><i class="nw ntlo"></i><i class="nw bla"></i><div class="rz"></div><i class="nw mg"></i><i class="nw npal"></i><i class="nw npl pa"></i><i class="nw npl pb"></i><canvas></canvas><i class="nw nie"></i>
 <div class="nbt"><b>${T('WYBÓR POSTACI','CHOOSE YOUR HERO')}</b><i class="sep"></i><span class="it">${T('Kto wyjdzie dziś w noc?','Who walks into the night tonight?')}</span></div>
 <button type="button" class="nbd wroc">${T('← Wróć','← Back')}</button><div class="nwz"></div>
 <div class="nbr pan"><div class="nin"><div class="kl"></div><div class="imi"></div><div class="mot"></div><div class="nop"></div><div class="nte"></div><div class="sty"></div></div></div>
 <button type="button" class="nbd gl wyb2">${T('Wybierz','Choose')}<small></small></button><i class="nw nwin"></i><i class="nw nbzi"></i></div>`;
 title.append(W);
 const ST=W.querySelector('.nst'),RZ=W.querySelector('.rz'),TABS=W.querySelector('.nwz'),PAN=W.querySelector('.pan'),pa=W.querySelector('.pa'),pb=W.querySelector('.pb'),CV=W.querySelector('canvas'),CX=CV.getContext('2d');
 const B={},TB={};
 for(const c of ORDER){const [x,h]=POS[c],e=mk('div','bo');e.style.cssText=`left:${x}%;height:${h}%;--ar:${NB_KAMIEN_AR[c]}`;e.innerHTML=`<i class="pod"></i><i class="ci"></i><i class="im" style="background-image:url('${NB_KAMIEN[c]}')"></i>`;
  e.addEventListener('click',()=>{if(wyb===c)potwierdz();else ustaw(c,true)});RZ.append(e);B[c]=e;
  const t=mk('button','nbd nwt');t.type='button';t.style.left=x+'%';t.textContent=hero(c).cls.toUpperCase();t.addEventListener('click',()=>{if(wyb===c)potwierdz();else ustaw(c)});t.addEventListener('focus',()=>ustaw(c));TABS.append(t);TB[c]=t}
 let wyb='r',tryb=null,blok=false,anim=0,t0=0,fl=1,flT=1,isk=[];
 function ustaw(c,fokus){if(blok||!B[c])return;const zm=c!==wyb||!B[c].classList.contains('wyb');wyb=c;
  for(const k of ORDER){B[k].classList.toggle('wyb',k===c);TB[k].classList.toggle('zn',k===c)}
  const d=(2-ORDER.indexOf(c));W.querySelector('.ntlo').style.setProperty('transform',`translateX(${d*.7}%)`,'important');RZ.style.setProperty('transform',`translateX(${d*.25}%)`,'important');
  if(fokus&&document.activeElement!==TB[c])TB[c].focus({preventScroll:true});
  if(!zm)return;PAN.classList.add('zm');clearTimeout(ustaw.t);ustaw.t=setTimeout(()=>{const H=hero(c);
   PAN.querySelector('.kl').textContent=H.cls.toUpperCase();PAN.querySelector('.imi').textContent=H.n+', '+H.ep;PAN.querySelector('.mot').textContent=H.mot||'';PAN.querySelector('.nop').textContent=OPIS[c];PAN.querySelector('.sty').textContent=STYL[c].toUpperCase();
   PAN.querySelector('.nte').classList.toggle('tri',TECH[c].length>2);PAN.querySelector('.nte').innerHTML=TECH[c].map(k=>{const n=(SK[k]&&SK[k].name)||k,ic=PREMIUM_ICONS['skille-'+k]||'';return `<div class="nbk">${ic?`<img src="${ic}" alt="">`:''}<b>${esc(n)}</b></div>`}).join('');
   W.querySelector('.wyb2 small').textContent=H.n.toUpperCase();PAN.classList.remove('zm')},140)}
 function potwierdz(){if(blok)return;blok=true;W.classList.add('potw');B[wyb].classList.add('potw');try{uiSnd('card')}catch(e){}
  const q=prog();if(q.char!==wyb){q.char=wyb;q.sel=[];PREP.perks=[];saveProg()}
  setTimeout(()=>{blok=false;W.classList.remove('potw');B[wyb].classList.remove('potw');const t=tryb;zamknij();
   if(t==='prep')openPrep(PREP.ch||1);else{omin=true;try{title.querySelector('.premium-journey')?.click()}finally{omin=false}}},650)}
 function rozmiar(){CV.width=ST.clientWidth;CV.height=ST.clientHeight}
 const poz=f=>`${(f%4)*100/3}% ${f<4?0:100}%`;
 function klatka(now){if(W.hidden){anim=0;return}const t=(now-t0)/100,f=Math.floor(t)%8,m=t%1;pa.style.setProperty('background-position',poz(f),'important');pb.style.setProperty('background-position',poz((f+1)%8),'important');pa.style.setProperty('opacity',String(1-m),'important');pb.style.setProperty('opacity',String(m),'important');
  if(Math.random()<.08)flT=.93+Math.random()*.14;fl+=(flT-fl)*.12;ST.style.setProperty('--fl',fl.toFixed(3),'important');
  const w=CV.width,h=CV.height;CX.clearRect(0,0,w,h);if(isk.length<50&&Math.random()<.25)isk.push({x:w*(.5+(Math.random()-.5)*.06),y:h*.79,vx:(Math.random()-.5)*w*.00025,vy:-h*(.0007+Math.random()*.001),l:1,r:w*(.0009+Math.random()*.0014)});
  isk=isk.filter(s=>(s.l-=.0028+Math.random()*.002)>0);for(const s of isk){s.vx+=(Math.random()-.5)*w*.00003;s.x+=s.vx;s.y+=s.vy;CX.fillStyle=`rgba(255,${150+60*s.l|0},70,${s.l*s.l})`;CX.shadowColor='rgba(255,110,30,.9)';CX.shadowBlur=s.r*5;CX.beginPath();CX.arc(s.x,s.y,s.r,0,7);CX.fill()}
  anim=requestAnimationFrame(klatka)}
 function otworz(t){tryb=t;W.hidden=false;if(!title.classList.contains('nbw-on'))title.classList.add('nbw-on');rozmiar();isk=[];t0=performance.now();
  for(const c of ORDER){B[c].classList.remove('wyb');TB[c].classList.remove('zn');TB[c].textContent=hero(c).cls.toUpperCase()}
  ustaw(cur());setTimeout(()=>TB[wyb]?.focus({preventScroll:true}),40);if(ruch&&!anim)anim=requestAnimationFrame(klatka);else if(!ruch){pa.style.setProperty('opacity','1','important');pb.style.setProperty('opacity','0','important')}}
 function zamknij(){W.hidden=true;title.classList.remove('nbw-on');if(anim)cancelAnimationFrame(anim);anim=0}
 function wroc(){const t=tryb;zamknij();if(t==='prep')openPrep(PREP.ch||1);else title.querySelector('.premium-journey')?.focus({preventScroll:true})}
 W.querySelector('.wroc').addEventListener('click',wroc);W.querySelector('.wyb2').addEventListener('click',potwierdz);addEventListener('resize',()=>{if(!W.hidden)rozmiar()});
 let omin=false;const graj=title.querySelector('.premium-journey');
 if(graj)graj.addEventListener('click',e=>{if(omin||!title.classList.contains('pc-home'))return;e.preventDefault();e.stopImmediatePropagation();otworz('graj')},true);
 {const prev=pcMenuBack;pcMenuBack=()=>{if(!W.hidden){if(!blok)wroc();return true}return prev?prev():false}}
 window.NB_OBOZ={otworz,zamknij};

 /* ================= PRZYGOTOWANIE ================= */
 const P=mk('div','');P.id='nbP';P.hidden=true;
 P.innerHTML=`<div class="nst"><i class="nw ntlo"></i><i class="nw cie"></i><i class="nw zar"></i>
 <button type="button" class="nbd wroc">${T('← Wróć','← Back')}</button>
 <div class="nbt"><b>${T('PRZYGOTOWANIE DO NOCY','PREPARE FOR THE NIGHT')}</b><i class="sep"></i><span class="rd"></span></div>
 <div class="boh"><i class="ntw"></i><div><b class="nbn"></b><span class="nbl"></span></div><button type="button" class="nbd zmien">${T('Zmień','Change')}</button></div>
 <section class="nbr kol nk1"><div class="nhd"><i class="nr"><i>I</i></i><div class="tt"><b>${T('PERK','PERK')}</b><span>${T('Jeden na noc. Zmienia styl walki: zysk i cena.','One per night. Changes how you fight: a gain and a price.')}</span></div><span class="licz l1"></span></div><div class="nbk gn g1"></div><div class="npg"></div></section>
 <section class="nbr kol nk2"><div class="nhd"><i class="nr"><i>II</i></i><div class="tt"><b>${T('WYZWANIE','CHALLENGE')}</b><span>${T('Jedno na noc. Wykonaj, a dostaniesz nagrodę.','One per night. Complete it to earn a reward.')}</span></div><span class="licz l2"></span></div><div class="nbk gn g2"></div><div class="ls nlw"></div></section>
 <section class="nbr kol nk3"><div class="nhd"><i class="nr"><i>III</i></i><div class="tt"><b>${T('KLĄTWY','CURSES')}</b><span>${T('Do trzech. Każda utrudnia noc i daje premię Popiołów: im cięższa, tym większa.','Up to three. Each makes the night harder and adds an Ashes bonus: the harsher, the bigger.')}</span></div><span class="licz l3"></span></div><div class="trzy g3"></div><div class="nmn"></div><div class="ls nlk"></div></section>
 <section class="nbr ntr"><div class="rw"><div class="nhd"><i class="nr"><i>IV</i></i><div class="tt"><b>${T('TRUDNOŚĆ','DIFFICULTY')}</b></div></div><div class="rw dd" style="flex:1"><button type="button" class="nbd" data-d="e">${T('Łatwy','Easy')}</button><button type="button" class="nbd" data-d="n">${T('Normalny','Normal')}</button><button type="button" class="nbd" data-d="h">${T('Trudny','Hard')}</button></div></div><div class="ntd"></div></section>
 <section class="nbr ng"><div class="h2">${T('TEJ NOCY','TONIGHT')}</div><div class="nrr"><span>${T('Perk','Perk')}</span><em class="n0"></em></div><div class="nrr"><span>${T('Za wyzwanie','Challenge reward')}</span><em class="n1"></em></div><div class="nrr"><span>${T('Popioły (klątwy × trudność)','Ashes (curses × difficulty)')}</span><em class="n2"></em></div><div class="nrr"><span>${T('Ofiara (Popioły)','Offering (Ashes)')}</span><em class="n3"></em></div></section>
 <div class="pr"><div class="op2"><button type="button" class="nbd o1">${T('Samouczek','Tutorial')}</button><button type="button" class="nbd o2">${T('2 graczy','2 players')}</button></div><button type="button" class="nbd gl ngot">${T('Gotowy','Ready')}<small></small></button></div>
 <i class="nw nbzi"></i></div>`;
 prep.append(P);
 const q$=s=>P.querySelector(s),TDN=[T('Liczba wrogów','Enemy count'),T('Życie wrogów','Enemy health'),T('Obrażenia wrogów','Enemy damage'),T('Popioły','Ashes')],
  TDV={e:['−20%','−25%','−30%','×0'+(EN?'.':',')+'8'],n:['—','—','—','×1'],h:['+12%','+25%','+20%','×1'+(EN?'.':',')+'3']},TDM={e:.8,n:1,h:1.3},
  liczba=x=>String(Math.round(x*100)/100).replace('.',EN?'.':',');
 let podP=null,podW=null,plan=0;
 const aktywny=()=>!prep.hidden&&!PREP.daily&&!PREP.weekly;
 function perki(){const q=prog();let cls='r';try{cls=perkCls()}catch(e){}return PERKS.filter(d=>(d.who||'r')===cls).map(d=>({d,za:d.lv>q.lv}))}
 function minus(d){try{return perkMinus(d)}catch(e){return d.mi||''}}
 function gnP(){const L=perki(),id=podP!=null?podP:PREP.perks[0],g=q$('.g1'),it=L.find(x=>x.d.id===id);g.className='nbk gn g1';
  if(!it){g.classList.add('pu');g.innerHTML=`<div class="ntx"><b>${T('NIE WYBRANO PERKU','NO PERK CHOSEN')}</b><span>${T('Wybierz jeden poniżej. Bez perku też można wyjść w noc.','Pick one below. You can also go without one.')}</span></div>`;return}
  const d=it.d,w=PREP.perks.includes(d.id);if(w)g.classList.add('wy');const ic=PREMIUM_ICONS['perki-'+d.id]||'';
  g.innerHTML=`<span class="et">${it.za?T('ZABLOKOWANY','LOCKED'):w?T('WYBRANO','CHOSEN'):T('PODGLĄD','PREVIEW')}</span>${ic?`<img src="${ic}" alt=""${it.za?' style="filter:grayscale(1) brightness(.6)"':''}>`:''}<div class="ntx"><b>${esc(d.n)}</b>${it.za?`<span>${T('Odblokujesz na poziomie postaci ','Unlocks at character level ')}${d.lv}.</span>`:''}<span class="plus">▲ ${esc(d.pl)}</span><span class="minus">▼ ${esc(minus(d))}</span></div>`}
 function gnW(){const L=chalList(),id=podW!=null?podW:PREP.chal,c=L.find(x=>x.id===id),g=q$('.g2');g.className='nbk gn g2';
  if(!c){g.classList.add('pu');g.innerHTML=`<div class="ntx"><b>${T('BEZ WYZWANIA','NO CHALLENGE')}</b><span>${T('Wybierz jedno z listy, żeby zdobyć dodatkowe Popioły i monety.','Pick one from the list to earn extra Ashes and coins.')}</span></div>`;return}
  const w=c.id===PREP.chal;if(w)g.classList.add('wy');
  g.innerHTML=`<span class="et">${w?T('WYBRANO','CHOSEN'):T('PODGLĄD','PREVIEW')}</span><div class="ntx"><b>${esc(c.n)}</b><span>${esc(c.d)}</span><span class="zl" style="margin-top:calc(10*var(--u));font:700 calc(18*var(--u))/1 Cinzel,Georgia,serif"><i class="nbur"></i>+${c.ash} ${T('Popiołów','Ashes')} &nbsp; <i class="nbmo"></i>+${c.coins} ${T('monet','coins')}${T(' · na start następnej nocy',' · at the start of the next night')}</span></div>`}
 // 16.11.2026: listy w Przygotowaniu aktualizowane w miejscu (bez tworzenia na nowo przyciskow i obrazkow), zeby banery perkow, wyzwan i klatw nie migaly
 const morphKids=(o,n)=>{const oc=[...o.childNodes],nc=[...n.childNodes];
  if(oc.length!==nc.length||oc.some((x,i)=>x.nodeType!==nc[i].nodeType||(x.nodeType===1&&x.tagName!==nc[i].tagName))){o.replaceChildren(...nc);return}
  nc.forEach((x,i)=>{const y=oc[i];if(x.nodeType===3){if(y.data!==x.data)y.data=x.data;return}if(x.nodeType!==1)return;
   for(const a of [...x.attributes])if(y.getAttribute(a.name)!==a.value)y.setAttribute(a.name,a.value);for(const a of [...y.attributes])if(!x.hasAttribute(a.name))y.removeAttribute(a.name);morphKids(y,x)})};
 const smartHtml=el=>{if(!el||el._sm)return;el._sm=1;const d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(el,'innerHTML',{configurable:true,get(){return d.get.call(el)},set(h){if(el._h===h)return;el._h=h;const t=document.createElement(el.tagName.toLowerCase());d.set.call(t,h);morphKids(el,t)}})};
 function render(){if(!aktywny()){if(!P.hidden)P.hidden=true;if(prep.classList.contains('nbp-on'))prep.classList.remove('nbp-on');return}
  const fk=document.activeElement&&P.contains(document.activeElement)?document.activeElement.dataset.k:null,q=prog(),c=cur(),H=hero(c);
  if(P.hidden)P.hidden=false;if(!prep.classList.contains('nbp-on'))prep.classList.add('nbp-on');PREP.curses=PREP.curses||[];for(const sl of ['.npg','.nlw','.nlk','.g3','.ntd','.nmn','.n1','.n2','.n3'])smartHtml(q$(sl));
  q$('.rd').textContent=(T('ROZDZIAŁ ','ACT ')+CHR[(PREP.ch||1)-1]+' · '+CHN[(PREP.ch||1)-1]).toUpperCase();
  {const tw=q$('.ntw'),s=tw.clientWidth||76,k=4.4,[fx,fy]=FACE[c]||[.5,.12],h=s*k,w=h*(NB_KAMIEN_AR[c]||.7);tw.style.backgroundImage=`url('${NB_KAMIEN[c]}')`;tw.style.backgroundSize=`${w}px ${h}px`;tw.style.backgroundPosition=`${s/2-fx*w}px ${s/2-fy*h}px`}
  q$('.nbn').textContent=H.n.toUpperCase();q$('.nbl').textContent=H.cls+T(' · poziom ',' · level ')+q.lv;
  const L=perki();q$('.npg').innerHTML=L.map(({d,za})=>{const ic=PREMIUM_ICONS['perki-'+d.id]||'';return `<button type="button" class="nbk npk${za?' za':''}${PREP.perks.includes(d.id)?' zn':''}" data-k="p:${d.id}"${za?' aria-disabled="true"':''}>${ic?`<img src="${ic}" alt="">`:''}<div><b>${esc(d.n)}</b>${za?`<small>🔒 ${T('poziom ','level ')}${d.lv}</small>`:''}</div></button>`}).join('');
  q$('.l1').textContent=`${PREP.perks.length} / ${perkSlots(prog())}`;q$('.l1').classList.toggle('ok',PREP.perks.length>0);
  const CL=chalList();q$('.nlw').innerHTML=CL.map(x=>{const dis=x.id==='z_pogarda'&&PREP.perks.includes('z_widmo');return `<button type="button" class="nbk wz${PREP.chal===x.id?' zn':''}${dis?' npe':''}" data-k="w:${x.id}"${dis?' aria-disabled="true"':''}><b>${esc(x.n)}</b><span><span class="nb"><i class="nbur"></i>+${x.ash}</span><span class="nb"><i class="nbmo"></i>+${x.coins}</span></span><span class="nop">${esc(x.d)}</span></button>`}).join('');
  q$('.l2').textContent=`${PREP.chal?1:0} / 1`;q$('.l2').classList.toggle('ok',!!PREP.chal);
  const pel=PREP.curses.length>=3;q$('.nlk').innerHTML=CURSES.map(x=>{const on=PREP.curses.includes(x.id);return `<button type="button" class="nbk wz${on?' zn':''}${pel&&!on?' npe':''}" data-k="k:${x.id}"><b>${esc(x.n)}</b><span class="nb"><i class="nbur"></i>+${x.w}%</span><span class="ef">${esc(x.d)}</span></button>`}).join('');
  q$('.g3').innerHTML=[0,1,2].map(j=>{const id=PREP.curses[j],x=id&&CURSES.find(k=>k.id===id);return x?`<div class="nbk nsk"><i class="nik"><i>✝</i></i><b>${esc(x.n)}</b></div>`:`<div class="nbk nsk pu"><i class="nik"><i>${['I','II','III'][j]}</i></i><b>${T('Wolne miejsce','Empty slot')}</b></div>`}).join('');
  q$('.l3').textContent=`${PREP.curses.length} / 3`;q$('.l3').classList.toggle('ok',PREP.curses.length>0);
  const km=curseMul(PREP.curses);q$('.nmn').innerHTML=`<i class="nbur"></i>${T('Popioły z klątw','Ashes from curses')}: <em>×${liczba(km)}</em>`;
  const dk=(typeof DIFFK==='string'&&TDV[DIFFK])?DIFFK:'n';for(const b of P.querySelectorAll('.dd button'))b.classList.toggle('zn',b.dataset.d===dk);
  q$('.ntd').innerHTML=TDV[dk].map((v,j)=>`<div><b>${v}</b><span>${TDN[j]}</span></div>`).join('');
  const pks=PREP.perks.map(id=>PERKS.find(d=>d.id===id)).filter(Boolean),pk=pks[0],ch=CL.find(x=>x.id===PREP.chal);
  q$('.n0').textContent=pks.length?pks.map(d=>d.n).join(' · '):'—';q$('.n1').innerHTML=ch?`<i class="nbur"></i>+${ch.ash} &nbsp;<i class="nbmo"></i>+${ch.coins}`:'—';q$('.n2').innerHTML=`<i class="nbur"></i>×${liczba(km*TDM[dk])}`;
   q$('.n3').innerHTML=OFIARY.map(o=>{const on=PREP.ofiara===o.id,ok=ofiaraOk(o);return `<button type="button" data-k="o:${o.id}" title="${esc(o.d)}"${ok||on?'':' disabled'} style="margin-left:.35em!important;padding:.15em .5em!important;font:700 calc(13*var(--u))/1.2 Cinzel,Georgia,serif!important;color:${on?'#1a0f08':'#f0c27a'}!important;background:${on?'#f0c27a':'rgba(20,12,8,.7)'}!important;border:1px solid #8a6a3a!important;border-radius:3px!important;opacity:${ok||on?1:.45}!important;cursor:pointer!important">${esc(o.n)} ${o.c}</button>`}).join('');
  {const hi=$('hintsTgl'),mp=$('mpTgl'),ml=$('mpTglL');q$('.o1').classList.toggle('zn',!!(hi&&hi.checked));q$('.o2').classList.toggle('zn',!!(mp&&mp.checked));q$('.o2').hidden=!mp||!!(ml&&ml.style.display==='none')}
  q$('.ngot small').textContent=H.n.toUpperCase()+' · '+[T('Łatwy','Easy'),T('Normalny','Normal'),T('Trudny','Hard')][['e','n','h'].indexOf(dk)].toUpperCase();
  gnP();gnW();
  if(fk){const e=P.querySelector(`[data-k="${fk}"]`);if(e)e.focus({preventScroll:true})}}
 const odswiez=()=>{if(plan)return;plan=requestAnimationFrame(()=>{plan=0;render()})};
 function klik(k){const [t,id]=k.split(':'),q=prog();
  if(t==='p'){const d=PERKS.find(x=>x.id===id);if(!d||d.lv>q.lv)return;perkToggle(q,id);saveProg()}
  else if(t==='o'){const o=OFIARY.find(x=>x.id===id);if(!o)return;PREP.ofiara=PREP.ofiara===id?null:(ofiaraOk(o)?id:null)}
   else if(t==='w'){if(id==='z_pogarda'&&PREP.perks.includes('z_widmo'))return;PREP.chal=PREP.chal===id?null:id;q.ch=PREP.chal;saveProg()}
  else if(t==='k'){const i=PREP.curses.indexOf(id);if(i>=0)PREP.curses.splice(i,1);else if(PREP.curses.length<3)PREP.curses.push(id);else return}
  try{uiSnd('equip')}catch(e){}renderPrep();render()}
 P.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!b||!P.contains(b))return;
  if(b.dataset.k)return klik(b.dataset.k);
  if(b.dataset.d){document.querySelector(`#diffSw [data-d="${b.dataset.d}"]`)?.click();return odswiez()}
  if(b.classList.contains('o1')){$('hintsTgl')?.click();return odswiez()}
  if(b.classList.contains('o2')){$('mpTgl')?.click();return odswiez()}
  if(b.classList.contains('ngot')){const g=$('prepGo');if(g&&!g.disabled)g.click();return}
  if(b.classList.contains('wroc')){/* 16.11.2026: Wroc dziala bezposrednio (kliknieta przez stary przycisk nie zamykala ekranu) */prep.hidden=true;toMenu();title.hidden=false;title.classList.remove('pc-home');setTimeout(()=>{const c=$('start'+(PREP.ch||1));c&&c.focus({preventScroll:true})},80);return}
  if(b.classList.contains('zmien')){prep.hidden=true;title.hidden=false;otworz('prep')}});
 const pod=(e,on)=>{const b=e.target.closest&&e.target.closest('[data-k]');if(!b)return;const [t,id]=b.dataset.k.split(':');if(t==='p'){podP=on?id:null;gnP()}else if(t==='w'){podW=on?id:null;gnW()}};
 P.addEventListener('mouseover',e=>pod(e,true));P.addEventListener('mouseout',e=>pod(e,false));P.addEventListener('focusin',e=>pod(e,true));P.addEventListener('focusout',e=>pod(e,false));
 new MutationObserver(ms=>{if(ms.some(m=>!P.contains(m.target)))odswiez()}).observe(prep,{attributes:true,attributeFilter:['hidden','class'],childList:true,subtree:true});
 for(const id of ['hintsTgl','mpTgl'])$(id)?.addEventListener('change',odswiez);
 new MutationObserver(()=>{if(aktywny()&&!prep.hidden)setTimeout(()=>{if(P.contains(document.activeElement))return;const f=P.querySelector('.npk.zn')||P.querySelector('.npk:not(.za)')||P.querySelector('.ngot');f?.focus({preventScroll:true})},60)}).observe(prep,{attributes:true,attributeFilter:['hidden']});
}catch(e){quietErr('obozPrzygotowanie',e)}})();
requestAnimationFrame(frame);
})();

