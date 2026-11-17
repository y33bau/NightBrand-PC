# Symetria i kafelki PC — 10.11.2026

Gałąź `runda-menu-pc-6` od `origin/main` (`22f6922`) z przeniesionymi rundami 1–5. Cache nadany narzędziem: **nightbrand-codex-20261110-568**. Main i mobilne repo bez zmian.

- Przygotowanie: nagłówek i trzy jednakowe zakładki na osi całego ekranu; pełny divider; trzy ramki treści o wspólnych górnych i dolnych krawędziach. Trudność i Ustawienia są symetrycznie na górze. Stopka zawiera trzy równe pola: rozdział, rzeczywiste podsumowanie i Gotowy. Zachowano rozwijane kontrolki, MP i funkcje przygotowania.
- Podróż: Kaplica i Kronika są większe, jaśniejsze i mają czytelne obramowane przyciski. Zaznaczenie rozdziału obejmuje bordowy kontur całego zdjęcia. Usunięto baner spod nazwy; ilustracja nie jest zasłaniana.
- Awans i handel: osobne, równe kafelki ze wspólnym delikatnym gotyckim konturem. Kategoria, ikona, nazwa, podtytuł, opis i liczby mają własne miejsca. Długie opisy przy powiększonym tekście przewijają się wewnątrz kafelka; nie nachodzą na sąsiednie elementy. Bez zmian losowania, przerzutu, blokady wyboru, leczenia i statystyk.
- Sterowanie w pauzie jest wyśrodkowane i skaluje istniejącą planszę w całości do dostępnej wysokości. Tytuł pauzy ma własną oś, nazwa rozdziału jest niżej. Oba przyciski na dole mają jednakową oprawę. Nagłówek sklepu także jest wyśrodkowany.
- Jasność przeniesiono wraz z oryginalnym suwakiem i jego obsługą do Grafiki. Działa klawiaturą (100 → 105 po strzałce). Lokalna obsługa klawiszy suwaka zapobiega przechwyceniu ich przez globalne sterowanie gry. Zaznaczenie i fokus to oddzielne stany: nieaktywne przyciski nie stają się bordowe od samego najechania ani domyślnego fokusu.

Wykorzystano istniejące PNG ramek; brak nowych grafik, fontów i shaderów. Zmiany prezentacji w `26_start_petla.js`, warstwa `.pc-tiles` wewnątrz `.pc-gfx`; `?pcgfx=0` nadal wyłącza nową rodzinę graficzną. Teksty/liczby, dostępne nazwy przycisków, padNav, kod dotyku, HUD i balans zachowano.

Sprawdzenie: rzeczywiste menu PL 1920×1080 i EN 1280×720; dodatkowo kontrolowany przegląd kafelków PL oraz EN 1280×720 z tekstem 130%. Osie zakładek/podsumowania/sterowania: różnice poniżej 0,01 px; równe szerokości zakładek i kart; zgodne górne/dolne linie paneli; brak nakładania oraz wyjścia zawartości poza karty. Przerzut i wybór karty Enter, przełączanie trudności, MP, dwa symbole nagród, przeniesienie i działanie jasności, neutralne najechanie i brak banera rozdziału: OK. Brak błędów strony. Kontrolowany dostęp do funkcji był wyłącznie w odpowiedzi przeglądarki testowej, bez haków w produkcyjnym JS. Nie używano zapisu autora.

Build, `node --check`, `git diff --check`: OK. `sprawdz.py`: **WYNIK OK, 0 uwag**, 0 brakujących tłumaczeń HTML. Gra: **99 447 984 B / 708 plików**, poniżej 150 MB. SHA-256 JS: `971500c7082311b8d14db61d609c334402497d6c3e5fa472b3f34dea1256a946`. Informacje o starym JS poza manifestem istniały przed rundą.

Nie sprawdzono fizycznego pada, odsłuchu, pełnych nocy, drugiego pada, telefonu ani itch.io. Galeria i lokalna paczka: `output/NightBrand_PC_SYMETRIA/`. W „Test wersja PC.bat” wybierz `runda-menu-pc-6`. Nie publikowano main.

Końcowy `node narzedzia/dymny.js gra 1 8781`: **rozdzial 1 OK / WYNIK OK**. Krótki start i kontrola jakości, nie pełna noc.
