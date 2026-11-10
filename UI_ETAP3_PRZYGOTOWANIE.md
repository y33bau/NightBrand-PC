# UI — etap 3: przygotowanie

Gałąź ui-etap3-przygotowanie, baza main: gra 3dc602c, źródła 02ae547 (cache 511). Cache etapu 3: 512. Odrębny przegląd i „publikuj” autora przed main.

W poziomie: mniejsze portrety klas; pełny opis wybranej klasy w osobnym pasie pod portretami, opisy pozostałych w podpowiedzi; trzy kolumny Perki/Wyzwania/Klątwy przewijają się niezależnie, nagłówki pozostają przy górnej krawędzi. Główna powierzchnia przygotowania nie przewija się. Prawa strona dzieli się na stałą trudność, przewijane objaśnienie/opcje pomocnicze oraz stałe podsumowanie z GOTOWY. Niskie okna mają łagodnie mniejsze odstępy i czytelne pola trudności.

Podsumowanie: klasa, trudność, liczby wybranych perków/wyzwań/klątw; pełne nazwy wyborów w podpowiedzi. PL/EN, role=status i aria-live=polite. Aktualizacja przez obserwację zmian widoku; odczyt istniejącego stanu bez zapisów i bez ingerencji w renderPrep/openPrep/applyPrep/start/newGame, losowanie, balans czy liczbę perków.

26_start_petla.js: prezentacja i odczytowe podsumowanie. W 22_postac_zapis_ustawienia.js wyłącznie przeniesienie wymuszanych inline ustawień układu klasy do klasy CSS nb-prep-class. Pozostałe 25 części identyczne z main. HUD, nowe oprawy z poprzednich etapów, Kaplica i Kronika pozostają. Brak nowych grafik/bibliotek. Pion nie jest projektowany; reguły układu są ograniczone do poziomu.

Testy i ograniczenia: końcowy RAPORT.md w paczce NightBrand_UI_ETAP3. Fizycznego telefonu/pada, Safari, pionu, odsłuchu ani pełnych nocy nie deklarujemy.

Weryfikacja układu: 90 kontroli przygotowania (5 rozmiarów, wszystkie klasy, PL/EN) oraz 36 ponownych kontroli finalnego wariantu w 1164×655 i 767×355. Nagłówki widoczne po pełnym przewinięciu każdej kolumny, trzy kolumny zachowane, GOTOWY i trudność trafialne bez przewijania panelu, liczniki podsumowania poprawne, tekst kart mieści się w kartach. Pełna macierz pozostałych ekranów: 162 przed/162 po i 54 kontrole nawigacji. Finał ogranicza nowe elementy do poziomu; poza nim nowe opakowania są neutralne. Funkcje renderPrep, openPrep, applyPrep porównane z main — tekst identyczny; nie uruchamiano test-prep-combos, bo te funkcje i start/newGame nie były zmieniane.

Test końcowy startu rozdziałów I/III/V: OK na finalnym JS 933cedae79048099a764c4dc1740b1a556b721656b047b60336c486ed89fd909. Cache 512. Sprawdz.py obu kopii: OK, 0 uwag. Gotowe do przeglądu Claude’a, bez publikacji main.

## Uwagi Claude’a — cache 513
Uwaga Wyzwania dnia i Nocy tygodnia jest pod nagłówkiem Klątwy, przed listą. Lista i uwagi nie kurczą się w kontenerze flex, więc ostatnia karta mieści się w prostokącie listy. Mnożnik ma pogrubioną Georgię 14 px i pełną widoczność. Usunięto ✓ w kółku; został pojedynczy ✓ w nazwie i złote tło wyboru. Bez zmian zasad wyzwań/klątw/perków.
Nowy test wchodzi przez prawdziwe przyciski Kroniki do Wyzwania dnia i Nocy tygodnia: 12 scenariuszy PL/EN, 1164×655, 844×390, 767×355. Sprawdza kolejność i geometrię uwag/listy, położenie ostatniej karty, mnożnik, pojedyncze ✓, nagłówek po przewinięciu i dostępność GOTOWY. 4 zrzuty, bez błędów strony. Zaktualizowano też starszy test oznaczeń wyboru na pojedynczy znacznik. Nie powtarzano pełnych nocy, pełnej macierzy ekranów; brak weryfikacji fizycznego pada/telefonu, Safari, pionu i odsłuchu.
