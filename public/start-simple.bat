@echo off
cd /d %~dp0
echo ========================================
echo   Starting SnuggleNest Frontend
echo ========================================
echo.
echo Using Python's built-in HTTP server...
echo.
python -m http.server 3000

