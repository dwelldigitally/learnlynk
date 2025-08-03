import { useLocation, NavLink } from "react-router-dom";
import { navigationStructure } from "@/data/navigationStructure";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface DynamicSidebarProps {
  activeSection: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DynamicSidebar({ activeSection, isOpen, onClose }: DynamicSidebarProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    for (const section of navigationStructure.sections) {
      if (section.items.some(item => path.startsWith(item.href))) {
        return section.id;
      }
    }
    return navigationStructure.sections[0].id;
  };

  const currentActiveSection = activeSection || getActiveSectionFromPath();
  const currentSection = navigationStructure.sections.find(
    section => section.id === currentActiveSection
  );

  if (!currentSection) return null;

  const filteredItems = currentSection.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 w-80 bg-background border-r border-border
        transform transition-transform duration-200 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        top-16 lg:top-0
      `}>
        <div className="flex flex-col h-full">
          {/* Section Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-2 mb-3">
              <currentSection.icon className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-lg">{currentSection.name}</h2>
            </div>
            
            {/* Search within section */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={`Search ${currentSection.name.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {filteredItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  location.pathname.startsWith(item.href + '/');
                
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={() => `
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-colors duration-200
                      ${isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {item.count && (
                      <span className={`
                        ml-auto text-xs px-2 py-0.5 rounded-full
                        ${isActive 
                          ? 'bg-primary-foreground/20 text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        {item.count}
                      </span>
                    )}
                    {item.badge && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8 pt-4 border-t border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {currentSection.id === 'contacts' && (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Add New Lead
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Import Contacts
                    </Button>
                  </>
                )}
                {currentSection.id === 'engagement' && (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Create Campaign
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      New Template
                    </Button>
                  </>
                )}
                {currentSection.id === 'applications' && (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Add Program
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Create Workflow
                    </Button>
                  </>
                )}
                {currentSection.id === 'data-automations' && (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Generate Report
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      Add Team Member
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}