import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const syncTimer = setInterval(() => setLastSync(new Date()), 30000);
    return () => clearInterval(syncTimer);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDisplayName = () => {
    if (profile?.first_name) {
      return `${profile.first_name} ${profile.last_name || ''}`.trim();
    }
    return user?.email?.split('@')[0] || 'Sales Rep';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gradient-primary border-b border-border">
      <div className={cn("px-4 lg:px-6 xl:px-8", isMobile ? "py-4" : "py-6")}>
        <div className={cn("flex gap-4", isMobile ? "flex-col" : "flex-col lg:flex-row lg:items-center lg:justify-between")}>
          <div className="text-primary-foreground">
            <div className="flex items-center gap-4 mb-2">
              <div>
                <h1 className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>
                  {getGreeting()}, {getDisplayName()}! 👋
                </h1>
                {profile?.title && (
                  <p className={cn("opacity-80 text-sm mt-0.5")}>
                    {profile.title} {profile.department && `• ${profile.department}`}
                  </p>
                )}
              </div>
              
              {!isMobile && (
                <div className="ml-auto flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-mono font-bold">
                      {formatTime(currentTime)}
                    </div>
                    <div className="text-xs opacity-80">
                      {currentTime.toLocaleDateString('en-US', { timeZoneName: 'short' }).split(', ')[1]}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <Wifi className="w-4 h-4 text-green-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-400" />
                    )}
                    <div className="text-xs opacity-80">
                      {isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <p className={cn("opacity-90", isMobile ? "text-sm" : "")}>
                {formatDate(currentTime)} • Let's make today count!
              </p>
              
              {!isMobile && (
                <div className="text-xs opacity-80">
                  Last sync: {formatRelativeTime(lastSync)}
                </div>
              )}
            </div>
          </div>

          <div className={cn("grid gap-4", isMobile ? "grid-cols-2" : "grid-cols-4")}>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className={cn("p-3 text-center", isMobile ? "p-2" : "")}>
                <Phone className="w-4 h-4 mx-auto mb-1 text-primary-foreground" />
                <div className="text-lg font-bold text-primary-foreground">{todaysMetrics.callsMade}</div>
                <div className="text-xs text-primary-foreground/80">Calls</div>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className={cn("p-3 text-center", isMobile ? "p-2" : "")}>
                <Mail className="w-4 h-4 mx-auto mb-1 text-primary-foreground" />
                <div className="text-lg font-bold text-primary-foreground">{todaysMetrics.emailsSent}</div>
                <div className="text-xs text-primary-foreground/80">Emails</div>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className={cn("p-3 text-center", isMobile ? "p-2" : "")}>
                <CheckCircle className="w-4 h-4 mx-auto mb-1 text-primary-foreground" />
                <div className="text-lg font-bold text-primary-foreground">{todaysMetrics.tasksCompleted}</div>
                <div className="text-xs text-primary-foreground/80">Tasks</div>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 border-primary-foreground/20">
              <CardContent className={cn("p-3 text-center", isMobile ? "p-2" : "")}>
                <Calendar className="w-4 h-4 mx-auto mb-1 text-primary-foreground" />
                <div className="text-lg font-bold text-primary-foreground">{todaysMetrics.appointmentsBooked}</div>
                <div className="text-xs text-primary-foreground/80">Meetings</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Priority Recommendation and Next Appointment */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            <Target className="w-3 h-3 mr-1" />
            AI Suggestion: Focus on 3 high-value leads from yesterday who opened your emails
          </Badge>
          
          <Badge variant="outline" className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30">
            <Users className="w-3 h-3 mr-1" />
            Next: Sales Review with Team in 1h 15m
          </Badge>
        </div>
      </div>
    </div>
  );
}