import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, Users, MessageSquare, TrendingUp, Sparkles } from "lucide-react";
import { JourneyAIAgentData } from "../JourneyBasedAIAgentWizard";

interface AgentPurposeStepProps {
  data: JourneyAIAgentData;
  updateData: (updates: Partial<JourneyAIAgentData>) => void;
}

const AGENT_PURPOSES = [
  {
    id: 'applicant_nurture',
    name: 'Applicant Nurturing',
    description: 'Guide and support potential students through the application process',
    icon: Users,
    examples: ['Send application reminders', 'Answer FAQ questions', 'Provide program information']
  },
  {
    id: 'incomplete_docs',
    name: 'Document Recovery',
    description: 'Help students complete missing documentation requirements',
    icon: MessageSquare,
    examples: ['Document deadline reminders', 'Upload assistance', 'Requirement clarification']
  },
  {
    id: 'interview_followup',
    name: 'Interview Follow-up',
    description: 'Nurture leads post-interview to drive conversion decisions',
    icon: TrendingUp,
    examples: ['Thank you messages', 'Next steps clarification', 'Decision timeline updates']
  },
  {
    id: 'high_yield_conversion',
    name: 'High-Yield Conversion',
    description: 'Re-engage high-potential students at critical drop-off points',
    icon: Target,
    examples: ['Deadline reminders', 'Value proposition reinforcement', 'Objection handling']
  },
  {
    id: 'custom',
    name: 'Custom Purpose',
    description: 'Define a custom purpose for specific institutional needs',
    icon: Sparkles,
    examples: ['Custom workflows', 'Specialized communications', 'Unique use cases']
  }
];

export function AgentPurposeStep({ data, updateData }: AgentPurposeStepProps) {
  const selectedPurpose = AGENT_PURPOSES.find(p => p.id === data.purpose);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">Define Your AI Agent's Purpose</h3>
        <p className="text-muted-foreground">
          Start by choosing what this AI agent will do and naming it appropriately
        </p>
      </div>

      {/* Agent Name and Description */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Give your agent a name and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agentName">Agent Name *</Label>
            <Input
              id="agentName"
              placeholder="e.g., Yield Booster – UG Science Funnel"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agentDescription">Description *</Label>
            <Textarea
              id="agentDescription"
              placeholder="e.g., Re-engage students at drop-off stage to increase conversion rates"
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Purpose Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Purpose</CardTitle>
          <CardDescription>Choose the primary function of this AI agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AGENT_PURPOSES.map((purpose) => {
              const Icon = purpose.icon;
              const isSelected = data.purpose === purpose.id;
              
              return (
                <div
                  key={purpose.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => updateData({ purpose: purpose.id as any })}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-gray-100'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{purpose.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{purpose.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {purpose.examples.map((example, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom Purpose Details */}
      {data.purpose === 'custom' && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Purpose Details</CardTitle>
            <CardDescription>Describe your custom agent purpose</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="customPurpose">Custom Purpose Description</Label>
              <Textarea
                id="customPurpose"
                placeholder="Describe the specific purpose and goals for this custom agent..."
                value={data.customPurpose || ''}
                onChange={(e) => updateData({ customPurpose: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {data.name && data.description && selectedPurpose && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Agent Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{data.name}</h4>
                <Badge variant="secondary">{selectedPurpose.name}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{data.description}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}