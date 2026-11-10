const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const errs=[];
 const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>errs.push(e.message));const T=s=>p.evaluate(s=>__t(s),s);
 await p.addInitScript(()=>{try{localStorage.setItem('pn_lang','pl')}catch(e){}});
 await p.goto('http://127.0.0.1:8819/index.html',{timeout:120000});await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(1500);
 // --- klawisze
 await p.evaluate(()=>document.getElementById('optsBtn').click());await p.waitForTimeout(700);
 console.log('kbBind w DOM:',await p.evaluate(()=>!!document.getElementById('kbBind')),'widoczny:',await p.locator('#kbBind .kbb').first().isVisible());
 await p.locator('#kbBind').scrollIntoViewIfNeeded();await p.screenshot({path:'/home/claude/narz/r3_keys.png',timeout:180000});
 await p.evaluate(()=>document.querySelector('#kbBind .kbb[data-a="atk"]').click());await p.waitForTimeout(200);
 console.log('czeka:',await p.evaluate(()=>document.querySelector('#kbBind .kbb[data-a="atk"]').textContent));
 await p.keyboard.press('u');await p.waitForTimeout(200);console.log('atk=',await T('KB.map.atk'),'przycisk:',await p.evaluate(()=>document.querySelector('#kbBind .kbb[data-a="atk"]').textContent),'opcje nadal otwarte:',await p.evaluate(()=>!document.getElementById('opts').hidden));
 await p.evaluate(()=>document.querySelector('#kbBind .kbb[data-a="blk"]').click());await p.keyboard.press('u');await p.waitForTimeout(200);console.log('zamiana: blk=',await T('KB.map.blk'),'atk=',await T('KB.map.atk'));
 await p.evaluate(()=>document.querySelector('#kbBind .kbb[data-a="roll"]').click());await p.keyboard.press('Escape');await p.waitForTimeout(200);console.log('Esc anuluje: roll=',JSON.stringify(await T('KB.map.roll')),'opcje otwarte:',await p.evaluate(()=>!document.getElementById('opts').hidden));
 await p.evaluate(()=>document.querySelector('#kbBind .kbb[data-a="s1"]').click());await p.keyboard.press('1');await p.waitForTimeout(200);console.log('cyfra odrzucona: s1=',await T('KB.map.s1'));
 await p.evaluate(()=>document.querySelector('#kbBind .kbb[data-a="s1"]').click());await p.keyboard.press('z');await p.waitForTimeout(200);
 console.log('zapis:',await p.evaluate(()=>localStorage.getItem('pn_keys')));
 await p.reload();await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(1500);console.log('po przeladowaniu:',await T('JSON.stringify([KB.map.atk,KB.map.blk,KB.map.s1])'));
 // --- plac cwiczen
 const k0=await T('META.kills.possessed||0');
 await p.evaluate(()=>document.getElementById('manBtn').click());await p.waitForTimeout(800);await p.screenshot({path:'/home/claude/narz/r3_man.png',timeout:180000});
 await p.evaluate(()=>document.getElementById('trainBtn').click());
 await p.waitForFunction(()=>{try{return __t("!!S&&S.phase==='play'")}catch(e){return false}},null,{timeout:240000});await p.waitForTimeout(9000);
 console.log('trening: train=',await T('S.train'),'intro=',await T('!!S.intro'),'dialog=',await T('!!S.dialog'),'notice=',await T('!!S.notice'),'wrogowie=',await T('S.enemies.filter(e=>!e.dead).length'),'S.t=',await T('S.t'),'tut=',await T('S.firstNight'),'note=',await T('!!S.note'));
 await T("S.notice=null;S.dialog=null;S.intro=false;0");
 // klawisze w grze: blk='u' (po zamianie), atk='l', s1='z'
 await p.keyboard.down('u');await p.waitForTimeout(300);const a=await T('JSON.stringify([!!keys.l,!!keys.j,!!keys.u])');await p.keyboard.up('u');await p.keyboard.down('j');await p.waitForTimeout(300);const c=await T('JSON.stringify([!!keys.l,!!keys.j])');await p.keyboard.up('j');await p.keyboard.down('l');await p.waitForTimeout(300);const d=await T('JSON.stringify([!!keys.l,!!keys.j])');await p.keyboard.up('l');await p.waitForTimeout(200);
 console.log('w grze: u->[blok,cios,u]',a,' j(stary)->',c,' l->[blok,cios]',d,' po puszczeniu',await T('JSON.stringify([!!keys.l,!!keys.j])'));
 console.log('etykiety slotow HUD:',await p.evaluate(()=>[...document.querySelectorAll('#activeSkillHud button')].map(x=>x.textContent.trim().slice(0,6)).join('|')));
 console.log('smierc:',await T("(()=>{pl.inv=0;hurtPlayer(99999,1,0);return 'hp='+pl.hp+' dead='+pl.dead})()"));await p.waitForTimeout(2500);console.log('regen hp=',await T('Math.round(pl.hp)'),'S.t=',await T('S.t'),'wrogowie=',await T('S.enemies.filter(e=>!e.dead).length'));
 await T("for(const e of S.enemies.slice())trnKill(e);0");await p.waitForTimeout(500);console.log('META.kills.possessed przed/po:',k0,await T('META.kills.possessed||0'),'kills w nocy=',await T('S.kills'));
 await T("togglePause(true);0");await p.waitForTimeout(700);console.log('trainBox widoczny:',await p.locator('#trainBox').isVisible().catch(()=>false),'opcje wrogow:',await p.evaluate(()=>{const s=document.getElementById('trainType');return s?s.options.length:-1}));
 await p.screenshot({path:'/home/claude/narz/r3_pause.png',timeout:180000});
 if(await p.locator('#trainSpawn').isVisible().catch(()=>false)){await p.evaluate(()=>document.getElementById('trainSpawn').click());await p.waitForTimeout(1500);console.log('po Przywolaj: paused=',await T('!!S.paused'),'wrogowie=',await T('S.enemies.filter(e=>!e.dead).length'))}
 await p.screenshot({path:'/home/claude/narz/r3_train.png',timeout:180000});
 await T("toMenu();0");await p.waitForTimeout(1000);console.log('po wyjsciu: title=',await p.evaluate(()=>!document.getElementById('title').hidden),'trainBox=',await p.evaluate(()=>!!document.getElementById('trainBox')));
 // zwykla noc po treningu
 await T('openPrep(1)');await p.waitForSelector('#prepGo',{state:'visible',timeout:180000});await p.evaluate(()=>document.getElementById('prepGo').click());await p.waitForTimeout(6000);await T("try{introEnd()}catch(e){};S.intro=false;S.notice=null;S.dialog=null;0");await p.waitForTimeout(6000);
 console.log('zwykla noc: train=',await T('S.train'),'S.t=',await T('Math.round(S.t*10)/10'));
 console.log('errs',JSON.stringify(errs));await b.close()})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
