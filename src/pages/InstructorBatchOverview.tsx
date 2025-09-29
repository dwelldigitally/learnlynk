import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  User
} from 'lucide-react';

const InstructorBatchOverview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const navigate = useNavigate();

  const batches = [
    {
      id: 'spring-2024-a',
      name: 'Spring 2024 - Cohort A',
      program: 'Nursing Practicum',
      students: 12,
      pendingReviews: 5,
      avgProgress: 78,
      startDate: '2024-02-15',
      endDate: '2024-05-15',
      site: 'City General Hospital'
    },
    {
      id: 'spring-2024-b',
      name: 'Spring 2024 - Cohort B',
      program: 'Medical Assistant Practicum',
      students: 8,
      pendingReviews: 2,
      avgProgress: 85,
      startDate: '2024-02-20',
      endDate: '2024-05-20',
      site: 'Community Health Center'
    },
    {
      id: 'winter-2024',
      name: 'Winter 2024 - Advanced',
      program: 'Advanced Clinical Practice',
      students: 6,
      pendingReviews: 1,
      avgProgress: 92,
      startDate: '2024-01-10',
      endDate: '2024-04-10',
      site: 'Regional Medical Center'
    }
  ];

  const students = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      progress: 82,
      attendanceHours: 145,
      requiredHours: 180,
      competenciesCompleted: 8,
      totalCompetencies: 12,
      lastActivity: '2 hours ago',
      status: 'active',
      pendingItems: 2
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      progress: 75,
      attendanceHours: 135,
      requiredHours: 180,
      competenciesCompleted: 7,
      totalCompetencies: 12,
      lastActivity: '1 day ago',
      status: 'active',
      pendingItems: 1
    },
    {
      id: '3',
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      progress: 88,
      attendanceHours: 158,
      requiredHours: 180,
      competenciesCompleted: 10,
      totalCompetencies: 12,
      lastActivity: '4 hours ago',
      status: 'active',
      pendingItems: 0
    }
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (pendingItems: number) => {
    if (pendingItems === 0) {
      return <Badge className="bg-green-100 text-green-800">Up to date</Badge>;
    }
    if (pendingItems <= 2) {
      return <Badge className="bg-yellow-100 text-yellow-800">Review needed</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Urgent review</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/instructor/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Student Batches</h1>
                <p className="text-muted-foreground">Manage and review student progress by batch</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {!selectedBatch ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search batches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map((batch) => (
                <Card 
                  key={batch.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedBatch(batch.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{batch.name}</span>
                      {batch.pendingReviews > 0 && (
                        <Badge className="bg-orange-100 text-orange-800">
                          {batch.pendingReviews} pending
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{batch.program}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{batch.site}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{batch.startDate} to {batch.endDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{batch.students} students</span>
                      </div>
                      <span className={`text-sm font-medium ${getProgressColor(batch.avgProgress)}`}>
                        {batch.avgProgress}% avg progress
                      </span>
                    </div>
                    <Progress value={batch.avgProgress} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedBatch(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Batches
              </Button>
              <div>
                <h2 className="text-xl font-bold">Spring 2024 - Cohort A</h2>
                <p className="text-muted-foreground">Nursing Practicum • City General Hospital</p>
              </div>
            </div>

            <div className="space-y-6">
              {students.map((student) => (
                <Card key={student.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {getStatusBadge(student.pendingItems)}
                        <Button 
                          size="sm"
                          onClick={() => navigate(`/instructor/student/${student.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Overall Progress</span>
                          <span className={`text-sm font-medium ${getProgressColor(student.progress)}`}>
                            {student.progress}%
                          </span>
                        </div>
                        <Progress value={student.progress} className="h-2" />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Attendance Hours</span>
                          <span className="text-sm">
                            {student.attendanceHours}/{student.requiredHours}
                          </span>
                        </div>
                        <Progress 
                          value={(student.attendanceHours / student.requiredHours) * 100} 
                          className="h-2" 
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Competencies</span>
                          <span className="text-sm">
                            {student.competenciesCompleted}/{student.totalCompetencies}
                          </span>
                        </div>
                        <Progress 
                          value={(student.competenciesCompleted / student.totalCompetencies) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last activity: {student.lastActivity}</span>
                      </div>
                      {student.pendingItems > 0 && (
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{student.pendingItems} items need review</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorBatchOverview;