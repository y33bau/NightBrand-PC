import glob
D='/home/claude/nightbrand-backup/zrodlo/main/'
def rep(pref,old,new):
    f=glob.glob(D+pref+'*.js')[0];t=open(f,encoding='utf8').read()
    assert t.count(old)==1,(pref,t.count(old),old[:70])
    open(f,'w',encoding='utf8').write(t.replace(old,new))
# 1) lawa: ściany zagłębienia świecą tylko przy samej lawie, ciemniej i bez jaskrawej krawędzi
rep('04',"top=lv?[.14,.08,.06]:[.34,.27,.21],bot=lv?[.95,.34,.08]:[.07,.09,.11],yb=Y-.012;","top=lv?[.085,.055,.05]:[.34,.27,.21],bot=lv?[.6,.17,.04]:[.07,.09,.11],mid=[.2,.075,.045],yb=Y-.012;")
rep('04',"const b=wp.length/3;wp.push(ax,yb,az,bx,yb,bz,ax,t,az,bx,t,bz);wc.push(...bot,...bot,...top,...top);wi.push(b,b+1,b+2,b+1,b+3,b+2)}}",
 "const b=wp.length/3;if(lv){const ym=yb+Math.min(.22,(t-yb)*.4);wp.push(ax,yb,az,bx,yb,bz,ax,ym,az,bx,ym,bz,ax,t,az,bx,t,bz);wc.push(...bot,...bot,...mid,...mid,...top,...top);wi.push(b,b+1,b+2,b+1,b+3,b+2,b+2,b+3,b+4,b+3,b+5,b+4)}else{wp.push(ax,yb,az,bx,yb,bz,ax,t,az,bx,t,bz);wc.push(...bot,...bot,...top,...top);wi.push(b,b+1,b+2,b+1,b+3,b+2)}}}")
# 2) paleta rozdziałów + ziarno
rep('08',"haze:{value:0},tm:{value:0},","haze:{value:0},tm:{value:0},gSh:{value:new THREE.Vector3(1,1,1)},gHi:{value:new THREE.Vector3(1,1,1)},gSat:{value:1},gCon:{value:1},grain:{value:0},gtm:{value:0},")
rep('08',"uniform float haze;uniform float tm;","uniform float haze;uniform float tm;uniform vec3 gSh;uniform vec3 gHi;uniform float gSat;uniform float gCon;uniform float grain;uniform float gtm;")
rep('08',"c=pow(max(c,vec3(0.)),vec3(.97));c=c*(1.05+.15*c)/(1.+.25*c);","c=pow(max(c,vec3(0.)),vec3(.97));c=c*(1.05+.15*c)/(1.+.25*c);{float l2=dot(c,vec3(.2126,.7152,.0722));c=mix(vec3(l2),c,gSat);c*=mix(gSh,gHi,smoothstep(.04,.5,l2));c=max((c-.18)*gCon+.18,vec3(0.));}")
rep('08',"float vignette=1.-smoothstep(.36,.82,length((vUv-.5)*vec2(1.05,.95)));c*=mix(.72,1.,vignette);","float vignette=1.-smoothstep(.36,.82,length((vUv-.5)*vec2(1.05,.95)));c*=mix(.72,1.,vignette);if(grain>0.){float gn=fract(sin(dot(gl_FragCoord.xy+floor(gtm*24.)*vec2(17.13,9.71),vec2(12.9898,78.233)))*43758.5453)-.5;c+=gn*grain*(.4+.6*smoothstep(0.,.45,dot(c,vec3(.333))));}")
rep('03',"const DAWN=new THREE.Color(0xc0a898)","""// 10.11.2026: paleta rozdziału w obrazie końcowym: [barwa cieni], [barwa świateł], nasycenie, kontrast
const GRADE={1:[[.90,.98,1.12],[1.14,1.02,.86],1.16,1.05],2:[[1.0,.92,1.06],[1.15,.99,.82],1.12,1.07],3:[[.93,1.02,.93],[1.12,1.05,.84],1.06,1.05],4:[[.88,1.03,1.0],[.98,1.05,1.03],1.04,1.06],5:[[.93,.96,1.10],[1.07,1.02,.95],.94,1.09],9:[[.92,1.0,1.07],[1.05,1.02,.95],.96,1.05]};
const DAWN=new THREE.Color(0xc0a898)""")
rep('03',"if(filmUniforms){filmUniforms.cold.value.setHex(a.cold);filmUniforms.warm.value.setHex(a.warm)}","if(filmUniforms){filmUniforms.cold.value.setHex(a.cold);filmUniforms.warm.value.setHex(a.warm);const g=GRADE[CH]||GRADE[9];filmUniforms.gSh.value.set(...g[0]);filmUniforms.gHi.value.set(...g[1]);filmUniforms.gSat.value=g[2];filmUniforms.gCon.value=g[3]}")
rep('17',"postMat.uniforms.tm.value=clock%600;","postMat.uniforms.tm.value=clock%600;postMat.uniforms.grain.value=SETT.quality==='low'?0:.03;postMat.uniforms.gtm.value=SETT.flash?clock%600:0;")
# 3) podłoże: drobna ostra faktura + przyciemnienie przy ścianach
rep('03',"sampledDiffuseColor.rgb=result;}\n","if(nbLite<.5){float gn=fract(sin(dot(floor(nbWorld*24.),vec2(12.9898,78.233)))*43758.5453);float gp=max(length(nbDx),length(nbDy))*24.;result*=1.+(gn-.5)*.12*clamp(1.3-gp,0.,1.);}\nsampledDiffuseColor.rgb=result;}\n")
rep('03',"'nightbrand-ground-cc0-v2-'","'nightbrand-ground-cc0-v3-'")
rep('04',"function shoreFX(all,draw,Y,kind,land,step){","""// 10.11.2026: miękkie przyciemnienie ziemi wzdłuż murów i domów (statyczna siatka mnożąca, jak brzegi cieczy)
function wallShade(){if(SETT.quality==='low'||!W||!W.map)return;const M=W.map,isW=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&WALLC.has(M[y*MW+x]),free=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&!SOLID.has(M[y*MW+x])&&!VOID.has(M[y*MW+x]);
 const pos=[],col=[],idx=[],N=3;
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){if(!free(x,y))continue;const ws=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(isW(x+dx,y+dy))ws.push([x+dx,y+dy]);if(!ws.length)continue;
  const b=pos.length/3;for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const vx=x+i/N,vy=y+j/N;let d=2;for(const [wx,wy] of ws)d=Math.min(d,Math.hypot(Math.max(wx-vx,0,vx-wx-1),Math.max(wy-vy,0,vy-wy-1)));const f=1-.36*Math.pow(Math.max(0,1-d/.85),2);pos.push(vx,.024,vy);col.push(f,f,f)}
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=b+j*(N+1)+i;idx.push(a,a+N+1,a+1,a+1,a+N+1,a+N+2)}}
 if(!pos.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);
 const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,blending:THREE.MultiplyBlending,premultipliedAlpha:true,depthWrite:false,fog:false,toneMapped:false}));m.renderOrder=1;m.castShadow=m.receiveShadow=false;m.frustumCulled=false;ROOT.add(m)}
function shoreFX(all,draw,Y,kind,land,step){""")
rep('07',"W.npcMeshes[n.id]=m}buildMini()}finally{ROOT=scene}}","W.npcMeshes[n.id]=m}try{wallShade()}catch(e){quietErr('wallShade',e)}buildMini()}finally{ROOT=scene}}")
# 4) zwykli wrogowie nie rzucają długiego cienia od światła bohatera (zostaje cień kontaktowy); bossowie rzucają
rep('13',"e.mesh.castShadow=true;scene.add(e.mesh);","e.mesh.castShadow=BIG.has(type);scene.add(e.mesh);")
print('OK')
