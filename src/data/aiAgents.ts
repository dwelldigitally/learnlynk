import { AIAgent } from '@/types/chatbot';
import financialAidSpecialistPhoto from '@/assets/agents/financial-aid-specialist.jpg';
import admissionsCounselorPhoto from '@/assets/agents/admissions-counselor.jpg';
import academicAdvisorPhoto from '@/assets/agents/academic-advisor.jpg';
import techSupportPhoto from '@/assets/agents/tech-support.jpg';

export const AI_AGENTS: AIAgent[] = [
  {
    id: 'finance',
    name: 'Sarah Chen',
    description: 'AI Financial Advisor - Get help with tuition, payments, scholarships, and financial aid',
    avatar: financialAidSpecialistPhoto,
    color: 'hsl(var(--chart-1))',
    capabilities: [
      'Payment plans and options',
      'Scholarship opportunities',
      'Financial aid applications',
      'Tuition breakdowns',
      'Payment status updates',
      'Budget planning assistance'
    ],
    greeting: "Hi! I'm Sarah, your AI Financial Advisor. I can help you with payments, scholarships, financial aid, and all money-related questions. How can I assist you today?"
  },
  {
    id: 'admissions',
    name: 'Marcus Rodriguez',
    description: 'AI Admissions Counselor - Application status, program info, and admission requirements',
    avatar: admissionsCounselorPhoto,
    color: 'hsl(var(--chart-2))',
    capabilities: [
      'Application status updates',
      'Program information',
      'Admission requirements',
      'Document submission help',
      'Deadline reminders',
      'Next steps guidance'
    ],
    greeting: "Welcome! I'm Marcus, your AI Admissions Counselor. I can help you with your application, program information, requirements, and guide you through the admission process. What would you like to know?"
  },
  {
    id: 'student-services',
    name: 'Emily Watson',
    description: 'AI Student Services Coordinator - Campus life, housing, events, and student support resources',
    avatar: academicAdvisorPhoto,
    color: 'hsl(var(--chart-3))',
    capabilities: [
      'Housing assistance',
      'Campus events',
      'Student resources',
      'Orientation information',
      'Campus facilities',
      'Student support services'
    ],
    greeting: "Hello! I'm Emily, your AI Student Services Coordinator. From housing and meal plans to campus events and resources, I'll make sure you have everything you need. How can I help?"
  },
  {
    id: 'academic-support',
    name: 'Dr. James Park',
    description: 'AI Academic Advisor - Course planning, academic guidance, and study resources',
    avatar: academicAdvisorPhoto,
    color: 'hsl(var(--chart-4))',
    capabilities: [
      'Course selection guidance',
      'Academic planning',
      'Study resources',
      'Advisor appointments',
      'Degree requirements',
      'Academic support services'
    ],
    greeting: "Hi there! I'm Dr. James Park, your AI Academic Advisor. I can help you plan your courses, understand degree requirements, connect you with tutoring resources, and ensure your academic success. What do you need help with?"
  },
  {
    id: 'general',
    name: 'Alex Kim',
    description: 'AI General Assistant - General questions and connecting you with the right specialist',
    avatar: techSupportPhoto,
    color: 'hsl(var(--chart-5))',
    capabilities: [
      'General information',
      'Connecting with specialists',
      'Basic questions',
      'Navigation help',
      'Quick answers',
      'Direction to resources'
    ],
    greeting: "Hello! I'm Alex, your AI General Assistant. I can help with basic questions or connect you with specialized advisors for finance, admissions, student services, or academic support. How can I help you today?"
  }
];

export const getAgent = (id: string): AIAgent => {
  return AI_AGENTS.find(agent => agent.id === id) || AI_AGENTS[4]; // Default to Alex Kim (general)
};

export const getAgentByCapability = (query: string): AIAgent => {
  const queryLower = query.toLowerCase();
  
  // Finance keywords
  if (queryLower.includes('payment') || queryLower.includes('tuition') || 
      queryLower.includes('scholarship') || queryLower.includes('financial') ||
      queryLower.includes('money') || queryLower.includes('fee')) {
    return AI_AGENTS[0]; // Sarah Chen - Finance
  }
  
  // Admissions keywords
  if (queryLower.includes('application') || queryLower.includes('admission') ||
      queryLower.includes('program') || queryLower.includes('requirement') ||
      queryLower.includes('deadline') || queryLower.includes('status')) {
    return AI_AGENTS[1]; // Marcus Rodriguez - Admissions
  }
  
  // Student services keywords
  if (queryLower.includes('housing') || queryLower.includes('dorm') ||
      queryLower.includes('event') || queryLower.includes('campus') ||
      queryLower.includes('orientation') || queryLower.includes('meal')) {
    return AI_AGENTS[2]; // Emily Watson - Student Services
  }
  
  // Academic support keywords
  if (queryLower.includes('course') || queryLower.includes('class') ||
      queryLower.includes('academic') || queryLower.includes('study') ||
      queryLower.includes('advisor') || queryLower.includes('degree')) {
    return AI_AGENTS[3]; // Dr. James Park - Academic Support
  }
  
  return AI_AGENTS[4]; // Alex Kim - General
};