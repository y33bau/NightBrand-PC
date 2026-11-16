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
 root.classList.add('nb2');root.classList.add('nb2-pc');
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
 { // PC: bez wzmianek o telefonie i baterii w opisach jakosci
  for(const p of document.querySelectorAll('#pane-gfx .figcap')){const t=p.textContent;
   const n=t.replace('Auto: telefon i tablet dostają Średnią, komputer Wysoką.','Auto: na komputerze Wysoka.').replace('dla mocnych komputerów i tabletów','dla mocnych komputerów').replace('Niższy limit oszczędza baterię i może pomóc','Niższy limit może pomóc')
    .replace(/Auto: phones and tablets get Medium, (?:a )?computers? (?:gets? )?High\./i,'Auto: High on a computer.').replace(/A lower limit saves battery and (?:can|may) help/i,'A lower limit can help').replace('strong computers and tablets','strong computers');
   if(n!==t)p.textContent=n}}
 // Pelny ekran: przelacznik w Grafice. Wybor „W oknie" pamieta klucz nb_fs.
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
 ['click','dblclick','contextmenu','mouseup','mousedown','wheel','auxclick'].forEach(t=>window.addEventListener(t,stop,true));
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
${PR} .pc-profile-stat+.pc-profile-stat::before{content:''!important;position:absolute!important;left:0!important;top:50%!important;width:2.1em!important;height:2.1em!important;transform:translateY(-50%)!important;background:${A('assets/ikony/8f08bd944371bb357b2917aaa848ae7ecf7194a91030eeacdeb413f592fd653c.webp')} center/contain no-repeat!important}/* 16.11.2026: pieczec (ikona Daru pieczeci) zamiast pustego kola przy poziomie */
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
  FACE={k:[.56,.12],m:[.6,.175],r:[.5,.11],z:[.385,.215],d:[.255,.24]},/* 16.11.2026: Mira, Iwo i Milena: srodek kadru na twarzy (wczesniej wlosy i helm) */
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
${O} #nbW .nwlr{position:absolute!important;top:calc(62.6% + 14*var(--u))!important;z-index:50!important;font:700 calc(14*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(6*var(--u)) calc(8*var(--u))!important;background:rgba(0,0,0,.55)!important;pointer-events:none!important}
${O} #nbW .nwlr.l{left:calc(56*var(--u))!important}${O} #nbW .nwlr.r{right:calc(56*var(--u))!important}
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
/* 16.11.2026: uklad wg makiety GPT (runda przygotowanie-makieta): nizsze kolumny, wyzszy dolny pas, kafle perkow, lista wyzwan bez podgladu, klatwy bez slotow */
${O} #nbP .kol{position:absolute!important;top:calc(155*var(--u))!important;width:calc(588*var(--u))!important;height:calc(650*var(--u))!important;padding:calc(8*var(--u)) calc(14*var(--u)) calc(12*var(--u))!important;display:flex!important;flex-direction:column!important}
${O} #nbP .nk1{left:calc(54*var(--u))!important}${O} #nbP .nk2{left:calc(670*var(--u))!important}${O} #nbP .nk3{left:calc(1286*var(--u))!important}
${O} #nbP .kol:focus-within{filter:drop-shadow(0 0 calc(14*var(--u)) rgba(255,120,40,.18))!important}
${O} #nbP .nhd{position:relative!important;display:flex!important;align-items:center!important;gap:calc(16*var(--u))!important;padding:calc(2*var(--u)) calc(4*var(--u)) calc(12*var(--u))!important;border-bottom:1px solid rgba(201,160,100,.22)!important;flex:none!important}
${O} #nbP .nr{width:calc(42*var(--u))!important;height:calc(42*var(--u))!important;margin:0 calc(4*var(--u))!important;flex:none!important;display:grid!important;place-items:center!important;font:700 calc(18*var(--u))/1 Cinzel,Georgia,serif!important;color:#e8c690!important;border:1px solid rgba(201,160,100,.6)!important;rotate:45deg!important}
${O} #nbP .nr>i{rotate:-45deg!important}
${O} #nbP .tt{flex:1!important;min-width:0!important}
${O} #nbP .tt b{display:block!important;font:700 calc(29*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.14em!important;color:#e6d2ab!important}
${O} #nbP .tt span{display:block!important;margin-top:calc(7*var(--u))!important;font:italic calc(17*var(--u))/1.25 Georgia,serif!important;color:#d2c09c!important}
${O} #nbP .kol .tt b{padding-right:calc(140*var(--u))!important}
${O} #nbP .licz{position:absolute!important;right:calc(2*var(--u))!important;top:calc(2*var(--u))!important;font:700 calc(21*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.06em!important;padding:calc(7*var(--u)) calc(13*var(--u))!important;border:1px solid rgba(201,160,100,.45)!important;color:#e6d2ab!important;white-space:nowrap!important;background:rgba(0,0,0,.35)!important}
${O} #nbP .licz small{font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.06em!important}
${O} #nbP .licz.ok{color:#ffd9a0!important;border-color:rgba(255,150,70,.7)!important;box-shadow:0 0 calc(10*var(--u)) rgba(255,120,40,.3) inset!important}
/* perk: duza karta wybranego */
${O} #nbP .gn{margin:calc(14*var(--u)) 0 calc(4*var(--u))!important;height:calc(168*var(--u))!important;position:relative!important;display:flex!important;gap:calc(18*var(--u))!important;align-items:center!important;padding:calc(6*var(--u)) calc(16*var(--u))!important;flex:none!important}
${O} #nbP .gn .et{position:absolute!important;right:calc(12*var(--u))!important;top:calc(8*var(--u))!important;font:600 calc(14*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.22em!important;color:#8f806a!important}
${O} #nbP .gn.wy .et{color:#ffb070!important}
${O} #nbP .gn img{width:calc(108*var(--u))!important;height:calc(108*var(--u))!important;object-fit:contain!important;flex:none!important;filter:drop-shadow(0 0 calc(10*var(--u)) rgba(0,0,0,.8))!important}
${O} #nbP .gn b{padding-right:calc(96*var(--u))!important;display:block!important;font:700 calc(27*var(--u))/1.1 Cinzel,Georgia,serif!important;color:#f0dcb6!important;margin-bottom:calc(12*var(--u))!important}
${O} #nbP .gn .ntx>span{display:block!important;font-size:calc(18*var(--u))!important;line-height:1.38!important;color:#ecdcbc!important}
${O} #nbP .gn.dl b{font-size:calc(23*var(--u))!important;margin-bottom:calc(6*var(--u))!important}${O} #nbP .gn.dl .ntx>span{font-size:calc(15.5*var(--u))!important;line-height:1.3!important}${O} #nbP .gn.dl img{width:calc(88*var(--u))!important;height:calc(88*var(--u))!important}
${O} #nbP .gn.pu{justify-content:center!important;text-align:center!important;background:rgba(10,8,8,.6) padding-box!important;filter:brightness(.8)!important}
${O} #nbP .gn.pu b{font-size:calc(19*var(--u))!important;color:#b3a283!important;letter-spacing:.1em!important}
${O} #nbP .gn.pu .ntx>span{font-size:calc(17*var(--u))!important;color:#8f826d!important;font-style:italic!important}
${O} #nbP .gn.wy{background:radial-gradient(ellipse 60% 90% at 20% 50%,rgba(140,55,18,.5),rgba(26,14,10,.92)) padding-box!important}
${O} #nbP .nk1.mal .gn{height:calc(128*var(--u))!important}${O} #nbP .nk1.mal .gn img{width:calc(84*var(--u))!important;height:calc(84*var(--u))!important}${O} #nbP .nk1.mal .gn b{margin-bottom:calc(6*var(--u))!important;font-size:calc(24*var(--u))!important}${O} #nbP .nk1.mal .gn .ntx>span{font-size:calc(17*var(--u))!important;line-height:1.35!important}
${O} #nbP .plus{color:#ecdcbc!important}${O} #nbP .minus{color:#ecdcbc!important}${O} #nbP .zl{color:#f0c27a!important}
${O} #nbP .nlab{flex:none!important;text-align:left!important;margin:calc(8*var(--u)) 0 calc(8*var(--u)) calc(6*var(--u))!important;padding-top:calc(10*var(--u))!important;border-top:1px solid rgba(201,160,100,.18)!important;font:700 calc(17*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.12em!important;color:#e0cda8!important}
/* perk: kafle (ikona nad nazwa; przy 4+ perkach ikona obok nazwy) */
${O} #nbP .npg{flex:1!important;display:grid!important;grid-template-columns:repeat(3,1fr)!important;grid-auto-rows:1fr!important;gap:calc(8*var(--u))!important;min-height:0!important;align-content:stretch!important}
${O} #nbP .npk{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:calc(6*var(--u))!important;padding:calc(4*var(--u))!important;position:relative!important;min-height:0!important;text-align:center!important;background:linear-gradient(180deg,rgba(30,22,18,.85),rgba(8,6,6,.92)) padding-box!important}
${O} #nbP .npk>div{min-width:0!important}
${O} #nbP .npk img{width:calc(64*var(--u))!important;height:calc(64*var(--u))!important;object-fit:contain!important;flex:none!important;filter:drop-shadow(0 0 calc(6*var(--u)) rgba(0,0,0,.9))!important}
${O} #nbP .npk b{display:block!important;font:700 calc(17*var(--u))/1.15 Cinzel,Georgia,serif!important;color:#f2dfba!important;text-shadow:0 1px 2px #000!important;text-align:center!important}
${O} #nbP .npk small{display:block!important;margin-top:calc(3*var(--u))!important;font-size:calc(14*var(--u))!important;color:#b3a283!important}
${O} #nbP .npg.c2 .npk,${O} #nbP .npg.c3 .npk{flex-direction:row!important;justify-content:flex-start!important;text-align:left!important;gap:calc(8*var(--u))!important;padding:calc(2*var(--u)) calc(8*var(--u)) calc(2*var(--u)) calc(4*var(--u))!important}
${O} #nbP .npg.c2 .npk b,${O} #nbP .npg.c3 .npk b{text-align:left!important;font-size:calc(15.5*var(--u))!important}
${O} #nbP .npg.c2 .npk.zn,${O} #nbP .npg.c3 .npk.zn{padding-right:calc(24*var(--u))!important}${O} #nbP .npg.c2 .npk.zn::before,${O} #nbP .npg.c3 .npk.zn::before{font-size:calc(17*var(--u))!important;right:calc(5*var(--u))!important}
${O} #nbP .npg.c2 .npk img{width:calc(48*var(--u))!important;height:calc(48*var(--u))!important}${O} #nbP .npg.c3 .npk img{width:calc(40*var(--u))!important;height:calc(40*var(--u))!important}
${O} #nbP .npk.za{filter:grayscale(.85) brightness(.68)!important;cursor:default!important}
${O} #nbP .npk:not(.za):hover,${O} #nbP .npk:not(.za):focus-visible{filter:brightness(1.18)!important}
${O} #nbP .npk.zn{background:linear-gradient(180deg,rgba(196,92,30,.92),rgba(110,40,14,.95)) padding-box!important;filter:drop-shadow(0 0 calc(10*var(--u)) rgba(255,120,40,.5))!important}
${O} #nbP .npk.zn b{color:#fff0d8!important}
${O} #nbP .npk.zn::before{content:'✓'!important;position:absolute!important;top:calc(2*var(--u))!important;right:calc(6*var(--u))!important;font:700 calc(22*var(--u))/1 Georgia,serif!important;color:#ffd08a!important}
${O} #nbP .nzab{flex:none!important;margin-top:calc(10*var(--u))!important;height:calc(44*var(--u))!important;display:flex!important;align-items:center!important;gap:calc(14*var(--u))!important;padding:0 calc(18*var(--u))!important;font:700 calc(17*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.1em!important;color:#d8c6a2!important;border:1px solid rgba(201,160,100,.35)!important;background:rgba(0,0,0,.4)!important}
${O} #nbP .nzab[hidden]{display:none!important}
${O} #nbP .nzab:hover,${O} #nbP .nzab:focus-visible{color:#f2dfba!important;border-color:rgba(255,170,100,.6)!important}
${O} #nbP .nzab svg{width:calc(17*var(--u))!important;height:calc(17*var(--u))!important;flex:none!important;fill:currentColor!important}
${O} #nbP .nzab .nch{margin-left:auto!important;transition:rotate .2s!important}${O} #nbP .nzab.otw .nch{rotate:180deg!important}
/* listy: wyzwania i klatwy */
${O} #nbP .ls{flex:1!important;display:flex!important;flex-direction:column!important;gap:calc(8*var(--u))!important;min-height:0!important;overflow-y:auto!important;margin-top:calc(14*var(--u))!important;padding:calc(2*var(--u)) calc(6*var(--u)) calc(2*var(--u)) calc(2*var(--u))!important;scrollbar-width:thin!important;scrollbar-color:#7a5530 rgba(255,255,255,.04)!important}
${O} #nbP .wz{display:grid!important;grid-template-columns:1fr auto!important;column-gap:calc(12*var(--u))!important;row-gap:calc(6*var(--u))!important;align-items:center!important;flex:none!important;position:relative!important;min-height:calc(100*var(--u))!important;padding:calc(8*var(--u)) calc(16*var(--u)) calc(8*var(--u)) calc(60*var(--u))!important;background:linear-gradient(90deg,rgba(6,4,4,.92),rgba(30,20,16,.75)) padding-box!important}
${O} #nbP .wz::before{content:''!important;position:absolute!important;left:calc(22*var(--u))!important;top:50%!important;translate:0 -50%!important;width:calc(16*var(--u))!important;height:calc(16*var(--u))!important;border:1px solid rgba(201,160,100,.6)!important;rotate:45deg!important}
${O} #nbP .wz b{font:700 calc(20.5*var(--u))/1.1 Cinzel,Georgia,serif!important;letter-spacing:.03em!important;color:#f2dfba!important;text-shadow:0 1px 2px #000!important}
${O} #nbP .wz .nop,${O} #nbP .wz .ef{grid-column:1/-1!important;font-size:calc(18*var(--u))!important;line-height:1.25!important;color:#e3d3b3!important}
${O} #nbP .wz .nb{font:700 calc(19*var(--u))/1 Cinzel,Georgia,serif!important;white-space:nowrap!important;color:#f0c27a!important}
${O} #nbP .wz .nb+.nb{margin-left:calc(12*var(--u))!important}
${O} #nbP .wz .nb .nbur,${O} #nbP .wz .nb .nbmo{width:1.4em!important;height:1.4em!important;vertical-align:-.4em!important}
${O} #nbP .wz:hover,${O} #nbP .wz:focus-visible{background:linear-gradient(90deg,rgba(30,18,14,.95),rgba(55,34,24,.8)) padding-box!important}
${O} #nbP .wz.zn{background:linear-gradient(180deg,rgba(196,92,30,.95),rgba(120,44,14,.96)) padding-box!important;filter:drop-shadow(0 0 calc(10*var(--u)) rgba(255,120,40,.45))!important}
${O} #nbP .wz.zn b{color:#fff0d8!important}${O} #nbP .wz.zn .nop,${O} #nbP .wz.zn .ef{color:#fbe8c8!important}${O} #nbP .wz.zn .nb{color:#ffe0a8!important}
${O} #nbP .wz.zn::before{content:'✓'!important;border:none!important;rotate:0deg!important;width:auto!important;height:auto!important;left:calc(18*var(--u))!important;font:700 calc(32*var(--u))/1 Georgia,serif!important;color:#ffd08a!important;text-shadow:0 0 calc(8*var(--u)) rgba(255,150,60,.8)!important}
${O} #nbP .wz.npe{opacity:.4!important}
${O} #nbP .nlk .wz{min-height:calc(78*var(--u))!important;row-gap:calc(4*var(--u))!important}
${O} #nbP .nlk .wz b{font-size:calc(20.5*var(--u))!important}
${O} #nbP .nlk .wz .nb{grid-row:1/3!important;grid-column:2!important;font-size:calc(21*var(--u))!important}
${O} #nbP .nlk .wz .ef{grid-column:1!important;font-size:calc(17*var(--u))!important}
/* dolny pas */
${O} #nbP .ntr{position:absolute!important;left:calc(44*var(--u))!important;top:calc(830*var(--u))!important;width:calc(770*var(--u))!important;height:calc(214*var(--u))!important;padding:calc(6*var(--u)) calc(16*var(--u))!important;display:flex!important;flex-direction:column!important;justify-content:center!important;gap:calc(14*var(--u))!important}
${O} #nbP .ntr .rw{display:flex!important;gap:calc(10*var(--u))!important;align-items:center!important}
${O} #nbP .ntr .nhd{border:none!important;padding:0!important;width:calc(232*var(--u))!important;flex:none!important;gap:calc(12*var(--u))!important}
${O} #nbP .ntr .nhd .tt b{font-size:calc(23*var(--u))!important;letter-spacing:.1em!important}
${O} #nbP .ntr .rw button{flex:1!important;height:calc(56*var(--u))!important;font-size:calc(19*var(--u))!important}
${O} #nbP .ntd{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:calc(8*var(--u))!important}
${O} #nbP .ntd div{text-align:center!important;padding:calc(12*var(--u)) 0 calc(10*var(--u))!important;background:rgba(255,240,220,.04)!important;border-top:1px solid rgba(201,160,100,.25)!important}
${O} #nbP .ntd b{display:block!important;font:700 calc(28*var(--u))/1 Cinzel,Georgia,serif!important;color:#f0dcb6!important}
${O} #nbP .ntd span{display:block!important;margin-top:calc(8*var(--u))!important;font:600 calc(13.5*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.04em!important;color:#c8b694!important;text-transform:uppercase!important;white-space:nowrap!important}
${O} #nbP .ng{position:absolute!important;left:calc(838*var(--u))!important;top:calc(830*var(--u))!important;width:calc(556*var(--u))!important;height:calc(214*var(--u))!important;padding:calc(4*var(--u)) calc(16*var(--u))!important;box-sizing:border-box!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:space-evenly!important;gap:0!important}
${O} #nbP .ng .h2{font:700 calc(16*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.26em!important;color:#d8c6a2!important;text-align:center!important;margin:0!important;padding:0 0 calc(6*var(--u))!important;border-bottom:1px solid rgba(201,160,100,.28)!important}
${O} #nbP .ng .nrr{display:flex!important;justify-content:space-between!important;align-items:center!important;gap:calc(10*var(--u))!important;font-size:calc(18*var(--u))!important;line-height:1.1!important;margin:0!important;color:#ecdcbc!important}
${O} #nbP .ng .nrr em{font:700 calc(19.5*var(--u))/1 Georgia,serif!important;font-style:normal!important;color:#f0c27a!important;text-align:right!important;white-space:nowrap!important}
${O} #nbP .ng .nrr>span{flex:none!important;width:calc(182*var(--u))!important;text-align:left!important}
${O} #nbP .ng .nrr:last-child>span{width:auto!important}
${O} #nbP .ng .nrr em.n1,${O} #nbP .ng .nrr em.n2{flex:1!important;min-width:0!important;text-align:left!important}${O} #nbP .ng .nrr em.n2{font-size:calc(17.5*var(--u))!important}
${O} #nbP .ng .nrr em.n3{flex:1!important;justify-content:flex-end!important}
${O} #nbP .ng .nst2{text-align:center!important;font:italic calc(16.5*var(--u))/1.1 Georgia,serif!important;color:#ecdcbc!important;margin:0!important}
${O} #nbP .ng .nst2[hidden]{display:none!important}
${O} #nbP .ng .n3{display:flex!important;gap:calc(8*var(--u))!important}
${O} #nbP .ng .n3 button{padding:calc(5*var(--u)) calc(9*var(--u))!important;font:700 calc(16*var(--u))/1.1 Cinzel,Georgia,serif!important;color:#f0dcb6!important;background:rgba(20,12,8,.75)!important;border:1px solid #8a6a3a!important;border-radius:calc(3*var(--u))!important;cursor:pointer!important;white-space:nowrap!important}
${O} #nbP .ng .n3 button:hover,${O} #nbP .ng .n3 button:focus-visible{border-color:#e0a860!important;color:#fff0d8!important}
${O} #nbP .ng .n3 button.zn,${O} #nbP .ng .n3 button.zn:hover,${O} #nbP .ng .n3 button.zn:focus-visible{color:#1a0f08!important;text-shadow:none!important;background:linear-gradient(180deg,#f6cf88,#d99a4a)!important;border-color:#ffd9a0!important}
${O} #nbP .ng .nopf{margin:0!important;min-height:2.5em!important;font:italic calc(15.5*var(--u))/1.25 Georgia,serif!important;color:#d8c8a6!important;text-align:left!important}
${O} #nbP .ng .nopf b{font:700 calc(15.5*var(--u))/1 Georgia,serif!important;font-style:normal!important;color:#f0c27a!important}
${O} #nbP .ng .nopf .nza{color:#e39a7e!important}
${O} #nbP .ng .n3 button:disabled{opacity:.42!important;cursor:default!important}
${O} #nbP .pr{position:absolute!important;left:calc(1418*var(--u))!important;top:calc(822*var(--u))!important;width:calc(462*var(--u))!important;height:calc(226*var(--u))!important;display:flex!important;flex-direction:column!important;gap:calc(10*var(--u))!important}
${O} #nbP .op2{display:flex!important;gap:calc(12*var(--u))!important}
${O} #nbP .op2 button{flex:1!important;height:calc(58*var(--u))!important;font-size:calc(16*var(--u))!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:calc(10*var(--u))!important}
${O} #nbP .op2 button svg{width:calc(19*var(--u))!important;height:calc(19*var(--u))!important;fill:currentColor!important;flex:none!important}
${O} #nbP .op2 button[hidden]{display:none!important}
${O} #nbP .ngot{flex:1!important;font-size:calc(38*var(--u))!important;letter-spacing:.04em!important;white-space:nowrap!important}
${O} #nbP .ngot small{font-size:calc(14.5*var(--u))!important;margin-top:calc(8*var(--u))!important}
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
  e.addEventListener('click',()=>ustaw(c,true));/* 16.11.2026: klik mysza tylko zaznacza; dalej przyciskiem Wybierz */RZ.append(e);B[c]=e;
  const t=mk('button','nbd nwt');t.type='button';t.style.left=x+'%';t.textContent=hero(c).cls.toUpperCase();t.addEventListener('click',ev=>{if(ev.detail===0&&wyb===c)potwierdz();else ustaw(c)});/* Enter / A na zaznaczonym = Wybierz; mysz tylko zaznacza */t.addEventListener('focus',()=>ustaw(c));TABS.append(t);TB[c]=t}
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
 /* 16.11.2026: LB / RB zmieniaja bohatera przy ognisku */
 {const pc0=padCycle;padCycle=function(root,sel,step){if(!W.hidden&&sel===PADTABS){if(!blok){const i=ORDER.indexOf(wyb);ustaw(ORDER[(i+step+ORDER.length)%ORDER.length],true)}return true}return pc0(root,sel,step)}}
 for(const [c,t] of [['l','LB'],['r','RB']]){const b=mk('span','nwlr '+c);b.textContent=t;b.setAttribute('aria-hidden','true');ST.append(b)}
 window.NB_OBOZ={otworz,zamknij};

 /* ================= PRZYGOTOWANIE ================= */
 const P=mk('div','');P.id='nbP';P.hidden=true;
 P.innerHTML=`<div class="nst"><i class="nw ntlo"></i><i class="nw cie"></i><i class="nw zar"></i>
 <button type="button" class="nbd wroc">${T('← Wróć','← Back')}</button>
 <div class="nbt"><b>${T('PRZYGOTOWANIE DO NOCY','PREPARE FOR THE NIGHT')}</b><i class="sep"></i><span class="rd"></span></div>
 <div class="boh"><i class="ntw"></i><div><b class="nbn"></b><span class="nbl"></span></div><button type="button" class="nbd zmien">${T('Zmień','Change')}</button></div>
 <section class="nbr kol nk1"><div class="nhd"><i class="nr"><i>I</i></i><div class="tt"><b>${T('PERK','PERK')}</b><span>${T('Jeden na noc. Zmienia styl walki: zysk i cena.','One per night. Changes how you fight: a gain and a price.')}</span></div><span class="licz l1"></span></div><div class="nbk gn g1"></div><div class="nlab">${T('DOSTĘPNE PERKI:','AVAILABLE PERKS:')}</div><div class="npg"></div><button type="button" class="nzab"><svg viewBox="0 0 16 16"><path d="M4 7V5a4 4 0 0 1 8 0v2h1v8H3V7zm2 0h4V5a2 2 0 0 0-4 0z"/></svg><span class="nzt"></span><svg class="nch" viewBox="0 0 16 16"><path d="M2.5 5.5 8 11l5.5-5.5-1.4-1.4L8 8.2 3.9 4.1z"/></svg></button></section>
 <section class="nbr kol nk2"><div class="nhd"><i class="nr"><i>II</i></i><div class="tt"><b>${T('WYZWANIE','CHALLENGE')}</b><span>${T('Jedno na noc. Wykonaj, a dostaniesz nagrodę.','One per night. Complete it to earn a reward.')}</span></div><span class="licz l2"></span></div><div class="ls nlw"></div></section>
 <section class="nbr kol nk3"><div class="nhd"><i class="nr"><i>III</i></i><div class="tt"><b>${T('KLĄTWY','CURSES')}</b><span>${T('Do trzech. Każda utrudnia noc i daje premię Popiołów: im cięższa, tym większa.','Up to three. Each makes the night harder and adds an Ashes bonus: the harsher, the bigger.')}</span></div><span class="licz l3"></span></div><div class="ls nlk"></div></section>
 <section class="nbr ntr"><div class="rw"><div class="nhd"><i class="nr"><i>IV</i></i><div class="tt"><b>${T('TRUDNOŚĆ','DIFFICULTY')}</b></div></div><div class="rw dd" style="flex:1"><button type="button" class="nbd" data-d="e">${T('Łatwy','Easy')}</button><button type="button" class="nbd" data-d="n">${T('Normalny','Normal')}</button><button type="button" class="nbd" data-d="h">${T('Trudny','Hard')}</button></div></div><div class="ntd"></div></section>
 <section class="nbr ng"><div class="h2">${T('TEJ NOCY','TONIGHT')}</div><div class="nrr"><span>${T('Wyzwanie:','Challenge:')}</span><em class="n1"></em></div><div class="nrr"><span>${T('Nagroda za wyzwanie:','Challenge reward:')}</span><em class="n2"></em></div><div class="nst2">${T('Na start następnej nocy','At the start of the next night')}</div><div class="nrr"><span>${T('Ofiary (Popioły):','Offerings (Ashes):')}</span><em class="n3"></em></div><div class="nopf"></div></section>
 <div class="pr"><div class="op2"><button type="button" class="nbd o1"><svg viewBox="0 0 20 16"><path d="M1 2c3-1.3 6-1 8.3.8V15C7 13.4 4 13.1 1 14.3zm18 0c-3-1.3-6-1-8.3.8V15c2.3-1.6 5.3-1.9 8.3-.7z"/></svg>${T('Samouczek','Tutorial')}</button><button type="button" class="nbd o2"><svg viewBox="0 0 20 16"><circle cx="7" cy="4.2" r="3.2"/><circle cx="14.5" cy="5" r="2.6"/><path d="M0.5 15.5c.4-4 3-6 6.5-6s6.1 2 6.5 6zm13.9 0c-.2-2.3-1-4.1-2.3-5.3 3.4-.9 6.6.6 7.4 5.3z"/></svg>${T('2 graczy','2 players')}</button></div><button type="button" class="nbd gl ngot">${T('Wyrusz w noc','Set out')}<small></small></button></div>
 <i class="nw nbzi"></i></div>`;
 prep.append(P);
 const q$=s=>P.querySelector(s),TDN=[T('Liczba wrogów','Enemy count'),T('Życie wrogów','Enemy health'),T('Obrażenia wrogów','Enemy damage'),T('Popioły','Ashes')],
  TDV={e:['−20%','−25%','−30%','×0'+(EN?'.':',')+'8'],n:['—','—','—','×1'],h:['+12%','+25%','+20%','×1'+(EN?'.':',')+'3']},TDM={e:.8,n:1,h:1.3},
  liczba=x=>String(Math.round(x*100)/100).replace('.',EN?'.':',');
 let podP=null,podO=null,plan=0,zabOtw=false;
 const aktywny=()=>!prep.hidden&&!PREP.daily&&!PREP.weekly;
 function perki(){const q=prog();let cls='r';try{cls=perkCls()}catch(e){}return PERKS.filter(d=>(d.who||'r')===cls).map(d=>({d,za:d.lv>q.lv}))}
 function minus(d){try{return perkMinus(d)}catch(e){return d.mi||''}}
 function gnP(){const L=perki(),id=podP!=null?podP:PREP.perks[0],g=q$('.g1'),it=L.find(x=>x.d.id===id);g.className='nbk gn g1';
  if(!it){g.classList.add('pu');g.innerHTML=`<div class="ntx"><b>${T('NIE WYBRANO PERKU','NO PERK CHOSEN')}</b><span>${T('Wybierz jeden poniżej. Bez perku też można wyjść w noc.','Pick one below. You can also go without one.')}</span></div>`;return}
  const d=it.d,w=PREP.perks.includes(d.id);if(w)g.classList.add('wy');if((d.n+d.pl+minus(d)).length>105)g.classList.add('dl');/* 16.11.2026: dlugi opis (np. EN) mniejsza czcionka, zeby zmiescil sie w karcie */const ic=PREMIUM_ICONS['perki-'+d.id]||'';
  g.innerHTML=`<span class="et">${it.za?T('ZABLOKOWANY','LOCKED'):w?T('WYBRANO','CHOSEN'):T('PODGLĄD','PREVIEW')}</span>${ic?`<img src="${ic}" alt=""${it.za?' style="filter:grayscale(1) brightness(.6)"':''}>`:''}<div class="ntx"><b>${esc(d.n)}</b>${it.za?`<span>${T('Odblokujesz na poziomie postaci ','Unlocks at character level ')}${d.lv}.</span>`:''}<span class="plus">▲ ${esc(d.pl)}</span><span class="minus">▼ ${esc(minus(d))}</span></div>`}
 function opO(){/* 16.11.2026: opis ofiary pod przyciskami (wskazana > wybrana > podpowiedz) */const o=OFIARY.find(x=>x.id===(podO||PREP.ofiara)),e=q$('.nopf');if(!e)return;
  if(!o){e.innerHTML=T('Ofiara kosztuje Popioły i daje premię tylko na tę noc. Wskaż ofiarę, żeby zobaczyć, co daje.','An offering costs Ashes and gives a bonus for this night only. Point at one to see what it does.');return}
  const ok=ofiaraOk(o)||PREP.ofiara===o.id;e.innerHTML=`<b>${esc(o.n)}:</b> ${esc(o.d)}${ok?'':' <i class="nza">'+(EMB.e<o.c?T('Za mało Popiołów.','Not enough Ashes.'):T('Niedostępna.','Unavailable.'))+'</i>'}`}
 // 16.11.2026: listy w Przygotowaniu aktualizowane w miejscu (bez tworzenia na nowo przyciskow i obrazkow), zeby banery perkow, wyzwan i klatw nie migaly
 const morphKids=(o,n)=>{const oc=[...o.childNodes],nc=[...n.childNodes];
  if(oc.length!==nc.length||oc.some((x,i)=>x.nodeType!==nc[i].nodeType||(x.nodeType===1&&x.tagName!==nc[i].tagName))){o.replaceChildren(...nc);return}
  nc.forEach((x,i)=>{const y=oc[i];if(x.nodeType===3){if(y.data!==x.data)y.data=x.data;return}if(x.nodeType!==1)return;
   for(const a of [...x.attributes])if(y.getAttribute(a.name)!==a.value)y.setAttribute(a.name,a.value);for(const a of [...y.attributes])if(!x.hasAttribute(a.name))y.removeAttribute(a.name);morphKids(y,x)})};
 const smartHtml=el=>{if(!el||el._sm)return;el._sm=1;const d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(el,'innerHTML',{configurable:true,get(){return d.get.call(el)},set(h){if(el._h===h)return;el._h=h;const t=document.createElement(el.tagName.toLowerCase());d.set.call(t,h);morphKids(el,t)}})};
 function render(){if(!aktywny()){if(!P.hidden)P.hidden=true;if(prep.classList.contains('nbp-on'))prep.classList.remove('nbp-on');return}
  const fk=document.activeElement&&P.contains(document.activeElement)?document.activeElement.dataset.k:null,q=prog(),c=cur(),H=hero(c);
  if(P.hidden)P.hidden=false;if(!prep.classList.contains('nbp-on'))prep.classList.add('nbp-on');PREP.curses=PREP.curses||[];for(const sl of ['.npg','.nlw','.nlk','.ntd','.n1','.n2','.n3'])smartHtml(q$(sl));
  q$('.rd').textContent=(T('ROZDZIAŁ ','ACT ')+CHR[(PREP.ch||1)-1]+' · '+CHN[(PREP.ch||1)-1]).toUpperCase();
  {const tw=q$('.ntw'),s=tw.clientWidth||76,k=4.4,[fx,fy]=FACE[c]||[.5,.12],h=s*k,w=h*(NB_KAMIEN_AR[c]||.7);tw.style.backgroundImage=`url('${NB_KAMIEN[c]}')`;tw.style.backgroundSize=`${w}px ${h}px`;tw.style.backgroundPosition=`${s/2-fx*w}px ${s/2-fy*h}px`}
  q$('.nbn').textContent=H.n.toUpperCase();q$('.nbl').textContent=H.cls+T(' · poziom ',' · level ')+q.lv;
  {/* 16.11.2026 (makieta): kafle tylko odblokowanych perkow; zablokowane pod przyciskiem ZABLOKOWANE (N). Uklad kafli wg liczby: 1-3 duze, 4-6 i 7+ ciasniejsze; 16.11.2026: zawsze min. 3 kafle, brakujace dopelniaja pierwsze zablokowane, licznik ZABLOKOWANE liczy reszte */
   const L=perki(),zaW=L.filter(x=>x.za),dop=Math.max(0,3-(L.length-zaW.length)),za=zaW.slice(dop),wid=zabOtw?L:L.filter(x=>!x.za||zaW.indexOf(x)<dop),n=wid.length,g=q$('.npg');/* 16.11.2026: zawsze min. 3 kafle; brakujace dopelniaja pierwsze zablokowane */
   g.className='npg'+(n>6?' c3':n>3?' c2':'');q$('.nk1').classList.toggle('mal',n>6);
   g.innerHTML=wid.map(({d,za})=>{const ic=PREMIUM_ICONS['perki-'+d.id]||'';return `<button type="button" class="nbk npk${za?' za':''}${PREP.perks.includes(d.id)?' zn':''}" data-k="p:${d.id}"${za?' aria-disabled="true"':''}>${ic?`<img src="${ic}" alt="">`:''}<div><b>${esc(d.n)}</b>${za?`<small>🔒 ${T('poziom ','level ')}${d.lv}</small>`:''}</div></button>`}).join('');
   const zb=q$('.nzab');zb.hidden=!za.length;zb.classList.toggle('otw',zabOtw);q$('.nzt').textContent=(zabOtw?T('UKRYJ ZABLOKOWANE','HIDE LOCKED'):T('ZABLOKOWANE','LOCKED'))+` (${za.length})`}
  q$('.l1').textContent=`${PREP.perks.length} / ${perkSlots(prog())}`;q$('.l1').classList.toggle('ok',PREP.perks.length>0);
  const CL=chalList();q$('.nlw').innerHTML=CL.map(x=>{const dis=x.id==='z_pogarda'&&PREP.perks.includes('z_widmo');return `<button type="button" class="nbk wz${PREP.chal===x.id?' zn':''}${dis?' npe':''}" data-k="w:${x.id}"${dis?' aria-disabled="true"':''}><b>${esc(x.n)}</b><span><span class="nb"><i class="nbur"></i>+${x.ash}</span><span class="nb"><i class="nbmo"></i>+${x.coins}</span></span><span class="nop">${esc(x.d)}</span></button>`}).join('');
  q$('.l2').textContent=`${PREP.chal?1:0} / 1`;q$('.l2').classList.toggle('ok',!!PREP.chal);
  const pel=PREP.curses.length>=3;q$('.nlk').innerHTML=CURSES.map(x=>{const on=PREP.curses.includes(x.id);return `<button type="button" class="nbk wz${on?' zn':''}${pel&&!on?' npe':''}" data-k="k:${x.id}"><b>${esc(x.n)}</b><span class="nb"><i class="nbur"></i>+${x.w}%</span><span class="ef">${esc(x.d)}</span></button>`}).join('');
  q$('.l3').innerHTML=`${PREP.curses.length} / 3 <small>· ${T('OPCJONALNE','OPTIONAL')}</small>`;q$('.l3').classList.toggle('ok',PREP.curses.length>0);
  const dk=(typeof DIFFK==='string'&&TDV[DIFFK])?DIFFK:'n';for(const b of P.querySelectorAll('.dd button'))b.classList.toggle('zn',b.dataset.d===dk);
  q$('.ntd').innerHTML=TDV[dk].map((v,j)=>`<div><b>${v}</b><span>${TDN[j]}</span></div>`).join('');
  const pks=PREP.perks.map(id=>PERKS.find(d=>d.id===id)).filter(Boolean),pk=pks[0],ch=CL.find(x=>x.id===PREP.chal);
  q$('.n1').textContent=ch?ch.n:'—';q$('.n2').innerHTML=ch?`<i class="nbur"></i>+${ch.ash} ${T('Popiołów','Ashes')} &nbsp;<i class="nbmo"></i>+${ch.coins} ${T('monet','coins')}`:'—';q$('.nst2').hidden=!ch;
   q$('.n3').innerHTML=OFIARY.map(o=>{const on=PREP.ofiara===o.id,ok=ofiaraOk(o);return `<button type="button" data-k="o:${o.id}" title="${esc(o.d)}"${on?' class="zn"':''}${ok||on?'':' disabled'}>${esc(o.n)} ${o.c}</button>`}).join('');
  {const hi=$('hintsTgl'),mp=$('mpTgl'),ml=$('mpTglL');q$('.o1').classList.toggle('zn',!!(hi&&hi.checked));q$('.o2').classList.toggle('zn',!!(mp&&mp.checked));q$('.o2').hidden=!mp||!!(ml&&ml.style.display==='none')}
  q$('.ngot small').textContent=H.n.toUpperCase()+' · '+[T('Łatwy','Easy'),T('Normalny','Normal'),T('Trudny','Hard')][['e','n','h'].indexOf(dk)].toUpperCase();
  gnP();opO();
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
  if(b.classList.contains('nzab')){zabOtw=!zabOtw;render();return}
  if(b.dataset.d){document.querySelector(`#diffSw [data-d="${b.dataset.d}"]`)?.click();return odswiez()}
  if(b.classList.contains('o1')){$('hintsTgl')?.click();return odswiez()}
  if(b.classList.contains('o2')){$('mpTgl')?.click();return odswiez()}
  if(b.classList.contains('ngot')){const g=$('prepGo');if(g&&!g.disabled)g.click();return}
  if(b.classList.contains('wroc')){/* 16.11.2026: Wroc dziala bezposrednio (kliknieta przez stary przycisk nie zamykala ekranu) */prep.hidden=true;toMenu();title.hidden=false;title.classList.remove('pc-home');setTimeout(()=>{const c=$('start'+(PREP.ch||1));c&&c.focus({preventScroll:true})},80);return}
  if(b.classList.contains('zmien')){prep.hidden=true;title.hidden=false;otworz('prep')}});
 const pod=(e,on)=>{const b=e.target.closest&&e.target.closest('[data-k]');if(!b)return;const [t,id]=b.dataset.k.split(':');if(t==='p'){podP=on?id:null;gnP()}else if(t==='o'){podO=on?id:null;opO()}};
 P.addEventListener('mouseover',e=>pod(e,true));P.addEventListener('mouseout',e=>pod(e,false));P.addEventListener('focusin',e=>pod(e,true));P.addEventListener('focusout',e=>pod(e,false));
 new MutationObserver(ms=>{if(ms.some(m=>!P.contains(m.target)))odswiez()}).observe(prep,{attributes:true,attributeFilter:['hidden','class'],childList:true,subtree:true});
 for(const id of ['hintsTgl','mpTgl'])$(id)?.addEventListener('change',odswiez);
 new MutationObserver(()=>{if(aktywny()&&!prep.hidden)setTimeout(()=>{if(P.contains(document.activeElement))return;const f=P.querySelector('.npk.zn')||P.querySelector('.npk:not(.za)')||P.querySelector('.ngot');f?.focus({preventScroll:true})},60)}).observe(prep,{attributes:true,attributeFilter:['hidden']});
}catch(e){quietErr('obozPrzygotowanie',e)}})();
// ===== 16.11.2026: Mapa podrozy (runda mapa-podrozy). Wybor rozdzialu na mapie swiata zamiast listy kafli.
// Tylko prezentacja i nawigacja: te same przyciski start*, chLocked, premiumPrepare i openPrep; zapis, odblokowania i balans bez zmian.
// Klik w punkt zaznacza; drugi klik (albo Enter / A na zaznaczonym punkcie) otwiera przygotowanie. Lewo/prawo idzie po kolejnosci fabularnej. ?mapa=0 wylacza.
(()=>{try{
 if(/[?&]mapa=0\b/.test(location.search))return;
 const title=$('title'),list=title&&title.querySelector('.premium-map>.m2-right'),go=$('premiumPrepare');if(!list||!go)return;
 const MAPA='assets/ui/be1d57f7257a9c66a961af02b208f067afa531278d69cf9775e29783cdfead04.webp';
 // polozenie znacznika miejsca na tle (% szerokosci, % wysokosci); plakietka z nazwa stoi pod znacznikiem
 const PKT={1:[15.5,61.5],2:[21,87],6:[46,78],3:[80,66],4:[67.5,36],5:[60.5,16.5]};
 // trasa: od, do, punkt kontrolny krzywej (szyb, winda, prom, droga przez las, podejscie pod Cytadele)
 const TRASA=[[1,2,12,76],[2,6,33,73],[6,3,63,83],[3,4,63,57],[4,5,63,28]];
 const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg'),seg={};
 svg.setAttribute('class','nbm-trasa');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
 for(const [a,b,cx,cy] of TRASA){const p=document.createElementNS(NS,'path'),A=PKT[a],B=PKT[b];p.setAttribute('d',`M${A[0]} ${A[1]} Q${cx} ${cy} ${B[0]} ${B[1]}`);p.setAttribute('vector-effect','non-scaling-stroke');svg.append(p);seg[b]=p}
 list.prepend(svg);
 const mk=(t,c)=>{const e=document.createElement(t);e.className=c;return e},put=(e,t)=>{if(e.textContent!==t)e.textContent=t};
 const dodaj=(b,i)=>{if(b.querySelector(':scope>.nbm-tag'))return;const pin=mk('span','nbm-pin'),tag=mk('span','nbm-tag'),nm=mk('span','nbm-nm'),st=mk('small','nbm-st');pin.setAttribute('aria-hidden','true');tag.setAttribute('aria-hidden','true');nm.textContent=chRoman(i)+' · '+CHN[i-1];tag.append(nm,st);b.append(pin,tag);b.style.setProperty('--nbm-x',PKT[i][0]+'%');b.style.setProperty('--nbm-y',PKT[i][1]+'%')};
 const naMapie=()=>!title.hidden&&!title.classList.contains('pc-home');
 const odswiez=()=>{if(!naMapie())return;for(const i of CAMPAIGN){const b=$('start'+i);if(!b)continue;dodaj(b,i);const lk=b.disabled,won=!lk&&!!(SETT.save['s'+i]&&SETT.save['s'+i].win);if(b.classList.contains('nbm-lk')!==lk)b.classList.toggle('nbm-lk',lk);if(b.classList.contains('nbm-won')!==won)b.classList.toggle('nbm-won',won);put(b.querySelector('.nbm-st'),lk?(b.dataset.status||''):'');const p=seg[i];if(p&&p.classList.contains('on')===lk)p.classList.toggle('on',!lk)}};
 new MutationObserver(odswiez).observe(list,{childList:true,subtree:true,attributes:true,attributeFilter:['class','disabled','data-status']});
 new MutationObserver(odswiez).observe(title,{attributes:true,attributeFilter:['hidden','class']});odswiez();
 const punkt=e=>e&&e.matches&&e.matches('.premium-map .m2-ch')&&naMapie();
 // lewo/prawo: kolejnosc fabularna (I..VI), z pominieciem zablokowanych; na koncu trasy fokus zostaje; gora/dol bez zmian (najblizszy przycisk)
 const navMove0=navMove;navMove=function(id,d,pad){const ae=document.activeElement;if(id==='title'&&(d==='l'||d==='r')&&punkt(ae)){const L=CAMPAIGN.map(i=>$('start'+i)).filter(b=>b&&!b.disabled&&b.offsetParent!==null),n=L[L.indexOf(ae)+(d==='r'?1:-1)];if(n)n.focus({preventScroll:true});return true}return navMove0(id,d,pad)};
 // fokus z klawiatury lub pada zaznacza miejsce (karta po prawej pokazuje jego opis); fokus po kliknieciu mysza zaznacza sam klik
 let ptrT=0,ptrSel=null;
 title.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('.premium-map .m2-ch');ptrT=performance.now();ptrSel=b&&b.classList.contains('premium-selected')?b:null},true);
 title.addEventListener('focusin',e=>{const b=e.target;if(!punkt(b)||b.disabled||b.classList.contains('premium-selected')||performance.now()-ptrT<600)return;b.dispatchEvent(new Event('pointerenter'))});
 // Enter / A na zaznaczonym punkcie albo drugi klik mysza w zaznaczony punkt = „Przygotuj sie" (ta sama akcja co przycisk na dole)
 window.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.premium-map .m2-ch');if(!b||!punkt(b)||b.disabled)return;const kb=e.detail===0;if(kb&&b.classList.contains('premium-selected')){/* 16.11.2026: klik mysza tylko zaznacza miejsce */e.stopImmediatePropagation();e.preventDefault();ptrSel=null;if(!go.disabled)go.click()}},true);
 const U=n=>`calc(${n} * var(--pc-u))`,TU=n=>`calc(${n} * var(--pc-u) * var(--nbts,1))`,M='#orient'.repeat(260)+'.pc-menu #title:not(.pc-home)',CH=M+' .premium-map>.m2-right>.m2-ch';
 const KLODKA=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 14'%3E%3Cpath d='M3.2 6.2V4.3a2.8 2.8 0 0 1 5.6 0v1.9' fill='none' stroke='%23b8a37e' stroke-width='1.5'/%3E%3Crect x='1.4' y='6' width='9.2' height='7.4' rx='1.3' fill='%23b8a37e'/%3E%3C/svg%3E")`;
 const st=document.createElement('style');st.id='nb-mapa-podrozy';st.textContent=`
${M} .premium-map{display:grid!important;grid-template-columns:auto minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important;gap:${U(18)}!important;container-type:size!important;align-items:stretch!important}
${M} .premium-map>.m2-right{grid-column:1!important;grid-row:1!important;align-self:center!important;justify-self:start!important;position:relative!important;display:block!important;box-sizing:border-box!important;width:min(calc(100cqw - ${U(350)}),calc(100cqh * 1.6479))!important;height:auto!important;min-height:0!important;max-height:none!important;aspect-ratio:1610/977!important;padding:0!important;margin:0!important;overflow:visible!important;background:url('${MAPA}') center/100% 100% no-repeat #120e0b!important;border:1px solid #a4895e66!important;border-image:none!important;box-shadow:inset 0 0 ${U(46)} #000b,0 ${U(4)} ${U(18)} #0009!important;mask-image:none!important;gap:0!important}
${M} .nbm-trasa{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;pointer-events:none!important;overflow:visible!important;z-index:1!important}
${M} .nbm-trasa path{fill:none;stroke:#dcc08a;stroke-opacity:.3;stroke-width:max(1.5px,${U(2.4)});stroke-dasharray:${U(7)} ${U(6)};stroke-linecap:round}
${M} .nbm-trasa path.on{stroke-opacity:.85}
${CH}{position:absolute!important;left:var(--nbm-x)!important;top:var(--nbm-y)!important;right:auto!important;bottom:auto!important;transform:translate(-50%,${U(-8)})!important;width:auto!important;height:auto!important;min-width:0!important;min-height:0!important;max-width:none!important;margin:0!important;padding:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:${U(5)}!important;background:none!important;border:0!important;border-image:none!important;border-radius:0!important;box-shadow:none!important;outline:0!important;font-size:0!important;line-height:0!important;color:transparent!important;overflow:visible!important;z-index:2!important;filter:none!important;opacity:1!important;cursor:pointer!important;mask-image:none!important;clip-path:none!important;text-shadow:none!important}
${CH}:before,${CH}:after{content:none!important;display:none!important}
${CH}>:not(.nbm-pin,.nbm-tag){display:none!important}
${CH}.premium-selected{z-index:4!important}
${CH}:is(:hover,:focus-visible,.pf){z-index:5!important}
${CH}:disabled{cursor:default!important}
${M} .nbm-pin{display:block!important;box-sizing:border-box!important;width:${U(16)};height:${U(16)};border-radius:50%;background:radial-gradient(circle,#f0d394 0 26%,#2a1f14 30% 100%);border:${U(2)} solid #c9a464;box-shadow:0 0 0 ${U(2)} #000a,0 0 ${U(8)} #000;transition:transform .15s,box-shadow .15s}
${M} .nbm-tag{display:flex!important;flex-direction:column!important;align-items:center!important;gap:${U(2)}!important;padding:${U(5)} ${U(14)} ${U(6)}!important;border-radius:${U(17)}!important;background:linear-gradient(#1e1712f0,#110d0af2)!important;border:1px solid #a4895e99!important;box-shadow:0 ${U(2)} ${U(9)} #000d!important;white-space:nowrap!important;transition:border-color .15s,box-shadow .15s,background .15s}
${M} .nbm-nm{display:flex!important;align-items:center!important;gap:${U(7)}!important;font:400 max(13px,${TU(17)})/1.15 Georgia,serif!important;color:#ead9b8!important;text-shadow:0 1px 2px #000!important;letter-spacing:.01em!important}
${M} .nbm-st{display:block!important;font:400 max(11px,${TU(12.5)})/1.1 Georgia,serif!important;color:#b69e74!important;letter-spacing:.02em!important}
${M} .nbm-st:empty{display:none!important}
${CH}.nbm-lk .nbm-nm{color:#a99a80!important}
${CH}.nbm-lk .nbm-nm:before{content:''!important;display:block!important;width:.62em!important;height:.74em!important;background:${KLODKA} center/contain no-repeat!important;flex:none!important}
${CH}.nbm-lk .nbm-pin{background:radial-gradient(circle,#6d6253 0 26%,#1d1914 30% 100%)!important;border-color:#7d6e58!important}
${CH}.nbm-won .nbm-nm:before{content:'✓'!important;color:#e6c47c!important;font-weight:700!important;flex:none!important}
${CH}.nbm-won .nbm-pin{background:radial-gradient(circle,#ffe2a2 0 42%,#8a6528 46% 100%)!important}
${CH}.premium-selected .nbm-tag{border-color:#e2bf74!important;background:linear-gradient(#3b2b19f5,#1d150ef5)!important;box-shadow:0 0 0 1px #e2bf7488,0 0 ${U(16)} #e0b46055,0 ${U(2)} ${U(9)} #000d!important}
${CH}.premium-selected .nbm-nm{color:#fff0cf!important}
${CH}.premium-selected .nbm-pin{transform:scale(1.3);box-shadow:0 0 0 ${U(2)} #000a,0 0 ${U(12)} #f0c46a}
${CH}:not(:disabled):hover .nbm-tag{border-color:#d6b778!important}
${CH}:is(:focus-visible,.pf) .nbm-tag{outline:2px solid var(--nbs-focus,#e8c47a)!important;outline-offset:${U(3)}!important}
${M} .premium-map>.premium-banner{grid-column:2!important;grid-row:1!important;position:relative!important;width:100%!important;height:100%!important;min-height:0!important;box-sizing:border-box!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;padding:${U(20)} ${U(24)} ${U(22)}!important;background-color:#0e0b0b!important;background-size:100% 54%,auto 54%!important;background-position:top center,top center!important;background-repeat:no-repeat!important;border:1px solid #a4895e55!important;border-image:none!important;mask-image:none!important;overflow:hidden!important;box-shadow:inset 0 0 ${U(40)} #000a!important}
${M} .premium-map>.premium-banner>.premium-caption{position:static!important;inset:auto!important;margin:0!important;padding:0!important;font-size:${TU(36)}!important;line-height:1.08!important;text-align:left!important;max-width:none!important;white-space:normal!important}
${M} .premium-map>.premium-banner>.premium-caption:before{margin:0 0 ${U(8)}!important;font-size:${TU(13)}!important}
${M} .premium-map>.premium-banner>.nb2-chdesc{display:block!important;position:static!important;inset:auto!important;margin:${U(10)} 0 0!important;padding:0!important;max-width:none!important;width:auto!important;white-space:normal!important;font-size:max(12px,${TU(15)})!important;line-height:1.35!important}
${M} .premium-map>.premium-banner>.pc-destination-facts{position:static!important;inset:auto!important;margin:${U(14)} 0 0!important;padding:${U(12)} 0 0!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:${U(10)} ${U(16)}!important}
${M} .premium-map>.premium-banner>.pc-destination-facts>.nb2-medcell{grid-column:1/-1!important}
${M} .premium-map>.premium-banner>.pc-destination-facts>div{gap:${U(6)}!important}
${M} .premium-map>.premium-banner>.pc-destination-facts small{font-size:max(11px,${TU(13)})!important}
`;document.head.append(st);
}catch(e){quietErr('mapaPodrozy',e)}})();
// 16.11.2026: Opcje wg makiety GPT (runda opcje-makieta). Nakladka na istniejace przelaczniki: kazdy wiersz steruje oryginalna kontrolka
// (klik w przycisk wyboru, wartosc suwaka, przelacznik), wiec zapis i dzialanie ustawien bez zmian. Lewy panel: lista; prawy: podglad z opisem.
// Sterowanie zostaje w dawnym ukladzie (schematy klawiatury i pada). Pad: wiersz = suwak (lewo/prawo zmienia), przelacznik = A.
(()=>{try{
 const opts=$('opts');if(!opts)return;const content=opts.querySelector('.premium-page-content'),tabsEl=opts.querySelector('.tabs');if(!content||!tabsEl)return;
 const T=(p,e)=>EN?e:p,O='#orient'.repeat(400),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
  TL='assets/tla/',IMG={aud:TL+'97b8d8b5e7e5da70944aef02ec7e777a3f1e37659ab1be2db2b361380bbd634b.webp',gfx:TL+'76c4abede7b11dab955422e0b91d11d6a38a1feecdd13c62d91f37a0813a6057.webp',set:TL+'ecf32c2027558304a42a83f5f5579adfa4793432dc7df3f2276ec6b7f2846daa.webp',dat:TL+'4a6ee44e8d3191b5cc561568e1c539fea1d7145356e5558f88ec0674a86ab5c5.webp'},
  q=s=>opts.querySelector(s);
 // spis wierszy: s = naglowek sekcji; t: ch (wybor z przyciskow), rng (suwak), tgl (przelacznik), act (przycisk), info (tekst), trn (tryb testera)
 const SPEC=()=>({
  aud:[{s:T('Głośność','Volume')},{t:'rng',e:'#pane-aud .musSl',n:T('Muzyka','Music'),d:T('Głośność muzyki w menu i w czasie nocy.','Music volume in menus and during the night.')},{t:'rng',e:'#pane-aud .sfxSl',n:T('Efekty','Effects'),d:T('Głośność ciosów, kroków, okrzyków i dźwięków menu.','Volume of hits, steps, shouts and menu sounds.')}],
  gfx:[{s:T('Obraz','Display')},{t:'rng',e:'#briSl',n:T('Jasność obrazu','Brightness'),d:T('Jeśli gra jest dla Ciebie zbyt ciemna, zwiększ jasność. Domyślnie 100%.','If the game looks too dark, raise the brightness. Default 100%.')},{t:'ch',e:'#fsRow',n:T('Tryb wyświetlania','Display mode'),d:T('Gra w oknie przeglądarki albo na pełnym ekranie.','Play in the browser window or full screen.')},
   {s:T('Jakość','Quality')},{t:'ch',e:'#qualityRow',n:T('Jakość grafiki','Graphics quality'),d:T('Auto: na komputerze Wysoka. Ultra: najlepszy obraz dla mocnych komputerów; jeśli gra klatkuje, wybierz niższy poziom.','Auto: High on a computer. Ultra: the best image for strong PCs; if the game stutters, pick a lower level.')},
   {s:T('Płynność','Smoothness')},{t:'ch',e:'#fpsRow',n:T('Limit klatek','Frame limit'),d:T('Niższy limit może pomóc, gdy gra klatkuje. 120 ma sens tylko na ekranie 120 Hz lub szybszym.','A lower limit can help when the game stutters. 120 only makes sense on a 120 Hz or faster screen.')},{t:'tgl',e:'#fpsTgl',n:T('Licznik FPS','FPS counter'),d:T('Pokazuje liczbę klatek na sekundę (diagnostyka).','Shows frames per second (diagnostics).')},
   {s:T('Zaawansowane','Advanced')},{t:'ch',e:'#gShadowRow',n:T('Cienie','Shadows')},{t:'ch',e:'#gLightsRow',n:T('Światła dynamiczne','Dynamic lights')},{t:'ch',e:'#gFxRow',n:T('Efekty obrazu','Image effects'),d:T('Poświata i rozmycie.','Glow and blur.')},{t:'ch',e:'#gPartsRow',n:T('Cząsteczki','Particles'),d:T('Iskry, pył, popiół.','Sparks, dust, ash.')},{t:'ch',e:'#gResRow',n:T('Rozdzielczość obrazu','Render resolution')},{t:'ch',e:'#gDynRow',n:T('Dynamiczna rozdzielczość','Dynamic resolution'),d:T('Sama obniża ostrość sceny, gdy gra nie wyrabia, i podnosi ją, gdy jest zapas.','Lowers scene sharpness when the game struggles and raises it when there is headroom.')},{t:'ch',e:'#gDprRow',n:T('Gęstość pikseli','Pixel density'),d:T('Niższa jest lżejsza dla karty graficznej, ale mniej ostra.','Lower is lighter on the graphics card but less sharp.')},{t:'ch',e:'#gTexRow',n:T('Tekstury ziemi HD','HD ground textures'),d:T('Ostrzejsza ziemia (2048 px), pobierana przy pierwszym włączeniu, ok. 12 MB.','Sharper ground (2048 px), downloaded the first time, about 12 MB.')}],
  set:[{s:T('Ogólne','General')},{t:'ch',e:'#pane-set .langrow',n:T('Język','Language'),d:T('Język napisów w grze i w menu.','Language of the game and menus.')},{t:'ch',e:'#tsRow',n:T('Tekst w menu','Menu text'),d:T('Powiększa tekst w menu, Kronice, instrukcji i podsumowaniu nocy.','Enlarges text in menus, the Chronicle, the guide and the night summary.')},
   {s:T('Czytelność','Readability')},{t:'rng',e:'#sub-ui .ftsSl',n:T('Wielkość napisów','Text size'),fts:1,d:T('Wielkość napisów w czasie nocy.','Size of in-game text during the night.')},{t:'tgl',e:'#sub-ui .dmgTgl',n:T('Liczby obrażeń','Damage numbers'),d:T('Liczby obrażeń nad wrogami.','Damage numbers above enemies.')},{t:'tgl',e:'#contrastTgl',n:T('Kontrastowe ostrzeżenia','High-contrast warnings'),d:T('Ostrzeżenia przed atakami w kolorach żółtym i białym.','Attack warnings in yellow and white.')},
   {s:T('Komfort','Comfort')},{t:'tgl',e:'#shakeTgl',n:T('Wstrząsy kamery','Camera shake')},{t:'tgl',e:'#rumbleTgl',n:T('Wibracje pada','Controller vibration')},{t:'tgl',e:'#flashTgl',n:T('Intensywne błyski','Intense flashes')},{t:'tgl',e:'#oneHandTgl',n:T('Automatyczne szybkie ataki','Automatic quick attacks'),d:T('Postać sama atakuje pobliskich wrogów (gra jedną ręką). Nadal możesz używać bloku, uniku i silnego ataku.','Your hero attacks nearby enemies by itself (one-handed play). You can still block, dodge and use the heavy attack.')},
   {s:T('Samouczek','Tutorial')},{t:'act',e:'#repeatTut',n:T('Powtórz samouczek','Repeat the tutorial'),d:T('Przy następnej nocy samouczek tego trybu zacznie się od początku.','The tutorial for this mode starts over on your next night.')},
   {t:'trn',e:'#trnOpt'}],
  dat:[{s:T('Postęp','Progress')},{t:'info',e:'#datInfo'},{t:'act',e:'#expSave',n:T('Zapisz postęp do pliku','Save progress to a file'),dq:'#saveMsg'},{t:'act',e:'#impSave',n:T('Wczytaj postęp z pliku','Load progress from a file'),dq:'#saveMsg'},
   {s:T('Diagnostyka','Diagnostics')},{t:'act',e:'#copyErrors',n:T('Kopiuj raport błędów','Copy the error report'),d:T('Kopiuje do schowka raport błędów dla autora gry.','Copies an error report for the game author.')},
   {s:T('Usuwanie zapisu','Delete save')},{t:'act',e:'#clearSave',n:T('Wyczyść zapis postępu','Clear saved progress'),dan:1,d:T('Usuwa rekordy, poziomy i odblokowane perki w obu trybach. Tego nie da się cofnąć.','Removes records, levels and unlocked perks in both modes. This cannot be undone.')}]});
 const st=document.createElement('style');st.id='nb-opcje-makieta';st.textContent=`
${O} #opts.nbq-on .premium-page-content>.pane:not(#pane-ctl){display:none!important}
${O} #opts.nbq-on .premium-page-content{--u:calc(min(100vw,177.78vh)/1920)}
${O} #opts.nbq-on:not(.nbq-ctl) .premium-page-content{overflow:hidden!important;padding:0!important}
${O} :is(#opts,#pause) .nbq{display:none!important}
${O} #opts.nbq-on:not(.nbq-ctl) .nbq{display:grid!important;grid-template-columns:47% 1fr!important;gap:calc(24*var(--u))!important;height:100%!important;min-height:calc(560*var(--u))!important;padding:calc(6*var(--u)) 0!important;box-sizing:border-box!important}
${O} :is(#opts,#pause) .nbq-l,${O} :is(#opts,#pause) .nbq-p{position:relative!important;min-height:0!important;border:calc(18*var(--u)) solid transparent!important;border-image:var(--nbq-rama) 48 stretch!important;background:linear-gradient(180deg,rgba(13,10,10,.92),rgba(8,6,7,.95)) padding-box!important}
${O} :is(#opts,#pause) .nbq-l{overflow-y:auto!important;padding:calc(12*var(--u)) calc(16*var(--u))!important;scrollbar-width:thin!important;scrollbar-color:#7a5530 rgba(255,255,255,.04)!important}
${O} :is(#opts,#pause) .nbq-h{display:block!important;text-align:left!important;margin:calc(14*var(--u)) 0 calc(4*var(--u))!important;padding:calc(10*var(--u)) calc(18*var(--u))!important;font:700 calc(29*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.05em!important;color:#f0dcb6!important;text-shadow:0 2px 4px #000!important;background:linear-gradient(180deg,rgba(60,40,30,.55),rgba(26,18,14,.85))!important;border:1px solid rgba(160,120,70,.35)!important;box-shadow:inset 0 1px 0 rgba(255,210,150,.08)!important}
${O} :is(#opts,#pause) .nbq-h:first-child{margin-top:0!important}
${O} :is(#opts,#pause) .nbq-r{position:relative!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:calc(16*var(--u))!important;width:100%!important;box-sizing:border-box!important;min-height:calc(47*var(--u))!important;margin:0!important;padding:0 calc(28*var(--u)) 0 calc(18*var(--u))!important;font:400 calc(23*var(--u))/1.2 Georgia,serif!important;color:#ecdcbc!important;background:rgba(30,24,22,.55)!important;border:0!important;border-bottom:1px solid rgba(255,230,190,.06)!important;cursor:pointer!important;text-align:left!important;text-transform:none!important;letter-spacing:0!important;border-radius:0!important;box-shadow:none!important}
${O} :is(#opts,#pause) .nbq-r>input{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;margin:0!important;opacity:0!important;pointer-events:none!important}
${O} :is(#opts,#pause) .nbq-r:hover{background:rgba(70,48,34,.6)!important}
${O} :is(#opts,#pause) .nbq-r:focus-within,${O} :is(#opts,#pause) .nbq-r.pf,${O} :is(#opts,#pause) .nbq-r:focus-visible,${O} :is(#opts,#pause) .nbq-r.nbq-ak{background:linear-gradient(90deg,rgba(150,92,46,.85),rgba(96,58,30,.75))!important;box-shadow:inset 0 0 0 1px rgba(255,200,130,.55),inset calc(4*var(--u)) 0 0 #e0a860!important;color:#fff0d8!important;outline:none!important}
${O} :is(#opts,#pause) .nbq-v{display:flex!important;align-items:center!important;gap:calc(14*var(--u))!important;flex:none!important;min-width:calc(170*var(--u))!important;justify-content:flex-end!important;font:400 calc(23*var(--u))/1 Georgia,serif!important;color:#f0dcb6!important;white-space:nowrap!important}
${O} :is(#opts,#pause) .nbq-v b{font:400 calc(23*var(--u))/1 Georgia,serif!important;min-width:calc(110*var(--u))!important;text-align:center!important;color:#fff0d8!important}
${O} :is(#opts,#pause) .nbq-a{font:700 calc(26*var(--u))/1 Georgia,serif!important;color:#e0b878!important;padding:0 calc(6*var(--u))!important;cursor:pointer!important;user-select:none!important}
${O} :is(#opts,#pause) .nbq-a:hover{color:#fff0d8!important}
${O} :is(#opts,#pause) .nbq-cb{display:inline-block!important;width:calc(17*var(--u))!important;height:calc(17*var(--u))!important;border:1px solid #c8b694!important;position:relative!important;margin-right:calc(4*var(--u))!important}
${O} :is(#opts,#pause) .nbq-r.on .nbq-cb::after{content:'✓'!important;position:absolute!important;left:calc(1*var(--u))!important;top:calc(-6*var(--u))!important;font:700 calc(20*var(--u))/1 Georgia,serif!important;color:#f0dcb6!important}
${O} :is(#opts,#pause) .nbq-v .nbq-ow{min-width:calc(52*var(--u))!important;text-align:left!important}
${O} :is(#opts,#pause) .nbq-r.nbq-act .nbq-v{color:#e0b878!important;min-width:0!important}
${O} :is(#opts,#pause) .nbq-r.nbq-dan{color:#f0b09a!important}
${O} :is(#opts,#pause) .nbq-info{text-align:left!important;padding:calc(12*var(--u)) calc(18*var(--u))!important;font:italic calc(19*var(--u))/1.35 Georgia,serif!important;color:#d8c8a6!important;background:rgba(30,24,22,.4)!important}
${O} :is(#opts,#pause) .nbq-trn{display:flex!important;gap:calc(10*var(--u))!important;padding:calc(8*var(--u)) calc(18*var(--u))!important;background:rgba(30,24,22,.55)!important}
${O} :is(#opts,#pause) .nbq-trn input{flex:1!important;min-width:0!important;height:calc(40*var(--u))!important;font:400 calc(19*var(--u))/1 Georgia,serif!important;color:#ecdcbc!important;background:#0c0a0a!important;border:1px solid rgba(201,160,100,.45)!important;padding:0 calc(10*var(--u))!important}
${O} :is(#opts,#pause) .nbq-trn button{height:calc(40*var(--u))!important;padding:0 calc(18*var(--u))!important;font:700 calc(16*var(--u))/1 Cinzel,Georgia,serif!important;color:#f0dcb6!important;background:rgba(60,40,28,.85)!important;border:1px solid rgba(201,160,100,.55)!important}
${O} :is(#opts,#pause) .nbq-p{overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;padding:calc(30*var(--u))!important}
${O} :is(#opts,#pause) .nbq-pi{position:absolute!important;inset:0!important;display:block!important;background-position:center!important;background-size:cover!important;background-repeat:no-repeat!important;filter:brightness(.62) saturate(.85)!important}
${O} :is(#opts,#pause) .nbq-pg{position:absolute!important;inset:0!important;display:block!important;background:linear-gradient(180deg,rgba(8,6,7,0) 35%,rgba(8,6,7,.82) 72%,rgba(8,6,7,.96))!important}
${O} :is(#opts,#pause) .nbq-pt{position:relative!important;text-align:left!important}
${O} :is(#opts,#pause) .nbq-pk{display:block!important;font:600 calc(16*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.2em!important;color:#c08a5a!important;margin-bottom:calc(14*var(--u))!important}
${O} :is(#opts,#pause) .nbq-pn{display:block!important;font:400 calc(36*var(--u))/1.15 Georgia,serif!important;color:#f6e6c8!important;text-shadow:0 2px 6px #000!important}
${O} :is(#opts,#pause) .nbq-pd{display:block!important;margin-top:calc(14*var(--u))!important;font:400 calc(19*var(--u))/1.4 Georgia,serif!important;color:#d8c8a6!important;max-width:calc(700*var(--u))!important}
${O} :is(#opts,#pause) .nbq-tb{position:static!important;align-self:center!important;flex:none!important;font:700 calc(14*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(5*var(--u)) calc(8*var(--u))!important;background:rgba(0,0,0,.5)!important;pointer-events:none!important}
${O} :is(#opts,#pause) .nbq-tb.l{order:-1!important;margin-right:calc(6*var(--u))!important}${O} :is(#opts,#pause) .nbq-tb.r{order:99!important;margin-left:calc(6*var(--u))!important}
${O} :is(#opts,#pause) .nbq-f{display:flex!important;justify-content:center!important;align-items:center!important;gap:calc(48*var(--u))!important;flex:none!important;padding:calc(12*var(--u)) 0 calc(4*var(--u))!important;border-top:1px solid rgba(201,160,100,.22)!important;font:400 calc(21*var(--u))/1 Georgia,serif!important;color:#ecdcbc!important;--u:calc(min(100vw,177.78vh)/1920)}
${O} :is(#opts,#pause) .nbq-f>span{display:flex!important;align-items:center!important;gap:calc(14*var(--u))!important}
${O} :is(#opts,#pause) .nbq-f kbd{font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(6*var(--u)) calc(9*var(--u))!important;background:rgba(0,0,0,.5)!important}
`;document.head.append(st);
 {const r=getComputedStyle(document.documentElement);}
 const box=document.createElement('div');box.className='nbq';box.innerHTML='<div class="nbq-l" role="list"></div><div class="nbq-p"><div class="nbq-pi"></div><div class="nbq-pg"></div><div class="nbq-pt"><span class="nbq-pk"></span><span class="nbq-pn"></span><span class="nbq-pd"></span></div></div>';
 content.prepend(box);const L=box.querySelector('.nbq-l');
 box.style.setProperty('--nbq-rama',"url('assets/ui/39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp')");
 const foot=document.createElement('div');foot.className='nbq-f';opts.append(foot);
 for(const [c,t] of [['l','LB'],['r','RB']]){const b=document.createElement('span');b.className='nbq-tb '+c;b.textContent=t;c==='l'?tabsEl.prepend(b):tabsEl.append(b)}
 let tab='',rows=[],akt=null;
 const curTab=()=>{const t=opts.querySelector('.tabs>.tab.on');return t?t.dataset.tab:'gfx'};
 const chBtns=g=>[...g.querySelectorAll('button')].filter(b=>!b.hidden);
 const chIdx=g=>{const b=chBtns(g);let i=b.findIndex(x=>x.classList.contains('on')||x.getAttribute('aria-pressed')==='true');return i};
 function val(r){const e=r.el;
  if(r.t==='ch'){const b=chBtns(e),i=chIdx(e);return{i,txt:i>=0?b[i].textContent.trim():'—',n:b.length}}
  if(r.t==='rng')return{v:+e.value,txt:Math.round(+e.value)+'%'};
  if(r.t==='tgl')return{on:!!e.checked};return{}}
 function upd(){for(const r of rows){if(!r.row)continue;const v=val(r);
   if(r.t==='ch'){r.inp.max=String(Math.max(0,(v.n-1)*5));r.inp.value=String(Math.max(0,v.i)*5);r.row.querySelector('b').textContent=v.txt}
   else if(r.t==='rng'){r.inp.value=String(v.v);r.row.querySelector('b').textContent=v.txt}
   else if(r.t==='tgl'){r.inp.checked=v.on;r.row.classList.toggle('on',v.on);r.row.querySelector('.nbq-ow').textContent=v.on?T('Wł.','On'):T('Wył.','Off')}
   else if(r.t==='info'){const sp=[...r.el.querySelectorAll('span')].filter(x=>!x.children.length).map(x=>x.textContent.trim()).filter(x=>x&&!/^(Postęp i rekordy|Progress and records)$/i.test(x));r.row.textContent=(sp.length?sp.join(' · '):r.el.textContent.trim())}}
  podglad()}
 function podglad(){const r=akt||rows.find(x=>x.row&&x.t!=='info'),pi=box.querySelector('.nbq-pi');pi.style.setProperty('background-image',`url('${IMG[tab]||IMG.set}')`,'important');
  const k=box.querySelector('.nbq-pk'),n=box.querySelector('.nbq-pn'),d=box.querySelector('.nbq-pd');n.style.fontSize='';
  if(!r){k.textContent='';n.textContent='';d.textContent='';return}
  if(r.fts){const v=+r.el.value||100;k.textContent=T('PODGLĄD NAPISÓW','TEXT PREVIEW');n.textContent=T('Droga prowadzi do kaplicy.','The road leads to the chapel.');n.style.fontSize=`calc(${36*v/100}*var(--u))`;d.textContent=T('Wielkość tekstu · ','Text size · ')+Math.round(v)+'%';return}
  k.textContent=(r.sec||'').toUpperCase();n.textContent=r.n||'';d.textContent=r.dq?(q(r.dq)?.textContent.trim()||''):(r.d||(r.t==='ch'?T('Obecnie: ','Current: ')+val(r).txt+'.':''))}
 function apply(r){if(r.t==='ch'){const b=chBtns(r.el),i=Math.round(+r.inp.value/5);if(b[i]&&!(b[i].classList.contains('on')||b[i].getAttribute('aria-pressed')==='true'))b[i].click()}
  else if(r.t==='rng'){r.el.value=r.inp.value;r.el.dispatchEvent(new Event('input',{bubbles:true}));r.el.dispatchEvent(new Event('change',{bubbles:true}))}
  else if(r.t==='tgl'){if(!!r.el.checked!==r.inp.checked)r.el.click()}
  setTimeout(upd,30)}
 function build(){tab=curTab();akt=null;rows=[];L.innerHTML='';const spec=SPEC()[tab]||[];let sec='';
  for(const s of spec){if(s.s){sec=s.s;const h=document.createElement('div');h.className='nbq-h';h.textContent=s.s;L.append(h);continue}
   const el=q(s.e);if(!el)continue;const r={...s,el,sec};
   if(s.t==='trn'){if(el.hidden||getComputedStyle(el).display==='none')continue;const h=document.createElement('div');h.className='nbq-h';h.textContent=T('Tryb testera','Tester mode');L.append(h);
    const w=document.createElement('div');w.className='nbq-trn';w.innerHTML=`<input type="password" aria-label="${T('Kod','Code')}"><button type="button">${T('Odblokuj','Unlock')}</button>`;const [i,b]=w.children;
    const go=()=>{const c=$('trnCode');if(c){c.value=i.value;$('trnBtn')?.click();i.value=''}};b.addEventListener('click',go);i.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')go()});L.append(w);continue}
   if(s.t==='info'){const d=document.createElement('div');d.className='nbq-info';r.row=d;L.append(d);rows.push(r);continue}
   if(s.t==='act'){const b=document.createElement('button');b.type='button';b.className='nbq-r nbq-act'+(s.dan?' nbq-dan':'');b.innerHTML=`<span>${esc(s.n)}</span><span class="nbq-v">›</span>`;b.addEventListener('click',()=>{el.click();setTimeout(upd,60)});r.row=b;r.inp=b;L.append(b);rows.push(r);continue}
   const lab=document.createElement('label');lab.className='nbq-r';const inp=document.createElement('input');r.row=lab;r.inp=inp;
   if(s.t==='tgl'){inp.type='checkbox';lab.innerHTML=`<span>${esc(s.n)}</span><span class="nbq-v"><i class="nbq-cb"></i><span class="nbq-ow"></span></span>`;inp.addEventListener('change',()=>apply(r))}
   else{inp.type='range';if(s.t==='ch'){inp.min='0';inp.step='5'}else{inp.min=el.min||'0';inp.max=el.max||'100';inp.step=String(Math.max(5,+el.step||0))}
    lab.innerHTML=`<span>${esc(s.n)}</span><span class="nbq-v"><i class="nbq-a" data-d="-1">‹</i><b></b><i class="nbq-a" data-d="1">›</i></span>`;
    inp.addEventListener('input',()=>apply(r));
    inp.addEventListener('keydown',e=>{const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();const nv=Math.max(+inp.min,Math.min(+inp.max,+inp.value+(+inp.step||5)*d));if(nv!==+inp.value){inp.value=String(nv);apply(r)}});/* strzalki: wlasny krok (domyslna obsluga suwaka bywa blokowana) */
    lab.addEventListener('click',e=>{const a=e.target.closest('.nbq-a');e.preventDefault();inp.focus({preventScroll:true});if(!a)return;const stp=+inp.step||5,nv=Math.max(+inp.min,Math.min(+inp.max,+inp.value+stp*(+a.dataset.d)));if(nv!==+inp.value){inp.value=String(nv);apply(r)}})}
   inp.setAttribute('aria-label',s.n);inp.tabIndex=0;lab.append(inp);L.append(lab);rows.push(r)}
  upd()}
 const fokus=e=>{const r=rows.find(x=>x.row&&x.row.contains(e.target));if(r){akt=r;for(const x of rows)x.row&&x.row.classList.toggle('nbq-ak',x===r);podglad()}};
 L.addEventListener('focusin',fokus);L.addEventListener('mouseover',fokus);
 function stopka(){const pad=document.body.classList.contains('padnav');foot.innerHTML=pad?`<span><kbd>LB / RB</kbd>${T('Zakładki','Tabs')}</span><span><kbd>A</kbd>${T('Wybierz','Select')}</span><span><kbd>B</kbd>${T('Wróć','Back')}</span>`:`<span><kbd>← →</kbd>${T('Zmień wartość','Change value')}</span><span><kbd>Enter</kbd>${T('Wybierz','Select')}</span><span><kbd>Esc</kbd>${T('Wróć','Back')}</span>`}
 function nazwyZakladek(){const m={aud:T('Dźwięk','Sound'),set:T('Rozgrywka i interfejs','Gameplay & interface')};for(const b of opts.querySelectorAll('.tabs>.tab'))if(m[b.dataset.tab]&&b.textContent!==m[b.dataset.tab])b.textContent=m[b.dataset.tab]}
 function sync(){if(opts.hidden)return;opts.classList.add('nbq-on');nazwyZakladek();const t=curTab();opts.classList.toggle('nbq-ctl',t==='ctl');if(t!==tab)build();else upd();stopka()}
 new MutationObserver(()=>setTimeout(sync,0)).observe(opts,{attributes:true,attributeFilter:['hidden']});
 tabsEl.addEventListener('click',()=>setTimeout(sync,0));
 opts.addEventListener('change',e=>{if(!box.contains(e.target))setTimeout(upd,30)},true);
 new MutationObserver(()=>{if(!opts.hidden&&tab==='dat')upd()}).observe(q('#datInfo')||opts,{childList:true,subtree:true,characterData:true});
 new MutationObserver(stopka).observe(document.body,{attributes:true,attributeFilter:['class']});
 sync();
}catch(e){quietErr('opcjeMakieta',e)}})();
// 16.11.2026: Pauza wg makiety GPT (runda menu-pauza-instrukcja-kronika-kaplica). Zakladka Umiejetnosci: lewy panel = sloty (klawisz, nazwa, Slot N),
// prawy = umiejetnosci do wybranego slotu (ikona, koszt, stan, ktory slot) + opis wskazanej. Te same przyciski co dotad (data-slot / data-equip),
// tylko przestawione po renderLoadoutOne, wiec wyposazanie, blokada w walce i 2 graczy dzialaja jak wczesniej. Stopka: podpowiedz, Porzuc noc, Wroc do gry.
(()=>{try{
 const pause=$('pause'),el=$('skillLoadout');if(!pause||!el)return;
 const T=(p,e)=>EN?e:p,O='#orient'.repeat(400),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const st=document.createElement('style');st.id='nb-pauza-makieta';st.textContent=`
${O} #pause{--u:calc(min(100vw,177.78vh)/1920)}
${O} #pause .nbp-nav>.nbq-tb{align-self:center!important;font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(6*var(--u)) calc(9*var(--u))!important;background:rgba(0,0,0,.5)!important;pointer-events:none!important}
${O} #pause .nbp-nav>.nbq-tb.l{order:-1!important}${O} #pause .nbp-nav>.nbq-tb.r{order:50!important}
${O} #pause .nbp-nav>.btnrow{order:99!important;justify-content:space-between!important;align-items:center!important}
${O} #pause .nbp-nav>.btnrow>.nbz-hint{flex:1!important;font:400 calc(21*var(--u))/1.3 Georgia,serif!important;color:#d8c8a6!important;text-align:left!important}
${O} #pause .nbp-nav>.btnrow>#pauseMenuBtn{order:2!important;flex:none!important;background:none!important;border:0!important;border-image:none!important;box-shadow:none!important;min-width:0!important;padding:calc(8*var(--u)) calc(16*var(--u))!important;font:600 calc(19*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.06em!important;color:#b9a789!important;filter:none!important}
${O} #pause .nbp-nav>.btnrow>#pauseMenuBtn:is(:hover,:focus-visible,.pf){color:#f0b09a!important;text-decoration:underline!important}
${O} #pause .nbp-nav>.btnrow>#resumeBtn{order:3!important;flex:none!important}
${O} #pause .nbp-nav>.btnrow>.nbz-hint{order:1!important}
${O} #pause #skillLoadout.nbz{border:0!important;border-image:none!important;background:none!important;box-shadow:none!important;padding:0!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:calc(26*var(--u))!important;align-items:stretch!important;max-width:calc(1640*var(--u))!important;margin:0 auto!important}
${O} #pause #skillLoadout.nbz>.pcmp-loadout-tabs{grid-column:1/-1!important}
${O} #pause .nbz-c{position:relative!important;display:flex!important;flex-direction:column!important;min-height:calc(560*var(--u))!important;padding:calc(18*var(--u)) calc(22*var(--u))!important;border:calc(18*var(--u)) solid transparent!important;border-image:url('assets/ui/39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp') 48 stretch!important;background:linear-gradient(180deg,rgba(13,10,10,.92),rgba(8,6,7,.95)) padding-box!important}
${O} #pause .nbz-h{display:block!important;margin:0!important;padding:calc(10*var(--u)) calc(18*var(--u))!important;text-align:left!important;font:700 calc(30*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.05em!important;color:#f0dcb6!important;text-shadow:0 2px 4px #000!important;background:linear-gradient(180deg,rgba(60,40,30,.55),rgba(26,18,14,.85))!important;border:1px solid rgba(160,120,70,.35)!important}
${O} #pause .nbz-s{margin:calc(14*var(--u)) 0 calc(12*var(--u)) calc(4*var(--u))!important;text-align:left!important;font:400 calc(21*var(--u))/1.3 Georgia,serif!important;color:#e3d3b3!important}
${O} #pause #skillLoadout.nbz .slot-pick{display:flex!important;flex-direction:column!important;gap:0!important;grid-template-columns:none!important}
${O} #pause #skillLoadout.nbz .slot-tab{display:grid!important;grid-template-columns:calc(56*var(--u)) calc(40*var(--u)) minmax(0,1fr) auto!important;grid-template-rows:auto!important;grid-auto-flow:column!important;align-items:center!important;justify-items:start!important;gap:calc(14*var(--u))!important;min-height:calc(66*var(--u))!important;width:100%!important;margin:0!important;padding:calc(6*var(--u)) calc(16*var(--u))!important;text-align:left!important;background:rgba(30,24,22,.5)!important;background-image:none!important;border:0!important;border-bottom:1px solid rgba(255,230,190,.07)!important;border-image:none!important;box-shadow:none!important;filter:none!important}
${O} #pause #skillLoadout.nbz .slot-tab .loadout-key{display:none!important}
${O} #pause #skillLoadout.nbz .slot-tab .nbz-k{grid-column:1!important;grid-row:1!important;justify-self:center!important;font:700 calc(17*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(6*var(--u)) calc(9*var(--u))!important;background:rgba(0,0,0,.5)!important;white-space:nowrap!important}
${O} #pause #skillLoadout.nbz .slot-tab .ic{grid-column:2!important;grid-row:1!important;width:calc(36*var(--u))!important;height:calc(36*var(--u))!important}
${O} #pause #skillLoadout.nbz .slot-tab .loadout-name{grid-column:3!important;grid-row:1!important;text-align:left!important;font:700 calc(26*var(--u))/1.15 Georgia,serif!important;color:#f2dfba!important}
${O} #pause #skillLoadout.nbz .slot-tab .loadout-name.empty-name{font:italic 400 calc(25*var(--u))/1.15 Georgia,serif!important;color:#9a8b72!important;grid-row:1!important}
${O} #pause #skillLoadout.nbz .slot-tab .nbz-n{grid-column:4!important;grid-row:1!important;font:400 calc(18*var(--u))/1 Georgia,serif!important;color:#c8b694!important;text-align:right!important}
${O} #pause #skillLoadout.nbz .slot-tab .nbz-n small{display:block!important;margin-top:calc(4*var(--u))!important;font-size:calc(14*var(--u))!important;color:#9a8b72!important}
${O} #pause #skillLoadout.nbz .slot-tab:is(.chosen,:hover,:focus-visible,.pf){background:linear-gradient(90deg,rgba(150,92,46,.85),rgba(70,44,26,.6))!important;box-shadow:inset calc(4*var(--u)) 0 0 #e0a860!important}
${O} #pause #skillLoadout.nbz .slot-tab:is(:focus-visible,.pf){outline:calc(2*var(--u)) solid rgba(240,190,120,.85)!important;outline-offset:calc(-2*var(--u))!important}
${O} #pause #skillLoadout.nbz .slot-tab.chosen .loadout-key:after{content:none!important}
${O} #pause #skillLoadout.nbz .slot-inventory{display:flex!important;flex-direction:column!important;gap:calc(8*var(--u))!important;grid-template-columns:none!important}
${O} #pause #skillLoadout.nbz .slot-inventory button.go:not(.alt){display:grid!important;grid-template-columns:calc(52*var(--u)) minmax(0,1fr) auto!important;align-items:center!important;gap:calc(16*var(--u))!important;min-height:calc(86*var(--u))!important;width:100%!important;margin:0!important;padding:calc(8*var(--u)) calc(18*var(--u))!important;text-align:left!important;background:rgba(30,24,22,.55)!important;background-image:none!important;border:1px solid rgba(255,230,190,.07)!important;border-image:none!important;box-shadow:none!important;filter:none!important}
${O} #pause #skillLoadout.nbz .slot-inventory button.go:not(.alt) .ic{width:calc(48*var(--u))!important;height:calc(48*var(--u))!important}
${O} #pause #skillLoadout.nbz .slot-inventory .loadout-copy{padding:0!important;text-align:left!important;font:700 calc(26*var(--u))/1.15 Georgia,serif!important;color:#f2dfba!important}
${O} #pause #skillLoadout.nbz .slot-inventory .loadout-copy small{display:block!important;margin-top:calc(6*var(--u))!important;font:400 calc(19*var(--u))/1.2 Georgia,serif!important;color:#d8c8a6!important}
${O} #pause #skillLoadout.nbz .slot-inventory .nbz-ss{font:400 calc(18*var(--u))/1 Georgia,serif!important;color:#c8b694!important;white-space:nowrap!important}
${O} #pause #skillLoadout.nbz .slot-inventory button.selected-skill{border:1px solid #e0b060!important;box-shadow:inset 0 0 0 1px rgba(255,200,120,.35)!important;background:rgba(60,40,24,.6)!important}
${O} #pause #skillLoadout.nbz .slot-inventory button.selected-skill .nbz-ss{color:#ffe2a2!important}
${O} #pause #skillLoadout.nbz .slot-inventory button.selected-skill:after{content:none!important}
${O} #pause #skillLoadout.nbz .slot-inventory button.go:not(.alt):is(:hover,:focus-visible,.pf){background:linear-gradient(90deg,rgba(150,92,46,.7),rgba(70,44,26,.5))!important}
${O} #pause #skillLoadout.nbz .slot-inventory button.go:not(.alt):is(:focus-visible,.pf){outline:calc(2*var(--u)) solid rgba(240,190,120,.85)!important;outline-offset:calc(-2*var(--u))!important}
${O} #pause #skillLoadout.nbz .slot-inventory button:disabled{opacity:.55!important}
${O} #pause .nbz-d{position:relative!important;margin-top:calc(14*var(--u))!important;padding:calc(20*var(--u)) calc(150*var(--u)) calc(20*var(--u)) calc(20*var(--u))!important;min-height:calc(120*var(--u))!important;background:rgba(30,24,22,.45)!important;border-top:1px solid rgba(201,160,100,.2)!important;text-align:left!important}
${O} #pause .nbz-d[hidden]{display:none!important}
${O} #pause .nbz-d b{display:block!important;font:600 calc(16*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.18em!important;color:#c08a5a!important;margin-bottom:calc(12*var(--u))!important;text-transform:uppercase!important}
${O} #pause .nbz-d span{display:block!important;font:400 calc(21*var(--u))/1.4 Georgia,serif!important;color:#ecdcbc!important}
${O} #pause .nbz-d .ic{position:absolute!important;right:calc(20*var(--u))!important;top:50%!important;translate:0 -50%!important;width:calc(100*var(--u))!important;height:calc(100*var(--u))!important;opacity:.28!important}
${O} #pause .nbz-c .loadout-state{margin:calc(10*var(--u)) 0!important;padding:calc(10*var(--u)) calc(14*var(--u))!important;font:italic calc(19*var(--u))/1.35 Georgia,serif!important;color:#d8c8a6!important;border-left:calc(3*var(--u)) solid rgba(201,160,100,.5)!important;background:rgba(30,24,22,.4)!important;text-align:left!important}
${O} #pause .nbz-c .loadout-state.nbz-ok{display:none!important}
${O} #pause #skillLoadout.nbz>.pcg-edge{display:none!important}
${O} #pause .nbz-e{display:flex!important;justify-content:flex-start!important;text-align:left!important;margin-top:auto!important;padding-top:calc(14*var(--u))!important;border-top:1px solid rgba(201,160,100,.22)!important}
${O} #pause .nbz-e button.go.alt{background:none!important;border:0!important;border-image:none!important;box-shadow:none!important;min-height:0!important;padding:calc(6*var(--u)) calc(4*var(--u))!important;font:400 calc(21*var(--u))/1.2 Georgia,serif!important;color:#d8c8a6!important;text-align:left!important;filter:none!important}
${O} #pause .nbz-e button.go.alt:is(:hover,:focus-visible,.pf):not(:disabled){color:#fff0d8!important;text-decoration:underline!important}
${O} #pause .nbz-e button.go.alt:disabled{opacity:.45!important}
${O} #pause .nbp-panel:has(#skillLoadout.nbz){border:0!important;border-image:none!important;background:none!important;box-shadow:none!important;padding:calc(6*var(--u)) calc(40*var(--u))!important}
${O} #pause .nbp-panel:has(#skillLoadout.nbz)::before,${O} #pause .nbp-panel:has(#skillLoadout.nbz)::after{content:none!important;display:none!important}
${O} #pause #skillLoadout.nbz .empty-name:before{content:none!important;display:none!important}
${O} #pause #skillLoadout.nbz .pc-loadout-reserve{margin:0!important;padding:0!important;border:0!important;background:none!important}
${O} #pause #skillLoadout.nbz .pc-reserve-title{display:none!important}
${O} #pause .nbz-c{min-height:0!important}
${O} #pause .nbz-d span{font-size:calc(19*var(--u))!important;line-height:1.35!important}
${O} #pause #skillLoadout.nbz>h2,${O} #pause #skillLoadout.nbz>p:not(.loadout-state){display:none!important}
`;document.head.append(st);
 // LB/RB przy zakladkach i podpowiedz w stopce
 const nav=pause.querySelector('.nbp-nav');
 if(nav){for(const [c,t] of [['l','LB'],['r','RB']]){const b=document.createElement('span');b.className='nbq-tb '+c;b.textContent=t;nav.append(b)}
  const br=nav.querySelector(':scope>.btnrow');if(br){const h=document.createElement('span');h.className='nbz-hint';br.prepend(h)}}
 const hint=()=>{const h=pause.querySelector('.nbz-hint');if(!h)return;const on=!el.closest('.nbp-pane')?.hidden&&!el.hidden;h.textContent=on?T('Techniki miecza i zaklęcia ostrza działają poza slotami.','Sword techniques and blade spells work outside slots.'):''};
 let pod=null;
 const desc=k=>{try{const d=SK[k];if(!d)return null;const L=Math.max(1,Math.min((d.lv||[]).length,sk(k)||1));const t=Array.isArray(d.lv)?d.lv[L-1]:'';return{kind:d.kind||'',txt:typeof t==='string'?t:'',ic:d.ic}}catch(e){return null}};
 function opis(){const d=el.querySelector('.nbz-d');if(!d)return;const sel=(S&&S.loadoutSelected)||0;let k=pod||(S&&S.activeSlots?S.activeSlots[sel]:null);if(!k){const f=el.querySelector('.slot-inventory [data-equip]:not([data-equip=""])');k=f?f.dataset.equip:null}
  const o=k&&desc(k);if(!o||!o.txt){d.hidden=true;return}d.hidden=false;d.innerHTML=`<b>${esc(o.kind)}</b><span>${esc(o.txt)}</span><i class="ic ic-${o.ic}" data-premium-skill="${k}"></i>`}
 function przestaw(){if(!S||el.hidden)return;const ae=document.activeElement,fs=el.contains(ae)?(ae.dataset.slot!==undefined?'[data-slot="'+ae.dataset.slot+'"]':ae.dataset.equip!==undefined?'[data-equip="'+ae.dataset.equip+'"]':null):null;
  const pick=el.querySelector(':scope>.slot-pick'),inv=el.querySelector(':scope>.slot-inventory');if(!pick||!inv)return;const states=[...el.querySelectorAll(':scope>.loadout-state')];
  const sel=(S.loadoutSelected||0)+1;
  const L=document.createElement('div');L.className='nbz-c nbz-l';L.innerHTML=`<div class="nbz-h">${T('Aktywne sloty','Active slots')}</div><p class="nbz-s">${T('Wybierz slot, którego obsadę chcesz zmienić.','Choose the slot you want to change.')}</p>`;L.append(pick);
  pick.querySelectorAll('.slot-tab').forEach((b,i)=>{const key=(b.querySelector('.loadout-key')?.textContent||'').split(' · '),k=document.createElement('kbd');k.className='nbz-k';k.textContent=document.body.classList.contains('padnav')&&key[1]?key[1]:key[0];
   const n=document.createElement('span');n.className='nbz-n';n.innerHTML=T('Slot ','Slot ')+(i+1);b.prepend(k);if(!b.querySelector('.ic')){const ph=document.createElement('i');ph.style.cssText='grid-column:2';b.append(ph)}b.append(n)});
  const nInv=inv.querySelectorAll('[data-equip]:not([data-equip=""])').length;
  const R=document.createElement('div');R.className='nbz-c nbz-r';R.innerHTML=`<div class="nbz-h">${T('Umiejętność do slotu ','Skill for slot ')}${sel}</div><p class="nbz-s">${T('Zdobyte umiejętności','Skills learned')} · ${nInv}</p>`;
  for(const s of states){if(/Możesz zmienić|You can change/.test(s.textContent))s.classList.add('nbz-ok');}
  const warn=states.filter(s=>!s.classList.contains('nbz-ok'));R.append(...warn);
  inv.querySelectorAll('[data-equip]:not([data-equip=""])').forEach(b=>{const sm=b.querySelector('small');if(!sm)return;const parts=sm.textContent.split(' · ');const last=parts.length>2?parts.pop():'';sm.textContent=parts.join(' · ');const ss=document.createElement('span');ss.className='nbz-ss';
   const m=/(slot|Slot)\s*(\d)/.exec(last);ss.textContent=m?(b.classList.contains('selected-skill')?'✓ ':'')+'Slot '+m[2]:T('w rezerwie','in reserve');b.append(ss)});
  const empty=inv.querySelector('[data-equip=""]');R.append(inv);const d=document.createElement('div');d.className='nbz-d';R.append(d);
  const E=document.createElement('div');E.className='nbz-e';if(empty)E.append(empty);R.append(E);
  states.filter(s=>s.classList.contains('nbz-ok')).forEach(s=>R.append(s));
  const tabs=el.querySelector(':scope>.pcmp-loadout-tabs');el.append(L,R);if(tabs)el.prepend(tabs);el.classList.add('nbz');
  opis();if(fs){const f=el.querySelector(fs);if(f&&!f.disabled)f.focus({preventScroll:true})}hint()}
 if(typeof renderLoadoutOne==='function'){const prev=renderLoadoutOne;renderLoadoutOne=function(){prev();try{przestaw()}catch(e){quietErr('pauzaMakieta',e)}}}
 const pd=(e,on)=>{const b=e.target.closest&&e.target.closest('.slot-inventory [data-equip]');const k=b&&b.dataset.equip||null;if(on&&k){pod=k;opis()}else if(!on&&b){pod=null;opis()}};
 el.addEventListener('mouseover',e=>pd(e,true));el.addEventListener('mouseout',e=>pd(e,false));el.addEventListener('focusin',e=>pd(e,true));el.addEventListener('focusout',e=>pd(e,false));
 new MutationObserver(hint).observe(pause,{attributes:true,subtree:true,attributeFilter:['hidden']});
}catch(e){quietErr('pauzaMakieta',e)}})();
// 16.11.2026: Instrukcja wg makiety GPT. Zakladki na gorze z LB/RB, po lewej przewijany artykul (dawna tresc manPage, naglowki w dlugich ramkach),
// po prawej panel tematu (ilustracja, haslo, klawisze z gry dla Walki, przycisk Plac cwiczen z dawnej zakladki). Tresc instrukcji bez zmian.
(()=>{try{
 const man=$('manual');if(!man)return;const lay=man.querySelector('.premium-page-layout'),tabs=$('manTabs'),cont=man.querySelector('.premium-page-content');if(!lay||!tabs||!cont)return;
 const T=(p,e)=>EN?e:p,O='#orient'.repeat(400),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),TL='assets/tla/';
 const st=document.createElement('style');st.id='nb-instrukcja-makieta';st.textContent=`
${O} #manual{--u:calc(min(100vw,177.78vh)/1920)}
${O} #manual .premium-page-layout{display:grid!important;grid-template-columns:47% 1fr!important;grid-template-rows:auto minmax(0,1fr)!important;gap:calc(22*var(--u)) calc(24*var(--u))!important;max-width:none!important;width:100%!important;min-height:0!important;flex:1!important}
${O} #manual #manTabs{grid-column:1/-1!important;grid-row:1!important;display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;justify-content:center!important;align-items:center!important;gap:calc(16*var(--u))!important;padding:0 0 calc(16*var(--u))!important;border-bottom:1px solid rgba(201,160,100,.22)!important;overflow:visible!important}
${O} #manual #manTabs>#trainBtn{display:none!important}
${O} #manual #manTabs>.nbq-tb{font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(6*var(--u)) calc(9*var(--u))!important;background:rgba(0,0,0,.5)!important;pointer-events:none!important}
${O} #manual #manTabs>.nbq-tb.l{order:-1!important}${O} #manual #manTabs>.nbq-tb.r{order:99!important}
${O} #manual .premium-page-content{grid-column:1!important;grid-row:2!important;min-height:0!important;max-width:none!important;overflow-y:auto!important;padding:calc(18*var(--u)) calc(22*var(--u))!important;border:calc(18*var(--u)) solid transparent!important;border-image:url('assets/ui/39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp') 48 stretch!important;background:linear-gradient(180deg,rgba(13,10,10,.92),rgba(8,6,7,.95)) padding-box!important;scrollbar-width:thin!important;scrollbar-color:#7a5530 rgba(255,255,255,.04)!important}
${O} #manual #manBody .mbox{margin:0 0 calc(22*var(--u))!important;padding:0!important;border:0!important;border-image:none!important;background:none!important;box-shadow:none!important;font:400 calc(22*var(--u))/1.5 Georgia,serif!important;color:#ecdcbc!important}
${O} #manual #manBody .mbox>h3,${O} #manual #manBody h2.mh{display:block!important;margin:0 0 calc(14*var(--u))!important;padding:calc(10*var(--u)) calc(18*var(--u))!important;text-align:left!important;font:700 calc(27*var(--u))/1.1 Cinzel,Georgia,serif!important;letter-spacing:.04em!important;color:#f0dcb6!important;text-shadow:0 2px 4px #000!important;background:linear-gradient(180deg,rgba(60,40,30,.55),rgba(26,18,14,.85))!important;border:1px solid rgba(160,120,70,.35)!important;border-image:none!important}
${O} #manual #manBody .mbox>h3::after,${O} #manual #manBody h2.mh::after{content:none!important}
${O} #manual #manBody :is(p,li,.mrow span,.mset){font-size:calc(22*var(--u))!important;line-height:1.5!important;color:#ecdcbc!important}
${O} #manual #manBody ul{padding-left:calc(26*var(--u))!important}
${O} #manual #manBody li{margin:0 0 calc(10*var(--u))!important}
${O} #manual #manBody .mbox{margin:0 0 calc(40*var(--u))!important}
${O} #manual #manBody .mbox>h3,${O} #manual #manBody h2.mh{margin:0 0 calc(18*var(--u))!important}
${O} #manual #manBody h2.mh{margin-top:calc(34*var(--u))!important}
${O} #manual #manBody :is(p,li,.mrow span,.mset){line-height:1.6!important;color:#d9cab0!important}
${O} #manual #manBody p{margin:0 0 calc(16*var(--u))!important}
${O} #manual #manBody :is(p,li,.mrow span,.mset) b{color:#f0c987!important;font-weight:700!important}
${O} #manual #manBody ul{list-style:none!important;padding-left:0!important;margin:0!important}
${O} #manual #manBody ul>li{position:relative!important;margin:0 0 calc(14*var(--u))!important;padding:0 0 calc(14*var(--u)) calc(30*var(--u))!important;border-bottom:1px solid rgba(160,120,70,.16)!important}
${O} #manual #manBody ul>li:last-child{border-bottom:0!important;padding-bottom:0!important}
${O} #manual #manBody ul>li::before{content:''!important;position:absolute!important;left:calc(6*var(--u))!important;top:calc(13*var(--u))!important;width:calc(8*var(--u))!important;height:calc(8*var(--u))!important;transform:rotate(45deg)!important;background:#b8834a!important;box-shadow:0 0 calc(4*var(--u)) rgba(232,160,80,.5)!important}
${O} #manual #manBody kbd.mk{display:inline-block!important;min-width:1.6em!important;margin:0 .08em!important;padding:.02em .4em!important;font:700 .78em/1.3 Cinzel,Georgia,serif!important;letter-spacing:.03em!important;text-align:center!important;color:#f3e2bf!important;background:linear-gradient(180deg,#3a2a1e,#1a120d)!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(5*var(--u))!important;box-shadow:0 2px 0 #000!important;vertical-align:.08em!important;white-space:nowrap!important}
${O} #manual #manBody .mstart{padding:calc(6*var(--u)) calc(4*var(--u)) calc(10*var(--u))!important}
${O} #manual #manBody .mstart>h3{color:#ffd99a!important;border-color:rgba(214,160,90,.7)!important;background:linear-gradient(180deg,rgba(110,62,28,.65),rgba(40,22,12,.9))!important}
${O} #manual #manBody ol.mfirst{list-style:none!important;counter-reset:mf!important;margin:0!important;padding:0!important}
${O} #manual #manBody ol.mfirst>li{counter-increment:mf!important;display:grid!important;grid-template-columns:calc(40*var(--u)) calc(190*var(--u)) 1fr!important;column-gap:calc(12*var(--u))!important;align-items:baseline!important;margin:0!important;padding:calc(11*var(--u)) calc(6*var(--u))!important;border-bottom:1px solid rgba(160,120,70,.18)!important}
${O} #manual #manBody ol.mfirst>li:nth-child(odd){background:rgba(255,220,160,.035)!important}
${O} #manual #manBody ol.mfirst>li:last-child{border-bottom:0!important}
${O} #manual #manBody ol.mfirst>li::before{content:counter(mf)!important;font:700 calc(22*var(--u))/1 Cinzel,Georgia,serif!important;color:#c08a5a!important;text-align:right!important}
${O} #manual #manBody ol.mfirst .mlead{font:700 calc(20*var(--u))/1.3 Cinzel,Georgia,serif!important;letter-spacing:.03em!important;color:#f0c987!important}
${O} #manual #manBody ol.mfirst span{font-size:calc(21*var(--u))!important;line-height:1.55!important;color:#d9cab0!important}
${O} #manual #manBody .mrow{padding:calc(12*var(--u)) calc(4*var(--u))!important;border-bottom:1px solid rgba(160,120,70,.16)!important}
${O} #manual #manBody .mrow .mn b,${O} #manual #manBody .mrow>b{color:#f0c987!important}
${O} #manual #manBody .mrow small{color:#b89a6a!important}
${O} #manual #manBody>ul{margin:0 0 calc(40*var(--u))!important}
${O} #manual #manBody em.mpad{display:block!important;margin-top:calc(6*var(--u))!important;font:italic 400 calc(18*var(--u))/1.5 Georgia,serif!important;color:#a99377!important}
${O} #manual #manBody ol.mfirst>li{grid-template-columns:calc(40*var(--u)) calc(210*var(--u)) 1fr!important}
${O} #manual .nbm-p{grid-column:2!important;grid-row:2!important;position:relative!important;min-height:0!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;padding:calc(30*var(--u))!important;border:calc(18*var(--u)) solid transparent!important;border-image:url('assets/ui/39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp') 48 stretch!important;background:#0b0809 padding-box!important}
${O} #manual .nbm-pi{position:absolute!important;inset:0!important;display:block!important;background-position:center 30%!important;background-size:cover!important;background-repeat:no-repeat!important;filter:brightness(.66) saturate(.9)!important}
${O} #manual .nbm-pg{position:absolute!important;inset:0!important;display:block!important;background:linear-gradient(180deg,rgba(8,6,7,0) 30%,rgba(8,6,7,.85) 66%,rgba(8,6,7,.97))!important}
${O} #manual .nbm-pt{position:relative!important;text-align:left!important}
${O} #manual .nbm-pk{display:block!important;font:600 calc(16*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.2em!important;color:#c08a5a!important;margin-bottom:calc(12*var(--u))!important;text-transform:uppercase!important}
${O} #manual .nbm-pn{display:block!important;font:700 calc(38*var(--u))/1.1 Cinzel,Georgia,serif!important;letter-spacing:.03em!important;color:#f6e6c8!important;text-shadow:0 2px 6px #000!important}
${O} #manual .nbm-pd{display:block!important;margin-top:calc(14*var(--u))!important;font:400 calc(22*var(--u))/1.45 Georgia,serif!important;color:#e3d3b3!important}
${O} #manual .nbm-ks{margin-top:calc(14*var(--u))!important}
${O} #manual .nbm-ks>div{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:calc(12*var(--u))!important;padding:calc(8*var(--u)) 0!important;border-top:1px solid rgba(201,160,100,.2)!important;font:400 calc(21*var(--u))/1.2 Georgia,serif!important;color:#ecdcbc!important}
${O} #manual .nbm-ks kbd{display:inline-block!important;min-width:calc(30*var(--u))!important;text-align:center!important;font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(6*var(--u)) calc(9*var(--u))!important;background:rgba(0,0,0,.55)!important}
${O} #manual .nbm-ks i{font-style:normal!important;margin:0 calc(10*var(--u))!important;color:#9a8b72!important}
${O} #manual .nbm-go{align-self:flex-start!important;margin-top:calc(18*var(--u))!important;min-width:calc(250*var(--u))!important;height:calc(58*var(--u))!important;padding:0 calc(26*var(--u))!important;font:700 calc(19*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.06em!important;color:#f0dcb6!important;background:url('assets/ui/1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp') center/100% 100% no-repeat!important;border:0!important;border-image:none!important;box-shadow:none!important;text-shadow:0 2px 3px #000!important;cursor:pointer!important}
${O} #manual .nbm-go:is(:hover,:focus-visible,.pf){filter:brightness(1.15) drop-shadow(0 0 calc(8*var(--u)) rgba(255,120,40,.45))!important;color:#fff0d8!important}
${O} #manual .nbm-go:is(:focus-visible,.pf){outline:calc(2*var(--u)) solid rgba(240,190,120,.85)!important;outline-offset:calc(3*var(--u))!important}
${O} #manual .nbq-f,${O} #opts .nbq-f{display:flex!important;justify-content:center!important;align-items:center!important;gap:calc(48*var(--u))!important;flex:none!important;padding:calc(12*var(--u)) 0 calc(4*var(--u))!important;border-top:1px solid rgba(201,160,100,.22)!important;font:400 calc(21*var(--u))/1 Georgia,serif!important;color:#ecdcbc!important;--u:calc(min(100vw,177.78vh)/1920)}
${O} #manual .nbq-f>span{display:flex!important;align-items:center!important;gap:calc(14*var(--u))!important}
${O} #manual .nbq-f kbd{font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(6*var(--u)) calc(9*var(--u))!important;background:rgba(0,0,0,.5)!important}
`;document.head.append(st);
 const odznaki=()=>{/* LB/RB dopiero po manInit: manInit nie buduje zakladek, gdy #manTabs ma juz dzieci */if(!tabs.querySelector('.tab')||tabs.querySelector('.nbq-tb'))return;for(const [c,t] of [['l','LB'],['r','RB']]){const b=document.createElement('span');b.className='nbq-tb '+c;b.textContent=t;c==='l'?tabs.prepend(b):tabs.append(b)}};
 const P=document.createElement('div');P.className='nbm-p';P.innerHTML='<div class="nbm-pi"></div><div class="nbm-pg"></div><div class="nbm-pt"><span class="nbm-pk"></span><span class="nbm-pn"></span><span class="nbm-pd"></span><div class="nbm-ks"></div><button type="button" class="nbm-go"></button></div>';lay.append(P);
 const foot=document.createElement('div');foot.className='nbq-f';man.append(foot);
 P.querySelector('.nbm-go').addEventListener('click',()=>{const b=$('trainBtn');if(b)b.click()});
 const kapImg=TL+'7a06226b13595ae657baf802e50d3a3216056b366b61e3e4cf4db5b2e5142872.webp';
 const DANE=()=>({start:{img:TL+'c8c3968edb367c7be327106c1fafd57e5edf67ba28a6181eda3bb585e73f84ef.webp',n:T('Przetrwaj do świtu','Survive until dawn'),d:T('Każdy rozdział to jedna noc. Zbieraj siłę, wybieraj ulepszenia i pokonaj bossa, który wstaje na końcu.','Each act is one night. Gather strength, choose upgrades and defeat the boss that rises at the end.')},
  char:{hero:1,n:T('Wybierz bohatera','Choose your hero'),d:T('Pięciu bohaterów, każdy z własnym stylem walki, perkami i wyzwaniami. Klątwy i ofiary zmieniają nagrodę za noc.','Five heroes, each with their own fighting style, perks and challenges. Curses and offerings change the reward for the night.')},
  slasher:{hero:1,n:T('Blok tuż przed trafieniem','Block just before the hit'),d:T('Na placu ćwiczeń przećwicz parowanie i odpowiedź szybkim ciosem.','Practise parrying and the quick counter on the training ground.'),keys:1},
  style:{img:TL+'76c4abede7b11dab955422e0b91d11d6a38a1feecdd13c62d91f37a0813a6057.webp',n:T('Zbuduj własny styl','Build your own style'),d:T('Style, pakty i zaklęcia ostrza zmieniają sposób walki. Umiejętności w slotach zmieniasz w pauzie.','Styles, pacts and blade spells change how you fight. You change slotted skills in the pause menu.')},
  ash:{img:kapImg,n:T('Popioły zostają z tobą','Ashes stay with you'),d:T('Ulepszenia z Kaplicy działają od startu każdej nocy, także po przegranej.','Shrine upgrades work from the start of every night, even after a defeat.')},
  world:{img:TL+'d1fa360949a93c4762b2578a14cf8957aaeb8e64bbf3a69445d984fc7aaa7c93.webp',n:T('Noc ma swoje zasady','The night has its rules'),d:T('Marga, kociołki, krypta i spotkani ludzie. Warto z nimi rozmawiać, ale czytaj, co oferują.','Marga, cauldrons, the crypt and the people you meet. Talk to them, but read what they offer.')}});
 function panel(){odznaki();const on=tabs.querySelector('.tab.on'),id=on?on.dataset.t:'start',d=DANE()[id]||DANE().start;
  const pi=P.querySelector('.nbm-pi');let img=d.img;if(d.hero){try{const c=charId();img=NB_KAMIEN[c]||NB_KAMIEN.r}catch(e){img=NB_KAMIEN&&NB_KAMIEN.r}pi.style.setProperty('background-position','center 12%','important');pi.style.setProperty('background-size','118% auto','important')}else{pi.style.removeProperty('background-position');pi.style.removeProperty('background-size')}
  if(img)pi.style.setProperty('background-image',`url('${img}')`,'important');
  P.querySelector('.nbm-pk').textContent=on?on.textContent:'';P.querySelector('.nbm-pn').textContent=d.n;P.querySelector('.nbm-pd').textContent=d.d;
  const ks=P.querySelector('.nbm-ks');if(d.keys){const kn=k=>{try{return kbName(KB.map[k])}catch(e){return '?'}};const R=[[T('Szybki atak','Light attack'),kn('atk'),'X'],[T('Silny atak','Heavy attack'),kn('heavy'),'B'],[T('Blok i parowanie','Block and parry'),kn('blk'),'LB'],[T('Unik','Dodge'),kn('roll'),'A']];
   ks.innerHTML=R.map(([n,k,p])=>`<div><span>${esc(n)}</span><span><kbd>${esc(k)}</kbd><i>/</i><kbd>${p}</kbd></span></div>`).join('')}else ks.innerHTML='';
  const tb=$('trainBtn'),go=P.querySelector('.nbm-go');go.hidden=!tb;go.textContent=T('Plac ćwiczeń ›','Training ground ›');go.title=tb?tb.title:'';
  const pad=document.body.classList.contains('padnav');foot.innerHTML=pad?`<span><kbd>LB / RB</kbd>${T('Zakładki','Tabs')}</span><span><kbd>A</kbd>${T('Wybierz','Select')}</span><span><kbd>B</kbd>${T('Wróć','Back')}</span>`:`<span><kbd>↑ ↓</kbd>${T('Przewijaj','Scroll')}</span><span><kbd>Enter</kbd>${T('Wybierz','Select')}</span><span><kbd>Esc</kbd>${T('Wróć','Back')}</span>`}
 tabs.addEventListener('click',()=>setTimeout(panel,0));
 new MutationObserver(()=>{if(!man.hidden)setTimeout(panel,0)}).observe(man,{attributes:true,attributeFilter:['hidden']});
 new MutationObserver(()=>{if(!man.hidden)panel()}).observe(tabs,{childList:true});
 new MutationObserver(()=>{if(!man.hidden)panel()}).observe(document.body,{attributes:true,attributeFilter:['class']});
}catch(e){quietErr('instrukcjaMakieta',e)}})();
// 16.11.2026: Kaplica i Kronika wg makiet GPT, wersja mieszana (decyzja autora): lista po lewej w ramie z naglowkiem, szczegoly po prawej na ilustracji.
// Kaplica: ikony ulepszen w wierszach, grupa zablokowanych z naglowkiem stopnia, pasek stopnia pod lista, w szczegolach poziom, koszt i powod blokady
// („Brakuje N Popiolow”), duza ikona na posagu. Kronika: ilustracja rozdzialu nocy, bohater nocy i postep kroniki pod lista.
// Tylko prezentacja po renderKap / renderKron: te same przyciski i dane, zakup, zasady i zapis bez zmian.
(()=>{try{
 const kap=$('kap');if(!kap)return;
 const T=(p,e)=>EN?e:p,O='#orient'.repeat(400),TL='assets/tla/',esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const RAMA="url('assets/ui/39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp')",POSAG=TL+'7a06226b13595ae657baf802e50d3a3216056b366b61e3e4cf4db5b2e5142872.webp';
 const ROZ={I:'c8c3968edb367c7be327106c1fafd57e5edf67ba28a6181eda3bb585e73f84ef',II:'7c2d199370c18c4f9538807b7ed4ea2710679c89c412cdfb964d73c229e04c11',III:'d1fa360949a93c4762b2578a14cf8957aaeb8e64bbf3a69445d984fc7aaa7c93',IV:'3dc098a98d1294fe0047673365fdfb738239db093f7bdb89d526acf2c8d4f7ad',V:'b5acdd84a065fd7fbd3dc0d51dda1175fd3a0551641b5bf02964dafd288473a7',VI:'76c4abede7b11dab955422e0b91d11d6a38a1feecdd13c62d91f37a0813a6057'};
 const KTAB=['','','','','','97b8d8b5e7e5da70944aef02ec7e777a3f1e37659ab1be2db2b361380bbd634b'];
 const FACE={k:[.56,.12],m:[.6,.175],r:[.5,.11],z:[.385,.215],d:[.255,.24]};
 const st=document.createElement('style');st.id='nb-kaplica-kronika-makieta';st.textContent=`
${O} #kap{--u:calc(min(100vw,177.78vh)/1920)}
${O} #kap:not(.pc-chronicle)::before{content:none!important;display:none!important}
${O} #kap #kapTabs{display:flex!important;flex-wrap:nowrap!important;justify-content:center!important;gap:calc(16*var(--u))!important}
${O} #kap #kapTabs>.tab{flex:0 1 auto!important;min-width:calc(170*var(--u))!important}
${O} #kap.nbk3 #kapTabs>.tab{min-width:calc(420*var(--u))!important}
${O} #kap #kapTabs>.m2k-tier{display:none!important}
${O} #kap #kapTabs>.nbq-tb{font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(6*var(--u)) calc(9*var(--u))!important;background:rgba(0,0,0,.5)!important;pointer-events:none!important;flex:none!important}
${O} #kap #kapTabs>.nbq-tb.l{order:-1!important}${O} #kap #kapTabs>.nbq-tb.r{order:99!important}
${O} #kap .m2k-body,${O} #kap:not(.pc-chronicle) .m2k-body{display:grid!important;grid-template-columns:47% 1fr!important;gap:calc(24*var(--u))!important;margin:0!important;width:100%!important}
${O} #kap #kapList{display:flex!important;flex-direction:column!important;gap:0!important;overflow-y:auto!important;padding:calc(14*var(--u)) calc(18*var(--u))!important;border:calc(18*var(--u)) solid transparent!important;border-image:${RAMA} 48 stretch!important;background:linear-gradient(180deg,rgba(13,10,10,.92),rgba(8,6,7,.95)) padding-box!important;scrollbar-width:thin!important;scrollbar-color:#7a5530 rgba(255,255,255,.04)!important}
${O} #kap #kapList.nbk-beasts{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:calc(8*var(--u))!important;align-content:start!important}
${O} #kap #kapList::before{content:attr(data-nbh)!important;display:block!important;flex:none!important;margin:0 0 calc(10*var(--u))!important;padding:calc(10*var(--u)) calc(18*var(--u))!important;text-align:left!important;font:700 calc(29*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.05em!important;color:#f0dcb6!important;text-shadow:0 2px 4px #000!important;background:linear-gradient(180deg,rgba(60,40,30,.55),rgba(26,18,14,.85))!important;border:1px solid rgba(160,120,70,.35)!important;grid-column:1/-1!important;position:static!important;width:auto!important;height:auto!important}
${O} #kap #kapList:not(.nbk-beasts)>.m2k-row{position:relative!important;display:grid!important;grid-template-columns:calc(56*var(--u)) minmax(0,1fr) auto!important;grid-template-rows:auto auto!important;column-gap:calc(16*var(--u))!important;row-gap:calc(3*var(--u))!important;align-items:center!important;justify-items:start!important;flex:none!important;min-height:calc(80*var(--u))!important;height:auto!important;width:100%!important;margin:0!important;padding:calc(10*var(--u)) calc(18*var(--u))!important;text-align:left!important;background:rgba(30,24,22,.5)!important;border:0!important;border-bottom:1px solid rgba(255,230,190,.07)!important;border-image:none!important;box-shadow:none!important;filter:none!important}
${O} #kap #kapList:not(.nbk-beasts)>.m2k-row>.premium-shrine-icon{position:static!important;grid-column:1!important;grid-row:1/3!important;width:calc(50*var(--u))!important;height:calc(50*var(--u))!important;object-fit:contain!important;transform:none!important}
${O} #kap #kapList:not(.nbk-beasts)>.m2k-row>b{grid-column:2!important;grid-row:1!important;font:400 calc(25*var(--u))/1.15 Georgia,serif!important;color:#f2dfba!important;text-align:left!important}
${O} #kap #kapList:not(.nbk-beasts)>.m2k-row>small{grid-column:2!important;grid-row:2!important;font:400 calc(18*var(--u))/1.25 Georgia,serif!important;color:#c8b694!important;text-align:left!important;white-space:normal!important}
${O} #kap #kapList:not(.nbk-beasts)>.m2k-row>.m2k-pips{grid-column:3!important;grid-row:1/3!important;font:400 calc(25*var(--u))/1 Georgia,serif!important;color:#f0dcb6!important;white-space:nowrap!important}
${O} #kap #kapList:not(.nbk-beasts)>.m2k-row:not(:has(.premium-shrine-icon)){grid-template-columns:0 minmax(0,1fr) auto!important;padding-left:calc(18*var(--u))!important;column-gap:0!important}
${O} #kap #kapList:not(.nbk-beasts)>.m2k-row.lk>.m2k-pips{font-size:calc(18*var(--u))!important;color:#a99a80!important}
${O} #kap.nbk-kap #kapList:not(.nbk-beasts)>.m2k-row.lk{background:rgba(20,16,15,.45)!important}
${O} #kap.nbk-kap #kapList:not(.nbk-beasts)>.m2k-row.lk>:is(b,.premium-shrine-icon){opacity:.6!important}
${O} #kap #kapList:not(.nbk-beasts)>.m2k-row:is(.on,:hover,:focus-visible,.pf){background:linear-gradient(90deg,rgba(150,92,46,.85),rgba(70,44,26,.6))!important;box-shadow:inset calc(4*var(--u)) 0 0 #e0a860!important}
${O} #kap #kapList:not(.nbk-beasts)>.m2k-row:is(.on,:hover,:focus-visible,.pf)>:is(b,.premium-shrine-icon){opacity:1!important}
${O} #kap #kapList>.m2k-row:is(:focus-visible,.pf){outline:calc(2*var(--u)) solid rgba(240,190,120,.85)!important;outline-offset:calc(-2*var(--u))!important}
${O} #kap #kapList>.m2k-row[data-nbh]{margin-top:calc(62*var(--u))!important;overflow:visible!important}
${O} #kap #kapList>.m2k-row .m2k-pips::after{content:none!important}
${O} #kap #kapList>.m2k-row[data-nbh]::before{content:attr(data-nbh)!important;position:absolute!important;left:0!important;right:0!important;top:calc(-56*var(--u))!important;padding:calc(10*var(--u)) calc(18*var(--u))!important;text-align:left!important;font:700 calc(26*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.05em!important;color:#e6d2ab!important;background:linear-gradient(180deg,rgba(60,40,30,.55),rgba(26,18,14,.85))!important;border:1px solid rgba(160,120,70,.35)!important;pointer-events:none!important}
${O} #kap .nbk-x{flex:none!important;margin-top:auto!important;padding:calc(16*var(--u)) 0 calc(6*var(--u))!important}
${O} #kap .nbk-tier{display:block!important;font:400 calc(22*var(--u))/1.3 Georgia,serif!important;color:#ecdcbc!important;text-align:left!important}
${O} #kap .nbk-bar{display:block!important;height:calc(6*var(--u))!important;margin-top:calc(10*var(--u))!important;background:rgba(255,255,255,.08)!important}
${O} #kap .nbk-bar>i{display:block!important;height:100%!important;background:linear-gradient(90deg,#9a5a22,#f0b860)!important}
${O} #kap .nbk-h2{display:block!important;margin:calc(16*var(--u)) 0 calc(8*var(--u))!important;padding:calc(10*var(--u)) calc(18*var(--u))!important;text-align:left!important;font:700 calc(26*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.05em!important;color:#f0dcb6!important;background:linear-gradient(180deg,rgba(60,40,30,.55),rgba(26,18,14,.85))!important;border:1px solid rgba(160,120,70,.35)!important}
${O} #kap .nbk-rw{display:flex!important;justify-content:space-between!important;align-items:center!important;padding:calc(9*var(--u)) 0!important;border-top:1px solid rgba(201,160,100,.18)!important;font:400 calc(21*var(--u))/1.2 Georgia,serif!important;color:#ecdcbc!important}
${O} #kap .nbk-rw b{font:700 calc(22*var(--u))/1 Georgia,serif!important;color:#f0c27a!important}
${O} #kap .nbk-hero{display:flex!important;align-items:center!important;gap:calc(18*var(--u))!important;padding:calc(12*var(--u)) calc(6*var(--u))!important}
${O} #kap .nbk-hero i{flex:none!important;width:calc(84*var(--u))!important;height:calc(84*var(--u))!important;border-radius:50%!important;background-repeat:no-repeat!important;background-color:#160f0c!important;box-shadow:0 0 0 calc(2*var(--u)) #8a6a3c,0 0 0 calc(4*var(--u)) #1a120d,0 0 calc(18*var(--u)) rgba(255,120,40,.35)!important}
${O} #kap .nbk-hero b{display:block!important;font:700 calc(26*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.1em!important;color:#dcb877!important}
${O} #kap .nbk-hero span{display:block!important;margin-top:calc(6*var(--u))!important;font:italic calc(19*var(--u))/1.2 Georgia,serif!important;color:#d0bf9c!important}
${O} #kap #kapDet{position:relative!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;overflow:hidden!important;padding:calc(28*var(--u)) calc(30*var(--u))!important;border:calc(18*var(--u)) solid transparent!important;border-image:${RAMA} 48 stretch!important;background:#0b0809 padding-box!important;gap:calc(10*var(--u))!important;text-align:left!important}
${O} #kap #kapDet::before{content:''!important;position:absolute!important;inset:0!important;background:var(--nbk-img,none) center 30%/cover no-repeat!important;filter:brightness(.62) saturate(.9)!important;pointer-events:none!important}
${O} #kap #kapDet::after{content:''!important;position:absolute!important;inset:0!important;background:linear-gradient(180deg,rgba(8,6,7,.05) 25%,rgba(8,6,7,.85) 58%,rgba(8,6,7,.97))!important;pointer-events:none!important}
${O} #kap #kapDet>*{position:relative!important;z-index:1!important}
${O} #kap #kapDet .nbk-scroll{flex:0 1 auto!important;overflow:auto!important;min-height:0!important;max-height:100%!important}
${O} #kap #kapDet .premium-shrine-detail{position:absolute!important;right:calc(26*var(--u))!important;top:calc(24*var(--u))!important;width:calc(150*var(--u))!important;height:calc(150*var(--u))!important;object-fit:contain!important;filter:drop-shadow(0 0 calc(18*var(--u)) rgba(255,140,60,.45)) drop-shadow(0 calc(6*var(--u)) calc(10*var(--u)) #000)!important}
${O} #kap.nbk-kap #kapDet .nbk-scroll{position:static!important}
${O} #kap #kapDet .nbk-k{display:block!important;margin:0 0 calc(8*var(--u))!important;font:600 calc(16*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.2em!important;color:#c08a5a!important;text-transform:uppercase!important}
${O} #kap #kapDet #kapHd{margin:0 0 calc(12*var(--u))!important;font:700 calc(38*var(--u))/1.1 Cinzel,Georgia,serif!important;letter-spacing:.03em!important;color:#f6e6c8!important;text-shadow:0 2px 6px #000!important;text-align:left!important}
${O} #kap #kapDet p{margin:calc(6*var(--u)) 0!important;font:400 calc(21*var(--u))/1.45 Georgia,serif!important;color:#ecdcbc!important;text-align:left!important}
${O} #kap #kapDet p small{font-size:calc(18*var(--u))!important;color:#d0bf9c!important}
${O} #kap #kapDet p.nbk-rw{display:flex!important;justify-content:space-between!important;gap:calc(14*var(--u))!important;padding:calc(9*var(--u)) 0!important;margin:0!important;border-top:1px solid rgba(201,160,100,.22)!important;font-size:calc(22*var(--u))!important}
${O} #kap #kapDet p.nbk-rw b{color:#f0c27a!important;font-weight:700!important;text-align:right!important}
${O} #kap #kapDet .m2k-buy,${O} #kap #kapDet #kapBuy{align-self:flex-start!important;width:auto!important;min-width:calc(280*var(--u))!important;max-width:100%!important;min-height:calc(60*var(--u))!important;height:auto!important;margin:calc(12*var(--u)) 0 0!important;padding:calc(12*var(--u)) calc(30*var(--u))!important;font-size:calc(21*var(--u))!important;flex:none!important}
${O} #kap #kapDet .nbk-why{align-self:flex-start!important;text-align:left!important;margin:calc(8*var(--u)) 0 0!important;font:400 calc(20*var(--u))/1.3 Georgia,serif!important;color:#e9b49a!important}
${O} #kap #kapDet .m2k-reset{align-self:flex-start!important;width:auto!important;min-height:0!important;font-size:calc(17*var(--u))!important}
${O} #kap.pc-chronicle .nbk-x{margin-top:0!important}
${O} #kap.pc-chronicle:is(.nbk-t1,.nbk-t2,.nbk-t3,.nbk-t4) #kapDet .nbk-scroll{position:static!important;overflow:visible!important;max-height:none!important}
${O} #kap.pc-chronicle:is(.nbk-t1,.nbk-t2,.nbk-t3,.nbk-t4) #kapDet .premium-shrine-detail{position:absolute!important;left:50%!important;right:auto!important;top:7%!important;bottom:auto!important;translate:-50% 0!important;transform:none!important;width:auto!important;height:46%!important;max-width:70%!important;object-fit:contain!important;filter:drop-shadow(0 0 calc(30*var(--u)) rgba(255,130,50,.35)) drop-shadow(0 calc(8*var(--u)) calc(14*var(--u)) #000)!important;z-index:0!important}
${O} #kap.pc-chronicle:is(.nbk-t2,.nbk-t4) #kapDet .premium-shrine-detail{object-fit:cover!important;aspect-ratio:16/10!important;height:40%!important;border:1px solid rgba(201,160,100,.35)!important}
${O} #kap.pc-chronicle.nbk-t3 #kapDet .premium-shrine-detail{height:52%!important;image-rendering:auto!important}
${O} #kap.pc-chronicle:is(.nbk-t1,.nbk-t2,.nbk-t3,.nbk-t4) #kapDet::before{background:radial-gradient(ellipse 45% 38% at 50% 32%,rgba(150,70,25,.35),rgba(20,12,10,0) 70%)!important;filter:none!important}
${O} #kap .nbq-f{display:flex!important;justify-content:center!important;align-items:center!important;gap:calc(48*var(--u))!important;flex:none!important;padding:calc(12*var(--u)) 0 calc(4*var(--u))!important;border-top:1px solid rgba(201,160,100,.22)!important;font:400 calc(21*var(--u))/1 Georgia,serif!important;color:#ecdcbc!important}
${O} #kap .nbq-f>span{display:flex!important;align-items:center!important;gap:calc(14*var(--u))!important}
${O} #kap .nbq-f kbd{font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(6*var(--u)) calc(9*var(--u))!important;background:rgba(0,0,0,.5)!important}
`;document.head.append(st);
 const foot=document.createElement('div');foot.className='nbq-f';kap.append(foot);
 const stopka=()=>{const pad=document.body.classList.contains('padnav');foot.innerHTML=pad?`<span><kbd>LB / RB</kbd>${T('Zakładki','Tabs')}</span><span><kbd>A</kbd>${T('Wybierz','Select')}</span><span><kbd>B</kbd>${T('Wróć','Back')}</span>`:`<span><kbd>Q / E</kbd>${T('Zakładki','Tabs')}</span><span><kbd>Enter</kbd>${T('Wybierz','Select')}</span><span><kbd>Esc</kbd>${T('Wróć','Back')}</span>`};
 const heroOf=txt=>{try{for(const c of ['r','k','z','d','m'])if(HEROES[c]&&txt.includes(HEROES[c].n))return c}catch(e){}return null};
 function wspolne(){const tb=$('kapTabs');if(!tb)return null;for(const b of tb.querySelectorAll('.tab')){const n=b.firstChild;if(n&&n.nodeType===3&&/^\d+\.\s/.test(n.data))n.data=n.data.replace(/^\d+\.\s/,'')}
  if(!tb.querySelector('.nbq-tb'))for(const [c,t] of [['l','LB'],['r','RB']]){const s=document.createElement('span');s.className='nbq-tb '+c;s.textContent=t;tb.append(s)}
  const on=tb.querySelector('.tab.on');const L=$('kapList');if(L)L.dataset.nbh=on?on.textContent.replace(/(NOWE|NEW)$/,'').trim():'';stopka();return tb}
 function kaplica(){const tb=wspolne();if(!tb)return;kap.classList.add('nbk-kap');kap.classList.toggle('nbk3',tb.querySelectorAll('.tab').length===3);
  const L=$('kapList'),D=$('kapDet');D.style.setProperty('--nbk-img',`url('${POSAG}')`);
  let first=true;for(const r of L.querySelectorAll('.m2k-row')){const pp=r.querySelector('.m2k-pips'),sm=r.querySelector('small');if(pp)pp.textContent=r.classList.contains('lk')?T('Zablokowane','Locked'):pp.textContent.replace(/^(Poziom|Level)\s*/,'');
   if(r.classList.contains('lk')&&first){first=false;const m=/(wymaga stopnia|requires tier)\s+([IV]+)/.exec(sm?sm.textContent:'');r.dataset.nbh=m?T('Wymagany stopień ','Requires tier ')+m[2]:T('Zablokowane','Locked')}
   if(sm)sm.textContent=sm.textContent.replace(/\s·\s(wymaga stopnia|requires tier)\s+[IV]+/,'')}
  const tier=tb.querySelector('.m2k-tier');if(tier){const x=document.createElement('div');x.className='nbk-x';const p=tier.querySelector('.nb-tierbar');const pr=p?(parseFloat(p.style.getPropertyValue('--p'))||0):1;
   x.innerHTML=`<span class="nbk-tier">${esc(tier.textContent.replace(/\s·\s/,'  ·  '))}</span>${p?`<span class="nbk-bar"><i style="width:${Math.round(pr*100)}%"></i></span>`:''}`;L.append(x)}
  const sc=D.querySelector('.nbk-scroll'),buy=$('kapBuy');if(!sc||!buy)return;
  for(const p of sc.querySelectorAll('p')){const t=p.textContent.trim();if(/^(Poziom|Level)\s+\d+\/\d+$/.test(t)){const k=document.createElement('span');k.className='nbk-k';k.textContent=t;const hd=$('kapHd');hd?hd.before(k):sc.prepend(k);p.remove();continue}
   const b=p.querySelector(':scope>b');if(b&&p.firstChild&&p.firstChild.nodeType===3&&/:\s*$/.test(p.firstChild.data)){const lab=document.createElement('span');lab.textContent=p.firstChild.data.replace(/:\s*$/,'');p.firstChild.replaceWith(lab);p.classList.add('nbk-rw')}}
  const lab=buy.textContent,m=/^(ZŁÓŻ OFIARĘ|OFFER)\s·\s(\d+)/.exec(lab);let why='';
  if(m){const c=+m[2],row=document.createElement('p');row.className='nbk-rw';row.innerHTML=`<span>${T('Koszt ofiary','Offering cost')}</span><b>${c} ${T('Popiołów','Ashes')}</b>`;sc.append(row);buy.textContent=m[1];if(buy.disabled&&EMB.e<c)why=T('Brakuje ','You need ')+(c-EMB.e)+T(' Popiołów.',' more Ashes.')}
  else if(buy.disabled&&/(Zablokowane|Locked|Warunek|Requires)/.test(lab)){why=lab.replace(/^Zablokowane · stopień\s+([IV]+)/,'Wymaga stopnia ołtarza $1.').replace(/^Locked · tier\s+([IV]+)/,'Requires altar tier $1.');buy.textContent=T('ZŁÓŻ OFIARĘ','OFFER')}
  if(why){const w=document.createElement('p');w.className='nbk-why';w.textContent=why;buy.after(w)}}
 function kronika(){const tb=wspolne();if(!tb)return;kap.classList.remove('nbk-kap','nbk3');const L=$('kapList'),D=$('kapDet'),tabs=[...tb.querySelectorAll('.tab')],ti=tabs.findIndex(b=>b.classList.contains('on'));for(let i=0;i<6;i++)kap.classList.toggle('nbk-t'+i,i===ti);
  let img='';if(ti===0){const m=/(Rozdział|Act):\s*([IV]+)/.exec(D.textContent);img=m&&ROZ[m[2]]?TL+ROZ[m[2]]+'.webp':''}else if(KTAB[ti])img=TL+KTAB[ti]+'.webp';
  if(img)D.style.setProperty('--nbk-img',`url('${img}')`);else D.style.removeProperty('--nbk-img');
  if(ti===0){const sel=L.querySelector('.m2k-row.on'),c=heroOf(D.textContent)||heroOf(sel?sel.textContent:'');const tier=tb.querySelector('.m2k-tier'),mm=/(\d+)\/(\d+)[^\d]+(\d+)\/(\d+)/.exec(tier?tier.textContent:'');
   const x=document.createElement('div');x.className='nbk-x';let h='';
   if(c&&typeof NB_KAMIEN!=='undefined'&&NB_KAMIEN[c]){const H=HEROES[c];h+=`<div class="nbk-h2">${T('Bohater tej nocy','Hero of this night')}</div><div class="nbk-hero"><i data-c="${c}"></i><div><b>${esc(H.n.toUpperCase())}</b><span>${esc(H.cls||'')}</span></div></div>`}
   if(mm)h+=`<div class="nbk-h2">${T('Postęp kroniki','Chronicle progress')}</div><div class="nbk-rw"><span>${T('Osiągnięcia','Achievements')}</span><b>${mm[1]} / ${mm[2]}</b></div><div class="nbk-rw"><span>${T('Medale','Medals')}</span><b>${mm[3]} / ${mm[4]}</b></div>`;
   x.innerHTML=h;L.append(x);const pi=x.querySelector('.nbk-hero i');if(pi){const s=pi.getBoundingClientRect().width||84,k=4.4,[fx,fy]=FACE[c]||[.5,.12],hh=s*k,ww=hh*((typeof NB_KAMIEN_AR!=='undefined'&&NB_KAMIEN_AR[c])||.7);pi.style.backgroundImage=`url('${NB_KAMIEN[c]}')`;pi.style.backgroundSize=`${ww}px ${hh}px`;pi.style.backgroundPosition=`${s/2-fx*ww}px ${s/2-fy*hh}px`}}
  else{const tier=tb.querySelector('.m2k-tier');if(tier&&tier.textContent.trim()){const x=document.createElement('div');x.className='nbk-x';x.innerHTML=`<span class="nbk-tier">${esc(tier.textContent)}</span>`;L.append(x)}}}
 if(typeof renderKap==='function'){const p0=renderKap;renderKap=function(){p0();if(KAPMODE!=='kron'){try{kaplica()}catch(e){quietErr('kaplicaMakieta',e)}}}}
 if(typeof renderKron==='function'){const p1=renderKron;renderKron=function(){p1();try{kronika()}catch(e){quietErr('kronikaMakieta',e)}}}
 new MutationObserver(stopka).observe(document.body,{attributes:true,attributeFilter:['class']});
}catch(e){quietErr('kapKronMakieta',e)}})();
// 16.11.2026: Pauza, pozostale zakladki w stylu Opcji (prosba autora): Audio i Grafika jako lista z podgladem (te same kontrolki gry, jak w Opcjach),
// Dziennik i Mapa w dwoch panelach w ramach. Tylko prezentacja; ustawienia i ich zapis bez zmian.
(()=>{try{
 const pause=$('pause');if(!pause)return;const panel=pause.querySelector('.nbp-panel');if(!panel)return;
 const T=(p,e)=>EN?e:p,O='#orient'.repeat(400),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),TL='assets/tla/';
 const ROZ=['c8c3968edb367c7be327106c1fafd57e5edf67ba28a6181eda3bb585e73f84ef','7c2d199370c18c4f9538807b7ed4ea2710679c89c412cdfb964d73c229e04c11','3dc098a98d1294fe0047673365fdfb738239db093f7bdb89d526acf2c8d4f7ad','b5acdd84a065fd7fbd3dc0d51dda1175fd3a0551641b5bf02964dafd288473a7','76c4abede7b11dab955422e0b91d11d6a38a1feecdd13c62d91f37a0813a6057','d1fa360949a93c4762b2578a14cf8957aaeb8e64bbf3a69445d984fc7aaa7c93'];
 const RAMA="url('assets/ui/39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp')";
 const st=document.createElement('style');st.id='nb-pauza-zakladki';st.textContent=`
${O} #pause .nbp-panel.nbq-pv>.nbp-pane{display:none!important}
${O} #pause .nbp-panel.nbq-pv{overflow:hidden!important;padding:calc(6*var(--u)) calc(40*var(--u))!important}
${O} #pause .nbq.nbq-vis{display:grid!important;grid-template-columns:47% 1fr!important;gap:calc(24*var(--u))!important;height:100%!important;max-width:calc(1700*var(--u))!important;margin:0 auto!important;box-sizing:border-box!important}
${O} #pause .nbq-c2{position:relative!important;min-height:0!important;overflow:auto!important;padding:calc(16*var(--u)) calc(22*var(--u))!important;border:calc(18*var(--u)) solid transparent!important;border-image:${RAMA} 48 stretch!important;background:linear-gradient(180deg,rgba(13,10,10,.92),rgba(8,6,7,.95)) padding-box!important;scrollbar-width:thin!important;scrollbar-color:#7a5530 rgba(255,255,255,.04)!important}
${O} #pause .nbp-pane:has(.nbp-journal:not(:empty)),${O} #pause .nbp-pane:has(.nbp-map){height:100%!important}
${O} #pause .nbp-journal.nbq-j{display:grid!important;grid-template-columns:47% 1fr!important;gap:calc(24*var(--u))!important;height:100%!important;max-width:calc(1700*var(--u))!important;margin:0 auto!important;padding:0!important}
${O} #pause .nbq-j>.nbq-c2 ol{margin:0!important;padding-left:calc(28*var(--u))!important}
${O} #pause .nbq-j>.nbq-c2 li{padding:calc(12*var(--u)) 0!important;border-bottom:1px solid rgba(255,230,190,.07)!important;font:400 calc(21*var(--u))/1.5 Georgia,serif!important;color:#ecdcbc!important}
${O} #pause .nbq-j .nbq-h2,${O} #pause .nbp-map .nbq-h2{display:block!important;margin:0 0 calc(12*var(--u))!important;padding:calc(10*var(--u)) calc(18*var(--u))!important;text-align:left!important;font:700 calc(29*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.05em!important;color:#f0dcb6!important;text-shadow:0 2px 4px #000!important;background:linear-gradient(180deg,rgba(60,40,30,.55),rgba(26,18,14,.85))!important;border:1px solid rgba(160,120,70,.35)!important}
${O} #pause .nbq-j>small,${O} #pause .nbq-j>h2,${O} #pause .nbq-j>p.nbp-jp{display:none!important}
${O} #pause .nbq-art{position:relative!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;padding:calc(30*var(--u))!important;border:calc(18*var(--u)) solid transparent!important;border-image:${RAMA} 48 stretch!important;background:#0b0809 padding-box!important;min-height:0!important}
${O} #pause .nbq-art>.nbq-ai{position:absolute!important;inset:0!important;display:block!important;background-position:center!important;background-size:cover!important;filter:brightness(.62) saturate(.9)!important}
${O} #pause .nbq-art>.nbq-ag{position:absolute!important;inset:0!important;display:block!important;background:linear-gradient(180deg,rgba(8,6,7,0) 35%,rgba(8,6,7,.85) 70%,rgba(8,6,7,.97))!important}
${O} #pause .nbq-art>div{position:relative!important;text-align:left!important}
${O} #pause .nbq-art .k{display:block!important;font:600 calc(16*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.2em!important;color:#c08a5a!important;margin-bottom:calc(12*var(--u))!important;text-transform:uppercase!important}
${O} #pause .nbq-art .n{display:block!important;font:700 calc(38*var(--u))/1.1 Cinzel,Georgia,serif!important;color:#f6e6c8!important;text-shadow:0 2px 6px #000!important}
${O} #pause .nbq-art .d{display:block!important;margin-top:calc(12*var(--u))!important;font:400 calc(21*var(--u))/1.4 Georgia,serif!important;color:#e3d3b3!important}
${O} #pause .nbp-map.nbq-m{display:grid!important;align-items:stretch!important;grid-template-columns:1.25fr 1fr!important;grid-template-rows:minmax(0,1fr)!important;gap:calc(24*var(--u))!important;height:100%!important;max-width:calc(1700*var(--u))!important;margin:0 auto!important;padding:0!important}
${O} #pause .nbq-m>small,${O} #pause .nbq-m>h2{display:none!important}
${O} #pause .nbq-m>.nbq-c2:first-child{display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important}
${O} #pause .nbq-m canvas{max-width:100%!important;max-height:100%!important;width:auto!important;height:auto!important;object-fit:contain!important;image-rendering:auto!important}
${O} #pause .nbq-m ul.nbp-leg{display:flex!important;flex-direction:column!important;gap:0!important;margin:0!important;padding:0!important;list-style:none!important}
${O} #pause .nbq-m ul.nbp-leg li{display:flex!important;align-items:center!important;gap:calc(14*var(--u))!important;padding:calc(12*var(--u)) calc(6*var(--u))!important;border-bottom:1px solid rgba(255,230,190,.07)!important;font:400 calc(22*var(--u))/1.2 Georgia,serif!important;color:#ecdcbc!important}
${O} #pause .nbq-m ul.nbp-leg li::before,${O} #pause .nbq-m ul.nbp-leg li i{transform:scale(1.6)!important;margin-right:calc(6*var(--u))!important}
`;document.head.append(st);
 // lista z podgladem: Audio i Grafika
 const box=document.createElement('div');box.className='nbq';box.innerHTML='<div class="nbq-l" role="list"></div><div class="nbq-p"><div class="nbq-pi"></div><div class="nbq-pg"></div><div class="nbq-pt"><span class="nbq-pk"></span><span class="nbq-pn"></span><span class="nbq-pd"></span></div></div>';
 box.style.setProperty('--nbq-rama',RAMA);panel.append(box);const L=box.querySelector('.nbq-l');
 const SPEC=()=>({2:[{s:T('Głośność','Volume')},{t:'rng',e:'#pause .musSl',n:T('Muzyka','Music'),d:T('Muzyka świata i walk z bossami.','Music of the world and boss fights.')},{t:'rng',e:'#pause .sfxSl',n:T('Efekty','Effects'),d:T('Ciosy, umiejętności i dźwięki otoczenia.','Hits, skills and ambient sounds.')},
   {s:T('Napisy','Text')},{t:'rng',e:'#pause .ftsSl',n:T('Wielkość napisów','Text size'),fts:1},{t:'tgl',e:'#pause .dmgTgl',n:T('Liczby obrażeń','Damage numbers'),d:T('Liczby obrażeń nad wrogami.','Damage numbers above enemies.')}],
  3:[{s:T('Obraz','Display')},{t:'rng',e:'#briSl',n:T('Jasność obrazu','Brightness'),d:T('Jeśli gra jest dla Ciebie zbyt ciemna, zwiększ jasność. Domyślnie 100%.','If the game looks too dark, raise the brightness. Default 100%.')},{t:'ch',e:'#fsRow',n:T('Tryb wyświetlania','Display mode')},
   {s:T('Jakość','Quality')},{t:'ch',e:'#qualityRow',n:T('Jakość grafiki','Graphics quality'),d:T('Auto: na komputerze Wysoka. Jeśli gra klatkuje, wybierz niższy poziom.','Auto: High on a computer. If the game stutters, pick a lower level.')},
   {s:T('Płynność','Smoothness')},{t:'ch',e:'#fpsRow',n:T('Limit klatek','Frame limit')},{t:'tgl',e:'#fpsTgl',n:T('Licznik FPS','FPS counter')},
   {s:T('Zaawansowane','Advanced')},{t:'ch',e:'#gShadowRow',n:T('Cienie','Shadows')},{t:'ch',e:'#gLightsRow',n:T('Światła dynamiczne','Dynamic lights')},{t:'ch',e:'#gFxRow',n:T('Efekty obrazu','Image effects')},{t:'ch',e:'#gPartsRow',n:T('Cząsteczki','Particles')},{t:'ch',e:'#gResRow',n:T('Rozdzielczość obrazu','Render resolution')},{t:'ch',e:'#gDynRow',n:T('Dynamiczna rozdzielczość','Dynamic resolution')},{t:'ch',e:'#gDprRow',n:T('Gęstość pikseli','Pixel density')},{t:'ch',e:'#gTexRow',n:T('Tekstury ziemi HD','HD ground textures')}]});
 let tab=-1,rows=[],akt=null;
 const tabIdx=()=>{const t=[...pause.querySelectorAll('.nbp-nav>.nbp-tab')];return t.findIndex(b=>b.classList.contains('on')||b.getAttribute('aria-selected')==='true'||b.getAttribute('aria-pressed')==='true')};
 const chB=g=>[...g.querySelectorAll('button')].filter(b=>!b.hidden),chI=g=>chB(g).findIndex(x=>x.classList.contains('on')||x.getAttribute('aria-pressed')==='true');
 function val(r){const e=r.el;if(r.t==='ch'){const b=chB(e),i=chI(e);return{i,txt:i>=0?b[i].textContent.trim():'—',n:b.length}}if(r.t==='rng')return{v:+e.value,txt:Math.round(+e.value)+'%'};return{on:!!e.checked}}
 function upd(){for(const r of rows){const v=val(r);if(r.t==='ch'){r.inp.max=String(Math.max(0,(v.n-1)*5));r.inp.value=String(Math.max(0,v.i)*5);r.row.querySelector('b').textContent=v.txt}else if(r.t==='rng'){r.inp.value=String(v.v);r.row.querySelector('b').textContent=v.txt}else{r.inp.checked=v.on;r.row.classList.toggle('on',v.on);r.row.querySelector('.nbq-ow').textContent=v.on?T('Wł.','On'):T('Wył.','Off')}}podglad()}
 function podglad(){const r=akt||rows[0],pi=box.querySelector('.nbq-pi');let ci=0;try{ci=Math.max(0,CHN.indexOf((pause.querySelector('.nbp-sub')||{}).textContent||''))}catch(e){}pi.style.setProperty('background-image',`url('${TL+ROZ[ci%6]}.webp')`,'important');
  const k=box.querySelector('.nbq-pk'),n=box.querySelector('.nbq-pn'),d=box.querySelector('.nbq-pd');n.style.fontSize='';if(!r){k.textContent=n.textContent=d.textContent='';return}
  if(r.fts){const v=+r.el.value||100;k.textContent=T('PODGLĄD NAPISÓW','TEXT PREVIEW');n.textContent=T('Droga prowadzi do kaplicy.','The road leads to the chapel.');n.style.fontSize=`calc(${36*v/100}*var(--u))`;d.textContent=T('Wielkość tekstu · ','Text size · ')+Math.round(v)+'%';return}
  k.textContent=(r.sec||'').toUpperCase();n.textContent=r.n;d.textContent=r.d||(r.t==='ch'?T('Obecnie: ','Current: ')+val(r).txt+'.':'')}
 function apply(r){if(r.t==='ch'){const b=chB(r.el),i=Math.round(+r.inp.value/5);if(b[i]&&i!==chI(r.el))b[i].click()}else if(r.t==='rng'){r.el.value=r.inp.value;r.el.dispatchEvent(new Event('input',{bubbles:true}));r.el.dispatchEvent(new Event('change',{bubbles:true}))}else if(!!r.el.checked!==r.inp.checked)r.el.click();setTimeout(upd,30)}
 function build(){rows=[];akt=null;L.innerHTML='';let sec='';for(const s of SPEC()[tab]||[]){if(s.s){sec=s.s;const h=document.createElement('div');h.className='nbq-h';h.textContent=s.s;L.append(h);continue}
   const el=document.querySelector(s.e);if(!el)continue;const r={...s,el,sec},lab=document.createElement('label'),inp=document.createElement('input');lab.className='nbq-r';r.row=lab;r.inp=inp;
   if(s.t==='tgl'){inp.type='checkbox';lab.innerHTML=`<span>${esc(s.n)}</span><span class="nbq-v"><i class="nbq-cb"></i><span class="nbq-ow"></span></span>`;inp.addEventListener('change',()=>apply(r))}
   else{inp.type='range';if(s.t==='ch'){inp.min='0';inp.step='5'}else{inp.min=el.min||'0';inp.max=el.max||'100';inp.step=String(Math.max(5,+el.step||0))}
    lab.innerHTML=`<span>${esc(s.n)}</span><span class="nbq-v"><i class="nbq-a" data-d="-1">‹</i><b></b><i class="nbq-a" data-d="1">›</i></span>`;inp.addEventListener('input',()=>apply(r));
    inp.addEventListener('keydown',e=>{const d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();const nv=Math.max(+inp.min,Math.min(+inp.max,+inp.value+(+inp.step||5)*d));if(nv!==+inp.value){inp.value=String(nv);apply(r)}});
    lab.addEventListener('click',e=>{const a=e.target.closest('.nbq-a');e.preventDefault();inp.focus({preventScroll:true});if(!a)return;const nv=Math.max(+inp.min,Math.min(+inp.max,+inp.value+(+inp.step||5)*(+a.dataset.d)));if(nv!==+inp.value){inp.value=String(nv);apply(r)}})}
   inp.setAttribute('aria-label',s.n);lab.append(inp);L.append(lab);rows.push(r)}upd()}
 const fok=e=>{const r=rows.find(x=>x.row.contains(e.target));if(r){akt=r;for(const x of rows)x.row.classList.toggle('nbq-ak',x===r);podglad()}};L.addEventListener('focusin',fok);L.addEventListener('mouseover',fok);
 // Dziennik i Mapa: dwa panele
 function dziennik(){const j=pause.querySelector('.nbp-journal');if(!j||j.classList.contains('nbq-j')&&j.querySelector('.nbq-c2'))return;const ol=j.querySelector('ol');if(!ol)return;j.classList.add('nbq-j');
  const c=document.createElement('div');c.className='nbq-c2';c.innerHTML=`<div class="nbq-h2">${T('Dziennik nocy','Night journal')}</div>`;c.append(ol);const ch=(j.querySelector('.nbp-jp')||{}).textContent||'';
  let ci=0;try{ci=Math.max(0,CHN.indexOf(ch))}catch(e){}const a=document.createElement('div');a.className='nbq-art';a.innerHTML=`<i class="nbq-ai" style="background-image:url('${TL+ROZ[ci%6]}.webp')"></i><i class="nbq-ag"></i><div><span class="k">${T('Dziennik','Journal')}</span><span class="n">${esc(ch)}</span><span class="d">${T('Wiadomości z tej nocy: ','Messages from this night: ')}${[...ol.querySelectorAll('li')].filter(x=>!/nie ma jeszcze|no messages|nothing yet/i.test(x.textContent)).length}</span></div>`;j.append(c,a)}
 function mapa(){const m=pause.querySelector('.nbp-map');if(!m||m.querySelector(':scope>.nbq-c2'))return;const cv=m.querySelector('canvas'),leg=m.querySelector('.nbp-leg');if(!cv||!leg)return;m.classList.add('nbq-m');
  const a=document.createElement('div');a.className='nbq-c2';a.append(cv);const b=document.createElement('div');b.className='nbq-c2';b.innerHTML=`<div class="nbq-h2">${T('Mapa rozdziału','Act map')}</div>`;b.append(leg);m.append(a,b)}
 function sync(){if(pause.hidden)return;const i=tabIdx(),vis=i===2||i===3;panel.classList.toggle('nbq-pv',vis);box.classList.toggle('nbq-vis',vis);if(vis&&i!==tab){tab=i;build()}else if(vis)upd();if(!vis)tab=-1;
  if(i===4)try{dziennik()}catch(e){}if(i===5)try{mapa()}catch(e){}}
 new MutationObserver(()=>setTimeout(sync,0)).observe(pause,{attributes:true,subtree:true,attributeFilter:['hidden','class','aria-selected','aria-pressed']});
 pause.addEventListener('change',e=>{if(!box.contains(e.target))setTimeout(upd,30)},true);
}catch(e){quietErr('pauzaZakladki',e)}})();
// 16.11.2026: ekran powitalny po wyborze jezyka, przed menu (decyzja autora): podziekowanie, wskazowki (grafika, jasnosc, pelny ekran, sterowanie),
// przyciski Dalej i Ustawienia grafiki, „Nie pokazuj ponownie” (pn_powitanie=0). Raz na uruchomienie; nie zmienia ustawien ani zapisu gry.
(()=>{try{
 const title=$('title'),lang=$('lang');if(!title)return;
 const T=(p,e)=>EN?e:p,O='#orient'.repeat(400),U='assets/ui/';
 let off=false,ss=false;try{off=localStorage.getItem('pn_powitanie')==='0';ss=sessionStorage.getItem('nbPow')==='1'}catch(e){}
 if(off||ss)return;
 const st=document.createElement('style');st.id='nb-powitanie';st.textContent=`
${O} #title.nbpow-on>:not(#nbPow){visibility:hidden!important}
${O} #nbPow{position:fixed!important;inset:0!important;z-index:70!important;background:#050406!important;color:#e6d6b8!important;font-family:Georgia,'Times New Roman',serif!important;overflow:hidden!important;visibility:visible!important}
${O} #nbPow[hidden]{display:none!important}
${O} #nbPow .nst{position:absolute!important;left:50%!important;top:50%!important;width:min(100vw,177.78vh)!important;height:min(100vh,56.25vw)!important;transform:translate(-50%,-50%)!important;--u:calc(min(100vw,177.78vh)/1920)!important}
${O} #nbPow .bg{position:absolute!important;inset:-2%!important;background:url('${U}c36d0b47cc7bd406ab997737de97057d8ea274fd95f49b90117995447fd04c18.webp') center 62%/cover no-repeat!important;filter:brightness(.62)!important}
${O} #nbPow .vg{position:absolute!important;inset:0!important;background:radial-gradient(ellipse 60% 70% at 50% 50%,rgba(5,4,6,.25),rgba(5,4,6,.88)),linear-gradient(0deg,rgba(5,4,6,.8),rgba(5,4,6,0) 30%)!important}
${O} #nbPow .zar{position:absolute!important;left:25%!important;right:25%!important;bottom:-10%!important;height:35%!important;background:radial-gradient(ellipse at 50% 100%,rgba(255,110,36,.28),rgba(255,90,30,0) 70%)!important}
${O} #nbPow .pan{position:absolute!important;left:50%!important;top:46%!important;translate:-50% -50%!important;width:calc(1180*var(--u))!important;box-sizing:border-box!important;padding:calc(26*var(--u)) calc(70*var(--u)) calc(20*var(--u))!important;border:calc(22*var(--u)) solid transparent!important;border-image:url('${U}39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp') 48 stretch!important;background:linear-gradient(180deg,rgba(14,11,11,.93),rgba(8,6,7,.96)) padding-box!important;text-align:center!important}
${O} #nbPow .k{display:block!important;font:600 calc(17*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.32em!important;color:#c08a5a!important}
${O} #nbPow h1{margin:calc(8*var(--u)) 0 0!important;padding:0!important;font:600 calc(58*var(--u))/1.05 Cinzel,Georgia,serif!important;letter-spacing:.12em!important;color:#ecd8b0!important;text-shadow:0 0 calc(24*var(--u)) rgba(255,120,40,.3),0 2px 6px #000!important;background:none!important;border:0!important}
${O} #nbPow .sep{display:block!important;width:calc(620*var(--u))!important;height:calc(34*var(--u))!important;margin:calc(12*var(--u)) auto calc(6*var(--u))!important;background:url('${U}e87781cfaa14780d76e1373114c875c6decbcc7790153c52696e97dd6354f281.webp') center/auto 100% no-repeat,url('${U}6912c5b070f1130d9bcc48c7936b6fd3effa4128a0d462ce9145f932770cdce7.webp') left center/calc(50% - 9px) 100% no-repeat,url('${U}789a7c5e5aeb6b48e8a1ff01e6e8a985a2fa162fca2d479e8075b1cd2c5fc64f.webp') right center/calc(50% - 9px) 100% no-repeat!important;filter:brightness(1.15)!important}
${O} #nbPow .lead{font:italic calc(26*var(--u))/1.4 Georgia,serif!important;color:#f0dfbf!important;margin:calc(6*var(--u)) auto 0!important;max-width:calc(960*var(--u))!important}
${O} #nbPow .h2{margin:calc(18*var(--u)) 0 calc(6*var(--u))!important;padding:calc(8*var(--u)) calc(18*var(--u))!important;text-align:left!important;font:700 calc(25*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.06em!important;color:#f0dcb6!important;background:linear-gradient(180deg,rgba(60,40,30,.55),rgba(26,18,14,.85))!important;border:1px solid rgba(160,120,70,.35)!important}
${O} #nbPow ul{list-style:none!important;margin:0!important;padding:0!important;text-align:left!important}
${O} #nbPow li{display:grid!important;grid-template-columns:calc(46*var(--u)) 1fr!important;gap:calc(16*var(--u))!important;align-items:start!important;padding:calc(8*var(--u)) calc(8*var(--u))!important;border-bottom:1px solid rgba(255,230,190,.07)!important;font:400 calc(22*var(--u))/1.42 Georgia,serif!important;color:#e6d6b8!important}
${O} #nbPow li>i{font-style:normal!important;display:grid!important;place-items:center!important;width:calc(34*var(--u))!important;height:calc(34*var(--u))!important;rotate:45deg!important;border:1px solid rgba(201,160,100,.6)!important;font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;color:#e8c690!important}
${O} #nbPow li>i>span{rotate:-45deg!important}
${O} #nbPow li>div,${O} #nbPow li>div *{font-family:Georgia,'Times New Roman',serif!important;font-size:calc(22*var(--u))!important;line-height:1.42!important}
${O} #nbPow li b{color:#f6e2b8!important;font-weight:700!important}
${O} #nbPow .end{margin:calc(14*var(--u)) 0 0!important;font:italic calc(22*var(--u))/1.4 Georgia,serif!important;color:#cdb48c!important}
${O} #nbPow .sig{display:block!important;margin-top:calc(8*var(--u))!important;font:600 calc(20*var(--u))/1.2 Cinzel,Georgia,serif!important;letter-spacing:.12em!important;color:#e0b878!important}
${O} #nbPow .btns{display:flex!important;justify-content:center!important;align-items:center!important;gap:calc(26*var(--u))!important;margin-top:calc(14*var(--u))!important}
${O} #nbPow .btns button{display:grid!important;place-items:center!important;height:calc(70*var(--u))!important;min-width:0!important;padding:0 calc(44*var(--u))!important;margin:0!important;border:0!important;border-image:none!important;box-shadow:none!important;background:url('${U}1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp') center/100% 100% no-repeat!important;font:700 calc(21*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.1em!important;color:#e6d6b8!important;text-shadow:0 2px 3px #000!important;filter:brightness(.88)!important;cursor:pointer!important}
${O} #nbPow .btns button.go2{height:calc(84*var(--u))!important;padding:0 calc(70*var(--u))!important;font-size:calc(28*var(--u))!important;color:#ffe2b8!important;filter:brightness(1.12) drop-shadow(0 0 calc(10*var(--u)) rgba(255,120,40,.5))!important;text-shadow:0 0 calc(12*var(--u)) rgba(255,140,60,.8)!important;background:radial-gradient(ellipse 46% 42% at 50% 58%,rgba(255,118,36,.5),rgba(255,90,30,0) 100%) center/86% 74% no-repeat,url('${U}1866b3882ad2b65ecbf08dff6da7240130cacb270a985e7a8d9ee8495a60a112.webp') center/100% 100% no-repeat!important}
${O} #nbPow .btns button:is(:hover,:focus-visible,.pf){filter:brightness(1.18) drop-shadow(0 0 calc(10*var(--u)) rgba(255,120,40,.55))!important;outline:none!important}
${O} #nbPow .cb{display:inline-flex!important;align-items:center!important;gap:calc(10*var(--u))!important;margin:calc(8*var(--u)) auto 0!important;padding:calc(4*var(--u)) calc(10*var(--u))!important;background:none!important;border:0!important;box-shadow:none!important;font:400 calc(18*var(--u))/1 Georgia,serif!important;color:#a99a80!important;cursor:pointer!important;min-height:0!important}
${O} #nbPow .cb>i{display:inline-block!important;width:calc(16*var(--u))!important;height:calc(16*var(--u))!important;border:1px solid #a99a80!important;position:relative!important}
${O} #nbPow .cb[aria-checked=true]>i::after{content:'✓'!important;position:absolute!important;left:calc(1*var(--u))!important;top:calc(-6*var(--u))!important;font:700 calc(19*var(--u))/1 Georgia,serif!important;color:#f0dcb6!important}
${O} #nbPow .cb:is(:hover,:focus-visible,.pf){color:#f0dcb6!important;outline:none!important}
${O} #nbPow .foot{position:absolute!important;left:0!important;right:0!important;bottom:calc(28*var(--u))!important;display:flex!important;justify-content:center!important;gap:calc(46*var(--u))!important;font:400 calc(20*var(--u))/1 Georgia,serif!important;color:#cdbf9f!important}
${O} #nbPow .foot span{display:flex!important;align-items:center!important;gap:calc(12*var(--u))!important}
${O} #nbPow kbd{font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(6*var(--u)) calc(9*var(--u))!important;background:rgba(0,0,0,.5)!important}
`;document.head.append(st);
 const P=document.createElement('div');P.id='nbPow';P.hidden=true;P.setAttribute('role','dialog');P.setAttribute('aria-modal','true');
 P.innerHTML=`<div class="nst"><i class="bg"></i><i class="vg"></i><i class="zar"></i><div class="pan">
  <span class="k">NIGHTBRAND</span><h1>${T('Witaj, Wędrowcze','Welcome, Wanderer')}</h1><i class="sep"></i>
  <p class="lead">${T('Stajesz twarzą w twarz z Nocą w świecie Nightbrand. Czy uda Ci się spłacić dług i zmyć z siebie Piętno?','You stand face to face with the Night in the world of Nightbrand. Will you manage to pay your debt and wash the Brand from your skin?')}</p>
  <div class="h2">${T('Zanim wyruszysz','Before you set out')}</div><ul>
  <li><i><span>I</span></i><div>${T('<b>Instrukcja.</b> Znajdziesz tam wszelkie informacje o grze i jej kluczowych mechanikach, które pomogą Ci przedzierać się przez hordy wrogów.','<b>Guide.</b> It holds everything about the game and its key mechanics, to help you cut through the hordes of enemies.')}</div></li>
  <li><i><span>II</span></i><div>${T('<b>Grafika i Jasność.</b> W Opcjach dobierz jakość do sprzętu, na jakim grasz. Masz sporo możliwości ustawień.','<b>Graphics and Brightness.</b> In Options match the quality to the hardware you play on. There are plenty of settings to choose from.')}</div></li>
  <li><i><span>III</span></i><div>${T('<b>Pełny ekran.</b> Pamiętaj, aby grać zawsze w pełnym ekranie (<b>F11</b> lub <b>Grafika → Pełny ekran</b>).','<b>Full screen.</b> Always play in full screen (<b>F11</b> or <b>Graphics → Full screen</b>).')}</div></li>
  <li><i><span>IV</span></i><div>${T('<b>Sterowanie.</b> Możesz grać samą klawiaturą, klawiaturą z myszką albo z użyciem kontrolera.','<b>Controls.</b> You can play with the keyboard alone, keyboard and mouse, or a controller.')}</div></li>
  <li><i><span>V</span></i><div>${T('<b>Kooperacja.</b> Lokalnie dla dwóch graczy: zaproś swojego kompana do wspólnej walki.','<b>Co-op.</b> Local for two players: invite your companion to fight at your side.')}</div></li></ul>
  <p class="end">${T('Powodzenia. Niech Piętno Ci nie ciąży.<br>Dziękuję za Twój czas.','Good luck. May the Brand not weigh on you.<br>Thank you for your time.')}<span class="sig">y33bau</span></p>
  <div class="btns"><button type="button" class="gfx">${T('Ustawienia grafiki','Graphics settings')}</button><button type="button" class="go2">${T('Dalej','Continue')}</button></div>
  <button type="button" class="cb" role="checkbox" aria-checked="false"><i></i>${T('Nie pokazuj ponownie','Don\'t show again')}</button>
 </div><div class="foot"></div></div>`;
 title.append(P);
 const foot=P.querySelector('.foot'),stopka=()=>{const pad=document.body.classList.contains('padnav');foot.innerHTML=pad?`<span><kbd>A</kbd>${T('Wybierz','Select')}</span><span><kbd>B</kbd>${T('Dalej','Continue')}</span>`:`<span><kbd>Enter</kbd>${T('Wybierz','Select')}</span><span><kbd>Esc</kbd>${T('Dalej','Continue')}</span>`};
 const cb=P.querySelector('.cb');cb.addEventListener('click',()=>cb.setAttribute('aria-checked',String(cb.getAttribute('aria-checked')!=='true')));
 let pokazany=false;
 function zamknij(){if(P.hidden)return;P.hidden=true;title.classList.remove('nbpow-on');try{sessionStorage.setItem('nbPow','1');if(cb.getAttribute('aria-checked')==='true')localStorage.setItem('pn_powitanie','0')}catch(e){}try{uiSnd('back')}catch(e){}}
 P.querySelector('.go2').addEventListener('click',()=>{zamknij();setTimeout(()=>{const t=title.querySelector('button:not([disabled]):not(#nbPow button)');t&&t.focus({preventScroll:true})},40)});
 P.querySelector('.gfx').addEventListener('click',()=>{zamknij();const o=$('optsBtn');if(o){o.click();setTimeout(()=>{const g=document.querySelector('#opts .tabs>.tab[data-tab="gfx"]');g&&g.click()},60)}});
 addEventListener('keydown',e=>{if(P.hidden||title.hidden)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();zamknij()}},true);
 if(typeof pcMenuBack!=='undefined'){const prev=pcMenuBack;pcMenuBack=()=>{if(!P.hidden){zamknij();return true}return prev?prev():false}}
 function sprobuj(){if(pokazany)return;if(lang&&!lang.hidden)return;if(title.hidden)return;pokazany=true;P.hidden=false;title.classList.add('nbpow-on');stopka();for(const t of [60,400,1200])setTimeout(()=>{if(!P.hidden&&!P.contains(document.activeElement))P.querySelector('.go2').focus({preventScroll:true})},t)}
 if(lang)new MutationObserver(sprobuj).observe(lang,{attributes:true,attributeFilter:['hidden']});
 new MutationObserver(sprobuj).observe(title,{attributes:true,attributeFilter:['hidden']});
 new MutationObserver(stopka).observe(document.body,{attributes:true,attributeFilter:['class']});
 setTimeout(sprobuj,50);
}catch(e){quietErr('powitanie',e)}})();
// 16.11.2026: Sterowanie w Pauzie i Opcjach w nowym ukladzie (prosba autora): po lewej lista klawiszy w ramie (wlasne klawisze; dla pada lista przyciskow),
// po prawej schemat (obraz klawiatury lub pada) w ramie. Te same elementy co dotad (przyciski zmiany klawiszy dzialaja jak wczesniej). Naglowek pauzy: nazwa rozdzialu pod ozdobnikiem.
(()=>{try{
 const O='#orient'.repeat(400),RAMA="url('assets/ui/39a90a0a3c0dbb394918eb030fde7ca5dd7ae13e8d2fbaa161b3b2020a22841b.webp')",C=':is(#pauseKeys,#pane-ctl)';
 const st=document.createElement('style');st.id='nb-sterowanie-makieta';st.textContent=`
${O} ${C}{--u:calc(min(100vw,177.78vh)/1920)}
${O} ${C}>div:not(.subtabs):not(.opsep):not([hidden]):has(>img.nb-ctl-img){display:grid!important;grid-template-columns:47% 1fr!important;grid-template-rows:minmax(0,1fr)!important;gap:calc(24*var(--u))!important;align-items:stretch!important;max-width:calc(1700*var(--u))!important;margin:calc(10*var(--u)) auto 0!important;height:calc(560*var(--u))!important}
${O} ${C}>div:has(>img.nb-ctl-img)>img.nb-ctl-img{grid-column:2!important;grid-row:1!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;box-sizing:border-box!important;padding:calc(18*var(--u))!important;margin:0!important;border:calc(18*var(--u)) solid transparent!important;border-image:${RAMA} 48 stretch!important;background:#0b0809 padding-box!important}
${O} ${C}>div:has(>img.nb-ctl-img)>:not(img):not(.keys):not([id^=kbBind]):not(:has(.kbgrid)){display:none!important}
${O} ${C}>div:has(>img.nb-ctl-img)>:is([id^=kbBind],div:has(.kbgrid),.keys){grid-column:1!important;grid-row:1!important;position:static!important;width:auto!important;height:auto!important;clip:auto!important;overflow-y:auto!important;white-space:normal!important;margin:0!important;padding:calc(16*var(--u)) calc(22*var(--u))!important;border:calc(18*var(--u)) solid transparent!important;border-image:${RAMA} 48 stretch!important;background:linear-gradient(180deg,rgba(13,10,10,.92),rgba(8,6,7,.95)) padding-box!important;scrollbar-width:thin!important;scrollbar-color:#7a5530 rgba(255,255,255,.04)!important}
${O} ${C}>div:has(>img.nb-ctl-img):has(.kbgrid)>.keys{display:none!important}
${O} ${C} :is([id^=kbBind],div:has(>.kbgrid))>.opsep{display:none!important}
${O} ${C} :is([id^=kbBind],div:has(>.kbgrid))>h3{display:block!important;margin:0 0 calc(8*var(--u))!important;padding:calc(10*var(--u)) calc(18*var(--u))!important;text-align:left!important;font:700 calc(28*var(--u))/1 Cinzel,Georgia,serif!important;letter-spacing:.05em!important;color:#f0dcb6!important;text-shadow:0 2px 4px #000!important;background:linear-gradient(180deg,rgba(60,40,30,.55),rgba(26,18,14,.85))!important;border:1px solid rgba(160,120,70,.35)!important}
${O} ${C} :is([id^=kbBind],div:has(>.kbgrid))>p{margin:calc(6*var(--u)) 0 calc(10*var(--u))!important;font:italic calc(18*var(--u))/1.35 Georgia,serif!important;color:#c8b694!important;text-align:left!important}
${O} ${C} .kbgrid{display:flex!important;flex-direction:column!important;gap:0!important}
${O} ${C} .kbrow{display:flex!important;justify-content:space-between!important;align-items:center!important;min-height:calc(46*var(--u))!important;padding:0 calc(10*var(--u)) 0 calc(16*var(--u))!important;background:rgba(30,24,22,.5)!important;border-bottom:1px solid rgba(255,230,190,.07)!important}
${O} ${C} .kbrow:hover,${O} ${C} .kbrow:focus-within{background:linear-gradient(90deg,rgba(150,92,46,.7),rgba(70,44,26,.5))!important}
${O} ${C} .kbrow>span{font:400 calc(21*var(--u))/1.2 Georgia,serif!important;color:#ecdcbc!important;text-align:left!important}
${O} ${C} .kbrow>button.kbb{min-width:calc(90*var(--u))!important;min-height:0!important;height:calc(34*var(--u))!important;padding:0 calc(12*var(--u))!important;font:700 calc(16*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-image:none!important;border-radius:calc(4*var(--u))!important;background:rgba(0,0,0,.55)!important;box-shadow:none!important;filter:none!important}
${O} ${C} .kbrow>button.kbb:is(:hover,:focus-visible,.pf,.on){border-color:#e0a860!important;color:#fff0d8!important;background:rgba(120,70,30,.6)!important}
${O} ${C} :is([id^=kbBind],div:has(>.kbgrid))>.btnrow{margin-top:calc(12*var(--u))!important;justify-content:flex-start!important}
${O} ${C} .keys{display:grid!important;grid-template-columns:1fr auto!important;column-gap:calc(12*var(--u))!important;row-gap:0!important;align-content:start!important}
${O} ${C} .keys>span{padding:calc(11*var(--u)) calc(6*var(--u)) calc(11*var(--u)) calc(14*var(--u))!important;border-bottom:1px solid rgba(255,230,190,.07)!important;font:400 calc(21*var(--u))/1.25 Georgia,serif!important;color:#ecdcbc!important;text-align:left!important}
${O} ${C} .keys>b{display:flex!important;gap:calc(6*var(--u))!important;justify-content:flex-end!important;align-items:center!important;padding:calc(8*var(--u)) calc(8*var(--u))!important;border-bottom:1px solid rgba(255,230,190,.07)!important}
${O} ${C} .keys kbd{font:700 calc(15*var(--u))/1 Cinzel,Georgia,serif!important;color:#e6d2ab!important;border:1px solid rgba(201,160,100,.6)!important;border-radius:calc(4*var(--u))!important;padding:calc(6*var(--u)) calc(9*var(--u))!important;background:rgba(0,0,0,.55)!important;white-space:nowrap!important}
${O} #pause .nbp-head{display:flex!important;flex-direction:column!important;align-items:center!important}
${O} #pause .nbp-head>.pc-heading-rule{order:2!important}
${O} #pause .nbp-head>.nbp-sub{order:3!important;position:static!important;transform:none!important;margin:calc(10*var(--pc-u)) 0 0!important;font:600 calc(15*var(--pc-u))/1 Cinzel,Georgia,serif!important;letter-spacing:.22em!important;text-transform:uppercase!important;color:#c8b694!important}
`;document.head.append(st);
}catch(e){quietErr('sterowanieMakieta',e)}})();
requestAnimationFrame(frame);
})();

