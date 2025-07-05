-- Add desarrollo field to properties table
ALTER TABLE public.properties 
ADD COLUMN is_desarrollo boolean NOT NULL DEFAULT false;

-- Create index for better performance when filtering desarrollo properties
CREATE INDEX idx_properties_desarrollo ON public.properties(is_desarrollo) WHERE is_desarrollo = true;