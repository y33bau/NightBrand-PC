const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const errs=[];
 for(const [W,H,tag,touch] of [[1280,720,'d',false],[844,390,'m',true]]){const ctx=await b.newContext({viewport:{width:W,height:H},hasTouch:touch});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));const T=s=>p.evaluate(s=>__t(s),s);
  await p.addInitScript(t=>{try{localStorage.setItem('pn_lang','pl');if(t)localStorage.setItem('pn_touch','1');localStorage.setItem('pn_keys',JSON.stringify({s1:'z'}))}catch(e){}},touch);
  await p.goto('http://127.0.0.1:8819/index.html',{timeout:120000});await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(1500);
  await p.evaluate(()=>document.getElementById('manBtn').click());await p.waitForTimeout(800);console.log(tag,'trainBtn widoczny:',await p.locator('#trainBtn').isVisible(),'zakladki:',await p.evaluate(()=>document.getElementById('manTabs').children.length));await p.screenshot({path:`/home/claude/narz/r3b_man_${tag}.png`,timeout:180000});
  await p.locator('#trainBtn').click();await p.waitForFunction(()=>{try{return __t("!!S&&S.phase==='play'")}catch(e){return false}},null,{timeout:240000});await p.waitForTimeout(7000);
  console.log(tag,'train=',await T('S.train'),'wrogowie=',await T('S.enemies.filter(e=>!e.dead).length'));await p.screenshot({path:`/home/claude/narz/r3b_play_${tag}.png`,timeout:180000});
  await T("S.notice=null;togglePause(true);0");await p.waitForTimeout(700);console.log(tag,'slot1:',await p.evaluate(()=>{const e=document.querySelector('#skillLoadout button');return e?e.textContent.trim().slice(0,12):'?'}),'trainBox:',await p.locator('#trainBox').isVisible().catch(()=>false));await p.screenshot({path:`/home/claude/narz/r3b_pause_${tag}.png`,timeout:180000});await ctx.close()}
 console.log('errs',JSON.stringify(errs));await b.close()})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
