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
import { MasterNotificationFilter } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";

export const NotificationFiltersConfiguration = () => {
  const [filters, setFilters] = useState<MasterNotificationFilter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<MasterNotificationFilter | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MasterNotificationFilter>>({
    name: '',
    type: 'email',
    event_types: [],
    conditions: {},
    recipients: [],
    template_id: '',
    is_active: true,
    frequency: 'immediate'
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const { data, error } = await supabase
        .from('master_notification_filters')
        .select('*')
        .order('type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      // Type cast Json fields to proper types
      const typedData = (data || []).map(item => ({
        ...item,
        recipients: Array.isArray(item.recipients) ? item.recipients : [],
        conditions: item.conditions || {},
      }));
      setFilters(typedData);
    } catch (error) {
      console.error('Error fetching notification filters:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notification filters",
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

    if (!formData.type?.trim()) {
      toast({
        title: "Error",
        description: "Type is required", 
        variant: "destructive",
      });
      return;
    }

    if (!formData.event_types || formData.event_types.length === 0) {
      toast({
        title: "Error",
        description: "At least one event type is required",
        variant: "destructive", 
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const filterData = {
        ...formData,
        name: formData.name.trim(),
        type: formData.type.trim(),
        event_types: formData.event_types || [],
        recipients: formData.recipients || [],
        user_id: user.id
      };

      if (editingFilter) {
        const { error } = await supabase
          .from('master_notification_filters')
          .update(filterData)
          .eq('id', editingFilter.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_notification_filters')
          .insert(filterData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Notification filter ${editingFilter ? 'updated' : 'created'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingFilter(null);
      resetForm();
      fetchFilters();
    } catch (error) {
      console.error('Error saving notification filter:', error);
      toast({
        title: "Error",
        description: "Failed to save notification filter",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (filter: MasterNotificationFilter) => {
    setEditingFilter(filter);
    setFormData(filter);
    setIsModalOpen(true);
  };

  const handleDelete = async (filter: MasterNotificationFilter) => {
    if (!confirm('Are you sure you want to delete this notification filter?')) return;

    try {
      const { error } = await supabase
        .from('master_notification_filters')
        .delete()
        .eq('id', filter.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification filter deleted successfully"
      });
      fetchFilters();
    } catch (error) {
      console.error('Error deleting notification filter:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification filter",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'email',
      event_types: [],
      conditions: {},
      recipients: [],
      template_id: '',
      is_active: true,
      frequency: 'immediate'
    });
  };

  const columns = [
    { key: 'name', label: 'Filter Name', type: 'text' as const, sortable: true },
    { key: 'type', label: 'Type', type: 'badge' as const },
    { key: 'event_types', label: 'Events', type: 'array' as const },
    { key: 'frequency', label: 'Frequency', type: 'badge' as const },
    { key: 'is_active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      <UniversalCRUDTable
        title="Notification Filters"
        description="Configure notification rules and filters for different events"
        data={filters}
        columns={columns}
        loading={loading}
        onAdd={() => {
          resetForm();
          setEditingFilter(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search notification filters..."
        emptyMessage="No notification filters found. Create your first notification rule."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFilter ? 'Edit Notification Filter' : 'Add New Notification Filter'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Filter Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="New Lead Alert"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Notification Type</Label>
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
                  <SelectItem value="in_app">In-App</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="teams">Microsoft Teams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select 
                value={formData.frequency || 'immediate'} 
                onValueChange={(value) => setFormData({...formData, frequency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="template_id">Template ID</Label>
              <Input
                id="template_id"
                value={formData.template_id || ''}
                onChange={(e) => setFormData({...formData, template_id: e.target.value})}
                placeholder="template-123"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Filter</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingFilter ? 'Update' : 'Create'} Filter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};