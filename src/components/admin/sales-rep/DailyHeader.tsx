import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Phone, Mail, CheckCircle, Target, Calendar, Clock, Wifi, WifiOff, Users, AlertCircle } from 'lucide-react';

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

  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient and subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80"></div>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent_50%)]"></div>
      
      <div className="relative">
        <div className={cn("px-4 lg:px-6 xl:px-8", isMobile ? "py-4" : "py-6")}>
          {/* Main Header Content */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            
            {/* Left Section - Greeting and User Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="text-primary-foreground space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <h1 className={cn("font-bold tracking-tight", isMobile ? "text-xl" : "text-3xl")}>
                      {greeting}, {displayName}! 
                      <span className="ml-2 text-2xl">👋</span>
                    </h1>
                  </div>
                  
                  {profile?.title && (
                    <div className="flex items-center gap-2 text-primary-foreground/90">
                      <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                        {profile.title}
                      </Badge>
                      {profile.department && (
                        <span className="text-sm opacity-80">• {profile.department}</span>
                      )}
                    </div>
                  )}
                  
                   <p className="text-primary-foreground/90 text-base font-medium">
                     {formattedDate} • Ready to achieve your goals?
                   </p>
                </div>
                
                {/* Real-time Info Panel - Desktop */}
                {!isMobile && (
                  <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                    <div className="text-center">
                      <div className="text-2xl font-mono font-bold text-white">
                        {formattedTime}
                      </div>
                      <div className="text-xs text-white/70 mt-1">
                        {currentTime.toLocaleDateString('en-US', { timeZoneName: 'short' }).split(', ')[1]}
                      </div>
                    </div>
                    
                    <div className="w-px h-8 bg-white/20"></div>
                    
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        isOnline ? "bg-green-400 animate-pulse" : "bg-red-400"
                      )}></div>
                      <div className="text-sm text-white">
                        {isOnline ? 'Connected' : 'Offline'}
                      </div>
                    </div>
                    
                    <div className="text-xs text-white/70">
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
              <div className="w-1 h-6 bg-white/60 rounded-full"></div>
              <h3 className="text-white/90 font-semibold text-sm uppercase tracking-wide">Today's Performance</h3>
            </div>
            
            <div className={cn("grid gap-3", isMobile ? "grid-cols-2" : "grid-cols-4")}>
              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-lg"></div>
                <div className="relative p-3 border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-blue-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold text-white">{todaysMetrics.callsMade}</div>
                      <div className="text-xs text-white/80">Calls Made</div>
                    </div>
                    <div className="text-xs text-white/60 font-medium">+2</div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-lg"></div>
                <div className="relative p-3 border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-purple-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold text-white">{todaysMetrics.emailsSent}</div>
                      <div className="text-xs text-white/80">Emails Sent</div>
                    </div>
                    <div className="text-xs text-white/60 font-medium">+1</div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-lg"></div>
                <div className="relative p-3 border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold text-white">{todaysMetrics.tasksCompleted}</div>
                      <div className="text-xs text-white/80">Tasks Done</div>
                    </div>
                    <div className="text-xs text-white/60 font-medium">On track</div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-lg"></div>
                <div className="relative p-3 border border-white/20 rounded-lg hover:border-white/40 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-orange-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-lg font-bold text-white">{todaysMetrics.appointmentsBooked}</div>
                      <div className="text-xs text-white/80">Meetings</div>
                    </div>
                    <div className="text-xs text-white/60 font-medium">+1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Insights Section */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-white/60 rounded-full"></div>
              <h3 className="text-white/90 font-semibold text-sm uppercase tracking-wide">Smart Insights</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 backdrop-blur-sm border border-emerald-400/20 rounded-lg px-4 py-3 hover:border-emerald-400/40 transition-all duration-300">
                <div className="w-8 h-8 bg-emerald-500/30 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-emerald-200" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">AI Priority Alert</div>
                  <div className="text-xs text-white/80">3 high-value leads opened your emails yesterday</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-blue-600/10 backdrop-blur-sm border border-blue-400/20 rounded-lg px-4 py-3 hover:border-blue-400/40 transition-all duration-300">
                <div className="w-8 h-8 bg-blue-500/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-200" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Next Meeting</div>
                  <div className="text-xs text-white/80">Sales Review with Team in 1h 15m</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Time/Status Panel */}
          {isMobile && (
            <div className="mt-4 flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="text-lg font-mono font-bold text-white">
                  {formattedTime}
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isOnline ? "bg-green-400 animate-pulse" : "bg-red-400"
                  )}></div>
                  <span className="text-sm text-white">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
              <div className="text-xs text-white/70">
                Synced {relativeTime}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}