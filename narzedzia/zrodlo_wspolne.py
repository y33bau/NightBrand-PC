"""NightBrand: wspolne dla rozloz.py i zbuduj.py. Glowny plik gry dzielimy na czesci wg znacznikow sekcji (poczatek linii)."""
import os,re,json,hashlib
# (plik czesci, poczatek linii, od ktorej zaczyna sie czesc); pierwsza czesc od 1. linii
CZESCI=[
 ('00_grupy_sprite.js',None),
 ('01_start_jezyk.js','(()=>{\nconst $=id=>document.getElementById(id);'),
 ('02_swiaty.js','/* ============ WORLDS ============ */'),
 ('03_three_teren.js','/* ============ THREE SETUP ============ */'),
 ('04_three_sciany_ciecze.js','// cutaway: walls and pillars'),
 ('05_three_skala_dekoracje.js','// Shared sheets keep identical proportions'),
 ('06_three_siatki_rozdzialow.js','// Chapter II meshes'),
 ('07_swiatla_uklad_map.js','// lights: many sources per chapter'),
 ('08_sprite_sheets.js','/* ============ SPRITE SHEETS ============ */'),
 ('09_audio_ustawienia_grafika.js','/* ============ AUDIO ============ */'),
 ('10_stan_gry.js','/* ============ GAME STATE ============ */'),
 ('11_dwoch_graczy_gracz.js','/* ===== tryb 2 graczy'),
 ('12_walka.js','/* ============ WALKA MIECZEM'),
 ('13_wrogowie.js','/* ============ ENEMIES ============ */'),
 ('14_umiejetnosci.js','/* ============ SKILLS ============ */'),
 ('15_etapy.js','/* ============ LEVEL STAGES'),
 ('16_krypta.js','/* ============ THE CRYPT'),
 ('17_render.js','/* ============ RENDER ============ */'),
 ('18_minimapa.js','/* ============ MINIMAP ============ */'),
 ('19_hud.js','/* ============ HUD & FLOW ============ */'),
 ('20_fabula.js','// ===== FABUŁA'),
 ('21_muzyka.js','// ===== MUZYKA'),
 ('22_postac_zapis_ustawienia.js','// ---- postać: poziom'),
 ('23_instrukcja_sterowanie.js','// ---- INSTRUKCJA GRY'),
 ('24_pad_samouczek_bledy.js','// ---- pad Xbox'),
 ('25_grafika_wydajnosc.js','// Runda 308: dynamiczna rozdzielczosc'),
 ('26_start_petla.js','// Accessible title presentation'),
 ('27_menu_usprawnienia.js','// ===== Menu PC: usprawnienia 13.11.2026'),
]
ZNAK='/* ============ WORLDS ============ */'  # po tym rozpoznajemy glowny plik gry
def glowny(G):
    m=json.load(open(G+'/assets/manifest.json',encoding='utf8'))
    for u in m['scripts']:
        p=G+'/'+u
        if ZNAK in open(p,encoding='utf8').read():return p
    raise SystemExit('BLAD: nie znaleziono glownego pliku gry (znacznik WORLDS)')
def podziel(t):
    L=t.split('\n');granice=[0]
    for nazwa,znak in CZESCI[1:]:
        zs=znak.split('\n');idx=[i for i in range(len(L)-len(zs)+1) if all(L[i+j].startswith(z) for j,z in enumerate(zs))]
        if len(idx)!=1:raise SystemExit('BLAD: znacznik %r wystepuje %d razy (ma byc 1)'%(znak,len(idx)))
        if idx[0]<=granice[-1]:raise SystemExit('BLAD: zla kolejnosc znacznika %r'%znak)
        granice.append(idx[0])
    granice.append(len(L));out=[]
    for k,(nazwa,_) in enumerate(CZESCI):
        cz=L[granice[k]:granice[k+1]];out.append((nazwa,'\n'.join(cz)+('\n' if k<len(CZESCI)-1 else '')))
    return out
def sklej(S):
    return ''.join(open(os.path.join(S,n),encoding='utf8').read() for n,_ in CZESCI)
def sha(t):return hashlib.sha256(t.encode()).hexdigest()
