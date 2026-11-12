@echo off
setlocal
cd /d "%~dp0..\.."
title Nightbrand - test startu offline (wersja PC)
set "ROOT=%CD%"
set "NB_UI_GAME=%ROOT%\gra"
echo.
echo Test startu offline: gra wczytuje sie z internetu, a potem startuje bez niego.
echo Trwa kilka minut. Nie zamykaj tego okna.
echo.
if exist "%NB_UI_GAME%\index.html" goto :szukaj_node
echo BLAD: nie znaleziono gry w "%NB_UI_GAME%".
echo Uruchom ten plik z folderu narzedzia\windows w repozytorium NightBrand-PC.
goto :koniec_blad

:szukaj_node
set "NODE="
where node >nul 2>&1
if not errorlevel 1 set "NODE=node"
if defined NODE goto :sprawdz_pw
for /f "delims=" %%i in ('dir /s /b "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node.exe" 2^>nul') do if not defined NODE set "NODE=%%i"
if defined NODE goto :sprawdz_pw
echo BLAD: nie znaleziono Node.js.
echo Zainstaluj Node.js ^(wersja LTS, ze strony nodejs.org^) i uruchom ten plik ponownie.
goto :koniec_blad

:sprawdz_pw
"%NODE%" -e "require('./narzedzia/ui-test-runtime.cjs').dependency('playwright')" >nul 2>&1
if not errorlevel 1 goto :sprawdz_przegladarke
echo Brakuje pakietu Playwright ^(steruje przegladarka w tescie, ok. 10 MB^).
set "ODP="
set /p "ODP=Zainstalowac go teraz w folderze narzedzia? Wpisz T i Enter, albo N: "
if /i not "%ODP%"=="T" goto :koniec_blad
pushd "%ROOT%\narzedzia"
call npm install playwright --no-audit --no-fund
popd
"%NODE%" -e "require('./narzedzia/ui-test-runtime.cjs').dependency('playwright')" >nul 2>&1
if not errorlevel 1 goto :sprawdz_przegladarke
echo BLAD: instalacja Playwright sie nie udala. Sprawdz internet i czy dziala polecenie npm.
goto :koniec_blad

:sprawdz_przegladarke
"%NODE%" -e "require('./narzedzia/ui-test-runtime.cjs').browser()" >nul 2>&1
if not errorlevel 1 goto :uruchom
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "NIGHTBRAND_BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if defined NIGHTBRAND_BROWSER goto :uruchom
echo BLAD: nie znaleziono przegladarki Chrome.
echo Zainstaluj Google Chrome i uruchom ten plik ponownie.
goto :koniec_blad

:uruchom
set "NB_TIMEOUT_MULT=4"
"%NODE%" narzedzia\test-offline-start.cjs
set "KOD=%ERRORLEVEL%"
echo.
if not "%KOD%"=="0" goto :wynik_blad
echo ==============================================================
echo  WYNIK: OK. Gra wczytala sie z internetu, a potem wystartowala
echo  rozdzial I bez internetu.
echo  Zrzut ekranu: %ROOT%\narzedzia\offline-start.png
echo ==============================================================
if exist "%ROOT%\narzedzia\offline-start.png" start "" "%ROOT%\narzedzia\offline-start.png"
pause
exit /b 0

:wynik_blad
echo ==============================================================
echo  WYNIK: BLAD ^(kod %KOD%^). Przeczytaj komunikat powyzej.
echo  Zrob zrzut tego okna i wyslij go.
echo ==============================================================
pause
exit /b 1

:koniec_blad
echo.
pause
exit /b 1
