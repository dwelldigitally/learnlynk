import React from 'react';
import { UniversalBuilder } from '@/components/universal-builder/UniversalBuilder';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkflowService } from '@/services/workflowService';
import { useToast } from '@/hooks/use-toast';

export function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const { workflowId } = useParams();
  const { toast } = useToast();

  const handleSave = async (config: any) => {
    try {
      if (workflowId) {
        await WorkflowService.updateWorkflow(workflowId, {
          name: config.name,
          description: config.description,
          trigger_config: config,
          is_active: true
        });
        toast({
          title: "Success",
          description: "Workflow updated successfully",
        });
      } else {
        await WorkflowService.createWorkflow({
          name: config.name,
          description: config.description,
          trigger_config: config,
          is_active: true,
          trigger_type: 'manual'
        });
        toast({
          title: "Success",
          description: "Workflow created successfully",
        });
      }
      navigate('/admin/builder');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/builder');
  };

  return (
    <UniversalBuilder
      builderType="workflow"
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}