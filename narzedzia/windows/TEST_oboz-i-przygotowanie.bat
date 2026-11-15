@echo off
setlocal
cd /d "%~dp0"
title NightBrand PC - test galezi oboz-i-przygotowanie
set "BR=oboz-i-przygotowanie"
set "DIR=test-oboz-i-przygotowanie"
set "PORT=8031"
set "URL=https://github.com/y33bau/NightBrand-PC/archive/refs/heads/%BR%.zip"

echo Pobieram wersje testowa %BR% (ok. 140 MB, chwile potrwa)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; if(Test-Path 'tmp-%BR%'){Remove-Item 'tmp-%BR%' -Recurse -Force}; Invoke-WebRequest '%URL%' -OutFile '%BR%.zip'; Expand-Archive '%BR%.zip' -DestinationPath 'tmp-%BR%' -Force; if(Test-Path '%DIR%'){Remove-Item '%DIR%' -Recurse -Force}; $src=(Get-ChildItem 'tmp-%BR%' -Directory | Select-Object -First 1).FullName; Move-Item (Join-Path $src 'gra') '%DIR%'; Remove-Item 'tmp-%BR%','%BR%.zip' -Recurse -Force"
if errorlevel 1 (
  echo.
  echo Nie udalo sie pobrac gry. Sprawdz polaczenie z internetem.
  pause
  exit /b 1
)

echo.
echo Gra:  http://127.0.0.1:%PORT%
echo Zamknij to okno, aby zakonczyc serwer.
echo.

start "" cmd /c "timeout /t 3 >nul & start http://127.0.0.1:%PORT%"

python -c "" >nul 2>&1
if not errorlevel 1 (
  python -m http.server %PORT% --bind 127.0.0.1 --directory "%DIR%"
  goto :koniec
)
py -3 -c "" >nul 2>&1
if not errorlevel 1 (
  py -3 -m http.server %PORT% --bind 127.0.0.1 --directory "%DIR%"
  goto :koniec
)
echo Brak Pythona - uruchamiam prosty serwer PowerShell.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serwer-test.ps1" -Root "%~dp0%DIR%" -Port %PORT%
:koniec
pause
