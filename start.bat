@echo off
title Mati Farm Standalone Server
color 06
echo ======================================================================
echo           MATI FARM - ARTISANAL EARTHENWARE STANDALONE
echo ======================================================================
echo Starting independent Mati Farm server on Port 4000...
echo.
cd /d "%~dp0"
start "" http://localhost:4000/
node server.js
pause
