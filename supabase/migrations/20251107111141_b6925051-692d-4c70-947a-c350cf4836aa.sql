-- Insert dummy uploaded documents for testing
INSERT INTO lead_documents (lead_id, user_id, requirement_id, document_name, document_type, file_path, file_size, admin_status, admin_comments)
VALUES 
  ('e9d3f669-358f-4eb9-9f43-f80dd3101c07', '7a4165be-91e3-4fd9-b2da-19a4be0f2df1', 'passport', 'Passport_John_Smith.pdf', 'application/pdf', 'documents/e9d3f669-358f-4eb9-9f43-f80dd3101c07/passport.pdf', 2457600, 'pending', NULL),
  ('e9d3f669-358f-4eb9-9f43-f80dd3101c07', '7a4165be-91e3-4fd9-b2da-19a4be0f2df1', 'transcript', 'Official_Transcript_2024.pdf', 'application/pdf', 'documents/e9d3f669-358f-4eb9-9f43-f80dd3101c07/transcript.pdf', 3145728, 'approved', 'Looks good, all required information is present.'),
  ('e9d3f669-358f-4eb9-9f43-f80dd3101c07', '7a4165be-91e3-4fd9-b2da-19a4be0f2df1', 'english_test', 'IELTS_Results_John_Smith.pdf', 'application/pdf', 'documents/e9d3f669-358f-4eb9-9f43-f80dd3101c07/ielts.pdf', 1048576, 'rejected', 'Score is below the minimum requirement. Please retake the test.'),
  ('e9d3f669-358f-4eb9-9f43-f80dd3101c07', '7a4165be-91e3-4fd9-b2da-19a4be0f2df1', 'medical_certificate', 'Medical_Certificate_Class1.pdf', 'application/pdf', 'documents/e9d3f669-358f-4eb9-9f43-f80dd3101c07/medical.pdf', 524288, 'pending', NULL),
  ('e9d3f669-358f-4eb9-9f43-f80dd3101c07', '7a4165be-91e3-4fd9-b2da-19a4be0f2df1', 'photos', 'Passport_Photos.jpg', 'image/jpeg', 'documents/e9d3f669-358f-4eb9-9f43-f80dd3101c07/photos.jpg', 204800, 'approved', 'Perfect photos, meets all requirements.')
ON CONFLICT DO NOTHING;