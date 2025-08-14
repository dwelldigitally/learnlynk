import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface EmailImportDialogProps {
  onEmailImported: () => void;
}

export function EmailImportDialog({ onEmailImported }: EmailImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    body_content: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Call edge function to process email with AI
      const { data, error } = await supabase.functions.invoke('process-demo-email', {
        body: {
          email: formData
        }
      });

      if (error) throw error;

      toast({
        title: "Email Imported Successfully",
        description: "The email has been processed with AI analysis and added to your inbox.",
      });

      setFormData({
        from_name: '',
        from_email: '',
        subject: '',
        body_content: ''
      });
      setOpen(false);
      onEmailImported();
    } catch (error) {
      console.error('Error importing email:', error);
      toast({
        title: "Import Failed",
        description: "Failed to process the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Import Demo Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Demo Email</DialogTitle>
          <DialogDescription>
            Paste email content to process it through AI analysis and see it in your inbox with lead matching and suggested actions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from_name">Sender Name</Label>
              <Input
                id="from_name"
                value={formData.from_name}
                onChange={(e) => setFormData(prev => ({ ...prev, from_name: e.target.value }))}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="from_email">Sender Email</Label>
              <Input
                id="from_email"
                type="email"
                value={formData.from_email}
                onChange={(e) => setFormData(prev => ({ ...prev, from_email: e.target.value }))}
                placeholder="john.doe@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Inquiry about your programs"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="body_content">Email Content</Label>
            <Textarea
              id="body_content"
              value={formData.body_content}
              onChange={(e) => setFormData(prev => ({ ...prev, body_content: e.target.value }))}
              placeholder="Hello, I'm interested in learning more about your healthcare programs..."
              rows={8}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Processing with AI...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Import & Analyze
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}