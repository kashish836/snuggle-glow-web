@echo off
echo ========================================
echo   SnuggleNest - STARTING EVERYTHING
echo ========================================
echo.

echo [1/2] Starting Backend on port 8000...
start "SnuggleNest Backend" cmd /k "cd backend && venv\Scripts\activate && python main.py"

timeout /t 5 /nobreak >nul

echo [2/2] Starting Frontend on port 3000...
start "SnuggleNest Frontend" cmd /k "cd public && python -m http.server 3000"

echo.
echo ========================================
echo   SERVICES STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul

