import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play,
  Pause,
  Save,
  Download,
  Upload,
  Zap,
  Mail,
  Clock,
  Users,
  FileText,
  Database,
  MessageSquare,
  Calendar,
  DollarSign,
  Settings,
  Plus,
  Trash2,
  Copy,
  ArrowRight,
  GitBranch,
  RotateCcw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'parallel' | 'loop';
  name: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  estimatedSavings: string;
  complexity: 'simple' | 'medium' | 'advanced';
  tags: string[];
}

const VisualWorkflowBuilder: React.FC = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowTemplate | null>(null);

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: '1',
      name: 'Student Onboarding Sequence',
      description: 'Complete automation from application submission to enrollment confirmation',
      category: 'Student Management',
      estimatedSavings: '15 hours/week',
      complexity: 'medium',
      tags: ['onboarding', 'automation', 'communication'],
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          name: 'Application Submitted',
          description: 'Triggered when a new application is submitted',
          config: { event: 'application_submitted' },
          position: { x: 100, y: 100 },
          connections: ['action-1']
        },
        {
          id: 'action-1',
          type: 'action',
          name: 'Send Welcome Email',
          description: 'Automated welcome email with next steps',
          config: { template: 'welcome_email', delay: 0 },
          position: { x: 300, y: 100 },
          connections: ['condition-1']
        },
        {
          id: 'condition-1',
          type: 'condition',
          name: 'Document Complete?',
          description: 'Check if all required documents are uploaded',
          config: { field: 'documents_complete', operator: 'equals', value: true },
          position: { x: 500, y: 100 },
          connections: ['action-2', 'action-3']
        }
      ]
    },
    {
      id: '2',
      name: 'Lead Nurturing Campaign',
      description: 'Multi-touch email sequence for lead conversion',
      category: 'Marketing',
      estimatedSavings: '25 hours/week',
      complexity: 'advanced',
      tags: ['marketing', 'email', 'conversion'],
      nodes: [
        {
          id: 'trigger-2',
          type: 'trigger',
          name: 'Lead Created',
          description: 'New lead enters the system',
          config: { event: 'lead_created' },
          position: { x: 100, y: 100 },
          connections: ['delay-1']
        },
        {
          id: 'delay-1',
          type: 'delay',
          name: 'Wait 1 Hour',
          description: 'Delay before first contact',
          config: { duration: 3600 },
          position: { x: 300, y: 100 },
          connections: ['action-4']
        }
      ]
    },
    {
      id: '3',
      name: 'Document Processing Workflow',
      description: 'Automated OCR, review, and approval process',
      category: 'Document Management',
      estimatedSavings: '30 hours/week',
      complexity: 'advanced',
      tags: ['documents', 'ocr', 'approval'],
      nodes: []
    },
    {
      id: '4',
      name: 'Event Registration Flow',
      description: 'Complete event registration with confirmations and reminders',
      category: 'Events',
      estimatedSavings: '8 hours/week',
      complexity: 'simple',
      tags: ['events', 'registration', 'reminders'],
      nodes: []
    },
    {
      id: '5',
      name: 'Payment Follow-up Sequence',
      description: 'Automated payment reminders and overdue handling',
      category: 'Financial',
      estimatedSavings: '12 hours/week',
      complexity: 'medium',
      tags: ['payments', 'reminders', 'finance'],
      nodes: []
    },
    {
      id: '6',
      name: 'Scholarship Application Processing',
      description: 'Automated scoring, review, and notification workflow',
      category: 'Financial Aid',
      estimatedSavings: '20 hours/week',
      complexity: 'advanced',
      tags: ['scholarships', 'scoring', 'notifications'],
      nodes: []
    }
  ];

  const nodeTypes = [
    { type: 'trigger', icon: Zap, color: 'bg-green-500', label: 'Trigger' },
    { type: 'condition', icon: GitBranch, color: 'bg-yellow-500', label: 'Condition' },
    { type: 'action', icon: Settings, color: 'bg-blue-500', label: 'Action' },
    { type: 'delay', icon: Clock, color: 'bg-purple-500', label: 'Delay' },
    { type: 'parallel', icon: Copy, color: 'bg-orange-500', label: 'Parallel' },
    { type: 'loop', icon: RotateCcw, color: 'bg-red-500', label: 'Loop' }
  ];

  const actionTypes = [
    { value: 'send_email', label: 'Send Email', icon: Mail },
    { value: 'create_task', label: 'Create Task', icon: CheckCircle },
    { value: 'update_record', label: 'Update Record', icon: Database },
    { value: 'send_notification', label: 'Send Notification', icon: MessageSquare },
    { value: 'schedule_meeting', label: 'Schedule Meeting', icon: Calendar },
    { value: 'process_payment', label: 'Process Payment', icon: DollarSign },
    { value: 'generate_document', label: 'Generate Document', icon: FileText },
    { value: 'assign_advisor', label: 'Assign Advisor', icon: Users }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleUseTemplate = (template: WorkflowTemplate) => {
    setCurrentWorkflow({ ...template });
    setIsBuilding(true);
    toast({
      title: "Template Loaded",
      description: `${template.name} is ready for customization.`
    });
  };

  const handleSaveWorkflow = () => {
    if (currentWorkflow) {
      setWorkflows(prev => [...prev, currentWorkflow]);
      setIsBuilding(false);
      setCurrentWorkflow(null);
      toast({
        title: "Workflow Saved",
        description: "Your workflow has been saved successfully."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Visual Workflow Builder</h2>
          <p className="text-muted-foreground">Create and manage automated workflows with drag-and-drop interface</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => setIsBuilding(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      </div>

      {!isBuilding ? (
        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="my-workflows">My Workflows</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflowTemplates.map((template) => (
                <Card key={template.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                      <Badge className={getComplexityColor(template.complexity)}>
                        {template.complexity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Est. Savings:</span>
                        <span className="font-medium text-green-600">{template.estimatedSavings}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1"
                        >
                          Use Template
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setSelectedTemplate(template)}
                        >
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-workflows" className="space-y-6">
            <div className="grid gap-4">
              {workflows.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No workflows yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first workflow from a template or start from scratch</p>
                    <Button onClick={() => setIsBuilding(true)}>
                      Create First Workflow
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                workflows.map((workflow) => (
                  <Card key={workflow.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{workflow.name}</CardTitle>
                          <CardDescription>{workflow.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Active</Badge>
                          <Button size="sm" variant="outline">
                            <Play className="h-3 w-3 mr-1" />
                            Run
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Analytics</CardTitle>
                <CardDescription>Performance metrics and optimization insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Workflow analytics dashboard</p>
                  <p className="text-sm">Execution rates, time savings, and performance metrics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Settings</CardTitle>
                <CardDescription>Global workflow configuration and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Workflow configuration settings</p>
                  <p className="text-sm">Global settings, execution limits, and notification preferences</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Workflow Builder</CardTitle>
                <CardDescription>
                  {currentWorkflow ? `Editing: ${currentWorkflow.name}` : 'Create a new workflow'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsBuilding(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveWorkflow}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6 h-[600px]">
              {/* Node Palette */}
              <div className="border-r pr-4">
                <h3 className="font-medium mb-4">Workflow Elements</h3>
                <div className="space-y-2">
                  {nodeTypes.map((nodeType) => {
                    const IconComponent = nodeType.icon;
                    return (
                      <div
                        key={nodeType.type}
                        className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted"
                        draggable
                      >
                        <div className={`w-3 h-3 rounded ${nodeType.color}`}></div>
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm">{nodeType.label}</span>
                      </div>
                    );
                  })}
                </div>

                <h3 className="font-medium mb-4 mt-6">Actions</h3>
                <div className="space-y-2">
                  {actionTypes.map((action) => {
                    const IconComponent = action.icon;
                    return (
                      <div
                        key={action.value}
                        className="flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-muted"
                        draggable
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm">{action.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Canvas Area */}
              <div className="col-span-2 border rounded-lg bg-muted/20 relative overflow-auto">
                <div className="absolute inset-0 p-4">
                  <div className="text-center text-muted-foreground">
                    <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Drag elements here to build your workflow</p>
                    <p className="text-sm">Visual workflow canvas</p>
                  </div>
                </div>
              </div>

              {/* Properties Panel */}
              <div className="border-l pl-4">
                <h3 className="font-medium mb-4">Properties</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Node Name</Label>
                    <Input placeholder="Enter node name" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Enter description" rows={3} />
                  </div>
                  <div>
                    <Label>Trigger Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead_created">Lead Created</SelectItem>
                        <SelectItem value="application_submitted">Application Submitted</SelectItem>
                        <SelectItem value="payment_received">Payment Received</SelectItem>
                        <SelectItem value="document_uploaded">Document Uploaded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{selectedTemplate.name}</CardTitle>
              <CardDescription>{selectedTemplate.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Category</Label>
                    <p className="font-medium">{selectedTemplate.category}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Complexity</Label>
                    <Badge className={getComplexityColor(selectedTemplate.complexity)}>
                      {selectedTemplate.complexity}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Estimated Savings</Label>
                    <p className="font-medium text-green-600">{selectedTemplate.estimatedSavings}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTemplate.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Workflow Preview</Label>
                  <div className="border rounded-lg p-4 mt-2 bg-muted/20">
                    <div className="text-center text-muted-foreground">
                      <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Workflow diagram preview</p>
                      <p className="text-sm">Visual representation of the workflow steps</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    handleUseTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }}>
                    Use This Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VisualWorkflowBuilder;