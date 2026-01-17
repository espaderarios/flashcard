#!/bin/bash
# Setup and run flashcard app locally

echo "🚀 Flashcard App - Local Setup"
echo "==============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if backend .env exists
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env from template..."
    if [ -f backend/.env.example ]; then
        cp backend/.env.example backend/.env
    else
        cat > backend/.env << EOF
# Groq API Configuration
# Get your API key from: https://console.groq.com
GROQ_API_KEY=

# Server Configuration
PORT=5000
NODE_ENV=development
EOF
    fi
    echo "⚠️  ACTION REQUIRED: Edit backend/.env and add your GROQ_API_KEY"
    echo "   Get a free API key from: https://console.groq.com"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the app:"
echo "  npm start"
echo ""
echo "Then open http://localhost:5000 in your browser"
echo ""
echo "To start with auto-reload:"
echo "  npm run dev"
echo ""
