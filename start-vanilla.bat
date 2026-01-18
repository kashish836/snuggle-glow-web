@echo off
echo ========================================
echo   SnuggleNest - Vanilla JS Version
echo ========================================
echo.

echo Starting Backend...
start "SnuggleNest Backend" cmd /k "cd backend && venv\Scripts\activate && python main.py"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "SnuggleNest Frontend" cmd /k "cd public && python server.py"

echo.
echo ========================================
echo   Services Starting...
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press any key to exit...
pause >nul

