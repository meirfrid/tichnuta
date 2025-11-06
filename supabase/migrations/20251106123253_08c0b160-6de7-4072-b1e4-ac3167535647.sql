-- Allow admins to manage lessons (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage lessons"
ON public.lessons
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::app_role));