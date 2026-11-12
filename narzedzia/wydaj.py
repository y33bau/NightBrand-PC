#!/usr/bin/env python3
"""NightBrand: wydawanie wersji. Uzycie:
  python3 wydaj.py rehash KATALOG ROZSZERZENIE STARY_HASH PLIK_EDYCJI   # podmiana tresci pliku js/css z hashem (PLIK_EDYCJI definiuje EDITS=[(stare,nowe),...], kazde 'stare' musi wystapic dokladnie raz)
  python3 wydaj.py dodaj KATALOG PLIK KATEGORIA [leniwy]                # nowy zasob (hash w nazwie) do assets/KATEGORIA/, manifestu i sw.js; leniwy = pobierany przy pierwszym uzyciu
                                                                        # KATEGORIA: bohaterowie wrogowie npc rekwizyty tekstury efekty ikony ui tla muzyka dzwieki czcionki (js/css: bez kategorii)
  python3 wydaj.py wersja KATALOG "opis rundy"                          # nowy numer cache w sw.js + linijka w WERSJA.txt + kontrola sprawdz.py
rehash: podmienia plik pod nowa nazwa (SHA-256 tresci), usuwa stary, poprawia manifest.json i sw.js."""
import sys,os,re,json,hashlib,datetime,subprocess
def die(m):print('BLAD:',m);sys.exit(1)
if len(sys.argv)<3:die(__doc__)
cmd,R=sys.argv[1],sys.argv[2]
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
    sys.exit(subprocess.run([sys.executable,sp,R]).returncode)
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
