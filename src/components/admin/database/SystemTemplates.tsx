import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  FileText, 
  Mail, 
  Settings,
  Download,
  Upload
} from 'lucide-react';

export const SystemTemplates = () => {
  const [templates, setTemplates] = useState({
    form: [
      {
        id: '1',
        name: 'Student Application Form',
        description: 'Standard application form for new students',
        category: 'admission',
        isActive: true,
        lastModified: '2024-01-15'
      },
      {
        id: '2',
        name: 'Payment Information Form',
        description: 'Collect payment and billing details',
        category: 'payment',
        isActive: true,
        lastModified: '2024-01-10'
      }
    ],
    email: [
      {
        id: '1',
        name: 'Welcome Email',
        description: 'Welcome new students to the program',
        category: 'onboarding',
        isActive: true,
        lastModified: '2024-01-12'
      },
      {
        id: '2',
        name: 'Payment Reminder',
        description: 'Reminder for upcoming payment due dates',
        category: 'billing',
        isActive: true,
        lastModified: '2024-01-08'
      }
    ],
    document: [
      {
        id: '1',
        name: 'Enrollment Certificate',
        description: 'Official enrollment certificate template',
        category: 'certificates',
        isActive: true,
        lastModified: '2024-01-14'
      },
      {
        id: '2',
        name: 'Transcript Template',
        description: 'Academic transcript format',
        category: 'academic',
        isActive: true,
        lastModified: '2024-01-11'
      }
    ]
  });

  const TemplateCard = ({ template, type }: { template: any; type: string }) => (
    <Card key={template.id}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {type === 'form' && <FileText className="h-5 w-5 text-primary" />}
            {type === 'email' && <Mail className="h-5 w-5 text-primary" />}
            {type === 'document' && <FileText className="h-5 w-5 text-primary" />}
            <div>
              <CardTitle className="text-base">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={template.isActive ? 'default' : 'secondary'}>
              {template.isActive ? 'Active' : 'Inactive'}
            </Badge>
            <Switch checked={template.isActive} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Category: {template.category}</span>
            <span>Modified: {template.lastModified}</span>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Edit className="h-3 w-3" />
              <span>Edit</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Copy className="h-3 w-3" />
              <span>Clone</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Download className="h-3 w-3" />
              <span>Export</span>
            </Button>
            <Button variant="destructive" size="sm" className="flex items-center space-x-1">
              <Trash2 className="h-3 w-3" />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FormTemplates = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium">Form Templates</h4>
          <p className="text-sm text-muted-foreground">Reusable form layouts and field configurations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Template</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {templates.form.map(template => (
          <TemplateCard key={template.id} template={template} type="form" />
        ))}
      </div>
    </div>
  );

  const EmailTemplates = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium">Email Templates</h4>
          <p className="text-sm text-muted-foreground">Automated email templates for notifications and communications</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Template</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {templates.email.map(template => (
          <TemplateCard key={template.id} template={template} type="email" />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Template Variables</CardTitle>
          <CardDescription>Available variables for email personalization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <Badge variant="outline">{'{{student_name}}'}</Badge>
            <Badge variant="outline">{'{{program_name}}'}</Badge>
            <Badge variant="outline">{'{{due_date}}'}</Badge>
            <Badge variant="outline">{'{{amount}}'}</Badge>
            <Badge variant="outline">{'{{campus_name}}'}</Badge>
            <Badge variant="outline">{'{{advisor_name}}'}</Badge>
            <Badge variant="outline">{'{{application_id}}'}</Badge>
            <Badge variant="outline">{'{{login_url}}'}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DocumentTemplates = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium">Document Templates</h4>
          <p className="text-sm text-muted-foreground">Templates for certificates, transcripts, and official documents</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Template</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {templates.document.map(template => (
          <TemplateCard key={template.id} template={template} type="document" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">System Templates</h3>
          <p className="text-sm text-muted-foreground">
            Manage reusable templates for forms, emails, and documents
          </p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Template Settings</span>
        </Button>
      </div>

      <Tabs defaultValue="forms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forms">Form Templates</TabsTrigger>
          <TabsTrigger value="emails">Email Templates</TabsTrigger>
          <TabsTrigger value="documents">Document Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="forms">
          <FormTemplates />
        </TabsContent>

        <TabsContent value="emails">
          <EmailTemplates />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
};