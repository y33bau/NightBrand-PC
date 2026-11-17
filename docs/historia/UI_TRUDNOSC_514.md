# Poprawka zaznaczenia trudności — cache 514, 9.11.2026

Gałąź ui-trudnosc-zaznaczenie z aktualnego main. Autor polecił naprawić i od razu publikować.
Wyłącznie CSS w 26_start_petla.js: istniejąca klasa .on w #diffSw pokazuje złoty ✓ przed nazwą. Stan wyboru nie zależy od hover/fokusu, bez dodatkowych obwódek, bez zmian applyDiff, zapisu czy mechanik. Pozostałe części źródła bez zmian.
Test: 24 kontrole PL/EN w 1164×655, 844×390 i 767×355; każdy z trzech poziomów, przeniesienie kursora na inny przycisk i odtworzenie po przeładowaniu. W każdej grupie dokładnie jeden znacznik; cztery zrzuty, brak błędów strony. Build i sprawdz.py obu kopii OK (0 uwag); manifest i sumy SHA sprawdzone.
Nie testowano fizycznego telefonu/pada, Safari, pionu, odsłuchu, pełnych nocy i wdrożenia Pages. Test startu I wykonywany przed publikacją; wynik w lokalnym raporcie publikacji.
