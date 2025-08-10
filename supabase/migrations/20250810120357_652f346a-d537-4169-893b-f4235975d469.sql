-- Add social account fields to profiles for Security tab
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telegram_handle text,
  ADD COLUMN IF NOT EXISTS whatsapp_number text,
  ADD COLUMN IF NOT EXISTS facebook_url text;

-- No change to RLS needed; existing policies restrict access to own row
-- Add updated_at trigger is already present via update_updated_at_column function and potential triggers; if not, we keep as-is.