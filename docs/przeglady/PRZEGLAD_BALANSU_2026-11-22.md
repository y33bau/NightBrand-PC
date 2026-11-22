Stan na 2026-11-22, cache 851, rola recenzent

# Przegląd balansu walki i umiejętności

Tylko analiza. W kodzie nic nie zmieniono, bo balans jest zamrożony.

## Jak mierzono
- Liczby z kodu: części 10, 12, 13, 14 i 22.
- Symulacja botem: rozdział I, Normal, 5 klas.
  - Bot jest nieśmiertelny i używa tylko lekkich ataków.
  - Karty przy awansie wybiera losowo.
  - Obrażenia, które dostaje, są liczone, ale go nie zabijają.
- Bot to nie człowiek. Liczby pokazują proporcje między klasami, a nie odczucia z gry.

## DPS klas (poziom 1, jeden cel)

| Klasa | Lekki seria | Lekki ciągły | Ciężki seria | Ciężki ciągły | HP |
|---|---|---|---|---|---|
| Rycerz | 48 | 20 | 51 | 18 | 100 |
| Kat | 43 | 19 | 56 | 21 | 125 |
| Dzwonnik | 41 | 19 | 59 | 23 | 115 |
| Woskownica | 37 | 17 | 41 | 17 | 100 |
| Tancerka | 53 | 20 | 36 | 15 | 75 (×1,1 obrażeń) |

## Noc bota (16 minut)

| Klasa | Poziom na koniec | Zabójstwa | Obrażenia/s pod koniec | Sekundy do śmierci przy tym tempie |
|---|---|---|---|---|
| Rycerz | 26 | 2358 | ~25 | ~4 |
| Kat | 27 | 2485 | ~20 | ~6 |
| Dzwonnik | 26 | 2400 | ~20 | ~5,5 |
| Woskownica | 26 | 2385 | ~37 | ~2 |
| Tancerka | 24 | 1939 | ~41 | ~2 |

Tempo awansu (Rycerz) w kolejnych minutach:

| Minuta | 1 | 3 | 5 | 8 | 12 | 16 |
|---|---|---|---|---|---|---|
| Poziom | 5 | 10 | 15 | 19 | 23 | 26 |

## Wnioski

### WAŻNE
1. **Tancerka odstaje.** FAKT z symulacji.
   - Zabija o 20% mniej i kończy noc 2–3 poziomy niżej.
   - Dostaje prawie 2× więcej obrażeń na sekundę, mając najmniej HP.
   - Przyczyna: cios trafia najwyżej 3 cele, do tego 75 HP i ×1,1 przyjmowanych obrażeń.
   - Propozycja: zmienić jedno z trojga: limit celów 3→4, HP 75→85 albo zdjąć ×1,1.
2. **Woskownica najsłabsza w zadawaniu obrażeń i dużo przyjmuje.** FAKT z kodu i symulacji.
   - Ma najniższy DPS bazowy i ~37 obrażeń/s pod koniec nocy.
   - Bot nie używa jej mocnych stron (aktywnych), więc to częściowo PRZYPUSZCZENIE.
   - Propozycja: najpierw sprawdzić na żywo, dopiero potem ruszać liczby.
3. **Szklany Miecz zależy od kolejności kart.** FAKT z kodu (część 14, `pick`).
   - Siła dodaje +0,1, a Szklany Miecz mnoży ×1,5. Wzięty jako ostatni daje więcej.
   - Propozycja: liczyć go jako stały mnożnik w `might()`, a nie mnożyć `S.str`.
4. **Bardzo szybki awans: ~26 poziomów na noc, w tym 10 w pierwsze 3 minuty.** FAKT z symulacji.
   - Karty lecą co kilkanaście sekund, więc wybór traci wagę.
   - Działają dwa mnożniki XP: ×1,2 przy podnoszeniu i ×1,02 w `awardXp`.
   - Propozycja (do decyzji): zostawić albo wydłużyć pierwsze poziomy (`xpNeed`).
5. **Wrogi rosną szybciej niż gracz.** FAKT z kodu.
   - Przez noc HP wrogów rośnie ×3,4, a ich obrażenia ×2,07.
   - Gracz rośnie sam z siebie tylko +7% na poziom; resztę dają karty.
   - Na razie to działa, bo zabójstw jest bardzo dużo. Przy wolniejszym awansie (pkt 4) końcówka zrobi się dużo trudniejsza.
   - Propozycja: pkt 4 i 5 ruszać tylko razem.

### DROBNE
6. **Krwawe Ostrze leczy 4+L za każdy finisz.** FAKT z kodu, skala nie zmierzona.
   - Przy ~2400 zabójstwach może się sumować w bardzo dużo leczenia.
   - Propozycja: zmierzyć w jednym teście na żywo.
7. **Znaki na dużych wrogach działają dobrze.** FAKT z kodu.
   - Elity (`mini`), Boginka i bossowie są w `encBig`: 5 znaków i mały procent HP.
   - Uwag brak.
8. **Poprawki z przeglądu 14.11 trzymają się.** FAKT z kodu.
   - Regeneracja many, poziomy riposty, addytywna Siła, krwawienie i opis Aard są w porządku.

## Czego NIE sprawdzono
- Gra żywego gracza: uniki, ciężkie ataki, aktywne umiejętności, rozsądny wybór kart.
- Rozdziały II–VI i trudności inne niż Normal.
- Kooperacja, pad, dźwięk, FPS u autora, itch.io.
- Czas walki z bossem (pomiar w bocie był niewiarygodny).

## Wdrożone w 852 (zgoda autora 22.11, rola gamedev)
- Szklany Miecz: stały mnożnik ×1,5 w `might()` (`S.glass`), niezależny od kolejności kart.
- Tancerka:
  - lekki cios trafia do 4 wrogów (było 3);
  - HP 80% bazowego (było 75%);
  - przyjmowane obrażenia ×1,05 (było ×1,1);
  - lekkie ciosy [14,15,14,15,26] (było [13,14,13,14,24]).
- Woskownica: lekkie ciosy [17,18,28] (było [16,17,26]).
- XP z podnoszenia: ×1,02, jak w `awardXp` (decyzja z 15.11 nie była naniesiona na tę ścieżkę).
- Tempa awansu i wzrostu wrogów nie ruszano: zmiana XP w bocie nie dała widocznej różnicy, a wolniejszy awans utrudniłby końcówkę.

### Bot po zmianach (dwa przebiegi, zabójstwa)

| Klasa | Przed | Po, 1. przebieg | Po, 2. przebieg |
|---|---|---|---|
| Rycerz | 2358 | 2350 | 2429 |
| Kat | 2485 | 2332 | 2378 |
| Dzwonnik | 2400 | 2501 | 2398 |
| Woskownica | 2385 | 2279 | 2252 |
| Tancerka | 1939 | 2496 | 2072 |

Rozrzut między przebiegami wynosi około ±10%. Tancerka była około 20% za resztą, teraz jest około 5%.

## Wdrożone w 853: skalowanie nocy (zgoda autora 22.11, rola gamedev)
- Liczba wrogów: funkcja `nightPop()` w części 10.
  - Od startu około 20 wrogów, potem tłum rośnie przez całą noc do około 42.
  - Wcześniej było około 5 na starcie i stałe około 34 od 3. minuty.
- Życie zwykłych wrogów: funkcja `nightHp()` w części 13, wzór `0,6 + 2,4·(t/noc)^1,6`.
  - Daje ×0,6 na starcie, ×0,86 w 4. minucie, ×1,39 w 8., ×2,11 w 12. i ×3,0 na koniec nocy.
  - Wcześniej wzrost był liniowy: od ×0,8 do ×2,72.
- Elity: czwarta pojawia się w 14:30 (w pierwszej nocy w 14:40).

### Bot po zmianie (obrażenia otrzymywane na sekundę)

| Minuta | 2 | 4 | 6 | 10 | 12 | 14 | 16 |
|---|---|---|---|---|---|---|---|
| Rycerz (853) | 7 | 9 | 12 | 26 | 24 | 33 | 33 |
| Rycerz (852) | 8 | 15 | 18 | 23 | 25 | 25 | 24 |

- Wcześniej obrażenia przestawały rosnąć od mniej więcej 9. minuty. Teraz pierwsza połowa nocy jest lżejsza, a końcówka cięższa, i ten wzór widać u wszystkich klas.
- Poziom na koniec nocy wynosi 25–26, bez zmiany.
- Zabójstw jest około 2150–2320, o około 5% mniej, bo wrogowie pod koniec są twardsi.

## Wdrożone w 854: reakcje żywiołów (zgoda autora 22.11, rola gamedev)
Para żywiołów gracza (najwyżej 2; ogień i lód się wykluczają) daje jeden efekt łączony:

| Para | Reakcja | Działanie |
|---|---|---|
| Ogień + Trucizna | Opary | Płonący i zatruty wróg wybucha chmurą; sąsiedzi w promieniu 46 dostają truciznę. Odnowienie 3 s na wroga. |
| Ogień + Krew | Wrzątek | Krwawienie na płonącym wrogu ×1,5. |
| Lód + Trucizna | Szron | Zatruty i schłodzony wróg ma spowolnienie wydłużone do 5 s (raz na wroga). |
| Lód + Krew | Kruche Żyły | Silny cios w schłodzonego, krwawiącego wroga: reszta krwawienia ×1,5 od razu, a sąsiedzi w promieniu 40 dostają krwawienie. Odnowienie 2 s. |
| Trucizna + Krew | Zakażenie | Śmierć zatrutego i krwawiącego wroga przenosi oba efekty na sąsiadów w promieniu 48. |

Kod:
- część 12: `RX`, `elementReact()`, `rxBoil()`, `rxInfect()`, `rxCardLine()`; `applyEnchants()` woła teraz `applyEnchants0()` i `elementReact()`;
- część 13: tik krwawienia i `killEnemy()`;
- część 14: linia „Reakcja (X + Y): …” na karcie drugiego żywiołu zastępuje „Łączy się z 1 innym żywiołem”;
- część 27: styl `.rxb`.

Test w przeglądarce: każda z 5 reakcji wywołana ręcznie działa bez błędów; karta wyświetla się poprawnie (zrzut).

Uwaga DROBNA, istniejąca wcześniej i nieruszana: opis ostrza wspierającego pokazuje „Lód: spowolnienie 15%” także na kartach Trucizny i Krwi, a podział na punkty rozcina zdanie „Bez znaków, finiszera i premii miecza”.

## Symulacja rozdziałów II–VI oraz trudności Łatwy i Trudny (na 855)
Bot jak wcześniej: Rycerz, lekkie ataki, nieśmiertelny. Liczby to obrażenia otrzymywane na sekundę.

| Przebieg | 2 min | 8 min | 12 min | 16 min | Poziom | Zabójstwa |
|---|---|---|---|---|---|---|
| I Normalny (853) | 7 | 16 | 24 | 33 | 26 | 2324 |
| II Normalny | 8 | 25 | 33 | 44 | 27 | 2426 |
| III Normalny | 9 | 17 | 25 | 30 | 24 | 2408 |
| IV Normalny | 14 | 28 | 32 | 44 | 27 | 2351 |
| V Normalny | 12 | 26 | 44 | 49 | 30 | 3239 |
| VI Normalny | 17 | 30 | 45 | 57 | 33 | 2771 |
| I Łatwy | 5 | 7 | 10 | 15 | 24 | 1917 |
| I Trudny | 11 | 26 | 23 | 31 | 28 | 2592 |
| I Trudny, Tancerka | 16 | 29 | 41 | 58 | 27 | 2289 |
| VI Normalny, Tancerka | 27 | 51 | 76 | 77 | 30 | 1938 |

Mapowanie: w kodzie CH 6 to rozdział III, CH 3 to IV, CH 4 to V, CH 5 to VI.

Wnioski:
1. **Krzywa nocy działa we wszystkich rozdziałach.** FAKT z symulacji. W każdym rozdziale trudność rośnie od startu do końca nocy, a kolejne rozdziały są coraz cięższe (koniec nocy: od 33 w I do 57 w VI). Taki kształt jest zamierzony.
2. **Rozdział III: bot nie kończy nocy.** Po pokonaniu Bosmana gra czeka, aż gracz otworzy przejścia i wypłynie promem (`portDepart`). To cel rozdziału, nie błąd.
3. **Trudny w rozdziale I jest niewiele trudniejszy od Normalnego.** FAKT z symulacji, ale wyniki mają duży rozrzut. Trudny daje +15% doświadczenia i +12% wrogów, więc bohater rośnie szybciej (28 poziom zamiast 26) i część trudności się znosi. Do decyzji autora: zdjąć premię XP na Trudnym albo podnieść tam obrażenia wrogów.
4. **Łatwy jest wyraźnie łatwy:** około połowy obrażeń z Normalnego. Bez uwag.
5. **Tancerka w VI dostaje bardzo dużo:** 77/s przy 80 HP. Bot nie robi uników, a to jej główna obrona, więc to PRZYPUSZCZENIE do sprawdzenia na żywo.

## Wdrożone w 856 (zgoda autora 22.11, rola gamedev)
- **Zestawy stylów w dwóch krokach:** 4 karty z gałęzi dają małą premię, 7 kart pełny zestaw (wcześniej 8).
  - Obrońca: −6% otrzymywanych obrażeń.
  - Zabójca: szybkie ataki +6% obrażeń.
  - Mistrz fal: fale +12% obrażeń.
  - Na karcie pojawia się „Włącza premię zestawu!”, a w podglądzie rozwoju obie premie.
  - Instrukcja: opis zaktualizowany.
- **Techniki aktywne korzystają ze stanów wrogów:**

  | Klasa | Technika | Warunek | Efekt |
  |---|---|---|---|
  | Rycerz | Wypad | zmrożony wróg | +50% obrażeń, pęknięcie spowalnia sąsiadów |
  | Kat | Atak z doskoku | krwawiący wróg | +40% obrażeń |
  | Tancerka | Rozszarpanie | zatruty wróg | +30% obrażeń, dłuższa trucizna |
  | Dzwonnik | Echo Żałoby | ogłuszony wróg | +50% obrażeń |
  | Woskownica | Odlew Skazańca | płonący wróg | +40% obrażeń, dłuższy ogień |

  Kod: `SKST` i `skStatusMul()` w części 12, wywołanie w `damageEnemy()` w części 13.
