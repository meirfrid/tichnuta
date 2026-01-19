-- Add parent_name column to registrations table
ALTER TABLE public.registrations 
ADD COLUMN parent_name TEXT;