@echo off
echo ========================================
echo   SnuggleNest - Starting All Services
echo ========================================
echo.

echo Starting Backend...
start "SnuggleNest Backend" cmd /k "start-backend.bat"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "SnuggleNest Frontend" cmd /k "start-frontend.bat"

echo.
echo ========================================
echo   Services Starting...
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press any key to exit...
pause >nul

