
import React, { useState } from "react";
import { Calendar, Clock, CheckCircle, AlertCircle, Eye, FileText, CalendarIcon, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { studentApplications } from "@/data/studentApplications";
import { ProgramApplication } from "@/types/application";
import { usePageEntranceAnimation, useStaggeredReveal } from "@/hooks/useAnimations";
import ApplicationWizard from "./application/ApplicationWizard";
import { ApplicationData } from "@/services/applicationService";
import { dummyApplications, dummyStudentProfile } from "@/data/studentPortalDummyData";

const YourApplications: React.FC = () => {
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState<ProgramApplication | null>(null);
  
  // Animation hooks
  const isLoaded = usePageEntranceAnimation();
  const { visibleItems, ref: staggerRef } = useStaggeredReveal(6, 150);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Application wizard state
  const [showWizard, setShowWizard] = useState(false);
  const [editingApplication, setEditingApplication] = useState<ApplicationData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);

  // Convert studentApplications object to array for display
  const existingApplications: ProgramApplication[] = Object.values(studentApplications).filter(app => 
    app.submissionDate || app.stage !== "LEAD_FORM" // Only show submitted applications or those in progress
  );

  const handleApplicationCreated = (newApplication: ApplicationData) => {
    setApplications(prev => [...prev, newApplication]);
    setShowWizard(false);
    setEditingApplication(null);
    toast({
      title: "Application Created!",
      description: "Your new application has been saved successfully."
    });
  };

  const handleCloseWizard = () => {
    setShowWizard(false);
    setEditingApplication(null);
  };

  const getStatusColor = (stage: string) => {
    switch (stage) {
      case 'ACCEPTED': return 'bg-green-100 text-green-800 border-green-200';
      case 'FEE_PAYMENT': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DOCUMENT_APPROVAL': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SEND_DOCUMENTS': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (stage: string) => {
    switch (stage) {
      case 'ACCEPTED': return <CheckCircle className="w-4 h-4" />;
      case 'FEE_PAYMENT': return <CheckCircle className="w-4 h-4" />;
      case 'DOCUMENT_APPROVAL': return <Clock className="w-4 h-4" />;
      case 'SEND_DOCUMENTS': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusText = (stage: string) => {
    switch (stage) {
      case 'ACCEPTED': return 'Accepted';
      case 'FEE_PAYMENT': return 'Fee Payment Required';
      case 'DOCUMENT_APPROVAL': return 'Document Review';
      case 'SEND_DOCUMENTS': return 'Documents Required';
      default: return 'In Progress';
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show wizard if showWizard is true
  if (showWizard) {
    return (
      <ApplicationWizard
        onClose={handleCloseWizard}
        onApplicationCreated={handleApplicationCreated}
        editingApplication={editingApplication}
      />
    );
  }

  return (
    <div className={`space-y-8 p-6 md:p-8 lg:p-10 ${isLoaded ? 'animate-fade-up' : 'opacity-0'}`}>
      {/* Header with Application Summary */}
      <div className="animate-slide-down mb-10 px-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Main Header */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Your Applications</h1>
                <p className="text-muted-foreground text-lg">Track your journey and manage your applications in one place</p>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{applications.length + existingApplications.length}</div>
              <div className="text-sm text-muted-foreground">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{existingApplications.filter(app => app.stage === 'ACCEPTED').length}</div>
              <div className="text-sm text-muted-foreground">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{existingApplications.filter(app => app.stage === 'DOCUMENT_APPROVAL').length}</div>
              <div className="text-sm text-muted-foreground">In Review</div>
            </div>
          </div>
        </div>
        
        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl">
          <div>
            <h3 className="font-semibold text-lg text-primary mb-1">Ready to start your next application?</h3>
            <p className="text-muted-foreground">Begin a new application or continue where you left off</p>
          </div>
          <Button onClick={() => setShowWizard(true)} size="lg" className="flex items-center gap-2 px-6 py-3">
            <Plus className="w-5 h-5" />
            Start New Application
          </Button>
        </div>
      </div>

      {/* Applications List */}
      <div ref={staggerRef} className="space-y-8 px-2">
        {/* Application Status Filter */}
        {(applications.length > 0 || existingApplications.length > 0) && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="bg-background">All Applications</Button>
            <Button variant="ghost" size="sm">In Progress</Button>
            <Button variant="ghost" size="sm">Under Review</Button>
            <Button variant="ghost" size="sm">Accepted</Button>
            <Button variant="ghost" size="sm">Pending Documents</Button>
          </div>
        )}

        {/* New Applications */}
        {applications.map((application, index) => (
          <Card key={application.id} className={`p-10 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border-l-4 border-l-primary mx-2 ${visibleItems[index] ? `animate-stagger-${Math.min(index + 1, 5)}` : 'opacity-0'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{application.program_name}</h3>
                <p className="text-muted-foreground">Application ID: {application.id}</p>
                {application.created_at && (
                  <p className="text-sm text-muted-foreground">
                    Created on {new Date(application.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <Badge className={`${getStatusColor(application.stage)} border`}>
                  {getStatusIcon(application.stage)}
                  <span className="ml-2">{getStatusText(application.stage)}</span>
                </Badge>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Application Progress</span>
                <span className="text-sm text-muted-foreground">{application.progress}%</span>
              </div>
              <Progress value={application.progress} className="h-2" />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">Current Stage: {getStatusText(application.stage)}</span>
                <span className="text-sm text-blue-600">Status: {application.status}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setEditingApplication(application);
                  setShowWizard(true);
                }}
              >
                Continue Application
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Application Details",
                    description: "Detailed view coming soon!"
                  });
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        ))}

        {/* Existing Applications */}
        {existingApplications.map((application, index) => (
          <Card key={application.id} className={`p-10 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border-l-4 mx-2 ${
            application.stage === 'ACCEPTED' ? 'border-l-green-500' : 
            application.stage === 'DOCUMENT_APPROVAL' ? 'border-l-yellow-500' :
            application.stage === 'SEND_DOCUMENTS' ? 'border-l-orange-500' : 'border-l-gray-300'
          } ${visibleItems[index] ? `animate-stagger-${Math.min(index + 1, 5)}` : 'opacity-0'}`}>
            {/* Application Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{application.programName}</h3>
                <p className="text-muted-foreground">Application ID: {application.id}</p>
                {application.submissionDate && (
                  <p className="text-sm text-muted-foreground">
                    Submitted on {application.submissionDate.toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <Badge className={`${getStatusColor(application.stage)} border`}>
                  {getStatusIcon(application.stage)}
                  <span className="ml-2">{getStatusText(application.stage)}</span>
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
                <span className="text-sm text-muted-foreground">Current Stage: {getStatusText(application.stage)}</span>
                {application.nextStep && (
                  <span className="text-sm text-blue-600">Next: {application.nextStep}</span>
                )}
              </div>
            </div>

            {/* Documents Status */}
            <div className="mb-4">
              <h4 className="font-medium mb-3">Document Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {application.documents.length > 0 ? (
                  application.documents.map((doc, index) => (
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
                  ))
                ) : (
                  <div className="col-span-full text-center py-4 text-muted-foreground">
                    No documents uploaded yet
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedApplication(application);
                  setIsDetailsModalOpen(true);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              
              {application.stage === 'SEND_DOCUMENTS' && (
                <Button 
                  size="sm"
                  onClick={() => navigate("/student/dashboard")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Upload Documents
                </Button>
              )}
              
              {application.stage === 'ACCEPTED' && (
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Offer
                </Button>
              )}
              
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      if (date) {
                        toast({
                          title: "Appointment Scheduled",
                          description: `Your appointment has been scheduled for ${format(date, "PPP")}. You will receive a confirmation email shortly.`
                        });
                        setIsCalendarOpen(false);
                      }
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Special Messages */}
            {application.stage === 'ACCEPTED' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Congratulations! Your application has been approved.</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Please accept your offer and complete the enrollment process by {application.applicationDeadline}.
                </p>
              </div>
            )}

            {application.stage === 'SEND_DOCUMENTS' && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Action Required</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Please upload all required documents to proceed with your application.
                </p>
              </div>
            )}

            {application.documents.some(doc => doc.status === 'rejected') && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Documents Need Attention</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Some documents have been rejected. Please check the comments and resubmit.
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* No Applications State */}
      {applications.length === 0 && existingApplications.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't submitted any applications yet. Start your journey by submitting your first application.
          </p>
          <Button onClick={() => setShowWizard(true)}>Start New Application</Button>
        </Card>
      )}

      {/* Application Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details - {selectedApplication?.programName}</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Application Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Application Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">ID:</span> {selectedApplication.id}</p>
                    <p><span className="font-medium">Program:</span> {selectedApplication.programName}</p>
                    <p><span className="font-medium">Stage:</span> {getStatusText(selectedApplication.stage)}</p>
                    <p><span className="font-medium">Progress:</span> {selectedApplication.progress}%</p>
                    {selectedApplication.submissionDate && (
                      <p><span className="font-medium">Submitted:</span> {selectedApplication.submissionDate.toLocaleDateString()}</p>
                    )}
                    {selectedApplication.estimatedDecision && (
                      <p><span className="font-medium">Decision by:</span> {selectedApplication.estimatedDecision.toLocaleDateString()}</p>
                    )}
                    <p><span className="font-medium">Acceptance Likelihood:</span> {selectedApplication.acceptanceLikelihood}%</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Next Steps</h3>
                  <div className="space-y-1 text-sm">
                    {selectedApplication.nextStep && (
                      <p><span className="font-medium">Next Action:</span> {selectedApplication.nextStep}</p>
                    )}
                    {selectedApplication.applicationDeadline && (
                      <p><span className="font-medium">Deadline:</span> {selectedApplication.applicationDeadline}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div>
                <h3 className="font-semibold mb-3">Application Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Application Submitted</p>
                      <p className="text-sm text-green-600">
                        {selectedApplication.submissionDate?.toLocaleDateString() || "Not submitted yet"}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${
                    selectedApplication.stage === 'SEND_DOCUMENTS' || selectedApplication.stage === 'DOCUMENT_APPROVAL'
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <Clock className={`w-5 h-5 ${
                      selectedApplication.stage === 'SEND_DOCUMENTS' || selectedApplication.stage === 'DOCUMENT_APPROVAL'
                        ? 'text-blue-600'
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <p className={`font-medium ${
                        selectedApplication.stage === 'SEND_DOCUMENTS' || selectedApplication.stage === 'DOCUMENT_APPROVAL'
                          ? 'text-blue-800'
                          : 'text-gray-600'
                      }`}>Document Review</p>
                      <p className={`text-sm ${
                        selectedApplication.stage === 'SEND_DOCUMENTS' || selectedApplication.stage === 'DOCUMENT_APPROVAL'
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      }`}>
                        {selectedApplication.stage === 'SEND_DOCUMENTS' 
                          ? 'Upload required documents'
                          : selectedApplication.stage === 'DOCUMENT_APPROVAL'
                          ? 'Documents under review'
                          : 'Pending previous steps'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-3 rounded-lg ${
                    selectedApplication.stage === 'ACCEPTED'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <CheckCircle className={`w-5 h-5 ${
                      selectedApplication.stage === 'ACCEPTED'
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <p className={`font-medium ${
                        selectedApplication.stage === 'ACCEPTED'
                          ? 'text-green-800'
                          : 'text-gray-600'
                      }`}>Application Decision</p>
                      <p className={`text-sm ${
                        selectedApplication.stage === 'ACCEPTED'
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`}>
                        {selectedApplication.stage === 'ACCEPTED'
                          ? 'Congratulations! Application approved'
                          : 'Pending review completion'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="font-semibold mb-3">Documents ({selectedApplication.documents.length})</h3>
                <div className="space-y-2">
                  {selectedApplication.documents.length > 0 ? (
                    selectedApplication.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded: {doc.uploadDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getDocumentStatusColor(doc.status)}`}>
                          {doc.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No documents uploaded yet</p>
                  )}
                </div>
              </div>

              {/* Requirements Section */}
              <div>
                <h3 className="font-semibold mb-3">Requirements ({selectedApplication.requirements.length})</h3>
                <div className="space-y-2">
                  {selectedApplication.requirements.map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{req.name}</p>
                        <p className="text-sm text-muted-foreground">{req.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {req.mandatory && <Badge variant="destructive">Required</Badge>}
                        {selectedApplication.documents.some(doc => doc.requirementId === req.id) ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default YourApplications;
