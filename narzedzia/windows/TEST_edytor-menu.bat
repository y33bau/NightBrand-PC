@echo off
setlocal
cd /d "%~dp0"
title Nightbrand - TEST edytora menu
set "DIR=test-edytor-menu"
set "PORT=8017"
if exist "test-edytor-menu.zip" (
  echo Rozpakowuje wersje testowa z edytorem menu...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; if(Test-Path '%DIR%'){Remove-Item '%DIR%' -Recurse -Force}; Expand-Archive 'test-edytor-menu.zip' -DestinationPath '%DIR%' -Force; Remove-Item 'test-edytor-menu.zip' -Force"
)
if not exist "%DIR%\index.html" (
  echo Brak wersji testowej. Popros Claude'a o ponowne wgranie.
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
powershell -NoProfile -ExecutionPolicy Bypass -Command "$r=(Resolve-Path '%DIR%').Path;$m=@{'.html'='text/html; charset=utf-8';'.js'='application/javascript';'.css'='text/css';'.json'='application/json';'.png'='image/png';'.webp'='image/webp';'.mp3'='audio/mpeg';'.svg'='image/svg+xml';'.ttf'='font/ttf';'.txt'='text/plain'};$l=New-Object Net.HttpListener;$l.Prefixes.Add('http://127.0.0.1:%PORT%/');$l.Start();while($l.IsListening){$c=$l.GetContext();try{$p=[Uri]::UnescapeDataString($c.Request.Url.AbsolutePath).TrimStart('/');if($p -eq ''){$p='index.html'};$f=[IO.Path]::GetFullPath((Join-Path $r $p));if($f.StartsWith($r) -and (Test-Path $f -PathType Leaf)){$b=[IO.File]::ReadAllBytes($f);$e=[IO.Path]::GetExtension($f).ToLower();$c.Response.ContentType=$(if($m.ContainsKey($e)){$m[$e]}else{'application/octet-stream'});$c.Response.OutputStream.Write($b,0,$b.Length)}else{$c.Response.StatusCode=404}}catch{$c.Response.StatusCode=500};$c.Response.Close()}"
:koniec
pause
