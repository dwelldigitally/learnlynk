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
  UserCog
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
        { name: "AI Features", href: "/admin/leads/ai", icon: Zap },
        { name: "Lead Forms", href: "/admin/leads/forms", icon: FileText },
        { name: "Routing Rules", href: "/admin/leads/routing", icon: Route },
        { name: "Scoring Engine", href: "/admin/leads/scoring", icon: Target },
        { name: "Communication Hub", href: "/admin/communication", icon: MessageSquare },
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
        { name: "Database", href: "/admin/database", icon: Database },
        { name: "Team Management", href: "/admin/team", icon: UserCog }
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