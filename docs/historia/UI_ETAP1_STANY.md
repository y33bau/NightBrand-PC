# UI — etap 1: wspólne stany i czytelność

Gałąź: ui-etap1-stany. Baza gry: 92583fc; baza źródeł: 936e57b.

Zakres: wyłącznie wygląd. HUD, grafiki, balans, zapis, przepływ ekranów, teksty fabularne, liczba perków i układ trzech kolumn bez zmian. „GRAJ” i „GOTOWY” pozostają. Poprawki Claude’a i nowe ikony umiejętności zostają zachowane. Etapy 2 (widoczność wyboru trybu) i 3 (przygotowanie) nie należą do tej rundy.

## Projekt

Jeden słownik stanów: spokojny mosiądz i znacznik przy wybranej opcji, hover jako jasność, jasny cienki fokus, cień po wciśnięciu i przygaszenie opcji zablokowanej. Główna akcja ma własny spokojny kontrast. Trzy poziomy oprawy: akcja, nawigacja, lekka karta/opcja. Nagłówki zachowują Grenze; teksty do czytania korzystają z istniejącego systemowego kroju szeryfowego.

## Implementacja

26_start_petla.js: blok nbUiSystem, zmienne --nb-ui-*, wspólna warstwa stanów. Dotychczasowe konkurujące reguły stanów zostały usunięte z warstw menu i pauzy, zamiast pozostawienia kolejnych czerwonych poświat. Obszar HUD nie jest modyfikowany.

22_postac_zapis_ustawienia.js: wyłącznie prezentacja renderKron — usunięcie inline !important dla typografii/układu, zastąpienie klasami. Zachowane przypięcie akcji Kroniki i przewijanie samego opisu. Logika renderowania, nagrody i obsługa zdarzeń pozostają.

narzedzia/dymny.js: użycie istniejącego mechanizmu odkrywania Playwright/Chromium oraz opcjonalnej zmiennej NIGHTBRAND_PYTHON, żeby ten sam test dało się uruchomić na Windows. Bez zmiany zakresu testu. W zbuduj.py i wydaj.py zapis LF jest jawny, żeby Windows nie zmieniał bajtów plików przy zapisie (nazwy zasobów zależą od SHA-256).

narzedzia/test-ui-stany.cjs: testowy serwer z hookiem w pamięci, bez hooków w opublikowanym pliku gry; macierz ekranów PL/EN i 1920×1080, 1280×720, 844×390. Tło gry można zatrzymać na czas zrzutu, a HUD odświeżany jest oryginalną funkcją gry; test dymny działa osobno, bez tych hooków. Symulacja nawigacji pada nie jest testem fizycznego kontrolera.

## Do przeglądu

Sprawdzić końcowy raport i porównania przed/po. Nie scalać do main ani nie publikować bez osobnego „publikuj” autora.

Weryfikacja końcowa: cache 505; sprawdz.py OK (0 uwag) dla gry i kopii; dymny.js rozdziały I/III/V OK; 162 zrzuty przed i 162 po, 54 kontrole nawigacji/stylów, bez błędów strony. Obejrzenie reprezentatywnych ekranów; nie fizyczny pad/telefon, pion, odsłuch ani pełne noce. Niskie okno zachowuje dotychczasowe przewijanie/przycięcia układu — przebudowa należy do osobnego etapu.

## Korekta autora — cache 506
Usunięto obrysy i cienie imitujące prostokątne ramki przycisków. Wybór, hover i fokus banerów korzystają z istniejącego pliku przycisk-glowny.webp (czerwone podświetlenie wewnątrz grafiki). Fokus pozostałych kontrolek korzysta z jasności. Checkboksy i pola formularzy zachowują własne oznaczenia. Cztery zrzuty menu/przygotowania w 1280×720 i 844×390; cztery asercje potwierdzają brak outline/border/box-shadow i podmianę grafiki. Wcześniejsze zrzuty cache 505 są historyczne.

## Korekta autora — cache 507
Podświetlenie czerwonego banera dotyczy wyłącznie hover/fokusu, bez stałego wyróżniania Podróży, aktywnej zakładki lub wybranej trudności. Gdy mysz wskazuje kontrolkę, fokus innej nie tworzy drugiego podświetlenia. Stan wyboru pozostaje w istniejących tekstach i oznaczeniach. Test: 12 asercji menu/Kaplicy/Opcji/Instrukcji/trudności w dwóch poziomych oknach; 6 zrzutów, brak błędów strony. Wcześniejsze zasady stałego czerwonego podświetlenia z cache 506 są nieaktualne.

## Oznaczenia wyboru — cache 508
Rozdział: trwały złoty znak ✓ obok numeru na ciemnym tle. Perki/wyzwania/klątwy: złota plakietka ✓ oraz ciepłe tło wybranej karty, niezależne od hover/fokusu; bez nowych obwódek. Wyłącznie CSS prezentacji, bez zmian renderPrep/openPrep/applyPrep i logiki wyboru. Test: 4 zrzuty w 1280×720 i 844×390, 8 kontroli oznaczeń rozdziału i trzech grup; wybranie/odznaczenie sprawdzone rzeczywistym kliknięciem.
