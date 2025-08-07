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
import { MasterLeadPriority } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";

export const LeadPrioritiesConfiguration = () => {
  const [priorities, setPriorities] = useState<MasterLeadPriority[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPriority, setEditingPriority] = useState<MasterLeadPriority | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MasterLeadPriority>>({
    name: '',
    level: 3,
    color: '#6B7280',
    description: '',
    auto_assignment_rules: {},
    sla_hours: 24,
    is_active: true
  });

  useEffect(() => {
    fetchPriorities();
  }, []);

  const fetchPriorities = async () => {
    try {
      const { data, error } = await supabase
        .from('master_lead_priorities')
        .select('*')
        .order('level', { ascending: true });

      if (error) throw error;
      setPriorities(data || []);
    } catch (error) {
      console.error('Error fetching priorities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lead priorities",
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
          description: "Priority name is required",
          variant: "destructive"
        });
        return;
      }

      const priorityData = {
        ...formData,
        user_id: user.id,
        name: formData.name.trim(),
        level: formData.level || 3
      };

      if (editingPriority) {
        const { error } = await supabase
          .from('master_lead_priorities')
          .update(priorityData)
          .eq('id', editingPriority.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_lead_priorities')
          .insert(priorityData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Priority ${editingPriority ? 'updated' : 'created'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingPriority(null);
      resetForm();
      fetchPriorities();
    } catch (error) {
      console.error('Error saving priority:', error);
      toast({
        title: "Error",
        description: "Failed to save priority",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (priority: MasterLeadPriority) => {
    setEditingPriority(priority);
    setFormData(priority);
    setIsModalOpen(true);
  };

  const handleDelete = async (priority: MasterLeadPriority) => {
    if (!confirm('Are you sure you want to delete this priority?')) return;

    try {
      const { error } = await supabase
        .from('master_lead_priorities')
        .delete()
        .eq('id', priority.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Priority deleted successfully"
      });
      fetchPriorities();
    } catch (error) {
      console.error('Error deleting priority:', error);
      toast({
        title: "Error",
        description: "Failed to delete priority",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      level: 3,
      color: '#6B7280',
      description: '',
      auto_assignment_rules: {},
      sla_hours: 24,
      is_active: true
    });
  };

  const columns = [
    { key: 'name', label: 'Priority Name', type: 'text' as const, sortable: true },
    { key: 'level', label: 'Level', type: 'number' as const },
    { key: 'color', label: 'Color', type: 'color' as const },
    { key: 'sla_hours', label: 'SLA (Hours)', type: 'number' as const },
    { key: 'is_active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      <UniversalCRUDTable
        title="Lead Priorities"
        description="Configure priority levels and SLAs for lead management"
        data={priorities}
        columns={columns}
        loading={loading}
        onAdd={() => {
          resetForm();
          setEditingPriority(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search priorities..."
        emptyMessage="No priorities found. Create your first lead priority level."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPriority ? 'Edit Lead Priority' : 'Add New Lead Priority'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Priority Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Critical"
              />
            </div>
            
            <div>
              <Label htmlFor="level">Priority Level (1-5)</Label>
              <Select 
                value={String(formData.level || 3)} 
                onValueChange={(value) => setFormData({...formData, level: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Highest</SelectItem>
                  <SelectItem value="2">2 - High</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4 - Low</SelectItem>
                  <SelectItem value="5">5 - Lowest</SelectItem>
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
              <Label htmlFor="sla_hours">Response SLA (Hours)</Label>
              <Input
                id="sla_hours"
                type="number"
                value={formData.sla_hours || 24}
                onChange={(e) => setFormData({...formData, sla_hours: parseInt(e.target.value) || 24})}
                placeholder="24"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="When to use this priority level..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Priority</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingPriority ? 'Update' : 'Create'} Priority
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};