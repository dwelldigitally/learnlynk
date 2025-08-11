import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bot, 
  Upload, 
  Sparkles, 
  Heart, 
  Briefcase, 
  Smile, 
  Zap,
  Info,
  Check
} from "lucide-react";
import { AIAgentData } from "../AIAgentWizard";

interface AgentIdentityStepProps {
  data: AIAgentData;
  updateData: (updates: Partial<AIAgentData>) => void;
}

const PERSONALITY_OPTIONS = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Formal, knowledgeable, and business-focused',
    icon: Briefcase,
    color: 'blue'
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm, approachable, and conversational',
    icon: Smile,
    color: 'green'
  },
  {
    value: 'enthusiastic',
    label: 'Enthusiastic',
    description: 'Energetic, positive, and motivational',
    icon: Zap,
    color: 'orange'
  },
  {
    value: 'empathetic',
    label: 'Empathetic',
    description: 'Understanding, supportive, and caring',
    icon: Heart,
    color: 'pink'
  }
];

const RESPONSE_STYLES = [
  {
    value: 'professional',
    label: 'Professional',
    description: 'Clear, concise, and business-appropriate language'
  },
  {
    value: 'friendly',
    label: 'Friendly',
    description: 'Warm and personable while maintaining professionalism'
  },
  {
    value: 'casual',
    label: 'Casual',
    description: 'Relaxed and conversational tone'
  }
];

const COMMUNICATION_TONES = [
  { value: 'formal', label: 'Formal', description: 'Traditional business communication' },
  { value: 'conversational', label: 'Conversational', description: 'Natural, easy-going dialogue' },
  { value: 'warm', label: 'Warm', description: 'Friendly and welcoming approach' },
  { value: 'direct', label: 'Direct', description: 'Straight-forward and to-the-point' }
];

const AVATAR_PRESETS = [
  { id: 'bot-blue', name: 'Bot Blue', emoji: '🤖', color: 'bg-blue-500' },
  { id: 'assistant', name: 'Assistant', emoji: '👨‍💼', color: 'bg-purple-500' },
  { id: 'advisor', name: 'Advisor', emoji: '👩‍🏫', color: 'bg-green-500' },
  { id: 'specialist', name: 'Specialist', emoji: '🎓', color: 'bg-indigo-500' },
  { id: 'guide', name: 'Guide', emoji: '🗂️', color: 'bg-orange-500' },
  { id: 'mentor', name: 'Mentor', emoji: '⭐', color: 'bg-yellow-500' }
];

export function AgentIdentityStep({ data, updateData }: AgentIdentityStepProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(data.avatar || 'bot-blue');

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    updateData({ avatar: avatarId });
  };

  const selectedPersonality = PERSONALITY_OPTIONS.find(p => p.value === data.personality);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Give Your Agent a Personality</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create a unique identity for your AI agent. This will shape how it communicates with leads and represents your brand.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentName">Agent Name *</Label>
              <Input
                id="agentName"
                placeholder="e.g., Sarah, Alex, MBA Assistant"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Choose a professional, memorable name that reflects your brand
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentDescription">Description *</Label>
              <Textarea
                id="agentDescription"
                placeholder="Describe your agent's role and expertise..."
                value={data.description}
                onChange={(e) => updateData({ description: e.target.value })}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                This description helps leads understand who they're talking to
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Avatar Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Avatar Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                {selectedAvatar && (
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-2xl ${
                    AVATAR_PRESETS.find(a => a.id === selectedAvatar)?.color || 'bg-gray-500'
                  }`}>
                    {AVATAR_PRESETS.find(a => a.id === selectedAvatar)?.emoji || '🤖'}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Choose an avatar that represents your agent
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {AVATAR_PRESETS.map((avatar) => (
                <Button
                  key={avatar.id}
                  variant={selectedAvatar === avatar.id ? "default" : "outline"}
                  className="h-auto p-3 flex flex-col gap-1"
                  onClick={() => handleAvatarSelect(avatar.id)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${avatar.color}`}>
                    {avatar.emoji}
                  </div>
                  <span className="text-xs">{avatar.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personality Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Personality Type
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the personality that best fits your brand and target audience
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PERSONALITY_OPTIONS.map((personality) => {
              const Icon = personality.icon;
              const isSelected = data.personality === personality.value;
              
              return (
                <Button
                  key={personality.value}
                  variant={isSelected ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col gap-3 relative"
                  onClick={() => updateData({ personality: personality.value as any })}
                >
                  {isSelected && (
                    <Check className="absolute top-2 right-2 h-4 w-4" />
                  )}
                  <div className={`p-3 rounded-lg ${
                    isSelected ? 'bg-primary-foreground/20' : 'bg-muted'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{personality.label}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {personality.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Communication Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Style</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {RESPONSE_STYLES.map((style) => (
              <Button
                key={style.value}
                variant={data.response_style === style.value ? "default" : "outline"}
                className="w-full justify-start h-auto p-4"
                onClick={() => updateData({ response_style: style.value as any })}
              >
                <div className="text-left">
                  <div className="font-medium">{style.label}</div>
                  <div className="text-xs opacity-75 mt-1">{style.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication Tone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {COMMUNICATION_TONES.map((tone) => (
              <Button
                key={tone.value}
                variant={data.communication_tone === tone.value ? "default" : "outline"}
                className="w-full justify-start h-auto p-4"
                onClick={() => updateData({ communication_tone: tone.value as any })}
              >
                <div className="text-left">
                  <div className="font-medium">{tone.label}</div>
                  <div className="text-xs opacity-75 mt-1">{tone.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      {data.name && selectedPersonality && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                AVATAR_PRESETS.find(a => a.id === selectedAvatar)?.color || 'bg-gray-500'
              }`}>
                {AVATAR_PRESETS.find(a => a.id === selectedAvatar)?.emoji || '🤖'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{data.name}</span>
                  <Badge variant="secondary">{selectedPersonality.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {data.description || "Description will appear here..."}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {RESPONSE_STYLES.find(s => s.value === data.response_style)?.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {COMMUNICATION_TONES.find(t => t.value === data.communication_tone)?.label}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}