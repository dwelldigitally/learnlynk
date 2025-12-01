import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconContainer, PastelBadge, getPriorityColor, getActivityTypeColor } from '@/components/hotsheet';

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
  const typeColor = getActivityTypeColor(activity.type);

  return (
    <div 
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border border-border/40 bg-card hover:bg-muted/5 hover:border-primary/20 transition-all duration-200",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <IconContainer color={typeColor} size="md">
        <Icon />
      </IconContainer>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-medium text-foreground truncate">{activity.title}</h4>
          {activity.priority && (
            <PastelBadge color={getPriorityColor(activity.priority)} size="sm">
              {activity.priority}
            </PastelBadge>
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
