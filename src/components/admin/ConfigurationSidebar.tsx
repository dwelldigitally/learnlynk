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
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface ConfigurationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ConfigurationGroup {
  name: string;
  items: ConfigurationItem[];
}

const configurationGroups: ConfigurationGroup[] = [
  {
    name: "Leads",
    items: [
      { name: "Routing Rules", href: "/admin/configuration/routing", icon: Route },
      { name: "Lead Scoring", href: "/admin/configuration/scoring", icon: Target },
    ]
  },
  {
    name: "Students",
    items: [
      { name: "Student Management", href: "/admin/configuration/students", icon: Users },
    ]
  }
];

interface ConfigurationSidebarContentProps {
  onItemClick?: () => void;
}

const ConfigurationSidebarContent: React.FC<ConfigurationSidebarContentProps> = ({ onItemClick }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Configuration</h2>
        <p className="text-sm text-muted-foreground">System settings & controls</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-6">
          {configurationGroups.map((group) => (
            <div key={group.name}>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {group.name}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      onClick={onItemClick}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-md transition-colors group",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      {isActive && <ChevronRight className="h-4 w-4" />}
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
      <div className="hidden lg:block w-80 border-r border-border bg-card">
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