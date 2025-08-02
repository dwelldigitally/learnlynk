import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Copy, Mail, MessageSquare, Eye, Code } from 'lucide-react';
import { CommunicationTemplate, TemplateFormData, TEMPLATE_VARIABLES } from '@/types/leadEnhancements';
import { CommunicationTemplateService } from '@/services/communicationTemplateService';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

export function CommunicationTemplateManager() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CommunicationTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<CommunicationTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('email');

  const { register, handleSubmit, reset, setValue, watch } = useForm<TemplateFormData>({
    defaultValues: {
      type: 'email',
    }
  });

  const watchedContent = watch('content');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await CommunicationTemplateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TemplateFormData) => {
    setIsCreating(true);
    try {
      if (editingTemplate) {
        const updatedTemplate = await CommunicationTemplateService.updateTemplate(editingTemplate.id, data);
        setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        setEditingTemplate(null);
      } else {
        const newTemplate = await CommunicationTemplateService.createTemplate(data);
        setTemplates(prev => [newTemplate, ...prev]);
      }
      setShowCreateDialog(false);
      reset();
      toast({
        title: "Success",
        description: editingTemplate ? "Template updated successfully" : "Template created successfully",
      });
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTemplate = (template: CommunicationTemplate) => {
    setEditingTemplate(template);
    setValue('name', template.name);
    setValue('type', template.type);
    setValue('subject', template.subject || '');
    setValue('content', template.content);
    setShowCreateDialog(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await CommunicationTemplateService.deleteTemplate(templateId);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateTemplate = async (template: CommunicationTemplate) => {
    try {
      const duplicateData: TemplateFormData = {
        name: `${template.name} (Copy)`,
        type: template.type,
        subject: template.subject || '',
        content: template.content,
      };
      const newTemplate = await CommunicationTemplateService.createTemplate(duplicateData);
      setTemplates(prev => [newTemplate, ...prev]);
      toast({
        title: "Success",
        description: "Template duplicated successfully",
      });
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate template",
        variant: "destructive",
      });
    }
  };

  const insertVariable = (variable: string) => {
    const content = watchedContent || '';
    const newContent = content + (content ? ' ' : '') + variable;
    setValue('content', newContent);
  };

  const emailTemplates = templates.filter(t => t.type === 'email');
  const smsTemplates = templates.filter(t => t.type === 'sms');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Communication Templates</h2>
          <p className="text-muted-foreground">
            Create and manage reusable templates for emails and SMS messages
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) {
            setEditingTemplate(null);
            reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Template Name</Label>
                      <Input 
                        {...register('name', { required: true })}
                        placeholder="Enter template name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select onValueChange={(value) => setValue('type', value as any)} defaultValue="email">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {watch('type') === 'email' && (
                    <div>
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input 
                        {...register('subject')}
                        placeholder="Email subject (can include variables)"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      {...register('content', { required: true })}
                      placeholder="Template content (use variables like {{first_name}})"
                      rows={10}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating}>
                      {isCreating ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Available Variables
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {TEMPLATE_VARIABLES.map((variable) => (
                      <div key={variable.key} className="space-y-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs h-auto py-2"
                          onClick={() => insertVariable(variable.key)}
                        >
                          <span className="font-mono">{variable.key}</span>
                        </Button>
                        <p className="text-xs text-muted-foreground px-2">
                          {variable.description}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Templates ({emailTemplates.length})
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            SMS Templates ({smsTemplates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {emailTemplates.map((template) => (
              <Card key={template.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      {template.subject && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Subject: {template.subject}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Used {template.usage_count} times
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {template.content}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {emailTemplates.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No email templates yet. Create your first template to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sms" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {smsTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Used {template.usage_count} times
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.content}
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {smsTemplates.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No SMS templates yet. Create your first template to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Template Preview: {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Badge variant="outline" className="ml-2">
                  {previewTemplate.type}
                </Badge>
              </div>
              {previewTemplate.subject && (
                <div>
                  <Label>Subject</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded">
                    {previewTemplate.subject}
                  </p>
                </div>
              )}
              <div>
                <Label>Content</Label>
                <div className="text-sm mt-1 p-3 bg-muted rounded whitespace-pre-wrap">
                  {previewTemplate.content}
                </div>
              </div>
              <div>
                <Label>Variables Used</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {previewTemplate.variables?.map((variable, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                  {(!previewTemplate.variables || previewTemplate.variables.length === 0) && (
                    <p className="text-sm text-muted-foreground">No variables used</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}