Stan na 2026-11-17, cache 809, rola agent główny

# NightBrand: przekazanie dla nowego konta Claude (17.11.2026)

Ten plik jest dla agenta, który **pracował nad NightBrand na początku listopada 2026** (repo `y33bau/nightbrand` + `y33bau/nightbrand-backup`, cache ok. 420–560), a teraz wraca **bez dostępu do projektu „Nightbrand - workspace”** w claude.ai. Wszystko, czego potrzebujesz do pracy, jest tutaj i w repo. Od twojej ostatniej pracy przybyło ok. 300 commitów i zmieniło się prawie wszystko poza silnikiem.

Pozostałe pliki z tego samego przekazania:
- `PROPOZYCJE_ZMIAN_INSTRUKCJI_I_PODRECZNIKA_2026-11-17.md`: gotowy tekst instrukcji i lista poprawek poradnika.
- `SKILLE_I_AGENCI_NIGHTBRAND_2026-11-17.md`: pięć ról (umiejętności) do zapisania na nowym koncie i opis agentów zewnętrznych.

---

## 0. Pierwsze 5 minut (obowiązkowo, w tej kolejności)

1. **Poproś o dostęp do folderu gry** na komputerze autora: `C:\Users\Admin\Desktop\NIGHTBRAND` (`device_request_folder_access`, ścieżka `~/Desktop/NIGHTBRAND`). Autor tego wymaga na starcie każdej sesji. Bez folderu i repo nie zaczynaj pracy.
2. **Podepnij repo** `y33bau/NightBrand-PC` z prawem push (`add_repo`). Filtr uprawnień potrafi odrzucić pierwszą próbę („Unauthorized Access”). Wtedy poproś autora, żeby napisał wprost: *„podepnij repo y33bau/NightBrand-PC z prawem push”*, i ponów. To zadziałało 16.11.
3. `git clone --depth 1` (timeout 10 min), potem `git log -3` i cache: `grep -o "nightbrand-codex-[0-9-]*" gra/sw.js`. **Stan sprawdzaj komendami, nie z dokumentów.**
4. Przeczytaj w repo `AGENTS.md` (zasady obowiązujące wszystkich agentów) i ten plik.
5. Jedno zdanie do autora, co robisz, i pracuj.

---

## 1. Stan na koniec przekazania

| Co | Wartość |
|---|---|
| Repo robocze | `y33bau/NightBrand-PC` (prywatne), gałąź `main` |
| main | `4fe6088`, cache `nightbrand-codex-20261117-809` |
| Gałęzie czekające na „publikuj” | brak |
| Kopia zapasowa | `y33bau/nightbrand-backup`, main `04a7ffe` = kopia 809 |
| Zip itch.io | `NightBrand_itch_809.zip` (584 pliki, 148,5 MB) na pulpicie autora, w `NIGHTBRAND` |
| Rozmiar gry | ok. 152 MB (limit 500 MB) |

Ostatnie rundy: **808** (Instrukcja: ramka „Najważniejsze na start”, czytelniejsze ramki, poprawki zgodności z kodem) i **809** (nowe logo i nowe piętno: menu, ekran języka, Przygotowanie, ozdobniki pod tytułami, pieczęć w Kaplicy, ikony aplikacji; źródła logo w `docs/logo/`).

---

## 2. Co się zmieniło od czasu, który pamiętasz (najważniejsze)

### Platforma i repozytoria
- **Gra jest na KOMPUTER (Windows: klawiatura, mysz, pad). To już nie jest gra mobilna.** Sterowanie dotykowe usunięto w 782–783 (decyzja autora 16.11). Nie pisz o telefonie, iPhonie i Safari, nie optymalizuj pod nie. Kto chce grać na telefonie, podpina pada.
- **Pracujesz tylko w `y33bau/NightBrand-PC`** (linia PC od 10.11, start z kopii 562). Repo `y33bau/nightbrand` (GitHub Pages, wersja 562) jest zamrożone i nierozwijane. `nightbrand-backup` to teraz **kopia zapasowa wersji PC**, odświeżana po każdej publikacji (§5).
- **W NightBrand-PC jest wszystko naraz:** `zrodlo/main/` (źródło), `narzedzia/`, `gra/` (zbudowana gra), `teksty/`, `docs/`. Nie ma już osobnego repo gry i osobnego repo źródeł.
- GitHub Actions wyłączone (decyzja autora). GitHub Pages nieużywane.
- **Publikacja dla graczy: itch.io** (zip HTML5, najwyżej 1000 plików w zipie). Przygotowywana jest też wersja Windows w Electronie (autor: „jeszcze poczekamy”, plan niezapisany; ikona `.ico` czeka w `docs/logo/`). Xbox jest tylko rozważany: nie projektuj pod konsole bez zgody. Na itch.io wgrywa autor.
- **Limit rozmiaru folderu `gra/`: 500 MB** (było 250 i mniej). `sprawdz.py` ma już progi 500/450.

### Treść gry
- **Pięciu bohaterów** (było trzech). Litera w kodzie (`q.char`, pole `who`) / imię / klasa:
  - `r` Hadræn, Rycerz (Knight): miecz,
  - `k` Goran, Kat (Executioner): topór,
  - `z` Mira, Zabójczyni (w kodzie EN „Assassin”, w kanonie „Ash Dancer”: niespójność zgłoszona autorowi),
  - `d` Iwo, Dzwonnik (Bellringer): młot, co trzecie parowanie ogłusza tonem,
  - `m` Milena, Woskownica (Candlebound): lichtarz-włócznia, Żywy Knot, pas wosku.
- **Uwaga:** pole `who` bez wartości w `PERKS`/`CHALS` oznacza **Rycerza** (`(d.who||'r')`), a nie „wszystkich”, jak mówił stary poradnik.
- **Sześć rozdziałów** w kampanii: I Spalona Osada, II Dolne Miasto, **III Solne Nabrzeże (port, nowy)**, IV Upadły Złotogród, V Czarnobór, VI Cytadela Wierzycieli. W kodzie numery światów się nie zmieniły: `CH` 1 Osada, 2 Dolne, 3 Złotogród, 4 Czarnobór, 5 Cytadela, **6 Port** (`PORT=6`, `CAMPAIGN=[1,2,6,3,4,5]` w `02_swiaty.js`). Krypta (`dg`) pod cmentarzem rozdz. I.
- **Noc trwa 16 minut** (`NIGHT=960`), północ po 8 minutach (`BREAK_AT=480`). O północy przychodzi Poborca (V: Leszy, VI: Arcysędzia Rachmistrz), potem kram Margi na 120 s. Serduszko wypada z 3% szansą, Sycące Kociołki odnawiają się o północy.
- **Sloty aktywne:** 5 od startu (Q E F R G), szósty z Darem pieczęci (Kaplica), w kooperacji stałe 4+4.
- **Nowa fabuła** PL+EN (13–15.11): wstępy, rozmowy, bossowie, epilog, zapiski. W 788 doszły wybory w rozmowach NPC (Wit, Izolda, Rudna, Skryba, Heri, Ottokar). Zasada świata „Prawo rachunku”. Kanon w repo: `teksty/KANON_FABULY_I_NAZWY_2026-11-10.md` (numeracja sprzed dodania Portu; Radan → Hadræn jeszcze do poprawy).
- **Nowa muzyka** (784, rozdz. I–VI + intro 799), nowe arkusze bohaterów i NPC, nowy HUD (drewno i kute żelazo, -30% na PC), nowy samouczek (porady według działań gracza).

### Menu (całe przebudowane)
Kolejność ekranów:
1. Przy pierwszym uruchomieniu: wybór języka → **ekran powitalny** (`#nbPow`, tekst autora „Witaj, Wędrowcze”, „Nie pokazuj ponownie”).
2. **Menu główne**: Graj, Kaplica, Kronika, Instrukcja, Opcje; przełącznik Fabularny | Arcade; licznik Popiołów i poziomu.
3. **Graj → Ognisko** (wybór bohatera) **→ Mapa podróży** (wybór rozdziału) **→ Przygotowanie do nocy** (perk, wyzwanie, klątwy do 3, trudność, ofiara) **→ „Wyrusz w noc”**.

Wspólny wzór ekranów: lista po lewej, szczegóły/ilustracja po prawej, zakładki z LB/RB, stopka z klawiszami. Pad ma pierwszeństwo przed myszą, wspólne złote podświetlenie zaznaczenia, Back otwiera Opcje. Na Ognisku i Mapie klik myszą tylko zaznacza (dalej przycisk albo Enter/A).

### Kod
- Doszła część **`27_menu_usprawnienia.js`** (bardzo duża, ok. 1800 linii): całe nowe menu, ekran powitalny, Instrukcja wg makiety, Pauza, Kronika, Kaplica, stała `LOKALNIE`.
- CSS nowego menu siedzi głównie **w JS** (`style.textContent` z prefiksami `${O}`/`${Z}` = `'#orient'.repeat(N)` dla wysokiej specyficzności). Główny plik CSS w `assets/` zmieniasz tylko przez `wydaj.py rehash`.
- **Narzędzia autora tylko lokalnie** (decyzja 14.11): edytor menu, edytory map, tryby testowe działają wyłącznie na 127.0.0.1/localhost/[::1]/file: i dopiero po parametrze (np. `?edytor=1`). Wzór: stała `LOKALNIE` w części 27. Tryb testera (kod jako SHA-256 w `TRN_H`) jest wyjątkiem i działa także na itch.io.

---

## 3. Autor i sposób rozmowy
- Rzeczoznawca majątkowy, w IT początkujący, ale logicznie bardzo sprawny. **Dyktuje po polsku**: literówki traktuj życzliwie. Mówimy do niego na „ty”, partnersko i szczerze.
- Odpowiadaj **po polsku, krótko, wynik najpierw**, z **jedną polecaną opcją** i uzasadnieniem. Zwykle odpowiada „tak” / „publikuj” / „wrzucaj”.
- **Nie każ mu uruchamiać gita, kopiować folderów ani pisać .bat.** Testy dostaje jako gotowe pliki na pulpicie.
- Ocenia na głos („świetnie”, „za małe”, „jest ok”). Pracuj iteracyjnie, krótkimi krokami. Długie polecenia często przerywa.
- **Zawsze** wypisz, czego NIE sprawdzono (pad, dźwięk, FPS u autora, itch.io, ekrany inne niż 16:9, EN). Nie obiecuj działania na padzie, w dźwięku ani na itch.io bez sprawdzenia.
- Teksty EN pisane przez agenta są niezatwierdzone, dopóki autor ich nie przejrzy: zaznaczaj to.

---

## 4. Jak się pracuje (przepisy aktualne)

### Runda
1. `git checkout -b <temat>` od aktualnego `main`.
2. Edytujesz **tylko `zrodlo/main/*.js` i `index.html`**. Nigdy zbudowanego JS ani plików w `assets/` ręcznie.
3. Build: `python3 narzedzia/zbuduj.py zrodlo/main gra`.
4. Wydanie: `python3 narzedzia/wydaj.py wersja gra "opis (czego nie sprawdzono)"` (nowy cache, `WERSJA.txt`, `sprawdz.py`). Ma być **WYNIK: OK**.
5. Commit z atrybucją, `git -c push.negotiate=true push -u origin <gałąź>`.
6. Test dla autora (niżej) i meldunek.
7. **Merge do main (`--ff-only`) i push wyłącznie na „publikuj” / „wrzucaj”.**

### Zasoby
- Nowy obraz: `wydaj.py dodaj gra PLIK ui|ikony|tla|…` (nazwa = SHA-256, wpis w manifeście i sw.js), potem podmiana hasha w źródle.
- Zmiana CSS w `assets/`: `wydaj.py rehash gra css STARY_HASH plik_z_EDITS.py`, gdzie `EDITS=[("stare","nowe")]` i każde „stare” występuje dokładnie raz.
- **Brak polecenia `usun`:** stare, nieużywane pliki zostają w assets. Lista do sprzątnięcia jest w §6.
- Ikony `gra/icon-*.png` nie mają hasha w nazwie. Podmieniasz je wprost; nowy cache wymusza odświeżenie.

### Pułapka `OSTATNI_BUILD.txt`
`zbuduj.py` zapisuje w `zrodlo/main/OSTATNI_BUILD.txt` hash ostatniego builda. Po próbnym buildzie do katalogu tymczasowego build do `gra/` się zatrzyma, bo strażnik uzna, że ktoś zmienił grę poza źródłem. Rozwiązanie: `git checkout zrodlo/main/OSTATNI_BUILD.txt`, ale tylko jeśli `gra/` się nie zmieniało.

### Sprawdzanie (oszczędnie)
- Domyślnie: `sprawdz.py` (przez `wydaj.py`) + `node --check` zbudowanego JS. Kosmetyka (teksty, CSS) = sam build.
- Zrzuty w przeglądarce tylko na prośbę autora albo przy zmianie, której nie da się ocenić inaczej. Do tego Playwright + swiftshader, okno 1920×1080. W chmurze gra chodzi ok. 1 kl./s.
- **Haczyk testowy:** `python3 narzedzia/teksty/mktest.py gra /tmp/gt` robi kopię gry z `window.__t=s=>eval(s)` (dawny `window.__T` już nie istnieje). Serwer: `python3 -m http.server 8819 --bind 127.0.0.1` w katalogu kopii.
- **Nowe menu w testach:**
  - `#start1` jest ukryty: czekaj na `#start1:not([disabled])` w stanie `attached`.
  - Ekran powitalny zamknij przyciskiem albo ustaw `sessionStorage.nbPow=1`.
  - Stary `#sArc` → `#startN` → `#prepGo` nie działa. Start nocy: `__t('openPrep(1);PREP.train=true;renderPrep();beginRun()')`.
  - Ekran awansu: `__t('S.opening=0;S.notice=0;openLevelUpNow()')`.
  - Zakładki Instrukcji: klik w `#manTabs [data-t=start|char|slasher|style|ash|world]`.
- Test dymny: `cd narzedzia && node dymny.js ../gra 1` (z innego katalogu: błąd ENOENT). Kilka testów UI (`test-przygotowanie-ui.cjs` i podobne) nie pasuje do nowego menu.

### Pliki dla autora (mostek do komputera)
- Folder: `C:\Users\Admin\Desktop\NIGHTBRAND` (pulpit). Klon Codexa: `C:\Users\Admin\Desktop\A D R I A N\Projekt GPT\PietnoNocy\work\NightBrand-PC`.
- **Test:** zip `NightBrand_test_<cache>.zip` (zawartość `gra/`, bez `edytor-map/`) wrzucasz na pulpit. Autor uruchamia `TEST_z_zipa.bat`, który bierze najnowszy zip. GitHub u autora bywa bardzo wolny (48–82 KB/s), stąd zipy zamiast pobierania gałęzi.
- **Zip itch.io:** `python3 narzedzia/wydaj.py itch gra /ścieżka/NightBrand_itch_<cache>.zip` (paczkuje drobne pliki, pilnuje limitu 1000).
- **Jak wysłać plik na pulpit:** zapis do `/mnt/user-data/outputs/` → `SendUserFile` (daje `fileUuid`) → `device_commit_files` z `fileUuid` i `devicePath` `~/Desktop/NIGHTBRAND/...`. Sama ścieżka `stagedPath` dla dużych plików zwraca błąd 400.
- Pliki testowe i zipy zapisuj na pulpit od razu, bez pytania.

### Meldunek (po każdej rundzie)
Rola; co zmieniono; cache i commit; wynik `sprawdz.py`; czego NIE sprawdzono; decyzje dla autora; nazwa zipa / .bat do testu. Po publikacji: log sesji, lista do zrobienia, odświeżenie kopii.

---

## 5. Publikacja i kopia
Na „publikuj”:
```
git checkout main && git merge --ff-only <gałąź> && git -c push.negotiate=true push origin main
```
Potem kopia (`add_repo y33bau/nightbrand-backup` push, `git clone --depth 1`):
```
cd nightbrand-backup
git -C ../nightbrand-pc archive main | (find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} + ; tar x)
git add -A && git commit -m "Kopia NightBrand-PC main <sha> (cache N)" && git push origin HEAD:main
```
Potem zip itch.io na pulpit (`wydaj.py itch`).

---

## 6. Otwarte sprawy (lista robocza z 17.11)

**Do testu u autora (nic z tego nie było sprawdzone na żywo):**
- **809** (logo i piętno): pieczęć w Krypcie prestiżu, ekran wyboru języka, ikona.
- **808** (Instrukcja): pad, EN.
- **807** (ekran powitalny): EN do zatwierdzenia.
- **806** (Ognisko i Mapa): prawdziwy pad.
- **788–789** (wybory NPC): żaden quest nie był sprawdzony w grze.
- **787** (pilot animacji): `heroMotion` w `17_render.js`, autor ocenia „za mocno / za słabo”.
- **784, 799** (muzyka): zapętlenie bez trzasku.
- Ogólnie: pad na wszystkich nowych ekranach, kooperacja, menu po angielsku, itch.io na żywo.

**Zgłoszone autorowi, czekają na decyzję:**
- Opcje → Grafika piszą o „telefonie i tablecie” i oszczędzaniu baterii (sprzeczne z decyzją PC).
- Lista klawiszy w Opcjach i Pauzie: „Wybór karty 1 2 3”, a kart jest 4 (klawisz 4 działa).
- Zabójczyni po angielsku: „Assassin” w grze, „Ash Dancer” w zasadach.
- Kaplica: po kliknięciu wiersza myszą fokus nie przechodzi na kliknięty wiersz.
- Rozmowy NPC: kłamstwo Izoldy (40 monet) płaci więcej niż prawda (30 + pół paska); siła upiorów Skryby i Ottokara; wypłata warty 70 monet.
- Przygotowanie: czy przywrócić łączny mnożnik Popiołów w „Tej nocy”.

**Do wdrożenia (za zgodą autora):**
- Grafiki NPC i bossów Złotogrodu: czekamy na obrazy od autora.
- „Rozgrzewka” na ekranie wczytywania przeciw ścinkom przy pierwszym uruchomieniu (kompilacja shaderów i wgranie obrazów przed startem) + pomiar FPS.
- Animacje, krok 2: smuga przy uniku, wypadzie i wirze.
- Muzyka walki krypty i bossa (`crypt` nadal stary).
- Podsumowanie obrażeń po nocy (propozycja koncepciarza, polecana).
- Warianty fabularne (Chojrak i Wiesława w porcie), karta Ambrożego, efekty w nowym stylu, strojenie Wypadu.

**Porządki:**
- Dopisać `usun` w `wydaj.py` i usunąć nieużywane pliki: `ui/702ff214…` (stare logo), `ui/e87781cf…`, `ui/a8a2aa56…` (stare piętno), `ui/2766d233…` (stara pieczęć), `ui/516bd882…` (stare koło przy poziomie).
- Usunąć nieużywane reguły CSS dotyku (`#touch`, `#btns`, `#rot`, `pointer:coarse`) przez `rehash`.
- Ok. 130 starych gałęzi na GitHubie do sprzątnięcia (za zgodą).
- Pliki `PC_MENU_*`, `PC_HUD_*`, `UI_*` w katalogu głównym repo to historia rund: przenieść do `docs/historia/`.
- Na pulpicie autora stare `TEST_*.bat` i zipy 762–808 do usunięcia (za zgodą).

---

## 7. Twarde zasady (nie zmieniaj bez zgody autora)
- **Balans:**
  - leczenie przy awansie 10% maks. HP;
  - perk „Bez litości”: +20% obrażeń i 5% leczenia przy awansie;
  - solo 5 slotów od startu, 6. z Darem pieczęci;
  - kooperacja 4+4 (wspólny rozwój, osobne wyposażenie);
  - zmiana wyposażenia w pauzie zawsze, także w walce.
- Zgoda na oprawę wizualną to nie zgoda na zmianę balansu.
- Bez Hordy (usunięta 28.10) i zmiennej SLASHER. Bez zapisu w środku nocy.
- Bez nowych shaderów bez zgody. Shadery z `onBeforeCompile` muszą mieć `customProgramCacheKey`.
- Każdy nowy polski napis w `index.html` wymaga wpisu EN w `I18N_DOM` (część 01).
- Stałe używane przy starcie deklaruj przed wywołaniem (TDZ).
- W `genBrzeznica` nie dodawaj wywołań `r()` w środku.
- Niezamówionych rzeczy nie dotykaj: usterkę zgłoś i zapytaj.

---

## 8. Dokumenty, których nie zobaczysz (były w projekcie claude.ai)
Najważniejsze treści z nich są w tym pliku. Gdyby autor się do nich odwołał, poproś o wklejenie:
- `claude/DO_ZROBIENIA.md` (bieżąca lista; jej stan z 17.11 jest w §6),
- `claude/DECYZJE_AUTORA_2026-11-16.md` (platforma PC, 500 MB, dotyk do usunięcia, praca rolami),
- `claude/LOG_SESJI_*` (logi rund 16–17.11),
- prompty graficzne `claude/PROMPTY_*` (logo, NPC Złotogrodu, mapy, animacje),
- `root/PODRECZNIK_AGENTA.md` (mapa kodu ze stanu 4.11; poprawki w pliku z propozycjami).
