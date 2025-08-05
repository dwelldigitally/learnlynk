import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  AlertTriangle,
  TrendingUp,
  User,
  Star
} from 'lucide-react';

interface StudentSidebarProps {
  student: any;
  onUpdate: () => void;
}

export function StudentSidebar({ student, onUpdate }: StudentSidebarProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="w-80 border-r bg-card overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Student Profile Card */}
        <Card>
          <CardHeader className="text-center pb-4">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarFallback className="text-2xl">
                {student.firstName?.[0]}{student.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">{student.firstName} {student.lastName}</CardTitle>
            <p className="text-sm text-muted-foreground">ID: {student.studentId}</p>
            <Badge variant="outline" className="mt-2">
              {student.program}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Application Progress</span>
                <span>{student.progress}%</span>
              </div>
              <Progress value={student.progress} className="h-2" />
            </div>
            
            <Separator />
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{student.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{student.city}, {student.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Applied: {new Date(student.applicationDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Level</span>
              <Badge className={getRiskColor(student.risk_level)}>
                {student.risk_level?.charAt(0).toUpperCase() + student.risk_level?.slice(1)}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Acceptance Likelihood</span>
                <span>{student.acceptanceLikelihood}%</span>
              </div>
              <Progress value={student.acceptanceLikelihood} className="h-2" />
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Academic performance: Strong</p>
              <p>• Document completion: On track</p>
              <p>• Payment history: Good</p>
            </div>
          </CardContent>
        </Card>

        {/* Academic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-4 w-4" />
              Academic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>GPA</span>
              <span className="font-medium">{student.gpa}</span>
            </div>
            <div className="flex justify-between">
              <span>SAT Score</span>
              <span className="font-medium">{student.testScores?.SAT}</span>
            </div>
            <div className="flex justify-between">
              <span>TOEFL Score</span>
              <span className="font-medium">{student.testScores?.TOEFL}</span>
            </div>
            <div className="flex justify-between">
              <span>Expected Start</span>
              <span className="font-medium">{new Date(student.expectedStartDate).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Advisor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Assigned Advisor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {student.advisor?.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{student.advisor?.name}</p>
                <p className="text-xs text-muted-foreground">{student.advisor?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Flag for Review
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Update Status
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}