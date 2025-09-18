export interface ApplicationEssay {
  id: string;
  type: 'personal_statement' | 'motivation_letter' | 'academic_goals' | 'research_interest' | 'career_aspirations';
  title: string;
  content: string;
  wordCount: number;
  submittedAt: Date;
  aiAnalysis?: {
    grammarScore: number;
    clarityScore: number;
    relevanceScore: number;
    keyThemes: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    flaggedConcerns: string[];
  };
}

export interface ApplicationFormResponse {
  id: string;
  questionId: string;
  question: string;
  answer: string;
  questionType: 'text' | 'multiple_choice' | 'rating' | 'boolean';
  category: 'academic' | 'personal' | 'professional' | 'motivation' | 'background';
  submittedAt: Date;
  aiScore?: number;
}

export interface AcademicBackground {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  gpa: number;
  maxGpa: number;
  graduationDate: Date;
  honors?: string[];
  relevantCoursework: string[];
  transcriptSubmitted: boolean;
}

export interface ProfessionalExperience {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  skills: string[];
  relevanceToProgram: number; // 1-10 score
}

export interface ExtracurricularActivity {
  id: string;
  name: string;
  role: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  impact: string;
  skills: string[];
}

export interface ApplicationData {
  essays: ApplicationEssay[];
  formResponses: ApplicationFormResponse[];
  academicBackground: AcademicBackground[];
  professionalExperience: ProfessionalExperience[];
  extracurriculars: ExtracurricularActivity[];
  languageProficiency: {
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
    certified: boolean;
    testScore?: string;
  }[];
  references: {
    name: string;
    position: string;
    institution: string;
    email: string;
    relationship: string;
    submitted: boolean;
  }[];
}

export interface ComprehensiveStudentProfile extends ApplicationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth: Date;
    nationality: string;
    residenceCountry: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  aiAssessment: {
    overallFitScore: number;
    academicReadiness: number;
    motivationLevel: number;
    careerAlignment: number;
    communicationSkills: number;
    culturalFit: number;
    riskFactors: string[];
    strengths: string[];
    recommendations: string[];
  };
}