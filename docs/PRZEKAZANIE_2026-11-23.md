Stan na 2026-11-23, cache 875, rola agent główny

# Przekazanie dla następnego agenta (NightBrand, 23.11.2026, po rundach 867–875)

Najpierw przeczytaj `AGENTS.md` i `docs/STAN.md`. Ten plik opisuje tylko to, co zrobiono 23.11 po ostatniej publikacji, i to, co czeka.

## 1. Gdzie jesteśmy

- **main = 866** (opublikowane; plus commit 8146633 z decyzjami autora: EN podpowiedzi czempionów zatwierdzone, w EN rozdział = „act”). Zip itch.io 866 był u autora.
- **Nieopublikowane: gałąź `runda-869`** (zawiera `runda-868`), cache **875**, ostatni commit `a9eca2c`. Wersje 867–875 leżą tylko na gałęzi.
- Autor testuje sam z zipów `NightBrand_test_<cache>.zip` (pulpit, `TEST_z_zipa.bat`). Ostatni zip: **875**.
- Publikacja tylko na wyraźne „publikuj”: `git checkout main && git merge --ff-only runda-869 && git push`, potem log w `docs/logi/LOG_SESJI_2026-11-23.md` (plik już istnieje, dopisz sekcję 867–875), `docs/STAN.md`, kopia w nightbrand-backup, zip itch.io na pulpit (przepis: `AGENTS.md`, podręcznik §5).

## 2. Co zrobiono w 867–875 (skrót)

| cache | co |
|---|---|
| 867 | Modele TripoSG (generowane u autora przez Claude Code) dla domów portu i 15 rekwizytów portu; `P3D_TRI`, `triMat/triMesh/triHouse/triProp` (część 06). Domy Osady z modeli autor odrzucił („Dramat”). |
| 868–870 | Osada: spalone domy z kodu (`burntHouses`, część 05), tekstury autora `t1…t6` z normalnymi mapami (`OSADA_TX`, `osadaTex`, `worldSurfN`, część 04), pełne połacie dachu, dziury tylko z tekstur wypaleń. |
| 871 | Palisada obozu Czarnoboru (`palisadeCamp`), kopuły Złotogrodu z miedzi i starego złota, lina na słupkach wokół pomostów portu (`portRopeRail`), 4 nowe budynki Złotogrodu (`ZL_NOWE`, część 02), 8 nowych tekstur autora (`tgm1–3`, `tsn1–2`, `tzl1–2`, `tcz1`). |
| 872 | Kamienice Złotogrodu w jednym zestawie (`zlNoweBuild`, część 06, scalanie siatek po materiale), dom Heriego (tylko bohater), sklep Margi z ladą, szyldem, daszkiem. |
| 873 | Złotogród: wszystkie budynki w nowym standardzie (bazylika z wieżami, pałac z ryzalitami, kaplica ubogich, 20 bud w slumsach); domy Osady: okna, końce bali, kominy; chata Chojraka (tylko bohater). |
| 874 | Patyna liczona z położenia w świecie (5. parametr `worldSurfN`), domy Osady pełnej wysokości (2,4), port w nowym standardzie (`portKit`: szopy, celnica, tawerna, skład przechodni), schronienia bez cheese, bez deszczu w schronieniach. |
| 875 | Styl „obrazkowy” w shaderze (nasycenie, kontrast, smugi pędzla, ciepłe/chłodne plamy), sklep Margi powiększony i za Popioły (patrz §3). |

## 3. Nowe mechaniki (ważne przy zmianach)

**Schronienia** (`W.shelters`, część 02 `shelterAt`, część 07 `addShelter`, `heriHouse`, `chojrakHouse`, `margaHouse`):
- Kafle schronienia (`tiles`) są w `W.heroOnly`. Wrogowie i przywołańce nie wchodzą (`moveBox`, część 11; `updEnemy` i `spawnEnemy`, część 13; BFS w `navUpdate` omija je, chyba że bohater jest w środku).
- Gdy bohater jest w schronieniu: wrogowie odchodzą od drzwi na ok. 8 pól i czekają (`updEnemy`), a `damageEnemy` nie zadaje obrażeń. To blokuje „cheese” w drzwiach. Sprawdzone testem w przeglądarce (wilk odszedł na 8 pól, cios ze środka 0, z zewnątrz trafia).
- Dach schronienia znika przy bohaterze (`roofTick`, `r.pad`), w środku nie pada (`roofCovered`, część 17).

**Sklep Margi w Osadzie (CH=1)** (`margaHouse`, część 07; `margaShopTick`, `ashShopUiTick`, `priceAsh`, `renderShop/openShop/buy/closeShop`, część 15; HUD część 19):
- Dom Margi powiększony o 3 pola na północ, ściany domknięte, szeroki front sklepu.
- Faza `p1` (do północy): w środku zegar nocy stoi (`S.inShop` blokuje `S.t+=dt`, część 14), łącznie 60 s na noc (`S.shopT`, także gdy okno sklepu jest otwarte). Rozmowa z Margą otwiera sklep **za Popioły** (`EMB.e`, `saveEmb()`).
- Ceny w Popiołach: połowa ceny w monetach, min. 5 (Wywar 10, Kamień 12, Osełka 18, Zwój 20, Serce 23, Amulet 30), wzrost i limity wspólne z kramem.
- Po wyczerpaniu minuty: bohater wypchnięty za próg, drzwi zamknięte dla graczy do północy (`sh.closed`).
- Przerwa o północy: kram **za monety** jak dotąd (2 min, w tym samym domu). Po przerwie sklep zamknięty (żeby nie chować się przed bossem).
- Zdarzenie „latarnia handlarki gaśnie” (`ev('mg')`) jest wyłączone, gdy sklep działa.

Zgoda autora na zmianę balansu: tak (23.11, „sklep działa od samego początku… tylko za popioły… ogarnij ekonomię”).

## 4. Tekstury i shader

- `OSADA_TX` (część 04): klucz → `[tekstura, normal mapa]`. Klucze autora: `t1_bale … t6_dachowka`, `tgm1_tynk_wapienny`, `tgm2_mur_kamienny`, `tgm3_dachowka_gliniana`, `tsn1_dab_portowy`, `tsn2_konopie_skrecane`, `tzl1_miedz_patynowana`, `tzl2_zloto_patynowane`, `tcz1_drewno_palisady`, oraz `m_buda` (dach bud z tekstury mapy).
- `worldSurfN(mat,key,scale,str,wk)`: mapowanie po współrzędnych świata + normal mapa; `wk` = patyna i styl obrazkowy (0 brak, 1 miasto, 2 port/wieś, 3 spalone). Kod shadera: `NB_WEATHER`, `nbWeather`.
- Normal mapy liczone z jasności (rozmycie 1,6 px, gradient z zawijaniem, siła 6). Przepis w historii sesji: Pillow + numpy, potem `wydaj.py dodaj gra PLIK tekstury leniwy`.

## 5. Co czeka (kolejność)

1. **Malowane tekstury z Claude Code u autora.** Zlecenie: `C:\Users\Admin\Desktop\NIGHTBRAND\ZLECENIE_DLA_CODE_TEKSTURY.md`, wzory stylu w `NOWE MODELE\Tekstury_wzory\`, wynik ma trafić do `NOWE MODELE\Tekstury_malowane\` (12 materiałów `m01…m12` × 4 warianty, `PODGLAD.jpg`, `LICENCJE.txt`). Gdy autor napisze „sprawdź tekstury”: pobierz (`device_stage_files`), obejrzyj podgląd i szwy (kafel 2×2), wybierz z autorem, przerób na webp 1024, policz normal mapy, dodaj przez `wydaj.py dodaj`, podmień adresy w `OSADA_TX` (te same klucze albo nowe i zamiana w `zlNoweBuild`, `chojrakChata`, `portKit`, `burntHouses`, `buildBrzeznica`). Sprawdź licencję modelu (ma pozwalać na sprzedaż).
2. Publikacja 867–875 na „publikuj” (patrz §1).
3. Decyzje do autora: limit czasu w domach Heriego i Chojraka (teraz można tam przeczekać całą noc; propozycja: 60 s, potem potwory wracają pod drzwi); ceny w Popiołach po jego teście.
4. Sprzątanie po decyzji: modele TripoSG portu są nieużywane, gdy działa `portKit` (zostały jako zapas pod `?portnowe=0`). Jeśli autor nie chce zapasu, usuń je przez `wydaj.py usun` (oszczędność miejsca w 500 MB).

## 6. Przełączniki do porównań (tylko lokalnie, `nbParam`)

`?spalone=0` (stare domy Osady), `?osada2=0` (niskie domy Osady bez okien), `?sklep=0` (bez wystroju sklepu), `?sklepmarga=0` (bez sklepu za Popioły i powiększenia), `?chojrak=0`, `?heri=0`, `?zlnowe=0` (stare budynki Złotogrodu), `?kopuly=0`, `?palisada=0`, `?lina=0`, `?portnowe=0` (port z modeli TripoSG), `?tri3d=0`.

## 7. Czego NIE sprawdzono

Pad, dźwięk, FPS u autora, itch.io. Pełna noc z zakupami za Popioły (tylko test funkcji w przeglądarce). Walka pod drzwiami schronień w prawdziwej grze (tylko test ruchu wroga i obrażeń). Kompilacja shaderów przy pierwszym wejściu na mapę (możliwa krótka przycinka).

Teksty EN pisane 23.11 przez agenta (niezatwierdzone): komunikaty sklepu Margi („Marga's shop…”, „Come back before midnight…”, „Your minute is up…”, „Marga pushes you over the threshold…”, „Marga bars the door…”), napis schronienia („A safe roof. Here your blade stays sheathed, and the night waits outside.”), HUD „Marga's shop · clock stopped · N s”, nagłówki okna sklepu.

## 8. Narzędzia testowe

Zrzuty i testy w przeglądarce robiono skryptami w `/tmp` (nie przetrwają nowej sesji). Przepis ogólny: podręcznik §6 (`mktest.py`, `window.__t`). W chmurze gra chodzi ok. 1 klatki/s; harness w Playwright potrafi się zawiesić po kilku komendach: wtedy zabić procesy chromium i uruchomić od nowa.
