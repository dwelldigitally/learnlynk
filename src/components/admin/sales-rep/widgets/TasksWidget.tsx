import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GripVertical, CheckSquare } from 'lucide-react';
import { TodaysTasks } from '../TodaysTasks';

export const TasksWidget = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="drag-handle cursor-move">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-green-600" />
            <span>Today's Tasks</span>
          </CardTitle>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <TodaysTasks />
      </CardContent>
    </Card>
  );
};
