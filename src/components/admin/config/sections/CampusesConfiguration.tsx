import React, { useState, useEffect } from 'react';
import { UniversalCRUDTable } from '../UniversalCRUDTable';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { MasterCampus } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";

export const CampusesConfiguration = () => {
  const [campuses, setCampuses] = useState<MasterCampus[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<MasterCampus | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MasterCampus>>({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    timezone: 'UTC',
    is_active: true,
    capacity: 0,
    facilities: []
  });

  useEffect(() => {
    fetchCampuses();
  }, []);

  const fetchCampuses = async () => {
    try {
      const { data, error } = await supabase
        .from('master_campuses')
        .select('*')
        .order('name');

      if (error) throw error;
      setCampuses(data || []);
    } catch (error) {
      console.error('Error fetching campuses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campuses",
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

      const campusData = {
        ...formData,
        user_id: user.id
      };

      if (editingCampus) {
        const { error } = await supabase
          .from('master_campuses')
          .update(campusData)
          .eq('id', editingCampus.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_campuses')
          .insert(campusData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Campus ${editingCampus ? 'updated' : 'created'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingCampus(null);
      resetForm();
      fetchCampuses();
    } catch (error) {
      console.error('Error saving campus:', error);
      toast({
        title: "Error",
        description: "Failed to save campus",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (campus: MasterCampus) => {
    setEditingCampus(campus);
    setFormData(campus);
    setIsModalOpen(true);
  };

  const handleDelete = async (campus: MasterCampus) => {
    if (!confirm('Are you sure you want to delete this campus?')) return;

    try {
      const { error } = await supabase
        .from('master_campuses')
        .delete()
        .eq('id', campus.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campus deleted successfully"
      });
      fetchCampuses();
    } catch (error) {
      console.error('Error deleting campus:', error);
      toast({
        title: "Error",
        description: "Failed to delete campus",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      phone: '',
      email: '',
      website: '',
      timezone: 'UTC',
      is_active: true,
      capacity: 0,
      facilities: []
    });
  };

  const columns = [
    { key: 'name', label: 'Campus Name', type: 'text' as const, sortable: true },
    { key: 'code', label: 'Code', type: 'text' as const },
    { key: 'city', label: 'City', type: 'text' as const },
    { key: 'state', label: 'State', type: 'text' as const },
    { key: 'country', label: 'Country', type: 'text' as const },
    { key: 'capacity', label: 'Capacity', type: 'number' as const },
    { key: 'facilities', label: 'Facilities', type: 'array' as const },
    { key: 'is_active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      <UniversalCRUDTable
        title="Campus Locations"
        description="Manage your institution's campus locations and facilities"
        data={campuses}
        columns={columns}
        loading={loading}
        onAdd={() => {
          resetForm();
          setEditingCampus(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search campuses..."
        emptyMessage="No campuses found. Add your first campus location."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCampus ? 'Edit Campus' : 'Add New Campus'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Campus Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Main Campus"
              />
            </div>
            
            <div>
              <Label htmlFor="code">Campus Code</Label>
              <Input
                id="code"
                value={formData.code || ''}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="MC"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123 University Avenue"
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Sydney"
              />
            </div>

            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state || ''}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                placeholder="NSW"
              />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country || ''}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="Australia"
              />
            </div>

            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={formData.postal_code || ''}
                onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                placeholder="2000"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+61 2 1234 5678"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="campus@university.edu"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website || ''}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="https://campus.university.edu"
              />
            </div>

            <div>
              <Label htmlFor="capacity">Student Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || 0}
                onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                placeholder="5000"
              />
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone || 'UTC'}
                onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                placeholder="Australia/Sydney"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Campus</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCampus ? 'Update' : 'Create'} Campus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};