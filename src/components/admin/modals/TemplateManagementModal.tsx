import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  Save,
  Tag,
  Clock,
  BarChart3
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'email' | 'sms';
  category: string;
  tags: string[];
  variables: string[];
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
  isActive: boolean;
}

interface TemplateManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: Template | null;
}

export const TemplateManagementModal: React.FC<TemplateManagementModalProps> = ({
  isOpen,
  onClose,
  template
}) => {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(template);
  const [formData, setFormData] = useState<Partial<Template>>(
    template || {
      name: '',
      subject: '',
      content: '',
      type: 'email',
      category: '',
      tags: [],
      variables: [],
      isActive: true
    }
  );
  
  const { toast } = useToast();

  const mockTemplates: Template[] = [
    {
      id: '1',
      name: 'Welcome Email',
      subject: 'Welcome to {{program_name}} - Next Steps',
      content: 'Dear {{student_name}},\n\nWelcome to our {{program_name}} program! We\'re excited to have you join us.',
      type: 'email',
      category: 'Welcome',
      tags: ['onboarding', 'welcome'],
      variables: ['student_name', 'program_name'],
      createdAt: '2024-01-15',
      lastUsed: '2024-01-30',
      usageCount: 156,
      isActive: true
    },
    {
      id: '2',
      name: 'Application Reminder',
      subject: 'Complete Your Application - {{days_remaining}} Days Left',
      content: 'Hi {{student_name}},\n\nThis is a friendly reminder that your application for {{program_name}} is due in {{days_remaining}} days.',
      type: 'email',
      category: 'Reminders',
      tags: ['reminder', 'deadline'],
      variables: ['student_name', 'program_name', 'days_remaining'],
      createdAt: '2024-01-10',
      lastUsed: '2024-01-29',
      usageCount: 89,
      isActive: true
    },
    {
      id: '3',
      name: 'Interview Confirmation SMS',
      subject: '',
      content: 'Hi {{student_name}}, your interview for {{program_name}} is scheduled for {{interview_date}} at {{interview_time}}. Location: {{location}}',
      type: 'sms',
      category: 'Interviews',
      tags: ['interview', 'confirmation'],
      variables: ['student_name', 'program_name', 'interview_date', 'interview_time', 'location'],
      createdAt: '2024-01-20',
      lastUsed: '2024-01-28',
      usageCount: 45,
      isActive: true
    }
  ];

  const categories = ['Welcome', 'Reminders', 'Interviews', 'Offers', 'General'];
  const commonVariables = [
    'student_name', 'student_email', 'program_name', 'application_id',
    'deadline_date', 'interview_date', 'interview_time', 'staff_name'
  ];

  const handleSave = () => {
    if (!formData.name || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Template Saved",
      description: `"${formData.name}" has been saved successfully.`
    });
    
    setActiveTab('list');
    setFormData({
      name: '',
      subject: '',
      content: '',
      type: 'email',
      category: '',
      tags: [],
      variables: [],
      isActive: true
    });
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setFormData(template);
    setActiveTab('edit');
  };

  const handleDuplicate = (template: Template) => {
    setFormData({
      ...template,
      name: `${template.name} (Copy)`,
      id: undefined
    });
    setActiveTab('edit');
  };

  const handleDelete = (templateId: string) => {
    toast({
      title: "Template Deleted",
      description: "The template has been deleted successfully."
    });
  };

  const handlePreview = (template: Template) => {
    setSelectedTemplate(template);
    setActiveTab('preview');
  };

  const insertVariable = (variable: string) => {
    const newContent = (formData.content || '') + `{{${variable}}}`;
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Template Management
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="list">All Templates</TabsTrigger>
            <TabsTrigger value="edit">
              {selectedTemplate ? 'Edit Template' : 'New Template'}
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!selectedTemplate}>
              Preview
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setActiveTab('edit')}>
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </div>

            <ScrollArea className="h-96">
              <div className="space-y-3">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-accent/50">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            {template.type === 'email' ? (
                              <Mail className="w-4 h-4" />
                            ) : (
                              <MessageSquare className="w-4 h-4" />
                            )}
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge variant="outline">{template.category}</Badge>
                            {!template.isActive && (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          
                          {template.subject && (
                            <p className="text-sm text-muted-foreground">
                              Subject: {template.subject}
                            </p>
                          )}
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {template.content}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Used {template.usageCount} times
                            </span>
                            {template.lastUsed && (
                              <span>Last used: {template.lastUsed}</span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {template.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePreview(template)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(template)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicate(template)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(template.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template Name</label>
                  <Input
                    placeholder="Enter template name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'email' | 'sms') => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === 'email' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject Line</label>
                    <Input
                      placeholder="Enter email subject"
                      value={formData.subject || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Variables</label>
                  <div className="flex flex-wrap gap-1">
                    {commonVariables.map(variable => (
                      <Button
                        key={variable}
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(variable)}
                        className="text-xs"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {variable}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Template Content</label>
                  <Textarea
                    placeholder="Enter your template content here. Use {{variable_name}} for dynamic content."
                    className="min-h-[300px]"
                    value={formData.content || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags (comma-separated)</label>
                  <Input
                    placeholder="reminder, urgent, follow-up"
                    value={formData.tags?.join(', ') || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setActiveTab('list')}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {selectedTemplate.type === 'email' ? (
                      <Mail className="w-5 h-5" />
                    ) : (
                      <MessageSquare className="w-5 h-5" />
                    )}
                    {selectedTemplate.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTemplate.subject && (
                    <div>
                      <label className="text-sm font-medium">Subject:</label>
                      <p className="text-sm bg-muted p-2 rounded mt-1">
                        {selectedTemplate.subject}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium">Content:</label>
                    <div className="text-sm bg-muted p-4 rounded mt-1 whitespace-pre-wrap">
                      {selectedTemplate.content}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Variables used:</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTemplate.variables.map(variable => (
                        <Badge key={variable} variant="secondary">
                          {`{{${variable}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Most Used Templates
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockTemplates
                      .sort((a, b) => b.usageCount - a.usageCount)
                      .slice(0, 3)
                      .map((template) => (
                        <div key={template.id} className="flex justify-between text-sm">
                          <span>{template.name}</span>
                          <span className="text-muted-foreground">{template.usageCount}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Template Distribution
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Email Templates</span>
                      <span className="text-muted-foreground">
                        {mockTemplates.filter(t => t.type === 'email').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>SMS Templates</span>
                      <span className="text-muted-foreground">
                        {mockTemplates.filter(t => t.type === 'sms').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};