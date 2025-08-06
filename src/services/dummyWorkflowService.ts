export class DummyWorkflowService {
  static async createDummyWorkflows(): Promise<void> {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      'https://rpxygdaimdiarjpfmswl.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJweHlnZGFpbWRpYXJqcGZtc3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTY1MDcsImV4cCI6MjA2OTQ5MjUwN30.sR7gSV1I9CCtibU6sdk5FRH6r5m9Y1ZGrQ6ivRhNEcM'
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const workflows = [
      {
        name: "New Lead Welcome Sequence",
        description: "Automated welcome email series for new leads with program information and next steps",
        trigger_type: "lead_created",
        trigger_config: { conditions: { source: ["website", "referral"] } },
        is_active: true,
        user_id: user.id
      },
      {
        name: "Application Follow-up Campaign", 
        description: "Nurture sequence for leads who have started but not completed their application",
        trigger_type: "lead_status_change",
        trigger_config: { from_status: "new", to_status: "application_started" },
        is_active: true,
        user_id: user.id
      },
      {
        name: "Document Submission Reminder",
        description: "Automated reminders for required document submissions with deadline tracking", 
        trigger_type: "program_application",
        trigger_config: { event: "documents_required" },
        is_active: true,
        user_id: user.id
      },
      {
        name: "Interview Scheduling Workflow",
        description: "Automated interview invitation and scheduling process for qualified applicants",
        trigger_type: "lead_status_change", 
        trigger_config: { from_status: "application_review", to_status: "interview_required" },
        is_active: true,
        user_id: user.id
      },
      {
        name: "Payment Reminder Campaign",
        description: "Gentle payment reminders with multiple touchpoints and escalation paths",
        trigger_type: "time_based",
        trigger_config: { schedule: "daily", conditions: { payment_status: "overdue" } },
        is_active: true,
        user_id: user.id
      },
      {
        name: "Pre-Enrollment Preparation", 
        description: "Comprehensive onboarding sequence for enrolled students before program start",
        trigger_type: "lead_status_change",
        trigger_config: { from_status: "accepted", to_status: "enrolled" },
        is_active: true,
        user_id: user.id
      },
      {
        name: "Re-engagement Campaign",
        description: "Win-back sequence for leads who have gone cold or inactive",
        trigger_type: "time_based",
        trigger_config: { schedule: "weekly", conditions: { last_contact: "> 30 days" } },
        is_active: false,
        user_id: user.id
      },
      {
        name: "Scholarship Application Reminder",
        description: "Targeted reminders for scholarship opportunities and deadlines", 
        trigger_type: "time_based",
        trigger_config: { schedule: "weekly", conditions: { scholarship_eligible: true } },
        is_active: true,
        user_id: user.id
      }
    ];

    const { error } = await supabase.from('workflows').insert(workflows);
    if (error) throw error;
  }

  static getDummyWorkflowCount(): number {
    return 8;
  }
}