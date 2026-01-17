#!/bin/bash

# Quick Deploy Script for Cross-Device Enhancement
# This script deploys the updated flashcard worker with cross-device class support

echo "🚀 Deploying Cross-Device Class Support..."

# Navigate to cloudflare-worker directory
cd cloudflare-worker

# Quick deploy (skip npm install if already up to date)
echo "📦 Deploying to Cloudflare..."
wrangler deploy

echo ""
echo "✅ Cross-Device Features Deployed!"
echo ""
echo "🔧 New Capabilities:"
echo "  • Classes work across all devices"
echo "  • Student ID auto-creation"
echo "  • Device fingerprinting"
echo "  • Cross-device enrollment tracking"
echo "  • Last accessed timestamps"
echo ""
echo "📱 How it works:"
echo "  1. Enroll in class on any device"
echo "  2. Class is accessible from all your devices"
echo "  3. No more 'invalid class code' errors"
echo "  4. Automatic student profile creation"
echo ""
echo "🌐 Your worker: https://flashcard-worker.espaderarios.workers.dev"
echo ""
echo "🎯 Test it now on multiple devices!"
