import React, { useState, useEffect } from 'react';
import { UniversalCRUDTable } from '../UniversalCRUDTable';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { MasterDocumentTemplate } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";

export const DocumentTemplatesConfiguration = () => {
  const [templates, setTemplates] = useState<MasterDocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MasterDocumentTemplate | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MasterDocumentTemplate>>({
    name: '',
    type: 'academic',
    category: '',
    description: '',
    mandatory: false,
    accepted_formats: ['pdf'],
    max_size: 5,
    instructions: '',
    examples: [],
    applicable_programs: ['All Programs'],
    is_system_template: false,
    is_active: true,
    usage_count: 0
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('master_document_templates')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching document templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch document templates",
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

      // Validate required fields
      if (!formData.name?.trim()) {
        toast({
          title: "Error",
          description: "Document template name is required",
          variant: "destructive"
        });
        return;
      }

      const templateData = {
        ...formData,
        user_id: user.id,
        name: formData.name.trim(),
        type: formData.type || 'academic',
        stage: formData.stage || 'application' // Default stage value for database requirement
      };

      if (editingTemplate) {
        const { error } = await supabase
          .from('master_document_templates')
          .update(templateData)
          .eq('id', editingTemplate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_document_templates')
          .insert([templateData]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Document template ${editingTemplate ? 'updated' : 'created'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingTemplate(null);
      resetForm();
      fetchTemplates();
    } catch (error) {
      console.error('Error saving document template:', error);
      toast({
        title: "Error",
        description: "Failed to save document template",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (template: MasterDocumentTemplate) => {
    setEditingTemplate(template);
    setFormData(template);
    setIsModalOpen(true);
  };

  const handleDelete = async (template: MasterDocumentTemplate) => {
    if (!confirm('Are you sure you want to delete this document template?')) return;

    try {
      const { error } = await supabase
        .from('master_document_templates')
        .delete()
        .eq('id', template.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document template deleted successfully"
      });
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting document template:', error);
      toast({
        title: "Error",
        description: "Failed to delete document template",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'academic',
      category: '',
      description: '',
      mandatory: false,
      accepted_formats: ['pdf'],
      max_size: 5,
      instructions: '',
      examples: [],
      applicable_programs: ['All Programs'],
      is_system_template: false,
      is_active: true,
      usage_count: 0
    });
  };

  const columns = [
    { key: 'name', label: 'Document Name', type: 'text' as const, sortable: true },
    { key: 'type', label: 'Type', type: 'badge' as const },
    { key: 'mandatory', label: 'Mandatory', type: 'boolean' as const },
    { key: 'accepted_formats', label: 'Formats', type: 'array' as const },
    { key: 'max_size', label: 'Max Size (MB)', type: 'number' as const },
    { key: 'is_active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      <UniversalCRUDTable
        title="Document Templates"
        description="Manage document requirements and templates for different stages"
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
        searchPlaceholder="Search document templates..."
        emptyMessage="No document templates found. Create your first document requirement."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Document Template' : 'Add New Document Template'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Document Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Academic Transcript"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Document Type</Label>
              <Select 
                value={formData.type || 'academic'} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="identification">Identification</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="personal">Personal Statement</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Academic Records, etc."
              />
            </div>

            <div>
              <Label htmlFor="max_size">Max File Size (MB)</Label>
              <Input
                id="max_size"
                type="number"
                value={formData.max_size || 5}
                onChange={(e) => setFormData({...formData, max_size: parseInt(e.target.value) || 5})}
                placeholder="5"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Academic Records, etc."
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description of the document requirement..."
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions || ''}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                placeholder="Detailed instructions for students..."
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="mandatory"
                checked={formData.mandatory}
                onCheckedChange={(checked) => setFormData({...formData, mandatory: checked})}
              />
              <Label htmlFor="mandatory">Mandatory Document</Label>
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