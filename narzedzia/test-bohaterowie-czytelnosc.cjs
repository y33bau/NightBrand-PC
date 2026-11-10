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
const views=[{width:1920,height:1080},{width:1280,height:720},{width:1164,height:655},{width:844,height:390},{width:767,height:355}];
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
  for(const v of views){for(const cls of ['r','k','z']){
   await p.setViewportSize(v);await goMenu(p);await p.evaluate(c=>{const q=UI_TEST.prog();q.char=c;q.lv=10;q.sel=[];q.ch=null;UI_TEST.openPrep(1);},cls);await p.locator('#diffSw button').first().click();await settle(p);
   const geometry=async()=>p.evaluate(()=>{const prep=document.getElementById('prep'),rs=e=>{const r=e.getBoundingClientRect(),h=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return{x:r.x,y:r.y,width:r.width,height:r.height,visible:r.y>=0&&r.bottom<=innerHeight,hit:!!h&&e.contains(h)}},groups=['prepPerks','prepCh','prepCurseL'].map(id=>{const e=document.getElementById(id).parentElement;return{id,parent:rs(e),head:rs(e.querySelector('h3')),scroll:e.scrollTop}});return{groups,go:rs(document.getElementById('prepGo')),difficulty:[...document.querySelectorAll('#diffSw button')].map(rs),summary:document.querySelector('.premium-prep-summary')?.textContent||null,controlsScroll:document.querySelector('.premium-prep-controls').scrollTop}});
   const initial=await geometry();checks.push({check:'initial_prep_geometry',lang,viewport:v,cls,...initial});
   if(phase==='after'){
    assert(initial.go.visible&&initial.go.hit,JSON.stringify(initial));assert(initial.difficulty.every(d=>d.visible&&d.hit),JSON.stringify(initial));assert.equal(initial.controlsScroll,0);const bg=await p.locator('#prepGo').evaluate(e=>({button:getComputedStyle(e).backgroundColor,row:getComputedStyle(e.parentElement).backgroundColor,image:getComputedStyle(e.parentElement).backgroundImage}));assert.equal(bg.button,'rgba(0, 0, 0, 0)');assert.equal(bg.row,'rgba(0, 0, 0, 0)');assert.equal(bg.image,'none');assert(initial.groups.every(g=>g.parent.height>=45&&g.head.visible),'column too short '+JSON.stringify(initial));assert(initial.groups[0].parent.x<initial.groups[1].parent.x&&initial.groups[1].parent.x<initial.groups[2].parent.x,'three columns');
    for(const id of ['prepPerks','prepCh','prepCurseL']){const selected=p.locator('#'+id+' .on');for(const e of await selected.all())await e.click();await p.locator('#'+id+' button:not(:disabled)').first().click();}
    await settle(p);const summary=await p.locator('.premium-prep-summary').textContent();assert(summary.includes('1/1')&&summary.includes('1/3'),summary);assert((await p.locator('.premium-prep-summary').getAttribute('title')).length>0);
    await p.locator('#diffSw button').last().click();await settle(p);const changed=await p.locator('.premium-prep-summary').textContent();assert.notEqual(summary,changed);
    await p.evaluate(()=>{for(const id of ['prepPerks','prepCh','prepCurseL']){const e=document.getElementById(id).parentElement;e.scrollTop=e.scrollHeight}});await settle(p);const scrolled=await geometry();for(const g of scrolled.groups){assert(g.head.y>=g.parent.y-1&&g.head.y+g.head.height<=g.parent.y+g.parent.height+1,JSON.stringify(g));assert(g.head.visible,JSON.stringify(g))}assert(scrolled.go.hit&&scrolled.go.visible);assert.equal(scrolled.go.y,initial.go.y);checks.push({check:'sticky_headers_live_summary_fixed_launch',lang,viewport:v,cls,summary:changed,...scrolled});
    await p.evaluate(()=>{for(const id of ['prepPerks','prepCh','prepCurseL'])document.getElementById(id).parentElement.scrollTop=0});
    const overflow=await p.evaluate(()=>[...document.querySelectorAll('#prepPerks .opt,#prepCh .opt,#prepCurseL .opt')].flatMap(e=>{const r=e.getBoundingClientRect();return [...e.querySelectorAll('b,span')].filter(c=>{const q=c.getBoundingClientRect();return q.bottom>r.bottom+1||q.right>r.right+1||q.left<r.left-1}).map(c=>c.textContent)}));assert.deepEqual(overflow,[]);checks.push({check:'choice_text_within_card',lang,viewport:v,cls});

   }
   if(v.width===1164&&cls==='r'&&lang==='pl')await shot(p,'przygotowanie-'+cls,lang,v);
   await p.locator('#prepBack').click();
  }console.log(phase,lang,v.width+'x'+v.height,'PASS');}
  await context.close();
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'wyniki.json'),JSON.stringify({phase,screenshots:records,checks,pageErrors:errors,limitations:['No physical gamepad or phone','No portrait design','Screens generated using test-only fixtures, not a full playthrough']},null,2));
 console.log('PASS screenshots',records.length,'checks',checks.length);
}finally{if(browser)await browser.close();server.close();}})().catch(e=>{console.error(e);fs.writeFileSync(path.join(out,'blad.txt'),String(e.stack||e));process.exitCode=1;});
