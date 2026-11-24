Stan na 2026-11-24, cache 908, rola grafik

# Standard map NightBrand (wzorce: Tristram, Oboz Lotrzyc, Lut Gholein, Doki Kurastu, Athkatla, Valewood, Rynek w Krakowie)

## Zasady
1. Granica mapy jest scenografia (mur, palisada, woda, skaly), nie urywa sie w prozni.
2. Jeden glowny punkt orientacyjny i kilka mniejszych.
3. Drogi maja wlasny material i rytm (latarnie/kosze z ogniem w rownych odstepach).
4. Obiekty w zestawach przy funkcji (stacja NPC, targ, ruina, oboz); luzem tylko rzadki akcent.
5. Pusta przestrzen celowa: srodek placu, polana, nawa (miejsce walki).
6. Roslinnosc w swoim miejscu: drzewa w ogrodach i kepami, nigdy z bruku.
7. Nic nie stoi bez powodu: drzwi w budynku, dzwon w dzwonnicy, sztandar przy bramie/obozie.

## Wdrozone (899-903, galaz runda-sens-map-898, porownanie lokalnie ?std=0 i ?p8sens=0)
- sensDecor / mapStandard (czesc 07): sztandary Zakonu tylko przy ognisku obozu, krolewskie parami; drobiazgi Osady i Zlotogrodu tylko przy scianach (R=3 / R=2); drzewa Zlotogrodu tylko w ogrodach (56), trawa nie z bruku.
- P8_BEZ_SENSU (czesc 06): 14 doklejek partii 8 wylaczonych (bramy, fasady, drzwi krypt, schody, ruiny, dzwon, drugie posagi, pomost).
- Zgnilizna w Zlotogrodzie ciemna zamiast neonowej.
- Dolne Miasto: nawy boczne wielkiej sali - rzad grobow pod zachodnim murem, zbrojownia wzdluz krawedzi przepasci.

## Wdrozone 904-908 (galaz runda-mapy-standard-902)
- Posadzki z tekstur autora (folder NOWE MODELE): tp_granit ("Chlodny granitowy bruk twierdzy"), tp_ciosy_jasne (zl_ciosy_jasne); mapa wypuklosci z jasnosci. Kod: naveFloor/rynekFloor/laneFloor (czesc 05), skala worldSurfN = jednostki swiata na powtorzenie (4 = duze plyty).
- Dolne Miasto: nawa i droga przez most z granitu z kraweznikiem. Zlotogrod: rynek z jasnych ciosow, okrag wokol fontanny, wszystko na osi x 52,5 (fontanna przesunieta). Cytadela: dwa korytarze z granitu od dziedzinca do tronu.
- Port: ladunek (beczki, skrzynie, worki soli) tylko pod magazynami (R3) albo na skraju nabrzeza (R2 od wody).
- Czarnobor: samotne drzewa dostaja 1-2 drzewa tego samego gatunku (tylko na terenie wolnym 5x5, z dala od NPC/kociolkow/startu), kosci i krzaki z czaszkami tylko przy drzewach i kamieniach.

## Wdrozone 911 (galaz runda-klimat-map-911, porownanie lokalnie ?klimat=0)
- Klimat Diablo: swiatlo ogolne i niebo nizej (I/VI port x0,7, II/V x0,76-0,78, III x0,8, IV x0,84, krypta x0,8), mgla gestsza (port rzadsza, ciemniejsza), mocniejszy kontrast; swiatlo bohatera cieplejsze, zasieg +10-18%; winieta mocniejsza (.56 zamiast .72). Kod: blok KLIMAT_ON w czesci 03, winieta w 08.
- Zestawy pod tylnymi scianami (klimatDress, czesc 06): Osada (worki, kosze, kloda, wiadro), Dolne Miasto (beczki, smola, kamien runiczny), Cytadela (kufry, stol z ksiegami, relikwiarz; bez pasow x15-24 i x55-64). Tylko pod ciagla sciana, poza drogami, przejsciami i 4,5 pola od NPC/kociolkow/startu; wieksze z kolizja. Dojscie do NPC i kociolkow sprawdzone (BFS).

## Wnioski z prob (czego NIE robic)
- Latarnie dokladane na alei Zlotogrodu dublowaly kosze z ogniem - wycofane.
- Material posadzki w Dolnym Miescie: atlas ma tylko zwykly kamien (0,3), zlote zylki (1, autor krytykowal jako "linie techniczne") i lawe (5, mylace) - bez nowej tekstury nie da sie zrobic nawy/dywanu.
- Dodatkowe filary (kafel 22) rysuja sie losowo jako ulamane kikuty - nie uzywac do kolumnad.

## Do zrobienia (kolejnosc)
1. Osada: stacje NPC jak w Obozie Lotrzyc (zestaw rekwizytow + swiatlo przy postaci).
2. Dolne Miasto: skala - hale 52x52 pol, rekwizyty 1 pole. Potrzebne duze obiekty (stoly klanowe, trony, piece) albo podzial hal scianami; nowa tekstura posadzki nawy (prompt Gemini).
2. Solne Nabrzeze: skrzynie/beczki przy magazynach i kei, statek przy kei, latarnia jako punkt orientacyjny.
3. Czarnobor: drzewa kepami, skaly jako sciany, polany z jedna scena.
4. Cytadela: wyposazenie przy scianach wg funkcji sali (srodek wolny - decyzja autora 15.11).
5. Osada: stacje NPC jak w Obozie Lotrzyc (murek, 1-2 pochodnie, zestaw rekwizytow).
