# HUD PC — oprawa według referencji autora

Sześć oryginalnych PNG wygenerowanych narzędziem `image_gen` 10.11.2026 na podstawie obrazu przekazanego przez autora (`codex-clipboard-c041c4fd-2f6b-45d7-9066-dc29aeafef39.png`). Każdy komponent wygenerowano oddzielnie z `transparent_background: true`, z referencją jako `referenced_image_paths`. Dokładne prompty znajdują się w `prompty.json`.

Pliki skopiowano bez przetwarzania pikseli. Przezroczystość mierzono tylko do odczytu w przeglądarce. Kadrowanie atlasu szklanych kul i złożenie listwy wykonuje CSS; napisy, wartości, wypełnienia i ikony pozostają oddzielnymi warstwami gry.

| Plik | Oryginalny rozmiar | Zastosowanie |
|---|---|---|
| orb-frame.png | 1254×1254 | Ta sama obręcz dla obu kul, odbicie prawej w CSS |
| orb-glass-atlas.png | 1774×887 | Zdrowie i mana; ubytek zasobu odsłania ciemne szkło |
| action-rail.png | 2172×724 | Cierniowa listwa i medalion prawdziwego poziomu nocy |
| slot-frame.png | 1254×1254 | Aktywne sloty, zaklęcia, waluty, statusy i podpowiedzi ataku/bloku |
| clock-frame.png | 1254×1254 | Centralny zegar z czasem i opisem etapu z gry |
| minimap-frame.png | 1254×1254 | Obręcz wokół istniejącego płótna minimapy |

Dodanie zasobów do gotowej gry: `wydaj.py dodaj`. SHA nazw w `gra/assets/` odpowiadają oryginalnym plikom. Prezentacja jest w `26_start_petla.js`; przełącznik `?pchud=0` przywraca poprzedni wygląd. Dotyk, pion i tryb dwóch graczy korzystają z dotychczasowego HUD.

Miejsca mikstur ze wzoru zajmują prawdziwe liczniki monet (`S.coins`) i Popiołów (`EMB.e`), zgodnie z decyzją autora. Stamina i EXP są osobnymi cienkimi paskami. Zachowano opcjonalny piąty aktywny slot oraz wszystkie opisy statusów w podpowiedziach. Żaden PNG nie zawiera liczb ani gotowego ekranu gry.
