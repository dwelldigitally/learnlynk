-- Insert missing progress entries for the existing academic journey
INSERT INTO lead_journey_progress (lead_id, journey_id, stage_id, stage_name, completed)
VALUES 
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Inquiry', true),
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Qualification', false),
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Nurturing', false),
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Application Initiated', false),
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Application Submitted', false),
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Documents Pending / Submitted', false),
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Interview / Counseling', false),
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Offer Sent', false),
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Offer Accepted', false),
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Enrollment Confirmed', false),
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Orientation & Onboarding', false),
  ('6c57a2d7-cdcc-463f-b263-236a9130dea6', 'f486bad0-d477-43f5-8fa7-ae8126c9d47c', null, 'Enrolled / Active', false);