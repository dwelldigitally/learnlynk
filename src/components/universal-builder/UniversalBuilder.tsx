import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { TemplateSelector } from '@/components/campaign-builder/TemplateSelector';
import { InitialTemplateDialog } from '@/components/campaign-builder/InitialTemplateDialog';
import { AudienceSelector } from '@/components/campaign-builder/AudienceSelector';
import { TopNavigationBar } from '@/components/admin/TopNavigationBar';
import { CampaignTemplate } from '@/config/campaignTemplates';
import { BuilderType, UniversalElement } from '@/types/universalBuilder';
import { EnhancedLeadFilters } from '@/services/enhancedLeadService';
import { formElementTypes, workflowElementTypes, campaignElementTypes, journeyElementTypes, practicumElementTypes } from '@/config/elementTypes';
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
  onSelectTemplate?: (template: CampaignTemplate) => void;
  onStartBlank?: () => void;
}

export function UniversalBuilder({ 
  builderType = 'form', 
  initialConfig, 
  onSave, 
  onCancel,
  onSelectTemplate,
  onStartBlank
}: UniversalBuilderProps) {
  return (
    <BuilderProvider>
      <UniversalBuilderContent 
        builderType={builderType}
        initialConfig={initialConfig}
        onSave={onSave}
        onCancel={onCancel}
        onSelectTemplate={onSelectTemplate}
        onStartBlank={onStartBlank}
      />
    </BuilderProvider>
  );
}

function UniversalBuilderContent({ 
  builderType, 
  initialConfig, 
  onSave, 
  onCancel,
  onSelectTemplate,
  onStartBlank
}: UniversalBuilderProps) {
  const navigate = useNavigate();
  const { state, dispatch } = useBuilder();
  const [activeTab, setActiveTab] = useState('build');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [hasShownDialog, setHasShownDialog] = useState(false);
  
  // Audience selection state for campaigns
  const [campaignAudience, setCampaignAudience] = useState<{
    filters: EnhancedLeadFilters;
    count: number;
  } | undefined>(initialConfig?.settings?.audience);

  React.useEffect(() => {
    if (initialConfig) {
      dispatch({ type: 'SET_CONFIG', payload: initialConfig });
      if (initialConfig.settings?.audience) {
        setCampaignAudience(initialConfig.settings.audience);
      }
    } else {
      dispatch({ type: 'SET_BUILDER_TYPE', payload: builderType });
    }
    
    // Show template dialog only once for new campaigns
    if (builderType === 'campaign' && !hasShownDialog && !initialConfig?.name && !initialConfig?.elements?.length) {
      setShowTemplateDialog(true);
      setHasShownDialog(true);
    }
  }, [initialConfig, builderType, dispatch]);

  const handleTemplateSelect = (template: CampaignTemplate) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
      setShowTemplateDialog(false);
    }
  };

  const handleStartBlank = () => {
    if (onStartBlank) {
      onStartBlank();
    }
    setShowTemplateDialog(false);
  };

  const getElementTypes = () => {
    switch (state.config.type) {
      case 'form':
        return formElementTypes;
      case 'workflow':
        return workflowElementTypes;
      case 'campaign':
        return campaignElementTypes;
      case 'journey':
        return journeyElementTypes;
      case 'practicum':
        return practicumElementTypes;
      default:
        return [];
    }
  };

  const handleAddElement = (elementType: string) => {
    const elementTypes = getElementTypes();
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

    // For campaigns, include audience data in settings
    const configToSave = state.config.type === 'campaign' 
      ? {
          ...state.config,
          settings: {
            ...state.config.settings,
            audience: campaignAudience
          }
        }
      : state.config;

    if (onSave) {
      onSave(configToSave);
    }
    
    dispatch({ type: 'SAVE_STATE' });
    toast.success('Configuration saved successfully');
  };

  const handleAudienceSelect = (filters: EnhancedLeadFilters, count: number) => {
    setCampaignAudience({ filters, count });
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
      case 'practicum':
        return 'Practicum Journey Builder';
      default:
        return 'Universal Builder';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <TopNavigationBar
        activeSection="leads-marketing"
        onSectionChange={(sectionId) => {
          // Handle section navigation if needed
          if (sectionId === 'leads-marketing') {
            // Stay on current page
          } else {
            // Navigate to other sections
            navigate('/admin');
          }
        }}
      />
      
      {/* Builder Content */}
      <div className="flex-1 flex flex-col pt-14 sm:pt-16 lg:pt-20">
        {/* Initial Template Dialog for new campaigns */}
        {state.config.type === 'campaign' && showTemplateDialog && (
          <InitialTemplateDialog
            open={showTemplateDialog}
            onSelectTemplate={handleTemplateSelect}
            onStartBlank={handleStartBlank}
          />
        )}
        
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
            {state.config.type === 'campaign' && onSelectTemplate && onStartBlank && (
              <>
                <TemplateSelector
                  onSelectTemplate={onSelectTemplate}
                  onStartBlank={onStartBlank}
                />
                <Separator orientation="vertical" className="h-6" />
              </>
            )}
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
            {state.config.type === 'campaign' && (
              <TabsTrigger value="audience">Audience</TabsTrigger>
            )}
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="build" className="flex-1 flex overflow-hidden m-0">
            <div className="flex-1 flex gap-4 p-4 overflow-hidden">
              {/* Journey Builder Layout */}
              {state.config.type === 'journey' && (
                <>
                  {/* Left Sidebar - Journey Element Palette - Sticky */}
                  <div className="w-80 flex-shrink-0 overflow-hidden">
                    <div className="sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                      <JourneyElementPalette onAddElement={handleAddElement} />
                    </div>
                  </div>

                  {/* Center - Sequential Journey Canvas */}
                  <div className="flex-1 overflow-auto">
                    {state.isPreviewMode ? (
                      <PreviewPanel />
                    ) : (
                      <CanvasArea onAddElement={handleAddElement} />
                    )}
                  </div>

                  {/* Right Sidebar - Journey Property Panel - Sticky */}
                  <div className="w-80 flex-shrink-0 overflow-hidden">
                    <div className="sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                      <JourneyPropertyPanel />
                    </div>
                  </div>
                </>
              )}

              {/* Form Builder Layout */}
              {state.config.type === 'form' && (
                <>
                  {/* Left Sidebar - Element Palette - Sticky */}
                  <div className="w-64 flex-shrink-0 overflow-hidden">
                    <div className="sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                      <ElementPalette onAddElement={handleAddElement} />
                    </div>
                  </div>

                  {/* Center - Canvas */}
                  <div className="flex-1 overflow-auto">
                    {state.isPreviewMode ? (
                      <PreviewPanel />
                    ) : (
                      <CanvasArea onAddElement={handleAddElement} />
                    )}
                  </div>

                  {/* Right Sidebar - Properties - Sticky */}
                  <div className="w-80 flex-shrink-0 overflow-hidden">
                    <div className="sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                      <PropertyPanel />
                    </div>
                  </div>
                </>
              )}

              {/* Workflow/Campaign Builder Layout */}
              {(state.config.type === 'workflow' || state.config.type === 'campaign') && (
                <>
                  {/* Left Sidebar - Actions (Element Palette) - Sticky */}
                  <div className="w-80 flex-shrink-0 overflow-hidden">
                    <div className="sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                      <ActionsSidebar onAddElement={handleAddElement} />
                    </div>
                  </div>

                  {/* Center - Canvas */}
                  <div className="flex-1 overflow-auto">
                    {state.isPreviewMode ? (
                      <PreviewPanel />
                    ) : (
                      <CanvasArea onAddElement={handleAddElement} />
                    )}
                  </div>

                  {/* Right Sidebar - Properties - Sticky */}
                  <div className="w-80 flex-shrink-0 overflow-hidden">
                    <div className="sticky top-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
                      <PropertyPanel />
                    </div>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          {/* Audience Tab - Only for Campaigns */}
          <TabsContent value="audience" className="flex-1 overflow-auto m-0 p-4">
            {state.config.type === 'campaign' ? (
              <AudienceSelector
                selectedAudience={campaignAudience}
                onAudienceSelect={handleAudienceSelect}
              />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Audience selection is only available for campaign builders.
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-auto m-0 p-4">
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

          <TabsContent value="preview" className="flex-1 overflow-auto m-0 p-4">
            <PreviewPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </div>
  );
}