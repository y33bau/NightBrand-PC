Stan na 2026-11-17, cache 809, rola agent główny

# Propozycje zmian: instrukcje projektu, AGENTS.md i poradnik agenta

Nowe konto nie widzi projektu w claude.ai, więc **wszystko, co ma obowiązywać każdego agenta, powinno leżeć w repo** (`AGENTS.md` + `docs/`). Instrukcje projektu w claude.ai mogą zostać, ale jako skrót, który odsyła do repo.

## Najważniejsze rekomendacje (polecam wszystkie trzy)

1. **Jedno źródło prawdy w repo:** `AGENTS.md` (zasady) + `docs/STAN.md` (dzisiejsze DO_ZROBIENIA) + `docs/PODRECZNIK_AGENTA.md` (mapa kodu i przepisy). Powód: każde konto i każdy agent (Claude, Codex) czyta to samo, niezależnie od dostępu do projektu.
2. **Logi sesji też w repo** (`docs/logi/LOG_SESJI_*.md`), dopisywane w tym samym commicie co runda. Powód: dziś historia jest tylko w projekcie claude.ai i ginie przy zmianie konta.
3. **Ujednolicić sprzeczności** (lista w części C) jedną decyzją autora.

---

## A. Proponowany nowy tekst instrukcji projektu (do wklejenia na nowym koncie)

```
NIGHTBRAND: INSTRUKCJE PROJEKTU (stan 17.11.2026)
Kolejność ważności: te instrukcje > AGENTS.md w repo > docs/STAN.md w repo > ostatni log w docs/logi/ > reszta. Dokument starszy niż ostatni log to historia.

START KAŻDEJ SESJI (bez tego nie zaczynaj pracy)
1. Poproś o dostęp do folderu gry: C:\Users\Admin\Desktop\NIGHTBRAND (~/Desktop/NIGHTBRAND).
2. Podepnij repo y33bau/NightBrand-PC z prawem push. Jeśli filtr odrzuci, poproś autora o zdanie „podepnij repo y33bau/NightBrand-PC z prawem push” i ponów.
3. Stan sprawdzaj komendami: git log -3 i cache w gra/sw.js. Potem przeczytaj AGENTS.md i docs/STAN.md.

Rozmawiamy otwarcie, partnersko: jestem twoim przełożonym w projekcie, ale też kolegą, więc bądźmy wobec siebie szczerzy.

FAKTY
1. Gra na KOMPUTER (Windows; klawiatura, mysz, pad). Nie jest mobilna; dotyk usunięty (782–783). Nie pisz o telefonie.
2. Repo robocze: y33bau/NightBrand-PC (tylko tam pracujesz). y33bau/nightbrand-backup: kopia zapasowa, odświeżana po każdej publikacji. y33bau/nightbrand (Pages, 562): zamrożone.
3. Publikacja: itch.io (zip HTML5, maks. 1000 plików; robi go wydaj.py itch). Wersja Windows w Electronie: czeka. Xbox tylko rozważany. Wgrywa autor.
4. Limit folderu gra/: 500 MB (sprawdz.py: błąd >500, ostrzeżenie od 450).
5. 5 bohaterów (Hadræn/Rycerz, Goran/Kat, Mira/Zabójczyni, Iwo/Dzwonnik, Milena/Woskownica), 6 rozdziałów (I–VI, III = Solne Nabrzeże).
6. Wersja = cache w gra/sw.js + commit. Nie wymyślaj numerów.

ZASADY PRACY
7. Edytuj tylko zrodlo/main/*.js i index.html. Build: zbuduj.py → wydaj.py wersja (sprawdz.py: WYNIK OK). Zasoby: wydaj.py dodaj / rehash.
8. Każda runda na nowej gałęzi od main. Merge --ff-only i push TYLKO na „publikuj” / „wrzucaj”. Po publikacji: log w docs/logi/, aktualizacja docs/STAN.md, kopia w nightbrand-backup, zip itch.io na pulpit.
9. Pracuj rolami (nightbrand-agent-glowny, -gamedev, -grafik, -koncepciarz, -recenzent); w meldunku podaj rolę. W rundzie kod zmienia jedna rola. Koncepciarz i recenzent niczego nie wdrażają.
10. Balans (leczenie przy awansie 10%, „Bez litości”, sloty 5/6, kooperacja 4+4) tylko za zgodą autora. Niezamówionych rzeczy nie dotykaj: usterkę zgłoś i zapytaj.
11. Nie obiecuj działania na padzie, w dźwięku ani na itch.io bez sprawdzenia. W meldunku zawsze: czego NIE sprawdzono.
12. Test dla autora: zip NightBrand_test_<cache>.zip na pulpit (SendUserFile → device_commit_files), autor klika TEST_z_zipa.bat. Pliki zapisuj na pulpit od razu.

AUTOR
13. Rzeczoznawca majątkowy, w IT początkujący, logicznie bardzo sprawny. Dyktuje po polsku (literówki życzliwie). Odpowiadaj po polsku, krótko, wynik najpierw, jedna polecana opcja z uzasadnieniem. Nie każ mu uruchamiać gita ani pisać .bat.
14. Teksty EN pisane przez agenta oznaczaj jako niezatwierdzone.
15. Nowy dokument zaczyna się linią: „Stan na RRRR-MM-DD, cache N, rola X”.
```

**Co się zmienia względem obecnej wersji (16.11) i dlaczego:**
- Pkt 4 („sprawdz.py ma stare progi 250/200”) jest nieaktualny: progi 500/450 są już w kodzie. Usuwam.
- Kolejność ważności wskazuje repo zamiast projektu, bo nowe konto nie widzi projektu.
- Dopisane obejście odmowy `add_repo` (zdarzyło się 16.11).
- Imiona bohaterów i rozdział III wpisane wprost, bo stary agent zna tylko trzech bohaterów i pięć rozdziałów.
- Zasada testu przez zip + `TEST_z_zipa.bat`: była tylko w DO_ZROBIENIA.
- Po publikacji dochodzi zip itch.io (autor go potrzebuje do wgrania).

---

## B. AGENTS.md w repo (propozycja zmian)
Obecny `AGENTS.md` jest dobry; proponuję dopisać:
1. **Sekcję „Start sesji”** (3 kroki jak wyżej) i informację, że stan bieżący jest w `docs/STAN.md`, a nie tylko w projekcie claude.ai.
2. **Pkt 2:** „nightbrand-backup odświeżamy po każdej publikacji: `git archive main` z NightBrand-PC → nadpisanie zawartości (bez `.git`) → commit → push main”.
3. **Pkt 12** zamienić na: „Bieżący stan: `docs/STAN.md`; logi: `docs/logi/`; mapa kodu: `docs/PODRECZNIK_AGENTA.md`”.
4. **Nową sekcję „Testy i pliki dla autora”:** zip na pulpit + `TEST_z_zipa.bat`, `wydaj.py itch`, haczyk `mktest.py` (`window.__t`).

---

## C. Sprzeczności do rozstrzygnięcia (decyzja autora)

| # | Gdzie | Sprzeczność | Polecam |
|---|---|---|---|
| 1 | skill agenta głównego | „nightbrand-backup zamrożony, nie pushuj” vs instrukcje „odświeżaj po publikacji” | odświeżać (tak robimy od 17.11) |
| 2 | skille grafika i recenzenta | budżet 250 MB / ostrzeżenie 200 MB vs decyzja 500 MB | 500/450 wszędzie |
| 3 | skill agenta głównego | „autor testuje przez TEST_*.bat, który pobiera gałąź z GitHuba” vs praktyka: zip + `TEST_z_zipa.bat` (GitHub u autora jest wolny) | zip jako domyślny |
| 4 | skill agenta głównego | „przeczytaj PROJEKT KONTEKST, PRZEKAZANIE_NOWY_AGENT_2026-11-15…” (dokumenty tylko w projekcie) | wskazać pliki w repo |
| 5 | kod vs kanon | Zabójczyni EN „Assassin” (HEROES) vs „Ash Dancer” (AGENTS.md, słownik) | decyzja autora; potem jedna poprawka w `22_postac_zapis_ustawienia.js` |
| 6 | Opcje → Grafika | teksty o „telefonie i tablecie” i baterii | usunąć (gra PC) |
| 7 | lista klawiszy | „Wybór karty 1 2 3”, a kart jest 4 | dopisać 4 |
| 8 | DO_ZROBIENIA | odwołanie do `docs/PLAN_ELECTRON_WINDOWS.md`, a pliku nie ma w repo | albo napisać plan, albo usunąć odwołanie |

---

## D. Poradnik agenta (PODRECZNIK_AGENTA.md): co poprawić

Obecny poradnik opisuje stan z **4.11.2026 (cache 426)**. Mapa kodu jest w większości dobra; nieaktualne są repozytoria, przepisy publikacji, testy i część pułapek. Proponuję przenieść go do repo jako `docs/PODRECZNIK_AGENTA.md` z poniższymi zmianami.

**Nagłówek:** „stan opisu 17.11.2026, cache 809; stan bieżący: docs/STAN.md”. Usunąć odwołania do PRZEKAZANIE_CODEX_* i do `#sArc`.

**§1 Gdzie co jest: przepisać.**
- Jedno repo `y33bau/NightBrand-PC`: `zrodlo/main/` (**28 części, 00–27**), `narzedzia/`, `gra/`, `teksty/`, `docs/`, `AGENTS.md`.
- Dopisać część `27_menu_usprawnienia` (nowe menu, ekran powitalny `#nbPow`, Instrukcja/Pauza/Kronika/Kaplica wg makiet, `LOKALNIE`, CSS menu w JS z prefiksami `${O}`/`${Z}`).
- Usunąć opis Actions, Pages i gałęzi `kopia/…`.

**§2 Mapa kodu: dopisać.**
- Rozdziały: `CH` 1–5 jak dawniej + **`CH=6` Port / Solne Nabrzeże** (`PORT=6`, `CAMPAIGN=[1,2,6,3,4,5]`, `S.solne`). W kampanii port to rozdział III.
- Czas nocy: `NIGHT=960`, `BREAK_AT=480`, kram Margi `wait:120` (`startBreak` w 15), kociołki `S.pot` odnawiane w `startBreak`.
- Instrukcja: `manPage(id)` w 23; helpery `mBox`, `mP`, `mUl`, `mK` (klawisz), `mKb` (klawisz z ustawień), `mPad` (linia pada). Zakładki: `start`, `char`, `slasher`, `style`, `ash`, `world`.
- Klawisze: `KB_DEF` / `KB.map` (09), `kbName()`.
- Awans: `openLevelUpNow` (14), 4 karty, klawisze 1–4, R przerzut.
- Bohaterowie: `HEROES` (22), `q.char` w `r|k|z|d|m`.

**§2a2 Klasy postaci: przepisać** na pięć klas (dopisać Dzwonnika `d` i Woskownicę `m`). **Poprawić błąd:** `who` brak = **Rycerz** (`(d.who||'r')`), nie „wszyscy”. Flagi klas sprawdzać we wszystkich pięciu wariantach.

**§3–5 Przepisy: przepisać pod jedno repo.**
- A: `zbuduj.py zrodlo/main gra` → `wydaj.py wersja gra "…"`.
- B: `wydaj.py dodaj gra PLIK KATEGORIA`; dopisać brak `usun` i ikony `icon-*.png` bez hasha.
- C: publikacja i kopia jak w przekazaniu §5 + `wydaj.py itch`.
- Usunąć Pages, WebFetch sw.js, iPhone.
- Dopisać pułapkę `OSTATNI_BUILD.txt` po próbnym buildzie.

**§6 Testy: przepisać.**
- Haczyk `window.__t` (`narzedzia/teksty/mktest.py`); dawny `window.__T` nie istnieje.
- Start nocy i awans przez `__t` (jak w przekazaniu §4); `#start1` ukryty; `sessionStorage.nbPow=1`.
- `dymny.js` uruchamiać z `narzedzia/`.
- Testy UI, które nie pasują do nowego menu, oznaczyć jako przestarzałe.

**§7 Pułapki:**
- Usunąć: Safari/iPhone, tablet, „Na tablecie wąskim gardłem jest GPU”, zakaz przepuszczania plików gry przez mostek. Zipy przez `SendUserFile` + `device_commit_files` działają; nie przepuszczaj tylko pojedynczych webp, które trafiają wprost do folderu gry.
- Zmienić: „Logo główne” → nowe logo z 809 (`ui/9a743efa…`, źródła `docs/logo/`).
- Dopisać: `add_repo` odrzucany przez filtr (obejście w instrukcjach); `pkill -f` ze stringiem z własnego polecenia zabija własną powłokę; po `wydaj.py dodaj` podmień hash w źródle i przebuduj.

**§8: dopisać** zakaz projektowania pod konsole bez zgody i zakaz rozwijania kodu dotyku.

---

## E. Drobne usprawnienia narzędzi (za zgodą, rola gamedev)
1. `wydaj.py usun gra HASH`: usuwa plik, wpis z manifestu i z `sw.js`; odmawia, jeśli hash występuje w źródle lub CSS.
2. `narzedzia/stan.py`: wypisuje cache, commit, rozmiar `gra/`, liczbę plików zipa i gałęzie czekające. Skraca start sesji do jednego polecenia.
3. Dostosować testy UI do nowego menu (lista w przekazaniu §4).
