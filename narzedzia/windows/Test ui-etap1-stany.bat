@echo off
setlocal
cd /d "%~dp0"
title Nightbrand - test wersji ui-etap1-stany (tylko podglad)
set "DIR=ui-etap1-stany"
set "PORT=8004"
set "URL=https://github.com/y33bau/nightbrand/archive/refs/heads/ui-etap1-stany.zip"

echo Pobieram wersje testowa ui-etap1-stany (ok. 100 MB, chwile potrwa)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; if(Test-Path 'tmp-ui-etap1-stany'){Remove-Item 'tmp-ui-etap1-stany' -Recurse -Force}; Invoke-WebRequest '%URL%' -OutFile 'ui-etap1-stany.zip'; Expand-Archive 'ui-etap1-stany.zip' -DestinationPath 'tmp-ui-etap1-stany' -Force; if(Test-Path '%DIR%'){Remove-Item '%DIR%' -Recurse -Force}; Move-Item 'tmp-ui-etap1-stany\nightbrand-ui-etap1-stany' '%DIR%'; Remove-Item 'tmp-ui-etap1-stany','ui-etap1-stany.zip' -Recurse -Force"
if errorlevel 1 (
  echo.
  echo Nie udalo sie pobrac gry. Sprawdz polaczenie z internetem.
  pause
  exit /b 1
)

echo.
echo Gra:  http://127.0.0.1:%PORT%
echo Telefon w tej samej sieci Wi-Fi - otworz jeden z adresow:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do echo    http://%%a:%PORT%
echo.
echo Zamknij to okno, aby zakonczyc serwer.
echo.

start "" cmd /c "timeout /t 3 >nul & start http://127.0.0.1:%PORT%"

python -c "" >nul 2>&1
if not errorlevel 1 (
  python -m http.server %PORT% --bind 0.0.0.0 --directory "%DIR%"
  goto :koniec
)
py -3 -c "" >nul 2>&1
if not errorlevel 1 (
  py -3 -m http.server %PORT% --bind 0.0.0.0 --directory "%DIR%"
  goto :koniec
)
echo Brak Pythona - uruchamiam prosty serwer PowerShell (tylko ten komputer).
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serwer-test.ps1" -Root "%~dp0%DIR%" -Port %PORT%
:koniec
pause
