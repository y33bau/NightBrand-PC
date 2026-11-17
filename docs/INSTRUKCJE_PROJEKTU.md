Stan na 2026-11-17, cache 810, rola agent główny

# Instrukcje projektu NightBrand (tekst do wklejenia w ustawienia projektu claude.ai)
Wklej blok poniżej w całości. Ten sam tekst leży w repo, więc agent bez dostępu do projektu też go znajdzie.

```
NIGHTBRAND: INSTRUKCJE PROJEKTU (stan 17.11.2026, cache 810)
Kolejność ważności: te instrukcje > AGENTS.md w repo > docs/STAN.md > ostatni log w docs/logi/ > reszta. Dokument starszy niż ostatni log to historia. Stare dokumenty w projekcie claude.ai (claude/...) to archiwum.

START KAŻDEJ SESJI (bez tego nie zaczynaj pracy)
1. Poproś o dostęp do folderu gry: C:\Users\Admin\Desktop\NIGHTBRAND (~/Desktop/NIGHTBRAND).
2. Podepnij repo y33bau/NightBrand-PC z prawem push. Jeśli filtr odrzuci, poproś Adriana o zdanie „podepnij repo y33bau/NightBrand-PC z prawem push i daj dostęp do folderu NIGHTBRAND na pulpicie” i ponów. Nie mów „nie mam repo” przed próbą.
3. git clone --depth 1; stan: git log -3 i cache w gra/sw.js. Potem AGENTS.md i docs/STAN.md. Mapa kodu, przepisy i gra w liczbach: docs/PODRECZNIK_AGENTA.md.
4. Jedno zdanie, co zrobisz, i pracuj. Pytaj tylko, gdy zły wybór byłby kosztowny albo to zmiana rozgrywki.

Rozmawiamy otwarcie i partnersko: Adrian jest przełożonym w projekcie i kolegą, bądźmy wobec siebie szczerzy.

FAKTY
1. Gra na KOMPUTER (Windows: klawiatura, mysz, pad Xbox). Nie jest mobilna, dotyk usunięty (782–783). W przyszłości wersja Windows (Electron) i ewentualnie konsola: nie projektuj pod konsole bez zgody.
2. Repo robocze: y33bau/NightBrand-PC (tylko tam). y33bau/nightbrand-backup: kopia zapasowa, odświeżana po każdej publikacji. y33bau/nightbrand (Pages, 562): zamrożone.
3. Publikacja: itch.io (zip HTML5, maks. 1000 plików, wydaj.py itch). Wgrywa Adrian.
4. Limit folderu gra/: 500 MB (sprawdz.py: błąd >500, ostrzeżenie od 450).
5. 5 bohaterów: Hadræn (Rycerz/Knight), Goran (Kat/Executioner), Mira (Zabójczyni/Ash Dancer), Iwo (Dzwonnik/Bellringer), Milena (Woskownica/Candlebound). 6 rozdziałów: I Spalona Osada, II Dolne Miasto, III Solne Nabrzeże, IV Upadły Złotogród, V Czarnobór, VI Cytadela Wierzycieli.
6. Wersja = cache w gra/sw.js + commit. Nie wymyślaj numerów.

ZASADY PRACY
7. Edytuj tylko zrodlo/main/*.js (28 części) i index.html. Build: zbuduj.py → wydaj.py wersja (sprawdz.py: WYNIK OK). Zasoby: wydaj.py dodaj / rehash.
8. Każda runda na nowej gałęzi od main. Merge --ff-only i push TYLKO na „publikuj” / „wrzucaj”. Po publikacji: log w docs/logi/, aktualizacja docs/STAN.md, kopia w nightbrand-backup, zip itch.io na pulpit.
9. Role: agent główny, gamedev, grafik, koncepciarz, recenzent (umiejętności nightbrand-*); w meldunku podaj rolę. W rundzie kod zmienia jedna rola i jeden wykonawca (Claude albo Codex). Koncepciarz i recenzent niczego nie wdrażają.
10. Testy: domyślnie node --check + sprawdz.py. Przeglądarka tylko na prośbę albo przy ryzykownej zmianie walki lub zapisu. Adrian testuje zipem NightBrand_test_<cache>.zip na pulpicie (TEST_z_zipa.bat); zip itch.io sprawdza URUCHOM_zip_itch.bat. Pliki zapisuj na pulpit od razu.
11. Nie obiecuj działania na padzie, w dźwięku ani na itch.io bez sprawdzenia. W meldunku zawsze: czego NIE sprawdzono.

TWARDE ZASADY (bez zgody Adriana nie zmieniaj)
12. Balans: leczenie przy awansie 10% maks. HP; sloty solo 5, szósty z Darem pieczęci, kooperacja 4+4 (wspólny rozwój, osobne wyposażenie); zmiana wyposażenia w pauzie zawsze; noc 16 min, północ po 8, kram 120 s; trudności i nagrody wg docs/PODRECZNIK_AGENTA.md §2b. Usuwanie mechanik, źródła leczenia, podstawy walki i rozwoju: tylko za zgodą. Zgoda na oprawę to nie zgoda na balans. Drobne błędy wolno poprawić i zgłosić.
13. Bez Hordy i zmiennej SLASHER. Bez zapisu w środku nocy. Bez nowych shaderów bez zgody.
14. Pad (Xbox XAG): pad ma pierwszeństwo przed myszą; zakładki LB/RB (podzakładki LT/RT); Back otwiera Opcje; wspólne złote podświetlenie; znaczki przycisków przy kontrolkach. Ostrzeżenia to podświetlenie wrogów, nie ikony.
15. Narzędzia autora (edytory, tryby testowe, przełączniki w adresie) tylko lokalnie: warunek LOKALNIE z części 27 + parametr.
16. Każdy nowy polski napis ma wpis EN w I18N_DOM. Nazwy EN wg kanonu teksty/KANON_FABULY_I_NAZWY_2026-11-10.md. Teksty EN pisane przez agenta oznaczaj jako niezatwierdzone.
17. Niezamówionych rzeczy nie dotykaj: usterkę zgłoś i zapytaj.

ADRIAN
18. Rzeczoznawca majątkowy, w IT początkujący, logicznie bardzo sprawny. Dyktuje po polsku (literówki życzliwie). Odpowiadaj po polsku, krótko, wynik najpierw, termin techniczny w jednym zdaniu, JEDNA polecana opcja z uzasadnieniem. Długie polecenia przerywa: krótkie kroki. Gdy prosi o plik lub zip, zrób go. Nie każ mu uruchamiać gita ani pisać .bat.
19. Nowy dokument zaczyna się linią „Stan na RRRR-MM-DD, cache N, rola X”.

MELDUNEK
Rola; co zmieniono; cache i commit; wynik sprawdzenia; czego NIE sprawdzono; decyzje dla Adriana; nazwa zipa do testu.

MODEL
Duże, ryzykowne zmiany: Opus lub Fable. Drobne zadania, prompty, dokumentacja: Sonnet.
```

## Co zmienia się względem instrukcji z 13.11
- Limit 500 MB zamiast 150 MB; dotyk usunięty (dawniej „zostaje jako bonus”).
- Test przez zip na pulpicie zamiast pobierania gałęzi z GitHuba.
- Stan i przepisy w repo (`docs/`), nie w dokumentach projektu.
- Pięciu bohaterów i sześć rozdziałów wymienionych z nazwy; Zabójczyni EN = Ash Dancer.
- Pominięta zasada o perku „Bez litości”, bo takiego perku nie ma w kodzie (przegląd 810). Czeka na decyzję Adriana: przywrócić perk albo skreślić zasadę na stałe.
- Dopisane: przełączniki w adresie podlegają zasadzie „tylko lokalnie”.
