-- Seed default system properties for all categories
-- These are marked as is_system = true so they cannot be deleted

-- Helper function to get a consistent user_id for system properties
-- Using a null UUID placeholder that will be replaced by each user's ID via RLS

-- Program Levels
INSERT INTO public.system_properties (user_id, category, property_key, property_label, property_description, color, icon, order_index, is_active, is_system)
SELECT auth.uid(), 'program_level', key, label, description, color, icon, idx, true, true
FROM (VALUES
  ('certificate', 'Certificate', 'Short-term credential program', '#10B981', 'Award', 1),
  ('diploma', 'Diploma', 'Vocational or technical diploma', '#3B82F6', 'FileText', 2),
  ('associate', 'Associate Degree', '2-year undergraduate degree', '#8B5CF6', 'GraduationCap', 3),
  ('bachelor', 'Bachelor''s Degree', '4-year undergraduate degree', '#F59E0B', 'GraduationCap', 4),
  ('master', 'Master''s Degree', 'Graduate level degree', '#EF4444', 'Award', 5),
  ('doctoral', 'Doctoral Degree', 'Highest academic degree', '#EC4899', 'Star', 6),
  ('professional', 'Professional Certificate', 'Industry certification program', '#06B6D4', 'Briefcase', 7)
) AS t(key, label, description, color, icon, idx)
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Program Categories
INSERT INTO public.system_properties (user_id, category, property_key, property_label, property_description, color, icon, order_index, is_active, is_system)
SELECT auth.uid(), 'program_category', key, label, description, color, icon, idx, true, true
FROM (VALUES
  ('business', 'Business & Management', 'Business administration and management programs', '#3B82F6', 'Briefcase', 1),
  ('healthcare', 'Healthcare', 'Medical and health sciences programs', '#EF4444', 'Heart', 2),
  ('technology', 'Technology', 'IT and computer science programs', '#8B5CF6', 'Cpu', 3),
  ('creative_arts', 'Creative Arts', 'Design, media, and performing arts', '#EC4899', 'Palette', 4),
  ('hospitality', 'Hospitality & Tourism', 'Hotel management and tourism', '#F59E0B', 'Hotel', 5),
  ('engineering', 'Engineering', 'Engineering and technical programs', '#6366F1', 'Wrench', 6),
  ('education', 'Education', 'Teaching and educational programs', '#10B981', 'BookOpen', 7),
  ('law', 'Law & Legal Studies', 'Legal and paralegal programs', '#64748B', 'Scale', 8),
  ('science', 'Science', 'Natural and physical sciences', '#06B6D4', 'Flask', 9)
) AS t(key, label, description, color, icon, idx)
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Delivery Modes
INSERT INTO public.system_properties (user_id, category, property_key, property_label, property_description, color, icon, order_index, is_active, is_system)
SELECT auth.uid(), 'delivery_mode', key, label, description, color, icon, idx, true, true
FROM (VALUES
  ('in_person', 'In-Person', 'Traditional on-campus instruction', '#10B981', 'Users', 1),
  ('online', 'Online', 'Fully online delivery', '#3B82F6', 'Globe', 2),
  ('hybrid', 'Hybrid', 'Combination of in-person and online', '#8B5CF6', 'Layers', 3),
  ('blended', 'Blended', 'Integrated online and face-to-face', '#F59E0B', 'Blend', 4),
  ('self_paced', 'Self-Paced', 'Learn at your own pace', '#06B6D4', 'Clock', 5)
) AS t(key, label, description, color, icon, idx)
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Document Types
INSERT INTO public.system_properties (user_id, category, property_key, property_label, property_description, color, icon, order_index, is_active, is_system)
SELECT auth.uid(), 'document_type', key, label, description, color, icon, idx, true, true
FROM (VALUES
  ('academic_transcript', 'Academic Transcript', 'Official academic records', '#3B82F6', 'FileText', 1),
  ('personal_statement', 'Personal Statement', 'Statement of purpose or motivation letter', '#8B5CF6', 'PenTool', 2),
  ('cv_resume', 'CV/Resume', 'Curriculum vitae or resume', '#10B981', 'User', 3),
  ('id_passport', 'ID/Passport', 'Government-issued identification', '#EF4444', 'CreditCard', 4),
  ('language_certificate', 'Language Certificate', 'English proficiency or other language tests', '#F59E0B', 'Globe', 5),
  ('recommendation_letter', 'Recommendation Letter', 'Letters of recommendation', '#EC4899', 'Mail', 6),
  ('portfolio', 'Portfolio', 'Work samples or creative portfolio', '#06B6D4', 'Folder', 7),
  ('proof_of_funds', 'Proof of Funds', 'Financial documentation', '#64748B', 'DollarSign', 8),
  ('medical_certificate', 'Medical Certificate', 'Health clearance or vaccination records', '#EF4444', 'Heart', 9),
  ('photo', 'Passport Photo', 'Recent passport-sized photograph', '#6366F1', 'Camera', 10)
) AS t(key, label, description, color, icon, idx)
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Payment Methods
INSERT INTO public.system_properties (user_id, category, property_key, property_label, property_description, color, icon, order_index, is_active, is_system)
SELECT auth.uid(), 'payment_method', key, label, description, color, icon, idx, true, true
FROM (VALUES
  ('credit_card', 'Credit Card', 'Visa, Mastercard, Amex', '#3B82F6', 'CreditCard', 1),
  ('debit_card', 'Debit Card', 'Direct bank debit', '#10B981', 'CreditCard', 2),
  ('bank_transfer', 'Bank Transfer', 'Direct bank transfer', '#8B5CF6', 'Building', 3),
  ('wire_transfer', 'Wire Transfer', 'International wire transfer', '#F59E0B', 'Send', 4),
  ('check', 'Check', 'Personal or cashier''s check', '#64748B', 'FileCheck', 5),
  ('cash', 'Cash', 'Cash payment', '#10B981', 'Banknote', 6),
  ('payment_plan', 'Payment Plan', 'Installment payment plan', '#EC4899', 'Calendar', 7),
  ('scholarship', 'Scholarship', 'Scholarship or grant', '#06B6D4', 'Award', 8)
) AS t(key, label, description, color, icon, idx)
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;

-- Fee Types
INSERT INTO public.system_properties (user_id, category, property_key, property_label, property_description, color, icon, order_index, is_active, is_system)
SELECT auth.uid(), 'fee_type', key, label, description, color, icon, idx, true, true
FROM (VALUES
  ('tuition', 'Tuition', 'Course tuition fees', '#3B82F6', 'GraduationCap', 1),
  ('registration', 'Registration Fee', 'One-time registration fee', '#10B981', 'ClipboardList', 2),
  ('application', 'Application Fee', 'Application processing fee', '#8B5CF6', 'FileText', 3),
  ('lab_fee', 'Lab Fee', 'Laboratory or practical fees', '#F59E0B', 'Flask', 4),
  ('material_fee', 'Material Fee', 'Books and materials', '#EF4444', 'Book', 5),
  ('technology_fee', 'Technology Fee', 'IT and technology fees', '#06B6D4', 'Laptop', 6),
  ('activity_fee', 'Student Activity Fee', 'Student activities and services', '#EC4899', 'Users', 7),
  ('late_fee', 'Late Payment Fee', 'Penalty for late payments', '#64748B', 'AlertTriangle', 8),
  ('graduation_fee', 'Graduation Fee', 'Graduation ceremony and certificate', '#6366F1', 'Award', 9)
) AS t(key, label, description, color, icon, idx)
WHERE auth.uid() IS NOT NULL
ON CONFLICT DO NOTHING;