import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { MasterTeam } from "@/types/masterData";

interface TeamSetupScreenProps {
  data: any;
  onComplete: (data: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

const TeamSetupScreen: React.FC<TeamSetupScreenProps> = ({
  data,
  onComplete,
  onNext,
  onSkip
}) => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<MasterTeam[]>(data?.teams || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<MasterTeam | null>(null);
  
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

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
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
        user_id: user.id,
        id: editingTeam?.id || `temp-${Date.now()}`
      };

      if (editingTeam) {
        // Update existing team
        const updatedTeams = teams.map(team => 
          team.id === editingTeam.id ? teamData as MasterTeam : team
        );
        setTeams(updatedTeams);
      } else {
        // Add new team
        setTeams([...teams, teamData as MasterTeam]);
      }

      toast({
        title: "Success",
        description: `Team ${editingTeam ? 'updated' : 'added'} successfully`
      });
      
      setIsModalOpen(false);
      setEditingTeam(null);
      resetForm();
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

  const handleDelete = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
    toast({
      title: "Success",
      description: "Team removed successfully"
    });
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

  const handleComplete = () => {
    onComplete({ teams });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Team Setup</h3>
        <p className="text-muted-foreground">
          Configure your teams and their specializations for optimal lead assignment.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Your Teams</CardTitle>
          <Button 
            onClick={() => {
              resetForm();
              setEditingTeam(null);
              setIsModalOpen(true);
            }}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Team
          </Button>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No teams configured yet.</p>
              <p className="text-sm text-muted-foreground">Add your first team to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teams.map((team) => (
                <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{team.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        team.type === 'internal' ? 'bg-blue-100 text-blue-800' :
                        team.type === 'external_recruiter' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {team.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{team.description}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      {team.region && <span>Region: {team.region}</span>}
                      <span>Max Daily: {team.max_daily_assignments}</span>
                      {team.contact_email && <span>Contact: {team.contact_email}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(team)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(team.id!)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onSkip}>
          Skip for Now
        </Button>
        <Button onClick={handleComplete}>
          Continue
        </Button>
      </div>

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
              {editingTeam ? 'Update' : 'Add'} Team
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamSetupScreen;