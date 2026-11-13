// ===== MUZYKA (syntezator w stylu 16-bit, cała w kodzie) =====
// Motyw na rozdział w MTH[numer]. Kanały: lead (fala prostokątna 25%, ślizgi i vibrato), pad (dwie fale + filtr),
// bas (trójkąt), werbel/tom (sinus) i szum. Muzyka wchodzi w start(ch) i cichnie w toMenu()/endGame().
let musVol=.55;try{const v=localStorage.getItem('pn_mus');if(v!==null&&!isNaN(+v))musVol=Math.max(0,Math.min(1,+v))}catch(e){}
const mf=m=>440*Math.pow(2,(m-69)/12);
const MCH={Dm:[50,57,65],Bb:[46,53,62],Gm:[43,50,58],A:[45,52,61],Eb:[51,58,63],Cm:[48,55,63],Db:[49,56,65],Fm:[41,48,56],G:[43,50,59],Ab:[44,51,60],D:[50,57,66],Em:[52,59,67],C:[48,55,64],Am:[45,52,60],B:[47,54,63]},
  MROOT={Dm:38,Bb:34,Gm:31,A:33,Eb:39,Cm:36,Db:37,Fm:29,G:31,Ab:32,D:38,Em:28,C:36,Am:33,B:35};
const MTH={
 // I: Spalona Brzeźnica. D-moll z frygijskim Es, wolno (56 uderzeń), zawodzący lead, ciężki tom, szum jak deszcz i żar
 1:{bpm:56,bars:16,
  ch:['Dm','Bb','Gm','A','Dm','Bb','Gm','A', 'Dm','Eb','Dm','Gm','Bb','A','A','A'],
  lead:[[],[[0,69,6],[6,67,2]],[[0,70,4],[4,69,2],[6,67,2]],[[0,73,5],[5,69,3]],[[0,74,8]],[[0,72,4],[4,70,4]],[[0,70,3],[3,69,3],[6,67,2]],[[0,66,4],[4,69,2],[6,66,2]],
        [[0,74,6],[6,72,2]],[[0,75,4],[4,74,4]],[[0,74,2],[2,77,6]],[[0,74,4],[4,72,2],[6,70,2]],[[0,72,4],[4,74,4]],[[0,73,4],[4,69,4]],[[0,66,8]],[[4,69,2],[6,73,2]]],
  tom2:2,hiss:8,kp:[.95,0,0,0,.62,0,0,0],kpB:[.95,0,0,0,.62,0,0,.34],duty:.25,lg:.062,vib:9,lf:1700,scoop:.6},
 // II: Dolne Miasto. c-moll z Des, 78 uderzeń, kuźnia: ciężka stopa, kowadło, krótki jasny lead (fala 12,5%), galopujący bas, dudnienie lawy
 2:{bpm:78,bars:16,
  ch:['Cm','Cm','Db','Cm','Fm','Db','G','G', 'Cm','Ab','Db','Cm','Fm','Fm','G','G'],
  lead:[[],[[0,67,2],[2,72,2],[4,75,4]],[[0,73,2],[2,72,2],[4,70,4]],[[0,67,2],[2,72,2],[4,75,2],[6,74,2]],[[0,68,4],[4,72,4]],[[0,73,4],[4,70,4]],[[0,71,2],[2,74,2],[4,71,4]],[[0,67,2],[4,71,2],[6,74,2]],
        [[0,79,2],[2,75,2],[4,72,4]],[[0,75,2],[2,72,2],[4,68,4]],[[0,73,2],[2,77,2],[4,73,4]],[[0,72,2],[2,75,2],[4,79,4]],[[0,77,4],[4,72,4]],[[0,80,2],[2,77,2],[4,72,4]],[[0,74,2],[2,71,2],[4,74,4]],[[4,67,2],[6,71,2]]],
  tom2:2,hiss:99,kp:[.95,0,.42,0,.8,0,.42,.3],kpB:[.95,0,.42,.3,.8,0,.5,.3],cl:[0,0,0,0,1,0,0,1],clFrom:3,duty:.125,lg:.06,vib:4,lf:2600,scoop:.3,bp:[[0,1.5],[2,1.5],[4,1.5],[6,1.5]],es:.3,efb:.35,ed:.38,bf:260,bg:.016},
 // III: Złotogród. g-moll z durowym D, 64 uderzenia, organy (fala 50%), długie nuty, dzwony, oszczędna stopa, wyniosły i zgniły splendor
 3:{bpm:64,bars:16,
  ch:['Gm','Eb','Cm','D','Gm','Eb','D','D', 'Gm','Cm','Eb','D','Cm','Gm','D','D'],
  lead:[[],[[0,74,6],[6,72,2]],[[0,75,4],[4,72,4]],[[0,74,5],[5,69,3]],[[0,70,4],[4,74,4]],[[0,75,6],[6,74,2]],[[0,74,4],[4,66,4]],[[0,69,8]],
        [[0,79,6],[6,77,2]],[[0,75,4],[4,72,4]],[[0,79,4],[4,75,4]],[[0,78,5],[5,74,3]],[[0,75,4],[4,72,4]],[[0,74,4],[4,70,4]],[[0,69,4],[4,66,4]],[[4,69,2],[6,74,2]]],
  tom2:4,hiss:99,kp:[.8,0,0,0,.4,0,0,0],kpB:[.8,0,0,0,.5,0,.25,0],duty:.5,lg:.05,vib:6,lf:1500,scoop:.4,bell:{every:2,v:.055},es:.5,efb:.4,ed:.52,bf:500,bg:.008},
 // IV: Czarnobór. e-moll, 52 uderzenia, zimny ambient: rzadki flet, wycie (duży ślizg), serce zamiast stopy, wiatr
 4:{bpm:52,bars:16,
  ch:['Em','Em','C','D','Em','C','Am','B', 'Em','Am','C','B','Em','C','D','B'],
  lead:[[],[],[[0,71,8]],[[0,69,4],[4,66,4]],[[0,67,8]],[[0,72,6],[6,71,2]],[[0,69,8]],[[0,71,4],[4,75,4]],
        [[0,76,8]],[[0,72,4],[4,69,4]],[[0,79,6],[6,76,2]],[[0,75,8]],[[0,71,8]],[[0,72,4],[4,76,4]],[[0,74,8]],[[0,75,4],[4,71,4]]],
  tom2:4,hiss:2,kp:[.62,0,0,0,0,0,0,0],kpB:[.62,0,0,.28,0,0,0,0],duty:.5,lg:.05,vib:7,lf:1300,scoop:5,bell:{every:4,v:.04},es:.55,efb:.45,ed:.6,bf:900,bg:.02}};
MTH.title={bpm:88,bars:24,ch:['Dm','Dm','Dm','Bb','Gm','A','Dm','Bb','Gm','A','Bb','C','Dm','A','Bb','C','Dm','A','Gm','A','Dm','Bb','Gm','A'],custom:null,duty:.25,lg:.075,vib:6,lf:2800,scoop:1,es:.35,efb:.35,ed:.34,bf:200,bg:.012};
function musPW(c,d){c._pw=c._pw||{};if(!c._pw[d]){const n=32,re=new Float32Array(n),im=new Float32Array(n);for(let i=1;i<n;i++)re[i]=2/(i*Math.PI)*Math.sin(i*Math.PI*d);c._pw[d]=c.createPeriodicWave(re,im)}return c._pw[d]}
function musNoiseBuf(c){if(!c._nb){const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;c._nb=b}return c._nb}
function musEnv(c,g,t,a,v,dur,r){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.setValueAtTime(v,t+Math.max(a,dur-.02));g.gain.setTargetAtTime(0,t+dur,r)}
function musLead(c,bus,send,m,prev,t,dur,T){const o=c.createOscillator();o.setPeriodicWave(musPW(c,T.duty||.25));const f=mf(m);
  o.frequency.setValueAtTime(mf(prev),t);o.frequency.exponentialRampToValueAtTime(f,t+.08);
  const l=c.createOscillator();l.frequency.value=5.3;const lg=c.createGain();lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(T.vib||9,t+Math.min(Math.max(dur*.8,.3),.9));l.connect(lg);lg.connect(o.detune);
  const g=c.createGain();musEnv(c,g,t,.05,T.lg||.062,dur,.12);const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=T.lf||1700;
  o.connect(lp);lp.connect(g);g.connect(bus);g.connect(send);o.start(t);l.start(t);o.stop(t+dur+1.2);l.stop(t+dur+1.2)}
function musPad(c,bus,send,notes,t,dur){for(const m of notes){for(const [w,dt,v] of [['square',-7,.012],['sawtooth',6,.016]]){const o=c.createOscillator();o.type=w;o.frequency.value=mf(m);o.detune.value=dt;const g=c.createGain();musEnv(c,g,t,.9,v,dur,.5);
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(380,t);lp.frequency.linearRampToValueAtTime(900,t+dur*.6);o.connect(lp);lp.connect(g);g.connect(bus);g.connect(send);o.start(t);o.stop(t+dur+3)}}}
function musBass(c,bus,m,t,dur){const o=c.createOscillator();o.type='triangle';o.frequency.value=mf(m);const g=c.createGain();musEnv(c,g,t,.03,.34,dur,.12);o.connect(g);g.connect(bus);o.start(t);o.stop(t+dur+.8)}
function musKick(c,bus,t,v){const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(170,t);o.frequency.exponentialRampToValueAtTime(46,t+.1);o.frequency.exponentialRampToValueAtTime(34,t+.35);const g=c.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+.42);o.connect(g);g.connect(bus);o.start(t);o.stop(t+.45);
  const n=c.createBufferSource();n.buffer=musNoiseBuf(c);const f=c.createBiquadFilter();f.type='lowpass';f.frequency.value=900;const ng=c.createGain();ng.gain.setValueAtTime(v*.16,t);ng.gain.exponentialRampToValueAtTime(.0005,t+.03);n.connect(f);f.connect(ng);ng.connect(bus);n.start(t,Math.random());n.stop(t+.05)}
function musBell(c,bus,send,m,t,v){for(const [r,gv] of [[1,1],[2.76,.45],[5.4,.2]]){const o=c.createOscillator();o.type='sine';o.frequency.value=mf(m)*r;const g=c.createGain();g.gain.setValueAtTime(v*gv,t);g.gain.exponentialRampToValueAtTime(.0005,t+2.6);o.connect(g);g.connect(bus);g.connect(send);o.start(t);o.stop(t+2.7)}}
function musHiss(c,bus,t,v,f,d){const n=c.createBufferSource();n.buffer=musNoiseBuf(c);const b=c.createBiquadFilter();b.type='bandpass';b.frequency.value=f;b.Q.value=1.2;const g=c.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);n.connect(b);b.connect(g);g.connect(bus);n.start(t,Math.random());n.stop(t+d+.05)}
function musGraph(c,out,T){T=T||{};const bus=c.createGain();bus.gain.value=1;bus.connect(out);const send=c.createGain();send.gain.value=T.es||.38;const dl=c.createDelay(1.5);dl.delayTime.value=T.ed||.46;const fb=c.createGain();fb.gain.value=T.efb||.3;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1500;
  send.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(bus);
  const nz=c.createBufferSource();nz.buffer=musNoiseBuf(c);nz.loop=true;const nb=c.createBiquadFilter();nb.type='bandpass';nb.frequency.value=T.bf||700;nb.Q.value=.6;const ng=c.createGain();ng.gain.value=T.bg||.011;
  const lf=c.createOscillator();lf.frequency.value=.11;const lfg=c.createGain();lfg.gain.value=.006;lf.connect(lfg);lfg.connect(ng.gain);nz.connect(nb);nb.connect(ng);ng.connect(bus);nz.start();lf.start();
  return {bus,send,stop:()=>{try{nz.stop();lf.stop()}catch(e){}}}}
// jeden krok (ósemka) motywu: zwraca nowy stan "poprzednia nuta lead"
function musStep(c,G,T,s,t,sd,st){if(T===MTH.title)return musTitleStep(c,G,T,s,t,sd,st);const bar=(s/8)|0,k=s%8,name=T.ch[bar];
  if(k===0)musPad(c,G.bus,G.send,MCH[name],t,sd*8+.4);
  const kv=(bar>=8&&T.kpB?T.kpB:T.kp)[k];if(kv&&(k===0||bar>=T.tom2))musKick(c,G.bus,t,kv);
  if(T.cl&&bar>=T.clFrom&&T.cl[k])musHiss(c,G.bus,t,.07*T.cl[k],3400,.14);
  if(k===4&&bar>=T.hiss)musHiss(c,G.bus,t,.05,2200,.3);
  if(T.bell&&k===0&&bar%T.bell.every===0)musBell(c,G.bus,G.send,MCH[name][2]+24,t,T.bell.v);
  for(const [bk,bl] of (T.bp||[[0,6],[6,2]]))if(bk===k)musBass(c,G.bus,MROOT[name],t+(bk?.01:0),sd*bl);
  for(const [a,m,len] of T.lead[bar]){if(a!==k)continue;const prev=(st.end>=s-.1&&st.m)?st.m:m-(T.scoop||.6);musLead(c,G.bus,G.send,m,prev,t,len*sd*.97,T);st.m=m;st.end=s+len}}
// ---- Motyw tytułowy „Piętno”: ciężki riff w d-moll (przester), bas, chór „aaa”, bęben wojenny, dzwon, haczyk melodyczny ----
function musDist(c){if(!c._ds){const n=512,cv=new Float32Array(n);for(let i=0;i<n;i++){const x=i*2/n-1;cv[i]=Math.tanh(x*5)}c._ds=cv}return c._ds}
let RIFF_G=.12;
function musRiff(c,bus,m,t,dur,v){const g=c.createGain();musEnv(c,g,t,.008,v,dur,.05);const ws=c.createWaveShaper();ws.curve=musDist(c);const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1300;lp.Q.value=2.5;
  for(const d of [-9,9]){const o=c.createOscillator();o.type='sawtooth';o.frequency.value=mf(m);o.detune.value=d;o.connect(ws);o.start(t);o.stop(t+dur+.4)}ws.connect(lp);const pg=c.createGain();pg.gain.value=RIFF_G;lp.connect(pg);pg.connect(g);g.connect(bus)}
function musChoir(c,bus,send,notes,t,dur,v){for(const m of notes){const o=c.createOscillator();o.type='sawtooth';o.frequency.value=mf(m);o.detune.value=(Math.random()-.5)*14;const g=c.createGain();musEnv(c,g,t,.8,v,dur,.7);
  for(const [f,q,gv] of [[650,6,1],[1100,8,.7]]){const b=c.createBiquadFilter();b.type='bandpass';b.frequency.value=f;b.Q.value=q;const gg=c.createGain();gg.gain.value=gv;o.connect(b);b.connect(gg);gg.connect(g)}
  g.connect(bus);g.connect(send);o.start(t);o.stop(t+dur+4)}}
function musSnare(c,bus,t,v){musHiss(c,bus,t,v,1900,.17);const o=c.createOscillator();o.type='sine';o.frequency.setValueAtTime(210,t);o.frequency.exponentialRampToValueAtTime(110,t+.1);const g=c.createGain();g.gain.setValueAtTime(v*1.4,t);g.gain.exponentialRampToValueAtTime(.001,t+.14);o.connect(g);g.connect(bus);o.start(t);o.stop(t+.16)}
function musRiser(c,bus,t,dur){const n=c.createBufferSource();n.buffer=musNoiseBuf(c);n.loop=true;const b=c.createBiquadFilter();b.type='bandpass';b.Q.value=1.4;b.frequency.setValueAtTime(400,t);b.frequency.exponentialRampToValueAtTime(6500,t+dur);const g=c.createGain();g.gain.setValueAtTime(.001,t);g.gain.linearRampToValueAtTime(.075,t+dur);g.gain.linearRampToValueAtTime(0,t+dur+.05);n.connect(b);b.connect(g);g.connect(bus);n.start(t);n.stop(t+dur+.1)}
const TT_RIFF=[[0,.5],[.5,.5],[1.5,.5],[2,1],[3.5,.5],[4,.5],[4.5,.5],[5.5,.5],[6,1],[7,1]];
const TT_LEAD=[[],[],[],[],[],[],
 [[0,74,3],[3,77,1],[4,76,1],[5,74,3]],[[0,72,3],[3,74,1],[4,72,1],[5,70,3]],[[0,70,3],[3,74,1],[4,72,1],[5,70,3]],[[0,69,2],[2,73,2],[4,76,2],[6,73,2]],
 [[0,77,4],[4,74,4]],[[0,76,4],[4,72,4]],[[0,74,3],[3,77,1],[4,81,4]],[[0,76,2],[2,73,2],[4,69,4]],[[0,77,4],[4,82,4]],[[0,79,4],[4,76,4]],[[0,81,6],[6,79,2]],[[0,76,4],[4,73,2],[6,69,2]],
 [[0,70,8]],[[0,69,4],[4,73,4]],
 [[0,74,3],[3,77,1],[4,76,1],[5,74,3]],[[0,72,3],[3,74,1],[4,72,1],[5,70,3]],[[0,70,3],[3,74,1],[4,72,1],[5,70,3]],[[0,69,2],[2,73,2],[4,76,2],[6,73,2]]];
function musTitleStep(c,G,T,s,t,sd,st){const bar=(s/8)|0,k=s%8,name=T.ch[bar],B=bar>=10&&bar<18,root=MROOT[name];
  if(k===0){musPad(c,G.bus,G.send,MCH[name],t,sd*8+.4);const cv=bar>=18&&bar<20?.03:B?.03:bar>=2?.013:0;if(cv)musChoir(c,G.bus,G.send,MCH[name].map(x=>x+12),t,sd*8+.6,cv);
    if(bar%4===0)musBell(c,G.bus,G.send,MCH[name][2]+24,t,bar<2?.07:.05);if(bar===10)musHiss(c,G.bus,t,.07,5200,1.8);if(bar===22)musRiser(c,G.bus,t,sd*16)}
  const kk=bar<2?[.6,.4,0,0,0,0,0,0]:bar<6||(bar>=6&&bar<10)?[1,0,0,.6,.9,0,.45,0]:B?[1,0,.6,0,.95,0,.6,.45]:bar<20?[.9,0,0,0,0,0,0,0]:[1,0,.5,0,.95,0,.5,.5];
  if(kk[k])musKick(c,G.bus,t,kk[k]);
  if((bar>=6&&bar<10)&&(k===2||k===6))musSnare(c,G.bus,t,.08);else if(B&&(k===2||k===6))musSnare(c,G.bus,t,.1);else if(bar>=20&&bar<23&&(k===2||k===6))musSnare(c,G.bus,t,.09);else if(bar===23&&k>=2)musSnare(c,G.bus,t,.07+k*.006);
  if(bar<2){if(k===0&&bar===0)musBass(c,G.bus,root,t,sd*16)}
  else if(bar>=18&&bar<20){if(k===0||k===4)musBass(c,G.bus,root,t,sd*4);if(k===0||k===4)musRiff(c,G.bus,root,t,sd*3.5,.07)}
  else for(const [pos,len] of TT_RIFF){if(Math.floor(pos)!==k)continue;const tt=t+(pos-k)*sd;let m=root;if(pos===5.5)m=root+3;if(pos===7&&(name==='Dm'||name==='Gm'))m=root+1;
    musRiff(c,G.bus,m,tt,len*sd*.95,.1);musBass(c,G.bus,m,tt,len*sd*.95)}
  for(const [a,m,len] of TT_LEAD[bar]){if(a!==k)continue;const prev=(st.end>=s-.1&&st.m)?st.m:m-1;musLead(c,G.bus,G.send,m,prev,t,len*sd*.97,T);st.m=m;st.end=s+len}}
const MUS={cur:0,G:null,timer:0,next:0,s:0,st:{m:0,end:-9},bus:null};
const MUS_BUFS={};
MTH[5]=MTH[5]||MTH[3];
function musKey(ch){return typeof ch==='number'?'c'+ch:ch}
function musRelease(k){if(k&&musKey(MUS.cur)!==k&&MUS.pend!==k&&!(k==='crypt'&&MUS.base===1)&&MUS_BUFS[k]!=='loading')delete MUS_BUFS[k]}
function musLoadBuf(k){if(!AC||!AUDIO_DATA[k]||MUS_BUFS[k])return;MUS_BUFS[k]='loading';const decode=u=>AC.decodeAudioData(u,buf=>{MUS_BUFS[k]=buf;if(MUS.pend===k&&MUS.pendCh!==undefined){const c=MUS.pendCh;MUS.pend=0;musStart(c)}musRelease(k)},()=>{MUS_BUFS[k]=null});try{const src=AUDIO_DATA[k];if(src.startsWith('data:')){const bin=atob(src.split(',')[1]),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);decode(u.buffer)}else{const cached=window.NB_AUDIO_BYTES?.get(src);if(cached)decode(cached.slice(0));else fetch(src).then(r=>{if(!r.ok)throw Error(src);return r.arrayBuffer()}).then(decode).catch(()=>{MUS_BUFS[k]=null})}}catch(e){MUS_BUFS[k]=null}}
// Schedule overlapping sources sharing one decoded buffer; every sample of the track is retained.
function musCrossfade(buffer,out){const c=AC,nodes=new Set(),fade=Math.min(.4,buffer.duration/3);let next=c.currentTime,first=true,stopped=false;
  const pump=(until=c.currentTime+.8)=>{if(stopped)return;while(next<=until){const src=c.createBufferSource(),g=c.createGain(),start=next,end=start+buffer.duration;src.buffer=buffer;g.gain.value=first?1:0;g.gain.setValueAtTime(first?1:0,start);if(!first)g.gain.linearRampToValueAtTime(1,start+fade);g.gain.setValueAtTime(1,end-fade);g.gain.linearRampToValueAtTime(0,end);src.connect(g);g.connect(out);const node={src,g,start,end};nodes.add(node);src.onended=()=>{nodes.delete(node);try{src.disconnect();g.disconnect()}catch(e){}};src.start(start);next=end-fade;first=false;}};
  pump();const timer=setInterval(()=>{if(c.state==='running')pump()},80);
  return{crossfade:fade,nodes,pump,stop:()=>{if(stopped)return;stopped=true;clearInterval(timer);for(const n of nodes){try{n.src.stop();n.src.disconnect();n.g.disconnect()}catch(e){}}nodes.clear()}};
}

function musStart(ch){if(!AC)return;
  const k=musKey(ch);
  if(AUDIO_DATA[k]){const B=MUS_BUFS[k];if(MUS.cur===ch){MUS.pend=0;return;}
    if(!B||B==='loading'){MUS.pend=k;MUS.pendCh=ch;musLoadBuf(k);return}
    if(MUS.cur)musStop(k==='crypt'?1.2:.8);
    MUS.pend=0;const sc=k==='intro'?.8:k==='crypt'?.5:.45,mb=AC.createGain();mb.gain.setValueAtTime(0,AC.currentTime);mb.gain.linearRampToValueAtTime(musVol*sc,AC.currentTime+(k==='intro'?.6:1.6));mb.connect(master);
    let graph;if(k==='c1'||k==='c2')graph=musCrossfade(B,mb);else{const src=AC.createBufferSource();src.buffer=B;if(k!=='intro'||!S){src.loop=true;src.loopStart=.03;src.loopEnd=B.duration-.02}src.connect(mb);src.start();graph={stop:()=>{try{src.stop();src.disconnect()}catch(e){}}}}
    MUS.cur=ch;MUS.scale=sc;MUS.mb=mb;MUS.G=graph;MUS.timer=0;return}
  MUS.pend=0;if(!MTH[ch]){if(MUS.cur)musStop();return}if(MUS.cur===ch)return;if(MUS.cur)musStop(.4);
  const mb=AC.createGain();mb.gain.setValueAtTime(0,AC.currentTime);mb.gain.linearRampToValueAtTime(musVol,AC.currentTime+2.5);mb.connect(master);
  const G=musGraph(AC,mb,MTH[ch]);MUS.cur=ch;MUS.scale=1;MUS.G=G;MUS.mb=mb;MUS.next=AC.currentTime+.4;MUS.s=0;MUS.st={m:0,end:-9};
  const run=()=>{if(MUS.G!==G||AC.state!=='running')return;const T=MTH[ch],sd=60/T.bpm/2;while(MUS.next<AC.currentTime+.4){musStep(AC,G,T,MUS.s,MUS.next,sd,MUS.st);MUS.s=(MUS.s+1)%(T.bars*8);MUS.next+=sd}};
  MUS.timer=setInterval(run,80);run()}
// utwór walki (boss / krypta) włącza się, gdy blisko jest boss albo gdy gracz jest w krypcie; po walce wraca motyw rozdziału
function musTick(dt){if(!MUS.base||!S||!AC||MUS.cur==='intro')return;MUS.tk=(MUS.tk||0)-dt;if(MUS.tk>0)return;MUS.tk=.5;
  const want=!!(S.dg&&!S.dg.done);
  if(want){MUS.off=0;if(MUS.cur!=='crypt')musStart('crypt')}else if(MUS.cur==='crypt'){MUS.off=(MUS.off||0)+.5;if(MUS.off>=4)musStart(MUS.base)}}
function musStop(f=1.8){MUS.pend=0;if(!MUS.cur)return;const G=MUS.G,mb=MUS.mb,k=musKey(MUS.cur);MUS.cur=0;MUS.G=null;clearInterval(MUS.timer);
  try{mb.gain.cancelScheduledValues(AC.currentTime);mb.gain.setValueAtTime(mb.gain.value,AC.currentTime);mb.gain.linearRampToValueAtTime(0,AC.currentTime+f)}catch(e){}
  setTimeout(()=>{G.stop();try{mb.disconnect()}catch(e){}musRelease(k)},f*1000+3500)}
function musSetVol(v){musVol=v;try{localStorage.setItem('pn_mus',String(v))}catch(e){}if(MUS.mb&&AC)MUS.mb.gain.setTargetAtTime(v*(MUS.scale||1),AC.currentTime,.1);for(const e of document.querySelectorAll('.musSl'))e.value=Math.round(v*100)}
const INTRO_KICK={1:(EN?'Act I · The Scorched Settlement':'Rozdział I · Spalona Osada'),2:(EN?'Act II · The Lower City':'Rozdział II · Dolne Miasto'),3:(EN?'Act III · Fallen Goldheim':'Rozdział III · Upadły Złotogród'),4:(EN?'Act IV · Blackwood':'Rozdział IV · Czarnobór'),5:(EN?'Act V · The Creditors\' Citadel':'Rozdział V · Cytadela Wierzycieli')};
let INTRO=null;
// Start loading at chapter selection, while the preparation screen is open.
const INTRO_IMAGES=new Map();
function preloadIntro(ch){const key='intro'+ch;if(!STORY||!SPRITE_DATA[key]||INTRO_IMAGES.has(ch))return;const im=new Image();INTRO_IMAGES.set(ch,im);im.onerror=()=>{const backup=SPRITE_DATA[key+'_fallback'];if(backup&&!im.nbFallback){im.nbFallback=true;SPRITE_DATA[key]=backup;im.src=backup;if(INTRO&&INTRO.ch===ch)$('iimg').style.backgroundImage=`url(${backup})`}else INTRO_IMAGES.delete(ch)};im.src=SPRITE_DATA[key]}
for(let ch=1;ch<=5;ch++)$('start'+ch).addEventListener('click',()=>preloadIntro(ch),true);
$('againBtn').addEventListener('click',()=>preloadIntro(CH===9?1:CH),true);
$('nextBtn').addEventListener('click',()=>preloadIntro(Math.min(5,CH+1)),true);
$('prepGo').addEventListener('click',()=>preloadIntro(PREP.ch),true);
STORY_INTRO[5]=FTX('story.act5');
// runda 318 (pakiet fabularny): opisy rozdzialow z FABULA_TXT; rozdzial I zachowuje dotychczasowe wprowadzenie i dopisuje opis osady
for(let c=1;c<=4;c++)STORY_INTRO[c]=STORY_INTRO[c].concat(FTX('story.act'+c)); // 13.11.2026: najpierw wstep lokalizacji (I: wstep; II-IV: dodatkowe z 20_fabula), potem opis rozdzialu story.actN; noc V: sam story.act5
function storyIntro(ch){if(!STORY||!STORYMODE||!STORY_INTRO[ch]||!S||!SPRITE_DATA['intro'+ch])return;
  preloadIntro(ch);
  const el=$('intro');$('iimg').style.backgroundImage=`url(${SPRITE_DATA['intro'+ch]})`;$('iimg').style.animation='none';void $('iimg').offsetWidth;$('iimg').style.animation='';
  $('ikick').textContent=INTRO_KICK[ch];
  // 8.11.2026: the whole text scrolls up by itself; hold (tap/Space/pad) = faster, "Skip" ends the intro at once
  const roll=$('iroll');roll.textContent='';for(const l of STORY_INTRO[ch]){const p=document.createElement('p');p.textContent=l;roll.appendChild(p)}
  roll.style.transform='translateY(100%)';
  const sk=$('iskip');sk.textContent=EN?'Skip':'Pomiń';sk.setAttribute('aria-label',EN?'Skip the introduction':'Pomiń wprowadzenie');
  $('ihint').textContent=EN?'Hold to speed up':'Przytrzymaj, aby przyspieszyć';
  el.classList.remove('out');el.hidden=false;$('touch').hidden=true;
  INTRO={ch,lines:STORY_INTRO[ch],y:0,t:0,wait:.8,hold:false,pad:false,linger:0,chars:STORY_INTRO[ch].join('').length};S.intro=true;}
function introEnd(){if(!INTRO)return;for(const k of[' ','enter','e','j'])keys[k]=false;if(MUS.cur==='intro'||MUS.pend==='intro'){MUS.pend=0;if(MUS.base)musStart(MUS.base)}const el=$('intro');el.classList.add('out');INTRO=null;S.intro=false;musRelease('intro');setTimeout(()=>{if(!INTRO)el.hidden=true},950);$('touch').hidden=!coarse}
const INTRO_CPS=16; // reading speed, characters per second
function introTick(dt){if(!INTRO)return;const I=INTRO;I.t+=dt;if(I.wait>0){I.wait-=dt;return}
  const vp=$('iscroll'),roll=$('iroll'),vh=vp.clientHeight,rh=roll.offsetHeight;if(!vh||!rh)return;
  const fast=I.hold||I.pad||keys[' ']||keys.enter||keys.e||keys.j;
  if(!I.init){I.init=1;I.y=vh*.45} // first line starts in the lower part of the window, not below it
  const endY=rh+vh*.4; // last line stops in the upper half of the text window
  if(I.y<endY){const speed=rh/Math.max(8,I.chars/INTRO_CPS);I.y=Math.min(endY,I.y+dt*speed*(fast?4:1))}
  else{I.linger+=dt*(fast?3:1);if(I.linger>=3.5){introEnd();return}}
  roll.style.transform=`translateY(${(vh-I.y).toFixed(1)}px)`}

{const el=$('intro'),hold=v=>e=>{if(INTRO&&!(e.target&&e.target.closest&&e.target.closest('#iskip')))INTRO.hold=v};
 el.addEventListener('pointerdown',hold(true));for(const ev of['pointerup','pointercancel','pointerleave'])el.addEventListener(ev,hold(false));
 $('iskip').addEventListener('click',e=>{e.stopPropagation();introEnd()})}
// muzyka tytułowa startuje przy pierwszym dotknięciu/klawiszu (przeglądarki blokują dźwięk przed gestem użytkownika)
function musFirst(){try{if(AC&&AC.state==='suspended'&&!(S&&S.paused))acResume()}catch(e){}if(S||MUS.cur)return;try{initAudio();if(AC&&AC.state==='suspended')acResume();musStart(AUDIO_DATA.intro?'intro':'title')}catch(e){quietErr('audioStart',e)}}
addEventListener('pointerdown',musFirst,true);addEventListener('keydown',musFirst,true);addEventListener('click',musFirst,true);addEventListener('touchend',musFirst,true);
for(const e of document.querySelectorAll('.musSl')){e.value=Math.round(musVol*100);e.addEventListener('input',()=>musSetVol(e.value/100))}
function storyBoss(e){if(!STORY||S.dg||e.dgBoss)return;const t=STORY_BOSS[CH+e.type]||STORY_BOSS[e.type];if(t)setTimeout(()=>{if(S&&S.phase==='play'&&!pl.dead)say(t,'story')},3600)}
let startBusy=false;
function beginRun(){if(startBusy)return;startBusy=true;const b=$('prepGo'),label=b.innerHTML;b.disabled=true;b.textContent=(EN?'Preparing the act…':'Przygotowywanie rozdziału…');if(coarse)goFull();requestAnimationFrame(()=>setTimeout(()=>{try{if(!$('prep').hidden)start(PREP.ch)}catch(e){console.error(e);toMenu();say((EN?'Failed to prepare the act. Refresh the game and try again.':'Nie udało się przygotować rozdziału. Odśwież grę i spróbuj ponownie.'))}finally{startBusy=false;b.disabled=false;b.innerHTML=label}},0))}
function start(ch){if(!A)return;if(!groupReady(ch))return waitChapter(ch,()=>start(ch));ftClear();hbClear();$('pause').hidden=true;$('bAtk').hidden=$('bBlock').hidden=$('bHeavy').hidden=false;$('btns').classList.add('sl');resetInput();if(coarse)goFull();if(coarse||SETT.quality==='low')for(const k of Object.keys(WORLDS))if(+k!==ch)releaseWorld(+k);ensureWorld(ch);useWorld(ch);initAudio();if(AC&&AC.state==='suspended')acResume();newGame();applyPrep();lastHud='';MUS.base=ch;for(const k of Object.keys(MUS_BUFS))musRelease(k);if(ch===1)musLoadBuf('crypt');if(ch===1&&STORY)musLoadBuf('intro');if(!(ch===1&&AUDIO_DATA.intro))musStart(ch);for(const id of ['title','end','lvl','dialog','prep'])$(id).hidden=true;$('hud').hidden=false;$('touch').hidden=!coarse;camTarget.set(pl.x/16,0,pl.y/16);if(ch>=1&&ch<=5)storyIntro(ch);if(ch===1&&INTRO&&AUDIO_DATA.intro)musStart('intro')}
