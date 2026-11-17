# Podróż PC — 10.11.2026

Gałąź `runda-menu-pc-4` od `origin/main` (`22f6922`) z przeniesionymi zaakceptowanymi rundami 1–3. Cache nadany przez narzędzie: **nightbrand-codex-20261110-566**. Main i mobilnego repo nie zmieniono.

- Podróż ma własny gotycki nagłówek, pionowy wybór pięciu rozdziałów i dużą ilustrację wybranego miejsca. Zachowano istniejące przyciski, blokady i funkcję przygotowania. Nazwy, ilustracje i dostępność są prawdziwe, z gry.
- Zniknął prawy panel z portretem/klasą/EXP. **Popioły i poziom** są razem w czytelnym pasku u góry, również na ekranie tytułowym. Wartości pochodzą z `EMB.e` i `prog().lv`; odświeżają się m.in. po zakupie w Kaplicy. Nie zmieniono waluty ani postępu.
- Podróż udostępnia Kaplicę i Kronikę, a Opcje są pod oryginalnym kołem zębatym z gry. Instrukcja jest w menu głównym. Nie dodano sklepu poza nocą ani nowej mechaniki zakupów.
- Wybór Fabularny/Arcade pozostaje **tylko na ekranie tytułowym**, jako dwa spójne z oprawą przełączniki z ikonami, opisem i znacznikiem wyboru. Podróż pokazuje wyłącznie informację o aktywnym trybie.
- Przy ilustracji są istniejący status rozdziału, najdłuższy zapisany czas i rekord zabójstw. Brak zapisu pokazuje kreskę, bez wymyślonych statystyk. Stan pochodzi z `SETT.save` i oryginalnego wyboru rozdziału.
- Przycisk „Przygotuj się” otwiera oryginalne przygotowanie wybranego rozdziału. Sterowanie dotykowe ukryto w nowym menu PC, zachowując kod i samą kontrolkę. Istniejący przełącznik 2 graczy przeniesiono do Przygotowanie → Ustawienia, z zachowaniem obsługi.
- Escape i B w Podróży wracają do menu głównego. `padNav` zachowano, dodając tylko ten powrót; kod walki i przyciski pada podczas rozgrywki bez zmian. Warstwa nadal wyłącza się przez `?pcmenu=0`.
- Bez zmian `start`, `newGame`, `openPrep`, `renderPrep`, `applyPrep`, zapisu i balansu. Brak nowych zasobów, shaderów i fontów. Źródła: `01_start_jezyk.js`, prezentacja w `26_start_petla.js`, powrót B w `24_pad_samouczek_bledy.js`. Dymny wybiera teraz Arcade na widocznym ekranie tytułowym przed wejściem w Podróż.

Sprawdzenie przeglądarkowe: PL 1920×1080 oraz świeży PL 1280×720, EN 1280×720, dodatkowo tekst 130%. Wybór myszą/strzałkami, właściwy rozdział w przygotowaniu, przełącznik dwóch graczy, powrót z Opcji, ubycie Popiołów po zakupie w Kaplicy i zmiana trybu: OK. Symulacja Gamepad API potwierdziła B po zakończeniu blokady wejścia; **nie jest to test fizycznego pada**. Brak błędów strony. Przykładowy dodatni profil w części zrzutów jest kontrolowanym zapisem testowym (1487 Popiołów, poziom 6), nie zapisem autora. Świeże zrzuty pokazują 0 Popiołów / poziom 1. Nie wstrzykiwano dostępu do funkcji gry do kodu produkcyjnego ani odpowiedzi JS.

Build i `node --check` (gra i dymny): OK. `sprawdz.py`: **WYNIK OK, 0 uwag**, 0 brakujących tłumaczeń HTML. Folder gry: **93 560 053 B, 702 pliki**, poniżej 150 MB. SHA-256 JS: `430d2052db17cb9521a11a24568dd8d551129082da7d4516016a9dddad2c109b`. Wcześniejsza informacja kontroli o starym JS poza manifestem pozostaje bez zmian.

Nie sprawdzono fizycznego pada, dźwięku, pełnych nocy, rozgrywki na drugim padzie, telefonu ani itch.io. Galeria i paczka do oceny autora: `output/NightBrand_PC_PODROZ/`. W istniejącym „Test wersja PC.bat” wybierz `runda-menu-pc-4`. Main nie publikowano.

Końcowy test `node narzedzia/dymny.js gra 1 8781`: **rozdzial 1 OK / WYNIK OK**. Obejmuje krótki start i zmianę jakości grafiki, nie całą noc.
