const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const errs=[];
 // A: stary zapis bez sn -> 0 nowych
 {const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push('A '+e.message));
  await p.addInitScript(()=>{try{localStorage.setItem('pn_lang','pl');if(!localStorage.getItem('pn_meta'))localStorage.setItem('pn_meta',JSON.stringify({v:1,kr:{krew1:1,akt1:1},kills:{possessed:57,zombie:12},notes:{},wk:{}}))}catch(e){}});
  await p.goto('http://127.0.0.1:8819/index.html',{timeout:120000});await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(2000);
  console.log('A stary zapis: nowe=',await p.evaluate(()=>__t('kronNew().length')),'znaczek=',await p.evaluate(()=>{const d=document.querySelector('#kronBtn .nbk-new');return d?d.textContent:'brak'}));
  // odblokuj dwa nowe wpisy i sprawdz
  await p.evaluate(()=>__t("META.kills.ghoul=3;META.kr[KRON[2][0]]=1;saveMeta();metaMenu()"));
  console.log('A po odblokowaniu: znaczek=',await p.evaluate(()=>{const d=document.querySelector('#kronBtn .nbk-new');return d?d.textContent:'brak'}),JSON.stringify(await p.evaluate(()=>__t('kronNew()'))));
  await p.screenshot({path:'/home/claude/narz/r1_menu.png',timeout:180000});
  await p.evaluate(()=>document.getElementById('kronBtn').click());await p.waitForTimeout(800);
  console.log('zakladki z kropka:',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('#kapTabs button')].filter(x=>x.querySelector('.nbk-dot')).map(x=>x.textContent))));
  await p.evaluate(()=>document.querySelectorAll('#kapTabs .tab')[1].click());await p.waitForTimeout(600);await p.screenshot({path:'/home/claude/narz/r1_kron1.png',timeout:180000});
  console.log('tab1 wiersze NOWE:',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('#kapList .m2k-row')].map((x,i)=>x.querySelector('.nbk-new')?i:-1).filter(i=>i>=0))));
  await p.evaluate(()=>{const r=[...document.querySelectorAll('#kapList .m2k-row')].find(x=>x.querySelector('.nbk-new'));r&&r.click()});await p.waitForTimeout(500);
  console.log('tab1 po kliknieciu NOWE:',await p.evaluate(()=>document.querySelectorAll('#kapList .nbk-new').length));
  await p.evaluate(()=>document.querySelectorAll('#kapTabs .tab')[3].click());await p.waitForTimeout(900);await p.screenshot({path:'/home/claude/narz/r1_kron3.png',timeout:180000});
  console.log('tab3 wiersze NOWE:',await p.evaluate(()=>document.querySelectorAll('#kapList .nbk-new').length));
  await p.evaluate(()=>document.getElementById('kapBack').click());await p.waitForTimeout(600);
  console.log('po powrocie znaczek=',await p.evaluate(()=>{const d=document.querySelector('#kronBtn .nbk-new');return d?d.textContent:'brak'}));
  await p.reload();await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(1500);
  console.log('po przeladowaniu nowe=',JSON.stringify(await p.evaluate(()=>__t('kronNew()'))));await p.close()}
 // B: noc, zrodla obrazen, pad
 for(const [W,H,tag] of [[1920,1080,'d'],[844,390,'m']]){const p=await b.newPage({viewport:{width:W,height:H}});p.on('pageerror',e=>errs.push('B '+e.message));
  await p.addInitScript(()=>{try{localStorage.setItem('pn_lang','pl');localStorage.setItem('pn_story','0')}catch(e){};window.__pads=[];navigator.getGamepads=()=>window.__pads});
  await p.goto('http://127.0.0.1:8819/index.html',{timeout:120000});await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(1000);
  await p.evaluate(()=>__t('openPrep(1)'));await p.waitForSelector('#prepGo',{state:'visible',timeout:180000});await p.evaluate(()=>document.getElementById('prepGo').click());await p.waitForTimeout(5000);
  await p.evaluate(()=>__t("try{introEnd()}catch(e){};S.intro=false;S.pendLv=0;S.choosing=false;S.notice=null;S.dsrc=null;0"));
  if(tag==='d'){
   const mk=()=>({connected:true,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))});
   await p.evaluate(()=>{const g={connected:true,mapping:'standard',axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};g.buttons[3]={pressed:true,value:1};window.__pads=[g]});await p.waitForTimeout(1500);
   await p.evaluate(()=>{window.__pads[0].buttons[3]={pressed:false,value:0}});await p.waitForTimeout(800);
   console.log('pad: INPUT_LAST=',await p.evaluate(()=>__t('INPUT_LAST')),'paused=',await p.evaluate(()=>__t('S.paused')),'PAD.n=',await p.evaluate(()=>__t('PAD.n')),'stan',await p.evaluate(()=>__t('[S.phase,!!S.notice,!!S.choosing,!!S.dialog,!!S.intro].join()')));
   await p.evaluate(()=>__t("S.notice=null;S.choosing=false;S.dialog=null;if(S.paused)togglePause(false);0"));await p.evaluate(()=>{window.__pads=[]});await p.waitForTimeout(1500);
   console.log('pad rozlaczony: paused=',await p.evaluate(()=>__t('S.paused')),'komunikat=',await p.evaluate(()=>{const n=document.getElementById('padLost');return n?(n.hidden?'ukryty':n.textContent):'brak'}));
   await p.screenshot({path:'/home/claude/narz/r1_pad.png',timeout:180000});
   await p.evaluate(()=>__t("togglePause(false);0"));await p.waitForTimeout(500);
   console.log('po wznowieniu: paused=',await p.evaluate(()=>__t('S.paused')),'komunikat=',await p.evaluate(()=>{const n=document.getElementById('padLost');return n?(n.hidden?'ukryty':'widoczny'):'brak'}));
   await p.waitForTimeout(1200);console.log('bez pada dalej gra: paused=',await p.evaluate(()=>__t('S.paused')));}
  console.log(tag,'zrodla:',await p.evaluate(()=>__t("(()=>{const mk=()=>{const e=spawnEnemy('ghoul',pl.x+30,pl.y+10);e.rise=0;e.hp=e.max=9999;e.inv=0;return e};let e=mk();DSRC='l';damageEnemy(e,300,1,0,0);DSRC='h';damageEnemy(e,200,1,0,0);DSRC='r';damageEnemy(e,250,1,0,0);DSRC='';damageEnemy(e,150,1,0,0);damageEnemy(e,60,0,0,0,'dot');damageEnemy(e,40,1,0,0,'parry');return JSON.stringify(S.dsrc)+' dealt='+S.dealt})()")));
  await p.evaluate(()=>__t('S.kills=213;S.hitsT=14;S.parries=9;S.coins=184;S.lvl=11;S.t=731;S.bigHit=187;S.bestStreak=42;S.eliteN=2;endGame(true)'));await p.waitForTimeout(1500);
  await p.screenshot({path:`/home/claude/narz/r1_end_${tag}.png`,timeout:180000});
  console.log(tag,'wiersze zrodel:',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.nbs-dr')].map(x=>x.textContent))),'przycisk widoczny:',await p.evaluate(()=>{const e=document.querySelector('#end button:not([hidden])');if(!e)return 'brak';const r=e.getBoundingClientRect();return r.bottom<=innerHeight&&r.top>=0}));
  await p.close()}
 console.log('errs',JSON.stringify(errs));await b.close()})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
