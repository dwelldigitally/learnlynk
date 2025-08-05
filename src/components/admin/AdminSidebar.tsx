import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Building2,
  User,
  Bell,
  Key,
  CreditCard,
  Activity,
  Archive,
  FileKey,
  Globe,
  Webhook
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const sidebarItems = [
  {
    title: "Personal",
    items: [
      { title: "Your profile", url: "/admin/settings", icon: User },
      { title: "Default project", url: "/admin", icon: BarChart3 },
    ]
  },
  {
    title: "Organization", 
    items: [
      { title: "General", url: "/admin/company", icon: Building2 },
      { title: "API keys", url: "/admin/api-keys", icon: Key },
      { title: "Admin keys", url: "/admin/admin-keys", icon: FileKey },
      { title: "Members", url: "/admin/team", icon: Users },
      { title: "Projects", url: "/admin/programs", icon: BookOpen },
      { title: "Billing", url: "/admin/billing", icon: CreditCard },
      { title: "Limits", url: "/admin/limits", icon: Shield },
      { title: "Usage", url: "/admin/usage", icon: Activity },
      { title: "Data controls", url: "/admin/database", icon: Database },
    ]
  },
  {
    title: "Project",
    items: [
      { title: "General", url: "/admin/settings", icon: Settings },
      { title: "API keys", url: "/admin/integrations", icon: Key },
      { title: "Webhooks", url: "/admin/webhooks", icon: Webhook },
      { title: "Members", url: "/admin/team", icon: Users },
      { title: "Limits", url: "/admin/limits", icon: Shield },
    ]
  },
  {
    title: "Contacts & Leads",
    items: [
      { title: "Lead Overview", url: "/admin/leads", icon: Users },
      { title: "AI Features", url: "/admin/leads/ai", icon: Zap },
      { title: "Lead Forms", url: "/admin/leads/forms", icon: FileText },
      { title: "Routing Rules", url: "/admin/leads/routing", icon: Route },
      { title: "Scoring Engine", url: "/admin/leads/scoring", icon: Target },
      { title: "Analytics", url: "/admin/leads/analytics", icon: BarChart3 },
      { title: "Students", url: "/admin/students", icon: GraduationCap }
    ]
  },
  {
    title: "Communication",
    items: [
      { title: "Communication Hub", url: "/admin/communication", icon: MessageSquare },
      { title: "Events", url: "/admin/events", icon: Calendar },
    ]
  }
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');
  
  const getNavClass = (url: string) => {
    const active = isActive(url);
    return active ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";
  };

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="py-4">
        {/* Logo/Header */}
        <div className="px-4 pb-4">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">W</span>
              </div>
              <span className="font-semibold text-lg">WCC Admin</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">W</span>
              </div>
            </div>
          )}
        </div>

        {sidebarItems.map((group, groupIndex) => {
          const hasActiveItem = group.items.some(item => isActive(item.url));
          
          return (
            <SidebarGroup
              key={groupIndex}
              className="px-2"
            >
              {!collapsed && (
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  {group.title}
                </SidebarGroupLabel>
              )}
              
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild
                        className={getNavClass(item.url)}
                      >
                        <button
                          onClick={() => navigate(item.url)}
                          className="w-full flex items-center gap-3 px-2 py-2 text-left"
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}