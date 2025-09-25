import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, DollarSign, FileText, Plus } from 'lucide-react';
import { usePageEntranceAnimation } from '@/hooks/useAnimations';

interface FinancialAidApplication {
  id: string;
  title: string;
  type: 'grant' | 'scholarship' | 'loan' | 'work-study';
  amount: number;
  deadline: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'under-review' | 'approved' | 'denied';
  progress: number;
  description: string;
  requirements: string[];
  documentsRequired: number;
  documentsSubmitted: number;
}

const mockApplications: FinancialAidApplication[] = [
  {
    id: '1',
    title: 'Federal Pell Grant',
    type: 'grant',
    amount: 6895,
    deadline: '2024-06-30',
    status: 'approved',
    progress: 100,
    description: 'Need-based federal grant for undergraduate students',
    requirements: ['FAFSA Completion', 'Enrollment Verification'],
    documentsRequired: 2,
    documentsSubmitted: 2
  },
  {
    id: '2',
    title: 'Academic Excellence Scholarship',
    type: 'scholarship',
    amount: 2500,
    deadline: '2024-03-15',
    status: 'in-progress',
    progress: 75,
    description: 'Merit-based scholarship for high-achieving students',
    requirements: ['Transcript', 'Essay', 'Letter of Recommendation'],
    documentsRequired: 3,
    documentsSubmitted: 2
  },
  {
    id: '3',
    title: 'Federal Work-Study Program',
    type: 'work-study',
    amount: 3000,
    deadline: '2024-04-01',
    status: 'not-started',
    progress: 0,
    description: 'Part-time employment program to help pay education costs',
    requirements: ['FAFSA Completion', 'Work Study Application'],
    documentsRequired: 2,
    documentsSubmitted: 0
  },
  {
    id: '4',
    title: 'Student Emergency Fund',
    type: 'grant',
    amount: 1000,
    deadline: '2024-12-31',
    status: 'submitted',
    progress: 100,
    description: 'Emergency financial assistance for unexpected expenses',
    requirements: ['Application Form', 'Supporting Documentation'],
    documentsRequired: 2,
    documentsSubmitted: 2
  }
];

const statusColors = {
  'not-started': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-primary/10 text-primary',
  'submitted': 'bg-blue-100 text-blue-700',
  'under-review': 'bg-amber-100 text-amber-700',
  'approved': 'bg-green-100 text-green-700',
  'denied': 'bg-red-100 text-red-700'
};

const typeColors = {
  'grant': 'bg-green-100 text-green-700',
  'scholarship': 'bg-blue-100 text-blue-700',
  'loan': 'bg-orange-100 text-orange-700',
  'work-study': 'bg-purple-100 text-purple-700'
};

export function FinancialAidApplications() {
  const controls = usePageEntranceAnimation();

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'submitted': return 'Submitted';
      case 'under-review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'denied': return 'Denied';
      default: return status;
    }
  };

  const handleStartApplication = (id: string) => {
    console.log('Starting application:', id);
  };

  const handleContinueApplication = (id: string) => {
    console.log('Continuing application:', id);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Aid Applications</h1>
          <p className="text-muted-foreground mt-2">
            Manage your financial aid applications and track their progress
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Browse More Aid
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applied</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">1</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">1</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-primary">$13,395</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {mockApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{application.title}</CardTitle>
                    <Badge className={typeColors[application.type]}>
                      {application.type.charAt(0).toUpperCase() + application.type.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{application.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${application.amount.toLocaleString()}
                  </p>
                  <Badge className={statusColors[application.status]}>
                    {getStatusText(application.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {new Date(application.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Documents: {application.documentsSubmitted}/{application.documentsRequired}</span>
                </div>
              </div>

              {application.status === 'in-progress' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{application.progress}%</span>
                  </div>
                  <Progress value={application.progress} className="h-2" />
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {application.requirements.map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {application.status === 'not-started' && (
                    <Button onClick={() => handleStartApplication(application.id)}>
                      Start Application
                    </Button>
                  )}
                  {application.status === 'in-progress' && (
                    <Button onClick={() => handleContinueApplication(application.id)}>
                      Continue Application
                    </Button>
                  )}
                  {application.status === 'approved' && (
                    <Button variant="outline">View Award Letter</Button>
                  )}
                  <Button variant="outline">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}