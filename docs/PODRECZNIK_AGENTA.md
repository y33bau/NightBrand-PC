Stan na 2026-11-17, cache 809, rola agent główny

# Podręcznik agenta: NightBrand PC
Cel: nowy agent zaczyna pracę w kilka minut, bez odkrywania gry od nowa. Zasady: `AGENTS.md`. Stan bieżący: `docs/STAN.md`. Gdy coś tu nie zgadza się z kodem, popraw ten plik na końcu rundy.

## 1. Gdzie co jest
Jedno repo **y33bau/NightBrand-PC** (`add_repo` z push, `git clone --depth 1`, timeout 10 min):
- `zrodlo/main/`: źródło głównego JS w **28 częściach (00–27)** + `OSTATNI_BUILD.txt`.
- `gra/`: zbudowana gra (index.html, sw.js, WERSJA.txt, assets/, ikony `icon-*.png`).
- `narzedzia/`: `zbuduj.py`, `rozloz.py`, `wydaj.py`, `sprawdz.py`, `dymny.js`, testy `test-*.cjs`, `teksty/mktest.py`.
- `teksty/`: teksty PL/EN, kanon fabuły. `docs/`: ten plik, `STAN.md`, `logi/`, `logo/` (źródła logo, piętna, ikona .ico), układ assetów.
- GitHub Actions wyłączone, GitHub Pages nieużywane, gałęzi `kopia/…` już nie robimy.

Pliki w `gra/assets/` mają nazwy = SHA-256 treści (podkatalogi `ui/`, `ikony/`, `tla/`… wg `docs/ASSETY_UKLAD.md`):
| Co | Jak znaleźć |
|---|---|
| Główny JS gry | znacznik `/* ============ WORLDS ============ */` (`narzedzia/zrodlo_wspolne.py: glowny()`) |
| SPRITE_DATA | `grep -l "const SPRITE_DATA=" gra/assets/*.js` |
| three.js | poza źródłem, nie ruszać |
| CSS | główny ok. 146 KB (`ls -S gra/assets/*.css`); CSS nowego menu jest w JS (część 27) |
| Manifest | `gra/assets/manifest.json` |
| Service worker | `gra/sw.js`: `const C='nightbrand-codex-RRRRMMDD-NNN'`, `F=[...]`, `L=[...]` (leniwe) |
| Dziennik | `gra/WERSJA.txt` |

Części źródła: 00_grupy_sprite, 01_start_jezyk (LANG, `I18N_DOM`, stałe `NIGHT`, `BREAK_AT`), 02_swiaty (`PORT`, `CAMPAIGN`), 03_three_teren, 04_three_sciany_ciecze, 05_three_skala_dekoracje, 06_three_siatki_rozdzialow, 07_swiatla_uklad_map, 08_sprite_sheets, 09_audio_ustawienia_grafika (SETT, GPRE/GFX, `KB_DEF`), 10_stan_gry, 11_dwoch_graczy_gracz, 12_walka, 13_wrogowie, 14_umiejetnosci (`openLevelUpNow`), 15_etapy (`startBreak`), 16_krypta, 17_render (`heroMotion`), 18_minimapa, 19_hud, 20_fabula, 21_muzyka, 22_postac_zapis_ustawienia (`HEROES`, PERKS, CHALS), 23_instrukcja_sterowanie (`manPage`), 24_pad_samouczek_bledy, 25_grafika_wydajnosc, 26_start_petla, **27_menu_usprawnienia** (ok. 1800 linii: nowe menu, ekran powitalny `#nbPow`, Instrukcja, Pauza, Kronika, Kaplica, stała `LOKALNIE`; CSS w `style.textContent` z prefiksami `${O}`/`${Z}` = `'#orient'.repeat(N)` dla wysokiej specyficzności). Szukaj: `grep -n "function nazwa" zrodlo/main/*.js`.

Foldery `web\`, `demo-hd2d\`, `gra-2d\` na komputerze autora są nieaktualne. Nigdy nie uruchamiaj ani nie każ uruchamiać `zbuduj.bat`, `sync-i-build.bat`, `tools\build.cjs`.

## 2. Mapa kodu (szukaj po nazwach)
- **Rozdziały** (`CH` w kodzie): 1 Spalona Osada (`genBrzeznica`/`buildBrzeznica`), 2 Dolne Miasto (`genDolne`/`buildDolne`), 3 Złotogród (`genStolica`/`buildStolica`), 4 Czarnobór (`genCzarnobor`/`buildCzarnobor`), 5 Cytadela (`genCytadela`/`buildCytadela`), **6 Port / Solne Nabrzeże** (`PORT=6`, `S.solne`), 9 krypta (`dg`, pod cmentarzem rozdz. I). Kolejność w kampanii: `CAMPAIGN=[1,2,6,3,4,5]`, więc port to rozdział III. Mapa MW×MH = 104×91 kafli; generatory na siatce GW×GH, `upscaleWorld` rozciąga.
- **Kafle SOLID**: 21,22,23,24,27,31,45,48,58,59,68,69,78,80,91 (31 kolizja rekwizytu, 24 lawa, 23 przepaść, 27 koksownik, 45/90 woda ch1, 91 bagno ch4, 64/65 bród/bagno, 54 kałuża, 43/44/48 chaty, 59 domy, 21 mur, 78/80 ściany/kraty ch5). Sprawdź dla portu przed zmianą.
- **Dekoracje**: `enrich(w,ch)`, `decorFill`, `thinFires`, `deepMarsh`, `dressNeutral` (`NP_CFG`), `layoutPatch1`. Rekwizyt: `prop(...)`, `reserve(...)`. Osadzenie na podłożu: `propFoot`, `settleProp`, `npcLift`.
- **Ciecze i podłoża**: `liquidMat`, `lavaHD`, `waterHD`, `shoreFX`; `CC0_FLOORS[ch]`, `cc0FloorCells`, `groundMaterial`, `HD_TEX`.
- **Ściany**: `worldSurf`, `wallTex`, `addWalls`, `cutCircle`/`cutaway`. Ściany `*_walls` to pixel-art: skalowanie AI psuje styl.
- **Noc**: `NIGHT=960` (16 min), `BREAK_AT=480` (północ), `stageTick`, `startBreak` (Poborca; V: Leszy, VI: Arcysędzia Rachmistrz; kram Margi `wait:120`; kociołki `S.pot` odnawiane tutaj), `S.merchant`. Serduszko 3%.
- **Walka**: `attackHit`, `damageEnemy`, `onParry`, `riMul`, `activateSlot`, `ACTIVE_CFG`, `waveTick`, `BR` (gałęzie stylów: Obrońca, Zabójca, Mistrz fal), `SK`, `STY`, `SKM`, `skAdd`, `emitCombatEffect`. Pickupy: `dropPick`. XP: `awardXp`. Nawigacja: `NAV`, `navUpdate`.
- **Awans**: `openLevelUpNow` (14): 4 karty, klawisze 1–4, R przerzut.
- **Bohaterowie**: `HEROES` (22), `q.char` ∈ `r|k|z|d|m`.
- **Instrukcja**: `manPage(id)` (23); pomocnicze `mBox`, `mP`, `mUl`, `mK` (klawisz), `mKb` (klawisz z ustawień), `mPad` (linia pada). Zakładki: `start`, `char`, `slasher`, `style`, `ash`, `world`.
- **Klawisze**: `KB_DEF` / `KB.map` (09), `kbName()`.
- **Grafika**: `SETT.qmode` → `qualityFromMode()` → `SETT.quality` + `gfxResolve()` → `GFX` {shadow, lights, fx, parts, res, aniso, dpr, hdTex} z `GPRE`. `gfxApply()`, `fit()` → `rtApply()`, dynamiczna rozdzielczość `dynOn/dynTick/dynReset`, `SETT.fpsCap`, licznik `fpsBoxShow/fpsSample`.
- **Zapis**: ustawienia w `localStorage pn_access` (`saveAccess`, `applyAccess`); błędy `handleGameError`, `pn_errors`. Brak zapisu w środku nocy.
- **Ekran**: `fit()` (max 2,4:1), kamera perspektywiczna fov 24°, pitch 55°, DIST 30.

### 2a. Klasy postaci (pięć)
| Litera | Imię | Klasa PL / EN | Broń, cecha |
|---|---|---|---|
| r | Hadræn | Rycerz / Knight | miecz |
| k | Goran | Kat / Executioner | topór |
| z | Mira | Zabójczyni / Ash Dancer (w grze jeszcze „Assassin”, do poprawy) | ostrza, techniki rend/fan/ldance |
| d | Iwo | Dzwonnik / Bellringer | młot, co trzecie parowanie ogłusza tonem |
| m | Milena | Woskownica / Candlebound | lichtarz-włócznia, Żywy Knot, pas wosku |

**Pole `who` w PERKS/CHALS/technikach: brak wartości = Rycerz** (`(d.who||'r')` w 22 i 27), a nie „wszyscy”. Każdą zmianę walki i flag klas sprawdzaj dla pięciu wariantów.

## 3. Przepis A: zmiana kodu
1. `git checkout -b <temat>` od aktualnego main.
2. Zmień część w `zrodlo/main/` (kotwice tekstowe, każda dokładnie raz).
3. `python3 narzedzia/zbuduj.py zrodlo/main gra`: skleja, zapisuje pod nowym hashem, poprawia manifest i sw.js, `node --check`. Strażnik: gdy gra była zmieniona poza źródłem (Codex), przerywa → `python3 narzedzia/rozloz.py gra zrodlo/main` i zmiana jeszcze raz. Granice części: `CZESCI` w `narzedzia/zrodlo_wspolne.py`.
4. `python3 narzedzia/wydaj.py wersja gra "opis (czego nie sprawdzono)"`: nowy cache, WERSJA.txt, sprawdz.py (WYNIK OK; kod 1 = nie publikuj; dodatkowo kontrola limitu itch.io).
5. `git checkout -- narzedzia/__pycache__` jeśli się zmieniło; commit z atrybucją; `git -c push.negotiate=true push -u origin <gałąź>`.
- **Pułapka `OSTATNI_BUILD.txt`**: po próbnym buildzie do katalogu tymczasowego strażnik zablokuje build do `gra/`. Rozwiązanie: `git checkout zrodlo/main/OSTATNI_BUILD.txt`, ale tylko jeśli `gra/` się nie zmieniało.

## 4. Przepis B: nowy obraz / zasób
- `python3 narzedzia/wydaj.py dodaj gra PLIK KATEGORIA` (ui|ikony|tla|…): nazwa = SHA-256, wpis w manifeście i sw.js. Potem podmień hash w źródle i przebuduj (przepis A).
- CSS w assets: `wydaj.py rehash gra css STARY_HASH plik_EDITS.py`, gdzie `EDITS=[("stare","nowe")]`, każde „stare” dokładnie raz.
- Brak polecenia `usun`: stare pliki zostają (lista w `docs/STAN.md`).
- Ikony `gra/icon-*.png` nie mają hasha: podmieniasz wprost, nowy cache wymusza odświeżenie.
- Webp: tekstury 1024, jakość 80–86, `method=6`; UI z alfą ok. 90, `alpha_quality=100`; pixel-art postaci bezstratnie. Grafika bez alfy: flood-fill od krawędzi + despill. PNG z ChatGPT: maska alfa ≥128.
- Logo od 809: `ui/9a743efa…`; piętno w ozdobnikach `ui/3e41296d…`; pieczęć Kaplicy `ui/753315fb…`. Źródła w `docs/logo/`.

## 5. Przepis C: publikacja i kopia (tylko na „publikuj” / „wrzucaj”)
```
git checkout main && git merge --ff-only <gałąź> && git -c push.negotiate=true push origin main
```
Kopia (`add_repo y33bau/nightbrand-backup` push, `git clone --depth 1` obok):
```
cd nightbrand-backup
git -C ../nightbrand-pc archive main | (find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} + ; tar x)
git add -A && git commit -m "Kopia NightBrand-PC main <sha> (cache N)" && git push origin HEAD:main
```
Potem: zip itch.io (`wydaj.py itch gra /mnt/user-data/outputs/NightBrand_itch_<cache>.zip`) na pulpit, log `docs/logi/LOG_SESJI_RRRR-MM-DD.md` i aktualizacja `docs/STAN.md` (commit na main po publikacji albo w gałęzi rundy przed nią).

## 6. Testy (oszczędnie; testuje głównie autor)
- Domyślnie: `node --check` + sprawdz.py. Kosmetyka = sam build. Przeglądarka tylko na prośbę autora albo przy ryzykownej zmianie (walka, zapis): jeden celowany test.
- **Haczyk**: `python3 narzedzia/teksty/mktest.py gra /tmp/gt` robi kopię z `window.__t=s=>eval(s)` (dawny `window.__T` nie istnieje). Serwer: `python3 -m http.server 8819 --bind 127.0.0.1` w `/tmp/gt`. Playwright + swiftshader, okno 1920×1080; w chmurze ok. 1 kl./s; nigdy dwa Chromium naraz.
- **Nowe menu**: `#start1` ukryty (czekaj na `#start1:not([disabled])` w stanie `attached`); ekran powitalny: przycisk albo `sessionStorage.nbPow=1`; stary `#sArc` → `#startN` → `#prepGo` nie działa. Start nocy: `__t('openPrep(1);PREP.train=true;renderPrep();beginRun()')`. Awans: `__t('S.opening=0;S.notice=0;openLevelUpNow()')`. Zakładki Instrukcji: `#manTabs [data-t=...]`.
- Test dymny: `cd narzedzia && node dymny.js ../gra 1` (z innego katalogu: ENOENT).
- Testy UI `test-przygotowanie-ui.cjs` i podobne nie pasują do nowego menu (przestarzałe do czasu dostosowania). Audyt padu `test-audyt-pad.cjs` tylko na prośbę autora.
- **Pliki dla autora**: zip `NightBrand_test_<cache>.zip` (gra/ bez edytor-map/) → `/mnt/user-data/outputs/` → `SendUserFile` (fileUuid) → `device_commit_files` do `~/Desktop/NIGHTBRAND/`. Autor klika `TEST_z_zipa.bat`. Sama ścieżka `stagedPath` dla dużych plików daje błąd 400. Nie przepuszczaj przez mostek pojedynczych webp prosto do folderu gry.

## 7. Pułapki, na które już wpadliśmy
- Zmiana pliku bez podmiany w manifeście = 404: tylko przez zbuduj/wydaj.
- TDZ: stałe używane przy starcie (09, `applyAccess`) deklaruj przed wywołaniem; funkcje są wynoszone, stałe nie.
- Wyłączone światło i tak kosztuje w shaderze (liczy się `visible`). Zmiana liczby świateł/cieni = rekompilacja materiałów.
- `rm` ze zmienną powłoki blokuje strażnik: ścieżki dosłowne. `pkill -f` ze stringiem z własnego polecenia zabija własną powłokę.
- Tagi git nie przechodzą przez proxy. Nowe repo przez API: 403 (autor zakłada sam).
- `add_repo` i dostęp do folderu bywają odrzucane przez filtr: poproś autora o wyraźne zdanie i ponów (16–17.11).
- Wczytywanie obcych plików pickle: czytnik z białą listą, osobny katalog, `python3 -I`.
- `genBrzeznica` bez `r()` w środku. `deepMarsh` pilnuje bagna. Klonowana geometria w `mkProp` zachowuje `.parameters`. `onBeforeCompile` → `customProgramCacheKey`.
- Słownik EN dopasowuje dokładny tekst: nowy polski napis w index.html = wpis w `I18N_DOM` (sprawdz.py zgłasza).
- Po `wydaj.py dodaj` podmień hash w źródle i przebuduj.
- Nie przywracaj Hordy ani SLASHER.

## 8. Czego agent NIE może zrobić sam
Publikować na main bez „publikuj”; zmieniać balansu bez zgody; obiecywać działania na padzie, w dźwięku, na itch.io bez sprawdzenia; projektować pod konsole bez zgody; rozwijać ani przywracać kodu dotyku; uruchamiać lub kazać uruchamiać stare `.bat`. Rzeczy do sprawdzenia przez autora zawsze wypisz w meldunku.
