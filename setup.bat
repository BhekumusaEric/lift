@echo off
echo ========================================
echo LiftLink Development Setup Script
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo Choose the LTS version and make sure to check "Add to PATH"
    echo.
    echo After installing Node.js, run this script again.
    pause
    exit /b 1
)

echo Node.js is installed!
node --version
npm --version
echo.

echo Navigating to frontend directory...
cd liftlink-frontend
if %errorlevel% neq 0 (
    echo ERROR: Could not find liftlink-frontend directory
    echo Make sure you're running this script from the project root
    pause
    exit /b 1
)

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    echo Trying with legacy peer deps...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ERROR: Still failed to install dependencies
        echo Please check your internet connection and try again
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your Supabase credentials are already configured.
echo.
echo To start the development server, run:
echo   cd liftlink-frontend
echo   npm run dev
echo.
echo Then open your browser to: http://localhost:3000
echo.
echo Optional: Get API keys for enhanced features:
echo - Google Maps API: https://console.cloud.google.com/
echo - Stripe API: https://stripe.com/
echo.
pause
