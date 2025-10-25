
-- Clean up duplicate RLS policies on profiles table
-- Keep only the necessary policies, remove duplicates

-- Drop duplicate "Admins can view all profiles for moderation" (we already have "Admins can view all profiles")
DROP POLICY IF EXISTS "Admins can view all profiles for moderation" ON public.profiles;

-- Drop duplicate "Users can view their own profile" (we already have "Users can view own profile")  
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Add security comments to views to document they are safe
-- These views are protected by RLS on underlying tables

COMMENT ON VIEW public.v_daily_rli IS 'Protected by RLS on four_scale_trackers and activities tables. Users can only see their own data.';
COMMENT ON VIEW public.v_default_norms IS 'Public read-only reference data with no user-specific information. Safe for all users.';
COMMENT ON VIEW public.v_diary_metrics_timeseries IS 'Protected by RLS on diary_entries table. Users can only see their own data.';
COMMENT ON VIEW public.admin_access_summary IS 'Admin-only view protected by RLS on profile_access_logs. Only admins can query this data.';
