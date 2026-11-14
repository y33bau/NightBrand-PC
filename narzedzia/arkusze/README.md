# Fabryka arkuszy bohaterów (nowy styl, 15.11.2026)

`fabryka.py PLAN.json KATALOG_WYJŚCIA` składa arkusze z ChatGPT w atlasy gry (1024×1536, 4×6 klatek po 256 px, gęstość 4):
czyści przezroczystość (szum alfa z ChatGPT powodował szarą aurę w grze), skaluje postać do wzrostu klasy (`wzrost` = wysokość klatki `wzor` w px),
stawia stopy na linii `stopy` (244), kotwiczy rząd wg stóp pierwszej klatki, daje twardą alfę 0/255 i arkusz kontrolny `kontrola_*.png`.
Opcja `kolor` (kontrast, nasycenie, jasność) poprawia czytelność postaci (użyta dla Zabójczyni).

Plany w `plany/` (pliki źródłowe leżą obok planu, nazwy jak w paczkach autora):
- `rycerz.json`: 12 arkuszy MASTER + `wypad.png` → `knight_d/db/dc/dd/def/death/whirl/lunge`. Wzrost 200 px.
- `zabojczyni.json`: atlasy z paczki „Komplet 14” + `heavy_v2.png` (ciężki atak dół/góra) → `zab_*`. Wzrost 192 px (z kucykiem).

Podmiana w grze: `narzedzia/podmien_obrazy.py` (stare pliki → nowe, poprawia manifest, sw.js i SPRITE_DATA). Nowy klucz: `wydaj.py dodaj` + wpis w `00_grupy_sprite.js`.
W `procFrame` klucze `knight_`/`zab_` (nowy styl) nie dostają rozjaśnionej krawędzi w teksturze i mają cieńszy kontur (0,75 px logicznego).
