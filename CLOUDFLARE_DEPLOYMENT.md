# 🚀 Cloudflare Deployment Guide

This guide will help you deploy the updated flashcard application with cloud backup functionality to ensure classes and student data sync across all devices.

## 📋 Prerequisites

1. **Node.js** installed on your system
2. **Wrangler CLI** for Cloudflare Workers deployment
3. **Cloudflare account** with Workers enabled

## 🔧 Deployment Steps

### Option 1: Use the Automated Script (Recommended)

**For Windows:**
```bash
deploy-cloudflare.bat
```

**For Mac/Linux:**
```bash
chmod +x deploy-cloudflare.sh
./deploy-cloudflare.sh
```

### Option 2: Manual Deployment

1. **Navigate to cloudflare-worker directory:**
   ```bash
   cd cloudflare-worker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

4. **Deploy to production:**
   ```bash
   wrangler deploy
   ```

## ✅ What Gets Deployed

### New Features Added:
- **📦 Cloud Backup System**: Complete backup of classes, students, and data
- **🔄 Auto-sync**: Cross-device data synchronization
- **⏰ Scheduled Backups**: Automatic daily backups
- **📥 Restore Functionality**: Easy data restoration
- **📱 Multi-device Support**: Classes accessible from any device

### API Endpoints:
- `POST /api/backup` - Create new backup
- `GET /api/backup/:id` - Retrieve backup
- `DELETE /api/backup/:id` - Delete backup
- `GET /api/backups/:userId` - List user backups
- All existing quiz endpoints remain functional

### KV Namespaces:
- **QUIZZES**: Quiz data and questions
- **RESULTS**: Quiz results and scores
- **BACKUPS**: User data backups (NEW)

## 🌐 Access Your Worker

After deployment, your worker will be available at:
```
https://flashcard-worker.espaderarios.workers.dev
```

## 📱 Testing Cross-Device Sync

1. **Open the app on Device A** and create a class
2. **Create a backup** using the Backup & Restore feature
3. **Open the app on Device B** 
4. **Restore from backup** to sync the class
5. **Verify** that the class appears on both devices

## 🔍 Troubleshooting

### If deployment fails:
```bash
# Check wrangler version
wrangler --version

# Update wrangler if needed
npm update -g wrangler

# Check authentication
wrangler whoami
```

### If backups don't work:
1. Verify Cloudflare URL in app settings
2. Check browser console for errors
3. Ensure KV namespaces are properly configured

### If classes don't sync:
1. Both devices must use the same Cloudflare URL
2. Check that user ID is consistent across devices
3. Verify backup was created before attempting restore

## 📊 Data Structure

Each backup contains:
```json
{
  "userId": "user_identifier",
  "timestamp": "2024-01-17T...",
  "data": {
    "classes": [...],
    "enrollments": [...],
    "studentProfiles": {...},
    "quizDrafts": {...},
    "userData": {...},
    "quizScores": {...},
    "importedPdfs": [...],
    "settings": {...}
  }
}
```

## 🔐 Security Notes

- All data is encrypted in transit
- Backups are stored in Cloudflare's secure KV storage
- Each user's data is isolated by userId
- Backups automatically expire after 90 days

## 📞 Support

If you encounter issues:
1. Check the Cloudflare Workers dashboard
2. Review deployment logs
3. Verify KV namespace bindings
4. Test API endpoints individually

---

**🎉 Your flashcard app now supports true cross-device synchronization!**
