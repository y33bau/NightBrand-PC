# Graj i wspólny powrót — 10.11.2026

Gałąź `runda-menu-pc-7` od `origin/main` (`22f6922`) z przeniesionymi rundami 1–6. Cache nadany narzędziem: **nightbrand-codex-20261110-569**. Main i repo mobilnego nie zmieniono.

- Jedno wejście **Graj / Play** zastępuje Kontynuuj/Podróż. Kolejność: menu → Wybór rozdziału / Act selection → przygotowanie postaci, perków i wyzwań → Gotowy. Zapamiętywany jest ostatni wybrany rozdział; postać korzysta z dotychczasowego zapisu. Nie dodano zapisu trwającej nocy. Pad przy pierwszym fokusie map wybiera zaznaczony rozdział zamiast zawsze rozdziału I.
- Stopka map ma trzy równe strefy: para Kaplica/Kronika, wyśrodkowany tryb, Przygotuj się. Kontury i wysokości przycisków są dopasowane; różnica górnych krawędzi poniżej 0,02 px. Menu główne ma wyraźny obramowany powrót. Koło zębate powiększono do 52 jednostek, obszar kliknięcia do 80; bez kwadratowego tła, obramowania i podświetlenia prostokątem.
- Wybrana mapa ma bordowy kontur całej ilustracji. Brak banerów i pseudoelementów pod nazwą. Ilustracje, statusy rozdziałów, rekordy i mały złoty znak wyboru pozostają prawdziwe, z gry.
- Jeden dyspozytor menu obsługuje ESC, B i przyciski powrotu. Najpierw zwalnia obsługę suwaka lub zamyka rozwiniętą opcję, potem cofa ekran. Potwierdzenie wraca do Opcji; Opcje/Instrukcja/Kaplica wracają do miejsca otwarcia; przygotowanie do map, mapy do menu. W pauzie ESC/B wznawia grę. Przytrzymany ESC nie przeskakuje wielu poziomów. Obowiązkowy wybór karty i zasady rozmów/wstępu pozostają bez zmian.
- Nowy atlas czterech napisów PL/EN wygenerowano przez wbudowane `image_gen`, na podstawie zatwierdzonej rodziny liternictwa. Oryginalny PNG skopiowano bez przetwarzania do `zrodlo/ui-pc/gotycki/graj-wybor-atlas.png`, dokładny prompt do `graj-prompty.json`, pomiary przezroczystości do `graj-atlas-map.json`. Zasób dodało `wydaj.py dodaj`; kod czyta obszary przez CSS, nie wycina planszy koncepcyjnej.

Źródła: tekst PL/EN w `01_start_jezyk.js`, prezentacja i menu w `26_start_petla.js`, wyłącznie przekazanie B i początkowy fokus menu w `24_pad_samouczek_bledy.js`. Nie zmieniono `start`, `newGame`, `openPrep`, `renderPrep`, `applyPrep`, balansu, HUD, shaderów ani kodu dotyku. `padNav` i obsługa pada w walce zachowane. Rodzina graficzna nadal wyłącza się przez `?pcgfx=0`; cała warstwa PC przez `?pcmenu=0`.

Sprawdzenie rzeczywistych ekranów: PL 1920×1080, EN 1280×720 z tekstem 130%; Graj, zapamiętanie mapy/postaci, wybór rozdziału i kontur, brak kwadratu ustawień, osie/stopka, ESC w potwierdzeniu/Opcjach/Kaplicy/Kronice/Instrukcji/języku/przygotowaniu i mapach: OK. B sprawdzono także przez symulowane `navigator.getGamepads` i prawdziwy kod odczytu wejścia (po blokadzie przejścia): rozwinięta opcja → przygotowanie → mapy → menu. **Nie jest to fizyczny pad.** Brak błędów strony.

Kontrolowany przegląd gry potwierdził powrót Opcje → pauza bez wznowienia, następne ESC → gra, wznowienie dyspozytorem B oraz brak pomijania wyboru karty. Dostęp testowy do funkcji był wyłącznie w odpowiedzi przeglądarki, bez haków w produkcyjnym JS. Zapis autora nietknięty.

Build, `node --check`, `git diff --check`: OK. `sprawdz.py`: **WYNIK OK, 0 uwag**, 0 brakujących tłumaczeń HTML. Gra **100 140 800 B / 709 plików**, poniżej 150 MB. SHA-256 JS: `f18a449f9ec33b8a55a4dd62ea1e9a4a442df0561b292919bef701d026a9e673`. Informacje walidatora o starym JS i manifeście były obecne przed rundą.

Nie sprawdzono fizycznego pada, odsłuchu, pełnych nocy, drugiego pada, telefonu ani itch.io. Galeria i paczka lokalna: `output/NightBrand_PC_GRAJ/`. W „Test wersja PC.bat” wybierz `runda-menu-pc-7`. Main nie publikowano.

Końcowy `node narzedzia/dymny.js gra 1 8781`: **rozdzial 1 OK / WYNIK OK**. Krótki start rozdziału i zmiana jakości, nie pełna noc.
