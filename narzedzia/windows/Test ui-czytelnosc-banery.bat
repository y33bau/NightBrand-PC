@echo off
setlocal
cd /d "%~dp0"
title Nightbrand - test wersji ui-czytelnosc-banery (tylko podglad)
set "DIR=ui-czytelnosc-banery"
set "PORT=8007"
set "URL=https://github.com/y33bau/nightbrand/archive/refs/heads/ui-czytelnosc-banery.zip"

echo Pobieram wersje testowa ui-czytelnosc-banery (ok. 100 MB, chwile potrwa)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; if(Test-Path 'tmp-ui-czytelnosc-banery'){Remove-Item 'tmp-ui-czytelnosc-banery' -Recurse -Force}; Invoke-WebRequest '%URL%' -OutFile 'ui-czytelnosc-banery.zip'; Expand-Archive 'ui-czytelnosc-banery.zip' -DestinationPath 'tmp-ui-czytelnosc-banery' -Force; if(Test-Path '%DIR%'){Remove-Item '%DIR%' -Recurse -Force}; Move-Item 'tmp-ui-czytelnosc-banery\nightbrand-ui-czytelnosc-banery' '%DIR%'; Remove-Item 'tmp-ui-czytelnosc-banery','ui-czytelnosc-banery.zip' -Recurse -Force"
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
