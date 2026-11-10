@echo off
rem Uruchamia Uporzadkuj-foldery.ps1 (plan, potem TAK; drugie uruchomienie: USUN kasuje _DO_USUNIECIA)
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Uporzadkuj-foldery.ps1"
echo.
pause
