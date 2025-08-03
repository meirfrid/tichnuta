
-- Create table for course content (lessons)
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  presentation_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  is_free BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user course purchases
CREATE TABLE public.user_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id TEXT,
  amount_paid INTEGER NOT NULL, -- in cents
  currency TEXT NOT NULL DEFAULT 'ILS',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, cancelled, refunded
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE, -- for time-limited access
  UNIQUE(user_id, course_id)
);

-- Create table for tracking lesson progress
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  watch_time_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Add RLS policies for course_lessons
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- Anyone can view lessons for active courses
CREATE POLICY "Anyone can view lessons for active courses"
ON public.course_lessons
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = course_lessons.course_id AND courses.active = true
  )
);

-- Service role can manage lessons
CREATE POLICY "Service role can manage lessons"
ON public.course_lessons
FOR ALL
USING (true);

-- Add RLS policies for user_purchases
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view their own purchases"
ON public.user_purchases
FOR SELECT
USING (auth.uid() = user_id);

-- Service role can manage purchases
CREATE POLICY "Service role can manage purchases"
ON public.user_purchases
FOR ALL
USING (true);

-- Add RLS policies for lesson_progress
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own progress
CREATE POLICY "Users can manage their own progress"
ON public.lesson_progress
FOR ALL
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_course_lessons_course_id ON public.course_lessons(course_id);
CREATE INDEX idx_course_lessons_order ON public.course_lessons(course_id, order_index);
CREATE INDEX idx_user_purchases_user_id ON public.user_purchases(user_id);
CREATE INDEX idx_user_purchases_course_id ON public.user_purchases(course_id);
CREATE INDEX idx_lesson_progress_user_lesson ON public.lesson_progress(user_id, lesson_id);

-- Add trigger to update updated_at columns
CREATE TRIGGER update_course_lessons_updated_at
  BEFORE UPDATE ON public.course_lessons
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
