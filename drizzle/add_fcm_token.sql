-- Migration: Add FCM Token Support for Push Notifications
-- Date: 2024-12-13
-- Description: Adds fcmToken column to users table to store Firebase Cloud Messaging tokens

-- Add fcmToken column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS "fcmToken" TEXT;

-- Add index for faster token lookups (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_users_fcmToken ON users("fcmToken");

-- Add comment to column
COMMENT ON COLUMN users."fcmToken" IS 'Firebase Cloud Messaging token for push notifications';

-- Migration complete
-- Users can now receive push notifications on their devices
