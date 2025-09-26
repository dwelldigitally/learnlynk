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

export const navigationStructure = {
  sections: [
    {
      id: 'leads-marketing',
      title: 'Leads & Marketing',
      description: 'Manage your lead generation and marketing campaigns',
      items: [
        { label: 'Leads', href: '/admin/leads', icon: UserPlus, description: 'View and manage all leads' },
        { label: 'Lead Routing', href: '/admin/lead-routing', icon: Target, description: 'Configure lead assignment rules' },
        { label: 'Lead Scoring', href: '/admin/lead-scoring', icon: BarChart3, description: 'Set up lead scoring criteria' },
        { label: 'Campaigns', href: '/admin/campaigns', icon: Zap, description: 'Manage marketing campaigns' }
      ]
    },
    {
      id: 'students-applications',
      title: 'Students & Applications',
      description: 'Track student applications and enrollment progress',
      items: [
        { label: 'Students', href: '/admin/students', icon: Users, description: 'Manage student records' },
        { label: 'Applications', href: '/admin/applications', icon: FileText, description: 'Review and process applications' },
        { label: 'Applicants', href: '/admin/applicants', icon: GraduationCap, description: 'Review applicant data' },
        { label: 'Documents', href: '/admin/documents', icon: FileText, description: 'Manage student documents' }
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
        { label: 'Programs', href: '/admin/programs', icon: GraduationCap, description: 'Manage academic programs' },
        { label: 'Requirements', href: '/admin/requirements', icon: FileText, description: 'Configure program requirements' },
        { label: 'Workflows', href: '/admin/workflows', icon: Zap, description: 'Automate enrollment processes' },
        { label: 'Events', href: '/admin/events', icon: Calendar, description: 'Manage events and schedules' },
        { label: 'Academic Terms & Schedules', href: '/admin/academic-terms', icon: CalendarDays, description: 'Manage academic terms and scheduling' },
        { label: 'Practicum Dashboard', href: '/admin/practicum', icon: BarChart3, description: 'Practicum overview and analytics' },
        { label: 'Practicum Sites', href: '/admin/practicum/sites', icon: MapPin, description: 'Manage practicum sites' },
        { label: 'Practicum Programs', href: '/admin/practicum/programs', icon: BookOpen, description: 'Configure practicum programs' },
        { label: 'Practicum Journeys', href: '/admin/practicum/journeys', icon: ClipboardList, description: 'Setup practicum workflows' },
        { label: 'Practicum Assignments', href: '/admin/practicum/assignments', icon: Users, description: 'Manage student assignments' }
      ]
    },
    {
      id: 'analytics-reports',
      title: 'Analytics & Reports',
      description: 'Monitor performance and generate insights',
      items: [
        { label: 'Analytics', href: '/admin/analytics', icon: BarChart3, description: 'View detailed analytics' },
        { label: 'Reports', href: '/admin/reports', icon: FileText, description: 'Generate custom reports' },
        { label: 'Enrollment Optimization', href: '/admin/enrollment-optimization', icon: Target, description: 'Optimize enrollment strategies' }
      ]
    },
    {
      id: 'configuration',
      title: 'Configuration',
      description: 'System settings and configurations',
      items: [
        { label: 'Settings', href: '/admin/configuration', icon: Settings, description: 'System configuration' },
        { label: 'Team Management', href: '/admin/team', icon: Users, description: 'Manage team members' },
        { label: 'Integration', href: '/admin/integration', icon: Zap, description: 'Connect external services' }
      ]
    }
  ]
};