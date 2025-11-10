import {
  Users,
  GraduationCap,
  MessageSquare,
  Calendar,
  BookOpen,
  GitBranch,
  Settings,
  BarChart3,
  Database,
  UserPlus,
  Target,
  Route,
  Mail,
  Zap,
  Briefcase,
  FileText,
  Workflow,
  Upload,
  PieChart,
  Shield,
  UserCog,
  FileCheck,
  Link,
  Bot,
  Brain,
  Cog,
  Building2,
  Clock,
  AlertTriangle,
  TrendingUp,
  MapPin,
  ClipboardList,
  Award,
  Building,
  Server,
  DollarSign,
  LayoutDashboard
} from "lucide-react";
import type { NavigationStructure } from "@/types/navigation";

// Pages to hide in MVP mode
export const MVP_HIDDEN_PAGES = [
  // Leads & Marketing
  '/admin/leads/workflow',
  '/admin/leads/ai',
  '/admin/leads/bulk',
  '/admin/enrollment/today',
  '/admin/enrollment/policies',
  '/admin/enrollment/playbooks',
  // Students & Applications (hide entire section in MVP)
  '/admin/registrar/command-center',
  '/admin/registrar/intelligence',
  // Data Management - hide advanced features
  '/admin/recruiters',
  '/admin/recruiter-applications',
  '/admin/practicum',
  '/admin/practicum/sites',
  '/admin/practicum/progress',
  '/admin/practicum/competencies',
  '/admin/practicum/evaluations',
  // System Configuration - AI and advanced features
  '/admin/configuration/ai-agents',
  '/admin/configuration/ai-models',
  '/admin/configuration/ai-analytics',
  '/admin/configuration/workflows',
  '/admin/configuration/automation-rules',
  '/admin/configuration/behavior',
  '/admin/configuration/templates',
  '/admin/configuration/master-data',
  '/admin/configuration/system',
];

export const navigationStructure: NavigationStructure = {
  sections: [
    {
      id: "leads-marketing",
      name: "Leads & Marketing",
      icon: UserPlus,
      items: [
        { name: "My Dashboard", href: "/admin/sales-rep-dashboard", icon: LayoutDashboard },
        { name: "Lead Management", href: "/admin/leads", icon: Users },
        { name: "Sales Command Center", href: "/admin/leads/workflow", icon: Workflow },
        { name: "Intelligence", href: "/admin/leads/ai", icon: Zap },
        { name: "Lead Forms", href: "/admin/leads/forms", icon: FileText },
        { 
          name: "Communication Hub", 
          href: "/admin/communication", 
          icon: MessageSquare,
          subItems: [
            { name: "AI Email Management", href: "/admin/communication/ai-emails", icon: Mail }
          ]
        },
        { 
          name: "Enrollment Optimization", 
          href: "/admin/enrollment/today", 
          icon: Target,
          subItems: [
            { name: "Today", href: "/admin/enrollment/today", icon: Clock }
          ]
        },
        { name: "Bulk Operations", href: "/admin/leads/bulk", icon: Upload },
        { name: "Campaigns", href: "/admin/campaigns", icon: Briefcase }
      ]
    },
    {
      id: "students-applications",
      name: "Students & Applications",
      icon: GraduationCap,
      items: [
        { name: "Registrar Command Center", href: "/admin/registrar/command-center", icon: Target },
        { name: "Intelligence", href: "/admin/registrar/intelligence", icon: Brain },
        { name: "Applicant Management", href: "/admin/applicants", icon: FileText },
        { name: "Student Management", href: "/admin/students", icon: GraduationCap },
        { name: "Student Portal", href: "/admin/student-portal", icon: Settings },
        
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "Documents", href: "/admin/documents", icon: Upload }
      ]
    },
    {
      id: "data-management",
      name: "Data Management",
      icon: Database,
      items: [
        { name: "Programs", href: "/admin/programs", icon: BookOpen },
        { name: "Workflows", href: "/admin/workflows", icon: Workflow },
        { name: "Requirements", href: "/admin/requirements", icon: Shield },
        { name: "Policies", href: "/admin/enrollment/policies", icon: Shield },
        { name: "Playbooks", href: "/admin/enrollment/playbooks", icon: Workflow },
        { name: "Program Journeys", href: "/admin/enrollment/program-journeys", icon: Route },
        { name: "Academic Terms & Schedules", href: "/admin/academic-terms", icon: Calendar },
        { name: "Document Templates", href: "/admin/document-templates", icon: FileCheck },
        { name: "Recruiter Management", href: "/admin/recruiters", icon: Building2 },
        { name: "Recruiter Applications", href: "/admin/recruiter-applications", icon: FileCheck },
        { name: "Practicum Dashboard", href: "/admin/practicum", icon: BarChart3 },
        { name: "Practicum Sites", href: "/admin/practicum/sites", icon: MapPin },
        { name: "Student Progress", href: "/admin/practicum/progress", icon: Users },
        { name: "Competency Tracker", href: "/admin/practicum/competencies", icon: Award },
        { name: "Evaluation Center", href: "/admin/practicum/evaluations", icon: FileText }
      ]
    },
    {
      id: "configuration",
      name: "System Configuration", 
      icon: Settings,
      items: [
        { name: "Team Management", href: "/admin/team", icon: UserCog },
        { name: "Routing Rules", href: "/admin/configuration/routing", icon: Route },
        { name: "Lead Scoring", href: "/admin/configuration/scoring", icon: Target },
        
        { name: "Custom Fields & Stages", href: "/admin/configuration/custom-fields", icon: Settings },
        { name: "Campuses", href: "/admin/configuration/campuses", icon: MapPin },
        { name: "Company Profile", href: "/admin/configuration/company", icon: Building },
        { name: "Payment Configuration", href: "/admin/configuration/payments", icon: DollarSign },
        { name: "External Integrations", href: "/admin/configuration/integrations", icon: Link },
        // Full Mode Only - AI & Advanced
        { name: "Master Data", href: "/admin/configuration/master-data", icon: Database },
        { name: "Templates", href: "/admin/configuration/templates", icon: FileText },
        { name: "AI Agents", href: "/admin/configuration/ai-agents", icon: Bot },
        { name: "AI Models", href: "/admin/configuration/ai-models", icon: Brain },
        { name: "Performance Analytics", href: "/admin/configuration/ai-analytics", icon: TrendingUp },
        { name: "Visual Builder", href: "/admin/configuration/workflows", icon: Route },
        { name: "Automation Rules", href: "/admin/configuration/automation-rules", icon: Zap },
        { name: "Behavior Analytics", href: "/admin/configuration/behavior", icon: Brain },
        { name: "System Configuration", href: "/admin/configuration/system", icon: Server }
      ]
    },
    {
      id: "analytics-reports",
      name: "Analytics & Reports",
      icon: BarChart3,
      items: [
        { name: "Analytics Dashboard", href: "/admin/analytics", icon: BarChart3 },
        { name: "Reports", href: "/admin/reports", icon: PieChart },
        { name: "Lead Analytics", href: "/admin/leads/analytics", icon: BarChart3 },
        { name: "Advanced Analytics", href: "/admin/leads/advanced-analytics", icon: PieChart }
      ]
    }
  ]
};