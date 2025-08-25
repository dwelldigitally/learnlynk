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
import { useJourneyTemplates, useCreateJourneyFromTemplate } from '@/services/academicJourneyService';
import { usePrograms } from '@/services/programService';
import { JourneyTemplate } from '@/types/academicJourney';
import { BookOpen, Clock, Users, ArrowRight, CheckCircle, Settings, Eye, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function JourneyBuilder() {
  const [activeTab, setActiveTab] = useState<'templates' | 'builder' | 'preview'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<JourneyTemplate | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [journeyName, setJourneyName] = useState('');
  const [journeyDescription, setJourneyDescription] = useState('');

  const { toast } = useToast();
  const { data: templates, isLoading } = useJourneyTemplates();
  const { data: programs } = usePrograms();
  const createJourneyMutation = useCreateJourneyFromTemplate();

  const handleTemplateSelect = (template: JourneyTemplate) => {
    setSelectedTemplate(template);
    setJourneyName(template.name);
    setJourneyDescription(template.description || '');
    setActiveTab('builder');
  };

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate || !selectedProgram) {
      toast({
        title: "Missing Information",
        description: "Please select both a template and program before creating the journey.",
        variant: "destructive"
      });
      return;
    }

    try {
      const journeyData = {
        name: journeyName || selectedTemplate.name,
        description: journeyDescription || selectedTemplate.description || '',
        programId: selectedProgram.id,
        templateId: selectedTemplate.id,
        program_id: selectedProgram.id,
        template_id: selectedTemplate.id
      };

      await createJourneyMutation.mutateAsync(journeyData);
      
      toast({
        title: "Journey Created",
        description: `Academic journey "${journeyData.name}" has been created successfully.`,
      });
      
      // Reset form
      setActiveTab('templates');
      setSelectedTemplate(null);
      setSelectedProgram(null);
      setJourneyName('');
      setJourneyDescription('');
    } catch (error) {
      console.error('Error creating journey:', error);
      toast({
        title: "Error",
        description: "Failed to create journey. Please try again.",
        variant: "destructive"
      });
    }
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
          Select a pre-built academic journey template to get started quickly
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

  const renderJourneyBuilder = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Configure Journey</h3>
        <p className="text-muted-foreground">
          Set up your academic journey based on the selected template
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
                <h4 className="font-medium mb-2">{selectedTemplate.name}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedTemplate.description}
                </p>
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
              value={journeyName}
              onChange={(e) => setJourneyName(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="journeyDescription">Description</Label>
            <Textarea
              id="journeyDescription"
              placeholder="Describe the academic journey..."
              value={journeyDescription}
              onChange={(e) => setJourneyDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="programSelect">Select Program</Label>
            <Select 
              value={selectedProgram?.id || ''} 
              onValueChange={(value) => {
                const program = programs?.find(p => p.id === value);
                setSelectedProgram(program);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a program..." />
              </SelectTrigger>
              <SelectContent>
                {programs?.map(program => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Journey Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name:</span>
              <span className="text-sm font-medium">{journeyName || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Program:</span>
              <span className="text-sm font-medium">{selectedProgram?.name || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Template:</span>
              <span className="text-sm font-medium">{selectedTemplate?.name || 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Complexity:</span>
              <Badge className={getComplexityColor(selectedTemplate?.complexity_level || 'medium')}>
                {selectedTemplate?.complexity_level || 'Medium'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={() => setActiveTab('templates')}>
          <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
          Back to Templates
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab('preview')}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button 
            onClick={handleCreateFromTemplate}
            disabled={!selectedTemplate || !selectedProgram || createJourneyMutation.isPending}
          >
            {createJourneyMutation.isPending ? 'Creating...' : 'Create Journey'}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderJourneyPreview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Journey Preview</h3>
        <p className="text-muted-foreground">
          Review your configured academic journey before creating
        </p>
      </div>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {journeyName || selectedTemplate.name}
            </CardTitle>
            <p className="text-muted-foreground">
              {journeyDescription || selectedTemplate.description}
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
                    {selectedProgram?.name.split(' ').slice(0, 2).join(' ') || 'Program'}
                  </div>
                  <div className="text-sm text-muted-foreground">Program</div>
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

      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={() => setActiveTab('builder')}>
          <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
          Back to Builder
        </Button>
        
        <Button 
          onClick={handleCreateFromTemplate}
          disabled={!selectedTemplate || !selectedProgram || createJourneyMutation.isPending}
        >
          {createJourneyMutation.isPending ? 'Creating...' : 'Create Journey'}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Academic Journey Builder</h2>
        <p className="text-muted-foreground mt-2">
          Create structured academic journeys for your programs using pre-built templates
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="builder" disabled={!selectedTemplate}>Builder</TabsTrigger>
          <TabsTrigger value="preview" disabled={!selectedTemplate}>Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          {renderTemplatesList()}
        </TabsContent>

        <TabsContent value="builder" className="mt-6">
          {renderJourneyBuilder()}
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          {renderJourneyPreview()}
        </TabsContent>
        
        <TabsContent value="configure-plays" className="mt-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Journey-Play Configuration</h3>
            <p className="text-muted-foreground">
              Configure which plays can run during each journey stage (available after journey creation)
            </p>
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <p className="text-sm">
                Play configuration will be available after creating the journey. 
                You'll be able to map specific plays to journey stages and set timing rules.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}