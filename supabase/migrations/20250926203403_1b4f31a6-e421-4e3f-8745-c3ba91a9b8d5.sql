-- Add geolocation fields to practicum_records table for clock in/out locations
ALTER TABLE public.practicum_records 
ADD COLUMN clock_in_latitude DECIMAL(10, 8),
ADD COLUMN clock_in_longitude DECIMAL(11, 8),
ADD COLUMN clock_in_address TEXT,
ADD COLUMN clock_out_latitude DECIMAL(10, 8),
ADD COLUMN clock_out_longitude DECIMAL(11, 8),
ADD COLUMN clock_out_address TEXT;