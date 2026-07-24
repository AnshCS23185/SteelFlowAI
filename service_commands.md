# Service Ports and Run Commands

To run each service individually in development mode with auto-reload, you can use the following commands. 

*Note: Make sure your virtual environment (`venv`) is activated and you are in the respective module's directory before running these commands. If you run into database connection errors, make sure you add `--env-file .env` or ensure your `PYTHONPATH` is set correctly as it is in `start_all.bat`.*

### Module 1 Service
- **Directory**: `module1-service`
- **Port**: `8001`
- **Command**:
  ```powershell
  uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload 
  ```

### Module 23 Service
- **Directory**: `module23-service`
- **Port**: `8002`
- **Command**:
  ```powershell
  uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload 
  ```

### Module 45 Service (Module 3)
- **Directory**: `module45-service`
- **Port**: `8003`
- **Command**:
  ```powershell
  uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload 
  ```

### Frontend
- **Directory**: `frontend`
- **Port**: `5173`
- **Command**:
  ```powershell
  npm run dev
  ```
