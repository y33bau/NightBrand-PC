# HUD PC według referencji — 10.11.2026

Gałąź `runda-hud-pc-1`, utworzona od `origin/main` (`22f6922`) z przeniesionymi rundami menu 563–569. Cache nadany przez `wydaj.py`: **nightbrand-codex-20261110-570**. SHA-256 zbudowanego JS: `4b63db367d89f63d1d3d766f21a740df7dd37f865325ce1a70fa85a4b99c3996`.

Nowa oprawa HUD dla jednego gracza na PC: szklana kula zdrowia po lewej i many po prawej, lustrzane cierniowe obręcze, centralny medalion rzeczywistego poziomu Nocy, cztery kwadratowe aktywne sloty, dwa sloty zaklęć ostrza, podpowiedzi ataku/bloku, cienkie paski staminy i EXP. Opcjonalny piąty aktywny slot pozostaje dostępny po odblokowaniu. U dołu obok zdrowia są prawdziwe Monety (`S.coins`) i Popioły (`EMB.e`), zgodnie z decyzją autora zamiast mikstur ze wzoru. Żadnych fikcyjnych przedmiotów, liczb ani mechanik.

Zegar jest na środku u góry; komunikaty pod nim, minimapa w nowej kwadratowej ramie z okrągłym otworem w prawym rogu. Statusy przy manie zachowują pełne opisy i pozostały czas w podpowiedziach. Dwa zaklęcia pokazują prawdziwe ikony i poziomy; pozostała technika z dawnego paska pozostaje przy statusach. Pasek bossa ma osobne miejsce ponad listwą umiejętności, z zachowaniem życia i postury. Większy tekst zmienia litery, bez powiększania całego układu.

Sześć elementów oprawy wygenerowano narzędziem `image_gen` jako osobne przezroczyste PNG. Oryginały i dokładne prompty są w `zrodlo/ui-pc/hud-reference/`. Niczego nie wycinano z koncepcyjnego zrzutu; obraz gry jest renderowany normalnie. PNG skopiowano bez zmiany pikseli, a składanie i kadrowanie atlasu wykonuje CSS. Zasoby dodane wyłącznie przez `wydaj.py dodaj`.

Kod zmieniono tylko w `26_start_petla.js`: osobna klasa `.pc-hud`, warstwa prezentacji czytająca stan gry, oraz wyłączenie dawnego wyrównywania bossa do slotów podczas działania nowej oprawy. Natywne przyciski aktywnych umiejętności, ich zdarzenia, koszty, odnowienia i klawisze pozostają te same. Nie zmieniono walki, balansu, zapisu, start/newGame/openPrep/applyPrep, shaderów ani sterowania dotykowego. Dotyk, pion i tryb dwóch graczy zachowują poprzednią oprawę; `?pchud=0` przywraca ją również na PC. Wydanie 570 zawiera wcześniejsze zaakceptowane zmiany menu.

Sprawdzenie:

- PL 1920×1080 i EN 1280×720: rzeczywiste ekrany gry, proporcje, odczyty zasobów, umiejętności z kosztami/odnowieniami, dwa zaklęcia, piąty slot, osiem statusów i pasek bossa. Kontrolowane stany utworzono tylko w odpowiedzi testowej przeglądarki, bez haków w produkcyjnym JS i bez zapisu autora.
- Mysz i klawiatura: aktywacja natywnego slotu rzeczywiście zużywa staminę i rozpoczyna odnowienie. Pauza ukrywa nową oprawę, ESC ją przywraca. Większy tekst 130% i długi opis zegara mieszczą się. Sprawdzono przełączenie na poprzednią oprawę dla dotyku, trybu dwóch graczy i pionu 390×844, powrót do poziomu oraz `?pchud=0`. To sprawdzenie przełączania widoku, nie pełny test dwóch graczy.
- Build, `node --check`, `git diff --check`: OK. `sprawdz.py`: **WYNIK OK, 0 uwag**, 0 brakujących tłumaczeń HTML. `node narzedzia/dymny.js gra 1 8781`: **rozdzial 1 OK / WYNIK OK**. Znane informacje walidatora o starym loaderze i manifeście są sprzed tej rundy.

Gotowa gra: **106 589 527 B / 715 plików**, poniżej 150 MB. ZIP lokalny: `NightBrand_PC_HUD_570.zip`, integralność archiwum OK. Odczyt zdalnego main po sprawdzeniu: nadal `22f6922b6e9c339ca2d5d95554615ea8cafbf816`.

Nie sprawdzono fizycznego pada, odsłuchu, pełnych nocy, gry na telefonie ani pełnej rozgrywki dwóch graczy. Brak publikacji na main i zmian w repo mobilnym. Galeria, zrzuty oraz lokalna kopia gry: `output/NightBrand_PC_HUD/` w głównym katalogu roboczym autora.
