import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Settings, Eye, Save, ArrowRight, Workflow, Clock, MessageSquare, FileText } from 'lucide-react';
import { useJourneyTemplates, useCreateJourneyFromTemplate } from '@/services/academicJourneyService';
import { usePrograms } from '@/services/programService';
import { JOURNEY_STAGE_TYPES, REQUIREMENT_TYPES, CHANNEL_TYPES } from '@/types/academicJourney';
import type { JourneyTemplate, JourneyWizardState } from '@/types/academicJourney';
import { toast } from 'sonner';

export function JourneyBuilder() {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<JourneyTemplate | null>(null);
  const [wizardState, setWizardState] = useState<JourneyWizardState>({
    step: 0,
    journey: {},
    stages: [],
    validation_errors: {}
  });

  const { data: templates, isLoading: templatesLoading } = useJourneyTemplates();
  const { data: programs } = usePrograms();
  const createFromTemplate = useCreateJourneyFromTemplate();

  const handleTemplateSelect = (template: JourneyTemplate) => {
    setSelectedTemplate(template);
    setWizardState({
      step: 1,
      journey: {
        name: `${template.name} Journey`,
        description: template.description
      },
      stages: [],
      validation_errors: {}
    });
    setActiveTab('builder');
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate || !wizardState.journey.program_id) {
      toast.error('Please select a program');
      return;
    }

    try {
      await createFromTemplate.mutateAsync({
        templateId: selectedTemplate.id,
        programId: wizardState.journey.program_id,
        customization: {
          name: wizardState.journey.name,
          description: wizardState.journey.description
        }
      });
      
      toast.success('Academic Journey created successfully!');
      
      // Reset wizard state
      setWizardState({
        step: 0,
        journey: {},
        stages: [],
        validation_errors: {}
      });
      setSelectedTemplate(null);
      setActiveTab('templates');
    } catch (error) {
      toast.error('Failed to create journey');
      console.error(error);
    }
  };

  const renderTemplateCard = (template: JourneyTemplate) => (
    <Card 
      key={template.id} 
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105"
      onClick={() => handleTemplateSelect(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{template.name}</CardTitle>
          <Badge variant={template.complexity_level === 'simple' ? 'default' : 
                         template.complexity_level === 'medium' ? 'secondary' : 'destructive'}>
            {template.complexity_level}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            <span>{template.template_data?.stages?.length || 0} stages</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{template.estimated_duration_days || 'N/A'} days</span>
          </div>
        </div>
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            {template.category}
          </Badge>
          {template.program_type && (
            <Badge variant="outline" className="text-xs ml-2">
              {template.program_type}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderJourneyBuilder = () => {
    if (!selectedTemplate) return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Journey Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="journey-name">Journey Name</Label>
                <Input
                  id="journey-name"
                  value={wizardState.journey.name || ''}
                  onChange={(e) => setWizardState(prev => ({
                    ...prev,
                    journey: { ...prev.journey, name: e.target.value }
                  }))}
                  placeholder="Enter journey name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program-select">Target Program</Label>
                <Select 
                  value={wizardState.journey.program_id || ''}
                  onValueChange={(value) => setWizardState(prev => ({
                    ...prev,
                    journey: { ...prev.journey, program_id: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs?.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="journey-description">Description</Label>
              <Textarea
                id="journey-description"
                value={wizardState.journey.description || ''}
                onChange={(e) => setWizardState(prev => ({
                  ...prev,
                  journey: { ...prev.journey, description: e.target.value }
                }))}
                placeholder="Describe this journey..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Journey Preview
              <Badge variant="secondary">{selectedTemplate.name}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {selectedTemplate.template_data?.stages?.map((stage, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{JOURNEY_STAGE_TYPES[stage.stage_type]?.icon}</span>
                        <div>
                          <h4 className="font-medium">{stage.name}</h4>
                          <p className="text-sm text-muted-foreground">{stage.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {stage.timing_config?.stall_threshold_days || 'N/A'} days
                      </Badge>
                    </div>

                    {stage.requirements?.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Requirements
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {stage.requirements.map((req, reqIndex) => (
                            <Badge key={reqIndex} variant="secondary" className="text-xs">
                              {REQUIREMENT_TYPES[req.requirement_type]?.icon} {req.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {stage.channel_rules?.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Communication Channels
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {stage.channel_rules.map((rule, ruleIndex) => (
                            <Badge 
                              key={ruleIndex} 
                              variant={rule.is_allowed ? "default" : "destructive"} 
                              className="text-xs"
                            >
                              {CHANNEL_TYPES[rule.channel_type]?.icon} {rule.channel_type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {index < selectedTemplate.template_data.stages.length - 1 && (
                      <div className="flex justify-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setActiveTab('templates');
              setSelectedTemplate(null);
            }}
          >
            Back to Templates
          </Button>
          <Button 
            onClick={handleCreateFromTemplate}
            disabled={!wizardState.journey.program_id || createFromTemplate.isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {createFromTemplate.isPending ? 'Creating...' : 'Create Journey'}
          </Button>
        </div>
      </div>
    );
  };

  const renderTemplatesList = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Journey Templates</h2>
          <p className="text-muted-foreground">Choose a template to start building your academic journey</p>
        </div>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Create Custom Template
        </Button>
      </div>

      {templatesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates?.map(renderTemplateCard)}
        </div>
      )}

      {templates?.length === 0 && !templatesLoading && (
        <Card className="p-8 text-center">
          <Workflow className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Templates Available</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first journey template</p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create First Template
          </Button>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academic Journey Builder</h1>
          <p className="text-muted-foreground">Design program-specific roadmaps from first inquiry to day-one ready</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2" disabled={!selectedTemplate}>
            <Settings className="h-4 w-4" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2" disabled={!selectedTemplate}>
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {renderTemplatesList()}
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          {renderJourneyBuilder()}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Journey Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Preview functionality coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}