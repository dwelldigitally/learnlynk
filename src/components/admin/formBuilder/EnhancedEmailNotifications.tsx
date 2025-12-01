import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  Mail, 
  Users, 
  Clock, 
  Settings,
  Copy,
  Eye
} from 'lucide-react';

interface EmailRecipient {
  id: string;
  type: 'admin' | 'user' | 'program_advisor' | 'custom';
  email?: string;
  programId?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

interface EmailNotificationConfig {
  enabled: boolean;
  recipients: EmailRecipient[];
  template: EmailTemplate;
  triggerConditions?: any[];
  deliveryTiming: 'immediate' | 'delayed' | 'scheduled';
  delayMinutes?: number;
  scheduledTime?: string;
  attachments: boolean;
  format: 'html' | 'plain';
}

interface EnhancedEmailNotificationsProps {
  config: EmailNotificationConfig;
  onConfigUpdate: (config: EmailNotificationConfig) => void;
  availablePrograms?: any[];
}

export function EnhancedEmailNotifications({ 
  config, 
  onConfigUpdate,
  availablePrograms = []
}: EnhancedEmailNotificationsProps) {
  const [activeTab, setActiveTab] = useState('recipients');

  const availableVariables = [
    '{{name}}', '{{email}}', '{{phone}}', '{{program}}', 
    '{{submission_date}}', '{{form_name}}', '{{custom_fields}}'
  ];

  const addRecipient = (type: EmailRecipient['type']) => {
    const newRecipient: EmailRecipient = {
      id: `recipient_${Date.now()}`,
      type,
      ...(type === 'custom' && { email: '' })
    };
    
    onConfigUpdate({
      ...config,
      recipients: [...config.recipients, newRecipient]
    });
  };

  const removeRecipient = (id: string) => {
    onConfigUpdate({
      ...config,
      recipients: config.recipients.filter(r => r.id !== id)
    });
  };

  const updateRecipient = (id: string, updates: Partial<EmailRecipient>) => {
    onConfigUpdate({
      ...config,
      recipients: config.recipients.map(r => 
        r.id === id ? { ...r, ...updates } : r
      )
    });
  };

  const insertVariable = (variable: string) => {
    const currentBody = config.template.body;
    onConfigUpdate({
      ...config,
      template: {
        ...config.template,
        body: currentBody + ' ' + variable
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Email Notifications</CardTitle>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(enabled) => onConfigUpdate({ ...config, enabled })}
          />
        </div>
      </CardHeader>
      
      {config.enabled && (
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="recipients">
                <Users className="h-4 w-4 mr-2" />
                Recipients
              </TabsTrigger>
              <TabsTrigger value="template">
                <Mail className="h-4 w-4 mr-2" />
                Template
              </TabsTrigger>
              <TabsTrigger value="timing">
                <Clock className="h-4 w-4 mr-2" />
                Timing
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <Settings className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recipients" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Email Recipients</h3>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => addRecipient('admin')}>
                    <Plus className="h-4 w-4 mr-1" />
                    Admin
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addRecipient('program_advisor')}>
                    <Plus className="h-4 w-4 mr-1" />
                    Program Advisor
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => addRecipient('custom')}>
                    <Plus className="h-4 w-4 mr-1" />
                    Custom Email
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {config.recipients.map((recipient) => (
                  <div key={recipient.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Badge variant={recipient.type === 'admin' ? 'default' : 'secondary'}>
                      {recipient.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    
                    {recipient.type === 'custom' && (
                      <Input
                        placeholder="email@example.com"
                        value={recipient.email || ''}
                        onChange={(e) => updateRecipient(recipient.id, { email: e.target.value })}
                        className="flex-1"
                      />
                    )}
                    
                    {recipient.type === 'program_advisor' && (
                      <Select
                        value={recipient.programId}
                        onValueChange={(programId) => updateRecipient(recipient.id, { programId })}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select Program" />
                        </SelectTrigger>
                        <SelectContent>
                          {availablePrograms.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeRecipient(recipient.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="template" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    placeholder="New lead submission from {{form_name}}"
                    value={config.template.subject}
                    onChange={(e) => onConfigUpdate({
                      ...config,
                      template: { ...config.template, subject: e.target.value }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="body">Email Body</Label>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    id="body"
                    placeholder="Hello {{name}}, thank you for your submission..."
                    rows={8}
                    value={config.template.body}
                    onChange={(e) => onConfigUpdate({
                      ...config,
                      template: { ...config.template, body: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Available Variables</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableVariables.map((variable) => (
                      <Button
                        key={variable}
                        size="sm"
                        variant="outline"
                        onClick={() => insertVariable(variable)}
                        className="text-xs"
                      >
                        {variable}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timing" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Delivery Timing</Label>
                  <Select
                    value={config.deliveryTiming}
                    onValueChange={(value: 'immediate' | 'delayed' | 'scheduled') => 
                      onConfigUpdate({ ...config, deliveryTiming: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Send Immediately</SelectItem>
                      <SelectItem value="delayed">Send After Delay</SelectItem>
                      <SelectItem value="scheduled">Send at Scheduled Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {config.deliveryTiming === 'delayed' && (
                  <div className="space-y-2">
                    <Label htmlFor="delay">Delay (minutes)</Label>
                    <Input
                      id="delay"
                      type="number"
                      placeholder="5"
                      value={config.delayMinutes || ''}
                      onChange={(e) => onConfigUpdate({
                        ...config,
                        delayMinutes: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                )}

                {config.deliveryTiming === 'scheduled' && (
                  <div className="space-y-2">
                    <Label htmlFor="scheduled">Scheduled Time</Label>
                    <Input
                      id="scheduled"
                      type="time"
                      value={config.scheduledTime || ''}
                      onChange={(e) => onConfigUpdate({
                        ...config,
                        scheduledTime: e.target.value
                      })}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Format</Label>
                    <p className="text-sm text-muted-foreground">Choose between HTML or plain text</p>
                  </div>
                  <Select
                    value={config.format}
                    onValueChange={(value: 'html' | 'plain') => 
                      onConfigUpdate({ ...config, format: value })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="plain">Plain Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Include Attachments</Label>
                    <p className="text-sm text-muted-foreground">Attach form submission as PDF</p>
                  </div>
                  <Switch
                    checked={config.attachments}
                    onCheckedChange={(attachments) => onConfigUpdate({ ...config, attachments })}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}