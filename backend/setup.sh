#!/bin/bash
# Backend Setup Helper Script
# This script helps configure the Groq API key for the flashcard backend

echo "================================"
echo "🚀 Flashcard Backend Setup"
echo "================================"
echo ""

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found!"
    echo "Please run this script from the backend/ directory"
    echo ""
    echo "Usage:"
    echo "  cd backend"
    echo "  chmod +x setup.sh"
    echo "  ./setup.sh"
    exit 1
fi

echo "Step 1: Checking for .env file..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    echo ""
    echo "Current configuration:"
    grep "GROQ_API_KEY" .env || echo "   ⚠️  GROQ_API_KEY not set"
    grep "PORT" .env || echo "   ⚠️  PORT not set (using default: 5000)"
else
    echo "⚠️  .env file not found"
    echo ""
    echo "Creating .env from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env file created from .env.example"
    else
        echo "Creating new .env file..."
        cat > .env << EOF
# Groq API Configuration
# Get your API key from: https://console.groq.com
GROQ_API_KEY=

# Server Configuration
PORT=5000
NODE_ENV=development
EOF
        echo "✅ .env file created"
    fi
fi

echo ""
echo "Step 2: Groq API Key Configuration"
echo "=================================="
echo ""
echo "To use AI features (generate cards/quizzes), you need a Groq API key:"
echo ""
echo "1. Go to: https://console.groq.com"
echo "2. Sign up or log in"
echo "3. Create a new API key"
echo "4. Copy the key (starts with 'gsk_')"
echo ""
echo "Then, edit the .env file and set:"
echo "   GROQ_API_KEY=gsk_YOUR_KEY_HERE"
echo ""

echo "Step 3: Installing dependencies..."
if command -v npm &> /dev/null; then
    echo "npm found. Running: npm install"
    npm install
    echo "✅ Dependencies installed"
else
    echo "⚠️  npm not found. Please install Node.js from https://nodejs.org"
    exit 1
fi

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env and add your Groq API key"
echo "2. Run: npm start"
echo "3. Backend will run on http://localhost:5000"
echo ""
echo "To test if everything works:"
echo "  - Open http://localhost:5000/api (should show API endpoints)"
echo "  - Try generating flashcards in your app"
echo ""
