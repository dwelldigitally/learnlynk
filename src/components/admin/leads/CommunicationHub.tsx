import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { Lead } from '@/types/lead';

interface CommunicationHubProps {
  lead: Lead;
  onUpdate: () => void;
}

export function CommunicationHub({ lead }: CommunicationHubProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Communication Hub
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Communication tools coming soon...</p>
      </CardContent>
    </Card>
  );
}