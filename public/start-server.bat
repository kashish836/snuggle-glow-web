@echo off
cd /d %~dp0
echo Starting SnuggleNest Frontend Server...
echo Serving on http://localhost:3000
python server.py
pause

