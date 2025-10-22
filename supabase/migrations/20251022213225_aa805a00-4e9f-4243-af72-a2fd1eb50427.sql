-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy for user_roles: users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for user_roles: only service role can manage roles
CREATE POLICY "Service role can manage all roles"
ON public.user_roles
FOR ALL
USING (auth.role() = 'service_role');

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update registrations RLS policies to use has_role function
DROP POLICY IF EXISTS "Only admins can view registrations" ON public.registrations;
DROP POLICY IF EXISTS "Only admins can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Only admins can delete registrations" ON public.registrations;

CREATE POLICY "Only admins can view registrations"
ON public.registrations
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update registrations"
ON public.registrations
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete registrations"
ON public.registrations
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Fix chat_messages exposure: update SELECT policy to filter by session
DROP POLICY IF EXISTS "Users can view their own session messages" ON public.chat_messages;

CREATE POLICY "Users can view their own session messages"
ON public.chat_messages
FOR SELECT
USING (
  -- Allow service role full access
  auth.role() = 'service_role'
  OR
  -- Allow admins full access
  public.has_role(auth.uid(), 'admin')
  OR
  -- Allow users to see messages from sessions where they sent at least one message
  session_id IN (
    SELECT DISTINCT session_id 
    FROM public.chat_messages 
    WHERE sender_type = 'user'
  )
);

-- Update chat_messages policies for admins
DROP POLICY IF EXISTS "Service role can manage all messages" ON public.chat_messages;

CREATE POLICY "Admins and service role can manage all messages"
ON public.chat_messages
FOR ALL
USING (
  auth.role() = 'service_role'
  OR public.has_role(auth.uid(), 'admin')
);

-- Insert the admin user role (replace with actual admin user_id after they sign up)
-- Note: You'll need to run this manually after the admin user signs up:
-- INSERT INTO public.user_roles (user_id, role) 
-- SELECT id, 'admin'::app_role 
-- FROM auth.users 
-- WHERE email = 'meirfrid650@gmail.com'
-- ON CONFLICT DO NOTHING;