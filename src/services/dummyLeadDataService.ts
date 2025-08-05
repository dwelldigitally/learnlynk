import { LeadCommunication, LeadTask, LeadNote, CommunicationType, CommunicationDirection, TaskType, TaskPriority, NoteType } from '@/types/leadEnhancements';

export class DummyLeadDataService {
  
  static generateDummyCommunications(leadId: string): LeadCommunication[] {
    const communications: LeadCommunication[] = [
      {
        id: `comm-1-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        type: 'email' as CommunicationType,
        direction: 'outbound' as CommunicationDirection,
        status: 'completed',
        subject: 'Welcome to Your Educational Journey!',
        content: 'Thank you for your interest in our programs. I wanted to personally reach out to discuss your academic goals and how we can help you achieve them. Our team is here to guide you through every step of the application process.',
        communication_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `comm-2-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        type: 'phone' as CommunicationType,
        direction: 'inbound' as CommunicationDirection,
        status: 'completed',
        content: 'Student called asking about admission requirements and scholarship opportunities. Very interested in the Computer Science program. Discussed application timeline and next steps.',
        communication_date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
        created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `comm-3-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-2',
        type: 'email' as CommunicationType,
        direction: 'inbound' as CommunicationDirection,
        status: 'completed',
        subject: 'Re: Program Information Request',
        content: 'Hi, thank you for the detailed information about the programs. I am particularly interested in the Master\'s in Data Science. Could you please send me more details about the curriculum and internship opportunities?',
        communication_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `comm-4-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        type: 'meeting' as CommunicationType,
        direction: 'outbound' as CommunicationDirection,
        status: 'scheduled',
        subject: 'Virtual Campus Tour & Program Discussion',
        content: 'Scheduled a virtual campus tour and one-on-one consultation to discuss program options, admission requirements, and answer any specific questions.',
        communication_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
        scheduled_for: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `comm-5-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        type: 'sms' as CommunicationType,
        direction: 'outbound' as CommunicationDirection,
        status: 'completed',
        content: 'Hi! Just a friendly reminder about our virtual meeting tomorrow at 2 PM. Looking forward to discussing your academic goals with you!',
        communication_date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    return communications;
  }

  static generateDummyTasks(leadId: string): LeadTask[] {
    const tasks: LeadTask[] = [
      {
        id: `task-1-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        title: 'Send program brochure and application requirements',
        description: 'Email detailed program information including curriculum, fees, and admission requirements for Computer Science program.',
        task_type: 'email' as TaskType,
        priority: 'high' as TaskPriority,
        status: 'completed',
        assigned_to: 'dummy-user-1',
        due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `task-2-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        title: 'Follow up on scholarship inquiry',
        description: 'Provide detailed information about available scholarships and financial aid options. Include application deadlines and requirements.',
        task_type: 'follow_up' as TaskType,
        priority: 'medium' as TaskPriority,
        status: 'pending',
        assigned_to: 'dummy-user-1',
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `task-3-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-2',
        title: 'Schedule campus visit',
        description: 'Coordinate with student for in-person campus visit. Show facilities, labs, and arrange meeting with program director.',
        task_type: 'meeting' as TaskType,
        priority: 'medium' as TaskPriority,
        status: 'in_progress',
        assigned_to: 'dummy-user-2',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `task-4-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        title: 'Review application documents',
        description: 'Check submitted transcripts and personal statement. Ensure all required documents are complete and meet admission standards.',
        task_type: 'research' as TaskType,
        priority: 'urgent' as TaskPriority,
        status: 'pending',
        assigned_to: 'dummy-user-1',
        due_date: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `task-5-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        title: 'Call student to discuss concerns',
        description: 'Student mentioned concerns about program workload. Schedule call to address questions and provide reassurance.',
        task_type: 'call' as TaskType,
        priority: 'high' as TaskPriority,
        status: 'pending',
        assigned_to: 'dummy-user-1',
        due_date: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];

    return tasks;
  }

  static generateDummyNotes(leadId: string): LeadNote[] {
    const notes: LeadNote[] = [
      {
        id: `note-1-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        note_type: 'general' as NoteType,
        content: 'Student seems very motivated and well-prepared. Has strong academic background in mathematics and programming. Expressed interest in machine learning specialization.',
        is_private: false,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `note-2-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        note_type: 'qualification' as NoteType,
        content: 'GPA: 3.8/4.0, Bachelor\'s in Computer Engineering. Has 2 years work experience as software developer. Meets all admission requirements for MS in Computer Science.',
        is_private: false,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `note-3-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-2',
        note_type: 'interest' as NoteType,
        content: 'Primary interest in Data Science and AI. Asked specifically about research opportunities and thesis projects. Mentioned wanting to work in healthcare AI after graduation.',
        is_private: false,
        created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `note-4-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        note_type: 'objection' as NoteType,
        content: 'Concerned about program cost and time commitment while working full-time. Discussed part-time options and financial aid. Need to follow up with scholarship information.',
        is_private: true,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: `note-5-${leadId}`,
        lead_id: leadId,
        user_id: 'dummy-user-1',
        note_type: 'follow_up' as NoteType,
        content: 'Student is comparing with 2 other universities. Deadline for decision is end of this month. Need to schedule follow-up call next week to address any remaining questions.',
        is_private: false,
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];

    return notes;
  }
}