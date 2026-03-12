
-- Add variant_id to lessons table (nullable for backward compat)
ALTER TABLE public.lessons ADD COLUMN variant_id uuid REFERENCES public.course_variants(id) ON DELETE SET NULL;

-- Create variant_allowed_emails table
CREATE TABLE public.variant_allowed_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL REFERENCES public.course_variants(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(variant_id, email)
);

-- Enable RLS
ALTER TABLE public.variant_allowed_emails ENABLE ROW LEVEL SECURITY;

-- RLS policies for variant_allowed_emails
CREATE POLICY "Admins can manage variant emails"
  ON public.variant_allowed_emails FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage variant emails"
  ON public.variant_allowed_emails FOR ALL
  USING (auth.role() = 'service_role'::text);

CREATE POLICY "Users can view their own variant emails"
  ON public.variant_allowed_emails FOR SELECT TO authenticated
  USING (email = (auth.jwt() ->> 'email'::text));

-- Function to check if user has access to a variant
CREATE OR REPLACE FUNCTION public.user_has_variant_access(_user_id uuid, _variant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.variant_allowed_emails vae
    WHERE vae.variant_id = _variant_id
    AND vae.email = (SELECT email FROM auth.users WHERE id = _user_id)
  )
$$;
