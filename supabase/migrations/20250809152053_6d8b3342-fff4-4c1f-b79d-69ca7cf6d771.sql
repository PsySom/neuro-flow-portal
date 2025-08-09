-- Fix linter issues
-- 1) Enable RLS on public.users (legacy table) and deny by default
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- Add minimal safe policies (deny all by default by not creating permissive ones)
-- Optionally, create explicit deny policies (no-op), but enabling RLS is enough to block access.

-- 2) Recreate functions with explicit search_path

-- update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- update_activity_status with search_path
CREATE OR REPLACE FUNCTION public.update_activity_status(activity_id uuid, new_status text, user_notes text DEFAULT NULL::text)
RETURNS TABLE(id uuid, title text, status text, updated_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Update activity status
    UPDATE public.activities 
    SET 
        status = new_status,
        updated_at = NOW()
    WHERE activities.id = activity_id 
    AND activities.user_id = auth.uid();
    
    -- Insert or update activity state
    INSERT INTO public.activity_states (
        activity_id,
        user_id,
        state,
        notes,
        created_at,
        updated_at
    ) VALUES (
        activity_id,
        auth.uid(),
        new_status,
        user_notes,
        NOW(),
        NOW()
    )
    ON CONFLICT (activity_id, user_id) 
    DO UPDATE SET
        state = EXCLUDED.state,
        notes = EXCLUDED.notes,
        updated_at = NOW();
    
    -- Return updated activity
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.status,
        a.updated_at
    FROM public.activities a
    WHERE a.id = activity_id 
    AND a.user_id = auth.uid();
END;
$$;

-- get_my_profile with explicit search_path
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS public.profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT * FROM public.profiles WHERE id = auth.uid();
$$;