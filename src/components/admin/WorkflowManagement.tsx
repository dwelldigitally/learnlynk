import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Play, Pause, Settings, BarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import WorkflowBuilder from "./workflow/WorkflowBuilder";
import StageManagement from "./workflow/StageManagement";

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
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const { data, error } = await supabase
        .from('workflows')
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
        .from('workflows')
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
    setEditingWorkflow(null);
    setShowBuilder(true);
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setShowBuilder(true);
  };

  const handleBuilderClose = () => {
    setShowBuilder(false);
    setEditingWorkflow(null);
    fetchWorkflows();
  };

  if (showBuilder) {
    return (
      <WorkflowBuilder
        workflow={editingWorkflow}
        onClose={handleBuilderClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Management</h1>
          <p className="text-muted-foreground">
            Automate student journey with custom workflows and triggers
          </p>
        </div>
        <Button onClick={handleCreateWorkflow} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      <Tabs defaultValue="workflows" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
          <TabsTrigger value="stages">Stage Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : workflows.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No workflows yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first workflow to automate student communications and actions.
                </p>
                <Button onClick={handleCreateWorkflow} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Workflow
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={workflow.is_active ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {workflow.is_active ? "Active" : "Paused"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {workflow.trigger_type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWorkflow(workflow)}
                        className="h-8 w-8 p-0"
                      >
                        {workflow.is_active ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {workflow.description || "No description provided"}
                    </CardDescription>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditWorkflow(workflow)}
                        className="flex-1"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <BarChart className="h-4 w-4 mr-2" />
                        Stats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stages">
          <StageManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Analytics</CardTitle>
              <CardDescription>
                Track workflow performance and execution metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Analytics dashboard coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowManagement;