# ✅ Firebase Push Notifications - Setup Checklist

Use this checklist to ensure everything is set up correctly.

---

## 📦 Phase 1: Installation

- [ ] **Install Firebase packages**
  ```bash
  npm install firebase firebase-admin
  ```
  ✅ Check: `node_modules/firebase` and `node_modules/firebase-admin` exist

- [ ] **Verify package.json updated**
  ✅ Check: Both `firebase` and `firebase-admin` listed in dependencies

---

## 🔥 Phase 2: Firebase Project Setup

- [ ] **Create Firebase Project**
  1. Go to https://console.firebase.google.com/
  2. Click "Add project" or select existing
  3. Follow wizard to create project
  
- [ ] **Enable Cloud Messaging**
  1. In Firebase Console, go to "Build" → "Cloud Messaging"
  2. Click "Get started" if prompted
  
- [ ] **Add Web App**
  1. Project Settings (⚙️) → "Your apps" section
  2. Click Web icon (</>)
  3. Register app with nickname (e.g., "EzyStudy Web")
  4. Copy the config object - you'll need this!

- [ ] **Generate VAPID Key**
  1. Project Settings → "Cloud Messaging" tab
  2. Scroll to "Web Push certificates"
  3. Click "Generate key pair"
  4. Copy the key - you'll need this!

- [ ] **Generate Service Account Key**
  1. Project Settings → "Service accounts" tab
  2. Click "Generate new private key"
  3. Download the JSON file
  4. Keep it safe - this is sensitive!

---

## 🔐 Phase 3: Environment Variables

- [ ] **Create .env.local file**
  ```bash
  touch .env.local
  ```

- [ ] **Add public Firebase config**
  ```env
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
  NEXT_PUBLIC_FIREBASE_APP_ID=
  NEXT_PUBLIC_FIREBASE_VAPID_KEY=
  ```
  ✅ Copy values from Firebase config object + VAPID key

- [ ] **Add private service account key**
  ```env
  FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
  ```
  ✅ Convert downloaded JSON to single-line string
  ⚠️ Escape newlines in private_key: `\n` becomes `\\n`

- [ ] **Verify .gitignore**
  ✅ Check `.env.local` is in `.gitignore`

---

## 🛠️ Phase 4: Configuration

- [ ] **Update Service Worker**
  1. Open `public/firebase-messaging-sw.js`
  2. Replace placeholder values (lines 9-15):
  ```javascript
  firebase.initializeApp({
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456:web:abc123"
  });
  ```
  ✅ Use same values as in .env.local

---

## 💾 Phase 5: Database Migration

- [ ] **Run Drizzle migration**
  ```bash
  npm run db:push
  ```
  ✅ Check: `fcmToken` column added to users table

- [ ] **Verify migration (Optional)**
  ```sql
  \d users
  ```
  ✅ Should see `fcmToken` column of type TEXT

---

## 🧪 Phase 6: Testing

### Initial Setup Test

- [ ] **Start development server**
  ```bash
  npm run dev
  ```

- [ ] **Open browser (Chrome recommended)**
  1. Navigate to http://localhost:3000
  2. Open DevTools (F12) → Console tab

- [ ] **Login to application**
  ✅ Should see notification permission dialog

- [ ] **Allow notifications**
  ✅ Console should show: "✅ Notification permission granted"
  ✅ Console should show: "✅ FCM token obtained"

- [ ] **Check service worker**
  1. DevTools → Application tab → Service Workers
  ✅ Should see `firebase-messaging-sw.js` registered and running

- [ ] **Verify token saved**
  ```sql
  SELECT email, "fcmToken" FROM users WHERE "fcmToken" IS NOT NULL;
  ```
  ✅ Should see your user with a token

### Notification Tests

- [ ] **Test 1: User Registration Notification**
  1. Open incognito window
  2. Register a new user
  3. Check if admin account receives notification
  ✅ Admin should see: "👤 New User Registered!"

- [ ] **Test 2: Course Creation Notification**
  1. Login as admin
  2. Create a new course
  3. Check if all users receive notification
  ✅ Users should see: "🎓 New Course Available!"

- [ ] **Test 3: Course Update Notification**
  1. Login as admin
  2. Update an existing course
  3. Check if all users receive notification
  ✅ Users should see: "🔄 Course Updated!"

- [ ] **Test 4: Subject Addition Notification**
  1. Login as admin
  2. Add a new subject to a semester
  3. Check if all users receive notification
  ✅ Users should see: "📖 New Subject Added!"

- [ ] **Test 5: Material Upload Notification**
  1. Login as admin
  2. Upload a study material
  3. Check if all users receive notification
  ✅ Users should see: "📄 New Study Material Available!"

### Background Notification Test

- [ ] **Test background notifications**
  1. Login and allow notifications
  2. Minimize browser or close tab
  3. Have another user trigger action (e.g., create course)
  4. Check if notification appears even though browser is closed
  ✅ Should receive browser notification

### Click Action Test

- [ ] **Test notification click**
  1. Receive a notification
  2. Click on the notification
  3. Verify it opens the correct page
  ✅ Should navigate to relevant page (e.g., library for course)

### Multi-Device Test (Optional)

- [ ] **Test on multiple devices**
  1. Login on desktop browser
  2. Login on mobile browser (use ngrok for HTTPS)
  3. Trigger notification
  ✅ Both devices should receive notification

---

## 🐛 Troubleshooting Checklist

If notifications aren't working, check:

- [ ] **Browser permissions**
  - Chrome: chrome://settings/content/notifications
  - Verify site is allowed

- [ ] **Console errors**
  - Open browser console (F12)
  - Look for Firebase or service worker errors

- [ ] **Service worker status**
  - DevTools → Application → Service Workers
  - Should be "activated and running"

- [ ] **Environment variables loaded**
  - Console: `console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)`
  - Should not be undefined

- [ ] **FCM token in database**
  ```sql
  SELECT "fcmToken" FROM users WHERE id = YOUR_USER_ID;
  ```
  - Should have a token value

- [ ] **HTTPS in production**
  - Service workers require HTTPS (except localhost)
  - Use proper SSL certificate

- [ ] **Server logs**
  - Check terminal for error messages
  - Look for "Failed to send push notification" errors

---

## ✨ Success Indicators

### ✅ You're all set if:

- [x] No console errors
- [x] Service worker registered
- [x] FCM token in database
- [x] Notifications appear on actions
- [x] Click redirects to correct page
- [x] Works in background (tab closed)
- [x] Works on multiple devices

### 🎉 Ready for Production if:

- [x] All tests passing
- [x] Environment variables on hosting platform
- [x] HTTPS enabled
- [x] Different Firebase project for production
- [x] Error handling tested
- [x] Performance acceptable

---

## 📚 Reference Documents

- **Quick Start:** [QUICK_START.md](./QUICK_START.md)
- **Detailed Setup:** [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **Implementation Summary:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Hindi Guide:** [PUSH_NOTIFICATIONS_HINDI.md](./PUSH_NOTIFICATIONS_HINDI.md)

---

## 💾 Backup & Recovery

Before going live:

- [ ] **Backup .env.local**
  - Store securely (password manager, encrypted storage)
  
- [ ] **Document Firebase project details**
  - Project ID
  - Service account email
  - When keys were generated

- [ ] **Test disaster recovery**
  - Can you restore from backup?
  - Are credentials accessible?

---

## 🚀 Deployment Checklist

For production deployment:

- [ ] **Add environment variables to hosting platform**
  - Vercel: Settings → Environment Variables
  - Netlify: Site settings → Environment variables
  
- [ ] **Use production Firebase project**
  - Different from development project
  
- [ ] **Verify HTTPS**
  - Required for service workers
  
- [ ] **Test in production**
  - Send test notifications
  - Verify functionality

- [ ] **Monitor errors**
  - Set up error tracking (Sentry, etc.)
  - Monitor Firebase console

---

## 📞 Need Help?

If stuck:

1. ✅ Review error messages in console
2. ✅ Check [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) troubleshooting section
3. ✅ Verify all environment variables are set correctly
4. ✅ Test in different browser
5. ✅ Check Firebase Console for project status

---

**Print this checklist and tick off items as you complete them!**

**Last Updated:** December 13, 2024  
**Version:** 1.0.0
