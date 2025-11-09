import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, FileText } from 'lucide-react';
import { AttachmentMetadata } from '@/types/leadEnhancements';

interface EmailPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: string;
  content: string;
  htmlContent?: string;
  contentFormat: 'plain' | 'html' | 'rich';
  attachments?: AttachmentMetadata[];
}

export function EmailPreviewModal({
  open,
  onOpenChange,
  subject,
  content,
  htmlContent,
  contentFormat,
  attachments = [],
}: EmailPreviewModalProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const getSampleData = () => ({
    '{{first_name}}': 'John',
    '{{last_name}}': 'Doe',
    '{{email}}': 'john.doe@example.com',
    '{{phone}}': '+1 234 567 8900',
    '{{program_interest}}': 'MBA, Executive Education',
    '{{agent_name}}': 'Sarah Johnson',
    '{{today}}': new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
  });

  const replaceVariables = (text: string): string => {
    let result = text;
    const sampleData = getSampleData();
    
    Object.entries(sampleData).forEach(([key, value]) => {
      result = result.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });
    
    return result;
  };

  const previewContent = contentFormat === 'plain' 
    ? replaceVariables(content)
    : replaceVariables(htmlContent || content);

  const previewSubject = subject ? replaceVariables(subject) : 'No subject';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Preview</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="data">Test Data</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  previewMode === 'desktop' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Monitor className="h-4 w-4" />
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  previewMode === 'mobile' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                Mobile
              </button>
            </div>

            {/* Preview Container */}
            <Card 
              className={`overflow-hidden transition-all mx-auto ${
                previewMode === 'mobile' ? 'max-w-sm' : 'w-full'
              }`}
            >
              <div className="bg-muted p-4 border-b">
                <p className="text-sm font-medium">{previewSubject}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  From: Sarah Johnson &lt;sarah@university.edu&gt;
                </p>
                <p className="text-xs text-muted-foreground">
                  To: john.doe@example.com
                </p>
              </div>

              <div className="p-6 bg-background">
                {contentFormat === 'plain' ? (
                  <div className="whitespace-pre-wrap text-sm">
                    {previewContent}
                  </div>
                ) : (
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewContent }}
                  />
                )}
              </div>

              {attachments.length > 0 && (
                <div className="p-4 bg-muted/50 border-t">
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Attachments ({attachments.length})
                  </p>
                  <div className="space-y-1">
                    {attachments.map((attachment) => (
                      <div 
                        key={attachment.id}
                        className="flex items-center justify-between text-xs bg-background p-2 rounded"
                      >
                        <span className="truncate">{attachment.file_name}</span>
                        <Badge variant="outline" className="ml-2">
                          {(attachment.file_size / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-medium mb-4">Sample Personalization Data</h3>
              <div className="space-y-2">
                {Object.entries(getSampleData()).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-4 text-sm">
                    <code className="bg-muted px-2 py-1 rounded font-mono text-xs flex-shrink-0">
                      {key}
                    </code>
                    <span className="text-muted-foreground">→</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                These variables will be replaced with actual data when sending emails.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
