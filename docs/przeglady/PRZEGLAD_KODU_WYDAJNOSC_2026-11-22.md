Stan na 2026-11-22, cache 859, rola recenzent

# Przegląd kodu: spójność, błędy, płynność

Wersja: main `b3860aa`, cache 859. Kodu nie zmieniano.

## Jak sprawdzano
- **Profil procesora:** gra w przeglądarce, bot gra noc w rozdziałach I i VI. Pomiar w 3 momentach nocy (1., 7. i 15. minuta), po 600 klatek.
- **Licznik rysowania (`renderer.info`):** wywołania rysowania i trójkąty na klatkę we wszystkich 6 rozdziałach, z cieniami i bez.
- **Przegląd statyczny zbudowanego kodu (parser `acorn`):**
  - zdublowane funkcje;
  - nasłuchy dodawane w funkcjach wywoływanych wielokrotnie;
  - odczyty układu strony w funkcjach wywoływanych co klatkę;
  - twarde zasady balansu.
- **Ograniczenie:** w chmurze grafikę liczy procesor (SwiftShader), więc czasów karty graficznej nie da się zmierzyć. Wiarygodne są liczby trójkątów i wywołań oraz czasy JavaScriptu. Proporcje przeniosą się na komputer autora; liczby bezwzględne nie.

## Wynik ogólny
- Logika gry jest tania: `update` zajmuje 0,3–0,4 ms, a `syncScene` 0,6 ms na klatkę przy 30–40 wrogach.
- Nie ma błędów JavaScriptu w nocach botem we wszystkich 6 rozdziałach.
- Twarde zasady są zachowane:
  - noc 960 s, północ po 480 s;
  - kram 120 s;
  - leczenie przy awansie 10%;
  - kociołki 12/10/8%.
- Hordy ani zmiennej `SLASHER` nie ma. `ACTIVE_SLASHER` to tylko nazwa listy umiejętności aktywnych.
- **KRYTYCZNYCH uwag brak.**

## WAŻNE

### 1. Czarnobór: cienie liczą cały las co klatkę
**FAKT z pomiaru.**
- Liczby trójkątów:

  | | Trójkąty na klatkę |
  |---|---|
  | Rozdział V, z cieniami | 13,1 mln |
  | Rozdział V, bez cieni | 2,4 mln |
  | Rozdział IV, z cieniami | 1,48 mln |
  | Rozdział IV, bez cieni | 0,44 mln |

- Przyczyna:
  - cień rzuca jedno światło punktowe przy graczu (zasięg 12), a cień takiego światła rysuje się 6 razy, raz na każdą ścianę sześcianu;
  - drzewa i rekwizyty to `InstancedMesh` z `frustumCulled=false`, więc do cienia trafia cały las z całej mapy, czyli 2,0 mln trójkątów × 6.
- Część 06 (`im.frustumCulled=false` przy drzewach, wiersz ok. 917) i część 05.
- **Skutek:** to najpewniej główna przyczyna spadków FPS w Czarnoborze. Na słabszej karcie graficznej może przycinać. PRZYPUSZCZENIE: FPS u autora nie był mierzony.
- **Poprawka:** cień rzucają tylko egzemplarze w zasięgu światła. Mały, osobny `InstancedMesh` z cieniem odświeżany, gdy gracz przejdzie około 1 pola; reszta lasu bez cienia. Wygląd bez zmian, bo światło i tak nie sięga dalej niż 12 pól.

### 2. Trzy wymuszone przeliczenia układu strony w każdej klatce
**FAKT z profilu i eksperymentu.** Co klatkę gra czyta rozmiar ekranu zaraz po zmianach w HUD, więc przeglądarka musi na nowo przeliczać układ strony. Miejsca:
- część 26, wiersz 2321 (nakładka `hud`): `scr.clientWidth` i `scr.clientHeight`;
- część 11, wiersz 208 (`edgeTick`): `$('screen').getBoundingClientRect()`;
- część 11 (`ftTick`): `$('screen').getBoundingClientRect()`.

To około 75% czasu JavaScriptu w klatce, bez samego rysowania. Eksperyment z rozmiarem wziętym z pamięci:

| | Przed | Po |
|---|---|---|
| `hud` | 3,94 ms | 0,30 ms |
| `edgeTick` | 0,88 ms | 0,05 ms |
| Cała klatka bez rysowania | ok. 6,0 ms | ok. 1,4 ms (−77%) |

- **Skutek:** zabrane kilka ms z budżetu 16,6 ms na klatkę i możliwe szarpnięcia. Na komputerze autora liczby będą mniejsze, ale proporcja podobna.
- **Poprawka:** rozmiar ekranu trzymać w pamięci i odświeżać tylko przy zmianie rozmiaru okna (`ResizeObserver`).

### 3. Przycisk „Przywróć domyślne klawisze” nie działa
**FAKT z kodu i błędu złapanego w grze:** `kbUi|Cannot read properties of undefined (reading 'length')`.
- Część 23, `kbUi()`: pętla `for(const x of b.querySelectorAll('.kbb'))` obejmuje też stałe przyciski slotów 5 i 6 (`.kbb.kbfix`, dodane 17.11).
- Te przyciski nie mają `data-a`, więc `kbName(undefined)` rzuca błąd.
- Pętla przerywa się, zanim podepnie przycisk resetu. Każde kliknięcie klawisza w Opcjach zostawia też błąd w konsoli.
- **Skutek:** w Opcjach nie da się przywrócić domyślnych klawiszy.
- **Poprawka:** selektor `.kbb:not(.kbfix)`.

### 4. Rekwizyty 3D rysowane w całości, także poza ekranem
**FAKT z pomiaru.**
- Rekwizyty z Meshy i drzewa to `InstancedMesh` z `frustumCulled=false`: wszystkie egzemplarze na całej mapie rysują się co klatkę.
- Trójkąty bez cieni: rozdział I 0,96 mln, II 0,47 mln, V 2,4 mln.
- Pojedynczy model z Meshy ma 6–12 tys. trójkątów.
- **Skutek:** zbędne obciążenie karty graficznej. Kamera widzi tylko część mapy.
- **Poprawka:** podzielić egzemplarze na kawałki mapy (np. 16×16 pól), każdy z własną bryłą ograniczającą, i włączyć pomijanie tego, czego nie widać. PRZYPUSZCZENIE: 60–80% mniej trójkątów.

## DROBNE

5. **Światy odwiedzonych rozdziałów zostają w pamięci.** FAKT.
   - `WORLDS` w części 07 trzyma wszystkie zbudowane rozdziały; `releaseWorld` jest używane tylko przy Krypcie.
   - Po przejściu 6 rozdziałów w jednej sesji: 545 tekstur, 307 geometrii, sterta około 410 MB.
   - Skutek: rosnące zużycie RAM i pamięci karty przy długiej sesji. PRZYPUSZCZENIE co do wpływu u autora.
   - Poprawka: przy starcie innego rozdziału zwalniać poprzedni świat. Koszt: dłuższe ponowne wejście do rozdziału.
6. **Modele z Meshy są gęste:** 6–12 tys. trójkątów na rekwizyt. Uproszczenie do 2–3 tys. (np. meshoptimizer) zmienia pliki zasobów i wymaga oceny wyglądu przez autora.
7. **Cień światła gracza przelicza się co klatkę, w 6 przejściach.** Jeśli po poprawkach 1 i 4 nadal będzie ciężko, można go odświeżać co drugą klatkę.
8. **Nakładka `hud` (część 26)** dwa razy na klatkę szuka elementów przez `querySelector('.pch:not(.pcmp) .pch-experience')`. Wystarczy zapamiętać je raz.
9. **Bardzo długie selektory CSS** (`'#orient'.repeat(40)`). PRZYPUSZCZENIE: podnoszą koszt przeliczania stylów; po poprawce 2 bez znaczenia, nie ruszać.
10. **Podpowiedzi pada w menu (`padHintTick`)** przeglądają wszystkie przyciski i teksty co 0,15 s. Działa tylko w menu z padem; bez zmian.

## Sprawdzone bez uwag
- Brak zdublowanych funkcji w głównym bloku kodu (768 funkcji).
- Nasłuchy w funkcjach menu są podpinane do świeżo tworzonych elementów albo chronione przed dublowaniem: wycieku nie znaleziono.
- Jeden `setInterval` (stan pada 2 w Opcjach): bez uwag.
- Klatki efektów (`skFrames`) są w pamięci podręcznej.
- Liczba tekstur w trakcie nocy rośnie łagodnie (I: 111 → 143), co wygląda na zapełnianie pamięci podręcznej, nie wyciek.

## Czego NIE sprawdzono
- Czasów karty graficznej i FPS u autora (w chmurze grafikę liczy procesor).
- Pada, dźwięku, kooperacji, itch.io, Firefoksa.
- Menu i ekranów poza nocą (poza błędem `kbUi`).

## Decyzja dla autora
Polecana kolejność: najpierw 2 i 3 (szybkie i bezpieczne), potem 1 (największy zysk w Czarnoborze), potem 4. Po każdym kroku ten sam pomiar dla porównania.

## Wdrożone w 860 (zgoda autora „rób wszystko”, rola gamedev)
- **WAŻNE 1 i 4:** nowa funkcja `chunkWorld()` w części 25, wołana w `ensureWorld()` w części 07.
  - Statyczne `InstancedMesh` świata (rekwizyty, drzewa, ściany, ciecze) są dzielone na kawałki mapy, po 8 pól, najwyżej 64 kawałki na rodzaj.
  - Każdy kawałek ma własną bryłę ograniczającą: geometria-widok na tych samych buforach, więc bez dodatkowej pamięci na karcie graficznej.
  - Kamera i cień światła gracza pomijają kawałki, których nie widać.
  - Wyłącznik do porównań: `?chunks=0`.
- **WAŻNE 2:** `scrRect()` i `scrSize()` w części 11.
  - Rozmiar ekranu jest w pamięci i odświeża się przy zmianie rozmiaru okna, przy pełnym ekranie i najpóźniej co 1 s.
  - Użycie: `edgeTick`, `ftTick` (zbędny odczyt usunięty), `mpHudTick`, `aimDir` i nakładka `hud` w części 26.
- **WAŻNE 3:** `kbUi` pomija stałe klawisze slotów 5 i 6; przycisk resetu klawiszy działa (sprawdzone).
- **DROBNE 8:** nakładka `hud` pamięta elementy doświadczenia i monet.
- **Nie robione:**
  - 5: zwalnianie światów; ryzyko dłuższego wczytywania, a zysk dotyczy tylko długich sesji;
  - 6: upraszczanie modeli; wymaga oceny wyglądu przez autora;
  - 7: cień co drugą klatkę; po pkt 1 zbędne;
  - 9 i 10.

### Pomiar po zmianach (te same skrypty)
Trójkąty na klatkę z cieniami:

| Rozdział | Przed | Po |
|---|---|---|
| I | 1,02 mln | 0,24 mln |
| II | 0,53 mln | 0,13 mln |
| III | 0,58 mln | 0,46 mln |
| IV | 1,48 mln | 0,55 mln |
| V Czarnobór | 13,06 mln | 0,50 mln |
| VI | 0,42 mln | 0,20 mln |

Liczba wywołań rysowania prawie bez zmian (na przykład V: 366 → 338).

Czas JavaScriptu na klatkę (rozdział VI, około 30 wrogów, bez rysowania):

| | Przed | Po |
|---|---|---|
| `hud` | 3,94 ms | 0,44 ms |
| `edgeTick` | 0,88 ms | 0,09 ms |
| Razem | ok. 6,0 ms | ok. 1,9 ms |

Wygląd: zrzuty w rozdziałach I, IV i V porównane piksel po pikselu z wersją 859. Różnią się tylko deszcz, świetliki i błysk ostrza, czyli elementy losowe; rekwizyty, drzewa i cienie są takie same.
