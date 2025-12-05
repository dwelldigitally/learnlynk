import { useState, useEffect, useCallback, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSalesRepMetrics } from '@/hooks/useSalesRepMetrics';
import { cn } from '@/lib/utils';
import { Phone, Mail, CheckCircle, Calendar, PhoneCall } from 'lucide-react';

export function DailyHeader() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const isMobile = useIsMobile();
  const { metrics, targets, loading } = useSalesRepMetrics();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const syncTimer = setInterval(() => {
      setLastSync(new Date());
    }, 60000);
    return () => clearInterval(syncTimer);
  }, []);

  const handleOnline = useCallback(() => setIsOnline(true), []);
  const handleOffline = useCallback(() => setIsOnline(false), []);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, [currentTime]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [currentTime]);

  const displayName = useMemo(() => {
    if (profile?.first_name) {
      return `${profile.first_name} ${profile.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'Sales Rep';
  }, [profile?.first_name, profile?.last_name, user?.email]);

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, [currentTime]);

  const relativeTime = useMemo(() => {
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return lastSync.toLocaleDateString();
  }, [lastSync]);

  const handleAircallLaunch = () => {
    window.open('https://phone.aircall.io/', '_blank', 'width=400,height=600');
  };

  const metricsData = [
    { 
      label: 'Calls Made', 
      value: metrics.callsMade, 
      target: targets.calls,
      icon: Phone,
      color: 'bg-[hsl(200,80%,92%)]',
      barColor: 'bg-[hsl(200,80%,60%)]'
    },
    { 
      label: 'Emails Sent', 
      value: metrics.emailsSent, 
      target: targets.emails,
      icon: Mail,
      color: 'bg-[hsl(245,90%,94%)]',
      barColor: 'bg-primary'
    },
    { 
      label: 'Tasks Done', 
      value: metrics.tasksCompleted, 
      target: targets.tasks,
      icon: CheckCircle,
      color: 'bg-[hsl(158,64%,90%)]',
      barColor: 'bg-[hsl(158,64%,52%)]'
    },
    { 
      label: 'Meetings', 
      value: metrics.appointmentsBooked, 
      target: targets.meetings,
      icon: Calendar,
      color: 'bg-[hsl(24,95%,92%)]',
      barColor: 'bg-[hsl(24,95%,60%)]'
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-border">
      <div className={cn("px-6 lg:px-8", isMobile ? "py-5" : "py-7")}>
        {/* Main Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          
          {/* Left Section - Greeting */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-[hsl(158,64%,52%)] rounded-full animate-pulse"></div>
                  <h1 className={cn("font-bold tracking-tight text-foreground", isMobile ? "text-xl" : "text-2xl")}>
                    {greeting}, {displayName}
                  </h1>
                </div>
                
                {profile?.title && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge 
                      variant="secondary" 
                      className="bg-[hsl(245,90%,94%)] text-primary border-0 rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {profile.title}
                    </Badge>
                    {profile.department && (
                      <span className="text-sm">• {profile.department}</span>
                    )}
                  </div>
                )}
                
                <p className="text-muted-foreground text-sm">
                  {formattedDate}
                </p>
              </div>
              
              {/* Real-time Info Panel - Desktop */}
              {!isMobile && (
                <div className="flex items-center gap-4 bg-muted/50 rounded-2xl px-5 py-3 border border-border">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-foreground font-mono">
                      {formattedTime}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {currentTime.toLocaleDateString('en-US', { timeZoneName: 'short' }).split(', ')[1]}
                    </div>
                  </div>
                  
                  <div className="w-px h-8 bg-border"></div>
                  
                  <Button
                    onClick={handleAircallLaunch}
                    className="h-9 gap-2 rounded-full bg-primary hover:bg-primary-hover"
                    title="Launch Aircall CTI"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span className="hidden xl:inline">Aircall</span>
                  </Button>
                  
                  <div className="w-px h-8 bg-border"></div>
                  
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isOnline ? "bg-[hsl(158,64%,52%)] animate-pulse" : "bg-destructive"
                    )}></div>
                    <span className="text-sm text-foreground">
                      {isOnline ? 'Connected' : 'Offline'}
                    </span>
                  </div>
                  
                  <span className="text-xs text-muted-foreground">
                    Synced {relativeTime}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* HotSheet-style Metrics Cards */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-primary rounded-full"></div>
            <h3 className="text-foreground font-semibold text-sm">Today's Performance</h3>
          </div>
          
          <div className={cn("grid gap-4", isMobile ? "grid-cols-2" : "grid-cols-4")}>
            {metricsData.map((metric, index) => (
              <div 
                key={index}
                className="relative rounded-2xl border border-border bg-card p-4 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("p-2 rounded-xl", metric.color)}>
                    <metric.icon className="w-4 h-4 text-foreground/70" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {metric.target > 0 ? Math.round((metric.value / metric.target) * 100) : 0}%
                  </span>
                </div>
                
                <div className="text-2xl font-bold text-foreground mb-1">
                  {loading ? '...' : metric.value}
                  <span className="text-sm font-normal text-muted-foreground ml-1">/ {metric.target}</span>
                </div>
                
                <p className="text-xs text-muted-foreground mb-3">{metric.label}</p>
                
                {/* Progress bar - HotSheet style */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", metric.barColor)}
                    style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Time/Status Panel */}
        {isMobile && (
          <div className="mt-5 flex items-center justify-between bg-muted/50 rounded-2xl px-4 py-3 border border-border">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold font-mono text-foreground">
                {formattedTime}
              </span>
              <div className="w-px h-4 bg-border"></div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isOnline ? "bg-[hsl(158,64%,52%)] animate-pulse" : "bg-destructive"
                )}></div>
                <span className="text-sm text-foreground">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
            <Button
              onClick={handleAircallLaunch}
              size="sm"
              className="h-9 w-9 p-0 rounded-full bg-primary hover:bg-primary-hover"
              title="Launch Aircall CTI"
            >
              <PhoneCall className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
