// Siatka bezpieczenstwa startu (10.11.2026): blad podczas wczytywania nie moze zostawic paska na 40% bez slowa
addEventListener('error',ev=>{try{const p=document.getElementById('fenix-load'),rt=document.getElementById('fenix-retry');if(p&&!p.hidden&&window.NB_BOOT){window.NB_BOOT.fail(Error((ev&&ev.message?ev.message:'nieznany błąd')+(ev&&ev.lineno?' (wiersz '+ev.lineno+')':'')));if(rt){rt.textContent='Wyczyść pamięć podręczną i uruchom ponownie';rt.onclick=async()=>{try{for(const k of await caches.keys())await caches.delete(k);for(const r of await navigator.serviceWorker.getRegistrations())await r.unregister()}catch(e){}location.reload()}}}}catch(e){}});
/*NB_ERRNET_END*/

// Shared atlas dependencies: CC0_FLOORS, buildDungeon/build* and buildAnims. Intro remains on demand.
const SPRITE_GROUPS={
  "p1_shop_sign": ["core"],
  "p4_drowned_cart": ["r4"],
  "p4_cz_walk": ["r4"],
  "p4_mossy_boulder": ["core","r4"],
  "p4_fallen_log": ["r4"],
  "p4_reeds": ["core","r4"],
  "p4_mushrooms": ["core","r4"],
  "p4_burial_mound": ["r4"],
  "p4_axe_stump": ["r4"],
  "p4_wolf_skull_bush": ["r4"],
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
  "p5_bookcase_a": ["r5"],
  "p5_bookcase_b": ["r5"],
  "p5_lectern": ["r5"],
  "p5_throne": ["r5"],
  "p5_statue_a": ["r5"],
  "p5_statue_b": ["r5"],
  "p5_scale": ["r5"],
  "p5_vault": ["r5"],
  "p5_bench_a": ["r5"],
  "p5_bench_b": ["r5"],
  "p5_cage": ["r5"],
  "p5_rack": ["r5"],
  "p5_ledgers": ["r5"],
  "p5_goldheap": ["r5"],
  "p5_chest": ["r5"],
  "p5_gallows": ["r5"],
  "p5_candelabra": ["r5"],
  "p5_armour": ["r5"],
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
  "p5_desk": ["r5"],
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
  "p4_dead_spruce": ["r4"],
  "p4_sacred_oak": ["r4"],
  "p4_tall_pine": ["r4"],
  "p4_hanging_tree": ["r4"],
  "p4_standing_stone_dark": ["r4"],
  "p4_standing_stone_lit": ["r4"],
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
  "p3_pyre_0": ["r3"],
  "p3_pyre_1": ["r3"],
  "p3_pyre_2": ["r3"],
  "p3_pyre_3": ["r3"],
  "p1_order_bonfire": ["core"],
  "skill_fx": [
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
  "wl_fort": ["r5"],
  "wl_cap": ["r3", "r5"],
  "wl_plank": ["r3"],
  "wl_hala": ["core","r2"],"wl_kuznia": ["r2"],"wl_kopalnia": ["r2"],"wl_urwisko": ["r2"],"wl_kolumna": ["core","r2"],"wl_halacap": ["core","r2"],
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
  "p1_dead_tree": ["core"],
  "p1_impaled_head": ["core"],
  "p1_grave_cross": ["core"],
  "p1_tombstone": ["core"],
  "p1_well": ["core"],
  "p1_stocks": ["core"],
  "p1_shrine": ["core"],
  "p1_gallows": ["core"],
  "p1_wheel": ["core"],
  "p1_barrel": ["core"],
  "p1_marga_cart": ["core"],
  "p1_crow_post": ["core"],
  "p1_covered_corpses": ["core"],
  "p1_order_banner": ["core"],
  "p1_burnt_hay": ["core"],
  "p1_dead_horse": ["core"],
  "p2_king_statue": ["r2"],
  "p2_anvil": ["r2"],
  "p2_mine_cart": ["r2"],
  "p2_pickaxe_rack": ["r2"],
  "p2_healing_shrine": ["core","r2"],
  "p2_depleted_shrine": ["core","r2"],
  "p2_chains": ["core","r2"],
  "p2_fallen_pillar": ["core","r2"],
  "p2_dwarf_bones": ["core","r2"],
  "p2_bellows": ["r2"],
  "p2_sarcophagus": ["core","r2"],
  "p2_chapel_stairs": ["core","r2"],
  "p2_rune_lantern": ["core","r2"],
  "p2_black_powder": ["r2"],
  "p2_clan_banner": ["core","r2"],
  "p3_beggar_bodies": ["r3"],
  "p3_broken_bell": ["r3"],
  "p3_cathedral_gate": ["r3"],
  "p3_depleted_shrine": ["r3"],
  "p3_doorway_bones": ["r3"],
  "p3_gibbet": ["r3"],
  "p3_healing_shrine": ["r3"],
  "p3_noble_carriage": ["r3"],
  "p3_noble_door": ["r3"],
  "p3_offering_bowl": ["r3"],
  "p3_plague_cart": ["r3"],
  "p3_queen_fountain": ["r3"],
  "p3_royal_banner": ["r3"],
  "p3_saint_king": ["r3"],
  "p3_street_lantern": ["r3"],
  "p4_birch": ["core","r4"],
  "p4_brambles": ["core","r4"],
  "p4_cz_beehive": ["r4"],
  "p4_cz_bones": ["r4"],
  "p4_cz_firewood": ["r4"],
  "p4_cz_gallows": ["r4"],
  "p4_cz_idol": ["r4"],
  "p4_cz_pelts": ["r4"],
  "p4_cz_sacpole": ["r4"],
  "p4_cz_shrine": ["r4"],
  "p4_cz_shrine_burnt": ["r4"],
  "p4_cz_skullpole": ["r4"],
  "p4_cz_tent": ["r4"],
  "p4_cz_wagon": ["r4"],
  "p4_cz_wheel": ["r4"],
  "p4_dead_oak": ["core","r4"],
  "p4_ferns": ["core","r4"],
  "p4_spruce": ["core","r4"],
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
  "jerzak": [
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
  "zl_en_a": [
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
  "cy_en_d": [
    "r5"
  ],
  "zl_en_c": [
    "r3"
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
  "cy_en_a": [
    "r5"
  ],
  "cy_en_b": [
    "r5"
  ],
  "cy_en_c": [
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
  "cz_en_a": [
    "r4"
  ],
  "goat_beast": [
    "r4"
  ],
  "shield_dead": [
    "core"
  ],
  "cz_en_b": [
    "r4"
  ],
  "cz_en_c": [
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
