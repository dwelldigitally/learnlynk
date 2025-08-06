import { useLocation, NavLink } from "react-router-dom";
import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { navigationStructure } from "@/data/navigationStructure";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ModernSidebarProps {
  activeSection: string;
}

export function ModernSidebar({ activeSection }: ModernSidebarProps) {
  const location = useLocation();
  const { open } = useSidebar();
  const [searchQuery, setSearchQuery] = useState("");
  const collapsed = !open;

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

  const isItemActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const hasActiveSubItem = (item: any) => {
    return item.subItems?.some((subItem: any) => isItemActive(subItem.href));
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border/50 p-4">
        <div className="flex items-center gap-2">
          <currentSection.icon className="h-5 w-5 text-sidebar-primary" />
          {!collapsed && (
            <h2 className="font-semibold text-sidebar-foreground">{currentSection.name}</h2>
          )}
        </div>
        
        {!collapsed && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground/60" />
            <Input
              placeholder={`Search ${currentSection.name.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = isItemActive(item.href);
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isSubItemActive = hasActiveSubItem(item);
                const shouldShowAsActive = isActive || isSubItemActive;

                return (
                  <SidebarMenuItem key={item.href}>
                    {hasSubItems ? (
                      <Collapsible defaultOpen={isSubItemActive}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`group ${shouldShowAsActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'}`}
                          >
                            <item.icon className="h-4 w-4" />
                            {!collapsed && (
                              <>
                                <span>{item.name}</span>
                                {item.count && (
                                  <Badge variant="secondary" className="ml-auto text-xs">
                                    {item.count}
                                  </Badge>
                                )}
                                {item.badge && (
                                  <Badge className="ml-auto text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                                <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        {!collapsed && (
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.href}>
                                  <SidebarMenuSubButton asChild>
                                    <NavLink
                                      to={subItem.href}
                                      className={({ isActive }) =>
                                        `flex items-center gap-2 ${
                                          isActive
                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium border-l-2 border-sidebar-primary'
                                            : 'hover:bg-sidebar-accent/50'
                                        }`
                                      }
                                    >
                                      <subItem.icon className="h-3.5 w-3.5" />
                                      <span>{subItem.name}</span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            `flex items-center gap-2 ${
                              isActive
                                ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                                : 'hover:bg-sidebar-accent/50'
                            }`
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          {!collapsed && (
                            <>
                              <span>{item.name}</span>
                              {item.count && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  {item.count}
                                </Badge>
                              )}
                              {item.badge && (
                                <Badge className="ml-auto text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}