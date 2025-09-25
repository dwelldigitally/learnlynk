import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Calendar, DollarSign, Download, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { usePageEntranceAnimation } from '@/hooks/useAnimations';

interface AwardPackage {
  id: string;
  title: string;
  academicYear: string;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'declined' | 'partial';
  awards: Award[];
  disbursements: Disbursement[];
  acceptanceDeadline: string;
}

interface Award {
  id: string;
  name: string;
  type: 'grant' | 'scholarship' | 'loan' | 'work-study';
  amount: number;
  status: 'offered' | 'accepted' | 'declined';
  renewable: boolean;
  requirements?: string[];
}

interface Disbursement {
  id: string;
  awardId: string;
  amount: number;
  scheduledDate: string;
  actualDate?: string;
  status: 'pending' | 'processed' | 'failed';
  semester: string;
}

const mockAwardPackages: AwardPackage[] = [
  {
    id: '1',
    title: 'Financial Aid Package 2024-2025',
    academicYear: '2024-2025',
    totalAmount: 12500,
    status: 'pending',
    acceptanceDeadline: '2024-05-01',
    awards: [
      {
        id: 'a1',
        name: 'Federal Pell Grant',
        type: 'grant',
        amount: 6895,
        status: 'offered',
        renewable: true,
        requirements: ['Maintain satisfactory academic progress', 'Complete FAFSA annually']
      },
      {
        id: 'a2',
        name: 'Academic Excellence Scholarship',
        type: 'scholarship',
        amount: 2500,
        status: 'offered',
        renewable: true,
        requirements: ['Maintain 3.5 GPA', 'Full-time enrollment']
      },
      {
        id: 'a3',
        name: 'Federal Direct Subsidized Loan',
        type: 'loan',
        amount: 3105,
        status: 'offered',
        renewable: true,
        requirements: ['Complete entrance counseling', 'Sign Master Promissory Note']
      }
    ],
    disbursements: [
      {
        id: 'd1',
        awardId: 'a1',
        amount: 3447.50,
        scheduledDate: '2024-08-15',
        status: 'pending',
        semester: 'Fall 2024'
      },
      {
        id: 'd2',
        awardId: 'a1',
        amount: 3447.50,
        scheduledDate: '2025-01-15',
        status: 'pending',
        semester: 'Spring 2025'
      }
    ]
  }
];

const awardTypeColors = {
  grant: 'bg-green-100 text-green-700',
  scholarship: 'bg-blue-100 text-blue-700',
  loan: 'bg-orange-100 text-orange-700',
  'work-study': 'bg-purple-100 text-purple-700'
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
  partial: 'bg-blue-100 text-blue-700',
  offered: 'bg-blue-100 text-blue-700',
  processed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700'
};

export function FinancialAidAwards() {
  const controls = usePageEntranceAnimation();
  const [selectedPackage, setSelectedPackage] = useState(mockAwardPackages[0]);

  const handleAcceptAward = (awardId: string) => {
    console.log('Accepting award:', awardId);
  };

  const handleDeclineAward = (awardId: string) => {
    console.log('Declining award:', awardId);
  };

  const handleDownloadAwardLetter = () => {
    console.log('Downloading award letter');
  };

  const totalAcceptedAmount = selectedPackage.awards
    .filter(award => award.status === 'accepted')
    .reduce((sum, award) => sum + award.amount, 0);

  const upcomingDisbursements = selectedPackage.disbursements
    .filter(d => d.status === 'pending' && new Date(d.scheduledDate) >= new Date())
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financial Aid Awards</h1>
            <p className="text-muted-foreground mt-2">
              View and manage your financial aid awards and disbursements
            </p>
          </div>
        </div>
        <Button onClick={handleDownloadAwardLetter} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Award Letter
        </Button>
      </div>

      {/* Award Package Overview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">{selectedPackage.title}</CardTitle>
              <p className="text-muted-foreground">Academic Year: {selectedPackage.academicYear}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                ${selectedPackage.totalAmount.toLocaleString()}
              </p>
              <Badge className={statusColors[selectedPackage.status]}>
                {selectedPackage.status.charAt(0).toUpperCase() + selectedPackage.status.slice(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Total Accepted</p>
              <p className="text-2xl font-bold text-green-700">
                ${totalAcceptedAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Awards Offered</p>
              <p className="text-2xl font-bold text-blue-700">
                {selectedPackage.awards.length}
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-600">Acceptance Deadline</p>
              <p className="text-lg font-bold text-amber-700">
                {new Date(selectedPackage.acceptanceDeadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="awards" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="awards">Award Details</TabsTrigger>
          <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="awards" className="space-y-4">
          {selectedPackage.awards.map((award) => (
            <Card key={award.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{award.name}</CardTitle>
                      <Badge className={awardTypeColors[award.type]}>
                        {award.type.charAt(0).toUpperCase() + award.type.slice(1)}
                      </Badge>
                      {award.renewable && (
                        <Badge variant="outline">Renewable</Badge>
                      )}
                    </div>
                    {award.requirements && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Requirements:</p>
                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                          {award.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-2xl font-bold text-primary">
                      ${award.amount.toLocaleString()}
                    </p>
                    <Badge className={statusColors[award.status]}>
                      {award.status.charAt(0).toUpperCase() + award.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {award.status === 'offered' && (
                  <div className="flex gap-2">
                    <Button onClick={() => handleAcceptAward(award.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Award
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDeclineAward(award.id)}
                    >
                      Decline Award
                    </Button>
                  </div>
                )}
                {award.status === 'accepted' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Award accepted and will be disbursed according to schedule</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="disbursements" className="space-y-4">
          {upcomingDisbursements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Disbursements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDisbursements.map((disbursement) => {
                    const award = selectedPackage.awards.find(a => a.id === disbursement.awardId);
                    return (
                      <div key={disbursement.id} className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <div>
                          <p className="font-medium">{award?.name}</p>
                          <p className="text-sm text-muted-foreground">{disbursement.semester}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${disbursement.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(disbursement.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>All Disbursements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedPackage.disbursements.map((disbursement) => {
                  const award = selectedPackage.awards.find(a => a.id === disbursement.awardId);
                  const StatusIcon = disbursement.status === 'processed' ? CheckCircle : 
                                   disbursement.status === 'failed' ? AlertTriangle : Clock;
                  
                  return (
                    <div key={disbursement.id} className="flex justify-between items-center p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`h-5 w-5 ${
                          disbursement.status === 'processed' ? 'text-green-600' :
                          disbursement.status === 'failed' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                        <div>
                          <p className="font-medium">{award?.name}</p>
                          <p className="text-sm text-muted-foreground">{disbursement.semester}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${disbursement.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {disbursement.actualDate || disbursement.scheduledDate}
                        </p>
                        <Badge className={statusColors[disbursement.status]} variant="outline">
                          {disbursement.status.charAt(0).toUpperCase() + disbursement.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-8 text-center">
              <Download className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Award Documents</h3>
              <p className="text-muted-foreground mb-4">
                Download important financial aid documents
              </p>
              <div className="flex flex-col gap-2 max-w-xs mx-auto">
                <Button onClick={handleDownloadAwardLetter}>
                  <Download className="h-4 w-4 mr-2" />
                  Award Letter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Disbursement Schedule
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  1098-T Tax Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}