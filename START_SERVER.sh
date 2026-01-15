#!/bin/bash

echo "===================================="
echo "TRETEC LARM - OFFERTSYSTEM"
echo "===================================="
echo ""
echo "Startar servern..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "VARNING: Python 3 är inte installerat!"
    echo "Installera Python från: https://www.python.org/downloads/"
    echo ""
    exit 1
fi

# Install dependencies if needed
echo "Installerar nödvändiga paket..."
pip3 install flask flask-cors reportlab --break-system-packages > /dev/null 2>&1

# Start server
echo ""
echo "Server startar..."
echo ""
echo "Öppna webbläsaren och gå till: http://localhost:5000"
echo ""
echo "Tryck Ctrl+C för att stoppa servern"
echo "===================================="
echo ""

python3 server.py
