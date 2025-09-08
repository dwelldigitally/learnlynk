import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Phone, Mail, CheckCircle, Target, Calendar } from 'lucide-react';

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
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

  return (
    <div className="bg-gradient-primary border-b border-border">
      <div className={cn("px-4 lg:px-6 xl:px-8", isMobile ? "py-4" : "py-6")}>
        <div className={cn("flex gap-4", isMobile ? "flex-col" : "flex-col lg:flex-row lg:items-center lg:justify-between")}>
          <div className="text-primary-foreground">
            <h1 className={cn("font-bold", isMobile ? "text-xl" : "text-2xl")}>
              {getGreeting()}, {getDisplayName()}! 👋
            </h1>
            <p className={cn("opacity-90 mt-1", isMobile ? "text-sm" : "")}>
              {formatDate(currentTime)} • Let's make today count!
            </p>
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

        {/* AI Priority Recommendation */}
        <div className="mt-4">
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
            <Target className="w-3 h-3 mr-1" />
            AI Suggestion: Focus on 3 high-value leads from yesterday who opened your emails
          </Badge>
        </div>
      </div>
    </div>
  );
}