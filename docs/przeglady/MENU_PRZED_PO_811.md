Stan na 2026-11-17, cache 811, rola gamedev

# Porządki menu 811: dowód, że wygląd się nie zmienił
- Zmiana: prefiksy `'#orient'.repeat(N)` w częściach 26 i 27: 400/300/260 → 255, 220 → 110, 150 → 100, 140 → 90, 130 → 80 (27), 110 → 70 (26).
- Dlaczego bez zmiany wyglądu: Chromium liczy najwyżej 255 identyfikatorów w selektorze (sprawdzone testem: 256 i 1000 dają tę samą siłę co 255). Niższe grupy przesunięte z zachowaniem kolejności; sprawdzone skryptem na wszystkich 4547 regułach po starcie gry: kolejność i remisy siły selektorów identyczne przed i po.
- Efekt: style menu tworzone przy starcie 2,77 MB → 2,12 MB tekstu (−0,65 MB do przetworzenia przy każdym uruchomieniu).
- Zrzuty 1920×1080 przed (810) i po (sama zmiana prefiksów), 29 ekranów: menu główne, Opcje (5 zakładek + 3 podzakładki), Instrukcja (7 zakładek), Kaplica, Kronika, Ognisko, Mapa, Przygotowanie, HUD, Pauza (3), Awans. 24 ekrany: 0,000% różnych pikseli. 5 ekranów z różnicą tylko w animacjach (iskry, oddech posągów, ogień, postać) i w losowo wylosowanych kartach awansu; ramki, napisy i układ identyczne. Szum pomiaru: dwa przebiegi tej samej wersji 810 dają tę samą różnicę na menu głównym (iskry).
- Nie sprawdzono: Firefox (liczy do 1023 identyfikatorów, więc dotąd mógł wyglądać inaczej niż Chromium; teraz zachowuje się jak Chromium), ekrany poza listą (koniec nocy, kram, dialogi, kooperacja, EN).
