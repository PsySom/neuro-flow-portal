-- Create user_active_diaries table
CREATE TABLE IF NOT EXISTS public.user_active_diaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_slug text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, scenario_slug)
);

-- Enable RLS
ALTER TABLE public.user_active_diaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own active diaries"
ON public.user_active_diaries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own active diaries"
ON public.user_active_diaries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own active diaries"
ON public.user_active_diaries
FOR DELETE
USING (auth.uid() = user_id);