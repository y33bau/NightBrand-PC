Stan na 2026-11-17, cache 812, rola agent główny

# NightBrand: bieżący stan i lista spraw
Aktualizuj ten plik po każdej publikacji (w tym samym commicie co log w `docs/logi/`). Stan zawsze potwierdź komendami: `git log -3`, cache w `gra/sw.js`.

## Stan
| Co | Wartość |
|---|---|
| main | cache 810 (`3cf2040`); gałąź `runda-811-poprawki-przegladu` = 811 + 812 czeka na „publikuj” |
| Gałęzie czekające na „publikuj” | brak |
| Kopia zapasowa | y33bau/nightbrand-backup = kopia 810 (odświeżona po publikacji) |
| Zip itch.io | `NightBrand_itch_810.zip` na pulpicie autora w `NIGHTBRAND` |
| Rozmiar gra/ | ok. 148–152 MB (limit 500 MB) |

## Decyzje autora (najnowsze)
- 17.11: klasa Miry = **Tancerka Popiołu / Ash Dancer** (PL w 811, EN w 810); dawniej Zabójczyni (wdrożone w 810: `HEROES` w 22 i opisy technik w 12). Gałąź stylu „Zabójca/Assassin” i wyzwanie „Assassin's Strike” zostają.
- 17.11: kopia nightbrand-backup odświeżana po każdej publikacji; limit 500/450 wszędzie; test przez zip + `TEST_z_zipa.bat`; dokumenty bieżące w repo (`docs/`).
- 16.11: gra na PC, dotyk usunięty (782–783), limit 500 MB, praca rolami.
- 14.11: narzędzia autora tylko lokalnie (`LOKALNIE`).

## Do testu u autora (nic nie było sprawdzone na żywo)
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
- Przegląd 810 (`docs/przeglady/PRZEGLAD_810_2026-11-17.md`): 5 uwag WAŻNYCH (warstwy menu, przełączniki w adresie bez `LOKALNIE`, zasada o nieistniejącym perku „Bez litości”, sloty 5 i 6 niewidoczne w Opcjach, tempo leczenia kociołków na Łatwym) i 9 drobnych.
- Kaplica: po kliknięciu wiersza myszą fokus nie przechodzi na kliknięty wiersz.
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
- Obrazy schematów sterowania (PL/EN, klawiatura i pad) pokazują 4 sloty: potrzebna nowa grafika z 5. i 6. slotem (listy tekstowe już mają 1–6).
- Port: dodana mgiełka w powietrzu; dekoracje ogólne (`DECOR`, `NP_CFG`) celowo nie dodane (trupy, siano, trawa nie pasują do nabrzeża) – do decyzji grafika.
- Puste `catch{}`: w menu (część 27) błędy logiki trafiają teraz do raportu błędów; reszta (zapis ustawień, dźwięk, schowek) celowo cicha.
- Testy UI niepasujące do nowego menu (`test-przygotowanie-ui.cjs` i podobne): dostosować albo oznaczyć jako przestarzałe.
- Kanon `teksty/KANON_FABULY_I_NAZWY_2026-11-10.md`: numeracja sprzed Portu, Radan → Hadræn, Zabójczyni → Tancerka Popiołu.
- Prompty graficzne z projektu claude.ai (`claude/PROMPTY_*`) → `docs/prompty/`.
- Na pulpicie autora stare `TEST_*.bat` i zipy 762–809 (za zgodą).
