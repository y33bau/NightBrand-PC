"""NightBrand: podmiana obrazow (te same obrazy, inny zapis pliku).
Uzycie: python3 podmien_obrazy.py KATALOG_GRY LISTA.json
LISTA.json: [{"f":"<stara_nazwa>.webp","src":"<sciezka_nowego_pliku>","ext":"webp (opcjonalnie, gdy zmienia sie format)"}, ...]
Dla kazdego obrazu: nowy plik pod nazwa SHA-256, stary usuniety, poprawione wpisy w manifest.json, sw.js
i w plikach tekstowych (SPRITE_DATA, CSS), ktore go wskazuja. Zmienione pliki tekstowe dostaja nowe nazwy
(SHA-256) i te tez sa poprawiane w manifest.json, sw.js i index.html. Na koncu uruchom wydaj.py wersja.
Glownego pliku gry nie zmienia (jesli wskazuje obraz, przerywa: wtedy zmiana przez zrodlo)."""
import sys,os,json,hashlib
R=sys.argv[1].rstrip('/');A=R+'/assets/';L=json.load(open(sys.argv[2]))
sha=lambda b:hashlib.sha256(b).hexdigest()
man=json.load(open(A+'manifest.json',encoding='utf8'))
texts=[f for f in os.listdir(A) if f.endswith(('.js','.css'))]
main=[f for f in texts if '============ WORLDS' in open(A+f,encoding='utf8',errors='ignore').read()]
ren={}  # old name -> new name (bez katalogu)
for it in L:
    old=it['f'];b=open(it['src'],'rb').read();ext=it.get('ext') or old.rsplit('.',1)[1];new=sha(b)+'.'+ext
    if any(old[:64] in open(A+m,encoding='utf8').read() for m in main):sys.exit('BLAD: glowny plik gry wskazuje '+old)
    open(A+new,'wb').write(b);os.remove(A+old);ren[old]=new
    for f in man['files']:
        if f['url']=='assets/'+old:f.update(url='assets/'+new,bytes=len(b),sha256=new[:64])
# pliki tekstowe wskazujace podmienione obrazy
tren={}
for t in texts:
    if t in main or not os.path.exists(A+t):continue
    s=open(A+t,encoding='utf8').read();s2=s
    for o,n in ren.items():s2=s2.replace(o,n)
    if s2!=s:
        nb=s2.encode();nn=sha(nb)+'.'+t.rsplit('.',1)[1];open(A+nn,'wb').write(nb);os.remove(A+t);tren[t]=nn
        for f in man['files']:
            if f['url']=='assets/'+t:f.update(url='assets/'+nn,bytes=len(nb),sha256=nn[:64])
def rep(v):
    for o,n in tren.items():v=v.replace(o,n)
    return v
for k in('styles','scripts'):
    if k in man:man[k]=[rep(v) for v in man[k]]
open(A+'manifest.json','w',encoding='utf8').write(json.dumps(man,ensure_ascii=False,separators=(',',':')))
allren={**ren,**tren}
for p in (R+'/sw.js',R+'/index.html'):
    s=open(p,encoding='utf8').read();s2=s
    for o,n in allren.items():s2=s2.replace(o,n)
    if s2!=s:open(p,'w',encoding='utf8').write(s2)
print('obrazy:',len(ren),'pliki tekstowe:',list(tren.values()))
