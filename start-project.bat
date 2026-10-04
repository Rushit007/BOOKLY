@echo off
title BOOKLY - Project Launcher
color 0A

echo ========================================================
echo        BOOKLY - Automated Project Launcher
echo ========================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

:: 2. Check Docker (Optional for database)
where docker >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Docker detected. Starting PostgreSQL and Redis containers...
    docker compose up -d
) else (
    echo [WARNING] Docker not found. Assuming local PostgreSQL is running on port 5432.
)

:: 3. Setup Backend
echo.
echo [1/3] Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
if not exist .env (
    if exist .env.example (
        echo Creating backend .env file...
        copy .env.example .env
    )
)
echo Generating Prisma Client...
call npx prisma generate
cd ..

:: 4. Setup Frontend
echo.
echo [2/3] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
if not exist .env.local (
    echo Creating frontend .env.local file...
    echo NEXT_PUBLIC_API_URL=http://localhost:4000 > .env.local
    echo NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_TiGZAxgrQ4uoCX >> .env.local
)
cd ..

:: 5. Launch Both Servers
echo.
echo [3/3] Launching Backend and Frontend in separate windows...
start "BOOKLY Backend (Port 4000)" cmd /k "cd backend && npm run start:dev"
start "BOOKLY Frontend (Port 3000)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   BOOKLY is starting up!
echo   Frontend : http://localhost:3000
echo   Backend  : http://localhost:4000
echo ========================================================
echo Waiting 5 seconds before opening browser...
timeout /t 5 >nul
start http://localhost:3000

echo Done! You can close this terminal.
