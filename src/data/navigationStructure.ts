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
  Building2
} from "lucide-react";
import type { NavigationStructure } from "@/types/navigation";

export const navigationStructure: NavigationStructure = {
  sections: [
    {
      id: "home",
      name: "Home",
      icon: Users,
      items: [
        { name: "Dashboard", href: "/admin", icon: BarChart3 }
      ]
    },
    {
      id: "leads-marketing",
      name: "Leads & Marketing",
      icon: UserPlus,
      items: [
        { name: "Lead Overview", href: "/admin/leads", icon: Users },
        { name: "Workflow Hub", href: "/admin/leads/workflow", icon: Workflow },
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
        { name: "Bulk Operations", href: "/admin/leads/bulk", icon: Upload },
        { name: "Campaigns", href: "/admin/campaigns", icon: Briefcase },
        { name: "Intake Management", href: "/admin/intake", icon: GitBranch }
      ]
    },
    {
      id: "students-applications",
      name: "Students & Applications",
      icon: GraduationCap,
      items: [
        { name: "Student Overview", href: "/admin/students", icon: GraduationCap },
        { name: "Student Portal", href: "/admin/student-portal", icon: Settings },
        { name: "Applications", href: "/admin/applications", icon: FileText },
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
        { name: "Document Templates", href: "/admin/document-templates", icon: FileCheck },
        { name: "Team Management", href: "/admin/team", icon: UserCog },
        { name: "Recruiter Management", href: "/admin/recruiters", icon: Building2 },
        { name: "Recruiter Applications", href: "/admin/recruiter-applications", icon: FileCheck }
      ]
    },
    {
      id: "configuration",
      name: "Configuration",
      icon: Settings,
      items: [
        { name: "Custom Fields", href: "/admin/configuration/custom-fields", icon: Settings },
        { name: "Master Data", href: "/admin/configuration/master-data", icon: Database },
        { name: "Integrations", href: "/admin/configuration/integrations", icon: Link },
        { name: "Templates", href: "/admin/configuration/templates", icon: FileText },
        { name: "AI Agents", href: "/admin/configuration/ai-agents", icon: Bot },
        { name: "Behavior Analytics", href: "/admin/configuration/behavior", icon: Brain },
        { name: "Lead Routing Rules", href: "/admin/configuration/routing", icon: Route },
        { name: "Lead Scoring Engine", href: "/admin/configuration/scoring", icon: Target },
        { name: "Company Profile", href: "/admin/configuration/company", icon: Briefcase },
        { name: "System Settings", href: "/admin/configuration/system", icon: Cog }
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