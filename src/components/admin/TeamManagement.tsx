import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  UserPlus, 
  Shield, 
  Edit,
  Trash2,
  Mail,
  Phone,
  Users
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import MemberDetailModal from "./modals/MemberDetailModal";
import DepartmentMembersModal from "./modals/DepartmentMembersModal";
import PermissionManagementModal from "./modals/PermissionManagementModal";
import ConfirmDeleteDialog from "./modals/ConfirmDeleteDialog";
import InviteDetailsModal from "./modals/InviteDetailsModal";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  status: string;
  avatar: string;
  joinDate: string;
  studentsAssigned: number;
  lastActive: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface PendingInvite {
  id: string;
  email: string;
  role: string;
  department: string;
  sentDate: string;
  expiresDate: string;
  sentBy: string;
  message?: string;
}

const TeamManagement: React.FC = () => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [selectedInvite, setSelectedInvite] = useState<PendingInvite | null>(null);
  const [deleteItem, setDeleteItem] = useState<{type: string, id: string, name: string} | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    // Initialize team members data
    setTeamMembers([
      {
        id: "1",
        name: "Nicole Adams",
        email: "nicole.adams@wcc.ca",
        role: "Senior Admissions Advisor",
        department: "Admissions",
        permissions: ["student_management", "document_review", "communication"],
        status: "active",
        avatar: "/src/assets/advisor-nicole.jpg",
        joinDate: "2023-01-15",
        studentsAssigned: 85,
        lastActive: "2 hours ago"
      },
      {
        id: "2",
        name: "Robert Smith",
        email: "robert.smith@wcc.ca", 
        role: "Admissions Manager",
        department: "Admissions",
        permissions: ["all_permissions"],
        status: "active",
        avatar: "/src/assets/author-robert.jpg",
        joinDate: "2022-08-20",
        studentsAssigned: 0,
        lastActive: "1 hour ago"
      },
      {
        id: "3",
        name: "Sarah Kim",
        email: "sarah.kim@wcc.ca",
        role: "Financial Aid Coordinator", 
        department: "Finance",
        permissions: ["financial_management", "scholarship_management"],
        status: "active",
        avatar: "/src/assets/author-sarah.jpg",
        joinDate: "2023-03-10",
        studentsAssigned: 45,
        lastActive: "30 minutes ago"
      },
      {
        id: "4",
        name: "Ahmed Hassan",
        email: "ahmed.hassan@wcc.ca",
        role: "Marketing Coordinator",
        department: "Marketing",
        permissions: ["event_management", "communication"],
        status: "inactive",
        avatar: "/src/assets/author-ahmed.jpg",
        joinDate: "2023-06-01",
        studentsAssigned: 0,
        lastActive: "3 days ago"
      }
    ]);
  }, []);

  const departments = [
    {
      name: "Admissions",
      members: 3,
      description: "Handle student applications and enrollment process"
    },
    {
      name: "Finance", 
      members: 1,
      description: "Manage payments, scholarships, and financial aid"
    },
    {
      name: "Marketing",
      members: 1,
      description: "Handle events, communications, and promotion"
    },
    {
      name: "Academic",
      members: 0,
      description: "Program management and academic oversight"
    }
  ];

  const permissions: Permission[] = [
    { id: "student_management", name: "Student Management", description: "View and manage student profiles" },
    { id: "document_review", name: "Document Review", description: "Approve and reject documents" },
    { id: "program_management", name: "Program Management", description: "Manage programs and intakes" },
    { id: "event_management", name: "Event Management", description: "Create and manage events" },
    { id: "communication", name: "Communication", description: "Send messages and manage communications" },
    { id: "financial_management", name: "Financial Management", description: "View payments and financial data" },
    { id: "scholarship_management", name: "Scholarship Management", description: "Manage scholarships and awards" },
    { id: "team_management", name: "Team Management", description: "Invite and manage team members" },
    { id: "analytics", name: "Analytics", description: "View reports and analytics" },
    { id: "system_settings", name: "System Settings", description: "Configure system settings" }
  ];

  const pendingInvites: PendingInvite[] = [
    {
      id: "inv-1",
      email: "jane.doe@wcc.ca",
      role: "Admissions Advisor",
      department: "Admissions",
      sentDate: "2024-01-28",
      expiresDate: "2024-02-04",
      sentBy: "Robert Smith",
      message: "Welcome to the team! Looking forward to working with you."
    },
    {
      id: "inv-2",
      email: "alex.johnson@wcc.ca",
      role: "Marketing Assistant",
      department: "Marketing",
      sentDate: "2024-01-30",
      expiresDate: "2024-02-06",
      sentBy: "Nicole Adams"
    }
  ];

  // Event handlers
  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleDepartmentClick = (departmentName: string) => {
    setSelectedDepartment(departmentName);
  };

  const handlePermissionClick = (permission: Permission) => {
    setSelectedPermission(permission);
  };

  const handleInviteClick = (invite: PendingInvite) => {
    setSelectedInvite(invite);
  };

  const handleDeleteClick = (type: string, id: string, name: string) => {
    setDeleteItem({ type, id, name });
  };

  const handleUpdateMember = (memberId: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    ));
    toast({
      title: "Member Updated",
      description: "Team member details have been successfully updated.",
    });
  };

  const handleUpdateMemberPermissions = (memberId: string, permissions: string[]) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, permissions } : member
    ));
  };

  const handleDeleteConfirm = () => {
    if (!deleteItem) return;
    
    if (deleteItem.type === 'member') {
      setTeamMembers(prev => prev.filter(member => member.id !== deleteItem.id));
      toast({
        title: "Member Removed",
        description: `${deleteItem.name} has been removed from the team.`,
      });
    }
    
    setDeleteItem(null);
  };

  const handleResendInvite = async (inviteId: string, customMessage?: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Resending invite:', inviteId, customMessage);
  };

  const handleCancelInvite = (inviteId: string) => {
    console.log('Cancelling invite:', inviteId);
  };

  const getDepartmentMembers = (departmentName: string) => {
    return teamMembers.filter(member => member.department === departmentName);
  };

  const InviteTeamMemberDialog = () => (
    <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join the admin team.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input type="email" placeholder="colleague@wcc.ca" />
          </div>
          
          <div className="space-y-2">
            <Label>Role</Label>
            <Input placeholder="e.g., Admissions Advisor" />
          </div>
          
          <div className="space-y-2">
            <Label>Department</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admissions">Admissions</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowInviteDialog(false)}>
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Manage team members, roles, and permissions</p>
        </div>
        <Button onClick={() => setShowInviteDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Members", count: 5, icon: Users, color: "text-blue-600" },
          { title: "Active Users", count: 4, icon: Shield, color: "text-green-600" },
          { title: "Departments", count: 4, icon: Users, color: "text-purple-600" },
          { title: "Pending Invites", count: 2, icon: Mail, color: "text-orange-600" }
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.count}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="invites">Pending Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                       <Avatar 
                         className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                         onClick={() => handleMemberClick(member)}
                       >
                         <AvatarImage src={member.avatar} />
                         <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                       </Avatar>
                       <div>
                         <h3 
                           className="font-semibold cursor-pointer hover:text-primary transition-colors"
                           onClick={() => handleMemberClick(member)}
                         >
                           {member.name}
                         </h3>
                         <p className="text-sm text-muted-foreground">{member.role}</p>
                         <p 
                           className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                           onClick={() => handleDepartmentClick(member.department)}
                         >
                           {member.department}
                         </p>
                       </div>
                    </div>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </div>

                   <div className="mt-4 space-y-2">
                     <div 
                       className="flex items-center text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                       onClick={() => handleMemberClick(member)}
                     >
                       <Mail className="h-4 w-4 mr-2" />
                       {member.email}
                     </div>
                    {member.studentsAssigned > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {member.studentsAssigned} students assigned
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Last active: {member.lastActive}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Permissions:</p>
                     <div className="flex flex-wrap gap-1">
                       {member.permissions.slice(0, 3).map((permission) => (
                         <Badge 
                           key={permission} 
                           variant="outline" 
                           className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                           onClick={() => handleMemberClick(member)}
                         >
                           {permission.replace('_', ' ')}
                         </Badge>
                       ))}
                       {member.permissions.length > 3 && (
                         <Badge 
                           variant="outline" 
                           className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                           onClick={() => handleMemberClick(member)}
                         >
                           +{member.permissions.length - 3} more
                         </Badge>
                       )}
                     </div>
                  </div>

                   <div className="mt-4 flex space-x-2">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="flex-1"
                       onClick={() => handleMemberClick(member)}
                     >
                       <Edit className="h-4 w-4 mr-1" />
                       Edit
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => handleDeleteClick('member', member.id, member.name)}
                     >
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                    </div>
                    <Badge variant="outline">{dept.members} members</Badge>
                   </div>
                   <div className="mt-4">
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => handleDepartmentClick(dept.name)}
                     >
                       <Users className="h-4 w-4 mr-1" />
                       View Members
                     </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{permission.name}</h4>
                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                    </div>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => handlePermissionClick(permission)}
                     >
                       <Shield className="h-4 w-4 mr-1" />
                       Manage
                     </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invites">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 {pendingInvites.map((invite) => (
                   <div key={invite.id} className="flex items-center justify-between p-3 border rounded-lg">
                     <div 
                       className="cursor-pointer hover:bg-muted/50 transition-colors flex-1 p-2 rounded"
                       onClick={() => handleInviteClick(invite)}
                     >
                       <p className="font-medium">{invite.email}</p>
                       <p className="text-sm text-muted-foreground">
                         {invite.role} • Sent {invite.sentDate}
                       </p>
                     </div>
                     <div className="flex space-x-2">
                       <Button 
                         variant="outline" 
                         size="sm"
                         onClick={() => handleInviteClick(invite)}
                       >
                         Manage
                       </Button>
                     </div>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <InviteTeamMemberDialog />
      
      {/* Modals */}
      <MemberDetailModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
        permissions={permissions}
        departments={departments.map(d => d.name)}
        onUpdateMember={handleUpdateMember}
      />

      <DepartmentMembersModal
        isOpen={!!selectedDepartment}
        onClose={() => setSelectedDepartment("")}
        departmentName={selectedDepartment}
        members={getDepartmentMembers(selectedDepartment)}
        onMemberClick={handleMemberClick}
      />

      <PermissionManagementModal
        isOpen={!!selectedPermission}
        onClose={() => setSelectedPermission(null)}
        permission={selectedPermission}
        teamMembers={teamMembers}
        onUpdateMemberPermissions={handleUpdateMemberPermissions}
      />

      <InviteDetailsModal
        isOpen={!!selectedInvite}
        onClose={() => setSelectedInvite(null)}
        invite={selectedInvite}
        onResendInvite={handleResendInvite}
        onCancelInvite={handleCancelInvite}
      />

      <ConfirmDeleteDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteItem?.type || ''}`}
        description={`Are you sure you want to remove this ${deleteItem?.type}? This action cannot be undone.`}
        itemName={deleteItem?.name}
      />
    </div>
  );
};

export default TeamManagement;