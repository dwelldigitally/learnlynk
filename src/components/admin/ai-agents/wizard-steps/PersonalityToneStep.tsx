import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Sparkles } from "lucide-react";
import { AIAgentWizardData } from "@/types/ai-agent";

interface PersonalityToneStepProps {
  data: AIAgentWizardData;
  updateData: (updates: Partial<AIAgentWizardData>) => void;
}

const TONE_OPTIONS = [
  {
    value: 'formal',
    label: 'Formal',
    description: 'Professional, respectful, traditional academic tone',
    example: '"Dear Sarah, I wanted to follow up regarding your application status..."'
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm, approachable, conversational but professional',
    example: '"Hi Sarah! Hope you\'re doing well. I wanted to check in about your application..."'
  },
  {
    value: 'supportive',
    label: 'Supportive',
    description: 'Encouraging, empathetic, guidance-focused',
    example: '"Hi Sarah, I know the application process can feel overwhelming, but you\'re doing great..."'
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Define your own personality and communication style',
    example: 'Write your own custom prompts and guidelines...'
  }
];

const MESSAGE_TEMPLATES = [
  {
    key: 'welcome',
    label: 'Welcome Message',
    placeholder: 'First message sent to new inquiries...'
  },
  {
    key: 'follow_up',
    label: 'Follow-up Message',
    placeholder: 'Standard follow-up for inactive leads...'
  },
  {
    key: 'document_request',
    label: 'Document Request',
    placeholder: 'Requesting missing documents...'
  },
  {
    key: 'escalation',
    label: 'Escalation Notice',
    placeholder: 'When transferring to human counselor...'
  }
];

export function PersonalityToneStep({ data, updateData }: PersonalityToneStepProps) {
  const updatePersonality = (updates: Partial<typeof data.personality>) => {
    updateData({
      personality: {
        ...data.personality,
        ...updates
      }
    });
  };

  const updateMessageTemplate = (key: string, value: string) => {
    updatePersonality({
      messageTemplates: {
        ...data.personality.messageTemplates,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Tone
          </CardTitle>
          <CardDescription>
            Choose how your agent communicates with students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={data.personality.tone}
            onValueChange={(value) => updatePersonality({ tone: value as any })}
            className="space-y-6"
          >
            {TONE_OPTIONS.map((option) => (
              <div key={option.value} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="font-medium">
                    {option.label}
                  </Label>
                  <Badge variant="outline">{option.description}</Badge>
                </div>
                <div className="ml-6 p-3 bg-muted/50 rounded-lg text-sm italic">
                  {option.example}
                </div>
              </div>
            ))}
          </RadioGroup>

          {data.personality.tone === 'custom' && (
            <div className="mt-6 space-y-3">
              <Label htmlFor="custom-prompts">Custom Communication Guidelines</Label>
              <Textarea
                id="custom-prompts"
                placeholder="Describe how the agent should communicate. Include tone, style, vocabulary preferences, and any specific instructions..."
                value={data.personality.customPrompts || ''}
                onChange={(e) => updatePersonality({ customPrompts: e.target.value })}
                rows={4}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Message Templates
          </CardTitle>
          <CardDescription>
            Define standard message templates for common scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {MESSAGE_TEMPLATES.map((template) => (
            <div key={template.key} className="space-y-2">
              <Label htmlFor={template.key}>
                {template.label}
                <span className="text-muted-foreground font-normal ml-2">(Optional)</span>
              </Label>
              <Textarea
                id={template.key}
                placeholder={template.placeholder}
                value={data.personality.messageTemplates[template.key] || ''}
                onChange={(e) => updateMessageTemplate(template.key, e.target.value)}
                rows={3}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-purple-50/50 border-purple-200">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-medium text-purple-900">✨ Personalization Tips:</p>
            <ul className="text-purple-800 space-y-1 ml-4">
              <li>• Match your institution's brand voice and values</li>
              <li>• Consider your target student demographics</li>
              <li>• Use merge fields like {'{student_name}'} and {'{program_name}'}</li>
              <li>• Test different tones with small groups first</li>
              <li>• Templates can be overridden for specific situations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}