// NightBrand: test dymny. Uzycie: NODE_PATH=$(npm root -g) node dymny.js KATALOG_GRY [rozdzialy, np. 1,2,3,4,5] [port]
// Dla kazdego rozdzialu: start gry, wejscie do rozgrywki, ok. 8 s gry, przelaczenie jakosci (Ultra, Niska, Auto), zbieranie bledow strony.
// Kod wyjscia 1 = jest blad. Wolny (renderowanie programowe): ok. 1-2 min na rozdzial; uruchamiac w tle, po kolei.
const rt=require('./ui-test-runtime.cjs'),{chromium}=rt.dependency('playwright'),{spawn}=require('child_process');
const dir=process.argv[2]||'.',chs=(process.argv[3]||'1').split(',').map(Number),port=+(process.argv[4]||8769);
(async()=>{
 const srv=spawn(process.env.NIGHTBRAND_PYTHON||'python3',['-m','http.server',String(port)],{cwd:dir,stdio:'ignore'});await new Promise(r=>setTimeout(r,1200));
 const b=await chromium.launch({executablePath:rt.browser(),args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 let bad=0;
 for(const n of chs){
  const p=await (await b.newContext({viewport:{width:800,height:450}})).newPage(),errs=[];
  p.on('pageerror',e=>errs.push(String(e).slice(0,160)));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text().slice(0,140))});
  await p.addInitScript(sd=>{try{localStorage.setItem('pn_lang','pl');localStorage.setItem('pn_story','0');for(const k in sd)localStorage.setItem(k,sd[k])}catch(e){}},JSON.parse(process.env.NB_SEED||'{}'));
  let st='OK';
  try{
   await p.goto('http://localhost:'+port+'/index.html');
   await p.waitForSelector('#start1:not([disabled])',{timeout:240000});
   await p.evaluate(()=>{const a=document.querySelector('#sArc');if(a)a.click()});
   await p.waitForTimeout(2500);
   await p.click('#start'+n,{force:true});
   await p.click('#premiumPrepare',{force:true});
   await p.waitForSelector('#prepGo',{state:'visible',timeout:300000});
   await p.click('#prepGo',{force:true});await p.waitForTimeout(8000);
   for(const q of ['ultra','min','auto'])await p.evaluate(q=>document.querySelector('#qualityRow [data-q='+q+']').click(),q).then(()=>p.waitForTimeout(3000));
   for(const sel of ['#gDynRow [data-v=on]','#gDprRow [data-v="1"]','#gShadowRow [data-v="2"]','#gFxRow [data-v="2"]','#fpsRow [data-fps="120"]','#gDynRow [data-v=auto]','#gDprRow [data-v=auto]','#gShadowRow [data-v=auto]','#gFxRow [data-v=auto]','#fpsRow [data-fps="0"]'])await p.evaluate(s=>document.querySelector(s).click(),sel).then(()=>p.waitForTimeout(1500));
  }catch(e){st='BLAD: '+String(e).slice(0,140)}
  if(errs.length)st+=' | bledy: '+JSON.stringify(errs);
  if(st!=='OK')bad++;console.log('rozdzial',n,st);await p.context().close();
 }
 await b.close();srv.kill();console.log(bad?'WYNIK: BLAD':'WYNIK: OK');process.exit(bad?1:0);
})();
