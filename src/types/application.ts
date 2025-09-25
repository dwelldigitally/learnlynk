
export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  ocrText?: string;
  comments: DocumentComment[];
  requirementId: string;
}

export interface DocumentComment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  isAdvisor: boolean;
}

export interface ProgramRequirement {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  acceptedFormats: string[];
  maxSize: number;
  stage: string; // Which application stage requires this document
}

export interface ProgramApplication {
  id: string;
  programName: string;
  stage: AdmissionStage;
  progress: number;
  acceptanceLikelihood: number;
  submissionDate?: Date;
  estimatedDecision?: Date;
  documents: ApplicationDocument[];
  requirements: ProgramRequirement[];
  nextStep?: string;
  applicationDeadline: string;
}

export interface StudentApplication {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  phone?: string;
  program: string;
  applicationDate: Date;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'pending-documents';
  stage: AdmissionStage;
  progress: number;
  acceptanceLikelihood: number;
  documentsSubmitted: number;
  documentsRequired: number;
  advisorAssigned?: string;
  estimatedDecision?: Date;
  lastActivity?: Date;
  priority: 'low' | 'medium' | 'high';
  country?: string;
  city?: string;
}

export interface AlumniProfile {
  name: string;
  graduationYear: string;
  currentRole: string;
  workplace: string;
  testimonial: string;
  avatar: string;
}

export type AdmissionStage = 
  | "LEAD_FORM"
  | "SEND_DOCUMENTS"
  | "DOCUMENT_APPROVAL"
  | "FEE_PAYMENT"
  | "ACCEPTED"
  | "WAITLISTED"
  | "DECLINED";
