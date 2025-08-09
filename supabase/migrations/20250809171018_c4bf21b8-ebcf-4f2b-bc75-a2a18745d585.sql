-- Secure profiles: restrict public SELECT and keep insert/update for owner
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Secure legacy users table: enable RLS (no policies -> deny all)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;