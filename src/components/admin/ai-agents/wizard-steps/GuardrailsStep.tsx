import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Plus, X } from "lucide-react";
import { AIAgentWizardData } from "@/types/ai-agent";
import { useState } from "react";

interface GuardrailsStepProps {
  data: AIAgentWizardData;
  updateData: (updates: Partial<AIAgentWizardData>) => void;
}

const PREDEFINED_TOPICS = [
  'Financial Aid Advice',
  'Immigration Law',
  'Medical Diagnosis',
  'Legal Advice',
  'Personal Counseling',
  'Mental Health Support',
  'Visa Guidance',
  'Housing Recommendations',
  'Employment Authorization'
];

const STUDENT_GROUPS = [
  'Medical Programs',
  'Law Programs', 
  'Graduate Research',
  'Under 18 Students',
  'International Students',
  'Transfer Students',
  'Military Veterans',
  'Students with Disabilities'
];

const COMPLIANCE_RULES = [
  { id: 'FERPA', name: 'FERPA', description: 'Family Educational Rights and Privacy Act' },
  { id: 'PIPEDA', name: 'PIPEDA', description: 'Personal Information Protection and Electronic Documents Act' },
  { id: 'GDPR', name: 'GDPR', description: 'General Data Protection Regulation' },
  { id: 'CCPA', name: 'CCPA', description: 'California Consumer Privacy Act' },
  { id: 'COPPA', name: 'COPPA', description: 'Children\'s Online Privacy Protection Act' }
];

export function GuardrailsStep({ data, updateData }: GuardrailsStepProps) {
  const [newTopic, setNewTopic] = useState('');
  const [newGroup, setNewGroup] = useState('');

  const updateGuardrails = (updates: Partial<typeof data.guardrails>) => {
    updateData({
      guardrails: {
        ...data.guardrails,
        ...updates
      }
    });
  };

  const addForbiddenTopic = (topic: string) => {
    if (topic && !data.guardrails.forbiddenTopics.includes(topic)) {
      updateGuardrails({
        forbiddenTopics: [...data.guardrails.forbiddenTopics, topic]
      });
    }
  };

  const removeForbiddenTopic = (topic: string) => {
    updateGuardrails({
      forbiddenTopics: data.guardrails.forbiddenTopics.filter(t => t !== topic)
    });
  };

  const addExcludedGroup = (group: string) => {
    if (group && !data.guardrails.excludedStudentGroups.includes(group)) {
      updateGuardrails({
        excludedStudentGroups: [...data.guardrails.excludedStudentGroups, group]
      });
    }
  };

  const removeExcludedGroup = (group: string) => {
    updateGuardrails({
      excludedStudentGroups: data.guardrails.excludedStudentGroups.filter(g => g !== group)
    });
  };

  const toggleComplianceRule = (ruleId: string, checked: boolean) => {
    const updatedRules = checked
      ? [...data.guardrails.complianceRules, ruleId]
      : data.guardrails.complianceRules.filter(r => r !== ruleId);
    
    updateGuardrails({ complianceRules: updatedRules });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safety Guardrails
          </CardTitle>
          <CardDescription>
            Set boundaries to ensure safe and compliant agent behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="max-messages">Maximum Messages Per Day</Label>
            <Input
              id="max-messages"
              type="number"
              min="1"
              max="50"
              value={data.guardrails.maxMessagesPerDay}
              onChange={(e) => updateGuardrails({ maxMessagesPerDay: parseInt(e.target.value) || 1 })}
            />
            <p className="text-sm text-muted-foreground">
              Prevent message fatigue by limiting daily communications per student
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Forbidden Topics
          </CardTitle>
          <CardDescription>
            Topics the agent should never provide advice on
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Quick Add Predefined Topics</Label>
            <div className="flex flex-wrap gap-2">
              {PREDEFINED_TOPICS.filter(topic => !data.guardrails.forbiddenTopics.includes(topic)).map((topic) => (
                <Button
                  key={topic}
                  variant="outline"
                  size="sm"
                  onClick={() => addForbiddenTopic(topic)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {topic}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Add Custom Topic</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter forbidden topic..."
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addForbiddenTopic(newTopic);
                    setNewTopic('');
                  }
                }}
              />
              <Button
                onClick={() => {
                  addForbiddenTopic(newTopic);
                  setNewTopic('');
                }}
                disabled={!newTopic}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {data.guardrails.forbiddenTopics.length > 0 && (
            <div className="space-y-2">
              <Label>Current Forbidden Topics</Label>
              <div className="flex flex-wrap gap-2">
                {data.guardrails.forbiddenTopics.map((topic) => (
                  <Badge key={topic} variant="destructive" className="flex items-center gap-1">
                    {topic}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeForbiddenTopic(topic)}
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Excluded Student Groups</CardTitle>
          <CardDescription>
            Student groups that require human-only interaction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Quick Add Predefined Groups</Label>
            <div className="flex flex-wrap gap-2">
              {STUDENT_GROUPS.filter(group => !data.guardrails.excludedStudentGroups.includes(group)).map((group) => (
                <Button
                  key={group}
                  variant="outline"
                  size="sm"
                  onClick={() => addExcludedGroup(group)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {group}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Add Custom Group</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter student group..."
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addExcludedGroup(newGroup);
                    setNewGroup('');
                  }
                }}
              />
              <Button
                onClick={() => {
                  addExcludedGroup(newGroup);
                  setNewGroup('');
                }}
                disabled={!newGroup}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {data.guardrails.excludedStudentGroups.length > 0 && (
            <div className="space-y-2">
              <Label>Current Excluded Groups</Label>
              <div className="flex flex-wrap gap-2">
                {data.guardrails.excludedStudentGroups.map((group) => (
                  <Badge key={group} variant="secondary" className="flex items-center gap-1">
                    {group}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExcludedGroup(group)}
                      className="h-auto p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Rules</CardTitle>
          <CardDescription>
            Legal and regulatory requirements the agent must follow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {COMPLIANCE_RULES.map((rule) => (
              <div key={rule.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={rule.id}
                  checked={data.guardrails.complianceRules.includes(rule.id)}
                  onCheckedChange={(checked) => toggleComplianceRule(rule.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={rule.id} className="font-medium cursor-pointer">
                    {rule.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-50/50 border-red-200">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-medium text-red-900">🛡️ Safety First:</p>
            <ul className="text-red-800 space-y-1 ml-4">
              <li>• Guardrails prevent agent from acting outside safe boundaries</li>
              <li>• All actions are logged and can be audited</li>
              <li>• Human oversight is always available for escalation</li>
              <li>• Compliance rules are automatically enforced</li>
              <li>• You can modify guardrails anytime after deployment</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}