# UI — sprawdzenia do przeglądu Claude’a

Źródła tej gałęzi odpowiadają grze w sąsiednim klonie `runda-ui-menu`. Snapshot `gra/` nie został zaktualizowany. Build: `python narzedzia/zbuduj.py zrodlo/main ../runda-ui-menu` z katalogu repo źródeł.

Testy wymagają Node, Playwright i Chromium; `ui-test-runtime.cjs` używa lokalnej instalacji lub pakietów Codex. Można ustawić `NIGHTBRAND_NODE_MODULES`, `NIGHTBRAND_BROWSER` i `NB_UI_GAME` (katalog gry). Testowe funkcje są wstrzykiwane wyłącznie w odpowiedzi lokalnego serwera wraz z właściwymi metadanymi SHA — nie ma ich w grze.

- `node narzedzia/test-doublecheck.cjs`: PL i EN, trzy klasy, wejściowe listy 0–3 perków ograniczane zgodnie z grą do jednego, wszystkie dostępne wyzwania i brak wyzwania. 92 starty na język. Osobno wybór perku i zmiana klasy z kontrolą czyszczenia. Logi `doublecheck-pl.json`, `doublecheck-en.json`.
- Ten sam test zapisuje przebieg kierunkowego fokusu, B, LB/RB i Start, wywołując dyspozytor menu z syntetycznymi danymi pada. Nawigacja jest przestrzenna, nie prostą kolejnością DOM.
- `node narzedzia/test-pad-api.cjs`: dodatkowy syntetyczny standardowy pad przez navigator.getGamepads i padTick. Próbkowanie wejścia jest wywoływane deterministycznie, z pominięciem czasowej blokady przejścia menu w teście; nie jest to fizyczny pad ani test czasu tej blokady. Kontrola utrzymania fokusu w ekranie, B, LB/RB i Start.
- `NB_UI_URL` ustawia adres działającego lokalnie serwera gry dla `test-pamiec.cjs` i `test-pamiec-20.cjs`. Przy braku zmiennej czytany jest plik adresu w katalogu makiety projektu autora. Drugi test wykonuje 20 pełnych cykli Podróż → Przygotowanie → Podróż → Kaplica → Podróż → Opcje → Podróż i mierzy co pięć cykli.

Pomiar pamięci to suma unikalnych widocznych obrazów i pseudoelementów, szerokość × wysokość × 4. Nie obejmuje całego cache dekoderów/GPU ani Safari. Stabilny wynik <25 MB nie stanowi dowodu limitu całej pamięci przeglądarki. W wynikach zachowano użyte adresy i wymiary.

Manifest (od cache 437, późniejsza decyzja autora): `assets/manifest.json` jest pobierany najpierw z sieci; po sukcesie zapisywany, a przy błędzie sieci lub HTTP zwracana jest ostatnia poprawna kopia z cache. Instalacja SW zapisuje kopię również po pierwszym wczytaniu, zanim klient jest kontrolowany przez SW. Manifest nie jest wpisem F/L. Loader `01dade…js` jest bezpośrednim skryptem index.html; celowo nie wpisano go do manifest.scripts, aby nie uruchamiał sam siebie. Komunikat walidatora o manifest.json w sw.js wynika z obsługującego go warunku ścieżki, a nie precache.

TRN_H przejęto bez konfliktu z commitu `e0c498fc590ffcd65303c64ecf7577d4c624ff49` gałęzi `kod-testera-zmiana`; porównanie wartości potwierdzone. Nie zmieniano kodu dostępu ani zasad testera po stronie UI.

Wynik 4.11.2026: cache 436 (wygląd jak zaakceptowany 435). Macierz 184/184 starty, dyspozytor pada PL/EN PASS, dodatkowy Gamepad API PASS na pięciu ekranach i Start. 20 pełnych cykli przełączania: Podróż 15 907 200 B, Przygotowanie 14 355 968 B, Kaplica 7 864 320 B, Opcje 13 870 768 B; wartości co pięć cykli stabilne, każda <25 MB. Instrukcja początkowa 5 114 880 B. Test manifestu sieciowego PASS także przy symulowanym braku sieci (bez fallbacku). Walidator: 0 brakujących tekstów EN, 0 uwag. Nie jest to pełna macierz kombinacji ani pomiar pamięci Safari/GPU.

Cache 437: test-manifest-network.cjs PASS dla świeżej odpowiedzi, aktualizacji ostatniej kopii, fallbacku przy błędzie sieci i HTTP oraz braku kopii. test-offline-start.cjs PASS: izolowana przeglądarka, pierwsze pełne wczytanie online, gotowy SW i kopia manifestu, setOffline(true), przeładowanie, menu, przygotowanie i działający rozdział I przez 8 s. Licznik żądań serwera bez zmian po odcięciu sieci, brak błędów JS. offline-start.json zawiera wynik; zrzut offline-start.png pozostaje lokalnym materiałem, nie plikiem gry. Nie jest to test fizycznego telefonu.
