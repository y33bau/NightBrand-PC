#!/usr/bin/env python3
"""NightBrand: wbudowanie układu menu z edytora (?edytor=1) do gry.
Uzycie:
  python3 narzedzia/wbuduj_uklad.py PLIK_UKLADU.json KATALOG_GRY
PLIK_UKLADU: plik z przycisku "Zapisz plik układu" (uklad-menu-*.json) albo tekst "NBLAYOUT ...".
Wpisuje układ do NB_LAYOUT_DEF w zrodlo/main/27_menu_usprawnienia.js, a obrazy autora dodaje
do KATALOG_GRY/assets/ui przez wydaj.py dodaj i wpisuje ich adresy do NB_IMG_DEF.
Potem: zbuduj.py i wydaj.py wersja jak zwykle."""
import sys,os,re,json,base64,subprocess,tempfile
def die(m):print('BLAD:',m);sys.exit(1)
if len(sys.argv)<3:die(__doc__)
plik,R=sys.argv[1],sys.argv[2]
TU=os.path.dirname(os.path.abspath(__file__));SRC=os.path.join(TU,'..','zrodlo','main','27_menu_usprawnienia.js')
t=open(plik,encoding='utf8').read()
try:d=json.loads(t)
except Exception:
    m=re.search(r'\{[\s\S]*\}',t);d=json.loads(m.group(0)) if m else die('to nie jest plik układu')
uklad=d.get('uklad',{}) if d.get('typ')=='NBLAYOUT' else d
obrazy=d.get('obrazy',{}) if d.get('typ')=='NBLAYOUT' else {}
s=open(SRC,encoding='utf8').read()
def zamien(nazwa,obj):
    global s
    i=s.index('const %s='%nazwa)+len('const %s='%nazwa);j=s.index('; /*',i)
    s=s[:i]+json.dumps(obj,ensure_ascii=False,separators=(',',':'))+s[j:]
def stary(nazwa):
    i=s.index('const %s='%nazwa)+len('const %s='%nazwa);j=s.index('; /*',i);return json.loads(s[i:j])
img=stary('NB_IMG_DEF');uzyte={v[4]['img'] for v in uklad.values() if isinstance(v,list) and len(v)>4 and isinstance(v[4],dict) and v[4].get('img')}
tmp=tempfile.mkdtemp()
for n in sorted(uzyte):
    if n in img and n not in obrazy:continue
    if n not in obrazy:print('UWAGA: brak obrazu',n,'w pliku – element zostanie bez obrazu');continue
    head,b64=obrazy[n].split(',',1);ext='webp' if 'webp' in head else 'png' if 'png' in head else 'jpg'
    p=os.path.join(tmp,re.sub(r'\.\w+$','',n)+'.'+ext);open(p,'wb').write(base64.b64decode(b64))
    url=subprocess.run([sys.executable,os.path.join(TU,'wydaj.py'),'dodaj',R,p,'ui'],capture_output=True,text=True,check=True).stdout.strip().splitlines()[-1]
    img[n]=url;print('obraz',n,'->',url)
zamien('NB_LAYOUT_DEF',uklad);zamien('NB_IMG_DEF',img)
open(SRC,'w',encoding='utf8',newline='').write(s)
print('OK: wbudowano %d zmian, %d obrazów. Teraz zbuduj.py i wydaj.py wersja.'%(len(uklad),len(uzyte)))
