import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Award,
  Calendar,
  BookOpen,
  LogOut,
  Filter
} from 'lucide-react';

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Students', value: '24', icon: Users, color: 'text-blue-500' },
    { label: 'Pending Reviews', value: '8', icon: Clock, color: 'text-orange-500' },
    { label: 'Completed Today', value: '12', icon: CheckCircle, color: 'text-green-500' },
    { label: 'Needs Attention', value: '3', icon: AlertCircle, color: 'text-red-500' }
  ];

  const pendingReviews = [
    {
      student: 'Sarah Johnson',
      type: 'Attendance',
      batch: 'Spring 2024 - Cohort A',
      submitted: '2 hours ago',
      priority: 'high',
      details: '8 hours at City General Hospital'
    },
    {
      student: 'Michael Chen',
      type: 'Competency',
      batch: 'Spring 2024 - Cohort A',
      submitted: '4 hours ago',
      priority: 'medium',
      details: 'IV Insertion - Self Assessment'
    },
    {
      student: 'Emily Davis',
      type: 'Journal',
      batch: 'Spring 2024 - Cohort B',
      submitted: '1 day ago',
      priority: 'low',
      details: 'Week 3 Reflection'
    },
    {
      student: 'James Wilson',
      type: 'Evaluation',
      batch: 'Spring 2024 - Cohort A',
      submitted: '3 hours ago',
      priority: 'high',
      details: 'Midterm Self-Evaluation'
    }
  ];

  const recentActivity = [
    { action: 'Approved attendance for Lisa Brown', time: '10 minutes ago' },
    { action: 'Completed competency review for Alex Thompson', time: '1 hour ago' },
    { action: 'Graded journal reflection for Maria Garcia', time: '2 hours ago' },
    { action: 'Signed off on final evaluation for David Lee', time: '3 hours ago' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Attendance': return Clock;
      case 'Competency': return Award;
      case 'Journal': return BookOpen;
      case 'Evaluation': return FileText;
      default: return FileText;
    }
  };

  const handleLogout = () => {
    navigate('/instructor/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Instructor Dashboard</h1>
              <p className="text-muted-foreground">Dr. Jennifer Martinez • Clinical Instructor</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/instructor/batches')}
              >
                <Users className="h-4 w-4 mr-2" />
                View Batches
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pending Reviews</CardTitle>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingReviews.map((review, index) => {
                  const Icon = getTypeIcon(review.type);
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/instructor/review/${review.type.toLowerCase()}/${index}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{review.student}</div>
                          <div className="text-sm text-muted-foreground">
                            {review.type} • {review.details}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {review.batch}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getPriorityColor(review.priority)}>
                          {review.priority}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {review.submitted}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div className="flex-1">
                        <div className="text-sm">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/instructor/review/attendance')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Review Attendance (3 pending)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/instructor/review/competency')}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Evaluate Competencies (2 pending)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/instructor/review/journal')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Grade Journals (1 pending)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/instructor/review/evaluation')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Final Evaluations (2 pending)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;