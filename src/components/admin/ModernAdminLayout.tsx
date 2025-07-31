import React, { useState } from 'react';
import { Outlet, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  Settings, 
  Calendar,
  FileText,
  DollarSign,
  MessageSquare,
  BarChart3,
  UserCheck,
  GitBranch,
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  Building2,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/admin', icon: BarChart3, count: null },
  { name: 'Leads', href: '/admin/leads', icon: Users, count: null },
  { name: 'Students', href: '/admin/students', icon: Users, count: 24 },
  { name: 'Programs', href: '/admin/programs', icon: GraduationCap, count: null },
  { name: 'Events', href: '/admin/events', icon: Calendar, count: 3 },
  { name: 'Documents', href: '/admin/documents', icon: FileText, count: null },
  { name: 'Financial', href: '/admin/financial', icon: DollarSign, count: 7 },
  { name: 'Communication', href: '/admin/communication', icon: MessageSquare, count: 12 },
  { name: 'Team', href: '/admin/team', icon: UserCheck, count: null },
  { name: 'Workflows', href: '/admin/workflows', icon: GitBranch, count: null },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, count: null },
  { name: 'Settings', href: '/admin/settings', icon: Settings, count: null },
];

interface ModernAdminLayoutProps {
  children: React.ReactNode;
}

const ModernAdminLayout: React.FC<ModernAdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/admin/profile');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={cn("min-h-screen bg-background", darkMode && "dark")}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo & Brand */}
          <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">Learnlynk</span>
              <span className="text-xs text-muted-foreground">Admin Portal</span>
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    <span>{item.name}</span>
                  </div>
                  {item.count && (
                    <Badge 
                      variant={isActive ? "secondary" : "outline"} 
                      className={cn(
                        "h-5 px-2 text-xs",
                        isActive && "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/20"
                      )}
                    >
                      {item.count}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="border-t border-border p-4">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
              onClick={handleProfileClick}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@learnlynk.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex h-full items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-foreground font-medium">
                  {navigation.find(nav => nav.href === location.pathname)?.name || 'Overview'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="h-9 w-9"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground">
                  3
                </Badge>
              </Button>
              
              <Avatar 
                className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
                onClick={handleProfileClick}
              >
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  AD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModernAdminLayout;