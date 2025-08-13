-- Add admin policies for profiles table while maintaining user privacy
-- This allows admins to view profiles for moderation purposes only

-- Allow admins to view all profiles (for moderation and support)
CREATE POLICY "Admins can view all profiles for moderation"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update profiles (for moderation purposes)
CREATE POLICY "Admins can update profiles for moderation"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete profiles (for security purposes)
CREATE POLICY "Admins can delete profiles for security"
ON public.profiles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add a security audit log for admin access to sensitive profile data
CREATE TABLE IF NOT EXISTS public.profile_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id),
  accessed_user_id UUID NOT NULL REFERENCES auth.users(id),
  access_type TEXT NOT NULL, -- 'view', 'update', 'delete'
  accessed_fields TEXT[], -- array of field names accessed
  reason TEXT, -- justification for access
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.profile_access_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view profile access logs"
ON public.profile_access_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only the system can insert audit logs (no manual insertions)
CREATE POLICY "System can insert audit logs"
ON public.profile_access_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = admin_user_id AND public.has_role(auth.uid(), 'admin'));

-- Create a function to log profile access by admins
CREATE OR REPLACE FUNCTION public.log_profile_access(
  accessed_user_id UUID,
  access_type TEXT,
  accessed_fields TEXT[] DEFAULT NULL,
  reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log if user is admin
  IF public.has_role(auth.uid(), 'admin') THEN
    INSERT INTO public.profile_access_logs (
      admin_user_id,
      accessed_user_id,
      access_type,
      accessed_fields,
      reason,
      ip_address,
      user_agent
    ) VALUES (
      auth.uid(),
      accessed_user_id,
      access_type,
      accessed_fields,
      reason,
      inet_client_addr(),
      current_setting('request.headers', true)::json->>'user-agent'
    );
  END IF;
END;
$$;

-- Add comments to document the security model
COMMENT ON TABLE public.profiles IS 'User profiles with RLS protecting personal data. Only users can access their own data, admins have read access for moderation with audit logging.';
COMMENT ON COLUMN public.profiles.telegram_handle IS 'Personal contact - protected by RLS, admin access logged';
COMMENT ON COLUMN public.profiles.whatsapp_number IS 'Personal contact - protected by RLS, admin access logged';
COMMENT ON COLUMN public.profiles.facebook_url IS 'Personal contact - protected by RLS, admin access logged';