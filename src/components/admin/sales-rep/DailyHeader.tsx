import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Phone, Mail, CheckCircle, Target, Calendar, Clock, Wifi, WifiOff, Users, AlertCircle, PhoneCall } from 'lucide-react';

export function DailyHeader() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const isMobile = useIsMobile();
  const [todaysMetrics, setTodaysMetrics] = useState({
    callsMade: 12,
    emailsSent: 8,
    tasksCompleted: 5,
    appointmentsBooked: 3
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());

  // Optimize timer to update less frequently for non-essential updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync less frequently to reduce re-renders
  useEffect(() => {
    const syncTimer = setInterval(() => {
      setLastSync(new Date());
    }, 60000); // Reduced from 30s to 60s
    return () => clearInterval(syncTimer);
  }, []);

  // Memoize event handlers to prevent re-creation
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

  // Memoize expensive calculations to prevent unnecessary re-computations
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
    // Open Aircall CTI in a new window/tab
    window.open('https://phone.aircall.io/', '_blank', 'width=400,height=600');
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background with subtle modern gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100/95 to-slate-200/90 dark:from-slate-900 dark:via-slate-800/95 dark:to-slate-700/90"></div>
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_120%,rgba(148,163,184,0.4),transparent_50%)]"></div>
      
      <div className="relative">
        <div className={cn("px-4 lg:px-6 xl:px-8", isMobile ? "py-4" : "py-6")}>
          {/* Main Header Content */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            
            {/* Left Section - Greeting and User Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="text-foreground space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <h1 className={cn("font-bold tracking-tight text-foreground", isMobile ? "text-xl" : "text-3xl")}>
                      {greeting}, {displayName}! 
                      <span className="ml-2 text-2xl">👋</span>
                    </h1>
                  </div>
                  
                  {profile?.title && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Badge variant="secondary" className="bg-muted text-muted-foreground border-border text-xs">
                        {profile.title}
                      </Badge>
                      {profile.department && (
                        <span className="text-sm opacity-80">• {profile.department}</span>
                      )}
                    </div>
                  )}
                  
                   <p className="text-muted-foreground text-base font-medium">
                     {formattedDate} • Ready to achieve your goals?
                   </p>
                </div>
                
                {/* Real-time Info Panel - Desktop */}
                {!isMobile && (
                  <div className="flex items-center gap-4 bg-card backdrop-blur-sm rounded-xl px-4 py-3 border border-border">
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-foreground">
                        {formattedTime}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {currentTime.toLocaleDateString('en-US', { timeZoneName: 'short' }).split(', ')[1]}
                      </div>
                    </div>
                    
                    <div className="w-px h-8 bg-border"></div>
                    
                    <Button
                      onClick={handleAircallLaunch}
                      variant="default"
                      size="sm"
                      className="h-9 gap-2"
                      title="Launch Aircall CTI"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span className="hidden xl:inline">Aircall</span>
                    </Button>
                    
                    <div className="w-px h-8 bg-border"></div>
                    
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
                      )}></div>
                      <div className="text-sm text-foreground">
                        {isOnline ? 'Connected' : 'Offline'}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Synced {relativeTime}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modern Metrics Cards */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-primary/60 rounded-full"></div>
              <h3 className="text-foreground font-semibold text-sm uppercase tracking-wide">Today's Performance</h3>
            </div>
            
            <div className={cn("grid gap-3", isMobile ? "grid-cols-2" : "grid-cols-4")}>
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-sm rounded-lg"></div>
                <div className="relative p-3 border border-border rounded-lg hover:border-primary/40 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold text-foreground">{todaysMetrics.callsMade}</div>
                      <div className="text-xs text-muted-foreground">Calls Made</div>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">+2</div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-sm rounded-lg"></div>
                <div className="relative p-3 border border-border rounded-lg hover:border-primary/40 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold text-foreground">{todaysMetrics.emailsSent}</div>
                      <div className="text-xs text-muted-foreground">Emails Sent</div>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">+1</div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-sm rounded-lg"></div>
                <div className="relative p-3 border border-border rounded-lg hover:border-primary/40 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold text-foreground">{todaysMetrics.tasksCompleted}</div>
                      <div className="text-xs text-muted-foreground">Tasks Done</div>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">On track</div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-sm rounded-lg"></div>
                <div className="relative p-3 border border-border rounded-lg hover:border-primary/40 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold text-foreground">{todaysMetrics.appointmentsBooked}</div>
                      <div className="text-xs text-muted-foreground">Meetings</div>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">+1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Mobile Time/Status Panel */}
          {isMobile && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between bg-card backdrop-blur-sm rounded-lg px-4 py-3 border border-border">
                <div className="flex items-center gap-3">
                  <div className="text-lg font-mono font-bold text-foreground">
                    {formattedTime}
                  </div>
                  <div className="w-px h-4 bg-border"></div>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
                    )}></div>
                    <span className="text-sm text-foreground">{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
                <Button
                  onClick={handleAircallLaunch}
                  variant="default"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Launch Aircall CTI"
                >
                  <PhoneCall className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Synced {relativeTime}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}