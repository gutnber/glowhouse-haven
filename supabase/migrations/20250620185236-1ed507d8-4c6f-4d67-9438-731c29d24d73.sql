
-- Add ai_settings column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN ai_settings JSONB DEFAULT NULL;
