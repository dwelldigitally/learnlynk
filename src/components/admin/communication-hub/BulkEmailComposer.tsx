import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { HotSheetCard, PastelBadge, PillButton, IconContainer } from '@/components/hotsheet';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CommunicationTemplate } from '@/types/leadEnhancements';
import { CommunicationTemplateService } from '@/services/communicationTemplateService';
import { BulkLeadSelector, SelectedLead } from './BulkLeadSelector';
import { 
  Mail, 
  Users, 
  Send, 
  X, 
  FileText, 
  Code,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  Plus,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { TEMPLATE_VARIABLES } from '@/types/leadEnhancements';

interface BulkEmailComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialRecipients?: SelectedLead[];
}

type SendingStatus = 'idle' | 'sending' | 'complete' | 'error';

interface SendResults {
  total: number;
  sent: number;
  failed: number;
}

export function BulkEmailComposer({ 
  open, 
  onOpenChange,
  initialRecipients = []
}: BulkEmailComposerProps) {
  const { toast } = useToast();
  
  // Recipients state
  const [recipients, setRecipients] = useState<SelectedLead[]>(initialRecipients);
  const [showLeadSelector, setShowLeadSelector] = useState(false);
  
  // Email content state
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  // Templates
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  
  // Sending state
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>('idle');
  const [sendProgress, setSendProgress] = useState(0);
  const [sendResults, setSendResults] = useState<SendResults | null>(null);

  // Load templates on mount
  useEffect(() => {
    if (open) {
      loadTemplates();
      setRecipients(initialRecipients);
    }
  }, [open]);

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const data = await CommunicationTemplateService.getTemplates('email');
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleSelectTemplate = (template: CommunicationTemplate) => {
    setSelectedTemplateId(template.id);
    setSubject(template.subject || '');
    setContent(template.content);
  };

  const insertVariable = (variable: string) => {
    setContent(prev => prev + (prev ? ' ' : '') + variable);
  };

  const removeRecipient = (id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
  };

  const handleSend = async () => {
    if (recipients.length === 0) {
      toast({
        title: "No recipients",
        description: "Please select at least one recipient.",
        variant: "destructive"
      });
      return;
    }

    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Missing content",
        description: "Please enter a subject and message content.",
        variant: "destructive"
      });
      return;
    }

    setSendingStatus('sending');
    setSendProgress(0);
    setSendResults(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Simulate progress for UX
      const progressInterval = setInterval(() => {
        setSendProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: {
          recipients: recipients.map(r => ({
            id: r.id,
            email: r.email,
            first_name: r.first_name,
            last_name: r.last_name,
            phone: r.phone,
            program_interest: r.program_interest,
          })),
          subject,
          content,
          template_id: selectedTemplateId,
          user_id: user.id,
        }
      });

      clearInterval(progressInterval);
      setSendProgress(100);

      if (error) throw error;

      setSendResults(data.summary);
      setSendingStatus('complete');

      toast({
        title: "Bulk email sent!",
        description: `Successfully sent ${data.summary.sent} of ${data.summary.total} emails.`,
      });

    } catch (error) {
      console.error('Error sending bulk email:', error);
      setSendingStatus('error');
      toast({
        title: "Send failed",
        description: error instanceof Error ? error.message : "Failed to send bulk email",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setSendingStatus('idle');
    setSendProgress(0);
    setSendResults(null);
    setSubject('');
    setContent('');
    setSelectedTemplateId(null);
    setRecipients([]);
  };

  const handleClose = () => {
    if (sendingStatus === 'sending') return;
    handleReset();
    onOpenChange(false);
  };

  // Preview with first recipient's data
  const previewContent = recipients.length > 0 
    ? content
        .replace(/\{\{first_name\}\}/g, recipients[0].first_name || '')
        .replace(/\{\{last_name\}\}/g, recipients[0].last_name || '')
        .replace(/\{\{email\}\}/g, recipients[0].email || '')
        .replace(/\{\{lead_name\}\}/g, `${recipients[0].first_name || ''} ${recipients[0].last_name || ''}`.trim())
    : content;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col bg-background border border-border/40">
          <DialogHeader className="border-b border-border/30 pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <IconContainer color="primary" size="sm">
                <Mail className="w-4 h-4" />
              </IconContainer>
              Bulk Email Composer
              {recipients.length > 0 && (
                <PastelBadge color="emerald" size="sm">
                  {recipients.length} recipients
                </PastelBadge>
              )}
            </DialogTitle>
          </DialogHeader>

          {sendingStatus === 'complete' || sendingStatus === 'error' ? (
            // Results View
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <IconContainer 
                color={sendingStatus === 'complete' ? 'emerald' : 'rose'} 
                size="xl" 
                className="mb-6"
              >
                {sendingStatus === 'complete' ? (
                  <CheckCircle2 className="w-10 h-10" />
                ) : (
                  <XCircle className="w-10 h-10" />
                )}
              </IconContainer>
              
              <h3 className="text-2xl font-semibold mb-2">
                {sendingStatus === 'complete' ? 'Emails Sent!' : 'Send Failed'}
              </h3>
              
              {sendResults && (
                <div className="flex gap-6 mt-4 mb-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-emerald-600">{sendResults.sent}</p>
                    <p className="text-sm text-muted-foreground">Sent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-rose-600">{sendResults.failed}</p>
                    <p className="text-sm text-muted-foreground">Failed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">{sendResults.total}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <PillButton variant="outline" onClick={handleClose}>
                  Close
                </PillButton>
                <PillButton variant="primary" onClick={handleReset}>
                  Send Another
                </PillButton>
              </div>
            </div>
          ) : sendingStatus === 'sending' ? (
            // Sending Progress View
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-2">Sending Emails...</h3>
              <p className="text-muted-foreground mb-6">
                Please wait while we send your emails.
              </p>
              <div className="w-64">
                <Progress value={sendProgress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground mt-2">
                  {sendProgress}% complete
                </p>
              </div>
            </div>
          ) : (
            // Composer View
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6 py-4">
              {/* Left: Compose Form */}
              <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
                {/* Recipients */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Recipients
                    </Label>
                    <PillButton 
                      variant="soft" 
                      size="sm"
                      onClick={() => setShowLeadSelector(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Recipients
                    </PillButton>
                  </div>
                  
                  {recipients.length === 0 ? (
                    <HotSheetCard 
                      padding="md" 
                      className="border-dashed cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setShowLeadSelector(true)}
                    >
                      <div className="flex flex-col items-center py-4 text-muted-foreground">
                        <Users className="w-8 h-8 mb-2" />
                        <p className="text-sm">Click to select recipients</p>
                      </div>
                    </HotSheetCard>
                  ) : (
                    <ScrollArea className="h-24 border rounded-xl p-2">
                      <div className="flex flex-wrap gap-2">
                        {recipients.map(recipient => (
                          <PastelBadge 
                            key={recipient.id} 
                            color="sky" 
                            size="sm"
                            className="pr-1"
                          >
                            {recipient.first_name || recipient.email.split('@')[0]}
                            <button 
                              onClick={() => removeRecipient(recipient.id)}
                              className="ml-1 p-0.5 hover:bg-black/10 rounded"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </PastelBadge>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>

                {/* Template Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Template (Optional)
                  </Label>
                  <ScrollArea className="h-20">
                    <div className="flex gap-2">
                      {loadingTemplates ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : templates.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No templates available</p>
                      ) : (
                        templates.slice(0, 5).map(template => (
                          <PillButton
                            key={template.id}
                            variant={selectedTemplateId === template.id ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => handleSelectTemplate(template)}
                          >
                            {template.ai_generated && <Sparkles className="w-3 h-3 mr-1" />}
                            {template.name}
                          </PillButton>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="border-border/40 rounded-xl"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1 flex flex-col min-h-0">
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your email message here. Use variables like {{first_name}} for personalization."
                    className="flex-1 min-h-[150px] border-border/40 rounded-xl resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="w-4 h-4" />
                    Emails will be sent via Resend
                  </div>
                  <div className="flex gap-3">
                    <PillButton variant="outline" onClick={handleClose}>
                      Cancel
                    </PillButton>
                    <PillButton 
                      variant="primary" 
                      onClick={handleSend}
                      disabled={recipients.length === 0 || !subject.trim() || !content.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send to {recipients.length} {recipients.length === 1 ? 'recipient' : 'recipients'}
                    </PillButton>
                  </div>
                </div>
              </div>

              {/* Right: Variables & Preview */}
              <div className="flex flex-col gap-4 overflow-hidden">
                {/* Variables */}
                <HotSheetCard padding="md" className="flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold">Variables</h4>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {TEMPLATE_VARIABLES.slice(0, 8).map(variable => (
                      <button
                        key={variable.key}
                        type="button"
                        className="px-2 py-1 text-xs font-mono bg-muted/40 hover:bg-muted/60 rounded-md border border-border/30 transition-colors"
                        onClick={() => insertVariable(variable.key)}
                        title={variable.description}
                      >
                        {variable.key}
                      </button>
                    ))}
                  </div>
                </HotSheetCard>

                {/* Preview */}
                <HotSheetCard padding="md" className="flex-1 overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold">Preview</h4>
                    {recipients.length > 0 && (
                      <PastelBadge color="sky" size="sm">
                        {recipients[0].first_name || recipients[0].email.split('@')[0]}
                      </PastelBadge>
                    )}
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Subject:</p>
                        <p className="font-medium">
                          {subject || <span className="text-muted-foreground italic">No subject</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Message:</p>
                        <div className="whitespace-pre-wrap text-muted-foreground">
                          {previewContent || <span className="italic">No content</span>}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </HotSheetCard>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BulkLeadSelector
        open={showLeadSelector}
        onOpenChange={setShowLeadSelector}
        onConfirm={(leads) => setRecipients(leads)}
        initialSelected={recipients}
      />
    </>
  );
}
