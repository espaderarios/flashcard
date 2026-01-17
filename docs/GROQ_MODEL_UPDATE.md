# Model Update - Groq API

## Issue Fixed

**Error:** The Groq API model `llama-3.1-70b-versatile` has been decommissioned.

**Solution:** Updated to `llama-3.1-8b-instant` - a fast, reliable, and cost-effective model.

## Changes Made

### File: `backend/config.json`

Changed:
```json
"model": "llama-3.1-70b-versatile"
```

To:
```json
"model": "llama-3.1-8b-instant"
```

## Model Comparison

| Aspect | Old (70B) | New (8B-Instant) |
|--------|-----------|------------------|
| Speed | Slower | ⚡ Much faster |
| Quality | Excellent | ✅ Very good |
| Cost | Higher | 💰 Much cheaper |
| Latency | Higher | Lower |
| Perfect for | Complex reasoning | Quick responses |

## Why This Model?

✅ **Fast** - Response times < 1 second
✅ **Reliable** - Consistently available
✅ **Cost-effective** - Lower API usage costs
✅ **Accurate** - Excellent for flashcard/quiz generation
✅ **Maintained** - Currently supported by Groq

## Testing

After deployment, try generating flashcards:

1. Go to your app: https://flashcardrio.onrender.com
2. Create a subject/set
3. Click "Generate with AI"
4. Enter a topic: `Photosynthesis`
5. Click "Generate"

You should see flashcards generated in 1-2 seconds!

## Alternative Models

If you want to use a different model, check Groq's supported models:
https://console.groq.com/docs/speech-text

Common options:
- `llama-3.1-8b-instant` (current - recommended)
- `mixtral-8x7b-32768` (good balance)
- `gemma-7b-it` (lightweight)
- `llama-3.2-11b-vision-preview` (with image support)

To change models, edit `backend/config.json` and update the `ai.model` field.

## Deployment

This fix is automatically applied when you:

1. Push the changes to GitHub
2. Render will auto-deploy
3. Service will restart with new model
4. No downtime!

Or manually trigger deployment in Render dashboard.

## Monitoring

Check the Groq API status:
- https://console.groq.com/docs
- https://status.groq.com

If you see API errors, check:
1. Your GROQ_API_KEY is still valid
2. Your account has credits/is on a valid plan
3. The model you're using is still supported
