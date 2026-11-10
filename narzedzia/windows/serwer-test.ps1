param([string]$Root,[int]$Port=8001)
$mime=@{'.html'='text/html; charset=utf-8';'.js'='application/javascript; charset=utf-8';'.css'='text/css; charset=utf-8';'.json'='application/json';'.webmanifest'='application/manifest+json';'.png'='image/png';'.webp'='image/webp';'.avif'='image/avif';'.jpg'='image/jpeg';'.mp3'='audio/mpeg';'.ogg'='audio/ogg';'.woff2'='font/woff2';'.txt'='text/plain; charset=utf-8';'.svg'='image/svg+xml'}
$root=(Resolve-Path $Root).Path
$l=New-Object System.Net.HttpListener
$l.Prefixes.Add("http://127.0.0.1:$Port/")
$l.Start()
Write-Host "Serwer: http://127.0.0.1:$Port"
while($l.IsListening){
  $c=$l.GetContext()
  try{
    $p=[Uri]::UnescapeDataString($c.Request.Url.AbsolutePath).TrimStart('/')
    if($p -eq ''){$p='index.html'}
    $f=[System.IO.Path]::GetFullPath((Join-Path $root $p))
    if($f.StartsWith($root) -and (Test-Path $f -PathType Leaf)){
      $b=[System.IO.File]::ReadAllBytes($f)
      $e=[System.IO.Path]::GetExtension($f).ToLower()
      $c.Response.ContentType=$(if($mime.ContainsKey($e)){$mime[$e]}else{'application/octet-stream'})
      $c.Response.AddHeader('Cache-Control','no-cache')
      $c.Response.ContentLength64=$b.Length
      $c.Response.OutputStream.Write($b,0,$b.Length)
    } else { $c.Response.StatusCode=404 }
  } catch { $c.Response.StatusCode=500 }
  $c.Response.Close()
}
