import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Route, Settings, Brain, Zap, Plus, X, ArrowRight } from "lucide-react";
import { JourneyAIAgentData } from "../JourneyBasedAIAgentWizard";
import { useState } from "react";

interface JourneyIntegrationStepProps {
  data: JourneyAIAgentData;
  updateData: (updates: Partial<JourneyAIAgentData>) => void;
}

const MOCK_JOURNEY_PATHS = [
  {
    id: 'ug-science',
    name: 'UG Science Application',
    description: 'Undergraduate science program application journey',
    stages: ['Inquiry', 'Application', 'Documents', 'Interview', 'Decision', 'Enrollment'],
    studentCount: 450
  },
  {
    id: 'international',
    name: 'International Student Journey', 
    description: 'Specialized journey for international applicants',
    stages: ['Inquiry', 'Application', 'Visa Documents', 'Language Test', 'Interview', 'Visa Process', 'Enrollment'],
    studentCount: 320
  },
  {
    id: 'graduate',
    name: 'Graduate Program Journey',
    description: 'Graduate and postgraduate application process',
    stages: ['Research', 'Application', 'Portfolio Review', 'Interview', 'Thesis Proposal', 'Decision'],
    studentCount: 180
  },
  {
    id: 'transfer',
    name: 'Transfer Student Journey',
    description: 'Credit transfer and application process',
    stages: ['Credit Evaluation', 'Application', 'Transcript Review', 'Decision', 'Enrollment'],
    studentCount: 95
  }
];

const STAGE_BEHAVIORS = {
  'Inquiry': ['Welcome message', 'Program information', 'FAQ responses'],
  'Application': ['Deadline reminders', 'Application assistance', 'Status updates'],
  'Documents': ['Document checklists', 'Upload reminders', 'Verification help'],
  'Interview': ['Interview prep', 'Scheduling assistance', 'Follow-up communications'],
  'Decision': ['Decision timeline updates', 'Next steps guidance', 'Acceptance follow-up'],
  'Enrollment': ['Enrollment confirmation', 'Orientation information', 'Welcome sequence']
};

export function JourneyIntegrationStep({ data, updateData }: JourneyIntegrationStepProps) {
  const [selectedJourney, setSelectedJourney] = useState<string>('');

  const addJourneyPath = (journeyId: string) => {
    if (journeyId && !data.journeyPaths.includes(journeyId)) {
      updateData({ journeyPaths: [...data.journeyPaths, journeyId] });
    }
  };

  const removeJourneyPath = (journeyId: string) => {
    updateData({ journeyPaths: data.journeyPaths.filter(j => j !== journeyId) });
  };

  const updateStageBehavior = (stage: string, behaviors: string[]) => {
    updateData({
      stageSpecificBehaviors: {
        ...data.stageSpecificBehaviors,
        [stage]: behaviors
      }
    });
  };

  const selectedJourneys = MOCK_JOURNEY_PATHS.filter(j => data.journeyPaths.includes(j.id));
  const totalStudents = selectedJourneys.reduce((sum, j) => sum + j.studentCount, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">Journey Integration</h3>
        <p className="text-muted-foreground">
          Connect your agent to academic journeys and configure stage-specific behaviors
        </p>
      </div>

      {/* Journey Path Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Academic Journey Paths
          </CardTitle>
          <CardDescription>Select which journeys this agent should be aware of</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={selectedJourney} onValueChange={setSelectedJourney}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a journey path..." />
              </SelectTrigger>
              <SelectContent>
                {MOCK_JOURNEY_PATHS.filter(j => !data.journeyPaths.includes(j.id)).map(journey => (
                  <SelectItem key={journey.id} value={journey.id}>
                    {journey.name} ({journey.studentCount} students)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => { addJourneyPath(selectedJourney); setSelectedJourney(''); }} disabled={!selectedJourney}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {selectedJourneys.map(journey => (
              <div key={journey.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{journey.name}</h4>
                      <Badge variant="outline">{journey.studentCount} students</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeJourneyPath(journey.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{journey.description}</p>
                    
                    {/* Journey Stages */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {journey.stages.map((stage, index) => (
                        <div key={stage} className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">{stage}</Badge>
                          {index < journey.stages.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedJourneys.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Route className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No journey paths selected</p>
              <p className="text-sm">Select journey paths to enable stage-aware behavior</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto-Adjust Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Journey Intelligence
          </CardTitle>
          <CardDescription>Configure how the agent adapts to journey stages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="autoAdjust">Auto-adjust behavior by stage</Label>
              <p className="text-sm text-muted-foreground">
                Agent will automatically adapt its approach based on the student's current journey stage
              </p>
            </div>
            <Switch
              id="autoAdjust"
              checked={data.autoAdjustByStage}
              onCheckedChange={(checked) => updateData({ autoAdjustByStage: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stage-Specific Behaviors */}
      {data.autoAdjustByStage && selectedJourneys.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Stage-Specific Behaviors
            </CardTitle>
            <CardDescription>Configure what the agent should do at each journey stage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(STAGE_BEHAVIORS).map(([stage, behaviors]) => (
              <div key={stage} className="space-y-3">
                <h4 className="font-medium">{stage} Stage</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pl-4">
                  {behaviors.map(behavior => (
                    <div key={behavior} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${stage}-${behavior}`}
                        checked={data.stageSpecificBehaviors[stage]?.includes(behavior) || false}
                        onCheckedChange={(checked) => {
                          const currentBehaviors = data.stageSpecificBehaviors[stage] || [];
                          if (checked) {
                            updateStageBehavior(stage, [...currentBehaviors, behavior]);
                          } else {
                            updateStageBehavior(stage, currentBehaviors.filter(b => b !== behavior));
                          }
                        }}
                      />
                      <Label htmlFor={`${stage}-${behavior}`} className="text-sm">
                        {behavior}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Journey Summary */}
      {selectedJourneys.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Journey Integration Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Connected Journeys</p>
                <p className="text-2xl font-bold">{selectedJourneys.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{totalStudents.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Auto-Adjustment</p>
                <p className="text-2xl font-bold">{data.autoAdjustByStage ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}