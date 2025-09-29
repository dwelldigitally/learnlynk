-- Update the Surrey healthcare facilities to be owned by the current user
UPDATE public.practicum_sites 
SET user_id = '7a4165be-91e3-4fd9-b2da-19a4be0f2df1'
WHERE city IN ('Surrey', 'White Rock') 
AND user_id = '00000000-0000-0000-0000-000000000000';