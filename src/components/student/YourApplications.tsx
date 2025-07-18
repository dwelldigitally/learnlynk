import React from "react";
import { Calendar, Clock, CheckCircle, AlertCircle, Eye, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Application {
  id: string;
  programName: string;
  submissionDate: Date;
  status: 'submitted' | 'under-review' | 'documents-pending' | 'approved' | 'rejected' | 'waitlisted';
  stage: string;
  progress: number;
  nextStep?: string;
  estimatedDecision?: Date;
  documents: {
    name: string;
    status: 'pending' | 'approved' | 'rejected';
    uploadDate: Date;
  }[];
}

const YourApplications: React.FC = () => {
  // Mock applications data
  const applications: Application[] = [
    {
      id: "APP-2025-001",
      programName: "Health Care Assistant",
      submissionDate: new Date("2025-01-15"),
      status: "under-review",
      stage: "Document Review",
      progress: 75,
      nextStep: "Interview Scheduling",
      estimatedDecision: new Date("2025-02-15"),
      documents: [
        { name: "Official Transcripts", status: "approved", uploadDate: new Date("2025-01-15") },
        { name: "Photo ID", status: "approved", uploadDate: new Date("2025-01-15") },
        { name: "Immunization Records", status: "pending", uploadDate: new Date("2025-01-16") },
        { name: "Criminal Record Check", status: "approved", uploadDate: new Date("2025-01-14") },
        { name: "First Aid Certificate", status: "rejected", uploadDate: new Date("2025-01-16") },
      ]
    },
    {
      id: "APP-2024-045",
      programName: "Medical Office Assistant",
      submissionDate: new Date("2024-11-20"),
      status: "approved",
      stage: "Completed",
      progress: 100,
      estimatedDecision: new Date("2024-12-15"),
      documents: [
        { name: "Official Transcripts", status: "approved", uploadDate: new Date("2024-11-20") },
        { name: "Photo ID", status: "approved", uploadDate: new Date("2024-11-20") },
        { name: "Work Experience Letter", status: "approved", uploadDate: new Date("2024-11-21") },
      ]
    }
  ];

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'under-review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'documents-pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'waitlisted': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      case 'under-review': return <Clock className="w-4 h-4" />;
      case 'documents-pending': return <FileText className="w-4 h-4" />;
      case 'waitlisted': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Your Applications</h1>
        <p className="text-muted-foreground">Track the status and progress of all your submitted applications</p>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {applications.map((application) => (
          <Card key={application.id} className="p-6">
            {/* Application Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{application.programName}</h3>
                <p className="text-muted-foreground">Application ID: {application.id}</p>
                <p className="text-sm text-muted-foreground">
                  Submitted on {application.submissionDate.toLocaleDateString()}
                </p>
              </div>
              
              <div className="text-right">
                <Badge className={`${getStatusColor(application.status)} border`}>
                  {getStatusIcon(application.status)}
                  <span className="ml-2 capitalize">{application.status.replace('-', ' ')}</span>
                </Badge>
                {application.estimatedDecision && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Decision by: {application.estimatedDecision.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Application Progress</span>
                <span className="text-sm text-muted-foreground">{application.progress}%</span>
              </div>
              <Progress value={application.progress} className="h-2" />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">Current Stage: {application.stage}</span>
                {application.nextStep && (
                  <span className="text-sm text-blue-600">Next: {application.nextStep}</span>
                )}
              </div>
            </div>

            {/* Documents Status */}
            <div className="mb-4">
              <h4 className="font-medium mb-3">Document Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {doc.uploadDate.toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className={`${getDocumentStatusColor(doc.status)} text-xs`}>
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              
              {application.status === 'documents-pending' && (
                <Button size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Missing Documents
                </Button>
              )}
              
              {application.status === 'approved' && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Offer
                </Button>
              )}
              
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Appointment
              </Button>
            </div>

            {/* Special Messages */}
            {application.status === 'approved' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Congratulations! Your application has been approved.</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Please accept your offer and complete the enrollment process by February 1, 2025.
                </p>
              </div>
            )}

            {application.status === 'documents-pending' && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Action Required</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Some documents need attention. Please review and resubmit the rejected documents.
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* No Applications State */}
      {applications.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't submitted any applications yet. Start your journey by submitting your first application.
          </p>
          <Button>Start New Application</Button>
        </Card>
      )}
    </div>
  );
};

export default YourApplications;