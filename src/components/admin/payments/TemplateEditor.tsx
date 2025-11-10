import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Code, Eye } from 'lucide-react';
import {
  InvoiceTemplate,
  ReceiptTemplate,
  useCreateInvoiceTemplate,
  useUpdateInvoiceTemplate,
  useCreateReceiptTemplate,
  useUpdateReceiptTemplate,
} from '@/services/paymentService';
import { TEMPLATE_VARIABLES } from '@/utils/templateVariables';

interface TemplateEditorProps {
  template?: InvoiceTemplate | ReceiptTemplate;
  type: 'invoice' | 'receipt';
  onClose: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, type, onClose }) => {
  const isInvoice = type === 'invoice';
  const [name, setName] = useState(template?.name || '');
  const [templateType, setTemplateType] = useState(template?.template_type || 'standard');
  const [subjectLine, setSubjectLine] = useState(
    (template as InvoiceTemplate)?.subject_line || ''
  );
  const [bodyHtml, setBodyHtml] = useState(template?.body_html || '');
  const [bodyText, setBodyText] = useState(template?.body_text || '');
  const [isDefault, setIsDefault] = useState(template?.is_default || false);
  const [activeTab, setActiveTab] = useState<'html' | 'text'>('html');

  const createInvoice = useCreateInvoiceTemplate();
  const updateInvoice = useUpdateInvoiceTemplate();
  const createReceipt = useCreateReceiptTemplate();
  const updateReceipt = useUpdateReceiptTemplate();

  const insertVariable = (variable: string) => {
    if (activeTab === 'html') {
      setBodyHtml((prev) => prev + variable);
    } else {
      setBodyText((prev) => prev + variable);
    }
  };

  const handleSave = async () => {
    const templateData: any = {
      name,
      template_type: templateType,
      body_html: bodyHtml,
      body_text: bodyText,
      is_default: isDefault,
    };

    if (isInvoice) {
      templateData.subject_line = subjectLine;
    }

    try {
      if (template) {
        if (isInvoice) {
          await updateInvoice.mutateAsync({ id: template.id, template: templateData });
        } else {
          await updateReceipt.mutateAsync({ id: template.id, template: templateData });
        }
      } else {
        if (isInvoice) {
          await createInvoice.mutateAsync(templateData);
        } else {
          await createReceipt.mutateAsync(templateData);
        }
      }
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold text-foreground">
          {template ? 'Edit' : 'Create'} {isInvoice ? 'Invoice' : 'Receipt'} Template
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>Configure the basic template information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Professional Invoice"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Template Type</Label>
                <Input
                  id="type"
                  value={templateType}
                  onChange={(e) => setTemplateType(e.target.value)}
                  placeholder="e.g., standard, detailed, simple"
                />
              </div>

              {isInvoice && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Line</Label>
                  <Input
                    id="subject"
                    value={subjectLine}
                    onChange={(e) => setSubjectLine(e.target.value)}
                    placeholder="Invoice for {{lead_name}} - Payment Due"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="default">Set as Default Template</Label>
                  <p className="text-sm text-muted-foreground">
                    Use this template when no specific template is selected
                  </p>
                </div>
                <Switch id="default" checked={isDefault} onCheckedChange={setIsDefault} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Content</CardTitle>
              <CardDescription>Design your email template with HTML and text versions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'html' | 'text')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="html">
                    <Code className="h-4 w-4 mr-2" />
                    HTML Version
                  </TabsTrigger>
                  <TabsTrigger value="text">
                    <Eye className="h-4 w-4 mr-2" />
                    Plain Text
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="html" className="space-y-4">
                  <Textarea
                    value={bodyHtml}
                    onChange={(e) => setBodyHtml(e.target.value)}
                    placeholder="Enter HTML content..."
                    className="min-h-[400px] font-mono text-sm"
                  />
                </TabsContent>
                <TabsContent value="text" className="space-y-4">
                  <Textarea
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    placeholder="Enter plain text content..."
                    className="min-h-[400px]"
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Variables</CardTitle>
              <CardDescription>Click to insert into template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['lead', 'payment', 'company'].map((category) => (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-foreground mb-2 capitalize">
                      {category} Variables
                    </h4>
                    <div className="space-y-1">
                      {TEMPLATE_VARIABLES.filter((v) => v.category === category).map((variable) => (
                        <button
                          key={variable.key}
                          onClick={() => insertVariable(variable.key)}
                          className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                        >
                          <Badge variant="secondary" className="mb-1">
                            {variable.key}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{variable.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
