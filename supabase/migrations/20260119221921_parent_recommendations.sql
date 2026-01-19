-- Create parent_recommendations table
CREATE TABLE IF NOT EXISTS public.parent_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_name TEXT NOT NULL,
    child_name TEXT,
    recommendation_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for approved recommendations
CREATE INDEX IF NOT EXISTS idx_parent_recommendations_approved ON public.parent_recommendations(is_approved, sort_order);

-- Enable RLS
ALTER TABLE public.parent_recommendations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved recommendations
CREATE POLICY "Anyone can view approved recommendations"
ON public.parent_recommendations
FOR SELECT
USING (is_approved = true);

-- Policy: Only admins can insert recommendations
CREATE POLICY "Admins can insert recommendations"
ON public.parent_recommendations
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can update recommendations
CREATE POLICY "Admins can update recommendations"
ON public.parent_recommendations
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Only admins can delete recommendations
CREATE POLICY "Admins can delete recommendations"
ON public.parent_recommendations
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Service role can manage all recommendations
CREATE POLICY "Service role can manage all recommendations"
ON public.parent_recommendations
FOR ALL
USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_parent_recommendations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_parent_recommendations_updated_at
    BEFORE UPDATE ON public.parent_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_parent_recommendations_updated_at();
