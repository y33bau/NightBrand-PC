# HUD — łuk staminy i pięć/sześć slotów

Runda `runda-hud-pc-2`, od `origin/main` z przeniesionymi wcześniejszymi rundami menu i HUD. Dotyczy prywatnego `NightBrand-PC`; repo mobilnego nie zmieniano.

Cache nadany przez `wydaj.py`: **nightbrand-codex-20261110-571**. SHA-256 JS: `f64762ce834db7a5813995826e884f47024b9a9de0684961d494c3edb53329c1`. Zdalny main nadal `22f6922b6e9c339ca2d5d95554615ea8cafbf816`; bez publikacji na main.

Gotowa gra: **107 464 930 B / 716 plików** (limit 150 MB). Lokalny ZIP `NightBrand_PC_HUD_571.zip`: 103 638 505 B, kontrola integralności archiwum OK.

- Stamina jest złotym łukiem po wewnętrznej stronie kuli many. Łuk i liczby czytają te same `pl.sta/pl.staMax`; koszt, regeneracja, ostrzeżenia i ustawienie ograniczenia błysków pozostają bez zmian. Pod centralną listwą został sam pasek EXP. Łuk jest osobną warstwą SVG, bez nowego shadera i bez obróbki PNG.
- Zgodnie z wyraźną decyzją autora: pięć aktywnych slotów jest dostępnych od początku. Piąty jest po lewej, przed Q/E/F/R; zachowuje G i LT+RB. „Dar pieczęci” za dotychczasowe 2000 Popiołów dodaje szósty slot po prawej (6 / LT+LS, klik lewej gałki). Posiadana pieczęć i zapis pozostają ważne; nie zwraca się waluty. Nie ma konfliktu z własnymi klawiszami: 6 był już zarezerwowany i nie służył innej akcji. Kod przycisków, wyposażania, kosztów i odnowień pozostaje wspólny dla wszystkich slotów.
- Zaklęcia ostrza zostają w dotychczasowym miejscu, zgodnie z ostatnią korektą autora. Prawa grupa mieści dwa zaklęcia, szósty slot z pieczęci, atak i blok. Pięć miejsc po obu stronach medalionu ma równe rozmiary i odstępy. Przed zakupem pieczęci miejsce szóstego slotu pozostaje wolne. W pauzie działają wybór, zamiana i opróżnianie również szóstego slotu; dotyk dostał pozycję szóstego przycisku.
- „Przygotuj się” w wyborze rozdziału jest stale wyróżnione bordowym tłem, jaśniejszym konturem i napisem. Fokus dodatkowo wzmacnia zaznaczenie. Powrót do menu oraz oznaczenie trybu używają graficznej rodziny nagłówków, w PL i EN; odczyty dostępnych nazw i komunikaty ładowania pozostają tekstem.

Nowe źródła grafiki są w `zrodlo/ui-pc/gotycki/powrot-tryb-*`. PNG wygenerowany narzędziem `image_gen` na podstawie wcześniejszego zatwierdzonego atlasu; skopiowany bez zmiany pikseli, dodany do gry przez `wydaj.py dodaj`. Wszystkie nowe napisy mają PL/EN.

Zmiana bazowej liczby slotów jest jedyną zaakceptowaną zmianą mechaniki. Nie zmieniano liczb umiejętności, leczenia, walut, losowania kart, Hordy, shaderów ani zapisu trwającej nocy. Nowa oprawa HUD nadal dotyczy jednego gracza na PC; pozostałe układy zachowują wcześniejszy wygląd. Obsługa dodatkowych slotów pozostaje w logice i dawnych układach.

Regresję przygotowania przeniesiono do `narzedzia/test-prep-combos.cjs` dla rzeczywistych reguł obecnej gry: jeden perk klasy (albo brak), jedno wyzwanie (albo brak), trzy klasy, rozdziały I–V i krypta, pieczęć/bez pieczęci. Historyczny test z 0–3 perkami dotyczy nieaktualnej wersji; test uwzględnia obcinanie takiego starego zapisu do jednego perku. Serwer testowy wstrzykuje dostęp do stanu wyłącznie w pamięci, z poprawnym SHA w odpowiedzi manifestu. Brak haków w wydanej grze.

Sprawdzenie końcowe:

- `test-prep-combos`: **10 692 przypadki, 0 błędów** (3564 na profil: komputer, dotyk pion i poziom). Osiemnaście startów prawdziwym przyciskiem Gotowy, zachowanie pieczęci po przeładowaniu, zgodność postaci/perku/wyzwania, pięć lub sześć slotów i trzy sekundy gry w każdej kombinacji: OK.
- `test-review`: **308 prób umiejętność/slot**, odczyt pojemności, automatyczne wyposażanie, zamiany i ochrona indeksów — OK. **Przyspieszone symulacje pełnego przebiegu nocy I–V**: zwycięstwo, prawidłowe etapy, skończone wartości stanu, sześć slotów i odblokowanie następnych rozdziałów. W tych próbach bohater był nietykalny, bossowie pokonywani automatycznie, a wybory kart zatwierdzane przez test. To kontrola przepływu i zgodności, nie ręczny test balansu.
- Przegląd UI: PL 1920×1080, EN 1280×720 z tekstem 130%; łuk, wypełnienie 45%, brak starej staminy na listwie, położenie piątego i szóstego slotu, zachowanie dwóch ikon zaklęć, brak nachodzenia prawej grupy, nowa typografia i przycisk głównej akcji — OK. Klawiatura G/6, wyposażenie w pauzie i zamiana piątego/szóstego slotu, powroty ESC, wejście Enter: OK. LT+LS sprawdzono przez rzeczywisty kod odczytu symulowanego Gamepad API, nie fizyczny pad. Przycisk szóstego slotu mieści się w dotyku 844×390 i 390×844.
- Build, `node --check`, `git diff --check`: OK. `sprawdz.py`: **WYNIK OK / 0 uwag**, brak nieprzetłumaczonych napisów HTML. `node narzedzia/dymny.js gra 1 8781`: **rozdzial 1 OK / WYNIK OK**. Informacje walidatora o starym loaderze i manifeście były obecne przed rundą.

Nie sprawdzono fizycznego pada/telefonu, odsłuchu, ręcznego przejścia pełnych nocy ani pełnej rozgrywki dwóch graczy. Zrzuty i stany testowe powstały w osobnych kontekstach przeglądarki; zapis autora nietknięty. Galeria i lokalna kopia gry: `output/NightBrand_PC_HUD_SZLIF/` w głównym katalogu autora. ZIP do lokalnego przekazania nie jest publikowany na itch.io.
