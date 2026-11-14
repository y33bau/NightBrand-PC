@echo off
setlocal
cd /d "%~dp0"
if not exist "work-solne" mkdir work-solne
xcopy gra work-solne /E /I /Y >nul
python narzedzia/zbuduj.py zrodlo/main work-solne
if errorlevel 1 goto end
where py >nul 2>&1
if errorlevel 1 goto python
py -3 -c "import http.server as h,webbrowser,os; os.chdir('work-solne'); s=h.ThreadingHTTPServer(('127.0.0.1',0),h.SimpleHTTPRequestHandler); webbrowser.open('http://127.0.0.1:'+str(s.server_port)+'/index.html?nabrzeze=1'); s.serve_forever()"
goto end
:python
python -c "import http.server as h,webbrowser,os; os.chdir('work-solne'); s=h.ThreadingHTTPServer(('127.0.0.1',0),h.SimpleHTTPRequestHandler); webbrowser.open('http://127.0.0.1:'+str(s.server_port)+'/index.html?nabrzeze=1'); s.serve_forever()"
:end
if errorlevel 1 pause