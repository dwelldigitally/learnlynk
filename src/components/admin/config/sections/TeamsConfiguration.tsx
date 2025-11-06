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
import { MasterTeam } from "@/types/masterData";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import TeamMembersList from "@/components/team/TeamMembersList";

export const TeamsConfiguration = () => {
  const [teams, setTeams] = useState<MasterTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<MasterTeam | null>(null);
  const [managingTeam, setManagingTeam] = useState<MasterTeam | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<MasterTeam>>({
    name: '',
    type: 'internal',
    description: '',
    specializations: [],
    region: '',
    max_daily_assignments: 50,
    working_hours: {},
    contact_email: '',
    contact_phone: '',
    is_active: true,
    performance_metrics: {}
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('master_teams')
        .select('*')
        .order('type', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        title: "Error",
        description: "Failed to fetch teams",
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

      const teamData = {
        ...formData,
        name: formData.name.trim(),
        type: formData.type || 'internal',
        user_id: user.id
      };

      if (editingTeam) {
        const { error } = await supabase
          .from('master_teams')
          .update(teamData)
          .eq('id', editingTeam.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('master_teams')
          .insert(teamData);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Team ${editingTeam ? 'updated' : 'created'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingTeam(null);
      resetForm();
      fetchTeams();
    } catch (error) {
      console.error('Error saving team:', error);
      toast({
        title: "Error",
        description: "Failed to save team",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (team: MasterTeam) => {
    setEditingTeam(team);
    setFormData(team);
    setIsModalOpen(true);
  };

  const handleDelete = async (team: MasterTeam) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      const { error } = await supabase
        .from('master_teams')
        .delete()
        .eq('id', team.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Team deleted successfully"
      });
      fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        title: "Error",
        description: "Failed to delete team",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'internal',
      description: '',
      specializations: [],
      region: '',
      max_daily_assignments: 50,
      working_hours: {},
      contact_email: '',
      contact_phone: '',
      is_active: true,
      performance_metrics: {}
    });
  };

  const columns = [
    { key: 'name', label: 'Team Name', type: 'text' as const, sortable: true },
    { key: 'type', label: 'Type', type: 'badge' as const },
    { key: 'region', label: 'Region', type: 'text' as const },
    { key: 'max_daily_assignments', label: 'Max Daily', type: 'number' as const },
    { key: 'specializations', label: 'Specializations', type: 'array' as const },
    { key: 'is_active', label: 'Active', type: 'boolean' as const }
  ];

  const customActions = [
    {
      id: 'manage-members',
      label: 'Manage Members',
      icon: Users,
      variant: 'outline' as const,
      onClick: (team: MasterTeam) => setManagingTeam(team)
    }
  ];

  return (
    <div className="space-y-6">
      <UniversalCRUDTable
        title="Team Management"
        description="Configure internal teams and external recruiter partnerships"
        data={teams}
        columns={columns}
        actions={customActions}
        loading={loading}
        onAdd={() => {
          resetForm();
          setEditingTeam(null);
          setIsModalOpen(true);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Search teams..."
        emptyMessage="No teams found. Create your first team configuration."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTeam ? 'Edit Team' : 'Add New Team'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Team Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Admissions Team"
              />
            </div>
            
            <div>
              <Label htmlFor="type">Team Type</Label>
              <Select 
                value={formData.type || 'internal'} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal Team</SelectItem>
                  <SelectItem value="external_recruiter">External Recruiter</SelectItem>
                  <SelectItem value="partner">Partner Organization</SelectItem>
                  <SelectItem value="contractor">Contractor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={formData.region || ''}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                placeholder="Asia Pacific"
              />
            </div>

            <div>
              <Label htmlFor="max_daily_assignments">Max Daily Assignments</Label>
              <Input
                id="max_daily_assignments"
                type="number"
                value={formData.max_daily_assignments || 50}
                onChange={(e) => setFormData({...formData, max_daily_assignments: parseInt(e.target.value) || 50})}
                placeholder="50"
              />
            </div>

            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email || ''}
                onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                placeholder="team@university.edu"
              />
            </div>

            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone || ''}
                onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Team description and responsibilities..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label htmlFor="is_active">Active Team</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingTeam ? 'Update' : 'Create'} Team
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!managingTeam} onOpenChange={() => setManagingTeam(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Team Members</DialogTitle>
          </DialogHeader>
          {managingTeam && (
            <TeamMembersList
              teamId={managingTeam.id}
              teamName={managingTeam.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};