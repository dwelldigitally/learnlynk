import { useLocation, NavLink } from "react-router-dom";
import { Search, ChevronRight, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { navigationStructure } from "@/data/navigationStructure";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeSection: string;
}

export function AdminSidebar({ activeSection }: AdminSidebarProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    // Auto-expand enrollment optimization if we're on an enrollment page
    const initialExpanded = new Set<string>();
    if (location.pathname.startsWith('/admin/enrollment/')) {
      initialExpanded.add('Enrollment Optimization');
    }
    return initialExpanded;
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    
    // Handle specific detail page patterns
    if (path.startsWith('/admin/leads/') || path.startsWith('/admin/communication/') || path.startsWith('/admin/enrollment/')) {
      return 'leads-marketing';
    }
    if (path.startsWith('/admin/students/')) {
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
    <div 
      className={cn(
        "border-r border-border h-[calc(100vh-4rem)] bg-card flex flex-col transition-all duration-300",
        isCollapsed ? "w-14" : "w-80"
      )}
    >
      {/* Collapse Button - Top position when collapsed */}
      {isCollapsed && (
        <div className="flex justify-end p-2 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border">
        <div className={cn(
          "flex items-center p-4",
          !isCollapsed && "justify-between"
        )}>
          <div className="flex items-center space-x-3">
            <currentSection.icon className="w-6 h-6 text-primary flex-shrink-0" />
            {!isCollapsed && (
              <h2 className="font-semibold text-lg truncate">
                {currentSection.name}
              </h2>
            )}
          </div>
          {/* Collapse Button - Beside title when expanded */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Search within section */}
        {!isCollapsed && (
          <div className="relative p-4 pt-0">
            <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder={`Search ${currentSection.name.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4">
          <ul className="space-y-1">
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
                <li key={item.href}>
                  {hasSubItems ? (
                    <Collapsible 
                      open={isGroupExpanded || isSubItemActive} 
                      onOpenChange={() => toggleGroup(item.name)}
                    >
                      <div className="flex items-center">
                        {isCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <NavLink 
                                to={item.href}
                                className={cn(
                                  "flex items-center justify-center w-full h-12 rounded-md transition-colors",
                                  isActive 
                                    ? "bg-primary text-primary-foreground" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                              >
                                <item.icon className="w-6 h-6" />
                              </NavLink>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {item.name}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <>
                            <NavLink 
                              to={item.href}
                              className={cn(
                                "flex items-center space-x-4 flex-1 h-12 px-3 rounded-md transition-colors",
                                isActive 
                                  ? "bg-primary text-primary-foreground" 
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                              )}
                            >
                              <item.icon className="w-5 h-5" />
                              <span>{item.name}</span>
                            </NavLink>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="px-2 py-1 h-8 w-8"
                              >
                                {(isGroupExpanded || isSubItemActive) ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </>
                        )}
                      </div>
                      
                      {!isCollapsed && (
                        <CollapsibleContent className="ml-4 mt-1">
                          <ul className="space-y-1">
                            {item.subItems.map((subItem) => {
                              const isSubActive = location.pathname === subItem.href || location.pathname.startsWith(subItem.href + '/');
                              
                              return (
                                <li key={subItem.href}>
                                  <NavLink 
                                    to={subItem.href}
                                    className={cn(
                                      "flex items-center space-x-3 pl-6 h-10 rounded-md transition-colors",
                                      isSubActive 
                                        ? "bg-primary text-primary-foreground" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                  >
                                    <subItem.icon className="w-3.5 h-3.5" />
                                    <span>{subItem.name}</span>
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    isCollapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavLink 
                            to={item.href}
                            className={cn(
                              "flex items-center justify-center w-full h-12 rounded-md transition-colors",
                              isActive 
                                ? "bg-primary text-primary-foreground" 
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            <item.icon className="w-6 h-6" />
                          </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div className="flex flex-col">
                            <span>{item.name}</span>
                            {item.count && (
                              <span className="text-xs text-muted-foreground">
                                {item.count} items
                              </span>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <NavLink 
                        to={item.href}
                        className={cn(
                          "flex items-center space-x-4 h-12 px-3 rounded-md transition-colors",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                        {item.count && (
                          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {item.count}
                          </span>
                        )}
                        {item.badge && (
                          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    )
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="mt-4 p-4 border-t border-border">
            <div className="space-y-2">
              {currentSection.id === 'contacts' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    Add New Lead
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    Import Contacts
                  </Button>
                </>
              )}
              {currentSection.id === 'engagement' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    Create Campaign
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    New Template
                  </Button>
                </>
              )}
              {currentSection.id === 'applications' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    Add Program
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    Create Workflow
                  </Button>
                </>
              )}
              {currentSection.id === 'data-automations' && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    Generate Report
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                  >
                    Add Team Member
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}