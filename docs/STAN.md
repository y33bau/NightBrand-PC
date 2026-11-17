Stan na 2026-11-17, cache 810, rola agent główny

# NightBrand: bieżący stan i lista spraw
Aktualizuj ten plik po każdej publikacji (w tym samym commicie co log w `docs/logi/`). Stan zawsze potwierdź komendami: `git log -3`, cache w `gra/sw.js`.

## Stan
| Co | Wartość |
|---|---|
| main | po publikacji 17.11: cache `nightbrand-codex-20261117-810` (sprawdź `git log -3`) |
| Gałęzie czekające na „publikuj” | brak |
| Kopia zapasowa | y33bau/nightbrand-backup = kopia 810 (odświeżona po publikacji) |
| Zip itch.io | `NightBrand_itch_810.zip` na pulpicie autora w `NIGHTBRAND` |
| Rozmiar gra/ | ok. 148–152 MB (limit 500 MB) |

## Decyzje autora (najnowsze)
- 17.11: Zabójczyni po angielsku = **Ash Dancer** (wdrożone w 810: `HEROES` w 22 i opisy technik w 12). Gałąź stylu „Zabójca/Assassin” i wyzwanie „Assassin's Strike” zostają.
- 17.11: kopia nightbrand-backup odświeżana po każdej publikacji; limit 500/450 wszędzie; test przez zip + `TEST_z_zipa.bat`; dokumenty bieżące w repo (`docs/`).
- 16.11: gra na PC, dotyk usunięty (782–783), limit 500 MB, praca rolami.
- 14.11: narzędzia autora tylko lokalnie (`LOKALNIE`).

## Do testu u autora (nic nie było sprawdzone na żywo)
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
- Przegląd 810 (`docs/przeglady/PRZEGLAD_810_2026-11-17.md`): 4 uwagi WAŻNE (warstwy menu, przełączniki w adresie bez `LOKALNIE`, zasada o nieistniejącym perku „Bez litości”, sloty 5 i 6 niewidoczne w Opcjach) i 8 drobnych.
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
- Opcje (sprawdzone 17.11 na zrzutach autora z 810: teksty o telefonie i baterii nie są widoczne, schemat klawiatury ma „1–4 wybór karty”). Zostały tylko resztki w źródle: stare zdania w `index.html` (`#pane-gfx .figcap`) podmieniane w locie przez część 27 oraz martwe wpisy w `I18N_DOM`. Sprzątnąć przy okazji, bez wpływu na gracza.
- `wydaj.py usun gra HASH` (usuwa plik, wpis z manifestu i sw.js; odmawia, gdy hash jest w źródle lub CSS), potem usunąć: `ui/702ff214…` (stare logo), `ui/e87781cf…`, `ui/a8a2aa56…` (stare piętno), `ui/2766d233…` (stara pieczęć), `ui/516bd882…` (stare koło przy poziomie).
- Nieużywane reguły CSS dotyku (`#touch`, `#btns`, `#rot`, `pointer:coarse`) usunąć przez `rehash`.
- `narzedzia/stan.py` (cache, commit, rozmiar gra/, liczba plików zipa, gałęzie czekające).
- Testy UI niepasujące do nowego menu (`test-przygotowanie-ui.cjs` i podobne): dostosować albo oznaczyć jako przestarzałe.
- Ok. 130 starych gałęzi na GitHubie (za zgodą).
- Pliki `PC_MENU_*`, `PC_HUD_*`, `UI_*` z katalogu głównego → `docs/historia/`.
- Kanon `teksty/KANON_FABULY_I_NAZWY_2026-11-10.md`: numeracja sprzed Portu, Radan → Hadræn.
- Prompty graficzne z projektu claude.ai (`claude/PROMPTY_*`) → `docs/prompty/`.
- Na pulpicie autora stare `TEST_*.bat` i zipy 762–808 (za zgodą).
