import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BuilderProvider, useBuilder } from '@/contexts/BuilderContext';
import { ElementPalette } from './ElementPalette';
import { CanvasArea } from './CanvasArea';
import { PropertyPanel } from './PropertyPanel';
import { ActionsSidebar } from './ActionsSidebar';
import { PreviewPanel } from './PreviewPanel';
import { JourneyElementPalette } from '@/components/journey-builder/JourneyElementPalette';
import { JourneyPropertyPanel } from '@/components/journey-builder/JourneyPropertyPanel';
import { BuilderType, UniversalElement } from '@/types/universalBuilder';
import { getElementTypesForBuilder } from '@/config/elementTypes';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Copy, 
  Undo, 
  Redo, 
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';

interface UniversalBuilderProps {
  builderType?: BuilderType;
  initialConfig?: any;
  onSave?: (config: any) => void;
  onCancel?: () => void;
}

export function UniversalBuilder({ 
  builderType = 'form', 
  initialConfig, 
  onSave, 
  onCancel 
}: UniversalBuilderProps) {
  return (
    <BuilderProvider>
      <UniversalBuilderContent 
        builderType={builderType}
        initialConfig={initialConfig}
        onSave={onSave}
        onCancel={onCancel}
      />
    </BuilderProvider>
  );
}

function UniversalBuilderContent({ 
  builderType, 
  initialConfig, 
  onSave, 
  onCancel 
}: UniversalBuilderProps) {
  const { state, dispatch } = useBuilder();
  const [activeTab, setActiveTab] = useState('build');

  React.useEffect(() => {
    if (initialConfig) {
      dispatch({ type: 'SET_CONFIG', payload: initialConfig });
    } else {
      dispatch({ type: 'SET_BUILDER_TYPE', payload: builderType });
    }
  }, [initialConfig, builderType, dispatch]);

  const handleAddElement = (elementType: string) => {
    const elementTypes = getElementTypesForBuilder(state.config.type);
    const elementTypeConfig = elementTypes.find(type => type.type === elementType);
    
    if (!elementTypeConfig) return;

    const newElement: UniversalElement = {
      id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: elementType,
      title: elementTypeConfig.label,
      description: '',
      position: state.config.elements.length,
      config: { ...elementTypeConfig.defaultConfig },
      elementType: state.config.type as any,
    } as UniversalElement;

    dispatch({ type: 'ADD_ELEMENT', payload: newElement });
    dispatch({ type: 'SAVE_STATE' });
    toast.success(`${elementTypeConfig.label} added`);
  };

  const handleSave = () => {
    if (!state.config.name.trim()) {
      toast.error('Please enter a name for your configuration');
      return;
    }

    if (onSave) {
      onSave(state.config);
    }
    
    dispatch({ type: 'SAVE_STATE' });
    toast.success('Configuration saved successfully');
  };

  const handlePreview = () => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: !state.isPreviewMode });
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(state.config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${state.config.name || 'config'}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Configuration exported');
  };

  const getBuilderTitle = () => {
    switch (state.config.type) {
      case 'form':
        return 'Form Builder';
      case 'workflow':
        return 'Workflow Builder';
      case 'campaign':
        return 'Campaign Builder';
      case 'journey':
        return 'Journey Builder';
      default:
        return 'Universal Builder';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-semibold">{getBuilderTitle()}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{state.config.type}</Badge>
                <span className="text-sm text-muted-foreground">
                  {state.config.elements.length} elements
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUndo}
              disabled={state.historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRedo}
              disabled={state.historyIndex >= state.history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePreview}>
              {state.isPreviewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {state.isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="m-4 w-fit">
            <TabsTrigger value="build">Build</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="flex-1 flex overflow-hidden m-0">
            <div className="flex-1 flex gap-4 p-4">
              {/* Journey Builder Layout */}
              {state.config.type === 'journey' && (
                <>
                  {/* Left Sidebar - Journey Element Palette */}
                  <div className="w-80 space-y-4">
                    <JourneyElementPalette onAddElement={handleAddElement} />
                  </div>

                  {/* Center - Sequential Journey Canvas */}
                  <div className="flex-1 overflow-auto">
                    {state.isPreviewMode ? (
                      <PreviewPanel />
                    ) : (
                      <CanvasArea onAddElement={handleAddElement} />
                    )}
                  </div>

                  {/* Right Sidebar - Journey Property Panel */}
                  <div className="w-80 space-y-4">
                    <JourneyPropertyPanel />
                  </div>
                </>
              )}

              {/* Form Builder Layout */}
              {state.config.type === 'form' && (
                <>
                  {/* Left Sidebar - Element Palette */}
                  <div className="w-64 flex-shrink-0">
                    <ElementPalette onAddElement={handleAddElement} />
                  </div>

                  {/* Center - Canvas */}
                  <div className="flex-1 overflow-auto">
                    {state.isPreviewMode ? (
                      <PreviewPanel />
                    ) : (
                      <CanvasArea onAddElement={handleAddElement} />
                    )}
                  </div>

                  {/* Right Sidebar - Properties */}
                  <div className="w-80 flex-shrink-0">
                    <PropertyPanel />
                  </div>
                </>
              )}

              {/* Workflow/Campaign Builder Layout */}
              {(state.config.type === 'workflow' || state.config.type === 'campaign') && (
                <>
                  {/* Center - Canvas */}
                  <div className="flex-1 overflow-auto max-w-4xl mx-auto">
                    {state.isPreviewMode ? (
                      <PreviewPanel />
                    ) : (
                      <CanvasArea onAddElement={handleAddElement} />
                    )}
                  </div>

                  {/* Right Sidebar - Actions */}
                  <div className="w-80 flex-shrink-0">
                    <ActionsSidebar onAddElement={handleAddElement} />
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-auto m-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={state.config.name}
                    onChange={(e) => dispatch({
                      type: 'SET_CONFIG',
                      payload: { ...state.config, name: e.target.value }
                    })}
                    placeholder="Enter configuration name"
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={state.config.description}
                    onChange={(e) => dispatch({
                      type: 'SET_CONFIG',
                      payload: { ...state.config, description: e.target.value }
                    })}
                    placeholder="Enter configuration description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <Select
                    value={state.config.type}
                    onValueChange={(value: BuilderType) => dispatch({
                      type: 'SET_BUILDER_TYPE',
                      payload: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="form">Form</SelectItem>
                      <SelectItem value="workflow">Workflow</SelectItem>
                      <SelectItem value="campaign">Campaign</SelectItem>
                      <SelectItem value="journey">Journey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-auto m-4">
            <PreviewPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}