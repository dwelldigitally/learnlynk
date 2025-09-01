import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Workflow, Zap, Route } from "lucide-react";
import { AIAgentWizardData } from "@/types/ai-agent";

interface IntegrationStepProps {
  data: AIAgentWizardData;
  updateData: (updates: Partial<AIAgentWizardData>) => void;
}

// Mock data - in real app, this would come from API
const AVAILABLE_JOURNEYS = [
  { id: 'domestic-undergrad', name: 'Domestic Undergraduate', description: 'Standard funnel for domestic students' },
  { id: 'international', name: 'International Students', description: 'Specialized path for international applicants' },
  { id: 'transfer', name: 'Transfer Students', description: 'Transfer student admissions process' },
  { id: 'graduate', name: 'Graduate Programs', description: 'Graduate school admissions' },
  { id: 'continuing-ed', name: 'Continuing Education', description: 'Professional and continuing education' }
];

const AVAILABLE_PLAYS = [
  { id: 'welcome-sequence', name: 'Welcome Sequence', category: 'Onboarding' },
  { id: 're-engage', name: 'Re-Engage Play', category: 'Nurturing' },
  { id: 'deadline-reminder', name: 'Deadline Reminder', category: 'Conversion' },
  { id: 'doc-follow-up', name: 'Document Follow-up', category: 'Support' },
  { id: 'interview-prep', name: 'Interview Preparation', category: 'Support' },
  { id: 'conversion-boost', name: 'Conversion Boost', category: 'Conversion' }
];

export function IntegrationStep({ data, updateData }: IntegrationStepProps) {
  const updateIntegration = (updates: Partial<typeof data.journeyIntegration>) => {
    updateData({
      journeyIntegration: {
        ...data.journeyIntegration,
        ...updates
      }
    });
  };

  const toggleJourney = (journeyId: string, checked: boolean) => {
    const updatedJourneys = checked
      ? [...data.journeyIntegration.allowedJourneys, journeyId]
      : data.journeyIntegration.allowedJourneys.filter(id => id !== journeyId);
    
    updateIntegration({ allowedJourneys: updatedJourneys });
  };

  const togglePlay = (playId: string, checked: boolean) => {
    const updatedPlays = checked
      ? [...data.journeyIntegration.allowedPlays, playId]
      : data.journeyIntegration.allowedPlays.filter(id => id !== playId);
    
    updateIntegration({ allowedPlays: updatedPlays });
  };

  const playsByCategory = AVAILABLE_PLAYS.reduce((acc, play) => {
    if (!acc[play.category]) acc[play.category] = [];
    acc[play.category].push(play);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_PLAYS>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Journey Integration
          </CardTitle>
          <CardDescription>
            Configure how the agent interacts with student journeys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Override Journey Steps</Label>
                <p className="text-sm text-muted-foreground">
                  Allow agent to move students between journey steps based on behavior
                </p>
              </div>
              <Switch
                checked={data.journeyIntegration.canOverrideSteps}
                onCheckedChange={(checked) => updateIntegration({ canOverrideSteps: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Trigger Plays</Label>
                <p className="text-sm text-muted-foreground">
                  Enable agent to execute action sequences (plays) automatically
                </p>
              </div>
              <Switch
                checked={data.journeyIntegration.canTriggerPlays}
                onCheckedChange={(checked) => updateIntegration({ canTriggerPlays: checked })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Allowed Journeys</Label>
            <p className="text-sm text-muted-foreground">
              Select which student journeys this agent can manage
            </p>
            <div className="space-y-3">
              {AVAILABLE_JOURNEYS.map((journey) => (
                <div key={journey.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={journey.id}
                    checked={data.journeyIntegration.allowedJourneys.includes(journey.id)}
                    onCheckedChange={(checked) => toggleJourney(journey.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={journey.id} className="font-medium cursor-pointer">
                      {journey.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{journey.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Play Access
          </CardTitle>
          <CardDescription>
            Choose which action sequences (plays) the agent can execute
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(playsByCategory).map(([category, plays]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  <Label className="font-medium">{category} Plays</Label>
                  <Badge variant="outline">{plays.length} available</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                  {plays.map((play) => (
                    <div key={play.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={play.id}
                        checked={data.journeyIntegration.allowedPlays.includes(play.id)}
                        onCheckedChange={(checked) => togglePlay(play.id, checked as boolean)}
                      />
                      <Label htmlFor={play.id} className="text-sm cursor-pointer">
                        {play.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {(data.journeyIntegration.allowedJourneys.length > 0 || data.journeyIntegration.allowedPlays.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Integration Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium mb-2">Connected Journeys</p>
                <div className="space-y-1">
                  {data.journeyIntegration.allowedJourneys.length === 0 ? (
                    <p className="text-sm text-muted-foreground">None selected</p>
                  ) : (
                    data.journeyIntegration.allowedJourneys.map(journeyId => {
                      const journey = AVAILABLE_JOURNEYS.find(j => j.id === journeyId);
                      return (
                        <Badge key={journeyId} variant="secondary" className="mr-1 mb-1">
                          {journey?.name}
                        </Badge>
                      );
                    })
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Available Plays</p>
                <div className="space-y-1">
                  {data.journeyIntegration.allowedPlays.length === 0 ? (
                    <p className="text-sm text-muted-foreground">None selected</p>
                  ) : (
                    data.journeyIntegration.allowedPlays.map(playId => {
                      const play = AVAILABLE_PLAYS.find(p => p.id === playId);
                      return (
                        <Badge key={playId} variant="outline" className="mr-1 mb-1">
                          {play?.name}
                        </Badge>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-green-50/50 border-green-200">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-medium text-green-900">🔗 Integration Benefits:</p>
            <ul className="text-green-800 space-y-1 ml-4">
              <li>• Agent can dynamically adjust student paths based on behavior</li>
              <li>• Automated execution of proven action sequences</li>
              <li>• Maintains consistency with institutional workflows</li>
              <li>• All actions are logged and auditable</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}