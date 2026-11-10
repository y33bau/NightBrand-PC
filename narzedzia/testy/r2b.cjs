const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const errs=[];
 for(const [W,H,tag] of [[1280,720,'d'],[844,390,'m']]){const p=await b.newPage({viewport:{width:W,height:H}});p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{try{localStorage.setItem('pn_lang','pl');localStorage.setItem('pn_story','0')}catch(e){}});
  await p.goto('http://127.0.0.1:8819/index.html',{timeout:120000});await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(1000);
  await p.evaluate(()=>__t('openPrep(1)'));await p.waitForSelector('#prepGo',{state:'visible',timeout:180000});await p.evaluate(()=>document.getElementById('prepGo').click());await p.waitForTimeout(5000);
  await p.evaluate(()=>__t("try{introEnd()}catch(e){};S.intro=false;S.notice=null;S.dsrc={l:300,s:500,r:200};S.dsk={whirl:300,embershot:150,wave:50};S.kills=50;S.t=300;endGame(true)"));await p.waitForTimeout(1500);
  const el=p.locator('.nbs-dk');console.log(tag,await el.textContent(),'widoczny:',await el.isVisible());await el.scrollIntoViewIfNeeded();await p.screenshot({path:`/home/claude/narz/r2b_${tag}.png`,timeout:180000});await p.close()}
 console.log('errs',JSON.stringify(errs));await b.close()})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
