@echo off
echo ====================================
echo TRETEC LARM - OFFERTSYSTEM
echo ====================================
echo.
echo Startar servern...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo VARNING: Python är inte installerat!
    echo Installera Python från: https://www.python.org/downloads/
    echo.
    pause
    exit /b
)

REM Install dependencies if needed
echo Installerar nödvändiga paket...
pip install flask flask-cors reportlab --break-system-packages >nul 2>&1

REM Start server
echo.
echo Server startar...
echo.
echo Öppna webbläsaren och gå till: http://localhost:5000
echo.
echo Tryck Ctrl+C för att stoppa servern
echo ====================================
echo.

python server_v3.py

pause
