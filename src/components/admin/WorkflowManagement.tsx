import React, { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Play, Pause, Settings, BarChart, Database, Workflow as WorkflowIcon, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DummyWorkflowService } from "@/services/dummyWorkflowService";
import { PageHeader } from "@/components/modern/PageHeader";
import { ModernCard } from "@/components/modern/ModernCard";
import { InfoBadge } from "@/components/modern/InfoBadge";
import { MetadataItem } from "@/components/modern/MetadataItem";

interface Workflow {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  trigger_type: string;
  trigger_config: any;
  created_at: string;
}

const WorkflowManagement: React.FC = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
    const { data, error } = await supabase
      .from('plays')
      .select('*')
      .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkflows(data || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast({
        title: "Error",
        description: "Failed to fetch workflows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkflow = async (workflow: Workflow) => {
    try {
    const { error } = await supabase
      .from('plays')
      .update({ is_active: !workflow.is_active })
      .eq('id', workflow.id);

      if (error) throw error;
      
      setWorkflows(prev => 
        prev.map(w => 
          w.id === workflow.id 
            ? { ...w, is_active: !w.is_active }
            : w
        )
      );

      toast({
        title: "Success",
        description: `Workflow ${workflow.is_active ? 'paused' : 'activated'}`,
      });
    } catch (error) {
      console.error('Error toggling workflow:', error);
      toast({
        title: "Error",
        description: "Failed to update workflow",
        variant: "destructive",
      });
    }
  };

  const handleCreateWorkflow = () => {
    navigate('/admin/workflows/builder');
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    navigate(`/admin/workflows/${workflow.id}/edit`);
  };

  const handleCreateSampleData = async () => {
    try {
      setLoading(true);
      await DummyWorkflowService.createDummyWorkflows();
      await fetchWorkflows();
      toast({
        title: "Success",
        description: `Created ${DummyWorkflowService.getDummyWorkflowCount()} sample workflows`,
      });
    } catch (error: any) {
      console.error('Error creating sample workflows:', error);
      toast({
        title: "Error",
        description: error.message === 'Workflows already exist for this user' 
          ? "Sample workflows already exist" 
          : "Failed to create sample workflows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="Workflow Management"
        subtitle="Automate student journey with custom workflows and triggers"
      />

      <div className="mb-6 flex justify-end gap-2">
        <Button size="lg" onClick={handleCreateWorkflow}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
        {workflows.length === 0 && (
          <Button onClick={handleCreateSampleData} variant="outline" size="lg">
            <Database className="h-4 w-4 mr-2" />
            Add Sample Data
          </Button>
        )}
      </div>

      <Tabs defaultValue="workflows" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <ModernCard key={i} hover={false}>
                  <CardContent className="p-6 animate-pulse">
                    <div className="flex gap-3 mb-4">
                      <div className="w-10 h-10 bg-muted rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </ModernCard>
              ))}
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light mb-4">
                <WorkflowIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No workflows yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Create your first workflow to automate student communications and actions
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleCreateWorkflow} size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Workflow
                </Button>
                <Button onClick={handleCreateSampleData} variant="outline" size="lg">
                  <Database className="h-4 w-4 mr-2" />
                  Add Sample Data
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow) => (
                <ModernCard key={workflow.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-foreground mb-2 truncate">
                          {workflow.name}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          <InfoBadge variant={workflow.is_active ? "success" : "secondary"}>
                            {workflow.is_active ? "ACTIVE" : "PAUSED"}
                          </InfoBadge>
                          <InfoBadge variant="default">
                            {workflow.trigger_type.replace('_', ' ').toUpperCase()}
                          </InfoBadge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWorkflow(workflow)}
                        className="h-9 w-9 p-0 flex-shrink-0"
                      >
                        {workflow.is_active ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {workflow.description || "No description provided"}
                      </p>
                    </div>

                    <MetadataItem
                      icon={WorkflowIcon}
                      label="Created"
                      value={new Date(workflow.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                      className="mb-4"
                    />

                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditWorkflow(workflow)}
                        className="flex-1"
                      >
                        <Settings className="h-3.5 w-3.5 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <BarChart className="h-3.5 w-3.5 mr-1.5" />
                        Stats
                      </Button>
                    </div>
                  </CardContent>
                </ModernCard>
              ))}
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default WorkflowManagement;