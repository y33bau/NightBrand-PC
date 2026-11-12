"""NightBrand: wspolne dla indeks_assetow.py, przenies_assety.py, sprawdz.py.
Zasoby gry leza w assets/. Nazwa pliku = SHA-256 tresci (odswiezanie pamieci podrecznej).
Pliki binarne (grafika, dzwiek, czcionki) leza w podfolderach wg kategorii: assets/<kategoria>/<hash>.<ext>.
W glownym assets/ zostaja: manifest.json, pliki js/css (CSS uzywa sciezek wzglednych ./hash) i pliki licencji."""
import os,re,hashlib

HEX=r'[0-9a-f]{64}'
KATEGORIE=('bohaterowie','wrogowie','npc','rekwizyty','tekstury','efekty','ikony','ui','tla','muzyka','dzwieki','czcionki')
KORZEN_EXT=('.js','.css')           # zostaja w assets/
# odwolanie w js/html/sw/manifest:  assets/[kategoria/]hash.ext      w CSS:  url(./[kategoria/]hash.ext)
RE_ASSETS=re.compile(r'assets/((?:[a-z0-9_\-]+/)?)('+HEX+r')\.([a-z0-9]+)')
RE_CSS=re.compile(r'url\(\./((?:[a-z0-9_\-]+/)?)('+HEX+r')\.([a-z0-9]+)\)')
# klucz tuz przed odwolaniem:  "klucz":"assets/..   klucz:'assets/..   NAZWA='./assets/..
RE_KLUCZ=re.compile(r"""(?:["'`]([^"'`:{}\[\],]{1,60})["'`]|([A-Za-z_$][A-Za-z0-9_$]*))\s*[:=]\s*[\[\(]?\s*["'`]\.?/?$""")

def sha_b(b):return hashlib.sha256(b).hexdigest()

def lista_plikow(A):
    """Sciezki wzgledne do assets/ (z '/'), bez manifest.json, posortowane."""
    out=[]
    for r,_,fs in os.walk(A):
        for f in fs:
            p=os.path.relpath(os.path.join(r,f),A).replace(os.sep,'/')
            if p!='manifest.json':out.append(p)
    return sorted(out)

def hash_pliku(p):
    stem=p.rsplit('/',1)[-1].split('.')[0]
    return stem if re.fullmatch(HEX,stem) else None

def klucz_przed(s,poz):
    m=RE_KLUCZ.search(s[max(0,poz-90):poz])
    return (m.group(1) or m.group(2)).strip() if m else None

def odwolania(A,R):
    """Zbiera odwolania do zasobow: {hash: {'klucze':set, 'kto':set}}. A=katalog assets/, R=katalog gry."""
    wynik={}
    def dodaj(h,kto,k):
        d=wynik.setdefault(h,{'klucze':set(),'kto':set()});d['kto'].add(kto)
        if k:d['klucze'].add(k)
    pliki=[(A+f,'js:'+f[:8]) for f in os.listdir(A) if f.endswith('.js')]
    pliki+=[(R+'/index.html','index.html')]
    for p,kto in pliki:
        s=open(p,encoding='utf8',errors='ignore').read()
        for m in RE_ASSETS.finditer(s):dodaj(m.group(2),kto,klucz_przed(s,m.start()))
    for f in os.listdir(A):
        if f.endswith('.css'):
            s=open(A+f,encoding='utf8',errors='ignore').read()
            for m in RE_CSS.finditer(s):dodaj(m.group(2),'css:'+f[:8],None)
    return wynik

# ---- klasyfikacja ----
def prefiks(k):return re.split(r'[_\d\- ]',k)[0].lower()
PREF={  # prefiks klucza (SPRITE_DATA, zmienne, klucze w kodzie) -> kategoria
 'zab':'bohaterowie','kat':'bohaterowie','dzw':'bohaterowie','mil':'bohaterowie','knight':'bohaterowie','hero':'bohaterowie','protagonist':'bohaterowie',
 'mob':'wrogowie','wierz':'wrogowie','strzyga':'wrogowie','golem':'wrogowie','morhad':'wrogowie','pani':'wrogowie','rachm':'wrogowie','leszy':'wrogowie',
 'boss':'wrogowie','collector':'wrogowie','village':'wrogowie','order':'wrogowie','cumlin':'wrogowie',
 'npc':'npc','npcp':'npc','ally':'npc',
 'p':'rekwizyty',
 'cc':'tekstury','wl':'tekstury','cy':'tekstury','cz':'tekstury','zl':'tekstury','rf':'tekstury','dm':'tekstury','br':'tekstury','water':'tekstury','ford':'tekstury',
 'fx':'efekty','skill':'efekty','combat':'efekty','whirl':'efekty','effects':'efekty','decals':'efekty','trans':'efekty',
 'skille':'ikony','perki':'ikony','wyzwania':'ikony','kaplica':'ikony',
 'intro':'tla','rozdzial':'tla',
 'portret':'ui','nawigacja':'ui','ramka':'ui','tryby':'ui','przycisk':'ui',
}
NAZWY={  # zmienne w kodzie glownym -> kategoria (odwolania bez klucza w postaci prefiks_nazwa)
 'ROOF_PNG':'tekstury','TOTEM_PNG':'rekwizyty','POT_PNG':'rekwizyty','ENDING_IMG':'tla','ENDING_IMG_FB':'tla','ASH':'efekty',
 'rama':'ui','obrecz':'ui','ziarno':'ui','chmury':'tla','play':'ui','menu':'ui','heads':'ui','panel':'ui','idle':'ui','selected':'ui',
 'divider':'ui','flow':'ui','orb':'ui','glass':'ui','rail':'ui','slot':'ui','clock':'ui','map':'ui',
}
RECZNE={  # pliki bez czytelnego klucza w kodzie (poczatek hasha -> kategoria); ustalone z kontekstu uzycia
 '00f26693':'ui','b7a93afc':'ui',              # ikony trybow gry (index.html)
 '1c380bcc':'ui','8d6f9789':'ui','bfb4247a':'ui','dadca335':'ui',   # plansze skrotow klawiszy/pada PL i EN
 '44da4714':'ui','bae550b0':'ui','eda186e0':'ui',   # tlo przyciskow, bordowa tkanina menu, alfabet naglowkow
 '7a06226b':'tla','aa9137b4':'tla',            # tlo Kaplicy, chmury
 '913cdc8e':'wrogowie','ec46e83d':'efekty',    # atlas Bestiariusza, atlas krwi
}
MUZYKA_RE=re.compile(r'^(c\d|crypt|menu|intro|ending)',re.I)

def kategoria(plik,ext,klucze,kto,bajty):
    """plik = hash (lub None). Zwraca (kategoria, pewnosc): 'klucz' | 'css' | 'recznie' | 'rozmiar' | 'brak'."""
    if plik and plik[:8] in RECZNE:return RECZNE[plik[:8]],'recznie'
    if ext in('woff2','ttf','otf','woff'):return 'czcionki','rozszerzenie'
    if ext in('js','css'):return None,'korzen'
    if ext=='txt':return None,'korzen'
    if ext in('mp3','ogg','wav','m4a'):
        for k in sorted(klucze):
            if MUZYKA_RE.match(k):return 'muzyka','klucz'
        if klucze:return 'dzwieki','klucz'
        return ('muzyka' if bajty>1_000_000 else 'dzwieki'),'rozmiar'
    for k in sorted(klucze):
        if k in NAZWY:return NAZWY[k],'klucz'
        p=prefiks(k)
        if p in PREF:return PREF[p],'klucz'
    if any(x.startswith('css:') for x in kto):return 'ui','css'
    return None,'brak'
