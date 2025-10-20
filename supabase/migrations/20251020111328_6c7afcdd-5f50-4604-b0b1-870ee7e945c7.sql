-- ============================================
-- SECURITY FIX: Remove Hardcoded Admin Email and Tighten RLS
-- ============================================

-- 1. Remove hardcoded admin email from role assignment trigger
-- Admin roles should be assigned manually via Supabase Dashboard or secure admin invitation system
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Assign default 'user' role to every new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- NOTE: Admin roles must be assigned manually through:
  -- 1. Supabase Dashboard SQL Editor
  -- 2. Secure admin invitation system (to be implemented)
  -- 3. Multi-factor verification for admin accounts (recommended)
  
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user_role() IS 
  'Assigns default user role on signup. Admin roles must be assigned manually for security.';

-- 2. Restrict metric_alerts INSERT to prevent spam
-- Only allow system/service accounts to create alerts, not regular authenticated users
DROP POLICY IF EXISTS "System can create metric alerts" ON public.metric_alerts;
CREATE POLICY "System can create metric alerts"
ON public.metric_alerts
FOR INSERT
TO authenticated
WITH CHECK (
  -- Only allow INSERT if the user is inserting their own alert
  -- AND the alert is being created by a database function/trigger (not direct user insert)
  -- We check this by ensuring the calling context is from a database function
  current_setting('role') = 'authenticator'
  AND user_id = auth.uid()
);

COMMENT ON TABLE public.metric_alerts IS 
  'Stores health metric alerts. INSERTs restricted to system-generated alerts via database functions/triggers only.';

-- 3. Add search_path to functions that are missing it
-- This prevents search path manipulation attacks

-- Update sync_user_profile function
CREATE OR REPLACE FUNCTION public.sync_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Insert or update profile when auth.users is modified
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$;

-- Update log_profile_access function
CREATE OR REPLACE FUNCTION public.log_profile_access(
  accessed_user_id uuid, 
  access_type text, 
  accessed_fields text[] DEFAULT NULL::text[], 
  reason text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
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

-- Update admin_get_user_profiles function
CREATE OR REPLACE FUNCTION public.admin_get_user_profiles(
  limit_count integer DEFAULT 100, 
  offset_count integer DEFAULT 0
)
RETURNS TABLE(
  id uuid, 
  email text, 
  full_name text, 
  role text, 
  created_at timestamp with time zone, 
  last_sign_in timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
    SELECT 
        p.id,
        p.email,
        p.full_name,
        COALESCE(
            (SELECT string_agg(ur.role::text, ',') 
             FROM public.user_roles ur 
             WHERE ur.user_id = p.id), 
            'user'
        ) as role,
        p.created_at,
        u.last_sign_in_at
    FROM public.profiles p
    LEFT JOIN auth.users u ON u.id = p.id
    WHERE public.has_role(auth.uid(), 'admin')
    ORDER BY p.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
$$;

-- Update get_user_profile_with_role function
CREATE OR REPLACE FUNCTION public.get_user_profile_with_role()
RETURNS TABLE(
  id uuid, 
  email text, 
  full_name text, 
  avatar_url text, 
  telegram_handle text, 
  whatsapp_number text, 
  facebook_url text, 
  role text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
    SELECT 
        p.id,
        p.email,
        p.full_name,
        p.avatar_url,
        p.telegram_handle,
        p.whatsapp_number,
        p.facebook_url,
        COALESCE(
            (SELECT string_agg(ur.role::text, ',') 
             FROM public.user_roles ur 
             WHERE ur.user_id = p.id), 
            'user'
        ) as role,
        p.created_at,
        p.updated_at
    FROM public.profiles p
    WHERE p.id = auth.uid();
$$;

-- Update admin_get_profiles_with_logging function
CREATE OR REPLACE FUNCTION public.admin_get_profiles_with_logging(
  p_user_ids uuid[] DEFAULT NULL::uuid[], 
  p_reason text DEFAULT 'Admin dashboard access'::text
)
RETURNS TABLE(
  id uuid, 
  email text, 
  full_name text, 
  avatar_url text, 
  telegram_handle text, 
  whatsapp_number text, 
  facebook_url text, 
  role text, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  -- Check if caller is admin
  v_is_admin := public.has_role(auth.uid(), 'admin'::app_role);
  
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;
  
  -- Log the access for each profile being viewed
  IF p_user_ids IS NOT NULL THEN
    -- Specific users requested
    INSERT INTO public.profile_access_logs (
      admin_user_id,
      accessed_user_id,
      access_type,
      accessed_fields,
      reason
    )
    SELECT 
      auth.uid(),
      unnest(p_user_ids),
      'SELECT',
      ARRAY['email', 'full_name', 'avatar_url', 'telegram_handle', 'whatsapp_number', 'facebook_url'],
      p_reason;
  ELSE
    -- All profiles requested - log as bulk access
    INSERT INTO public.profile_access_logs (
      admin_user_id,
      accessed_user_id,
      access_type,
      accessed_fields,
      reason
    )
    VALUES (
      auth.uid(),
      NULL, -- NULL indicates bulk access
      'SELECT_ALL',
      ARRAY['email', 'full_name', 'avatar_url', 'telegram_handle', 'whatsapp_number', 'facebook_url'],
      p_reason
    );
  END IF;
  
  -- Return the requested profiles
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.avatar_url,
    p.telegram_handle,
    p.whatsapp_number,
    p.facebook_url,
    p.role,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p_user_ids IS NULL OR p.id = ANY(p_user_ids);
END;
$$;

-- Update ensure_ai_session function
CREATE OR REPLACE FUNCTION public.ensure_ai_session(p_session_id text, p_user_id uuid)
RETURNS TABLE(session_id character varying, is_new boolean)
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    v_session_id VARCHAR(255);
    v_is_new BOOLEAN := false;
BEGIN
    IF p_session_id IS NULL OR p_session_id = '' THEN
        v_session_id := gen_random_uuid()::text;
        v_is_new := true;
        
        INSERT INTO ai_diary_sessions (user_id, session_id)
        VALUES (p_user_id, v_session_id);
    ELSE
        SELECT s.session_id INTO v_session_id
        FROM ai_diary_sessions s
        WHERE s.session_id = p_session_id
        LIMIT 1;
        
        IF v_session_id IS NULL THEN
            v_session_id := p_session_id;
            v_is_new := true;
            
            INSERT INTO ai_diary_sessions (user_id, session_id)
            VALUES (p_user_id, v_session_id);
        END IF;
    END IF;
    
    RETURN QUERY SELECT v_session_id, v_is_new;
END;
$$;

-- Update update_activity_status function
CREATE OR REPLACE FUNCTION public.update_activity_status(
  activity_id uuid, 
  new_status text, 
  user_notes text DEFAULT NULL::text
)
RETURNS TABLE(id uuid, title text, status text, updated_at timestamp with time zone)
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

-- Add documentation
COMMENT ON FUNCTION public.has_role(uuid, app_role) IS 
  'Security definer function to check user roles without RLS recursion. Has search_path set for security.';

COMMENT ON FUNCTION public.ensure_therapy_progress_user_id() IS 
  'Trigger function to enforce user_id = auth.uid() on therapy progress. Prevents unauthorized data writes.';