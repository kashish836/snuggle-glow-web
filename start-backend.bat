@echo off
echo Starting SnuggleNest Backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing dependencies...
pip install -r requirements.txt --quiet
echo Starting FastAPI server...
python main.py
pause

