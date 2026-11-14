/* ============ LEVEL STAGES: 6 min fight, Marga's stall, the Collector, fight until 12 min, then Zrost ============ */
const SHOP=[
  {id:'brew',name:(EN?'Bitter Brew':'Gorzki wywar'),d:(EN?'Restores all health.':'Leczy ca�e �ycie.'),cost:20},
  {id:'heart',name:(EN?'Ashen Heart':'Serce z popio�u'),d:(EN?'+25 maximum health.':'+25 do maksymalnego �ycia.'),cost:35},
  {id:'whet',name:(EN?'Bone Whetstone':'Ose�ka z ko�ci'),d:(EN?'+10% damage for all skills.':'+10% obra�e� wszystkich umiej�tno�ci.'),cost:30},
  {id:'amulet',name:(EN?'Wind Amulet':'Amulet wiatru'),d:(EN?'+20 maximum stamina (up to 180; attributes can give more).':'+20 do maksymalnej staminy (do 180; cechy mog� da� wi�cej).'),cost:60},
  {id:'scroll',name:(EN?'Scroll of Memory':'Zw�j pami�ci'),d:(EN?'Instantly gain one level.':'Natychmiastowy awans o jeden poziom.'),cost:45},
  {id:'magnet',name:(EN?'Lodestone':'Kamie� przyci�gania'),d:(EN?'+40% pickup range for coins and hearts.':'+40% zasi�gu zbierania monet i serc.'),cost:25}];
const price=it=>Math.round(it.cost*Math.pow(1.35,S.bought[it.id]||0)*(1-(S.disc||0)));
function dissolveAll(msg){for(const e of S.enemies){scene.remove(e.mesh);for(let i=0;i<8;i++)S.parts.push({k:'d',x:e.x,y:e.y,z:rnd(0,14),vx:rnd(-7,7),vy:0,vz:rnd(12,30),c:P.bone2,life:2})}S.enemies=[];if(msg)say(msg)}
function startBreak(){S.stage='break';dissolveAll(null);let spot=CH===1?[1427,549]:null;for(let i=0;i<30&&!spot;i++){const a=Math.random()*Math.PI*2,x=pl.x+Math.cos(a)*44,y=pl.y+Math.sin(a)*30;if(!boxSolid(x,y,6,3))spot=[x,y]}
    spot=spot||[pl.x+20,pl.y];S.merchant={x:spot[0],y:spot[1],state:'in',t:1,wait:120};play('bless',0);
    for(let i=0;i<26;i++)S.parts.push({k:'a',x:spot[0]+rnd(-8,8),y:spot[1],z:rnd(0,20),vx:rnd(-8,8),vy:0,vz:rnd(8,20),c:'#3d4a3a',life:rnd(1,2)});
    setTimeout(()=>{if(S&&S.merchant&&S.merchant.state==='here'||S&&S.merchant&&S.merchant.state==='in')say((EN?'Marga sets up her stall. You have two minutes to trade.':'Marga rozk�ada kram. Masz dwie minuty na handel.'))},2500)}
function solneTick(){
 if(!S.solne){
  S.solne={open:[false,false],boss:null,ready:false};S.evDone=1;S.noteInit=1;
  say(EN?'Salt Quay. Release both chains, defeat the harbour master, then board the ferry.':'Solne Nabrze�e. Zwolnij oba �a�cuchy, pokonaj Bosmana i wejd� na prom.');
 }
 const st=S.solne,points=[[12.5,15.8],[53.5,15.8]];
 for(let i=0;i<points.length;i++){
  const [x,y]=points[i],px=MP(x)*TS,py=MP(y)*TS;
  if(!st.open[i]&&Math.hypot(pl.x-px,pl.y-py)<44){
   if(!st.hint||S.t>st.hint+4){ftInfo(EN?'Interact: release chain':'Rozmowa: zwolnij �a�cuch');st.hint=S.t;}
   if(talkPress){talkPress=false;st.open[i]=true;if(W.solneChains)W.solneChains[i].visible=false;play('coin',0);say(EN?'The chain drops.':'�a�cuch opada.');
    if(st.open.every(Boolean)){
     const hp=bossHealth('warden',3);
     st.boss=spawnEnemy('warden',MP(33)*TS,MP(13)*TS,{hp,max:hp,mini:true});
     say(EN?'The harbour master steps onto the landing.':'Bosman wchodzi na przycz��ek.');
    }
   }
  }
 }
 if(st.boss&&st.boss.dead&&!st.ready){st.ready=true;say(EN?'Board the ferry and interact to cross.':'Wejd� na prom i u�yj rozmowy, aby odp�yn��.');}
 if(st.ready&&pl.x>MP(27)*TS&&pl.x<MP(38)*TS&&pl.y>MP(2)*TS&&pl.y<MP(7)*TS&&talkPress){
  talkPress=false;endGame(true);
 }
}

function stageTick(dt){if(SOLNE_TEST&&CH===1){solneTick();return;}
  if(S.stage==='p1'&&S.t>=BREAK_AT&&!S.dg&&!S.endless){S.stage='collector';S.collT=2.5;dissolveAll((EN?'Midnight. The dead retreat into the darkness.':'P��noc. Martwi cofaj� si� w ciemno��.'))}
  const m=S.merchant;
  if(m){if(m.state==='in'){m.t-=dt*1.5;if(m.t<=0)m.state='here'}
    else if(m.state==='here'){m.wait-=dt;if(m.wait<=0){say((EN?'Marga runs out of patience and packs up her stall.':'Marga traci cierpliwo�� i zwija kram.'));leaveMerchant()}}
    else if(m.state==='out'){m.t-=dt*1.5;if(m.t<=0){S.merchant=null;if(!m.dg)S.stage='p2'}}}
  if(S.stage==='collector'&&S.collT>0&&CH===4&&A.leszy){S.collT-=dt;if(S.collT<=0){const p=ringSpot(120,170)||ringSpot(80,220)||[pl.x+100,pl.y],hp=bossHealth('leszy');
    S.leszy=spawnEnemy('leszy',p[0],p[1],{rise:1.4,hp,max:hp});play('bossGrowl',0);play('howl',0);shake(.2,1);say((EN?'The forest falls silent. Leshy, Lord of the Wilds, steps out from between the trees.':'Las milknie. Spomi�dzy drzew wychodzi Leszy, Pan Kniei.'))}}
  else if(S.stage==='collector'&&S.collT>0){S.collT-=dt;if(S.collT<=0){const p=ringSpot(120,170)||ringSpot(80,220)||[pl.x+100,pl.y];const hp=bossHealth('collector',CH===5?1.3:1);
    S.collector=spawnEnemy('collector',p[0],p[1],{rise:1.2,hp,max:hp,stolen:0});play('bossGrowl',0);S.flash=CH===1?1:0;say(CH===5?(EN?'The bell falls silent. The Arch-Judge Reckoner takes the judge\'s bench. He has come for your gold.':'Dzwon milknie. Na �aw� s�dziowsk� wchodzi Arcys�dzia Rachmistrz. Przyszed� po twoje z�oto.'):(EN?'The Order Collector steps out of the shadows. He has come for your gold.':'Z cienia wychodzi Poborca Zakonu. Przyszed� po twoje z�oto.'));bossSay(CH===5?'auditor':CH===2?'collector':null,'intro')}}
  if(S.stage==='p2'&&S.t>=NIGHT){S.stage='final';const p=ringSpot(150,220)||ringSpot(100,300)||[pl.x+120,pl.y],bt=CH===3?'beast':CH===4&&A.strzyga?'strzyga':CH===2&&A.cumlin?'cumlin':'boss',hp=Math.round(bossHealth(bt)*BOSS_HP_MUL);
    {const ord=S.enemies.filter(e=>!e.dead&&!BIG.has(e.type)&&e.type!=='collector'&&e.type!=='glizzard'&&e.type!=='boginka'&&e.type!=='wisp').sort((a,b)=>Math.hypot(b.x-pl.x,b.y-pl.y)-Math.hypot(a.x-pl.x,a.y-pl.y)),cut=Math.floor(ord.length*(1-BOSS_MOB));
      for(const e of ord.slice(0,cut)){for(let k=0;k<5;k++)S.parts.push({k:'d',x:e.x,y:e.y,z:rnd(0,8),vx:rnd(-14,14),vy:rnd(-8,8),vz:rnd(8,22),c:'#3a2c34',life:.5});scene.remove(e.mesh);const i=S.enemies.indexOf(e);if(i>=0)S.enemies.splice(i,1)}}
    {const fb=spawnEnemy(bt,p[0],p[1],{rise:1.6,hp,max:hp});if(fb&&fb.spd)fb.spd*=BOSS_SPD_MUL}play('rise',0);play('bossGrowl',0);shake(.3,1);if(CH===1)S.flash=1;
    say(CH===5?(EN?'The seal on the Throne Room floor cracks. The Creditor rises from his throne to settle the account.':'Piecz�� na pod�odze Sali Tronowej p�ka. Wierzyciel wstaje z tronu, by zamkn�� rachunek.'):CH===4?(bt==='strzyga'?(EN?'Ravens take flight from Bleak Peak. Mother Striga, Queen of the Barrows, rises from her barrow.':'Kruki zrywaj� si� z �ysej G�ry. Z kurhanu wstaje Strzyga Matka, Kr�lowa Kurhan�w.'):(EN?'The ground splits on Bleak Peak. The Conjoined crawls out of the barrow, fused from buried bodies.':'Na �ysej G�rze ziemia p�ka. Z kurhanu wype�za Zrost, zro�ni�ty z cia� pogrzebanych.')):CH===1?(EN?'The Conjoined rises from the ashes of the granary, fused from the bodies of the burned.':'Z popio��w spichlerza wstaje Zrost, zro�ni�ty z cia� spalonych.'):CH===2?(A.cumlin?(EN?'Cumlin, the Possessed Dwarf King, steps out from behind the Great Scales, the seals in him glowing.':'Zza Wielkiej Wagi wychodzi Cumlin, Op�tany Kr�l Krasnolud�w. �arz� si� w nim piecz�cie.'):(EN?'The Conjoined crawls out of the abyss, fused from many bodies.':'Z przepa�ci wype�za Zrost, zro�ni�ty z wielu cia�.')):(EN?'Morhad, Beast of a Thousand Slaughters, drops from the basilica tower. He has come to enter you in the foundations.':'Z wie�y bazyliki spada Morhad, Bestia Tysi�ca Rzezi. Przyszed� wpisa� ci� w fundamenty.'));bossSay(bt==='cumlin'?'cumlin':bt==='beast'?'morhad':CH===5?'creditor':CH===1?'outgrowth':null,'intro')}
}
function nearMerchant(){const m=S&&S.merchant;return m&&m.state==='here'&&!pl.dead&&Math.hypot(pl.x-m.x,pl.y-m.y)<34?m:null}
function leaveMerchant(){const m=S.merchant;if(!m||m.state==='out')return;m.state='out';m.t=1;for(let i=0;i<26;i++)S.parts.push({k:'a',x:m.x+rnd(-8,8),y:m.y,z:rnd(0,20),vx:rnd(-8,8),vy:0,vz:rnd(8,20),c:'#3d4a3a',life:rnd(1,2)})}
function shopMaxed(it){return it.id==='amulet'&&pl.staMax>=180}
function shopDesc(it){return it.id==='amulet'?(EN?'+20 maximum stamina (up to 180; attributes can give more).':'+20 do maksymalnej staminy (do 180; cechy mog� da� wi�cej).'):it.d}
function renderShop(){$('shopCoins').textContent=S.coins;const box=$('shopCards');box.innerHTML='';
  SHOP.forEach((it,i)=>{const pr=price(it),maxed=shopMaxed(it),b=document.createElement('button');b.type='button';b.className='card';b.id='shop'+i;b.disabled=maxed||S.coins<pr;
    b.innerHTML=(EN?`<span class="ck">Item ${i+1}</span><span class="cn"><i class="ic ic-${{brew:'brew',heart:'ashheart',whet:'whet',amulet:'amulet',scroll:'scroll',magnet:'magnet'}[it.id]}"></i>${it.name}</span><span class="cl coin">${maxed?'Sold out':pr+' coins'}</span><span class="cd">${shopDesc(it)}</span>`:`<span class="ck">Towar ${i+1}</span><span class="cn"><i class="ic ic-${{brew:'brew',heart:'ashheart',whet:'whet',amulet:'amulet',scroll:'scroll',magnet:'magnet'}[it.id]}"></i>${it.name}</span><span class="cl coin">${maxed?'Wyprzedane':pr+' monet'}</span><span class="cd">${shopDesc(it)}</span>`);b.addEventListener('click',()=>buy(i));box.appendChild(b)})}
function openShop(){resetInput();S.shop=true;play('shopIn',0);pl.swingT=0;renderShop();$('shop').hidden=false;$('touch').hidden=true;setTimeout(()=>{const f=$('shopClose');f&&f.focus()},30)}
function buy(i){const it=SHOP[i];if(!it||!S.shop)return;const pr=price(it);if(S.coins<pr||shopMaxed(it)){play('empty',0);return}
  S.coins-=pr;S.bought[it.id]=(S.bought[it.id]||0)+1;uiSnd('buy');
  if(it.id==='brew')pl.hp=pl.max;else if(it.id==='heart'){pl.max+=25;heal(25)}else if(it.id==='whet')S.whet++;else if(it.id==='amulet'){pl.staMax=Math.min(180,pl.staMax+20);pl.sta=pl.staMax}
  else if(it.id==='scroll'){S.lvl++;S.need=xpNeed(S.lvl);S.pendLv++}else if(it.id==='magnet')S.magnet+=.4;
  renderShop()}
function closeShop(){if(!S||!S.shop)return;S.shop=false;uiSnd('back');$('shop').hidden=true;$('touch').hidden=!coarse;const mdg=S.merchant&&S.merchant.dg;leaveMerchant();say(mdg?(EN?'Marga: "The stairs lead up. The night will wait for you."':'Marga: "Schody prowadz� na g�r�. Noc na ciebie poczeka".'):(EN?'Marga: "Careful. The Order Collector has caught the scent of your gold."':'Marga: "Uwa�aj. Poborca Zakonu zw�szy� twoje z�oto".'));if(S.pendLv>0)openLevelUp()}

// 9.11.2026: jedno losowe zdarzenie w �rodku nocy (nie w krypcie, nie przy bossach, nie w pierwszej nocy)
const NEV={krew:{d:45,mob:1.4,coin:2},mgla:{d:40,fog:.022},lowy:{d:30,coins:40}};
function nightEventTick(dt){if(SOLNE_TEST&&CH===1)return;if(!S.dg&&!S.opening){noteTick();if(S.note)notePickTick()}if(S.dg||S.firstNight||S.opening||pl.dead)return;
  if(S.evAt===undefined){S.evAt=Math.random()<.5?rnd(90,300):rnd(400,620);S.evK=['krew','mgla','lowy'][(Math.random()*3)|0]}
  const ev=S.nev;
  if(!ev){if(S.evDone||S.t<S.evAt||S.stage==='collector'||S.stage==='final'||S.stage==='break'||S.enemies.some(e=>!e.dead&&bossBar(e)))return;startNightEvent(S.evK);return}
  if(ev.t>0){ev.t-=dt;
    if(ev.k==='mgla'){const k=Math.min(1,(NEV.mgla.d-ev.t)/3,ev.t/3);S.evFog=NEV.mgla.fog*Math.max(0,k)}
    if(ev.k==='lowy'){const e=ev.e;if(!e||e.dead){if(e&&e.dead&&!ev.paid){ev.paid=1;awardCoins(NEV.lowy.coins);play('coin',0);padRumble(.4,.3,160);say(EN?'The marked prey falls. The hunt pays well: +'+NEV.lowy.coins+' coins.':'Naznaczona zwierzyna pada. �owy si� op�aci�y: +'+NEV.lowy.coins+' monet.')}ev.t=0}}
    if(ev.t<=0)endNightEvent()}}
function startNightEvent(k){S.evDone=1;const ev=S.nev={k,t:NEV[k].d};
  if(k==='krew'){document.body.classList.add('nb-krew');play('bossGrowl',0);shake(.15,.6);say(EN?'Blood Moon! For 45 seconds more of the dead rise, and every coin counts double.':'Krwawy Ksi��yc! Przez 45 sekund wstaje wi�cej martwych, a ka�da moneta liczy si� podw�jnie.')}
  else if(k==='mgla'){play('rumble',0);say(EN?'A heavy fog rolls in. For a while you will only see what is close.':'Nadci�ga g�sta mg�a. Przez chwil� zobaczysz tylko to, co blisko.')}
  else{const c=S.enemies.filter(e=>!e.dead&&!bossBar(e)&&!e.mini&&e.type!=='wisp'&&e.type!=='bat'&&Math.hypot(e.x-pl.x,e.y-pl.y)<320).sort((a,b)=>b.max-a.max)[0];if(!c){S.nev=null;S.evDone=0;S.evAt=S.t+20;return}
    c.hunt=1;ev.e=c;c.hp*=1.5;c.max*=1.5;play('howl',0);say(EN?'Hunt! One of the dead is marked with a flickering glow. Kill it within 30 seconds for '+NEV.lowy.coins+' coins.':'�owy! Jeden z martwych mieni si� �wiat�em. Zabij go w 30 sekund, a dostaniesz '+NEV.lowy.coins+' monet.')}
  ftInfo(EN?{krew:'Blood Moon',mgla:'Fog',lowy:'Hunt'}[k]:{krew:'Krwawy Ksi��yc',mgla:'Mg�a',lowy:'�owy'}[k])}
function endNightEvent(){const ev=S.nev;if(!ev)return;ev.t=0;if(ev.k==='krew'){document.body.classList.remove('nb-krew');say(EN?'The moon fades back to pale.':'Ksi��yc zn�w blednie.','hint')}if(ev.k==='mgla'){S.evFog=0}if(ev.k==='lowy'&&ev.e&&!ev.e.dead){ev.e.hunt=0;say(EN?'The marked prey slips away into the dark.':'Naznaczona zwierzyna umyka w ciemno��.')}}
{const st=document.createElement('style');st.textContent='#nbKrew{display:none;position:absolute;inset:0;pointer-events:none;z-index:3;}body.nb-krew #nbKrew{display:block;background:radial-gradient(ellipse at center,rgba(150,0,10,0) 55%,rgba(150,0,10,.3) 100%);box-shadow:inset 0 0 90px rgba(170,0,10,.35);animation:nbKrew 3s ease-in-out infinite alternate}@keyframes nbKrew{from{opacity:.75}to{opacity:1}}';document.head.appendChild(st);const d=document.createElement('div');d.id='nbKrew';const host=document.getElementById('msg');(host&&host.parentNode||document.body).appendChild(d)}
// 9.11.2026: zapiski z histori�: jedna nieznaleziona zapiska na noc, le�y przy ognisku lub kapliczce; czyta si� je w Kronice (zak�adka Zapiski)
const NOTES={1:[['modlitewnik','Kartka z modlitewnika','A page from a prayer book','Panie, odwr�� od nas Pi�tno. A je�li musisz kogo� zabra�, we� s�siada, nie moje dzieci. W miejscu imienia zosta� kleks. Kto� pr�bowa� go zetrze�.','Lord, turn the Brand away from us. And if You must take someone, take the neighbour, not my children. An inkblot covers the name. Someone has tried to rub it away.'],
 ['rozkaz14','Rozkaz Zakonu nr 14','Holy Order Edict No. 14','Naznaczonego spali� wraz z domem. Tak samo post�pi� z s�siadami, kt�rzy udzielili mu schronienia. Popi�� zebra� i oznaczy�: d�ug za ogie�, rata pierwsza.','Burn the Branded along with the house. Do the same to any neighbours who gave them shelter. Collect and label the ashes: debt for fire, first instalment.'],
 ['marga','List od Margi','A letter from Marga','Wr�ci�am z wozem. Osady ju� nie ma. Pod kamieniem przy studni zostawiam chleb i n��. Je�li kto� to znajdzie, niech nie ufa dzwonom.','I came back with the cart. The settlement is gone. I\'m leaving bread and a knife under the stone by the well. If anyone finds this, don\'t trust the bells.'],
 ['grabarz','Zapiski grabarza','The gravedigger\'s notes','Trzeci� noc kopi� te same groby. Rano zn�w s� puste. Dzi� us�ysza�em stukanie spod ziemi. Nie czeka�em, �eby sprawdzi�, kto tam jest.','Third night I\'ve dug the same graves. By morning they\'re empty again. Today I heard knocking from beneath the ground. I didn\'t wait to see who it was.'],
 ['rysunek','Rysunek dziecka','A child\'s drawing','Na desce narysowano w�glem dom, s�o�ce i posta� z czerwon� plam� na piersi. Pod spodem krzywe litery: TATA WR�CI JAK ZGA�NIE.','A house, a sun and a figure with a red mark on its chest, drawn in charcoal on a plank. Underneath, in crooked letters: DADDY COMES BACK WHEN IT GOES OUT.']],2:[['zmiana','Ksi�ga zmiany, szyb wschodni','Shift log, east shaft','Dzie� 211. �y�a z�ota jest szersza ni� wczoraj. Brygadzista m�wi, �e to b�ogos�awie�stwo. Dzie� 212. Brygadzista nie wr�ci� z szybu. �y�a zn�w si� poszerzy�a.','Day 211. The gold vein is wider than yesterday. The foreman calls it a blessing. Day 212. The foreman did not return from the shaft. The vein has widened again.'],
 ['runa','Runa na �elaznym klinie','A rune on an iron wedge','Wyryte g��boko w �elazie: Kamie� pami�ta. Przyjdzie po zap�at�.','Cut deep into the iron: The stone remembers. It will come for payment.'],
 ['pokwitowanie','Pokwitowanie poborcy','A collector\'s receipt','Odebrano od klanu �elaznej Bramy: 40 sztab z�ota, 12 g�rnik�w, 1 kr�la. Saldo pozostaje ujemne. Podpis nieczytelny. Piecz�� Zakonu.','Received from the Irongate clan: 40 gold bars, 12 miners, 1 king. Balance remains in deficit. Signature illegible. Seal of the Holy Order.'],
 ['cumlin','S�owa kr�la, spisane przez skryb�','The king\'s words, as written by a scribe','Kr�l kaza� zamkn�� wrota ku�ni od �rodka. Powiedzia�, �e je�li Noc chce z�ota, dostanie je razem z nim. S�yszeli�my jego �miech. Potem ju� nie wiedzieli�my, co s�yszymy.','The king ordered the forge gates barred from within. He said that if the Night wanted gold, it could have him with it. We heard him laughing. After that, we no longer knew what we were hearing.'],
 ['proch','Kartka przy beczce prochu','A note by a powder keg','Nie zapala� przy runach. Nie zapala� przy lawie. Najlepiej nie zapala� wcale. - Bolko','Do not light near the runes. Do not light near the lava. Best not to light it at all. - Bolko']],3:[['kopula','Akt budowy kopu�y','Deed of the dome\'s construction','W fundamentach Kopu�y �wi�tego Kr�la umieszczono trzysta dusz z listy d�u�nik�w. Na marginesie dopisano pro�b� architekta o wpisanie jego nazwiska na list� p�ac, nie na list� ofiar.','Three hundred souls from the debtors\' roll were placed in the foundations of the Saint King\'s Dome. In the margin, the architect asks that his name be entered on the payroll, not the casualty list.'],
 ['uczta','Karta da� z uczty','A feast menu','Ba�anty w miodzie, wino z doliny, z�ote ciasta. Na odwrocie dopisek: Go�cie z dolnych dzielnic nie wr�cili do dom�w. Mi�sa by�o pod dostatkiem.','Pheasants in honey, valley wine, gilded cakes. A note on the back: The guests from the lower quarters did not go home. There was meat in plenty.'],
 ['morhad','Zlecenie dla Morhada','A commission for Morhad','Rze�niku Morhadzie, Rada Miasta poleca ci policzy� wszystkich d�u�nik�w. �adnego nie pomija�. Wynagrodzenie: wieczne.','Morhad the Butcher, the City Council orders you to count all debtors. Leave none out. Remuneration: eternal.'],
 ['praczka','Pami�tnik praczki','A washerwoman\'s diary','Od lat szoruj� te same z�ote p�yty. Krew nie schodzi, tylko zmienia kolor. Dzi� kr�lowa przesz�a obok i powiedzia�a, �e b�yszcz� pi�kniej ni� kiedykolwiek.','For years I\'ve scrubbed these same golden flagstones. The blood won\'t come off, it only changes colour. Today the queen walked past and said they\'d never shone so beautifully.'],
 ['milosny','Zbutwia�y list','A mouldering letter','Czekaj na mnie przy fontannie kr�lowej. Je�li nie przyjd�, to znaczy, �e Zakon zapuka� pierwszy. Przykro mi. Powinienem by� powiedzie� ci o d�ugu wcze�niej.','Wait for me by the queen\'s fountain. If I don\'t come, the Holy Order knocked first. I\'m sorry. I should have told you about the debt sooner.']],4:[['kora','Pro�ba wyryta w korze','A plea carved into bark','Panie Kniei, we� koz�, we� chleb, we� m�j g�os. Tylko wypu�� nas z lasu przed pe�ni�.','Lord of the Wilds, take the goat, take the bread, take my voice. Just let us out of the forest before the full moon.'],
 ['zbieg','Dziennik zbiega','A fugitive\'s journal','Trzeci dzie� idziemy na zach�d. Wczoraj znale�li�my w�asne ognisko, jeszcze ciep�e. Dzi� rano zn�w przy nim stoimy. Nikt nie chce powiedzie� tego na g�os.','Third day heading west. Yesterday we found our own campfire, still warm. This morning we\'re standing beside it again. No one wants to say it aloud.'],
 ['dziady','Rada znachorki','The wise woman\'s advice','Na Dziady zostaw misk� kaszy dla zmar�ych i nie ogl�daj si� za siebie. Je�li rano b�dzie pusta, do��� jeszcze troch�.','On Forefathers\' Eve, leave a bowl of groats for the dead and don\'t look back. If it\'s empty in the morning, put out a little more.'],
 ['kolysanka','Ko�ysanka z obozu','A lullaby from the camp','Matka �pi w kurhanie, matka �pi pod mchem. Kto j� zbudzi p�aczem, ten zostanie z ni� na dnie.','Mother sleeps within the barrow, mother sleeps beneath the moss. Whoever wakes her with their crying stays with her below.'],
 ['jagna','Notatka Jagny','Jagna\'s note','Wilki przysz�y same i nie odchodz�. S�uchaj� mnie lepiej ni� ludzie. Boj� si� dnia, w kt�rym to ja zaczn� s�ucha� ich.','The wolves came of their own accord and they won\'t leave. They listen to me better than people do. I dread the day I start listening to them.']],5:[['rejestr','Strona z Rejestru D�ug�w','A page from the Ledger of Debts','Pozycja 1: Osada, ogie�. Pozycja 2: Dolne Miasto, kamie�. Pozycja 3: Z�otogr�d, krew. Pozycja 4: Czarnob�r, �ycie. Pozycja 5: Naznaczony, pozosta�a nale�no��.','Item 1: the Settlement, fire. Item 2: the Lower City, stone. Item 3: Goldheim, blood. Item 4: Blackwood, life. Item 5: the Branded, the outstanding balance.'],
 ['regulamin','Regulamin kancelarii','Chancery regulations','Skryba, kt�ry pomyli si� w rachunku, zostanie do niego dopisany. Atrament wydaje si� wed�ug przydzia�u. Krew wed�ug potrzeby.','A scribe who makes an error in an account shall be added to it. Ink is issued by allocation. Blood, as required.'],
 ['umorzenie','Pro�ba o umorzenie','A petition for remission','Szanowny Wierzycielu, prosz� o odroczenie sp�aty o jedno pokolenie. Na marginesie odpowied�: Odrzucono. Naliczy� odsetki.','Esteemed Creditor, I beg leave to defer repayment by one generation. Reply in the margin: Denied. Apply interest.'],
 ['kat','Notatka kata','An executioner\'s note','Dzi� po raz trzeci �ci��em tego samego cz�owieka. Arcys�dzia m�wi, �e d�ug nie umiera, wi�c d�u�nik te� nie mo�e. Prosz� o przeniesienie do kuchni.','Today I beheaded the same man for the third time. The Arch-Judge says a debt does not die, so neither may the debtor. Requesting transfer to the kitchens.'],
 ['ostatnia','Ostatnia stronica','The last page','Je�li Pi�tno zga�nie, rejestr sp�onie. Je�li rejestr sp�onie, Noc nie b�dzie mia�a czego liczy�. Zakon nie zapisa�, co wtedy stanie si� z nami.','If the Brand goes out, the ledger will burn. If the ledger burns, the Night will have nothing left to count. The Holy Order never wrote down what becomes of us then.']]};
const NOTE_ALL=Object.entries(NOTES).flatMap(([ch,l])=>l.map(r=>({id:r[0],ch:+ch,t:EN?r[2]:r[1],d:EN?r[4]:r[3]})));
let NOTE_TEX=null,NOTE_MESH=null;
function clearNoteMesh(){if(NOTE_MESH){scene.remove(NOTE_MESH);NOTE_MESH.geometry.dispose();NOTE_MESH.material.dispose();NOTE_MESH=null}}
function noteTex(){if(NOTE_TEX)return NOTE_TEX;const c=canvas(48,48),g=c.getContext('2d');const gr=g.createRadialGradient(24,26,2,24,26,23);gr.addColorStop(0,'rgba(255,214,140,.55)');gr.addColorStop(1,'rgba(255,214,140,0)');g.fillStyle=gr;g.fillRect(0,0,48,48);
 g.fillStyle='#e8d6ae';g.fillRect(13,14,22,20);g.fillStyle='#c9b285';g.fillRect(11,12,26,4);g.fillRect(11,32,26,4);g.fillStyle='#8a6a3a';g.fillRect(11,15,26,1);g.fillRect(11,31,26,1);g.fillStyle='#6a4a2a';for(let i=0;i<4;i++)g.fillRect(16,19+i*3,i===3?9:16,1);g.fillStyle='#a31618';g.fillRect(29,26,4,4);
 const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;NOTE_TEX=t;return t}
function noteTick(){if(S.noteInit||S.train||S.dg||!W||!(CH>=1&&CH<=5))return;S.noteInit=1;clearNoteMesh();const l=NOTE_ALL.filter(n=>n.ch===CH&&!(META.notes||{})[n.id]);if(!l.length)return;const n=l[0];
 const anchors=[...(W.PROPS||[]).filter(p=>p.fire).map(p=>[p.x*TS,p.y*TS]),...(SHRINES||[]).map(s=>[s.x,s.y])].filter(([x,y])=>Math.hypot(x-pl.x,y-pl.y)>260);if(!anchors.length)return;
 for(let k=0;k<30;k++){const a=anchors[(Math.random()*anchors.length)|0],an=Math.random()*6.283,d=rnd(26,44),x=a[0]+Math.cos(an)*d,y=a[1]+Math.sin(an)*d*.8;if(x<20||y<20||x>WW-20||y>WH-20||boxSolid(x,y,5,4))continue;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshBasicMaterial({map:noteTex(),transparent:true,depthWrite:false,fog:false}));m.position.set(x/TS,.55,y/TS);m.scale.set(1,SQ,1);m.renderOrder=2;scene.add(m);NOTE_MESH=m;S.note={...n,x,y,m};return}}
function notePickTick(){const n=S.note;if(!n||n.got)return;n.m.position.y=.55+Math.sin(clock*2.4)*.08;const near=[pl,pl2].some(p=>p&&!p.dead&&Math.hypot(p.x-n.x,p.y-n.y)<20);if(!near)return;
 n.got=1;clearNoteMesh();(META.notes||(META.notes={}))[n.id]=1;try{saveMeta()}catch(e){}play('note',0);padRumble(.25,.35,140);ftInfo(EN?'Note found':'Znaleziono zapisk�');say(EN?`You found a note: "${n.t}". Read it in the Chronicle.`:`Znalaz�e� zapisk�: "${n.t}". Przeczytasz j� w Kronice.`)}
