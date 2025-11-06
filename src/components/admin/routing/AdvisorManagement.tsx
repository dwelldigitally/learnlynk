import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Search, Calendar, TrendingUp, Users, CalendarRange } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AdvisorManagementProps {
  onAdvisorUpdated?: () => void;
}

export function AdvisorManagement({ onAdvisorUpdated }: AdvisorManagementProps) {
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  // Mock advisors for demonstration
  useEffect(() => {
    setAdvisors([
      {
        id: 'advisor-1',
        name: 'Nicole Ye',
        email: 'nicole.y@example.com',
        max_assignments: 10,
        current_assignments: 22,
        status: 'active',
        schedule: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_time: '09:00',
          end_time: '17:00'
        },
        performance_tier: 'Top',
        team_id: 'team-1',
        response_time_avg: 45,
        conversion_rate: 25.5
      },
      {
        id: 'advisor-2',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        max_assignments: 8,
        current_assignments: 17,
        status: 'active',
        schedule: {
          days: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          start_time: '10:00',
          end_time: '18:00'
        },
        performance_tier: 'Advanced',
        team_id: 'team-1',
        response_time_avg: 32,
        conversion_rate: 31.2
      },
      {
        id: 'advisor-3',
        name: 'Michael Lee',
        email: 'michael.l@example.com',
        max_assignments: 6,
        current_assignments: 12,
        status: 'inactive',
        schedule: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_time: '08:00',
          end_time: '16:00'
        },
        performance_tier: 'Standard',
        team_id: 'team-2',
        response_time_avg: 58,
        conversion_rate: 18.7
      },
      {
        id: 'advisor-4',
        name: 'Emily Chen',
        email: 'emily.c@example.com',
        max_assignments: 12,
        current_assignments: 26,
        status: 'active',
        schedule: {
          days: ['wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          start_time: '12:00',
          end_time: '20:00'
        },
        performance_tier: 'Top',
        team_id: 'team-2',
        response_time_avg: 28,
        conversion_rate: 35.8
      },
      {
        id: 'advisor-5',
        name: 'Robert Williams',
        email: 'robert.w@example.com',
        max_assignments: 8,
        current_assignments: 14,
        status: 'active',
        schedule: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          start_time: '09:00',
          end_time: '17:00'
        },
        performance_tier: 'Advanced',
        team_id: 'team-1',
        response_time_avg: 41,
        conversion_rate: 28.9
      }
    ]);
  }, []);

  const updateAdvisorSettings = (advisorId: string, updates: any) => {
    setAdvisors(prev => prev.map(advisor => 
      advisor.id === advisorId ? { ...advisor, ...updates } : advisor
    ));
    toast({
      title: 'Success',
      description: 'Advisor settings updated successfully'
    });
    
    if (onAdvisorUpdated) {
      onAdvisorUpdated();
    }
  };

  const filteredAdvisors = advisors.filter(advisor =>
    advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCapacityPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-orange-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatSchedule = (schedule: any) => {
    const dayMap: { [key: string]: string } = {
      monday: 'Mon',
      tuesday: 'Tue', 
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    };
    
    const days = schedule.days.map((day: string) => dayMap[day]).join(', ');
    return `${days} (${schedule.start_time} - ${schedule.end_time})`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advisor Management</h2>
          <p className="text-muted-foreground">Manage individual advisor settings, workload, and performance</p>
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
        
        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4 text-muted-foreground" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <span className="text-muted-foreground">to</span>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "MMM dd, yyyy") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                disabled={(date) => dateFrom ? date < dateFrom : false}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {(dateFrom || dateTo) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDateFrom(undefined);
                setDateTo(undefined);
              }}
            >
              Clear
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm ml-auto">
          <span>Total: {advisors.length}</span>
          <span>Active: {advisors.filter(a => a.status === 'active').length}</span>
          <span>Capacity: {Math.round((advisors.reduce((sum, a) => sum + a.current_assignments, 0) / advisors.reduce((sum, a) => sum + a.max_assignments, 0)) * 100)}%</span>
          {(dateFrom || dateTo) && (
            <span className="text-primary font-medium">
              {dateFrom && dateTo ? `${format(dateFrom, 'MMM dd')} - ${format(dateTo, 'MMM dd')}` : 'Custom Range'}
            </span>
          )}
        </div>
      </div>

      {/* Advisor List */}
      <Card>
        <CardHeader>
          <CardTitle>Advisor Settings</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your advisors' workload, status, and performance settings</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 py-2 text-sm font-medium text-muted-foreground border-b">
              <div className="col-span-3">Advisor</div>
              <div className="col-span-2">Max Assignments</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Schedule</div>
              <div className="col-span-2">Performance Tier</div>
              <div className="col-span-2">Capacity</div>
            </div>

            {/* Advisor Rows */}
            {filteredAdvisors.map(advisor => {
              const capacityPercentage = getCapacityPercentage(advisor.current_assignments, advisor.max_assignments);
              
              return (
                <div key={advisor.id} className="grid grid-cols-12 gap-4 py-3 items-center border-b last:border-b-0">
                  {/* Advisor Info */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                        {advisor.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{advisor.name}</p>
                        <p className="text-sm text-muted-foreground">{advisor.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Max Assignments */}
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={advisor.max_assignments}
                      onChange={(e) => updateAdvisorSettings(advisor.id, { max_assignments: parseInt(e.target.value) })}
                      className="w-20"
                      min="1"
                    />
                    <span className="text-sm text-muted-foreground ml-2">per week</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <Switch
                      checked={advisor.status === 'active'}
                      onCheckedChange={(checked) => 
                        updateAdvisorSettings(advisor.id, { status: checked ? 'active' : 'inactive' })
                      }
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {advisor.status === 'active' ? 'Active' : 'Inactive'}
                    </p>
                  </div>

                  {/* Schedule */}
                  <div className="col-span-2">
                    <p className="text-sm">{formatSchedule(advisor.schedule)}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1"
                      onClick={() => {
                        setSelectedAdvisor(advisor);
                        setShowScheduleModal(true);
                      }}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Adjust
                    </Button>
                  </div>

                  {/* Performance Tier */}
                  <div className="col-span-2">
                    <Select 
                      value={advisor.performance_tier}
                      onValueChange={(value) => updateAdvisorSettings(advisor.id, { performance_tier: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Top">Top Performer</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Capacity */}
                  <div className="col-span-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{advisor.current_assignments} of {advisor.max_assignments}</span>
                        <span>{Math.round(capacityPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${getCapacityColor(capacityPercentage)}`}
                          style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                  {Math.round(advisors.reduce((sum, a) => sum + a.response_time_avg, 0) / advisors.length)}m
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((advisors.reduce((sum, a) => sum + a.conversion_rate, 0) / advisors.length) * 10) / 10}%
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
                  {advisors.reduce((sum, a) => sum + a.current_assignments, 0)}/{advisors.reduce((sum, a) => sum + a.max_assignments, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Management Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Schedule - {selectedAdvisor?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedAdvisor && (
            <div className="space-y-6">
              {/* Working Days */}
              <div>
                <Label className="text-base font-medium">Working Days</Label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={selectedAdvisor.schedule.days.includes(day)}
                        onCheckedChange={(checked) => {
                          const updatedDays = checked 
                            ? [...selectedAdvisor.schedule.days, day]
                            : selectedAdvisor.schedule.days.filter((d: string) => d !== day);
                          setSelectedAdvisor({
                            ...selectedAdvisor,
                            schedule: { ...selectedAdvisor.schedule, days: updatedDays }
                          });
                        }}
                      />
                      <Label htmlFor={day} className="text-sm capitalize">
                        {day.slice(0, 3)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={selectedAdvisor.schedule.start_time}
                    onChange={(e) => setSelectedAdvisor({
                      ...selectedAdvisor,
                      schedule: { ...selectedAdvisor.schedule, start_time: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={selectedAdvisor.schedule.end_time}
                    onChange={(e) => setSelectedAdvisor({
                      ...selectedAdvisor,
                      schedule: { ...selectedAdvisor.schedule, end_time: e.target.value }
                    })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    updateAdvisorSettings(selectedAdvisor.id, { schedule: selectedAdvisor.schedule });
                    setShowScheduleModal(false);
                  }}
                >
                  Save Schedule
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}