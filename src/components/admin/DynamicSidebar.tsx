import { useLocation, NavLink } from "react-router-dom";
import { navigationStructure } from "@/data/navigationStructure";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { AIQuickActions } from "./AIQuickActions";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DynamicSidebarProps {
  activeSection: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DynamicSidebar({ activeSection, isOpen, onClose }: DynamicSidebarProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const isMobile = useIsMobile();

  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    
    // Handle specific detail page patterns
    if (path.startsWith('/admin/leads/')) {
      return 'leads-marketing';
    }
    if (path.startsWith('/admin/students/')) {
      return 'students-applications';
    }
    if (path.startsWith('/admin/applications/')) {
      return 'students-applications';
    }
    if (path.startsWith('/admin/programs/')) {
      return 'data-management';
    }
    if (path.startsWith('/admin/workflows/')) {
      return 'data-management';
    }
    if (path.startsWith('/admin/requirements/')) {
      return 'data-management';
    }
    if (path.startsWith('/admin/analytics/')) {
      return 'analytics-reports';
    }
    if (path.startsWith('/admin/reports/')) {
      return 'analytics-reports';
    }
    
    // Find section by exact or prefix match
    for (const section of navigationStructure.sections) {
      if (section.items.some(item => path === item.href || path.startsWith(item.href + '/'))) {
        return section.id;
      }
    }
    
    // Default to leads-marketing if no match found
    return 'leads-marketing';
  };

  const currentActiveSection = activeSection || getActiveSectionFromPath();
  const currentSection = navigationStructure.sections.find(
    section => section.id === currentActiveSection
  );

  if (!currentSection) return null;

  const filteredItems = currentSection.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'fixed lg:static'} inset-y-0 left-0 z-30 
        ${isMobile ? 'w-80' : 'w-80'} bg-background border-r border-border
        transform transition-transform duration-200 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isMobile ? 'top-16' : 'top-16 lg:top-0'}
        ${isMobile ? 'h-[calc(100vh-4rem)]' : 'h-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile Close Button & Section Header */}
          <div className={`${isMobile ? 'p-3' : 'p-4'} border-b border-border`}>
            {isMobile && (
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-lg">Navigation</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
            
            <div className="flex items-center space-x-2 mb-3">
              <currentSection.icon className="w-5 h-5 text-primary" />
              <h2 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                {currentSection.name}
              </h2>
            </div>
            
            {/* Search within section */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={`Search ${currentSection.name.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${isMobile ? 'h-11' : 'h-9'}`}
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-4'}`}>
            <nav className={isMobile ? 'space-y-2' : 'space-y-1'}>
              {filteredItems.map((item) => {
                const sortedItems = [...filteredItems].sort((a, b) => b.href.length - a.href.length);
                const mostSpecificMatch = sortedItems.find(sortedItem => 
                  location.pathname === sortedItem.href || location.pathname.startsWith(sortedItem.href + '/')
                );
                const isActive = mostSpecificMatch?.href === item.href;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isSubItemActive = hasSubItems && item.subItems.some(subItem => 
                  location.pathname === subItem.href || location.pathname.startsWith(subItem.href + '/')
                );
                const isGroupExpanded = expandedGroups.has(item.name);
                
                return (
                  <div key={item.href}>
                    {hasSubItems ? (
                      <Collapsible 
                        open={isGroupExpanded || isSubItemActive} 
                        onOpenChange={() => toggleGroup(item.name)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className={`
                              w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium
                              transition-colors duration-200 min-h-[44px]
                              ${isActive || isSubItemActive
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }
                            `}
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon className="w-4 h-4" />
                              <span>{item.name}</span>
                            </div>
                            {(isGroupExpanded || isSubItemActive) ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="ml-4 mt-1 space-y-1">
                          {item.subItems.map((subItem) => {
                            const isSubActive = location.pathname === subItem.href || location.pathname.startsWith(subItem.href + '/');
                            
                            return (
                              <NavLink
                                key={subItem.href}
                                to={subItem.href}
                                onClick={onClose}
                                className={() => `
                                  flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm
                                  transition-colors duration-200 min-h-[44px]
                                  ${isSubActive
                                    ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                  }
                                `}
                              >
                                <subItem.icon className="w-3.5 h-3.5" />
                                <span>{subItem.name}</span>
                              </NavLink>
                            );
                          })}
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <NavLink
                        to={item.href}
                        onClick={onClose}
                        className={() => `
                          flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium
                          transition-colors duration-200 min-h-[44px]
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
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className={`mt-8 pt-4 border-t border-border ${isMobile ? 'space-y-3' : ''}`}>
              <h3 className={`text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3`}>
                Quick Actions
              </h3>
              <div className={isMobile ? 'space-y-3' : 'space-y-2'}>
                {currentSection.id === 'contacts' && (
                  <>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "sm"} 
                      className={`w-full justify-start ${isMobile ? 'min-h-[44px]' : ''}`}
                    >
                      Add New Lead
                    </Button>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "sm"} 
                      className={`w-full justify-start ${isMobile ? 'min-h-[44px]' : ''}`}
                    >
                      Import Contacts
                    </Button>
                  </>
                )}
                {currentSection.id === 'engagement' && (
                  <>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "sm"} 
                      className={`w-full justify-start ${isMobile ? 'min-h-[44px]' : ''}`}
                    >
                      Create Campaign
                    </Button>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "sm"} 
                      className={`w-full justify-start ${isMobile ? 'min-h-[44px]' : ''}`}
                    >
                      New Template
                    </Button>
                  </>
                )}
                {currentSection.id === 'applications' && (
                  <>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "sm"} 
                      className={`w-full justify-start ${isMobile ? 'min-h-[44px]' : ''}`}
                    >
                      Add Program
                    </Button>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "sm"} 
                      className={`w-full justify-start ${isMobile ? 'min-h-[44px]' : ''}`}
                    >
                      Create Workflow
                    </Button>
                  </>
                )}
                {currentSection.id === 'data-automations' && (
                  <>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "sm"} 
                      className={`w-full justify-start ${isMobile ? 'min-h-[44px]' : ''}`}
                    >
                      Generate Report
                    </Button>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "sm"} 
                      className={`w-full justify-start ${isMobile ? 'min-h-[44px]' : ''}`}
                    >
                      Add Team Member
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* AI Quick Actions Section */}
            <div className="mt-6 pt-4 border-t border-border">
              <AIQuickActions />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}