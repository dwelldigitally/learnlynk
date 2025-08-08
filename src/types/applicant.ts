import { ApplicantSubstage, MasterRecord } from './masterRecord';

export type ApplicationType = 'lead_conversion' | 'direct_enrollment' | 'external_recruiter';
export type PaymentStatus = 'pending' | 'partial' | 'completed' | 'refunded';
export type Decision = 'pending' | 'approved' | 'rejected' | 'waitlisted';
export type ApplicantPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Applicant {
  id: string;
  master_record_id: string;
  user_id: string;
  master_records?: MasterRecord;
  application_type: ApplicationType;
  substage: ApplicantSubstage;
  program: string;
  documents_submitted: string[];
  documents_approved: string[];
  payment_status: PaymentStatus;
  payment_amount?: number;
  decision?: Decision;
  decision_date?: string;
  decision_notes?: string;
  recruiter_id?: string;
  recruiter_company_id?: string;
  application_deadline?: string;
  priority: ApplicantPriority;
  notes?: string;
  assigned_to?: string;
  assigned_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicantFormData {
  master_record_id: string;
  application_type: ApplicationType;
  program: string;
  payment_amount?: number;
  application_deadline?: string;
  priority: ApplicantPriority;
  notes?: string;
  assigned_to?: string;
}

export interface ApplicantSearchFilters {
  substage?: ApplicantSubstage[];
  application_type?: ApplicationType[];
  payment_status?: PaymentStatus[];
  decision?: Decision[];
  priority?: ApplicantPriority[];
  assigned_to?: string[];
  program?: string[];
  date_range?: {
    start: Date;
    end: Date;
  };
}