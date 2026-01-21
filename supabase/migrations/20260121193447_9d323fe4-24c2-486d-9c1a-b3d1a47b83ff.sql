-- Fix the user_chat_sessions function to properly track user sessions
-- The current implementation returns ALL user sessions which is a security flaw

-- First, create a table to properly track which session_ids belong to which users
CREATE TABLE IF NOT EXISTS public.chat_session_users (
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (session_id)
);

-- Enable RLS on the session tracking table
ALTER TABLE public.chat_session_users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own session mappings
CREATE POLICY "Users can view their own session mappings"
ON public.chat_session_users
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own session mappings
CREATE POLICY "Users can insert their own session mappings"
ON public.chat_session_users
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Service role and admins can manage all mappings
CREATE POLICY "Service role can manage session mappings"
ON public.chat_session_users
FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage session mappings"
ON public.chat_session_users
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Replace the broken user_chat_sessions function with a secure version
CREATE OR REPLACE FUNCTION public.user_chat_sessions(_user_id UUID)
RETURNS TABLE(session_id TEXT)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT csu.session_id
  FROM public.chat_session_users csu
  WHERE csu.user_id = _user_id
$$;

-- Drop and recreate the chat_messages SELECT policy to fix the security issue
-- The policy should properly scope access to user's own sessions
DROP POLICY IF EXISTS "Users can view their own session messages" ON public.chat_messages;

CREATE POLICY "Users can view their own session messages"
ON public.chat_messages
FOR SELECT
USING (
  auth.role() = 'service_role'
  OR has_role(auth.uid(), 'admin'::app_role)
  OR (
    auth.uid() IS NOT NULL 
    AND session_id IN (
      SELECT user_chat_sessions.session_id 
      FROM user_chat_sessions(auth.uid())
    )
  )
);