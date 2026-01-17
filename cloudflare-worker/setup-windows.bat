@echo off
REM Cloudflare Worker Setup Helper for Windows

echo.
echo ================================
echo Cloudflare Worker Setup Helper
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

echo.
echo Step 1: Installing Wrangler CLI globally...
call npm install -g wrangler@latest

echo.
echo Step 2: Checking Wrangler installation...
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Wrangler installation failed
    pause
    exit /b 1
)

echo ✅ Wrangler installed:
wrangler --version

echo.
echo Step 3: Navigate to cloudflare-worker directory
cd cloudflare-worker

echo.
echo Step 4: Installing project dependencies...
call npm install

echo.
echo ================================
echo ✅ Setup Complete!
echo ================================
echo.
echo Next steps:
echo.
echo 1. Login to Cloudflare:
echo    wrangler login
echo.
echo 2. Create KV namespaces:
echo    wrangler kv:namespace create "QUIZZES"
echo    wrangler kv:namespace create "QUIZZES" --preview
echo.
echo 3. Update cloudflare-worker/wrangler.toml with the namespace IDs
echo.
echo 4. Deploy:
echo    wrangler deploy
echo.
echo For detailed instructions, see:
echo    ..\docs\CLOUDFLARE_DEPLOYMENT.md
echo.
pause
