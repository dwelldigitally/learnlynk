import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MessageSquare, Calendar, Send, RefreshCw, Zap, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FollowUpSuggestion {
  type: 'email' | 'task' | 'meeting';
  priority: 'high' | 'medium' | 'low';
  title: string;
  content: string;
  timing: string;
  reasoning: string;
}

interface AIFollowUpGeneratorProps {
  leadId: string;
  meetingContext?: string;
  onActionCreated?: (action: any) => void;
}

export function AIFollowUpGenerator({ leadId, meetingContext, onActionCreated }: AIFollowUpGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [customPrompt, setCustomPrompt] = useState('');
  const { toast } = useToast();

  const [suggestions] = useState<FollowUpSuggestion[]>([
    {
      type: 'email',
      priority: 'high',
      title: 'Technical Demo Follow-up',
      content: `Hi John,

Thank you for our productive conversation today. I was excited to hear about your team's focus on improving system integration and scalability.

Based on our discussion, I'd like to schedule a technical demonstration that specifically addresses:
• Integration capabilities with your current tech stack
• Scalability solutions for your projected growth
• ROI projections based on your current challenges

Would next Tuesday at 2 PM work for a 45-minute technical deep-dive?

Best regards,
[Your Name]`,
      timing: 'Send within 24 hours',
      reasoning: 'Lead specifically requested technical demo and showed high interest in integration capabilities.'
    },
    {
      type: 'task',
      priority: 'high',
      title: 'Prepare ROI Calculator',
      content: 'Create customized ROI calculator based on lead\'s mentioned pain points: current system inefficiencies, team productivity concerns, and scaling challenges. Include specific metrics discussed in the meeting.',
      timing: 'Complete by tomorrow',
      reasoning: 'Lead mentioned budget authority and asked about implementation costs.'
    },
    {
      type: 'meeting',
      priority: 'medium',
      title: 'Technical Team Introduction',
      content: 'Schedule meeting with lead\'s technical team to discuss integration requirements and implementation timeline. Include solution architect and customer success manager.',
      timing: 'Schedule for next week',
      reasoning: 'Lead expressed need to involve technical stakeholders in evaluation process.'
    }
  ]);

  const [editingSuggestion, setEditingSuggestion] = useState<FollowUpSuggestion | null>(null);

  const generateNewSuggestions = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "New Suggestions Generated",
        description: "AI has created updated follow-up recommendations",
      });
    }, 2000);
  };

  const applySuggestion = (suggestion: FollowUpSuggestion) => {
    onActionCreated?.(suggestion);
    toast({
      title: "Action Created",
      description: `${suggestion.type === 'email' ? 'Email draft' : suggestion.type} created successfully`,
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'task': return <MessageSquare className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            AI Follow-up Generator
            <Badge variant="secondary" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Smart
            </Badge>
          </div>
          <Button size="sm" variant="outline" onClick={generateNewSuggestions} disabled={isGenerating}>
            <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="suggestions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
            <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suggestions" className="space-y-3 mt-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(suggestion.type)}
                    <span className="font-medium text-sm">{suggestion.title}</span>
                    <Badge variant={getPriorityColor(suggestion.priority)} className="text-xs">
                      {suggestion.priority}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(suggestion.content)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="bg-muted/50 p-2 rounded text-xs">
                  <p className="text-muted-foreground mb-1"><strong>Timing:</strong> {suggestion.timing}</p>
                  <p className="text-muted-foreground"><strong>Why:</strong> {suggestion.reasoning}</p>
                </div>
                
                {suggestion.type === 'email' && (
                  <div className="bg-background border rounded p-2">
                    <pre className="text-xs whitespace-pre-wrap font-mono">{suggestion.content}</pre>
                  </div>
                )}
                
                {suggestion.type !== 'email' && (
                  <p className="text-sm text-muted-foreground">{suggestion.content}</p>
                )}
                
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => applySuggestion(suggestion)}>
                    <Send className="h-3 w-3 mr-1" />
                    Apply
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingSuggestion(suggestion)}>
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tone</label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="consultative">Consultative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Custom Instructions</label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter specific instructions for AI to generate follow-up actions..."
                rows={3}
              />
            </div>
            
            <Button onClick={generateNewSuggestions} disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Custom Follow-ups
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}