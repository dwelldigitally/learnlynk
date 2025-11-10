import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvoiceTemplate, ReceiptTemplate } from '@/services/paymentService';
import { Code, Eye } from 'lucide-react';

interface TemplatePreviewModalProps {
  template: InvoiceTemplate | ReceiptTemplate;
  type: 'invoice' | 'receipt';
  onClose: () => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  type,
  onClose,
}) => {
  // Sample data for preview
  const sampleData = {
    '{{lead_name}}': 'John Doe',
    '{{lead_email}}': 'john.doe@example.com',
    '{{amount}}': '1,500.00',
    '{{currency}}': 'USD',
    '{{payment_type}}': 'Tuition Fee',
    '{{due_date}}': 'December 31, 2025',
    '{{invoice_number}}': 'INV-2025-001',
    '{{payment_date}}': 'November 10, 2025',
    '{{company_name}}': 'Your Institution Name',
    '{{company_address}}': '123 Main Street, City, State 12345',
  };

  const replaceVariables = (content: string) => {
    let result = content;
    Object.entries(sampleData).forEach(([key, value]) => {
      result = result.replace(new RegExp(key, 'g'), value);
    });
    return result;
  };

  const previewHtml = replaceVariables(template.body_html);
  const previewText = replaceVariables(template.body_text);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template.name} - Preview</DialogTitle>
          <DialogDescription>
            Preview of how this {type} template will appear with sample data
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="rendered" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rendered">
              <Eye className="h-4 w-4 mr-2" />
              Rendered
            </TabsTrigger>
            <TabsTrigger value="html">
              <Code className="h-4 w-4 mr-2" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="text">Plain Text</TabsTrigger>
          </TabsList>

          <TabsContent value="rendered" className="border rounded-lg p-4 bg-background">
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </TabsContent>

          <TabsContent value="html" className="border rounded-lg p-4 bg-muted">
            <pre className="text-sm overflow-x-auto">
              <code>{previewHtml}</code>
            </pre>
          </TabsContent>

          <TabsContent value="text" className="border rounded-lg p-4 bg-muted">
            <pre className="whitespace-pre-wrap text-sm">{previewText}</pre>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
