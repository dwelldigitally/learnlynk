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
  Users,
  BarChart3,
  Calendar,
  Settings,
  Target,
  TrendingUp
} from "lucide-react";
import TeamHierarchyVisualizer from "./team/TeamHierarchyVisualizer";
import TeamPerformanceDashboard from "./team/TeamPerformanceDashboard";
import AdvancedRoleBuilder from "./team/AdvancedRoleBuilder";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import MemberDetailModal from "./modals/MemberDetailModal";
import DepartmentMembersModal from "./modals/DepartmentMembersModal";
import PermissionManagementModal from "./modals/PermissionManagementModal";
import ConfirmDeleteDialog from "./modals/ConfirmDeleteDialog";
import InviteDetailsModal from "./modals/InviteDetailsModal";
import { PageHeader } from '@/components/modern/PageHeader';
import { ModernCard } from '@/components/modern/ModernCard';
import { InfoBadge } from '@/components/modern/InfoBadge';
import { MetadataItem } from '@/components/modern/MetadataItem';

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
  const [activeTab, setActiveTab] = useState("overview");
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader
        title="Team Management"
        subtitle="Manage team members, roles, and permissions"
        action={
          <Button onClick={() => setShowInviteDialog(true)} size="lg">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        }
      />

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Members", count: 5, icon: Users, color: "text-primary" },
          { title: "Active Users", count: 4, icon: Shield, color: "text-primary" },
          { title: "Departments", count: 4, icon: Users, color: "text-primary" },
          { title: "Pending Invites", count: 2, icon: Mail, color: "text-primary" }
        ].map((stat, index) => (
          <ModernCard key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.count}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </ModernCard>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="roles">Role Builder</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModernCard>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Team Performance Overview</h3>
                </div>
                <div className="space-y-3">
                  <MetadataItem label="Overall Productivity" value="92%" />
                  <MetadataItem label="Team Satisfaction" value="89%" />
                  <MetadataItem label="Capacity Utilization" value="78%" />
                  <MetadataItem label="Average Response Time" value="1.2 hours" />
                </div>
              </CardContent>
            </ModernCard>

            <ModernCard>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Active Goals</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 border border-border rounded-lg bg-card">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Q1 Enrollment Target</span>
                      <InfoBadge variant="success">77%</InfoBadge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '77%' }}></div>
                    </div>
                  </div>
                  <div className="p-3 border border-border rounded-lg bg-card">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Lead Response Time</span>
                      <InfoBadge variant="success">89%</InfoBadge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </ModernCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="cursor-pointer" onClick={() => setActiveTab("hierarchy")}>
              <ModernCard>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Team Hierarchy</h3>
                  <p className="text-sm text-muted-foreground">Visualize and manage team structure</p>
                </CardContent>
              </ModernCard>
            </div>
            <div className="cursor-pointer" onClick={() => setActiveTab("performance")}>
              <ModernCard>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Performance Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track team productivity and KPIs</p>
                </CardContent>
              </ModernCard>
            </div>
            <div className="cursor-pointer" onClick={() => setActiveTab("roles")}>
              <ModernCard>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Role Builder</h3>
                  <p className="text-sm text-muted-foreground">Create custom roles and permissions</p>
                </CardContent>
              </ModernCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-4">
          <TeamHierarchyVisualizer
            onEditNode={(node) => toast({ title: "Edit Node", description: `Editing ${node.name}` })}
            onMoveNode={(nodeId, newParentId) => toast({ title: "Node Moved", description: "Team structure updated" })}
            onAddNode={(parentId) => toast({ title: "Add Node", description: "Adding new team member" })}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <TeamPerformanceDashboard />
        </TabsContent>


        <TabsContent value="roles" className="space-y-4">
          <AdvancedRoleBuilder />
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <ModernCard key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar 
                        className="h-12 w-12 cursor-pointer hover:ring-2 hover:ring-primary transition-all flex-shrink-0"
                        onClick={() => handleMemberClick(member)}
                      >
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-semibold text-base cursor-pointer hover:text-primary transition-colors mb-1"
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
                        <div className="mt-2">
                          <InfoBadge variant={member.status === 'active' ? 'success' : 'secondary'}>
                            {member.status.toUpperCase()}
                          </InfoBadge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border">
                    <MetadataItem label="Email" value={member.email} />
                    {member.studentsAssigned > 0 && (
                      <MetadataItem label="Students" value={`${member.studentsAssigned} assigned`} />
                    )}
                    <MetadataItem label="Last Active" value={member.lastActive} />
                  </div>

                  <div className="pt-4 border-t border-border mt-4">
                    <p className="text-sm font-medium mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {member.permissions.slice(0, 3).map((permission) => (
                        <Badge 
                          key={permission} 
                          variant="secondary" 
                          className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleMemberClick(member)}
                        >
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                      {member.permissions.length > 3 && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => handleMemberClick(member)}
                        >
                          +{member.permissions.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pt-4 border-t border-border mt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleMemberClick(member)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick('member', member.id, member.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </ModernCard>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept, index) => (
              <ModernCard key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-base">{dept.name}</h3>
                        <InfoBadge variant="secondary">{dept.members} members</InfoBadge>
                      </div>
                      <p className="text-sm text-muted-foreground">{dept.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => handleDepartmentClick(dept.name)}
                  >
                    <Users className="h-4 w-4 mr-1" />
                    View Members
                  </Button>
                </CardContent>
              </ModernCard>
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