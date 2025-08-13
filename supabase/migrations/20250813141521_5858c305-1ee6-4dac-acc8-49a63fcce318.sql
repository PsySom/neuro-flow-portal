-- Fix RLS policies for users table to protect user credentials and personal data
-- Enable RLS on users table (should already be enabled based on schema)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table to protect user data
-- Users can only view their own data
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id::text);

-- Users can only update their own data
CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Users can create their own account (for registration)
CREATE POLICY "Users can create their own account" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid()::text = id::text);

-- Users can delete their own account
CREATE POLICY "Users can delete their own account" 
ON public.users 
FOR DELETE 
USING (auth.uid()::text = id::text);

-- Admins can view all users (using the existing has_role function)
CREATE POLICY "Admins can view all users" 
ON public.users 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage all users
CREATE POLICY "Admins can manage users" 
ON public.users 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));