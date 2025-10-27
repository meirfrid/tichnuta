-- Add locations and times arrays to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS locations text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS times text[] DEFAULT '{}';

-- Add location, grade and time fields to registrations table
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS time text;

-- Update existing registrations to have empty values if needed
UPDATE public.registrations SET location = '' WHERE location IS NULL;
UPDATE public.registrations SET time = '' WHERE time IS NULL;