const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const errs=[],cons=[];
 const start=async(p,ch)=>{await p.goto('http://127.0.0.1:8819/index.html',{timeout:120000});await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(1000);
  await p.evaluate(c=>__t('openPrep('+c+')'),ch);await p.waitForSelector('#prepGo',{state:'visible',timeout:300000});await p.evaluate(()=>document.getElementById('prepGo').click());await p.waitForTimeout(ch===1?5000:20000);
  await p.evaluate(()=>__t("try{introEnd()}catch(e){};S.intro=false;S.pendLv=0;S.choosing=false;S.notice=null;S.dialog=null;0"))};
 const T=(p,s)=>p.evaluate(s=>__t(s),s);
 {const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push('1 '+e.message));p.on('console',m=>{if(m.type()==='error'||/shader|WebGL/i.test(m.text()))cons.push(m.text().slice(0,200))});
  await p.addInitScript(()=>{try{localStorage.setItem('pn_lang','pl');localStorage.setItem('pn_story','0')}catch(e){}});await start(p,1);
  // strzalki
  await T(p,"(()=>{for(const e of S.enemies)e.dead=true;const a=spawnEnemy('collector',pl.x+420,pl.y-40);a.rise=0;a.spd=0;a.dmg=0;const b=spawnEnemy('ghoul',pl.x-400,pl.y+30);b.rise=0;b.spd=0;b.dmg=0;b.named=1;b.nmN='Test';const c=spawnEnemy('ghoul',pl.x+60,pl.y+330);c.rise=0;c.spd=0;c.dmg=0;c.hunt=1;const d=spawnEnemy('ghoul',pl.x+30,pl.y+10);d.rise=0;d.spd=0;d.dmg=0;d.named=1;window.__d=d;S.spawnT=999;return 0})()");
  await p.waitForTimeout(1500);
  console.log('strzalki widoczne:',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('#nbEdge>div')].filter(x=>x.style.display!=='none').map(x=>x.textContent+'@'+Math.round(parseFloat(x.style.left))+','+Math.round(parseFloat(x.style.top))))));
  await p.screenshot({path:'/home/claude/narz/r2_edge.png',timeout:180000});
  await T(p,"togglePause(true);0");await p.waitForTimeout(600);console.log('w pauzie ukryte:',await p.evaluate(()=>document.getElementById('nbEdge').style.display));await T(p,"togglePause(false);0");
  // umiejetnosci: prawdziwe uzycie
  for(const set of [['whirl','aard','embershot','cascade'],['frostshot','earthcut','stoneguard','drugieja']]){
   await T(p,"(()=>{for(const e of S.enemies)e.dead=true;S.enemies.length=0;const set="+JSON.stringify(set)+";for(const k of set)S.sk[k]=1;S.activeSlots=set.slice();S.dsk=null;S.dsrc=null;for(let i=0;i<3;i++){const e=spawnEnemy('ghoul',pl.x+22+i*6,pl.y+(i-1)*10);e.rise=0;e.spd=0;e.dmg=0;e.hold=1;e.hp=e.max=99999}pl.dx=1;pl.dy=0;pl.fx=1;pl.fy=0;return 0})()");
   for(let i=0;i<4;i++){const r=await T(p,"(()=>{pl.mana=999;pl.sta=999;for(const k in S)if(/Cd$/.test(k)&&typeof S[k]==='number')S[k]=0;pl.atk=null;S.combatT=0;let r;try{r=activateSlot("+i+")}catch(e){r='ERR '+e.message}return String(r)})()");await p.waitForTimeout(3500);if(set[i]==='drugieja'){await T(p,"(()=>{try{startAttack('l')}catch(e){};return 0})()");await p.waitForTimeout(2500)}console.log(' ',set[i],'aktywacja=',r,'dsk=',await T(p,'JSON.stringify(S.dsk)'))}
   await p.waitForTimeout(3000);console.log('zestaw',set.join(','),'=>',await T(p,'JSON.stringify(S.dsk)'),await T(p,'JSON.stringify(S.dsrc)'))}
  await T(p,'S.kills=50;S.t=300;endGame(true)');await p.waitForTimeout(1500);await p.screenshot({path:'/home/claude/narz/r2_end.png',timeout:180000});
  console.log('linia umiejetnosci:',await p.evaluate(()=>[...document.querySelectorAll('.nbs-sub')].map(x=>x.textContent).join(' | ')));await p.close()}
 {const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push('2 '+e.message));p.on('console',m=>{if(m.type()==='error'||/shader|WebGL/i.test(m.text()))cons.push('ch2 '+m.text().slice(0,200))});
  await p.addInitScript(()=>{try{localStorage.setItem('pn_lang','pl');localStorage.setItem('pn_story','0');localStorage.setItem('pn_access',JSON.stringify({qmode:'high'}))}catch(e){}});await start(p,2);
  console.log('ch2: CH=',await T(p,'CH'),'haze=',await T(p,'postMat.uniforms.haze.value'),'quality=',await T(p,'SETT.quality'),'phase=',await T(p,'S.phase'));
  // znajdz lawe i stan obok
  console.log('lawa:',await T(p,"(()=>{let best=null,bd=1e9;for(let y=2;y<MH-2;y++)for(let x=2;x<MW-2;x++)if(tileAt(x,y)===24){const d=Math.hypot(x*16-pl.x,y*16-pl.y);if(d<bd){bd=d;best=[x,y]}}if(!best)return 'brak';for(const e of S.enemies)e.dead=true;S.spawnT=999;pl.x=best[0]*16+8;pl.y=best[1]*16+56;pl.inv=999;return JSON.stringify(best)+' d='+Math.round(bd)})()"));
  await p.waitForTimeout(6000);await p.screenshot({path:'/home/claude/narz/r2_haze_a.png',timeout:180000});await p.waitForTimeout(1500);await p.screenshot({path:'/home/claude/narz/r2_haze_b.png',timeout:180000});
  await T(p,"postMat.uniforms.haze.value=0;SETT.quality='low';0");await p.waitForTimeout(1500);console.log('niska jakosc haze=',await T(p,'postMat.uniforms.haze.value'));await p.close()}
 console.log('konsola',JSON.stringify(cons.slice(0,6)));console.log('errs',JSON.stringify(errs));await b.close()})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
