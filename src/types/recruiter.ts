export interface RecruiterCompany {
  id: string;
  name: string;
  country?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  assigned_contact?: string;
  commission_rate: number;
  commission_type: 'percentage' | 'fixed';
  status: 'active' | 'inactive' | 'suspended';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RecruiterUser {
  id: string;
  company_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'recruiter' | 'company_admin';
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  company?: RecruiterCompany;
}

export interface RecruiterApplication {
  id: string;
  recruiter_id: string;
  company_id: string;
  student_id?: string;
  application_id?: string;
  program: string;
  intake_date?: string;
  status: 'submitted' | 'in_review' | 'approved' | 'rejected' | 'payment_pending' | 'completed';
  assigned_to?: string;
  commission_amount: number;
  commission_status: 'pending' | 'approved' | 'paid';
  notes_to_registrar?: string;
  internal_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  recruiter?: RecruiterUser;
  company?: RecruiterCompany;
}

export interface RecruiterCommunication {
  id: string;
  recruiter_application_id: string;
  sender_type: 'recruiter' | 'internal';
  sender_id: string;
  message: string;
  is_internal: boolean;
  read_at?: string;
  created_at: string;
}

export interface RecruiterDocument {
  id: string;
  recruiter_application_id: string;
  uploaded_by: string;
  document_name: string;
  document_type: string;
  file_path?: string;
  file_size?: number;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentApplicationFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  nationality?: string;
  program: string;
  intake_date?: string;
  notes_to_registrar?: string;
  documents: File[];
}