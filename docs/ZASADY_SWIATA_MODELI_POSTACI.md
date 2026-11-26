Stan na 2026-11-24, cache 898, rola agent główny

# Zasady budowania świata, modeli, postaci i bohaterów (zebrane 24.11.2026)

Zebrane z `claude/ZASADY_SWIATA.md`, `ZASADY_MAP_2026-11-12.md`, `SKALA_I_ASSETY.md`, instrukcji projektu, `docs/STAN.md` i rozmowy z autorem 24.11. Przy sprzeczności wygrywa: instrukcje projektu > `AGENTS.md` > `docs/STAN.md` > ten plik. Nie czytano w całości `PODRECZNIK_AGENTA.md`: mogą tam być drobniejsze reguły.

## 0a. WZORZEC STYLU: cache 912 (decyzja autora 26.11.2026: „Wygląda świetnie. Trzymajmy się dokładnie tego stylu”)
Od 912 każda zmiana oprawy ma pasować do tego wyglądu. Nie zmieniaj tych liczb bez zgody autora.
- **Paleta rozdziału na modelach 3D:** `SPOJ_TINT` w części 06 (`meshyMat`), mnożnik koloru modelu: I [.84,.76,.70], II [.84,.75,.68], III Złotogród [.82,.76,.82], IV Czarnobór [.70,.77,.80], V Cytadela [.78,.74,.76], Port [.74,.77,.82], Krypta [.74,.70,.68]. Każdy nowy model 3D przechodzi przez `meshyMat`, więc dostaje paletę automatycznie. Nie omijaj tego własnym materiałem.
- **Dieta efektów:** `SPOJ_FX` w części 17: promienie ×0,6, smugi księżyca ×0,45, mgła ×0,6, deszcz ×0,55. Nowy efekt tylko za zgodą autora i nie mocniej niż obecne.
- **Jeden styl dla jednego rodzaju obiektu na mapie:** nie stawiaj malunku 2D obok modelu 3D tego samego rodzaju (np. drzewa). Nieznany wariant drzewa w Osadzie = model `p1_dead_tree`.
- **Mrok jak w menu:** ciemno poza światłem, wyraźne plamy światła przy ogniskach i latarniach, kolory przygaszone, bez „wyprania”. Wzorem nastroju są ekran główny i Przygotowanie do nocy.
- Porównanie z wyglądem sprzed 912: lokalnie `?spojnosc=0`.

## 0. Decyzje autora z 24.11
- **Styl: 2,5D, bajkowy dark fantasy.** Postacie to sprite'y 2D w świecie 3D. To nadrzędna zasada wyglądu.
- **3D robimy: struktury, obiekty, assety, rekwizyty.** To są **malowane obiekty 3D**: bryła z naszego malunku, tekstura z malunku. Zakaz: bryły z Blendera, modele z galerii i Poly Haven, szare i neutralne tekstury, modele z opisu tekstowego.
- **2D zostaje: postacie, NPC, animacje chodu.** Nie robimy bohaterów ani NPC w 3D na razie (pilot Rycerza i NPC w 3D wstrzymany).
- **Budynki:** z kodu i tekstur autora. Modele TripoSG budynków odrzucone 23.11 („Dramat”). Bryły z malunków tylko jak port (partia6_triposg).

## 1. Świat i mapy
1. Skala: bohater 180 cm = ok. 1,44 j.; 1 j. ≈ 125 cm. Każdy obiekt ma realną wielkość (ognisko mniejsze od człowieka; wóz, brama, szubienica większe; drzewa dużo wyższe). Nowy obiekt: wysokość w m ÷ 1,25 = j.; sprawdź zrzutem z bohaterem obok.
2. Skala zmienia wygląd, nie kolizję. Duży obiekt wystający poza kolizję: zgłoś, nie poprawiaj bez zgody.
3. Nic z kolizją nie stoi na drodze. Po zmianie układu sprawdź dojście od startu do kapliczek i NPC.
4. Rekwizyty stoją na ziemi (2 cm nad nią), nie lewitują, mają ciemny cień kontaktowy.
5. Ogniska: nie w pomieszczeniach; nie na lawie i w 4 polach od lawy i koksowników; nie w 6 polach od kociołka; odstęp 9 pól. Wnętrza: pochodnie i kosze z ogniem przy ścianach, daleko od drzwi. Płomień rysuje kod, model ogniska jest bez płomienia.
6. Cytadela: rekwizyty wzdłuż ścian; środek sal i pasy x16–23 i x56–63 wolne; bez ksiąg, zwojów, kluczy i sakiewek na posadzce.
7. Układ z edytora map autora się nie zmienia (krzyże na cmentarzu, brama sztandarów obozu zakonu).
8. Domy z dachem znikającym po wejściu. Ściany i dachy z tekstur autora. Lawa i woda to animowane shadery (nie podmieniać na statyczne). Efekty ataków zawsze na wierzchu podłoża. Nowych shaderów bez zgody nie dodajemy.
9. Nowe obiekty na mapach robi rola grafik; koncepciarz tylko proponuje.
10. Narzędzia autora (edytory, tryby testowe, przełączniki w adresie) tylko lokalnie (`LOKALNIE` + parametr).

## 2. Modele 3D i assety
1. Metoda: malunek autora → wycięcie (przezroczyste tło, despill) → Real-ESRGAN x4 i zmniejszenie (dłuższy bok ok. 1024) → bryła (TripoSG lokalnie albo Meshy Image→3D) → tekstura rzucona z malunku z kamery gry (`triposg_bake.py`). Do tego potrzebny dokładnie ten PNG, z którego powstała bryła.
2. Drzewa i rekwizyty tylko z naszych malunków. Tekstury z Meshy zmniejszać do 1024 (drzewa 2048). Licencje: malunki nasze, TripoSG MIT; bez RMBG.
3. Nowy obiekt: osobny plik, wpięty 1:1 w miejsce starego, bez zmiany kolizji i bez ruszania atlasów współdzielonych.
4. Dodawanie zasobów: `wydaj.py dodaj` / `rehash`; nazwa pliku = SHA-256; wpis w manifeście i `sw.js`; ręcznie nie ruszać `assets/`.
5. Limity: `gra/` do 500 MB (ostrzeżenie od 450); zip itch.io najwyżej 1000 plików (dziś 962, 28 wolnych).
6. Modele zdjęte z gry 22.11 „do przerobki z malunku” (zwłoki w I i porcie, sztandar klanu i przewrócona kolumna w II, ciała żebraków i latarnia w IV/CH3, klatka w VI/CH5) **nie wracają bez przerobki**: leżą w `P3D_MESHY`, ale były słabe.
7. Partia 8 (66 modeli z malunków, 897) jest aktywna (`P8_ON`); podgląd bez niej tylko lokalnie `?p8=0`. Wystrój z brył Blendera (partia7_rodziny) zdjęty z gry 893, podgląd lokalnie `?rodziny=1`.

## 3. Postacie (sprite'y 2D)
1. Arkusz 1024×1536, 4 kolumny × 6 wierszy, komórka 256 px, stopy na y=243, ta sama skala w każdej komórce, nic nieucięte. Kierunki: bok (w prawo), dół (do kamery, ok. 55°), góra (tyłem). Cztery klatki w wierszu = fazy jednej animacji.
2. Styl: prawdziwy pixel art, twarde krawędzie, bez antyaliasingu, ograniczona paleta, ciemny obrys; postać pokazywana na ok. 64 px, drobne szczegóły upraszczamy.
3. Tło przy generowaniu: czysty cyjan `#00FFFF`. Gemini nie robi sprite'ów postaci ani przezroczystości; ChatGPT odmawia zbyt brutalnych scen (łagodź opis).
4. Wszystkie postacie mają delikatne światło krawędziowe i cień kontaktowy. Wygląd istniejącej postaci zostaje; nowe animacje w tym samym wyglądzie.
5. Arkusze bohaterów są powiększone 2x (886, `?bohx2=0` do porównania).

## 4. Bohaterowie
1. Pięciu: Hadræn (Rycerz/Knight), Goran (Kat/Executioner), Mira (Tancerka Popiołu/Ash Dancer, dawniej Zabójczyni), Iwo (Dzwonnik/Bellringer), Milena (Woskownica/Candlebound). Sześć rozdziałów: I Spalona Osada, II Dolne Miasto, III Solne Nabrzeże (w kodzie CH=6), IV Upadły Złotogród, V Czarnobór, VI Cytadela Wierzycieli.
2. Balans bez zgody autora bez zmian: leczenie przy awansie 10% maks. HP; kociołki 12/10/8% na sekundę; sloty 5, szósty z Darem pieczęci; kooperacja 4+4; bez Hordy i SLASHER; bez zapisu w środku nocy. Zgoda na oprawę to nie zgoda na balans.
3. Pad ma pierwszeństwo przed myszą; zakładki LB/RB; ostrzeżenia to podświetlenie wrogów, nie ikony. Nowy polski napis ma wpis EN w `I18N_DOM`; teksty EN pisane przez agenta są niezatwierdzone; w EN rozdział = „act”.

## 5. Stan rekwizytów 3D (audyt wstępny 24.11, do weryfikacji)
- W tabeli skali (`HUMAN_PROP_SCALE`) 64 rodzaje; w `P3D_MMAP` ma model 37.
- Bez modelu w `P3D_MMAP` (27): chapel_stairs, impaled_head, shrine, debris_fire, order_bonfire, covered_corpses, healing_shrine, fallen_pillar, dwarf_bones, furnace, clan_banner, street_lantern, noble_door, cathedral_gate, beggar_bodies, noble_carriage, pyre, rot_bloom, broken_bell, doorway_bones, cz_fire, cz_skullpole, cz_shrine, cz_cauldron, cz_wisp, cz_crow, cz_walk.
- **Uwaga:** audyt nie uwzględnia modeli partii 8 dostawianych tablicami `P8_C` i `P8_ZA` (np. ogniska `p8f1/3/4/5`). Część z 27 może już mieć model. Przed pracą sprawdzić w grze, nie z samej tabeli.

## 6. Gdzie leżą grafiki (pulpit autora, `NIGHTBRAND`)
- `bohaterowie_do_x2`, `bohaterowie_x2_wynik`: arkusze 5 klas, oryginały i po x2.
- `tekstury_modeli_do_x2`, `tekstury_modeli_x2_wynik`: malunki rekwizytów p1–p5 i `tri_*` (port).
- `modele_meshy`: 68 modeli .glb z Meshy; podfoldery partii (`partia6_triposg`, `partia7_rodziny`, `partia8_z_malunkow`, `pilot_hadraen`, `drzewa_do_3d`, `kociolki_port_do_3d`). `meshy`, `modele meshy`: głównie obrazki.
- `NOWE MODELE` (atlasy „obrazy nowe”, NPC Złotogrodu, menu i tła, tekstury malowane i wzory, woskownica, dzwonnik), `NPC_Aurel_Chojrak_*`, `NPC_Izolda_Ottokar_*`, `NOWE LOGO`, `muzyka propozycje` (Kenney), `narzedzia_tekstury`, `Nowa muzyka`.
- Stare kopie testowe: `review-solne-781`, `test-edytor-menu`.
- Zlecenia dla Claude Code: `ZLECENIE_DLA_CODE_*.md` (bohaterowie x2, tekstury x2, rodziny, wystrój z malunków, piloty 3D).

## 7. Następny krok (do decyzji autora)
Rekwizyty bez modelu przerabiamy **tą samą metodą z malunków** (część 2), nie przywracając słabych modeli z 22.11. Najpierw zweryfikować w grze, które z 27 faktycznie są jeszcze płaskie.
