const path=require('path'),http=require('http'),fs=require('fs');
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const root='/tmp/gaud',OUT='/tmp/aud/';
const mt={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png'};
const srv=http.createServer((q,r)=>{let p=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(p.endsWith('/'))p+='index.html';fs.readFile(p,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':mt[path.extname(p)]||'application/octet-stream'});r.end(d)})}).listen(0,async()=>{
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const ctx=await b.newContext({viewport:{width:1280,height:720},serviceWorkers:'block'});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=cb=>raf(t=>{if(window.__FRZ&&cb.name==='frame'){setTimeout(()=>window.requestAnimationFrame(cb),150);return}cb(t)});localStorage.setItem('pn_lang','pl');localStorage.setItem('pn_story','0');localStorage.setItem('pn_hints','0')});
await p.goto('http://localhost:'+srv.address().port+'/index.html?menufx=0');await p.waitForFunction(()=>window.__U&&!document.getElementById('title').hidden,null,{timeout:180000});await p.waitForTimeout(3000);await p.evaluate(()=>{window.__FRZ=true});
await p.evaluate(()=>{document.documentElement.classList.add('padprio');document.body.classList.add('padlast','padnav');__U.padHoverRewrite()});
const rec=[];let n=0;
const audit=async(id,label)=>{await p.evaluate(()=>{document.documentElement.classList.add('padprio');document.body.classList.add('padlast','padnav');__U.padHoverRewrite()});await p.waitForTimeout(700);
 const list=await p.evaluate(id=>{document.querySelectorAll('[data-audi]').forEach(e=>e.removeAttribute('data-audi'));const its=__U.padItems(document.getElementById(id)),seen={},o=[];its.forEach((e,i)=>{const sig=e.tagName+'|'+e.className.replace(/\b(on|pf|chosen|selected[-\w]*|premium-selected|sel)\b/g,'').trim()+'|'+(e.parentElement&&e.parentElement.className);seen[sig]=(seen[sig]||0)+1;if(seen[sig]<=2){e.dataset.audi=i;const r=e.getBoundingClientRect();o.push({i,txt:(e.id?'#'+e.id+' ':'')+e.textContent.trim().replace(/\s+/g,' ').slice(0,30),r:[r.left,r.top,r.width,r.height],vis:r.top<innerHeight&&r.bottom>0})}});return o},id);
 for(const it of list){if(!it.vis){rec.push({label,txt:it.txt,res:'poza ekranem'});continue}
  const [x,y,w,h]=it.r,clip={x:Math.max(0,x-8),y:Math.max(0,y-8),width:Math.min(1280-Math.max(0,x-8),w+16),height:Math.min(720-Math.max(0,y-8),h+16)};if(clip.width<4||clip.height<4)continue;
  await p.evaluate(()=>{document.querySelectorAll('.pf').forEach(e=>e.classList.remove('pf'));document.activeElement&&document.activeElement.blur&&document.activeElement.blur()});await p.waitForTimeout(220);
  const f1=OUT+(++n)+'a.png';await p.screenshot({path:f1,clip});
  await p.evaluate(([id,i])=>{const e=document.getElementById(id).querySelector('[data-audi="'+i+'"]');__U.PAD.menu=id;e.focus({preventScroll:true});__U.padMark()},[id,it.i]);await p.waitForTimeout(300);
  const f2=OUT+n+'b.png';await p.screenshot({path:f2,clip});rec.push({label,txt:it.txt,a:f1,b:f2})}
 await p.screenshot({path:OUT+'ekran_'+label+'.png'});};
const tab=async(sel,i)=>p.evaluate(([s,i])=>{const t=[...document.querySelectorAll(s)].filter(t=>t.offsetParent);t[i]&&t[i].click()},[sel,i]);
const show=async f=>{await p.evaluate(f);await p.waitForTimeout(1200)};
const hideAll=()=>p.evaluate(()=>{for(const o of document.querySelectorAll('.overlay'))if(o.id!=='title')o.hidden=true;document.getElementById('title').hidden=false});
await audit('title','menu');
await show(()=>document.querySelector('.premium-journey').click());await audit('title','rozdzialy');
await show(()=>document.getElementById('premiumPrepare').click());for(let i=0;i<3;i++){await tab('#prep .pc-prep-tab',i);await audit('prep','przyg'+i)}
await hideAll();await show(()=>document.getElementById('kapBtn').click());for(let i=0;i<3;i++){await tab('#kapTabs .tab',i);await audit('kap','kaplica'+i)}
await hideAll();await show(()=>document.getElementById('kronBtn').click());for(let i=0;i<6;i++){await tab('#kap .tabs .tab,#kapTabs .tab',i);await audit('kap','kronika'+i)}
await hideAll();await show(()=>document.getElementById('optsBtn').click());for(let i=0;i<5;i++){await tab('#opts .tabs .tab',i);await audit('opts','opcje'+i)}
await tab('#opts .tabs .tab',0);for(let i=1;i<3;i++){await tab('#opts .subtabs .stab',i);await audit('opts','sterowanie'+i)}
await hideAll();await show(()=>document.getElementById('manBtn').click());await audit('manual','instrukcja');
await hideAll();
// gra: start, pauza, awans, sklep
await p.evaluate(()=>{window.__FRZ=false});await show(()=>{__U.openPrep(1)});await show(()=>document.getElementById('prepGo').click());
await p.waitForFunction(()=>__U.S&&__U.S.phase==='play',null,{timeout:240000}).catch(()=>{});await p.waitForTimeout(5000);
for(let k=0;k<5&&await p.evaluate(()=>!!(__U.S&&__U.S.intro));k++){await p.keyboard.press('Escape');await p.waitForTimeout(2500)}
await p.evaluate(()=>{__U.pl.inv=9999});
await show(()=>__U.togglePause(true));await p.evaluate(()=>{window.__FRZ=true});
for(let i=0;i<6;i++){await tab('#pause .nbp-tab',i);await audit('pause','pauza'+i)}
// audio w pauzie: prawo na suwaku muzyki
await tab('#pause .nbp-tab',2);await p.waitForTimeout(800);
const aud=await p.evaluate(()=>{const s=[...document.querySelectorAll('#pause input[type=range]')].find(x=>x.offsetParent!==null);if(!s)return 'brak suwaka';s.focus();const v0=s.value;__U.PAD.cur=[];__U.PAD.cur[15]=true;__U.PAD.navD=0;__U.PAD.nav=0;__U.PAD.grab=null;__U.padNav('pause',.016,()=>false,{axes:[0,0,0,0]});__U.PAD.cur=[];return {id:s.id||s.className,v0,v1:s.value,active:document.activeElement===s}});
console.log('AUDIO',JSON.stringify(aud));
await show(()=>__U.togglePause(false));
await show(()=>{__U.S.pendLv=(__U.S.pendLv||0)+1;__U.openLevelUpNow()});await p.waitForTimeout(1500);await audit('lvl','awans');
await p.evaluate(()=>{const c=document.getElementById('card0');c&&c.click()});await p.waitForTimeout(1500);
await show(()=>{try{__U.openShop()}catch(e){}});await audit('shop','sklep');
fs.writeFileSync(OUT+'rec.json',JSON.stringify(rec));console.log('items',rec.length,'bledy',JSON.stringify(errs.slice(0,5)));await b.close();srv.close()});
