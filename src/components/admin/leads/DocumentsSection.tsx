import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Lead } from '@/types/lead';

interface DocumentsSectionProps {
  lead: Lead;
  onUpdate: () => void;
}

export function DocumentsSection({ lead }: DocumentsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Document management coming soon...</p>
      </CardContent>
    </Card>
  );
}