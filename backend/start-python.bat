@echo off
echo Starting Python FastAPI Backend for Large Data Processing...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "python\venv" (
    echo Creating virtual environment...
    python -m venv python\venv
)

REM Activate virtual environment
echo Activating virtual environment...
call python\venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r python\requirements.txt

REM Start the FastAPI backend with uvicorn
echo Starting FastAPI backend on port 5000...
echo.
echo API Documentation available at:
echo - Swagger UI: http://localhost:5000/docs
echo - ReDoc: http://localhost:5000/redoc
echo.
uvicorn python.app:app --host 0.0.0.0 --port 5000 --reload

pause
