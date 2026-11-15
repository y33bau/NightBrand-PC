@echo off
chcp 65001 >nul
setlocal
title Nightbrand PC - test: fabula 768
echo.
echo  Nightbrand - wersja PC (repo NightBrand-PC) lokalnie
echo  =====================================
echo.
where git >nul 2>nul
if errorlevel 1 (
  echo Nie znaleziono programu git. Zainstaluj Git for Windows i sprobuj jeszcze raz.
  pause
  exit /b 1
)
set "BRANCH=fabula-scalona-759"
set "NB_BASE=%~dp0"
set "NB_DIR=%NB_BASE%NightBrand-PC-test"
echo.
echo Pobieram galaz %BRANCH% z prywatnego repo y33bau/NightBrand-PC...
echo (Za pierwszym razem Git moze poprosic o zalogowanie do GitHuba w przegladarce.)
echo Ten folder jest tylko do testow i jest kasowany przy kazdym uruchomieniu:
echo %NB_DIR%
echo.
if exist "%NB_DIR%" rmdir /s /q "%NB_DIR%"
git clone --depth 1 --branch "%BRANCH%" https://github.com/y33bau/NightBrand-PC.git "%NB_DIR%"
if errorlevel 1 (
  echo.
  echo NIE UDALO SIE POBRAC. Sprawdz internet, logowanie do GitHuba i nazwe galezi.
  pause
  exit /b 1
)
set "NB_ROOT=%NB_DIR%\gra"
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$m=[regex]::Match((Get-Content -Raw -LiteralPath ($env:NB_ROOT+'\sw.js')),'nightbrand-codex-[0-9-]+'); Write-Host ('Wersja (cache): '+$m.Value)"
echo.
echo Gotowe. Uruchamiam serwer na http://localhost:8766/
echo Przegladarka otworzy sie sama. Zeby zakonczyc, zamknij to okno.
echo Uwaga: zapis gry tej wersji jest osobny od wersji online i od testow na porcie 8765.
echo.
start "" "http://localhost:8766/index.html"
powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((Get-Content -LiteralPath '%~f0' -Raw -Encoding UTF8) -split '(?m)^#PS#\r?$')[1]"
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
