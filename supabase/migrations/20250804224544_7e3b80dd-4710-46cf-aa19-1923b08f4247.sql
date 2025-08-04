-- Update all dummy students to belong to the current authenticated user
UPDATE students 
SET user_id = '564dedbf-1214-423e-bce6-eb95d26fc662'
WHERE student_id LIKE 'STU%' 
AND user_id != '564dedbf-1214-423e-bce6-eb95d26fc662';