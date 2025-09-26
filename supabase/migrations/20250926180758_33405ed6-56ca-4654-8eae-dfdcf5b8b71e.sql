-- Add token access for malhotratushar37@gmail.com
DO $$
DECLARE
    target_lead_id UUID;
    generated_token TEXT;
    existing_record_count INTEGER;
BEGIN
    -- Find the lead_id for the email
    SELECT id INTO target_lead_id 
    FROM public.leads 
    WHERE email = 'malhotratushar37@gmail.com' 
    LIMIT 1;
    
    IF target_lead_id IS NULL THEN
        RAISE NOTICE 'No lead found for email: malhotratushar37@gmail.com';
        RETURN;
    END IF;
    
    -- Generate a secure token
    generated_token := encode(gen_random_bytes(32), 'base64');
    
    -- Check if record already exists
    SELECT COUNT(*) INTO existing_record_count
    FROM public.student_portal_access 
    WHERE lead_id = target_lead_id;
    
    IF existing_record_count > 0 THEN
        -- Update existing record
        UPDATE public.student_portal_access 
        SET 
            access_token = generated_token,
            expires_at = NOW() + INTERVAL '6 months',
            status = 'active',
            updated_at = NOW()
        WHERE lead_id = target_lead_id;
        
        RAISE NOTICE 'Updated access token for %: %', 'malhotratushar37@gmail.com', generated_token;
    ELSE
        -- Insert new record
        INSERT INTO public.student_portal_access (
            access_token,
            student_name,
            lead_id,
            application_date,
            expires_at,
            status,
            programs_applied
        ) VALUES (
            generated_token,
            COALESCE(
                (SELECT CONCAT(first_name, ' ', last_name) FROM public.leads WHERE id = target_lead_id),
                'Student User'
            ),
            target_lead_id,
            NOW(),
            NOW() + INTERVAL '6 months',
            'active',
            COALESCE(
                (SELECT program_interest FROM public.leads WHERE id = target_lead_id),
                ARRAY['HCA']::text[]
            )
        );
        
        RAISE NOTICE 'Created access token for %: %', 'malhotratushar37@gmail.com', generated_token;
    END IF;
END $$;