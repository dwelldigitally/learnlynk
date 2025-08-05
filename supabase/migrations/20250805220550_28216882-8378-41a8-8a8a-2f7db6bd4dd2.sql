-- First get a user_id from existing data
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Get an existing user_id from the students table
    SELECT user_id INTO sample_user_id FROM students LIMIT 1;
    
    -- Add sample programs with the user_id
    INSERT INTO programs (name, type, description, duration, user_id, fee_structure, entry_requirements, document_requirements) VALUES
    ('Bachelor of Computer Science', 'undergraduate', 'A comprehensive 4-year program covering software development, algorithms, and computer systems', '4 years', 
     sample_user_id, 
     '{"domestic_fee": 25000, "international_fee": 45000, "payment_plans": [{"name": "Full Payment", "discount": 5}, {"name": "Semester Payment", "installments": 8}]}'::jsonb,
     '{"academic": {"min_gpa": 3.0, "subjects": ["Mathematics", "English"]}, "language": {"ielts": 6.5, "toefl": 79}}'::jsonb,
     '[{"name": "Transcripts", "mandatory": true, "formats": ["PDF"]}, {"name": "Passport", "mandatory": true, "formats": ["PDF", "JPG"]}]'::jsonb),
    ('Master of Business Administration', 'postgraduate', 'Advanced business leadership and management program', '2 years',
     sample_user_id,
     '{"domestic_fee": 35000, "international_fee": 55000, "payment_plans": [{"name": "Full Payment", "discount": 10}, {"name": "Semester Payment", "installments": 4}]}'::jsonb,
     '{"academic": {"min_gpa": 3.5, "work_experience": 2}, "language": {"ielts": 7.0, "toefl": 100}}'::jsonb,
     '[{"name": "Degree Certificate", "mandatory": true, "formats": ["PDF"]}, {"name": "Work Experience Letter", "mandatory": true, "formats": ["PDF"]}]'::jsonb),
    ('Certificate in Digital Marketing', 'certificate', 'Short-term program focusing on digital marketing strategies', '6 months',
     sample_user_id,
     '{"domestic_fee": 8000, "international_fee": 12000, "payment_plans": [{"name": "Full Payment", "discount": 15}, {"name": "Monthly Payment", "installments": 6}]}'::jsonb,
     '{"academic": {"min_qualification": "High School"}, "language": {"ielts": 6.0, "toefl": 70}}'::jsonb,
     '[{"name": "High School Certificate", "mandatory": true, "formats": ["PDF"]}, {"name": "ID Document", "mandatory": true, "formats": ["PDF", "JPG"]}]'::jsonb);

    -- Add student applications for existing students
    INSERT INTO student_applications (student_id, program_id, application_number, status, stage, progress, acceptance_likelihood, application_deadline, estimated_decision, user_id, requirements, documents)
    SELECT 
      s.id,
      p.id,
      'APP-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD((ROW_NUMBER() OVER())::text, 4, '0'),
      CASE 
        WHEN s.stage = 'ACCEPTED' THEN 'approved'
        WHEN s.stage = 'FEE_PAYMENT' THEN 'conditionally_approved' 
        WHEN s.stage = 'DOCUMENT_APPROVAL' THEN 'under_review'
        ELSE 'submitted'
      END,
      s.stage,
      s.progress,
      s.acceptance_likelihood,
      CURRENT_DATE + INTERVAL '30 days',
      CURRENT_DATE + INTERVAL '14 days',
      s.user_id,
      '[{"name": "Academic Transcripts", "status": "submitted", "required": true}, {"name": "English Proficiency", "status": "pending", "required": true}]'::jsonb,
      '[{"name": "transcript.pdf", "status": "approved", "uploaded_date": "2024-01-15"}, {"name": "passport.pdf", "status": "pending", "uploaded_date": "2024-01-20"}]'::jsonb
    FROM (SELECT id, stage, progress, acceptance_likelihood, user_id, ROW_NUMBER() OVER() as rn FROM students LIMIT 10) s
    CROSS JOIN (SELECT id, ROW_NUMBER() OVER() as rn FROM programs) p
    WHERE s.rn = p.rn;

    -- Add financial records for students
    INSERT INTO financial_records (student_name, program, amount, payment_type, status, due_date, user_id)
    SELECT 
      s.first_name || ' ' || s.last_name,
      p.name,
      CASE 
        WHEN p.name LIKE '%Bachelor%' THEN 25000.00
        WHEN p.name LIKE '%Master%' THEN 35000.00
        ELSE 8000.00
      END,
      'tuition',
      CASE 
        WHEN s.stage = 'ACCEPTED' THEN 'paid'
        WHEN s.stage = 'FEE_PAYMENT' THEN 'pending'
        ELSE 'not_due'
      END,
      CURRENT_DATE + INTERVAL '15 days',
      s.user_id
    FROM students s
    JOIN student_applications sa ON s.id = sa.student_id
    JOIN programs p ON sa.program_id = p.id
    LIMIT 10;

    -- Add student communications
    INSERT INTO student_communications (student_id, type, subject, content, direction, status, user_id, sent_at)
    SELECT 
      s.id,
      CASE (RANDOM() * 3)::int
        WHEN 0 THEN 'email'
        WHEN 1 THEN 'phone'
        ELSE 'sms'
      END,
      CASE (RANDOM() * 3)::int
        WHEN 0 THEN 'Application Status Update'
        WHEN 1 THEN 'Document Submission Reminder'
        ELSE 'Welcome to the Program'
      END,
      CASE (RANDOM() * 3)::int
        WHEN 0 THEN 'Thank you for your application. We have received all required documents and will review them within 5-7 business days.'
        WHEN 1 THEN 'We are still waiting for your academic transcripts. Please submit them by the deadline to avoid delays in processing.'
        ELSE 'Congratulations! Welcome to our program. Your orientation will begin on the intake start date.'
      END,
      CASE (RANDOM() * 1)::int
        WHEN 0 THEN 'outbound'
        ELSE 'inbound'
      END,
      'sent',
      s.user_id,
      NOW() - (RANDOM() * INTERVAL '30 days')
    FROM students s
    LIMIT 20;

    -- Add student documents
    INSERT INTO student_documents (student_id, name, type, file_url, status, user_id, file_size, uploaded_at)
    SELECT 
      s.id,
      CASE (RANDOM() * 4)::int
        WHEN 0 THEN 'Academic_Transcript.pdf'
        WHEN 1 THEN 'Passport_Copy.pdf'
        WHEN 2 THEN 'English_Certificate.pdf'
        ELSE 'Statement_of_Purpose.pdf'
      END,
      CASE (RANDOM() * 4)::int
        WHEN 0 THEN 'transcript'
        WHEN 1 THEN 'passport'
        WHEN 2 THEN 'language_certificate'
        ELSE 'personal_statement'
      END,
      '/documents/' || s.id || '_' || (RANDOM() * 1000)::int || '.pdf',
      CASE (RANDOM() * 3)::int
        WHEN 0 THEN 'approved'
        WHEN 1 THEN 'pending'
        ELSE 'under-review'
      END,
      s.user_id,
      (RANDOM() * 5000000 + 500000)::int,
      NOW() - (RANDOM() * INTERVAL '20 days')
    FROM students s
    LIMIT 25;
END $$;