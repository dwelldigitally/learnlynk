import { useLocation, NavLink } from "react-router-dom";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import { navigationStructure } from "@/data/navigationStructure";
import { Button } from "@/components/ui/button";
import { AIQuickActions } from "./AIQuickActions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AdminSidebarProps {
  activeSection: string;
}

export function AdminSidebar({ activeSection }: AdminSidebarProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const { state: sidebarState } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    
    // Handle specific detail page patterns
    if (path.startsWith('/admin/leads/') || path.startsWith('/admin/communication/')) {
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
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            <currentSection.icon className="w-5 h-5 text-primary flex-shrink-0" />
            {!isCollapsed && (
              <h2 className="font-semibold text-lg truncate">
                {currentSection.name}
              </h2>
            )}
          </div>
          <SidebarTrigger />
        </div>
        
        {/* Search within section */}
        {!isCollapsed && (
          <div className="relative p-2">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <SidebarInput
              placeholder={`Search ${currentSection.name.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
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
                  <SidebarMenuItem key={item.href}>
                    {hasSubItems ? (
                      <Collapsible 
                        open={isGroupExpanded || isSubItemActive} 
                        onOpenChange={() => toggleGroup(item.name)}
                      >
                        <div className="flex items-center">
                          {isCollapsed ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  asChild
                                  isActive={isActive}
                                  className="w-full justify-center"
                                >
                                  <NavLink to={item.href}>
                                    <item.icon className="w-4 h-4" />
                                  </NavLink>
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                {item.name}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <>
                              <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                className="flex-1"
                              >
                                <NavLink to={item.href} className="flex items-center space-x-3">
                                  <item.icon className="w-4 h-4" />
                                  <span>{item.name}</span>
                                </NavLink>
                              </SidebarMenuButton>
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
                            <SidebarMenu>
                              {item.subItems.map((subItem) => {
                                const isSubActive = location.pathname === subItem.href || location.pathname.startsWith(subItem.href + '/');
                                
                                return (
                                  <SidebarMenuItem key={subItem.href}>
                                    <SidebarMenuButton
                                      asChild
                                      isActive={isSubActive}
                                      className="pl-6"
                                    >
                                      <NavLink to={subItem.href} className="flex items-center space-x-3">
                                        <subItem.icon className="w-3.5 h-3.5" />
                                        <span>{subItem.name}</span>
                                      </NavLink>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                );
                              })}
                            </SidebarMenu>
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    ) : (
                      isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              className="w-full justify-center"
                            >
                              <NavLink to={item.href}>
                                <item.icon className="w-4 h-4" />
                              </NavLink>
                            </SidebarMenuButton>
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
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                        >
                          <NavLink to={item.href} className="flex items-center space-x-3">
                            <item.icon className="w-4 h-4" />
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
                        </SidebarMenuButton>
                      )
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {!isCollapsed && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
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
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* AI Quick Actions */}
      {!isCollapsed && (
        <SidebarFooter className="border-t border-border">
          <AIQuickActions />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}