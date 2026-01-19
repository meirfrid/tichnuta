-- Create course_variants table for bundled course options
CREATE TABLE public.course_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- שם תצוגה למקבץ, למשל "אונליין בנות יום ראשון 17:00"
  gender TEXT NOT NULL, -- "בן" | "בת" | "מעורב"
  location TEXT NOT NULL, -- מיקום הלימוד
  day_of_week TEXT NOT NULL, -- יום בשבוע
  start_time TEXT NOT NULL, -- שעת התחלה
  end_time TEXT, -- שעת סיום (אופציונלי)
  min_grade TEXT, -- כיתה מינימלית (א-ח)
  max_grade TEXT, -- כיתה מקסימלית (א-ח)
  learning_period TEXT, -- תקופת לימוד מקושרת
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_variants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active variants for active courses" 
ON public.course_variants 
FOR SELECT 
USING (is_active = true AND EXISTS (
  SELECT 1 FROM courses WHERE courses.id = course_variants.course_id AND courses.active = true
));

CREATE POLICY "Admins can manage variants" 
ON public.course_variants 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage variants" 
ON public.course_variants 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Create index for faster queries
CREATE INDEX idx_course_variants_course_id ON public.course_variants(course_id);
CREATE INDEX idx_course_variants_gender ON public.course_variants(gender);
CREATE INDEX idx_course_variants_location ON public.course_variants(location);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_course_variants_updated_at
BEFORE UPDATE ON public.course_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add variant_id to registrations to track which variant was selected
ALTER TABLE public.registrations ADD COLUMN variant_id UUID REFERENCES public.course_variants(id);