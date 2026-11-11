# Krew HD — PC, 11.11.2026

`atlas.png`: oryginał wygenerowany na potrzeby gry. Przezroczysty atlas 4 × 2:
cztery organiczne plamy u góry, cztery rozpryski kierunkowe u dołu.
Wersja gry korzysta z kopii o nazwie SHA-256 w manifeście; oryginał pozostaje tutaj.

Implementacja w `zrodlo/main/11_dwoch_graczy_gracz.js`:

- Krótki rozprysk obracany zgodnie z kierunkiem trafienia.
- Nieregularne ślady po trafieniach, śmierci i krwawieniu bossów.
- Stopniowe ciemnienie przez 65 s, wygaszenie najstarszych śladów do 210 s.
- Stałe pule: 64 plamy i 16 rozprysków. Wspólna geometria, osiem tekstur
  przygotowanych raz; brak nowych shaderów i tworzenia materiałów podczas walki.
- Plamy są przypisane do rozdziału, ukrywane daleko od kamery i w innym świecie.
  Powrót z krypty przywraca widoczność zachowanych śladów na powierzchni.
- Rozprysk ukrywa się przy aktywnej zapowiedzi ataku przeciwnika.
- Nowa gra i powrót do menu czyszczą efekty, pozostawiając zasoby do ponownego użycia.
- Dotychczasowe losowania cząsteczek nadal są wykonywane, aby oprawa nie zmieniała
  sekwencji losowań walki. Stare kwadratowe cząsteczki krwi nie są rysowane.
- `?blood=0` przywraca poprzednią krew do porównania. Domyślnie nowy wariant.
  Przy braku załadowanej grafiki działa poprzedni efekt.

Nie zmieniano obrażeń, leczenia, kosztów, łupów, ostrzeżeń ani reguł kooperacji.
