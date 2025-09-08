import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Edit3, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Communication {
  id: string;
  lead_id: string;
  type: string;
  subject?: string;
  content: string;
  direction: string;
  communication_date: string;
  lead_name?: string;
  is_urgent?: boolean;
}

interface AutoReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communication: Communication | null;
  onReplyGenerated?: (reply: { subject?: string; content: string }) => void;
  onReplySent?: () => void;
}

export function AutoReplyDialog({ open, onOpenChange, communication, onReplyGenerated, onReplySent }: AutoReplyDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [generatedSubject, setGeneratedSubject] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const { toast } = useToast();

  const handleGenerateReply = async () => {
    if (!communication) return;

    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-reply-ai', {
        body: {
          leadName: communication.lead_name || 'Valued Prospect',
          leadContext: `Communication type: ${communication.type}. ${communication.subject ? `Subject: ${communication.subject}` : ''}`,
          communicationHistory: communication.content,
          tone: selectedTone
        }
      });

      if (response.error) throw response.error;

      const { generatedReply } = response.data;
      
      // Generate subject if this is an email
      let subject = '';
      if (communication.type === 'email') {
        subject = communication.subject?.startsWith('Re:') 
          ? communication.subject 
          : `Re: ${communication.subject || 'Your Inquiry'}`;
      }

      setGeneratedSubject(subject);
      setGeneratedContent(generatedReply);
      setConfidenceScore(85); // Mock confidence score
      
      onReplyGenerated?.({ subject, content: generatedReply });
      
      toast({
        title: "Reply Generated",
        description: "AI-powered reply has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating reply:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReply = async () => {
    if (!communication || !generatedContent) return;

    setIsSending(true);
    try {
      // Mock sending logic - in real implementation, this would integrate with email/SMS services
      console.log('Sending reply:', {
        to: communication.lead_name,
        subject: generatedSubject,
        content: generatedContent,
        type: communication.type
      });

      toast({
        title: "Reply Sent",
        description: `${communication.type === 'email' ? 'Email' : 'Message'} reply sent successfully.`,
      });

      // Call the onReplySent callback to update parent component
      onReplySent?.();
      
      onOpenChange(false);
      
      // Reset form
      setGeneratedSubject('');
      setGeneratedContent('');
      setConfidenceScore(0);
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const resetDialog = () => {
    setGeneratedSubject('');
    setGeneratedContent('');
    setConfidenceScore(0);
    setSelectedTone('professional');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetDialog();
    }
    onOpenChange(newOpen);
  };

  if (!communication) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Auto-Reply to {communication.lead_name}
          </DialogTitle>
          <DialogDescription>
            Generate and customize an AI-powered reply for this {communication.type} communication.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Original Communication Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{communication.type}</Badge>
              {communication.is_urgent && (
                <Badge variant="destructive">Urgent</Badge>
              )}
              {confidenceScore > 0 && (
                <Badge variant="secondary">
                  Confidence: {confidenceScore}%
                </Badge>
              )}
            </div>
            {communication.subject && (
              <p className="text-sm font-medium mb-1">{communication.subject}</p>
            )}
            <p className="text-sm text-muted-foreground">{communication.content}</p>
          </div>

          {/* Tone Selection */}
          <div className="space-y-2">
            <Label htmlFor="tone">Reply Tone</Label>
            <Select value={selectedTone} onValueChange={setSelectedTone}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generated Reply Section */}
          {generatedContent ? (
            <div className="space-y-3">
              {communication.type === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={generatedSubject}
                    onChange={(e) => setGeneratedSubject(e.target.value)}
                    placeholder="Email subject..."
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="content" className="flex items-center gap-2">
                  Generated Reply
                  <Edit3 className="w-3 h-3" />
                </Label>
                <Textarea
                  id="content"
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  placeholder="AI-generated reply will appear here..."
                  rows={8}
                  className="resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Click "Generate AI Reply" to create a personalized response</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          
          {!generatedContent ? (
            <Button 
              onClick={handleGenerateReply} 
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {isGenerating ? 'Generating...' : 'Generate AI Reply'}
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={handleGenerateReply}
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Regenerate
              </Button>
              
              <Button 
                onClick={handleSendReply}
                disabled={isSending}
                className="gap-2"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSending ? 'Sending...' : 'Send Reply'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}