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
import { MasterLeadStatus } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";

export const LeadStatusesConfiguration = () => {
  const [leadStatuses, setLeadStatuses] = useState<MasterLeadStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<MasterLeadStatus | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MasterLeadStatus>>({
    name: '',
    description: '',
    color: '#6B7280',
    stage: 'lead',
    is_active: true,
    order_index: 0,
    auto_transition_rules: {}
  });

  useEffect(() => {
    fetchLeadStatuses();
  }, []);

  const fetchLeadStatuses = async () => {
    try {
      const { data, error } = await supabase
        .from('master_lead_statuses')
        .select('*')
        .order('stage', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setLeadStatuses(data || []);
    } catch (error) {
      console.error('Error fetching lead statuses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lead statuses",
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
          description: "Status name is required",
          variant: "destructive"
        });
        return;
      }

      const statusData = {
        ...formData,
        user_id: user.id,
        name: formData.name.trim(),
        stage: formData.stage || 'lead'
      };

      if (editingStatus) {
        const { error } = await supabase
          .from('master_lead_statuses')
          .update(statusData)
          .eq('id', editingStatus.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_lead_statuses')
          .insert(statusData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Lead status ${editingStatus ? 'updated' : 'created'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingStatus(null);
      resetForm();
      fetchLeadStatuses();
    } catch (error) {
      console.error('Error saving lead status:', error);
      toast({
        title: "Error",
        description: "Failed to save lead status",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (status: MasterLeadStatus) => {
    setEditingStatus(status);
    setFormData(status);
    setIsModalOpen(true);
  };

  const handleDelete = async (status: MasterLeadStatus) => {
    if (!confirm('Are you sure you want to delete this lead status?')) return;

    try {
      const { error } = await supabase
        .from('master_lead_statuses')
        .delete()
        .eq('id', status.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead status deleted successfully"
      });
      fetchLeadStatuses();
    } catch (error) {
      console.error('Error deleting lead status:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead status",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#6B7280',
      stage: 'lead',
      is_active: true,
      order_index: 0,
      auto_transition_rules: {}
    });
  };

  const columns = [
    { key: 'name', label: 'Status Name', type: 'text' as const, sortable: true },
    { key: 'stage', label: 'Stage', type: 'badge' as const },
    { key: 'color', label: 'Color', type: 'color' as const },
    { key: 'order_index', label: 'Order', type: 'number' as const },
    { key: 'is_active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      <UniversalCRUDTable
        data={leadStatuses}
        columns={columns}
        loading={loading}
        onAdd={() => {
          resetForm();
          setEditingStatus(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search lead statuses..."
        emptyMessage="No lead statuses found. Add your first status to organize leads."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStatus ? 'Edit Lead Status' : 'Add New Lead Status'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Status Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Hot Lead"
              />
            </div>
            
            <div>
              <Label htmlFor="stage">Stage</Label>
              <Select 
                value={formData.stage || 'lead'} 
                onValueChange={(value) => setFormData({...formData, stage: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="applicant">Applicant</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color || '#6B7280'}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={formData.color || '#6B7280'}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  placeholder="#6B7280"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="order_index">Display Order</Label>
              <Input
                id="order_index"
                type="number"
                value={formData.order_index || 0}
                onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})}
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description of when to use this status..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Status</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingStatus ? 'Update' : 'Create'} Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};