-- Create course_schedules table to link courses with locations and times
CREATE TABLE public.course_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_schedules ENABLE ROW LEVEL SECURITY;

-- Anyone can view schedules for active courses
CREATE POLICY "Anyone can view schedules for active courses"
ON public.course_schedules
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.courses
  WHERE courses.id = course_schedules.course_id
  AND courses.active = true
));

-- Service role can manage schedules
CREATE POLICY "Service role can manage schedules"
ON public.course_schedules
FOR ALL
USING (auth.role() = 'service_role');

-- Admins can manage schedules
CREATE POLICY "Admins can manage schedules"
ON public.course_schedules
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_course_schedules_updated_at
BEFORE UPDATE ON public.course_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_course_schedules_course_id ON public.course_schedules(course_id);
CREATE INDEX idx_course_schedules_location ON public.course_schedules(location);