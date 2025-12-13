export interface SystemProperty {
  id: string;
  user_id: string;
  category: PropertyCategory;
  property_key: string;
  property_label: string;
  property_description?: string;
  color?: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
  is_system: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type PropertyCategory = 
  | 'program_level'
  | 'program_category'
  | 'delivery_mode'
  | 'document_type'
  | 'payment_method'
  | 'fee_type'
  | 'call_type'
  | 'email_category'
  | 'sms_category'
  | 'lead_source'
  | 'lead_status'
  | 'lead_priority'
  | 'lifecycle_stage'
  | 'student_status'
  | 'custom';

export interface PropertyFormData {
  property_key: string;
  property_label: string;
  property_description?: string;
  color?: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
}
