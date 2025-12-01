-- Seed default permissions
INSERT INTO permissions (permission_name, permission_description, category, risk_level) VALUES
  -- Leads permissions
  ('view_leads', 'View lead information', 'leads', 'low'),
  ('create_leads', 'Create new leads', 'leads', 'medium'),
  ('edit_leads', 'Edit lead information', 'leads', 'medium'),
  ('delete_leads', 'Delete leads', 'leads', 'high'),
  ('export_leads', 'Export lead data', 'leads', 'high'),
  
  -- Students permissions
  ('view_students', 'View student information', 'students', 'medium'),
  ('create_students', 'Create student records', 'students', 'high'),
  ('edit_students', 'Edit student information', 'students', 'high'),
  ('view_academic_records', 'View academic records', 'students', 'high'),
  ('export_student_data', 'Export student data', 'students', 'critical'),
  
  -- Financial permissions
  ('view_payments', 'View payment records', 'financial', 'high'),
  ('process_payments', 'Process payments', 'financial', 'high'),
  ('issue_refunds', 'Issue refunds', 'financial', 'critical'),
  ('export_financial_data', 'Export financial data', 'financial', 'critical'),
  
  -- System permissions
  ('manage_users', 'Manage user accounts', 'system', 'critical'),
  ('manage_roles', 'Manage user roles', 'system', 'critical'),
  ('system_settings', 'Configure system settings', 'system', 'critical'),
  ('view_audit_logs', 'View audit logs', 'system', 'medium'),
  
  -- Team permissions
  ('manage_teams', 'Manage team structure', 'team', 'medium'),
  ('assign_team_members', 'Assign users to teams', 'team', 'medium'),
  ('view_team_reports', 'View team reports', 'team', 'low')
ON CONFLICT (permission_name) DO NOTHING;

-- Seed role-permission mappings
-- Admin gets all permissions
INSERT INTO role_permissions (role, permission_id) 
SELECT 'admin', id FROM permissions
ON CONFLICT DO NOTHING;

-- Team Lead permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'team_lead', id FROM permissions 
WHERE permission_name IN (
  'view_leads', 'create_leads', 'edit_leads', 'export_leads',
  'view_students', 'view_payments', 
  'manage_teams', 'assign_team_members', 'view_team_reports'
)
ON CONFLICT DO NOTHING;

-- Advisor permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'advisor', id FROM permissions 
WHERE permission_name IN (
  'view_leads', 'create_leads', 'edit_leads',
  'view_students', 'view_team_reports'
)
ON CONFLICT DO NOTHING;

-- Finance Officer permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'finance_officer', id FROM permissions 
WHERE permission_name IN (
  'view_leads', 'view_students',
  'view_payments', 'process_payments', 'issue_refunds', 'export_financial_data'
)
ON CONFLICT DO NOTHING;

-- Registrar permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'registrar', id FROM permissions 
WHERE permission_name IN (
  'view_leads', 'view_students', 'create_students', 
  'edit_students', 'view_academic_records'
)
ON CONFLICT DO NOTHING;

-- Viewer permissions
INSERT INTO role_permissions (role, permission_id)
SELECT 'viewer', id FROM permissions 
WHERE permission_name IN ('view_leads', 'view_students', 'view_team_reports')
ON CONFLICT DO NOTHING;