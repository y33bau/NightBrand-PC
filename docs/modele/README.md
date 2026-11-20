Stan na 2026-11-20, cache 833, rola grafik

# Modele rekwizytów z Blendera

Rekwizyty o prostym kształcie są w grze modelami 3D: partia 1 (beczka, głaz, pień z siekierą, ul, kurhan, stos drewna, studnia) w `potok.py`, partia 2 (sarkofagi rozdz. II i IV, kowadło, wózek kopalniany, skrzynia, nagrobek, krzyż na grobie, namiot, misa ofiarna, ława) w `partia2.py` (`assets/rekwizyty/*.glb`). Kod: `zrodlo/main/06_three_siatki_rozdzialow.js` (`P3D_GLB`, `P3D_MAP`, `paint3dFinish`).

Jak to działa:
- Model w `.glb` ma tylko kształt, normalne i wypalone cienie (kolory wierzchołków). Nie ma tekstury.
- Gra nakleja malunek z obrazka rekwizytu (np. `p4_mossy_boulder`), rzucając go z kąta kamery (`PITCH`). Z widoku gracza model wygląda jak dawny obrazek, a ma bryłę.
- Model nie może się obracać, bo rzut by się rozjechał. Odbicie lustrzane (`flip`) działa.
- Model jest skalowany tak, by jego obrys z kamery miał szerokość obrysu malunku. Stoi w miejscu dawnego obrazka.
- Przed: `?rek3d=0` (tylko lokalnie).

Jak zrobić lub poprawić model:
1. `python3 -m venv /tmp/bl && /tmp/bl/bin/pip install bpy scipy pillow numpy` (Blender jako moduł Pythona, bez okna).
2. W `potok.py` dopisz funkcję modelu i wpis w `MODELE` (nazwa: klucz obrazka, funkcja). Punkty z malunku ustawia `Frame.at(gx, gy, głębokość)` (ułamki obrazka).
3. `/tmp/bl/bin/python potok.py -- NAZWA` → `/tmp/blend/out/NAZWA.glb`; podgląd z kamery gry i z boku: `/tmp/bl/bin/python podglad.py -- NAZWA` (`NAZWA_porownanie.png`).
4. `python3 narzedzia/wydaj.py dodaj gra PLIK.glb rekwizyty leniwy`, nowy adres wpisz do `P3D_GLB`, stary plik usuń (`wydaj.py usun`).

Rzut z kamery działa też dla rekwizytów namalowanych w perspektywie. Bez sensu albo za trudne: koła (prawie płaskie), dyby (model czarny i nieczytelny), gruz z filarem, pęknięty dzwon, miechy, postacie, ognie (animowane), drzewa, kamienie runiczne (zapalane).
