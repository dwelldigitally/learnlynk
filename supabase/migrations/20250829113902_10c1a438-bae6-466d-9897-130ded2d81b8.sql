-- Fix the base64url encoding issue in student_portals table
-- PostgreSQL doesn't support base64url, only base64
ALTER TABLE public.student_portals 
ALTER COLUMN access_token SET DEFAULT encode(gen_random_bytes(32), 'base64');