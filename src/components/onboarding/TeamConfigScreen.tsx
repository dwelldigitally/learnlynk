
import React, { useState } from "react";
import { Check, Plus, User } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  schedule: string;
  tier: string;
  maxLeads: number;
  leadFrequency: string;
  workingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

const TeamConfigScreen: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { 
      id: "1", 
      name: "John Smith", 
      role: "Sales Rep", 
      schedule: "Full-time", 
      tier: "Tier A",
      maxLeads: 20,
      leadFrequency: "Weekly",
      workingDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      }
    },
    { 
      id: "2", 
      name: "Amy Wilson", 
      role: "Sales Rep", 
      schedule: "Part-time", 
      tier: "Tier B",
      maxLeads: 12,
      leadFrequency: "Weekly",
      workingDays: {
        monday: true,
        tuesday: true,
        wednesday: false,
        thursday: true,
        friday: false,
        saturday: false,
        sunday: false
      }
    },
    { 
      id: "3", 
      name: "Mike Lee", 
      role: "Sales Rep", 
      schedule: "Full-time", 
      tier: "Tier A",
      maxLeads: 25,
      leadFrequency: "Weekly",
      workingDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      }
    }
  ]);
  
  const [teamSettings, setTeamSettings] = useState({
    maxLeadsPerTeam: 80,
    leadFrequency: "Weekly"
  });
  
  const [newMember, setNewMember] = useState<Omit<TeamMember, 'id'>>({
    name: "",
    role: "Sales Rep",
    schedule: "Full-time",
    tier: "Tier B",
    maxLeads: 15,
    leadFrequency: "Weekly",
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    }
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddMember = () => {
    const id = Math.random().toString(36).substring(7);
    setTeamMembers([...teamMembers, { id, ...newMember }]);
    setNewMember({
      name: "",
      role: "Sales Rep",
      schedule: "Full-time",
      tier: "Tier B",
      maxLeads: 15,
      leadFrequency: "Weekly",
      workingDays: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      }
    });
    setIsDialogOpen(false);
  };
  
  const handleTeamSettingChange = (setting: string, value: string | number) => {
    setTeamSettings({
      ...teamSettings,
      [setting]: value
    });
  };
  
  const handleMemberChange = (id: string, field: keyof TeamMember, value: string | number | any) => {
    setTeamMembers(
      teamMembers.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    );
  };

  const handleWorkingDayChange = (id: string, day: string, checked: boolean) => {
    setTeamMembers(
      teamMembers.map(member => 
        member.id === id ? { 
          ...member, 
          workingDays: {
            ...member.workingDays,
            [day]: checked
          } 
        } : member
      )
    );
  };

  const handleNewMemberWorkingDayChange = (day: string, checked: boolean) => {
    setNewMember({
      ...newMember,
      workingDays: {
        ...newMember.workingDays,
        [day]: checked
      }
    });
  };

  return (
    <div className="slide-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Configure Your Team
        </h1>
        <p className="text-saas-gray-medium">
          Set up your sales team structure and lead assignment preferences
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Team Members</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={newMember.name} 
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    placeholder="Enter name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={newMember.role} 
                      onValueChange={(value) => setNewMember({...newMember, role: value})}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sales Rep">Sales Rep</SelectItem>
                        <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                        <SelectItem value="Account Executive">Account Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="schedule">Schedule</Label>
                    <Select 
                      value={newMember.schedule} 
                      onValueChange={(value) => setNewMember({...newMember, schedule: value})}
                    >
                      <SelectTrigger id="schedule">
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tier">Performance Tier</Label>
                    <Select 
                      value={newMember.tier} 
                      onValueChange={(value) => setNewMember({...newMember, tier: value})}
                    >
                      <SelectTrigger id="tier">
                        <SelectValue placeholder="Select tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tier A">Tier A</SelectItem>
                        <SelectItem value="Tier B">Tier B</SelectItem>
                        <SelectItem value="Tier C">Tier C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxLeads">Max Leads</Label>
                    <Input 
                      id="maxLeads" 
                      type="number" 
                      value={newMember.maxLeads} 
                      onChange={(e) => setNewMember({...newMember, maxLeads: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium mb-2 block">Working Days</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { day: "monday", label: "Mon" },
                      { day: "tuesday", label: "Tue" },
                      { day: "wednesday", label: "Wed" },
                      { day: "thursday", label: "Thu" },
                      { day: "friday", label: "Fri" },
                      { day: "saturday", label: "Sat" },
                      { day: "sunday", label: "Sun" },
                    ].map(({ day, label }) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`new-${day}`} 
                          checked={newMember.workingDays[day as keyof typeof newMember.workingDays]} 
                          onCheckedChange={(checked) => 
                            handleNewMemberWorkingDayChange(day, checked === true)
                          }
                        />
                        <Label htmlFor={`new-${day}`} className="text-sm">{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button onClick={handleAddMember} className="w-full">
                  Add Team Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-3">
          {teamMembers.map(member => (
            <div key={member.id} className="bg-saas-gray-light p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-saas-blue rounded-full flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {member.role}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {member.tier}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor={`schedule-${member.id}`} className="text-xs block mb-1">Schedule</Label>
                  <Select 
                    value={member.schedule} 
                    onValueChange={(value) => handleMemberChange(member.id, 'schedule', value)}
                  >
                    <SelectTrigger id={`schedule-${member.id}`} className="h-8 text-sm">
                      <SelectValue placeholder="Schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`tier-${member.id}`} className="text-xs block mb-1">Performance Tier</Label>
                  <Select 
                    value={member.tier} 
                    onValueChange={(value) => handleMemberChange(member.id, 'tier', value)}
                  >
                    <SelectTrigger id={`tier-${member.id}`} className="h-8 text-sm">
                      <SelectValue placeholder="Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tier A">Tier A</SelectItem>
                      <SelectItem value="Tier B">Tier B</SelectItem>
                      <SelectItem value="Tier C">Tier C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`maxLeads-${member.id}`} className="text-xs block mb-1">
                    Max Leads
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input 
                      id={`maxLeads-${member.id}`}
                      type="number"
                      className="h-8 text-sm"
                      value={member.maxLeads}
                      onChange={(e) => handleMemberChange(member.id, 'maxLeads', parseInt(e.target.value))}
                    />
                    <Select 
                      value={member.leadFrequency}
                      onValueChange={(value) => handleMemberChange(member.id, 'leadFrequency', value)}
                    >
                      <SelectTrigger className="h-8 text-sm w-24">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Label className="text-xs block mb-2">Working Days</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { day: "monday", label: "Mon" },
                    { day: "tuesday", label: "Tue" },
                    { day: "wednesday", label: "Wed" },
                    { day: "thursday", label: "Thu" },
                    { day: "friday", label: "Fri" },
                    { day: "saturday", label: "Sat" },
                    { day: "sunday", label: "Sun" },
                  ].map(({ day, label }) => (
                    <div key={day} className="flex items-center space-x-1">
                      <Checkbox 
                        id={`${member.id}-${day}`}
                        checked={member.workingDays[day as keyof typeof member.workingDays]} 
                        onCheckedChange={(checked) => 
                          handleWorkingDayChange(member.id, day, checked === true)
                        }
                      />
                      <Label htmlFor={`${member.id}-${day}`} className="text-xs">{label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-saas-gray-light p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-medium mb-4">Team-wide Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="maxLeadsTeam" className="block mb-2">Maximum Team Lead Capacity</Label>
            <div className="flex items-center space-x-2">
              <Input 
                id="maxLeadsTeam" 
                type="number" 
                value={teamSettings.maxLeadsPerTeam}
                onChange={(e) => handleTeamSettingChange('maxLeadsPerTeam', parseInt(e.target.value))}
              />
              <Select 
                value={teamSettings.leadFrequency}
                onValueChange={(value) => handleTeamSettingChange('leadFrequency', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-saas-gray-medium">
        <p><strong>Note:</strong> These settings will be used to optimize the AI-driven lead assignment for your team. You can modify these settings at any time from your dashboard.</p>
      </div>
    </div>
  );
};

export default TeamConfigScreen;
