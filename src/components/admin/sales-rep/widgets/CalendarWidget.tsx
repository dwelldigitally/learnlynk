import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GripVertical, Calendar } from 'lucide-react';
import { EnhancedCalendar } from '../EnhancedCalendar';

export const CalendarWidget = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="drag-handle cursor-move p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Calendar</span>
          </CardTitle>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0">
        <EnhancedCalendar />
      </CardContent>
    </Card>
  );
};
