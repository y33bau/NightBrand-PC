Stan na 2026-11-24, cache 911 (opublikowane), rola agent główny

# NightBrand: bieżący stan i lista spraw
Aktualizuj ten plik po każdej publikacji (w tym samym commicie co log w `docs/logi/`). Stan zawsze potwierdź komendami: `git log -3`, cache w `gra/sw.js`.

## Stan
| Co | Wartość |
|---|---|
| main | cache 911, opublikowane 24.11.2026 (log `docs/logi/LOG_SESJI_2026-11-24.md`) |
| Gałęzie czekające na „publikuj” | brak (899–911 opublikowane 24.11) |
| Kopia zapasowa | y33bau/nightbrand-backup = kopia 911 |
| Zip itch.io | `NightBrand_itch_911.zip` na pulpicie autora w `NIGHTBRAND` |
| Rozmiar gra/ | ok. 306 MB (limit 500 MB); zip itch.io 966 plików / 1000 (MAŁO ZAPASU: 34 wolne miejsca, strażnik od 991) |

## Decyzje autora (najnowsze)
- 24.11: mapy „jak w najlepszych grach typu Diablo, super klimat”; zgoda na zmiany tras, kolizji, rozmieszczenia wrogów i balansu map w rundzie przeglądu map. Runda 911: ciemniej poza światłem, mocniejsza winieta, zestawy przy tylnych ścianach (lokalnie `?klimat=0`). Następny polecany krok: stacje NPC (kosz z ogniem, ciepłe światło, 2–3 rzeczy) i ścieżki z płotkami w Osadzie.
- 24.11: STYL 2,5D, bajkowy dark fantasy. 3D = malowane obiekty (struktury, obiekty, assety, rekwizyty z naszych malunków); postacie, NPC i animacje chodu zostają w 2D (piloty 3D Rycerza i NPC wstrzymane). Zasady zebrane w `docs/ZASADY_SWIATA_MODELI_POSTACI.md`.
- 23.11: ZASADA – usterki znalezione przy sprawdzaniu naprawiać od razu, bez pytania (balans i publikacja nadal za zgodą). Nowe obiekty na mapach: rola grafik (+ koncepciarz do propozycji). Wystrój z propozycji 1–4 wdrożony (884); magazyn portu bez kolizji; nowy HUD w każdym oknie.
- 23.11: usunąć zapasy plików (881); faza 2 rodzin modeli w grze (882); po wszystkim sprzątanie: stary HUD w węższych oknach, obrazki pod modelami.
- 23.11: rodziny modeli 3D (neutralne modele + kolor z kodu), faza 1 w grze (880); faza 2 dopiero po zgodzie autora (zostało ok. 70 plików w zipie).
- 23.11: sklep Margi według szkicu autora (879): Marga za ladą U przed regałem, regały i rzeczy przy ścianach.
- 23.11: okna i witraże z shaderem (878, druga wersja propozycji: wnęka, stare szkło, światło na murze, gotycki witraż).
- 23.11: dom Heriego i chata Chojraka: 60 s schronienia na noc, jak u Margi (876). Malowane tekstury budynków: polecane warianty (877, „Bierz polecane”).
- 23.11: publikacja 867–875. Zgoda na balans sklepu Margi: przed północą za Popioły (połowa ceny w monetach, min. 5), 60 s na noc, zegar stoi w sklepie. Domy Osady z modeli TripoSG odrzucone („Dramat”); budynki robimy z kodu i tekstur autora.
- 23.11: teksty EN z listy `docs/teksty/EN_DO_ZATWIERDZENIA_2026-11-22.md` zatwierdzone (sekcje 1–13). W EN rozdział = „act” (decyzja autora 23.11; widoczne teksty już tak mówią, „chapter” zostało tylko w komentarzach kodu). Podpowiedzi cech czempionów (866) zatwierdzone. Zgoda na: rzadkie karty i wolniejszy awans, cechy elit i czempionów, zwalnianie światów, sprzątanie kodu (863).
- 22.11: zgoda na zmiany balansu. Noc ma rosnąć naturalnie: od startu dużo łatwych wrogów, po północy coraz trudniej (853). Reakcje żywiołów (854). Dobicie Wita to niesłuszna łaska dla mordercy (855).
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
- 885: usunięte obrazki pod modelami – modele powinny wyglądać i stać jak w 884 (porównane w przeglądarce).
- 883–884: brak niewidzialnych kolizji, HUD w oknie, wystrój Osady, Dolnego Miasta, Czarnoboru i Cytadeli, magazyn portu.
- 881–882: wystrój Cytadeli i Czarnoboru, kolizje pali i krzesła, port po usunięciu modeli domów TripoSG (porównanie lokalnie `?rodziny=0`).
- 880: stosy, kosze z ogniem, palenisko, kolumny (porównanie lokalnie `?rodziny=0`), FPS w Cytadeli, prześwietlenie modeli przy lampach.
- 879: sklep Margi (porównanie lokalnie `?lada=0`): rozmowa zza lady, kram po północy, pad.
- 878: okna i witraże (porównanie lokalnie `?okna=0`), FPS w Złotogrodzie, przycinka przy pierwszym wejściu na mapę.
- 876–877: wypchnięcie z domu Heriego i chaty Chojraka po 60 s; nowe tekstury budynków w Złotogrodzie, Osadzie, porcie i Czarnoborze (porównanie lokalnie `?malowane=0`), FPS, teksty EN schronienia (niezatwierdzone).
- 867–875 (oprawa budynków, tekstury autora, schronienia, sklep Margi za Popioły): pełna noc z zakupami za Popioły, walka pod drzwiami schronień, FPS w Złotogrodzie i porcie, przycinka przy pierwszym wejściu na mapę (kompilacja shaderów), teksty EN sklepu i schronień (niezatwierdzone).
- 866: goście z innych rozdziałów w falach (tabela `GUEST`, część 13), ghule w I–II później i rzadziej na starcie, podpowiedzi cech czempionów (EN zatwierdzone 23.11), dźwięki: Pancerz, Wezwanie, Szał, odbity pocisk.
- 864–865: podsumowanie nocy bez przewijania, krąg Wybuchu, rzadsi czempioni (do 4%), Wybuch ×1,3, 5 nowych dźwięków Kenney CC0 (odsłuch!), doskok wilków/ghuli/ogarów z zamachem i bez ciosu zaraz po skoku.
- 860–863: płynność (Czarnobór, Złotogród), pauza (pytanie o porzucenie nocy), ikonki stanów, podpowiedzi, rzadkie karty i tempo awansu (ok. 20 poziomów na noc), czempioni z cechami (Wezwanie, Wybuch w tłumie), powrót do rozdziału po zmianie.
- 856–859: zestawy 4/7, techniki ze stanami wrogów, Trudny bez premii doświadczenia, wir Tancerki z żywiołami, parowanie Kata u wszystkich postaci. Lista EN: `docs/teksty/EN_DO_ZATWIERDZENIA_2026-11-22.md`.
- 852–855 (balans postaci, skalowanie nocy, reakcje żywiołów, Wit): Tancerka i Woskownica na żywo, odczucie rampy trudności, FPS przy około 40 wrogach, Łatwy/Trudny, czy reakcje są widoczne w walce, czas wyświetlania dłuższego tekstu przy dobiciu Wita, teksty EN.
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
- Ceny sklepu Margi w Popiołach (10–30) po teście autora.
- Modele TripoSG portu nieużywane przy `portKit` (zapas pod `?portnowe=0`): zostawić czy usunąć (`wydaj.py usun`).
- Tekstury 877: m09 bale i m06 złoto najsłabsze (do wymiany?); gęste powtórzenie tynku na fasadzie pałacu (zwiększyć skalę?).
- Raport o grafice i UI 22.11 (Claude Docs „NightBrand: raport o stanie grafiki i UI”): w 849 zrobione szybkie poprawki; czekają rundy 2–5 (modele z malunków + port, drzewa HQ, Cytadela i Dolne Miasto, porządki UI).
- 851: Cytadela (szachownica kancelarii drobniejsza i matowa, chodniki w kancelarii i skarbcu, sztandary przy ścianach, kandelabry przy wadze), Dolne Miasto (płyty −30%, 4 środkowe filary sali → koksowniki). Do zrobienia: druga posadzka w halach II i proste brzegi lawy (wymagają nowych tekstur lub zmiany kształtu lawy), detal ścian Cytadeli (nowa tekstura).
- 850 (decyzje autora 22.11): Opcje → Dźwięk i pauza: głośność ogólna (`pn_master`) i „Wycisz w tle” (`pn_bgmute`, domyślnie wył.); paprocie przy cmentarzu rozrzucone; Czarnobór ze stałym ziarnem 1349 (wcześniej losowany przy każdym uruchomieniu), Cytadela i tak miała stały układ.
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
