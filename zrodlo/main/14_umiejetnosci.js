/* ============ SKILLS ============ */
function nearest(x,y,maxD){let b=null,bd=maxD;for(const e of S.enemies){if(e.dead||e.rise>0)continue;const d=Math.hypot(e.x-x,e.y-y);if(d<bd){bd=d;b=e}}return b}
function visible(){return S.enemies.filter(e=>!e.dead&&e.rise<=0&&Math.abs(e.x-pl.x)<190&&Math.abs(e.y-pl.y)<120)}
function aoe(x,y,r,dmg,kb,fn,hit){let h=0;for(const e of S.enemies){if(e.dead||e.rise>0)continue;const dx=e.x-x,dy=e.y-y,d=Math.hypot(dx,dy);if(d<r+e.r&&!(hit&&hit.has(e))){if(damageEnemy(e,dmg,dx/(d||1),dy/(d||1),kb)){if(hit)hit.add(e);h++;if(fn&&!e.dead)fn(e)}}}return h}
const screenAng=(dx,dy)=>Math.atan2(dy*Math.sin(PITCH),dx);
function updZones(dt){
  for(let i=S.quakes.length-1;i>=0;i--){const q=S.quakes[i];q.delay-=dt;if(q.delay>0)continue;S.quakes.splice(i,1);
    aoe(q.x,q.y,q.r||12,q.dmg,.5,null,q.hit);addVfx(A.fx.spikes,.4,q.x,q.y,0,.95,'bill');
    if(DEC.crack&&Math.random()<.6)decalAt(DEC.crack[(Math.random()*4)|0],q.x,q.y,.85);
    for(let k=0;k<3;k++)S.parts.push({k:'d',x:q.x,y:q.y,z:2,vx:rnd(-20,20),vy:rnd(-10,10),vz:rnd(30,55),c:P.st4,life:.7});shake(.06,.08)}
  for(let i=S.zones.length-1;i>=0;i--){const z=S.zones[i];z.life-=dt;z.tick-=dt;if(z.tick<=0){z.tick=.35;aoe(z.x,z.y,z.r,z.dmg,0)}
    if(Math.random()<dt*14)S.parts.push({k:'e',x:z.x+rnd(-z.r,z.r),y:z.y+rnd(-z.r*.6,z.r*.6),z:4,vx:rnd(-5,5),vy:0,vz:rnd(18,36),c:Math.random()<.5?P.ember:P.ember2,life:rnd(.4,.9)});
    if(z.life<=0){scene.remove(z.mesh);S.zones.splice(i,1)}}
}
function updPicks(dt){
  for(let i=S.picks.length-1;i>=0;i--){const p=S.picks[i],dx=pl.x-p.x,dy=pl.y-6-p.y,d=Math.hypot(dx,dy)||1;
    if(p.k==='c'&&S.collector&&!S.collector.dead){const c=S.collector,cx=c.x-p.x,cy=c.y-6-p.y,cd=Math.hypot(cx,cy)||1;if(cd<90&&!p.mag){p.x+=cx/cd*120*dt;p.y+=cy/cd*120*dt;if(cd<8){scene.remove(p.mesh);scene.remove(p.glow);S.picks.splice(i,1);c.stolen+=(p.returned?p.v:p.v*S.pk.coin*DF[DIFFK].coin);continue}}}
    if(!p.mag&&d<32*(1+(S.magnet||0))&&!pl.dead)p.mag=true;
    if(p.mag&&!pl.dead){p.sp=Math.min(340,p.sp+520*dt);p.x+=dx/d*p.sp*dt;p.y+=dy/d*p.sp*dt;
      if(d<7){scene.remove(p.mesh);scene.remove(p.glow);S.picks.splice(i,1);
        if(p.k==='h'){heal(pl.max*.1);play('heal',0);ftInfo((EN?'+10% health':'+10% życia'));for(let q=0;q<14;q++)S.parts.push({k:'e',x:pl.x+rnd(-5,5),y:pl.y+rnd(-3,3),z:rnd(4,16),vx:rnd(-10,10),vy:0,vz:rnd(14,34),c:Math.random()<.5?'#ff5a6a':'#ffb0b8',life:rnd(.4,.8)});continue}
        if(p.k==='c'){if(p.returned)S.coins+=p.v;else awardCoins(p.v);play('coin',.05);continue}
        S.xp+=p.v*S.pk.xp*DF[DIFFK].xp*1.2;S.actions.collect++;play('pick',.03);while(S.xp>=S.need){S.xp-=S.need;S.lvl++;S.need=xpNeed(S.lvl);S.pendLv++}if(S.pendLv>0&&!S.choosing)openLevelUp()}}}
  if(S.pendLv>0&&!S.choosing&&!S.shop&&!S.dialog&&!S.notice&&!pl.dead)openLevelUp();
}
function rollChoices(){{const ne=ENCH.filter(k=>S.sk[k]).length,sk0=SLASH_SK.filter(canLearnSlasher),pacts=Object.keys(STY).filter(k=>STY[k].pact).filter(k=>!S.sk[k]),npa=Object.keys(STY).filter(k=>STY[k].pact&&S.sk[k]).length,
    lead=['def','off','wav'].sort((a,b)=>brSum(b)-brSum(a))[0],pool=[];
    for(const k of SLASH_UP)pool.push([k,1]);
    for(const k of sk0)pool.push([k,2]);
    for(const k in STY){const t=STY[k];if(t.pact){if(S.lvl>=4&&npa<2&&!S.sk[k])pool.push([k,.7]);continue}if(sk(k)>=t.max)continue;const have=brSum(t.br);pool.push([k,have>0?3.2+(t.br===lead?1.2:0):1.4])}
    const o=[];while(o.length<4&&pool.length){const tot=pool.reduce((a,b)=>a+b[1],0);let r=Math.random()*tot,i=0;for(;i<pool.length-1;i++){r-=pool[i][1];if(r<=0)break}const k=pool.splice(i,1)[0][0];if(!o.includes(k))o.push(k)}
    if(!o.some(k=>STY[k]&&!STY[k].pact)){const st=Object.keys(STY).filter(k=>!STY[k].pact&&sk(k)<STY[k].max);if(st.length)o[o.length-1]=st[(Math.random()*st.length)|0]}
    {const need=S.chal&&!S.chal.done&&({k_doskok:'leap',k_krag:'whirl',d_echo:'zalecho',d_zastaw:'zastaw'})[S.chal.c.id];if(need&&!sk(need)&&canLearnSlasher(need)&&!o.includes(need))o[0]=need}
    return o}}
const rollCostNow=()=>SL.roll*(1-.12*sk('taniec'))*S.pk.rollCost*(S.zab&&S.pk.zSurge&&pl.sta<pl.staMax*.35?.8:1);
function cardSub(k,l,d){if(d.pact)return (EN?'Pact: an edge with a price':'Pakt: przewaga z ceną');const n=brSum(d.br);return (l?(EN?`Level ${l+1} of ${d.max}`:`Poziom ${l+1} z ${d.max}`):(EN?'New style':'Nowy styl'))+` · ${BR[d.br].n} ${Math.min(SET_N,n+1)}/${SET_N}`}
function cardDesc(k,d){let t=d.d;if(!d.pact&&!brOn(d.br)&&brSum(d.br)+1>=SET_N)t+=(EN?' Set ':' Zestaw ')+BR[d.br].n+': '+BR[d.br].set;return t}
// przed → po: jedna liczba zamiast opisu
const FXL={garda:[(EN?'Block cost':'Koszt bloku'),L=>Math.round(100*(1-.1*L))+'%'],riposta:[(EN?'Riposte multiplier':'Mnożnik riposty'),L=>'×'+RIPO_L[Math.min(5,L)].toFixed(1).replace('.',',')],odzysk:[(EN?'Stamina returned on parry':'Zwrot staminy po parowaniu'),L=>10*L],
  ostrze:[(EN?'Light attack cost':'Koszt szybkiego ataku'),L=>Math.round(100*(1-.08*L))+'%'],rytm:[(EN?'Last combo hit':'Ostatni cios combo'),L=>'+'+18*L+'%'],buty:[(EN?'Movement speed':'Prędkość ruchu'),L=>'+'+10*L+'%'],taniec:[(EN?'Dodge cost':'Koszt uniku'),L=>Math.round(100*(1-.12*L))+'%'],
  fala:[(EN?'Wave damage / range':'Obrażenia / zasięg fal'),L=>'+'+Math.round(FALA_B[L]*100)+'% / +'+15*L+'%'],echo:[(EN?'Waves after parry':'Fale po parowaniu'),L=>L<1?1:L===1?2:3],zryw:[(EN?'Wave every … hits':'Fala co … trafień'),L=>L<1?'—':ZRYW_N[L]]};
const FXPACT={szklo:[(EN?'+50% damage':'+50% obrażeń'),(EN?'enemies +30% damage':'wrogowie +30% obrażeń')],cisza:[(EN?'+50% stamina regeneration':'+50% regeneracji staminy'),(EN?'−20% health':'−20% życia')]};
function fxPair(k,l){const T=STY[k];if(T&&!T.pact&&FXL[k]){const f=FXL[k];return[f[0],f[1](l),f[1](l+1)]}
  if(k==='_vit')return[(EN?'Max health':'Maks. życie'),Math.round(pl.max),Math.round(pl.max+15)];if(k==='_dex')return[(EN?'Max stamina':'Maks. stamina'),Math.round(pl.staMax),Math.round(pl.staMax+15)];if(k==='_int')return[(EN?'Max mana':'Maks. mana'),Math.round(pl.manaMax),Math.round(pl.manaMax+15)];
  if(k==='_str')return[(EN?'Damage':'Obrażenia'),Math.round(S.str*100)+'%',Math.round((S.str+.1)*100)+'%'];return null}
function cardHTML(k,i){const l=S.sk[k]||0,d=SK[k],T=STY[k],cls=T?(T.pact?'pk':'br-'+T.br):k[0]==='_'?'st':'';
  const sub=T?cardSub(k,l,d):d.sub?d.sub:d.extra?(EN?'Loot':'Łup'):l?(EN?`Level ${l+1} of ${ENCH.includes(k)&&S.mainEnchant&&S.mainEnchant!==k?3:d.max||9}`:`Poziom ${l+1} z ${ENCH.includes(k)&&S.mainEnchant&&S.mainEnchant!==k?3:d.max||9}`):(EN?'New skill':'Nowa umiejętność');
  let fx='',desc=T?cardDesc(k,d):d.lv?d.lv[l]:d.d,small=false;
  if(T&&T.pact){const p=FXPACT[k];fx=`<span class="fx"><b class="up">${p[0]}</b><b class="dn">${p[1]}</b></span>`;desc='';}
  else{const q=fxPair(k,l);if(q){fx=`<span class="fx"><em>${q[0]}</em><b>${q[1]}</b><s>→</s><b class="up">${q[2]}</b></span>`;small=true}}
  const close=T&&!T.pact&&!brOn(T.br)&&brSum(T.br)+1>=SET_N;
  if(ENCH.includes(k)){const support=!!S.mainEnchant&&S.mainEnchant!==k;desc=support?(EN?`Support blade (${ELEMENT_NAME[ELEMENT_OF[k]]}), max 3 lvl: half the chance, 35% status strength; ice: 15% slow (bosses 10%). No marks, finisher or sword bonus.`:`Ostrze wspierające (${ELEMENT_NAME[ELEMENT_OF[k]]}), maks. 3 poz.: połowa szansy, 35% siły statusu; lód: spowolnienie 15% (na bossa 10%). Bez znaków, finiszera i premii miecza.`):desc+(k==='fireblade'?(EN?' From lvl 3: dodging leaves weak embers.':' Od poz. 3: unik zostawia słaby żar.'):k==='iceblade'?(EN?' From lvl 3: a heavy attack shatters the frost and slows nearby enemies.':' Od poz. 3: silny atak rozbija mróz i spowalnia sąsiadów.'):'');desc+=' '+(ELEMENT_OF[k]==='fire'?(EN?'Excludes ice.':'Wyklucza lód.'):ELEMENT_OF[k]==='ice'?(EN?'Excludes fire.':'Wyklucza ogień.'):(EN?'Combines with 1 other element.':'Łączy się z 1 innym żywiołem.'));}return {cls,html:(EN?`<span class="num">${i+1}</span><span class="ck">${d.kind}</span><span class="cn"><i data-premium-skill="${k}" class="ic ic-${d.ic||(k==='_gold'?'coin':k==='_heal'?'brew':k)}"></i>${d.name}</span><span class="cl${l?'':' new'}">${sub}</span>${fx}${close?'<span class="setb">Completes the set!</span>':''}${desc?`<span class="cd${small?' sm':''}">${T&&small?STY[k].d:desc}</span>`:''}`:`<span class="num">${i+1}</span><span class="ck">${d.kind}</span><span class="cn"><i data-premium-skill="${k}" class="ic ic-${d.ic||(k==='_gold'?'coin':k==='_heal'?'brew':k)}"></i>${d.name}</span><span class="cl${l?'':' new'}">${sub}</span>${fx}${close?'<span class="setb">Domyka zestaw!</span>':''}${desc?`<span class="cd${small?' sm':''}">${T&&small?STY[k].d:desc}</span>`:''}`)}}
function renderBuild(pre){const el=$('lvBuild');if(!el)return;
  let h='';for(const b of ['def','off','wav']){const n=brSum(b),segs=Array.from({length:SET_N},(_,i)=>`<i class="${i<n?'on':(pre===b&&i===n?'pre':'')}"></i>`).join('');
    h+=`<div class="brb ${b}${brOn(b)?' full':''}"><b>${BR[b].n}</b><span class="seg">${segs}</span>${Math.min(n,SET_N)}/${SET_N}<small>${brOn(b)?(EN?'Set active: ':'Zestaw aktywny: '):(EN?'Set: ':'Zestaw: ')}${BR[b].set}</small></div>`}
  const chips=Object.keys(STY).filter(k=>sk(k)).map(k=>`<span class="chip${STY[k].pact?' pk':''}">${STY[k].name}${STY[k].pact?'':' '+sk(k)}</span>`).concat(SLASH_SK.filter(k=>sk(k)).map(k=>`<span class="chip">${SK[k].name} ${sk(k)}</span>`));
  el.innerHTML=h+(chips.length?`<div class="chips">${chips.join('')}</div>`:'')+`<p class="element-summary">${elementalSummary()}</p>`}
function rrPrice(){return S.rr>0?0:10+5*(S.rrPaid||0)}
// 8.11.2026: card descriptions as bullet points (sentences, ';', ' · ' and multi-word comma clauses become separate lines)
function descBullets(t){t=String(t||'').replace(/\s+/g,' ').trim();if(!t)return[];const out=[];let cur='',dep=0;
  const NOSPLIT=/^\s*(?:ponad|w|we|na|do|przez|pod|nad|przy|z|ze|o|wokół|tym|który|która|które|których|gdy|jeśli|także|również|and|or|which|that|over|into|through|also)\b/i,ABBR=/(?:^|[\s(])(?:poz|maks|ok|np|min|lvl|max|approx)\.$/i,words=x=>x.trim().split(' ').filter(Boolean).length;
  const push=()=>{let x=cur.trim().replace(/[;,]+$/,'').trim();if(/\.$/.test(x)&&!/(?:obr|poz|maks|ok|min)\.$/i.test(x))x=x.slice(0,-1);if(x)out.push(x.charAt(0).toUpperCase()+x.slice(1));cur=''};
  for(let i=0;i<t.length;i++){const c=t[i];cur+=c;if(c==='(')dep++;else if(c===')')dep=Math.max(0,dep-1);if(dep)continue;const nx=t.slice(i+1);
    if(c==='.'&&/^ [A-ZĄĆĘŁŃÓŚŹŻ0-9+−×-]/.test(nx)&&!ABBR.test(cur)&&!/\d\.$/.test(cur.slice(-3).trim()||'')){push();i++;continue}
    if(c==='.'&&/^ [A-ZĄĆĘŁŃÓŚŹŻ]/.test(nx)&&!ABBR.test(cur)){push();i++;continue}
    if(c===';'&&nx[0]===' '){push();i++;continue}
    if(c==='·'&&cur.endsWith(' ·')){cur=cur.slice(0,-1);push();if(nx[0]===' ')i++;continue}
    if(c===','&&nx[0]===' '){const frag=cur.slice(0,-1).split(/[,:]/).pop(),nxt=nx.slice(1).split(/[,;.:]/)[0];if(words(frag)>=2&&words(nxt)>=2&&!/\d\.$/.test(frag.trim())&&!NOSPLIT.test(nxt)){push();i++;continue}}}
  push();return out}
function bulletCards(box){box.querySelectorAll('.cd').forEach(el=>{const L=descBullets(el.textContent);if(!L.length||el.textContent.trim()==='-')return;const ul=document.createElement('ul');ul.className='nb-bl';
  for(const x of L){const li=document.createElement('li');li.textContent=x;ul.appendChild(li)}el.textContent='';el.appendChild(ul)});
  if(!$('nbBlCss')){const st=document.createElement('style');st.id='nbBlCss';st.textContent='#cards .cd .nb-bl{list-style:none;margin:.2em 0 0;padding:0;text-align:left}#cards .cd .nb-bl li{position:relative;padding-left:1em;margin:.18em 0;line-height:1.3}#cards .cd .nb-bl li::before{content:"•";position:absolute;left:.15em;top:0;color:#e0a24a}';document.head.appendChild(st)}}
function renderCards(){$('lvlTitle').textContent=(EN?`Level ${S.lvl-S.pendLv+1}`:`Poziom ${S.lvl-S.pendLv+1}`)+(pl2&&S.mpTurn?(EN?' · Player ':' · Gracz ')+S.mpTurn:'');$('lvl').dataset.mp=pl2&&S.mpTurn?S.mpTurn:'';$('slots').textContent=ENCH.some(k=>S.sk[k])?(EN?'Choose a style, attribute or pact':'Wybierz styl, cechę lub pakt'):(EN?'Choose a technique, style or support magic':'Wybierz technikę, styl lub magię wspierającą');if(!pl2&&tutOpen('karty'))$('slots').textContent=(EN?'Pick one upgrade. Every level-up restores ':'Wybierz jedno ulepszenie. Każdy awans leczy ')+Math.round(S.pk.lvHeal*100)+(EN?'% health.':'% życia.');const box=$('cards');box.innerHTML='';
  S.choices.forEach((k,i)=>{const c=cardHTML(k,i),b=document.createElement('button');b.type='button';b.className='card '+c.cls;b.id='card'+i;b.innerHTML=c.html;b.addEventListener('pointerdown',()=>{b.dataset.openingBlocked=performance.now()<levelReadyAt?'1':'0'});b.addEventListener('click',e=>{const blocked=e.detail>0&&b.dataset.openingBlocked==='1';delete b.dataset.openingBlocked;if(!blocked)pickLevelCard(i)});
    const br=STY[k]&&!STY[k].pact?STY[k].br:null;const pv=()=>renderBuild(br),un=()=>renderBuild(),ph=()=>document.documentElement.classList.contains('padprio');b.addEventListener('mouseenter',()=>{if(!ph())pv()});b.addEventListener('focus',pv);b.addEventListener('mouseleave',()=>{if(!ph())un()});b.addEventListener('blur',un);box.appendChild(b)});
  bulletCards(box);renderBuild();const rb=$('rerollBtn'),pr=rrPrice();rb.textContent=pr===0?(EN?'Reroll cards · free':'Przerzuć karty · darmowy'):(EN?`Reroll cards · ${pr} coins`:`Przerzuć karty · ${pr} monet`);rb.disabled=pr>0&&S.coins<pr}
function rerollCards(){if(!S||!S.choosing)return;if(pl2&&S.mpTurn===2&&PAD2.g&&!MPCLK)return;const pr=rrPrice();if(pr>0&&S.coins<pr){play('empty',0);return}
  uiSnd('reroll');if(pr===0)S.rr--;else{S.coins-=pr;S.rrPaid=(S.rrPaid||0)+1}
  const old=S.choices;let c=null;for(let t=0;t<8;t++){c=rollChoices();if(!c.some(k=>old.includes(k)))break}S.choices=c;play('bless',0);renderCards();setTimeout(()=>{const f=$('card0');f&&f.focus({preventScroll:true});const lp=document.querySelector('#lvl .level-panel');if(lp)lp.scrollTop=0},20)}
const LEVEL_CHOICE_DELAY=1000;let levelReadyAt=0,levelReadyTimer=0;
let MPCLK=false;function pickLevelCard(i){if(performance.now()<levelReadyAt)return;if(S&&pl2&&S.mpTurn===2&&PAD2.g&&!MPCLK)return;pick(i)}
function rerollLevelCards(){if(performance.now()<levelReadyAt)return;rerollCards()}
function armLevelCards(){clearTimeout(levelReadyTimer);levelReadyAt=performance.now()+LEVEL_CHOICE_DELAY;$('lvl').classList.add('choice-wait');$('levelWait').textContent=(EN?'Read the descriptions — you can choose in 1 s':'Przeczytaj opisy — wybór dostępny po 1 s');levelReadyTimer=setTimeout(()=>{$('lvl').classList.remove('choice-wait');$('levelWait').textContent=''},LEVEL_CHOICE_DELAY)}
function openLevelUpNow(){const lvWasHidden=$('lvl').hidden||$('lvl').classList.contains('lvout');clearTimeout(LVOUT);$('lvl').classList.remove('lvout');resetInput();padRumble(.07,.22,110);S.choosing=true;if(pl2){if(!S.mpTurn)S.mpTurn=1}else S.mpTurn=0;pl.swingT=0;play('level',0);if(!pl.dead)pl.hp=Math.min(pl.max,pl.hp+pl.max*S.pk.lvHeal);if(pl2&&!pl2.dead)pl2.hp=Math.min(pl2.max,pl2.hp+pl2.max*S.pk.lvHeal);// level healing is defined by the selected preparation perks
  S.choices=rollChoices();S.rr=1+(S.rrBonus||0);renderCards();
  $('lvl').hidden=false;if(lvWasHidden){const L=$('lvl'),cl=LVMODE;L.classList.remove('lvsoft','lvquick');void L.offsetWidth;L.classList.add(cl);setTimeout(()=>L.classList.remove(cl),1700)}LVMODE='lvsoft';document.querySelector('#lvl .level-build').open=false;armLevelCards();$('touch').hidden=true;setTimeout(()=>{const f=$('card0');f&&f.focus({preventScroll:true});const lp=document.querySelector('#lvl .level-panel');if(lp)lp.scrollTop=0},30)}
// 13.11.2026: łagodne wejście awansu (wersja lekka, testowa). Bez spowolnienia czasu: gra toczy się 0,25 s,
// złoty pierścień wokół postaci i napis „Nowy poziom” przy medalionie, potem okno wjeżdża (tło i karty kolejno).
// Awans w ciągu 10 s od zamknięcia poprzedniego okna: bez pierścienia i napisu, samo płynne wejście (0,2 s).
// Mechanika bez zmian: pauza, leczenie przy awansie, blokada wyboru 1 s. Kolejne awanse z kolejki otwierają się od razu.
let LVPRE=0,LVCLOSED=-1e9,LVMODE='lvsoft',LVOUT=0;
// zamknięcie okna awansu: łagodne zanikanie (0,4 s), gra rusza od razu
const LV_FREEZE=1;// 14.11.2026 (decyzja autora): po zamknięciu okna awansu świat stoi jeszcze 1 s (0,4 s zanikania okna + 0,6 s czystego widoku), żeby gracz zobaczył sytuację
function lvHide(){const L=$('lvl');L.classList.remove('lvsoft','lvquick');L.classList.add('lvout');clearTimeout(LVOUT);LVOUT=setTimeout(()=>{L.classList.remove('lvout');if(!S||!S.choosing)L.hidden=true},420)}
function openLevelUp(){
  const live=S&&S.phase==='play'&&!S.choosing&&!S.paused&&!S.shop&&!S.dialog&&!S.notice&&!S.intro&&!(pl&&pl.dead);
  if(!live){if(!LVPRE)openLevelUpNow();return}
  if(LVPRE)return;
  if(performance.now()-LVCLOSED<10000){LVMODE='lvquick';openLevelUpNow();return}
  LVPRE=performance.now()+250;const run=S;
  try{for(let i=0;i<28;i++){const an=i/28*Math.PI*2,c=Math.cos(an),sn=Math.sin(an);S.parts.push({k:'e',x:pl.x+c*10,y:pl.y+sn*6,z:rnd(6,14),vx:c*130,vy:sn*78,vz:rnd(2,8),c:i%2?'#ffd98a':'#f2b84b',life:.55})}}catch(e){}
  lvPopLabel();
  const wait=()=>{if(S!==run||!S||S.phase!=='play'||(pl&&pl.dead)){LVPRE=0;return}
    if(performance.now()<LVPRE||S.paused||S.shop||S.dialog||S.notice||S.intro){setTimeout(wait,40);return}
    LVPRE=0;LVMODE='lvsoft';if(S.pendLv>0&&!S.choosing)openLevelUpNow()};
  setTimeout(wait,40)}
function lvPopLabel(){try{const m=document.querySelector('.pch-level'),r=m&&m.offsetParent!==null?m.getBoundingClientRect():null;
  const d=document.createElement('div');d.className='lvpop';d.textContent=EN?'New level':'Nowy poziom';
  d.style.left=(r?r.left+r.width/2:innerWidth/2)+'px';d.style.top=(r?Math.max(8,r.top-8):innerHeight*.72)+'px';document.body.append(d);
  d.animate([{opacity:0,transform:'translate(-50%,-80%)'},{opacity:1,transform:'translate(-50%,-100%)',offset:.22},{opacity:1,transform:'translate(-50%,-100%)',offset:.72},{opacity:0,transform:'translate(-50%,-125%)'}],{duration:1300,easing:'ease-out'}).onfinish=()=>d.remove()}catch(e){}}
{const Z='#orient'.repeat(12)+' ',st=document.createElement('style');st.id='lv-soft';st.textContent=
`.lvpop{position:fixed;z-index:2147482000;pointer-events:none;white-space:nowrap;font:700 calc(26 * min(.05981vw,.10627vh))/1 Cinzel,Georgia,serif;letter-spacing:.08em;color:#f5d48a;text-shadow:0 0 12px #e0a23f99,0 2px 3px #000;opacity:0}
${Z}#lvl{background:radial-gradient(ellipse at 50% 45%,#08070b00 0%,#08070b52 82%)!important}
${Z}#lvl .level-panel{background:linear-gradient(180deg,#0e0c101a,#0e0c100d)!important}
${Z}#lvl .card{background:linear-gradient(150deg,#2a1f2661,#110d1757)!important;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);text-shadow:0 1px 2px #000c}
${Z}#lvl #cards .card:is(:focus,:focus-visible,.pf){background:linear-gradient(150deg,#502330a6,#26192099)!important}
${Z}#lvl .card .fx{background:#09070a59!important}
${Z}#lvl.lvsoft{animation:lvSoftBg .6s ease-out both}
${Z}#lvl.lvsoft .card{animation:lvSoftCard .7s cubic-bezier(.2,.8,.2,1) both}
${Z}#lvl.lvsoft .card:nth-child(1){animation-delay:.2s}${Z}#lvl.lvsoft .card:nth-child(2){animation-delay:.32s}${Z}#lvl.lvsoft .card:nth-child(3){animation-delay:.44s}${Z}#lvl.lvsoft .card:nth-child(4){animation-delay:.56s}
${Z}#lvl.lvquick{animation:lvSoftBg .3s ease-out both}
${Z}#lvl.lvout{animation:lvSoftOut .42s ease-in both;pointer-events:none}
@keyframes lvSoftOut{from{opacity:1}to{opacity:0}}
@keyframes lvSoftBg{from{opacity:0}to{opacity:1}}
@keyframes lvSoftCard{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){${Z}#lvl.lvsoft,${Z}#lvl.lvquick,${Z}#lvl.lvout,${Z}#lvl.lvsoft .card{animation:none}}`;
document.head.append(st)}
// a ring of motes bursting from the hero when a rune is taken (gold for time, red for reach, others in their colours)
function pactApply(k){if(k==='szklo'){S.str*=1.5;S.vuln=(S.vuln||1)*1.3}else if(k==='cisza'){S.regenMul=(S.regenMul||1)*1.5;pl.max=Math.round(pl.max*.8);pl.hp=Math.min(pl.hp,pl.max)}ftInfo(STY[k].name)}
function pick(i){if(!S||!S.choosing)return;const k=S.choices[i];if(!k)return;const P2T=!!(pl2&&S.mpTurn===2),onP=f=>P2T?asP2(f):f();if(SLASH_SK.includes(k)&&!canLearnSlasher(k))return;uiSnd('card');tutMark('karty');if(k==='_vit'){onP(()=>{pl.max+=15;heal(15)});play('heal',0)}else if(k==='_dex'){onP(()=>{pl.staMax+=15;pl.sta=pl.staMax});play('bless',0)}else if(k==='_str'){S.str+=.1;play('bless',0)}else if(k==='_int'){onP(()=>{pl.manaMax+=15;pl.mana=pl.manaMax});S.int=(S.int||1)+.05;play('bless',0)}else if(k==='_gold'){S.coins+=25;play('coin',0)}else if(k==='_heal'){onP(()=>{pl.hp=pl.max});play('heal',0)}else{const b0=STY[k]&&STY[k].br?brOn(STY[k].br):false;S.sk[k]=(S.sk[k]||0)+1;learnElement(k);autoEquipActive(k);S.hl={k,t:clock};if(STY[k]){play('bless',0);if(STY[k].pact)onP(()=>pactApply(k));else if(!b0&&brOn(STY[k].br)){ftInfo((EN?'Style set: ':'Zestaw stylu: ')+BR[STY[k].br].n);play('level',0)}}}
  if(S.sk[k]===1)S.cd[k]=.3;
  if(HINTS_ENABLED&&sk(k)===1&&(NEW_SWORD_SK.includes(k)||ENCH.includes(k))){const nm=SK[k].name;let text;if(ENCH.includes(k))text=nm+': '+(S.mainEnchant===k?(EN?'main blade, up to lvl 10':'główne ostrze, do 10 poz.'):(EN?'support blade, max lvl 3':'ostrze wspierające, maks. 3 poz.'))+' '+elementalSummary();else if(ACTIVE_SLASHER.includes(k)){const c=ACTIVE_CFG[k],at=S.activeSlots.indexOf(k);text=nm+(at>=0?(EN?' → slot ':' → slot ')+[KB.map.s1,KB.map.s2,KB.map.s3,KB.map.s4].map(kbName)[at]:(EN?' → reserve (equip in the pause menu)':' → rezerwa (wyposaż w pauzie)'))+' · '+c.cost+' '+activeResourceName(k)+(EN?', cooldown ':', odnowienie ')+String(c.wait(1)).replace('.',',')+' s.'}else text=nm+': '+SK[k].lv[0];say(text,'hint')}if(k[0]!=='_'){S.own=S.own||{};(S.own[k]=S.own[k]||[0,0])[P2T?1:0]++}if(pl2)S.mpTurn=3-(S.mpTurn||1);S.pendLv--;chipsDirty=true;if(S.pendLv>0){openLevelUp();return}S.choosing=false;lvHide();S.hitstop=Math.max(S.hitstop||0,LV_FREEZE);LVCLOSED=performance.now();$('touch').hidden=!coarse}
const npcTalk=n=>{const s=S.npc[n.id]?.state;return s==='alive'||s==='offered'||(n.id==='chojrak'&&s==='talked')};
function nearNpc(){if(!S||pl.dead)return null;for(const n of W.npcs){if(n.lure||!npcTalk(n))continue;if(Math.hypot(pl.x-n.x,pl.y-n.y)<30)return n}return null}
const chojPages=mode=>FTX((STORYMODE?'chojrak.story.act'+CH:'chojrak.arcade')+'.'+(mode==='repeat'?'repeat':'first'));
const NL=n=>n.id==='chojrak'?chojPages(S.chojMode||'first'):n.id==='mila'&&S.npc.mila.retry?MILA_RETRY:n.id==='wolch'&&S.npc.wolch.state==='offered'?WOLCH_ACCEPT:n.lines;
function openDialog(n){S.witChoice=false;$('witChoices').hidden=true;document.querySelector('#dialog .next').hidden=false;resetInput();
  // pion: rozmowa jako pasek (imię + pierwsza kwestia), gra się nie zatrzymuje, nagroda naliczana od razu; Wit i Żerca (wybór/układ) zostają w oknie
  if(isPort()&&n.id!=='wit'&&n.id!=='wolch'&&n.id!=='chojrak'){const L=NL(n),line=n.name.split(',')[0]+': '+L[0];S.dialog=n;S.dlg=L.length-1;if(n.id==='mila'){advanceDialog();say(line,'story')}else{say(line,'story');advanceDialog()}return}
  if(n.id==='chojrak')S.chojMode=S.npc.chojrak.state==='alive'?'first':'repeat';
  S.dialog=n;S.dlg=0;$('dlgWho').textContent=n.name;$('dlgTxt').textContent=NL(n)[0];$('dialog').hidden=false;dlgChojUi()}
// okno rozmowy Chojraka: przyciski Dalej / Zakoncz rozmowe (w trakcie) oraz Zamknij / Przypomnij rozmowe (na ostatniej stronie)
function dlgChojUi(){const on=!!(S&&S.dialog&&S.dialog.id==='chojrak'),last=on&&S.dlg>=NL(S.dialog).length-1,row=$('dlgBtns');row.hidden=!on;document.querySelector('#dialog .next').hidden=on;
  if(!on)return;$('dlgNext').hidden=last;$('dlgSkip').hidden=last;$('dlgClose').hidden=!last;$('dlgReplay').hidden=!last}
function chojEnd(){if(!S||!S.dialog||S.dialog.id!=='chojrak')return;S.dlg=NL(S.dialog).length-1;advanceDialog()}
function chojReplay(){if(!S||!S.dialog||S.dialog.id!=='chojrak')return;S.chojMode='first';S.dlg=0;$('dlgTxt').textContent=NL(S.dialog)[0];dlgChojUi()}
function advanceDialog(){if(S.witChoice)return;const n=S.dialog;S.dlg++;if(S.dlg<NL(n).length){$('dlgTxt').textContent=NL(n)[S.dlg];dlgChojUi();return}
  if(n.id==='wit'){offerWitChoice();return}
  if(n.story){$('dialog').hidden=true;S.dialog=null;return}
  $('dialog').hidden=true;$('dlgBtns').hidden=true;S.dialog=null;const st=S.npc[n.id];
  const motes=c=>{for(let i=0;i<30;i++)S.parts.push({k:'i',x:n.x+rnd(-6,6),y:n.y,z:rnd(0,20),vx:rnd(-10,10),vy:0,vz:rnd(10,26),c,life:rnd(1,2)})};
  if(n.id==='tharm'){st.state='fading';st.t=1.5;if(!S.glizT)S.glizT=S.t+3;pl.max+=25;pl.hp=pl.max;play('bless',0);say((EN?'The warmth of the forge fills your veins. +25 max health.':'Ciepło kuźni wypełnia ci żyły. +25 do maks. życia.'));motes('#7fd0ff')}
  else if(n.id==='elder'){st.state='dead';st.deadAt=S.t;pool(n.x,n.y,14,6);S.ev.add('el');say((EN?'The old man breathes his last.':'Starzec wydaje ostatnie tchnienie.'))}
  else if(n.id==='marga'){st.state='gone';motes('#3d4a3a');0}
  else if(n.id==='wit'){return}
  else if(n.id==='izolda'){st.state='talked';pl.max+=15;pl.hp=pl.max;play('heal',0);say((EN?'The flask smells of roses and vinegar. Your wounds close. +15 max health.':'Flakon pachnie różami i octem. Rany się zamykają. +15 do maks. życia.'));motes('#ffb347')}
  else if(n.id==='ottokar'){st.state='talked';S.coins+=40;play('purse',0);play('doorOut',0);say((EN?'The Count tosses you a purse through a gap in the door and slams the bolts shut.':'Hrabia rzuca ci sakiewkę przez szparę w drzwiach i zatrzaskuje rygle.'))}
  else if(n.id==='chojrak'){const first=st.state==='alive';st.state='talked';if(first&&CH===1){const amt=Math.round(pl.max*.3);pl.max+=amt;pl.hp+=amt;S.bless={t:180,amt};play('bless',0);motes('#fff0b0');say((EN?`Chojrak lays his hands on your shoulders. +${amt} max health for 3 minutes.`:`Chojrak kładzie ci dłonie na ramionach. +${amt} do maks. życia na 3 minuty.`))}}
  else if(n.id==='mila'){st.state='trial';S.trial={t:15,k:0};play('bless',0);say((EN?'Mila\'s trial: kill 20 enemies in 15 seconds!':'Próba Mili: zabij 20 wrogów w 15 sekund!'))}
  else if(n.id==='heri'){st.state='talked';S.heri=180;play('bless',0);motes('#b8c4dc');chipsDirty=true;say((EN?'Heri pins his sign on you. Stamina regeneration +15% for 3 minutes.':'Heri przypina ci swój znak. Regeneracja staminy +15% na 3 minuty.'))}
  else if(n.id==='wierz'){st.state='talked';S.herb=60;play('heal',0);motes('#9ac070');say((EN?'The brew burns your throat. For a minute, your wounds close on their own.':'Napar pali w gardle. Przez minutę rany same się zasklepiają.'))}
  else if(n.id==='bartosz'){st.state='talked';MINI.fog.getContext('2d').clearRect(0,0,MW,MH);play('bless',0);say((EN?'Bart sketches a map of the valley in the mud. You can see the whole area and the Nourishing Cauldrons.':'Bartosz kreśli w błocie mapę doliny. Widzisz całą okolicę i Sycące Kociołki.'))}
  else if(n.id==='wolch'){if(st.state==='alive'){st.state='offered';say((EN?'The priest is waiting. Speak to him again if you accept the bargain.':'Żerca czeka. Porozmawiaj z nim jeszcze raz, jeśli przyjmujesz układ.'))}
    else{st.state='talked';const own=SLASH_SK.filter(k=>S.sk[k]&&S.sk[k]<(SK[k].max||9)),k=own[(Math.random()*own.length)|0],cost=Math.round(pl.max*.2);pl.max-=cost;pl.hp=Math.min(pl.hp,pl.max);blood(pl.x,pl.y,20,0,1);play('bless',0);motes('#951518');chipsDirty=true;
      if(k){S.sk[k]=Math.min(SK[k].max||9,S.sk[k]+2);S.hl={k,t:clock};say((EN?`The priest cuts your palm above the oak\'s root. ${SK[k].name}: +2 levels. Max health −${cost}.`:`Żerca nacina ci dłoń nad korzeniem dębu. ${SK[k].name}: +2 poziomy. Maks. życia −${cost}.`))}else{S.lvl++;S.need=xpNeed(S.lvl);S.pendLv++;say((EN?`The blood soaks into the roots. Max health −${cost}.`:`Krew wsiąka w korzenie. Maks. życia −${cost}.`));openLevelUp()}}}
  else if(n.id==='nawoj'){st.state='talked';pl.max+=10;pl.hp=pl.max;play('bless',0);motes('#d9d2bd');say((EN?'Nawoj writes your name in the book. +10 max health and full heal.':'Nawoj wpisuje twoje imię do księgi. +10 do maks. życia i pełne leczenie.'))}
  else if(n.id==='rudna'){st.state='talked';MINI.fog.getContext('2d').clearRect(0,0,MW,MH);play('bless',0);motes('#b8a58a');say((EN?'Rudna lays her palm on the rock and tells you every tunnel. The whole map is revealed.':'Rudna kładzie dłoń na skale i opowiada ci każdy chodnik. Cała mapa zostaje odsłonięta.'))}
  else if(n.id==='seweryna'){st.state='talked';S.fury=90;play('bless',0);motes('#a46a8a');say((EN?'Seweryna ties the black thread around your wrist. +20% damage for 90 seconds.':'Seweryna wiąże ci czarną nić na nadgarstku. +20% obrażeń przez 90 sekund.'))}
  else if(n.id==='dobromir'){st.state='talked';pl.hp=Math.min(pl.max,pl.hp+Math.round(pl.max*.5));play('heal',0);motes('#e0b040');say((EN?'The old honey is bitter and warm. You recover half of your health.':'Stary miód jest gorzki i ciepły. Odzyskujesz połowę życia.'))}
  else if(n.id==='lucjan'){st.state='talked';S.coins+=60;play('purse',0);motes('#c9b98a');say((EN?'Lucjan presses a purse into your hand. +60 coins.':'Lucjan wciska ci w dłoń sakiewkę. +60 monet.'))}
  else if(n.id==='skryba'){st.state='talked';S.rr=(S.rr||0)+3;play('bless',0);motes('#c9b98a');say((EN?'The scribe tears a page from the ledger. +3 free card rerolls.':'Skryba wyrywa kartkę z rejestru. +3 darmowe przerzuty kart.'))}
  else if(n.id==='straznik'){st.state='talked';S.disc=.35;play('coin',0);motes('#d8cfb8');say((EN?'The guard whispers something to the trader. Prices at Marga\'s stall: −35%.':'Strażnik szepcze coś handlarce. Ceny w kramie Margi: −35%.'))}
  else if(n.id==='pieczetnik'){st.state='talked';pl.inv=Math.max(pl.inv,10);play('bless',0);motes('#ffd27a');say((EN?'Seal of protection for 10 seconds: nothing can touch you.':'Pieczęć ochronna przez 10 sekund: nic cię nie tknie.'))}
  else if(n.id==='aurel'){st.state='talked';S.lvl++;S.need=xpNeed(S.lvl);S.pendLv++;play('bless',0);motes('#d8cfb8');say((EN?'The medallion is warm from a small hand. You feel strength growing in you.':'Medalion jest ciepły od małej dłoni. Czujesz, jak rośnie w tobie siła.'));openLevelUp()}}
function updPlayer(dt){
  if(S.bufRoll){S.bufRoll=0;rollPress=true}
  if(pl.dead){pl.deadT+=dt;return}
  let mx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+tj.x+PAD.x,my=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0)+tj.y+PAD.y;
  let ml=Math.hypot(mx,my);if(ml>1){mx/=ml;my/=ml;ml=1}
  if(pl.visualGuard)pl.visualGuard.t=Math.max(0,pl.visualGuard.t-dt);pl.inv=Math.max(0,pl.inv-dt);pl.swingT=Math.max(0,pl.swingT-dt);pl.hurtT=Math.max(0,pl.hurtT-dt);pl.parryT=Math.max(0,(pl.parryT||0)-dt);pl.gHitT=Math.max(0,(pl.gHitT||0)-dt);
  if(pl.roll>0){pl.roll-=dt;pl.rollT+=dt;moveBox(pl,pl.rvx*dt,pl.rvy*dt,4,3,true);return}
  pl.rollCd-=dt;
  if(rollPress){if(pl.sta+1e-8>=rollCostNow()&&!(pl.broken>0)&&!(pl.atk&&pl.atk.stage!=='rec')&&pl.rollCd<=0){{pl.sta=Math.max(0,pl.sta-rollCostNow());pl.dance=sk('taniec')?.8:0;if(sk('fireblade')>=3){S.swordTrails.push({x:pl.x,y:pl.y,t:1.2,hit:new Set()});}pl.staDelay=SL.delay;pl.atk=null;pl.block=false;pl.swingT=0}let dx=pl.fx,dy=pl.fy;if(ml>.1){dx=mx/ml;dy=my/ml}S.actions.dodge++;if(S.t>=NIGHT-90)S.lateDodge=1;if(S.t<BREAK_AT)S.kDodge=1;pl.roll=.3;pl.rollT=0;pl.rvx=dx*215*S.pk.roll;pl.rvy=dy*215*S.pk.roll;pl.s=dx>=0?1:-1;pl.inv=Math.max(pl.inv,S.kat?.42:.34);pl.rollCd=.28;pl.swingT=0;play('roll',0);return}
    if(pl.atk?.kind!=='whirl'&&pl.sta<rollCostNow()){S.stamFlash=.45;play('empty',.25)}}
  const slow=(SLOWT[tileAt(Math.floor(pl.x/TS),Math.floor(pl.y/TS))]||1)*(S.zab&&S.pk.zSurge&&pl.sta<pl.staMax*.35?1.2:1);
  const hold=(S.snare>0?.3:1)*(S.slowT>0?.6:1)*(pl.atk?.kind==='whirl'&&pl.atk.stage==='act'?WHIRL.speed:pl.atk||pl.broken>0?0:pl.block?.45:pl.charging?.5:1);
  if(ml>.1&&hold>0){if(!(pl.block||pl.charging)){pl.fx=mx/ml;pl.fy=my/ml}const ox=pl.x,oy=pl.y;moveBox(pl,mx*66.7*slow*hold*S.pk.spd*(1+.1*sk('buty'))*dt,my*66.7*slow*hold*S.pk.spd*(1+.1*sk('buty'))*dt,4,3);const distance=Math.hypot(pl.x-ox,pl.y-oy);const st0=Math.floor(pl.walk*2);pl.walk+=distance/72;pl.moving=distance>.001;if(Math.floor(pl.walk*2)!==st0&&!(pl.roll>0))play('step',0)}else pl.moving=false;
  if(Math.abs(pl.fx)>Math.abs(pl.fy)){pl.dir=2;pl.s=pl.fx>0?1:-1}else{pl.dir=pl.fy>0?0:1}
  for(let si=0;si<SHRINES.length;si++){const sh=SHRINES[si],sd=Math.hypot(pl.x-sh.x,pl.y-sh.y);
  const pk=CH+':'+si;if(!S.pot)S.pot={};if(S.pot[pk]==null)S.pot[pk]=DF[DIFFK].pot;const left=S.pot[pk];if(sd<26&&pl.hp<pl.max&&left<=0){pl.potEmptyT=(pl.potEmptyT||0)-dt;if(pl.potEmptyT<=0){pl.potEmptyT=4;ftInfo(EN?'The cauldron is empty':'Kociołek jest pusty')}}if(sd<26&&pl.hp<pl.max&&left>0){const hh=heal(Math.min(pl.max*.06*dt,pl.max-pl.hp,left));S.pot[pk]=Math.max(0,left-hh);if(!sfxBuffers.has('Kociolek'))play('heal',.6);S.potHealT=clock;S.fxHeal=clock;S.fxHealIdx=si;pl.healAcc=(pl.healAcc||0)+hh;pl.healT=(pl.healT||0)+dt;if(pl.healT>=.9){pl.healT=0;if(pl.healAcc>=1)ftInfo('+'+Math.round(pl.healAcc)+' HP · '+(EN?'cauldron ':'kociołek ')+Math.round(S.pot[pk]/DF[DIFFK].pot*100)+'%');pl.healAcc=0}if(Math.random()<dt*46)S.parts.push({k:'i',x:pl.x+rnd(-6,6),y:pl.y+rnd(-2,2),z:rnd(0,8),vx:0,vy:0,vz:rnd(16,34),c:Math.random()<.5?'#7dffb0':'#d8ffe8',life:rnd(.7,1.2)})}}
}
// 10.11.2026: wrog po smierci nie zostawia ciala: opada i rozsypuje sie w popiol (platki unosza sie i bledna)
function ashFx(x,y,big,fire,n,zc){for(let i=0;i<n;i++){const r=Math.random();S.parts.push({k:'e',x:x+rnd(-5,5)*(big?2:1),y:y+rnd(-3,3)*(big?2:1),z:zc==null?rnd(2,big?34:18):Math.max(1,zc+rnd(-5,5)),vx:rnd(-6,24),vy:rnd(-9,9),vz:rnd(8,30),c:fire&&r<.3?'#ff8a3a':r<.5?'#cfc8bd':r<.8?'#8d867e':'#4d4742',life:rnd(.8,1.6)})}}
// rozpad na popiol: pikselowy szum zjada sylwetke od glowy w dol, krawedz rozpadu ciemnieje (zar przy ogniu); material nalezy tylko do tego ciala
function ashMatMake(src,fire){const m=src.clone();m.transparent=true;const U={value:0},F={value:fire?1:0};m.customProgramCacheKey=()=>'nb-ashdis';
  m.onBeforeCompile=sh=>{sh.uniforms.uDis=U;sh.uniforms.uFire=F;
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vQ;').replace('#include <uv_vertex>','#include <uv_vertex>\nvQ=uv;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vQ;uniform float uDis;uniform float uFire;').replace('#include <map_fragment>','#include <map_fragment>\n{float nz=fract(sin(dot(floor(vQ*vec2(34.,46.)),vec2(12.9898,78.233)))*43758.5453);float k=nz*.62+(1.-vQ.y)*.38;float e=uDis*1.18-k;if(e>0.)discard;float band=smoothstep(-.16,-.02,e);vec3 ash=uFire>.5?mix(vec3(.16,.13,.12),vec3(1.,.5,.16),step(.55,nz)):mix(vec3(.12,.11,.1),vec3(.52,.49,.45),step(.6,nz));diffuseColor.rgb=mix(diffuseColor.rgb*(1.-.3*uDis),ash,band);}')};
  m.userData.U=U;return m}
function updParts(dt){
  const ps=S.parts;
  for(let i=ps.length-1;i>=0;i--){const p=ps[i];
    if(p.k==='b'){if(bloodHD.ready&&p.bloodHD===undefined){p.bloodHD=true;p.bloodDrop=(++bloodHD.serial%4===0)}p.vz-=230*dt;p.z+=p.vz*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
      if(p.z<=0){if(p.bloodHD){if(!VOID.has(tileAt(Math.floor(p.x/TS),Math.floor(p.y/TS)))){Math.random();if(p.bloodDrop)stampBloodHD(p.x,p.y,4,3)}}else if(!VOID.has(tileAt(Math.floor(p.x/TS),Math.floor(p.y/TS)))){const X=Math.round(p.x),Y=Math.round(p.y),vm=Math.hypot(p.vx,p.vy)||1,ux=p.vx/vm,uy=p.vy/vm,L=vm>85?3:vm>45?2:1;dg.fillStyle=p.c;dg.fillRect(X,Y,1,1);for(let j=1;j<=L;j++)dg.fillRect(Math.round(X+ux*j),Math.round(Y+uy*j),1,1);if(Math.random()<.3){dg.fillRect(X,Y,2,1);dg.fillStyle=P.blood2;dg.fillRect(X+1,Y+1,1,1)}decalDirty=true}ps.splice(i,1)}}
    else if(p.k==='g2'){p.life-=dt;const tx=p.tx;if(tx&&!tx.dead){p.x+=(tx.x-p.x)*Math.min(1,dt*6);p.y+=(tx.y-p.y)*Math.min(1,dt*6);p.z+=(18-p.z)*dt*4}if(p.life<=0)ps.splice(i,1)}
    else{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vx*=.97;if(p.k==='d')p.vz-=60*dt;if(p.z<0&&p.k!=='e')p.z=0;if(p.life<=0)ps.splice(i,1)}}
  if(ps.length>MAXP-50)ps.splice(0,ps.length-(MAXP-50));
}
// Defensive positioning is a legal strategy; no penalties for standing still.
const ENEMY_GRID=new Map(),CELL=32;
function buildEnemyGrid(){ENEMY_GRID.clear();for(const e of S.enemies){if(e.dead)continue;const key=Math.floor(e.x/CELL)+','+Math.floor(e.y/CELL);let a=ENEMY_GRID.get(key);if(!a)ENEMY_GRID.set(key,a=[]);a.push(e)}}
function nearbyEnemies(e){const a=[],x=Math.floor(e.x/CELL),y=Math.floor(e.y/CELL);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const q=ENEMY_GRID.get((x+dx)+','+(y+dy));if(q)a.push(...q)}return a}

function update(dt){if(S&&S.exec>0){S.exec-=dt;dt*=S.exec>.35?.2:.5}
  if(S&&S.phase==='play')bannerTick(dt);
  if(S&&S.intro){introTick(dt);return}
  if(S&&S.phase==='play')pumpNotice();if(!S||S.phase!=='play'||S.notice||S.choosing||S.shop||S.paused)return;
  if(TRN.god&&!pl.dead){pl.hp=pl.max;pl.sta=pl.staMax;pl.mana=pl.manaMax}if(S.train&&!pl.dead){pl.hp=Math.min(pl.max,pl.hp+pl.max*.12*dt);if(pl.manaMax)pl.mana=Math.min(pl.manaMax,(pl.mana||0)+pl.manaMax*.25*dt)}
  if(S.hitstop>0){S.hitstop-=dt;if(rollPress)S.bufRoll=1;return}
  if(S.dialog){if(talkPress||rollPress)advanceDialog();return}
  if(S.stage!=='break'&&S.stage!=='collector'&&!S.dg&&!S.train&&!allDead()){S.t+=dt;if(!allDead()){S.surv=(S.surv||0)+dt;if(S.surv>=SL.coinSurvive){S.surv-=SL.coinSurvive;S.coins++;play('coin',.02)}}}
  stageTick(dt);try{nightEventTick(dt)}catch(er){quietErr('nightEvent',er)}if(S.notice)return;if(S.dg)dungeonTick(dt);if(S.notice)return;
  if(selectedNpcAction){const q=selectedNpcAction,n=q.npc;if(q.state!==S||pl.dead||!W.npcs.includes(n)||!npcTalk(n))selectedNpcAction=null;else if(Math.hypot(pl.x-n.x,pl.y-n.y)<30){selectedNpcAction=null;openDialog(n);return}}
  const nm=nearMerchant();if(talkPress&&nm){openShop();return}
  const nn=nearNpc();if(talkPress&&nn){openDialog(nn);return}
  const nf=!nn&&!nm?nearPowerFire():null;if(talkPress&&nf){activatePowerFire(nf);return}const nx=!nn&&!nm&&!nf?nearExit():null;if(talkPress&&nx){useExit(nx);return}
  updPlayer(dt);recoverPurses();if(S.notice)return;events();if(S.notice)return;spawnTick(dt);miniTick();if(S.notice)return;chTick();
  slashUpdate(dt);if(pl2){asP2(()=>{updPlayer(dt);slashUpdate(dt,true);if(PAD2.talk){PAD2.talk=false;if(!pl.dead)withRb(pl,()=>{const nf=nearPowerFire();if(nf&&activatePowerFire(nf))ftInfo(EN?'Revival ready':'Odrodzenie gotowe')})}});mpTotemTick(dt)}for(const d of S.delayed)d.t-=dt;const ready=S.delayed.filter(d=>d.t<=0);S.delayed=S.delayed.filter(d=>d.t>0);ready.forEach(d=>d.fn());
  updZones(dt);
  buildEnemyGrid();for(const e of S.enemies)if(!e.dead){const tg=pl2?pickTarget(e):pl;if(tg!==pl){const p1=pl;pl=tg;try{updEnemy(e,dt)}finally{pl=p1}}else updEnemy(e,dt)}
  S.enemies=S.enemies.filter(e=>!e.dead);
  musTick(dt);
  updEproj(dt);updPicks(dt);
  for(const c of S.corpses){c.t+=dt;if(c.ash){const D=1.15;if(!c.am){c.am=ashMatMake(c.mesh.material,c.fire);c.mesh.material=c.am;c.own=1}const pr=Math.min(1,Math.max(0,(c.t-.1)/(D-.1)));c.am.userData.U.value=COMBAT_POLISH_ON?Math.min(1,Math.max(0,(c.t-.42)/(D-.42))):pr;if(pr>0&&pr<.9){let q=dt*(SETT.quality==='low'?22:70);while(q>0){if(Math.random()<Math.min(1,q))ashFx(c.x,c.y,false,c.fire,1,26*(1-pr)+2);q-=1}}if(c.t>=D&&!c.gone)c.gone=.001;continue}const L=c.big?30:7;if(c.t>L&&!c.gone){if(!c.own){c.mesh.material=c.mesh.material.clone();c.mesh.material.transparent=true;c.own=1}const f=1-(c.t-L)/2.2;c.mesh.material.opacity=Math.max(0,f);if(f<=0)c.gone=.001}}
  if(S.corpses.some(c=>c.gone&&c.t>c.gone))S.corpses=S.corpses.filter(c=>{if(c.gone&&c.t>c.gone){scene.remove(c.mesh);if(c.own)c.mesh.material.dispose();return false}return true});
  for(let i=S.vfx.length-1;i>=0;i--){const f=S.vfx[i];f.t+=dt;if(f.t>=f.dur){scene.remove(f.mesh);if(f.ownMat)for(const a of f.anim)a.n.dispose();S.vfx.splice(i,1)}}
  for(const id in S.npc){const st=S.npc[id];if(st.state==='fading'){st.t-=dt;if(st.t<=0)st.state='gone'}}
  if(CH===4){if(Math.random()<dt*.04)play('howl',6);for(const q of W.wisps)if(Math.abs(q.x*16-pl.x)<240&&Math.abs(q.z*16-pl.y)<150&&Math.random()<dt*3)S.parts.push({k:'e',x:q.x*16+rnd(-4,4),y:q.z*16+rnd(-3,3),z:rnd(6,14),vx:rnd(-3,3),vy:0,vz:rnd(2,6),c:'#7fffd0',life:rnd(.6,1.2)})}
  if(CH===3)for(let i=0;i<4;i++){const q=W.rots[(Math.random()*W.rots.length)|0];if(q&&Math.abs(q[0]*16-pl.x)<220&&Math.abs(q[1]*16-pl.y)<140&&Math.random()<dt*14)S.parts.push({k:'e',x:q[0]*16+rnd(2,14),y:q[1]*16+rnd(2,14),z:0,vx:0,vy:0,vz:rnd(3,9),c:Math.random()<.5?'#b8203a':'#701226',life:rnd(.5,1.1)})}
  if(CH!==2){for(const p of PROPS)if(p.fire&&Math.random()<dt*(p.big?9:5)){S.parts.push({k:'e',x:p.x*16+rnd(-4,4),y:p.y*16-4,z:10,vx:rnd(-6,6),vy:0,vz:rnd(16,34),c:Math.random()<.5?P.ember:P.ember2,life:rnd(.8,1.6)});if(Math.random()<.35)S.parts.push({k:'a',x:p.x*16+rnd(-3,3),y:p.y*16-4,z:16,vx:rnd(-4,2),vy:0,vz:rnd(8,14),c:'#3a3640',life:rnd(1.5,3)})}
    if(CH===1)S.nextBolt-=dt;if(S.nextBolt<=0&&!S.opening){S.nextBolt=rnd(14,30);S.flash=1;setTimeout(()=>play('thunder',0),400)}}
  S.flash=Math.max(0,S.flash-dt*2.4);
  for(let i=0;i<S.shr.length;i++)S.shr[i]=Math.min(60,S.shr[i]+1.4*dt);
  for(const [x,y] of braziers)if(Math.random()<dt*4)S.parts.push({k:'e',x:x*16+8+rnd(-3,3),y:y*16+8,z:18,vx:rnd(-4,4),vy:0,vz:rnd(14,30),c:P.ember2,life:rnd(.8,1.6)});
  for(const [x,y] of lavas)if(Math.random()<dt*.25)S.parts.push({k:'e',x:x*16+rnd(2,14),y:y*16+rnd(2,14),z:0,vx:rnd(-3,3),vy:0,vz:rnd(10,22),c:'#f59e0b',life:rnd(.8,1.6)});
  updParts(dt);
  if(Math.random()<dt*.4&&S.enemies.length)play('growl',.8);
  if(S.bless&&(S.bless.t-=dt)<=0){pl.max-=S.bless.amt;pl.hp=Math.min(pl.hp,pl.max);S.bless=null;0}
  if(S.fury>0&&(S.fury-=dt)<=0)0;
  if(S.snare>0)S.snare-=dt;if(S.slowT>0)S.slowT-=dt;if(S.herb>0){S.herb-=dt;heal(pl.max*.02*dt)}
  if(S.heri>0&&(S.heri-=dt)<=0)0;
  if(S.trial&&!pl.dead){S.trial.t-=dt;const st=S.npc.mila;
    if(S.trial.k>=20){S.trial=null;st.state='talked';S.fury=120;play('bless',0);shake(.1,.4);say((EN?'Mila raises her bow in salute: "You fight like one of us." +20% damage for 2 minutes.':'Mila unosi łuk w salucie: „Walczysz jak jedna z nas”. +20% obrażeń na 2 minuty.'))}
    else if(S.trial.t<=0){S.trial=null;st.state='alive';st.retry=true;say((EN?'Mila shakes her head: "Too slow. Come back when you are ready."':'Mila kręci głową: „Za wolno. Wróć, gdy będziesz gotów”.'))}}
  S.stamFlash=Math.max(0,(S.stamFlash||0)-dt);S.hurt=Math.max(0,S.hurt-dt);S.shakeT=Math.max(0,S.shakeT-dt);if(S.shakeT<=0)S.shakeM=0;
  if(allDead()){S.endT-=dt;if(S.endT<=0)endGame(false)}
  else if(S.won&&!S.opening){S.opening=3.4;for(const e of S.enemies){scene.remove(e.mesh);for(let i=0;i<8;i++)S.parts.push({k:'d',x:e.x,y:e.y,z:rnd(0,14),vx:rnd(-7,7),vy:0,vz:rnd(12,30),c:P.bone2,life:2})}S.enemies=[];if(CH===1){say((EN?'Dawn breaks. The dead crumble to ash.':'Świta. Martwi rozsypują się w popiół.'))}else if(CH===3){say((EN?'The beast falls silent. A pale, golden dawn rises above the domes.':'Bestia milknie. Nad kopułami wstaje blady, złoty świt.'));play('rumble',0)}else if(CH===4){say((EN?'Dawn spreads across the valley. The mist settles, the barrows fall silent.':'Świt rozlewa się po dolinie. Mgła opada, kurhany milkną.'));play('rumble',0)}else{say((EN?'The lift gates groan open.':'Wrota windy rozwierają się z jękiem.'));play('rumble',0);shake(.2,1.5)}}
  else if(S.opening){S.opening-=dt;if(S.opening<=0)endGame(true)}
}


