# NightBrand PC i konsole: linia rozwojowa

Start: 10.11.2026, kopia wersji 562 (cache `nightbrand-codex-20261110-562`). Repozytorium prywatne.
Docelowo gra z tej linii trafi na itch.io (decyzja autora). Forma (przeglądarka czy aplikacja) nie jest jeszcze ustalona.

## Jak to się ma do reszty
- Gra online https://y33bau.github.io/nightbrand/ zostaje WERSJĄ MOBILNĄ. Jej repozytoria (`y33bau/nightbrand`, `y33bau/nightbrand-backup`) nie są tu rozwijane.
- To repo nie ma GitHub Pages i nie ma testów automatycznych (wyłączone na prośbę autora). Testy robi się ręcznie (patrz niżej).

## Zawartość
- `zrodlo/main/`: źródło gry (27 części JS). To tu się edytuje.
- `narzedzia/`: zbuduj.py, wydaj.py, sprawdz.py, dymny.js, testy; `narzedzia/windows/` pliki .bat dla Windowsa. Część skryptów pomocniczych ma wpisane ścieżki z Linuxa (`/home/claude/...`): dostosuj je przed użyciem.
- `gra/`: zbudowana gra (index.html, assets/, sw.js, WERSJA.txt). Nie edytować ręcznie.
- `teksty/`: wyciągi tekstów PL/EN, kanon fabuły i nazw (`KANON_FABULY_I_NAZWY_2026-11-10.md`).
- `PC_I_KONSOLE.md`, `UI_*.md`: opisy tej linii i prac nad interfejsem.

## Jak się pracuje
1. Nowa gałąź od `main` na każdą rundę.
2. Zmiany tylko w `zrodlo/main/*.js` (i index.html), nigdy w zbudowanym pliku gry.
3. `python3 narzedzia/zbuduj.py zrodlo/main gra`
4. `python3 narzedzia/wydaj.py wersja gra "opis (czego nie sprawdzono)"` (podbija cache i WERSJA.txt, uruchamia sprawdz.py: ma być WYNIK OK).
5. Test: `node narzedzia/dymny.js gra 1,2,3,4,5` (rozdziały po kolei, ok. 1-2 min każdy).
6. Merge do `main` tylko na wyraźne „publikuj” autora.

## Test na komputerze autora
Plik `Test wersja PC.bat` w folderze `Desktop\NIGHTBRAND` pobiera wskazaną gałąź (Enter = main) i otwiera grę na http://localhost:8766/. Wymaga programu git i zalogowania do GitHuba.

## Zasady (bez zmian)
Bez zmian balansu i mechaniki bez zgody autora (leczenie przy awansie 10%, „Bez litości”, brak Hordy). Budżet gry 150 MB. Nazwy angielskie zgodne ze słownikiem w projekcie Claude. Szczegóły: projekt Claude „NightBrand”, blok „AKTUALNY STAN I ZASADY” w `PROJEKT KONTEKST`.
