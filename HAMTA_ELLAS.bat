@echo off
echo ====================================
echo TRETEC - HAMTAR ELLAS-PRODUKTER
echo ====================================
echo.
echo Installerar nodvandiga paket...
echo.

python -m pip install requests beautifulsoup4

echo.
echo ====================================
echo Hamtar produkter fran Lasgiganten...
echo ====================================
echo.

python scrape_all_lasgiganten.py

echo.
echo ====================================
echo KLART!
echo ====================================
echo.
echo Tryck valfri tangent for att stanga...
pause
