# Menu PC — pełna oprawa, koncepcja 2

Przebudowa na polecenie autora „przebuduj wszystko, menu całej gry”. Gałąź `runda-menu-pc-2`, od main `22f6922` (562), z przeniesioną pracą etapu 1. Main i mobilne repo `y33bau/nightbrand` pozostają bez zmian.

## Zmienione widoki

- Menu główne, Podróż i wybór rozdziału.
- Przygotowanie: trzy postacie, perki, istniejące wyzwania i klątwy, trudność, samouczek i pozostałe ustawienia pomocnicze.
- Kaplica: wszystkie trzy zakładki, lista ulepszeń, szczegóły i istniejące przyciski ofiary/resetu.
- Kronika: sześć istniejących zakładek (specjalne noce, osiągnięcia, medale, bestiariusz, statystyki, zapiski).
- Instrukcja, Opcje i ich podstrony; Plac ćwiczeń zachowuje działający przycisk startu treningu.
- Pauza: umiejętności, sterowanie, audio, dziennik, mapa. Karty awansu, Kram Margi, zwycięstwo/porażka, potwierdzenia, wybór języka i dolne okno rozmowy.

Wspólne zasady: przygaszone ilustracje gry, regularna szeryfowa typografia, wyrównane cienkie separatory, bordowa tkanina dla wskazania i małe złote znaczniki wyboru. Duży portret bez prostokątnego tła, czytelne kolumny listy i szczegółów. To działające HTML/CSS z prawdziwymi kontrolkami. Nie użyto wycinków plansz koncepcyjnych ani wymyślonych perków/liczb. Kompozycja odtwarza kierunek plansz; nie deklarujemy identyczności pikselowej wszystkich ekranów.

## Zachowane zachowanie

Warstwa znajduje się w końcowym bloku `26_start_petla.js`, pod klasą `.pc-menu`. `?pcmenu=0` wyłącza nowy blok i przywraca poprzedni wygląd; `?pcmenu=1`/brak parametru włącza go. Pozostawiono źródłowe nagłówki autora; podsumowanie nocy nadal pokazuje jego alfabet. Obie wersje językowe i regulacja rozmiaru tekstu są zachowane.

Kontynuuj otwiera przygotowanie ostatniego rozdziału i zapisanej postaci, zgodnie z decyzją autora. Nie ma zapisu w środku nocy. Nowy numer rozdziału jest w osobnym `nb_pc_last_chapter`. Oryginalne funkcje `start`, `newGame`, `openPrep`, `renderPrep` i `applyPrep` nie zostały zmienione. Istniejące elementy przygotowania przeniesiono do kolumn i rozwijanych grup, zachowując ich obsługę. Widoczne zakładki otwierają istniejące listy; opis po prawej odczytuje ich prawdziwą zawartość.

Nie zmieniono balansu, walki, HUD-u, pasków, dotyku ani map. `padNav` pozostaje; poprawka inicjalnego fokusu z etapu 1 omija niewidoczne przyciski. Nie dodano „Wyjdź”, instalatora, nowych shaderów ani zależności produkcyjnych. Usunięto tylko podwójne wizualne skalowanie panelu awansu w nowej warstwie.

## Zasoby i pochodzenie

Nowe pliki źródłowe są w `zrodlo/ui-pc/`. Kopie runtime dodano narzędziem `wydaj.py dodaj` i nazwano według SHA-256. Nie edytowano istniejących plików `gra/assets/` ręcznie.

- `chmury.webp`: istniejący projektowy `output/ui-menu-premium-20261104/tlo-chmury-zar.webp`.
- `kaplica.webp`: istniejąca autorska ilustracja z `output/ui-menu-premium-20261104/grafiki/kaplica.webp`.
- `bordowa-tkanina.png`: nowa grafika wygenerowana narzędziem obrazowym; poziomy, postrzępiony pas ciemnego bordowego lnu, bez liter, emblematów i złota, przezroczyste otoczenie. Wynik `exec-95569836-3032-4756-9e1c-cf39ab5b6273.png`.
- `portret-rycerz.png`, `portret-kat.png`, `portret-zabojczyni.png`: osobne edycje rzeczywistych portretów gry, z poleceniem zachowania postaci, stroju, broni, kolorów i pozy oraz usunięcia otoczenia na przezroczyste tło. Nie są wycinkami koncepcji. Wyniki odpowiednio `exec-3a216329-20e3-4ffb-822e-4aba0a2099c0.png`, `exec-f31ebae6-c0b9-4402-9d1a-5a79a78259cc.png`, `exec-1c648ec9-caa7-4f38-8386-526a4d896a68.png`. Oryginały zachowane; edycja generatywna może zawierać drobne różnice detali. Kanał alfa wszystkich czterech PNG sprawdzony.

Zasoby nie zastępują oryginałów w trybie `pcmenu=0`. Logo i ilustracje rozdziałów pochodzą z gry.

## Weryfikacja i ograniczenia

Końcowe wyniki oraz SHA są dopisane na końcu po sprawdzeniu. Zrzuty lokalne: `output/NightBrand_PC_CALOSC/`, galeria `GALERIA.html`; materiały porównawcze nie trafiają do folderu gry ani repo runtime.

Przegląd przeglądarkowy wykonano narzędziem, sekwencyjnie. Okna pauzy, awansu, kramu i zakończenia otwierano także w kontrolowanej sesji testowej przez istniejące funkcje gry, po ominięciu intro. Tymczasowy dostęp do funkcji wstrzyknięto tylko w odpowiedzi lokalnego serwera dla tej sesji; nie zapisano go do gry. Te zrzuty pokazują układ, nie dowodzą przejścia nocy ani naturalnego zdobycia nagród. Zapis autora nie był używany.

Nie sprawdzono fizycznego pada, odsłuchu, telefonu, pełnych nocy I–V, wydajności na docelowym sprzęcie ani itch.io. Nie deklarujemy tych sprawdzeń. Forma dystrybucji HTML5/aplikacja nadal wymaga decyzji autora. Main nie publikowano.

## Wynik końcowy — 10.11.2026

- Cache: `nightbrand-codex-20261110-564` (nadany przez `wydaj.py wersja`). Build i `node --check`: OK. `sprawdz.py`: **WYNIK OK, 0 uwag**, 0 brakujących tłumaczeń HTML.
- `node narzedzia/dymny.js gra 1 8781`: **rozdzial 1 OK / WYNIK OK**. Windows: `NIGHTBRAND_PYTHON=C:/Python315/python.exe`.
- Przegląd wszystkich zakładek PL 1920×1080; menu/przygotowanie i wybrane widoki PL/EN 1280×720 oraz EN 1920×1080. Łącznie 55 zrzutów. Pauza/awans/kram/koniec: kontrolowane otwarcie opisane wyżej. We wszystkich sesjach 0 błędów strony.
- Nawigacja strzałkami, Enter, kliknięcia, Escape w rozwijanym przygotowaniu: OK. Przełącznik 130% rzeczywiście zmienia rozmiar tekstu o współczynnik 1,3 w PL/EN. Bez deklaracji fizycznego pada.
- Folder `gra`: 702 pliki, **93 520 870 B**, poniżej limitu 150 MB. Istniejąca informacja o dawnym `01dade4f…js` poza manifestem pozostaje bez zmian; kontrola nie traktuje jej jako uwagi.
- SHA-256 JS: `845bf71ef832a810d7c6a6e14b58a363c373e9d7dd841c1c939f794c399ae373`.
- SHA-256 index.html: `5595c4c0d185d43d16a0473d69fc1787a38fe421f994bfbaf29d8418977f6def`.
- SHA-256 sw.js: `bd2883c948800e7da76c789aefb5d30186af7bac578bfec7fe142b0acb953adf`.

To runda do oceny autora, nie publikacja main. W istniejącym „Test wersja PC.bat” wybierz gałąź `runda-menu-pc-2`. Galeria i samodzielna lokalna kopia do uruchomienia znajdują się poza repo, w `output/NightBrand_PC_CALOSC/`.
