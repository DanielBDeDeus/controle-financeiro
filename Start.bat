@echo off
setlocal

set PROJECT_PATH=C:\Users\White\Documents\projetos\controle-financeiro
set URL=http://localhost:5173

cd /d "%PROJECT_PATH%"

REM === START DEV SERVER AND CAPTURE PID ===
for /f %%i in ('powershell -command "$p = Start-Process cmd -ArgumentList '/c npm run dev' -PassThru; $p.Id"') do set DEV_PID=%%i

REM === WAIT FOR SERVER ===
:wait
timeout /t 1 >nul
curl %URL% >nul 2>nul
if errorlevel 1 goto wait

REM === OPEN IN NORMAL CHROME ===
start "" "%URL%"

REM === WAIT UNTIL CHROME CLOSES ===
:waitchrome
timeout /t 2 >nul
tasklist /FI "IMAGENAME eq chrome.exe" | find "chrome.exe" >nul
if not errorlevel 1 goto waitchrome

REM === KILL ONLY OUR DEV SERVER ===
taskkill /PID %DEV_PID% /F >nul 2>nul

endlocal