import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  Plus, 
  Trash2, 
  Clock, 
  Mail, 
  MessageSquare, 
  Users, 
  Filter,
  Play,
  Save
} from 'lucide-react';

interface Automation {
  id?: string;
  name: string;
  description: string;
  trigger: {
    type: 'time' | 'event' | 'condition';
    config: any;
  };
  actions: AutomationAction[];
  isActive: boolean;
  targeting: {
    programs: string[];
    stages: string[];
    conditions: any[];
  };
}

interface AutomationAction {
  id: string;
  type: 'email' | 'sms' | 'assign' | 'tag' | 'webhook';
  config: any;
  delay?: number;
}

interface AutomationBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  automation?: Automation | null;
}

export const AutomationBuilderModal: React.FC<AutomationBuilderModalProps> = ({
  isOpen,
  onClose,
  automation
}) => {
  const [formData, setFormData] = useState<Automation>(
    automation || {
      name: '',
      description: '',
      trigger: { type: 'time', config: {} },
      actions: [],
      isActive: false,
      targeting: { programs: [], stages: [], conditions: [] }
    }
  );
  
  const { toast } = useToast();

  const triggerTypes = [
    { value: 'time', label: 'Time-based', icon: Clock },
    { value: 'event', label: 'Event-based', icon: Zap },
    { value: 'condition', label: 'Condition-based', icon: Filter }
  ];

  const actionTypes = [
    { value: 'email', label: 'Send Email', icon: Mail },
    { value: 'sms', label: 'Send SMS', icon: MessageSquare },
    { value: 'assign', label: 'Assign to Staff', icon: Users },
    { value: 'tag', label: 'Add Tag', icon: Badge }
  ];

  const addAction = () => {
    const newAction: AutomationAction = {
      id: Date.now().toString(),
      type: 'email',
      config: {},
      delay: 0
    };
    setFormData(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const removeAction = (actionId: string) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter(action => action.id !== actionId)
    }));
  };

  const updateAction = (actionId: string, updates: Partial<AutomationAction>) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === actionId ? { ...action, ...updates } : action
      )
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an automation name.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Automation Saved",
      description: `"${formData.name}" has been saved successfully.`
    });
    
    onClose();
  };

  const handleTest = () => {
    toast({
      title: "Test Started",
      description: "Running automation test with sample data..."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            {automation ? 'Edit Automation' : 'Create New Automation'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList>
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="trigger">Trigger</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="targeting">Targeting</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Automation Name</label>
                <Input
                  placeholder="Enter automation name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <label className="text-sm font-medium">Active</label>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe what this automation does..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </TabsContent>

          <TabsContent value="trigger" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Trigger Type</label>
                <Select
                  value={formData.trigger.type}
                  onValueChange={(value: 'time' | 'event' | 'condition') => 
                    setFormData(prev => ({ 
                      ...prev, 
                      trigger: { type: value, config: {} }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.trigger.type === 'time' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Time-based Trigger</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Frequency</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="once">One-time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Time</label>
                        <Input type="time" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {formData.trigger.type === 'event' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Event-based Trigger</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Event Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="application_submitted">Application Submitted</SelectItem>
                          <SelectItem value="document_uploaded">Document Uploaded</SelectItem>
                          <SelectItem value="message_received">Message Received</SelectItem>
                          <SelectItem value="stage_changed">Stage Changed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Actions</h3>
              <Button onClick={addAction} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Action
              </Button>
            </div>

            <div className="space-y-4">
              {formData.actions.map((action, index) => (
                <Card key={action.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Action {index + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAction(action.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Action Type</label>
                        <Select
                          value={action.type}
                          onValueChange={(value) => updateAction(action.id, { type: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {actionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="w-4 h-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Delay (minutes)</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={action.delay || 0}
                          onChange={(e) => updateAction(action.id, { delay: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    {action.type === 'email' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Template</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="welcome">Welcome Email</SelectItem>
                            <SelectItem value="reminder">Application Reminder</SelectItem>
                            <SelectItem value="follow_up">Follow-up Email</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {action.type === 'assign' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Assign to Staff Member</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff member" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sarah">Sarah Johnson</SelectItem>
                            <SelectItem value="mike">Mike Chen</SelectItem>
                            <SelectItem value="emily">Emily Davis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {formData.actions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No actions configured yet</p>
                  <p className="text-sm">Click "Add Action" to get started</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="targeting" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Programs</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select programs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="nursing">Nursing</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="dentistry">Dentistry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Application Stages</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offer_sent">Offer Sent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Additional Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configure additional targeting conditions based on student data, 
                    application history, or engagement metrics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleTest}>
            <Play className="w-4 h-4 mr-2" />
            Test Automation
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Automation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};