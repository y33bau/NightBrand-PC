#!/usr/bin/env python3
"""NightBrand: porzadkuje assets/ w podfoldery wg kategorii (reguly: assety_wspolne.py).
Uzycie: python3 przenies_assety.py KATALOG_GRY [--sucho]
--sucho: tylko pokazuje, co by sie stalo (nic nie zapisuje).
Co robi:
 1) przenosi pliki binarne (grafika, dzwiek, czcionki) do assets/<kategoria>/<hash>.<ext> (nazwa pliku bez zmian);
 2) przepisuje sciezki w plikach js i css (zmienia sie ich tresc, wiec dostaja nowy SHA-256 w nazwie), w index.html,
    sw.js i assets/manifest.json (url, bytes, sha256, styles, scripts);
 3) sprawdza wynik: kazdy wpis manifestu i kazde odwolanie w kodzie wskazuje istniejacy plik.
Po nim: python3 rozloz.py KATALOG_GRY zrodlo/main (zrodlo ma te same sciezki), potem wydaj.py wersja.
Bezpieczne do ponownego uruchomienia (pliki juz na miejscu sa pomijane)."""
import sys,os,re,json,shutil,collections
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from assety_wspolne import *
arg=[a for a in sys.argv[1:] if not a.startswith('--')];SUCHO='--sucho' in sys.argv
if not arg:sys.exit(__doc__)
R=arg[0].rstrip('/');A=R+'/assets/'
def die(m):sys.exit('BLAD: '+m)

# 1) plan przeniesienia
ref=odwolania(A,R);NK={};ruchy=[];brak=[]
for p in lista_plikow(A):
    h=hash_pliku(p);ext=p.rsplit('.',1)[-1].lower()
    if not h:continue
    r=ref.get(h,{'klucze':set(),'kto':set()})
    kat,pew=kategoria(h,ext,r['klucze'],r['kto'],os.path.getsize(A+p))
    if pew=='brak':brak.append(p);continue
    if kat is None:continue                      # js, css, txt: zostaja w assets/
    NK[h]=kat;nowy=kat+'/'+h+'.'+ext
    if p!=nowy:ruchy.append((p,nowy))
if brak:die('pliki bez kategorii (dopisz regule w assety_wspolne.py): '+', '.join(brak[:5]))

def przepisz(s):
    def a(m):
        h=m.group(2);return m.group(0) if h not in NK else 'assets/%s/%s.%s'%(NK[h],h,m.group(3))
    def c(m):
        h=m.group(2);return m.group(0) if h not in NK else 'url(./%s/%s.%s)'%(NK[h],h,m.group(3))
    return RE_CSS.sub(c,RE_ASSETS.sub(a,s))

# 2) pliki tekstowe: nowa tresc -> nowy hash
tren={};tnowe={}      # stara nazwa (bez katalogu) -> nowa ; nowa nazwa -> bajty
for f in sorted(os.listdir(A)):
    if not f.endswith(KORZEN_EXT):continue
    raw=open(A+f,'rb').read();s=raw.decode('utf8');s2=przepisz(s)
    if s2!=s:
        nb=s2.encode('utf8');nn=sha_b(nb)+'.'+f.rsplit('.',1)[1];tren[f]=nn;tnowe[nn]=nb
rozm=collections.Counter(NK[h] for _,n in ruchy for h in [hash_pliku(n)])
print('do przeniesienia: %d plikow %s'%(len(ruchy),dict(rozm)))
print('pliki tekstowe z nowa trescia (nowy hash): %d'%len(tren))
for o,n in tren.items():print('   %s.. -> %s..'%(o[:12],n[:12]))
if SUCHO:print('\n(--sucho: nic nie zapisano)');sys.exit(0)
if not ruchy and not tren:print('Nic do zrobienia: assets/ jest juz uporzadkowany.');sys.exit(0)

# zapis: pliki binarne
for p,n in ruchy:
    os.makedirs(A+n.rsplit('/',1)[0],exist_ok=True);shutil.move(A+p,A+n)
# zapis: js/css pod nowa nazwa
for f,nn in tren.items():
    open(A+nn,'wb').write(tnowe[nn]);os.remove(A+f)
def podmien_nazwy(s):
    for o,n in tren.items():s=s.replace(o.rsplit('.',1)[0],n.rsplit('.',1)[0])
    return s
# index.html, sw.js
for p in (R+'/index.html',R+'/sw.js'):
    s=open(p,'rb').read().decode('utf8');s2=podmien_nazwy(przepisz(s))
    if s2!=s:open(p,'wb').write(s2.encode('utf8'))
# manifest
mp=A+'manifest.json';m=json.loads(podmien_nazwy(przepisz(open(mp,'rb').read().decode('utf8'))))
for f in m['files']:
    nn=os.path.basename(f['url'])
    if nn in tnowe:f['bytes']=len(tnowe[nn]);f['sha256']=nn.split('.')[0]
open(mp,'wb').write(json.dumps(m,ensure_ascii=False,separators=(',',':')).encode('utf8'))

# 3) kontrola
err=[]
for f in m['files']:
    p=R+'/'+f['url']
    if not os.path.exists(p):err.append('manifest: brak pliku '+f['url']);continue
    b=open(p,'rb').read()
    if len(b)!=f['bytes'] or (f.get('sha256') and sha_b(b)!=f['sha256']):err.append('manifest: rozmiar/hash '+f['url'])
for k in('styles','scripts'):
    for u in m[k]:
        if not os.path.exists(R+'/'+u):err.append('manifest.%s: brak %s'%(k,u))
tek=[A+f for f in os.listdir(A) if f.endswith(KORZEN_EXT)]+[R+'/index.html',R+'/sw.js']
for p in tek:
    s=open(p,'rb').read().decode('utf8','ignore')
    for mm in RE_ASSETS.finditer(s):
        q=A+(mm.group(1)+mm.group(2)+'.'+mm.group(3))
        if not os.path.exists(q):err.append('%s: odwolanie do brakujacego %s'%(os.path.basename(p)[:12],q[len(R)+1:][:60]))
    if p.endswith('.css'):
        for mm in RE_CSS.finditer(s):
            q=A+(mm.group(1)+mm.group(2)+'.'+mm.group(3))
            if not os.path.exists(q):err.append('css: odwolanie do brakujacego '+q[len(R)+1:][:60])
luz=[f for f in os.listdir(A) if os.path.isfile(A+f) and f!='manifest.json' and not f.endswith(KORZEN_EXT+('.txt',))]
if luz:err.append('w assets/ zostaly luzem: '+', '.join(luz[:4]))
print('\nPrzeniesiono %d plikow, zmieniono %d plikow tekstowych.'%(len(ruchy),len(tren)))
if err:print('BLEDY (%d):'%len(err));[print('  ',e) for e in err[:20]];sys.exit(1)
print('Kontrola: OK (manifest, odwolania w kodzie i CSS wskazuja istniejace pliki).')
