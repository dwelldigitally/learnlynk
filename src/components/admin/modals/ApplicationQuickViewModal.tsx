import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, FileText, User, MapPin, Mail, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { StudentApplication } from '@/types/application';
import { format } from 'date-fns';

interface ApplicationQuickViewModalProps {
  application: StudentApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onViewFullProfile: (studentId: string) => void;
}

export function ApplicationQuickViewModal({ 
  application, 
  isOpen, 
  onClose, 
  onViewFullProfile 
}: ApplicationQuickViewModalProps) {
  if (!application) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'pending-documents': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'ACCEPTED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FEE_PAYMENT': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'DOCUMENT_APPROVAL': return <FileText className="h-4 w-4 text-orange-600" />;
      case 'SEND_DOCUMENTS': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {application.studentName} - Application Quick View
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{application.studentName}</h3>
              <p className="text-sm text-muted-foreground">{application.program}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {application.email}
                </span>
                {application.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {application.phone}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right space-y-2">
              <Badge className={getStatusColor(application.status)}>
                {application.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {getStageIcon(application.stage)}
                {application.stage.replace('_', ' ').toLowerCase()}
              </div>
            </div>
          </div>

          {/* Progress */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Application Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{application.progress}%</span>
                </div>
                <Progress value={application.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Documents: {application.documentsSubmitted}/{application.documentsRequired}</span>
                  <span>Acceptance Likelihood: {application.acceptanceLikelihood}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Application Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{format(application.applicationDate, 'MMM dd, yyyy')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Advisor Assigned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{application.advisorAssigned || 'Not assigned'}</p>
              </CardContent>
            </Card>

            {application.estimatedDecision && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Estimated Decision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{format(application.estimatedDecision, 'MMM dd, yyyy')}</p>
                </CardContent>
              </Card>
            )}

            {(application.country || application.city) && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {[application.city, application.country].filter(Boolean).join(', ')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              onClick={() => onViewFullProfile(application.studentId)}
              className="flex-1"
            >
              View Full Profile
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}