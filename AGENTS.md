# Zasady dla agentów (Claude, Codex)

## Narzędzia autora tylko lokalnie (decyzja autora 14.11.2026)
- Edytor menu, edytory map, tryby testowe, kody deweloperskie i każde podobne narzędzie mają działać WYŁĄCZNIE na komputerze autora: adres 127.0.0.1 / localhost / [::1] albo plik (file:), i dodatkowo dopiero po parametrze w adresie (np. `?edytor=1`).
- W wersji dla graczy (itch.io, GitHub Pages, każdy inny adres) takie narzędzia muszą być zablokowane, także po ręcznym dopisaniu parametru.
- Wzór warunku: stała `LOKALNIE` w `zrodlo/main/27_menu_usprawnienia.js` (edytor układu menu). Każde nowe narzędzie autora używa tego samego warunku.
- Pozostałe zasady: instrukcje projektu i najnowsze przekazanie w projekcie „Nightbrand - workspace”.
