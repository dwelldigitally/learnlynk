import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { UniversalCRUDTable } from "../UniversalCRUDTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { TeamManagement } from "../../routing/TeamManagement";

export const RoutingConfiguration = () => {
  const [routingRules, setRoutingRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    conditions: [],
    assignment_config: {},
    is_active: true,
    priority: 0
  });

  useEffect(() => {
    fetchRoutingRules();
  }, []);

  const fetchRoutingRules = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lead_routing_rules')
        .select('*')
        .order('priority', { ascending: false });

      if (error) throw error;
      setRoutingRules(data || []);
    } catch (error) {
      console.error('Error fetching routing rules:', error);
      toast.error('Failed to load routing rules');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error('Rule name is required');
        return;
      }

      const payload = {
        ...formData,
        conditions: formData.conditions || [],
        assignment_config: formData.assignment_config || {}
      };

      if (editingRule) {
        const { error } = await supabase
          .from('lead_routing_rules')
          .update(payload)
          .eq('id', editingRule.id);

        if (error) throw error;
        toast.success('Routing rule updated successfully');
      } else {
        const { error } = await supabase
          .from('lead_routing_rules')
          .insert([payload]);

        if (error) throw error;
        toast.success('Routing rule created successfully');
      }

      setIsModalOpen(false);
      resetForm();
      fetchRoutingRules();
    } catch (error) {
      console.error('Error saving routing rule:', error);
      toast.error('Failed to save routing rule');
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name || '',
      description: rule.description || '',
      conditions: rule.conditions || [],
      assignment_config: rule.assignment_config || {},
      is_active: rule.is_active,
      priority: rule.priority || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this routing rule?')) return;

    try {
      const { error } = await supabase
        .from('lead_routing_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Routing rule deleted successfully');
      fetchRoutingRules();
    } catch (error) {
      console.error('Error deleting routing rule:', error);
      toast.error('Failed to delete routing rule');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      conditions: [],
      assignment_config: {},
      is_active: true,
      priority: 0
    });
    setEditingRule(null);
  };

  const columns = [
    { key: 'name', label: 'Rule Name', type: 'text' as const, sortable: true },
    { key: 'description', label: 'Description', type: 'text' as const },
    { key: 'priority', label: 'Priority', type: 'number' as const, sortable: true },
    { key: 'is_active', label: 'Status', type: 'boolean' as const, sortable: true }
  ];

  return (
    <div className="space-y-6">
      {/* Lead Routing Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Routing Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <UniversalCRUDTable
            data={routingRules}
            columns={columns}
            loading={loading}
            onAdd={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showSearch={true}
          />

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingRule ? 'Edit Routing Rule' : 'Create Routing Rule'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Rule Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter rule name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this routing rule"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingRule ? 'Update' : 'Create'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card>
        <CardHeader>
          <CardTitle>Team Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <TeamManagement />
        </CardContent>
      </Card>
    </div>
  );
};