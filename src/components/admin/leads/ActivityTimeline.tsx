import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Lead } from '@/types/lead';

interface ActivityTimelineProps {
  lead: Lead;
}

export function ActivityTimeline({ lead }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Activity timeline coming soon...</p>
      </CardContent>
    </Card>
  );
}