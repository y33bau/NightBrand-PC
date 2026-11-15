#!/usr/bin/env python3
"""NightBrand: wydawanie wersji. Uzycie:
  python3 wydaj.py rehash KATALOG ROZSZERZENIE STARY_HASH PLIK_EDYCJI   # podmiana tresci pliku js/css z hashem (PLIK_EDYCJI definiuje EDITS=[(stare,nowe),...], kazde 'stare' musi wystapic dokladnie raz)
  python3 wydaj.py dodaj KATALOG PLIK KATEGORIA [leniwy]                # nowy zasob (hash w nazwie) do assets/KATEGORIA/, manifestu i sw.js; leniwy = pobierany przy pierwszym uzyciu
                                                                        # KATEGORIA: bohaterowie wrogowie npc rekwizyty tekstury efekty ikony ui tla muzyka dzwieki czcionki (js/css: bez kategorii)
  python3 wydaj.py wersja KATALOG "opis rundy"                          # nowy numer cache w sw.js + linijka w WERSJA.txt + kontrola limitu plikow itch.io + kontrola sprawdz.py
  python3 wydaj.py itch KATALOG [PLIK.zip]                              # zip dla itch.io: drobne pliki sklejone w paczke (opcja bez-paczek wylacza), bez edytor-map/ i bez wpisow katalogow, kontrola limitu; domyslnie ../NightBrand_itch_<cache>.zip
rehash: podmienia plik pod nowa nazwa (SHA-256 tresci), usuwa stary, poprawia manifest.json i sw.js."""
import sys,os,re,json,hashlib,datetime,subprocess
def die(m):print('BLAD:',m);sys.exit(1)
if len(sys.argv)<3:die(__doc__)
cmd,R=sys.argv[1],sys.argv[2]
# itch.io: gra w przegladarce moze miec w zipie najwyzej 1000 plikow (liczone razem z katalogami); wyzej na stronie gry pojawia sie blad zamiast gry
ITCH_LIMIT,ITCH_MAX=1000,990
def pliki_itch():
    """pliki, ktore trafia do zipa dla itch.io (bez edytor-map/: narzedzia autora nie wchodza do wersji dla graczy)"""
    out=[]
    for d,ds,fs in os.walk(R):
        rel=os.path.relpath(d,R)
        if rel=='edytor-map' or rel.startswith('edytor-map'+os.sep):continue
        out+=[os.path.join(rel,f) if rel!='.' else f for f in fs]
    return out
def kontrola_itch():
    n=len(pliki_itch())
    try:
        mp=json.load(open(R+'/assets/manifest.json',encoding='utf8'))
        if not mp.get('packs'):k=paczkuj(R,True);n=n-k+(1 if k else 0)   # wersja z repo: liczba plikow po paczkowaniu
    except SystemExit:pass
    print('pliki w zipie dla itch.io: %d / %d (strazni od %d)'%(n,ITCH_LIMIT,ITCH_MAX+1))
    if n>ITCH_MAX:print('BLAD: za duzo plikow dla itch.io (zip bez wpisow katalogow). Zlacz drobne zasoby (atlas/paczka) albo usun nieuzywane, potem ponow.');return 1
    if n>ITCH_MAX-40:print('UWAGA: malo zapasu (%d wolnych miejsc), nastepne nowe zasoby przekrocza limit.'%(ITCH_MAX-n))
    return 0
PACZKA_MAX=30000
PACZKA_TYP={'webp':'image/webp','png':'image/png','jpg':'image/jpeg','avif':'image/avif','svg':'image/svg+xml','mp3':'audio/mpeg','ogg':'audio/ogg','wav':'audio/wav','woff2':'font/woff2','woff':'font/woff','ttf':'font/ttf'}
def paczkuj(R,proba=False):
    """skleja drobne pliki w jedna paczke (tylko w kopii dla itch.io); zwraca liczbe sklejonych plikow"""
    A=R+'/assets/';m=json.load(open(A+'manifest.json',encoding='utf8'))
    boot=[x for x in re.findall(r'assets/[0-9a-f]{64}\.js',open(R+'/index.html',encoding='utf8').read())]
    if not boot or 'manifest.packs' not in open(R+'/'+boot[0],encoding='utf8').read():die('modul startowy nie obsluguje paczek (manifest.packs)')
    kod=''.join(open(A+os.path.basename(u),encoding='utf8').read() for u in m['styles']+m['scripts'])
    html=open(R+'/index.html',encoding='utf8').read()
    RX=re.compile(r'(?:\./|assets/)?[a-z]+/([0-9a-f]{64})\.[a-z0-9]+')
    pelne={};[pelne.__setitem__(h,pelne.get(h,0)+1) for h in RX.findall(kod)]
    wybrane=[]
    for f in m['files']:
        u=f['url'];parts=u.split('/')
        if len(parts)!=3 or parts[1]=='muzyka':continue
        h,ext=parts[2].rsplit('.',1)
        if ext not in PACZKA_TYP or f['bytes']>=PACZKA_MAX or h in html:continue
        n=kod.count(h)
        if n==0 or n!=pelne.get(h,0):continue   # tylko pliki wskazane w kodzie zawsze pelna sciezka (kat/hash.ext)
        wybrane.append(f)
    if proba:return len(wybrane)
    blob=bytearray();items=[]
    for f in wybrane:
        b=open(R+'/'+f['url'],'rb').read();h,ext=f['url'].split('/')[2].rsplit('.',1)
        items.append(dict(h=h,url=f['url'],o=len(blob),n=len(b),t=PACZKA_TYP[ext],**({'a':1} if f.get('audio') or ext in('mp3','ogg','wav') else {})));blob+=b
    if not items:return 0
    sh=hashlib.sha256(bytes(blob)).hexdigest();url='assets/%s.bin'%sh;open(R+'/'+url,'wb').write(bytes(blob))
    usun={f['url'] for f in wybrane};m['files']=[f for f in m['files'] if f['url'] not in usun]
    m['packs']=[{'url':url,'bytes':len(blob),'sha256':sh,'items':items}]
    open(A+'manifest.json','w',encoding='utf8',newline='').write(json.dumps(m,ensure_ascii=False,separators=(',',':')))
    sw=open(R+'/sw.js',encoding='utf8').read()
    for u in usun:sw=sw.replace('"'+u+'",','').replace(',"'+u+'"','').replace('"'+u+'"','')
    sw=sw.replace('F=[','F=["'+url+'",',1);open(R+'/sw.js','w',encoding='utf8',newline='').write(sw)
    for u in usun:os.remove(R+'/'+u)
    if subprocess.run(['node','--check',R+'/sw.js']).returncode:die('sw.js po paczkowaniu ma blad skladni')
    return len(items)
if cmd=='rehash':
    ext,old,ed=sys.argv[3:6];A=R+'/assets/'
    t=open(A+old+'.'+ext,encoding='utf8').read();EDITS=[];exec(open(ed,encoding='utf8').read())
    for a,b in EDITS:
        n=t.count(a)
        if n!=1:die('kotwica wystepuje %d razy (ma byc 1): %s'%(n,a[:80]))
        t=t.replace(a,b)
    nh=hashlib.sha256(t.encode()).hexdigest();open(A+nh+'.'+ext,'w',encoding='utf8',newline='').write(t);os.remove(A+old+'.'+ext)
    m=json.load(open(A+'manifest.json',encoding='utf8'))
    for k in('styles','scripts'):m[k]=[v.replace(old,nh) for v in m[k]]
    for f in m['files']:
        if old in f['url']:f.update(url=f['url'].replace(old,nh),bytes=len(t.encode()),sha256=nh)
    open(A+'manifest.json','w',encoding='utf8',newline='').write(json.dumps(m,ensure_ascii=False,separators=(',',':')))
    sw=open(R+'/sw.js',encoding='utf8').read();assert old in sw;open(R+'/sw.js','w',encoding='utf8',newline='').write(sw.replace(old,nh))
    print('nowy hash:',nh)
elif cmd=='wersja':
    opis=sys.argv[3] if len(sys.argv)>3 else die('podaj opis rundy');p=R+'/sw.js';sw=open(p,encoding='utf8').read()
    m=re.search(r"nightbrand-codex-(\d{8})-(\d+)",sw)
    if not m:die('brak stalej cache w sw.js')
    new='nightbrand-codex-%s-%d'%(datetime.date.today().strftime('%Y%m%d'),int(m.group(2))+1)
    open(p,'w',encoding='utf8',newline='').write(sw.replace(m.group(0),new,1))
    open(R+'/WERSJA.txt','a',encoding='utf8',newline='').write('cache%d · %s\n'%(int(m.group(2))+1,opis))
    print('cache:',new)
    sp=os.path.join(os.path.dirname(os.path.abspath(__file__)),'sprawdz.py')
    kod=subprocess.run([sys.executable,sp,R]).returncode
    sys.exit(kod or kontrola_itch())
elif cmd=='itch':
    import zipfile,shutil,tempfile
    m=re.search(r"nightbrand-codex-\d{8}-(\d+)",open(R+'/sw.js',encoding='utf8').read())
    out=os.path.abspath(sys.argv[3] if len(sys.argv)>3 else os.path.join(R,'..','NightBrand_itch_%s.zip'%(m.group(1) if m else 'x')))
    bez='bez-paczek' in sys.argv[4:]
    # PACZKOWANIE (15.11.2026): drobne pliki (< PACZKA_MAX bajtow) sklejone w jedna paczke assets/<sha>.bin,
    # opis w manifest.json -> packs; modul startowy (FENIX) rozcina paczke i podmienia adresy w CSS/JS na blob.
    # Repo i gra lokalna bez zmian: paczka powstaje tylko w kopii tymczasowej dla zipa itch.io.
    if not bez:
        T=tempfile.mkdtemp(prefix='nb_itch_');D=os.path.join(T,'gra');shutil.copytree(R,D,ignore=shutil.ignore_patterns('edytor-map'));R=D
        print('paczka: %d plikow sklejonych'%paczkuj(R))
    if kontrola_itch():sys.exit(1)
    if os.path.exists(out):os.remove(out)
    r=subprocess.run(['zip','-qr','-9','-D',out,'.','-x','edytor-map/*'],cwd=R)
    if r.returncode:die('zip nie powiodl sie')
    z=zipfile.ZipFile(out);n=len(z.namelist());kat=sum(1 for x in z.namelist() if x.endswith('/'))
    print('zip: %s, wpisow %d (katalogow %d), %.1f MB'%(out,n,kat,os.path.getsize(out)/1e6))
    if n>ITCH_MAX or any(x.startswith('edytor-map') for x in z.namelist()):os.remove(out);die('zip niezgodny z regulami (limit lub edytor-map), usuniety')
    if not bez:shutil.rmtree(T,ignore_errors=True)
elif cmd=='dodaj':
    # dodaj KATALOG PLIK [leniwy]: nowy zasob pod nazwa = SHA-256 tresci, wpis w manifest.json i w sw.js
    # (F = pobierane od razu przy instalacji; L = "leniwe": pobierane dopiero przy pierwszym uzyciu, ale trzymane w cache)
    sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from assety_wspolne import KATEGORIE
    src=sys.argv[3];ex=sys.argv[4:];lazy='leniwy' in ex;kat=next((x for x in ex if x in KATEGORIE),'');b=open(src,'rb').read();nh=hashlib.sha256(b).hexdigest()
    ext=src.rsplit('.',1)[-1].lower()
    if ext not in('js','css','txt') and not kat:die('podaj KATEGORIE zasobu: '+' '.join(KATEGORIE))
    if ext in('js','css','txt'):kat=''
    url='assets/%s%s.%s'%(kat+'/' if kat else '',nh,ext);A=R+'/assets/'
    if not os.path.exists(R+'/'+url):os.makedirs(os.path.dirname(R+'/'+url),exist_ok=True);open(R+'/'+url,'wb').write(b)
    m=json.load(open(A+'manifest.json',encoding='utf8'))
    if not any(f['url']==url for f in m['files']):m['files'].append(dict({'url':url,'bytes':len(b),'sha256':nh},**({'lazy':True} if lazy else {})))  # lazy: modul startowy (FENIX) nie pobiera przy starcie
    open(A+'manifest.json','w',encoding='utf8',newline='').write(json.dumps(m,ensure_ascii=False,separators=(',',':')))
    sw=open(R+'/sw.js',encoding='utf8').read()
    if url not in sw:
        if lazy:
            if '\nconst L=[' not in sw:i=sw.index('];\n')+3;sw=sw[:i]+'const L=[];\n'+sw[i:]
            i=sw.index('\nconst L=[')+len('\nconst L=[');sw=sw[:i]+('"%s"'%url)+(',' if sw[i]!=']' else '')+sw[i:]
        else:
            i=sw.index('const C=');i=sw.index('F=[',i)+3;sw=sw[:i]+('"%s",'%url)+sw[i:]
        open(R+'/sw.js','w',encoding='utf8',newline='').write(sw)
    print(url)
else:die(__doc__)
