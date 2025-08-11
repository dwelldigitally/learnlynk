import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedIntakeService } from '@/services/enhancedIntakeService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const SimpleIntakeManager: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: intakes = [], isLoading } = useQuery({
    queryKey: ['simple-intakes'],
    queryFn: () => enhancedIntakeService.getIntakesWithProgramData(),
    refetchInterval: 30000,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ intakeId, newStatus }: { intakeId: string; newStatus: 'open' | 'closed' }) => {
      // This would need to be implemented in the service
      const success = await enhancedIntakeService.updateIntakeStatus(intakeId, newStatus);
      if (!success) throw new Error('Failed to update intake status');
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simple-intakes'] });
      toast({
        title: "Status Updated",
        description: "Intake status has been updated successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update intake status.",
        variant: "destructive"
      });
    }
  });

  const handleStatusToggle = (intakeId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    toggleStatusMutation.mutate({ intakeId, newStatus });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'closed': return 'secondary';
      case 'full': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-full"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Intake Management</h2>
        <p className="text-muted-foreground">
          Open and close program intakes for enrollment
        </p>
      </div>

      {/* Intake Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {intakes.map((intake) => (
          <Card key={intake.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg font-semibold truncate">
                    {intake.program_name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    {intake.name}
                  </p>
                </div>
                <Badge variant={getStatusBadgeVariant(intake.status)} className="ml-2">
                  {intake.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Intake Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Starts {formatDate(intake.start_date)}</span>
                </div>
                
                {intake.application_deadline && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Deadline {formatDate(intake.application_deadline)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    {intake.enrolled_count || 0}/{intake.capacity} enrolled
                  </span>
                </div>

                {intake.campus && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{intake.campus}</span>
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">
                    {intake.status === 'open' ? 'Accepting Applications' : 'Closed for Applications'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {intake.status === 'open' 
                      ? 'Students can submit applications' 
                      : 'No new applications accepted'
                    }
                  </p>
                </div>
                <Switch
                  checked={intake.status === 'open'}
                  onCheckedChange={() => handleStatusToggle(intake.id, intake.status)}
                  disabled={toggleStatusMutation.isPending || intake.status === 'full'}
                />
              </div>

              {/* Capacity Warning */}
              {intake.status === 'open' && intake.capacity_percentage > 90 && (
                <div className="p-2 bg-warning/10 border border-warning/20 rounded text-sm">
                  <p className="font-medium text-warning">Nearly Full</p>
                  <p className="text-xs text-muted-foreground">
                    Consider closing intake soon
                  </p>
                </div>
              )}

              {intake.status === 'full' && (
                <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-sm">
                  <p className="font-medium text-destructive">Capacity Reached</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically closed due to full enrollment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {intakes.length === 0 && !isLoading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Intakes Found</h3>
            <p className="text-muted-foreground text-center">
              No program intakes have been configured yet. Create program intakes to manage enrollment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};