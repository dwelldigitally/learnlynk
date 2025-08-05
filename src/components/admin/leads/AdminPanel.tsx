import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { Lead, LeadStatus } from '@/types/lead';

interface AdminPanelProps {
  lead: Lead;
  onUpdate: () => void;
  onStatusChange: (status: LeadStatus) => void;
}

export function AdminPanel({ lead }: AdminPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Admin Panel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Admin tools coming soon...</p>
      </CardContent>
    </Card>
  );
}