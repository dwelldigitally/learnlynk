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

const TeamManagement: React.FC = () => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const teamMembers = [
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
  ];

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

  const permissions = [
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
    <div className="space-y-6">
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
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <p className="text-sm text-muted-foreground">{member.department}</p>
                      </div>
                    </div>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
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
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                      {member.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
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
                    <Button variant="outline" size="sm">
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
                    <Button variant="outline" size="sm">
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
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">jane.doe@wcc.ca</p>
                    <p className="text-sm text-muted-foreground">Admissions Advisor • Sent 3 days ago</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Resend</Button>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">alex.johnson@wcc.ca</p>
                    <p className="text-sm text-muted-foreground">Marketing Assistant • Sent 1 day ago</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Resend</Button>
                    <Button variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <InviteTeamMemberDialog />
    </div>
  );
};

export default TeamManagement;