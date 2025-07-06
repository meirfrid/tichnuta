-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Code2',
  color TEXT NOT NULL DEFAULT 'bg-gradient-to-br from-blue-500 to-blue-600',
  features TEXT[] NOT NULL DEFAULT '{}',
  duration TEXT NOT NULL,
  group_size TEXT NOT NULL,
  level TEXT NOT NULL,
  price_text TEXT NOT NULL,
  price_number INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default courses data
INSERT INTO public.courses (title, subtitle, description, icon, color, features, duration, group_size, level, price_text, price_number, sort_order) VALUES
('פיתוח משחקים בקוד', 'כיתות א''-ב''', 'היכרות ראשונית עם עולם התכנות דרך יצירת משחקים פשוטים וכיפיים', 'Code2', 'bg-gradient-to-br from-blue-500 to-blue-600', 
 ARRAY['יסודות תכנות בסביבה ידידותית', 'יצירת משחקים אינטראקטיביים', 'פיתוח חשיבה לוגית', 'עבודה עם אנימציות פשוטות'], 
 'שעה וחצי שבועית', 'עד 8 ילדים', 'מתחילים', '₪280 לחודש', 280, 1),

('פיתוח משחקים בסקראץ', 'כיתות ג''-ד''', 'למידת תכנות באמצעות סקראץ - פלטפורמה חזותית ומהנה ליצירת משחקים', 'Gamepad2', 'bg-gradient-to-br from-orange-500 to-red-500',
 ARRAY['תכנות חזותי עם בלוקים', 'יצירת משחקים מתקדמים יותר', 'עבודה עם דמויות ורקעים', 'הבנת מושגי תכנות בסיסיים'],
 'שעה וחצי שבועית', 'עד 8 ילדים', 'בסיסי', '₪300 לחודש', 300, 2),

('פיתוח אפליקציות', 'כיתות ה''-ו''', 'בניית אפליקציות אמיתיות לטלפון החכם באמצעות App Inventor', 'Smartphone', 'bg-gradient-to-br from-green-500 to-emerald-600',
 ARRAY['פיתוח אפליקציות לאנדרואיד', 'עיצוב ממשק משתמש', 'עבודה עם חיישנים', 'פרסום אפליקציות'],
 'שעתיים שבועית', 'עד 6 ילדים', 'בינוני', '₪350 לחודש', 350, 3),

('פיתוח משחקים בפייתון', 'כיתות ז''-ח''', 'למידת שפת תכנות מקצועית ופיתוח משחקים מתקדמים', 'Bot', 'bg-gradient-to-br from-purple-500 to-indigo-600',
 ARRAY['שפת פייתון מקצועית', 'פיתוח משחקים מתקדמים', 'אלגוריתמים ומבני נתונים', 'הכנה לעתיד טכנולוגי'],
 'שעתיים שבועית', 'עד 6 ילדים', 'מתקדם', '₪400 לחודש', 400, 4);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can select courses" 
ON public.courses 
FOR SELECT 
USING (active = true);

CREATE POLICY "Service role can manage courses" 
ON public.courses 
FOR ALL 
USING (true);

-- Add indexes
CREATE INDEX idx_courses_active ON public.courses(active);
CREATE INDEX idx_courses_sort_order ON public.courses(sort_order);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();