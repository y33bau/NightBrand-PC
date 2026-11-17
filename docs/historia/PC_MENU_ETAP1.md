# Menu PC — etap 1

Gałąź `runda-menu-pc-1`, baza main `22f6922`, cache bazowy 562. Nowy build: cache 563.

- Dwa ekrany: centralne menu główne i przygotowanie (postać, perki, istniejące wyzwania i klątwy). Pozostałe widoki zachowują dotychczasową kompozycję.
- Wyłącznie istniejące logo, ilustracja Spalonej Osady, portrety, ikony, treści i liczby. Nie użyto wycinków plansz koncepcyjnych.
- `.pc-menu` na `#orient` jest przełącznikiem stylu. `?pcmenu=0` przywraca stary wygląd po przeładowaniu, `?pcmenu=1` włącza nowy. Nagłówki z alfabetu autora pozostają.
- Kontynuuj otwiera przygotowanie ostatniego otwartego rozdziału i bieżącej zapisanej postaci (decyzja autora w tej rundzie). Nie wznawia trwającej nocy. Numer rozdziału przechowuje osobny klucz `nb_pc_last_chapter`; istniejący zapis postaci nie został zmieniony. Zamknięty/niedostępny rozdział wraca do I.
- Wszystkie istniejące przyciski/handlery przygotowania zachowano. Zakładki jedynie pokazują odpowiednie listy. Prawy opis odczytuje treść przycisku. Nie zmieniono openPrep, renderPrep, start/newGame ani applyPrep.
- `padNav` zachowano. Inicjalizacja fokusu omija teraz niewidoczny przycisk rozdziału na ekranie głównym. Narzędzie dymny otwiera Podróż przed wyborem rozdziału.
- Dotyk i ustawienia pomocnicze pozostają w kodzie. Nie zmieniano walki, balansu ani HUD-u. Nie dodano Wyjdź (forma dystrybucji do decyzji autora).
- Windows: build/wydanie działają przez `python`; dymny wymaga `NIGHTBRAND_PYTHON=C:/Python315/python.exe`. Brak nowych bibliotek, shaderów i zasobów graficznych.

Zrzuty przed/po: PL/EN, 1280×720 i 1920×1080. Sprawdzono klawiaturę (Enter), kliknięcia, zakładki, zmianę klasy i otwieranie wyboru języka. Nie sprawdzono fizycznego pada, telefonu, dźwięku, pełnych nocy ani itch.io. Podgląd klawiatury i kliknięć był sterowany narzędziem przeglądarkowym, nie człowiekiem.

Informacja spoza zakresu: baza zawiera już starszy JS `01dade4f...` poza manifestem (sprawdz.py informuje, bez uwag/błędów). Nie usuwano go w tej rundzie.

Publikacji main nie wykonano. Do oceny autora: kierunek oprawy/łańcuchów, forma aplikacji/HTML5, dalsze ekrany. Test: istniejący „Test wersja PC.bat”, gałąź `runda-menu-pc-1`.

Końcowe sprawdzenie cache 563: build/node --check OK, sprawdz.py WYNIK OK / 0 uwag; dymny.js gra 1 zakończył „rozdzial 1 OK, WYNIK: OK”. Finalny JS: e37e606aa036 (pełny SHA w nazwie pliku i manifeście). Pierwsza próba dymna ujawniła kolizję PL/EN z Przygotuj się na ekranie Podróży; usunięto ją przez ograniczenie PL/EN do głównego menu i ponowiono test pomyślnie. Porównania przed/po wykonano przed tą ostatnią poprawką, która nie zmienia wyglądu dwóch porównywanych ekranów.
