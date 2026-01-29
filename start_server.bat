@echo off
echo ==========================================
echo    URUCHAMIANIE SERWERA 2020 FIGHTERS
echo ==========================================
cd server
echo.
echo Sprawdzam czy Node.js jest zainstalowany...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo BLAD: Nie znaleziono Node.js!
    echo Musisz zainstalowac Node.js ze strony: https://nodejs.org/
    echo.
    pause
    exit
)

echo.
echo Startuje serwer...
echo.
node index.js
pause
