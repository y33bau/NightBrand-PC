@echo off
setlocal
cd /d "%~dp0"
title Nightbrand - test wersji ui-etap2-tryby (tylko podglad)
set "DIR=ui-etap2-tryby"
set "PORT=8005"
set "URL=https://github.com/y33bau/nightbrand/archive/refs/heads/ui-etap2-tryby.zip"

echo Pobieram wersje testowa ui-etap2-tryby (ok. 100 MB, chwile potrwa)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; if(Test-Path 'tmp-ui-etap2-tryby'){Remove-Item 'tmp-ui-etap2-tryby' -Recurse -Force}; Invoke-WebRequest '%URL%' -OutFile 'ui-etap2-tryby.zip'; Expand-Archive 'ui-etap2-tryby.zip' -DestinationPath 'tmp-ui-etap2-tryby' -Force; if(Test-Path '%DIR%'){Remove-Item '%DIR%' -Recurse -Force}; Move-Item 'tmp-ui-etap2-tryby\nightbrand-ui-etap2-tryby' '%DIR%'; Remove-Item 'tmp-ui-etap2-tryby','ui-etap2-tryby.zip' -Recurse -Force"
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
