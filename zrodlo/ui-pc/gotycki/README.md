# Gotycki standard menu PC

Zatwierdzony przez autora 10.11.2026. Czerń węgla, ciepła kość słoniowa, cienki przygaszony mosiądz i bordowe zaznaczenie. Ozdoby mają pozostać delikatne. Logo, ilustracje rozdziałów i ikony walut pochodzą z gry.

Sześć nowych, osobno wygenerowanych PNG stanowi materiały produkcyjne. Nie wycinano elementów z planszy koncepcyjnej. `prompty.json` zachowuje dokładne opisy generowania, `atlas-map.json` rozmiary i pomiary przezroczystości. Oryginały RGBA pozostają nieprzetworzone; odpowiedniki w `gra/assets/` dodało `wydaj.py dodaj`.

- `menu-atlas.png`: dwie kolumny PL/EN, sześć wierszy — Kontynuuj, Podróż, Kaplica, Kronika, Instrukcja, Opcje.
- `naglowki-atlas.png`: dwie kolumny PL/EN, osiem wierszy — przygotowanie, Kaplica Popiołów, pauza, Kram Margi, Przygotuj się, Gotowy, Fabularny, Arcade.
- `przycisk.png`, `przycisk-wybrany.png`: tła przycisków bez napisów; drugi wariant sygnalizuje fokus lub wybór.
- `ramka-panel.png`: przezroczysty środek; cienka ramka rozciągana przez CSS border-image.
- `separator.png`: delikatna linia z ornamentem.

Warstwa w `zrodlo/main/26_start_petla.js` wybiera obszary atlasów przez pozycję tła CSS. Same PNG nie są cięte ani rozciągane w nierównych proporcjach liter. Graficzne napisy zachowują dostępne nazwy przycisków. Opisy, nagrody, poziomy, ceny i komunikaty ładowania pozostają prawdziwym tekstem gry. Zakładki używają istniejącego fontu Grenze Gotisch; treść ma zachować czytelność.

Przełączniki porównania: `?pcgfx=0` przywraca poprzedni wygląd PC (566), `?pcmenu=0` wyłącza całą warstwę PC. Nowe reguły są ograniczone klasą `.pc-gfx`, nie obejmują HUD-u rozgrywki.

Podgląd PNG należy oceniać w przeglądarce na ciemnym tle: niektóre podglądarki błędnie prezentują kolory w półprzezroczystych pikselach. W grze zweryfikowano rzeczywiste renderowanie i polskie znaki.
