import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Info, RefreshCw, CheckCircle, AlertCircle, Users, Calendar, Bell } from "lucide-react";
import { EnhancedRoutingRule } from "@/types/routing";
import { BulkEnrollmentService } from "@/services/bulkEnrollmentService";
import { useToast } from "@/hooks/use-toast";

interface ReEnrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: EnhancedRoutingRule;
  onSuccess?: () => void;
}

export const ReEnrollDialog: React.FC<ReEnrollDialogProps> = ({
  open,
  onOpenChange,
  rule,
  onSuccess
}) => {
  const { toast } = useToast();
  const [preview, setPreview] = useState({ total_matching: 0, already_assigned: 0, eligible: 0 });
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ processed: number; assigned: number; skipped: number } | null>(null);

  const [options, setOptions] = useState({
    only_unassigned: true,
    date_range_days: undefined as number | undefined,
    notify_advisors: true
  });

  useEffect(() => {
    if (open) {
      loadPreview();
    } else {
      // Reset state when dialog closes
      setResult(null);
      setProgress(0);
    }
  }, [open, options.only_unassigned, options.date_range_days]);

  const loadPreview = async () => {
    setLoadingPreview(true);
    try {
      const previewResult = await BulkEnrollmentService.getEnrollmentPreview(rule, options);
      setPreview(previewResult);
    } catch (error) {
      console.error('Error loading preview:', error);
      toast({
        title: "Error",
        description: "Failed to load preview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    setProgress(0);
    
    try {
      const enrollmentResult = await BulkEnrollmentService.enrollExistingLeads(
        rule,
        options,
        're_enrollment',
        (processed, total) => {
          setProgress((processed / Math.max(total, 1)) * 100);
        }
      );

      setResult(enrollmentResult);

      if (enrollmentResult.errors.length === 0) {
        toast({
          title: "Re-enrollment Complete",
          description: `Successfully assigned ${enrollmentResult.assigned} leads. ${enrollmentResult.skipped} leads were skipped.`,
        });
        onSuccess?.();
      } else {
        toast({
          title: "Re-enrollment Completed with Errors",
          description: `Assigned ${enrollmentResult.assigned} leads, but encountered ${enrollmentResult.errors.length} errors.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during enrollment:', error);
      toast({
        title: "Error",
        description: "Failed to re-enroll leads. Please try again.",
        variant: "destructive"
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleClose = () => {
    if (!enrolling) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Re-enroll Existing Leads
          </DialogTitle>
          <DialogDescription>
            Apply "{rule.name}" routing rule to existing leads in your database
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!result ? (
            <>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="re-only-unassigned"
                    checked={options.only_unassigned}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, only_unassigned: checked as boolean }))
                    }
                    disabled={enrolling}
                  />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="re-only-unassigned" className="font-medium cursor-pointer flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Only unassigned leads
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Skip leads that are already assigned to an advisor
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="re-date-range"
                    checked={!!options.date_range_days}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, date_range_days: checked ? 30 : undefined }))
                    }
                    disabled={enrolling}
                  />
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="re-date-range" className="font-medium cursor-pointer flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Limit to recent leads
                    </Label>
                    {options.date_range_days && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="365"
                          value={options.date_range_days}
                          onChange={(e) => 
                            setOptions(prev => ({ ...prev, date_range_days: parseInt(e.target.value) || 30 }))
                          }
                          className="w-24"
                          disabled={enrolling}
                        />
                        <span className="text-sm text-muted-foreground">days</span>
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Only enroll leads created within the specified number of days
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="re-notify-advisors"
                    checked={options.notify_advisors}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, notify_advisors: checked as boolean }))
                    }
                    disabled={enrolling}
                  />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="re-notify-advisors" className="font-medium cursor-pointer flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notify advisors
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to advisors when leads are assigned to them
                    </p>
                  </div>
                </div>
              </div>

              {loadingPreview ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>Loading preview...</AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{preview.eligible}</strong> leads will be processed for enrollment
                    {preview.already_assigned > 0 && ` (${preview.already_assigned} already assigned)`}
                  </AlertDescription>
                </Alert>
              )}

              {enrolling && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing leads...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <Alert className={result.assigned > 0 ? "border-green-500" : ""}>
                {result.assigned > 0 ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Enrollment Results:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Leads processed: {result.processed}</li>
                      <li>Leads assigned: {result.assigned}</li>
                      <li>Leads skipped: {result.skipped}</li>
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={enrolling}
          >
            {result ? "Close" : "Cancel"}
          </Button>
          {!result && (
            <Button
              onClick={handleEnroll}
              disabled={enrolling || loadingPreview || preview.eligible === 0}
            >
              {enrolling ? "Enrolling..." : "Start Re-enrollment"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
