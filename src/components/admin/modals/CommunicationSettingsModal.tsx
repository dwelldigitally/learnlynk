import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Mail, 
  MessageSquare, 
  Bell, 
  Users, 
  Shield,
  Save,
  TestTube,
  Server,
  Clock
} from 'lucide-react';

interface CommunicationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunicationSettingsModal: React.FC<CommunicationSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [settings, setSettings] = useState({
    email: {
      provider: 'smtp',
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: 'admissions@university.edu',
      fromName: 'University Admissions',
      enableSSL: true,
      enableRetries: true,
      maxRetries: 3
    },
    sms: {
      provider: 'twilio',
      twilioSid: '',
      twilioToken: '',
      fromNumber: '',
      enableDeliveryReports: true
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      inAppNotifications: true,
      newMessageAlert: true,
      automationFailures: true,
      dailyReports: false
    },
    general: {
      defaultResponseTime: '24',
      autoAssignment: true,
      businessHoursOnly: false,
      weekendResponses: false,
      maxAttachmentSize: '10',
      allowedFileTypes: '.pdf,.doc,.docx,.jpg,.png'
    },
    security: {
      messageEncryption: true,
      auditLogging: true,
      dataRetention: '365',
      requireApproval: false,
      restrictSensitiveData: true
    }
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Communication settings have been updated successfully."
    });
    onClose();
  };

  const handleTestEmail = () => {
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to verify your configuration."
    });
  };

  const handleTestSMS = () => {
    toast({
      title: "Test SMS Sent",
      description: "A test SMS has been sent to verify your configuration."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Communication Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Provider</label>
                    <Select
                      value={settings.email.provider}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, provider: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="aws-ses">AWS SES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From Email</label>
                    <Input
                      value={settings.email.fromEmail}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        email: { ...prev.email, fromEmail: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                {settings.email.provider === 'smtp' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">SMTP Host</label>
                        <Input
                          value={settings.email.smtpHost}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            email: { ...prev.email, smtpHost: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">SMTP Port</label>
                        <Input
                          value={settings.email.smtpPort}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            email: { ...prev.email, smtpPort: e.target.value }
                          }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Username</label>
                        <Input
                          value={settings.email.smtpUsername}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            email: { ...prev.email, smtpUsername: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                          type="password"
                          value={settings.email.smtpPassword}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            email: { ...prev.email, smtpPassword: e.target.value }
                          }))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={settings.email.enableSSL}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, enableSSL: checked }
                        }))}
                      />
                      <label className="text-sm font-medium">Enable SSL/TLS</label>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleTestEmail} variant="outline">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test Email Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  SMS Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SMS Provider</label>
                  <Select
                    value={settings.sms.provider}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      sms: { ...prev.sms, provider: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="messagebird">MessageBird</SelectItem>
                      <SelectItem value="aws-sns">AWS SNS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {settings.sms.provider === 'twilio' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Account SID</label>
                        <Input
                          value={settings.sms.twilioSid}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            sms: { ...prev.sms, twilioSid: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Auth Token</label>
                        <Input
                          type="password"
                          value={settings.sms.twilioToken}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            sms: { ...prev.sms, twilioToken: e.target.value }
                          }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">From Number</label>
                      <Input
                        placeholder="+1234567890"
                        value={settings.sms.fromNumber}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          sms: { ...prev.sms, fromNumber: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.sms.enableDeliveryReports}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      sms: { ...prev.sms, enableDeliveryReports: checked }
                    }))}
                  />
                  <label className="text-sm font-medium">Enable Delivery Reports</label>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleTestSMS} variant="outline">
                    <TestTube className="w-4 h-4 mr-2" />
                    Test SMS Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, emailNotifications: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, smsNotifications: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">New Message Alerts</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new messages arrive
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.newMessageAlert}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, newMessageAlert: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Automation Failures</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified when automations fail
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.automationFailures}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, automationFailures: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Default Response Time (hours)</label>
                    <Input
                      type="number"
                      value={settings.general.defaultResponseTime}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, defaultResponseTime: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Attachment Size (MB)</label>
                    <Input
                      type="number"
                      value={settings.general.maxAttachmentSize}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, maxAttachmentSize: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Allowed File Types</label>
                  <Input
                    placeholder=".pdf,.doc,.docx,.jpg,.png"
                    value={settings.general.allowedFileTypes}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      general: { ...prev.general, allowedFileTypes: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto Assignment</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically assign new messages to available staff
                      </p>
                    </div>
                    <Switch
                      checked={settings.general.autoAssignment}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, autoAssignment: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Business Hours Only</h4>
                      <p className="text-sm text-muted-foreground">
                        Only send automated messages during business hours
                      </p>
                    </div>
                    <Switch
                      checked={settings.general.businessHoursOnly}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        general: { ...prev.general, businessHoursOnly: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Retention (days)</label>
                  <Input
                    type="number"
                    value={settings.security.dataRetention}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, dataRetention: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Message Encryption</h4>
                      <p className="text-sm text-muted-foreground">
                        Encrypt sensitive message content
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.messageEncryption}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, messageEncryption: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Audit Logging</h4>
                      <p className="text-sm text-muted-foreground">
                        Log all communication activities
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.auditLogging}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, auditLogging: checked }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Approval</h4>
                      <p className="text-sm text-muted-foreground">
                        Require approval for sensitive communications
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.requireApproval}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, requireApproval: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};