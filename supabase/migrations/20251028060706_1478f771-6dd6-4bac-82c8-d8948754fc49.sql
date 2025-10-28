-- Add locations and times to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS locations text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS times text[] DEFAULT '{}';

-- Add location, grade, and time to registrations table
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS grade text,
ADD COLUMN IF NOT EXISTS time text;

-- Set default empty values for existing registrations
UPDATE public.registrations 
SET location = '', grade = '', time = ''
WHERE location IS NULL OR grade IS NULL OR time IS NULL;