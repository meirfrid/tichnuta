-- Drop the vulnerable SELECT policy that used USING(true) if it still exists with wrong definition
DROP POLICY IF EXISTS "Users can view their own session messages" ON public.chat_messages;

-- Recreate the SELECT policy with proper restrictions
CREATE POLICY "Users can view their own session messages"
ON public.chat_messages
FOR SELECT
USING (
  auth.role() = 'service_role'
  OR has_role(auth.uid(), 'admin'::app_role)
  OR session_id IN (
    SELECT user_chat_sessions.session_id 
    FROM user_chat_sessions(auth.uid())
  )
);