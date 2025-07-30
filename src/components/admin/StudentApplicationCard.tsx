import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Calendar,
  AlertCircle,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { ProgramApplication } from "@/types/application";

interface StudentApplicationCardProps {
  application: ProgramApplication;
  studentId: string;
}

const StudentApplicationCard: React.FC<StudentApplicationCardProps> = ({ 
  application, 
  studentId 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "LEAD_FORM": return "outline";
      case "SEND_DOCUMENTS": return "secondary";
      case "DOCUMENT_APPROVAL": return "default";
      case "FEE_PAYMENT": return "default";
      case "ACCEPTED": return "secondary";
      default: return "outline";
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case "LEAD_FORM": return <FileText className="h-4 w-4" />;
      case "SEND_DOCUMENTS": return <Clock className="h-4 w-4" />;
      case "DOCUMENT_APPROVAL": return <Clock className="h-4 w-4" />;
      case "FEE_PAYMENT": return <Calendar className="h-4 w-4" />;
      case "ACCEPTED": return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getAcceptanceLikelihoodColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const handleStageProgression = (newStage: string) => {
    // Handle stage progression logic
    console.log(`Progressing application ${application.id} to ${newStage}`);
  };

  const handleApproval = () => {
    // Handle application approval
    console.log(`Approving application ${application.id}`);
  };

  const handleRejection = () => {
    // Handle application rejection
    console.log(`Rejecting application ${application.id}`);
  };

  const pendingDocuments = application.documents.filter(doc => 
    doc.status === 'pending' || doc.status === 'under-review'
  ).length;

  const approvedDocuments = application.documents.filter(doc => 
    doc.status === 'approved'
  ).length;

  const rejectedDocuments = application.documents.filter(doc => 
    doc.status === 'rejected'
  ).length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStageIcon(application.stage)}
              {application.programName}
              <Badge variant={getStageColor(application.stage)}>
                {application.stage.replace('_', ' ')}
              </Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Application ID: {application.id}
            </p>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getAcceptanceLikelihoodColor(application.acceptanceLikelihood)}`}>
              <TrendingUp className="h-3 w-3 inline mr-1" />
              {application.acceptanceLikelihood}% likely
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Application Progress</span>
            <span className="font-medium">{application.progress}%</span>
          </div>
          <Progress value={application.progress} className="h-2" />
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Submitted</p>
            <p className="font-medium text-sm">
              {application.submissionDate?.toLocaleDateString() || 'Not submitted'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Deadline</p>
            <p className="font-medium text-sm">{application.applicationDeadline}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Documents</p>
            <p className="font-medium text-sm">
              {approvedDocuments}/{application.requirements.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Decision Date</p>
            <p className="font-medium text-sm">
              {application.estimatedDecision?.toLocaleDateString() || 'TBD'}
            </p>
          </div>
        </div>

        {/* Next Step Alert */}
        {application.nextStep && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Next Step:</strong> {application.nextStep}
            </AlertDescription>
          </Alert>
        )}

        {/* Document Status */}
        {application.documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Document Status</h4>
            <div className="flex gap-4 text-sm">
              {approvedDocuments > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-3 w-3" />
                  {approvedDocuments} approved
                </div>
              )}
              {pendingDocuments > 0 && (
                <div className="flex items-center gap-1 text-yellow-600">
                  <Clock className="h-3 w-3" />
                  {pendingDocuments} pending
                </div>
              )}
              {rejectedDocuments > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <XCircle className="h-3 w-3" />
                  {rejectedDocuments} rejected
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {application.stage === "DOCUMENT_APPROVAL" && (
            <>
              <Button 
                size="sm" 
                onClick={handleApproval}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                Approve Application
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleRejection}
                className="flex items-center gap-1"
              >
                <XCircle className="h-3 w-3" />
                Request Revision
              </Button>
            </>
          )}
          
          {application.stage === "FEE_PAYMENT" && (
            <Button 
              size="sm"
              onClick={() => handleStageProgression("ACCEPTED")}
              className="flex items-center gap-1"
            >
              <ArrowRight className="h-3 w-3" />
              Mark as Paid
            </Button>
          )}

          {application.stage === "SEND_DOCUMENTS" && (
            <Button 
              size="sm"
              onClick={() => handleStageProgression("DOCUMENT_APPROVAL")}
              className="flex items-center gap-1"
            >
              <ArrowRight className="h-3 w-3" />
              Review Documents
            </Button>
          )}

          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'View Details'}
          </Button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Program Requirements</h4>
              <div className="space-y-2">
                {application.requirements.map((req) => {
                  const hasDocument = application.documents.some(doc => 
                    doc.requirementId === req.id
                  );
                  const documentStatus = application.documents.find(doc => 
                    doc.requirementId === req.id
                  )?.status;

                  return (
                    <div key={req.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">{req.name}</p>
                        <p className="text-xs text-muted-foreground">{req.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {req.mandatory && (
                          <Badge variant="outline" className="text-xs">Required</Badge>
                        )}
                        {hasDocument ? (
                          <Badge variant={
                            documentStatus === 'approved' ? 'default' :
                            documentStatus === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {documentStatus}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Missing</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentApplicationCard;