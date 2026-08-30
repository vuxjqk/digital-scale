@echo off
cd /d "%~dp0"
start "Digital Scale Web" cmd /k "npm run start:web"
ping 127.0.0.1 -n 4 >nul
start "" http://127.0.0.1:3000
