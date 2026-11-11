# Dyskretny samouczek PC — 11.11.2026

- Niewielka karta przy lewej krawędzi zamiast środkowego panelu z łańcuchami.
  Cienki kontur, spokojne tło, Cinzel dla etykiet i akcji, czytelny tekst Georgia.
- Licznik bieżącego kroku oraz pomijanie wewnątrz karty, poza dolnym HUD-em.
- „Pomiń” we wprowadzeniu jest małą akcją w rogu, bez ciężkiej ramki. Pokazuje
  skrót Esc lub Menu, zgodnie z ostatnio użytym sposobem sterowania.
- Krótsze teksty PL/EN; aktualne przyciski RT/RB/LB i dynamiczna lista
  dostępnych slotów. Opisy klawiatury uwzględniają zapisane przypisania.
- Zachowano dziewięć kroków, ich czasy, warunki wykonania, preferencję
  podpowiedzi i zapis ukończenia. Samouczek nie pauzuje walki.
- Pomijanie działa także po aktywowaniu przycisku klawiaturą. Tab może
  wskazać przycisk we wprowadzeniu; Enter/Spacja na nim pomijają, zamiast
  uruchamiać akcję postaci. Esc i przycisk Menu pada zachowują swoje działanie.
- Warstwa `.pc-tutorial` dotyczy PC z myszą/klawiaturą. Dotyk i początkowy
  widok pionowy zachowują dotychczasowy układ; obsługa dotyku pozostaje.
- `?tutorialui=0` wyłącza nową warstwę wizualną.

Kontrola: PL 1920×1080, EN 1280×720, tekst 130%, kliknięcie i klawiatura,
przechodzenie kroków oraz pomijanie wprowadzenia przez symulowane Gamepad API.
Nie jest to weryfikacja na fizycznym padzie. Bez nowych grafik ani shaderów.
