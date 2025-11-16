-- Add isPopular column to study_materials table
ALTER TABLE study_materials ADD COLUMN IF NOT EXISTS "isPopular" boolean DEFAULT false;

-- Auto-mark materials with 50+ likes as popular
UPDATE study_materials SET "isPopular" = true WHERE likes >= 50;
