const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const errs=[];
const ctx=await b.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1});const p=await ctx.newPage();
p.on('pageerror',e=>errs.push('PE '+e.message.slice(0,150)));p.on('console',m=>{if(m.type()==='error')errs.push('CE '+m.text().slice(0,300))});
await p.addInitScript(()=>{try{localStorage.setItem('pn_story','0');localStorage.setItem('pn_lang','pl')}catch(e){}});
await p.goto('http://127.0.0.1:8819/index.html',{timeout:120000});await p.waitForSelector('#start1',{state:'visible',timeout:240000});await p.waitForTimeout(800);
await p.evaluate(()=>__t('openPrep(1)'));await p.waitForSelector('#prepGo',{state:'visible',timeout:180000});
await p.evaluate(()=>document.getElementById('prepGo').click());await p.waitForTimeout(4000);
await p.evaluate(()=>__t("S.opening=0;S.notice=0;S.train=1;S.enemies.length=0;"));
const frames=[];
for(const [fire,name] of [[0,'n'],[3,'f']]){
 await p.evaluate(()=>__t(`(()=>{pl.hp=pl.max;S.enemies.length=0;window.__e=spawnEnemy('possessed',pl.x+34,pl.y+2,{rise:0})})()`));await p.waitForTimeout(700);
 await p.evaluate((fire)=>__t(`(()=>{const e=window.__e;e.burn=${fire};e.hp=0;killEnemy(e,1,0);const c=S.corpses[S.corpses.length-1];c._t=0;Object.defineProperty(c,'t',{get(){return this._t},set(v){}})})()`),fire);
 for(const t of [.2,.45,.7,.95]){
  await p.evaluate((t)=>__t(`(()=>{const c=S.corpses[S.corpses.length-1];if(c)c._t=${t}})()`),t);
  await p.waitForTimeout(250);
  const info=await p.evaluate(()=>__t("(()=>{const c=S.corpses[S.corpses.length-1];return c?[c.mesh.visible,c.mesh.parent?1:0,c.mesh.material.type,c.mesh.material.opacity,+c.t.toFixed(2),!!c.am,c.am?+c.am.userData.U.value.toFixed(2):null,S.parts.length]:null})()"));
  console.log(name,t,JSON.stringify(info));
  await p.screenshot({path:`/home/claude/narz/ash_${name}_${t}.png`,clip:{x:440,y:180,width:400,height:300}});
 }
 await p.waitForTimeout(1500);
}
console.log('errs',JSON.stringify(errs.slice(0,4)));await b.close()})();
