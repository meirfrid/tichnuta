-- Enable Row Level Security on registrations table
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new registrations (contact form submissions)
CREATE POLICY "Anyone can submit registration form"
ON public.registrations
FOR INSERT
WITH CHECK (true);

-- Only authenticated service role can view registrations (admin access only)
CREATE POLICY "Only admins can view registrations"
ON public.registrations
FOR SELECT
USING (auth.role() = 'service_role');

-- Only service role can update registrations
CREATE POLICY "Only admins can update registrations"
ON public.registrations
FOR UPDATE
USING (auth.role() = 'service_role');

-- Only service role can delete registrations
CREATE POLICY "Only admins can delete registrations"
ON public.registrations
FOR DELETE
USING (auth.role() = 'service_role');