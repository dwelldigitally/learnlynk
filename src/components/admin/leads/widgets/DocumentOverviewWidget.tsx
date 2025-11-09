import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckCircle, Clock, XCircle, GripVertical } from 'lucide-react';

interface DocumentProgress {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  isComplete: boolean;
}

interface DocumentOverviewWidgetProps {
  progress: DocumentProgress;
}

export function DocumentOverviewWidget({ progress }: DocumentOverviewWidgetProps) {
  return (
    <Card className="h-full">
      <CardHeader className="cursor-move drag-handle">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <FileText className="h-5 w-5 text-primary" />
            Document Overview
          </span>
          <Badge variant={progress.isComplete ? 'default' : 'secondary'}>
            {progress.approved}/{progress.total} Complete
          </Badge>
        </CardTitle>
        <CardDescription>
          Track document submission and approval status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Approved</p>
                <p className="text-sm text-muted-foreground">Ready for review</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-green-600">{progress.approved}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">Pending Review</p>
                <p className="text-sm text-muted-foreground">Awaiting approval</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-yellow-600">{progress.pending}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium">Rejected</p>
                <p className="text-sm text-muted-foreground">Needs resubmission</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-red-600">{progress.rejected}</span>
          </div>

          <div className="pt-2">
            <Progress value={(progress.approved / progress.total) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Overall completion: {Math.round((progress.approved / progress.total) * 100)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
