// NightBrand: zrzuty ekranu z wybranych miejsc mapy (przeglad grafiki bez grania).
// Uzycie: NODE_PATH=$(npm root -g) node narzedzia/zrzuty-miejsc.cjs KATALOG_GRY ROZDZIAL "x,y;x,y;..." [KATALOG_WYJSCIA] [PREFIKS] [ZAPYTANIE]
//   ROZDZIAL: 1-5. Wspolrzedne w siatce zrodlowej rozdzialu (te same liczby co w 02_swiaty.js, np. HOUSES, CATH); przeliczane przez MP().
//   ZAPYTANIE: parametry adresu do porownan, np. "depth=0" albo "art=0".
// Przyklad: node narzedzia/zrzuty-miejsc.cjs gra 3 "16,19.5;32,25.5" /tmp/zrzuty po
// Bohater jest przenoszony w kazde miejsce, wrogowie odsuwani poza mape, gra robi kilka krokow i klatke; zrzut 1600x900.
// Korzysta z ui-probe-runtime.cjs (hak testowy tylko w pamieci serwera, nie trafia do gry). Ok. 2 min na start + kilka sekund na miejsce.
// Uruchamiac po kolei z innymi testami przegladarkowymi, nigdy rownolegle. Obraz liczy procesor (swiftshader): wyglad OK, plynnosci to nie mierzy.
const probe=require('./ui-probe-runtime.cjs'),fs=require('fs'),path=require('path');
const [root,chArg,spotsArg,outArg,prefArg,query]=process.argv.slice(2);
if(!root||!chArg||!spotsArg){console.log('Uzycie: node zrzuty-miejsc.cjs KATALOG_GRY ROZDZIAL "x,y;x,y" [KATALOG_WYJSCIA] [PREFIKS] [ZAPYTANIE]');process.exit(2)}
const ch=+chArg,out=path.resolve(outArg||'zrzuty-miejsc'),pref=prefArg||('r'+ch),spots=spotsArg.split(';').map(s=>s.split(',').map(Number)).filter(s=>s.length===2&&s.every(Number.isFinite));
(async()=>{fs.mkdirSync(out,{recursive:true});const t=await probe.open(root,{viewport:{width:1600,height:900},query:query||''});let bad=0;
 try{await t.run('start('+ch+')');await t.p.waitForTimeout(500);
  for(let i=0;i<spots.length;i++){const [x,y]=spots[i];
   const r=await t.run(`(()=>{S.intro=false;S.notice=null;S.noticeQueue=[];S.dialog=null;S.banner=null;$('intro').hidden=true;$('msg').classList.remove('on');const away=()=>{for(const e of S.enemies){e.x=-9999;e.y=-9999}};away();pl.x=MP(${x})*16;pl.y=MP(${y})*16;pl.inv=99;for(let i=0;i<12;i++){update(.05);away()}for(let i=0;i<30;i++)syncScene(.05);draw();return{kafel:[pl.x/16|0,pl.y/16|0],wScianie:!!boxSolid(pl.x,pl.y,4,3)}})()`);
   const file=path.join(out,pref+'-'+(i+1)+'.png');await t.p.waitForTimeout(300);await t.p.screenshot({path:file});console.log(file,JSON.stringify(r)+(r.wScianie?'  UWAGA: punkt wypada w scianie, przesun go':''))}
  if(t.errors.length){bad=1;console.log('BLEDY STRONY:',JSON.stringify(t.errors).slice(0,600))}
 }catch(e){bad=1;console.log('BLAD:',String(e).slice(0,400),JSON.stringify(t.errors).slice(0,300))}
 await t.close();console.log(bad?'WYNIK: BLAD':'WYNIK: OK');process.exit(bad)})();
