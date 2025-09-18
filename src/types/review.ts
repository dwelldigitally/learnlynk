export type ReviewSection = 
  | 'documents' 
  | 'essays' 
  | 'background' 
  | 'assessment'
  | 'final';

export interface ReviewProgress {
  currentSection: ReviewSection;
  completedSections: ReviewSection[];
  totalSections: number;
  percentComplete: number;
}

export interface EssayReview {
  essayId: string;
  score: number;
  grammarScore: number;
  clarityScore: number;
  relevanceScore: number;
  comments: string;
  gradingCriteria: {
    content: number;
    structure: number;
    originality: number;
    relevance: number;
  };
  flaggedIssues: string[];
  recommendation: 'accept' | 'revise' | 'reject';
}

export interface DocumentReview {
  documentId: string;
  status: 'approved' | 'rejected' | 'needs_revision';
  score: number;
  comments: string;
  reviewedAt: Date;
  reviewerId: string;
}

export interface BackgroundAssessment {
  academicFit: number;
  experienceRelevance: number;
  extracurricularValue: number;
  referenceStrength: number;
  overallScore: number;
  notes: string;
  concerns: string[];
  strengths: string[];
}

export interface FinalAssessment {
  recommendation: 'accept' | 'reject' | 'waitlist' | 'interview';
  overallScore: number;
  confidence: number;
  reasoning: string;
  conditions?: string[];
  nextSteps: string[];
  timeSpent: number; // in minutes
}

export interface ReviewSession {
  id: string;
  applicantId: string;
  reviewerId: string;
  startedAt: Date;
  completedAt?: Date;
  progress: ReviewProgress;
  essayReviews: EssayReview[];
  documentReviews: DocumentReview[];
  backgroundAssessment?: BackgroundAssessment;
  finalAssessment?: FinalAssessment;
  notes: string;
  isDraft: boolean;
  timeSpent: number;
}

export interface ReviewerNote {
  id: string;
  section: ReviewSection;
  content: string;
  timestamp: Date;
  isPrivate: boolean;
  tags: string[];
}