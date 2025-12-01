import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Calendar, Users, Bell } from "lucide-react";
import { EnhancedRoutingRule } from "@/types/routing";
import { BulkEnrollmentService } from "@/services/bulkEnrollmentService";

interface EnrollmentSettingsStepProps {
  data: Partial<EnhancedRoutingRule>;
  onDataChange: (updates: Partial<EnhancedRoutingRule>) => void;
}

export const EnrollmentSettingsStep: React.FC<EnrollmentSettingsStepProps> = ({
  data,
  onDataChange
}) => {
  const [preview, setPreview] = useState({ total_matching: 0, already_assigned: 0, eligible: 0 });
  const [loadingPreview, setLoadingPreview] = useState(false);

  const enrollmentConfig = data.enrollment_config || {
    enroll_existing: false,
    only_unassigned: true,
    notify_advisors: true
  };

  useEffect(() => {
    if (enrollmentConfig.enroll_existing && data.condition_groups) {
      loadPreview();
    }
  }, [
    enrollmentConfig.enroll_existing,
    enrollmentConfig.only_unassigned,
    enrollmentConfig.date_range_days
  ]);

  const loadPreview = async () => {
    setLoadingPreview(true);
    try {
      const result = await BulkEnrollmentService.getEnrollmentPreview(
        data as EnhancedRoutingRule,
        {
          only_unassigned: enrollmentConfig.only_unassigned,
          date_range_days: enrollmentConfig.date_range_days,
          notify_advisors: enrollmentConfig.notify_advisors
        }
      );
      setPreview(result);
    } catch (error) {
      console.error('Error loading preview:', error);
    } finally {
      setLoadingPreview(false);
    }
  };

  const updateEnrollmentConfig = (updates: Partial<typeof enrollmentConfig>) => {
    onDataChange({
      enrollment_config: {
        ...enrollmentConfig,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lead Enrollment</CardTitle>
          <CardDescription>
            Choose whether to apply this routing rule to existing leads or only new leads going forward
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={enrollmentConfig.enroll_existing ? "existing" : "new"}
            onValueChange={(value) => updateEnrollmentConfig({ enroll_existing: value === "existing" })}
          >
            <div className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg">
              <RadioGroupItem value="new" id="enroll-new" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="enroll-new" className="font-medium cursor-pointer">
                  Enroll leads from now onwards
                </Label>
                <p className="text-sm text-muted-foreground">
                  Only apply this routing rule to new leads created after activation. Existing leads will not be affected.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-y-0 p-4 border rounded-lg">
              <RadioGroupItem value="existing" id="enroll-existing" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="enroll-existing" className="font-medium cursor-pointer">
                  Enroll all previous leads
                </Label>
                <p className="text-sm text-muted-foreground">
                  Apply this routing rule retroactively to existing leads in your database that match the conditions.
                </p>
              </div>
            </div>
          </RadioGroup>

          {enrollmentConfig.enroll_existing && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center gap-2">
                <Info className="h-4 w-4" />
                Advanced Options
              </h4>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Checkbox
                    id="only-unassigned"
                    checked={enrollmentConfig.only_unassigned}
                    onCheckedChange={(checked) => 
                      updateEnrollmentConfig({ only_unassigned: checked as boolean })
                    }
                  />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="only-unassigned" className="font-medium cursor-pointer flex items-center gap-2">
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
                    id="date-range"
                    checked={!!enrollmentConfig.date_range_days}
                    onCheckedChange={(checked) => 
                      updateEnrollmentConfig({ date_range_days: checked ? 30 : undefined })
                    }
                  />
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="date-range" className="font-medium cursor-pointer flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Limit to recent leads
                    </Label>
                    {enrollmentConfig.date_range_days && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="365"
                          value={enrollmentConfig.date_range_days}
                          onChange={(e) => 
                            updateEnrollmentConfig({ date_range_days: parseInt(e.target.value) || 30 })
                          }
                          className="w-24"
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
                    id="notify-advisors"
                    checked={enrollmentConfig.notify_advisors}
                    onCheckedChange={(checked) => 
                      updateEnrollmentConfig({ notify_advisors: checked as boolean })
                    }
                  />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="notify-advisors" className="font-medium cursor-pointer flex items-center gap-2">
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
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          You can re-enroll leads at any time after creating the rule from the rule's action menu.
        </AlertDescription>
      </Alert>
    </div>
  );
};
