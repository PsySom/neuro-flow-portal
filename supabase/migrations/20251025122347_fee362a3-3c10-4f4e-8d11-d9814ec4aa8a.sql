-- Add onboarding data fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS primary_goal TEXT,
ADD COLUMN IF NOT EXISTS challenges TEXT[],
ADD COLUMN IF NOT EXISTS chronotype TEXT,
ADD COLUMN IF NOT EXISTS time_commitment TEXT,
ADD COLUMN IF NOT EXISTS reminder_frequency TEXT;

-- Add index for onboarding queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed 
ON public.profiles(onboarding_completed);

COMMENT ON COLUMN public.profiles.onboarding_completed IS 'Whether user has completed the onboarding process';
COMMENT ON COLUMN public.profiles.onboarding_data IS 'Complete onboarding data stored as JSON for future reference';
COMMENT ON COLUMN public.profiles.primary_goal IS 'User''s primary goal from onboarding';
COMMENT ON COLUMN public.profiles.challenges IS 'User''s selected challenge areas';
COMMENT ON COLUMN public.profiles.chronotype IS 'User''s chronotype (morning/day/evening/varies)';
COMMENT ON COLUMN public.profiles.time_commitment IS 'Time commitment for daily practices';
COMMENT ON COLUMN public.profiles.reminder_frequency IS 'Preferred reminder frequency';