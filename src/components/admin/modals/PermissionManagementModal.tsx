import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Users, User } from "lucide-react";

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

interface PermissionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission: Permission | null;
  teamMembers: TeamMember[];
  onUpdateMemberPermissions: (memberId: string, permissions: string[]) => void;
}

const PermissionManagementModal: React.FC<PermissionManagementModalProps> = ({
  isOpen,
  onClose,
  permission,
  teamMembers,
  onUpdateMemberPermissions
}) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  React.useEffect(() => {
    if (permission) {
      const membersWithPermission = teamMembers
        .filter(member => member.permissions.includes(permission.id))
        .map(member => member.id);
      setSelectedMembers(membersWithPermission);
    }
  }, [permission, teamMembers]);

  const handleMemberToggle = (memberId: string, hasPermission: boolean) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member || !permission) return;

    const updatedPermissions = hasPermission
      ? [...member.permissions.filter(p => p !== permission.id), permission.id]
      : member.permissions.filter(p => p !== permission.id);

    onUpdateMemberPermissions(memberId, updatedPermissions);
    
    setSelectedMembers(prev => 
      hasPermission 
        ? [...prev.filter(id => id !== memberId), memberId]
        : prev.filter(id => id !== memberId)
    );
  };

  const membersWithPermission = teamMembers.filter(member => 
    member.permissions.includes(permission?.id || '')
  );

  const membersWithoutPermission = teamMembers.filter(member => 
    !member.permissions.includes(permission?.id || '')
  );

  if (!permission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            {permission.name}
          </DialogTitle>
          <DialogDescription>
            {permission.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members">Assigned Members ({membersWithPermission.length})</TabsTrigger>
            <TabsTrigger value="available">Available Members ({membersWithoutPermission.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Members with {permission.name}
                </CardTitle>
                <DialogDescription>
                  These team members currently have this permission.
                </DialogDescription>
              </CardHeader>
              <CardContent>
                {membersWithPermission.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No members have this permission yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {membersWithPermission.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.role} • {member.department}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                            {member.status}
                          </Badge>
                          <Checkbox
                            checked={true}
                            onCheckedChange={(checked) => 
                              handleMemberToggle(member.id, checked as boolean)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Available Members
                </CardTitle>
                <DialogDescription>
                  Grant {permission.name} permission to these team members.
                </DialogDescription>
              </CardHeader>
              <CardContent>
                {membersWithoutPermission.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">All active members already have this permission.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {membersWithoutPermission.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.role} • {member.department}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                            {member.status}
                          </Badge>
                          <Checkbox
                            checked={false}
                            onCheckedChange={(checked) => 
                              handleMemberToggle(member.id, checked as boolean)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionManagementModal;