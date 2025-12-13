# 🔔 Firebase Push Notifications - हिंदी में सारांश

आपके EzyStudy एप्लिकेशन में Firebase push notifications सफलतापूर्वक integrate कर दिए गए हैं!

## 🎯 क्या-क्या Features Add किए गए

### 1. जब कोई नया User Register करता है:
- ✅ **सभी Admins को notification जाएगी**
- 📧 Message: "👤 New User Registered! [नाम] has just registered."
- 🔗 Link: Admin Users Page

### 2. जब Admin कोई Course बनाता/Update करता है:
- ✅ **सभी Users को notification जाएगी**
- 📚 Message: "🎓 New Course Available!" या "🔄 Course Updated!"
- 🔗 Link: उस Course की Library Page

### 3. जब Admin कोई Subject Add करता है:
- ✅ **सभी Users को notification जाएगी**
- 📖 Message: "📖 New Subject Added! [Subject] has been added to [Semester]"
- 🔗 Link: उस Course की Library Page

### 4. जब Admin Study Material Upload करता है:
- ✅ **सभी Users को notification जाएगी**
- 📄 Message: "📄 New Study Material Available! '[Title]' has been uploaded"
- 🔗 Link: उस Subject की Page

---

## 🚀 Setup कैसे करें

### Step 1: Dependencies Install करें
```bash
npm install firebase firebase-admin
```

### Step 2: Firebase Project बनाएं

1. [Firebase Console](https://console.firebase.google.com/) पर जाएं
2. New Project बनाएं या existing project select करें
3. Cloud Messaging enable करें

### Step 3: Environment Variables Add करें

`.env.local` file में ये variables add करें:

```env
# Firebase Client Config (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key

# Firebase Admin Config (Private - Secret!)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...full JSON here...}'
```

### ⚠️ Important: ये values कहाँ से लें

#### Client Config के लिए:
1. Firebase Console → Settings → Project Settings
2. "Your apps" section में जाएं
3. Web app add करें (अगर नहीं है तो)
4. Config object से values copy करें

#### VAPID Key के लिए:
1. Project Settings → Cloud Messaging tab
2. "Web Push certificates" section में जाएं
3. "Generate key pair" click करें
4. Key copy करें

#### Service Account Key के लिए:
1. Project Settings → Service Accounts tab
2. "Generate new private key" click करें
3. JSON file download होगी
4. पूरे JSON को single line में convert करें (line breaks हटा दें)
5. Single quotes में wrap करें

**📖 Detailed guide: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) देखें**

### Step 4: Database Update करें

```bash
npm run db:push
```

या manually:
```sql
ALTER TABLE users ADD COLUMN fcmToken TEXT;
```

### Step 5: Service Worker Update करें

`/public/firebase-messaging-sw.js` file में अपने Firebase config values डालें (placeholder values replace करें)

### Step 6: Test करें!

```bash
npm run dev
```

फिर:
1. Login करें
2. Notification permission allow करें
3. कोई course create करें या material upload करें
4. Notification मिलनी चाहिए! 🎉

---

## 📱 कैसे काम करता है

### User का Experience:

1. **Login करते ही** → Browser notification permission माँगेगा
2. **Allow करने पर** → Firebase एक unique token generate करेगा
3. **Token save हो जाएगा** → Database में user के साथ link होगा
4. **Admin कोई action ले** → Server Firebase के through notification भेजेगा
5. **Notification मिल जाएगी** → Even अगर browser band भी हो!

### कब-कब notification मिलेगी:

| Action | किसको मिलेगी | Message |
|--------|--------------|---------|
| नया user register | सभी Admins को | "New User Registered" |
| Course बनाया | सभी Users को | "New Course Available" |
| Course update की | सभी Users को | "Course Updated" |
| Subject add की | सभी Users को | "New Subject Added" |
| Material upload की | सभी Users को | "New Study Material" |

---

## ✅ क्या-क्या Features हैं

- ✅ **Background Notifications** - Browser band होने पर भी notifications आएंगी
- ✅ **Foreground Notifications** - Browser open होने पर real-time updates
- ✅ **Multi-device Support** - Same user, multiple devices पर notifications
- ✅ **Click करने पर** - Directly relevant page पर जाएगा
- ✅ **Notification History** - सभी notifications database में save होंगी
- ✅ **Permission Management** - Users enable/disable कर सकते हैं

---

## 🎨 Notifications के Types

| Icon | Type | कब भेजी जाती है |
|------|------|----------------|
| 👤 | User Registered | नया user signup करे |
| 🎓 | Course Created | नया course बनाया जाए |
| 🔄 | Course Updated | course update हो |
| 📖 | Subject Added | नया subject add हो |
| 📄 | Material Uploaded | नया material upload हो |

---

## 🔧 Files जो Add/Update हुई हैं

### नई Files:
```
lib/firebase-admin.js              # Server-side push sending
lib/firebase-client.js             # Browser-side notifications
hooks/useFirebaseMessaging.js      # React hook for notifications
app/api/notifications/fcm-token/   # Token save/delete API
public/firebase-messaging-sw.js    # Background notifications
drizzle/add_fcm_token.sql         # Database migration
FIREBASE_SETUP.md                  # Setup guide (English)
PUSH_NOTIFICATIONS_README.md       # Summary (English)
```

### Updated Files:
```
config/schema.jsx                  # fcmToken field added
services/notificationService.js    # Push notification support
context/NotificationContext.jsx    # Firebase integration
app/api/users/register/route.jsx   # Notify admins
app/api/admin/courses/route.jsx    # Notify on course create
app/api/admin/subjects/route.jsx   # Notify on subject add
app/api/admin/upload/route.jsx     # Notify on material upload
```

---

## 🐛 अगर काम नहीं कर रहा तो

### Problem: Notifications नहीं आ रही

**Check करें:**
1. Browser permission दी है? (Settings → Notifications)
2. Firebase credentials सही हैं?
3. Service worker register हुआ? (DevTools → Application → Service Workers)
4. FCM token database में save हुआ? (users table check करें)
5. Internet connection active है?

### Problem: Service worker register नहीं हो रहा

**Solutions:**
1. Browser cache clear करें
2. Hard refresh करें (Ctrl+Shift+R)
3. Console में errors check करें
4. HTTPS use करें (localhost के अलावा)

### Problem: Firebase credentials invalid

**Check:**
1. सभी environment variables correctly set हैं?
2. Service account JSON properly escaped है?
3. `.env.local` में extra spaces तो नहीं?
4. Server restart किया after changing .env?

**Detailed troubleshooting: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) देखें**

---

## 🔐 Security Tips

⚠️ **ध्यान दें:**

1. ✅ `.env.local` को **कभी भी** Git में commit न करें
2. ✅ `FIREBASE_SERVICE_ACCOUNT_KEY` को **secret** रखें
3. ✅ `.gitignore` में `.env.local` add करें
4. ✅ Development और production के लिए अलग Firebase projects use करें
5. ✅ Service account keys को periodically rotate करें

---

## 🧪 Testing Checklist

Test करने के लिए:

- [ ] Login करें और notification permission मिले
- [ ] Permission allow करने पर FCM token database में save हो
- [ ] नया user register करें → Admin को notification मिले
- [ ] Course बनाएं → सभी users को notification मिले
- [ ] Subject add करें → सभी users को notification मिले
- [ ] Material upload करें → सभी users को notification मिले
- [ ] Notification click करें → correct page पर redirect हो
- [ ] Browser tab close करें → फिर भी notification आए
- [ ] Multiple devices पर test करें

---

## 📊 Database Changes

Users table में एक नया column add हुआ:

```sql
ALTER TABLE users ADD COLUMN fcmToken TEXT;
```

ये column user के device का Firebase token store करता है, जो push notifications भेजने के लिए use होता है.

---

## ✨ Summary

आपके EzyStudy app में अब **complete push notification system** है जो:

✅ Admins को notify करता है जब नया user register करे  
✅ सभी users को notify करता है जब course बने/update हो  
✅ सभी users को notify करता है जब subject add हो  
✅ सभी users को notify करता है जब material upload हो  
✅ Background में काम करता है (browser band होने पर भी)  
✅ Multiple devices support करता है  
✅ Notification history store करता है  
✅ Existing notification UI के साथ fully integrated है  

---

## 🎯 अब क्या करें

1. ✅ Firebase project बनाएं
2. ✅ Environment variables `.env.local` में add करें
3. ✅ Database migration run करें (`npm run db:push`)
4. ✅ Service worker config update करें
5. ✅ Test करें!

**Detailed English guide: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

**Bas ab Firebase credentials daal do aur notifications chalane lag jayengi! 🚀**

---

**Created:** December 2024  
**Status:** ✅ Ready to Use  
**Language Support:** Hindi + English
