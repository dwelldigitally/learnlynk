import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bot, 
  User, 
  FileCheck, 
  Shield, 
  Zap, 
  Info,
  Check
} from "lucide-react";
import { RegistrarAIAgentData } from "../RegistrarAIAgentWizard";

interface RegistrarAgentIdentityStepProps {
  data: RegistrarAIAgentData;
  updateData: (updates: Partial<RegistrarAIAgentData>) => void;
}

const PERSONALITY_OPTIONS = [
  {
    value: 'detail-oriented',
    label: 'Detail-Oriented',
    description: 'Meticulous document review and thorough application processing',
    icon: FileCheck,
    color: 'text-blue-600'
  },
  {
    value: 'student-focused',
    label: 'Student-Focused',
    description: 'Prioritizes student experience and clear communication',
    icon: User,
    color: 'text-green-600'
  },
  {
    value: 'compliance-focused',
    label: 'Compliance-Focused',
    description: 'Strict adherence to policies and regulatory requirements',
    icon: Shield,
    color: 'text-purple-600'
  },
  {
    value: 'efficient',
    label: 'Efficient',
    description: 'Fast processing while maintaining accuracy standards',
    icon: Zap,
    color: 'text-orange-600'
  }
];

const PROCESSING_STYLES = [
  {
    value: 'thorough',
    label: 'Thorough Review',
    description: 'Comprehensive analysis of all application components'
  },
  {
    value: 'efficient',
    label: 'Efficient Processing',
    description: 'Streamlined processing with focus on key requirements'
  },
  {
    value: 'strict',
    label: 'Strict Compliance',
    description: 'Rigorous adherence to all policies and procedures'
  }
];

const COMMUNICATION_TONES = [
  {
    value: 'formal',
    label: 'Formal',
    description: 'Professional, official communication style'
  },
  {
    value: 'professional',
    label: 'Professional',
    description: 'Business-appropriate with personal touch'
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm, approachable communication'
  }
];

const AVATAR_PRESETS = [
  { id: 'registrar-1', name: 'Dr. Regina Sterling', initials: 'RS', color: 'bg-blue-500' },
  { id: 'registrar-2', name: 'Prof. Marcus Chen', initials: 'MC', color: 'bg-green-500' },
  { id: 'registrar-3', name: 'Dr. Sarah Williams', initials: 'SW', color: 'bg-purple-500' },
  { id: 'registrar-4', name: 'Dr. James Rodriguez', initials: 'JR', color: 'bg-orange-500' },
  { id: 'registrar-5', name: 'Prof. Emily Thompson', initials: 'ET', color: 'bg-pink-500' },
  { id: 'registrar-6', name: 'Dr. Michael Davis', initials: 'MD', color: 'bg-indigo-500' }
];

export function RegistrarAgentIdentityStep({ data, updateData }: RegistrarAgentIdentityStepProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(data.avatar || AVATAR_PRESETS[0].id);

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    updateData({ avatar: avatarId });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Define your registrar AI agent's basic identity and purpose
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agentName">Agent Name</Label>
              <Input
                id="agentName"
                placeholder="e.g., Dr. Regina Sterling"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="agentDescription">Description</Label>
              <Input
                id="agentDescription"
                placeholder="Brief description of the agent's role"
                value={data.description}
                onChange={(e) => updateData({ description: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Avatar</CardTitle>
          <CardDescription>
            Select a visual representation for your registrar agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {AVATAR_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedAvatar === preset.id 
                    ? 'ring-2 ring-primary ring-offset-2' 
                    : 'hover:scale-105'
                }`}
                onClick={() => handleAvatarSelect(preset.id)}
              >
                <div className="text-center space-y-2">
                  <Avatar className={`h-16 w-16 mx-auto ${preset.color}`}>
                    <AvatarFallback className="text-white font-semibold">
                      {preset.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs font-medium">{preset.name}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personality Type */}
      <Card>
        <CardHeader>
          <CardTitle>Personality Type</CardTitle>
          <CardDescription>
            Choose the personality that best fits your registrar operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERSONALITY_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.value}
                  className={`cursor-pointer p-4 border rounded-lg transition-all duration-200 ${
                    data.personality === option.value
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  onClick={() => updateData({ personality: option.value as any })}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${option.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{option.label}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </p>
                    </div>
                    {data.personality === option.value && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Processing Style */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Style</CardTitle>
          <CardDescription>
            How should your agent approach application processing?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROCESSING_STYLES.map((style) => (
              <div
                key={style.value}
                className={`cursor-pointer p-4 border rounded-lg transition-all duration-200 ${
                  data.processing_style === style.value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
                onClick={() => updateData({ processing_style: style.value as any })}
              >
                <div className="text-center space-y-2">
                  <h4 className="font-semibold">{style.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {style.description}
                  </p>
                  {data.processing_style === style.value && (
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communication Tone */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Tone</CardTitle>
          <CardDescription>
            How should your agent communicate with students and staff?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMMUNICATION_TONES.map((tone) => (
              <div
                key={tone.value}
                className={`cursor-pointer p-4 border rounded-lg transition-all duration-200 ${
                  data.communication_tone === tone.value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
                onClick={() => updateData({ communication_tone: tone.value as any })}
              >
                <div className="text-center space-y-2">
                  <h4 className="font-semibold">{tone.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {tone.description}
                  </p>
                  {data.communication_tone === tone.value && (
                    <Check className="h-5 w-5 text-primary mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <Avatar className={`h-12 w-12 ${AVATAR_PRESETS.find(p => p.id === selectedAvatar)?.color || 'bg-primary'}`}>
              <AvatarFallback className="text-white font-semibold">
                {AVATAR_PRESETS.find(p => p.id === selectedAvatar)?.initials || 'RA'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-lg">{data.name || 'Registrar Agent'}</h4>
              <p className="text-muted-foreground">{data.description || 'AI-powered registrar assistant'}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">
                  {PERSONALITY_OPTIONS.find(p => p.value === data.personality)?.label || 'Detail-Oriented'}
                </Badge>
                <Badge variant="outline">
                  {PROCESSING_STYLES.find(s => s.value === data.processing_style)?.label || 'Thorough Review'}
                </Badge>
                <Badge variant="outline">
                  {COMMUNICATION_TONES.find(t => t.value === data.communication_tone)?.label || 'Professional'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}