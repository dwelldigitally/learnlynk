import { supabase } from "@/integrations/supabase/client";
import { ProgramFitAssessment, ProgramCapacity, ApplicantEngagementMetrics, ProgramFitFactors } from "@/types/programFit";
import { Applicant } from "@/types/applicant";

export class ProgramFitService {
  static async calculateProgramFit(applicant: Applicant): Promise<{ programFit: number; yieldPropensity: number; factors: ProgramFitFactors }> {
    const engagement = await this.getEngagementMetrics(applicant.id);
    const programData = await this.getProgramData(applicant.program);
    
    const factors = this.analyzeFitFactors(applicant, engagement, programData);
    
    // Calculate Program Fit Score (0-100)
    const programFit = this.calculateProgramFitScore(factors);
    
    // Calculate Yield Propensity (0-100)
    const yieldPropensity = this.calculateYieldPropensity(factors, engagement);
    
    return { programFit, yieldPropensity, factors };
  }

  private static analyzeFitFactors(applicant: Applicant, engagement: ApplicantEngagementMetrics | null, programData: any): ProgramFitFactors {
    return {
      hardEligibility: {
        prerequisitesMet: applicant.documents_approved.length >= 2, // Basic check
        gpaMinimum: true, // Would check against program requirements
        documentsComplete: applicant.documents_submitted.length >= applicant.documents_approved.length,
        testScores: true // Would validate test score requirements
      },
      academicAlignment: {
        courseworkMatch: this.scoreCourseworkMatch(applicant, programData),
        gradeAlignment: this.scoreGradeAlignment(applicant, programData),
        prerequisiteRecency: this.scorePrerequisiteRecency(applicant),
        academicProgression: this.scoreAcademicProgression(applicant)
      },
      engagementIntent: {
        responseTime: this.scoreResponseTime(engagement),
        emailEngagement: engagement?.email_open_rate || 0,
        portalActivity: this.scorePortalActivity(engagement),
        eventParticipation: engagement?.event_attendance_count || 0
      },
      behavioralSignals: {
        applicationVelocity: this.scoreApplicationVelocity(engagement),
        nudgeResponse: engagement?.nudge_responsiveness_score || 50,
        schedulingSpeed: this.scoreSchedulingSpeed(engagement),
        consistency: this.scoreConsistency(applicant, engagement)
      },
      riskFactors: {
        documentInconsistencies: this.scoreDocumentRisk(applicant),
        policyConflicts: 0, // Would implement policy checking
        visaTimeline: this.scoreVisaRisk(applicant),
        financialReadiness: this.scoreFinancialReadiness(applicant)
      }
    };
  }

  private static calculateProgramFitScore(factors: ProgramFitFactors): number {
    // Weighted scoring for program success prediction
    const weights = {
      hardEligibility: 0.30,
      academicAlignment: 0.35,
      engagementIntent: 0.20,
      behavioralSignals: 0.10,
      riskFactors: -0.05 // Risk factors reduce score
    };

    let score = 0;
    
    // Hard eligibility (pass/fail gates)
    const eligibilityPassed = Object.values(factors.hardEligibility).every(Boolean);
    if (!eligibilityPassed) return 0; // Fail immediately if hard requirements not met
    
    // Academic alignment (0-100)
    const academicScore = (
      factors.academicAlignment.courseworkMatch * 0.4 +
      factors.academicAlignment.gradeAlignment * 0.3 +
      factors.academicAlignment.prerequisiteRecency * 0.2 +
      factors.academicAlignment.academicProgression * 0.1
    );
    
    // Engagement intent (0-100)
    const engagementScore = (
      factors.engagementIntent.responseTime * 0.3 +
      factors.engagementIntent.emailEngagement * 0.25 +
      factors.engagementIntent.portalActivity * 0.25 +
      Math.min(factors.engagementIntent.eventParticipation * 20, 100) * 0.2
    );
    
    // Behavioral signals (0-100)
    const behavioralScore = (
      factors.behavioralSignals.applicationVelocity * 0.3 +
      factors.behavioralSignals.nudgeResponse * 0.3 +
      factors.behavioralSignals.schedulingSpeed * 0.2 +
      factors.behavioralSignals.consistency * 0.2
    );
    
    // Risk adjustment
    const riskPenalty = (
      factors.riskFactors.documentInconsistencies +
      factors.riskFactors.policyConflicts +
      factors.riskFactors.visaTimeline +
      factors.riskFactors.financialReadiness
    ) / 4;
    
    score = (
      eligibilityPassed ? 100 * weights.hardEligibility : 0 +
      academicScore * weights.academicAlignment +
      engagementScore * weights.engagementIntent +
      behavioralScore * weights.behavioralSignals -
      riskPenalty * Math.abs(weights.riskFactors)
    );
    
    return Math.max(0, Math.min(100, score));
  }

  private static calculateYieldPropensity(factors: ProgramFitFactors, engagement: ApplicantEngagementMetrics | null): number {
    // Focus on likelihood to enroll if admitted
    const engagementWeight = 0.4;
    const behavioralWeight = 0.3;
    const financialWeight = 0.2;
    const timelinessWeight = 0.1;
    
    const engagementScore = (
      factors.engagementIntent.portalActivity * 0.3 +
      factors.engagementIntent.emailEngagement * 0.3 +
      factors.engagementIntent.eventParticipation * 0.2 +
      (100 - factors.engagementIntent.responseTime) * 0.2 // Faster response = higher yield
    );
    
    const behavioralScore = (
      factors.behavioralSignals.applicationVelocity * 0.4 +
      factors.behavioralSignals.schedulingSpeed * 0.3 +
      factors.behavioralSignals.consistency * 0.3
    );
    
    const financialScore = Math.max(0, 100 - factors.riskFactors.financialReadiness);
    
    const timelinessScore = engagement?.application_velocity_days 
      ? Math.max(0, 100 - (engagement.application_velocity_days * 2))
      : 70;
    
    const yieldScore = (
      engagementScore * engagementWeight +
      behavioralScore * behavioralWeight +
      financialScore * financialWeight +
      timelinessScore * timelinessWeight
    );
    
    return Math.max(0, Math.min(100, yieldScore));
  }

  // Helper scoring methods
  private static scoreCourseworkMatch(applicant: Applicant, programData: any): number {
    // Mock implementation - would compare transcripts with program requirements
    return Math.random() * 40 + 60; // 60-100 range
  }

  private static scoreGradeAlignment(applicant: Applicant, programData: any): number {
    // Mock implementation - would analyze GPA vs program standards
    return Math.random() * 30 + 70; // 70-100 range
  }

  private static scorePrerequisiteRecency(applicant: Applicant): number {
    // Mock implementation - would check how recent prerequisites were completed
    return Math.random() * 40 + 60; // 60-100 range
  }

  private static scoreAcademicProgression(applicant: Applicant): number {
    // Mock implementation - would analyze grade trends
    return Math.random() * 25 + 75; // 75-100 range
  }

  private static scoreResponseTime(engagement: ApplicantEngagementMetrics | null): number {
    if (!engagement?.first_response_time_hours) return 50;
    // Faster response = higher score
    const hours = engagement.first_response_time_hours;
    if (hours <= 2) return 100;
    if (hours <= 24) return 80;
    if (hours <= 72) return 60;
    return 30;
  }

  private static scorePortalActivity(engagement: ApplicantEngagementMetrics | null): number {
    if (!engagement) return 30;
    const loginScore = Math.min(engagement.portal_login_count * 10, 50);
    const timeScore = Math.min(engagement.portal_time_spent_minutes / 5, 50);
    return loginScore + timeScore;
  }

  private static scoreApplicationVelocity(engagement: ApplicantEngagementMetrics | null): number {
    if (!engagement?.application_velocity_days) return 50;
    const days = engagement.application_velocity_days;
    if (days <= 7) return 100;
    if (days <= 14) return 80;
    if (days <= 30) return 60;
    return 30;
  }

  private static scoreSchedulingSpeed(engagement: ApplicantEngagementMetrics | null): number {
    if (!engagement?.self_scheduling_speed_hours) return 50;
    const hours = engagement.self_scheduling_speed_hours;
    if (hours <= 24) return 100;
    if (hours <= 72) return 70;
    return 40;
  }

  private static scoreConsistency(applicant: Applicant, engagement: ApplicantEngagementMetrics | null): number {
    // Mock implementation - would analyze consistency across touchpoints
    return Math.random() * 30 + 70; // 70-100 range
  }

  private static scoreDocumentRisk(applicant: Applicant): number {
    // Higher score = more risk
    const submittedCount = applicant.documents_submitted.length;
    const approvedCount = applicant.documents_approved.length;
    if (submittedCount === 0) return 100;
    return Math.max(0, (1 - approvedCount / submittedCount) * 100);
  }

  private static scoreVisaRisk(applicant: Applicant): number {
    // Mock implementation - would check visa requirements and timelines
    return Math.random() * 30; // 0-30 risk
  }

  private static scoreFinancialReadiness(applicant: Applicant): number {
    // Mock implementation - would analyze payment patterns and financial aid
    if (applicant.payment_status === 'completed') return 0;
    if (applicant.payment_status === 'partial') return 30;
    return 60;
  }

  // Database operations
  static async saveAssessment(assessment: Omit<ProgramFitAssessment, 'id' | 'created_at' | 'updated_at'>): Promise<ProgramFitAssessment> {
    const { data, error } = await supabase
      .from('program_fit_assessments')
      .insert([assessment])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAssessment(applicantId: string): Promise<ProgramFitAssessment | null> {
    const { data, error } = await supabase
      .from('program_fit_assessments')
      .select('*')
      .eq('applicant_id', applicantId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getEngagementMetrics(applicantId: string): Promise<ApplicantEngagementMetrics | null> {
    const { data, error } = await supabase
      .from('applicant_engagement_metrics')
      .select('*')
      .eq('applicant_id', applicantId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async getProgramCapacity(programName: string): Promise<ProgramCapacity | null> {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('program_capacity')
      .select('*')
      .eq('program_name', programName)
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  private static async getProgramData(programName: string): Promise<any> {
    // Mock implementation - would fetch from master_programs
    return {
      name: programName,
      requirements: {},
      standards: {}
    };
  }

  static async bulkAssessApplicants(applicantIds: string[]): Promise<ProgramFitAssessment[]> {
    const assessments: ProgramFitAssessment[] = [];
    
    for (const applicantId of applicantIds) {
      try {
        // This would typically be done in parallel
        const { data: applicant } = await supabase
          .from('applicants')
          .select('*')
          .eq('id', applicantId)
          .single();

        if (applicant) {
          const { programFit, yieldPropensity, factors } = await this.calculateProgramFit(applicant as any);
          
          const user = (await supabase.auth.getUser()).data.user;
          if (!user) continue;

          const assessment = await this.saveAssessment({
            applicant_id: applicantId,
            user_id: user.id,
            program_fit_score: Math.round(programFit),
            yield_propensity_score: Math.round(yieldPropensity),
            hard_eligibility_passed: Object.values(factors.hardEligibility).every(Boolean),
            academic_alignment_score: Math.round((
              factors.academicAlignment.courseworkMatch +
              factors.academicAlignment.gradeAlignment +
              factors.academicAlignment.prerequisiteRecency +
              factors.academicAlignment.academicProgression
            ) / 4),
            engagement_intent_score: Math.round((
              factors.engagementIntent.responseTime +
              factors.engagementIntent.emailEngagement +
              factors.engagementIntent.portalActivity +
              Math.min(factors.engagementIntent.eventParticipation * 20, 100)
            ) / 4),
            behavioral_signals_score: Math.round((
              factors.behavioralSignals.applicationVelocity +
              factors.behavioralSignals.nudgeResponse +
              factors.behavioralSignals.schedulingSpeed +
              factors.behavioralSignals.consistency
            ) / 4),
            financial_readiness_score: Math.round(100 - factors.riskFactors.financialReadiness),
            risk_flags_count: Object.values(factors.riskFactors).filter(risk => risk > 50).length,
            assessment_data: factors,
            ai_confidence_score: 85, // Mock confidence
            assessed_by: user.id,
            assessed_at: new Date().toISOString()
          });

          assessments.push(assessment);
        }
      } catch (error) {
        console.error(`Failed to assess applicant ${applicantId}:`, error);
      }
    }

    return assessments;
  }
}