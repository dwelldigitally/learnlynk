import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Search, Bell, Mail, Settings as SettingsIcon, LogOut, Menu, Plus, Sparkles, User, X, Briefcase, BookOpen, Workflow, FileCheck, Clock, ChevronDown, FileText, BarChart3, Route, Upload, Target, MapPin, DollarSign, Phone, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useMvpMode } from "@/contexts/MvpModeContext";
import { useTenant } from "@/contexts/TenantContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONFIGURATION_GROUPS } from "./ConfigurationSidebar";
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
import { UniversalTaskModal } from "./UniversalTaskModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function TopNavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [tenantHasAircall, setTenantHasAircall] = useState(false);
  const { signOut } = useAuth();
  const { isMvpMode } = useMvpMode();
  const { tenantId } = useTenant();
  const isMobile = useIsMobile();

  // Check if tenant has Aircall connected
  useEffect(() => {
    if (tenantId) {
      checkAircallConnection();
    }
  }, [tenantId]);

  const checkAircallConnection = async () => {
    if (!tenantId) return;
    
    try {
      const { data, error } = await supabase
        .from('tenant_aircall_connections')
        .select('is_active, connection_status')
        .eq('tenant_id', tenantId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking Aircall connection:', error);
        return;
      }

      setTenantHasAircall(data?.is_active && data?.connection_status === 'connected');
    } catch (error) {
      console.error('Error checking tenant Aircall connection:', error);
    }
  };

  // Filter configuration groups based on MVP mode
  const visibleConfigGroups = CONFIGURATION_GROUPS.filter(group => {
    if (group.mvpOnly && !isMvpMode) return false;
    if (group.fullModeOnly && isMvpMode) return false;
    return true;
  });

  const isOnConfigPage = location.pathname.startsWith('/admin/configuration') || 
                         location.pathname.startsWith('/admin/profile') ||
                         location.pathname.startsWith('/admin/setup') ||
                         location.pathname.startsWith('/admin/notifications/preferences');

  const mainNavItems = [
    { name: "My Dashboard", href: "/admin/sales-rep-dashboard" },
    { name: "Leads", href: "/admin/leads" },
    { name: "Communication Hub", href: "/admin/communication" },
    { name: "Reports", href: "/admin/reports" },
    { name: "Team Goals", href: "/admin/leads/team-goals" },
  ];

  const managementMenuItems = [
    { name: "Lead Forms", href: "/admin/leads/forms", icon: FileText },
    { name: "Programs", href: "/admin/programs", icon: BookOpen },
    { name: "Workflows", href: "/admin/workflows", icon: Workflow },
    { name: "Requirements", href: "/admin/requirements", icon: FileCheck },
    { name: "Academic Terms", href: "/admin/academic-terms", icon: Clock },
    { name: "Document Templates", href: "/admin/document-templates", icon: FileText },
    { name: "Program Journeys", href: "/admin/enrollment/program-journeys", icon: Route },
    { name: "Campuses", href: "/admin/configuration/campuses", icon: MapPin },
    { name: "Payment Configuration", href: "/admin/configuration/payments", icon: DollarSign },
    { name: "Lead Routing Rules", href: "/admin/configuration/routing", icon: Target },
  ];

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href + '/');
  
  const isManagementActive = managementMenuItems.some(item => isActive(item.href));

  return (
    <>
      <div className="h-14 sm:h-16 lg:h-20 bg-[hsl(221,83%,53%)] border-b border-[hsl(221,83%,45%)] flex items-center justify-between px-2 sm:px-4 lg:px-6 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-8 min-w-0 flex-1">
          <Link to="/admin" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0">
            <img src="/lovable-uploads/84dcaa90-0808-4fe4-842d-8a1a6809cd52.png" alt="WCC Logo" className="h-8 sm:h-10 lg:h-12 w-auto object-contain max-w-[120px] sm:max-w-none" />
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <Link key={item.href} to={item.href} className={cn("flex items-center px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap", isActive(item.href) ? "bg-white/20 text-white shadow-sm" : "text-white/90 hover:bg-white/10 hover:text-white")}>
                {item.name}
              </Link>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn("flex items-center px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap", isManagementActive ? "bg-white/20 text-white shadow-sm" : "text-white/90 hover:bg-white/10 hover:text-white")}>
                  Management
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 p-2">
                <div className="grid gap-1">
                  {managementMenuItems.map((item) => (
                    <DropdownMenuItem 
                      key={item.href} 
                      onClick={() => navigate(item.href)} 
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors",
                        isActive(item.href) 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'hover:bg-muted/50'
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                        isActive(item.href) 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      )}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="flex-1">{item.name}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
          {/* Aircall Phone Button - opens Aircall in new tab */}
          {tenantHasAircall && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    window.open('https://phone.aircall.io/', '_blank');
                    toast.info("Opening Aircall in new tab. Keep it open to sync your calls.", { duration: 4000 });
                  }} 
                  className="hidden lg:flex text-white hover:bg-white/10 relative"
                >
                  <Phone className="h-5 w-5" />
                  <ExternalLink className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-white/70" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Open Aircall Phone</p></TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/communication/ai-emails')} className={cn("hidden lg:flex text-white hover:bg-white/10 relative", isActive('/admin/communication/ai-emails') && "bg-white/20")}>
                <div className="relative"><Mail className="h-5 w-5" /><Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" /></div>
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>AI Email Management</p></TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/profile')} className={cn("hidden lg:flex text-white hover:bg-white/10", location.pathname.startsWith('/admin/configuration') && "bg-white/20")}>
                <SettingsIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>System Configuration</p></TooltipContent>
          </Tooltip>

          <Button variant="ghost" size="icon" onClick={() => setTaskModalOpen(true)} className="hidden sm:flex text-white hover:bg-white/10">
            <Plus className="h-5 w-5" />
          </Button>

          {!mobileSearchOpen && !isMobile && (
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/30" />
            </div>
          )}

          {isMobile && !mobileSearchOpen && (
            <Button variant="ghost" size="icon" onClick={() => setMobileSearchOpen(true)} className="text-white hover:bg-white/10">
              <Search className="h-5 w-5" />
            </Button>
          )}

          <AdminNotificationCentre />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 relative"><User className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/admin/profile')}><User className="h-4 w-4 mr-2" />Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/configuration/company')}><SettingsIcon className="h-4 w-4 mr-2" />Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { signOut(); toast.success("Signed out successfully"); }} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10"><Menu className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Main Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mainNavItems.map((item) => (
                <DropdownMenuItem key={item.href} onClick={() => { navigate(item.href); setMobileMenuOpen(false); }} className={isActive(item.href) ? 'bg-muted' : ''}>{item.name}</DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">Management</DropdownMenuLabel>
              {managementMenuItems.map((item) => (
                <DropdownMenuItem key={item.href} onClick={() => { navigate(item.href); setMobileMenuOpen(false); }} className={isActive(item.href) ? 'bg-muted' : ''}>
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { navigate('/admin/communication/ai-emails'); setMobileMenuOpen(false); }} className={isActive('/admin/communication/ai-emails') ? 'bg-muted' : ''}>
                <Mail className="h-4 w-4 mr-2" />AI Email Management
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { navigate('/admin/profile'); setMobileMenuOpen(false); }} className={location.pathname.startsWith('/admin/configuration') || location.pathname === '/admin/profile' ? 'bg-muted' : ''}>
                <SettingsIcon className="h-4 w-4 mr-2" />System Configuration
              </DropdownMenuItem>
              
              {/* Configuration Navigation - Only show when on config pages */}
              {isOnConfigPage && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Configuration Pages</DropdownMenuLabel>
                  {visibleConfigGroups.map((group) => (
                    <div key={group.name}>
                      <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider px-2 py-1.5">
                        {group.name}
                      </DropdownMenuLabel>
                      {group.items.map((item) => (
                        <DropdownMenuItem 
                          key={item.href} 
                          onClick={() => { navigate(item.href); setMobileMenuOpen(false); }} 
                          className={isActive(item.href) ? 'bg-muted font-medium' : ''}
                        >
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.name}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {mobileSearchOpen && isMobile && (
        <div className="fixed inset-0 bg-[hsl(221,83%,53%)] z-50 flex items-start pt-20 px-4">
          <div className="w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-12 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/60 text-base" autoFocus />
            <Button variant="ghost" size="icon" onClick={() => setMobileSearchOpen(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      <UniversalTaskModal open={taskModalOpen} onOpenChange={setTaskModalOpen} />
    </>
  );
}
