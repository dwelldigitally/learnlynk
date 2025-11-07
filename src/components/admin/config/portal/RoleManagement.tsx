import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortalRoles, useRoleMutations } from "@/hooks/useStudentPortalAdmin";
import { Plus, Loader2, Shield, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RoleDialog } from "./dialogs/RoleDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const RoleManagement = () => {
  const { data: roles, isLoading } = usePortalRoles();
  const { createRole, updateRole, deleteRole } = useRoleMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleSave = (role: any) => {
    if (editingRole) {
      updateRole.mutate({ id: editingRole.id, updates: role });
    } else {
      createRole.mutate(role);
    }
    setEditingRole(null);
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingRole(null);
    setDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteRole.mutate(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role & Access Management
          </CardTitle>
          <CardDescription>
            Define custom roles and configure what students can access based on their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles && roles.length > 0 ? (
              <div className="grid gap-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{role.role_name}</h4>
                          <Badge variant={role.is_active ? "default" : "secondary"}>
                            {role.is_active ? "Active" : "Inactive"}
                          </Badge>
                          {role.is_default && <Badge variant="outline">Default</Badge>}
                        </div>
                        {role.role_description && (
                          <p className="text-sm text-muted-foreground">{role.role_description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(role)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {role.role_type === 'custom' && (
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(role.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">Type: {role.role_type}</Badge>
                      <Badge variant="outline">Priority: {role.priority}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No custom roles defined. Click "Create Role" to add one.</p>
              </div>
            )}

            <Button className="w-full" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </div>
        </CardContent>
      </Card>

      <RoleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        role={editingRole}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this role? Students assigned to this role will lose their permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
