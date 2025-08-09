-- 1) Ensure table exists first
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3) Create policies only if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND polname = 'Profiles are viewable by everyone'
  ) THEN
    EXECUTE 'CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND polname = 'Users can update their own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND polname = 'Users can insert their own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
END
$$;

-- 4) Create update trigger if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t 
    JOIN pg_class c ON c.oid = t.tgrelid 
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE t.tgname = 'profiles_set_updated_at' AND n.nspname = 'public' AND c.relname = 'profiles'
  ) THEN
    CREATE TRIGGER profiles_set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END
$$;

-- 5) Helper function
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS public.profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid();
$$;