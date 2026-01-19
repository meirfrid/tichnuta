-- Add course_type column to courses table
ALTER TABLE public.courses 
ADD COLUMN course_type text NOT NULL DEFAULT 'frontal';

-- Add comment for the column
COMMENT ON COLUMN public.courses.course_type IS 'Type of course delivery: online, frontal, or both';