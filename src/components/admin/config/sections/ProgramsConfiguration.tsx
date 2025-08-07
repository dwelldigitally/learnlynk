import React, { useState, useEffect } from 'react';
import { UniversalCRUDTable } from '../UniversalCRUDTable';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { MasterProgram } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";

export const ProgramsConfiguration = () => {
  const [programs, setPrograms] = useState<MasterProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<MasterProgram | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MasterProgram>>({
    name: '',
    code: '',
    description: '',
    type: 'undergraduate',
    duration: '',
    campus: '',
    delivery_method: 'on-campus',
    status: 'active',
    color: '#3B82F6',
    category: '',
    tags: [],
    is_active: true
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('master_programs')
        .select('*')
        .order('name');

      if (error) throw error;
      // Type cast Json fields to proper types
      const typedData = (data || []).map(item => ({
        ...item,
        entry_requirements: Array.isArray(item.entry_requirements) ? item.entry_requirements : [],
        document_requirements: Array.isArray(item.document_requirements) ? item.document_requirements : [],
        fee_structure: item.fee_structure || {},
      }));
      setPrograms(typedData);
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch programs",
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

    if (!formData.code?.trim()) {
      toast({
        title: "Error",
        description: "Code is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const programData = {
        ...formData,
        name: formData.name.trim(),
        code: formData.code.trim(),
        entry_requirements: formData.entry_requirements || [],
        document_requirements: formData.document_requirements || [],
        fee_structure: formData.fee_structure || {},
        user_id: user.id
      };

      if (editingProgram) {
        const { error } = await supabase
          .from('master_programs')
          .update(programData)
          .eq('id', editingProgram.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_programs')
          .insert(programData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Program ${editingProgram ? 'updated' : 'created'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingProgram(null);
      resetForm();
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
      toast({
        title: "Error",
        description: "Failed to save program",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (program: MasterProgram) => {
    setEditingProgram(program);
    setFormData(program);
    setIsModalOpen(true);
  };

  const handleDelete = async (program: MasterProgram) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      const { error } = await supabase
        .from('master_programs')
        .delete()
        .eq('id', program.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Program deleted successfully"
      });
      fetchPrograms();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive"
      });
    }
  };

  const handleDuplicate = (program: MasterProgram) => {
    const duplicatedProgram = {
      ...program,
      name: `${program.name} (Copy)`,
      id: undefined,
      created_at: undefined,
      updated_at: undefined
    };
    setFormData(duplicatedProgram);
    setEditingProgram(null);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      type: 'undergraduate',
      duration: '',
      campus: '',
      delivery_method: 'on-campus',
      status: 'active',
      color: '#3B82F6',
      category: '',
      tags: [],
      is_active: true
    });
  };

  const columns = [
    { key: 'name', label: 'Program Name', type: 'text' as const, sortable: true },
    { key: 'code', label: 'Code', type: 'text' as const },
    { key: 'type', label: 'Type', type: 'badge' as const },
    { key: 'duration', label: 'Duration', type: 'text' as const },
    { key: 'campus', label: 'Campus', type: 'text' as const },
    { key: 'delivery_method', label: 'Delivery', type: 'badge' as const },
    { key: 'status', label: 'Status', type: 'badge' as const },
    { key: 'is_active', label: 'Active', type: 'boolean' as const }
  ];

  return (
    <div className="space-y-6">
      <UniversalCRUDTable
        title="Academic Programs"
        description="Manage academic programs offered by your institution"
        data={programs}
        columns={columns}
        loading={loading}
        onAdd={() => {
          resetForm();
          setEditingProgram(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        searchPlaceholder="Search programs..."
        emptyMessage="No programs found. Add your first program to get started."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProgram ? 'Edit Program' : 'Add New Program'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Program Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Bachelor of Science in Computer Science"
              />
            </div>
            
            <div>
              <Label htmlFor="code">Program Code</Label>
              <Input
                id="code"
                value={formData.code || ''}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                placeholder="BSC-CS"
              />
            </div>

            <div>
              <Label htmlFor="type">Program Type</Label>
              <Select 
                value={formData.type || 'undergraduate'} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="vocational">Vocational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration || ''}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="4 years"
              />
            </div>

            <div>
              <Label htmlFor="campus">Campus</Label>
              <Input
                id="campus"
                value={formData.campus || ''}
                onChange={(e) => setFormData({...formData, campus: e.target.value})}
                placeholder="Main Campus"
              />
            </div>

            <div>
              <Label htmlFor="delivery_method">Delivery Method</Label>
              <Select 
                value={formData.delivery_method || 'on-campus'} 
                onValueChange={(value) => setFormData({...formData, delivery_method: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-campus">On Campus</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="distance">Distance Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status || 'active'} 
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Science & Technology"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Program description..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Program</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingProgram ? 'Update' : 'Create'} Program
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};