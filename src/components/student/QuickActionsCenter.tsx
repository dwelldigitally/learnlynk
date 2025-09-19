import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageSquare, Upload, CreditCard, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  urgent?: boolean;
  count?: number;
  type: 'notification' | 'message' | 'task' | 'deadline';
}

const quickActions: QuickAction[] = [
  {
    id: 'fees',
    title: 'Fee Payment Due',
    description: 'Winter term fees due in 3 days - $2,450',
    icon: CreditCard,
    urgent: true,
    type: 'deadline'
  },
  {
    id: 'document',
    title: 'Upload Required Documents',
    description: 'Transcript and immunization records needed',
    icon: Upload,
    urgent: true,
    type: 'task'
  },
  {
    id: 'grades',
    title: 'New Grades Posted',
    description: 'COMP 2714 - Database Systems final grade available',
    icon: Bell,
    type: 'notification'
  },
  {
    id: 'meeting',
    title: 'Academic Advisor Meeting',
    description: 'Tomorrow at 2:00 PM - Room 204A',
    icon: Calendar,
    type: 'notification'
  },
  {
    id: 'message',
    title: 'New Messages',
    description: 'From admissions office and financial aid',
    icon: MessageSquare,
    count: 3,
    type: 'message'
  },
  {
    id: 'registration',
    title: 'Course Registration Opens',
    description: 'Spring 2025 registration begins Monday',
    icon: Calendar,
    type: 'notification'
  }
];

export const QuickActionsCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const urgentCount = quickActions.filter(action => action.urgent).length;
  const totalCount = quickActions.reduce((acc, action) => acc + (action.count || (action.urgent ? 1 : 0)), 0);

  const getActionIcon = (type: string, urgent?: boolean) => {
    if (urgent) return AlertTriangle;
    switch (type) {
      case 'notification': return Bell;
      case 'message': return MessageSquare;
      case 'task': return CheckCircle;
      case 'deadline': return Clock;
      default: return Bell;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          {totalCount > 0 && (
            <Badge 
              variant={urgentCount > 0 ? "destructive" : "secondary"} 
              className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center"
            >
              {totalCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Notifications & Actions</h3>
          <p className="text-xs text-muted-foreground">
            {urgentCount > 0 ? `${urgentCount} urgent items require attention` : 'All caught up!'}
          </p>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {quickActions.map((action, index) => {
            const ActionIcon = getActionIcon(action.type, action.urgent);
            
            return (
              <div key={action.id}>
                <div className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      action.urgent 
                        ? 'bg-destructive/10 text-destructive' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <ActionIcon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{action.title}</h4>
                        {action.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                        {action.count && (
                          <Badge variant="secondary" className="text-xs">
                            {action.count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
                {index < quickActions.length - 1 && <Separator />}
              </div>
            );
          })}
        </div>
        
        <div className="p-3 border-t bg-muted/20">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              View All
            </Button>
            <Button size="sm" className="flex-1">
              Mark All Read
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};