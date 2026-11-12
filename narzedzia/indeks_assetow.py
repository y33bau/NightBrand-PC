#!/usr/bin/env python3
"""NightBrand: spis zasobow gry. Uzycie: python3 indeks_assetow.py KATALOG_GRY [WYJSCIE.json]
Dla kazdego pliku w assets/ zapisuje: sciezke, typ, rozmiar, wymiary (grafika), nazwy z kodu (klucze SPRITE_DATA,
zmienne, klucze dzwiekow), kto go uzywa i kategorie (podfolder). Reguly kategorii: assety_wspolne.py.
Domyslne wyjscie: docs/INDEKS_ASSETOW.json obok katalogu gry. Wypisuje pliki, ktorych kategorii nie da sie ustalic."""
import sys,os,json,collections
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from assety_wspolne import *
try:from PIL import Image
except Exception:Image=None
R=sys.argv[1].rstrip('/');A=R+'/assets/'
out=sys.argv[2] if len(sys.argv)>2 else os.path.join(os.path.dirname(os.path.abspath(R)),'docs','INDEKS_ASSETOW.json')
ref=odwolania(A,R);wpisy=[];brak=[];slab=[]
for p in lista_plikow(A):
    h=hash_pliku(p);ext=p.rsplit('.',1)[-1].lower();b=os.path.getsize(A+p);r=ref.get(h,{'klucze':set(),'kto':set()}) if h else {'klucze':set(),'kto':set()}
    kat,pew=kategoria(h,ext,r['klucze'],r['kto'],b)
    w={'plik':'assets/'+p,'hash':h,'typ':ext,'bajty':b}
    if Image and ext in('png','webp'):
        try:w['wymiary']=list(Image.open(A+p).size)
        except Exception:pass
    if r['klucze']:w['klucze']=sorted(r['klucze'])
    if r['kto']:w['uzywa']=sorted(r['kto'])
    w['kategoria']=kat or 'korzen';w['pewnosc']=pew
    wpisy.append(w)
    if pew=='brak':brak.append(w)
    if pew in('css','rozmiar'):slab.append(w)
os.makedirs(os.path.dirname(out),exist_ok=True)
json.dump({'wersja':1,'opis':'Spis zasobow gry (generowany: narzedzia/indeks_assetow.py). pewnosc: klucz=nazwa z kodu, css=tylko CSS, rozmiar=zgadniete po rozmiarze, brak=nieustalona.','pliki':wpisy},open(out,'w',encoding='utf8'),ensure_ascii=False,indent=0)
c=collections.Counter((w['kategoria'],w['pewnosc']) for w in wpisy)
sz=collections.defaultdict(int)
for w in wpisy:sz[w['kategoria']]+=w['bajty']
print('plikow:',len(wpisy),'->',out)
for k in sorted(sz):print('  %-12s %4d plikow  %6.1f MB   %s'%(k,sum(v for (kk,_),v in c.items() if kk==k),sz[k]/1e6,{pe:v for (kk,pe),v in c.items() if kk==k}))
print('\nBEZ KATEGORII (%d):'%len(brak))
for w in brak:print('  ',w['plik'],w['typ'],w['bajty'],w.get('wymiary',''),w.get('uzywa',''))
