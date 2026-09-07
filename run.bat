@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing npm dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

echo Building VitalAI frontend...
call npm run build
if errorlevel 1 exit /b 1

if not exist "dist\index.html" (
  echo Frontend build not found. Run npm run build.
  exit /b 1
)

cd backend
if exist "venv\Scripts\activate.bat" (
  call "venv\Scripts\activate.bat"
)

echo Starting VitalAI at http://localhost:8000
python -m uvicorn app.main:app --reload --port 8000
