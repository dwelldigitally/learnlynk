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
import { MasterMarketingSource } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";

export const MarketingSourcesConfiguration = () => {
  const [marketingSources, setMarketingSources] = useState<MasterMarketingSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<MasterMarketingSource | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MasterMarketingSource>>({
    name: '',
    category: 'digital',
    description: '',
    cost_per_lead: 0,
    conversion_rate: 0,
    is_active: true,
    tracking_parameters: {}
  });

  useEffect(() => {
    fetchMarketingSources();
  }, []);

  const fetchMarketingSources = async () => {
    try {
      const { data, error } = await supabase
        .from('master_marketing_sources')
        .select('*')
        .order('name');

      if (error) throw error;
      setMarketingSources(data || []);
    } catch (error) {
      console.error('Error fetching marketing sources:', error);
      toast({
        title: "Error",
        description: "Failed to fetch marketing sources",
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

      const sourceData = {
        ...formData,
        user_id: user.id
      };

      if (editingSource) {
        const { error } = await supabase
          .from('master_marketing_sources')
          .update(sourceData)
          .eq('id', editingSource.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_marketing_sources')
          .insert(sourceData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Marketing source ${editingSource ? 'updated' : 'created'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingSource(null);
      resetForm();
      fetchMarketingSources();
    } catch (error) {
      console.error('Error saving marketing source:', error);
      toast({
        title: "Error",
        description: "Failed to save marketing source",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (source: MasterMarketingSource) => {
    setEditingSource(source);
    setFormData(source);
    setIsModalOpen(true);
  };

  const handleDelete = async (source: MasterMarketingSource) => {
    if (!confirm('Are you sure you want to delete this marketing source?')) return;

    try {
      const { error } = await supabase
        .from('master_marketing_sources')
        .delete()
        .eq('id', source.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Marketing source deleted successfully"
      });
      fetchMarketingSources();
    } catch (error) {
      console.error('Error deleting marketing source:', error);
      toast({
        title: "Error",
        description: "Failed to delete marketing source",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'digital',
      description: '',
      cost_per_lead: 0,
      conversion_rate: 0,
      is_active: true,
      tracking_parameters: {}
    });
  };

  const columns = [
    { key: 'name', label: 'Source Name', type: 'text' as const, sortable: true },
    { key: 'category', label: 'Category', type: 'badge' as const },
    { key: 'cost_per_lead', label: 'Cost/Lead', type: 'number' as const },
    { key: 'conversion_rate', label: 'Conversion %', type: 'number' as const },
    { key: 'is_active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      <UniversalCRUDTable
        title="Marketing Sources"
        description="Track and manage lead generation sources and their performance"
        data={marketingSources}
        columns={columns}
        loading={loading}
        onAdd={() => {
          resetForm();
          setEditingSource(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search marketing sources..."
        emptyMessage="No marketing sources found. Add your first source to track lead generation."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSource ? 'Edit Marketing Source' : 'Add New Marketing Source'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Source Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Google Ads"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category || 'digital'} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">Digital Marketing</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="email">Email Marketing</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="organic">Organic Search</SelectItem>
                  <SelectItem value="print">Print Media</SelectItem>
                  <SelectItem value="radio">Radio</SelectItem>
                  <SelectItem value="tv">Television</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="direct">Direct Mail</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cost_per_lead">Cost Per Lead ($)</Label>
              <Input
                id="cost_per_lead"
                type="number"
                step="0.01"
                value={formData.cost_per_lead || 0}
                onChange={(e) => setFormData({...formData, cost_per_lead: parseFloat(e.target.value) || 0})}
                placeholder="25.50"
              />
            </div>

            <div>
              <Label htmlFor="conversion_rate">Conversion Rate (%)</Label>
              <Input
                id="conversion_rate"
                type="number"
                step="0.01"
                value={formData.conversion_rate || 0}
                onChange={(e) => setFormData({...formData, conversion_rate: parseFloat(e.target.value) || 0})}
                placeholder="12.5"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description of the marketing source..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Source</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingSource ? 'Update' : 'Create'} Source
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};