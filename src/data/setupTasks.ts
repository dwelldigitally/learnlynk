import { SetupTaskDefinition } from '@/types/setup';
import { MapPin, FileText, CheckSquare, GraduationCap, FileInput, Plug, DollarSign, Users, Settings } from 'lucide-react';

export const SETUP_TASKS: SetupTaskDefinition[] = [
  {
    id: 'add_campuses',
    title: 'Add Campuses',
    description: 'Set up your institution\'s campus locations and facilities',
    link: '/admin/configuration/campuses',
    icon: MapPin,
    required: false,
    estimatedMinutes: 5,
    order: 1
  },
  {
    id: 'import_templates',
    title: 'Import Document Templates',
    description: 'Upload templates for applications, transcripts, and certificates',
    link: '/admin/configuration/templates',
    icon: FileText,
    required: false,
    estimatedMinutes: 10,
    order: 2
  },
  {
    id: 'add_requirements',
    title: 'Add Requirements',
    description: 'Define admission requirements and prerequisites',
    link: '/admin/configuration/properties',
    icon: CheckSquare,
    required: true,
    estimatedMinutes: 8,
    order: 3
  },
  {
    id: 'add_programs',
    title: 'Add Programs',
    description: 'Create academic programs with courses, fees, and intake dates',
    link: '/admin/programs',
    icon: GraduationCap,
    required: true,
    estimatedMinutes: 15,
    order: 4
  },
  {
    id: 'configure_lead_form',
    title: 'Configure Lead Capture Form',
    description: 'Set up your online lead capture form',
    link: '/admin/builder/forms',
    icon: FileInput,
    required: true,
    estimatedMinutes: 10,
    order: 5
  },
  {
    id: 'connect_integrations',
    title: 'Connect Integrations',
    description: 'Integrate with third-party services',
    link: '/admin/configuration/external-integrations',
    icon: Plug,
    required: false,
    estimatedMinutes: 10,
    order: 6
  },
  {
    id: 'configure_payments',
    title: 'Configure Payment Setup',
    description: 'Set up payment processing for fees and tuition',
    link: '/admin/configuration/payments',
    icon: DollarSign,
    required: false,
    estimatedMinutes: 15,
    order: 7
  },
  {
    id: 'invite_team_members',
    title: 'Invite Team Members',
    description: 'Add team members and assign roles',
    link: '/admin/team/directory',
    icon: Users,
    required: false,
    estimatedMinutes: 5,
    order: 8
  },
  {
    id: 'additional_settings',
    title: 'Review Additional Settings',
    description: 'Configure working hours, holidays, and preferences',
    link: '/admin/configuration/company',
    icon: Settings,
    required: false,
    estimatedMinutes: 10,
    order: 9
  }
];
