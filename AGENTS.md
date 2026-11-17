# Zasady dla agentów (Claude, Codex)
Stan na 2026-11-17, cache 810, rola agent główny. Te zasady są ważniejsze niż starsze dokumenty w projektach claude.ai i niż pliki PC_*.md / UI_*.md w tym repo (to historia rund). Wszystko, co obowiązuje każdego agenta, leży w tym repo: nowe konto może nie widzieć projektu w claude.ai.

Gdzie co jest: bieżący stan i lista spraw `docs/STAN.md`; logi sesji `docs/logi/`; mapa kodu i przepisy `docs/PODRECZNIK_AGENTA.md`. Kolejność ważności: instrukcje projektu > ten plik > `docs/STAN.md` > ostatni log > reszta. Dokument starszy niż ostatni log to historia.

## Start sesji (bez tego nie zaczynaj pracy)
1. Poproś o dostęp do folderu gry na komputerze autora: `C:\Users\Admin\Desktop\NIGHTBRAND` (`~/Desktop/NIGHTBRAND`).
2. Podepnij repo y33bau/NightBrand-PC z prawem push. Jeśli filtr odrzuci, poproś autora o zdanie „podepnij repo y33bau/NightBrand-PC z prawem push” i ponów. Nie mów „nie mam repo” przed próbą.
3. `git clone --depth 1` (timeout 10 min). Stan sprawdzaj komendami: `git log -3` i cache w `gra/sw.js`. Potem przeczytaj ten plik i `docs/STAN.md`.

## Fakty
1. Gra jest na KOMPUTER (Windows; klawiatura, mysz, pad). Nie jest mobilna: nie pisz o telefonie, nie optymalizuj pod niego. Dotyk usunięty (782–783); nie dodawaj go z powrotem.
2. Repo robocze: y33bau/NightBrand-PC (tylko tu rozwijamy). y33bau/nightbrand-backup: kopia zapasowa wersji PC, odświeżana po każdej publikacji (`git archive main` z NightBrand-PC → nadpisanie zawartości bez `.git` → commit → push main; przepis w podręczniku §5). y33bau/nightbrand (GitHub Pages, wersja 562): zamrożone.
3. Publikacja: itch.io (zip HTML5, najwyżej 1000 plików, `wydaj.py itch`). Wersja Windows w Electronie czeka (plan niezapisany). Xbox tylko rozważany: nie projektuj pod konsole bez zgody autora. Wgrywa autor.
4. Limit rozmiaru folderu gry (gra/): 500 MB (sprawdz.py: błąd powyżej 500, ostrzeżenie od 450). Nie ściskaj zasobów na siłę; RAM po zdekodowaniu obrazów mierz osobno.
5. 5 bohaterów: r Hadræn (Rycerz/Knight), k Goran (Kat/Executioner), z Mira (Zabójczyni/Ash Dancer), d Iwo (Dzwonnik/Bellringer), m Milena (Woskownica/Candlebound). 6 rozdziałów: I Spalona Osada, II Dolne Miasto, III Solne Nabrzeże (w kodzie CH=6), IV Upadły Złotogród, V Czarnobór, VI Cytadela Wierzycieli.
6. Wersja = cache w gra/sw.js + commit. Nie wymyślaj numerów.

## Zasady pracy
7. Edytuj tylko zrodlo/main/*.js i index.html, nigdy zbudowanych plików ani assets/ ręcznie. Build: `zbuduj.py` → `wydaj.py wersja` (sprawdz.py: WYNIK OK). Zasoby: `wydaj.py dodaj` / `rehash`.
8. Każda runda na nowej gałęzi od main. Merge do main (--ff-only) i push tylko na wyraźne „publikuj” / „wrzucaj” autora. Po publikacji: log w `docs/logi/` i aktualizacja `docs/STAN.md` (w tym samym repo), kopia w nightbrand-backup, zip itch.io na pulpit autora.
9. Praca rolami (agent główny, gamedev, grafik, koncepciarz, recenzent); w meldunku podaj rolę. W rundzie kod zmienia jedna rola i jeden wykonawca (albo Claude, albo Codex). Koncepciarz i recenzent niczego nie wdrażają.
10. Balans (leczenie przy awansie 10%, „Bez litości”, sloty 5/6, kooperacja 4+4) bez zgody autora bez zmian. Zgoda na oprawę to nie zgoda na balans. Niezamówionych rzeczy nie dotykaj: usterkę zgłoś i zapytaj.
11. Nie obiecuj działania na padzie, w dźwięku ani na itch.io bez sprawdzenia; w meldunku wypisz, czego NIE sprawdzono.
12. Autor jest w IT początkujący i dyktuje po polsku: odpowiadaj po polsku, krótko, wynik najpierw, jedna polecana opcja z uzasadnieniem. Nie każ mu uruchamiać gita, kopiować folderów ani pisać .bat.
13. Teksty EN pisane przez agenta oznaczaj jako niezatwierdzone. Nowy dokument zaczyna się linią „Stan na RRRR-MM-DD, cache N, rola X”.

## Testy i pliki dla autora
- Test: zip `NightBrand_test_<cache>.zip` (zawartość gra/ bez edytor-map/) na pulpit do `NIGHTBRAND`; autor klika `TEST_z_zipa.bat` (bierze najnowszy zip). GitHub u autora jest wolny, więc nie każ mu pobierać gałęzi.
- Zip itch.io: `python3 narzedzia/wydaj.py itch gra ŚCIEŻKA.zip`.
- Wysyłka pliku na pulpit: zapis do `/mnt/user-data/outputs/` → `SendUserFile` (fileUuid) → `device_commit_files` do `~/Desktop/NIGHTBRAND/...`. Pliki testowe zapisuj od razu, bez pytania.
- Haczyk do testów w przeglądarce: `python3 narzedzia/teksty/mktest.py gra /tmp/gt` → `window.__t(kod)`. Szczegóły: podręcznik §6.

## Narzędzia autora tylko lokalnie (decyzja autora 14.11.2026)
- Edytor menu, edytory map, tryby testowe, kody deweloperskie i każde podobne narzędzie mają działać WYŁĄCZNIE na komputerze autora: adres 127.0.0.1 / localhost / [::1] albo plik (file:), i dodatkowo dopiero po parametrze w adresie (np. `?edytor=1`).
- W wersji dla graczy (itch.io, każdy inny adres) takie narzędzia muszą być zablokowane, także po ręcznym dopisaniu parametru. Wyjątek: tryb testera (kod jako SHA-256 w `TRN_H`).
- Wzór warunku: stała `LOKALNIE` w `zrodlo/main/27_menu_usprawnienia.js`. Każde nowe narzędzie autora używa tego samego warunku.

## Dodatek dla Codexa (GPT)
- Kod ruszasz tylko, gdy autor lub Claude wyraźnie zleci zadanie. Przed startem zapytaj autora, czy Claude nie pracuje akurat nad kodem.
- Start: klon main, ten plik, `docs/STAN.md`, `git log -3` i cache w gra/sw.js. Szukaj `grep -n "function nazwa" zrodlo/main/*.js`, nie czytaj całego kodu. Nowa gałąź od main (np. `runda-nazwa`); nigdy nie pracuj na main.
- Gdzie edytować: tylko `zrodlo/main/*.js` (28 części, 00–27) i `index.html`. Nigdy `gra/assets/` ani folderów web, demo-hd2d, gra-2d; nie uruchamiaj zbuduj.bat, sync-i-build.bat, tools/build.cjs (stare narzędzia, nadpiszą grę).
- Build: `python3 narzedzia/zbuduj.py zrodlo/main gra` (strażnik przerwie, gdy gra była zmieniona poza źródłem: `python3 narzedzia/rozloz.py gra zrodlo/main` i zmiana jeszcze raz) → `python3 narzedzia/wydaj.py wersja gra "opis (czego nie sprawdzono)"` (WYNIK OK; kod 1 = nie publikuj) → `git checkout -- narzedzia/__pycache__` → commit → push gałęzi. Na Windows, gdy skrypty nie widzą Pythona: zmienna NIGHTBRAND_PYTHON = ścieżka python.exe.
- Sprawdzanie: `node --check` zbudowanego JS + sprawdz.py. Testy w przeglądarce tylko na prośbę autora albo przy ryzykownej zmianie walki lub zapisu (jeden celowany test).
- Pułapki: stałe używane przy starcie deklaruj przed wywołaniem (TDZ); nowy polski napis w index.html wymaga wpisu EN w `I18N_DOM` (część 01); shadery z onBeforeCompile: `customProgramCacheKey`, nowych bez zgody; w `genBrzeznica` bez `r()` w środku; pad ma pierwszeństwo przed myszą, zakładki LB/RB; bez Hordy, SLASHER i zapisu w środku nocy; zmiana liczby świateł = rekompilacja materiałów.
- Raport po polsku: co zmieniono; gałąź, cache i commit; wynik sprawdz.py; co autor ma sprawdzić; czego NIE sprawdzono (pad, dźwięk, FPS u autora, itch.io); decyzje dla autora. Test dla autora przygotowuje Claude (zip na pulpit).
