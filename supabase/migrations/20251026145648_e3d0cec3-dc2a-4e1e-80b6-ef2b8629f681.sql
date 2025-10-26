-- Create schools table for managing multiple Talmud Torah institutions
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT 'bg-gradient-to-br from-blue-500 to-blue-600',
  icon TEXT NOT NULL DEFAULT 'GraduationCap',
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schools
CREATE POLICY "Anyone can view active schools"
ON public.schools
FOR SELECT
USING (active = true);

CREATE POLICY "Service role can manage schools"
ON public.schools
FOR ALL
USING (true);

-- Add school_id to courses table
ALTER TABLE public.courses
ADD COLUMN school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX idx_courses_school_id ON public.courses(school_id);

-- Add school_name and grade to registrations table
ALTER TABLE public.registrations
ADD COLUMN school_name TEXT,
ADD COLUMN grade TEXT;

-- Create trigger for updating updated_at on schools
CREATE TRIGGER update_schools_updated_at
BEFORE UPDATE ON public.schools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default school (Talmud Torah Shearit Yisrael)
INSERT INTO public.schools (name, description, color, icon, sort_order)
VALUES (
  'תלמוד תורה שארית ישראל',
  'חוגי העשרה לתלמידי תלמוד תורה שארית ישראל',
  'bg-gradient-to-br from-blue-500 to-blue-600',
  'GraduationCap',
  0
);

-- Update existing courses to belong to the default school
UPDATE public.courses
SET school_id = (SELECT id FROM public.schools WHERE name = 'תלמוד תורה שארית ישראל')
WHERE school_id IS NULL;