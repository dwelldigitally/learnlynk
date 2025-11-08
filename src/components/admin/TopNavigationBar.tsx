import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronDown, Search, Bell, User, Building2, Settings, LogOut, Menu, X, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { navigationStructure, MVP_HIDDEN_PAGES } from "@/data/navigationStructure";
import { useMvpMode } from "@/contexts/MvpModeContext";
import { useAuth } from "@/contexts/AuthContext";
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
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import AdminNotificationCentre from "./AdminNotificationCentre";
import { useNotifications } from "@/hooks/useNotifications";
import { UniversalTaskModal } from "./UniversalTaskModal";

interface TopNavigationBarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function TopNavigationBar({ 
  activeSection, 
  onSectionChange
}: TopNavigationBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const { signOut } = useAuth();
  const { isMvpMode } = useMvpMode();
  const isMobile = useIsMobile();

  const getActiveSectionFromPath = () => {
    const path = location.pathname;
    for (const section of navigationStructure.sections) {
      // Sort items by href length in descending order to match most specific paths first
      const sortedItems = [...section.items].sort((a, b) => b.href.length - a.href.length);
      if (sortedItems.some(item => path.startsWith(item.href))) {
        return section.id;
      }
    }
    return navigationStructure.sections[0].id;
  };

  const currentActiveSection = activeSection || getActiveSectionFromPath();

  return (
    <>
      <div className="h-14 sm:h-16 lg:h-20 bg-[hsl(221,83%,53%)] border-b border-[hsl(221,83%,45%)] flex items-center justify-between px-2 sm:px-4 lg:px-6 fixed top-0 left-0 right-0 z-50">
        {/* Left side - Logo + Main Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8 min-w-0 flex-1">

          {/* Logo */}
          <Link 
            to="/admin" 
            className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <img 
              src="/lovable-uploads/84dcaa90-0808-4fe4-842d-8a1a6809cd52.png" 
              alt="WCC Logo" 
              className="h-8 sm:h-10 lg:h-12 w-auto object-contain max-w-[120px] sm:max-w-none"
            />
          </Link>

          {/* Main Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationStructure.sections.map((section) => {
              const isActive = currentActiveSection === section.id;
              const isSingleItem = section.items.length === 1;
              
              if (isSingleItem) {
                return (
                  <Button
                    key={section.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`h-10 px-2 text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-white/20 text-white" 
                        : "text-white/80 hover:text-white hover:bg-white/10"
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
                      className={`h-10 px-2 text-sm font-medium transition-colors ${
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                      type="button"
                    >
                      <section.icon className="w-4 h-4 mr-2" />
                      {section.name}
                      <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    className="bg-background border border-border shadow-xl rounded-lg z-50 p-0 overflow-hidden"
                    style={{ 
                      width: section.items.length > 6 ? '720px' : section.items.length > 3 ? '480px' : '320px',
                      maxWidth: '90vw'
                    }}
                  >
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground flex items-center">
                          <section.icon className="w-5 h-5 mr-2 text-primary" />
                          {section.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {section.id === 'leads-marketing' && 'Manage leads, campaigns, and marketing activities'}
                          {section.id === 'students-applications' && 'Handle student records, applications, and academic processes'}
                          {section.id === 'data-management' && 'Configure programs, workflows, and system data'}
                          {section.id === 'configuration' && 'System settings, templates, and administrative tools'}
                          {section.id === 'analytics-reports' && 'View analytics, reports, and performance metrics'}
                        </p>
                      </div>
                      
                       <div className={`grid gap-6 ${
                        section.items.length > 6 ? 'grid-cols-3' : 
                        section.items.length > 3 ? 'grid-cols-2' : 
                        'grid-cols-1'
                      }`}>
                        {(() => {
                          // Filter items based on MVP mode
                          const visibleItems = section.items.filter(item => 
                            !isMvpMode || !MVP_HIDDEN_PAGES.includes(item.href)
                          );
                          
                          // Organize items into logical groups
                          const itemsPerColumn = Math.ceil(visibleItems.length / (
                            visibleItems.length > 6 ? 3 : 
                            visibleItems.length > 3 ? 2 : 1
                          ));
                          
                          const columns = [];
                          for (let i = 0; i < visibleItems.length; i += itemsPerColumn) {
                            columns.push(visibleItems.slice(i, i + itemsPerColumn));
                          }
                          
                          return columns.map((columnItems, columnIndex) => (
                            <div key={columnIndex} className="space-y-1">
                              {columnItems.map((item) => (
                                <Link
                                  key={item.href}
                                  to={item.href}
                                  onClick={() => onSectionChange(section.id)}
                                  className="group flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-muted/50 hover:shadow-sm border border-transparent hover:border-border/50"
                                >
                                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mr-3 flex-shrink-0">
                                    <item.icon className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        {item.name}
                                      </h4>
                                      {item.count !== undefined && (
                                        <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                                          {item.count}
                                        </Badge>
                                      )}
                                    </div>
                                    {item.subItems && item.subItems.length > 0 && (
                                      <p className="text-xs text-muted-foreground mt-1 truncate">
                                        {item.subItems.length} sub-items available
                                      </p>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="text-white hover:bg-white/10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center p-0"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}

          {/* Desktop Search */}
          {!isMobile && (
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 xl:w-64 h-9"
              />
            </div>
          )}

          {/* Add Task Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTaskModalOpen(true)}
            className="text-white hover:bg-white/10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center p-0"
            title="Create New Task"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <AdminNotificationCentre unreadCount={unreadCount} />
          </div>

           {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2 text-white hover:bg-white/10 h-8 sm:h-10 px-2"
              >
                <Avatar className="w-6 h-6 sm:w-7 sm:h-7">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-right">
                  <div className="text-xs font-medium">Account</div>
                </div>
                {!isMobile && <ChevronDown className="w-2 h-2 sm:w-3 sm:h-3 text-white/60" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-lg rounded-md z-50">
              <DropdownMenuLabel className="text-sm font-semibold text-muted-foreground px-3 py-2.5">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuItem asChild className="px-3 py-2.5 transition-colors hover:bg-muted/50 cursor-pointer">
                <Link to="/admin/profile" className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4 flex-shrink-0" />
                  Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={async () => {
                  const { error } = await signOut();
                  if (error) {
                    toast.error("Failed to sign out");
                  } else {
                    toast.success("Signed out successfully");
                    navigate("/");
                  }
                }}
                className="px-3 py-2.5 transition-colors hover:bg-muted/50 cursor-pointer text-sm"
              >
                <LogOut className="mr-2 h-4 w-4 flex-shrink-0" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && isMobile && (
        <div className="bg-[hsl(221,83%,53%)] border-b border-[hsl(221,83%,45%)] px-3 py-3 animate-slide-down">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full h-10"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Universal Task Modal */}
      <UniversalTaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        onTaskCreated={() => {
          toast.success("Task created successfully!");
        }}
      />
    </>
  );
}