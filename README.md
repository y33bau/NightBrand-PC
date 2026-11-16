# NightBrand PC

Gra akcji dark fantasy na komputer (Windows). Repo robocze: źródła, narzędzia i zbudowana gra. Zasady dla agentów: `AGENTS.md`. Opis linii: `PC_I_KONSOLE.md`.

- `gra/`: zbudowana gra (limit 500 MB), zip dla itch.io robi `python3 narzedzia/wydaj.py itch gra`.
- `zrodlo/main/`: źródło (edytuj tylko je i `index.html`), build `narzedzia/zbuduj.py`.
- `narzedzia/`: build, `wydaj.py`, `sprawdz.py`, testy. `docs/`: układ assetów.
- Pliki `PC_MENU_*.md`, `PC_HUD_*.md`, `UI_*.md`: raporty dawnych rund (historia, nie reguły).
