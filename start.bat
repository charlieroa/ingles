@echo off
cd /d "%~dp0"
start /min cmd /c "py -m http.server 8088"
timeout /t 1 >nul
start "" "http://localhost:8088"
