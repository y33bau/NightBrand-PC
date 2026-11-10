#!/usr/bin/env python3
"""Rozklada glowny plik gry na czesci. Uzycie: python3 rozloz.py KATALOG_GRY KATALOG_ZRODLA
Uzyj raz na start albo gdy ktos (np. Codex) zmienil plik gry bezposrednio. Sprawdza, ze sklejenie czesci daje identyczny plik."""
import sys,os;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from zrodlo_wspolne import *
G,S=sys.argv[1],sys.argv[2];p=glowny(G);t=open(p,encoding='utf8').read()
os.makedirs(S,exist_ok=True)
for n,c in podziel(t):open(os.path.join(S,n),'w',encoding='utf8',newline='').write(c)
assert sklej(S)==t,'sklejenie rozni sie od oryginalu'
open(os.path.join(S,'OSTATNI_BUILD.txt'),'w').write(sha(t)+'\n')
print('OK: %d czesci, sklejenie identyczne bajt w bajt (%s)'%(len(CZESCI),sha(t)[:12]))
