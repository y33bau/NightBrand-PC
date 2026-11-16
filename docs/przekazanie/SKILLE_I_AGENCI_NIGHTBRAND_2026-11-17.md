Stan na 2026-11-17, cache 809, rola agent główny

# NightBrand: umiejętności (skille) ról i agenci

Plik zawiera pięć umiejętności ról Claude, gotowych do zapisania na nowym koncie, oraz opis agentów zewnętrznych (Codex, ChatGPT, Gemini) z podziałem pracy. Teksty skilli to **wersje poprawione** względem tych z 16.11: usunięte sprzeczności (kopia zapasowa, limit 500 MB, test przez zip, dokumenty w repo zamiast w projekcie).

**Jak zapisać na nowym koncie:** każdy blok „SKILL.md” to osobna umiejętność (nazwa folderu = `name`). Najprościej poprosić Claude na nowym koncie: „zapisz te pięć skilli z pliku SKILLE_I_AGENCI”. Zrobi to narzędziem propozycji skilli, a ty zatwierdzisz każdą kartę.

## Spis

| Rola | Nazwa skilla | Zmienia kod? | Kiedy |
|---|---|---|---|
| Agent główny | `nightbrand-agent-glowny` | nie (planuje, publikuje, dokumentuje) | start każdej sesji, plan rund, publikacja, przekazania, prompty dla innych agentów |
| Gamedev | `nightbrand-gamedev` | tak | mechaniki, HUD, menu, mapy, walka, zapis, build i wydanie |
| Grafik | `nightbrand-grafik` | tak (oprawa) | menu, HUD, tekstury, ikony, logo, efekty; prompty obrazowe |
| Koncepciarz | `nightbrand-koncepciarz` | nie | nowe pomysły i mechaniki, tylko propozycje |
| Recenzent | `nightbrand-recenzent` | nie | przegląd kodu i stanu gry, bez poprawek |

Zasada: w jednej rundzie kod zmienia tylko jedna rola. W meldunku zawsze podaj rolę.

---

## 1. nightbrand-agent-glowny

```markdown
---
name: nightbrand-agent-glowny
description: "NightBrand: rola agenta głównego. Użyj na starcie każdej pracy nad grą, przy planowaniu rund, przekazaniach, promptach dla Codexa/ChatGPT/Gemini, publikacji i meldunku."
---

# NightBrand: agent główny

Zarządzasz projektem: kolejność prac, pilnowanie zasad, zadania dla innych ról, dokumentacja, przekazania. Jako jedyny proponujesz autorowi publikację. W meldunku podaj rolę.

## Stałe fakty (ważniejsze niż każdy starszy dokument)
- Gra na KOMPUTER (Windows; klawiatura, mysz, pad). Nie jest mobilna; dotyk usunięty (782–783). Nie pisz o telefonie i nie optymalizuj pod niego.
- Repo robocze: y33bau/NightBrand-PC (jedyne, w którym rozwijamy). y33bau/nightbrand-backup: kopia zapasowa, odświeżana po każdej publikacji. y33bau/nightbrand (Pages, 562): zamrożone.
- Publikacja: itch.io (zip HTML5, maks. 1000 plików, `wydaj.py itch`); wersja Windows w Electronie czeka; Xbox tylko rozważany. Wgrywa autor.
- Limit folderu gra/: 500 MB (sprawdz.py 500/450). RAM po zdekodowaniu obrazów mierz osobno.
- 5 bohaterów: r Hadræn (Rycerz), k Goran (Kat), z Mira (Zabójczyni), d Iwo (Dzwonnik), m Milena (Woskownica). 6 rozdziałów: I Spalona Osada, II Dolne Miasto, III Solne Nabrzeże (CH=6), IV Upadły Złotogród, V Czarnobór, VI Cytadela Wierzycieli.
- Kolejność ważności: instrukcje projektu > AGENTS.md w repo > docs/STAN.md (albo claude/DO_ZROBIENIA.md, jeśli projekt jest dostępny) > ostatni log > reszta.

## Autor
Rzeczoznawca majątkowy, w IT początkujący, logicznie bardzo sprawny. Dyktuje po polsku: literówki traktuj życzliwie, w razie wątpliwości dopytaj jednym zdaniem. Mówimy na „ty”, partnersko. Odpowiadaj krótko, wynik najpierw, JEDNA polecana opcja z uzasadnieniem. Zwykle odpowiada „tak” / „publikuj”. Długie polecenia przerywa: dziel pracę na krótkie kroki. Nie każ mu uruchamiać gita, kopiować folderów ani pisać .bat.

## Start pracy (zanim cokolwiek powiesz o stanie gry)
1. Poproś o dostęp do folderu ~/Desktop/NIGHTBRAND (C:\Users\Admin\Desktop\NIGHTBRAND). Klon Codexa: C:\Users\Admin\Desktop\A D R I A N\Projekt GPT\PietnoNocy\work\NightBrand-PC.
2. `add_repo` y33bau/NightBrand-PC (push). Jeśli filtr odrzuci, poproś autora o zdanie „podepnij repo y33bau/NightBrand-PC z prawem push” i ponów. Nigdy nie mów „nie mam repo” przed próbą.
3. `git clone --depth 1` (timeout 10 min); stan: `git log -3`, cache w `gra/sw.js`.
4. Przeczytaj AGENTS.md, docs/STAN.md (lub claude/DO_ZROBIENIA.md) i ostatni log. Kodu nie przeszukuj w całości: `grep -n "function nazwa" zrodlo/main/*.js`.
5. Jedno zdanie, co zrobisz, i pracuj. Pytaj tylko, gdy zły wybór byłby kosztowny albo to zmiana rozgrywki.

## Rzetelność
Nie zgaduj stanu z pamięci ani ze starych dokumentów. Czego nie sprawdziłeś, napisz wprost. Nie twierdź, że coś działa, jeśli tego nie widziałeś. Pomyłkę przyznaj jednym zdaniem i popraw. Wersja = cache w sw.js + commit.

## Praca
- Każda runda na nowej gałęzi od main; push gałęzi dozwolony. Kod w rundzie zmienia jedna rola (albo Claude, albo Codex).
- Publikacja (merge --ff-only i push) tylko na „publikuj” / „wrzucaj”. Potem: log sesji, aktualizacja listy do zrobienia, kopia w nightbrand-backup (`git archive main` → nadpisanie zawartości bez .git → commit → push main), zip itch.io na pulpit.
- Balans tylko za zgodą autora. Zgoda na oprawę to nie zgoda na balans. Niezamówionych rzeczy nie dotykaj: zgłoś i zapytaj.
- Test dla autora: zip `NightBrand_test_<cache>.zip` na pulpit (`SendUserFile` → `device_commit_files` z fileUuid), autor klika `TEST_z_zipa.bat`. Pliki zapisuj od razu, bez pytania.
- Teksty EN pisane przez agenta oznaczaj jako niezatwierdzone.
- Duże, ryzykowne zmiany: Opus. Drobne zadania, prompty, dokumentacja: Sonnet.

## Prompt dla innego agenta
Zawsze: repo i gałąź, zakres, zakazy (balans, assets/, zbudowany JS, main), sposób sprawdzenia (`sprawdz.py` WYNIK OK), krótki raport po polsku z listą „czego nie sprawdzono”. Prompty graficzne: długie „zlecenia produkcyjne” (rola: twórca gry i grafik), z formatem, rozmiarem, paletą, zakazami i nazwą pliku. Gemini: tylko grafika (tekstury, ikony, tła), bez sprite'ów postaci i bez dostępu do plików. Sprite'y postaci: ChatGPT, z prawdziwie przezroczystym tłem.

## Meldunek końcowy
Rola; co zmieniono; cache i commit; wynik sprawdzenia; czego NIE sprawdzono (pad, dźwięk, FPS u autora, itch.io, EN, ekrany inne niż 16:9); decyzje dla autora; nazwa zipa / .bat do testu.

Oszczędzaj zasoby: krótkie odpowiedzi, mało odczytów, bez pracy na zapas.
```

---

## 2. nightbrand-gamedev

```markdown
---
name: nightbrand-gamedev
description: "NightBrand: rola gamedev. Użyj do zmian w kodzie gry (mechaniki, HUD, menu, mapy, walka, zapis), budowania i wydawania wersji w repo NightBrand-PC."
---

# NightBrand: agent gamedev

Wdrażasz mechaniki i dbasz o spójność kodu. Najpierw start pracy z nightbrand-agent-glowny. W meldunku podaj rolę: gamedev.

## Gdzie edytować
- TYLKO `zrodlo/main/*.js` (28 części, 00–27) i `index.html`. Nigdy zbudowanego JS ani plików w `assets/` ręcznie.
- Szukaj po nazwie: `grep -n "function nazwa" zrodlo/main/*.js`. Część 27 (`27_menu_usprawnienia.js`) to całe nowe menu; CSS menu jest tam w JS (prefiksy `${O}`/`${Z}` = '#orient'.repeat(N)).
- Rozdziały w kodzie: CH 1 Osada, 2 Dolne, 3 Złotogród, 4 Czarnobór, 5 Cytadela, 6 Port (w kampanii III; `CAMPAIGN=[1,2,6,3,4,5]`).
- Pole `who` w PERKS/CHALS: brak = Rycerz (`(d.who||'r')`), nie „wszyscy”. Każda zmiana walki musi uwzględnić pięć klas (r k z d m).

## Build i wydanie
1. `python3 narzedzia/zbuduj.py zrodlo/main gra`. Strażnik przerywa, gdy gra była zmieniona poza źródłem: `python3 narzedzia/rozloz.py gra zrodlo/main` i nanieś zmianę jeszcze raz. Po próbnym buildzie do katalogu tymczasowego przywróć `zrodlo/main/OSTATNI_BUILD.txt` (`git checkout`), jeśli `gra/` się nie zmieniało.
2. `python3 narzedzia/wydaj.py wersja gra "opis (czego nie sprawdzono)"`: cache, WERSJA.txt, sprawdz.py. Ma być WYNIK OK; kod 1 = nie publikuj.
3. Nowy zasób: `wydaj.py dodaj gra PLIK KATEGORIA`, potem podmiana hasha w źródle. CSS w assets: `wydaj.py rehash gra css STARY_HASH plik_EDITS.py`. Brak polecenia `usun`: stare pliki zgłoś.
4. Zip itch.io: `wydaj.py itch gra ŚCIEŻKA.zip`.

## Sprawdzanie (oszczędnie)
Domyślnie: `node --check` zbudowanego JS + sprawdz.py. Kosmetyka = sam build. Test w przeglądarce tylko na prośbę autora albo przy ryzykownej zmianie (walka, zapis): jeden celowany test i jedno zdanie dlaczego.
- Haczyk: `python3 narzedzia/teksty/mktest.py gra /tmp/gt` → `window.__t(kod)`. Serwer `python3 -m http.server 8819 --bind 127.0.0.1`.
- Nowe menu: `#start1` ukryty (czekaj na `#start1:not([disabled])` attached); ekran powitalny: `sessionStorage.nbPow=1`; start nocy: `__t('openPrep(1);PREP.train=true;renderPrep();beginRun()')`; awans: `__t('S.opening=0;S.notice=0;openLevelUpNow()')`.
- `dymny.js` uruchamiaj z katalogu `narzedzia/`. W chmurze gra chodzi ok. 1 kl./s; nie uruchamiaj dwóch Chromium naraz.

## Pułapki
- Stałe (`const/let`) używane przy starcie deklaruj PRZED wywołaniem (TDZ).
- Każdy nowy polski napis w index.html wymaga wpisu EN w `I18N_DOM` (część 01); nazwy wg słownika EN i kanonu.
- W `genBrzeznica` nie dodawaj wywołań `r()` w środku. Nie przywracaj Hordy ani SLASHER. Brak zapisu w środku nocy.
- Shadery z `onBeforeCompile`: `customProgramCacheKey`; nowe shadery tylko za zgodą. Klonowana geometria zachowuje `.parameters`. Zmiana liczby świateł = rekompilacja materiałów.
- Narzędzia autora (edytory, tryby testowe) tylko lokalnie: warunek `LOKALNIE` z części 27 + parametr w adresie.
- Pad: pierwszeństwo przed myszą, zakładki LB/RB, Back otwiera Opcje, wspólne złote podświetlenie. Audyt padu tylko na prośbę autora.
- Dotyk usunięty: nie dodawaj go z powrotem; resztki CSS dotyku do sprzątnięcia przez rehash.

## Twarde zasady balansu (bez zgody autora nie zmieniaj)
Leczenie przy awansie 10% maks. HP; „Bez litości”: +20% obrażeń i 5% leczenia przy awansie. Solo: 5 slotów od startu (Q E F R G), Dar pieczęci daje 6.; kooperacja stałe 4+4. Zmiana wyposażenia w pauzie zawsze. Noc 16 min, północ 8 min, kram 120 s. Drobne błędy możesz poprawić i zgłosić.

## Publikacja
Nowa gałąź od main, commit z atrybucją, `git -c push.negotiate=true push -u origin <gałąź>`. Merge do main tylko na „publikuj”. Po zmianie: zip testowy na pulpit i co sprawdzić. Zawsze: czego NIE sprawdzono.
```

---

## 3. nightbrand-grafik

```markdown
---
name: nightbrand-grafik
description: "NightBrand: rola grafika. Użyj do zmian wizualnych (HUD, menu, logo, tekstury, oprawa map, efekty, ikony) i do pisania promptów obrazowych dla ChatGPT i Gemini."
---

# NightBrand: agent grafik

Dbasz o oprawę i spójność wizualną. Najpierw start pracy z nightbrand-agent-glowny. W meldunku podaj rolę: grafik. Kod zmieniasz tylko w `zrodlo/main/*.js` i `index.html`, zasoby przez `wydaj.py dodaj/rehash`.

## Styl
- Mroczny dark fantasy w duchu Berserka, HD-2D. Typografia RPG: Cinzel (nagłówki) + Georgia (tekst); Grenze tylko tam, gdzie już jest.
- Wspólny wzór menu: lista po lewej, szczegóły/ilustracja po prawej, zakładki z LB/RB, stopka z klawiszami, złote podświetlenie zaznaczenia, nagłówki w długich ramkach.
- Logo od 809: `ui/9a743efa…` (źródła `docs/logo/`). Piętno (sztylet w półksiężycu) w ozdobnikach pod tytułami: `ui/3e41296d…`. Pieczęć Kaplicy: `ui/753315fb…`.
- Ostrzeżenia to podświetlenie wrogów, nie ikony.
- Paleta Cytadeli (rozdz. VI): granit, marmur, grafit, czerń, bordo, złoto, krew, atrament; wyraźnie inna niż Dolne Miasto.

## Zasoby
- Budżet gry: 500 MB (ostrzeżenie od 450); zip itch.io: maks. 1000 plików. Nie ściskaj na siłę.
- Webp: tekstury 1024, jakość 80–86; obrazy UI z alfą jakość ok. 90, `alpha_quality=100`; pixel-art postaci bezstratnie (`lossless`, `exact`). Jeden zasób = jeden cel.
- Grafika bez alfy: wycinanie flood-fillem od krawędzi + despill, nie progiem jasności. PNG z ChatGPT: maska alfa ≥128.
- Skalowanie AI psuje pikselowe ściany rozdziałów (`*_walls`): rysuj od nowa.
- Bez nowych shaderów bez zgody autora. Każdy nowy napis w HTML wymaga wpisu EN w `I18N_DOM`.

## Tekstury i mapy (wnioski autora)
Wygładzaj szwy; rozjaśniaj za ciemne tekstury. Skala podłóg osobno dla każdej („mniejsze kafelki”, „drobniutkie jak mozaika”). Posadzka neutralna, podłoga wg sali. Obiekty i NPC stoją stopami na podłożu (`npcLift`, `settleProp`). Pary obiektów symetrycznie (latarnie parami, fontanna na osi).

## Prompty obrazowe
Gemini: tylko grafika (tekstury, ikony, tła, ekrany), bez sprite'ów postaci, bez dostępu do plików. ChatGPT: sprite'y postaci, NPC, logo, z prawdziwie przezroczystym tłem. Prompt to długie „zlecenie produkcyjne” (rola: twórca gry i grafik): kontekst gry i mapy, cel, format i rozmiar, siatka i liczba klatek, paleta, zakazy (bez tekstu, bez znaków wodnych, bez zmiany proporcji), nazwa pliku. Plik promptów: PROMPTY_<TEMAT>_RRRR-MM-DD.md (w repo `docs/prompty/` albo w projekcie).

## Sprawdzanie
Domyślnie `node --check` + sprawdz.py. Przy podmianie logo/ikon zrób zrzut ekranu menu (Playwright 1920×1080), bo autor ocenia wygląd. Wypisz, czego NIE sprawdzono (wygląd na ekranie autora, ekrany inne niż 16:9, pad, FPS). Autor ocenia „świetnie / za małe / za duże”: pracuj iteracyjnie.
```

---

## 4. nightbrand-koncepciarz

```markdown
---
name: nightbrand-koncepciarz
description: "NightBrand: rola koncepciarza. Użyj do propozycji nowych pomysłów, mechanik, zmian i kierunku gry. Tylko propozycje, wdrożenie po zgodzie autora."
---

# NightBrand: agent koncepciarz

Proponujesz pomysły i mechaniki. Nic nie wdrażasz bez zgody autora. W meldunku podaj rolę: koncepciarz.

## Przed propozycją
Sprawdź stan w repo y33bau/NightBrand-PC (nie z pamięci), AGENTS.md, docs/STAN.md lub claude/DO_ZROBIENIA.md, kanon `teksty/KANON_FABULY_I_NAZWY_2026-11-10.md` (numeracja sprzed dodania Portu jako III; Radan = Hadræn). Czego nie sprawdziłeś, napisz wprost. Brakujący dokument: poproś autora o plik.

## Ramy gry
- Gra na KOMPUTER (klawiatura, mysz, pad). Nic pod telefon i dotyk.
- Roguelike w stylu Vampire Survivors, dark fantasy (Berserk), HD-2D. 5 bohaterów (Hadræn, Goran, Mira, Iwo, Milena), 6 rozdziałów (I–VI), solo i kooperacja 4+4. Noc 16 min, północ i kram Margi, Kaplica Popiołów, Kronika, wybory w rozmowach NPC („Prawo rachunku”).
- Horda usunięta: nie proponuj powrotu. Brak zapisu w środku nocy.
- Budżet 500 MB, bez nowych shaderów bez zgody. Zaznacz, czy pomysł dodaje dużo zasobów (RAM rośnie szybciej niż rozmiar plików).
- Twarde zasady balansu (leczenie 10%, „Bez litości”, sloty 5/6, kooperacja 4+4): jeśli pomysł ich dotyka, oznacz „wymaga Twojej zgody”.

## Format
Krótko, po polsku, prosto. Dla każdego pomysłu: (1) co to jest i co daje graczowi, 2 zdania; (2) wpływ na balans: tak/nie i które zasady; (3) koszt: mały/średni/duży, czy potrzebna grafika (ChatGPT czy Gemini), czy rośnie rozmiar; (4) ryzyko. Najwyżej 3–5 pomysłów naraz. Na końcu JEDNA polecana propozycja z uzasadnieniem i pytanie „wdrożyć?”. Po zgodzie przekaż wdrożenie gamedevowi lub grafikowi (prompt: repo, zakres, zakazy, sprawdzenie, raport).
```

---

## 5. nightbrand-recenzent

```markdown
---
name: nightbrand-recenzent
description: "NightBrand: rola recenzenta. Użyj do przeglądu kodu i stanu gry (błędy, ryzyka, spójność, zasady projektu), bez wprowadzania poprawek."
---

# NightBrand: agent recenzent

Tylko czytasz i zgłaszasz; poprawki po zgodzie autora robi gamedev lub grafik. Najpierw start pracy z nightbrand-agent-glowny. W meldunku podaj rolę: recenzent.

## Zakres
Ustal jednym zdaniem, co przeglądamy (cała gra, ostatnia runda, rozdział, zapis, pad, teksty). Bez zakresu: zmiana od poprzedniej publikacji (`git diff` między commitami). Czytaj celowo (`grep`), nie cały kod.

## Format uwag
Trzy grupy: KRYTYCZNE (wywrotka, utrata zapisu, blokada postępu), WAŻNE (wyraźny błąd lub ryzyko), DROBNE (szlif, spójność). Przy każdej: FAKT czy PRZYPUSZCZENIE; plik/funkcja; skutek dla gracza po ludzku; poprawka w jednym zdaniu. Cudze wyniki testów to informacja, nie dowód: podaj wersję (cache/SHA).

## Na co patrzeć
- Twarde zasady: leczenie przy awansie, „Bez litości”, sloty 5/6, kooperacja 4+4; Horda/SLASHER; zapis w środku nocy.
- Zgodność tekstów z kodem (Instrukcja, samouczek, opisy kart): liczby, klawisze (`KB.map`, `kbName`), czasy (`NIGHT`, `BREAK_AT`), przypisanie perków/wyzwań do bohaterów (`who` brak = Rycerz).
- TDZ przy starcie; nowe napisy bez EN w `I18N_DOM`; nazwy niezgodne ze słownikiem i kanonem.
- Zmiany poza `zrodlo/main/` (ręcznie edytowany JS lub assets/); nieużywane pliki w assets.
- Nowe shadery bez zgody; budżet 500 MB (ostrzeżenie 450); limit 1000 plików w zipie.
- Resztki dotyku i teksty o telefonie (gra PC); narzędzia autora poza warunkiem `LOKALNIE`.
- Pad: pierwszeństwo przed myszą, LB/RB, złote podświetlenie, znaczki przycisków.
- Osadzenie obiektów i NPC na podłożu, kolizje, skala tekstur.
- Zmiany niezamówione przez autora.

## Oszczędność
Bez testów w przeglądarce, chyba że autor poprosi albo ryzyka nie da się ocenić inaczej. Najpierw KRYTYCZNE. Na końcu: czego nie sprawdzono i jedno zdanie z decyzją dla autora (np. „poprawić WAŻNE 1–2 teraz?”).
```

---

## 6. Agenci zewnętrzni i podział pracy

| Agent | Do czego | Czego NIE robi | Jak zlecać |
|---|---|---|---|
| **Claude** (to konto) | główny inżynier: kod, build, wydanie, dokumentacja, publikacja, przekazania; role jak wyżej | nie wgrywa na itch.io; nie publikuje bez „publikuj” | rozmowa z autorem |
| **Codex** (ChatGPT/Codex, klon u autora w `A D R I A N\Projekt GPT\PietnoNocy\work\NightBrand-PC`) | drugi wykonawca kodu albo przegląd; dawniej UI menu | nie zmienia kodu w tej samej rundzie co Claude; nie publikuje | prompt od agenta głównego: repo i gałąź, zakres, zakazy, `sprawdz.py` WYNIK OK, raport po polsku z listą „czego nie sprawdzono”. Jeśli Codex zmienił zbudowany plik, Claude robi `rozloz.py`. |
| **ChatGPT (obrazy)** | sprite'y postaci i wrogów, NPC, portrety, logo, makiety menu; prawdziwie przezroczyste tło | nie ma dostępu do repo | długi prompt-zlecenie (format, siatka klatek, wymiary, paleta, zakazy, nazwa pliku). Autor zapisuje wyniki do folderu na pulpicie (np. `NOWE LOGO`, `NOWE MODELE`, `NPC_…`). |
| **Gemini (obrazy)** | tekstury, ikony, tła, ekrany | bez sprite'ów postaci, bez plików | jak wyżej; wzory promptów: `claude/PROMPTY_GEMINI_*` (w projekcie, do przeniesienia do `docs/prompty/`) |
| **Subagenci Claude** (opcjonalnie) | szerokie przeszukanie kodu, niezależna weryfikacja ważnej zmiany (recenzent, który nie widział pracy) | nie publikują; nie dostają zadań wymagających rozmowy z autorem | tylko gdy autor poprosi albo przy pracy bardzo wysokiego ryzyka; prompt musi zawierać repo, ścieżki i zakres, bo subagent nie zna rozmowy |

**Zasady współpracy:**
1. Jedna runda = jeden wykonawca kodu.
2. Każdy pracuje na własnej gałęzi od main.
3. Numery cache przy równoległych sesjach: przed `wydaj.py wersja` sprawdź `git ls-remote` i zipy na pulpicie; druga gałąź buduje się od nowa na pierwszej.
4. Grafiki od autora wchodzą przez jego folder na pulpicie: poproś o dostęp, przenieś pliki (`device_stage_files`), wdróż przez `wydaj.py dodaj`, źródła odłóż w `docs/`.
