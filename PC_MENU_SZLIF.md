# Szlif menu PC — 10.11.2026

Gałąź `runda-menu-pc-3` od aktualnego `origin/main` (`22f6922`), z przeniesionymi zaakceptowanymi zmianami rund 1–2. Mobilnego repo i main nie zmieniano. Cache nadany przez narzędzie wydania: `nightbrand-codex-20261110-565`.

- Nagłówki stron: **Grenze Gotisch**, już dostarczany z grą, na postrzępionej bordowej tkaninie. Mniejsze nagłówki sekcji też mają gotycki krój, kolor i separatory; opisy zachowują spokojniejszą typografię.
- Logo usunięte tylko z przygotowania, zgodnie z ostatnią decyzją autora. Zyskane miejsce przeznaczono na listy. Logo głównego menu pozostaje.
- Naprawiony panel szczegółów wyzwań/klątw: wcześniejsze kopiowanie `textContent` usuwało ikony walut. Teraz zachowuje tożsamość ikon i **oryginalne wartości** nagród. W szczegółach osobne ikony + Popioły/Monety (Ashes/Coins); ikony są również na liście. Liczby i zasady nagród bez zmian.
- Kronika: złota gwiazda zamiast żółtego kwadratu z liczbą. Liczba nowych wpisów pozostaje w podpowiedzi i etykiecie dostępności; mechanizm wykrywania/przeczytania wpisu bez zmian. Obserwacja uwzględnia przycisk tworzony dopiero po wczytaniu gry.
- Pauza: cztery wyraźne miejsca na umiejętności. Przy zdobytych umiejętnościach sloty i rezerwa są obok siebie. Pusty stan ma krótki wydzielony opis; nieaktywny przycisk opróżnienia całkiem pustego wyposażenia jest ukryty. Reorganizacja zachowuje fokus po ponownym wyrenderowaniu, również dla klawiatury/padNav.
- Ustawienia/Grafika: rzeczywiste kontrolki zgrupowano pod ich istniejącymi nagłówkami, z wyrównanymi separatorami i krótszymi wierszami. Elementy i ich obsługa zachowane; suwaki, rozmiar tekstu, dotyk i sterowanie nie zostały usunięte.
- Zmiany źródłowe tylko w `01_start_jezyk.js` (tłumaczenia) i warstwie prezentacji `.pc-menu` w `26_start_petla.js`. Nie zmieniono `start`, `newGame`, `openPrep`, `applyPrep`, `renderPrep`, mechaniki wyposażenia ani balansu. Nie dodano nowych zasobów, fontów ani shaderów. `?pcmenu=0` nadal wyłącza nową warstwę.

Przegląd: PL 1920×1080 i EN 1280×720, cztery rodzaje ekranów (menu, przygotowanie, opcje, pauza), warianty wyzwań/klątw oraz pustych/zajętych slotów. 12 zrzutów. Potwierdzono rzeczywiste wczytanie Grenze Gotisch; font się nie zastępuje zwykłym krojem. Nagrody zachowują +50 Popiołów / +60 monet oraz +25% Popiołów w kontrolowanym przykładzie. Regulacja tekstu 130% działa. Wybór umiejętności sprawdzono również przez Enter i zachowanie fokusu po przełożeniu. Badanie stanu z umiejętnościami używało istniejących funkcji w izolowanej sesji testowej; tymczasowy dostęp do nich był tylko w odpowiedzi sieciowej przeglądarki testowej, nie w zapisanej grze. Zapis autora nietknięty.

Nie sprawdzono fizycznego pada, odsłuchu, telefonu, pełnych nocy ani itch.io. Runda jest do oceny autora, nie jest publikacją main. Galeria i lokalna paczka znajdują się poza repo: `output/NightBrand_PC_SZLIF/`. W „Test wersja PC.bat” wybierz `runda-menu-pc-3`.

Wynik: build i `node --check` OK; `sprawdz.py` **WYNIK OK, 0 uwag**; przegląd PL/EN bez błędów strony, ikony i nazwy nagród widoczne, zmiana slotu przez Enter i zachowanie fokusu OK. SHA-256 JS: `4bc90a1ec92d4bc23ca10668adf67daacfcd01a4a086b1a6685bbbd8ce5a293b`. Folder gry: **93 542 371 B, 702 pliki**. Wcześniejsza informacja o starym JS poza manifestem pozostaje bez zmian (nie jest błędem/uwagą kontroli).

Końcowy plik: `node narzedzia/dymny.js gra 1 8781` zakończył **rozdzial 1 OK / WYNIK OK**. Test obejmuje krótki start i przełączanie ustawień grafiki; nie oznacza przejścia pełnej nocy.
