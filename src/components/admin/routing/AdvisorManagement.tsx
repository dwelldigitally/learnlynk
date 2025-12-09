import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdvisorRoutingSettings, WorkingSchedule } from '@/hooks/useAdvisorRoutingSettings';
import { Search, Calendar, TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';

interface AdvisorManagementProps {
  onAdvisorUpdated?: () => void;
}

export function AdvisorManagement({ onAdvisorUpdated }: AdvisorManagementProps) {
  const { advisors, isLoading, updateSettings, isUpdating } = useAdvisorRoutingSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
  const [editSchedule, setEditSchedule] = useState<WorkingSchedule>({
    days: [],
    start_time: '09:00',
    end_time: '17:00'
  });

  const filteredAdvisors = advisors.filter(advisor =>
    advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCapacityPercentage = (current: number, max: number) => {
    if (max === 0) return 0;
    return Math.min((current / max) * 100, 100);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 80) return 'bg-orange-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatSchedule = (schedule: WorkingSchedule) => {
    const dayMap: { [key: string]: string } = {
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    };

    const days = schedule.days.map(day => dayMap[day]).join(', ');
    return `${days} (${schedule.start_time} - ${schedule.end_time})`;
  };

  const handleUpdateSettings = (advisorId: string, updates: any) => {
    updateSettings({ advisorId, updates });
    if (onAdvisorUpdated) {
      onAdvisorUpdated();
    }
  };

  const openScheduleModal = (advisor: any) => {
    setSelectedAdvisor(advisor);
    setEditSchedule(advisor.working_schedule);
    setShowScheduleModal(true);
  };

  const saveSchedule = () => {
    if (selectedAdvisor) {
      handleUpdateSettings(selectedAdvisor.advisor_id, { working_schedule: editSchedule });
      setShowScheduleModal(false);
    }
  };

  const activeAdvisors = advisors.filter(a => a.routing_enabled);
  const totalCapacity = advisors.reduce((sum, a) => sum + a.capacity_per_week, 0);
  const totalAssigned = advisors.reduce((sum, a) => sum + a.leads_assigned, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advisor Management</h2>
          <p className="text-muted-foreground">Manage advisor availability, capacity, and performance for lead routing</p>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search advisors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-4 text-sm ml-auto">
          <span>Total: {advisors.length}</span>
          <span className="text-green-600">Active for Routing: {activeAdvisors.length}</span>
          <span>Capacity: {totalCapacity > 0 ? Math.round((totalAssigned / totalCapacity) * 100) : 0}%</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">How Routing Status Works</p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            When routing is disabled for an advisor, they will not receive any new leads even if they match routing rules. 
            Performance-based routing prioritizes Top performers first, then Advanced, then Standard within available capacity.
          </p>
        </div>
      </div>

      {/* Advisor List */}
      <Card>
        <CardHeader>
          <CardTitle>Advisor Settings</CardTitle>
          <p className="text-sm text-muted-foreground">Configure routing availability, capacity limits, and performance tiers</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 py-2 text-sm font-medium text-muted-foreground border-b">
              <div className="col-span-3">Advisor</div>
              <div className="col-span-2">Capacity/Week</div>
              <div className="col-span-1">Routing</div>
              <div className="col-span-2">Schedule</div>
              <div className="col-span-2">Performance Tier</div>
              <div className="col-span-2">Current Load</div>
            </div>

            {/* Advisor Rows */}
            {filteredAdvisors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No advisors match your search' : 'No advisors found. Add team members to get started.'}
              </div>
            ) : (
              filteredAdvisors.map(advisor => {
                const capacityPercentage = getCapacityPercentage(advisor.leads_assigned, advisor.capacity_per_week);

                return (
                  <div 
                    key={advisor.advisor_id} 
                    className={`grid grid-cols-12 gap-4 py-3 items-center border-b last:border-b-0 ${
                      !advisor.routing_enabled ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Advisor Info */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                          {advisor.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium">{advisor.name}</p>
                          <p className="text-sm text-muted-foreground">{advisor.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Capacity Per Week */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={advisor.capacity_per_week}
                          onChange={(e) => handleUpdateSettings(advisor.advisor_id, { 
                            capacity_per_week: parseInt(e.target.value) || 0 
                          })}
                          className="w-20"
                          min="1"
                          disabled={isUpdating}
                        />
                        <span className="text-sm text-muted-foreground">/week</span>
                      </div>
                    </div>

                    {/* Routing Status */}
                    <div className="col-span-1">
                      <Switch
                        checked={advisor.routing_enabled}
                        onCheckedChange={(checked) => handleUpdateSettings(advisor.advisor_id, { routing_enabled: checked })}
                        disabled={isUpdating}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {advisor.routing_enabled ? 'On' : 'Off'}
                      </p>
                    </div>

                    {/* Schedule */}
                    <div className="col-span-2">
                      <p className="text-sm truncate" title={formatSchedule(advisor.working_schedule)}>
                        {formatSchedule(advisor.working_schedule)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1"
                        onClick={() => openScheduleModal(advisor)}
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Adjust
                      </Button>
                    </div>

                    {/* Performance Tier */}
                    <div className="col-span-2">
                      <Select
                        value={advisor.performance_tier}
                        onValueChange={(value) => handleUpdateSettings(advisor.advisor_id, { performance_tier: value })}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Top">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                              Top Performer
                            </span>
                          </SelectItem>
                          <SelectItem value="Advanced">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-blue-500" />
                              Advanced
                            </span>
                          </SelectItem>
                          <SelectItem value="Standard">
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-gray-500" />
                              Standard
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Current Load */}
                    <div className="col-span-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{advisor.leads_assigned} of {advisor.capacity_per_week}</span>
                          <span>{Math.round(capacityPercentage)}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${getCapacityColor(capacityPercentage)}`}
                            style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">
                  {advisors.length > 0
                    ? Math.round(advisors.reduce((sum, a) => sum + a.response_time_avg, 0) / advisors.length)
                    : 0}m
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {advisors.length > 0
                    ? Math.round((advisors.reduce((sum, a) => sum + a.conversion_rate, 0) / advisors.length) * 10) / 10
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold">
                  {totalAssigned}/{totalCapacity}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Management Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Schedule - {selectedAdvisor?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Working Days */}
            <div>
              <Label className="text-base font-medium">Working Days</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={editSchedule.days.includes(day)}
                      onCheckedChange={(checked) => {
                        const updatedDays = checked
                          ? [...editSchedule.days, day]
                          : editSchedule.days.filter(d => d !== day);
                        setEditSchedule({ ...editSchedule, days: updatedDays });
                      }}
                    />
                    <Label htmlFor={day} className="text-sm capitalize">{day.slice(0, 3)}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={editSchedule.start_time}
                  onChange={(e) => setEditSchedule({ ...editSchedule, start_time: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={editSchedule.end_time}
                  onChange={(e) => setEditSchedule({ ...editSchedule, end_time: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveSchedule} disabled={isUpdating}>
              Save Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
