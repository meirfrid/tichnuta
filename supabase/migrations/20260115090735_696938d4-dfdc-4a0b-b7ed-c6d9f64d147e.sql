-- Create profiles table if not exists (for user display info)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create course_enrollments table (for access control)
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Enable RLS on course_enrollments
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Course enrollments policies
CREATE POLICY "Users can view their own enrollments"
ON public.course_enrollments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage enrollments"
ON public.course_enrollments
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage enrollments"
ON public.course_enrollments
FOR ALL
USING (auth.role() = 'service_role');

-- Create forum threads table
CREATE TABLE public.lesson_forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for threads
CREATE INDEX idx_lesson_forum_threads_lesson_id ON public.lesson_forum_threads(lesson_id);
CREATE INDEX idx_lesson_forum_threads_author_id ON public.lesson_forum_threads(author_id);

-- Enable RLS on threads
ALTER TABLE public.lesson_forum_threads ENABLE ROW LEVEL SECURITY;

-- Create trigger for threads updated_at
CREATE TRIGGER update_lesson_forum_threads_updated_at
BEFORE UPDATE ON public.lesson_forum_threads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create forum replies table
CREATE TABLE public.lesson_forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.lesson_forum_threads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for replies
CREATE INDEX idx_lesson_forum_replies_thread_id ON public.lesson_forum_replies(thread_id);
CREATE INDEX idx_lesson_forum_replies_author_id ON public.lesson_forum_replies(author_id);

-- Enable RLS on replies
ALTER TABLE public.lesson_forum_replies ENABLE ROW LEVEL SECURITY;

-- Create trigger for replies updated_at
CREATE TRIGGER update_lesson_forum_replies_updated_at
BEFORE UPDATE ON public.lesson_forum_replies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helper function to check if user is enrolled in the course for a lesson
CREATE OR REPLACE FUNCTION public.user_enrolled_in_lesson_course(_user_id UUID, _lesson_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.lessons l
    JOIN public.course_enrollments ce ON ce.course_id = l.course_id
    WHERE l.id = _lesson_id
    AND ce.user_id = _user_id
  )
  OR EXISTS (
    SELECT 1
    FROM public.course_allowed_emails cae
    JOIN public.lessons l ON l.course_id = cae.course_id
    WHERE l.id = _lesson_id
    AND cae.email = (SELECT email FROM auth.users WHERE id = _user_id)
  )
$$;

-- RLS Policies for threads

-- Read: enrolled users, admins, or service role can read
CREATE POLICY "Enrolled users can view threads"
ON public.lesson_forum_threads
FOR SELECT
USING (
  public.user_enrolled_in_lesson_course(auth.uid(), lesson_id)
  OR has_role(auth.uid(), 'admin')
  OR auth.role() = 'service_role'
);

-- Insert: enrolled users can create threads
CREATE POLICY "Enrolled users can create threads"
ON public.lesson_forum_threads
FOR INSERT
WITH CHECK (
  auth.uid() = author_id
  AND public.user_enrolled_in_lesson_course(auth.uid(), lesson_id)
);

-- Update: only author can update their own threads
CREATE POLICY "Authors can update their own threads"
ON public.lesson_forum_threads
FOR UPDATE
USING (auth.uid() = author_id);

-- Delete: only author or admin can delete threads
CREATE POLICY "Authors and admins can delete threads"
ON public.lesson_forum_threads
FOR DELETE
USING (
  auth.uid() = author_id
  OR has_role(auth.uid(), 'admin')
);

-- Admin full access
CREATE POLICY "Admins can manage all threads"
ON public.lesson_forum_threads
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Service role full access
CREATE POLICY "Service role can manage threads"
ON public.lesson_forum_threads
FOR ALL
USING (auth.role() = 'service_role');

-- RLS Policies for replies

-- Helper function for reply access (check if user can access the thread's lesson)
CREATE OR REPLACE FUNCTION public.user_can_access_thread(_user_id UUID, _thread_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.lesson_forum_threads t
    WHERE t.id = _thread_id
    AND public.user_enrolled_in_lesson_course(_user_id, t.lesson_id)
  )
$$;

-- Read: enrolled users can read replies
CREATE POLICY "Enrolled users can view replies"
ON public.lesson_forum_replies
FOR SELECT
USING (
  public.user_can_access_thread(auth.uid(), thread_id)
  OR has_role(auth.uid(), 'admin')
  OR auth.role() = 'service_role'
);

-- Insert: enrolled users can create replies (if thread is not locked)
CREATE POLICY "Enrolled users can create replies"
ON public.lesson_forum_replies
FOR INSERT
WITH CHECK (
  auth.uid() = author_id
  AND public.user_can_access_thread(auth.uid(), thread_id)
  AND NOT EXISTS (
    SELECT 1 FROM public.lesson_forum_threads t
    WHERE t.id = thread_id AND t.is_locked = true
  )
);

-- Update: only author can update their own replies
CREATE POLICY "Authors can update their own replies"
ON public.lesson_forum_replies
FOR UPDATE
USING (auth.uid() = author_id);

-- Delete: only author or admin can delete replies
CREATE POLICY "Authors and admins can delete replies"
ON public.lesson_forum_replies
FOR DELETE
USING (
  auth.uid() = author_id
  OR has_role(auth.uid(), 'admin')
);

-- Admin full access
CREATE POLICY "Admins can manage all replies"
ON public.lesson_forum_replies
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Service role full access
CREATE POLICY "Service role can manage replies"
ON public.lesson_forum_replies
FOR ALL
USING (auth.role() = 'service_role');