import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, AlertCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { presetDocumentService, PresetDocumentRequirement } from '@/services/presetDocumentService';
import { supabase } from '@/integrations/supabase/client';

interface RequestDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  leadName: string;
  programName: string;
  onRequestSent?: () => void;
}

export function RequestDocumentDialog({
  open,
  onOpenChange,
  leadId,
  leadName,
  programName,
  onRequestSent
}: RequestDocumentDialogProps) {
  const { toast } = useToast();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Get all available preset documents for the program
  const availableDocuments = presetDocumentService.getPresetRequirements(programName);

  const selectedDocument = availableDocuments.find(doc => doc.id === selectedDocumentId);

  const handleSendRequest = async () => {
    if (!selectedDocumentId || !selectedDocument) {
      toast({
        title: 'Selection Required',
        description: 'Please select a document to request',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);

    try {
      const user = await supabase.auth.getUser();
      
      // Create a document request record in the database
      const { error: insertError } = await supabase
        .from('lead_documents')
        .insert({
          lead_id: leadId,
          user_id: user.data.user?.id,
          document_name: selectedDocument.name,
          document_type: 'application/pdf',
          status: 'requested',
          admin_status: 'pending',
          admin_comments: message || `Please upload your ${selectedDocument.name}`,
          required: selectedDocument.required,
          requirement_id: selectedDocument.id,
          metadata: {
            request_sent_at: new Date().toISOString(),
            description: selectedDocument.description
          }
        });

      if (insertError) throw insertError;

      // TODO: Send actual notification/email to the lead
      // This would integrate with your communication system

      toast({
        title: 'Request Sent',
        description: `Document request for "${selectedDocument.name}" has been sent to ${leadName}`,
      });

      // Reset form
      setSelectedDocumentId('');
      setMessage('');
      onOpenChange(false);
      onRequestSent?.();

    } catch (error) {
      console.error('Error sending document request:', error);
      toast({
        title: 'Request Failed',
        description: 'Failed to send document request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Request Additional Document
          </DialogTitle>
          <DialogDescription>
            Request a specific document from {leadName} for their {programName} application
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Document Selection */}
          <div className="space-y-2">
            <Label htmlFor="document-select">Select Document *</Label>
            <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
              <SelectTrigger id="document-select">
                <SelectValue placeholder="Choose a document type" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[300px]">
                  {availableDocuments.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{doc.name}</span>
                        {doc.required && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Selected Document Details */}
          {selectedDocument && (
            <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-sm">{selectedDocument.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedDocument.description}
                  </p>
                </div>
                {selectedDocument.required && (
                  <Badge variant="destructive" className="flex-shrink-0">
                    Required
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                <AlertCircle className="h-3 w-3" />
                <span>Program: {selectedDocument.programName}</span>
              </div>
            </div>
          )}

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder={`Enter any additional instructions or context for the document request...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              A default message will be included with the document request
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={sending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendRequest}
            disabled={!selectedDocumentId || sending}
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
