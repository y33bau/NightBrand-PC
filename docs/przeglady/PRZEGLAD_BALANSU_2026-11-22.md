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
