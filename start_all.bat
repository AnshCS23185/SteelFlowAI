@echo off
echo ===================================================
echo       Starting SteelFlowAI Development Environment
echo ===================================================
echo.

echo [1/4] Starting Frontend (Vite on port 5173)...
start "SteelFlowAI Frontend" cmd /k "cd frontend & npm run dev"

echo [2/4] Starting Module 1 Service (Port 8001)...
start "SteelFlowAI Module 1" cmd /k "cd module1-service & if not exist venv (python -m venv venv & call venv\Scripts\activate.bat & pip install -r requirements.txt) else (call venv\Scripts\activate.bat) & set PYTHONPATH=%~dp0database;%~dp0shared_auth & uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

echo [3/4] Starting Module 23 Service (Port 8002)...
start "SteelFlowAI Module 23" cmd /k "cd module23-service & if not exist venv (python -m venv venv & call venv\Scripts\activate.bat & pip install -r requirements.txt) else (call venv\Scripts\activate.bat) & set PYTHONPATH=%~dp0database;%~dp0shared_auth & uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload"

echo [4/4] Starting Module 45 Service (Port 8003)...
start "SteelFlowAI Module 45" cmd /k "cd module45-service & if not exist venv (python -m venv venv & call venv\Scripts\activate.bat & pip install -r requirements.txt) else (call venv\Scripts\activate.bat) & set PYTHONPATH=%~dp0database;%~dp0shared_auth & uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload"

echo.
echo ===================================================
echo All services are spinning up in separate windows!
echo Frontend: http://localhost:5173
echo Module 1: http://localhost:8001
echo Module 23: http://localhost:8002
echo Module 45: http://localhost:8003
echo ===================================================
