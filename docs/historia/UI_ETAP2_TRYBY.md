# UI — etap 2: stale widoczny wybór trybu

Gałąź: ui-etap2-tryby. Podstawa: opublikowany etap 1, gra bd3aeb1, źródła f8e0bd0, cache 508. Etap 2 ma cache 509 i wymaga odrębnego „publikuj”.

W zrodlo/main/26_start_petla.js istniejący element .m2-mode przeniesiono z przewijanej nawigacji do .premium-mode-dock. Nowy kontener .premium-rail dzieli lewą kolumnę na przewijaną listę i stały wybór trybu. Przy małej wysokości tylko lista oddaje miejsce; nie skalujemy menu, mapy, portretu ani tekstów. Te same elementy DOM zachowują dotychczasowe zdarzenia, role radiowe i zapis trybu.

Bez nowych grafik, bibliotek, tekstów, zmian HUD, mechanik, balansu, zapisu i przygotowania. Zaznaczenia i brak obwódek z etapu 1 zachowane. Etap 3 nie został rozpoczęty.

Testy i porównania: patrz końcowy RAPORT.md paczki NightBrand_UI_ETAP2. Test wyboru trybu sprawdza pełne prostokąty, rzeczywistą trafialność kursorem, stałą pozycję po przewinięciu oraz przełączanie myszą, klawiaturą i symulowanym dispatcherem pada. Fizycznego pada i telefonu nie deklarujemy.

Wynik końcowy: build i sprawdz.py obu kopii OK, 0 uwag; dymny I/III/V OK. 182 zrzuty przed + 182 po; 54 kontrole ogólne i 30 kontroli trybów, PL/EN. Oba kafelki w pełni widoczne w 1920×1080, 1280×720, 1164×655, 844×390, 767×355, także po przewinięciu listy. Główny panel ma identyczne wymiary względem cache 508. NIE sprawdzono fizycznego pada/telefonu, Safari, pionu, odsłuchu, pełnych nocy i pełnej regresji mechanik. Etap 2 tylko na gałęzi testowej, main nadal cache 508.

## Korekta pauzy — cache 510
Zawartość slotów ma bezpieczne odstępy od malowanej oprawy banera. Skrót jest osobnym górnym wierszem, ikona i nazwa układają się poniżej; pusty slot ma wyśrodkowany napis. Istniejąca grafika zwykła jest też widoczna w spoczynku, podświetlona przy wskazaniu/fokusie. Bez obwódek CSS i bez zmian renderLoadout/wyposażania. 12 kontroli geometrii pustych i wyposażonych slotów (najdłuższe nazwy PL/EN), 1920×1080, 1280×720, 844×390; 4 zrzuty. Sprawdz.py OK, 0 uwag. Test startu I wykonywany osobno. Wcześniejsza pełna macierz etapu 2 dotyczy cache 509; korekta 510 ma ten węższy zakres.

## Regresje zgłoszone przez Claude’a — cache 511
1. Kaplica: istniejące elementy opisu, grafika i reset są w .nbk-scroll; kapBuy pozostaje oddzielnym, stałym elementem na dole, tak jak przycisk Kroniki. Handler zakupu/resetu bez zmian.
2. Pauza: graficzne banery listy i Opróżnij slot także w spoczynku. Wybrany slot ma złoty ✓ przy skrócie; skill wyposażony w tym slocie ma osobny trwały ✓. To nie jest czerwony hover; obwódek CSS nie dodawano.
3. Kronika: wyśrodkowane wiersze, 23/16 px również w niskim oknie; opis 19 px, tekst pomocniczy 16 px. Przypięta akcja zachowana.
Test: 18 kontroli PL/EN w 1164×655, 1280×720 i 844×390, w tym rzeczywisty zakup w testowym profilu, stałość przycisku po przewijaniu, wszystkie zakładki Kroniki, wybór slotu, wyposażony skill i opróżnienie. Cztery zrzuty obejrzane reprezentatywnie. Build i sprawdz.py OK, 0 uwag. Bez zmian mechanik, HUD i funkcji renderLoadout. Test startu I wykonywany osobno. Nie testowano fizycznego pada/telefonu, Safari, pionu, odsłuchu, pełnych nocy ani resetu ulepszeń (kontrolka zachowana w przewijanym opisie).
