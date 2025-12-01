// Comprehensive dummy data for all student portal sections

export const dummyStudentProfile = {
  id: "WCC-1047859",
  firstName: "Tushar",
  lastName: "Malhotra",
  email: "tushar.malhotra@example.com",
  phone: "+1 (604) 555-0123",
  dateOfBirth: "1998-05-15",
  nationality: "Indian",
  address: {
    street: "123 Fraser Street",
    city: "Surrey",
    province: "BC", 
    postalCode: "V3T 2M1",
    country: "Canada"
  },
  emergencyContact: {
    name: "Priya Malhotra",
    relationship: "Sister",
    phone: "+1 (604) 555-0124",
    email: "priya.malhotra@example.com"
  },
  avatar: "/lovable-uploads/3c634d34-1dd4-4d6c-a352-49362db4fc12.png"
};

export const dummyApplications = [
  {
    id: "HCA-1047859",
    program: "Health Care Assistant",
    submissionDate: "2025-01-15",
    status: "Under Review",
    stage: "DOCUMENT_APPROVAL",
    progress: 75,
    intakeDate: "2025-03-15",
    advisor: {
      name: "Nicole Ye",
      email: "nicole@wcc.ca",
      phone: "(604) 594-3500",
      avatar: "/assets/advisor-nicole.jpg"
    },
    documents: [
      { name: "Official Transcripts", status: "approved", uploadDate: "2025-01-14" },
      { name: "Photo ID", status: "approved", uploadDate: "2025-01-14" },
      { name: "Criminal Record Check", status: "approved", uploadDate: "2025-01-15" },
      { name: "Immunization Records", status: "under-review", uploadDate: "2025-01-16" },
      { name: "First Aid Certificate", status: "rejected", uploadDate: "2025-01-14", comments: "Certificate has expired. Please upload current certification." }
    ],
    timeline: [
      { date: "2025-01-15", event: "Application Submitted", status: "completed" },
      { date: "2025-01-16", event: "Documents Under Review", status: "completed" },
      { date: "2025-01-17", event: "Document Issues Found", status: "current" },
      { date: "TBD", event: "Fee Payment", status: "upcoming" },
      { date: "TBD", event: "Final Approval", status: "upcoming" }
    ]
  },
  {
    id: "EA-1047860",
    program: "Education Assistant",
    submissionDate: "2025-01-10",
    status: "Fee Payment Required",
    stage: "FEE_PAYMENT",
    progress: 85,
    intakeDate: "2025-02-05",
    advisor: {
      name: "Sarah Johnson",
      email: "sarah@wcc.ca",
      phone: "(604) 594-3501"
    },
    documents: [
      { name: "Official Transcripts", status: "approved", uploadDate: "2025-01-08" },
      { name: "Photo ID", status: "approved", uploadDate: "2025-01-08" },
      { name: "Criminal Record Check", status: "approved", uploadDate: "2025-01-09" },
      { name: "Resume", status: "approved", uploadDate: "2025-01-09" }
    ],
    timeline: [
      { date: "2025-01-10", event: "Application Submitted", status: "completed" },
      { date: "2025-01-11", event: "Documents Reviewed", status: "completed" },
      { date: "2025-01-12", event: "Documents Approved", status: "completed" },
      { date: "2025-01-17", event: "Fee Payment Required", status: "current" },
      { date: "TBD", event: "Final Approval", status: "upcoming" }
    ]
  }
];

export const dummyMessages = [
  {
    id: "msg-001",
    threadId: "thread-hca-001",
    subject: "Document Review Update - Health Care Assistant",
    from: {
      name: "Nicole Ye",
      role: "Senior Admissions Advisor",
      avatar: "/assets/advisor-nicole.jpg"
    },
    content: `Dear Tushar,

I have reviewed your submitted documents for the Health Care Assistant program. Here's the status update:

✅ Official Transcripts - Approved
✅ Photo ID - Approved  
✅ Criminal Record Check - Approved
⏳ Immunization Records - Under Review
❌ First Aid Certificate - Needs Attention

Your First Aid certificate has expired. Please upload a current First Aid certificate to proceed with your application. You can obtain this from any certified provider like Red Cross or St. John Ambulance.

The immunization records are being verified with our medical team. You should receive an update within 2-3 business days.

Please upload the new First Aid certificate at your earliest convenience to avoid any delays in processing your application.

Best regards,
Nicole Ye
Senior Admissions Advisor
Western Community College`,
    timestamp: "2025-01-17T10:30:00Z",
    isRead: false,
    priority: "high",
    attachments: []
  },
  {
    id: "msg-002",
    threadId: "thread-ea-001",
    subject: "Fee Payment Required - Education Assistant",
    from: {
      name: "Sarah Johnson",
      role: "Admissions Coordinator",
      avatar: "/assets/advisor-sarah.jpg"
    },
    content: `Dear Tushar,

Congratulations! Your documents for the Education Assistant program have been approved.

The next step is to pay your application fee of $200.00 CAD to secure your spot for the February 5, 2025 intake.

Payment Options:
• Online payment via student portal
• Bank transfer
• Credit/Debit card

Payment deadline: January 24, 2025

Once payment is received, you will receive your official acceptance letter and program orientation details.

Best regards,
Sarah Johnson`,
    timestamp: "2025-01-17T14:15:00Z",
    isRead: false,
    priority: "medium",
    attachments: []
  },
  {
    id: "msg-003",
    threadId: "thread-welcome",
    subject: "Welcome to Western Community College!",
    from: {
      name: "WCC Admissions Office",
      role: "Automated System",
      avatar: "/assets/wcc-logo.png"
    },
    content: `Welcome to Western Community College, Tushar!

We're excited to have you join our community. Your student portal gives you access to:

📚 Application tracking
💬 Direct communication with advisors
📄 Document upload and management
💰 Fee payment and financial aid
📅 Academic planning and course information

Need help? Our support team is available:
• Email: support@wcc.ca
• Phone: (604) 594-3500
• Live chat: Available 9 AM - 5 PM PT

Best regards,
WCC Student Services Team`,
    timestamp: "2025-01-15T09:00:00Z",
    isRead: true,
    priority: "low",
    attachments: []
  }
];

/**
 * @deprecated Documents should be fetched from the database via useStudentDocuments hook
 * This is kept for backward compatibility but should not be used for new features
 */
export const dummyDocuments: any[] = [];

export const dummyFinancialAid = [
  {
    id: "grant-001",
    type: "grant",
    name: "BC Student Grant",
    amount: 3500,
    status: "approved",
    description: "Provincial grant for full-time students",
    requirements: ["BC residency", "Financial need assessment", "Full-time enrollment"],
    disbursementDate: "2025-03-01"
  },
  {
    id: "scholarship-001",
    type: "scholarship", 
    name: "Academic Excellence Scholarship",
    amount: 1200,
    status: "awarded",
    description: "Merit-based scholarship for high academic achievement",
    requirements: ["3.5+ GPA", "Academic transcript", "Community involvement"],
    disbursementDate: "2025-02-15"
  },
  {
    id: "loan-001",
    type: "loan",
    name: "Canada Student Loan",
    amount: 8500,
    status: "approved",
    description: "Federal student loan with favorable repayment terms",
    requirements: ["Canadian citizenship/PR", "Financial assessment", "Enrollment confirmation"],
    disbursementDate: "2025-03-01",
    repaymentTerms: "6 months after graduation"
  },
  {
    id: "work-study-001",
    type: "work-study",
    name: "Campus Work-Study Program",
    amount: 2000,
    status: "available",
    description: "Part-time work opportunities on campus",
    requirements: ["Financial need", "Academic standing", "Work availability"],
    hoursPerWeek: 15
  }
];

export const dummyFees = [
  {
    id: "fee-hca-001",
    type: "Application Fee",
    program: "Health Care Assistant",
    amount: 250.00,
    currency: "CAD",
    dueDate: "2025-02-15",
    status: "pending",
    description: "Non-refundable application processing fee",
    breakdown: [
      { item: "Document processing", amount: 150.00 },
      { item: "Application review", amount: 75.00 },
      { item: "Administrative fee", amount: 25.00 }
    ]
  },
  {
    id: "fee-ea-001",
    type: "Application Fee",
    program: "Education Assistant",
    amount: 200.00,
    currency: "CAD",
    dueDate: "2025-01-24",
    status: "due",
    description: "Non-refundable application processing fee",
    breakdown: [
      { item: "Document processing", amount: 125.00 },
      { item: "Application review", amount: 50.00 },
      { item: "Administrative fee", amount: 25.00 }
    ]
  }
];

export const dummyAcademicPlan = {
  program: "Health Care Assistant",
  totalCredits: 30,
  estimatedCompletionDate: "2025-09-15",
  currentGPA: 3.7,
  courses: [
    {
      code: "HCA101",
      name: "Introduction to Health Care",
      credits: 3,
      grade: "A-",
      status: "completed",
      semester: "Fall 2024",
      instructor: "Dr. Sarah Chen"
    },
    {
      code: "HCA102",
      name: "Human Anatomy & Physiology",
      credits: 4,
      grade: "B+",
      status: "completed",
      semester: "Fall 2024",
      instructor: "Prof. Michael Rodriguez"
    },
    {
      code: "HCA201",
      name: "Personal Care Skills",
      credits: 3,
      status: "current",
      semester: "Spring 2025",
      instructor: "Linda Thompson, RN"
    },
    {
      code: "HCA202",
      name: "Communication in Healthcare",
      credits: 2,
      status: "upcoming",
      semester: "Spring 2025",
      instructor: "Dr. Jennifer Walsh"
    },
    {
      code: "HCA301",
      name: "Mental Health Support",
      credits: 3,
      status: "upcoming",
      semester: "Summer 2025",
      instructor: "Dr. Robert Kim"
    },
    {
      code: "HCA302",
      name: "Clinical Practicum",
      credits: 5,
      status: "upcoming",
      semester: "Summer 2025",
      instructor: "Various Clinical Supervisors"
    }
  ],
  prerequisites: [
    {
      name: "First Aid/CPR Certification",
      status: "expired",
      required: true,
      dueDate: "2025-01-30"
    },
    {
      name: "Criminal Record Check",
      status: "completed",
      required: true,
      expiryDate: "2025-09-15"
    },
    {
      name: "Immunization Records",
      status: "pending",
      required: true,
      dueDate: "2025-02-01"
    },
    {
      name: "TB Test",
      status: "upcoming",
      required: true,
      dueDate: "2025-02-15"
    }
  ]
};

export const dummyCareerServices = {
  upcomingEvents: [
    {
      id: "event-001",
      title: "Healthcare Career Fair 2025",
      date: "2025-03-15",
      time: "10:00 AM - 4:00 PM",
      location: "WCC Surrey Campus - Main Hall",
      description: "Connect with leading healthcare employers",
      registeredCount: 147,
      maxCapacity: 200,
      type: "career-fair",
      employers: [
        "Fraser Health Authority",
        "Vancouver Coastal Health",
        "Retirement Concepts",
        "Chartwell Retirement Residences",
        "Revera Inc."
      ]
    },
    {
      id: "event-002",
      title: "Resume Writing Workshop",
      date: "2025-02-08",
      time: "2:00 PM - 4:00 PM",
      location: "Virtual",
      description: "Learn to write compelling resumes for healthcare roles",
      registeredCount: 23,
      maxCapacity: 30,
      type: "workshop"
    },
    {
      id: "event-003",
      title: "Interview Skills for Healthcare",
      date: "2025-02-22",
      time: "1:00 PM - 3:00 PM",
      location: "WCC Career Services Center",
      description: "Practice interview techniques specific to healthcare positions",
      registeredCount: 18,
      maxCapacity: 25,
      type: "workshop"
    }
  ],
  jobOpportunities: [
    {
      id: "job-001",
      title: "Health Care Assistant",
      company: "Fraser Health Authority",
      location: "Surrey, BC",
      type: "Full-time",
      salary: "$22.50 - $26.75/hour",
      deadline: "2025-02-28",
      description: "Provide direct patient care in acute care settings",
      requirements: ["HCA Certificate", "Valid First Aid/CPR", "Criminal Record Check"]
    },
    {
      id: "job-002",
      title: "Resident Care Aide",
      company: "Retirement Concepts",
      location: "Langley, BC",
      type: "Part-time",
      salary: "$20.00 - $24.00/hour",
      deadline: "2025-03-15",
      description: "Support residents in assisted living facility",
      requirements: ["HCA Certificate", "Experience preferred", "Valid driver's license"]
    },
    {
      id: "job-003",
      title: "Community Health Worker",
      company: "Vancouver Coastal Health",
      location: "Vancouver, BC",
      type: "Contract",
      salary: "$25.00 - $28.00/hour",
      deadline: "2025-03-01",
      description: "Provide health services in community settings",
      requirements: ["HCA Certificate", "Community experience", "Bilingual asset"]
    }
  ],
  resources: [
    {
      title: "Healthcare Job Search Guide",
      type: "PDF",
      description: "Comprehensive guide to finding healthcare jobs in BC",
      downloadUrl: "#"
    },
    {
      title: "Salary Expectations in Healthcare",
      type: "Article",
      description: "Current salary ranges for healthcare positions",
      downloadUrl: "#"
    },
    {
      title: "Professional Development Opportunities",
      type: "Video",
      description: "Continuing education options for healthcare workers",
      downloadUrl: "#"
    }
  ]
};

export const dummyNewsAndEvents = [
  {
    id: "news-001",
    type: "news",
    title: "WCC Graduates Achieve 96% Employment Rate",
    excerpt: "Latest employment statistics show strong job market success for WCC graduates",
    content: `Western Community College is proud to announce that 96% of our recent graduates have secured employment within six months of graduation...`,
    author: "WCC Communications Team",
    publishDate: "2025-01-15",
    category: "Achievement",
    image: "/assets/news-employment.jpg",
    readTime: "3 min read"
  },
  {
    id: "news-002",
    type: "news",
    title: "New Partnership with Fraser Health Authority",
    excerpt: "Expanded clinical placement opportunities for Health Care Assistant students",
    content: `We're excited to announce our expanded partnership with Fraser Health Authority, providing more clinical placement opportunities...`,
    author: "Dean Sarah Mitchell",
    publishDate: "2025-01-12",
    category: "Partnership",
    image: "/assets/news-partnership.jpg",
    readTime: "2 min read"
  },
  {
    id: "event-004",
    type: "event",
    title: "Student Success Workshop Series",
    description: "Weekly workshops on study skills, time management, and stress reduction",
    date: "2025-02-05",
    time: "3:00 PM - 4:30 PM",
    location: "WCC Student Center",
    category: "Workshop",
    registrationRequired: true
  },
  {
    id: "event-005",
    type: "event",
    title: "Health & Wellness Fair",
    description: "Learn about maintaining physical and mental health during your studies",
    date: "2025-02-20",
    time: "11:00 AM - 3:00 PM",
    location: "WCC Main Campus",
    category: "Health",
    registrationRequired: false
  }
];

export const dummyCampusLife = {
  facilities: [
    {
      name: "Modern Library & Learning Commons",
      description: "24/7 access to digital resources, study spaces, and research support",
      features: ["Silent study areas", "Group collaboration rooms", "Computer lab", "Research assistance"],
      image: "/assets/library.jpg"
    },
    {
      name: "Student Recreation Center",
      description: "Full-service fitness facility and recreational activities",
      features: ["Fitness equipment", "Group exercise classes", "Basketball court", "Wellness programs"],
      image: "/assets/recreation.jpg"
    },
    {
      name: "Healthcare Simulation Labs", 
      description: "State-of-the-art facilities for hands-on healthcare training",
      features: ["Patient simulation mannequins", "Medical equipment", "Clinical skills training", "Supervised practice"],
      image: "/assets/simulation-lab.jpg"
    }
  ],
  clubs: [
    {
      name: "Healthcare Students Association",
      description: "Professional development and networking for healthcare students",
      members: 45,
      nextMeeting: "2025-02-10"
    },
    {
      name: "International Students Club",
      description: "Support and social activities for international students",
      members: 32,
      nextMeeting: "2025-02-12"
    },
    {
      name: "Student Wellness Committee",
      description: "Promoting mental health and wellness on campus",
      members: 28,
      nextMeeting: "2025-02-15"
    }
  ],
  services: [
    {
      name: "Academic Support Center",
      description: "Tutoring, study groups, and academic coaching",
      hours: "Monday-Friday 9 AM - 5 PM",
      location: "Building A, Room 150"
    },
    {
      name: "Student Counseling Services",
      description: "Mental health support and personal counseling",
      hours: "Monday-Friday 9 AM - 4 PM",
      location: "Student Services Building"
    },
    {
      name: "Career Development Center",
      description: "Job search assistance and career planning",
      hours: "Monday-Friday 8:30 AM - 4:30 PM",
      location: "Building B, Room 200"
    }
  ]
};