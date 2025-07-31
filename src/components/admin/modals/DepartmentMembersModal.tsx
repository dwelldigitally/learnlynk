import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Users } from "lucide-react";

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

interface DepartmentMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
  members: TeamMember[];
  onMemberClick: (member: TeamMember) => void;
}

const DepartmentMembersModal: React.FC<DepartmentMembersModalProps> = ({
  isOpen,
  onClose,
  departmentName,
  members,
  onMemberClick
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {departmentName} Department
          </DialogTitle>
          <DialogDescription>
            {members.length} team {members.length === 1 ? 'member' : 'members'} in this department
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {members.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No team members in this department yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {members.map((member) => (
                <Card 
                  key={member.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onMemberClick(member)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs text-muted-foreground">{member.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                          {member.status}
                        </Badge>
                        {member.studentsAssigned > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {member.studentsAssigned} students
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Active: {member.lastActive}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.permissions.slice(0, 4).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                        {member.permissions.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.permissions.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentMembersModal;