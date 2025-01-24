-- Create thesis_collaborators table
CREATE TABLE thesis_collaborators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thesis_version_id UUID NOT NULL REFERENCES thesis_versions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    role TEXT NOT NULL,
    UNIQUE (thesis_version_id, user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE thesis_collaborators ENABLE ROW LEVEL SECURITY;

-- RLS policies for thesis_collaborators
CREATE POLICY "Enable read access for all users" ON thesis_collaborators FOR SELECT USING (true);
CREATE POLICY "Allow insert for users who are collaborators on the thesis version" ON thesis_collaborators FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1
        FROM thesis_versions tv
        WHERE tv.id = thesis_collaborators.thesis_version_id
        AND tv.thesis_id IN (
            SELECT t.id
            FROM theses t
            WHERE t.user_id = auth.uid()
        )
    )
);
CREATE POLICY "Allow update for users who are collaborators and owners" ON thesis_collaborators FOR UPDATE USING (
    EXISTS (
        SELECT 1
        FROM thesis_versions tv
        WHERE tv.id = thesis_collaborators.thesis_version_id
        AND tv.thesis_id IN (
            SELECT t.id
            FROM theses t
            WHERE t.user_id = auth.uid()
        )
    )
) WITH CHECK (
    EXISTS (
        SELECT 1
        FROM thesis_versions tv
        WHERE tv.id = thesis_collaborators.thesis_version_id
        AND tv.thesis_id IN (
            SELECT t.id
            FROM theses t
            WHERE t.user_id = auth.uid()
        )
    )
);
CREATE POLICY "Allow delete for thesis owners" ON thesis_collaborators FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM thesis_versions tv
        WHERE tv.id = thesis_collaborators.thesis_version_id
        AND tv.thesis_id IN (
            SELECT t.id
            FROM theses t
            WHERE t.user_id = auth.uid()
        )
    )
);