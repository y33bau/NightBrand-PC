// Chapter II meshes: M4 floor, M5 walls, M6 props, M8 transitions
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

// Chapter I meshes: M1 ground, M2 walls, M3 props
function buildBrzeznica(I){
  const F=I.br_ground,Wl=I.br_walls,r=rng(77);planGround(1);
  const fc=canvas(WW,WH),fg=fc.getContext('2d');
  const tile=(c,row,tx,ty)=>groundTile(fg,F,c,row,tx,ty);
  const ROW={40:0,41:1,42:2,43:3,44:4,46:6,47:7,48:3,21:2};
  for(let ty=0;ty<MH;ty++)for(let tx=0;tx<MW;tx++){let t=tileAt(tx,ty);if(t===31)t=W.under[ty*MW+tx]||42;if(t===45||t===90)continue;
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
  gH.forEach((list,i)=>{if(!list.length)return;const side=HD1?worldSurf(cutaway(phong({color:[0xd0c4b8,0xc8bcb0,0xd4c8bc,0xccc0b4][i]})),I.wl_chata,3,'a'):cutaway(phong({map:logs[i]}));depthWall(houseGeo,side,1);instanced(houseGeo,[side,side,capMat,capMat,side,side],list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5))});
  // stagnant pond (row 5 animated)
  waterFrames=[0,1,2,3].map(i=>tcut(F,i,5));
  const wGeo=new THREE.PlaneGeometry(1,1);wGeo.rotateX(-Math.PI/2);
  if(I.cc0_water&&(waters.length||(W.shallow||[]).length)){waterHD(I.cc0_water,W.shallow,.012,4,0x86907c,false);waterHD(I.cc0_water,waters,.014,4,0x4a5c80,true);{const all=waters.concat(W.shallow||[]);shoreFX(all,all,.02,'water',true)}}else
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
    propObjs.push({mesh:mkProp(frames,p.x,p.y,rc),frames,fps:p.anim?6:0,ph:Math.random()*3,kind:p.shrine!==undefined?'shrine':p.anim?'anim':'static',si:p.shrine});
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
    if(t===54){groundTile(fg,ZG,4+((r()*4)|0),4,tx,ty);continue}
    const s=SRC[t]||SRC[50];groundTile(fg,s[0],((r()*8)|0),s[1],tx,ty);
    if(t===21){fg.fillStyle='rgba(3,3,6,.6)';fg.fillRect(tx*16,ty*16,16,16)}}
  // Natural boundaries blend continuously in the atlas material.
  floorAO(fg,new Set([22,31,27]));
  groundDetails(fg);
  const floor=new THREE.Mesh(floorGeo,groundMaterial(phong({map:surfaceTex(fc),alphaTest:.5,color:0x9a8e90})));floor.position.set(MW/2,0,MH/2);floor.receiveShadow=true;ROOT.add(floor);
  // animated rot sludge on top of the pools (Z1 row 4, frames 0-3), faintly glowing
  W.rotTex=null;if(!lavaHD(I.cc0_lava,W.rots,.014,4,{color:0xc22a3a,emissive:0x6e0e1e,h:[.5,.035,.08],spd:.45,shin:70,spec:0x7a2030})){
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
  G.outer.forEach(l=>addWalls(l,4,ws('wl_fort',4)||stackE(ZW,[[rc(),2],[rc(),2],[rc(),2],[rc(),2]]),ws('wl_cap',3)||capT2,0xb8b0a8));
  G.house.forEach((l,i)=>addWalls(l,3.2,ws(i%2?'wl_win':'wl_town',WS)||stackE(ZW,[[rc(),0],[rc(),1],[rc(),1]]),ws('rf_gold',3)||capT,0xd8cdb8,true));
  G.cath.forEach(l=>addWalls(l,4,ws('wl_win',WS)||stackE(ZW,[[rc(),2],[rc(),2],[rc(),0],[rc(),2]]),ws('wl_cap',3)||capT,0xc8c0b0,true));
  addWalls(G.palace,4.5,ws('wl_town',WS)||stackE(ZW,[[rc(),2],[rc(),0],[rc(),1],[rc(),0],[rc(),2]]),ws('rf_goldm',3)||capT,0xd8cdb8,true);
  addWalls(G.chapel,3,ws('wl_win',WS)||stackE(ZW,[[rc(),2],[rc(),2],[rc(),2]]),ws('rf_gold',3)||capT,0xd8cdb8,true);
  G.mon.forEach(l=>addWalls(l,3,ws('wl_fort',4)||stackE(ZW,[[rc(),5],[rc(),5],[rc(),5]]),ws('wl_cap',3)||capT2));
  G.shack.forEach((l,i)=>addWalls(l,2.8,ws(i%2?'wl_win':'wl_town',5)||stackE(ZW,[[rc(),6],[rc(),6]]),ws('rf_goldm',3)||texFrom(tcut(ZW,6,6),true),0xd8cdb8));
  // golden domes wrapped in the Z2 dome texture
  let goldT=texFrom(tcut(ZW,2,3),true);goldT.repeat.set(8,2);if(I.rf_goldm){goldT=wallTex(I.rf_goldm).clone();goldT.needsUpdate=true;goldT.repeat.set(5,2)}
  const goldM=cutCircle(phong({map:goldT,specular:0xb08a40,shininess:22,emissive:0x1a1004}));
  const drumT=texFrom(tcut(ZW,3,2),true);drumT.repeat.set(8,1);const drumM=cutCircle(phong({map:drumT}));
  const dome=(x,z,rad,base)=>{
    const drum=new THREE.Mesh(new THREE.CylinderGeometry(rad*.98,rad,rad*.55,16),drumM);drum.position.set(x,base+rad*.275,z);
    const cup=new THREE.Mesh(new THREE.SphereGeometry(rad,16,7,0,Math.PI*2,0,Math.PI/2),goldM);cup.position.set(x,base+rad*.55,z);
    const ring=new THREE.Mesh(new THREE.CylinderGeometry(rad*1.04,rad*1.04,.14,16),goldM);ring.position.set(x,base+rad*.55,z);
    const lan=new THREE.Mesh(new THREE.CylinderGeometry(rad*.16,rad*.18,rad*.35,8),drumM);lan.position.set(x,base+rad*1.55+rad*.17,z);
    const spire=new THREE.Mesh(new THREE.ConeGeometry(rad*.2,rad*.55,8),goldM);spire.position.set(x,base+rad*1.9+rad*.27,z);
    for(const m of [drum,cup,ring,lan,spire]){m.castShadow=true;m.receiveShadow=true;ROOT.add(m)}};
  for(const [x,z,rad,k] of DOMES)dome(MP(x),MP(z),rad*MK,{c:4,h:3.2,s:3,p:4.5}[k]);
  // slate pyramid roofs and thatched shacks
  const slT=texFrom(tcut(ZW,1,4),true);slT.repeat.set(3,2);
  const slate=I.rf_gold?(()=>{const t=wallTex(I.rf_gold).clone();t.needsUpdate=true;t.repeat.set(3,2);return cutCircle(phong({map:t,flatShading:true}))})():cutCircle(phong({map:slT,flatShading:true})),thatch=cutCircle(phong({map:I.rf_goldm?(()=>{const t=wallTex(I.rf_goldm).clone();t.needsUpdate=true;t.repeat.set(2,2);return t})():texFrom(tcut(I.br_walls,1,5),true),color:I.rf_goldm?0xd8cdb8:0xb8a080,flatShading:true})),pyr=new THREE.ConeGeometry(Math.SQRT1_2,1,4);pyr.rotateY(Math.PI/4);
  for(const B of [[3,3,7,6],[3,12,7,6],[13,22,7,5],[55,3,6,7]]){const {x,y,w,h}=SR({x:B[0],y:B[1],w:B[2],h:B[3]});const m=new THREE.Mesh(pyr,slate);m.scale.set(w,2.2,h);m.position.set(x+w/2,3.2+1.1,y+h/2);m.castShadow=true;m.receiveShadow=true;ROOT.add(m)}
  for(const B of SHACKS){const {x,y,w,h}=SR({x:B[0],y:B[1],w:B[2],h:B[3]});const m=new THREE.Mesh(pyr,thatch);m.scale.set(w+.3,1.5,h+.3);m.position.set(x+w/2,2.8+.75,y+h/2);m.castShadow=true;m.receiveShadow=true;ROOT.add(m)}
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
  for(const [x,y] of braziers){const frames=[0,1,2,3].map(i=>PF['brazier_'+i]);propObjs.push({mesh:mkProp(frames,x+.5,y+.92,RC.brazier_0),frames,fps:6,ph:Math.random()*3})}
  for(const p of PROPS){let frames,rc;
    if(ANIM[p.anim]){const [k,n]=ANIM[p.anim];frames=[...Array(n).keys()].map(i=>PF[k+'_'+i]);rc=RC[k+'_0']}
    else if(p.shrine!==undefined){frames=[PF.healing_shrine,PF.depleted_shrine];rc=RC.healing_shrine}
    else{const k=p.still||p.k;frames=[PF[k]];rc=RC[k]}
    const o={mesh:mkProp(frames,p.x,p.y,rc),frames,fps:p.anim==='bloom'?4:p.anim?6:0,ph:Math.random()*3,kind:p.shrine!==undefined?'shrine':p.anim?'anim':'static',si:p.shrine};
    if(p.k==='beggar_bodies'||p.k==='doorway_bones')o.mesh.castShadow=false;propObjs.push(o)}
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
    if(WET.has(t)){const edge=D4.some(([dx,dy])=>!WET.has(gcode(tx+dx,ty+dy)));if(t===65&&edge)c=4+(c&3);else{c&=3;(t===64?W.fords:t===91?W.deepw:W.marsh).push([tx,ty])}}
    else if(D4.some(([dx,dy])=>gcode(tx+dx,ty+dy)===64)&&r()<.85){row=4;c=4+(c&3)}
    else if(t===67&&W.region(tx,ty)==='camp'){const q=r();if(q<.35){row=1}else c=q<.75?0:q<.92?2:1}
    groundTile(fg,G,c,row,tx,ty);
    if(t===21||t===68||t===69){fg.fillStyle='rgba(3,4,6,.55)';fg.fillRect(tx*16,ty*16,16,16)}}
  // Natural boundaries blend continuously in the atlas material.
  floorAO(fg,new Set([31,68,69]));
  groundDetails(fg);
  const floor=new THREE.Mesh(floorGeo,groundMaterial(phong({map:surfaceTex(fc),alphaTest:.5,color:0x8e98a6})));floor.position.set(MW/2,0,MH/2);floor.receiveShadow=true;ROOT.add(floor);
  // animated ford and marsh water on top of the ground (K1 rows 4 and 5, frames 0-3)
  if(I.cc0_water){W.water=[];waterHD(I.cc0_water,W.fords,.012,4,0x86907c,false);waterHD(I.cc0_water,W.marsh,.013,4,0x7c8a70,false);waterHD(I.cc0_water,W.deepw,.014,4,0x4a5c80,true);{const all=[].concat(W.fords||[],W.marsh||[],W.deepw||[]);shoreFX(all,all,.02,'water',true)}}
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
    const im=instanced(G2(o[2],o[3]),FR[k].n,byK[k],p=>M4.compose(V.set(p.x,0,p.y),Q.identity(),SC.set((p.flip?-1:1)*s*(p.artSmall?.62:1)*(p.tree?(.94+.06*Math.sin(p.x*.71+p.y*.39)):1),s*SQ*(p.artSmall?.62:1)*(k==='tall_pine'?.85:p.tree?(.94+.06*Math.sin(p.x*.71+p.y*.39)):1),s)),!low,false);im.customDistanceMaterial=FR[k].d;im.frustumCulled=false}
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
  const floor=new THREE.Mesh(floorGeo,groundMaterial(phong({map:surfaceTex(fc),alphaTest:.5,color:0x9a949c})));floor.position.set(MW/2,0,MH/2);floor.receiveShadow=true;ROOT.add(floor);
  // walls: every hall has its own face (r0 fortress stone, r1 bookcases, r2 black marble, r4 vault plates, r3 bars), roof caps from r6
  const box=h=>{const g=new THREE.BoxGeometry(1,h,1);g.translate(0,h/2,0);return g};
  const rc=()=>(r()*8)|0;
  const addWalls=(list,h,row,tint=0xffffff)=>{if(!list.length)return;const side=I.wl_fort?worldSurf(cutaway(phong({color:tint})),I.wl_fort,4,'a'):cutaway(phong({map:stackTex(WL,[[rc(),row],[rc(),row],[rc(),row]]),color:tint})),cap=I.wl_cap?worldSurf(cutaway(phong({color:tint})),I.wl_cap,3,'a'):cutaway(phong({map:texFrom(tcut(WL,rc(),6),true),color:tint}));instanced(depthWall(box(h),side,5),[side,side,cap,cap,side,side],list,([x,y])=>M4.makeTranslation(x+.5,0,y+.5)).frustumCulled=false};
  const WROW={dziedziniec:0,kancelaria:1,sala:2,skarbiec:4,krypta:0,tron:2};
  const rim=[[],[]],bars=[],inner={};
  for(const [x,y,t] of walls){if(t===80)bars.push([x,y]);else if(t===21)rim[(x+y)&1].push([x,y]);else{const k=W.region(x,y);(inner[k]=inner[k]||[[],[]])[(x+y)&1].push([x,y])}}
  rim.forEach(l=>addWalls(l,4.4,0,0x8a8890));
  for(const k in inner)inner[k].forEach(l=>addWalls(l,3.4,WROW[k]));
  addWalls(bars,2.2,3);
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
    for(const [x,y] of braziers){const fr=[FR.brazier_0,FR.brazier_1],m=putObj('brazier_0',x+.5,y+.92,false);propObjs.push({mesh:m,frames:fr,fps:5,ph:Math.random()*3})}
    for(const p of PROPS)if(OBJ[p.k]){const artKey=p.k==='bench_a'?'bench_b':p.k;const m=putObj(artKey,p.x,p.y,false);p.obj={mesh:m}}
  }
  // K4 small props, 32 px cells; the healing shrine still comes from the Lower City sheet
  const RK={torch_0:[0,0],torch_1:[32,0],torch_2:[64,0],torch_3:[96,0],scroll:[0,32],book:[32,32],inkwell:[64,32],seal:[96,32],chains_0:[0,64],chains_1:[32,64],shackles:[64,64],skull:[96,64],
    chair:[0,96],desk:[32,96],inkbarrel:[64,96],cart:[96,96],pages_0:[0,128],pages_1:[32,128],raven_0:[64,128],raven_1:[96,128],purse:[0,160],goblet:[32,160],keys:[64,160],swordbooks:[96,160]};
  const KF={};if(I.p1_order_bonfire)KF.order_bonfire=procFrame(I.p1_order_bonfire,0,0,32,32,'prop');for(const k in RK){if(I['p5_'+k])KF[k]=procFrame(I['p5_'+k],0,0,32,32,'prop');else if(KP)KF[k]=procFrame(KP,RK[k][0],RK[k][1],32,32,'prop')}
  const ANIM={torch:['torch',4,6],chains:['chains',2,2],pages:['pages',2,2.5],raven:['raven',2,1.5]};
  for(const p of PROPS){if(p.obj&&BG&&p.shrine===undefined)continue;
    const sh=p.shrine!==undefined;let frames,fps=0;
    if(sh)frames=[PF.healing_shrine,PF.depleted_shrine];
    else if(p.anim&&ANIM[p.anim]&&KF[ANIM[p.anim][0]+'_0']){const [k,n,f]=ANIM[p.anim];frames=[...Array(n).keys()].map(i=>KF[k+'_'+i]);fps=f}
    else if(KF[p.k])frames=[KF[p.k]];
    else frames=[PF[p.k]];
    if(!frames[0])continue;
    const o={mesh:mkProp(frames,p.x,p.y,[0,0,32,32]),frames,fps,ph:Math.random()*3,kind:sh?'shrine':fps?'anim':'static',si:p.shrine,prop:p};
    {const SCL={scroll:.2,book:.17,inkwell:.16,seal:.14,pages:.18,purse:.2,goblet:.18,keys:.16,shackles:.24,skull:.24,swordbooks:.28,chair:.48,desk:.5,inkbarrel:.42,cart:.5,order_bonfire:.8,torch:.5,chains:.5,healing_shrine:.75},c=SCL[p.k]||SCL[p.anim]||1;if(c!==1)o.mesh.scale.set(c,SQ*c,c)}
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

