# Gotycki standard menu PC — 10.11.2026

Gałąź `runda-menu-pc-5`, utworzona od `origin/main` (`22f6922`) z przeniesionymi zaakceptowanymi rundami 1–4. Cache nadany narzędziem: **nightbrand-codex-20261110-567**. Main i repo mobilnego nie zmieniono.

- Wdrożono zatwierdzony kierunek: graficzne gotyckie liternictwo PL/EN dla menu tytułowego i głównych nagłówków, tła przycisków w kolorze węgla i bordo, cienkie mosiężne ramki oraz separatory. Zakładki używają istniejącego Grenze Gotisch, opisy zachowują czytelny tekst.
- Wspólna rodzina obejmuje menu tytułowe, Podróż, przygotowanie, Kaplicę/Kronikę, Opcje, Instrukcję, pauzę, awans, handel, podsumowania i potwierdzenia. Zachowano ilustracje miejsc, logo tytułowe, oryginalne ikony i autorski alfabet nagłówków zwycięstwa/porażki. Przygotowanie nie ma dodatkowego logo.
- Sześć materiałów produkcyjnych wygenerowano osobno: dwa atlasy napisów, dwa warianty przycisku, ramkę i separator. Nie wycinano koncepcji. Oryginały, dokładne prompty i pomiary zapisano w `zrodlo/ui-pc/gotycki/`. Do gry dodało je `wydaj.py dodaj`; renderowane są nienaruszone PNG przez CSS.
- Teksty gry, ceny, nagrody, waluty, poziomy i komunikaty ładowania pozostają dynamiczne. Graficzne napisy zachowują nazwy dostępności przycisków. Ramki nie przechwytują kliknięć. Istniejące funkcje, padNav, kod dotyku, zapis, balans, HUD i paski bez zmian.
- Warstwa jest oddzielona klasą `.pc-gfx`. `?pcgfx=0` przywraca wygląd PC 566, `?pcmenu=0` wyłącza całą warstwę PC. Oba przełączniki sprawdzono. Bez nowych shaderów i zmian mechanik.

Sprawdzenie rzeczywistych ekranów: PL 1920×1080, EN 1280×720, dodatkowo EN 1280×720 z tekstem 130%; brak błędów strony. Sprawdzono mysz, Enter/strzałki/Escape, wybór właściwego rozdziału, przełącznik dwóch graczy, powrót z Opcji, zmianę trybu, obecność obu ikon nagród oraz potwierdzenie z anulowaniem. B wraca do menu przez prawdziwą obsługę Gamepad API z symulowanym kontrolerem — **bez fizycznego pada**.

Pauzę (pięć zakładek), awans, sklep i oba podsumowania obejrzano w kontrolowanym przeglądzie interfejsu. Test otwiera te stany wyłącznie w odpowiedzi lokalnej przeglądarki; pliki produkcyjne nie zawierają dostępu testowego do funkcji gry. To nie jest test pełnej nocy. Zapis autora nie jest używany ani zmieniany.

Build, `node --check` i `git diff --check`: OK. `sprawdz.py`: **WYNIK OK, 0 uwag**, 0 brakujących tłumaczeń HTML. Folder gry: **99 430 547 B, 708 plików**, poniżej 150 MB. SHA-256 JS: `4a95c551c116ffea70445891213f4e0fb6ab3c6e789e959cb4670838b84a17f4`. Informacja o starym JS poza manifestem była obecna przed tą rundą.

Końcowy `node narzedzia/dymny.js gra 1 8781`: **rozdzial 1 OK / WYNIK OK**. Sprawdzono krótki start rozdziału i zmianę jakości, nie całą noc.

Nie sprawdzono fizycznego pada, odsłuchu, pełnych nocy, gry na drugim padzie, telefonu ani itch.io. Galeria porównań, zrzuty i lokalna paczka do oceny: `output/NightBrand_PC_GRAFICZNY_STANDARD/`. W istniejącym „Test wersja PC.bat” wybierz `runda-menu-pc-5`. Nie publikowano main.
