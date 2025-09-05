-- Check if programs table exists and add sample data if missing
DO $$
BEGIN
  -- Insert sample programs if they don't exist
  INSERT INTO public.programs (user_id, name, code, description) 
  SELECT '6a151e45-8580-4c55-a953-dce232583255', 'Master of Landscape Architecture', 'MLA', 'Professional degree in landscape architecture'
  WHERE NOT EXISTS (SELECT 1 FROM public.programs WHERE code = 'MLA' AND user_id = '6a151e45-8580-4c55-a953-dce232583255');
  
  INSERT INTO public.programs (user_id, name, code, description) 
  SELECT '6a151e45-8580-4c55-a953-dce232583255', 'Health Care Assistant', 'HCA', 'Certificate program for healthcare assistants'
  WHERE NOT EXISTS (SELECT 1 FROM public.programs WHERE code = 'HCA' AND user_id = '6a151e45-8580-4c55-a953-dce232583255');
  
  INSERT INTO public.programs (user_id, name, code, description) 
  SELECT '6a151e45-8580-4c55-a953-dce232583255', 'Computer Science', 'CS', 'Bachelor degree in computer science'
  WHERE NOT EXISTS (SELECT 1 FROM public.programs WHERE code = 'CS' AND user_id = '6a151e45-8580-4c55-a953-dce232583255');
END $$;