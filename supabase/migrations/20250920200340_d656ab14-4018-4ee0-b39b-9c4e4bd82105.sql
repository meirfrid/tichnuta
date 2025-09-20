-- Add UPDATE policy for registrations table
-- This allows service role (admin) to update registration status

CREATE POLICY "Service role can update registrations" 
ON public.registrations 
FOR UPDATE 
USING (true);