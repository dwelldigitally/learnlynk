import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  Bell, 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  AlertTriangle,
  Shield,
  Mail,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Program {
  id: string;
  name: string;
  status: string;
}

interface ProgramSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
}

export const ProgramSettingsModal = ({ isOpen, onClose, program }: ProgramSettingsModalProps) => {
  const { toast } = useToast();
  
  // Settings state
  const [settings, setSettings] = useState({
    // Enrollment Settings
    autoAcceptApplications: false,
    requireManualReview: true,
    waitlistEnabled: true,
    capacityAlerts: true,
    
    // Notification Settings
    enrollmentNotifications: true,
    applicationNotifications: true,
    intakeReminderNotifications: true,
    emailNotifications: true,
    
    // Marketing Settings
    publiclyVisible: true,
    featuredProgram: false,
    allowOnlineApplications: true,
    showAvailableSpots: true,
    
    // Financial Settings
    paymentPlansEnabled: true,
    earlyBirdDiscount: false,
    scholarshipEligible: true,
    
    // Document Requirements
    transcriptRequired: true,
    personalStatementRequired: true,
    referencesRequired: true,
    portfolioRequired: false,
  });

  const [customSettings, setCustomSettings] = useState({
    applicationDeadlineDays: "30",
    withdrawalDeadlineDays: "14",
    customApplicationInstructions: "",
    contactEmail: "",
    maxApplicationsPerIntake: "100",
  });

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCustomSettingChange = (key: string, value: string) => {
    setCustomSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    console.log("Saving settings:", { settings, customSettings });
    toast({
      title: "Settings Updated",
      description: "Program settings have been saved successfully.",
    });
    onClose();
  };

  const handleResetSettings = () => {
    setSettings({
      autoAcceptApplications: false,
      requireManualReview: true,
      waitlistEnabled: true,
      capacityAlerts: true,
      enrollmentNotifications: true,
      applicationNotifications: true,
      intakeReminderNotifications: true,
      emailNotifications: true,
      publiclyVisible: true,
      featuredProgram: false,
      allowOnlineApplications: true,
      showAvailableSpots: true,
      paymentPlansEnabled: true,
      earlyBirdDiscount: false,
      scholarshipEligible: true,
      transcriptRequired: true,
      personalStatementRequired: true,
      referencesRequired: true,
      portfolioRequired: false,
    });
    
    setCustomSettings({
      applicationDeadlineDays: "30",
      withdrawalDeadlineDays: "14",
      customApplicationInstructions: "",
      contactEmail: "",
      maxApplicationsPerIntake: "100",
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  if (!program) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <DialogTitle>Program Settings - {program.name}</DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="enrollment" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="enrollment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Enrollment Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-Accept Applications</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically accept applications that meet basic requirements
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoAcceptApplications}
                    onCheckedChange={(value) => handleSettingChange('autoAcceptApplications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Require Manual Review</Label>
                    <p className="text-sm text-muted-foreground">
                      All applications require manual review before acceptance
                    </p>
                  </div>
                  <Switch
                    checked={settings.requireManualReview}
                    onCheckedChange={(value) => handleSettingChange('requireManualReview', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable Waitlist</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow students to join waitlist when program is full
                    </p>
                  </div>
                  <Switch
                    checked={settings.waitlistEnabled}
                    onCheckedChange={(value) => handleSettingChange('waitlistEnabled', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Capacity Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when enrollment reaches 80% capacity
                    </p>
                  </div>
                  <Switch
                    checked={settings.capacityAlerts}
                    onCheckedChange={(value) => handleSettingChange('capacityAlerts', value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Application Deadline (days before intake)</Label>
                    <Input
                      type="number"
                      value={customSettings.applicationDeadlineDays}
                      onChange={(e) => handleCustomSettingChange('applicationDeadlineDays', e.target.value)}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label>Max Applications per Intake</Label>
                    <Input
                      type="number"
                      value={customSettings.maxApplicationsPerIntake}
                      onChange={(e) => handleCustomSettingChange('maxApplicationsPerIntake', e.target.value)}
                      placeholder="100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enrollment Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new enrollments and status changes
                    </p>
                  </div>
                  <Switch
                    checked={settings.enrollmentNotifications}
                    onCheckedChange={(value) => handleSettingChange('enrollmentNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Application Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive alerts for new applications and reviews needed
                    </p>
                  </div>
                  <Switch
                    checked={settings.applicationNotifications}
                    onCheckedChange={(value) => handleSettingChange('applicationNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Intake Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders about upcoming intake dates
                    </p>
                  </div>
                  <Switch
                    checked={settings.intakeReminderNotifications}
                    onCheckedChange={(value) => handleSettingChange('intakeReminderNotifications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email in addition to in-app
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
                  />
                </div>

                <div>
                  <Label>Contact Email for Inquiries</Label>
                  <Input
                    type="email"
                    value={customSettings.contactEmail}
                    onChange={(e) => handleCustomSettingChange('contactEmail', e.target.value)}
                    placeholder="program.coordinator@college.edu"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Marketing & Visibility</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Publicly Visible</Label>
                    <p className="text-sm text-muted-foreground">
                      Show this program on public website and course catalog
                    </p>
                  </div>
                  <Switch
                    checked={settings.publiclyVisible}
                    onCheckedChange={(value) => handleSettingChange('publiclyVisible', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Featured Program</Label>
                    <p className="text-sm text-muted-foreground">
                      Highlight this program on homepage and marketing materials
                    </p>
                  </div>
                  <Switch
                    checked={settings.featuredProgram}
                    onCheckedChange={(value) => handleSettingChange('featuredProgram', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Online Applications</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable students to apply online through the website
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowOnlineApplications}
                    onCheckedChange={(value) => handleSettingChange('allowOnlineApplications', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Available Spots</Label>
                    <p className="text-sm text-muted-foreground">
                      Display remaining capacity to prospective students
                    </p>
                  </div>
                  <Switch
                    checked={settings.showAvailableSpots}
                    onCheckedChange={(value) => handleSettingChange('showAvailableSpots', value)}
                  />
                </div>

                <div>
                  <Label>Custom Application Instructions</Label>
                  <Textarea
                    value={customSettings.customApplicationInstructions}
                    onChange={(e) => handleCustomSettingChange('customApplicationInstructions', e.target.value)}
                    placeholder="Additional instructions for applicants..."
                    className="min-h-20"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Financial Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Payment Plans Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow students to pay tuition in installments
                    </p>
                  </div>
                  <Switch
                    checked={settings.paymentPlansEnabled}
                    onCheckedChange={(value) => handleSettingChange('paymentPlansEnabled', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Early Bird Discount</Label>
                    <p className="text-sm text-muted-foreground">
                      Offer discounts for early applications
                    </p>
                  </div>
                  <Switch
                    checked={settings.earlyBirdDiscount}
                    onCheckedChange={(value) => handleSettingChange('earlyBirdDiscount', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Scholarship Eligible</Label>
                    <p className="text-sm text-muted-foreground">
                      Students in this program can apply for scholarships
                    </p>
                  </div>
                  <Switch
                    checked={settings.scholarshipEligible}
                    onCheckedChange={(value) => handleSettingChange('scholarshipEligible', value)}
                  />
                </div>

                <div>
                  <Label>Withdrawal Deadline (days after start)</Label>
                  <Input
                    type="number"
                    value={customSettings.withdrawalDeadlineDays}
                    onChange={(e) => handleCustomSettingChange('withdrawalDeadlineDays', e.target.value)}
                    placeholder="14"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Document Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Transcript Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Official transcripts must be submitted
                    </p>
                  </div>
                  <Switch
                    checked={settings.transcriptRequired}
                    onCheckedChange={(value) => handleSettingChange('transcriptRequired', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Personal Statement Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Students must submit a personal statement
                    </p>
                  </div>
                  <Switch
                    checked={settings.personalStatementRequired}
                    onCheckedChange={(value) => handleSettingChange('personalStatementRequired', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>References Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Reference letters must be provided
                    </p>
                  </div>
                  <Switch
                    checked={settings.referencesRequired}
                    onCheckedChange={(value) => handleSettingChange('referencesRequired', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Portfolio Required</Label>
                    <p className="text-sm text-muted-foreground">
                      Students must submit a portfolio of work
                    </p>
                  </div>
                  <Switch
                    checked={settings.portfolioRequired}
                    onCheckedChange={(value) => handleSettingChange('portfolioRequired', value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Changes to document requirements will only apply to new applications. 
                Existing applications will maintain their original requirements.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleResetSettings}>
            Reset to Defaults
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};