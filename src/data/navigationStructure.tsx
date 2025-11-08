import { 
  Users, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  Target, 
  Zap, 
  UserPlus, 
  Calendar,
  FileText,
  MapPin,
  BookOpen,
  ClipboardList,
  CalendarDays
} from 'lucide-react';

// Pages hidden in MVP mode
export const MVP_HIDDEN_PAGES = [
  '/admin/recruiters',
  '/admin/recruiter-applications',
  '/admin/practicum',
  '/admin/practicum/sites',
  '/admin/practicum/programs',
  '/admin/practicum/journeys',
  '/admin/practicum/assignments',
  '/admin/practicum/student-progress',
  '/admin/practicum/competency-tracker',
  '/admin/practicum/evaluation-center',
];

export const navigationStructure = {
  sections: [
    {
      id: 'leads-marketing',
      title: 'Leads & Marketing',
      description: 'Manage your lead generation and marketing campaigns',
      items: [
        { name: 'Leads', label: 'Leads', href: '/admin/leads', icon: UserPlus, description: 'View and manage all leads' },
        { name: 'Lead Routing', label: 'Lead Routing', href: '/admin/lead-routing', icon: Target, description: 'Configure lead assignment rules' },
        { name: 'Lead Scoring', label: 'Lead Scoring', href: '/admin/lead-scoring', icon: BarChart3, description: 'Set up lead scoring criteria' },
        { name: 'Campaigns', label: 'Campaigns', href: '/admin/campaigns', icon: Zap, description: 'Manage marketing campaigns' }
      ]
    },
    {
      id: 'students-applications',
      title: 'Students & Applications',
      description: 'Track student applications and enrollment progress',
      items: [
        { name: 'Students', label: 'Students', href: '/admin/students', icon: Users, description: 'Manage student records' },
        { name: 'Applications', label: 'Applications', href: '/admin/applications', icon: FileText, description: 'Review and process applications' },
        { name: 'Applicants', label: 'Applicants', href: '/admin/applicants', icon: GraduationCap, description: 'Review applicant data' },
        { name: 'Documents', label: 'Documents', href: '/admin/documents', icon: FileText, description: 'Manage student documents' }
      ]
    },
    {
      id: 'practicum-management',
      name: 'Practicum Management',
      title: 'Practicum Management',
      description: 'Manage practicum placements and student progress',
      icon: ClipboardList,
      items: [
        { name: 'Dashboard', label: 'Dashboard', href: '/admin/practicum', icon: BarChart3, description: 'Practicum overview and analytics' },
        { name: 'Sites', label: 'Sites', href: '/admin/practicum/sites', icon: MapPin, description: 'Manage practicum sites' },
        { name: 'Programs', label: 'Programs', href: '/admin/practicum/programs', icon: BookOpen, description: 'Configure practicum programs' },
        { name: 'Journeys', label: 'Journeys', href: '/admin/practicum/journeys', icon: ClipboardList, description: 'Setup practicum workflows' },
        { name: 'Assignments', label: 'Assignments', href: '/admin/practicum/assignments', icon: Users, description: 'Manage student assignments' }
      ]
    },
    {
      id: 'data-management',
      title: 'Data Management',
      description: 'Configure your programs, requirements, and automation',
      items: [
        { name: 'Programs', label: 'Programs', href: '/admin/programs', icon: GraduationCap, description: 'Manage academic programs' },
        { name: 'Requirements', label: 'Requirements', href: '/admin/requirements', icon: FileText, description: 'Configure program requirements' },
        { name: 'Workflows', label: 'Workflows', href: '/admin/workflows', icon: Zap, description: 'Automate enrollment processes' },
        { name: 'Events', label: 'Events', href: '/admin/events', icon: Calendar, description: 'Manage events and schedules' },
        { name: 'Academic Terms & Schedules', label: 'Academic Terms & Schedules', href: '/admin/academic-terms', icon: CalendarDays, description: 'Manage academic terms and scheduling' },
        { name: 'Practicum Dashboard', label: 'Practicum Dashboard', href: '/admin/practicum', icon: BarChart3, description: 'Practicum overview and analytics' },
        { name: 'Practicum Sites', label: 'Practicum Sites', href: '/admin/practicum/sites', icon: MapPin, description: 'Manage practicum sites' },
        { name: 'Practicum Programs', label: 'Practicum Programs', href: '/admin/practicum/programs', icon: BookOpen, description: 'Configure practicum programs' },
        { name: 'Practicum Journeys', label: 'Practicum Journeys', href: '/admin/practicum/journeys', icon: ClipboardList, description: 'Setup practicum workflows' },
        { name: 'Practicum Assignments', label: 'Practicum Assignments', href: '/admin/practicum/assignments', icon: Users, description: 'Manage student assignments' }
      ]
    },
    {
      id: 'analytics-reports',
      title: 'Analytics & Reports',
      description: 'Monitor performance and generate insights',
      items: [
        { name: 'Analytics', label: 'Analytics', href: '/admin/analytics', icon: BarChart3, description: 'View detailed analytics' },
        { name: 'Reports', label: 'Reports', href: '/admin/reports', icon: FileText, description: 'Generate custom reports' },
        { name: 'Enrollment Optimization', label: 'Enrollment Optimization', href: '/admin/enrollment-optimization', icon: Target, description: 'Optimize enrollment strategies' }
      ]
    },
    {
      id: 'configuration',
      title: 'Configuration',
      description: 'System settings and configurations',
      items: [
        { name: 'Settings', label: 'Settings', href: '/admin/configuration', icon: Settings, description: 'System configuration' },
        { name: 'Team Management', label: 'Team Management', href: '/admin/team', icon: Users, description: 'Manage team members' },
        { name: 'Integration', label: 'Integration', href: '/admin/integration', icon: Zap, description: 'Connect external services' }
      ]
    }
  ]
};