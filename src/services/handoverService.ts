import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/lead";

export interface HandoverRequest {
  leadId: string;
  targetTeam: string;
  handoverReason: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  scheduledFor?: string;
}

export interface HandoverAnalytics {
  totalHandovers: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  averageProcessingTime: number;
  successRate: number;
}

export class HandoverService {
  
  static async createStudentFromLead(leadId: string) {
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) {
      throw new Error('Lead not found');
    }

    // Generate unique student ID
    const studentIdPrefix = lead.program_interest?.[0]?.substring(0, 3).toUpperCase() || 'STU';
    const timestamp = Date.now().toString().slice(-6);
    const studentId = `${studentIdPrefix}${timestamp}`;

    // Create student record with correct field names
    const studentData = {
      student_id: studentId,
      first_name: lead.first_name,
      last_name: lead.last_name,
      email: lead.email,
      phone: lead.phone || '',
      country: lead.country || '',
      state: lead.state || '',
      city: lead.city || '',
      program: lead.program_interest?.[0] || 'Undeclared',
      stage: 'APPLICATION_SUBMITTED',
      lead_score: lead.lead_score || 0,
      progress: 0,
      acceptance_likelihood: lead.ai_score || 0,
      risk_level: lead.priority === 'high' ? 'high' : 'low',
      user_id: lead.user_id
    };

    const { data: student, error } = await supabase
      .from('students')
      .insert(studentData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create student: ${error.message}`);
    }

    // Update lead status
    await supabase
      .from('leads')
      .update({
        status: 'converted'
      })
      .eq('id', leadId);

    // Create activity log
    await supabase
      .from('lead_activities')
      .insert({
        lead_id: leadId,
        activity_type: 'conversion',
        activity_description: `Lead converted to student ${student.student_id}`,
        activity_data: { student_id: student.id },
        performed_by: (await supabase.auth.getUser()).data.user?.id
      });

    return student;
  }

  static async checkLeadQualification(leadId: string) {
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) {
      throw new Error('Lead not found');
    }

    const missingRequirements: string[] = [];
    const recommendations: string[] = [];
    let qualificationScore = 0;

    // Check lead score
    if ((lead.lead_score || 0) >= 70) {
      qualificationScore += 30;
    } else {
      missingRequirements.push('Lead score below 70');
      recommendations.push('Increase engagement through targeted communication');
    }

    // Check engagement (based on activities)
    const { data: activities } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const engagementScore = Math.min(100, (activities?.length || 0) * 15);
    if (engagementScore >= 60) {
      qualificationScore += 25;
    } else {
      missingRequirements.push('Insufficient recent engagement');
      recommendations.push('Schedule follow-up calls or meetings');
    }

    // Check status progression
    if (['qualified', 'nurturing'].includes(lead.status)) {
      qualificationScore += 20;
    } else {
      missingRequirements.push('Lead status not qualified');
      recommendations.push('Qualify lead through discovery process');
    }

    // Check time in pipeline
    const daysInPipeline = Math.floor(
      (Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysInPipeline >= 7) {
      qualificationScore += 15;
    }

    // Check program interest
    if (lead.program_interest && lead.program_interest.length > 0) {
      qualificationScore += 10;
    } else {
      missingRequirements.push('No program interest specified');
      recommendations.push('Conduct program discovery session');
    }

    const isQualified = qualificationScore >= 80 && missingRequirements.length === 0;

    return {
      isQualified,
      qualificationScore,
      missingRequirements,
      recommendations
    };
  }

  static async getHandoverQueue() {
    // Get leads ready for conversion
    const { data: qualifiedLeads } = await supabase
      .from('leads')
      .select('*')
      .in('status', ['qualified', 'nurturing'])
      .gte('lead_score', 70)
      .order('created_at', { ascending: true });

    const queue = [];
    
    for (const lead of qualifiedLeads || []) {
      const qualification = await this.checkLeadQualification(lead.id);
      if (qualification.isQualified) {
        queue.push({
          ...lead,
          qualification
        });
      }
    }

    return queue;
  }

  static async processAutomaticConversions() {
    const queue = await this.getHandoverQueue();
    const processed = [];

    for (const lead of queue) {
      try {
        const student = await this.createStudentFromLead(lead.id);
        processed.push({
          leadId: lead.id,
          studentId: student.id,
          success: true
        });
      } catch (error) {
        console.error(`Failed to convert lead ${lead.id}:`, error);
        processed.push({
          leadId: lead.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return processed;
  }

  static async getConversionAnalytics(dateRange?: { start: Date; end: Date }) {
    let query = supabase
      .from('lead_activities')
      .select('*')
      .eq('activity_type', 'conversion');

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString());
    }

    const { data: conversions } = await query;

    if (!conversions) return null;

    return {
      totalConversions: conversions.length,
      conversionRate: this.calculateConversionRate(conversions),
      averageTimeToConversion: this.calculateAverageTimeToConversion(conversions),
      successfulHandovers: conversions.filter(c => {
        const data = c.activity_data as any;
        return data?.success !== false;
      }).length
    };
  }

  private static calculateConversionRate(conversions: any[]): number {
    // This would need total leads in the same period for accurate calculation
    return conversions.length > 0 ? 85 : 0; // Placeholder
  }

  private static calculateAverageTimeToConversion(conversions: any[]): number {
    // This would calculate based on lead creation to conversion time
    return 14; // Placeholder - 14 days average
  }
}