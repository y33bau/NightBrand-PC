Stan na 2026-11-22, cache 848 (gałąź), rola agent główny

# NightBrand: bieżący stan i lista spraw
Aktualizuj ten plik po każdej publikacji (w tym samym commicie co log w `docs/logi/`). Stan zawsze potwierdź komendami: `git log -3`, cache w `gra/sw.js`.

## Stan
| Co | Wartość |
|---|---|
| main | cache 844, opublikowane 21.11.2026 (log `docs/logi/LOG_SESJI_2026-11-21.md`) |
| Gałęzie czekające na „publikuj” | `runda-porzadki-przeglad` (848): zawiera 845–847 z `runda-kociolek-3d` (kociołek 3D bez ognia, światła ×0.7) + porządki po przeglądzie 22.11 |
| Kopia zapasowa | y33bau/nightbrand-backup = kopia 844 |
| Zip itch.io | `NightBrand_itch_844.zip` na pulpicie autora w `NIGHTBRAND` |
| Rozmiar gra/ | ok. 199 MB (limit 500 MB); zip itch.io ok. 817 plików / 1000 (każdy model = 2–3 pliki) |

## Decyzje autora (najnowsze)
- 21.11: drzewa robimy TYLKO z naszych malunków (Meshy obraz → 3D); modele z galerii i z opisu tekstowego „jak z innej bajki”. Wszystkie drzewa (Czarnobór, Spalona Osada, Złotogród) to modele z malunków (`P3D_LAS`, `P3D_DRZ1` w części 06), tekstury 2048. Następnie: drzewa w wysokiej jakości (`z_malunkow_hq`), potem kociołki i port tą samą metodą (paczka obrazków dla Code).
- 21.11: „Porzuć noc” w pauzie jako przycisk w ramce jak „Wróć do gry” (przygaszony).
- 20.11: rekwizyty jako modele 3D. Główna droga: Meshy (Image to 3D z malunków; autor ma Pro, generuje Claude Code na jego komputerze do `~/Desktop/NIGHTBRAND/modele_meshy`), odchudzanie `docs/modele/meshy_odchudz.py`, kod `P3D_MESHY`/`P3D_MMAP` w części 06. Priorytet: obiekty, potem NPC; rycerz w 3D dopiero po próbie z NPC. Modele składane w Blenderze z rzutem malunku (`P3D_GLB`) zostają tylko dla rekwizytów bez modelu z Meshy. Autor: „prawdziwy skok jakości”.
- 19.11: kamera przestrzenna domyślna, 45° i trochę dalej; efekty oprawy wyraźne ("AAA"), latarnie słabsze; bez świecącego ostrza; żuraw i worki z solą jako obrazki; rozdz. I Normalny/Trudny start 80% wrogów.
- 18.11: port w bryle (bez żurawia: zostaje obrazkiem); kamera klasyczna/przestrzenna w Opcjach; nowe shadery dozwolone dla oprawy 3D (promienie światła, cienie od ognisk); oddalenie kamery przy bossie i naporze zostaje.
- 18.11: autor testuje też na Macu (`Uruchom_test_kamery.command` w `~/Desktop/NIGHTBRAND`).
- 17.11: banery bez złotej ramki: deski w Ognisku/Przygotowaniu bez ramki z mocniejszym żarem; lokalizacje na mapie z ramką przy fokusie i mocniejszym podświetleniem; deski na dole mapy bez zmian; karty perków i wiersze list zostają ze złotą ramką.
- 17.11: klasa Miry = **Tancerka Popiołu / Ash Dancer** (PL w 811, EN w 810); dawniej Zabójczyni (wdrożone w 810: `HEROES` w 22 i opisy technik w 12). Gałąź stylu „Zabójca/Assassin” i wyzwanie „Assassin's Strike” zostają.
- 17.11: kopia nightbrand-backup odświeżana po każdej publikacji; limit 500/450 wszędzie; test przez zip + `TEST_z_zipa.bat`; dokumenty bieżące w repo (`docs/`).
- 16.11: gra na PC, dotyk usunięty (782–783), limit 500 MB, praca rolami.
- 14.11: narzędzia autora tylko lokalnie (`LOKALNIE`).

## Do testu u autora (nic nie było sprawdzone na żywo)
- 836–844 (druga partia 36 modeli, port z modelami z rozdz. I, drzewa 3D z malunków, pauza): autor obejrzał 21.11 („jest ok”). Nie sprawdzono: FPS w Czarnoborze z cieniami drzew, drzewa w Złotogrodzie, święty dąb i drzewo wisielca z bliska, pad w pauzie, itch.io.
- 828–835 (modele 3D rekwizytów, 32 z Meshy): FPS sprawdzony przez autora 20.11 („prawie bez zmian”). Do sprawdzenia: rozmiary modeli, tył modeli, łańcuchy/wózek/proch/posągi Cytadeli (nieobejrzane na zrzutach), itch.io.
- 817–827: autor sprawdził 20.11.2026 („sprawdzono wszystko, działa”).
- 815–816 (port w bryle, kamera przestrzenna, promienie, cienie od ognisk, oddalenie w walce): FPS na obu kamerach, walka z bossem (oddalenie), pad w Opcjach przy wierszu Kamera, napisy EN kamery.
- 813–814 (fokus i podświetlenia): Kaplica i Kronika strzałkami i padem (opis po prawej idzie za zaznaczeniem), brak zostających podświetleń po kliknięciu myszą, lokalizacje na mapie, deski w Ognisku i Przygotowaniu, odłączenie pada w menu.
- 811 (kociołki 12/10/8%, sloty 5–6 na listach klawiszy, przełączniki tylko lokalnie, lżejsze style menu): leczenie przy kociołku na trzech trudnościach, lista „Własne klawisze” (przewinąć do dołu), lista pada w Opcjach.
- 810 (Ash Dancer): angielski napis klasy Miry w menu i Instrukcji (czy się mieści).
- 809 (logo i piętno): pieczęć w Krypcie prestiżu, ekran wyboru języka, ikona.
- 808 (Instrukcja): pad, EN.
- 807 (ekran powitalny): EN do zatwierdzenia.
- 806 (Ognisko i Mapa): prawdziwy pad.
- 788–789 (wybory NPC): żaden quest nie był sprawdzony w grze.
- 787 (pilot animacji `heroMotion` w 17_render.js): „za mocno / za słabo”.
- 784, 799 (muzyka): zapętlenie bez trzasku.
- Ogólnie: pad na nowych ekranach, kooperacja, menu po angielsku, itch.io na żywo.

## Zgłoszone autorowi, czekają na decyzję
- Przegląd 810 (`docs/przeglady/PRZEGLAD_810_2026-11-17.md`): otwarte zostały tylko „trzy warstwy menu” (WAŻNE 1, osobna runda porządkowa) i nazwa gałęzi stylu „Zabójca” obok klasy Miry (DROBNE 13). Reszta naprawiona do 848 (przegląd `docs/przeglady/PRZEGLAD_848_2026-11-22.md`).
- Światła ×0.7 (847) działają na lampy i ogniska, nie na księżyc i światło ogólne sceny: czy przyciemnić też je.
- Schematy sterowania (obrazki PL/EN, klawiatura i pad): od 848 pod obrazkiem jest dopisek o slotach 5 i 6; docelowo nowe obrazki od autora.
- Rozmowy NPC: kłamstwo Izoldy (40 monet) płaci więcej niż prawda (30 + pół paska); siła upiorów Skryby i Ottokara; wypłata warty 70 monet.
- Przygotowanie: czy przywrócić łączny mnożnik Popiołów w „Tej nocy”.
- `docs/PLAN_ELECTRON_WINDOWS.md` nie istnieje: napisać plan albo czekać (autor: „jeszcze poczekamy”).

## Do wdrożenia (za zgodą autora)
- Grafiki NPC i bossów Złotogrodu: czekamy na obrazy od autora.
- „Rozgrzewka” na ekranie wczytywania (kompilacja shaderów i wgranie obrazów przed startem) + pomiar FPS.
- Animacje, krok 2: smuga przy uniku, wypadzie i wirze.
- Muzyka walki krypty i bossa (`crypt` nadal stary).
- Podsumowanie obrażeń po nocy (propozycja koncepciarza, polecana).
- Warianty fabularne (Chojrak i Wiesława w porcie), karta Ambrożego, efekty w nowym stylu, strojenie Wypadu.

## Porządki
- Zrobione w 812: `wydaj.py usun` (+6 nieużywanych obrazów usuniętych), `__pycache__` poza repo, historia rund w `docs/historia/`, teksty Grafiki bez podmiany w locie, `sprawdz.py` bez fałszywych uwag o module startowym.
- Gałęzie: 100 scalonych do usunięcia czeka na zgodę (`docs/GALEZIE_DO_USUNIECIA.md`); 35 niescalonych do decyzji.
- Obrazy schematów sterowania (PL/EN, klawiatura i pad) pokazują 4 sloty: od 848 dopisek pod obrazkiem; docelowo nowa grafika z 5. i 6. slotem.
- Port: dodana mgiełka w powietrzu; dekoracje ogólne (`DECOR`, `NP_CFG`) celowo nie dodane (trupy, siano, trawa nie pasują do nabrzeża) – do decyzji grafika.
- Puste `catch{}`: w menu (część 27) błędy logiki trafiają teraz do raportu błędów; reszta (zapis ustawień, dźwięk, schowek) celowo cicha.
- Testy UI niepasujące do nowego menu (`test-przygotowanie-ui.cjs` i podobne): dostosować albo oznaczyć jako przestarzałe.
- Kanon `teksty/KANON_FABULY_I_NAZWY_2026-11-10.md`: od 22.11 ma sekcję z imionami bohaterów i rozdziałami; numeracja fabuły nadal sprzed Portu.
- Prompty graficzne z projektu claude.ai (`claude/PROMPTY_*`) → `docs/prompty/`.
- Na pulpicie autora stare `TEST_*.bat` i zipy 762–809 (za zgodą).
