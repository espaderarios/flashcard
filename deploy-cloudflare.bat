@echo off
REM Cloudflare Worker Deployment Script for Windows
REM This script deploys the updated flashcard worker with backup functionality

echo 🚀 Starting Cloudflare Worker Deployment...

REM Check if wrangler is installed
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Wrangler CLI not found. Installing...
    npm install -g wrangler
)

REM Navigate to cloudflare-worker directory
cd cloudflare-worker

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Login to Cloudflare (if not already logged in)
echo 🔐 Checking Cloudflare authentication...
wrangler whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo Please login to Cloudflare:
    wrangler login
)

REM Deploy to production
echo 🌐 Deploying to Cloudflare Workers...
wrangler deploy

echo.
echo ✅ Deployment completed!
echo.
echo 📋 Your worker is now available at:
echo https://flashcard-worker.espaderarios.workers.dev
echo.
echo 🔧 Updated features:
echo   • Class and student data backup
echo   • Cross-device synchronization  
echo   • Automatic daily backups
echo   • Restore functionality
echo.
echo 📱 Test on multiple devices to ensure classes sync properly!
pause
