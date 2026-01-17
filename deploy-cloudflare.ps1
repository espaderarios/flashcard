# Cloudflare Worker Deployment Script for PowerShell
# This script deploys the updated flashcard worker with backup functionality

Write-Host "🚀 Starting Cloudflare Worker Deployment..." -ForegroundColor Green

# Check if wrangler is installed
try {
    $wranglerVersion = wrangler --version 2>$null
    Write-Host "✅ Wrangler CLI found: $wranglerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Wrangler CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g wrangler
}

# Navigate to cloudflare-worker directory
Set-Location cloudflare-worker

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

# Login to Cloudflare (if not already logged in)
Write-Host "🔐 Checking Cloudflare authentication..." -ForegroundColor Blue
try {
    wrangler whoami 2>$null
    Write-Host "✅ Already authenticated with Cloudflare" -ForegroundColor Green
} catch {
    Write-Host "Please login to Cloudflare:" -ForegroundColor Yellow
    wrangler login
}

# Deploy to production
Write-Host "🌐 Deploying to Cloudflare Workers..." -ForegroundColor Blue
wrangler deploy

Write-Host "" 
Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Your worker is now available at:" -ForegroundColor Cyan
Write-Host "https://flashcard-worker.espaderarios.workers.dev" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Updated features:" -ForegroundColor Yellow
Write-Host "  • Class and student data backup" -ForegroundColor White
Write-Host "  • Cross-device synchronization" -ForegroundColor White
Write-Host "  • Automatic daily backups" -ForegroundColor White
Write-Host "  • Restore functionality" -ForegroundColor White
Write-Host ""
Write-Host "📱 Test on multiple devices to ensure classes sync properly!" -ForegroundColor Cyan
