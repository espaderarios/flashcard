# 🔧 Clear Cache & Reload - Fix Browser Cache Issue

Your app is still using the **cached** old endpoint. Follow these steps to clear everything:

## ⚡ Quick Fix (Windows)

```bash
# Press F12 to open Developer Tools
# Then follow the steps below OR just do:
# Ctrl + Shift + Delete (opens Clear Browsing Data)
```

## 📋 Step-by-Step Cache Clear

### Step 1: Open Developer Tools
```
Press: F12 (Windows) or Cmd+Option+I (Mac)
```

### Step 2: Unregister Service Worker
```
1. Go to: Application tab
2. Left sidebar: Service Workers
3. Click "Unregister" for any workers shown
4. Should show "No service workers"
```

### Step 3: Clear Cache Storage
```
1. Go to: Storage tab (left sidebar)
2. Click "Cache Storage"
3. Right-click on "flashcards-v*" entries
4. Delete each one
5. Or click "Clear All"
```

### Step 4: Clear Local Storage
```
1. Still in Storage tab
2. Click "Local Storage"
3. Right-click entries and delete
4. Or: localStorage.clear() in console
```

### Step 5: Hard Refresh
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### Step 6: Verify New Endpoint is Used
```
1. Open browser console (F12)
2. Go to Network tab
3. Try submitting a quiz
4. You should see:
   POST https://flashcard-worker.espaderarios.workers.dev/api/quizzes
   (NOT the old flashcard.espaderario.workers.dev)
```

---

## 🧹 Nuclear Option (Clear Everything)

### Windows:
```
Ctrl + Shift + Delete
→ Click "All time"
→ Check "Cookies and other site data"
→ Check "Cached images and files"
→ Check "Service workers"
→ Click "Clear data"
→ Go back to site
→ Refresh: Ctrl + Shift + R
```

### Mac:
```
Cmd + Shift + Delete
→ Same steps as above
```

---

## ✅ How to Verify It Works

After clearing cache:

1. Open browser console: F12
2. Go to Network tab
3. Filter by "quizzes"
4. Submit a quiz
5. Check the request URL:
   - ✅ Should be: `https://flashcard-worker.espaderarios.workers.dev/api/quizzes`
   - ❌ NOT: `https://flashcard.espaderario.workers.dev/api/quizzes`

---

## 🆘 If Still Not Working

Try this in browser console:

```javascript
// Check what URL the app is using
console.log(getCloudflareUrl());
// Should log: https://flashcard-worker.espaderarios.workers.dev

// Clear localStorage
localStorage.clear();

// Reload
location.reload();
```

---

## 📊 What Each Cache Store Does

| Cache Type | What It Stores | How to Clear |
|-----------|---|---|
| **Service Worker Cache** | Static assets | Application → Service Workers → Unregister |
| **Cache Storage** | API responses | Storage → Cache Storage → Delete |
| **Local Storage** | User settings | Storage → Local Storage → Clear |
| **Browser Cache** | General cache | Ctrl+Shift+Delete |

**Clear all of them to be safe!**

---

## ⏱️ Expected Timeline

1. Clear cache: 30 seconds
2. Hard refresh: 10 seconds
3. Test: 20 seconds
4. **Total: ~1 minute**

---

## 🎯 You Should See

After clearing cache and reloading:

```
✅ POST to NEW endpoint: flashcard-worker.espaderarios.workers.dev
✅ CORS headers present (no CORS errors)
✅ Quiz submission works
✅ No "Failed to fetch" errors
```

---

**Do this now, then let me know if it works!** 🚀
