# Przekazanie: stan projektu NightBrand na 22.11.2026

Stan na 2026-11-22, cache 844 na main (847 na gałęzi `runda-kociolek-3d`), rola agent główny.

Ten dokument jest pełnym przekazaniem dla agenta, który nie zna projektu. Zakłada, że nie masz dostępu do żadnej rozmowy, projektu claude.ai ani pamięci poprzedniego konta. Wszystko, czego potrzebujesz, jest w repo albo w opisanych niżej plikach na komputerze autora.

## 0. Dla agenta z innego konta Claude

- Poprzednie konto miało projekt „NightBrand” w claude.ai, pamięć i umiejętności `nightbrand-*`. Nie zakładaj, że je widzisz. Reguły są w `AGENTS.md` i `docs/`, więc to one obowiązują.
- Link do raportu z poprzedniej rozmowy może nie działać u Ciebie. Ten plik jest kopią w repo i jest wiarygodny.
- Na starcie poproś autora o:
  1. dostęp do folderu gry na jego komputerze: `C:\Users\Admin\Desktop\NIGHTBRAND` (`~/Desktop/NIGHTBRAND`). W tym folderze są pliki z sekcji 9 (modele, zlecenia dla Code, zrzuty).
  2. podpięcie repo `y33bau/NightBrand-PC` z prawem push (zgodnie z `AGENTS.md`, punkt 2 startu).
  3. zgodę na narzędzie Meshy, jeśli ma wrócić do modeli 3D. Bez tego nie generujesz nowych modeli, tylko pracujesz na istniejących plikach.
- Jeśli autor nie da folderu, pracujesz tylko na repo. Pliki z pulpitu traktuj jako niedostępne i pisz o tym w meldunku.

## 1. Wynik najpierw

- **Na main (wersja 844, opublikowana):** drzewa, port i część obiektów z modeli 3D zrobionych z naszych malunków, pauza z przyciskiem „Porzuć noc”.
- **Na gałęzi `runda-kociolek-3d` (wersje 845–847, niewydane):** Sycący Kociołek jako model 3D bez ognia, wszystkie światła ×0.7. Czeka na test autora i słowo „publikuj”.
- **Do wdrożenia:** dźwig i łódź (partia 5), 16 obiektów portu od Code, domy portu, drzewa w wyższej jakości, przegląd modeli zrobionych z opisu tekstowego.
- **Nic nie wdrażamy bez wyraźnego „publikuj” lub „już” od autora.**

## 2. Projekt

**Gra.** NightBrand to mroczna gra fantasy w duchu Berserka, w stylu 16-bit/HD-2D. Docelowo to gra na komputer z Windows (klawiatura, mysz, pad Xbox). Nie jest mobilna. Dotyk został usunięty (wersje 782–783) i nie wracamy do niego. Konsola jest tylko rozważana; bez zgody autora nie projektujemy pod nią.

**Bohaterowie:** r Hadræn (Rycerz), k Goran (Kat), z Mira (Tancerka Popiołu; wcześniej Zabójczyni), d Iwo (Dzwonnik), m Milena (Woskownica).

**Rozdziały:** I Spalona Osada, II Dolne Miasto, III Solne Nabrzeże (w kodzie CH=6), IV Upadły Złotogród, V Czarnobór, VI Cytadela Wierzycieli.

**Autor:** Adrian. Rzeczoznawca majątkowy, w IT początkujący, dyktuje po polsku. Odpowiadaj po polsku, krótko, wynik najpierw, z jedną polecaną opcją. Nie każ mu używać gita, kopiować folderów ani pisać plików .bat.

**Repozytoria:**
- `y33bau/NightBrand-PC`: jedyne miejsce rozwoju.
- `y33bau/nightbrand-backup`: kopia zapasowa, odświeżana po każdej publikacji (przepis w podręczniku §5).
- `y33bau/nightbrand` (GitHub Pages, wersja 562): zamrożone.

**Publikacja:** itch.io jako zip HTML5 (maksymalnie 1000 plików), wgrywa autor. Wersja Windows w Electronie czeka i nie ma jeszcze planu.

**Limity:** folder `gra/` do 500 MB (ostrzeżenie od 450). Liczba plików zipa itch.io do 1000; na 847 było ich około 817.

## 3. Zasady (obowiązują bez wyjątku)

Źródło: `AGENTS.md` i instrukcje projektu. Kolejność ważności: instrukcje > `AGENTS.md` > `docs/STAN.md` > ostatni log w `docs/logi/` > reszta. Dokumenty z `docs/historia/` (PC_*.md, UI_*.md) to historia, nie stan.

1. **Edytujemy tylko** `zrodlo/main/*.js` (28 części, 00–27) i `index.html`. Nie ruszamy ręcznie `gra/`, `gra/assets/` ani starych folderów (demo-hd2d, gra-2d, web).
2. **Każda runda na nowej gałęzi od main.** Scalenie `--ff-only` i push tylko po wyraźnym „publikuj” lub „wrzucaj”.
3. **Balans jest zamrożony.** Leczenie przy awansie 10%, kotły 12/10/8% na sekundę, sloty 5 i 6, kooperacja 4+4, noc 16 min, północ po 8, kram 120 s. Bez zgody autora nie zmieniamy. **Zgoda na oprawę to nie zgoda na balans.**
4. **Zakazy:** bez Hordy, bez zmiennej `SLASHER`, bez zapisu w środku nocy, bez nowych shaderów bez zgody (nowe shadery z `onBeforeCompile` potrzebują `customProgramCacheKey`).
5. **Narzędzia autora** (edytor menu, edytory map, tryby testowe, kody deweloperskie) działają tylko lokalnie: adres 127.0.0.1, localhost lub plik, i dodatkowo po parametrze w adresie (np. `?edytor=1`). Warunek to stała `LOKALNIE` w `27_menu_usprawnienia.js`. W wersji dla graczy takie narzędzia muszą być zablokowane. Wyjątek: tryb testera (kod jako SHA-256 w `TRN_H`).
6. **Każdy nowy polski napis** w `index.html` ma wpis EN w `I18N_DOM` (część 01). Nazwy EN wg `teksty/KANON_FABULY_I_NAZWY_2026-11-10.md`. Teksty EN pisane przez agenta oznaczamy jako niezatwierdzone.
7. **Pad ma pierwszeństwo przed myszą.** Zakładki LB/RB, podzakładki LT/RT, Back otwiera Opcje. Ostrzeżenia to podświetlenie wrogów, nie ikony.
8. **Pułapki kodu:**
   - stałe używane przy starcie deklarujemy przed wywołaniem (TDZ),
   - model dodany przez `p.mesh` nie może mieć `propAsset=true` w `settleWorldProps` (gra przestaje wstawać, błąd `getContext`),
   - w `genBrzeznica` bez `r()` w środku,
   - zmiana liczby świateł wymaga rekompilacji materiałów.

**Budowanie i sprawdzanie:**
- Build: `python3 narzedzia/zbuduj.py zrodlo/main gra`. Strażnik przerwie, gdy gra była zmieniona poza źródłem; wtedy `python3 narzedzia/rozloz.py gra zrodlo/main` i zmiana jeszcze raz.
- Wersja: `python3 narzedzia/wydaj.py wersja gra "opis (czego nie sprawdzono)"`. Musi być „WYNIK OK”; kod 1 oznacza „nie publikuj”.
- Po buildzie: `git checkout -- narzedzia/__pycache__`.
- Sprawdzanie: `node --check` na zbudowanym JS oraz `sprawdz.py`.
- Zasoby: `wydaj.py dodaj gra PLIK rekwizyty leniwy`, `wydaj.py rehash`.
- Zip itch: `python3 narzedzia/wydaj.py itch gra ŚCIEŻKA.zip`.
- Test dla autora: zip `NightBrand_test_<cache>.zip` (zawartość `gra/` bez `edytor-map/`) na pulpit; autor klika `TEST_z_zipa.bat`.
- Przeglądarka tylko na prośbę autora albo przy ryzykownej zmianie walki lub zapisu. Haczyk testowy: `python3 narzedzia/teksty/mktest.py gra /tmp/gt`, potem `window.__t(kod)` (podręcznik §6).
- Na Windows, gdy skrypty nie widzą Pythona: zmienna `NIGHTBRAND_PYTHON` wskazuje `python.exe`.

**Meldunek** zawsze podaje: rolę, co zmieniono, cache i commit, wynik sprawdzenia, czego NIE sprawdzono, decyzje dla autora, nazwę zipa do testu.

**Role:** agent główny, gamedev, grafik, koncepciarz, recenzent. W rundzie kod zmienia jedna rola i jeden wykonawca (Claude albo Codex). Koncepciarz i recenzent niczego nie wdrażają.

## 4. Co zostało zrobione (wątek 3D z Meshy)

**Metoda, która działa:** wycinamy obiekt z naszego malunku (1024×1024, przezroczyste tło) i robimy z niego model przez image-to-3D w Meshy. Drzewa i kociołek wyszły dobrze. Modele z opisu tekstowego i z galerii CC0 odstają stylem i autor je odrzucił („nie do naszego klimatu”).

**Technika:**
- Mapowanie w `zrodlo/main/06_three_siatki_rozdzialow.js`: `P3D_MESHY` (nazwa → plik), `P3D_MMAP` (rozdział → rekwizyt → model), `P3D_LAS`, `P3D_DRZ1`, `P3D_TON` (przygaszenie kolorów). Funkcje: `meshyFor`, `meshyMat`, `meshyEmit`, `paint3dFinish`.
- Odchudzanie: `docs/modele/meshy_odchudz.py WE.glb KATALOG NAZWA`. Rozdzielczość tekstury ustawia zmienna `NB_TEX` (dla drzew 2048). Decymacja do 12–30k trójkątów w Blenderze (`bpy`, `/tmp/m6/dec.py`).
- Kolory: tekstury przemalowane gradient-mapą z kolorów malunków.
- Port: `PORT3D_KEYS` w części 06, malunki z atlasu `port_atlas` i `port_rekwizyty`. Budynki portu: `PORT_BUILDINGS` w `02_swiaty.js` (linia 107), składane z brył.

**Wersje:**
- **836–844 (opublikowane w 844):**
  - drzewa 3D z malunków (Czarnobór, Spalona Osada, Złotogród),
  - port z modelami rozdziału I (wóz, zwłoki, szubienica, koło, pręgierz, siano, koń, szyld, słup) i druga partia 36 modeli,
  - pauza z przyciskiem „Porzuć noc” w ramce (842).
- **845–847 (gałąź `runda-kociolek-3d`, niewydana):**
  - 845: Sycący Kociołek 3D (`potModel3d` w `11_dwoch_graczy_gracz.js`). Naprawiono błąd startu przez usunięcie `propAsset`.
  - 846: płomienie z Meshy wyglądały jak plastik, więc ogień wycięto (`wytnij_kolor.py`), a animowany ogień z gry usunięto na żądanie autora.
  - 847: wszystkie światła ×0.7 (`17_render.js`, linia ~120). Autor najpierw chciał łagodniejszego światła z płomieni, potem napisał „WSZYSTKIE ŚWIATŁA”.
- **Gałęzie:** `runda-meshy-2` (scalona jako 844) i `runda-kociolek-3d` (847). Scalenie do main tylko po „publikuj”.

**Uwaga o repo:** w czasie pisania tego dokumentu na gałęzi `runda-kociolek-3d` leżały niezacommitowane zmiany w `gra/sw.js` i `gra/assets/manifest.json` oraz nowe pliki w `gra/assets/`. To pozostałości po buildzie. Nie commituj ich bez sprawdzenia, skąd się wzięły.

## 5. W toku i do wdrożenia

1. **Dźwig i łódź (partia 5).** Odchudzanie zakończyło się kodem 0, ale wynik nie został potwierdzony. Modeli nie dodano jeszcze do `P3D_MESHY` ani do `PORT3D_KEYS`. Pliki są w `meshy/partia5/` (poza repo).
2. **16 obiektów portu od Code.** Wdrażamy cały port naraz, przed i po.
3. **Domy portu.** Etap A (malunki) → ocena autora → etap B (3D na miejscu obecnych domów, bez składu z bramami).
4. **Drzewa HQ** (`meshy/partia4/z_malunkow_hq`): zlecone Code, nie wykonane. Potem odchudzić do 25–30k trójkątów i podmienić. Autor: „drzewa muszą mieć lepszą jakość, szczególnie Święte Drzewo”.
5. **Przegląd modeli z partii 1–3** zrobionych z opisu tekstowego. Odstające przerobić z malunku.
6. **Światła.** Autor ma sprawdzić Dolne Miasto i Cytadelę, czy nie są za ciemne po zmianie ×0.7.
7. **Kapliczki** z zlecenia dla Code pomijamy.

## 6. Decyzje dla autora

- **Test i publikacja 847:** czy autor przetestuje zipem i napisze „publikuj”. Wtedy: log w `docs/logi/`, aktualizacja `docs/STAN.md`, kopia w `nightbrand-backup`, zip itch na pulpit.
- **Światła:** zostajemy przy ×0.7 dla wszystkich, czy poprawiamy osobno Dolne Miasto i Cytadelę.
- **Kolejność wdrożeń:** dźwig i łódź przed portem, czy wszystko naraz po przyjściu 16 obiektów od Code.

## 7. Czego NIE sprawdzono

- Pad (LB/RB, podświetlenie) i dźwięk.
- FPS i RAM na komputerze autora. Zrzuty liczy procesor, więc są wiarygodne co do wyglądu, nie co do płynności.
- Itch.io (zip nie był wgrywany).
- Wygląd na ekranie autora i w rozdzielczościach innych niż 16:9.
- Walka i czytelność bohatera w tłumie (zrzuty nie pokazują wrogów).
- Wynik odchudzania dźwigu i łodzi.
- Blender w sandboksie nie renderuje (błąd EGL); podgląd robimy w grze.

## 8. Dla recenzenta gry

Jesteś w roli recenzenta: przeglądasz kod i stan gry (błędy, ryzyka, spójność, zasady projektu) i niczego nie wdrażasz. Usterki zgłaszasz i pytasz autora.

**Start:**
1. Poproś o dostęp do folderu gry (sekcja 0).
2. `git clone --depth 1` repo, potem `git log -3` i wersja w `gra/sw.js`.
3. Przeczytaj `AGENTS.md`, `docs/STAN.md`, `docs/PODRECZNIK_AGENTA.md` (mapa kodu i przepisy).

**Na co patrzeć:**
- Zgodność z zasadami z sekcji 3, zwłaszcza balans i narzędzia autora (działają tylko lokalnie, także po ręcznym dopisaniu parametru).
- Pułapki z sekcji 3.8.
- Nowe polskie napisy mają wpis EN w `I18N_DOM`.
- Rozmiar `gra/` (500 MB) i liczba plików zipa (1000).
- Spójność `sw.js` i `manifest.json` z plikami (wcześniej `sprawdz.py` zgłaszał brakujące pliki).
- Zgodność nazw z kanonem.

**Rozbieżności w dokumentach (sprawdź, zanim uznasz za błąd):**
- `AGENTS.md` mówi „cache 812, stan na 2026-11-17”, a instrukcje projektu „cache 810”. Miarodajne są `gra/sw.js` i ostatni commit.
- Bohater: w `AGENTS.md` „Hadræn”, w pamięci autora „Radan”. Kanon: `teksty/KANON_FABULY_I_NAZWY_2026-11-10.md`.
- Mira: w `AGENTS.md` „Tancerka Popiołu (dawniej Zabójczyni)”, w instrukcjach projektu „Zabójczyni/Ash Dancer”.
- Rozdział III to CH=6 w kodzie.

## 9. Pliki poza repo (na komputerze autora)

Są w folderze `NIGHTBRAND` na pulpicie. Nie ma ich w repo:
- `meshy/drzewa_do_3d/ZLECENIE_DLA_CODE.md`
- `meshy/kociolki_port_do_3d/ZLECENIE_DLA_CODE.md` i `k0_sycacy_kociolek.png`, 18 plików `p_*.png`, `wzor_stylu_*.png`
- `meshy/partia4/z_malunkow/` (9 modeli z malunków; wersja HQ zlecona Code)
- `meshy/partia5/` (dźwig, łódź, k0 kociołek z plikami `_gora.png` i `ŹRÓDŁA.txt`)
- `domy_w_grze_teraz.png` (zrzuty budynków portu)

## 10. Gdzie szukać dalej

- Stan i lista spraw: `docs/STAN.md`.
- Ostatni log: `docs/logi/LOG_SESJI_2026-11-21.md` (opisuje wersje 836–844).
- Przepisy i mapa kodu: `docs/PODRECZNIK_AGENTA.md`.
- Dokumenty z claude.ai (`claude/...`) są archiwum i ustępują repo.
