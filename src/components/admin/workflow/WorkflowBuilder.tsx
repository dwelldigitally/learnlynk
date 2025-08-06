import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Save, Plus, Mail, MessageSquare, FileText, CreditCard, Settings2, Trash2, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Workflow {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  trigger_type: string;
  trigger_config: any;
}

interface WorkflowAction {
  id: string;
  type: string;
  config: any;
  order_index: number;
}

interface WorkflowBuilderProps {
  workflow?: Workflow | null;
  onClose: () => void;
}

const actionTypes = [
  { id: 'send_email', label: 'Send Email', icon: Mail, color: 'bg-blue-500' },
  { id: 'send_sms', label: 'Send SMS', icon: MessageSquare, color: 'bg-green-500' },
  { id: 'generate_document', label: 'Generate Document', icon: FileText, color: 'bg-purple-500' },
  { id: 'send_payment_link', label: 'Send Payment Link', icon: CreditCard, color: 'bg-orange-500' },
  { id: 'update_record', label: 'Update Record', icon: Settings2, color: 'bg-gray-500' },
];

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ workflow, onClose }) => {
  const [formData, setFormData] = useState({
    name: workflow?.name || "",
    description: workflow?.description || "",
    trigger_type: workflow?.trigger_type || "stage_change",
    trigger_config: workflow?.trigger_config || {},
  });
  const [actions, setActions] = useState<WorkflowAction[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedActionType, setSelectedActionType] = useState('');
  const [actionConfig, setActionConfig] = useState<any>({});

  useEffect(() => {
    fetchStages();
    if (workflow) {
      fetchWorkflowActions();
    }
  }, [workflow]);

  const fetchStages = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_stages')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setStages(data || []);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  const fetchWorkflowActions = async () => {
    if (!workflow) return;

    try {
      const { data, error } = await supabase
        .from('workflow_actions')
        .select('*')
        .eq('workflow_id', workflow.id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      
      // Map database response to WorkflowAction interface
      const mappedActions: WorkflowAction[] = (data || []).map(action => ({
        id: action.id,
        type: action.action_type,
        config: action.action_config,
        order_index: action.order_index,
      }));
      
      setActions(mappedActions);
    } catch (error) {
      console.error('Error fetching workflow actions:', error);
    }
  };

  const handleAddAction = () => {
    setSelectedActionType('');
    setActionConfig({});
    setShowActionDialog(true);
  };

  const handleSaveAction = () => {
    if (!selectedActionType) return;

    const newAction: WorkflowAction = {
      id: `temp-${Date.now()}`,
      type: selectedActionType,
      config: actionConfig,
      order_index: actions.length + 1,
    };

    setActions(prev => [...prev, newAction]);
    setShowActionDialog(false);
    setSelectedActionType('');
    setActionConfig({});
  };

  const handleDeleteAction = (actionId: string) => {
    setActions(prev => prev.filter(action => action.id !== actionId));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Workflow name is required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const workflowData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        trigger_type: formData.trigger_type,
        trigger_config: formData.trigger_config,
        is_active: false,
      };

      let workflowId = workflow?.id;

      if (workflow) {
        // Update existing workflow
        const { error } = await supabase
          .from('workflows')
          .update(workflowData)
          .eq('id', workflow.id);

        if (error) throw error;
      } else {
        // Create new workflow
        const { data, error } = await supabase
          .from('workflows')
          .insert(workflowData)
          .select()
          .single();

        if (error) throw error;
        workflowId = data.id;
      }

      // Save actions
      if (workflowId && actions.length > 0) {
        // Delete existing actions first
        await supabase
          .from('workflow_actions')
          .delete()
          .eq('workflow_id', workflowId);

        // Insert new actions
        const actionsToInsert = actions.map((action, index) => ({
          workflow_id: workflowId,
          action_type: action.type,
          action_config: action.config,
          order_index: index + 1,
        }));

        const { error: actionsError } = await supabase
          .from('workflow_actions')
          .insert(actionsToInsert);

        if (actionsError) throw actionsError;
      }

      toast({
        title: "Success",
        description: workflow ? "Workflow updated successfully" : "Workflow created successfully",
      });

      onClose();
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getActionIcon = (type: string) => {
    const actionType = actionTypes.find(at => at.id === type);
    return actionType ? actionType.icon : Settings2;
  };

  const getActionColor = (type: string) => {
    const actionType = actionTypes.find(at => at.id === type);
    return actionType ? actionType.color : 'bg-gray-500';
  };

  const getActionLabel = (type: string) => {
    const actionType = actionTypes.find(at => at.id === type);
    return actionType ? actionType.label : type;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onClose} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Workflows
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {workflow ? 'Edit Workflow' : 'Create New Workflow'}
          </h1>
          <p className="text-muted-foreground">
            Configure triggers and actions for automated student communications
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input
                    id="workflow-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Welcome Email Sequence"
                  />
                </div>
                <div>
                  <Label htmlFor="trigger-type">Trigger Type</Label>
                  <Select
                    value={formData.trigger_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, trigger_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stage_change">Stage Change</SelectItem>
                      <SelectItem value="time_based">Time Based</SelectItem>
                      <SelectItem value="condition_based">Condition Based</SelectItem>
                      <SelectItem value="event_based">Event Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="workflow-description">Description</Label>
                <Textarea
                  id="workflow-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this workflow does"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Trigger Configuration */}
          {formData.trigger_type === 'stage_change' && (
            <Card>
              <CardHeader>
                <CardTitle>Trigger Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Target Stage</Label>
                    <Select
                      value={formData.trigger_config.stage_id || ''}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        trigger_config: { ...prev.trigger_config, stage_id: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Trigger Event</Label>
                    <Select
                      value={formData.trigger_config.event || 'enter'}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        trigger_config: { ...prev.trigger_config, event: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enter">Student enters stage</SelectItem>
                        <SelectItem value="exit">Student exits stage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Workflow Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Workflow Timeline</CardTitle>
                  <CardDescription>
                    Define the sequence of actions that will be executed
                  </CardDescription>
                </div>
                <Button onClick={handleAddAction} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Action
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Trigger Start */}
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-primary/5">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    T
                  </div>
                  <div>
                    <h4 className="font-medium">Trigger</h4>
                    <p className="text-sm text-muted-foreground">
                      {formData.trigger_type === 'stage_change' 
                        ? `When student ${formData.trigger_config.event || 'enters'} stage`
                        : formData.trigger_type.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {actions.map((action, index) => {
                  const Icon = getActionIcon(action.type);
                  return (
                    <div key={action.id}>
                      {/* Arrow */}
                      <div className="flex justify-center py-2">
                        <ArrowDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      {/* Action */}
                      <div className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                        <div className={`w-8 h-8 rounded-full ${getActionColor(action.type)} flex items-center justify-center text-white`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{getActionLabel(action.type)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {action.type === 'send_email' && action.config.subject 
                              ? `Subject: ${action.config.subject}`
                              : action.type === 'send_sms' && action.config.message
                              ? `Message: ${action.config.message.substring(0, 50)}...`
                              : 'Click to configure'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAction(action.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Action Placeholder */}
                {actions.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <p className="text-muted-foreground mb-4">No actions added yet</p>
                    <Button onClick={handleAddAction} variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Your First Action
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Save Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : workflow ? 'Update Workflow' : 'Create Workflow'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Actions</CardTitle>
              <CardDescription>
                Click to add actions to your workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {actionTypes.map((actionType) => {
                const Icon = actionType.icon;
                return (
                  <div
                    key={actionType.id}
                    onClick={() => {
                      setSelectedActionType(actionType.id);
                      setShowActionDialog(true);
                    }}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded ${actionType.color} flex items-center justify-center`}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{actionType.label}</h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Configuration Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure Action</DialogTitle>
            <DialogDescription>
              Set up the details for this action
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedActionType === 'send_email' && (
              <>
                <div>
                  <Label>Email Subject</Label>
                  <Input
                    value={actionConfig.subject || ''}
                    onChange={(e) => setActionConfig(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g., Welcome to our program!"
                  />
                </div>
                <div>
                  <Label>Email Content</Label>
                  <Textarea
                    value={actionConfig.content || ''}
                    onChange={(e) => setActionConfig(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Dear [Student Name], ..."
                    rows={5}
                  />
                </div>
              </>
            )}

            {selectedActionType === 'send_sms' && (
              <div>
                <Label>SMS Message</Label>
                <Textarea
                  value={actionConfig.message || ''}
                  onChange={(e) => setActionConfig(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Hi [Student Name], your application status has been updated..."
                  rows={3}
                />
              </div>
            )}

            {selectedActionType === 'generate_document' && (
              <>
                <div>
                  <Label>Document Type</Label>
                  <Select
                    value={actionConfig.document_type || ''}
                    onValueChange={(value) => setActionConfig(prev => ({ ...prev, document_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Document Template</Label>
                  <Input
                    value={actionConfig.template || ''}
                    onChange={(e) => setActionConfig(prev => ({ ...prev, template: e.target.value }))}
                    placeholder="Template name or path"
                  />
                </div>
              </>
            )}

            {selectedActionType === 'send_payment_link' && (
              <>
                <div>
                  <Label>Payment Amount</Label>
                  <Input
                    type="number"
                    value={actionConfig.amount || ''}
                    onChange={(e) => setActionConfig(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Payment Description</Label>
                  <Input
                    value={actionConfig.description || ''}
                    onChange={(e) => setActionConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Application Fee"
                  />
                </div>
              </>
            )}

            {selectedActionType === 'update_record' && (
              <>
                <div>
                  <Label>Field to Update</Label>
                  <Select
                    value={actionConfig.field || ''}
                    onValueChange={(value) => setActionConfig(prev => ({ ...prev, field: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status">Application Status</SelectItem>
                      <SelectItem value="stage">Current Stage</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="tags">Tags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>New Value</Label>
                  <Input
                    value={actionConfig.value || ''}
                    onChange={(e) => setActionConfig(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="New value for the field"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAction}>
              Add Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowBuilder;