-- Allow authenticated users to view allowed emails that match their own email
CREATE POLICY "Users can view their own allowed emails"
ON public.course_allowed_emails
FOR SELECT
TO authenticated
USING (email = auth.jwt()->>'email');