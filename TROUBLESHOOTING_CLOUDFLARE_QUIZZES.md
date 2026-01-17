# Troubleshooting Guide: Cloudflare Quiz Errors

## Common Issues & Solutions

### Issue 1: "❌ Quiz not found. Make sure the quiz ID is correct and hasn't expired."

**Why it happens:**
- Quiz ID is incorrect (typo in quiz ID)
- Quiz has expired (older than 30 days)
- Quiz was never successfully saved to Cloudflare
- Quiz ID format is wrong

**How to fix:**

#### Option A: Check quiz ID format
Quiz IDs should look like: `quiz_1704067200000_abc123def`
- Starts with `quiz_`
- Followed by timestamp (13 digits)
- Followed by underscore and random string

If it looks different, teacher may not have saved it correctly.

#### Option B: Have teacher recreate quiz
1. Teacher goes to "Create Quiz"
2. Adds title and questions
3. Clicks "Create Quiz"
4. **Important**: Wait for toast "✅ Quiz created and synced to cloud!"
5. Copy quiz ID from "Quiz ID" field
6. Share this ID with student

#### Option C: Check browser console
Open DevTools (F12 → Console):
```javascript
// Check what ID was sent
// Should see: "Quiz created with ID: quiz_..."

// Try fetching directly
fetch('https://flashcard-worker.espaderarios.workers.dev/api/quizzes/quiz_YOUR_ID_HERE')
  .then(r => r.json())
  .then(d => console.log(d))

// If you see: {"error":"Quiz not found"} → ID doesn't exist
// If you see the quiz data → ID is correct, problem is elsewhere
```

#### Option D: Check quiz expiration
Quizzes expire after 30 days. If quiz is older than that:
- Create a new quiz
- Use the new ID

---

### Issue 2: "⚠️ Please create your account first before entering a quiz"

**This is intentional!** ✅

Students MUST have an account before taking quizzes to track their scores.

**How to fix:**
1. Click the warning message
2. Account creation modal opens
3. Enter your name and student ID
4. Click "Save"
5. Quiz ID will auto-load

---

### Issue 3: Student gets account warning even AFTER creating account

**Why it happens:**
- Account data wasn't saved properly
- Browser cleared localStorage
- Using different browser/device

**How to fix:**

#### Option A: Create account again
1. Click warning "⚠️ Please create your account first"
2. Modal opens
3. Enter name and ID again
4. Click "Save"

#### Option B: Check account is saved
Open DevTools (F12 → Console):
```javascript
// Check if account is saved
JSON.parse(localStorage.getItem('currentStudent'))

// If it shows: null or undefined → Account not saved
// If it shows: {name: "John Doe", id: "123"} → Account is saved ✅
```

#### Option C: Manually set account (testing only)
```javascript
// In browser console (F12):
localStorage.setItem('currentStudent', JSON.stringify({
  name: "John Doe",
  id: "123"
}));
location.reload();  // Refresh page
```

---

### Issue 4: "Loading quiz..." then nothing happens

**Why it happens:**
- Network error (no internet)
- Cloudflare Worker is down
- Request is taking too long to respond

**How to fix:**

#### Option A: Check internet connection
- Test: Go to https://google.com
- If it loads, internet is fine
- If not, fix internet first

#### Option B: Check Cloudflare Worker health
Open DevTools (F12 → Console):
```javascript
// Check if Cloudflare worker is responding
fetch('https://flashcard-worker.espaderarios.workers.dev/api/health')
  .then(r => r.json())
  .then(d => console.log('Worker status:', d))

// Expected: {status: 'ok', service: 'flashcard-worker'}
// If error → Worker might be down, try again in a minute
```

#### Option C: Check Network tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try loading quiz again
4. Look for request to: `flashcard-worker.espaderarios.workers.dev`
5. Check status code:
   - 200 = OK
   - 404 = Quiz not found
   - 500 = Server error
   - (pending) = Still loading

---

### Issue 5: Quiz loads but shows "❌ Quiz has no questions"

**Why it happens:**
- Teacher saved quiz without questions
- Questions weren't synced to Cloudflare

**How to fix:**
- Teacher needs to create quiz again with questions
- Make sure at least 1 question is added before clicking "Create Quiz"

---

### Issue 6: Service Worker cache issues

**Symptom:** 
- Changes don't appear
- Still seeing old quiz IDs or endpoints
- Getting 503 errors

**How to fix:**

#### Option A: Hard refresh browser
Press: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

#### Option B: Clear cache manually
1. Open DevTools (F12)
2. Application tab
3. Storage → Clear Site Data (or)
4. Cache Storage → Delete all entries
5. Service Workers → Unregister
6. Close browser completely
7. Reopen and go to app

#### Option C: Clear everything
1. Open browser settings
2. Clear browsing data
3. Select "All time"
4. Check everything
5. Click "Clear data"
6. Restart browser

---

### Issue 7: "Failed to sync to cloud" message

**Why it happens:**
- Cloudflare Worker returned an error
- Invalid quiz data (missing title or questions)
- Network error during upload

**How to fix:**

#### Option A: Check what caused the error
Open DevTools (F12 → Console):
```javascript
// Create quiz manually to see exact error
const quiz = {
  title: "Test Quiz",
  questions: [
    { question: "Q1?", options: ["A", "B"], correct: 0 }
  ]
};

fetch('https://flashcard-worker.espaderarios.workers.dev/api/quizzes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(quiz)
})
.then(r => r.json())
.then(d => console.log('Response:', d))
```

#### Option B: Try again
Click "Create Quiz" again. Sometimes it's a temporary network blip.

#### Option C: Check quiz validity
- Title must not be empty
- Questions must be an array with at least 1 item
- Each question must have: question text, options, correct answer index

---

### Issue 8: Browser console shows "Fetching quiz from: undefined"

**Why it happens:**
- `getCloudflareUrl()` is returning undefined
- Cloudflare URL not properly configured

**How to fix:**
```javascript
// In browser console:
// Check what URL is being used
getCloudflareUrl()  

// Should return: https://flashcard-worker.espaderarios.workers.dev
// If it returns undefined, set it:
localStorage.setItem('cloudflareUrl', 'https://flashcard-worker.espaderarios.workers.dev');
location.reload();
```

---

### Issue 9: Quiz loads but student sees blank page

**Why it happens:**
- Questions aren't rendering properly
- JavaScript error in quiz display code
- Quiz data format is unexpected

**How to fix:**

#### Option A: Check browser console errors
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check what line number error is on
5. This helps identify the issue

#### Option B: Check quiz data format
```javascript
// In console, check what quiz data looks like
await getQuizFromCloudflare('quiz_YOUR_ID')
  .then(q => console.log('Quiz data:', JSON.stringify(q, null, 2)))

// Data should have structure:
// {
//   "id": "quiz_...",
//   "title": "Quiz Title",
//   "questions": [
//     {
//       "question": "Question text?",
//       "options": ["A", "B", "C", "D"],
//       "correct": 0,
//       ...
//     }
//   ]
// }
```

---

### Issue 10: Quiz submission errors

**Symptom:**
- Quiz can be answered
- But "Submit Quiz" button gives error

**How to fix:**

This is handled by a different backend (not Cloudflare). Check [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md) for submit issues.

---

## Debugging Checklist

When something isn't working:

- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Look for red error messages (what is it?)
- [ ] Go to Network tab
- [ ] Try the action again (what request fails?)
- [ ] Check the failed request:
  - Status code?
  - Response body?
  - Is it going to the right URL?
- [ ] Compare with expected values:
  - Expected URL: `https://flashcard-worker.espaderarios.workers.dev`
  - Expected status: 200
  - Expected response: Has `quiz` property
- [ ] Test endpoints manually:
  ```javascript
  // Health check
  fetch('https://flashcard-worker.espaderarios.workers.dev/api/health').then(r => r.json()).then(console.log)
  
  // List all quizzes
  fetch('https://flashcard-worker.espaderarios.workers.dev/api/quizzes').then(r => r.json()).then(console.log)
  
  // Get specific quiz
  fetch('https://flashcard-worker.espaderarios.workers.dev/api/quizzes/quiz_YOUR_ID').then(r => r.json()).then(console.log)
  ```

---

## Getting Help

If you're still stuck:

1. **Check console for exact error** (F12 → Console)
2. **Check Network tab** to see what requests are being made
3. **Try the manual API test** above to see actual response
4. **Clear cache and hard refresh** (Ctrl+Shift+R)
5. **Check if Cloudflare Worker is online**: https://flashcard-worker.espaderarios.workers.dev/api/health

---

## Quick Reference

| Error | Cause | Fix |
|-------|-------|-----|
| 404 Not Found | Quiz ID wrong or expired | Check ID format, recreate quiz |
| ⚠️ Create account | Student has no account | Click warning, create account |
| Failed to sync | Network/server error | Try again, check internet |
| Loading... forever | Network down | Check internet connection |
| No questions | Quiz saved without questions | Recreate quiz with questions |
| Blank page | Rendering error | Check console for errors |
| undefined URL | Config issue | Run: `localStorage.setItem('cloudflareUrl', 'https://flashcard-worker.espaderarios.workers.dev')` |

---

**Last Updated**: January 17, 2026
