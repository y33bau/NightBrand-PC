#!/usr/bin/env python3
"""NightBrand: fabryka arkuszy bohaterow (nowy styl, 15.11.2026).
Czysci przezroczystosc (szum alfa z ChatGPT), skaluje postac do wzrostu klasy, stawia stopy na linii,
sklada atlasy gry 1024x1536 (4 kolumny x 6 rzedow po 256 px, gestosc 4) i robi arkusz kontrolny.
Uzycie: python3 fabryka.py PLAN.json KATALOG_WYJSCIA
PLAN: {"wzrost":200,"stopy":244,"wzor":["plik",kol,rz,komorka_kol,komorka_rz],
       "zrodla":{"nazwa":["plik",kol,rz,(mnoznik skali)]}, "kolor":{"kontrast":1.1,"nasycenie":1.2,"jasnosc":1.05,"gamma":1.15} (opcja), "atlasy":{"klucz":[[ ["nazwa",rz,kl], ...4 ], ...6 ]}}
Klatka = [nazwa zrodla, rzad, kolumna] (od 0) albo null (pusta)."""
import sys, json, os
import numpy as np
from PIL import Image, ImageDraw
import scipy.ndimage as nd

CELL = 256

def wczytaj_klatki(plik, kol, rz):
    im = Image.open(plik).convert('RGBA')
    W, H = im.size
    cw, ch = W / kol, H / rz
    return [[im.crop((round(c * cw), round(r * ch), round((c + 1) * cw), round((r + 1) * ch))) for c in range(kol)] for r in range(rz)]

def czysc(im, prog=48):
    """Zostawia tylko postac: alfa < prog = tlo, odrzuca drobne plamy, wypelnia dziury."""
    a = np.asarray(im).astype(np.float32)
    m = a[..., 3] >= prog
    lab, k = nd.label(m)
    if k:
        sz = nd.sum(m, lab, range(1, k + 1))
        big = sz.max()
        H, W = m.shape
        brzeg = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
        # male kawalki dotykajace krawedzi komorki to resztki sasiednich klatek (np. czubek miecza)
        keep = np.isin(lab, [i + 1 for i, v in enumerate(sz) if v >= max(30, big * 0.003) and not (i + 1 in brzeg and v < big * 0.05)])
    else:
        keep = m
    keep = nd.binary_closing(keep, iterations=1) & (a[..., 3] > 8)
    al = np.where(keep, np.maximum(a[..., 3], 1), 0)
    out = np.dstack([a[..., :3], al]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')

def skaluj(im, s):
    """Skalowanie z premnozeniem (bez jasnych obwodek), potem twarda alfa 0/255."""
    if abs(s - 1) < 1e-6:
        r = np.asarray(im).astype(np.float32)
    else:
        a = np.asarray(im).astype(np.float32)
        al = a[..., 3:4] / 255
        p = np.concatenate([a[..., :3] * al, a[..., 3:4]], 2)
        w, h = max(1, round(im.width * s)), max(1, round(im.height * s))
        ch = [np.asarray(Image.fromarray(np.clip(p[..., i], 0, 255).astype(np.uint8)).resize((w, h), Image.LANCZOS)).astype(np.float32) for i in range(4)]
        r = np.dstack(ch)
        al2 = np.clip(r[..., 3:4], 1, 255) / 255
        r[..., :3] = np.clip(r[..., :3] / al2, 0, 255)
    hard = r[..., 3] >= 128
    r[..., 3] = np.where(hard, 255, 0)
    r[~hard, :3] = 0
    return Image.fromarray(r.astype(np.uint8), 'RGBA')

def koloruj(im, k):
    """Lekka korekta czytelnosci: kontrast wokol sredniej jasnosci, nasycenie, jasnosc (tylko piksele postaci)."""
    a = np.asarray(im).astype(np.float32)
    m = a[..., 3] > 0
    rgb = a[..., :3]
    lum = rgb @ np.array([.299, .587, .114], np.float32)
    mid = lum[m].mean() if m.any() else 128
    rgb = (rgb - mid) * k.get('kontrast', 1) + mid
    lum2 = (rgb @ np.array([.299, .587, .114], np.float32))[..., None]
    rgb = lum2 + (rgb - lum2) * k.get('nasycenie', 1)
    rgb = rgb * k.get('jasnosc', 1)
    if k.get('gamma', 1) != 1:  # >1 przyciemnia polcienie, swiatla zostaja
        rgb = 255 * np.power(np.clip(rgb, 0, 255) / 255, k['gamma'])
    a[..., :3] = np.where(m[..., None], np.clip(rgb, 0, 255), 0)
    return Image.fromarray(a.astype(np.uint8), 'RGBA')

def bbox(im):
    return Image.fromarray((np.asarray(im)[..., 3] > 0).astype(np.uint8) * 255).getbbox()

def stopy_x(im):
    a = np.asarray(im)[..., 3] > 0
    ys, xs = np.nonzero(a)
    if not len(ys):
        return im.width / 2
    dol = ys >= ys.max() - max(4, (ys.max() - ys.min()) * 0.12)
    return float(xs[dol].mean())

def main():
    plan = json.load(open(sys.argv[1], encoding='utf-8'))
    out = sys.argv[2]
    os.makedirs(out, exist_ok=True)
    base = os.path.dirname(os.path.abspath(sys.argv[1]))
    src = {n: wczytaj_klatki(os.path.join(base, v[0]), v[1], v[2]) for n, v in plan['zrodla'].items()}
    mult = {n: (v[3] if len(v) > 3 else 1.0) for n, v in plan['zrodla'].items()}
    cl = {}
    def klatka(n, r, c):
        k = (n, r, c)
        if k not in cl:
            cl[k] = czysc(src[n][r][c])
        return cl[k]
    wn, wr, wc = plan['wzor']
    b = bbox(klatka(wn, wr, wc))
    s = plan['wzrost'] / (b[3] - b[1])
    print('skala', round(s, 4), 'wzrost wzoru px', b[3] - b[1])
    feet = plan['stopy']
    raport = []
    for key, rows in plan['atlasy'].items():
        atlas = Image.new('RGBA', (CELL * 4, CELL * 6), (0, 0, 0, 0))
        for ri, row in enumerate(rows):
            if not row:
                continue
            # kotwica pozioma: stopy pierwszej klatki rzedu
            first = next((f for f in row if f), None)
            if not first:
                continue
            f0 = skaluj(klatka(*first), s * mult[first[0]])
            ax = stopy_x(f0) if plan.get('kotwica', 'stopy') == 'stopy' else f0.width / 2
            for ci, fr in enumerate(row):
                if not fr:
                    continue
                g = skaluj(klatka(*fr), s * mult[fr[0]])
                bb = bbox(g)
                if not bb:
                    continue
                ox = round(CELL / 2 - ax)
                # 15.11.2026: klatka szersza niz miejsce po stronie kotwicy (lezacy, przewrot) przesuwa sie do srodka zamiast obcinac
                if bb[2] - bb[0] <= CELL:
                    if ox + bb[0] < 0:
                        ox = -bb[0]
                    elif ox + bb[2] > CELL:
                        ox = CELL - bb[2]
                oy = round(feet - bb[3])
                cell = Image.new('RGBA', (CELL, CELL), (0, 0, 0, 0))
                cell.paste(g, (ox, oy), g)
                # obciecie poza komorka
                lost = int((np.asarray(g)[..., 3] > 0).sum() - (np.asarray(cell)[..., 3] > 0).sum())
                if lost > 40:
                    raport.append(f'{key} r{ri} k{ci}: obciete {lost} px')
                atlas.paste(cell, (ci * CELL, ri * CELL), cell)
        if plan.get('kolor'):
            atlas = koloruj(atlas, plan['kolor'])
        atlas.save(os.path.join(out, key + '.png'))
        # arkusz kontrolny na ciemnym tle z linia stop
        k = Image.new('RGBA', atlas.size, (38, 34, 32, 255))
        k.alpha_composite(atlas)
        d = ImageDraw.Draw(k)
        for r in range(6):
            d.line([(0, r * CELL + feet), (CELL * 4, r * CELL + feet)], fill=(90, 160, 90, 255))
            d.text((4, r * CELL + 4), f'{key} r{r}', fill=(255, 220, 0, 255))
        k.save(os.path.join(out, 'kontrola_' + key + '.png'))
    print('\n'.join(raport) if raport else 'bez obciec')

if __name__ == '__main__':
    main()
