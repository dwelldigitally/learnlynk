
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

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  type: "blog" | "alumni_story" | "instructor_profile";
  date: string;
  readTime: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  registeredCount: number;
  maxCapacity: number;
  eventType: "info_session" | "workshop" | "campus_tour" | "networking" | "guest_lecture";
}

export interface AppointmentSlot {
  date: Date;
  available: boolean;
}
