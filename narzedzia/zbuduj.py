#!/usr/bin/env python3
"""Skleja czesci zrodla w glowny plik gry. Uzycie: python3 zbuduj.py KATALOG_ZRODLA KATALOG_GRY
- bez zmian w zrodle: nic nie robi;
- ze zmianami: zapisuje plik pod nowym hashem, usuwa stary, poprawia manifest.json i sw.js, sprawdza skladnie;
- STRAZNIK: jesli plik w grze zmienil sie poza zrodlem (np. Codex), przerywa; najpierw rozloz.py.
Potem: python3 wydaj.py wersja KATALOG_GRY "opis" (nowy cache + WERSJA.txt + sprawdz)."""
import sys,os,json,subprocess;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from zrodlo_wspolne import *
S,G=sys.argv[1],sys.argv[2];p=glowny(G);old=os.path.basename(p)[:-3];cur=open(p,encoding='utf8').read()
last=open(os.path.join(S,'OSTATNI_BUILD.txt')).read().strip()
if sha(cur)!=last:raise SystemExit('BLAD: glowny plik gry ma inna tresc niz ostatni build ze zrodla (ktos zmienil gre poza zrodlem, np. Codex). Najpierw: python3 rozloz.py %s %s, potem nanies zmiany w zrodle jeszcze raz.'%(G,S))
t=sklej(S);nh=sha(t)
if nh==old:print('Bez zmian: zrodlo = plik gry (%s..)'%nh[:12]);sys.exit(0)
A=G+'/assets/';np_=A+nh+'.js';open(np_,'w',encoding='utf8',newline='').write(t)
r=subprocess.run(['node','--check',np_],capture_output=True,text=True)
if r.returncode:os.remove(np_);raise SystemExit('BLAD skladni, nic nie zmieniono:\n'+r.stderr[:600])
os.remove(p)
m=json.load(open(A+'manifest.json',encoding='utf8'))
for k in('styles','scripts'):m[k]=[v.replace(old,nh) for v in m[k]]
for f in m['files']:
    if old in f['url']:f.update(url=f['url'].replace(old,nh),bytes=len(t.encode()),sha256=nh)
open(A+'manifest.json','w',encoding='utf8').write(json.dumps(m,ensure_ascii=False,separators=(',',':')))
sw=open(G+'/sw.js',encoding='utf8').read();assert old in sw;open(G+'/sw.js','w',encoding='utf8',newline='').write(sw.replace(old,nh))
open(os.path.join(S,'OSTATNI_BUILD.txt'),'w',newline='').write(nh+'\n')
print('Zbudowano: %s.. -> %s..'%(old[:12],nh[:12]))
