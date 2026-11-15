#!/usr/bin/env python3
"""NightBrand: arkusze mobow portu (4x2: chod 4, atak 2, smierc 2), 15.11.2026.
Uzycie: python3 moby_portu.py ZRODLO.png WYJSCIE.png [--kolor kontrast,nasycenie,jasnosc,gamma] [--bez-skali]
Wejscie: dowolna siatka 4x2 (np. 1536x1024 z ChatGPT). Wyjscie: 1024x512, klatki 256x256, postac ok. 232 px, stopy na 246,
twarzą w lewo jak reszta zalogi (gra odbija przy wczytaniu). --bez-skali: tylko korekta koloru istniejacego arkusza gry."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
from fabryka import wczytaj_klatki, czysc, skaluj, bbox, stopy_x, koloruj
src, dst = sys.argv[1], sys.argv[2]
kol = None
if '--kolor' in sys.argv:
    k = [float(v) for v in sys.argv[sys.argv.index('--kolor') + 1].split(',')]
    kol = dict(kontrast=k[0], nasycenie=k[1], jasnosc=k[2], gamma=k[3])
if '--bez-skali' in sys.argv:
    im = Image.open(src).convert('RGBA')
    out = koloruj(im, kol) if kol else im
    a = np.asarray(out).copy(); a[..., 3] = np.asarray(im)[..., 3]  # zachowaj oryginalna alfe
    a[..., :3] = np.where(a[..., 3:4] > 0, a[..., :3], 0)
    Image.fromarray(a, 'RGBA').save(dst); sys.exit()
fr = wczytaj_klatki(src, 4, 2)
cl = [[czysc(f) for f in row] for row in fr]
b0 = bbox(cl[0][0]); s = 232 / (b0[3] - b0[1])
out = Image.new('RGBA', (1024, 512), (0, 0, 0, 0))
for r in range(2):
    ax = stopy_x(skaluj(cl[r][0], s))
    for c in range(4):
        g = skaluj(cl[r][c], s); bb = bbox(g)
        cell = Image.new('RGBA', (256, 256), (0, 0, 0, 0)); cell.paste(g, (round(128 - ax), round(246 - bb[3])), g)
        out.paste(cell, (c * 256, r * 256), cell)
if kol: out = koloruj(out, kol)
out.save(dst); print(dst, 'skala', round(s, 3))
