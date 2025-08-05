import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Clock, 
  User, 
  FileText, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Search,
  Filter,
  Upload,
  Download,
  MessageSquare,
  DollarSign,
  GraduationCap,
  Bot
} from 'lucide-react';

interface StudentTimelineProps {
  student: any;
}

export function StudentTimeline({ student }: StudentTimelineProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  const timelineEvents = [
    {
      id: 1,
      type: 'application',
      title: 'Application Submitted',
      description: 'Student submitted initial application for Computer Science program',
      timestamp: '2024-01-15T09:30:00Z',
      user: 'Emma Johnson',
      status: 'completed',
      icon: FileText,
      color: 'blue',
      details: {
        program: 'Computer Science',
        applicationId: 'APP-2024-001'
      }
    },
    {
      id: 2,
      type: 'document',
      title: 'Transcripts Uploaded',
      description: 'Official academic transcripts submitted and verified',
      timestamp: '2024-01-22T14:20:00Z',
      user: 'Emma Johnson',
      status: 'approved',
      icon: Upload,
      color: 'green',
      details: {
        documentType: 'Academic Transcript',
        fileSize: '2.3 MB'
      }
    },
    {
      id: 3,
      type: 'communication',
      title: 'Welcome Email Sent',
      description: 'Welcome email with program information sent to student',
      timestamp: '2024-01-25T10:30:00Z',
      user: 'Dr. Sarah Wilson',
      status: 'sent',
      icon: Mail,
      color: 'purple',
      details: {
        subject: 'Welcome to Computer Science Program',
        template: 'welcome_template'
      }
    },
    {
      id: 4,
      type: 'document',
      title: 'Personal Statement Uploaded',
      description: 'Student submitted personal statement (revised version)',
      timestamp: '2024-01-23T16:45:00Z',
      user: 'Emma Johnson',
      status: 'approved',
      icon: FileText,
      color: 'green',
      details: {
        documentType: 'Personal Statement',
        version: 2
      }
    },
    {
      id: 5,
      type: 'call',
      title: 'Academic Planning Call',
      description: 'Phone consultation regarding course selection and academic planning',
      timestamp: '2024-01-24T15:45:00Z',
      user: 'Dr. Sarah Wilson',
      status: 'completed',
      icon: Phone,
      color: 'green',
      details: {
        duration: '25 minutes',
        outcome: 'Course plan discussed'
      }
    },
    {
      id: 6,
      type: 'system',
      title: 'Document Reminder Sent',
      description: 'Automated reminder for pending Letter of Recommendation',
      timestamp: '2024-01-23T09:00:00Z',
      user: 'System',
      status: 'automated',
      icon: Bot,
      color: 'gray',
      details: {
        reminderType: 'Document Submission',
        documentRequired: 'Letter of Recommendation'
      }
    },
    {
      id: 7,
      type: 'test',
      title: 'TOEFL Score Submitted',
      description: 'English proficiency test scores received and verified',
      timestamp: '2024-01-21T11:15:00Z',
      user: 'ETS Testing Service',
      status: 'verified',
      icon: GraduationCap,
      color: 'blue',
      details: {
        testType: 'TOEFL iBT',
        score: '105/120'
      }
    },
    {
      id: 8,
      type: 'status',
      title: 'Application Status Updated',
      description: 'Status changed from "Documents Required" to "Document Review"',
      timestamp: '2024-01-25T08:00:00Z',
      user: 'Dr. Sarah Wilson',
      status: 'updated',
      icon: CheckCircle2,
      color: 'orange',
      details: {
        previousStatus: 'SEND_DOCUMENTS',
        newStatus: 'DOCUMENT_APPROVAL'
      }
    },
    {
      id: 9,
      type: 'payment',
      title: 'Application Fee Paid',
      description: 'Application processing fee payment received',
      timestamp: '2024-01-16T13:22:00Z',
      user: 'Emma Johnson',
      status: 'completed',
      icon: DollarSign,
      color: 'green',
      details: {
        amount: '$100.00',
        method: 'Credit Card'
      }
    },
    {
      id: 10,
      type: 'communication',
      title: 'SMS Notification Sent',
      description: 'Status update sent via SMS to student mobile',
      timestamp: '2024-01-22T16:30:00Z',
      user: 'System',
      status: 'delivered',
      icon: MessageSquare,
      color: 'purple',
      details: {
        message: 'Transcripts approved. Next: recommendation letters by Feb 15.',
        phoneNumber: student.phone
      }
    }
  ];

  const getEventColor = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      completed: { variant: 'default' as const, label: 'Completed' },
      approved: { variant: 'default' as const, label: 'Approved' },
      pending: { variant: 'secondary' as const, label: 'Pending' },
      sent: { variant: 'outline' as const, label: 'Sent' },
      delivered: { variant: 'outline' as const, label: 'Delivered' },
      verified: { variant: 'default' as const, label: 'Verified' },
      automated: { variant: 'secondary' as const, label: 'Automated' },
      updated: { variant: 'outline' as const, label: 'Updated' }
    };
    const config = statusMap[status as keyof typeof statusMap] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredEvents = timelineEvents
    .filter(event => 
      filterType === 'all' || event.type === filterType
    )
    .filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.user.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'application', label: 'Application' },
    { value: 'document', label: 'Documents' },
    { value: 'communication', label: 'Communication' },
    { value: 'call', label: 'Calls' },
    { value: 'test', label: 'Tests' },
    { value: 'status', label: 'Status Changes' },
    { value: 'payment', label: 'Payments' },
    { value: 'system', label: 'System Events' }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Activity Timeline</h2>
          <p className="text-muted-foreground">Complete history of all activities and interactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Timeline
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search timeline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Newest First</SelectItem>
            <SelectItem value="asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
        
        <div className="space-y-6">
          {filteredEvents.map((event, index) => {
            const IconComponent = event.icon;
            return (
              <div key={event.id} className="relative flex items-start gap-6">
                {/* Timeline node */}
                <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${getEventColor(event.color)}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                
                {/* Event content */}
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(event.status)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">By: {event.user}</span>
                    </div>
                    
                    {/* Event details */}
                    {event.details && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {Object.entries(event.details).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                              </span>
                              <span className="ml-2 font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{timelineEvents.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">
                  {timelineEvents.filter(e => e.type === 'document').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Communications</p>
                <p className="text-2xl font-bold">
                  {timelineEvents.filter(e => e.type === 'communication' || e.type === 'call').length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Days Active</p>
                <p className="text-2xl font-bold">11</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}