import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Phone, Smartphone } from "lucide-react";
import { AIAgentWizardData } from "@/types/ai-agent";

interface ChannelsStepProps {
  data: AIAgentWizardData;
  updateData: (updates: Partial<AIAgentWizardData>) => void;
}

const CHANNELS = [
  {
    key: 'email' as const,
    label: 'Email',
    icon: Mail,
    description: 'Send automated emails to students',
    features: ['Rich HTML content', 'Attachments', 'Templates', 'Scheduling'],
    availability: 'Available',
    recommended: true
  },
  {
    key: 'sms' as const,
    label: 'SMS',
    icon: Smartphone,
    description: 'Send text messages for urgent communications',
    features: ['Instant delivery', 'High open rates', 'Character limits', 'Opt-in required'],
    availability: 'Available',
    recommended: true
  },
  {
    key: 'whatsapp' as const,
    label: 'WhatsApp',
    icon: MessageSquare,
    description: 'Connect through WhatsApp Business API',
    features: ['Rich media', 'International reach', 'Read receipts', 'Business verification'],
    availability: 'Coming Soon',
    recommended: false
  },
  {
    key: 'phone' as const,
    label: 'Phone Calls',
    icon: Phone,
    description: 'AI-powered voice conversations',
    features: ['Natural speech', 'Real-time responses', 'Call recording', 'Sentiment analysis'],
    availability: 'Future Release',
    recommended: false
  }
];

export function ChannelsStep({ data, updateData }: ChannelsStepProps) {
  const updateChannel = (channel: 'email' | 'sms' | 'whatsapp' | 'phone', enabled: boolean) => {
    updateData({
      allowedChannels: {
        ...data.allowedChannels,
        [channel]: enabled
      }
    });
  };

  const enabledChannels = Object.entries(data.allowedChannels).filter(([_, enabled]) => enabled);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication Channels</CardTitle>
          <CardDescription>
            Select which channels your agent can use to communicate with students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {CHANNELS.map((channel) => {
            const Icon = channel.icon;
            const isEnabled = data.allowedChannels[channel.key];
            const isAvailable = channel.availability === 'Available';
            
            return (
              <div
                key={channel.key}
                className={`p-4 border rounded-lg ${!isAvailable ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Icon className="h-6 w-6 mt-1 text-primary" />
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-medium">{channel.label}</Label>
                        {channel.recommended && (
                          <Badge variant="secondary" className="text-xs">Recommended</Badge>
                        )}
                        <Badge 
                          variant={isAvailable ? "default" : "outline"}
                          className="text-xs"
                        >
                          {channel.availability}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {channel.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {channel.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => updateChannel(channel.key, checked)}
                    disabled={!isAvailable}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {enabledChannels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Channel Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">
                  Enabled Channels ({enabledChannels.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {enabledChannels.map(([channel, _]) => {
                    const channelConfig = CHANNELS.find(c => c.key === channel);
                    const Icon = channelConfig?.icon;
                    return (
                      <Badge key={channel} variant="secondary" className="flex items-center gap-1">
                        {Icon && <Icon className="h-3 w-3" />}
                        {channelConfig?.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Communication Strategy</p>
                <p className="text-sm text-muted-foreground">
                  Your agent will use these channels based on message urgency, student preferences, 
                  and optimal timing. Email for detailed information, SMS for urgent reminders.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50/50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-sm space-y-2">
            <p className="font-medium text-blue-900">📱 Channel Best Practices:</p>
            <ul className="text-blue-800 space-y-1 ml-4">
              <li>• <strong>Email:</strong> Best for detailed information, documents, formal communications</li>
              <li>• <strong>SMS:</strong> Perfect for reminders, deadlines, quick confirmations</li>
              <li>• <strong>Multi-channel:</strong> Agent will choose optimal channel per situation</li>
              <li>• Students can set preferences for each channel</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}