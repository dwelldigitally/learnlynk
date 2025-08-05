import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Calendar, Copy, ExternalLink, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIVideoIntegrationProps {
  leadId: string;
  onMeetingScheduled?: (meetingData: any) => void;
}

interface VideoPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  features: string[];
}

const videoPlatforms: VideoPlatform[] = [
  {
    id: 'zoom',
    name: 'Zoom',
    icon: '🎥',
    color: 'bg-blue-500',
    features: ['Auto Recording', 'AI Transcription', 'Breakout Rooms']
  },
  {
    id: 'gmeet',
    name: 'Google Meet',
    icon: '📹',
    color: 'bg-green-500',
    features: ['Live Captions', 'Screen Share', 'Calendar Integration']
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    icon: '💼',
    color: 'bg-purple-500',
    features: ['AI Meeting Notes', 'File Sharing', 'Whiteboard']
  }
];

export function AIVideoIntegration({ leadId, onMeetingScheduled }: AIVideoIntegrationProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingDuration, setMeetingDuration] = useState('30');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const generateMeetingLink = (platform: string) => {
    const baseUrls = {
      zoom: 'https://zoom.us/j/',
      gmeet: 'https://meet.google.com/',
      teams: 'https://teams.microsoft.com/l/meetup-join/'
    };
    
    const meetingId = Math.random().toString(36).substr(2, 10);
    return `${baseUrls[platform as keyof typeof baseUrls]}${meetingId}`;
  };

  const handleScheduleMeeting = () => {
    if (!selectedPlatform || !meetingTitle || !meetingDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const meetingLink = generateMeetingLink(selectedPlatform);
    const platform = videoPlatforms.find(p => p.id === selectedPlatform);
    
    const meetingData = {
      title: meetingTitle,
      platform: platform?.name,
      link: meetingLink,
      date: meetingDate,
      duration: parseInt(meetingDuration),
      leadId
    };

    onMeetingScheduled?.(meetingData);
    
    toast({
      title: "Meeting Scheduled",
      description: `${platform?.name} meeting created successfully`,
    });

    setDialogOpen(false);
    setMeetingTitle('');
    setMeetingDate('');
    setSelectedPlatform('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Meeting link copied to clipboard",
    });
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Video className="h-4 w-4 text-primary" />
          AI Video Integration
          <Badge variant="secondary" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Smart
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {videoPlatforms.map((platform) => (
            <div key={platform.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center text-white text-lg`}>
                    {platform.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{platform.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {platform.features.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule AI-Enhanced Meeting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule AI-Enhanced Video Meeting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoPlatforms.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        {platform.icon} {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Meeting Title</Label>
                <Input
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Lead qualification call"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={meetingDate}
                    onChange={(e) => setMeetingDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Duration (minutes)</Label>
                  <Select value={meetingDuration} onValueChange={setMeetingDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 min</SelectItem>
                      <SelectItem value="30">30 min</SelectItem>
                      <SelectItem value="45">45 min</SelectItem>
                      <SelectItem value="60">60 min</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium mb-2">AI Features Included:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Real-time transcription and recording</li>
                  <li>• Automatic meeting summaries</li>
                  <li>• Action item extraction</li>
                  <li>• Follow-up recommendations</li>
                </ul>
              </div>

              <Button onClick={handleScheduleMeeting} className="w-full">
                Create AI-Enhanced Meeting
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}