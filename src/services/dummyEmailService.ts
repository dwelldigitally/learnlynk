interface DummyEmail {
  id: string;
  from_name: string;
  from_email: string;
  subject: string;
  body_content: string;
  body_preview: string;
  received_datetime: string;
  is_read: boolean;
  has_attachments: boolean;
  importance: 'low' | 'normal' | 'high';
  status: 'new' | 'replied' | 'forwarded' | 'archived';
  ai_priority_score: number;
  ai_lead_match_confidence: number;
  ai_suggested_actions: Array<{
    type: string;
    description: string;
    confidence: number;
  }>;
  lead_match?: {
    name: string;
    score: number;
    program_interest: string[];
  };
  category: 'inquiry' | 'application' | 'follow_up' | 'complaint' | 'info_request';
}

export const generateDummyEmails = (): DummyEmail[] => {
  return [
    {
      id: '1',
      from_name: 'Sarah Johnson',
      from_email: 'sarah.johnson@email.com',
      subject: 'Inquiry about Data Science Masters Program',
      body_preview: 'Hi there, I am interested in your Data Science Masters program and would like to know more about the admission requirements...',
      body_content: `Hi there,

I am very interested in your Data Science Masters program and would like to know more about the admission requirements and application process.

I have a background in Computer Science with 3 years of experience in software development. I am particularly interested in machine learning and AI applications.

Could you please provide information about:
- Application deadlines
- Prerequisites 
- Tuition fees
- Scholarship opportunities

I am hoping to start in the Fall 2024 intake.

Best regards,
Sarah Johnson
Phone: (555) 123-4567`,
      received_datetime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      is_read: false,
      has_attachments: false,
      importance: 'high',
      status: 'new',
      ai_priority_score: 92,
      ai_lead_match_confidence: 85,
      ai_suggested_actions: [
        {
          type: 'send_program_brochure',
          description: 'Send Data Science program brochure and application guide',
          confidence: 95
        },
        {
          type: 'schedule_consultation',
          description: 'Offer 15-minute consultation call',
          confidence: 88
        },
        {
          type: 'add_to_nurture_campaign',
          description: 'Add to Data Science program nurture sequence',
          confidence: 92
        }
      ],
      lead_match: {
        name: 'Sarah Johnson',
        score: 85,
        program_interest: ['Data Science', 'Computer Science', 'AI/ML']
      },
      category: 'inquiry'
    },
    {
      id: '2',
      from_name: 'Michael Chen',
      from_email: 'm.chen.dev@gmail.com',
      subject: 'Application Status - MBA Program',
      body_preview: 'Hello, I submitted my MBA application last month (Application ID: MBA2024-1847) and wanted to check on the status...',
      body_content: `Hello,

I submitted my MBA application last month (Application ID: MBA2024-1847) and wanted to check on the status of my application.

I have uploaded all required documents including:
- Transcripts
- GMAT scores (720)
- Letters of recommendation
- Personal statement

Is there anything else needed from my end? When can I expect to hear back about the decision?

Thank you for your time.

Best regards,
Michael Chen
LinkedIn: linkedin.com/in/michaelchen-mba`,
      received_datetime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      is_read: true,
      has_attachments: true,
      importance: 'normal',
      status: 'replied',
      ai_priority_score: 78,
      ai_lead_match_confidence: 95,
      ai_suggested_actions: [
        {
          type: 'check_application_status',
          description: 'Verify application status in system',
          confidence: 98
        },
        {
          type: 'provide_timeline_update',
          description: 'Send standard timeline communication',
          confidence: 85
        }
      ],
      lead_match: {
        name: 'Michael Chen',
        score: 95,
        program_interest: ['MBA', 'Business Administration']
      },
      category: 'application'
    },
    {
      id: '3',
      from_name: 'Dr. Emily Rodriguez',
      from_email: 'e.rodriguez@university.edu',
      subject: 'Partnership Opportunity - Research Collaboration',
      body_preview: 'Dear Team, I hope this email finds you well. I am writing to explore potential partnership opportunities between our institutions...',
      body_content: `Dear Team,

I hope this email finds you well. I am writing to explore potential partnership opportunities between our institutions.

I am Dr. Emily Rodriguez, Professor of Biomedical Engineering at State University. We have been following your innovative programs in biotechnology and are impressed by your research output.

We would like to discuss:
- Joint research projects
- Student exchange programs  
- Shared laboratory facilities
- Co-teaching opportunities

Would you be available for a virtual meeting next week to discuss this further?

Best regards,
Dr. Emily Rodriguez
Professor of Biomedical Engineering
State University
Email: e.rodriguez@university.edu
Phone: (555) 987-6543`,
      received_datetime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      is_read: false,
      has_attachments: false,
      importance: 'high',
      status: 'new',
      ai_priority_score: 67,
      ai_lead_match_confidence: 45,
      ai_suggested_actions: [
        {
          type: 'forward_to_partnerships',
          description: 'Forward to Business Development team',
          confidence: 92
        },
        {
          type: 'schedule_meeting',
          description: 'Schedule partnership discussion meeting',
          confidence: 78
        }
      ],
      category: 'info_request'
    },
    {
      id: '4',
      from_name: 'Alex Kumar',
      from_email: 'alex.kumar.2024@outlook.com',
      subject: 'Unable to access student portal',
      body_preview: 'Hi Support Team, I am having trouble accessing my student portal. Every time I try to log in, I get an error message...',
      body_content: `Hi Support Team,

I am having trouble accessing my student portal. Every time I try to log in, I get an error message saying "Invalid credentials" even though I am sure my password is correct.

Student ID: CS2024-0892
Email: alex.kumar.2024@outlook.com

I have tried:
- Resetting my password (did not receive email)
- Clearing browser cache
- Using different browsers

This is urgent as I need to submit my assignment by tomorrow. Please help!

Thanks,
Alex Kumar
Computer Science Program - Year 2`,
      received_datetime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      is_read: false,
      has_attachments: false,
      importance: 'high',
      status: 'new',
      ai_priority_score: 88,
      ai_lead_match_confidence: 90,
      ai_suggested_actions: [
        {
          type: 'escalate_to_it',
          description: 'Forward to IT Support for urgent resolution',
          confidence: 95
        },
        {
          type: 'send_temp_access',
          description: 'Provide temporary portal access',
          confidence: 87
        },
        {
          type: 'check_student_status',
          description: 'Verify student enrollment status',
          confidence: 82
        }
      ],
      lead_match: {
        name: 'Alex Kumar',
        score: 90,
        program_interest: ['Computer Science']
      },
      category: 'complaint'
    },
    {
      id: '5',
      from_name: 'Jennifer Lopez',
      from_email: 'jlopez.finance@company.com',
      subject: 'Corporate Training Program Inquiry',
      body_preview: 'Good morning, I represent TechCorp Industries and we are looking for a corporate training partner for our employees...',
      body_content: `Good morning,

I represent TechCorp Industries and we are looking for a corporate training partner for our employees in the technology sector.

We have approximately 150 employees who would benefit from upskilling in:
- Data Analytics
- Digital Marketing
- Project Management
- Leadership Development

We are interested in:
- Custom curriculum development
- Flexible scheduling (evenings/weekends)
- On-site or virtual delivery options
- Certification programs

Budget range: $200,000 - $350,000 annually

Could we schedule a call to discuss your corporate training offerings?

Best regards,
Jennifer Lopez
Head of Learning & Development
TechCorp Industries
Direct: (555) 234-5678
jlopez.finance@company.com`,
      received_datetime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      is_read: true,
      has_attachments: false,
      importance: 'high',
      status: 'new',
      ai_priority_score: 94,
      ai_lead_match_confidence: 65,
      ai_suggested_actions: [
        {
          type: 'send_corporate_brochure',
          description: 'Send corporate training brochure and pricing',
          confidence: 96
        },
        {
          type: 'schedule_sales_call',
          description: 'Schedule call with Business Development',
          confidence: 93
        },
        {
          type: 'assign_to_corporate_team',
          description: 'Assign to Corporate Training specialist',
          confidence: 89
        }
      ],
      category: 'inquiry'
    },
    {
      id: '6',
      from_name: 'David Park',
      from_email: 'dpark.student@gmail.com',
      subject: 'Thank you for the scholarship!',
      body_preview: 'Dear Admissions Team, I wanted to express my heartfelt gratitude for awarding me the Merit Scholarship...',
      body_content: `Dear Admissions Team,

I wanted to express my heartfelt gratitude for awarding me the Merit Scholarship for the Engineering program.

This scholarship will make a tremendous difference in my ability to pursue my education without financial stress. I am committed to maintaining the highest academic standards and contributing positively to the university community.

I look forward to starting classes in September and making the most of this incredible opportunity.

Once again, thank you for believing in my potential.

Sincerely,
David Park
Incoming Engineering Student
Student ID: ENG2024-1205`,
      received_datetime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      is_read: false,
      has_attachments: false,
      importance: 'normal',
      status: 'new',
      ai_priority_score: 45,
      ai_lead_match_confidence: 88,
      ai_suggested_actions: [
        {
          type: 'send_welcome_package',
          description: 'Send orientation and welcome materials',
          confidence: 92
        },
        {
          type: 'add_to_student_success',
          description: 'Add to student success tracking program',
          confidence: 85
        }
      ],
      lead_match: {
        name: 'David Park',
        score: 88,
        program_interest: ['Engineering']
      },
      category: 'follow_up'
    }
  ];
};

export const getEmailsByCategory = (category?: string) => {
  const emails = generateDummyEmails();
  if (category) {
    return emails.filter(email => email.category === category);
  }
  return emails;
};

export const getHighPriorityEmails = () => {
  return generateDummyEmails().filter(email => email.ai_priority_score > 80);
};

export const getUnreadEmails = () => {
  return generateDummyEmails().filter(email => !email.is_read);
};