import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Search, Bell, User } from "lucide-react";
import { navigationStructure } from "@/data/navigationStructure";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface TopNavigationBarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onToggleMobileMenu: () => void;
}

export function TopNavigationBar({ 
  activeSection, 
  onSectionChange,
  onToggleMobileMenu 
}: TopNavigationBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
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

  return (
    <div className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50">
      {/* Left side - Logo + Main Navigation */}
      <div className="flex items-center space-x-8">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMobileMenu}
          className="lg:hidden"
        >
          <div className="w-5 h-5 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-current"></div>
            <div className="w-full h-0.5 bg-current"></div>
            <div className="w-full h-0.5 bg-current"></div>
          </div>
        </Button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">W</span>
          </div>
          <span className="font-semibold text-lg hidden sm:block">WCC Admin</span>
        </div>

        {/* Main Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationStructure.sections.map((section) => {
            const isActive = currentActiveSection === section.id;
            const needsMegaMenu = section.items.length > 5;
            const isSingleItem = section.items.length === 1;
            
            if (isSingleItem) {
              // For single item sections like Home, navigate directly
              return (
                <Button
                  key={section.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`h-10 px-4 text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    navigate(section.items[0].href);
                    onSectionChange(section.id);
                  }}
                >
                  <section.icon className="w-4 h-4 mr-2" />
                  {section.name}
                </Button>
              );
            }
            
            return (
              <DropdownMenu key={section.id}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`h-10 px-4 text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-muted text-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <section.icon className="w-4 h-4 mr-2" />
                    {section.name}
                    <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                
                {needsMegaMenu ? (
                  // Mega Menu for sections with many items
                  <DropdownMenuContent 
                    align="start" 
                    className="w-[600px] bg-background border border-border shadow-lg z-50 p-6"
                  >
                    {section.id === 'contacts' ? (
                      <div className="grid grid-cols-2 gap-6">
                        {/* Lead Management Column */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Lead Management
                          </h3>
                          {section.items.slice(0, 5).map((item) => {
                            const isItemActive = location.pathname === item.href || 
                              location.pathname.startsWith(item.href + '/');
                            return (
                              <DropdownMenuItem
                                key={item.href}
                                onClick={() => {
                                  navigate(item.href);
                                  onSectionChange(section.id);
                                }}
                                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                  isItemActive 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'hover:bg-muted/50'
                                }`}
                              >
                                <div className="flex-shrink-0">
                                  <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium">{item.name}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {item.name === 'Lead Overview' && 'Manage and track all leads'}
                                    {item.name === 'AI Features' && 'AI-powered lead insights'}
                                    {item.name === 'Lead Forms' && 'Create and manage forms'}
                                    {item.name === 'Routing Rules' && 'Automate lead assignment'}
                                    {item.name === 'Scoring Engine' && 'Lead scoring and prioritization'}
                                  </div>
                                </div>
                                {item.count && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                    {item.count}
                                  </span>
                                )}
                                {item.badge && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">
                                    {item.badge}
                                  </span>
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                        </div>
                        
                        {/* Analytics & Operations Column */}
                        <div className="space-y-4">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            Analytics & Operations
                          </h3>
                          {section.items.slice(5).map((item) => {
                            const isItemActive = location.pathname === item.href || 
                              location.pathname.startsWith(item.href + '/');
                            return (
                              <DropdownMenuItem
                                key={item.href}
                                onClick={() => {
                                  navigate(item.href);
                                  onSectionChange(section.id);
                                }}
                                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                  isItemActive 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'hover:bg-muted/50'
                                }`}
                              >
                                <div className="flex-shrink-0">
                                  <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium">{item.name}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {item.name === 'Analytics' && 'View lead analytics and reports'}
                                    {item.name === 'Advanced Analytics' && 'Deep insights and metrics'}
                                    {item.name === 'Templates' && 'Communication templates'}
                                    {item.name === 'Bulk Operations' && 'Mass lead operations'}
                                    {item.name === 'Students' && 'Student management'}
                                  </div>
                                </div>
                                {item.count && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                    {item.count}
                                  </span>
                                )}
                                {item.badge && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-accent text-accent-foreground">
                                    {item.badge}
                                  </span>
                                )}
                              </DropdownMenuItem>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      // Fallback grid layout for other mega menus
                      <div className="grid grid-cols-2 gap-4">
                        {section.items.map((item) => {
                          const isItemActive = location.pathname === item.href || 
                            location.pathname.startsWith(item.href + '/');
                          return (
                            <DropdownMenuItem
                              key={item.href}
                              onClick={() => {
                                navigate(item.href);
                                onSectionChange(section.id);
                              }}
                              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${
                                isItemActive 
                                  ? 'bg-primary/10 text-primary' 
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span className="text-sm font-medium">{item.name}</span>
                            </DropdownMenuItem>
                          );
                        })}
                      </div>
                    )}
                  </DropdownMenuContent>
                ) : (
                  // Regular dropdown for sections with few items
                  <DropdownMenuContent 
                    align="start" 
                    className="w-56 bg-background border border-border shadow-lg z-50"
                  >
                    {section.items.map((item) => {
                      const isItemActive = location.pathname === item.href || 
                        location.pathname.startsWith(item.href + '/');
                      return (
                        <DropdownMenuItem
                          key={item.href}
                          onClick={() => {
                            navigate(item.href);
                            onSectionChange(section.id);
                          }}
                          className={`flex items-center space-x-3 px-3 py-2 cursor-pointer ${
                            isItemActive 
                              ? 'bg-primary/10 text-primary font-medium' 
                              : 'hover:bg-muted'
                          }`}
                        >
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
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            );
          })}
        </nav>
      </div>

      {/* Right side - Search + Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64 h-9"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuItem>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">New lead assigned</p>
                <p className="text-xs text-muted-foreground">John Smith from University Program</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Avatar className="w-7 h-7">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}