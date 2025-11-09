import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkflowService } from '@/services/workflowService';
import { useToast } from '@/hooks/use-toast';
import { WorkflowBuilderMain } from '@/components/workflow-builder/WorkflowBuilderMain';

export function WorkflowBuilderPage() {
  const navigate = useNavigate();
  const { workflowId } = useParams();
  const { toast } = useToast();
  const [initialConfig, setInitialConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkflow = async () => {
      if (workflowId) {
        try {
          const workflows = await WorkflowService.getWorkflows();
          const workflow = workflows.find(w => w.id === workflowId);
          if (workflow) {
            const triggerConfig: any = workflow.trigger_config;
            setInitialConfig({
              id: workflow.id,
              name: workflow.name,
              description: workflow.description || '',
              type: 'workflow',
              elements: (triggerConfig && typeof triggerConfig === 'object' && triggerConfig.elements) || [],
              settings: {
                isActive: workflow.is_active || false
              },
              metadata: {}
            });
          }
        } catch (error) {
          console.error('Error loading workflow:', error);
          toast({
            title: "Error",
            description: "Failed to load workflow",
            variant: "destructive",
          });
        }
      }
      setIsLoading(false);
    };

    loadWorkflow();
  }, [workflowId, toast]);

  const handleSave = async (config: any) => {
    try {
      if (workflowId) {
        await WorkflowService.updateWorkflow(workflowId, {
          name: config.name,
          description: config.description,
          trigger_config: config,
          is_active: config.settings?.isActive || false
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
          is_active: config.settings?.isActive || false,
          trigger_type: 'manual'
        });
        toast({
          title: "Success",
          description: "Workflow created successfully",
        });
      }
      navigate('/admin/workflows');
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/workflows');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading workflow...</div>
      </div>
    );
  }

  return (
    <WorkflowBuilderMain
      initialConfig={initialConfig}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}