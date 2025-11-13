# Database Connection Troubleshooting Guide

## Problem: Connect Timeout Error

You're seeing errors like:
```
Connect Timeout Error (attempted addresses: ..., timeout: 10000ms)
code: 'UND_ERR_CONNECT_TIMEOUT'
```

## Solutions Applied

### 1. ✅ Increased Timeout in Database Configuration
- Changed timeout from 10s to 30s in `config/db.jsx`
- Added connection caching for better performance

### 2. ✅ Added Retry Logic
- Automatic retry with exponential backoff (3 attempts total)
- Handles temporary connection issues gracefully

### 3. ✅ Better Error Handling
- Detailed error logging for debugging
- Improved error responses

## Quick Fixes to Try

### Step 1: Verify Environment Variables
Create a `.env.local` file in your project root (if not exists):

```env
# Get this from your Neon dashboard
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require"

# Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Step 2: Test Database Connection
Visit: `http://localhost:3000/api/check-db`

This will tell you if your database is reachable.

### Step 3: Check Neon Dashboard
1. Go to https://console.neon.tech
2. Check if your database is active (not suspended)
3. Verify connection pooling is enabled
4. Check if you have any IP restrictions

### Step 4: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Common Issues

### Issue 1: Database Suspended
**Solution:** Neon free tier databases suspend after inactivity. Just visit your Neon dashboard to wake it up.

### Issue 2: Wrong DATABASE_URL
**Solution:** Make sure you're using the **pooled connection string** from Neon (ends with `?sslmode=require` or has `pooler=true`).

### Issue 3: Firewall/Network Issues
**Solution:** 
- Check your antivirus/firewall
- Try disabling VPN
- Check if your ISP blocks certain ports

### Issue 4: Cold Starts
**Solution:** The first request after inactivity may be slow. The retry logic now handles this.

## Alternative: Use WebSocket Connection (Recommended for serverless)

If issues persist, you can switch to WebSocket connection:

```javascript
// config/db.jsx
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool });
```

Then install ws:
```bash
npm install ws
```

## Testing After Fixes

1. Restart your dev server: `npm run dev`
2. Visit the dashboard: `http://localhost:3000/dashboard`
3. Check browser console and terminal for errors
4. Test the database connection: `http://localhost:3000/api/check-db`

## Still Having Issues?

Check these logs:
1. Browser Console (F12)
2. Terminal where `npm run dev` is running
3. Network tab in browser DevTools

Look for specific error codes and search them in Neon docs: https://neon.tech/docs
