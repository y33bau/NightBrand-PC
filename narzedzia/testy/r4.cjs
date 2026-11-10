const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const errs=[];
 for(const c of ['r','k','z']){const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));const T=s=>p.evaluate(s=>__t(s),s);
  await p.addInitScript(()=>{try{localStorage.setItem('pn_lang','pl');localStorage.setItem('pn_story','0')}catch(e){}});
  await p.goto('http://127.0.0.1:8819/index.html',{timeout:120000});await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(1000);
  await T("(()=>{const q=prog();q.char='"+c+"';q.sel=[];try{saveProg(q)}catch(e){};return 0})()").catch(e=>console.log('prog',e.message));
  await T('openPrep(1)');await p.waitForSelector('#prepGo',{state:'visible',timeout:180000});await p.evaluate(()=>document.getElementById('prepGo').click());await p.waitForTimeout(5000);
  await T("try{introEnd()}catch(e){};S.intro=false;S.notice=null;0");
  console.log(c,'klasa=',await T('charId()'),'bez riposty: ladowanie=',await T('(()=>{pl.riposte=0;return hvCharge()})()'),'zamach=',await T("(()=>{pl.riposte=0;pl.atk=null;pl.sta=999;startAttack('h');const t=pl.atk&&pl.atk.t;pl.atk=null;return t})()"),'| z riposta: ladowanie=',await T('(()=>{pl.riposte=1;return hvCharge()})()'),'zamach=',await T("(()=>{pl.riposte=1;pl.atk=null;pl.sta=999;startAttack('h');const t=pl.atk&&pl.atk.t;pl.atk=null;return t})()"),'inv=',await T('(()=>{pl.inv=0;onParry();return pl.inv})()'));await p.close()}
 console.log('errs',JSON.stringify(errs));await b.close()})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
