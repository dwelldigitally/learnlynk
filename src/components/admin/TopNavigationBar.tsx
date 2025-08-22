import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronDown, Search, Bell, User, Building2, Settings, LogOut, Menu, X, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { navigationStructure } from "@/data/navigationStructure";
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
  const isMobile = useIsMobile();

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
    <>
      <div className={`${isMobile ? 'h-16' : 'h-20'} bg-[hsl(221,83%,53%)] border-b border-[hsl(221,83%,45%)] flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-50 mb-6`}>
        {/* Left side - Logo + Main Navigation */}
        <div className="flex items-center space-x-4 sm:space-x-8">

          {/* Logo */}
          <Link 
            to="/admin" 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img 
              src="/lovable-uploads/84dcaa90-0808-4fe4-842d-8a1a6809cd52.png" 
              alt="WCC Logo" 
              className={`${isMobile ? 'h-10' : 'h-12'} w-auto object-contain`}
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
                    className={`h-10 px-4 text-sm font-medium transition-colors ${
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
                      className={`h-10 px-4 text-sm font-medium transition-colors ${
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
                  <DropdownMenuContent align="start" className="w-48 bg-background border border-border shadow-lg rounded-md z-50">
                    {section.items.map((item) => (
                      <DropdownMenuItem 
                        key={item.href}
                        asChild 
                        className="px-3 py-2.5 transition-colors hover:bg-muted/50 cursor-pointer"
                      >
                        <Link 
                          to={item.href} 
                          className="flex items-center text-sm"
                          onClick={() => onSectionChange(section.id)}
                        >
                          <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                          {item.name}
                          {item.count !== undefined && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {item.count}
                            </Badge>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </nav>
        </div>

        {/* Right side - Search + Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Search Toggle */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </Button>
          )}

          {/* Desktop Search */}
          {!isMobile && (
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 h-9"
              />
            </div>
          )}

          {/* Add Task Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTaskModalOpen(true)}
            className="text-white hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Create New Task"
          >
            <Plus className="w-5 h-5" />
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
                className="flex items-center space-x-2 text-white hover:bg-white/10 min-w-[44px] min-h-[44px]"
              >
                <Avatar className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`}>
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                {!isMobile && <ChevronDown className="w-3 h-3 text-white/60 hidden sm:block" />}
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