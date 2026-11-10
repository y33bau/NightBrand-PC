import glob
D='/home/claude/nightbrand-backup/zrodlo/main/'
def rep(pref,old,new):
    f=glob.glob(D+pref+'*.js')[0];t=open(f,encoding='utf8').read()
    assert t.count(old)==1,(pref,t.count(old),old[:70])
    open(f,'w',encoding='utf8').write(t.replace(old,new))
# --- obrażenia wg umiejętności
for old,sk in [("damageEnemy(e,w.dmg,w.vx/d,w.vy/d,.9)","'sk:'+(w.sk||'wave')"),
 ("damageEnemy(e,dmg,dx/(d||1),dy/(d||1),.4)","'sk:cascade'"),
 ("damageEnemy(e,dmg,(e.x-pl.x)/d,(e.y-pl.y)/d,0)","'sk:whirl'"),
 ("damageEnemy(tgt,dmg,(tgt.x-pl.x)/d,(tgt.y-pl.y)/d,0)","'sk:leap'"),
 ("damageEnemy(e,dmg*finMul(e),a.dx,a.dy,.25)","'sk:rend'"),
 ("damageEnemy(e,skDmg(HOOK.dmg[a.L-1]),a.dx,a.dy,0)","'sk:hook'"),
 ("damageEnemy(e,base*(e===main?1:SL.shot.splash),dx/(d||1),dy/(d||1),e===main?.4:.7)","'sk:embershot'"),
 ("damageEnemy(e,(8+4*L)*(1+.07*(S.lvl-1))*skillMul(),a.dx,a.dy,.3)","'sk:earthcut'"),
 ("damageEnemy(e,dmg,dx/(d||1),dy/(d||1),q.kind==='h'?1.2:.5)","'sk:drugieja'"),
 ("damageEnemy(e,SL.guard.dmg[g.L-1],dx/d,dy/d,.6)","'sk:stoneguard'"),
 ("damageEnemy(e,(SL.shot.iceDmg+SL.shot.perL*p.L)*(1+.07*(S.lvl-1))*skillMul(),ux,uy,0)","'sk:frostshot'"),
 ("damageEnemy(e,dmg*(1+.07*(S.lvl-1))*skillMul(),dx/d,dy/d,0)","'sk:aard'")]:
    rep('12',old,old[:-1]+','+sk+')')
rep('12',"dmg:base,hit:new Set(),cap:3})","dmg:base,hit:new Set(),cap:3,sk:'fan'})")
rep('13',"if(src!=='trn'){const D=S.dsrc||(S.dsrc={}),k=src==='parry'?'p':src==='dot'?'d':DSRC||'s';D[k]=(D[k]||0)+dmg}",
 "if(src!=='trn'){const sk=typeof src==='string'&&src.slice(0,3)==='sk:'?src.slice(3):'',D=S.dsrc||(S.dsrc={}),k=src==='parry'?'p':src==='dot'?'d':sk?'s':DSRC||'s';D[k]=(D[k]||0)+dmg;if(sk){const Q=S.dsk||(S.dsk={});Q[sk]=(Q[sk]||0)+dmg}}")
rep('11',"S.dealt=0;S.dsrc=null;","S.dealt=0;S.dsrc=null;S.dsk=null;")
rep('22',"   const meta=[(EN?'Night level '","""   const dsK=(()=>{const Q=S.dsk||{},ks=Object.keys(Q).filter(k=>Q[k]>0&&dsT>0).sort((a,b)=>Q[b]-Q[a]).slice(0,3);if(!ks.length)return '';const nm=k=>k==='wave'?(EN?'Blade waves':'Fale ostrza'):(SK[k]&&SK[k].name)||k;return '<p class="nbs-sub">'+esc((EN?'Strongest skills: ':'Najmocniejsze umiejętności: ')+ks.map(k=>nm(k)+' '+Math.max(1,Math.round(100*Q[k]/dsT))+'%').join(' · '))+'</p>'})();
   const meta=[(EN?'Night level '""")
rep('22',"${dsH}${wide.map(","${dsH}${dsK}${wide.map(")
# --- strzałki przy krawędzi
rep('11',"function hbTick(){","""// 10.11.2026: edge pointers to off-screen bosses, named elites, the hunt target and Marga's stall
const EDG={els:[],v:new THREE.Vector3()};
function edgeTick(){let box=$('nbEdge');const on=!!(S&&S.phase==='play'&&!S.paused&&!S.intro&&!S.choosing&&!S.shop&&!S.dialog&&!S.notice&&!pl.dead);
  if(!on){if(box)box.style.display='none';return}
  if(!box){box=document.createElement('div');box.id='nbEdge';box.setAttribute('aria-hidden','true');box.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;pointer-events:none;z-index:5';document.body.appendChild(box)}
  box.style.display='block';const T=[];
  for(const e of S.enemies){if(e.dead||e.rise>0)continue;if(e.hunt)T.push([e.x,e.y,'#ffd95a','\\u25c6']);else if(e.named)T.push([e.x,e.y,'#e0555a','\\u2605']);else if(bossBar(e)&&e.type!=='jerzak')T.push([e.x,e.y,'#ff6a4a','!'])}
  if(S.merchant&&S.merchant.state!=='out')T.push([S.merchant.x,S.merchant.y,'#e8c25a','M']);
  const r=$('screen').getBoundingClientRect(),V=EDG.v;let n=0;
  for(const [x,y,col,ch] of T){if(n>=4)break;V.set(x/16,1,y/16).project(cam);if(V.z<1&&Math.abs(V.x)<.97&&Math.abs(V.y)<.95)continue;
    let el=EDG.els[n];if(!el){el=document.createElement('div');el.style.cssText='position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;border-radius:50%;background:#0d0b0ecc;border:2px solid #fff;box-shadow:0 0 8px #000;font:700 15px/22px Georgia,serif;text-align:center';el.innerHTML='<b></b><i style="position:absolute;left:50%;top:50%;width:0;height:0;margin:-6px 0 0 -4px;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:8px solid #fff"></i>';box.appendChild(el);EDG.els[n]=el}
    let vx=V.x,vy=-V.y;if(V.z>1){vx=-vx;vy=-vy}const px=vx*r.width/2,py=vy*r.height/2,t=Math.min((r.width/2-34)/Math.max(1e-3,Math.abs(px)),(r.height/2-34)/Math.max(1e-3,Math.abs(py))),a=Math.atan2(py,px);
    el.style.display='block';el.style.left=(r.left+r.width/2+px*t)+'px';el.style.top=(r.top+r.height/2+py*t)+'px';el.style.borderColor=col;el.style.color=col;el.firstChild.textContent=ch;el.lastChild.style.borderLeftColor=col;el.lastChild.style.transform='rotate('+a+'rad) translate(21px,0)';n++}
  for(let i=n;i<EDG.els.length;i++)EDG.els[i].style.display='none'}
function hbTick(){""")
rep('25',"}hbTick();if(!S)ftClear();","}hbTick();edgeTick();if(!S)ftClear();")
# --- drganie gorącego powietrza nad lawą (rozdz. II)
rep('08',"low:{value:0},hq:{value:0},cold:","low:{value:0},hq:{value:0},haze:{value:0},tm:{value:0},cold:")
rep('08',"uniform float low;uniform float hq;uniform vec3 cold;","uniform float low;uniform float hq;uniform float haze;uniform float tm;uniform vec3 cold;")
rep('08',"vec3 c=texture2D(tD,uv).rgb;float focus=","if(haze>0.){vec3 h0=texture2D(tD,uv-vec2(0.,.03)).rgb;float hot=smoothstep(.22,.55,h0.r-h0.b)*smoothstep(.5,.85,h0.r);uv.x+=(sin(uv.y*95.+tm*5.3)+sin(uv.y*41.-tm*3.1))*.0013*hot*haze;}vec3 c=texture2D(tD,uv).rgb;float focus=")
rep('17',"postMat.uniforms.flash.value=fl*.3;","postMat.uniforms.flash.value=fl*.3;postMat.uniforms.haze.value=CH===2&&S&&S.phase==='play'&&!S.dg&&SETT.quality!=='low'?1:0;postMat.uniforms.tm.value=clock%600;")
print('OK')
