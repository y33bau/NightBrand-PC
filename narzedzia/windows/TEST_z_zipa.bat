@echo off
chcp 65001 >nul
setlocal
title Nightbrand PC - test z pliku zip (bez GitHuba)
echo.
echo  Nightbrand - test lokalny z pliku NightBrand_test_*.zip (bez pobierania z GitHuba)
echo  =====================================
echo.
set "NB_BASE=%~dp0"
set "NB_ZIP="
for /f "delims=" %%F in ('dir /b /o-d "%NB_BASE%NightBrand_test_*.zip" 2^>nul') do if not defined NB_ZIP set "NB_ZIP=%NB_BASE%%%F"
if not defined NB_ZIP (
  echo Nie ma pliku NightBrand_test_*.zip w tym folderze.
  pause
  exit /b 1
)
set "NB_DIR=%NB_BASE%NightBrand-test-zip"
echo Rozpakowuje: %NB_ZIP%
echo Do folderu:  %NB_DIR%
if exist "%NB_DIR%" rmdir /s /q "%NB_DIR%"
powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -LiteralPath $env:NB_ZIP -DestinationPath $env:NB_DIR -Force"
if errorlevel 1 (
  echo NIE UDALO SIE ROZPAKOWAC. Zamknij inne okna testu i sprobuj jeszcze raz.
  pause
  exit /b 1
)
set "NB_ROOT=%NB_DIR%"
if exist "%NB_DIR%\gra\index.html" set "NB_ROOT=%NB_DIR%\gra"
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$m=[regex]::Match((Get-Content -Raw -LiteralPath ($env:NB_ROOT+'\sw.js')),'nightbrand-codex-[0-9-]+'); Write-Host ('Wersja (cache): '+$m.Value)"
echo.
echo Gotowe. Uruchamiam serwer na http://localhost:8766/
echo Przegladarka otworzy sie sama. Zeby zakonczyc, zamknij to okno.
echo.
start "" "http://localhost:8766/index.html"
powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((Get-Content -LiteralPath '%~f0' -Raw -Encoding UTF8) -split '(?m)^#PS#\r?$')[1]"
pause
exit /b
#PS#\r?$')[1]"
pause
exit /b
#PS#
$root = $env:NB_ROOT
$mime = @{'.html'='text/html; charset=utf-8';'.js'='application/javascript; charset=utf-8';'.json'='application/json';'.webmanifest'='application/manifest+json';'.css'='text/css';'.webp'='image/webp';'.png'='image/png';'.jpg'='image/jpeg';'.mp3'='audio/mpeg';'.ogg'='audio/ogg';'.wav'='audio/wav';'.txt'='text/plain; charset=utf-8';'.svg'='image/svg+xml';'.woff2'='font/woff2';'.woff'='font/woff';'.ttf'='font/ttf'}
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add('http://localhost:8766/')
$l.Start()
Write-Host ('Serwuje: ' + $root)
while ($l.IsListening) {
  $c = $l.GetContext()
  try {
    $p = [System.Uri]::UnescapeDataString($c.Request.Url.AbsolutePath)
    if ($p -eq '/') { $p = '/index.html' }
    $f = Join-Path $root ($p.TrimStart('/') -replace '/', '\')
    if ((Test-Path -LiteralPath $f -PathType Leaf) -and $f.StartsWith($root)) {
      $b = [System.IO.File]::ReadAllBytes($f)
      $e = [System.IO.Path]::GetExtension($f).ToLower()
      if ($mime.ContainsKey($e)) { $c.Response.ContentType = $mime[$e] } else { $c.Response.ContentType = 'application/octet-stream' }
      $c.Response.AddHeader('Cache-Control', 'no-cache')
      $c.Response.ContentLength64 = $b.Length
      $c.Response.OutputStream.Write($b, 0, $b.Length)
    } else {
      $c.Response.StatusCode = 404
    }
  } catch { }
  try { $c.Response.OutputStream.Close() } catch { }
}
