/* ============ MINIMAP ============ */
const MINI={fog:canvas(MW,MH),t:0};
const MCOL={20:'#34303c',26:'#34303c',30:'#34303c',29:'#8a6a2a',32:'#3b3128',25:'#6a6070',24:'#d4500e',23:'#140406',22:'#15131a',27:'#ff8a2a',31:'#4a4452',
  50:'#4a4650',51:'#a8862a',52:'#3e3a44',53:'#4a3a2a',54:'#c24a20',55:'#5a1a18',56:'#3a2622',57:'#36402e',58:'#8a7a60',59:'#5a4632',40:'#5a4632',41:'#46424c',42:'#36402e',43:'#3a2a1e',44:'#4a4248',45:'#1c2c40',46:'#3e3228',47:'#5a1a18',48:'#6a5a48',
  70:'#4a4650',71:'#2a2830',72:'#5a4632',73:'#6a2a30',74:'#8a7a3a',75:'#2e2a30',76:'#7a5ac0',77:'#141018',78:'#605c68',80:'#505058',
  60:'#1c2a1e',61:'#4a3a28',62:'#34402e',63:'#4a4850',64:'#2a4458',65:'#163430',66:'#3e3424',67:'#4e3c2a',68:'#6a6a70',69:'#5a4330'};
function buildMini(){const c=canvas(MW,MH),g=c.getContext('2d');for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=tileAt(x,y);let col=MCOL[t];if(t===20&&region(x,y)==='forge')col='#3a2a26';if(CH===4&&t===31)col='#0e180f';if(CH===4&&t===21)col='#262a2e';if(col){g.fillStyle=col;g.fillRect(x,y,1,1)}}
  for(const p of PROPS)if(p.fire){g.fillStyle='#ff8a2a';g.fillRect(p.x|0,p.y|0,1,1)}
  for(const s of SHRINES){g.fillStyle='#7fd0ff';g.fillRect((s.x>>4),(s.y>>4),1,1)}
  if(CH===2){g.fillStyle='#e8e0c8';g.fillRect(FT(49),FT(6),FT(53)-FT(49),1)}if(CH===3){g.fillStyle='#e0b84a';for(const [x0,y0,r0] of DOMES){const x=MP(x0),y=MP(y0),rr=Math.round(r0*MK);for(let yy=-rr;yy<=rr;yy++)for(let xx=-rr;xx<=rr;xx++)if(xx*xx+yy*yy<=rr*rr)g.fillRect(Math.floor(x+xx),Math.floor(y+yy),1,1)}}W.mini=c}
function resetFog(){const g=MINI.fog.getContext('2d');g.globalCompositeOperation='source-over';g.fillStyle='#050407';g.fillRect(0,0,MW,MH)}
resetFog();
let MINI_RIM=null;
function drawMini(dt){
  if(!S)return;MINI.t-=dt;if(MINI.t>0)return;MINI.t=.06;
  const fg=MINI.fog.getContext('2d'),px=pl.x/16,py=pl.y/16;
  fg.globalCompositeOperation='destination-out';const gr=fg.createRadialGradient(px,py,0,px,py,10);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.75,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');fg.fillStyle=gr;fg.fillRect(px-10,py-10,20,20);fg.globalCompositeOperation='source-over';
  // round radar: player in the centre, north up (the game camera does not rotate)
  const Z=240,c=$('mini');if(c.width!==Z||c.height!==Z){c.width=Z;c.height=Z}
  const g=c.getContext('2d'),u=Z/176,cx=Z/2,R=cx-9*u,RAD=19,s=R/RAD,TAU=6.2832,ph=(clock%3.2)/3.2,pulse=.5+.5*Math.sin(clock*6);
  g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;g.clearRect(0,0,Z,Z);
  const dot=(x,y,r,col,a)=>{g.globalAlpha=a;g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.globalAlpha=1};
  const far=[];
  g.save();g.beginPath();g.arc(cx,cx,R,0,TAU);g.clip();
  g.fillStyle='#050407';g.fillRect(0,0,Z,Z);
  g.save();g.translate(cx-px*s,cx-py*s);g.scale(s,s);g.drawImage(W.mini,0,0);g.drawImage(MINI.fog,0,0);g.restore();
  // what the camera currently shows
  g.strokeStyle='rgba(216,207,184,.30)';g.lineWidth=1;g.setLineDash([3*u,3*u]);
  g.strokeRect(cx+(camTarget.x-11.5-px)*s,cx+(camTarget.z-VIEW_H*.54-py)*s,23*s,VIEW_H*s);g.setLineDash([]);
  // vignette and ping
  const vg=g.createRadialGradient(cx,cx,R*.55,cx,cx,R);vg.addColorStop(0,'rgba(5,4,7,0)');vg.addColorStop(1,'rgba(5,4,7,.6)');g.fillStyle=vg;g.fillRect(0,0,Z,Z);
  g.strokeStyle='rgba(216,207,184,'+(.32*(1-ph)).toFixed(3)+')';g.lineWidth=1.5*u;g.beginPath();g.arc(cx,cx,ph*R,0,TAU);g.stroke();
  // enemies: glowing dots, elites and bosses pulse
  for(const e of S.enemies){if(e.dead)continue;
    const dx=(e.x/16-px)*s,dy=(e.y/16-py)*s,big=BIG.has(e.type),spec=e.type==='jerzak'||e.type==='collector',el=!!e.mini&&!big&&!spec;
    if(Math.hypot(dx,dy)>R){if(big||e.hunt)far.push([e.x,e.y,big?'#ff2a2a':'#ffd04a']);continue}
    const col=e.hunt?'#ffd04a':big?'#ff2a2a':e.type==='jerzak'?'#ffb0a0':e.type==='collector'?'#ffd04a':el?'#ff8a2a':'#ff4a3c',r=(big?5.2:spec?4.2:el?3.6:2.6)*u,x=cx+dx,y=cx+dy;
    dot(x,y,r+2.6*u,col,.26);dot(x,y,r,col,1);
    if(big||el||spec||e.hunt){g.strokeStyle=col;g.lineWidth=1.2*u;g.globalAlpha=.4+.6*pulse;g.beginPath();g.arc(x,y,r+(3+2*pulse)*u,0,TAU);g.stroke();g.globalAlpha=1}}
  for(const n of W.npcs)if(S.npc[n.id].state==='alive'){const dx=(n.x/16-px)*s,dy=(n.y/16-py)*s;if(Math.hypot(dx,dy)>R)continue;dot(cx+dx,cx+dy,3.2*u,n.art==='tharm'?'#7fd0ff':'#d8cfb8',1)}
  for(const sh of SHRINES){const dx=(sh.x/16-px)*s,dy=(sh.y/16-py)*s;if(Math.hypot(dx,dy)>R)continue;dot(cx+dx,cx+dy,3.4*u,'#7fd0ff',.5+.5*pulse);g.strokeStyle='#7fd0ff';g.lineWidth=1*u;g.beginPath();g.arc(cx+dx,cx+dy,5.5*u,0,TAU);g.stroke()}
  const M=S.merchant&&S.merchant.state==='here'?S.merchant:null;
  if(M){const dx=(M.x/16-px)*s,dy=(M.y/16-py)*s;if(Math.hypot(dx,dy)>R)far.push([M.x,M.y,'#e0b84a']);else{dot(cx+dx,cx+dy,4*u,'#e0b84a',1);g.strokeStyle='#e0b84a';g.lineWidth=1.2*u;g.globalAlpha=.4+.6*pulse;g.beginPath();g.arc(cx+dx,cx+dy,(6+2*pulse)*u,0,TAU);g.stroke();g.globalAlpha=1}}
  // player
  dot(cx,cx,6.5*u,'#ffffff',.18+.12*pulse);dot(cx,cx,3.2*u,'#ffffff',1);
  g.restore();
  // arrows on the rim for bosses and the merchant when out of range
  for(const [wx,wy,col] of far){const a=Math.atan2(wy/16-py,wx/16-px),ca=Math.cos(a),sa=Math.sin(a),rt=R-1*u,rb=R-11*u;
    g.fillStyle=col;g.strokeStyle='#0b0907';g.lineWidth=1.2*u;g.beginPath();g.moveTo(cx+ca*rt,cx+sa*rt);g.lineTo(cx+Math.cos(a-.17)*rb,cx+Math.sin(a-.17)*rb);g.lineTo(cx+Math.cos(a+.17)*rb,cx+Math.sin(a+.17)*rb);g.closePath();g.fill();g.stroke()}
  // forged rim: metal band, notches, studs, compass plaque
  // drawn once into its own canvas (it never changes), then copied each refresh; 8.11.2026
  if(!MINI_RIM||MINI_RIM.width!==Z){MINI_RIM=canvas(Z,Z);const g=MINI_RIM.getContext('2d'),dot=(x,y,r,col,a)=>{g.globalAlpha=a;g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.globalAlpha=1};
  const mg=g.createLinearGradient(0,0,Z,Z);mg.addColorStop(0,'#8a7248');mg.addColorStop(.35,'#2a2018');mg.addColorStop(.65,'#6b5a3a');mg.addColorStop(1,'#1a140e');
  g.strokeStyle=mg;g.lineWidth=6*u;g.beginPath();g.arc(cx,cx,R+3*u,0,TAU);g.stroke();
  g.strokeStyle='#0b0907';g.lineWidth=2*u;g.beginPath();g.arc(cx,cx,R-.5*u,0,TAU);g.stroke();
  g.strokeStyle='rgba(216,207,184,.45)';g.lineWidth=1*u;g.beginPath();g.arc(cx,cx,R+6*u,0,TAU);g.stroke();
  g.strokeStyle='rgba(216,207,184,.55)';g.lineWidth=1*u;
  for(let i=0;i<16;i++){const a=i*TAU/16,l=(i%4?2:4)*u,ca=Math.cos(a),sa=Math.sin(a);g.beginPath();g.moveTo(cx+ca*(R-2*u),cx+sa*(R-2*u));g.lineTo(cx+ca*(R-2*u-l),cx+sa*(R-2*u-l));g.stroke()}
  for(const [sx,sy] of [[1,0],[0,1],[-1,0]])dot(cx+sx*(R+3*u),cx+sy*(R+3*u),2.2*u,'#a31618',1);
  g.fillStyle='#16110c';g.strokeStyle='#8a7248';g.lineWidth=1.2*u;g.beginPath();g.arc(cx,7*u,6*u,0,TAU);g.fill();g.stroke();
  g.fillStyle='#d8cfb8';g.font='700 '+(8.5*u)+'px serif';g.textAlign='center';g.textBaseline='middle';g.fillText('N',cx,7.4*u);
  }
  g.drawImage(MINI_RIM,0,0);
}
