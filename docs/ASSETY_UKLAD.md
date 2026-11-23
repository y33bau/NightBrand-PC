# Układ zasobów gry (`gra/assets/`)

Wprowadzony po rundzie 633 (12.11.2026). Zasada: **nazwa pliku = SHA-256 jego treści** (po tym gra odświeża pamięć podręczną), **folder = kategoria**.

| Folder | Co tam jest |
|---|---|
| `bohaterowie/` | arkusze postaci grywalnych (Rycerz, Kat, Zabójczyni, Dzwonnik, Milena) |
| `wrogowie/` | arkusze wrogów i bossów, atlas Bestiariusza |
| `npc/` | postacie niezależne i ich portrety |
| `rekwizyty/` | rekwizyty map (klucze `p1_…`–`p5_…`), totem, kocioł |
| `tekstury/` | podłoże, ściany, dachy, woda (klucze `cc0_`, `wl_`, `cy_`, `cz_`, `zl_`, `dm_`, `br_`…) |
| `efekty/` | efekty walki i umiejętności, krew, znaczniki, ślady |
| `ikony/` | ikony umiejętności, perków, wyzwań, Kaplicy |
| `ui/` | ramki, przyciski, menu, plansze skrótów klawiszy, atlas nagłówków |
| `tla/` | tła: intro, zakończenie, Kaplica, chmury |
| `muzyka/` | utwory (intro, rozdziały, krypta) |
| `dzwieki/` | efekty dźwiękowe |
| `czcionki/` | czcionki |

Luzem w `assets/` zostają: `manifest.json`, pliki `.js` i `.css` (CSS ma ścieżki względne `./…`) oraz licencje.

## Jak znaleźć plik
`docs/INDEKS_ASSETOW.json`: dla każdego pliku ścieżka, typ, rozmiar, wymiary, nazwy z kodu (`klucze`), kto go używa (`uzywa`), kategoria i pewność (`klucz` = nazwa z kodu, `css` = tylko CSS, `recznie` = ustalone z kontekstu). Szukaj po nazwie, np. `kaplica` albo `mob_ghoul`.
Odświeżenie spisu po zmianach: `python3 narzedzia/indeks_assetow.py gra docs/INDEKS_ASSETOW.json`.

## Jak dodać lub podmienić zasób
- Nowy plik: `python3 narzedzia/wydaj.py dodaj gra PLIK KATEGORIA [leniwy]` (bez kategorii skrypt przerywa).
- Podmiana obrazu: `python3 narzedzia/podmien_obrazy.py gra LISTA.json`, w `f` stara ścieżka z indeksu (np. `ui/<hash>.webp`); nowy plik trafia do tego samego folderu.
- Plik bez reguły kategorii: `przenies_assety.py` i `indeks_assetow.py` go wypiszą. Regułę dopisz w `narzedzia/assety_wspolne.py` (`PREF`, `NAZWY`, `RECZNE`).
- Kontrola: `python3 narzedzia/sprawdz.py gra` (sprawdza też odwołania w kodzie i układ podfolderów).

## Publikacja
Lista dozwolonych plików `gra/.gitignore` dopuszcza podfoldery kategorii. Nowy folder kategorii wymaga dopisania go w `KATEGORIE` (`assety_wspolne.py`); typ pliku spoza listy (png, webp, avif, svg, mp3, ogg, woff2, ttf) wymaga reguły w `gra/.gitignore`.

## Uwaga: jednorazowe ponowne pobranie
Zmiana ścieżek zmienia adresy wszystkich plików, więc pierwsza aktualizacja gry u każdego gracza pobiera całość od nowa (ok. 130 MB). Dotyczy tylko tej jednej zmiany.

## Źródła dźwięków (licencje)
Stan na 2026-11-23, cache 864, rola gamedev.
- Wcześniejsze efekty: Kenney (CC0, od cache 674) i paczki CC0 z prefiksem `Owlish/…` oraz `Sword …`, `Fireball …` itd. (nazwy w `SFX_SAMPLES`, część 08).
- Cache 864, Kenney (CC0 1.0, https://kenney.nl), pobrane z lustrzanych repozytoriów GitHub z plikiem LICENSE CC0: `Boyquotes/kenney-sci-fi-sounds-for-godot`, `Boyquotes/kenney-impact-sounds-for-godot`. Przycięte, znormalizowane (ffmpeg, mono 44,1 kHz, 96 kb/s):
  - `kenney_rx` (reakcja żywiołów): `force_field_000`
  - `kenney_rare` (rzadka karta): `impact_bell_heavy_001`
  - `kenney_champ` (pojawienie się czempiona): `low_frequency_explosion_001` + `impact_plate_heavy_000`, obniżone
  - `kenney_blastwarn` (lont Wybuchu): `thruster_fire_001`, narastające
  - `kenney_blast` (eksplozja Wybuchu): `explosion_crunch_001`
- CC0 nie wymaga podpisu; zapis tylko po to, by wiedzieć, skąd plik.
- Cache 866, te same lustra Kenney (CC0): `kenney_armor` (cios w Pancerz): `impact_metal_heavy_001`, obniżony; `kenney_summon` (Wezwanie): `slime_000`, obniżony; `kenney_deflect` (odbity pocisk trafia): `impact_plate_heavy_003`. Szał używa istniejącego ryku `creature_roar_02`.
