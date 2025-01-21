-- Add description column to theses table
ALTER TABLE theses
ADD COLUMN IF NOT EXISTS description text;
