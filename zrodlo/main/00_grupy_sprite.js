// Siatka bezpieczenstwa startu (10.11.2026): blad podczas wczytywania nie moze zostawic paska na 40% bez slowa
addEventListener('error',ev=>{try{const p=document.getElementById('fenix-load'),rt=document.getElementById('fenix-retry');if(p&&!p.hidden&&window.NB_BOOT){window.NB_BOOT.fail(Error((ev&&ev.message?ev.message:'nieznany błąd')+(ev&&ev.lineno?' (wiersz '+ev.lineno+')':'')));if(rt){rt.textContent='Wyczyść pamięć podręczną i uruchom ponownie';rt.onclick=async()=>{try{for(const k of await caches.keys())await caches.delete(k);for(const r of await navigator.serviceWorker.getRegistrations())await r.unregister()}catch(e){}location.reload()}}}}catch(e){}});
/*NB_ERRNET_END*/

// Shared atlas dependencies: CC0_FLOORS, buildDungeon/build* and buildAnims. Intro remains on demand.
const SPRITE_GROUPS={
  "cc0_c5_archiwum": ["r5"],
  "cc0_c5_atrament": ["r5"],
  "cc0_c5_dywan": ["r5"],
  "cc0_c5_dziedziniec": ["r5"],
  "cc0_c5_loch": ["r5"],
  "cc0_c5_marmur": ["r5"],
  "cc0_c5_pieczec": ["r5"],
  "cc0_c5_skarbiec": ["r5"],
  "wl_c5_mur": ["r5"],
  "wl_c5_wew": ["r5"],
  "p4_cz_walk": ["r4"],
  "p4_fallen_log": ["r4"],
  "p4_reeds": ["core","r4"],
  "p4_mushrooms": ["core","r4"],
  "p4_wd0": ["r4"],
  "p4_wd1": ["r4"],
  "p4_wd2": ["r4"],
  "p4_wd3": ["r4"],
  "p4_wd4": ["r4"],
  "p4_wd5": ["r4"],
  "p4_wd6": ["r4"],
  "p4_wd7": ["r4"],
  "p4_wd8": ["r4"],
  "p4_wd9": ["r4"],
  "p4_wd10": ["r4"],
  "p4_wd11": ["r4"],
  "p4_sp0": ["r4"],
  "p4_sp1": ["r4"],
  "p4_sp2": ["r4"],
  "p4_sp3": ["r4"],
  "p4_sp4": ["r4"],
  "p4_sp5": ["r4"],
  "p4_sp6": ["r4"],
  "p4_sp7": ["r4"],
  "p4_sp8": ["r4"],
  "p4_sp9": ["r4"],
  "p4_sp10": ["r4"],
  "p4_sp11": ["r4"],
  "p0_np_grass": ["core"],
  "p0_np_tall": ["core"],
  "p0_np_fern": ["core"],
  "p0_np_thistle": ["core"],
  "p5_pillar_a": ["r5"],
  "p5_pillar_b": ["r5"],
  "p5_bench_a": ["r5"],
  "p5_bench_b": ["r5"],
  "p5_cage": ["r5"],
  "p5_ledgers": ["r5"],
  "p5_goldheap": ["r5"],
  "p5_chest": ["r5"],
  "p5_gallows": ["r5"],
  "p5_well": ["r5"],
  "p5_chest_open": ["r5"],
  "p5_scroll": ["r5"],
  "p5_book": ["r5"],
  "p5_inkwell": ["r5"],
  "p5_seal": ["r5"],
  "p5_chains_0": ["r5"],
  "p5_chains_1": ["r5"],
  "p5_shackles": ["r5"],
  "p5_skull": ["r5"],
  "p5_chair": ["r5"],
  "p5_inkbarrel": ["r5"],
  "p5_cart": ["r5"],
  "p5_pages_0": ["r5"],
  "p5_pages_1": ["r5"],
  "p5_raven_0": ["r5"],
  "p5_raven_1": ["r5"],
  "p5_purse": ["r5"],
  "p5_goblet": ["r5"],
  "p5_keys": ["r5"],
  "p5_swordbooks": ["r5"],
  "p4_standing_stone_dark": ["r4"],
  "p4_standing_stone_lit": ["r4"],
  "p1_order_bonfire": ["core"],
  "p3_pyre_0": ["r3"],
  "p3_pyre_1": ["r3"],
  "p3_pyre_2": ["r3"],
  "p3_pyre_3": ["r3"],
  "p2_fallen_pillar": ["core","r2"],
  "p4_brambles": ["core","r4"],
  "p1_crypt_stairs": ["core"],
  "p4_cz_fire_0": ["r4"],
  "p4_cz_fire_1": ["r4"],
  "p4_cz_fire_2": ["r4"],
  "p4_cz_fire_3": ["r4"],
  "p1_debris_fire_0": ["core"],
  "p1_debris_fire_1": ["core"],
  "p1_debris_fire_2": ["core"],
  "p1_debris_fire_3": ["core"],
  "p1_house_fire_0": ["core"],
  "p1_house_fire_1": ["core"],
  "p1_house_fire_2": ["core"],
  "p1_house_fire_3": ["core"],
  "skill_fx": [
    "core"
  ],
  "kat_fx": [
    "core"
  ],
  "combat_fx": [
    "core"
  ],
  "whirl_fx": [
    "core"
  ],
  "cc0_dirt2": [
    "core"
  ],
  "cc0_dirt3": [
    "r4"
  ],
  "cc0_ground1": [
    "core",
    "r2",
    "r5"
  ],
  "cc0_ground2": [
    "core",
    "r5"
  ],
  "cc0_zl_place": [
    "r3"
  ],
  "cc0_zl_street": [
    "r3"
  ],
  "wl_town": ["r3"],
  "wl_win": ["r3"],
  "rf_gold": ["r3"],
  "rf_goldm": ["r3"],
  "wl_fort": ["r3","r5"],
  "wl_cap": ["r3", "r5"],
  "wl_plank": ["r3"],
  "wl_hala": ["core","r2"],"wl_kuznia": ["r2"],"wl_kopalnia": ["r2"],"wl_urwisko": ["r2"],"wl_kolumna": ["core","r2","r3"],"wl_halacap": ["core","r2"],
  "wl_dolina": ["r4"],"wl_lasu": ["r4"],"wl_obozpal": ["r4"],"wl_wieza": ["r4"],
  "wl_palisada": ["core"],"wl_chata": ["core"],"wl_palecap": ["core"],
  "cc0_cracks": [
    "core"
  ],
  "cc0_charcoal": [
    "core",
    "r2"
  ],
  "cc0_deski": ["core"],
  "rf_lupek": ["core"],
  "p1_impaled_head": ["core"],
  "p1_shrine": ["core"],
  "p1_covered_corpses": ["core"],
  "p2_brazier_0": ["r2","r3","r5"],
  "p2_brazier_1": ["r2","r3","r5"],
  "p2_brazier_2": ["r2","r3","r5"],
  "p2_brazier_3": ["r2","r3","r5"],
  "p2_furnace_0": ["r2"],
  "p2_furnace_1": ["r2"],
  "p3_rot_bloom_0": ["r3"],
  "p3_rot_bloom_1": ["r3"],
  "p2_healing_shrine": ["core","r2"],
  "p2_depleted_shrine": ["core","r2"],
  "p2_dwarf_bones": ["core","r2"],
  "p2_chapel_stairs": ["core","r2"],
  "p2_clan_banner": ["core","r2"],
  "p3_beggar_bodies": ["r3"],
  "p3_broken_bell": ["r3"],
  "p3_cathedral_gate": ["r3"],
  "p3_depleted_shrine": ["r3"],
  "p3_doorway_bones": ["r3"],
  "p3_healing_shrine": ["r3"],
  "p3_noble_carriage": ["r3"],
  "p3_noble_door": ["r3"],
  "p3_street_lantern": ["r3"],
  "p3_roof_tile": ["r3"],
  "p3_roof_tile_gold": ["r3"],
  "p3_roof_ridge": ["r3"],
  "p3_wall_top": ["r3"],
  "p3_roof_shack": ["r3"],
  "p3_roof_lead": ["r3"],
  "p1_roof_burnt": ["core"],
  "water_shallow": ["core","r4"],
  "ford_stones": ["r4"],
  "p4_cz_shrine": ["r4"],
  "p4_cz_shrine_burnt": ["r4"],
  "p4_cz_skullpole": ["r4"],
  "p4_ferns": ["core","r4"],
  "cc0_lava": [
    "core"
  ],
  "cc0_water": [
    "core",
    "r4"
  ],
  "cc0_ash": [
    "core"
  ],
  "cc0_moss1": [
    "core"
  ],
  "cc0_zl_moss": [
    "r3"
  ],
  "cc0_forestmoss": [
    "r4"
  ],
  "cc0_abyss": [
    "r2"
  ],
  "cc0_blackrock": [
    "r2",
    "r5"
  ],
  "cc0_mud": [
    "r4"
  ],
  "cc0_leaves": [
    "r4"
  ],
  "cc0_darkrock": [
    "r4"
  ],
  "protagonist_a": [
    "core"
  ],
  "protagonist_b": [
    "core"
  ],
  "village_undead": [
    "core"
  ],
  "order_deep_dead": [
    "core"
  ],
  "boss_zrost": [
    "core"
  ],
  "cumlin": [
    "r2"
  ],
  "cumlin_fx": [
    "r2"
  ],
  "ally_npcs": [
    "core"
  ],
  "effects_pickups": [
    "core"
  ],
  "collector": [
    "core"
  ],
  "npc_new": [
    "core"
  ],
  "dm_floor": [
    "core",
    "r2"
  ],
  "dm_walls": [
    "core",
    "r2"
  ],
  "dm_props": [
    "core",
    "r2"
  ],
  "decals": [
    "core"
  ],
  "trans": [
    "core"
  ],
  "br_ground": [
    "core"
  ],
  "br_walls": [
    "core"
  ],
  "br_props": [
    "core"
  ],
  "zl_ground": [
    "r3"
  ],
  "zl_walls": [
    "r3"
  ],
  "zl_props": [
    "r3"
  ],
  "zl_en_b": [
    "r3"
  ],
  "morhad": [
    "r3"
  ],
  "pani_lasu": [
    "r4"
  ],
  "cy_ground": [
    "r5"
  ],
  "cy_big": [
    "r5"
  ],
  "cy_props": [
    "r5"
  ],
  "cy_walls": [
    "r5"
  ],
  "cy_npc": [
    "r5"
  ],
  "rachm": [
    "r5"
  ],
  "wierz1": [
    "r5"
  ],
  "wierz2": [
    "r5"
  ],
  "cz_ground": [
    "r4"
  ],
  "cz_walls": [
    "r4"
  ],
  "cz_trees": [
    "core",
    "r4"
  ],
  "cz_props": [
    "r4"
  ],
  "cz_npc": [
    "r4"
  ],
  "leszy": [
    "r4"
  ],
  "strzyga": [
    "r4"
  ],
  "strzyga_b": [
    "r4"
  ],
  "kat_d": [
    "core"
  ],
  "kat_db": [
    "core"
  ],
  "kat_dc": [
    "core"
  ],
  "kat_dd": [
    "core"
  ],
  "kat_def": [
    "core"
  ],
  "kat_death": [
    "core"
  ],
  "kat_leap": [
    "core"
  ],
  "kat_whirl": [
    "core"
  ],
  "zab_d": [
    "core"
  ],
  "dzw_d": [
    "core"
  ],
  "dzw_db": [
    "core"
  ],
  "dzw_dc": [
    "core"
  ],
  "dzw_dd": [
    "core"
  ],
  "dzw_def": [
    "core"
  ],
  "dzw_ex": [
    "core"
  ],
  "dzw_sk": [
    "core"
  ],
  "dzw_zas": [
    "core"
  ],
  "zab_db": [
    "core"
  ],
  "zab_dc": [
    "core"
  ],
  "zab_dd": [
    "core"
  ],
  "zab_def": [
    "core"
  ],
  "zab_death": [
    "core"
  ],
  "zab_rend": [
    "core"
  ],
  "zab_fan": [
    "core"
  ],
  "zab_whirl": [
    "core"
  ],
  "knight_d": [
    "core"
  ],
  "knight_db": [
    "core"
  ],
  "knight_dc": [
    "core"
  ],
  "knight_dd": [
    "core"
  ],
  "knight_def": [
    "core"
  ],
  "knight_death": [
    "core"
  ],
  "knight_whirl": [
    "core"
  ],
  "zab_atk45": [
    "core"
  ],
  "mob_possessed": ["core"],
  "mob_ghoul": ["core"],
  "mob_bat": ["core"],
  "mob_dwarf": ["core"],
  "mob_knight": ["core"],
  "mob_warden": ["core"],
  "mob_shieldman": ["core"],
  "mob_madman": ["r3", "core"],
  "mob_hound": ["r3"],
  "mob_rotknight": ["r3", "r5"],
  "mob_militia": ["r3", "r2"],
  "mob_marauder": ["r3", "r5"],
  "mob_gravedigger": ["r3", "r4"],
  "mob_goat": ["r4"],
  "mob_wolf": ["r4"],
  "mob_bandit": ["r4"],
  "mob_xbow": ["r4"],
  "mob_drowner": ["r4"],
  "mob_strzygon": ["r4"],
  "mob_zmora": ["r4"],
  "mob_wisp": ["r4"],
  "mob_bies": ["r4"],
  "mob_wight": ["r4"],
  "mob_guard": ["r5"],
  "mob_scribe": ["r5"],
  "mob_executioner": ["r5"],
  "mob_debtor": ["r5"],
  "mob_wraith": ["r5"],
  "mob_courtraven": ["r5"],
  "mob_paperrat": ["r5"],
  "mob_bookgolem": ["r5"],
  "mob_condemned": ["r5"],
  "mob_judge": ["r5"],
  "mob_arbiter": ["r5"],
  "mob_cursed": ["r5"],
  "npc_chojrak": ["core"],
  "npcp_chojrak": ["core"],
  "npc_marga": ["core"],
  "npcp_marga": ["core"],
  "npc_elder": ["core"],
  "npcp_elder": ["core"],
  "npc_wit": ["core"],
  "npcp_wit": ["core"],
  "npc_nawoj": ["core"],
  "npcp_nawoj": ["core"],
  "npc_mila": ["r2"],
  "npcp_mila": ["r2"],
  "npc_tharm": ["r2"],
  "npcp_tharm": ["r2"],
  "npc_rudna": ["r2"],
  "npcp_rudna": ["r2"],
  "npc_heri": ["r3"],
  "npcp_heri": ["r3"],
  "npc_izolda": ["r3"],
  "npcp_izolda": ["r3"],
  "npc_ottokar": ["r3"],
  "npcp_ottokar": ["r3"],
  "npc_aurel": ["r3"],
  "npcp_aurel": ["r3"],
  "npc_seweryna": ["r3"],
  "npcp_seweryna": ["r3"],
  "npc_wierz": ["r4"],
  "npcp_wierz": ["r4"],
  "npc_bartosz": ["r4"],
  "npcp_bartosz": ["r4"],
  "npc_wolch": ["r4"],
  "npcp_wolch": ["r4"],
  "npc_dobromir": ["r4"],
  "npcp_dobromir": ["r4"],
  "npc_skryba": ["r5"],
  "npcp_skryba": ["r5"],
  "npc_straznik": ["r5"],
  "npcp_straznik": ["r5"],
  "npc_pieczetnik": ["r5"],
  "npcp_pieczetnik": ["r5"],
  "npc_lucjan": ["r5"],
  "npcp_lucjan": ["r5"],
  "mil_d": ["core"],
  "mil_db": ["core"],
  "mil_dc": ["core"],
  "mil_dd": ["core"],
  "mil_def": ["core"],
  "mil_ex": ["core"],
  "mil_sk": ["core"],
  "mil_fx": ["core"],
  "mob_glizzard": ["r2"],
  "mob_glz_fx": ["r2"],
  "golem_a": [
    "core"
  ],
  "golem_b": [
    "core"
  ],
  "kat_hook": [
    "core"
  ],
  "fx_zab": [
    "core"
  ],
  "fx_kat": [
    "core"
  ],
  "hero_d": [
    "core"
  ],
  "hero_db": [
    "core"
  ],
  "hero_dc": [
    "core"
  ],
  "hero_dd": [
    "core"
  ],
  "hero_def": [
    "core"
  ],
  "intro1": [
    "core"
  ],
  "intro1_fallback": [
    "core"
  ],
  "intro2": [
    "r2"
  ],
  "intro2_fallback": [
    "r2"
  ],
  "intro3": [
    "r3"
  ],
  "intro3_fallback": [
    "r3"
  ],
  "intro4": [
    "r4"
  ],
  "intro4_fallback": [
    "r4"
  ],
  "intro5": [
    "r5"
  ],
  "intro5_fallback": [
    "r5"
  ]
};


// Rozdzial III (Solne Nabrzeze, numer techniczny 6): zasoby portu w grupie r6
{
 const add=(k,url)=>{SPRITE_DATA[k]=url;SPRITE_GROUPS[k]=['r6']};
 add('port_atlas','assets/rekwizyty/201e598e7e7a138e23dd51003cc170649947d446e51da7f4b2bdf698bf36a749.png');
 add('port_statek','assets/rekwizyty/ea7da3fa084717e705a0a0623c6ea968952c27be15984027ebc12257248bc1a6.webp');
 add('port_prom','assets/rekwizyty/2aa15a3577af03437d7d929ab87e1a539e1f2f80685a30e56bf434f31b2ae5b6.webp');// 15.11.2026: prom widziany prosto z gory (obraz autora, ChatGPT)
 // nawierzchnie: malowane tekstury gry (bruk, plyty, deski) przetworzone na mokry, chlodny, przesolony port
 add('port_bruk','assets/tekstury/7660f4dd57a7fc0e2a8bbacfdb499d589938ca75409482b72d9882bf460f2206.webp');
 add('port_trakt','assets/tekstury/d87776dd8beda5559f9bdafe07a810e23e40b02077de14c38dfcf1794faf19f8.webp');
 add('port_sol','assets/tekstury/67797f6c19e6b7beb78c7e3b1c77752da8e44e4a434984eab2cf352e060543f3.webp');
 add('port_mech','assets/tekstury/8454bbaadb3452d3e06c571e38f6b7eeafdada0921c731747d114c0fce0c3809.webp');
 add('port_plyty','assets/tekstury/4732ad1c63e0c41e0450a874ad6bba9e3bfd4b12136a9cc9a5721b2fdeeca9db.webp');
 add('port_nalot','assets/tekstury/4e76e1d91b2d570539cfc8432932a77a15478bb3eecc030f0484889d60a6a33f.webp');
 add('port_deski','assets/tekstury/23136565c5788d197ac9283c4a84c215f0a55380fc7808305435fd441077e4a5.webp');
 // zaloga portu (8 klatek 4x2) i Bosman (16 klatek 4x4)
 add('port_bosman','assets/wrogowie/377bbf229b70ac00cf00611949f8e2e98d05b3f00f7d4c3c28ad7d5dd3041611.webp');
 add('port_tragarz','assets/wrogowie/a6c15dfbdbb07987e7d0f397995885042928908d733f4c5fd36943f328c36f38.webp');
 add('port_sieciarka','assets/wrogowie/80c8765a01ea2a8b603d5bc4991ca62729b76179b6d27a35562ac1df43802902.webp');
 add('port_kalafater','assets/wrogowie/5d9af078d6aca19d63010f101ad8d7f6030d4f78fd6b31a99e29f658a054f770.webp');
 add('port_krab','assets/wrogowie/987ec9cd54cef2bc641c269ea87ff062c08df0cba59931f62f9b8eb66c035762.webp');
 add('port_latarnik','assets/wrogowie/73259f5be8c4cd08f5784232633c7e5b0a7b879e87972602d46ef5811e2f2a42.webp');
 add('port_nurek','assets/wrogowie/67c971100e3f00d7277f01e584a92f48affecd53c97bd2404f8090665c2a7458.webp');
 add('port_cumownik','assets/wrogowie/e8f00308a92193e885200e8dd414d06a424e0193c7cc8f4712ff7116f1e27853.webp');
 add('intro1','assets/tla/c8c3968edb367c7be327106c1fafd57e5edf67ba28a6181eda3bb585e73f84ef.webp');add('intro2','assets/tla/7c2d199370c18c4f9538807b7ed4ea2710679c89c412cdfb964d73c229e04c11.webp');add('intro3','assets/tla/3dc098a98d1294fe0047673365fdfb738239db093f7bdb89d526acf2c8d4f7ad.webp');add('intro4','assets/tla/b5acdd84a065fd7fbd3dc0d51dda1175fd3a0551641b5bf02964dafd288473a7.webp');add('intro5','assets/tla/76c4abede7b11dab955422e0b91d11d6a38a1feecdd13c62d91f37a0813a6057.webp');add('intro6','assets/tla/d1fa360949a93c4762b2578a14cf8957aaeb8e64bbf3a69445d984fc7aaa7c93.webp');
 // nowi z 15.11.2026: pijawczarz (zwykly), muszlowy rozbitek (ciezki), dzwonnik glebin (elita); atlas zbutwialych rekwizytow 4x3
 add('port_pijawczarz','assets/wrogowie/e7f35047a826d9869a7203e79760e423208cebe2f92ef3dd009c1a21aae8fc88.webp');add('port_muszlowy','assets/wrogowie/e17131ea32fcc99570c1a6f6a91602a627c001e461be571c8a8074f32332b536.webp');add('port_dzwonnik','assets/wrogowie/9b1c48e9e625b11c4e64d20bf504465baccbbfcc414a0b0f88c0d0b62dbe7953.webp');add('port_rekwizyty','assets/rekwizyty/9fce90821fc60ff3aaa76d78f7712cdc1819d4b2431b67e0252fb3b386939ae1.webp');
 // NPC portu (14.11.2026): Ambrozy (celnik) i Wieslawa (karczmarka); arkusz 4 klatki 256 px (gestosc 4) i portret
 add('npc_ambrozy','assets/npc/81a5fb580d7f0a1a390e467469ebc2904c26209d111626e0c0db1e4dd92c4d7c.webp');
 add('npc_wieslawa','assets/npc/20125bc556763b19c895c2be1c978cc264a38532b0fc627c4bdb81d3a5fb0772.webp');
 add('npcp_ambrozy','assets/npc/5effebccbad8f9e48fc9326cc40bb086b7c8d0379eccd5b6b9be53ee93906266.webp');
 add('npcp_wieslawa','assets/npc/1fbd07cb44e343db2b4a085e6797eb3f92fa5cf6c51deb22bfac206785b4bea9.webp');
 SPRITE_RES.npc_ambrozy=4;SPRITE_RES.npc_wieslawa=4;
 // koksowniki i mur oporowy korzystaja z grafik innych rozdzialow
 for(const k of ['p2_brazier_0','p2_brazier_1','p2_brazier_2','p2_brazier_3','wl_fort','wl_cap','wl_town','wl_plank','p3_roof_tile','p3_roof_shack','p3_street_lantern'])if(SPRITE_GROUPS[k]&&!SPRITE_GROUPS[k].includes('r6'))SPRITE_GROUPS[k].push('r6');
}

// Rycerz, nowy styl (15.11.2026): arkusz Wypadu (4 klatki: bok, dol, gora; rzad 4 = powrot: bok, dol, gora)
SPRITE_DATA.knight_lunge='assets/bohaterowie/1f76d653dbc6ba1a746da6d304996a61bbc6d9cba69ea996059bf3e316272727.webp';SPRITE_RES.knight_lunge=4;SPRITE_GROUPS.knight_lunge=['core'];

// Efekty ataków HD (15.11.2026): 3 atlasy, komórki 320 px, 8 kolumn; spis klatek w SKM_HD (11_dwoch_graczy_gracz.js)
SPRITE_DATA.fxhd_0='assets/efekty/f86141e6be400f946b0ac1228df014b642838f615a1553b7b82bce44520078ba.webp';SPRITE_GROUPS.fxhd_0=['core'];SPRITE_DATA.fxhd_1='assets/efekty/b3ff692e2e82fbcef6a4532e54adea9eda780565db1a2ae91590ab212a55a0cc.webp';SPRITE_GROUPS.fxhd_1=['core'];SPRITE_DATA.fxhd_2='assets/efekty/48da6a443c84a91ce4ce4bc62216de2e31b42478eefa64d7230c47379b6b7819.webp';SPRITE_GROUPS.fxhd_2=['core'];
