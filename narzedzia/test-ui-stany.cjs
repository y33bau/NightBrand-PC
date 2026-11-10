// Development-only visual coverage. No hooks are written to the shipped game.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict'),crypto=require('crypto');
const rt=require('./ui-test-runtime.cjs');
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]),phase=process.argv[4]||'before';
fs.mkdirSync(out,{recursive:true});
const marker='\nrequestAnimationFrame(frame);';
const hook=`\nwindow.UI_TEST={get state(){return S},get player(){return pl},togglePause,openLevelUp,openShop,endGame,toMenu,renderLoadout,renderCards,prog,PERKS,PREP,openPrep,beginRun,padNav,PAD,padMark,hud};requestAnimationFrame(frame);`;
const injected=new Map();
function dataFor(file){let data=fs.readFileSync(file);if(file.endsWith('.js')&&data.includes(Buffer.from('const PREMIUM_ASSETS='))){const s=data.toString();assert.equal(s.split(marker).length-1,1);data=Buffer.from(s.replace(marker,hook));}return data;}
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost');const f=path.resolve(root,'.'+decodeURIComponent(u.pathname==='/'?'/index.html':u.pathname));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(u.pathname==='/favicon.ico'?204:404);res.end();return}let data;if(injected.has(f))data=injected.get(f);else {data=dataFor(f);if(f.endsWith(path.join('assets','manifest.json'))){const m=JSON.parse(data);for(const e of m.files){if(!e.url.endsWith('.js'))continue;const p=path.join(root,e.url),d=dataFor(p);if(!d.equals(fs.readFileSync(p))){e.bytes=d.length;e.sha256=crypto.createHash('sha256').update(d).digest('hex');}}data=Buffer.from(JSON.stringify(m));}injected.set(f,data);}res.setHeader('Content-Type',rt.mime[path.extname(f)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(data);});
const views=[{width:1920,height:1080},{width:1280,height:720},{width:844,height:390}];
const records=[],errors=[],checks=[];
async function settle(p){await p.evaluate(()=>document.fonts.ready);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
async function shot(p,name,lang,v){await p.evaluate(()=>{if(window.UI_TEST?.state)UI_TEST.hud();});await settle(p);const file=`${lang}-${v.width}x${v.height}-${name}.png`;await p.screenshot({path:path.join(out,file)});const measured=await p.evaluate(()=>({w:innerWidth,h:innerHeight,scrollWidth:document.documentElement.scrollWidth,cardReading:[...document.querySelectorAll('#cards .cd,#cards .cd li')].slice(0,2).map(e=>{const c=getComputedStyle(e);return{font:c.fontFamily,size:c.fontSize,lineHeight:c.lineHeight}})}));if(phase==='after'&&name==='awans')assert(measured.cardReading.every(c=>c.font.startsWith('Georgia')),'card bullet font must match reading font');records.push({name,lang,viewport:v,file,measured});}
async function goMenu(p){await p.evaluate(()=>{if(UI_TEST.state)UI_TEST.toMenu();for(const id of ['kap','opts','manual','prep','end','lvl','shop','pause','intro'])document.getElementById(id).hidden=true;document.getElementById('title').hidden=false;});}
async function start(p,cls='r'){
 await goMenu(p);await p.evaluate(c=>{window.__UI_CAPTURE_FREEZE=false;const q=UI_TEST.prog();q.char=c;q.lv=10;q.sel=[];q.ch=null;UI_TEST.openPrep(1);},cls);
 await p.locator('#prepGo').click();await p.waitForFunction(()=>UI_TEST.state&&document.getElementById('prep').hidden,null,{timeout:240000});
 await p.evaluate(()=>{const s=UI_TEST.state;s.intro=false;s.notice=null;s.noticeQueue=[];s.dialog=null;s.banner=null;s.paused=true;document.getElementById('intro').hidden=true;document.getElementById('notice').hidden=true;document.getElementById('dialog').hidden=true;document.getElementById('touch').hidden=true;UI_TEST.hud();});await settle(p);await p.evaluate(()=>{window.__UI_CAPTURE_FREEZE=true;});
}
function padEventSource(){return `({axes:[0,0,0,0],buttons:Array.from({length:18},()=>({pressed:false,value:0})),mapping:'standard',connected:true,index:0,id:'UI test dispatcher'})`;}
async function padCheck(p,id){
 const r=await p.evaluate(({id,gSrc})=>{const t=UI_TEST,root=document.getElementById(id),items=[...root.querySelectorAll('button,input,summary')].filter(e=>!e.disabled&&e.offsetParent!==null);if(!items.length)throw Error('no controls '+id);t.PAD.on=true;t.PAD.menu=id;t.PAD.navD=0;t.PAD.nav=0;document.body.classList.add('padnav');items[0].focus();const g={axes:[0,0,0,0],buttons:Array.from({length:18},()=>({pressed:false,value:0})),mapping:'standard',connected:true,index:0,id:'UI test'};const press=i=>{t.PAD.nav=0;t.PAD.navD=0;t.PAD.cur=[];t.PAD.cur[i]=true;t.padNav(id,.5,n=>n===i,g);t.PAD.cur=[];t.padMark();};for(const i of [13,15,12,14]){press(i);if(!root.contains(document.activeElement)||document.activeElement.disabled)throw Error('focus escaped '+id);}
 const tabs=[...root.querySelectorAll('.tabs .tab')];if(['kap','opts','manual'].includes(id)&&tabs.length>1){tabs[0].click();press(5);if(!root.querySelectorAll('.tabs .tab')[1].classList.contains('on'))throw Error('RB '+id);press(4);if(!root.querySelectorAll('.tabs .tab')[0].classList.contains('on'))throw Error('LB '+id);}
 if(id!=='title'&&id!=='lvl'){press(1);if(!root.hidden)throw Error('B failed '+id);}document.body.classList.remove('padnav');for(const e of document.querySelectorAll('.pf'))e.classList.remove('pf');t.PAD.on=false;return id;},{id,gSrc:padEventSource()});checks.push({check:'simulated_pad_arrows_LB_RB_B',screen:r});
}
(async()=>{let browser;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await rt.dependency('playwright').chromium.launch({headless:true,executablePath:rt.browser(),args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 for(const lang of ['pl','en']){
  const context=await browser.newContext({viewport:views[0],deviceScaleFactor:1,serviceWorkers:'block'});const p=await context.newPage();p.on('pageerror',e=>errors.push({lang,message:e.message}));
  await p.addInitScript(l=>{localStorage.setItem('pn_lang',l);localStorage.setItem('pn_story','0');localStorage.setItem('pn_hints','0');let seed=27319;Math.random=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
   // Screenshot-only optimization: freeze the background game loop, not browser layout or timers.
   // It is released for each real beginRun. The unmodified smoke test runs separately.
   const raf=window.requestAnimationFrame.bind(window);window.requestAnimationFrame=cb=>raf(t=>{if(window.__UI_CAPTURE_FREEZE&&cb.name==='frame'){setTimeout(()=>window.requestAnimationFrame(cb),100);return}cb(t);});
  },lang);
  await p.goto('http://127.0.0.1:'+server.address().port+'/index.html');await p.waitForFunction(()=>window.UI_TEST&&window.NB_GROUPS_READY,null,{timeout:240000});await p.locator('#title').waitFor({state:'visible'});await settle(p);await p.evaluate(()=>{window.__UI_CAPTURE_FREEZE=true;});
  for(const v of views){await p.setViewportSize(v);await goMenu(p);await p.locator('#sArc').click();await p.locator('#start1').click();await shot(p,'menu',lang,v);
   await p.locator('#kapBtn').click();for(let i=0;i<3;i++){await p.locator('#kapTabs .tab').nth(i).click();await shot(p,'kaplica-'+i,lang,v);}if(phase==='after')await padCheck(p,'kap');else await p.locator('#kapBack').click();
   await p.locator('#kronBtn').click();for(let i=0;i<4;i++){await p.locator('#kapTabs .tab').nth(i).click();await shot(p,'kronika-'+i,lang,v);}await p.locator('#kapBack').click();
   await p.locator('#optsBtn').click();for(let i=0;i<5;i++){await p.locator('#opts .tabs .tab').nth(i).click();await shot(p,'opcje-'+i,lang,v);}if(phase==='after')await padCheck(p,'opts');else await p.locator('#optsBack').click();
   await p.locator('#manBtn').click();for(let i=0;i<7;i++){await p.locator('#manual .tabs .tab').nth(i).click();await shot(p,'instrukcja-'+i,lang,v);}if(phase==='after')await padCheck(p,'manual');else await p.locator('#manBack').click();
   for(const [i,cls]of ['r','k','z'].entries()){await p.evaluate(c=>{const q=UI_TEST.prog();q.char=c;q.lv=10;q.sel=[];q.ch=null;UI_TEST.openPrep(1);},cls);await p.locator('#prepChar button').nth(i).click();await shot(p,'przygotowanie-'+cls,lang,v);await p.locator('#prepBack').click();}
   if(phase==='after'){await padCheck(p,'title');await p.evaluate(()=>UI_TEST.openPrep(1));await padCheck(p,'prep');}
   await start(p,'r');await p.evaluate(()=>UI_TEST.togglePause(true));await p.locator('[data-nbp="skills"]').click();await shot(p,'pauza-umiejetnosci',lang,v);await p.locator('[data-nbp="journal"]').click();await shot(p,'pauza-dziennik',lang,v);if(phase==='after')await padCheck(p,'pause');
   await p.evaluate(()=>{UI_TEST.state.paused=true;document.getElementById('pause').hidden=true;UI_TEST.openLevelUp();});await p.locator('#lvl').waitFor({state:'visible'});await p.waitForFunction(()=>!document.getElementById('lvl').classList.contains('choice-wait'));
   await shot(p,'awans',lang,v);
   if(phase==='after'){
    await p.locator('#card0').focus();await p.keyboard.press('ArrowRight');const ok=await p.locator('#lvl').evaluate(e=>e.contains(document.activeElement));assert(ok);checks.push({check:'keyboard_level_focus',lang,viewport:v});
    const styles=await p.evaluate(()=>{const c=getComputedStyle(document.activeElement);return{outline:c.outline,outlineWidth:c.outlineWidth,outlineColor:c.outlineColor,shadow:c.boxShadow,font:c.fontFamily};});assert.equal(styles.outlineWidth,'0px');assert.equal(styles.shadow,'none');checks.push({check:'level_focus_style',lang,viewport:v,styles});
   }
   await p.evaluate(()=>{document.getElementById('lvl').hidden=true;UI_TEST.state.choosing=false;UI_TEST.state.paused=false;UI_TEST.endGame(false);});await p.locator('#end').waitFor({state:'visible'});await shot(p,'koniec-porazka',lang,v);if(phase==='after')await padCheck(p,'end');else await goMenu(p);
   console.log(phase,lang,`${v.width}x${v.height}`,'PASS');
  }
  await context.close();
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'wyniki.json'),JSON.stringify({phase,screenshots:records,checks,pageErrors:errors,limitations:['No physical gamepad or phone','No portrait design','Screens generated using test-only fixtures, not a full playthrough']},null,2));
 console.log('PASS screenshots',records.length,'checks',checks.length);
}finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);fs.writeFileSync(path.join(out,'blad.txt'),String(e.stack||e));process.exitCode=1;});
