
-- Create theses table
CREATE TABLE IF NOT EXISTS public.theses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Untitled Thesis',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  language text DEFAULT 'en',
  status text NOT NULL DEFAULT 'draft',
  version text DEFAULT '1.0',
  description text,
  supervisor_email text,
  supervisor_id uuid
);

ALTER TABLE public.theses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own theses" ON public.theses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own theses" ON public.theses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own theses" ON public.theses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own theses" ON public.theses
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all theses" ON public.theses
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can delete any thesis" ON public.theses
  FOR DELETE USING (is_admin());

-- Create thesis_collaborators table
CREATE TABLE IF NOT EXISTS public.thesis_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thesis_id uuid NOT NULL REFERENCES public.theses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'viewer',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(thesis_id, user_id)
);

ALTER TABLE public.thesis_collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view collaborators on their theses" ON public.thesis_collaborators
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.theses WHERE id = thesis_id AND user_id = auth.uid())
  );

CREATE POLICY "Thesis owners can manage collaborators" ON public.thesis_collaborators
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.theses WHERE id = thesis_id AND user_id = auth.uid())
  );

-- Create app_issues table
CREATE TABLE IF NOT EXISTS public.app_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  component_name text,
  error_message text NOT NULL,
  browser_info text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.app_issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert app issues" ON public.app_issues
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all app issues" ON public.app_issues
  FOR SELECT USING (is_admin());

-- Create updated_at trigger for theses
CREATE TRIGGER update_theses_updated_at
  BEFORE UPDATE ON public.theses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
