import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare } from 'lucide-react';
import { Lead } from '@/types/lead';

interface TasksAndNotesProps {
  lead: Lead;
  onUpdate: () => void;
}

export function TasksAndNotes({ lead }: TasksAndNotesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Tasks & Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Task management coming soon...</p>
      </CardContent>
    </Card>
  );
}