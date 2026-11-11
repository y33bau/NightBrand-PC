# Szlif prezentacji walki — PC, 11.11.2026

1. Trafienia: mocniejsze, kierunkowe szarpnięcie i krótkie odkształcenie sylwetki;
   ciężsi przeciwnicy reagują słabiej. Ciepłe potwierdzenie trafienia zamiast białej
   sylwetki. Osobny odcień kontaktu ze stalą i ciałem. Magia dostaje delikatną
   reakcję sylwetki. Aktywna zapowiedź ataku ma pierwszeństwo przed szarpnięciem.
2. Śmierć: krótki kierunkowy ruch podczas istniejącej animacji upadku, osiadanie
   i późniejszy początek wizualnego rozpadu na popiół. Całkowity czas życia zwłok
   pozostaje taki sam. Łup jest widoczny od razu i delikatnie wyłania się przez
   0,28 s; moment jego utworzenia i dostępność do podniesienia nie zmieniają się.
3. Ostrzeżenia: istniejące promienie zachowane, ciemna obwódka pod kolorowym
   konturem; ważniejsi przeciwnicy mają priorytet w ograniczonej puli. Mały znak
   nad sylwetką pojawia się podczas istniejącej zapowiedzi ataku elit, bossów
   i niebezpiecznych ataków. Uwzględnia obu żywych graczy oraz wysoki kontrast.
   Ogłuszenie lub zamrożenie wyłącza znak zgodnie z dotychczasowym attackCue.
4. Magia: mniejsze, uniesione pociski i poprawione osadzenie rozbłysków trafienia;
   początek lotu wizualnie bliżej ostrza. Efekty statusów podążają za celem.
   Efekty w pobliżu zapowiedzi ataku są przygaszane; ostrzeżenia rysują się nad
   dekoracjami. Warianty materiałów powstają raz na klatkę arkusza i są używane
   ponownie, bez nowych tekstur na każde trafienie.

Pule ostrzeżeń: osiem obszarów z obwódkami i 16 instancji znaku nad głową.
Bez nowych shaderów i plików graficznych. Rozpad używa istniejącego shadera;
zmienia się tylko przebieg wartości już istniejącego parametru wizualnego.

`?combatfx=0` przywraca wcześniejszą prezentację tych czterech obszarów.
Nie zmieniano AI, ruchu, obrażeń, leczenia, zasięgów, kosztów, kolizji, nagród,
czasu zapowiedzi ani ataków. Dodatkowe konstrukcje materiałów i geometrii mają
osobne losowanie wizualne; zachowany jest dotychczasowy koszt leniwego ładowania
materiału potwierdzenia trafienia, aby nie przesuwać sekwencji losowań gry.
