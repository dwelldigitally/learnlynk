import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  type: 'lead' | 'application' | 'payment' | 'task' | 'communication' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
  icon: LucideIcon;
  priority?: 'low' | 'medium' | 'high';
}

interface ActivityFeedItemProps {
  activity: ActivityItem;
  onClick?: () => void;
}

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({ activity, onClick }) => {
  const Icon = activity.icon;
  
  const getPriorityColor = () => {
    switch (activity.priority) {
      case 'high':
        return 'bg-red-500/10 text-red-600 border-red-200';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'low':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeColor = () => {
    switch (activity.type) {
      case 'lead':
        return 'text-blue-600';
      case 'application':
        return 'text-purple-600';
      case 'payment':
        return 'text-green-600';
      case 'task':
        return 'text-orange-600';
      case 'communication':
        return 'text-pink-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div 
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className={cn("p-2 rounded-full bg-muted", getTypeColor())}>
        <Icon className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-medium text-foreground truncate">{activity.title}</h4>
          {activity.priority && (
            <Badge variant="outline" className={cn("text-xs shrink-0", getPriorityColor())}>
              {activity.priority}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
        
        <div className="flex items-center gap-3 mt-2">
          {activity.user && (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback className="text-xs">{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{activity.user.name}</span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};
