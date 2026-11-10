@echo off
setlocal
cd /d "%~dp0"
title Nightbrand - aktualizacja gry w folderze web
echo Pobieram aktualna gre z GitHub (ok. 75 MB)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; if(Test-Path 'tmp-web'){Remove-Item 'tmp-web' -Recurse -Force}; Invoke-WebRequest -UseBasicParsing 'https://github.com/y33bau/nightbrand/archive/refs/heads/main.zip' -OutFile 'web-main.zip'; Expand-Archive 'web-main.zip' -DestinationPath 'tmp-web' -Force; if(Test-Path 'web'){Remove-Item 'web' -Recurse -Force}; Move-Item 'tmp-web\nightbrand-main' 'web'; Remove-Item 'tmp-web','web-main.zip' -Recurse -Force"
if errorlevel 1 (
  echo.
  echo Nie udalo sie pobrac gry. Sprawdz polaczenie z internetem.
  pause
  exit /b 1
)
echo.
echo GOTOWE. Wersja gry:
findstr /c:"nightbrand-codex-" "web\sw.js"
echo Uruchom "Uruchom gre.bat". Jesli przegladarka pokazuje stara wersje, odswiez Ctrl+F5.
pause
