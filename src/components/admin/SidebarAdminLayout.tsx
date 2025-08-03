import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, User, ChevronDown, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import AdminNotificationCentre from "./AdminNotificationCentre";
import { useNotifications } from "@/hooks/useNotifications";

interface SidebarAdminLayoutProps {
  children: React.ReactNode;
  onToggleLayout?: () => void;
}

export function SidebarAdminLayout({ children, onToggleLayout }: SidebarAdminLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { unreadCount } = useNotifications();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-50">
            {/* Left side - Sidebar trigger + Back button */}
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8" />
              {onToggleLayout && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onToggleLayout}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to original layout
                </Button>
              )}
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
              <div className="relative">
                <AdminNotificationCentre unreadCount={unreadCount} />
              </div>

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
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}