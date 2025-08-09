-- Ensure role assignment on new user signups
DO $$ BEGIN
  -- Drop existing trigger if present to avoid duplicates
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created_role'
  ) THEN
    DROP TRIGGER on_auth_user_created_role ON auth.users;
  END IF;
END $$;

-- Create trigger to assign default roles (including admin for specific email)
CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Backfill: ensure the admin role is set for the known admin email if the user already exists
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) = lower('123456@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
