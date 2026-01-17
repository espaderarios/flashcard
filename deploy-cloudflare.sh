#!/bin/bash

# Cloudflare Worker Deployment Script
# This script deploys the updated flashcard worker with backup functionality

echo "🚀 Starting Cloudflare Worker Deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Navigate to cloudflare-worker directory
cd cloudflare-worker

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Login to Cloudflare (if not already logged in)
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "Please login to Cloudflare:"
    wrangler login
fi

# Deploy to production
echo "🌐 Deploying to Cloudflare Workers..."
wrangler deploy

echo "✅ Deployment completed!"
echo ""
echo "📋 Your worker is now available at:"
echo "https://flashcard-worker.espaderarios.workers.dev"
echo ""
echo "🔧 Updated features:"
echo "  • Class and student data backup"
echo "  • Cross-device synchronization"
echo "  • Automatic daily backups"
echo "  • Restore functionality"
echo ""
echo "📱 Test on multiple devices to ensure classes sync properly!"
