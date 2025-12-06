import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

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
  // Handle edge case where total is 0 to avoid NaN
  const totalDocs = progress.total || 0;
  const uploadedCount = progress.approved + progress.pending + progress.rejected;
  const completionPercentage = totalDocs > 0 
    ? Math.round((progress.approved / totalDocs) * 100) 
    : uploadedCount > 0 
      ? Math.round((progress.approved / uploadedCount) * 100)
      : 0;

  // Display text for badge
  const badgeText = totalDocs > 0 
    ? `${progress.approved}/${totalDocs} Complete`
    : `${progress.approved} Approved`;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Document Overview
          </span>
          <Badge variant={progress.isComplete ? 'default' : 'secondary'}>
            {badgeText}
          </Badge>
        </CardTitle>
        <CardDescription>
          Track document submission and approval status
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">Approved</p>
                <p className="text-sm text-muted-foreground">Ready for review</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">{progress.approved}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-medium">Pending Review</p>
                <p className="text-sm text-muted-foreground">Awaiting approval</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{progress.pending}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-medium">Rejected</p>
                <p className="text-sm text-muted-foreground">Needs resubmission</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-red-600 dark:text-red-400">{progress.rejected}</span>
          </div>

          <div className="pt-2">
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground text-center mt-2">
              {totalDocs > 0 
                ? `Overall completion: ${completionPercentage}%`
                : uploadedCount > 0 
                  ? `${progress.approved} of ${uploadedCount} documents approved`
                  : 'No documents uploaded yet'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
