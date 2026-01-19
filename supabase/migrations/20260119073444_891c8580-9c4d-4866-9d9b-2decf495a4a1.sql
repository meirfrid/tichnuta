-- Create course_periods table for learning periods per course
CREATE TABLE public.course_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_course_periods_course_id ON public.course_periods(course_id);
CREATE INDEX idx_course_periods_active ON public.course_periods(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.course_periods ENABLE ROW LEVEL SECURITY;

-- Policies for course_periods
CREATE POLICY "Anyone can view active periods for active courses"
ON public.course_periods
FOR SELECT
USING (
  is_active = true AND
  EXISTS (
    SELECT 1 FROM courses
    WHERE courses.id = course_periods.course_id
    AND courses.active = true
  )
);

CREATE POLICY "Admins can manage periods"
ON public.course_periods
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage periods"
ON public.course_periods
FOR ALL
USING (auth.role() = 'service_role'::text);

-- Add learning_period column to registrations table
ALTER TABLE public.registrations
ADD COLUMN learning_period TEXT;

-- Create trigger for updated_at
CREATE TRIGGER update_course_periods_updated_at
BEFORE UPDATE ON public.course_periods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();