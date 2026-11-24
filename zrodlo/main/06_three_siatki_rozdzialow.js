// Chapter II meshes: M4 floor, M5 walls, M6 props, M8 transitions
// 15.11.2026: malowany punkt centralny mapy (obraz z przezroczystoscia) jako stojacy rekwizyt: pionowa plaszczyzna rozciagnieta o SQ jak inne rekwizyty, normalne jak w rekwizytach rozdz. IV
function nbAniso(){const m=renderer.capabilities.getMaxAnisotropy?renderer.capabilities.getMaxAnisotropy():4;return Math.max(1,Math.min(m,Math.max(4,GFX.aniso||4)))}
function nbLandmark(url,o){const tex=new THREE.TextureLoader().load(url);tex.anisotropy=nbAniso();const h=o.w*o.aspect,g=new THREE.PlaneGeometry(o.w,h).translate(0,h/2,0),n=g.attributes.normal;for(let i=0;i<n.count;i++)n.setXYZ(i,0,.8,.6);
 const mat=(o.wrap||(m=>m))(phong({map:tex,alphaTest:.42,side:THREE.DoubleSide,emissive:o.em||0x000000,emissiveMap:o.em?tex:null}));const m=new THREE.Mesh(g,mat);m.scale.y=SQ;m.position.set(o.x,o.base,o.z);m.renderOrder=2;ROOT.add(m);return m}
function buildDolne(I){planGround(2);
  const F=I.dm_floor,Wl=I.dm_walls,r=rng(99);
  const fc=canvas(WW,WH),fg=fc.getContext('2d');
  const tile=(c,row,tx,ty)=>groundTile(fg,F,c,row,tx,ty);
  const nearLava=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>tileAt(x+dx,y+dy)===24);
  for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){let t=tileAt(tx,ty);const rc=(r()*8)|0;if(t===31)t=W.under[ty*MW+tx]||20;
    if(VOID.has(t))continue;
    if(t===21)tile(rc,2,tx,ty);
    else if(t===29)tile(tx===FT(18)&&ty===FT(23)?7:tx===FT(18)?2:0,1,tx,ty);
    else if(t===32)tile([0,5,6,7][rc&3],7,tx,ty);
    else if(region(tx,ty)==='forge'){if(nearLava(tx,ty))tile(4+(rc&3),5,tx,ty);else tile(rc,r()<.1?3:0,tx,ty)}
    else if(t===26)tile(rc,2,tx,ty);
    else tile(rc,0,tx,ty);
  }
  for(let tx=FT(42);tx<FT(61);tx++)if(tileAt(tx,FT(48))===32)tile(1,7,tx,FT(48));
  floorAO(fg,new Set([22,31]));
  groundDetails(fg);
  const floor=new THREE.Mesh(floorGeo,groundMaterial(phong({map:surfaceTex(fc),alphaTest:.5,color:0x988e94})));floor.position.set(MW/2,0,MH/2);floor.receiveShadow=true;ROOT.add(floor);
  // walls: carved hall stone, forge brick with glowing seams, mine timber; caps from row 6
  const HDW=!!(I.wl_hala&&I.wl_kuznia&&I.wl_kopalnia&&I.wl_halacap),WTINT=[0xc8c0c8,0xbfb7bf,0xd0c8d0,0xc4bcc4,0xd4ccc4,0xc8c0b8,0xc8c0b8];const capMat=HDW?worldSurf(cutaway(phong({color:0xc0b8c0})),I.wl_halacap,3,'a'):cutaway(phong({map:texFrom(tcut(Wl,1,6),true)}));
  const wallGeo=new THREE.BoxGeometry(1,3,1);wallGeo.translate(0,1.5,0);
  const variants=[0,1,2,3].map(i=>stackTex(Wl,[[(i*3)%8,0],[(i*2+1)%8,1],[(i*5+4)%8,0]])).concat([0,1].map(i=>stackTex(Wl,[[i*3,4],[i*3+1,4],[i*3+2,4]]))).concat([stackTex(Wl,[[0,7],[2,7],[4,7]])]);
  const groups=variants.map(()=>[]);
  const wreg=(x,y)=>{let m=0,f=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const t=tileAt(x+dx,y+dy);if(t===21)continue;if(t===32)m=1;else if(region(x+dx,y+dy)==='forge')f=1}return m?'mine':f?'forge':'hall'};
  for(const [x,y] of walls){const g=wreg(x,y);groups[g==='mine'?6:g==='forge'?4+((x+y)&1):((x*7+y*3)%4)].push([x,y])}
  groups.forEach((list,i)=>{if(!list.length)return;const side=HDW?worldSurf(cutaway(phong({color:WTINT[i]})),i===6?I.wl_kopalnia:i>=4?I.wl_kuznia:I.wl_hala,i===6?4:i>=4?3.5:4,'a'):cutaway(phong({map:variants[i],color:0x9a9096}));depthWall(wallGeo,side,2);instanced(wallGeo,[side,side,capMat,capMat,side,side],list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5))});
  const cliffT=texFrom(tcut(Wl,2,3),true);cliffT.repeat.set(1,10);
  const cliffGeo=new THREE.BoxGeometry(1,10,1);cliffGeo.translate(0,-5.03,0);
  instanced(cliffGeo,I.wl_urwisko?worldSurf(phong({color:0xa8a0a8}),I.wl_urwisko,5,'c'):phong({map:cliffT}),cliffs,([x,y])=>M4.makeTranslation(x+.5,0,y+.5),false,true);
  let pilT=texFrom(tcut(Wl,0,2),true);pilT.repeat.set(2,4);if(I.wl_kolumna){pilT=new THREE.Texture(I.wl_kolumna);pilT.wrapS=pilT.wrapT=THREE.RepeatWrapping;pilT.magFilter=THREE.LinearFilter;pilT.minFilter=THREE.LinearMipmapLinearFilter;pilT.generateMipmaps=true;pilT.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());pilT.repeat.set(2,4);pilT.needsUpdate=true}
  const stoneT=texFrom(tcut(F,2,0),true);
  const pilGeo=new THREE.CylinderGeometry(.36,.38,4,8);pilGeo.translate(0,2,0);
  instanced(pilGeo,cutaway(phong({map:pilT,color:I.wl_kolumna?0xd8d0d0:0xffffff})),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
  const baseGeo=new THREE.BoxGeometry(.95,.35,.95);baseGeo.translate(0,.175,0);
  instanced(baseGeo,phong({map:stoneT}),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
  const capGeo=new THREE.BoxGeometry(1.05,.32,1.05);capGeo.translate(0,4.12,0);
  instanced(capGeo,cutaway(phong({map:stoneT})),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
  const bandGeo=new THREE.CylinderGeometry(.395,.395,.14,8);bandGeo.translate(0,1.9,0);
  instanced(bandGeo,cutaway(phong({color:0x4e3c1c})),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
  lavaFrames=[0,1,2,3].map(i=>tcut(F,i,5));
  {const li=I.cc0_lava;if(li&&lavas.length&&(LAVA_HD=lavaHD(li,lavas,-.32,5))){}else if(false){const lt=new THREE.Texture(li);lt.wrapS=lt.wrapT=THREE.RepeatWrapping;lt.magFilter=THREE.LinearFilter;lt.minFilter=THREE.LinearMipmapLinearFilter;lt.generateMipmaps=true;lt.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());lt.needsUpdate=true;
    const pos=[],uv=[],idx=[],RU=5;for(const [x,y] of lavas){const b=pos.length/3;pos.push(x,-.32,y,x+1,-.32,y,x,-.32,y+1,x+1,-.32,y+1);uv.push(x/RU,-y/RU,(x+1)/RU,-y/RU,x/RU,-(y+1)/RU,(x+1)/RU,-(y+1)/RU);idx.push(b,b+2,b+1,b+1,b+2,b+3)}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const mat=liquidMat({map:lt,emissiveMap:lt,emissive:0xff7a30,emissiveIntensity:.75},1),mesh=new THREE.Mesh(g,mat);mesh.castShadow=false;mesh.receiveShadow=false;ROOT.add(mesh);LAVA_HD={tex:lt,mat}}
  else{const lavaGeo=new THREE.PlaneGeometry(1,1);lavaGeo.rotateX(-Math.PI/2);
  instanced(lavaGeo,liquidMat({map:lavaTex,emissiveMap:lavaTex,emissive:0xff8a46,emissiveIntensity:.65},1),lavas,([x,y])=>M4.makeTranslation(x+.5,-.32,y+.5),false,false)}}
  if(I.cc0_lava){const ac=[];for(let x=FT(35);x<FT(40);x++)for(let y=0;y<MH;y++)ac.push([x,y]);lavaHD(I.cc0_lava,ac,-9.4,5,{keep:true,h:[0,0,0],spd:.6})}
  // 15.11.2026: Wielka Waga (kanon: przy niej Poborca wazy urobek) wyrasta z przepasci lawy miedzy halami, na polnoc od mostu; stoi wylacznie nad lawa, sale i most bez zmian
  {const x=MP(37.5),z=MP(14.5),w=7.2,base=-3.9;// obraz: dm_wielka_waga (ChatGPT 15.11.2026); kolumna ucieta dolem, dalej ciemny trzon do lawy
   nbLandmark('assets/rekwizyty/0635cccc967fe045f642756e28989e1c2985e5df565060c54e5e0799454bef6f.webp',{x,z,w,aspect:1536/1022,base,em:0x2a1608});
   const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.62,.7,base+9.4+.3,10),phong({color:0x221e1e,specular:0x3a2a20,shininess:20}));shaft.position.set(x-.12,(base-9.4)/2+.15,z-.25);ROOT.add(shaft);
   const H=w*1536/1022*SQ;W.LSRC.push({col:0xff8a3a,base:1.25,dist:7,x:x+w*.31,y:base+H*.4,z:z+.6,kind:'fire',ph:1.3});W.LSRC.push({col:0xffa060,base:.5,dist:5,x,y:base+H*.75,z:z+.6,kind:'fire',ph:3.1})}
  let abT;{const ai=I.cc0_abyss||(IMGS&&IMGS.cc0_abyss);if(ai){abT=new THREE.Texture(ai);abT.wrapS=abT.wrapT=THREE.RepeatWrapping;abT.generateMipmaps=true;abT.minFilter=THREE.LinearMipmapLinearFilter;abT.magFilter=THREE.LinearFilter;abT.needsUpdate=true;abT.repeat.set((FT(40)-FT(35))/4,MH/4)}else{abT=texFrom(tcut(F,3,6),true);abT.repeat.set(5*MK,MH)}}
  const abyss=new THREE.Mesh(new THREE.PlaneGeometry(FT(40)-FT(35),MH),new THREE.MeshBasicMaterial({map:abT,color:0x8a6a6a}));abyss.rotation.x=-Math.PI/2;abyss.position.set((FT(35)+FT(40))/2,-10,MH/2);ROOT.add(abyss);
  const brT=texFrom(tcut(F,2,4),true);brT.repeat.set(5,2);
  // most: kamien HD jak reszta posadzki (stary kafel pikselowy zostaje tylko jako zapas, gdy tekstury brak)
  const brHD=k=>I[k]?worldSurf(phong({color:0xb4acb0}),I[k],3.2,'c'):null;
  const bridge=new THREE.Mesh(new THREE.BoxGeometry(FT(40)-FT(35),.3,FT(26)-FT(22)),brHD('wl_halacap')||phong({map:brT}));bridge.position.set((FT(35)+FT(40))/2,-.15,(FT(22)+FT(26))/2);bridge.receiveShadow=true;bridge.castShadow=true;ROOT.add(bridge);
  for(const z of [FT(22)+.08,FT(26)-.08]){const rail=new THREE.Mesh(new THREE.BoxGeometry(FT(40)-FT(35),.34,.14),brHD('wl_hala')||phong({map:stoneT}));rail.position.set((FT(35)+FT(40))/2,.17,z);rail.castShadow=true;rail.receiveShadow=true;ROOT.add(rail)}
  const R={brazier_0:[0,0,32,32],brazier_1:[32,0,32,32],brazier_2:[64,0,32,32],brazier_3:[96,0,32,32],king_statue:[0,32,32,64],anvil:[32,32,32,32],mine_cart:[64,32,32,32],pickaxe_rack:[96,32,32,32],
    healing_shrine:[32,64,32,32],depleted_shrine:[64,64,32,32],chains:[96,64,32,32],fallen_pillar:[0,96,64,32],dwarf_bones:[64,96,32,32],bellows:[96,96,32,32],furnace_0:[0,128,64,32],furnace_1:[64,128,64,32],
    sarcophagus:[0,160,32,32],rune_lantern:[32,160,32,32],black_powder:[64,160,32,32],clan_banner:[96,160,32,32]};
  const TR={chapel_stairs:[0,0,64,32],gate_closed:[64,0,64,32],gate_half_open:[0,32,64,32],gate_open:[64,32,64,32]};
  const fr=(img,rc)=>procFrame(img,rc[0],rc[1],rc[2],rc[3],'prop');
  const PF={};for(const k in R)PF[k]=I['p2_'+k]?fr(I['p2_'+k],[0,0,R[k][2],R[k][3]]):fr(I.dm_props,R[k]);for(const k in TR)PF[k]=fr(I.trans,TR[k]);
  for(const [x,y] of braziers){const frames=[0,1,2,3].map(i=>PF['brazier_'+i]);propObjs.push({mesh:mkProp(frames,x+.5,y+.92,R.brazier_0),frames,fps:6,ph:Math.random()*3})}
  for(const p of PROPS){
    let frames,rc;
    if(p.anim==='furnace'){frames=[PF.furnace_0,PF.furnace_1];rc=R.furnace_0}
    else if(p.gate){frames=[PF.gate_closed,PF.gate_half_open,PF.gate_open];rc=TR.gate_closed}
    else if(p.shrine!==undefined){frames=[PF.healing_shrine,PF.depleted_shrine];rc=R.healing_shrine}
    else{frames=[PF[p.k]];rc=R[p.k]||TR[p.k]}
    const o={mesh:mkProp(frames,p.x,p.y,rc),frames,fps:p.anim?6:0,ph:Math.random()*3,kind:p.gate?'gate':p.shrine!==undefined?'shrine':p.anim?'anim':'static',si:p.shrine};
    if(p.k==='dwarf_bones'){o.mesh.castShadow=false}
    if(p.flip)o.mesh.scale.x*=-1;// 15.11.2026: odbicie lustrzane par (symetria)
    p.obj=o;propObjs.push(o);
  }
}

// Crypt meshes: the Lower City floor (M4), carved hall walls (M5), its props (M6) and the chapel stairs (M8)
function buildDungeon(I){planGround(9);
  const F=I.dm_floor,Wl=I.dm_walls,r=rng(W.seed||5);
  const fc=canvas(WW,WH),fg=fc.getContext('2d');
  const tile=(c,row,tx,ty)=>groundTile(fg,F,c,row,tx,ty);
  for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){let t=tileAt(tx,ty);const rc=(r()*8)|0;if(t===31)t=W.under[ty*MW+tx]||20;
    if(t===21||t===26)tile(rc,2,tx,ty);else tile(rc,0,tx,ty)}
  floorAO(fg,new Set([22,31]));
  groundDetails(fg);
  const floor=new THREE.Mesh(floorGeo,groundMaterial(phong({map:surfaceTex(fc),alphaTest:.5,color:0x8a8088})));floor.position.set(MW/2,0,MH/2);floor.receiveShadow=true;ROOT.add(floor);
  const HDW=!!(I.wl_hala&&I.wl_halacap),capMat=HDW?worldSurf(cutaway(phong({color:0xc0b8c0})),I.wl_halacap,3,'a'):cutaway(phong({map:texFrom(tcut(Wl,1,6),true)}));
  const wallGeo=new THREE.BoxGeometry(1,3,1);wallGeo.translate(0,1.5,0);
  const variants=[0,1,2,3].map(i=>stackTex(Wl,[[(i*3)%8,0],[(i*2+1)%8,1],[(i*5+4)%8,0]]));
  const groups=variants.map(()=>[]);for(const [x,y] of walls)groups[(x*7+y*3)%4].push([x,y]);
  groups.forEach((list,i)=>{if(!list.length)return;const side=HDW?worldSurf(cutaway(phong({color:0xbfb7bf})),I.wl_hala,4,'a'):cutaway(phong({map:variants[i],color:0x8a8088}));instanced(wallGeo,[side,side,capMat,capMat,side,side],list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5))});
  let pilT=texFrom(tcut(Wl,0,2),true);pilT.repeat.set(2,4);if(I.wl_kolumna){pilT=new THREE.Texture(I.wl_kolumna);pilT.wrapS=pilT.wrapT=THREE.RepeatWrapping;pilT.magFilter=THREE.LinearFilter;pilT.minFilter=THREE.LinearMipmapLinearFilter;pilT.generateMipmaps=true;pilT.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());pilT.repeat.set(2,4);pilT.needsUpdate=true}
  const stoneT=texFrom(tcut(F,2,0),true);
  const pilGeo=new THREE.CylinderGeometry(.36,.38,4,8);pilGeo.translate(0,2,0);
  instanced(pilGeo,cutaway(phong({map:pilT,color:I.wl_kolumna?0xd8d0d0:0xffffff})),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
  const baseGeo=new THREE.BoxGeometry(.95,.35,.95);baseGeo.translate(0,.175,0);
  instanced(baseGeo,phong({map:stoneT}),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
  const capGeo=new THREE.BoxGeometry(1.05,.32,1.05);capGeo.translate(0,4.12,0);
  instanced(capGeo,cutaway(phong({map:stoneT})),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
  const R={brazier_0:[0,0,32,32],brazier_1:[32,0,32,32],brazier_2:[64,0,32,32],brazier_3:[96,0,32,32],king_statue:[0,32,32,64],anvil:[32,32,32,32],mine_cart:[64,32,32,32],pickaxe_rack:[96,32,32,32],
    healing_shrine:[32,64,32,32],depleted_shrine:[64,64,32,32],chains:[96,64,32,32],fallen_pillar:[0,96,64,32],dwarf_bones:[64,96,32,32],sarcophagus:[0,160,32,32],rune_lantern:[32,160,32,32],clan_banner:[96,160,32,32]};
  const TR={chapel_stairs:[0,0,64,32]};
  const PF={};for(const k in R)PF[k]=I['p2_'+k]?procFrame(I['p2_'+k],0,0,R[k][2],R[k][3],'prop'):procFrame(I.dm_props,...R[k],'prop');for(const k in TR)PF[k]=procFrame(I.trans,...TR[k],'prop');if(I.p2_chapel_stairs){TR.chapel_stairs=[0,0,32,32];PF.chapel_stairs=procFrame(I.p2_chapel_stairs,0,0,32,32,'prop')}
  for(const [x,y] of braziers){const frames=[0,1,2,3].map(i=>PF['brazier_'+i]);propObjs.push({mesh:mkProp(frames,x+.5,y+.92,R.brazier_0),frames,fps:6,ph:Math.random()*3})}
  for(const p of PROPS){const sh=p.shrine!==undefined,frames=sh?[PF.healing_shrine,PF.depleted_shrine]:[PF[p.k]],rc=R[p.k]||TR[p.k];
    const o={mesh:mkProp(frames,p.x,p.y,rc),frames,fps:0,ph:0,kind:sh?'shrine':'static',si:p.shrine};if(p.k==='dwarf_bones')o.mesh.castShadow=false;p.obj=o;propObjs.push(o)}
}

// Chapter III (technical number 6): Solne Nabrzeze, the river harbour between the Lower City lift and the ferry to Goldheim.
// 15.11.2026 (symetria): [x na DUZEJ mapie, y w siatce portu, kierunek ramienia]. x podany wprost na duzej mapie, bo rozciaganie siatki (MP) psulo rowne odstepy par.
// Kazda para stoi rowno wzgledem swojego miejsca (szyja trapu, trakt, plac, kolowroty, pomosty), zachodnia latarnia jest odbiciem lustrzanym wschodniej (ramiona na zewnatrz).
// Usuniete: latarnia uliczna ze srodka skladu i dwie, ktore wypadaly w wodzie (nigdy sie nie rysowaly). Pojedyncza przy trakcie zastapiona para.
const PORT_LAMPS=[[49.8,10.6,-1],[57.2,10.6,1],[43,19,-1],[64,19,1],[18.8,15.6,-1],[89.7,15.6,1],[48.4,40,-1],[56.6,40,1],[46.5,46,-1],[58.5,46,1],[20.4,47.6,-1],[84.6,47.6,1],[20,30.2,-1],[93.8,30.2,1]];
const PORT_PROP_SIZE={winch:[2.25,1.85],crane:[4.8,5.2],cargo:[1.8,1.65],salt:[1.65,1.45],bollard:[1.05,1.05],
 lodz:[3.0,3.0],pale:[1.75,1.75],skrzynia:[1.4,1.4],siec:[1.6,1.6],kotwica:[1.75,1.75],beczka_ryby:[1.5,1.5],malze:[1.8,1.8],ikra:[1.6,1.6],deski:[1.7,1.7],pacholek:[1.35,1.35],wiecierz:[1.45,1.45],wrak:[1.9,1.9]};// nowe: klatki kwadratowe
// atlas zbutwialych rekwizytow (15.11.2026): 4x3 klatki po 256 px, rzedami jak w PORT_REK
const PORT_REK=[['lodz','pale','skrzynia','siec'],['kotwica','beczka_ryby','malze','ikra'],['deski','pacholek','wiecierz','wrak']];// szerokosc i wysokosc w jednostkach swiata (1 j. = ok. 125 cm)
const PORT_SHIP=[52,8.7,14.4],PORT_FERRY_ART=[32.5,7.9,8.6,6.4];
// 18.11.2026 (port w bryle, decyzja autora): statek, prom, zuraw, kolowroty, skrzynie, beczki, worki z sola i pale portu jako geometria 3D zamiast plaskich obrazkow.
// Tylko wyglad: kolizje zostaja na kaflach (02_swiaty.js). Porownanie przed: ?port3d=0 (tylko lokalnie).
const PORT3D_ON=nbParam('port3d')!=='0';
// 18.11.2026: zuraw zostaje malowanym obrazkiem (decyzja autora: obrazek ladniejszy od bryly)
// 19.11.2026: worki z sola tez wracaja do obrazka (bryly wygladaly jak blade kule)
const PORT_TRI={winch:'kolowrot',cargo:'ladunek',salt:'worki_soli',bollard:'pacholek_cumowniczy',skrzynia:'skrzynia',beczka_ryby:'beczka_ryb',pacholek:'pacholek',pale:'pale',siec:'siec',kotwica:'kotwica',malze:'malze',ikra:'ikra',deski:'deski',wiecierz:'wiecierz',wrak:'wrak'};// 23.11.2026: modele TripoSG (lodz, prom, zuraw bez zmian)
const PORT3D_KEYS=new Set(['cargo','skrzynia','beczka_ryby','bollard','pacholek','winch','pale','lodz']);
function port3dKit(){
 const kit=new Map(),M=new THREE.Matrix4(),E=new THREE.Euler(),Qk=new THREE.Quaternion(),Pv=new THREE.Vector3(),Sv=new THREE.Vector3();
 const put=(geo,mat,base,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0)=>{E.set(rx,ry,rz);Qk.setFromEuler(E);M.compose(Pv.set(x,y,z),Qk,Sv.set(sx,sy,sz));const k=geo.uuid+'|'+mat.uuid;let e=kit.get(k);if(!e)kit.set(k,e={geo,mat,list:[]});e.list.push(base.clone().multiply(M))};
 const at=(x,z,ry=0,s=1,y=0,flip=false)=>new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(0,ry,0)),new THREE.Vector3(flip?-s:s,s,s));
 /* 19.11.2026: bryly portu nie rzucaja cieni od swiatla bohatera (cien punktowy = 6 przebiegow na kazda bryle, podwajal wywolania rysowania i obciazenie procesora); maja plamy cienia pod spodem */
 const finish=(parent,cast=false)=>{for(const {geo,mat,list} of kit.values()){const im=new THREE.InstancedMesh(geo,mat,list.length);list.forEach((m,i)=>im.setMatrixAt(i,m));im.castShadow=cast;im.receiveShadow=true;im.frustumCulled=false;parent.add(im)}kit.clear()};
 return {put,at,finish}}
// tekstury rysowane w kodzie: lina, juta i zwiniety zagiel
function port3dTex(kind){const c=canvas(64,64),g=c.getContext('2d');
 if(kind==='rope'){g.fillStyle='#7a6646';g.fillRect(0,0,64,64);for(let i=-64;i<128;i+=8){g.strokeStyle='#a48b62';g.lineWidth=4;g.beginPath();g.moveTo(i,0);g.lineTo(i+32,64);g.stroke();g.strokeStyle='#4e3f2a';g.lineWidth=1.2;g.beginPath();g.moveTo(i+3.5,0);g.lineTo(i+35.5,64);g.stroke()}}
 else if(kind==='jute'){g.fillStyle='#8a7756';g.fillRect(0,0,64,64);for(let i=0;i<64;i+=3){g.fillStyle=i%6?'rgba(40,30,18,.22)':'rgba(220,205,170,.16)';g.fillRect(i,0,1,64);g.fillRect(0,i,64,1)}for(let n=0;n<70;n++){g.fillStyle='rgba(235,238,236,'+(.15+Math.random()*.3).toFixed(2)+')';g.fillRect(Math.random()*64,Math.random()*64,1.5,1.5)}}
 else{g.fillStyle='#2b2f3a';g.fillRect(0,0,64,64);g.fillStyle='rgba(110,30,34,.55)';g.fillRect(8,6,18,22);g.fillRect(38,34,14,20);for(let i=0;i<64;i+=4){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(0,i,64,1)}for(let n=0;n<90;n++){g.fillStyle='rgba(150,160,175,'+(Math.random()*.12).toFixed(2)+')';g.fillRect(Math.random()*64,Math.random()*64,2,1)}}
 const t=texFrom(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;return t}
// kadlub lodzi: przekroje wzdluz dlugosci (dziob na -x, rufa na +x), deski biegna wzdluz burt
function port3dHull(L,B,D,H,N=26,M=12){const pos=[],uv=[],idx=[],deck=[],duv=[],didx=[];
 const half=t=>Math.max(.03,B/2*Math.pow(Math.sin(Math.PI*Math.min(.999,Math.max(.001,t))),t>.5?.42:.62));
 const top=t=>H*(1+.42*Math.pow(2*t-1,2)*(t>.5?1.35:1)),keel=t=>-D*Math.pow(Math.sin(Math.PI*t),.35);
 for(let i=0;i<=N;i++){const t=i/N,x=(t-.5)*L,b=half(t),yt=top(t),yk=keel(t);let arc=0,px=null;
  for(let j=0;j<=M;j++){const a=(j/M*2-1)*Math.PI/2,z=b*Math.sin(a),y=yt-(yt-yk)*Math.pow(Math.cos(a),.75);if(px)arc+=Math.hypot(z-px[0],y-px[1]);px=[z,y];pos.push(x,y,z);uv.push(arc/1.6,x/1.6)}}
 for(let i=0;i<N;i++)for(let j=0;j<M;j++){const a=i*(M+1)+j,b=a+M+1;idx.push(a,b,a+1,b,b+1,a+1)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
 const dy=H*.45;for(let i=0;i<=N;i++){const t=i/N,x=(t-.5)*L,b=half(t)*.93;deck.push(x,dy,-b,x,dy,b);duv.push(-b/1.4,x/1.4,b/1.4,x/1.4)}
 for(let i=0;i<N;i++){const a=i*2;didx.push(a,a+2,a+1,a+1,a+2,a+3)}
 const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.Float32BufferAttribute(deck,3));dg.setAttribute('uv',new THREE.Float32BufferAttribute(duv,2));dg.setIndex(didx);dg.computeVertexNormals();
 return {hull:g,deck:dg,half,top,deckY:dy}}
function port3dBuild(I,ROOT){
 const K=port3dKit(),{put,at}=K,hash=(x,y)=>{const s=Math.sin(x*91.7+y*47.3)*43758.5453;return s-Math.floor(s)};
 const BOX=new THREE.BoxGeometry(1,1,1),CYL=new THREE.CylinderGeometry(1,1,1,14),CYL6=new THREE.CylinderGeometry(1,1,1,8),TOR=new THREE.TorusGeometry(1,.16,6,18),SPH=new THREE.SphereGeometry(1,14,10);
 const BARREL=new THREE.LatheGeometry([[0,0],[.40,0],[.465,.22],[.5,.5],[.465,.78],[.40,1],[0,1]].map(([a,b])=>new THREE.Vector2(a,b)),16);
 // tekstury wyciete z malowanego atlasu portu (te same obrazy co dawne rekwizyty), wiec bryly zachowuja styl gry
 const A=I.port_atlas,cropT=(x,y,w,h,rot=0,rx=1,ry=1)=>{const c=canvas(128,128),g=c.getContext('2d');g.drawImage(A,x,y,w,h,0,0,128,128);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=4;if(rot){t.center.set(.5,.5);t.rotation=rot}t.repeat.set(rx,ry);return t};
 const pm=(t,k=.86,cut=false,e=0x040302)=>{const m=phong({map:t,emissive:e});m.color.setRGB(k,k*.98,k*.94);return cut?cutaway(m):m};
 const tCrate=cropT(1062,700,138,135),tBarrel=cropT(1352,805,100,130,0,3,1),tRope=cropT(700,140,110,135,Math.PI/2),tRopeT=cropT(700,140,110,135,0,4,1),tBeam=cropT(603,95,42,155),tBeamH=cropT(603,95,42,155,Math.PI/2),tPost=cropT(615,720,73,220,0,2,1),tJute=cropT(320,690,75,70),tDeck=cropT(180,200,200,120,Math.PI/2,1,1);
 const crateM=pm(tCrate,.78),barrelM=pm(tBarrel,.82),ropeM=pm(tRope,.74),ropeT=pm(tRopeT,.66),beam=pm(tBeam),beamH=pm(tBeamH),post=pm(tPost,.9),jute=pm(tJute,.82),deck=pm(tDeck,.85);
 const stone=worldSurf(phong({emissive:0x08090a}),I.port_plyty,1.6,'p3dStone');stone.color.setRGB(1.0,1.03,1.04);
 const iron=phong({color:0x55575a,shininess:34,specular:0x4a535c,emissive:0x070707});
 const salt=phong({color:0xaeb4b6,shininess:30,specular:0x1e2224}),sail=phong({map:port3dTex('sail'),color:0xc8c8d0,side:THREE.DoubleSide});
 const sub=(b,x,z,ry=0,y=0)=>b.clone().multiply(at(x,z,ry,1,y));
 // --- elementy
 const crate=(b0,x,z,s,ry,y=0)=>{const b=sub(b0,x,z,ry,y);put(BOX,crateM,b,0,s/2,0,s,s,s)};
 const barrel=(b,x,z,r,h,withRope)=>{put(BARREL,barrelM,b,x,0,z,r*2,h,r*2);if(withRope)put(TOR,ropeT,b,x,h*.62,z,r*1.03,r*1.03,r*1.03,Math.PI/2)};
 const sack=(b,x,z,s,ry,open)=>{put(SPH,jute,b,x,s*.55,z,s*.5,s*.6,s*.42,0,ry);put(CYL6,jute,b,x,s*1.12,z,.07*s,.22*s,.07*s);put(TOR,ropeT,b,x,s*1.05,z,.09*s,.09*s,.09*s,Math.PI/2);if(open)put(SPH,salt,b,x,s*.95,z,s*.36,s*.12,s*.3,0,ry)};
 const coil=(b,x,z,r)=>{for(let k=0;k<3;k++)put(TOR,ropeT,b,x,.04+k*.05,z,r-k*.02,r-k*.02,r*.9,Math.PI/2)};
 // --- modele rekwizytow (wymiary w jednostkach swiata, 1 j. = ok. 125 cm)
 const MODEL={
  cargo:(b,h)=>{crate(b,-.28,-.12,.78,.08+h*.2);crate(b,.34,.24,.56,-.12+h*.3);if(h>.45)crate(b,-.3,-.12,.44,.5+h,.78);barrel(b,.48,-.36,.27,.74,true)},
  skrzynia:(b,h)=>{crate(b,0,0,.72,h*.4-.2)},
  beczka_ryby:(b,h)=>{barrel(b,-.12,0,.3,.82,true);barrel(b,.38,.22,.24,.6,false)},
  salt:(b,h)=>{for(const z of [-.42,0,.42])put(BOX,beamH,b,0,.05,z,1.3,.1,.14);for(const x of [-.5,0,.5])put(BOX,beam,b,x,.13,0,.18,.05,1.0);sack(b,-.36,-.12,.72,.3,false);sack(b,.26,-.2,.62,-.4,false);sack(b,-.05,.25,.66,.1,true);put(SPH,salt,b,.45,.0,.45,.28,.12,.24)},
  bollard:(b,h)=>{for(const [x,z,hh] of [[-.15,-.06,1.0],[.17,-.1,.78],[.02,.2,.86]])put(CYL6,post,b,x,hh/2,z,.17,hh,.17,0,h*6);for(const y of [.32,.56])put(TOR,ropeT,b,0,y,.01,.42,.42,.42,Math.PI/2);coil(b,.46,.36,.24)},
  pacholek:(b,h)=>{put(CYL,post,b,0,.36,0,.2,.72,.2);put(CYL,iron,b,0,.74,0,.24,.06,.24);put(BOX,beamH,b,0,.52,0,.62,.09,.09,0,h*3);put(TOR,ropeT,b,0,.3,0,.24,.24,.24,Math.PI/2);coil(b,.34,.3,.2)},
  pale:(b,h)=>{for(const [x,z,hh,tl] of [[-.32,-.1,1.25,.06],[.08,.12,.95,-.08],[.4,-.05,1.4,.05],[-.05,-.35,.7,-.1]])put(CYL6,post,b,x,-.75+hh/2,z,.13,hh+.6,.13,tl,h*5,tl*.7)},
  winch:(b,h)=>{for(const z of [-.45,.45])put(BOX,beamH,b,0,.08,z,1.95,.16,.2);for(const x of [-.78,.78])put(BOX,beamH,b,x,.08,0,.2,.16,1.1,0,Math.PI/2);
   for(const x of [-.72,.72]){for(const s of [-1,1])put(BOX,beam,b,x,.62,s*.21,.17,1.25,.17,-s*.36,0,0);put(BOX,beam,b,x,1.2,0,.22,.2,.34);put(BOX,beamH,b,x,.42,0,.12,.12,.8,0,Math.PI/2)}
   put(CYL,ropeM,b,0,1.0,0,.36,1.1,.36,0,0,Math.PI/2);for(const x of [-.6,.6])put(CYL,iron,b,x,1.0,0,.47,.07,.47,0,0,Math.PI/2);put(CYL,iron,b,0,1.0,0,.06,1.95,.06,0,0,Math.PI/2);
   put(CYL,iron,b,.88,1.0,0,.4,.07,.4,0,0,Math.PI/2);for(let k=0;k<14;k++){const a=k/14*Math.PI*2;put(BOX,iron,b,.88,1.0+Math.sin(a)*.43,Math.cos(a)*.43,.07,.07,.07,a)}
   put(BOX,iron,b,1.0,.84,0,.05,.38,.06);put(CYL,beam,b,1.12,.68,0,.05,.26,.05,0,0,Math.PI/2)},
  lodz:(b,h)=>{const L=2.5,hull=P3_SMALL;put(hull.hull,deck,b,0,-.2,0,1,1,1);put(hull.deck,beam,b,0,-.3,0,1,1,1);for(const x of [-.5,.35])put(BOX,beamH,b,x,-.2+hull.deckY+.12,0,.16,.05,hull.half(.5+x/L)*1.75,0,Math.PI/2);put(BOX,beamH,b,.2,-.2+hull.deckY+.07,.15,1.1,.04,.12,0,.35)}
 };
 const P3_SMALL=port3dHull(2.5,1.0,.32,.38,18,9);
 return {K,MODEL,mats:{wood:deck,woodDark:deck,beam,beamH,iron,rope:ropeT,jute,salt,sail,stone,post,deck},geos:{BOX,CYL,CYL6,TOR,SPH},barrel,sack,coil,crate,hash,sub}}
// koga Zakonu na kotwicy: kadlub, poklad, kasztel rufowy, maszt z rejka i zwinietym zaglem, olinowanie, latarnia na rufie
// 19.11.2026: deski kadluba i pokladu rysowane w kodzie (pasy wzdluz statku, szwy, smola, gwozdzie); wczesniej kadlub mial blada teksture pokladu promu
function port3dPlanks(base,light){const c=canvas(256,256),g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,256,256);for(let i=0;i<8;i++){const x=i*32,v=(Math.sin(i*12.9)*.5+.5);g.fillStyle='rgba('+(light?'255,235,200':'200,170,130')+','+(.04+v*.08).toFixed(3)+')';g.fillRect(x+2,0,28,256);g.fillStyle='rgba(0,0,0,.55)';g.fillRect(x,0,2,256);for(let y=(i*71)%200;y<256;y+=220){g.fillStyle='rgba(0,0,0,.45)';g.fillRect(x,y,32,2);g.fillStyle='rgba(30,25,20,.7)';g.fillRect(x+6,y+5,2,2);g.fillRect(x+24,y+5,2,2)}}for(let n=0;n<260;n++){g.fillStyle='rgba(0,0,0,'+(Math.random()*.12).toFixed(3)+')';g.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*3,4+Math.random()*16)}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t}
function port3dShip(P,x,z,y){const {K,mats,geos,barrel,sack,coil}=P,{put,at}=K,{BOX,CYL,CYL6,TOR}=geos,{iron,rope,sail,beam,beamH}=mats;
 const hullT=port3dPlanks('#3b2c21',false),deckT=port3dPlanks('#6b5641',true);hullT.repeat.set(1.2,.35);deckT.repeat.set(1.1,.35);
 const woodDark=phong({map:hullT,color:0xc8beb4,shininess:22,specular:0x2a3036,emissive:0x050403,side:THREE.DoubleSide}),wood=phong({map:deckT,color:0xd8ccbe,shininess:8,specular:0x161a1e,emissive:0x060504,side:THREE.DoubleSide}),wale=phong({color:0x5c2a22,shininess:16,specular:0x241a18,emissive:0x080303}),rail=phong({map:deckT,color:0x9a8a7a,emissive:0x050403});
 const L=12.6,B=4.3,h=port3dHull(L,B,1.7,1.35),grp=new THREE.Group(),b=at(0,0);grp.position.set(x,y,z);
 put(h.hull,woodDark,b,0,0,0,1,1,1);put(h.deck,wood,b,0,0,0,1,1,1);
 // relingi wzdluz burt
 const N=20;for(const s of [-1,1])for(let i=1;i<N;i++){const t0=i/N,t1=(i+1)/N,x0=(t0-.5)*L,x1=(t1-.5)*L,z0=s*h.half(t0),z1=s*h.half(t1),y0=h.top(t0),y1=h.top(t1);
  put(BOX,rail,b,(x0+x1)/2,(y0+y1)/2+.04,(z0+z1)/2,Math.hypot(x1-x0,z1-z0)+.02,.12,.16,0,-Math.atan2(z1-z0,x1-x0),Math.atan2(y1-y0,x1-x0));put(BOX,wale,b,(x0+x1)/2,(y0+y1)/2-.34,(z0+z1)/2*1.012,Math.hypot(x1-x0,z1-z0)+.03,.2,.08,0,-Math.atan2(z1-z0,x1-x0),Math.atan2(y1-y0,x1-x0));
  if(i%2===0)put(BOX,woodDark,b,x0,y0-.25,z0*.97,.12,.55,.12)}
 // kasztel rufowy
 const cx0=L/2-3.1,cx1=L/2-.7,cy=h.top(.83)+.25,cw=h.half(.8)*1.75;put(BOX,wood,b,(cx0+cx1)/2,cy,0,cx1-cx0,.16,cw);put(BOX,woodDark,b,cx0,cy-.55,0,.16,1.1,cw*.98);
 for(const s of [-1,1]){put(BOX,woodDark,b,(cx0+cx1)/2,cy+.62,s*cw/2,cx1-cx0,.1,.1);for(let k=0;k<=4;k++)put(BOX,woodDark,b,cx0+(cx1-cx0)*k/4,cy+.32,s*cw/2,.1,.6,.1)}
 put(BOX,woodDark,b,cx0,cy+.62,0,.1,.1,cw);for(let k=0;k<=3;k++)put(BOX,woodDark,b,cx0,cy+.32,-cw/2+cw*k/3,.1,.6,.1);
 // maszt, rejka i zwiniety zagiel
 const mx=-1.0,dk=h.deckY,mh=8.6;put(CYL,beam,b,mx,dk+mh/2,0,.22,mh,.22);put(CYL,beam,b,mx,dk+mh+.15,0,.12,.3,.12);for(const yy of [1.2,1.45,4.4])put(TOR,rope,b,mx,dk+yy,0,.23,.23,.23,Math.PI/2);
 const ry=dk+mh-1.1;put(CYL,beamH,b,mx,ry,0,.12,7.2,.12,Math.PI/2);put(CYL,sail,b,mx,ry-.32,0,.3,6.6,.36,Math.PI/2);for(let k=-3;k<=3;k++)put(TOR,rope,b,mx,ry-.3,k*.95,.33,.33,.33);
 // olinowanie: wanty do burt, sztag do dziobu i rufy
 const top=new THREE.Vector3(mx,dk+mh-.2,0),line=(a,c)=>{const d=c.clone().sub(a),m=a.clone().add(c).multiplyScalar(.5),q=new THREE.Quaternion().setFromUnitVectors(UP,d.clone().normalize()),mm=new THREE.Matrix4().compose(m,q,new THREE.Vector3(.025,d.length(),.025));K.put(CYL6,rope,b.clone().multiply(mm),0,0,0,1,1,1)};
 for(const s of [-1,1])for(const dx of [-.9,0,.9])line(top,new THREE.Vector3(mx+dx,h.top((mx+dx)/L+.5)+.05,s*h.half((mx+dx)/L+.5)*.98));
 line(top,new THREE.Vector3(-L/2+.3,h.top(.02)+.1,0));line(top,new THREE.Vector3(cx0+.2,cy+.62,0));
 for(const s of [-1,1])line(new THREE.Vector3(mx,ry,s*3.5),new THREE.Vector3(mx+(s>0?2.6:-2.4),h.top(.5)+.1,s*h.half(.5)*.95));
 // ladunek, luk i latarnia
 put(BOX,woodDark,b,1.2,dk+.1,0,1.4,.14,1.0);for(const k of [-.35,0,.35])put(BOX,iron,b,1.2+k,dk+.18,0,.06,.03,.9);
 {const bd=at(0,0,0,1,dk);sack(bd,-3.2,.6,.62,.2,false);sack(bd,-2.7,.95,.58,-.3,false);sack(bd,-3.0,1.15,.55,.6,true);barrel(bd,-.3,-.9,.3,.72,true);coil(bd,.4,1.0,.3)}
 const lx=L/2-.55,ly=cy+1.25,lz=cw*.42;put(BOX,woodDark,b,lx,cy+.65,lz,.08,1.3,.08);put(BOX,woodDark,b,lx-.2,ly+.12,lz,.45,.06,.06);
 const lamp=new THREE.Mesh(new THREE.BoxGeometry(.2,.28,.2),new THREE.MeshBasicMaterial({color:0xf4c480}));lamp.position.set(lx-.38,ly-.08,lz);grp.add(lamp);
 K.finish(grp);return {grp,lamp:[x+lx-.38,y+ly-.08,z+lz]}}
/* 23.11.2026 (autor: poręcz wokół pomostu): lina jako osobny element na słupkach wzdłuż krawędzi pomostów nad wodą,
   na narożnikach słupek z dwoma żelaznymi mocowaniami. Tylko oprawa: kolizje bez zmian. Prom (PORT_FERRY_DECK) bez liny. */
function portRopeRail(ground,wood){
 wood=worldSurfN(phong({color:0xd8d0c8}),'tsn1_dab_portowy',1.3,1);// 23.11.2026: dab portowy autora
 const IN=.4,isW=(x,y)=>ground(x,y)===45,isD=(x,y)=>ground(x,y)===43;
 const [fx,fy,fw,fh]=PORT_FERRY_DECK,fx0=FT(fx)-1,fx1=FT(fx+fw)+1,fy0=FT(fy)-1,fy1=FT(fy+fh)+1;
 const ferry=(x,y)=>x>=fx0&&x<fx1&&y>=fy0&&y<fy1;
 const edgeOk=(x,y,dx,dy)=>isD(x,y)&&!ferry(x,y)&&isW(x+dx,y+dy);
 const runs=[];
 // przebiegi: dla kazdej strony wody (dx,dy) zbieramy ciagle odcinki kafli pomostu wzdluz krawedzi
 for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const along=dx?[0,1]:[1,0];
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){if(!edgeOk(x,y,dx,dy)||edgeOk(x-along[0],y-along[1],dx,dy))continue;
   let n=0;while(edgeOk(x+along[0]*n,y+along[1]*n,dx,dy))n++;
   const endAdj=(tx,ty,sx,sy)=>{/* konec przebiegu: wypukly naroznik (dalej woda) skraca, wklesly (dalej pomost z ladem po stronie wody) wydluza */
    const nx=tx+sx,ny=ty+sy;if(isW(nx,ny))return{d:-(.5-IN),c:1};if(isD(nx,ny)&&!ferry(nx,ny)&&!isW(nx+dx,ny+dy))return{d:.5-IN,c:1};return{d:-.08,c:0}};
   const a=endAdj(x,y,-along[0],-along[1]),b=endAdj(x+along[0]*(n-1),y+along[1]*(n-1),along[0],along[1]);
   const line=dx?x+.5+dx*IN:y+.5+dy*IN,s0=(dx?y:x)-a.d,s1=(dx?y:x)+n+b.d;
   runs.push({dx,dy,line,s0,s1,c0:a.c,c1:b.c})}}
 if(!runs.length)return;
 const P=(r,s)=>r.dx?[r.line,s]:[s,r.line];
 const posts=[],corners=new Map(),mounts=[],spans=[];
 for(const r of runs){const L=r.s1-r.s0;if(L<.6)continue;const n=Math.max(1,Math.round(L/1.9));
  for(let i=0;i<=n;i++){const s=r.s0+L*i/n,[px,pz]=P(r,s),end=(i===0&&r.c0)||(i===n&&r.c1);
   const rot=r.dx?Math.PI/2:0;
   if(end){const k=Math.round(px*20)+','+Math.round(pz*20);if(!corners.has(k))corners.set(k,[px,pz]);
    /* mocowanie od strony tego przebiegu */const sg=i===0?1:-1;mounts.push(r.dx?[px,pz+sg*.11,rot]:[px+sg*.11,pz,rot])}
   else{posts.push([px,pz,(Math.sin(px*12.9+pz*78.2)*43758.5)%1]);mounts.push([px,pz,rot])}
   if(i<n){const [qx,qz]=P(r,r.s0+L*(i+1)/n);spans.push([px,pz,qx,qz])}}}
 // slupki: prosty pal z czapka; naroznik grubszy i wyzszy
 instanced(new THREE.CylinderGeometry(.075,.09,1.05,6),wood,posts,([x,z,j])=>{M4.makeRotationY(j*6);M4.setPosition(x,.42,z);return M4});
 const cl=[...corners.values()];
 instanced(new THREE.BoxGeometry(.2,1.25,.2),wood,cl,([x,z])=>M4.makeTranslation(x,.52,z));
 instanced(new THREE.BoxGeometry(.26,.07,.26),wood,cl,([x,z])=>M4.makeTranslation(x,1.17,z));
 const iron=phong({color:0x3a3634,shininess:30,specular:0x262220});
 instanced(new THREE.TorusGeometry(.055,.018,5,10),iron,mounts,([x,z,r])=>{M4.makeRotationY(r);M4.setPosition(x,.86,z);return M4});
 // lina: lekko zwisajaca miedzy slupkami, jedna scalona siatka
 const pos=[],nor=[],uvs=[],RS=6,SEG=8,R=.028,up=new THREE.Vector3(0,1,0),t=new THREE.Vector3(),b=new THREE.Vector3(),nn=new THREE.Vector3();
 for(const [ax,az,bx,bz] of spans){const L=Math.hypot(bx-ax,bz-az),sag=Math.min(.16,.06*L);
  t.set(bx-ax,0,bz-az).normalize();b.crossVectors(t,up).normalize();
  const ring=[];for(let i=0;i<=SEG;i++){const u=i/SEG,cx=ax+(bx-ax)*u,cz=az+(bz-az)*u,cy=.86-sag*4*u*(1-u);const rr=[];
   for(let k=0;k<RS;k++){const g=k/RS*Math.PI*2;nn.copy(up).multiplyScalar(Math.cos(g)).addScaledVector(b,Math.sin(g));rr.push([cx+nn.x*R,cy+nn.y*R,cz+nn.z*R,nn.x,nn.y,nn.z,u*L/.16,k/RS])}ring.push(rr)}
  for(let i=0;i<SEG;i++)for(let k=0;k<RS;k++){const k2=(k+1)%RS,w=k2?0:1,q=[[i,k,0],[i+1,k,0],[i+1,k2,w],[i,k,0],[i+1,k2,w],[i,k2,w]];
   for(const [a,c,f] of q){const v=ring[a][c];pos.push(v[0],v[1],v[2]);nor.push(v[3],v[4],v[5]);uvs.push(v[6],v[7]+f)}}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
 const rope=new THREE.Mesh(g,phong({map:osadaTex(OSADA_TX.tsn2_konopie_skrecane[0]),color:0xe0d8cc,shininess:4,side:THREE.DoubleSide}));// 23.11.2026: skrecane konopie autorarope.castShadow=true;ROOT.add(rope);
}
/* 23.11.2026 (autor: budynki mapy III w tym samym stylu co Zlotogrod): szopy z debowych desek, celnica z kamienia i muru pruskiego, tawerna z nadwieszonym pietrem i szyldem,
   sklad przechodni z bramami; tekstury autora z patyna portu (wk 2). Kolizje bez zmian (kafle 48, przejscie skladu otwarte). */
function portKit(kind,gx,bx,bz,bw,bd,ao){
 const N=(k,sc,col,o)=>worldSurfN(cutaway(phong(Object.assign({color:col},o||{}))),k,sc,1.9,2);
 const oak=N('tsn1_dab_portowy',1.3,0xd0c4b8),oakD=N('tsn1_dab_portowy',.9,0x8a7a6c),plaster=N('tgm1_tynk_wapienny',1.7,0xeee8dc),stone=N('tgm2_mur_kamienny',1.2,0xd8d2c8),
  stoneD=N('tm03_ciosy',.9,0xa8a096),tiles=N('tgm3_dachowka_gliniana',1.1,0xd4c4b6,{side:THREE.DoubleSide}),ropeM=N('tsn2_konopie_skrecane',.7,0xe0d8cc),
  copper=N('tzl1_miedz_patynowana',1.4,0xf4f8f6,{side:THREE.DoubleSide,specular:0x5a7a70,shininess:24}),glassL=winGlass(cutaway(phong({color:0x1a120a,emissive:0x8a4a14})),1,2),glassD=winGlass(cutaway(phong({color:0x10141a,specular:0x555555,shininess:50})),0,2),
  iron=cutaway(phong({color:0x34302c,specular:0x333333,shininess:30})),salt=cutaway(phong({color:0xe8e4da})),gold=cutaway(phong({color:0xb08a40,emissive:0x2a1c06,specular:0x806020,shininess:30}));
 const g=new THREE.Group(),cover=new THREE.Group();ROOT.add(g);
 const add=(geo,m,x,y,z,rx,ry,rz,par)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.rotation.set(rx||0,ry||0,rz||0);o.castShadow=o.receiveShadow=true;(par||g).add(o);return o};
 const B=(w,h,d,m,x,y0,z,ry,par)=>add(new THREE.BoxGeometry(w,h,d),m,x,y0+h/2,z,0,ry||0,0,par);
 const cx=bx+bw/2,cz=bz+bd/2,front=bz+bd;
 const tri=(arr,a,b,c,want)=>{const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(n[0]*want[0]+n[1]*want[1]+n[2]*want[2]<0)arr.push(...a,...c,...b);else arr.push(...a,...b,...c)};
 const mesh=(arr,m,par)=>{const q=new THREE.BufferGeometry();q.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));q.computeVertexNormals();const o=new THREE.Mesh(q,m);o.castShadow=o.receiveShadow=true;(par||g).add(o);return o};
 // dach dwuspadowy, kalenica wzdluz z (szczyt od ulicy), szczyty z materialu sciany
 const gableZ=(x0,x1,z0,z1,E,rise,roofM,wallM,oh,par)=>{const c=(x0+x1)/2,hw=(x1-x0)/2,dy=oh*rise/hw,pts=[],gp=[];for(const s of [1,-1]){const r0=[c,E+rise,z0-oh],r1=[c,E+rise,z1+oh],e0=[c+s*(hw+oh),E-dy,z0-oh],e1=[c+s*(hw+oh),E-dy,z1+oh];tri(pts,r0,e0,e1,[s,1,0]);tri(pts,r0,e1,r1,[s,1,0])}
  for(const [z,sg] of [[z0,-1],[z1,1]])tri(gp,[x0,E,z],[x1,E,z],[c,E+rise,z],[0,0,sg]);mesh(pts,roofM,par);mesh(gp,wallM,par);B(.18,.18,z1-z0+oh*2+.1,oakD,c,E+rise-.04,(z0+z1)/2,0,par);
  for(const s of [1,-1])for(const z of [z0-oh,z1+oh]){const L=Math.hypot(hw+oh,rise+dy),o=add(new THREE.BoxGeometry(.1,.24,L),oakD,c+s*(hw+oh)/2,E+(rise-dy)/2,z+(z<z0?-.03:.03),0,0,0,par);o.lookAt(c,E+rise,z+(z<z0?-.03:.03))}};
 const hip=(x0,x1,z0,z1,E,rise,roofM,oh)=>{const a=(x1-x0)/2+oh,b=(z1-z0)/2+oh,c=[(x0+x1)/2,(z0+z1)/2],k=Math.max(0,b-a),T=E+rise,y0=E-oh*rise/Math.min(a,b),pts=[];
  const r0=[c[0],T,c[1]-k],r1=[c[0],T,c[1]+k],C0=[c[0]-a,y0,c[1]-b],C1=[c[0]+a,y0,c[1]-b],C2=[c[0]+a,y0,c[1]+b],C3=[c[0]-a,y0,c[1]+b];
  tri(pts,r0,C0,C3,[-1,1,0]);tri(pts,r0,C3,r1,[-1,1,0]);tri(pts,r1,C2,C1,[1,1,0]);tri(pts,r1,C1,r0,[1,1,0]);tri(pts,r0,C1,C0,[0,1,-1]);tri(pts,r1,C3,C2,[0,1,1]);mesh(pts,roofM)};
 const win=(x,y,z,ry,lit,w=.62,h=.72)=>{const q=new THREE.Group();q.position.set(x,y,z);q.rotation.y=ry||0;g.add(q);const m=(geo,mat,px,py,pz,r)=>{const o=new THREE.Mesh(geo,mat);o.position.set(px,py,pz);if(r)o.rotation.y=r;o.castShadow=true;q.add(o)};
  m(new THREE.BoxGeometry(w,h,.06),lit?glassL:glassD,0,0,.02);if(lit&&NB_WIN){const s=new THREE.Mesh(new THREE.PlaneGeometry(w*2.4,h*2.2),winSpillMat());s.position.set(0,-h*.25,.1);q.add(s)}for(const sy of [-1,1])m(new THREE.BoxGeometry(w+.26,.1,.15),oakD,0,sy*(h/2+.05),.06);for(const sx of [-1,1])m(new THREE.BoxGeometry(.1,h+.2,.15),oakD,sx*(w/2+.05),0,.06);
  m(new THREE.BoxGeometry(.05,h,.05),oakD,0,0,.08);m(new THREE.BoxGeometry(w,.05,.05),oakD,0,0,.08);for(const sx of [-1,1])m(new THREE.BoxGeometry(w*.52,h+.06,.04),oak,sx*(w*.8),0,.12,sx*.45)};
 const lantern=(x,y,z)=>{B(.05,.05,.45,iron,x,y+.25,z-.2);B(.03,.16,.03,iron,x,y+.1,z);B(.2,.28,.2,glassL,x,y-.2,z);B(.24,.05,.24,iron,x,y+.08,z)};
 // mur pruski: belki na scianie (slupy, rygiel, zastrzaly na skrajach)
 const timber=(len,h0,h1,pos,ry)=>{const n=Math.max(2,Math.round(len/1.3)),t=.13;for(const y of [h0,h1])B(len+.04,t,t,oakD,...[pos(0)[0],y-t/2,pos(0)[1]],ry);for(let k=0;k<=n;k++){const [x,z]=pos(-len/2+len*k/n);B(t,h1-h0,t,oakD,x,h0,z,ry)}
  const sw=len/n;for(const [k,sg] of [[0,1],[n-1,-1]]){const [x,z]=pos(-len/2+sw*(k+.5)),L=Math.hypot(sw,h1-h0),o=add(new THREE.BoxGeometry(t,L,t),oakD,x,(h0+h1)/2,z,0,ry||0,0);o.rotateZ(sg*Math.atan2(sw,h1-h0))}};
 const Fp=(t)=>[cx+t,front+.07],Bp=(t)=>[cx-t,bz-.07],Rp=(t)=>[bx+bw+.07,cz-t],Lp=(t)=>[bx-.07,cz+t];
 if(kind==='shed'){const E=2.9,net=gx<30;B(bw,.5,bd,stoneD,cx,0,cz);B(bw-.06,E-.5,bd-.06,oak,cx,.5,cz);for(const sx of [-1,1])for(const sz of [-1,1])B(.24,E+.05,.24,oakD,cx+sx*(bw/2-.06),0,cz+sz*(bd/2-.06));
  B(bw+.12,.18,bd+.12,oakD,cx,E-.1,cz);gableZ(bx,bx+bw,bz,front,E,bw*.34,tiles,oak,.35);
  for(const sx of [-1,1]){const lf=B(.98,2.25,.08,oakD,cx+sx*.5,0,front+.05);const br=add(new THREE.BoxGeometry(.08,1.9,.05),oak,cx+sx*.5,1.12,front+.1);br.rotation.z=sx*.42}B(2.3,.2,.16,oakD,cx,2.25,front+.06);
  B(.8,.7,.06,oakD,cx,E+.4,front+.04);for(const z of [bz+bd*.3,bz+bd*.7]){win(bx-.06,1.6,z,-Math.PI/2,false,.5,.5);win(bx+bw+.06,1.6,z,Math.PI/2,false,.5,.5)}lantern(cx+1.45,2.2,front+.3);
  if(net){for(let i=0;i<3;i++){const z=bz+1.2+i*bd*.3;B(.04,1.5,1.4,ropeM,bx+bw+.1,.7,z);B(.06,.06,1.5,oakD,bx+bw+.14,2.2,z)}for(let i=0;i<2;i++){const o=add(new THREE.BoxGeometry(.08,.08,2.6),oakD,bx-.25,1.1,cz-1+i*.4);o.rotation.x=1.1}
   add(new THREE.TorusGeometry(.32,.1,6,14),ropeM,cx-1.6,.12,front+.55,Math.PI/2,0,0);add(new THREE.TorusGeometry(.2,.08,6,12),ropeM,cx-1.6,.3,front+.55,Math.PI/2,0,0)}
  else{for(let i=0;i<6;i++){const sx=i%3,sy=(i/3)|0;add(new THREE.BoxGeometry(.6,.36,.42),salt,cx-1.8-sx*.05,.2+sy*.36,front+.5+sx*.45,0,(i*1.3)%1-.5,0)}B(.8,.8,.8,oakD,cx+1.9,0,front+.6,.3)}
  ao(cx,cz,bw*1.45+1,bd*1.45+1)}
 else if(kind==='office'){const E=3.7,F1=1.85;B(bw,F1,bd,stone,cx,0,cz);B(bw+.08,.16,bd+.08,stoneD,cx,F1-.08,cz);B(bw-.06,E-F1,bd-.06,plaster,cx,F1,cz);
  timber(bw,F1+.05,E-.05,Fp,0);timber(bw,F1+.05,E-.05,Bp,Math.PI);timber(bd,F1+.05,E-.05,Rp,Math.PI/2);timber(bd,F1+.05,E-.05,Lp,-Math.PI/2);B(bw+.2,.2,bd+.2,oakD,cx,E-.02,cz);
  hip(bx,bx+bw,bz,front,E+.15,2.0,tiles,.38);B(1.0,.9,1.0,plaster,cx,E+1.4,cz);add(new THREE.ConeGeometry(.82,.9,4),copper,cx,E+2.75,cz,0,Math.PI/4,0);B(.03,.9,.03,iron,cx,E+3.2,cz);B(.45,.28,.02,cutaway(phong({color:0x5a1e1a,side:THREE.DoubleSide})),cx+.24,E+3.45,cz);
  for(const sx of [-1,1])win(cx+sx*bw*.3,1.1,front+.04,0,true,.6,.7);for(const x of [-bw*.3,0,bw*.3])win(cx+x,2.8,front+.1,0,true,.55,.65);for(const z of [-bd*.25,bd*.25]){win(bx-.06,2.8,cz+z,-Math.PI/2,false,.55,.65);win(bx+bw+.06,2.8,cz+z,Math.PI/2,true,.55,.65)}
  B(1.4,2.1,.2,stoneD,cx,0,front+.04);B(1.0,1.9,.08,oakD,cx,0,front+.12);B(1.3,.5,.06,cutaway(phong({color:0x2a3a4a})),cx,F1+.12,front+.12);B(1.1,.06,.03,gold,cx,F1+.33,front+.16);for(let i=0;i<2;i++)B(1.8-i*.4,.14,.5,stoneD,cx,i*.14,front+.35+(1-i)*.4);
  ao(cx,cz,bw*1.45+1,bd*1.45+1)}
 else if(kind==='inn'){const E=3.6,F1=1.6,J=.45;B(bw,F1,bd,stone,cx,0,cz);B(bw-.06,E-F1,bd+J-.06,plaster,cx,F1,cz+J/2);B(bw+.1,.2,.3,oakD,cx,F1-.1,front+J-.1);
  timber(bw,F1+.06,E-.05,t=>[cx+t,front+J+.07],0);timber(bd+J,F1+.06,E-.05,t=>[bx+bw+.07,cz+J/2-t],Math.PI/2);timber(bd+J,F1+.06,E-.05,t=>[bx-.07,cz+J/2+t],-Math.PI/2);B(bw+.18,.2,bd+J+.18,oakD,cx,E-.02,cz+J/2);
  for(const sx of [-1,1]){const o=add(new THREE.BoxGeometry(.12,.12,.7),oakD,cx+sx*(bw/2-.2),F1-.35,front+.2);o.rotation.x=-.6}
  gableZ(bx,bx+bw,bz,front+J,E,bw*.42,tiles,plaster,.32);
  win(cx-bw*.25,1.0,front+.04,0,true,.9,.7);win(cx+bw*.28,2.65,front+J+.1,0,true,.55,.65);win(cx-bw*.28,2.65,front+J+.1,0,true,.55,.65);win(cx,E+.7,front+J+.05,0,true,.4,.45);win(bx-.06,2.6,cz,-Math.PI/2,true,.55,.65);win(bx+bw+.06,1.0,cz,Math.PI/2,true,.7,.6);
  B(1.0,1.95,.08,oakD,cx+bw*.22,0,front+.06);B(1.25,.14,.14,oakD,cx+bw*.22,1.95,front+.08);
  {const sx=cx+bw/2+.55,sy=2.2;B(.9,.05,.05,iron,cx+bw/2+.25,sy+.45,front+J);B(.02,.2,.02,iron,sx-.25,sy+.32,front+J);B(.02,.2,.02,iron,sx+.25,sy+.32,front+J);B(.7,.55,.06,oakD,sx,sy-.28,front+J);add(new THREE.CylinderGeometry(.13,.11,.28,12),gold,sx,sy,front+J+.06);add(new THREE.TorusGeometry(.08,.025,6,10),gold,sx+.16,sy,front+J+.06)}
  lantern(cx-.55,2.0,front+.25);B(1.6,.08,.4,oakD,cx-bw*.22,.45,front+.5);for(const s2 of [-1,1])B(.08,.45,.34,oakD,cx-bw*.22+s2*.65,0,front+.5);
  for(const [x,z] of [[bx+bw+.45,front-.4],[bx+bw+.5,front-1.1]])add(new THREE.CylinderGeometry(.3,.3,.75,12),oakD,x,.38,z);
  ao(cx,cz,bw*1.45+1,bd*1.45+1)}
 else if(kind==='store'){const left=FT(gx+1),right=FT(gx+3),E=2.9;
  for(const [a,b] of [[bx,left],[right,bx+bw]]){const c=(a+b)/2,w=b-a;B(w,.5,bd,stoneD,c,0,cz);B(w-.06,E-.5,bd-.06,oak,c,.5,cz);for(const z of [bz,front])B(.26,E+.05,.26,oakD,a<left-.1?a+.08:b-.08,0,z);
   for(const zz of [bz+bd*.3,bz+bd*.7])win(a<cx?a-.06:b+.06,1.6,zz,a<cx?-Math.PI/2:Math.PI/2,false,.5,.5);
   for(const f of [.25,.5,.75]){const inner=a<cx?b:a,sgn=a<cx?-1:1;B(.7,.7,.7,oakD,inner+sgn*.45,0,bz+f*bd,.2);if(f!==.5)add(new THREE.CylinderGeometry(.3,.3,.75,12),oakD,inner+sgn*.45,1.1,bz+f*bd)}}
  for(const z of [bz,front]){for(const x of [left,right])B(.3,E+.4,.3,oakD,x,0,z);B(right-left+.6,.3,.34,oakD,(left+right)/2,E+.1,z);for(const sx of [-1,1]){const o=add(new THREE.BoxGeometry(.12,1.0,.12),oakD,(sx<0?left:right)-sx*.35,E-.25,z);o.rotation.z=sx*.75}B(right-left,.06,.4,stoneD,(left+right)/2,0,z)}
  B(right-left-.2,.02,bd,N('tsn1_dab_portowy',1.1,0x9a8e82),(left+right)/2,0,cz);
  gableZ(bx,bx+bw,bz,front,E+.3,bw*.34,tiles,oak,.35,cover);B(bw+.12,.18,bd+.12,oakD,cx,E+.2,cz,0,cover);ROOT.add(cover);
  W.portRoom={cover,left:bx,right:bx+bw,north:bz,south:front};W.LSRC.push({col:0xffcaaa,base:.7,dist:5,x:left+.1,y:1.5,z:cz,kind:'fire',ph:0});ao(cx,cz,bw*1.4+1,bd*1.4+1)}
 if(kind==='office'||kind==='inn')for(const side of [-1,1])W.LSRC.push({col:0xffb866,base:.75,dist:4.6,x:cx+side*bw*.32,y:1.5,z:front+.7,kind:'fire',ph:cx+side});
}
function buildSolneNabrzeze(I){
 const random=rng(60139);const P3=PORT3D_ON?port3dBuild(I,ROOT):null;
 const ground=(x,y)=>{if(x<0||y<0||x>=MW||y>=MH)return 45;const i=y*MW+x,t=map[i];return t===31||t===27?(W.under[i]||40):t};
 const land=t=>t!==45&&t!==21;
 // --- nawierzchnie: ciagla siatka UV, kolor wierzcholkow niesie wilgoc przy wodzie, cien pod scianami i przejscia miedzy materialami
 const surfaces=new Map();
 const surface=(key,img,u,tint,turn=false)=>surfaces.set(key,{img,u,tint,turn,pos:[],uv:[],colors:[],indices:[]});
 surface('quay',I.port_bruk,5.2,0xe9ecee);
 const laneA=FT(30),laneB=FT(35);// trakt wozow z sola: jeden pas od windy do trapu promu, szeroki na jeden kafel tekstury
 surface('cartway',I.port_trakt,laneB-laneA,0xe6e6e2);
 surface('salt',I.port_sol,5.2,0xcfd2d0);// 15.11.2026: plac solny przyciemniony (byl najjasniejszym miejscem mapy)
 surface('slip',I.port_mech,5.6,0xe2e8e0);
 surface('deck',I.port_deski,5.4,0xf0ece6);
 surface('crossdeck',I.port_deski,5.4,0xf0ece6,true);
 const built=(x,y)=>ground(x,y)===48;
 const kindAt=(x,y)=>{const t=ground(x,y);if(t===43){const horizontal=(y>=FT(10)&&y<FT(15))||(y>=FT(44)&&(x<FT(27)||x>=FT(37)));return horizontal?'deck':'crossdeck'}
  return t===47?'salt':t===42?'slip':t===40&&y>=FT(11)&&y<FT(46)&&x>=laneA&&x<laneB?'cartway':'quay'};
 const tone=new THREE.Color();
 for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){
  const t=ground(x,y);if(!land(t)||t===48)continue;
  const f=surfaces.get(kindAt(x,y)),base=f.pos.length/3;
  for(const [dx,dz] of [[0,0],[0,1],[1,1],[1,0]]){
   const X=x+dx,Z=y+dz;f.pos.push(X,.025,Z);
   f.uv.push(((f.turn?Z:X)-(f===surfaces.get('cartway')?laneA:0))/f.u,-(f.turn?X:Z)/f.u);
   const around=[[0,0],[-1,0],[0,-1],[-1,-1]];
   const wet=around.some(([ox,oz])=>ground(X+ox,Z+oz)===45),wall=around.some(([ox,oz])=>built(X+ox,Z+oz));
   let near=false;if(!wet)for(let oz=-2;oz<=1&&!near;oz++)for(let ox=-2;ox<=1;ox++)if(ground(X+ox,Z+oz)===45){near=true;break}
   const shade=.94+.04*Math.sin(X*.31+Z*.17)+.03*Math.cos(Z*.53-X*.12);
   tone.setHex(f.tint).multiplyScalar(shade*(wet?.66:near?.86:1)*(wall?.62:1));
   if(wet||near){tone.r*=.94;tone.b*=1.04}
   f.colors.push(tone.r,tone.g,tone.b);
  }
  f.indices.push(base,base+1,base+2,base,base+2,base+3);
 }
 for(const [name,f] of surfaces){if(!f.indices.length)continue;
  const geo=new THREE.BufferGeometry();
  for(const [key,values,size] of [['position',f.pos,3],['uv',f.uv,2],['color',f.colors,3]])geo.setAttribute(key,new THREE.Float32BufferAttribute(values,size));
  geo.setIndex(f.indices);geo.computeVertexNormals();
  const deck=name==='deck'||name==='crossdeck',wet=deck||name==='slip';
  const mesh=new THREE.Mesh(geo,phong({map:wallTex(f.img),vertexColors:true,shininess:wet?26:name==='salt'?10:16,specular:wet?0x25363e:0x141d21}));
  mesh.receiveShadow=true;ROOT.add(mesh);
 }
 // --- przejscia miedzy nawierzchniami: mech pochylni i sol zachodza nierowno na bruk, bez prostej granicy; na placu solnym lezy popekana skorupa soli
 {
  const hash=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)};
  const vnoise=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy),a=hash(ix,iy),b=hash(ix+1,iy),c=hash(ix,iy+1),d=hash(ix+1,iy+1);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
  const fbm=(x,y,s)=>.62*vnoise(x*.3+s,y*.3)+.38*vnoise(x*.85+s*3,y*.85+7);
  const overlay=(kind,img,u,tint,reach,patch,inside)=>{
   if(!img)return;
   // odleglosc kazdego pola od obszaru danej nawierzchni (do "reach" pol, tylko po bruku i trakcie)
   const dist=new Float32Array(MW*MH).fill(99),queue=[];
   for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=ground(x,y);if(land(t)&&t!==48&&t!==43&&kindAt(x,y)===kind){dist[y*MW+x]=0;queue.push(x,y)}}
   for(let h=0;h<queue.length;h+=2){const x=queue[h],y=queue[h+1],d=dist[y*MW+x];if(d>=reach)continue;
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Y=y+b;if(X<0||Y<0||X>=MW||Y>=MH)continue;const t=ground(X,Y);if(!land(t)||t===48||t===43)continue;const i=Y*MW+X;if(dist[i]<=d+1)continue;dist[i]=d+1;queue.push(X,Y)}}
   const cornerDist=(X,Y)=>{let m=99;for(const [a,b] of [[0,0],[-1,0],[0,-1],[-1,-1]]){const x=X+a,y=Y+b;if(x>=0&&y>=0&&x<MW&&y<MH)m=Math.min(m,dist[y*MW+x])}return m};
   const pos=[],uv=[],col=[],idx=[],c=new THREE.Color(tint);
   for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const d0=dist[y*MW+x];if(d0>reach||(d0===0&&!inside))continue;
    const base=pos.length/3;
    for(const [dx,dz] of [[0,0],[0,1],[1,1],[1,0]]){const X=x+dx,Z=y+dz,n=fbm(X,Z,kind.length*13),d=cornerDist(X,Z);
     const edge=Math.max(0,Math.min(1,1-(d+(n-.5)*2.6)/reach)),alpha=edge*(patch?patch(fbm(X*1.7,Z*1.7,5)):1);
     pos.push(X,.032,Z);uv.push(X/u,-Z/u);col.push(c.r,c.g,c.b,alpha)}
    idx.push(base,base+1,base+2,base,base+2,base+3);
   }
   if(!idx.length)return;
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setAttribute('color',new THREE.Float32BufferAttribute(col,4));geo.setIndex(idx);geo.computeVertexNormals();
   const mat=phong({map:wallTex(img),vertexColors:true,transparent:true,depthWrite:false,shininess:kind==='slip'?26:12,specular:kind==='slip'?0x25363e:0x1c2428});
   const mesh=new THREE.Mesh(geo,mat);mesh.receiveShadow=true;mesh.renderOrder=1;ROOT.add(mesh);
  };
  overlay('slip',I.port_mech,5.6,0xe2e8e0,2.6);
  overlay('salt',I.port_nalot,3.4,0xc4c9c9,2.6,n=>Math.max(.14,Math.min(.86,(n-.3)*2.4)),true);
  // zaspy soli przy scianach skladow i pod skrzyniami: niskie, plaskie, nie zaslaniaja walki
  const drift=[];
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){if(ground(x,y)!==47)continue;
   const wall=[[1,0],[-1,0],[0,1],[0,-1]].find(([a,b])=>built(x+a,y+b));
   if(wall&&random()<.4)drift.push([x+.5+wall[0]*.3,y+.5+wall[1]*.3,.5+random()*.4,wall[0]?Math.PI/2:0]);
  }
  if(drift.length&&I.port_nalot){
   const mound=new THREE.SphereGeometry(1,10,6,0,Math.PI*2,0,Math.PI/2);
   const saltMat=worldSurf(phong({color:0xc2c8ca,shininess:4,specular:0x0c1012}),I.port_nalot,2.4,'portSaltDrift');
   instanced(mound,saltMat,drift,([x,y,s,a])=>{M4.makeRotationY(a);SC.set(s*1.3,s*.13,s*.55);M4.scale(SC);M4.setPosition(x,-.02,y);return M4});
  }
 }
 // --- rzeka
 const harbourWater=waterHD(I.cc0_water,W.waters,-.19,5.8,0x3f5a68,true);
 if(harbourWater){harbourWater.mesh.material.shininess=48;harbourWater.mesh.material.specular.setHex(0x314754)}
 shoreFX(W.waters,W.waters,-.175,'water',true);
 // --- krawedzie nabrzezy: kamienne ciosy, belki pomostow i pale
 const stone=worldSurf(phong({color:0xc9d0d2}),I.port_plyty,3.2,'portStone');
 const wood=worldSurf(phong({color:0xc4bcb2}),I.port_deski,3,'portWood');
 const edgeStone=[],edgeWood=[],piles=[];
 for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){
  const t=ground(x,y);if(!land(t))continue;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(ground(x+dx,y+dy)===45){
   const record=[x+.5+dx*.43,y+.5+dy*.43,dx];(t===43?edgeWood:edgeStone).push(record);
   if(t===43&&(x+y)%4===0)piles.push([record[0],record[1]]);
  }
 }
 const rim=new THREE.BoxGeometry(1,.74,.2),beam=new THREE.BoxGeometry(1,.23,.15);
 const edges=(geo,mat,list)=>instanced(geo,mat,list,([x,y,dx])=>{M4.makeRotationY(dx?Math.PI/2:0);M4.setPosition(x,-.3,y);return M4});
 edges(rim,stone,edgeStone);edges(beam,wood,edgeWood);
 if(P3){/* 19.11.2026: piana fal przy krawedziach (strona wody wyliczona z polozenia krawedzi wzgledem srodka kafla) */const fl=[];for(const [x,y,dx] of edgeStone.concat(edgeWood)){if(dx){const s=Math.sign(x-(Math.floor(x)+.5))||1;fl.push([x+s*.62,y,s>0?-Math.PI/2:Math.PI/2])}else{const s=Math.sign(y-(Math.floor(y)+.5))||1;fl.push([x,y+s*.62,s>0?Math.PI:0])}}const fm=nb3dFoam(fl);if(fm){ROOT.add(fm);W.foam=fm}}
 if(P3){/* 18.11.2026: poklad pomostu ma grubosc (oblicowka do wody), nabrzeze kamienne obrzeze */const lay=(geo,mat,list,h)=>instanced(geo,mat,list,([x,y,dx])=>{M4.makeRotationY(dx?Math.PI/2:0);M4.setPosition(x,h,y);return M4});
  lay(new THREE.BoxGeometry(1.01,.38,.13),worldSurf(phong({color:0x7a6a5a}),I.port_deski,1.7,'p3dFascia'),edgeWood,-.15);lay(new THREE.BoxGeometry(1.0,.09,.34),worldSurf(phong({color:0xb4babb,shininess:6}),I.port_plyty,1.6,'p3dCoping'),edgeStone,.065)}
 instanced(new THREE.CylinderGeometry(.1,.14,1.3,6),wood,piles,([x,y])=>M4.makeTranslation(x,-.15,y));
 if(nbParam('lina')!=='0')portRopeRail(ground,wood);// 23.11.2026 (autor: lina i narozne slupki wokol pomostow)
 // 15.11.2026 (mapy-wygladzenie): styk pomostu z kamiennym nabrzezem ma belke progowa i kamienny kraweznik, zamiast golej prostej linii miedzy teksturami
 {const sill=[],kerb=[];for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){if(ground(x,y)!==43)continue;
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=ground(x+dx,y+dy);if(!land(n)||n===43||n===48)continue;sill.push([x+.5+dx*.44,y+.5+dy*.44,dx]);kerb.push([x+.5+dx*.56,y+.5+dy*.56,dx])}}
  const sillMat=worldSurf(phong({color:0x6e5e4e,shininess:18,specular:0x1c2226}),I.port_deski,3,'portSill');
  const kerbMat=worldSurf(phong({color:0x9ba2a4,shininess:8}),I.port_plyty,3.2,'portKerb');
  const lay=(geo,mat,list,h)=>instanced(geo,mat,list,([x,y,dx])=>{M4.makeRotationY(dx?Math.PI/2:0);M4.setPosition(x,h,y);return M4});
  lay(new THREE.BoxGeometry(1.02,.09,.16),sillMat,sill,.045);lay(new THREE.BoxGeometry(1.02,.06,.14),kerbMat,kerb,.03);}
 // --- budynki: sklady, kantor i karczma. Sciany znikaja przed bohaterem (cutaway), wiec nie zaslaniaja walki.
 // 15.11.2026 (oprawa): materialy budynkow ciemniejsze i cieplejsze, blizej malowanej palety mapy
 const siding=worldSurf(cutaway(phong({color:0x8e7f6e})),I.port_deski,3,'portSiding');
 const plaster=worldSurf(cutaway(phong({color:0x8f8370})),I.wl_chata||I.port_deski,3,'portLogs');
 const foot=worldSurf(cutaway(phong({color:0x7c807b})),I.port_plyty,3.2,'portFoot');
 const slate=worldSurf(cutaway(phong({color:0x9aa1a8})),I.rf_lupek,2.5,'portSlate');slate.color.setHex(0x5f5650);
 const timbers=cutaway(phong({color:0x3b3027})),shadow=cutaway(phong({color:0x15140f}));
 // brud i wilgoc: polprzezroczyste ciemne powloki u podstawy scian i pod okapem (dwie warstwy = miekkie przejscie)
 const grime=cutaway(phong({color:0x0e110c,transparent:true,opacity:.34,depthWrite:false})),grime2=cutaway(phong({color:0x10140e,transparent:true,opacity:.22,depthWrite:false}));
 const aoGeo=new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2);
 const ao=(x,z,w,d)=>{const m=new THREE.Mesh(aoGeo,groundShadowMat);m.scale.set(w,1,d);m.position.set(x,.035,z);m.renderOrder=2;ROOT.add(m)};
 const glow=cutaway(new THREE.MeshBasicMaterial({color:0xd98a3c}));
 // 15.11.2026 (port w standardzie map): tynk kamienic i deski szop jak w Zlotogrodzie, prawdziwe polacie dachu z dachowka (karczma), lupkiem (kantor) i latanymi deskami (szopy, sklad)
 /* 19.11.2026 (autor: obic domy tekstura): jasniejszy tynk i deski (wczesniej ciemnoszare plamy), tynk w gestszym wzorze */const plasterW=I.wl_town?worldSurf(cutaway(phong({color:0xd8cdb8,emissive:0x0a0907})),I.wl_town,2.2,'portPlaster'):plaster,plankW=I.wl_plank?worldSurf(cutaway(phong({color:0xc0b09c,emissive:0x080605})),I.wl_plank,2.2,'portPlank'):siding;
 const roofTex=k=>{if(!I[k])return null;const t=wallTex(I[k]).clone();t.needsUpdate=true;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,1);return t};
 const roofOf=(k,col,shin)=>I[k]?cutaway(phong({map:roofTex(k),color:col,shininess:shin,specular:0x161a1e,side:THREE.DoubleSide})):slate;
 const roofM={inn:roofOf('p3_roof_tile',0xa89890,4),office:roofOf('rf_lupek',0xb8c2c8,10),shed:roofOf('p3_roof_shack',0xa49a90,3)};
 const shackW=I.p3_roof_shack?worldSurf(cutaway(phong({color:0xa49a90})),I.p3_roof_shack,3,'portShack'):slate;
 const roofSlope=(mat,cx,eave,half,pitch,z0,z1,side)=>{const t=Math.tan(pitch),ov=.28,x0=cx+side*(half+ov),y0=eave-t*ov,y1=eave+t*half,L=Math.hypot(half+ov,y1-y0),S=2.4,g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute([x0,y0,z0,x0,y0,z1,cx,y1,z1,cx,y1,z0],3));g.setAttribute('uv',new THREE.Float32BufferAttribute([z0/S,0,z1/S,0,z1/S,L/S,z0/S,L/S],2));
  g.setIndex(side>0?[0,2,1,0,3,2]:[0,1,2,0,2,3]);g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.castShadow=true;m.receiveShadow=true;ROOT.add(m)};
 const unit=new THREE.BoxGeometry(1,1,1),parts=new Map();
 const part=(mat,x,h,z,w,height,depth,angle=0)=>{if(!parts.has(mat))parts.set(mat,[]);parts.get(mat).push([x,h,z,w,height,depth,angle])};
 const inBuilding=new Set(),PKIT=nbParam('portnowe')!=='0'&&typeof OSADA_TX!=='undefined';
 for(const [x,y,w,h,kind] of PORT_BUILDINGS){
  for(let Y=FT(y);Y<FT(y+h);Y++)for(let X=FT(x);X<FT(x+w);X++)inBuilding.add(Y*MW+X);
  const bx=MP(x),bz=MP(y),bw=MP(x+w)-bx,bd=MP(y+h)-bz;
  const cx=bx+bw/2,cz=bz+bd/2,front=bz+bd,eave=kind==='inn'?2.5:kind==='office'?2.9:2.72,half=bw/2+.22,pitch=.37;
  if(PKIT){portKit(kind,x,bx,bz,bw,bd,ao);continue}
  if(kind==='store'){
   // sklad przechodni: dwie bramy leza dokladnie na polach otwartych w siatce kolizji; dach znika, gdy bohater jest w srodku
   const left=FT(x+1),right=FT(x+3),room=new THREE.Group(),cover=new THREE.Group();
   ROOT.add(room);room.add(cover);
   const box=(parent,material,px,py,pz,sx,sy,sz,angle=0)=>{const mesh=new THREE.Mesh(unit,material);mesh.scale.set(sx,sy,sz);mesh.rotation.z=angle;mesh.position.set(px,py,pz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh)};
   for(const [outer,inner] of [[bx,left],[bx+bw,right]]){
    const side=outer<inner?-1:1,center=(outer+inner)/2,width=Math.abs(outer-inner);
    box(room,foot,center,.22,cz,width,.44,bd);
    box(room,plankW,outer-side*.10,1.22,cz,.20,2.44,bd);
    for(const z of [bz,front]){
     box(cover,plankW,center,1.25,z,width,2.5,.18);
     box(cover,timbers,inner+side*.08,1.26,z,.18,2.52,.26);
     box(room,timbers,inner+side*.20,1.12,z-side*.03,.30,2.24,.23);
    }
    for(const f of [.29,.63]){box(room,wood,center,.83,bz+f*bd,width*.76,.76,1.18);box(room,timbers,center,1.13,bz+f*bd,width*.8,.12,1.22)}
   }
   for(const z of [bz,front]){box(cover,timbers,cx,2.64,z,bw+.1,.24,.28);box(room,foot,(left+right)/2,.04,z,right-left,.08,.33)}
   for(const side of [-1,1])box(cover,shackW,cx+side*half/2,eave+Math.tan(pitch)*half/2,cz,half/Math.cos(pitch)+.05,.16,bd+.5,-side*pitch);
   box(cover,timbers,cx,eave+Math.tan(pitch)*half,cz,.18,.16,bd+.5);
   for(const [outer,inner] of [[bx,left],[bx+bw,right]]){const center=(outer+inner)/2,width=Math.abs(outer-inner);box(room,grime,center,.42,cz,width+.04,.84,bd+.04)}
   ao(cx,cz,bw*1.4+1,bd*1.4+1);
   W.portRoom={cover,left:bx,right:bx+bw,north:bz,south:front};
   W.LSRC.push({col:0xffcaaa,base:.7,dist:5,x:left+.1,y:1.5,z:cz,kind:'fire',ph:0});
   continue;
  }
  {/* 23.11.2026 (runda 868): szopy, kantor i karczma z modeli TripoSG (malunki ChatGPT); swiatla okien zostaja */const tn=kind==='office'?'celnica':kind==='inn'?'tawerna':kind==='shed'?(x<30?'szopa_sieciarska':'magazyn_soli'):null;
   if(tn&&triReady(tn)){triHouse(ROOT,tn,bx,bz,bw,bd,'s',kind==='shed'?4.4:kind==='office'?5.8:5);ao(cx,cz,bw*1.45+1,bd*1.45+1);
    if(kind!=='shed')for(const side of [-1,1])W.LSRC.push({col:0xffb866,base:.75,dist:4.6,x:cx+side*bw*.32,y:1.5,z:front+.7,kind:'fire',ph:cx+side});
    continue}}
  const wall=kind==='shed'?plankW:plasterW;
  part(foot,cx,.25,cz,bw+.1,.5,bd+.1);
  part(grime,cx,.42,cz,bw+.03,.84,bd+.03);part(grime2,cx,.8,cz,bw+.05,1.6,bd+.05);
  part(grime2,cx,eave-.28,cz,bw+.04,.56,bd+.04);// zaciek pod okapem
  ao(cx,cz,bw*1.45+1,bd*1.45+1);
  part(wall,cx,(eave+.46)/2,cz,bw,eave-.46,bd);
  if(PORT3D_ON&&kind!=='shed'){/* mur pruski: slupy, rygle i zastrzaly na tynku */const t=.13,o=.045,h0=.5,h1=eave-.06,mid=(h0+h1)/2,np=Math.max(2,Math.round(bw/1.35));
   for(const zf of [bz-o,front+o]){for(const yy of [h0+.03,mid,h1])part(timbers,cx,yy,zf,bw+.04,t,t);for(let k=0;k<=np;k++){const xx=bx+bw*k/np;part(timbers,xx,mid,zf,t,h1-h0,t)}const sw=bw/np;for(const [k,sg] of [[0,1],[np-1,-1]]){const x0=bx+sw*k+sw/2;part(timbers,x0,(h0+mid)/2,zf,Math.hypot(sw,mid-h0)*.92,t*.9,t*.9,sg*Math.atan2(mid-h0,sw))}}
   const nq=Math.max(2,Math.round(bd/1.35));for(const xf of [bx-o,bx+bw+o]){for(const yy of [h0+.03,mid,h1])part(timbers,xf,yy,cz,t,t,bd+.04);for(let k=0;k<=nq;k++)part(timbers,xf,mid,bz+bd*k/nq,t,h1-h0,t)}}
  for(const side of [-1,1]){
   roofSlope(roofM[kind]||slate,cx,eave,half,pitch,bz-.24,front+.24,side);
   for(const end of [bz,front])part(timbers,cx+side*(bw/2-.1),eave/2,end,.17,eave,.16);
   part(timbers,cx+side*bw/2,eave-.1,cz,.16,.17,bd+.25);
  }
  // szczyty zamykaja oba konce pod kalenica
  const gable=new THREE.BufferGeometry(),verts=[];
  for(const z of [bz,front])verts.push(bx,eave,z,bx+bw,eave,z,cx,eave+Math.tan(pitch)*bw/2,z);
  gable.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  gable.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,2,0,1,1,0,0,2,0,1,1],2));
  gable.computeVertexNormals();const endMat=wall.clone();endMat.onBeforeCompile=wall.onBeforeCompile;endMat.customProgramCacheKey=wall.customProgramCacheKey;endMat.side=THREE.DoubleSide;
  ROOT.add(new THREE.Mesh(gable,endMat));
  // drzwi w ludzkiej skali (ok. 2,3 m), okna z okiennicami; w kantorze i karczmie pali sie swiatlo
  const lit=kind!=='shed';
  part(shadow,cx,.99,front+.045,1.42,1.98,.08);
  part(siding,cx,.94,front+.095,1.23,1.88,.05);
  part(timbers,cx,1.97,front+.12,1.57,.14,.16);
  for(const side of [-1,1])part(timbers,cx+side*.69,.98,front+.12,.12,1.96,.16);
  part(timbers,cx,.94,front+.14,1.21,.09,.08);
  part(foot,cx,.075,front+.27,1.57,.15,.55);
  for(const side of [-1,1]){
   const wx=cx+side*bw*.32;
   part(lit?glow:shadow,wx,1.53,front+.06,.76,.87,.10);
   for(const offset of lit?[-.2,.2]:[-.20,0,.20])part(timbers,wx+offset,1.54,front+.12,lit?.06:.125,.74,.07);
   if(lit)part(timbers,wx,1.54,front+.12,.76,.06,.07);
   part(foot,wx,1.10,front+.13,.90,.11,.25);
   part(timbers,cx+side*bw*.24,eave+.16,front+.075,.12,Math.hypot(bw*.46,.61),.1,-side*Math.atan2(bw*.46,.61));
   if(lit)W.LSRC.push({col:0xffb866,base:.75,dist:4.6,x:wx,y:1.5,z:front+.7,kind:'fire',ph:wx});
  }
  part(timbers,cx,eave-.08,front+.09,bw,.13,.16);
  part(timbers,cx,eave+Math.tan(pitch)*half+.05,cz,.2,.12,bd+.5);// kalenica
 }
 // --- mur oporowy pod szybem windy Dolnego Miasta
 {const list=walls.filter(([x,y,t])=>t===48&&!inBuilding.has(y*MW+x)).map(([x,y])=>[x,y]);
  if(list.length){const geo=new THREE.BoxGeometry(1,3.4,1);geo.translate(0,1.7,0);
   const side=I.wl_fort?worldSurf(cutaway(phong({color:0x9aa2a6})),I.wl_fort,4,'portWall'):foot,cap=I.wl_cap?worldSurf(cutaway(phong({color:0xa4acb0})),I.wl_cap,3,'portCap'):foot;
   instanced(geo,[side,side,cap,cap,side,side],list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5)).frustumCulled=false}}
 // --- wieza wyciagowa windy: tu bohater wysiada po wyjezdzie z Dolnego Miasta
 {const lx=MP(PORT_LIFT[0]+.5),lz=MP(PORT_LIFT[1])-1.1,iron=cutaway(phong({color:0x3a3f40,shininess:14}));
  for(const sx of [-1,1])for(const sz of [-1,1])part(timbers,lx+sx*1.5,1.75,lz+sz*1.1,.26,3.5,.26);
  for(const sz of [-1,1])part(timbers,lx,3.42,lz+sz*1.1,3.4,.24,.26);
  for(const sx of [-1,1]){part(timbers,lx+sx*1.5,3.42,lz,.26,.24,2.5);part(timbers,lx+sx*1.5,1.2,lz,.12,.12,2.2)}
  part(timbers,lx,3.75,lz,.3,.42,2.7);part(iron,lx,3.2,lz,.9,.9,.16);part(iron,lx,3.2,lz,.2,.2,.5);
  part(shadow,lx,.035,lz,2.7,.03,1.9);part(iron,lx,.06,lz,2.9,.05,.14);part(iron,lx,.06,lz-.95,2.9,.05,.14);part(iron,lx,.06,lz+.95,2.9,.05,.14);
  for(const sx of [-1,1])part(iron,lx+sx*.42,1.9,lz,.05,2.7,.05);
  W.LSRC.push({col:0xffb46a,base:.95,dist:6,x:lx+1.5,y:2.5,z:lz+1.3,kind:'fire',ph:1.7});
  const lamp=new THREE.Mesh(new THREE.BoxGeometry(.22,.3,.2),new THREE.MeshBasicMaterial({color:0xf4c480}));lamp.position.set(lx+1.5,2.5,lz+1.3);ROOT.add(lamp)}
 // --- porecze z lina na zewnetrznych krawedziach pomostow przeladunkowych
 const ropeMat=phong({color:0x7c7160}),strands=[];
 const ropeSpan=(x1,z1,x2,z2)=>{const steps=4;for(let j=0;j<steps;j++)strands.push([j/steps,(j+1)/steps].map(t=>new THREE.Vector3(x1+(x2-x1)*t,.65-.15*4*t*(1-t),z1+(z2-z1)*t)))};
 const rail=(ax,az,bx,bz)=>{const n=Math.ceil(Math.hypot(bx-ax,bz-az)/3.5);let prev=null;
  for(let i=0;i<=n;i++){const x=MP(ax+(bx-ax)*i/n),z=MP(az+(bz-az)*i/n);part(wood,x,.41,z,.19,.82,.19);part(timbers,x,.67,z,.215,.09,.215);if(prev)ropeSpan(prev[0],prev[1],x,z);prev=[x,z]}};
 rail(11.25,33,11.25,48.65);rail(11.55,48.65,26.5,48.65);rail(52.65,33,52.65,48.65);rail(37.3,48.65,52.35,48.65);
 rail(10.2,10.25,24.6,10.25);rail(40.4,10.25,54.8,10.25);
 instanced(new THREE.CylinderGeometry(.026,.026,1,5),ropeMat,strands,([a,b])=>{V.subVectors(b,a);SC.set(1,V.length(),1);Q.setFromUnitVectors(UP,V.normalize());V.addVectors(a,b).multiplyScalar(.5);M4.compose(V,Q,SC)});
 // --- slupy z latarniami: swiatlo wychodzi ze srodka oprawy
 const ironwork=phong({color:0x22211e,shininess:10}),lanternGlass=new THREE.MeshBasicMaterial({color:0xe0913f}),lanterns=[];// 15.11.2026: szklo przygaszone (bylo prawie biale), zelazo jak kute
 // 15.11.2026: malowana latarnia (rekwizyt Zlotogrodu) z przygaszonym zloceniem, jak kute zelazo portu; stara latarnia z klockow tylko bez tego obrazu
 const lampImg=I.p3_street_lantern,lampW=2.05;let lampMat=null,lampGeo=null;
 if(lampImg){const t=new THREE.Texture(lampImg);t.needsUpdate=true;t.anisotropy=nbAniso();lampMat=phong({map:t,alphaTest:.4,color:0x9c9ca4,side:THREE.DoubleSide});lampGeo=new THREE.PlaneGeometry(lampW,lampW).translate(0,lampW/2,0);const n=lampGeo.attributes.normal;for(let i=0;i<n.count;i++)n.setXYZ(i,0,.8,.6)}
 for(const [sx,sy,dir] of PORT_LAMPS){
  const x=sx,z=MP(sy),west=dir<0;if(!land(ground(Math.floor(x),Math.floor(z))))continue;
  if(lampMat){const m=new THREE.Mesh(lampGeo,lampMat);m.scale.y=SQ;if(west)m.scale.x=-1;m.position.set(x,0,z);ROOT.add(m);ao(x,z,.8,.8);W.LSRC.push({col:0xffbb79,base:.9,dist:5.3,x:x+dir*lampW*.17,y:lampW*.62*SQ,z:z+.1,kind:'fire',ph:sx*.71});continue}
  part(timbers,x,1.08,z,.17,2.16,.17);part(ironwork,x,.29,z,.205,.11,.205);part(grime,x,.45,z,.2,.9,.2);ao(x,z,.9,.9);
  part(ironwork,x+dir*.19,2.05,z,.53,.095,.12);part(ironwork,x+dir*.36,1.94,z,.043,.20,.043);
  part(ironwork,x+dir*.36,1.80,z,.31,.10,.28);part(ironwork,x+dir*.36,1.45,z,.28,.065,.26);
  for(const dx of [-.105,.105])part(ironwork,x+dir*.36+dx,1.62,z+.10,.026,.31,.035);
  lanterns.push([x+dir*.36,1.62,z]);
  W.LSRC.push({col:0xffbb79,base:.90,dist:5.3,x:x+dir*.36,y:1.62,z,kind:'fire',ph:sx*.71});
 }
 instanced(new THREE.BoxGeometry(.17,.24,.15),lanternGlass,lanterns,([x,y,z])=>M4.makeTranslation(x,y,z),false,false);
 for(const [mat,list] of parts)instanced(unit,mat,list,([x,h,z,w,height,depth,angle])=>{M4.makeRotationZ(angle);SC.set(w,height,depth);M4.scale(SC);M4.setPosition(x,h,z)});
 // --- rekwizyty portu (atlas HD) i wspolne rekwizyty gry
 const atlas=I.port_atlas;atlas.nbDensity=atlas.width/192;
 const frames={};
 for(const [key,col,row] of [['ferry',0,0],['winch',1,0],['crane',2,0],['salt',0,1],['bollard',1,1],['cargo',2,1]])frames[key]=procFrame(atlas,col*64,row*64,64,64,'prop');
 if(I.port_rekwizyty){const rk=I.port_rekwizyty;rk.nbDensity=rk.width/256;PORT_REK.forEach((row,r)=>row.forEach((key,c)=>{frames[key]=procFrame(rk,c*64,r*64,64,64,'prop')}))}
 const sprite=(frame,x,y,w,h,flip)=>{const geo=new THREE.PlaneGeometry(w,h).translate(0,h/2,0),m=new THREE.Mesh(geo,frame.n);
  m.position.set(x,0,y);m.scale.set(flip?-1:1,SQ,1);m.castShadow=true;m.customDistanceMaterial=frame.d;ROOT.add(m);return m};
 // prom: poklad, po ktorym sie chodzi, lezy plasko pod stopami postaci
 // 15.11.2026: nowy prom rysowany prosto z gory, spasowany z polem pokladu (PORT_FERRY_DECK): kadlub = pole pokladu, trap schodzi na szyje pomostu
 let ferryRings=null,ferryBox=null;const offFerry=(x,y)=>!ferryBox||x<ferryBox[0]||x>ferryBox[2]||y<ferryBox[1]||y>ferryBox[3];// trzciny nie zaslaniaja burt i pierscieni promu
 if(I.port_prom){const img=I.port_prom;img.nbDensity=img.width/96;const fr=procFrame(img,0,0,96,48,'prop'),[dx,dy,dw,dh]=PORT_FERRY_DECK,x0=FT(dx),x1=FT(dx+dw),z0=FT(dy),z1=FT(dy+dh),w=x1-x0+.2,d=(z1-z0)/.78,m=sprite(fr,(x0+x1)/2,z0+d,w,d);
  m.rotation.x=-Math.PI/2;m.scale.y=1;m.position.y=.052;m.castShadow=false;m.receiveShadow=true;ferryRings=[[(x0+x1)/2-w/2+w*.027,z0+d*.412],[(x0+x1)/2+w/2-w*.027,z0+d*.412]];ferryBox=[x0-1.6,z0-1.6,x1+1.6,z0+d+.6]}
 else{const [fx,fy,fw,fh]=PORT_FERRY_ART,m=sprite(frames.ferry,MP(fx),MP(fy),fw,fh);m.rotation.x=-Math.PI/2;m.scale.y=1.38;m.position.y=.052;m.castShadow=false;m.receiveShadow=true}
 // koga Zakonu na kotwicy przy wschodnim pomoscie: sama dekoracja, stoi na wodzie poza polem gry
 if(P3){P3.K.finish(ROOT);const [sx,sy]=PORT_SHIP,s=port3dShip(P3,MP(sx),MP(sy)-2.6,-.19);ROOT.add(s.grp);W.portShip3=s.grp;W.portLamp=s.lamp;W.portShip3.userData.y0=-.19;W.LSRC.push({col:0xffb46a,base:.8,dist:6,x:s.lamp[0],y:s.lamp[1],z:s.lamp[2],kind:'fire',ph:2.2})}
 else if(I.port_statek){const img=I.port_statek;img.nbDensity=img.width/96;const fr=procFrame(img,0,0,96,64,'prop'),[sx,sy,sw]=PORT_SHIP,m=sprite(fr,MP(sx),MP(sy),sw,sw*2/3);m.position.y=-.55;m.castShadow=false;W.portShip=m;
  W.LSRC.push({col:0xffb46a,base:.8,dist:6,x:MP(sx)+sw*.29,y:3.9,z:MP(sy)-.4,kind:'fire',ph:2.2})}
 const R={well:[32,32,32,32],stocks:[64,32,32,32],shrine:[96,32,32,32],gallows:[0,64,64,32],wheel:[64,96,32,32],barrel:[96,96,32,32],marga_cart:[0,128,64,32],crow_post:[64,128,32,32],covered_corpses:[96,128,32,32],order_banner:[32,160,32,32],burnt_hay:[64,160,32,32],dead_horse:[96,160,32,32],shop_sign:[0,0,32,32]};
 const PF={};for(const k in R)PF[k]=I['p1_'+k]?procFrame(I['p1_'+k],0,0,R[k][2],R[k][3],'prop'):procFrame(I.br_props,R[k][0],R[k][1],R[k][2],R[k][3],'prop');
 for(const p of PROPS){
  {/* 23.11.2026 (runda 868): rekwizyty portu z modeli TripoSG */const tn=PORT_TRI[p.k];if(tn&&triReady(tn)){const h=Math.sin(p.x*91.7+p.y*47.3)*43758.5453,hr=h-Math.floor(h),fixed=p.k==='winch';if(triProp(ROOT,tn,p.x,p.y,PORT_PROP_SIZE[p.k][0],fixed?0:(hr-.5)*.7,p.flip))continue}}
  if(P3&&PORT3D_KEYS.has(p.k)){const h=P3.hash(p.x,p.y),fixed=p.k==='winch';P3.MODEL[p.k](P3.K.at(p.x,p.y-.42,(p.flip?Math.PI:0)+(fixed?0:(h-.5)*.7)),h);continue}
  if(frames[p.k]){const [w,h]=PORT_PROP_SIZE[p.k],m=sprite(frames[p.k],p.x,p.y,w,h,p.flip);m.userData.propAsset=true;const o={mesh:m,frames:[frames[p.k]],fps:0,ph:0,kind:'static'};propObjs.push(o);p.obj=o;continue}
  const fr=p.shrine!==undefined?PF.shrine:PF[p.k];if(!fr)continue;
  const rc=p.shrine!==undefined?R.shrine:R[p.k],m=mkProp([fr],p.x,p.y,rc);if(p.flip)m.scale.x=-1;
  propObjs.push({mesh:m,frames:p.shrine!==undefined?[fr,fr]:[fr],fps:0,ph:Math.random()*3,kind:p.shrine!==undefined?'shrine':'static',si:p.shrine});
 }
 if(P3)P3.K.finish(ROOT);
 if(I.p2_brazier_0){const bz=[0,1,2,3].map(i=>procFrame(I['p2_brazier_'+i],0,0,32,32,'prop'));
  for(const [x,y] of braziers)propObjs.push({mesh:mkProp(bz,x+.5,y+.92,[0,0,32,32]),frames:bz,fps:6,ph:Math.random()*3})}
 // --- lancuchy od kolowrotow do promu
 W.solneChains=[];
 const iron=phong({color:0x4a4f52,shininess:22,specular:0x39424a}),linkGeo=new THREE.CylinderGeometry(.034,.034,1,5);
 for(const [x,y,tx,ri] of [[12.5,14.8,30.8,0],[53.5,14.8,34.2,1]]){
  // lancuch zwisa lukiem od bebna kolowrotu do burty promu i w polowie drogi dotyka wody
  const from=new THREE.Vector3(MP(x),.72,MP(y)),to=ferryRings?new THREE.Vector3(ferryRings[ri][0],.14,ferryRings[ri][1]):new THREE.Vector3(MP(tx),.3,MP(5.2)),chain=new THREE.Group(),steps=14;
  for(let j=0;j<steps;j++){const [a,b]=[j/steps,(j+1)/steps].map(t=>from.clone().lerp(to,t).setY(from.y+(to.y-from.y)*t-1.0*4*t*(1-t)));
   const link=new THREE.Mesh(linkGeo,iron),d=b.clone().sub(a);link.scale.y=d.length();link.position.copy(a).add(b).multiplyScalar(.5);link.quaternion.setFromUnitVectors(UP,d.normalize());link.castShadow=false;chain.add(link)}
  ROOT.add(chain);W.solneChains.push(chain);
 }
 // --- trzciny przy palach i brzegu (ta sama grafika co w Czarnoborze)
 const reeds=procFrame(I.p4_reeds,0,0,I.p4_reeds.width/(I.p4_reeds.nbDensity||1),I.p4_reeds.height/(I.p4_reeds.nbDensity||1),'prop');if(PORT3D_ON)nb3dSwayMat(reeds.n);
 // 19.11.2026 (autor: szuwary wystawaly z desek): szuwary tylko na wodzie, odsuniete od brzegu, gesciej przy pomostach
 {let cnt=0;for(let y=1;y<MH-1&&cnt<38;y++)for(let x=1;x<MW-1&&cnt<38;x++){if(ground(x,y)!==45||!offFerry(x,y))continue;let ax=0,ay=0,pier=false,lnd=false;
  for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const g=ground(x+a,y+b);if(land(g)){lnd=true;ax+=a;ay+=b;if(g===43)pier=true}}
  if(!lnd||random()>(pier?.3:.1))continue;const px=x+.5-Math.sign(ax)*.3+(random()-.5)*.25,py=y+.55-Math.sign(ay)*.3;sprite(reeds,px,py,1.15+random()*.3,1.1);cnt++}}
}

// Chapter I meshes: M1 ground, M2 walls, M3 props
// 20.11.2026 (runda bryl rekwizytow 1): rekwizyty o prostym ksztalcie jako modele 3D z Blendera (pliki .glb w assets/rekwizyty, zrodla: docs/modele/).
// Model ma tylko ksztalt, normalne i wypalone cienie (kolory wierzcholkow). Malunek nakleja gra: rzut obrazka rekwizytu z kata kamery (PITCH),
// wiec z widoku gracza model wyglada jak dotychczasowy obrazek, ale ma prawdziwa bryle, cien i zaslanianie. Modele sie nie obracaja (rzut by sie rozjechal).
// Bryla zajmuje miejsce i szerokosc obrazka; obrazek jest usuwany. Kolizje bez zmian. Brak modelu (np. jeszcze sie wczytuje) = zostaje obrazek.
// Porownanie przed: ?rek3d=0 (tylko lokalnie).
const REK3D_ON=!(NB_LOKALNIE&&nbParam('rek3d')==='0');
const P3D_GLB={beczka:'assets/rekwizyty/9c2b288a2f3e2836e6dfe2464e2e129fd8930da48f3515b3fffce329f628bf27.glb',glaz:'assets/rekwizyty/3cb68cacf5ffaedd72fce29dbbca8db4e7ac096239e46b549c9668db387046bf.glb',
 pien:'assets/rekwizyty/8e5f9297f89c8dd2cb0b59b6d3caa9e209a8ce36c582fbef0c0471545102c94f.glb',ul:'assets/rekwizyty/c40c8201a0698d7495a80fd087edb12d31d057927dde4a668294fa2b9d78fc99.glb',
 kurhan:'assets/rekwizyty/254e774d7a66d8de38394ba9683eed3ca9380c7266d0cceba3bad13450f5f414.glb',drewno:'assets/rekwizyty/64d715a6a73520da33b3ffeb683e620406f444122867ea745a0a34188d552ba1.glb',
 studnia:'assets/rekwizyty/b8b1849daf3675db429c598019be29d6a6579a8377b7ec1a763832dee5429c37.glb',
 // partia 2 (20.11.2026)
 sarkofag2:'assets/rekwizyty/7a1fd59e30f1d188ba58473f0cdb3d4dd5dc2a459a587d4d9c54eb28b965945d.glb',sarkofag3:'assets/rekwizyty/8f13a8553f74fa9fbf2467410a92b83b44de9fb45273ffb060c5e02b69f5178f.glb',kowadlo:'assets/rekwizyty/f575e38ba9da1ecf5a91117de65ed77d147854b8c36738e3004b385ebc67fe09.glb',wozek:'assets/rekwizyty/3705ea434ab8f04db7b99a570e8d68417a11c5883cc7d14b631f5b510a374e60.glb',skrzynia:'assets/rekwizyty/5c777017ca36b728084d7d67f26c0886910b9a0cb1dd4458eb004f51dde0354e.glb',nagrobek:'assets/rekwizyty/386e376c2ca397ad53a1447326acbe51459b52da2063c072c643b416e78b146d.glb',krzyz:'assets/rekwizyty/6282357a705b2de0cec4bd2d827e607060276786d01dfdc7518df8121f0979ed.glb',namiot:'assets/rekwizyty/789d91fd0158f5f5522a95d4319909615208d2e2ff51cb4b09de378fc3d8d9ad.glb',misa:'assets/rekwizyty/76eb154ce9f03249f23ec0123eb905b04e628f5e2d778d6d857352b4e189925a.glb',lawa:'assets/rekwizyty/3d8789aacb7c2b12f598045767b50cec55348362af0b566cb23395e2b790d164.glb'};
// rozdzial -> klucz rekwizytu -> [model, obrazek z malunkiem]. Rozdz. V: beczka z atlasu br_props dostaje malunek p1_barrel.
const P3D_MAP={1:{barrel:['beczka','p1_barrel'],tombstone:['nagrobek','p1_tombstone'],grave_cross:['krzyz','p1_grave_cross']},2:{sarcophagus:['sarkofag2','p2_sarcophagus'],anvil:['kowadlo','p2_anvil'],mine_cart:['wozek','p2_mine_cart']},
 3:{barrel:['beczka','p3_barrel'],sarcophagus:['sarkofag3','p3_sarcophagus'],offering_bowl:['misa','p3_offering_bowl']},5:{chest:['skrzynia','p5_chest'],bench_a:['lawa','p5_bench_b'],bench_b:['lawa','p5_bench_b']},
 4:{barrel:['beczka','p1_barrel'],cz_firewood:['drewno','p4_cz_firewood'],cz_beehive:['ul','p4_cz_beehive'],axe_stump:['pien','p4_axe_stump'],mossy_boulder:['glaz','p4_mossy_boulder'],burial_mound:['kurhan','p4_burial_mound'],cz_tent:['namiot','p4_cz_tent']},
 6:{well:['studnia','p1_well']}};
const P3D_GEO={};
// minimalny czytnik .glb: pierwsza siatka, POSITION/NORMAL/COLOR_0 i indeksy (bez biblioteki GLTFLoader)
function p3dParseGlb(buf){const dv=new DataView(buf);if(dv.getUint32(0,true)!==0x46546C67)throw Error('glb');let o=12,json=null,bin=null;
 while(o<buf.byteLength){const len=dv.getUint32(o,true),type=dv.getUint32(o+4,true);if(type===0x4E4F534A)json=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,o+8,len)));else if(type===0x004E4942)bin=buf.slice(o+8,o+8+len);o+=8+len}
 const pr=json.meshes[0].primitives[0],CT={5126:Float32Array,5125:Uint32Array,5123:Uint16Array,5121:Uint8Array},N={SCALAR:1,VEC2:2,VEC3:3,VEC4:4};
 const acc=i=>{const a=json.accessors[i],bv=json.bufferViews[a.bufferView],T=CT[a.componentType],n=N[a.type];let arr=new T(bin,(bv.byteOffset||0)+(a.byteOffset||0),a.count*n);
  if(a.normalized){const d=T===Uint8Array?255:T===Uint16Array?65535:1;arr=Float32Array.from(arr,x=>x/d)}return {arr,n}};
 const g=new THREE.BufferGeometry(),P=acc(pr.attributes.POSITION);g.setAttribute('position',new THREE.BufferAttribute(P.arr,3));
 if(pr.attributes.NORMAL!==undefined)g.setAttribute('normal',new THREE.BufferAttribute(acc(pr.attributes.NORMAL).arr,3));else g.computeVertexNormals();
 if(pr.attributes.TEXCOORD_0!==undefined)g.setAttribute('uv',new THREE.BufferAttribute(acc(pr.attributes.TEXCOORD_0).arr,2));
 if(pr.attributes.COLOR_0!==undefined){const C=acc(pr.attributes.COLOR_0),c=new Float32Array(P.arr.length);for(let i=0;i<P.arr.length/3;i++){c[i*3]=C.arr[i*C.n];c[i*3+1]=C.arr[i*C.n+1];c[i*3+2]=C.arr[i*C.n+2]}g.setAttribute('color',new THREE.BufferAttribute(c,3))}
 if(pr.indices!==undefined){const I=acc(pr.indices);g.setIndex(new THREE.BufferAttribute(I.arr instanceof Uint8Array?Uint16Array.from(I.arr):I.arr,1))}
 g.computeBoundingBox();return g}
// modele sa male (20-220 KB); pobierane od startu gry, zanim gracz wejdzie do rozdzialu
const P3D_READY=REK3D_ON?Promise.all(Object.entries(P3D_GLB).map(([k,u])=>fetch(u).then(r=>r.arrayBuffer()).then(b=>{P3D_GEO[k]=p3dParseGlb(b)}).catch(e=>quietErr('p3d '+k,e)))):Promise.resolve();
// malunek bez przezroczystych brzegow: przezroczyste piksele dostaja kolor najblizszego kryjacego (model wystaje odrobine poza obrys obrazka)
const P3D_TEX=new Map();
function p3dPaint(key){let t=P3D_TEX.get(key);if(t)return t;const img=IMGS[key];if(!img)return null;const W=img.width,H=img.height,c=canvas(W,H),g=c.getContext('2d');g.drawImage(img,0,0);
 const d=g.getImageData(0,0,W,H),px=d.data;let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(px[(y*W+x)*4+3]>128){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
 let ok=new Uint8Array(W*H);for(let i=0;i<W*H;i++)ok[i]=px[i*4+3]>128?1:0;
 for(let pass=0;pass<48;pass++){const nk=ok.slice();let any=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(ok[i])continue;let r=0,gg=0,b=0,n=0;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;const j=yy*W+xx;if(!ok[j])continue;r+=px[j*4];gg+=px[j*4+1];b+=px[j*4+2];n++}
   if(n){px[i*4]=r/n;px[i*4+1]=gg/n;px[i*4+2]=b/n;nk[i]=1;any=1}}ok=nk;if(!any)break}
 for(let i=0;i<W*H;i++)px[i*4+3]=255;g.putImageData(d,0,0);
 const tx=new THREE.CanvasTexture(c);tx.anisotropy=4;
 t={tex:tx,box:[x0/W,y0/H,(x1+1)/W,(y1+1)/H]};P3D_TEX.set(key,t);return t}
// geometria z UV = rzut obrazka z kamery gry; jedna kopia na pare (model, obrazek)
const P3D_UV=new Map();
function p3dGeo(model,key){const id=model+'|'+key;let e=P3D_UV.get(id);if(e)return e;const src=P3D_GEO[model],pt=p3dPaint(key);if(!src||!pt)return null;
 const g=src.clone(),P=g.attributes.position,cs=Math.cos(PITCH),sn=Math.sin(PITCH),n=P.count;let x0=1e9,x1=-1e9,s0=1e9,s1=-1e9,zf=-1e9;
 for(let i=0;i<n;i++){const x=P.getX(i),s=P.getY(i)*cs-P.getZ(i)*sn;if(x<x0)x0=x;if(x>x1)x1=x;if(s<s0)s0=s;if(s>s1)s1=s;if(P.getZ(i)>zf&&P.getY(i)<.02)zf=P.getZ(i)}
 const b=pt.box,uv=new Float32Array(n*2);for(let i=0;i<n;i++){const u=(P.getX(i)-x0)/(x1-x0),w=(P.getY(i)*cs-P.getZ(i)*sn-s0)/(s1-s0);uv[i*2]=b[0]+u*(b[2]-b[0]);uv[i*2+1]=1-(b[3]-w*(b[3]-b[1]))}
 g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
 const m=phong({map:pt.tex,shininess:3,specular:0x060606,side:THREE.DoubleSide});m.vertexColors=!!g.attributes.color;m.color.setRGB(.9,.88,.86);
 e={g,m,w:x1-x0,zf,cx:(x0+x1)/2,box:b};P3D_UV.set(id,e);return e}
// 20.11.2026: modele z Meshy (Image to 3D z malunkow rekwizytow), odchudzone: geometria ~6 tys. trojkatow + kolor i mapa normalnych 1024 (narzedzia: docs/modele/meshy_odchudz.py).
// Maja wlasna teksture, wiec bez rzutu z kamery. Gdy rekwizyt ma model z Meshy, ma on pierwszenstwo przed modelem z rzutem.
const P3D_MESHY={
 pot3d:{g:'assets/rekwizyty/fe14fda9fd4ab25a29252b1fe7279c715eeb3c216e6b3820ffcffb40f37b8170.glb',k:'assets/rekwizyty/ef2f9c37861f6a672cf0eacc48c5bd66dc44751618f2974e845d64d4d660766b.webp'},// Sycący Kociołek (z malunku, płomienie wycięte; od 22.11 bez ognia pod garnkiem)
 p4_dead_oak:{g:'assets/rekwizyty/93ced40c847376dd68095b8a3c68de7815e7e09332175ebf53ff765d3158fb73.glb',k:'assets/rekwizyty/a2764645880ea286d94b5aa4989be2a9a08ea71d66f1b1c7dea077452a8606a4.webp'},
 p4_spruce:{g:'assets/rekwizyty/ea855bba4595c93e60e15460601901467fae2350282a855593da6fa1e084966d.glb',k:'assets/rekwizyty/1116e7b980554d3fc1462c02a582def25e5ca23491c5216884bf7763af3c3897.webp'},
 p4_birch:{g:'assets/rekwizyty/41f0eb46bbeace2f48771537201f564b5fb8299a5b236f401204d3c91b1a9b24.glb',k:'assets/rekwizyty/b3a2743a60c882b296d476cfa1aba9c43f1dd3b9c4da808088641e60e94485e4.webp'},
 p4_dead_spruce:{g:'assets/rekwizyty/a4ad15da7754bf5bf0db052d621c5e8a9af3510249b0c4d77418b67f437e1bcd.glb',k:'assets/rekwizyty/1c9f477f245e4af1a1f5b8653729fd962110603b1effc1439a12339fcd6b6c4b.webp'},
 p4_tall_pine:{g:'assets/rekwizyty/657e82f46188828cfd82f6061f07c3c4ea076c126223daf75b4d5c0377b8d7ee.glb',k:'assets/rekwizyty/2311e68e3567935c0461d9e3eeeecdbb485d135b55f7d64f0b22018d30ab7232.webp'},
 p1_dead_tree:{g:'assets/rekwizyty/19a94455a1485d4e758afb95f42b68c553309dbe2f519f47e4c426a9f4852255.glb',k:'assets/rekwizyty/3985e321888e747ecfb6975d21376f26445f6d78156c70ca28d06989e8443956.webp'},
 p3_dead_tree:{g:'assets/rekwizyty/4d0a79bdc4ca05b11b130fa036c44f0981ee49ca5c049c3f219ba05226c8e6b4.glb',k:'assets/rekwizyty/1436713560ee8d19bfb55c85752c4e60862d955149f12c0ae171275e4aa66a69.webp'},
 p4_sacred_oak:{g:'assets/rekwizyty/f3a68122da0b8cc01e024938075bf6ce052bb5d0d596de27e4ac83ef78a54540.glb',k:'assets/rekwizyty/a3183b7ade661b239755a73ee7828bb9df02ccb5ff81902842c9214a1bf2739f.webp'},
 p4_hanging_tree:{g:'assets/rekwizyty/dd57a0849f3e214ca7e1f6cd1cfd7359376cdad92cd4dc4605546f82215442c0.glb',k:'assets/rekwizyty/274b6d33d371f81d6876daa554317a74865af04ec76ae37788f55591f2ef68d3.webp'},
 p1_barrel:{g:'assets/rekwizyty/97fb75a8881a339304583244c0bd49e14926df213171e8cc202bc4fb7e082c3f.glb',k:'assets/rekwizyty/7dee01e6df434f9608899521e15d4c1fefd8a02dcd65b51eccce499e77e99ba9.webp',n:'assets/rekwizyty/dac99927dd8a7a7a1c8a7160290faf188b6df82577f9a2ad9655f4c6071f9261.webp'},
 p1_burnt_hay:{g:'assets/rekwizyty/5ec363da5df40a8ced1bd949a78c20846762160a4eb3beaf7a867954c5158206.glb',k:'assets/rekwizyty/efdc9f58a65d1a0436500a0394290f937c502d09af812d571b6d553b49a95638.webp',n:'assets/rekwizyty/e274d7112a6c85989e0a2a81e624edd14da962cb4ec0fa5d58268d4126b78c1c.webp'},
 p1_covered_corpses:{g:'assets/rekwizyty/abee30f52826a1d652ad9a0da0c86679a3fd1c9df82a8821703279144e800d03.glb',k:'assets/rekwizyty/fad8b5823e2bba321f1c6ba2ad271d52d5205e8fc41fcf15c141e01400011041.webp',n:'assets/rekwizyty/3439b2a9425bb251427ea1e036c2236ee6f571a7919f3ea18c9f3b7c81b9b946.webp'},
 p1_grave_cross:{g:'assets/rekwizyty/b4dbfcf1a61b1125bfff237553a97481014fa7d52d8499697cf20c604e718a8a.glb',k:'assets/rekwizyty/7fb304ce2d1f2e5446e370fe085ddc9b67a4c4ed5aaa0cb99e7f3b85eccd3599.webp',n:'assets/rekwizyty/ddebccfb7caa958e8b2d24b1a2c99f57bfedfe1521dc7d32ed3e92df716a9948.webp'},
 p1_order_banner:{g:'assets/rekwizyty/d49be01ebf435aefdf7bc5001afd2665635a2f76374538889d33f5d25e0370c1.glb',k:'assets/rekwizyty/6bae8a48743c0b665b0d98d317ee7626a37ef760bd6e640c8a9c22b1d22dc72d.webp',n:'assets/rekwizyty/99abfbc6aa1cc93a3e0f38fed9fc71929190a0bdcfa46cdec618d0ce91cbe0ee.webp'},
 p1_wheel:{g:'assets/rekwizyty/581b37a3442b2abc63b80ace2e1d897886ddc1656a94b7fe04c6b4b78863e0f7.glb',k:'assets/rekwizyty/b089b905136d86db82cec88bcfa1b267498d28ec9b9ee34c58655c5679a92e9c.webp',n:'assets/rekwizyty/68ff3d049bf22c9a5b4be4211bb0d58c98bdf404dad5f7dc8cf8be377be95e7c.webp'},
 p2_anvil:{g:'assets/rekwizyty/a62b161c3f712f3d1a3a7c2f51cdcc2dd41a145337dfafa6d7035ff327dea7e5.glb',k:'assets/rekwizyty/73d15578aa3097b93622f9e1012ded2f99f867b70940c2719589a19eaffc2e4d.webp',n:'assets/rekwizyty/af1d2b1b6c4b762f191a0b79c6fbfde0824c8610314a8ceeecb6102f9e57ce64.webp'},
 p2_clan_banner:{g:'assets/rekwizyty/b4c244c4557d58c53fd43d5a866699af07155c7d3f8707ef5c0e3af58ed58b29.glb',k:'assets/rekwizyty/41bb6ecbb62f5f9e93eb8b6e52de3be21e0339fc8067ea893f5ad520b0d71ab8.webp',n:'assets/rekwizyty/09ebd7c60a53916a0efdf8ebe721fb1fcd5ad1c2a41fb239a4b7ae577f192ec9.webp'},
 p2_pickaxe_rack:{g:'assets/rekwizyty/98fc30b5158173955e7057df8e5a82a083e6948d60ec922fdd823d317f2563ca.glb',k:'assets/rekwizyty/d4c16210f9e3a7d611338928df0c0cc6e71d2f7a44ded8e8720ba73dfba8a4f4.webp',n:'assets/rekwizyty/4dd19488976f7eb42c2b75b88b3e722f7acf90cda848b2a2162887c190ab5aa4.webp'},
 p2_rune_lantern:{g:'assets/rekwizyty/87e40dbdc16c6df6cd521ee0653c879223c70bc8d8d91bfd4a98f281fd5abb16.glb',k:'assets/rekwizyty/8953cce1d3ea21378f294b3ac1410cae24b590af4ed708847e5da06a0d5a2f00.webp',n:'assets/rekwizyty/cc630eeb95c456e2f434a8bd028a80bee179ad714efd778f60e570b223a96c8b.webp'},
 p3_beggar_bodies:{g:'assets/rekwizyty/e781f9c695514de5248c2c5c4741babcd738fe771e64b4abdbedfb19bf8d3fa1.glb',k:'assets/rekwizyty/602e81a0a3747095fe3b0123185eeacf61b45cf1b45fab3317bf012f0642c445.webp',n:'assets/rekwizyty/060da19595e8caee1c4fa27d0481d31456ee418d49fd680699dff84c39cc564c.webp'},
 p3_street_lantern:{g:'assets/rekwizyty/ad711376a10734b1054c5254dc756c36a2c3980c7a8ef13eb3bebec28c18b5d5.glb',k:'assets/rekwizyty/bc51a45ca2052d3382fd29467247bd87d9a8391b61aa5eb5b081c5a44d91c05f.webp',n:'assets/rekwizyty/cbd79335f58e0c4dcd7cc136fb14f0208d5e563dca44068ece7106ad50a53a09.webp'},
 p4_cz_bones:{g:'assets/rekwizyty/417d919bac3e76f45b2a0e1f5db19b947cc7ed9d80f369ee6a28fa47ea606f92.glb',k:'assets/rekwizyty/ee028c70b74c87b87f3d5bcc3baa58be33525f9c9ec958052da355fdfc609f8e.webp',n:'assets/rekwizyty/e0868627318470a790949fcc2a559b1362a0499450cd96459561ae29eba53e25.webp'},
 p4_wolf_skull_bush:{g:'assets/rekwizyty/d586721774ff3fd131184a6603e7af22cfb88d0993db56963afb6bd01b586b7a.glb',k:'assets/rekwizyty/a623cf4fc471573ef774b23cb83f78e74d1c77a8b95333d91653de0753b7cdc3.webp',n:'assets/rekwizyty/ffccf61c5d54b0d1b087b09c1c48f5033b0f77566f1ab41a838010368b5b88e8.webp'},
 p5_candelabra:{g:'assets/rekwizyty/3a3c0e859ce967b915b1409a30a9e73e762c266d2479d9e8dd1f0d0a06edff5b.glb',k:'assets/rekwizyty/88af429b2cb328a8a7cfe63813d729b132b2bbddb8a2f55963818fb5b8c2256d.webp',n:'assets/rekwizyty/7884fd5e77e8512602f68250058ac353abbc9deea67d5ca0c99c201a6407ccd0.webp'},
 // partia 2 Meshy (20.11.2026)
 p1_gallows:{g:'assets/rekwizyty/62f69a6d51520d8f354fbfedd59128e9534a493440ca2b1aa0018387f2a79aa7.glb',k:'assets/rekwizyty/a3daea85d08f6638ed0e4ec06affae6d42f26b7544e6b832d1cacfb460710aa2.webp',n:'assets/rekwizyty/aaad74a4d627f774726be509bfb9b7ed220ba561a1012d5399976ef742a41042.webp'},
 p1_marga_cart:{g:'assets/rekwizyty/07d9052aa39653d85966a970efa287f90a1f1c16254b0ae5c0a26dc7d0cb4707.glb',k:'assets/rekwizyty/b377b0298ba7773242b30527b9f0b75762feb057c7cfbc248a9fffb3eb6ab8d7.webp',n:'assets/rekwizyty/90e90ded2eea8a01c363cc54c6cd6e8dd040017c31e4be28611921271cd7b8ea.webp'},
 p1_tombstone:{g:'assets/rekwizyty/9d604e8d236504674f8b9319aa795913740467c8c07bf446a16e3919fb751a98.glb',k:'assets/rekwizyty/e302232b71c518e68e165664103a5fa18aa122ef2cb886d0abd9f9bbe1355679.webp',n:'assets/rekwizyty/05f8730f3ca25407bcf0b606e9838364392b46a11bfdf598e1473c990f66e884.webp'},
 p2_black_powder:{g:'assets/rekwizyty/376d4b728e72453c01f6046e03c1424d597d456bcae792b5a2c190cad8d71ea7.glb',k:'assets/rekwizyty/e6633d8ccf06e7b28d6c2b8fdc83cb8d2ecef33a5b20c7448afc1fdefb1ab725.webp',n:'assets/rekwizyty/34bd6c62fbdf6d6729c8f9dcb39a49a130aad4c262523d3d58232675e88e8e97.webp'},
 p2_chains:{g:'assets/rekwizyty/a01cd413c16986866064ec258d8ca985c4385e3f740ec484bca718cab58a8081.glb',k:'assets/rekwizyty/24b3c6ea8822753970863e01461c8ff1854f4ec378bc8c6ebd0e7b318f30d553.webp',n:'assets/rekwizyty/b49358e11c96fae86982e8f7085bc1461302aa10d897c4e990b4e50305ad06f7.webp'},
 p2_king_statue:{g:'assets/rekwizyty/60df8f8d9756dc1675357dc5119a69b0197e8ae7f8a0aa6dd8bbd80e111871ee.glb',k:'assets/rekwizyty/afdb39d4c9c6e04b7131384dc18d77094ea1a012725b85e3f4611315b0a14e82.webp',n:'assets/rekwizyty/fa893402c7bddc411025c0e923a9a3a55ee865cbfd1b71fdd8518320454b448e.webp'},
 p2_mine_cart:{g:'assets/rekwizyty/4292886626a9e221f9c6c3e467653a20d2a330901363bd1125bffbd59e26249a.glb',k:'assets/rekwizyty/13581fcbf55844d0643b81a39c765456ddc518918f81eb3ebc5df13c9442e792.webp',n:'assets/rekwizyty/56845cda6ec9b71aa8be758abd12c46c1c1a734c0758ab0b9045ed32d88013dc.webp'},
 p2_sarcophagus:{g:'assets/rekwizyty/d102bd2d832bb30a62a331c598ee079b37607dd49f2e560b2dc4ec9a03f72c31.glb',k:'assets/rekwizyty/f13ac7b3571a0c4074a166af838b80e45d91a5bcf9e6028c084f6afb130f2f9b.webp',n:'assets/rekwizyty/c930fea454f1482559eff5ceb573a46be34aabe5aa7a31d513e76e4a24be66e5.webp'},
 p3_barrel:{g:'assets/rekwizyty/59b62fca635dc3a7f77c2c24245e1dc478baa9f7155848c32ebb4c36274e2a0e.glb',k:'assets/rekwizyty/09c7b6ea233413df795360fc9771ce8d9a9ba10b6e102a68c9a64d4925db4c38.webp',n:'assets/rekwizyty/95c2423b87f85f03e66cb99f535965e76841305d4ce27caca2777720af44434e.webp'},
 p3_gibbet:{g:'assets/rekwizyty/f0c0898fdfd02a6b86ccb9cc0163f6541fa7498925954b20da770a5fff800e9f.glb',k:'assets/rekwizyty/137a962ce48a4de653e25ca3243c89b9e168ea38cd170957e9bbe922756a21d1.webp',n:'assets/rekwizyty/ef5f33fce0ef46bb3af036d3c7af4f927de34cbd796d3b370090f8d2c51f6c1e.webp'},
 p3_plague_cart:{g:'assets/rekwizyty/94253e9573a551394426e9e6ecddde032e17db1f7c3618cc43709c8bf721a078.glb',k:'assets/rekwizyty/526c8f6920c7f025f83afdb3d2ab371b0a20a70cddb55f5f542737213701356c.webp',n:'assets/rekwizyty/8391539663d61eb070c47620ed88611b2cf65bd21a6e4b931d54cc5372540980.webp'},
 p3_royal_banner:{g:'assets/rekwizyty/8caa7617e81985d2863148019469801ce30bfb32d5f89e5da02c00e203bd59c0.glb',k:'assets/rekwizyty/a412609bff43ff84fbe708d495f173a3dfcf583cb97dc969b9ad0a01057e0c50.webp',n:'assets/rekwizyty/84465742cb2327b4e4860fd23b0cd570c4f0e7395f7a1d3b7b28c2f84a700ab1.webp'},
 p3_saint_king:{g:'assets/rekwizyty/f5c570c84a8bd30ccb7f45a77de1ee49800c06ec314379701b240400290649e1.glb',k:'assets/rekwizyty/ce24f14111f2a1939dc7b165e79abc106b828adc6694a0ef67463f9bf886135c.webp',n:'assets/rekwizyty/cd8ed59c77537af6a279895dfbde71e3dd19488b3667031512af4ab14f6a8297.webp'},
 p4_burial_mound:{g:'assets/rekwizyty/8bbecd0efbac27249639092d9c8462d610058a8a12f44d2c56054a8225ac678d.glb',k:'assets/rekwizyty/f88e5f94dad662dc965d7f52248883ab83a5cdece5b783c843c50c4b8b0d789c.webp',n:'assets/rekwizyty/27c78168ac3a54e236a8b891b6bb5c7f86f3fc088b68441b26255e0df53bd5fd.webp'},
 p4_mossy_boulder:{g:'assets/rekwizyty/a59c5899a20cc4d4e6b5a71230c6cfaa18590359774b77de08a7c62935c96747.glb',k:'assets/rekwizyty/c12743ad51f7ee30af5f6c6aa0fd12dab4d063d87b52fdc16a61170ecf626b40.webp',n:'assets/rekwizyty/49d4bd234812ca190ff5081aa2910645b5e6d6b4fd171304acb1fc42cc3f8381.webp'},
 p5_statue_a:{g:'assets/rekwizyty/7ebf0ff89a83267abe3f885f2ddf54830f86d3f633401482c659203890d1d79b.glb',k:'assets/rekwizyty/c8033e45b27ca1451c89add844a60a06e300b609d6d9d84b3fd94345de30b6c8.webp',n:'assets/rekwizyty/50e83df1c35adb3a26e005a27f87728029a13e95b5827c231f6aa70eb9a567be.webp'},
 p5_statue_b:{g:'assets/rekwizyty/50c314624a3de8dd9c271c7d0b7a468a508f6c19c5bf96610ea4a92e67e0b193.glb',k:'assets/rekwizyty/916d9a78b9f8c984cb9f4f11363cf936c7a8c66030ffb6abf8ab718432d4ef77.webp',n:'assets/rekwizyty/a5a18aa20eaadd42f50c10864905b0f2d155c5b45d8bea6911ffd9eae8f05633.webp'},
 // partia 3 Meshy (20.11.2026, 36 rekwizytow)
 p1_crow_post:{g:'assets/rekwizyty/0400fd5f052a79bf652309ba85c1138642cbd356dddce68da47e023f38fd2045.glb',k:'assets/rekwizyty/3175a3da1160da1c78ee187bf267311d0ae010d370bf369ca7b68f6f3bacdeb6.webp',n:'assets/rekwizyty/122a9634c601f22e4024d280532e09d4d656b9c9abf606d065dd9b084c93579c.webp'},
 p1_dead_horse:{g:'assets/rekwizyty/ba8beaa24d691dbe37ba1a58bf6aa2102a2ecf48a01344602543efeafc835fa9.glb',k:'assets/rekwizyty/7c8b6783ccdda6117d0eac7b430973fa031e15ca6b36a54d2994dcb4bc517570.webp',n:'assets/rekwizyty/77a6ccf9412bf2841edd1d6b64eb0eb9551c53b7abb618c13df20c683ae61011.webp'},
 p1_shop_sign:{g:'assets/rekwizyty/3d77cffdf0cbb68dbbb7b9c9760afe2c853e4a3c9f7296acac7e9685197bfbe0.glb',k:'assets/rekwizyty/9ba1410e517970075bb7e6f76e34a4b2a4abf6811ba067db1f8bc428e02fef2d.webp',n:'assets/rekwizyty/99619c6a360e66fbd2209ace1ad58dc12da206dff857b01b968e68f8f8bc2a41.webp'},
 p1_stocks:{g:'assets/rekwizyty/fa22b6737791fdb75b9c109bfbab548fc598899031fe7a6603b97ffb80994e06.glb',k:'assets/rekwizyty/4fc16cba6e4414b468f8df997f67795d1be066fe8356d0b0ad936743056a7099.webp',n:'assets/rekwizyty/07b948ae687740805e9ebd390a68f9d2af29f192fe948314e25bf00e25a98248.webp'},
 p1_well:{g:'assets/rekwizyty/5ea1e383f87c902d002f2e91ce6ea4472f5b7707b9305a9e7ece5387fcf87709.glb',k:'assets/rekwizyty/dc3d6cd857b2f2b3c564e55979bef12803cbd4064bdef6317ec8ec7bdea2cbc3.webp',n:'assets/rekwizyty/a49fd1d067fe8c274f0f51ec43300ddeffcf66bd1fc87db5c02f1921f1a7633a.webp'},
 p2_bellows:{g:'assets/rekwizyty/231af84295b5d49e884c88695a2d9b73a8e55af5f9a53975a33348356b558dc1.glb',k:'assets/rekwizyty/ac4ba48735b593d28e02ebd61cd6602c6c4b3a1dfabcfa16927bcda8314f2c31.webp',n:'assets/rekwizyty/c92fd9d63a63681bb152a8a8c3d79633ec624f651f69aecfa2a28f9b2bbc3245.webp'},
 p2_fallen_pillar:{g:'assets/rekwizyty/e87d638dd3b099f8b46a06376642fcf44e13a87bb86b18b509a68cd707371a89.glb',k:'assets/rekwizyty/0ebbcd276279f9222d74797245e02be5ee20b1665fec076879ad899cda8d2091.webp',n:'assets/rekwizyty/2afe69c4bcb2f28bff2cbc22aaf1f9f10978b0e8d8ab137047076fb960904a54.webp'},
 p3_chains:{g:'assets/rekwizyty/b6b2cabbb96051ddd712e81a4cee40330a85ee565e42b71ebab46ae493348161.glb',k:'assets/rekwizyty/02a7ac259d752bfd0bd5e3920c37fd62003ebd47ee4ffae6d586daebcd7d2b86.webp',n:'assets/rekwizyty/8777af8b8500ac19ba1fe18c276304752d25bc8dd8d7f5c30627a8901d1f40bd.webp'},
 p3_dead_horse:{g:'assets/rekwizyty/1a9c576fb06eb07c9d1a9de624b8d389e6fd9914b643ba04b2f88bcdd3c2caf0.glb',k:'assets/rekwizyty/b1c92ea3ee82e99c4f22b18c009a8a1bbf7280a5a304360bc782573ae92b348c.webp',n:'assets/rekwizyty/a80dad5b52c3e75421ac65a5530aa9ede061675de66f5a6eafc04df64b5959e0.webp'},
 p3_gallows:{g:'assets/rekwizyty/964c22c97b044020c97a5c6c7c32d61d8355a162e68aefc3efd30891d61c6968.glb',k:'assets/rekwizyty/884003527fa90c69c4420b1cd6017f2ca7b3d9b52e8574ac3e562077ef177b66.webp',n:'assets/rekwizyty/d3b675ae409ce939dab94e20b06596c84d7cfd567ace54e68c0bbcb9a502de49.webp'},
 p3_offering_bowl:{g:'assets/rekwizyty/69baf00e615a0342a7b7051e73bc649f707a89662aa15a8f11bab700c23055f0.glb',k:'assets/rekwizyty/9fd5924db46903ad4d831320408396d0a01104138f57acc5de62e8921acc726b.webp',n:'assets/rekwizyty/294560454cf86ed9bce51ad400785891a08f97d63bc134a806142fbcfd210683.webp'},
 p3_queen_fountain:{g:'assets/rekwizyty/9c3cbeb8a3640f96bd6843e73228fd17063dc580400aa67c19868c6f13fa1db2.glb',k:'assets/rekwizyty/472aa18b91cc9fc02e0d49ffb81868c27714606bdf25174046bb3fd358fae71d.webp',n:'assets/rekwizyty/caed101fe6943c6f2acf160eac0dc951e7e730c8f0e041718a8bc9ddac8cfe08.webp'},
 p3_sarcophagus:{g:'assets/rekwizyty/429ce1ba53bf187581ad685432c9f3f66f0e2aa4948637cb3b27a0aa8199c003.glb',k:'assets/rekwizyty/5397c7e2dedc22296fa4230d61de7a4aaf81d6ab904146d745026e1966ab3e0c.webp',n:'assets/rekwizyty/8de97b164059853cff6c401dd91358ece31a6105dae5c2d68c416bb268a2646d.webp'},
 p3_wheel:{g:'assets/rekwizyty/a15b4c1fba9fd208df53a6c609199f2cd53fb8e2d042a2350e6d6f1bc3155233.glb',k:'assets/rekwizyty/b06dcaa7ebdeee117dca6825fdcba3a23349c666d022d10560d5811f2d808a99.webp',n:'assets/rekwizyty/a20a9857565c0fe3fe4f7f9461c0b7fc10f8804991af4f7ff6b88d384692937b.webp'},
 p4_axe_stump:{g:'assets/rekwizyty/281f78c993dcd426b36bd18737ebd8d75085c213f779dcd25ae975bbd29feb09.glb',k:'assets/rekwizyty/9ac59839588347b890697637ffbcf6ef2605746f660092540b364a8f8a6ca7b6.webp',n:'assets/rekwizyty/5993ba7238a1f8aee92f1a83307ab368a7e3e730b64a4586ac7170544465571f.webp'},
 p4_cz_beehive:{g:'assets/rekwizyty/5e61f72ae6db1327e84a07d6905f205ecbbdb806f60e0444931edbd3c3eed766.glb',k:'assets/rekwizyty/a44fdc5bcd7f9a9bc670031a9fed3b96f2eefd59a09d212ca8d6b01ba303a774.webp',n:'assets/rekwizyty/7a1f3649072bd8f4a35fc3648486f412040adc5e924ac7ce6f9cd9daf41a2b7a.webp'},
 p4_cz_firewood:{g:'assets/rekwizyty/1878b1f2375c7a0208db8ec9895592374ddd9dd05b1825bb8228b6d503533bf3.glb',k:'assets/rekwizyty/3c6674caca245e9dc18f9542e8d151492bbf42679baf264559993d55f7c7fa95.webp',n:'assets/rekwizyty/9abcab9853f080abdc269da93bf7d6751f954e4618fb6f8547ec4f4c81891478.webp'},
 p4_cz_gallows:{g:'assets/rekwizyty/2296dea74475208fc3fd5a3989396bcf47115f2a05354ebeaebbcc68b2d1cbad.glb',k:'assets/rekwizyty/8115c90c547781bcdd72fc6acb7b78c84797a56730eb8bfee33139c0dac432f5.webp',n:'assets/rekwizyty/1242fb90f7ccad0a133ab72eb9a6e7eaad9814ea52a06d53742312685bc49b07.webp'},
 p4_cz_idol:{g:'assets/rekwizyty/1ad1fa9c38ad009fa83171361c3c36d9308bd62ccf235a95160a5ca7966c2610.glb',k:'assets/rekwizyty/a0d741a976537b1092429cc33cefc43fde08b5e10a8504694cf0c16d4e175e19.webp',n:'assets/rekwizyty/3f400947d502728a952bac41941a6daefd983e00b2d41027354666b7fb5d5b5a.webp'},
 p4_cz_pelts:{g:'assets/rekwizyty/cc04003cf1dc39cee926f64d6f06a3b78f02784f05d6f4871b80e0fdbcca532a.glb',k:'assets/rekwizyty/fa0150c8a828efed5a69e19da47763906d6a058d16eeb0442ab021e49be6cec6.webp',n:'assets/rekwizyty/caaf0974d88b88c86a37ab9463628fd992971e80bd80af20834c9a0c49829a88.webp'},
 p4_cz_sacpole:{g:'assets/rekwizyty/2c149c7b5740acbdd9eff7fb1f9ea190b83ca17a7cc7ff4260c8fad2dfbe1b74.glb',k:'assets/rekwizyty/a751c520f302d695878ac9eef6a6351578f0b26e71ebf5d73132cd654bbda31a.webp',n:'assets/rekwizyty/bcf5a9e40249d3c6844f791a07ee384ae5a61fd13ba6b7bc4679b8839db40074.webp'},
 p4_cz_tent:{g:'assets/rekwizyty/349cb9697f213870dd3af540ffb9b4ebd0946747a9458d2175c2b0cc8f357b36.glb',k:'assets/rekwizyty/a1a0e0aef659424cd9871f16bb3467831dcccb4aef5304dcf9b68437229b3227.webp',n:'assets/rekwizyty/3ac90d3cdfe12b4a02957bed7d0fdbea07f8219708f75f902a3f150f99a01737.webp'},
 p4_cz_wagon:{g:'assets/rekwizyty/71a2d2b4b78910600507d729697c8427ba9c2f1ebce94a0aa3ec2835e7271be8.glb',k:'assets/rekwizyty/6edd5d7e57e0ab9b642b12d8c0b01218bc66ad001aaa5521af96094ee4d29741.webp',n:'assets/rekwizyty/04c37baa59880f2b8255f79896122694b1f713769450e199a1c2124af73f37f2.webp'},
 p4_cz_wheel:{g:'assets/rekwizyty/d4a4126d25a28cad83dc637107997e83c448ca35f8070d088444765fff9e38f4.glb',k:'assets/rekwizyty/d579396b07c7dee16541d72063afa575de09677614dd6b063a764b11c18e8249.webp',n:'assets/rekwizyty/5f1861893b9814373e21efe4cff68f80dad8d29bc16b08481c8e0d37f35a60bf.webp'},
 p4_drowned_cart:{g:'assets/rekwizyty/07b18c2f24a7cd464c38f38b895a80c3ffee8ee203edf13068caea5a27be4fba.glb',k:'assets/rekwizyty/cbeaabc364f69111896a6fb0b44271eaa387fedf02fa7dbf20fb0798becb984f.webp',n:'assets/rekwizyty/9c6f7dbbd6198ba8667058277b93c56dd1e3d3974b313cffd1577deffad1f2b3.webp'},
 p5_armour:{g:'assets/rekwizyty/4abcac61c3539653ea54ea82f260490c9f73360fb4aef58a1bd0a3bc9ea792bf.glb',k:'assets/rekwizyty/d01cbd32958c578aecea1c3f12e96377e74a3241fbc9b3b1f61fbfe4f5e61500.webp',n:'assets/rekwizyty/95da18a7a01a89517ed580ad226e2dca80ff229ef61a9e484947af856b41d6be.webp'},
 p5_bench_b:{g:'assets/rekwizyty/e720eb9e82e0ef352d6aa308b696b2a6aca1d1369aa6971a07eba1029c6a4a1b.glb',k:'assets/rekwizyty/e184c38fc875c0e3b5ebc0025e57929f5a0b6aa1e824fa6b4e60f652d79c433f.webp',n:'assets/rekwizyty/5a0a730b341ac5f25e3e4d6b3f1e1e6fc55d7cbeff72388a550c5182d7b704b4.webp'},
 p5_bookcase_a:{g:'assets/rekwizyty/9febd7d21703e4a9dadb98b9f36b9aad704fcf8b330b661de53bc76331eee35f.glb',k:'assets/rekwizyty/bca744456a41bfbcfe74548adc6335a4d09cb8ee0c99c99cf1715f2b6644df2f.webp',n:'assets/rekwizyty/847e66a69a8a23e67394c4c42328b5fbb4118abb18b0d24fd85ca3368d404d27.webp'},
 p5_bookcase_b:{g:'assets/rekwizyty/99b27e591f7912b6968017f3305c934956069fbe8de065aa72da27f76b23d831.glb',k:'assets/rekwizyty/97ef832c2559e3ad3583fc1c84c7f8c7e6fec4aeb21ab515ce59062fae3c6f59.webp',n:'assets/rekwizyty/1c4d6e91e03cf1d525f3bf82c12b11388895c4a844f64517f3e4da3bef05bd36.webp'},
 p5_cage:{g:'assets/rekwizyty/823476322e64675ae72bc4994e7c95cb6e334b0d03bb73c27e525268c1f6eacc.glb',k:'assets/rekwizyty/93b768cbfc08840e245db0799c921b3aa6efc766e01a7a16176b47ea611ffef2.webp',n:'assets/rekwizyty/74599a3417e75aca2e50ec1a01cf170ca089557bf9232e0fc9f717c403af3c32.webp'},
 p5_desk:{g:'assets/rekwizyty/944fbeafc25097393ac18bf4dff81ea627e3a0b4837356fcfa1d9ed852271540.glb',k:'assets/rekwizyty/5917f1cc534658726caa5fed5d4ade71a93d0eeeb68c2b29c45758a9c58e332c.webp',n:'assets/rekwizyty/fd281ad02f91bb349d415211efa7e52d6d0c6890e5a7da93b2b30da8910c5b87.webp'},
 p5_lectern:{g:'assets/rekwizyty/f55337eaef053563e5ad85271ec69d7b92306a401f1a04f5b2d02d2aea4e233a.glb',k:'assets/rekwizyty/c641122513e1e1fd1734ec1d57bb180febe36f5b95bdba3ad4970bb93ae627b8.webp',n:'assets/rekwizyty/7ab40ec2add7e87d8819c242b46436110719ac929cb39bd685325fa0f87dfa52.webp'},
 p5_rack:{g:'assets/rekwizyty/afaa91ebf95b0790e9ad78e95df78ade66550d17738cae5d8a68f3cbd40d26b7.glb',k:'assets/rekwizyty/e46dfbd65208f379174d3c41f0e8aff837f1cbcde864e96b183908f142ec4645.webp',n:'assets/rekwizyty/ff2ba270ebd6f46db5e916e9ec3ea3d21ad97fe018caaa838975499dbb9caf14.webp'},
 p5_scale:{g:'assets/rekwizyty/eaab15a50c9bc686ca939e21847a2b80c3a3ccb2ca828acfbfa56317554920e6.glb',k:'assets/rekwizyty/bbeb9971700bbd37617c3543bb8d78782ea86d7ff09c59978be1b1433599a6ce.webp',n:'assets/rekwizyty/50c5014010b3baaa6d95ae68fec3111ce65a22bc802e67bd8e55e0db4417aece.webp'},
 p5_throne:{g:'assets/rekwizyty/c333edc23d27e9fe2da522945b546dfa1d46fc6c59e70d59150ef25fe46c97b7.glb',k:'assets/rekwizyty/bcc342a51df7930cb8f8a586176c07fa40176ac91fcab0b72d1ba250a300be44.webp',n:'assets/rekwizyty/a18e1c4c1ccba98d574c81ad90ec811ceca42361e0eb6ae6b7952d7fd6d742af.webp'},
 p5_vault:{g:'assets/rekwizyty/039e41c66fe0d5630a20ef71f2b3b4ad181324cb97e646720b8ef7b839547130.glb',k:'assets/rekwizyty/447e9dd02ca688100238ed7532183c7d1c88a7df20a41908f7f6f93f244d59e7.webp',n:'assets/rekwizyty/f4b602a5bc153d01d99feef785ec0b39a7c7d99dc6efc6e4762a57bcb15dde25.webp'}};
// rozdzial -> klucz rekwizytu -> model z Meshy (nazwa = obrazek, z ktorego powstal)
// las Czarnoboru: 5 drzew 3D wymieszanych po miejscu (galeria Meshy, CC0, autor Tansy)
// drzewa 3D zrobione z naszych malunków (Meshy obraz → 3D); nazwa modelu = klucz malunku
const P3D_LAS=['p4_dead_oak','p4_spruce','p4_birch','p4_dead_spruce','p4_tall_pine','p1_dead_tree','p3_dead_tree','p4_sacred_oak','p4_hanging_tree'];
const P3D_TON={p4_sacred_oak:[.62,.62,.6]};// święty dąb stoi w zielonym blasku: bez przygaszenia prześwietla się
// rozdz. I: drzewa mają warianty (patrz dressSettlementsHD); głaz i paprocie zostają malunkiem
const P3D_DRZ1=p=>{const h=groundHash(Math.floor(p.x),Math.floor(p.y)),tk=p.variant||['dead_oak','dead_spruce','dead_oak'][h%3];return tk==='dead_oak'?(h%2?'p1_dead_tree':'p4_dead_oak'):({dead_spruce:'p4_dead_spruce',spruce:'p4_spruce',birch:'p4_birch'}[tk]||null)};
// 22.11.2026 (przeglad grafiki): do czasu przerobki z malunku wracaja obrazki 2D: zwloki (I, port), sztandar klanu i przewrocona kolumna (II),
// ciala zebrakow i latarnia (IV/CH3), klatka (VI/CH5). Modele zostaja w P3D_MESHY; powrot = dopisanie klucza tutaj.
const P3D_MMAP={1:{dead_tree:P3D_DRZ1,barrel:'p1_barrel',grave_cross:'p1_grave_cross',burnt_hay:'p1_burnt_hay',wheel:'p1_wheel',order_banner:'p1_order_banner',tombstone:'p1_tombstone',gallows:'p1_gallows',marga_cart:'p1_marga_cart',shop_sign:'p1_shop_sign',dead_horse:'p1_dead_horse',crow_post:'p1_crow_post',well:'p1_well',stocks:'p1_stocks'},
 2:{rune_lantern:'p2_rune_lantern',pickaxe_rack:'p2_pickaxe_rack',anvil:'p2_anvil',king_statue:'p2_king_statue',black_powder:'p2_black_powder',sarcophagus:'p2_sarcophagus',chains:'p2_chains',mine_cart:'p2_mine_cart',bellows:'p2_bellows'},
 3:{dead_tree:'p3_dead_tree',royal_banner:'p3_royal_banner',saint_king:'p3_saint_king',barrel:'p3_barrel',plague_cart:'p3_plague_cart',gibbet:'p3_gibbet',chains:'p3_chains',sarcophagus:'p3_sarcophagus',queen_fountain:'p3_queen_fountain',gallows:'p3_gallows',wheel:'p3_wheel',dead_horse:'p3_dead_horse',offering_bowl:'p3_offering_bowl'},
 4:{birch:'p4_birch',dead_oak:'p4_dead_oak',spruce:'p4_spruce',tall_pine:'p4_tall_pine',dead_spruce:'p4_dead_spruce',sacred_oak:'p4_sacred_oak',hanging_tree:'p4_hanging_tree',cz_bones:'p4_cz_bones',wolf_skull_bush:'p4_wolf_skull_bush',barrel:'p1_barrel',burial_mound:'p4_burial_mound',mossy_boulder:'p4_mossy_boulder',drowned_cart:'p4_drowned_cart',cz_wagon:'p4_cz_wagon',cz_tent:'p4_cz_tent',cz_sacpole:'p4_cz_sacpole',cz_firewood:'p4_cz_firewood',cz_pelts:'p4_cz_pelts',cz_beehive:'p4_cz_beehive',axe_stump:'p4_axe_stump',cz_idol:'p4_cz_idol',cz_gallows:'p4_cz_gallows',cz_wheel:'p4_cz_wheel'},5:{candelabra:'p5_candelabra',statue_a:'p5_statue_a',statue_b:'p5_statue_b',armour:'p5_armour',bench_a:'p5_bench_b',bench_b:'p5_bench_b',bookcase_a:'p5_bookcase_a',bookcase_b:'p5_bookcase_b',vault:'p5_vault',lectern:'p5_lectern',desk:'p5_desk',scale:'p5_scale',rack:'p5_rack',throne:'p5_throne'},6:{well:'p1_well',marga_cart:'p1_marga_cart',crow_post:'p1_crow_post',wheel:'p1_wheel',gallows:'p1_gallows',stocks:'p1_stocks',burnt_hay:'p1_burnt_hay',dead_horse:'p1_dead_horse',shop_sign:'p1_shop_sign'}};
/* 23.11.2026 (880, decyzja autora: rodziny modeli, partia7 faza 1): neutralne modele (szara tekstura) + mnoznik koloru wariantu.
   b = model bazowy, t = kolor wariantu, img = obrazek rekwizytu (obrys i szerokosc), fl = plomien z kodu [wysokosc wzgledna, rozmiar wzgledny do szerokosci].
   Zrodla: ~/Desktop/NIGHTBRAND/meshy/partia7_rodziny (ZRODLA.txt). Porownanie: ?rodziny=0 (tylko lokalnie). */
/* 891 (autor 23.11): wystroj z rodzin (menhiry, lawy, taborety, beczulki, misy, ksiegi, czaszki, pale, zloto, kolumny dekoracyjne) zostaje.
   Podmiany wczesniejszych obiektow (ogniska Zakonu, stosy, kosze, ogniska Czarnoboru, zlamana kolumna z Meshy, kolumny Cytadeli, jezyny) cofniete:
   wracaja obiekty sprzed 880 (obrazki z 885 przywrocone). Podmiany do podgladu tylko lokalnie: ?rodziny=1 */
/* 893 (autor 24.11): CALY wystroj z bryl Blendera zdjety z gry (menhiry, pale, czaszki, lawy, taborety, beczulki, misy, ksiegi, zloto, kielichy, kajdany, klucze, krzeslo, wozki).
   Do zrobienia od nowa z malunkow. Podglad tylko lokalnie: ?rodziny=1. Kolizje koszy Zakonu (883) zostaja. */
const R7_ON=NB_LOKALNIE&&nbParam('rodziny')==='1',R7_ZAM=R7_ON;
if(R7_ON){Object.assign(P3D_MESHY,{r7_kolumna_01_prosta:{g:'assets/rekwizyty/259120a0186f92f80ee3076fdf91c9bcc2988e910b1f1fa88ae7083bc9126ba6.glb',k:'assets/rekwizyty/5f08410c6291654e13782a5a4d8dd00ca281492a92ff728e732c75d3c025b114.webp'}, r7_kolumna_02_zlamana:{g:'assets/rekwizyty/6ec6c5119cfc0d4bcb2f0846899061d47706acc0b323579cc7816af235588dec.glb',k:'assets/rekwizyty/ff7141ae229e7d886fa8436a721cac8056a3a112e3dc79180eb8b912786c3960.webp'}, r7_kolumna_03_filar:{g:'assets/rekwizyty/4e10f5bbe4e5dfd50a45c4af52567b86297dc4f9089c2859e0eeed6301b9f2fe.glb',k:'assets/rekwizyty/f58c8a3ef618c36769bb2d2181b89cf34e570954450b0fa9c96c7b6f0b73d11c.webp'}, r7_ognisko_03_stos:{g:'assets/rekwizyty/56b5e27a011c327988c1854a8677ab3c58239f0cdae39171b134a955196b5cc0.glb',k:'assets/rekwizyty/d201657e5d8eaab76e1fe9df748554718e32b5d941e3bf39ee20c6796e31df0d.webp'}, r7_ognisko_01_kamienne:{g:'assets/rekwizyty/dbc613f8765c4d0cae492cfe484544b9fc568899aea3ac4bd53b93ee7424d678.glb',k:'assets/rekwizyty/ef044c941dd04e965c90ffc10bc04d2042a5142bcd04a981a8860cd02d60e822.webp'},
  r7_ognisko_02_kosz:{g:'assets/rekwizyty/b81b0efa2caa681cbc6419f8f9d46ffde734aa22cfe5de6d1153090c621b1c0e.glb',k:'assets/rekwizyty/6ef25f9d872bfa6ca0cbb3ba4edcd0b201cf895f6fbb3d6ddc73125bc05fc179.webp'},r7_kosz5:{b:'r7_ognisko_02_kosz',t:[.42,.4,.38],fl:[.9,1.0]},r7_kosz5z:{b:'r7_ognisko_02_kosz',t:[.42,.4,.38],fl:[.9,1.0],ab:[.3,0,.7,1]},
  r7_kol_lez2:{b:'r7_kolumna_02_zlamana',t:[.5,.48,.46],img:'p2_fallen_pillar'},r7_kol_a:{b:'r7_kolumna_01_prosta',t:[.7,.68,.64]},r7_kol_b:{b:'r7_kolumna_03_filar',t:[.68,.65,.61]},
  r7_stos1:{b:'r7_ognisko_03_stos',t:[.72,.62,.52],img:'p1_order_bonfire',fl:[.8,.62]},r7_stos3:{b:'r7_ognisko_03_stos',t:[.7,.62,.54],img:'p3_pyre_0',fl:[.8,.62]},
  r7_ognisko4:{b:'r7_ognisko_01_kamienne',t:[.3,.29,.27],fl:[.12,.55]}});
 if(R7_ZAM){Object.assign(P3D_MMAP[1],{order_bonfire:'r7_stos1'});Object.assign(P3D_MMAP[2],{fallen_pillar:'r7_kol_lez2'});Object.assign(P3D_MMAP[3],{pyre:'r7_stos3'});
 Object.assign(P3D_MMAP[4],{cz_fire:'r7_ognisko4'});Object.assign(P3D_MMAP[5],{order_bonfire:'r7_kosz5z'})}}
/* 23.11.2026 (882, faza 2 rodzin modeli): jezyny w Czarnoborze (rekwizyt brambles) i wystroj przy istniejacych meblach (r7Decor):
   Cytadela: krzeslo, ksiegi, kalamarz, zwoj przy biurku i pulpicie; zloto, sakiewka, kielich przy wadze i skarbcach; kajdany i klucze przy klatce i lancuchach.
   Czarnobor: pale z czaszkami i czaszki przy bozku (pnie wycofane: odstawaly stylem). Wystroj bez kolizji, tylko na wolnych polach. ?rodziny=0 = bez. */
if(R7_ON){Object.assign(P3D_MESHY,{r8_natura_03_jezyny:{g:'assets/rekwizyty/c9134717c30c81d42960e2e25434239421f57bd9ce6c6094d116dcb907342080.glb',k:'assets/rekwizyty/3d7b5e4c7b17660fb67663cdd7b6b1d3251be4ecb46854cbd94e8f35dc2d29ae.webp'}, r8_meble_01_krzeslo:{g:'assets/rekwizyty/58d1fae741bcd6f852907e91d862ff5de18d4245d693e500806706d29fdb756b.glb',k:'assets/rekwizyty/4f3ee001596f7962ae6ecdeb7a6f9d0e54ca4b82482e5bbe65413bd5ef7f8e4e.webp'}, r8_ksiegi_02_stos:{g:'assets/rekwizyty/35546ef4a255e725905d546d13b463d7f0cce0e8076ebbca4fac4ac200715592.glb',k:'assets/rekwizyty/c09e9b7eaae144ba68ea9eab2363f0c22c35b5c7684983ebaadbb97a4d9fabfa.webp'}, r8_ksiegi_04_kalamarz:{g:'assets/rekwizyty/84ff64a382327ac1257c69b225e7534e6448b80690bec2b177e3e48fdb22626b.glb',k:'assets/rekwizyty/1bb78786a5210ac2d7e296a7bd5f6dccfe44a7be974c31dce480dacd861839b6.webp'}, r8_ksiegi_03_zwoj:{g:'assets/rekwizyty/65e97dff691ad0076bd30185aca2d983f0c56e2b997ee7e3d7ab668688d48899.glb',k:'assets/rekwizyty/f0ec8b5059fbd60caaf057d6d75b5ac420bdcdf722512a69cba095ee231f0045.webp'}, r8_skarby_02_zloto:{g:'assets/rekwizyty/ee9cc9b615edae4009aa6975ef21c5a42e350ba354782812df798424cacbe78a.glb',k:'assets/rekwizyty/d9a20fed8f53eb396e01c84c349e1a41a508213693342ca6d7759c0cd29db02a.webp'}, r8_skarby_01_sakiewka:{g:'assets/rekwizyty/de27754de7b17322d181393fecaea603c300005e662c4568a94f5747222bc1c5.glb',k:'assets/rekwizyty/61d0ea4aee1efa1366e69c08cb2739cb0665b3b33cd8867007a845ea4406c783.webp'}, r8_naczynia_01_kielich:{g:'assets/rekwizyty/97b4bf9ef71092a28e96683b4e3fbadd32b46eae66843e686e85428888e86b72.glb',k:'assets/rekwizyty/2cfa3ac91508d169d2d22196739969e0e2e118288ff1c266bc5d4e1b307917a2.webp'}, r8_makabra_01_kajdany:{g:'assets/rekwizyty/fa52542904621ff0e9080d77f527adc6ff3b67daf6af683d69102751b978f173.glb',k:'assets/rekwizyty/e3c64c9cff637acd951a76a677d981da72c10b4f98c0e8cb0a4bacf4fadedc91.webp'}, r8_skarby_03_klucze:{g:'assets/rekwizyty/2f2214696b023dd72ee9e10b9558d34b18cad6bc3bc07d3132c1ff6834d1be09.glb',k:'assets/rekwizyty/a6f939fc44b25a915c725f879e2f068bcf726fa2113af1ecff72efe2fe439304.webp'}, r8_makabra_03_pal:{g:'assets/rekwizyty/d7172291c7abd41ea22266c7cd34fd964a478860035d319527f1a35c3a219ccd.glb',k:'assets/rekwizyty/eb66ce56e0e97281cf58f71f5f5f23a48c820b2f8e294352d3e626af978ec56a.webp'}, r8_makabra_02_czaszka:{g:'assets/rekwizyty/bd57c455f8057055320765b896b94867de940873818b94db91c26f0f7084ee8f.glb',k:'assets/rekwizyty/89dfda1eccf252d58da9abfb5f7eaee7046328c63329e3df8a5811f52b0e9eb6.webp'}, r8_jez4:{b:'r8_natura_03_jezyny',t:[.5,.52,.45],img:'p4_brambles'},r8_krzeslo:{b:'r8_meble_01_krzeslo',t:[.42,.36,.3]},r8_ksiegi:{b:'r8_ksiegi_02_stos',t:[.48,.38,.3]},
  r8_kalamarz:{b:'r8_ksiegi_04_kalamarz',t:[.38,.38,.4]},r8_zwoj:{b:'r8_ksiegi_03_zwoj',t:[.56,.5,.4]},r8_zloto:{b:'r8_skarby_02_zloto',t:[.62,.48,.24]},
  r8_sakiewka:{b:'r8_skarby_01_sakiewka',t:[.46,.34,.24]},r8_kielich:{b:'r8_naczynia_01_kielich',t:[.66,.52,.28]},r8_kajdany:{b:'r8_makabra_01_kajdany',t:[.36,.35,.34]},
  r8_klucze:{b:'r8_skarby_03_klucze',t:[.42,.4,.36]},r8_pal:{b:'r8_makabra_03_pal',t:[.58,.53,.48]},r8_czaszka:{b:'r8_makabra_02_czaszka',t:[.78,.73,.63]}});
 if(R7_ZAM)Object.assign(P3D_MMAP[4],{brambles:'r8_jez4'})}
/* 23.11.2026 (884, propozycja koncepciarza nr 1, zgoda autora): Osada zyje przy chatach - lawy, taborety, beczulki przy domu Heriego, chacie Chojraka, sklepie Margi i stosie Zakonu (poza droga; lawa z kolizja) */
if(R7_ON){Object.assign(P3D_MESHY,{r9_meble_04_lawa:{g:'assets/rekwizyty/81cc91208de3dc583d0894137b34ee14cd51ca756bede17523751e9c324f4f16.glb',k:'assets/rekwizyty/44f8c84713249cc29ccd655a6e359d20e07871f104b5c6c1ef948d252ae9f48f.webp'}, r9_meble_02_taboret:{g:'assets/rekwizyty/aff98a3a77751e7ccf905a941e9a58c3641233061faee2791258d9054e35af09.glb',k:'assets/rekwizyty/a93bb1e9d38303e8a35d4a021d4bde5e992c4f963a3dad8e50d8b5ba2062d5b4.webp'}, r9_naczynia_03_beczulka:{g:'assets/rekwizyty/534600b0e8c279540f8f745ae99ed78822a7dbdd5b2ad654737871672c2119ac.glb',k:'assets/rekwizyty/07b313f7ae3cadbac9d32fa0783eab245111e76b0400538cc8ee8d5146fb51ad.webp'},
  r9_meble_03_wozek:{g:'assets/rekwizyty/3f693bf26c69be10ab315fffddae1d2e2d7b9b2ec69cb90c0637ad40c6d93592.glb',k:'assets/rekwizyty/131edfc2fb1e430104ffe03f9be2c73e5a2d78b3a7c0b833e019223004a5e979.webp'}, r9_naczynia_02_misa:{g:'assets/rekwizyty/28b9fdb8134acc9d78881e5f50e77858ab640db9ec6b877d725f7820f888c0bc.glb',k:'assets/rekwizyty/0badbdaf7c75c0286620eee6b7bddea72fd66826d4fad9c66f938adcf3219b6e.webp'}, r9_natura_01_menhir:{g:'assets/rekwizyty/b3ec72a82b56a9bdfa613355075558ab87bf62d1d0b86403ff02f625e731ed03.glb',k:'assets/rekwizyty/0f031820532a45eb2a2b3244d859e6a2966b7a11c8462e8831d3606cbeebacf2.webp'}, r9_natura_02_pien:{g:'assets/rekwizyty/7c79014921fb0f65c9f1371b1e7ca2e7496bc2d6e7c5bb7dd3e9c0a8d2768aa2.glb',k:'assets/rekwizyty/7d87cb0226c9a385ef175378229d051098eac423fc288887acb83c684e0d3000.webp'}, r9_ksiegi_01_zamknieta:{g:'assets/rekwizyty/b511dd8095f4477d745a530c36af5fc914c0d25396e11081c9ff3c7dbcf7034d.glb',k:'assets/rekwizyty/b2857630450ae23a1df67cfba709a4992c93bc62b61682e943651e2617da474f.webp'},
  r9_wozek:{b:'r9_meble_03_wozek',t:[.48,.42,.36]},r9_misa:{b:'r9_naczynia_02_misa',t:[.42,.41,.4]},r9_menhir:{b:'r9_natura_01_menhir',t:[.5,.49,.46]},
  r9_pien:{b:'r9_natura_02_pien',t:[.46,.42,.37]},r9_ksiega:{b:'r9_ksiegi_01_zamknieta',t:[.45,.33,.25]},
  r9_lawa:{b:'r9_meble_04_lawa',t:[.5,.44,.38]},r9_taboret:{b:'r9_meble_02_taboret',t:[.5,.44,.38]},r9_beczulka:{b:'r9_naczynia_03_beczulka',t:[.55,.48,.4]}})}
/* 24.11.2026 (897, autor: "wdrazaj wszystko"): partia 8 - 66 modeli z malunkow (bryly TripoSG lokalnie u autora, tekstura wypalona z malunku jak w porcie,
   docs/modele/triposg_bake.py). Tekstury w 17 atlasach 2x2 (po 4 modele). Zrodla: ~/Desktop/NIGHTBRAND/meshy/partia8_z_malunkow (ZRODLA.txt, RAPORT.txt).
   Wystroj w miejscach dawnego wystroju z Blendera (r7Decor), ogniska z plomieniem z kodu, reszta rozstawiona tematycznie przy rekwizytach (p8Decor). Porownanie: ?p8=0 (tylko lokalnie). */
const P8_ON=!(NB_LOKALNIE&&nbParam('p8')==='0');
if(P8_ON){Object.assign(P3D_MESHY,{p8_menhir_runy:{g:'assets/rekwizyty/2ca867427111bc86033a027921fbadefe75e2e04b4884aefdf230eb428c9f489.glb',k:'assets/rekwizyty/6a6e72666a77039b592b5d76ae7916923843b71042c3723c20705edc48271082.webp'},p8_czaszki:{g:'assets/rekwizyty/b69767721ad78f3d8c19f584fe82151938bfa51e976fb87e38e61deab945cdfc.glb',k:'assets/rekwizyty/6a6e72666a77039b592b5d76ae7916923843b71042c3723c20705edc48271082.webp'},p8_pal_czaszki:{g:'assets/rekwizyty/9a352a535f00e6e63e3517015a17c2dc2ea7f45e73951bb0cc94658aaa9070de.glb',k:'assets/rekwizyty/6a6e72666a77039b592b5d76ae7916923843b71042c3723c20705edc48271082.webp'},p8_lawa:{g:'assets/rekwizyty/45ef91323c02e13a3f61830811f1d342615fd4988b9acb9c61760c24616ae272.glb',k:'assets/rekwizyty/6a6e72666a77039b592b5d76ae7916923843b71042c3723c20705edc48271082.webp'},p8_taboret:{g:'assets/rekwizyty/c8ea4af2f7d14888d5c904b24c5b96b924fb021d0aa022b2da33ce85022372b9.glb',k:'assets/rekwizyty/0a2dea0358f680978839f722f939ce2dffe792b3a6869e5b9533b6e76ca4fe61.webp'},p8_ksiegi:{g:'assets/rekwizyty/a81ee6d2871d4603d208286580b408141225fdf1a8bfdf8f859d612617677677.glb',k:'assets/rekwizyty/0a2dea0358f680978839f722f939ce2dffe792b3a6869e5b9533b6e76ca4fe61.webp'},p8_kalamarz:{g:'assets/rekwizyty/220e36e5020b6ff83930775c4e4659e0136dddc8439571d5db34a4148274a919.glb',k:'assets/rekwizyty/0a2dea0358f680978839f722f939ce2dffe792b3a6869e5b9533b6e76ca4fe61.webp'},p8_kufer_zloto:{g:'assets/rekwizyty/1f54c43ad1e24683ec401614695276d857e380477b8b5f6e1a60d202cfa8bf45.glb',k:'assets/rekwizyty/0a2dea0358f680978839f722f939ce2dffe792b3a6869e5b9533b6e76ca4fe61.webp'},p8_kielich:{g:'assets/rekwizyty/dd1a85d142349fdbf6174ec08e9e06aaedb372f16e2c7dddf6a51374406dfbc5.glb',k:'assets/rekwizyty/cdd3c577b7c252a8937edb66420af588dd352df8155958184d4be41804072725.webp'},p8_kajdany:{g:'assets/rekwizyty/eeab05d656db6d11c0ff206971e812f1db9d1da334c218344d6499164134ceef.glb',k:'assets/rekwizyty/cdd3c577b7c252a8937edb66420af588dd352df8155958184d4be41804072725.webp'},p8_krzeslo:{g:'assets/rekwizyty/4bd18b25342429e9a750ed402bf6f508bff0d2dc298b436a13c7d7bab0ae55ce.glb',k:'assets/rekwizyty/cdd3c577b7c252a8937edb66420af588dd352df8155958184d4be41804072725.webp'},p8_worek_beczka:{g:'assets/rekwizyty/410acbe92cc5569ab9f68811e832336c63afb4d3bc1277c5ca3c77b35bfe3016.glb',k:'assets/rekwizyty/cdd3c577b7c252a8937edb66420af588dd352df8155958184d4be41804072725.webp'},p8_kapliczka_swiece:{g:'assets/rekwizyty/acac6ca8e3a47b16e525688c3f53b73543444990402eb8671130834cc081330f.glb',k:'assets/rekwizyty/d42df143e0fd512b8f6f2cb062b39df1160f50f7c80d56aea209b7b2c673055c.webp'},p8_ognisko_krag:{g:'assets/rekwizyty/2e3b0e3e4842258fbf6b51dff73383d68eaad939047d4d9679e2b59553b2a894.glb',k:'assets/rekwizyty/d42df143e0fd512b8f6f2cb062b39df1160f50f7c80d56aea209b7b2c673055c.webp'},p8_stos:{g:'assets/rekwizyty/d898a48a8cad74c4c61475b69443751d40cb3e673c94e1d7ee7d998d72fffd17.glb',k:'assets/rekwizyty/d42df143e0fd512b8f6f2cb062b39df1160f50f7c80d56aea209b7b2c673055c.webp'},p8_kosz:{g:'assets/rekwizyty/3dc719945e6fbf5bbf106b926b76679f25780e0ab167b56063a694cf7dbadf94.glb',k:'assets/rekwizyty/d42df143e0fd512b8f6f2cb062b39df1160f50f7c80d56aea209b7b2c673055c.webp'},p8_ognisko_gruz:{g:'assets/rekwizyty/039965df1a95e180395ec784d3d70f52f497d3006e62c4b30e67b3e84075c712.glb',k:'assets/rekwizyty/56fef47bb56da681eb4c18ccd6a3f41bbcea665ab0b93fd4adfef4778a821733.webp'},p8_ruina_chaty:{g:'assets/rekwizyty/6754d7abaaa4634eea5f907262acafdf41ca08d8f91ef432f5cb56b5608d26ff.glb',k:'assets/rekwizyty/56fef47bb56da681eb4c18ccd6a3f41bbcea665ab0b93fd4adfef4778a821733.webp'},p8_zejscie_krypty:{g:'assets/rekwizyty/5b718b76d77de1bb3885f1a656b5669681f82797eaaec4773679754ddb291d45.glb',k:'assets/rekwizyty/56fef47bb56da681eb4c18ccd6a3f41bbcea665ab0b93fd4adfef4778a821733.webp'},p8_kapliczka_przydrozna:{g:'assets/rekwizyty/0eded2d19ba8acdfbef5bff8b57e9a20acb6c2db14c141a22392081e3673b4af.glb',k:'assets/rekwizyty/56fef47bb56da681eb4c18ccd6a3f41bbcea665ab0b93fd4adfef4778a821733.webp'},p8_beczka_smoly:{g:'assets/rekwizyty/6453a0b6934681574e64ebb5f4520cfe7f144c8dacae69dbd7edb18c6d4f9759.glb',k:'assets/rekwizyty/b22ddff28fff1bba72969e080141c210b7e50f6b74d307013c4cca594f55c3fe.webp'},p8_kufer:{g:'assets/rekwizyty/75cf798d6960d76cae5562125d5be110426f6aa43f755533cfddfdff3edb8e9b.glb',k:'assets/rekwizyty/b22ddff28fff1bba72969e080141c210b7e50f6b74d307013c4cca594f55c3fe.webp'},p8_loze_tortur:{g:'assets/rekwizyty/fbe8a18adfbfcb1790365d2748d59563d1ed47b40f2ef28dcf2ea62c8e0216a3.glb',k:'assets/rekwizyty/b22ddff28fff1bba72969e080141c210b7e50f6b74d307013c4cca594f55c3fe.webp'},p8_relikwiarz:{g:'assets/rekwizyty/0696d8b21e2117fe3f9188db7165198af29c62445bc821a237fc753ba7852f2e.glb',k:'assets/rekwizyty/b22ddff28fff1bba72969e080141c210b7e50f6b74d307013c4cca594f55c3fe.webp'},p8_stol_ksiegi:{g:'assets/rekwizyty/9ce034659e90da8db895ea651b5606515d99cfc74d067985bf39aff3c34c21ca.glb',k:'assets/rekwizyty/f81f341ce1b6afca9d0a22cc1794ca9977ae2e153c16abedf843ac970a43b9c9.webp'},p8_slup_klodka:{g:'assets/rekwizyty/82c4c2e3675902092d32bfe9243fb5088153fdf68071ea95b80b189d0f71b52b.glb',k:'assets/rekwizyty/f81f341ce1b6afca9d0a22cc1794ca9977ae2e153c16abedf843ac970a43b9c9.webp'},p8_kapliczka_krysztal:{g:'assets/rekwizyty/bf3207a265bf2dc56e469d0eb4fb3de3a304b511ef38e27321e5cae5c81dcd5b.glb',k:'assets/rekwizyty/f81f341ce1b6afca9d0a22cc1794ca9977ae2e153c16abedf843ac970a43b9c9.webp'},p8_piec_kuzni:{g:'assets/rekwizyty/d4ed6bfdf05425292e34b9121f9fb8d71aafc4874643601a3810db568d082b22.glb',k:'assets/rekwizyty/f81f341ce1b6afca9d0a22cc1794ca9977ae2e153c16abedf843ac970a43b9c9.webp'},p8_brama_krasnoludzka:{g:'assets/rekwizyty/95ab56927430efd5009e1a2e7903c278d6df003ed372b4e809bf89d05c9b2446.glb',k:'assets/rekwizyty/8710017a88fd39aaed90f85c28b09f22e40acec68692b812da58510f89ce5539.webp'},p8_beczki_lina:{g:'assets/rekwizyty/66cc02fb20ea8221ee82cb7ab61062368933dc2d79c59cca90e343cbba286236.glb',k:'assets/rekwizyty/8710017a88fd39aaed90f85c28b09f22e40acec68692b812da58510f89ce5539.webp'},p8_rama_kajdany:{g:'assets/rekwizyty/cf94b7cc0ba1904c6d877f34371cf86602f3fc865f51d3e723b8e33d2b1930dc.glb',k:'assets/rekwizyty/8710017a88fd39aaed90f85c28b09f22e40acec68692b812da58510f89ce5539.webp'},p8_latarnia_slup:{g:'assets/rekwizyty/3e5a67ce89b9364e88015c52c6fb6b791663c226b0141c82521ae5a3453e524b.glb',k:'assets/rekwizyty/8710017a88fd39aaed90f85c28b09f22e40acec68692b812da58510f89ce5539.webp'},p8_ofiara_chleb:{g:'assets/rekwizyty/d73912e8cc28f51c8880d0dce6a9e961cf857102d5b5e025c2a047174cd874d8.glb',k:'assets/rekwizyty/c5c980f70e08e6aae18fd1e609ef6c61088fae1976680c7a182698d50262ddad.webp'},p8_ambona:{g:'assets/rekwizyty/4ff92ad3d35c10cd1484d8f0695a96d5db93d9bdf1a533e71050b0862d93feee.glb',k:'assets/rekwizyty/c5c980f70e08e6aae18fd1e609ef6c61088fae1976680c7a182698d50262ddad.webp'},p8_skora_kosci:{g:'assets/rekwizyty/ef2142cc24091575df457743bea9d20ae54e831f1029bef0da9913a2a96481e7.glb',k:'assets/rekwizyty/c5c980f70e08e6aae18fd1e609ef6c61088fae1976680c7a182698d50262ddad.webp'},p8_dziupla_grzyby:{g:'assets/rekwizyty/bd8c7bed985796b98ac718410033aa99751a8f12aaa8cfbb495326dfcc108ff0.glb',k:'assets/rekwizyty/c5c980f70e08e6aae18fd1e609ef6c61088fae1976680c7a182698d50262ddad.webp'},p8_lodz_zatopiona:{g:'assets/rekwizyty/f605487c739a9cde5f4bd5fd3799f622a9422fd9f53833dcaed8571923ffff43.glb',k:'assets/rekwizyty/cf41f69ceea4da80e8218ab560aa7f5f96c745422576ad01c6035f62b4a8b309.webp'},p8_plot_czaszki:{g:'assets/rekwizyty/f6f36466d57b345c602f4432912e71204660ef033fcb1c5552a40987814b5ab0.glb',k:'assets/rekwizyty/cf41f69ceea4da80e8218ab560aa7f5f96c745422576ad01c6035f62b4a8b309.webp'},p8_plot_zlamany:{g:'assets/rekwizyty/7329e9fcae4c14821d3c07ab32da04f852b747bce0444c49345668e14cfa5649.glb',k:'assets/rekwizyty/cf41f69ceea4da80e8218ab560aa7f5f96c745422576ad01c6035f62b4a8b309.webp'},p8_wiadro_lina:{g:'assets/rekwizyty/374cb817c640aee9ab3f3edf8a0c8b5fbd48130d1281cc2cf1c150a351f9fd6f.glb',k:'assets/rekwizyty/cf41f69ceea4da80e8218ab560aa7f5f96c745422576ad01c6035f62b4a8b309.webp'},p8_kosz_dzbany:{g:'assets/rekwizyty/d4acd2aff3c1316f2226b8d1277c079dabee3de32dcd9709b8c656d53965f220.glb',k:'assets/rekwizyty/43ca69fd1333f173386edd990b9a9b9161e8a48e5cafac1862e5b44276417cc7.webp'},p8_strach_na_wroble:{g:'assets/rekwizyty/0b23cf1dc6990871daaa28961ec5bd5bd1edd264040a2afe64c54dfb0ba8786d.glb',k:'assets/rekwizyty/43ca69fd1333f173386edd990b9a9b9161e8a48e5cafac1862e5b44276417cc7.webp'},p8_drewutnia:{g:'assets/rekwizyty/e86b330c7a5c9c0e7df3ec4702506d98e857f29f90ede94fc63a5d329b715bf2.glb',k:'assets/rekwizyty/43ca69fd1333f173386edd990b9a9b9161e8a48e5cafac1862e5b44276417cc7.webp'},p8_buda:{g:'assets/rekwizyty/4325e1df4a2c259adc94a709eea8fddb2fddd78b2aba06af7005b01d22bab63e.glb',k:'assets/rekwizyty/43ca69fd1333f173386edd990b9a9b9161e8a48e5cafac1862e5b44276417cc7.webp'},p8_worki_zboze:{g:'assets/rekwizyty/33a251be16f170ad316501b3e7098a3e6bc449ce4356ec5a77d262f443f5ed95.glb',k:'assets/rekwizyty/3e668fa877fdb1dba14c264bff1a90c615ff02bcf2e7b44c7777f243fe7c061c.webp'},p8_kruk_czaszka:{g:'assets/rekwizyty/7b24e5b87e9f06a030cce5a5de7a7a2cb10cab5cb13b9f5254a6902d0179fec5.glb',k:'assets/rekwizyty/3e668fa877fdb1dba14c264bff1a90c615ff02bcf2e7b44c7777f243fe7c061c.webp'},p8_pomost:{g:'assets/rekwizyty/1e7ab23812f74603380d3d49372b95df5f4f411929ef85e52b96ab1b8aad4934.glb',k:'assets/rekwizyty/3e668fa877fdb1dba14c264bff1a90c615ff02bcf2e7b44c7777f243fe7c061c.webp'},p8_kaplica_fasada:{g:'assets/rekwizyty/b18de0784fb3732fd0f4fa5e5f96ef8764764ad283a699f1864a9bccffb30749.glb',k:'assets/rekwizyty/3e668fa877fdb1dba14c264bff1a90c615ff02bcf2e7b44c7777f243fe7c061c.webp'},p8_drzwi_krypty:{g:'assets/rekwizyty/2362d4d88b73e3a4bbbd272b4092e49898c747579ade99e243afa101fd551c98.glb',k:'assets/rekwizyty/836ba191f898a47f74f59be6c8f07f1ebef78830e583f917de6fda73fcd1ef3f.webp'},p8_schody_kosci:{g:'assets/rekwizyty/583e864314e2761aeba472fa2a02daefe9dfd25cc13c7a48460804e28956a6c1.glb',k:'assets/rekwizyty/836ba191f898a47f74f59be6c8f07f1ebef78830e583f917de6fda73fcd1ef3f.webp'},p8_kwiat_zloty:{g:'assets/rekwizyty/c0f0ca07e0c11210660b54c2f095f93f014a8a1d50da123752d7fa4803d5603b.glb',k:'assets/rekwizyty/836ba191f898a47f74f59be6c8f07f1ebef78830e583f917de6fda73fcd1ef3f.webp'},p8_brama_krolewska:{g:'assets/rekwizyty/d1e02ebd5d9d25c02340e9175e9b3d487ff4e06da31b68eac27a2e1992200fdc.glb',k:'assets/rekwizyty/836ba191f898a47f74f59be6c8f07f1ebef78830e583f917de6fda73fcd1ef3f.webp'},p8_posag_swietej:{g:'assets/rekwizyty/23280493bef5f3a0230f6c7c1d45272368d15a58335dc82bf63ea87a8d2dd861.glb',k:'assets/rekwizyty/274d6de296b0cc8ad4e3ea284322fdb437017073d3df86d656f6ff5d28705b8e.webp'},p8_kareta:{g:'assets/rekwizyty/d1b8f094ff2b66220d96b64814649143ae8707f44522edca0194cdae5e235342.glb',k:'assets/rekwizyty/274d6de296b0cc8ad4e3ea284322fdb437017073d3df86d656f6ff5d28705b8e.webp'},p8_oltarz_roze:{g:'assets/rekwizyty/76811c2e419fb0bfdf7c6206395f57638150209e6869ba48d6fdcbc3fe082630.glb',k:'assets/rekwizyty/274d6de296b0cc8ad4e3ea284322fdb437017073d3df86d656f6ff5d28705b8e.webp'},p8_dzwon:{g:'assets/rekwizyty/e17578f598b3be697bbb022b5232d75511ff79c0b4f74bcb886805ea707c5c6d.glb',k:'assets/rekwizyty/274d6de296b0cc8ad4e3ea284322fdb437017073d3df86d656f6ff5d28705b8e.webp'},p8_kamien_runiczny:{g:'assets/rekwizyty/85d16fb85ec8cffb37863bd7aefa539776e7636945a4b6d4a73a39cbf299f6b5.glb',k:'assets/rekwizyty/3eff91349624d9d2c279c9e26dbdb5d3f2a616d89f68b05202b9bde6bdb139a7.webp'},p8_kloda:{g:'assets/rekwizyty/1fb40cabe5caeddfe275fa3e9b77052eb84d870a9b71cb9f004df59dcbf975d0.glb',k:'assets/rekwizyty/3eff91349624d9d2c279c9e26dbdb5d3f2a616d89f68b05202b9bde6bdb139a7.webp'},p8_kapliczka_lesna:{g:'assets/rekwizyty/e98d085b470cd286e2c868e60be13de89bd09668a4b4c1d2dd7bd77cdf330f3b.glb',k:'assets/rekwizyty/3eff91349624d9d2c279c9e26dbdb5d3f2a616d89f68b05202b9bde6bdb139a7.webp'},p8_grzyby_niebieskie:{g:'assets/rekwizyty/db18bed18b1b188b3c59c752d38e00429cb5a5f0af04098083c5c6d10a74f82a.glb',k:'assets/rekwizyty/3eff91349624d9d2c279c9e26dbdb5d3f2a616d89f68b05202b9bde6bdb139a7.webp'},p8_grzyby_blade:{g:'assets/rekwizyty/fe03dbc5db491c2aac417f26d31f9db8913c2a2425472c13e0ae6e7b0349c056.glb',k:'assets/rekwizyty/680a6b66df0655b0cea6977388cf78f2a9c040b4c800745a8f0ab27f5acc6c30.webp'},p8_huby_na_klodzie:{g:'assets/rekwizyty/18715ef51838a1b40416b9c071b73ec64af39f0a7e07aaa8cd13b7344fb2431d.glb',k:'assets/rekwizyty/680a6b66df0655b0cea6977388cf78f2a9c040b4c800745a8f0ab27f5acc6c30.webp'},p8_muchomory:{g:'assets/rekwizyty/06a94b7652b69e76be9169875ab165deca0fa3655267b392338a7b794e555556.glb',k:'assets/rekwizyty/680a6b66df0655b0cea6977388cf78f2a9c040b4c800745a8f0ab27f5acc6c30.webp'},p8_grzyby_czarne:{g:'assets/rekwizyty/a77e861733275dddbe190ad8f6ad063a647a20338d703683843e06db338f6003.glb',k:'assets/rekwizyty/680a6b66df0655b0cea6977388cf78f2a9c040b4c800745a8f0ab27f5acc6c30.webp'},p8_grzyby_zolte:{g:'assets/rekwizyty/9bcd8851afb29fe0a87e14dc26c50cd20f65b8826ee27fd886cda9f01e132188.glb',k:'assets/rekwizyty/6c957f7238ab7f66a595a91f8ed2fb114c9ee960b5bfb065a652237c78ac804e.webp'},p8_korzenie:{g:'assets/rekwizyty/bbe4b47b636cfc33ff3daec8c325a134705f464003a6f3e4b4ef54ca2fc8b4fc.glb',k:'assets/rekwizyty/6c957f7238ab7f66a595a91f8ed2fb114c9ee960b5bfb065a652237c78ac804e.webp'},p8f1:{b:'p8_ognisko_gruz',t:[.95,.93,.9],img:'p1_order_bonfire',fl:[.26,.45]},p8f3:{b:'p8_stos',t:[.95,.93,.9],img:'p3_pyre_0',fl:[.73,.75]},p8f4:{b:'p8_ognisko_krag',t:[.95,.93,.9],fl:[.12,.55]},p8f5:{b:'p8_kosz',t:[.9,.88,.86],fl:[.98,.55],ab:[.3,0,.7,1]}});
 Object.assign(P3D_MMAP[1],{order_bonfire:'p8f1'});Object.assign(P3D_MMAP[3],{pyre:'p8f3'});Object.assign(P3D_MMAP[4],{cz_fire:'p8f4'});Object.assign(P3D_MMAP[5],{order_bonfire:'p8f5'})}
/* nazwy z dawnego wystroju z Blendera -> modele z malunkow [nazwa, mnoznik szerokosci]; null = pomin */
const P8_ZA={r8_krzeslo:['p8_krzeslo',1.25],r8_ksiegi:['p8_ksiegi',1],r8_kalamarz:['p8_kalamarz',1.2],r8_zwoj:null,r8_zloto:['p8_kufer_zloto',1.05],r8_sakiewka:['p8_kielich',1.7],r8_kielich:null,
 r8_kajdany:['p8_kajdany',1],r8_klucze:null,r8_pal:['p8_pal_czaszki',2.6],r8_czaszka:['p8_czaszki',3],r9_beczulka:['p8_worek_beczka',1.6],r9_taboret:['p8_taboret',.9],r9_lawa:['p8_lawa',1],
 r9_wozek:['p8_beczki_lina',.9],r9_misa:['p8_wiadro_lina',1.4],r9_menhir:['p8_menhir_runy',1.7],r9_pien:['p8_kloda',1],r9_ksiega:['p8_ksiegi',1.3]};
/* reszta partii 8 rozstawiona przy rekwizytach o tym samym klimacie: [rozdzial, rekwizyt, model, przesuniecie x, y, szerokosc, kolizja, ile najwyzej] */
const P8_C=[[1,'burnt_hay','p8_strach_na_wroble',1.6,.6,1,0,2],[1,'grave_cross','p8_kapliczka_przydrozna',-1.5,.4,.8,0,2],[1,'well','p8_wiadro_lina',1.3,.7,.7,0,2],[1,'marga_cart','p8_worki_zboze',-2,.6,1.2,0,1],
 [1,'tombstone','p8_plot_zlamany',1.8,.2,1.6,0,2],[1,'crow_post','p8_kruk_czaszka',1.2,.5,.8,0,2],[1,'dead_horse','p8_ruina_chaty',-3.2,-.6,3.2,1,1],[1,'stocks','p8_kosz_dzbany',1.5,.5,1,0,1],
 [1,'gallows','p8_buda',-2.6,-.2,2,1,1],[1,'wheel','p8_drewutnia',2.6,-.3,2.4,1,1],[1,'covered_corpses','p8_kapliczka_swiece',-1.8,.4,1.2,0,1],
 [2,'anvil','p8_piec_kuzni',-2.4,-.4,2,1,2],[2,'king_statue','p8_brama_krasnoludzka',0,-2.2,2.8,1,1],[2,'rune_lantern','p8_kamien_runiczny',1.6,.4,1,1,3],[2,'black_powder','p8_beczki_lina',1.7,.5,1.4,1,2],
 [2,'mine_cart','p8_beczka_smoly',-1.6,.6,.8,0,2],[2,'sarcophagus','p8_zejscie_krypty',2.4,-.4,2.2,1,1],[2,'chains','p8_slup_klodka',-1.4,.3,.8,1,2],[2,'pickaxe_rack','p8_schody_kosci',2.2,.2,2,1,1],
 [3,'royal_banner','p8_brama_krolewska',0,-2,3,1,1],[3,'saint_king','p8_posag_swietej',2.6,.3,1.4,1,2],[3,'plague_cart','p8_kareta',-3,.2,2.8,1,1],[3,'offering_bowl','p8_oltarz_roze',1.8,.3,1.6,1,2],
 [3,'queen_fountain','p8_dzwon',3.4,.4,1.6,1,1],[3,'queen_fountain','p8_kwiat_zloty',-3,.8,.8,0,2],[3,'sarcophagus','p8_relikwiarz',1.8,.2,1.2,1,2],[3,'gibbet','p8_kaplica_fasada',0,-2.4,3,1,1],
 [3,'gallows','p8_latarnia_slup',1.8,.3,.9,1,2],[3,'beggar_bodies','p8_drzwi_krypty',-2.4,-.6,1.8,1,1],
 [4,'sacred_oak','p8_kapliczka_lesna',2.2,.6,.9,1,2],[4,'cz_pelts','p8_skora_kosci',1.8,.6,1.4,0,2],[4,'cz_sacpole','p8_ofiara_chleb',1.4,.6,1.2,0,2],[4,'cz_tent','p8_plot_czaszki',2.4,.3,1.8,1,2],
 [4,'dead_oak','p8_dziupla_grzyby',1.8,.5,1.3,1,2],[4,'axe_stump','p8_kloda',1.8,.4,1.8,1,2],[4,'drowned_cart','p8_lodz_zatopiona',2.4,.4,2.2,1,1],[4,'standing_stone','p8_kapliczka_krysztal',-1.8,.4,1.1,1,2],
 [4,'burial_mound','p8_kapliczka_swiece',2,.6,1.2,0,2],[4,'tall_pine','p8_ambona',2.2,-.4,1.6,1,1],[4,'hanging_tree','p8_korzenie',1.6,.6,1.2,0,3],[4,'dead_spruce','p8_huby_na_klodzie',1.5,.6,1.2,0,3],
 [4,'spruce','p8_grzyby_niebieskie',1.2,.7,.7,0,4],[4,'birch','p8_grzyby_blade',1.1,.7,.6,0,4],[4,'mossy_boulder','p8_muchomory',1.3,.6,.6,0,4],[4,'wolf_skull_bush','p8_grzyby_czarne',1.2,.6,.6,0,3],
 [4,'cz_beehive','p8_grzyby_zolte',1.2,.6,.6,0,3],[4,'cz_wagon','p8_worek_beczka',-1.8,.5,1,0,2],[4,'cz_firewood','p8_pomost',2,.5,1.8,0,1],
 [5,'cage','p8_loze_tortur',2.2,.6,1.8,1,1],[5,'rack','p8_rama_kajdany',-2,.2,1.6,1,2],[5,'vault','p8_kufer',-2.2,.6,1.2,1,2],[5,'bookcase_a','p8_stol_ksiegi',0,1.6,1.6,1,2],[5,'throne','p8_relikwiarz',2.4,.4,1.2,1,2],
 [5,'statue_b','p8_drzwi_krypty',2.2,-.4,1.8,1,1],[5,'armour','p8_kosz_dzbany',1.5,.5,1,0,2],[5,'lectern','p8_ksiegi',-1.2,.6,.9,0,2]];
function p8Decor(w,near,put){const ile={};for(const [ch,k,n,ox,oy,W,blk,max] of P8_C){if(w.ch!==ch)continue;const id=k+'|'+n;near(k,p=>{if((ile[id]||0)>=max)return;const fl=p.x>MW/2;put(n,p.x+(fl?-ox:ox),p.y+oy,W,fl,blk);ile[id]=(ile[id]||0)+1})}}
function r7Decor(w){if(!w||!w.PROPS)return;/* 893: bez R7_ON put() nic nie stawia (brak modeli), zostaja tylko kolizje */const P=w.PROPS,it=[];
 const free=(x,y)=>{const t=w.map&&w.map[Math.floor(y)*MW+Math.floor(x)];return t!==undefined&&!SOLID.has(t)&&!(typeof VOID!=='undefined'&&VOID.has(t))&&!P.some(p=>Math.hypot(p.x-x,p.y-y)<.6)&&!it.some(q=>Math.hypot(q.x-x,q.z-y)<.5)};
 const put=(n,x,y,W,flip,blk)=>{if(!R7_ON&&P8_ON&&n[0]==='r'){const q=P8_ZA[n];if(!q)return;n=q[0];W*=q[1]}if(!P3D_MGEO[n]||!free(x,y))return;it.push({n,x,z:y,W,flip:!!flip});if(blk){const i=Math.floor(y-.3)*MW+Math.floor(x),rd=w.groundPlan&&w.groundPlan.road&&w.groundPlan.road[i];if(!rd&&!SOLID.has(w.map[i])){if(w.under)w.under[i]=w.map[i];w.map[i]=31}}},near=(k,fn)=>{for(const p of P)if(p.k===k)fn(p)};
 if(w.ch===5){/* 883: kosze ognisk Zakonu dostaja kolizje jak pozostale kosze (wczesniej mozna bylo przez nie przejsc) */for(const p of P)if(p.k==='order_bonfire'){const i=Math.floor(p.y)*MW+Math.floor(p.x),rd=w.groundPlan&&w.groundPlan.road&&w.groundPlan.road[i];if(!rd&&!SOLID.has(w.map[i])){if(w.under)w.under[i]=w.map[i];w.map[i]=31}}
  near('desk',p=>{put('r8_krzeslo',p.x-1.2,p.y+.2,.65,0,1);put('r8_ksiegi',p.x+1.3,p.y+.3,.8);put('r8_kalamarz',p.x+1.1,p.y+1,.36);put('r8_zwoj',p.x+1.8,p.y+1,.7)});
  near('lectern',p=>{put('r8_ksiegi',p.x+1.1,p.y+.3,.8,1);put('r8_zwoj',p.x-1.1,p.y+.4,.7,1)});
  near('scale',p=>{put('r8_zloto',p.x-1.4,p.y+.4,1);put('r8_sakiewka',p.x+1.2,p.y+.5,.5);put('r8_kielich',p.x+1.2,p.y+1.2,.26)});
  near('vault',p=>{put('r8_zloto',p.x+1.5,p.y+.6,.95,1);put('r8_sakiewka',p.x-1.4,p.y+.6,.5,1)});
  near('cage',p=>{put('r8_kajdany',p.x+1.3,p.y+.4,.9);put('r8_klucze',p.x-1.2,p.y+.5,.45)});near('chains',p=>{put('r8_kajdany',p.x,p.y+.9,.9,1)})}
 if(w.ch===1){for(const s of (w.shelters||[])){if(!s.door)continue;const dx=s.door[0]+.5,dy=s.door[1]+1;
   if(s.kind==='shop'){put('r9_beczulka',dx-5.6,dy+.4,.55);put('r9_beczulka',dx-5.1,dy+.9,.5,1);put('r9_taboret',dx+5.6,dy+.6,.6,1);put('r9_beczulka',dx+6.2,dy+.3,.55)}
   else{put('r9_lawa',dx+2.3,dy+.8,1.45,0,1);put('r9_taboret',dx-1.9,dy+.6,.6);put('r9_beczulka',dx-2.7,dy+.3,.55,1)}}
  near('order_bonfire',p=>{put('r9_lawa',p.x,p.y+2.3,1.45,0,1);put('r9_taboret',p.x-1.7,p.y+1,.6,1);put('r9_beczulka',p.x+1.8,p.y+.8,.55)})}
 /* 884 (propozycje koncepciarza 2-4): Dolne Miasto - wozki przy wozkach kopalnianych, misy przy piecach i kowadlach; Czarnobor - krag menhirow przy bozku, pnie przy kamieniach runicznych; Cytadela - ksiegi przy regalach */
 if(w.ch===2){let nw=0;near('mine_cart',p=>{if(nw<3){const n0=it.length;put('r9_wozek',p.x+2.3,p.y+.7,1.4,0,1);if(it.length>n0)nw++}});let nm=0;const misa=(x,y,W,f)=>{if(nm>=4)return;const n0=it.length;put('r9_misa',x,y,W,f);if(it.length>n0)nm++};near('furnace',p=>misa(p.x+1.7,p.y+.8,.55));near('anvil',p=>misa(p.x-1.4,p.y+.7,.5,1))}
 if(w.ch===4){near('cz_idol',p=>{for(const [ox,oy,f] of [[-3.4,-1.2,0],[3.5,-1,1],[-2.8,3.2,1],[3,3.3,0]])put('r9_menhir',p.x+ox,p.y+oy,.6,f,1)});near('standing_stone',p=>put('r9_pien',p.x+(p.x>70?-2.5:2.5),p.y+1.1,1.7,p.x>70,1))}
 if(w.ch===5){near('bookcase_a',p=>put('r9_ksiega',p.x+1.2,p.y+.5,.42));near('bookcase_b',p=>put('r9_ksiega',p.x-1.2,p.y+.5,.42,1))}
 if(w.ch===4){near('cz_idol',p=>{put('r8_pal',p.x-1.7,p.y+.3,.3,0,1);put('r8_pal',p.x+1.8,p.y+.4,.3,1,1);put('r8_czaszka',p.x-1,p.y+.9,.26);put('r8_czaszka',p.x+.9,p.y+1,.24,1)});}
 if(P8_ON&&!R7_ON)p8Decor(w,near,put);
 if(it.length)meshyEmit(w.group,it)}
// plomien z kodu (pionowa plaszczyzna zwrocona do kamery, szum przesuwany w gore, addytywnie); czas: NB_WIN_T
let NB_FLAME_M=null;
function flameMat(){if(NB_FLAME_M)return NB_FLAME_M;NB_FLAME_M=new THREE.ShaderMaterial({uniforms:{uT:NB_WIN_T},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,
  vertexShader:'varying vec2 vUv;varying float vPh;void main(){vUv=uv;vPh=fract(sin(dot(modelMatrix[3].xyz,vec3(12.99,78.23,37.71)))*43758.55);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader:'uniform float uT;varying vec2 vUv;varying float vPh;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}'+
  'void main(){vec2 p=vUv;float t=uT*1.7+vPh*10.;float q=n(vec2(p.x*4.,p.y*3.-t*2.3))*.6+n(vec2(p.x*9.,p.y*6.-t*3.6))*.4;float w=(1.-p.y)*.4+.05;float dx=abs(p.x-.5+(q-.5)*.22*p.y);'+
  'float s=smoothstep(w,w*.3,dx)*smoothstep(0.,.1,p.y)*(1.-smoothstep(.45,.95,p.y+(q-.5)*.4));float f=s*(.6+.65*q);vec3 c=mix(vec3(.85,.16,.02),vec3(1.,.52,.08),smoothstep(.2,.6,f));c=mix(c,vec3(1.,.88,.5),smoothstep(.7,1.05,f));gl_FragColor=vec4(c*f*1.5,f);}'});return NB_FLAME_M}
function addFlame(root,x,y,z,size){const m=new THREE.Mesh(new THREE.PlaneGeometry(size*.75,size),flameMat());m.position.set(x,y+size*.42,z+.04);m.rotation.x=-.45;m.renderOrder=5;m.frustumCulled=false;root.add(m);return m}
const P3D_MGEO={};
const P3D_MREADY=(REK3D_ON?Promise.all(Object.entries(P3D_MESHY).filter(([k,e])=>!e.b).map(([k,e])=>fetch(e.g).then(r=>r.arrayBuffer()).then(b=>{P3D_MGEO[k]=p3dParseGlb(b)}).catch(er=>quietErr('meshy '+k,er)))):Promise.resolve()).then(()=>{for(const [k,e] of Object.entries(P3D_MESHY))if(e.b&&P3D_MGEO[e.b])P3D_MGEO[k]=P3D_MGEO[e.b]});
/* 23.11.2026 (runda 868, zgoda autora): bryly TripoSG (darmowe, MIT) z tekstura wypalona z malunkow (rekwizyty portu z gry, domy z ChatGPT).
   Wypalanie: docs/modele/triposg_bake.py. Domy w porcie (szopy, kantor, karczma) oraz rekwizyty portu. Domy Osady z modeli wycofane (autor 23.11): zamiast nich spalone domy z kodu (05).
   Porownanie przed: ?tri3d=0 (tylko lokalnie). */
const TRI3D_ON=REK3D_ON&&nbParam('tri3d')!=='0';
const P3D_TRI={"beczka_ryb":{"g":"assets/rekwizyty/3027b785898b03081240b1a318b1d742ad501a36fac32abccdcf2bfaa05232a1.glb","k":"assets/rekwizyty/66911a139ac22ef234a5b43a2c8b8fb2c0d16929f3e3bf684e348e76f7ce8e12.webp"},"deski":{"g":"assets/rekwizyty/0f0b758d90647ec472e4ff4e285db5032da13a41f8f0efc1037631547af54388.glb","k":"assets/rekwizyty/4ab179a61677c5dcb35a921adaabd13f2c1ae51d2067d2e41c737d734f32d2fb.webp"},"ikra":{"g":"assets/rekwizyty/c7fea7ac188d382e7715175ca524334d0503de723276649c614e222fc7a10ccd.glb","k":"assets/rekwizyty/f4c099407a639691c72b577bfe95458d552e8d60a0075b4e840c7469dbcf810a.webp"},"kolowrot":{"g":"assets/rekwizyty/1f329cbd7750e3ed1a92817a3195083656c9ccb33e6dd00b3e1dfa80ee3b2298.glb","k":"assets/rekwizyty/7f85aaf2049309d16653a81d62b58ba111d7cd437c5665ed09e3f6937ec4d925.webp"},"kotwica":{"g":"assets/rekwizyty/403e287f3b11b844ac08621d2f846d99af6e3e207074dce0c2d9fc373090bc3c.glb","k":"assets/rekwizyty/92da17675d3838ed3c0797e12eec97d7a9d676ee72de25eb23e60f7d5b17bff3.webp"},"ladunek":{"g":"assets/rekwizyty/c15e71fa7b6ead0dade76919a3dd1514faf24a198830c84d343c92382a45128d.glb","k":"assets/rekwizyty/6be3e8d66918aa3a9ed01ebc0ab1de29125da6e7234ffb73378941659be88506.webp"},"malze":{"g":"assets/rekwizyty/efe91076a2ea17a971410a35bbaec2c95080ebfbb493d699efdcbb17d61cc059.glb","k":"assets/rekwizyty/0552466424a98ad07048fa7884e912222b8ce58a9eff39dfcb440790a1352c5a.webp"},"pacholek":{"g":"assets/rekwizyty/60e9903526e6a09d39b978bab1da65a14cfeea56f64f6d12a72cafa386b6bba9.glb","k":"assets/rekwizyty/baa64730f4e83a4e186e6002bf0cc8962faea315f325db3525732bdbac74e55d.webp"},"pacholek_cumowniczy":{"g":"assets/rekwizyty/7eef8fc6260468a3e3bc6bf7614f580ca2813795c1e8529f00df7df7a2f123c4.glb","k":"assets/rekwizyty/705ac5ea96551a93725b6b22e16b6e3f57797f43d6c74e15d1aac82d35c9aeec.webp"},"pale":{"g":"assets/rekwizyty/be8c911ecb025ea8da6ef723d47680629c1ab8df689b47fe17103acb1fde414a.glb","k":"assets/rekwizyty/ed654d474de831a29887eabf7b44e20d9a8288878186a89d0d78a594636c1b64.webp"},"siec":{"g":"assets/rekwizyty/3e7f4e7cdac751ef411a38e78ff35c97b41c73b7984f1b7ab648f188a9d9e2fb.glb","k":"assets/rekwizyty/41d9e78eeca8dc8c31efc46b8b1a453781f6d7f0637174cc8edf87fe24dfbedc.webp"},"skrzynia":{"g":"assets/rekwizyty/526424d8d345ce305d042303ecf8a24571997b2a6d68fb1186b6aeff47b5c41c.glb","k":"assets/rekwizyty/62efb5a587e0d2e2f41c4acc126985dc4c07d72035362553b546e6343ed2740f.webp"},"wiecierz":{"g":"assets/rekwizyty/ee1c862d20786dad5b52f5853fe892b902d0bb8e2957d2a647c50a54588456fd.glb","k":"assets/rekwizyty/089c150eb58328cb4f750b3d09ea9a4b66e50882e65b5fd28919d315fa488ae1.webp"},"worki_soli":{"g":"assets/rekwizyty/a20322a2bcb6092fcff29946dee2ff245a56713b6300f753ac7ed30d44ae729d.glb","k":"assets/rekwizyty/e64ddd3718681ebc394bd881bfd05d54269daae82b87b10ae0d38ef31a0896c1.webp"},"wrak":{"g":"assets/rekwizyty/71873960e44e0e7c1123893f68de63c0c4662deb08ca630c48ae85b5b1fa094b.glb","k":"assets/rekwizyty/961093a297ba9dfc781193850a07b4e8e53f26aba36290e532ef88b0764cfa75.webp"}};
const P3D_TGEO={},P3D_TMAT=new Map();
const P3D_TLOAD={};for(const [k,e] of Object.entries(P3D_TRI))P3D_TLOAD[k]=TRI3D_ON?fetch(e.g).then(r=>r.arrayBuffer()).then(b=>{P3D_TGEO[k]=p3dParseGlb(b)}).catch(er=>quietErr('tri '+k,er)):Promise.resolve();

function triReady(n){return TRI3D_ON&&!!P3D_TGEO[n]}
// cut: sciany i dachy znikaja przed bohaterem (cutaway), jak dotychczasowe sciany domow
function triMat(n,cut,tone){const id=n+(cut?'|c':'');let m=P3D_TMAT.get(id);if(m)return m;const x=new THREE.TextureLoader().load(P3D_TRI[n].k);x.flipY=false;x.anisotropy=nbAniso();
 m=phong({map:x,shininess:4,specular:0x080808,side:THREE.DoubleSide});const t=tone||.9;m.color.setRGB(t,t*.98,t*.96);if(cut)cutawayHouse(m);P3D_TMAT.set(id,m);return m}
// jeden model: srodek podstawy w (cx,cz), skale osi, obrot wokol pionu
function triMesh(n,cx,cz,sx,sy,sz,ry,cut,tone){const g=P3D_TGEO[n],bb=g.boundingBox,m=new THREE.Mesh(g,triMat(n,cut,tone));
 m.scale.set(sx,sy,sz);m.rotation.y=ry||0;const ox=(bb.min.x+bb.max.x)/2,oz=(bb.min.z+bb.max.z)/2,c=Math.cos(ry||0),s=Math.sin(ry||0),px=ox*sx,pz=oz*sz;
 m.position.set(cx-(px*c+pz*s),-bb.min.y*sy,cz-(-px*s+pz*c));m.castShadow=true;m.receiveShadow=true;return m}
// dom na prostokacie kafli: obrot (0/90/180/270) wg drzwi, skala do obrysu; hk = wysokosc w jednostkach swiata (albo ulamek, gdy <2)
function triHouse(root,n,x0,z0,w,d,door,hk,flip,tone){const g=P3D_TGEO[n];if(!g)return null;const bb=g.boundingBox,ex=bb.max.x-bb.min.x,ez=bb.max.z-bb.min.z,ey=bb.max.y-bb.min.y;
 let ry={s:0,n:Math.PI,e:Math.PI/2,w:-Math.PI/2}[door]||0;const side=Math.abs(Math.sin(ry))>.5,fx=side?ez:ex,fz=side?ex:ez;
 const sx=w/fx,sz=d/fz,sy=hk>2?hk/ey:Math.sqrt(sx*sz)*(hk||.8);/* hk>2: wysokosc domu w jednostkach swiata */const m=triMesh(n,x0+w/2,z0+d/2,(side?sz:sx)*(flip?-1:1),sy,side?sx:sz,ry,true,tone);root.add(m);return m}
// rekwizyty: szerokosc obiektu = szerokosc obrazka x wypelnienie malunku; przod-spod na linii obrazka
const TRI_FILL={pale:.74,pacholek_cumowniczy:.7,ladunek:.85,pacholek:.85};
function triProp(root,n,x,z,W,ry,flip){const g=P3D_TGEO[n];if(!g)return false;const bb=g.boundingBox,ex=bb.max.x-bb.min.x||1,s=W*(TRI_FILL[n]||.88)/ex;
 const m=triMesh(n,x,z-(bb.max.z-bb.min.z)*s/2,s*(flip?-1:1),s,s,ry,false);m.castShadow=true;m.userData.propAsset=true;root.add(m);return true}
function meshyFor(ch,k,p){let n=REK3D_ON&&P3D_MMAP[ch]&&P3D_MMAP[ch][k];if(typeof n==='function')n=p?n(p):null;if(Array.isArray(n))n=n[p?groundHash(Math.floor(p.x),Math.floor(p.y))%n.length:0];return n&&P3D_MGEO[n]?n:null}
const P3D_MMAT=new Map();
const P3D_TXC=new Map();/* 897: wspolna tekstura dla modeli z jednego atlasu (jedna kopia w karcie) */
function meshyMat(n){let m=P3D_MMAT.get(n);if(m)return m;const L=new THREE.TextureLoader(),e0=P3D_MESHY[n],e=e0.b?P3D_MESHY[e0.b]:e0,t=u=>{let x=P3D_TXC.get(u);if(x)return x;x=L.load(u);x.flipY=false;x.anisotropy=nbAniso();P3D_TXC.set(u,x);return x};
 m=phong({map:t(e.k),normalMap:e.n?t(e.n):null,shininess:6,specular:0x101010,side:THREE.DoubleSide});const tn=e0.t||P3D_TON[n]||[.92,.9,.88];m.color.setRGB(tn[0],tn[1],tn[2]);if(P3D_LAS.includes(n))cutCircle(m);P3D_MMAT.set(n,m);return m}
// szerokosc i srodek obrysu malunku (ulamki obrazka): model dostaje szerokosc obrysu, nie calego obrazka
const P3D_ABOX=new Map();
/* 23.11.2026 (885, sprzatanie): obrysy malunkow rekwizytow zastapionych modelami, zmierzone na obrazkach przed ich usunieciem (77 plikow mniej w grze) */
const P3D_ABOX_FIX={"p1_barrel":[0.2188,0.1458,0.7813,0.9375],"p1_grave_cross":[0.1563,0.1979,0.8021,0.9375],"p1_burnt_hay":[0.0313,0.1354,0.9375,0.9375],"p1_wheel":[0.1771,0.3021,0.8229,0.9375],"p1_order_banner":[0.1771,0.1979,0.7917,0.9375],"p1_tombstone":[0.1771,0.1354,0.8125,0.9375],"p1_gallows":[0.2604,0,0.7396,0.9792],"p1_marga_cart":[0.2292,0,0.75,0.9792],"p1_shop_sign":[0.1458,0.0729,0.8542,0.9792],"p1_dead_horse":[0.0417,0.4583,0.9479,0.9375],"p1_crow_post":[0.2292,0,0.7708,0.9583],"p1_well":[0.1042,0.1042,0.8854,0.9375],"p1_stocks":[0.1667,0.1458,0.8229,0.9375],"p1_order_bonfire":[0.25,0.0208,0.75,0.9896],"p2_rune_lantern":[0.1875,0.1042,0.7708,0.9375],"p2_pickaxe_rack":[0.0729,0.1979,0.8958,0.9375],"p2_anvil":[0.125,0.1875,0.8333,0.9375],"p2_king_statue":[0.0208,0.3854,0.9792,0.9688],"p2_black_powder":[0.125,0.2917,0.8438,0.9375],"p2_sarcophagus":[0.0313,0.1458,0.9271,0.9375],"p2_chains":[0.0625,0.0938,0.8958,0.9375],"p2_mine_cart":[0.0729,0.1667,0.8958,0.9375],"p2_bellows":[0.0417,0.1146,0.9271,0.9375],"p2_fallen_pillar":[0.2083,0,0.7708,0.9375],"p3_dead_tree":[0.0208,0.4531,0.9792,0.9688],"p3_royal_banner":[0.2188,0,0.75,0.9792],"p3_saint_king":[0.0208,0.1823,0.9792,0.9635],"p3_barrel":[0.2083,0.1771,0.7917,0.9375],"p3_plague_cart":[0.0521,0.2188,0.9583,0.9375],"p3_gibbet":[0.2188,0.2396,0.75,0.9375],"p3_chains":[0.0833,0.0417,0.875,0.9375],"p3_sarcophagus":[0,0.1979,0.9688,0.9375],"p3_queen_fountain":[0.2813,0.0208,0.7188,0.9792],"p3_gallows":[0.2813,0,0.7188,0.9583],"p3_wheel":[0.1771,0.3229,0.8229,0.9375],"p3_dead_horse":[0.0208,0.4479,0.9792,0.9375],"p3_offering_bowl":[0.125,0.1979,0.875,0.9375],"p3_pyre_0":[0.2708,0.125,0.75,0.9583],"p4_birch":[0.125,0.1563,0.8542,0.9688],"p4_dead_oak":[0.0417,0.1146,0.9479,0.9688],"p4_spruce":[0.1667,0.1979,0.8333,0.9688],"p4_tall_pine":[0.0208,0.4427,0.9792,0.9844],"p4_dead_spruce":[0.2396,0.3333,0.75,0.9688],"p4_sacred_oak":[0.0208,0.0521,0.9792,0.9688],"p4_hanging_tree":[0.0208,0.4531,0.9792,0.9844],"p4_cz_bones":[0.0208,0.3438,0.9583,0.9375],"p4_wolf_skull_bush":[0.0313,0.1146,0.9688,0.9792],"p4_burial_mound":[0.0313,0.1771,0.9688,0.9792],"p4_mossy_boulder":[0.0313,0.1979,0.9688,0.9792],"p4_drowned_cart":[0.0521,0.1458,0.9479,0.9792],"p4_cz_wagon":[0.2917,0.1875,0.7083,0.9375],"p4_cz_tent":[0.0833,0.1354,0.9271,0.9375],"p4_cz_sacpole":[0.25,0.1875,0.7396,0.9375],"p4_cz_firewood":[0.0625,0.2708,0.9375,0.9375],"p4_cz_pelts":[0.1354,0.3438,0.8646,0.9375],"p4_cz_beehive":[0.0938,0.25,0.7292,0.9375],"p4_axe_stump":[0.0313,0.1146,0.9688,0.9792],"p4_cz_idol":[0.2188,0.2708,0.75,0.9375],"p4_cz_gallows":[0.1042,0.1771,0.8542,0.9375],"p4_cz_wheel":[0.1042,0.1771,0.8958,0.9375],"p4_brambles":[0.0417,0.2188,0.9479,0.9688],"p5_candelabra":[0.2292,0.1771,0.7708,0.9688],"p5_statue_a":[0.2396,0.0417,0.7604,0.9688],"p5_statue_b":[0.2396,0.0417,0.7604,0.9688],"p5_armour":[0.2396,0.0104,0.7604,0.9688],"p5_bench_b":[0.0208,0.4375,0.9792,0.9688],"p5_bookcase_a":[0.0833,0,0.9063,0.9688],"p5_bookcase_b":[0.1146,0.0208,0.8854,0.9688],"p5_vault":[0.1458,0.2188,0.8542,0.9688],"p5_lectern":[0.1458,0,0.8542,0.9896],"p5_desk":[0.0208,0.1354,0.9792,0.9688],"p5_scale":[0.1354,0.2396,0.8542,0.9688],"p5_rack":[0.0521,0.1563,0.9479,0.9688],"p5_throne":[0.3125,0.0208,0.6875,0.9792],"p1_dead_tree":[0.0313,0.4948,0.9583,0.9688]};
function p3dAlphaBox(key){let b=P3D_ABOX.get(key);if(b)return b;const img=IMGS[key];if(!img)return P3D_ABOX_FIX[key]||[0,0,1,1];const W=96,H=Math.round(96*img.height/img.width),c=canvas(W,H),g=c.getContext('2d');g.drawImage(img,0,0,W,H);
 const px=g.getImageData(0,0,W,H).data;let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(px[(y*W+x)*4+3]>128){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
 b=x1<x0?[0,0,1,1]:[x0/W,y0/H,(x1+1)/W,(y1+1)/H];P3D_ABOX.set(key,b);return b}
// 22.11.2026 (przeglad grafiki): modele mniejsze lub nizsze niz ich obrazki 2D: [skala calosci, dodatkowa skala wysokosci]
const P3D_SKALA={r7_stos1:[2,1],r7_stos3:[2,1],r7_kosz5z:[1.35,1],p2_anvil:[1.3,1],p2_black_powder:[1.3,1],p1_grave_cross:[1.2,1],p1_order_banner:[1.2,1],p1_well:[1,1.25]};
function meshyEmit(root,items){const by=new Map(),M=new THREE.Matrix4(),V=new THREE.Vector3(),Q=new THREE.Quaternion(),S=new THREE.Vector3();
 for(const it of items){const g=P3D_MGEO[it.n];if(!g)continue;const bb=g.boundingBox,gw=bb.max.x-bb.min.x||1,me=P3D_MESHY[it.n]||{},ab=it.ab||me.ab||p3dAlphaBox(me.img||it.n),s=it.W*(ab[2]-ab[0])/gw,fl=it.flip?-1:1,dx=((ab[0]+ab[2])/2-.5)*it.W*fl;
  // przod-spod modelu na linii obrazka (tam stala jego dolna krawedz)
  const sk=P3D_SKALA[it.n],sc=sk?s*sk[0]:s;M.compose(V.set(it.x+dx,0,it.z-bb.max.z*sc),Q,S.set(sc*fl,sc*(sk?sk[1]:1),sc));if(me.fl)addFlame(root,it.x+dx,(bb.max.y-bb.min.y)*sc*me.fl[0],it.z-bb.max.z*sc,(bb.max.x-bb.min.x)*sc*me.fl[1]);(by.get(it.n)||by.set(it.n,[]).get(it.n)).push(M.clone())}
 for(const [n,list] of by){const im=new THREE.InstancedMesh(P3D_MGEO[n],meshyMat(n),list.length);list.forEach((m,i)=>im.setMatrixAt(i,m));im.castShadow=P3D_CIEN.has(n);im.receiveShadow=true;im.frustumCulled=false;im.userData.propAsset=true;root.add(im)}}
const P3D_CIEN=new Set(P3D_LAS);
function paint3dImg(ch,k){const e=REK3D_ON&&P3D_MAP[ch]&&P3D_MAP[ch][k];return e&&P3D_GEO[e[0]]&&IMGS[e[1]]?e:null}
// po composeWorldProps: obrazki tych rekwizytow ustepuja modelom (miejsce i szerokosc bierzemy z obrazka)
function paint3dFinish(w){if(!REK3D_ON||(!P3D_MAP[w.ch]&&!P3D_MMAP[w.ch]))return;const items=[],mitems=[];
 for(const {p,W} of (w.p3d||[])){const n=meshyFor(w.ch,p.k,p);if(n){mitems.push({n,x:p.x,z:p.y,W,flip:!!p.flip});continue}const e=paint3dImg(w.ch,p.k);if(e)items.push({e,x:p.x,z:p.y,W,flip:!!p.flip})}
 w.p3d=null;
 for(const p of w.PROPS){const n=meshyFor(w.ch,p.k,p),e=n?null:paint3dImg(w.ch,p.k);if((!e&&!n)||(p.anim&&!(n&&P3D_MESHY[n].fl))||p.shrine!==undefined)continue;const o=p.obj||w.propObjs.find(o=>Math.abs(o.mesh.position.x-p.x)<.001&&Math.abs(o.mesh.position.z-p.y)<.001);const m=o&&o.mesh;
  if(!m||!m.parent||!m.geometry||!m.geometry.parameters||m.isInstancedMesh)continue;
  let tW=0;if(w.ch===1&&p.k==='dead_tree'){const tk=p.variant||['dead_oak','dead_spruce','dead_oak'][groundHash(Math.floor(p.x),Math.floor(p.y))%3];tW=4*(p.vscale||({spruce:1.08,birch:1}[tk]||.82))}
  const it={x:m.position.x,z:m.position.z,W:tW||m.geometry.parameters.width*Math.abs(m.scale.x),flip:m.scale.x<0};/* 885: w rozdz. I martwe swierki zawsze mialy pelna szerokosc obrazka (obrazek z Czarnoboru nie byl tu wczytany) - zachowany zatwierdzony wyglad */if(n==='p4_dead_spruce'&&w.ch===1)it.ab=[0,0,1,1];if(n)mitems.push(Object.assign(it,{n}));else items.push(Object.assign(it,{e}));
  m.parent.remove(m);const i=w.propObjs.findIndex(q=>q.mesh===m);if(i>=0)w.propObjs.splice(i,1)}
 const by=new Map(),M=new THREE.Matrix4(),V=new THREE.Vector3(),Qi=new THREE.Quaternion(),S=new THREE.Vector3();
 for(const it of items){const G=p3dGeo(it.e[0],it.e[1]);if(!G)continue;const s=it.W*(G.box[2]-G.box[0])/G.w,dx=((G.box[0]+G.box[2])/2-.5)*it.W*(it.flip?-1:1);
  // srodek obrysu jak srodek malunku na obrazku; przod-spod modelu na linii obrazka (tam stoi jego dolna krawedz)
  M.compose(V.set(it.x+dx-G.cx*s*(it.flip?-1:1),0,it.z-G.zf*s),Qi,S.set(it.flip?-s:s,s,s));(by.get(G)||by.set(G,[]).get(G)).push(M.clone())}
 for(const [G,list] of by){const im=new THREE.InstancedMesh(G.g,G.m,list.length);list.forEach((m,i)=>im.setMatrixAt(i,m));im.castShadow=false;im.receiveShadow=true;im.frustumCulled=false;im.userData.propAsset=true;w.group.add(im)}
 if(mitems.length)meshyEmit(w.group,mitems)}
/* 23.11.2026 (autor: "Chojrakowi dojebana chata"): cala, niespalona chata z bali w Spalonej Osadzie. Podmurowka, zamki bali na narozach, okna z okiennicami,
   waskie drzwi pod daszkiem, tarcza Zakonu i choragiew przy wejsciu, komin, drewno pod sciana; w srodku podloga, prycza ze skora, stol, oltarzyk, zbroja na stojaku, miecze, skrzynia, palenisko.
   Dach (dachowka autora) znika, gdy bohater jest blisko (roofTick, r.pad). */
function chojrakChata(C){const N=(k,sc,col,o)=>worldSurfN(cutaway(phong(Object.assign({color:col},o||{}))),k,sc,1.9,2);
 const logs=N('t1_bale',2.1,0xfff4ea),beam=N('t2_belka',1.2,0xeee2d6),stone=N('t4_podmurowka',2.0,0xe4dad0),floorM=worldSurfN(phong({color:0xd0c6bc}),'t5_podloga',2.4,1.1),
  glassL=winGlass(cutaway(phong({color:0x1a120a,emissive:0x8a4a14})),1,2),iron=cutaway(phong({color:0x3a3634,specular:0x333333,shininess:30})),red=cutaway(phong({color:0x6e1a16,side:THREE.DoubleSide})),
  gold=cutaway(phong({color:0xb89040,emissive:0x2a1c06,specular:0x806020,shininess:30})),fur=cutaway(phong({color:0x6a5a48})),green=cutaway(phong({color:0x3a4a36})),flame=phong({color:0xffe0a0,emissive:0xffa040}),
  ember=phong({color:0x220a04,emissive:0x8a2a08});
 const sg=new THREE.Group();ROOT.add(sg);const add=(g,m,x,y,z,rx,ry,rz)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.rotation.set(rx||0,ry||0,rz||0);o.castShadow=o.receiveShadow=true;sg.add(o);return o};
 const B=(w,h,d,m,x,y0,z,ry)=>add(new THREE.BoxGeometry(w,h,d),m,x,y0+h/2,z,0,ry||0,0),Cy=(r,h,m,x,y,z,rx,rz)=>add(new THREE.CylinderGeometry(r,r,h,10),m,x,y,z,rx,0,rz);
 const x0=C.x,z0=C.y,x1=C.x+C.w,z1=C.y+C.h,[dX,dY]=C.door,dx=dX+.5,cx=(x0+x1)/2,cz=(z0+z1)/2,EV=2.55;
 // sciany z bali (kafle 48 w obrebie chaty) na podmurowce
 const wt=[];for(let y=z0;y<z1;y++)for(let x=x0;x<x1;x++)if(tileAt(x,y)===48)wt.push([x,y]);
 const wg=new THREE.BoxGeometry(1,EV,1);wg.translate(0,EV/2,0);instanced(wg,logs,wt,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
 const fg=new THREE.BoxGeometry(1.08,.45,1.08);fg.translate(0,.225,0);instanced(fg,stone,wt,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
 B(C.w+.2,.28,.36,beam,cx,EV-.05,z0+.5);B(C.w+.2,.28,.36,beam,cx,EV-.05,z1-.5);B(.36,.28,C.h,beam,x0+.5,EV-.05,cz);B(.36,.28,C.h,beam,x1-.5,EV-.05,cz);
 for(const [X,Z,sx,sz] of [[x0,z0,-1,-1],[x1,z0,1,-1],[x0,z1,-1,1],[x1,z1,1,1]])for(let i=0;i<8;i++){const y=.55+i*.25;if(i%2)Cy(.13,.7,beam,X+sx*.2,y,Z-sz*.5,0,Math.PI/2);else Cy(.13,.7,beam,X-sx*.5,y,Z+sz*.2,Math.PI/2,0)}
 // okna: rama, szprosy, cieple swiatlo, otwarte zielone okiennice, parapet
 const win=(x,z,ry)=>{const g=new THREE.Group();g.position.set(x,1.3,z);g.rotation.y=ry;sg.add(g);const m=(geo,mat,px,py,pz,rz)=>{const o=new THREE.Mesh(geo,mat);o.position.set(px,py,pz);if(rz)o.rotation.y=rz;o.castShadow=true;g.add(o);return o};
  m(new THREE.BoxGeometry(.66,.62,.06),glassL,0,0,.02);if(NB_WIN){const s=new THREE.Mesh(new THREE.PlaneGeometry(.66*2.4,.62*2.2),winSpillMat());s.position.set(0,-.15,.1);g.add(s)}for(const sy of [-1,1])m(new THREE.BoxGeometry(.9,.1,.16),beam,0,sy*.36,.06);for(const sx of [-1,1])m(new THREE.BoxGeometry(.1,.82,.16),beam,sx*.4,0,.06);
  m(new THREE.BoxGeometry(.05,.62,.05),beam,0,0,.08);m(new THREE.BoxGeometry(.66,.05,.05),beam,0,0,.08);m(new THREE.BoxGeometry(1.0,.08,.28),beam,0,-.45,.14);
  for(const sx of [-1,1]){const sh=m(new THREE.BoxGeometry(.36,.7,.04),green,sx*.66,0,.16,sx*.35);m(new THREE.BoxGeometry(.3,.05,.05),beam,sx*.66,.18,.2,sx*.35)}};
 for(const x of [dx-4.5,dx+4.5])win(x,z1+.03,0);for(const x of [x0+3.5,cx,x1-3.5])win(x,z0-.03,Math.PI);win(x0-.03,cz,-Math.PI/2);for(const z of [z0+2.8,z1-2.8])win(x1+.03,z,Math.PI/2);
 // drzwi: oscieznica, nadproze, uchylone skrzydlo, prog z kamienia, daszek na dwoch slupkach
 for(const sx of [-1,1])B(.2,2.15,.4,beam,dx+sx*.48,0,z1-.3);B(1.3,.26,.44,beam,dx,2.15,z1-.3);B(.08,1.95,.78,beam,dx-.4,.05,z1-1.35,.25);B(1.1,.12,.6,stone,dx,0,z1+.25);
 for(const sx of [-1,1]){B(.16,2.35,.16,beam,dx+sx*.75,0,z1+1.25);const br=B(.1,.1,.9,beam,dx+sx*.75,2.15,z1+.75);br.rotation.x=-.5}
 {const L=1.9,Dp=1.6,y=2.45,rise=.6,pts=[],t=(a,b,c)=>pts.push(...a,...b,...c);for(const sx of [-1,1]){const r0=[dx,y+rise,z1-.1],r1=[dx,y+rise,z1+Dp],e0=[dx+sx*L/2,y,z1-.1],e1=[dx+sx*L/2,y,z1+Dp];t(r0,e0,e1);t(r0,e1,r1)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.computeVertexNormals();add(g,N('t6_dachowka',1.6,0xf0e4dc,{side:THREE.DoubleSide}),0,0,0);B(.14,.14,Dp+.1,beam,dx,y+rise,z1+Dp/2-.05)}
 // tarcza Zakonu, choragiew, latarnia
 {const sx=dx-1.7,sz=z1+.08;add(new THREE.CylinderGeometry(.42,.42,.07,20),red,sx,1.65,sz,Math.PI/2,0,0);add(new THREE.TorusGeometry(.42,.04,6,20),gold,sx,1.65,sz+.02);B(.08,.6,.04,gold,sx,1.35,sz+.05);B(.44,.08,.04,gold,sx,1.72,sz+.05)}
 {const bx=dx+1.9;B(.9,.05,.05,iron,bx,2.28,z1+.1);B(.72,1.3,.03,red,bx,.95,z1+.09);B(.08,.7,.02,gold,bx,1.35,z1+.11);B(.4,.08,.02,gold,bx,1.65,z1+.11);for(let i=0;i<3;i++){const c=add(new THREE.ConeGeometry(.12,.2,3),red,bx-.24+i*.24,.88,z1+.09);c.rotation.x=Math.PI}}
 B(.05,.05,.5,iron,dx+.95,2.05,z1+.25);B(.03,.18,.03,iron,dx+.95,1.88,z1+.48);B(.2,.28,.2,glassL,dx+.95,1.58,z1+.48);B(.24,.05,.24,iron,dx+.95,1.86,z1+.48);
 // drewno pod zachodnia sciana i lawa przy wejsciu
 for(let row=0;row<4;row++)for(let k=0;k<12-row;k++)Cy(.11,.55,beam,x0-.36,.12+row*.2,cz-1.4+k*.24+row*.12,0,Math.PI/2);
 B(1.7,.08,.42,beam,dx+3.3,.42,z1+.42);for(const sx of [-1,1])B(.1,.42,.36,beam,dx+3.3+sx*.7,0,z1+.42);
 // komin z kamienia na wschodniej scianie, palenisko w srodku
 const chx=x1-.5,chz=Math.floor(cz)+.5,RISE=Math.min(2.8,C.h*.25),H=EV+RISE+1.0;B(1.15,H,1.15,stone,chx,0,chz);B(1.35,.18,1.35,stone,chx,H,chz);B(.6,.05,.6,cutaway(phong({color:0x0e0b09})),chx,H+.18,chz);
 B(1.0,1.0,1.5,stone,chx-1.0,0,chz);B(.08,.55,.8,ember,chx-1.52,.15,chz);
 // wnetrze
 B(C.w-1.9,.03,C.h-1.9,floorM,cx,0,cz);B(2.6,.02,1.8,red,cx,.03,cz+.5);
 B(2.1,.42,1.15,beam,x0+2.6,0,z0+2.2);B(1.9,.16,1.0,fur,x0+2.6,.42,z0+2.2);B(.5,.12,.8,cutaway(phong({color:0xc8bca8})),x0+1.85,.58,z0+2.2);B(1.0,.04,1.02,red,x0+3.0,.58,z0+2.2);
 const tx=x1-4.2,tz=z0+3.4;B(1.5,.08,.85,beam,tx,.74,tz);for(const [a,b] of [[-.65,-.33],[.65,-.33],[-.65,.33],[.65,.33]])B(.08,.74,.08,beam,tx+a,0,tz+b);
 for(const sx of [-1,1])B(.42,.46,.42,beam,tx+sx*1.05,0,tz+.1);Cy(.05,.2,cutaway(phong({color:0xe8dcc0})),tx-.3,.92,tz);add(new THREE.SphereGeometry(.05,8,6),flame,tx-.3,1.06,tz);Cy(.07,.16,iron,tx+.35,.9,tz-.1);B(.36,.06,.26,red,tx+.1,.82,tz+.15);
 B(1.3,.92,.55,stone,dx,0,z0+1.45);B(.08,.75,.06,gold,dx,.92,z0+1.4);B(.42,.08,.06,gold,dx,1.42,z0+1.4);for(const sx of [-.45,.45,0]){Cy(.045,.22,cutaway(phong({color:0xe8dcc0})),dx+sx,1.03,z0+1.62);add(new THREE.SphereGeometry(.045,8,6),flame,dx+sx,1.19,z0+1.62)}
 {const ax=x0+2.3,az=z1-3.0;Cy(.06,1.5,beam,ax,.75,az);B(.25,.08,.4,beam,ax,0,az);B(.62,.66,.34,iron,ax,1.0,az);for(const sx of [-1,1])add(new THREE.SphereGeometry(.17,10,8),iron,ax+sx*.36,1.6,az);add(new THREE.SphereGeometry(.2,12,10),iron,ax,1.92,az);B(.26,.05,.05,cutaway(phong({color:0x0a0a0a})),ax,1.92,az+.19)}
 {const rx=x1-2.3,rz=z1-3.4;for(const sx of [-1,1])B(.1,1.4,.12,beam,rx+sx*.55,0,rz);B(1.3,.1,.14,beam,rx,1.2,rz);for(const sx of [-.25,.25]){B(.06,1.05,.03,iron,rx+sx,.18,rz+.1);B(.32,.05,.06,gold,rx+sx,1.15,rz+.1);add(new THREE.SphereGeometry(.05,8,6),gold,rx+sx,1.36,rz+.1)}}
 {const kx=x1-3.0,kz=z0+1.55;B(1.1,.55,.62,beam,kx,0,kz);B(1.14,.14,.66,beam,kx,.55,kz);for(const sx of [-.35,.35])B(.08,.7,.68,iron,kx+sx,0,kz)}
 // scalenie wszystkiego poza dachem
 ROOT.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(ROOT.matrixWorld).invert(),mm=new THREE.Matrix4(),byM=new Map();const keep=[];
 sg.traverse(o=>{if(!o.isMesh)return;const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();if(!geo.attributes.normal)geo.computeVertexNormals();geo.applyMatrix4(mm.multiplyMatrices(inv,o.matrixWorld));
  let e=byM.get(o.material);if(!e){const wu=o.material.userData&&o.material.userData.nbWin;e={p:[],n:[],u:wu?[]:null,s:wu?[]:null};byM.set(o.material,e)}const P=geo.attributes.position.array,Nn=geo.attributes.normal.array;for(let i=0;i<P.length;i++){e.p.push(P[i]);e.n.push(Nn[i])}
  if(e.u){const U=geo.attributes.uv,me=o.matrixWorld.elements,k=Math.sin(me[12]*12.9898+me[13]*4.1414+me[14]*78.233)*43758.5453,sd=.01+.98*(k-Math.floor(k));for(let i=0;i<P.length/3;i++){e.u.push(U?U.array[i*2]:0,U?U.array[i*2+1]:0);e.s.push(sd)}}geo.dispose()});ROOT.remove(sg);
 for(const [mat,e] of byM){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(e.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(e.n,3));if(e.u){g.setAttribute('uv',new THREE.Float32BufferAttribute(e.u,2));g.setAttribute('nbSeed',new THREE.Float32BufferAttribute(e.s,1))}const m=new THREE.Mesh(g,mat);m.castShadow=!mat.transparent;m.receiveShadow=true;ROOT.add(m)}
 // dach: dwuspadowy z dachowki, szczyty z bali, kalenica; przezroczysty, znika przy bohaterze
 const T=m=>{m.transparent=true;m.opacity=1;return m},rT=T(N('t6_dachowka',2.4,0xf4ece4,{side:THREE.DoubleSide})),rL=T(N('t1_bale',2.1,0xfff4ea,{side:THREE.DoubleSide})),rB=T(N('t2_belka',1.2,0xeee2d6));
 const rg=new THREE.Group(),oh=.45,L=C.w/2+oh,E=C.h/2+oh,RS=RISE,dyy=oh*RS/(C.h/2),pts=[],gp=[];const tri=(arr,a,b,c,want)=>{const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(n[0]*want[0]+n[1]*want[1]+n[2]*want[2]<0)arr.push(...a,...c,...b);else arr.push(...a,...b,...c)};
 for(const s of [1,-1]){const r0=[cx-L,EV+RS,cz],r1=[cx+L,EV+RS,cz],e0=[cx-L,EV-dyy,cz+s*E],e1=[cx+L,EV-dyy,cz+s*E];tri(pts,r0,e0,e1,[0,1,s]);tri(pts,r0,e1,r1,[0,1,s])}
 for(const s of [1,-1])tri(gp,[cx+s*C.w/2,EV,z0],[cx+s*C.w/2,EV,z1],[cx+s*C.w/2,EV+RS,cz],[s,0,0]);
 const mk=(arr,m)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));g.computeVertexNormals();const o=new THREE.Mesh(g,m);o.castShadow=o.receiveShadow=true;rg.add(o)};mk(pts,rT);mk(gp,rL);
 const rb=new THREE.Mesh(new THREE.BoxGeometry(C.w+oh*2,.22,.22),rB);rb.position.set(cx,EV+RS+.06,cz);rb.castShadow=true;rg.add(rb);
 for(const s of [1,-1]){const fb=new THREE.Mesh(new THREE.BoxGeometry(.12,.3,Math.hypot(E,RS+dyy)+.1),rB);fb.position.set(cx+s*L,EV+RS/2-dyy/2,cz);rg.add(fb);const fb2=fb.clone();fb2.position.z=cz;fb.rotation.x=Math.atan2(RS+dyy,E);fb.position.z=cz+E/2;fb2.rotation.x=-Math.atan2(RS+dyy,E);fb2.position.z=cz-E/2;rg.add(fb2)}
 ROOT.add(rg);C.r.mesh=rg;C.r.mats=[rT,rL,rB];C.r.a=1}
function buildBrzeznica(I){
  const F=I.br_ground,Wl=I.br_walls,r=rng(77);planGround(1);
  const fc=canvas(WW,WH),fg=fc.getContext('2d');
  const tile=(c,row,tx,ty)=>groundTile(fg,F,c,row,tx,ty);
  const ROW={40:0,41:1,42:2,43:3,44:4,46:6,47:7,48:3,21:2};
  for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){let t=tileAt(tx,ty);if(t===31)t=W.under[ty*MW+tx]||42;if(t===45||t===90)t=42;
    tile((r()*8)|0,ROW[t]??2,tx,ty);if(t===21){fg.fillStyle='rgba(3,3,6,.6)';fg.fillRect(tx*16,ty*16,16,16)}}
  // Natural boundaries blend continuously in the atlas material.
  floorAO(fg,new Set([31]));
  // Low-density story marks, with a soft circular mask instead of rectangular blood tiles.
  for(const p of W.PROPS){const x=Math.floor(p.x),y=Math.floor(p.y),i=y*MW+x;if(!W.groundPlan||W.groundPlan.road[i])continue;
    const blood=p.k==='gallows'||p.k==='covered_corpses',ash=p.fire;if(!blood&&!ash)continue;
    fg.save();fg.translate(p.x*16,p.y*16);fg.globalAlpha=blood?.32:.22;const stamp=canvas(48,48),sg=stamp.getContext('2d');sg.drawImage(DEC[blood?'pool':'scorch'][groundHash(x,y)%4],0,0,48,48);sg.globalCompositeOperation='destination-in';const mask=sg.createRadialGradient(24,24,4,24,24,24);mask.addColorStop(0,'#fff');mask.addColorStop(1,'transparent');sg.fillStyle=mask;sg.fillRect(0,0,48,48);fg.drawImage(stamp,-24,-24);fg.restore()}
  const floor=new THREE.Mesh(floorGeo,groundMaterial(phong({map:surfaceTex(fc),alphaTest:.5})));floor.position.set(MW/2,0,MH/2);floor.receiveShadow=true;ROOT.add(floor);
  // palisade (row 7) on the border, charred log walls on stone footings (rows 0-2) for the houses; wooden caps from row 4
  const HD1=!!(I.wl_palisada&&I.wl_chata&&I.wl_palecap);const capMat=HD1?worldSurf(cutaway(phong({color:0xc8bcb0})),I.wl_palecap,3,'a'):cutaway(phong({map:texFrom(tcut(Wl,1,4),true)}));
  const palGeo=new THREE.BoxGeometry(1,2.4,1);palGeo.translate(0,1.2,0);
  const HH=nbParam('spalone')!=='0'&&nbParam('osada2')!=='0'&&typeof OSADA_TX!=='undefined'?2.4:1.9;/* 23.11.2026: domy Osady pelnej wysokosci (styl jak chata Chojraka) */const houseGeo=new THREE.BoxGeometry(1,HH,1);houseGeo.translate(0,HH/2,0);
  const pal=[0,1].map(i=>stackTex(Wl,[[i*3,7],[i*3+1,7],[i*3+2,7]]));
  const logs=[0,1,2,3].map(i=>stackTex(Wl,[[(i*2)%8,1],[(i*3+1)%8,0],[(i*5+2)%8,2]]));
  const gP=[[],[]],gH=[[],[],[],[]];
  const CH_=W.chata,inCh=(x,y)=>CH_&&x>=CH_.x&&x<CH_.x+CH_.w&&y>=CH_.y&&y<CH_.y+CH_.h;
  for(const [x,y,t] of walls){if(inCh(x,y))continue;if(t===48)gH[(x*7+y*3)%4].push([x,y]);else gP[(x+y)&1].push([x,y])}
  if(CH_)chojrakChata(CH_);
  gP.forEach((list,i)=>{if(!list.length)return;const side=HD1?worldSurf(cutaway(phong({color:i?0xd4ccc4:0xc8c0b8})),I.wl_palisada,3,'a'):cutaway(phong({map:pal[i]}));depthWall(palGeo,side,1);instanced(palGeo,[side,side,capMat,capMat,side,side],list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5))});
  const OS=nbParam('spalone')!=='0',margaR=(W.roofs||[]).find(r=>r.marga)||(W.roofs||[]).reduce((b,r)=>(!b||r.w/r.h>b.w/b.h)?r:b,null),inMarga=(x,y)=>margaR&&(margaR.marga||margaR.w/margaR.h>1.6)&&x>=margaR.x&&x<margaR.x+margaR.w&&y>=margaR.y&&y<margaR.y+margaR.h;
  const houseCap=OS?worldSurfN(cutaway(phong({color:0xd8ccc0})),'t2_belka',1.4,1.8,3):I.p1_roof_burnt?worldSurf(cutaway(phong({color:0xffffff})),I.p1_roof_burnt,2.5,'a'):capMat;
  /* 23.11.2026: podmurowka z kamienia pod scianami domow (tekstura autora) */
  if(OS){const all=gH.flat();if(all.length){const fg=new THREE.BoxGeometry(1.08,.42,1.08);fg.translate(0,.21,0);instanced(fg,worldSurfN(cutaway(phong({color:0xe0d6cc})),'t4_podmurowka',2.2,1.9,3),all,([x,y])=>M4.makeTranslation(x+.5,0,y+.5))}}
  gH.forEach((list,i)=>{if(!list.length)return;const side=OS?worldSurfN(cutaway(phong({color:[0xfff4ea,0xf4eae0,0xfff8f0,0xece2d8][i]})),'t1_bale',2.1,1.9,3):HD1?worldSurf(cutaway(phong({color:[0xd0c4b8,0xc8bcb0,0xd4c8bc,0xccc0b4][i]})),I.wl_chata,3,'a'):cutaway(phong({map:logs[i]}));depthWall(houseGeo,side,1);instanced(houseGeo,[side,side,houseCap,houseCap,side,side],list,([x,y])=>{/* 23.11.2026: nierowne, nadpalone korony scian (narozniki i otwory pelne) */const k=Math.sin(x*12.9898+y*78.233)*43758.5453,f=k-Math.floor(k),n=(dx,dy)=>tileAt(x+dx,y+dy)===48,corner=(n(1,0)||n(-1,0))&&(n(0,1)||n(0,-1)),edgeOpen=!n(1,0)&&!n(-1,0)||!n(0,1)&&!n(0,-1);const s=corner||!OS||inMarga(x,y)?1:HH>2?(f<.25?.74+f*.8:1):f<.38?.5+f*.9:f<.6?.86:1;return M4.makeScale(1,s,1).setPosition(x+.5,0,y+.5)})});
  // stagnant pond (row 5 animated)
  waterFrames=[0,1,2,3].map(i=>tcut(F,i,5));
  const wGeo=new THREE.PlaneGeometry(1,1);wGeo.rotateX(-Math.PI/2);
  if(I.cc0_water&&(waters.length||(W.shallow||[]).length)){waterHD(I.water_shallow||I.cc0_water,W.shallow,.012,4,I.water_shallow?0xdde8ee:0x6f8799,false);waterHD(I.cc0_water,waters,.014,4,0x4a5c80,true);{const all=waters.concat(W.shallow||[]);shoreFX(all,all,.02,'water',true)}}else
  instanced(wGeo,liquidMat({map:waterTex,color:0x9aa6bc,shininess:54,specular:0x35465a}),waters.concat(W.shallow||[]),([x,y])=>M4.makeTranslation(x+.5,-.08,y+.5),false,true);
  const R={dead_tree:[0,0,32,64],impaled_head:[32,0,32,32],grave_cross:[64,0,32,32],tombstone:[96,0,32,32],well:[32,32,32,32],stocks:[64,32,32,32],shrine:[96,32,32,32],gallows:[0,64,64,32],
    debris_fire_0:[64,64,32,32],debris_fire_1:[96,64,32,32],debris_fire_2:[0,96,32,32],debris_fire_3:[32,96,32,32],wheel:[64,96,32,32],barrel:[96,96,32,32],marga_cart:[0,128,64,32],
    crow_post:[64,128,32,32],covered_corpses:[96,128,32,32],order_bonfire:[0,160,32,32],order_banner:[32,160,32,32],burnt_hay:[64,160,32,32],dead_horse:[96,160,32,32],shop_sign:[0,0,32,32],house_fire_0:[0,0,32,32],house_fire_1:[0,0,32,32],house_fire_2:[0,0,32,32],house_fire_3:[0,0,32,32]};
  const PF={};for(const k in R)PF[k]=I['p1_'+k]?procFrame(I['p1_'+k],0,0,R[k][2],R[k][3],'prop'):procFrame(I.br_props,R[k][0],R[k][1],R[k][2],R[k][3],'prop');
  // stairs down into the crypt (Lower City transition sheet)
  if(I.p1_crypt_stairs){R.crypt_stairs=[0,0,96,72];PF.crypt_stairs=procFrame(I.p1_crypt_stairs,0,0,96,72,'prop')}else{R.crypt_stairs=[0,0,64,32];PF.crypt_stairs=procFrame(I.trans,0,0,64,32,'prop')}
  for(const p of PROPS){
    let frames,rc;
    if(p.anim==='fire'){frames=[0,1,2,3].map(i=>PF['debris_fire_'+i]);rc=R.debris_fire_0}else if(p.anim==='hfire'){frames=[0,1,2,3].map(i=>PF['house_fire_'+i]);rc=R.house_fire_0}
    else if(p.shrine!==undefined){frames=[PF.shrine,PF.shrine];rc=R.shrine}
    else{frames=[PF[p.k]];rc=R[p.k]}
    const m=mkProp(frames,p.x,p.y,rc);if(p.flip)m.scale.x*=-1;
    propObjs.push({mesh:m,frames,fps:p.anim?6:0,ph:Math.random()*3,kind:p.shrine!==undefined?'shrine':p.anim?'anim':'static',si:p.shrine});
  }
}

// chapter III cuts buildings only in a circle around the hero, so the domes stay visible in front of him
const CUTS={value:new THREE.Vector3(-999,-999,0)};
function cutCircle(mat){mat.onBeforeCompile=sh=>{sh.uniforms.uCut=CUT;sh.uniforms.uScr=CUTS;
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vCut;').replace('#include <project_vertex>','#include <project_vertex>\nvec4 cwp=vec4(transformed,1.0);\n#ifdef USE_INSTANCING\ncwp=instanceMatrix*cwp;\n#endif\nvCut=(modelMatrix*cwp).xyz;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vCut;uniform vec3 uCut;uniform vec3 uScr;').replace('void main() {','void main() {\nif(vCut.z-uCut.z>0.3&&vCut.y>0.6){float dd=length(gl_FragCoord.xy-uScr.xy);if(dd<uScr.z)discard;if(dd<uScr.z*1.3&&mod(floor(gl_FragCoord.x)+floor(gl_FragCoord.y),2.0)<1.0)discard;}')};return mat}
// Chapter III meshes: reuses the Lower City stone and village ground, adds golden domes, lit windows and rot
/* 23.11.2026 (autor: nowe moduly Zlotogrodu): waska kamienica z podcieniem, narozna kamienica ze schodami, kamienica z wykuszem, mala kaplica.
   Kazda bryla budowana w ukladzie lokalnym (front = +z) i obracana wg ZL_NOWE; tekstury autora: tynk wapienny, mur kamienny, dachowka, miedz, stare zlocenie. */
function zlNoweBuild(){const WR=W;
 const M=(k,sc,col,o)=>worldSurfN(cutCircle(phong(Object.assign({color:col},o||{}))),k,sc,1.9,1);/* 23.11.2026 (autor: obklej mocniej): mocniejsza wypuklosc */
 const plaster=M('tgm1_tynk_wapienny',1.7,0xf0e8dc),stone=M('tgm2_mur_kamienny',1.3,0xe0d8cc),stoneD=M('tm03_ciosy',1.0,0xb0a698),
  tiles=M('tgm3_dachowka_gliniana',1.1,0xd8c8ba,{side:THREE.DoubleSide}),copper=M('tzl1_miedz_patynowana',1.5,0xf4f8f6,{side:THREE.DoubleSide,specular:0x5a7a70,shininess:26}),
  gold=M('tzl2_zloto_patynowane',1.2,0xa09078,{specular:0x3a3020,shininess:14}),wood=M('t2_belka',1.2,0x8c7c6c),
  glassL=winGlass(cutCircle(phong({color:0x17120e,emissive:0x6a3c12,specular:0x333333,shininess:40})),1,3),glassD=winGlass(cutCircle(phong({color:0x121418,specular:0x444444,shininess:50})),0,3),
  iron=cutCircle(phong({color:0x34302c,specular:0x222222,shininess:20})),oak=M('tsn1_dab_portowy',1.3,0xb8aca0),patch=M('m_buda',2.2,0xd0c4b8,{side:THREE.DoubleSide}),
  stain=[0x7a1a12,0x183a7a,0x8a5a10,0x2a5a2a].map(e=>winGlass(cutCircle(phong({color:0x120c0a,emissive:e,specular:0x666666,shininess:50})),2,5,e)),
   roseS=NB_WIN?[0x7a1a12,0x183a7a,0x8a5a10,0x2a5a2a].map(e=>winGlass(cutCircle(phong({color:0x120c0a,emissive:e,specular:0x666666,shininess:50})),3,1,e)):stain;
 let rs=7;const rnd=()=>(rs=(rs*16807)%2147483647)/2147483647;
 // 23.11.2026 (autor: spojnosc budynkow): stare kamienice (HOUSES) skladane tym samym zestawem co nowe; na domach z kopula plaski taras pod beben
 const DM=(B,k)=>DOMES.filter(([x,z,r,kk])=>kk===k&&x>B.x&&x<B.x+B.w&&z>B.y&&z<B.y+B.h);
 const BIG=[[CATH.x,CATH.y,CATH.w,CATH.h,'katedra','S',{towers:DM(CATH,'c').filter(d=>d[2]<3)}],[PALACE.x,PALACE.y,PALACE.w,PALACE.h,'palac','S',{}],[CHAPEL.x,CHAPEL.y,CHAPEL.w,CHAPEL.h,'kaplica2','S',{}]];
 const SH=SHACKS.map((B,k)=>[...B,'buda',(k*7)%3===0?'N':'S',{k}]).filter(e=>!(W.heriClear&&W.heriClear.includes(e[6].k)));
 const LIST=BIG.concat(SH).concat(ZL_NOWE.map(B=>[...B,{}])).concat(HOUSES.map((B,i)=>[...B,'kamienica','S',{dome:DOMES.some(([x,z,r,k])=>k==='h'&&x>B[0]&&x<B[0]+B[2]&&z>B[1]&&z<B[1]+B[3]),door:![2,5,6].includes(i)}]));
 if(W.heriHouse){const h=W.heriHouse;LIST.push([h.x,h.y,h.w,h.h,'heri','S',{world:1,door:h.door}])}
 const grps=[];
 for(const [gx,gy,gw,gh,kind,face,opt] of LIST){
  const B=opt.world?{x:gx,y:gy,w:gw,h:gh}:SR({x:gx,y:gy,w:gw,h:gh}),side=face==='E'||face==='W',W=side?B.h:B.w,D=side?B.w:B.h;
  const grp=new THREE.Group();grp.position.set(B.x+B.w/2,0,B.y+B.h/2);grp.rotation.y={S:0,E:Math.PI/2,N:Math.PI,W:-Math.PI/2}[face]||0;ROOT.add(grp);grps.push(grp);if(['wykusz','podcien','naroznik'].includes(kind))grp.scale.y=.75;
  const add=(g,m,x,y,z,ry)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);if(ry)o.rotation.y=ry;o.castShadow=o.receiveShadow=true;grp.add(o);return o};
  const box=(w,h,d,m,x,y0,z,ry)=>add(new THREE.BoxGeometry(w,h,d),m,x,y0+h/2,z,ry);
  // okno: kamienna opaska + szyba (czesc swieci cieplo); ry obraca na sciane boczna
  const win=(x,y,z,ry,w=.62,h=1.05)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry||0;grp.add(g);
   const f=new THREE.Mesh(new THREE.BoxGeometry(w+.22,h+.22,.1),stone);f.position.z=.03;const lit=rnd()<.35,q=new THREE.Mesh(new THREE.BoxGeometry(w,h,.08),lit?glassL:glassD);q.position.z=.07;if(lit&&NB_WIN){const s=new THREE.Mesh(new THREE.PlaneGeometry(w*2.3,h*1.9),winSpillMat());s.position.set(0,-h*.22,.14);g.add(s)}
   const sill=new THREE.Mesh(new THREE.BoxGeometry(w+.34,.09,.2),stone);sill.position.set(0,-h/2-.12,.08);g.add(f,q,sill)};
  const door=(x,z,ry,w=1.05,h=1.95)=>{const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry||0;grp.add(g);
   const fr=new THREE.Mesh(new THREE.BoxGeometry(w+.36,h+.28,.14),stoneD);fr.position.set(0,(h+.28)/2,.04);const d=new THREE.Mesh(new THREE.BoxGeometry(w,h,.1),wood);d.position.set(0,h/2,.1);
   const ring=new THREE.Mesh(new THREE.TorusGeometry(.07,.02,4,8),iron);ring.position.set(w*.28,h*.5,.17);g.add(fr,d,ring);return g};
  // dach dwuspadowy: kalenica wzdluz osi z (alongZ) albo x; szczyty z materialu sciany
  const gable=(w,d,base,rise,alongZ,roofM,wallM,oh=.32)=>{const L=(alongZ?d:w)/2+oh,Bx=(alongZ?w:d)/2,E=Bx+oh,dy=oh*rise/Bx;
   const P=(a,b,y)=>alongZ?[b,y,a]:[a,y,b],pts=[];const tri=otri(pts);
   for(const sg of [1,-1]){const r0=P(-L,0,base+rise),r1=P(L,0,base+rise),e0=P(-L,sg*E,base-dy),e1=P(L,sg*E,base-dy),wd=P(0,sg,1);tri(r0,e0,e1,wd);tri(r0,e1,r1,wd)}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.computeVertexNormals();add(g,roofM,0,0,0);
   const t=[],tt=otri(t);for(const a of [-(L-oh),L-oh]){tt(P(a,-Bx,base),P(a,Bx,base),P(a,0,base+rise),P(Math.sign(a),0,0))}
   const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(t,3));gg.computeVertexNormals();const gm=add(gg,wallM,0,0,0);gm.material=wallM;
   const ridge=new THREE.Mesh(new THREE.BoxGeometry(alongZ?.16:L*2,.14,alongZ?L*2:.16),stoneD);ridge.position.y=base+rise+.04;grp.add(ridge)};
  // dach czterospadowy (naroznik)
  const hip=(w,d,base,rise,roofM,oh=.32)=>{const sw=d>w;if(sw){const t=w;w=d;d=t}const a=w/2+oh,b=d/2+oh,k=Math.max(0,a-b),pts=[],tri=(p,q,r)=>pts.push(...p,...q,...r),T=base+rise,dy=oh*rise/Math.min(w,d)*2,y0=base-dy;
   const r0=[-k,T,0],r1=[k,T,0],c=[[-a,y0,-b],[a,y0,-b],[a,y0,b],[-a,y0,b]];
   tri(r0,c[3],c[2]);tri(r0,c[2],r1);tri(r1,c[1],c[0]);tri(r1,c[0],r0);tri(r1,c[2],c[1]);tri(r0,c[0],c[3]);
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));g.computeVertexNormals();const hm=add(g,roofM,0,0,0);if(sw)hm.rotation.y=Math.PI/2;return hm};
  function otri(arr){return(p,q,r,want)=>{const ux=q[0]-p[0],uy=q[1]-p[1],uz=q[2]-p[2],vx=r[0]-p[0],vy=r[1]-p[1],vz=r[2]-p[2],nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
   if(nx*want[0]+ny*want[1]+nz*want[2]<0)arr.push(...p,...r,...q);else arr.push(...p,...q,...r)}}
  const cornice=(w,d,y)=>box(w+.24,.2,d+.24,stoneD,0,y,0);
  /* fasada: pilastry miedzy osiami okien, okna w rzedach; skip(t,y) pomija okno (np. nad drzwiami) */
  const fac=(len,pos,ry,rows,E0,o)=>{o=o||{};const k=Math.max(2,Math.round(len/(o.step||1.8)));for(let i=0;i<k;i++){const t=-len/2+len*(i+.5)/k;
    if(i>0&&o.pil!==false){const [px,pz]=pos(-len/2+len*i/k,.04);box(o.pw||.32,E0-(o.p0||1.0),.12,o.pm||stoneD,px,o.p0||.9,pz,ry)}
    for(const y of rows){if(o.skip&&o.skip(t,y))continue;const [wx,wz]=pos(t,0);if(o.lancet)lancet(wx,y,wz,ry,o.lw||.55,o.lh||2.2);else win(wx,y,wz,ry,o.ww||.55,o.wh||.92)}}};
  const lancet=(x,y,z,ry,w,h)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry||0;grp.add(g);
   const f=new THREE.Mesh(new THREE.BoxGeometry(w+.3,h+.25,.12),stoneD);f.position.z=.04;const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,.08),stain[(rnd()*4)|0]);q.position.z=.08;
   const tp=new THREE.Mesh(new THREE.BoxGeometry(w*.72,w*.72,.1),stoneD);tp.position.set(0,h/2+.08,.05);tp.rotation.z=Math.PI/4;const tq=new THREE.Mesh(new THREE.BoxGeometry(w*.5,w*.5,.08),q.material);tq.position.set(0,h/2+.08,.09);tq.rotation.z=Math.PI/4;g.add(f,q,tp,tq)};
  const F=(t,o)=>[t,D/2+o-.02],Bk=(t,o)=>[-t,-D/2-o+.02],Rt=(t,o)=>[W/2+o-.02,-t],Lt=(t,o)=>[-W/2-o+.02,t];
  if(kind==='katedra'){/* bazylika: kamienny korpus ze szkarpami i witrazami, fasada z portalem i rozeta, wieze pod bocznymi kopulami, dach z miedzi */
   const E=6.2;box(W,1.2,D,stoneD,0,0,0);box(W-.2,E-1.2,D-.2,stone,0,1.2,0);cornice(W,D,E-.1);
   const butt=(pos,ry,len)=>{const k=Math.max(2,Math.round(len/3.4));for(let i=1;i<k;i++){const [x,z]=pos(-len/2+len*i/k,.45);box(.8,E-1.6,.9,stoneD,x,0,z,ry);const [x2,z2]=pos(-len/2+len*i/k,.3);box(.7,1.0,.6,stoneD,x2,E-1.6,z2,ry)}};
   butt(Bk,Math.PI,W);butt(Rt,Math.PI/2,D);butt(Lt,-Math.PI/2,D);butt(F,0,W);
   const gateX=Math.min(5.2,W*.2),skipF=(t,y)=>Math.abs(t)<gateX;
   fac(W,F,0,[3.3],E,{pil:false,lancet:true,step:3.4,skip:skipF});fac(W,Bk,Math.PI,[3.3],E,{pil:false,lancet:true,step:3.4});fac(D,Rt,Math.PI/2,[3.3],E,{pil:false,lancet:true,step:3.4});fac(D,Lt,-Math.PI/2,[3.3],E,{pil:false,lancet:true,step:3.4});
   for(const sg of [-1,1]){box(.9,E+.4,.9,stoneD,sg*3.0,0,D/2+.25);box(1.1,.3,1.1,stoneD,sg*3.0,E+.4,D/2+.25)}
   add(new THREE.TorusGeometry(2.4,.32,8,20,Math.PI),stoneD,0,3.6,D/2+.3);
   box(8.4,1.5,.8,stone,0,E,D/2-.3);box(6.0,1.3,.8,stone,0,E+1.5,D/2-.3);box(3.4,1.1,.8,stone,0,E+2.8,D/2-.3);for(const y of [E+1.5,E+2.8,E+3.9])box(y<E+2?8.6:y<E+3?6.2:3.6,.16,.9,stoneD,0,y-.02,D/2-.3);
   add(new THREE.TorusGeometry(1.0,.16,8,20),stoneD,0,E+1.5,D/2+.12);add(new THREE.CircleGeometry(.92,20),roseS[1],0,E+1.5,D/2+.11);for(let i=0;i<6;i++){const sp=add(new THREE.BoxGeometry(.06,1.8,.06),stoneD,0,E+1.5,D/2+.13);sp.rotation.z=i*Math.PI/6}
   add(new THREE.BoxGeometry(.14,.9,.14),gold,0,E+4.35,D/2-.3);add(new THREE.BoxGeometry(.55,.14,.14),gold,0,E+4.5,D/2-.3);
   for(let i=0;i<3;i++)box(11-i*1.2,.16,.55,stoneD,0,i*.16,D/2+.25+(2-i)*.5);
   hip(W-.1,D-.1,E+.08,1.6,copper);
   for(const [x,z,r] of opt.towers){const tx=MP(x)-(B.x+B.w/2),tz=MP(z)-(B.y+B.h/2),s=Math.max(3.6,r*MK*2.05);box(s,9.0,s,stone,tx,0,tz);box(s+.3,.32,s+.3,stoneD,tx,8.85,tz);box(s+.2,.24,s+.2,stoneD,tx,E-.1,tz);
    for(const [a,dx,dz] of [[0,0,s/2],[Math.PI,0,-s/2],[Math.PI/2,s/2,0],[-Math.PI/2,-s/2,0]])lancet(tx+dx,7.4,tz+dz,a,.42,1.3)}
  }else if(kind==='palac'){/* palac: dlugi korpus, ryzality srodkowy i narozne, trzy rzedy okien, dach z miedzi */
   const E=6.0,rc=Math.min(9,W*.2),rs=Math.min(5,W*.12);box(W,1.0,D,stoneD,0,0,0);box(W-.1,E-1,D-.1,plaster,0,1,0);cornice(W,D,E-.1);
   const rows=[1.7,3.2,4.7];fac(W,F,0,rows,E,{skip:(t,y)=>Math.abs(t)<rc/2+.2||Math.abs(t)>W/2-rs-.1});fac(W,Bk,Math.PI,rows,E);fac(D,Rt,Math.PI/2,rows,E);fac(D,Lt,-Math.PI/2,rows,E);
   box(rc,E+.9,D+.9,plaster,0,0,.45);box(rc+.3,.9,D+1.2,stoneD,0,0,.45);box(rc+.3,.22,D+1.2,stoneD,0,E+.8,.45);
   for(const y of [1.7,3.2,4.7])for(const x of [-rc/3,0,rc/3])if(!(y<2.5&&x===0))win(x,y,D/2+.88,0,.6,1.0);
   for(const x of [-rc/2+.3,rc/2-.3])box(.4,E-.2,.16,stoneD,x,.9,D/2+.92);
   {const g0=grp.children.length;gable(rc+.2,1.0,E+.95,1.3,true,stoneD,plaster,.1);for(let i=g0;i<grp.children.length;i++){grp.children[i].position.z+=D/2+.45}}
   for(const sg of [-1,1]){const x=sg*(W/2-rs/2);box(rs,E+.5,D+.5,plaster,x,0,.25);box(rs+.3,.9,D+.8,stoneD,x,0,.25);box(rs+.3,.22,D+.8,stoneD,x,E+.4,.25);for(const y of rows)for(const xx of [-rs/4,rs/4])win(x+xx,y,D/2+.48,0,.55,.95);hip(rs+.2,D+.7,E+.62,1.6,copper).position.set(x,0,.25)}
   door(0,D/2+.88,0,1.5,2.4);for(let i=0;i<3;i++)box(rc-1-i*.6,.15,.5,stoneD,0,i*.15,D/2+1.0+(2-i)*.45);
   hip(W-rs*2,D-.1,E+.05,1.7,copper);
  }else if(kind==='kaplica2'){/* kaplica ubogich: kamien i tynk, witraze, portal z rozeta, taras pod kopula */
   const E=4.4;box(W,1.1,D,stoneD,0,0,0);box(W-.1,E-1.1,D-.1,plaster,0,1.1,0);cornice(W,D,E-.1);
   for(const sx of [-1,1])for(const sz of [-1,1])box(.8,E-.8,.8,stoneD,sx*(W/2-.1),0,sz*(D/2-.1));
   fac(D,Rt,Math.PI/2,[2.4],E,{pil:false,lancet:true,step:2.6,lh:1.7});fac(D,Lt,-Math.PI/2,[2.4],E,{pil:false,lancet:true,step:2.6,lh:1.7});fac(W,Bk,Math.PI,[2.4],E,{pil:false,lancet:true,step:3,lh:1.7});
   door(0,D/2-.02,0,1.2,2.2);add(new THREE.TorusGeometry(.82,.18,6,14,Math.PI),stoneD,0,2.25,D/2+.05);add(new THREE.TorusGeometry(.45,.1,6,16),stoneD,0,3.55,D/2+.04);add(new THREE.CircleGeometry(.4,16),roseS[2],0,3.55,D/2+.03);
   box(W+.1,.25,D+.1,stoneD,0,E,0);for(const [w2,d2,x,z] of [[W,.28,0,D/2-.14],[W,.28,0,-D/2+.14],[.28,D,W/2-.14,0],[.28,D,-W/2+.14,0]]){box(w2,.5,d2,plaster,x,E+.25,z);box(w2+.06,.09,d2+.06,stoneD,x,E+.75,z)}
  }else if(kind==='buda'){/* buda w slumsach: deski z debu portowego na kamiennej podmurowce, dach z latanych desek, drzwi, okienko z okiennica */
   const E=2.4+rnd()*.4;box(W,.3,D,stoneD,0,0,0);box(W-.06,E-.3,D-.06,oak,0,.3,0);box(W+.1,.12,D+.1,wood,0,E-.06,0);
   for(const sx of [-1,1])for(const sz of [-1,1])box(.18,E+.1,.18,wood,sx*(W/2-.04),0,sz*(D/2-.04));
   const dx=(rnd()-.5)*W*.4;door(dx,D/2-.02,0,.85,1.75);const wx=dx>0?dx-1.5:dx+1.5;if(Math.abs(wx)<W/2-.6){win(wx,1.3,D/2-.02,0,.45,.45);box(.26,.55,.04,wood,wx-.42,1.3-.27,D/2+.06)}
   if(rnd()<.6){const pw=.6+rnd()*.8;box(pw,.5+rnd()*.5,.05,wood,(rnd()-.5)*(W-1.4),.5+rnd()*.8,-D/2-.02)}
   const along=W>=D;gable(W,D,E,1.0+rnd()*.3,!along,patch,oak,.28);
   if(rnd()<.5)box(.55,.55,.55,wood,W/2-.5,0,D/2+.5,.3);
  }else if(kind==='kamienica'){const E=4.6;box(W,1.45,D,stone,0,0,0);box(W+.06,.16,D+.06,stoneD,0,1.4,0);box(W-.1,E-1.45,D-.1,plaster,0,1.45,0);cornice(W,D,E-.1);
   for(const sx of [-1,1])for(const sz of [-1,1])for(let i=0;i<5;i++){const big=i%2===0;box(big?.6:.42,.4,big?.42:.6,stoneD,sx*(W/2-.17),1.0+i*.72,sz*(D/2-.17))}
   const faceW=(len,pos,ry,front)=>{const k=Math.max(2,Math.round(len/1.8));for(let i=0;i<k;i++){const t=-len/2+len*(i+.5)/k;
     if(i>0){const [px,pz]=pos(-len/2+len*i/k,.04);box(.32,E-1.0,.12,stoneD,px,.9,pz,ry)}
     for(const y of [1.85,3.35]){if(front&&opt.door&&y<2.5&&Math.abs(t)<len/k*.6)continue;const [wx,wz]=pos(t,0);win(wx,y,wz,ry,.55,.92)}}};
   faceW(W,(t,o)=>[t,D/2+o-.02],0,true);faceW(W,(t,o)=>[-t,-D/2-o+.02],Math.PI,false);faceW(D,(t,o)=>[W/2+o-.02,-t],Math.PI/2,false);faceW(D,(t,o)=>[-W/2-o+.02,t],-Math.PI/2,false);
   if(opt.door)door(0,D/2-.02,0,1.1,2.0);
   if(opt.dome){box(W+.1,.25,D+.1,stoneD,0,E,0);for(const [w2,d2,x,z] of [[W,.28,0,D/2-.14],[W,.28,0,-D/2+.14],[.28,D,W/2-.14,0],[.28,D,-W/2+.14,0]]){box(w2,.5,d2,plaster,x,E+.25,z);box(w2+.06,.09,d2+.06,stoneD,x,E+.75,z)}}
   else hip(W,D,E+.05,2.3,tiles);
  }else if(kind==='heri'){/* dom Heriego: kamien + tynk, waskie drzwi od frontu, dach znika, gdy bohater jest blisko */
   const Hw=3.4,dl=opt.door[0]+.5-(B.x+B.w/2),wl=(w,d,x,z)=>{box(w,1.1,d,stone,x,0,z);box(w-.04,Hw-1.1,d-.04,plaster,x,1.1,z);box(w+.08,.18,d+.08,stoneD,x,Hw,z)};
   wl(W,1,0,-D/2+.5);wl(1,D-2,-W/2+.5,0);wl(1,D-2,W/2-.5,0);const L1=dl-.5+W/2,L2=W/2-dl-.5;if(L1>.05)wl(L1,1,-W/2+L1/2,D/2-.5);if(L2>.05)wl(L2,1,W/2-L2/2,D/2-.5);
   box(1,Hw-2.3,1,plaster,dl,2.3,D/2-.5);box(1.08,.18,1.08,stoneD,dl,Hw,D/2-.5);for(const sg of [-1,1])box(.2,2.3,1.04,stoneD,dl+sg*.41,0,D/2-.5);
   add(new THREE.TorusGeometry(.33,.09,6,12,Math.PI),stoneD,dl,1.98,D/2+.02);box(.16,.24,.14,stoneD,dl,2.26,D/2+.05);box(.95,.08,.5,stoneD,dl,0,D/2+.22);
   box(.06,2.0,.6,wood,dl-.29,0,D/2-1.32);add(new THREE.TorusGeometry(.05,.015,4,8),iron,dl-.25,1.0,D/2-1.5,Math.PI/2);
   for(const [x,z,ry] of [[-W/2+1.9,D/2-.02,0],[W/2-1.8,D/2-.02,0],[W/2-.02,0,Math.PI/2],[-W/2+.02,0,-Math.PI/2]])win(x,2.0,z,ry,.55,.85);
   box(.05,.05,.45,iron,dl+.85,2.45,D/2+.22);box(.03,.22,.03,iron,dl+.85,2.25,D/2+.43);add(new THREE.BoxGeometry(.2,.28,.2),glassL,dl+.85,2.05,D/2+.43);box(.24,.05,.24,iron,dl+.85,2.2,D/2+.43);
   const red=cutCircle(phong({color:0x7a1e1a,side:THREE.DoubleSide}));box(.72,1.35,.04,red,dl-1.35,1.1,D/2+.05);box(.86,.05,.05,gold,dl-1.35,2.47,D/2+.08);add(new THREE.CylinderGeometry(.17,.17,.03,14),gold,dl-1.35,1.95,D/2+.09).rotation.x=Math.PI/2;
   for(let i=0;i<3;i++)add(new THREE.ConeGeometry(.12,.22,3),red,dl-1.35-.24+i*.24,1.0,D/2+.05).rotation.x=Math.PI;
   /* wnetrze: palenisko, prycza, stol, stojak z bronia */
   box(1.5,1.25,.55,stoneD,2.6,0,-D/2+1.27);box(.8,.6,.2,cutCircle(phong({color:0x120806,emissive:0x5a1e06})),2.6,.1,-D/2+1.5);box(1.7,.12,.65,stoneD,2.6,1.25,-D/2+1.27);
   box(1.8,.3,.8,wood,.2,0,-D/2+1.45);box(1.6,.1,.65,red,.2,.3,-D/2+1.45);
   box(1.0,.06,.62,wood,2.4,.74,.5);for(const [lx,lz] of [[-.42,-.24],[.42,-.24],[-.42,.24],[.42,.24]])box(.07,.74,.07,wood,2.4+lx,0,.5+lz);box(.4,.45,.4,wood,1.6,0,.6);
   box(.08,1.7,.08,wood,-W/2+1.2,0,-.2);box(.08,1.7,.08,wood,-W/2+1.2,0,.9);box(.08,.08,1.2,wood,-W/2+1.2,1.4,.35);
   for(let i=0;i<3;i++){add(new THREE.CylinderGeometry(.03,.03,2.0,6),wood,-W/2+1.25,1.0,-.05+i*.35);add(new THREE.ConeGeometry(.06,.25,4),iron,-W/2+1.25,2.1,-.05+i*.35)}
   add(new THREE.CylinderGeometry(.36,.36,.06,16),red,-W/2+1.13,.75,.35).rotation.z=Math.PI/2;
   /* dach osobno (przezroczysty, znika przy bohaterze) */
   const T=o=>{const m=o;m.transparent=true;m.opacity=1;return m},rTile=T(worldSurfN(cutCircle(phong({color:0xc4b4a6,side:THREE.DoubleSide})),'tgm3_dachowka_gliniana',1.3,1)),
    rCop=T(worldSurfN(cutCircle(phong({color:0xf4f8f6,side:THREE.DoubleSide,specular:0x5a7a70,shininess:26})),'tzl1_miedz_patynowana',1.5,1)),rSt=T(worldSurfN(cutCircle(phong({color:0xa89e92})),'tgm2_mur_kamienny',1.1,1));
   const g0=grp.children.length;hip(W+.1,D+.1,Hw+.12,2.1,rTile);box(.7,1.3,.7,rSt,2.6,Hw+.8,-D/2+1.27);add(new THREE.CylinderGeometry(.5,.55,.6,8),rSt,-.6,Hw+2.0,0);add(new THREE.ConeGeometry(.62,.9,8),rCop,-.6,Hw+2.75,0);add(new THREE.SphereGeometry(.07,8,6),gold,-.6,Hw+3.25,0);
   const roofG=new THREE.Group();roofG.position.copy(grp.position);ROOT.add(roofG);for(const o of grp.children.slice(g0))roofG.add(o);
   WR.roofs=(WR.roofs||[]).concat([{x:B.x-2.5,y:B.y-2.5,w:B.w+5,h:B.h+4.5,mesh:roofG,mats:[rTile,rCop,rSt],a:1}]);
  }else if(kind==='wykusz'){// kamienica z wykuszem: okap do ulicy, wykusz na pietrze nad chodnikiem
   box(W,.9,D,stone,0,0,0);box(W-.1,5.2,D-.1,plaster,0,.9,0);cornice(W,D,6.0);gable(W,D,6.2,2.3,false,tiles,plaster);
   door(-W/4,D/2-.04);win(W/4,1.55,D/2-.02,0);const ox=.7,ow=2.3,od=.85;
   for(const y of [3.1,4.7])win(-W/2+1.05,y,D/2-.02,0);for(const y of [3.1,4.7])for(const x of [-W/2+1.05,0,W/2-1.05])win(x,y,-D/2+.02,Math.PI);
   box(ow,2.5,od,plaster,ox,2.45,D/2+od/2-.05);box(ow+.18,.16,od+.12,stoneD,ox,2.35,D/2+od/2-.02);box(ow+.18,.16,od+.12,stoneD,ox,4.95,D/2+od/2-.02);
   const cor=add(new THREE.CylinderGeometry(.95,.12,.95,4),stone,ox,1.9,D/2+.28,Math.PI/4);cor.scale.set(1.25,1,.62);
   const cap=add(new THREE.CylinderGeometry(.08,.98,.7,4),copper,ox,5.45,D/2+od/2-.05,Math.PI/4);cap.scale.set(1.25,1,.68);
   const bal=add(new THREE.SphereGeometry(.09,8,6),gold,ox,5.86,D/2+od/2-.05);
   for(const x of [ox-.55,ox+.55])win(x,3.7,D/2+od-.02,0,.5,1.1);for(const sg of [-1,1])win(ox+sg*(ow/2-.02),3.7,D/2+od/2-.05,sg*Math.PI/2,.38,1.1);
  }else if(kind==='podcien'){// waska kamienica z podcieniem: parter cofniety, pietra wsparte na arkadzie
   const ad=Math.min(1.75,D*.36),zb=D/2-ad;box(W-.2,2.7,D-ad,stone,0,0,-ad/2);box(W,3.6,D,plaster,0,2.7,0);box(W+.12,.2,D+.12,stoneD,0,2.6,0);cornice(W,D,6.2);
   gable(W,D,6.35,2.9,true,tiles,plaster);
   for(const sx of [-1,1]){for(const z of [D/2-.3,zb+.25]){box(.55,2.7,.55,stone,sx*(W/2-.3),0,z);box(.72,.22,.72,stoneD,sx*(W/2-.3),2.5,z);box(.7,.22,.7,stoneD,sx*(W/2-.3),0,z)}
    const sa=add(new THREE.TorusGeometry((ad-.8)/2,.14,6,12,Math.PI),stoneD,sx*(W/2-.3),2.45-(ad-.8)/2*.7,(D/2-.3+zb+.25)/2,Math.PI/2);sa.scale.y=.7}
   const R=(W-1.15)/2,ar=add(new THREE.TorusGeometry(R,.17,6,18,Math.PI),stoneD,0,2.55-R*.55,D/2-.3);ar.scale.y=.55;
   door(-.65,zb+.02,0,.95,1.9);win(.95,1.4,zb+.02,0,.9,.95);
   for(const y of [3.45,5.0])for(const x of [-.95,.95])win(x,y,D/2-.02,0);win(0,7.1,D/2+.02,0,.42,.6);
  }else if(kind==='naroznik'){// narozna kamienica: wysoka piwnica, schody zewnetrzne na pietro, wiezyczka na narozu
   const sw=Math.min(1.7,W*.22),Wb=W-sw,cx=-sw/2;
   
   box(Wb,1.3,D,stone,cx,0,0);box(Wb-.1,5.0,D-.1,plaster,cx,1.3,0);cornice(Wb,D,6.2).position.x=cx;
   {const g0=grp.children.length;hip(Wb,D,6.4,2.4,tiles);for(let i=g0;i<grp.children.length;i++)grp.children[i].position.x+=cx}
   for(const [qx,qz] of [[cx-Wb/2,D/2],[cx+Wb/2,D/2],[cx-Wb/2,-D/2],[cx+Wb/2,-D/2]])for(let i=0;i<7;i++){const big=i%2===0;box(big?.62:.46,.42,big?.46:.62,stoneD,qx+(qx>cx?-.18:.18),1.3+i*.7,qz+(qz>0?-.18:.18))}
   for(const y of [2.2,3.7,5.2])for(const x of [cx-Wb/2+1.3,cx,cx+Wb/2-1.3])if(!(y<3&&x===cx))win(x,y,D/2-.02,0);door(cx,D/2-.02,0);
   for(const y of [3.7,5.2])for(const z of [-.9,.9])win(cx+Wb/2+.02,y,z,Math.PI/2);
   const tx=cx-Wb/2+.35,tz=D/2-.35;add(new THREE.CylinderGeometry(.85,.85,3.5,14),plaster,tx,4.55,tz);add(new THREE.CylinderGeometry(.9,.3,.9,14),stone,tx,2.35,tz);
   add(new THREE.CylinderGeometry(.92,.92,.18,14),stoneD,tx,6.35,tz);add(new THREE.ConeGeometry(1.0,1.9,14),copper,tx,7.4,tz);add(new THREE.SphereGeometry(.1,8,6),gold,tx,8.4,tz);
   for(const a of [.3,1.4])win(tx+Math.sin(a)*.86,4.6,tz+Math.cos(a)*.86,a,.4,.95);
   const sx=W/2-sw/2,n=8,run=(D-1.5)/n,rise=1.3/n;
   for(let i=0;i<n;i++)box(sw-.15,rise*(i+1),run+.02,stone,sx,0,D/2-run*(i+.5));box(sw-.15,1.3,1.5,stone,sx,0,-D/2+.75);
   door(Wb/2+cx+.02,-D/2+.75,Math.PI/2,.9,1.85).position.y=1.3;
   for(let i=0;i<=n;i+=2){const z=D/2-run*i-.1,h=.9;box(.07,h,.07,iron,W/2-.12,rise*i,z)}box(.07,.9,.07,iron,W/2-.12,1.3,-D/2+.15);
   {const L=Math.hypot(D-1.5,1.3),rl=add(new THREE.BoxGeometry(.06,.06,L),iron,W/2-.12,1.3/2+.9,(D/2+(-D/2+1.5))/2);rl.rotation.x=Math.atan2(1.3,D-1.5)}
   box(.06,.06,1.5,iron,W/2-.12,2.2,-D/2+.75);
  }else if(kind==='kaplica'){// mala kaplica: kamienna nawa, absyda, sygnaturka z cebulasta kopulka
   const Wn=W-.5,ra=Wn/2,z0=-D/2+ra+.05,Ln=D/2-z0,zc=(z0+D/2)/2;
   box(Wn,4.0,Ln,stone,0,0,zc);box(Wn+.3,.5,Ln+.15,stoneD,0,0,zc);cornice(Wn,Ln,4.0).position.z=zc;
   add(new THREE.CylinderGeometry(ra,ra,4.0,18,1,false,Math.PI/2,Math.PI),stone,0,2.0,z0);add(new THREE.CylinderGeometry(ra+.12,ra+.12,.5,18,1,false,Math.PI/2,Math.PI),stoneD,0,.25,z0);
   add(new THREE.ConeGeometry(ra+.25,1.7,18,1,true,Math.PI/2,Math.PI),copper,0,4.0+.85,z0);
   {const g0=grp.children.length;gable(Wn,Ln,4.15,2.3,true,copper,stone);for(let i=g0;i<grp.children.length;i++)grp.children[i].position.z+=zc}
   for(const sg of [-1,1])for(const z of [z0+.4,zc,D/2-.5]){box(.45,2.6,.6,stoneD,sg*(Wn/2+.18),0,z);const t=add(new THREE.BoxGeometry(.45,.5,.6),stoneD,sg*(Wn/2+.12),2.75,z);t.rotation.z=sg*.5}
   for(const sg of [-1,1])for(const z of [z0+1.4,zc+1.2])win(sg*(Wn/2+.02),2.1,z,sg*Math.PI/2,.34,1.5);
   door(0,D/2-.02,0,1.15,2.2);const arc=add(new THREE.TorusGeometry(.75,.16,6,14,Math.PI),stoneD,0,2.3,D/2+.06);
   const rose=add(new THREE.TorusGeometry(.42,.1,6,16),stoneD,0,4.85,D/2+.08);add(new THREE.CircleGeometry(.38,16),NB_WIN?roseS[1]:glassL,0,4.85,D/2+.05);
   const bz=D/2-1.1,bt=5.6;box(1.15,2.0,1.15,plaster,0,bt-.9,bz);box(1.3,.16,1.3,stoneD,0,bt+1.1,bz);for(const [a,x,z] of [[0,0,.585],[Math.PI,0,-.585],[Math.PI/2,.585,0],[-Math.PI/2,-.585,0]])win(x,bt+.55,bz+z,a,.36,.62);
   const pts=[[0,0],[.62,0],[.68,.12],[.74,.38],[.66,.66],[.44,.94],[.2,1.18],[.07,1.36],[.04,1.5],[0,1.56]].map(([a,b])=>new THREE.Vector2(a,b));
   const B2=bt+1.26;add(new THREE.LatheGeometry(pts,16),copper,0,B2,bz);add(new THREE.CylinderGeometry(.025,.025,.5,6),gold,0,B2+1.74,bz);add(new THREE.BoxGeometry(.3,.045,.045),gold,0,B2+1.84,bz);add(new THREE.SphereGeometry(.07,8,6),gold,0,B2+1.59,bz);
  }
 }
 /* scalenie statycznych brył po materiale: setki okien i detali w kilkanaście siatek */
 ROOT.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(ROOT.matrixWorld).invert(),mm=new THREE.Matrix4(),byM=new Map();
 for(const g of grps){g.traverse(o=>{if(!o.isMesh)return;const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();if(!geo.attributes.normal)geo.computeVertexNormals();geo.applyMatrix4(mm.multiplyMatrices(inv,o.matrixWorld));
   let e=byM.get(o.material);if(!e){const wu=o.material.userData&&o.material.userData.nbWin;e={p:[],n:[],u:wu?[]:null,s:wu?[]:null};byM.set(o.material,e)}const P=geo.attributes.position.array,N=geo.attributes.normal.array;for(let i=0;i<P.length;i++){e.p.push(P[i]);e.n.push(N[i])}
   if(e.u){const U=geo.attributes.uv,me=o.matrixWorld.elements,k=Math.sin(me[12]*12.9898+me[13]*4.1414+me[14]*78.233)*43758.5453,sd=.01+.98*(k-Math.floor(k));for(let i=0;i<P.length/3;i++){e.u.push(U?U.array[i*2]:0,U?U.array[i*2+1]:0);e.s.push(sd)}}geo.dispose()});ROOT.remove(g)}
 for(const [mat,e] of byM){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(e.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(e.n,3));if(e.u){g.setAttribute('uv',new THREE.Float32BufferAttribute(e.u,2));g.setAttribute('nbSeed',new THREE.Float32BufferAttribute(e.s,1))}const m=new THREE.Mesh(g,mat);m.castShadow=!mat.transparent;m.receiveShadow=true;ROOT.add(m)}
}
function buildStolica(I){planGround(3);
  const r=rng(313),fc=canvas(WW,WH),fg=fc.getContext('2d'),ZG=I.zl_ground,ZW=I.zl_walls,ZP=I.zl_props;
  // Z1 ground: r0 flagstones, r1 gold connectors, r2 cracked, r3 slum mud, r4 rot (0-3 animation, 4-7 edges), r5 blood cobbles, r6 monastery, r7 dead garden
  const SRC={50:[ZG,0],52:[ZG,2],53:[ZG,3],54:[ZG,3],55:[ZG,5],56:[ZG,6],57:[ZG,7],21:[ZG,2],58:[ZG,2],59:[ZG,3],22:[ZG,0],27:[ZG,0]};
  const gcode=(x,y)=>{let t=tileAt(x,y);if(t===31)t=W.under[y*MW+x]||50;return t};
  for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){const t=gcode(tx,ty);
    if(t===51){const N=gcode(tx,ty-1)===51,S_=gcode(tx,ty+1)===51,E=gcode(tx+1,ty)===51,Wt=gcode(tx-1,ty)===51;
      const col=N&&S_&&E&&Wt?2:N&&S_?1:E&&Wt?0:N&&E?3:E&&S_?4:S_&&Wt?5:N&&Wt?6:N||S_?1:0;groundTile(fg,ZG,col,1,tx,ty);continue}
    if(t===54){groundTile(fg,ZG,0,0,tx,ty);continue} // 12.11.2026: pod mazia zwykly bruk z sasiedztwa, kaluza ma miekki brzeg
    const s=SRC[t]||SRC[50];groundTile(fg,s[0],((r()*8)|0),s[1],tx,ty);
    if(t===21){fg.fillStyle='rgba(3,3,6,.6)';fg.fillRect(tx*16,ty*16,16,16)}}
  // Natural boundaries blend continuously in the atlas material.
  floorAO(fg,new Set([22,31,27]));
  groundDetails(fg);
  const floor=new THREE.Mesh(floorGeo,groundMaterial(phong({map:surfaceTex(fc),alphaTest:.5,color:0x9a8e90})));floor.position.set(MW/2,0,MH/2);floor.receiveShadow=true;ROOT.add(floor);
  // animated rot sludge on top of the pools (Z1 row 4, frames 0-3), faintly glowing
  W.rotTex=null;if(!lavaHD(I.cc0_lava,W.rots,.014,4,{color:0xc22a3a,emissive:0x6e0e1e,h:[.5,.035,.08],spd:.45,shin:70,spec:0x7a2030,soft:true})){
  W.rotFrames=[0,1,2,3].map(i=>tcut(ZG,i,4));W.rotC=canvas(64,64);W.rotG=W.rotC.getContext('2d');W.rotTex=texFrom(W.rotC,true);W.rotF=-1;
  const rGeo=new THREE.PlaneGeometry(1,1);rGeo.rotateX(-Math.PI/2);
  instanced(rGeo,liquidMat({map:W.rotTex,emissiveMap:W.rotTex,emissive:0x5a2a18,shininess:22,specular:0x30221a},1),W.rots,([x,y])=>M4.makeTranslation(x+.5,.012,y+.5),false,true)}
  // walls from Z2: r0-1 townhouse facades, r2 cathedral, r3 gold dome, r4 slate roof, r5 monastery brick, r6 shacks, r7 caps
  const stackE=(img,rows)=>{const size=16*(img.nbDensity||1),h=rows.length*size,c=canvas(size,h),g=c.getContext('2d');rows.forEach(([col,row],i)=>atlasDraw(g,img,col*16,row*16,16,16,0,i*size,size,size));
    const e=canvas(size,h),eg=e.getContext('2d'),d=g.getImageData(0,0,size,h).data,ed=eg.createImageData(size,h);
    // candle-lit windows and embers glow in the dark
    for(let i=0;i<d.length;i+=4){ed.data[i+3]=255;if(d[i]>=250&&d[i+1]<200&&d[i+2]<90){ed.data[i]=d[i];ed.data[i+1]=d[i+1];ed.data[i+2]=d[i+2]}}
    eg.putImageData(ed,0,0);return{map:surfaceTex(c,true),emissiveMap:surfaceTex(e,true),emissive:0xffffff}};
  const rc=()=>(r()*8)|0;
  const box=h=>{const g=new THREE.BoxGeometry(1,h,1);g.translate(0,h/2,0);return g};
  const capT=texFrom(tcut(ZW,3,4),true),capT2=texFrom(tcut(ZW,4,7),true);
  const addWalls=(list,h,side,cap,tint=0xffffff,trim=false)=>{if(!list.length)return;const sm=side.w?worldSurf(cutCircle(phong({color:tint})),side.w[0],side.w[1],'c'):cutCircle(phong(Object.assign({color:tint},side))),cm=cap&&cap.w?worldSurf(cutCircle(phong({color:tint})),cap.w[0],cap.w[1],'c'):cutCircle(phong({map:cap,color:tint}));const bg=depthWall(box(h),sm,3);
    instanced(bg,[sm,sm,cm,cm,sm,sm],list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
    // glebia: kamienny gzyms pod dachem i cokol przy ziemi, zeby budynek czytal sie jako bryla
    if(trim&&depthOn(3)&&I.wl_cap){const lg=new THREE.BoxGeometry(1.14,.24,1.14);lg.translate(0,h-.1,0);instanced(lg,worldSurf(cutCircle(phong({color:0xe4dccb})),I.wl_cap,2.2,'c'),list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));const pg=new THREE.BoxGeometry(1.1,.42,1.1);pg.translate(0,.21,0);instanced(pg,worldSurf(cutCircle(phong({color:0x8f887c})),I.wl_cap,2.2,'c'),list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5))}};
  const inB=(B,x,y)=>x>=B.x&&x<B.x+B.w&&y>=B.y&&y<B.y+B.h;
  const G={outer:[[],[]],house:[[],[],[],[]],cath:[[],[]],palace:[],chapel:[],mon:[[],[]],shack:[[],[]]};
  const ZLN=nbParam('zlnowe')!=='0'&&typeof OSADA_TX!=='undefined'?ZL_NOWE.concat(HOUSES,SHACKS,[[CATH.x,CATH.y,CATH.w,CATH.h],[PALACE.x,PALACE.y,PALACE.w,PALACE.h],[CHAPEL.x,CHAPEL.y,CHAPEL.w,CHAPEL.h]]).map(B=>SR({x:B[0],y:B[1],w:B[2],h:B[3]})):[];if(W.heriHouse)ZLN.push(W.heriHouse);// 23.11.2026: pola nowych modulow rysuje zlNoweBuild
  for(const [x,y,t] of walls){
    if(ZLN.some(B=>inB(B,x,y)))continue;
    if(t===21)G.outer[(x+y)&1].push([x,y]);
    else if(t===59)G.shack[(x*3+y)&1].push([x,y]);
    else if(inB(SR(CATH),x,y))G.cath[(x+y)&1].push([x,y]);else if(inB(SR(PALACE),x,y))G.palace.push([x,y]);else if(inB(SR(CHAPEL),x,y))G.chapel.push([x,y]);
    else if(GTX[x]>=43&&GTY[y]>=14&&GTY[y]<=32)G.mon[(x+y)&1].push([x,y]);
    else G.house[(x*7+y*3)%4].push([x,y])}
  const ws=(k,s)=>I[k]?{w:[I[k],s]}:null,WS=depthOn(3)?9:5; // glebia: wieksze okna na elewacjach
  G.outer.forEach(l=>addWalls(l,4,ws('wl_fort',4)||stackE(ZW,[[rc(),2],[rc(),2],[rc(),2],[rc(),2]]),ws('p3_wall_top',3)||ws('wl_cap',3)||capT2,0xb8b0a8));
  G.house.forEach((l,i)=>addWalls(l,3.2,ws(i%2?'wl_win':'wl_town',WS)||stackE(ZW,[[rc(),0],[rc(),1],[rc(),1]]),ws('p3_roof_lead',3)||ws('rf_gold',3)||capT,0xd8cdb8,true));
  G.cath.forEach(l=>addWalls(l,4,ws('wl_win',WS)||stackE(ZW,[[rc(),2],[rc(),2],[rc(),0],[rc(),2]]),ws('wl_cap',3)||capT,0xc8c0b0,true));
  addWalls(G.palace,4.5,ws('wl_town',WS)||stackE(ZW,[[rc(),2],[rc(),0],[rc(),1],[rc(),0],[rc(),2]]),ws('p3_roof_lead',3)||ws('rf_goldm',3)||capT,0xd8cdb8,true);
  addWalls(G.chapel,3,ws('wl_win',WS)||stackE(ZW,[[rc(),2],[rc(),2],[rc(),2]]),ws('p3_roof_lead',3)||ws('rf_gold',3)||capT,0xd8cdb8,true);
  G.mon.forEach(l=>addWalls(l,3,ws('wl_fort',4)||stackE(ZW,[[rc(),5],[rc(),5],[rc(),5]]),ws('p3_wall_top',3)||ws('wl_cap',3)||capT2));
  G.shack.forEach((l,i)=>addWalls(l,2.8,ws(i%2?'wl_win':'wl_town',5)||stackE(ZW,[[rc(),6],[rc(),6]]),ws('p3_roof_shack',3)||ws('rf_goldm',3)||texFrom(tcut(ZW,6,6),true),0xd8cdb8));
  if(ZLN.length&&typeof OSADA_TX!=='undefined')zlNoweBuild();
  // golden domes wrapped in the Z2 dome texture
  let goldT=texFrom(tcut(ZW,2,3),true);goldT.repeat.set(8,2);if(I.rf_goldm){goldT=wallTex(I.rf_goldm).clone();goldT.needsUpdate=true;goldT.repeat.set(5,2)}
  const goldM=cutCircle(phong({map:goldT,color:0x9a8a72,specular:0x7a6438,shininess:16,emissive:0x0a0602})/* 883: przygaszone (jaskrawsze od reszty miasta) */);
  const drumT=texFrom(tcut(ZW,3,2),true);drumT.repeat.set(8,1);const drumM=cutCircle(phong({map:drumT}));
  // 15.11.2026 (punkt centralny): tylko bazylika lsni czystym zlotem; kopuly kamienic, palacu i kaplicy sa zasniedziale, wiec glowna kopula jest jedynym jasnym akcentem mapy
  const agedM=typeof OSADA_TX!=='undefined'&&nbParam('kopuly')!=='0'?worldSurfN(cutCircle(phong({color:0x9c8e74,specular:0x3a3020,shininess:12})),'tzl2_zloto_patynowane',1.4,1):cutCircle(phong({map:goldT,color:0x857a68,specular:0x3a3020,shininess:9}));// 23.11.2026: tekstura autora (stare zlocenie), przygaszona wzgledem bazyliki
  const winM=winGlass(cutCircle(phong({color:0x000000,emissive:0xffaa52})),1,2);
  const dome=(x,z,rad,base,k)=>{const main=k==='c'&&rad>3,gm=k==='c'?goldM:agedM;
    const drum=new THREE.Mesh(new THREE.CylinderGeometry(rad*.98,rad,rad*.55,16),drumM);drum.position.set(x,base+rad*.275,z);
    const cup=new THREE.Mesh(new THREE.SphereGeometry(rad,16,7,0,Math.PI*2,0,Math.PI/2),gm);cup.position.set(x,base+rad*.55,z);
    const ring=new THREE.Mesh(new THREE.CylinderGeometry(rad*1.04,rad*1.04,.14,16),gm);ring.position.set(x,base+rad*.55,z);
    const lan=new THREE.Mesh(new THREE.CylinderGeometry(rad*.16,rad*.18,rad*.35,8),drumM);lan.position.set(x,base+rad*1.55+rad*.17,z);
    const spire=new THREE.Mesh(new THREE.ConeGeometry(rad*.2,rad*(main?.9:.55),8),gm);spire.position.set(x,base+rad*1.9+rad*(main?.45:.27),z);
    const parts=[drum,cup,ring,lan,spire];
    if(main){// okna bebna swieca, nad latarnia zlote slonce z promieniami
     for(let i=0;i<12;i++){const a=i*Math.PI/6,w=new THREE.Mesh(new THREE.PlaneGeometry(rad*.13,rad*.3),winM);w.position.set(x+Math.sin(a)*rad*.985,base+rad*.27,z+Math.cos(a)*rad*.985);w.rotation.y=a;parts.push(w)}
     const sun=new THREE.Mesh(new THREE.TorusGeometry(rad*.17,rad*.03,6,20),goldM);sun.position.set(x,base+rad*2.95,z);parts.push(sun);
     for(let i=0;i<8;i++){const ray=new THREE.Mesh(new THREE.BoxGeometry(rad*.025,rad*.12,rad*.025),goldM);const a=i*Math.PI/4;ray.position.set(x+Math.sin(a)*rad*.25,base+rad*2.95+Math.cos(a)*rad*.25,z);ray.rotation.z=-a;parts.push(ray)}}
    for(const m of parts){m.castShadow=true;m.receiveShadow=true;ROOT.add(m)}};
  /* 23.11.2026 (runda 871, autor): kopuly do podmiany na dachach poza bazylika: cebulasta z zasniedzialej miedzi i zebrowana z przygaszonego zlota z latarnia; bazylika zostaje jedynym jasnym zlotem */
  const copperM=worldSurfN(cutCircle(phong({color:0xffffff,specular:0x5a7a70,shininess:26})),'tzl1_miedz_patynowana',1.6,1),ribM=worldSurfN(cutCircle(phong({color:0xc8d0cc,specular:0x3a5a50,shininess:20})),'tzl1_miedz_patynowana',1.1,1);// 23.11.2026: patynowana miedz autora
  const onion=(x,z,rad,base)=>{const pts=[[0,0],[1,0],[1.06,.08],[1.16,.42],[1.08,.78],[.82,1.12],[.5,1.42],[.24,1.68],[.1,1.86],[.06,2.02],[0,2.1]].map(([a,b])=>new THREE.Vector2(a*rad*.86,b*rad*.9));
    const drum=new THREE.Mesh(new THREE.CylinderGeometry(rad*.86,rad*.9,rad*.5,16),drumM);drum.position.set(x,base+rad*.25,z);
    const bulb=new THREE.Mesh(new THREE.LatheGeometry(pts,18),copperM);bulb.position.set(x,base+rad*.5,z);
    const ring=new THREE.Mesh(new THREE.CylinderGeometry(rad*.9,rad*.9,.12,16),agedM);ring.position.set(x,base+rad*.5,z);
    const pin=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,rad*.55,6),agedM);pin.position.set(x,base+rad*.5+rad*1.89+rad*.27,z);
    const ball=new THREE.Mesh(new THREE.SphereGeometry(rad*.08,8,6),agedM);ball.position.set(x,base+rad*.5+rad*1.89+rad*.55,z);
    const cross=new THREE.Mesh(new THREE.BoxGeometry(rad*.28,.05,.05),agedM);cross.position.set(x,base+rad*.5+rad*1.89+rad*.42,z);
    for(const m of [drum,bulb,ring,pin,ball,cross]){m.castShadow=true;m.receiveShadow=true;ROOT.add(m)}};
  const ribbed=(x,z,rad,base)=>{const drum=new THREE.Mesh(new THREE.CylinderGeometry(rad*.95,rad,rad*.45,20),drumM);drum.position.set(x,base+rad*.225,z);
    const cup=new THREE.Mesh(new THREE.SphereGeometry(rad*.94,20,8,0,Math.PI*2,0,Math.PI/2),agedM);cup.position.set(x,base+rad*.45,z);cup.scale.y=.82;
    const parts=[drum,cup];for(let i=0;i<8;i++){const a=i*Math.PI/4,arc=new THREE.Mesh(new THREE.TorusGeometry(rad*.955,rad*.035,5,14,Math.PI/2),ribM);arc.position.set(x,base+rad*.45,z);arc.rotation.set(0,-a,0);arc.scale.set(1,.82,1);parts.push(arc)}
    const lan=new THREE.Mesh(new THREE.CylinderGeometry(rad*.17,rad*.2,rad*.42,8),drumM);lan.position.set(x,base+rad*.45+rad*.77+rad*.21,z);
    const lcap=new THREE.Mesh(new THREE.ConeGeometry(rad*.24,rad*.32,8),copperM);lcap.position.set(x,base+rad*.45+rad*.77+rad*.42+rad*.16,z);
    for(let i=0;i<8;i++){const a=i*Math.PI/4,w=new THREE.Mesh(new THREE.PlaneGeometry(rad*.07,rad*.18),winM);w.position.set(x+Math.sin(a)*rad*.172,base+rad*.45+rad*.77+rad*.21,z+Math.cos(a)*rad*.172);w.rotation.y=a;parts.push(w)}
    parts.push(lan,lcap);for(const m of parts){m.castShadow=true;m.receiveShadow=true;ROOT.add(m)}};
  const newDomes=nbParam('kopuly')!=='0';let di=0;
  for(const [x,z,rad,k] of DOMES){const KIT=ZLN.length&&typeof OSADA_TX!=='undefined',base=KIT?{c:rad>3?6.75:9.0,h:4.85,s:4.65,p:7.05}[k]:{c:4,h:3.2,s:3,p:4.5}[k];if(!newDomes||k==='c'){dome(MP(x),MP(z),rad*MK,base,k);continue}
   (k==='s'||(k==='h'&&di++%2===0)?onion:ribbed)(MP(x),MP(z),rad*MK,base)}
  // slate pyramid roofs and thatched shacks
  const slT=texFrom(tcut(ZW,1,4),true);slT.repeat.set(3,2);
  const slate=I.rf_gold?(()=>{const t=wallTex(I.rf_gold).clone();t.needsUpdate=true;t.repeat.set(3,2);return cutCircle(phong({map:t,flatShading:true}))})():cutCircle(phong({map:slT,flatShading:true})),thatch=cutCircle(phong({map:I.rf_goldm?(()=>{const t=wallTex(I.rf_goldm).clone();t.needsUpdate=true;t.repeat.set(2,2);return t})():texFrom(tcut(I.br_walls,1,5),true),color:I.rf_goldm?0xd8cdb8:0xb8a080,flatShading:true})),pyr=new THREE.ConeGeometry(Math.SQRT1_2,1,4);pyr.rotateY(Math.PI/4);
  // 12.11.2026: dachy dwuspadowe z dachowka i kalenica (tekstury p3_roof_*), wspolne UV liczone wzdluz polaci; bez tekstur zostaja stare piramidy
  const roofMats=new Map(),roofMat=key=>{if(!roofMats.has(key)){const map=wallTex(I[key]).clone();map.repeat.set(1,1);map.needsUpdate=true;roofMats.set(key,cutCircle(phong({map,color:0xffffff,shininess:3,specular:0x151515,flatShading:true})))}return roofMats.get(key)};
  const roofGeo=(pts,uvs)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs.flat(),2));g.computeVertexNormals();return g};
  const gable=(B,key,base0,rise0)=>{const {x,y,w,h}=SR({x:B[0],y:B[1],w:B[2],h:B[3]}),alongX=w>=h,length=(alongX?w:h)+.28,depth=(alongX?h:w)+.28,rise=rise0||2.2,base=base0||3.24,slope=Math.hypot(depth/2,rise),u=length/4.4,v=slope/4.4;
    const a=[-length/2,0,depth/2],b=[length/2,0,depth/2],c=[length/2,rise,0],d=[-length/2,rise,0],e=[length/2,0,-depth/2],f=[-length/2,0,-depth/2];
    const roof=new THREE.Mesh(roofGeo([a,b,c,a,c,d,e,f,d,e,d,c],[[0,0],[u,0],[u,v],[0,0],[u,v],[0,v],[0,0],[u,0],[u,v],[0,0],[u,v],[0,v]]),roofMat(key));roof.position.set(x+w/2,base,y+h/2);if(!alongX)roof.rotation.y=Math.PI/2;roof.castShadow=roof.receiveShadow=true;ROOT.add(roof);
    const endMat=I.wl_town?worldSurf(cutCircle(phong({color:0xc4bba9})),I.wl_town,5,'c'):cutCircle(phong({color:0x675e50})),em=new THREE.Mesh(roofGeo([f,a,d,b,e,c],[[0,0],[depth/4,0],[depth/8,rise/4],[0,0],[depth/4,0],[depth/8,rise/4]]),endMat);em.position.copy(roof.position);em.rotation.copy(roof.rotation);em.castShadow=em.receiveShadow=true;ROOT.add(em);
    const rg=new THREE.CylinderGeometry(.16,.16,length+.08,10,1,true,0,Math.PI),uv=rg.attributes.uv;for(let i=0;i<uv.count;i++){const cu=uv.getX(i),cv=uv.getY(i);uv.setXY(i,cv*(length+.08)/4,cu)}uv.needsUpdate=true;rg.rotateZ(Math.PI/2);
    const ridge=new THREE.Mesh(rg,roofMat('p3_roof_ridge'));ridge.position.copy(roof.position);ridge.position.y+=rise-.025;ridge.rotation.copy(roof.rotation);ridge.castShadow=ridge.receiveShadow=true;ROOT.add(ridge)};
  if(I.p3_roof_tile&&I.p3_roof_tile_gold&&I.p3_roof_ridge&&!(ZLN.length&&typeof OSADA_TX!=='undefined'))HOUSES.forEach((B,i)=>gable(B,[1,3,6].includes(i)?'p3_roof_tile_gold':'p3_roof_tile'));
  else for(const B of [[3,3,7,6],[3,12,7,6],[13,22,7,5],[55,3,6,7]]){const {x,y,w,h}=SR({x:B[0],y:B[1],w:B[2],h:B[3]});const m=new THREE.Mesh(pyr,slate);m.scale.set(w,2.2,h);m.position.set(x+w/2,3.2+1.1,y+h/2);m.castShadow=true;m.receiveShadow=true;ROOT.add(m)}
  for(const B of SHACKS){if(ZLN.length||W.heriClear&&W.heriClear.includes(SHACKS.indexOf(B)))continue;if(I.p3_roof_shack&&I.p3_roof_ridge){gable(B,'p3_roof_shack',2.8,1.3);continue}const {x,y,w,h}=SR({x:B[0],y:B[1],w:B[2],h:B[3]});const m=new THREE.Mesh(pyr,thatch);m.scale.set(w+.3,1.5,h+.3);m.position.set(x+w/2,2.8+.75,y+h/2);m.castShadow=true;m.receiveShadow=true;ROOT.add(m)}
  // cloister pillars of the fire monastery
  let pilT=texFrom(tcut(ZW,0,2),true);pilT.repeat.set(2,3);let stoneT=texFrom(tcut(ZG,1,0),true);
  if(I.wl_kolumna){const mk=(im,rx,ry)=>{const t=new THREE.Texture(im);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.repeat.set(rx,ry);t.needsUpdate=true;return t};pilT=mk(I.wl_kolumna,2,3);stoneT=mk(I.wl_kolumna,.5,.25)}
  const pilGeo=new THREE.CylinderGeometry(.34,.36,3,8);pilGeo.translate(0,1.5,0);
  instanced(pilGeo,cutCircle(phong({map:pilT,color:0xc8b8a8})),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
  const baseGeo=new THREE.BoxGeometry(.9,.3,.9);baseGeo.translate(0,.15,0);instanced(baseGeo,phong({map:stoneT}),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
  const capGeo=new THREE.BoxGeometry(1,.3,1);capGeo.translate(0,3.1,0);instanced(capGeo,cutCircle(phong({map:stoneT})),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
  // props: Z3 for the capital, plus braziers and a few slum props from earlier chapters
  const RZ={queen_fountain:[0,0,64,32],street_lantern:[64,0,32,32],noble_door:[96,0,32,32],saint_king:[0,32,32,64],cathedral_gate:[32,32,64,32],beggar_bodies:[96,32,32,32],plague_cart:[32,64,32,32],noble_carriage:[64,64,32,32],gibbet:[96,64,32,32],
    pyre_0:[0,96,32,32],pyre_1:[32,96,32,32],pyre_2:[64,96,32,32],pyre_3:[96,96,32,32],rot_bloom_0:[0,128,32,32],rot_bloom_1:[32,128,32,32],healing_shrine:[64,128,32,32],depleted_shrine:[96,128,32,32],
    royal_banner:[0,160,32,32],offering_bowl:[32,160,32,32],broken_bell:[64,160,32,32],doorway_bones:[96,160,32,32]};
  const RD={brazier_0:[0,0,32,32],brazier_1:[32,0,32,32],brazier_2:[64,0,32,32],brazier_3:[96,0,32,32],chains:[96,64,32,32],sarcophagus:[0,160,32,32]};
  const RB={dead_tree:[0,0,32,64],impaled_head:[32,0,32,32],gallows:[0,64,64,32],debris_fire_0:[64,64,32,32],debris_fire_1:[96,64,32,32],debris_fire_2:[0,96,32,32],debris_fire_3:[32,96,32,32],wheel:[64,96,32,32],barrel:[96,96,32,32],
    crow_post:[64,128,32,32],burnt_hay:[64,160,32,32],dead_horse:[96,160,32,32]};
  const RT={gate_open:[64,32,64,32]};
  const PF={},RC={};
  for(const [img,R] of [[ZP,RZ],[I.dm_props,RD],[I.br_props,RB],[I.trans,RT]])for(const k in R){PF[k]=I['p3_'+k]?procFrame(I['p3_'+k],0,0,R[k][2],R[k][3],'prop'):(img===I.br_props&&I['p1_'+k]&&/^(debris_fire_\d|order_bonfire)$/.test(k))?procFrame(I['p1_'+k],0,0,R[k][2],R[k][3],'prop'):procFrame(img,R[k][0],R[k][1],R[k][2],R[k][3],'prop');RC[k]=R[k]}
  const ANIM={fire:['debris_fire',4],pyre:['pyre',4],bloom:['rot_bloom',2]};
  for(let i=0;i<4;i++)if(I['p2_brazier_'+i])PF['brazier_'+i]=procFrame(I['p2_brazier_'+i],0,0,32,32,'prop'); // 13.11.2026: nowe, wyrownane klatki koksownika
  for(const [x,y] of braziers){const frames=[0,1,2,3].map(i=>PF['brazier_'+i]);propObjs.push({mesh:mkProp(frames,x+.5,y+.92,RC.brazier_0),frames,fps:6,ph:Math.random()*3})}
  for(const p of PROPS){let frames,rc;
    if(ANIM[p.anim]){const [k,n]=ANIM[p.anim];frames=[...Array(n).keys()].map(i=>PF[k+'_'+i]);rc=RC[k+'_0']}
    else if(p.shrine!==undefined){frames=[PF.healing_shrine,PF.depleted_shrine];rc=RC.healing_shrine}
    else{const k=p.still||p.k;frames=[PF[k]];rc=RC[k]}
    const o={mesh:mkProp(frames,p.x,p.y,rc),frames,fps:p.anim==='bloom'?4:p.anim?6:0,ph:Math.random()*3,kind:p.shrine!==undefined?'shrine':p.anim?'anim':'static',si:p.shrine};
    if(p.k==='beggar_bodies'||p.k==='doorway_bones')o.mesh.castShadow=false;if(p.flip)o.mesh.scale.x*=-1;propObjs.push(o)}
}

// Chapter IV meshes: K1 ground, K2 walls (rock rim, palisade, watchtower), K3 trees and big nature props (64 px cells drawn at 16 px per tile)
/* 23.11.2026 (runda 871, autor): palisada obozu w Czarnoborze z modulow: prosty odcinek (zaostrzone pale + dwie zerdzie od strony obozu),
   wylamane przeslo (krotkie, polamane, pochylone pale) i brama z zastrzalami (grube slupy, belka nad przejsciem, ukosne zastrzaly).
   Kolizja bez zmian (kafle 69). ?palisada=0 = stare bloki (tylko lokalnie). */
function palisadeCamp(I,tiles,r){if(!tiles.length)return;const set=new Set(tiles.map(([x,y])=>y*MW+x)),is=(x,y)=>set.has(y*MW+x),camp=(x,y)=>tileAt(x,y)===67;
 const woodM=typeof OSADA_TX!=='undefined'?worldSurfN(cutCircle(phong({color:0xd6ccc2})),'tcz1_drewno_palisady',2.2,1):I.wl_obozpal?worldSurf(cutCircle(phong({color:0xc8bcb0})),I.wl_obozpal,2.2,'c'):(typeof OSADA_TX!=='undefined'?worldSurfN(cutCircle(phong({color:0xb8aca0})),'t2_belka',1.3,1):cutCircle(phong({color:0x6a5444})));
 const beamM=typeof OSADA_TX!=='undefined'?worldSurfN(cutCircle(phong({color:0xc4b8ac})),'t2_belka',1.2,1):woodM;
 const stake=new THREE.CylinderGeometry(.13,.15,1,7);stake.translate(0,.5,0);const tip=new THREE.ConeGeometry(.15,.42,7);tip.translate(0,.21,0);const bar=new THREE.BoxGeometry(1,1,1);
 const S=[],T=[],B=[],m=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),s3=new THREE.Vector3();
 const mk=(arr,x,y,z,sx,sy,sz,rx,ry,rz)=>{e.set(rx||0,ry||0,rz||0);q.setFromEuler(e);arr.push(m.compose(v.set(x,y,z),q,s3.set(sx,sy,sz)).clone())};
 // wylamane przesla: 2 losowe odcinki po 2 kafle (nie przy bramie)
 const broken=new Set();{const cand=tiles.filter(([x,y])=>{const h=is(x-1,y)||is(x+1,y);return h?is(x-1,y)&&is(x+1,y)&&is(x-2,y)&&is(x+2,y):is(x,y-1)&&is(x,y+1)&&is(x,y-2)&&is(x,y+2)});
  for(let k=0;k<2&&cand.length;k++){const [x,y]=cand.splice(Math.floor(r()*cand.length),1)[0];const h=is(x-1,y)||is(x+1,y);broken.add(y*MW+x);broken.add(h?y*MW+x+1:(y+1)*MW+x)}}
 for(const [x,y] of tiles){const horiz=is(x-1,y)||is(x+1,y)||!(is(x,y-1)||is(x,y+1));
  // strona obozu (zerdzie od srodka)
  const inS=horiz?(camp(x,y+1)?1:camp(x,y-1)?-1:1):(camp(x+1,y)?1:camp(x-1,y)?-1:1);const br=broken.has(y*MW+x);
  for(let i=0;i<3;i++){const t=(i+.5)/3-.5+(r()-.5)*.05,px=x+.5+(horiz?t:0),pz=y+.5+(horiz?0:t);
   if(br){const h=.45+r()*.9;mk(S,px,0,pz,1,h,1,(r()-.5)*.5,0,(r()-.5)*.5);continue}
   const h=2.25+r()*.5,lean=(r()-.5)*.06;mk(S,px,0,pz,1,h,1,horiz?0:lean,0,horiz?lean:0);mk(T,px,h-.02,pz,1,1,1,horiz?0:lean,0,horiz?lean:0)}
  if(!br)for(const yy of [.75,1.75]){const o=inS*.2;mk(B,horiz?x+.5:x+.5+o,yy,horiz?y+.5+o:y+.5,horiz?1.04:.12,.13,horiz?.12:1.04)}
  else{mk(B,x+.5+(horiz?0:inS*.6),.12,y+.5+(horiz?inS*.6:0),horiz?1:.16,.16,horiz?.16:1,0,(r()-.5)*.6,0)}}// polamana zerdz na ziemi
 // bramy: przerwa 2..7 kafli miedzy palami w tej samej linii
 const done=new Set();for(const [x,y] of tiles)for(const [dx,dy] of [[1,0],[0,1]]){if(!is(x,y)||is(x+dx,y+dy))continue;let n=1;while(n<=7&&!is(x+dx*n,y+dy*n))n++;if(n<2||n>7||!is(x+dx*n,y+dy*n))continue;
  const k=y*MW+x+'|'+dx;if(done.has(k))continue;done.add(k);const ax=x+.5+dx*.5,az=y+.5+dy*.5,bx=x+dx*n+.5-dx*.5,bz=y+dy*n+.5-dy*.5,span=Math.hypot(bx-ax,bz-az),H=3.5,cx=(ax+bx)/2,cz=(az+bz)/2;
  for(const [px,pz] of [[ax,az],[bx,bz]]){mk(S,px,0,pz,1.9,H,1.9);mk(T,px,H-.02,pz,1.6,1.2,1.6)}
  mk(B,cx,H-.35,cz,dx?span+.6:.3,.34,dx?.3:span+.6);mk(B,cx,H-.95,cz,dx?span:.22,.22,dx?.22:span);
  // zastrzaly: z obu slupow ukosnie do belki
  const bl=1.5;for(const sgn of [1,-1]){const px=sgn>0?ax:bx,pz=sgn>0?az:bz;mk(B,px+dx*sgn*.55,H-1.25,pz+dy*sgn*.55,dx?bl:.18,.18,dx?.18:bl,dy?sgn*.8:0,0,dx?sgn*.8:0)}}
 const inst=(g,mat,arr)=>{if(!arr.length)return;const im=new THREE.InstancedMesh(g,mat,arr.length);arr.forEach((mm,i)=>im.setMatrixAt(i,mm));im.castShadow=true;im.receiveShadow=true;im.frustumCulled=false;ROOT.add(im)};
 inst(stake,woodM,S);inst(tip,woodM,T);inst(bar,beamM,B)}
function buildCzarnobor(I){planGround(4);
  const r=rng((W.seed^0x5a5a)>>>0),G=I.cz_ground,WL=I.cz_walls,T=I.cz_trees;
  const fc=canvas(WW,WH),fg=fc.getContext('2d');
  const ROW={60:0,61:1,62:2,63:3,64:4,65:5,66:6,67:7,21:0,68:3,69:7};
  const WET=new Set([64,65,91]),D4=[[1,0],[-1,0],[0,1],[0,-1]];
  const gcode=(x,y)=>{let t=tileAt(x,y);if(t===31)t=W.under[y*MW+x]||60;return t};
  W.fords=[];W.marsh=[];W.deepw=[];
  for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){const t=gcode(tx,ty);let c=(r()*8)|0,row=ROW[t]??0;
    if(WET.has(t)){c&=3;row=0;(t===64?W.fords:t===91?W.deepw:W.marsh).push([tx,ty])}
    else if(D4.some(([dx,dy])=>gcode(tx+dx,ty+dy)===64)&&r()<.85){row=4;c=4+(c&3)}
    else if(t===67&&W.region(tx,ty)==='camp'){const q=r();if(q<.35){row=1}else c=q<.75?0:q<.92?2:1}
    groundTile(fg,G,c,row,tx,ty);
    if(t===21||t===68||t===69){fg.fillStyle='rgba(3,4,6,.55)';fg.fillRect(tx*16,ty*16,16,16)}}
  // Natural boundaries blend continuously in the atlas material.
  floorAO(fg,new Set([31,68,69]));
  groundDetails(fg);
  const floor=new THREE.Mesh(floorGeo,groundMaterial(phong({map:surfaceTex(fc),alphaTest:.5,color:0x8e98a6})));floor.position.set(MW/2,0,MH/2);floor.receiveShadow=true;ROOT.add(floor);
  // animated ford and marsh water on top of the ground (K1 rows 4 and 5, frames 0-3)
  if(I.cc0_water){W.water=[];waterHD(I.ford_stones||I.cc0_water,W.fords,.012,4,I.ford_stones?0xe2e8ec:0x748c9a,false);waterHD(I.cc0_water,W.marsh,.013,4,0x7c8a70,false);waterHD(I.cc0_water,W.deepw,.014,4,0x4a5c80,true);{const all=[].concat(W.fords||[],W.marsh||[],W.deepw||[]);shoreFX(all,all,.02,'water',true)}}
  else W.water=[[4,W.fords,0x7c8a9c],[5,W.marsh,0x6c7c7a]].map(([row,list,col])=>{const c=canvas(64,64),tex=texFrom(c,true);const o={frames:[0,1,2,3].map(i=>tcut(G,i,row)),g:c.getContext('2d'),tex,f:-1};
    const wg=new THREE.PlaneGeometry(1,1);wg.rotateX(-Math.PI/2);instanced(wg,liquidMat({map:tex,color:col,shininess:38,specular:0x293d40}),list,([x,y])=>M4.makeTranslation(x+.5,.012,y+.5),false,true).frustumCulled=false;return o});
  // walls: rock rim of the valley topped with forest canopy, log palisade of the camp, the ruined watchtower
  const box=h=>{const g=new THREE.BoxGeometry(1,h,1);g.translate(0,h/2,0);return g};
  const addWalls=(list,h,side,cap,tint=0xffffff)=>{if(!list.length)return;const sm=side.w?worldSurf(cutCircle(phong({color:tint})),side.w[0],side.w[1],'c'):cutCircle(phong({map:side,color:tint})),cm=cap&&cap.w?worldSurf(cutCircle(phong({color:tint})),cap.w[0],cap.w[1],'c'):cutCircle(phong({map:cap,color:tint}));instanced(depthWall(box(h),sm,4),[sm,sm,cm,cm,sm,sm],list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5)).frustumCulled=false};
  const rc=()=>(r()*8)|0;
  const gR=[[],[],[]],gP=[[],[]],gT=[];
  for(const [x,y,t] of walls){if(t===69)gP[(x+y)&1].push([x,y]);else if(t===68)gT.push([x,y]);else gR[(x*5+y*3)%3].push([x,y])}
  gR.forEach(l=>addWalls(l,3.4,I.wl_dolina?{w:[I.wl_dolina,5]}:stackTex(WL,[[rc(),1],[rc(),1],[rc(),1]]),I.wl_lasu?{w:[I.wl_lasu,3]}:texFrom(tcut(WL,rc(),7),true),I.wl_dolina?0xc4ccc8:0x9aa096));
  if(nbParam('palisada')!=='0')palisadeCamp(I,gP.flat(),r);else gP.forEach(l=>addWalls(l,2.3,I.wl_obozpal?{w:[I.wl_obozpal,3]}:stackTex(WL,[[rc(),0],[rc(),0],[rc(),0]]),I.wl_obozpal?{w:[I.wl_obozpal,3]}:texFrom(tcut(WL,rc(),0),true),I.wl_obozpal?0xd0c8c0:0xffffff));
  // 15.11.2026 (mapy-wygladzenie): u podnoza skalnego obrzeza doliny nieregularne glazy; w wewnetrznych rogach schodkow wiekszy glaz, wiec brzeg nie czyta sie jak schody z kafli (tylko oprawa, kolizja bez zmian)
  {const rock=new Set(),open=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&!SOLID.has(tileAt(x,y));for(const [x,y,t] of walls)if(t!==69&&t!==68)rock.add(y*MW+x);
   const isRock=(x,y)=>rock.has(y*MW+x),list=[];
   for(const [x,y,t] of walls){if(t===69||t===68)continue;
    for(const [dx,dy] of D4)if(open(x+dx,y+dy))for(let n=r()<.55?2:1;n>0;n--)list.push([x+.5+dx*(.42+r()*.14)+(dy?(r()-.5)*.8:0),y+.5+dy*(.42+r()*.14)+(dx?(r()-.5)*.8:0),.3+r()*.28,r()*6.28,.55+r()*.4])}
   for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){if(!open(x,y))continue;
    for(const [dx,dy] of [[1,1],[1,-1],[-1,1],[-1,-1]])if(isRock(x+dx,y)&&isRock(x,y+dy))list.push([x+.5+dx*.38,y+.5+dy*.38,.42+r()*.2,r()*6.28,.7+r()*.3])}
   if(list.length){const g=new THREE.IcosahedronGeometry(1,1),ps=g.attributes.position;for(let i=0;i<ps.count;i++){const k=.82+.36*groundHash(Math.round(ps.getX(i)*9)+40,Math.round(ps.getZ(i)*9)+Math.round(ps.getY(i)*5)+40)/4294967296;ps.setXYZ(i,ps.getX(i)*k,ps.getY(i)*k,ps.getZ(i)*k)}g.computeVertexNormals();
    const mat=I.wl_dolina?worldSurf(cutCircle(phong({color:0x7b847e,shininess:6})),I.wl_dolina,5,'czRimRock'):phong({color:0x5d625c,shininess:6});
    instanced(g,mat,list,([x,y,sz,a,h])=>{M4.makeRotationY(a);SC.set(sz,sz*h,sz*(.8+.4*((a*7)%1)));M4.scale(SC);M4.setPosition(x,sz*h*.25,y);return M4}).frustumCulled=false}}
  addWalls(gT,4.4,I.wl_wieza?{w:[I.wl_wieza,4]}:stackTex(WL,[[rc(),5],[rc(),5],[rc(),5]]),I.wl_wieza?{w:[I.wl_wieza,4]}:texFrom(tcut(WL,rc(),5),true),I.wl_wieza?0xd0d0d4:0xb0b0b4);
  // K3 objects: [x, y, w, h, scale]; trees at full size, undergrowth smaller
  const OBJ={spruce:[0,0,64,64,1.2],dead_spruce:[64,0,64,64,1.15],dead_oak:[128,0,64,64,1],birch:[192,0,64,64,1.15],sacred_oak:[0,64,128,128,1],tall_pine:[128,64,64,128,1],hanging_tree:[192,64,64,128,1],
    mossy_boulder:[0,192,64,64,.38],fallen_log:[64,192,64,64,.38],standing_stone_dark:[128,192,64,64,.55],standing_stone_lit:[192,192,64,64,.55],reeds:[0,256,64,64,.32],brambles:[64,256,64,64,.25],mushrooms:[128,256,64,64,.12],
    burial_mound:[192,256,64,64,.35],axe_stump:[0,320,64,64,.22],ferns:[64,320,64,64,.22],wolf_skull_bush:[128,320,64,64,.25],drowned_cart:[192,320,64,64,.4],wd0:[0,0,64,64,.27],wd1:[0,0,64,64,.27],wd2:[0,0,64,64,.27],wd3:[0,0,64,64,.27],wd4:[0,0,64,64,.27],wd5:[0,0,64,64,.27],wd6:[0,0,64,64,.27],wd7:[0,0,64,64,.27],wd8:[0,0,64,64,.27],wd9:[0,0,64,64,.27],wd10:[0,0,64,64,.27],wd11:[0,0,64,64,.27],sp0:[0,0,64,64,.2],sp1:[0,0,64,64,.2],sp2:[0,0,64,64,.2],sp3:[0,0,64,64,.2],sp4:[0,0,64,64,.2],sp5:[0,0,64,64,.2],sp6:[0,0,64,64,.2],sp7:[0,0,64,64,.2],sp8:[0,0,64,64,.2],sp9:[0,0,64,64,.2],sp10:[0,0,64,64,.2],sp11:[0,0,64,64,.2]};
  const geos={},G2=(w,h)=>{const k=w+'x'+h;if(!geos[k]){const g=new THREE.PlaneGeometry(w/16,h/16).translate(0,h/32-2/16,0),n=g.attributes.normal;for(let i=0;i<n.count;i++)n.setXYZ(i,0,.8,.6);geos[k]=g}return geos[k]};
  const FR={};for(const k in OBJ){const o=OBJ[k];FR[k]=I['p4_'+k]?procFrame(I['p4_'+k],0,0,o[2],o[3],'prop'):procFrame(T,o[0],o[1],o[2],o[3],'prop');cutCircle(FR[k].n);if(/spruce|pine|birch|oak|hanging_tree/.test(k))foliageWind(FR[k])}
  const byK={};for(const p of PROPS)if(OBJ[p.k])(byK[p.k]=byK[p.k]||[]).push(p);
  let saplings=0;for(const p of PROPS){if(!p.tree||!['spruce','birch'].includes(p.k)||saplings>=8||groundHash(Math.floor(p.x),Math.floor(p.y))%7!==0)continue;const x=p.x+.26,y=p.y-.3,i=Math.floor(y)*MW+Math.floor(x);if(tileAt(Math.floor(x),Math.floor(y))!==31||W.clearways.has(i))continue;(byK[p.k]||(byK[p.k]=[])).push({...p,x,y,artSmall:true});saplings++}

  if(REK3D_ON)for(const k in byK)if(paint3dImg(4,k)||meshyFor(4,k)){const o=OBJ[k],W=o[2]/16*o[4];
   WORLDS[CH].p3d=(WORLDS[CH].p3d||[]).concat(byK[k].map(p=>({p,W:p.artSmall?W*.62:W})));delete byK[k]}
  for(const k in byK){const o=OBJ[k],s=o[4],low=k==='ferns'||k==='reeds'||k==='mushrooms'||k==='brambles'||/^(wd|sp)\d+$/.test(k);
    const fy=(()=>{const img=FR[k].n.map&&FR[k].n.map.image;if(!img)return 0;propFoot(img);const R=PROP_RAWB.get(img);if(!R)return 0;const g=G2(o[2],o[3]);if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox,y=(bb.max.y-R.b*(bb.max.y-bb.min.y))*s*SQ;return y>.05?.01-y:0})(); // 13.11.2026: rekwizyt z pustym marginesem u dolu (np. swiety dab) nie wisi nad ziemia
    const im=instanced(G2(o[2],o[3]),FR[k].n,byK[k],p=>M4.compose(V.set(p.x,fy,p.y),Q.identity(),SC.set((p.flip?-1:1)*s*(p.artSmall?.62:1)*(p.tree?(.94+.06*Math.sin(p.x*.71+p.y*.39)):1),s*SQ*(p.artSmall?.62:1)*(k==='tall_pine'?.85:p.tree?(.94+.06*Math.sin(p.x*.71+p.y*.39)):1),s)),!low,false);im.customDistanceMaterial=FR[k].d;im.frustumCulled=false}
  // standing stones are separate meshes, they light up one by one
  for(const p of PROPS)if(p.stone!==undefined){const s=OBJ.standing_stone_dark[4],m=new THREE.Mesh(G2(64,64),FR.standing_stone_dark.n);m.customDistanceMaterial=FR.standing_stone_dark.d;m.castShadow=true;m.position.set(p.x,0,p.y);m.scale.set(s,s*SQ,s);ROOT.add(m);
    propObjs.push({mesh:m,frames:[FR.standing_stone_dark,FR.standing_stone_lit],fps:0,ph:0,kind:'stone',si:p.stone})}
  // camp and roadside props from chapter I
  const RB={impaled_head:[32,0,32,32],shrine:[96,32,32,32],gallows:[0,64,64,32],debris_fire_0:[64,64,32,32],debris_fire_1:[96,64,32,32],debris_fire_2:[0,96,32,32],debris_fire_3:[32,96,32,32],wheel:[64,96,32,32],barrel:[96,96,32,32],
    marga_cart:[0,128,64,32],crow_post:[64,128,32,32],covered_corpses:[96,128,32,32],burnt_hay:[64,160,32,32]};
  // K4: camp, ritual and roadside props (32 px cells, the wagon spans two)
  const RK={cz_fire_0:[0,0],cz_fire_1:[32,0],cz_fire_2:[64,0],cz_fire_3:[96,0],cz_idol:[0,32],cz_skullpole:[32,32],cz_shrine:[64,32],cz_shrine_burnt:[96,32],cz_wagon:[0,64,64],cz_cauldron:[64,64],cz_firewood:[96,64],
    cz_gallows:[0,96],cz_sacpole:[32,96],cz_beehive:[64,96],cz_wheel:[96,96],cz_wisp_0:[0,128],cz_wisp_1:[32,128],cz_crow_0:[64,128],cz_crow_1:[96,128],cz_walk:[0,160],cz_tent:[32,160],cz_pelts:[64,160],cz_bones:[96,160]};
  const PF={},RC={};for(const k in RB){PF[k]=(I['p1_'+k]&&/^debris_fire_\d$/.test(k))?procFrame(I['p1_'+k],0,0,RB[k][2],RB[k][3],'prop'):procFrame(I.br_props,RB[k][0],RB[k][1],RB[k][2],RB[k][3],'prop');RC[k]=RB[k]}
  if(I.cz_props)for(const k in RK){const [x,y,w=32]=RK[k];RC[k]=[x,y,w,32];PF[k]=I['p4_'+k]?procFrame(I['p4_'+k],0,0,w,32,'prop'):procFrame(I.cz_props,x,y,w,32,'prop')}
  const ANIM={fire:['debris_fire',4],campfire:[I.cz_props?'cz_fire':'debris_fire',4],wisp:['cz_wisp',2],crow:['cz_crow',2]};
  for(const p of PROPS){if(OBJ[p.k]||p.stone!==undefined)continue;let frames,rc2;
    if(!PF[p.k]&&!ANIM[p.anim]&&p.shrine===undefined){const alt={cz_skullpole:'impaled_head',cz_gallows:'gallows',cz_wagon:'marga_cart',cz_tent:'burnt_hay',cz_cauldron:'barrel',cz_firewood:'barrel',cz_beehive:'barrel',cz_wheel:'wheel',cz_idol:'crow_post',cz_sacpole:'crow_post',cz_pelts:'burnt_hay',cz_bones:'covered_corpses'}[p.k];if(alt)p.k=alt}
    if(ANIM[p.anim]&&PF[ANIM[p.anim][0]+'_0']){const [k,n]=ANIM[p.anim];frames=[...Array(n).keys()].map(i=>PF[k+'_'+i]);rc2=RC[k+'_0']}
    else if(p.shrine!==undefined){frames=PF.cz_shrine?[PF.cz_shrine,PF.cz_shrine_burnt]:[PF.shrine,PF.shrine];rc2=RC.cz_shrine||RB.shrine}
    else{frames=[PF[p.k]];rc2=RC[p.k]}
    if(!frames[0])continue;
    const o={mesh:mkProp(frames,p.x,p.y,rc2),frames,fps:p.anim==='crow'?1.5:p.anim==='wisp'?3:p.anim?6:0,ph:Math.random()*3,kind:p.shrine!==undefined?'shrine':p.anim?'anim':'static',si:p.shrine};
    if(p.k==='covered_corpses'||p.k==='cz_walk'||p.k==='cz_bones'||p.k==='cz_pelts'||p.anim==='wisp')o.mesh.castShadow=false;if(p.anim==='wisp')o.mesh.position.y=.35;propObjs.push(o)}
}

// Chapter V: curated, human-scale K3/K4 furnishings; the Lower City sheet supplies only shrines.
function buildCytadela(I){planGround(5);
  const r=rng((W.seed^0x7c7c)>>>0),G=I.cy_ground,WL=I.cy_walls;
  const fc=canvas(WW,WH),fg=fc.getContext('2d');
  const ROW={70:0,71:1,72:2,73:3,74:4,75:5,76:6,77:7,21:0,78:0,80:5};
  const BASE={dziedziniec:0,kancelaria:2,sala:1,skarbiec:4,krypta:5,tron:1};
  const gcode=(x,y)=>{let t=tileAt(x,y);if(t===31)t=W.under[y*MW+x]||70;return t};
  for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){const t=gcode(tx,ty);const row=ROW[t]??BASE[W.region(tx,ty)]??0;
    groundTile(fg,G,((r()*8)|0),t===78?BASE[W.region(tx,ty)]:row,tx,ty);
    if(t===21||t===78||t===80){fg.fillStyle='rgba(3,3,6,.55)';fg.fillRect(tx*16,ty*16,16,16)}}
  floorAO(fg,new Set([31,22,27]));
  groundDetails(fg);
  const floor=new THREE.Mesh(floorGeo,groundMaterial(phong({map:surfaceTex(fc),alphaTest:.5,color:0x9e9c9a})));floor.position.set(MW/2,0,MH/2);floor.receiveShadow=true;ROOT.add(floor);
  // walls: every hall has its own face (r0 fortress stone, r1 bookcases, r2 black marble, r4 vault plates, r3 bars), roof caps from r6
  const box=h=>{const g=new THREE.BoxGeometry(1,h,1);g.translate(0,h/2,0);return g};
  const rc=()=>(r()*8)|0;
  const addWalls=(list,h,row,tint=0xffffff,plain,img)=>{if(!list.length)return;const wim=img||I.wl_fort;const side=wim&&!plain?worldSurf(cutaway(phong({color:tint})),wim,4,'a'):cutaway(phong({map:stackTex(WL,[[rc(),row],[rc(),row],[rc(),row]]),color:tint})),cap=I.wl_cap&&!plain?worldSurf(cutaway(phong({color:tint})),I.wl_cap,3,'a'):cutaway(phong({map:texFrom(tcut(WL,rc(),6),true),color:tint}));instanced(depthWall(box(h),side,5),[side,side,cap,cap,side,side],list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5)).frustumCulled=false};
  const WROW={dziedziniec:0,kancelaria:1,sala:2,skarbiec:4,krypta:0,tron:2};
  const rim=[[],[]],bars=[],inner={};
  for(const [x,y,t] of walls){if(t===80)bars.push([x,y]);else if(t===21)rim[(x+y)&1].push([x,y]);else{const k=W.region(x,y);(inner[k]=inner[k]||[[],[]])[(x+y)&1].push([x,y])}}
  rim.forEach(l=>addWalls(l,4.4,0,I.wl_c5_mur?0xd8d6d4:0x8a8890,false,I.wl_c5_mur)); // 13.11.2026: granitowy mur zakonu
  for(const k in inner)inner[k].forEach(l=>addWalls(l,3.4,WROW[k],0xffffff,false,I.wl_c5_wew));
  addWalls(bars,2.2,3,0xffffff,true);
  // 15.11.2026 (punkt centralny): mur zamykajacy os czerwonego dywanu Sali Sadowej niesie godlo Zakonu i zlota Wage Sadu; tylko na polach muru, srodek sali wolny
  {const zc=(MP(33)+MP(35))/2,face=MP(35)+.04,cx=MP(40);
   nbLandmark('assets/rekwizyty/bcd46c57ccc12edcbce7230137800744233eda3b28b7302321ef34ac4e7cee70.webp',{x:cx,z:face-.55,w:3.7,aspect:900/698,base:3.38,wrap:cutaway});
   {// 15.11.2026: zlota poswiata u podstawy Wagi (miekka plama swiatla, dodawana); pieczec z muru usunieta na prosbe autora
    const c=canvas(128,64),q=c.getContext('2d'),gr=q.createRadialGradient(64,40,2,64,40,62);gr.addColorStop(0,'rgba(255,214,140,.95)');gr.addColorStop(.35,'rgba(255,170,70,.45)');gr.addColorStop(1,'rgba(255,140,40,0)');q.fillStyle=gr;q.fillRect(0,0,128,64);
    const halo=new THREE.Mesh(new THREE.PlaneGeometry(3.4,1.5).translate(0,.75,0),cutaway(new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.75})));halo.scale.y=SQ;halo.position.set(cx,3.1,face-.35);halo.renderOrder=4;ROOT.add(halo);
    W.LSRC.push({col:0xffc86a,base:1.15,dist:5.5,x:cx,y:3.9,z:face-.1,kind:'fire',ph:.7})}// obraz: cy_waga_sadu (ChatGPT 15.11.2026)
   W.LSRC.push({col:0xffc27a,base:.9,dist:5.5,x:cx,y:2.4,z:face+1.4,kind:'fire',ph:2.2})} // 12.11.2026: kraty z wlasna tekstura krat (wczesniej kamienny slup)
  const R={brazier_0:[0,0,32,32],brazier_1:[32,0,32,32],brazier_2:[64,0,32,32],brazier_3:[96,0,32,32],king_statue:[0,32,32,64],healing_shrine:[32,64,32,32],depleted_shrine:[64,64,32,32],chains:[96,64,32,32],
    fallen_pillar:[0,96,64,32],dwarf_bones:[64,96,32,32],sarcophagus:[0,160,32,32],rune_lantern:[32,160,32,32],clan_banner:[96,160,32,32]};
  const PF={};for(const k in R)PF[k]=procFrame(I.dm_props,...R[k],'prop');
  const BG=I.cy_big,KP=I.cy_props;
  if(!BG){
    const pilT=texFrom(tcut(WL,0,7),true);pilT.repeat.set(2,4);const stoneT=texFrom(tcut(G,2,1),true);
    const pilGeo=new THREE.CylinderGeometry(.36,.38,4,8);pilGeo.translate(0,2,0);
    instanced(pilGeo,cutaway(phong({map:pilT})),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
    const baseGeo=new THREE.BoxGeometry(.95,.35,.95);baseGeo.translate(0,.175,0);instanced(baseGeo,phong({map:stoneT}),pillars,([x,y])=>M4.makeTranslation(x+.5,0,y+.5));
    for(const [x,y] of braziers){const frames=[0,1,2,3].map(i=>PF['brazier_'+i]);propObjs.push({mesh:mkProp(frames,x+.5,y+.92,R.brazier_0),frames,fps:6,ph:Math.random()*3})}
  }else{
    // K3 big objects [x, y, w, h, scale]; 64 px cells at 16 px per tile
    const OBJ={pillar_a:[0,0,64,64,0.9],pillar_b:[64,0,64,64,0.9],bookcase_a:[128,0,64,64,0.5],bookcase_b:[192,0,64,64,0.5],statue_a:[0,64,64,64,0.85],statue_b:[64,64,64,64,0.85],scale:[128,64,64,64,0.6],vault:[192,64,64,64,0.6],
      bench_a:[0,128,64,64,0.23],bench_b:[64,128,64,64,0.23],cage:[128,128,64,64,0.55],rack:[192,128,64,64,0.5],ledgers:[0,192,64,64,0.094],lectern:[64,192,64,64,0.3],goldheap:[128,192,64,64,0.176],chest:[192,192,64,64,0.155],
      gallows:[0,256,64,64,0.65],brazier_0:[64,256,64,64,0.45],brazier_1:[128,256,64,64,0.45],candelabra:[192,256,64,64,0.417],throne:[0,320,128,64,1.3],armour:[128,320,64,64,0.42],well:[192,320,64,64,0.42],chest_open:[0,384,64,64,0.156]};
    const geos={},G2=(w,h)=>{const k=w+'x'+h;if(!geos[k]){const g=new THREE.PlaneGeometry(w/16,h/16).translate(0,h/32-2/16,0),n=g.attributes.normal;for(let i=0;i<n.count;i++)n.setXYZ(i,0,.8,.6);geos[k]=g}return geos[k]};
    const FR={};for(const k in OBJ){const o=OBJ[k];FR[k]=I['p5_'+k]?procFrame(I['p5_'+k],0,0,o[2],o[3],'prop'):procFrame(BG,o[0],o[1],o[2],o[3],'prop');cutCircle(FR[k].n)}
    const putObj=(k,x,y,flip)=>{const o=OBJ[k],s=o[4],m=new THREE.Mesh(G2(o[2],o[3]),FR[k].n);m.customDistanceMaterial=FR[k].d;m.userData.propAsset=true;m.castShadow=true;m.position.set(x,0,y);m.scale.set(flip?-s:s,s*SQ,s);ROOT.add(m);return m};
    {const pm=[];pillars.forEach(([x,y],i)=>{const k=(x*3+y)%2?'pillar_a':'pillar_b',n=k==='pillar_a'?'r7_kol_a':'r7_kol_b';if(R7_ZAM&&REK3D_ON&&P3D_MGEO[n]){const o=OBJ[k];pm.push({n,x:x+.5,z:y+.92,W:o[2]/16*o[4],ab:IMGS['p5_'+k]?p3dAlphaBox('p5_'+k):[.3,0,.7,1]})}else putObj(k,x+.5,y+.92,false)});if(pm.length)meshyEmit(ROOT,pm)}
    // 13.11.2026: koksownik z nowych klatek p2_brazier (wyrownana podstawa) zamiast dwoch roznych rysunkow z arkusza
    const BZ=[0,1,2,3].map(i=>I['p2_brazier_'+i]?procFrame(I['p2_brazier_'+i],0,0,64,64,'prop'):null),BZok=BZ.every(Boolean);
    if(BZok){BZ.forEach(f=>cutCircle(f.n));OBJ.brazier_0[4]=.52}
    const bzm=[];for(const [x,y] of braziers){const bzN=P8_ON&&!R7_ZAM&&REK3D_ON&&P3D_MGEO.p8f5?'p8f5':(R7_ZAM&&REK3D_ON&&P3D_MGEO.r7_kosz5?'r7_kosz5':null);if(bzN){const o=OBJ.brazier_0;bzm.push({n:bzN,x:x+.5,z:y+.92,W:o[2]/16*o[4],ab:IMGS.p2_brazier_0?p3dAlphaBox('p2_brazier_0'):[.25,0,.75,1]});continue}
     const fr=BZok?BZ:[FR.brazier_0,FR.brazier_1],m=putObj('brazier_0',x+.5,y+.92,false);if(BZok){m.material=BZ[0].n;m.customDistanceMaterial=BZ[0].d}propObjs.push({mesh:m,frames:fr,fps:BZok?6:5,ph:Math.random()*3})}if(bzm.length)meshyEmit(ROOT,bzm);
    for(const p of PROPS)if(OBJ[p.k]){const artKey=p.k==='bench_a'?'bench_b':p.k;const m=putObj(artKey,p.x,p.y,!!p.flip);p.obj={mesh:m}}
  }
  // K4 small props, 32 px cells; the healing shrine still comes from the Lower City sheet
  const RK={torch_0:[0,0],torch_1:[32,0],torch_2:[64,0],torch_3:[96,0],scroll:[0,32],book:[32,32],inkwell:[64,32],seal:[96,32],chains_0:[0,64],chains_1:[32,64],shackles:[64,64],skull:[96,64],
    chair:[0,96],desk:[32,96],inkbarrel:[64,96],cart:[96,96],pages_0:[0,128],pages_1:[32,128],raven_0:[64,128],raven_1:[96,128],purse:[0,160],goblet:[32,160],keys:[64,160],swordbooks:[96,160]};
  const KF={};if(I.p1_order_bonfire)KF.order_bonfire=procFrame(I.p1_order_bonfire,0,0,32,32,'prop');if(I.p1_order_banner)KF.order_banner=procFrame(I.p1_order_banner,0,0,32,32,'prop');for(const k in RK){if(I['p5_'+k])KF[k]=procFrame(I['p5_'+k],0,0,32,32,'prop');else if(KP)KF[k]=procFrame(KP,RK[k][0],RK[k][1],32,32,'prop')}
  const ANIM={torch:['torch',4,6],chains:['chains',2,2],pages:['pages',2,2.5],raven:['raven',2,1.5]};
  for(const p of PROPS){if(p.obj&&BG&&p.shrine===undefined)continue;
    const sh=p.shrine!==undefined;let frames,fps=0;
    if(sh)frames=[PF.healing_shrine,PF.depleted_shrine];
    else if(p.anim&&ANIM[p.anim]&&KF[ANIM[p.anim][0]+'_0']){const [k,n,f]=ANIM[p.anim];frames=[...Array(n).keys()].map(i=>KF[k+'_'+i]);fps=f}
    else if(KF[p.k])frames=[KF[p.k]];
    else frames=[PF[p.k]];
    if(!frames[0])continue;
    const o={mesh:mkProp(frames,p.x,p.y,[0,0,32,32]),frames,fps,ph:Math.random()*3,kind:sh?'shrine':fps?'anim':'static',si:p.shrine,prop:p};
    {const SCL={scroll:.2,book:.17,inkwell:.16,seal:.14,pages:.18,purse:.2,goblet:.18,keys:.16,shackles:.24,skull:.24,swordbooks:.28,chair:.48,desk:.5,inkbarrel:.42,cart:.9,sarcophagus:.85,order_bonfire:.8,torch:.5,chains:.5,healing_shrine:.75},c=SCL[p.k]||SCL[p.anim]||1;if(c!==1)o.mesh.scale.set(c,SQ*c,c);if(p.flip)o.mesh.scale.x*=-1}
    if(!sh&&(p.k==='shackles'||p.k==='skull'||p.k==='scroll'||p.k==='pages'||p.k==='book'||p.k==='torch'||p.k==='chains'))o.mesh.castShadow=false;p.obj=o;propObjs.push(o)}
}

// Morhad, the Beast of a Thousand Slaughters: a placeholder sheet drawn in code until the ChatGPT one arrives (2x3 cells of 64 px)
function beastSheet(){
  const c=canvas(128,192),g=c.getContext('2d'),r=rng(66);
  const INK='#08070a',F1='#29201a',F2='#3d3127',F3='#5a4632',M1='#4a1f1c',M2='#6b2c26',M3='#8c4c40',B1='#d8cfb8',B2='#9d9584',BL='#951518',BL2='#560a0d',EYE='#ff2a2a',WG='#2e0b0e',WG2='#4a1418';
  let OX=0,OY=0;
  const inC=(x,y)=>x>=0&&y>=0&&x<64&&y<64;
  const px=(x,y,col)=>{x=Math.round(x);y=Math.round(y);if(!inC(x,y))return;g.fillStyle=col;g.fillRect(OX+x,OY+y,1,1)};
  const ell=(cx,cy,rx,ry,col)=>{for(let y=-Math.ceil(ry);y<=ry;y++){const w=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry))));for(let x=-w;x<=w;x++)px(cx+x,cy+y,col)}};
  const limb=(pts,w0,w1,col)=>{for(let s=0;s<pts.length-1;s++){const [x0,y0]=pts[s],[x1,y1]=pts[s+1],n=Math.ceil(Math.hypot(x1-x0,y1-y0))*2;for(let i=0;i<=n;i++){const t=(s+i/n)/(pts.length-1),w=w0+(w1-w0)*t;ell(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,w,w,col)}}};
  const poly=(pts,col)=>{let y0=64,y1=0;for(const p of pts){y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])}
    for(let y=Math.floor(y0);y<=y1;y++){const xs=[];for(let i=0;i<pts.length;i++){const [ax,ay]=pts[i],[bx,by]=pts[(i+1)%pts.length];if((ay<=y&&by>y)||(by<=y&&ay>y))xs.push(ax+(y-ay)/(by-ay)*(bx-ax))}xs.sort((a,b)=>a-b);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.ceil(xs[k]);x<=xs[k+1];x++)px(x,y,col)}};
  const drips=(x,y,n,len)=>{for(let i=0;i<n;i++){const dx=x+((r()-.5)*6)|0,l=2+((r()*len)|0);for(let k=0;k<l;k++)px(dx,y+k,k<l-1?BL:BL2)}};
  const smear=(cx,cy,rx,ry,n)=>{for(let i=0;i<n;i++)px(cx+(r()-.5)*2*rx,cy+(r()-.5)*2*ry,r()<.6?BL:BL2)};
  const wings=(spread)=>{for(const s of [-1,1]){const sh=[32+s*10,26],el=[32+s*(17+9*spread),14-8*spread],t1=[32+s*(24+7*spread),3],t2=[32+s*(30+1*spread),12+4*(1-spread)],t3=[32+s*(29),26],t4=[32+s*22,34];
      poly([sh,el,t1,[el[0]+s*3,el[1]+5],t2,[el[0]+s*4,el[1]+12],t3,[el[0]+s*1,el[1]+17],t4,[32+s*12,34]],WG);
      for(const t of [t1,t2,t3])limb([el,t],1,.4,B2);limb([sh,el],1.6,1.2,F1);
      for(let i=0;i<10;i++)px(sh[0]+s*(4+r()*14),20+r()*14,WG2);px(t1[0],t1[1],B1)}};
  const body=(k,pose)=>{
    const st=pose==='walk'?(k?2:-2):0;
    if(pose==='wind')wings(1);else wings(.45);
    // legs: digitigrade, hooved
    limb([[25,44],[23+st,52],[25+st,61]],3.4,2.2,F1);limb([[39,44],[41-st,52],[39-st,61]],3.4,2.2,F1);
    limb([[25,45],[23+st,52]],1.4,1,F2);limb([[39,45],[41-st,52]],1.4,1,F2);
    for(const [x,y] of [[25+st,61],[39-st,61]]){ell(x,y,2.5,1,INK);px(x-2,61,B2);px(x+2,61,B2)}
    // hulking torso, flayed chest, ribs
    ell(32,37,13,10,F1);ell(32,35,11,8,F2);ell(32,33,7,6,M1);ell(32,32,5,4,M2);
    for(const y of [30,32,34,36]){for(let x=-5;x<=5;x++)if(Math.abs(x)>1)px(32+x,y+Math.abs(x)*.2,M3)}
    px(32,29,B2);px(32,31,B2);px(32,33,B2);
    ell(20,26,7,6,F1);ell(44,26,7,6,F1);ell(20,25,5,4,F2);ell(44,25,5,4,F2);ell(19,24,2,1,F3);ell(45,24,2,1,F3);
    // spikes and small horns erupting along the shoulders
    for(const s of [-1,1])for(const [ox,oy,l] of [[9,22,4],[13,20,3],[6,25,3]]){limb([[32+s*ox,oy],[32+s*(ox+2),oy-l]],1,.3,B2);px(32+s*(ox+2),oy-l,B1)}
    // arms: long, ape-like, claws dripping
    const arm=pose==='wind'?[[[19,27],[13,15],[18,5]],[[45,27],[51,15],[46,5]]]:pose==='swing'?[[[19,27],[16,39],[23,50]],[[45,27],[48,39],[41,50]]]:[[[19,27],[14,39],[15+st*.5,51]],[[45,27],[50,39],[49-st*.5,51]]];
    for(const a of arm){limb(a,3.6,2.4,F1);limb(a.slice(0,2),1.6,1.2,F2);const h=a[2];ell(h[0],h[1],3,2.5,F1);
      const dn=pose==='wind'?-1:1;for(const o of [-2,0,2]){px(h[0]+o,h[1]+dn*3,B1);px(h[0]+o,h[1]+dn*4,B2)}
      smear(h[0],h[1]-dn*4,4,5,14);if(pose!=='wind')drips(h[0],h[1]+5,3,5)}
    // head: low between the shoulders, open jaw full of fangs, glowing eyes
    ell(32,22,6,5,F1);ell(32,21,4,3,F2);ell(32,25,4,3,M1);
    for(let x=-3;x<=3;x++){px(32+x,25,INK);px(32+x,26,INK);px(32+x,27,x%2?BL2:INK)}
    for(const x of [-3,-1,1,3]){px(32+x,25,B1)}px(30,27,B1);px(34,27,B1);
    px(29,21,EYE);px(30,21,EYE);px(34,21,EYE);px(35,21,EYE);px(31,19,EYE);px(33,19,EYE);
    // great horns curling up and out
    for(const s of [-1,1]){const H=[[32+s*4,18],[32+s*9,15],[32+s*13,10],[32+s*13,4],[32+s*10,1]];limb(H,2.2,.6,B2);for(let i=1;i<H.length-1;i++)px(H[i][0]-s,H[i][1],B1)}
    // fur and gore
    for(let i=0;i<70;i++){const a=r()*Math.PI*2,d=8+r()*7;px(32+Math.cos(a)*d*1.3,33+Math.sin(a)*d*.9,r()<.5?F3:F1)}
    smear(32,36,10,8,36);smear(32,24,5,2,8);drips(32,28,5,7);drips(26,44,3,6);drips(38,44,3,6);
    if(pose==='swing'){for(let i=0;i<24;i++)px(20+r()*24,48+r()*12,r()<.6?BL:BL2)}
  };
  const dead=(k)=>{
    ell(32,59,27,4,BL2);ell(30,59,20,3,BL);
    poly([[10,56],[2,46+k*3],[16,50],[24,54]],WG);poly([[54,56],[62,48+k*3],[48,50],[40,54]],WG);
    ell(32,54-k,19,7-k*2,F1);ell(32,53-k,15,5-k,F2);ell(30,52,6,3,M1);for(const x of [26,29,32,35])px(x,52,M3);
    ell(50,56,5,4,F1);px(49,55,EYE);px(52,55,'#4a1f1c');limb([[52,53],[56,48],[58,44]],1.6,.5,B2);limb([[47,53],[44,47]],1.4,.5,B2);
    limb([[18,55],[10,58],[6,59]],2.4,1.6,F1);for(const o of [-1,1])px(5+o,60,B1);
    smear(32,54,18,5,60);drips(20,57,4,3);drips(44,57,4,3)};
  const cell=(cx,cy,fn)=>{OX=cx*64;OY=cy*64;fn()};
  cell(0,0,()=>body(0,'walk'));cell(1,0,()=>body(1,'walk'));
  cell(0,1,()=>body(0,'wind'));cell(1,1,()=>body(0,'swing'));
  cell(0,2,()=>dead(0));cell(1,2,()=>dead(1));
  return c;
}


