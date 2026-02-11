-- Migration: Add username field to profile table
-- This field is used for the Hero section display name (e.g., "Lesquel")
-- Separate from full_name which is the complete legal name

ALTER TABLE public.profile 
ADD COLUMN IF NOT EXISTS username text default '';

-- Also add email field for contact purposes
ALTER TABLE public.profile 
ADD COLUMN IF NOT EXISTS email text default '';

-- Comment for documentation
COMMENT ON COLUMN public.profile.username IS 'Short display name for Hero section (e.g., Lesquel)';
COMMENT ON COLUMN public.profile.email IS 'Contact email address shown in footer and contact page';
