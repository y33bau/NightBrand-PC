@echo off
setlocal
cd /d "%~dp0..\.."
title Nightbrand - gra lokalnie (wersja PC)
set "DIR=%CD%\gra"
set "PORT=8080"
if exist "%DIR%\index.html" goto :start
echo BLAD: nie znaleziono gry w "%DIR%".
echo Uruchom ten plik z folderu narzedzia\windows w repozytorium NightBrand-PC.
pause
exit /b 1

:start
echo.
echo Gra: http://127.0.0.1:%PORT%  (otworzy sie sama w przegladarce)
echo.
echo TEST OFFLINE RECZNIE:
echo  1. Gdy pojawi sie menu, poczekaj ok. 5 minut. Gra zapisuje pliki do pracy bez internetu.
echo  2. Wylacz internet (Wi-Fi albo kabel). To okno ma zostac otwarte.
echo  3. Zamknij karte z gra i otworz adres http://127.0.0.1:%PORT% ponownie (zwykle F5, nie Ctrl+F5).
echo.
echo Zamknij to okno, aby zakonczyc serwer.
echo.
start "" cmd /c "timeout /t 3 >nul & start http://127.0.0.1:%PORT%"
python -c "" >nul 2>&1
if not errorlevel 1 goto :python
py -3 -c "" >nul 2>&1
if not errorlevel 1 goto :py3
echo Brak Pythona - uruchamiam prosty serwer PowerShell.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serwer-test.ps1" -Root "%DIR%" -Port %PORT%
goto :koniec
:python
python -m http.server %PORT% --bind 127.0.0.1 --directory "%DIR%"
goto :koniec
:py3
py -3 -m http.server %PORT% --bind 127.0.0.1 --directory "%DIR%"
:koniec
pause
