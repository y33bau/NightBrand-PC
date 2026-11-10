import glob,sys
D='/home/claude/nightbrand-backup/zrodlo/main/'
def rep(pref,old,new):
    f=glob.glob(D+pref+'*.js')[0];t=open(f,encoding='utf8').read()
    assert t.count(old)==1,(pref,t.count(old),old[:60])
    open(f,'w',encoding='utf8').write(t.replace(old,new))
# --- pad rozłączony -> pauza
rep('24',"}}catch(e){}\n  {const mt=S?S.mpTurn||0:0;","}}catch(e){}\n  {const pn=(g?1:0)+(g2?1:0);if(pn<(PAD.n||0)&&S&&S.phase==='play'&&!S.paused&&(INPUT_LAST==='p'||pl2)){togglePause(true);if(S.paused)padLostMsg(true)}PAD.n=pn}\n  {const mt=S?S.mpTurn||0:0;")
rep('23',"function togglePause(on){if(!S||S.phase!=='play'||S.notice||S.choosing||S.shop||S.dialog||S.intro)return;S.paused=on===undefined?!S.paused:on;",
 "// 10.11.2026: note shown in the pause screen when a controller drops out mid-night\nfunction padLostMsg(on){let n=$('padLost');if(!on){if(n)n.hidden=true;return}const rb=$('resumeBtn');if(!rb||!rb.parentNode||!rb.parentNode.parentNode)return;if(!n){n=document.createElement('p');n.id='padLost';n.setAttribute('role','status');n.style.cssText='margin:0 0 .6em;padding:.45em .9em;text-align:center;border:1px solid #7a5a24;background:#1c1610;color:#f0d9a8;font:600 15px/1.3 Georgia,serif';rb.parentNode.parentNode.insertBefore(n,rb.parentNode)}n.textContent=EN?'Controller disconnected. Game paused.':'Pad rozłączony. Gra zatrzymana.';n.hidden=false}\nfunction togglePause(on){if(!S||S.phase!=='play'||S.notice||S.choosing||S.shop||S.dialog||S.intro)return;S.paused=on===undefined?!S.paused:on;if(!S.paused)padLostMsg(false);")
# --- źródła obrażeń
rep('13',"let ftCrit=false,ftHeavy=false,ftMelee=false;","let ftCrit=false,ftHeavy=false,ftMelee=false,DSRC='';")
rep('13',"S.dealt=(S.dealt||0)+dmg;","S.dealt=(S.dealt||0)+dmg;if(src!=='trn'){const D=S.dsrc||(S.dsrc={}),k=src==='parry'?'p':src==='dot'?'d':DSRC||'s';D[k]=(D[k]||0)+dmg}")
for a in ["damageEnemy(e,e.bleedDmg||5,0,0,0)","damageEnemy(e,e.poisD*.5,0,0,0)","damageEnemy(e,e.burnD*.5,0,0,0)"]:
    rep('13',a,a[:-1]+",'dot')")
rep('12',"ftCrit=crit;ftHeavy=a.kind==='h';ftMelee=true;","ftCrit=crit;ftHeavy=a.kind==='h';ftMelee=true;DSRC=crit?'r':a.kind==='h'?'h':'l';")
rep('12',"ftCrit=false;ftHeavy=false;ftMelee=false;","ftCrit=false;ftHeavy=false;ftMelee=false;DSRC='';")
rep('11',"S.dealt=0;","S.dealt=0;S.dsrc=null;")
rep('22',"const meta=[(EN?'Night level '","""// 10.11.2026: where the night's damage came from (share of each source)
   const DS=S.dsrc||{},dsT=Object.values(DS).reduce((a,b)=>a+b,0),dsN={l:EN?'Light blows':'Lekkie ciosy',h:EN?'Heavy blows':'Ciężkie ciosy',r:EN?'Ripostes':'Riposty',s:EN?'Skills':'Umiejętności',d:EN?'Fire, poison, bleed':'Ogień, trucizna, krew',p:EN?'Deflected shots':'Odbite pociski'};
   const dsH=dsT>0?`<h4 class="nbs-h">${EN?'Damage sources':'Źródła obrażeń'}</h4><div class="nbs-ds">`+Object.keys(dsN).filter(k=>DS[k]>0).sort((a,b)=>DS[b]-DS[a]).map(k=>{const p=Math.round(100*DS[k]/dsT);return `<div class="nbs-dr"><span>${dsN[k]}</span><u><s style="width:${Math.max(2,p)}%"></s></u><b>${p}%</b></div>`}).join('')+'</div>':'';
   const meta=[(EN?'Night level '""")
rep('22',"${wide.map(x=>'<p class=\"nbs-cause\">'","${dsH}${wide.map(x=>'<p class=\"nbs-cause\">'")
rep('22',"${Z}.nbs-tip:before{content:","""${Z}.nbs-ds{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:${F(4)} ${F(18)};text-align:left}
${Z}.nbs-dr{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr) auto;align-items:center;gap:${F(8)};font:400 ${F(13.5)}/1.25 Georgia,serif!important;color:#c9b99c!important}
${Z}.nbs-dr span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
${Z}.nbs-dr u{display:block;height:${F(6)};background:#0009;border:1px solid #4a3c2c;text-decoration:none}
${Z}.nbs-dr s{display:block;height:100%;background:linear-gradient(90deg,#8a5a24,#e8c25a);text-decoration:none}
${Z}.nbs-dr b{color:#f3e6c8!important;font-weight:700!important;min-width:2.6em;text-align:right}
${Z}.nbs-tip:before{content:""")
# --- znaczek "nowe" w Kronice
rep('22',"return{v:1,med,kr,kills,nm,sku,endl,notes,st,","const sn=isRecord(r.sn)?(()=>{const o={};for(const k in r.sn)if(/^[aben]:[\\w-]{1,40}$/.test(k))o[k]=1;return o})():null;return{v:1,sn,med,kr,kills,nm,sku,endl,notes,st,")
rep('22',"function saveMeta(){","""// 10.11.2026: "new" marks in the Chronicle. META.sn = entries the player has already looked at;
// on the first run everything unlocked so far counts as seen, so old saves do not light up.
function kronUnl(){const o=[];for(const k of KRON)if(META.kr[k[0]])o.push('a:'+k[0]);for(const t in META.kills)if(META.kills[t]>0&&t!=='jerzak'&&ENAME[t])o.push('b:'+t);for(const k in META.nm)if(META.nm[k]>0)o.push('e:'+k);for(const k in (META.notes||{}))o.push('n:'+k);return o}
function kronNew(){if(!META.sn){META.sn={};for(const k of kronUnl())META.sn[k]=1;saveMeta()}return kronUnl().filter(k=>!META.sn[k])}
function kronNewCss(){if($('nbkNewCss'))return;const st=document.createElement('style');st.id='nbkNewCss';st.textContent='.nbk-new{display:inline-block!important;margin-left:.55em;padding:.08em .5em;font:700 .6em/1.35 Georgia,serif!important;letter-spacing:.1em;font-style:normal!important;color:#1a1208!important;background:#e8c25a;border-radius:2px;vertical-align:middle;text-shadow:none!important}.nbk-dot{display:inline-block!important;width:.5em;height:.5em;margin-left:.45em;border-radius:50%;background:#e8c25a;box-shadow:0 0 6px #e8c25a;vertical-align:middle}';document.head.appendChild(st)}
function saveMeta(){""")
rep('22',"if(KRONTAB===1)return KRON.map(([id,n,d,ash])=>({icon:kronIcon(),n,","if(KRONTAB===1)return KRON.map(([id,n,d,ash])=>({icon:kronIcon(),id,n,")
rep('22',"String(i===KRONTAB));b.textContent=(i+1)+'. '+nm;b.addEventListener('click',()=>kapSetTab(i));","String(i===KRONTAB));b.textContent=(i+1)+'. '+nm;b.dataset.kt=i;b.addEventListener('click',()=>kapSetTab(i));")
rep('22',"const R=kronRows();if(KRONSEL>=R.length)KRONSEL=0;const L=$('kapList');L.innerHTML='';","""const R=kronRows();if(KRONSEL>=R.length)KRONSEL=0;const L=$('kapList');L.innerHTML='';
  kronNewCss();const nkey=r=>!r||!r.ok?null:KRONTAB===1?'a:'+r.id:KRONTAB===3?(r.named?'e:'+r.named.id:'b:'+r.beast):KRONTAB===5?'n:'+r.note.id:null;kronNew();
  {const k=nkey(R[KRONSEL]);if(k&&!META.sn[k]){META.sn[k]=1;saveMeta()}}
  const NW=new Set(kronNew()),NT={a:1,b:3,e:3,n:5};{const has={};for(const k of NW)has[NT[k[0]]]=1;for(const tb of T.querySelectorAll('button[data-kt]'))if(has[tb.dataset.kt]){const d=document.createElement('i');d.className='nbk-dot';d.title=EN?'New entries':'Nowe wpisy';tb.appendChild(d)}}""")
rep('22',"b.innerHTML=`<b>${r.n}</b><span class=\"m2k-pips\"></span><small>${r.s}</small>`;","b.innerHTML=`<b>${r.n}${NW.has(nkey(r))?'<em class=\"nbk-new\">'+(EN?'NEW':'NOWE')+'</em>':''}</b><span class=\"m2k-pips\"></span><small>${r.s}</small>`;")
rep('22',"const W=weekNight(),nk=KRON.filter(k=>META.kr[k[0]]).length;b.title=","""{kronNewCss();const nn=kronNew().length;let d=b.querySelector('.nbk-new');if(nn&&!d){d=document.createElement('em');d.className='nbk-new';b.appendChild(d)}if(d){d.hidden=!nn;d.textContent=String(nn)}}
  const W=weekNight(),nk=KRON.filter(k=>META.kr[k[0]]).length;b.title=""")
print('OK')
