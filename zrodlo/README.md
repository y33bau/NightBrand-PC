# Źródło głównego pliku gry (faza 4, 2.11.2026)

`main/` zawiera główny plik gry podzielony na 28 części według sekcji kodu (świat, teren, walka, wrogowie, umiejętności, render, HUD, fabuła, muzyka, grafika...). Sklejone w kolejności numerów dają plik gry identyczny bajt w bajt (dowód: `rozloz.py`, `zbuduj.py` mówi „Bez zmian").

Praca:
1. Zmieniasz tylko odpowiednią część w `main/`.
2. `python3 narzedzia/zbuduj.py zrodlo/main KATALOG_GRY` — skleja, zapisuje pod nowym hashem, poprawia manifest.json i sw.js, sprawdza składnię.
3. `python3 narzedzia/wydaj.py wersja KATALOG_GRY "opis"` — nowy cache, linijka w WERSJA.txt, kontrola sprawdz.py.
4. Test: `node narzedzia/dymny.js KATALOG_GRY 1`.

Strażnik: `OSTATNI_BUILD.txt` to hash ostatnio zbudowanego pliku. Jeśli ktoś zmienił grę bezpośrednio (np. Codex), `zbuduj.py` przerwie; wtedy najpierw `rozloz.py KATALOG_GRY zrodlo/main`.
Granice części są w `narzedzia/zrodlo_wspolne.py` (lista CZESCI, znaczniki = początki linii). Nie usuwaj komentarzy-znaczników z początku części.
Pliki `three` (biblioteka) i `SPRITE_DATA` (lista grafik) zostają w grze bez zmian; nie są częścią źródła.
