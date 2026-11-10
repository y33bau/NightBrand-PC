# Kanon fabuły i zmiany nazw po redakcji tekstów (10.11.2026)

Stan: redakcja wykonana na wyciągu tekstów z wersji 561 (plik `NIGHTBRAND_teksty_PL_EN_redakcja.txt`, 246 zmienionych wpisów z 1968). **Teksty NIE są jeszcze wgrane do gry.** Do czasu wgrania kod i `SLOWNIK_EN.md` mają stare nazwy; po wgraniu trzeba poprawić słownik według tabeli na dole.

Autor dał wolną rękę („ujednolić spójność fabuły"). Poniżej jeden kanon, pod który przepisano stare warstwy tekstu (STORY_INTRO, komunikaty, zakończenia nocy). Nowa warstwa (FABULA_TXT: akty, Chojrak, kwestie bossów) była wzorcem.

## Kanon
1. **Pakt.** Złotogród zawarł z Nocą Pakt: dostatek i władza pod zastaw. Cztery krainy dały cztery zastawy: Osada ogień, Dolne Miasto kamień, Złotogród krew, Czarnobór życie. Zakon nie dał zastawu, oddał Nocy sumienie i ściąga dług w jej imieniu.
2. **Piętno** jest na **piersi** (nie na ręce). Dług w każdym pokoleniu spłaca jeden Naznaczony. Każdy zerwany zastaw przechodzi do Piętna (cieplejsze po ogniu, cięższe po kamieniu).
3. **Gracz** to najemnik pochodzący ze Spalonej Osady. Zakon szukał go we wsi, nie zastał (był daleko) i spalił wszystkich. Stąd „ostatni dłużnik tej wsi" i „Najemniku" u NPC.
4. **Osada.** Ludzi zamknięto w domach, największą grupę spędzono do **spichlerza** na wzgórzu (nie stodoły); tam wyrósł Zrost, „zrośnięty" (nie „zszyty") z ciał. Brat Wit pilnował drzwi spichlerza. Zejście do Dolnego Miasta: **stary szyb pod spichlerzem** (nie schody pod kaplicą).
5. **Dolne Miasto.** Żyły się kończyły, krasnoludy kopały głębiej, niż pozwalały runy, obudziły to, co śpi pod lawą. Król Cumlin podpisał i dopisał do Paktu górników; kamień przejął ich ciała, ale pracują dalej. Zakon odbiera urobek przy **Wielkiej Wadze** (Poborca, przy nim Cumlin związany pieczęciami). Na powierzchnię jedzie się **windą** („wrota" to wrota windy).
6. **Złotogród.** Kopuły stoją na ciałach wmurowanych w fundamenty. Morhad, dawny rzeźnik miejski, liczy dłużników i znosi ludzi pod **bazylikę** (nie katedrę); wierzy, że trzyma sklepienie. Po jego śmierci pęka pierwszy filar.
7. **Czarnobór.** Leszy pilnuje ścieżek, Pani Lasu strzeże przejścia na północ, a w jej korzeniach, pod kurhanami, śpi Strzyga Matka i to, co las zatrzymał dla Nocy. Teksty działają niezależnie od tego, który z tej trójki jest bossem finałowym.
8. **Cytadela.** Po czterech zastawach zostaje **Pierwszy Wpis**. Dopóki istnieje, ziemie można obciążyć ponownie. Wierzyciel to „Pan Pierwszego Wpisu". Koniec: Pierwszy Wpis płonie, dług wygasa, nikt go nie dziedziczy.

## Nowe drobne fakty dopisane dla logiki (do akceptacji autora)
- Gracz był poza wsią, gdy przyszedł Zakon (wstęp aktu I).
- Sir Bogumił otworzył bramę Zakonowi (wcześniej „Nocy").
- Skazany Skryba trafił do kajdan za jedną pomyłkę w rachunku.
- Rysunek dziecka: postać z czerwoną plamą na piersi (wcześniej „czerwoną ręką").

## Zmiany nazw i terminów (do przeniesienia do SLOWNIK_EN.md po wgraniu)
| PL | było EN | jest EN |
|---|---|---|
| Zrost | The Outgrowth | The Conjoined |
| Arcysędzia Rachmistrz | Arch-Judge Auditor | Arch-Judge Reckoner |
| Zmora | Nightmare | Night Hag |
| Wierzchosława, szeptucha | Anastasija, The Whispering Witch | Wierzchoslava, the Whisperer |
| Heri, wojak z gwardii królewskiej | Heri, The King's Guardian | Heri of the Royal Guard |
| Mila / Marga / Bartosz / OBDYP | „The" wielką literą w środku | „the" małą literą |
| Chojrak, szlachetny paladyn → **Chojrak, paladyn bez Zakonu** | Chojrak, Noble Paladin | Chojrak, Lapsed Paladin |
| Pan Cytadeli Długów → **Pan Pierwszego Wpisu** | Master of the Citadel of Debts | Lord of the First Entry |
| Naznaczony (jedyna forma; „Piętnowany" i „Naznaczeniec" wycofane) | The Branded | The Branded |
| szybki atak / silny atak (wycofane „lekki cios" / „ciężki cios") | quick/strong, blow | light attack / heavy attack |
| Instrukcja | Instructions / manual | Guide |
| katedra → **bazylika** | cathedral | basilica |
| Pieczętarka | The Sealer | w grze postać nazywa się Starszy Księgowy / The Senior Bookkeeper; wpis w słowniku do usunięcia |

Stałe ustalenia pisowni: „Piętno", „Zakon", „Noc", „Pakt", „Pierwszy Wpis", „Wielka Waga" wielką literą; EN zawsze „the Holy Order"; rejestr i księga długu to „ledger".

## Otwarte
- Trzy wpisy mają tekst do tłumaczenia wewnątrz `${...}` i zostały tam zmienione: `13_wrogowie.js:100#1`, `19_hud.js:12#2`, `12_walka.js:171#3`.
- `23_instrukcja_sterowanie.js:38#1` (Krypta prestiżu) przepisano na istniejące komplety zbroi; sprawdzić w kodzie, czy są w tej zakładce.
- `I18N_DOM#81` nadal mówi „X / Y / B" (bez A), bo napis nie może się wydłużyć.
- Teksty nie były oglądane w grze (ramki, telefon, czcionka).