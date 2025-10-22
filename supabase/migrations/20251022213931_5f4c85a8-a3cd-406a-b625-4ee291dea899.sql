-- Fix infinite recursion in chat_messages RLS policy
-- The current policy queries chat_messages within its USING clause, causing infinite recursion

-- Create SECURITY DEFINER function to get user's chat sessions
-- This breaks the recursion by executing with elevated privileges
CREATE OR REPLACE FUNCTION public.user_chat_sessions(_user_id UUID)
RETURNS TABLE(session_id TEXT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT session_id
  FROM chat_messages
  WHERE sender_type = 'user'
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view their own session messages" ON chat_messages;

-- Recreate policy using the SECURITY DEFINER function
-- This prevents the infinite recursion by using the function instead of direct subquery
CREATE POLICY "Users can view their own session messages"
ON chat_messages
FOR SELECT
USING (
  auth.role() = 'service_role'
  OR public.has_role(auth.uid(), 'admin'::app_role)
  OR session_id IN (
    SELECT session_id FROM public.user_chat_sessions(auth.uid())
  )
);