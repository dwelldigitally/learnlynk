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
import { MasterRequirement } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";

export const RequirementsConfiguration = () => {
  const [requirements, setRequirements] = useState<MasterRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<MasterRequirement | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MasterRequirement>>({
    name: '',
    type: 'academic',
    category: '',
    description: '',
    minimum_value: '',
    maximum_value: '',
    units: '',
    is_mandatory: true,
    applicable_programs: ['All Programs'],
    verification_method: '',
    documentation_required: [],
    is_active: true
  });

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      const { data, error } = await supabase
        .from('master_requirements')
        .select('*')
        .order('type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setRequirements(data || []);
    } catch (error) {
      console.error('Error fetching requirements:', error);
      toast({
        title: "Error",
        description: "Failed to fetch requirements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const requirementData = {
        ...formData,
        name: formData.name.trim(),
        type: formData.type || 'academic',
        user_id: user.id
      };

      if (editingRequirement) {
        const { error } = await supabase
          .from('master_requirements')
          .update(requirementData)
          .eq('id', editingRequirement.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_requirements')
          .insert(requirementData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Requirement ${editingRequirement ? 'updated' : 'created'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingRequirement(null);
      resetForm();
      fetchRequirements();
    } catch (error) {
      console.error('Error saving requirement:', error);
      toast({
        title: "Error",
        description: "Failed to save requirement",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (requirement: MasterRequirement) => {
    setEditingRequirement(requirement);
    setFormData(requirement);
    setIsModalOpen(true);
  };

  const handleDelete = async (requirement: MasterRequirement) => {
    if (!confirm('Are you sure you want to delete this requirement?')) return;

    try {
      const { error } = await supabase
        .from('master_requirements')
        .delete()
        .eq('id', requirement.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Requirement deleted successfully"
      });
      fetchRequirements();
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast({
        title: "Error",
        description: "Failed to delete requirement",
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
      minimum_value: '',
      maximum_value: '',
      units: '',
      is_mandatory: true,
      applicable_programs: ['All Programs'],
      verification_method: '',
      documentation_required: [],
      is_active: true
    });
  };

  const columns = [
    { key: 'name', label: 'Requirement Name', type: 'text' as const, sortable: true },
    { key: 'type', label: 'Type', type: 'badge' as const },
    { key: 'minimum_value', label: 'Min Value', type: 'text' as const },
    { key: 'maximum_value', label: 'Max Value', type: 'text' as const },
    { key: 'units', label: 'Units', type: 'text' as const },
    { key: 'is_mandatory', label: 'Mandatory', type: 'boolean' as const },
    { key: 'is_active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      <UniversalCRUDTable
        title="Entry Requirements"
        description="Configure academic and entry requirements for programs"
        data={requirements}
        columns={columns}
        loading={loading}
        onAdd={() => {
          resetForm();
          setEditingRequirement(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search requirements..."
        emptyMessage="No requirements found. Create your first entry requirement."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRequirement ? 'Edit Requirement' : 'Add New Requirement'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Requirement Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="IELTS Score"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Requirement Type</Label>
              <Select 
                value={formData.type || 'academic'} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="language">Language</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="age">Age</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="character">Character</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="minimum_value">Minimum Value</Label>
              <Input
                id="minimum_value"
                value={formData.minimum_value || ''}
                onChange={(e) => setFormData({...formData, minimum_value: e.target.value})}
                placeholder="6.0"
              />
            </div>

            <div>
              <Label htmlFor="maximum_value">Maximum Value</Label>
              <Input
                id="maximum_value"
                value={formData.maximum_value || ''}
                onChange={(e) => setFormData({...formData, maximum_value: e.target.value})}
                placeholder="9.0"
              />
            </div>

            <div>
              <Label htmlFor="units">Units</Label>
              <Input
                id="units"
                value={formData.units || ''}
                onChange={(e) => setFormData({...formData, units: e.target.value})}
                placeholder="Band Score, GPA, Years, etc."
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="English Proficiency, etc."
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Detailed description of the requirement..."
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="verification_method">Verification Method</Label>
              <Textarea
                id="verification_method"
                value={formData.verification_method || ''}
                onChange={(e) => setFormData({...formData, verification_method: e.target.value})}
                placeholder="How this requirement will be verified..."
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_mandatory"
                checked={formData.is_mandatory}
                onCheckedChange={(checked) => setFormData({...formData, is_mandatory: checked})}
              />
              <Label htmlFor="is_mandatory">Mandatory Requirement</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Requirement</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingRequirement ? 'Update' : 'Create'} Requirement
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};