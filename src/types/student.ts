
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  program: string;
  stage: AdmissionStage;
  acceptanceLikelihood: number;
}

export type AdmissionStage = 
  | "LEAD_FORM"
  | "SEND_DOCUMENTS"
  | "DOCUMENT_APPROVAL"
  | "FEE_PAYMENT"
  | "ACCEPTED";

export interface AdmissionStep {
  id: number;
  name: string;
  status: "completed" | "current" | "upcoming";
  label: string;
}

export interface AdvisorProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface NewsEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  duration: string;
  lessons: number;
}

export interface AppointmentSlot {
  date: Date;
  available: boolean;
}
