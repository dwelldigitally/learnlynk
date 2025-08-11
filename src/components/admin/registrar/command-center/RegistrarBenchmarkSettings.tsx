import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  Shield, 
  Users,
  Bell,
  Target
} from "lucide-react";

interface RegistrarBenchmarkSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistrarBenchmarkSettings({ open, onOpenChange }: RegistrarBenchmarkSettingsProps) {
  const [settings, setSettings] = useState({
    processing: {
      applicationProcessingTime: 72, // hours
      documentReviewTime: 24, // hours
      approvalDecisionTime: 48, // hours
      enrollmentConfirmationTime: 12 // hours
    },
    quality: {
      documentApprovalRate: 90, // percentage
      firstReviewAccuracy: 95, // percentage
      enrollmentConversionRate: 75, // percentage
      complianceScore: 95 // percentage
    },
    workload: {
      dailyApplicationTarget: 50,
      maxApplicationsPerReviewer: 15,
      teamCapacityThreshold: 80, // percentage
      overtimeAlertThreshold: 8 // hours
    },
    alerts: {
      slaViolationAlerts: true,
      documentMissingAlerts: true,
      paymentOverdueAlerts: true,
      complianceDeadlineAlerts: true,
      capacityWarningAlerts: true,
      qualityThresholdAlerts: true
    }
  });

  const handleSave = () => {
    // Save settings logic here
    console.log("Saving registrar benchmark settings:", settings);
    onOpenChange(false);
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      processing: {
        applicationProcessingTime: 72,
        documentReviewTime: 24,
        approvalDecisionTime: 48,
        enrollmentConfirmationTime: 12
      },
      quality: {
        documentApprovalRate: 90,
        firstReviewAccuracy: 95,
        enrollmentConversionRate: 75,
        complianceScore: 95
      },
      workload: {
        dailyApplicationTarget: 50,
        maxApplicationsPerReviewer: 15,
        teamCapacityThreshold: 80,
        overtimeAlertThreshold: 8
      },
      alerts: {
        slaViolationAlerts: true,
        documentMissingAlerts: true,
        paymentOverdueAlerts: true,
        complianceDeadlineAlerts: true,
        capacityWarningAlerts: true,
        qualityThresholdAlerts: true
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Registrar Benchmark Settings
          </DialogTitle>
          <DialogDescription>
            Configure performance targets, quality thresholds, and alert preferences for registration operations
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="processing" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="processing">Processing Times</TabsTrigger>
            <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
            <TabsTrigger value="workload">Workload Limits</TabsTrigger>
            <TabsTrigger value="alerts">Alert Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="processing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Processing Time Targets
                </CardTitle>
                <CardDescription>
                  Set SLA targets for various registration processes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicationProcessingTime">Application Processing Time (hours)</Label>
                    <Input
                      id="applicationProcessingTime"
                      type="number"
                      value={settings.processing.applicationProcessingTime}
                      onChange={(e) => setSettings({
                        ...settings,
                        processing: {
                          ...settings.processing,
                          applicationProcessingTime: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Time from application receipt to initial review</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentReviewTime">Document Review Time (hours)</Label>
                    <Input
                      id="documentReviewTime"
                      type="number"
                      value={settings.processing.documentReviewTime}
                      onChange={(e) => setSettings({
                        ...settings,
                        processing: {
                          ...settings.processing,
                          documentReviewTime: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Time to review submitted documents</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approvalDecisionTime">Approval Decision Time (hours)</Label>
                    <Input
                      id="approvalDecisionTime"
                      type="number"
                      value={settings.processing.approvalDecisionTime}
                      onChange={(e) => setSettings({
                        ...settings,
                        processing: {
                          ...settings.processing,
                          approvalDecisionTime: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Time to make final approval decision</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enrollmentConfirmationTime">Enrollment Confirmation (hours)</Label>
                    <Input
                      id="enrollmentConfirmationTime"
                      type="number"
                      value={settings.processing.enrollmentConfirmationTime}
                      onChange={(e) => setSettings({
                        ...settings,
                        processing: {
                          ...settings.processing,
                          enrollmentConfirmationTime: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Time to confirm enrollment after approval</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Quality Benchmarks
                </CardTitle>
                <CardDescription>
                  Set minimum quality thresholds for performance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentApprovalRate">Document Approval Rate (%)</Label>
                    <Input
                      id="documentApprovalRate"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.quality.documentApprovalRate}
                      onChange={(e) => setSettings({
                        ...settings,
                        quality: {
                          ...settings.quality,
                          documentApprovalRate: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Target percentage of documents approved on first review</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstReviewAccuracy">First Review Accuracy (%)</Label>
                    <Input
                      id="firstReviewAccuracy"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.quality.firstReviewAccuracy}
                      onChange={(e) => setSettings({
                        ...settings,
                        quality: {
                          ...settings.quality,
                          firstReviewAccuracy: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Accuracy rate for initial document reviews</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enrollmentConversionRate">Enrollment Conversion Rate (%)</Label>
                    <Input
                      id="enrollmentConversionRate"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.quality.enrollmentConversionRate}
                      onChange={(e) => setSettings({
                        ...settings,
                        quality: {
                          ...settings.quality,
                          enrollmentConversionRate: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Target rate of approved applications that enroll</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complianceScore">Compliance Score (%)</Label>
                    <Input
                      id="complianceScore"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.quality.complianceScore}
                      onChange={(e) => setSettings({
                        ...settings,
                        quality: {
                          ...settings.quality,
                          complianceScore: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Minimum compliance score for regulatory requirements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Workload Management
                </CardTitle>
                <CardDescription>
                  Configure capacity limits and workload distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dailyApplicationTarget">Daily Application Target</Label>
                    <Input
                      id="dailyApplicationTarget"
                      type="number"
                      value={settings.workload.dailyApplicationTarget}
                      onChange={(e) => setSettings({
                        ...settings,
                        workload: {
                          ...settings.workload,
                          dailyApplicationTarget: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Target applications to process per day (team total)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxApplicationsPerReviewer">Max Applications per Reviewer</Label>
                    <Input
                      id="maxApplicationsPerReviewer"
                      type="number"
                      value={settings.workload.maxApplicationsPerReviewer}
                      onChange={(e) => setSettings({
                        ...settings,
                        workload: {
                          ...settings.workload,
                          maxApplicationsPerReviewer: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Maximum applications assigned per reviewer per day</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamCapacityThreshold">Team Capacity Alert (%)</Label>
                    <Input
                      id="teamCapacityThreshold"
                      type="number"
                      min="0"
                      max="100"
                      value={settings.workload.teamCapacityThreshold}
                      onChange={(e) => setSettings({
                        ...settings,
                        workload: {
                          ...settings.workload,
                          teamCapacityThreshold: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Alert when team capacity exceeds this threshold</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="overtimeAlertThreshold">Overtime Alert (hours)</Label>
                    <Input
                      id="overtimeAlertThreshold"
                      type="number"
                      value={settings.workload.overtimeAlertThreshold}
                      onChange={(e) => setSettings({
                        ...settings,
                        workload: {
                          ...settings.workload,
                          overtimeAlertThreshold: parseInt(e.target.value)
                        }
                      })}
                    />
                    <p className="text-xs text-muted-foreground">Alert when daily work hours exceed this limit</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Alert Preferences
                </CardTitle>
                <CardDescription>
                  Configure which alerts and notifications to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="slaViolationAlerts">SLA Violation Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when processing times exceed SLA targets
                      </p>
                    </div>
                    <Switch
                      id="slaViolationAlerts"
                      checked={settings.alerts.slaViolationAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        alerts: {
                          ...settings.alerts,
                          slaViolationAlerts: checked
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="documentMissingAlerts">Missing Document Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Alert when critical documents are missing
                      </p>
                    </div>
                    <Switch
                      id="documentMissingAlerts"
                      checked={settings.alerts.documentMissingAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        alerts: {
                          ...settings.alerts,
                          documentMissingAlerts: checked
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="paymentOverdueAlerts">Payment Overdue Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Notify when tuition payments are overdue
                      </p>
                    </div>
                    <Switch
                      id="paymentOverdueAlerts"
                      checked={settings.alerts.paymentOverdueAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        alerts: {
                          ...settings.alerts,
                          paymentOverdueAlerts: checked
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="complianceDeadlineAlerts">Compliance Deadline Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Alert for upcoming regulatory deadlines
                      </p>
                    </div>
                    <Switch
                      id="complianceDeadlineAlerts"
                      checked={settings.alerts.complianceDeadlineAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        alerts: {
                          ...settings.alerts,
                          complianceDeadlineAlerts: checked
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="capacityWarningAlerts">Capacity Warning Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Warn when team capacity approaches limits
                      </p>
                    </div>
                    <Switch
                      id="capacityWarningAlerts"
                      checked={settings.alerts.capacityWarningAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        alerts: {
                          ...settings.alerts,
                          capacityWarningAlerts: checked
                        }
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="qualityThresholdAlerts">Quality Threshold Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Alert when quality metrics fall below targets
                      </p>
                    </div>
                    <Switch
                      id="qualityThresholdAlerts"
                      checked={settings.alerts.qualityThresholdAlerts}
                      onCheckedChange={(checked) => setSettings({
                        ...settings,
                        alerts: {
                          ...settings.alerts,
                          qualityThresholdAlerts: checked
                        }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}