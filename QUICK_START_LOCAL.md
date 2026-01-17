# Flashcard App - Quick Start Guide

## Getting Started

### Prerequisites
- Node.js 18+ and npm installed
- A free Groq API key (for AI features)

## Installation

### 1. Quick Setup (Auto)

**Windows:**
```bash
.\setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### 2. Manual Setup

If you prefer to set up manually:

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Create backend/.env file
cd backend
cp .env.example .env
# OR create manually:
# GROQ_API_KEY=your_key_here
# PORT=5000
# NODE_ENV=development
cd ..
```

## Fixing the 500 Error - AI Generation Not Working

If you see this error when trying to generate flashcards:
```
POST https://flashcardrio.onrender.com/api/generate-cards 500 (Internal Server Error)
AI generation error: Error: API request failed with status 500
```

### Root Cause
The backend is missing the `GROQ_API_KEY` environment variable.

### Solution

#### Step 1: Get a Groq API Key

1. Go to **[https://console.groq.com](https://console.groq.com)**
2. Click "Sign In" or "Sign Up"
3. Complete authentication
4. Go to **API Keys** section
5. Click **Create API Key**
6. Copy the key (it looks like: `gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

#### Step 2: Set Your API Key

**Option A - Local Development (Recommended)**

Edit `backend/.env`:
```
GROQ_API_KEY=gsk_YOUR_KEY_HERE
PORT=5000
NODE_ENV=development
```

Save the file and restart:
```bash
cd backend
npm start
```

**Option B - Production (Render.com)**

1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** settings
4. Add new environment variable:
   - **Key**: `GROQ_API_KEY`
   - **Value**: Your Groq API key
5. Click **Save**
6. Service will auto-restart

## Running the App

### Development Mode

```bash
# Terminal 1 - Backend
cd backend
npm start
# Should see: 🚀 Flashcard Backend v2.0 running on port 5000
# And: ✅ GROQ_API_KEY is configured

# Terminal 2 - Frontend (in root directory)
# Open index.html in browser or use a simple server:
npx http-server
```

### Production

```bash
# Make sure backend/.env has GROQ_API_KEY set
npm start
```

## Testing AI Features

After setup, test if AI features work:

1. Open the app in your browser
2. Create a new subject (or use existing)
3. Create a new set
4. Click the **AI** button (magic wand icon) or **Generate with AI**
5. Enter a topic: `Photosynthesis`
6. Click **Generate**

You should see 10 flashcards generated automatically!

### If It Still Doesn't Work

Check the browser console (F12):

1. **"GROQ_API_KEY not found"** → API key not set in `.env`
2. **"Invalid API key"** → Check if you copied the key correctly from Groq console
3. **"401 Unauthorized"** → Key is invalid or expired
4. **"Groq API Error"** → Groq service might be down, try again later

## Features

✅ Flashcard Management
✅ Quiz Generation (AI-powered)
✅ PDF/Document Import
✅ Offline Support (Service Worker)
✅ Progressive Web App (PWA)
✅ Data Persistence (LocalStorage)

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/generate-cards` | Generate flashcards from topic |
| POST | `/api/generate-quiz` | Generate quiz questions from topic |
| POST | `/api/generate-cards-from-document` | Generate flashcards from PDF |
| POST | `/api/generate-quiz-from-document` | Generate quiz questions from PDF |

## Architecture

```
flashcard/
├── app.js                 # Frontend (7000+ lines)
├── service-worker.js      # Offline support & caching
├── styles.css            # UI styling
├── index.html            # Main page
├── backend/
│   ├── server.js         # Express API server
│   ├── config.json       # Server configuration
│   └── .env             # Environment variables (API key)
└── www/                  # Built files for deployment
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module 'express'" | Run `npm install` in backend folder |
| Service worker won't register | Clear browser cache, hard refresh (Ctrl+Shift+R) |
| Cards not caching | Check browser's LocalStorage in DevTools |
| CORS errors | Update CORS origins in `backend/config.json` |

## Deployment

### Render.com (Recommended)

1. Push code to GitHub
2. Connect Render to your GitHub repo
3. Set environment variable: `GROQ_API_KEY=your_key`
4. Deploy!

See [RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md) for detailed steps.

## Support

For issues or questions, check:
- [API_CONFIGURATION.md](API_CONFIGURATION.md) - API setup details
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) - Common issues
- [Backend Integration Guide](docs/BACKEND_INTEGRATION_GUIDE.md) - Technical details

---

**Happy studying! 🎓**
