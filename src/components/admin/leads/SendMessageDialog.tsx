import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MessageSquare, Phone, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { leadActivityService } from '@/services/leadActivityService';

interface SendMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  onMessageSent?: () => void;
}

export function SendMessageDialog({
  open,
  onOpenChange,
  leadId,
  leadName,
  leadEmail,
  leadPhone,
  onMessageSent
}: SendMessageDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('email');
  const [sending, setSending] = useState(false);

  // Email state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // SMS state
  const [smsMessage, setSmsMessage] = useState('');

  // Phone log state
  const [callOutcome, setCallOutcome] = useState<string>('');
  const [callNotes, setCallNotes] = useState('');
  const [callDuration, setCallDuration] = useState('');

  const resetForm = () => {
    setEmailSubject('');
    setEmailBody('');
    setSmsMessage('');
    setCallOutcome('');
    setCallNotes('');
    setCallDuration('');
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in subject and body',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Log to lead_communications
      const { error } = await supabase.from('lead_communications').insert({
        lead_id: leadId,
        user_id: user.id,
        type: 'email',
        direction: 'outbound',
        subject: emailSubject,
        content: emailBody,
        status: 'sent',
        metadata: { recipient_email: leadEmail }
      });

      if (error) throw error;

      toast({
        title: 'Email Sent',
        description: `Email sent to ${leadName}`,
      });

      resetForm();
      onMessageSent?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Failed to Send',
        description: error.message || 'Could not send email',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendSMS = async () => {
    if (!smsMessage.trim()) {
      toast({
        title: 'Missing Message',
        description: 'Please enter a message',
        variant: 'destructive'
      });
      return;
    }

    if (!leadPhone) {
      toast({
        title: 'No Phone Number',
        description: 'This lead does not have a phone number',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Log to lead_communications
      const { error } = await supabase.from('lead_communications').insert({
        lead_id: leadId,
        user_id: user.id,
        type: 'sms',
        direction: 'outbound',
        content: smsMessage,
        status: 'sent',
        metadata: { recipient_phone: leadPhone }
      });

      if (error) throw error;

      toast({
        title: 'SMS Sent',
        description: `SMS sent to ${leadName}`,
      });

      resetForm();
      onMessageSent?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Failed to Send',
        description: error.message || 'Could not send SMS',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const handleLogCall = async () => {
    if (!callOutcome) {
      toast({
        title: 'Missing Outcome',
        description: 'Please select a call outcome',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Log to lead_communications
      const { error } = await supabase.from('lead_communications').insert({
        lead_id: leadId,
        user_id: user.id,
        type: 'phone',
        direction: 'outbound',
        content: callNotes,
        status: 'completed',
        metadata: {
          outcome: callOutcome,
          duration_minutes: callDuration ? parseInt(callDuration) : null,
          recipient_phone: leadPhone
        }
      });

      if (error) throw error;

      toast({
        title: 'Call Logged',
        description: `Phone call with ${leadName} recorded`,
      });

      resetForm();
      onMessageSent?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Failed to Log',
        description: error.message || 'Could not log call',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Message to {leadName}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>To</Label>
              <Input value={leadEmail || 'No email available'} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject *</Label>
              <Input
                id="email-subject"
                placeholder="Enter email subject..."
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body">Message *</Label>
              <Textarea
                id="email-body"
                placeholder="Type your message..."
                rows={6}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSendEmail}
              disabled={sending || !leadEmail}
              className="w-full"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send Email
            </Button>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>To</Label>
              <Input value={leadPhone || 'No phone available'} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sms-message">Message *</Label>
              <Textarea
                id="sms-message"
                placeholder="Type your SMS message..."
                rows={4}
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                maxLength={160}
              />
              <div className="text-xs text-muted-foreground text-right">
                {smsMessage.length}/160 characters
              </div>
            </div>
            <Button
              onClick={handleSendSMS}
              disabled={sending || !leadPhone}
              className="w-full"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send SMS
            </Button>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={leadPhone || 'No phone available'} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="call-outcome">Call Outcome *</Label>
              <Select value={callOutcome} onValueChange={setCallOutcome}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="answered">Answered - Successful</SelectItem>
                  <SelectItem value="answered_callback">Answered - Callback Requested</SelectItem>
                  <SelectItem value="voicemail">Voicemail Left</SelectItem>
                  <SelectItem value="no_answer">No Answer</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="wrong_number">Wrong Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="call-duration">Duration (minutes)</Label>
              <Input
                id="call-duration"
                type="number"
                placeholder="e.g., 15"
                value={callDuration}
                onChange={(e) => setCallDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="call-notes">Notes</Label>
              <Textarea
                id="call-notes"
                placeholder="Add call notes..."
                rows={4}
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
              />
            </div>
            <Button
              onClick={handleLogCall}
              disabled={sending}
              className="w-full"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Phone className="h-4 w-4 mr-2" />
              )}
              Log Call
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
