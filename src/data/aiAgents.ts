import { AIAgent } from '@/types/chatbot';

export const AI_AGENTS: AIAgent[] = [
  {
    id: 'finance',
    name: 'Financial Advisor',
    description: 'Get help with tuition, payments, scholarships, and financial aid',
    avatar: '💰',
    color: 'hsl(var(--chart-1))',
    capabilities: [
      'Payment plans and options',
      'Scholarship opportunities',
      'Financial aid applications',
      'Tuition breakdowns',
      'Payment status updates',
      'Budget planning assistance'
    ],
    greeting: "Hi! I'm your Financial Advisor. I can help you with payments, scholarships, financial aid, and all money-related questions. How can I assist you today?"
  },
  {
    id: 'admissions',
    name: 'Admissions Counselor',
    description: 'Application status, program info, and admission requirements',
    avatar: '📚',
    color: 'hsl(var(--chart-2))',
    capabilities: [
      'Application status updates',
      'Program information',
      'Admission requirements',
      'Document submission help',
      'Deadline reminders',
      'Next steps guidance'
    ],
    greeting: "Welcome! I'm your Admissions Counselor. I can help you with your application, program information, requirements, and guide you through the admission process. What would you like to know?"
  },
  {
    id: 'student-services',
    name: 'Student Services',
    description: 'Campus life, housing, events, and student support resources',
    avatar: '🏫',
    color: 'hsl(var(--chart-3))',
    capabilities: [
      'Housing assistance',
      'Campus events',
      'Student resources',
      'Orientation information',
      'Campus facilities',
      'Student support services'
    ],
    greeting: "Hello! I'm here to help with all aspects of student life. From housing and meal plans to campus events and resources, I'll make sure you have everything you need. How can I help?"
  },
  {
    id: 'academic-support',
    name: 'Academic Advisor',
    description: 'Course planning, academic guidance, and study resources',
    avatar: '🎓',
    color: 'hsl(var(--chart-4))',
    capabilities: [
      'Course selection guidance',
      'Academic planning',
      'Study resources',
      'Advisor appointments',
      'Degree requirements',
      'Academic support services'
    ],
    greeting: "Hi there! I'm your Academic Advisor. I can help you plan your courses, understand degree requirements, connect you with tutoring resources, and ensure your academic success. What do you need help with?"
  },
  {
    id: 'general',
    name: 'General Assistant',
    description: 'General questions and connecting you with the right specialist',
    avatar: '🤖',
    color: 'hsl(var(--chart-5))',
    capabilities: [
      'General information',
      'Connecting with specialists',
      'Basic questions',
      'Navigation help',
      'Quick answers',
      'Direction to resources'
    ],
    greeting: "Hello! I'm your General Assistant. I can help with basic questions or connect you with specialized agents for finance, admissions, student services, or academic support. How can I help you today?"
  }
];

export const getAgent = (id: string): AIAgent => {
  return AI_AGENTS.find(agent => agent.id === id) || AI_AGENTS[4]; // Default to general
};

export const getAgentByCapability = (query: string): AIAgent => {
  const queryLower = query.toLowerCase();
  
  // Finance keywords
  if (queryLower.includes('payment') || queryLower.includes('tuition') || 
      queryLower.includes('scholarship') || queryLower.includes('financial') ||
      queryLower.includes('money') || queryLower.includes('fee')) {
    return AI_AGENTS[0]; // Finance
  }
  
  // Admissions keywords
  if (queryLower.includes('application') || queryLower.includes('admission') ||
      queryLower.includes('program') || queryLower.includes('requirement') ||
      queryLower.includes('deadline') || queryLower.includes('status')) {
    return AI_AGENTS[1]; // Admissions
  }
  
  // Student services keywords
  if (queryLower.includes('housing') || queryLower.includes('dorm') ||
      queryLower.includes('event') || queryLower.includes('campus') ||
      queryLower.includes('orientation') || queryLower.includes('meal')) {
    return AI_AGENTS[2]; // Student Services
  }
  
  // Academic support keywords
  if (queryLower.includes('course') || queryLower.includes('class') ||
      queryLower.includes('academic') || queryLower.includes('study') ||
      queryLower.includes('advisor') || queryLower.includes('degree')) {
    return AI_AGENTS[3]; // Academic Support
  }
  
  return AI_AGENTS[4]; // General
};