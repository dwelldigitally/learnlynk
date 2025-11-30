import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Link, 
  FileText, 
  Bot, 
  Brain, 
  Route, 
  Target, 
  Building, 
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Menu,
  TrendingUp,
  Zap,
  Building2,
  Users,
  User,
  Briefcase,
  DollarSign,
  Sliders,
  ClipboardCheck,
  Bell,
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  MessageSquare,
  Calendar,
  BookOpen,
  Workflow,
  Upload,
  BarChart3,
  Database,
  Mail,
  FileCheck,
  UserCog,
  MapPin,
  ClipboardList,
  Award,
  Server,
  Shield,
  Clock,
  AlertTriangle,
  PieChart,
  Cog,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useMvpMode } from '@/contexts/MvpModeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface ConfigurationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface ConfigurationGroup {
  name: string;
  items: ConfigurationItem[];
  mvpOnly?: boolean; // true = only show in MVP mode
  fullModeOnly?: boolean; // true = only show in Full mode
}

// All configuration groups - organized by category
export const CONFIGURATION_GROUPS: ConfigurationGroup[] = [
  {
    name: "System Administration",
    items: [
      { name: "Profile Settings", href: "/admin/profile", icon: User },
      { name: "Setup Guide", href: "/admin/setup", icon: ClipboardCheck },
      { name: "Notification Preferences", href: "/admin/notifications/preferences", icon: Bell },
      { name: "Properties Management", href: "/admin/configuration/properties", icon: Sliders },
      { name: "Campuses", href: "/admin/configuration/campuses", icon: Building2 },
      { name: "Company Profile", href: "/admin/configuration/company", icon: Building },
      { name: "Payment Configuration", href: "/admin/configuration/payments", icon: DollarSign },
      { name: "External Integrations", href: "/admin/configuration/integrations", icon: Link },
      { name: "Team Management", href: "/admin/configuration/teams", icon: Users },
    ]
  },
  {
    name: "Advanced Lead Features",
    fullModeOnly: true,
    items: [
      { name: "Routing Rules", href: "/admin/configuration/routing", icon: Route },
      { name: "Lead Scoring", href: "/admin/configuration/scoring", icon: Target },
      { name: "Bulk Operations", href: "/admin/leads/bulk", icon: Upload },
      { name: "Sales Command Center", href: "/admin/leads/workflow", icon: Workflow },
      { name: "Intelligence", href: "/admin/leads/ai", icon: Zap },
      { name: "Advanced Analytics", href: "/admin/leads/advanced-analytics", icon: TrendingUp },
      { name: "Team Goals & Analytics", href: "/admin/leads/team-goals", icon: Target },
    ]
  },
  {
    name: "Enrollment & Students",
    fullModeOnly: true,
    items: [
      { name: "Applicant Management", href: "/admin/applicants", icon: FileText },
      { name: "Student Management", href: "/admin/students", icon: GraduationCap },
      { name: "Student Portal", href: "/admin/student-portal", icon: Settings },
      { name: "Events", href: "/admin/events", icon: Calendar },
      { name: "Documents", href: "/admin/documents", icon: Upload },
      { name: "Enrollment Optimization", href: "/admin/enrollment/today", icon: Target },
    ]
  },
  {
    name: "Advanced Academic",
    fullModeOnly: true,
    items: [
      { name: "Policies", href: "/admin/enrollment/policies", icon: Shield },
      { name: "Playbooks", href: "/admin/enrollment/playbooks", icon: BookOpen },
      { name: "Program Journeys", href: "/admin/program-journeys", icon: Route },
    ]
  },
  {
    name: "Registrar & Operations",
    fullModeOnly: true,
    items: [
      { name: "Registrar Command Center", href: "/admin/registrar/command-center", icon: Target },
      { name: "Intelligence", href: "/admin/registrar/intelligence", icon: Brain },
    ]
  },
  {
    name: "Practicum Management",
    fullModeOnly: true,
    items: [
      { name: "Practicum Dashboard", href: "/admin/practicum", icon: ClipboardList },
      { name: "Practicum Sites", href: "/admin/practicum/sites", icon: MapPin },
      { name: "Student Progress", href: "/admin/practicum/progress", icon: TrendingUp },
      { name: "Competency Tracker", href: "/admin/practicum/competencies", icon: Award },
      { name: "Evaluation Center", href: "/admin/practicum/evaluations", icon: FileCheck },
    ]
  },
  {
    name: "Recruiting",
    fullModeOnly: true,
    items: [
      { name: "Recruiter Management", href: "/admin/recruiters", icon: UserCog },
      { name: "Recruiter Applications", href: "/admin/recruiter-applications", icon: FileText },
    ]
  },
  {
    name: "AI & Advanced Features",
    fullModeOnly: true,
    items: [
      { name: "Master Data", href: "/admin/configuration/master-data", icon: Database },
      { name: "Templates", href: "/admin/configuration/templates", icon: FileText },
      { name: "AI Agents", href: "/admin/configuration/ai-agents", icon: Bot },
      { name: "AI Models", href: "/admin/configuration/ai-models", icon: Brain },
      { name: "Performance Analytics", href: "/admin/configuration/ai-analytics", icon: TrendingUp },
      { name: "Visual Workflow Builder", href: "/admin/configuration/workflows", icon: Route },
      { name: "Automation Rules", href: "/admin/configuration/automation-rules", icon: Zap },
      { name: "Behavior Analytics", href: "/admin/configuration/behavior", icon: Brain },
      { name: "System Configuration", href: "/admin/configuration/system", icon: Cog },
    ]
  }
];

interface ConfigurationSidebarContentProps {
  onItemClick?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ConfigurationSidebarContent: React.FC<ConfigurationSidebarContentProps> = ({ 
  onItemClick, 
  isCollapsed,
  onToggleCollapse 
}) => {
  const location = useLocation();
  const { isMvpMode } = useMvpMode();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initialExpanded = new Set<string>();
    CONFIGURATION_GROUPS.forEach(group => {
      initialExpanded.add(group.name);
    });
    return initialExpanded;
  });
  
  // Filter groups based on MVP mode
  const visibleGroups = CONFIGURATION_GROUPS.filter(group => {
    if (group.mvpOnly && !isMvpMode) return false;
    if (group.fullModeOnly && isMvpMode) return false;
    return true;
  });

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  // Collapsed view - show only icons with tooltips
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-col h-full bg-background">
          <div className="p-3 border-b border-border/50 flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleCollapse}
                  className="h-8 w-8"
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Expand sidebar</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex-1 overflow-y-auto py-2">
            <nav className="space-y-1 px-2">
              {visibleGroups.map((group) => (
                <div key={group.name} className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.href || 
                                    location.pathname.startsWith(item.href + '/');
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger asChild>
                          <NavLink
                            to={item.href}
                            onClick={onItemClick}
                            className={cn(
                              "flex items-center justify-center p-2 rounded-lg transition-all",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            )}
                          >
                            <item.icon className="h-4 w-4 flex-shrink-0" />
                          </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          <p>{item.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                  <div className="my-2 border-b border-border/30" />
                </div>
              ))}
            </nav>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  // Expanded view - full sidebar
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Configuration</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Settings & controls</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-8 w-8"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Collapse sidebar</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="p-3 space-y-1">
          {visibleGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.name);
            const hasActiveItem = group.items.some(item => 
              location.pathname === item.href || location.pathname.startsWith(item.href + '/')
            );

            return (
              <Collapsible
                key={group.name}
                open={isExpanded}
                onOpenChange={() => toggleGroup(group.name)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className={cn(
                    "flex items-center justify-between px-2 py-1.5 text-sm font-semibold rounded-lg transition-all hover:bg-muted/50 group",
                    hasActiveItem && "text-primary"
                  )}>
                    <span className="text-xs uppercase tracking-wider">{group.name}</span>
                    <ChevronDown className={cn(
                      "h-3 w-3 transition-transform",
                      isExpanded && "rotate-180"
                    )} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-0.5 mt-0.5">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.href || 
                                    location.pathname.startsWith(item.href + '/');
                    return (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={onItemClick}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center justify-between px-2 py-2 ml-2 text-sm rounded-lg transition-all group",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-foreground hover:bg-muted/50"
                          )
                        }
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        {isActive && <ChevronRight className="h-3 w-3 opacity-70" />}
                      </NavLink>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export const ConfigurationSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed

  return (
    <TooltipProvider>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:block border-r border-border/50 bg-background transition-all duration-300",
        isCollapsed ? "w-14" : "w-64"
      )}>
        <ConfigurationSidebarContent 
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile - Navigation handled by TopNavigationBar hamburger menu */}
      <div className="lg:hidden" />
    </TooltipProvider>
  );
};
