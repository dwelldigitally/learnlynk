import { useState, useEffect } from "react";
import { Clock, Calendar, CheckSquare, Users, Wifi, WifiOff, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { formatDistanceToNow } from "date-fns";

interface QuickStatsProps {
  className?: string;
}

export function RealTimeClock({ className }: { className?: string }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { profile } = useProfile();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: profile?.timezone || 'UTC'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: profile?.timezone || 'UTC'
    });
  };

  return (
    <div className={`flex flex-col items-center text-white/90 ${className}`}>
      <div className="text-sm font-medium">
        {formatTime(currentTime)}
      </div>
      <div className="text-xs text-white/70">
        {formatDate(currentTime)}
      </div>
    </div>
  );
}

export function QuickStats({ className }: QuickStatsProps) {
  const [stats, setStats] = useState({
    todayTasks: 8,
    pendingTasks: 3,
    activeLeads: 12,
    todayMeetings: 2
  });

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Today's Tasks */}
      <div className="flex items-center space-x-1 text-white/90">
        <CheckSquare className="w-4 h-4" />
        <span className="text-sm font-medium">{stats.todayTasks}</span>
        <span className="text-xs text-white/70 hidden lg:inline">tasks</span>
      </div>

      {/* Pending Items */}
      <div className="flex items-center space-x-1 text-white/90">
        <Clock className="w-4 h-4" />
        <Badge variant="destructive" className="text-xs">
          {stats.pendingTasks}
        </Badge>
      </div>

      {/* Active Leads */}
      <div className="flex items-center space-x-1 text-white/90">
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">{stats.activeLeads}</span>
        <span className="text-xs text-white/70 hidden lg:inline">leads</span>
      </div>

      {/* Today's Meetings */}
      <div className="flex items-center space-x-1 text-white/90">
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">{stats.todayMeetings}</span>
        <span className="text-xs text-white/70 hidden lg:inline">meetings</span>
      </div>
    </div>
  );
}

export function UserContextInfo({ className }: { className?: string }) {
  const { profile } = useProfile();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <div className={`flex items-center space-x-2 text-white/90 ${className}`}>
      <div className="flex flex-col items-end text-right">
        <div className="text-sm font-medium">
          {greeting}, {profile?.first_name || 'User'}
        </div>
        <div className="text-xs text-white/70">
          {profile?.title || profile?.department || 'Team Member'}
        </div>
      </div>
    </div>
  );
}

export function SystemStatus({ className }: { className?: string }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate sync updates
    const syncTimer = setInterval(() => {
      if (isOnline) {
        setLastSync(new Date());
      }
    }, 30000); // Update every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncTimer);
    };
  }, [isOnline]);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center space-x-1">
        {isOnline ? (
          <Wifi className="w-4 h-4 text-green-400" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-400" />
        )}
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
      </div>

      {/* Last Sync Indicator */}
      <div className="text-xs text-white/60 hidden lg:block">
        Synced {formatDistanceToNow(lastSync, { addSuffix: true })}
      </div>
    </div>
  );
}

export function NextAppointmentReminder({ className }: { className?: string }) {
  const [nextMeeting, setNextMeeting] = useState({
    title: "Team Standup",
    time: "2:30 PM",
    in: "45 min"
  });

  return (
    <div className={`flex items-center space-x-2 text-white/90 ${className}`}>
      <Calendar className="w-4 h-4 text-yellow-400" />
      <div className="flex flex-col">
        <div className="text-xs font-medium">{nextMeeting.title}</div>
        <div className="text-xs text-white/70">in {nextMeeting.in}</div>
      </div>
    </div>
  );
}