import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle2, RefreshCw, Users } from 'lucide-react';
import { BulkEnrollmentService, EnrollmentResult } from '@/services/bulkEnrollmentService';
import { useToast } from '@/hooks/use-toast';

interface ReEnrollAllDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ReEnrollAllDialog({ open, onOpenChange, onSuccess }: ReEnrollAllDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<EnrollmentResult | null>(null);
  const { toast } = useToast();

  const handleReEnrollAll = async () => {
    setIsProcessing(true);
    setProgress(0);
    setResult(null);

    try {
      const enrollmentResult = await BulkEnrollmentService.reEnrollAllLeads(
        (processed, total) => {
          const percentage = total > 0 ? Math.round((processed / total) * 100) : 0;
          setProgress(percentage);
        }
      );

      setResult(enrollmentResult);
      
      if (enrollmentResult.errors.length === 0) {
        toast({
          title: "Re-enrollment Complete",
          description: `${enrollmentResult.assigned} leads assigned, ${enrollmentResult.skipped} remain unassigned`
        });
        onSuccess();
      } else {
        toast({
          title: "Re-enrollment Completed with Errors",
          description: `${enrollmentResult.assigned} assigned, ${enrollmentResult.errors.length} errors`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during re-enrollment:', error);
      toast({
        title: "Error",
        description: "Failed to re-enroll leads",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setResult(null);
      setProgress(0);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            Re-enroll All Leads
          </DialogTitle>
          <DialogDescription>
            This will clear all existing lead assignments and re-run routing rules. Leads that don't match any rule will remain unassigned.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-600">Warning</p>
                <p className="text-muted-foreground">
                  All current lead assignments will be cleared. Only leads matching active routing rules will be reassigned.
                </p>
              </div>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processing leads...</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="font-medium text-emerald-600">Re-enrollment Complete</p>
                <p className="text-sm text-muted-foreground">
                  {result.processed} leads processed
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{result.assigned}</p>
                <p className="text-xs text-muted-foreground">Leads Assigned</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">{result.skipped}</p>
                <p className="text-xs text-muted-foreground">Unassigned</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm font-medium text-destructive mb-1">
                  {result.errors.length} errors occurred
                </p>
                <p className="text-xs text-muted-foreground">
                  {result.errors[0]}
                </p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!result ? (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleReEnrollAll} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-enroll All Leads
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleClose}>
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
