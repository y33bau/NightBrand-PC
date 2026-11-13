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
 const LSK='nbLayoutEd', EDIT=/[?&]edytor=1/.test(location.search);
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
requestAnimationFrame(frame);
})();
