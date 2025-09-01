import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Target, Zap } from "lucide-react";
import { AIAgentWizardData } from "@/types/ai-agent";

interface AgentPurposeStepProps {
  data: AIAgentWizardData;
  updateData: (updates: Partial<AIAgentWizardData>) => void;
}

const FUNCTIONAL_BOUNDARIES = [
  'Lead Prioritization',
  'Email Communication',
  'SMS Communication',
  'Journey Management',
  'Document Processing',
  'Event Scheduling',
  'Follow-up Automation',
  'Escalation Management',
  'Compliance Monitoring',
  'Performance Analytics'
];

const SCOPE_EXAMPLES = [
  'Domestic Undergraduate Funnel Assistant',
  'International Graduate Recruiter',
  'Transfer Student Specialist',
  'Yield Protection Agent',
  'Document Collection Assistant',
  'Interview Coordination Agent'
];

export function AgentPurposeStep({ data, updateData }: AgentPurposeStepProps) {
  const handleBoundaryChange = (boundary: string, checked: boolean) => {
    const updatedBoundaries = checked
      ? [...data.functionalBoundaries, boundary]
      : data.functionalBoundaries.filter(b => b !== boundary);
    
    updateData({ functionalBoundaries: updatedBoundaries });
  };

  const setScopeExample = (example: string) => {
    updateData({ scope: example });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Agent Identity
          </CardTitle>
          <CardDescription>
            Define what this AI agent will be responsible for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agent-name">Agent Name *</Label>
            <Input
              id="agent-name"
              placeholder="e.g., Domestic Undergrad Funnel Assistant"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-description">Description</Label>
            <Textarea
              id="agent-description"
              placeholder="Describe what this agent does and its goals..."
              value={data.description}
              onChange={(e) => updateData({ description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="agent-scope">Scope & Focus Area *</Label>
            <Input
              id="agent-scope"
              placeholder="Define the agent's primary focus area..."
              value={data.scope}
              onChange={(e) => updateData({ scope: e.target.value })}
            />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Quick examples:</p>
              <div className="flex flex-wrap gap-2">
                {SCOPE_EXAMPLES.map((example) => (
                  <Badge
                    key={example}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => setScopeExample(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Functional Boundaries
          </CardTitle>
          <CardDescription>
            Select which capabilities this agent should have
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FUNCTIONAL_BOUNDARIES.map((boundary) => (
              <div key={boundary} className="flex items-center space-x-2">
                <Checkbox
                  id={boundary}
                  checked={data.functionalBoundaries.includes(boundary)}
                  onCheckedChange={(checked) => 
                    handleBoundaryChange(boundary, checked as boolean)
                  }
                />
                <Label htmlFor={boundary} className="text-sm font-normal">
                  {boundary}
                </Label>
              </div>
            ))}
          </div>
          
          {data.functionalBoundaries.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Selected Capabilities:</p>
              <div className="flex flex-wrap gap-1">
                {data.functionalBoundaries.map((boundary) => (
                  <Badge key={boundary} variant="secondary" className="text-xs">
                    {boundary}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50/50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-medium text-blue-900">💡 Agent Design Tips:</p>
            <ul className="text-blue-800 space-y-1 ml-4">
              <li>• Start with a focused scope - you can expand later</li>
              <li>• Choose 3-5 core capabilities for best performance</li>
              <li>• Consider your team's current pain points</li>
              <li>• Name it based on student type or funnel stage</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}