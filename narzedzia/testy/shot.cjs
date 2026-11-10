// node shot.cjs OUT CH "js po starcie" [W H] : zrzuty OUT_a.png (po 6 s) ; drukuje wynik js
const {chromium}=require('playwright');
const [,,OUT,CH,JS,W,H]=process.argv;
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const errs=[];
 const p=await b.newPage({viewport:{width:+(W||1280),height:+(H||720)}});p.on('pageerror',e=>errs.push(e.message));const T=s=>p.evaluate(s=>__t(s),s);
 await p.addInitScript(()=>{try{localStorage.setItem('pn_lang','pl');localStorage.setItem('pn_story','0');localStorage.setItem('pn_hints','0')}catch(e){}});
 await p.goto('http://127.0.0.1:'+(process.env.PORT||8819)+'/index.html',{timeout:120000});await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(800);
 await T('openPrep('+CH+')');await p.waitForSelector('#prepGo',{state:'visible',timeout:400000});await p.evaluate(()=>document.getElementById('prepGo').click());
 await p.waitForFunction(()=>{try{return __t("!!S&&S.phase==='play'")}catch(e){return false}},null,{timeout:400000});await p.waitForTimeout(+CH>=4?15000:6000);
 await T("try{introEnd()}catch(e){};S.intro=false;S.notice=null;S.noticeQueue=[];S.dialog=null;S.firstNight=false;S.train=true;pl.inv=1e9;for(const e of S.enemies)e.dead=true;0");
 for(const [i,js] of (JS||'0').split('@@').entries()){console.log('js',i,String(await T(js)).slice(0,400));await p.waitForTimeout(5000);await p.evaluate(()=>{for(const id of ['notice','msg','hud','activeSkillHud'])try{const e=document.getElementById(id);if(e)e.style.visibility='hidden'}catch(e){}});await p.screenshot({path:`/home/claude/narz/${OUT}_${i}.png`,timeout:180000})}
 console.log('errs',JSON.stringify(errs));await b.close()})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
