import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Calendar, Clock, BookOpen } from 'lucide-react';
import { useAcademicTerms } from '@/hooks/useAcademicTerms';
import { CreateTermDialog } from './CreateTermDialog';
import { format } from 'date-fns';
import { ModernCard } from '@/components/modern/ModernCard';
import { InfoBadge } from '@/components/modern/InfoBadge';
import { MetadataItem } from '@/components/modern/MetadataItem';

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
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading academic terms...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowCreateDialog(true)} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Term
        </Button>
      </div>

      {terms?.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Academic Terms</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            No academic terms configured yet. Create your first term to get started.
          </p>
          <Button onClick={() => setShowCreateDialog(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Term
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {terms?.map((term) => (
            <ModernCard key={term.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base text-foreground mb-2">
                        {term.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <InfoBadge variant={
                          term.status === 'active' ? 'success' :
                          term.status === 'draft' ? 'warning' :
                          term.status === 'completed' ? 'default' : 'destructive'
                        }>
                          {term.status.toUpperCase()}
                        </InfoBadge>
                        <InfoBadge variant="default">
                          {term.term_type.toUpperCase()}
                        </InfoBadge>
                        {term.is_current && (
                          <InfoBadge variant="success">CURRENT</InfoBadge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <MetadataItem label="Academic Year" value={term.academic_year} />
                  <MetadataItem 
                    label="Duration" 
                    value={`${format(new Date(term.start_date), 'MMM d, yyyy')} - ${format(new Date(term.end_date), 'MMM d, yyyy')}`} 
                  />
                  {term.registration_start_date && term.registration_end_date && (
                    <MetadataItem 
                      label="Registration" 
                      value={`${format(new Date(term.registration_start_date), 'MMM d')} - ${format(new Date(term.registration_end_date), 'MMM d, yyyy')}`} 
                    />
                  )}
                  {term.description && (
                    <p className="text-sm text-muted-foreground pt-2">
                      {term.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 pt-4 border-t border-border mt-4">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </ModernCard>
          ))}
        </div>
      )}

      <CreateTermDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}