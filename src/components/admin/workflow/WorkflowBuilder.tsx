import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Workflow {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  trigger_type: string;
  trigger_config: any;
}

interface WorkflowBuilderProps {
  workflow?: Workflow | null;
  onClose: () => void;
}

const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ workflow, onClose }) => {
  const [formData, setFormData] = useState({
    name: workflow?.name || "",
    description: workflow?.description || "",
    trigger_type: workflow?.trigger_type || "stage_change",
    trigger_config: workflow?.trigger_config || {},
  });
  const [saving, setSaving] = useState(false);

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
        is_active: false, // Start as inactive
      };

      if (workflow) {
        // Update existing workflow
        const { error } = await supabase
          .from('workflows')
          .update(workflowData)
          .eq('id', workflow.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Workflow updated successfully",
        });
      } else {
        // Create new workflow
        const { error } = await supabase
          .from('workflows')
          .insert(workflowData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Workflow created successfully",
        });
      }

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

  return (
    <div className="space-y-6">
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set up the workflow name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="workflow-description">Description</Label>
                <Textarea
                  id="workflow-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this workflow does"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trigger Configuration</CardTitle>
              <CardDescription>
                Choose when this workflow should be activated
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              {formData.trigger_type === 'stage_change' && (
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-medium mb-2">Stage Change Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    This workflow will trigger when students enter or exit specific stages.
                  </p>
                  <div className="mt-3">
                    <Label>Target Stage</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead_form">Lead Form</SelectItem>
                        <SelectItem value="send_documents">Send Documents</SelectItem>
                        <SelectItem value="document_approval">Document Approval</SelectItem>
                        <SelectItem value="fee_payment">Fee Payment</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {formData.trigger_type === 'time_based' && (
                <div className="p-4 border rounded-lg bg-muted/30">
                  <h4 className="font-medium mb-2">Time Based Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    This workflow will trigger after a specific time period.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Define what happens when the workflow is triggered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <p className="text-muted-foreground mb-4">No actions configured yet</p>
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Action
                  </Button>
                </div>
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
                Drag actions into your workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <h4 className="font-medium text-sm">Send Email</h4>
                <p className="text-xs text-muted-foreground">Send custom email to student</p>
              </div>
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <h4 className="font-medium text-sm">Send SMS</h4>
                <p className="text-xs text-muted-foreground">Send text message notification</p>
              </div>
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <h4 className="font-medium text-sm">Generate Document</h4>
                <p className="text-xs text-muted-foreground">Create and send document</p>
              </div>
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <h4 className="font-medium text-sm">Send Payment Link</h4>
                <p className="text-xs text-muted-foreground">Generate payment request</p>
              </div>
              <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <h4 className="font-medium text-sm">Update Record</h4>
                <p className="text-xs text-muted-foreground">Modify student data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkflowBuilder;