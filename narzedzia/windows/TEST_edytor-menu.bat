@echo off
setlocal
cd /d "%~dp0"
title Nightbrand - TEST edytora menu (galaz edytor-menu-super)
set "DIR=test-edytor-menu"
set "PORT=8017"
set "URL=https://github.com/y33bau/NightBrand-PC/archive/refs/heads/edytor-menu-super.zip"
echo Pobieram wersje testowa z edytorem menu (chwile potrwa)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; if(Test-Path 'tmp-edytor'){Remove-Item 'tmp-edytor' -Recurse -Force}; Invoke-WebRequest '%URL%' -OutFile 'edytor.zip'; Expand-Archive 'edytor.zip' -DestinationPath 'tmp-edytor' -Force; if(Test-Path '%DIR%'){Remove-Item '%DIR%' -Recurse -Force}; $g=Get-ChildItem 'tmp-edytor' -Directory | Select-Object -First 1; Move-Item (Join-Path $g.FullName 'gra') '%DIR%'; Remove-Item 'tmp-edytor','edytor.zip' -Recurse -Force"
if errorlevel 1 (
  echo.
  echo Nie udalo sie pobrac gry. Sprawdz polaczenie z internetem.
  pause
  exit /b 1
)
echo.
echo Edytor menu: http://127.0.0.1:%PORT%/?edytor=1
echo Zamknij to okno, aby zakonczyc serwer.
echo.
start "" cmd /c "timeout /t 3 >nul & start http://127.0.0.1:%PORT%/?edytor=1"
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
