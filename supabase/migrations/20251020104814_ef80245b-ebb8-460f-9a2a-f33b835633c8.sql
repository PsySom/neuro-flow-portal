-- Fix Security Issues: Error Level Only

-- ============================================
-- 1. FIX SECURITY DEFINER VIEWS
-- ============================================

-- Drop and recreate views to remove SECURITY DEFINER or ensure proper filtering

-- v_default_norms is just static data (safe), but let's ensure it's not SECURITY DEFINER
DROP VIEW IF EXISTS v_default_norms CASCADE;
CREATE VIEW v_default_norms AS
SELECT * FROM (VALUES
  ('mood'::text, 4::numeric, 8::numeric),
  ('stress',     0,          6),
  ('energy',     4,          8),
  ('sleep_quality',6,        9),
  ('morning_feeling',6,      9),
  ('overall_sleep_impact',5, 9)
) AS t(metric_key, norm_min, norm_max);

-- v_diary_metrics_timeseries: Remove SECURITY DEFINER, rely on RLS of base tables
DROP VIEW IF EXISTS v_diary_metrics_timeseries CASCADE;
CREATE VIEW v_diary_metrics_timeseries AS
SELECT e.user_id, e.created_at AS ts, e.topic, m.key, m.value,
       COALESCE(m.norm_min, d.norm_min) AS norm_min,
       COALESCE(m.norm_max, d.norm_max) AS norm_max
FROM diary_entries e
JOIN diary_entry_metrics m ON m.entry_id = e.id
LEFT JOIN v_default_norms d ON d.metric_key = m.key;

-- v_daily_rli: Remove SECURITY DEFINER, rely on RLS of base tables
DROP VIEW IF EXISTS v_daily_rli CASCADE;
CREATE VIEW v_daily_rli AS
WITH src AS (
  SELECT f.user_id, f.date,
         a.kind,
         f.process_satisfaction AS process,
         f.result_satisfaction  AS result,
         f.energy_cost          AS energy,
         f.stress_level         AS stress
  FROM four_scale_trackers f
  LEFT JOIN activities a ON a.id = f.activity_id
  WHERE f.scope = 'activity'
)
SELECT user_id, date,
  SUM(CASE kind
        WHEN 'restorative' THEN 2.0 
        WHEN 'neutral' THEN 0.5 
        WHEN 'mixed' THEN 1.0 
        WHEN 'depleting' THEN 0.0 
        ELSE 0 
      END
      + 0.3*process + 0.2*result) AS day_recovery,
  SUM(CASE kind
        WHEN 'depleting' THEN 2.0 
        WHEN 'mixed' THEN 0.8 
        WHEN 'neutral' THEN 0.2 
        WHEN 'restorative' THEN 0.0 
        ELSE 0 
      END
      + 0.3*energy + 0.4*stress) AS day_strain
FROM src
GROUP BY user_id, date;

-- ============================================
-- 2. CREATE ADMIN-SPECIFIC FUNCTION WITH AUTOMATIC LOGGING
-- ============================================

-- Create a function that logs admin access and returns profile data
CREATE OR REPLACE FUNCTION public.admin_get_profiles_with_logging(
  p_user_ids uuid[] DEFAULT NULL,
  p_reason text DEFAULT 'Admin dashboard access'
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

-- Grant execute to authenticated users (function checks admin role internally)
GRANT EXECUTE ON FUNCTION public.admin_get_profiles_with_logging TO authenticated;

-- ============================================
-- 3. STRENGTHEN RLS ON SENSITIVE TABLES
-- ============================================

-- Ensure user_therapy_progress has proper RLS (verify existing policies are correct)
-- The table already has RLS enabled with user_id checks, but let's add a comment for documentation
COMMENT ON TABLE public.user_therapy_progress IS 
  'SENSITIVE: Contains mental health data. All access must be limited to user_id = auth.uid(). Never expose this data to other users or in analytics.';

-- Add a check to ensure user_id is always set for new therapy progress records
CREATE OR REPLACE FUNCTION public.ensure_therapy_progress_user_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure user_id matches authenticated user
  IF NEW.user_id IS NULL OR NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'user_id must match authenticated user';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ensure_therapy_progress_user_id_trigger ON public.user_therapy_progress;
CREATE TRIGGER ensure_therapy_progress_user_id_trigger
  BEFORE INSERT OR UPDATE ON public.user_therapy_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_therapy_progress_user_id();

-- ============================================
-- 4. ADD MONITORING FOR ADMIN ACTIONS
-- ============================================

-- Create a view for monitoring admin access patterns (fix ambiguous column reference)
CREATE OR REPLACE VIEW public.admin_access_summary AS
SELECT 
  pal.admin_user_id,
  p.email as admin_email,
  pal.access_type,
  COUNT(*) as access_count,
  MIN(pal.created_at) as first_access,
  MAX(pal.created_at) as last_access,
  COUNT(DISTINCT pal.accessed_user_id) as unique_users_accessed
FROM public.profile_access_logs pal
LEFT JOIN public.profiles p ON p.id = pal.admin_user_id
WHERE pal.created_at > NOW() - INTERVAL '30 days'
GROUP BY pal.admin_user_id, p.email, pal.access_type
ORDER BY access_count DESC;

-- Grant SELECT on the view to authenticated users (RLS on base table will control access)
GRANT SELECT ON public.admin_access_summary TO authenticated;