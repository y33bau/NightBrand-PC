// Chapter II meshes: M4 floor, M5 walls, M6 props, M8 transitions
// 15.11.2026: malowany punkt centralny mapy (obraz z przezroczystoscia) jako stojacy rekwizyt: pionowa plaszczyzna rozciagnieta o SQ jak inne rekwizyty, normalne jak w rekwizytach rozdz. IV
function nbLandmark(url,o){const tex=new THREE.TextureLoader().load(url);tex.anisotropy=4;const h=o.w*o.aspect,g=new THREE.PlaneGeometry(o.w,h).translate(0,h/2,0),n=g.attributes.normal;for(let i=0;i<n.count;i++)n.setXYZ(i,0,.8,.6);
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
 const inBuilding=new Set();
 for(const [x,y,w,h,kind] of PORT_BUILDINGS){
  for(let Y=FT(y);Y<FT(y+h);Y++)for(let X=FT(x);X<FT(x+w);X++)inBuilding.add(Y*MW+X);
  const bx=MP(x),bz=MP(y),bw=MP(x+w)-bx,bd=MP(y+h)-bz;
  const cx=bx+bw/2,cz=bz+bd/2,front=bz+bd,eave=kind==='inn'?2.5:kind==='office'?2.9:2.72,half=bw/2+.22,pitch=.37;
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
 if(lampImg){const t=new THREE.Texture(lampImg);t.needsUpdate=true;t.anisotropy=4;lampMat=phong({map:t,alphaTest:.4,color:0x9c9ca4,side:THREE.DoubleSide});lampGeo=new THREE.PlaneGeometry(lampW,lampW).translate(0,lampW/2,0);const n=lampGeo.attributes.normal;for(let i=0;i<n.count;i++)n.setXYZ(i,0,.8,.6)}
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
// 20.11.2026 (runda bryl rekwizytow 1, rozdz. I): beczki jako bryly 3D zamiast plaskich obrazkow (obrazek wygladal jak naklejka na ziemi). Tylko wyglad, kolizje bez zmian.
// Proba 2 (autor: bryly z koloru "wygladaja cyfrowo, jak z prototypu"): beczka oklejona malunkiem z jej obrazka p1_barrel (pas klepek z obreczami i mchem, lustrzany, wiec bez szwu; wieko z gory obrazka), bez polysku. Kolo zostaje obrazkiem (jego malunek jest w perspektywie, nie da sie go nakleic). Porownanie przed: ?rek3d=0 (tylko lokalnie).
const REK3D_ON=nbParam('rek3d')!=='0';
const REK3D_KEYS=new Set(['barrel']);
// 20.11.2026 (autor: "poprosze o wszystko w wersji testowej"): ta sama beczka w rozdz. IV (malunek p3_barrel) i V (malunek p1_barrel; wczesniej stary piksel z atlasu br_props). Wycinki liczone od obrysu obrazka (box), wiec pasuja do obu rozmiarow.
const REK3D_BOX={p1_barrel:[83,55,300,360],p3_barrel:[52,45,203,240]};
function rek3dBuild(ROOT,I,key='p1_barrel'){
 const img=I[key],bx=REK3D_BOX[key];if(!img||!bx)return null;const sk=img.width/(key==='p3_barrel'?256:384),bw=(bx[2]-bx[0])*sk,bh=(bx[3]-bx[1])*sk,X=f=>bx[0]*sk+bw*f,Y=f=>bx[1]*sk+bh*f;
 const K=port3dKit(),{put,at}=K,hash=(x,y)=>{const s=Math.sin(x*91.7+y*47.3)*43758.5453;return s-Math.floor(s)};
 // bok: srodkowy pas obrazka (najmniej skrocony perspektywa) + jego lustro = kafel bez szwu, 3 kafle na obwod
 const side=(()=>{const c=canvas(140,256),g=c.getContext('2d');const sx=X(.32),sy=Y(.207),sw=bw*.32,sh=Y(.974)-sy;g.drawImage(img,sx,sy,sw,sh,0,0,70,256);g.save();g.translate(140,0);g.scale(-1,1);g.drawImage(img,sx,sy,sw,sh,0,0,70,256);g.restore();const t=new THREE.CanvasTexture(c);t.wrapS=THREE.RepeatWrapping;t.repeat.set(3,1);t.anisotropy=4;return t})();
 // wieko: elipsa z gory obrazka rozciagnieta do kola
 const lid=(()=>{const c=canvas(128,128),g=c.getContext('2d');g.drawImage(img,X(.115),Y(.01),bw*.774,bh*.183,0,0,128,128);return new THREE.CanvasTexture(c)})();
 const mat=map=>{const m=phong({map,shininess:4,specular:0x080808});m.color.setRGB(.74,.72,.7);return m};
 const sideM=mat(side),lidM=mat(lid);
 const BODY=new THREE.LatheGeometry([[.40,0],[.465,.22],[.5,.5],[.465,.78],[.40,1]].map(([a,b])=>new THREE.Vector2(a,b)),18),DISC=new THREE.CircleGeometry(1,18);
 const E=new THREE.Euler(),M=new THREE.Matrix4();
 const barrel=(b,h)=>{const r=.24+h*.03,H=.6+h*.08,tip=h>.82;
  if(tip)b=b.clone().multiply(M.makeTranslation(0,r*.98,0).clone()).multiply(M.makeRotationFromEuler(E.set(0,0,Math.PI/2)).clone()).multiply(M.makeTranslation(0,-H/2,0).clone());
  else b=b.clone().multiply(M.makeRotationFromEuler(E.set((h-.5)*.09,0,(hash(h,3)-.5)*.09)).clone());/* lekki przechyl: idealnie pionowe beczki wygladaly jak z prototypu */
  put(BODY,sideM,b,0,-.015,0,r*2,H,r*2);put(DISC,lidM,b,0,H-.017,0,r*.8,r*.8,1,-Math.PI/2);if(tip)put(DISC,lidM,b,0,-.013,0,r*.8,r*.8,1,Math.PI/2)};
 // pozycje rozstrzyga composeWorldProps (przez p.obj.mesh), wiec modele powstaja dopiero w finish(), po tym kroku
 const PROXY_GEO=new THREE.PlaneGeometry(1.6,1.6);/* zastepnik p.obj.mesh (nie trafia do sceny): inne kroki czytaja z niego polozenie, skale i szerokosc siatki (cien pod rekwizytem) */
 const list=[];
 const place=p=>{const proxy=new THREE.Mesh(PROXY_GEO);proxy.position.set(p.x,0,p.y);p.obj={mesh:proxy};list.push([p,proxy])};
 const finish=()=>{for(const [p,m] of list){const h=hash(p.x,p.y);barrel(at(m.position.x,m.position.z-.42,(p.flip?Math.PI:0)+h*6.28),h)}list.length=0;
  /* oznaczone jak rekwizyty: softenProps przyciemnia je tym samym odcieniem co obrazki rozdz. I */
  const g=new THREE.Group();K.finish(g);for(const c of g.children)c.userData.propAsset=true;ROOT.add(g)};
 return {place,finish}}
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
  const houseGeo=new THREE.BoxGeometry(1,1.9,1);houseGeo.translate(0,.95,0);
  const pal=[0,1].map(i=>stackTex(Wl,[[i*3,7],[i*3+1,7],[i*3+2,7]]));
  const logs=[0,1,2,3].map(i=>stackTex(Wl,[[(i*2)%8,1],[(i*3+1)%8,0],[(i*5+2)%8,2]]));
  const gP=[[],[]],gH=[[],[],[],[]];
  for(const [x,y,t] of walls){if(t===48)gH[(x*7+y*3)%4].push([x,y]);else gP[(x+y)&1].push([x,y])}
  gP.forEach((list,i)=>{if(!list.length)return;const side=HD1?worldSurf(cutaway(phong({color:i?0xd4ccc4:0xc8c0b8})),I.wl_palisada,3,'a'):cutaway(phong({map:pal[i]}));depthWall(palGeo,side,1);instanced(palGeo,[side,side,capMat,capMat,side,side],list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5))});
  const houseCap=I.p1_roof_burnt?worldSurf(cutaway(phong({color:0xffffff})),I.p1_roof_burnt,2.5,'a'):capMat;
  gH.forEach((list,i)=>{if(!list.length)return;const side=HD1?worldSurf(cutaway(phong({color:[0xd0c4b8,0xc8bcb0,0xd4c8bc,0xccc0b4][i]})),I.wl_chata,3,'a'):cutaway(phong({map:logs[i]}));depthWall(houseGeo,side,1);instanced(houseGeo,[side,side,houseCap,houseCap,side,side],list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5))});
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
  const R3=REK3D_ON?rek3dBuild(ROOT,I):null;WORLDS[CH].rek3d=R3;
  for(const p of PROPS){
    let frames,rc;
    if(R3&&REK3D_KEYS.has(p.k)&&!p.anim&&p.shrine===undefined){R3.place(p);continue}
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
  for(const [x,y,t] of walls){
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
  // golden domes wrapped in the Z2 dome texture
  let goldT=texFrom(tcut(ZW,2,3),true);goldT.repeat.set(8,2);if(I.rf_goldm){goldT=wallTex(I.rf_goldm).clone();goldT.needsUpdate=true;goldT.repeat.set(5,2)}
  const goldM=cutCircle(phong({map:goldT,specular:0xb08a40,shininess:22,emissive:0x1a1004}));
  const drumT=texFrom(tcut(ZW,3,2),true);drumT.repeat.set(8,1);const drumM=cutCircle(phong({map:drumT}));
  // 15.11.2026 (punkt centralny): tylko bazylika lsni czystym zlotem; kopuly kamienic, palacu i kaplicy sa zasniedziale, wiec glowna kopula jest jedynym jasnym akcentem mapy
  const agedM=cutCircle(phong({map:goldT,color:0x857a68,specular:0x3a3020,shininess:9}));
  const winM=cutCircle(phong({color:0x000000,emissive:0xffaa52}));
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
  for(const [x,z,rad,k] of DOMES)dome(MP(x),MP(z),rad*MK,{c:4,h:3.2,s:3,p:4.5}[k],k);
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
  if(I.p3_roof_tile&&I.p3_roof_tile_gold&&I.p3_roof_ridge)HOUSES.forEach((B,i)=>gable(B,[1,3,6].includes(i)?'p3_roof_tile_gold':'p3_roof_tile'));
  else for(const B of [[3,3,7,6],[3,12,7,6],[13,22,7,5],[55,3,6,7]]){const {x,y,w,h}=SR({x:B[0],y:B[1],w:B[2],h:B[3]});const m=new THREE.Mesh(pyr,slate);m.scale.set(w,2.2,h);m.position.set(x+w/2,3.2+1.1,y+h/2);m.castShadow=true;m.receiveShadow=true;ROOT.add(m)}
  for(const B of SHACKS){if(I.p3_roof_shack&&I.p3_roof_ridge){gable(B,'p3_roof_shack',2.8,1.3);continue}const {x,y,w,h}=SR({x:B[0],y:B[1],w:B[2],h:B[3]});const m=new THREE.Mesh(pyr,thatch);m.scale.set(w+.3,1.5,h+.3);m.position.set(x+w/2,2.8+.75,y+h/2);m.castShadow=true;m.receiveShadow=true;ROOT.add(m)}
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
  const R3=REK3D_ON?rek3dBuild(ROOT,I,I.p3_barrel?'p3_barrel':'p1_barrel'):null;WORLDS[CH].rek3d=R3;
  for(const p of PROPS){let frames,rc;
    if(R3&&REK3D_KEYS.has(p.k)&&!p.anim&&p.shrine===undefined&&!p.still){R3.place(p);continue}
    if(ANIM[p.anim]){const [k,n]=ANIM[p.anim];frames=[...Array(n).keys()].map(i=>PF[k+'_'+i]);rc=RC[k+'_0']}
    else if(p.shrine!==undefined){frames=[PF.healing_shrine,PF.depleted_shrine];rc=RC.healing_shrine}
    else{const k=p.still||p.k;frames=[PF[k]];rc=RC[k]}
    const o={mesh:mkProp(frames,p.x,p.y,rc),frames,fps:p.anim==='bloom'?4:p.anim?6:0,ph:Math.random()*3,kind:p.shrine!==undefined?'shrine':p.anim?'anim':'static',si:p.shrine};
    if(p.k==='beggar_bodies'||p.k==='doorway_bones')o.mesh.castShadow=false;if(p.flip)o.mesh.scale.x*=-1;propObjs.push(o)}
}

// Chapter IV meshes: K1 ground, K2 walls (rock rim, palisade, watchtower), K3 trees and big nature props (64 px cells drawn at 16 px per tile)
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
  gP.forEach(l=>addWalls(l,2.3,I.wl_obozpal?{w:[I.wl_obozpal,3]}:stackTex(WL,[[rc(),0],[rc(),0],[rc(),0]]),I.wl_obozpal?{w:[I.wl_obozpal,3]}:texFrom(tcut(WL,rc(),0),true),I.wl_obozpal?0xd0c8c0:0xffffff));
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
  const R3=REK3D_ON?rek3dBuild(ROOT,I):null;WORLDS[CH].rek3d=R3;
  for(const p of PROPS){if(OBJ[p.k]||p.stone!==undefined)continue;let frames,rc2;
    if(R3&&REK3D_KEYS.has(p.k)&&!p.anim&&p.shrine===undefined){R3.place(p);continue}
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
    pillars.forEach(([x,y],i)=>putObj((x*3+y)%2?'pillar_a':'pillar_b',x+.5,y+.92,false));
    // 13.11.2026: koksownik z nowych klatek p2_brazier (wyrownana podstawa) zamiast dwoch roznych rysunkow z arkusza
    const BZ=[0,1,2,3].map(i=>I['p2_brazier_'+i]?procFrame(I['p2_brazier_'+i],0,0,64,64,'prop'):null),BZok=BZ.every(Boolean);
    if(BZok){BZ.forEach(f=>cutCircle(f.n));OBJ.brazier_0[4]=.52}
    for(const [x,y] of braziers){const fr=BZok?BZ:[FR.brazier_0,FR.brazier_1],m=putObj('brazier_0',x+.5,y+.92,false);if(BZok){m.material=BZ[0].n;m.customDistanceMaterial=BZ[0].d}propObjs.push({mesh:m,frames:fr,fps:BZok?6:5,ph:Math.random()*3})}
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


