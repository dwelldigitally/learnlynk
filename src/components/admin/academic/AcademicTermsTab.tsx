import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAcademicTerms } from '@/hooks/useAcademicTerms';
import { CreateTermDialog } from './CreateTermDialog';
import { format } from 'date-fns';

export function AcademicTermsTab() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: terms, isLoading } = useAcademicTerms();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'draft':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Academic Terms</h2>
            <p className="text-muted-foreground">
              Manage semester and quarter schedules
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Term
          </Button>
        </div>

        <div className="space-y-4">
          {terms?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No academic terms configured yet</p>
              <Button onClick={() => setShowCreateDialog(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Term
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {terms?.map((term) => (
                <Card key={term.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{term.name}</h3>
                        <Badge variant="secondary" className={getStatusColor(term.status)}>
                          {term.status}
                        </Badge>
                        {term.is_current && (
                          <Badge variant="default">Current</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><span className="font-medium">Academic Year:</span> {term.academic_year}</p>
                        <p><span className="font-medium">Type:</span> {term.term_type}</p>
                        <p>
                          <span className="font-medium">Duration:</span>{' '}
                          {format(new Date(term.start_date), 'MMM d, yyyy')} -{' '}
                          {format(new Date(term.end_date), 'MMM d, yyyy')}
                        </p>
                        {term.registration_start_date && term.registration_end_date && (
                          <p>
                            <span className="font-medium">Registration:</span>{' '}
                            {format(new Date(term.registration_start_date), 'MMM d')} -{' '}
                            {format(new Date(term.registration_end_date), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                      {term.description && (
                        <p className="text-sm text-muted-foreground mt-2">{term.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      <CreateTermDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}