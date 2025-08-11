import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Plus, 
  Trash2, 
  Copy,
  Users,
  Lock,
  Clock,
  MapPin,
  Settings,
  Save,
  AlertTriangle
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  conditions?: {
    timeRestrictions?: {
      enabled: boolean;
      allowedHours: { start: string; end: string };
      allowedDays: string[];
    };
    locationRestrictions?: {
      enabled: boolean;
      allowedIPs: string[];
      allowedCountries: string[];
    };
    temporaryAccess?: {
      enabled: boolean;
      expiresAt: string;
    };
  };
  inheritance?: {
    parentRole?: string;
    inheritType: 'full' | 'partial' | 'none';
  };
  isSystemRole: boolean;
  usage: number;
}

const AdvancedRoleBuilder: React.FC = () => {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [permissions] = useState<Permission[]>([
    { id: 'students_read', name: 'View Students', description: 'View student profiles and information', category: 'Student Management', risk_level: 'low' },
    { id: 'students_write', name: 'Edit Students', description: 'Create and edit student profiles', category: 'Student Management', risk_level: 'medium', dependencies: ['students_read'] },
    { id: 'students_delete', name: 'Delete Students', description: 'Delete student records (permanent)', category: 'Student Management', risk_level: 'critical', dependencies: ['students_write'] },
    { id: 'financial_read', name: 'View Financial Data', description: 'Access financial records and reports', category: 'Financial', risk_level: 'medium' },
    { id: 'financial_write', name: 'Manage Finances', description: 'Process payments and manage financial records', category: 'Financial', risk_level: 'high', dependencies: ['financial_read'] },
    { id: 'team_read', name: 'View Team', description: 'View team member information', category: 'Team Management', risk_level: 'low' },
    { id: 'team_write', name: 'Manage Team', description: 'Add, edit, and manage team members', category: 'Team Management', risk_level: 'high', dependencies: ['team_read'] },
    { id: 'system_admin', name: 'System Administration', description: 'Full system access and configuration', category: 'System', risk_level: 'critical' },
    { id: 'reports_read', name: 'View Reports', description: 'Access all reports and analytics', category: 'Analytics', risk_level: 'medium' },
    { id: 'communication_send', name: 'Send Communications', description: 'Send emails and messages to students', category: 'Communication', risk_level: 'medium' }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      permissions: ['system_admin', 'students_read', 'students_write', 'students_delete', 'financial_read', 'financial_write', 'team_read', 'team_write', 'reports_read', 'communication_send'],
      isSystemRole: true,
      usage: 3
    },
    {
      id: 'advisor',
      name: 'Admissions Advisor',
      description: 'Standard advisor permissions for student management',
      permissions: ['students_read', 'students_write', 'communication_send', 'reports_read'],
      conditions: {
        timeRestrictions: {
          enabled: true,
          allowedHours: { start: '08:00', end: '18:00' },
          allowedDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      },
      isSystemRole: false,
      usage: 8
    },
    {
      id: 'finance',
      name: 'Finance Coordinator',
      description: 'Financial management with limited student access',
      permissions: ['students_read', 'financial_read', 'financial_write', 'reports_read'],
      isSystemRole: false,
      usage: 2
    }
  ]);

  const [formData, setFormData] = useState<Partial<Role>>({
    name: '',
    description: '',
    permissions: [],
    conditions: {
      timeRestrictions: { enabled: false, allowedHours: { start: '09:00', end: '17:00' }, allowedDays: [] },
      locationRestrictions: { enabled: false, allowedIPs: [], allowedCountries: [] },
      temporaryAccess: { enabled: false, expiresAt: '' }
    },
    inheritance: { inheritType: 'none' },
    isSystemRole: false,
    usage: 0
  });

  const permissionCategories = [...new Set(permissions.map(p => p.category))];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const handleCreateRole = () => {
    setIsCreating(true);
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      permissions: [],
      conditions: {
        timeRestrictions: { enabled: false, allowedHours: { start: '09:00', end: '17:00' }, allowedDays: [] },
        locationRestrictions: { enabled: false, allowedIPs: [], allowedCountries: [] },
        temporaryAccess: { enabled: false, expiresAt: '' }
      },
      inheritance: { inheritType: 'none' },
      isSystemRole: false,
      usage: 0
    });
  };

  const handleSaveRole = () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive"
      });
      return;
    }

    const newRole: Role = {
      ...formData as Role,
      id: isCreating ? `role_${Date.now()}` : selectedRole!.id
    };

    if (isCreating) {
      setRoles(prev => [...prev, newRole]);
      toast({
        title: "Role Created",
        description: `Role "${newRole.name}" has been created successfully`
      });
    } else {
      setRoles(prev => prev.map(role => role.id === newRole.id ? newRole : role));
      toast({
        title: "Role Updated",
        description: `Role "${newRole.name}" has been updated successfully`
      });
    }

    setIsCreating(false);
    setSelectedRole(null);
  };

  const handleCloneRole = (role: Role) => {
    const clonedRole = {
      ...role,
      id: `role_${Date.now()}`,
      name: `${role.name} (Copy)`,
      usage: 0,
      isSystemRole: false
    };
    setRoles(prev => [...prev, clonedRole]);
    toast({
      title: "Role Cloned",
      description: `Role "${clonedRole.name}" has been created from "${role.name}"`
    });
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystemRole) {
      toast({
        title: "Cannot Delete",
        description: "System roles cannot be deleted",
        variant: "destructive"
      });
      return;
    }

    setRoles(prev => prev.filter(role => role.id !== roleId));
    toast({
      title: "Role Deleted",
      description: "Role has been deleted successfully"
    });
  };

  const togglePermission = (permissionId: string) => {
    const permission = permissions.find(p => p.id === permissionId);
    const currentPermissions = formData.permissions || [];
    
    if (currentPermissions.includes(permissionId)) {
      // Remove permission and any dependent permissions
      const dependentPerms = permissions
        .filter(p => p.dependencies?.includes(permissionId))
        .map(p => p.id);
      
      setFormData(prev => ({
        ...prev,
        permissions: currentPermissions.filter(id => 
          id !== permissionId && !dependentPerms.includes(id)
        )
      }));
    } else {
      // Add permission and any required dependencies
      const dependencies = permission?.dependencies || [];
      const newPermissions = [...currentPermissions, permissionId, ...dependencies];
      
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set(newPermissions)]
      }));
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Role Builder</h2>
          <p className="text-muted-foreground">Create and manage custom roles with granular permissions</p>
        </div>
        <Button onClick={handleCreateRole}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role List */}
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {filteredRoles.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-colors ${
                  selectedRole?.id === role.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
                onClick={() => {
                  setSelectedRole(role);
                  setFormData(role);
                  setIsCreating(false);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{role.name}</h4>
                    {role.isSystemRole && (
                      <Badge variant="secondary" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        System
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {role.permissions.length} permissions
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {role.usage} users
                    </span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloneRole(role);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {!role.isSystemRole && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRole(role.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Role Editor */}
        <div className="lg:col-span-2">
          {(selectedRole || isCreating) ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {isCreating ? 'Create New Role' : `Edit Role: ${selectedRole?.name}`}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => {
                      setSelectedRole(null);
                      setIsCreating(false);
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveRole}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Role
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="conditions">Conditions</TabsTrigger>
                    <TabsTrigger value="inheritance">Inheritance</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="roleName">Role Name</Label>
                        <Input
                          id="roleName"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter role name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="roleDescription">Description</Label>
                        <Textarea
                          id="roleDescription"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe the role's purpose and scope"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.isSystemRole}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isSystemRole: checked }))}
                          disabled={selectedRole?.isSystemRole}
                        />
                        <Label>System Role (cannot be deleted)</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="permissions" className="space-y-4">
                    {permissionCategories.map(category => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium text-sm">{category}</h4>
                        <div className="space-y-2 pl-4">
                          {permissions
                            .filter(p => p.category === category)
                            .map(permission => (
                              <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  checked={formData.permissions?.includes(permission.id)}
                                  onCheckedChange={() => togglePermission(permission.id)}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-sm">{permission.name}</span>
                                    <Badge className={`text-xs ${getRiskColor(permission.risk_level)}`}>
                                      {permission.risk_level}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                                  {permission.dependencies && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Requires: {permission.dependencies.map(dep => 
                                        permissions.find(p => p.id === dep)?.name
                                      ).join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="conditions" className="space-y-4">
                    <div className="space-y-6">
                      {/* Time Restrictions */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.conditions?.timeRestrictions?.enabled}
                            onCheckedChange={(checked) => setFormData(prev => ({
                              ...prev,
                              conditions: {
                                ...prev.conditions,
                                timeRestrictions: {
                                  ...prev.conditions?.timeRestrictions,
                                  enabled: checked
                                }
                              }
                            }))}
                          />
                          <Clock className="h-4 w-4" />
                          <Label>Time Restrictions</Label>
                        </div>
                        {formData.conditions?.timeRestrictions?.enabled && (
                          <div className="pl-6 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Start Time</Label>
                                <Input
                                  type="time"
                                  value={formData.conditions.timeRestrictions.allowedHours?.start}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    conditions: {
                                      ...prev.conditions,
                                      timeRestrictions: {
                                        ...prev.conditions?.timeRestrictions,
                                        allowedHours: {
                                          ...prev.conditions?.timeRestrictions?.allowedHours,
                                          start: e.target.value
                                        }
                                      }
                                    }
                                  }))}
                                />
                              </div>
                              <div>
                                <Label>End Time</Label>
                                <Input
                                  type="time"
                                  value={formData.conditions.timeRestrictions.allowedHours?.end}
                                  onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    conditions: {
                                      ...prev.conditions,
                                      timeRestrictions: {
                                        ...prev.conditions?.timeRestrictions,
                                        allowedHours: {
                                          ...prev.conditions?.timeRestrictions?.allowedHours,
                                          end: e.target.value
                                        }
                                      }
                                    }
                                  }))}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Temporary Access */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.conditions?.temporaryAccess?.enabled}
                            onCheckedChange={(checked) => setFormData(prev => ({
                              ...prev,
                              conditions: {
                                ...prev.conditions,
                                temporaryAccess: {
                                  ...prev.conditions?.temporaryAccess,
                                  enabled: checked
                                }
                              }
                            }))}
                          />
                          <AlertTriangle className="h-4 w-4" />
                          <Label>Temporary Access</Label>
                        </div>
                        {formData.conditions?.temporaryAccess?.enabled && (
                          <div className="pl-6">
                            <Label>Expires At</Label>
                            <Input
                              type="datetime-local"
                              value={formData.conditions.temporaryAccess.expiresAt}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                conditions: {
                                  ...prev.conditions,
                                  temporaryAccess: {
                                    ...prev.conditions?.temporaryAccess,
                                    expiresAt: e.target.value
                                  }
                                }
                              }))}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="inheritance" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Inheritance Type</Label>
                        <Select
                          value={formData.inheritance?.inheritType}
                          onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            inheritance: {
                              ...prev.inheritance,
                              inheritType: value as 'full' | 'partial' | 'none'
                            }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Inheritance</SelectItem>
                            <SelectItem value="partial">Partial Inheritance</SelectItem>
                            <SelectItem value="full">Full Inheritance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {formData.inheritance?.inheritType !== 'none' && (
                        <div>
                          <Label>Parent Role</Label>
                          <Select
                            value={formData.inheritance?.parentRole}
                            onValueChange={(value) => setFormData(prev => ({
                              ...prev,
                              inheritance: {
                                ...prev.inheritance,
                                parentRole: value
                              }
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles
                                .filter(role => role.id !== formData.id)
                                .map(role => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Role Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a role from the list to edit, or create a new role to get started.
                </p>
                <Button onClick={handleCreateRole}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Role
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedRoleBuilder;