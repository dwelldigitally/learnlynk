import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, User, GraduationCap, Briefcase, FileText, HelpCircle, Upload, CreditCard, Send } from "lucide-react";
import { ApplicationData } from "@/services/applicationService";

interface ReviewSubmitStepProps {
  data: ApplicationData;
  onSubmit: () => void;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ data, onSubmit }) => {
  const applicationData = data.application_data || {};

  const getCompletionStatus = (stepId: string) => {
    const stepData = applicationData[stepId];
    
    switch (stepId) {
      case 'personal_info':
        return stepData?.firstName && stepData?.lastName && stepData?.email;
      case 'education':
        return stepData?.institutions && stepData.institutions.length > 0;
      case 'work_experience':
        return true; // Optional step
      case 'essays':
        return stepData?.essays && stepData.essays.length > 0;
      case 'questions':
        return stepData?.responses && Object.keys(stepData.responses).length > 0;
      case 'documents':
        return stepData?.documents && stepData.documents.length > 0;
      case 'payment':
        return stepData?.paymentCompleted;
      default:
        return false;
    }
  };

  const steps = [
    { id: 'personal_info', title: 'Personal Information', icon: User },
    { id: 'education', title: 'Education Background', icon: GraduationCap },
    { id: 'work_experience', title: 'Work Experience', icon: Briefcase },
    { id: 'essays', title: 'Essays', icon: FileText },
    { id: 'questions', title: 'Program Questions', icon: HelpCircle },
    { id: 'documents', title: 'Documents', icon: Upload },
    { id: 'payment', title: 'Payment', icon: CreditCard }
  ];

  const completedSteps = steps.filter(step => getCompletionStatus(step.id));
  const requiredSteps = steps.filter(step => step.id !== 'work_experience'); // Work experience is optional
  const allRequiredCompleted = requiredSteps.every(step => getCompletionStatus(step.id));

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Not provided';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  const renderPersonalInfo = () => {
    const personalInfo = applicationData.personal_info || {};
    return (
      <Card className="p-4">
        <h6 className="font-semibold mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          Personal Information
        </h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</div>
          <div><strong>Email:</strong> {personalInfo.email}</div>
          <div><strong>Phone:</strong> {personalInfo.phone || 'Not provided'}</div>
          <div><strong>Date of Birth:</strong> {formatDate(personalInfo.dateOfBirth)}</div>
          <div><strong>Nationality:</strong> {personalInfo.nationality || 'Not provided'}</div>
          <div><strong>Country of Residence:</strong> {personalInfo.countryOfResidence || 'Not provided'}</div>
        </div>
      </Card>
    );
  };

  const renderEducation = () => {
    const education = applicationData.education || {};
    const institutions = education.institutions || [];
    
    return (
      <Card className="p-4">
        <h6 className="font-semibold mb-3 flex items-center gap-2">
          <GraduationCap className="w-4 h-4" />
          Education Background ({institutions.length} institution{institutions.length !== 1 ? 's' : ''})
        </h6>
        {institutions.length > 0 ? (
          <div className="space-y-3">
            {institutions.slice(0, 2).map((inst: any, index: number) => (
              <div key={index} className="text-sm border-l-2 border-l-primary pl-3">
                <div className="font-medium">{inst.institutionName}</div>
                <div className="text-muted-foreground">{inst.degree} in {inst.fieldOfStudy}</div>
                <div className="text-muted-foreground">
                  {inst.gpa && `GPA: ${inst.gpa}${inst.maxGpa ? `/${inst.maxGpa}` : ''}`}
                  {inst.graduationDate && ` • Graduated: ${formatDate(inst.graduationDate)}`}
                </div>
              </div>
            ))}
            {institutions.length > 2 && (
              <div className="text-sm text-muted-foreground">
                ... and {institutions.length - 2} more institution{institutions.length - 2 !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No education history provided</p>
        )}
      </Card>
    );
  };

  const renderExperience = () => {
    const experience = applicationData.work_experience || {};
    const experiences = experience.experiences || [];
    
    return (
      <Card className="p-4">
        <h6 className="font-semibold mb-3 flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Work Experience ({experiences.length} experience{experiences.length !== 1 ? 's' : ''})
        </h6>
        {experiences.length > 0 ? (
          <div className="space-y-3">
            {experiences.slice(0, 2).map((exp: any, index: number) => (
              <div key={index} className="text-sm border-l-2 border-l-primary pl-3">
                <div className="font-medium">{exp.position} at {exp.organization}</div>
                <div className="text-muted-foreground capitalize">{exp.type} Experience</div>
                <div className="text-muted-foreground">
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </div>
              </div>
            ))}
            {experiences.length > 2 && (
              <div className="text-sm text-muted-foreground">
                ... and {experiences.length - 2} more experience{experiences.length - 2 !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No work experience provided</p>
        )}
      </Card>
    );
  };

  const renderEssays = () => {
    const essays = applicationData.essays?.essays || [];
    
    return (
      <Card className="p-4">
        <h6 className="font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Essays & Personal Statements ({essays.length} essay{essays.length !== 1 ? 's' : ''})
        </h6>
        {essays.length > 0 ? (
          <div className="space-y-3">
            {essays.map((essay: any, index: number) => (
              <div key={index} className="text-sm border-l-2 border-l-primary pl-3">
                <div className="font-medium">{essay.title}</div>
                <div className="text-muted-foreground capitalize">{essay.type.replace('_', ' ')}</div>
                <div className="text-muted-foreground">{essay.wordCount} words</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No essays provided</p>
        )}
      </Card>
    );
  };

  const renderQuestions = () => {
    const responses = applicationData.questions?.responses || {};
    const responseCount = Object.keys(responses).length;
    
    return (
      <Card className="p-4">
        <h6 className="font-semibold mb-3 flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Program Questions ({responseCount} answer{responseCount !== 1 ? 's' : ''})
        </h6>
        {responseCount > 0 ? (
          <div className="text-sm text-muted-foreground">
            Answered {responseCount} program-specific questions covering motivation, academic background, and career goals.
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No questions answered</p>
        )}
      </Card>
    );
  };

  const renderDocuments = () => {
    const documents = applicationData.documents?.documents || [];
    
    return (
      <Card className="p-4">
        <h6 className="font-semibold mb-3 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Documents ({documents.length} uploaded)
        </h6>
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.slice(0, 3).map((doc: any, index: number) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{doc.fileName}</span>
                <Badge className={
                  doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                  doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }>
                  {doc.status}
                </Badge>
              </div>
            ))}
            {documents.length > 3 && (
              <div className="text-sm text-muted-foreground">
                ... and {documents.length - 3} more document{documents.length - 3 !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No documents uploaded</p>
        )}
      </Card>
    );
  };

  const renderPayment = () => {
    const payment = applicationData.payment || {};
    
    return (
      <Card className="p-4">
        <h6 className="font-semibold mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Payment Status
        </h6>
        {payment.paymentCompleted ? (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-green-700">Payment completed successfully</span>
            </div>
            <div><strong>Amount:</strong> ${payment.amount} {payment.currency}</div>
            <div><strong>Transaction ID:</strong> {payment.transactionId}</div>
            <div><strong>Date:</strong> {formatDate(payment.paymentDate)}</div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700">Payment not completed</span>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Application Summary */}
      <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
        <h4 className="text-xl font-bold mb-2">Application Review & Submission</h4>
        <p className="text-muted-foreground mb-4">
          Please review all sections of your application before submitting. 
          Once submitted, you will not be able to make changes.
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Completion Status</p>
            <p className="text-lg font-semibold">
              {completedSteps.length} of {steps.length} sections completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Program</p>
            <p className="text-lg font-semibold">{data.program_name || 'Not specified'}</p>
          </div>
        </div>
      </Card>

      {/* Completion Checklist */}
      <Card className="p-6">
        <h5 className="text-lg font-semibold mb-4">Application Checklist</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {steps.map((step) => {
            const isCompleted = getCompletionStatus(step.id);
            const isRequired = step.id !== 'work_experience';
            
            return (
              <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                )}
                <step.icon className="w-4 h-4 text-muted-foreground" />
                <span className={`flex-1 ${isCompleted ? 'text-green-700' : 'text-orange-700'}`}>
                  {step.title}
                </span>
                {isRequired && !isCompleted && (
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                )}
                {!isRequired && (
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Application Details */}
      <div className="space-y-4">
        <h5 className="text-lg font-semibold">Application Details</h5>
        
        {renderPersonalInfo()}
        {renderEducation()}
        {renderExperience()}
        {renderEssays()}
        {renderQuestions()}
        {renderDocuments()}
        {renderPayment()}
      </div>

      {/* Warning for incomplete sections */}
      {!allRequiredCompleted && (
        <Card className="p-6 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h6 className="font-semibold text-orange-900 mb-2">Incomplete Required Sections</h6>
              <p className="text-sm text-orange-800 mb-3">
                Please complete all required sections before submitting your application.
              </p>
              <div className="space-y-1">
                {requiredSteps.filter(step => !getCompletionStatus(step.id)).map(step => (
                  <div key={step.id} className="text-sm text-orange-700">
                    • {step.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Terms and Conditions */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h6 className="font-semibold text-blue-900 mb-2">Terms and Conditions</h6>
        <div className="text-sm text-blue-800 space-y-2">
          <p>By submitting this application, you acknowledge that:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>All information provided is true and accurate to the best of your knowledge</li>
            <li>You understand that false information may result in application rejection</li>
            <li>Application fees are non-refundable</li>
            <li>Processing time may vary depending on program and application volume</li>
            <li>You will be notified of the admission decision via email</li>
          </ul>
        </div>
      </Card>

      {/* Submission Button */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div>
            <h6 className="font-semibold mb-2">Ready to Submit?</h6>
            <p className="text-sm text-muted-foreground">
              Once you submit your application, you will receive a confirmation email 
              and will be able to track your application status in the portal.
            </p>
          </div>
          
          <Button
            onClick={onSubmit}
            disabled={!allRequiredCompleted}
            size="lg"
            className="w-full md:w-auto px-8"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Application
          </Button>
          
          {!allRequiredCompleted && (
            <p className="text-sm text-destructive">
              Complete all required sections to enable submission
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReviewSubmitStep;