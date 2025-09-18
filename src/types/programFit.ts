export interface ProgramFitAssessment {
  id: string;
  applicant_id: string;
  user_id: string;
  program_fit_score: number;
  yield_propensity_score: number;
  hard_eligibility_passed: boolean;
  academic_alignment_score: number;
  engagement_intent_score: number;
  behavioral_signals_score: number;
  financial_readiness_score: number;
  risk_flags_count: number;
  assessment_data: any;
  ai_confidence_score: number;
  assessment_notes?: string;
  assessed_by?: string;
  assessed_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProgramCapacity {
  id: string;
  user_id: string;
  program_name: string;
  total_seats: number;
  filled_seats: number;
  target_gpa_min: number;
  target_gpa_max: number;
  target_domestic_ratio: number;
  target_international_ratio: number;
  diversity_targets: any;
  intake_period?: string;
  class_shaping_rules: any;
  created_at: string;
  updated_at: string;
}

export interface ApplicantEngagementMetrics {
  id: string;
  applicant_id: string;
  portal_login_count: number;
  portal_time_spent_minutes: number;
  email_open_rate: number;
  sms_response_rate: number;
  event_attendance_count: number;
  interview_show_rate: number;
  first_response_time_hours?: number;
  application_velocity_days?: number;
  nudge_responsiveness_score: number;
  self_scheduling_speed_hours?: number;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgramFitCriteria {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
  description: string;
  calculation: (applicant: any, engagement: ApplicantEngagementMetrics, programData: any) => number;
}

export interface ProgramFitFactors {
  hardEligibility: {
    prerequisitesMet: boolean;
    gpaMinimum: boolean;
    documentsComplete: boolean;
    testScores: boolean;
  };
  academicAlignment: {
    courseworkMatch: number;
    gradeAlignment: number;
    prerequisiteRecency: number;
    academicProgression: number;
  };
  engagementIntent: {
    responseTime: number;
    emailEngagement: number;
    portalActivity: number;
    eventParticipation: number;
  };
  behavioralSignals: {
    applicationVelocity: number;
    nudgeResponse: number;
    schedulingSpeed: number;
    consistency: number;
  };
  riskFactors: {
    documentInconsistencies: number;
    policyConflicts: number;
    visaTimeline: number;
    financialReadiness: number;
  };
}

export interface ClassShapingTargets {
  gpaDistribution: {
    min: number;
    max: number;
    target_mean: number;
  };
  geographicMix: {
    domestic_ratio: number;
    international_ratio: number;
    region_targets: Record<string, number>;
  };
  diversityGoals: {
    gender_balance: Record<string, number>;
    age_distribution: Record<string, number>;
    experience_levels: Record<string, number>;
  };
  programVariants: {
    full_time_ratio: number;
    part_time_ratio: number;
    online_ratio: number;
    campus_ratio: number;
  };
}