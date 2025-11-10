import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Settings, 
  Database, 
  Link, 
  FileText, 
  Bot, 
  Brain, 
  Route, 
  Target, 
  Building, 
  Server,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  Zap,
  Cog,
  Building2,
  Users,
  Briefcase,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMvpMode } from '@/contexts/MvpModeContext';

interface ConfigurationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ConfigurationGroup {
  name: string;
  items: ConfigurationItem[];
}

// MVP Mode visible pages
const MVP_CONFIG_GROUPS: ConfigurationGroup[] = [
  {
    name: "Lead Management",
    items: [
      { name: "Routing Rules", href: "/admin/configuration/routing", icon: Route },
      { name: "Lead Scoring", href: "/admin/configuration/scoring", icon: Target },
    ]
  },
  {
    name: "Student & Applicant Management",
    items: [
      { name: "Applicant Management", href: "/admin/configuration/applicants", icon: Briefcase },
    ]
  },
  {
    name: "System Configuration",
    items: [
      { name: "Custom Fields & Stages", href: "/admin/configuration/custom-fields", icon: Settings },
      { name: "Campuses", href: "/admin/configuration/campuses", icon: Building2 },
      { name: "Company Profile", href: "/admin/configuration/company", icon: Building },
      { name: "Payment Configuration", href: "/admin/configuration/payments", icon: DollarSign },
      { name: "External Integrations", href: "/admin/configuration/integrations", icon: Link },
    ]
  }
];

// Full Mode additional pages
const FULL_MODE_ADDITIONAL_GROUPS: ConfigurationGroup[] = [
  {
    name: "AI & Intelligence",
    items: [
      { name: "AI Agents", href: "/admin/configuration/ai-agents", icon: Bot },
      { name: "AI Models", href: "/admin/configuration/ai-models", icon: Brain },
      { name: "Performance Analytics", href: "/admin/configuration/ai-analytics", icon: TrendingUp },
    ]
  },
  {
    name: "Advanced Workflow",
    items: [
      { name: "Visual Builder", href: "/admin/configuration/workflows", icon: Route },
      { name: "Automation Rules", href: "/admin/configuration/automation-rules", icon: Zap },
      { name: "Behavior Analytics", href: "/admin/configuration/behavior", icon: Brain },
    ]
  },
  {
    name: "Templates & Communication",
    items: [
      { name: "Templates", href: "/admin/configuration/templates", icon: FileText },
    ]
  }
];

interface ConfigurationSidebarContentProps {
  onItemClick?: () => void;
}

const ConfigurationSidebarContent: React.FC<ConfigurationSidebarContentProps> = ({ onItemClick }) => {
  const location = useLocation();
  const { isMvpMode } = useMvpMode();
  
  // Determine which groups to show based on MVP mode
  const configurationGroups = isMvpMode 
    ? MVP_CONFIG_GROUPS 
    : [...MVP_CONFIG_GROUPS, ...FULL_MODE_ADDITIONAL_GROUPS];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-6 border-b border-border/50">
        <h2 className="text-xl font-semibold text-foreground">Configuration</h2>
        <p className="text-sm text-muted-foreground mt-1">System settings & controls</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-6">
          {configurationGroups.map((group) => (
            <div key={group.name}>
              <h3 className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-3 px-3">
                {group.name}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={onItemClick}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all group",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground hover:bg-muted/50"
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export const ConfigurationSidebar: React.FC = () => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 border-r border-border/50 bg-background">
        <ConfigurationSidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mb-4">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <ConfigurationSidebarContent onItemClick={() => {
              // Close the sheet on mobile when an item is clicked
              const closeButton = document.querySelector('[data-sheet-close]') as HTMLButtonElement;
              closeButton?.click();
            }} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};