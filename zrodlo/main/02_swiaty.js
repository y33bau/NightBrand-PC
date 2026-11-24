/* ============ WORLDS ============ */
// Each chapter has its own tile map, props, NPCs, lights and meshes. useWorld(ch) swaps the active one.
// 14.11.2026: szesc rozdzialow. Solne Nabrzeze to rozdzial III kampanii, ale ma numer techniczny 6 (zapisy s3-s5 i tablice rozdzialow zostaja bez zmian).
// CAMPAIGN = kolejnosc kampanii; chNo = numer widoczny dla gracza; chRoman = ten numer rzymski; chPrev/chNext = sasiedzi w kampanii.
const PORT=6,CAMPAIGN=[1,2,6,3,4,5],ROMAN=['I','II','III','IV','V','VI'],chNo=c=>CAMPAIGN.indexOf(c)+1,chRoman=c=>ROMAN[chNo(c)-1]||'',chPrev=c=>CAMPAIGN[CAMPAIGN.indexOf(c)-1],chNext=c=>CAMPAIGN[CAMPAIGN.indexOf(c)+1];
const SOLID=new Set([21,22,23,24,27,31,45,48,58,59,68,69,78,80,91]),WALLC=new Set([21,48,58,59,78,80]),VOID=new Set([23,24,25]);
let CH=2,W=null,map,PROPS,START,SHRINES,region,walls,cliffs,pillars,lavas,braziers,waters,LSRC,propObjs;
const WORLDS={},WORLD_SEEDS={};
const tileAt=(x,y)=>(x<0||y<0||x>=MW||y>=MH)?21:map[y*MW+x];
const solidAt=(px,py)=>SOLID.has(tileAt(Math.floor(px/TS),Math.floor(py/TS)));
// 23.11.2026 (autor: do Heriego wchodzi tylko bohater): kafle W.heroOnly sa zamkniete dla wrogow i przywolancow
const heroOnlyAt=(px,py)=>{const h=W&&W.heroOnly;return !!h&&h.has(Math.floor(py/TS)*MW+Math.floor(px/TS))};
// schronienia (dom Heriego, chata Chojraka, sklep Margi): {x,y,w,h,door,tiles,kind,closed}
const shelterAt=(px,py)=>{const L=W&&W.shelters;if(!L)return null;const i=Math.floor(py/TS)*MW+Math.floor(px/TS);for(const s of L)if(s.tiles.has(i))return s;return null};
// nearest spot whose 3x3 surroundings are walkable (codes in ok) and free of props; used to place NPCs
function freeNear(map,PROPS,ok,x,y){for(let r=0;r<12;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const X=x+dx,Y=y+dy;let good=X>2&&Y>2&&X<GW-3&&Y<GH-3;
  for(let j=-1;j<=1&&good;j++)for(let i=-1;i<=1;i++)if(!ok.includes(map[(Y+j)*GW+X+i])){good=false;break}
  if(good&&!PROPS.some(p=>Math.abs(p.x-X-.5)<1.8&&Math.abs(p.y-Y-.5)<1.8))return[X,Y]}return[x,y]}
const GONE_PROPS=new Set(['impaled_head','crow_post','cz_skullpole']); // chapters I, III and IV: small stake/post props removed (cache 200); gibbets stay
function mapKit(fillWith,skip){const map=new Uint8Array(GW*GH).fill(fillWith),under=new Uint8Array(GW*GH),PROPS=[],clearways=new Set();
  const reserve=(x0,y0,w,h)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(x>0&&y>0&&x<GW-1&&y<GH-1)clearways.add(y*GW+x)};
  const set=(x,y,v)=>{if(x>0&&y>0&&x<GW-1&&y<GH-1)map[y*GW+x]=v};const fill=(x0,y0,w,h,v)=>{for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)set(x,y,v)};
  const prop=(k,x,y,solid,extra)=>{if(skip&&skip.has(k))return false;if(solid.some(([sx,sy])=>clearways.has(sy*GW+sx)))return false;PROPS.push(Object.assign({k,x,y},extra||{}));for(const [sx,sy] of solid){if(sx>0&&sy>0&&sx<GW-1&&sy<GH-1){under[sy*GW+sx]=map[sy*GW+sx];set(sx,sy,31)}}return true};
  return{map,under,PROPS,set,fill,prop,reserve,clearways}}

// Map scale: every chapter is generated on its own grid (GW x GH) and then stretched by MK to the shared big map (MW x MH = 104 x 91).
// Chapters I-III keep their hand-made 64x56 layouts (MK 1.625); chapter IV is generated directly on 80x70 (MK 1.3).
// FT(i) is the first big-map tile of source tile i, MP(u) maps a continuous source coordinate, GTX/GTY give the source tile of a big-map tile.
let MK=1.625,GW=64,GH=56,GTX=[],GTY=[];
const FT=i=>Math.ceil(i*MK-1e-9),MP=u=>{const i=Math.floor(u);return FT(i)+(u-i)*(FT(i+1)-FT(i))};
// 16.11.2026: odwrotnosc MP (wspolrzedna zrodlowa dla punktu wielkiej mapy); potrzebna, zeby odbicie lustrzane powstalo na wielkiej mapie, a nie w siatce zrodlowej
const mpInv=v=>{let lo=0,hi=GW;for(let k=0;k<40;k++){const m=(lo+hi)/2;if(MP(m)<v)lo=m;else hi=m}return lo};
const GRID={1:[64,56],2:[64,56],3:[64,56],4:[80,70],5:[80,70],6:[64,56],9:[64,56]};
function setGrid(ch){[GW,GH]=GRID[ch];MK=MW/GW;GTX=[];GTY=[];for(let X=0;X<MW;X++){let i=0;while(FT(i+1)<=X)i++;GTX[X]=i}for(let Y=0;Y<MH;Y++){let i=0;while(FT(i+1)<=Y)i++;GTY[Y]=i}}
const SR=B=>({x:FT(B.x),y:FT(B.y),w:FT(B.x+B.w)-FT(B.x),h:FT(B.y+B.h)-FT(B.y)});
// pillars and braziers stay single tiles; inlaid gold lines stay one tile thick; everything else is stretched block by block
const POINT_T=new Set([22,27]),LINE_T={29:20,51:50};
function upscaleWorld(w){const sm=w.map,su=w.under,map=new Uint8Array(MW*MH),under=new Uint8Array(MW*MH);
  const sat=(x,y)=>(x<0||y<0||x>=GW||y>=GH)?21:sm[y*GW+x];
  const floorNear=(x,y)=>{const c={};for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const t=sat(x+dx,y+dy);if(t===21||POINT_T.has(t)||t===31||LINE_T[t])continue;c[t]=(c[t]||0)+1}let b=20,bn=-1;for(const k in c)if(c[k]>bn){bn=c[k];b=+k}return b};
  for(let Y=0;Y<MH;Y++)for(let X=0;X<MW;X++){const sx=GTX[X],sy=GTY[Y],t=sat(sx,sy),i=Y*MW+X;let v=t;
    if(POINT_T.has(t)){if(X!==FT(sx)||Y!==FT(sy))v=floorNear(sx,sy)}
    else if(LINE_T[t]){const hz=LINE_T[t]&&(sat(sx-1,sy)===t||sat(sx+1,sy)===t),vt=sat(sx,sy-1)===t||sat(sx,sy+1)===t;
      if(!((X===FT(sx)||hz)&&(Y===FT(sy)||vt)))v=LINE_T[t]}
    // prop collision: the art stands at the bottom of the stretched block, so only its lowest row stays solid (unless the prop continues above)
    else if(t===31){if(sat(sx,sy-1)!==31&&Y<FT(sy+1)-1)v=su[sy*GW+sx]||floorNear(sx,sy);else under[i]=su[sy*GW+sx]}
    map[i]=v}
  for(const p of w.PROPS){p.x=MP(p.x);p.y=MP(p.y)}
  const px=v=>MP(v/TS)*TS;
  w.start={x:px(w.start.x),y:px(w.start.y)};w.shrines=w.shrines.map(s=>({x:px(s.x),y:px(s.y)}));
  for(const n of w.npcs){n.x=px(n.x);n.y=px(n.y);if(n.solid)n.solid=[FT(n.solid[0]),FT(n.solid[1])]}
  const reg=w.region,gx=GTX,gy=GTY,mk=MK;w.region=(x,y)=>reg(gx[x]??Math.floor(x/mk),gy[y]??Math.floor(y/mk));
  if(w.clearways){const keep=w.clearways;w.clearways=new Set();for(let Y=0;Y<MH;Y++)for(let X=0;X<MW;X++)if(keep.has(GTY[Y]*GW+GTX[X]))w.clearways.add(Y*MW+X)}
  if(w.roofs)w.roofs=w.roofs.map(([x,y,a,b])=>({x:FT(x),y:FT(y),w:FT(x+a)-FT(x),h:FT(y+b)-FT(y)}));w.idle=[MP(w.idle[0]),MP(w.idle[1]),w.idle[2]*MK,w.idle[3]*MK];w.map=map;w.under=under;return w}
setGrid(1);

// Chapter II: the Lower City (layout from the M9 concept)
function genDolne(){
  const {map,under,PROPS,set,fill,prop,reserve,clearways}=mapKit(21);
  reserve(32,22,12,4);reserve(48,10,5,28);reserve(16,8,5,32);
  fill(3,8,32,32,20);fill(1,23,2,2,20);
  fill(6,3,26,4,20);fill(10,7,5,1,20);fill(23,7,5,1,20);
  fill(6,41,26,7,20);fill(10,40,5,1,20);fill(23,40,5,1,20);
  for(const x of [9,15,21,27]){set(x,2,20);prop('king_statue',x+.5,2.92,[[x,2]],{flip:x>18});set(x,48,20);prop('king_statue',x+.5,48.92,[[x,48]],{flip:x>18})}// 15.11.2026: posagi po obu stronach osi patrza ku srodkowi
  for(const y of [11,15,19,28,32,36])for(const x of [10,26])set(x,y,22);
  for(const y of [15,32])for(const x of [10,26])set(x,y,27); // 22.11.2026: srodek wielkiej sali byl ciemny (16 pol od koksownikow): 4 srodkowe filary -> koksowniki, ta sama kolizja (1 pole)
  for(let x=3;x<35;x++){set(x,23,29);set(x,24,29)}
  fill(35,1,5,GH-2,23);fill(35,22,5,4,25);
  fill(40,6,22,36,20);fill(41,13,20,2,24);fill(41,33,20,2,24);fill(48,13,5,2,20);fill(48,33,5,2,20);
  fill(53,42,6,3,32);fill(42,45,19,7,32);
  // 16.11.2026: koksowniki przy moscie (osi 37, kafel x <-> 74-x): 30 i 44 zamiast 30 i 42, ta sama odleglosc od przepraw
  [[7,21],[7,26],[14,21],[14,26],[22,21],[22,26],[30,21],[30,26],[8,5],[29,5],[8,43],[29,43],[16,46],[21,46],[46,50],[58,46],[44,21],[44,26],[60,21],[60,26],[44,9],[58,9],[44,38],[58,38]].forEach(([x,y])=>set(x,y,27));
  prop('healing_shrine',4.5,38.92,[[4,38]],{shrine:0});prop('healing_shrine',60.5,40.92,[[60,40]],{shrine:1});
  for(const x of [12,18,24]){prop('sarcophagus',x+.5,4.92,[[x,4]],{flip:x>18});prop('sarcophagus',x+.5,45.92,[[x,45]],{flip:x>18})}
  // runda 296: dzielnice jak w SimCity, duze rekwizyty przy scianach, srodek sal wolny
  const W1=(k,x,y,ex)=>prop(k,x+.5,y+.92,[[x,y]],ex);
  // sala: sztandary i zbrojownia przy polnocnej i poludniowej scianie, zwalony filar w rogu
  for(const y of [8,39]){for(const x of [6,15,21,33])W1('clan_banner',x,y,{flip:x>18});for(const x of [8,31])W1('pickaxe_rack',x,y);prop('fallen_pillar',29,y+.92,[[28,y],[29,y]])}
  // 24.11.2026 (grafik, standard map): nawy boczne wielkiej sali jako sceny przy krawedziach, nawa glowna wolna do walki:
  // pod zachodnim murem rzad grobow przodkow (sarkofagi jeden przy drugim), wzdluz krawedzi przepasci zbrojownia klanu (stojaki w linii jak balustrada)
  if(nbParam('std')!=='0'){fill(16,7,5,1,20);fill(16,40,5,1,20);/* przejscia w osi nawy do obu krypt: nawa prowadzi do centralnego sarkofagu przodka, nie w sciane */for(const y of [13,15,17,30,32,34])W1('sarcophagus',4,y);for(const y of [12,14,16,31,33,35])W1('pickaxe_rack',33,y)}
  W1('rune_lantern',4,9,{stone:0});W1('rune_lantern',9,38,{stone:2});W1('chains',3,12);W1('chains',33,34);
  for(const [x,y] of [[34,21],[34,26],[40,21],[40,26]])W1('rune_lantern',x,y);
  // kuznia: piece z miechami przy polnocnej scianie, kowadla na brzegach lawy, wozki i stojaki przy wschodniej scianie
  prop('furnace',45,6.92,[[44,6],[45,6]],{anim:'furnace'});W1('bellows',46,6);
  prop('gate',51,6.92,[[49,6],[50,6],[51,6],[52,6]],{sheet:'trans',gate:true});
  prop('furnace',57,6.92,[[56,6],[57,6]],{anim:'furnace'});W1('bellows',55,6);
  W1('clan_banner',61,7);W1('clan_banner',41,7);W1('rune_lantern',60,9,{stone:1});
  for(const [x,y] of [[44,15],[57,15],[44,32],[57,32]])W1('anvil',x,y);
  W1('pickaxe_rack',60,11);W1('pickaxe_rack',60,20);W1('mine_cart',60,17);W1('mine_cart',60,24);
  W1('black_powder',59,30);W1('black_powder',41,36);W1('rune_lantern',60,37,{stone:3});W1('chains',41,10);W1('chains',41,38);
  // 12.11.2026: warsztaty miedzy kanalami lawy (pas x48..52 wolny): kowadla, proch, stojaki; kosci jako drobiazgi
  for(const [k,x,y] of [['anvil',45,20],['anvil',45,27],['black_powder',42,18],['pickaxe_rack',41,29],['anvil',55,20],['anvil',55,28],['black_powder',58,27],['pickaxe_rack',46,39],['mine_cart',56,39],['anvil',44,11],['black_powder',59,11]])W1(k,x,y);
  for(const [x,y] of [[46,30],[54,17],[53,37],[43,40]])prop('dwarf_bones',x+.5,y+.92,[],{floorDetail:true});
  // kopalnia: stojaki przy polnocnej scianie, wozki przy poludniowej, skład prochu przy wschodniej
  for(const x of [43,47,51])W1('pickaxe_rack',x,45);
  for(const x of [44,50])W1('mine_cart',x,51);
  prop('fallen_pillar',53,51.92,[[52,51],[53,51]]);
  W1('black_powder',59,46);W1('black_powder',57,50);W1('chains',60,49);

  const r=rng(31);
  for(let i=0,n=0;i<500&&n<14;i++){const x=3+((r()*58)|0),y=3+((r()*(GH-6))|0);if(map[y*GW+x]!==20||clearways.has(y*GW+x))continue;n++}
  for(let y=1;y<GH-1;y++)for(let x=1;x<GW-1;x++){if(map[y*GW+x]!==20)continue;const q=r();if(q<.03)set(x,y,30);else if(q<.12)set(x,y,26)}
  return{map,under,PROPS,clearways,start:{x:6*TS+8,y:23*TS+14},shrines:[{x:4*TS+8,y:38*TS+12},{x:60*TS+8,y:40*TS+12}],
    region:(x,y)=>x>=40&&y>=42?'mine':x>=40?'forge':'hall',
    npcs:[{id:'tharm',art:'tharm',name:(EN?'Tharm\'s Ghost':'Duch kowala Tharma'),x:52*TS+8,y:24*TS+12,lines:THARM_LINES},
          (()=>{const [x,y]=freeNear(map,PROPS,[20,26,30],22,34);return{id:'mila',art:'mila',name:(EN?'Mila, the Amazon':'Mila, amazonka'),x:(x+.5)*TS,y:(y+.4)*TS,lines:MILA_LINES}})(),
          (()=>{const [x,y]=freeNear(map,PROPS,[20,26,30],46,46);return{id:'rudna',art:'rudna',name:(EN?'Rudna, Listener of the Veins':'Rudna, Słuchaczka Żył'),x:(x+.5)*TS,y:(y+.4)*TS,lines:RUDNA_LINES}})()],idle:[18,23,12,8]};
}

// Chapter I: the burned village of Brzeźnica
// codes: 40 road, 41 ash, 42 dead grass, 43 charred planks, 44 rubble, 45 water, 46 graveyard, 47 blood mud, 48 house wall, 21 palisade/outside
// Chapter III: Solne Nabrzeze, the river harbour below Goldheim (technical number 6)
// codes: 40 stone quay, 42 slipway, 43 planks (piers, ferry deck), 45 river, 47 salt yard, 48 building / retaining wall, 27 brazier
const PORT_BUILDINGS=[[7,18,4,7,'store'],[15,18,3,6,'shed'],[55,20,4,7,'shed'],[39,27,4,4,'office'],[21,27,3,3,'inn']];// [x,y,w,h,kind]; 'store' = sklad przechodni (bramy od polnocy i poludnia)
const PORT_FERRY_DECK=[28,2,9,4],PORT_LIFT=[32,52];
function genSolneNabrzeze(){
 const {map,under,PROPS,set,fill,prop,reserve,clearways}=mapKit(45);
 const at=(x,y)=>map[y*GW+x];
 const areas=[[27,43,10,8,43],[29,33,6,12,40],[20,26,24,12,40],[10,29,14,5,42],
 [5,13,15,19,47],[10,10,15,5,43],[23,9,19,11,40],[40,10,15,5,43],
 [47,13,14,19,40],[41,29,12,5,42],[30,18,5,9,40],[31,6,3,5,43]];
 for(const a of areas)fill(...a);
 fill(...PORT_FERRY_DECK,43);
 // Southern freight walk: two elbow piers meet the landing and the side yards.
 const piers=[[11,31,5,14],[11,44,18,5],[48,31,5,14],[36,44,17,5]];
 for(const [x,y,w,h] of piers)for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(at(i,j)===45)set(i,j,43);
 // The lift head: a stone terrace under the retaining wall of the Lower City shaft.
 fill(25,46,14,6,40);fill(21,52,22,2,48);
 for(const [x,y,w,h,kind] of PORT_BUILDINGS){fill(x,y,w,h,48);if(kind==='store')fill(x+1,y,2,h,43)}
 const brazier=(x,y)=>{under[y*GW+x]=at(x,y);set(x,y,27)};
 for(const [x,y] of [[29,11],[35,11],[27,47],[36,47],[24,27],[37,36]])brazier(x,y);

 const port=(k,x,y,solid,extra)=>prop(k,x+.5,y+.92,solid?[[x,y]]:[],Object.assign({port:true},extra||{}));
 port('winch',12,14,true);port('winch',53,14,true,{flip:true});port('crane',57,17,true);port('crane',18,11,true,{flip:true});
 // cargo waiting for a crossing that never came
 for(const [x,y,f] of [[8,16],[17,26,1],[6,28],[52,22],[35,3,1],[59,15],[60,28,1],[24,13],[40,16,1],[11,19,1],[50,17],[12,45,1],[51,45],[22,31],[37,28,1],[43,28,1]])port('cargo',x,y,true,{flip:!!f});
 for(const [x,y,f] of [[6,21],[13,25,1],[14,30],[6,14,1],[11,21],[11,20],[5,25],[12,27,1],[19,28,1],[53,23],[29,3]])port('salt',x,y,true,{flip:!!f});
 for(const [x,y] of [[24,18],[40,18],[23,10],[41,10],[48,12],[19,12],[28,44],[35,44],[26,49],[37,49],[11,33],[15,43],[52,33],[48,43],[23,37],[40,37],[10,10],[54,10]])port('bollard',x,y,false);
 for(const [x,y,f] of [[9,26],[16,15,1],[53,26,1],[58,13],[26,17,1],[22,36],[5,18,1],[10,31],[44,12,1],[13,12],[33,48,1],[60,19],[12,19],[21,31],[37,27],[37,29,1],[53,21],[43,29]])port('barrel',x,y,true,{flip:!!f});
 // 15.11.2026: zbutwiale rekwizyty opuszczonego portu (atlas port_rekwizyty): lodzie, pale i skaly z malzami w wodzie przy pomostach,
 // sieci, deski i wiecierze na pomostach, ikra na pochylniach, skrzynie, kotwica i wrak na placach skladowych. Przejscia sprawdzone (BFS od startu).
 for(const [k,x,y,solid,f] of [['lodz',8,38,0,0],['lodz',54,36,0,1],['lodz',38,5,0,1],['pale',10,44,0,0],['pale',54,43,0,1],['pale',22,8,0,0],['malze',20,39,0,0],['malze',45,39,0,1],['malze',42,8,0,1],['skrzynia',8,23,1,0],['skrzynia',54,23,1,1],['kotwica',55,28,1,0],['beczka_ryby',9,19,1,0],['beczka_ryby',45,14,1,1],['wiecierz',56,14,1,0],['wiecierz',11,40,1,1],['wrak',6,31,1,0],['wrak',59,21,1,1],['pacholek',15,35,1,0],['pacholek',48,35,1,1],['siec',13,38,0,0],['siec',50,39,0,1],['siec',17,12,0,0],['ikra',44,31,0,0],['ikra',19,32,0,1],['deski',13,46,0,0],['deski',50,46,0,1]])port(k,x,y,!!solid,{flip:!!f});
 // the Order's blockade on the salt square
 port('order_banner',28,26,true);port('order_banner',35,26,true);port('order_banner',26,10,true);port('order_banner',38,10,true);
 port('gallows',24,34,true);port('marga_cart',40,34,true);port('covered_corpses',38,35,false);port('covered_corpses',26,33,false,{flip:true});
 port('marga_cart',50,30,true,{flip:true});port('well',27,30,true);port('crow_post',43,36,true);/* 15.11.2026: z wody (44,36) na nabrzeze, w wodzie gra rysowala wokol pola czarna krawedz nabrzeza */port('crow_post',21,12,true);port('stocks',35,33,true);port('burnt_hay',57,28,false);port('dead_horse',46,33,true);/* 22.11: kolizja jak w rozdz. I */
 port('shop_sign',24,30,true);port('wheel',37,30,false);port('wheel',9,30,false,{flip:true});
 prop('shrine',16.5,28.92,[[16,28]],{port:true,shrine:0});prop('shrine',50.5,25.92,[[50,25]],{port:true,shrine:1});
 return {map,under,PROPS,clearways,roofs:[],start:{x:32*TS,y:49*TS+8},
 shrines:[{x:16*TS+8,y:29*TS+8},{x:50*TS+8,y:26*TS+8}],region:()=>'port',idle:[32,24,10,9],
 npcs:[{id:'przewoznik',art:'nawoj',name:EN?"Sulisław, the Old Ferryman":"Sulisław, stary przewoźnik",x:36*TS+8,y:17*TS+6,lines:EN?["I would know that ferry by her knock. One plank strikes the hull. Forty years I've heard it. Now I hear it in my sleep, though the ferry hasn't moved.", "I carried them across. Never asked why their hands were bound. I took the copper from the guard, not from them. I thought that made a difference.", "There is a winch on each quay, at the end of the pier. Let both chains go. He will hear it. He hears everything that leaves this bank."]:["Poznałbym ten prom po stukocie. Jedna deska bije o burtę. Czterdzieści lat ją słyszę. Teraz słyszę ją we śnie, choć prom stoi.", "Wiozłem ich. Nie pytałem, czemu mają związane ręce. Miedziaka brałem od strażnika, nie od nich. Myślałem, że to coś zmienia.", "Na każdym nabrzeżu stoi kołowrót, na końcu pomostu. Zwolnij oba łańcuchy. On to usłyszy. Słyszy wszystko, co odbija od tego brzegu."]},
  // 14.11.2026: celnik przed drzwiami kantoru (office 39,27,4x4) i karczmarka przed karczma (inn 21,27,3x3)
  {id:'ambrozy',art:'ambrozy',name:EN?"Ambroży, the Customs Clerk":"Ambroży, celnik z kantoru",x:40*TS+4,y:31*TS+8,lines:EN?["Don't come closer. I only count. I never laid a hand on anyone.", "I wrote the board by the landing. I have a neat hand. Here a neat hand gets you work. Nothing more.", "Salt went through this office. Then people. The same ledger, the same column. “Cargo, twelve head, to the capital, beneath the basilica.” I didn't know it could be written so easily.", "The last transport never sailed. They closed the crossing the day you broke the chain in the mine. They are standing by the pier. They have numbers, from me.", "Take this page. Their names are on it. Not numbers. Names. I wrote them down yesterday. I don't know why only yesterday.", "I won't change a single letter in the ledger. In the Citadel they chain you for one mistake. I would rather be guilty than wrong."]:["Nie podchodź. Ja tylko liczę. Nigdy nikogo nie dotknąłem.", "Tablicę przy przyczółku pisałem ja. Mam równe pismo. Za równe pismo dostaje się tu pracę. Nic więcej.", "Przez ten kantor szła sól. Potem ludzie. Ta sama księga, ta sama rubryka. „Ładunek, sztuk dwanaście, do stolicy, pod bazylikę”. Nie wiedziałem, że można to napisać tak łatwo.", "Ostatni transport nie odpłynął. Zamknęli przeprawę w dniu, w którym zerwałeś łańcuch w kopalni. Stoją przy pomoście. Mają ode mnie numery.", "Weź tę kartę. Są na niej ich imiona. Nie numery. Imiona. Spisałem je wczoraj. Nie wiem, czemu dopiero wczoraj.", "Nie zmienię w księdze ani litery. W Cytadeli zakuwają za jedną pomyłkę. Wolę być winny niż pomylony."]},
  {id:'wieslawa',art:'wieslawa',name:EN?"Wiesława, the Innkeeper":"Wiesława, karczmarka",x:22*TS+8,y:30*TS+8,lines:EN?["Sit. Don't eat. No one eats here anymore.", "The ones from the queue come every evening. They lay a copper on the table and stare into the bowl. I fill every one. If I stopped, I would have to admit they are dead.", "The Harbour Master's name is Radogost. The river took his leg. The Holy Order gave him another, of oak, and a purse of silver. With that silver we built this inn. He used to say: it's just work.", "You have his eyes. The ones from years ago. When he still believed a man could take another's gold and come home the same.", "When he swings the chain over his head, step out of line. The hook always flew true. He no longer does.", "When it's over, close his eyes. I tried. He wouldn't let me."]:["Siadaj. Nie jedz. Nikt tu już nie je.", "Ci z kolejki przychodzą co wieczór. Kładą miedziaka na stole i patrzą w miskę. Nalewam każdemu. Gdybym przestała, musiałabym przyznać, że nie żyją.", "Bosman ma na imię Radogost. Rzeka wzięła mu nogę. Zakon dał drugą, dębową, i sakiewkę srebra. Za to srebro postawiliśmy tę karczmę. Mówił: to tylko praca.", "Masz jego oczy. Te sprzed lat. Kiedy jeszcze wierzył, że można brać cudze złoto i wrócić do domu tym samym człowiekiem.", "Kiedy zakręci łańcuchem nad głową, zejdź z linii. Hak zawsze leciał prosto. Tylko on już nie.", "Jak będzie po wszystkim, zamknij mu oczy. Ja próbowałam. Nie dał."]}]};
}

function genBrzeznica(){
  const {map,under,PROPS,set,fill,prop,reserve,clearways}=mapKit(21,GONE_PROPS);const r=rng(1349);
  reserve(30,2,3,GH-4);reserve(2,27,GW-4,3);reserve(49,16,6,5);
  const at=(x,y)=>map[y*GW+x];
  fill(2,2,GW-4,GH-4,42);
  for(let y=2;y<GH-2;y++)for(let x=2;x<GW-2;x++){const v=Math.sin(x*.31)+Math.cos(y*.27)+Math.sin((x+y)*.17)+(r()-.5)*.8;if(v>1.35)set(x,y,41)}
  // the two roads and the village square
  fill(2,27,GW-4,3,40);fill(30,2,3,GH-4,40);
  for(let y=21;y<36;y++)for(let x=23;x<40;x++)if(Math.hypot((x-31)/7.8,(y-28)/6.6)<1)set(x,y,40);
  // graveyard to the north-east and a stagnant pond to the south-east
  fill(43,15,17,9,46);
  for(let y=29;y<38;y++)for(let x=44;x<61;x++){const q=Math.hypot((x-52.5)/6.6,(y-33.2)/2.9);if(q<1)set(x,y,q<.66?45:90)}
  // bajoro: sama płytka woda (runda 214)
  for(let y=14;y<22;y++)for(let x=17;x<28;x++)if(Math.hypot((x-22.2)/3.6,(y-17.6)/2.3)<1)set(x,y,90);
  // burned houses [x, y, w, h, door side]; the big one in the west is the barn where the order burned the villagers
  const H=[[6,5,9,7,'s'],[18,5,8,6,'s'],[38,5,8,7,'s'],[50,5,9,7,'s'],[6,37,8,7,'n'],[18,40,7,6,'n'],[38,40,9,7,'n'],[50,42,9,7,'n']];
  for(const [hx,hy,w,h,door] of H){
    for(let y=hy;y<hy+h;y++)for(let x=hx;x<hx+w;x++){const edge=x===hx||y===hy||x===hx+w-1||y===hy+h-1;set(x,y,edge?(r()<.17?44:48):43)}
    const mx=hx+(w>>1),my=hy+(h>>1);
    if(door==='s'){fill(mx-1,hy+h-1,3,1,43);reserve(mx-1,hy+h-3,3,5)}
    if(door==='n'){fill(mx-1,hy,3,1,43);reserve(mx-1,hy-2,3,5)}
    if(door==='e'){fill(hx+w-1,my-1,1,4,43);reserve(hx+w-3,my-1,5,4);if(w>=13){fill(mx-1,hy,3,1,43);reserve(mx-1,hy-2,3,5);fill(mx-1,hy+h-1,3,1,43);reserve(mx-1,hy+h-3,3,5)}}
  }
  // runda 291: dom Margi przy cmentarzu (sciany x50..59, y19..23); wejscia: dol (54-56), lewo (y20-21), prawo (y22), gora (x58)
  {const hx=50,hy=19,w=10,h=5;for(let y=hy;y<hy+h;y++)for(let x=hx;x<hx+w;x++){const edge=x===hx||y===hy||x===hx+w-1||y===hy+h-1;set(x,y,edge?((x*7+y*3)%6===0?44:48):43)}
   fill(54,23,3,1,43);fill(50,20,1,2,43);fill(59,22,1,1,43);fill(58,19,1,1,43);
   reserve(hx,hy,w,h);reserve(54,23,3,2);reserve(48,20,3,2);reserve(59,22,3,1);reserve(58,17,1,3);reserve(59,20,4,7);H.push([hx,hy,w,h,'s'])}
  fill(4,15,13,10,41); // runda 242: stodoły już nie ma, w jej miejscu pogorzelisko (ziemia z popiołem i żarem)
  // blood-soaked mud around the gallows, the stakes and the barn
  for(let i=0;i<90;i++){const c=[[35,32],[31,44],[17,20],[12,48],[28,25]][i%5],x=c[0]+((r()-.5)*7)|0,y=c[1]+((r()-.5)*5)|0;if(at(x,y)===40||at(x,y)===41||at(x,y)===42)set(x,y,47)}
  // square: well, gallows, Marga's cart
  // The well is already part of the elder illustration; omit the separate small prop.
  prop('gallows',35,32.92,[[34,32],[35,32]]);
  prop('marga_cart',52,25.92,[[51,25],[52,25]]);prop('marga_cart',57.5,26.92,[[56,26],[57,26]],{flip:true});for(const [sx,sy,ax,ay] of [[53.4,24.2,53,24],[53.6,24.9,53,23],[54,25.4,54,24],[56.6,24.9,56,23]])if(prop('shop_sign',sx,sy,[[ax,ay]]))break;for(const fx of [50.9,58.9])prop('house_fire',fx,24.2,[[Math.floor(fx),24]],{fire:true,big:true,anim:'hfire',keep:true});
  prop('crow_post',33.5,20.92,[[33,20]]);prop('covered_corpses',25.5,33.92,[]);
  // fires still burning in the ruins
  for(const [x,y,big] of [[16,9],[47,9],[26,43],[20,24,1],[24,24,1],[48,45],[25,30],[46,24]])prop('debris_fire',x+.5,y+.92,[[x,y]],{fire:true,big:!!big,anim:'fire'});
  prop('covered_corpses',18.5,23.92,[]);
  // the order's camp to the south-west: bonfire with a burnt stake and torn banners
  prop('order_bonfire',12.5,49.92,[[12,49]],{fire:true,big:true});prop('order_banner',9.5,47.92,[[9,47]]);prop('order_banner',15.5,47.92,[[15,47]]);
  // heads on stakes along the south road
  for(const y of [38,46])for(const x of [28,34])prop('impaled_head',x+.5,y+.92,[[x,y]]);
  // graveyard
  for(const cx of [46.7,46.2,47.2,45.7]){const tx=Math.floor(cx);if(prop('crypt_stairs',cx,2.92,[[tx-1,2],[tx,2],[tx+1,2]])){for(const [sx,sy] of [[tx-2,2],[tx+2,2]]){if(!clearways.has(sy*GW+sx)&&map[sy*GW+sx]!==31){under[sy*GW+sx]=map[sy*GW+sx];set(sx,sy,31)}}break}}
  // runda 298: szubienice cmentarza przeniesione w layoutPatch1
  for(const y of [17,21])for(const x of [45,48,56]){const k=r()<.5?'grave_cross':'tombstone';if(!((y===17&&x!==45)||(y===21&&x===45)))prop(k,x+.5,y+.92,[[x,y]])} // runda 298: r() zuzywane jak dawniej; (79,29),(92,29),(74,35) usuniete
  prop('dead_tree',58.5,17.92,[[58,17]]);prop('crow_post',43.5,23.92,[[43,23]]);
  // wayside shrines heal the wounded
  prop('shrine',24.5,13.92,[[24,13]],{shrine:0});prop('shrine',46.5,47.92,[[46,47]],{shrine:1});
  // clutter along the roads and yards
  for(const [k,x,y] of [['dead_horse',22,31],['wheel',36,26],['barrel',27,22],['barrel',17,12],['wheel',44,12],['burnt_hay',57,25],['barrel',21,37],['dead_horse',40,48],['burnt_hay',27,8],['wheel',13,33]].filter((_,i)=>i%3!==1))prop(k,x+.5,y+.92,['barrel','dead_horse'].includes(k)?[[x,y]]:[]);
  // dead trees along the palisade and in the corners
  for(let i=0;i<500;i++){const side=i%4,t=r();let x,y;if(side===0){x=3+((t*(GW-6))|0);y=3+((r()*2)|0)}else if(side===1){x=3+((t*(GW-6))|0);y=GH-4-((r()*2)|0)}else if(side===2){x=3+((r()*2)|0);y=3+((t*(GH-6))|0)}else{x=GW-4-((r()*2)|0);y=3+((t*(GH-6))|0)}
    if(r()>.22)continue;const c=at(x,y);if(c!==42&&c!==41)continue;if(PROPS.some(p=>p.k==='dead_tree'&&Math.abs(p.x-x)<3.5&&Math.abs(p.y-y)<3.5))continue;prop('dead_tree',x+.5,y+.92,[[x,y]])}
  return{map,under,PROPS,clearways,roofs:H,start:{x:31*TS+8,y:51*TS+8},shrines:[{x:24*TS+8,y:14*TS+8},{x:46*TS+8,y:48*TS+8}],region:()=>'village',
    npcs:[{id:'elder',art:'elder',name:(EN?'Dying Old Man':'Umierający przy studni'),x:29.6*TS,y:26.4*TS,lines:ELDER_LINES},
          {id:'marga',art:'marga',name:(EN?'Marga, the Bone Trader':'Marga, handlarka kości'),x:54.9*TS,y:21.1*TS,lines:MARGA_LINES},
          {id:'wit',art:'wit',name:(EN?'Brother Wit, Prisoner in the Stocks':'Brat Wit, więzień w dybach'),x:14.5*TS,y:30.92*TS,lines:WIT_LINES,solid:[14,30]},
          (()=>{const [x,y]=freeNear(map,PROPS,[40,41,42,47],27,15);return{id:'chojrak',art:'chojrak',name:(EN?'Chojrak, Lapsed Paladin':'Chojrak, paladyn bez Zakonu'),x:(x+.5)*TS,y:(y+.4)*TS,lines:CHOJRAK_LINES}})(),
          (()=>{const [x,y]=freeNear(map,PROPS,[41,40,42,44,47],10,20);return{id:'nawoj',art:'nawoj',name:(EN?'Nawoj, Keeper of Names':'Nawoj, Strażnik Imion'),x:(x+.5)*TS,y:(y+.4)*TS,lines:NAWOJ_LINES}})()],idle:[31,28,13,9]};
}

// Chapter III: Złotogród, the golden capital rotting under its domes
// codes: 50 street flagstones, 51 gold inlay, 52 cracked flagstones, 53 slum mud, 54 rot pool (slows), 55 blood mud, 56 monastery floor, 57 dead garden, 58 noble stone (houses, cathedral, palace), 59 slum shack
const CATH={x:24,y:14,w:16,h:10},PALACE={x:18,y:2,w:28,h:4},CHAPEL={x:8,y:41,w:5,h:4};
const SHACKS=[[3,37,4,3],[15,37,3,3],[20,39,4,2],[24,36,3,3],[3,46,3,3],[15,44,3,3],[20,47,3,3],[24,42,3,2],[37,38,4,3],[44,37,3,3],[50,38,4,2],[56,37,4,3],[38,45,3,3],[45,44,4,3],[52,46,3,3],[57,43,3,3],[8,50,4,2],[47,50,4,2],[24,50,3,2],[54,51,4,2]];
const HOUSES=[[3,3,7,6],[11,3,6,6],[3,12,7,6],[12,12,8,6],[3,22,7,6],[13,22,7,5],[47,3,6,6],[55,3,6,7]];
// 23.11.2026 (autor: nowe moduly Zlotogrodu): [x,y,w,h,rodzaj,front] w kaflach generatora; front = strona ulicy (S/N/E/W). Bryly mozna przestawiac i obracac zmieniajac tylko ten wpis
const ZL_NOWE=[[51,10,4,3,'wykusz','S'],[57,10,3,3,'podcien','S'],[13,19,5,3,'naroznik','S'],[3,32,5,3,'kaplica','E']];
const DOMES=[[32,19,3.6,'c'],[26.5,15.6,1.4,'c'],[37.5,15.6,1.4,'c'],[14,6,1.7,'h'],[16,15,1.8,'h'],[6.5,25,1.7,'h'],[50,6,1.7,'h'],[10.5,43,1.6,'s'],[32,3.9,1.6,'p']];
function genStolica(){
  const {map,under,PROPS,set,fill,prop,reserve,clearways}=mapKit(21,GONE_PROPS);const r=rng(4242);const at=(x,y)=>map[y*GW+x];
  reserve(30,24,4,30);reserve(30,6,4,8);reserve(10,9,3,24);reserve(20,8,3,28);reserve(40,7,3,19);reserve(40,30,3,6);
  reserve(41,20,6,5);reserve(49,29,6,7);reserve(3,40,26,2);reserve(35,41,26,3);reserve(3,49,26,2);
  const free=(x,y)=>[50,52,53,55,56,57].includes(at(x,y));
  const place=(k,x,y,extra,solid=true)=>{if(!free(x,y)||clearways.has(y*GW+x))return;prop(k,x+.5,y+.92,solid&&!['beggar_bodies','doorway_bones','wheel','burnt_hay'].includes(k)?[[x,y]]:[],extra)};
  fill(2,2,GW-4,GH-4,50);
  for(const B of [CATH,PALACE,CHAPEL])fill(B.x,B.y,B.w,B.h,58);
  for(const [x,y,w,h] of HOUSES)fill(x,y,w,h,58);
  // the fire monastery: a walled cloister with a pyre in the middle
  for(let x=43;x<=60;x++){set(x,14,58);set(x,32,58)}for(let y=14;y<=32;y++){set(43,y,58);set(60,y,58)}
  fill(44,15,16,17,56);fill(43,20,1,5,56);fill(49,32,6,1,56);
  for(const y of [17,20,26,29])for(const x of [47,56])set(x,y,22);
  for(const [x,y] of [[46,16],[57,16],[46,30],[57,30]])set(x,y,27);
  // slums in the south: mud, shacks and pools of rot around a gilded chapel of the poor
  for(let y=35;y<54;y++)for(let x=3;x<61;x++){if(x>=29&&x<=34||at(x,y)!==50)continue;const v=Math.sin(x*.4)+Math.cos(y*.5)+r()*.9;if(y>37||v>.8)set(x,y,53)}
  for(const [x,y,w,h] of SHACKS)fill(x,y,w,h,59);
  // dead gardens of the nobles
  for(const [x,y,w,h] of [[3,19,7,2],[10,18,2,3],[12,28,7,3],[3,29,6,3],[17,9,2,3]])for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(at(xx,yy)===50&&r()<.85)set(xx,yy,57);
  // golden processional way: city gate -> plaza -> cathedral, and on to the palace behind it
  for(let y=24;y<54;y++){set(31,y,51);set(32,y,51)}for(let y=6;y<14;y++){set(31,y,51);set(32,y,51)}
  const frame=(x0,y0,x1,y1)=>{for(let x=x0;x<=x1;x++){set(x,y0,51);set(x,y1,51)}for(let y=y0;y<=y1;y++){set(x0,y,51);set(x1,y,51)}};
  frame(25,26,38,33);frame(23,7,40,12);
  for(let i=0;i<500;i++){const x=3+((r()*58)|0),y=3+((r()*50)|0);if(at(x,y)===50&&r()<.5)set(x,y,52)}
  // rot pools
  for(const [cx,cy,rx,ry] of [[7,43,1.4,1],[19,42,1.6,1.2],[14,51,2.4,1.3],[40,42,1.8,1.4],[54,41,2,1.3],[43,48,1.7,1.2],[27,47,1.5,1.2],[58,49,1.6,1.4],[21,31,1.4,1],[41,35,1.5,1],[10,34,1.6,1],[45,11,1.4,1],[11,48,1.2,1],[20,20,1.2,1]])
    for(let y=Math.floor(cy-ry-1);y<=cy+ry+1;y++)for(let x=Math.floor(cx-rx-1);x<=cx+rx+1;x++)if(Math.hypot((x-cx)/rx,(y-cy)/ry)<1+r()*.35&&[50,52,53,57].includes(at(x,y)))set(x,y,54);
  // blood soaked ground under the gallows, at the cathedral steps and at the monastery gate
  for(let i=0;i<70;i++){const c=[[40,51],[32,25],[51,34],[14,40]][i%4],x=c[0]+((r()-.5)*7)|0,y=c[1]+((r()-.5)*4)|0;if([50,52,53].includes(at(x,y)))set(x,y,55)}
  // braziers along the way
  for(const [x,y] of [[29,36],[34,36],[29,43],[34,43],[29,50],[34,50],[24,24],[39,24],[22,6],[41,6]])set(x,y,27);
  // gates, statues, fountain, the poor dying on the golden steps
  prop('cathedral_gate',32,24.08,[]);prop('cathedral_gate',32,6.08,[]);
  // 16.11.2026: fontanna na osi placu (x 25..38, srodek 32), a nie przy prawej parze posagow. Pas procesji jest zarezerwowany (clearways), wiec wstawiamy ja wprost: zostaja wolne kafle x=30 i x=33
  PROPS.push({k:'queen_fountain',x:32,y:30.92});for(const [sx,sy] of [[31,30],[32,30]]){under[sy*GW+sx]=map[sy*GW+sx];set(sx,sy,31)}
  for(const [x,y] of [[27,28],[36,28],[27,32],[36,32],[25,9],[38,9]])prop('saint_king',x+.5,y+.92,[[x,y]]);
  for(const [x,y] of [[27,25],[36,25],[29,25],[35,26],[26,26],[30,7],[34,7]])place('beggar_bodies',x,y);
  for(const [x,y] of [[25,24],[38,24],[20,6],[43,6]])place('royal_banner',x,y);
  // monastery: pyre, banners, heads on stakes at the gates
  prop('pyre',51.5,23.92,[[51,23]],{fire:true,big:true,anim:'pyre'});
  for(const x of [48,55])place('royal_banner',x,15);
  for(const [x,y] of [[49,33],[54,33],[42,20],[42,24]])place('impaled_head',x,y);
  place('chains',59,18);place('chains',59,27);place('sarcophagus',45,25);place('sarcophagus',58,22);
  // slum clutter and trash fires
  for(const [x,y,big] of [[6,49],[27,40],[48,42],[55,49],[17,41,1],[42,38]])place('debris_fire',x,y,{fire:true,big:!!big,anim:'fire'});
  prop('gallows',41,51.92,[[40,51],[41,51]]);
  for(const [k,x,y] of [['beggar_bodies',13,40],['beggar_bodies',9,46],['beggar_bodies',44,41],['beggar_bodies',36,47],['beggar_bodies',20,51],['barrel',9,39],['barrel',27,37],['barrel',51,44],['wheel',18,36],['wheel',45,49],
    ['crow_post',4,44],['crow_post',59,46],['dead_horse',37,51],['burnt_hay',55,40],['barrel',22,44],['beggar_bodies',58,40],['crow_post',23,35],['dead_horse',8,35],['impaled_head',28,52],['impaled_head',35,52],['beggar_bodies',11,46],['doorway_bones',7,46]].filter((_,i)=>i%2===0))place(k,x,y);
  // street lamps with blue runes, dead trees in the gardens
  // 16.11.2026: latarnie parami wzdluz osi x=32 (kafel x <-> 63-x). Para powstaje tylko, gdy oba kafle sa wolne; lewa lampa odbita lustrzanie
  {const picked=[];for(let y=8;y<=52&&picked.length<6;y++)for(let x=6;x<=30&&picked.length<6;x++){const a=y*GW+x,b=y*GW+63-x;if(!free(x,y)||!free(63-x,y)||clearways.has(a)||clearways.has(b))continue;if(picked.some(([px,py])=>Math.max(Math.abs(px-x),Math.abs(py-y))<8))continue;picked.push([x,y]);place('street_lantern',x,y,{flip:true});prop('street_lantern',mpInv(MW-MP(x+.5)),y+.92,[[63-x,y]])}}
  for(const [x,y] of [[17,10],[4,20],[8,20],[13,29],[17,29],[4,30],[11,19]])place('dead_tree',x,y);
  // doors of the nobles' townhouses, plague carts, carriages, gibbets, rot blooms by the pools
  prop('noble_door',6.5,18.1,[]);prop('noble_door',50,9.1,[]);prop('noble_door',16.5,27.1,[]);
  for(const [k,x,y] of [['plague_cart',26,45],['plague_cart',39,40],['plague_cart',12,53],['noble_carriage',21,9],['noble_carriage',44,12],['noble_carriage',9,27],['gibbet',36,50],['gibbet',19,36],['gibbet',48,35],
    ['offering_bowl',33,26],['offering_bowl',30,26],['broken_bell',37,11],['doorway_bones',6,40],['doorway_bones',17,40],['doorway_bones',46,40],['doorway_bones',52,40]].filter((_,i)=>i%2===0))place(k,x,y);
  for(const [x,y] of [[9,42],[18,43],[16,52],[42,42],[56,42],[44,49],[22,32],[11,35],[59,50],[28,47]])place('rot_bloom',x,y,{anim:'bloom'},false);
  // healing shrines
  prop('healing_shrine',41.5,28.92,[[41,28]],{shrine:0});prop('healing_shrine',13.5,45.92,[[13,45]],{shrine:1});
  // the city gate we came up through from the Lower City
  prop('gate',32,54.92,[[30,54],[31,54],[32,54],[33,54]],{sheet:'trans',still:'gate_open'});
  // 23.11.2026: nowe kamienice i kaplica stawiane na koncu (bez wplywu na losowanie reszty miasta); rekwizyty z ich pola znikaja, podcien zostaje przechodni
  if(nbParam('zlnowe')!=='0')for(const [x,y,w,h,k,f] of ZL_NOWE){const prev=[];for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)prev.push([xx,yy,at(xx,yy)]);fill(x,y,w,h,58);
    for(let i=PROPS.length-1;i>=0;i--){const q=PROPS[i];if(q.x>=x&&q.x<x+w&&q.y>=y&&q.y<y+h+.95)PROPS.splice(i,1)}
    if(k==='podcien'){const row=[];for(const [xx,yy,t] of prev){const edge=f==='S'?yy===y+h-1:f==='N'?yy===y:f==='E'?xx===x+w-1:xx===x;const end=f==='S'||f==='N'?xx===x||xx===x+w-1:yy===y||yy===y+h-1;if(edge&&!end)set(xx,yy,t===58?50:t)}}}
  return{map,under,PROPS,clearways,gates:[[32*TS,24.5*TS],[32*TS,6.5*TS]],start:{x:32*TS,y:51*TS+8},shrines:[{x:41*TS+8,y:29*TS+12},{x:13*TS+8,y:46*TS+12}],
    region:(x,y)=>y>=35?'slums':x>=43&&y>=14&&y<=32?'monastery':'city',
    npcs:[{id:'izolda',art:'izolda',name:(EN?'Countess Isolda of Vermar':'Hrabina Izolda z Vermarów'),x:6.5*TS,y:18.4*TS,lines:IZOLDA_LINES},
          {id:'ottokar',art:'ottokar',name:(EN?'Count Ottokar, King\'s Treasurer':'Hrabia Ottokar, skarbnik korony'),x:50*TS,y:9.4*TS,lines:OTTOKAR_LINES},
          {id:'aurel',art:'aurel',name:(EN?'Young Aurel of House Halder':'Młody Aurel z rodu Halderów'),x:16.5*TS,y:27.4*TS,lines:AUREL_LINES},
          (()=>{const [x,y]=freeNear(map,PROPS,[50,52,53,55],24,42);return{id:'heri',art:'heri',name:(EN?'Heri of the Royal Guard':'Heri, wojak z gwardii królewskiej'),x:(x+.5)*TS,y:(y+.4)*TS,lines:HERI_LINES}})(),
          (()=>{const [x,y]=freeNear(map,PROPS,[50,52,53,55],10,46);return{id:'seweryna',art:'seweryna',name:(EN?'Seweryna, the Mourning Seamstress':'Seweryna, Krawcowa Żałobna'),x:(x+.5)*TS,y:(y+.4)*TS,lines:SEWERYNA_LINES}})()],idle:[32,30,11,8]};
}

// Chapter IV: Czarnobór, the wild valleys of the old faith (plan: docs/prompty-rozdzial4.md)
// codes: 60 forest floor, 61 dirt road, 62 valley meadow, 63 stone-field gravel, 64 river ford (slows), 65 marsh water (slows more),
// 66 barrow earth, 67 camp and ritual ground, 68 ruined watchtower masonry, 69 log palisade; 21 rock walls around the valley
// landmarks stay in place; woods, glades, pools, boulders and the river bends come from a random seed, so the valley differs on every load
const CZ={camp:{x:30,y:57,w:21,h:11},oak:[58,17],circle:[53,34],hill:[40,6],tower:[10,11]};
// zone borders on the 80x70 grid
const CZY={north:27,stones:41,campTop:55},CZX={forest:42,marsh:37};
function genCzarnobor(seed){
  const {map,under,PROPS,set,fill,prop,reserve,clearways}=mapKit(21,GONE_PROPS);const r=rng(seed);const at=(x,y)=>map[y*GW+x];
  reserve(38,54,5,14);
  const ph=[0,1,2,3,4,5].map(()=>r()*20);
  const N=(x,y)=>Math.sin(x*.19+ph[0])+Math.cos(y*.17+ph[1])+Math.sin((x+y)*.105+ph[2])+Math.cos((x-y)*.135+ph[3]);
  const inCamp=(x,y)=>y>=CZY.campTop&&x>=28&&x<=53;
  fill(2,2,GW-4,GH-4,62);
  // ragged rock rim of the valley
  for(let y=1;y<GH-1;y++)for(let x=1;x<GW-1;x++){const e=Math.min(x,y,GW-1-x,GH-1-y);if(e<2||inCamp(x,y))continue;if(e<3+1.4*(Math.sin(x*.4+ph[4])+Math.cos(y*.36+ph[5])))set(x,y,21)}
  // zones from south to north: meadows (river valley), stone field, then the marsh in the west and the deep forest in the east
  for(let y=2;y<GH-2;y++)for(let x=2;x<GW-2;x++){if(at(x,y)===21)continue;const n=N(x,y)+(r()-.5)*.6;
    if(y<CZY.north&&x>=CZX.forest)set(x,y,60);
    else if(y<CZY.north&&x<CZX.marsh)set(x,y,y>=5&&n>.45?65:60);
    else if(y<CZY.north)set(x,y,n>.8?60:63);
    else if(y<CZY.stones)set(x,y,n>.15?63:62);
    else if(n>1.25)set(x,y,60)}
  // Łysa Góra: a bare hill with a ritual ring on top
  for(let y=2;y<15;y++)for(let x=24;x<57;x++){const d=Math.hypot((x-CZ.hill[0])/15,(y-CZ.hill[1])/7.5);if(d<1)set(x,y,d<.42?67:63)}
  // the river bends across the valley; all of it is a shallow ford that slows you down
  const riverY=x=>48+2.7*Math.sin(x*.152+ph[0])+1.2*Math.sin(x*.056+ph[2]);
  for(let x=2;x<GW-2;x++){const cy=riverY(x);for(let y=Math.floor(cy-1.7);y<=cy+1.7;y++)if(at(x,y)!==21&&!inCamp(x,y))set(x,y,64)}
  // refugee camp behind a log palisade, gate to the north
  const C=CZ.camp;fill(C.x,C.y,C.w,C.h,67);
  for(let x=C.x;x<C.x+C.w;x++)set(x,C.y,69);for(let y=C.y;y<C.y+C.h;y++){set(C.x,y,69);set(C.x+C.w-1,y,69)}
  for(let x=38;x<=42;x++)set(x,C.y,61);
  // the old road from the camp gate up to the hill, with side paths to the sacred oak, the watchtower and the stone circle
  const roadX=y=>Math.round(40+3.75*Math.sin(y*.128+ph[1])*Math.min(1,Math.max(0,(C.y-y)/7)));
  const road=(x,y)=>{const t=at(x,y);if(t!==21&&t!==69&&x>1&&y>1&&x<GW-2&&y<GH-2){set(x,y,t===64?64:61);reserve(x-1,y-1,3,3)}};
  for(let y=11;y<C.y;y++){const x=roadX(y);for(let dx=-1;dx<=1;dx++)road(x+dx,y)}
  for(let x=roadX(19);x<=CZ.oak[0]-4;x++)for(let y=18;y<=20;y++)road(x,y);
  for(let x=CZ.tower[0]+2;x<=roadX(15);x++)for(let y=14;y<=16;y++)road(x,y);
  for(let x=roadX(34);x<=CZ.circle[0]-5;x++)for(let y=33;y<=35;y++)road(x,y);
  // clearings: sacred oak, stone circle, ruined watchtower
  const disc=(cx,cy,rad,v)=>{for(let y=Math.floor(cy-rad);y<=cy+rad;y++)for(let x=Math.floor(cx-rad);x<=cx+rad;x++)if(Math.hypot(x-cx,y-cy)<=rad&&x>1&&y>1&&x<GW-2&&y<GH-2&&at(x,y)!==61)set(x,y,v)};
  disc(CZ.oak[0],CZ.oak[1],5.8,60);disc(CZ.oak[0],CZ.oak[1],3.2,67);
  disc(CZ.circle[0],CZ.circle[1],7.5,63);
  disc(CZ.tower[0],CZ.tower[1],4,63);
  const [tx0,ty0]=CZ.tower;for(let y=ty0-1;y<=ty0+1;y++)for(let x=tx0-1;x<=tx0+1;x++)if(x!==tx0||y!==ty0+1)set(x,y,68);
  // standing stones of the circle (they wake up when blood is shed next to them)
  const SC5=[-Math.PI/2,-.25,1,2.3,3.95].map(a=>[Math.round(CZ.circle[0]+Math.cos(a)*5.2),Math.round(CZ.circle[1]+Math.sin(a)*4.5)]);
  SC5.forEach(([x,y],i)=>prop('standing_stone',x+.5,y+.92,[[x,y]],{stone:i}));
  prop('sacred_oak',CZ.oak[0]+.5,CZ.oak[1]+.92,[[CZ.oak[0],CZ.oak[1]],[CZ.oak[0]-1,CZ.oak[1]],[CZ.oak[0]+1,CZ.oak[1]]]);
  // props that stand on a free walkable tile near the wanted spot
  const WALK=new Set([60,61,62,63,66,67]);
  const roadNear=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(clearways.has((y+dy)*GW+x+dx)||at(x+dx,y+dy)===61||at(x+dx,y+dy)===69||at(x+dx,y+dy)===68)return true;return false};
  const taken=(x,y,d=1.4)=>PROPS.some(p=>Math.abs(p.x-x-.5)<d&&Math.abs(p.y-y-.92)<d);
  // a solid prop never stands on the road and never touches another solid prop or a wall (not even diagonally),
  // so every passage between obstacles stays at least one full tile wide
  const WALK_S=new Set([60,62,63,66,67]),BLOCK=new Set([21,31,68,69]);
  const free8=(x,y,d=1)=>{for(let dy=-d;dy<=d;dy++)for(let dx=-d;dx<=d;dx++)if((dx||dy)&&BLOCK.has(at(x+dx,y+dy)))return false;return true};
  // loose clutter (boulders, carts, poles, gallows, stumps) keeps two free tiles around it, so it never narrows a path to one tile
  const WIDE=new Set(['mossy_boulder','drowned_cart','cz_skullpole','cz_gallows','hanging_tree','cz_wheel','axe_stump','fallen_log']);
  const near=(x,y,ok=WALK,solid=false,d=1)=>{for(let rr=0;rr<8;rr++)for(let dy=-rr;dy<=rr;dy++)for(let dx=-rr;dx<=rr;dx++){const X=x+dx,Y=y+dy;if(X<3||Y<3||X>GW-4||Y>GH-4)continue;if(ok.has(at(X,Y))&&!taken(X,Y)&&(!solid||free8(X,Y,d)&&!roadNear(X,Y)))return[X,Y]}return null};
  const put=(k,x,y,solid=true,extra)=>{const p=near(x,y,solid?WALK_S:WALK,solid,WIDE.has(k)?2:1);if(p)prop(k,p[0]+.5,p[1]+.92,solid?[[p[0],p[1]]]:[],extra);return p};
  // camp: bonfire, wagons, tents, the dead under sheets
  prop('cz_fire',35.5,61.92,[[35,61]],{fire:true,big:true,anim:'campfire'});
  prop('cz_wagon',34,58.92,[[33,58],[34,58]]);prop('cz_wagon',47,64.92,[[46,64],[47,64]]);
  for(const [k,x,y] of [['cz_cauldron',36,62],['cz_firewood',46,62],['cz_tent',33,64],['cz_tent',48,59],['cz_pelts',46,65],['barrel',36,59],['barrel',45,59],['covered_corpses',36,65],['cz_beehive',49,61],['axe_stump',32,61]])put(k,x,y,k!=='covered_corpses'&&k!=='axe_stump'&&k!=='cz_pelts');
  for(const x of [37,43])prop('cz_skullpole',x+.5,55.92,[[x,55]]);
  // healing wayside shrines
  const s1=put('cz_shrine',25,38,true,{shrine:0}),s2=put('cz_shrine',65,45,true,{shrine:1}),s3=put('cz_shrine',22,22,true,{shrine:2});
  // ritual ring of fires on the hill
  for(let i=0;i<6;i++){const a=i*Math.PI/3,x=Math.round(CZ.hill[0]+Math.cos(a)*6.2),y=Math.round(CZ.hill[1]+Math.sin(a)*3.2);put('cz_fire',x,y,true,{fire:true,anim:'campfire'})}
  prop('cz_idol',CZ.hill[0]+.5,CZ.hill[1]+.92,[[CZ.hill[0],CZ.hill[1]]]);put('cz_sacpole',CZ.hill[0]-2,CZ.hill[1]-1);put('cz_sacpole',CZ.hill[0]+2,CZ.hill[1]-1);put('cz_bones',CZ.hill[0]+1,CZ.hill[1]+2,false);
  for(const [x,y] of [[36,9],[44,9],[33,5],[47,5],[30,10],[50,10]])put('cz_skullpole',x,y);
  // along the road: gallows, hanging trees, wolf skulls, a mill wheel on the river bank
  put('cz_gallows',roadX(45)+3,45);put('hanging_tree',roadX(39)-3,39);put('hanging_tree',roadX(24)+4,24);
  {const x=roadX(49)-5;put('cz_wheel',x,Math.round(riverY(x))-2)}
  for(let i=0;i<4;i++){const y=15+((r()*36)|0);put('cz_skullpole',roadX(y)+(r()<.5?-2:3),y)}
  for(let i=0;i<10;i++){const y=12+((r()*40)|0);put('wolf_skull_bush',roadX(y)+(r()<.5?-2:3),y,false)}
  // burial mounds on the stone field (the dead rise from them later in the night)
  for(let i=0,n=0;i<400&&n<8;i++){const x=7+((r()*65)|0),y=29+((r()*11)|0);if(Math.hypot(x-CZ.circle[0],y-CZ.circle[1])<8.5||at(x,y)===61||taken(x,y,2.5)||!free8(x,y,2)||roadNear(x,y))continue;disc(x,y,1.3,66);prop('burial_mound',x+.5,y+.92,[[x,y]],{barrow:1});if(n%2===0)put('cz_crow',x+1,y+1,false,{anim:'crow'});n++}
  for(let i=0;i<8;i++)put('cz_bones',7+((r()*65)|0),29+((r()*12)|0),false);
  for(let i=0;i<7;i++)put('mossy_boulder',7+((r()*65)|0),27+((r()*26)|0));
  for(let i=0,n=0;i<900&&n<9;i++){const x=5+((r()*32)|0),y=5+((r()*21)|0);if(at(x,y)!==65||taken(x,y,4))continue;prop('cz_wisp',x+.5,y+.92,[],{anim:'wisp'});n++}
  for(let x=5;x<37;x++)for(const y of [15,16])if(at(x,y)===61&&[[0,-1],[0,1]].some(([dx,dy])=>at(x+dx,y+dy)===65)&&r()<.35&&!taken(x,y,1.5))prop('cz_walk',x+.5,y+(at(x,y+1)===65?1:-1)+.92,[]);
  for(let i=0;i<4;i++)put('drowned_cart',5+((r()*30)|0),6+((r()*19)|0),true);
  // trees: dense forest in the east, sparse dead trees on the marsh, copses on the meadows, a wall of spruce along the rim
  const clear=(x,y)=>inCamp(x,y)||Math.hypot((x-CZ.hill[0])/16,(y-CZ.hill[1])/8.5)<1||Math.hypot(x-CZ.oak[0],y-CZ.oak[1])<5.6||Math.hypot(x-CZ.circle[0],y-CZ.circle[1])<8||Math.hypot(x-CZ.tower[0],y-CZ.tower[1])<4.4;
  const zone=(x,y)=>y<CZY.north&&x>=CZX.forest?'forest':y<CZY.north&&x<CZX.marsh?'marsh':'open';
  const pickT=(z,q)=>z==='forest'?(q<.36?'spruce':q<.58?'tall_pine':q<.7?'dead_spruce':q<.86?'birch':'dead_oak'):z==='marsh'?(q<.4?'dead_oak':q<.72?'dead_spruce':'birch'):(q<.34?'spruce':q<.52?'tall_pine':q<.72?'birch':q<.86?'dead_oak':'dead_spruce');
  const treeAt=new Uint8Array(GW*GH);let trees=0;
  for(let y=3;y<GH-3;y++)for(let x=3;x<GW-3;x++){const t=at(x,y);if(!(t===60||t===62||t===63)||roadNear(x,y)||clear(x,y)||taken(x,y,1.2)||!free8(x,y)||PROPS.some(p=>!p.tree&&Math.abs(p.x-x-.5)<2.6&&Math.abs(p.y-y-.92)<2.6))continue;
    let ok=true;for(let dy=-1;dy<=1&&ok;dy++)for(let dx=-1;dx<=1;dx++)if(treeAt[(y+dy)*GW+x+dx]){ok=false;break}if(!ok)continue;
    const e=Math.min(x,y,GW-1-x,GH-1-y),z=zone(x,y),n=N(x,y);
    const dens=e<6?.32:z==='forest'?(n>-1.4?.16:.03):z==='marsh'?.07:t===60?.14:y<CZY.stones?.03:.025;
    if(r()>dens||trees>=240)continue;treeAt[y*GW+x]=1;trees++;prop(pickT(z,r()),x+.5,y+.92,[[x,y]],{tree:1,flip:r()<.5})}
  // undergrowth: ferns, brambles and mushrooms in the forest, reeds on the marsh, stumps and fallen logs
  for(let i=0;i<800;i++){const x=3+((r()*(GW-6))|0),y=3+((r()*(GH-6))|0),t=at(x,y),z=zone(x,y);if(taken(x,y,1.2)||clear(x,y)&&z!=='marsh')continue;
    if(t===60&&z==='forest'&&r()<.22&&!clearways.has(y*GW+x))prop(r()<.2?'ferns':r()<.3?'brambles':r()<.4?'mushrooms':UND[(r()*UND.length)|0],x+.5,y+.92,[],{flip:r()<.5});
    else if(z==='marsh'&&(t===60||t===65)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>(at(x+dx,y+dy)===65)!==(t===65))&&r()<.35)prop('reeds',x+.5,y+.92,[],{flip:r()<.5});
    else if(t===60&&r()<.03&&free8(x,y,2)&&!roadNear(x,y))prop(r()<.5?'axe_stump':'fallen_log',x+.5,y+.92,[[x,y]],{flip:r()<.5})}
  const shr=[s1,s2,s3].filter(Boolean).map(([x,y])=>({x:x*TS+8,y:(y+1)*TS}));
  return{map,under,PROPS,seed,clearways,start:{x:40*TS+8,y:63*TS+8},shrines:shr,
    region:(x,y)=>y>=CZY.campTop?'camp':y>=CZY.stones?'meadows':y>=CZY.north?'stones':y<15&&x>23&&x<58?'hill':x<CZX.marsh?'marsh':'forest',
    npcs:(()=>{const OK=[60,61,62,63,66,67],nn=(id,art,name,lines,x,y,extra)=>{const [X,Y]=freeNear(map,PROPS,OK,x,y);for(let i=PROPS.length-1;i>=0;i--){const p=PROPS[i],dy=p.y-(Y+.4);if(p.tree&&Math.abs(p.x-X-.5)<2.2&&dy<.8&&dy>-4.6){const tx=Math.floor(p.x),ty=Math.floor(p.y);if(map[ty*GW+tx]===31)map[ty*GW+tx]=under[ty*GW+tx]||60;PROPS.splice(i,1)}}/*12.11.2026: drzewo tuz za NPC zaslanialo go (NPC na sosnie)*/return Object.assign({id,art,name,x:(X+.5)*TS,y:(Y+.4)*TS,lines},extra||{})};
      return[nn('wierz','wierz',(EN?'Wierzchoslava, the Whisperer':'Wierzchosława, szeptucha'),WIERZ_LINES,36,62),nn('bartosz','bartosz',(EN?'Bart the Scout':'Bartosz Tropiciel'),BARTOSZ_LINES,roadX(44)-3,43),
        nn('wolch','wolch',(EN?'Volch, Pagan Priest':'Żerca Wołch'),WOLCH_LINES,CZ.oak[0],CZ.oak[1]+4),nn('dobromir','dobromir',(EN?'Dobromir, Keeper of Empty Hives':'Dobromir, Pszczelarz Pustych Uli'),DOBROMIR_LINES,47,62),nn('boginka','boginka_lure','',[],62+((r()*10)|0),10+((r()*10)|0),{lure:true})]})(),idle:[40,48,14,10]};
}

// Chapter V: Cytadela Wierzycieli, seat of the Order (plan: docs/prompty-rozdzial5.md)
// codes: 70 courtyard flagstones, 71 black marble, 72 archive floor, 73 court carpet, 74 treasury, 75 dungeon, 76 throne seal, 77 ink pools; 78 inner walls, 80 iron bars; 21 outer rim
// six halls from south to north, each cut off from the next by a double wall with two wide gaps (the throne hall has one)
const CY={bands:[[58,66],[47,55],[35,44],[24,32],[13,21],[3,10]],floors:[70,72,71,74,75,71],
  walls:[[56,57,[[14,25],[54,65]]],[45,46,[[14,25],[54,65]]],[33,34,[[14,25],[54,65]]],[22,23,[[14,25],[54,65]]],[11,12,[[31,48]]]],lanes:[[16,23],[56,63]]};
const cyRegion=(x,y)=>y>=56?'dziedziniec':y>=45?'kancelaria':y>=33?'sala':y>=22?'skarbiec':y>=11?'krypta':'tron';
function genCytadela(seed){
  const {map,under,PROPS,set,fill,prop}=mapKit(21),at=(x,y)=>map[y*GW+x];
  const X0=4,X1=75,WID=X1-X0+1;
  CY.bands.forEach(([y0,y1],i)=>fill(X0,y0,WID,y1-y0+1,CY.floors[i]));
  CY.walls.forEach(([y0,y1,gaps],i)=>{fill(X0,y0,WID,y1-y0+1,78);for(const [a,b] of gaps)fill(a,y0,b-a+1,y1-y0+1,CY.floors[i+1])});
  fill(35,35,10,10,73);
  fill(39,48,2,8,73);fill(39,25,2,8,73); // 22.11.2026: chodniki przez kancelarie i skarbiec (sama posadzka, bez kolizji)
  for(let y=3;y<=10;y++)for(let x=30;x<=50;x++)if(Math.hypot((x-40)*.8,(y-6.5)*1.1)<=3.6)set(x,y,76);
  // The prison dressing stays at the sides; no shelves, vault blocks or cells across combat lanes.
  for(const x of [9,70])fill(x,14,1,5,80);
  for(const [cx,cy] of [[7,18],[72,18]])for(let y=cy-2;y<=cy+2;y++)for(let x=cx-2;x<=cx+2;x++)if(Math.hypot(x-cx,(y-cy)*1.3)<=1.6&&at(x,y)===75)set(x,y,77);
  for(const [x,y] of [[6,60],[73,60],[6,39],[73,39],[6,28],[73,28],[6,6],[73,6]])set(x,y,22);
  for(const [x,y] of [[11,59],[68,59],[11,43],[68,43],[11,19],[68,19],[32,8],[47,8]])set(x,y,27);
  const P=(k,x,y,solid=false,extra)=>prop(k,x+.5,y+.92,solid===true?[[x,y]]:solid||[],extra);
  // Keep both north/south lanes (x16..23 and x56..63) and the middle of every hall open.
  P('armour',8,59,true);P('armour',72,59,true);/* 22.11: zbroje z kolizja (bohater przez nie przechodzil) */// 15.11.2026: szubienica, studnia, wozy i stojak z dziedzinca usuniete (decyzja autora: tylko duze obiekty przy scianach)
  // Runda 286: meble i poswiecenia przy scianach (polnocna sciana kazdej sali, boki), srodek sal pusty; bez ksiazek na posadzce
  for(const x of [28,33])P('bookcase_a',x,47,true);for(const x of [46,51])P('bookcase_b',x,47,true);P('lectern',40,47,true);
  P('bookcase_a',6,50,true);P('bookcase_b',73,50,true);P('desk',6,53,true);
  P('statue_a',28,66,true);P('statue_b',51,66,true);
  P('bench_a',29,35,[[28,35],[29,35]]);P('bench_a',51,35,[[50,35],[51,35]]);P('statue_a',8,37,true);P('statue_b',71,37,true);P('candelabra',36,35,true);P('candelabra',44,35,true);P('statue_a',26,35,true);P('statue_b',53,35,true);
  P('scale',40,24,true);P('vault',72,26,true);prop('vault',mpInv(MW-MP(72.5)),26.92,[[7,26]],{flip:true});// 16.11.2026: drugie drzwi pancerne lustrzane na wielkiej mapie (oś 52); na miejscu dawnej skrzyniP('chest_open',72,30,true);P('goldheap',7,30,true);P('chest',31,24,true);P('chest',48,24,true);
  P('cage',7,17,true);P('rack',72,17,true);P('statue_a',28,13,true);P('statue_b',51,13,true);P('candelabra',35,13,true);P('candelabra',45,13,true);
  P('throne',40,4,[[37,4],[38,4],[39,4],[40,4],[41,4],[42,4],[43,4]]);P('statue_a',30,4,true);P('statue_b',50,4,true);P('candelabra',33,4,true);P('candelabra',47,4,true);P('statue_a',25,6,true);P('statue_b',55,6,true);
  for(const y of [58,47,35,24,13,3])for(const x of [8,71]){if(y===13&&x===71)P('chains',x,y,[],{anim:'chains'});else P('order_bonfire',x,y,[],{fire:true})}
  // Six deliberate, non-blocking details beside furniture, never scattered into passageways.
  // 12.11.2026: dziedziniec ubrany po bokach (wozy, stojaki, sztandary przy bramach, paleniska), krypta z sarkofagami i kośćmi; pasy x16..23 i x56..63 oraz środek wolne
  for(const [x,y] of [[13,59],[26,59],[53,59],[66,59],[31,61],[49,61],[26,15],[53,15],[5,20],[74,20]])set(x,y,27);
  for(const x of [14,25,54,65])P('order_banner',x,58);
  P('armour',5,62,true);P('armour',74,62,true);P('bench_a',31,66,[[30,66],[31,66]]);P('bench_a',49,66,[[48,66],[49,66]]);
  for(const [x,y] of [[27,19],[32,19],[47,19],[52,19]])P('sarcophagus',x,y,true);
  for(const [x,y] of [[29,18],[50,18],[35,15],[45,15]])P('candelabra',x,y,true); // 12.11.2026: swiatlo w krypcie
  // 22.11.2026 (przeglad grafiki): sztandary zakonu przy polnocnych scianach sal (bez kolizji) i kandelabry przy wadze; srodek sal i pasy x16..23, x56..63 wolne
  for(const y of [47,35,24,13])for(const x of [12,67])P('order_banner',x,y);
  P('candelabra',36,24,true);P('candelabra',44,24,true);
  const SH=[[69,60],[10,42],[40,19]];SH.forEach(([x,y],i)=>P('healing_shrine',x,y,true,{shrine:i}));
  return{map,under,PROPS,seed,start:{x:40*TS+8,y:63*TS+8},shrines:SH.map(([x,y])=>({x:x*TS+8,y:y*TS+12})),region:cyRegion,idle:[40,58,14,6],
    npcs:(()=>{const OK=[70,71,72,73,74,75],nn=(id,name,lines,x,y)=>{const [X,Y]=freeNear(map,PROPS,OK,x,y);return{id,art:id,name,x:(X+.5)*TS,y:(Y+.4)*TS,lines}};
      return[nn('skryba',(EN?'Condemned Scribe':'Skazany Skryba'),SKRYBA_LINES,28,16),nn('straznik',(EN?'The Guard Who Fled':'Strażnik, który uciekł'),STRAZNIK_LINES,24,64),nn('pieczetnik',(EN?'The Senior Bookkeeper':'Starszy Księgowy'),PIECZETNIK_LINES,40,54),nn('lucjan',(EN?'Lucjan, the Eraser':'Lucjan, Wymazywacz'),LUCJAN_LINES,56,50)]})()};
}

// Crypt under the Brzeźnica graveyard (side quest of chapter I), built from the Lower City tiles and props.
// Random rooms joined by corridors: an entrance room, crypts full of sleeping dead, a shrine room and a boss hall with one single door.
// A new layout is generated on every descent; a layout that fails the checks (unreachable room, too wide boss door) is thrown away.
function genDungeon(seed){let w=null;for(let i=0;i<120&&!w;i++)w=genDungeonTry(seed+i*7717,false);return w||genDungeonTry(seed,true)}
function genDungeonTry(seed,force){
  const {map,under,PROPS,set,fill,prop}=mapKit(21);const r=rng(seed),at=(x,y)=>map[y*GW+x],ri=(a,b)=>a+((r()*(b-a+1))|0);
  const rooms=[],cen=R=>[R.x+(R.w>>1),R.y+(R.h>>1)],D=(a,b)=>{const [x0,y0]=cen(a),[x1,y1]=cen(b);return Math.abs(x0-x1)+Math.abs(y0-y1)};
  const fits=R=>R.x>=3&&R.y>=4&&R.x+R.w<=GW-3&&R.y+R.h<=GH-3&&rooms.every(o=>R.x+R.w+3<=o.x||o.x+o.w+3<=R.x||R.y+R.h+3<=o.y||o.y+o.h+3<=R.y);
  for(let i=0;i<200&&!rooms.length;i++){const R={x:ri(3,GW-21),y:ri(4,GH-16),w:ri(15,18),h:ri(10,12),k:'boss'};if(fits(R))rooms.push(R)}
  const B=rooms[0];if(!B)return null;
  for(let i=0;i<400&&rooms.length<2;i++){const R={x:ri(3,GW-13),y:ri(4,GH-11),w:ri(9,11),h:ri(7,8),k:'start'};if(fits(R)&&D(R,B)>34)rooms.push(R)}
  if(rooms.length<2)return null;
  for(let i=0;i<900&&rooms.length<11;i++){const R={x:ri(3,GW-15),y:ri(4,GH-11),w:ri(8,13),h:ri(6,9),k:'crypt'};if(fits(R))rooms.push(R)}
  if(rooms.length<7&&!force)return null;
  for(const R of rooms)fill(R.x,R.y,R.w,R.h,20);
  // corridors two tiles wide, L-shaped; a spanning tree over the rooms plus two extra loops
  const cor=new Set(),dig=(x,y)=>{if(x<2||y<2||x>GW-3||y>GH-3)return;if(at(x,y)===21){set(x,y,20);cor.add(y*GW+x)}};
  const link=(a,b)=>{const [x0,y0]=cen(a),[x1,y1]=cen(b);const h=(xa,xb,y)=>{for(let x=Math.min(xa,xb);x<=Math.max(xa,xb)+1;x++){dig(x,y);dig(x,y+1)}},v=(ya,yb,x)=>{for(let y=Math.min(ya,yb);y<=Math.max(ya,yb)+1;y++){dig(x,y);dig(x+1,y)}};
    if(r()<.5){h(x0,x1,y0);v(y0,y1,x1)}else{v(y0,y1,x0);h(x0,x1,y1)}};
  const rest=rooms.slice(1),inT=[rest[0]],out=rest.slice(1);
  while(out.length){let bi=0,bj=0,bd=1e9;out.forEach((o,i)=>inT.forEach((t,j)=>{const d=D(o,t);if(d<bd){bd=d;bi=i;bj=j}}));link(out[bi],inT[bj]);inT.push(out.splice(bi,1)[0])}
  for(let i=0;i<2;i++){const a=rest[ri(0,rest.length-1)],b=rest[ri(0,rest.length-1)];if(a!==b)link(a,b)}
  // the boss hall: wall it off again, then dig one corridor from the nearest crypt (that crypt gets the healing shrine)
  for(let y=B.y-1;y<=B.y+B.h;y++)for(let x=B.x-1;x<=B.x+B.w;x++)if(x<B.x||y<B.y||x>=B.x+B.w||y>=B.y+B.h){set(x,y,21);cor.delete(y*GW+x)}
  const crypts=rooms.filter(R=>R.k==='crypt');if(!crypts.length)return null;
  const pre=crypts.reduce((a,b)=>D(a,B)<=D(b,B)?a:b);pre.k='pre';link(pre,B);
  let door=0;for(let y=B.y-1;y<=B.y+B.h;y++)for(let x=B.x-1;x<=B.x+B.w;x++)if((x<B.x||y<B.y||x>=B.x+B.w||y>=B.y+B.h)&&at(x,y)===20)door++;
  if(!force&&(door<2||door>4))return null;
  // decoration never goes next to a corridor mouth and solid props keep a free tile (two for loose clutter) around them
  const KEEP=new Set();for(const k of cor){const x=k%GW,y=(k/GW)|0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)KEEP.add((y+dy)*GW+x+dx)}
  const free=(x,y,d=1)=>{if(at(x,y)!==20||KEEP.has(y*GW+x))return false;for(let dy=-d;dy<=d;dy++)for(let dx=-d;dx<=d;dx++){const t=at(x+dx,y+dy);if((dx||dy)&&t!==20&&t!==21)return false}return true};
  const wallTop=(R,k,n)=>{for(let i=0;i<n*8&&n>0;i++){const x=ri(R.x+1,R.x+R.w-2),y=R.y;if(at(x,y-1)!==21||!free(x,y,1))continue;prop(k,x+.5,y+.92,[[x,y]]);n--}};
  const floorP=(R,k,n,w2)=>{for(let i=0;i<n*10&&n>0;i++){const x=ri(R.x+2,R.x+R.w-3-(w2?1:0)),y=ri(R.y+2,R.y+R.h-3);if(!free(x,y,2)||(w2&&!free(x+1,y,2)))continue;
      if(w2)prop(k,x+1,y+.92,[[x,y],[x+1,y]]);else prop(k,x+.5,y+.92,[[x,y]]);n--}};
  const stairs=(R,exit)=>{const c=R.x+(R.w>>1);for(let o=0;o<R.w;o++)for(const s of [1,-1]){const x=c+s*o;if(x-1<=R.x||x+1>=R.x+R.w-1)continue;
      if([-1,0,1].every(dx=>at(x+dx,R.y-1)===21&&free(x+dx,R.y,0)&&!KEEP.has((R.y+1)*GW+x+dx))){prop('chapel_stairs',x+.6,R.y+.92,[[x-1,R.y],[x,R.y],[x+1,R.y]],{sheet:'trans',exit});return x}}return null};
  const S0=rooms[1],sx=stairs(S0,'start'),bx=stairs(B,'boss');if(sx===null||bx===null)return null;
  for(const [R,x] of [[S0,sx],[B,bx]])for(let dy=1;dy<=3;dy++)for(let dx=-2;dx<=2;dx++)KEEP.add((R.y+dy)*GW+x+dx);
  for(const R of rooms){
    const big=R.w>=11&&R.h>=8||R.k==='boss';
    if(big){const P=[[R.x+2,R.y+2],[R.x+R.w-3,R.y+2]];if(R.k==='boss')P.push([R.x+2,R.y+R.h-3],[R.x+R.w-3,R.y+R.h-3]);for(const [x,y] of P)if(free(x,y,1))set(x,y,22)}
    for(const [x,y] of [[R.x,R.y],[R.x+R.w-1,R.y],[R.x,R.y+R.h-1],[R.x+R.w-1,R.y+R.h-1]])if((R.k==='boss'||R.k==='start'||r()<.45)&&free(x,y,1))set(x,y,27);
    if(R.k==='boss'){wallTop(R,'king_statue',2);wallTop(R,'clan_banner',2);floorP(R,'sarcophagus',2)}
    else if(R.k==='start'){wallTop(R,'clan_banner',1)}
    else{wallTop(R,r()<.5?'clan_banner':'chains',1);floorP(R,'sarcophagus',ri(0,2));if(r()<.25)floorP(R,'fallen_pillar',1,true);
      if(r()<.3)wallTop(R,'rune_lantern',1)}
    for(let i=0;i<ri(1,3);i++){const x=ri(R.x+1,R.x+R.w-2),y=ri(R.y+1,R.y+R.h-2);if(at(x,y)===20&&!KEEP.has(y*GW+x))0}}
  let shrine=null;for(let i=0;i<60&&!shrine;i++){const x=ri(pre.x+2,pre.x+pre.w-3),y=ri(pre.y+2,pre.y+pre.h-3);if(free(x,y,2)){prop('healing_shrine',x+.5,y+.92,[[x,y]],{shrine:0});shrine={x:x*TS+8,y:y*TS+12}}}
  for(let y=1;y<GH-1;y++)for(let x=1;x<GW-1;x++){if(at(x,y)!==20)continue;const q=r();if(q<.03)set(x,y,30);else if(q<.12)set(x,y,26)}
  // every room must be reachable from the entrance
  const SOLT=new Set([21,22,27,31]),seen=new Uint8Array(GW*GH),st=[(S0.y+2)*GW+sx];seen[st[0]]=1;
  while(st.length){const k=st.pop(),x=k%GW,y=(k/GW)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const n=(y+dy)*GW+x+dx;if(seen[n]||SOLT.has(map[n]))continue;seen[n]=1;st.push(n)}}
  if(!force)for(const R of rooms){let ok=false;for(let y=R.y;y<R.y+R.h&&!ok;y++)for(let x=R.x;x<R.x+R.w;x++)if(seen[y*GW+x]){ok=true;break}if(!ok)return null}
  return{map,under,PROPS,seed,start:{x:sx*TS+8,y:(S0.y+2)*TS+8},shrines:shrine?[shrine]:[],region:()=>'hall',npcs:[],idle:[...cen(S0),6,4],rooms:rooms.map(R=>({x:R.x,y:R.y,w:R.w,h:R.h,k:R.k}))};
}


