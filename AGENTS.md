# Zasady dla agentów (Claude, Codex)
Stan na 2026-11-16. Te zasady są ważniejsze niż starsze dokumenty w projekcie „Nightbrand - workspace” i niż pliki PC_*.md / UI_*.md w tym repo (to historia rund).

## Fakty
1. Gra jest na KOMPUTER (Windows; klawiatura, mysz, pad). To nie jest gra mobilna: nie pisz o telefonie, nie optymalizuj pod niego. Wszystkie opcje dotykowe mają zostać usunięte (decyzja autora 16.11.2026); do czasu usunięcia nie rozwijaj kodu dotyku.
2. Repo robocze: y33bau/NightBrand-PC. y33bau/nightbrand-backup to kopia zapasowa wersji PC; y33bau/nightbrand (GitHub Pages, wersja 562) nie jest rozwijane.
3. Publikacja: itch.io (zip HTML5, najwyżej 1000 plików) i przygotowywana wersja Windows w Electronie (plan niezapisany). Xbox jest tylko brany pod uwagę: nie projektuj pod konsole bez zgody autora. Wgrywa autor.
4. Limit rozmiaru folderu gry (gra/): 500 MB (roboczy limit autora, 16.11.2026; sprawdz.py: błąd powyżej 500, ostrzeżenie od 450). Nie ściskaj zasobów na siłę; pamięć RAM po zdekodowaniu obrazów mierz osobno.
5. 5 bohaterów (Rycerz/Hadræn, Kat, Zabójczyni, Dzwonnik, Woskownica), 6 rozdziałów (I–VI).
6. Wersja = cache w gra/sw.js + commit. Nie wymyślaj numerów; stan sprawdzaj (git log -3, sw.js).

## Zasady pracy
7. Edytuj tylko zrodlo/main/*.js i index.html, nigdy zbudowanych plików ani assets/. Build: narzedzia/zbuduj.py, wydaj.py, sprawdz.py (WYNIK OK).
8. Każda runda na nowej gałęzi od main. Merge do main (--ff-only) i push tylko na wyraźne „publikuj” / „wrzucaj” autora.
9. Balans (leczenie przy awansie 10%, „Bez litości”, sloty, kooperacja 4+4) bez zgody autora bez zmian. Niezamówionych rzeczy nie dotykaj: usterkę zgłoś.
10. Nie obiecuj działania na padzie, w dźwięku ani na itch.io bez sprawdzenia; w meldunku wypisz, czego NIE sprawdzono.
11. Autor jest w IT początkujący i dyktuje po polsku: odpowiadaj po polsku, krótko, wynik najpierw; nie każ mu uruchamiać gita ani pisać .bat (testy jako TEST_*.bat).
12. Pozostałe zasady i bieżący stan: instrukcje projektu oraz claude/DO_ZROBIENIA.md w projekcie „Nightbrand - workspace”.

## Narzędzia autora tylko lokalnie (decyzja autora 14.11.2026)
- Edytor menu, edytory map, tryby testowe, kody deweloperskie i każde podobne narzędzie mają działać WYŁĄCZNIE na komputerze autora: adres 127.0.0.1 / localhost / [::1] albo plik (file:), i dodatkowo dopiero po parametrze w adresie (np. `?edytor=1`).
- W wersji dla graczy (itch.io, każdy inny adres) takie narzędzia muszą być zablokowane, także po ręcznym dopisaniu parametru.
- Wzór warunku: stała `LOKALNIE` w `zrodlo/main/27_menu_usprawnienia.js`. Każde nowe narzędzie autora używa tego samego warunku.
