import React, { useState, useEffect } from 'react';
import { UniversalCRUDTable } from '../UniversalCRUDTable';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { MasterCommunicationTemplate } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";

export const CommunicationTemplatesConfiguration = () => {
  const [templates, setTemplates] = useState<MasterCommunicationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MasterCommunicationTemplate | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MasterCommunicationTemplate>>({
    name: '',
    type: 'email',
    category: '',
    subject: '',
    content: '',
    variables: {},
    conditional_logic: {},
    is_system_template: false,
    is_active: true,
    usage_count: 0,
    tags: []
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('master_communication_templates')
        .select('*')
        .order('type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch communication templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const templateData = {
        ...formData,
        user_id: user.id
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('master_communication_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_communication_templates')
          .insert(templateData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Template ${editingTemplate ? 'updated' : 'created'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingTemplate(null);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (template: MasterCommunicationTemplate) => {
    setEditingTemplate(template);
    setFormData(template);
    setIsModalOpen(true);
  };

  const handleDelete = async (template: MasterCommunicationTemplate) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const { error } = await supabase
        .from('master_communication_templates')
        .delete()
        .eq('id', template.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template deleted successfully"
      });
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'email',
      category: '',
      subject: '',
      content: '',
      variables: {},
      conditional_logic: {},
      is_system_template: false,
      is_active: true,
      usage_count: 0,
      tags: []
    });
  };

  const columns = [
    { key: 'name', label: 'Template Name', type: 'text' as const, sortable: true },
    { key: 'type', label: 'Type', type: 'badge' as const },
    { key: 'category', label: 'Category', type: 'text' as const },
    { key: 'usage_count', label: 'Usage', type: 'number' as const },
    { key: 'tags', label: 'Tags', type: 'array' as const },
    { key: 'is_active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      <UniversalCRUDTable
        title="Communication Templates"
        description="Manage email, SMS, and meeting templates for consistent communication"
        data={templates}
        columns={columns}
        loading={loading}
        onAdd={() => {
          resetForm();
          setEditingTemplate(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search templates..."
        emptyMessage="No templates found. Create your first communication template."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Communication Template' : 'Add New Communication Template'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Welcome Email Template"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Communication Type</Label>
              <Select 
                value={formData.type || 'email'} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="call">Call Script</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Onboarding, Follow-up, etc."
              />
            </div>

            {(formData.type === 'email' || formData.type === 'letter') && (
              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  placeholder="Welcome to {{program_name}}"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Template content with {{variables}}..."
                rows={8}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use {{variable_name}} for dynamic content
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_system_template"
                checked={formData.is_system_template}
                onCheckedChange={(checked) => setFormData({...formData, is_system_template: checked})}
              />
              <Label htmlFor="is_system_template">System Template</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Template</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingTemplate ? 'Update' : 'Create'} Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};