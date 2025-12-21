-- Add hasReviewed column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS "hasReviewed" boolean DEFAULT false;

-- Update existing users who have already submitted reviews
UPDATE users 
SET "hasReviewed" = true 
WHERE "userId" IN (
    SELECT DISTINCT "userId" FROM reviews
);
