-- Fix overly permissive RLS policies on registrations table
-- The policies with USING (true) allow ANYONE to view/update all registrations

-- Drop the problematic policies that use USING (true)
DROP POLICY IF EXISTS "Service role can view all registrations" ON public.registrations;
DROP POLICY IF EXISTS "Service role can update registrations" ON public.registrations;

-- Also drop the duplicate insert policy
DROP POLICY IF EXISTS "Anyone can submit registration form" ON public.registrations;

-- Create proper service role policies that actually check for service_role
CREATE POLICY "Service role can view all registrations" 
ON public.registrations 
FOR SELECT 
USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update registrations" 
ON public.registrations 
FOR UPDATE 
USING (auth.role() = 'service_role');