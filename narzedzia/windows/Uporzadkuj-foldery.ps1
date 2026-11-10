# Uporzadkuj-foldery.ps1 (Claude, 8.11.2026). Uruchamiany przez Uporzadkuj-foldery.bat.
# Pierwsze uruchomienie: pokazuje plan z rozmiarami, po wpisaniu TAK:
#   1) kopiuje z Documents\PietnoNocy do tego folderu WLASNE MATERIALY, ktorych tu brakuje (nic nie nadpisuje),
#   2) przenosi stare kopie gry, kopie zapasowe i caly Documents\PietnoNocy do _DO_USUNIECIA (natychmiast, ten sam dysk),
#   3) pobiera aktualna gre z GitHub do folderu web (dla "Uruchom gre.bat").
# Drugie uruchomienie (gdy _DO_USUNIECIA istnieje): po wpisaniu USUN trwale kasuje _DO_USUNIECIA.
param([string]$R1 = $PSScriptRoot, [string]$R2 = (Join-Path $env:USERPROFILE 'Documents\PietnoNocy'), [switch]$BezPobierania)
$ErrorActionPreference = 'Continue'
$DEL = Join-Path $R1 '_DO_USUNIECIA'
$LOG = Join-Path $R1 '_PORZADEK_log.txt'

function Rozmiar([string]$p) {
  if (-not (Test-Path -LiteralPath $p)) { return 0 }
  $i = Get-Item -LiteralPath $p -Force
  if (-not $i.PSIsContainer) { return [int64]$i.Length }
  $s = (Get-ChildItem -LiteralPath $p -Recurse -File -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
  if ($s) { return [int64]$s } else { return 0 }
}
function MB([int64]$b) { if ($b -ge 1GB) { '{0:N1} GB' -f ($b / 1GB) } else { '{0:N0} MB' -f ($b / 1MB) } }
function Log([string]$t) { Add-Content -LiteralPath $LOG -Value ((Get-Date -Format 'yyyy-MM-dd HH:mm') + '  ' + $t) -Encoding UTF8 }

Write-Host ''
Write-Host ' Nightbrand: porzadki w folderach' -ForegroundColor Yellow
Write-Host "   Zostaje:  $R1"
Write-Host "   Usuwany:  $R2"
Write-Host ''

# ---- tryb 2: kasowanie _DO_USUNIECIA ----
if ((Test-Path -LiteralPath $DEL) -and -not (Test-Path -LiteralPath $R2)) {
  $s = Rozmiar $DEL
  Write-Host " Folder _DO_USUNIECIA zajmuje $(MB $s)."
  Write-Host ' Usun go dopiero, gdy sprawdzisz, ze gra i Twoje materialy sa na miejscu.'
  $odp = Read-Host ' Wpisz USUN i Enter, aby skasowac go NA ZAWSZE (bez Kosza)'
  if ($odp -ceq 'USUN') {
    Remove-Item -LiteralPath $DEL -Recurse -Force -ErrorAction Continue
    if (Test-Path -LiteralPath $DEL) { Write-Host ' Czesci plikow nie udalo sie usunac (otwarte w innym programie?). Zamknij programy i uruchom ponownie.' -ForegroundColor Red }
    else { Write-Host " GOTOWE. Odzyskano ok. $(MB $s)." -ForegroundColor Green; Log "skasowano _DO_USUNIECIA ($(MB $s))" }
  } else { Write-Host ' Nic nie usunieto.' }
  return
}

# ---- plan ----
# 1) materialy autora z Documents (kopiowane tylko brakujace pliki)
$MAT = @('Baza Zawartości', 'GRAFIKI UI MENU', 'MUZYKA', 'FONTS', 'Sprites GPT', 'SPRITES 64x64', 'skille claude', 'SKILLE GEMINI', 'promo', 'test_kat')
$MATF = @('knight_test.mp4')
# 2) do usuniecia w tym folderze (stare kopie gry i pobrane wersje testowe galezi, stare zrodlo, kopie zapasowe, wyniki starych testow, stare skrypty)
$STARE = @('assets', 'backup', 'demo-hd2d', 'gra-2d', 'naprawa-logo', 'vendor', 'web', 'runda-ui-menu', 'zrodla-ui-menu', 'test-results',
  'fabula', 'hud-oprawa', 'mapa1-eksport', 'wizualia-440', 'mana-bez-cd', 'npc-swiatlo-wyzwania', 'objetosc', 'przyciski-trybow', 'pamiec',
  'nightbrand-itch.zip', 'porownaj-start-e1.bat', 'zbuduj-i-sprawdz-pion.bat',
  'Test fabula.bat', 'Test HUD.bat', 'Test mana.bat', 'Test mapa.bat', 'Test npc-swiatlo.bat', 'Test objetosc.bat', 'Test pamiec.bat', 'Test przyciski.bat', 'Test wizualia.bat')

$doKopii = @(); $bKopii = 0
if (Test-Path -LiteralPath $R2) {
  foreach ($m in $MAT) {
    $src = Join-Path $R2 $m; if (-not (Test-Path -LiteralPath $src)) { continue }
    $base = (Get-Item -LiteralPath $src).FullName.TrimEnd('\', '/')
    foreach ($f in Get-ChildItem -LiteralPath $src -Recurse -File -Force -ErrorAction SilentlyContinue) {
      $rel = $f.FullName.Substring($base.Length).TrimStart('\', '/')
      $dst = Join-Path (Join-Path $R1 $m) $rel
      if (-not (Test-Path -LiteralPath $dst)) { $doKopii += , @($f.FullName, $dst); $bKopii += $f.Length }
    }
  }
  foreach ($m in $MATF) {
    $src = Join-Path $R2 $m; $dst = Join-Path $R1 $m
    if ((Test-Path -LiteralPath $src) -and -not (Test-Path -LiteralPath $dst)) { $doKopii += , @($src, $dst); $bKopii += (Get-Item -LiteralPath $src).Length }
  }
}
Write-Host ' 1) Twoje materialy z Documents\PietnoNocy, ktorych tu brakuje (zostana SKOPIOWANE tutaj):'
Write-Host "      $($doKopii.Count) plikow, $(MB $bKopii)"
$pokaz = $doKopii | ForEach-Object { $_[1].Substring($R1.Length).TrimStart('\', '/').Split([char[]]'\/')[0] } | Sort-Object -Unique
foreach ($p in $pokaz) { Write-Host "        - $p" }
Write-Host ''
Write-Host ' 2) Do przeniesienia do _DO_USUNIECIA:'
$plan = @(); $suma = 0
foreach ($n in $STARE) {
  $p = Join-Path $R1 $n
  if (Test-Path -LiteralPath $p) { $s = Rozmiar $p; $plan += , @($p, $n, $s); $suma += $s; Write-Host ('      {0,-34} {1,10}' -f $n, (MB $s)) }
}
if (Test-Path -LiteralPath $R2) {
  $s = Rozmiar $R2; $plan += , @($R2, 'Documents_PietnoNocy', $s); $suma += $s
  Write-Host ('      {0,-34} {1,10}' -f 'Documents\PietnoNocy (CALY)', (MB $s))
}
Write-Host "      RAZEM: $(MB $suma)" -ForegroundColor Yellow
Write-Host ''
Write-Host ' 3) Pobranie aktualnej gry z GitHub do folderu web (ok. 75 MB), zeby dzialalo "Uruchom gre.bat".'
Write-Host ''
Write-Host ' Zostaje bez zmian m.in.: Baza Zawartosci, GRAFIKI UI MENU, MUZYKA, FONTS, Sprites GPT, SPRITES 64x64, docs, tools,'
Write-Host ' outputs, output, work, Claude outputs, olaf-football, olaf-fc-turbo, pliki .md, "Uruchom gre.bat", serwer-test.ps1.'
Write-Host ''
if ($plan.Count -eq 0 -and $doKopii.Count -eq 0) { Write-Host ' Nie ma nic do zrobienia.'; return }
$odp = Read-Host ' Wpisz TAK i Enter, aby wykonac (nic nie jest jeszcze kasowane, tylko przenoszone)'
if ($odp -cne 'TAK') { Write-Host ' Przerwano. Nic nie zmieniono.'; return }

# ---- wykonanie ----
$bledy = 0
foreach ($k in $doKopii) {
  try { $d = Split-Path -Parent $k[1]; if (-not (Test-Path -LiteralPath $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
    Copy-Item -LiteralPath $k[0] -Destination $k[1] -ErrorAction Stop; Log "skopiowano $($k[0]) => $($k[1])" }
  catch { $bledy++; Write-Host "   BLAD kopiowania: $($k[0])" -ForegroundColor Red }
}
if ($bledy -gt 0) { Write-Host ' Kopiowanie materialow mialo bledy. Przerywam, nic nie przenoszono.' -ForegroundColor Red; return }
Write-Host "   Skopiowano materialy: $($doKopii.Count) plikow."
if (-not (Test-Path -LiteralPath $DEL)) { New-Item -ItemType Directory -Path $DEL -Force | Out-Null }
foreach ($p in $plan) {
  $cel = Join-Path $DEL $p[1]
  if (Test-Path -LiteralPath $cel) { $cel = $cel + '_' + (Get-Date -Format 'HHmmss') }
  try { Move-Item -LiteralPath $p[0] -Destination $cel -ErrorAction Stop; Write-Host "   OK: $($p[1])"; Log "przeniesiono $($p[0]) => $cel" }
  catch { $bledy++; Write-Host "   BLAD: $($p[1]) (otwarty w innym programie? zamknij Eksplorator/edytor i uruchom ponownie)" -ForegroundColor Red }
}
if (-not $BezPobierania) {
  Write-Host '   Pobieram aktualna gre do folderu web...'
  $tmp = Join-Path $env:TEMP 'nightbrand_porzadek'
  try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $ProgressPreference = 'SilentlyContinue'
    if (Test-Path -LiteralPath $tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force }
    New-Item -ItemType Directory -Path $tmp | Out-Null
    Invoke-WebRequest -UseBasicParsing 'https://github.com/y33bau/nightbrand/archive/refs/heads/main.zip' -OutFile (Join-Path $tmp 'main.zip')
    Expand-Archive -Force (Join-Path $tmp 'main.zip') $tmp
    $web = Join-Path $R1 'web'; if (Test-Path -LiteralPath $web) { Remove-Item -LiteralPath $web -Recurse -Force }
    Move-Item -LiteralPath (Join-Path $tmp 'nightbrand-main') -Destination $web
    Remove-Item -LiteralPath $tmp -Recurse -Force
    Write-Host '   OK: web = aktualna gra z GitHub'; Log 'pobrano aktualna gre do web'
  } catch { Write-Host "   Nie udalo sie pobrac gry: $($_.Exception.Message)" -ForegroundColor Red; Write-Host '   Uruchom pozniej Aktualizuj-gre.bat.' -ForegroundColor Red }
}
Write-Host ''
if ($bledy -eq 0) { Write-Host ' GOTOWE.' -ForegroundColor Green } else { Write-Host " Gotowe z bledami: $bledy (szczegoly wyzej)." -ForegroundColor Red }
Write-Host ' Sprawdz gre i swoje materialy. Gdy wszystko jest w porzadku, uruchom ten plik jeszcze raz,'
Write-Host ' aby skasowac _DO_USUNIECIA na zawsze. Lista ruchow: _PORZADEK_log.txt'
