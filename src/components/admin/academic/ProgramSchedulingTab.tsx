import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { useProgramTermSchedules } from '@/hooks/useProgramTermSchedules';
import { CreateProgramScheduleDialog } from './CreateProgramScheduleDialog';

export function ProgramSchedulingTab() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: programSchedules, isLoading } = useProgramTermSchedules();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'planned':
        return 'bg-yellow-500';
      case 'full':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
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
            <h2 className="text-2xl font-semibold">Program Scheduling</h2>
            <p className="text-muted-foreground">
              Link programs to terms and schedule templates
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Program
          </Button>
        </div>

        <div className="space-y-4">
          {programSchedules?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No program schedules configured yet</p>
              <Button onClick={() => setShowCreateDialog(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Your First Program
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {programSchedules?.map((schedule) => (
                <Card key={schedule.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Program Schedule</h3>
                        <Badge variant="secondary" className={getStatusColor(schedule.status)}>
                          {schedule.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {schedule.enrollment_count}/{schedule.capacity_limit} enrolled
                          </span>
                        </div>
                        {schedule.classroom_location && (
                          <p>
                            <span className="font-medium">Location:</span> {schedule.classroom_location}
                          </p>
                        )}
                        {schedule.special_requirements && (
                          <p>
                            <span className="font-medium">Requirements:</span> {schedule.special_requirements}
                          </p>
                        )}
                      </div>
                      {schedule.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{schedule.notes}</p>
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

      <CreateProgramScheduleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}