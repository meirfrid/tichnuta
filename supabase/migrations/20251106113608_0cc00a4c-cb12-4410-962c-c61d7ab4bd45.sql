-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL DEFAULT 0,
  video_url text,
  slides_url text,
  is_preview boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index on course_id and order_index
CREATE INDEX IF NOT EXISTS idx_lessons_course_order ON public.lessons(course_id, order_index);

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lessons
CREATE POLICY "Anyone can view published course lessons"
ON public.lessons FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = lessons.course_id
    AND courses.active = true
  )
);

CREATE POLICY "Service role can manage lessons"
ON public.lessons FOR ALL
USING (auth.role() = 'service_role');

-- Create course_allowed_emails table
CREATE TABLE IF NOT EXISTS public.course_allowed_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(course_id, email)
);

-- Create index on course_id and email
CREATE INDEX IF NOT EXISTS idx_course_allowed_emails_course ON public.course_allowed_emails(course_id);
CREATE INDEX IF NOT EXISTS idx_course_allowed_emails_email ON public.course_allowed_emails(email);

-- Enable RLS
ALTER TABLE public.course_allowed_emails ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_allowed_emails
CREATE POLICY "Admins can manage allowed emails"
ON public.course_allowed_emails FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage allowed emails"
ON public.course_allowed_emails FOR ALL
USING (auth.role() = 'service_role');

-- Add slug to courses if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'slug') THEN
    ALTER TABLE public.courses ADD COLUMN slug text UNIQUE;
  END IF;
END $$;

-- Create index on slug
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);

-- Add triggers for updated_at
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if user has access to course
CREATE OR REPLACE FUNCTION public.user_has_course_access(_user_id uuid, _course_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.course_allowed_emails cae
    WHERE cae.course_id = _course_id
    AND cae.email = (SELECT email FROM auth.users WHERE id = _user_id)
  )
$$;