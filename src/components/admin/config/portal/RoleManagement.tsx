import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePortalRoles, useRoleMutations } from "@/hooks/useStudentPortalAdmin";
import { Plus, Loader2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const RoleManagement = () => {
  const { data: roles, isLoading } = usePortalRoles();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
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

            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Role
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
