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
  if(!card){card=mk('div','nb2-hero');const im=mk('img','');im.alt='';card.append(im,mk('b',''),mk('small','nb2-ep'),mk('small','nb2-cls'),mk('p','nb2-desc'),mk('small','nb2-lv'));pc.prepend(card)}
  const [im,nm,ep,cl,ds,lvE]=card.children,src=PREMIUM_ASSETS['portret-'+H.art];if(im.getAttribute('src')!==src)im.src=src;
  put(nm,H.n);put(ep,H.ep);put(cl,H.cls);put(ds,on.querySelector(':scope>span')?.textContent||'');put(lvE,lv);
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
 const DESC=EN?['A village, a cemetery and the crypt beneath it. Boss: The Conjoined.','Dwarven mines and forges. Boss: Cumlin, the Possessed Dwarf King.','A rotting city of the rich. Boss: Morhad, Beast of a Thousand Slaughters.','The forest and Bleak Peak. Bosses: Leshy and Mother Striga.','Seat of the Holy Order. Bosses: the Arch-Judge Reckoner and the Creditor.']
  :['Wioska, cmentarz i krypta pod nim. Boss: Zrost.','Krasnoludzkie kopalnie i kuźnie. Boss: Cumlin, Opętany Król Krasnoludów.','Zgniłe miasto bogaczy. Boss: Morhad, Bestia Tysiąca Rzezi.','Las i Łysa Góra. Bossowie: Leszy i Strzyga Matka.','Siedziba Zakonu. Bossowie: Arcysędzia Rachmistrz i Wierzyciel.'];
 const banner=title.querySelector('.premium-banner'),caption=title.querySelector('.premium-caption'),facts=title.querySelector('.pc-destination-facts'),chDesc=mk('p','nb2-chdesc');
 if(caption)caption.after(chDesc);
 const medCell=facts&&facts.firstElementChild,medRow=mk('div','nb2-medrow');
 if(medCell){medCell.classList.add('nb2-medcell');put(medCell.querySelector('small'),T('Medale klas','Class medals'));
  for(const c of CLS){const it=mk('span','nb2-med'),im=mk('img','');im.alt='';im.src=PREMIUM_ASSETS['portret-'+HEROES[c].art];it.dataset.c=c;it.append(im);medRow.append(it)}medCell.append(medRow)}
 function journey2(){if(title.hidden)return;const sel=title.querySelector('.premium-selected'),ch=Number(sel?.id.slice(5))||1,locked=chLocked(ch);
  put(chDesc,DESC[ch-1]);if(medCell)medCell.classList.toggle('nb2-locked',locked);
  for(const it of medRow.children){const v=medalOf(it.dataset.c,ch),h=HEROES[it.dataset.c],tip=h.n+' ('+h.cls+'): '+(v?MEDAL_N[v]:T('brak medalu','no medal'));if(it.title!==tip){it.title=tip;it.style.setProperty('--ring',medalRing(v));it.classList.toggle('nb2-has',!!v)}}
  for(let i=1;i<=5;i++){const b=$('start'+i);if(!b)continue;let m=b.querySelector('.nb2-meds');if(!m){m=mk('span','nb2-meds');m.setAttribute('aria-hidden','true');for(const c of CLS){const d=mk('i','');d.dataset.c=c;m.append(d)}b.append(m)}
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
 put($('pauseMenuBtn'),T('Porzuć noc','Abandon night'));
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
/* --- Przygotowanie: karta klasy i staly rzad klas --- */
@N@ #prep #prepChar{display:flex!important;flex-direction:column!important;gap:1.1vh!important;overflow:hidden auto!important}
@N@ #prep #prepChar>.premium-class-description{display:none!important}
@N@ #prep #prepChar>.nb2-hero{order:1!important;flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important;padding:1.2vh 1.4vh 1.3vh!important;background:var(--nbs-on)!important;border:1px solid var(--nbs-line)!important}
@N@ #prep .nb2-hero>img{flex:0 1 21vh!important;min-height:11vh!important;max-height:21vh!important;width:auto!important;max-width:100%!important;object-fit:contain!important;display:block!important}
@N@ #prep .nb2-hero>b{font:500 max(18px,3.3vh)/1.15 Cinzel,Georgia,serif!important;color:#fff0d5!important;margin-top:.5vh!important}
@N@ #prep .nb2-hero>.nb2-ep{font:600 calc(max(12px,2.05vh) * var(--nbts,1))/1.2 Grenze,Georgia,serif!important;color:#e8d6a8!important}
@N@ #prep .nb2-hero>.nb2-cls{font:500 max(11px,1.6vh)/1.3 Cinzel,Georgia,serif!important;letter-spacing:.16em!important;text-transform:uppercase!important;color:#c9a45a!important;margin-top:.2vh!important}
@N@ #prep .nb2-hero>.nb2-desc{margin:.9vh 0 0!important;font:400 calc(max(12px,1.62vh) * var(--nbts,1))/1.34 Grenze,Georgia,serif!important;color:#e6d6b8!important;text-align:center!important;hyphens:none!important}
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
requestAnimationFrame(frame);
})();
