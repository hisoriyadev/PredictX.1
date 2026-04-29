@echo off
title PredictX - Starting Servers
echo.
echo  ==========================================
echo    PredictX - AI Market Trend Oracle v2
echo  ==========================================
echo.

echo  Checking server dependencies...
if not exist "server\node_modules" (
  echo  Installing server dependencies...
  cd server && npm install && cd ..
  echo  Server dependencies installed!
)

echo.
echo  Starting Express API server on port 5001...
start "PredictX API" cmd /k "cd /d %~dp0 && node server/index.js"

timeout /t 2 /nobreak >nul

echo  Starting Vite frontend on port 5173...
start "PredictX Frontend" cmd /k "cd /d %~dp0 && npm.cmd run dev"

timeout /t 4 /nobreak >nul

echo.
echo  Both servers started!
echo  Frontend: http://localhost:5173
echo  API:      http://localhost:5001
echo.
start "" "http://localhost:5173"
