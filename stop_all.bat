@echo off
echo ===================================================
echo       Stopping SteelFlowAI Development Environment
echo ===================================================
echo.

echo Checking ports: 5173, 8001, 8002, 8003...
echo.

powershell -Command "foreach ($port in 5173, 8001, 8002, 8003) { $pids = (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue).OwningProcess; if ($pids) { foreach ($p in $pids) { Write-Host 'Stopping service on port' $port '(PID:' $p ')...'; Stop-Process -Id $p -Force -ErrorAction SilentlyContinue } } else { Write-Host 'No service running on port' $port } }"

echo.
echo ===================================================
echo All SteelFlowAI services have been stopped.
echo ===================================================
