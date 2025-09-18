import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, GraduationCap, Calendar, MapPin, Clock } from 'lucide-react';

interface StudentProfileSidebarProps {
  applicantId: string;
}

// Mock student data - would come from API
const mockStudent = {
  id: 'd9a6284c-5270-4b74-a8b0-514b68948eea',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+1 (555) 123-4567',
  avatar: '',
  country: 'United States',
  city: 'San Francisco',
  dateOfBirth: '1995-03-15',
  program: {
    name: 'Master of Science in Health Informatics',
    intake: 'Fall 2024',
    applicationDeadline: '2024-06-15',
    duration: '24 months'
  },
  stage: {
    current: 'Document Review',
    substage: 'Initial Assessment',
    progress: 45
  },
  applicationDate: '2024-02-10',
  priority: 'high',
  tags: ['International', 'STEM', 'High GPA']
};

export function StudentProfileSidebar({ applicantId }: StudentProfileSidebarProps) {
  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'document review':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-purple-100 text-purple-800';
      case 'final review':
        return 'bg-orange-100 text-orange-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-80 bg-muted/30 border-r p-4 space-y-4 overflow-y-auto">
      {/* Student Profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <User className="h-4 w-4 mr-2" />
            Student Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-start space-x-3 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={mockStudent.avatar} alt={`${mockStudent.firstName} ${mockStudent.lastName}`} />
              <AvatarFallback>
                {mockStudent.firstName[0]}{mockStudent.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">
                {mockStudent.firstName} {mockStudent.lastName}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {mockStudent.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {mockStudent.phone}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {mockStudent.city}, {mockStudent.country}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Age:</span>
              <span>
                {new Date().getFullYear() - new Date(mockStudent.dateOfBirth).getFullYear()} years
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Applied:</span>
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(mockStudent.applicationDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {mockStudent.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Program Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            Program Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-1">
                {mockStudent.program.name}
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center justify-between">
                  <span>Intake:</span>
                  <span className="font-medium">{mockStudent.program.intake}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Duration:</span>
                  <span>{mockStudent.program.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Deadline:</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(mockStudent.program.applicationDeadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Stage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Application Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Current Stage:</span>
              <Badge className={getStageColor(mockStudent.stage.current)}>
                {mockStudent.stage.current}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Substage:</span>
              <span className="text-xs font-medium">{mockStudent.stage.substage}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Priority:</span>
              <Badge className={getPriorityColor(mockStudent.priority)}>
                {mockStudent.priority}
              </Badge>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Progress:</span>
                <span className="text-xs font-medium">{mockStudent.stage.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mockStudent.stage.progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold text-green-600">12</div>
              <div className="text-xs text-muted-foreground">Documents</div>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold text-blue-600">3</div>
              <div className="text-xs text-muted-foreground">Essays</div>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold text-purple-600">85%</div>
              <div className="text-xs text-muted-foreground">AI Score</div>
            </div>
            <div className="p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold text-orange-600">42h</div>
              <div className="text-xs text-muted-foreground">Time Spent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}