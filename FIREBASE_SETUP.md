# Firebase Push Notifications Setup Guide

This document contains all the required environment variables to enable Firebase push notifications in your EzyStudy application.

## Prerequisites

Before setting up, you need:
1. A Firebase project created at [Firebase Console](https://console.firebase.google.com/)
2. Firebase Cloud Messaging (FCM) enabled in your project
3. A service account key generated from Firebase

---

## Required Environment Variables

Add these variables to your `.env.local` file:

### 1. Firebase Client Configuration (Browser)

These are **public** variables used by the client-side Firebase SDK:

```env
# Firebase Client Configuration (Public - Safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here
```

#### Where to find these values:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on **Settings** (⚙️) → **Project settings**
4. Scroll down to **Your apps** section
5. If you don't have a web app, click **Add app** → Select **Web** (</>) → Register your app
6. Copy the config object values:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

#### VAPID Key (Web Push Certificate):

1. In Firebase Console → **Settings** → **Project settings**
2. Go to **Cloud Messaging** tab
3. Scroll to **Web Push certificates**
4. If no key pair exists, click **Generate key pair**
5. Copy the **Key pair** value → `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

---

### 2. Firebase Admin Configuration (Server)

This is a **private** variable used by the server-side Firebase Admin SDK:

```env
# Firebase Admin Service Account (Private - Keep Secret!)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your_project_id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"firebase-adminsdk-...@your_project_id.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

#### How to get the Service Account Key:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on **Settings** (⚙️) → **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file
7. **Important:** Convert the JSON to a single-line string:
   - Remove all line breaks
   - Escape double quotes inside the JSON
   - The entire JSON should be wrapped in single quotes

**Example conversion:**

Original JSON:
```json
{
  "type": "service_account",
  "project_id": "my-project",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
}
```

Converted to environment variable:
```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"my-project","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n"}'
```

**Note:** Keep this value **secret** and never commit it to version control!

---

## Complete .env.local Example

```env
# ===================================
# Firebase Push Notifications Setup
# ===================================

# Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ezystudy-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ezystudy-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ezystudy-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Server Configuration (Private - Keep Secret!)
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"ezystudy-xxxxx","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"firebase-adminsdk-xxxxx@ezystudy-xxxxx.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}'
```

---

## Installation Steps

### 1. Install Firebase Dependencies

```bash
npm install firebase firebase-admin
```

### 2. Database Migration

Run the database migration to add the `fcmToken` column to the users table:

```bash
npm run db:push
```

Or manually add the column:

```sql
ALTER TABLE users ADD COLUMN fcmToken TEXT;
```

### 3. Update Service Worker Config

After adding the environment variables, the service worker (`/public/firebase-messaging-sw.js`) needs to be configured with your Firebase project details. Replace the placeholder values in the file with your actual Firebase config.

### 4. Test Notifications

1. Start your development server: `npm run dev`
2. Log in to your application
3. Allow notification permissions when prompted
4. Test by:
   - Registering a new user (admins should receive notification)
   - Creating a course (all users should receive notification)
   - Adding a subject (all users should receive notification)
   - Uploading study material (all users should receive notification)

---

## Notification Flow

### When Users Register:
- ✅ Admins receive push notification about new user registration
- 📧 Notification: "New User Registered!"

### When Admin Creates/Updates Course:
- ✅ All active users receive push notification
- 📚 Notification: "New Course Available!" or "Course Updated!"

### When Admin Adds Subject:
- ✅ All active users receive push notification
- 📖 Notification: "New Subject Added!"

### When Admin Uploads Material:
- ✅ All active users receive push notification
- 📄 Notification: "New Study Material Available!"

---

## Troubleshooting

### Issue: Notifications not received

**Check:**
1. Browser permissions granted?
2. Service worker registered? (Check DevTools → Application → Service Workers)
3. FCM token saved to database? (Check user record in database)
4. Firebase credentials correct?
5. Internet connection active?

### Issue: Service worker not registering

**Solutions:**
1. Clear browser cache
2. Unregister existing service workers
3. Check browser console for errors
4. Ensure HTTPS (required for service workers in production)

### Issue: Invalid Firebase credentials

**Check:**
1. All environment variables are set correctly
2. Service account JSON is properly escaped
3. No extra spaces in environment variables
4. Restart development server after changing .env.local

---

## Security Notes

⚠️ **Important Security Guidelines:**

1. **NEVER** commit `.env.local` to version control
2. **NEVER** expose `FIREBASE_SERVICE_ACCOUNT_KEY` publicly
3. Add `.env.local` to `.gitignore`
4. Use different Firebase projects for development and production
5. Rotate service account keys periodically
6. Set up Firebase Security Rules properly

---

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add all environment variables to your hosting platform's environment variables section
2. Ensure HTTPS is enabled (required for push notifications)
3. Update service worker with production Firebase config
4. Test notifications thoroughly in production environment

---

## Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Web Push Notifications Guide](https://firebase.google.com/docs/cloud-messaging/js/client)

---

## Support

If you encounter any issues:
1. Check Firebase Console for errors
2. Review browser console logs
3. Check server logs for Firebase Admin SDK errors
4. Verify all environment variables are set correctly

---

**Last Updated:** December 2024
