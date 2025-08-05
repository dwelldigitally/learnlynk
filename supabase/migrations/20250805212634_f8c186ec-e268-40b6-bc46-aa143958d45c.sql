-- Assign demo data to the current user for testing
DO $$
DECLARE
    current_user_id uuid;
    current_user_email text;
BEGIN
    -- Get current user info
    SELECT auth.uid() INTO current_user_id;
    
    -- Get user email from auth.users (if available)
    SELECT email INTO current_user_email 
    FROM auth.users 
    WHERE id = current_user_id;
    
    -- Only proceed if we have a valid user
    IF current_user_id IS NOT NULL AND current_user_email IS NOT NULL THEN
        -- Insert or update demo data assignment
        INSERT INTO demo_data_assignments (user_id, email, has_demo_data, demo_type)
        VALUES (current_user_id, current_user_email, true, 'full')
        ON CONFLICT (user_id) 
        DO UPDATE SET 
            has_demo_data = true,
            demo_type = 'full',
            updated_at = now();
            
        -- Also ensure there are some sample students for this user
        -- Check if user already has students
        IF NOT EXISTS (SELECT 1 FROM students WHERE user_id = current_user_id) THEN
            -- Assign some existing demo students to this user
            UPDATE students 
            SET user_id = current_user_id 
            WHERE user_id IN (
                SELECT DISTINCT user_id 
                FROM students 
                WHERE user_id != current_user_id 
                LIMIT 1
            )
            AND id IN (
                SELECT id FROM students 
                WHERE user_id != current_user_id 
                ORDER BY created_at DESC 
                LIMIT 3
            );
        END IF;
    END IF;
END $$;