import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GripVertical, Target } from 'lucide-react';
import { NewlyAssignedLeads } from '../NewlyAssignedLeads';

export const NewAssignmentsWidget = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="drag-handle cursor-move p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>New Assignments</span>
            </CardTitle>
            <CardDescription className="mt-1.5">
              Leads that need your immediate attention
            </CardDescription>
          </div>
          <GripVertical className="h-4 w-4 text-muted-foreground ml-2" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto px-5 pb-5 pt-0">
        <NewlyAssignedLeads />
      </CardContent>
    </Card>
  );
};
