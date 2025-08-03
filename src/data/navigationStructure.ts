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
      id: "contacts",
      name: "Contacts",
      icon: Users,
      items: [
        { name: "All Leads", href: "/admin/leads", icon: Users },
        { name: "Students", href: "/admin/students", icon: GraduationCap },
        { name: "Lead Scoring", href: "/admin/scoring", icon: Target },
        { name: "Routing Rules", href: "/admin/routing", icon: Route },
        { name: "Import/Export", href: "/admin/import", icon: Upload }
      ]
    },
    {
      id: "engagement",
      name: "Engagement",
      icon: MessageSquare,
      items: [
        { name: "Communication Center", href: "/admin/communication", icon: MessageSquare },
        { name: "Templates", href: "/admin/templates", icon: Mail },
        { name: "Automations", href: "/admin/automations", icon: Zap },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "Campaigns", href: "/admin/campaigns", icon: Briefcase }
      ]
    },
    {
      id: "applications",
      name: "Applications",
      icon: FileText,
      items: [
        { name: "Programs", href: "/admin/programs", icon: BookOpen },
        { name: "Applications", href: "/admin/applications", icon: FileText },
        { name: "Workflows", href: "/admin/workflows", icon: Workflow },
        { name: "Intake Management", href: "/admin/intake", icon: GitBranch },
        { name: "Requirements", href: "/admin/requirements", icon: Shield }
      ]
    },
    {
      id: "data-automations",
      name: "Data + Automations",
      icon: Database,
      items: [
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        { name: "Reports", href: "/admin/reports", icon: PieChart },
        { name: "Database", href: "/admin/database", icon: Database },
        { name: "Team Management", href: "/admin/team", icon: UserCog },
        { name: "Settings", href: "/admin/settings", icon: Settings }
      ]
    }
  ]
};