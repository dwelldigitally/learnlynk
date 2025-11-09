import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, GripVertical } from 'lucide-react';
import { Lead } from '@/types/lead';

interface ProgramDetailsWidgetProps {
  lead: Lead;
}

export function ProgramDetailsWidget({ lead }: ProgramDetailsWidgetProps) {
  return (
    <Card className="h-full">
      <CardHeader className="cursor-move drag-handle">
        <CardTitle className="text-lg flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <GraduationCap className="h-5 w-5 text-primary" />
          Program Details
        </CardTitle>
        <CardDescription>
          Selected program and requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Program Name</p>
            <p className="font-semibold text-lg text-foreground">
              {lead.program_interest?.[0] || 'No program selected'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium text-foreground">2 Years</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="font-medium text-foreground">
                {lead.program_interest?.[0]?.includes('Diploma') ? 'Diploma' : 
                 lead.program_interest?.[0]?.includes('Certificate') ? 'Certificate' : 
                 'Degree'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Study Mode</p>
              <p className="font-medium text-foreground">Full-time</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Campus</p>
              <p className="font-medium text-foreground">Main Campus</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
