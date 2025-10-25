-- Fix 1: Remove hardcoded admin email from trigger function
-- Only assign default 'user' role on signup
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

  -- NOTE: Admin roles must be assigned manually through:
  -- 1. Supabase Dashboard SQL Editor
  -- 2. Secure admin invitation system (to be implemented)
  -- 3. Multi-factor verification for admin accounts (recommended)
  
  RETURN NEW;
END;
$$;

-- Fix 2: Add server-side input validation constraints
-- Telegram handle validation
ALTER TABLE public.profiles ADD CONSTRAINT telegram_handle_format 
  CHECK (telegram_handle IS NULL OR (
    telegram_handle ~ '^@[a-zA-Z0-9_]{5,32}$' AND 
    length(telegram_handle) <= 33
  ));

-- WhatsApp number validation (international format)
ALTER TABLE public.profiles ADD CONSTRAINT whatsapp_number_format
  CHECK (whatsapp_number IS NULL OR (
    whatsapp_number ~ '^\+[1-9][0-9]{1,14}$' AND
    length(whatsapp_number) <= 20
  ));

-- Facebook URL validation
ALTER TABLE public.profiles ADD CONSTRAINT facebook_url_format
  CHECK (facebook_url IS NULL OR (
    facebook_url ~ '^https?://(www\.)?(facebook\.com|fb\.me)/' AND
    length(facebook_url) <= 500
  ));

-- Add length constraints to prevent excessive data storage
ALTER TABLE public.ai_diary_messages ADD CONSTRAINT content_length
  CHECK (length(content) <= 10000);

ALTER TABLE public.diary_entries ADD CONSTRAINT context_length
  CHECK (context IS NULL OR length(context) <= 5000);

ALTER TABLE public.diary_notes ADD CONSTRAINT text_length
  CHECK (length(text) <= 10000);

COMMENT ON CONSTRAINT telegram_handle_format ON public.profiles IS 
  'Validates telegram handle format: @username with 5-32 alphanumeric characters or underscores';

COMMENT ON CONSTRAINT whatsapp_number_format ON public.profiles IS 
  'Validates WhatsApp number in international format: +[country][number]';

COMMENT ON CONSTRAINT facebook_url_format ON public.profiles IS 
  'Validates Facebook profile URL format';