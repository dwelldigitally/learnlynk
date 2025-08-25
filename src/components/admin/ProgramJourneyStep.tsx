import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useJourneyTemplates } from '@/services/academicJourneyService';
import { JourneyTemplate, JourneyWizardState } from '@/types/academicJourney';
import { BookOpen, Clock, Users, ArrowRight, CheckCircle, Settings, Eye } from 'lucide-react';

interface ProgramJourneyStepProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const onUpdate = (onDataChange: (data: any) => void) => onDataChange;

export function ProgramJourneyStep({ data, onDataChange }: ProgramJourneyStepProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<JourneyTemplate | null>(null);
  const [journeyData, setJourneyData] = useState<JourneyWizardState>({
    name: data.journeyName || '',
    description: data.journeyDescription || '',
    selectedTemplate: null,
    programId: null,
    customStages: [],
    metadata: {}
  });
  const [activeTab, setActiveTab] = useState<'templates' | 'configure' | 'preview'>('templates');

  const { data: templates, isLoading } = useJourneyTemplates();

  useEffect(() => {
    if (data.selectedJourneyTemplate) {
      const template = templates?.find(t => t.id === data.selectedJourneyTemplate);
      if (template) {
        setSelectedTemplate(template);
        setActiveTab('configure');
      }
    }
  }, [data.selectedJourneyTemplate, templates]);

  const handleTemplateSelect = (template: JourneyTemplate) => {
    setSelectedTemplate(template);
    setJourneyData(prev => ({
      ...prev,
      selectedTemplate: template,
      name: template.name,
      description: template.description || ''
    }));
    setActiveTab('configure');
    
    onDataChange({
      ...data,
      selectedJourneyTemplate: template.id,
      journeyName: template.name,
      journeyDescription: template.description,
      journeyComplexity: template.complexity_level,
      journeyEstimatedDuration: template.estimated_duration_days
    });
  };

  const handleJourneyUpdate = (field: string, value: any) => {
    setJourneyData(prev => ({ ...prev, [field]: value }));
    onDataChange({
      ...data,
      [`journey${field.charAt(0).toUpperCase() + field.slice(1)}`]: value
    });
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTemplateCard = (template: JourneyTemplate) => (
    <Card 
      key={template.id} 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => handleTemplateSelect(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
          </div>
          {selectedTemplate?.id === template.id && (
            <CheckCircle className="h-5 w-5 text-primary" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{template.complexity_level}</span>
          </div>
          {template.estimated_duration_days && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{template.estimated_duration_days} days</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={getComplexityColor(template.complexity_level)}>
            {template.complexity_level}
          </Badge>
          <Badge variant="outline">{template.category}</Badge>
        </div>
      </CardContent>
    </Card>
  );

  const renderTemplatesList = () => (
    <div className="space-y-4">
      <div className="text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Choose a Journey Template</h3>
        <p className="text-muted-foreground">
          Select a pre-built academic journey template that matches your program structure
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(renderTemplateCard)}
        </div>
      ) : (
        <Card className="text-center py-8">
          <CardContent>
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Templates Available</h3>
            <p className="text-muted-foreground">Journey templates will be available soon.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderJourneyConfiguration = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Configure Your Journey</h3>
        <p className="text-muted-foreground">
          Customize the journey details for your program
        </p>
      </div>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium">{selectedTemplate.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
              </div>
              <div className="flex gap-2">
                <Badge className={getComplexityColor(selectedTemplate.complexity_level)}>
                  {selectedTemplate.complexity_level}
                </Badge>
                <Badge variant="outline">{selectedTemplate.category}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="journeyName">Journey Name</Label>
            <Input
              id="journeyName"
              placeholder="e.g., Computer Science Application Journey"
              value={journeyData.name}
              onChange={(e) => handleJourneyUpdate('name', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="journeyDescription">Description</Label>
            <Textarea
              id="journeyDescription"
              placeholder="Describe the academic journey for this program..."
              value={journeyData.description}
              onChange={(e) => handleJourneyUpdate('description', e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Journey Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Complexity:</span>
              <Badge className={getComplexityColor(selectedTemplate?.complexity_level || 'medium')}>
                {selectedTemplate?.complexity_level || 'Medium'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Category:</span>
              <span className="text-sm font-medium">{selectedTemplate?.category || 'General'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Est. Duration:</span>
              <span className="text-sm font-medium">
                {selectedTemplate?.estimated_duration_days || 'TBD'} days
              </span>
            </div>
            {selectedTemplate?.template_data && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Stages:</span>
                <span className="text-sm font-medium">
                  {Array.isArray(selectedTemplate.template_data.stages) ? 
                    selectedTemplate.template_data.stages.length : 'Multiple'}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderJourneyPreview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Journey Preview</h3>
        <p className="text-muted-foreground">
          Review your configured academic journey
        </p>
      </div>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {journeyData.name || selectedTemplate.name}
            </CardTitle>
            <p className="text-muted-foreground">
              {journeyData.description || selectedTemplate.description}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {selectedTemplate.complexity_level}
                  </div>
                  <div className="text-sm text-muted-foreground">Complexity</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {selectedTemplate.estimated_duration_days || 'TBD'}
                  </div>
                  <div className="text-sm text-muted-foreground">Days</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {Array.isArray(selectedTemplate.template_data?.stages) ? 
                      selectedTemplate.template_data.stages.length : '3-5'}
                  </div>
                  <div className="text-sm text-muted-foreground">Stages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {selectedTemplate.category}
                  </div>
                  <div className="text-sm text-muted-foreground">Category</div>
                </div>
              </div>

              {Array.isArray(selectedTemplate.template_data?.stages) && (
                <div>
                  <h4 className="font-medium mb-3">Journey Stages</h4>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {selectedTemplate.template_data.stages.map((stage: any, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{stage.name}</div>
                            <div className="text-sm text-muted-foreground">{stage.description}</div>
                            {stage.requirements && stage.requirements.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {stage.requirements.slice(0, 3).map((req: any, reqIndex: number) => (
                                  <Badge key={reqIndex} variant="secondary" className="text-xs">
                                    {req.name}
                                  </Badge>
                                ))}
                                {stage.requirements.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{stage.requirements.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'templates' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'configure' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          } ${!selectedTemplate ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => selectedTemplate && setActiveTab('configure')}
          disabled={!selectedTemplate}
        >
          Configure
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'preview' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          } ${!selectedTemplate ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => selectedTemplate && setActiveTab('preview')}
          disabled={!selectedTemplate}
        >
          Preview
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'templates' && renderTemplatesList()}
        {activeTab === 'configure' && renderJourneyConfiguration()}
        {activeTab === 'preview' && renderJourneyPreview()}
      </div>

      {selectedTemplate && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-800">
            Journey template configured successfully. Continue to complete your program setup.
          </span>
        </div>
      )}
    </div>
  );
}