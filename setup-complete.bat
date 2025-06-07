@echo off
setlocal enabledelayedexpansion

REM ==============================================
REM LiftLink Complete Platform Setup Script
REM ==============================================

echo.
echo ================================================
echo    LiftLink Complete Platform Setup
echo ================================================
echo.

REM Function to print status messages
set "CHECK=✓"
set "CROSS=✗"
set "WARNING=!"
set "INFO=i"
set "GEAR=⚙"

echo %GEAR% Starting LiftLink Complete Platform Setup...
echo.

REM Check if Node.js is installed
echo %GEAR% Checking prerequisites...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %CROSS% Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo Choose the LTS version ^(18+^) and make sure to check "Add to PATH"
    echo.
    echo After installing Node.js, run this script again.
    pause
    exit /b 1
)

echo %CHECK% Node.js is installed
node --version
npm --version
echo.

REM Check if we're in the right directory
if not exist "liftlink-frontend" (
    echo %CROSS% Could not find liftlink-frontend directory
    echo Make sure you're running this script from the project root
    pause
    exit /b 1
)

REM Create necessary directories
echo %GEAR% Creating project directories...
if not exist "logs" mkdir logs
if not exist "uploads" mkdir uploads
if not exist "database" mkdir database
if not exist "database\migrations" mkdir database\migrations
if not exist "database\seeds" mkdir database\seeds
if not exist "docs" mkdir docs
if not exist "docs\api" mkdir docs\api
if not exist "docs\architecture" mkdir docs\architecture
if not exist "testing" mkdir testing
if not exist "testing\unit" mkdir testing\unit
if not exist "testing\integration" mkdir testing\integration
if not exist "testing\e2e" mkdir testing\e2e
if not exist "deployment" mkdir deployment
if not exist "deployment\docker" mkdir deployment\docker
if not exist "deployment\kubernetes" mkdir deployment\kubernetes
if not exist "tools" mkdir tools
if not exist "tools\scripts" mkdir tools\scripts
echo %CHECK% Created project directories

REM Setup environment variables
echo %GEAR% Setting up environment variables...
if not exist ".env" (
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo %CHECK% Created .env file from template
        echo %WARNING% Please update .env file with your actual configuration values
    ) else (
        echo %WARNING% .env.example not found, please create .env manually
    )
) else (
    echo %INFO% .env file already exists
)

REM Install root dependencies
echo %GEAR% Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo %CROSS% Failed to install root dependencies
    pause
    exit /b 1
)
echo %CHECK% Root dependencies installed

REM Install frontend dependencies
echo %GEAR% Installing frontend dependencies...
cd liftlink-frontend
npm install
if %errorlevel% neq 0 (
    echo %CROSS% Failed to install frontend dependencies
    echo Trying with legacy peer deps...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo %CROSS% Still failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
)
cd ..
echo %CHECK% Frontend dependencies installed

REM Install backend dependencies
echo %GEAR% Installing backend dependencies...
cd liftlink-backend
npm install
if %errorlevel% neq 0 (
    echo %CROSS% Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo %CHECK% Backend dependencies installed

REM Create service directories and basic files
echo %GEAR% Setting up microservices...

set services=liftlink-admin liftlink-realtime liftlink-payments liftlink-geolocation liftlink-notifications

for %%s in (%services%) do (
    if not exist "%%s" mkdir "%%s"
    if not exist "%%s\src" mkdir "%%s\src"
    
    if not exist "%%s\package.json" (
        echo %GEAR% Creating %%s package.json...
        (
            echo {
            echo   "name": "%%s",
            echo   "version": "1.0.0",
            echo   "description": "LiftLink %%s service",
            echo   "main": "dist/index.js",
            echo   "scripts": {
            echo     "dev": "nodemon src/index.ts",
            echo     "build": "tsc",
            echo     "start": "node dist/index.js",
            echo     "test": "jest"
            echo   },
            echo   "dependencies": {
            echo     "express": "^4.18.2",
            echo     "cors": "^2.8.5",
            echo     "dotenv": "^16.3.1",
            echo     "typescript": "^5.3.3"
            echo   },
            echo   "devDependencies": {
            echo     "@types/express": "^4.17.21",
            echo     "@types/node": "^20.10.4",
            echo     "nodemon": "^3.0.2",
            echo     "ts-node": "^10.9.1"
            echo   }
            echo }
        ) > "%%s\package.json"
    )
    
    if not exist "%%s\src\index.ts" (
        echo %GEAR% Creating %%s entry point...
        (
            echo import express from 'express';
            echo import cors from 'cors';
            echo import dotenv from 'dotenv';
            echo.
            echo dotenv.config^(^);
            echo.
            echo const app = express^(^);
            echo const PORT = process.env.PORT ^|^| 3000;
            echo.
            echo app.use^(cors^(^^)^);
            echo app.use^(express.json^(^^)^);
            echo.
            echo app.get^('/health', ^(req, res^) =^> {
            echo   res.json^({ 
            echo     status: 'OK', 
            echo     service: '%%s',
            echo     timestamp: new Date^(^).toISOString^(^)
            echo   }^);
            echo }^);
            echo.
            echo app.listen^(PORT, ^(^) =^> {
            echo   console.log^(`🚀 %%s running on port ${PORT}`^);
            echo }^);
        ) > "%%s\src\index.ts"
    )
    
    echo %GEAR% Installing %%s dependencies...
    cd "%%s"
    npm install >nul 2>&1
    cd ..
)

echo %CHECK% Microservices setup completed

REM Generate basic documentation
echo %GEAR% Generating documentation...
if not exist "docs\GETTING_STARTED.md" (
    (
        echo # Getting Started with LiftLink
        echo.
        echo ## Prerequisites
        echo - Node.js 18+
        echo - PostgreSQL 13+
        echo - Redis 6+
        echo - Docker ^(optional^)
        echo.
        echo ## Quick Start
        echo 1. Clone the repository
        echo 2. Run `setup-complete.bat`
        echo 3. Update environment variables in `.env`
        echo 4. Run `npm run dev` to start development servers
        echo.
        echo ## Services
        echo - Frontend: http://localhost:3000
        echo - Backend API: http://localhost:3001
        echo - Admin Dashboard: http://localhost:3006
        echo.
        echo For detailed documentation, see the docs/ directory.
    ) > "docs\GETTING_STARTED.md"
    echo %CHECK% Created getting started documentation
)

echo.
echo ================================================
echo    LiftLink Complete Platform Setup Complete!
echo ================================================
echo.
echo %CHECK% Next Steps:
echo   1. Update environment variables in .env file
echo   2. Configure your API keys ^(Google Maps, Stripe, etc.^)
echo   3. Run 'npm run dev' to start development servers
echo   4. Visit http://localhost:3000 to see your app
echo.
echo %INFO% Available Commands:
echo   npm run dev        - Start frontend and backend
echo   npm run dev:all    - Start all services
echo   npm run build      - Build for production
echo   npm run test       - Run tests
echo   docker-compose up  - Start with Docker
echo.
echo %CHECK% Happy coding! 🚗💨
echo.
pause
