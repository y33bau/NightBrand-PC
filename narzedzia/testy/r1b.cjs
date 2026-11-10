const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const errs=[];
 for(const [W,H,tag] of [[1280,720,'d'],[844,390,'m']]){const p=await b.newPage({viewport:{width:W,height:H}});p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{try{localStorage.setItem('pn_lang','pl');localStorage.setItem('pn_meta',JSON.stringify({v:1,sn:{},kr:{krew1:1},kills:{possessed:57,zombie:12},wk:{}}))}catch(e){}});
  await p.goto('http://127.0.0.1:8819/index.html',{timeout:120000});await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(2000);
  console.log(tag,'pos kronBtn:',await p.evaluate(()=>getComputedStyle(document.getElementById('kronBtn')).position));
  await p.screenshot({path:`/home/claude/narz/r1b_menu_${tag}.png`,timeout:180000});
  await p.evaluate(()=>document.getElementById('kronBtn').click());await p.waitForTimeout(800);await p.evaluate(()=>document.querySelectorAll('#kapTabs .tab')[3].click());await p.waitForTimeout(1200);
  console.log(tag,'pos row:',await p.evaluate(()=>getComputedStyle(document.querySelector('#kapList .m2k-row')).position));
  await p.screenshot({path:`/home/claude/narz/r1b_kron_${tag}.png`,timeout:180000});await p.close()}
 console.log('errs',JSON.stringify(errs));await b.close()})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
