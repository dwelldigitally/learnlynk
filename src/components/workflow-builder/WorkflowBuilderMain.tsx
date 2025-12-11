import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Save, 
  Eye, 
  Settings, 
  BarChart3, 
  ArrowLeft, 
  Clock,
  LayoutTemplate,
  X
} from 'lucide-react';
import { BuilderProvider, useBuilder } from '@/contexts/BuilderContext';
import { WorkflowCanvas } from './WorkflowCanvas';
import { WorkflowActionLibrary } from './WorkflowActionLibrary';
import { WorkflowPropertyPanel } from './WorkflowPropertyPanel';
import { WorkflowTemplateSelector } from './WorkflowTemplateSelector';
import { WorkflowPreviewPanel } from './WorkflowPreviewPanel';
import { WorkflowSettingsPanel } from './WorkflowSettingsPanel';
import { WorkflowAnalyticsPanel } from './WorkflowAnalyticsPanel';
import { workflowElementTypes } from '@/config/elementTypes';
import { WorkflowTemplate } from '@/config/workflowTemplates';
import { toast } from 'sonner';

interface WorkflowBuilderMainProps {
  initialConfig?: any;
  onSave: (config: any) => Promise<void>;
  onCancel: () => void;
}

const defaultSettings = {
  isActive: false,
  triggerSettings: {
    triggerType: 'event',
    reEnrollment: false,
    reEnrollmentDelay: 7,
    reEnrollmentDelayUnit: 'days'
  },
  enrollmentSettings: {
    targetAudience: [],
    exclusionCriteria: [],
    maxConcurrent: 0,
    removeFromOtherWorkflows: false
  },
  scheduleSettings: {
    runImmediately: true,
    businessHoursOnly: false,
    timezone: 'America/New_York',
    startDate: '',
    endDate: '',
    durationLimit: false,
    durationValue: 30,
    durationUnit: 'days'
  },
  goalSettings: {
    goalType: 'none',
    exitOnGoal: true,
    exitOnUnsubscribe: true,
    exitOnBounce: true
  }
};

function WorkflowBuilderContent({ initialConfig, onSave, onCancel }: WorkflowBuilderMainProps) {
  const { state, dispatch } = useBuilder();
  const [workflowName, setWorkflowName] = useState('New Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [activeTab, setActiveTab] = useState('workflow');
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    if (initialConfig) {
      dispatch({
        type: 'SET_CONFIG',
        payload: initialConfig
      });
      setWorkflowName(initialConfig.name || 'New Workflow');
      setWorkflowDescription(initialConfig.description || '');
      setSettings({
        ...defaultSettings,
        ...initialConfig.settings,
        isActive: initialConfig.settings?.isActive || false
      });
    } else {
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          id: crypto.randomUUID(),
          name: 'New Workflow',
          description: '',
          type: 'workflow',
          elements: [],
          settings: defaultSettings,
          metadata: {}
        }
      });
      // Show templates for new workflows
      setShowTemplates(true);
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

  const handleSelectTemplate = (template: WorkflowTemplate | null) => {
    if (!template) {
      // Start from scratch
      return;
    }

    // Convert template steps to workflow elements
    const elements: any[] = template.steps.map((step, index) => ({
      id: crypto.randomUUID(),
      type: step.type,
      elementType: step.type,
      title: step.title,
      description: step.description || '',
      position: { x: 0, y: index * 100 },
      config: step.config,
      conditionGroups: step.type === 'trigger' || step.type === 'condition' ? [] : undefined
    }));

    // Add trigger element
    const triggerElement: any = {
      id: crypto.randomUUID(),
      type: 'trigger',
      elementType: 'trigger',
      title: 'Trigger',
      description: `When: ${template.triggerType}`,
      position: { x: 0, y: 0 },
      config: {},
      conditionGroups: [{
        operator: 'AND',
        conditions: template.triggerConditions
      }]
    };

    dispatch({
      type: 'SET_CONFIG',
      payload: {
        ...state.config,
        elements: [triggerElement, ...elements]
      }
    });

    setWorkflowName(template.name);
    setWorkflowDescription(template.description);
    toast.success(`Template "${template.name}" loaded`);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const config = {
        ...state.config,
        name: workflowName,
        description: workflowDescription,
        settings
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

  const stepCount = state.config.elements.length;
  const actionCount = state.config.elements.filter(el => el.type !== 'trigger').length;
  const triggerCount = state.config.elements.filter(el => el.type === 'trigger').length;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
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
              <Badge variant={settings.isActive ? "default" : "secondary"}>
                {settings.isActive ? 'Active' : 'Draft'}
              </Badge>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{stepCount} steps</span>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
              <LayoutTemplate className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button variant="outline" size="sm" onClick={handleTest}>
              <Play className="h-4 w-4 mr-2" />
              Test
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
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
            className="border-none shadow-none resize-none text-sm text-muted-foreground min-h-[40px] max-h-[60px]"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-6 pt-2">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="workflow" className="flex-1 m-0 data-[state=inactive]:hidden">
          <div className="flex h-[calc(100vh-200px)]">
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

        <TabsContent value="settings" className="flex-1 m-0 data-[state=inactive]:hidden overflow-auto">
          <div className="max-w-3xl mx-auto py-6">
            <WorkflowSettingsPanel 
              settings={settings}
              onSettingsChange={setSettings}
              triggerCount={triggerCount}
              actionCount={actionCount}
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="flex-1 m-0 p-6 data-[state=inactive]:hidden overflow-auto">
          <WorkflowAnalyticsPanel workflowId={state.config.id} />
        </TabsContent>
      </Tabs>

      {/* Template Selector Dialog */}
      <WorkflowTemplateSelector
        open={showTemplates}
        onOpenChange={setShowTemplates}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Preview Side Panel */}
      {showPreview && (
        <div className="fixed inset-y-0 right-0 w-[500px] bg-background border-l shadow-xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Workflow Preview</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <WorkflowPreviewPanel 
            config={{
              name: workflowName,
              description: workflowDescription,
              elements: state.config.elements,
              settings
            }}
            onClose={() => setShowPreview(false)}
          />
        </div>
      )}
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
