// lights: many sources per chapter, only the 10 closest to the camera feed a fixed pool of point lights
const LPOOL=[];for(let i=0;i<10;i++){const l=new THREE.PointLight(0xffffff,0,8,2);scene.add(l);LPOOL.push(l)}
const plLight=new THREE.PointLight(0xffd2a0,2.1,13,2);plLight.castShadow=true;plLight.shadow.mapSize.set(1024,1024);plLight.shadow.camera.near=.2;plLight.shadow.camera.far=16;plLight.shadow.bias=-.002;plLight.shadow.radius=2;scene.add(plLight);

// Chapters I-III keep their hand-made layouts, stretched to the bigger map; enrich() fills the new room
// with extra buildings, props, four "altars" for the kill-next-to-it event, traps and the 9:00 wave (big-map coordinates)
// Runda 216: dodatkowe dekoracje bez kolizji na każdej mapie. Stawiane tylko na wolnej posadzce (bez cieczy, z dala od ścian),
// z dala od innych obiektów, NPC, kapliczek, startu i korytarzy (clearways); nie zmieniają mapy kolizji.
const UND=['wd0','sp0','wd1','sp1','wd2','sp2','wd3','sp3','wd4','sp4','wd5','sp5','wd6','sp6','wd7','sp7','wd8','sp8','wd9','sp9','wd10','sp10','wd11','sp11'];const DECOR={1:[['covered_corpses',8],['burnt_hay',9],['wheel',7]],2:[],3:[['beggar_bodies',12],['doorway_bones',10],['rot_bloom',8,{anim:'bloom'}]],4:[['cz_bones',22],['wolf_skull_bush',14]],5:[['ledgers',8],['chair',6],['rack',5],['armour',4],['cage',3]]};
// Runda 217: przerzedzenie zwykłych ognisk (ogniska z gruzu, obozowe, stosy): żadne dwa nie stoją bliżej niż 9 pól.
// Nie dotyczy ognisk mocy (kapliczek odrodzenia), koksowników, pochodni i latarni ani kręgu ognisk wokół bożka w rozdz. IV.
function thinFires(w){const P=w.PROPS,M=w.map,U=w.under,idol=P.find(p=>p.k==='cz_idol'),sh=w.shrines||[],R=9;
 const fires=P.filter(p=>p.fire&&!p.keep&&!(idol&&Math.hypot(p.x-idol.x,p.y-idol.y)<9)&&!sh.some(s=>Math.hypot(s.x/16-p.x,s.y/16-p.y)<3));
 fires.sort((a,b)=>(b.big?1:0)-(a.big?1:0));const kept=[],gone=new Set();
 for(const f of fires){if(kept.some(k=>Math.hypot(k.x-f.x,k.y-f.y)<R))gone.add(f);else kept.push(f)}
 if(!gone.size)return;for(let i=P.length-1;i>=0;i--)if(gone.has(P[i]))P.splice(i,1);
 for(const f of gone){const x=Math.floor(f.x),y=Math.floor(f.y);for(let dx=0;dx<=0;dx++){const i=y*MW+x+dx;if(M[i]!==31)continue;if(P.some(p=>Math.floor(p.y)===y&&Math.abs(p.x-(x+dx+.5))<1.2))continue;
  let v=U&&U[i];if(!v||v===31||SOLID.has(v)){v=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const t=M[(y+b)*MW+x+dx+a];if(!SOLID.has(t)){v=t;break}}}if(v)M[i]=v}}}
// runda 298: uklad mapy 1 z edytora map (eksport autora 2.11.2026). Przesuniecia, usuniecia i dodania w polach swiata 104x91, reszta mapy bez zmian.
// 12.11.2026, zasada autora: NIC z kolizja nie stoi na drodze. Rozdz. I: droga = pomalowane klepisko (MAP1_FLOOR 0) o szerokosci do 5 pol
// (plac jest szerszy, wiec zostaje). Rekwizyt z drogi trafia na najblizsze wolne pole poza droga, razem z kolizja; kapliczka zabiera swoj punkt odrodzenia.
function unblockRoads1(w){if(typeof MAP1_FLOOR==='undefined')return;const P=w.PROPS,M=w.map,U=w.under,fl=(x,y)=>x<0||y<0||x>=MW||y>=MH?-1:MAP1_FLOOR[y].charCodeAt(x)-48;
 const run=(x,y,dx,dy)=>{let n=1;for(const sg of[-1,1])for(let k=1;k<9;k++){if(fl(x+dx*k*sg,y+dy*k*sg)!==0)break;n++}return n};
 const road=(x,y)=>fl(x,y)===0&&Math.min(run(x,y,1,0),run(x,y,0,1))<=5;
 const open=(x,y)=>{const t=M[y*MW+x];return !SOLID.has(t)&&t!==45&&t!==90};
 const freeCell=(x,y)=>{const i=y*MW+x;if(M[i]===31){let v=U[i];if(!v||v===31||SOLID.has(v))v=41;M[i]=v}},occ=(x,y)=>{const i=y*MW+x;if(!SOLID.has(M[i])){U[i]=M[i];M[i]=31}};
 // oboz zakonu przy zachodniej drodze: ognisko i sztandary stawaly w poprzek drogi
 {const mvp=(k,ox,oy,nx,ny)=>{const q=P.find(q=>q.k===k&&Math.floor(q.x)===ox&&Math.floor(q.y)===oy);if(!q||!open(nx,ny)||P.some(o=>o!==q&&Math.floor(o.x)===nx&&Math.floor(o.y)===ny))return false;freeCell(ox,oy);q.x+=nx-ox;q.y+=ny-oy;occ(nx,ny);return true};
  mvp('order_bonfire',26,31,29,32);mvp('order_banner',24,30,23,32);mvp('order_banner',28,30,27,32)} // sztandary = brama po obu stronach drogi (x 24-26), ognisko obok
 for(const p of P){const x=Math.floor(p.x),y=Math.floor(p.y);if(M[y*MW+x]!==31)continue;const two=p.k==='shrine',cells=two?[[x-1,y],[x,y]]:[[x,y]];if(!cells.some(([a,b])=>road(a,b)))continue;
  let best=null,bd=1e9;for(let dy=-6;dy<=6;dy++)for(let dx=-6;dx<=6;dx++){const nx=x+dx,ny=y+dy,d=dx*dx+dy*dy*1.3;if(d>=bd||nx<3||ny<3||nx>=MW-3||ny>=MH-3)continue;
   const cs=two?[[nx-1,ny],[nx,ny]]:[[nx,ny]];if(cs.some(([a,b])=>!open(a,b)||road(a,b)||fl(a,b)===0&&run(a,b,1,0)<=6||w.clearways?.has(b*MW+a)))continue;
   let ok=true;for(let b=-1;b<=1&&ok;b++)for(let a=-2;a<=1&&ok;a++)if(!open(nx+a,ny+b)&&!(M[(ny+b)*MW+nx+a]===31&&cells.some(([cx,cy])=>cx===nx+a&&cy===ny+b)))ok=false;
   if(!ok||P.some(q=>q!==p&&Math.hypot(q.x-(nx+.5),q.y-(ny+.92))<1.6)||w.npcs.some(n=>Math.hypot(n.x/16-nx,n.y/16-ny)<2.5))continue;best=[nx,ny];bd=d}
  if(!best)continue;for(const [a,b] of cells)freeCell(a,b);const mx=best[0]-x,my=best[1]-y;p.x+=mx;p.y+=my;for(const [a,b] of cells)occ(a+mx,b+my);
  if(two&&p.shrine!==undefined&&w.shrines[p.shrine]){w.shrines[p.shrine].x+=mx*TS;w.shrines[p.shrine].y+=my*TS}}}
// 12.11.2026: Dolne Miasto - wielka hala dostaje kolumnade wzdluz glownej nawy (12 nowych filarow przy x=24 i x=36), krypty runiczne latarnie.
// Zasada autora: nic na drodze - nowe rzeczy tylko na polach bez drogi (groundPlan jeszcze nie istnieje, wiec pomijamy pas y 36-42 i nawe x 25-35).
function layoutPatch2(w){const P=w.PROPS,M=w.map,U=w.under,ok=(x,y)=>{const t=M[y*MW+x];return !SOLID.has(t)&&!VOID.has(t)&&t!==24&&t!==27&&!(w.clearways&&w.clearways.has(y*MW+x))&&!P.some(p=>Math.abs(p.x-x-.5)<1.6&&Math.abs(p.y-y-.92)<1.6)&&!w.npcs.some(n=>Math.hypot(n.x/16-x,n.y/16-y)<3)};
 for(const x of [24,36])for(const y of [18,25,31,46,52,59])if(ok(x,y)){U[y*MW+x]=M[y*MW+x];M[y*MW+x]=22}
 for(const [x,y] of [[14,6],[26,6],[36,6],[48,6],[14,76],[48,76]])if(ok(x,y)){P.push({k:'rune_lantern',x:x+.5,y:y+.92});U[y*MW+x]=M[y*MW+x];M[y*MW+x]=31}}
function layoutPatch1(w){const P=w.PROPS,M=w.map,U=w.under,T=(x,y)=>M[y*MW+x];
 const floorAt=(x,y)=>{let v=U[y*MW+x];if(!v||v===31||SOLID.has(v)){v=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const t=T(x+a,y+b);if(!SOLID.has(t)){v=t;break}}}return v||42};
 const free=(x,y)=>{if(T(x,y)===31)M[y*MW+x]=floorAt(x,y)};
 const occupy=(x,y)=>{const i=y*MW+x;if(!SOLID.has(M[i])){U[i]=M[i];M[i]=31}};
 const find=(k,x,y)=>P.find(p=>p.k===k&&Math.floor(p.x)===x&&Math.floor(p.y)===y);
 const mv=(k,ox,oy,nx,ny,tiles=[])=>{const p=find(k,ox,oy);if(!p)return;p.x+=nx-ox;p.y+=ny-oy;for(const [a,b] of tiles)free(a,b);for(const [a,b] of tiles)occupy(a+nx-ox,b+ny-oy)};
 const del=(k,x,y,tiles=[])=>{const p=find(k,x,y);if(!p)return;P.splice(P.indexOf(p),1);for(const [a,b] of tiles)free(a,b)};
 const add=(k,x,y,tiles,extra)=>{for(let j=P.length-1;j>=0;j--){const q=P[j];if(q.decor&&Math.abs(q.x-x-.5)<1.5&&Math.abs(q.y-y-.92)<1.5)P.splice(j,1)}
  P.push(Object.assign({k,x:x+.5,y:y+.92},extra||{}));for(const [a,b] of tiles)occupy(a,b)};
 const npc=(id,dx,dy)=>{const n=w.npcs.find(q=>q.id===id);if(!n)return;n.x+=dx*16;n.y+=dy*16;if(n.solid){free(n.solid[0],n.solid[1]);n.solid=[n.solid[0]+dx,n.solid[1]+dy];occupy(n.solid[0],n.solid[1])}};
 // sklep Margi
 mv('marga_cart',94,43,95,42,[[91,43],[92,43],[93,43],[94,43]]);mv('house_fire',95,39,97,39,[[95,40]]);{const f=find('house_fire',97,39);if(f)f.x=97.1}mv('burnt_hay',94,42,97,43);add('shop_sign',95,40,[[95,40]],{x:95.5,y:39.4});/* 9.11.2026: szyld przesunięty w prawo, poza wnękę drzwi */
 // cmentarz: szubienice pod gorna krawedz, mala kwatera z krzyzami wokol nagrobka (nagrobek altarowy NE przeniesiony tutaj)
 add('gallows',79,25,[[78,25],[79,25],[80,25]]);add('gallows',88,25,[[87,25],[88,25],[89,25]]);
 for(const [x,y] of [[76,29],[74,31],[76,31]])add('grave_cross',x,y,[[x,y]]);
 mv('tombstone',59,27,75,30,[[59,27]]);
 // oboz zakonu na poludniu i drobiazgi
 mv('order_bonfire',25,67,26,67,[[25,67]]);mv('order_banner',23,66,24,66,[[23,66]]);mv('order_banner',27,66,28,66,[[27,66]]);
 mv('dead_tree',8,22,4,32,[[7,22],[8,22]]);mv('dead_tree',98,61,97,61,[[98,61]]);mv('covered_corpses',5,32,9,23);del('wheel',5,18);
 // runda 299: kapliczka lecznicza (rysunek i znacznik) z (40,22)/(40,24) na (13,20) pod murem domu NW
 mv('shrine',40,22,13,20,[[39,22],[40,22]]);if(w.shrines[0]){w.shrines[0].x+=-27*16;w.shrines[0].y+=-4*16}
 // NPC
 npc('elder',3,3);npc('wit',27,26);npc('chojrak',-29,-12)}
// runda 316: mapa 1, druga paczka zmian autora z edytora map (eksport 4.11.2026, wdrozone bez testu na polecenie autora): strumien (woda plytka), studnia w miejscu rozebranego domu, rozbudowany cmentarz, Kaplica Popiolow na (94,68), ogniska i drobiazgi. Podloze: MAP1_FLOOR w 03_three_teren.js.
function layoutPatch1b(w){const P=w.PROPS,M=w.map,U=w.under,T=(x,y)=>M[y*MW+x];
 const floorAt=(x,y)=>{let v=U[y*MW+x];if(!v||v===31||SOLID.has(v)){v=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const t=T(x+a,y+b);if(!SOLID.has(t)&&t!==31){v=t;break}}}return v||42};
 const free=(x,y)=>{if(T(x,y)===31)M[y*MW+x]=floorAt(x,y)};
 const occupy=(x,y)=>{const i=y*MW+x;if(!SOLID.has(M[i])&&M[i]!==31){U[i]=M[i];M[i]=31}};
 const nearest=(k,x,y,R)=>{let b=null,bd=R+1e-6;for(const p of P){if(p.k!==k)continue;const d=Math.hypot(Math.floor(p.x)-x,Math.floor(p.y)-y);if(d<bd){bd=d;b=p}}return b};
 const drop=(k,x,y,R=3)=>{const p=nearest(k,x,y,R);if(!p)return;P.splice(P.indexOf(p),1);const tx=Math.floor(p.x),ty=Math.floor(p.y);if(!P.some(q=>Math.floor(q.x)===tx&&Math.floor(q.y)===ty))free(tx,ty)};
 const add=(k,x,y,tiles,extra)=>{for(let j=P.length-1;j>=0;j--){const q=P[j];if(q.decor&&Math.abs(q.x-x-.5)<1.5&&Math.abs(q.y-y-.92)<1.5)P.splice(j,1)}
  P.push(Object.assign({k,x:x+.5,y:y+.92},extra||{}));for(const [a,b] of tiles)occupy(a,b)};
 // strumien: woda plytka (przechodnia) wpada w staw
 for(const [x,y] of MAP1_SHALLOW){const i=y*MW+x;if(M[i]!==31&&M[i]!==45&&!SOLID.has(M[i]))M[i]=90}
 // rozebrany dom (obrys scian) -> podloga, w jego miejscu studnia
 for(const [x,y] of MAP1_HOUSE){const i=y*MW+x;if(M[i]!==31&&SOLID.has(M[i]))M[i]=floorAt(x,y)}
 drop('burnt_hay',57,59,3);add('well',59,61,[[59,61]]);
 // 12.11.2026: plac przy studni nie jest juz pusty - beczki, slup z krukiem, siano i calun; przejscia (clearways) wolne
 add('barrel',62,60,[[62,60]]);add('barrel',63,61,[[63,61]]);add('crow_post',56,59,[[56,59]]);add('burnt_hay',55,62,[]);add('covered_corpses',62,64,[]);
 // cmentarz: stare krzyze i nagrobek z tej kwatery zastapione ukladem autora (20 krzyzy, nagrobek (73,33)), obwodka paproci bez kolizji
 for(let j=P.length-1;j>=0;j--){const q=P[j];if((q.k==='grave_cross'||q.k==='tombstone')&&q.x>=68&&q.x<79&&q.y>=27&&q.y<35){P.splice(j,1);free(Math.floor(q.x),Math.floor(q.y))}}
 for(const [x,y] of MAP1_CROSS)add('grave_cross',x,y,[[x,y]]);for(const [x,y] of MAP1_TOMB)add('tombstone',x,y,[[x,y]]);w.extraFerns=MAP1_FERNS;
 // Kaplica Popiolow (rysunek i znacznik) na (94,68)
 {const s=P.find(p=>p.shrine===1);if(s){const ox=Math.floor(s.x),oy=Math.floor(s.y);for(const [a,b] of [[ox-1,oy],[ox,oy]])free(a,b);s.x=94.5;s.y=68.92;occupy(93,68);occupy(94,68)}
  if(w.shrines[1]){w.shrines[1].x=94*TS+8;w.shrines[1].y=68*TS+8}}
 // ogniska i drobiazgi
 drop('debris_fire',26,15,3.5);drop('debris_fire',41,49,3.5);drop('debris_fire',75,39,3.5);
 drop('burnt_hay',97,43,2.5);drop('burnt_hay',72,60,2.5);drop('barrel',64,62,2.5);drop('wheel',78,71,2.5);drop('covered_corpses',93,66,2.5);
 add('debris_fire',15,27,[[15,27]],{fire:true,anim:'fire'});add('covered_corpses',80,59,[])}
// runda 317: mapa 1, trzecia paczka zmian autora z edytora map (eksport 5.11.2026): kapliczki na (24,27) i (91,60), domy w plomieniach (house_fire), cmentarz bez zmian,
// przesuniete wozy Margi, drobne usuniecia, dead_spruce (66,39), mossy_boulder (55,85), Chojrak o 1 pole. Podloze: MAP1_FLOOR w 03_three_teren.js; rosliny: MAP1_PLANTS.
const MAP1C_SHALLOW=[[26,4],[28,4],[27,16],[27,27]],MAP1C_HOUSE=[[60,58],[61,58],[56,59],[62,59],[61,63]];
function layoutPatch1c(w){const P=w.PROPS,M=w.map,U=w.under,T=(x,y)=>M[y*MW+x];
 const floorAt=(x,y)=>{let v=U[y*MW+x];if(!v||v===31||SOLID.has(v)){v=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const t=T(x+a,y+b);if(!SOLID.has(t)&&t!==31){v=t;break}}}return v||42};
 const free=(x,y)=>{if(T(x,y)===31)M[y*MW+x]=floorAt(x,y)};
 const occupy=(x,y)=>{const i=y*MW+x;if(!SOLID.has(M[i])&&M[i]!==31){U[i]=M[i];M[i]=31}};
 const nearest=(k,x,y,R)=>{let b=null,bd=R+1e-6;for(const p of P){if(p.k!==k)continue;const d=Math.hypot(Math.floor(p.x)-x,Math.floor(p.y)-y);if(d<bd){bd=d;b=p}}return b};
 const drop=(k,x,y,tiles=[],R=1.5)=>{const p=nearest(k,x,y,R);if(!p)return;P.splice(P.indexOf(p),1);const tx=Math.floor(p.x),ty=Math.floor(p.y);if(!P.some(q=>Math.floor(q.x)===tx&&Math.floor(q.y)===ty))free(tx,ty);for(const [a,b] of tiles)free(a,b)};
 const add=(k,x,y,tiles,extra)=>{for(let j=P.length-1;j>=0;j--){const q=P[j];if(q.decor&&Math.abs(q.x-x-.5)<1.5&&Math.abs(q.y-y-.92)<1.5)P.splice(j,1)}
  P.push(Object.assign({k,x:x+.5,y:y+.92},extra||{}));for(const [a,b] of tiles)occupy(a,b)};
 const mv=(k,ox,oy,dx,tiles)=>{const p=nearest(k,ox,oy,1.5);if(!p)return;for(const [a,b] of tiles)free(a,b);p.x+=dx;for(const [a,b] of tiles)occupy(a+dx,b)};
 // strumien: cztery pola wody plytkiej wiecej; resztki obrysu rozebranego domu
 for(const [x,y] of MAP1C_SHALLOW){const i=y*MW+x;if(M[i]!==31&&M[i]!==45&&!SOLID.has(M[i]))M[i]=90}
 for(const [x,y] of MAP1C_HOUSE){const i=y*MW+x;if(M[i]!==31&&(M[i]===44||M[i]===48||SOLID.has(M[i])))M[i]=floorAt(x,y)}
 // osierocone kolizje po usunietych ogniskach (niewidzialne sciany): (26,16) przy strumieniu, (39,40), (41,50), (75,40), (78,74)
 for(const [x,y] of [[26,16],[39,40],[41,50],[75,40],[78,74]])if(!P.some(q=>Math.abs(q.x-x-.5)<1.6&&Math.abs(q.y-y-.5)<1.6&&!q.decor))free(x,y)
 // wozy Margi o pole do siebie, usuniete drobiazgi i ogniska
 mv('marga_cart',85,42,1,[[83,42],[84,42],[85,42],[86,42]]);mv('marga_cart',95,42,-1,[[92,42],[93,42],[94,42],[95,42]]);free(91,42);free(92,42);occupy(95,42);/* 9.11.2026: kolizja prawego wozu pod jego skrzynią (lewe pola były niewidzialną ścianą) */
 drop('barrel',35,61);drop('burnt_hay',26,26);drop('dead_tree',34,57);drop('wheel',18,86);drop('wheel',22,55);drop('wheel',71,82);drop('wheel',81,61);
 drop('order_banner',28,66);drop('order_bonfire',26,67,[[26,67],[28,66]]);drop('order_bonfire',21,81,[[20,81],[21,81]]);drop('debris_fire',34,40,[[33,40],[34,40]]);drop('debris_fire',15,27);
 // domy w plomieniach (bez kolizji, jak dotychczasowe house_fire); 12.11.2026: ogien (89,26) spod szubienicy usuniety na prosbe autora
 for(const [x,y] of [[8,80],[15,27],[21,82],[26,66],[33,40],[57,19],[73,84],[83,61]])P.push({k:'house_fire',x:x+.5,y:y+.4,fire:true,big:true,anim:'hfire',keep:true});
 // nowe rekwizyty
 add('order_banner',20,58,[[20,58]]);add('dead_tree',27,55,[[27,55]]);add('dead_tree',66,39,[[66,39]],{variant:'dead_spruce',vscale:1});add('dead_tree',55,85,[[55,85]],{variant:'mossy_boulder',vscale:.375});
 // kapliczki: lecznicza (13,20) -> (24,27), druga (94,68) -> (91,60)
 {const s0=P.find(p=>p.shrine===0),s1=P.find(p=>p.shrine===1);
  if(s0){for(const [a,b] of [[12,20],[13,20]])free(a,b);s0.x=24;s0.y=27.92;occupy(23,27);occupy(24,27);if(w.shrines[0]){w.shrines[0].x=24*TS;w.shrines[0].y=27*TS}}
  if(s1){for(const [a,b] of [[93,68],[94,68]])free(a,b);s1.x=91.5;s1.y=60.92;occupy(90,60);occupy(91,60);if(w.shrines[1]){w.shrines[1].x=91*TS+8;w.shrines[1].y=60*TS+8}}}
 // Chojrak o jedno pole w prawo i w dol
 {const n=w.npcs.find(q=>q.id==='chojrak');if(n){n.x+=TS;n.y+=TS;if(n.solid){free(n.solid[0],n.solid[1]);n.solid=[n.solid[0]+1,n.solid[1]+1];occupy(n.solid[0],n.solid[1])}}}}
function clearCryptSurrounds(w){const boxes=[[67,4.5,71.5,8.6],[78,4.5,86.5,8.6]],keep=w.clearways||(w.clearways=new Set());
 for(const [x0,y0,x1,y1] of boxes){
  for(let k=w.PROPS.length-1;k>=0;k--){const p=w.PROPS[k];if(p.k==='crypt_stairs'||p.k==='gallows'||p.shrine!==undefined)continue;if(p.x>=x0&&p.x<=x1&&p.y>=y0&&p.y<=y1+.5)w.PROPS.splice(k,1)}
  for(let y=Math.floor(y0);y<=Math.floor(y1);y++)for(let x=Math.floor(x0);x<=Math.floor(x1);x++){const i=y*MW+x;if(w.map[i]===31&&w.under&&w.under[i])w.map[i]=w.under[i];keep.add(i)}}}
function decorFill(w,ch){const L=DECOR[ch];if(!L)return;const r=rng(ch*104729+77),M=w.map,P=w.PROPS,keep=w.clearways||new Set(),NO=new Set([23,24,25,43,45,54,64,65,90,91]);
 const T=(x,y)=>(x<1||y<1||x>=MW-1||y>=MH-1)?21:M[y*MW+x],st=w.start||{x:-999,y:-999},others=[...(w.npcs||[]),...(w.shrines||[])];
 const ok=(x,y)=>{const t=T(x,y);if(NO.has(t)||SOLID.has(t))return false;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const u=T(x+dx,y+dy);if(SOLID.has(u)||NO.has(u))return false}
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(keep.has((y+dy)*MW+x+dx))return false;if(Math.hypot(st.x/16-x,st.y/16-y)<7)return false;
  if(others.some(n=>Math.abs(n.x/16-x)<3&&Math.abs(n.y/16-y)<3))return false;return !P.some(p=>Math.abs(p.x-x-.5)<2.2&&Math.abs(p.y-y-.92)<2.2)};
 for(const [k,n,extra] of L)for(let i=0,c=0;i<n*60&&c<n;i++){const x=2+((r()*(MW-4))|0),y=2+((r()*(MH-4))|0);if(!ok(x,y))continue;P.push(Object.assign({k,x:x+.5,y:y+.92,flip:r()<.5,decor:1},extra||{}));c++}}
function enrich(w,ch){
  const r=rng(ch*7919+13),M=w.map,U=w.under,P=w.PROPS;
  const keep=w.clearways||(w.clearways=new Set()),keepRect=(x,y,ww,hh)=>{for(let Y=y;Y<y+hh;Y++)for(let X=x;X<x+ww;X++)keep.add(Y*MW+X)};
  const T=(x,y)=>(x<1||y<1||x>=MW-1||y>=MH-1)?21:M[y*MW+x];
  const FLOOR={1:[41,42,47],2:[20,26],3:[50,52,53,57]}[ch];
  const busy=(x,y,d)=>{for(let Y=Math.floor(y-d);Y<=y+d;Y++)for(let X=Math.floor(x-d);X<=x+d;X++)if(keep.has(Y*MW+X))return true;return P.some(p=>Math.abs(p.x-x-.5)<d&&Math.abs(p.y-y-.92)<d)||w.npcs.some(n=>Math.abs(n.x/16-x)<d+1.5&&Math.abs(n.y/16-y)<d+1.5)||w.shrines.some(s=>Math.abs(s.x/16-x)<d+1.5&&Math.abs(s.y/16-y)<d+1.5)||Math.hypot(w.start.x/16-x,w.start.y/16-y)<7};
  const okRect=(x0,y0,ww,hh,pad=1)=>{for(let y=y0-pad;y<y0+hh+pad;y++)for(let x=x0-pad;x<x0+ww+pad;x++)if(!FLOOR.includes(T(x,y)))return false;return !busy(x0+ww/2,y0+hh/2,Math.max(ww,hh)/2+1.5)};
  const add=(k,x,y,solid,extra)=>{if((ch===1||ch===3)&&GONE_PROPS.has(k))return;P.push(Object.assign({k,x:x+.5,y:y+.92},extra||{}));if(solid){U[y*MW+x]=M[y*MW+x];M[y*MW+x]=31}};
  const spot=(ok,d=2.5)=>{for(let i=0;i<300;i++){const x=3+((r()*(MW-6))|0),y=3+((r()*(MH-6))|0);if(FLOOR.includes(T(x,y))&&!busy(x,y,d)&&[-1,0,1].every(dy=>[-1,0,1].every(dx=>!SOLID.has(T(x+dx,y+dy))))&&(!ok||ok(x,y)))return[x,y]}return null};
  const scatter=(k,n,solid=true,d=2.5,ok,extra)=>{for(let i=0;i<n;i++){const s=spot(ok,d);if(s)add(k,s[0],s[1],solid,extra)}};
  // a building: hollow (walls + floor + door to the south) or a solid block
  const building=(ww,hh,wall,floor,hollow,ok)=>{for(let i=0;i<400;i++){const x=4+((r()*(MW-8-ww))|0),y=4+((r()*(MH-8-hh))|0);if(!okRect(x,y,ww,hh)||(ok&&!ok(x,y)))continue;
      for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++){const edge=xx===x||yy===y||xx===x+ww-1||yy===y+hh-1;M[yy*MW+xx]=!hollow||edge?wall:floor}
      if(hollow){const dx=x+(ww>>1);for(let o=-1;o<=1;o++)M[(y+hh-1)*MW+dx+o]=floor;keepRect(dx-1,y+hh-3,3,5)}return[x,y,ww,hh]}return null};
  const quad=i=>(x,y)=>((x<MW/2)===(i%2===0))&&((y<MH/2)===(i<2));
  if(ch===1){
    // five more burned huts with fires still smouldering inside, a second camp of the order, more dead and debris
    for(let i=0;i<2;i++){const b=building(6+((r()*3)|0),5+((r()*2)|0),48,43,true);if(!b)continue;const [x,y,ww,hh]=b;
      for(let yy=y;yy<y+hh;yy++)for(let xx=x;xx<x+ww;xx++)if(M[yy*MW+xx]===48&&r()<.15)M[yy*MW+xx]=44;
      r();add('burnt_hay',x+1,y+1,true)} // runda 242: bez ognisk w chatach
    {const s=spot(null,5);if(s){const [x,y]=s;add('order_bonfire',x,y,true,{fire:true,big:true});add('order_banner',x-2,y-1,true);add('order_banner',x+2,y-1,true);add('covered_corpses',x+1,y+2,false)}}
    scatter('dead_tree',6);scatter('barrel',3);scatter('wheel',2,false);scatter('covered_corpses',2,false);scatter('crow_post',2);scatter('dead_horse',1);scatter('burnt_hay',2,false);
    scatter('impaled_head',4,true,2,(x,y)=>T(x+1,y)===40||T(x-1,y)===40||T(x,y+1)===40||T(x,y-1)===40);
    // trap: some of the shrouded dead are not dead
    scatter('covered_corpses',3,false,3,null,{ambush:1});
    for(let i=0;i<4;i++){const s=spot(quad(i),4);if(s)add('tombstone',s[0],s[1],true,{stone:i})}
    w.altar={col:0x9ad0ff,pc:'#bfe8ff',hint:(EN?'The graves of the burned stand at the four corners of the village. Spill their killers\' blood beside them, and the souls will go in peace.':'W czterech krańcach wsi stoją groby spalonych. Przelej przy nich krew ich oprawców, a dusze odejdą w spokoju.'),
      one:n=>(EN?`The grave flares with a pale light. Souls at rest: ${n} of 4.`:`Grób rozbłyska bladym światłem. Dusze w spokoju: ${n} z 4.`),all:(EN?'The souls of the burned depart. They heal your wounds and leave 30 coins behind.':'Dusze spalonych odchodzą. Leczą twoje rany i zostawiają 30 monet.')};
    w.wave={msg:(EN?'A crusade of the Holy Order marches in from the southern road. Fanatics advance in column.':'Od południowej drogi nadciąga krucjata Zakonu. Fanatycy maszerują kolumną.'),list:[['knight',7],['possessed',6]]}}
  if(ch===2){
    // more of the dead dwarven city: bones, sarcophagi, carts, banners, braziers, and barrels of black powder that blow up
    // runda 296: rekwizyty sali rozstawione recznie w genDolne (przy scianach), bez losowego rozsiewania
    w.altar={col:0x5fb0ff,pc:'#7fd0ff',hint:(EN?'Four dead rune lanterns stand in the corners of the hall. Blood spilled nearby will wake the runes. Powder kegs go off when someone dies beside them.':'W rogach sali stoją cztery wygasłe latarnie runiczne. Krew przelana obok obudzi runy. Beczki prochu wybuchają, gdy ktoś przy nich zginie.'),
      one:n=>(EN?`A rune lantern awakens. Lit: ${n} of 4.`:`Latarnia runiczna budzi się. Zapalone: ${n} z 4.`),all:(EN?'The smiths\' runes sing. Your wounds close, and 30 coins spill from the stone.':'Runy kowali śpiewają. Rany się zamykają, a z kamienia sypie się 30 monet.')};
    w.wave={msg:(EN?'The mine shaft collapses. Dead miners pour out of the darkness.':'Sztolnia się zawala. Z ciemności wysypują się martwi górnicy.'),list:[['dwarf',12],['warden',2]]}}
  if(ch===3){
    // more slum shacks and townhouses, plague carts, gibbets, lanterns, beggars, rot blooms that burst when you pass
    for(let i=0;i<2;i++)building(3+((r()*2)|0),2+((r()*2)|0),59,53,false,(x,y)=>y>MH*.6);
    for(let i=0;i<1;i++)building(6+((r()*3)|0),5+((r()*2)|0),58,50,false,(x,y)=>y<MH*.55);
    scatter('beggar_bodies',5,false,2);scatter('plague_cart',2);scatter('gibbet',2);scatter('street_lantern',4,true,4);scatter('barrel',3);scatter('royal_banner',2);scatter('dead_tree',2,true,2.5,(x,y)=>T(x,y)===57||y<MH*.6);
    scatter('rot_bloom',6,false,2.5,null,{anim:'bloom'});
    for(let i=0;i<4;i++){const s=spot(quad(i),4);if(s)add('offering_bowl',s[0],s[1],true,{stone:i})}
    w.altar={col:0xffcf70,pc:'#ffd27a',hint:(EN?'Empty golden offering bowls stand in four districts. Enemy blood spilled nearby will fill them. Beware the rot flowers: they burst when you walk past.':'W czterech dzielnicach stoją puste złote misy ofiarne. Krew wrogów przelana obok je napełni. Uważaj na kwiaty zgnilizny: pękają, gdy przechodzisz.'),
      one:n=>(EN?`An offering bowl fills with golden light. Full: ${n} of 4.`:`Misa ofiarna napełnia się złotym światłem. Pełne: ${n} z 4.`),all:(EN?'The golden bowls overflow. Your wounds heal, and you gather 30 coins.':'Złote misy przelewają się. Rany się goją, a ty zbierasz 30 monet.')};
    w.wave={msg:(EN?'A procession of fire leaves the monastery. Monks lead a mob of madmen.':'Z klasztoru wychodzi procesja ognia. Mnisi prowadzą tłum szaleńców.'),list:[['monk',5],['madman',8]]}}
}
// fabula: Chojrak czeka w rozdzialach II-V w otwartym miejscu 4-10 pol od wejscia (w trybie Arcade jest ukryty - stan 'gone')
function chojrakSpot(w){const st=w.start,bad=t=>SOLID.has(t)||VOID.has(t)||t===27,M=w.map;
  const open=(X,Y)=>{if(X<3||Y<3||X>=MW-3||Y>=MH-3)return false;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(bad(M[(Y+dy)*MW+X+dx]))return false;
    for(const p of w.PROPS)if(Math.hypot(p.x-X-.5,p.y-Y-.5)<1.6)return false;
    for(const s of (w.shrines||[]))if(Math.hypot(s.x/TS-X-.5,s.y/TS-Y-.5)<3)return false;
    for(const n of w.npcs)if(Math.hypot(n.x/TS-X-.5,n.y/TS-Y-.5)<3)return false;return true};
  const cx=Math.floor(st.x/TS),cy=Math.floor(st.y/TS);
  for(let r=4;r<=10;r++)for(let k=0;k<8*r;k++){const a=k/(8*r)*Math.PI*2+r,X=Math.round(cx+Math.cos(a)*r),Y=Math.round(cy+Math.sin(a)*r);if(open(X,Y)&&!(w.clearways&&w.clearways.has(Y*MW+X)))return[(X+.5)*TS,(Y+.4)*TS]}
  return null}
function initWorld(ch){setGrid(ch);if((ch===4||ch===5)&&WORLD_SEEDS[ch]===undefined)WORLD_SEEDS[ch]=(Math.random()*2147483647)|0;
  const w=upscaleWorld(ch===1?genBrzeznica():ch===2?genDolne():ch===3?genStolica():ch===9?genDungeon((Math.random()*2147483647)|0):ch===5?genCytadela(WORLD_SEEDS[ch]):genCzarnobor(WORLD_SEEDS[ch]));if(ch<4)enrich(w,ch);
  if(ch===9)w.rooms=w.rooms.map(R=>Object.assign(SR(R),{k:R.k}));
  Object.assign(w,{ch,group:new THREE.Group(),propObjs:[],npcMeshes:{},walls:[],cliffs:[],pillars:[],lavas:[],braziers:[],waters:[],rots:[],shallow:[],LSRC:[]});
  if(ch>=2&&ch<=5){const sp=chojrakSpot(w);if(sp)w.npcs.push({id:'chojrak',art:'chojrak',name:(EN?'Chojrak, Lapsed Paladin':'Chojrak, paladyn bez Zakonu'),x:sp[0],y:sp[1],lines:[]})}
  for(const n of w.npcs)if(n.solid)w.map[n.solid[1]*MW+n.solid[0]]=31;if(ch===4)deepMarsh(w);if(ch===1)clearCryptSurrounds(w);if(ch>=1&&ch<=5){thinFires(w);decorFill(w,ch)}
  // runda 215: bez ognisk (koksowników) tuż przy lawie w rozdz. II
  if(ch===2)for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=y*MW+x;if(w.map[i]!==27)continue;let n=false;for(let dy=-3;dy<=3&&!n;dy++)for(let dx=-3;dx<=3;dx++){const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<MW&&Y<MH&&w.map[Y*MW+X]===24){n=true;break}}if(n)w.map[i]=(w.under&&w.under[i]&&w.under[i]!==27)?w.under[i]:20}
  // runda 242: zasada świata: żadnych ognisk na lawie ani w promieniu 4 pól od niej (ogniska z gruzu, obozowe, stosy, koksowniki); ogniska mocy bez zmian
  {const M2=w.map,U2=w.under,P2=w.PROPS,lv=[];for(let i=0;i<MW*MH;i++)if(M2[i]===24||M2[i]===54)lv.push(i);
   if(lv.length){const near=(x,y)=>{for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<MW&&Y<MH&&(M2[Y*MW+X]===24||M2[Y*MW+X]===54))return true}return false};
    const back=(x,y)=>{const i=y*MW+x;let v=U2&&U2[i];if(!v||v===31||v===27||SOLID.has(v)){v=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const t=M2[(y+b)*MW+x+a];if(!SOLID.has(t)&&t!==27&&t!==24&&t!==54){v=t;break}}}return v||20};
    for(let k=P2.length-1;k>=0;k--){const p=P2[k];if(p.shrine!==undefined)continue;if(!(p.fire||/debris_fire|cz_fire|pyre|bonfire/.test(p.k||'')))continue;const x=Math.floor(p.x),y=Math.floor(p.y);if(!near(x,y))continue;P2.splice(k,1);const i=y*MW+x;if(M2[i]===31&&!P2.some(q=>Math.floor(q.y)===y&&Math.abs(q.x-(x+.5))<1.2))M2[i]=back(x,y)}
    for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(M2[y*MW+x]===27&&near(x,y))M2[y*MW+x]=back(x,y)}}
  // runda 244: zasada świata: żadnych ognisk w promieniu 6 pól od kociołka (ognisk mocy)
  {const M3=w.map,U3=w.under,P3=w.PROPS,sh3=w.shrines||[];if(sh3.length)for(let k=P3.length-1;k>=0;k--){const p=P3[k];if(p.shrine!==undefined)continue;if(!(p.fire||/debris_fire|cz_fire|pyre|bonfire/.test(p.k||'')))continue;
   if(!sh3.some(s=>Math.hypot(s.x/16-p.x,s.y/16-p.y)<6))continue;P3.splice(k,1);const x=Math.floor(p.x),y=Math.floor(p.y),i=y*MW+x;
   if(M3[i]===31&&!P3.some(q=>Math.floor(q.y)===y&&Math.abs(q.x-(x+.5))<1.2)){let v=U3&&U3[i];if(!v||v===31||v===27||SOLID.has(v)){v=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const t=M3[(y+b)*MW+x+a];if(!SOLID.has(t)&&t!==27&&t!==24&&t!==54){v=t;break}}}M3[i]=v||20}}}
  if(ch===1){layoutPatch1(w);layoutPatch1b(w);layoutPatch1c(w);unblockRoads1(w)}
  if(ch===2)layoutPatch2(w);
  scene.add(w.group);
  const ta=(x,y)=>(x<0||y<0||x>=MW||y>=MH)?21:w.map[y*MW+x];
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const t=ta(x,y);
    if(t===21){let near=false;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const n=ta(x+dx,y+dy);if(n!==21&&!(x+dx<0||y+dy<0||x+dx>=MW||y+dy>=MH))near=true}if(near)w.walls.push([x,y,21])}
    if(t===48||t===58||t===59||t===68||t===69||t===78||t===80)w.walls.push([x,y,t]);if(t===54)w.rots.push([x,y]);
    if(!VOID.has(t)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>VOID.has(ta(x+dx,y+dy))))w.cliffs.push([x,y]);
    if(t===22)w.pillars.push([x,y]);if(t===24)w.lavas.push([x,y]);if(t===27)w.braziers.push([x,y]);if(t===45)w.waters.push([x,y]);if(t===90)w.shallow.push([x,y])}
  const lsrc=(col,int,dist,x,y,z,kind,extra)=>{if(kind==='npc'){int*=.22;dist*=.6}const o=Object.assign({col,base:int,dist,x,y,z,kind,ph:Math.random()*9},extra||{});w.LSRC.push(o);return o};
  if(ch===2){
    w.braziers.forEach(([x,y])=>lsrc(0xff6a1a,1.35,7,x+.5,1.6,y+.6,'fire'));
    for(let x=43;x<60;x+=4){lsrc(0xff4a10,1.6,7,MP(x),.6,MP(13.5),'lava');lsrc(0xff4a10,1.6,7,MP(x),.6,MP(33.5),'lava')}
    for(let z=4;z<MH-2;z+=8)lsrc(0x7a1408,1.3,12,MP(37.5),-4,z,'abyss');
    lsrc(0xff5a14,1.9,7,MP(45),1.2,MP(7.6),'fire');lsrc(0xff5a14,1.9,7,MP(57),1.2,MP(7.6),'fire');
    for(const p of w.PROPS)if(p.k==='rune_lantern')lsrc(0x4a90e0,.55,3.5,p.x,1,p.y-.9,'rune');
    w.shrines.forEach((s,i)=>lsrc(0x5fb0ff,1.2,5,s.x/16,1.2,s.y/16+.6,'shrine',{si:i}));
    lsrc(0x5fb0ff,1.3,6,w.npcs[0].x/16,1.4,w.npcs[0].y/16+.3,'npc',{npc:'tharm'});
    for(const n of w.npcs)if(n.id==='mila'||n.id==='chojrak')lsrc(0xffc070,n.id==='chojrak'?.3:.65,4.5,n.x/16,1.3,n.y/16-.4,'npc',{npc:n.id});
    lsrc(0xd8e4ff,0,14,MP(51),2.2,MP(8),'gate');
  }else if(ch===3){
    w.braziers.forEach(([x,y])=>lsrc(0xff7a2a,1.6,8,x+.5,1.7,y+.6,'fire'));
    for(const p of w.PROPS){if(p.fire)lsrc(0xff6a1a,p.big?2.6:1.6,p.big?11:7,p.x,1.3,p.y-.2,'fire');if(p.k==='street_lantern')lsrc(0xffb060,1,5,p.x,1.5,p.y-.1,'fire')}
    for(const [x,y] of w.rots)if((x*13+y*7)%11===0)lsrc(0xc01838,.8,3.5,x+.5,.4,y+.5,'rot');
    w.shrines.forEach((s,i)=>lsrc(0x5fb0ff,1.2,5,s.x/16,1.2,s.y/16+.6,'shrine',{si:i}));
    for(const n of w.npcs)lsrc(0xffc070,n.id==='chojrak'?.3:.7,4.5,n.x/16,1.3,n.y/16-.4,'npc',{npc:n.id});
    lsrc(0xffcf70,1.8,12,MP(32),7,MP(19),'dome');
  }else if(ch===4){
    for(const p of w.PROPS)if(p.fire)lsrc(0xff7a2a,p.big?2.4:1.6,p.big?10:7,p.x,1.3,p.y-.2,'fire');
    w.shrines.forEach((s,i)=>lsrc(0xffc070,1.1,5,s.x/16,1.2,s.y/16+.6,'shrine',{si:i}));
    for(const p of w.PROPS)if(p.stone!==undefined)lsrc(0x7fd0ff,1.6,6,p.x,1.4,p.y-.3,'stone',{si:p.stone});
    // will-o'-wisps flicker over the marsh
    w.wisps=w.PROPS.filter(p=>p.k==='cz_wisp').map(p=>lsrc(0x7fffd0,.8,3.5,p.x,.8,p.y-.4,'rune'));
    for(const n of w.npcs)if(!n.lure)lsrc(0xffc070,n.id==='chojrak'?.3:.65,4.5,n.x/16,1.3,n.y/16-.4,'npc',{npc:n.id});
    w.treeP=w.PROPS.filter(p=>p.tree).map(p=>({x:p.x*16,y:p.y*16}));
    w.stoneP=w.PROPS.filter(p=>p.stone!==undefined).sort((a,b)=>a.stone-b.stone).map(p=>({x:p.x*16,y:p.y*16}));
    w.altar={pc:'#7fd0ff',one:n=>(EN?`The stone flares blue. Stones awakened: ${n} of 5.`:`Kamień rozbłyska błękitem. Obudzone kamienie: ${n} z 5.`),all:(EN?'The circle closes. An old power heals your wounds and casts 30 coins from the earth.':'Krąg się zamyka. Stara moc leczy twoje rany i wyrzuca z ziemi 30 monet.')};
    w.barrows=w.PROPS.filter(p=>p.barrow).map(p=>({x:p.x*16,y:p.y*16+10}));
  }else if(ch===5){
    w.braziers.forEach(([x,y])=>lsrc(0xff8a30,1.5,8,x+.5,1.6,y+.6,'fire'));
    for(const p of w.PROPS)if(p.anim==='torch')lsrc(0xff8a30,.9,5,p.x,1.2,p.y-.3,'fire');else if(p.k==='order_bonfire')lsrc(0xff8a30,.9,5,p.x,1.1,p.y-.3,'fire');else if(p.k==='candelabra')lsrc(0xffc070,.8,4,p.x,1,p.y-.3,'fire');
    w.shrines.forEach((s,i)=>lsrc(0x5fb0ff,1.2,5,s.x/16,1.2,s.y/16+.6,'shrine',{si:i}));
    for(const n of w.npcs)lsrc(0xffc070,n.id==='chojrak'?.3:.65,4.5,n.x/16,1.3,n.y/16-.4,'npc',{npc:n.id});
    lsrc(0x9a6aff,1.4,9,MP(40),1.4,MP(6.5),'rune');lsrc(0xffcf70,1.1,10,MP(40),1.6,MP(28),'fire');
  }else if(ch===9){
    w.braziers.forEach(([x,y])=>lsrc(0xff6a1a,1.4,7,x+.5,1.6,y+.6,'fire'));
    for(const p of w.PROPS){if(p.k==='rune_lantern')lsrc(0x4a90e0,.6,3.5,p.x,1,p.y-.9,'rune');if(p.exit)lsrc(0x58b4ff,1.3,6.5,p.x,1.5,p.y-.3,'rune')}
    w.shrines.forEach((s,i)=>lsrc(0x5fb0ff,1.2,5,s.x/16,1.2,s.y/16+.6,'shrine',{si:i}));
  }else{
    {const cs=w.PROPS.find(p=>p.k==='crypt_stairs');if(cs){w.crypt={x:(cs.x+1.2)*16,y:(cs.y+.6)*16};lsrc(0xff9a48,1,5.5,cs.x+1.2,1.4,cs.y+.1,'fire')}}
    for(const p of w.PROPS)if(p.fire)lsrc(0xff7a2a,p.big?2.2:1.7,p.big?10:8,p.x,1.3,p.y-.2,'fire');
    w.shrines.forEach((s,i)=>lsrc(0xffc070,1.1,5,s.x/16,1.2,s.y/16+.6,'shrine',{si:i}));
    lsrc(0xffb060,.8,5,w.npcs[1].x/16+.2,1.1,w.npcs[1].y/16+.4,'npc',{npc:'marga'});
    for(const n of w.npcs)if(n.id==='chojrak')lsrc(0xfff0c0,.3,4.5,n.x/16,1.3,n.y/16-.4,'npc',{npc:n.id});
  }
  if(ch<4){for(const p of w.PROPS)if(p.stone!==undefined)lsrc(w.altar.col,1.6,6,p.x,1.4,p.y-.3,'stone',{si:p.stone});w.stoneP=w.PROPS.filter(p=>p.stone!==undefined).sort((a,b)=>a.stone-b.stone).map(p=>({x:p.x*16,y:p.y*16}))}
  w.zoneLight=lsrc(0xff6a1a,0,7,0,1,0,'zone');w.merchantLight=lsrc(0xffb060,1.4,6,0,1.1,0,'merchant');
  WORLDS[ch]=w;
}
function ensureWorld(ch){if(!groupReady(ch))return loadGroup(ch).then(()=>ensureWorld(ch));if(WORLDS[ch])return;if(ch===4&&!IMGS.cz_ground||ch===5&&!IMGS.cy_ground)throw Error((EN?'Missing graphics for act ':'Brak grafik rozdziału ')+ch);initWorld(ch);useWorld(ch);ROOT=W.group;try{[null,buildBrzeznica,buildDolne,buildStolica,buildCzarnobor,buildCytadela][ch](IMGS);fitWorldProps(W,ch);finishWorldArt(W);for(const n of W.npcs){const fr=A[n.art],m=new THREE.Mesh(geo32,fr[0].n);if(fr[0].d){m.customDistanceMaterial=fr[0].d;m.castShadow=true}ROOT.add(m);W.npcMeshes[n.id]=m}try{wallShade()}catch(e){quietErr('wallShade',e)}buildMini()}finally{ROOT=scene}}
function useWorld(ch){CH=ch;W=WORLDS[ch];setGrid(ch);if(A&&A.collectorC5){if(!A.collectorC0)A.collectorC0=A.collector;A.collector=ch===5?A.collectorC5:A.collectorC0}
  if(A&&A.bossC5){if(!A.boss0)A.boss0=A.boss;A.boss=ch===5?A.bossC5:A.boss0}
  ({map,PROPS,LSRC,propObjs,walls,cliffs,pillars,lavas,braziers,waters,region}=W);START=W.start;SHRINES=W.shrines;
  for(const k in WORLDS)WORLDS[k].group.visible=(+k===ch);
  if(typeof applyAtmos==='function')applyAtmos()}

