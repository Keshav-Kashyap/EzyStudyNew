# 🚀 Quick Start Guide - Firebase Push Notifications

## ⚡ Fast Setup (5 Minutes)

### 1️⃣ Install Dependencies
```bash
npm install firebase firebase-admin
```

### 2️⃣ Create `.env.local` File

Copy this template and fill in your Firebase credentials:

```env
# ============================================
# FIREBASE PUSH NOTIFICATIONS CONFIGURATION
# ============================================

# Client Config (from Firebase Console → Project Settings → Your apps → Web app)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# Server Config (from Firebase Console → Project Settings → Service Accounts → Generate Key)
FIREBASE_SERVICE_ACCOUNT_KEY=
```

### 3️⃣ Get Firebase Credentials

**Option A: Quick Setup (Recommended)**
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Create project → Enable Cloud Messaging
3. Add Web App → Copy config values
4. Generate VAPID key (Cloud Messaging tab)
5. Generate Service Account key (download JSON)

**Option B: Detailed Guide**
📖 See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for step-by-step instructions

### 4️⃣ Update Service Worker

Edit `public/firebase-messaging-sw.js` (lines 9-15):
```javascript
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",              // Replace with actual values
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});
```

### 5️⃣ Run Database Migration

```bash
npm run db:push
```

Or manually:
```bash
psql -d your_database < drizzle/add_fcm_token.sql
```

### 6️⃣ Start & Test

```bash
npm run dev
```

Then:
1. Login to your app
2. Allow notifications when prompted
3. Create a course or upload material
4. Check if notification appears! 🎉

---

## 📋 What Notifications Are Triggered?

| Action | Who Gets Notified | Message |
|--------|-------------------|---------|
| New User Registers | Admins | "👤 New User Registered!" |
| Course Created | All Users | "🎓 New Course Available!" |
| Course Updated | All Users | "🔄 Course Updated!" |
| Subject Added | All Users | "📖 New Subject Added!" |
| Material Uploaded | All Users | "📄 New Study Material!" |

---

## 🔍 Quick Troubleshooting

### ❌ Notifications not working?

**Check 1:** Browser permissions
- Chrome: `chrome://settings/content/notifications`
- Check if your site is allowed

**Check 2:** Environment variables
```bash
# Verify they're set
echo $NEXT_PUBLIC_FIREBASE_API_KEY
```

**Check 3:** Service worker
- Open DevTools → Application → Service Workers
- Should see `firebase-messaging-sw.js` registered

**Check 4:** FCM token
- Login and check browser console
- Should see: "✅ FCM token obtained"

**Check 5:** Database
```sql
SELECT "fcmToken" FROM users WHERE email = 'your@email.com';
```
Should return a token value.

---

## 📚 Full Documentation

- **🔧 Setup Guide:** [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **📖 Implementation Details:** [PUSH_NOTIFICATIONS_README.md](./PUSH_NOTIFICATIONS_README.md)
- **🇮🇳 Hindi Guide:** [PUSH_NOTIFICATIONS_HINDI.md](./PUSH_NOTIFICATIONS_HINDI.md)
- **✅ Complete Summary:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 💡 Pro Tips

1. **Testing:** Use Chrome DevTools → Application → Service Workers to debug
2. **Development:** Use ngrok or similar to test on mobile (requires HTTPS)
3. **Production:** Environment variables on Vercel/Netlify → Settings → Environment Variables
4. **Security:** Never commit `.env.local` - add to `.gitignore`

---

## 🎯 Expected Behavior

### ✅ Working Correctly If:
- [ ] Notification permission requested on login
- [ ] Browser shows "✅ FCM token obtained" in console
- [ ] Token visible in database (users table)
- [ ] Notifications appear when actions are performed
- [ ] Clicking notification opens correct page
- [ ] Works even when browser tab is closed

### ❌ Something Wrong If:
- [ ] No permission dialog appears
- [ ] Console shows Firebase errors
- [ ] No token in database
- [ ] Notifications don't appear

**Solution:** Review [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) troubleshooting section

---

## 🚀 Ready to Go!

Once you've:
1. ✅ Installed dependencies
2. ✅ Added environment variables
3. ✅ Updated service worker
4. ✅ Run database migration

You're done! Start the app and test. 🎉

**Need help?** Check the detailed guides in the links above.

---

**Last Updated:** December 13, 2024  
**Status:** ✅ Ready to Use
