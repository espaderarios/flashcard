# Cloudflare Workers Backend - Flashcard Quiz API

This is a complete Cloudflare Workers backend for the flashcard application. It handles quiz creation, storage, and retrieval with proper CORS support.

## Features

✅ **Quiz Management**
- Create quizzes (POST /api/quizzes)
- Fetch quizzes (GET /api/quizzes/:id)
- Update quizzes (PUT /api/quizzes/:id)
- Delete quizzes (DELETE /api/quizzes/:id)

✅ **CORS Enabled**
- Works with your GitHub Pages frontend
- Proper CORS headers on all responses
- Preflight request handling

✅ **KV Storage**
- Quizzes stored in Cloudflare KV
- 30-day auto-expiration
- Fast global access

✅ **Error Handling**
- Proper HTTP status codes
- Detailed error messages
- Input validation

## Prerequisites

1. **Cloudflare Account** - Free tier works great
2. **Node.js 18+** - For local development
3. **Wrangler CLI** - Cloudflare's tool for deploying workers

## Quick Start

### 1. Install Dependencies

```bash
cd cloudflare-worker
npm install
```

### 2. Set Up KV Namespace

```bash
# Create a KV namespace for storing quizzes
wrangler kv:namespace create "QUIZZES"
wrangler kv:namespace create "QUIZZES" --preview
```

This will output something like:
```
📝 Your KV namespaces have been created:
QUIZZES - your-namespace-id
QUIZZES-preview - your-preview-namespace-id
```

### 3. Update wrangler.toml

Edit `wrangler.toml` and replace the placeholders:

```toml
[[kv_namespaces]]
binding = "QUIZZES"
id = "your-namespace-id"           # ← Replace with your namespace ID
preview_id = "your-preview-namespace-id"  # ← Replace with preview ID

[env.production]
kv_namespaces = [
  { binding = "QUIZZES", id = "your-namespace-id" }
]

[env.development]
kv_namespaces = [
  { binding = "QUIZZES", preview_id = "your-preview-namespace-id" }
]
```

### 4. Deploy

```bash
# Login to Cloudflare
wrangler login

# Deploy to production
wrangler deploy

# Or deploy to a specific environment
wrangler deploy --env production
```

You'll see output like:
```
⛅ wrangler 3.26.0
✨ Built successfully
✨ Deployed flashcard-worker to https://flashcard.espaderario.workers.dev/
```

### 5. Update Your App

Update the Cloudflare URL in your app's configuration if needed. The app should now work with the deployed worker.

## Local Development

### Test Locally

```bash
# Start the development server
npm start

# This will run on http://localhost:8787
```

### Test Endpoints

```bash
# Health check
curl http://localhost:8787/api/health

# Create a quiz
curl -X POST http://localhost:8787/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Quiz",
    "questions": [
      {
        "question": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correct": "4"
      }
    ]
  }'

# Get a quiz (use the ID from create response)
curl http://localhost:8787/api/quizzes/quiz_1234567890_abc123
```

## API Reference

### GET /api/health
Health check endpoint
```
Response: { status: "ok", service: "flashcard-worker" }
```

### GET /api/quizzes
List all quizzes
```
Response: { success: true, quizzes: [...] }
```

### POST /api/quizzes
Create a new quiz
```
Body: {
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correct": "A"
    }
  ]
}

Response: {
  "success": true,
  "quiz": {
    "id": "quiz_...",
    "title": "Quiz Title",
    "questionCount": 1,
    "createdAt": "2024-01-17T..."
  }
}
```

### GET /api/quizzes/:id
Get a specific quiz
```
Response: {
  "success": true,
  "quiz": { ... }
}
```

### PUT /api/quizzes/:id
Update a quiz
```
Body: {
  "title": "Updated Title",
  "questions": [...]
}

Response: {
  "success": true,
  "quiz": { ... }
}
```

### DELETE /api/quizzes/:id
Delete a quiz
```
Response: {
  "success": true,
  "message": "Quiz deleted"
}
```

## Project Structure

```
cloudflare-worker/
├── src/
│   └── index.js          # Main worker code with all endpoints
├── wrangler.toml         # Cloudflare configuration
├── package.json          # Dependencies
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Troubleshooting

### CORS Issues

If you still see CORS errors, make sure:
1. Your worker is deployed
2. The URL in app.js matches your deployed worker URL
3. CORS headers are being sent (check Network tab in DevTools)

### KV Namespace Errors

If you see "KV namespace not found":
1. Check that the namespace ID in wrangler.toml is correct
2. Run `wrangler kv:namespace list` to see your namespaces
3. Update wrangler.toml with correct IDs

### Quota Issues

Free Cloudflare Workers includes:
- **100,000 requests/day** - More than enough for testing
- **Unlimited KV reads/writes** - Great for data storage
- **30-day history** - Quizzes auto-delete after 30 days

To request higher limits, upgrade your Cloudflare plan.

## Monitoring

### View Logs

```bash
# Real-time logs while developing
wrangler tail

# View production logs
wrangler tail --env production
```

### Check KV Data

```bash
# List all keys
wrangler kv:key list --namespace-id your-namespace-id

# Get a specific key
wrangler kv:key get quiz_1234567890_abc123 --namespace-id your-namespace-id
```

## Environment Variables

Add environment-specific variables to wrangler.toml:

```toml
[env.production]
vars = { LOG_LEVEL = "error" }

[env.development]
vars = { LOG_LEVEL = "debug" }
```

Then access in code:
```javascript
const logLevel = env.LOG_LEVEL;
```

## Advanced: Custom Domain

To use a custom domain instead of workers.dev:

1. Update wrangler.toml routes:
```toml
routes = [
  { pattern = "quiz-api.yourdomain.com/*", zone_id = "your-zone-id" }
]
```

2. Deploy and add DNS record:
```
quiz-api.yourdomain.com  CNAME  flashcard.espaderario.workers.dev
```

## Security Considerations

⚠️ **Current Security Level**: Development/Testing

For production use, consider:
1. **Authentication** - Add API key validation
2. **Rate Limiting** - Prevent abuse
3. **Input Validation** - Sanitize quiz content
4. **CORS Restrictions** - Lock down to specific domains
5. **Access Logging** - Track who creates/deletes quizzes

Example: Add API key authentication:
```javascript
// In src/index.js
const API_KEY = env.API_KEY;

router.post('/api/quizzes', async (req, env) => {
  const key = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (key !== API_KEY) {
    return json({ error: 'Unauthorized' }, 401);
  }
  // ... rest of code
});
```

## Related Files

- Main app: [app.js](../app.js#L165-L195) - `createQuizOnCloudflare()` function
- Service worker: [service-worker.js](../service-worker.js) - Handles caching
- Render backend: [backend/server.js](../backend/server.js) - Node.js alternative

## Support

- **Cloudflare Docs**: https://developers.cloudflare.com/workers/
- **Itty Router Docs**: https://github.com/kwhitley/itty-router
- **KV Documentation**: https://developers.cloudflare.com/workers/runtime-apis/kv/

---

**Happy coding!** 🚀
