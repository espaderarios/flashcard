# Cloudflare Worker Deployment Guide

## Step-by-Step Deployment

### Step 1: Create a Cloudflare Account (Free Tier)

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up with your email
3. Verify email
4. You now have a free Cloudflare account

### Step 2: Install Wrangler CLI

```bash
# Using npm (recommended)
npm install -g wrangler@latest

# Or using Windows Scoop
scoop install wrangler

# Verify installation
wrangler --version
```

### Step 3: Login to Cloudflare

```bash
wrangler login
```

This will:
1. Open your browser to authorize
2. Grant Wrangler access to your Cloudflare account
3. Create a local credential file

### Step 4: Create KV Namespace

The KV namespace stores your quizzes.

```bash
cd cloudflare-worker

# Create production namespace
wrangler kv:namespace create "QUIZZES"

# Create preview namespace (for testing)
wrangler kv:namespace create "QUIZZES" --preview
```

**Output will be:**
```
📝 Your KV namespaces have been created:
QUIZZES - a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
QUIZZES (preview) - x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6
```

**IMPORTANT:** Copy these IDs!

### Step 5: Update wrangler.toml

Edit `cloudflare-worker/wrangler.toml`:

```toml
name = "flashcard-worker"
main = "src/index.js"
compatibility_date = "2024-01-15"

routes = [
  { pattern = "flashcard.espaderario.workers.dev/*", zone_id = "" }
]

# Replace with YOUR namespace IDs from Step 4
[[kv_namespaces]]
binding = "QUIZZES"
id = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"                    # ← YOUR ID HERE
preview_id = "x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6"            # ← YOUR PREVIEW ID HERE

[env.production]
routes = [
  { pattern = "flashcard.espaderario.workers.dev/*" }
]
kv_namespaces = [
  { binding = "QUIZZES", id = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" }
]

[env.development]
kv_namespaces = [
  { binding = "QUIZZES", preview_id = "x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6" }
]
```

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Test Locally (Optional)

```bash
npm start
```

This will start the worker at `http://localhost:8787`

Test with:
```bash
curl http://localhost:8787/api/health
```

### Step 8: Deploy to Production

```bash
wrangler deploy
```

**Output:**
```
✨ Deployed flashcard-worker to https://flashcard.espaderario.workers.dev/
```

### Step 9: Verify Deployment

```bash
curl https://flashcard.espaderario.workers.dev/api/health
```

Should return:
```json
{"status":"ok","service":"flashcard-worker"}
```

### Step 10: Update Your App (Optional)

If you want to use a different URL, update in `app.js`:

```javascript
function getCloudflareUrl() {
  return localStorage.getItem('cloudflareUrl') || 'https://flashcard.espaderario.workers.dev';
}
```

Change to your deployed URL if different.

## Troubleshooting Deployment

### Error: "KV namespace not found"

**Solution:**
1. Run `wrangler kv:namespace list` to see your namespaces
2. Copy the correct ID
3. Update `wrangler.toml` with correct ID
4. Redeploy: `wrangler deploy`

### Error: "Authentication failed"

**Solution:**
1. Run `wrangler login` again
2. Authorize in the browser
3. Try deploying again

### Error: "Route pattern not found"

**Solution:**
1. Remove the `zone_id` line from wrangler.toml (only needed for custom domains)
2. Redeploy: `wrangler deploy`

### 404 on deployed URL

**Solution:**
1. Make sure you deployed successfully (check output)
2. Wait 1-2 minutes for propagation
3. Try accessing `/api/health` endpoint
4. Check logs: `wrangler tail`

## Monitoring Your Worker

### View Real-Time Logs

```bash
# While developing
npm start

# Or view production logs
wrangler tail
```

### View KV Data

```bash
# List all quiz IDs
wrangler kv:key list --namespace-id YOUR-NAMESPACE-ID

# Get a specific quiz
wrangler kv:key get quiz_1234567890_abc123 --namespace-id YOUR-NAMESPACE-ID
```

## Updating Your Worker

After making changes to `src/index.js`:

```bash
# Redeploy
wrangler deploy

# Or with specific environment
wrangler deploy --env production
```

## Checking Worker Status

Visit your Cloudflare dashboard:
https://dash.cloudflare.com/workers/overview

You'll see:
- Recent requests
- Error rates
- CPU time
- KV operations

## Costs

**Free Tier Includes:**
- ✅ 100,000 requests/day
- ✅ Unlimited KV reads/writes
- ✅ 1GB KV storage
- ✅ Global deployment

For more requests, upgrade to Paid plan ($10/month).

## Next Steps

1. ✅ Deploy the worker
2. ✅ Test the `/api/health` endpoint
3. ✅ Create a quiz using POST /api/quizzes
4. ✅ Get quiz using GET /api/quizzes/:id
5. ✅ Use in your flashcard app!

## Commands Reference

```bash
# Login
wrangler login

# Create namespace
wrangler kv:namespace create "QUIZZES"

# Deploy
wrangler deploy

# View logs
wrangler tail

# Local dev
npm start

# Check namespaces
wrangler kv:namespace list

# Get KV key
wrangler kv:key get KEY_NAME --namespace-id ID
```

---

**Ready to deploy? Run:** `wrangler deploy` 🚀
