import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon,
  Clock,
  Users,
  Plus,
  UserX,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ShiftPattern {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  color: string;
}

interface TeamMemberSchedule {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  shifts: {
    date: string;
    shiftPatternId: string;
    status: 'scheduled' | 'confirmed' | 'absent' | 'substitute';
    substituteId?: string;
  }[];
  timeOff: {
    id: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'pending' | 'approved' | 'denied';
  }[];
  availability: {
    [key: string]: { available: boolean; hours?: { start: string; end: string } };
  };
}

interface CoverageRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  date: string;
  shiftPatternId: string;
  reason: string;
  status: 'open' | 'covered' | 'expired';
  substitutes: { id: string; name: string; responseDate: string }[];
}

const SchedulingManager: React.FC = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedMember, setSelectedMember] = useState<string>('all');

  const [shiftPatterns] = useState<ShiftPattern[]>([
    { id: 'morning', name: 'Morning Shift', startTime: '08:00', endTime: '16:00', daysOfWeek: [1, 2, 3, 4, 5], color: '#3b82f6' },
    { id: 'afternoon', name: 'Afternoon Shift', startTime: '12:00', endTime: '20:00', daysOfWeek: [1, 2, 3, 4, 5], color: '#10b981' },
    { id: 'evening', name: 'Evening Shift', startTime: '16:00', endTime: '00:00', daysOfWeek: [1, 2, 3, 4, 5], color: '#f59e0b' },
    { id: 'weekend', name: 'Weekend Shift', startTime: '09:00', endTime: '17:00', daysOfWeek: [6, 0], color: '#8b5cf6' }
  ]);

  const [teamSchedules, setTeamSchedules] = useState<TeamMemberSchedule[]>([
    {
      id: '1',
      name: 'Nicole Adams',
      email: 'nicole.adams@wcc.ca',
      avatar: '/src/assets/advisor-nicole.jpg',
      role: 'Senior Advisor',
      shifts: [
        { date: '2024-02-05', shiftPatternId: 'morning', status: 'scheduled' },
        { date: '2024-02-06', shiftPatternId: 'morning', status: 'confirmed' },
        { date: '2024-02-07', shiftPatternId: 'morning', status: 'scheduled' },
      ],
      timeOff: [
        { id: 'to1', startDate: '2024-02-15', endDate: '2024-02-16', reason: 'Personal', status: 'pending' }
      ],
      availability: {
        'monday': { available: true, hours: { start: '08:00', end: '18:00' } },
        'tuesday': { available: true, hours: { start: '08:00', end: '18:00' } },
        'wednesday': { available: true, hours: { start: '08:00', end: '18:00' } },
        'thursday': { available: true, hours: { start: '08:00', end: '18:00' } },
        'friday': { available: true, hours: { start: '08:00', end: '16:00' } },
        'saturday': { available: false },
        'sunday': { available: false }
      }
    },
    {
      id: '2',
      name: 'Robert Smith',
      email: 'robert.smith@wcc.ca',
      role: 'Manager',
      shifts: [
        { date: '2024-02-05', shiftPatternId: 'afternoon', status: 'confirmed' },
        { date: '2024-02-06', shiftPatternId: 'afternoon', status: 'scheduled' },
      ],
      timeOff: [],
      availability: {
        'monday': { available: true, hours: { start: '09:00', end: '19:00' } },
        'tuesday': { available: true, hours: { start: '09:00', end: '19:00' } },
        'wednesday': { available: true, hours: { start: '09:00', end: '19:00' } },
        'thursday': { available: true, hours: { start: '09:00', end: '19:00' } },
        'friday': { available: true, hours: { start: '09:00', end: '17:00' } },
        'saturday': { available: true, hours: { start: '10:00', end: '14:00' } },
        'sunday': { available: false }
      }
    }
  ]);

  const [coverageRequests] = useState<CoverageRequest[]>([
    {
      id: 'cr1',
      requesterId: '1',
      requesterName: 'Nicole Adams',
      date: '2024-02-10',
      shiftPatternId: 'morning',
      reason: 'Doctor appointment',
      status: 'open',
      substitutes: [
        { id: '2', name: 'Robert Smith', responseDate: '2024-02-05' }
      ]
    }
  ]);

  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      dates.push(currentDate);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getShiftForDate = (memberId: string, date: string) => {
    const member = teamSchedules.find(m => m.id === memberId);
    return member?.shifts.find(s => s.date === date);
  };

  const getShiftPattern = (patternId: string) => {
    return shiftPatterns.find(p => p.id === patternId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'substitute': return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleShiftAssignment = (memberId: string, date: string, shiftPatternId: string) => {
    setTeamSchedules(prev => prev.map(member => {
      if (member.id === memberId) {
        const existingShiftIndex = member.shifts.findIndex(s => s.date === date);
        const newShift = { date, shiftPatternId, status: 'scheduled' as const };
        
        if (existingShiftIndex >= 0) {
          member.shifts[existingShiftIndex] = newShift;
        } else {
          member.shifts.push(newShift);
        }
      }
      return member;
    }));

    toast({
      title: "Shift Assigned",
      description: "Shift has been successfully assigned"
    });
  };

  const handleTimeOffApproval = (memberId: string, timeOffId: string, approved: boolean) => {
    setTeamSchedules(prev => prev.map(member => {
      if (member.id === memberId) {
        member.timeOff = member.timeOff.map(to => 
          to.id === timeOffId 
            ? { ...to, status: approved ? 'approved' : 'denied' }
            : to
        );
      }
      return member;
    }));

    toast({
      title: approved ? "Time Off Approved" : "Time Off Denied",
      description: `Time off request has been ${approved ? 'approved' : 'denied'}`
    });
  };

  const weekDates = getWeekDates(selectedDate);
  const filteredSchedules = selectedMember === 'all' 
    ? teamSchedules 
    : teamSchedules.filter(m => m.id === selectedMember);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Scheduling Manager</h2>
          <p className="text-muted-foreground">Manage team schedules, shifts, and coverage</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Team Members</SelectItem>
              {teamSchedules.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'week' ? 'month' : 'week')}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            {viewMode === 'week' ? 'Month View' : 'Week View'}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Shift
          </Button>
        </div>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="timeoff">Time Off</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Requests</TabsTrigger>
          <TabsTrigger value="patterns">Shift Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {viewMode === 'week' ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    Weekly Schedule - {weekDates[0].toLocaleDateString()} to {weekDates[6].toLocaleDateString()}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      const prevWeek = new Date(selectedDate);
                      prevWeek.setDate(prevWeek.getDate() - 7);
                      setSelectedDate(prevWeek);
                    }}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                      Today
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      const nextWeek = new Date(selectedDate);
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      setSelectedDate(nextWeek);
                    }}>
                      Next
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-2">
                  {/* Header */}
                  <div className="font-medium p-2">Team Member</div>
                  {weekDates.map((date, index) => (
                    <div key={index} className="font-medium p-2 text-center">
                      <div className="text-sm">{date.toLocaleDateString('en', { weekday: 'short' })}</div>
                      <div className="text-xs text-muted-foreground">{date.getDate()}</div>
                    </div>
                  ))}

                  {/* Schedule Grid */}
                  {filteredSchedules.map((member) => (
                    <React.Fragment key={member.id}>
                      <div className="p-2 border-r">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.role}</div>
                          </div>
                        </div>
                      </div>
                      {weekDates.map((date, dateIndex) => {
                        const dateStr = formatDate(date);
                        const shift = getShiftForDate(member.id, dateStr);
                        const pattern = shift ? getShiftPattern(shift.shiftPatternId) : null;
                        
                        return (
                          <div key={dateIndex} className="p-2 border min-h-[60px]">
                            {shift && pattern ? (
                              <div 
                                className="p-2 rounded text-xs text-white"
                                style={{ backgroundColor: pattern.color }}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{pattern.name}</span>
                                  {getStatusIcon(shift.status)}
                                </div>
                                <div className="mt-1">{pattern.startTime} - {pattern.endTime}</div>
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground text-center pt-4">
                                No shift
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Schedule - {selectedDate.toLocaleDateString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredSchedules.map((member) => {
                        const shift = getShiftForDate(member.id, formatDate(selectedDate));
                        const pattern = shift ? getShiftPattern(shift.shiftPatternId) : null;
                        
                        return (
                          <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{member.name}</h4>
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {shift && pattern ? (
                                <div className="flex items-center space-x-2">
                                  <Badge style={{ backgroundColor: pattern.color, color: 'white' }}>
                                    {pattern.name}
                                  </Badge>
                                  <span className="text-sm">{pattern.startTime} - {pattern.endTime}</span>
                                  {getStatusIcon(shift.status)}
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-muted-foreground">No shift assigned</span>
                                  <Select onValueChange={(value) => handleShiftAssignment(member.id, formatDate(selectedDate), value)}>
                                    <SelectTrigger className="w-32">
                                      <SelectValue placeholder="Assign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {shiftPatterns.map(pattern => (
                                        <SelectItem key={pattern.id} value={pattern.id}>
                                          {pattern.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeoff" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teamSchedules.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span>{member.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {member.timeOff.length > 0 ? (
                    <div className="space-y-3">
                      {member.timeOff.map((timeOff) => (
                        <div key={timeOff.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium">{timeOff.reason}</p>
                              <p className="text-sm text-muted-foreground">
                                {timeOff.startDate} to {timeOff.endDate}
                              </p>
                            </div>
                            <Badge variant={
                              timeOff.status === 'approved' ? 'default' :
                              timeOff.status === 'denied' ? 'destructive' : 'secondary'
                            }>
                              {timeOff.status}
                            </Badge>
                          </div>
                          {timeOff.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleTimeOffApproval(member.id, timeOff.id, true)}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleTimeOffApproval(member.id, timeOff.id, false)}
                              >
                                Deny
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No time off requests</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {coverageRequests.map((request) => {
              const pattern = getShiftPattern(request.shiftPatternId);
              return (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-medium">{request.requesterName}</h4>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                      </div>
                      <Badge variant={
                        request.status === 'covered' ? 'default' :
                        request.status === 'expired' ? 'destructive' : 'secondary'
                      }>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm"><strong>Date:</strong> {request.date}</p>
                      <p className="text-sm"><strong>Shift:</strong> {pattern?.name} ({pattern?.startTime} - {pattern?.endTime})</p>
                    </div>
                    {request.substitutes.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Available Substitutes:</p>
                        <div className="space-y-1">
                          {request.substitutes.map((substitute) => (
                            <div key={substitute.id} className="flex justify-between items-center text-sm">
                              <span>{substitute.name}</span>
                              <span className="text-muted-foreground">Responded: {substitute.responseDate}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {request.status === 'open' && (
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm">Assign Substitute</Button>
                        <Button variant="outline" size="sm">
                          <UserX className="h-4 w-4 mr-1" />
                          Cancel Request
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {shiftPatterns.map((pattern) => (
              <Card key={pattern.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium">{pattern.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {pattern.startTime} - {pattern.endTime}
                      </p>
                    </div>
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: pattern.color }}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Days:</strong></p>
                    <div className="flex space-x-1">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <Badge 
                          key={index}
                          variant={pattern.daysOfWeek.includes(index) ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchedulingManager;