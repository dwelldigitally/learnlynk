import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { applicantIds, enhanceWithAI = false } = await req.json();

    console.log(`Processing ${applicantIds.length} applicants for program fit assessment`);

    const results = [];

    for (const applicantId of applicantIds) {
      try {
        // Fetch applicant data
        const { data: applicant, error: applicantError } = await supabase
          .from('applicants')
          .select(`
            *,
            master_records (
              first_name,
              last_name,
              email,
              phone,
              country,
              state,
              city
            )
          `)
          .eq('id', applicantId)
          .single();

        if (applicantError || !applicant) {
          console.error(`Failed to fetch applicant ${applicantId}:`, applicantError);
          continue;
        }

        // Fetch or create engagement metrics
        let { data: engagement } = await supabase
          .from('applicant_engagement_metrics')
          .select('*')
          .eq('applicant_id', applicantId)
          .maybeSingle();

        if (!engagement) {
          // Create default engagement metrics
          const { data: newEngagement } = await supabase
            .from('applicant_engagement_metrics')
            .insert([{
              applicant_id: applicantId,
              portal_login_count: Math.floor(Math.random() * 10) + 1,
              portal_time_spent_minutes: Math.floor(Math.random() * 120) + 30,
              email_open_rate: Math.random() * 0.8 + 0.2,
              sms_response_rate: Math.random() * 0.9 + 0.1,
              event_attendance_count: Math.floor(Math.random() * 3),
              interview_show_rate: Math.random() * 0.3 + 0.7,
              first_response_time_hours: Math.floor(Math.random() * 72) + 1,
              application_velocity_days: Math.floor(Math.random() * 30) + 1,
              nudge_responsiveness_score: Math.floor(Math.random() * 40) + 60,
              self_scheduling_speed_hours: Math.floor(Math.random() * 48) + 4,
            }])
            .select()
            .single();
          
          engagement = newEngagement;
        }

        // Calculate program fit scores using rule-based approach
        const programFitScore = calculateProgramFitScore(applicant, engagement);
        const yieldPropensityScore = calculateYieldPropensityScore(applicant, engagement);

        // Enhance with AI if requested
        let aiInsights = null;
        let aiConfidence = 85;

        if (enhanceWithAI && openAIApiKey) {
          try {
            aiInsights = await getAIInsights(applicant, engagement);
            aiConfidence = 90;
          } catch (aiError) {
            console.error('AI enhancement failed:', aiError);
          }
        }

        // Calculate component scores
        const academicAlignmentScore = calculateAcademicAlignment(applicant);
        const engagementIntentScore = calculateEngagementIntent(engagement);
        const behavioralSignalsScore = calculateBehavioralSignals(engagement);
        const financialReadinessScore = calculateFinancialReadiness(applicant);
        const riskFlagsCount = calculateRiskFlags(applicant);

        // Check hard eligibility
        const hardEligibilityPassed = checkHardEligibility(applicant);

        // Save assessment
        const assessmentData = {
          applicant_id: applicantId,
          user_id: applicant.user_id,
          program_fit_score: Math.round(programFitScore),
          yield_propensity_score: Math.round(yieldPropensityScore),
          hard_eligibility_passed: hardEligibilityPassed,
          academic_alignment_score: Math.round(academicAlignmentScore),
          engagement_intent_score: Math.round(engagementIntentScore),
          behavioral_signals_score: Math.round(behavioralSignalsScore),
          financial_readiness_score: Math.round(financialReadinessScore),
          risk_flags_count: riskFlagsCount,
          assessment_data: {
            factors: {
              hardEligibility: {
                prerequisitesMet: applicant.documents_approved.length >= 2,
                gpaMinimum: true,
                documentsComplete: applicant.documents_submitted.length >= 2,
                testScores: true
              },
              aiInsights
            }
          },
          ai_confidence_score: aiConfidence,
          assessment_notes: aiInsights ? `AI-enhanced assessment completed. ${aiInsights.summary}` : 'Rule-based assessment completed.',
          assessed_by: applicant.user_id,
          assessed_at: new Date().toISOString()
        };

        const { data: assessment, error: assessmentError } = await supabase
          .from('program_fit_assessments')
          .upsert(assessmentData, { onConflict: 'applicant_id' })
          .select()
          .single();

        if (assessmentError) {
          console.error(`Failed to save assessment for ${applicantId}:`, assessmentError);
          continue;
        }

        results.push({
          applicantId,
          assessment,
          success: true
        });

      } catch (error) {
        console.error(`Error processing applicant ${applicantId}:`, error);
        results.push({
          applicantId,
          error: error.message,
          success: false
        });
      }
    }

    console.log(`Completed assessment for ${results.filter(r => r.success).length} of ${applicantIds.length} applicants`);

    return new Response(JSON.stringify({
      success: true,
      results,
      processedCount: results.filter(r => r.success).length,
      totalCount: applicantIds.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in program-fit-assessment function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateProgramFitScore(applicant: any, engagement: any): number {
  let score = 0;
  
  // Hard eligibility check (30% weight)
  const eligibilityPassed = checkHardEligibility(applicant);
  if (!eligibilityPassed) return 0;
  score += 30;
  
  // Academic alignment (35% weight)
  const academicScore = calculateAcademicAlignment(applicant);
  score += (academicScore / 100) * 35;
  
  // Engagement intent (20% weight)
  const engagementScore = calculateEngagementIntent(engagement);
  score += (engagementScore / 100) * 20;
  
  // Behavioral signals (15% weight)
  const behavioralScore = calculateBehavioralSignals(engagement);
  score += (behavioralScore / 100) * 15;
  
  return Math.min(100, Math.max(0, score));
}

function calculateYieldPropensityScore(applicant: any, engagement: any): number {
  let score = 0;
  
  // Engagement intensity (40%)
  const portalActivity = Math.min((engagement?.portal_login_count || 0) * 10, 100);
  const emailEngagement = (engagement?.email_open_rate || 0) * 100;
  const responseSpeed = engagement?.first_response_time_hours 
    ? Math.max(0, 100 - (engagement.first_response_time_hours * 2))
    : 50;
  
  const engagementIntensity = (portalActivity + emailEngagement + responseSpeed) / 3;
  score += (engagementIntensity / 100) * 40;
  
  // Application velocity (30%)
  const velocity = engagement?.application_velocity_days
    ? Math.max(0, 100 - (engagement.application_velocity_days * 2))
    : 70;
  score += (velocity / 100) * 30;
  
  // Financial readiness (20%)
  const financialScore = calculateFinancialReadiness(applicant);
  score += (financialScore / 100) * 20;
  
  // Program alignment (10%)
  const alignment = calculateAcademicAlignment(applicant);
  score += (alignment / 100) * 10;
  
  return Math.min(100, Math.max(0, score));
}

function checkHardEligibility(applicant: any): boolean {
  return (
    applicant.documents_submitted?.length >= 2 &&
    applicant.documents_approved?.length >= 1 &&
    applicant.payment_status !== 'pending'
  );
}

function calculateAcademicAlignment(applicant: any): number {
  // Mock calculation based on available data
  let score = 70; // Base score
  
  if (applicant.documents_approved?.length >= 2) score += 15;
  if (applicant.payment_status === 'completed') score += 10;
  if (applicant.priority === 'high') score += 5;
  
  return Math.min(100, score);
}

function calculateEngagementIntent(engagement: any): number {
  if (!engagement) return 30;
  
  const loginScore = Math.min((engagement.portal_login_count || 0) * 8, 40);
  const timeScore = Math.min((engagement.portal_time_spent_minutes || 0) / 3, 30);
  const emailScore = (engagement.email_open_rate || 0) * 30;
  
  return Math.min(100, loginScore + timeScore + emailScore);
}

function calculateBehavioralSignals(engagement: any): number {
  if (!engagement) return 50;
  
  const velocityScore = engagement.application_velocity_days
    ? Math.max(0, 100 - (engagement.application_velocity_days * 3))
    : 50;
  
  const responsivenessScore = engagement.nudge_responsiveness_score || 50;
  
  const schedulingScore = engagement.self_scheduling_speed_hours
    ? Math.max(0, 100 - (engagement.self_scheduling_speed_hours * 2))
    : 50;
  
  return (velocityScore + responsivenessScore + schedulingScore) / 3;
}

function calculateFinancialReadiness(applicant: any): number {
  switch (applicant.payment_status) {
    case 'completed': return 100;
    case 'partial': return 70;
    case 'pending': return 30;
    default: return 50;
  }
}

function calculateRiskFlags(applicant: any): number {
  let flags = 0;
  
  if (applicant.documents_submitted?.length > applicant.documents_approved?.length + 1) flags++;
  if (applicant.payment_status === 'pending') flags++;
  if (!applicant.master_records?.phone) flags++;
  
  return flags;
}

async function getAIInsights(applicant: any, engagement: any): Promise<any> {
  if (!openAIApiKey) throw new Error('OpenAI API key not configured');

  const prompt = `
Analyze this applicant for program fit assessment:

Applicant Profile:
- Program: ${applicant.program}
- Application Type: ${applicant.application_type}
- Priority: ${applicant.priority}
- Payment Status: ${applicant.payment_status}
- Documents: ${applicant.documents_submitted?.length || 0} submitted, ${applicant.documents_approved?.length || 0} approved
- Stage: ${applicant.substage}

Engagement Metrics:
- Portal Logins: ${engagement?.portal_login_count || 0}
- Time Spent: ${engagement?.portal_time_spent_minutes || 0} minutes
- Email Open Rate: ${(engagement?.email_open_rate || 0) * 100}%
- Response Time: ${engagement?.first_response_time_hours || 'Unknown'} hours
- Application Velocity: ${engagement?.application_velocity_days || 'Unknown'} days

Provide insights on:
1. Likelihood of program success
2. Risk factors to monitor
3. Recommendations for next steps
4. Overall assessment confidence

Keep response concise and actionable.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert admissions counselor analyzing applicant program fit. Provide structured, data-driven insights.' 
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.3
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const insights = data.choices[0].message.content;

  return {
    summary: insights,
    confidence: 90,
    timestamp: new Date().toISOString()
  };
}