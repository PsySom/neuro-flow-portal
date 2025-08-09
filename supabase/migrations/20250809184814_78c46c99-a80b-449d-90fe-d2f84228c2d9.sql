-- 1) Update role assignment function to use new admin email
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $$
BEGIN
  -- Assign default 'user' role to every new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Assign admin role for the configured admin email
  IF lower(NEW.email) = lower('somov50@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- 2) Backfill: remove admin from old address and grant to the new one
-- Remove admin role from 123456@gmail.com if present
DELETE FROM public.user_roles ur
USING auth.users u
WHERE ur.user_id = u.id
  AND lower(u.email) = lower('123456@gmail.com')
  AND ur.role = 'admin'::public.app_role;

-- Ensure admin role for somov50@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) = lower('somov50@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;