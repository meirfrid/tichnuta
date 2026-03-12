
CREATE TABLE public.variant_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL REFERENCES public.course_variants(id) ON DELETE CASCADE,
  student_email text NOT NULL,
  lesson_date date NOT NULL,
  attended boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(variant_id, student_email, lesson_date)
);

ALTER TABLE public.variant_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage attendance"
  ON public.variant_attendance FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage attendance"
  ON public.variant_attendance FOR ALL
  USING (auth.role() = 'service_role'::text);
