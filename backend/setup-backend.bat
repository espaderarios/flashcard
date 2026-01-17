@echo off
REM Backend Setup Helper Script for Windows
REM This script helps configure the Groq API key for the flashcard backend

echo.
echo ================================
echo 🚀 Flashcard Backend Setup
echo ================================
echo.

REM Check if we're in the right directory
if not exist "server.js" (
    echo ❌ Error: server.js not found!
    echo Please run this script from the backend\ directory
    echo.
    echo Usage:
    echo   cd backend
    echo   setup-backend.bat
    pause
    exit /b 1
)

echo Step 1: Checking for .env file...
if exist ".env" (
    echo ✅ .env file exists
    echo.
    echo Current configuration:
    findstr "GROQ_API_KEY" .env || echo    ⚠️  GROQ_API_KEY not set
    findstr "PORT" .env || echo    ⚠️  PORT not set (using default: 5000)
) else (
    echo ⚠️  .env file not found
    echo.
    echo Creating .env from .env.example...
    if exist ".env.example" (
        copy .env.example .env
        echo ✅ .env file created from .env.example
    ) else (
        echo Creating new .env file...
        (
            echo # Groq API Configuration
            echo # Get your API key from: https://console.groq.com
            echo GROQ_API_KEY=
            echo.
            echo # Server Configuration
            echo PORT=5000
            echo NODE_ENV=development
        ) > .env
        echo ✅ .env file created
    )
)

echo.
echo Step 2: Groq API Key Configuration
echo ==================================
echo.
echo To use AI features (generate cards/quizzes, you need a Groq API key:
echo.
echo 1. Go to: https://console.groq.com
echo 2. Sign up or log in
echo 3. Create a new API key
echo 4. Copy the key (starts with 'gsk_'^)
echo.
echo Then, edit the .env file and set:
echo    GROQ_API_KEY=gsk_YOUR_KEY_HERE
echo.

echo Step 3: Installing dependencies...
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo npm found. Running: npm install
    call npm install
    if %errorlevel% equ 0 (
        echo ✅ Dependencies installed
    ) else (
        echo ❌ npm install failed
        pause
        exit /b 1
    )
) else (
    echo ⚠️  npm not found. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo.
echo ================================
echo ✅ Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. Edit backend\.env and add your Groq API key
echo 2. Run: npm start
echo 3. Backend will run on http://localhost:5000
echo.
echo To test if everything works:
echo   - Open http://localhost:5000/api (should show API endpoints^)
echo   - Try generating flashcards in your app
echo.
pause
