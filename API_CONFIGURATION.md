# API Configuration Guide

## Issue: API Returns 500 Error

If you see the error:
```
flashcardrio.onrender.com/api/generate-cards:1 Failed to load resource: the server responded with a status of 500 ()
AI generation error: Error: API request failed with status 500
```

## Root Cause

The backend is missing the `GROQ_API_KEY` environment variable needed to call the Groq AI API for generating flashcards and quizzes.

## Solution

### Step 1: Get a Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up or log in to your account
3. Create a new API key from the API Keys section
4. Copy your API key (it will look like: `gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

### Step 2: Configure the Backend

#### Option A: Local Development (Recommended)

1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```

2. Create a `.env` file in the `backend/` directory:
   ```
   GROQ_API_KEY=gsk_YOUR_API_KEY_HERE
   PORT=5000
   NODE_ENV=development
   ```

3. Replace `gsk_YOUR_API_KEY_HERE` with your actual API key from Step 1

4. Install dependencies and start the backend:
   ```bash
   npm install
   npm start
   ```

#### Option B: Production (Render.com or Similar)

1. Go to your hosting provider's dashboard (e.g., Render, Vercel)
2. Add an environment variable:
   - **Key**: `GROQ_API_KEY`
   - **Value**: Your Groq API key from Step 1
3. Restart your backend service

#### Option C: Using .env.example

1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Groq API key:
   ```
   GROQ_API_KEY=gsk_YOUR_API_KEY_HERE
   PORT=5000
   NODE_ENV=production
   ```

### Step 3: Verify Configuration

After setting up your `.env` file, you should see this message when starting the backend:
```
✅ GROQ_API_KEY is configured
```

If you see a warning instead:
```
⚠️  WARNING: GROQ_API_KEY environment variable is not set!
```

Then your `.env` file wasn't loaded correctly. Check:
- File is named exactly `.env` (not `.env.txt` or `.env.example`)
- File is in the `backend/` directory, not the root
- You saved the file after editing

## Testing

Once configured, try generating cards:

1. Open your app in the browser
2. Create a subject/set
3. Click "Generate with AI"
4. Enter a topic (e.g., "Photosynthesis")
5. Click "Generate"

You should see flashcards generated successfully.

## Troubleshooting

### Still Getting 500 Errors?

Check the backend logs for detailed error messages:

**Terminal Output**:
```
Card Generation Error: Groq API Error (401): Invalid API key
```

This means your API key is incorrect. Double-check it in the Groq console.

### Common Issues

| Problem | Solution |
|---------|----------|
| API key not found | Check `.env` file exists in `backend/` folder |
| Invalid API key | Verify the exact key from Groq console - no extra spaces |
| CORS errors | Backend CORS config in `backend/config.json` needs to allow your domain |
| File not cached by service worker | Clear browser cache: DevTools → Storage → Clear all |

## Related Files

- Backend config: `backend/config.json` (CORS settings)
- API endpoints: `backend/server.js` (lines 430+)
- Frontend API calls: `app.js` (line 221 - `AI_API_URL`)
- Service worker: `service-worker.js` (caches API responses)
