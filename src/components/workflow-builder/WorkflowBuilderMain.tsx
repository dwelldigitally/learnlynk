import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Save, Eye, Settings, BarChart3, ArrowLeft, Clock } from 'lucide-react';
import { BuilderProvider, useBuilder } from '@/contexts/BuilderContext';
import { WorkflowCanvas } from './WorkflowCanvas';
import { WorkflowActionLibrary } from './WorkflowActionLibrary';
import { WorkflowPropertyPanel } from './WorkflowPropertyPanel';
import { workflowElementTypes } from '@/config/elementTypes';
import { toast } from 'sonner';

interface WorkflowBuilderMainProps {
  initialConfig?: any;
  onSave: (config: any) => Promise<void>;
  onCancel: () => void;
}

function WorkflowBuilderContent({ initialConfig, onSave, onCancel }: WorkflowBuilderMainProps) {
  const { state, dispatch } = useBuilder();
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [activeTab, setActiveTab] = useState('workflow');
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (initialConfig) {
      dispatch({
        type: 'SET_CONFIG',
        payload: initialConfig
      });
      setWorkflowName(initialConfig.name || 'New Workflow');
      setWorkflowDescription(initialConfig.description || '');
      setIsActive(initialConfig.settings?.isActive || false);
    } else {
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          id: crypto.randomUUID(),
          name: 'New Workflow',
          description: '',
          type: 'workflow',
          elements: [],
          settings: { isActive: false },
          metadata: {}
        }
      });
    }
  }, [initialConfig, dispatch]);

  const handleAddElement = (elementType: string) => {
    const elementTypeConfig = workflowElementTypes.find(t => t.type === elementType);
    if (!elementTypeConfig) return;

    const newElement: any = {
      id: crypto.randomUUID(),
      type: elementType,
      elementType: elementType,
      title: elementTypeConfig.label,
      description: '',
      position: { x: 0, y: state.config.elements.length * 100 },
      config: { ...elementTypeConfig.defaultConfig },
      conditionGroups: elementType === 'trigger' || elementType === 'condition' ? [] : undefined
    };

    dispatch({ type: 'ADD_ELEMENT', payload: newElement });
    dispatch({ type: 'SELECT_ELEMENT', payload: newElement.id });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const config = {
        ...state.config,
        name: workflowName,
        description: workflowDescription,
        settings: {
          ...state.config.settings,
          isActive
        }
      };
      await onSave(config);
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = () => {
    toast.info('Test mode coming soon!');
  };

  const handlePreview = () => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: !state.isPreviewMode });
  };

  const stepCount = state.config.elements.length;
  const actionCount = state.config.elements.filter(el => el.type !== 'trigger').length;
  const triggerCount = state.config.elements.filter(el => el.type === 'trigger').length;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex-1 max-w-md">
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="font-semibold border-none shadow-none text-lg h-9"
                placeholder="Workflow name..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mr-4">
              <div className="flex items-center gap-1">
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? 'Active' : 'Draft'}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{stepCount} steps</span>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleTest}>
              <Play className="h-4 w-4 mr-2" />
              Test
            </Button>
            <Button variant="outline" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="px-6 pb-3">
          <Textarea
            value={workflowDescription}
            onChange={(e) => setWorkflowDescription(e.target.value)}
            placeholder="Add a description for this workflow..."
            className="border-none shadow-none resize-none text-sm text-muted-foreground min-h-[60px]"
          />
        </div>
      </div>

      {/* Tabs - Wraps both TabsList and TabsContent */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full max-w-md grid-cols-3 mx-6">
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="workflow" className="flex-1 flex m-0 data-[state=inactive]:hidden">
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Action Library */}
            <div className="w-80 border-r bg-card flex flex-col">
              <WorkflowActionLibrary onAddElement={handleAddElement} />
            </div>

            {/* Center - Canvas */}
            <div className="flex-1 overflow-hidden">
              <WorkflowCanvas onAddElement={handleAddElement} />
            </div>

            {/* Right Sidebar - Properties */}
            <div className="w-96 border-l bg-card overflow-hidden">
              <WorkflowPropertyPanel />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 m-0 p-6 data-[state=inactive]:hidden">
          <div className="max-w-2xl space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Workflow Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Workflow Status</label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant={isActive ? "default" : "outline"}
                      onClick={() => setIsActive(true)}
                    >
                      Active
                    </Button>
                    <Button
                      variant={!isActive ? "default" : "outline"}
                      onClick={() => setIsActive(false)}
                    >
                      Draft
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {isActive 
                      ? 'This workflow is active and will process new entries' 
                      : 'This workflow is in draft mode and will not process entries'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Triggers</label>
                  <p className="text-sm text-muted-foreground">
                    {triggerCount} trigger{triggerCount !== 1 ? 's' : ''} configured
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Actions</label>
                  <p className="text-sm text-muted-foreground">
                    {actionCount} action{actionCount !== 1 ? 's' : ''} configured
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="flex-1 m-0 p-6 data-[state=inactive]:hidden">
          <div className="max-w-4xl space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Workflow Analytics</h3>
              <p className="text-muted-foreground">
                Analytics and execution history will be available here once the workflow is active.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Total Executions</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold">0%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Active Leads</div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function WorkflowBuilderMain(props: WorkflowBuilderMainProps) {
  return (
    <BuilderProvider>
      <WorkflowBuilderContent {...props} />
    </BuilderProvider>
  );
}
