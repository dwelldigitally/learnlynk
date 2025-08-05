import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Play, Pause, Download, Zap, User, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TranscriptEntry {
  id: string;
  timestamp: string;
  speaker: 'user' | 'lead' | 'ai';
  content: string;
  confidence?: number;
}

interface AITranscriptionPanelProps {
  leadId: string;
  onTranscriptUpdate?: (transcript: TranscriptEntry[]) => void;
}

export function AITranscriptionPanel({ leadId, onTranscriptUpdate }: AITranscriptionPanelProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([
    {
      id: '1',
      timestamp: '00:02',
      speaker: 'user',
      content: 'Hi John, thanks for taking the time to speak with me today. I wanted to follow up on your interest in our MBA program.',
      confidence: 0.95
    },
    {
      id: '2',
      timestamp: '00:15',
      speaker: 'lead',
      content: 'Of course! I\'ve been really excited about the program since I saw the curriculum. The focus on technology and innovation really caught my attention.',
      confidence: 0.92
    },
    {
      id: '3',
      timestamp: '00:28',
      speaker: 'ai',
      content: '[AI Analysis] Lead shows high engagement. Keywords detected: "excited", "technology", "innovation". Recommended follow-up: Discuss tech specialization tracks.',
      confidence: 0.88
    }
  ]);
  const [currentNote, setCurrentNote] = useState('');
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      setIsRecording(true);
      // Simulate recording start
      toast({
        title: "Recording Started",
        description: "AI transcription is now active",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Failed to start recording",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Processing Complete",
        description: "Transcript has been analyzed and insights generated",
      });
    }, 2000);
  };

  const addManualNote = () => {
    if (!currentNote.trim()) return;
    
    const newEntry: TranscriptEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-US', { minute: '2-digit', second: '2-digit' }),
      speaker: 'user',
      content: currentNote,
      confidence: 1.0
    };
    
    setTranscript(prev => [...prev, newEntry]);
    setCurrentNote('');
    onTranscriptUpdate?.([...transcript, newEntry]);
  };

  const exportTranscript = () => {
    const content = transcript.map(entry => 
      `[${entry.timestamp}] ${entry.speaker.toUpperCase()}: ${entry.content}`
    ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${leadId}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSpeakerIcon = (speaker: string) => {
    switch (speaker) {
      case 'user': return <User className="h-4 w-4 text-blue-500" />;
      case 'lead': return <User className="h-4 w-4 text-green-500" />;
      case 'ai': return <Bot className="h-4 w-4 text-purple-500" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getSpeakerColor = (speaker: string) => {
    switch (speaker) {
      case 'user': return 'border-blue-200 bg-blue-50';
      case 'lead': return 'border-green-200 bg-green-50';
      case 'ai': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-primary" />
            AI Transcription
            <Badge variant="secondary" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {isRecording && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            <Button size="sm" variant="outline" onClick={exportTranscript}>
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isRecording ? "destructive" : "default"}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
          >
            {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          {isProcessing && (
            <Badge variant="secondary" className="animate-pulse">
              Processing...
            </Badge>
          )}
        </div>

        <ScrollArea className="h-64 border rounded-lg p-3">
          <div className="space-y-3">
            {transcript.map((entry) => (
              <div key={entry.id} className={`border rounded-lg p-3 ${getSpeakerColor(entry.speaker)}`}>
                <div className="flex items-start gap-2">
                  {getSpeakerIcon(entry.speaker)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium capitalize">{entry.speaker}</span>
                      <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                      {entry.confidence && (
                        <Badge variant="outline" className="text-xs">
                          {(entry.confidence * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${entry.speaker === 'ai' ? 'italic' : ''}`}>
                      {entry.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="space-y-2">
          <Textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Add manual notes or observations..."
            rows={2}
          />
          <Button size="sm" onClick={addManualNote} disabled={!currentNote.trim()}>
            Add Note
          </Button>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs font-medium mb-1">AI Features Active:</p>
          <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
            <span>• Speaker identification</span>
            <span>• Sentiment analysis</span>
            <span>• Keyword extraction</span>
            <span>• Action item detection</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}