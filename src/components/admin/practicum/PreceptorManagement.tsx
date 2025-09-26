import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Edit, Trash2, Phone, Mail, User, UserCheck, Users } from 'lucide-react';
import { usePreceptors, useDeletePreceptor } from '@/hooks/usePreceptors';
import { CreatePreceptorDialog } from './CreatePreceptorDialog';
import { EditPreceptorDialog } from './EditPreceptorDialog';
import type { Preceptor } from '@/hooks/usePreceptors';

interface PreceptorManagementProps {
  siteId: string;
  siteName: string;
}

export function PreceptorManagement({ siteId, siteName }: PreceptorManagementProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPreceptor, setEditingPreceptor] = useState<Preceptor | null>(null);
  
  const { data: preceptors, isLoading } = usePreceptors(siteId);
  const deletePreceptor = useDeletePreceptor();

  const handleDelete = async (preceptorId: string) => {
    if (window.confirm('Are you sure you want to remove this preceptor?')) {
      await deletePreceptor.mutateAsync(preceptorId);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">Preceptors at {siteName}</h3>
            <p className="text-muted-foreground">
              Manage preceptors and supervisors for this practicum site
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Preceptor
          </Button>
        </div>

        {!preceptors || preceptors.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No preceptors added yet</p>
            <Button onClick={() => setShowCreateDialog(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Preceptor
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {preceptors.map((preceptor) => (
              <Card key={preceptor.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="text-sm font-medium">
                        {getInitials(preceptor.first_name, preceptor.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">
                          {preceptor.first_name} {preceptor.last_name}
                        </h4>
                        {preceptor.is_primary_contact && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            <UserCheck className="w-3 h-3 mr-1" />
                            Primary Contact
                          </Badge>
                        )}
                        {!preceptor.is_active && (
                          <Badge variant="outline" className="text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {preceptor.title && (
                          <p><span className="font-medium">Title:</span> {preceptor.title}</p>
                        )}
                        {preceptor.department && (
                          <p><span className="font-medium">Department:</span> {preceptor.department}</p>
                        )}
                        {preceptor.specialization && (
                          <p><span className="font-medium">Specialization:</span> {preceptor.specialization}</p>
                        )}
                        {preceptor.years_experience && (
                          <p><span className="font-medium">Experience:</span> {preceptor.years_experience} years</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{preceptor.email}</span>
                        </div>
                        {preceptor.phone && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            <span>{preceptor.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{preceptor.current_students || 0}/{preceptor.max_students || 3} students</span>
                        </div>
                      </div>
                      
                      {preceptor.bio && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {preceptor.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingPreceptor(preceptor)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(preceptor.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <CreatePreceptorDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        siteId={siteId}
        siteName={siteName}
      />

      <EditPreceptorDialog
        open={!!editingPreceptor}
        onOpenChange={(open) => !open && setEditingPreceptor(null)}
        preceptor={editingPreceptor}
        siteName={siteName}
      />
    </div>
  );
}