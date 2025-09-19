import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from '@/components/ui/breadcrumb';
import { Menu, Home, FileText, Calendar, Users, GraduationCap, MapPin } from 'lucide-react';

interface BreadcrumbNavigationProps {
  onToggleSidebar?: () => void;
}

const routeConfig: Record<string, { title: string; icon: React.ComponentType<any>; parent?: string }> = {
  '/student': { title: 'Dashboard', icon: Home },
  '/student/applications': { title: 'Applications', icon: FileText, parent: '/student' },
  '/student/schedule': { title: 'Schedule', icon: Calendar, parent: '/student' },
  '/student/community': { title: 'Community', icon: Users, parent: '/student' },
  '/student/programs': { title: 'Programs', icon: GraduationCap, parent: '/student' },
  '/student/campus': { title: 'Campus', icon: MapPin, parent: '/student' },
};

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentRoute = routeConfig[currentPath];

  const buildBreadcrumbs = () => {
    const breadcrumbs = [];
    let path = currentPath;
    
    while (path && routeConfig[path]) {
      breadcrumbs.unshift(routeConfig[path]);
      path = routeConfig[path].parent;
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();
  const CurrentIcon = currentRoute?.icon || Home;

  return (
    <div className="flex items-center gap-3">
      {/* Sidebar Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSidebar}
        className="lg:hidden"
      >
        <Menu className="w-4 h-4" />
      </Button>

    </div>
  );
};