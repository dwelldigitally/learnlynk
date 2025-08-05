import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap } from 'lucide-react';
import { Lead } from '@/types/lead';

interface ProgramInterestProps {
  lead: Lead;
  onUpdate: () => void;
}

export function ProgramInterest({ lead }: ProgramInterestProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Program Interest
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Interested Programs</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {lead.program_interest?.map((program, index) => (
              <Badge key={index} variant="outline">{program}</Badge>
            )) || <span className="text-sm text-muted-foreground">No programs specified</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}