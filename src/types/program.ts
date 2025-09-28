export interface Program {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  marketingCopy?: string;
  images: ProgramImage[];
  type: "certificate" | "diploma" | "degree";
  duration: string;
  campus: string[];
  deliveryMethod: "in-person" | "online" | "hybrid";
  color: string;
  status: "active" | "inactive" | "draft";
  category: string;
  tags: string[];
  urlSlug: string;
  
  // Entry requirements
  entryRequirements: EntryRequirement[];
  
  // Document requirements
  documentRequirements: DocumentRequirement[];
  
  // Fee structure
  feeStructure: FeeStructure;
  
  // Custom intake questions
  customQuestions: CustomQuestion[];
  
  // Intake dates
  intakes: ProgramIntake[];
  
  // Practicum configuration
  practicum?: {
    enabled: boolean;
    duration_weeks: number;
    total_hours_required: number;
    start_timing: string;
    document_requirements: string[];
    assigned_sites: string[]; // site IDs
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ProgramImage {
  id: string;
  url: string;
  alt: string;
  type: "hero" | "gallery" | "thumbnail";
  order: number;
}

export interface EntryRequirement {
  id: string;
  type: "academic" | "language" | "experience" | "health" | "age" | "other";
  title: string;
  description: string;
  mandatory: boolean;
  details?: string;
  minimumGrade?: string;
  alternatives?: string[];
}

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  acceptedFormats: string[];
  maxSize: number; // in MB
  stage: string;
  order: number;
  instructions?: string;
  examples?: string[];
}

export interface FeeStructure {
  domesticFees: FeeItem[];
  internationalFees: FeeItem[];
  paymentPlans: PaymentPlan[];
  scholarships: Scholarship[];
  refundPolicy?: string;
}

export interface FeeItem {
  id: string;
  type: string;
  amount: number;
  currency: "CAD" | "USD" | "EUR" | "GBP";
  required: boolean;
  description?: string;
}

export interface AdditionalFee {
  id: string;
  name: string;
  amount: number;
  mandatory: boolean;
  description?: string;
}

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  installments: PaymentInstallment[];
  minimumDownPayment: number;
  interestRate?: number;
  eligibility?: string[];
}

export interface PaymentInstallment {
  dueDate: string; // relative to start date, e.g., "enrollment", "week-4", "month-2"
  amount: number;
  description: string;
}

export interface Scholarship {
  id: string;
  name: string;
  amount: number;
  type: "fixed" | "percentage";
  eligibility: string[];
  deadline?: string;
  renewable: boolean;
}

export interface CustomQuestion {
  id: string;
  type: "text" | "textarea" | "select" | "multiselect" | "radio" | "checkbox" | "file" | "date" | "number";
  question: string;
  placeholder?: string;
  required: boolean;
  options?: QuestionOption[];
  validation?: QuestionValidation;
  conditionalLogic?: ConditionalLogic;
  order: number;
  section?: string;
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  fileTypes?: string[];
  maxFileSize?: number;
}

export interface ConditionalLogic {
  dependsOn: string; // question ID
  conditions: ConditionalRule[];
}

export interface ConditionalRule {
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
  value: string | number;
  action: "show" | "hide" | "require" | "optional";
}

export interface ProgramIntake {
  id: string;
  date: string;
  time?: string;
  capacity: number;
  enrolled: number;
  waitlistCapacity?: number;
  status: "planning" | "open" | "closed" | "cancelled" | "full";
  applicationDeadline: string;
  earlyBirdDeadline?: string;
  earlyBirdDiscount?: number;
  location?: string;
  studyMode: "full-time" | "part-time";
  deliveryMethod: "online" | "hybrid" | "in-class";
  campusLocation: string;
  notes?: string;
  notifications: IntakeNotification[];
}

export interface IntakeNotification {
  id: string;
  type: "email" | "sms" | "system";
  template: string;
  scheduledDate: string; // relative to intake or deadline
  recipients: ("applicants" | "enrolled" | "waitlist" | "team")[];
  status: "scheduled" | "sent" | "failed";
}

export interface ProgramTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  program: Partial<Program>;
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
}

export interface ProgramWizardState {
  currentStep: number;
  totalSteps: number;
  completed: boolean[];
  data: Partial<Program>;
  isDraft: boolean;
  lastSaved?: string;
}

export interface ProgramValidation {
  step: number;
  field: string;
  message: string;
  type: "error" | "warning";
}