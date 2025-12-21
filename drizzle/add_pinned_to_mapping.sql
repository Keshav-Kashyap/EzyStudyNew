-- Add isPinned and pinnedAt columns to material_subject_mapping table
ALTER TABLE material_subject_mapping 
ADD COLUMN IF NOT EXISTS "isPinned" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "pinnedAt" TIMESTAMP;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_mapping_pinned 
ON material_subject_mapping(subjectId, isPinned, pinnedAt);
