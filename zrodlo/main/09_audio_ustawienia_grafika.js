/* ============ AUDIO ============ */
// 9.11.2026: rozmiar tekstu w menu: mnożnik dla rozmiarów pisma liczonych przez F() (nbFinalScale, ekran końca)
function nbTs(css){return css.replace(/(font(?:-size)?:[^;{}]*?)(clamp\(\d+(?:\.\d+)?px,min\([^)]*\),\d+px\))/g,'$1calc($2*var(--nbts,1))')}
// 10.11.2026: own keyboard bindings. Game logic keeps reading the default keys; during play the pressed key
// is translated to the default key of its action (kbIn). Stored in localStorage pn_keys.
const KB_DEF={up:'w',down:'s',left:'a',right:'d',atk:'j',blk:'l',heavy:'k',roll:' ',s1:'q',s2:'e',s3:'f',s4:'r',talk:'enter'};
const KB={map:{...KB_DEF},rev:{},wait:null};
function kbOk(k){return typeof k==='string'&&k.length>0&&k.length<=12&&!['escape','p','tab','arrowup','arrowdown','arrowleft','arrowright','meta','os','contextmenu','capslock','dead','unidentified','process','1','2','3','4','5','6','g'].includes(k)&&!/^f\d+$/.test(k)}
function kbBuild(){KB.rev={};for(const a in KB_DEF)KB.rev[KB.map[a]]=KB_DEF[a]}
function kbIn(k){if(KB.rev[k]!==undefined)return KB.rev[k];for(const a in KB_DEF)if(KB_DEF[a]===k)return '';return k}
function kbName(k){return k===' '?(EN?'Space':'Spacja'):k==='enter'?'Enter':k.length===1?k.toUpperCase():k[0].toUpperCase()+k.slice(1)}
function kbSave(){try{localStorage.setItem('pn_keys',JSON.stringify(KB.map))}catch(e){}kbBuild()}
try{const v=JSON.parse(localStorage.getItem('pn_keys')||'{}');if(isRecord(v)){for(const a in KB_DEF)if(kbOk(v[a])&&(v[a]!=='enter'||a==='talk'))KB.map[a]=v[a];const seen={};for(const a in KB_DEF){if(seen[KB.map[a]]){KB.map={...KB_DEF};break}seen[KB.map[a]]=1}}}catch(e){KB.map={...KB_DEF}}kbBuild();
const SETT={sfx:1,fts:100,dmg:true,save:{},bri:1,quality:matchMedia('(pointer:coarse)').matches?'low':'high',shake:true,rumble:true,ts:1,flash:true,contrast:false,oneHand:false,touchScale:1,touchLeft:false,hiRes:false,qmode:'auto',rscale:1,fpsCap:0,fpsShow:false,gShadow:'auto',gLights:'auto',gFx:'auto',gParts:'auto',gRes:'auto',gDyn:'auto',gDpr:'auto',gTex:'auto'};
let dynS=1,dynN=0,dynSlow=0,dynPrev=0,dynBlock=0,dynHold=8000,dynUpT=0,dynMin=1e9,dynWin=0;const FIT={w:1,h:1};
// Runda 309: tekstury ziemi 2048 px (powiekszone Real-ESRGAN), pobierane dopiero przy wlaczeniu (Ultra albo przelacznik); klucz = nazwa obrazu z IMGS
const HD_TEX={"cc0_ash":"assets/tekstury/5118a73dc051461831a7ec6849e8252ffe8dbb59550ab487cd54743ea9bab01e.webp","cc0_blackrock":"assets/tekstury/fa68ce09d94814fc9f1210db166712cf89ba57f999352bc3a63f082d1a4b784c.webp","cc0_charcoal":"assets/tekstury/9a3a981e012c1389ca8cc99da2e7ce7207d4a358eeda4941ab20951e1e18277f.webp","cc0_cracks":"assets/tekstury/65539f806640d93b275f593e69ad4b88d3943e12b35afa36f068b4cbcdad37f3.webp","cc0_darkrock":"assets/tekstury/dd6c90379c1bfbd65a18dd4bc7558abf6d07d1a503cc61935054883aab9ea034.webp","cc0_deski":"assets/tekstury/128c08a55828210e58b651ea27d5f6ad2da2701d75ec7846f699d52cae16b319.webp","cc0_dirt2":"assets/tekstury/306e8fcf61c811a1e339bc1d5f75b6425229836d186edbd3bef77388d89664c6.webp","cc0_dirt3":"assets/tekstury/727e1104e3cc10a78070062925f6da05117271d6590660fada9213a8d0c019cf.webp","cc0_forestmoss":"assets/tekstury/af61fa84c04b16c222106029c6d52d3b6cc6db64239a660ce551d5ab8f723abf.webp","cc0_ground1":"assets/tekstury/a4270839a1096193c3ce3dc8fb2d986220cdf7abf973d87bd313716c0048589c.webp","cc0_ground2":"assets/tekstury/c82e6e215e6388da0597c82a80b8270fa5567cb1b201e6b60a23c76d76cd1081.webp","cc0_leaves":"assets/tekstury/326121aa341243cebe25304f4f4197b01cb2b5d3811545e179e7fb4f89770ed4.webp","cc0_moss1":"assets/tekstury/eea3ac29fefc677a880c1c65b78304c5ab556246a94024c5bd945ccee057d12e.webp","cc0_mud":"assets/tekstury/1d6401e33794ecc7ad47603637bd66400e67b3589939e636bb6aba7fa36ad9ca.webp","cc0_zl_moss":"assets/tekstury/fe7538557374cd93e15752591c2e8b7f35c94bcb7418252a8e8ca6b8baea8fc9.webp","cc0_zl_place":"assets/tekstury/5a2a739d1c3f3faa3bc93a16e9392538abe93466a18b3c7e8e508613c112c0ec.webp","cc0_zl_street":"assets/tekstury/dc2682873abe84e63272b66f641d3b37ba42c168157be5432eb8439ca6b9aba3.webp"},HDREG=[],HDIMG={};
// graphics presets (Runda 306): shadow 0/1/2 (off/normal/high), lights = dynamic point lights, fx 0/1/2 (none/standard/high glow+blur), parts = particle multiplier, res = scene height (0 = automatic), aniso = texture filtering
const GPRE={ultra:{shadow:2,lights:10,fx:2,parts:1.5,res:1080,aniso:16,dpr:2,hdTex:1},high:{shadow:1,lights:10,fx:1,parts:1,res:0,aniso:4,dpr:1.5,hdTex:0},mid:{shadow:0,lights:4,fx:0,parts:.5,res:540,aniso:1,dpr:1,hdTex:0},min:{shadow:0,lights:4,fx:0,parts:.5,res:540,aniso:1,dpr:1,hdTex:0}};
const GFX={shadow:1,lights:10,fx:1,parts:1,res:0,aniso:4,dpr:1.5,hdTex:0};
function gfxResolve(){const m=SETT.qmode==='auto'?(SETT.quality==='high'?'high':'mid'):SETT.qmode,p=GPRE[m]||GPRE.high;for(const [k,o] of [['shadow','gShadow'],['lights','gLights'],['fx','gFx'],['parts','gParts'],['res','gRes'],['dpr','gDpr'],['hdTex','gTex']])GFX[k]=SETT[o]==='auto'?p[k]:SETT[o];GFX.aniso=p.aniso}
function isRecord(x){return !!x&&typeof x==='object'&&!Array.isArray(x)}
function clampNumber(x,min,max,fallback){return Number.isFinite(+x)?Math.max(min,Math.min(max,+x)):fallback}
function cleanRecords(x){const out={};if(isRecord(x))for(const m of ['s','a'])for(let c=1;c<=5;c++){const k=m+c,r=x[k];if(!isRecord(r))continue;const q={t:clampNumber(r.t,0,86400,0),lvl:Math.floor(clampNumber(r.lvl,1,999,1)),kills:Math.floor(clampNumber(r.kills,0,1e7,0))};if(Number.isFinite(+r.win)&&+r.win>0)q.win=clampNumber(r.win,1,86400,720);out[k]=q}return out}try{const q=+localStorage.getItem('pn_bri');if(q>=.7&&q<=1.6)SETT.bri=q}catch(e){}postMat.uniforms.bri.value=SETT.bri;
try{const v=JSON.parse(localStorage.getItem('pn_access')||'{}');if(isRecord(v)){if([.9,1,1.15,1.3].includes(v.ts))SETT.ts=v.ts;for(const k of ['shake','rumble','flash','contrast','oneHand','touchLeft','hiRes','fpsShow'])if(typeof v[k]==='boolean')SETT[k]=v[k];if(['low','high'].includes(v.quality))SETT.quality=v.quality;SETT.qmode=['auto','ultra','high','mid','min'].includes(v.qmode)?v.qmode:(v.quality==='low'?'mid':v.quality==='high'?'high':'auto');if([30,45,60,120].includes(+v.fpsCap))SETT.fpsCap=+v.fpsCap;{const gv=(k,ok)=>{if(v[k]==='auto')SETT[k]='auto';else if(ok.includes(+v[k]))SETT[k]=+v[k]};gv('gShadow',[0,1,2]);gv('gLights',[2,4,10]);gv('gFx',[0,1,2]);gv('gParts',[.5,1,1.5]);gv('gRes',[540,720,1080,1440]);gv('gDpr',[1,1.5,2]);gv('gTex',[0,1]);if(['auto','on','off'].includes(v.gDyn))SETT.gDyn=v.gDyn;if(v.hiRes===true&&SETT.gRes==='auto')SETT.gRes=720;SETT.hiRes=false}SETT.touchScale=clampNumber(v.touchScale,.8,1.3,1)}}catch(e){quietErr('loadAccess',e)}
qualityFromMode();try{const a=localStorage.getItem('pn_sfx');if(a!==null&&!isNaN(+a))SETT.sfx=Math.max(0,Math.min(1,+a));const b=localStorage.getItem('pn_fts');if(b!==null&&!isNaN(+b))SETT.fts=Math.max(70,Math.min(140,+b));SETT.dmg=localStorage.getItem('pn_dmg')!=='0';SETT.save=cleanRecords(JSON.parse(localStorage.getItem('pn_save')||'{}'))}catch(e){}
let AC=null,master=null,NB=null,sfxG=null;
function initAudio(){if(AC)return;try{AC=new (window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=.5;master.connect(AC.destination);sfxG=AC.createGain();sfxG.gain.value=SETT.sfx;sfxG.connect(master);
  NB=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;sfxInitRv();loadSfxSamples();
  // tło ambientowe (dron + deszcz) usunięte w v66: gra teraz tylko muzyka
  setAmbience()}catch(e){AC=null}}
let rainGain=null;function setAmbience(){if(rainGain)rainGain.gain.value=CH===1?.022:0}
function noise(dur,freq,q,gain,type,to,wet=0,delay=0){if(!AC)return;const t=AC.currentTime+delay,s=AC.createBufferSource();s.buffer=NB;const f=AC.createBiquadFilter();f.type=type||'lowpass';f.frequency.setValueAtTime(freq,t);f.Q.value=q;if(to)f.frequency.exponentialRampToValueAtTime(to,t+dur);
  const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(gain,t+Math.min(.012,dur*.15));g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(sfxG||master);sfxSend(g,wet);s.start(t,Math.random());s.stop(t+dur+.05)}
function sfxSend(g,wet){if(wet>0&&sfxRv){const w=AC.createGain();w.gain.value=wet;g.connect(w);w.connect(sfxRv)}}
function tone(f0,f1,dur,gain,type,delay=0,wet=0){if(!AC)return;const t=AC.currentTime+delay,o=AC.createOscillator();o.type=type||'square';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(gain,t+.006);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(sfxG||master);sfxSend(g,wet);o.start(t);o.stop(t+dur+.05)}
// głos z filtrem i drżeniem (ryki, wycie)
function voice(f0,f1,dur,gain,type,lp,wet=0,vibHz=0,vib=0,delay=0){if(!AC)return;const t=AC.currentTime+delay,o=AC.createOscillator();o.type=type||'sawtooth';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  if(vibHz){const l=AC.createOscillator(),lg=AC.createGain();l.frequency.value=vibHz;lg.gain.value=vib;l.connect(lg);lg.connect(o.frequency);l.start(t);l.stop(t+dur+.05)}
  const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=lp;f.Q.value=2;const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(gain,t+Math.min(.12,dur*.3));g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(f);f.connect(g);g.connect(sfxG||master);sfxSend(g,wet);o.start(t);o.stop(t+dur+.05)}
// dzwonek / metal: niecałkowite alikwoty
function bell(f,dur,gain,delay=0,wet=.25){[[1,1],[2.76,.45],[5.4,.22],[8.9,.1]].forEach(([m,a])=>tone(f*m,f*m*.998,dur/(1+m*.18),gain*a,'sine',delay,wet))}
// 13.11.2026: ogniwo łańcucha: krótki, niski metaliczny brzęk (alikwoty nieharmoniczne), do menu i zaznaczeń
function chainLink(f,gain,delay=0){[[1,1],[2.31,.55],[3.76,.3]].forEach(([m,a])=>tone(f*m,f*m*.985,.075/(1+m*.12),gain*a,'triangle',delay,.08))}
let sfxRv=null;
function sfxInitRv(){if(sfxRv||!AC)return;try{const len=Math.floor(AC.sampleRate*1.5),b=AC.createBuffer(2,len,AC.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
  const cv=AC.createConvolver();cv.buffer=b;const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3200;sfxRv=AC.createGain();sfxRv.connect(lp);lp.connect(cv);cv.connect(sfxG||master)}catch(e){sfxRv=null}}
const SFX={
 bladeLight:()=>{noise(.15,650,1.1,.13,'bandpass',3400);noise(.075,2400,.6,.035,'highpass',5500)},
 bladeHeavy:()=>{noise(.23,260,1.3,.18,'bandpass',1700);noise(.12,1100,.7,.055,'highpass',3800)},
 hitSteel:()=>{noise(.065,2100,2,.13,'bandpass',650);bell(880,.16,.025,0,.08);tone(160,65,.07,.065,'triangle')},
 block:()=>{noise(.055,2800,2,.12,'bandpass',1200);bell(690,.15,.025,0,.07);tone(240,110,.065,.055,'triangle')},
 parry:()=>{noise(.035,4300,2.8,.105,'bandpass',2100);bell(1570,.25,.035,0,.12);bell(2310,.15,.012,.018,.08)},
 ui:()=>{chainLink(430,.055);chainLink(330,.05,.05);noise(.05,1700,1.4,.05,'bandpass',650);tone(110,66,.09,.06,'triangle')},
 swing:()=>{noise(.26,450,1.4,.2,'bandpass',3000);noise(.2,1500,.8,.07,'highpass',6000,.1)},
 katana:()=>{noise(.2,2200,3,.2,'bandpass',7500,.15);tone(2800,5200,.16,.035,'sine',0,.2);noise(.09,5000,1,.07,'highpass',9000)},
 hit:()=>{noise(.13,1400,1,.3,'lowpass',160);tone(150+Math.random()*40,48,.12,.22,'sine');noise(.03,3500,1,.12,'highpass')},
 hitH:()=>{noise(.22,900,1,.38,'lowpass',100,.06);tone(96,30,.22,.3,'sine');tone(240,70,.12,.1,'square');noise(.05,2600,1,.18,'bandpass',900)},
 hitC:()=>{noise(.12,3200,2,.2,'bandpass',6500);bell(1250,.5,.05,0,.3);tone(110,36,.16,.24,'sine')},
 kill:()=>{noise(.45,1400,1,.34,'lowpass',80,.2);tone(190,38,.32,.2,'triangle');tone(70,28,.4,.2,'sine',.06)},
 hurt:()=>{voice(300,90,.22,.14,'sawtooth',1400);noise(.16,800,1,.24,'lowpass',200);tone(80,40,.15,.2,'sine')},
 roll:()=>{noise(.2,350,1,.2,'bandpass',1000);noise(.16,600,1,.12,'bandpass',1500,0,.07)},
 navtick:()=>{noise(.03,2600,2,.075,'bandpass',1300);chainLink(620,.075)},
 pick:()=>{tone(1500+Math.random()*250,2100,.07,.035,'sine',0,.2);tone(2200,2800,.05,.02,'sine',.045,.2)},
 coin:()=>{tone(1568,1580,.09,.045,'triangle',0,.25);tone(2093,2100,.22,.045,'triangle',.07,.3);tone(4186,4200,.1,.012,'sine',.07,.3)},
 bell:()=>{[330,440,554,660,880].forEach((f,i)=>{bell(f,.9,.05,i*.08,.35)});voice(165,330,.7,.07,'triangle',900,.3)},
 level:()=>{tone(98,64,.35,.16,'sine');voice(196,294,.6,.075,'sawtooth',950,.3);voice(294,440,.65,.06,'sawtooth',1150,.3,0,0,.12);voice(392,588,.7,.045,'triangle',1500,.35,0,0,.24);tone(880,1320,.5,.035,'triangle',.3,.4)},
 frost:()=>{noise(.55,6000,2,.15,'highpass',2500,.3);[2400,3100,3900].forEach((f,i)=>bell(f,.5,.025,i*.05,.4))},
 quake:()=>{noise(.9,200,.8,.42,'lowpass',35,.2);tone(52,24,.7,.32,'sine');noise(.3,90,1,.3,'lowpass',40)},
 fire:()=>{noise(.65,700,.8,.2,'bandpass',2200);for(let i=0;i<6;i++)noise(.03,3500+Math.random()*2000,2,.07,'bandpass',0,.05,Math.random()*.5);noise(.5,300,.8,.1,'lowpass',900)},
 golem:()=>{noise(.45,350,.9,.38,'lowpass',45,.12);tone(66,30,.35,.3,'triangle');noise(.2,1200,2,.12,'bandpass',300,0,.04)},
 heal:()=>{[392,494,587].forEach((f,i)=>tone(f,f*1.003,.5,.035,'sine',i*.07,.4))},
 growl:()=>voice(85,48,.7,.09,'sawtooth',420,.1,14,5),
 bossGrowl:()=>{voice(58,30,1.5,.22,'sawtooth',320,.25,9,4);voice(116,52,1.3,.08,'square',500,.2,7,6);noise(1.1,200,1,.1,'lowpass',60,.1)},
 slam:()=>{noise(.7,500,.7,.55,'lowpass',35,.25);tone(62,22,.55,.42,'sine');noise(.12,2500,1,.2,'bandpass',500)},
 rise:()=>{noise(.9,200,.8,.32,'lowpass',60,.2);voice(100,46,.9,.08,'sawtooth',300,.2,6,5);noise(.4,1500,1,.08,'bandpass',300,.2,.1)},
 warnR:()=>{voice(340,160,.3,.09,'sawtooth',1200,.1);voice(170,85,.32,.07,'square',900,.1,0,0,.05)},
 boing:()=>{tone(180,620,.18,.12,'square');tone(620,140,.3,.1,'square',.18)},
 bless:()=>{[262,330,392,523].forEach((f,i)=>tone(f,f*1.002,.7,.04,'sine',i*.1,.5));bell(1046,.9,.015,.3,.5)},
 empty:()=>{noise(.06,900,1,.08,'bandpass',300);tone(140,100,.08,.05,'square')},
 rumble:()=>{noise(2.6,170,.6,.46,'lowpass',38,.2);tone(46,28,2,.14,'sine')},
 thunder:()=>{noise(.15,3000,1,.3,'bandpass',800);noise(3,500,.5,.6,'lowpass',40,.5,.05);tone(40,24,2.4,.2,'sine',.1)},
 poiseBreak:()=>{noise(.08,3000,2,.2,'bandpass',1500);bell(520,.4,.05,0,.15);tone(180,60,.2,.18,'triangle')},
 howl:()=>{voice(240,470,.8,.05,'sine',1500,.5,5,6);voice(470,300,1.5,.05,'sine',1500,.5,5,8,.7)},
 cry:()=>{for(let i=0;i<3;i++)voice(640,470,.4,.04,'triangle',2000,.5,6,10,i*.5)}};
// 13.11.2026: zdarzenia menu i rzemiosla (próbki Kenney); synteza tylko na czas wczytywania. Klik i ruch po menu zostają łańcuchowe (ui, navtick).
for(const n of ['back','tab','toggle','pauseIn','pauseOut','shopIn','equip','card','reroll','note'])SFX[n]=SFX.ui;
SFX.buy=SFX.purse=SFX.coin;SFX.runStart=SFX.katana;SFX.step=()=>{};SFX.doorIn=SFX.doorOut=()=>noise(.5,300,.8,.15,'lowpass',80,.2);
// dźwięk menu: konkretne zdarzenie (zakup, zakładka, pauza) wypiera ogólne kliknięcie
let UISND=0;function uiSnd(n){UISND=1;play(n,0)}
const lastS={};let clock=0;
function play(n,gap=.04){if(!AC)return;if(clock-(lastS[n]||-9)<gap)return;lastS[n]=clock;SFX[n]()}


// Próbki ładowane raz; do chwili gotowości lub przy błędzie pozostaje synteza.
const LOOPS={};
// Pętla dźwiękowa (trzask ognia, kociołek): płynna głośność, sama cichnie, gdy nikt jej nie odświeża (pauza, menu).
function loopSnd(id,name,vol){
 if(!AC||SETT.sfx<=0)vol=0;
 let L=LOOPS[id];const b=sfxBuffers.get(name);
 if(!L){if(vol<=.01||!b)return;
  const src=AC.createBufferSource(),g=AC.createGain();src.buffer=b;src.loop=true;g.gain.value=0;src.connect(g);g.connect(sfxG||master);src.start(0,Math.random()*b.duration*.5);
  L=LOOPS[id]={src,g,last:AC.currentTime,z:0,iv:setInterval(()=>{if(AC.currentTime-L.last>.4)loopSnd(id,name,0)},250)}}
 const t=AC.currentTime;if(vol>0)L.last=t;
 L.g.gain.setTargetAtTime(vol,t,vol>0?.15:.3);
 if(vol<=.001){if(!L.z)L.z=t;else if(t-L.z>2){clearInterval(L.iv);try{L.src.stop()}catch(e){}L.g.disconnect();delete LOOPS[id]}}else L.z=0}
const sfxBuffers=new Map(),sfxVoices=new Set(),sfxNext={};
let sfxLoadPromise=null;
function loadSfxSamples(){if(sfxLoadPromise||!AC)return sfxLoadPromise;
 sfxLoadPromise=Promise.all(Object.entries(SFX_SAMPLES).map(async([name,url])=>{try{
 const r=await fetch(url);if(!r.ok)throw Error(r.status);
 const b=await AC.decodeAudioData(await r.arrayBuffer());sfxBuffers.set(name,b);
 }catch(e){console.warn((EN?'SFX: failed to load ':'SFX: nie udało się wczytać ')+name,e)}}));return sfxLoadPromise}

// Głośność, minimalny odstęp (czas audio), limit nakładania, priorytet.
// Muzyka omija ten tor. Ważne sygnały mogą wyprzeć cichy efekt zbierania.
const SFX_MIX={roll:[.5,.035,2,2],ui:[.6,.06,2,3],empty:[.55,.18,1,3],coin:[.45,.10,2,0],pick:[.25,.08,2,0],
 bell:[.75,.15,3,3], level:[.85,.5,1,3],heal:[.55,.4,2,2],bless:[.65,.3,2,2],growl:[.4,.65,2,0],
 bossGrowl:[.85,.22,2,3],warnR:[.65,.18,2,3],kill:[.4,.12,3,0],hurt:[.85,.12,2,3],
 rumble:[.5,.6,1,1],rise:[.5,.2,2,1],poiseBreak:[.8,.3,1,3],
 back:[.5,.06,1,3],tab:[.55,.06,1,3],toggle:[.5,.05,1,3],pauseIn:[.55,.15,1,3],pauseOut:[.5,.15,1,3],
 buy:[.6,.08,2,3],shopIn:[.6,.3,1,3],equip:[.55,.08,1,3],runStart:[.7,.5,1,3],card:[.6,.15,1,3],reroll:[.5,.1,1,3],doorIn:[.65,.5,1,3],doorOut:[.6,.5,1,3],
 step:[.11,.15,1,0],note:[.6,.3,1,2],purse:[.6,.15,2,1]};
const sfxPlayedAt={};
for(const [event,names] of Object.entries(SFX_SAMPLE_MAP)){
 const fallback=SFX[event];SFX[event]=()=>{
 if(!AC||SETT.sfx<=0)return;
 // Wspólne zdarzenie kill obsługuje też gracza: bez głosu potwora przy jego śmierci.
 const selected=event==='kill'&&typeof pl!=='undefined'&&pl?.dead?SFX_SAMPLE_MAP.hurt:names;
 const ready=selected.filter(n=>sfxBuffers.has(n));if(!ready.length){fallback();return}
 const [volume,gap,limit,priority]=SFX_MIX[event]||[.8,.035,4,1],now=AC.currentTime;
 if(now-(sfxPlayedAt[event]??-99)<gap)return;
 const voices=[...sfxVoices];if(voices.filter(v=>v.sfxEvent===event).length>=limit)return;
 if(voices.length>=20){const old=voices.find(v=>v.sfxPriority<priority);if(!old)return;
 old.sfxGain.gain.setTargetAtTime(0,now,.003);old.stop(now+.015);sfxVoices.delete(old)}
 sfxPlayedAt[event]=now;
 const index=(sfxNext[event]||0)%ready.length;sfxNext[event]=index+1;
 const source=AC.createBufferSource(),gain=AC.createGain();source.buffer=sfxBuffers.get(ready[index]);
 gain.gain.value=volume;source.sfxEvent=event;source.sfxPriority=priority;source.sfxGain=gain;
 source.connect(gain);gain.connect(sfxG||master);sfxVoices.add(source);
 source.onended=()=>{sfxVoices.delete(source);source.disconnect();gain.disconnect()};source.start();
 }}
// trener (tryb testera): stan zapisywany w pn_trainer
const TRN={on:false,god:false,ohk:false};try{const v=JSON.parse(localStorage.getItem('pn_trainer')||'{}');if(v&&v.on===true){TRN.on=true;TRN.god=v.god===true;TRN.ohk=v.ohk===true}}catch(e){quietErr('loadTrainer',e)}

