import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Zap, Plus, X, Settings, Target } from "lucide-react";
import { JourneyAIAgentData } from "../JourneyBasedAIAgentWizard";
import { useState } from "react";

interface PlaybookAccessStepProps {
  data: JourneyAIAgentData;
  updateData: (updates: Partial<JourneyAIAgentData>) => void;
}

const MOCK_PLAYS = [
  {
    id: 'welcome-sequence',
    name: 'Welcome Sequence',
    description: 'Initial welcome and program introduction',
    category: 'Onboarding',
    triggers: ['New Inquiry', 'First Contact'],
    actions: ['Welcome Email', 'Program PDF', 'FAQ Link'],
    successRate: 85
  },
  {
    id: 're-engage',
    name: 'Re-Engage Play',
    description: 'Re-engage dormant leads with value proposition',
    category: 'Nurturing',
    triggers: ['No Activity 7 Days', 'Abandoned Application'],
    actions: ['Personal Email', 'Success Stories', 'Limited Time Offer'],
    successRate: 62
  },
  {
    id: 'deadline-reminder',
    name: 'Deadline Reminder',
    description: 'Urgent reminders for approaching deadlines',
    category: 'Conversion',
    triggers: ['Deadline in 3 Days', 'Deadline in 1 Day'],
    actions: ['Urgent Email', 'SMS Alert', 'Application Link'],
    successRate: 78
  },
  {
    id: 'doc-follow-up',
    name: 'Document Follow-up',
    description: 'Help students complete missing documentation',
    category: 'Support',
    triggers: ['Missing Documents', 'Upload Failed'],
    actions: ['Document Checklist', 'Upload Tutorial', 'Support Chat'],
    successRate: 71
  },
  {
    id: 'interview-prep',
    name: 'Interview Preparation',
    description: 'Prepare students for interviews',
    category: 'Support',
    triggers: ['Interview Scheduled'],
    actions: ['Prep Guide', 'Practice Questions', 'Logistics Info'],
    successRate: 89
  },
  {
    id: 'conversion-boost',
    name: 'Conversion Boost',
    description: 'Final push for high-potential leads',
    category: 'Conversion',
    triggers: ['High Score + Inactive', 'Interview Completed'],
    actions: ['Personal Call', 'Scholarship Info', 'Peer Testimonials'],
    successRate: 73
  }
];

const TRIGGER_TYPES = [
  'New Inquiry',
  'Application Started',
  'Application Submitted',
  'Documents Missing',
  'Interview Scheduled',
  'No Activity 7 Days',
  'Deadline Approaching',
  'High Score + Inactive'
];

export function PlaybookAccessStep({ data, updateData }: PlaybookAccessStepProps) {
  const [selectedPlay, setSelectedPlay] = useState('');

  const addPlay = (playId: string) => {
    if (playId && !data.availablePlays.includes(playId)) {
      updateData({ availablePlays: [...data.availablePlays, playId] });
    }
  };

  const removePlay = (playId: string) => {
    updateData({ 
      availablePlays: data.availablePlays.filter(p => p !== playId),
      defaultPlaysByTrigger: Object.fromEntries(
        Object.entries(data.defaultPlaysByTrigger).filter(([, value]) => value !== playId)
      )
    });
  };

  const setDefaultPlay = (trigger: string, playId: string) => {
    updateData({
      defaultPlaysByTrigger: {
        ...data.defaultPlaysByTrigger,
        [trigger]: playId
      }
    });
  };

  const setFallbackPlay = (playId: string) => {
    updateData({ fallbackPlay: playId });
  };

  const selectedPlaysData = MOCK_PLAYS.filter(p => data.availablePlays.includes(p.id));
  const availableForSelection = MOCK_PLAYS.filter(p => !data.availablePlays.includes(p.id));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">Playbook Access</h3>
        <p className="text-muted-foreground">
          Choose which pre-built action sequences (plays) this agent can execute
        </p>
      </div>

      {/* Available Plays Library */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Available Plays Library
          </CardTitle>
          <CardDescription>Add plays to your agent's toolkit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={selectedPlay} onValueChange={setSelectedPlay}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a play to add..." />
              </SelectTrigger>
              <SelectContent>
                {availableForSelection.map(play => (
                  <SelectItem key={play.id} value={play.id}>
                    {play.name} ({play.successRate}% success rate)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => { addPlay(selectedPlay); setSelectedPlay(''); }} disabled={!selectedPlay}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Selected Plays */}
          <div className="space-y-3">
            {selectedPlaysData.map(play => (
              <div key={play.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{play.name}</h4>
                      <Badge variant="outline">{play.category}</Badge>
                      <Badge variant="secondary">{play.successRate}% success</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removePlay(play.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{play.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Triggers</p>
                        <div className="flex flex-wrap gap-1">
                          {play.triggers.map(trigger => (
                            <Badge key={trigger} variant="outline" className="text-xs">{trigger}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Actions</p>
                        <div className="flex flex-wrap gap-1">
                          {play.actions.map(action => (
                            <Badge key={action} variant="outline" className="text-xs">{action}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedPlaysData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No plays selected</p>
              <p className="text-sm">Add plays to enable automated actions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Default Plays by Trigger */}
      {selectedPlaysData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Default Plays by Trigger
            </CardTitle>
            <CardDescription>Set which play to use by default for each trigger type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {TRIGGER_TYPES.map(trigger => (
              <div key={trigger} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{trigger}</p>
                  <p className="text-xs text-muted-foreground">When this trigger occurs</p>
                </div>
                <Select 
                  value={data.defaultPlaysByTrigger[trigger] || ''} 
                  onValueChange={(value) => setDefaultPlay(trigger, value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select default play..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No default play</SelectItem>
                    {selectedPlaysData.map(play => (
                      <SelectItem key={play.id} value={play.id}>{play.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Fallback Play */}
      {selectedPlaysData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Fallback Play
            </CardTitle>
            <CardDescription>Choose a play to use when no specific play matches the situation</CardDescription>
          </CardHeader>
          <CardContent>
            <Select 
              value={data.fallbackPlay || ''} 
              onValueChange={setFallbackPlay}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fallback play..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No fallback play</SelectItem>
                {selectedPlaysData.map(play => (
                  <SelectItem key={play.id} value={play.id}>{play.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Playbook Summary */}
      {selectedPlaysData.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Playbook Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Available Plays</p>
                <p className="text-2xl font-bold">{selectedPlaysData.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Configured Triggers</p>
                <p className="text-2xl font-bold">{Object.keys(data.defaultPlaysByTrigger).length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(selectedPlaysData.reduce((sum, p) => sum + p.successRate, 0) / selectedPlaysData.length)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fallback Set</p>
                <p className="text-2xl font-bold">{data.fallbackPlay ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Play Categories</p>
              <div className="flex flex-wrap gap-2">
                {[...new Set(selectedPlaysData.map(p => p.category))].map(category => (
                  <Badge key={category} variant="outline">{category}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}