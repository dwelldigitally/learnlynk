import { Card, CardContent } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';
import { QuickActions } from '../QuickActions';

export const QuickActionsWidget = () => {
  return (
    <Card className="h-full flex flex-col">
      <div className="drag-handle cursor-move p-4 flex justify-end">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <CardContent className="flex-1 overflow-auto p-4 pt-0">
        <QuickActions />
      </CardContent>
    </Card>
  );
};
