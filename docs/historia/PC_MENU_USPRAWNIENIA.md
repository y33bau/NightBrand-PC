# Menu PC: usprawnienia (13.11.2026)

Gałąź `runda-menu-usprawnienia` od main `1703efc` (cache 640). Cache rundy: `nightbrand-codex-20261113-641`.
Polecenie autora: wdrożyć punkty 1–15 z przeglądu menu oraz podzielić listy perków, wyzwań i klątw na ramki.

## Gdzie jest kod
- Nowa część źródła `zrodlo/main/27_menu_usprawnienia.js` (warstwa prezentacji, `?menu2=0` ją wyłącza). Końcówka głównego pliku (`requestAnimationFrame(frame)` i zamknięcie) przeszła z części 26 do 27; `narzedzia/zrodlo_wspolne.py` zna nową część.
- Zmiany u źródła: `19_hud.js` (goFull szanuje `nb_fs`), `22_postac_zapis_ustawienia.js` (Kaplica, Kronika, bestiariusz, zakres dat nocy tygodnia), `23_instrukcja_sterowanie.js` (potwierdzenie porzucenia nocy), `26_start_petla.js` (zakładka Grafika w pauzie, status rozdziału).

## Co zmieniono
1. Pauza: „Porzuć noc" pyta o potwierdzenie (Zostań / Porzuć noc); na placu ćwiczeń bez pytania.
2. Przygotowanie: karta wybranej klasy z opisem i poziomem; nic nie chowa się pod krawędzią.
3. Stały rząd pięciu klas w stałej kolejności; wybrana tylko podświetlona.
4. Trudność: trzy przyciski i opis stale widoczne w stopce. „Ustawienia" (Samouczek, 2 graczy) po prawej.
5. Tryb fabularny: zamknięty rozdział pokazuje „Ukończ rozdział N". Podgląd zamkniętego rozdziału nie został dodany (przyciski są wyłączone).
6. Wybór rozdziału: zdanie opisu (teksty z Instrukcji), medale pięciu klas w panelu i kropki medali na liście; „Dostępny" usunięte.
7. Perki, wyzwania i klątwy: karty w ramkach, dwie kolumny, opis pod nazwą, nagroda na karcie, znak przewijania gdy lista jest dłuższa.
8. „Tryb gry" na wyborze rozdziału jest przełącznikiem; nazwa rozdziału w przygotowaniu to podtytuł, nie ramka.
9. Menu główne: wiersz „Wyzwanie dnia" (otwiera Kronikę → Noce specjalne).
10. Bestiariusz: siatka kafli z sylwetkami nieodkrytych, grupy według rozdziału pierwszego spotkania (`BEAST_CH`; przypisanie mnicha do rozdz. I nie zostało potwierdzone w kodzie fal).
11. „Noc tygodnia · 9–15 listopada" zamiast numeru tygodnia.
12. Opcje otwierają się na Grafice; na PC ukryte elementy dotykowe i wzmianki o telefonie/baterii (kod dotyku zostaje).
13. Grafika: „W oknie / Pełny ekran" (klucz `nb_fs`); zakładka Grafika w pauzie (te same kontrolki, przenoszone na czas pauzy).
14. Dane zapisu: kasowanie w osobnej czerwonej ramce na dole, raport błędów niżej.
15. „Wróć" w przygotowaniu jak na pozostałych ekranach; Kaplica bez „Teraz: —", bez zbędnej kropki, z paskiem postępu ołtarza. Dopisek o wspólnym poziomie przy „Poziom" autor odrzucił: zostaje samo „Poziom".

## Sprawdzone
Build i `node --check`, `sprawdz.py` (jedyna uwaga: rozmiar zasobów, jak przed rundą), zrzuty PL 1280×720 i 1920×1080, wybrane EN, klawiatura (menu, wybór rozdziału, przygotowanie, potwierdzenie w pauzie), przełącznik pełnego ekranu w przeglądarce testowej, test dymny I–V (wynik w meldunku).

## Nie sprawdzone
Pad, dźwięk, tryb 2 graczy, gra u autora, itch.io, rozmiar tekstu inny niż Normalny.
