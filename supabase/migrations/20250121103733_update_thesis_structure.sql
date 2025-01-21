
-- Update the thesis content type to include general introduction and conclusion
CREATE TYPE section_type AS ENUM (
  'abstract',
  'general-introduction',
  'introduction',
  'chapter',
  'conclusion',
  'general-conclusion',
  'references',
  'appendix',
  'table-of-contents',
  'acknowledgments'
);

-- Create a table for thesis versions
CREATE TABLE IF NOT EXISTS thesis_versions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  thesis_id uuid REFERENCES theses(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  content jsonb NOT NULL,
  description text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  changes jsonb,
  UNIQUE(thesis_id, version_number)
);

-- Update the theses table to ensure it has the necessary columns
ALTER TABLE theses
ADD COLUMN IF NOT EXISTS version text DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft'
  CHECK (status IN ('draft', 'in_review', 'published')),
ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '{"isPublic": false, "allowComments": true, "allowSharing": false}'::jsonb;

-- Add RLS policies for thesis versions
ALTER TABLE thesis_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own thesis versions"
  ON thesis_versions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM theses WHERE id = thesis_versions.thesis_id
      UNION
      SELECT tc.user_id FROM thesis_collaborators tc WHERE tc.thesis_id = thesis_versions.thesis_id
    )
  );

CREATE POLICY "Users can create versions for their own theses"
  ON thesis_versions FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM theses WHERE id = thesis_versions.thesis_id
      UNION
      SELECT tc.user_id FROM thesis_collaborators tc 
      WHERE tc.thesis_id = thesis_versions.thesis_id 
      AND tc.role IN ('editor', 'admin')
    )
  );

-- Add a trigger to validate thesis content structure
CREATE OR REPLACE FUNCTION validate_thesis_content()
RETURNS trigger AS $$
BEGIN
  -- Validate that required sections exist
  IF NOT (
    NEW.content->>'metadata' IS NOT NULL AND
    NEW.content->>'frontMatter' IS NOT NULL AND
    NEW.content->>'generalIntroduction' IS NOT NULL AND
    NEW.content->>'chapters' IS NOT NULL AND
    NEW.content->>'generalConclusion' IS NOT NULL AND
    NEW.content->>'backMatter' IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Thesis content must include metadata, frontMatter, generalIntroduction, chapters, generalConclusion, and backMatter';
  END IF;

  -- Validate section types
  IF (
    NEW.content->'generalIntroduction'->>'type' != 'general-introduction' OR
    NEW.content->'generalConclusion'->>'type' != 'general-conclusion'
  ) THEN
    RAISE EXCEPTION 'Invalid section types for general introduction or conclusion';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the validation trigger to both theses and thesis_versions tables
DROP TRIGGER IF EXISTS validate_thesis_content_trigger ON theses;
CREATE TRIGGER validate_thesis_content_trigger
  BEFORE INSERT OR UPDATE ON theses
  FOR EACH ROW
  EXECUTE FUNCTION validate_thesis_content();

DROP TRIGGER IF EXISTS validate_thesis_version_content_trigger ON thesis_versions;
CREATE TRIGGER validate_thesis_version_content_trigger
  BEFORE INSERT OR UPDATE ON thesis_versions
  FOR EACH ROW
  EXECUTE FUNCTION validate_thesis_content();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_thesis_versions_thesis_id ON thesis_versions(thesis_id);
CREATE INDEX IF NOT EXISTS idx_thesis_versions_created_by ON thesis_versions(created_by);
CREATE INDEX IF NOT EXISTS idx_theses_status ON theses(status);
CREATE INDEX IF NOT EXISTS idx_theses_user_id ON theses(user_id);

-- Add a function to get the latest version of a thesis
CREATE OR REPLACE FUNCTION get_latest_thesis_version(p_thesis_id uuid)
RETURNS thesis_versions AS $$
  SELECT *
  FROM thesis_versions
  WHERE thesis_id = p_thesis_id
  ORDER BY version_number DESC
  LIMIT 1;
$$ LANGUAGE sql;