import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { useScheduleTemplates } from '@/hooks/useScheduleTemplates';
import { CreateScheduleDialog } from './CreateScheduleDialog';

export function ScheduleTemplatesTab() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: schedules, isLoading } = useScheduleTemplates();

  const getScheduleTypeColor = (type: string) => {
    switch (type) {
      case 'regular':
        return 'bg-blue-500';
      case 'intensive':
        return 'bg-orange-500';
      case 'weekend':
        return 'bg-purple-500';
      case 'evening':
        return 'bg-indigo-500';
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
            <h2 className="text-2xl font-semibold">Schedule Templates</h2>
            <p className="text-muted-foreground">
              Create reusable scheduling templates for different class formats
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </div>

        <div className="space-y-4">
          {schedules?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No schedule templates created yet</p>
              <Button onClick={() => setShowCreateDialog(true)} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Template
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {schedules?.map((schedule) => (
                <Card key={schedule.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{schedule.template_name}</h3>
                        <Badge variant="secondary" className={getScheduleTypeColor(schedule.schedule_type)}>
                          {schedule.schedule_type}
                        </Badge>
                        {!schedule.is_active && (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Duration: {schedule.duration_weeks} weeks
                          </span>
                          <span>Max Capacity: {schedule.max_capacity}</span>
                        </div>
                        {schedule.days_of_week && Array.isArray(schedule.days_of_week) && schedule.days_of_week.length > 0 && (
                          <p>
                            <span className="font-medium">Days:</span>{' '}
                            {schedule.days_of_week.join(', ')}
                          </p>
                        )}
                        {schedule.location_requirements && (
                          <p>
                            <span className="font-medium">Location Requirements:</span>{' '}
                            {schedule.location_requirements}
                          </p>
                        )}
                      </div>
                      {schedule.description && (
                        <p className="text-sm text-muted-foreground mt-2">{schedule.description}</p>
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

      <CreateScheduleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}