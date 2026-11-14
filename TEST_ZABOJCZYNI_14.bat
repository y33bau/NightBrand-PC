@echo off
setlocal
cd /d "%~dp0gra"
echo NightBrand - nowe arkusze Zabojczyni, cache 713
echo Wybierz Zabojczynie i sprawdz: chod, 5 lekkich ciosow, ciezki,
echo blok, parowanie, unik, Rozszarpanie, Wachlarz Ostrzy i smierc.
echo Zamkniecie tego okna zatrzyma serwer testowy.
where py >nul 2>&1
if errorlevel 1 goto python
py -3 -c "import http.server as h,webbrowser; s=h.ThreadingHTTPServer(('127.0.0.1',0),h.SimpleHTTPRequestHandler); webbrowser.open('http://127.0.0.1:'+str(s.server_port)+'/index.html'); s.serve_forever()"
goto koniec
:python
python -c "import http.server as h,webbrowser; s=h.ThreadingHTTPServer(('127.0.0.1',0),h.SimpleHTTPRequestHandler); webbrowser.open('http://127.0.0.1:'+str(s.server_port)+'/index.html'); s.serve_forever()"
:koniec
if errorlevel 1 pause
