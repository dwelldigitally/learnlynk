import React, { useState, useEffect } from 'react';
import { UniversalCRUDTable } from '../UniversalCRUDTable';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { MasterCallType } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";

export const CallTypesConfiguration = () => {
  const [callTypes, setCallTypes] = useState<MasterCallType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCallType, setEditingCallType] = useState<MasterCallType | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MasterCallType>>({
    name: '',
    description: '',
    duration_estimate: 15,
    follow_up_required: false,
    template_notes: '',
    is_active: true
  });

  useEffect(() => {
    fetchCallTypes();
  }, []);

  const fetchCallTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('master_call_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setCallTypes(data || []);
    } catch (error) {
      console.error('Error fetching call types:', error);
      toast({
        title: "Error",
        description: "Failed to fetch call types",
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
          description: "Call type name is required",
          variant: "destructive"
        });
        return;
      }

      const callTypeData = {
        ...formData,
        user_id: user.id,
        name: formData.name.trim()
      };

      if (editingCallType) {
        const { error } = await supabase
          .from('master_call_types')
          .update(callTypeData)
          .eq('id', editingCallType.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_call_types')
          .insert(callTypeData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Call type ${editingCallType ? 'updated' : 'created'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingCallType(null);
      resetForm();
      fetchCallTypes();
    } catch (error) {
      console.error('Error saving call type:', error);
      toast({
        title: "Error",
        description: "Failed to save call type",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (callType: MasterCallType) => {
    setEditingCallType(callType);
    setFormData(callType);
    setIsModalOpen(true);
  };

  const handleDelete = async (callType: MasterCallType) => {
    if (!confirm('Are you sure you want to delete this call type?')) return;

    try {
      const { error } = await supabase
        .from('master_call_types')
        .delete()
        .eq('id', callType.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Call type deleted successfully"
      });
      fetchCallTypes();
    } catch (error) {
      console.error('Error deleting call type:', error);
      toast({
        title: "Error",
        description: "Failed to delete call type",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration_estimate: 15,
      follow_up_required: false,
      template_notes: '',
      is_active: true
    });
  };

  const columns = [
    { key: 'name', label: 'Call Type', type: 'text' as const, sortable: true },
    { key: 'duration_estimate', label: 'Duration (min)', type: 'number' as const },
    { key: 'follow_up_required', label: 'Follow-up', type: 'boolean' as const },
    { key: 'is_active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      <UniversalCRUDTable
        title="Call Types"
        description="Configure call categories and templates for consistent communication"
        data={callTypes}
        columns={columns}
        loading={loading}
        onAdd={() => {
          resetForm();
          setEditingCallType(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search call types..."
        emptyMessage="No call types found. Add your first call type to standardize communications."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCallType ? 'Edit Call Type' : 'Add New Call Type'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Call Type Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Initial Consultation"
              />
            </div>
            
            <div>
              <Label htmlFor="duration_estimate">Estimated Duration (minutes)</Label>
              <Input
                id="duration_estimate"
                type="number"
                value={formData.duration_estimate || 15}
                onChange={(e) => setFormData({...formData, duration_estimate: parseInt(e.target.value) || 15})}
                placeholder="15"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Purpose and goals of this call type..."
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="template_notes">Template Notes</Label>
              <Textarea
                id="template_notes"
                value={formData.template_notes || ''}
                onChange={(e) => setFormData({...formData, template_notes: e.target.value})}
                placeholder="Standard notes template for this call type..."
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="follow_up_required"
                checked={formData.follow_up_required}
                onCheckedChange={(checked) => setFormData({...formData, follow_up_required: checked})}
              />
              <Label htmlFor="follow_up_required">Follow-up Required</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Call Type</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCallType ? 'Update' : 'Create'} Call Type
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};