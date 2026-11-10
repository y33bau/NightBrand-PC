# Czytelność banerów i bohaterów — cache 515

Gałąź ui-czytelnosc-banery z main cache 514. Bez publikacji bez osobnego polecenia autora.

Przyczyna banerów: wspólny stan podświetlenia podstawiał bitmapę bez znormalizowanej wielkości tła. Zwykłe akcje (m.in. język w Opcjach, raport błędów i zapis) dostają istniejący pełny baner, center / 100% 100% / no-repeat, w spoczynku i hover/fokus. Usunięto płaskie tło przycisków oraz tło wiersza GOTOWY. Przyciski danych/języka mają większy, wyśrodkowany tekst i bezpieczne odstępy. Bez nowych grafik i bez obwódek CSS.

Kafelki bohaterów powiększone w dół (na większych ekranach 180–280 px), portrety wyraźnie większe. POSTAĆ 24 px, nagłówki kolumn 22 px; w niskim poziomie 20/18 px i dostosowane portrety, żeby zachować dostępność wyborów. Pełny opis wybranej klasy, trzy kolumny, przyklejone nagłówki i stały GOTOWY zachowane.

Wyłącznie CSS w 26_start_petla.js. Bez zmian HUD, mechanik, zapisu, treści klas i limitów. Testy i ograniczenia w końcowym raporcie paczki NightBrand_CZYTELNOSC_515.

Wyniki: 162 widoki menu sprawdzone pod kątem geometrii bitmap banerów w PL/EN i 1920×1080, 1280×720, 844×390; 216 kontroli (w tym 54 nawigacji). Małe akcje w Opcjach dodatkowo sprawdzone w hover bez uruchamiania eksportu/importu/czyszczenia. 90 kontroli układu przygotowania (3 klasy, 5 rozmiarów do 767×355, PL/EN), w tym przezroczyste tło przycisku i wiersza GOTOWY. 12 scenariuszy prawdziwego wejścia przez Kronikę do Wyzwania dnia/Nocy tygodnia. Cztery zrzuty główne, jeden przygotowania oraz cztery nocy specjalnych; brak błędów strony. Build i sprawdz.py obu kopii OK (0 uwag).
Nie testowano fizycznego telefonu/pada, Safari, pionu, odsłuchu, pełnych nocy, eksportu/importu/czyszczenia zapisu ani wdrożenia Pages. Nie zmieniano mechanik ani zapisu. Szybki start I wykonywany osobno przed oddaniem paczki.
